import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const rootApiDir = path.resolve(__dirname, '..');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/proj_warm');
const OUTPUT_DIR = path.resolve(REPO_ROOT, 'output/hideaways_warm_rendered');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const CHAPTER_FILES = [
  { num: 1, file: 'ch01_cold_open_final.json', title: 'Cold Open' },
  { num: 2, file: 'ch02_the_grid_final.json', title: 'The Grid' },
  { num: 3, file: 'ch03_the_building_that_fails_final.json', title: 'The Building That Fails' },
  { num: 4, file: 'ch04_the_hut_final.json', title: 'The Hut' },
  { num: 5, file: 'ch05_the_village_final.json', title: 'The Village' },
  { num: 6, file: 'ch06_the_solar_layer_final.json', title: 'The Solar Layer' },
  { num: 7, file: 'ch07_the_medicine_in_the_cooler_final.json', title: 'The Medicine in the Cooler' },
  { num: 8, file: 'ch08_built_by_volunteers_final.json', title: 'Built by Volunteers' },
  { num: 9, file: 'ch09_the_problem_that_is_not_construction_final.json', title: 'The Problem That Is Not Construction' },
  { num: 10, file: 'ch10_what_ready_looks_like_final.json', title: 'What Ready Looks Like' },
];

async function renderWarmSequential() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 AMERICAN HIDEAWAYS: WARM — MASTER SEQUENTIAL RENDERER');
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
        summary.push({ chapter: ch.num, title: ch.title, duration: `${elapsedSec}s`, sizeMb, '0': '', status: 'FAILED' });
      }
    } catch (err: any) {
      const elapsedSec = ((Date.now() - chStartTime) / 1000).toFixed(1);
      console.error(`❌ Error rendering Chapter ${numStr}:`, err.message || err);
      summary.push({ chapter: ch.num, title: ch.title, duration: `${elapsedSec}s`, sizeMb: '0', status: 'ERROR' });
    }

    // Cooldown 3s for 100% memory reclamation
    console.log('⏳ Cooldown 3s for memory reclamation...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`📊 MASTER RENDERING COMPLETED IN ${totalElapsed} MINUTES`);
  console.log('═══════════════════════════════════════════════════════════════════');
  console.table(summary);

  console.log('\n🚀 Triggering Master Concat & Whole-Film Freeze QA...');
  execSync('python scripts/concat_master_warm.py', { cwd: REPO_ROOT, stdio: 'inherit' });
  execSync('python scripts/audit_master_warm.py', { cwd: REPO_ROOT, stdio: 'inherit' });
}

renderWarmSequential().catch((err) => {
  console.error('Fatal rendering error:', err);
  process.exit(1);
});
