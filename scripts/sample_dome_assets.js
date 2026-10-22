const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve('uploads/raw/proj_dome_villages/probe_frames');
fs.mkdirSync(outDir, { recursive: true });

function sampleVideo(videoPath, prefix, intervalSec, maxSec) {
  if (!fs.existsSync(videoPath)) {
    console.log(`File not found: ${videoPath}`);
    return;
  }
  console.log(`Sampling ${path.basename(videoPath)}...`);
  for (let t = 5; t < maxSec; t += intervalSec) {
    const out = path.join(outDir, `${prefix}_${String(Math.floor(t)).padStart(4, '0')}s.jpg`);
    try {
      execSync(`ffmpeg -y -ss ${t} -i "${videoPath}" -vframes 1 -q:v 3 "${out}"`, { stdio: 'ignore' });
    } catch (e) {}
  }
}

// 1. What It's Actually Like Living Inside the $2,000 Dome
sampleVideo('uploads/raw/proj_dome_villages/What It’s Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4', 'living_dome', 30, 1300);

// 2. intershelter_dome_home_presentation
sampleVideo('uploads/raw/proj_dome_villages/downloads/intershelter_dome_home_presentation.mp4', 'inter_pres', 10, 215);

// 3. The Shelter - Honolulu HI Dome Project
sampleVideo('uploads/raw/proj_dome_villages/The Shelter - Honolulu HI Dome Project_RANEduRN9Ew.mp4', 'hono_dome', 15, 310);

// 4. ted_hayes_civil_rights_hd
sampleVideo('uploads/raw/proj_dome_villages/downloads/ted_hayes_civil_rights_hd.mp4', 'ted_civil', 15, 220);

// 5. skid_row_la_state_of_emergency
sampleVideo('uploads/raw/proj_dome_villages/downloads/skid_row_la_state_of_emergency.mp4', 'skid_row', 20, 400);

console.log('Sampling completed. Files in probe_frames:', fs.readdirSync(outDir).length);
