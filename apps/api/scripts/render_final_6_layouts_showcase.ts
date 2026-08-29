import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

async function renderFinal6LayoutsShowcase() {
  console.log('🎬 [6-LayoutsShowcase] Building & Rendering all 6 Distinct Documentary Layouts (Blank Media, Zero Text)...');

  const outDir = path.resolve(process.cwd(), 'output', 'showcase_6_layouts');
  fs.mkdirSync(outDir, { recursive: true });

  const timelineJsonPath = path.join(outDir, 'all_6_layouts_timeline.json');
  const finalVideoPath = path.join(outDir, 'all_6_unique_layouts_showcase.mp4');

  const clips: TimelineClip[] = [
    // 1. FULL-BLEED CINEMATIC (2.35:1 Letterbox + 35mm Film Grain)
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'Layout 1: Full-Bleed 2.35:1 Letterbox Cinema',
      startTime: 0,
      endTime: 4.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'full_bleed_cinematic',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 2. AMBIENT BLURRED MIRROR FRAME (Floating 3D Card over 50px Blur)
    {
      beatIndex: 1,
      chapterIndex: 0,
      text: 'Layout 2: Ambient Blurred Mirror Frame',
      startTime: 4.0,
      endTime: 8.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'ambient_blur_frame',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 3. VINTAGE CRT MONITOR (Retro Curved Glass TV with Scanlines & REC OSD)
    {
      beatIndex: 2,
      chapterIndex: 0,
      text: 'Layout 3: Vintage CRT Monitor with Scanlines & Timecode',
      startTime: 8.0,
      endTime: 12.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'vintage_crt_monitor',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 4. FILMSTRIP SPOOL REEL (Full-Width Horizontal 35mm Filmstrip Scroll)
    {
      beatIndex: 3,
      chapterIndex: 0,
      text: 'Layout 4: Horizontal 35mm Filmstrip Spool Reel',
      startTime: 12.0,
      endTime: 16.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'filmstrip_spool_reel',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 5. EDITORIAL SIDEBAR COLUMN (72/28 Asymmetric Video + Right Context Rail)
    {
      beatIndex: 4,
      chapterIndex: 0,
      text: 'Layout 5: 72/28 Asymmetric Editorial Column',
      startTime: 16.0,
      endTime: 20.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'editorial_sidebar_column',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 6. RED STRING PINBOARD (3D Connected Crime Pinboard with Red String & Camera Swoop)
    {
      beatIndex: 5,
      chapterIndex: 0,
      text: 'Layout 6: Connected 3D Crime Pinboard with Red String',
      startTime: 20.0,
      endTime: 24.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'red_string_pinboard',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },
  ];

  const showcaseTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: 24.0,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  console.log(`🎯 Rendering all 6 Distinct Documentary Layouts (Blank Media, Zero Text Overlays).`);

  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 6 DISTINCT LAYOUTS SHOWCASE RENDER COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

renderFinal6LayoutsShowcase().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
