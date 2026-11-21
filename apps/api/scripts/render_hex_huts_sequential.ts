import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const rootApiDir = path.resolve(__dirname, '..');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/proj_hex_huts');
const OUTPUT_DIR = path.resolve(REPO_ROOT, 'output/hideaways_hex_huts_rendered');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const CHAPTER_FILES = [
  { num: 1, file: 'ch01_final.json', title: 'The 45-Minute Miracle' },
  { num: 2, file: 'ch02_final.json', title: 'The Geometry of Survival: Why a Hexagon?' },
  { num: 3, file: 'ch03_final.json', title: 'The 45-Minute Assembly' },
  { num: 4, file: 'ch04_final.json', title: 'The Sub-Zero Thermal Physics' },
  { num: 5, file: 'ch05_final.json', title: 'The Sub-Zero Blizzard Test: 72 Hours at -10°F' },
  { num: 6, file: 'ch06_final.json', title: 'Stepping Inside: The Tour of Dignity' },
  { num: 7, file: 'ch07_final.json', title: 'The Off-Grid Life-Support Layer' },
  { num: 8, file: 'ch08_final.json', title: 'The Safe Heat Protocol: PTC Ceramics & Zero-Flame Safety' },
  { num: 9, file: 'ch09_final.json', title: 'The Sanitation & Water Reality' },
  { num: 10, file: 'ch10_final.json', title: 'The Law and the Bulldozer' },
  { num: 11, file: 'ch11_final.json', title: 'The Gray Wave: America’s Aging Streets' },
  { num: 12, file: 'ch12_final.json', title: 'The Lasting Footprint: A Bridge, Not a Grave' },
];

async function renderHexHutsSequential() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 100k BENCHMARK DOCUMENTARY — HEX HUTS MASTER SEQUENTIAL RENDERER');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('⚙️  Policy: Strictly 1 chapter at a time to prevent RAM overload.');
  console.log('⚙️  Each chapter runs in an isolated child process for 100% RAM reclamation.');
  console.log(`📁 Timelines: ${TIMELINES_DIR}`);
  console.log(`📁 Outputs: ${OUTPUT_DIR}\n`);

  // ── PRE-RENDER SEMANTIC VISION AUDIT GATE ─────────────────────────────────
  console.log('🔒 Executing Mandatory Pre-Render Semantic Vision Gate...');
  const gateScript = path.resolve(REPO_ROOT, 'scripts/verify_screening_manifest.py');
  try {
    execSync(`python "${gateScript}" "${TIMELINES_DIR}"`, { stdio: 'inherit', cwd: REPO_ROOT });
  } catch (err) {
    console.error('\n🛑 FATAL: Pre-render semantic vision gate failed! Rendering aborted.');
    console.error('All beats must pass 1-to-1 visual correspondence before rendering.\n');
    process.exit(1);
  }

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

      if (fs.existsSync(outputVideoPath) && fs.statSync(outputVideoPath).size > 1024 * 1024) {
        const sizeMb = (fs.statSync(outputVideoPath).size / (1024 * 1024)).toFixed(1);
        console.log(`✅ Chapter ${numStr} rendered successfully: ${outputVideoPath} (${sizeMb} MB in ${elapsedSec}s)`);
        summary.push({ chapter: ch.num, title: ch.title, duration: `${elapsedSec}s`, sizeMb, status: 'SUCCESS' });
        renderedVideos.push(outputVideoPath);
      } else {
        console.error(`⚠️ Render finished without error but output file is missing or suspiciously small.`);
        summary.push({ chapter: ch.num, title: ch.title, duration: `${elapsedSec}s`, sizeMb: '0', status: 'EMPTY_OUTPUT' });
      }
    } catch (err: any) {
      console.error(`❌ Chapter ${numStr} failed to render:`, err.message || err);
      summary.push({ chapter: ch.num, title: ch.title, duration: '0s', sizeMb: '0', status: 'FAILED' });
    }

    console.log(`⏳ Cooling down for 3s to reclaim Chromium and Node RAM...`);
    execSync('powershell -Command "Start-Sleep -Seconds 3"');
  }

  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(2);
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🏁 SEQUENTIAL RENDER COMPLETE in ${totalElapsed} minutes`);
  console.log('═══════════════════════════════════════════════════════════════════');
  console.table(summary);
}

renderHexHutsSequential().catch(console.error);
