import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

async function renderAll8LayoutsShowcase() {
  console.log('🎬 [8-LayoutsShowcase] Building & Rendering all 8 Clean Documentary Layouts (Blank Media, Zero Text)...');

  const outDir = path.resolve(process.cwd(), 'output', 'showcase_8_layouts');
  fs.mkdirSync(outDir, { recursive: true });

  const timelineJsonPath = path.join(outDir, 'all_8_layouts_timeline.json');
  const finalVideoPath = path.join(outDir, 'all_8_documentary_layouts_clean.mp4');

  const clips: TimelineClip[] = [
    // 1. FULL-BLEED CINEMATIC (2.35:1 Letterbox + 35mm Film Grain)
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'Layout 1: Full-Bleed 2.35:1 Letterbox Cinema',
      startTime: 0,
      endTime: 3.5,
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
      startTime: 3.5,
      endTime: 7.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'ambient_blur_frame',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 3. 3D INVESTIGATION DESK (Physical Photo Card with Tape on Dark Mahogany Desk)
    {
      beatIndex: 2,
      chapterIndex: 0,
      text: 'Layout 3: 3D Investigation Desk with Physical Card',
      startTime: 7.0,
      endTime: 10.5,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'desktop_corkboard',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 4. MUSEUM ARCHIVE MATTE (Clean Ivory Museum Mat on Off-White Cardstock)
    {
      beatIndex: 3,
      chapterIndex: 0,
      text: 'Layout 4: Museum Archive Matte with Archival Stamp',
      startTime: 10.5,
      endTime: 14.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'museum_archive_matte',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 5. FORENSIC DRAFTING TABLE (Millimeter Coordinate Grid & Scale Ruler)
    {
      beatIndex: 4,
      chapterIndex: 0,
      text: 'Layout 5: Forensic Drafting Table with Technical Grid',
      startTime: 14.0,
      endTime: 17.5,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'forensic_drafting_table',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 6. ILLUMINATED LIGHTBOX (Backlit 35mm Slide Viewer with Frame Numbers)
    {
      beatIndex: 5,
      chapterIndex: 0,
      text: 'Layout 6: Illuminated Lightbox 35mm Slide Viewer',
      startTime: 17.5,
      endTime: 21.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'illuminated_lightbox',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 7. VINTAGE CRT MONITOR (Retro Curved Glass TV with Scanlines & REC OSD)
    {
      beatIndex: 6,
      chapterIndex: 0,
      text: 'Layout 7: Vintage CRT Monitor with Scanlines & Timecode',
      startTime: 21.0,
      endTime: 24.5,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'vintage_crt_monitor',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },

    // 8. OPEN CASE BINDER (Manila Case Binder on Blonde Oak Desk with Tabs)
    {
      beatIndex: 7,
      chapterIndex: 0,
      text: 'Layout 8: Open Manila Case Binder on Blonde Oak Desk',
      startTime: 24.5,
      endTime: 28.0,
      clipPath: null, // BLANK MEDIA
      mediaType: 'image',
      layout: 'open_case_binder',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // NO TEXT
    },
  ];

  const showcaseTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: 28.0,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  console.log(`🎯 Rendering all 8 Clean Documentary Layouts (Blank Media, Zero Text Overlays).`);

  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 8-LAYOUT CLEAN SHOWCASE RENDER COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

renderAll8LayoutsShowcase().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
