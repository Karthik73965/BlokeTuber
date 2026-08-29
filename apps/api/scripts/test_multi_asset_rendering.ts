import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

async function testMultiAssetRendering() {
  console.log('🎬 [MultiAssetTest] Verifying Multi-Asset Layout Rendering (Quad 4-Cam, Triptych 3-Panel, Pinboard 3-Photo)...');

  const outDir = path.resolve(process.cwd(), 'output', 'test_multi_asset');
  fs.mkdirSync(outDir, { recursive: true });

  const timelineJsonPath = path.join(outDir, 'multi_asset_timeline.json');
  const finalVideoPath = path.join(outDir, 'multi_asset_verification.mp4');

  const clips: TimelineClip[] = [
    // 1. QUAD SURVEILLANCE MATRIX (4-Camera Angle Feeds)
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'Multi-Asset Beat 1: Quad 4-Camera Surveillance Matrix',
      startTime: 0,
      endTime: 3.5,
      clipPath: null,
      additionalClipPaths: [null as any, null as any, null as any],
      mediaType: 'image',
      layout: 'quad_surveillance_matrix',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'wiretap_intercept',
        line1: '4-CAMERA SURVEILLANCE FEED',
        line2: 'PERIMETER SWEEP // SEATTLE PD',
        startTime: 0.1,
        endTime: 3.4,
      },
    },

    // 2. PARALLAX TRIPTYCH GALLERY (3-Panel Parallax with Distinct Media Slots)
    {
      beatIndex: 1,
      chapterIndex: 0,
      text: 'Multi-Asset Beat 2: 3-Panel Parallax Triptych Gallery',
      startTime: 3.5,
      endTime: 7.0,
      clipPath: null,
      additionalClipPaths: [null as any, null as any],
      mediaType: 'image',
      layout: 'parallax_triptych_gallery',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'editorial_quote',
        line1: 'THREE CRITICAL LOCATIONS IDENTIFIED',
        line2: 'Investigative Report',
        startTime: 0.1,
        endTime: 3.4,
      },
    },

    // 3. RED STRING PINBOARD (3 Clue Photos Connected by Red String)
    {
      beatIndex: 2,
      chapterIndex: 0,
      text: 'Multi-Asset Beat 3: Connected Crime Pinboard with Red String',
      startTime: 7.0,
      endTime: 10.5,
      clipPath: null,
      additionalClipPaths: [null as any, null as any],
      mediaType: 'image',
      layout: 'red_string_pinboard',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'redacted_dossier',
        line1: 'SUSPECT NETWORK CONNECTED',
        line2: 'CASE FILE #9402',
        startTime: 0.1,
        endTime: 3.4,
      },
    },

    // 4. RETRO 1990s BEIGE CRT BROADCAST MONITOR
    {
      beatIndex: 3,
      chapterIndex: 0,
      text: 'Multi-Asset Beat 4: Retro Beige CRT Terminal',
      startTime: 10.5,
      endTime: 14.0,
      clipPath: null,
      mediaType: 'image',
      layout: 'vintage_crt_monitor',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'police_crime_sheet',
        line1: 'ARREST RECORD // 1994',
        line2: 'King County Booking',
        startTime: 0.1,
        endTime: 3.4,
      },
    },
  ];

  const showcaseTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: 14.0,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 MULTI-ASSET INTEGRATION VERIFICATION COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

testMultiAssetRendering().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
