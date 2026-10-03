import { projectsStore } from '../src/db/localStore';
import {
  downloadYouTubeVideo,
  getProjectRawDir,
  loadProjectManifest,
  saveProjectManifest,
  sliceVideoIntoClips,
} from '../src/services/youtubeSourcing';

const PROJECT_NAME = 'Portable Toilets';
const URLS = [
  'https://youtu.be/1mBedOE9cCc?si=VUIChzZhbHvRAoVF',
  'https://youtu.be/wW1U0B7pah0?si=5NFeSA9bZrUfPWy-',
];

async function run() {
  const project = projectsStore.all().find((p) => p.name.toLowerCase() === PROJECT_NAME.toLowerCase());
  if (!project) {
    throw new Error(`Project not found: ${PROJECT_NAME}. Run setup_portable_toilets.ts first.`);
  }

  const rawDir = getProjectRawDir(project.id);
  const manifest = loadProjectManifest(project.id);
  const existingUrls = new Set(manifest.sourceVideos.map((video) => video.url));

  console.log(`[Portable Toilets] Ingesting ${URLS.length} YouTube source videos`);
  console.log(`Project ID: ${project.id}`);
  console.log(`Raw dir: ${rawDir}`);

  for (const url of URLS) {
    if (existingUrls.has(url)) {
      console.log(`Skipping already-ingested URL: ${url}`);
      continue;
    }

    console.log(`Downloading: ${url}`);
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

    const clips = await sliceVideoIntoClips(downloaded.localPath, project.id, url);
    console.log(`Sliced ${clips.length} clips from: ${downloaded.title}`);
  }

  const updated = loadProjectManifest(project.id);
  console.log('[Portable Toilets] YouTube ingestion complete');
  console.log(`Source videos: ${updated.sourceVideos.length}`);
  console.log(`Raw clips: ${updated.clips.length}`);
  console.log(`Manifest: ${rawDir}\\manifest.json`);
}

run().catch((error) => {
  console.error('[Portable Toilets] YouTube ingestion failed:', error);
  process.exit(1);
});
