import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PROJECT_ID = 'proj_cobwood_hideaways';
const REPO_ROOT = path.resolve(__dirname, '../../..');
const rootApiDir = path.resolve(__dirname, '..');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/cobwood');
const OUTPUT_DIR = path.resolve(REPO_ROOT, 'output/cobwood_rendered');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const CHAPTER_FILES = [
  { num: 0, file: 'chapter_00_final.json', title: 'Cold' },
  { num: 1, file: 'chapter_01_final.json', title: 'The Warm One' },
  { num: 2, file: 'chapter_02_final.json', title: 'Dirt, Sand, Straw, Water' },
  { num: 3, file: 'chapter_03_final.json', title: 'The Place Where People Ended Up' },
  { num: 4, file: 'chapter_04_final.json', title: 'The Blowtorch Argument' },
  { num: 5, file: 'chapter_05_final.json', title: 'The Pizza Party' },
  { num: 6, file: 'chapter_06_final.json', title: 'The Question Nobody Asks' },
  { num: 7, file: 'chapter_07_final.json', title: 'Walls That Eat Sound' },
  { num: 8, file: 'chapter_08_final.json', title: 'The Hat and the Boots' },
  { num: 9, file: 'chapter_09_final.json', title: 'A Kitchen, Not a Soup Line' },
  { num: 10, file: 'chapter_10_final.json', title: 'The Night Shift' },
  { num: 11, file: 'chapter_11_final.json', title: 'The Machines' },
  { num: 12, file: 'chapter_12_final.json', title: '18 Inches' },
];

async function renderCobwoodSequential() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 AMERICAN HIDEAWAYS: COB ON WOOD — MASTER SEQUENTIAL RENDERER');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('⚙️  Policy: Strictly 1 chapter at a time to prevent RAM overload.');
  console.log('⚙️  Each chapter runs in an isolated process to release 100% RAM on finish.');
  console.log(`📁 Timelines: ${TIMELINES_DIR}`);
  console.log(`📁 Outputs: ${OUTPUT_DIR}\n`);

  const startTime = Date.now();
  const summary: Array<{ chapter: number; title: string; duration: string; sizeMb: string; status: string }> = [];
  const renderedVideos: string[] = [];

  for (let i = 0; i < CHAPTER_FILES.length; i++) {
    const ch = CHAPTER_FILES[i]!;
    const numStr = String(ch.num).padStart(2, '0');
    const timelinePath = path.join(TIMELINES_DIR, ch.file);
    const outputVideoPath = path.join(OUTPUT_DIR, `chapter_${numStr}.mp4`);

    console.log(`\n───────────────────────────────────────────────────────────────────`);
    console.log(`🎥 [${i + 1}/${CHAPTER_FILES.length}] Rendering Chapter ${numStr}: "${ch.title}"`);
    console.log(`───────────────────────────────────────────────────────────────────`);

    if (!fs.existsSync(timelinePath)) {
      console.error(`❌ Could not locate timeline file: ${timelinePath}. Skipping.`);
      summary.push({ chapter: ch.num, title: ch.title, duration: '0s', sizeMb: '0', status: 'MISSING_TIMELINE' });
      continue;
    }

    const FORCE_RERENDER = process.env.FORCE_RERENDER === 'true';
    if (!FORCE_RERENDER && fs.existsSync(outputVideoPath) && fs.statSync(outputVideoPath).size > 1024 * 1024) {
      const sizeMb = (fs.statSync(outputVideoPath).size / (1024 * 1024)).toFixed(1);
      console.log(`⏩ Chapter ${ch.num} already rendered (${sizeMb} MB) — Skipping`);
      summary.push({ chapter: ch.num, title: ch.title, duration: 'cached', sizeMb, status: 'ALREADY_EXISTS' });
      renderedVideos.push(outputVideoPath);
      continue;
    }

    const chStartTime = Date.now();

    try {
      if (fs.existsSync(outputVideoPath)) {
        try { fs.unlinkSync(outputVideoPath); } catch {}
      }
      const renderScript = path.resolve(__dirname, 'render.ts');
      const cmd = `npx tsx "${renderScript}" "${timelinePath}" "${outputVideoPath}"`;

      console.log(`🚀 Spawning isolated Remotion render process for Chapter ${numStr}...`);
      execSync(cmd, {
        cwd: rootApiDir,
        stdio: 'inherit',
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=6144' },
      });

      const elapsedSec = ((Date.now() - chStartTime) / 1000).toFixed(1);

      if (fs.existsSync(outputVideoPath)) {
        const stats = fs.statSync(outputVideoPath);
        const sizeMb = (stats.size / (1024 * 1024)).toFixed(1);
        console.log(`✅ Chapter ${numStr} rendered successfully: ${outputVideoPath} (${sizeMb} MB, ${elapsedSec}s)`);
        summary.push({ chapter: ch.num, title: ch.title, duration: `${elapsedSec}s`, sizeMb, status: 'SUCCESS' });
        renderedVideos.push(outputVideoPath);
      } else {
        console.error(`❌ Chapter ${numStr} failed to produce output video!`);
        summary.push({ chapter: ch.num, title: ch.title, duration: `${elapsedSec}s`, sizeMb: '0', status: 'FAILED' });
      }
    } catch (err: any) {
      const elapsedSec = ((Date.now() - chStartTime) / 1000).toFixed(1);
      console.error(`❌ Error rendering Chapter ${numStr}:`, err.message || err);
      summary.push({ chapter: ch.num, title: ch.title, duration: `${elapsedSec}s`, sizeMb: '0', status: 'ERROR' });
    }

    console.log(`❄️  Cooldown 3s to allow Chromium garbage collection...`);
    await new Promise((r) => setTimeout(r, 3000));
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n═══════════════════════════════════════════════════════════════════`);
  console.log(`📊 COB ON WOOD BATCH RENDER SUMMARY`);
  console.log(`═══════════════════════════════════════════════════════════════════`);
  console.table(summary);
  console.log(`⏱️  Total Time: ${totalElapsed}s (${(Number(totalElapsed) / 60).toFixed(1)} mins)\n`);

  // Master Concat
  if (renderedVideos.length === CHAPTER_FILES.length) {
    console.log(`🎉 ALL 13 CHAPTERS RENDERED! PROCEEDING TO MASTER FILM CONCAT...`);
    const masterVideoPath = path.join(OUTPUT_DIR, 'master_documentary_cobwood.mp4');
    const concatListPath = path.join(OUTPUT_DIR, 'concat_list.txt');

    const concatContent = renderedVideos.map((v) => `file '${v.replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n');
    fs.writeFileSync(concatListPath, concatContent, 'utf-8');
    console.log(`📝 Concat list written: ${concatListPath}`);

    const ffmpegCmd = `ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterVideoPath}"`;
    console.log(`🚀 Executing lossless stream concatenation via ffmpeg...`);
    try {
      execSync(ffmpegCmd, { stdio: 'inherit' });
      if (fs.existsSync(masterVideoPath)) {
        const masterStats = fs.statSync(masterVideoPath);
        const masterMb = (masterStats.size / (1024 * 1024)).toFixed(1);
        console.log(`\n🏆 MASTER DOCUMENTARY ASSEMBLED: ${masterVideoPath} (${masterMb} MB)`);
      }
    } catch (concatErr: any) {
      console.error(`❌ Failed to concat master film:`, concatErr.message || concatErr);
    }
  } else {
    console.warn(`⚠️ Only ${renderedVideos.length}/${CHAPTER_FILES.length} chapters rendered. Skipping master film concat.`);
  }
}

renderCobwoodSequential().catch((err) => {
  console.error('Fatal batch render error:', err);
  process.exit(1);
});
