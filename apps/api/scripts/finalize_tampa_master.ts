import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { projectsStore, chaptersStore } from '../src/db/localStore';

async function stitchMaster() {
  const project = projectsStore.all().find((p) => p.name.toLowerCase() === 'tampa');
  if (!project) throw new Error('Project "Tampa" not found in store!');

  const chapters = [...chaptersStore.forProject(project.id)].sort((a, b) => a.chapterIndex - b.chapterIndex);

  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎞️  [TAMPA MASTER] STITCHING ALL 12 CHAPTERS INTO MASTER DOCUMENTARY');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const ffmpegStatic = require('ffmpeg-static');
  const ffmpegBin = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';

  const masterDir = path.resolve(process.cwd(), 'apps/api/output/project_tampa');
  fs.mkdirSync(masterDir, { recursive: true });

  const concatListPath = path.join(masterDir, 'concat_list.txt');
  const fileLines: string[] = [];

  for (let i = 1; i <= 12; i++) {
    const ch = chapters.find((c) => c.chapterIndex === i);
    if (!ch || !ch.videoPath || !fs.existsSync(ch.videoPath)) {
      throw new Error(`Video for Chapter ${i} missing!`);
    }
    const safePath = ch.videoPath.replace(/\\/g, '/');
    fileLines.push(`file '${safePath}'`);
    console.log(`  [Ch ${String(i).padStart(2, '0')}] ${path.basename(path.dirname(ch.videoPath))}/final_video.mp4 (${(fs.statSync(ch.videoPath).size / (1024 * 1024)).toFixed(1)} MB)`);
  }

  fs.writeFileSync(concatListPath, fileLines.join('\n'), 'utf-8');

  const masterVideoPath = path.join(masterDir, 'tampa_full_documentary_master.mp4');
  console.log(`\n🚀 Concatenating into: ${masterVideoPath}...`);

  const concatCmd = `${ffmpegBin} -y -f concat -safe 0 -i "${concatListPath}" -c copy "${masterVideoPath}"`;
  execSync(concatCmd, { stdio: 'inherit' });

  const sizeMb = (fs.statSync(masterVideoPath).size / (1024 * 1024)).toFixed(1);
  console.log(`\n✅ FULL MASTER DOCUMENTARY READY: ${sizeMb} MB!`);

  projectsStore.update(project.id, {
    status: 'completed',
    masterVideoPath,
  } as any);

  console.log(`Updated project "Tampa" with masterVideoPath: ${masterVideoPath}`);
}

stitchMaster().catch((err) => {
  console.error('Master concat error:', err);
  process.exit(1);
});
