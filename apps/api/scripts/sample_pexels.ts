import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../..');
const dlDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages/downloads');
const outDir = path.resolve(repoRoot, 'uploads/thumbnails/pexels_samples');
fs.mkdirSync(outDir, { recursive: true });

const files = fs.readdirSync(dlDir).filter(f => f.startsWith('pexels_') && f.endsWith('.mp4'));

for (const f of files) {
  const full = path.join(dlDir, f);
  const outJpg = path.join(outDir, `${path.basename(f, '.mp4')}.jpg`);
  if (!fs.existsSync(outJpg)) {
    try {
      execSync(`ffmpeg -y -ss 2.0 -i "${full}" -vframes 1 -vf "scale=640:360" -q:v 3 "${outJpg}"`, { stdio: 'pipe' });
    } catch (e) {}
  }
}
console.log('Pexels samples generated!');
