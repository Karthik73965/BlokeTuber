import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const dir = path.resolve('uploads/raw/proj_dome_villages/downloads');
const files = fs.readdirSync(dir);

for (const f of files) {
  if (!f.endsWith('.mp4')) continue;
  const p = path.join(dir, f);
  const stats = fs.statSync(p);
  if (stats.size < 5 * 1024 * 1024) continue; // only check files > 5MB
  try {
    const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=p=0 "${p}"`, { encoding: 'utf-8' }).trim();
    console.log(`${f} (${(stats.size/1024/1024).toFixed(1)}MB) --> ${probe}`);
  } catch (e: any) {
    console.log(`${f} --> probe error`);
  }
}
