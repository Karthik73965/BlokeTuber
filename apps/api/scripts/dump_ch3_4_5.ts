import fs from 'fs';
import path from 'path';

const storePath = path.resolve(process.cwd(), 'output/store/projects.json');
const projects = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
const p = projects.find((x: any) => x.id === 'proj_dome_villages');

for (const idx of [3, 4, 5]) {
  const ch = p.chapters.find((c: any) => c.chapterIndex === idx);
  console.log(`\n=== CHAPTER ${idx}: ${ch.title} ===`);
  const clips = ch.timelineJson?.clips || [];
  console.log(`Total clips: ${clips.length}`);
  for (const c of clips.slice(0, 10)) {
    console.log(`Beat ${c.beatIndex} [${c.startTime}-${c.endTime}s]: "${c.text}" -> ${path.basename(c.clipPath || '')}`);
  }
}
