import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

async function main() {
  console.log('[ChatGPT Video Renderer] Starting 30-second Pilot Render...');

  const entryPoint = path.resolve(__dirname, '../../../packages/remotion-video/src/index.ts');
  const outputDir = path.resolve(__dirname, '../../../output');
  fs.mkdirSync(outputDir, { recursive: true });

  const finalOutput = path.resolve(outputDir, 'chatgpt_toaster_pilot_30s.mp4');

  console.log('[Bundle] Bundling Remotion composition from: ' + entryPoint);
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

  console.log('[Specs] Composition: ' + composition.width + 'x' + composition.height + ' @ ' + composition.fps + 'fps (' + composition.durationInFrames + ' frames)');
  console.log('[Render] Output: ' + finalOutput);

  const startTime = Date.now();

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: finalOutput,
    timeoutInMilliseconds: 180000,
    chromiumOptions: {
      args: [
        '--allow-file-access-from-files',
        '--disable-web-security',
        '--autoplay-policy=no-user-gesture-required',
      ],
    } as any,
    onProgress: ({ renderedFrames, totalFrames }: any) => {
      const percent = Math.round((renderedFrames / totalFrames) * 100);
      if (renderedFrames % 60 === 0 || renderedFrames === totalFrames) {
        const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log('[Progress] ' + percent + '% (' + renderedFrames + '/' + totalFrames + ' frames) - ' + elapsedSec + 's');
      }
    },
  });

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  const fileSize = (fs.statSync(finalOutput).size / (1024 * 1024)).toFixed(2);

  console.log('====================================================');
  console.log('30-SECOND PILOT RENDER COMPLETE!');
  console.log('File: ' + finalOutput + ' (' + fileSize + ' MB)');
  console.log('Render Time: ' + totalTime + 's');
  console.log('====================================================');
}

main().catch((err) => {
  console.error('Render error:', err);
  process.exit(1);
});
