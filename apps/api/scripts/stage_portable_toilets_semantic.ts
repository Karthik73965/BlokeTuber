/**
 * SEMANTIC BEAT-AWARE TIMELINE STAGING
 * =====================================
 * For each beat in each chapter:
 *   1. Extract visual keywords from beat text
 *   2. Score ALL approved unused clips by tag overlap with keywords
 *   3. Pick highest-scoring clip (true semantic match)
 *   4. If score == 0 → use best thematic fallback for the chapter
 *   5. Zero-repeat rule: each clip used ONCE across all 11 chapters
 *
 * After staging: save all 11 timeline JSONs + update chaptersStore
 * Dashboard review BEFORE render.
 */

import fs from 'fs';
import path from 'path';
import type { Timeline, TimelineClip, SceneLayoutType, CalloutOverlay, SceneLayoutData, TransitionType } from '@repo/shared';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import { loadProjectManifest } from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_1790101325660';
const REPO_ROOT = path.resolve(__dirname, '../../..');
const TRANSCRIPTS_DIR = path.resolve(REPO_ROOT, 'uploads/transcripts/portable-toilets');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/portable-toilets');
const REGISTRY_PATH = path.resolve(REPO_ROOT, `uploads/registry/${PROJECT_ID}_media_registry.json`);

fs.mkdirSync(TIMELINES_DIR, { recursive: true });

// SFX paths
const SFX_DIR = path.resolve(REPO_ROOT, 'packages/remotion-video/public/sfx');
const SFX = {
  whoosh_cinematic: path.join(SFX_DIR, 'whoosh_cinematic.mp3').replace(/\\/g, '/'),
  whoosh_air: path.join(SFX_DIR, 'whoosh_air.mp3').replace(/\\/g, '/'),
  subtle_hit: path.join(SFX_DIR, 'subtle_hit.mp3').replace(/\\/g, '/'),
  paper_slide: path.join(SFX_DIR, 'paper_slide.mp3').replace(/\\/g, '/'),
};

// ─────────────────────────────────────────────────────────────────────────────
// SEMANTIC KEYWORD → TAG MAPPING
// Maps words/phrases found in beat text to relevant visual tags
// ─────────────────────────────────────────────────────────────────────────────
const KEYWORD_TAG_MAP: Array<{ keywords: string[]; tags: string[]; weight: number }> = [
  // Jose Fuentes / Hillside
  { keywords: ['fuentes', 'jose', 'hillside', 'hill', 'slope', 'ridge', 'dirt path', 'estate', 'built', 'built by hand', 'his home', 'one man'], tags: ['jose_fuentes', 'hillside_estate', 'makeshift_estate', 'authentic_broll'], weight: 10 },
  { keywords: ['rock', 'rocks', 'stone', 'retaining', 'rock bed', 'rock garden', 'garden bed', 'garden', 'landscap', 'weeded', 'plant', 'planted', 'flower', 'edge'], tags: ['rock_gardens', 'retaining_rocks', 'wooden_retaining_walls', 'green_slide', 'authentic_broll', 'hillside_estate'], weight: 9 },
  { keywords: ['slide', 'wooden slide', 'green slide', 'bolted', 'little wooden'], tags: ['green_slide', 'hillside_estate', 'authentic_broll'], weight: 10 },
  { keywords: ['toy car', 'toy cars', 'small cars', 'lined up', 'parked', 'miniature', 'plastic cars', 'row of'], tags: ['toy_cars', 'authentic_broll', 'hillside_estate'], weight: 10 },
  { keywords: ['clock', 'flamingo', 'pink', 'decorated', 'donated', 'found material', 'decoration'], tags: ['pink_flamingo_clock', 'authentic_broll', 'hillside_estate'], weight: 9 },
  { keywords: ['speaker', 'music', 'running quietly', 'one-room', 'one room', 'shelter built', 'inside it', 'hand built'], tags: ['shelter_interior', 'bed_and_salvage', 'walkthrough', 'hillside_estate'], weight: 8 },
  { keywords: ['tour', 'walk through', 'walkthrough', 'inside', 'interior', 'bed', 'room', 'window', 'door', 'ceiling', 'floor'], tags: ['shelter_tour', 'shelter_interior', 'walkthrough', 'bed_and_salvage', 'interior_micro_bed'], weight: 9 },
  { keywords: ['lockable', 'lock', 'private', 'key', 'privacy'], tags: ['lockable_door', 'shelter_interior', 'shelter_tour'], weight: 8 },

  // Freeway / Traffic / 118
  { keywords: ['freeway', '118', '1.18', 'sr-118', 'cars stacking', 'stacking up', 'traffic', 'drivers', 'highway', 'glenoaks', 'glen oaks', 'boulevard', 'overpass', 'underpass', 'shoulder'], tags: ['pacoima_118', 'freeway_overpass', 'wide_freeway_view', 'freeway_traffic_passing', 'victory_blvd_freeway'], weight: 10 },
  { keywords: ['below', 'above', 'looking down', 'look up', 'pull over', 'phones out', 'take in'], tags: ['wide_freeway_view', 'freeway_overpass', 'pacoima_118', 'freeway_traffic_passing'], weight: 7 },

  // Pacoima / Neighborhood
  { keywords: ['pacoima', 'neighborhood', 'community', 'local', 'corridor', 'strip mall', 'restaurant', 'taco', 'padilla', 'nathaniel', 'business', 'shop', 'store', 'parking'], tags: ['pacoima_businesses', 'strip_mall_corridor', 'commercial_corridor', 'pacoima_street', 'street_conditions'], weight: 9 },
  { keywords: ['backyard', 'fence', 'yard', 'property'], tags: ['backyard_fence', 'pacoima_fence', 'pacoima_street'], weight: 7 },

  // Stella Ponce / Grievance Side
  { keywords: ['stella', 'ponce', '88', 'elderly', 'old woman', 'resident', 'neighbor', 'other side', 'across', 'grievance', 'complaint', 'bicycle', 'bicycles', 'trash pile', 'junk', 'debris near'], tags: ['stella_ponce', 'bicycles_trash_pile', 'pacoima_fence', 'grievance_side', 'encampment_debris'], weight: 10 },
  { keywords: ['night', 'dark', 'after dark', 'evening', 'nighttime'], tags: ['night_encampment', 'pacoima_encampment'], weight: 7 },

  // Caltrans / Government / Sweeps
  { keywords: ['caltrans', 'state', 'agency', 'government', 'jurisdiction', 'right of way', 'right-of-way', 'no man', 'notice', 'vacate', 'eviction', 'official', 'owned by'], tags: ['caltrans_notice_to_vacate', 'eviction_notice', 'state_property', 'jurisdictional_gap', 'no_mans_land', 'caltrans_corridor', 'jurisdiction_standoff'], weight: 10 },
  { keywords: ['crew', 'crews', 'workers', 'cleanup crew', 'sweep', 'sweeping', 'clean up', 'remove', 'removal', 'machinery', 'bulldozer', 'equipment', 'protective suit', 'orange cone', 'cone', 'truck'], tags: ['caltrans_crews', 'encampment_sweep', 'heavy_machinery', 'removal_operations', 'city_sweeps', 'caltrans_city_cleaners', 'city_sanitation_crews', 'orange_cones', 'clean_up_trucks', 'protective_suits', 'sanitation_workers'], weight: 9 },
  { keywords: ['taken down', 'demolished', 'torn down', 'cleared', 'cleared out', 'dismantled', 'gone', 'evicted', 'forced', 'pushed out', 'displaced', 'enforcement'], tags: ['encampment_sweep', 'removal_operations', 'public_order_sweeps', 'street_clearance', 'city_sweeps'], weight: 9 },
  { keywords: ['ruling', 'supreme court', 'order', 'directive', 'law', 'legal', 'mandate', 'compliance', 'ordinance'], tags: ['encampment_notices', 'eviction_notice', 'state_property', 'caltrans_notice_to_vacate'], weight: 8 },
  { keywords: ['railroad', 'train', 'tracks', 'rail'], tags: ['railroad_tracks_debris', 'railroad_easement', 'caltrans_corridor'], weight: 8 },

  // Encampments / Homeless
  { keywords: ['encampment', 'camp', 'tent', 'tarp', 'sidewalk', 'unhoused', 'homeless', 'living outside', 'sleeps outside', 'rough sleeping', 'on the street', 'on street', 'under the overpass', 'under overpass', 'underpass', 'freeway camp'], tags: ['freeway_underpass_tents', 'corridor_tents', 'sidewalk_survival', 'sidewalk_tents', 'tarp_structures', 'california_encampment_broll', 'la_county_homelessness', 'pacoima_encampment', 'overpass_encampment', 'underpass_campsite'], weight: 9 },
  { keywords: ['debris', 'trash', 'rubbish', 'pile', 'waste', 'junk', 'mess', 'litter', 'dumped', 'discarded', 'garbage'], tags: ['encampment_debris', 'mass_debris_piles', 'encampment_rubbish', 'freeway_margin_debris', 'hillside_debris', 'business_trash', 'trash_dumpsters', 'trash_affecting_business', 'unresolved_cleanup'], weight: 7 },
  { keywords: ['older', 'aging', 'elderly', 'age', 'older man', 'older woman', 'in his 60s', 'sixties', 'tradesmen', 'craftsman', 'tradesman', 'laborer', 'worker', 'skilled'], tags: ['older_unhoused', 'corridor_tents', 'sidewalk_survival', 'persistent_homelessness', 'la_county_homelessness'], weight: 8 },

  // Pallet Homes / Shelter Villages
  { keywords: ['pallet', 'pallet home', 'tiny home', 'tiny house', 'modular', 'cabin', 'unit', 'village', 'interim', 'shelter village', 'north hollywood', 'north hollywood shelter'], tags: ['pallet_homes', 'pallet_tiny_homes', 'north_hollywood_shelter', 'modular_cabins', 'tiny_home_village', 'modular_shell', 'interim_shelter', 'village_walkway'], weight: 9 },
  { keywords: ['move', 'moving', 'moved', 'transition', 'left', 'leaving', 'relocated', 'shade', 'heat', 'summer', 'hot'], tags: ['north_hollywood_shelter', 'pallet_homes', 'victory_blvd_freeway', 'village_walkway', 'interim_shelter'], weight: 7 },

  // Portable Toilet / Sanitation Concept
  { keywords: ['portable toilet', 'portable bathroom', 'port-a-potty', 'porta potty', 'porta-potty', 'porta potty house', 'toilet conversion', 'sanitation', 'hygiene', 'shower', 'bathroom', 'plumbing', 'dignity'], tags: ['portable_toilet_conversion', 'porta_potty_house', 'port_a_potty_prototype', 'mobile_bathroom', 'shower_trailer', 'hygiene_sanitation', 'dignity_services', 'compact_living', 'micro_shelter_concept', 'plastic_tiny_home', 'sanitation_structure'], weight: 10 },

  // Viral / Media
  { keywords: ['viral', 'video', 'media', 'coverage', 'news', 'broadcast', 'fox', 'story', 'report', 'internet', 'social media', 'views', 'attention', 'fame', 'interview'], tags: ['viral_media_coverage', 'news_report', 'fox11_broadcast', 'wide_freeway_view', 'hillside_estate'], weight: 9 },
  { keywords: ['lease', 'bought', 'paid', 'money', 'fund', 'funding', 'dollar', 'donation', 'resource', 'support', 'help', 'charity', 'nothing changed', 'didn\'t help', 'still there'], tags: ['viral_media_coverage', 'hillside_estate', 'persistent_homelessness'], weight: 6 },

  // Emergency / Convention / Mass Shelter
  { keywords: ['convention', 'cot', 'emergency shelter', 'mass shelter', 'gymnasium', 'overflow', 'hundreds'], tags: ['convention_center_partitions', 'emergency_shelter_cots', 'institutional_shelter', 'city_shelter_capacity'], weight: 8 },

  // Colima / Mexico / Heritage
  { keywords: ['colima', 'mexico', 'mexican', 'immigrant', 'born in', 'heritage', 'culture', 'trade', 'landscape', 'horticulture', 'gardener', 'professional'], tags: ['jose_fuentes', 'rock_gardens', 'green_slide', 'authentic_broll', 'hillside_estate'], weight: 8 },

  // Abstract / Concept beats - thematic fallbacks
  { keywords: ['decade', 'years', 'time', 'long', 'months', 'history', 'past', 'been there', 'all this time'], tags: ['hillside_estate', 'authentic_broll', 'persistent_homelessness', 'california_encampment_broll'], weight: 5 },
  { keywords: ['look', 'looking', 'visible', 'view', 'see', 'seen', 'color', 'shape', 'beautiful', 'strange', 'odd', 'unusual', 'surprising', 'nobody', 'person'], tags: ['wide_freeway_view', 'hillside_estate', 'freeway_overpass', 'authentic_broll'], weight: 4 },
  { keywords: ['blueprint', 'budget', 'no money', 'alone', 'by himself', 'on his own', 'solo', 'without help', 'no help', 'nobody helped', 'by hand'], tags: ['jose_fuentes', 'hillside_estate', 'authentic_broll', 'makeshift_estate'], weight: 6 },
  { keywords: ['art', 'project', 'work', 'hundreds of hours', 'craftsmanship', 'detail', 'designed', 'created'], tags: ['rock_gardens', 'authentic_broll', 'hillside_estate', 'makeshift_estate', 'wooden_retaining_walls'], weight: 6 },
  { keywords: ['closing', 'end', 'final', 'last', 'conclusion', 'what happens', 'what happens next', 'remain', 'left behind', 'future', 'unknown', 'question'], tags: ['hillside_estate', 'wide_freeway_view', 'jose_fuentes', 'freeway_overpass', 'persistent_homelessness'], weight: 5 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Semantic scoring function
// Returns a score (higher = better match) for a clip given beat text
// ─────────────────────────────────────────────────────────────────────────────
function scoreBeatAgainstClip(beatText: string, clipTags: string[]): number {
  if (!clipTags || clipTags.length === 0) return 0;
  const lowerBeat = beatText.toLowerCase();
  let totalScore = 0;

  for (const entry of KEYWORD_TAG_MAP) {
    // Check if any keyword appears in the beat text
    const keywordHit = entry.keywords.some((kw) => lowerBeat.includes(kw));
    if (!keywordHit) continue;

    // Count how many of the entry's target tags appear in clip's tags
    const tagMatches = entry.tags.filter((t) => clipTags.includes(t)).length;
    if (tagMatches > 0) {
      totalScore += entry.weight * tagMatches;
    }
  }

  return totalScore;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chapter configs (callouts, layout themes, etc.)
// ─────────────────────────────────────────────────────────────────────────────
interface ChapterConfig {
  jsonFile: string;
  audioFile: string;
  title: string;
  themeColor: 'gold' | 'amber' | 'cyan' | 'crimson' | 'emerald' | 'slate' | 'white';
  thematicTags: string[]; // fallback tags when semantic score == 0
  introCallout: { type: any; line1: string; line2?: string };
  midCallout: { type: any; line1: string; line2?: string };
}

const CHAPTER_CONFIGS: Record<number, ChapterConfig> = {
  1: {
    jsonFile: '01_1 - COLD.json',
    audioFile: '1 - COLD.mp3',
    title: 'Cold Open',
    themeColor: 'gold',
    thematicTags: ['jose_fuentes', 'hillside_estate', 'toy_cars', 'pink_flamingo_clock', 'rock_gardens', 'green_slide', 'freeway_overpass', 'wide_freeway_view', 'pacoima_118', 'freeway_traffic_passing', 'makeshift_estate', 'authentic_broll'],
    introCallout: { type: 'editorial_lower_third', line1: 'GLENOAKS BLVD & SR-118', line2: 'PACOIMA, LOS ANGELES • 6:45 AM' },
    midCallout: { type: 'location_badge', line1: 'THE HILLSIDE ESTATE', line2: 'JOSE FUENTES • BUILT BY HAND' },
  },
  2: {
    jsonFile: '02_2 - THE GARDENER WITH NO GARDEN.json',
    audioFile: '2 - THE GARDENER WITH NO GARDEN.mp3',
    title: 'The Gardener With No Garden',
    themeColor: 'emerald',
    thematicTags: ['jose_fuentes', 'rock_gardens', 'green_slide', 'authentic_broll', 'hillside_estate', 'retaining_rocks', 'wooden_retaining_walls', 'makeshift_estate', 'california_encampment_broll'],
    introCallout: { type: 'editorial_lower_third', line1: 'JOSE FUENTES', line2: 'PROFESSIONAL LANDSCAPER • COLIMA, MEXICO' },
    midCallout: { type: 'odometer_stat', line1: 'HUNDREDS OF HOURS', line2: 'NO BLUEPRINT • NO BUDGET' },
  },
  3: {
    jsonFile: '03_3 - WHO AGES OUT ONTO A HILLSIDE.json',
    audioFile: '3 - WHO AGES OUT ONTO A HILLSIDE.mp3',
    title: 'Who Ages Out Onto A Hillside',
    themeColor: 'amber',
    thematicTags: ['older_unhoused', 'corridor_tents', 'sidewalk_survival', 'la_county_homelessness', 'california_encampment_broll', 'persistent_homelessness', 'jose_fuentes', 'hillside_estate'],
    introCallout: { type: 'editorial_lower_third', line1: 'LOS ANGELES COUNTY', line2: 'AGING TRADESMEN WITHOUT A SAFETY NET' },
    midCallout: { type: 'odometer_stat', line1: '50s, 60s & BEYOND', line2: 'THE SLOW MATH OF RISING RENT' },
  },
  4: {
    jsonFile: '04_4 - THE NEIGHBORS WHO CHOSE HIM.json',
    audioFile: '4 - THE NEIGHBORS WHO CHOSE HIM.mp3',
    title: 'The Neighbors Who Chose Him',
    themeColor: 'cyan',
    thematicTags: ['pacoima_businesses', 'strip_mall_corridor', 'commercial_corridor', 'pacoima_street', 'street_conditions', 'hillside_estate', 'pacoima_encampment'],
    introCallout: { type: 'editorial_lower_third', line1: 'TACO EL CANELO', line2: 'NATHANIEL PADILLA • STRIP MALL OWNER' },
    midCallout: { type: 'location_badge', line1: 'PACOIMA COMMUNITY', line2: 'MUTUAL GOODWILL • ZERO SWEEP REQUESTS' },
  },
  5: {
    jsonFile: '05_5 - THE OTHER SIDE OF THE SAME CORRIDOR.json',
    audioFile: '5 - THE OTHER SIDE OF THE SAME CORRIDOR.mp3',
    title: 'The Other Side Of The Same Corridor',
    themeColor: 'crimson',
    thematicTags: ['stella_ponce', 'bicycles_trash_pile', 'pacoima_fence', 'encampment_debris', 'grievance_side', 'night_encampment', 'pacoima_encampment', 'backyard_fence', 'encampment_rubbish'],
    introCallout: { type: 'editorial_lower_third', line1: 'STELLA PONCE (AGE 88)', line2: 'PACOIMA RESIDENT • THE OTHER SIDE OF 118' },
    midCallout: { type: 'odometer_stat', line1: 'YEARS OF GRIEVANCE', line2: 'CALTRANS SYSTEMIC ABSENCE' },
  },
  6: {
    jsonFile: '06_6 - VIRAL AND WHAT VIRALITY ACTUALLY BOUGHT HIM.json',
    audioFile: '6 - VIRAL, AND WHAT VIRALITY ACTUALLY BOUGHT HIM.mp3',
    title: 'Viral, And What Virality Actually Bought Him',
    themeColor: 'gold',
    thematicTags: ['viral_media_coverage', 'news_report', 'fox11_broadcast', 'wide_freeway_view', 'hillside_estate', 'pacoima_118', 'freeway_traffic_passing', 'makeshift_estate'],
    introCallout: { type: 'editorial_lower_third', line1: 'LOCAL MEDIA SENSATION', line2: 'MILLIONS OF SOCIAL MEDIA VIEWS' },
    midCallout: { type: 'odometer_stat', line1: 'VIRALITY VS LEASE', line2: 'ATTENTION IS NOT HOUSING' },
  },
  7: {
    jsonFile: '07_7 - CALTRANS AND THE AGENCY THAT WASNT THERE.json',
    audioFile: "7 - CALTRANS, AND THE AGENCY THAT WASN'T THERE.mp3",
    title: "Caltrans, And The Agency That Wasn't There",
    themeColor: 'slate',
    thematicTags: ['caltrans_notice_to_vacate', 'eviction_notice', 'caltrans_crews', 'orange_cones', 'state_property', 'jurisdictional_gap', 'no_mans_land', 'railroad_tracks_debris', 'mass_debris_piles', 'freeway_underpass_tents', 'concrete_highway_wall', 'encampment_sweep', 'caltrans_corridor', 'jurisdiction_standoff'],
    introCallout: { type: 'editorial_lower_third', line1: 'CALIFORNIA RIGHT-OF-WAY', line2: "THE JURISDICTIONAL NO-MAN'S LAND" },
    midCallout: { type: 'location_badge', line1: '3 LEVELS OF GOVERNMENT', line2: "EVERYONE'S LAND • NO ONE'S CASELOAD" },
  },
  8: {
    jsonFile: '08_8 - WHAT GETS TAKEN DOWN.json',
    audioFile: '8 - WHAT GETS TAKEN DOWN.mp3',
    title: 'What Gets Taken Down',
    themeColor: 'cyan',
    thematicTags: ['north_hollywood_shelter', 'pallet_homes', 'modular_cabins', 'pallet_tiny_homes', 'victory_blvd_freeway', 'village_walkway', 'lockable_door', 'interim_shelter', 'tiny_home_village', 'modular_shell', 'encampment_sweep', 'removal_operations'],
    introCallout: { type: 'editorial_lower_third', line1: 'SUMMER HEAT & SHIFT', line2: 'MOVING INTO THE SHADE' },
    midCallout: { type: 'location_badge', line1: 'NORTH HOLLYWOOD PALLET HOMES', line2: 'THE COST OF LEAVING COMMUNITY' },
  },
  9: {
    jsonFile: '09_9 - THE TOUR.json',
    audioFile: '9 - THE TOUR.mp3',
    title: 'The Tour',
    themeColor: 'amber',
    thematicTags: ['shelter_tour', 'shelter_interior', 'bed_and_salvage', 'walkthrough', 'jose_fuentes', 'hillside_estate', 'interior_micro_bed', 'lockable_door', 'authentic_broll'],
    introCallout: { type: 'editorial_lower_third', line1: 'INSIDE THE SHELTER', line2: 'A BED, A DOOR, RECLAIMED ACOUSTICS' },
    midCallout: { type: 'location_badge', line1: 'NOT A SPECTACLE', line2: 'A HOME BUILT WITH CARE' },
  },
  10: {
    jsonFile: '10_10 - THE WIDER ORDER CLOSING IN.json',
    audioFile: '10 - THE WIDER ORDER CLOSING IN.mp3',
    title: 'The Wider Order Closing In',
    themeColor: 'crimson',
    thematicTags: ['encampment_sweep', 'heavy_machinery', 'caltrans_city_cleaners', 'protective_suits', 'removal_operations', 'city_sweeps', 'city_sanitation_crews', 'encampment_notices', 'freeway_underpass_tents', 'public_order_sweeps', 'street_clearance', 'clean_up_trucks'],
    introCallout: { type: 'editorial_lower_third', line1: 'STATE ENFORCEMENT DIRECTIVE', line2: 'SUPREME COURT RULING & CLEARANCES' },
    midCallout: { type: 'location_badge', line1: 'LA FREEWAY CORRIDORS', line2: 'THE ENFORCEMENT WAVE CLOSING IN' },
  },
  11: {
    jsonFile: '11_11 - CLOSING.json',
    audioFile: '11 - CLOSING.mp3',
    title: 'Closing',
    themeColor: 'gold',
    thematicTags: ['jose_fuentes', 'hillside_estate', 'pacoima_118', 'rock_gardens', 'wide_freeway_view', 'freeway_overpass', 'toy_cars', 'pink_flamingo_clock', 'makeshift_estate', 'authentic_broll', 'green_slide'],
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

async function stageSemanticTimelines() {
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('🎬 SEMANTIC BEAT-AWARE TIMELINE STAGING — PORTABLE TOILETS (CH 1–11)');
  console.log('═══════════════════════════════════════════════════════════════════════');
  console.log('✨ Beat text → visual tag scoring (semantic matching)');
  console.log('✨ Zero-repeat rule enforced across all 11 chapters');
  console.log('✨ Thematic fallback when no semantic match exists\n');

  const manifest = loadProjectManifest(PROJECT_ID);
  const approvedClips = manifest.clips.filter((c) => c.status === 'approved');
  console.log(`🎥 Approved clip pool: ${approvedClips.length} clips\n`);

  // Global set to track used filenames (zero-repeat across all chapters)
  const usedFilenames = new Set<string>();

  // Pre-score tracker for logging
  let totalSemanticHits = 0;
  let totalThematicFallbacks = 0;
  let totalExhaustedFallbacks = 0;

  for (let chNum = 1; chNum <= 11; chNum++) {
    const config = CHAPTER_CONFIGS[chNum]!;
    const numStr = String(chNum).padStart(2, '0');
    const jsonPath = path.join(TRANSCRIPTS_DIR, config.jsonFile);
    const audioPath = path.resolve(REPO_ROOT, 'uploads/audio', config.audioFile);

    if (!fs.existsSync(jsonPath)) {
      console.warn(`⚠️ Transcript not found: ${config.jsonFile}`);
      continue;
    }
    if (!fs.existsSync(audioPath)) {
      console.warn(`⚠️ Audio not found: ${config.audioFile}`);
      continue;
    }

    const transcriptData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const segments: AlignmentSegment[] = transcriptData.segments || [];
    const beats = groupSegmentsIntoBeats(segments);
    const totalDuration = beats[beats.length - 1]?.end || 60;

    console.log(`\n─────────────────────────────────────────────────────────────────────`);
    console.log(`🎬 Chapter ${numStr}: "${config.title}" — ${beats.length} beats, ${totalDuration.toFixed(1)}s`);
    console.log(`─────────────────────────────────────────────────────────────────────`);

    const clips: TimelineClip[] = [];

    for (let bIdx = 0; bIdx < beats.length; bIdx++) {
      const beat = beats[bIdx]!;
      const clipDuration = Number((beat.end - beat.start).toFixed(2));

      // ── STEP 1: Score all unused approved clips against this beat's text ──
      let bestClip: typeof approvedClips[0] | null = null;
      let bestScore = -1;

      for (const clip of approvedClips) {
        if (usedFilenames.has(clip.filename)) continue;
        const score = scoreBeatAgainstClip(beat.text, clip.tags || []);
        if (score > bestScore) {
          bestScore = score;
          bestClip = clip;
        }
      }

      let matchType = 'semantic';

      // ── STEP 2: If score == 0, try thematic tags fallback ──
      if (!bestClip || bestScore === 0) {
        matchType = 'thematic_fallback';
        // Pick unused clip whose tags overlap with chapter thematic tags
        for (const clip of approvedClips) {
          if (usedFilenames.has(clip.filename)) continue;
          const hasThematicTag = (clip.tags || []).some((t) => config.thematicTags.includes(t));
          if (hasThematicTag) {
            bestClip = clip;
            break;
          }
        }
      }

      // ── STEP 3: Last resort — any unused clip ──
      if (!bestClip) {
        matchType = 'exhausted_fallback';
        bestClip = approvedClips.find((c) => !usedFilenames.has(c.filename)) || null;
      }

      if (!bestClip) {
        console.error(`❌ CRITICAL: No clips left at Chapter ${chNum} Beat ${bIdx + 1}!`);
        throw new Error('Clip pool exhausted!');
      }

      usedFilenames.add(bestClip.filename);

      // Track stats
      if (matchType === 'semantic') totalSemanticHits++;
      else if (matchType === 'thematic_fallback') totalThematicFallbacks++;
      else totalExhaustedFallbacks++;

      const scoreLabel = bestScore > 0 ? `score=${bestScore}` : matchType;
      console.log(`  Beat ${String(bIdx + 1).padStart(2, '0')} [${scoreLabel}] "${beat.text.slice(0, 55).trim()}..." → ${bestClip.filename}`);

      // ── Build callout ──
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

      // ── Layout selection ──
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
          title: 'JOSE FUENTES DOCUMENTARY',
          subtitle: 'PACOIMA, LOS ANGELES',
        };
      }

      // ── Transitions ──
      const transitions: TransitionType[] = ['crossfade', 'film_burn', 'luma_fade', 'blur_dissolve'];
      const transition = transitions[bIdx % transitions.length]!;

      clips.push({
        id: `ch${numStr}_beat_${bIdx + 1}`,
        mediaType: 'video',
        clipPath: bestClip.fullPath.replace(/\\/g, '/'),
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
    console.log(`  ✅ Saved: chapter_${numStr}.json (${clips.length} clips)`);

    // Update chaptersStore
    const projectChapters = chaptersStore.forProject(PROJECT_ID);
    const targetChapter = projectChapters.find((c) => c.chapterIndex === chNum);
    if (targetChapter) {
      chaptersStore.update(PROJECT_ID, targetChapter.id, {
        status: 'ready_to_render',
        timelineJson: timeline,
      });
      console.log(`  ✅ chaptersStore updated: ${targetChapter.title} → ready_to_render`);
    } else {
      console.warn(`  ⚠️ Chapter index ${chNum} not found in chaptersStore`);
    }
  }

  // Save registry
  fs.writeFileSync(
    REGISTRY_PATH,
    JSON.stringify({
      projectId: PROJECT_ID,
      strictRule: 'NEVER_REPEAT_ANYWHERE',
      lockedCount: usedFilenames.size,
      lockedClips: Array.from(usedFilenames),
      updatedAt: new Date().toISOString(),
    }, null, 2),
    'utf-8'
  );

  console.log('\n═══════════════════════════════════════════════════════════════════════');
  console.log(`🎉 ALL 11 CHAPTERS STAGED WITH SEMANTIC BEAT MATCHING!`);
  console.log(`📊 Semantic matches: ${totalSemanticHits}`);
  console.log(`📊 Thematic fallbacks: ${totalThematicFallbacks}`);
  console.log(`📊 Last-resort fallbacks: ${totalExhaustedFallbacks}`);
  console.log(`🔒 Total unique clips locked: ${usedFilenames.size}`);
  console.log(`\n🌐 Review timelines at: http://localhost:3000/project/${PROJECT_ID}`);
  console.log(`📁 Timelines saved to: uploads/timelines/portable-toilets/`);
  console.log(`\n⚠️  DO NOT render yet — review in dashboard first!`);
  console.log('═══════════════════════════════════════════════════════════════════════\n');
}

stageSemanticTimelines().catch((err) => {
  console.error('❌ Semantic staging failed:', err);
  process.exit(1);
});
