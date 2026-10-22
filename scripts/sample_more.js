const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve('uploads/raw/proj_dome_villages/probe_frames/living_detail');
fs.mkdirSync(outDir, { recursive: true });

const v = 'uploads/raw/proj_dome_villages/What It’s Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4';
for (let t = 5; t < 600; t += 15) {
  const out = path.join(outDir, `f_${String(t).padStart(4, '0')}s.jpg`);
  try {
    execSync(`ffmpeg -y -ss ${t} -i "${v}" -vframes 1 -q:v 3 "${out}"`, { stdio: 'ignore' });
  } catch (e) {}
}

const outDir2 = path.resolve('uploads/raw/proj_dome_villages/probe_frames/living_detail_late');
fs.mkdirSync(outDir2, { recursive: true });
for (let t = 600; t < 1300; t += 20) {
  const out = path.join(outDir2, `f_${String(t).padStart(4, '0')}s.jpg`);
  try {
    execSync(`ffmpeg -y -ss ${t} -i "${v}" -vframes 1 -q:v 3 "${out}"`, { stdio: 'ignore' });
  } catch (e) {}
}

console.log('Done sampling living dome');
