import { projectsStore } from '../src/db/localStore';
import {
  downloadYouTubeVideo,
  getProjectRawDir,
  loadProjectManifest,
  saveProjectManifest,
  sliceVideoIntoClips,
} from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_dome_villages';

// Curated high-relevance documentary sources directly matching the 13 script chapters:
const CURATED_SOURCES = [
  {
    url: 'https://www.youtube.com/watch?v=RFEoofiCC_w',
    desc: 'Ted Hayes 2003 interview and tour inside LA Dome Village / Justiceville (Chapters 2, 3, 4, 5, 6)',
  },
  {
    url: 'https://www.youtube.com/watch?v=d351ndbkJxY',
    desc: 'InterShelter Dome Solution to Homelessness — assembly & interiors (Chapters 3, 7)',
  },
  {
    url: 'https://www.youtube.com/watch?v=RANEduRN9Ew',
    desc: 'The Shelter - Honolulu HI Dome Project (First Assembly of God) (Chapter 7)',
  },
  {
    url: 'https://www.youtube.com/watch?v=sWe1v5RKpvM',
    desc: 'ABC Nightly News InterShelter Dome broadcast segment (Chapter 7)',
  },
  {
    url: 'https://www.youtube.com/watch?v=Db8NHiCyGTw',
    desc: 'Finding Home: Community First! Village in Austin, Texas (Chapter 9)',
  },
  {
    url: 'https://www.youtube.com/watch?v=B6n7rbKArAo',
    desc: 'Doorways to Dignity — Dignity Village in Portland, Oregon (Chapter 8)',
  },
];

async function run() {
  const project = projectsStore.all().find((p) => p.id === PROJECT_ID);
  if (!project) {
    throw new Error(`Project ${PROJECT_ID} not found. Run setup_dome_village.ts first.`);
  }

  const rawDir = getProjectRawDir(project.id);
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 INGESTING CURATED DOME DOCUMENTARY SOURCES');
  console.log(`Project: ${project.name} (${project.id})`);
  console.log(`Raw directory: ${rawDir}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  for (let i = 0; i < CURATED_SOURCES.length; i++) {
    const item = CURATED_SOURCES[i]!;
    const manifest = loadProjectManifest(project.id);
    const existing = manifest.sourceVideos.some(
      (v) => v.url === item.url || (v.localPath && v.localPath.includes(item.url.split('v=')[1] || ''))
    );

    if (existing) {
      console.log(`[${i + 1}/${CURATED_SOURCES.length}] Skipping already-ingested: ${item.desc}`);
      continue;
    }

    console.log(`\n[${i + 1}/${CURATED_SOURCES.length}] Downloading: ${item.desc}`);
    console.log(`URL: ${item.url}`);

    const downloaded = await downloadYouTubeVideo(item.url, rawDir);
    if (!downloaded) {
      console.warn(`⚠️ Download failed for ${item.url}, continuing to next source.`);
      continue;
    }

    const latestManifest = loadProjectManifest(project.id);
    latestManifest.sourceVideos.push({
      url: item.url,
      title: downloaded.title,
      localPath: downloaded.localPath,
      duration: downloaded.duration,
    });
    saveProjectManifest(latestManifest);

    console.log(`✂️ Slicing into 4-8s B-roll clips: "${downloaded.title}"...`);
    const clips = await sliceVideoIntoClips(downloaded.localPath, project.id, item.url);
    console.log(`✅ Sliced ${clips.length} clips with screenshots.`);
  }

  const finalManifest = loadProjectManifest(project.id);
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('🎉 ALL CURATED SOURCES INGESTED SUCCESSFULLY!');
  console.log(`Total Source Videos: ${finalManifest.sourceVideos.length}`);
  console.log(`Total Sliced B-Roll Clips: ${finalManifest.clips.length}`);
  console.log('═══════════════════════════════════════════════════════════════════');
}

run().catch((err) => {
  console.error('Fatal error during curated ingestion:', err);
  process.exit(1);
});
