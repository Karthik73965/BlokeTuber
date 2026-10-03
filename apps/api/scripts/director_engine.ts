import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import dotenv from 'dotenv';
import type { Timeline, TimelineClip, SceneLayoutType, CalloutOverlay, SceneLayoutData, TransitionType } from '@repo/shared';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

export const PROJECT_ID = 'proj_1790101325660';
export const REPO_ROOT = path.resolve(__dirname, '../../..');
export const TRANSCRIPTS_DIR = path.resolve(REPO_ROOT, 'uploads/transcripts/portable-toilets');
export const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/portable-toilets');
export const STOCK_DIR = path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets');
export const RAW_DIR = path.resolve(REPO_ROOT, `uploads/raw/${PROJECT_ID}`);
export const REGISTRY_PATH = path.resolve(REPO_ROOT, `uploads/registry/${PROJECT_ID}_media_registry.json`);

fs.mkdirSync(TIMELINES_DIR, { recursive: true });
fs.mkdirSync(STOCK_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });

export const SFX_DIR = path.resolve(REPO_ROOT, 'packages/remotion-video/public/sfx');
export const SFX = {
  whoosh_cinematic: path.join(SFX_DIR, 'whoosh_cinematic.mp3').replace(/\\/g, '/'),
  whoosh_air: path.join(SFX_DIR, 'whoosh_air.mp3').replace(/\\/g, '/'),
  subtle_hit: path.join(SFX_DIR, 'subtle_hit.mp3').replace(/\\/g, '/'),
  paper_slide: path.join(SFX_DIR, 'paper_slide.mp3').replace(/\\/g, '/'),
};

export const BANNED_PREFIXES = [
  'he_made_a_tiny_home_out_of_por',
  'porta_potty_house_world_s_smal',
  'man_wants_to_convert_port_a_po',
  'how_a_bathroom_on_wheels_is_ch',
  'pot_growing_fire_sun_valley_ra',
];

// Global registry of locked assets (reads from saved timeline files as ground truth)
export function getLockedAssets(excludeChapters: number[] = []): Set<string> {
  const locked = new Set<string>();

  if (fs.existsSync(TIMELINES_DIR)) {
    const files = fs.readdirSync(TIMELINES_DIR).filter((f) => f.endsWith('.json'));
    for (const file of files) {
      const match = file.match(/chapter_(\d+)\.json/);
      if (match) {
        const chNum = parseInt(match[1]!, 10);
        if (excludeChapters.includes(chNum)) continue;
      }
      try {
        const tl: Timeline = JSON.parse(fs.readFileSync(path.join(TIMELINES_DIR, file), 'utf-8'));
        for (const c of tl.clips || []) {
          if (c.clipPath) {
            locked.add(path.basename(c.clipPath));
          }
        }
      } catch {}
    }
  }

  return locked;
}

export function lockAsset(filename: string) {
  const current = getLockedAssets();
  current.add(filename);
  fs.writeFileSync(
    REGISTRY_PATH,
    JSON.stringify(
      {
        projectId: PROJECT_ID,
        strictRule: 'NEVER_REPEAT_ANYWHERE',
        zeroPortableToilets: 'ENFORCED',
        totalLockedClips: current.size,
        lockedClips: Array.from(current),
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    'utf-8'
  );
}

export async function downloadStockVideoReliable(searchQuery: string, slug: string): Promise<string | null> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  const pixabayKey = process.env.PIXABAY_API_KEY;

  const safeFilename = `stock_${slug.replace(/[^a-z0-9_-]/gi, '_')}.mp4`;
  const targetPath = path.join(STOCK_DIR, safeFilename);

  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 20000) {
    return targetPath;
  }

  // 1. Pexels HD
  if (pexelsKey) {
    try {
      const q = encodeURIComponent(searchQuery.slice(0, 35));
      const res = await fetch(`https://api.pexels.com/videos/search?query=${q}&per_page=10&orientation=landscape`, {
        headers: { Authorization: pexelsKey },
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const videos = data.videos || [];
        for (const v of videos) {
          // Select 720p or 1080p file that downloads rapidly
          const file =
            v.video_files?.find((f: any) => f.quality === 'hd' && f.width >= 1280 && f.width <= 1920) ||
            v.video_files?.find((f: any) => f.width >= 1280) ||
            v.video_files?.[0];

          if (file?.link) {
            console.log(`    ⬇ [Pexels HD] Downloading: "${searchQuery}" -> ${safeFilename}`);
            try {
              execSync(`curl.exe -L -s --max-time 45 -o "${targetPath}" "${file.link}"`, { timeout: 50000 });
              if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 20000) {
                return targetPath;
              }
            } catch (err: any) {
              console.warn(`    ⚠️ Curl download failed: ${err.message}`);
            }
          }
        }
      }
    } catch (e: any) {
      console.warn(`    ⚠️ Pexels search failed: ${e.message}`);
    }
  }

  // 2. Pixabay HD
  if (pixabayKey) {
    try {
      const q = encodeURIComponent(searchQuery.split(' ').slice(0, 3).join(' '));
      const res = await fetch(`https://pixabay.com/api/videos/?key=${pixabayKey}&q=${q}&per_page=8&safesearch=true`, {
        signal: AbortSignal.timeout(6000),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const hits = data.hits || [];
        for (const h of hits) {
          const dlUrl = h.videos?.medium?.url || h.videos?.small?.url;
          if (dlUrl) {
            console.log(`    ⬇ [Pixabay HD] Downloading: "${searchQuery}" -> ${safeFilename}`);
            try {
              execSync(`curl.exe -L -s --max-time 45 -o "${targetPath}" "${dlUrl}"`, { timeout: 50000 });
              if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 20000) {
                return targetPath;
              }
            } catch (err: any) {}
          }
        }
      }
    } catch (e: any) {}
  }

  return null;
}

export function saveTimelineAndSyncStore(chNum: number, timeline: Timeline) {
  const numStr = String(chNum).padStart(2, '0');
  const outPath = path.join(TIMELINES_DIR, `chapter_${numStr}.json`);
  fs.writeFileSync(outPath, JSON.stringify(timeline, null, 2), 'utf-8');
  console.log(`💾 Saved Timeline: chapter_${numStr}.json (${timeline.clips.length} beats)`);

  const storePaths = [
    path.resolve(REPO_ROOT, 'apps/api/output/store/projects.json'),
    path.resolve(REPO_ROOT, 'output/store/projects.json'),
  ];

  for (const sp of storePaths) {
    if (fs.existsSync(sp)) {
      try {
        const storeData = JSON.parse(fs.readFileSync(sp, 'utf-8'));
        const proj = storeData.find((p: any) => p.id === PROJECT_ID);
        if (proj) {
          if (!proj.title) {
            proj.title = 'The Man On The Freeway Hillside: Jose Fuentes & The Pacoima Estate';
          }
          if (proj.chapters) {
            const ch = proj.chapters.find((c: any) => c.chapterIndex === chNum);
            if (ch) {
              ch.status = 'ready_to_render';
              ch.timelineJson = timeline;
            }
          }
        }
        fs.writeFileSync(sp, JSON.stringify(storeData, null, 2), 'utf-8');
      } catch (e: any) {
        console.warn(`Failed to update store at ${sp}:`, e.message);
      }
    }
  }

  // Sync media registry file
  const allLocked = getLockedAssets();
  fs.writeFileSync(
    REGISTRY_PATH,
    JSON.stringify(
      {
        projectId: PROJECT_ID,
        strictRule: 'NEVER_REPEAT_ANYWHERE',
        zeroPortableToilets: 'ENFORCED',
        totalLockedClips: allLocked.size,
        lockedClips: Array.from(allLocked),
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    'utf-8'
  );
}
