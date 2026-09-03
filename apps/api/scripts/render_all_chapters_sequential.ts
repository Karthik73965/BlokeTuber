import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { projectsStore } from '../src/db/localStore';

const PROJECT_ID = 'abac4778-84a5-486b-8675-32161d7885e0';
const rootApiDir = path.resolve(__dirname, '..');

async function renderAllSequential() {
  console.log('======================================================');
  console.log('🎬 SEQUENTIAL 1-BY-1 DOCUMENTARY VIDEO RENDERER');
  console.log('======================================================');
  console.log('⚙️  Policy: Strictly 1 chapter at a time to prevent RAM overload.');
  console.log('⚙️  Each chapter runs in an isolated process to release 100% RAM on finish.\n');

  const project = projectsStore.findById(PROJECT_ID);
  if (!project) throw new Error('Project not found: ' + PROJECT_ID);

  const chapters = [...(project.chapters || [])].sort((a, b) => a.chapterIndex - b.chapterIndex);
  console.log(`Found ${chapters.length} chapters to render.\n`);

  const startTime = Date.now();

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i]!;
    console.log(`\n------------------------------------------------------`);
    console.log(`🎥 [${i + 1}/${chapters.length}] Rendering Chapter ${ch.chapterIndex}: "${ch.title}"`);
    console.log(`------------------------------------------------------`);

    // Find timeline.json path
    let timelinePath: string | null = null;
    if (ch.timelineJson?.outputPath) {
      const candidate = path.join(path.dirname(path.resolve(rootApiDir, ch.timelineJson.outputPath)), 'timeline.json');
      if (fs.existsSync(candidate)) timelinePath = candidate;
    }

    if (!timelinePath) {
      // Look in output/ directory
      const outputDir = path.join(rootApiDir, 'output');
      const dirs = fs.readdirSync(outputDir).filter(d => d.startsWith(`ikea_ch${ch.chapterIndex}_`));
      if (dirs.length > 0) {
        // pick most recent
        dirs.sort();
        const candidate = path.join(outputDir, dirs[dirs.length - 1]!, 'timeline.json');
        if (fs.existsSync(candidate)) timelinePath = candidate;
      }
    }

    if (!timelinePath || !fs.existsSync(timelinePath)) {
      console.error(`❌ Could not locate timeline.json for Chapter ${ch.chapterIndex}. Skipping.`);
      continue;
    }

    const outputVideoPath = path.join(path.dirname(timelinePath), 'final_video.mp4');
    console.log(`📋 Timeline: ${timelinePath}`);
    console.log(`📁 Target MP4: ${outputVideoPath}`);

    const chStartTime = Date.now();

    try {
      // Execute in separate node process for total RAM reclamation after render
      const renderScript = path.resolve(__dirname, 'render.ts');
      const cmd = `npx tsx "${renderScript}" "${timelinePath}" "${outputVideoPath}"`;
      
      console.log(`🚀 Spawning isolated render process...`);
      execSync(cmd, {
        cwd: rootApiDir,
        stdio: 'inherit',
        env: { ...process.env, NODE_OPTIONS: '--max-old-space-size=4096' }
      });

      const chElapsed = ((Date.now() - chStartTime) / 1000).toFixed(1);
      const videoSizeMb = fs.existsSync(outputVideoPath)
        ? (fs.statSync(outputVideoPath).size / (1024 * 1024)).toFixed(2)
        : '0';

      console.log(`✅ Chapter ${ch.chapterIndex} rendered successfully in ${chElapsed}s (${videoSizeMb} MB)!`);

      // Update store with video path
      ch.videoPath = outputVideoPath;
      ch.status = 'completed';
      projectsStore.update(PROJECT_ID, { chapters });

    } catch (err: any) {
      console.error(`❌ Failed to render Chapter ${ch.chapterIndex}:`, err.message);
    }

    // Brief 2-second cooldown to let OS reclaim all file descriptors and memory buffers
    await new Promise(r => setTimeout(r, 2000));
  }

  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log('\n======================================================');
  console.log(`🎉 ALL ${chapters.length} CHAPTERS RENDERED SEQUENTIALLY!`);
  console.log(`⏱️  Total Processing Time: ${totalElapsed} minutes`);
  console.log('======================================================');
}

if (require.main === module) {
  renderAllSequential().catch((err) => {
    console.error('Fatal batch render error:', err);
    process.exit(1);
  });
}
