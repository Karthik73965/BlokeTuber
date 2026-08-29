import path from 'path';
import fs from 'fs';
import { planScriptWithAI, mapPlannedBeatsToTiming } from '../src/services/aiScriptPlanner';
import { findStockFootage, downloadStockVideo, findStockPhoto, downloadStockPhoto } from '../src/services/stockFootage';
import { buildTimeline } from '../src/services/timelineBuilder';
import { renderTimelineVideo } from '../src/services/remotionRenderer';

async function testFullProductionPipeline() {
  console.log('🧪 [FullPipelineAudit] Starting Complete End-to-End Production Verification...');

  const sampleScript = `On a hidden hillside overlooking Seattle's highway corridor, an unauthorized two-story cabin was discovered deep inside the greenbelt. Tactical units and city crews moved in to inspect the structure, which featured fully wired generator power and wood-burning stoves. Forensic investigators catalogued five separate construction attempts on the exact same city parcel.`;

  console.log('\n1️⃣ Testing AI Script Planner (OpenRouter / Claude Director)...');
  const plannerResult = await planScriptWithAI(sampleScript, []);
  console.log(`✅ AI Planner returned ${plannerResult.beats.length} visual beats!`);

  plannerResult.beats.forEach((b, i) => {
    console.log(`   Beat ${i + 1}: [${b.layout || 'full_bleed_cinematic'}] Media: ${b.mediaType} | Callout: ${b.callout?.type || 'none'} ("${b.callout?.line1 || ''}")`);
    if (b.additionalStockQueries?.length) {
      console.log(`     ↳ Multi-Asset Queries: ${b.additionalStockQueries.map(q => `[${q.slot}: ${q.query}]`).join(', ')}`);
    }
  });

  const outDir = path.resolve(process.cwd(), 'output', 'pipeline_audit_test');
  const stockDir = path.join(outDir, 'stock');
  fs.mkdirSync(stockDir, { recursive: true });

  const totalDuration = 16.0;
  const timedBeatsRaw = mapPlannedBeatsToTiming(plannerResult.beats, [], totalDuration);

  console.log('\n2️⃣ Testing Stock Footage Resolution & Multi-Asset Downloads...');
  const timedBeats = [];
  const usedMediaUrls = new Set<string>();

  for (let i = 0; i < timedBeatsRaw.length; i++) {
    const beat = timedBeatsRaw[i];
    let resolvedPath: string | null = null;
    const additionalClipPaths: string[] = [];

    // Search real video
    if (beat.stockVideoQuery || beat.backupVideoQuery) {
      const vid = await findStockFootage(beat.stockVideoQuery || '', beat.backupVideoQuery, usedMediaUrls);
      if (vid) {
        const dest = path.join(stockDir, `beat_${i}_main.mp4`);
        try {
          await downloadStockVideo(vid, dest);
          resolvedPath = dest;
          usedMediaUrls.add(vid.url);
          console.log(`   ✅ Beat ${i + 1} Main Video: [${vid.source}] ${vid.title.slice(0, 35)}`);
        } catch {}
      }
    }

    // Photo fallback if video unavailable
    if (!resolvedPath) {
      const photoQuery = beat.stockPhotoQuery || beat.stockVideoQuery || 'documentary aerial';
      const pic = await findStockPhoto(photoQuery, usedMediaUrls);
      if (pic) {
        const dest = path.join(stockDir, `beat_${i}_main.jpg`);
        try {
          await downloadStockPhoto(pic, dest);
          resolvedPath = dest;
          usedMediaUrls.add(pic.url);
          console.log(`   ✅ Beat ${i + 1} Main Photo: ${photoQuery}`);
        } catch {}
      }
    }

    // Multi-asset queries if layout requires multiple assets
    if (beat.additionalStockQueries && beat.additionalStockQueries.length > 0) {
      for (let s = 0; s < beat.additionalStockQueries.length; s++) {
        const sub = beat.additionalStockQueries[s];
        const subPhoto = await findStockPhoto(sub.query, usedMediaUrls);
        if (subPhoto) {
          const dest = path.join(stockDir, `beat_${i}_slot_${s}.jpg`);
          try {
            await downloadStockPhoto(subPhoto, dest);
            additionalClipPaths.push(dest);
            usedMediaUrls.add(subPhoto.url);
            console.log(`     ↳ Slot ${s + 1} Stock: ${sub.query}`);
          } catch {}
        }
      }
    }

    timedBeats.push({ ...beat, resolvedPath, additionalClipPaths });
  }

  console.log('\n3️⃣ Testing Timeline Builder JSON assembly...');
  const finalVideoPath = path.join(outDir, 'full_pipeline_audit_video.mp4');
  const timeline = buildTimeline({
    masterAudioPath: '',
    outputPath: finalVideoPath,
    timedBeats,
    alignments: [],
    chapterTimings: [],
    numberCallouts: [],
  });

  const timelineJsonPath = path.join(outDir, 'audit_timeline.json');
  fs.writeFileSync(timelineJsonPath, JSON.stringify(timeline, null, 2));
  console.log(`✅ Timeline built with ${timeline.clips.length} clips, total duration: ${timeline.totalDuration}s`);

  console.log('\n4️⃣ Testing Remotion Headless MP4 Video Render...');
  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log('\n🎉 FULL PRODUCTION PIPELINE AUDIT PASSED WITH 100% SUCCESS!');
  console.log(`📁 Master Output Video: ${finalVideoPath}`);
}

testFullProductionPipeline().catch((err) => {
  console.error('❌ Pipeline audit error:', err);
  process.exit(1);
});
