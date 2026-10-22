import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { projectsStore, chaptersStore } from '../src/db/localStore';

const PROJECT_ID = 'proj_fishingtent_hideaways';
const REPO_ROOT = path.resolve(__dirname, '../../..');
const rootApiDir = path.resolve(__dirname, '..');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/fishingtent');
const OUTPUT_DIR = path.resolve(REPO_ROOT, 'output/fishingtent_rendered');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const CHAPTER_FILES = [
  { num: 1, file: 'chapter_01_final.json', title: 'The Square in the Snow' },
  { num: 2, file: 'chapter_02_final.json', title: 'The Size of the Problem' },
  { num: 3, file: 'chapter_03_final.json', title: 'The Object' },
  { num: 4, file: 'chapter_04_final.json', title: "What's Inside the Walls" },
  { num: 5, file: 'chapter_05_final.json', title: 'Awake, Seated, Still' },
  { num: 6, file: 'chapter_06_final.json', title: 'The Catches' },
  { num: 7, file: 'chapter_07_final.json', title: 'The Part That Can Kill You' },
  { num: 8, file: 'chapter_08_final.json', title: 'Red Notices and Metal Fences' },
  { num: 9, file: 'chapter_09_final.json', title: 'One Aisle, One Label' },
  { num: 10, file: 'chapter_10_final.json', title: 'The Morning in Halifax' },
];

async function renderFishingTentSequential() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 AMERICAN HIDEAWAYS: THE FISHING TENT — SEQUENTIAL RENDERER');
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

      const projectChapters = chaptersStore.forProject(PROJECT_ID);
      const targetChapter = projectChapters.find((c) => c.chapterIndex === ch.num);
      if (targetChapter) {
        chaptersStore.update(PROJECT_ID, targetChapter.id, {
          status: 'completed',
          videoPath: outputVideoPath,
        });
      }
      const srcStore = path.resolve(REPO_ROOT, 'apps/api/output/store/projects.json');
      const dstStore = path.resolve(REPO_ROOT, 'output/store/projects.json');
      if (fs.existsSync(srcStore)) {
        try { fs.copyFileSync(srcStore, dstStore); } catch {}
      }
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

        const projectChapters = chaptersStore.forProject(PROJECT_ID);
        const targetChapter = projectChapters.find((c) => c.chapterIndex === ch.num);
        if (targetChapter) {
          chaptersStore.update(PROJECT_ID, targetChapter.id, {
            status: 'completed',
            videoPath: outputVideoPath,
          });
        }
        const srcStore = path.resolve(REPO_ROOT, 'apps/api/output/store/projects.json');
        const dstStore = path.resolve(REPO_ROOT, 'output/store/projects.json');
        if (fs.existsSync(srcStore)) {
          try { fs.copyFileSync(srcStore, dstStore); } catch {}
        }
      } else {
        throw new Error(`Output MP4 was not created for chapter ${numStr}`);
      }
    } catch (err: any) {
      const elapsedSec = ((Date.now() - chStartTime) / 1000).toFixed(1);
      console.error(`❌ Chapter ${numStr} render failed after ${elapsedSec}s:`, err.message || err);
      summary.push({ chapter: ch.num, title: ch.title, duration: `${elapsedSec}s`, sizeMb: '0', status: 'FAILED' });
    }

    console.log(`❄️  Cooldown 3s to allow Chromium garbage collection...`);
    await new Promise((r) => setTimeout(r, 3000));
  }

  const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('📊 FISHING TENT BATCH RENDER SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.table(summary);
  console.log(`⏱️  Total Time: ${totalTime}s (${(Number(totalTime) / 60).toFixed(1)} mins)`);

  const successfulRenders = summary.filter((s) => s.status === 'SUCCESS' || s.status === 'ALREADY_EXISTS');
  if (successfulRenders.length === CHAPTER_FILES.length) {
    console.log('\n🎉 ALL 10 CHAPTERS RENDERED! PROCEEDING TO MASTER FILM CONCAT...');
    const concatListPath = path.join(OUTPUT_DIR, 'concat_list.txt');
    const masterVideoPath = path.join(OUTPUT_DIR, 'master_documentary_fishingtent.mp4');

    const concatContent = renderedVideos
      .map((vid) => `file '${vid.replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(concatListPath, concatContent, 'utf-8');

    console.log(`📝 Concat list written: ${concatListPath}`);
    console.log(`🚀 Executing lossless stream concatenation via ffmpeg...`);

    const concatCmd = `ffmpeg -nostdin -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterVideoPath}"`;
    execSync(concatCmd, { stdio: 'inherit' });

    if (fs.existsSync(masterVideoPath)) {
      const masterSize = (fs.statSync(masterVideoPath).size / (1024 * 1024)).toFixed(1);
      console.log(`🏆 MASTER DOCUMENTARY ASSEMBLED: ${masterVideoPath} (${masterSize} MB)`);
      projectsStore.update(PROJECT_ID, {
        status: 'completed',
        masterVideoPath,
      });
      const srcStore = path.resolve(REPO_ROOT, 'apps/api/output/store/projects.json');
      const dstStore = path.resolve(REPO_ROOT, 'output/store/projects.json');
      if (fs.existsSync(srcStore)) {
        try { fs.copyFileSync(srcStore, dstStore); } catch {}
      }
    }
  } else {
    console.warn(`⚠️ Only ${successfulRenders.length}/${CHAPTER_FILES.length} chapters rendered. Fix failures before concat.`);
  }
}

renderFishingTentSequential().catch((e) => {
  console.error('Fatal error in sequential render:', e);
  process.exit(1);
});
