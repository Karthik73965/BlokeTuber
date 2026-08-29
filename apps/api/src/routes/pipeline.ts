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
} from '../services/stockFootage';
import { planScriptWithAI, mapPlannedBeatsToTiming } from '../services/aiScriptPlanner';
import { buildTimeline, TimedPlannedBeat } from '../services/timelineBuilder';

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

import { renderTimelineVideo } from '../services/remotionRenderer';

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

// ── GET /api/pipeline/timeline/:jobId ────────────────────────────────────────
pipelineRouter.get('/timeline/:jobId', (req: Request, res: Response) => {
  const job = jobsStore.findById(req.params.jobId!);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  if (!job.timelineJson) return res.status(404).json({ error: 'Timeline not ready yet' });
  res.json({ timeline: job.timelineJson });
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

// ── GET /api/pipeline/chapter-timeline/:projectId/:chapterId ─────────────────
pipelineRouter.get('/chapter-timeline/:projectId/:chapterId', (req: Request, res: Response) => {
  const projectId = req.params.projectId!;
  const chapterId = req.params.chapterId!;
  const chapter = chaptersStore.findById(projectId, chapterId);
  if (!chapter) return res.status(404).json({ error: 'Chapter not found' });

  if (chapter.jobId) {
    const job = jobsStore.findById(chapter.jobId);
    if (job?.timelineJson) {
      return res.json({ timeline: job.timelineJson });
    }
  }

  return res.status(404).json({ error: 'Chapter timeline not available yet' });
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
async function runPipeline(params: {
  jobId: string;
  project: { id: string; scriptText?: string; name: string };
  chapterId?: string;
  chapterIndex?: number;
  voiceoverFiles: string[];
  clipLibraryRoot: string;
}) {
  const { jobId, project, chapterId, chapterIndex, voiceoverFiles, clipLibraryRoot } = params;
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
  const alignments = await alignAudio(masterPath);
  jobsStore.update(jobId, { beatAlignments: alignments });

  // ── 3. AI Script Planning (with Auto-Transcription Fallback) ─────────────
  step('ai_planning');

  let effectiveScript = (project.scriptText || '').trim();
  if (!effectiveScript && alignments.length > 0 && alignments[0]?.text !== 'Full Narration Track') {
    effectiveScript = alignments.map((a) => a.text).join(' ').trim();
    console.log(`[Job ${jobId}] 🎙️ Script was omitted — auto-transcribed from Whisper audio (${effectiveScript.split(' ').length} words)`);
  }

  if (!effectiveScript || effectiveScript === 'Full Narration Track') {
    throw new Error(
      'No script text was provided. To run without typing a script, please add a free GROQ_API_KEY or OPENAI_API_KEY in your .env for Whisper transcription, or paste your script in the dashboard.'
    );
  }

  const clipFilenames = clipsStore.forProject(project.id).map((c) => c.filename);
  const plan = await planScriptWithAI(effectiveScript, clipFilenames, project.name);

  // ── 4. Snap beat timings to Whisper word boundaries ───────────────────────
  step('timing_alignment');
  const masterDuration = timingMap[timingMap.length - 1]?.end || 45;
  const timedBeatsRaw = mapPlannedBeatsToTiming(plan.beats, alignments, masterDuration);

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

    if (beat.mediaType === 'video') {
      // 1. Local clip from library
      if (beat.clipFilename) {
        const localPath = path.join(clipLibraryRoot, beat.clipFilename);
        if (fs.existsSync(localPath)) {
          resolvedPath = localPath;
          console.log(`  ✅ Local clip: ${beat.clipFilename}`);
        }
      }

      // 2. Multi-tier Stock video search (Pexels, Pixabay, Coverr, Mixkit) with uniqueness tracking
      if (!resolvedPath && (beat.stockVideoQuery || beat.backupVideoQuery)) {
        const video = await findStockFootage(beat.stockVideoQuery || '', beat.backupVideoQuery, usedMediaUrls);
        if (video) {
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
        }
      }

      // 3. Fall back to real authentic photograph only if no video exists
      if (!resolvedPath) {
        const photoQuery = beat.stockPhotoQuery || beat.stockVideoQuery || beat.text.slice(0, 40);
        console.log(`  🔄 Video not found — trying real photography: ${photoQuery}`);
        const photo = await findStockPhoto(photoQuery, usedMediaUrls);
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
          console.log(`  ✅ Local clip: ${beat.clipFilename}`);
        }
      }

      // 2. High-res real stock photo search with uniqueness tracking
      if (!resolvedPath) {
        const photoQuery = beat.stockPhotoQuery || beat.text.slice(0, 40);
        const photo = await findStockPhoto(photoQuery, usedMediaUrls);
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
        const video = await findStockFootage(beat.stockVideoQuery || beat.stockPhotoQuery || '', beat.backupVideoQuery, usedMediaUrls);
        if (video) {
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

    timedBeats.push({ ...beat, resolvedPath });
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
    step: 'rendering_video',
    outputPath: timelineJsonPath,
  });

  // ── 7. Automated FFmpeg Video Rendering ────────────────────────────────────
  step('rendering_video');
  console.log(`[Job ${jobId}] 🎬 Automating full video render with FFmpeg...`);
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
    });
  }

  const imageCount = timedBeats.filter((b) => b.mediaType === 'image').length;
  const videoCount = timedBeats.filter((b) => b.mediaType === 'video').length;
  console.log(`[Job ${jobId}] ✅ Video Complete! (${videoCount} video shots, ${imageCount} photo shots)`);
  console.log(`[Job ${jobId}] 📁 Final Video: ${finalVideoPath}`);
}
