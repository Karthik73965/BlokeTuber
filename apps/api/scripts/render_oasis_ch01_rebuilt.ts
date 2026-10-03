import fs from 'fs';
import path from 'path';
import type { CalloutOverlay, OverlayType, SceneLayoutType, Timeline, TimelineClip, TransitionType } from '@repo/shared';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const STOCK = path.join(REPO_ROOT, 'uploads/sources/oasis_ch01');
const TIMELINE_PATH = path.join(REPO_ROOT, 'uploads/timelines/oasis_village/chapter_01_image_safe_final.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'output/oasis_village/chapter_01_image_safe_final_narration_only.mp4');

type Beat = {
  duration: number;
  text: string;
  asset: string;
  assetRoot?: 'raw' | 'stock';
  mediaType?: 'video' | 'image';
  sourceStart?: number;
  layout?: SceneLayoutType;
  secondaryAsset?: string;
  secondaryMediaType?: 'video' | 'image';
  layoutData?: TimelineClip['layoutData'];
  callout?: CalloutOverlay | null;
  transition?: TransitionType;
  overlay?: OverlayType | OverlayType[];
};

const lower = (line1: string, line2?: string): CalloutOverlay => ({
  type: 'editorial_lower_third',
  line1,
  line2,
  startTime: 0.35,
  endTime: 4.0,
  themeColor: 'gold',
});

// The times below follow ch01_alignment.json exactly. Every beat is deliberately
// assigned a distinct visual source: no asset or raw clip is repeated.
const BEATS: Beat[] = [
  { duration: 5.22, text: '25 wooden cabins sit in a gravel lot on the edge of Redmond, Oregon.', asset: 'oasis_clip_001.mp4', callout: lower('REDMOND, OREGON', 'OASIS VILLAGE'), transition: 'cut' },
  { duration: 4.90, text: 'Nothing about them looks remarkable from the road: plain siding, small windows.', asset: 'oasis_clip_011.mp4', transition: 'cut' },
  { duration: 2.28, text: 'A porch light on each door.', asset: 'oasis_clip_121.mp4', transition: 'crossfade' },
  { duration: 3.92, text: 'But on one freezing night in January of 2024,', asset: 'dvids_snowfall.mp4', assetRoot: 'stock', sourceStart: 1, callout: lower('JANUARY 2024', 'A FREEZING NIGHT'), transition: 'film_dip_black', overlay: 'film_dust_scratches' },
  { duration: 5.00, text: 'those 25 cabins did something most of the richest country on Earth still cannot manage.', asset: 'oasis_clip_091.mp4', transition: 'crossfade' },
  { duration: 0.82, text: 'A brief pause before the outcome.', asset: 'oasis_clip_081.mp4', transition: 'cut' },
  { duration: 4.62, text: 'They kept 15 people alive through an ice storm that would have killed them outside.', asset: 'dvids_winter_storm.mp4', assetRoot: 'stock', sourceStart: 15, callout: { type: 'odometer_stat', line1: '15 PEOPLE', line2: 'KEPT SAFE THROUGH THE ICE STORM', startTime: 0.3, endTime: 4.25, themeColor: 'gold' }, transition: 'cut' },
  { duration: 0.74, text: 'A breath before the story begins.', asset: 'oasis_clip_071.mp4', transition: 'cut' },
  { duration: 5.00, text: 'This is the story of Oasis Village, a place that should not work on paper.', asset: 'oasis_clip_141.mp4', transition: 'cut' },
  { duration: 1.70, text: 'And somehow it works.', asset: 'oasis_clip_201.mp4', transition: 'crossfade' },
  { duration: 5.02, text: 'Better than almost anything else being tried for homelessness in America right now.', asset: 'oasis_clip_211.mp4', transition: 'crossfade' },
  { duration: 4.68, text: 'Here is the part most people get wrong before they hear a story like this one.', asset: 'screenshots/oasis_clip_301_p1.jpg', mediaType: 'image', callout: lower('THE SHELTER ASSUMPTION', 'WHAT PEOPLE PICTURE'), transition: 'cut' },
  { duration: 4.84, text: 'They picture a shelter. They picture a gymnasium. Rows of cots.', asset: 'fema_empty_cots_gym.jpg', assetRoot: 'stock', mediaType: 'image', callout: lower('MASS SHELTER', 'A GYMNASIUM OF COTS'), transition: 'crossfade' },
  { duration: 4.86, text: 'A stranger breathing six feet away. Lights on at six. Everybody out by eight.', asset: 'unique/fema_katrina_lsu_cots.jpg', assetRoot: 'stock', mediaType: 'image', callout: lower('STRICT TIMETABLES', 'LIGHTS AT SIX. OUT BY EIGHT.'), transition: 'cut' },
  { duration: 5.24, text: 'No exceptions. No pets. No privacy. No say in any of it.', asset: 'unique/fema_red_cross_lafayette.jpg', assetRoot: 'stock', mediaType: 'image', callout: lower('THE TRADE-OFF', 'NO PETS. NO PRIVACY. NO SAY.'), transition: 'crossfade' },
  { duration: 5.68, text: 'A huge number of homeless people will not go to a place like that.', asset: 'unique/usn_cots_gym.jpg', assetRoot: 'stock', mediaType: 'image', callout: lower('WHY SOME PEOPLE STAY OUTSIDE', 'MASS SHELTER HAS A COST'), transition: 'film_dip_black' },
  { duration: 5.00, text: 'Not because they do not want help.', asset: 'fema_rows_of_cots.jpg', assetRoot: 'stock', mediaType: 'image', transition: 'cut' },
  { duration: 1.20, text: 'Because the price of that help is handing over the last thing they still control.', asset: 'dvids_emergency_shelter.mp4', assetRoot: 'stock', sourceStart: 10, callout: lower('IT IS NOT A REFUSAL OF HELP', 'IT IS A QUESTION OF CONTROL'), transition: 'crossfade' },
  { duration: 5.02, text: 'Who they sleep next to, and whether they are safe doing it.', asset: 'oasis_clip_063.mp4', callout: lower('A PRIVATE DOOR', 'SAFETY, CONTROL, AND SLEEP'), transition: 'cut' },
];

let cursor = 0;
const clips: TimelineClip[] = BEATS.map((beat, beatIndex) => {
  const startTime = Number(cursor.toFixed(2));
  cursor += beat.duration;
  const assetPath = path.join(beat.assetRoot === 'stock' ? STOCK : RAW, beat.asset);
  // Avoid the delayed entrance and pre-cut exit that read as a blink on short beats.
  const callout = beat.callout
    ? { ...beat.callout, startTime: 0, endTime: beat.duration, staticDisplay: true }
    : null;
  const transitionType = beat.transition || 'cut';
  const transitionDuration = transitionType === 'cut' ? 0 : 0.35;
  return {
    beatIndex,
    chapterIndex: 0,
    text: beat.text,
    startTime,
    endTime: Number(cursor.toFixed(2)),
    clipPath: assetPath.replace(/\\/g, '/'),
    sourceStart: beat.sourceStart,
    mediaType: beat.mediaType || 'video',
    secondaryClipPath: beat.secondaryAsset ? path.join(RAW, beat.secondaryAsset).replace(/\\/g, '/') : undefined,
    secondaryMediaType: beat.secondaryMediaType,
    layout: beat.layout || 'full_bleed_cinematic',
    layoutData: beat.layoutData,
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
  masterAudioPath: path.join(REPO_ROOT, 'uploads/audio/oasis_ch01.mp3').replace(/\\/g, '/'),
  totalDuration: Number(cursor.toFixed(2)),
  clips,
  outputPath: OUTPUT_PATH.replace(/\\/g, '/'),
  globalOverlays: ['cinematic_vignette'],
};

if (timeline.totalDuration !== 75.74) throw new Error(`Timeline duration mismatch: ${timeline.totalDuration}`);
for (const clip of clips) {
  if (!clip.clipPath || !fs.existsSync(clip.clipPath)) throw new Error(`Missing source: ${clip.clipPath}`);
  if (clip.secondaryClipPath && !fs.existsSync(clip.secondaryClipPath)) throw new Error(`Missing secondary source: ${clip.secondaryClipPath}`);
}

fs.mkdirSync(path.dirname(TIMELINE_PATH), { recursive: true });
fs.writeFileSync(TIMELINE_PATH, JSON.stringify(timeline, null, 2));
console.log(`Created: ${TIMELINE_PATH}`);
console.log(`Render target: ${OUTPUT_PATH}`);
