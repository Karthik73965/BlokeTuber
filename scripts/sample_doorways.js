const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve('uploads/raw/proj_dome_villages/probe_frames/doorways_trailer');
fs.mkdirSync(outDir, { recursive: true });

const v = 'uploads/raw/proj_dome_villages/Doorways to Dignity documentary trailer_B6n7rbKArAo.mp4';
for (let t = 5; t < 150; t += 10) {
  const out = path.join(outDir, `door_${String(Math.floor(t)).padStart(3, '0')}s.jpg`);
  try {
    execSync(`ffmpeg -y -ss ${t} -i "${v}" -vframes 1 -q:v 3 "${out}"`, { stdio: 'ignore' });
  } catch (e) {}
}

console.log('Sampled doorways trailer frames:', fs.readdirSync(outDir).length);
