import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../..');
const rawDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages');
const vid = path.join(rawDir, 'What It’s Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4');
const outDir = path.resolve(repoRoot, 'uploads/thumbnails/search_yellow');
fs.mkdirSync(outDir, { recursive: true });

// search timestamps
const testTimes = [
  30, 40, 50, 180, 190, 200, 210, 220, 230, 310, 320, 330,
  460, 470, 480, 510, 540, 550, 560, 570, 610, 620, 630, 640,
  730, 740, 750, 760, 770, 810, 820, 830, 850, 860, 870,
  980, 990, 1000, 1010, 1050, 1060, 1070, 1100, 1110, 1120,
  1150, 1160, 1170, 1180, 1190, 1200, 1210, 1220, 1230, 1240, 1250, 1260
];

for (const t of testTimes) {
  const outJpg = path.join(outDir, `y_${String(t).padStart(4, '0')}s.jpg`);
  if (!fs.existsSync(outJpg)) {
    try {
      execSync(`ffmpeg -y -ss ${t} -i "${vid}" -vframes 1 -vf "scale=640:360" -q:v 3 "${outJpg}"`, { stdio: 'pipe' });
    } catch (e) {}
  }
}
console.log('Search yellow completed!');
