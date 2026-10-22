const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve('uploads/raw/proj_dome_villages/probe_frames/solution_detail');
fs.mkdirSync(outDir, { recursive: true });

const v = 'uploads/raw/proj_dome_villages/InterShelter Dome Solution to Homelessness_d351ndbkJxY.mp4';
for (let t = 5; t < 740; t += 15) {
  const out = path.join(outDir, `f_${String(Math.floor(t)).padStart(4, '0')}s.jpg`);
  try {
    execSync(`ffmpeg -y -ss ${t} -i "${v}" -vframes 1 -q:v 3 "${out}"`, { stdio: 'ignore' });
  } catch (e) {}
}

console.log('Sampled solution detail:', fs.readdirSync(outDir).length);
