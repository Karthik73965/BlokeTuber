import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const PEXELS_KEY = process.env.PEXELS_API_KEY;
const PIXABAY_KEY = process.env.PIXABAY_API_KEY;
const OUT_DIR = path.resolve(__dirname, '../../../uploads/raw/proj_ambulance/stock');
fs.mkdirSync(OUT_DIR, { recursive: true });

async function searchAndDownloadPexels(query: string, targetName: string): Promise<string | null> {
  const targetPath = path.join(OUT_DIR, targetName);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 100000) {
    console.log(`⏩ [Pexels] ${targetName} already exists — Skipping`);
    return targetPath;
  }
  if (!PEXELS_KEY) return null;

  try {
    const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=10&orientation=landscape`, {
      headers: { Authorization: PEXELS_KEY },
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return null;
    const data = await res.json() as any;
    const video = data.videos?.[0];
    if (!video) return null;

    const file = video.video_files?.find((f: any) => f.width === 1920 && f.height === 1080)
      || video.video_files?.find((f: any) => f.quality === 'hd')
      || video.video_files?.[0];

    if (!file?.link) return null;

    console.log(`⬇️ [Pexels] Downloading "${query}" -> ${targetName}`);
    const tempPath = targetPath + '.tmp.mp4';
    execSync(`ffmpeg -nostdin -y -i "${file.link}" -c copy -movflags +faststart "${tempPath}"`, { stdio: 'pipe' });
    if (fs.existsSync(tempPath) && fs.statSync(tempPath).size > 100000) {
      fs.renameSync(tempPath, targetPath);
      console.log(`✅ [Pexels] Saved ${targetName} (${(fs.statSync(targetPath).size / (1024*1024)).toFixed(1)} MB)`);
      return targetPath;
    }
  } catch (err: any) {
    console.error(`⚠️ [Pexels] Error for ${query}:`, err.message);
  }
  return null;
}

async function searchAndDownloadPixabay(query: string, targetName: string): Promise<string | null> {
  const targetPath = path.join(OUT_DIR, targetName);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 100000) {
    console.log(`⏩ [Pixabay] ${targetName} already exists — Skipping`);
    return targetPath;
  }
  if (!PIXABAY_KEY) return null;

  try {
    const res = await fetch(`https://pixabay.com/api/videos/?key=${PIXABAY_KEY}&q=${encodeURIComponent(query)}&per_page=10&safesearch=true`, {
      signal: AbortSignal.timeout(10000)
    });
    if (!res.ok) return null;
    const data = await res.json() as any;
    const hit = data.hits?.[0];
    if (!hit) return null;

    const streamUrl = hit.videos?.large?.url || hit.videos?.medium?.url || hit.videos?.small?.url;
    if (!streamUrl) return null;

    console.log(`⬇️ [Pixabay] Downloading "${query}" -> ${targetName}`);
    const tempPath = targetPath + '.tmp.mp4';
    execSync(`ffmpeg -nostdin -y -i "${streamUrl}" -c copy -movflags +faststart "${tempPath}"`, { stdio: 'pipe' });
    if (fs.existsSync(tempPath) && fs.statSync(tempPath).size > 100000) {
      fs.renameSync(tempPath, targetPath);
      console.log(`✅ [Pixabay] Saved ${targetName} (${(fs.statSync(targetPath).size / (1024*1024)).toFixed(1)} MB)`);
      return targetPath;
    }
  } catch (err: any) {
    console.error(`⚠️ [Pixabay] Error for ${query}:`, err.message);
  }
  return null;
}

async function run() {
  console.log('🎬 Fetching authentic, high-res stock for Chapter 1 beats...');
  
  // Beat 0: 19 degrees winter dawn in gravel lot / cold church
  await searchAndDownloadPexels('winter frost church dawn', 'ch01_beat00_winter_dawn.mp4')
    || await searchAndDownloadPixabay('winter morning frost', 'ch01_beat00_winter_dawn.mp4');

  // Beat 1: Ice on windshield
  await searchAndDownloadPexels('frost car windshield ice', 'ch01_beat01_ice_windshield.mp4')
    || await searchAndDownloadPixabay('ice on car windshield', 'ch01_beat01_ice_windshield.mp4');

  // Beat 5: Sleeping comfortably under blankets
  await searchAndDownloadPexels('sleeping bed blankets warm', 'ch01_beat05_sleeping_warm.mp4')
    || await searchAndDownloadPixabay('person sleeping warm bed', 'ch01_beat05_sleeping_warm.mp4');

  // Beat 6: Cold winter snow outside window
  await searchAndDownloadPexels('winter snow blowing trees cold', 'ch01_beat06_winter_outside.mp4')
    || await searchAndDownloadPixabay('snow storm winter cold', 'ch01_beat06_winter_outside.mp4');

  // Beat 9: Typing on laptop browsing surplus website
  await searchAndDownloadPexels('person typing laptop website online', 'ch01_beat09_laptop_auction.mp4')
    || await searchAndDownloadPixabay('typing laptop desk', 'ch01_beat09_laptop_auction.mp4');

  // Beat 10: Buying place to sleep / holding keys / new start
  await searchAndDownloadPexels('holding car keys vehicle', 'ch01_beat10_holding_keys.mp4')
    || await searchAndDownloadPixabay('car keys hand', 'ch01_beat10_holding_keys.mp4');

  // Beat 11: Driving down highway in morning mist
  await searchAndDownloadPexels('highway morning road driving asphalt', 'ch01_beat11_highway_drive.mp4')
    || await searchAndDownloadPixabay('road driving highway morning', 'ch01_beat11_highway_drive.mp4');

  // Beat 12: Emergency vehicle headlights night road dramatic
  await searchAndDownloadPexels('emergency lights night street dark', 'ch01_beat12_emergency_night.mp4')
    || await searchAndDownloadPixabay('headlights dark night road', 'ch01_beat12_emergency_night.mp4');

  console.log('🎉 Stock download process complete!');
}

run();
