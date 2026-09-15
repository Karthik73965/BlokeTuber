import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

async function generateShowcaseCatalog() {
  console.log('═════════════════════════════════════════════════════════════════════════');
  console.log('🎬 GENERATING COMPLETE VISUAL SHOWCASE CATALOG (LAYOUTS, CALLOUTS, NUMBERS)');
  console.log('═════════════════════════════════════════════════════════════════════════\n');

  const rootDir = path.resolve(__dirname, '../../..');
  const outDir = path.join(rootDir, 'output');
  const stillsDir = path.join(outDir, 'showcase_catalog_stills');
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(stillsDir, { recursive: true });

  const finalVideoPath = path.join(outDir, 'showcase_catalog.mp4');
  const timelineJsonPath = path.join(outDir, 'showcase_catalog_timeline.json');

  // Audio track
  const masterAudio = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\ELVIS\\AUD\\1 - open.mp3';

  // Real footage assets
  const rawDir = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\ELVIS\\RAW';
  const raw2Dir = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\ELVIS\\Raw2';

  const clipElvisBuild = path.join(rawDir, 'elvis buiding house .mp4');
  const clipElvisElevation = path.join(rawDir, 'Elvis elevation.mp4');
  const clipElvisGlimpse = path.join(rawDir, 'Elvis glimpse.mp4');
  const clipElvisPhoto = path.join(rawDir, 'ELVIS PHOTO.mp4');
  const clipDoorPng = path.join(rawDir, 'Door of tiny home.png');
  const clipWidePng = path.join(rawDir, 'Wide lense view of TIny home.png');
  const clipInsideTent = path.join(rawDir, 'inside the tent.mp4');
  const clipOldWoman = path.join(rawDir, 'OLD WOMAN.mp4');
  const clipMap = path.join(rawDir, 'SHowing LOS ANGELS IN MAP.mp4');
  const clipTents = path.join(rawDir, 'Tents in the sidewalk.mp4');
  const clipWomanPolice = path.join(rawDir, 'WOMAN POLICE.mp4');
  const clipAndyBales = path.join(rawDir, 'Person named ANdy BALES.mp4');
  const clipThanking = path.join(rawDir, 'woman thanking elvis.mp4');

  // Verify assets exist
  const assetsToCheck = [clipElvisBuild, clipDoorPng, clipInsideTent, clipOldWoman, clipTents];
  for (const a of assetsToCheck) {
    if (!fs.existsSync(a)) {
      console.error(`❌ Required asset not found: ${a}`);
      process.exit(1);
    }
  }

  const clips: TimelineClip[] = [];
  let timeCursor = 0;
  const clipDuration = 2.3; // 2.3 seconds per item
  let beatIndex = 0;

  const stillExtractionList: Array<{ id: string; timestamp: number }> = [];

  // Helper to add a clip
  function addClip(
    id: string,
    title: string,
    subtitle: string,
    layout: any,
    mediaPath: string,
    mediaType: 'video' | 'image',
    callout: any = null,
    secondaryPath?: string,
    secondaryType?: 'video' | 'image',
    additionalPaths?: string[],
    numberOverlays?: any[]
  ) {
    const startTime = Math.round(timeCursor * 100) / 100;
    const endTime = Math.round((timeCursor + clipDuration) * 100) / 100;
    timeCursor = endTime;

    stillExtractionList.push({
      id,
      timestamp: Math.round((startTime + 1.1) * 100) / 100,
    });

    clips.push({
      beatIndex: beatIndex++,
      chapterIndex: 1,
      text: `${id}: ${title} — ${subtitle}`,
      startTime,
      endTime,
      clipPath: mediaPath,
      mediaType,
      layout,
      layoutData: {
        title,
        subtitle,
        tag: id,
        coords: 'SHOWCASE CATALOG',
        stamp: 'LIVE PREVIEW',
      },
      secondaryClipPath: secondaryPath,
      secondaryMediaType: secondaryType,
      additionalClipPaths: additionalPaths,
      kenBurns: mediaType === 'image',
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: numberOverlays || [],
      callout,
    });
  }

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 1: SCREEN LAYOUTS (L01 - L18)
  // ═══════════════════════════════════════════════════════════════════════
  console.log('📦 Building Section 1: 18 Screen Layouts (L01 - L18)...');

  // L01: full_bleed_cinematic
  addClip(
    'L01',
    '[L01] FULL BLEED CINEMATIC',
    '100% Full-Screen Edge-to-Edge 16:9 Standard',
    'full_bleed_cinematic',
    clipElvisBuild,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[L01] FULL BLEED CINEMATIC',
      line2: 'Standard 16:9 Documentary Full-Frame Video',
      themeColor: 'gold',
    }
  );

  // L02: ambient_blur_frame
  addClip(
    'L02',
    '[L02] AMBIENT BLUR FRAME',
    'Centered Frame with Blurred Mirror Backdrop Padding',
    'ambient_blur_frame',
    clipDoorPng,
    'image',
    {
      type: 'editorial_lower_third',
      line1: '[L02] AMBIENT BLUR FRAME',
      line2: 'No Black Bars for Vertical/Archival Formats',
      themeColor: 'amber',
    }
  );

  // L03: vintage_crt_monitor
  addClip(
    'L03',
    '[L03] VINTAGE CRT MONITOR',
    'Retro Phosphor Scanlines & Curved CRT Glass Distortion',
    'vintage_crt_monitor',
    clipWomanPolice,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[L03] VINTAGE CRT MONITOR',
      line2: 'Archival Broadcast & Surveillance TV Look',
      themeColor: 'cyan',
    }
  );

  // L04: editorial_sidebar_column (The problematic one from user feedback)
  addClip(
    'L04',
    '[L04] EDITORIAL SIDEBAR COLUMN',
    '72% Video Left / 28% Beige Dossier Column Right',
    'editorial_sidebar_column',
    clipInsideTent,
    'video',
    {
      type: 'newspaper_headline',
      line1: '[L04] EDITORIAL SIDEBAR COLUMN',
      line2: 'Split Layout with Right Metadata Column',
      themeColor: 'crimson',
    }
  );

  // L05: open_case_binder
  addClip(
    'L05',
    '[L05] OPEN CASE BINDER',
    'Folded Manila Detective Dossier Folder on Dark Table',
    'open_case_binder',
    clipDoorPng,
    'image',
    {
      type: 'court_transcript_card',
      line1: '[L05] OPEN CASE BINDER',
      line2: 'Investigative Case Folder for Official Files',
      themeColor: 'slate',
    }
  );

  // L06: forensic_drafting_table
  addClip(
    'L06',
    '[L06] FORENSIC DRAFTING TABLE',
    'Blueprint Grid Background with GPS Coordinate Rulers',
    'forensic_drafting_table',
    clipMap,
    'video',
    {
      type: 'map_pingeotag',
      line1: '[L06] FORENSIC DRAFTING TABLE',
      line2: 'Architectural Grid & Survey Data Overlay',
      themeColor: 'emerald',
    }
  );

  // L07: museum_archive_matte
  addClip(
    'L07',
    '[L07] MUSEUM ARCHIVE MATTE',
    'Charcoal Mat Board Frame with Archival Caption Plaque',
    'museum_archive_matte',
    clipWidePng,
    'image',
    {
      type: 'editorial_lower_third',
      line1: '[L07] MUSEUM ARCHIVE MATTE',
      line2: 'Gallery Matting for Historical Photography',
      themeColor: 'gold',
    }
  );

  // L08: desktop_corkboard
  addClip(
    'L08',
    '[L08] DESKTOP CORKBOARD',
    'Realistic Cork Bulletin Board with Pushpins & Paper',
    'desktop_corkboard',
    clipDoorPng,
    'image',
    {
      type: 'editorial_lower_third',
      line1: '[L08] DESKTOP CORKBOARD',
      line2: 'Detective Notice Board Evidence Presentation',
      themeColor: 'amber',
    }
  );

  // L09: hero_graphic_centerpiece
  addClip(
    'L09',
    '[L09] HERO GRAPHIC CENTERPIECE',
    'Centered Floating Hero Card with Vignetted Accent Glow',
    'hero_graphic_centerpiece',
    clipWidePng,
    'image',
    {
      type: 'odometer_stat',
      line1: '[L09] HERO GRAPHIC CENTERPIECE',
      line2: 'Focal Display for Key Documents & Badges',
      themeColor: 'cyan',
    }
  );

  // L10: illuminated_lightbox
  addClip(
    'L10',
    '[L10] ILLUMINATED LIGHTBOX',
    'Backlit Photographer Light Table with 35mm Slide Frame',
    'illuminated_lightbox',
    clipDoorPng,
    'image',
    {
      type: 'editorial_lower_third',
      line1: '[L10] ILLUMINATED LIGHTBOX',
      line2: 'Radiology / Slide Negatives Archival Presentation',
      themeColor: 'slate',
    }
  );

  // L11: filmstrip_spool_reel
  addClip(
    'L11',
    '[L11] FILMSTRIP SPOOL REEL',
    '35mm Celluloid Film Sprocket Holes Horizontal Frame',
    'filmstrip_spool_reel',
    clipElvisGlimpse,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[L11] FILMSTRIP SPOOL REEL',
      line2: 'Motion Picture Film Strip Flashback Aesthetic',
      themeColor: 'gold',
    }
  );

  // L12: magnifying_loupe_inspector
  addClip(
    'L12',
    '[L12] MAGNIFYING LOUPE INSPECTOR',
    'Circular Optical Lens Zooming into Document Detail',
    'magnifying_loupe_inspector',
    clipWidePng,
    'image',
    {
      type: 'editorial_lower_third',
      line1: '[L12] MAGNIFYING LOUPE',
      line2: 'Fine-Print Document Inspection Effect',
      themeColor: 'emerald',
    }
  );

  // L13: split_dual_screen (Multi-Asset)
  addClip(
    'L13',
    '[L13] SPLIT DUAL SCREEN',
    '50/50 Side-by-Side Dual Perspective with Divider',
    'split_dual_screen',
    clipElvisBuild,
    'video',
    {
      type: 'split_milestone_card',
      line1: '[L13] SPLIT DUAL SCREEN',
      line2: 'Direct 50/50 Contrast (Left vs Right)',
      themeColor: 'amber',
    },
    clipInsideTent,
    'video'
  );

  // L14: parallax_triptych_gallery (Multi-Asset)
  addClip(
    'L14',
    '[L14] PARALLAX TRIPTYCH GALLERY',
    '3 Staggered Vertical Panels (33% Each) with Parallax',
    'parallax_triptych_gallery',
    clipElvisElevation,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[L14] TRIPTYCH GALLERY',
      line2: '3 Vertical Panels Moving at Staggered Speeds',
      themeColor: 'cyan',
    },
    clipOldWoman,
    'video',
    [clipTents]
  );

  // L15: quad_surveillance_matrix (Multi-Asset)
  addClip(
    'L15',
    '[L15] QUAD SURVEILLANCE MATRIX',
    '4-Way 2x2 CCTV Matrix with Live Timestamps',
    'quad_surveillance_matrix',
    clipWomanPolice,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[L15] QUAD MATRIX',
      line2: '4-Camera Police CCTV Security Grid',
      themeColor: 'crimson',
    },
    clipInsideTent,
    'video',
    [clipTents, clipElvisBuild]
  );

  // L16: horizon_top_bottom_split (Multi-Asset)
  addClip(
    'L16',
    '[L16] HORIZON TOP/BOTTOM SPLIT',
    '50/50 Cinematic Letterbox Split (Top vs Bottom)',
    'horizon_top_bottom_split',
    clipMap,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[L16] HORIZON SPLIT',
      line2: 'Top Clip vs Bottom Clip Letterbox Contrast',
      themeColor: 'gold',
    },
    clipTents,
    'video'
  );

  // L17: polaroid_scatter_desk (Multi-Asset)
  addClip(
    'L17',
    '[L17] POLAROID SCATTER DESK',
    'Multiple Angled Polaroid Snapshots on Wooden Desk',
    'polaroid_scatter_desk',
    clipDoorPng,
    'image',
    {
      type: 'editorial_lower_third',
      line1: '[L17] POLAROID SCATTER',
      line2: 'Organic Tabletop Polaroid Collage',
      themeColor: 'amber',
    },
    clipWidePng,
    'image',
    [clipElvisPhoto]
  );

  // L18: red_string_pinboard (Multi-Asset)
  addClip(
    'L18',
    '[L18] RED STRING PINBOARD',
    'Detective Conspiracy Wall with Red Connecting String',
    'red_string_pinboard',
    clipAndyBales,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[L18] RED STRING PINBOARD',
      line2: 'Investigative Network Evidence Board',
      themeColor: 'crimson',
    },
    clipElvisPhoto,
    'video',
    [clipOldWoman]
  );

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 2: DOCUMENTARY TEXT CALLOUTS (C01 - C20)
  // ═══════════════════════════════════════════════════════════════════════
  console.log('📦 Building Section 2: 20 Text Callouts (C01 - C20)...');

  // C01: newspaper_headline
  addClip(
    'C01',
    '[C01] NEWSPAPER HEADLINE',
    'LA Times Press Banner with Yellow Highlighter Sweep',
    'full_bleed_cinematic',
    clipTents,
    'video',
    {
      type: 'newspaper_headline',
      line1: '[C01] NEWSPAPER HEADLINE',
      line2: 'L.A. TIMES // MAN BUILDS INSULATED HOMES FOR HOMELESS',
      spokenTrigger: 'newspaper',
      themeColor: 'gold',
    }
  );

  // C02: editorial_lower_third
  addClip(
    'C02',
    '[C02] EDITORIAL LOWER THIRD',
    'Clean Professional Documentary Subject Tag',
    'full_bleed_cinematic',
    clipElvisElevation,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[C02] ELVIS SUMMERS',
      line2: 'FOUNDER // STARTING HUMAN PROJECT • SOUTH LA',
      spokenTrigger: 'Elvis',
      themeColor: 'gold',
    }
  );

  // C03: odometer_stat
  addClip(
    'C03',
    '[C03] ODOMETER STAT',
    'Animated Rolling Number Counter with Context Metric',
    'full_bleed_cinematic',
    clipTents,
    'video',
    {
      type: 'odometer_stat',
      line1: '[C03] 150,000 CHILDREN',
      line2: 'UNSHELTERED STUDENTS STATEWIDE IN CALIFORNIA',
      spokenTrigger: '150,000',
      themeColor: 'crimson',
    }
  );

  // C04: map_pingeotag
  addClip(
    'C04',
    '[C04] MAP PIN GEOTAG',
    'GPS Coordinates Badge & Street Location Identifier',
    'full_bleed_cinematic',
    clipMap,
    'video',
    {
      type: 'map_pingeotag',
      line1: '[C04] 54TH & HOOVER STREET',
      line2: 'SOUTH CENTRAL LOS ANGELES • 34.0522° N, 118.2437° W',
      spokenTrigger: 'South Los Angeles',
      themeColor: 'amber',
    }
  );

  // C05: editorial_quote
  addClip(
    'C05',
    '[C05] EDITORIAL QUOTE',
    'Magazine Pull-Quote Card with Serif Quotation Marks',
    'full_bleed_cinematic',
    clipOldWoman,
    'video',
    {
      type: 'editorial_quote',
      line1: '[C05] "EVERYBODY ON THAT BLOCK KNEW HER NAME"',
      line2: 'THEY KNEW HER LAUGH, THEN LEFT HER OUT ON THE DIRT',
      spokenTrigger: 'knew her name',
      themeColor: 'gold',
    }
  );

  // C06: redacted_dossier
  addClip(
    'C06',
    '[C06] REDACTED DOSSIER',
    'Classified Government Black-Marker Reveal Card',
    'full_bleed_cinematic',
    clipWomanPolice,
    'video',
    {
      type: 'redacted_dossier',
      line1: '[C06] CITY COUNCIL DIRECTIVE 2016-B',
      line2: 'CONFIDENTIAL MEMO ON SIDEWALK ENCAMPMENT REMOVAL',
      spokenTrigger: 'directive',
      themeColor: 'crimson',
    }
  );

  // C07: court_transcript_card
  addClip(
    'C07',
    '[C07] COURT TRANSCRIPT CARD',
    'Official Deposition Transcript with Line Q&A',
    'full_bleed_cinematic',
    clipElvisBuild,
    'video',
    {
      type: 'court_transcript_card',
      line1: '[C07] U.S. DISTRICT COURT DEPOSITION',
      line2: 'SUMMERS V. CITY OF LOS ANGELES // CIVIL CASE #16-012',
      spokenTrigger: 'court',
      themeColor: 'slate',
    }
  );

  // C08: wiretap_intercept
  addClip(
    'C08',
    '[C08] WIRETAP INTERCEPT',
    'Surveillance Audio Waveform Monitor Header',
    'full_bleed_cinematic',
    clipWomanPolice,
    'video',
    {
      type: 'wiretap_intercept',
      line1: '[C08] FREQUENCY 460.125 MHZ // LIVE INTERCEPT',
      line2: 'LAPD 77TH STREET DIVISION DISPATCH RECORDING',
      spokenTrigger: 'dispatch',
      themeColor: 'emerald',
    }
  );

  // C09: police_crime_sheet
  addClip(
    'C09',
    '[C09] POLICE CRIME SHEET',
    'Official Municipal Police Violation Incident Sheet',
    'full_bleed_cinematic',
    clipTents,
    'video',
    {
      type: 'police_crime_sheet',
      line1: '[C09] MUNICIPAL CODE VIOLATION 56.11',
      line2: 'UNAUTHORIZED WOODEN STRUCTURE ON PUBLIC SIDEWALK',
      spokenTrigger: 'violation',
      themeColor: 'crimson',
    }
  );

  // C10: forensic_data_card
  addClip(
    'C10',
    '[C10] FORENSIC DATA CARD',
    'Audit Telemetry Data Box with Metric Indicators',
    'full_bleed_cinematic',
    clipMap,
    'video',
    {
      type: 'forensic_data_card',
      line1: '[C10] $2.0 BILLION BOND MEASURE HHH',
      line2: 'COST PER UNIT: $550,000 • COMPLETION DEFICIT: 78%',
      spokenTrigger: 'billion',
      themeColor: 'cyan',
    }
  );

  // C11: polaroid_snapshot
  addClip(
    'C11',
    '[C11] POLAROID SNAPSHOT',
    'Vintage Polaroid Card with Handwritten Sharpie Caption',
    'full_bleed_cinematic',
    clipOldWoman,
    'video',
    {
      type: 'polaroid_snapshot',
      line1: '[C11] IRENE "SMOKEY" MCGEE',
      line2: 'First Resident of Tiny House #01 • April 2015',
      spokenTrigger: 'Smokey',
      themeColor: 'amber',
    }
  );

  // C12: typewriter_paper
  addClip(
    'C12',
    '[C12] TYPEWRITER PAPER',
    'Aged Manila Note Typed Letter-by-Letter with SFX',
    'full_bleed_cinematic',
    clipElvisGlimpse,
    'video',
    {
      type: 'typewriter_paper',
      line1: '[C12] "NOBODY WAS HELPING HER."',
      line2: '"SO I WENT TO HOME DEPOT WITH $450 OF MY OWN MONEY."',
      spokenTrigger: 'helping',
      themeColor: 'gold',
    }
  );

  // C13: marker_circle
  addClip(
    'C13',
    '[C13] MARKER CIRCLE',
    'Hand-Drawn Animated Red Marker Drawing Viewer Attention',
    'full_bleed_cinematic',
    clipDoorPng,
    'image',
    {
      type: 'marker_circle',
      line1: '[C13] DEADBOLT LOCK MECHANISM',
      line2: 'Key Safety Feature: First Locked Door in 10 Years',
      spokenTrigger: 'lock',
      themeColor: 'crimson',
    }
  );

  // C14: archival_evidence_tag
  addClip(
    'C14',
    '[C14] ARCHIVAL EVIDENCE TAG',
    'Brown Manila Evidence Tag with Red Stamp "EXHIBIT A"',
    'full_bleed_cinematic',
    clipElvisBuild,
    'video',
    {
      type: 'archival_evidence_tag',
      line1: '[C14] PHYSICAL EVIDENCE // EXHIBIT 01',
      line2: 'SOLAR PANEL + 12V BATTERY POWER UNIT',
      spokenTrigger: 'evidence',
      themeColor: 'amber',
    }
  );

  // C15: social_tweet_card
  addClip(
    'C15',
    '[C15] SOCIAL X/TWEET CARD',
    'Accurate Dark-Mode Tweet Card with Verified Badge',
    'full_bleed_cinematic',
    clipElvisElevation,
    'video',
    {
      type: 'social_tweet_card',
      line1: '[C15] @ElvisSummers',
      line2: 'They just impounded 3 houses while people were at work. Unreal.',
      spokenTrigger: 'tweet',
      themeColor: 'cyan',
    }
  );

  // C16: reddit_thread_card
  addClip(
    'C16',
    '[C16] REDDIT THREAD CARD',
    'Subreddit Post Card with Upvotes & Comment Header',
    'full_bleed_cinematic',
    clipTents,
    'video',
    {
      type: 'reddit_thread_card',
      line1: '[C16] r/losangeles • 4.2k upvotes',
      line2: 'Why is LAPD spending thousands seizing $500 tiny houses?',
      spokenTrigger: 'reddit',
      themeColor: 'amber',
    }
  );

  // C17: caution_tape_banner
  addClip(
    'C17',
    '[C17] CAUTION TAPE BANNER',
    'Yellow Police Crime Tape Running Across Frame',
    'full_bleed_cinematic',
    clipWomanPolice,
    'video',
    {
      type: 'caution_tape_banner',
      line1: '[C17] MUNICIPAL ENFORCEMENT ZONE',
      line2: 'POLICE LINE DO NOT CROSS // HAZARD CLEARANCE',
      spokenTrigger: 'caution',
      themeColor: 'gold',
    }
  );

  // C18: split_milestone_card
  addClip(
    'C18',
    '[C18] SPLIT MILESTONE CARD',
    'Chronological Timeline Milestone Badge Progression',
    'full_bleed_cinematic',
    clipThanking,
    'video',
    {
      type: 'split_milestone_card',
      line1: '[C18] TIMELINE: APRIL 2015 ➔ FEBRUARY 2016',
      line2: 'From Viral Internet Campaign to City Seizure Order',
      spokenTrigger: 'timeline',
      themeColor: 'gold',
    }
  );

  // C19: fullscreen_chapter_title
  addClip(
    'C19',
    '[C19] FULLSCREEN CHAPTER TITLE',
    'Cinematic Bold Chapter Title Card for Scene Transitions',
    'full_bleed_cinematic',
    clipElvisGlimpse,
    'video',
    {
      type: 'fullscreen_chapter_title',
      line1: '[C19] CHAPTER 01',
      line2: 'THE MAN WHO REFUSED TO WALK PAST',
      spokenTrigger: 'chapter',
      themeColor: 'gold',
    }
  );

  // C20: karaoke_captions
  addClip(
    'C20',
    '[C20] KARAOKE CAPTIONS',
    'Spoken-Word Highlight Subtitle Delivery Band',
    'full_bleed_cinematic',
    clipElvisBuild,
    'video',
    {
      type: 'karaoke_captions',
      line1: '[C20] For 10 years, a 60-year-old grandmother slept on bare ground',
      line2: 'DYNAMIC SPEECH SYNCHRONIZED CAPTIONS',
      spokenTrigger: 'grandmother',
      themeColor: 'gold',
    }
  );

  // ═══════════════════════════════════════════════════════════════════════
  // SECTION 3: NUMBER OVERLAYS (N01 - N04)
  // ═══════════════════════════════════════════════════════════════════════
  console.log('📦 Building Section 3: 4 Number Overlays (N01 - N04)...');

  // N01: dollar_badge
  addClip(
    'N01',
    '[N01] DOLLAR BADGE',
    'Animated Gold Dollar Stat Pill Popping at Spoken Amount',
    'full_bleed_cinematic',
    clipElvisBuild,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[N01] DOLLAR BADGE TRIGGER',
      line2: 'Spoken Amount: "$450" Hardware Trip',
      themeColor: 'gold',
    },
    undefined,
    undefined,
    undefined,
    [
      {
        type: 'dollar_count',
        value: 450,
        formatted: '$450',
        label: 'INITIAL HARDWARE COST',
        startTime: 0.2,
        endTime: 2.1,
      },
    ]
  );

  // N02: percent_badge
  addClip(
    'N02',
    '[N02] PERCENT BADGE',
    'Emerald Statistic Pill for Rates & Ratios',
    'full_bleed_cinematic',
    clipTents,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[N02] PERCENTAGE BADGE',
      line2: 'Spoken Metric: "85%" Unsheltered Surge',
      themeColor: 'emerald',
    },
    undefined,
    undefined,
    undefined,
    [
      {
        type: 'percentage',
        value: 85,
        formatted: '85%',
        label: 'UNSHELTERED SURGE',
        startTime: 0.2,
        endTime: 2.1,
      },
    ]
  );

  // N03: metric_odometer
  addClip(
    'N03',
    '[N03] METRIC ODOMETER',
    'Rolling Counter for Large Population Figures',
    'full_bleed_cinematic',
    clipMap,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[N03] METRIC ODOMETER',
      line2: 'Spoken Quantity: "150,000" Students',
      themeColor: 'crimson',
    },
    undefined,
    undefined,
    undefined,
    [
      {
        type: 'number_count',
        value: 150000,
        formatted: '150,000',
        label: 'HOMELESS CHILDREN',
        startTime: 0.2,
        endTime: 2.1,
      },
    ]
  );

  // N04: date_stamp
  addClip(
    'N04',
    '[N04] DATE STAMP',
    'Corner Archival Year Badge',
    'full_bleed_cinematic',
    clipOldWoman,
    'video',
    {
      type: 'editorial_lower_third',
      line1: '[N04] DATE / YEAR STAMP',
      line2: 'Chronological Anchor: EST. 2015',
      themeColor: 'amber',
    },
    undefined,
    undefined,
    undefined,
    [
      {
        type: 'stat_badge',
        value: 2015,
        formatted: 'APRIL 2015',
        label: 'ORIGIN DATE',
        startTime: 0.2,
        endTime: 2.1,
      },
    ]
  );

  // ═══════════════════════════════════════════════════════════════════════
  // TIMELINE ASSEMBLY & SAVE
  // ═══════════════════════════════════════════════════════════════════════
  const timeline: Timeline = {
    masterAudioPath: fs.existsSync(masterAudio) ? masterAudio : '',
    totalDuration: Math.round(timeCursor * 100) / 100,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(timeline, null, 2));

  console.log(`\n📋 SHOWCASE TIMELINE READY:`);
  console.log(`   - Total Clips: ${clips.length}`);
  console.log(`   - Total Duration: ${timeline.totalDuration}s (~${Math.round(timeline.totalDuration / 60 * 10) / 10} min)`);
  console.log(`   - Master Audio: ${timeline.masterAudioPath}`);
  console.log(`   - Output Video: ${finalVideoPath}`);
  console.log(`\n🚀 Starting Remotion Render now...`);

  await renderTimelineVideo(timelineJsonPath, finalVideoPath, (clipIdx, total) => {
    const pct = Math.round(((clipIdx + 1) / total) * 100);
    console.log(`  ⏳ [Render Progress] Clip ${clipIdx + 1}/${total} (${pct}%)`);
  });

  console.log(`\n✅ VIDEO RENDER COMPLETE: ${finalVideoPath}`);

  // ═══════════════════════════════════════════════════════════════════════
  // STILL EXTRACTION
  // ═══════════════════════════════════════════════════════════════════════
  console.log(`\n📸 Extracting high-res still images for every item into:`);
  console.log(`   ${stillsDir}\n`);

  for (const item of stillExtractionList) {
    const stillOut = path.join(stillsDir, `${item.id}.jpg`);
    const tsStr = item.timestamp.toFixed(2);
    try {
      execSync(
        `ffmpeg -y -ss ${tsStr} -i "${finalVideoPath}" -vframes 1 -q:v 2 "${stillOut}"`,
        { stdio: 'ignore' }
      );
      console.log(`  📸 Stored: ${item.id}.jpg (at ${tsStr}s)`);
    } catch (e: any) {
      console.warn(`  ⚠️ Could not extract still for ${item.id}: ${e.message}`);
    }
  }

  console.log(`\n🎉 ALL DONE!`);
  console.log(`📁 Final Showcase Video: ${finalVideoPath}`);
  console.log(`📁 All Still Images: ${stillsDir}`);
}

generateShowcaseCatalog().catch((err) => {
  console.error('❌ Failed to generate showcase catalog:', err);
  process.exit(1);
});
