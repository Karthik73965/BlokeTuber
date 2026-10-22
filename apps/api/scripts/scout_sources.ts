import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../..');
const rawDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages');
const livingInside = path.resolve(rawDir, 'What It’s Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4');
const findingHome = path.resolve(rawDir, 'Finding Home： Community First! Village_Db8NHiCyGTw.mp4');
const theShelter = path.resolve(rawDir, 'The Shelter - Honolulu HI Dome Project_RANEduRN9Ew.mp4');
const outDir = path.resolve(repoRoot, 'uploads/thumbnails/scouting');

fs.mkdirSync(outDir, { recursive: true });

function sampleVideo(filePath: string, prefix: string, interval = 60, maxTime = 1200) {
  if (!fs.existsSync(filePath)) {
    console.log(`Missing: ${filePath}`);
    return;
  }
  console.log(`Sampling ${prefix} (${path.basename(filePath)})...`);
  for (let t = 10; t <= maxTime; t += interval) {
    const outJpg = path.resolve(outDir, `${prefix}_${String(t).padStart(4, '0')}s.jpg`);
    try {
      execSync(`ffmpeg -y -ss ${t} -i "${filePath}" -vframes 1 -vf "scale=640:360" -q:v 3 "${outJpg}"`, { stdio: 'pipe' });
    } catch (e) {
      break;
    }
  }
}

sampleVideo(livingInside, 'living_inside', 60, 1260);
sampleVideo(findingHome, 'finding_home', 30, 270);
sampleVideo(theShelter, 'the_shelter', 30, 310);

console.log('Scouting sample frames created!');
