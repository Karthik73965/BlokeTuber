const { execSync } = require('child_process');
const fs = require('path');
const fsys = require('fs');

const rawDir = 'C:/Users/karth/Documents/BlokeTuber/uploads/raw/proj_dome_villages';
const file = fsys.readdirSync(rawDir).find(f => f.includes('Living Inside'));
console.log('Found source file:', file);

const fullPath = `${rawDir}/${file}`;
execSync(`ffmpeg -y -ss 213 -i "${fullPath}" -vframes 1 -q:v 2 "uploads/beat_snapshots/test_live_213.jpg"`, { stdio: 'inherit' });
console.log('Successfully extracted test_live_213.jpg');
