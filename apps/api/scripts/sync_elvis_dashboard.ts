import fs from 'fs';
import path from 'path';
import { projectsStore, chaptersStore } from '../src/db/localStore';

const PROJECT_ID = 'proj_1789299409134';
const TIMELINE_DIR = 'C:/Users/karth/Documents/BlokeTuber/apps/api/uploads/timelines/elvis';

function syncElvisDashboard() {
  const project = projectsStore.findById(PROJECT_ID);
  if (!project) {
    console.error('Project not found:', PROJECT_ID);
    return;
  }

  console.log(`Found Elvis project: "${project.title}" (${project.id})`);

  for (let i = 1; i <= 7; i++) {
    const filename = `chapter_0${i}.json`;
    const filepath = path.join(TIMELINE_DIR, filename);
    if (!fs.existsSync(filepath)) {
      console.warn(`Missing timeline file: ${filepath}`);
      continue;
    }

    const timeline = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
    const chapters = chaptersStore.forProject(PROJECT_ID);
    const targetChapter = chapters.find((c: any) => c.chapterIndex === i);

    if (targetChapter) {
      chaptersStore.update(PROJECT_ID, targetChapter.id, {
        timelineJson: timeline,
        status: 'staged',
        updatedAt: new Date().toISOString(),
      });
      console.log(`✅ Synced Chapter ${i}: ${targetChapter.id} (${timeline.clips.length} beats)`);
    } else {
      console.warn(`No chapter found in store for index ${i}`);
    }
  }

  console.log('\n🎉 Elvis project in store is now fully synchronized with all 7 updated timelines!');
}

syncElvisDashboard();
