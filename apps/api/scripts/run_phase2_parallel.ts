import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { projectsStore, chaptersStore, jobsStore } from '../src/db/localStore';
import { runPipeline } from '../src/routes/pipeline';

// Load environment variables
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const PROJECT_ID = 'proj_1788520997417';
const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Kloehn\\AUD';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Kloehn\\RAW';
const AUDIO_UPLOADS_DIR = path.resolve(process.cwd(), 'uploads', 'audio');

// Concurrency pool helper
async function mapConcurrent<T, R>(items: T[], concurrency: number, fn: (item: T, idx: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIdx = 0;

  async function worker(workerId: number) {
    while (nextIdx < items.length) {
      const idx = nextIdx++;
      console.log(`\n[Worker ${workerId}] 🚀 Starting item ${idx + 1}/${items.length}...`);
      results[idx] = await fn(items[idx]!, idx);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, (_, i) => worker(i + 1));
  await Promise.all(workers);
  return results;
}

async function runPhase2() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 [PHASE 2] PARALLEL STORYBOARD PLANNING & FOOTAGE RESOLUTION');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`📁 Project ID: ${PROJECT_ID}`);
  console.log(`📁 Local RAW Clips Library: ${RAW_DIR}`);
  console.log(`📁 Audio Directory: ${AUD_DIR}`);
  console.log(`⚡ Pacing: FAST & PUNCHY (High Pacing)`);

  const project = projectsStore.findById(PROJECT_ID);
  if (!project) {
    throw new Error(`Project ${PROJECT_ID} not found in database.`);
  }

  const rawFiles = fs.existsSync(RAW_DIR) ? fs.readdirSync(RAW_DIR) : [];
  console.log(`📁 Total Local RAW Assets Found: ${rawFiles.length}`);
  rawFiles.forEach((f, i) => console.log(`   ${i + 1}. [${path.extname(f).slice(1).toUpperCase()}] ${f}`));

  const chapters = [...(project.chapters || [])].sort((a, b) => (a.chapterIndex || 0) - (b.chapterIndex || 0));
  console.log(`\n📋 Total Chapters to Plan & Stage: ${chapters.length}`);

  // Run with concurrency of 1 to ensure zero in-flight credit exhaustion on OpenRouter
  const CONCURRENCY = 1;
  console.log(`⚡ Executing with Concurrency = ${CONCURRENCY} (sequential chapter pipeline to respect in-flight credit ceiling)...\n`);

  const startTime = Date.now();

  const results = await mapConcurrent(chapters, CONCURRENCY, async (chapter, idx) => {
    const chNum = String(chapter.chapterIndex || idx + 1).padStart(2, '0');
    console.log(`\n───────────────────────────────────────────────────────────────────`);
    console.log(`🎬 Chapter ${chNum}: "${chapter.title}"`);
    console.log(`───────────────────────────────────────────────────────────────────`);

    // Check if already staged (allow clean resumption)
    const freshChapter = chaptersStore.findById(project.id, chapter.id) || chapter;
    if (freshChapter.status === 'staged' && freshChapter.timelineJson?.clips?.length > 0) {
      const beatCount = freshChapter.timelineJson.clips.length;
      const localMatches = (freshChapter.timelineJson.clips || []).filter((c: any) => c.clipPath && /kloehn[\\\/]raw/i.test(c.clipPath)).length;
      console.log(`⏩ [Chapter ${chNum}] Already Staged (${beatCount} beats, ${localMatches} RAW clips) — Skipping`);
      return { chapterIndex: chapter.chapterIndex, title: chapter.title, success: true, beatCount, localMatches };
    }

    // 1. Locate chapter audio file
    let audioPath = '';
    const audioCandidates = [
      chapter.voiceoverFileName ? path.join(AUDIO_UPLOADS_DIR, chapter.voiceoverFileName) : '',
      chapter.voiceoverFileName ? path.join(AUD_DIR, chapter.voiceoverFileName) : '',
    ].filter(Boolean);

    for (const cand of audioCandidates) {
      if (fs.existsSync(cand)) {
        audioPath = cand;
        break;
      }
    }

    if (!audioPath) {
      console.error(`❌ Audio not found for Chapter ${chNum}: "${chapter.title}"`);
      return { chapterIndex: chapter.chapterIndex, title: chapter.title, success: false, error: 'Audio file missing' };
    }

    const jobId = uuidv4();
    jobsStore.create({
      id: jobId,
      projectId: project.id,
      chapterId: chapter.id,
      chapterIndex: chapter.chapterIndex,
      status: 'running',
      step: 'audio_assembly',
    });

    chaptersStore.update(project.id, chapter.id, {
      status: 'processing',
      jobId,
      clipLibraryRoot: RAW_DIR,
      pacing: 'high',
    });

    try {
      await runPipeline({
        jobId,
        project: {
          id: project.id,
          name: project.name,
          scriptText: chapter.scriptText,
        },
        chapterId: chapter.id,
        chapterIndex: chapter.chapterIndex,
        voiceoverFiles: [audioPath],
        clipLibraryRoot: RAW_DIR,
        pacing: 'high',
        skipRender: true, // Only stage storyboard!
      });

      const updatedChapter = chaptersStore.findById(project.id, chapter.id);
      const timeline = updatedChapter?.timelineJson;
      const beatCount = timeline?.clips?.length || 0;
      const localMatches = (timeline?.clips || []).filter((c: any) => c.clipPath && /kloehn[\\\/]raw/i.test(c.clipPath)).length;

      console.log(`✅ [Chapter ${chNum}] Staged Storyboard Complete: ${beatCount} beats (${localMatches} authentic RAW clips matched)`);

      return {
        chapterIndex: chapter.chapterIndex,
        title: chapter.title,
        success: true,
        beatCount,
        localMatches,
      };
    } catch (err: any) {
      console.error(`❌ [Chapter ${chNum}] Error planning storyboard:`, err.message || err);
      jobsStore.update(jobId, { status: 'error', errorMessage: String(err) });
      chaptersStore.update(project.id, chapter.id, { status: 'error' });
      return {
        chapterIndex: chapter.chapterIndex,
        title: chapter.title,
        success: false,
        error: String(err),
      };
    }
  });

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const successful = results.filter((r) => r.success).length;

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🎉 [PHASE 2 COMPLETE] All ${successful}/${chapters.length} Chapters Staged in ${totalTime}s`);
  console.log('═══════════════════════════════════════════════════════════════════');
  results.forEach((r) => {
    if (r.success) {
      console.log(`✓ Chapter 0${r.chapterIndex}: ${r.title} — ${r.beatCount} beats (${r.localMatches} authentic RAW clips)`);
    } else {
      console.log(`✗ Chapter 0${r.chapterIndex}: ${r.title} — FAILED: ${r.error}`);
    }
  });
  console.log(`\n👉 Review on Dashboard: http://localhost:3000/project/${project.id}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

runPhase2().catch((err) => {
  console.error('❌ Phase 2 Execution Error:', err);
  process.exit(1);
});
