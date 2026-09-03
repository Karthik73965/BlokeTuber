import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

async function renderAll18LayoutsShowcase() {
  console.log('🎬 [18-LayoutsShowcase] Building & Rendering all 18 Documentary Screen Layouts with real footage...');

  const outDir = path.resolve(process.cwd(), 'output', 'showcase_18_layouts');
  fs.mkdirSync(outDir, { recursive: true });

  const timelineJsonPath = path.join(outDir, 'all_18_layouts_timeline.json');
  const finalVideoPath = path.join(outDir, 'all_18_documentary_screen_layouts.mp4');

  // Media references
  const rawDir = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\IKEA\\RAW';
  const stockDir = path.resolve(process.cwd(), 'output/11_where_renee_is_now_2026-09-03_00-01-12_f92069/stock');
  const masterAudio = path.resolve(process.cwd(), 'output/ikea_2026-09-02_23-58-01_9420b8/master_narration.mp3');

  const carVideo = path.join(rawDir, 'CAR.mp4');
  const busVideo = path.join(rawDir, 'bus.mp4');
  const busStopVideo = path.join(rawDir, 'busstop.mp4');
  const cloudsVideo = path.join(rawDir, 'CLOUDS NEAR IKEA.mp4');
  const assenVideo = path.join(rawDir, 'assen.mp4');

  const img1 = path.join(rawDir, '1.png');
  const img2 = path.join(rawDir, '2.png');
  const img3 = path.join(rawDir, '3.png');
  const img4 = path.join(rawDir, '4.png');

  const stockPhoto6 = path.join(stockDir, 'photo_6.jpg');
  const stockVideo0 = path.join(stockDir, 'video_0.mp4');
  const stockVideo1 = path.join(stockDir, 'video_1.mp4');
  const stockVideo2 = path.join(stockDir, 'video_2.mp4');
  const stockVideo3 = path.join(stockDir, 'video_3.mp4');

  const clipDuration = 3.0; // 3 seconds per layout
  let timeCursor = 0;

  const clips: TimelineClip[] = [
    // 01. FULL-BLEED CINEMATIC
    {
      beatIndex: 0,
      chapterIndex: 1,
      text: '01: Full-Bleed 2.35:1 Letterbox Cinema with 35mm Grain',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: carVideo,
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'editorial_lower_third',
        line1: '01 // FULL BLEED CINEMATIC',
        line2: '2.35:1 Anamorphic Letterbox + 35mm Grain',
        themeColor: 'gold',
      },
    },

    // 02. SPLIT DUAL SCREEN (NEW)
    {
      beatIndex: 1,
      chapterIndex: 1,
      text: '02: Split Dual Screen with Gold Vertical Divider',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: carVideo,
      secondaryClipPath: busStopVideo,
      mediaType: 'video',
      secondaryMediaType: 'video',
      layout: 'split_dual_screen',
      layoutData: {
        title: 'PERSPECTIVE COMPARISON',
        subtitle: 'ORIGIN vs DESTINATION',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'split_milestone_card',
        line1: '02 // SPLIT DUAL SCREEN',
        line2: '50/50 Dual Perspective + Gold Divider',
        themeColor: 'amber',
      },
    },

    // 03. OPEN CASE BINDER (NEW)
    {
      beatIndex: 2,
      chapterIndex: 1,
      text: '03: 3D Open Case Binder on Warm Blonde Oak Desk',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: img1,
      mediaType: 'image',
      layout: 'open_case_binder',
      layoutData: {
        title: 'MUNICIPAL CASE FILE #8492',
        subtitle: 'OFFICIAL HOUSING TRANSCRIPT • 2018',
        tag: 'EVIDENCE',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'court_transcript_card',
        line1: '03 // OPEN CASE BINDER',
        line2: '3D Folder + Metal Fasteners on Oak Desk',
        themeColor: 'slate',
      },
    },

    // 04. FORENSIC DRAFTING TABLE (NEW)
    {
      beatIndex: 3,
      chapterIndex: 1,
      text: '04: Forensic Drafting Table with Blueprint Grid & Ruler',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: img2,
      mediaType: 'image',
      layout: 'forensic_drafting_table',
      layoutData: {
        title: 'PARKING LOT BLUEPRINT',
        coords: 'RENTON, WA • 47.48° N, 122.21° W',
        stamp: 'SURVEY GRID ELEV +140M',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'forensic_data_card',
        line1: '04 // FORENSIC DRAFTING TABLE',
        line2: 'Blueprint Grid + Telemetry Header + Ruler',
        themeColor: 'cyan',
      },
    },

    // 05. ILLUMINATED LIGHTBOX (NEW)
    {
      beatIndex: 4,
      chapterIndex: 1,
      text: '05: Luminous Illuminated Lightbox Table with 35mm Slide Mount',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: stockPhoto6,
      mediaType: 'image',
      layout: 'illuminated_lightbox',
      layoutData: {
        title: '35MM ARCHIVAL SLIDE',
        subtitle: 'CONTACT SHEET // FRAME 24A',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'archival_evidence_tag',
        line1: '05 // ILLUMINATED LIGHTBOX',
        line2: 'Backlit Table + 35mm Slide Mount Frame',
        themeColor: 'crimson',
      },
    },

    // 06. MUSEUM ARCHIVE MATTE (NEW)
    {
      beatIndex: 5,
      chapterIndex: 1,
      text: '06: Museum Archive Mat Card on Warm Ivory Wall',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: img3,
      mediaType: 'image',
      layout: 'museum_archive_matte',
      layoutData: {
        title: 'EXHIBIT NO. 04',
        subtitle: 'KING COUNTY HISTORICAL ARCHIVE • 2019',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'editorial_quote',
        line1: '06 // MUSEUM ARCHIVE MATTE',
        line2: 'Ivory Wall + Gallery Matte Card Pullback',
        themeColor: 'gold',
      },
    },

    // 07. DESKTOP CORKBOARD (NEW)
    {
      beatIndex: 6,
      chapterIndex: 1,
      text: '07: Dark Mahogany Detective Desk with Taped Evidence Notes',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: img4,
      mediaType: 'image',
      layout: 'desktop_corkboard',
      layoutData: {
        notes: ['INCIDENT REPORT 04:18 AM', 'CASEWORKER LOG', 'TOWING NOTICE $420'],
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'polaroid_snapshot',
        line1: '07 // DESKTOP CORKBOARD',
        line2: 'Mahogany Desk + Blueprint Grid + Taped Clues',
        themeColor: 'amber',
      },
    },

    // 08. HERO GRAPHIC CENTERPIECE (NEW)
    {
      beatIndex: 7,
      chapterIndex: 1,
      text: '08: Hero Centerpiece Floating Card over Dimmed Background',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: stockVideo0,
      mediaType: 'video',
      layout: 'hero_graphic_centerpiece',
      layoutData: {
        title: 'HERO EVIDENCE CENTERPIECE',
        subtitle: 'PRIMARY DOCUMENTARY ASSET',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'editorial_lower_third',
        line1: '08 // HERO CENTERPIECE',
        line2: 'Floating Card over Atmospheric Dimmed Video',
        themeColor: 'cyan',
      },
    },

    // 09. AMBIENT BLUR FRAME
    {
      beatIndex: 8,
      chapterIndex: 1,
      text: '09: High-Key Luminous Ambient Blur Frame',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: stockPhoto6,
      mediaType: 'image',
      layout: 'ambient_blur_frame',
      layoutData: {
        title: '5:15 AM • RENTON, WA',
        subtitle: 'OVERCAST 42°F • PRE-DAWN HOUSING',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'newspaper_headline',
        line1: '09 // AMBIENT BLUR FRAME',
        line2: '3D Floating Glass + Ambient Mirror Card',
        themeColor: 'gold',
      },
    },

    // 10. VINTAGE CRT MONITOR
    {
      beatIndex: 9,
      chapterIndex: 1,
      text: '10: Retro 1990s Beige CRT Broadcast Monitor with Scanlines',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: stockVideo1,
      mediaType: 'video',
      layout: 'vintage_crt_monitor',
      layoutData: {
        title: 'POLICE DISPATCH AUDIO',
        tag: 'FREQ: 460.125 MHz',
        timestamp: 'OCTOBER 1995 • 04:18 AM',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'wiretap_intercept',
        line1: '10 // VINTAGE CRT MONITOR',
        line2: 'Retro 1990s Beige Terminal + Scanlines',
        themeColor: 'emerald',
      },
    },

    // 11. FILMSTRIP SPOOL REEL
    {
      beatIndex: 10,
      chapterIndex: 1,
      text: '11: 35mm Celluloid Negative Filmstrip Ribbon on Warm Ivory Paper',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: img1,
      mediaType: 'image',
      layout: 'filmstrip_spool_reel',
      layoutData: {
        title: 'CHRONOLOGICAL TIMELINE',
        tag: '35MM ARCHIVE REEL',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'newspaper_headline',
        line1: '11 // FILMSTRIP SPOOL REEL',
        line2: 'Celluloid Filmstrip Ribbon Scrolling Sideways',
        themeColor: 'gold',
      },
    },

    // 12. EDITORIAL SIDEBAR COLUMN
    {
      beatIndex: 11,
      chapterIndex: 1,
      text: '12: 72/28 Asymmetric Editorial Column with Context Data Rail',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: busVideo,
      additionalClipPaths: [img2],
      mediaType: 'video',
      layout: 'editorial_sidebar_column',
      layoutData: {
        title: 'EVICTION NOTICE',
        subtitle: 'VACATE BY 06:00 AM',
        tag: 'HOUSING CRISIS',
        coords: '47.4829° N, 122.2171° W',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'editorial_quote',
        line1: '12 // EDITORIAL SIDEBAR',
        line2: '72/28 Video on Left + Ivory Data Rail on Right',
        themeColor: 'slate',
      },
    },

    // 13. RED STRING PINBOARD
    {
      beatIndex: 12,
      chapterIndex: 1,
      text: '13: Blonde Corkboard with Red Strings & 3D Swoop',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: img3,
      additionalClipPaths: [img1, img4],
      mediaType: 'image',
      layout: 'red_string_pinboard',
      layoutData: {
        notes: ['FORD ECONOLINE', 'SOCIAL SECURITY $820/MO', 'PARKING ENFORCEMENT'],
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'archival_evidence_tag',
        line1: '13 // RED STRING PINBOARD',
        line2: 'Corkboard + Red Thread Clue Connections',
        themeColor: 'crimson',
      },
    },

    // 14. HORIZON TOP/BOTTOM SPLIT
    {
      beatIndex: 13,
      chapterIndex: 1,
      text: '14: 50/50 Horizon Split: Aerial Top + Ground Bottom',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: cloudsVideo,
      secondaryClipPath: carVideo,
      mediaType: 'video',
      secondaryMediaType: 'video',
      layout: 'horizon_top_bottom_split',
      layoutData: {
        title: 'DUAL PERSPECTIVE',
        subtitle: 'AERIAL SKYLINE vs GROUND REALITY',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'split_milestone_card',
        line1: '14 // HORIZON SPLIT',
        line2: '50/50 Aerial Top + Ground Bottom Seam',
        themeColor: 'cyan',
      },
    },

    // 15. PARALLAX TRIPTYCH GALLERY
    {
      beatIndex: 14,
      chapterIndex: 1,
      text: '15: 3-Panel Parallax Triptych on Bright Gallery Floor',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: stockVideo2,
      additionalClipPaths: [img1, img3],
      mediaType: 'video',
      layout: 'parallax_triptych_gallery',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'editorial_lower_third',
        line1: '15 // PARALLAX TRIPTYCH',
        line2: '3-Panel Gallery Wall + Depth Parallax Shift',
        themeColor: 'gold',
      },
    },

    // 16. QUAD SURVEILLANCE MATRIX
    {
      beatIndex: 15,
      chapterIndex: 1,
      text: '16: 2x2 Forensic Surveillance Multi-Camera Matrix',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: assenVideo,
      additionalClipPaths: [stockVideo0, stockVideo1, stockVideo3],
      mediaType: 'video',
      layout: 'quad_surveillance_matrix',
      layoutData: {
        camLabels: ['CAM 01 // PARKING ENTRANCE', 'CAM 02 // SIDEWALK TENT', 'CAM 03 // BUS STOP', 'CAM 04 // OVERHEAD'],
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'police_crime_sheet',
        line1: '16 // QUAD SURVEILLANCE',
        line2: '2x2 Multi-Angle Forensic CCTV Grid',
        themeColor: 'crimson',
      },
    },

    // 17. POLAROID SCATTER DESK
    {
      beatIndex: 16,
      chapterIndex: 1,
      text: '17: Organic Polaroid Photo Scatter on Blonde Oak Desk',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: img4,
      additionalClipPaths: [img1, img2],
      mediaType: 'image',
      layout: 'polaroid_scatter_desk',
      layoutData: {
        notes: ['PARKING PERMIT #12', 'REPAIR RECEIPTS', 'SEATTLE WINTER'],
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'polaroid_snapshot',
        line1: '17 // POLAROID SCATTER',
        line2: 'Organic Polaroid Photos on Blonde Oak Desk',
        themeColor: 'amber',
      },
    },

    // 18. MAGNIFYING LOUPE INSPECTOR
    {
      beatIndex: 17,
      chapterIndex: 1,
      text: '18: Circular Optical Magnifying Loupe on Archival Map',
      startTime: timeCursor,
      endTime: (timeCursor += clipDuration),
      clipPath: img2,
      mediaType: 'image',
      layout: 'magnifying_loupe_inspector',
      layoutData: {
        title: 'PROPERTY BOUNDARY SURVEY',
        coords: 'SECTOR 09 • RENTON',
        stamp: 'PUBLIC RIGHT-OF-WAY',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'map_pingeotag',
        line1: '18 // MAGNIFYING LOUPE',
        line2: 'Circular Optical Lens on Archival Map',
        themeColor: 'emerald',
      },
    },
  ];

  const showcaseTimeline: Timeline = {
    masterAudioPath: fs.existsSync(masterAudio) ? masterAudio : '',
    totalDuration: timeCursor,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  console.log(`🎯 Rendering all 18 Documentary Screen Layouts.`);

  await renderTimelineVideo(timelineJsonPath, finalVideoPath, (clipIdx, total) => {
    console.log(`  ⏳ Render progress: Clip ${clipIdx + 1}/${total}`);
  });

  console.log(`\n🎉 18-LAYOUT SHOWCASE RENDER COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

renderAll18LayoutsShowcase().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
