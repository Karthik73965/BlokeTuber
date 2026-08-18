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

// ── Main Pipeline ─────────────────────────────────────────────────────────────
async function runPipeline(params: {
  jobId: string;
  project: { id: string; scriptText: string; name: string };
  voiceoverFiles: string[];
  clipLibraryRoot: string;
}) {
  const { jobId, project, voiceoverFiles, clipLibraryRoot } = params;
  const jobOutputDir = path.join(OUTPUT_DIR, jobId);
  fs.mkdirSync(jobOutputDir, { recursive: true });

  const step = (name: string) => {
    jobsStore.update(jobId, { step: name });
    console.log(`[Job ${jobId}] ▶ ${name}`);
  };

  // ── 1. Audio Assembly ────────────────────────────────────────────────────
  step('audio_assembly');
  const { masterPath, timingMap } = await assembleAudio(voiceoverFiles, jobOutputDir);
  jobsStore.update(jobId, { chapterTimingMap: timingMap });

  // ── 2. Whisper Alignment ─────────────────────────────────────────────────
  step('alignment');
  const alignments = await alignAudio(masterPath);
  jobsStore.update(jobId, { beatAlignments: alignments });

  // ── 3. AI Script Planning (one batch call) ────────────────────────────────
  // Replaces fixed 5-word/2s cuts + per-beat clip matching.
  // gpt-4o sees the full script and returns: smart beats, mediaType (video/image),
  // local clip picks, stock queries — all in one shot.
  step('ai_planning');

  const clipFilenames = clipsStore.forProject(project.id).map((c) => c.filename);
  const plan = await planScriptWithAI(project.scriptText, clipFilenames, project.name);

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

      // 2. Stock video (primary query)
      if (!resolvedPath && beat.stockVideoQuery) {
        const video = await findStockFootage(beat.stockVideoQuery);
        if (video) {
          const dest = path.join(stockDir, `video_${i}.mp4`);
          try {
            await downloadStockVideo(video, dest);
            resolvedPath = dest;
            console.log(`  📹 Stock video: ${beat.stockVideoQuery}`);
          } catch { /* fall through */ }
        }
      }

      // 3. Retry stock video with broader (first 2 words) query
      if (!resolvedPath && beat.stockVideoQuery) {
        const broaderQuery = beat.stockVideoQuery.split(' ').slice(0, 2).join(' ');
        const video = await findStockFootage(broaderQuery, true);
        if (video) {
          const dest = path.join(stockDir, `video_${i}_retry.mp4`);
          try {
            await downloadStockVideo(video, dest);
            resolvedPath = dest;
            console.log(`  📹 Retry video: ${broaderQuery}`);
          } catch { /* fall through */ }
        }
      }

      // 4. Fall back to Pexels photo
      if (!resolvedPath) {
        const photoQuery = beat.stockPhotoQuery || beat.stockVideoQuery || beat.text.slice(0, 40);
        console.log(`  🔄 Video not found — trying photo: ${photoQuery}`);
        const photo = await findStockPhoto(photoQuery);
        if (photo) {
          const dest = path.join(stockDir, `photo_${i}.jpg`);
          try {
            await downloadStockPhoto(photo, dest);
            resolvedPath = dest;
            (beat as any).mediaType = 'image'; // promote to image so renderer applies Ken Burns
            console.log(`  📷 Fallback photo: ${photoQuery}`);
          } catch { /* fall through */ }
        }
      }
    } else {
      // Image beat — straight to Pexels Photos
      const photoQuery = beat.stockPhotoQuery || beat.text.slice(0, 40);
      const photo = await findStockPhoto(photoQuery);
      if (photo) {
        const dest = path.join(stockDir, `photo_${i}.jpg`);
        try {
          await downloadStockPhoto(photo, dest);
          resolvedPath = dest;
          console.log(`  📷 Photo: ${photoQuery}`);
        } catch { /* fall through */ }
      }
    }

    timedBeats.push({ ...beat, resolvedPath });
  }

  // ── 6. Build Timeline JSON ─────────────────────────────────────────────────
  step('building_timeline');

  const outputPath = path.join(jobOutputDir, 'render_output.mp4');
  const timeline = buildTimeline({
    masterAudioPath: masterPath,
    outputPath,
    timedBeats,
    alignments,
    chapterTimings: timingMap,
    numberCallouts,
  });

  const timelineJsonPath = path.join(jobOutputDir, 'timeline.json');
  fs.writeFileSync(timelineJsonPath, JSON.stringify(timeline, null, 2));

  jobsStore.update(jobId, {
    timelineJson: timeline,
    status: 'completed',
    step: 'render_plan',
    outputPath: timelineJsonPath,
  });

  const imageCount = timedBeats.filter((b) => b.mediaType === 'image').length;
  const videoCount = timedBeats.filter((b) => b.mediaType === 'video').length;
  console.log(`[Job ${jobId}] ✅ Done — ${videoCount} video beats, ${imageCount} image beats`);
  console.log(`[Job ${jobId}] 📋 Timeline: ${timelineJsonPath}`);
}
