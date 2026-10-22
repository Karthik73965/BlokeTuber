const { execSync } = require('child_process');
const fsys = require('fs');
const rawDir = 'C:/Users/karth/Documents/BlokeTuber/uploads/raw/proj_dome_villages';
const file = fsys.readdirSync(rawDir).find(f => f.includes('Living Inside'));
const fullPath = `${rawDir}/${file}`;

[30, 60, 90, 150, 210, 228, 259, 274, 348, 364, 400, 420, 482, 598, 1248].forEach(t => {
  execSync(`ffmpeg -y -ss ${t} -i "${fullPath}" -vframes 1 -q:v 2 "uploads/beat_snapshots/probe_${t}.jpg"`, { stdio: 'pipe' });
  console.log(`Probed t=${t}`);
});
