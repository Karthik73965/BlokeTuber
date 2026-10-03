import fs from 'fs';
import path from 'path';
import type { CalloutOverlay, SceneLayoutType, Timeline, TimelineClip, TransitionType } from '@repo/shared';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const OASIS_RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const SOURCES = path.join(REPO_ROOT, 'uploads/sources/oasis_ch01');
const TIMELINE_PATH = path.join(REPO_ROOT, 'uploads/timelines/oasis_village/chapter_01_treated.json');
const OUTPUT_PATH = path.join(REPO_ROOT, 'output/oasis_village/chapter_01_remotion_treated.mp4');

type BeatSpec = {
  path: string;
  duration: number;
  text: string;
  mediaType?: 'video' | 'image';
  sourceStart?: number;
  layout?: SceneLayoutType;
  secondaryClipPath?: string;
  secondaryMediaType?: 'video' | 'image';
  layoutData?: TimelineClip['layoutData'];
  callout?: CalloutOverlay | null;
  transitionType?: TransitionType;
};

const lower = (line1: string, line2?: string): CalloutOverlay => ({
  type: 'editorial_lower_third', line1, line2, startTime: 0.35, endTime: 3.65, themeColor: 'gold',
});

// These are hand-directed against the narration. The treatment is limited to the
// beats where text or an alternate layout makes the spoken point clearer.
const BEATS: BeatSpec[] = [
  { path: path.join(OASIS_RAW, 'oasis_clip_001.mp4'), duration: 4.58, text: 'Twenty-five wooden cabins sit in a gravel lot on the edge of Redmond, Oregon.', layout: 'ambient_blur_frame', layoutData: { title: 'AMERICAN HIDEAWAYS', subtitle: 'THE NIGHT IN QUESTION', tag: 'REDMOND, OR' }, callout: lower('REDMOND, OREGON', 'OASIS VILLAGE'), transitionType: 'crossfade' },
  { path: path.join(OASIS_RAW, 'oasis_clip_002.mp4'), duration: 5, text: 'Nothing about them looks remarkable from the road - plain siding, small windows, a porch light on each door.', transitionType: 'cut' },
  { path: path.join(OASIS_RAW, 'oasis_clip_004.mp4'), duration: 5, text: 'But on one freezing night in January of 2024, those twenty-five cabins did something most of the richest country on earth still cannot manage.', transitionType: 'crossfade' },
  { path: path.join(SOURCES, 'dvids_snowfall.mp4'), duration: 5, sourceStart: 4, text: '...on one freezing night in January of 2024...', callout: lower('JANUARY 2024', 'THE NIGHT IN QUESTION'), transitionType: 'film_dip_black' },
  { path: path.join(SOURCES, 'dvids_snowfall.mp4'), duration: 5, sourceStart: 25, text: 'They kept fifteen people alive through an ice storm that would have killed them outside.', layout: 'hero_graphic_centerpiece', callout: { type: 'odometer_stat', line1: '15 PEOPLE', line2: 'KEPT SAFE THROUGH THE ICE STORM', startTime: 0.45, endTime: 4.1, themeColor: 'gold' }, transitionType: 'crossfade' },
  { path: path.join(OASIS_RAW, 'oasis_clip_063.mp4'), duration: 5, text: 'This is the story of Oasis Village - a place that should not work, on paper...', transitionType: 'cut' },
  { path: path.join(OASIS_RAW, 'oasis_clip_015.mp4'), duration: 5, text: '...and somehow works better than almost anything else being tried for homelessness in America right now.', transitionType: 'crossfade' },
  { path: path.join(OASIS_RAW, 'oasis_clip_011.mp4'), duration: 5, text: 'Here is the part most people get wrong before they ever hear a story like this one.', layout: 'hero_graphic_centerpiece', callout: { type: 'fullscreen_chapter_title', line1: 'WHAT PEOPLE PICTURE', line2: 'WHEN THEY HEAR “SHELTER”', startTime: 0.25, endTime: 4.45, themeColor: 'gold' }, transitionType: 'film_dip_black' },
  { path: path.join(SOURCES, 'fema_empty_cots_gym.jpg'), duration: 5, mediaType: 'image', text: 'They picture a shelter and they picture a gymnasium.', callout: lower('MASS SHELTER', 'A GYMNASIUM OF COTS'), transitionType: 'crossfade' },
  { path: path.join(SOURCES, 'fema_rows_of_cots.jpg'), duration: 5, mediaType: 'image', text: 'Rows of cots. A stranger\'s breathing six feet away.', transitionType: 'cut' },
  { path: path.join(SOURCES, 'fema_rows_of_cots.jpg'), duration: 5, mediaType: 'image', text: 'Lights on at six, everybody out by eight, no exceptions.', callout: lower('STRICT TIMETABLES', 'LIGHTS AT SIX • OUT BY EIGHT'), transitionType: 'crossfade' },
  { path: path.join(SOURCES, 'dvids_emergency_shelter.mp4'), duration: 5, sourceStart: 10, text: 'No pets, no privacy, no say in any of it.', callout: lower('THE TRADE-OFF', 'NO PETS • NO PRIVACY • NO SAY'), transitionType: 'film_dip_black' },
  { path: path.join(SOURCES, 'fema_rows_of_cots.jpg'), duration: 5, mediaType: 'image', text: 'And here is the thing nobody talks about: a huge number of homeless people will not go to a place like that.', layout: 'split_dual_screen', secondaryClipPath: path.join(OASIS_RAW, 'oasis_clip_018.mp4'), secondaryMediaType: 'video', layoutData: { title: 'WHY SOME PEOPLE STAY OUTSIDE', subtitle: 'MASS SHELTER VS A PRIVATE DOOR' }, callout: lower('WHY SOME PEOPLE STAY OUTSIDE', 'MASS SHELTER VS A PRIVATE DOOR'), transitionType: 'crossfade' },
  { path: path.join(SOURCES, 'dvids_emergency_shelter.mp4'), duration: 5, sourceStart: 18, text: 'Not because they do not want help.', transitionType: 'cut' },
  { path: path.join(OASIS_RAW, 'oasis_clip_018.mp4'), duration: 5, text: 'Because the price of that help is handing over the last thing they still control - who they sleep next to...', layout: 'ambient_blur_frame', layoutData: { title: 'THE PRICE OF HELP', subtitle: 'LOSING CONTROL' }, callout: lower('THE PRICE OF HELP', 'LOSING CONTROL'), transitionType: 'film_dip_black' },
  { path: path.join(OASIS_RAW, 'oasis_clip_014.mp4'), duration: 1.16, text: '...and whether they are safe doing it.', transitionType: 'cut' },
];

let cursor = 0;
const clips: TimelineClip[] = BEATS.map((beat, beatIndex) => {
  const startTime = Number(cursor.toFixed(2));
  cursor += beat.duration;
  return {
    beatIndex,
    chapterIndex: 0,
    text: beat.text,
    startTime,
    endTime: Number(cursor.toFixed(2)),
    clipPath: beat.path.replace(/\\/g, '/'),
    sourceStart: beat.sourceStart,
    secondaryClipPath: beat.secondaryClipPath?.replace(/\\/g, '/'),
    mediaType: beat.mediaType || 'video',
    secondaryMediaType: beat.secondaryMediaType,
    layout: beat.layout || 'full_bleed_cinematic',
    layoutData: beat.layoutData,
    kenBurns: beat.mediaType === 'image',
    transitionType: beat.transitionType || 'cut',
    transitionDuration: beat.transitionType === 'cut' ? 0 : 0.4,
    numberOverlays: [],
    callout: beat.callout || null,
    overlay: undefined,
    sfxPath: null,
  };
});

const timeline: Timeline = {
  masterAudioPath: path.join(REPO_ROOT, 'uploads/audio/oasis_ch01.mp3').replace(/\\/g, '/'),
  totalDuration: Number(cursor.toFixed(2)),
  clips,
  outputPath: OUTPUT_PATH.replace(/\\/g, '/'),
  globalOverlays: ['micro_film_grain'],
};

if (timeline.totalDuration !== 75.74) throw new Error(`Duration mismatch: ${timeline.totalDuration}`);
for (const beat of BEATS) if (!fs.existsSync(beat.path)) throw new Error(`Missing source: ${beat.path}`);

fs.mkdirSync(path.dirname(TIMELINE_PATH), { recursive: true });
fs.writeFileSync(TIMELINE_PATH, JSON.stringify(timeline, null, 2));
console.log(`Created Remotion timeline: ${TIMELINE_PATH}`);
console.log(`Target video: ${OUTPUT_PATH}`);
