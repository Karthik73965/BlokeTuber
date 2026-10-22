const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve('.');
const rawDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages');
const dlDir = path.resolve(rawDir, 'downloads');

const sources = [
  // Ch3
  'pexels_geodesic_dome.mp4',
  'pexels_architect_blueprint.mp4',
  'The Shelter - Honolulu HI Dome Project_RANEduRN9Ew.mp4',
  'What It’s Actually Like Living Inside the $2,000 D_G2MAIJzAUhE.mp4',
  'pexels_volunteers_working_hands.mp4',
  'pexels_tools_wrench_screwdriver.mp4',
  'pexels_construction_crane.mp4',
  'pexels_sphere_geometry.mp4',
  'pexels_architect_measuring.mp4',
  'pexels_planetarium_dome.mp4',
  'ted_hayes_civil_rights_hd.mp4',
  'pexels_oil_refinery_arco.mp4',
  'pexels_empty_vacant_urban_lot.mp4',
  'skid_row_la_state_of_emergency.mp4',
  // Ch4
  'pexels_rain_drums_roof.mp4',
  'pexels_vintage_radio_listening.mp4',
  'pexels_night_walk_cold_rain.mp4',
  'pexels_communal_kitchen_cooking.mp4',
  'pexels_neighborhood_community.mp4',
  'pexels_doorway_sleeping.mp4',
  'pexels_community_meeting_rules.mp4',
  'california_shelter_cots_hd.mp4',
  'pexels_drugs_substance_abuse.mp4',
  'broll_empty_shelter.mp4',
  'pexels_happy_resident_porch.mp4',
  'pexels_chainlink_fence_lock.mp4',
  'pexels_morning_sunrise_city.mp4',
  'pexels_morning_coffee_pour.mp4',
  'pexels_sweeping_path.mp4',
  'pexels_reading_book_afternoon.mp4',
  'pexels_dominoes_table_game.mp4',
  'pexels_circle_meeting_discussion.mp4',
  // Ch5
  'pexels_family_hopeful_future.mp4',
  'pexels_sleeping_outside_sidewalk.mp4',
  'pexels_locked_door_key.mp4',
  'pexels_peaceful_sleep_bed.mp4',
  'pexels_job_interview_handshake.mp4',
  'pexels_sunset_city_lot.mp4'
];

let allOk = true;
for (const s of sources) {
  const pRaw = path.join(rawDir, s);
  const pDl = path.join(dlDir, s);
  if (fs.existsSync(pRaw)) {
    console.log(`[RAW] ${s}`);
  } else if (fs.existsSync(pDl)) {
    console.log(`[DL]  ${s}`);
  } else {
    console.error(`[MISSING] ${s}`);
    allOk = false;
  }
}

if (allOk) {
  console.log('\n ALL 38 SOURCE FILES VERIFIED AND PRESENT!');
} else {
  console.error('\n Some source files are missing!');
}
