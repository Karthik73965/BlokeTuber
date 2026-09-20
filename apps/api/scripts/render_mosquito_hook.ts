import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

async function main() {
  console.log('====================================================');
  console.log('🎬 RENDERING CHAPTER 0: COLD OPEN / HOOK (MOSQUITO)');
  console.log('====================================================');

  const rootDir = path.resolve(__dirname, '../../..');
  const entryPoint = path.resolve(rootDir, 'packages/remotion-video/src/index.ts');
  const outDir = path.resolve(rootDir, 'output/mosquito');
  const stillsDir = path.resolve(outDir, 'stills');
  const brainDir = 'C:/Users/karth/.gemini/antigravity-cli/brain/c6bce733-65b1-46cb-9b89-7d90cfdec52b';

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

  const compositionId = 'Mosquito-Chapter0-Hook';
  const outPath = path.resolve(outDir, 'ch0_hook.mp4');

  const composition = await selectComposition({
    serveUrl,
    id: compositionId,
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
      if (renderedFrames % 150 === 0 || pct === 100) {
        const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
        const fps = (renderedFrames / ((Date.now() - t0) / 1000)).toFixed(1);
        console.log(`  [Progress] ${pct}% (${renderedFrames}/${composition.durationInFrames} frames, ${elapsed}s elapsed, ${fps} fps)`);
      }
    },
  });

  const elapsedTotal = ((Date.now() - t0) / 1000).toFixed(1);
  const sizeMb = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(2);
  console.log(`\n✓ [Complete] Rendered in ${elapsedTotal}s! File size: ${sizeMb} MB`);
  console.log(`Output video saved to: ${outPath}`);

  // Extract snapshot still frames across beats to inspect visual quality
  const snapSecs = [3, 8, 14, 20, 26, 30, 34, 40, 46];
  console.log('\n📸 Extracting review stills...');
  for (const sec of snapSecs) {
    const snapName = `hook_${sec}s.jpg`;
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

  console.log('\n✨ All done! Ready for user review.');
}

main().catch((err) => {
  console.error('Fatal error during render:', err);
  process.exit(1);
});
