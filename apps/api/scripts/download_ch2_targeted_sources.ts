import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const targetUrls = [
  { url: 'https://www.youtube.com/watch?v=Bqgsd2lw4QE', name: 'suburbs_aerial_broll' },
  { url: 'https://www.youtube.com/watch?v=5pExThaRu04', name: 'siege_of_justiceville_hd' },
  { url: 'https://www.youtube.com/watch?v=ghiSXDH1ngs', name: 'los_angeles_city_hall_hd' },
  { 
    url: 'https://www.youtube.com/watch?v=nd7Uw-rdIvk', 
    name: 'california_shelter_cots_hd',
    extraArgs: '--download-sections "*00:00-08:00"' 
  },
];

const outDir = path.resolve('uploads/raw/proj_dome_villages/downloads');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log('Downloading targeted B-roll sources for Chapter 2 narrative beats...');
  for (const t of targetUrls) {
    const outPath = path.join(outDir, `${t.name}.mp4`);
    if (!fs.existsSync(outPath) || fs.statSync(outPath).size < 100000) {
      console.log(`\n⬇️ Downloading ${t.name} from ${t.url}...`);
      try {
        const extra = t.extraArgs || '';
        execSync(
          `yt-dlp -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best" ${extra} --no-playlist -o "${outPath}" "${t.url}"`,
          { stdio: 'inherit' }
        );
        console.log(`✅ Downloaded ${t.name} (${(fs.statSync(outPath).size / 1024 / 1024).toFixed(1)} MB)`);
      } catch (e: any) {
        console.error(`❌ Failed to download ${t.name}:`, e.message);
      }
    } else {
      console.log(`⏩ ${t.name} already downloaded.`);
    }
  }
}

main().catch(console.error);
