import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const DOWNLOADS_DIR = path.resolve(REPO_ROOT, 'uploads/raw/proj_dome_villages/downloads');
const RAW_DIR = path.resolve(REPO_ROOT, 'uploads/raw/proj_dome_villages');
const SCREENSHOTS_DIR = path.resolve(RAW_DIR, 'screenshots');
const MANIFEST_PATH = path.resolve(RAW_DIR, 'manifest.json');

fs.mkdirSync(RAW_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

interface ManifestClip {
  id: string;
  filename: string;
  fullPath: string;
  duration: number;
  sourceUrl: string;
  screenshots: string[];
  status: string;
  tags: string[];
  screeningStatus: 'approved' | 'rejected';
  rejectionReason?: string;
}

const SOURCES_CONFIG = [
  {
    file: 'skid_row_cnn_dawn_to_dusk.mp4',
    prefix: 'skid_row_cnn',
    sourceUrl: 'https://www.youtube.com/watch?v=I2yAcmFfo_Q',
    tags: ['skid_row_morning', 'cardboard_tarp_rain', 'sidewalk_tents', 'los_angeles_dawn', 'street_homelessness'],
  },
  {
    file: 'intershelter_dome_home_presentation.mp4',
    prefix: 'intershelter_pres',
    sourceUrl: 'https://www.youtube.com/watch?v=zVJjFiYP2mU',
    tags: ['white_fiberglass_dome', 'dome_interior_bed', 'dome_shelter_door_lock', 'curved_walls', 'dome_igloo'],
  },
  {
    file: 'skid_row_la_state_of_emergency.mp4',
    prefix: 'skid_row_emergency',
    sourceUrl: 'https://www.youtube.com/watch?v=diVxt2HOEKg',
    tags: ['skid_row_morning', 'sidewalk_living', 'los_angeles_streets', 'tents_cardboard'],
  },
  {
    file: 'ted_hayes_civil_rights_hd.mp4',
    prefix: 'ted_hayes_hd',
    sourceUrl: 'https://www.youtube.com/watch?v=9y8tlmrpHR0',
    tags: ['ted_hayes', 'justiceville', 'dome_village_la', 'housing_activist', 'founder_ted_hayes'],
  },
  {
    file: 'portland_shelter_camp_hd.mp4',
    prefix: 'portland_camp_hd',
    sourceUrl: 'https://www.youtube.com/watch?v=Goxb1opuUIo',
    tags: ['dignity_village', 'portland_oregon', 'self_governed', 'grassroots_housing', 'tiny_homes_community'],
  },
  {
    file: 'portland_tiny_home_pods_hd.mp4',
    prefix: 'portland_pods_hd',
    sourceUrl: 'https://www.youtube.com/watch?v=P2wmJGH0GKs',
    tags: ['tiny_homes_rvs', 'shelter_pods', 'portland_oregon', 'dignity_village', 'pallet_shelter'],
  },
  {
    file: 'tiny_shelter_home_msnbc_hd.mp4',
    prefix: 'tiny_shelter_msnbc_hd',
    sourceUrl: 'https://www.youtube.com/watch?v=PgDiS7Q-FUw',
    tags: ['tiny_homes_rvs', 'interior_tiny_shelter', 'living_space', 'rapid_housing', 'shelter_reality', 'curved_walls'],
  },
];

function getVideoDuration(filePath: string): number {
  try {
    const out = execSync(
      `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`,
      { stdio: 'pipe' }
    ).toString().trim();
    return parseFloat(out) || 0;
  } catch {
    return 0;
  }
}

export function sliceNewSources() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('✂️  SLICING NEW DOME & SKID ROW SOURCES INTO B-ROLL CLIPS');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  let manifest: { clips: ManifestClip[] } = { clips: [] };
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  }

  const existingIds = new Set(manifest.clips.map((c) => c.id));
  const newClips: ManifestClip[] = [];

  for (const src of SOURCES_CONFIG) {
    const srcPath = path.join(DOWNLOADS_DIR, src.file);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source not downloaded yet: ${src.file}. Skipping.`);
      continue;
    }

    const totalDur = getVideoDuration(srcPath);
    if (totalDur <= 5) {
      console.warn(`Source ${src.file} duration is too short (${totalDur}s). Skipping.`);
      continue;
    }

    console.log(`\nProcessing ${src.file} (Total: ${totalDur.toFixed(1)}s)...`);

    // Slicing into 5.5s clips
    const sliceDur = 5.5;
    const maxClips = 50; // Grab up to 50 clips per source
    let clipIndex = 1;

    for (let start = 10; start < totalDur - 10 && clipIndex <= maxClips; start += sliceDur + 1.0) {
      const clipId = `proj_dome_${src.prefix}_${String(clipIndex).padStart(3, '0')}`;
      const clipFilename = `${src.prefix}_clip_${String(clipIndex).padStart(3, '0')}.mp4`;
      const clipOutPath = path.join(RAW_DIR, clipFilename);

      const p1Path = path.join(SCREENSHOTS_DIR, `${src.prefix}_clip_${String(clipIndex).padStart(3, '0')}_p1.jpg`);
      const p2Path = path.join(SCREENSHOTS_DIR, `${src.prefix}_clip_${String(clipIndex).padStart(3, '0')}_p2.jpg`);

      if (!fs.existsSync(clipOutPath) || fs.statSync(clipOutPath).size < 10000) {
        try {
          execSync(
            `ffmpeg -y -ss ${start.toFixed(2)} -i "${srcPath}" -t ${sliceDur} -c:v libx264 -preset fast -crf 20 -c:a aac -b:a 128k -movflags +faststart "${clipOutPath}"`,
            { stdio: 'pipe' }
          );
        } catch (e: any) {
          console.error(`Error slicing clip ${clipFilename}:`, e.message);
          continue;
        }
      }

      // Screenshots
      if (!fs.existsSync(p1Path)) {
        try {
          execSync(`ffmpeg -y -ss 1.0 -i "${clipOutPath}" -vframes 1 "${p1Path}"`, { stdio: 'pipe' });
        } catch {}
      }
      if (!fs.existsSync(p2Path)) {
        try {
          execSync(`ffmpeg -y -ss 3.5 -i "${clipOutPath}" -vframes 1 "${p2Path}"`, { stdio: 'pipe' });
        } catch {}
      }

      if (!existingIds.has(clipId)) {
        const manifestEntry: ManifestClip = {
          id: clipId,
          filename: clipFilename,
          fullPath: clipOutPath,
          duration: sliceDur,
          sourceUrl: src.sourceUrl,
          screenshots: [p1Path, p2Path],
          status: 'pending',
          tags: [...src.tags],
          screeningStatus: 'approved',
        };
        newClips.push(manifestEntry);
        existingIds.add(clipId);
      }

      clipIndex++;
    }

    console.log(`Generated ${clipIndex - 1} clips from ${src.file}`);
  }

  manifest.clips = [...manifest.clips, ...newClips];
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`\n🎉 Slicing complete! Added ${newClips.length} new approved clips to manifest.json.`);
  console.log(`Total active clips in manifest: ${manifest.clips.length}`);
}

if (require.main === module) {
  sliceNewSources();
}
