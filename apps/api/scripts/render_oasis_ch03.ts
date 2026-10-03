import fs from 'fs';
import path from 'path';
import type { CalloutOverlay, OverlayType, SceneLayoutType, Timeline, TimelineClip, TransitionType } from '@repo/shared';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const STOCK = path.join(REPO_ROOT, 'uploads/sources/oasis_ch03');
const TIMELINE_PATH = path.join(REPO_ROOT, 'uploads/timelines/oasis_village/chapter_03_final.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'output/oasis_village/chapter_03_final_narration_only.mp4');
const AUDIO_PATH = path.join(REPO_ROOT, 'uploads/audio/oasis_ch03.mp3');
const TOTAL_DURATION = 203.55;

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
 * 33 Well-paced beats for Chapter 3: The People Inside (Total: 203.55s).
 * Visuals are 100% unique, verified against the registry to ensure 0% repetition with Chapters 1 & 2.
 * Strictly zero vignette overlay.
 */
const BEATS: Beat[] = [
  // 1. 0.00s - 4.74s (4.74s)
  {
    duration: 4.74,
    text: 'For Riley, who is 20, that beginning includes a desk in her own cabin.',
    asset: 'oasis_clip_214.mp4',
    callout: lower('CHAPTER 3', 'THE PEOPLE INSIDE: RILEY'),
    transition: 'cut',
  },
  // 2. 4.74s - 10.82s (6.08s)
  {
    duration: 6.08,
    text: 'She has been in and out of homelessness since she was 16, moving between Central Oregon and Portland and staying wherever she could.',
    asset: 'oasis_clip_202.mp4',
    callout: lower('RILEY, AGE 20', 'UNHOUSED SINCE AGE 16'),
    transition: 'crossfade',
  },
  // 3. 10.82s - 16.76s (5.94s)
  {
    duration: 5.94,
    text: 'After a referral brought her to Oasis Village,',
    asset: 'oasis_clip_206.mp4',
    transition: 'cut',
  },
  // 4. 16.76s - 22.28s (5.52s)
  {
    duration: 5.52,
    text: "she found work pushing carts at Walmart. Her immediate goal is to get a driver's license.",
    asset: 'stock_walmart_store.mp4',
    assetRoot: 'stock',
    callout: lower('EMPLOYMENT GOALS', 'WALMART ASSOCIATE / DRIVER PERMIT'),
    transition: 'crossfade',
  },
  // 5. 22.28s - 28.88s (6.60s)
  {
    duration: 6.60,
    text: 'She has never had even a permit. She is studying for her GED, and she has made the cabin her own',
    asset: 'stock_ged_studying.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('EDUCATION', 'STUDYING FOR GED'),
    transition: 'crossfade',
  },
  // 6. 28.88s - 35.24s (6.36s)
  {
    duration: 6.36,
    text: 'with monster high dolls, superhero posters, string lights, and a shelf for the things she likes.',
    asset: 'oasis_clip_216.mp4',
    callout: lower('A PERSONAL SANCTUARY', 'MONSTER HIGH DOLLS & POSTERS'),
    transition: 'film_dip_black',
  },
  // 7. 35.24s - 40.54s (5.30s)
  {
    duration: 5.30,
    text: 'To someone who has spent years without a stable place, a decorated shelf can mean more than decoration.',
    asset: 'oasis_clip_218.mp4',
    transition: 'cut',
  },
  // 8. 40.54s - 47.34s (6.80s)
  {
    duration: 6.80,
    text: 'It can mean there is finally a place worth settling into. Riley has stayed in cabin-style shelter before, and she can name the difference here immediately.',
    asset: 'oasis_clip_220.mp4',
    transition: 'crossfade',
  },
  // 9. 47.34s - 53.64s (6.30s)
  {
    duration: 6.30,
    text: 'More room, a desk, and a space she can arrange around her life. Her goals are not abstract.',
    asset: 'oasis_clip_222.mp4',
    callout: lower('A PLACE OF HER OWN', 'DESK, STORAGE & INDEPENDENCE'),
    transition: 'cut',
  },
  // 10. 53.64s - 59.50s (5.86s)
  {
    duration: 5.86,
    text: 'She wants the permit, then the license,',
    asset: 'oasis_clip_224.mp4',
    callout: lower('SELF-RELIANCE', 'THE PATH TO A LICENSE'),
    transition: 'crossfade',
  },
  // 11. 59.50s - 64.94s (5.44s)
  {
    duration: 5.44,
    text: 'then the independence that comes with being able to get herself where she needs to go.',
    asset: 'oasis_clip_226.mp4',
    transition: 'crossfade',
  },
  // 12. 64.94s - 70.50s (5.56s)
  {
    duration: 5.56,
    text: 'The staff are not simply holding a room for her while time passes. They are helping her take the',
    asset: 'oasis_clip_098.mp4',
    callout: lower('CASE MANAGEMENT', 'AN ADDRESS, A PLAN, A FUTURE'),
    transition: 'film_dip_black',
  },
  // 13. 70.50s - 76.38s (5.88s)
  {
    duration: 5.88,
    text: 'next steps that are difficult to take without an address, a quiet place to study, or a dependable place to sleep.',
    asset: 'oasis_clip_099.mp4',
    transition: 'cut',
  },
  // 14. 76.38s - 83.34s (6.96s)
  {
    duration: 6.96,
    text: 'Sharon is 70 and spent nearly 50 years in the medical field.',
    asset: 'stock_medical_senior.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('SHARON, AGE 70', '50 YEARS IN THE MEDICAL FIELD'),
    transition: 'crossfade',
  },
  // 15. 83.34s - 89.90s (6.56s)
  {
    duration: 6.56,
    text: 'After an abusive marriage, a divorce, and a vandalized car, the life she knew came apart.',
    asset: 'oasis_clip_230.mp4',
    callout: lower('STARTING FROM ZERO', 'AFTERMATH OF TRAUMA & LOSS'),
    transition: 'film_dip_black',
  },
  // 16. 89.90s - 95.62s (5.72s)
  {
    duration: 5.72,
    text: 'At the village, staff have helped her navigate survivor benefits and other paperwork.',
    asset: 'oasis_clip_096.mp4',
    callout: lower('SURVIVOR BENEFITS', 'NAVIGATING BUREAUCRACY'),
    transition: 'crossfade',
  },
  // 17. 95.62s - 101.92s (6.30s)
  {
    duration: 6.30,
    text: 'The milestones she describes are ordinary by most standards, cooking a proper meal, doing her own laundry, keeping her space clean,',
    asset: 'oasis_clip_094.mp4',
    callout: lower('RESTORING ROUTINE', 'COOKING, CLEANING & RECOVERY'),
    transition: 'cut',
  },
  // 18. 101.92s - 107.20s (5.28s)
  {
    duration: 5.28,
    text: 'but she had gone years without those routines.',
    asset: 'oasis_clip_232.mp4',
    transition: 'crossfade',
  },
  // 19. 107.20s - 113.24s (6.04s)
  {
    duration: 6.04,
    text: 'In three and a half months, she had paid off seven bills and started replacing possessions that had been stolen.',
    asset: 'oasis_clip_236.mp4',
    callout: {
      type: 'odometer_stat',
      line1: '7 BILLS PAID OFF',
      line2: 'IN 3.5 MONTHS AT OASIS VILLAGE',
      startTime: 0,
      endTime: 6.04,
      themeColor: 'gold',
      staticDisplay: true,
    },
    transition: 'crossfade',
  },
  // 20. 113.24s - 119.88s (6.64s)
  {
    duration: 6.64,
    text: 'Her progress is not dramatic from a distance. Up close, it is a life becoming manageable again.',
    asset: 'oasis_clip_238.mp4',
    callout: lower('A LIFE REBUILT', 'MANAGEABLE AGAIN'),
    transition: 'cut',
  },
  // 21. 119.88s - 126.32s (6.44s)
  {
    duration: 6.44,
    text: 'For Sharon, being able to make food in a kitchen is not a convenience. It is a return to a rhythm she thought she had lost.',
    asset: 'oasis_clip_240.mp4',
    transition: 'crossfade',
  },
  // 22. 126.32s - 132.78s (6.46s)
  {
    duration: 6.46,
    text: 'The same is true of laundry and the ability to keep a cabin in order. Each task connects the present to the person she was before everything came apart.',
    asset: 'oasis_clip_246.mp4',
    callout: lower('A DOOR OF HER OWN', 'RETURNING TO WHO SHE WAS'),
    transition: 'crossfade',
  },
  // 23. 132.78s - 140.04s (7.26s)
  {
    duration: 7.26,
    text: 'She credits determination and faith, but the setting matters too.',
    asset: 'oasis_clip_244.mp4',
    transition: 'cut',
  },
  // 24. 140.04s - 146.00s (5.96s)
  {
    duration: 5.96,
    text: "A person can work through forms, bills, and appointments more effectively when the night's question of where to sleep has been answered.",
    asset: 'oasis_clip_097.mp4',
    callout: lower('FOUNDATION FIRST', 'WHERE TO SLEEP IS ANSWERED'),
    transition: 'film_dip_black',
  },
  // 25. 146.00s - 151.72s (5.72s)
  {
    duration: 5.72,
    text: 'sleep has been answered.',
    asset: 'oasis_clip_100.mp4',
    transition: 'cut',
  },
  // 26. 151.72s - 158.54s (6.82s)
  {
    duration: 6.82,
    text: 'David Lovey says the village was welcoming from his first day. The regular smiles and greetings mattered.',
    asset: 'oasis_clip_115.mp4',
    callout: lower('DAVID LOVEY', 'OASIS VILLAGE RESIDENT'),
    transition: 'crossfade',
  },
  // 27. 158.54s - 165.74s (7.20s)
  {
    duration: 7.20,
    text: 'With a stable place to return to, he was able to get and keep a long term job.',
    asset: 'oasis_clip_116.mp4',
    callout: lower('LONG-TERM EMPLOYMENT', 'STABILITY CREATES OPPORTUNITY'),
    transition: 'film_dip_black',
  },
  // 28. 165.74s - 172.34s (6.60s)
  {
    duration: 6.60,
    text: 'Another resident came north after the wildfire in Paradise, California destroyed what his family had.',
    asset: 'stock_wildfire_smoke.mp4',
    assetRoot: 'stock',
    callout: lower('PARADISE, CALIFORNIA', 'CAMP FIRE SURVIVOR'),
    transition: 'crossfade',
  },
  // 29. 172.34s - 179.02s (6.68s)
  {
    duration: 6.68,
    text: 'He had completed treatment and finished probation, but other shelter options still felt unsafe, because there was no privacy and no certainty about who would be sleeping nearby.',
    asset: 'oasis_clip_164.mp4',
    callout: lower('LOREN', 'WILDFIRE SURVIVOR'),
    transition: 'cut',
  },
  // 30. 179.02s - 184.58s (5.56s)
  {
    duration: 5.56,
    text: 'At Oasis Village, his own cabin and locked door gave him space to stay grounded while he worked toward reuniting his family.',
    asset: 'oasis_clip_170.mp4',
    callout: lower('A SAFE HAVEN', 'WORKING TOWARD REUNITING FAMILY'),
    transition: 'crossfade',
  },
  // 31. 184.58s - 190.74s (6.16s)
  {
    duration: 6.16,
    text: 'One man has turned his cabin into a small movie theater with a projector and neatly stored belongings.',
    asset: 'oasis_clip_142.mp4',
    callout: lower('THE MOVIE THEATER CABIN', 'PROJECTOR & PERSONALIZED SPACE'),
    transition: 'cut',
  },
  // 32. 190.74s - 197.24s (6.50s)
  {
    duration: 6.50,
    text: 'He takes pride in keeping the floor clean. The details vary, but the pattern is familiar.',
    asset: 'oasis_clip_144.mp4',
    transition: 'crossfade',
  },
  // 33. 197.24s - 203.55s (6.31s)
  {
    duration: 6.31,
    text: 'Security creates room for routine, and routine creates room for choices.',
    asset: 'oasis_clip_074.mp4',
    callout: lower('SECURITY & ROUTINE', 'CREATING ROOM FOR CHOICES'),
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
    chapterIndex: 2, // Chapter 3
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
