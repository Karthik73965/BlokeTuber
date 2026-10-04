import { projectsStore } from '../src/db/localStore';
import {
  downloadYouTubeVideo,
  getProjectRawDir,
  loadProjectManifest,
  saveProjectManifest,
  sliceVideoIntoClips,
} from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_dome_villages';
const PROJECT_NAME = 'Dome Villages: The Cheapest Roof in America';

const URLS = [
  'https://youtu.be/G2MAIJzAUhE?si=vTWeI-GsDQ4rck8n', // What It's Actually Like Living Inside the $2,000 Dome Homes
];

async function run() {
  const project = projectsStore.all().find(
    (p) => p.id === PROJECT_ID || p.name.toLowerCase() === PROJECT_NAME.toLowerCase()
  );
  if (!project) {
    throw new Error(`Project not found: ${PROJECT_ID}. Run setup_dome_village.ts first.`);
  }

  const rawDir = getProjectRawDir(project.id);
  const manifest = loadProjectManifest(project.id);
  const existingUrls = new Set(manifest.sourceVideos.map((video) => video.url));

  console.log(`[Dome Villages] Ingesting ${URLS.length} YouTube source videos...`);
  console.log(`Project ID: ${project.id}`);
  console.log(`Raw dir: ${rawDir}`);

  for (const url of URLS) {
    if (existingUrls.has(url)) {
      console.log(`Skipping already-ingested URL: ${url}`);
      continue;
    }

    console.log(`Downloading 1080p: ${url}`);
    const downloaded = await downloadYouTubeVideo(url, rawDir);
    if (!downloaded) {
      console.warn(`Download failed: ${url}`);
      continue;
    }

    const latestManifest = loadProjectManifest(project.id);
    latestManifest.sourceVideos.push({
      url,
      title: downloaded.title,
      localPath: downloaded.localPath,
      duration: downloaded.duration,
    });
    saveProjectManifest(latestManifest);

    console.log(`Slicing video into 4-8s B-roll clips with keyframes: ${downloaded.title}`);
    const clips = await sliceVideoIntoClips(downloaded.localPath, project.id, url);
    console.log(`Sliced ${clips.length} clips from: ${downloaded.title}`);
  }

  const updated = loadProjectManifest(project.id);
  console.log('\n[Dome Villages] YouTube Ingestion Complete!');
  console.log(`Source videos: ${updated.sourceVideos.length}`);
  console.log(`Raw sliced clips: ${updated.clips.length}`);
  console.log(`Manifest: ${rawDir}\\manifest.json`);
}

run().catch((error) => {
  console.error('[Dome Villages] YouTube ingestion failed:', error);
  process.exit(1);
});
