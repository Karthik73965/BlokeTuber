import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

import { mapPlannedBeatsToTiming } from '../src/services/aiScriptPlanner';
import { findStockFootage, findStockPhoto, downloadStockVideo, downloadStockPhoto } from '../src/services/stockFootage';
import { buildTimeline, TimedPlannedBeat } from '../src/services/timelineBuilder';
import { projectsStore, chaptersStore, jobsStore, UsedMediaItem } from '../src/db/localStore';
import { getAudioDuration } from '../src/services/audioAssembly';
import { DIRECTED_KLOEHN_BEATS } from './direct_kloehn_chapters';

const PROJECT_ID = 'proj_1788520997417';
const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Kloehn\\AUD';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Kloehn\\RAW';
const TRANSCRIPTS_DIR = path.resolve(__dirname, '../uploads/transcripts/kloehn');

// Audio file map for each chapter
const CHAPTER_AUDIO_FILES: Record<number, string> = {
  1: '1 - COLD OPEN.mp3',
  2: '1.5 — THE SCULPTOR.mp3',
  3: '2 — THE CAMERA.mp3',
  4: '3— THE STUDIO AND THE MATERIAL.mp3',
  5: '3.5  — A SATURDAY IN THE SHOP.mp3',
  6: '4 — A HOUSE FOR EVERY SHAPE OF MATERIAL.mp3',
  7: '5— THE WORD GETS OUT.mp3',
  8: "6 — WHAT IT ISN'T TRYING TO BE.mp3",
  9: '7 — THE ARGUMENT.mp3',
  10: '8 — WHAT SPREADS.mp3',
  11: '9 - CLOSE.mp3',
};

// Transcript JSON cache map
const CHAPTER_TRANSCRIPT_JSONS: Record<number, string> = {
  1: '01_1 - COLD OPEN.json',
  2: '02_15  THE SCULPTOR.json',
  3: '03_2  THE CAMERA.json',
  4: '04_3 THE STUDIO AND THE MATERIAL.json',
  5: '05_35   A SATURDAY IN THE SHOP.json',
  6: '06_4  A HOUSE FOR EVERY SHAPE OF MATERIAL.json',
  7: '07_5 THE WORD GETS OUT.json',
  8: '08_6  WHAT IT ISNT TRYING TO BE.json',
  9: '09_7  THE ARGUMENT.json',
  10: '10_8  WHAT SPREADS.json',
  11: '11_9 - CLOSE.json',
};

async function processChapterPhase2(chapterIndex: number): Promise<void> {
  const project = projectsStore.findById(PROJECT_ID);
  if (!project) throw new Error(`Project ${PROJECT_ID} not found`);

  const chapters = [...(project.chapters || [])];
  const chapter = chapters.find((c) => c.chapterIndex === chapterIndex);
  if (!chapter) throw new Error(`Chapter ${chapterIndex} not found in project`);

  const audioFileName = CHAPTER_AUDIO_FILES[chapterIndex] || chapter.voiceoverFileName;
  const audioPath = path.join(AUD_DIR, audioFileName);
  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio file not found: ${audioPath}`);
  }

  console.log(`\n═══════════════════════════════════════════════════════════════════`);
  console.log(`🎬 [CHAPTER ${String(chapterIndex).padStart(2, '0')}] ${chapter.title}`);
  console.log(`═══════════════════════════════════════════════════════════════════`);

  // Check if chapter is already staged (allow clean resumption unless forced)
  const FORCE_RESTAGE = process.env.FORCE_RESTAGE !== 'false';
  const freshChapter = chaptersStore.findById(PROJECT_ID, chapter.id) || chapter;
  if (!FORCE_RESTAGE && freshChapter.status === 'staged' && freshChapter.timelineJson?.clips?.length > 0) {
    console.log(`⏩ [CHAPTER ${String(chapterIndex).padStart(2, '0')}] Already Staged (${freshChapter.timelineJson.clips.length} cuts) — Skipping`);
    return;
  }

  // 1. Output directory
  const rootApiDir = path.resolve(__dirname, '..');
  const rootOutputDir = path.join(rootApiDir, 'output');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const hash = Math.random().toString(36).slice(2, 8);
  const outDirName = `kloehn_ch${chapterIndex}_${timestamp}_${hash}`;
  const outDir = path.join(rootOutputDir, outDirName);
  const stockDir = path.join(outDir, 'stock');
  fs.mkdirSync(stockDir, { recursive: true });

  // Copy master narration
  const masterAudioPath = path.join(outDir, 'master_narration.mp3');
  fs.copyFileSync(audioPath, masterAudioPath);

  // 2. Audio duration & alignments from cache
  const duration = await getAudioDuration(masterAudioPath);
  console.log(`⏱️ Narration Duration: ${duration.toFixed(2)}s`);

  let alignments: any[] = [];
  const transJsonName = CHAPTER_TRANSCRIPT_JSONS[chapterIndex];
  if (transJsonName) {
    const transJsonPath = path.join(TRANSCRIPTS_DIR, transJsonName);
    if (fs.existsSync(transJsonPath)) {
      try {
        const transData = JSON.parse(fs.readFileSync(transJsonPath, 'utf8'));
        if (transData.segments && Array.isArray(transData.segments)) {
          alignments = transData.segments;
          console.log(`⚡ Loaded ${alignments.length} pre-synchronized Whisper segments from disk cache!`);
        }
      } catch (err) {
        console.warn(`Could not read transcript JSON: ${err}`);
      }
    }
  }

  const effectiveScript = alignments.map((a: any) => a.text).join(' ').trim() || chapter.scriptText || '';
  console.log(`📝 Script Word Count: ${effectiveScript.split(/\s+/).length} words`);

  // 3. Load directed beats
  const rawBeats = DIRECTED_KLOEHN_BEATS[chapterIndex];
  if (!rawBeats || rawBeats.length === 0) {
    throw new Error(`No directed beats found for Chapter ${chapterIndex} in DIRECTED_KLOEHN_BEATS`);
  }
  console.log(`📋 Loaded ${rawBeats.length} hand-directed documentary director beats.`);

  // 4. Auto-subdivide into snappy cuts (<5.0s hard cap)
  console.log(`⚡ Applying Fast & Punchy timing alignment (Vice/Vox pacing, hard cap < 5.0s)...`);
  const timedBeatsRaw = mapPlannedBeatsToTiming(rawBeats, alignments, duration, 'high');
  const maxDur = Math.max(...timedBeatsRaw.map((b) => b.endTime - b.startTime));
  console.log(`✂️ Generated ${timedBeatsRaw.length} punchy cuts (Max cut: ${maxDur.toFixed(2)}s, Average: ${(duration / timedBeatsRaw.length).toFixed(2)}s).`);

  // 5. Source media: Local RAW clips prioritized, Pexels & Pixabay stock, zero OpenRouter
  console.log(`\n🔍 Sourcing footage for ${timedBeatsRaw.length} beats...`);
  const existingProjectMedia = projectsStore.getUsedMedia(PROJECT_ID);
  const usedMediaUrls = new Set<string>();
  for (const m of existingProjectMedia) {
    if (m.url) usedMediaUrls.add(m.url);
    if (m.id) usedMediaUrls.add(m.id);
  }

  const newlyUsedMedia: UsedMediaItem[] = [];
  const timedBeats: TimedPlannedBeat[] = [];
  const numberCallouts: Array<{ beatIndex: number; texts: string[] }> = [];
  let localClipCount = 0;
  let stockVideoCount = 0;
  let stockPhotoCount = 0;

  // Interleaving & De-duplication trackers
  let consecutiveLocalCount = 0;
  const lastUsedBeatByFilename: Record<string, number> = {};

  for (let i = 0; i < timedBeatsRaw.length; i++) {
    const beat = timedBeatsRaw[i]!;
    const dur = (beat.endTime - beat.startTime).toFixed(2);
    let resolvedPath: string | null = null;
    let useLocalClip = false;

    // A. Local RAW clip match (Strict Interleaving: max 1 consecutive local, min 4 beats cooldown)
    if (beat.clipFilename) {
      const localFile = beat.clipFilename;
      const lastUsedIdx = lastUsedBeatByFilename[localFile];
      const spacing = lastUsedIdx !== undefined ? i - lastUsedIdx : 999;
      const canUseLocal = consecutiveLocalCount < 1 && spacing >= 4;

      if (canUseLocal) {
        const localPath = path.join(RAW_DIR, localFile);
        if (fs.existsSync(localPath)) {
          resolvedPath = localPath;
          useLocalClip = true;
          consecutiveLocalCount++;
          lastUsedBeatByFilename[localFile] = i;
          if (/\.(jpg|jpeg|png|webp)$/i.test(localFile)) {
            (beat as any).mediaType = 'image';
            beat.kenBurns = true;
          } else {
            (beat as any).mediaType = 'video';
          }
          localClipCount++;
          console.log(`  [Beat ${String(i + 1).padStart(2, '0')}/${timedBeatsRaw.length}] (${dur}s) ✅ Local RAW: ${localFile}`);
        }
      } else {
        const reason = consecutiveLocalCount >= 1
          ? `Consecutive local limit (1 max) -> Forcing Stock B-Roll interleaving`
          : `Duplicate cooldown: "${localFile}" used ${spacing} beats ago (< 4 cooldown) -> Replacing with Stock`;
        console.log(`  [Beat ${String(i + 1).padStart(2, '0')}/${timedBeatsRaw.length}] (${dur}s) 🔄 ${reason}`);
      }
    }

    // Whenever a local clip is NOT used (or suppressed), reset consecutive counter
    if (!useLocalClip) {
      consecutiveLocalCount = 0;
    }

    // Determine rich stock queries
    const stockQuery = beat.stockVideoQuery || (beat.visualSubject ? beat.visualSubject.replace(/_/g, ' ') : null) || beat.text.slice(0, 40);
    const backupQuery = beat.backupVideoQuery || 'urban documentary street daylight';

    // B. Search Pexels & Pixabay for 4K/HD video b-roll (Zero OpenRouter, ultra-strict relevance >= 40)
    if (!resolvedPath && (stockQuery || backupQuery)) {
      const searchOptions = {
        visualSubject: beat.visualSubject,
        negativeKeywords: [
          ...(beat.negativeKeywords || []),
          'forest', 'woods', 'trees', 'nature', 'camping', 'hiking', 'mountain', 'wildlife',
          'guitar', 'music', 'concert', 'luxury', 'resort', 'gym', 'fitness', 'party',
        ],
        useVisionVerification: false, // Pure Antigravity direct search!
      };

      try {
        const stockResult = await findStockFootage(
          stockQuery || '',
          backupQuery,
          usedMediaUrls,
          searchOptions
        );

        if (stockResult?.video) {
          const video = stockResult.video;
          usedMediaUrls.add(video.url);
          const dest = path.join(stockDir, `video_${i}.mp4`);
          await downloadStockVideo(video, dest);
          resolvedPath = dest;
          (beat as any).mediaType = 'video';
          stockVideoCount++;
          newlyUsedMedia.push({
            id: video.url,
            url: video.url,
            source: video.source,
            mediaType: 'video',
            chapterIndex,
            query: stockQuery || '',
            usedAt: new Date().toISOString(),
          });
          console.log(`  [Beat ${String(i + 1).padStart(2, '0')}/${timedBeatsRaw.length}] (${dur}s) 📹 Stock Video [${video.source}]: "${video.title.slice(0, 35)}"`);
        }
      } catch (err: any) {
        console.warn(`  ⚠️ Stock video search/download error for beat ${i}:`, err.message);
      }
    }

    // C. Fallback: High-resolution stock photo (Ultra-strict relevance >= 30, Ken Burns motion)
    if (!resolvedPath) {
      try {
        const photoQuery = beat.stockPhotoQuery || stockQuery || backupQuery || beat.text.slice(0, 40);
        const photo = await findStockPhoto(photoQuery, usedMediaUrls, {
          useVisionVerification: false,
          negativeKeywords: [
            ...(beat.negativeKeywords || []),
            'forest', 'woods', 'trees', 'nature', 'camping', 'hiking', 'mountain', 'wildlife',
            'guitar', 'music', 'concert', 'luxury', 'resort', 'gym', 'fitness', 'party',
          ],
        });
        if (photo) {
          const dest = path.join(stockDir, `photo_${i}.jpg`);
          await downloadStockPhoto(photo, dest);
          resolvedPath = dest;
          (beat as any).mediaType = 'image';
          beat.kenBurns = true;
          stockPhotoCount++;
          console.log(`  [Beat ${String(i + 1).padStart(2, '0')}/${timedBeatsRaw.length}] (${dur}s) 📷 Stock Photo [${photo.source}]: "${photo.title.slice(0, 35)}"`);
        }
      } catch (err: any) {
        console.warn(`  ⚠️ Stock photo fallback error:`, err.message);
      }
    }

    // D. Secondary photo fallback: General documentary urban/workshop photo
    if (!resolvedPath) {
      try {
        const broadQuery = i % 2 === 0 ? 'urban street sidewalk daylight' : 'carpentry tools wood workshop';
        const photo = await findStockPhoto(broadQuery, usedMediaUrls, { useVisionVerification: false });
        if (photo) {
          const dest = path.join(stockDir, `photo_${i}.jpg`);
          await downloadStockPhoto(photo, dest);
          resolvedPath = dest;
          (beat as any).mediaType = 'image';
          beat.kenBurns = true;
          stockPhotoCount++;
          console.log(`  [Beat ${String(i + 1).padStart(2, '0')}/${timedBeatsRaw.length}] (${dur}s) 📷 Broad Stock Photo [${photo.source}]: "${photo.title.slice(0, 35)}"`);
        }
      } catch (err: any) {
        console.warn(`  ⚠️ Broad stock photo fallback error:`, err.message);
      }
    }

    // E. Safety fallback: Assign local beauty shot only if network completely unavailable
    if (!resolvedPath) {
      const defaultLocal = path.join(RAW_DIR, 'Home from ouside - clear picuture.jpg');
      if (fs.existsSync(defaultLocal)) {
        resolvedPath = defaultLocal;
        (beat as any).mediaType = 'image';
        beat.kenBurns = true;
        console.log(`  [Beat ${String(i + 1).padStart(2, '0')}/${timedBeatsRaw.length}] (${dur}s) 🛡️ Safety Fallback: Home from ouside - clear picuture.jpg`);
      }
    }

    timedBeats.push({
      ...beat,
      resolvedPath: resolvedPath
        ? path.isAbsolute(resolvedPath) && resolvedPath.startsWith(rootApiDir)
          ? path.relative(rootApiDir, resolvedPath)
          : resolvedPath
        : null,
    });
  }

  // 6. Build Timeline
  const timeline = buildTimeline({
    masterAudioPath: path.relative(rootApiDir, masterAudioPath),
    outputPath: path.relative(rootApiDir, path.join(outDir, 'final_video.mp4')),
    timedBeats,
    alignments,
    chapterTimings: [{ chapter: chapterIndex, start: 0, end: duration, duration }],
    numberCallouts,
  });

  const timelineJsonPath = path.join(outDir, 'timeline.json');
  fs.writeFileSync(timelineJsonPath, JSON.stringify(timeline, null, 2), 'utf8');
  console.log(`\n💾 Saved Staged Timeline: ${timelineJsonPath}`);

  // 7. Update store with status: 'staged' for dashboard review!
  const jobId = uuidv4();
  jobsStore.create({
    id: jobId,
    projectId: PROJECT_ID,
    chapterId: chapter.id,
    chapterIndex,
    status: 'completed',
    step: 'completed',
    timelineJson: timeline,
    outputPath: timelineJsonPath,
  });

  const chapterPatch = {
    title: chapter.title,
    description: `Fast-paced documentary cut (${timedBeats.length} cuts, <5.0s pacing). ${localClipCount} authentic RAW matches, ${stockVideoCount} stock videos, ${stockPhotoCount} photos.`,
    scriptText: effectiveScript,
    voiceoverFileName: audioFileName,
    clipLibraryRoot: RAW_DIR,
    pacing: 'high' as const,
    status: 'staged' as const, // Storyboard ready for dashboard review!
    timelineJson: timeline,
    updatedAt: new Date().toISOString(),
  };

  chaptersStore.update(PROJECT_ID, chapter.id, chapterPatch);

  const chIdx = chapters.findIndex((c) => c.chapterIndex === chapterIndex);
  if (chIdx !== -1) {
    chapters[chIdx] = { ...chapters[chIdx]!, ...chapterPatch };
    projectsStore.update(PROJECT_ID, { chapters });
  }

  if (newlyUsedMedia.length > 0) {
    projectsStore.addUsedMedia(PROJECT_ID, newlyUsedMedia);
  }

  console.log(`✅ [CHAPTER ${String(chapterIndex).padStart(2, '0')}] STAGED SUCCESSFULLY!`);
  console.log(`   • Total Cuts: ${timedBeats.length}`);
  console.log(`   • Authentic RAW Clips: ${localClipCount}`);
  console.log(`   • Stock B-Roll Videos: ${stockVideoCount}`);
  console.log(`   • High-Res Photos: ${stockPhotoCount}`);
  console.log(`   • Status: STAGED (Ready for dashboard review)`);
}

async function runAllChapters() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 [PHASE 2] FULL DOCUMENTARY STORYBOARD STAGING (ALL 11 CHAPTERS)');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`📁 Project ID: ${PROJECT_ID}`);
  console.log(`📁 Local RAW Clips: ${RAW_DIR}`);
  console.log(`⚡ Pacing: Fast & Punchy (< 5.0s max cut)`);
  console.log(`🚫 OpenRouter Dependency: ZERO (100% Antigravity Director)`);

  const startTime = Date.now();

  for (let ch = 1; ch <= 11; ch++) {
    await processChapterPhase2(ch);
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🎉 [PHASE 2 COMPLETE] ALL 11 CHAPTERS STAGED IN ${totalTime}s!`);
  console.log(`👉 Review Live Dashboard: http://localhost:3000/project/${PROJECT_ID}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

runAllChapters().catch((err) => {
  console.error('Fatal staging error:', err);
  process.exit(1);
});
