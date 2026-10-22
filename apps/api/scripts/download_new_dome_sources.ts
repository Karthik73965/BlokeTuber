import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const targetUrls = [
  { url: 'https://www.youtube.com/watch?v=I2yAcmFfo_Q', name: 'skid_row_cnn_dawn_to_dusk' },
  { url: 'https://www.youtube.com/watch?v=zVJjFiYP2mU', name: 'intershelter_dome_home_presentation' },
  { url: 'https://www.youtube.com/watch?v=0LNaJrrziE0', name: 'intershelter_dome_natural_disaster' },
  { url: 'https://www.youtube.com/watch?v=diVxt2HOEKg', name: 'skid_row_la_state_of_emergency' },
  { url: 'https://www.youtube.com/watch?v=9y8tlmrpHR0', name: 'ted_hayes_civil_rights_hd' },
  { url: 'https://www.youtube.com/watch?v=P2wmJGH0GKs', name: 'portland_tiny_home_pods_hd' },
  { url: 'https://www.youtube.com/watch?v=Goxb1opuUIo', name: 'portland_shelter_camp_hd' },
  { url: 'https://www.youtube.com/watch?v=o0qFdD3QW3Q', name: 'portland_safe_rest_village_hd' },
  { url: 'https://www.youtube.com/watch?v=PgDiS7Q-FUw', name: 'tiny_shelter_home_msnbc_hd' },
  { url: 'https://www.youtube.com/watch?v=DWExpwehPFQ', name: 'grand_ronde_tiny_village_hd' },
];

const outDir = path.resolve('uploads/raw/proj_dome_villages/downloads');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  console.log('Downloading new targeted sources...');
  for (const t of targetUrls) {
    const outPath = path.join(outDir, `${t.name}.mp4`);
    if (!fs.existsSync(outPath) || fs.statSync(outPath).size < 1000000) {
      console.log(`\n⬇️ Downloading ${t.name} from ${t.url}...`);
      try {
        execSync(
          `yt-dlp -f "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best" --no-playlist -o "${outPath}" "${t.url}"`,
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
