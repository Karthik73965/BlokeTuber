import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { projectsStore, clipsStore, jobsStore, chaptersStore, UsedMediaItem } from '../db/localStore';
import { assembleAudio } from '../services/audioAssembly';
import { alignAudio } from '../services/whisperAlignment';
import { detectNumberCallouts } from '../services/clipMatcher';
import {
  findStockFootage,
  downloadStockVideo,
  findStockPhoto,
  downloadStockPhoto,
  searchAlternativeStock,
} from '../services/stockFootage';
import { planScriptWithAI, mapPlannedBeatsToTiming } from '../services/aiScriptPlanner';
import { generateDocumentaryImage } from '../services/aiImageGenerator';
import { buildTimeline, TimedPlannedBeat } from '../services/timelineBuilder';
import { renderTimelineVideo } from '../services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

export const pipelineRouter = Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
const AUDIO_DIR = path.join(UPLOAD_DIR, 'audio');
const OUTPUT_DIR = process.env.OUTPUT_DIR || path.join(process.cwd(), 'output');

fs.mkdirSync(AUDIO_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const audioUpload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, AUDIO_DIR),
    filename: (_req, file, cb) => cb(null, file.originalname),
  }),
  limits: { fileSize: 200 * 1024 * 1024 },
});

// ── POST /api/pipeline/start ──────────────────────────────────────────────────
// Accepts: projectId, voiceover files, clipLibraryRoot (path to local clip folder)
pipelineRouter.post(
  '/start',
  audioUpload.array('voiceovers', 50),
  (req: Request, res: Response) => {
    const jobId = uuidv4();
    const { projectId, clipLibraryRoot } = req.body;

    if (!projectId || !clipLibraryRoot) {
      return res.status(400).json({ error: 'projectId and clipLibraryRoot are required' });
    }

    const project = projectsStore.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const voiceoverFiles = (req.files as Express.Multer.File[])
      .sort((a, b) => a.originalname.localeCompare(b.originalname))
      .map((f) => f.path);

    if (!voiceoverFiles.length) {
      return res.status(400).json({ error: 'No voiceover files uploaded' });
    }

    // Create job record locally
    jobsStore.create({
      id: jobId,
      projectId,
      status: 'running',
      step: 'audio_assembly',
    });

    res.json({ jobId, message: 'Pipeline started' });

    // Run async — errors are caught and written to local job record
    runPipeline({ jobId, project, voiceoverFiles, clipLibraryRoot }).catch((err) => {
      console.error(`[Pipeline ${jobId}] Fatal error:`, err);
      jobsStore.update(jobId, {
        status: 'error',
        errorMessage: String(err),
      });
    });
  }
);

function generateJobFolderName(projectName: string, jobId: string): string {
  const safeName = (projectName || 'project')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 35);

  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  const shortId = jobId.slice(0, 6);

  return `${safeName || 'project'}_${timeStr}_${shortId}`;
}

// ── GET /api/pipeline/status/:jobId ──────────────────────────────────────────
pipelineRouter.get('/status/:jobId', (req: Request, res: Response) => {
  const job = jobsStore.findById(req.params.jobId!);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json({ ...job, job });
});

function formatTimelineForBrowser(timeline: Timeline, req: Request): Timeline {
  const protocol = req.protocol || 'http';
  const host = req.get('host') || 'localhost:3001';
  const baseUrl = `${protocol}://${host}/api/pipeline/media?file=`;

  const toBrowserUrl = (raw: string | null | undefined): string | null => {
    if (!raw) return null;
    if (raw.startsWith('http://') || raw.startsWith('https://') || raw.startsWith('data:')) {
      return raw;
    }
    return `${baseUrl}${encodeURIComponent(raw.replace(/\\/g, '/'))}`;
  };

  return {
    ...timeline,
    masterAudioPath: toBrowserUrl(timeline.masterAudioPath) || '',
    clips: (timeline.clips || []).map((clip) => ({
      ...clip,
      clipPath: toBrowserUrl(clip.clipPath),
      secondaryClipPath: toBrowserUrl(clip.secondaryClipPath),
      additionalClipPaths: (clip.additionalClipPaths || [])
        .map((p) => toBrowserUrl(p))
        .filter(Boolean) as string[],
    })),
  };
}

// ── GET /api/pipeline/media ──────────────────────────────────────────────────
// Streams local media (MP4, MP3, JPG, PNG) to the browser Remotion Player
pipelineRouter.get('/media', (req: Request, res: Response) => {
  const file = req.query.file as string;
  if (!file) return res.status(400).send('Missing file parameter');

  let target = file;
  if (target.startsWith('file:///')) {
    try {
      target = new URL(target).pathname.replace(/^\/([a-zA-Z]:)/, '$1');
    } catch {
      target = target.replace('file:///', '').replace('file://', '');
    }
  }

  target = path.resolve(target);
  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    return res.status(404).send('File not found');
  }

  const stat = fs.statSync(target);
  const ext = path.extname(target).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
  };
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  const range = req.headers.range;
  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0] || '0', 10);
    const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
    const chunksize = end - start + 1;
    const stream = fs.createReadStream(target, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${stat.size}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': contentType,
    });
    stream.pipe(res);
  } else {
    res.writeHead(200, {
      'Content-Length': stat.size,
      'Content-Type': contentType,
      'Accept-Ranges': 'bytes',
    });
    fs.createReadStream(target).pipe(res);
  }
});

// ── GET /api/pipeline/timeline/:jobId ────────────────────────────────────────
pipelineRouter.get('/timeline/:jobId', (req: Request, res: Response) => {
  const job = jobsStore.findById(req.params.jobId!);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (!job.timelineJson) return res.status(404).json({ error: 'Timeline not ready yet' });
  res.json({ timeline: formatTimelineForBrowser(job.timelineJson as unknown as Timeline, req) });
});

// ── GET /api/pipeline/video/:jobId ───────────────────────────────────────────
pipelineRouter.get('/video/:jobId', (req: Request, res: Response) => {
  const job = jobsStore.findById(req.params.jobId!);
  if (!job) return res.status(404).json({ error: 'Job not found' });

  let videoPath = job.outputPath;
  if (videoPath && videoPath.endsWith('.json')) {
    videoPath = path.join(path.dirname(videoPath), 'final_video.mp4');
  }

  if (!videoPath || !fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Rendered video file not ready yet' });
  }

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', `inline; filename="${path.basename(videoPath)}"`);
  fs.createReadStream(videoPath).pipe(res);
});

// ── GET /api/pipeline/chapter-timeline/:projectId/:chapterId ─────────────────
pipelineRouter.get('/chapter-timeline/:projectId/:chapterId', (req: Request, res: Response) => {
  const projectId = req.params.projectId!;
  const chapterId = req.params.chapterId!;
  const chapter = chaptersStore.findById(projectId, chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  let timeline: any = chapter.timelineJson;
  if (!timeline && chapter.jobId) {
    const job = jobsStore.findById(chapter.jobId);
    if (job?.timelineJson) {
      timeline = job.timelineJson;
    }
  }

  if (!timeline) {
    return res.json({ timeline: null });
  }

  res.json({ timeline: formatTimelineForBrowser(timeline as unknown as Timeline, req) });
});

// ── GET /api/pipeline/chapter-video/:projectId/:chapterId ────────────────────
pipelineRouter.get('/chapter-video/:projectId/:chapterId', (req: Request, res: Response) => {
  const projectId = req.params.projectId!;
  const chapterId = req.params.chapterId!;
  const chapter = chaptersStore.findById(projectId, chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  let videoPath = chapter.videoPath;
  if (!videoPath && chapter.jobId) {
    const job = jobsStore.findById(chapter.jobId);
    if (job?.outputPath) {
      videoPath = job.outputPath.endsWith('.json')
        ? path.join(path.dirname(job.outputPath), 'final_video.mp4')
        : job.outputPath;
    }
  }

  if (!videoPath || !fs.existsSync(videoPath)) {
    return res.status(404).json({ error: 'Chapter video not rendered yet' });
  }

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', `inline; filename="chapter_${chapter.chapterIndex}.mp4"`);
  fs.createReadStream(videoPath).pipe(res);
});

// ── GET /api/pipeline/search-stock ───────────────────────────────────────────
// Search alternative stock videos or photos on-the-fly for clip swapping
pipelineRouter.get('/search-stock', async (req: Request, res: Response) => {
  const query = (req.query.query as string) || '';
  const mediaType = ((req.query.mediaType as string) || 'video') as 'video' | 'image';
  if (!query.trim()) return res.json({ results: [] });

  try {
    const results = await searchAlternativeStock(query, mediaType, 8);
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ── GET /api/pipeline/local-clips ────────────────────────────────────────────
// Lists all .mp4/.mov files in a given server-side folder for the swap modal
pipelineRouter.get('/local-clips', (req: Request, res: Response) => {
  const folder = (req.query.folder as string) || '';
  if (!folder.trim()) return res.json({ clips: [] });

  try {
    if (!fs.existsSync(folder)) {
      return res.status(404).json({ error: `Folder not found: ${folder}` });
    }
    const files = fs.readdirSync(folder).filter((f) => /\.(mp4|mov|webm|mkv|avi|m4v|jpg|jpeg|png|webp)$/i.test(f));
    const clips = files.map((filename) => ({
      filename,
      // Serve via a new /local-clip-file endpoint
      url: `/api/pipeline/local-clip-file?folder=${encodeURIComponent(folder)}&file=${encodeURIComponent(filename)}`,
      localPath: path.join(folder, filename),
    }));
    res.json({ clips });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ── GET /api/pipeline/local-clip-file ─────────────────────────────────────────
// Streams a specific local clip file to the browser for preview & swap
pipelineRouter.get('/local-clip-file', (req: Request, res: Response) => {
  const folder = (req.query.folder as string) || '';
  const file = (req.query.file as string) || '';
  if (!folder || !file) return res.status(400).json({ error: 'folder and file are required' });

  // Security: only allow reading files that are inside the requested folder (no path traversal)
  const safePath = path.resolve(folder, path.basename(file));
  if (!safePath.startsWith(path.resolve(folder))) {
    return res.status(403).json({ error: 'Path traversal not allowed' });
  }

  if (!fs.existsSync(safePath)) {
    return res.status(404).json({ error: 'File not found' });
  }

  const ext = path.extname(file).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.mp4': 'video/mp4',
    '.mov': 'video/quicktime',
    '.webm': 'video/webm',
    '.mkv': 'video/x-matroska',
    '.avi': 'video/x-msvideo',
    '.m4v': 'video/mp4',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
  };
  const mime = mimeTypes[ext] || 'video/mp4';

  const stat = fs.statSync(safePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0]!, 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const fileStream = fs.createReadStream(safePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': mime,
    });
    fileStream.pipe(res);
  } else {
    res.writeHead(200, { 'Content-Length': fileSize, 'Content-Type': mime });
    fs.createReadStream(safePath).pipe(res);
  }
});

// ── POST /api/pipeline/generate-image ──────────────────────────────────────────
// Generates a custom documentary image on demand using OpenRouter
pipelineRouter.post('/generate-image', async (req: Request, res: Response) => {
  try {
    const { projectId, prompt, visualSubject, text, negativeKeywords, chapterId } = req.body;
    const project = projectId ? projectsStore.findById(projectId) : null;
    const chapter = projectId && chapterId ? chaptersStore.findById(projectId, chapterId) : null;
    const tempFile = path.join(OUTPUT_DIR, `manual_gen_${Date.now()}.png`);

    const result = await generateDocumentaryImage({
      visualSubject: visualSubject || prompt,
      text: text || prompt || '',
      projectContext: project?.description || project?.scriptText?.slice(0, 300) || '',
      chapterContext: chapter?.description || '',
      negativeKeywords,
      outputPath: tempFile,
    });

    if (!result.success || !result.outputPath) {
      return res.status(500).json({ error: result.error || 'Image generation failed' });
    }

    res.json({
      success: true,
      imagePath: result.outputPath,
      source: 'ai_generated',
      prompt: result.prompt,
      cost: result.cost,
    });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

// ── POST /api/pipeline/swap-clip ─────────────────────────────────────────────
// Instantly replaces a stock clip/image inside a chapter's staged timeline
pipelineRouter.post('/swap-clip', async (req: Request, res: Response) => {
  try {
    const { projectId, chapterId, clipIndex, slotIndex, mediaUrl, mediaType, stockSource, isLocalClip } = req.body;
    if (!projectId || !chapterId || typeof clipIndex !== 'number' || !mediaUrl) {
      return res.status(400).json({ error: 'Missing required parameters (projectId, chapterId, clipIndex, mediaUrl)' });
    }

    const project = projectsStore.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const chapter = chaptersStore.findById(projectId, chapterId);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    // Locate timeline
    let timeline: Timeline | null = null;
    let timelineDiskPath: string | null = null;

    if (chapter.jobId) {
      const job = jobsStore.findById(chapter.jobId);
      if (job?.timelineJson) {
        timeline = job.timelineJson as Timeline;
      }
    }

    if (!timeline && chapter.videoPath) {
      timelineDiskPath = path.join(path.dirname(chapter.videoPath), 'timeline.json');
      if (fs.existsSync(timelineDiskPath)) {
        timeline = JSON.parse(fs.readFileSync(timelineDiskPath, 'utf-8'));
      }
    }

    if (!timeline && chapter.timelineJson) {
      timeline = chapter.timelineJson as Timeline;
    }

    if (!timeline) {
      return res.status(404).json({ error: 'No active timeline found for this chapter' });
    }

    if (!timeline.clips || !timeline.clips[clipIndex]) {
      return res.status(400).json({ error: `Clip at index ${clipIndex} not found in timeline` });
    }

    // Determine target directory
    const folderName = generateJobFolderName(project.name, chapter.jobId || `swap_${chapter.id}`);
    const jobOutputDir = timelineDiskPath ? path.dirname(timelineDiskPath) : path.join(OUTPUT_DIR, folderName);
    const stockDir = path.join(jobOutputDir, 'stock');
    fs.mkdirSync(stockDir, { recursive: true });

    const ext = mediaType === 'image' ? 'jpg' : 'mp4';
    const destPath = path.join(
      stockDir,
      `swap_beat_${clipIndex}_slot_${slotIndex ?? 'main'}_${Date.now()}.${ext}`
    );

    // Download OR copy chosen asset
    if (isLocalClip && mediaUrl) {
      // mediaUrl is the local absolute path for local clip swaps
      const srcPath = mediaUrl;
      if (!fs.existsSync(srcPath)) {
        return res.status(404).json({ error: `Local clip not found: ${srcPath}` });
      }
      fs.copyFileSync(srcPath, destPath);
    } else if (mediaType === 'image') {
      await downloadStockPhoto(
        {
          source: stockSource || 'pexels',
          url: mediaUrl,
          previewUrl: mediaUrl,
          title: 'swap',
          width: 1920,
          height: 1080,
        },
        destPath
      );
    } else {
      await downloadStockVideo(
        {
          source: stockSource || 'pexels',
          url: mediaUrl,
          previewUrl: mediaUrl,
          title: 'swap',
          width: 1920,
          height: 1080,
        },
        destPath
      );
    }

    // Update clip in timeline
    if (typeof slotIndex === 'number' && slotIndex > 0) {
      const additional = timeline.clips[clipIndex]!.additionalClipPaths || [];
      additional[slotIndex - 1] = destPath;
      timeline.clips[clipIndex]!.additionalClipPaths = additional;
    } else {
      timeline.clips[clipIndex]!.clipPath = destPath;
      timeline.clips[clipIndex]!.mediaType = mediaType;
    }

    // Persist timeline
    const finalTimelinePath = timelineDiskPath || path.join(jobOutputDir, 'timeline.json');
    fs.writeFileSync(finalTimelinePath, JSON.stringify(timeline, null, 2));

    if (chapter.jobId) {
      jobsStore.update(chapter.jobId, { timelineJson: timeline, outputPath: finalTimelinePath });
    }
    chaptersStore.update(projectId, chapterId, { timelineJson: timeline });

    // Track used media
    projectsStore.addUsedMedia(projectId, [
      {
        id: mediaUrl,
        url: mediaUrl,
        source: stockSource || 'pexels',
        mediaType: mediaType || 'video',
        chapterIndex: chapter.chapterIndex,
        query: 'user_swap',
        usedAt: new Date().toISOString(),
      },
    ]);

    res.json({ success: true, timeline: formatTimelineForBrowser(timeline, req) });
  } catch (err) {
    res.status(500).json({ error: `Failed to swap clip: ${String(err)}` });
  }
});

// ── POST /api/pipeline/update-clip ──────────────────────────────────────────
// Update clip customization (layout, layoutData, callout, overlay, transition)
pipelineRouter.post('/update-clip', async (req: Request, res: Response) => {
  try {
    const { projectId, chapterId, clipIndex, layout, layoutData, callout, overlay, transitionType } = req.body;
    if (!projectId || !chapterId || typeof clipIndex !== 'number') {
      return res.status(400).json({ error: 'Missing required parameters (projectId, chapterId, clipIndex)' });
    }

    const project = projectsStore.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const chapter = chaptersStore.findById(projectId, chapterId);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    // Locate timeline
    let timeline: Timeline | null = null;
    let timelineDiskPath: string | null = null;

    if (chapter.jobId) {
      const job = jobsStore.findById(chapter.jobId);
      if (job?.timelineJson) {
        timeline = job.timelineJson as Timeline;
      }
    }

    if (!timeline && chapter.videoPath) {
      timelineDiskPath = path.join(path.dirname(chapter.videoPath), 'timeline.json');
      if (fs.existsSync(timelineDiskPath)) {
        timeline = JSON.parse(fs.readFileSync(timelineDiskPath, 'utf-8'));
      }
    }

    if (!timeline && chapter.timelineJson) {
      timeline = chapter.timelineJson as Timeline;
    }

    if (!timeline || !timeline.clips || !timeline.clips[clipIndex]) {
      return res.status(404).json({ error: `Clip at index ${clipIndex} not found in timeline` });
    }

    const clip = timeline.clips[clipIndex]!;

    if (layout !== undefined) clip.layout = layout;
    if (layoutData !== undefined) clip.layoutData = layoutData;
    if (callout !== undefined) clip.callout = callout;
    if (overlay !== undefined) clip.overlay = overlay;
    if (transitionType !== undefined) clip.transitionType = transitionType;

    // Persist timeline
    const folderName = generateJobFolderName(project.name, chapter.jobId || `edit_${chapter.id}`);
    const jobOutputDir = timelineDiskPath ? path.dirname(timelineDiskPath) : path.join(OUTPUT_DIR, folderName);
    fs.mkdirSync(jobOutputDir, { recursive: true });
    const diskPath = timelineDiskPath || path.join(jobOutputDir, 'timeline.json');
    fs.writeFileSync(diskPath, JSON.stringify(timeline, null, 2));

    if (chapter.jobId) {
      jobsStore.update(chapter.jobId, { timelineJson: timeline, outputPath: diskPath });
    }
    chaptersStore.update(projectId, chapterId, { timelineJson: timeline });

    res.json({ success: true, timeline: formatTimelineForBrowser(timeline, req) });
  } catch (err) {
    res.status(500).json({ error: `Failed to update clip: ${String(err)}` });
  }
});

// ── POST /api/pipeline/split-clip ───────────────────────────────────────────
// Splits a clip into two synchronized sub-beats at midpoint
pipelineRouter.post('/split-clip', async (req: Request, res: Response) => {
  try {
    const { projectId, chapterId, clipIndex, splitRatio } = req.body;
    if (!projectId || !chapterId || typeof clipIndex !== 'number') {
      return res.status(400).json({ error: 'Missing required parameters (projectId, chapterId, clipIndex)' });
    }

    const project = projectsStore.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    const chapter = chaptersStore.findById(projectId, chapterId);
    if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

    // Locate timeline
    let timeline: Timeline | null = null;
    let timelineDiskPath: string | null = null;

    if (chapter.jobId) {
      const job = jobsStore.findById(chapter.jobId);
      if (job?.timelineJson) {
        timeline = job.timelineJson as Timeline;
      }
    }

    if (!timeline && chapter.videoPath) {
      timelineDiskPath = path.join(path.dirname(chapter.videoPath), 'timeline.json');
      if (fs.existsSync(timelineDiskPath)) {
        timeline = JSON.parse(fs.readFileSync(timelineDiskPath, 'utf-8'));
      }
    }

    if (!timeline && chapter.timelineJson) {
      timeline = chapter.timelineJson as Timeline;
    }

    if (!timeline || !timeline.clips || !timeline.clips[clipIndex]) {
      return res.status(404).json({ error: `Clip at index ${clipIndex} not found in timeline` });
    }

    const targetClip = timeline.clips[clipIndex]!;
    const clipDuration = targetClip.endTime - targetClip.startTime;
    if (clipDuration < 1.5) {
      return res.status(400).json({ error: `Cannot split clip shorter than 1.5s (current duration: ${clipDuration.toFixed(1)}s)` });
    }

    const ratio = typeof splitRatio === 'number' && splitRatio > 0.1 && splitRatio < 0.9 ? splitRatio : 0.5;
    const splitTime = Number((targetClip.startTime + clipDuration * ratio).toFixed(2));

    // Split words
    const words = (targetClip.text || '').trim().split(/\s+/).filter(Boolean);
    const midWordIdx = Math.max(1, Math.floor(words.length * ratio));
    const firstHalfWords = words.slice(0, midWordIdx).join(' ');
    const secondHalfWords = words.slice(midWordIdx).join(' ') || firstHalfWords;

    const originalEndTime = targetClip.endTime;

    // Update first clip
    targetClip.endTime = splitTime;
    targetClip.text = firstHalfWords;

    // Create second clip
    const newClip: TimelineClip = {
      beatIndex: clipIndex + 1,
      chapterIndex: targetClip.chapterIndex,
      text: secondHalfWords,
      startTime: splitTime,
      endTime: originalEndTime,
      clipPath: targetClip.clipPath,
      mediaType: targetClip.mediaType,
      stockVideoQuery: targetClip.backupVideoQuery || targetClip.stockVideoQuery || null,
      backupVideoQuery: null,
      stockPhotoQuery: targetClip.stockPhotoQuery || null,
      kenBurns: targetClip.kenBurns,
      transitionType: 'shutter_flash', // Punchy documentary cut between split beats
      transitionDuration: 0.2,
      numberOverlays: [],
      layout: targetClip.layout === 'full_bleed_cinematic' ? 'ambient_blur_frame' : 'full_bleed_cinematic',
      layoutData: undefined,
      callout: null,
      overlay: targetClip.overlay === 'film_dust_scratches' ? 'film_burn_light_leak' : 'film_dust_scratches',
    };

    // Insert new clip right after target clip
    timeline.clips.splice(clipIndex + 1, 0, newClip);

    // Re-index all clips sequentially
    timeline.clips.forEach((c, idx) => {
      c.beatIndex = idx;
    });

    // Persist timeline
    const folderName = generateJobFolderName(project.name, chapter.jobId || `split_${chapter.id}`);
    const jobOutputDir = timelineDiskPath ? path.dirname(timelineDiskPath) : path.join(OUTPUT_DIR, folderName);
    fs.mkdirSync(jobOutputDir, { recursive: true });
    const diskPath = timelineDiskPath || path.join(jobOutputDir, 'timeline.json');
    fs.writeFileSync(diskPath, JSON.stringify(timeline, null, 2));

    if (chapter.jobId) {
      jobsStore.update(chapter.jobId, { timelineJson: timeline, outputPath: diskPath });
    }
    chaptersStore.update(projectId, chapterId, { timelineJson: timeline });

    res.json({ success: true, timeline: formatTimelineForBrowser(timeline, req) });
  } catch (err) {
    res.status(500).json({ error: `Failed to split clip: ${String(err)}` });
  }
});

// ── POST /api/pipeline/plan-storyboard ───────────────────────────────────────
// Stage 1: Plans beats, fetches stock, builds staged timeline, and returns for review WITHOUT rendering MP4
pipelineRouter.post(
  '/plan-storyboard',
  audioUpload.array('voiceovers', 50),
  async (req: Request, res: Response) => {
    const jobId = uuidv4();
    const { projectId, chapterId, scriptText, clipLibraryRoot, pacing } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const project = projectsStore.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    let chapter = chapterId ? chaptersStore.findById(projectId, chapterId) : null;
    if (!chapter) {
      chapter = chaptersStore.create(projectId, {
        scriptText: scriptText || '',
        pacing: pacing || 'medium',
        clipLibraryRoot: clipLibraryRoot || '',
        status: 'processing',
      });
    }

    let resolvedAudioFiles = (req.files as Express.Multer.File[])
      .sort((a, b) => a.originalname.localeCompare(b.originalname))
      .map((f) => f.path);

    if (!resolvedAudioFiles.length && chapter?.voiceoverFileName) {
      const candidates = [
        path.join(AUDIO_DIR, chapter.voiceoverFileName),
        path.join('C:\\Users\\karth\\Videos\\AmericanHideaways\\Kloehn\\AUD', chapter.voiceoverFileName),
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          resolvedAudioFiles = [cand];
          break;
        }
      }
    }

    if (!resolvedAudioFiles.length) {
      return res.status(400).json({ error: 'No voiceover files found or uploaded' });
    }

    if (chapter) {
      chaptersStore.update(projectId, chapter.id, {
        status: 'processing',
        jobId,
        scriptText: scriptText || chapter.scriptText,
        voiceoverFileName: chapter.voiceoverFileName || path.basename(resolvedAudioFiles[0]!),
        pacing: pacing || chapter.pacing || 'medium',
        clipLibraryRoot: clipLibraryRoot || chapter.clipLibraryRoot || '',
      });
    }

    jobsStore.create({
      id: jobId,
      projectId,
      chapterId: chapter?.id,
      chapterIndex: chapter?.chapterIndex,
      status: 'running',
      step: 'audio_assembly',
    });

    res.json({ jobId, chapterId: chapter?.id, message: 'Visual Storyboard generation started' });

    runPipeline({
      jobId,
      project: { id: project.id, name: project.name, scriptText: scriptText || chapter?.scriptText || project.scriptText },
      chapterId: chapter?.id,
      chapterIndex: chapter?.chapterIndex || 1,
      voiceoverFiles: resolvedAudioFiles,
      clipLibraryRoot: clipLibraryRoot || chapter?.clipLibraryRoot || '',
      pacing: pacing || chapter?.pacing || 'medium',
      skipRender: true, // Only stage storyboard!
    }).catch((err) => {
      console.error(`[Storyboard Chapter ${jobId}] Fatal error:`, err);
      jobsStore.update(jobId, { status: 'error', errorMessage: String(err) });
      if (chapter) {
        chaptersStore.update(projectId, chapter.id, { status: 'error' });
      }
    });
  }
);

// ── POST /api/pipeline/render-storyboard ────────────────────────────────────
// Stage 2: Takes approved staged timeline and renders full MP4 video
pipelineRouter.post('/render-storyboard', async (req: Request, res: Response) => {
  const { projectId, chapterId } = req.body;
  if (!projectId || !chapterId) {
    return res.status(400).json({ error: 'projectId and chapterId are required' });
  }

  const project = projectsStore.findById(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const chapter = chaptersStore.findById(projectId, chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  let timeline: Timeline | null = null;
  let timelineDiskPath: string | null = null;

  if (chapter.jobId) {
    const job = jobsStore.findById(chapter.jobId);
    if (job?.timelineJson) {
      timeline = job.timelineJson as Timeline;
      if (job.outputPath && job.outputPath.endsWith('.json')) {
        timelineDiskPath = job.outputPath;
      }
    }
  }

  if (!timeline && chapter.videoPath) {
    timelineDiskPath = path.join(path.dirname(chapter.videoPath), 'timeline.json');
    if (fs.existsSync(timelineDiskPath)) {
      timeline = JSON.parse(fs.readFileSync(timelineDiskPath, 'utf-8'));
    }
  }

  if (!timeline) {
    return res.status(404).json({ error: 'No staged storyboard timeline found to render' });
  }

  const renderJobId = uuidv4();
  const folderName = generateJobFolderName(project.name, renderJobId);
  const jobOutputDir = timelineDiskPath ? path.dirname(timelineDiskPath) : path.join(OUTPUT_DIR, folderName);
  fs.mkdirSync(jobOutputDir, { recursive: true });

  const finalVideoPath = path.join(jobOutputDir, 'final_video.mp4');
  const finalTimelineJsonPath = timelineDiskPath || path.join(jobOutputDir, 'timeline.json');
  fs.writeFileSync(finalTimelineJsonPath, JSON.stringify(timeline, null, 2));

  jobsStore.create({
    id: renderJobId,
    projectId,
    chapterId: chapter.id,
    chapterIndex: chapter.chapterIndex,
    status: 'running',
    step: 'rendering_video',
    timelineJson: timeline,
    outputPath: finalVideoPath,
  });

  chaptersStore.update(projectId, chapter.id, {
    status: 'processing',
    jobId: renderJobId,
  });

  res.json({ jobId: renderJobId, message: 'Video rendering started' });

  (async () => {
    try {
      console.log(`[Render ${renderJobId}] 🎬 Automating full video render with Remotion...`);
      await renderTimelineVideo(finalTimelineJsonPath, finalVideoPath);

      jobsStore.update(renderJobId, {
        status: 'completed',
        step: 'completed',
        outputPath: finalVideoPath,
      });

      chaptersStore.update(projectId, chapter.id, {
        status: 'completed',
        videoPath: finalVideoPath,
      });
      console.log(`[Render ${renderJobId}] ✅ Render complete! Output: ${finalVideoPath}`);
    } catch (err) {
      console.error(`[Render ${renderJobId}] ❌ Render error:`, err);
      jobsStore.update(renderJobId, { status: 'error', errorMessage: String(err) });
      chaptersStore.update(projectId, chapter.id, { status: 'error' });
    }
  })();
});

// ── POST /api/pipeline/start-chapter ──────────────────────────────────────────
// Accepts: projectId, chapterId, voiceovers, scriptText, clipLibraryRoot
pipelineRouter.post(
  '/start-chapter',
  audioUpload.array('voiceovers', 50),
  (req: Request, res: Response) => {
    const jobId = uuidv4();
    const { projectId, chapterId, scriptText, clipLibraryRoot } = req.body;

    if (!projectId) {
      return res.status(400).json({ error: 'projectId is required' });
    }

    const project = projectsStore.findById(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    let chapter = chapterId ? chaptersStore.findById(projectId, chapterId) : null;
    if (!chapter) {
      // If chapter doesn't exist, create it
      chapter = chaptersStore.create(projectId, {
        scriptText: scriptText || '',
        status: 'processing',
      });
    }

    const voiceoverFiles = (req.files as Express.Multer.File[])
      .sort((a, b) => a.originalname.localeCompare(b.originalname))
      .map((f) => f.path);

    if (!voiceoverFiles.length) {
      return res.status(400).json({ error: 'No voiceover files uploaded' });
    }

    if (chapter) {
      chaptersStore.update(projectId, chapter.id, {
        status: 'processing',
        jobId,
        scriptText: scriptText || chapter.scriptText,
        voiceoverFileName: path.basename(voiceoverFiles[0]!),
      });
    }

    jobsStore.create({
      id: jobId,
      projectId,
      chapterId: chapter?.id,
      chapterIndex: chapter?.chapterIndex,
      status: 'running',
      step: 'audio_assembly',
    });

    res.json({ jobId, chapterId: chapter?.id, message: 'Chapter pipeline started' });

    runPipeline({
      jobId,
      project: { id: project.id, name: project.name, scriptText: scriptText || chapter?.scriptText || project.scriptText },
      chapterId: chapter?.id,
      chapterIndex: chapter?.chapterIndex || 1,
      voiceoverFiles,
      clipLibraryRoot: clipLibraryRoot || '',
    }).catch((err) => {
      console.error(`[Pipeline Chapter ${jobId}] Fatal error:`, err);
      jobsStore.update(jobId, { status: 'error', errorMessage: String(err) });
      if (chapter) {
        chaptersStore.update(projectId, chapter.id, { status: 'error' });
      }
    });
  }
);

// ── POST /api/pipeline/stitch-project/:projectId ─────────────────────────────
// Combines all completed chapter videos for a project into one final master MP4
pipelineRouter.post('/stitch-project/:projectId', (req: Request, res: Response) => {
  const projectId = req.params.projectId!;
  const project = projectsStore.findById(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const completedChapters = (project.chapters || [])
    .filter((c) => c.status === 'completed' && c.videoPath && fs.existsSync(c.videoPath))
    .sort((a, b) => a.chapterIndex - b.chapterIndex);

  if (!completedChapters.length) {
    return res.status(400).json({ error: 'No completed chapters found to combine' });
  }

  const projectOutDir = path.join(OUTPUT_DIR, `project_${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
  fs.mkdirSync(projectOutDir, { recursive: true });

  const finalStitchedVideo = path.join(projectOutDir, 'full_project_master.mp4');
  const concatListPath = path.join(projectOutDir, 'chapters_concat.txt');

  const listContent = completedChapters.map((c) => `file '${c.videoPath!.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatListPath, listContent);

  try {
    const ffmpegBin = require('ffmpeg-static') ? `"${require('ffmpeg-static')}"` : 'ffmpeg';
    const concatCmd = `${ffmpegBin} -y -f concat -safe 0 -i "${concatListPath}" -c copy "${finalStitchedVideo}"`;
    require('child_process').execSync(concatCmd, { stdio: 'pipe' });

    res.json({
      message: 'Project video stitched successfully',
      outputPath: finalStitchedVideo,
      chapterCount: completedChapters.length,
    });
  } catch (err) {
    res.status(500).json({ error: `Failed to stitch chapters: ${String(err)}` });
  }
});

// ── GET /api/pipeline/project-video/:projectId ──────────────────────────────
pipelineRouter.get('/project-video/:projectId', (req: Request, res: Response) => {
  const projectId = req.params.projectId!;
  const project = projectsStore.findById(projectId);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const projectOutDir = path.join(OUTPUT_DIR, `project_${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`);
  const finalStitchedVideo = path.join(projectOutDir, 'full_project_master.mp4');

  if (!fs.existsSync(finalStitchedVideo)) {
    return res.status(404).json({ error: 'Master stitched video not found' });
  }

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', `inline; filename="master_${project.name}.mp4"`);
  fs.createReadStream(finalStitchedVideo).pipe(res);
});

// ── Main Pipeline ─────────────────────────────────────────────────────────────
export async function runPipeline(params: {
  jobId: string;
  project: { id: string; scriptText?: string; name: string };
  chapterId?: string;
  chapterIndex?: number;
  voiceoverFiles: string[];
  clipLibraryRoot: string;
  pacing?: 'low' | 'medium' | 'high';
  skipRender?: boolean;
}) {
  const { jobId, project, chapterId, chapterIndex, voiceoverFiles, clipLibraryRoot, pacing } = params;
  const folderName = generateJobFolderName(project.name, jobId);
  const jobOutputDir = path.join(OUTPUT_DIR, folderName);
  fs.mkdirSync(jobOutputDir, { recursive: true });

  const step = (name: string) => {
    jobsStore.update(jobId, { step: name });
    console.log(`[Job ${jobId}] ▶ ${name} (Folder: ${folderName})`);
  };

  // ── 1. Audio Assembly ────────────────────────────────────────────────────
  step('audio_assembly');
  const { masterPath, timingMap } = await assembleAudio(voiceoverFiles, jobOutputDir);
  jobsStore.update(jobId, { chapterTimingMap: timingMap });

  // ── 2. Whisper Alignment ─────────────────────────────────────────────────
  step('alignment');
  const chapter = chapterId ? chaptersStore.findById(project.id, chapterId) : null;
  let alignments: any[] = [];

  // Check pre-synchronized transcript JSON cache if available
  const safeAudioStem = chapter?.voiceoverFileName ? path.parse(chapter.voiceoverFileName).name.replace(/[^\w\s-]/g, '').trim() : '';
  const candidates = [
    safeAudioStem ? path.join(process.cwd(), 'uploads', 'transcripts', 'kloehn', `${String(chapterIndex || 1).padStart(2, '0')}_${safeAudioStem}.json`) : '',
    safeAudioStem ? path.join(process.cwd(), 'uploads', 'transcripts', `${String(chapterIndex || 1).padStart(2, '0')}_${safeAudioStem}.json`) : '',
  ].filter(Boolean);

  for (const cPath of candidates) {
    if (fs.existsSync(cPath)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(cPath, 'utf-8'));
        if (Array.isArray(parsed.segments) && parsed.segments.length > 0) {
          alignments = parsed.segments.map((seg: any) => ({
            text: seg.text || '',
            start: typeof seg.start === 'number' ? seg.start : 0,
            end: typeof seg.end === 'number' ? seg.end : 60,
            words: (seg.words || []).map((w: any) => ({ word: w.word || '', start: w.start, end: w.end })),
          }));
          console.log(`[Job ${jobId}] ⚡ Loaded ${alignments.length} pre-synchronized Whisper segments from disk cache!`);
          break;
        }
      } catch {}
    }
  }

  if (!alignments.length) {
    alignments = await alignAudio(masterPath);
  }
  jobsStore.update(jobId, { beatAlignments: alignments });

  // ── 3. AI Script Planning (with Auto-Transcription Fallback) ─────────────
  step('ai_planning');

  let effectiveScript = (chapter?.scriptText || project.scriptText || '').trim();
  if (!effectiveScript && alignments.length > 0 && alignments[0]?.text !== 'Full Narration Track') {
    effectiveScript = alignments.map((a: any) => a.text).join(' ').trim();
    console.log(`[Job ${jobId}] 🎙️ Script was omitted — auto-transcribed from Whisper audio (${effectiveScript.split(' ').length} words)`);
  }

  if (!effectiveScript || effectiveScript === 'Full Narration Track') {
    throw new Error(
      'No script text was provided. To run without typing a script, please add a free GROQ_API_KEY or OPENAI_API_KEY in your .env for Whisper transcription, or paste your script in the dashboard.'
    );
  }

  let clipFilenames = clipsStore.forProject(project.id).map((c) => c.filename);
  if (clipLibraryRoot && fs.existsSync(clipLibraryRoot)) {
    try {
      const localFiles = fs.readdirSync(clipLibraryRoot).filter((f) => /\.(mp4|mov|webm|mkv|avi|m4v|jpg|jpeg|png|webp)$/i.test(f));
      clipFilenames = Array.from(new Set([...clipFilenames, ...localFiles]));
      console.log(`[Job ${jobId}] 📁 Loaded ${localFiles.length} local clips from ${clipLibraryRoot} for AI planning:`, localFiles);
    } catch (err) {
      console.warn(`[Job ${jobId}] Could not read local clipLibraryRoot:`, err);
    }
  }
  const masterDuration = timingMap[timingMap.length - 1]?.end || 45;
  const plan = await planScriptWithAI(
    effectiveScript,
    clipFilenames,
    project.name,
    chapter?.description || '',
    pacing || chapter?.pacing || 'medium',
    masterDuration
  );

  // ── 4. Snap beat timings to Whisper word boundaries ───────────────────────
  step('timing_alignment');
  const timedBeatsRaw = mapPlannedBeatsToTiming(plan.beats, alignments, masterDuration, pacing || chapter?.pacing || 'medium');

  // ── 5. Resolve media for every beat ──────────────────────────────────────
  // Fallback chain:
  //   video → local clip → stock video → retry broader query → Pexels photo → placeholder
  //   image → Pexels photo → placeholder
  step('media_resolution');

  const stockDir = path.join(jobOutputDir, 'stock');
  fs.mkdirSync(stockDir, { recursive: true });

  const numberCallouts: Array<{ beatIndex: number; texts: string[] }> = [];
  const timedBeats: TimedPlannedBeat[] = [];

  // Load persistent project-wide used media to guarantee zero duplicate media across chapters
  const existingProjectMedia = projectsStore.getUsedMedia(project.id);
  const usedMediaUrls = new Set<string>();
  for (const m of existingProjectMedia) {
    if (m.url) usedMediaUrls.add(m.url);
    if (m.id) usedMediaUrls.add(m.id);
  }
  console.log(`[Job ${jobId}] 🔒 Loaded ${usedMediaUrls.size} previously used media items across project to exclude`);

  const newlyUsedMedia: UsedMediaItem[] = [];

  for (let i = 0; i < timedBeatsRaw.length; i++) {
    const beat = timedBeatsRaw[i]!;

    const calloutTexts = detectNumberCallouts(beat.text);
    if (calloutTexts.length > 0) {
      numberCallouts.push({ beatIndex: beat.beatIndex, texts: calloutTexts });
    }

    console.log(
      `[Job ${jobId}] Beat ${i + 1}/${timedBeatsRaw.length} | ${beat.mediaType} | "${beat.text.slice(0, 50)}"`
    );

    let resolvedPath: string | null = null;

    // Build a story context string so the vision AI can reject wrong-demographic clips
    // (e.g. BMW interior for a homeless family story)
    const chapterObj = chapterId ? chaptersStore.findById(project.id, chapterId) : null;
    const storyContext = [
      (project as any).description || '',
      chapterObj?.description || '',
    ].filter(Boolean).join(' | ').slice(0, 400) || undefined;

    const searchOptions = {
      visualSubject: beat.visualSubject,
      negativeKeywords: [
        ...(beat.negativeKeywords || []),
        'forest', 'woods', 'trees', 'nature', 'camping', 'hiking', 'mountain', 'wildlife',
      ],
      useVisionVerification: true,
      storyContext,
    };

    if (beat.mediaType === 'video') {
      // 1. Local clip from library
      if (beat.clipFilename) {
        const localPath = path.join(clipLibraryRoot, beat.clipFilename);
        if (fs.existsSync(localPath)) {
          resolvedPath = localPath;
          if (/\.(jpg|jpeg|png|webp)$/i.test(beat.clipFilename)) {
            (beat as any).mediaType = 'image';
            beat.kenBurns = true;
          }
          console.log(`  ✅ Local clip: ${beat.clipFilename} (${(beat as any).mediaType})`);
        }
      }

      // 2. Multi-tier Stock video search with uniqueness tracking & AI vision verification
      if (!resolvedPath && (beat.stockVideoQuery || beat.backupVideoQuery)) {
        const stockResult = await findStockFootage(beat.stockVideoQuery || '', beat.backupVideoQuery, usedMediaUrls, searchOptions);
        // If isWeak, skip stock and let AI generation handle it (weak = 50–64% confidence)
        if (stockResult && !stockResult.isWeak) {
          const video = stockResult.video;
          const dest = path.join(stockDir, `video_${i}.mp4`);
          try {
            await downloadStockVideo(video, dest);
            resolvedPath = dest;
            newlyUsedMedia.push({
              id: video.url,
              url: video.url,
              source: video.source,
              mediaType: 'video',
              chapterIndex: chapterIndex || 1,
              query: beat.stockVideoQuery || '',
              usedAt: new Date().toISOString(),
            });
            console.log(`  📹 Real Stock Video [${video.source}]: ${video.title.slice(0, 40)}`);
          } catch { /* fall through */ }
        } else if (stockResult?.isWeak) {
          console.log(`  ⚠️  Skipping weak stock match (50–64%) — will try AI image generation instead`);
        }
      }

      // 3. Fall back to real authentic photograph only if no video exists
      if (!resolvedPath) {
        const photoQuery = beat.stockPhotoQuery || beat.stockVideoQuery || beat.text.slice(0, 40);
        console.log(`  🔄 Video not found — trying real photography: ${photoQuery}`);
        const photo = await findStockPhoto(photoQuery, usedMediaUrls, searchOptions);
        if (photo) {
          const dest = path.join(stockDir, `photo_${i}.jpg`);
          try {
            await downloadStockPhoto(photo, dest);
            resolvedPath = dest;
            (beat as any).mediaType = 'image';
            newlyUsedMedia.push({
              id: photo.id || photo.url,
              url: photo.url,
              source: photo.source,
              mediaType: 'image',
              chapterIndex: chapterIndex || 1,
              query: photoQuery,
              usedAt: new Date().toISOString(),
            });
            console.log(`  📷 Real Photo: ${photoQuery}`);
          } catch { /* fall through */ }
        }
      }
    } else {
      // 1. Local clip from library
      if (beat.clipFilename) {
        const localPath = path.join(clipLibraryRoot, beat.clipFilename);
        if (fs.existsSync(localPath)) {
          resolvedPath = localPath;
          if (/\.(jpg|jpeg|png|webp)$/i.test(beat.clipFilename)) {
            (beat as any).mediaType = 'image';
            beat.kenBurns = true;
          }
          console.log(`  ✅ Local clip: ${beat.clipFilename} (${(beat as any).mediaType})`);
        }
      }

      // 2. High-res real stock photo search with uniqueness tracking & AI vision verification
      if (!resolvedPath) {
        const photoQuery = beat.stockPhotoQuery || beat.text.slice(0, 40);
        const photo = await findStockPhoto(photoQuery, usedMediaUrls, searchOptions);
        if (photo) {
          const dest = path.join(stockDir, `photo_${i}.jpg`);
          try {
            await downloadStockPhoto(photo, dest);
            resolvedPath = dest;
            newlyUsedMedia.push({
              id: photo.id || photo.url,
              url: photo.url,
              source: photo.source,
              mediaType: 'image',
              chapterIndex: chapterIndex || 1,
              query: photoQuery,
              usedAt: new Date().toISOString(),
            });
            console.log(`  📷 Real Photo: ${photoQuery}`);
          } catch { /* fall through */ }
        }
      }

      // 3. Fallback to stock video if photo fails
      if (!resolvedPath && (beat.stockVideoQuery || beat.backupVideoQuery)) {
        const stockResult = await findStockFootage(beat.stockVideoQuery || beat.stockPhotoQuery || '', beat.backupVideoQuery, usedMediaUrls, searchOptions);
        if (stockResult && !stockResult.isWeak) {
          const video = stockResult.video;
          const dest = path.join(stockDir, `video_${i}.mp4`);
          try {
            await downloadStockVideo(video, dest);
            resolvedPath = dest;
            (beat as any).mediaType = 'video';
            newlyUsedMedia.push({
              id: video.url,
              url: video.url,
              source: video.source,
              mediaType: 'video',
              chapterIndex: chapterIndex || 1,
              query: beat.stockVideoQuery || '',
              usedAt: new Date().toISOString(),
            });
            console.log(`  📹 Fallback Stock Video: ${video.title.slice(0, 40)}`);
          } catch { /* fall through */ }
        }
      }
    }

    // 4. Ultimate Fallback: Context-Aware AI Image Generation
    // Triggers when: (a) no stock found at all, OR (b) stock was a weak 50–64% match (not good enough)
    if (!resolvedPath) {
      console.log(`  🎨 Stock returned no high-confidence match — generating custom AI documentary visual for Beat #${i}...`);
      const genDest = path.join(stockDir, `ai_photo_${i}.png`);
      const genResult = await generateDocumentaryImage({
        visualSubject: beat.visualSubject || beat.stockPhotoQuery || undefined,
        text: beat.text,
        projectContext: (project as any).description || project.scriptText?.slice(0, 300) || '',
        chapterContext: chapterObj?.description || '',
        negativeKeywords: beat.negativeKeywords,
        outputPath: genDest,
      });

      if (genResult.success && genResult.outputPath) {
        resolvedPath = genResult.outputPath;
        (beat as any).mediaType = 'image';
        newlyUsedMedia.push({
          id: `ai_gen_${i}_${Date.now()}`,
          url: genDest,
          source: 'ai_generated',
          mediaType: 'image',
          chapterIndex: chapterIndex || 1,
          query: beat.visualSubject || beat.stockPhotoQuery || beat.text.slice(0, 40),
          usedAt: new Date().toISOString(),
        });
      }
    }

    // Auto-generate additional queries for layouts if not provided by planner
    if (!beat.additionalStockQueries || beat.additionalStockQueries.length === 0) {
      if (beat.layout === 'editorial_sidebar_column') {
        const query = beat.layoutData?.subtitle || beat.layoutData?.title || beat.stockPhotoQuery || beat.text.slice(0, 50);
        beat.additionalStockQueries = [
          { slot: 'context_image', query, mediaType: 'image' },
        ];
      } else if (beat.layout === 'horizon_top_bottom_split') {
        const query = beat.layoutData?.subtitle || beat.stockPhotoQuery || beat.text.slice(0, 50);
        beat.additionalStockQueries = [
          { slot: 'ground_view', query, mediaType: 'image' },
        ];
      }
    }

    // 5. Fetch additional multi-asset stock items for multi-angle layouts (Quad Surveillance, Triptych, etc.)
    const additionalClipPaths: string[] = [];
    if (beat.additionalStockQueries && beat.additionalStockQueries.length > 0) {
      for (let sIdx = 0; sIdx < beat.additionalStockQueries.length; sIdx++) {
        const sub = beat.additionalStockQueries[sIdx];
        if (!sub) continue;
        if (sub.mediaType === 'video') {
          const slotResult = await findStockFootage(sub.query, null, usedMediaUrls, {
            visualSubject: sub.query,
            negativeKeywords: beat.negativeKeywords,
            useVisionVerification: true,
            storyContext,
          });
          if (slotResult && !slotResult.isWeak) {
            const v = slotResult.video;
            const dest = path.join(stockDir, `video_${i}_sub_${sIdx}.mp4`);
            try {
              await downloadStockVideo(v, dest);
              additionalClipPaths.push(dest);
              newlyUsedMedia.push({
                id: v.url,
                url: v.url,
                source: v.source,
                mediaType: 'video',
                chapterIndex: chapterIndex || 1,
                query: sub.query,
                usedAt: new Date().toISOString(),
              });
            } catch { /* ignore */ }
          }
        } else {
          const p = await findStockPhoto(sub.query, usedMediaUrls, {
            visualSubject: sub.query,
            negativeKeywords: beat.negativeKeywords,
            useVisionVerification: true,
            storyContext,
          });
          if (p) {
            const dest = path.join(stockDir, `photo_${i}_sub_${sIdx}.jpg`);
            try {
              await downloadStockPhoto(p, dest);
              additionalClipPaths.push(dest);
              newlyUsedMedia.push({
                id: p.id || p.url,
                url: p.url,
                source: p.source,
                mediaType: 'image',
                chapterIndex: chapterIndex || 1,
                query: sub.query,
                usedAt: new Date().toISOString(),
              });
            } catch { /* ignore */ }
          }
        }

        // Slot AI image generation fallback if stock failed for this slot
        if (additionalClipPaths.length <= sIdx) {
          const slotDest = path.join(stockDir, `ai_photo_${i}_sub_${sIdx}.png`);
          const slotGen = await generateDocumentaryImage({
            visualSubject: sub.query,
            text: beat.text,
            projectContext: (project as any).description || '',
            chapterContext: chapterObj?.description || '',
            negativeKeywords: beat.negativeKeywords,
            outputPath: slotDest,
          });
          if (slotGen.success && slotGen.outputPath) {
            additionalClipPaths.push(slotDest);
            newlyUsedMedia.push({
              id: `ai_gen_${i}_sub_${sIdx}_${Date.now()}`,
              url: slotDest,
              source: 'ai_generated',
              mediaType: 'image',
              chapterIndex: chapterIndex || 1,
              query: sub.query,
              usedAt: new Date().toISOString(),
            });
          }
        }
      }
    }

    // Fix: For polaroid_scatter_desk layout, guarantee all 3 photo slots are filled.
    // If additionalClipPaths doesn't have 2 side photos, AI-generate them to avoid black boxes.
    if ((beat as any).layout === 'polaroid_scatter_desk') {
      const slotsNeeded = 2;
      while (additionalClipPaths.length < slotsNeeded) {
        const slotIdx = additionalClipPaths.length;
        const slotDest = path.join(stockDir, `ai_polaroid_${i}_slot${slotIdx}_${Date.now()}.png`);
        console.log(`  🎨 [Polaroid Fix] Generating AI photo for empty polaroid slot ${slotIdx + 1}...`);
        const slotGen = await generateDocumentaryImage({
          visualSubject: beat.visualSubject || beat.stockPhotoQuery || undefined,
          text: beat.text,
          projectContext: (project as any).description || project.scriptText?.slice(0, 300) || '',
          chapterContext: chapterObj?.description || '',
          negativeKeywords: beat.negativeKeywords,
          outputPath: slotDest,
        });
        if (slotGen.success && slotGen.outputPath) {
          additionalClipPaths.push(slotDest);
        } else {
          break; // Don't infinite loop if AI gen is failing
        }
      }
    }

    timedBeats.push({ ...beat, resolvedPath, additionalClipPaths } as TimedPlannedBeat);
  }

  // Persist newly used media to the project
  if (newlyUsedMedia.length > 0) {
    projectsStore.addUsedMedia(project.id, newlyUsedMedia);
    console.log(`[Job ${jobId}] 💾 Saved ${newlyUsedMedia.length} newly used media items to project registry`);
  }

  // ── 6. Build Timeline JSON ─────────────────────────────────────────────────
  step('building_timeline');

  const finalVideoPath = path.join(jobOutputDir, 'final_video.mp4');
  const timeline = buildTimeline({
    masterAudioPath: masterPath,
    outputPath: finalVideoPath,
    timedBeats,
    alignments,
    chapterTimings: timingMap,
    numberCallouts,
  });

  const timelineJsonPath = path.join(jobOutputDir, 'timeline.json');
  fs.writeFileSync(timelineJsonPath, JSON.stringify(timeline, null, 2));

  jobsStore.update(jobId, {
    timelineJson: timeline,
    outputPath: timelineJsonPath,
  });

  // If skipRender was requested (Stage 1 Storyboard Staging):
  if (params.skipRender) {
    jobsStore.update(jobId, {
      status: 'completed',
      step: 'completed',
    });
    if (chapterId) {
      chaptersStore.update(project.id, chapterId, {
        status: 'staged',
        timelineJson: timeline,
      });
    }
    console.log(`[Job ${jobId}] 📋 Staged Visual Storyboard Ready for Review! (${timedBeats.length} beats)`);
    return;
  }

  // ── 7. Automated Remotion Video Rendering ──────────────────────────────────
  step('rendering_video');
  console.log(`[Job ${jobId}] 🎬 Automating full video render with Remotion...`);
  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  jobsStore.update(jobId, {
    status: 'completed',
    step: 'completed',
    outputPath: finalVideoPath,
  });

  if (chapterId) {
    chaptersStore.update(project.id, chapterId, {
      status: 'completed',
      videoPath: finalVideoPath,
      timelineJson: timeline,
    });
  }

  const imageCount = timedBeats.filter((b) => b.mediaType === 'image').length;
  const videoCount = timedBeats.filter((b) => b.mediaType === 'video').length;
  console.log(`[Job ${jobId}] ✅ Video Complete! (${videoCount} video shots, ${imageCount} photo shots)`);
  console.log(`[Job ${jobId}] 📁 Final Video: ${finalVideoPath}`);
}
