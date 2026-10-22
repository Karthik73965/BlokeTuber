const { execSync } = require('child_process');
const fsys = require('fs');
const rawDir = 'C:/Users/karth/Documents/BlokeTuber/uploads/raw/proj_dome_villages';
const file = fsys.readdirSync(rawDir).find(f => f.includes('Honolulu'));
console.log('Honolulu file:', file);
const fullPath = `${rawDir}/${file}`;

[10, 30, 60, 75, 110, 140, 180, 200, 240, 300].forEach(t => {
  execSync(`ffmpeg -y -ss ${t} -i "${fullPath}" -vframes 1 -q:v 2 "uploads/beat_snapshots/honolulu_${t}.jpg"`, { stdio: 'pipe' });
  console.log(`Probed Honolulu t=${t}`);
});
