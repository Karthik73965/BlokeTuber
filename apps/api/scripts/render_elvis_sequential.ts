import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { projectsStore, chaptersStore } from '../src/db/localStore';

const rootApiDir = path.resolve(__dirname, '..');
const TIMELINES_DIR = path.resolve(rootApiDir, 'uploads/timelines/elvis');
const OUTPUT_DIR = path.resolve(rootApiDir, 'output/elvis');

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

async function renderElvisSequential() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 ELVIS: SEQUENTIAL 1-BY-1 DOCUMENTARY VIDEO RENDERER');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('⚙️  Policy: Strictly 1 chapter at a time to prevent RAM overload.');
  console.log('⚙️  Each chapter runs in an isolated process to release 100% RAM on finish.\n');

  const project = projectsStore.all().find((p) => p.name?.toLowerCase() === 'elvis' || p.id === 'proj_1789299409134');
  const projectId = project?.id || 'proj_1789299409134';

  const CHAPTER_FILES = [
    { num: 1, file: 'chapter_01.json', title: 'Chapter 01: Open' },
    { num: 2, file: 'chapter_02.json', title: 'Chapter 02: The Man Who Couldn\'t Keep Walking Past' },
    { num: 3, file: 'chapter_03.json', title: 'Chapter 03: What One Video Set Off' },
    { num: 4, file: 'chapter_04.json', title: 'Chapter 04: Raven' },
    { num: 5, file: 'chapter_05.json', title: 'Chapter 05: When The City Showed Up' },
    { num: 6, file: 'chapter_06.json', title: 'Chapter 06: The Ripple' },
    { num: 7, file: 'chapter_07.json', title: 'Chapter 07: Closing' },
  ];

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
      continue;
    }

    const chStartTime = Date.now();

    try {
      const renderScript = path.resolve(__dirname, 'render.ts');
      const cmd = `npx tsx "${renderScript}" "${timelinePath}" "${outputVideoPath}"`;

      console.log(`🚀 Spawning isolated Remotion render process...`);
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
      const chId = `chap_${projectId}_${numStr}`;
      chaptersStore.update(projectId, chId, {
        status: 'completed',
        videoPath: outputVideoPath,
      });

      summary.push({ chapter: ch.num, title: ch.title, duration: `${chElapsed}s`, sizeMb: videoSizeMb, status: 'SUCCESS' });
    } catch (err: any) {
      console.error(`❌ Failed to render Chapter ${ch.num}:`, err.message);
      summary.push({ chapter: ch.num, title: ch.title, duration: '0s', sizeMb: '0', status: `ERROR: ${err.message?.slice(0, 30)}` });
    }

    // Brief 3-second cooldown to let OS reclaim Chromium memory buffers
    await new Promise((r) => setTimeout(r, 3000));
  }

  // Concatenate master if all chapters rendered
  if (renderedVideos.length === CHAPTER_FILES.length) {
    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('🎞️ STITCHING ALL 7 CHAPTERS INTO MASTER DOCUMENTARY VIDEO');
    console.log('═══════════════════════════════════════════════════════════════════');

    const concatListPath = path.join(OUTPUT_DIR, 'concat_list.txt');
    const masterOutputPath = path.join(OUTPUT_DIR, 'ELVIS_MASTER_DOCUMENTARY.mp4');

    const concatContent = renderedVideos
      .map((v) => `file '${v.replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(concatListPath, concatContent, 'utf-8');

    try {
      console.log(`🎬 Running ffmpeg concat...`);
      execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterOutputPath}"`, {
        stdio: 'inherit',
      });

      const masterSizeMb = (fs.statSync(masterOutputPath).size / (1024 * 1024)).toFixed(1);
      console.log(`\n🎉 MASTER DOCUMENTARY ASSEMBLED: ${masterOutputPath} (${masterSizeMb} MB)`);
      projectsStore.update(projectId, { status: 'completed' });
    } catch (err: any) {
      console.error('Failed to stitch master documentary:', err.message);
    }
  }

  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🎉 ELVIS DOCUMENTARY PIPELINE EXECUTION SUMMARY`);
  console.log(`⏱️  Total Processing Time: ${totalElapsed} minutes`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  console.table(summary);
}

renderElvisSequential().catch((err) => {
  console.error('Fatal render error:', err);
  process.exit(1);
});
