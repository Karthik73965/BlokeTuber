import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../..');
const rawDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages');
const vid = path.resolve(rawDir, 'What It’s Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4');
const outDir = path.resolve(repoRoot, 'uploads/thumbnails/scout_living_all');
fs.mkdirSync(outDir, { recursive: true });

console.log('Sampling living inside every 30s from 360s to 1290s...');
for (let t = 360; t <= 1290; t += 30) {
  const outJpg = path.resolve(outDir, `thumb_${String(t).padStart(4, '0')}s.jpg`);
  if (!fs.existsSync(outJpg)) {
    try {
      execSync(`ffmpeg -y -ss ${t} -i "${vid}" -vframes 1 -vf "scale=640:360" -q:v 3 "${outJpg}"`, { stdio: 'pipe' });
    } catch (e) {}
  }
}
console.log('Done sampling living inside all!');
