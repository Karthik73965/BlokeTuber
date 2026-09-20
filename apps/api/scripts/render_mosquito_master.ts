import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

async function main() {
  console.log('===========================================================');
  console.log('🎬 RENDERING MOSQUITO MAGNET MASTER DOCUMENTARY (7 CHAPTERS)');
  console.log('===========================================================');

  const rootDir = path.resolve(__dirname, '../../..');
  const entryPoint = path.resolve(rootDir, 'packages/remotion-video/src/index.ts');
  const outDir = path.resolve(rootDir, 'output/mosquito');
  const stillsDir = path.resolve(outDir, 'stills');
  const brainDir = 'C:/Users/karth/.gemini/antigravity-cli/brain/d23a4d68-4217-4718-8a89-92e76fa11e4f';

  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(stillsDir, { recursive: true });
  if (fs.existsSync(brainDir)) {
    fs.mkdirSync(path.resolve(brainDir, 'stills'), { recursive: true });
  }

  console.log('\n[Bundle] Bundling Remotion project...');
  const t0Bundle = Date.now();
  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });
  console.log(`[Bundle] Success in ${((Date.now() - t0Bundle) / 1000).toFixed(1)}s! Serving at: ${serveUrl}`);

  const compositionId = 'Mosquito-Master';
  const outPath = path.resolve(outDir, 'mosquito_master_full.mp4');

  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
  });
  console.log(`[Composition] Loaded ${composition.id} (${composition.durationInFrames} frames @ ${composition.fps}fps, ~${(composition.durationInFrames / composition.fps / 60).toFixed(1)} min)`);

  const t0 = Date.now();
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: outPath,
    concurrency: 6,
    onProgress: ({ progress, renderedFrames }) => {
      const pct = Math.round(progress * 100);
      if (renderedFrames % 500 === 0 || pct === 100) {
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const fps = (renderedFrames / ((Date.now() - t0) / 1000)).toFixed(1);
        console.log(`  [Progress] ${pct}% (${renderedFrames}/${composition.durationInFrames} frames, ${elapsed}s elapsed, ${fps} fps)`);
      }
    },
  });

  const elapsedTotal = ((Date.now() - t0) / 1000).toFixed(1);
  const sizeMb = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✓ [Complete] Master video rendered in ${elapsedTotal}s! File size: ${sizeMb} MB`);
  console.log(`Output master video saved to: ${outPath}`);

  // Snapshot still frames across all 7 chapters
  // Ch0: 20s, 60s | Ch1: 110s, 150s | Ch2: 210s, 260s | Ch3: 320s, 370s | Ch4: 420s, 440s | Ch5: 475s, 510s | Ch6: 550s, 575s
  const snapSecs = [20, 60, 110, 150, 210, 260, 320, 370, 420, 440, 475, 510, 550, 575];
  console.log('\n📸 Extracting master review stills across all 7 chapters...');
  for (const sec of snapSecs) {
    const snapName = `master_${sec}s.jpg`;
    const snapPath = path.resolve(stillsDir, snapName);
    try {
      execSync(`ffmpeg -y -ss ${sec} -i "${outPath}" -frames:v 1 -update 1 "${snapPath}"`, { stdio: 'ignore' });
      console.log(`  Captured still: ${snapName}`);
      if (fs.existsSync(brainDir)) {
        fs.copyFileSync(snapPath, path.resolve(brainDir, snapName));
      }
    } catch (err) {
      console.error(`  Failed capturing ${snapName}:`, err);
    }
  }

  console.log('\n✨ Master render complete! Ready for viewing.');
}

main().catch((err) => {
  console.error('Fatal error during master render:', err);
  process.exit(1);
});
