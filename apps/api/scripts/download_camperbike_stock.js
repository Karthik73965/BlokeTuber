const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PEXELS_KEY = process.env.PEXELS_API_KEY;
const OUT_DIR = path.resolve('uploads/raw/proj_camperbike/stock');
fs.mkdirSync(OUT_DIR, { recursive: true });

const queries = [
  { name: 'stock_frost_morning.mp4', q: 'frost grass winter morning' },
  { name: 'stock_bridge_overpass.mp4', q: 'highway overpass concrete bridge' },
  { name: 'stock_cyclist_pedaling.mp4', q: 'bicycle cycling morning street road' },
  { name: 'stock_warm_sleep.mp4', q: 'sleeping peacefully morning bed cozy' },
  { name: 'stock_dollar_cash.mp4', q: 'counting dollar bills money cash' },
  { name: 'stock_hardware_lumber.mp4', q: 'hardware store lumber wood planks' },
  { name: 'stock_stone_arch.mp4', q: 'stone arch bridge architecture' },
  { name: 'stock_eggshell_curve.mp4', q: 'eggshell macro curve physics' },
  { name: 'stock_engineer_drafting.mp4', q: 'engineer blueprint technical drawing desk' },
  { name: 'stock_airplane_boeing.mp4', q: 'airplane hangar engineering jet' },
  { name: 'stock_desert_festival.mp4', q: 'desert festival burning man dust' },
  { name: 'stock_barrel_bolt_lock.mp4', q: 'door lock bolt latch metal' },
  { name: 'stock_deep_sleep_dream.mp4', q: 'sleeping deeply peaceful night rest' },
  { name: 'stock_bike_wheel_roll.mp4', q: 'bicycle wheel rolling road pavement' },
  { name: 'stock_courthouse_gavel.mp4', q: 'courtroom gavel justice courthouse' },
  { name: 'stock_street_sweeper.mp4', q: 'street sweeper city cleanup morning' },
  { name: 'stock_stove_cooking.mp4', q: 'camping stove frying eggs breakfast pan' },
  { name: 'stock_morning_coffee.mp4', q: 'steaming hot coffee cup morning' },
  { name: 'stock_homeless_encampment.mp4', q: 'tents homeless winter street urban' },
  { name: 'stock_dog_companion.mp4', q: 'dog sitting with owner street sidewalk' },
  { name: 'stock_couple_comfort.mp4', q: 'couple holding hands winter cold comfort' },
  { name: 'stock_utility_knife_cut.mp4', q: 'utility knife box cutter cutting plastic' },
  { name: 'stock_fire_flame_stove.mp4', q: 'gas flame burner blue flame danger' },
  { name: 'stock_window_condensation.mp4', q: 'condensation water drops window glass cold' },
  { name: 'stock_freezing_rain.mp4', q: 'freezing rain cold winter puddle street' },
  { name: 'stock_sunrise_highway.mp4', q: 'sunrise highway road empty dawn' },
  { name: 'stock_nyc_steam_vent.mp4', q: 'new york city steam manhole street winter' }
];

async function fetchStock() {
  console.log(`Starting Pexels stock curation for ${queries.length} queries...`);

  for (const item of queries) {
    const dest = path.join(OUT_DIR, item.name);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 500000) {
      console.log(`✓ Exists: ${item.name}`);
      continue;
    }

    try {
      console.log(`Searching Pexels for "${item.q}"...`);
      const resp = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(item.q)}&per_page=5&orientation=landscape`, {
        headers: { Authorization: PEXELS_KEY }
      });
      const data = await resp.json();
      if (!data.videos || data.videos.length === 0) {
        console.log(`  No results for "${item.q}"`);
        continue;
      }

      // Pick best HD file (prefer 1920x1080)
      let selectedFile = null;
      for (const v of data.videos) {
        const hd = v.video_files.find(f => f.width === 1920 && f.height === 1080);
        const anyHd = v.video_files.find(f => f.quality === 'hd' && f.width >= 1280);
        if (hd) {
          selectedFile = hd;
          break;
        } else if (anyHd && !selectedFile) {
          selectedFile = anyHd;
        }
      }
      if (!selectedFile && data.videos[0].video_files.length > 0) {
        selectedFile = data.videos[0].video_files[0];
      }

      if (selectedFile) {
        console.log(`  Downloading ${item.name} (${selectedFile.width}x${selectedFile.height})...`);
        execSync(`ffmpeg -nostdin -y -i "${selectedFile.link}" -c copy -movflags +faststart "${dest}"`, { stdio: 'pipe' });
        const snap = dest.replace('.mp4', '.jpg');
        try {
          execSync(`ffmpeg -nostdin -y -ss 1 -i "${dest}" -vframes 1 -q:v 2 "${snap}"`, { stdio: 'pipe' });
        } catch {}
        console.log(`  ✓ Saved ${item.name} (${(fs.statSync(dest).size / 1024 / 1024).toFixed(1)} MB)`);
      }
    } catch (e) {
      console.log(`  Error on ${item.name}: ${e.message}`);
    }
  }

  console.log('Stock download complete!');
}

fetchStock().catch(console.error);
