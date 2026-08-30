import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip } from '@repo/shared';

function createSampleSvg(title: string, subtitle: string, bgGrad: string, accentColor: string): string {
  return `<svg width="1280" height="720" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        ${bgGrad}
      </linearGradient>
      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)"/>
    <rect width="100%" height="100%" fill="url(#grid)"/>
    <circle cx="160" cy="160" r="90" fill="${accentColor}" filter="drop-shadow(0 10px 20px rgba(0,0,0,0.5))"/>
    <rect x="290" y="90" width="12" height="140" fill="${accentColor}"/>
    <text x="330" y="145" font-family="'Courier New', monospace" font-size="44" font-weight="900" fill="#FFFFFF" letter-spacing="2">${title}</text>
    <text x="330" y="195" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="700" fill="${accentColor}" letter-spacing="4">${subtitle}</text>
  </svg>`;
}

async function testEditorialSidebarImage() {
  console.log('🎬 [TestEditorialSidebar] Testing Editorial Sidebar Column Layout with Image...');

  const outDir = path.resolve(process.cwd(), 'output', 'test_editorial_sidebar');
  const assetDir = path.join(outDir, 'assets');
  fs.mkdirSync(assetDir, { recursive: true });

  const heroImage = path.join(assetDir, 'hero.svg');
  const contextImage = path.join(assetDir, 'context_bakersfield.svg');

  fs.writeFileSync(
    heroImage,
    createSampleSvg(
      'PRIMARY HERO EVIDENCE',
      'HERO 72% VIDEO REGION',
      '<stop offset="0%" stop-color="#1e1e24"/><stop offset="100%" stop-color="#0a0a0c"/>',
      '#D97706'
    )
  );

  fs.writeFileSync(
    contextImage,
    createSampleSvg(
      'BAKERSFIELD CA ARCHIVE',
      'OCTOBER 2023 RECORD',
      '<stop offset="0%" stop-color="#064e3b"/><stop offset="100%" stop-color="#022c22"/>',
      '#10B981'
    )
  );

  const timelineJsonPath = path.join(outDir, 'editorial_timeline.json');
  const finalVideoPath = path.join(outDir, 'test_editorial_sidebar_image.mp4');

  const clips: TimelineClip[] = [
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'The math of survival in Bakersfield, California.',
      startTime: 0,
      endTime: 4.0,
      clipPath: heroImage,
      additionalClipPaths: [contextImage],
      mediaType: 'image',
      secondaryMediaType: 'image',
      layout: 'editorial_sidebar_column',
      layoutData: {
        title: 'THE MATH OF SURVIVAL',
        tag: 'HOUSING CRISIS FORENSICS',
        coords: '35.37° N, 119.01° W',
        subtitle: 'OCTOBER 2023 • BAKERSFIELD, CA',
      },
      kenBurns: true,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays: [],
      callout: {
        type: 'forensic_data_card',
        line1: '$43 IN ACCOUNT',
        line2: '14 WEEK SHELTER WAITLIST',
        spokenTrigger: 'math of survival',
        startTime: 0.2,
        endTime: 3.8,
      },
    },
  ];

  const showcaseTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: 4.0,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  console.log(`🎯 Rendering Editorial Sidebar Layout with Context Image...`);

  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 EDITORIAL SIDEBAR IMAGE RENDER TEST COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

testEditorialSidebarImage().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
