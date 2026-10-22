import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../..');
const rawDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages');
const vid = path.join(rawDir, 'The Shelter - Honolulu HI Dome Project_RANEduRN9Ew.mp4');
const outDir = path.resolve(repoRoot, 'uploads/thumbnails/shelter_detail');
fs.mkdirSync(outDir, { recursive: true });

for (let t = 40; t <= 300; t += 10) {
  const outJpg = path.join(outDir, `sh_${String(t).padStart(4, '0')}s.jpg`);
  try {
    execSync(`ffmpeg -y -ss ${t} -i "${vid}" -vframes 1 -vf "scale=640:360" -q:v 3 "${outJpg}"`, { stdio: 'pipe' });
  } catch (e) {}
}
console.log('The Shelter detail samples generated!');
