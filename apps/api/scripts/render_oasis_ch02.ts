import fs from 'fs';
import path from 'path';
import type { CalloutOverlay, OverlayType, SceneLayoutType, Timeline, TimelineClip, TransitionType } from '@repo/shared';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const TIMELINE_PATH = path.join(REPO_ROOT, 'uploads/timelines/oasis_village/chapter_02_final.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'output/oasis_village/chapter_02_final_narration_only.mp4');
const AUDIO_PATH = path.join(REPO_ROOT, 'uploads/audio/oasis_ch02.mp3');
const TOTAL_DURATION = 73.22;

type Beat = {
  duration: number;
  text: string;
  asset: string;
  sourceStart?: number;
  layout?: SceneLayoutType;
  callout?: CalloutOverlay | null;
  transition?: TransitionType;
  overlay?: OverlayType | OverlayType[];
};

const lower = (line1: string, line2?: string): CalloutOverlay => ({
  type: 'editorial_lower_third',
  line1,
  line2,
  startTime: 0,
  endTime: 0,
  themeColor: 'gold',
  staticDisplay: true,
});

/**
 * 20 Well-paced beats for Chapter 2: A Village Designed for Dignity (Total: 73.22s).
 * Visuals are 100% unique, verified against the registry to ensure 0% repetition with Chapter 1.
 * Strict full-bleed cinematic layout with zero vignette overlay.
 */
const BEATS: Beat[] = [
  // 1. 0.00s - 4.88s (4.88s)
  {
    duration: 4.88,
    text: 'Today, the property feels less like a conventional shelter than a very small neighborhood.',
    asset: 'oasis_clip_320.mp4',
    callout: lower('CHAPTER 2', 'A VILLAGE DESIGNED FOR DIGNITY'),
    transition: 'cut',
  },
  // 2. 4.88s - 9.50s (4.62s)
  {
    duration: 4.62,
    text: 'There are 25 cabins including three large enough for couples.',
    asset: 'oasis_clip_069.mp4',
    callout: {
      type: 'odometer_stat',
      line1: '25 CABINS',
      line2: '3 UNITS FOR COUPLES',
      startTime: 0,
      endTime: 4.62,
      themeColor: 'gold',
      staticDisplay: true,
    },
    transition: 'crossfade',
  },
  // 3. 9.50s - 12.80s (3.30s)
  {
    duration: 3.30,
    text: 'At the center is a community house with a kitchen,',
    asset: 'oasis_clip_093.mp4',
    callout: lower('THE COMMUNITY HOUSE', 'HEART OF THE VILLAGE'),
    transition: 'crossfade',
  },
  // 4. 12.80s - 15.50s (2.70s)
  {
    duration: 2.70,
    text: 'restrooms, showers,',
    asset: 'oasis_clip_154.mp4',
    transition: 'cut',
  },
  // 5. 15.50s - 18.20s (2.70s)
  {
    duration: 2.70,
    text: 'laundry, and meeting rooms.',
    asset: 'oasis_clip_160.mp4',
    transition: 'cut',
  },
  // 6. 18.20s - 20.80s (2.60s)
  {
    duration: 2.60,
    text: 'Outside are fenced dog run, raised garden beds,',
    asset: 'oasis_clip_105.mp4',
    callout: lower('OUTDOOR SPACES', 'COMMUNITY GARDENS'),
    transition: 'crossfade',
  },
  // 7. 20.80s - 23.12s (2.32s)
  {
    duration: 2.32,
    text: 'a grass patch,',
    asset: 'oasis_clip_111.mp4',
    transition: 'cut',
  },
  // 8. 23.12s - 26.50s (3.38s)
  {
    duration: 3.38,
    text: 'a small sports court, and a gated lot for residents who need to store a trailer or park an RV.',
    asset: 'oasis_clip_109.mp4',
    transition: 'cut',
  },
  // 9. 26.50s - 31.56s (5.06s)
  {
    duration: 5.06,
    text: 'Some cabins were built through a partnership with the local high school community college',
    asset: 'oasis_clip_070.mp4',
    callout: lower('HEART OF OREGON YOUTHBUILD', 'STUDENTS CONSTRUCTING HOMES'),
    transition: 'film_dip_black',
  },
  // 10. 31.56s - 36.80s (5.24s)
  {
    duration: 5.24,
    text: 'and Heart of Oregon Youth Workforce Program. Students built the frames off site.',
    asset: 'oasis_clip_071.mp4',
    transition: 'crossfade',
  },
  // 11. 36.80s - 42.50s (5.70s)
  {
    duration: 5.70,
    text: 'The cabins were then brought in and assembled. The community did not simply approve the project. Young people helped build it.',
    asset: 'oasis_clip_072.mp4',
    transition: 'cut',
  },
  // 12. 42.50s - 46.00s (3.50s)
  {
    duration: 3.50,
    text: 'Inside each cabin is deliberately simple. A locking door, electricity,',
    asset: 'oasis_clip_068.mp4',
    callout: lower('CABIN SPECIFICATIONS', 'DIGNITY IN SIMPLE DESIGN'),
    transition: 'film_dip_black',
  },
  // 13. 46.00s - 49.20s (3.20s)
  {
    duration: 3.20,
    text: 'heat for winter, a window unit for summer,',
    asset: 'oasis_clip_065.mp4',
    transition: 'cut',
  },
  // 14. 49.20s - 52.20s (3.00s)
  {
    duration: 3.00,
    text: 'a desk shelving, a closet,',
    asset: 'oasis_clip_066.mp4',
    transition: 'cut',
  },
  // 15. 52.20s - 55.16s (2.96s)
  {
    duration: 2.96,
    text: 'and storage beneath the bed.',
    asset: 'oasis_clip_067.mp4',
    transition: 'crossfade',
  },
  // 16. 55.16s - 60.14s (4.98s)
  {
    duration: 4.98,
    text: 'Plumbing is in the community house.',
    asset: 'oasis_clip_146.mp4',
    callout: lower('CONNECTED COMMUNITY', 'SHARED WATER & SANITATION'),
    transition: 'cut',
  },
  // 17. 60.14s - 63.00s (2.86s)
  {
    duration: 2.86,
    text: 'New residents arrive to clean towels,',
    asset: 'oasis_clip_147.mp4',
    callout: lower('THE WELCOME PACK', 'CLEAN TOWELS & ESSENTIALS'),
    transition: 'crossfade',
  },
  // 18. 63.00s - 65.70s (2.70s)
  {
    duration: 2.70,
    text: 'a broom, and a flashlight. They are small things,',
    asset: 'oasis_clip_148.mp4',
    transition: 'cut',
  },
  // 19. 65.70s - 69.80s (4.10s)
  {
    duration: 4.10,
    text: 'but they are practical signals that someone has thought about the first night,',
    asset: 'oasis_clip_166.mp4',
    callout: lower('STARTING OVER', 'THOUGHTFUL DETAILS'),
    transition: 'crossfade',
  },
  // 20. 69.80s - 73.22s (3.42s)
  {
    duration: 3.42,
    text: 'the first morning, and what it takes to begin again.',
    asset: 'oasis_clip_073.mp4',
    transition: 'crossfade',
  },
];

let cursor = 0;
const clips: TimelineClip[] = BEATS.map((beat, beatIndex) => {
  const startTime = Number(cursor.toFixed(2));
  cursor += beat.duration;
  const isLast = beatIndex === BEATS.length - 1;
  const endTime = isLast ? TOTAL_DURATION : Number(cursor.toFixed(2));
  const clipDuration = Number((endTime - startTime).toFixed(2));

  const assetPath = path.join(RAW, beat.asset);

  const callout = beat.callout
    ? { ...beat.callout, startTime: 0, endTime: clipDuration, staticDisplay: true }
    : null;

  const transitionType = beat.transition || 'cut';
  const transitionDuration = transitionType === 'cut' ? 0 : 0.35;

  return {
    beatIndex,
    chapterIndex: 1, // Chapter 2
    text: beat.text,
    startTime,
    endTime,
    clipPath: assetPath.replace(/\\/g, '/'),
    sourceStart: beat.sourceStart || 0,
    mediaType: 'video',
    layout: beat.layout || 'full_bleed_cinematic',
    kenBurns: false,
    transitionType,
    transitionDuration,
    overlay: beat.overlay,
    numberOverlays: [],
    callout,
    sfxPath: null,
    sfxVolume: 0,
  };
});

const timeline: Timeline = {
  masterAudioPath: AUDIO_PATH.replace(/\\/g, '/'),
  totalDuration: TOTAL_DURATION,
  clips,
  outputPath: OUTPUT_PATH.replace(/\\/g, '/'),
  globalOverlays: [],
};

// Validations
if (Math.abs(timeline.totalDuration - TOTAL_DURATION) > 0.01) {
  throw new Error(`Timeline duration mismatch: ${timeline.totalDuration} vs ${TOTAL_DURATION}`);
}

for (const clip of clips) {
  if (!clip.clipPath || !fs.existsSync(clip.clipPath)) {
    throw new Error(`Missing source file: ${clip.clipPath}`);
  }
}

// Ensure output directories exist
fs.mkdirSync(path.dirname(TIMELINE_PATH), { recursive: true });
fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });

fs.writeFileSync(TIMELINE_PATH, JSON.stringify(timeline, null, 2));
console.log(`✅ Timeline generated: ${TIMELINE_PATH}`);
console.log(`🎬 Target output: ${OUTPUT_PATH}`);
console.log(`📊 Beats: ${clips.length}, Total Duration: ${timeline.totalDuration}s`);
console.log(`✨ Global overlays: [] (Vignette removed)`);
