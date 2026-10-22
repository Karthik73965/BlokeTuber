const { execSync } = require('child_process');
const fsys = require('fs');
const path = require('path');

const rawDir = 'C:/Users/karth/Documents/BlokeTuber/uploads/raw/proj_dome_villages';
const hFile = fsys.readdirSync(rawDir).find(f => f.includes('Honolulu'));
const hPath = `${rawDir}/${hFile}`;

// Probe Honolulu every 20s
for (let t = 20; t <= 320; t += 20) {
  try {
    execSync(`ffmpeg -y -ss ${t} -i "${hPath}" -vframes 1 -q:v 2 "uploads/beat_snapshots/h_${t}.jpg"`, { stdio: 'pipe' });
    console.log(`Honolulu t=${t} done`);
  } catch(e) {}
}

const tFile = fsys.readdirSync(rawDir).find(f => f.includes('ted_hayes'));
if (tFile) {
  const tPath = `${rawDir}/${tFile}`;
  for (let t = 10; t <= 120; t += 20) {
    try {
      execSync(`ffmpeg -y -ss ${t} -i "${tPath}" -vframes 1 -q:v 2 "uploads/beat_snapshots/ted_${t}.jpg"`, { stdio: 'pipe' });
      console.log(`Ted t=${t} done`);
    } catch(e) {}
  }
}
