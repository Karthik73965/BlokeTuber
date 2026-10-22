const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve('uploads/raw/proj_dome_villages/probe_frames/pexels_check');
fs.mkdirSync(outDir, { recursive: true });

const downloadsDir = path.resolve('uploads/raw/proj_dome_villages/downloads');
const filesToCheck = [
  'pexels_architect_blueprint.mp4',
  'pexels_tools_wrench_screwdriver.mp4',
  'pexels_construction_crane.mp4',
  'pexels_empty_vacant_urban_lot.mp4',
  'pexels_rent_cash_money.mp4',
  'pexels_calendar_pages_time.mp4',
  'pexels_door_locking_interior.mp4',
  'pexels_locked_door_key.mp4',
  'pexels_healthcare_doctor.mp4',
  'pexels_community_meeting_rules.mp4',
  'pexels_drugs_substance_abuse.mp4',
  'pexels_morning_sunrise_city.mp4',
  'pexels_chopping_wood_gardening.mp4',
  'pexels_neighborhood_community.mp4',
  'pexels_happy_resident_porch.mp4',
  'pexels_volunteers_working_hands.mp4',
  'pexels_apartment_keys_door.mp4',
  'pexels_chainlink_fence_lock.mp4',
  'pexels_veteran_sleeping.mp4',
  'pexels_tiny_house_village.mp4'
];

for (const fn of filesToCheck) {
  const fp = path.join(downloadsDir, fn);
  if (!fs.existsSync(fp)) {
    console.log('Not found:', fn);
    continue;
  }
  const out = path.join(outDir, fn.replace('.mp4', '.jpg'));
  try {
    execSync(`ffmpeg -y -ss 2.0 -i "${fp}" -vframes 1 -q:v 3 "${out}"`, { stdio: 'ignore' });
    const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of json "${fp}"`, { encoding: 'utf-8' });
    const s = JSON.parse(probe).streams[0];
    console.log(fn.padEnd(38), s.width + 'x' + s.height, parseFloat(s.duration).toFixed(1) + 's');
  } catch(e) {
    console.log('Error probing', fn, e.message);
  }
}
