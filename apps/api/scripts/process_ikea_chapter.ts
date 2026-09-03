import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

import { planScriptWithAI, mapPlannedBeatsToTiming } from '../src/services/aiScriptPlanner';
import { alignAudio } from '../src/services/whisperAlignment';
import { findStockFootage, downloadStockVideo } from '../src/services/stockFootage';
import { buildTimeline, TimedPlannedBeat } from '../src/services/timelineBuilder';
import { projectsStore, chaptersStore, jobsStore, UsedMediaItem } from '../src/db/localStore';
import { getAudioDuration } from '../src/services/audioAssembly';
import { DIRECTED_CHAPTER_BEATS } from './direct_ikea_chapters';

export const CHAPTER_CONFIGS = [
  { index: 1, title: 'Chapter 1: The Parking Lot & The Hook', file: '1 - Intro.mp3', jobId: 'f0d69810-12ee-42c4-8037-4dfb718716ea' },
  { index: 2, title: 'Chapter 2: How Renee Ended Up Here', file: '2 - HOW RENEE ENDED UP HERE.mp3', jobId: '01d6e812-2a8b-464b-bc3c-dec93ff7da15' },
  { index: 3, title: 'Chapter 3: The Company Down The Road', file: '3 - THE COMPANY DOWN THE ROAD.mp3', jobId: '967017d3-9d39-46b4-b334-cee7b17154d5' },
  { index: 4, title: 'Chapter 4: What She Saw', file: '4 - WHAT SHE SAW.mp3', jobId: '32bcf6bd-7d0b-4745-8b64-7fbec5c1f378' },
  { index: 5, title: 'Chapter 5: What Changed, and How Fast', file: '5 - WHAT CHANGED, AND HOW FAST.mp3', jobId: '429f5fd6-cf31-4af1-8121-9846290e8b6a' },
  { index: 6, title: 'Chapter 6: The Other Women in the Row', file: '6 - THE OTHER WOMEN IN THE ROW.mp3', jobId: '4ce4749e-2c84-4d4a-b70c-a10a56556f95' },
  { index: 7, title: 'Chapter 7: Where the Design Came From', file: '7  -  WHERE THE DESIGN CAME FROM.mp3', jobId: '7006b0cf-14a0-41b6-bed9-0687940c2a1d' },
  { index: 8, title: "Chapter 8: The Part That Doesn't Add Up", file: "8 - THE PART THAT DOESN'T ADD UP.mp3", jobId: '8790f1a5-7fa6-4c78-bb0b-85309132bc2a' },
  { index: 9, title: "Chapter 9: This Isn't a Clean Story", file: "9 - THIS ISN'T A CLEAN STORY.mp3", jobId: '8bef417e-7750-41de-92e6-80da3addb270' },
  { index: 10, title: 'Chapter 10: Why the Part Before the Crisis Matters Most', file: '10 - WHY THE PART BEFORE THE CRISIS MATTERS MOST.mp3', jobId: '68f63f5f-0be9-4dd0-8583-68c3994e3451' },
  { index: 11, title: 'Chapter 11: Where Renee Is Now', file: '11 - WHERE RENEE IS NOW.mp3', jobId: 'f9206941-ad4e-433f-8e58-c350010a938d' },
];

const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\IKEA\\AUD';
const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\IKEA\\RAW';
const PROJECT_ID = 'abac4778-84a5-486b-8675-32161d7885e0';

export async function processChapter(chapterIndex: number): Promise<void> {
  const cfg = CHAPTER_CONFIGS.find((c) => c.index === chapterIndex);
  if (!cfg) throw new Error(`Invalid chapter index: ${chapterIndex}`);

  console.log(`\n======================================================`);
  console.log(`🎬 Processing Chapter ${cfg.index}: "${cfg.title}"`);
  console.log(`======================================================`);

  const audioPath = path.join(AUD_DIR, cfg.file);
  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio file not found: ${audioPath}`);
  }

  // 1. Output directory
  const rootApiDir = path.resolve(__dirname, '..');
  const rootOutputDir = path.join(rootApiDir, 'output');
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const hash = Math.random().toString(36).slice(2, 8);
  const outDirName = `ikea_ch${cfg.index}_${timestamp}_${hash}`;
  const outDir = path.join(rootOutputDir, outDirName);
  const stockDir = path.join(outDir, 'stock');
  fs.mkdirSync(stockDir, { recursive: true });

  // Copy master narration
  const masterAudioPath = path.join(outDir, 'master_narration.mp3');
  fs.copyFileSync(audioPath, masterAudioPath);

  // 2. Audio duration & alignments
  const duration = await getAudioDuration(masterAudioPath);
  console.log(`⏱️ Narration duration: ${duration.toFixed(2)}s`);

  let alignments: any[] = [];
  const pastJob = jobsStore.findById(cfg.jobId);
  if (pastJob?.beatAlignments?.length) {
    alignments = pastJob.beatAlignments;
    console.log(`🎙️ Reused cached Whisper alignments (${alignments.length} segments)`);
  } else {
    console.log(`🎙️ Running audio alignment via Whisper...`);
    alignments = await alignAudio(masterAudioPath);
  }

  let effectiveScript = alignments.map((a: any) => a.text).join(' ').trim();
  if (!effectiveScript) {
    throw new Error(`Could not get narration text for chapter ${cfg.index}`);
  }
  console.log(`📝 Script text (${effectiveScript.split(/\s+/).length} words):\n"${effectiveScript.slice(0, 120)}..."`);

  // Available raw clips
  const availableLocalClips = fs.existsSync(RAW_DIR)
    ? fs.readdirSync(RAW_DIR).filter((f) => /\.(mp4|mov|webm)$/i.test(f))
    : [];

  // 3. AI Script Planning
  let rawBeats = DIRECTED_CHAPTER_BEATS[cfg.index];
  if (rawBeats && rawBeats.length > 0) {
    console.log(`🎬 Loaded ${rawBeats.length} hand-crafted documentary director beats.`);
  } else {
    console.log(`\n🤖 Calling AI Director for Fast & Punchy beat planning...`);
    const plan = await planScriptWithAI(
      effectiveScript,
      availableLocalClips,
      'IKEA Renton Washington Homelessness & Pallet Shelter Transitional Village',
      cfg.title,
      'high',
      duration
    );
    rawBeats = plan.beats;
    console.log(`📋 AI Director produced ${rawBeats.length} raw beats.`);
  }

  // 4. Time alignment & auto-subdivision (Strictly 1–3s baseline cuts, max 5s callouts)
  console.log(`⏱️ Applying Fast & Punchy timing alignment (hard cap: 5.0s)...`);
  const timedBeatsRaw = mapPlannedBeatsToTiming(rawBeats, alignments, duration, 'high');
  console.log(`⚡ After auto-subdivision: ${timedBeatsRaw.length} snappy cuts (Max: ${Math.max(...timedBeatsRaw.map(b => b.endTime - b.startTime)).toFixed(2)}s).`);

  // 5. Stock footage & local clip sourcing
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

  for (let i = 0; i < timedBeatsRaw.length; i++) {
    const beat = timedBeatsRaw[i]!;
    const dur = (beat.endTime - beat.startTime).toFixed(2);
    console.log(`  [Beat ${i + 1}/${timedBeatsRaw.length}] (${dur}s) "${beat.text.slice(0, 45)}..."`);

    let resolvedPath: string | null = null;

    // A. Local clip specified directly (strictly once across project)
    if (beat.clipFilename) {
      const localPath = path.join(RAW_DIR, beat.clipFilename);
      if (fs.existsSync(localPath) && !usedMediaUrls.has(localPath)) {
        resolvedPath = localPath;
        usedMediaUrls.add(localPath);
        console.log(`    ✅ Local raw clip (unique): ${beat.clipFilename}`);
      }
    }

    // C. Search Pexels & Pixabay APIs
    if (!resolvedPath && (beat.stockVideoQuery || beat.backupVideoQuery)) {
      const searchOptions = {
        visualSubject: beat.visualSubject,
        negativeKeywords: beat.negativeKeywords,
        useVisionVerification: false, // fast throughput
        storyContext: 'Renton Seattle Washington IKEA parking lot homelessness transitional housing pallet shelters',
      };

      try {
        const stockResult = await findStockFootage(
          beat.stockVideoQuery || '',
          beat.backupVideoQuery,
          usedMediaUrls,
          searchOptions
        );

        if (stockResult?.video) {
          const video = stockResult.video;
          usedMediaUrls.add(video.url);
          const dest = path.join(stockDir, `video_${i}.mp4`);
          await downloadStockVideo(video, dest);
          resolvedPath = dest;
          newlyUsedMedia.push({
            id: video.url,
            url: video.url,
            source: video.source,
            mediaType: 'video',
            chapterIndex: cfg.index,
            query: beat.stockVideoQuery || '',
            usedAt: new Date().toISOString(),
          });
          console.log(`    📹 Downloaded [${video.source}]: "${video.title.slice(0, 35)}"`);
        }
      } catch (err) {
        console.warn(`    ⚠️ Stock search/download error for beat ${i}:`, err);
      }
    }

    // D. Fallback if no video found: borrow from adjacent downloaded video or local clip
    if (!resolvedPath) {
      const downloadedSoFar = fs.readdirSync(stockDir).filter((f) => f.endsWith('.mp4'));
      if (downloadedSoFar.length > 0) {
        resolvedPath = path.join(stockDir, downloadedSoFar[downloadedSoFar.length - 1]!);
      } else if (availableLocalClips.length > 0) {
        resolvedPath = path.join(RAW_DIR, availableLocalClips[0]!);
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
    chapterTimings: [{ chapter: cfg.index, start: 0, end: duration, duration }],
    numberCallouts,
  });

  const timelineJsonPath = path.join(outDir, 'timeline.json');
  fs.writeFileSync(timelineJsonPath, JSON.stringify(timeline, null, 2), 'utf8');
  console.log(`\n💾 Saved timeline to: ${timelineJsonPath}`);

  // 7. Update dashboard database in store
  const project = projectsStore.findById(PROJECT_ID);
  if (project) {
    const chapters = [...(project.chapters || [])];
    const chIdx = chapters.findIndex((c) => c.chapterIndex === cfg.index);

    const chapterPatch = {
      title: cfg.title,
      description: `Fast-paced documentary cut. 1–3s baseline cuts, max 5.0s callouts. Sourced from Pexels & RAW footage.`,
      scriptText: effectiveScript,
      voiceoverFileName: cfg.file,
      clipLibraryRoot: RAW_DIR,
      pacing: 'high' as const,
      status: 'completed' as const,
      timelineJson: timeline,
      videoPath: path.join(outDir, 'final_video.mp4'),
      updatedAt: new Date().toISOString(),
    };

    const resultsDir = path.join(rootOutputDir, 'chapter_results');
    fs.mkdirSync(resultsDir, { recursive: true });
    fs.writeFileSync(path.join(resultsDir, `chapter_${cfg.index}.json`), JSON.stringify({
      index: cfg.index,
      outDir,
      chapterPatch,
      timeline,
      newlyUsedMedia,
    }, null, 2));

    if (chIdx !== -1) {
      chapters[chIdx] = { ...chapters[chIdx]!, ...chapterPatch };
    } else {
      chapters.push({
        id: `ch_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        projectId: PROJECT_ID,
        chapterIndex: cfg.index,
        ...chapterPatch,
        createdAt: new Date().toISOString(),
      });
    }

    projectsStore.update(PROJECT_ID, { chapters });
    if (newlyUsedMedia.length > 0) {
      projectsStore.addUsedMedia(PROJECT_ID, newlyUsedMedia);
    }
    console.log(`✅ Chapter ${cfg.index} marked COMPLETED in BlokeTuber dashboard!`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  const startCh = parseInt(args[0] || '4', 10);
  const endCh = parseInt(args[1] || String(startCh), 10);

  for (let ch = startCh; ch <= endCh; ch++) {
    await processChapter(ch);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal chapter processing error:', err);
    process.exit(1);
  });
}
