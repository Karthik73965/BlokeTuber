import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const PEXELS_KEY = 'IsEyAaH3KB99divi9zwyCzIfmZLD6DEmexyGV6L8VlaLzrNnZ6atuMEa';
const DOWNLOADS_DIR = path.resolve(__dirname, '../../../uploads/raw/proj_dome_villages/downloads');
fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });

interface SearchTarget {
  name: string;
  query: string;
  filterFn?: (v: any) => boolean;
}

const targets: SearchTarget[] = [
  { name: 'pexels_city_council_hearing', query: 'city council debate hearing meeting' },
  { name: 'pexels_angry_debate', query: 'angry argument debate meeting crowd shouting' },
  { name: 'pexels_construction_crane', query: 'apartment building construction crane scaffolding' },
  { name: 'pexels_winter_shivering_cold', query: 'winter cold shivering man outside snow homeless' },
  { name: 'pexels_ambulance_siren', query: 'ambulance emergency lights siren night' },
  { name: 'pexels_emergency_room_hospital', query: 'hospital emergency room doctor patient bed' },
  { name: 'pexels_cemetery_headstones', query: 'cemetery gravestones headstones cemetery sunset' },
  { name: 'pexels_veteran_sleeping', query: 'elderly man sleeping peaceful bedroom' },
  { name: 'pexels_locked_door_key', query: 'key turning in door lock deadbolt' },
  { name: 'pexels_morning_sunrise_city', query: 'morning sunrise city skyline dawn golden hour' },
  { name: 'pexels_suburban_property_values', query: 'suburban neighborhood houses street drone' },
  { name: 'pexels_drugs_substance_abuse', query: 'pills bottle medicine drug addiction dark' },
  { name: 'pexels_permanent_apartments', query: 'modern apartment building exterior residential architecture' },
  { name: 'pexels_healthcare_doctor', query: 'doctor examining patient stethoscope medical clinic' },
  { name: 'pexels_working_class_wages', query: 'construction worker hands working hard labor' },
  { name: 'pexels_police_lights_night', query: 'police car flashing lights night street emergency' },
  { name: 'pexels_door_locking_interior', query: 'locking door bolt secure inside' },
  { name: 'pexels_neighborhood_community', query: 'neighbors talking friendly community outside' },
  { name: 'pexels_sidewalk_pedestrians_walk', query: 'city sidewalk pedestrians walking street low angle' }
];

async function searchAndDownload(target: SearchTarget) {
  const outPath = path.join(DOWNLOADS_DIR, `${target.name}.mp4`);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 500000) {
    console.log(`⏩ ${target.name} already exists (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(1)} MB).`);
    return;
  }

  console.log(`🔍 Searching Pexels for "${target.query}" (${target.name})...`);
  try {
    const url = `https://api.pexels.com/videos/search?query=${encodeURIComponent(target.query)}&per_page=10&orientation=landscape`;
    const res = await fetch(url, {
      headers: { Authorization: PEXELS_KEY }
    });

    if (!res.ok) {
      console.error(`❌ HTTP ${res.status} from Pexels for "${target.query}"`);
      return;
    }

    const data = await res.json() as any;
    if (!data.videos || data.videos.length === 0) {
      console.log(`⚠️ No videos found for "${target.query}"`);
      return;
    }

    // Pick best video
    let selectedVideo = data.videos[0];
    if (target.filterFn) {
      selectedVideo = data.videos.find(target.filterFn) || data.videos[0];
    }

    // Pick best 1080p video file
    // prefer 1920x1080 or 1280x720, or highest <= 3840
    const files = selectedVideo.video_files || [];
    let bestFile = files.find((f: any) => f.width === 1920 && f.height === 1080)
      || files.find((f: any) => f.width === 2560 && f.height === 1440)
      || files.find((f: any) => f.width === 3840 && f.height === 2160)
      || files.find((f: any) => f.quality === 'hd')
      || files[0];

    if (!bestFile || !bestFile.link) {
      console.error(`❌ No valid video file link for ${target.name}`);
      return;
    }

    console.log(`⬇️ Downloading ${target.name} (${bestFile.width}x${bestFile.height}, ${selectedVideo.duration}s)...`);
    const fileRes = await fetch(bestFile.link);
    if (!fileRes.ok) {
      console.error(`❌ Failed to fetch video stream: ${fileRes.status}`);
      return;
    }

    const arrayBuffer = await fileRes.arrayBuffer();
    fs.writeFileSync(outPath, Buffer.from(arrayBuffer));
    console.log(`✅ Saved ${target.name} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(1)} MB)`);
  } catch (err: any) {
    console.error(`❌ Error downloading ${target.name}:`, err.message);
  }
}

async function main() {
  console.log('🚀 Downloading curated Pexels 1080p B-roll assets...');
  for (const t of targets) {
    await searchAndDownload(t);
  }
  console.log('🎉 Finished downloading Pexels assets!');
}

main().catch(console.error);
