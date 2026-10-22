const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve('uploads/raw/proj_dome_villages/probe_frames/living_extra');
fs.mkdirSync(outDir, { recursive: true });

const v = 'uploads/raw/proj_dome_villages/What It’s Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4';
const times = [20, 40, 60, 80, 120, 140, 160, 360, 365, 370, 375, 430, 470, 520, 550, 620, 650, 700, 750, 800, 850, 900, 950, 1000, 1050, 1100, 1150, 1200, 1250];

for (const t of times) {
  const out = path.join(outDir, `extra_${String(t).padStart(4, '0')}s.jpg`);
  try {
    execSync(`ffmpeg -y -ss ${t} -i "${v}" -vframes 1 -q:v 3 "${out}"`, { stdio: 'ignore' });
  } catch (e) {}
}

console.log('Sampled living extra frames:', fs.readdirSync(outDir).length);
