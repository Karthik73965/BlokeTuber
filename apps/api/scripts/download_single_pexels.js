const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const pkey = process.env.PEXELS_API_KEY;
const videoId = process.argv[2] || '10555498';
const outName = process.argv[3] || 'ch01_beat05_blankets.mp4';
const outDir = path.resolve('uploads/raw/proj_ambulance/stock');

async function run() {
  const r = await fetch(`https://api.pexels.com/videos/videos/${videoId}`, { headers: { Authorization: pkey } });
  const v = await r.json();
  const f = v.video_files.find(x => x.width === 1920 && x.height === 1080) || v.video_files.find(x => x.quality === 'hd') || v.video_files[0];
  const target = path.join(outDir, outName);
  const snap = target.replace('.mp4', '.jpg');
  console.log(`Downloading ${videoId} to ${target}...`);
  execSync(`ffmpeg -nostdin -y -i "${f.link}" -c copy -movflags +faststart "${target}"`, { stdio: 'pipe' });
  execSync(`ffmpeg -nostdin -y -ss 2 -i "${target}" -vframes 1 -q:v 2 "${snap}"`, { stdio: 'pipe' });
  console.log(`Saved ${outName} and snapshot!`);
}

run().catch(console.error);
