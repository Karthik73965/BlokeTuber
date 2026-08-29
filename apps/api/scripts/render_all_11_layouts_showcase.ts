import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

async function renderAll11LayoutsShowcase() {
  console.log('🎬 [11-LayoutsShowcase] Building & Rendering all 11 Unique Light-Themed Documentary Layouts (Blank Media, Zero Text)...');

  const outDir = path.resolve(process.cwd(), 'output', 'showcase_11_layouts');
  fs.mkdirSync(outDir, { recursive: true });

  const timelineJsonPath = path.join(outDir, 'all_11_layouts_timeline.json');
  const finalVideoPath = path.join(outDir, 'all_11_light_documentary_layouts.mp4');

  const clips: TimelineClip[] = [
    // 1. FULL-BLEED CINEMATIC
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'Layout 1: Full-Bleed 2.35:1 Letterbox Cinema',
      startTime: 0,
      endTime: 3.5,
      clipPath: null,
      mediaType: 'image',
      layout: 'full_bleed_cinematic',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 2. AMBIENT BLUR FRAME (High-Key Light Ambient)
    {
      beatIndex: 1,
      chapterIndex: 0,
      text: 'Layout 2: High-Key Luminous Ambient Blur Frame',
      startTime: 3.5,
      endTime: 7.0,
      clipPath: null,
      mediaType: 'image',
      layout: 'ambient_blur_frame',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 3. VINTAGE CRT MONITOR (1990s Retro Beige Terminal)
    {
      beatIndex: 2,
      chapterIndex: 0,
      text: 'Layout 3: Retro 1990s Beige CRT Broadcast Monitor',
      startTime: 7.0,
      endTime: 10.5,
      clipPath: null,
      mediaType: 'image',
      layout: 'vintage_crt_monitor',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 4. FILMSTRIP SPOOL REEL (Celluloid Negative on Warm Ivory Paper)
    {
      beatIndex: 3,
      chapterIndex: 0,
      text: 'Layout 4: 35mm Celluloid Negative Filmstrip on Warm Ivory Paper',
      startTime: 10.5,
      endTime: 14.0,
      clipPath: null,
      mediaType: 'image',
      layout: 'filmstrip_spool_reel',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 5. EDITORIAL SIDEBAR COLUMN (72/28 Video + Ivory Data Rail)
    {
      beatIndex: 4,
      chapterIndex: 0,
      text: 'Layout 5: 72/28 Asymmetric Editorial Column',
      startTime: 14.0,
      endTime: 17.5,
      clipPath: null,
      mediaType: 'image',
      layout: 'editorial_sidebar_column',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 6. RED STRING PINBOARD (Light Blonde Corkboard + Red Strings)
    {
      beatIndex: 5,
      chapterIndex: 0,
      text: 'Layout 6: Light Blonde Corkboard with Red Strings & 3D Swoop',
      startTime: 17.5,
      endTime: 21.0,
      clipPath: null,
      mediaType: 'image',
      layout: 'red_string_pinboard',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 7. HORIZON TOP/BOTTOM SPLIT (Dual Horizon Seam)
    {
      beatIndex: 6,
      chapterIndex: 0,
      text: 'Layout 7: Horizontal Top/Bottom 50/50 Horizon Split',
      startTime: 21.0,
      endTime: 24.5,
      clipPath: null,
      secondaryClipPath: null,
      mediaType: 'image',
      secondaryMediaType: 'image',
      layout: 'horizon_top_bottom_split',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 8. PARALLAX TRIPTYCH GALLERY (3-Panel Parallax on Gallery Floor)
    {
      beatIndex: 7,
      chapterIndex: 0,
      text: 'Layout 8: 3-Panel Parallax Triptych Gallery',
      startTime: 24.5,
      endTime: 28.0,
      clipPath: null,
      mediaType: 'image',
      layout: 'parallax_triptych_gallery',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 9. QUAD SURVEILLANCE MATRIX (2x2 Multi-Angle CCTV Grid)
    {
      beatIndex: 8,
      chapterIndex: 0,
      text: 'Layout 9: 2x2 Forensic Surveillance Multi-Camera Matrix',
      startTime: 28.0,
      endTime: 31.5,
      clipPath: null,
      mediaType: 'image',
      layout: 'quad_surveillance_matrix',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 10. POLAROID SCATTER DESK (Organic Photos on Blonde Oak)
    {
      beatIndex: 9,
      chapterIndex: 0,
      text: 'Layout 10: Organic Polaroid Photo Scatter on Blonde Oak',
      startTime: 31.5,
      endTime: 35.0,
      clipPath: null,
      mediaType: 'image',
      layout: 'polaroid_scatter_desk',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },

    // 11. MAGNIFYING LOUPE INSPECTOR (Circular Optical Lens on Archival Map)
    {
      beatIndex: 10,
      chapterIndex: 0,
      text: 'Layout 11: Circular Optical Magnifying Loupe on Archival Map',
      startTime: 35.0,
      endTime: 38.5,
      clipPath: null,
      mediaType: 'image',
      layout: 'magnifying_loupe_inspector',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null,
    },
  ];

  const showcaseTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: 38.5,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  console.log(`🎯 Rendering all 11 Light-Themed Documentary Scene Layouts.`);

  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 11-LAYOUT SHOWCASE (LIGHT THEME) RENDER COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

renderAll11LayoutsShowcase().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
