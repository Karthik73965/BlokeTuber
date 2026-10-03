import fs from 'fs';
import dotenv from 'dotenv';
import { execSync } from 'child_process';

dotenv.config();

async function getPexelsLA() {
  const pexelsKey = process.env.PEXELS_API_KEY;
  const res = await fetch('https://api.pexels.com/videos/search?query=california+freeway+traffic&per_page=5&orientation=landscape', {
    headers: { Authorization: pexelsKey || '' }
  });
  const data = (await res.json()) as any;
  const v = data.videos[0];
  console.log('Selected Pexels Video:', v.url);
  const file = v.video_files.find((f: any) => f.quality === 'hd' && f.width >= 1280) || v.video_files[0];
  console.log('Download URL:', file.link);

  const target = 'uploads/stock/portable-toilets/stock_ch01_b04_california_highway_traffic.mp4';
  execSync(`curl.exe -L -o "${target}" "${file.link}"`, { stdio: 'inherit' });
  console.log('Downloaded size:', (fs.statSync(target).size / 1024 / 1024).toFixed(1), 'MB');
}

getPexelsLA().catch(console.error);
