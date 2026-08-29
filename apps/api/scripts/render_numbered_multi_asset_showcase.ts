import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

// Create 4 distinct, rich SVG test cards with clear numbered visual identities
function createSampleSvg(num: number, title: string, subtitle: string, bgGrad: string, accentColor: string): string {
  return `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad${num}" x1="0%" y1="0%" x2="100%" y2="100%">
        ${bgGrad}
      </linearGradient>
      <pattern id="grid${num}" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      </pattern>
    </defs>
    
    <!-- Background -->
    <rect width="100%" height="100%" fill="url(#grad${num})"/>
    <rect width="100%" height="100%" fill="url(#grid${num})"/>
    
    <!-- Large Distinct Number Badge -->
    <circle cx="160" cy="160" r="90" fill="${accentColor}" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.5))"/>
    <text x="160" y="195" font-family="Arial, Helvetica, sans-serif" font-size="100" font-weight="900" fill="#FFFFFF" text-anchor="middle">${num}</text>
    
    <!-- Title & Metadata -->
    <rect x="290" y="90" width="12" height="140" fill="${accentColor}"/>
    <text x="330" y="145" font-family="'Courier New', monospace" font-size="44" font-weight="900" fill="#FFFFFF" letter-spacing="2">${title}</text>
    <text x="330" y="195" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="${accentColor}" letter-spacing="4">${subtitle}</text>
    
    <!-- Visual Centerpiece Crosshairs -->
    <circle cx="640" cy="440" r="160" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="3" stroke-dasharray="10 10"/>
    <circle cx="640" cy="440" r="80" fill="none" stroke="${accentColor}" stroke-width="2"/>
    <line x1="640" y1="240" x2="640" y2="640" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <line x1="440" y1="440" x2="840" y2="440" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    
    <!-- Bottom Bar -->
    <rect x="0" y="680" width="1280" height="40" fill="rgba(0,0,0,0.6)"/>
    <text x="40" y="706" font-family="'Courier New', monospace" font-size="18" font-weight="800" fill="#9CA3AF">TARGET IDENTIFIER: ASSET-SLOT-#0${num} // 60FPS 4K COMPLIANT</text>
  </svg>`;
}

async function renderNumberedMultiAssetShowcase() {
  console.log('🎬 [MultiAssetNumberedShowcase] Rendering 3 Multi-Asset Layouts with 4 Distinct Numbered Images...');

  const outDir = path.resolve(process.cwd(), 'output', 'showcase_numbered_multi');
  const assetDir = path.join(outDir, 'assets');
  fs.mkdirSync(assetDir, { recursive: true });

  const svg1 = path.join(assetDir, 'image_1.svg');
  const svg2 = path.join(assetDir, 'image_2.svg');
  const svg3 = path.join(assetDir, 'image_3.svg');
  const svg4 = path.join(assetDir, 'image_4.svg');

  fs.writeFileSync(
    svg1,
    createSampleSvg(
      1,
      'PERIMETER NORTH CAMERA',
      'CAM-01 • LIVE TRACKING',
      '<stop offset="0%" stop-color="#064e3b"/><stop offset="100%" stop-color="#022c22"/>',
      '#10B981'
    )
  );

  fs.writeFileSync(
    svg2,
    createSampleSvg(
      2,
      'PRIMARY ROADWAY RADAR',
      'CAM-02 • HIGHWAY INTERCEPT',
      '<stop offset="0%" stop-color="#7c2d12"/><stop offset="100%" stop-color="#451a03"/>',
      '#F97316'
    )
  );

  fs.writeFileSync(
    svg3,
    createSampleSvg(
      3,
      'STRUCTURE REAR INFRARED',
      'CAM-03 • THERMAL RECON',
      '<stop offset="0%" stop-color="#831843"/><stop offset="100%" stop-color="#500724"/>',
      '#EC4899'
    )
  );

  fs.writeFileSync(
    svg4,
    createSampleSvg(
      4,
      'OVERHEAD DRONE SAT-FEED',
      'CAM-04 • AERIAL TELEMETRY',
      '<stop offset="0%" stop-color="#1e3a8a"/><stop offset="100%" stop-color="#0f172a"/>',
      '#38BDF8'
    )
  );

  const timelineJsonPath = path.join(outDir, 'numbered_multi_timeline.json');
  const finalVideoPath = path.join(outDir, 'numbered_multi_asset_showcase.mp4');

  const clips: TimelineClip[] = [
    // 1. QUAD SURVEILLANCE MATRIX (4 DISTINCT IMAGES AT SLOTS 1, 2, 3, 4)
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'Layout 1: Quad 4-Camera Matrix (Slots 1, 2, 3, 4)',
      startTime: 0,
      endTime: 5.0,
      clipPath: svg1, // Slot 1 (Top-Left)
      additionalClipPaths: [
        svg2, // Slot 2 (Top-Right)
        svg3, // Slot 3 (Bottom-Left)
        svg4, // Slot 4 (Bottom-Right)
      ],
      mediaType: 'image',
      layout: 'quad_surveillance_matrix',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'wiretap_intercept',
        line1: '4 SYNCHRONIZED FEEDS ACTIVE',
        line2: 'PERIMETER NORTH // SEATTLE PD',
        startTime: 0.1,
        endTime: 4.8,
      },
    },

    // 2. PARALLAX TRIPTYCH GALLERY (3 DISTINCT IMAGES AT SLOTS 1, 2, 3)
    {
      beatIndex: 1,
      chapterIndex: 0,
      text: 'Layout 2: 3-Panel Parallax Triptych (Slots 1, 2, 3)',
      startTime: 5.0,
      endTime: 10.0,
      clipPath: svg2, // Slot 2 (Center Hero Panel)
      additionalClipPaths: [
        svg1, // Slot 1 (Left Wing Panel)
        svg3, // Slot 3 (Right Wing Panel)
      ],
      mediaType: 'image',
      layout: 'parallax_triptych_gallery',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'editorial_quote',
        line1: 'THREE INDEPENDENT SURVEILLANCE ANGLES',
        line2: 'Investigative Review',
        startTime: 0.1,
        endTime: 4.8,
      },
    },

    // 3. RED STRING PINBOARD (3 DISTINCT IMAGES AT SLOTS 1, 2, 3)
    {
      beatIndex: 2,
      chapterIndex: 0,
      text: 'Layout 3: Red String Crime Pinboard (Slots 1, 2, 3)',
      startTime: 10.0,
      endTime: 15.0,
      clipPath: svg2, // Slot 2 (Center Hero Photo)
      additionalClipPaths: [
        svg1, // Slot 1 (Top-Left Clue Photo)
        svg3, // Slot 3 (Bottom-Left Clue Photo)
      ],
      mediaType: 'image',
      layout: 'red_string_pinboard',
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'redacted_dossier',
        line1: 'CONNECTED INVESTIGATION NODES',
        line2: 'CASE FILE #9402',
        startTime: 0.1,
        endTime: 4.8,
      },
    },
  ];

  const showcaseTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: 15.0,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  console.log(`🎯 Rendering Numbered Multi-Asset Showcase Video...`);

  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 NUMBERED MULTI-ASSET SHOWCASE COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

renderNumberedMultiAssetShowcase().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
