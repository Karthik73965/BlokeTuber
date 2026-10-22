const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve('uploads/raw/proj_dome_villages/probe_frames/inter_detail');
fs.mkdirSync(outDir, { recursive: true });

const v = 'uploads/raw/proj_dome_villages/downloads/intershelter_dome_home_presentation.mp4';
for (let t = 0; t < 215; t += 4) {
  const out = path.join(outDir, `f_${String(Math.floor(t)).padStart(3, '0')}s.jpg`);
  try {
    execSync(`ffmpeg -y -ss ${t} -i "${v}" -vframes 1 -q:v 3 "${out}"`, { stdio: 'ignore' });
  } catch (e) {}
}

console.log('Sampled intershelter detail:', fs.readdirSync(outDir).length);
