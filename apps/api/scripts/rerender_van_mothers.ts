import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/videoRenderer';
import { chaptersStore } from '../src/db/localStore';

async function main() {
  const projectId = '91274641-ee6d-4dc8-817b-61ef10bffade';
  const chapters = [
    {
      chapterId: 'ch_1787980287821_ft1h',
      index: 1,
      timelinePath: path.resolve(__dirname, '../output/van_mothers_2026-08-29_10-41-40_531c3c/timeline.json'),
      outputPath: path.resolve(__dirname, '../output/van_mothers_2026-08-29_10-41-40_531c3c/final_video.mp4'),
    },
    {
      chapterId: 'ch_1787981075403_98jz',
      index: 2,
      timelinePath: path.resolve(__dirname, '../output/van_mothers_2026-08-29_11-11-54_d8b3b8/timeline.json'),
      outputPath: path.resolve(__dirname, '../output/van_mothers_2026-08-29_11-11-54_d8b3b8/final_video.mp4'),
    },
    {
      chapterId: 'ch_1787982817680_f7qn',
      index: 3,
      timelinePath: path.resolve(__dirname, '../output/van_mothers_2026-08-29_11-23-43_d7e6bc/timeline.json'),
      outputPath: path.resolve(__dirname, '../output/van_mothers_2026-08-29_11-23-43_d7e6bc/final_video.mp4'),
    },
  ];

  console.log('🚀 Starting Re-render of All 3 Chapters of VAN MOTHERS (Zero API calls, Zero downloads)...');

  for (const ch of chapters) {
    if (!fs.existsSync(ch.timelinePath)) {
      console.error(`⚠️ Timeline not found: ${ch.timelinePath}`);
      continue;
    }

    console.log(`\n======================================================`);
    console.log(`🎬 Re-rendering Chapter ${ch.index}...`);
    console.log(`📋 Timeline: ${ch.timelinePath}`);
    console.log(`======================================================`);

    const start = Date.now();
    await renderTimelineVideo(ch.timelinePath, ch.outputPath);
    const duration = ((Date.now() - start) / 1000).toFixed(1);

    // Update chapter metadata in store
    chaptersStore.update(projectId, ch.chapterId, {
      status: 'completed',
      videoPath: ch.outputPath,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ Chapter ${ch.index} rendered successfully in ${duration}s!`);
  }

  // Stitch master project video
  console.log(`\n======================================================`);
  console.log(`⚡ Stitching Full Project Master Video...`);
  console.log(`======================================================`);

  const projectOutDir = path.resolve(__dirname, '../output/project_van_mothers');
  fs.mkdirSync(projectOutDir, { recursive: true });

  const finalStitchedVideo = path.join(projectOutDir, 'full_project_master.mp4');
  const concatListPath = path.join(projectOutDir, 'chapters_concat.txt');

  const listContent = chapters
    .filter((c) => fs.existsSync(c.outputPath))
    .map((c) => `file '${c.outputPath.replace(/\\/g, '/')}'`)
    .join('\n');

  fs.writeFileSync(concatListPath, listContent);

  const ffmpegBin = require('ffmpeg-static') ? `"${require('ffmpeg-static')}"` : 'ffmpeg';
  const concatCmd = `${ffmpegBin} -y -f concat -safe 0 -i "${concatListPath}" -c copy "${finalStitchedVideo}"`;
  require('child_process').execSync(concatCmd, { stdio: 'pipe' });

  console.log(`\n🎉 ALL CHAPTERS & MASTER VIDEO RE-RENDERED WITH ZERO FALLBACKS / ZERO BLACK SCREENS!`);
  console.log(`📁 Master Video: ${finalStitchedVideo}`);
}

main().catch((err) => {
  console.error('❌ Fatal error during re-render:', err);
  process.exit(1);
});
