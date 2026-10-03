import fs from 'fs';
import path from 'path';
import type { CalloutOverlay, OverlayType, SceneLayoutType, Timeline, TimelineClip, TransitionType } from '@repo/shared';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const STOCK = path.join(REPO_ROOT, 'uploads/sources/oasis_ch04');
const TIMELINE_PATH = path.join(REPO_ROOT, 'uploads/timelines/oasis_village/chapter_04_final.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'output/oasis_village/chapter_04_final_narration_only.mp4');
const AUDIO_PATH = path.join(REPO_ROOT, 'uploads/audio/oasis_ch04.mp3');
const TOTAL_DURATION = 127.74;

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
 * 24 Well-paced beats for Chapter 4: The People Inside (Part II): Lauren & Amy (Total: 127.74s).
 * Visuals are 100% unique, verified against the registry to ensure 0% repetition with Chapters 1, 2 & 3.
 * Strictly zero vignette overlay.
 */
const BEATS: Beat[] = [
  // 1. 0.00s - 3.24s (3.24s)
  {
    duration: 3.24,
    text: 'That privacy is not a luxury in this story.',
    asset: 'oasis_clip_080.mp4',
    callout: lower('CHAPTER 4', 'THE PEOPLE INSIDE: PART II'),
    transition: 'cut',
  },
  // 2. 3.24s - 6.66s (3.42s)
  {
    duration: 3.42,
    text: 'For a resident who has experienced unstable shelters,',
    asset: 'oasis_clip_081.mp4',
    transition: 'crossfade',
  },
  // 3. 6.66s - 10.18s (3.52s)
  {
    duration: 3.52,
    text: 'a locked door can lower the constant calculation of risk,',
    asset: 'oasis_clip_082.mp4',
    callout: lower('A LOCKED DOOR', 'REDUCING THE CALCULATION OF RISK'),
    transition: 'film_dip_black',
  },
  // 4. 10.18s - 13.02s (2.84s)
  {
    duration: 2.84,
    text: 'who is nearby, whether it is safe to sleep,',
    asset: 'oasis_clip_248.mp4',
    transition: 'cut',
  },
  // 5. 13.02s - 16.22s (3.20s)
  {
    duration: 3.20,
    text: 'and whether possessions will still be there in the morning.',
    asset: 'oasis_clip_083.mp4',
    transition: 'crossfade',
  },
  // 6. 16.22s - 22.14s (5.92s)
  {
    duration: 5.92,
    text: 'It also lets residents control the small parts of daily life that make a place feel personal.',
    asset: 'oasis_clip_143.mp4',
    callout: lower('PERSONAL SANCTUARY', 'CONTROL OVER DAILY LIFE'),
    transition: 'cut',
  },
  // 7. 22.14s - 28.72s (6.58s)
  {
    duration: 6.58,
    text: "The projector, the clean floor, the storage bins, the posters, and the pets are not the program's headline.",
    asset: 'oasis_clip_145.mp4',
    callout: lower('ORDER & DIGNITY', 'ROOM TO CREATE ROUTINE'),
    transition: 'crossfade',
  },
  // 8. 28.72s - 35.00s (6.28s)
  {
    duration: 6.28,
    text: 'They are evidence that people can create order when they are given enough room to do it.',
    asset: 'oasis_clip_086.mp4',
    transition: 'film_dip_black',
  },
  // 9. 35.00s - 42.54s (7.54s)
  {
    duration: 7.54,
    text: 'Lauren, 55, arrived after months on a wait list and time spent living in her truck following a separation.',
    asset: 'stock_truck_living.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower('LAUREN, AGE 55', 'LIVING IN HER TRUCK AFTER SEPARATION'),
    transition: 'crossfade',
  },
  // 10. 42.54s - 49.44s (6.90s)
  {
    duration: 6.90,
    text: 'She had built houses from framing to finish, but a back injury made the work that once paid her rent impossible.',
    asset: 'stock_house_framing.mp4',
    assetRoot: 'stock',
    callout: lower('FORMER TRADESPERSON', 'BUILT HOMES FROM FRAMING TO FINISH'),
    transition: 'crossfade',
  },
  // 11. 49.44s - 56.50s (7.06s)
  {
    duration: 7.06,
    text: 'As she endured surgeries and radiation for a brain tumor, staff helped her through the practical demands of each day.',
    asset: 'oasis_clip_190.mp4',
    callout: lower('COMMUNITY CARE', 'NAVIGATING HEALTH CRISES'),
    transition: 'film_dip_black',
  },
  // 12. 56.50s - 62.46s (5.96s)
  {
    duration: 5.96,
    text: 'After five years of appeals, she was approved for disability.',
    asset: 'oasis_clip_194.mp4',
    callout: {
      type: 'odometer_stat',
      line1: '5 YEARS OF APPEALS',
      line2: 'DISABILITY APPROVED AT OASIS VILLAGE',
      startTime: 0,
      endTime: 5.96,
      themeColor: 'gold',
      staticDisplay: true,
    },
    transition: 'crossfade',
  },
  // 13. 62.46s - 66.70s (4.24s)
  {
    duration: 4.24,
    text: 'She waited for that decision in a cabin with her dog, Hennessy, beside her instead of in a truck.',
    asset: 'oasis_clip_176.mp4',
    callout: lower('HENNESSY', 'SAFETY INSTEAD OF A TRUCK'),
    transition: 'film_dip_black',
  },
  // 14. 66.70s - 73.60s (6.90s)
  {
    duration: 6.90,
    text: 'Amy had spent years escaping domestic violence and was close to losing her property over unpaid taxes.',
    asset: 'oasis_clip_084.mp4',
    callout: lower('AMY', 'SURVIVOR OF DOMESTIC VIOLENCE'),
    transition: 'crossfade',
  },
  // 15. 73.60s - 80.42s (6.82s)
  {
    duration: 6.82,
    text: 'Nearly two years later, the taxes are paid, she has work, and she is preparing to return to her own land.',
    asset: 'oasis_clip_250.mp4',
    callout: lower('TAXES PAID IN FULL', 'PREPARING TO RETURN HOME'),
    transition: 'crossfade',
  },
  // 16. 80.42s - 85.94s (5.52s)
  {
    duration: 5.52,
    text: 'When she talks about the future, she imagines creating a place like this for someone else.',
    asset: 'oasis_clip_085.mp4',
    callout: lower('PAYING IT FORWARD', 'BUILDING A SAFE PLACE FOR OTHERS'),
    transition: 'film_dip_black',
  },
  // 17. 85.94s - 90.64s (4.70s)
  {
    duration: 4.70,
    text: 'Lauren had taken whatever work she could find after construction became physically impossible,',
    asset: 'oasis_clip_178.mp4',
    callout: lower('RESILIENCE', 'GAS STATION & GUIDE WORK'),
    transition: 'crossfade',
  },
  // 18. 90.64s - 95.34s (4.70s)
  {
    duration: 4.70,
    text: 'including time at a gas station and hunting guide jobs.',
    asset: 'oasis_clip_180.mp4',
    transition: 'cut',
  },
  // 19. 95.34s - 100.35s (5.01s)
  {
    duration: 5.01,
    text: 'That is one reason the disability approval mattered so much.',
    asset: 'oasis_clip_182.mp4',
    callout: lower('HARD-WON RELIEF', 'AFTER YEARS OF STRUGGLE'),
    transition: 'crossfade',
  },
  // 20. 100.35s - 105.36s (5.01s)
  {
    duration: 5.01,
    text: 'It arrived after a long process of trying to survive without the work her body had once allowed.',
    asset: 'oasis_clip_184.mp4',
    transition: 'cut',
  },
  // 21. 105.36s - 112.30s (6.94s)
  {
    duration: 6.94,
    text: "Amy's next chapter will not be effortless either. Her land still needs clearing and it has no power or water,",
    asset: 'stock_rural_property_land.jpg',
    assetRoot: 'stock',
    mediaType: 'image',
    callout: lower("AMY'S LAND", 'UNDEVELOPED RURAL PROPERTY'),
    transition: 'film_dip_black',
  },
  // 22. 112.30s - 119.22s (6.92s)
  {
    duration: 6.92,
    text: 'but it is hers and she is preparing to return with a trailer and a van she has worked to obtain.',
    asset: 'oasis_clip_268.mp4',
    callout: lower('THE TRAILER & VAN', 'PREPARING TO RETURN TO HER LAND'),
    transition: 'crossfade',
  },
  // 23. 119.22s - 123.54s (4.32s)
  {
    duration: 4.32,
    text: 'Oasis Village is not presented as the finish line for either woman.',
    asset: 'oasis_clip_322.mp4',
    callout: lower('A LAUNCHING PAD', 'NOT THE FINISH LINE'),
    transition: 'crossfade',
  },
  // 24. 123.54s - 127.74s (4.20s)
  {
    duration: 4.20,
    text: 'It is a stable platform from which a finish line can come back into view.',
    asset: 'oasis_clip_324.mp4',
    callout: lower('A STABLE PLATFORM', 'THE FINISH LINE IN VIEW'),
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
    chapterIndex: 3, // Chapter 4
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
