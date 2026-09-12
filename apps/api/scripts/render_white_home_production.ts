import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';

const chapters = [
  { id: 'WhiteHome-Chapter0-Hook', name: 'ch0_hook.mp4', label: 'Chapter 0: The Hook' },
  { id: 'WhiteHome-Chapter1-Physics', name: 'ch1_physics.mp4', label: 'Chapter 1: The Physics' },
  { id: 'WhiteHome-Chapter2-PeoplePain', name: 'ch2_people_pain.mp4', label: 'Chapter 2: The People\'s Paint' },
  { id: 'WhiteHome-Chapter3-Health', name: 'ch3_health_reason.mp4', label: 'Chapter 3: The Hidden Health Reason' },
  { id: 'WhiteHome-Chapter4-Ritual', name: 'ch4_the_ritual.mp4', label: 'Chapter 4: The Ritual' },
  { id: 'WhiteHome-Chapter5-Closing', name: 'ch5_closing.mp4', label: 'Chapter 5: Closing' },
];

async function main() {
  console.log('====================================================');
  console.log('🎬 WHITE HOME DOCUMENTARY: SEQUENTIAL PRODUCTION PIPELINE');
  console.log('====================================================');

  const rootDir = path.resolve(__dirname, '../../..');
  const entryPoint = path.resolve(rootDir, 'packages/remotion-video/src/index.ts');
  const outDir = path.resolve(rootDir, 'output/white_home');
  const stillsDir = path.resolve(outDir, 'stills');
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(stillsDir, { recursive: true });

  console.log('[Bundle] Bundling Remotion project...');
  const t0Bundle = Date.now();
  const serveUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });
  console.log(`[Bundle] Success in ${((Date.now() - t0Bundle) / 1000).toFixed(1)}s! Serving at: ${serveUrl}`);

  const renderedFiles: string[] = [];

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i];
    const outPath = path.resolve(outDir, ch.name);
    console.log('\n----------------------------------------------------');
    console.log(`[${i + 1}/${chapters.length}] Rendering ${ch.label} (${ch.id})...`);
    console.log(`Target: ${outPath}`);
    console.log('----------------------------------------------------');

    const composition = await selectComposition({
      serveUrl,
      id: ch.id,
    });
    console.log(`[Composition] Loaded ${composition.id} (${composition.durationInFrames} frames, ${composition.width}x${composition.height} @ ${composition.fps}fps)`);

    const t0 = Date.now();
    await renderMedia({
      composition,
      serveUrl,
      codec: 'h264',
      outputLocation: outPath,
      concurrency: 4,
      onProgress: ({ progress, renderedFrames, encodedFrames }) => {
        const pct = Math.round(progress * 100);
        if (renderedFrames % 300 === 0 || pct === 100) {
          const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
          console.log(`  [Progress] ${pct}% (${renderedFrames}/${composition.durationInFrames} frames, ${elapsed}s elapsed)`);
        }
      },
    });

    const elapsedTotal = ((Date.now() - t0) / 1000).toFixed(1);
    const sizeMb = (fs.statSync(outPath).size / (1024 * 1024)).toFixed(2);
    console.log(`✓ [Complete] ${ch.label} rendered in ${elapsedTotal}s! Size: ${sizeMb} MB`);
    renderedFiles.push(outPath);

    // Extract quick verification snap at midpoint
    try {
      const midSec = Math.round(composition.durationInFrames / (composition.fps * 2));
      const stillPath = path.resolve(stillsDir, `${ch.id}_snap.jpg`);
      execSync(`ffmpeg -y -ss ${midSec} -i "${outPath}" -frames:v 1 -update 1 "${stillPath}"`, { stdio: 'ignore' });
      console.log(`  📷 Verification snapshot saved: ${stillPath}`);
    } catch (e) {
      // Ignore still extraction error
    }
  }

  // ----------------------------------------------------------------
  // Lossless Master Stitching via FFmpeg Concat
  // ----------------------------------------------------------------
  console.log('\n====================================================');
  console.log('🔗 STITCHING FULL 11m 47s MASTER DOCUMENTARY...');
  console.log('====================================================');

  const concatListPath = path.resolve(outDir, 'concat_list.txt');
  const concatContent = renderedFiles
    .map((f) => `file '${f.replace(/\\/g, '/')}'`)
    .join('\n');
  fs.writeFileSync(concatListPath, concatContent, 'utf-8');

  const masterOutPath = path.resolve(outDir, 'White_Home_Master_1080p.mp4');
  console.log(`Executing FFmpeg concat: ${concatListPath} -> ${masterOutPath}`);

  execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterOutPath}"`, { stdio: 'inherit' });

  const masterSizeMb = (fs.statSync(masterOutPath).size / (1024 * 1024)).toFixed(2);
  console.log('\n🎉 ====================================================');
  console.log('🏆 ALL 6 CHAPTERS + MASTER 1080P VIDEO COMPLETE!');
  console.log(`📁 Master Video: ${masterOutPath} (${masterSizeMb} MB)`);
  console.log('====================================================');
}

main().catch((err) => {
  console.error('Fatal Production Error:', err);
  process.exit(1);
});
