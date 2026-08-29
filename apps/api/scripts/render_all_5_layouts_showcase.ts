import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

async function renderLayoutsShowcase() {
  console.log('🎬 [LayoutShowcase] Building & Rendering the 5 Core Scene Presentation Layouts...');

  const outDir = path.resolve(process.cwd(), 'output', 'showcase_layouts');
  fs.mkdirSync(outDir, { recursive: true });

  const timelineJsonPath = path.join(outDir, 'layouts_showcase_timeline.json');
  const finalVideoPath = path.join(outDir, 'all_5_scene_layouts_showcase.mp4');

  const clips: TimelineClip[] = [
    // 1. HERO GRAPHIC CENTERPIECE (3D Newspaper + Highlighter)
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'Layout 1: Hero Graphic Centerpiece — Newspaper with animated yellow highlighter',
      startTime: 0,
      endTime: 3.5,
      clipPath: null,
      mediaType: 'image',
      layout: 'hero_graphic_centerpiece',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'newspaper_headline',
        line1: 'LAYOUT 1: HERO GRAPHIC CENTERPIECE',
        line2: 'The Daily Chronicle • Investigative Desk',
        startTime: 0.1,
        endTime: 3.4,
      },
    },

    // 2. 3D INVESTIGATION DESK (Pinned photo on dark mahogany surface)
    {
      beatIndex: 1,
      chapterIndex: 0,
      text: 'Layout 2: 3D Investigation Desk — Pinned evidence card on dark mahogany surface',
      startTime: 3.5,
      endTime: 7.0,
      clipPath: null,
      mediaType: 'image',
      layout: 'desktop_corkboard',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'polaroid_snapshot',
        line1: 'Layout 2: 3D Investigation Desk',
        line2: 'EXHIBIT PHOTO // SEATTLE POLICE',
        startTime: 0.1,
        endTime: 3.4,
      },
    },

    // 3. AMBIENT BLURRED MIRROR FRAME (Floating 3D card over blurred mirror)
    {
      beatIndex: 2,
      chapterIndex: 0,
      text: 'Layout 3: Ambient Blur Frame — Floating isometric media card on blurred background',
      startTime: 7.0,
      endTime: 10.5,
      clipPath: null,
      mediaType: 'image',
      layout: 'ambient_blur_frame',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'odometer_stat',
        line1: '$35,000 BAIL',
        line2: 'Layout 3: Ambient Blur Frame',
        startTime: 0.1,
        endTime: 3.4,
      },
    },

    // 4. SPLIT DUAL SCREEN (Two media panels with center dividing line)
    {
      beatIndex: 3,
      chapterIndex: 0,
      text: 'Layout 4: Split Dual Screen — Side-by-side comparative perspectives',
      startTime: 10.5,
      endTime: 14.0,
      clipPath: null,
      secondaryClipPath: null,
      mediaType: 'image',
      secondaryMediaType: 'image',
      layout: 'split_dual_screen',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'split_milestone_card',
        line1: 'OCT 2024',
        line2: 'LAYOUT 4: SPLIT DUAL SCREEN',
        startTime: 0.1,
        endTime: 3.4,
      },
    },

    // 5. FULL-BLEED CINEMATIC (Letterbox 2.35:1 with film grain & editorial lower third)
    {
      beatIndex: 4,
      chapterIndex: 0,
      text: 'Layout 5: Full-Bleed Cinematic — True 4K letterbox b-roll with 35mm grain',
      startTime: 14.0,
      endTime: 17.5,
      clipPath: null,
      mediaType: 'image',
      layout: 'full_bleed_cinematic',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'editorial_lower_third',
        line1: 'LAYOUT 5: FULL-BLEED CINEMATIC',
        line2: '2.35:1 Letterbox • 35mm Film Grain',
        startTime: 0.1,
        endTime: 3.4,
      },
    },
  ];

  const showcaseTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: 17.5,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 5-LAYOUT SHOWCASE RENDER COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

renderLayoutsShowcase().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
