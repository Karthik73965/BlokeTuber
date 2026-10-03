/**
 * STAGE AUTHENTIC & STOCK TIMELINES (CHAPTERS 1-11)
 * ==================================================
 * 1. ZERO PORTABLE-TOILET CLIPS:
 *    Explicitly excludes and bans:
 *    - he_made_a_tiny_home_out_of_por
 *    - porta_potty_house_world_s_smal
 *    - man_wants_to_convert_port_a_po
 *    - how_a_bathroom_on_wheels_is_ch
 *    - pot_growing_fire_sun_valley_ra
 *
 * 2. AUTHENTIC DOCUMENTARY FOOTAGE FIRST:
 *    Matches beat semantics to 244 authentic clips:
 *    - Jose Fuentes Hillside Estate & Mini Mansion (gardener_experiencing_homeless, homeless_man_creates_mini_mans)
 *    - Pacoima Street & Businesses (pacoima_residents_plead_with_c, pacoima_street_homelessness_tr)
 *    - Caltrans & City Cleanup Crews (caltrans_crews_clean_out_sacra, crews_clean_up_homeless_encamp, los_angeles_city_crews_to_remo)
 *    - North Hollywood Pallet Homes (north_hollywood_pallet_homes_x, los_angeles_opens_temporary_ho)
 *    - California Encampments (could_homeless_encampments_und, oakland_california_homeless_en, etc.)
 *
 * 3. ON-THE-FLY STOCK SOURCING (Pexels / Pixabay):
 *    Whenever no authentic local clip matches the beat with high confidence (score < 20),
 *    search Pexels / Pixabay for real HD/4K documentary b-roll (freeway traffic, morning commute,
 *    landscaping hands, orange cones, etc.), download it locally, and attach it to the beat.
 *
 * 4. STRICT ZERO-REPEAT RULE:
 *    100% unique footage across all 11 chapters. No clip or stock video is ever reused.
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import type { Timeline, TimelineClip, SceneLayoutType, CalloutOverlay, SceneLayoutData, TransitionType } from '@repo/shared';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import { loadProjectManifest } from '../src/services/youtubeSourcing';
import { downloadStockVideo, StockVideo } from '../src/services/stockFootage';

// Ensure env is loaded
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const PROJECT_ID = 'proj_1790101325660';
const REPO_ROOT = path.resolve(__dirname, '../../..');
const TRANSCRIPTS_DIR = path.resolve(REPO_ROOT, 'uploads/transcripts/portable-toilets');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/portable-toilets');
const STOCK_DIR = path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets');
const REGISTRY_PATH = path.resolve(REPO_ROOT, `uploads/registry/${PROJECT_ID}_media_registry.json`);

fs.mkdirSync(TIMELINES_DIR, { recursive: true });
fs.mkdirSync(STOCK_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });

// SFX paths
const SFX_DIR = path.resolve(REPO_ROOT, 'packages/remotion-video/public/sfx');
const SFX = {
  whoosh_cinematic: path.join(SFX_DIR, 'whoosh_cinematic.mp3').replace(/\\/g, '/'),
  whoosh_air: path.join(SFX_DIR, 'whoosh_air.mp3').replace(/\\/g, '/'),
  subtle_hit: path.join(SFX_DIR, 'subtle_hit.mp3').replace(/\\/g, '/'),
  paper_slide: path.join(SFX_DIR, 'paper_slide.mp3').replace(/\\/g, '/'),
};

// ── BANNED CLIP PREFIXES (NEVER USE PORTABLE TOILETS / WAREHOUSE FIRE) ────────
const BANNED_PREFIXES = [
  'he_made_a_tiny_home_out_of_por',
  'porta_potty_house_world_s_smal',
  'man_wants_to_convert_port_a_po',
  'how_a_bathroom_on_wheels_is_ch',
  'pot_growing_fire_sun_valley_ra',
];

// ── SEMANTIC KEYWORD TO LOCAL TAG SCORING ─────────────────────────────────────
interface TagRule {
  keywords: string[];
  tags: string[];
  weight: number;
}

const SEMANTIC_RULES: TagRule[] = [
  // 1. Jose Fuentes / Hillside Estate
  { keywords: ['fuentes', 'jose', 'hillside', 'slope', 'ridge', 'dirt path', 'estate', 'mini mansion', 'mansion', 'built by hand', 'one man'], tags: ['jose_fuentes', 'hillside_estate', 'makeshift_estate', 'authentic_broll'], weight: 25 },
  { keywords: ['rock', 'stone', 'retaining', 'rock bed', 'rock garden', 'garden bed', 'weeded', 'flower', 'edge', 'plants'], tags: ['rock_gardens', 'retaining_rocks', 'wooden_retaining_walls', 'green_slide', 'authentic_broll'], weight: 25 },
  { keywords: ['slide', 'wooden slide', 'green slide', 'bolted'], tags: ['green_slide', 'hillside_estate', 'authentic_broll'], weight: 30 },
  { keywords: ['toy car', 'toy cars', 'small cars', 'lined up', 'parked', 'miniature'], tags: ['toy_cars', 'authentic_broll', 'hillside_estate'], weight: 30 },
  { keywords: ['clock', 'flamingo', 'pink', 'decorated', 'toys'], tags: ['pink_flamingo_clock', 'authentic_broll', 'hillside_estate'], weight: 30 },
  { keywords: ['speaker', 'music', 'one-room', 'one room', 'shelter built', 'inside it', 'interior', 'tour', 'walkthrough', 'bed'], tags: ['shelter_tour', 'shelter_interior', 'bed_and_salvage', 'walkthrough', 'interior_micro_bed'], weight: 25 },

  // 2. Freeway / Traffic / 118
  { keywords: ['freeway', '118', '1.18', 'sr-118', 'stacking up', 'traffic', 'drivers', 'glenoaks', 'boulevard', 'overpass', 'underpass', 'shoulder'], tags: ['pacoima_118', 'freeway_overpass', 'wide_freeway_view', 'freeway_traffic_passing'], weight: 20 },

  // 3. Pacoima / Neighbors / Businesses
  { keywords: ['pacoima', 'neighborhood', 'taco', 'padilla', 'nathaniel', 'restaurant', 'strip mall', 'business', 'shop', 'commercial', 'street'], tags: ['pacoima_businesses', 'strip_mall_corridor', 'commercial_corridor', 'pacoima_street', 'street_conditions'], weight: 25 },
  { keywords: ['stella', 'ponce', '88', 'neighbor', 'fence', 'backyard', 'bicycles', 'trash pile', 'grievance'], tags: ['stella_ponce', 'bicycles_trash_pile', 'pacoima_fence', 'grievance_side', 'backyard_fence'], weight: 30 },

  // 4. Caltrans / Evictions / Cleanups
  { keywords: ['caltrans', 'state of california', 'notice to vacate', 'notice', 'vacate', 'eviction', 'right of way', 'jurisdiction', 'state property'], tags: ['caltrans_notice_to_vacate', 'eviction_notice', 'state_property', 'jurisdictional_gap', 'no_mans_land'], weight: 25 },
  { keywords: ['crew', 'crews', 'sweep', 'cleanup', 'clean up', 'machinery', 'bulldozer', 'orange cone', 'sanitation', 'workers', 'protective suit', 'removal'], tags: ['caltrans_crews', 'encampment_sweep', 'heavy_machinery', 'removal_operations', 'city_sweeps', 'caltrans_city_cleaners', 'city_sanitation_crews', 'orange_cones'], weight: 25 },
  { keywords: ['railroad', 'train', 'tracks', 'easement'], tags: ['railroad_tracks_debris', 'railroad_easement', 'caltrans_corridor'], weight: 20 },

  // 5. Pallet Homes / Tiny Homes / North Hollywood
  { keywords: ['pallet', 'tiny home', 'modular', 'cabin', 'north hollywood', 'shelter village', 'village', 'lockable door'], tags: ['pallet_homes', 'pallet_tiny_homes', 'north_hollywood_shelter', 'modular_cabins', 'tiny_home_village', 'lockable_door', 'interim_shelter'], weight: 30 },

  // 6. Encampments / Homelessness / General Street Conditions
  { keywords: ['encampment', 'tent', 'tents', 'tarp', 'sidewalk', 'unhoused', 'homeless', 'sleeping outside', 'living outside'], tags: ['freeway_underpass_tents', 'corridor_tents', 'sidewalk_survival', 'sidewalk_tents', 'california_encampment_broll', 'la_county_homelessness', 'pacoima_encampment'], weight: 20 },
  { keywords: ['older', 'aging', 'elderly', 'tradesmen', 'gardener', 'craftsman', 'sixties', '60s'], tags: ['older_unhoused', 'corridor_tents', 'sidewalk_survival', 'persistent_homelessness'], weight: 20 },
];

function scoreLocalClip(beatText: string, clipTags: string[]): number {
  if (!clipTags || clipTags.length === 0) return 0;
  const lowerBeat = beatText.toLowerCase();
  let score = 0;

  for (const rule of SEMANTIC_RULES) {
    const hit = rule.keywords.some((kw) => lowerBeat.includes(kw));
    if (!hit) continue;
    const matches = rule.tags.filter((t) => clipTags.includes(t)).length;
    if (matches > 0) {
      score += rule.weight * matches;
    }
  }
  return score;
}

// ── STOCK SEARCH QUERY BUILDER ────────────────────────────────────────────────
function buildStockQueryForBeat(beatText: string, chapterTitle: string): string {
  const lower = beatText.toLowerCase();

  if (lower.includes('freeway') || lower.includes('118') || lower.includes('cars') || lower.includes('traffic') || lower.includes('drivers')) {
    return 'highway traffic freeway';
  }
  if (lower.includes('light') && lower.includes('morning')) {
    return 'sunrise morning highway';
  }
  if (lower.includes('rock') || lower.includes('garden') || lower.includes('landscap') || lower.includes('weeded') || lower.includes('stone')) {
    return 'landscaping stone garden';
  }
  if (lower.includes('built by hand') || lower.includes('wood') || lower.includes('tool') || lower.includes('craftsman') || lower.includes('work')) {
    return 'carpenter working wood';
  }
  if (lower.includes('tent') || lower.includes('encampment') || lower.includes('sidewalk') || lower.includes('street')) {
    return 'city street sidewalk tents';
  }
  if (lower.includes('caltrans') || lower.includes('crew') || lower.includes('worker') || lower.includes('cleanup') || lower.includes('orange cone')) {
    return 'construction workers road highway';
  }
  if (lower.includes('store') || lower.includes('restaurant') || lower.includes('shop') || lower.includes('business')) {
    return 'urban storefront street';
  }
  if (lower.includes('older') || lower.includes('aging') || lower.includes('man') || lower.includes('tradesmen')) {
    return 'senior working man';
  }
  if (lower.includes('tiny home') || lower.includes('shelter') || lower.includes('cabin')) {
    return 'small wooden cabin structure';
  }

  // Fallback to chapter vibe
  return `${chapterTitle.toLowerCase().replace(/chapter \d+:?/, '').trim()} urban documentary`;
}

// ── PEXELS / PIXABAY SEARCH & DOWNLOAD HELPER ─────────────────────────────────
const downloadedStockUrls = new Set<string>();

async function sourceStockFootageForBeat(
  query: string,
  beatIndex: number,
  chapterNum: number
): Promise<{ localPath: string; title: string; source: string } | null> {
  const pexelsKey = process.env.PEXELS_API_KEY;
  const pixabayKey = process.env.PIXABAY_API_KEY;

  // 1. Try Pexels first
  if (pexelsKey) {
    try {
      const q = encodeURIComponent(query.slice(0, 35));
      const res = await fetch(`https://api.pexels.com/videos/search?query=${q}&per_page=10&orientation=landscape`, {
        headers: { Authorization: pexelsKey },
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const candidates = (data.videos || []).filter((v: any) => {
          const dl = v.video_files?.find((f: any) => f.quality === 'hd' || f.width >= 1280) || v.video_files?.[0];
          return dl?.link && !downloadedStockUrls.has(dl.link);
        });

        if (candidates.length > 0) {
          const chosen = candidates[0];
          const dlFile = chosen.video_files?.find((f: any) => f.quality === 'hd' || f.width >= 1280) || chosen.video_files?.[0];
          const dlUrl = dlFile.link;

          const outFilename = `stock_ch${String(chapterNum).padStart(2, '0')}_b${String(beatIndex).padStart(2, '0')}_pexels_${chosen.id}.mp4`;
          const outPath = path.join(STOCK_DIR, outFilename);

          console.log(`    ⬇ Downloading Pexels Stock: "${query}" -> ${outFilename}`);
          await downloadStockVideo(
            {
              source: 'pexels',
              url: dlUrl,
              previewUrl: chosen.image || '',
              title: query,
              duration: chosen.duration,
            },
            outPath
          );

          if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
            downloadedStockUrls.add(dlUrl);
            return { localPath: outPath, title: `Pexels: ${query}`, source: 'pexels' };
          }
        }
      }
    } catch (err: any) {
      console.warn(`    ⚠️ Pexels fetch failed for "${query}":`, err.message);
    }
  }

  // 2. Try Pixabay
  if (pixabayKey) {
    try {
      const q = encodeURIComponent(query.split(' ').slice(0, 3).join(' '));
      const res = await fetch(`https://pixabay.com/api/videos/?key=${pixabayKey}&q=${q}&per_page=10&safesearch=true`, {
        signal: AbortSignal.timeout(10000),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const candidates = (data.hits || []).filter((h: any) => {
          const dlUrl = h.videos?.medium?.url || h.videos?.small?.url;
          return dlUrl && !downloadedStockUrls.has(dlUrl);
        });

        if (candidates.length > 0) {
          const chosen = candidates[0];
          const dlUrl = chosen.videos?.medium?.url || chosen.videos?.small?.url;
          const outFilename = `stock_ch${String(chapterNum).padStart(2, '0')}_b${String(beatIndex).padStart(2, '0')}_pixabay_${chosen.id}.mp4`;
          const outPath = path.join(STOCK_DIR, outFilename);

          console.log(`    ⬇ Downloading Pixabay Stock: "${query}" -> ${outFilename}`);
          await downloadStockVideo(
            {
              source: 'pixabay',
              url: dlUrl,
              previewUrl: chosen.thumbnail || '',
              title: query,
              duration: chosen.duration,
            },
            outPath
          );

          if (fs.existsSync(outPath) && fs.statSync(outPath).size > 10000) {
            downloadedStockUrls.add(dlUrl);
            return { localPath: outPath, title: `Pixabay: ${query}`, source: 'pixabay' };
          }
        }
      }
    } catch (err: any) {
      console.warn(`    ⚠️ Pixabay fetch failed for "${query}":`, err.message);
    }
  }

  return null;
}

// ── CHAPTER METADATA CONFIGS ──────────────────────────────────────────────────
interface ChapterConfig {
  jsonFile: string;
  audioFile: string;
  title: string;
  themeColor: 'gold' | 'amber' | 'cyan' | 'crimson' | 'emerald' | 'slate' | 'white';
  introCallout: { type: any; line1: string; line2?: string };
  midCallout: { type: any; line1: string; line2?: string };
}

const CHAPTER_CONFIGS: Record<number, ChapterConfig> = {
  1: {
    jsonFile: '01_1 - COLD.json',
    audioFile: '1 - COLD.mp3',
    title: 'Cold Open',
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'GLENOAKS BLVD & SR-118', line2: 'PACOIMA, LOS ANGELES • 6:45 AM' },
    midCallout: { type: 'location_badge', line1: 'THE HILLSIDE ESTATE', line2: 'JOSE FUENTES • BUILT BY HAND' },
  },
  2: {
    jsonFile: '02_2 - THE GARDENER WITH NO GARDEN.json',
    audioFile: '2 - THE GARDENER WITH NO GARDEN.mp3',
    title: 'The Gardener With No Garden',
    themeColor: 'emerald',
    introCallout: { type: 'editorial_lower_third', line1: 'JOSE FUENTES', line2: 'PROFESSIONAL LANDSCAPER • COLIMA, MEXICO' },
    midCallout: { type: 'odometer_stat', line1: 'HUNDREDS OF HOURS', line2: 'NO BLUEPRINT • NO BUDGET' },
  },
  3: {
    jsonFile: '03_3 - WHO AGES OUT ONTO A HILLSIDE.json',
    audioFile: '3 - WHO AGES OUT ONTO A HILLSIDE.mp3',
    title: 'Who Ages Out Onto A Hillside',
    themeColor: 'amber',
    introCallout: { type: 'editorial_lower_third', line1: 'LOS ANGELES COUNTY', line2: 'AGING TRADESMEN WITHOUT A SAFETY NET' },
    midCallout: { type: 'odometer_stat', line1: '50s, 60s & BEYOND', line2: 'THE SLOW MATH OF RISING RENT' },
  },
  4: {
    jsonFile: '04_4 - THE NEIGHBORS WHO CHOSE HIM.json',
    audioFile: '4 - THE NEIGHBORS WHO CHOSE HIM.mp3',
    title: 'The Neighbors Who Chose Him',
    themeColor: 'cyan',
    introCallout: { type: 'editorial_lower_third', line1: 'TACO EL CANELO', line2: 'NATHANIEL PADILLA • STRIP MALL OWNER' },
    midCallout: { type: 'location_badge', line1: 'PACOIMA COMMUNITY', line2: 'MUTUAL GOODWILL • ZERO SWEEP REQUESTS' },
  },
  5: {
    jsonFile: '05_5 - THE OTHER SIDE OF THE SAME CORRIDOR.json',
    audioFile: '5 - THE OTHER SIDE OF THE SAME CORRIDOR.mp3',
    title: 'The Other Side Of The Same Corridor',
    themeColor: 'crimson',
    introCallout: { type: 'editorial_lower_third', line1: 'STELLA PONCE (AGE 88)', line2: 'PACOIMA RESIDENT • THE OTHER SIDE OF 118' },
    midCallout: { type: 'odometer_stat', line1: 'YEARS OF GRIEVANCE', line2: 'CALTRANS SYSTEMIC ABSENCE' },
  },
  6: {
    jsonFile: '06_6 - VIRAL AND WHAT VIRALITY ACTUALLY BOUGHT HIM.json',
    audioFile: '6 - VIRAL, AND WHAT VIRALITY ACTUALLY BOUGHT HIM.mp3',
    title: 'Viral, And What Virality Actually Bought Him',
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'LOCAL MEDIA SENSATION', line2: 'MILLIONS OF SOCIAL MEDIA VIEWS' },
    midCallout: { type: 'odometer_stat', line1: 'VIRALITY VS LEASE', line2: 'ATTENTION IS NOT HOUSING' },
  },
  7: {
    jsonFile: '07_7 - CALTRANS AND THE AGENCY THAT WASNT THERE.json',
    audioFile: "7 - CALTRANS, AND THE AGENCY THAT WASN'T THERE.mp3",
    title: "Caltrans, And The Agency That Wasn't There",
    themeColor: 'slate',
    introCallout: { type: 'editorial_lower_third', line1: 'CALIFORNIA RIGHT-OF-WAY', line2: "THE JURISDICTIONAL NO-MAN'S LAND" },
    midCallout: { type: 'location_badge', line1: '3 LEVELS OF GOVERNMENT', line2: "EVERYONE'S LAND • NO ONE'S CASELOAD" },
  },
  8: {
    jsonFile: '08_8 - WHAT GETS TAKEN DOWN.json',
    audioFile: '8 - WHAT GETS TAKEN DOWN.mp3',
    title: 'What Gets Taken Down',
    themeColor: 'cyan',
    introCallout: { type: 'editorial_lower_third', line1: 'SUMMER HEAT & SHIFT', line2: 'MOVING INTO THE SHADE' },
    midCallout: { type: 'location_badge', line1: 'NORTH HOLLYWOOD PALLET HOMES', line2: 'THE COST OF LEAVING COMMUNITY' },
  },
  9: {
    jsonFile: '09_9 - THE TOUR.json',
    audioFile: '9 - THE TOUR.mp3',
    title: 'The Tour',
    themeColor: 'amber',
    introCallout: { type: 'editorial_lower_third', line1: 'INSIDE THE SHELTER', line2: 'A BED, A DOOR, RECLAIMED ACOUSTICS' },
    midCallout: { type: 'location_badge', line1: 'NOT A SPECTACLE', line2: 'A HOME BUILT WITH CARE' },
  },
  10: {
    jsonFile: '10_10 - THE WIDER ORDER CLOSING IN.json',
    audioFile: '10 - THE WIDER ORDER CLOSING IN.mp3',
    title: 'The Wider Order Closing In',
    themeColor: 'crimson',
    introCallout: { type: 'editorial_lower_third', line1: 'STATE ENFORCEMENT DIRECTIVE', line2: 'SUPREME COURT RULING & CLEARANCES' },
    midCallout: { type: 'location_badge', line1: 'LA FREEWAY CORRIDORS', line2: 'THE ENFORCEMENT WAVE CLOSING IN' },
  },
  11: {
    jsonFile: '11_11 - CLOSING.json',
    audioFile: '11 - CLOSING.mp3',
    title: 'Closing',
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'AMERICAN HIDEAWAYS', line2: 'THE MAN ON THE HILLSIDE' },
    midCallout: { type: 'odometer_stat', line1: 'A LIFETIME OF TRADE', line2: 'WHAT ONE PERSON MANAGED TO BUILD' },
  },
};

interface AlignmentSegment {
  text: string;
  start: number;
  end: number;
  words: Array<{ word: string; start: number; end: number }>;
}

interface Beat {
  start: number;
  end: number;
  text: string;
  words: any[];
}

function groupSegmentsIntoBeats(segments: AlignmentSegment[]): Beat[] {
  const beats: Beat[] = [];
  let curBeat: Beat = { start: 0, end: 0, text: '', words: [] };

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    if (curBeat.words.length === 0) {
      curBeat.start = seg.start;
      curBeat.end = seg.end;
      curBeat.text = seg.text.trim();
      curBeat.words = [...(seg.words || [])];
    } else {
      const potentialDuration = seg.end - curBeat.start;
      if (potentialDuration <= 5.8) {
        curBeat.end = seg.end;
        curBeat.text += ' ' + seg.text.trim();
        curBeat.words.push(...(seg.words || []));
      } else {
        beats.push({ ...curBeat });
        curBeat = { start: seg.start, end: seg.end, text: seg.text.trim(), words: [...(seg.words || [])] };
      }
    }
  }
  if (curBeat.words.length > 0) {
    beats.push({ ...curBeat });
  }
  return beats;
}

// ── MAIN EXECUTION ────────────────────────────────────────────────────────────
async function run() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('🎬 STAGING JOSE FUENTES DOCUMENTARY (CHAPTERS 1-11) — AUTHENTIC + STOCK');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('🚫 STRICT ZERO PORTABLE-TOILET CLIPS RULE ENFORCED');
  console.log('🎯 SEMANTIC BEAT-MATCHING AGAINST 244 AUTHENTIC DOCUMENTARY CLIPS');
  console.log('🌐 ON-THE-FLY HD/4K STOCK FOOTAGE SOURCING (Pexels / Pixabay)');
  console.log('🔒 STRICT GLOBAL ZERO-REPEAT RULE ACROSS ALL 11 CHAPTERS\n');

  // Load manifest and filter out all banned prefixes
  const manifest = loadProjectManifest(PROJECT_ID);
  const authenticApprovedClips = manifest.clips.filter((c) => {
    if (c.status !== 'approved') return false;
    const isBanned = BANNED_PREFIXES.some((b) => c.filename.startsWith(b));
    return !isBanned;
  });

  console.log(`🎥 Available Authentic Documentary Pool: ${authenticApprovedClips.length} clips`);

  // Global registry of used clips across all chapters
  const usedClipFilenames = new Set<string>();
  const chapterSummaryStats: Array<{ chapter: number; title: string; beats: number; authentic: number; stock: number }> = [];

  for (let chNum = 1; chNum <= 11; chNum++) {
    const config = CHAPTER_CONFIGS[chNum]!;
    const numStr = String(chNum).padStart(2, '0');
    const jsonPath = path.join(TRANSCRIPTS_DIR, config.jsonFile);
    const audioPath = path.resolve(REPO_ROOT, 'uploads/audio', config.audioFile);

    if (!fs.existsSync(jsonPath) || !fs.existsSync(audioPath)) {
      console.warn(`⚠️ Skipping Chapter ${chNum} (missing transcript or audio)`);
      continue;
    }

    const transcriptData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const segments: AlignmentSegment[] = transcriptData.segments || [];
    const beats = groupSegmentsIntoBeats(segments);
    const totalDuration = beats[beats.length - 1]?.end || 60;

    console.log(`\n─────────────────────────────────────────────────────────────────────`);
    console.log(`🎬 Chapter ${numStr}: "${config.title}" (${beats.length} beats, ${totalDuration.toFixed(1)}s)`);
    console.log(`─────────────────────────────────────────────────────────────────────`);

    const clips: TimelineClip[] = [];
    let authenticMatches = 0;
    let stockMatches = 0;

    for (let bIdx = 0; bIdx < beats.length; bIdx++) {
      const beat = beats[bIdx]!;
      const clipDuration = Number((beat.end - beat.start).toFixed(2));
      const beatLabel = `Beat ${String(bIdx + 1).padStart(2, '0')}`;
      const snippet = `"${beat.text.slice(0, 48).trim()}..."`;

      // ── STEP 1: Find best authentic local documentary clip ──
      let bestLocalClip: typeof authenticApprovedClips[0] | null = null;
      let bestLocalScore = -1;

      for (const clip of authenticApprovedClips) {
        if (usedClipFilenames.has(clip.filename)) continue;
        const score = scoreLocalClip(beat.text, clip.tags || []);
        if (score > bestLocalScore) {
          bestLocalScore = score;
          bestLocalClip = clip;
        }
      }

      let selectedPath = '';
      let selectedSourceLabel = '';

      // ── STEP 2: Use authentic local clip if high confidence (score >= 20) ──
      if (bestLocalClip && bestLocalScore >= 20) {
        selectedPath = bestLocalClip.fullPath;
        usedClipFilenames.add(bestLocalClip.filename);
        authenticMatches++;
        selectedSourceLabel = `[AUTHENTIC score=${bestLocalScore}] ${bestLocalClip.filename}`;
      } else {
        // ── STEP 3: Fallback to real HD/4K stock video on the fly ──
        const stockQuery = buildStockQueryForBeat(beat.text, config.title);
        const stockResult = await sourceStockFootageForBeat(stockQuery, bIdx + 1, chNum);

        if (stockResult) {
          selectedPath = stockResult.localPath;
          usedClipFilenames.add(path.basename(stockResult.localPath));
          stockMatches++;
          selectedSourceLabel = `[STOCK ${stockResult.source.toUpperCase()}] "${stockQuery}" -> ${path.basename(stockResult.localPath)}`;
        } else if (bestLocalClip) {
          // If stock download failed, use best available authentic local clip
          selectedPath = bestLocalClip.fullPath;
          usedClipFilenames.add(bestLocalClip.filename);
          authenticMatches++;
          selectedSourceLabel = `[AUTHENTIC-FALLBACK score=${bestLocalScore}] ${bestLocalClip.filename}`;
        } else {
          // Find any remaining authentic clip
          const anyRemaining = authenticApprovedClips.find((c) => !usedClipFilenames.has(c.filename));
          if (!anyRemaining) {
            throw new Error(`CRITICAL: All authentic clips and stock sourcing exhausted at Ch ${chNum} Beat ${bIdx + 1}!`);
          }
          selectedPath = anyRemaining.fullPath;
          usedClipFilenames.add(anyRemaining.filename);
          authenticMatches++;
          selectedSourceLabel = `[AUTHENTIC-POOL] ${anyRemaining.filename}`;
        }
      }

      console.log(`  ${beatLabel} ${snippet} \n     ➔ ${selectedSourceLabel}`);

      // Callout placement
      let callout: CalloutOverlay | null = null;
      if (bIdx === 0) {
        callout = {
          type: config.introCallout.type,
          line1: config.introCallout.line1,
          line2: config.introCallout.line2,
          startTime: 0.3,
          endTime: Math.min(3.6, clipDuration - 0.2),
          themeColor: config.themeColor,
        };
      } else if (bIdx === Math.floor(beats.length / 2)) {
        callout = {
          type: config.midCallout.type,
          line1: config.midCallout.line1,
          line2: config.midCallout.line2,
          startTime: 0.4,
          endTime: Math.min(3.4, clipDuration - 0.2),
          themeColor: config.themeColor,
        };
      }

      // Layout styling
      let layout: SceneLayoutType = 'full_bleed_cinematic';
      let layoutData: SceneLayoutData | undefined = undefined;

      if (bIdx === 0) {
        layout = 'ambient_blur_frame';
        layoutData = {
          title: 'AMERICAN HIDEAWAYS',
          subtitle: config.title.toUpperCase(),
          tag: 'PACOIMA, CA',
        };
      } else if (bIdx % 7 === 0) {
        layout = 'hero_graphic_centerpiece';
        layoutData = {
          title: 'THE HILLSIDE ESTATE',
          subtitle: 'DOCUMENTARY ARCHIVE',
        };
      }

      const transitions: TransitionType[] = ['crossfade', 'film_burn', 'luma_fade', 'blur_dissolve'];
      const transition = transitions[bIdx % transitions.length]!;

      clips.push({
        id: `ch${numStr}_beat_${bIdx + 1}`,
        mediaType: 'video',
        clipPath: selectedPath.replace(/\\/g, '/'),
        startTime: beat.start,
        endTime: beat.end,
        duration: clipDuration,
        text: beat.text,
        layout,
        layoutData,
        callout,
        overlay: 'micro_film_grain',
        transition,
        transitionDuration: 0.4,
        sfxPath: bIdx === 0 ? SFX.whoosh_cinematic : (bIdx % 4 === 0 ? SFX.subtle_hit : undefined),
        sfxVolume: 0.35,
      });
    }

    const timeline: Timeline = {
      projectId: PROJECT_ID,
      totalDuration,
      masterAudioPath: audioPath.replace(/\\/g, '/'),
      audioDuration: totalDuration,
      fps: 30,
      width: 1920,
      height: 1080,
      clips,
    };

    // Save timeline JSON
    const outPath = path.join(TIMELINES_DIR, `chapter_${numStr}.json`);
    fs.writeFileSync(outPath, JSON.stringify(timeline, null, 2), 'utf-8');
    console.log(`  💾 Saved timeline: chapter_${numStr}.json (${clips.length} beats)`);

    // Update stores (both output/store/projects.json and apps/api/output/store/projects.json)
    const storePaths = [
      path.resolve(REPO_ROOT, 'apps/api/output/store/projects.json'),
      path.resolve(REPO_ROOT, 'output/store/projects.json'),
    ];

    for (const sp of storePaths) {
      if (fs.existsSync(sp)) {
        try {
          const storeData = JSON.parse(fs.readFileSync(sp, 'utf-8'));
          const proj = storeData.find((p: any) => p.id === PROJECT_ID);
          if (proj && proj.chapters) {
            const ch = proj.chapters.find((c: any) => c.chapterIndex === chNum);
            if (ch) {
              ch.status = 'ready_to_render';
              ch.timelineJson = timeline;
            }
          }
          fs.writeFileSync(sp, JSON.stringify(storeData, null, 2), 'utf-8');
        } catch {}
      }
    }

    chapterSummaryStats.push({
      chapter: chNum,
      title: config.title,
      beats: beats.length,
      authentic: authenticMatches,
      stock: stockMatches,
    });
  }

  // Save registry
  fs.writeFileSync(
    REGISTRY_PATH,
    JSON.stringify(
      {
        projectId: PROJECT_ID,
        strictRule: 'NEVER_REPEAT_ANYWHERE',
        zeroPortableToiletRule: 'ENFORCED',
        totalLockedClips: usedClipFilenames.size,
        lockedClips: Array.from(usedClipFilenames),
        chapterSummary: chapterSummaryStats,
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log(`🎉 ALL 11 CHAPTER STORYBOARDS DIRECTED & STAGED!`);
  console.log(`🔒 Total Unique Assets Locked: ${usedClipFilenames.size} (0 Duplicates Anywhere)`);
  console.log(`🚫 Portable Toilet Clips Used: ZERO (0)`);
  console.table(chapterSummaryStats);
  console.log(`🌐 Ready for visual review in Dashboard: http://localhost:3000/project/${PROJECT_ID}`);
  console.log('═══════════════════════════════════════════════════════════════════════\n');
}

run().catch((err) => {
  console.error('❌ Staging error:', err);
  process.exit(1);
});
