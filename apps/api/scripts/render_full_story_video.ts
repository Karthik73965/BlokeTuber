import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log('====================================================');
  console.log('[Render Story] Rendering Full 66s Animated Story Video...');
  console.log('====================================================');

  const rootDir = path.resolve(__dirname, '../../..');
  const entryPoint = path.resolve(rootDir, 'packages/remotion-video/src/index.ts');
  const outDir = path.resolve(rootDir, 'output');
  fs.mkdirSync(outDir, { recursive: true });
  const finalVideoOutput = path.resolve(outDir, 'white_villages_animated_story.mp4');

  console.log('[Bundle] Bundling Remotion project...');
  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });
  console.log('[Bundle] Success! Serving at:', serveUrl);

  const composition = await selectComposition({
    serveUrl,
    id: 'WhiteVillagesExplainer',
  });
  console.log(`[Composition] Loaded ${composition.id} (${composition.durationInFrames} frames, ${composition.width}x${composition.height} @ ${composition.fps}fps)`);

  const startTime = Date.now();
  console.log(`[RenderMedia] Rendering to ${finalVideoOutput}...`);

  let lastPct = -1;
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: finalVideoOutput,
    concurrency: 6,
    onProgress: ({ progress }) => {
      const pct = Math.floor(progress * 100);
      if (pct !== lastPct && pct % 10 === 0) {
        lastPct = pct;
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`  [Progress] ${pct}% rendered (${elapsed}s elapsed)...`);
      }
    },
  });

  const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
  const fileSizeMB = (fs.statSync(finalVideoOutput).size / (1024 * 1024)).toFixed(2);
  console.log('====================================================');
  console.log(`? RENDER COMPLETE in ${durationSec}s!`);
  console.log(`?? File: ${finalVideoOutput} (${fileSizeMB} MB)`);
  console.log('====================================================');
}

main().catch((err) => {
  console.error('Fatal render error:', err);
  process.exit(1);
});
