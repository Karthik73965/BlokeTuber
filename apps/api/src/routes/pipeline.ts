import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { projectsStore, clipsStore, jobsStore } from '../db/localStore';
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

import { renderTimelineVideo } from '../services/videoRenderer';

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
  res.json({ job });
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

// ── Main Pipeline ─────────────────────────────────────────────────────────────
async function runPipeline(params: {
  jobId: string;
  project: { id: string; scriptText: string; name: string };
  voiceoverFiles: string[];
  clipLibraryRoot: string;
}) {
  const { jobId, project, voiceoverFiles, clipLibraryRoot } = params;
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
  const usedMediaUrls = new Set<string>();

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
            console.log(`  📹 Fallback Stock Video: ${video.title.slice(0, 40)}`);
          } catch { /* fall through */ }
        }
      }
    }

    timedBeats.push({ ...beat, resolvedPath });
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

  const imageCount = timedBeats.filter((b) => b.mediaType === 'image').length;
  const videoCount = timedBeats.filter((b) => b.mediaType === 'video').length;
  console.log(`[Job ${jobId}] ✅ Video Complete! (${videoCount} video shots, ${imageCount} photo shots)`);
  console.log(`[Job ${jobId}] 📁 Final Video: ${finalVideoPath}`);
}
