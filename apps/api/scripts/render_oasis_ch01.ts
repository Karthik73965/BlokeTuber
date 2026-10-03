import fs from 'fs';
import path from 'path';
import type { CalloutOverlay, OverlayType, SceneLayoutType, Timeline, TimelineClip, TransitionType } from '@repo/shared';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const STOCK = path.join(REPO_ROOT, 'uploads/sources/oasis_ch01');
const TIMELINE_PATH = path.join(REPO_ROOT, 'uploads/timelines/oasis_village/chapter_01_final.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'output/oasis_village/chapter_01_final_narration_only.mp4');
const AUDIO_PATH = path.join(REPO_ROOT, 'uploads/audio/oasis_ch01.mp3');
const TOTAL_DURATION = 152.40;

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
 * 22 Well-paced beats for Chapter 1: The Night in Question (Total: 152.40s).
 * Visuals are diversified with authentic B-roll, real stock footage for street & paperwork context,
 * and zero vignette overlay.
 */
const BEATS: Beat[] = [
  // 1. 0.00s - 4.70s (4.70s)
  {
    duration: 4.70,
    text: '25 wooden cabins sit in a gravel lot on the edge of Redmond, Oregon.',
    asset: 'oasis_clip_001.mp4',
    callout: lower('REDMOND, OREGON', 'OASIS VILLAGE'),
    transition: 'cut',
  },
  // 2. 4.70s - 10.38s (5.68s)
  {
    duration: 5.68,
    text: 'From the road, they are easy to miss, plain sighting, small windows, a porch light outside',
    asset: 'oasis_clip_011.mp4',
    transition: 'cut',
  },
  // 3. 10.38s - 17.22s (6.84s)
  {
    duration: 6.84,
    text: 'each door. But during a freezing ice storm in January 2024, those cabins became the difference',
    asset: 'dvids_snowfall.mp4',
    assetRoot: 'stock',
    sourceStart: 2,
    callout: lower('JANUARY 2024', 'SUB-ZERO ICE STORM'),
    transition: 'crossfade',
    overlay: 'film_dust_scratches',
  },
  // 4. 17.22s - 23.74s (6.52s)
  {
    duration: 6.52,
    text: 'between being outside and being safe. 15 people who had been sleeping outdoors spent the night',
    asset: 'dvids_winter_storm.mp4',
    assetRoot: 'stock',
    sourceStart: 14,
    callout: {
      type: 'odometer_stat',
      line1: '15 RESIDENTS',
      line2: 'KEPT SAFE THROUGH THE ICE STORM',
      startTime: 0,
      endTime: 6.52,
      themeColor: 'gold',
      staticDisplay: true,
    },
    transition: 'film_dip_black',
  },
  // 5. 23.74s - 30.78s (7.04s)
  {
    duration: 7.04,
    text: 'warm, dry, and behind doors that locked from the inside. This is Oasis Village, and its story',
    asset: 'oasis_clip_063.mp4',
    callout: lower('A DOOR THAT LOCKS', 'WARMTH, SAFETY, DIGNITY'),
    transition: 'crossfade',
  },
  // 6. 30.78s - 36.38s (5.60s)
  {
    duration: 5.60,
    text: 'starts with a simple question. What changes when help is built around the realities of the people',
    asset: 'oasis_clip_091.mp4',
    transition: 'cut',
  },
  // 7. 36.38s - 42.50s (6.12s)
  {
    duration: 6.12,
    text: 'who need it? Many people picture a shelter as a gymnasium full of cots, lights on early,',
    asset: 'fema_empty_cots_gym.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('THE DEFAULT IMAGE', 'A GYMNASIUM OF COTS'),
    transition: 'crossfade',
  },
  // 8. 42.50s - 48.56s (6.06s)
  {
    duration: 6.06,
    text: 'everyone out by morning, little privacy, no room for pets, and no control over who sleeps nearby.',
    asset: 'unique/fema_katrina_lsu_cots.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('THE TRADE-OFF', 'NO PRIVACY • NO PETS • NO SAY'),
    transition: 'cut',
  },
  // 9. 48.56s - 54.90s (6.34s)
  {
    duration: 6.34,
    text: 'For people who have already lost so much control, that can be a barrier rather than a solution.',
    asset: 'unique/usn_cots_gym.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('WHY SOME STAY OUTSIDE', 'MASS SHELTER HAS A COST'),
    transition: 'film_dip_black',
  },
  // 10. 54.90s - 61.00s (6.10s)
  {
    duration: 6.10,
    text: 'Oasis Village was built around a different premise. It is a low barrier shelter, meaning that it',
    asset: 'oasis_clip_141.mp4',
    callout: lower('LOW-BARRIER SHELTER', 'A DIFFERENT PREMISE'),
    transition: 'crossfade',
  },
  // 11. 61.00s - 66.95s (5.95s)
  {
    duration: 5.95,
    text: 'removes some of the requirements that commonly keep people away. There is no sobriety requirement,',
    asset: 'oasis_clip_015.mp4',
    transition: 'cut',
  },
  // 12. 66.95s - 73.78s (6.83s)
  {
    duration: 6.83,
    text: 'no background check, and no drug test at the door. Residents can bring up to two pets. They do not',
    asset: 'oasis_clip_018.mp4',
    callout: lower('UP TO TWO PETS', 'NO BACKGROUND CHECKS • NO DRUG TESTS'),
    transition: 'cut',
  },
  // 13. 73.78s - 80.20s (6.42s)
  {
    duration: 6.42,
    text: 'have to arrive with every problem solved. They have to need a place to go. That idea took time',
    asset: 'oasis_clip_044.mp4',
    transition: 'crossfade',
  },
  // 14. 80.20s - 86.30s (6.10s)
  {
    duration: 6.10,
    text: 'for site manager Josie Anderson to understand. Before working here, she says she carried some of the assumptions many people do.',
    asset: 'oasis_clip_021.mp4',
    callout: lower('JOSIE ANDERSEN', 'EXECUTIVE DIRECTOR • OASIS VILLAGE'),
    transition: 'shutter_flash',
  },
  // 15. 86.30s - 94.00s (7.70s)
  {
    duration: 7.70,
    text: 'Seeing a man asking for help with dogs beside him, she once wondered why he would feed them before himself.',
    asset: 'stock_homeless_dog_sidewalk.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('THE TURNING POINT', '“FEED YOURSELF BEFORE THE DOG?”'),
    transition: 'crossfade',
  },
  // 16. 94.00s - 105.92s (11.92s)
  {
    duration: 11.92,
    text: 'Working alongside people who were unhoused changed her view. The dogs were not an extra burden. They were companionship, responsibility, and for some people a reason to get up in the morning.',
    asset: 'oasis_clip_151.mp4',
    callout: lower('COMPANIONSHIP & DIGNITY', 'A REASON TO GET UP IN THE MORNING'),
    transition: 'crossfade',
  },
  // 17. 105.92s - 119.34s (13.42s)
  {
    duration: 13.42,
    text: 'At Oasis Village, that shift from judgment to curiosity is not a slogan. It is the operating principle. Josie is also direct about the picture people often carry of homelessness.',
    asset: 'oasis_clip_025.mp4',
    transition: 'crossfade',
  },
  // 18. 119.34s - 124.86s (5.52s)
  {
    duration: 5.52,
    text: 'Some residents do live with addiction or serious mental illness, but others are working,',
    asset: 'oasis_clip_023.mp4',
    transition: 'crossfade',
  },
  // 19. 124.86s - 134.00s (9.14s)
  {
    duration: 9.14,
    text: 'recovering from a crisis, or trying to navigate paperwork, illness, family violence, or a rent increase with no cushion left.',
    asset: 'stock_overdue_bills_paperwork.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('BEYOND THE STIGMA', 'PAPERWORK, CRISIS, AND RENT INCREASES'),
    transition: 'crossfade',
  },
  // 20. 134.00s - 144.42s (10.42s)
  {
    duration: 10.42,
    text: 'Their paths into homelessness are different and so are their paths out. The village begins by making room for those differences. Josie had been on the job only eight days when the ice storm arrived.',
    asset: 'oasis_clip_046.mp4',
    callout: lower('EIGHT DAYS ON THE JOB', 'WHEN THE ICE STORM HIT'),
    transition: 'film_dip_black',
  },
  // 21. 144.42s - 150.46s (6.04s)
  {
    duration: 6.04,
    text: 'That first night made the model real. People who had spent years outside',
    asset: 'stock_man_with_dog_street.mp4',
    assetRoot: 'stock',
    sourceStart: 1,
    transition: 'crossfade',
  },
  // 22. 150.46s - 152.40s (1.94s)
  {
    duration: 1.94,
    text: 'had a safe place to sleep.',
    asset: 'oasis_clip_064.mp4',
    callout: lower('A SAFE PLACE TO SLEEP', 'BEHIND A LOCKED DOOR'),
    transition: 'cut',
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

  // Static callouts avoid the delayed pop-in and pre-cut fade-out blink
  const callout = beat.callout
    ? { ...beat.callout, startTime: 0, endTime: clipDuration, staticDisplay: true }
    : null;

  const transitionType = beat.transition || 'cut';
  const transitionDuration = transitionType === 'cut' ? 0 : 0.35;

  return {
    beatIndex,
    chapterIndex: 0,
    text: beat.text,
    startTime,
    endTime,
    clipPath: assetPath.replace(/\\/g, '/'),
    sourceStart: beat.sourceStart,
    mediaType: beat.mediaType || 'video',
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
  // Clean, zero vignette filter as requested
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
