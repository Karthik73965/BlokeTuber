import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { projectsStore, chaptersStore } from '../src/db/localStore';

const PROJECT_ID = 'proj_1788520997417';
const rootApiDir = path.resolve(__dirname, '..');

async function renderKloehnPhase3() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 [PHASE 3] SEQUENTIAL 1-BY-1 DOCUMENTARY VIDEO RENDERING');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log(`📁 Project ID: ${PROJECT_ID}`);
  console.log('⚙️  Policy: Strictly 1 chapter at a time for 100% RAM & GPU stability');
  console.log('⚙️  Each chapter runs in an isolated process to reclaim all memory\n');

  const project = projectsStore.findById(PROJECT_ID);
  if (!project) throw new Error('Project not found: ' + PROJECT_ID);

  const chapters = [...(project.chapters || [])].sort((a, b) => a.chapterIndex - b.chapterIndex);
  console.log(`Found ${chapters.length} chapters staged and ready for rendering.\n`);

  const renderedVideoPaths: string[] = [];
  const startTime = Date.now();

  for (let i = 0; i < chapters.length; i++) {
    const ch = chapters[i]!;
    console.log(`\n───────────────────────────────────────────────────────────────────`);
    console.log(`🎥 [${i + 1}/${chapters.length}] Rendering Chapter ${ch.chapterIndex}: "${ch.title}"`);
    console.log(`───────────────────────────────────────────────────────────────────`);

    let timelinePath: string | null = null;
    if (ch.timelineJson?.outputPath) {
      const candidate = path.join(path.dirname(path.resolve(rootApiDir, ch.timelineJson.outputPath)), 'timeline.json');
      if (fs.existsSync(candidate)) timelinePath = candidate;
    }

    if (!timelinePath) {
      // Fallback: Search latest matching chapter directory in output/
      const outputDir = path.join(rootApiDir, 'output');
      const dirs = fs.readdirSync(outputDir).filter(
        (d) => d.startsWith(`kloehn_ch${ch.chapterIndex}_`) || d.startsWith(`kloehn_ch${ch.chapterIndex}T`)
      );
      if (dirs.length > 0) {
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

    // Update status to rendering
    ch.status = 'rendering';
    chaptersStore.update(PROJECT_ID, ch.id, { status: 'rendering' });
    projectsStore.update(PROJECT_ID, { chapters });

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

      console.log(`✅ [CHAPTER ${String(ch.chapterIndex).padStart(2, '0')}] Rendered in ${chElapsed}s (${videoSizeMb} MB)!`);

      // Update store with completed video
      ch.videoPath = outputVideoPath;
      ch.status = 'completed';
      chaptersStore.update(PROJECT_ID, ch.id, {
        status: 'completed',
        videoPath: outputVideoPath,
        updatedAt: new Date().toISOString(),
      });
      projectsStore.update(PROJECT_ID, { chapters });

      renderedVideoPaths.push(outputVideoPath);
    } catch (err: any) {
      console.error(`❌ Failed to render Chapter ${ch.chapterIndex}:`, err.message);
      ch.status = 'failed';
      chaptersStore.update(PROJECT_ID, ch.id, { status: 'failed' });
      projectsStore.update(PROJECT_ID, { chapters });
    }

    // 3-second cooldown to let Windows OS flush file buffers and release GPU/Chromium handles
    await new Promise((r) => setTimeout(r, 3000));
  }

  // Master Stitching: Stitch all rendered chapters into full master video
  if (renderedVideoPaths.length > 0) {
    console.log('\n═══════════════════════════════════════════════════════════════════');
    console.log('🎞️  [MASTER CONCAT] STITCHING ALL CHAPTERS INTO FULL DOCUMENTARY');
    console.log('═══════════════════════════════════════════════════════════════════');

    try {
      const masterDir = path.join(rootApiDir, 'output', 'kloehn_master_documentary');
      fs.mkdirSync(masterDir, { recursive: true });
      const concatListFile = path.join(masterDir, 'concat_list.txt');
      const masterOutputFile = path.join(masterDir, 'Gregory_Kloehn_Documentary_Full_Master.mp4');

      const concatContent = renderedVideoPaths
        .map((p) => `file '${p.replace(/\\/g, '/')}'`)
        .join('\n');
      fs.writeFileSync(concatListFile, concatContent, 'utf8');

      const ffmpegStatic = require('ffmpeg-static');
      const ffmpegBin = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';

      console.log(`Joining ${renderedVideoPaths.length} chapter MP4s...`);
      execSync(`${ffmpegBin} -y -f concat -safe 0 -i "${concatListFile}" -c copy "${masterOutputFile}"`, {
        stdio: 'inherit',
      });

      const masterSizeMb = (fs.statSync(masterOutputFile).size / (1024 * 1024)).toFixed(2);
      console.log(`\n🎉 MASTER DOCUMENTARY STITCHED SUCCESSFULLY!`);
      console.log(`📁 File: ${masterOutputFile} (${masterSizeMb} MB)`);
    } catch (err: any) {
      console.warn('⚠️ Master stitching warning:', err.message);
    }
  }

  const totalElapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🎉 [PHASE 3 COMPLETE] ALL CHAPTERS PROCESSED IN ${totalElapsed} MINUTES!`);
  console.log(`👉 View Video on Dashboard: http://localhost:3000/project/${PROJECT_ID}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

renderKloehnPhase3().catch((err) => {
  console.error('Fatal render error:', err);
  process.exit(1);
});
