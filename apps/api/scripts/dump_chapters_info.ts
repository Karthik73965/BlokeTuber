import fs from 'fs';
import path from 'path';

const storePath = path.resolve(process.cwd(), 'output/store/projects.json');
const projects = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
const p = projects.find((x: any) => x.id === 'proj_dome_villages');

const report: any[] = [];

for (const ch of p.chapters) {
  const clips = ch.timelineJson?.clips || [];
  report.push({
    chapterIndex: ch.chapterIndex,
    id: ch.id,
    title: ch.title,
    audioPath: ch.timelineJson?.masterAudioPath || ch.audioPath,
    totalDuration: ch.timelineJson?.totalDuration,
    clipsCount: clips.length,
    clipsSummary: clips.slice(0, 5).map((c: any) => ({
      beat: c.beatIndex,
      text: c.text,
      clipPath: path.basename(c.clipPath || ''),
    })),
  });
}

console.log(JSON.stringify(report, null, 2));
