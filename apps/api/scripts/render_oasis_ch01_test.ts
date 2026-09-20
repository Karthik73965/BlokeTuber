import { execFile } from 'child_process';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const execFileAsync = promisify(execFile);

const REPO_ROOT = path.resolve(__dirname, '../../..');
const AUDIO_PATH = path.join(REPO_ROOT, 'uploads/audio/oasis_ch01.mp3');
const RAW_DIR = path.join(REPO_ROOT, 'uploads/raw/proj_oasis_village');
const OUTPUT_DIR = path.join(REPO_ROOT, 'output/oasis_village');
const WORK_DIR = path.join(REPO_ROOT, 'tmp/oasis_ch01_narration_only');
const OUTPUT_PATH = path.join(OUTPUT_DIR, 'chapter_01_test_narration_only.mp4');

/**
 * Chapter 1 test: all footage is from the user-approved Oasis source video.
 * Every visual hold is <= 5 seconds. Source clip audio is deliberately discarded.
 */
const CUTS: Array<{ clip: number; duration: number }> = [
  { clip: 1, duration: 4.58 },  // establishing cabins
  { clip: 2, duration: 4.75 },  // cabin / porch detail
  { clip: 3, duration: 4.75 },  // resident and dog
  { clip: 4, duration: 4.75 },  // dog-run exterior
  { clip: 5, duration: 4.75 },  // cabin threshold
  { clip: 7, duration: 4.75 },  // resident and pet
  { clip: 8, duration: 4.75 },  // village exterior
  { clip: 12, duration: 4.75 }, // cabin row
  { clip: 13, duration: 4.75 }, // cabins in perspective
  { clip: 14, duration: 4.75 }, // cabin door / privacy
  { clip: 15, duration: 4.75 }, // community exterior
  { clip: 16, duration: 4.75 }, // community house
  { clip: 17, duration: 4.75 }, // outdoor common area
  { clip: 18, duration: 4.75 }, // garden / dignity detail
  { clip: 19, duration: 4.75 }, // cabin row
  { clip: 63, duration: 4.66 }, // interior: a private place to sleep
];

async function run(command: string, args: string[]) {
  await execFileAsync(command, args, { maxBuffer: 8 * 1024 * 1024 });
}

async function main() {
  if (!fs.existsSync(AUDIO_PATH)) throw new Error(`Narration is missing: ${AUDIO_PATH}`);
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.rmSync(WORK_DIR, { recursive: true, force: true });
  fs.mkdirSync(WORK_DIR, { recursive: true });

  const segmentPaths: string[] = [];
  for (let index = 0; index < CUTS.length; index++) {
    const cut = CUTS[index]!;
    const source = path.join(RAW_DIR, `oasis_clip_${String(cut.clip).padStart(3, '0')}.mp4`);
    if (!fs.existsSync(source)) throw new Error(`Approved source clip is missing: ${source}`);

    const segment = path.join(WORK_DIR, `segment_${String(index + 1).padStart(2, '0')}.mp4`);
    await run('ffmpeg', [
      '-hide_banner', '-loglevel', 'error', '-y',
      '-i', source,
      '-t', String(cut.duration),
      '-an',
      '-vf', 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv420p',
      '-r', '30',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18',
      '-movflags', '+faststart',
      segment,
    ]);
    segmentPaths.push(segment);
  }

  const concatFile = path.join(WORK_DIR, 'concat.txt');
  fs.writeFileSync(
    concatFile,
    segmentPaths.map((segment) => `file '${segment.replace(/'/g, "'\\''")}'`).join('\n'),
    'utf8',
  );

  const joinedVideo = path.join(WORK_DIR, 'joined_video.mp4');
  await run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-f', 'concat', '-safe', '0', '-i', concatFile,
    '-c', 'copy', '-movflags', '+faststart',
    joinedVideo,
  ]);

  await run('ffmpeg', [
    '-hide_banner', '-loglevel', 'error', '-y',
    '-i', joinedVideo, '-i', AUDIO_PATH,
    '-map', '0:v:0', '-map', '1:a:0',
    '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k',
    '-shortest', '-movflags', '+faststart',
    OUTPUT_PATH,
  ]);

  console.log(`Created: ${OUTPUT_PATH}`);
  console.log(`Cuts: ${CUTS.length}; visual maximum: ${Math.max(...CUTS.map((cut) => cut.duration)).toFixed(2)}s`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
