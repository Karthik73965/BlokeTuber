import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

async function main() {
  console.log('====================================================');
  console.log('🎬 SEQUENTIAL PRODUCTION RENDER: WHITE HOME DOCUMENTARY');
  console.log('   High-Performance 8-Worker Concurrency per Chapter');
  console.log('====================================================');

  const rootDir = path.resolve(__dirname, '../../..');
  const entryPoint = path.resolve(rootDir, 'packages/remotion-video/src/index.ts');
  const outDir = path.resolve(rootDir, 'output/white_home/review');
  const stillsDir = path.resolve(outDir, 'stills');
  const brainDir = 'C:/Users/karth/.gemini/antigravity-cli/brain/a521e0b0-65c1-4498-b0b2-c77d21ee3b5a';

  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(stillsDir, { recursive: true });

  console.log('\n[Bundle] Bundling Remotion project...');
  const t0Bundle = Date.now();
  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });
  console.log(`[Bundle] Success in ${((Date.now() - t0Bundle) / 1000).toFixed(1)}s! Serving at: ${serveUrl}`);

  const chapters = [
    {
      id: 'WhiteHome-Chapter0-Hook',
      filename: 'ch0_hook_overhaul.mp4',
      label: 'Chapter 0: The Hook (80.7s)',
      snapSecs: [2, 10, 20, 28, 35, 41, 48, 58, 70],
    },
    {
      id: 'WhiteHome-Chapter1-Physics',
      filename: 'ch1_physics_overhaul.mp4',
      label: 'Chapter 1: The Physics (159.2s)',
      snapSecs: [5, 12, 28, 38, 43, 48, 53, 56, 60, 64, 75, 88, 102, 118, 135, 148, 155],
    },
    {
      id: 'WhiteHome-Chapter2-PeoplePain',
      filename: 'ch2_pain_overhaul.mp4',
      label: 'Chapter 2: The People Paint (75.2s)',
      snapSecs: [2, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72],
    },
    {
      id: 'WhiteHome-Chapter3-Health',
      filename: 'ch3_health_overhaul.mp4',
      label: 'Chapter 3: Hidden Health Reason (170.5s)',
      snapSecs: [5, 15, 30, 45, 60, 75, 90, 105, 120, 135, 150, 165],
    },
    {
      id: 'WhiteHome-Chapter4-Ritual',
      filename: 'ch4_ritual_overhaul.mp4',
      label: 'Chapter 4: The Ritual (53.6s)',
      snapSecs: [5, 15, 25, 35, 45],
    },
    {
      id: 'WhiteHome-Chapter5-Closing',
      filename: 'ch5_closing_overhaul.mp4',
      label: 'Chapter 5: Closing (168.4s)',
      snapSecs: [5, 20, 40, 60, 80, 100, 120, 140, 160],
    },
  ];

  const filter = process.argv[2];
  const activeChapters = filter
    ? chapters.filter((c) => c.id.toLowerCase().includes(filter.toLowerCase()) || c.filename.toLowerCase().includes(filter.toLowerCase()))
    : chapters;

  const tStartAll = Date.now();

  for (let i = 0; i < activeChapters.length; i++) {
    const item = activeChapters[i];
    const outPath = path.resolve(outDir, item.filename);
    console.log('\n====================================================');
    console.log(`[${i + 1}/${activeChapters.length}] 🎬 RENDERING ${item.label}...`);
    console.log(`Target: ${outPath}`);
    console.log('====================================================');

    const composition = await selectComposition({
      serveUrl,
      id: item.id,
    });
    console.log(`[Composition] Loaded ${composition.id} (${composition.durationInFrames} frames @ ${composition.fps}fps)`);

    const t0 = Date.now();
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outPath,
      concurrency: 8, // Optimized 8-worker concurrency for Ryzen 7 16-core CPU
      onProgress: ({ progress, renderedFrames }) => {
        const pct = Math.round(progress * 100);
        if (renderedFrames % 300 === 0 || pct === 100) {
          const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
          const fps = (renderedFrames / ((Date.now() - t0) / 1000)).toFixed(1);
          console.log(`  [Progress] ${pct}% (${renderedFrames}/${composition.durationInFrames} frames, ${elapsed}s elapsed, ${fps} fps)`);
        }
      },
    });

    const elapsedTotal = ((Date.now() - t0) / 1000).toFixed(1);
    const sizeMb = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(2);
    console.log(`✓ [Complete] ${item.label} rendered in ${elapsedTotal}s! Size: ${sizeMb} MB`);

    // Extract stills
    for (const sec of item.snapSecs) {
      const snapPath = path.resolve(stillsDir, `${item.filename.replace('.mp4', '')}_${sec}s.jpg`);
      try {
        execSync(`ffmpeg -y -ss ${sec} -i "${outPath}" -frames:v 1 -update 1 "${snapPath}"`, { stdio: 'ignore' });
      } catch (e) {
        // ignore
      }
    }
  }

  const allRenderElapsed = ((Date.now() - tStartAll) / 1000).toFixed(1);
  console.log(`\n🎉 All ${activeChapters.length} chapter renders complete in ${allRenderElapsed}s!`);

  // If all 6 chapters rendered, stitch lossless Master video!
  if (!filter || activeChapters.length === 6) {
    console.log('\n====================================================');
    console.log('🔗 LOSSLESS STITCHING FULL 11m 47s MASTER DOCUMENTARY...');
    console.log('====================================================');

    const concatListPath = path.resolve(outDir, 'concat_list.txt');
    const concatContent = chapters
      .map((c) => `file '${path.resolve(outDir, c.filename).replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(concatListPath, concatContent, 'utf-8');

    const masterReviewPath = path.resolve(outDir, 'WhiteHome_Master_Overhaul.mp4');
    const masterRootPath = path.resolve(rootDir, 'output/white_home/WhiteHome_Master_Overhaul.mp4');

    execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterReviewPath}"`, {
      stdio: 'inherit',
    });

    fs.copyFileSync(masterReviewPath, masterRootPath);
    const masterSizeMb = (fs.statSync(masterReviewPath).size / (1024 * 1024)).toFixed(2);
    console.log(`\n✓ Master Video Stitched Successfully: ${masterReviewPath} (${masterSizeMb} MB)`);
    console.log(`✓ Copied to Root Output: ${masterRootPath}`);

    // Snapshot master verification points
    const masterSnaps = [
      { sec: 15, label: 'ch0_hook' },
      { sec: 85, label: 'ch1_physics_start' },
      { sec: 140, label: 'ch1_car_physics' },
      { sec: 245, label: 'ch2_people_paint_start' },
      { sec: 275, label: 'ch2_quarry_worker' },
      { sec: 320, label: 'ch3_health_start' },
      { sec: 380, label: 'ch3_microscope_disinfection' },
      { sec: 430, label: 'ch3_greek_decree' },
      { sec: 490, label: 'ch4_ritual_start' },
      { sec: 515, label: 'ch4_family_painting' },
      { sec: 545, label: 'ch5_closing_start' },
      { sec: 620, label: 'ch5_postcard_illusion' },
      { sec: 700, label: 'ch5_closing_end' },
    ];

    console.log('\nExtracting Master verification stills...');
    for (const pt of masterSnaps) {
      const snapPath = path.resolve(stillsDir, `master_${pt.sec}s_${pt.label}.jpg`);
      try {
        execSync(`ffmpeg -y -ss ${pt.sec} -i "${masterReviewPath}" -frames:v 1 -update 1 "${snapPath}"`, {
          stdio: 'ignore',
        });
        if (fs.existsSync(brainDir)) {
          fs.copyFileSync(snapPath, path.join(brainDir, path.basename(snapPath)));
        }
        console.log(`  📷 Snap at ${pt.sec}s: ${path.basename(snapPath)}`);
      } catch (e) {
        // ignore
      }
    }
  }

  console.log('\n====================================================');
  console.log('🏆 COMPLETE PIPELINE FINISHED SUCCESSFULLY!');
  console.log('====================================================');
}

main().catch((err) => {
  console.error('Render Error:', err);
  process.exit(1);
});
