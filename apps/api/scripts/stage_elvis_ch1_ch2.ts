import fs from 'fs';
import path from 'path';
import { buildSentenceLockedBeats, RAW_DIR, AUD_DIR } from './elvis_director_utils';
import type { Timeline, TimelineClip, SceneLayoutType, CalloutOverlay, OverlayType, TransitionType, SceneLayoutData } from '@repo/shared';
import { projectsStore, chaptersStore } from '../src/db/localStore';

// Paths
const REPO_ROOT = path.resolve(__dirname, '../../..');
const CH1_TRANSCRIPT_PATH = path.resolve(REPO_ROOT, 'uploads/transcripts/elvis/01_1 - open.json');
const CH2_TRANSCRIPT_PATH = path.resolve(REPO_ROOT, 'uploads/transcripts/elvis/02_2 -  THE MAN WHO COULDNT KEEP WALKING PAST.json');

const TIMELINE_DIR_APP = path.resolve(__dirname, '../uploads/timelines/elvis');
const TIMELINE_DIR_ROOT = path.resolve(REPO_ROOT, 'uploads/timelines/elvis');

fs.mkdirSync(TIMELINE_DIR_APP, { recursive: true });
fs.mkdirSync(TIMELINE_DIR_ROOT, { recursive: true });

// SFX directory
const SFX_DIR = path.resolve(REPO_ROOT, 'packages/remotion-video/public/sfx');
const SFX = {
  whoosh_cinematic: path.join(SFX_DIR, 'whoosh_cinematic.mp3'),
  whoosh_air: path.join(SFX_DIR, 'whoosh_air.mp3'),
  camera_shutter: path.join(SFX_DIR, 'camera_shutter.mp3'),
  paper_slide: path.join(SFX_DIR, 'paper_slide.mp3'),
  stat_click: path.join(SFX_DIR, 'stat_click.mp3'),
  subtle_hit: path.join(SFX_DIR, 'subtle_hit.mp3'),
};

interface DirectedSceneMetadata {
  rawFilename: string;
  layout: SceneLayoutType;
  layoutData?: SceneLayoutData;
  callout?: CalloutOverlay | null;
  overlay?: OverlayType;
  transition?: TransitionType;
  transitionDuration?: number;
  sfxPath?: string;
  sfxVolume?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 1 DIRECTED METADATA (24 beats)
// Assets strictly restricted to Chapter 1 list:
// 'Tents in the sidewalk.mp4', 'A tent where woman is living.mp4', 'inside the tent.mp4',
// 'SHowing LOS ANGELS IN MAP.mp4', 'OLD WOMAN.mp4', 'elvis buiding house .mp4', 'Door of tiny home.png'
// ─────────────────────────────────────────────────────────────────────────────
const CH1_DIRECTED: DirectedSceneMetadata[] = [
  // Beat 0 (0.00s -> 3.60s): 10 years on bare dirt
  {
    rawFilename: 'OLD WOMAN.mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'SOUTH LOS ANGELES',
      subtitle: "IRENE 'SMOKEY' MCGEE • AGE 60",
      tag: 'FIELD INTERVIEW',
      coords: 'SOUTH CENTRAL • LOS ANGELES',
    },
    callout: {
      type: 'odometer_stat',
      line1: '10 YEARS ON BARE DIRT',
      line2: 'SOUTH LOS ANGELES • 54TH & HOOVER',
      spokenTrigger: '10 years',
      themeColor: 'gold',
    },
    overlay: 'micro_film_grain',
    transition: 'film_dip_black',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_cinematic,
    sfxVolume: 0.18,
  },
  // Beat 1 (3.60s -> 7.34s): South Los Angeles location
  {
    rawFilename: 'SHowing LOS ANGELS IN MAP.mp4',
    layout: 'forensic_drafting_table',
    layoutData: {
      title: 'MUNICIPAL BOUNDARY',
      subtitle: 'SOUTH LOS ANGELES CORRIDOR',
      coords: '34.0522° N, 118.2437° W',
      stamp: 'LOCATION IDENTIFIER',
    },
    callout: {
      type: 'map_pingeotag',
      line1: 'SOUTH LOS ANGELES',
      line2: '54TH & HOOVER CORRIDOR',
      spokenTrigger: 'South Los Angeles',
      themeColor: 'amber',
    },
    overlay: 'camera_viewfinder_hud',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.camera_shutter,
    sfxVolume: 0.15,
  },
  // Beat 2 (7.34s -> 11.06s): Not even in a tent
  {
    rawFilename: 'Tents in the sidewalk.mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'newspaper_headline',
      line1: 'L.A. TIMES // 60-YEAR-OLD SLEEPS ON SIDEWALK',
      line2: 'UNSHELTERED POPULATION SURGES ACROSS SOUTH LA',
      spokenTrigger: 'not even in a tent',
      themeColor: 'crimson',
    },
    overlay: 'cinematic_vignette',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 3 (11.06s -> 15.22s): Just dirt, blanket, cold
  {
    rawFilename: 'inside the tent.mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'EXPOSURE CONDITIONS',
      subtitle: 'CRUDE SHELTER • DIRT & FABRIC',
      tag: 'SIDEWALK LIVING',
    },
    overlay: 'micro_film_grain',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_air,
    sfxVolume: 0.15,
  },
  // Beat 4 (15.22s -> 18.92s): Knew her name, knew her laugh
  {
    rawFilename: 'OLD WOMAN.mp4',
    layout: 'vintage_crt_monitor',
    layoutData: {
      title: 'NEIGHBORHOOD ARCHIVE',
      subtitle: "SUBJECT: IRENE 'SMOKEY' MCGEE",
      tag: 'LOCAL PRESENCE',
    },
    callout: {
      type: 'editorial_quote',
      line1: 'EVERYBODY ON THAT BLOCK KNEW HER NAME',
      line2: 'THEY KNEW HER LAUGH',
      spokenTrigger: 'knew her name',
      themeColor: 'gold',
    },
    overlay: 'vintage_crt_scanlines',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 5 (18.92s -> 22.68s): Kids waved on way to school
  {
    rawFilename: 'A tent where woman is living.mp4',
    layout: 'full_bleed_cinematic',
    overlay: 'cinematic_vignette',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.whoosh_air,
    sfxVolume: 0.15,
  },
  // Beat 6 (22.68s -> 26.62s): Like she was family
  {
    rawFilename: 'Tents in the sidewalk.mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'COMMUNITY REPORT',
      subtitle: '54TH & HOOVER STREET CORRIDOR',
      stamp: 'FIELD CASE FILE #01',
    },
    overlay: 'archival_halftone_paper',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 7 (26.62s -> 31.14s): Every night neighbors went inside
  {
    rawFilename: 'A tent where woman is living.mp4',
    layout: 'ambient_blur_frame',
    callout: {
      type: 'editorial_quote',
      line1: 'WAVE HELLO IN THE MORNING',
      line2: 'THEN WALK PAST IN THE EVENING',
      spokenTrigger: 'every single night',
      themeColor: 'slate',
    },
    overlay: 'micro_film_grain',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_cinematic,
    sfxVolume: 0.18,
  },
  // Beat 8 (31.14s -> 35.30s): Locked doors, turned on heaters
  {
    rawFilename: 'inside the tent.mp4',
    layout: 'full_bleed_cinematic',
    overlay: 'cinematic_vignette',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 9 (35.30s -> 40.04s): Not because cruel, entire country agreed
  {
    rawFilename: 'Tents in the sidewalk.mp4',
    layout: 'editorial_sidebar_column',
    layoutData: {
      title: 'SYSTEMIC COMPLACENCY',
      subtitle: 'THE NATIONAL NORM',
      tag: 'ANALYSIS',
    },
    callout: {
      type: 'newspaper_headline',
      line1: 'SOUTH LA COMMUNITY CHRONICLE',
      line2: 'WHAT AN ENTIRE COUNTRY HAS QUIETLY AGREED TO DO',
      spokenTrigger: 'entire country',
      themeColor: 'crimson',
    },
    overlay: 'micro_film_grain',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 10 (40.04s -> 44.70s): Wave hello in the morning
  {
    rawFilename: 'SHowing LOS ANGELS IN MAP.mp4',
    layout: 'forensic_drafting_table',
    layoutData: {
      title: 'REGIONAL OVERVIEW',
      subtitle: 'LOS ANGELES COUNTY • SKID ROW TO SOUTH LA',
      coords: '34.0522° N, 118.2437° W',
    },
    callout: {
      type: 'map_pingeotag',
      line1: 'SOUTH LOS ANGELES • 54TH & HOOVER',
      line2: 'UNSHELTERED RESIDENTS: 44,000+',
      spokenTrigger: 'Wave hello',
      themeColor: 'amber',
    },
    overlay: 'camera_viewfinder_hud',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.camera_shutter,
    sfxVolume: 0.15,
  },
  // Beat 11 (44.70s -> 48.76s): Walk past, let somebody else worry
  {
    rawFilename: 'Tents in the sidewalk.mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'editorial_quote',
      line1: 'LET SOMEBODY ELSE WORRY ABOUT IT',
      line2: 'THE UNWRITTEN COMPACT OF URBAN POVERTY',
      spokenTrigger: 'walk past in the evening',
      themeColor: 'slate',
    },
    overlay: 'cinematic_vignette',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.whoosh_air,
    sfxVolume: 0.15,
  },
  // Beat 12 (48.76s -> 52.62s): One guy was done walking past
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'THE TURNING POINT',
      subtitle: 'SOUTH LOS ANGELES RESIDENT ELVIS SUMMERS',
      badge: 'DIRECT ACTION',
    },
    callout: {
      type: 'newspaper_headline',
      line1: 'THE MAN WHO COULDNT KEEP WALKING PAST',
      line2: 'ONE NEIGHBOR DECIDES TO INTERVENE DIRECTLY',
      spokenTrigger: 'done walking past',
      themeColor: 'gold',
    },
    overlay: 'micro_film_grain',
    transition: 'zoom_punch',
    transitionDuration: 0.35,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 13 (52.62s -> 56.66s): No nonprofit, no grant
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'desktop_corkboard',
    layoutData: {
      title: 'GRASSROOTS INVENTORY',
      notes: ['NO 501(c)(3) NONPROFIT', 'NO GOVERNMENT GRANTS', 'ONE MAN WITH BASIC TOOLS'],
    },
    overlay: 'archival_halftone_paper',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 14 (56.66s -> 60.44s): $450 hardware store trip
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'editorial_sidebar_column',
    layoutData: {
      title: 'MATERIAL COST',
      subtitle: 'LOCAL HARDWARE PURCHASE',
    },
    callout: {
      type: 'odometer_stat',
      line1: '$450 HARDWARE TRIP',
      line2: 'PLYWOOD • 2x4 FRAMING • WHEELS • HARDWARE',
      spokenTrigger: '$450',
      themeColor: 'emerald',
    },
    overlay: 'micro_film_grain',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.stat_click,
    sfxVolume: 0.16,
  },
  // Beat 15 (60.44s -> 64.96s): Stubbornness not in city planning
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'vintage_crt_monitor',
    layoutData: {
      title: 'CITY PLANNING ARCHIVE',
      subtitle: 'STUBBORNNESS VS BUREAUCRACY',
      stamp: 'FIELD RECORD',
    },
    overlay: 'vintage_crt_scanlines',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_cinematic,
    sfxVolume: 0.18,
  },
  // Beat 16 (64.96s -> 69.60s): End of the week, Smokey
  {
    rawFilename: 'OLD WOMAN.mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: "IRENE 'SMOKEY' MCGEE",
      subtitle: '60-YEAR-OLD GRANDMOTHER',
      tag: 'FIRST RECIPIENT',
    },
    callout: {
      type: 'newspaper_headline',
      line1: 'L.A. TIMES // 60-YEAR-OLD SLEEPS ON SIDEWALK',
      line2: "NEIGHBORHOOD RALLIES AROUND IRENE 'SMOKEY' MCGEE",
      spokenTrigger: 'called her Smokey',
      themeColor: 'gold',
    },
    overlay: 'micro_film_grain',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 17 (69.60s -> 73.54s): Door that locked, roof that didn't leak
  {
    rawFilename: 'Door of tiny home.png',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'odometer_stat',
      line1: 'A DOOR THAT LOCKS',
      line2: 'WEATHERPROOF ROOF • SLIDING WINDOW',
      spokenTrigger: 'door that locked',
      themeColor: 'gold',
    },
    overlay: 'cinematic_vignette',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 18 (73.54s -> 77.76s): Hand-painted sign Home Sweet Home
  {
    rawFilename: 'Door of tiny home.png',
    layout: 'open_case_binder',
    layoutData: {
      title: 'ARTIFACT RECORD',
      subtitle: 'HAND-PAINTED EXTERIOR SIGN',
      stamp: 'HOME SWEET HOME',
    },
    overlay: 'archival_halftone_paper',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.camera_shutter,
    sfxVolume: 0.15,
  },
  // Beat 19 (77.76s -> 81.54s): Video watched more than 5.5M times
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'odometer_stat',
      line1: '5,500,000+ VIEWS',
      line2: 'VIRAL DOCUMENTARY TIME-LAPSE',
      spokenTrigger: 'watched more than',
      themeColor: 'gold',
    },
    overlay: 'micro_film_grain',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.stat_click,
    sfxVolume: 0.16,
  },
  // Beat 20 (81.54s -> 85.16s): 5.5 million times, story that came after
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'editorial_sidebar_column',
    layoutData: {
      title: 'VIRAL IMPACT',
      subtitle: 'WORLDWIDE ATTENTION',
    },
    callout: {
      type: 'newspaper_headline',
      line1: 'VIRAL BUILD SPARKS GLOBAL OUTCRY',
      line2: 'MILLIONS DEMAND ACTION FOR UNSHELTERED POPULATIONS',
      spokenTrigger: 'million times',
      themeColor: 'cyan',
    },
    overlay: 'cinematic_vignette',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.whoosh_cinematic,
    sfxVolume: 0.18,
  },
  // Beat 21 (85.16s -> 89.88s): What city did, next woman he tried to help
  {
    rawFilename: 'SHowing LOS ANGELS IN MAP.mp4',
    layout: 'forensic_drafting_table',
    layoutData: {
      title: 'BUREAUCRATIC BACKLASH',
      subtitle: 'LOS ANGELES CITY ATTORNEY & SANITATION',
      coords: 'LOS ANGELES CITY HALL',
    },
    callout: {
      type: 'map_pingeotag',
      line1: 'LOS ANGELES CITY HALL',
      line2: 'MUNICIPAL CODE ENFORCEMENT • SEIZURE ORDERS',
      spokenTrigger: 'what the city did',
      themeColor: 'crimson',
    },
    overlay: 'camera_viewfinder_hud',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.camera_shutter,
    sfxVolume: 0.15,
  },
  // Beat 22 (89.88s -> 93.88s): What thousands of ordinary people did
  {
    rawFilename: 'Tents in the sidewalk.mp4',
    layout: 'desktop_corkboard',
    layoutData: {
      title: 'THE CIVIL RESPONSE',
      notes: ['$100K+ CROWDFUNDED', 'COMMUNITY VOLUNTEERS', 'TINY HOMES FOR HOMELESS'],
    },
    overlay: 'archival_halftone_paper',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 23 (93.88s -> 98.80s): Part nobody talks about, better story
  {
    rawFilename: 'Door of tiny home.png',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'AMERICAN HIDEAWAYS',
      subtitle: 'CHAPTER 01: COLD OPEN',
      badge: 'DOCUSERIES',
    },
    callout: {
      type: 'editorial_quote',
      line1: "AND IT'S THE BETTER STORY",
      line2: 'AMERICAN HIDEAWAYS // ELVIS',
      spokenTrigger: 'better story',
      themeColor: 'gold',
    },
    overlay: 'cinematic_vignette',
    transition: 'film_dip_black',
    transitionDuration: 0.4,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 2 DIRECTED METADATA (32 beats)
// Assets strictly restricted to Chapter 2 list:
// 'ELVIS PHOTO.mp4', 'Elvis glimpse.mp4', 'Elvis elevation.mp4', 'Elvis wallkig to but=ld house .mp4',
// 'elvis buiding house .mp4', 'Tinu Hose build by ELVIS.mp4', 'Wide lense view of TIny home.png'
// ─────────────────────────────────────────────────────────────────────────────
const CH2_DIRECTED: DirectedSceneMetadata[] = [
  // Beat 0 (0.00s -> 3.68s): One man with a circular saw
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'newspaper_headline',
      line1: "CHAPTER 02: THE MAN WHO COULDN'T KEEP WALKING PAST",
      line2: 'ONE MAN WITH A CIRCULAR SAW',
      spokenTrigger: 'circular saw',
      themeColor: 'gold',
    },
    overlay: 'micro_film_grain',
    transition: 'film_dip_black',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_cinematic,
    sfxVolume: 0.18,
  },
  // Beat 1 (3.68s -> 7.48s): $2 billion city plan
  {
    rawFilename: 'Elvis elevation.mp4',
    layout: 'editorial_sidebar_column',
    layoutData: {
      title: 'THE MUNICIPAL PARADOX',
      subtitle: 'LOS ANGELES CITY HOUSING BUDGET',
    },
    callout: {
      type: 'odometer_stat',
      line1: '$2 BILLION CITY PLAN',
      line2: 'YEARS OF PLANNING // ZERO IMMEDIATE SHELTER',
      spokenTrigger: '$2 billion',
      themeColor: 'crimson',
    },
    overlay: 'cinematic_vignette',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.stat_click,
    sfxVolume: 0.16,
  },
  // Beat 2 (7.48s -> 11.36s): Size of problem standing in front of
  {
    rawFilename: 'Elvis wallkig to but=ld house .mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'THE CRISIS SCALE',
      subtitle: 'STANDING IN FRONT OF THE PROBLEM',
      tag: 'FIELD ANALYSIS',
    },
    overlay: 'micro_film_grain',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.whoosh_air,
    sfxVolume: 0.15,
  },
  // Beat 3 (11.36s -> 16.46s): Federal count, roughly 745,000
  {
    rawFilename: 'Wide lense view of TIny home.png',
    layout: 'forensic_drafting_table',
    layoutData: {
      title: 'FEDERAL ENUMERATION',
      subtitle: 'HUD POINT-IN-TIME CENSUS',
      stamp: 'ANNUAL ASSESSMENT',
    },
    callout: {
      type: 'odometer_stat',
      line1: '745,000 AMERICANS',
      line2: 'HUD ANNUAL HOMELESS REPORT • POINT-IN-TIME COUNT',
      spokenTrigger: '745',
      themeColor: 'gold',
    },
    overlay: 'archival_halftone_paper',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.camera_shutter,
    sfxVolume: 0.15,
  },
  // Beat 4 (16.46s -> 20.48s): Had no home on any given night
  {
    rawFilename: 'Wide lense view of TIny home.png',
    layout: 'open_case_binder',
    layoutData: {
      title: 'NATIONAL SCOPE',
      subtitle: 'UNSHELTERED POPULATION • 50 STATES',
      stamp: 'OFFICIAL RECORD',
    },
    callout: {
      type: 'newspaper_headline',
      line1: 'HUD REPORT // 745,000 WITHOUT HOMES',
      line2: 'CRISIS REACHES HIGHEST RECORDED LEVEL',
      spokenTrigger: 'given night',
      themeColor: 'crimson',
    },
    overlay: 'micro_film_grain',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 5 (20.48s -> 25.10s): Some in shelters, some in cars
  {
    rawFilename: 'Tinu Hose build by ELVIS.mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'editorial_quote',
      line1: 'TENS OF THOUSANDS WITH NOTHING OVER THEIR HEADS',
      line2: 'THE SHELTER GAP IN URBAN CENTERS',
      spokenTrigger: 'tens of thousands',
      themeColor: 'slate',
    },
    overlay: 'cinematic_vignette',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 6 (25.10s -> 29.82s): Close to 150,000 were kids
  {
    rawFilename: 'Wide lense view of TIny home.png',
    layout: 'editorial_sidebar_column',
    layoutData: {
      title: 'CHILD HOMELESSNESS',
      subtitle: 'STUDENTS IN CRISIS',
    },
    callout: {
      type: 'odometer_stat',
      line1: '150,000 HOMELESS KIDS',
      line2: 'MCKINNEY-VENTO HOMELESS ASSISTANCE DATA',
      spokenTrigger: '150',
      themeColor: 'crimson',
    },
    overlay: 'archival_halftone_paper',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.stat_click,
    sfxVolume: 0.16,
  },
  // Beat 7 (29.82s -> 33.90s): Students going to class from shelter/couch
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'desktop_corkboard',
    layoutData: {
      title: 'STUDENT REALITY',
      notes: ['SHELTERS', "RELATIVES' COUCHES", 'BACKSEAT OF CARS'],
    },
    overlay: 'micro_film_grain',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 8 (33.90s -> 38.22s): Backseat of car, act like everything normal
  {
    rawFilename: 'Tinu Hose build by ELVIS.mp4',
    layout: 'ambient_blur_frame',
    callout: {
      type: 'editorial_quote',
      line1: 'TRYING TO ACT LIKE EVERYTHING IS NORMAL',
      line2: 'THE INVISIBLE STRUGGLE OF HOMELESS STUDENTS',
      spokenTrigger: 'everything is normal',
      themeColor: 'amber',
    },
    overlay: 'cinematic_vignette',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_air,
    sfxVolume: 0.15,
  },
  // Beat 9 (38.22s -> 42.86s): California alone 160,000
  {
    rawFilename: 'Wide lense view of TIny home.png',
    layout: 'forensic_drafting_table',
    layoutData: {
      title: 'STATEWIDE DISPROPORTION',
      subtitle: 'CALIFORNIA SHARE OF NATIONAL COUNT',
      coords: 'CALIFORNIA • 160,000+ UNHOUSED',
    },
    callout: {
      type: 'odometer_stat',
      line1: '160,000 IN CALIFORNIA',
      line2: 'OVER 20% OF TOTAL U.S. HOMELESS POPULATION',
      spokenTrigger: '160',
      themeColor: 'gold',
    },
    overlay: 'archival_halftone_paper',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.stat_click,
    sfxVolume: 0.16,
  },
  // Beat 10 (42.86s -> 46.96s): Stretch running through Los Angeles
  {
    rawFilename: 'Elvis wallkig to but=ld house .mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'map_pingeotag',
      line1: 'SOUTH LOS ANGELES • 54TH & HOOVER',
      line2: 'CRITICAL UNSHELTERED CORRIDOR',
      spokenTrigger: 'Los Angeles',
      themeColor: 'amber',
    },
    overlay: 'camera_viewfinder_hud',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.camera_shutter,
    sfxVolume: 0.15,
  },
  // Beat 11 (46.96s -> 51.62s): Visible humanitarian situations
  {
    rawFilename: 'Elvis elevation.mp4',
    layout: 'vintage_crt_monitor',
    layoutData: {
      title: 'SPECIAL REPORT',
      subtitle: 'LOS ANGELES HUMANITARIAN CRISIS',
      tag: 'NATIONAL HEADLINE',
    },
    callout: {
      type: 'newspaper_headline',
      line1: 'HUMANITARIAN CRISIS ON L.A. STREETS',
      line2: 'UNPRECEDENTED SCALE OF SIDEWALK LIVING',
      spokenTrigger: 'humanitarian situations',
      themeColor: 'crimson',
    },
    overlay: 'vintage_crt_scanlines',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 12 (51.62s -> 55.62s): Numbers that make a person feel powerless
  {
    rawFilename: 'Elvis glimpse.mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'THE WEIGHT OF SCALE',
      subtitle: 'NUMBERS THAT PARALYZE ACTION',
    },
    overlay: 'cinematic_vignette',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_cinematic,
    sfxVolume: 0.18,
  },
  // Beat 13 (55.62s -> 60.76s): Big enough to look away from
  {
    rawFilename: 'ELVIS PHOTO.mp4',
    layout: 'editorial_sidebar_column',
    layoutData: {
      title: 'THE PSYCHOLOGY OF DIFFUSION',
      subtitle: 'HANDING OFF RESPONSIBILITY',
    },
    callout: {
      type: 'editorial_quote',
      line1: 'BIG ENOUGH TO LOOK AWAY FROM',
      line2: 'HANDED OFF TO COMMITTEES & BUDGETS',
      spokenTrigger: 'look away from',
      themeColor: 'slate',
    },
    overlay: 'micro_film_grain',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 14 (60.76s -> 65.54s): Budget line item nobody reads
  {
    rawFilename: 'Elvis wallkig to but=ld house .mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'MUNICIPAL BUDGET',
      subtitle: 'MEASURE HHH • $1.2B HOUSING BOND',
      stamp: 'BUREAUCRACY',
    },
    overlay: 'archival_halftone_paper',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 15 (65.54s -> 70.28s): Elvis Summers didn't hand it off, was 38
  {
    rawFilename: 'ELVIS PHOTO.mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'newspaper_headline',
      line1: 'PROFILE: ELVIS SUMMERS // AGE 38',
      line2: 'THE RESIDENT WHO REFUSED TO WAIT FOR CITY HALL',
      spokenTrigger: 'Elvis Summers',
      themeColor: 'gold',
    },
    overlay: 'cinematic_vignette',
    transition: 'zoom_punch',
    transitionDuration: 0.35,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 16 (70.28s -> 75.32s): Musician in South LA apartment
  {
    rawFilename: 'Elvis glimpse.mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'APARTMENT RESIDENCE',
      subtitle: '54TH & HOOVER • SOUTH LOS ANGELES',
    },
    callout: {
      type: 'map_pingeotag',
      line1: 'SOUTH LOS ANGELES • 54TH & HOOVER',
      line2: 'LOCAL RESIDENCE // GROUND ZERO',
      spokenTrigger: 'South LA',
      themeColor: 'amber',
    },
    overlay: 'micro_film_grain',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.camera_shutter,
    sfxVolume: 0.15,
  },
  // Beat 17 (75.32s -> 79.62s): Stretches of homelessness in 20s
  {
    rawFilename: 'Elvis elevation.mp4',
    layout: 'vintage_crt_monitor',
    layoutData: {
      title: 'LIVED EXPERIENCE',
      subtitle: 'EXPERIENCED HOMELESSNESS IN HIS 20s',
      tag: 'BIOGRAPHY',
    },
    overlay: 'vintage_crt_scanlines',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_air,
    sfxVolume: 0.15,
  },
  // Beat 18 (79.62s -> 83.72s): Looked at Smokey / Irene McGee
  {
    rawFilename: 'Tinu Hose build by ELVIS.mp4',
    layout: 'editorial_sidebar_column',
    layoutData: {
      title: 'SUBJECT FILE',
      subtitle: "IRENE 'SMOKEY' MCGEE",
    },
    callout: {
      type: 'newspaper_headline',
      line1: "IRENE 'SMOKEY' MCGEE",
      line2: 'SLEEPING ON CONCRETE OUTSIDE HIS APARTMENT',
      spokenTrigger: 'Irene McGee',
      themeColor: 'gold',
    },
    overlay: 'micro_film_grain',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 19 (83.72s -> 88.02s): Not looking at stranger's tragedy
  {
    rawFilename: 'Elvis wallkig to but=ld house .mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'editorial_quote',
      line1: "HE WASN'T LOOKING AT A STRANGER'S TRAGEDY",
      line2: 'A SHARED SENSE OF VULNERABILITY',
      spokenTrigger: "stranger's tragedy",
      themeColor: 'gold',
    },
    overlay: 'cinematic_vignette',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 20 (88.02s -> 91.78s): Recognized in his own bones
  {
    rawFilename: 'Elvis glimpse.mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'PERSONAL CONNECTION',
      subtitle: 'RECOGNIZING THE REALITY',
    },
    overlay: 'micro_film_grain',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_air,
    sfxVolume: 0.15,
  },
  // Beat 21 (91.78s -> 96.72s): What broke loose wasn't sadness
  {
    rawFilename: 'Elvis elevation.mp4',
    layout: 'desktop_corkboard',
    layoutData: {
      title: 'CATALYST FOR ACTION',
      notes: ['NOT SADNESS', 'A BREAKING POINT', 'BEYOND ACCEPTING IT'],
    },
    overlay: 'archival_halftone_paper',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 22 (96.72s -> 101.36s): Something closer to anger, quiet kind
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'vintage_crt_monitor',
    layoutData: {
      title: 'QUIET REVOLT',
      subtitle: 'THE DAILY ANGER OF INACTION',
    },
    callout: {
      type: 'editorial_quote',
      line1: 'SOMETHING CLOSER TO ANGER',
      line2: 'THE QUIET, EVERYDAY KIND',
      spokenTrigger: 'everyday kind',
      themeColor: 'crimson',
    },
    overlay: 'vintage_crt_scanlines',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 23 (101.36s -> 106.26s): Everyone liked her, not one person
  {
    rawFilename: 'Tinu Hose build by ELVIS.mp4',
    layout: 'open_case_binder',
    layoutData: {
      title: 'COMMUNITY CONFLICT',
      subtitle: 'A FAMILIAR FACE ON THE PAVEMENT',
      stamp: 'OBSERVATION',
    },
    overlay: 'micro_film_grain',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 24 (106.26s -> 110.36s): Himself included, had done anything
  {
    rawFilename: 'ELVIS PHOTO.mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'SELF-EXAMINATION',
      subtitle: "CONFRONTING ONE'S OWN INACTION",
    },
    overlay: 'cinematic_vignette',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_air,
    sfxVolume: 0.15,
  },
  // Beat 25 (110.36s -> 114.32s): Friendly and walking by, so he stopped
  {
    rawFilename: 'Elvis wallkig to but=ld house .mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'newspaper_headline',
      line1: 'SO HE STOPPED WALKING',
      line2: 'DECIDING TO BUILD A HOME FROM SCRATCH',
      spokenTrigger: 'stopped walking',
      themeColor: 'gold',
    },
    overlay: 'micro_film_grain',
    transition: 'zoom_punch',
    transitionDuration: 0.35,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 26 (114.32s -> 119.08s): Hardware store under $500 plywood
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'editorial_sidebar_column',
    layoutData: {
      title: 'HARDWARE BUDGET',
      subtitle: 'RAW BUILDING MATERIALS',
    },
    callout: {
      type: 'odometer_stat',
      line1: '$450 HARDWARE TRIP',
      line2: 'PLYWOOD • 2x4 LUMBER • FASTENERS • HINGES',
      spokenTrigger: 'under $500',
      themeColor: 'emerald',
    },
    overlay: 'archival_halftone_paper',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.stat_click,
    sfxVolume: 0.16,
  },
  // Beat 27 (119.08s -> 124.30s): Hinges lock basic lumber 8-foot house
  {
    rawFilename: 'Wide lense view of TIny home.png',
    layout: 'forensic_drafting_table',
    layoutData: {
      title: 'BLUEPRINT SPECIFICATIONS',
      subtitle: "8' x 3.5' MOBILE TIMBER SHELTER",
      stamp: 'MEASUREMENTS: 8FT L x 3.5FT W x 6FT H',
    },
    callout: {
      type: 'odometer_stat',
      line1: '8-FOOT WOODEN HOUSE',
      line2: 'EXTERIOR WHEELS // EASILY MOVABLE',
      spokenTrigger: 'wooden house',
      themeColor: 'gold',
    },
    overlay: 'archival_halftone_paper',
    transition: 'film_burn',
    transitionDuration: 0.4,
    sfxPath: SFX.camera_shutter,
    sfxVolume: 0.15,
  },
  // Beat 28 (124.30s -> 129.32s): Wheels right outside his front door
  {
    rawFilename: 'Tinu Hose build by ELVIS.mp4',
    layout: 'ambient_blur_frame',
    layoutData: {
      title: 'SIDEWALK WORKSHOP',
      subtitle: 'OUTSIDE HIS OWN FRONT DOOR',
    },
    callout: {
      type: 'map_pingeotag',
      line1: '54TH & HOOVER',
      line2: 'SIDEWALK WORKSHOP // BUILT IN 5 DAYS',
      spokenTrigger: 'outside his own front door',
      themeColor: 'amber',
    },
    overlay: 'camera_viewfinder_hud',
    transition: 'cut',
    transitionDuration: 0,
    sfxPath: SFX.camera_shutter,
    sfxVolume: 0.15,
  },
  // Beat 29 (129.32s -> 133.56s): Window, space to lie down off ground
  {
    rawFilename: 'Wide lense view of TIny home.png',
    layout: 'open_case_binder',
    layoutData: {
      title: 'SHELTER ESSENTIALS',
      subtitle: 'OFF THE GROUND • INSULATED • SECURE',
      stamp: 'COMPLETED UNIT',
    },
    overlay: 'archival_halftone_paper',
    transition: 'crossfade',
    transitionDuration: 0.4,
    sfxPath: SFX.paper_slide,
    sfxVolume: 0.15,
  },
  // Beat 30 (133.56s -> 138.10s): Filmed build, posted for handful
  {
    rawFilename: 'elvis buiding house .mp4',
    layout: 'vintage_crt_monitor',
    layoutData: {
      title: 'WEB BROADCAST',
      subtitle: 'FIRST TIME-LAPSE UPLOAD',
    },
    callout: {
      type: 'newspaper_headline',
      line1: 'VIRAL TIME-LAPSE POSTED',
      line2: 'RECORDED FOR A HANDFUL OF SUBSCRIBERS',
      spokenTrigger: 'filmed the whole build',
      themeColor: 'cyan',
    },
    overlay: 'vintage_crt_scanlines',
    transition: 'shutter_flash',
    transitionDuration: 0.35,
    sfxPath: SFX.subtle_hit,
    sfxVolume: 0.15,
  },
  // Beat 31 (138.10s -> 142.90s): Not prepared for what happened next
  {
    rawFilename: 'Elvis elevation.mp4',
    layout: 'full_bleed_cinematic',
    callout: {
      type: 'editorial_quote',
      line1: 'HE WAS NOT PREPARED FOR WHAT HAPPENED NEXT',
      line2: 'AMERICAN HIDEAWAYS // CHAPTER 02 END',
      spokenTrigger: 'what happened next',
      themeColor: 'gold',
    },
    overlay: 'cinematic_vignette',
    transition: 'film_dip_black',
    transitionDuration: 0.4,
    sfxPath: SFX.whoosh_cinematic,
    sfxVolume: 0.18,
  },
];

// Helper to assemble clips into a timeline
function buildTimeline(
  chapterIndex: number,
  transcriptPath: string,
  audioRelativePath: string,
  totalAudioDur: number,
  directedMetadata: DirectedSceneMetadata[],
  outputJsonPath: string
): Timeline {
  const data = JSON.parse(fs.readFileSync(transcriptPath, 'utf-8'));
  const beats = buildSentenceLockedBeats(data.segments, totalAudioDur, 3.5, 5.40);

  if (beats.length !== directedMetadata.length) {
    throw new Error(
      `Mismatch in Chapter ${chapterIndex}: generated ${beats.length} beats, but directed metadata has ${directedMetadata.length} entries.`
    );
  }

  const clips: TimelineClip[] = [];

  for (let i = 0; i < beats.length; i++) {
    const b = beats[i]!;
    const meta = directedMetadata[i]!;

    const fullClipPath = path.join(RAW_DIR, meta.rawFilename);
    if (!fs.existsSync(fullClipPath)) {
      throw new Error(`Raw clip not found on disk: ${fullClipPath}`);
    }

    const isImage = /\.(png|jpg|jpeg|webp)$/i.test(meta.rawFilename);

    clips.push({
      beatIndex: b.beatIndex,
      chapterIndex,
      text: b.text,
      startTime: b.startTime,
      endTime: b.endTime,
      clipPath: fullClipPath,
      mediaType: isImage ? 'image' : 'video',
      layout: meta.layout,
      layoutData: meta.layoutData,
      kenBurns: isImage,
      transitionType: meta.transition || 'cut',
      transitionDuration: meta.transitionDuration !== undefined ? meta.transitionDuration : 0,
      numberOverlays: [],
      callout: meta.callout || null,
      overlay: meta.overlay,
      sfxPath: meta.sfxPath || null,
      sfxVolume: meta.sfxVolume || 0.15,
    });
  }

  return {
    masterAudioPath: audioRelativePath,
    totalDuration: totalAudioDur,
    clips,
    outputPath: outputJsonPath.replace(/\\/g, '/'),
  };
}

// Verification function
function verifyTimeline(timeline: Timeline, chapterNum: number): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  timeline.clips.forEach((c) => {
    const dur = Math.round((c.endTime - c.startTime) * 100) / 100;
    if (dur < 3.5 || dur > 5.45) {
      errors.push(
        `Beat ${c.beatIndex} duration violation: ${dur}s [${c.startTime}s - ${c.endTime}s] outside [3.5s, 5.45s]`
      );
    }

    if (!c.clipPath || !fs.existsSync(c.clipPath)) {
      errors.push(`Beat ${c.beatIndex} invalid clipPath: "${c.clipPath}" does not exist`);
    }

    // Verify layout rule
    if (c.layout === 'quad_surveillance_matrix' || c.layout === 'split_dual_screen') {
      if (!c.secondaryClipPath && (!c.additionalClipPaths || c.additionalClipPaths.length === 0)) {
        errors.push(`Beat ${c.beatIndex} blank box violation: multi-slot layout ${c.layout} with single asset`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

async function run() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 DIRECTING ELVIS CHAPTERS 1 & 2 (AMERICAN HIDEAWAYS)');
  console.log('═══════════════════════════════════════════════════════════════════');

  // Chapter 1
  const ch1DestApp = path.join(TIMELINE_DIR_APP, 'chapter_01.json');
  const ch1DestRoot = path.join(TIMELINE_DIR_ROOT, 'chapter_01.json');
  const ch1Timeline = buildTimeline(
    1,
    CH1_TRANSCRIPT_PATH,
    'uploads/audio/1 - open.mp3',
    98.8,
    CH1_DIRECTED,
    ch1DestApp
  );

  const ch1Check = verifyTimeline(ch1Timeline, 1);
  if (!ch1Check.valid) {
    console.error('❌ Chapter 1 Verification FAILED:');
    ch1Check.errors.forEach((e) => console.error('  • ' + e));
    process.exit(1);
  }

  fs.writeFileSync(ch1DestApp, JSON.stringify(ch1Timeline, null, 2), 'utf-8');
  fs.writeFileSync(ch1DestRoot, JSON.stringify(ch1Timeline, null, 2), 'utf-8');
  console.log(`\n✅ Chapter 1 Generated & Verified (24 Beats):`);
  console.log(`   Saved: ${ch1DestApp}`);
  console.log(`   Mirrored: ${ch1DestRoot}`);

  // Chapter 2
  const ch2DestApp = path.join(TIMELINE_DIR_APP, 'chapter_02.json');
  const ch2DestRoot = path.join(TIMELINE_DIR_ROOT, 'chapter_02.json');
  const ch2Timeline = buildTimeline(
    2,
    CH2_TRANSCRIPT_PATH,
    "uploads/audio/2 - — THE MAN WHO COULDN'T KEEP WALKING PAST.mp3",
    142.9,
    CH2_DIRECTED,
    ch2DestApp
  );

  const ch2Check = verifyTimeline(ch2Timeline, 2);
  if (!ch2Check.valid) {
    console.error('❌ Chapter 2 Verification FAILED:');
    ch2Check.errors.forEach((e) => console.error('  • ' + e));
    process.exit(1);
  }

  fs.writeFileSync(ch2DestApp, JSON.stringify(ch2Timeline, null, 2), 'utf-8');
  fs.writeFileSync(ch2DestRoot, JSON.stringify(ch2Timeline, null, 2), 'utf-8');
  console.log(`\n✅ Chapter 2 Generated & Verified (32 Beats):`);
  console.log(`   Saved: ${ch2DestApp}`);
  console.log(`   Mirrored: ${ch2DestRoot}`);

  // Database Update if Elvis project exists
  const project = projectsStore.all().find((p) => p.name.toLowerCase() === 'elvis');
  if (project) {
    const existingChapters = chaptersStore.forProject(project.id);
    
    // Chapter 1 DB record
    let ch1Record = existingChapters.find((c) => c.chapterIndex === 1);
    if (ch1Record) {
      chaptersStore.update(project.id, ch1Record.id, {
        status: 'staged',
        timelineJson: ch1Timeline,
        clipLibraryRoot: RAW_DIR,
      });
    } else {
      chaptersStore.create(project.id, {
        chapterIndex: 1,
        title: 'Open',
        voiceoverFileName: '1 - open.mp3',
        status: 'staged',
        timelineJson: ch1Timeline,
        clipLibraryRoot: RAW_DIR,
      });
    }

    // Chapter 2 DB record
    let ch2Record = existingChapters.find((c) => c.chapterIndex === 2);
    if (ch2Record) {
      chaptersStore.update(project.id, ch2Record.id, {
        status: 'staged',
        timelineJson: ch2Timeline,
        clipLibraryRoot: RAW_DIR,
      });
    } else {
      chaptersStore.create(project.id, {
        chapterIndex: 2,
        title: "The Man Who Couldn't Keep Walking Past",
        voiceoverFileName: "2 - — THE MAN WHO COULDN'T KEEP WALKING PAST.mp3",
        status: 'staged',
        timelineJson: ch2Timeline,
        clipLibraryRoot: RAW_DIR,
      });
    }

    console.log(`\n💾 Database localStore updated for Project "${project.name}" (ID: ${project.id})`);
  }

  console.log('\n───────────────────────────────────────────────────────────────────');
  console.log('🎉 100% SUCCESS: ALL 56 BEATS SATISFY STRICT PACING & ASSET RULES!');
  console.log('───────────────────────────────────────────────────────────────────');
  console.log(`• Chapter 1: ${ch1Timeline.clips.length} beats, duration: ${ch1Timeline.totalDuration}s`);
  ch1Timeline.clips.forEach((c) => {
    const dur = Math.round((c.endTime - c.startTime) * 100) / 100;
    console.log(`  [Beat ${String(c.beatIndex).padStart(2, '0')}] ${c.startTime.toFixed(2)}s -> ${c.endTime.toFixed(2)}s (${dur.toFixed(2)}s) | ${path.basename(c.clipPath!)} | layout: ${c.layout} | callout: ${c.callout?.type || 'none'}`);
  });

  console.log(`\n• Chapter 2: ${ch2Timeline.clips.length} beats, duration: ${ch2Timeline.totalDuration}s`);
  ch2Timeline.clips.forEach((c) => {
    const dur = Math.round((c.endTime - c.startTime) * 100) / 100;
    console.log(`  [Beat ${String(c.beatIndex).padStart(2, '0')}] ${c.startTime.toFixed(2)}s -> ${c.endTime.toFixed(2)}s (${dur.toFixed(2)}s) | ${path.basename(c.clipPath!)} | layout: ${c.layout} | callout: ${c.callout?.type || 'none'}`);
  });
}

run().catch((err) => {
  console.error('Fatal staging error:', err);
  process.exit(1);
});
