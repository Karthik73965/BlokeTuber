import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { projectsStore, chaptersStore } from '../src/db/localStore';

const PROJECT_ID = 'proj_dome_villages';
const REPO_ROOT = path.resolve(__dirname, '../../..');
const rootApiDir = path.resolve(__dirname, '..');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/dome');
const OUTPUT_DIR = path.resolve(REPO_ROOT, 'output/dome_villages');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const CHAPTER_FILES = [
  { num: 1, file: 'chapter_01_final.json', title: 'The Cold Open' },
  { num: 2, file: 'chapter_02_final.json', title: 'The Man Who Slept Outside' },
  { num: 3, file: 'chapter_03_final.json', title: 'A Dome That Bolts Together' },
  { num: 4, file: 'chapter_04_final.json', title: 'Life Inside the Village' },
  { num: 5, file: 'chapter_05_final.json', title: 'Thirteen Years' },
  { num: 6, file: 'chapter_06_final.json', title: 'The Rent' },
  { num: 7, file: 'chapter_07_final.json', title: 'The Idea Multiplies' },
  { num: 8, file: 'chapter_08_final.json', title: 'Dignity Village' },
  { num: 9, file: 'chapter_09_final.json', title: 'Community First' },
  { num: 10, file: 'chapter_10_final.json', title: 'Who Is Really Out There' },
  { num: 11, file: 'chapter_11_final.json', title: 'The Criticism' },
  { num: 12, file: 'chapter_12_final.json', title: 'The Cost of Waiting' },
  { num: 13, file: 'chapter_13_final.json', title: 'Closing' },
];

async function renderDomeSequential() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 DOME VILLAGES: THE CHEAPEST ROOF IN AMERICA — SEQUENTIAL RENDERER');
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

    // Skip if already rendered and valid
    const FORCE_RERENDER = process.env.FORCE_RERENDER === 'true';
    if (!FORCE_RERENDER && fs.existsSync(outputVideoPath) && fs.statSync(outputVideoPath).size > 1024 * 1024) {
      const sizeMb = (fs.statSync(outputVideoPath).size / (1024 * 1024)).toFixed(1);
      console.log(`⏩ Chapter ${ch.num} already rendered (${sizeMb} MB) — Skipping`);
      summary.push({ chapter: ch.num, title: ch.title, duration: 'cached', sizeMb, status: 'ALREADY_EXISTS' });
      renderedVideos.push(outputVideoPath);

      // Ensure chapter store is updated
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
        try {
          fs.copyFileSync(srcStore, dstStore);
        } catch {}
      }
      continue;
    }

    const chStartTime = Date.now();

    try {
      const renderScript = path.resolve(__dirname, 'render.ts');
      const cmd = `npx tsx "${renderScript}" "${timelinePath}" "${outputVideoPath}"`;

      console.log(`🚀 Spawning isolated Remotion render process for Chapter ${numStr}...`);
      execSync(cmd, {
        cwd: rootApiDir,
        stdio: 'inherit',
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=6144' },
      });

      const chElapsed = ((Date.now() - chStartTime) / 1000).toFixed(1);
      const videoSizeMb = fs.existsSync(outputVideoPath)
        ? (fs.statSync(outputVideoPath).size / (1024 * 1024)).toFixed(2)
        : '0';

      console.log(`✅ Chapter ${ch.num} rendered successfully in ${chElapsed}s (${videoSizeMb} MB)!`);
      renderedVideos.push(outputVideoPath);

      // Update chapter in store for web dashboard playback
      const projectChapters = chaptersStore.forProject(PROJECT_ID);
      const targetChapter = projectChapters.find((c) => c.chapterIndex === ch.num);
      if (targetChapter) {
        chaptersStore.update(PROJECT_ID, targetChapter.id, {
          status: 'completed',
          videoPath: outputVideoPath,
        });
      }

      // Sync to root output store
      const srcStore = path.resolve(REPO_ROOT, 'apps/api/output/store/projects.json');
      const dstStore = path.resolve(REPO_ROOT, 'output/store/projects.json');
      if (fs.existsSync(srcStore)) {
        try {
          fs.copyFileSync(srcStore, dstStore);
        } catch {}
      }

      summary.push({ chapter: ch.num, title: ch.title, duration: `${chElapsed}s`, sizeMb: videoSizeMb, status: 'SUCCESS' });
    } catch (err: any) {
      console.error(`❌ Failed to render Chapter ${ch.num}:`, err.message);
      summary.push({ chapter: ch.num, title: ch.title, duration: '0s', sizeMb: '0', status: `ERROR: ${err.message?.slice(0, 30)}` });
    }

    // Brief 3-second cooldown to let OS reclaim Chromium memory buffers
    console.log('⏳ Cooldown 3s for memory reclamation...');
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const totalElapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  // Automatic Master Documentary Stitching via FFmpeg
  const masterVideoPath = path.join(OUTPUT_DIR, 'master_documentary_dome_villages.mp4');
  const validRendered = CHAPTER_FILES.map((c) => path.join(OUTPUT_DIR, `chapter_${String(c.num).padStart(2, '0')}.mp4`))
    .filter((p) => fs.existsSync(p) && fs.statSync(p).size > 1024 * 1024);

  if (validRendered.length === CHAPTER_FILES.length) {
    console.log(`\n🧵 Stitching full 13-chapter documentary master into: ${masterVideoPath}...`);
    const concatListPath = path.join(OUTPUT_DIR, 'concat_list.txt');
    const concatLines = validRendered.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n');
    fs.writeFileSync(concatListPath, concatLines, 'utf-8');

    try {
      execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterVideoPath}"`, {
        stdio: 'inherit',
      });
      projectsStore.update(PROJECT_ID, {
        status: 'completed',
        videoPath: masterVideoPath,
      });

      const srcStore = path.resolve(REPO_ROOT, 'apps/api/output/store/projects.json');
      const dstStore = path.resolve(REPO_ROOT, 'output/store/projects.json');
      if (fs.existsSync(srcStore)) {
        try {
          fs.copyFileSync(srcStore, dstStore);
        } catch {}
      }
      const masterSizeMb = (fs.statSync(masterVideoPath).size / (1024 * 1024)).toFixed(2);
      console.log(`🏆 MASTER DOCUMENTARY STITCHED SUCCESSFULLY! (${masterSizeMb} MB)`);
    } catch (stitchErr: any) {
      console.error('Master stitching warning:', stitchErr.message);
    }
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🎉 DOME VILLAGES RENDERING RUN COMPLETED IN ${totalElapsed}s!`);
  console.table(summary);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

if (require.main === module) {
  renderDomeSequential().catch((err) => {
    console.error('Fatal sequential render error:', err);
    process.exit(1);
  });
}
