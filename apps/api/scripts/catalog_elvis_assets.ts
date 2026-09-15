import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\ELVIS\\RAW';
const files = fs.readdirSync(RAW_DIR);

export interface ElvisAsset {
  filename: string;
  type: 'video' | 'image';
  duration: number;
  category: string;
  tags: string[];
  description: string;
}

const assets: ElvisAsset[] = [];

for (const f of files) {
  const full = path.join(RAW_DIR, f);
  const ext = path.extname(f).toLowerCase();
  let duration = 0;
  const isVideo = ['.mp4', '.mov', '.mkv'].includes(ext);

  if (isVideo) {
    try {
      const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${full}"`, {
        encoding: 'utf-8',
      }).trim();
      duration = parseFloat(out) || 0;
    } catch (e) {
      console.warn(`Failed probing ${f}:`, e);
    }
  }

  // Categorize based on content semantics
  let category = 'MISC';
  let tags: string[] = [];
  let description = '';

  const lower = f.toLowerCase();

  if (lower.includes('map') || lower.includes('los angels')) {
    category = 'MAP_GEOGRAPHY';
    tags = ['los angeles', 'map', 'california', 'location', 'aerial', 'geography', 'city'];
    description = 'Map view zooming into Los Angeles / South LA / Skid Row';
  } else if (lower.includes('andy') || lower.includes('bales')) {
    category = 'ANDY_BALES_MISSION';
    tags = ['andy bales', 'union rescue mission', 'skid row', 'mission director', 'interview', 'shelter leader', 'advocate'];
    description = 'Andy Bales, CEO of Union Rescue Mission, speaking and interacting with unhoused residents';
  } else if (lower.includes('police') || lower.includes('cleaning') || (lower.includes('person walkng around houses') && !lower.includes('elvis'))) {
    category = 'CITY_SEIZURE_POLICE';
    tags = ['police', 'lapd', 'bureau of sanitation', 'cleaning', 'seizure', 'confiscation', 'city ordinance', 'enforcement'];
    description = 'City officials, police officers, sanitation workers clearing or inspecting tiny homes and sidewalk';
  } else if (lower.includes('tent') || (lower.includes('inside') && lower.includes('tent'))) {
    category = 'ENCAMPMENT_STREET';
    tags = ['tent', 'sidewalk', 'homelessness', 'unhoused', 'street', 'encampment', 'living rough', 'tarp', 'sleeping'];
    description = 'Tents, tarps, and living conditions on the concrete sidewalk in Los Angeles';
  } else if (lower.includes('old woman') || lower.includes('woman talking') || lower.includes('woman thanking') || lower.includes('happy after seeing') || lower.includes('woman sittin') || lower.includes('woman entering')) {
    category = 'RAVEN_IRENE_SMOKEY';
    tags = ['raven', 'irene', 'smokey', 'elderly woman', 'grandmother', 'unhoused resident', 'emotional', 'gratitude', 'relief', 'moving in'];
    description = 'Elderly unhoused woman (Smokey / Irene "Raven") living on the street, entering tiny home, expressing emotional relief and gratitude';
  } else if (lower.includes('elvis') || lower.includes('tinu hose build') || lower.includes('door of tiny home') || lower.includes('wide lense view of tiny home')) {
    category = 'ELVIS_CONSTRUCTION_BUILD';
    tags = ['elvis summers', 'construction', 'tiny home', 'building', 'wood', 'framing', 'door', 'wheels', 'drill', 'hands-on', 'activist'];
    description = 'Elvis Summers building, framing, wheeling, and showing the insulated wooden tiny house';
  }

  assets.push({
    filename: f,
    type: isVideo ? 'video' : 'image',
    duration: Math.round(duration * 10) / 10,
    category,
    tags,
    description,
  });
}

console.log('═══════════════════════════════════════════════════════════════════');
console.log('📦 ELVIS RAW ASSET CATALOG (27 ASSETS CLASSIFIED)');
console.log('═══════════════════════════════════════════════════════════════════');
for (const a of assets) {
  console.log(`• [${a.category.padEnd(24)}] ${a.filename.padEnd(46)} | ${a.type.toUpperCase().padEnd(5)} | ${a.duration > 0 ? a.duration + 's' : 'STILL'}`);
}

const outPath = path.resolve(__dirname, '../uploads/transcripts/elvis/elvis_asset_catalog.json');
fs.writeFileSync(outPath, JSON.stringify(assets, null, 2), 'utf-8');
console.log(`\n✅ Saved catalog to ${outPath}`);
