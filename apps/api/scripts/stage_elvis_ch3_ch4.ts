import fs from 'fs';
import path from 'path';
import {
  RAW_DIR,
  AUD_DIR,
  buildSentenceLockedBeats,
  SentenceLockedBeat,
} from './elvis_director_utils';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import type {
  Timeline,
  TimelineClip,
  SceneLayoutType,
  CalloutOverlay,
  OverlayType,
  TransitionType,
  SceneLayoutData,
} from '@repo/shared';

// Ensure output directories exist
const TIMELINES_DIR_APPS = path.resolve(process.cwd(), 'apps/api/uploads/timelines/elvis');
const TIMELINES_DIR_ROOT = path.resolve(process.cwd(), 'uploads/timelines/elvis');
fs.mkdirSync(TIMELINES_DIR_APPS, { recursive: true });
fs.mkdirSync(TIMELINES_DIR_ROOT, { recursive: true });

// SFX directory
const SFX_DIR = path.resolve(process.cwd(), 'packages/remotion-video/public/sfx');
const getSfx = (name: string): string | null => {
  const p = path.join(SFX_DIR, name);
  return fs.existsSync(p) ? p : null;
};

// Helper to resolve RAW clip path with validation
function resolveRawAsset(filename: string): { clipPath: string; mediaType: 'video' | 'image' } {
  const full = path.join(RAW_DIR, filename);
  if (!fs.existsSync(full)) {
    throw new Error(`CRITICAL ERROR: Asset does not exist: "${full}"`);
  }
  const isImage = /\.(png|jpe?g|webp)$/i.test(filename);
  return {
    clipPath: full,
    mediaType: isImage ? 'image' : 'video',
  };
}

interface BeatPlanTemplate {
  asset: string;
  layout: SceneLayoutType;
  layoutData?: SceneLayoutData;
  callout?: CalloutOverlay;
  transitionType?: TransitionType;
  overlay?: OverlayType;
  sfx?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 3 DIRECTOR PLAN (27 Beats)
// ─────────────────────────────────────────────────────────────────────────────
const CH3_DIRECTOR_PLAN: BeatPlanTemplate[] = [
  // Beat 0: 0.00 -> 5.28s (5.28s) "The video didn't just get views, it got a response nobody could have modeled ahead of time."
  {
    asset: 'Elvis elevation.mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'odometer_stat',
      line1: '5,500,000+ VIEWS',
      line2: 'GLOBAL YOUTUBE IMPACT',
      spokenTrigger: "The video didn't just get views",
      themeColor: 'amber',
    },
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
    sfx: 'subtle_hit.mp3',
  },
  // Beat 1: 5.28 -> 9.94s (4.66s) "Within days, his inbox was full. Carpenters offering weekends,"
  {
    asset: 'Elvis glimpse.mp4',
    layout: 'ambient_blur_frame',
    callout: {
      type: 'newspaper_headline',
      line1: 'YOUTUBE PHENOMENON: ELVIS SUMMERS SPURS GLOBAL DONATIONS',
      line2: 'COMMUNITY MOBILIZATION',
      spokenTrigger: 'Within days, his inbox was full',
      themeColor: 'gold',
    },
    transitionType: 'shutter_flash',
    overlay: 'film_dust_scratches',
    sfx: 'camera_shutter.mp3',
  },
  // Beat 2: 9.94 -> 14.40s (4.46s) "retired contractors offering leftover materials, homeless outreach"
  {
    asset: 'elvis buiding house .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 3: 14.40 -> 19.00s (4.60s) "workers offering to help him find the next person who needed a door that locked."
  {
    asset: 'Elvis wallkig to but=ld house .mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'OUTREACH DISPATCH',
      subtitle: 'FIELD MOBILIZATION',
      tag: 'COMMUNITY ALLIANCE',
    },
    transitionType: 'cut',
    overlay: 'archival_halftone_paper',
    sfx: 'paper_slide.mp3',
  },
  // Beat 4: 19.00 -> 23.76s (4.76s) "Kids as young as six were asking their parents if they could help build one too."
  {
    asset: 'Person walkng around houses build by elvis .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'crossfade',
    overlay: 'cinematic_vignette',
  },
  // Beat 5: 23.76 -> 27.62s (3.86s) "He launched a fundraiser called Tiny House Huge Purpose."
  {
    asset: 'Elvis elevation.mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'split_milestone_card',
      line1: 'FROM $450 TO $100K',
      line2: 'VOLUNTEER POWER',
      spokenTrigger: 'fundraiser called Tiny House Huge Purpose',
      themeColor: 'amber',
    },
    transitionType: 'cut',
    overlay: 'micro_film_grain',
    sfx: 'stat_click.mp3',
  },
  // Beat 6: 27.62 -> 31.34s (3.72s) "It crossed $60 ,000, almost immediately,"
  {
    asset: 'elvis showing house .mp4',
    layout: 'vintage_crt_monitor',
    callout: {
      type: 'odometer_stat',
      line1: '$100,000+ RAISED IN DAYS',
      line2: 'TINY HOUSE HUGE PURPOSE',
      spokenTrigger: 'crossed $60,000',
      themeColor: 'amber',
    },
    transitionType: 'film_burn',
    overlay: 'vintage_crt_scanlines',
    sfx: 'stat_click.mp3',
  },
  // Beat 7: 31.34 -> 35.02s (3.68s) "funded by people who had never met Smoky, never met Elvis,"
  {
    asset: 'ELVIS PHOTO.mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'GLOBAL SUPPORTERS',
      subtitle: 'GRASSROOTS SOLIDARITY',
      tag: 'CITIZEN AID',
    },
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 8: 35.02 -> 38.52s (3.50s) "and would probably never see the finished houses in person."
  {
    asset: 'Person walkng around houses build by elvis .mp4',
    layout: 'ambient_blur_frame',
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
  },
  // Beat 9: 38.52 -> 42.16s (3.64s) "They just wanted to be part of fixing something that had,"
  {
    asset: 'elvis buiding house .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'crossfade',
    overlay: 'micro_film_grain',
  },
  // Beat 10: 42.16 -> 46.20s (4.04s) "until that week, felt completely unfixable. Over"
  {
    asset: 'Elvis elevation.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 11: 46.20 -> 50.08s (3.88s) "the months that followed, summers and the volunteers who kept showing up,"
  {
    asset: 'Elvis wallkig to but=ld house .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'shutter_flash',
    overlay: 'micro_film_grain',
    sfx: 'whoosh_air.mp3',
  },
  // Beat 12: 50.08 -> 54.14s (4.06s) "built and gave away 37 of these houses across Los Angeles."
  {
    asset: 'Person walkng around houses build by elvis .mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'odometer_stat',
      line1: '37 TINY HOMES BUILT',
      line2: 'LOS ANGELES SIDEWALKS',
      spokenTrigger: '37 of these houses',
      themeColor: 'amber',
    },
    transitionType: 'film_dip_black',
    overlay: 'cinematic_vignette',
    sfx: 'stat_click.mp3',
  },
  // Beat 13: 54.14 -> 58.22s (4.08s) "Each version got a little better than the last, solar"
  {
    asset: 'Wide lense view of TIny home.png',
    layout: 'forensic_drafting_table',
    layoutData: {
      title: 'ITERATIVE DESIGN',
      subtitle: 'CONTINUOUS ENGINEERING',
      tag: 'BLUEPRINT REVISION',
    },
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 14: 58.22 -> 62.56s (4.34s) "panels for a light at night, steel reinforced doors, smoke detectors,"
  {
    asset: 'Tinu Hose build by ELVIS.mp4',
    layout: 'forensic_drafting_table',
    layoutData: {
      title: 'SPECIFICATION: SOLAR & STEEL',
      subtitle: 'OFF-GRID AUTONOMY',
      tag: 'ARCHITECTURAL TELEMETRY',
    },
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 15: 62.56 -> 66.74s (4.18s) "window alarms, a small camping toilet, vents cut into the"
  {
    asset: 'Door of tiny home.png',
    layout: 'desktop_corkboard',
    layoutData: {
      title: 'SAFETY HARDWARE',
      subtitle: 'LIFE SAFETY & SECURITY',
      tag: 'EQUIPMENT AUDIT',
    },
    transitionType: 'cut',
    overlay: 'archival_halftone_paper',
  },
  // Beat 16: 66.74 -> 70.96s (4.22s) "roof line so the inside wouldn't turn into an oven in the California heat."
  {
    asset: 'Wide lense view of TIny home.png',
    layout: 'forensic_drafting_table',
    layoutData: {
      title: 'PASSIVE VENTILATION',
      subtitle: 'CALIFORNIA THERMAL REGULATION',
      tag: 'STRUCTURAL SCHEMATICS',
    },
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 17: 70.96 -> 75.70s (4.74s) "The cost per house settled around $1 ,200, bright paint,"
  {
    asset: 'Tinu Hose build by ELVIS.mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'UNIT BUDGET: $1,200',
      subtitle: 'MATERIAL BILL OF QUANTITIES',
      tag: 'DIRECT EXPENDITURE',
    },
    transitionType: 'cut',
    overlay: 'archival_halftone_paper',
  },
  // Beat 18: 75.70 -> 80.78s (5.08s) "wheels, so they qualified as mobile structures rather than permanent ones."
  {
    asset: 'Wide lense view of TIny home.png',
    layout: 'full_bleed_cinematic',
    transitionType: 'crossfade',
    overlay: 'cinematic_vignette',
  },
  // Beat 19: 80.78 -> 84.74s (3.96s) "And every single one came with the one thing a tent can"
  {
    asset: 'elvis showing house .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 20: 84.74 -> 88.64s (3.90s) "never really provide. A door somebody else can't just walk through."
  {
    asset: 'Door of tiny home.png',
    layout: 'open_case_binder',
    layoutData: {
      title: 'SANCTUARY DEADBOLT',
      subtitle: 'BARRIER TO INVASION',
      tag: 'HUMAN DIGNITY',
    },
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
    sfx: 'subtle_hit.mp3',
  },
  // Beat 21: 88.64 -> 92.48s (3.84s) "For the people living through it, the difference is hard to overstate."
  {
    asset: 'Elvis glimpse.mp4',
    layout: 'ambient_blur_frame',
    transitionType: 'crossfade',
    overlay: 'micro_film_grain',
  },
  // Beat 22: 92.48 -> 96.24s (3.76s) "Having four solid walls meant being able to actually"
  {
    asset: 'Person walkng around houses build by elvis .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 23: 96.24 -> 100.34s (4.10s) "sleep instead of staying half alert all night listening for footsteps."
  {
    asset: 'Person walkng around houses build by elvis .mp4',
    layout: 'ambient_blur_frame',
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
  },
  // Beat 24: 100.34 -> 105.52s (5.18s) "It meant belongings didn't disappear while you were away trying to find food or work."
  {
    asset: 'elvis buiding house .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 25: 105.52 -> 109.40s (3.88s) "It meant for the first time in a long time being able"
  {
    asset: 'Elvis elevation.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'crossfade',
    overlay: 'cinematic_vignette',
  },
  // Beat 26: 109.40 -> 113.08s (3.68s) "to think about next month instead of just getting through tonight."
  {
    asset: 'elvis showing house .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'film_dip_black',
    overlay: 'micro_film_grain',
    sfx: 'whoosh_cinematic.mp3',
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 4 DIRECTOR PLAN (41 Beats)
// ─────────────────────────────────────────────────────────────────────────────
const CH4_DIRECTOR_PLAN: BeatPlanTemplate[] = [
  // Beat 0: 0.00 -> 4.30s (4.30s) "Not every story wrapped up as quickly as smokies, summers kept building,"
  {
    asset: 'OLD WOMAN.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 1: 4.30 -> 9.26s (4.96s) "and one of the people he was trying to reach was a young woman named Raven, who had been"
  {
    asset: 'Elvis elevation.mp4',
    layout: 'ambient_blur_frame',
    transitionType: 'shutter_flash',
    overlay: 'micro_film_grain',
    sfx: 'camera_shutter.mp3',
  },
  // Beat 2: 9.26 -> 14.34s (5.08s) "in and out of homelessness for most of her life after leaving a violent home at 13."
  {
    asset: 'Elvis talking to a woman .mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'archival_evidence_tag',
      line1: "SUBJECT: IRENE 'RAVEN'",
      line2: 'SOUTH LOS ANGELES',
      spokenTrigger: 'young woman named Raven',
      themeColor: 'gold',
    },
    transitionType: 'cut',
    overlay: 'archival_halftone_paper',
    sfx: 'paper_slide.mp3',
  },
  // Beat 3: 14.34 -> 18.78s (4.44s) "When the city had forced an earlier round of tiny houses off the street,"
  {
    asset: 'WOMAN POLICE.mp4',
    layout: 'vintage_crt_monitor',
    layoutData: {
      title: 'MUNICIPAL DISPLACEMENT',
      subtitle: 'STREET ORDINANCE 56.11',
      tag: 'ENFORCEMENT RECORD',
    },
    transitionType: 'cut',
    overlay: 'vintage_crt_scanlines',
  },
  // Beat 4: 18.78 -> 23.92s (5.14s) "Raven lost hers and ended up back on the ground, this time sleeping near a"
  {
    asset: 'woman sittin inside the tent.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'crossfade',
    overlay: 'cinematic_vignette',
  },
  // Beat 5: 23.92 -> 28.98s (5.06s) "busy freeway on ramp, sharing a small informal camp with a handful of other women."
  {
    asset: 'Tents in the sidewalk.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 6: 28.98 -> 33.86s (4.88s) "City cleanup crews came through regularly. Advanced notice was posted,"
  {
    asset: 'poeple cleaning.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
  },
  // Beat 7: 33.86 -> 38.78s (4.92s) "but not everyone saw it in time, and when the crews arrived to anything left behind,"
  {
    asset: 'WOMAN POLICE.mp4',
    layout: 'ambient_blur_frame',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 8: 38.78 -> 42.46s (3.68s) "tents, blankets, the handful of possessions someone had"
  {
    asset: 'inside the tent.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 9: 42.46 -> 46.44s (3.98s) "managed to hold onto was treated as bulk trash and hauled away."
  {
    asset: 'poeple cleaning.mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'SEIZURE LOG: SWEEP REPORT',
      subtitle: 'CALTRANS & SANITATION',
      tag: 'STREET CLEARANCE',
    },
    transitionType: 'cut',
    overlay: 'archival_halftone_paper',
  },
  // Beat 10: 46.44 -> 51.02s (4.58s) "For a woman named Christine, who was working nights collecting recyclables"
  {
    asset: 'woman entering into the tent.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
  },
  // Beat 11: 51.02 -> 55.54s (4.52s) "to save toward an apartment, one of those sweeps meant an entire week's"
  {
    asset: 'A tent where woman is living.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 12: 55.54 -> 59.90s (4.36s) "worth of collected materials and the income that came with it disappeared in"
  {
    asset: 'TENT.mp4',
    layout: 'ambient_blur_frame',
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
  },
  // Beat 13: 59.90 -> 64.00s (4.10s) "under an hour. Raven's situation got harder before it got better."
  {
    asset: 'OLD WOMAN.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 14: 64.00 -> 68.46s (4.46s) "In the middle of all of it, she found out she was pregnant. Summers"
  {
    asset: 'old woman talking.mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'CASE NOTE: PRENATAL CRISIS',
      subtitle: 'VULNERABILITY RECORD',
      tag: 'URGENT INTERVENTION',
    },
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 15: 68.46 -> 72.52s (4.06s) "already stretched building for other people, made her house a priority."
  {
    asset: 'elvis buiding house .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'shutter_flash',
    overlay: 'micro_film_grain',
    sfx: 'camera_shutter.mp3',
  },
  // Beat 16: 72.52 -> 77.04s (4.52s) "He tracked down a quiet industrial side street, the city's cleanup"
  {
    asset: 'SHowing LOS ANGELS IN MAP.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 17: 77.04 -> 81.54s (4.50s) "routes were less likely to reach and got a small crew together to finish it fast."
  {
    asset: 'Elvis wallkig to but=ld house .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 18: 81.54 -> 86.90s (5.36s) "He added a detail that had nothing to do with function and everything to do with morale,"
  {
    asset: 'Tinu Hose build by ELVIS.mp4',
    layout: 'forensic_drafting_table',
    callout: {
      type: 'forensic_data_card',
      line1: 'SANCTUARY SPECS: 64 SQ FT',
      line2: 'SOLAR LIGHT • BRASS DEADBOLT',
      spokenTrigger: 'detail that had nothing to do with function',
      themeColor: 'cyan',
    },
    transitionType: 'cut',
    overlay: 'micro_film_grain',
    sfx: 'stat_click.mp3',
  },
  // Beat 19: 86.90 -> 91.60s (4.70s) "a hand -painted night sky on the inside ceiling so that lying"
  {
    asset: 'Door of tiny home.png',
    layout: 'ambient_blur_frame',
    transitionType: 'crossfade',
    overlay: 'cinematic_vignette',
  },
  // Beat 20: 91.60 -> 96.32s (4.72s) "down inside it felt a little bit like looking up at stars instead of a blue tarp."
  {
    asset: 'inside the tent.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 21: 96.32 -> 100.02s (3.70s) "When the house was finally delivered, Raven said it plainly."
  {
    asset: 'woman thanking elvis.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 22: 100.02 -> 104.50s (4.48s) "It wasn't just a place to sleep, it was the first private space she'd"
  {
    asset: 'OLD WOMAN HAPPY AFTER SEEING HIS TINY HOME.mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'editorial_quote',
      line1: 'For the first time in 10 years, I could lock my door.',
      line2: "IRENE 'RAVEN'",
      spokenTrigger: "It wasn't just a place to sleep",
      themeColor: 'amber',
    },
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
    sfx: 'subtle_hit.mp3',
  },
  // Beat 23: 104.50 -> 109.10s (4.60s) "had in longer than she could remember at the exact moment she needed one most."
  {
    asset: 'woman thanking elvis.mp4',
    layout: 'ambient_blur_frame',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 24: 109.10 -> 113.14s (4.04s) "For a lot of the women's summers was trying to reach, the alternative"
  {
    asset: 'Elvis talking to a woman .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'crossfade',
    overlay: 'micro_film_grain',
  },
  // Beat 25: 113.14 -> 117.08s (3.94s) "to a tiny house wasn't a shelter bed. It was Skid Row,"
  {
    asset: 'SHowing LOS ANGELS IN MAP.mp4',
    layout: 'vintage_crt_monitor',
    layoutData: {
      title: 'TERRITORIAL SURVEY',
      subtitle: 'SKID ROW // 50 BLOCKS DOWNTOWN LA',
      tag: 'DOWNTOWN CORRIDOR',
    },
    transitionType: 'cut',
    overlay: 'vintage_crt_scanlines',
  },
  // Beat 26: 117.08 -> 121.74s (4.66s) "a roughly 50 block stretch of downtown Los Angeles that outreach"
  {
    asset: 'Tents in the sidewalk.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 27: 121.74 -> 126.66s (4.92s) "workers who've spent decades there, describe as unlike anything else in the country."
  {
    asset: 'andy talking to homeless perople.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 28: 126.66 -> 131.44s (4.78s) "More than 2 ,000 people packed into that stretch on any given night."
  {
    asset: 'Tents in the sidewalk.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
  },
  // Beat 29: 131.44 -> 136.54s (5.10s) "People running outreach there talk about rats moving through tents while people sleep"
  {
    asset: 'Person named ANdy BALES.mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'ANDY BALES // UNION RESCUE MISSION',
      subtitle: 'SKID ROW SHELTER CRISIS',
      tag: 'OUTREACH TESTIMONY',
    },
    transitionType: 'cut',
    overlay: 'archival_halftone_paper',
  },
  // Beat 30: 136.54 -> 141.34s (4.80s) "about the constant low hum of danger that means nobody really rests."
  {
    asset: 'inside the tent.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 31: 141.34 -> 145.60s (4.26s) "About assault and theft being common enough that staying alert through"
  {
    asset: 'woman sittin inside the tent.mp4',
    layout: 'ambient_blur_frame',
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
  },
  // Beat 32: 145.60 -> 149.56s (3.96s) "the night becomes its own kind of exhausting, unpaid job."
  {
    asset: 'woman entering into the tent.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 33: 149.56 -> 154.16s (4.60s) "For women in particular, that danger is sharper. It's part"
  {
    asset: 'OLD WOMAN.mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'WOMEN IN CRISIS',
      subtitle: 'STREET VULNERABILITY REPORT',
      tag: 'HUMAN SECURITY',
    },
    transitionType: 'cut',
    overlay: 'archival_halftone_paper',
  },
  // Beat 34: 154.16 -> 158.58s (4.42s) "of why a locked door, even an eight -foot -long, wheeled plywood one,"
  {
    asset: 'Door of tiny home.png',
    layout: 'desktop_corkboard',
    layoutData: {
      title: 'BRASS DEADBOLT',
      subtitle: 'PRIMARY DEFENSE BARRIER',
      tag: 'SECURITY AUDIT',
    },
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
  },
  // Beat 35: 158.58 -> 163.16s (4.58s) "represents something closer to safety than shelter capacity numbers can"
  {
    asset: 'elvis showing house .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 36: 163.16 -> 167.52s (4.36s) "capture on a spreadsheet. That's the backdrop Raven's story sits against."
  {
    asset: 'old woman talking.mp4',
    layout: 'ambient_blur_frame',
    transitionType: 'cut',
    overlay: 'cinematic_vignette',
  },
  // Beat 37: 167.52 -> 171.86s (4.34s) "It's the backdrop every one of these 37 houses sits against."
  {
    asset: 'Person walkng around houses build by elvis .mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'crossfade',
    overlay: 'micro_film_grain',
  },
  // Beat 38: 171.86 -> 176.90s (5.04s) "A tiny house isn't a cure for homelessness, but for one specific person"
  {
    asset: 'Elvis elevation.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'cut',
    overlay: 'micro_film_grain',
  },
  // Beat 39: 176.90 -> 181.84s (4.94s) "on one specific night, it can be the difference between sleeping and not sleeping,"
  {
    asset: 'OLD WOMAN HAPPY AFTER SEEING HIS TINY HOME.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'shutter_flash',
    overlay: 'cinematic_vignette',
    sfx: 'camera_shutter.mp3',
  },
  // Beat 40: 181.84 -> 187.25s (5.41s) "between keeping your belongings and losing them, between staying safe and not."
  {
    asset: 'woman thanking elvis.mp4',
    layout: 'full_bleed_cinematic',
    transitionType: 'film_dip_black',
    overlay: 'micro_film_grain',
    sfx: 'whoosh_cinematic.mp3',
  },
];

export async function stageChapter3And4() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 DIRECTING & STAGING ELVIS: CHAPTER 3 & CHAPTER 4');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const project = projectsStore.all().find((p) => p.name.toLowerCase() === 'elvis');
  if (!project) {
    throw new Error('Project "Elvis" not found in localStore!');
  }

  // ───────────────────────────────────────────────────────────────────────────
  // STAGE CHAPTER 3
  // ───────────────────────────────────────────────────────────────────────────
  console.log('───────────────────────────────────────────────────────────────────');
  console.log('▶ Processing CHAPTER 3: "WHAT ONE VIDEO SET OFF"');
  console.log('───────────────────────────────────────────────────────────────────');

  const ch3TranscriptPath = path.resolve(
    process.cwd(),
    'apps/api/uploads/transcripts/elvis/03_3 - WHAT ONE VIDEO SET OFF.json'
  );
  const ch3Data = JSON.parse(fs.readFileSync(ch3TranscriptPath, 'utf-8'));
  const ch3AudioRel = 'uploads/audio/3 - WHAT ONE VIDEO SET OFF.mp3';
  const ch3Dur = 113.084; // Verified by ffprobe

  const ch3Beats = buildSentenceLockedBeats(ch3Data.segments, ch3Dur, 3.5, 5.4);
  console.log(`Generated ${ch3Beats.length} sentence-locked beats for Chapter 3.`);

  if (ch3Beats.length !== CH3_DIRECTOR_PLAN.length) {
    throw new Error(
      `Chapter 3 beat count mismatch: generated ${ch3Beats.length}, planned ${CH3_DIRECTOR_PLAN.length}`
    );
  }

  const ch3Clips: TimelineClip[] = [];
  for (let i = 0; i < ch3Beats.length; i++) {
    const b = ch3Beats[i]!;
    const plan = CH3_DIRECTOR_PLAN[i]!;
    const { clipPath, mediaType } = resolveRawAsset(plan.asset);

    // Validate duration
    if (b.duration < 3.5 || b.duration > 5.45) {
      throw new Error(`Beat ${i} duration ${b.duration}s violates pacing rule (3.5s <= dur <= 5.45s)!`);
    }

    ch3Clips.push({
      beatIndex: i,
      chapterIndex: 3,
      text: b.text,
      startTime: b.startTime,
      endTime: b.endTime,
      clipPath,
      mediaType,
      layout: plan.layout,
      layoutData: plan.layoutData,
      kenBurns: mediaType === 'image',
      transitionType: plan.transitionType || 'cut',
      transitionDuration: plan.transitionType === 'cut' ? 0 : 0.4,
      numberOverlays: [],
      callout: plan.callout || null,
      overlay: plan.overlay || 'micro_film_grain',
      sfxPath: plan.sfx ? getSfx(plan.sfx) : null,
      sfxVolume: 0.18,
    });
  }

  const ch3Timeline: Timeline = {
    masterAudioPath: ch3AudioRel,
    totalDuration: ch3Dur,
    clips: ch3Clips,
    outputPath: path.join(TIMELINES_DIR_APPS, 'chapter_03.json').replace(/\\/g, '/'),
  };

  const ch3OutApps = path.join(TIMELINES_DIR_APPS, 'chapter_03.json');
  const ch3OutRoot = path.join(TIMELINES_DIR_ROOT, 'chapter_03.json');
  fs.writeFileSync(ch3OutApps, JSON.stringify(ch3Timeline, null, 2), 'utf-8');
  fs.writeFileSync(ch3OutRoot, JSON.stringify(ch3Timeline, null, 2), 'utf-8');

  // Update chapter 3 in database
  const ch3Db = chaptersStore.forProject(project.id).find((c) => c.chapterIndex === 3);
  if (ch3Db) {
    chaptersStore.update(project.id, ch3Db.id, {
      status: 'staged',
      timelineJson: ch3Timeline as any,
      clipLibraryRoot: RAW_DIR,
    });
  }

  console.log(`✅ Chapter 3 Staged: ${ch3Clips.length} beats.`);
  console.log(`   Written to: ${ch3OutApps}`);
  console.log(`   Written to: ${ch3OutRoot}`);

  // ───────────────────────────────────────────────────────────────────────────
  // STAGE CHAPTER 4
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n───────────────────────────────────────────────────────────────────');
  console.log('▶ Processing CHAPTER 4: "RAVEN"');
  console.log('───────────────────────────────────────────────────────────────────');

  const ch4TranscriptPath = path.resolve(
    process.cwd(),
    'apps/api/uploads/transcripts/elvis/04_4 - RAVEN.json'
  );
  const ch4Data = JSON.parse(fs.readFileSync(ch4TranscriptPath, 'utf-8'));
  const ch4AudioRel = 'uploads/audio/4 - RAVEN.mp3';
  const ch4Dur = 187.246; // Verified by ffprobe

  const ch4Beats = buildSentenceLockedBeats(ch4Data.segments, ch4Dur, 3.5, 5.42);
  console.log(`Generated ${ch4Beats.length} sentence-locked beats for Chapter 4.`);

  if (ch4Beats.length !== CH4_DIRECTOR_PLAN.length) {
    throw new Error(
      `Chapter 4 beat count mismatch: generated ${ch4Beats.length}, planned ${CH4_DIRECTOR_PLAN.length}`
    );
  }

  const ch4Clips: TimelineClip[] = [];
  for (let i = 0; i < ch4Beats.length; i++) {
    const b = ch4Beats[i]!;
    const plan = CH4_DIRECTOR_PLAN[i]!;
    const { clipPath, mediaType } = resolveRawAsset(plan.asset);

    // Validate duration
    if (b.duration < 3.5 || b.duration > 5.45) {
      throw new Error(`Beat ${i} duration ${b.duration}s violates pacing rule (3.5s <= dur <= 5.45s)!`);
    }

    ch4Clips.push({
      beatIndex: i,
      chapterIndex: 4,
      text: b.text,
      startTime: b.startTime,
      endTime: b.endTime,
      clipPath,
      mediaType,
      layout: plan.layout,
      layoutData: plan.layoutData,
      kenBurns: mediaType === 'image',
      transitionType: plan.transitionType || 'cut',
      transitionDuration: plan.transitionType === 'cut' ? 0 : 0.4,
      numberOverlays: [],
      callout: plan.callout || null,
      overlay: plan.overlay || 'micro_film_grain',
      sfxPath: plan.sfx ? getSfx(plan.sfx) : null,
      sfxVolume: 0.18,
    });
  }

  const ch4Timeline: Timeline = {
    masterAudioPath: ch4AudioRel,
    totalDuration: ch4Dur,
    clips: ch4Clips,
    outputPath: path.join(TIMELINES_DIR_APPS, 'chapter_04.json').replace(/\\/g, '/'),
  };

  const ch4OutApps = path.join(TIMELINES_DIR_APPS, 'chapter_04.json');
  const ch4OutRoot = path.join(TIMELINES_DIR_ROOT, 'chapter_04.json');
  fs.writeFileSync(ch4OutApps, JSON.stringify(ch4Timeline, null, 2), 'utf-8');
  fs.writeFileSync(ch4OutRoot, JSON.stringify(ch4Timeline, null, 2), 'utf-8');

  // Update chapter 4 in database
  const ch4Db = chaptersStore.forProject(project.id).find((c) => c.chapterIndex === 4);
  if (ch4Db) {
    chaptersStore.update(project.id, ch4Db.id, {
      status: 'staged',
      timelineJson: ch4Timeline as any,
      clipLibraryRoot: RAW_DIR,
    });
  }

  console.log(`✅ Chapter 4 Staged: ${ch4Clips.length} beats.`);
  console.log(`   Written to: ${ch4OutApps}`);
  console.log(`   Written to: ${ch4OutRoot}`);

  // ───────────────────────────────────────────────────────────────────────────
  // COMPREHENSIVE VERIFICATION AUDIT
  // ───────────────────────────────────────────────────────────────────────────
  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('🔍 COMPREHENSIVE VERIFICATION & PACING AUDIT');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const chaptersToVerify = [
    { title: 'Chapter 3 (What One Video Set Off)', timeline: ch3Timeline },
    { title: 'Chapter 4 (Raven)', timeline: ch4Timeline },
  ];

  let totalViolations = 0;
  let totalMissingClips = 0;

  for (const c of chaptersToVerify) {
    console.log(`--- Verifying ${c.title} (${c.timeline.clips.length} beats) ---`);
    let minDur = 999;
    let maxDur = 0;

    c.timeline.clips.forEach((clip) => {
      const dur = Math.round((clip.endTime - clip.startTime) * 100) / 100;
      if (dur < minDur) minDur = dur;
      if (dur > maxDur) maxDur = dur;

      const pacingOk = dur >= 3.5 && dur <= 5.45;
      if (!pacingOk) {
        totalViolations++;
        console.error(`❌ PACING VIOLATION: Beat ${clip.beatIndex} duration = ${dur}s`);
      }

      if (!clip.clipPath || !fs.existsSync(clip.clipPath)) {
        totalMissingClips++;
        console.error(`❌ MISSING ASSET: Beat ${clip.beatIndex} path = ${clip.clipPath}`);
      }
    });

    console.log(`   Duration range: [${minDur.toFixed(2)}s, ${maxDur.toFixed(2)}s]`);
    console.log(`   Pacing Status: ${minDur >= 3.5 && maxDur <= 5.45 ? '✅ 100% COMPLIANT' : '❌ VIOLATION DETECTED'}`);
    console.log(`   Asset Status: All ${c.timeline.clips.length} clips exist on disk ✅\n`);
  }

  if (totalViolations > 0 || totalMissingClips > 0) {
    throw new Error(`Audit failed with ${totalViolations} pacing violations and ${totalMissingClips} missing clips.`);
  }

  console.log('🎉 AUDIT COMPLETE: 100% COMPLIANT WITH ZERO VIOLATIONS.');
}

if (require.main === module) {
  stageChapter3And4().catch((err) => {
    console.error('Fatal staging error:', err);
    process.exit(1);
  });
}
