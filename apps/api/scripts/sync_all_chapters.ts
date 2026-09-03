import fs from 'fs';
import path from 'path';
import { projectsStore } from '../src/db/localStore';

const PROJECT_ID = 'abac4778-84a5-486b-8675-32161d7885e0';
const resultsDir = path.resolve(__dirname, '../output/chapter_results');

export function syncAllChapters() {
  if (!fs.existsSync(resultsDir)) {
    console.log('No chapter_results directory found.');
    return;
  }

  const files = fs.readdirSync(resultsDir).filter(f => f.startsWith('chapter_') && f.endsWith('.json'));
  console.log(`Found ${files.length} completed chapter result files.`);

  const project = projectsStore.findById(PROJECT_ID);
  if (!project) {
    console.error('Project not found:', PROJECT_ID);
    return;
  }

  const chapters = [...(project.chapters || [])];

  for (const file of files) {
    const data = JSON.parse(fs.readFileSync(path.join(resultsDir, file), 'utf8'));
    const chIdx = chapters.findIndex(c => c.chapterIndex === data.index);

    if (chIdx !== -1) {
      chapters[chIdx] = {
        ...chapters[chIdx]!,
        ...data.chapterPatch,
        timelineJson: data.timeline,
        status: 'completed',
        updatedAt: new Date().toISOString(),
      };
      console.log(`  Synced Chapter ${data.index}: "${data.chapterPatch?.title}" (${data.timeline?.clips?.length} clips)`);
    }

    if (data.newlyUsedMedia?.length > 0) {
      projectsStore.addUsedMedia(PROJECT_ID, data.newlyUsedMedia);
    }
  }

  projectsStore.update(PROJECT_ID, { chapters });
  console.log('✅ Successfully updated project in store!');
}

if (require.main === module) {
  syncAllChapters();
}
