import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../..');
const rawDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages');
const dlDir = path.resolve(rawDir, 'downloads');
const contactDir = path.resolve(repoRoot, 'uploads/thumbnails/scene_catalog');
fs.mkdirSync(contactDir, { recursive: true });

interface ProbeItem {
  name: string;
  file: string;
  samplePoints: number[];
}

const items: ProbeItem[] = [
  {
    name: 'living_inside',
    file: path.resolve(rawDir, 'What It’s Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4'),
    samplePoints: [15, 45, 75, 120, 180, 240, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1020, 1080, 1140, 1200]
  },
  {
    name: 'finding_home',
    file: path.resolve(rawDir, 'Finding Home： Community First! Village_Db8NHiCyGTw.mp4'),
    samplePoints: [10, 25, 45, 65, 85, 110, 140, 170, 200, 230, 260]
  },
  {
    name: 'the_shelter',
    file: path.resolve(rawDir, 'The Shelter - Honolulu HI Dome Project_RANEduRN9Ew.mp4'),
    samplePoints: [15, 35, 60, 90, 120, 150, 180, 210, 240, 270, 300]
  },
  {
    name: 'skid_row_emergency',
    file: path.resolve(dlDir, 'skid_row_la_state_of_emergency.mp4'),
    samplePoints: [15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315]
  },
  {
    name: 'portland_pods',
    file: path.resolve(dlDir, 'portland_tiny_home_pods_hd.mp4'),
    samplePoints: [10, 30, 50, 70, 90, 110, 130, 150]
  }
];

for (const item of items) {
  if (!fs.existsSync(item.file)) {
    console.log(`Skipping missing: ${item.file}`);
    continue;
  }
  console.log(`Sampling ${item.name}...`);
  for (const t of item.samplePoints) {
    const outJpg = path.resolve(contactDir, `${item.name}_${String(t).padStart(4, '0')}s.jpg`);
    if (!fs.existsSync(outJpg)) {
      try {
        execSync(`ffmpeg -y -ss ${t} -i "${item.file}" -vframes 1 -vf "scale=640:360" -q:v 3 "${outJpg}"`, { stdio: 'pipe' });
      } catch (e) {}
    }
  }
}

console.log('Finished scene catalog sampling!');
