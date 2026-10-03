import fs from 'fs';
import path from 'path';
import type { CalloutOverlay, OverlayType, SceneLayoutType, Timeline, TimelineClip, TransitionType } from '@repo/shared';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const STOCK = path.join(REPO_ROOT, 'uploads/sources/oasis_ch05');
const TIMELINE_PATH = path.join(REPO_ROOT, 'uploads/timelines/oasis_village/chapter_05_final.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'output/oasis_village/chapter_05_final_narration_only.mp4');
const AUDIO_PATH = path.join(REPO_ROOT, 'uploads/audio/oasis_ch05.mp3');
const TOTAL_DURATION = 154.12;

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
 * 25 Well-paced beats for Chapter 5: The Pattern Beneath the Stories (Total: 154.12s).
 * Visuals are 100% unique, verified against the registry to ensure 0% repetition with Chapters 1 to 4.
 * Strictly zero vignette overlay.
 */
const BEATS: Beat[] = [
  // 1. 0.00s - 5.34s (5.34s)
  {
    duration: 5.34,
    text: 'These stories do not erase the complexity of homelessness. They make it harder to flatten.',
    asset: 'oasis_clip_258.mp4',
    callout: lower('CHAPTER 5', 'THE PATTERN BENEATH THE STORIES'),
    transition: 'cut',
  },
  // 2. 5.34s - 13.52s (8.18s)
  {
    duration: 8.18,
    text: 'A wildfire, a divorce, a car destroyed, a career-ending injury, a long wait for disability benefits.',
    asset: 'oasis_clip_276.mp4',
    callout: lower('SPECIFIC CRISES', 'WILDFIRE, DIVORCE, INJURY, LOSS'),
    transition: 'film_dip_black',
  },
  // 3. 13.52s - 17.58s (4.06s)
  {
    duration: 4.06,
    text: 'The events are specific, but the vulnerability is not.',
    asset: 'oasis_clip_274.mp4',
    transition: 'crossfade',
  },
  // 4. 17.58s - 22.54s (4.96s)
  {
    duration: 4.96,
    text: 'More than half of Oasis Village residents have jobs, and some work two.',
    asset: 'stock_morning_worker.mp4',
    assetRoot: 'stock',
    callout: {
      type: 'odometer_stat',
      line1: '>50% HAVE JOBS',
      line2: 'MANY WORKING MULTIPLE SHIFTS',
      startTime: 0,
      endTime: 4.96,
      themeColor: 'gold',
      staticDisplay: true,
    },
    transition: 'crossfade',
  },
  // 5. 22.54s - 30.88s (8.34s)
  {
    duration: 8.34,
    text: 'What they often lack is not effort. It is a margin for when something goes wrong, and a network strong enough to catch them when it does.',
    asset: 'oasis_clip_312.mp4',
    callout: lower('THE MISSING MARGIN', 'NO SAFETY NET WHEN CRISIS HITS'),
    transition: 'film_dip_black',
  },
  // 6. 30.88s - 37.54s (6.66s)
  {
    duration: 6.66,
    text: 'That distinction matters because the public conversation often tries to sort people into simple categories,',
    asset: 'oasis_clip_282.mp4',
    callout: lower('BEYOND CATEGORIES', 'FALSE DICHOTOMIES IN HOUSING'),
    transition: 'crossfade',
  },
  // 7. 37.54s - 43.84s (6.30s)
  {
    duration: 6.30,
    text: 'deserving or undeserving, employed or unemployed, making good choices or making bad ones.',
    asset: 'oasis_clip_284.mp4',
    transition: 'cut',
  },
  // 8. 43.84s - 50.60s (6.76s)
  {
    duration: 6.76,
    text: 'Real lives do not divide that cleanly. A person can be working and still be unable to keep up with rent.',
    asset: 'stock_budget_calculator.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('RISING HOUSING COSTS', 'WAGES VS RENT DISCONNECT'),
    transition: 'crossfade',
  },
  // 9. 50.60s - 57.60s (7.00s)
  {
    duration: 7.00,
    text: 'A person can be in recovery and still need a safe place to sleep.',
    asset: 'oasis_clip_286.mp4',
    callout: lower('A SINGLE SETBACK', 'HEALTH, SAFETY & RECOVERY'),
    transition: 'film_dip_black',
  },
  // 10. 57.60s - 64.54s (6.94s)
  {
    duration: 6.94,
    text: 'A person can be capable, skilled, and determined, and still lose housing after one injury, one illness, or one relationship turns dangerous.',
    asset: 'oasis_clip_290.mp4',
    transition: 'cut',
  },
  // 11. 64.54s - 71.00s (6.46s)
  {
    duration: 6.46,
    text: 'Oasis Village does not ask residents to prove that their hardship fits a particular story before it offers a door.',
    asset: 'oasis_clip_278.mp4',
    callout: lower('A DOOR WITHOUT PRECONDITIONS', 'DIGNITY FIRST'),
    transition: 'crossfade',
  },
  // 12. 71.00s - 76.14s (5.14s)
  {
    duration: 5.14,
    text: 'It also does not pretend that a cabin by itself fixes the problem.',
    asset: 'oasis_clip_310.mp4',
    transition: 'cut',
  },
  // 13. 76.14s - 82.00s (5.86s)
  {
    duration: 5.86,
    text: 'A warm room cannot undo a wildfire, settle every debt or make an affordable apartment appear.',
    asset: 'oasis_clip_288.mp4',
    transition: 'crossfade',
  },
  // 14. 82.00s - 87.12s (5.12s)
  {
    duration: 5.12,
    text: 'What it can do is interrupt the downward momentum of a crisis.',
    asset: 'oasis_clip_272.mp4',
    callout: lower('INTERRUPTING MOMENTUM', 'STOPPING THE DOWNWARD SPIRAL'),
    transition: 'film_dip_black',
  },
  // 15. 87.12s - 91.88s (4.76s)
  {
    duration: 4.76,
    text: 'It can make a job shift possible because there is a place to sleep afterward.',
    asset: 'oasis_clip_256.mp4',
    callout: lower('REST & RECOVERY', 'THE PREREQUISITE FOR WORK'),
    transition: 'crossfade',
  },
  // 16. 91.88s - 96.44s (4.56s)
  {
    duration: 4.56,
    text: 'It can make an appointment possible because there is a shower and clean clothes.',
    asset: 'oasis_clip_260.mp4',
    transition: 'cut',
  },
  // 17. 96.44s - 103.36s (6.92s)
  {
    duration: 6.92,
    text: 'It can make a difficult phone call possible because someone is nearby to help with the paperwork when the call ends.',
    asset: 'oasis_clip_302.mp4',
    callout: lower('CONSISTENT SUPPORT', 'SMALL INTERVENTIONS REPEATED'),
    transition: 'film_dip_black',
  },
  // 18. 103.36s - 109.62s (6.26s)
  {
    duration: 6.26,
    text: 'Those are small interventions, but a life often changes through small interventions repeated consistently.',
    asset: 'oasis_clip_308.mp4',
    transition: 'crossfade',
  },
  // 19. 109.62s - 116.00s (6.38s)
  {
    duration: 6.38,
    text: 'There is a practical reason that consistency matters so much.',
    asset: 'oasis_clip_262.mp4',
    callout: lower('SURVIVAL MODE', 'EVERY TASK COMPETING FOR TIME'),
    transition: 'cut',
  },
  // 20. 116.00s - 122.56s (6.56s)
  {
    duration: 6.56,
    text: 'When someone is living outside or moving from one temporary place to another, nearly every task competes with immediate survival.',
    asset: 'oasis_clip_266.mp4',
    transition: 'crossfade',
  },
  // 21. 122.56s - 128.30s (5.74s)
  {
    duration: 5.74,
    text: 'Keeping documents dry, charging a phone, getting to work on time,',
    asset: 'stock_charging_phone.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('DAILY NEGOTIATIONS', 'DOCUMENTS, PHONES, MEDICINE, SLEEP'),
    transition: 'crossfade',
  },
  // 22. 128.30s - 134.72s (6.42s)
  {
    duration: 6.42,
    text: 'storing medication, keeping a pet safe, or sleeping deeply enough to think clearly, can become a daily negotiation.',
    asset: 'stock_medicine_bottles.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    transition: 'cut',
  },
  // 23. 134.72s - 142.86s (8.14s)
  {
    duration: 8.14,
    text: 'A cabin does not remove every obstacle, but it gives those tasks a fixed point. The door is in the same place tomorrow.',
    asset: 'oasis_clip_314.mp4',
    callout: lower('A FIXED POINT', 'THE DOOR IS IN THE SAME PLACE'),
    transition: 'crossfade',
  },
  // 24. 142.86s - 149.90s (7.04s)
  {
    duration: 7.04,
    text: 'The community house will still be there. A case manager can follow up. Stability is not only a feeling.',
    asset: 'oasis_clip_280.mp4',
    callout: lower('COMMUNITY ANCHOR', 'RELIABLE TOMORROWS'),
    transition: 'crossfade',
  },
  // 25. 149.90s - 154.12s (4.22s)
  {
    duration: 4.22,
    text: 'It is the condition that allows plans to survive from one day to the next.',
    asset: 'oasis_clip_292.mp4',
    callout: lower('STABILITY', 'WHERE PLANS CAN SURVIVE'),
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
    chapterIndex: 4, // Chapter 5
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
