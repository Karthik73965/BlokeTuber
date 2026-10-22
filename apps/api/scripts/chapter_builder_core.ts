import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

export interface BeatDefinition {
  beatIndex: number;
  text: string;
  startTime: number;
  endTime: number;
  sourcePath: string; // Absolute path or filename in downloads/
  sourceStart: number;
  sourceDuration?: number;
  slug: string;
  callout?: any;
  sfx?: string;
  sfxVolume?: number;
  transitionType?: string;
  transitionDuration?: number;
}

export interface BuildChapterOptions {
  chapterIndex: number;
  chapterId: string;
  audioPath: string;
  beats: BeatDefinition[];
}

export function buildChapter(options: BuildChapterOptions) {
  const { chapterIndex, chapterId, audioPath, beats } = options;
  const repoRoot = path.resolve(__dirname, '../../..');
  const rawDir = path.resolve(repoRoot, 'uploads/raw/proj_dome_villages');
  const downloadsDir = path.resolve(rawDir, 'downloads');
  const thumbsDir = path.resolve(repoRoot, 'uploads/thumbnails');
  const chPad = String(chapterIndex).padStart(2, '0');
  const snapshotsDir = path.resolve(repoRoot, `uploads/beat_snapshots/ch${chPad}_perfect`);
  const timelinePath = path.resolve(repoRoot, `uploads/timelines/dome/chapter_${chPad}_final.json`);

  fs.mkdirSync(snapshotsDir, { recursive: true });
  fs.mkdirSync(thumbsDir, { recursive: true });

  console.log(`\n======================================================`);
  console.log(`🎬 BUILDING CHAPTER ${chPad} (${beats.length} beats)`);
  console.log(`======================================================`);

  const finalClips: any[] = [];

  for (const beat of beats) {
    let src = beat.sourcePath;
    if (!path.isAbsolute(src)) {
      // Check downloads dir first, then rawDir
      const inDownloads = path.resolve(downloadsDir, src);
      const inRaw = path.resolve(rawDir, src);
      if (fs.existsSync(inDownloads)) {
        src = inDownloads;
      } else if (fs.existsSync(inRaw)) {
        src = inRaw;
      } else {
        throw new Error(`[Ch ${chPad} Beat ${beat.beatIndex}] Source file not found: ${beat.sourcePath}`);
      }
    }

    // Cache source file duration
    let srcDuration = 999999;
    try {
      const durStr = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${src}"`, { encoding: 'utf-8' }).trim();
      const parsed = parseFloat(durStr);
      if (!isNaN(parsed) && parsed > 0) {
        srcDuration = parsed;
      }
    } catch (e) {}

    const duration = beat.sourceDuration || (beat.endTime - beat.startTime + 0.5);
    let effectiveStart = beat.sourceStart;
    if (effectiveStart + duration > srcDuration) {
      effectiveStart = Math.max(0, srcDuration - duration - 0.2);
      console.log(`  ⚠️ [Beat ${beat.beatIndex}] Clamped start from ${beat.sourceStart}s to ${effectiveStart.toFixed(2)}s (src duration: ${srcDuration.toFixed(2)}s)`);
    }

    const clipFilename = `${beat.slug}.mp4`;
    const clipOutPath = path.resolve(rawDir, clipFilename);
    const p1Path = path.resolve(thumbsDir, `${beat.slug}_p1.jpg`);
    const p2Path = path.resolve(thumbsDir, `${beat.slug}_p2.jpg`);
    const snapPath = path.resolve(snapshotsDir, `beat_${String(beat.beatIndex).padStart(2, '0')}.jpg`);

    console.log(`[Beat ${beat.beatIndex}/${beats.length - 1}] "${beat.text.slice(0, 40)}..." -> ${path.basename(src)} @ ${effectiveStart.toFixed(2)}s (${duration.toFixed(2)}s)`);

    // 1. Slice MP4
    const sliceCmd = `ffmpeg -y -ss ${effectiveStart.toFixed(2)} -i "${src}" -t ${duration.toFixed(2)} -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset fast -crf 20 -c:a aac -b:a 128k -movflags +faststart "${clipOutPath}"`;
    execSync(sliceCmd, { stdio: 'pipe' });

    // 2. Extract thumbnails (adaptive timestamps within slice bounds)
    const t1 = Math.min(0.8, Math.max(0.1, duration * 0.25));
    const t2 = Math.min(2.0, Math.max(0.4, duration * 0.65));
    const ss1Cmd = `ffmpeg -y -ss ${t1.toFixed(2)} -i "${clipOutPath}" -vframes 1 -q:v 2 "${p1Path}"`;
    const ss2Cmd = `ffmpeg -y -ss ${t2.toFixed(2)} -i "${clipOutPath}" -vframes 1 -q:v 2 "${p2Path}"`;
    execSync(ss1Cmd, { stdio: 'pipe' });
    execSync(ss2Cmd, { stdio: 'pipe' });

    // 3. Save snapshot for inspection
    fs.copyFileSync(p1Path, snapPath);

    // 4. Construct clip object
    const clipObj: any = {
      beatIndex: beat.beatIndex,
      chapterIndex,
      text: beat.text,
      startTime: beat.startTime,
      endTime: beat.endTime,
      clipPath: clipOutPath,
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      kenBurns: true,
      transitionType: beat.transitionType || (beat.beatIndex === 0 ? 'cut' : 'crossfade'),
      transitionDuration: beat.transitionDuration !== undefined ? beat.transitionDuration : (beat.beatIndex === 0 ? 0 : 0.35),
      numberOverlays: [],
      overlay: 'none',
      callout: beat.callout || null,
    };

    if (beat.sfx) {
      clipObj.sfxPath = path.resolve(repoRoot, `packages/remotion-video/public/sfx/${beat.sfx}`);
      clipObj.sfxVolume = beat.sfxVolume || 0.15;
    }

    finalClips.push(clipObj);
  }

  // 5. Calculate audio duration & write timeline JSON
  let totalDuration = beats[beats.length - 1].endTime;
  try {
    const durStr = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${audioPath}"`, { encoding: 'utf-8' }).trim();
    totalDuration = parseFloat(durStr) || totalDuration;
  } catch (e) {}

  const timelineData = {
    masterAudioPath: audioPath,
    totalDuration,
    clips: finalClips,
  };

  fs.writeFileSync(timelinePath, JSON.stringify(timelineData, null, 2), 'utf-8');
  console.log(`\n💾 Saved chapter timeline: ${timelinePath}`);

  return timelineData;
}
