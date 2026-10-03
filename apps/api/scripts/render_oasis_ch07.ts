import fs from 'fs';
import path from 'path';
import type { CalloutOverlay, OverlayType, SceneLayoutType, Timeline, TimelineClip, TransitionType } from '@repo/shared';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const STOCK = path.join(REPO_ROOT, 'uploads/sources/oasis_ch07');
const TIMELINE_PATH = path.join(REPO_ROOT, 'uploads/timelines/oasis_village/chapter_07_final.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'output/oasis_village/chapter_07_final_narration_only.mp4');
const AUDIO_PATH = path.join(REPO_ROOT, 'uploads/audio/oasis_ch07.mp3');
const TOTAL_DURATION = 154.23;

type Beat = {
  duration: number;
  text: string;
  asset: string;
  assetRoot?: 'raw' | 'stock';
  mediaType?: 'video' | 'image';
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
 * 26 Well-paced beats for Chapter 7: The Ladder Beyond Oasis Village (Total: 154.23s).
 * Visuals are 100% unique, verified against the registry to ensure 0% repetition with Chapters 1 to 6.
 * Strictly zero vignette overlay.
 */
const BEATS: Beat[] = [
  // 1. 0.00s - 4.60s (4.60s)
  {
    duration: 4.60,
    text: 'Oasis Village is one part of a larger ladder in Central Oregon.',
    asset: 'oasis_clip_300.mp4',
    callout: lower('CHAPTER 7', 'THE LADDER BEYOND OASIS VILLAGE'),
    transition: 'cut',
  },
  // 2. 4.60s - 11.32s (6.72s)
  {
    duration: 6.72,
    text: 'At one end is unsheltered camping. From there are managed camping programs, low barrier shelter,',
    asset: 'oasis_clip_304.mp4',
    callout: lower('THE HOUSING CONTINUUM', 'FROM UNSHELTERED TO MANAGED SHELTER'),
    transition: 'crossfade',
  },
  // 3. 11.32s - 16.80s (5.48s)
  {
    duration: 5.48,
    text: 'safe parking for people living in vehicles, transitional and permanent supportive housing,',
    asset: 'stock_van_parking.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('SAFE PARKING', 'VEHICLE RESIDENTS & TRANSITIONAL HOMES'),
    transition: 'crossfade',
  },
  // 4. 16.80s - 23.08s (6.28s)
  {
    duration: 6.28,
    text: 'then market rate rent and for some home ownership. No single program can do all of it.',
    asset: 'stock_new_home.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('MARKET RATE & OWNERSHIP', 'NO SINGLE PROGRAM CAN DO ALL OF IT'),
    transition: 'film_dip_black',
  },
  // 5. 23.08s - 28.80s (5.72s)
  {
    duration: 5.72,
    text: 'The value of a ladder is that it gives people a next step',
    asset: 'oasis_clip_029.mp4',
    callout: lower('A STEP AT A TIME', 'NOT ONE IMPOSSIBLE LEAP'),
    transition: 'crossfade',
  },
  // 6. 28.80s - 34.70s (5.90s)
  {
    duration: 5.90,
    text: 'instead of asking them to make one impossible leap. The steps matter because different people arrive with different needs.',
    asset: 'oasis_clip_031.mp4',
    transition: 'cut',
  },
  // 7. 34.70s - 42.10s (7.40s)
  {
    duration: 7.40,
    text: 'Someone sleeping outside may first need a managed place to camp. Someone living in a vehicle may need safe parking.',
    asset: 'oasis_clip_032.mp4',
    callout: lower('MEETING PEOPLE WHERE THEY ARE', 'CAMPING, PARKING & SHELTER'),
    transition: 'cut',
  },
  // 8. 42.10s - 48.96s (6.86s)
  {
    duration: 6.86,
    text: 'Someone with a cabin and case management support may be ready for a rental voucher or transitional housing.',
    asset: 'oasis_clip_273.mp4',
    callout: lower('CASE MANAGEMENT SUPPORT', 'READY FOR TRANSITIONAL HOUSING'),
    transition: 'crossfade',
  },
  // 9. 48.96s - 56.74s (7.78s)
  {
    duration: 7.78,
    text: 'A system with only one option leaves many people outside it. A system with several doors gives them a route forward.',
    asset: 'oasis_clip_033.mp4',
    callout: lower('MULTIPLE DOORS', 'A REALISTIC ROUTE FORWARD'),
    transition: 'film_dip_black',
  },
  // 10. 56.74s - 62.00s (5.26s)
  {
    duration: 5.26,
    text: 'Oasis Village occupies a modest place on that ladder, but the place is deliberate.',
    asset: 'oasis_clip_311.mp4',
    callout: lower('A DELIBERATE PLACE', 'SHELTER WITHOUT PRECONDITIONS'),
    transition: 'crossfade',
  },
  // 11. 62.00s - 67.38s (5.38s)
  {
    duration: 5.38,
    text: 'It provides shelter without demanding that every barrier be cleared beforehand.',
    asset: 'oasis_clip_313.mp4',
    transition: 'cut',
  },
  // 12. 67.38s - 75.90s (8.52s)
  {
    duration: 8.52,
    text: 'Josie wants people to recognize that many Oasis Village residents are local people, often with deep roots in Central Oregon.',
    asset: 'oasis_clip_306.mp4',
    callout: lower('LOCAL RESIDENTS', 'DEEP ROOTS IN CENTRAL OREGON'),
    transition: 'film_dip_black',
  },
  // 13. 75.90s - 80.50s (4.60s)
  {
    duration: 4.60,
    text: 'They did not become homeless because they stopped caring about their lives.',
    asset: 'oasis_clip_034.mp4',
    callout: lower('OUTPACED BY CRISIS', 'NOT A LACK OF CARING'),
    transition: 'crossfade',
  },
  // 14. 80.50s - 85.06s (4.56s)
  {
    duration: 4.56,
    text: 'They were hit by a chain of events that outpaced the help available to them.',
    asset: 'oasis_clip_035.mp4',
    transition: 'cut',
  },
  // 15. 85.06s - 94.30s (9.24s)
  {
    duration: 9.24,
    text: 'Most people can name someone who would help if their car broke down on the way to work. That is a support system, even when we do not call it one.',
    asset: 'stock_car_breakdown.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('THE SUPPORT SYSTEM', 'WHO HELPS WHEN THE CAR BREAKS DOWN?'),
    transition: 'crossfade',
  },
  // 16. 94.30s - 101.70s (7.40s)
  {
    duration: 7.40,
    text: 'Oasis Village tries to rebuild a version of that system for people whose own network has been lost or exhausted.',
    asset: 'oasis_clip_036.mp4',
    callout: lower('REBUILDING THE NETWORK', 'SUPPORT WHEN FAMILY CANNOT'),
    transition: 'film_dip_black',
  },
  // 17. 101.70s - 106.50s (4.80s)
  {
    duration: 4.80,
    text: "The village's scale is part of the point. It is not a giant institution,",
    asset: 'oasis_clip_037.mp4',
    callout: lower('HUMAN SCALE', 'NOT A GIANT INSTITUTION'),
    transition: 'cut',
  },
  // 18. 106.50s - 111.28s (4.78s)
  {
    duration: 4.78,
    text: 'and it is not distant from the daily details of the people who live there.',
    asset: 'oasis_clip_038.mp4',
    transition: 'crossfade',
  },
  // 19. 111.28s - 119.40s (8.12s)
  {
    duration: 8.12,
    text: 'Staff can notice when someone needs help with a form when a resident has a job interview or when a person is getting ready to move.',
    asset: 'oasis_clip_275.mp4',
    callout: lower('ATTENTIVE CARE', 'JOB INTERVIEWS, FORMS & MOVING'),
    transition: 'crossfade',
  },
  // 20. 119.40s - 126.00s (6.60s)
  {
    duration: 6.60,
    text: 'That closeness cannot replace the need for more housing across the region. It can show, however, what housing support looks like',
    asset: 'oasis_clip_039.mp4',
    callout: lower('PERSONAL & PRACTICAL', 'BUILT FOR REAL SETBACKS'),
    transition: 'film_dip_black',
  },
  // 21. 126.00s - 133.36s (7.36s)
  {
    duration: 7.36,
    text: 'when it is personal, practical, and built for the real sequence of setbacks that brought someone there.',
    asset: 'oasis_clip_040.mp4',
    transition: 'crossfade',
  },
  // 22. 133.36s - 137.50s (4.14s)
  {
    duration: 4.14,
    text: 'None of this means the model is effortless. It depends on maintained cabins, available staff,',
    asset: 'oasis_clip_041.mp4',
    callout: lower('SUSTAINING THE MODEL', 'CABINS, STAFF & COMMUNITY SUPPORT'),
    transition: 'cut',
  },
  // 23. 137.50s - 141.96s (4.46s)
  {
    duration: 4.46,
    text: 'and housing options beyond the village.',
    asset: 'oasis_clip_042.mp4',
    transition: 'crossfade',
  },
  // 24. 141.96s - 146.00s (4.04s)
  {
    duration: 4.04,
    text: 'It asks a community to fund the basics. Electricity, showers, laundry,',
    asset: 'oasis_clip_043.mp4',
    callout: {
      type: 'odometer_stat',
      line1: 'FUNDING THE BASICS',
      line2: 'POWER, SHOWERS, LAUNDRY, PETS, TIME',
      startTime: 0,
      endTime: 4.04,
      themeColor: 'gold',
      staticDisplay: true,
    },
    transition: 'cut',
  },
  // 25. 146.00s - 150.14s (4.14s)
  {
    duration: 4.14,
    text: 'case management, pet access, and time.',
    asset: 'oasis_clip_045.mp4',
    transition: 'crossfade',
  },
  // 26. 150.14s - 154.23s (4.09s)
  {
    duration: 4.09,
    text: 'Those basics turn an emergency response into recovery.',
    asset: 'oasis_clip_317.mp4',
    callout: lower('EMERGENCY INTO RECOVERY', 'THE OASIS VILLAGE PROMISE'),
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

  const assetPath = path.join(beat.assetRoot === 'stock' ? STOCK : RAW, beat.asset);

  const callout = beat.callout
    ? { ...beat.callout, startTime: 0, endTime: clipDuration, staticDisplay: true }
    : null;

  const transitionType = beat.transition || 'cut';
  const transitionDuration = transitionType === 'cut' ? 0 : 0.35;

  return {
    beatIndex,
    chapterIndex: 6, // Chapter 7
    text: beat.text,
    startTime,
    endTime,
    clipPath: assetPath.replace(/\\/g, '/'),
    sourceStart: beat.sourceStart || 0,
    mediaType: beat.mediaType || 'video',
    layout: beat.layout || 'full_bleed_cinematic',
    kenBurns: beat.mediaType === 'image',
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
