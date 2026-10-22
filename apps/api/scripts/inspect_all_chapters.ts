import fs from 'fs';
import path from 'path';

const storePath = path.resolve(process.cwd(), 'output/store/projects.json');
const projects = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
const p = projects.find((x: any) => x.id === 'proj_dome_villages');

console.log('Project title:', p.title);
console.log('Total chapters:', p.chapters.length);

for (const ch of p.chapters) {
  const clips = ch.timelineJson?.clips || [];
  console.log(`Ch ${ch.chapterIndex}: [${ch.id}] "${ch.title}" | Duration: ${ch.duration}s | Clips: ${clips.length} | Audio: ${ch.audioPath}`);
}
