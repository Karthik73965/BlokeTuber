import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const TIMELINES_DIR = path.resolve('uploads/timelines/dome');

let totalClips = 0;
let below720Count = 0;
let bannedCount = 0;
const resolutionStats: Record<string, number> = {};
const prefixStats: Record<string, number> = {};

for (let ch = 1; ch <= 13; ch++) {
  const p = path.join(TIMELINES_DIR, `chapter_${String(ch).padStart(2, '0')}_final.json`);
  if (!fs.existsSync(p)) continue;
  const t = JSON.parse(fs.readFileSync(p, 'utf-8'));
  
  for (const c of t.clips) {
    totalClips++;
    const clipPath = c.clipPath;
    const filename = path.basename(clipPath);
    const prefix = filename.split('_clip_')[0] || filename;
    prefixStats[prefix] = (prefixStats[prefix] || 0) + 1;

    if (clipPath.includes('G2MAIJzAUhE')) bannedCount++;

    try {
      const res = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${clipPath}"`, {
        encoding: 'utf-8',
      }).trim();

      const parts = res.split('x').map(Number);
      const h = parts[1] || 0;
      resolutionStats[res] = (resolutionStats[res] || 0) + 1;

      if (h < 720) {
        below720Count++;
        console.error(`ALERT: Chapter ${ch} beat ${c.beatIndex} resolution ${res}: ${filename}`);
      }
    } catch (e: any) {
      console.error(`Error probing ${filename}: ${e.message}`);
    }
  }
}

console.log('\n=======================================');
console.log('TOTAL CLIPS CHECKED:', totalClips);
console.log('BANNED CLIPS FOUND:', bannedCount);
console.log('BELOW 720p CLIPS FOUND:', below720Count);
console.log('RESOLUTION BREAKDOWN:');
console.log(JSON.stringify(resolutionStats, null, 2));
console.log('\nPREFIX BREAKDOWN:');
console.log(JSON.stringify(prefixStats, null, 2));
console.log('=======================================');
