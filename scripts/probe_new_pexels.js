const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = 'uploads/raw/proj_dome_villages/downloads';
const newFiles = [
  'pexels_geodesic_dome.mp4',
  'pexels_planetarium_dome.mp4',
  'pexels_sphere_geometry.mp4',
  'pexels_oil_refinery_arco.mp4',
  'pexels_architect_measuring.mp4',
  'pexels_rain_drums_roof.mp4',
  'pexels_vintage_radio_listening.mp4',
  'pexels_night_walk_cold_rain.mp4',
  'pexels_communal_kitchen_cooking.mp4',
  'pexels_dominoes_table_game.mp4',
  'pexels_morning_coffee_pour.mp4',
  'pexels_sweeping_path.mp4',
  'pexels_reading_book_afternoon.mp4',
  'pexels_circle_meeting_discussion.mp4',
  'pexels_mailbox_letters_address.mp4',
  'pexels_peaceful_sleep_bed.mp4',
  'pexels_job_interview_handshake.mp4',
  'pexels_phone_call_family.mp4',
  'pexels_family_hopeful_future.mp4',
  'pexels_sunset_city_lot.mp4'
];

for (const fn of newFiles) {
  const fp = path.join(dir, fn);
  try {
    const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of json "${fp}"`, { encoding: 'utf-8' });
    const s = JSON.parse(probe).streams[0];
    console.log(fn.padEnd(38), s.width + 'x' + s.height, parseFloat(s.duration).toFixed(1) + 's');
  } catch(e) {
    console.log('Error', fn, e.message);
  }
}
