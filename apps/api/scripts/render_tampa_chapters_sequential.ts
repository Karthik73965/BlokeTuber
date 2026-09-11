import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { projectsStore, chaptersStore } from '../src/db/localStore';

const rootApiDir = path.resolve(__dirname, '..');

async function renderTampaSequential() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 TAMPA: SEQUENTIAL 1-BY-1 DOCUMENTARY VIDEO RENDERER');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('⚙️  Policy: Strictly 1 chapter at a time to prevent RAM overload.');
  console.log('⚙️  Each chapter runs in an isolated process to release 100% RAM on finish.\n');

  const project = projectsStore.all().find((p) => p.name.toLowerCase() === 'tampa');
  if (!project) throw new Error('Project "Tampa" not found in database!');

  const chapters = [...chaptersStore.forProject(project.id)].sort((a, b) => a.chapterIndex - b.chapterIndex);
  console.log(`📋 Found ${chapters.length} chapters to render.\n`);

  const startTime = Date.now();
  const summary: Array<{ chapter: number; title: string; duration: string; sizeMb: string; status: string }> = [];

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i]!;
    const numStr = String(ch.chapterIndex).padStart(2, '0');
    console.log(`\n───────────────────────────────────────────────────────────────────`);
    console.log(`🎥 [${i + 1}/${chapters.length}] Rendering Chapter ${numStr}: "${ch.title}"`);
    console.log(`───────────────────────────────────────────────────────────────────`);

    // Locate timeline.json
    let timelinePath: string | null = null;
    const outputDir = path.join(rootApiDir, 'output');
    if (fs.existsSync(outputDir)) {
      const dirs = fs.readdirSync(outputDir).filter((d) => d.startsWith(`tampa_ch${ch.chapterIndex}_`));
      if (dirs.length > 0) {
        dirs.sort();
        const candidate = path.join(outputDir, dirs[dirs.length - 1]!, 'timeline.json');
        if (fs.existsSync(candidate)) timelinePath = candidate;
      }
    }

    if (!timelinePath && ch.timelineJson?.outputPath) {
      const candidate = path.resolve(rootApiDir, ch.timelineJson.outputPath);
      if (fs.existsSync(candidate)) timelinePath = candidate;
    }

    if (!timelinePath || !fs.existsSync(timelinePath)) {
      console.error(`❌ Could not locate timeline.json for Chapter ${ch.chapterIndex}. Skipping.`);
      summary.push({ chapter: ch.chapterIndex, title: ch.title, duration: '0s', sizeMb: '0', status: 'SKIPPED_NO_TIMELINE' });
      continue;
    }

    const outputVideoPath = path.join(path.dirname(timelinePath), 'final_video.mp4');
    console.log(`📋 Timeline: ${timelinePath}`);
    console.log(`📁 Target MP4: ${outputVideoPath}`);

    // Skip if already rendered
    const FORCE_RERENDER = process.env.FORCE_RERENDER === 'true';
    if (!FORCE_RERENDER && fs.existsSync(outputVideoPath) && fs.statSync(outputVideoPath).size > 1024 * 1024) {
      const sizeMb = (fs.statSync(outputVideoPath).size / (1024 * 1024)).toFixed(1);
      console.log(`⏩ Chapter ${ch.chapterIndex} already rendered (${sizeMb} MB) — Skipping`);
      summary.push({ chapter: ch.chapterIndex, title: ch.title, duration: 'cached', sizeMb, status: 'ALREADY_EXISTS' });
      ch.videoPath = outputVideoPath;
      ch.status = 'completed';
      chaptersStore.update(project.id, ch.id, { videoPath: outputVideoPath, status: 'completed' });
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

      console.log(`✅ Chapter ${ch.chapterIndex} rendered successfully in ${chElapsed}s (${videoSizeMb} MB)!`);

      ch.videoPath = outputVideoPath;
      ch.status = 'completed';
      chaptersStore.update(project.id, ch.id, { videoPath: outputVideoPath, status: 'completed' });

      summary.push({ chapter: ch.chapterIndex, title: ch.title, duration: `${chElapsed}s`, sizeMb: videoSizeMb, status: 'SUCCESS' });
    } catch (err: any) {
      console.error(`❌ Failed to render Chapter ${ch.chapterIndex}:`, err.message);
      summary.push({ chapter: ch.chapterIndex, title: ch.title, duration: '0s', sizeMb: '0', status: `ERROR: ${err.message?.slice(0, 30)}` });
    }

    // Brief 3-second cooldown to let OS reclaim Chromium memory buffers
    await new Promise((r) => setTimeout(r, 3000));
  }

  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🎉 ALL 12 TAMPA CHAPTERS RENDER PIPELINE COMPLETED!`);
  console.log(`⏱️  Total Processing Time: ${totalElapsed} minutes`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  console.table(summary);
}

renderTampaSequential().catch((err) => {
  console.error('Fatal render error:', err);
  process.exit(1);
});
