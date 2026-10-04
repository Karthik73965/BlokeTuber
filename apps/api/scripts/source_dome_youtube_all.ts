import { projectsStore } from '../src/db/localStore';
import {
  getProjectRawDir,
  loadProjectManifest,
  saveProjectManifest,
  searchAndDownloadYouTube,
  sliceVideoIntoClips,
} from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_dome_villages';
const PROJECT_NAME = 'Dome Villages: The Cheapest Roof in America';

const SEARCH_QUERIES = [
  'Ted Hayes Dome Village Los Angeles',
  'Dome Village Los Angeles documentary 1993 2006',
  'Justiceville Ted Hayes Skid Row',
  'InterShelter dome homeless',
  'InterShelter fiberglass dome assembly',
  'First Assembly of God Honolulu dome village',
  'Dignity Village Portland Oregon documentary',
  'Opportunity Village Eugene Oregon tiny homes',
  'Community First Village Austin Texas Alan Graham',
  'Mobile Loaves and Fishes Community First Village',
  'Skid Row Los Angeles morning homelessness documentary',
  'elderly homelessness crisis California',
  'homeless veterans shelter documentary',
];

async function run() {
  const project = projectsStore.all().find(
    (p) => p.id === PROJECT_ID || p.name.toLowerCase() === PROJECT_NAME.toLowerCase()
  );
  if (!project) throw new Error(`Project not found: ${PROJECT_ID}`);

  const rawDir = getProjectRawDir(project.id);
  console.log(`[Dome Villages] Broad YouTube Sourcing Pass`);
  console.log(`Project ID: ${project.id}`);
  console.log(`Raw dir: ${rawDir}`);
  console.log(`Queries: ${SEARCH_QUERIES.length}`);

  for (const query of SEARCH_QUERIES) {
    const manifestBefore = loadProjectManifest(project.id);
    const existingUrls = new Set(manifestBefore.sourceVideos.map((video) => video.url));

    console.log(`\n🔍 Searching: ${query}`);
    const results = await searchAndDownloadYouTube(query, rawDir, 1);

    for (const result of results) {
      if (existingUrls.has(result.url)) {
        console.log(`Skipping already-tracked video: ${result.url}`);
        continue;
      }

      const latestManifest = loadProjectManifest(project.id);
      latestManifest.sourceVideos.push({
        url: result.url,
        title: result.title,
        localPath: result.localPath,
        duration: result.duration,
      });
      saveProjectManifest(latestManifest);

      console.log(`Slicing B-roll from: ${result.title}`);
      const clips = await sliceVideoIntoClips(result.localPath, project.id, result.url);
      console.log(`Sliced ${clips.length} clips.`);
    }
  }

  const updated = loadProjectManifest(project.id);
  console.log('\n[Dome Villages] Sourcing pass complete!');
  console.log(`Total Source videos: ${updated.sourceVideos.length}`);
  console.log(`Total Raw clips: ${updated.clips.length}`);
}

run().catch((error) => {
  console.error('[Dome Villages] Sourcing pass failed:', error);
  process.exit(1);
});
