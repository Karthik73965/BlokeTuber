import fs from 'fs';
import path from 'path';

const storePath = path.resolve(process.cwd(), 'output/store/projects.json');
const projects = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
const p = projects.find((x: any) => x.id === 'proj_dome_villages');

const result: any = {};

for (const ch of p.chapters) {
  result[ch.chapterIndex] = {
    chapterIndex: ch.chapterIndex,
    id: ch.id,
    title: ch.title,
    duration: ch.timelineJson?.totalDuration || ch.duration,
    clips: (ch.timelineJson?.clips || []).map((c: any) => ({
      beatIndex: c.beatIndex,
      startTime: c.startTime,
      endTime: c.endTime,
      text: c.text,
      currentClip: path.basename(c.clipPath || ''),
    })),
  };
}

fs.writeFileSync('uploads/all_chapters_beats.json', JSON.stringify(result, null, 2), 'utf-8');
console.log('Saved all chapter beats to uploads/all_chapters_beats.json');
