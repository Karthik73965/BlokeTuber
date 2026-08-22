import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

const FFMPEG_BIN = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';

function resolveClipPath(rawPath: string | null, timelineDir: string): string | null {
  if (!rawPath) return null;

  // 1. Direct path
  if (fs.existsSync(rawPath)) return rawPath;

  // 2. Relative to timelineDir
  const relPath = path.resolve(timelineDir, rawPath);
  if (fs.existsSync(relPath)) return relPath;

  // 3. Relative to base output or cwd
  const baseOut = path.resolve(process.cwd(), rawPath);
  if (fs.existsSync(baseOut)) return baseOut;

  // 4. Normalized path (Windows / POSIX slashes)
  const normalized = path.normalize(rawPath);
  if (fs.existsSync(normalized)) return normalized;

  // 5. Strip leading output/ or clips/
  const stripped = rawPath.replace(/^(output|clips)[\\\/]/, '');
  const candidate1 = path.join(timelineDir, stripped);
  if (fs.existsSync(candidate1)) return candidate1;

  const candidate2 = path.join(timelineDir, 'stock', path.basename(rawPath));
  if (fs.existsSync(candidate2)) return candidate2;

  return null;
}

export async function renderTimelineVideo(
  timelineJsonPath: string,
  outputVideoPath: string,
  onProgress?: (clipIndex: number, totalClips: number) => void
): Promise<string> {
  const absoluteTimelinePath = path.resolve(timelineJsonPath);
  if (!fs.existsSync(absoluteTimelinePath)) {
    throw new Error(`Timeline file not found: ${absoluteTimelinePath}`);
  }

  const timeline = JSON.parse(fs.readFileSync(absoluteTimelinePath, 'utf-8'));
  const timelineDir = path.dirname(absoluteTimelinePath);
  const tmpDir = path.join(timelineDir, 'tmp_render');
  fs.mkdirSync(tmpDir, { recursive: true });

  const finalOut = path.resolve(outputVideoPath);
  const fps = 30;
  const processedClips: string[] = [];

  console.log(`\n🎬 [RenderEngine] Starting Automated Video Render`);
  console.log(`📋 Timeline: ${absoluteTimelinePath}`);
  console.log(`📂 Output: ${finalOut}`);
  console.log(`🎞️  Clips: ${timeline.clips.length} | ⏱️ Duration: ${Math.round(timeline.totalDuration)}s\n`);

  for (let i = 0; i < timeline.clips.length; i++) {
    const clip = timeline.clips[i];
    const duration = Math.max(0.5, clip.endTime - clip.startTime);
    const outFile = path.join(tmpDir, `clip_${String(i).padStart(4, '0')}.mp4`);
    processedClips.push(outFile);

    if (onProgress) onProgress(i + 1, timeline.clips.length);

    const resolvedPath = resolveClipPath(clip.clipPath, timelineDir);
    const isImage =
      clip.mediaType === 'image' ||
      (resolvedPath && /\.(jpg|jpeg|png|webp)$/i.test(resolvedPath)) ||
      !resolvedPath;

    console.log(
      `  🎬 [${i + 1}/${timeline.clips.length}] ${isImage ? '📷 Photo' : '📹 Video'}: ${path.basename(resolvedPath || 'placeholder')} (${duration.toFixed(1)}s)`
    );

    let ffmpegCmd = '';
    const totalFrames = Math.max(15, Math.ceil(duration * fps));

    if (isImage) {
      // ── MULTI-VECTOR DYNAMIC KEN BURNS ON 4K CANVAS (4 Alternating Trajectories) ──
      const vectorType = i % 4;
      let zoompanExpr = '';

      if (vectorType === 0) {
        // Slow Center Zoom-In (1.0 -> 1.15)
        const step = (0.15 / totalFrames).toFixed(6);
        zoompanExpr = `zoompan=z='min(zoom+${step},1.15)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=1920x1080:fps=${fps}`;
      } else if (vectorType === 1) {
        // Slow Pan Left to Right
        const xStep = `(iw - iw/1.10) * (on/${totalFrames})`;
        zoompanExpr = `zoompan=z='1.10':x='${xStep}':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=1920x1080:fps=${fps}`;
      } else if (vectorType === 2) {
        // Slow Reveal Zoom-Out (1.15 -> 1.0)
        const step = (0.15 / totalFrames).toFixed(6);
        zoompanExpr = `zoompan=z='max(1.15-${step}*on,1.0)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=1920x1080:fps=${fps}`;
      } else {
        // Slow Pan Right to Left
        const xStep = `(iw - iw/1.10) * (1 - on/${totalFrames})`;
        zoompanExpr = `zoompan=z='1.10':x='${xStep}':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=1920x1080:fps=${fps}`;
      }

      const inputSpec = resolvedPath
        ? `-loop 1 -framerate ${fps} -i "${resolvedPath}"`
        : `-f lavfi -i color=c=0x18181b:s=3840x2160:r=${fps}`;

      const filters: string[] = [
        `[0:v]scale=3840:2160:force_original_aspect_ratio=increase,crop=3840:2160,${zoompanExpr},eq=contrast=1.06:brightness=-0.01:saturation=1.06,vignette=PI/5[base]`,
      ];

      let lastLabel = '[base]';

      // Number callouts
      if (clip.numberOverlays && clip.numberOverlays.length > 0) {
        for (let oi = 0; oi < clip.numberOverlays.length; oi++) {
          const overlay = clip.numberOverlays[oi];
          const outLabel = `[ov${oi}]`;
          const enable = `between(t,${Math.max(0, overlay.startTime).toFixed(2)},${overlay.endTime.toFixed(2)})`;
          filters.push(
            `${lastLabel}drawbox=x=(w-tw)/2-20:y=h-220-10:w=tw+40:h=th+20:color=0xF59E0B@0.95:t=fill:enable=${enable}[bg${oi}]`
          );
          filters.push(
            `[bg${oi}]drawtext=text='${overlay.text.replace(/'/g, '')}':fontsize=64:fontcolor=0x111116:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-tw)/2:y=h-220:enable=${enable}${outLabel}`
          );
          lastLabel = outLabel;
        }
      }

      const finalFilter = filters.join(';');
      const mapLabel = lastLabel.replace(/[\[\]]/g, '');

      ffmpegCmd = [
        `${FFMPEG_BIN} -y`,
        inputSpec,
        `-t ${duration.toFixed(3)}`,
        `-filter_complex "${finalFilter}"`,
        `-map "[${mapLabel}]"`,
        `-r ${fps} -c:v libx264 -preset fast -crf 17`,
        `-an "${outFile}"`,
      ].join(' ');
    } else {
      // ── REAL VIDEO BEAT ──
      const filters: string[] = [
        `[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,eq=contrast=1.06:brightness=-0.01:saturation=1.06,vignette=PI/5[graded]`,
      ];
      let lastLabel = '[graded]';

      // Number callouts
      if (clip.numberOverlays && clip.numberOverlays.length > 0) {
        for (let oi = 0; oi < clip.numberOverlays.length; oi++) {
          const overlay = clip.numberOverlays[oi];
          const outLabel = `[ov${oi}]`;
          const enable = `between(t,${Math.max(0, overlay.startTime).toFixed(2)},${overlay.endTime.toFixed(2)})`;
          filters.push(
            `${lastLabel}drawbox=x=(w-tw)/2-20:y=h-220-10:w=tw+40:h=th+20:color=0xF59E0B@0.95:t=fill:enable=${enable}[bg${oi}]`
          );
          filters.push(
            `[bg${oi}]drawtext=text='${overlay.text.replace(/'/g, '')}':fontsize=64:fontcolor=0x111116:fontfile='C\\:/Windows/Fonts/arialbd.ttf':x=(w-tw)/2:y=h-220:enable=${enable}${outLabel}`
          );
          lastLabel = outLabel;
        }
      }

      const finalFilter = filters.join(';');
      const mapLabel = lastLabel.replace(/[\[\]]/g, '');

      ffmpegCmd = [
        `${FFMPEG_BIN} -y`,
        `-i "${resolvedPath}"`,
        `-t ${duration.toFixed(3)}`,
        `-filter_complex "${finalFilter}"`,
        `-map "[${mapLabel}]"`,
        `-r ${fps} -c:v libx264 -preset fast -crf 17`,
        `-an "${outFile}"`,
      ].join(' ');
    }

    try {
      execSync(ffmpegCmd, { stdio: 'pipe' });
    } catch (err: any) {
      console.warn(`    ⚠️ Clip render fallback for clip ${i}:`, err.message?.slice(0, 100));
      const fallbackCmd = `${FFMPEG_BIN} -y -f lavfi -i color=c=0x18181b:s=1920x1080:r=${fps} -t ${duration.toFixed(3)} -c:v libx264 -preset ultrafast -an "${outFile}"`;
      execSync(fallbackCmd, { stdio: 'pipe' });
    }
  }

  // ── CONCATENATE CLIPS ───────────────────────────────────────────────────────
  console.log(`\n🔗 Concatenating ${processedClips.length} processed video clips...`);
  const concatListPath = path.join(tmpDir, 'concat_list.txt');
  const listContent = processedClips.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatListPath, listContent);

  const rawVideoPath = path.join(tmpDir, 'raw_video.mp4');
  const concatCmd = `${FFMPEG_BIN} -y -f concat -safe 0 -i "${concatListPath}" -c copy "${rawVideoPath}"`;
  execSync(concatCmd, { stdio: 'pipe' });

  // ── AUDIO MIXING & FINAL MULTIPLEXING ───────────────────────────────────────
  const masterAudio = resolveClipPath(timeline.masterAudioPath, timelineDir);

  if (masterAudio && fs.existsSync(masterAudio)) {
    console.log(`🎙️  Multiplexing master narration audio track: ${path.basename(masterAudio)}`);
    const muxCmd = `${FFMPEG_BIN} -y -i "${rawVideoPath}" -i "${masterAudio}" -c:v copy -c:a aac -b:a 192k -shortest "${finalOut}"`;
    execSync(muxCmd, { stdio: 'pipe' });
  } else {
    console.warn('⚠️ No master audio file found — exporting silent video.');
    fs.copyFileSync(rawVideoPath, finalOut);
  }

  // Clean up temporary render folder
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}

  console.log(`\n====================================================`);
  console.log(`✅ AUTOMATED RENDER COMPLETE!`);
  console.log(`📁 Final Output: ${finalOut}`);
  console.log(`====================================================\n`);

  return finalOut;
}
