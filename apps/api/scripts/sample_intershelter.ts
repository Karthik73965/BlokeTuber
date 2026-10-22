import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../..');
const dlDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages/downloads');
const vid = path.join(dlDir, 'intershelter_dome_home_presentation.mp4');
const outDir = path.resolve(repoRoot, 'uploads/thumbnails/intershelter_samples');
fs.mkdirSync(outDir, { recursive: true });

for (let t = 10; t <= 200; t += 20) {
  const outJpg = path.join(outDir, `is_${String(t).padStart(4, '0')}s.jpg`);
  try {
    execSync(`ffmpeg -y -ss ${t} -i "${vid}" -vframes 1 -vf "scale=640:360" -q:v 3 "${outJpg}"`, { stdio: 'pipe' });
  } catch (e) {}
}
console.log('Intershelter samples generated!');
