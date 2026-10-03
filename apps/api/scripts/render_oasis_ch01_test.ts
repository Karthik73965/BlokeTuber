import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(__dirname, '../../..');
const AUDIO_PATH = path.join(REPO_ROOT, 'uploads/audio/oasis_ch01.mp3');
const OASIS_RAW = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const SOURCES = path.join(REPO_ROOT, 'uploads/sources/oasis_ch01');
const OUTPUT_DIR = path.join(REPO_ROOT, 'output/oasis_village');
const WORK_DIR = path.join(REPO_ROOT, 'tmp/oasis_ch01_script_matched');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'chapter_01_recut_treated.mp4');
const AUDIT_PATH = path.join(OUTPUT_DIR, 'chapter_01_recut_treated_beat_audit.json');
const FONT_BOLD = 'C\\:/Windows/Fonts/arialbd.ttf';
const FONT_REGULAR = 'C\\:/Windows/Fonts/arial.ttf';

type Treatment = { kicker?: string; title: string; subtitle?: string };
type VideoBeat = { kind: 'video'; id: string; source: string; sourceStart: number; duration: number; narration: string; rationale: string; treatment?: Treatment };
type ImageBeat = { kind: 'image'; id: string; source: string; duration: number; filter: string; narration: string; rationale: string; treatment?: Treatment; layout?: 'split'; secondarySource?: string };
type Beat = VideoBeat | ImageBeat;

/** Hand-directed to the exact narration. All holds are <= 5 seconds. */
const BEATS: Beat[] = [
  { kind: 'video', id: '01', source: path.join(OASIS_RAW, 'oasis_clip_001.mp4'), sourceStart: 0, duration: 4.58, narration: 'Twenty-five wooden cabins sit in a gravel lot on the edge of Redmond, Oregon.', rationale: 'Actual Oasis Village cabins and gravel lot; factual establishing shot.', treatment: { kicker: 'AMERICAN HIDEAWAYS', title: 'OASIS VILLAGE', subtitle: 'REDMOND, OREGON' } },
  { kind: 'video', id: '02', source: path.join(OASIS_RAW, 'oasis_clip_002.mp4'), sourceStart: 0, duration: 5, narration: 'Nothing about them looks remarkable from the road - plain siding, small windows, a porch light on each door.', rationale: 'Actual cabin facade and entry details; no channel graphics.' },
  { kind: 'video', id: '03', source: path.join(OASIS_RAW, 'oasis_clip_004.mp4'), sourceStart: 0, duration: 5, narration: 'But on one freezing night in January of 2024, those twenty-five cabins did something most of the richest country on earth still cannot manage.', rationale: 'Actual Oasis cabin threshold before the winter-event cutaway.' },
  { kind: 'video', id: '04', source: path.join(SOURCES, 'dvids_snowfall.mp4'), sourceStart: 4, duration: 5, narration: '...on one freezing night in January of 2024...', rationale: 'Public-domain US winter-storm B-roll; illustrative only, never presented as Redmond.', treatment: { kicker: 'JANUARY 2024', title: 'THE NIGHT IN QUESTION', subtitle: 'AN ICE STORM MOVED IN' } },
  { kind: 'video', id: '05', source: path.join(SOURCES, 'dvids_snowfall.mp4'), sourceStart: 25, duration: 5, narration: 'They kept fifteen people alive through an ice storm that would have killed them outside.', rationale: 'Public-domain snowy, icy conditions directly support the danger described.', treatment: { kicker: 'OASIS VILLAGE', title: '15 PEOPLE KEPT SAFE' } },
  { kind: 'video', id: '06', source: path.join(OASIS_RAW, 'oasis_clip_063.mp4'), sourceStart: 0, duration: 5, narration: 'This is the story of Oasis Village - a place that should not work, on paper...', rationale: 'Actual private cabin interior anchors the claimed safety and shelter.' },
  { kind: 'video', id: '07', source: path.join(OASIS_RAW, 'oasis_clip_015.mp4'), sourceStart: 0, duration: 5, narration: '...and somehow works better than almost anything else being tried for homelessness in America right now.', rationale: 'Actual Oasis community kitchen footage, not generic stock.' },
  { kind: 'video', id: '08', source: path.join(OASIS_RAW, 'oasis_clip_011.mp4'), sourceStart: 0, duration: 5, narration: 'Here is the part most people get wrong before they ever hear a story like this one.', rationale: 'Neutral actual Oasis cabin row holds the transition before the hypothetical shelter contrast.', treatment: { kicker: 'THE DEFAULT IMAGE', title: 'WHAT PEOPLE PICTURE AS “SHELTER”' } },
  { kind: 'image', id: '09', source: path.join(SOURCES, 'fema_empty_cots_gym.jpg'), duration: 5, filter: 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p', narration: 'They picture a shelter and they picture a gymnasium.', rationale: 'Verified public-domain FEMA photograph of real cots in a gymnasium; generic mass shelter, not Oasis.', treatment: { kicker: 'MASS SHELTER', title: 'A GYMNASIUM OF COTS' } },
  { kind: 'image', id: '10', source: path.join(SOURCES, 'fema_rows_of_cots.jpg'), duration: 5, filter: 'crop=1600:900:0:210,scale=1920:1080,format=yuv420p', narration: 'Rows of cots. A stranger\'s breathing six feet away.', rationale: 'Verified public-domain FEMA photograph of real school-hall shelter cots.', treatment: { kicker: 'THE TRADE-OFF', title: 'NO PRIVACY' } },
  { kind: 'image', id: '11', source: path.join(SOURCES, 'fema_rows_of_cots.jpg'), duration: 5, filter: 'crop=1300:731:300:260,scale=1920:1080,format=yuv420p', narration: 'Lights on at six, everybody out by eight, no exceptions.', rationale: 'Tighter alternate crop of the same real mass-shelter environment; no invented scene.', treatment: { kicker: 'THE TRADE-OFF', title: 'STRICT TIMETABLES' } },
  { kind: 'video', id: '12', source: path.join(SOURCES, 'dvids_emergency_shelter.mp4'), sourceStart: 10, duration: 5, narration: 'No pets, no privacy, no say in any of it.', rationale: 'Public-domain shelter rules signage includes the literal no-pets restriction; source material plus an editorial context label.', treatment: { kicker: 'THE TRADE-OFF', title: 'RULES AND RESTRICTIONS' } },
  { kind: 'image', id: '13', source: path.join(SOURCES, 'fema_rows_of_cots.jpg'), duration: 5, filter: 'crop=1200:675:350:390,scale=1920:1080,format=yuv420p', narration: 'And here is the thing nobody talks about: a huge number of homeless people will not go to a place like that.', rationale: 'Purposeful split-screen compares a real mass-shelter setting with an actual Oasis private cabin, without treating either as the other.', layout: 'split', secondarySource: path.join(OASIS_RAW, 'oasis_clip_018.mp4') },
  { kind: 'video', id: '14', source: path.join(SOURCES, 'dvids_emergency_shelter.mp4'), sourceStart: 18, duration: 5, narration: 'Not because they do not want help.', rationale: 'Generic public-domain shelter intake scene: context for seeking help, never identified as Oasis.', treatment: { kicker: 'THE POINT', title: 'HELP IS NOT THE PROBLEM' } },
  { kind: 'video', id: '15', source: path.join(OASIS_RAW, 'oasis_clip_018.mp4'), sourceStart: 0, duration: 5, narration: 'Because the price of that help is handing over the last thing they still control - who they sleep next to...', rationale: 'Actual individual Oasis cabin and door provide the precise visual contrast: a private place of one\'s own.', treatment: { kicker: 'THE PRICE OF HELP', title: 'LOSING CONTROL' } },
  { kind: 'video', id: '16', source: path.join(OASIS_RAW, 'oasis_clip_014.mp4'), sourceStart: 0, duration: 1.16, narration: '...and whether they are safe doing it.', rationale: 'Actual Oasis cabin closes the chapter on safety and dignity.' },
];

async function run(command: string, args: string[]) { await execFileAsync(command, args, { maxBuffer: 8 * 1024 * 1024 }); }
function assertReadable(filePath: string) { if (!fs.existsSync(filePath)) throw new Error(`Required source is missing: ${filePath}`); }

function calloutFilter(treatment?: Treatment) {
  if (!treatment) return '';
  const lines = [
    'drawbox=x=66:y=772:w=760:h=214:color=0x0B1118@0.78:t=fill',
    'drawbox=x=66:y=772:w=10:h=214:color=0xD79B3B@1:t=fill',
  ];
  let titleY = 820;
  if (treatment.kicker) {
    lines.push(`drawtext=fontfile=${FONT_BOLD}:text='${treatment.kicker}':fontcolor=0xD79B3B:fontsize=22:x=102:y=806`);
    titleY = 846;
  }
  lines.push(`drawtext=fontfile=${FONT_BOLD}:text='${treatment.title}':fontcolor=white:fontsize=42:x=102:y=${titleY}`);
  if (treatment.subtitle) lines.push(`drawtext=fontfile=${FONT_REGULAR}:text='${treatment.subtitle}':fontcolor=0xD7DEE8:fontsize=24:x=102:y=${titleY + 57}`);
  return `,${lines.join(',')}`;
}

function finishFilter(filter: string, beat: Beat) {
  const fadeOutStart = Math.max(0, beat.duration - 0.18).toFixed(2);
  return `${filter}${calloutFilter(beat.treatment)},fade=t=in:st=0:d=0.18,fade=t=out:st=${fadeOutStart}:d=0.18,fps=30,format=yuv420p`;
}

async function renderBeat(beat: Beat, destination: string) {
  assertReadable(beat.source);
  const common = ['-hide_banner', '-loglevel', 'error', '-y'];
  if (beat.kind === 'image' && beat.layout === 'split') {
    if (!beat.secondarySource) throw new Error(`Split beat ${beat.id} has no second source`);
    assertReadable(beat.secondarySource);
    const splitFilter = [
      '[0:v]crop=1200:675:350:390,scale=960:1080,setsar=1[left]',
      '[1:v]scale=960:1080:force_original_aspect_ratio=increase,crop=960:1080,setsar=1[right]',
      '[left][right]hstack=inputs=2',
      'drawbox=x=956:y=0:w=8:h=1080:color=0xD79B3B@1:t=fill',
      'drawbox=x=60:y=55:w=406:h=94:color=0x0B1118@0.82:t=fill',
      `drawtext=fontfile=${FONT_BOLD}:text='MASS SHELTER':fontcolor=white:fontsize=30:x=84:y=80`,
      'drawbox=x=1435:y=55:w=426:h=94:color=0x0B1118@0.82:t=fill',
      `drawtext=fontfile=${FONT_BOLD}:text='A PRIVATE DOOR':fontcolor=white:fontsize=30:x=1460:y=80`,
    ].join(',');
    await run('ffmpeg', [...common, '-loop', '1', '-framerate', '30', '-i', beat.source, '-stream_loop', '-1', '-i', beat.secondarySource, '-t', String(beat.duration), '-an', '-filter_complex', finishFilter(splitFilter, beat), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-movflags', '+faststart', destination]);
    return;
  }
  if (beat.kind === 'video') {
    await run('ffmpeg', [...common, '-ss', String(beat.sourceStart), '-i', beat.source, '-t', String(beat.duration), '-an', '-vf', finishFilter('scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080', beat), '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-movflags', '+faststart', destination]);
    return;
  }
  await run('ffmpeg', [...common, '-loop', '1', '-framerate', '30', '-i', beat.source, '-t', String(beat.duration), '-an', '-vf', finishFilter(beat.filter.replace(/,format=yuv420p$/, ''), beat), '-r', '30', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-movflags', '+faststart', destination]);
}

async function main() {
  assertReadable(AUDIO_PATH);
  const totalDuration = Number(BEATS.reduce((total, beat) => total + beat.duration, 0).toFixed(2));
  if (totalDuration !== 75.74) throw new Error(`Beat durations must equal 75.74 seconds; got ${totalDuration}`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.rmSync(WORK_DIR, { recursive: true, force: true });
  fs.mkdirSync(WORK_DIR, { recursive: true });
  const segments: string[] = [];
  for (const [index, beat] of BEATS.entries()) {
    const segment = path.join(WORK_DIR, `beat_${String(index + 1).padStart(2, '0')}.mp4`);
    await renderBeat(beat, segment);
    segments.push(segment);
  }
  const concatFile = path.join(WORK_DIR, 'concat.txt');
  fs.writeFileSync(concatFile, segments.map((file) => `file '${file.replace(/'/g, "'\\''")}'`).join('\n'), 'utf8');
  const joinedVideo = path.join(WORK_DIR, 'joined_video.mp4');
  await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', concatFile, '-c', 'copy', '-movflags', '+faststart', joinedVideo]);
  await run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', joinedVideo, '-i', AUDIO_PATH, '-map', '0:v:0', '-map', '1:a:0', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-shortest', '-movflags', '+faststart', OUTPUT_PATH]);
  fs.writeFileSync(AUDIT_PATH, JSON.stringify({ output: OUTPUT_PATH, narration: AUDIO_PATH, totalDuration, rules: ['16:9 1920x1080', 'editorial text callouts only where they clarify the narration', 'gentle fade-to-black transitions between every beat', 'one script-matched split-screen comparison', 'no music or SFX', 'source clip audio removed', 'every source hold <= 5 seconds'], beats: BEATS }, null, 2));
  console.log(`Created: ${OUTPUT_PATH}`); console.log(`Audit: ${AUDIT_PATH}`);
}

main().catch((error) => { console.error(error); process.exit(1); });
