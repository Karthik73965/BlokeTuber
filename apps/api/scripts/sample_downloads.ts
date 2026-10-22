import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const repoRoot = path.resolve(__dirname, '../../..');
const dlDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages/downloads');
const outDir = path.resolve(repoRoot, 'uploads/thumbnails/downloads_samples');
fs.mkdirSync(outDir, { recursive: true });

const vids = [
  'pexels_4062026.mp4',
  'pexels_16212509.mp4',
  'la_city_hall_drone_clean.mp4',
  'broll_empty_shelter.mp4',
  'pexels_tents_camp.mp4',
  'pexels_police_siren.mp4',
  'pexels_dorm_cots.mp4',
  'pexels_doorway_sleeping.mp4',
  'pexels_la_skyline.mp4',
  'pexels_street_night.mp4',
  'pexels_courthouse.mp4',
  'broll_shelter_bunk.mp4',
  'california_shelter_cots_hd.mp4'
];

for (const v of vids) {
  const p = path.join(dlDir, v);
  if (fs.existsSync(p)) {
    const outJpg = path.join(outDir, `${path.basename(v, '.mp4')}.jpg`);
    try {
      execSync(`ffmpeg -y -ss 2.0 -i "${p}" -vframes 1 -vf "scale=640:360" -q:v 3 "${outJpg}"`, { stdio: 'pipe' });
    } catch (e) {}
  }
}
console.log('Sampled existing downloads!');
