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

const SOURCES = [
  {
    file: 'suburbs_aerial_broll.mp4',
    prefix: 'suburbs_broll',
    tags: ['suburbs', 'comfortable_house', 'suburban_neighborhood', 'california_homes'],
    maxClips: 8,
    scale: true,
  },
  {
    file: 'siege_of_justiceville_hd.mp4',
    prefix: 'justiceville_siege',
    tags: ['justiceville', 'self_sustaining_camp', 'empty_lot', 'police_arrest', 'protest', 'civil_disobedience'],
    maxClips: 15,
    scale: true,
  },
  {
    file: 'la_city_hall_1080p.mp4',
    prefix: 'la_city_hall',
    tags: ['los_angeles_city_hall', 'mayor_campaign', 'government', 'city_hall_downtown'],
    maxClips: 10,
    scale: false,
  },
  {
    file: 'california_shelter_cots_hd.mp4',
    prefix: 'shelter_cots',
    tags: ['shelter_failure', 'rows_of_cots', 'mass_shelter', 'no_privacy', 'gymnasium_beds', 'shelter_door'],
    maxClips: 20,
    scale: false,
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

export function sliceCh2Sources() {
  console.log('✂️  SLICING TARGETED CHAPTER 2 B-ROLL SOURCES...');

  let manifest: { clips: any[] } = { clips: [] };
  if (fs.existsSync(MANIFEST_PATH)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
  }

  const existingIds = new Set(manifest.clips.map((c) => c.id));
  const newClips: any[] = [];

  for (const src of SOURCES) {
    const srcPath = path.join(DOWNLOADS_DIR, src.file);
    if (!fs.existsSync(srcPath)) {
      console.warn(`Source missing: ${src.file}. Skipping.`);
      continue;
    }

    const totalDur = getVideoDuration(srcPath);
    console.log(`Processing ${src.file} (${totalDur.toFixed(1)}s)...`);

    const sliceDur = 5.5;
    let clipIndex = 1;

    for (let start = 5; start < totalDur - 5 && clipIndex <= src.maxClips; start += sliceDur + 0.8) {
      const clipId = `proj_dome_${src.prefix}_${String(clipIndex).padStart(3, '0')}`;
      const clipFilename = `${src.prefix}_clip_${String(clipIndex).padStart(3, '0')}.mp4`;
      const clipOutPath = path.join(RAW_DIR, clipFilename);

      const p1Path = path.join(SCREENSHOTS_DIR, `${src.prefix}_clip_${String(clipIndex).padStart(3, '0')}_p1.jpg`);
      const p2Path = path.join(SCREENSHOTS_DIR, `${src.prefix}_clip_${String(clipIndex).padStart(3, '0')}_p2.jpg`);

      const vfScale = src.scale ? '-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2"' : '';

      if (!fs.existsSync(clipOutPath) || fs.statSync(clipOutPath).size < 10000) {
        try {
          execSync(
            `ffmpeg -y -ss ${start.toFixed(2)} -i "${srcPath}" -t ${sliceDur} ${vfScale} -c:v libx264 -preset fast -crf 20 -c:a aac -b:a 128k -movflags +faststart "${clipOutPath}"`,
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
        newClips.push({
          id: clipId,
          filename: clipFilename,
          fullPath: clipOutPath,
          duration: sliceDur,
          sourceUrl: 'https://youtube.com',
          screenshots: [p1Path, p2Path],
          status: 'pending',
          tags: [...src.tags],
          screeningStatus: 'approved',
        });
        existingIds.add(clipId);
      }

      clipIndex++;
    }
    console.log(`Generated ${clipIndex - 1} clips from ${src.file}`);
  }

  manifest.clips = [...manifest.clips, ...newClips];
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`Added ${newClips.length} new clips to manifest.json`);
}

if (require.main === module) {
  sliceCh2Sources();
}
