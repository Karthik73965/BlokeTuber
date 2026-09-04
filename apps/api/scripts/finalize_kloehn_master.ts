import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { projectsStore, chaptersStore } from '../src/db/localStore';

const PROJECT_ID = 'proj_1788520997417';
const rootApiDir = path.resolve(__dirname, '..');

async function finalizeMaster() {
  const ch2VideoPath = path.join(
    rootApiDir,
    'output',
    'kloehn_ch2_2026-09-04T13-15-00_s0s25f',
    'final_video.mp4'
  );

  console.log('⏳ Waiting for Chapter 2 render to finish...');
  while (true) {
    if (fs.existsSync(ch2VideoPath)) {
      const size1 = fs.statSync(ch2VideoPath).size;
      if (size1 > 10 * 1024 * 1024) {
        // Wait 5s to ensure file handle is released and write is complete
        await new Promise((r) => setTimeout(r, 5000));
        const size2 = fs.statSync(ch2VideoPath).size;
        if (size1 === size2) {
          console.log(`✅ Chapter 2 video ready (${(size2 / (1024 * 1024)).toFixed(1)} MB)!`);
          break;
        }
      }
    }
    await new Promise((r) => setTimeout(r, 10000));
  }

  // Update store for Chapter 2
  const project = projectsStore.findById(PROJECT_ID);
  if (!project) throw new Error('Project not found');

  const chapters = [...(project.chapters || [])].sort((a, b) => a.chapterIndex - b.chapterIndex);
  const ch2 = chapters.find((c) => c.chapterIndex === 2);
  if (ch2) {
    ch2.status = 'completed';
    ch2.videoPath = ch2VideoPath;
    chaptersStore.update(PROJECT_ID, ch2.id, {
      status: 'completed',
      videoPath: ch2VideoPath,
      updatedAt: new Date().toISOString(),
    });
    projectsStore.update(PROJECT_ID, { chapters });
    console.log('✅ Updated Chapter 2 in project store: status=completed');
  }

  // Stitch ALL 11 chapters in exact numerical order
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('🎞️  [MASTER CONCAT] STITCHING ALL 11 CHAPTERS INTO MASTER DOCUMENTARY');
  console.log('═══════════════════════════════════════════════════════════════════');

  const allVideoPaths: string[] = [];
  for (let idx = 1; idx <= 11; idx++) {
    const ch = chapters.find((c) => c.chapterIndex === idx);
    if (!ch || !ch.videoPath || !fs.existsSync(ch.videoPath)) {
      throw new Error(`Missing video for Chapter ${idx}: ${ch?.videoPath}`);
    }
    const mb = (fs.statSync(ch.videoPath).size / (1024 * 1024)).toFixed(1);
    console.log(`  • Chapter ${String(idx).padStart(2, '0')}: ${ch.title} (${mb} MB)`);
    allVideoPaths.push(ch.videoPath);
  }

  const masterDir = path.join(rootApiDir, 'output', 'kloehn_master_documentary');
  fs.mkdirSync(masterDir, { recursive: true });
  const concatListFile = path.join(masterDir, 'concat_list.txt');
  const masterOutputFile = path.join(masterDir, 'Gregory_Kloehn_Documentary_Full_Master.mp4');

  const concatContent = allVideoPaths
    .map((p) => `file '${p.replace(/\\/g, '/')}'`)
    .join('\n');
  fs.writeFileSync(concatListFile, concatContent, 'utf8');

  const ffmpegStatic = require('ffmpeg-static');
  const ffmpegBin = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';

  console.log(`\nJoining all 11 chapter MP4s into master file...`);
  execSync(`${ffmpegBin} -y -f concat -safe 0 -i "${concatListFile}" -c copy "${masterOutputFile}"`, {
    stdio: 'inherit',
  });

  const masterSizeMb = (fs.statSync(masterOutputFile).size / (1024 * 1024)).toFixed(2);
  console.log(`\n═══════════════════════════════════════════════════════════════════`);
  console.log(`🎉 100% COMPLETE: MASTER DOCUMENTARY STITCHED SUCCESSFULLY!`);
  console.log(`📁 Master File: ${masterOutputFile} (${masterSizeMb} MB)`);
  console.log(`👉 View on Dashboard: http://localhost:3000/project/${PROJECT_ID}`);
  console.log(`═══════════════════════════════════════════════════════════════════\n`);
}

finalizeMaster().catch((err) => {
  console.error('Finalize error:', err);
  process.exit(1);
});
