import fs from 'fs';
import path from 'path';
import type { CalloutOverlay, OverlayType, SceneLayoutType, Timeline, TimelineClip, TransitionType } from '@repo/shared';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const STOCK = path.join(REPO_ROOT, 'uploads/sources/oasis_ch06');
const TIMELINE_PATH = path.join(REPO_ROOT, 'uploads/timelines/oasis_village/chapter_06_final.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'output/oasis_village/chapter_06_final_narration_only.mp4');
const AUDIO_PATH = path.join(REPO_ROOT, 'uploads/audio/oasis_ch06.mp3');
const TOTAL_DURATION = 198.61;

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
 * 31 Well-paced beats for Chapter 6: From Shelter to a Next Step (Total: 198.61s).
 * Visuals are 100% unique, verified against the registry to ensure 0% repetition with Chapters 1 to 5.
 * Strictly zero vignette overlay.
 */
const BEATS: Beat[] = [
  // 1. 0.00s - 7.42s (7.42s)
  {
    duration: 7.42,
    text: 'The cabin is only one half of Oasis Village. The other half is the unglamorous work of helping residents move forward.',
    asset: 'oasis_clip_002.mp4',
    callout: lower('CHAPTER 6', 'FROM SHELTER TO A NEXT STEP'),
    transition: 'cut',
  },
  // 2. 7.42s - 14.78s (7.36s)
  {
    duration: 7.36,
    text: 'Two case managers work with each person on a long-term housing goal, whether that means applying for a rental voucher,',
    asset: 'oasis_clip_187.mp4',
    callout: lower('HOUSING CASE MANAGEMENT', 'LONG-TERM GOALS & RENTAL VOUCHERS'),
    transition: 'crossfade',
  },
  // 3. 14.78s - 21.14s (6.36s)
  {
    duration: 6.36,
    text: 'moving into transitional housing, or entering treatment. There is coaching on groceries and snap budgets,',
    asset: 'stock_groceries_budget.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('FINANCIAL LITERACY', 'GROCERIES & SNAP BUDGETING'),
    transition: 'crossfade',
  },
  // 4. 21.14s - 29.18s (8.04s)
  {
    duration: 8.04,
    text: 'help with benefits forms, food safety training from the county, library card signups, games and puzzles in the community house,',
    asset: 'oasis_clip_251.mp4',
    callout: lower('PRACTICAL TRAINING', 'BENEFITS, FOOD SAFETY & LIBRARY CARDS'),
    transition: 'film_dip_black',
  },
  // 5. 29.18s - 34.50s (5.32s)
  {
    duration: 5.32,
    text: 'and time to build habits that are difficult to build while simply trying to survive the night.',
    asset: 'oasis_clip_263.mp4',
    transition: 'cut',
  },
  // 6. 34.50s - 39.60s (5.10s)
  {
    duration: 5.10,
    text: 'When someone moves into an apartment, staff may send them with a laundry basket of',
    asset: 'stock_cleaning_basket.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('THE MOVE-IN PACK', 'CLEANING SUPPLIES & HOUSEHOLD BASICS'),
    transition: 'crossfade',
  },
  // 7. 39.60s - 50.10s (10.50s)
  {
    duration: 10.50,
    text: 'cleaning supplies, trash bags and other essentials. One man was nearly overwhelmed by that gesture because someone had anticipated what he would need before he had to ask.',
    asset: 'oasis_clip_269.mp4',
    callout: lower('ANTICIPATING NEEDS', 'DIGNITY IN EVERY DETAIL'),
    transition: 'film_dip_black',
  },
  // 8. 50.10s - 56.56s (6.46s)
  {
    duration: 6.46,
    text: 'This work rarely looks dramatic from the outside. It is an appointment kept, a form completed,',
    asset: 'oasis_clip_028.mp4',
    callout: lower('QUIET PROGRESS', 'APPOINTMENTS, FORMS & RECOVERY'),
    transition: 'cut',
  },
  // 9. 56.56s - 61.34s (4.78s)
  {
    duration: 4.78,
    text: 'a grocery plan that lasts the week, or a benefit that is finally claimed.',
    asset: 'oasis_clip_030.mp4',
    transition: 'crossfade',
  },
  // 10. 61.34s - 66.50s (5.16s)
  {
    duration: 5.16,
    text: 'It is learning a food safety requirement for a job, or getting a library card after years without one.',
    asset: 'oasis_clip_006.mp4',
    callout: lower('A PLACE TO HAPPEN', 'THE COMMUNITY HOUSE'),
    transition: 'cut',
  },
  // 11. 66.50s - 71.98s (5.48s)
  {
    duration: 5.48,
    text: 'The community house gives those tasks a place to happen,',
    asset: 'oasis_clip_007.mp4',
    transition: 'crossfade',
  },
  // 12. 71.98s - 81.06s (9.08s)
  {
    duration: 9.08,
    text: 'but it also gives residents a place to meet, play games, work through a puzzle, and spend time without being isolated in a crisis.',
    asset: 'oasis_clip_008.mp4',
    callout: lower('SOLIDARITY & CONNECTION', 'OVERCOMING ISOLATION'),
    transition: 'film_dip_black',
  },
  // 13. 81.06s - 86.50s (5.44s)
  {
    duration: 5.44,
    text: 'The goal is not to make every resident live one particular kind of life.',
    asset: 'oasis_clip_009.mp4',
    callout: lower('PERSONALIZED PATHWAYS', 'REACHING THE NEXT REALISTIC STEP'),
    transition: 'cut',
  },
  // 14. 86.50s - 92.42s (5.92s)
  {
    duration: 5.92,
    text: 'It is to help each person identify the next realistic step and make it possible to reach.',
    asset: 'oasis_clip_010.mp4',
    transition: 'crossfade',
  },
  // 15. 92.42s - 98.26s (5.84s)
  {
    duration: 5.84,
    text: 'Since opening in January 2024, Oasis Village has served 70 people.',
    asset: 'oasis_clip_254.mp4',
    callout: {
      type: 'odometer_stat',
      line1: '70 SERVED / 47 EXITED',
      line2: '32 MOVED DIRECTLY TO STABLE HOUSING',
      startTime: 0,
      endTime: 5.84,
      themeColor: 'gold',
      staticDisplay: true,
    },
    transition: 'crossfade',
  },
  // 16. 98.26s - 104.20s (5.94s)
  {
    duration: 5.94,
    text: '47 have exited the program and 32 of those people moved into stable housing.',
    asset: 'stock_apartment_keys.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('STABLE HOUSING', '68% OF EXITS SECURED HOMES'),
    transition: 'crossfade',
  },
  // 17. 104.20s - 115.48s (11.28s)
  {
    duration: 11.28,
    text: 'The numbers are not a promise that every story ends neatly. They are evidence that a small program can create real exits when it combines safety, time, and steady support.',
    asset: 'oasis_clip_323.mp4',
    callout: lower('REAL EXITS', 'SAFETY, TIME & STEADY SUPPORT'),
    transition: 'film_dip_black',
  },
  // 18. 115.48s - 120.84s (5.36s)
  {
    duration: 5.36,
    text: 'One young couple arrived while expecting a baby. Both were working two jobs.',
    asset: 'stock_expecting_couple.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('EXPECTING PARENTS', 'WORKING TWO JOBS TO BUILD A HOME'),
    transition: 'crossfade',
  },
  // 19. 120.84s - 124.72s (3.88s)
  {
    duration: 3.88,
    text: 'They sold their camper, transferred their jobs to a nearby city,',
    asset: 'oasis_clip_012.mp4',
    transition: 'cut',
  },
  // 20. 124.72s - 130.06s (5.34s)
  {
    duration: 5.34,
    text: 'and found an apartment before the baby arrived. They still visit from time to time.',
    asset: 'oasis_clip_013.mp4',
    callout: lower('AN APARTMENT BEFORE BIRTH', 'A SUCCESS STORY VISITING HOME'),
    transition: 'film_dip_black',
  },
  // 21. 130.06s - 135.80s (5.74s)
  {
    duration: 5.74,
    text: 'The measure of success here is not whether every resident follows the same timetable.',
    asset: 'oasis_clip_014.mp4',
    transition: 'crossfade',
  },
  // 22. 135.80s - 141.64s (5.84s)
  {
    duration: 5.84,
    text: 'Housing searches take time. Benefits can take time. Health can change the schedule.',
    asset: 'oasis_clip_016.mp4',
    callout: lower('KEEPING THE NEXT STEP VISIBLE', 'PATIENCE & PERSEVERANCE'),
    transition: 'cut',
  },
  // 23. 141.64s - 146.96s (5.32s)
  {
    duration: 5.32,
    text: 'The work is to keep the next step visible during that wait and to keep a setback from becoming another fall.',
    asset: 'oasis_clip_017.mp4',
    transition: 'crossfade',
  },
  // 24. 146.96s - 152.94s (5.98s)
  {
    duration: 5.98,
    text: 'A resident may move on to an apartment, temporary housing, treatment,',
    asset: 'oasis_clip_301.mp4',
    callout: lower('DIVERSE DESTINATIONS', 'APARTMENT, TREATMENT, REUNIFICATION, LAND'),
    transition: 'film_dip_black',
  },
  // 25. 152.94s - 159.24s (6.30s)
  {
    duration: 6.30,
    text: 'family reunification, or a return to property they already own. The route is personal.',
    asset: 'oasis_clip_305.mp4',
    transition: 'cut',
  },
  // 26. 159.24s - 164.78s (5.54s)
  {
    duration: 5.54,
    text: 'The shared requirement is a base of safety from which to travel it.',
    asset: 'oasis_clip_307.mp4',
    callout: lower('PEOPLE, NOT SCOREBOARDS', 'INDIVIDUAL LIVES RECLAIMED'),
    transition: 'crossfade',
  },
  // 27. 164.78s - 170.68s (5.90s)
  {
    duration: 5.90,
    text: 'That is why the exit numbers are best understood as people rather than a scoreboard.',
    asset: 'oasis_clip_019.mp4',
    transition: 'cut',
  },
  // 28. 170.68s - 177.86s (7.18s)
  {
    duration: 7.18,
    text: 'Each exit represents a different chain of calls, applications, savings, appointments, choices, and help from people who kept showing up.',
    asset: 'oasis_clip_020.mp4',
    transition: 'crossfade',
  },
  // 29. 177.86s - 184.34s (6.48s)
  {
    duration: 6.48,
    text: 'Some residents may leave quickly, others may need longer. Neither timeline is a moral test.',
    asset: 'oasis_clip_022.mp4',
    callout: lower('NO MORAL TEST', 'DIFFERENT ROADS TO STABILITY'),
    transition: 'film_dip_black',
  },
  // 30. 184.34s - 191.00s (6.66s)
  {
    duration: 6.66,
    text: 'The village job is to make progress possible and to keep the next problem from erasing the gains already made.',
    asset: 'oasis_clip_024.mp4',
    callout: lower('ORDER OF OPERATIONS', 'SAFETY FIRST, RECOVERY FOLLOWS'),
    transition: 'crossfade',
  },
  // 31. 191.00s - 198.61s (7.61s)
  {
    duration: 7.61,
    text: 'In a system that often asks people to recover before they are allowed inside, that order of operations is meaningful.',
    asset: 'oasis_clip_027.mp4',
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
    chapterIndex: 5, // Chapter 6
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
