import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline } from '@repo/shared';

async function runRemotionTest() {
  console.log('🧪 Testing Remotion React Video Engine Render...');

  const outDir = path.resolve(process.cwd(), 'output', 'test_remotion');
  fs.mkdirSync(outDir, { recursive: true });

  const timelineJsonPath = path.join(outDir, 'test_timeline.json');
  const finalVideoPath = path.join(outDir, 'remotion_showcase.mp4');

  const testTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: 12,
    outputPath: finalVideoPath,
    clips: [
      {
        beatIndex: 0,
        chapterIndex: 0,
        text: 'Chapter intro and title card',
        startTime: 0,
        endTime: 3,
        clipPath: null,
        mediaType: 'image',
        kenBurns: true,
        transitionType: 'cut',
        transitionDuration: 0,
        numberOverlays: [],
        callout: {
          type: 'full_screen_title',
          line1: 'Beacon Hill Investigation',
          line2: 'Special Documentary Report',
          themeColor: 'gold',
          startTime: 0.2,
          endTime: 2.8,
        },
      },
      {
        beatIndex: 1,
        chapterIndex: 0,
        text: 'Suspect identification and background',
        startTime: 3,
        endTime: 6,
        clipPath: null,
        mediaType: 'image',
        kenBurns: true,
        transitionType: 'cut',
        transitionDuration: 0,
        numberOverlays: [],
        callout: {
          type: 'lower_third',
          line1: 'Steven Irwin',
          line2: 'Cabin Builder & Suspect',
          themeColor: 'cyan',
          startTime: 0.2,
          endTime: 2.8,
        },
      },
      {
        beatIndex: 2,
        chapterIndex: 0,
        text: 'Arrest location details',
        startTime: 6,
        endTime: 9,
        clipPath: null,
        mediaType: 'image',
        kenBurns: true,
        transitionType: 'cut',
        transitionDuration: 0,
        numberOverlays: [],
        callout: {
          type: 'location_badge',
          line1: 'SEATTLE, WA • BEACON HILL',
          line2: 'Dr. José Rizal Park',
          themeColor: 'amber',
          startTime: 0.2,
          endTime: 2.8,
        },
      },
      {
        beatIndex: 3,
        chapterIndex: 0,
        text: 'Bail amount and criminal charges',
        startTime: 9,
        endTime: 12,
        clipPath: null,
        mediaType: 'image',
        kenBurns: true,
        transitionType: 'cut',
        transitionDuration: 0,
        numberOverlays: [],
        callout: {
          type: 'stat_callout',
          line1: '$35,000 BAIL',
          line2: 'KING COUNTY SUPERIOR COURT',
          themeColor: 'crimson',
          startTime: 0.2,
          endTime: 2.8,
        },
      },
    ],
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(testTimeline, null, 2));

  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 REMOTION TEST SUCCEEDED!`);
  console.log(`📁 Video saved to: ${finalVideoPath}`);
}

runRemotionTest().catch((err) => {
  console.error('❌ Remotion test error:', err);
  process.exit(1);
});
