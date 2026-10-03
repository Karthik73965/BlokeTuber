import { projectsStore } from '../src/db/localStore';
import {
  getProjectRawDir,
  loadProjectManifest,
  saveProjectManifest,
  searchAndDownloadYouTube,
  sliceVideoIntoClips,
} from '../src/services/youtubeSourcing';

const PROJECT_NAME = 'Portable Toilets';

const SEARCH_QUERIES = [
  'Jose Fuentes Pacoima homeless encampment hillside',
  'Pacoima Glenoaks homeless encampment hillside',
  'Los Angeles hillside homeless encampment Pacoima',
  'Caltrans homeless encampment cleanup Los Angeles',
  'Los Angeles homeless encampment cleanup freeway',
  'homeless encampment freeway California documentary',
  'Los Angeles homeless man builds shelter hillside',
  'homeless shelter built by hand Los Angeles',
  'Pacoima homeless encampment news',
  'California homeless encampment Caltrans removal',
  'portable toilet tiny home homeless documentary',
  'portable toilet tiny homes homeless people',
  'Los Angeles street homelessness documentary',
  'homeless outreach Los Angeles encampment',
  'homeless man garden encampment Los Angeles',
];

async function run() {
  const project = projectsStore.all().find((p) => p.name.toLowerCase() === PROJECT_NAME.toLowerCase());
  if (!project) throw new Error(`Project not found: ${PROJECT_NAME}`);

  const rawDir = getProjectRawDir(project.id);
  console.log(`[Portable Toilets] Broad sourcing pass`);
  console.log(`Project ID: ${project.id}`);
  console.log(`Raw dir: ${rawDir}`);
  console.log(`Queries: ${SEARCH_QUERIES.length}`);

  for (const query of SEARCH_QUERIES) {
    const manifestBefore = loadProjectManifest(project.id);
    const existingUrls = new Set(manifestBefore.sourceVideos.map((video) => video.url));

    console.log(`\nSearching: ${query}`);
    const results = await searchAndDownloadYouTube(query, rawDir, 2);

    for (const result of results) {
      if (existingUrls.has(result.url)) {
        console.log(`Skipping already tracked result: ${result.url}`);
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

      const clips = await sliceVideoIntoClips(result.localPath, project.id, result.url);
      console.log(`Added ${clips.length} clips from: ${result.title}`);
    }

    const manifestAfter = loadProjectManifest(project.id);
    console.log(`Pool now: ${manifestAfter.sourceVideos.length} source videos, ${manifestAfter.clips.length} raw clips`);
  }

  const finalManifest = loadProjectManifest(project.id);
  console.log('\n[Portable Toilets] Broad sourcing complete');
  console.log(`Source videos: ${finalManifest.sourceVideos.length}`);
  console.log(`Raw clips: ${finalManifest.clips.length}`);
}

run().catch((error) => {
  console.error('[Portable Toilets] Broad sourcing failed:', error);
  process.exit(1);
});
