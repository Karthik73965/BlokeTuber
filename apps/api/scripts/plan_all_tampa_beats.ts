import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { mapPlannedBeatsToTiming, PlannedBeat } from '../src/services/aiScriptPlanner';
import { getAudioDuration } from '../src/services/audioAssembly';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import type { SceneLayoutType, OverlayType, TransitionType, CalloutType, CalloutThemeColor } from '@repo/shared';

// Load environment variables
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const SFX_DIR = path.resolve(__dirname, '../../../packages/remotion-video/public/sfx');
const SFX_MAP = {
  whoosh_air: path.join(SFX_DIR, 'whoosh_air.mp3'),
  whoosh_cinematic: path.join(SFX_DIR, 'whoosh_cinematic.mp3'),
  camera_shutter: path.join(SFX_DIR, 'camera_shutter.mp3'),
  paper_slide: path.join(SFX_DIR, 'paper_slide.mp3'),
  stat_click: path.join(SFX_DIR, 'stat_click.mp3'),
  subtle_hit: path.join(SFX_DIR, 'subtle_hit.mp3'),
};

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

interface SegmentAlignment {
  text: string;
  start: number;
  end: number;
  words: WordTimestamp[];
}

interface ChapterDefinition {
  num: number;
  numStr: string;
  title: string;
  jsonFilename: string;
  audioFilename: string;
  themeContext: string;
  primaryLocalClips: string[];
}

const CHAPTERS: ChapterDefinition[] = [
  {
    num: 1,
    numStr: '01',
    title: 'Chapter 01: Cold Open',
    jsonFilename: '01_1 - COld.json',
    audioFilename: '1 - COld.mp3',
    themeContext: 'Eastern Ybor City Tampa light, Hope Cottages rows, gated community, unhoused background, first safe sanctuary.',
    primaryLocalClips: [
      'Zoomout of TAMPA house .mp4',
      'inside home .mp4',
      'Group of homes.png',
      'fulll house.webp',
      'prople building home aka Tampa.mp4',
    ],
  },
  {
    num: 2,
    numStr: '02',
    title: 'Chapter 02: The Shape',
    jsonFilename: '02_2 - THE SHAPE.json',
    audioFilename: '2 - THE SHAPE.mp3',
    themeContext: 'Tampa Florida housing crisis, rents spiking 30% in two years, $7,500 Hope Cottage vs expensive apartments, Hillsborough County.',
    primaryLocalClips: ['fulll house.webp', 'Group of homes.png', 'inside home .mp4'],
  },
  {
    num: 3,
    numStr: '03',
    title: 'Chapter 03: The Partnership',
    jsonFilename: '03_3 - THE PARTNERSHIP.json',
    audioFilename: '3 - THE PARTNERSHIP.mp3',
    themeContext: 'Catholic Charities Diocese of St. Petersburg, Pinellas Hope started in 2007 with 250 people, City of Tampa civic collaboration, Bishop Gregory Parkes.',
    primaryLocalClips: ['Gregory L Parkes.png', 'Group of homes.png', 'prople building home aka Tampa.mp4'],
  },
  {
    num: 4,
    numStr: '04',
    title: 'Chapter 04: What Moves In',
    jsonFilename: '04_4 - WHAT MOVES IN.json',
    audioFilename: '4 - WHAT MOVES IN.mp3',
    themeContext: 'Pallet shelter specs: 64 sq ft, insulated fiberglass walls, individual AC unit, power outlets, desk, twin bed, deadbolt lock and brass key.',
    primaryLocalClips: ['inside home .mp4', 'fulll house.webp', 'Group of homes.png'],
  },
  {
    num: 5,
    numStr: '05',
    title: 'Chapter 05: The Cottages Arrive',
    jsonFilename: '05_5 -  THE COTTAGES ARRIVE.json',
    audioFilename: '5 -  THE COTTAGES ARRIVE.mp3',
    themeContext: 'April 2023 ribbon cutting, Bishop Gregory Parkes blessing the cottages, 100 Pallet cottages assembled on site by community volunteers.',
    primaryLocalClips: ['Gregory L Parkes.png', 'prople building home aka Tampa.mp4', 'Group of homes.png'],
  },
  {
    num: 6,
    numStr: '06',
    title: 'Chapter 06: The Math, Then And Now',
    jsonFilename: '06_6 - THE MATH THEN AND NOW.json',
    audioFilename: '6 - THE MATH, THEN AND NOW.mp3',
    themeContext: 'Economic math: $7,500 Pallet unit vs $20,000 Seattle model vs $150k traditional apartment, rapid timeline vs years in permitting.',
    primaryLocalClips: ['fulll house.webp', 'Group of homes.png', 'prople building home aka Tampa.mp4'],
  },
  {
    num: 7,
    numStr: '07',
    title: 'Chapter 07: The People',
    jsonFilename: '07_7 -  THE PEOPLe.json',
    audioFilename: '7 -  THE PEOPLe.mp3',
    themeContext: 'Residents Darlene Doster and Carl Walker, 1,100 people served since 2021, 400 clients in 2025, 90-day average stay, moving from tent to lease.',
    primaryLocalClips: ['inside home .mp4', 'Zoomout of TAMPA house .mp4', 'fulll house.webp'],
  },
  {
    num: 8,
    numStr: '08',
    title: 'Chapter 08: What Success Looks Like Here',
    jsonFilename: '08_8 - WHAT SUCCESS LOOKS LIKE HERE.json',
    audioFilename: '8 - WHAT SUCCESS LOOKS LIKE HERE.mp3',
    themeContext: 'Measuring success: 350+ placed directly into permanent housing, 40%-50% transition rate, medical care, counseling, financial literacy.',
    primaryLocalClips: ['Group of homes.png', 'inside home .mp4', 'fulll house.webp'],
  },
  {
    num: 9,
    numStr: '09',
    title: 'Chapter 09: Building For The Long Haul',
    jsonFilename: '09_9 - BUILDING FOR THE LONG HAUL.json',
    audioFilename: '9 - BUILDING FOR THE LONG HAUL.mp3',
    themeContext: 'June 2024 groundbreaking of $1.5M Matthew 25 Community Center, Spring 2026 expansion to 215 cottages, 116 tents, 350+ bed capacity.',
    primaryLocalClips: ['prople building home aka Tampa.mp4', 'Group of homes.png', 'fulll house.webp'],
  },
  {
    num: 10,
    numStr: '10',
    title: 'Chapter 10: The Spread',
    jsonFilename: '10_10   - THE SPREAD.json',
    audioFilename: '10   - THE SPREAD.mp3',
    themeContext: 'Tiny cottage movement nationwide, Seattle $20,000 units, 20+ service organizations co-located on one Tampa site.',
    primaryLocalClips: ['Group of homes.png', 'fulll house.webp', 'prople building home aka Tampa.mp4'],
  },
  {
    num: 11,
    numStr: '11',
    title: 'Chapter 11: What A Locked Door Is Worth',
    jsonFilename: '11_11 - WHAT A LOCKED DOOR IS WORTH.json',
    audioFilename: '11 - WHAT A LOCKED DOOR IS WORTH.mp3',
    themeContext: 'The emotional reality of a locked door after surviving on the street: protecting belongings, uninterrupted sleep, personal dignity.',
    primaryLocalClips: ['inside home .mp4', 'fulll house.webp', 'Group of homes.png'],
  },
  {
    num: 12,
    numStr: '12',
    title: 'Chapter 12: Close',
    jsonFilename: '12_12 - close.json',
    audioFilename: '12 - close.mp3',
    themeContext: 'Dusk over Eastern Ybor City, Carl Walker in his own apartment, over 1,000 lives stabilized, the enduring worth of a locked door.',
    primaryLocalClips: ['Zoomout of TAMPA house .mp4', 'Group of homes.png', 'inside home .mp4'],
  },
];

const MOTION_LAYOUTS: SceneLayoutType[] = [
  'split_dual_screen',
  'editorial_sidebar_column',
  'parallax_triptych_gallery',
  'vintage_crt_monitor',
  'ambient_blur_frame',
  'open_case_binder',
  'forensic_drafting_table',
  'polaroid_scatter_desk',
  'illuminated_lightbox',
  'museum_archive_matte',
  'quad_surveillance_matrix',
  'desktop_corkboard',
  'filmstrip_spool_reel',
];

const OVERLAYS: OverlayType[] = [
  'micro_film_grain',
  'cinematic_vignette',
  'film_dust_scratches',
  'chromatic_aberration',
  'archival_halftone_paper',
  'sprocket_16mm_film_frame',
  'star_sparkle_bokeh',
];

const TRANSITIONS: TransitionType[] = [
  'cut',
  'shutter_flash',
  'whip_pan_left',
  'film_dip_black',
  'zoom_punch',
  'crossfade',
  'whip_pan_right',
  'film_burn',
];

/**
 * Intelligent Number / Stat Callout Detector
 * Scans spoken text for dates, dollar figures, counts, percentages, and metrics.
 */
function detectNumberCallout(
  text: string,
  chapterNum: number,
  beatIdx: number
): { callout: any; sfx: string } | null {
  const lower = text.toLowerCase();

  // 1. Percentage / Rent increase
  if (lower.includes('30 percent') || lower.includes('30%')) {
    return {
      callout: {
        type: 'odometer_stat' as CalloutType,
        line1: '30% RENT SURGE',
        line2: 'TAMPA HOUSING INFLATION (2021-2023)',
        spokenTrigger: '30 percent',
        themeColor: 'crimson' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 2. Unit cost ($7,500)
  if (lower.includes('7,500') || lower.includes('7500') || lower.includes('seven thousand five hundred')) {
    return {
      callout: {
        type: 'stat_callout' as CalloutType,
        line1: '$7,500 PER COTTAGE',
        line2: 'RAPID PALLET SHELTER CAPITAL COST',
        spokenTrigger: '7500',
        themeColor: 'gold' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 3. Seattle comparison ($20,000)
  if (lower.includes('20,000') || lower.includes('20000') || lower.includes('twenty thousand')) {
    return {
      callout: {
        type: 'split_milestone_card' as CalloutType,
        line1: '$7,500 TAMPA vs $20,000 SEATTLE',
        line2: 'MUNICIPAL TINY HOME COST COMPARISON',
        spokenTrigger: '20000',
        themeColor: 'amber' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 4. Matthew 25 Community Center ($1.5 million)
  if (lower.includes('1.5 million') || lower.includes('million')) {
    return {
      callout: {
        type: 'forensic_data_card' as CalloutType,
        line1: '$1.5M CAPITAL INVESTMENT',
        line2: 'MATTHEW 25 COMMUNITY CENTER • TAMPA HOPE',
        spokenTrigger: '1.5 million',
        themeColor: 'cyan' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 5. Total served (1100 / 1,100 people)
  if (lower.includes('1100') || lower.includes('1,100') || lower.includes('eleven hundred')) {
    return {
      callout: {
        type: 'odometer_stat' as CalloutType,
        line1: '1,100+ LIVES SERVED',
        line2: 'TOTAL SHELTER ENROLLMENT SINCE 2021',
        spokenTrigger: '1100',
        themeColor: 'emerald' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 6. Placed in housing (350 clients)
  if (lower.includes('350') || lower.includes('three hundred and fifty') || lower.includes('three hundred fifty')) {
    return {
      callout: {
        type: 'odometer_stat' as CalloutType,
        line1: '350+ PERMANENTLY HOUSED',
        line2: 'SUCCESSFUL TRANSITIONS TO LEASES',
        spokenTrigger: '350',
        themeColor: 'emerald' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 7. Cottage expansion (215 cottages)
  if (lower.includes('215') || lower.includes('two hundred and fifteen') || lower.includes('two hundred fifteen')) {
    return {
      callout: {
        type: 'odometer_stat' as CalloutType,
        line1: '215 HOPE COTTAGES',
        line2: '350+ COMBINED NIGHTLY BED CAPACITY',
        spokenTrigger: '215',
        themeColor: 'gold' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 8. Cottage specs (64 sq ft)
  if (lower.includes('64') || lower.includes('sixty-four') || lower.includes('sixty four')) {
    return {
      callout: {
        type: 'forensic_data_card' as CalloutType,
        line1: '64 SQ FT SHELTER',
        line2: 'INSULATED COMPOSITE • AC • OUTLET • LOCK',
        spokenTrigger: '64',
        themeColor: 'slate' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 9. 100 cottages initial
  if (lower.includes('100 cottage') || lower.includes('hundred cottage')) {
    return {
      callout: {
        type: 'stat_callout' as CalloutType,
        line1: '100 HOPE COTTAGES',
        line2: 'PHASE 2 RAPID SHELTER ROLLOUT',
        spokenTrigger: '100',
        themeColor: 'gold' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 10. 90 days stay
  if (lower.includes('90 days') || lower.includes('ninety days') || lower.includes('four-month') || lower.includes('four month')) {
    return {
      callout: {
        type: 'highlight_pill' as CalloutType,
        line1: '90-DAY AVERAGE STAY',
        line2: 'STABILIZATION & CASEWORK WINDOW',
        spokenTrigger: '90 days',
        themeColor: 'cyan' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 11. 400 clients in 2025
  if (lower.includes('400') || lower.includes('four hundred')) {
    return {
      callout: {
        type: 'stat_callout' as CalloutType,
        line1: '400 CLIENTS (2025)',
        line2: 'ANNUAL ACTIVE STABILIZATION CAPACITY',
        spokenTrigger: '400',
        themeColor: 'slate' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 12. 2007 Pinellas Hope
  if (lower.includes('2007') || lower.includes('pinellas hope')) {
    return {
      callout: {
        type: 'split_milestone_card' as CalloutType,
        line1: '2007: PINELLAS HOPE PILOT',
        line2: 'CATHOLIC CHARITIES DIOCESE PRECEDENT',
        spokenTrigger: '2007',
        themeColor: 'amber' as CalloutThemeColor,
      },
      sfx: SFX_MAP.paper_slide,
    };
  }

  // 13. April 2023
  if (lower.includes('april 2023')) {
    return {
      callout: {
        type: 'location_badge' as CalloutType,
        line1: 'APRIL 2023 UNVEILING',
        line2: 'EASTERN YBOR CITY • TAMPA, FL',
        spokenTrigger: 'April 2023',
        themeColor: 'gold' as CalloutThemeColor,
      },
      sfx: SFX_MAP.camera_shutter,
    };
  }

  // 14. June 2024
  if (lower.includes('june 2024')) {
    return {
      callout: {
        type: 'location_badge' as CalloutType,
        line1: 'JUNE 2024 GROUNDBREAKING',
        line2: 'COMMUNITY CENTER EXPANSION',
        spokenTrigger: 'June 2024',
        themeColor: 'amber' as CalloutThemeColor,
      },
      sfx: SFX_MAP.paper_slide,
    };
  }

  // 15. 20 partners
  if (lower.includes('20 other') || lower.includes('twenty other') || lower.includes('20 partners')) {
    return {
      callout: {
        type: 'highlight_pill' as CalloutType,
        line1: '20+ CIVIC PARTNERS',
        line2: 'CITY • DIOCESE • USF HEALTH ON ONE CAMPUS',
        spokenTrigger: '20',
        themeColor: 'cyan' as CalloutThemeColor,
      },
      sfx: SFX_MAP.stat_click,
    };
  }

  // 16. Bishop Gregory Parkes
  if (lower.includes('gregory parkes') || lower.includes('gregory parks') || lower.includes('bishop')) {
    return {
      callout: {
        type: 'editorial_lower_third' as CalloutType,
        line1: 'MOST REV. GREGORY L. PARKES',
        line2: 'BISHOP • DIOCESE OF ST. PETERSBURG',
        spokenTrigger: 'Gregory',
        themeColor: 'gold' as CalloutThemeColor,
      },
      sfx: SFX_MAP.camera_shutter,
    };
  }

  // 17. Darlene Doster
  if (lower.includes('darlene doster') || lower.includes('darlene')) {
    return {
      callout: {
        type: 'editorial_lower_third' as CalloutType,
        line1: 'DARLENE DOSTER',
        line2: 'FORMER RESIDENT • TAMPA HOPE COTTAGES',
        spokenTrigger: 'Darlene',
        themeColor: 'cyan' as CalloutThemeColor,
      },
      sfx: SFX_MAP.paper_slide,
    };
  }

  // 18. Carl Walker
  if (lower.includes('carl walker') || lower.includes('carl')) {
    return {
      callout: {
        type: 'editorial_lower_third' as CalloutType,
        line1: 'CARL WALKER',
        line2: 'GRADUATED TO INDEPENDENT APARTMENT LEASE',
        spokenTrigger: 'Carl',
        themeColor: 'emerald' as CalloutThemeColor,
      },
      sfx: SFX_MAP.paper_slide,
    };
  }

  // 19. The lock / locked door
  if (lower.includes('the lock') || lower.includes('locked door') || lower.includes('door that locks')) {
    return {
      callout: {
        type: 'editorial_quote' as CalloutType,
        line1: '"A DOOR THAT LOCKS IS WHERE IT STOPS"',
        line2: 'THE DIGNITY OF PERSONAL SANCTUARY',
        spokenTrigger: 'lock',
        themeColor: 'amber' as CalloutThemeColor,
      },
      sfx: SFX_MAP.subtle_hit,
    };
  }

  return null;
}

function buildRawBeatsFromSegments(
  segments: SegmentAlignment[],
  chapterDef: ChapterDefinition,
  totalDuration: number
): PlannedBeat[] {
  // Group segments into punchy documentary units (target ~3.5s - 5.0s)
  const groupedUnits: Array<{ text: string; approxDuration: number }> = [];
  let currentGroupText: string[] = [];
  let currentGroupDur = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    const segDur = seg.end - seg.start;
    const segText = seg.text.trim();

    if (currentGroupText.length === 0) {
      currentGroupText.push(segText);
      currentGroupDur = segDur;
    } else if (currentGroupDur + segDur <= 4.8) {
      currentGroupText.push(segText);
      currentGroupDur += segDur;
    } else {
      groupedUnits.push({
        text: currentGroupText.join(' '),
        approxDuration: currentGroupDur,
      });
      currentGroupText = [segText];
      currentGroupDur = segDur;
    }
  }

  if (currentGroupText.length > 0) {
    groupedUnits.push({
      text: currentGroupText.join(' '),
      approxDuration: currentGroupDur,
    });
  }

  const rawBeats: PlannedBeat[] = [];
  let localClipIndex = 0;

  groupedUnits.forEach((unit, idx) => {
    const isFirstBeat = idx === 0;
    const isEven = idx % 2 === 0;

    // Alternating 50/50 rhythm between stylized motion graphics and full-bleed cinematic b-roll
    let layout: SceneLayoutType = isEven ? 'full_bleed_cinematic' : MOTION_LAYOUTS[(idx / 2) % MOTION_LAYOUTS.length]!;
    if (isFirstBeat) layout = 'full_bleed_cinematic';

    // Layout metadata
    let layoutData: any = null;
    if (layout !== 'full_bleed_cinematic') {
      layoutData = {
        title: `${chapterDef.title.toUpperCase()}`,
        subtitle: `FIELD EVIDENCE • SCENE ${idx + 1}`,
        coords: 'TAMPA, FL • 27.9506° N, 82.4572° W',
        tag: 'DOCUMENTARY ARCHIVE',
        badge: 'TAMPA HOPE',
      };
    }

    // ── Local Asset Assignment ──
    let clipFilename: string | null = null;

    // Special directive for Chapter 1: Hook the audience immediately with real footage in the opening beats!
    if (chapterDef.num === 1) {
      if (idx === 0) clipFilename = 'Zoomout of TAMPA house .mp4'; // Establishing aerial zoomout
      else if (idx === 1) clipFilename = 'inside home .mp4'; // Look inside the cottage
      else if (idx === 2) clipFilename = 'Group of homes.png'; // Rows of cottages
      else if (idx === 3) clipFilename = 'fulll house.webp'; // Full cottage exterior
      else if (idx === 4) clipFilename = 'prople building home aka Tampa.mp4'; // Community building
      else if (idx % 3 === 0 && chapterDef.primaryLocalClips.length > 0) {
        clipFilename = chapterDef.primaryLocalClips[localClipIndex % chapterDef.primaryLocalClips.length] || null;
        localClipIndex++;
      }
    } else {
      // Smart contextual local clip matching for other chapters
      const unitLower = unit.text.toLowerCase();
      if (unitLower.includes('bishop') || unitLower.includes('gregory parkes') || unitLower.includes('parkes')) {
        clipFilename = 'Gregory L Parkes.png';
      } else if (unitLower.includes('inside') || unitLower.includes('bed') || unitLower.includes('air conditioning') || unitLower.includes('lock')) {
        clipFilename = 'inside home .mp4';
      } else if (unitLower.includes('building') || unitLower.includes('built') || unitLower.includes('volunteer') || unitLower.includes('construction') || unitLower.includes('groundbreaking')) {
        clipFilename = 'prople building home aka Tampa.mp4';
      } else if (unitLower.includes('aerial') || unitLower.includes('ebor') || unitLower.includes('ybor') || unitLower.includes('twilight') || unitLower.includes('evening')) {
        clipFilename = 'Zoomout of TAMPA house .mp4';
      } else if (chapterDef.primaryLocalClips.length > 0 && (idx % 3 === 0 || isFirstBeat)) {
        clipFilename = chapterDef.primaryLocalClips[localClipIndex % chapterDef.primaryLocalClips.length] || null;
        localClipIndex++;
      }
    }

    // Determine mediaType if local clip
    let mediaType: 'video' | 'image' = 'video';
    if (clipFilename) {
      if (/\.(png|jpg|jpeg|webp)$/i.test(clipFilename)) mediaType = 'image';
      else mediaType = 'video';
    }

    // ── Stock Queries Formulation ──
    const words = unit.text.split(/\s+/).filter(Boolean);
    const keyWords = words.filter((w) => w.length > 3).slice(0, 4).join(' ');

    const stockVideoQuery = `tampa florida shelter community ${keyWords}`.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const backupVideoQuery = `tampa urban documentary ${chapterDef.themeContext.slice(0, 30)}`.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const stockPhotoQuery = `tampa fl tiny house community ${keyWords}`.toLowerCase().replace(/[^a-z0-9 ]/g, '');

    // ── Multi-Asset Layout Queries (Multi-Slot Query Tracking) ──
    let additionalStockQueries: Array<{ slot: string; query: string; mediaType: 'video' | 'image' }> = [];

    if (layout === 'split_dual_screen') {
      additionalStockQueries = [
        {
          slot: 'right_panel',
          query: `${backupVideoQuery} exterior architecture`,
          mediaType: 'image',
        },
      ];
    } else if (layout === 'parallax_triptych_gallery') {
      additionalStockQueries = [
        {
          slot: 'center_panel',
          query: `tampa cottages architecture ${keyWords}`,
          mediaType: 'image',
        },
        {
          slot: 'right_panel',
          query: `florida housing community sunny ${keyWords}`,
          mediaType: 'image',
        },
      ];
    } else if (layout === 'quad_surveillance_matrix') {
      additionalStockQueries = [
        {
          slot: 'cam_2',
          query: 'security camera street view sunny',
          mediaType: 'video',
        },
        {
          slot: 'cam_3',
          query: 'surveillance camera building perimeter',
          mediaType: 'video',
        },
        {
          slot: 'cam_4',
          query: 'aerial drone neighborhood overview',
          mediaType: 'video',
        },
      ];
    } else if (layout === 'editorial_sidebar_column') {
      additionalStockQueries = [
        {
          slot: 'sidebar_photo',
          query: `tampa florida housing documentary detail ${keyWords}`,
          mediaType: 'image',
        },
      ];
    }

    // ── Smart Number & Stat Callouts & SFX ──
    const detected = detectNumberCallout(unit.text, chapterDef.num, idx);
    let callout: any = null;
    let sfxPath: string = SFX_MAP.whoosh_air;

    if (detected) {
      callout = detected.callout;
      sfxPath = detected.sfx;
    } else if (isFirstBeat) {
      callout = {
        type: 'editorial_lower_third' as CalloutType,
        line1: chapterDef.title.toUpperCase(),
        line2: 'TAMPA HOPE COTTAGES • TAMPA, FL',
        spokenTrigger: words.slice(0, 3).join(' '),
        themeColor: 'gold' as CalloutThemeColor,
      };
      sfxPath = SFX_MAP.whoosh_cinematic;
    } else if (idx === Math.floor(groupedUnits.length / 2)) {
      callout = {
        type: 'newspaper_headline' as CalloutType,
        line1: words.slice(0, 4).join(' ').toUpperCase(),
        line2: 'INVESTIGATIVE REPORT • TAMPA, FL',
        spokenTrigger: words.slice(0, 3).join(' '),
        themeColor: 'amber' as CalloutThemeColor,
      };
      sfxPath = SFX_MAP.paper_slide;
    }

    // Transition assignment
    let transition: TransitionType = isFirstBeat ? 'film_dip_black' : TRANSITIONS[idx % TRANSITIONS.length] || 'cut';

    rawBeats.push({
      beatIndex: idx,
      chapterIndex: chapterDef.num,
      text: unit.text,
      visualSubject: `tampa_${chapterDef.num}_beat_${idx}`,
      mediaType,
      layout,
      layoutData,
      clipFilename,
      stockVideoQuery,
      backupVideoQuery,
      stockPhotoQuery,
      negativeKeywords: ['luxury villa', 'beach resort', 'supermodel', 'mansion pool'],
      additionalStockQueries,
      overlay: OVERLAYS[idx % OVERLAYS.length] || null,
      transition,
      cameraStyle: idx % 2 === 0 ? 'zoom_in' : 'pan_left',
      reason: `Directing beat ${idx} for ${chapterDef.title}`,
      callout,
      sfxPath,
      sfxVolume: 0.18,
    } as any);
  });

  return rawBeats;
}

async function planAllChapters() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 BATCH BEAT PLANNING: ALL 12 TAMPA CHAPTERS');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // Find project
  const project = projectsStore.all().find((p) => p.name.toLowerCase() === 'tampa');
  if (!project) {
    throw new Error('Project "Tampa" not found in store!');
  }

  const overallResults: Array<{
    chapter: string;
    beatsCount: number;
    duration: number;
    minBeat: number;
    maxBeat: number;
    localClipsAssigned: number;
    calloutsAssigned: number;
    passed: boolean;
  }> = [];

  const TRANSCRIPT_DIRS = [
    path.resolve(process.cwd(), 'uploads/transcripts/tampa'),
    path.resolve(process.cwd(), 'apps/api/uploads/transcripts/tampa'),
  ];

  for (const def of CHAPTERS) {
    const audioPath = path.resolve(process.cwd(), 'uploads/audio', def.audioFilename);
    const jsonPath = path.resolve(process.cwd(), 'uploads/transcripts/tampa', def.jsonFilename);

    if (!fs.existsSync(jsonPath)) {
      console.warn(`⚠️ Warning: Transcript not found: ${jsonPath}`);
      continue;
    }

    const transcriptData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const segments: SegmentAlignment[] = transcriptData.segments;
    const duration = await getAudioDuration(audioPath);

    // Build raw beats with smart callouts and multi-asset query slots
    const rawBeats = buildRawBeatsFromSegments(segments, def, duration);

    // Run through timing mapper
    const timedBeats = mapPlannedBeatsToTiming(rawBeats, segments, duration, 'medium');

    // Count statistics
    let minBeat = 999;
    let maxBeat = 0;
    let localClipsCount = 0;
    let calloutsCount = 0;

    timedBeats.forEach((b) => {
      const dur = b.endTime - b.startTime;
      if (dur < minBeat) minBeat = dur;
      if (dur > maxBeat) maxBeat = dur;
      if (b.clipFilename) localClipsCount++;
      if (b.callout) calloutsCount++;
    });

    const passed = minBeat >= 2.99 && maxBeat <= 6.01;

    // Save planned beats to both transcript directories
    for (const tDir of TRANSCRIPT_DIRS) {
      const planOutputPath = path.join(tDir, `${def.numStr}_planned_beats.json`);
      fs.writeFileSync(planOutputPath, JSON.stringify(timedBeats, null, 2), 'utf-8');
    }

    // Update chapter in chaptersStore
    const existingChapter = chaptersStore.forProject(project.id).find((c) => c.chapterIndex === def.num);
    if (existingChapter) {
      chaptersStore.update(project.id, existingChapter.id, {
        description: `Beats planned: ${timedBeats.length} cuts | Duration: ${duration.toFixed(1)}s | Local Clips: ${localClipsCount} | Callouts: ${calloutsCount} | Pacing: 3.0s-6.0s`,
      });
    }

    overallResults.push({
      chapter: def.title,
      beatsCount: timedBeats.length,
      duration: Number(duration.toFixed(2)),
      minBeat: Number(minBeat.toFixed(2)),
      maxBeat: Number(maxBeat.toFixed(2)),
      localClipsAssigned: localClipsCount,
      calloutsAssigned: calloutsCount,
      passed,
    });

    console.log(
      `✓ [${def.numStr}/12] ${def.title.padEnd(36)} | Beats: ${String(timedBeats.length).padStart(2)} | Dur: ${duration.toFixed(1)}s | Local: ${localClipsCount} | Callouts: ${calloutsCount} | [${minBeat.toFixed(2)}s - ${maxBeat.toFixed(2)}s] ${passed ? '✅' : '❌'}`
    );
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('📊 ALL 12 CHAPTERS BEAT PLANNING SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  console.table(overallResults);

  const allPassed = overallResults.every((r) => r.passed);
  console.log(`\nAll Chapters 100% within 3.0s – 6.0s constraint: ${allPassed ? 'YES ✅' : 'NO ❌'}\n`);
}

planAllChapters().catch((err) => {
  console.error('Error planning all chapters:', err);
  process.exit(1);
});
