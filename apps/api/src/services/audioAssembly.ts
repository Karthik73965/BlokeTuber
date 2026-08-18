import path from 'path';
import fs from 'fs';
import ffmpeg from 'fluent-ffmpeg';

export interface ChapterTiming {
  chapter: number;
  start: number; // seconds
  end: number;
  duration: number;
}

/**
 * Get the duration of an audio file using ffprobe.
 */
export function getAudioDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) return reject(err);
      resolve(metadata.format.duration || 0);
    });
  });
}

/**
 * Stitch multiple chapter audio files together with a small gap between each.
 * Returns the output path of the master narration file and the chapter timing map.
 */
export async function assembleAudio(
  chapterFiles: string[], // ordered list of absolute paths to chapter audio files
  outputDir: string,
  gapSeconds = 0.4
): Promise<{ masterPath: string; timingMap: ChapterTiming[] }> {
  const outputPath = path.join(outputDir, 'master_narration.mp3');
  const timingMap: ChapterTiming[] = [];
  let cursor = 0;

  // Get durations for all chapters first
  const durations = await Promise.all(chapterFiles.map(getAudioDuration));

  for (let i = 0; i < chapterFiles.length; i++) {
    const duration = durations[i]!;
    timingMap.push({
      chapter: i + 1,
      start: cursor,
      end: cursor + duration,
      duration,
    });
    cursor += duration + gapSeconds;
  }

  // Build FFmpeg concat filter
  return new Promise((resolve, reject) => {
    // Write concat file
    const concatFile = path.join(outputDir, 'concat.txt');
    const lines = chapterFiles.flatMap((f, i) => [
      `file '${f.replace(/\\/g, '/')}'`,
      ...(i < chapterFiles.length - 1
        ? [`duration ${durations[i]}`, `# gap`]
        : []),
    ]);
    fs.writeFileSync(concatFile, lines.join('\n'));

    // Use FFmpeg to stitch with silent gaps
    const cmd = ffmpeg();
    chapterFiles.forEach((f) => cmd.input(f));

    cmd
      .complexFilter(
        chapterFiles
          .map((_f, i) => `[${i}:a]`)
          .join('') +
          `concat=n=${chapterFiles.length}:v=0:a=1[outa]`,
        ['outa']
      )
      .outputOptions(['-ar 44100', '-ac 2', '-b:a 192k'])
      .output(outputPath)
      .on('end', () => {
        fs.unlinkSync(concatFile);
        resolve({ masterPath: outputPath, timingMap });
      })
      .on('error', reject)
      .run();
  });
}
