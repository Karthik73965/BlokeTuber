import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const rawDir = path.resolve(__dirname, '../../../uploads/raw/proj_dome_villages');
const dlDir = path.join(rawDir, 'downloads');

const files = fs.readdirSync(dlDir).filter(f => f.endsWith('.mp4'));
for (const f of files) {
  const p = path.join(dlDir, f);
  try {
    const dur = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${p}"`, { encoding: 'utf8' }).trim();
    console.log(`${f.padEnd(40)} dur: ${parseFloat(dur).toFixed(1)}s`);
  } catch (e) {}
}
