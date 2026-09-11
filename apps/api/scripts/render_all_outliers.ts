import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';

interface ChatMessage {
  id: string;
  sender: 'user' | 'chatgpt';
  text: string;
  startFrame: number;
  typingDurationFrames: number;
  sendFrame: number;
  isShock?: boolean;
  isBlast?: boolean;
}

const OUTLIERS = [
  {
    id: '1_how_to_delete_chatgpt',
    title: "Asking ChatGPT 'How to delete chatgpt'",
    folder: '1_how_to_delete_chatgpt',
  },
  {
    id: '2_chatgpt_copied_everything',
    title: 'ChatGPT Copied Everything... Until I Said THIS',
    folder: '2_chatgpt_copied_everything',
  },
  {
    id: '3_i_said_its_wrong_1000_times',
    title: "I Said 'it's wrong' 1,000 Times And ChatGPT Lost Its Mind",
    folder: '3_i_said_its_wrong_1000_times',
  },
  {
    id: '4_what_does_idk_mean',
    title: "ChatGPT Broke After This ONE Question ('IDK')",
    folder: '4_what_does_idk_mean',
  },
];

async function main() {
  console.log('====================================================');
  console.log('[Batch Render] Starting rendering for all 4 outlier videos...');
  console.log('====================================================');

  const rootDir = path.resolve(__dirname, '../../..');
  const entryPoint = path.resolve(rootDir, 'packages/remotion-video/src/index.ts');
  const outputBase = path.resolve(rootDir, 'output');
  const scratchDir = path.resolve(
    'C:/Users/karth/.gemini/antigravity-cli/brain/61ce70f1-0d48-451c-b7fc-fe9d8d7fecdc/scratch'
  );

  console.log('[Bundle] Bundling Remotion composition once: ' + entryPoint);
  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });
  console.log('[Bundle] Bundle ready at: ' + serveUrl);

  const totalBatchStart = Date.now();

  for (let i = 0; i < OUTLIERS.length; i++) {
    const item = OUTLIERS[i];
    const targetFolder = path.resolve(outputBase, item.folder);
    fs.mkdirSync(targetFolder, { recursive: true });
    const finalVideoOutput = path.resolve(targetFolder, 'video.mp4');

    const jsonPath = path.resolve(scratchDir, `${item.id}.json`);
    if (!fs.existsSync(jsonPath)) {
      console.error(`[Error] JSON timing file not found: ${jsonPath}`);
      continue;
    }

    const messages: ChatMessage[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const lastMsg = messages[messages.length - 1];
    const totalDurationFrames = (lastMsg?.sendFrame || 6000) + 225;
    const durationSec = (totalDurationFrames / 30).toFixed(1);

    console.log('\n----------------------------------------------------');
    console.log(`[Video ${i + 1}/4] Rendering: "${item.title}"`);
    console.log(`[Target] ${finalVideoOutput}`);
    console.log(`[Specs] Messages: ${messages.length} | Frames: ${totalDurationFrames} (${durationSec}s = ${(Number(durationSec)/60).toFixed(2)} min)`);
    console.log('----------------------------------------------------');

    const inputProps = {
      messages,
      title: item.title,
      enableBgm: true,
    };

    const composition = await selectComposition({
      serveUrl,
      id: 'ChatGPTVideo',
      inputProps,
      chromiumOptions: {
        args: [
          '--allow-file-access-from-files',
          '--disable-web-security',
          '--autoplay-policy=no-user-gesture-required',
        ],
      } as any,
    });

    const videoStartTime = Date.now();

    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      inputProps,
      outputLocation: finalVideoOutput,
      timeoutInMilliseconds: 900000,
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
        if (renderedFrames % 300 === 0 || renderedFrames === safeTotal) {
          const elapsedSec = ((Date.now() - videoStartTime) / 1000).toFixed(1);
          const fpsRate = (renderedFrames / Math.max(1, (Date.now() - videoStartTime) / 1000)).toFixed(1);
          console.log(`[${item.id}] ${percent}% (${renderedFrames}/${safeTotal} frames) - ${elapsedSec}s (${fpsRate} fps)`);
        }
      },
    });

    const videoDuration = ((Date.now() - videoStartTime) / 1000).toFixed(1);
    const fileSize = (fs.statSync(finalVideoOutput).size / (1024 * 1024)).toFixed(2);
    console.log(`[Success] Video ${i + 1}/4 rendered! File size: ${fileSize} MB in ${videoDuration}s`);
  }

  const totalBatchDuration = ((Date.now() - totalBatchStart) / 1000).toFixed(1);
  console.log('\n====================================================');
  console.log('ALL 4 OUTLIER VIDEOS HAVE BEEN SUCCESSFULLY RENDERED!');
  console.log('Total batch duration: ' + totalBatchDuration + 's');
  console.log('====================================================');
}

main().catch((err) => {
  console.error('Batch render error:', err);
  process.exit(1);
});
