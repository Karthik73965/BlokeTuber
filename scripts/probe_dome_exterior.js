const { execSync } = require('child_process');
const fsys = require('fs');
const rawDir = 'C:/Users/karth/Documents/BlokeTuber/uploads/raw/proj_dome_villages';
const file = fsys.readdirSync(rawDir).find(f => f.includes('Living Inside'));
const fullPath = `${rawDir}/${file}`;

[15, 25, 32, 36, 45, 52, 75, 80, 85].forEach(t => {
  execSync(`ffmpeg -y -ss ${t} -i "${fullPath}" -vframes 1 -q:v 2 "uploads/beat_snapshots/test/dome_${t}.jpg"`, { stdio: 'pipe' });
  console.log(`Probed t=${t}`);
});
