import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

async function main() {
  console.log('====================================================');
  console.log('🎬 SEQUENTIAL PRODUCTION RENDER: PIG MILK DOCUMENTARY');
  console.log('   High-Performance 8-Worker Concurrency per Chapter');
  console.log('====================================================');

  const rootDir = path.resolve(__dirname, '../../..');
  const entryPoint = path.resolve(rootDir, 'packages/remotion-video/src/index.ts');
  const outDir = path.resolve(rootDir, 'output/pig_milk');
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
      id: 'PigMilk-Chapter1-Hook',
      filename: 'ch1_hook.mp4',
      label: 'Chapter 1: Hook (45.0s)',
      snapSecs: [5, 15, 25, 38],
    },
    {
      id: 'PigMilk-Chapter2-Access',
      filename: 'ch2_access.mp4',
      label: 'Chapter 2: The Access Problem (78.8s)',
      snapSecs: [10, 25, 45, 60, 72],
    },
    {
      id: 'PigMilk-Chapter3-Quantity',
      filename: 'ch3_quantity.mp4',
      label: 'Chapter 3: The Quantity Problem (40.4s)',
      snapSecs: [5, 15, 25, 35],
    },
    {
      id: 'PigMilk-Chapter4-CowsWon',
      filename: 'ch4_cows_won.mp4',
      label: 'Chapter 4: Why Cows Won (67.1s)',
      snapSecs: [10, 25, 40, 55],
    },
    {
      id: 'PigMilk-Chapter5-Processing',
      filename: 'ch5_processing.mp4',
      label: 'Chapter 5: The Processing Problem (81.9s)',
      snapSecs: [10, 25, 45, 65, 75],
    },
    {
      id: 'PigMilk-Chapter6-Domestication',
      filename: 'ch6_domestication.mp4',
      label: 'Chapter 6: Domestication (94.7s)',
      snapSecs: [10, 30, 50, 70, 85],
    },
    {
      id: 'PigMilk-Chapter7-Close',
      filename: 'ch7_close.mp4',
      label: 'Chapter 7: Close & Finale (91.2s)',
      snapSecs: [10, 30, 50, 70, 85],
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

    if (fs.existsSync(outPath) && fs.statSync(outPath).size > 1000000 && !process.env.FORCE_RENDER) {
      console.log(`⏩ [Skip] ${item.label} already rendered (${(fs.statSync(outPath).size / (1024 * 1024)).toFixed(2)} MB). Skipping render.`);
      for (const sec of item.snapSecs) {
        const snapPath = path.resolve(stillsDir, `${item.filename.replace('.mp4', '')}_${sec}s.jpg`);
        if (!fs.existsSync(snapPath)) {
          try {
            execSync(`ffmpeg -y -ss ${sec} -i "${outPath}" -frames:v 1 -update 1 "${snapPath}"`, { stdio: 'ignore' });
          } catch (e) {}
        }
      }
      continue;
    }

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
      concurrency: 8,
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

  // If all 7 chapters rendered, stitch lossless Master video!
  if (!filter || activeChapters.length === 7) {
    console.log('\n====================================================');
    console.log('🔗 LOSSLESS STITCHING FULL 8m 19s MASTER DOCUMENTARY...');
    console.log('====================================================');

    const concatListPath = path.resolve(outDir, 'concat_list.txt');
    const concatContent = chapters
      .map((c) => `file '${path.resolve(outDir, c.filename).replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(concatListPath, concatContent, 'utf-8');

    const masterPath = path.resolve(outDir, 'PigMilk_Master_1080p.mp4');

    execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterPath}"`, {
      stdio: 'inherit',
    });

    // Mix in non-copyright background music bed (YouTube Audio Library)
    const bgmPath = path.resolve(rootDir, 'packages/remotion-video/public/audio/Way Back Home - Simon Herody.mp3');
    if (fs.existsSync(bgmPath)) {
      console.log('\n[Audio] 🎵 Mixing non-copyright BGM bed (volume=0.08, voice stays crisp & loud)...');
      const tempMixedPath = path.resolve(outDir, 'temp_master_with_bgm.mp4');
      execSync(
        `ffmpeg -y -i "${masterPath}" -stream_loop -1 -i "${bgmPath}" -filter_complex "[1:a]volume=0.08[bgm];[0:a][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]" -map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 320k "${tempMixedPath}"`,
        { stdio: 'inherit' }
      );
      fs.copyFileSync(tempMixedPath, masterPath);
      try { fs.unlinkSync(tempMixedPath); } catch (e) {}
      console.log('✓ [Audio] BGM bed mixed into Master video losslessly!');
    }

    const masterSizeMb = (fs.statSync(masterPath).size / (1024 * 1024)).toFixed(2);
    console.log(`\n✓ Master Video Stitched Successfully: ${masterPath} (${masterSizeMb} MB)`);

    // Snapshot master verification points
    const masterSnaps = [
      { sec: 4, label: 'ch1_goat_sheep_realism' },
      { sec: 9, label: 'ch1_camel_realism' },
      { sec: 15, label: 'ch1_hook' },
      { sec: 50, label: 'ch2_50s_zoom_fixed' },
      { sec: 70, label: 'ch2_access_sow_teats' },
      { sec: 140, label: 'ch3_quantity_40L_canister' },
      { sec: 180, label: 'ch4_cows_won_grass' },
      { sec: 250, label: 'ch5_processing_curdling' },
      { sec: 350, label: 'ch6_domestication_map' },
      { sec: 440, label: 'ch7_close_cafe_counter' },
    ];

    console.log('\nExtracting Master verification stills...');
    for (const pt of masterSnaps) {
      const snapPath = path.resolve(stillsDir, `master_${pt.sec}s_${pt.label}.jpg`);
      try {
        execSync(`ffmpeg -y -ss ${pt.sec} -i "${masterPath}" -frames:v 1 -update 1 "${snapPath}"`, {
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
  console.log('🏆 PIG MILK DOCUMENTARY PIPELINE FINISHED SUCCESSFULLY!');
  console.log('====================================================');
}

main().catch((err) => {
  console.error('Render Error:', err);
  process.exit(1);
});
