import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';

async function main() {
  const entryPoint = path.resolve(__dirname, '../../../packages/remotion-video/src/index.ts');
  const outputFile = path.resolve(__dirname, '../../../output/chatgpt_ui_verify.jpg');

  console.log('Bundling...');
  const serveUrl = await bundle({ entryPoint });

  console.log('Selecting composition: ChatGPTVideo...');
  const composition = await selectComposition({
    serveUrl,
    id: 'ChatGPTVideo',
  });

  console.log('Rendering still frame 5040 to', outputFile);
  await renderStill({
    composition,
    serveUrl,
    output: outputFile,
    frame: 5040,
  });

  console.log('Done rendering still!');
}

main().catch(console.error);
