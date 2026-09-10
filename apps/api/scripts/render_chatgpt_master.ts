import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log('====================================================');
  console.log('[ChatGPT Video Generator] Rendering Full Master Video...');
  console.log('====================================================');

  const entryPoint = path.resolve(__dirname, '../../../packages/remotion-video/src/index.ts');
  const outputDir = path.resolve(__dirname, '../../../output');
  fs.mkdirSync(outputDir, { recursive: true });

  const finalOutput = path.resolve(outputDir, 'chatgpt_astra_ban_master.mp4');

  console.log('[Bundle] Bundling Remotion composition: ' + entryPoint);
  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  console.log('[Select] Selecting composition: ChatGPTVideo...');
  const composition = await selectComposition({
    serveUrl,
    id: 'ChatGPTVideo',
    chromiumOptions: {
      args: [
        '--allow-file-access-from-files',
        '--disable-web-security',
        '--autoplay-policy=no-user-gesture-required',
      ],
    } as any,
  });

  const durationSec = (composition.durationInFrames / composition.fps).toFixed(1);
  console.log('[Specs] Resolution: ' + composition.width + 'x' + composition.height);
  console.log('[Specs] Total Duration: ' + durationSec + ' seconds (' + composition.durationInFrames + ' frames @ ' + composition.fps + 'fps)');
  console.log('[Output] Target: ' + finalOutput);

  const startTime = Date.now();

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: finalOutput,
    timeoutInMilliseconds: 600000,
    concurrency: 4,
    chromiumOptions: {
      args: [
        '--allow-file-access-from-files',
        '--disable-web-security',
        '--autoplay-policy=no-user-gesture-required',
      ],
    } as any,
    onProgress: ({ renderedFrames, totalFrames }: any) => {
      const safeTotal = totalFrames || composition.durationInFrames || 1;
      const percent = Math.min(100, Math.round((renderedFrames / safeTotal) * 100));
      if (renderedFrames % 150 === 0 || renderedFrames === safeTotal) {
        const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
        const fpsRate = (renderedFrames / Math.max(1, (Date.now() - startTime) / 1000)).toFixed(1);
        console.log('[Render Progress] ' + percent + '% (' + renderedFrames + '/' + safeTotal + ' frames) - ' + elapsedSec + 's (' + fpsRate + ' fps)');
      }
    },
  });

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const fileSize = (fs.statSync(finalOutput).size / (1024 * 1024)).toFixed(2);

  console.log('====================================================');
  console.log('MASTER CHATGPT VIDEO RENDER COMPLETE!');
  console.log('File: ' + finalOutput + ' (' + fileSize + ' MB)');
  console.log('Total Render Time: ' + totalTime + 's');
  console.log('====================================================');
}

main().catch((err) => {
  console.error('Render error:', err);
  process.exit(1);
});
