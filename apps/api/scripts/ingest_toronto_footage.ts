import fs from 'fs';
import path from 'path';
import {
  downloadYouTubeVideo,
  getProjectRawDir,
  loadProjectManifest,
  saveProjectManifest,
  sliceVideoIntoClips,
} from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_1790675508620';
const RAW_DIR = getProjectRawDir(PROJECT_ID);

const SOURCE_URLS = [
  'https://youtu.be/EbfxDmpmu44', // User reference video: CBC report on tiny home presentation
  'https://www.youtube.com/watch?v=AdbmLKaGleg', // Toronto Tiny Shelters official: Resident testimonials inside homes
  'https://www.youtube.com/watch?v=t1LDFoPS3tc', // Toronto Tiny Shelters: Khaleel workshop/building update
  'https://www.youtube.com/watch?v=ajGc9txBs-A', // Leslieville backyard tiny home placement
];

async function run() {
  console.log(`[Toronto Ingestion] Starting footage ingestion for project ${PROJECT_ID}`);
  console.log(`Raw directory: ${RAW_DIR}`);

  const manifest = loadProjectManifest(PROJECT_ID);
  const existingUrls = new Set(manifest.sourceVideos.map((v) => v.url));

  // 1. First, slice local VIdeo 1.mp4 if it exists in raw directory and hasn't been sliced yet
  const localVideoPath = path.join(RAW_DIR, 'VIdeo 1.mp4');
  const alreadySlicedLocal = manifest.clips.some((c) => c.filename.startsWith('video_1_clip_'));
  
  if (fs.existsSync(localVideoPath) && !alreadySlicedLocal) {
    console.log(`\n🎬 Slicing local user raw video: VIdeo 1.mp4`);
    const localClips = await sliceVideoIntoClips(localVideoPath, PROJECT_ID, 'local:VIdeo 1.mp4');
    console.log(`✅ Sliced ${localClips.length} clips from VIdeo 1.mp4`);
    
    // Add to manifest
    const latestManifest = loadProjectManifest(PROJECT_ID);
    const existingIds = new Set(latestManifest.clips.map((c) => c.id));
    for (const c of localClips) {
      if (!existingIds.has(c.id)) {
        latestManifest.clips.push(c);
      }
    }
    latestManifest.sourceVideos.push({
      url: 'local:VIdeo 1.mp4',
      title: 'Ryan Donais Tiny Mobile Home (User Raw)',
      localPath: localVideoPath,
      duration: 163,
    });
    saveProjectManifest(latestManifest);
  }

  // 2. Download and slice YouTube source videos
  for (const url of SOURCE_URLS) {
    const currentManifest = loadProjectManifest(PROJECT_ID);
    if (currentManifest.sourceVideos.some((v) => v.url === url)) {
      console.log(`⏭️ Skipping already ingested URL: ${url}`);
      continue;
    }

    console.log(`\n⬇️ Downloading: ${url}`);
    const downloaded = await downloadYouTubeVideo(url, RAW_DIR);
    if (!downloaded) {
      console.warn(`❌ Download failed for: ${url}`);
      continue;
    }

    const updatedManifest = loadProjectManifest(PROJECT_ID);
    updatedManifest.sourceVideos.push({
      url,
      title: downloaded.title,
      localPath: downloaded.localPath,
      duration: downloaded.duration,
    });
    saveProjectManifest(updatedManifest);

    console.log(`✂️ Slicing video: ${downloaded.title}`);
    const clips = await sliceVideoIntoClips(downloaded.localPath, PROJECT_ID, url);
    console.log(`✅ Sliced ${clips.length} clips from: ${downloaded.title}`);

    // Update manifest with new clips
    const finalManifest = loadProjectManifest(PROJECT_ID);
    const clipIdSet = new Set(finalManifest.clips.map((c) => c.id));
    for (const c of clips) {
      if (!clipIdSet.has(c.id)) {
        finalManifest.clips.push(c);
      }
    }
    saveProjectManifest(finalManifest);
  }

  const summary = loadProjectManifest(PROJECT_ID);
  console.log('\n========================================');
  console.log('🎉 [Toronto Ingestion] Ingestion Complete!');
  console.log(`Source Videos: ${summary.sourceVideos.length}`);
  console.log(`Total Sliced Clips: ${summary.clips.length}`);
  console.log(`Manifest: ${RAW_DIR}\\manifest.json`);
  console.log('========================================\n');
}

run().catch((err) => {
  console.error('[Toronto Ingestion] Error:', err);
  process.exit(1);
});
