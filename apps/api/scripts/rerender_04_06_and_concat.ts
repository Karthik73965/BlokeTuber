import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const rootApiDir = path.resolve(__dirname, '..');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/pallet');
const OUTPUT_DIR = path.resolve(REPO_ROOT, 'output/pallet_rendered');

const chaptersToRender = [
  { num: 4, file: 'chapter_04_final.json', out: 'chapter_04.mp4' },
  { num: 6, file: 'chapter_06_final.json', out: 'chapter_06.mp4' },
];

async function run() {
  console.log('🎬 Rerendering Chapter 04 and Chapter 06 with 100% Freeze-Free Clips...');
  const renderScript = path.resolve(__dirname, 'render.ts');

  for (const ch of chaptersToRender) {
    const timelinePath = path.join(TIMELINES_DIR, ch.file);
    const outputPath = path.join(OUTPUT_DIR, ch.out);

    if (fs.existsSync(outputPath)) {
      try { fs.unlinkSync(outputPath); } catch {}
    }

    console.log(`\n🚀 Rendering Chapter ${ch.num}: ${ch.file} -> ${ch.out}...`);
    const cmd = `npx tsx "${renderScript}" "${timelinePath}" "${outputPath}"`;
    execSync(cmd, {
      cwd: rootApiDir,
      stdio: 'inherit',
      env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=6144' },
    });

    const sizeMb = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(1);
    console.log(`✅ Chapter ${ch.num} rendered: ${outputPath} (${sizeMb} MB)`);
    await new Promise((r) => setTimeout(r, 2000));
  }

  // Master Concat
  console.log(`\n🎉 Re-assembling Master Documentary with updated chapters...`);
  const masterVideoPath = path.join(OUTPUT_DIR, 'master_documentary_pallet.mp4');
  const concatListPath = path.join(OUTPUT_DIR, 'concat_list.txt');

  const allChapters: string[] = [];
  for (let i = 0; i < 13; i++) {
    const p = path.join(OUTPUT_DIR, `chapter_${String(i).padStart(2, '0')}.mp4`);
    if (!fs.existsSync(p)) {
      throw new Error(`Missing chapter video: ${p}`);
    }
    allChapters.push(p);
  }

  const concatContent = allChapters.map((v) => `file '${v.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n');
  fs.writeFileSync(concatListPath, concatContent, 'utf-8');

  if (fs.existsSync(masterVideoPath)) {
    try { fs.unlinkSync(masterVideoPath); } catch {}
  }

  const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterVideoPath}"`;
  console.log(`🚀 Executing lossless stream concatenation via ffmpeg...`);
  execSync(ffmpegCmd, { stdio: 'inherit' });

  const masterStats = fs.statSync(masterVideoPath);
  const masterMb = (masterStats.size / (1024 * 1024)).toFixed(1);
  console.log(`\n🏆 MASTER DOCUMENTARY ASSEMBLED: ${masterVideoPath} (${masterMb} MB)`);
}

run().catch((err) => {
  console.error('Error during rerender/concat:', err);
  process.exit(1);
});
