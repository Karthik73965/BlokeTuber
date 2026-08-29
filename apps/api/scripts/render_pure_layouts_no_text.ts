import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

async function renderPureLayoutsNoText() {
  console.log('🎬 [PureLayouts] Rendering Pure Scene Presentation Layouts (ZERO Text Overlays)...');

  const outDir = path.resolve(process.cwd(), 'output', 'pure_layouts');
  fs.mkdirSync(outDir, { recursive: true });

  const mediaDir = path.resolve(process.cwd(), 'output', 'sample_media');
  const mountainPath = path.join(mediaDir, 'sample_mountain.svg');
  const cityPath = path.join(mediaDir, 'sample_city.svg');
  const cabinPath = path.join(mediaDir, 'sample_forest_cabin.svg');

  const timelineJsonPath = path.join(outDir, 'pure_layouts_timeline.json');
  const finalVideoPath = path.join(outDir, 'pure_layouts_no_text.mp4');

  const clips: TimelineClip[] = [
    // 1. FULL-BLEED CINEMATIC (2.35:1 Letterbox + 35mm Grain + Ken Burns Push-In) - NO TEXT
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'Layout 1: Full-Bleed 2.35:1 Cinematic Letterbox',
      startTime: 0,
      endTime: 4.0,
      clipPath: mountainPath,
      mediaType: 'image',
      layout: 'full_bleed_cinematic',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // ZERO TEXT OVERLAYS
    },

    // 2. AMBIENT BLURRED MIRROR FRAME (Floating 3D Card over 50px Blur Background) - NO TEXT
    {
      beatIndex: 1,
      chapterIndex: 0,
      text: 'Layout 2: Ambient Blurred Mirror Frame',
      startTime: 4.0,
      endTime: 8.0,
      clipPath: cityPath,
      mediaType: 'image',
      layout: 'ambient_blur_frame',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // ZERO TEXT OVERLAYS
    },

    // 3. 3D INVESTIGATION DESK (Pinned Printout with Scotch Tape on Dark Mahogany) - NO TEXT
    {
      beatIndex: 2,
      chapterIndex: 0,
      text: 'Layout 3: 3D Investigation Desk with Physical Photo Printout',
      startTime: 8.0,
      endTime: 12.0,
      clipPath: cabinPath,
      mediaType: 'image',
      layout: 'desktop_corkboard',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // ZERO TEXT OVERLAYS
    },

    // 4. SPLIT DUAL SCREEN (Mountain on Left + City on Right + Dividing Line) - NO TEXT
    {
      beatIndex: 3,
      chapterIndex: 0,
      text: 'Layout 4: Split Dual Screen Comparative Feed',
      startTime: 12.0,
      endTime: 16.0,
      clipPath: mountainPath,
      secondaryClipPath: cityPath,
      mediaType: 'image',
      secondaryMediaType: 'image',
      layout: 'split_dual_screen',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // ZERO TEXT OVERLAYS
    },

    // 5. AMBIENT BLURRED MIRROR FRAME (Cabin Footage with Parallax Drift) - NO TEXT
    {
      beatIndex: 4,
      chapterIndex: 0,
      text: 'Layout 5: Ambient Blur Frame on Cabin Footage',
      startTime: 16.0,
      endTime: 20.0,
      clipPath: cabinPath,
      mediaType: 'image',
      layout: 'ambient_blur_frame',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: null, // ZERO TEXT OVERLAYS
    },
  ];

  const showcaseTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: 20.0,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  console.log(`🎯 Testing PURE scene layouts without any text overlays.`);

  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 PURE LAYOUTS (NO TEXT) SHOWCASE RENDER COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

renderPureLayoutsNoText().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
