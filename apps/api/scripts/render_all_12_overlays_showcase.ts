import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip, OverlayType } from '@repo/shared';

async function renderAll12OverlaysShowcase() {
  console.log('🎬 [12-OverlaysShowcase] Building & Rendering all 12 Documentary Overlays with spoken voiceover and real footage...');

  const outDir = path.resolve(process.cwd(), 'output', 'showcase_12_overlays');
  fs.mkdirSync(outDir, { recursive: true });

  const timelineJsonPath = path.join(outDir, 'all_12_overlays_timeline.json');
  const finalVideoPath = path.join(outDir, 'all_12_documentary_overlays.mp4');
  const masterAudio = path.join(outDir, 'master_overlays_narration.mp3');

  // Media references from RAW footage
  const rawDir = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\IKEA\\RAW';
  const carVideo = path.join(rawDir, 'CAR.mp4');
  const cloudsVideo = path.join(rawDir, 'CLOUDS NEAR IKEA.mp4');
  const busStopVideo = path.join(rawDir, 'busstop.mp4');
  const ikeaVideo = path.join(rawDir, 'IKEA.mp4');
  const cousinCarVideo = path.join(rawDir, 'cousin caAr.mp4');
  const womenSleepVideo = path.join(rawDir, 'women sleep.mp4');
  const womenTrollyVideo = path.join(rawDir, 'women with trolly near ikea.mp4');
  const busVideo = path.join(rawDir, 'bus.mp4');
  const depVideo = path.join(rawDir, 'dep.mp4');
  const assenVideo = path.join(rawDir, 'assen.mp4');
  const thinVideo = path.join(rawDir, 'thin.mp4');
  const steelVideo = path.join(rawDir, 'steel.mp4');

  const clipDuration = 3.5; // 3.5s per overlay = 42s total
  let timeCursor = 0;

  const overlaySpecs: Array<{
    type: OverlayType;
    num: string;
    name: string;
    desc: string;
    video: string;
  }> = [
    {
      type: 'film_dust_scratches',
      num: '01',
      name: 'FILM DUST & SCRATCHES',
      desc: '35mm Organic Debris, Lint & Micro-Scratches',
      video: carVideo,
    },
    {
      type: 'star_sparkle_bokeh',
      num: '02',
      name: 'STAR SPARKLES & BOKEH',
      desc: 'Drifting Luminous Light Orbs & Star Glints',
      video: cloudsVideo,
    },
    {
      type: 'film_burn_light_leak',
      num: '03',
      name: 'FILM BURN & LIGHT LEAKS',
      desc: 'Warm Amber / Crimson Edge Flare Flash',
      video: busStopVideo,
    },
    {
      type: 'vintage_crt_scanlines',
      num: '04',
      name: 'VINTAGE CRT SCANLINES',
      desc: 'Horizontal TV Raster Grid & Phosphor Vignette',
      video: ikeaVideo,
    },
    {
      type: 'camera_viewfinder_hud',
      num: '05',
      name: 'CAMERA VIEWFINDER HUD',
      desc: 'Live Rec Indicator, Frame Reticle & Timecode',
      video: cousinCarVideo,
    },
    {
      type: 'micro_film_grain',
      num: '06',
      name: '35MM SILVER HALIDE GRAIN',
      desc: 'Micro Organic Crystal Motion Texture',
      video: womenSleepVideo,
    },
    {
      type: 'archival_halftone_paper',
      num: '07',
      name: 'ARCHIVAL HALFTONE NEWSPRINT',
      desc: 'CMYK Tactile Print Dots & Aged Paper Fibers',
      video: womenTrollyVideo,
    },
    {
      type: 'cinematic_vignette',
      num: '08',
      name: 'CINEMATIC EDGE VIGNETTE',
      desc: 'Organic Breathing Radial Darkening',
      video: busVideo,
    },
    {
      type: 'chromatic_aberration',
      num: '09',
      name: 'CHROMATIC ABERRATION',
      desc: 'Prism Lens Color Split (Red / Cyan Fringing)',
      video: depVideo,
    },
    {
      type: 'sprocket_16mm_film_frame',
      num: '10',
      name: '16MM SPROCKET FILM FRAME',
      desc: 'Celluloid Border with Perforations & Kodak Stamp',
      video: assenVideo,
    },
    {
      type: 'rain_lens_streaks',
      num: '11',
      name: 'RAIN STREAKS & WET LENS',
      desc: 'Diagonal Falling Rain & Glass Condensation',
      video: thinVideo,
    },
    {
      type: 'vhs_glitch_tape_tear',
      num: '12',
      name: 'VHS GLITCH TAPE TEAR',
      desc: 'Horizontal Tracking Jitter & Noise Displacement',
      video: steelVideo,
    },
  ];

  const clips: TimelineClip[] = overlaySpecs.map((spec, i) => {
    const start = timeCursor;
    const end = (timeCursor += clipDuration);

    return {
      beatIndex: i,
      chapterIndex: 1,
      text: `Overlay ${spec.num}: ${spec.name}`,
      startTime: start,
      endTime: end,
      clipPath: spec.video,
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      overlay: spec.type,
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'editorial_lower_third',
        line1: `OVERLAY ${spec.num} // ${spec.name}`,
        line2: spec.desc,
        themeColor: i % 2 === 0 ? 'gold' : 'crimson',
      },
    };
  });

  const timeline: Timeline = {
    masterAudioPath: masterAudio,
    totalDuration: timeCursor,
    clips,
    outputPath: finalVideoPath,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(timeline, null, 2), 'utf-8');
  console.log(`💾 Timeline JSON saved to: ${timelineJsonPath}`);
  console.log(`⏱️ Total Duration: ${timeCursor.toFixed(1)}s (12 overlays × 3.5s each)`);
  console.log(`🎙️ Spoken Audio: ${masterAudio}`);
  console.log(`🎥 Rendering final showcase MP4 to: ${finalVideoPath}`);

  const renderedFile = await renderTimelineVideo(timelineJsonPath, finalVideoPath, (clipIdx, total) => {
    console.log(`⏳ Render progress: Clip ${clipIdx + 1}/${total}`);
  });

  console.log(`\n🎉 12-OVERLAYS SHOWCASE RENDER COMPLETE!`);
  console.log(`📁 Video: ${renderedFile}`);
}

renderAll12OverlaysShowcase().catch((err) => {
  console.error('❌ Render failed:', err);
  process.exit(1);
});
