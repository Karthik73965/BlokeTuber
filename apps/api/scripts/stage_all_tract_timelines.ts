import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import {
  findStockFootage,
  findStockPhoto,
  downloadStockVideo,
  downloadStockPhoto,
} from '../src/services/stockFootage';
import { getAudioDuration } from '../src/services/audioAssembly';
import type { Timeline, TimelineClip, SceneLayoutType, CalloutOverlay, OverlayType, TransitionType } from '@repo/shared';

// Load environment variables
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Tract\\Raw';
const AUDIO_DIR = path.resolve(process.cwd(), 'uploads', 'audio');
const TRANSCRIPTS_DIR = path.resolve(process.cwd(), 'uploads', 'transcripts', 'tract');
const OUTPUT_DIR = path.resolve(process.cwd(), 'apps', 'api', 'output');
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

interface PlannedBeatData {
  beatIndex: number;
  chapterIndex: number;
  text: string;
  startTime: number;
  endTime: number;
  visualSubject?: string;
  mediaType?: 'video' | 'image';
  layout?: SceneLayoutType;
  layoutData?: any;
  overlay?: OverlayType;
  transition?: TransitionType;
  clipFilename?: string | null;
  stockVideoQuery?: string | null;
  backupVideoQuery?: string | null;
  stockPhotoQuery?: string | null;
  negativeKeywords?: string[];
  additionalStockQueries?: Array<{ slot: string; query: string; mediaType: 'video' | 'image' }>;
  callout?: CalloutOverlay | null;
}

function generateJobFolderName(chapterNum: number, shortId: string): string {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const timeStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
  return `tract_ch${chapterNum}_${timeStr}_${shortId}`;
}

// Concurrency pool helper
async function mapConcurrent<T, R>(items: T[], concurrency: number, fn: (item: T, idx: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIdx = 0;

  async function worker(workerId: number) {
    while (nextIdx < items.length) {
      const idx = nextIdx++;
      console.log(`\n[Worker ${workerId}] 🚀 Starting Chapter Item ${idx + 1}/${items.length}...`);
      results[idx] = await fn(items[idx]!, idx);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, (_, i) => worker(i + 1));
  await Promise.all(workers);
  return results;
}

async function stageChapter(
  project: any,
  chapterIndex: number,
  globalUsedUrls: Set<string>
): Promise<{
  chapterIndex: number;
  title: string;
  beatCount: number;
  localMatches: number;
  stockVideos: number;
  stockPhotos: number;
  success: boolean;
  error?: string;
}> {
  const numStr = String(chapterIndex).padStart(2, '0');
  const planPath = path.join(TRANSCRIPTS_DIR, `${numStr}_planned_beats.json`);

  if (!fs.existsSync(planPath)) {
    throw new Error(`Planned beats not found for chapter ${chapterIndex}: ${planPath}`);
  }

  const chapter = chaptersStore.forProject(project.id).find((c) => c.chapterIndex === chapterIndex);
  if (!chapter) {
    throw new Error(`Chapter ${chapterIndex} not found in database!`);
  }

  const plannedBeats: PlannedBeatData[] = JSON.parse(fs.readFileSync(planPath, 'utf-8'));
  const audioFilename = chapter.voiceoverFileName || '';
  const audioPath = path.join(AUDIO_DIR, audioFilename);

  if (!fs.existsSync(audioPath)) {
    throw new Error(`Audio file not found: ${audioPath}`);
  }

  const totalDuration = await getAudioDuration(audioPath);
  const jobId = uuidv4().slice(0, 6);
  const folderName = generateJobFolderName(chapterIndex, jobId);
  const jobOutputDir = path.join(OUTPUT_DIR, folderName);
  const stockDir = path.join(jobOutputDir, 'stock');
  fs.mkdirSync(stockDir, { recursive: true });

  console.log(`\n───────────────────────────────────────────────────────────────────`);
  console.log(`🎬 STAGING [Chapter ${numStr}]: "${chapter.title}" (${plannedBeats.length} beats, ${totalDuration.toFixed(1)}s)`);
  console.log(`   Output Folder: ${folderName}`);
  console.log(`───────────────────────────────────────────────────────────────────`);

  const localRawFiles = fs.existsSync(RAW_DIR) ? fs.readdirSync(RAW_DIR) : [];
  let localMatches = 0;
  let stockVideos = 0;
  let stockPhotos = 0;
  const newlyUsedMedia: any[] = [];

  const timelineClips: TimelineClip[] = [];

  for (let i = 0; i < plannedBeats.length; i++) {
    const beat = plannedBeats[i]!;
    let resolvedClipPath: string | null = null;
    let finalMediaType: 'video' | 'image' = beat.mediaType || 'video';
    let secondaryClipPath: string | null = null;
    let secondaryMediaType: 'video' | 'image' = 'video';
    let stockSource: string | undefined;
    let stockUrl: string | undefined;

    // 1. Check Local Raw Clip
    if (beat.clipFilename) {
      const localCandidate = path.join(RAW_DIR, beat.clipFilename);
      if (fs.existsSync(localCandidate)) {
        resolvedClipPath = localCandidate;
        if (/\.(jpg|jpeg|png|webp)$/i.test(beat.clipFilename)) {
          finalMediaType = 'image';
        } else {
          finalMediaType = 'video';
        }
        localMatches++;
        console.log(`  ✓ Beat ${i}: [LOCAL] ${beat.clipFilename} (${finalMediaType})`);
      }
    }

    // 2. Stock Video Search via Pexels / Pixabay
    if (!resolvedClipPath && (beat.stockVideoQuery || beat.backupVideoQuery)) {
      const q = beat.stockVideoQuery || beat.backupVideoQuery || '';
      try {
        const stockResult = await findStockFootage(q, beat.backupVideoQuery, globalUsedUrls, {
          visualSubject: beat.visualSubject,
          negativeKeywords: beat.negativeKeywords,
          useVisionVerification: false, // Use fast keyword scoring
        });

        if (stockResult?.video) {
          const dest = path.join(stockDir, `video_${i}.mp4`);
          await downloadStockVideo(stockResult.video, dest);
          resolvedClipPath = dest;
          finalMediaType = 'video';
          stockSource = stockResult.video.source;
          stockUrl = stockResult.video.url;
          globalUsedUrls.add(stockResult.video.url);
          newlyUsedMedia.push({
            id: stockResult.video.url,
            url: stockResult.video.url,
            source: stockResult.video.source,
            mediaType: 'video',
            chapterIndex,
            query: q,
          });
          stockVideos++;
          console.log(`  ✓ Beat ${i}: [STOCK VIDEO] (${stockResult.video.source}) ${stockResult.video.title?.slice(0, 35)}`);
        }
      } catch (err: any) {
        console.warn(`  ⚠️ Stock video download failed for Beat ${i}:`, err?.message);
      }
    }

    // 3. Stock Photo Search fallback
    if (!resolvedClipPath) {
      const photoQ = beat.stockPhotoQuery || beat.stockVideoQuery || beat.text.slice(0, 40);
      try {
        const photoResult = await findStockPhoto(photoQ, globalUsedUrls, {
          visualSubject: beat.visualSubject,
          negativeKeywords: beat.negativeKeywords,
          useVisionVerification: false,
        });

        if (photoResult) {
          const dest = path.join(stockDir, `photo_${i}.jpg`);
          await downloadStockPhoto(photoResult, dest);
          resolvedClipPath = dest;
          finalMediaType = 'image';
          stockSource = photoResult.source;
          stockUrl = photoResult.url;
          globalUsedUrls.add(photoResult.url);
          newlyUsedMedia.push({
            id: photoResult.id || photoResult.url,
            url: photoResult.url,
            source: photoResult.source,
            mediaType: 'image',
            chapterIndex,
            query: photoQ,
          });
          stockPhotos++;
          console.log(`  ✓ Beat ${i}: [STOCK PHOTO] (${photoResult.source}) ${photoResult.title?.slice(0, 35)}`);
        }
      } catch (err: any) {
        console.warn(`  ⚠️ Stock photo download failed for Beat ${i}:`, err?.message);
      }
    }

    // 4. Safe Fallback to local raw clip if nothing found
    if (!resolvedClipPath && localRawFiles.length > 0) {
      const fallbackFile = localRawFiles[i % localRawFiles.length]!;
      resolvedClipPath = path.join(RAW_DIR, fallbackFile);
      finalMediaType = /\.(jpg|jpeg|png|webp)$/i.test(fallbackFile) ? 'image' : 'video';
      console.log(`  ✓ Beat ${i}: [RAW FALLBACK] ${fallbackFile}`);
    }

    // 5. Multi-Asset Secondary Clip Resolution (e.g. for split_dual_screen)
    if (beat.layout === 'split_dual_screen' || (beat.additionalStockQueries && beat.additionalStockQueries.length > 0)) {
      const secQuery = beat.additionalStockQueries?.[0]?.query || beat.backupVideoQuery || 'eugene oregon';
      try {
        const secPhoto = await findStockPhoto(secQuery, globalUsedUrls, { useVisionVerification: false });
        if (secPhoto) {
          const secDest = path.join(stockDir, `secondary_${i}.jpg`);
          await downloadStockPhoto(secPhoto, secDest);
          secondaryClipPath = secDest;
          secondaryMediaType = 'image';
          globalUsedUrls.add(secPhoto.url);
        }
      } catch {}
    }

    const isImage = finalMediaType === 'image';

    timelineClips.push({
      beatIndex: beat.beatIndex,
      chapterIndex: beat.chapterIndex,
      text: beat.text,
      startTime: beat.startTime,
      endTime: beat.endTime,
      clipPath: resolvedClipPath,
      secondaryClipPath: secondaryClipPath || undefined,
      additionalClipPaths: secondaryClipPath ? [secondaryClipPath] : [],
      mediaType: finalMediaType,
      secondaryMediaType: secondaryClipPath ? secondaryMediaType : undefined,
      layout: beat.layout || 'full_bleed_cinematic',
      layoutData: beat.layoutData || undefined,
      stockSource,
      stockUrl,
      stockVideoQuery: beat.stockVideoQuery || null,
      backupVideoQuery: beat.backupVideoQuery || null,
      stockPhotoQuery: beat.stockPhotoQuery || null,
      kenBurns: isImage,
      transitionType: beat.transition || 'cut',
      transitionDuration: beat.transition === 'cut' ? 0 : 0.4,
      numberOverlays: [],
      callout: beat.callout || null,
      overlay: beat.overlay || undefined,
    });
  }

  // Assemble Timeline JSON
  const timeline: Timeline = {
    masterAudioPath: path.relative(process.cwd(), audioPath).replace(/\\/g, '/'),
    totalDuration,
    clips: timelineClips,
    outputPath: path.join(jobOutputDir, 'timeline.json').replace(/\\/g, '/'),
  };

  const timelineJsonPath = path.join(jobOutputDir, 'timeline.json');
  fs.writeFileSync(timelineJsonPath, JSON.stringify(timeline, null, 2), 'utf-8');

  // Update Database
  chaptersStore.update(project.id, chapter.id, {
    status: 'staged',
    timelineJson: timeline as any,
    clipLibraryRoot: RAW_DIR,
  });

  if (newlyUsedMedia.length > 0) {
    projectsStore.addUsedMedia(project.id, newlyUsedMedia);
  }

  console.log(`✅ [Chapter ${numStr}] Successfully Staged: ${timelineClips.length} beats (${localMatches} RAW clips, ${stockVideos} stock videos, ${stockPhotos} stock photos)`);
  console.log(`   Saved timeline: ${timelineJsonPath}`);

  return {
    chapterIndex,
    title: chapter.title,
    beatCount: timelineClips.length,
    localMatches,
    stockVideos,
    stockPhotos,
    success: true,
  };
}

async function run() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 [FAST BATCH STAGING] SOURCING CLIPS & BUILDING ALL TIMELINES');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`📁 Local RAW Clips: ${RAW_DIR}`);
  console.log(`⚡ Concurrency: 2 Parallel Chapters`);

  const project = projectsStore.all().find((p) => p.name.toLowerCase() === 'tract');
  if (!project) {
    throw new Error('Project "Tract" not found in store!');
  }

  const globalUsedUrls = new Set<string>();
  const existingMedia = projectsStore.getUsedMedia(project.id);
  for (const m of existingMedia) {
    if (m.url) globalUsedUrls.add(m.url);
    if (m.id) globalUsedUrls.add(m.id);
  }

  const chapterIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const startTime = Date.now();

  const results = await mapConcurrent(chapterIndices, 2, async (chIdx) => {
    try {
      return await stageChapter(project, chIdx, globalUsedUrls);
    } catch (err: any) {
      console.error(`❌ Error staging Chapter ${chIdx}:`, err?.message);
      return {
        chapterIndex: chIdx,
        title: `Chapter ${chIdx}`,
        beatCount: 0,
        localMatches: 0,
        stockVideos: 0,
        stockPhotos: 0,
        success: false,
        error: err?.message,
      };
    }
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🎉 ALL CHAPTERS STAGED IN ${elapsed}s`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  console.table(results);
}

run().catch((err) => {
  console.error('Fatal staging error:', err);
  process.exit(1);
});
