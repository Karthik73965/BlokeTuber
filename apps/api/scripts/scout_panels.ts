import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../..');
const rawDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages');
const vid = path.resolve(rawDir, 'What It’s Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4');
const outDir = path.resolve(repoRoot, 'uploads/thumbnails/scout_panels');
fs.mkdirSync(outDir, { recursive: true });

// Check 500-600s and 20-50s
const times = [25, 35, 45, 55, 65, 175, 185, 195, 205, 500, 520, 530, 540, 550, 560, 570, 580, 590, 640, 650, 660, 670, 680, 1220, 1240, 1250, 1260, 1270];

for (const t of times) {
  const outJpg = path.resolve(outDir, `panel_${String(t).padStart(4, '0')}s.jpg`);
  if (!fs.existsSync(outJpg)) {
    try {
      execSync(`ffmpeg -y -ss ${t} -i "${vid}" -vframes 1 -vf "scale=640:360" -q:v 3 "${outJpg}"`, { stdio: 'pipe' });
    } catch (e) {}
  }
}
console.log('Panel scout complete!');
