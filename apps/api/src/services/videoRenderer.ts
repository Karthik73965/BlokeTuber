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

/**
 * Escape text for FFmpeg drawtext. Removes single quotes and colons to prevent filter syntax breakage.
 */
function escapeDrawtext(text: string): string {
  return text.replace(/'/g, '').replace(/:/g, ' ').replace(/"/g, '').replace(/\\/g, '').replace(/\[/g, '').replace(/\]/g, '').trim();
}

/**
 * Builds FFmpeg filter_complex chains for:
 * - lower_third: bottom-left broadcast card (yellow bar + bold name + subtitle + dark bg)
 * - center_title: centered bold stat/date callout (dark bg pill + yellow underline + white text)
 *
 * Uses FFmpeg-safe fixed positions with enable='between(t,0.05,HOLDEND)' — no animated alpha/slide.
 * - lower_third holds from 0.05s to min(2.5s, clipDuration-0.15s)
 * - center_title holds from 0.05s to min(2.0s, clipDuration-0.15s)
 *
 * Returns the filter strings to append and the new last label.
 */
function buildCalloutFilters(
  callout: { type: 'lower_third' | 'center_title'; line1: string; line2?: string; startTime?: number; endTime?: number } | null | undefined,
  inputLabel: string,
  clipDuration: number
): { filters: string[]; outputLabel: string } {
  if (!callout || !callout.line1) return { filters: [], outputLabel: inputLabel };

  const filters: string[] = [];
  const line1 = escapeDrawtext(callout.line1);
  const line2 = callout.line2 ? escapeDrawtext(callout.line2) : '';
  const tag = `co_${Math.random().toString(36).slice(2, 7)}`;

  // Windows system font paths
  const boldFont = 'C\\:/Windows/Fonts/arialbd.ttf';
  const regularFont = 'C\\:/Windows/Fonts/arial.ttf';

  // Precision audio-synchronized timing from Whisper word alignments
  const startT = typeof callout.startTime === 'number' ? Math.max(0.05, callout.startTime) : 0.05;
  const maxEnd = Math.max(startT + 0.5, clipDuration - 0.05);
  const endT = typeof callout.endTime === 'number'
    ? Math.min(maxEnd, Math.max(startT + 0.8, callout.endTime))
    : Math.min(maxEnd, startT + 2.2);

  const enableExpr = `between(t,${startT.toFixed(2)},${endT.toFixed(2)})`;

  if (callout.type === 'lower_third') {
    // ── FLOATING CLEAN TYPOGRAPHIC LOWER-THIRD (Netflix / HBO Documentary Style) ──
    const barH = line2 ? 86 : 52;

    // Vertical gold accent bar on left edge
    const lbl0 = `[${tag}_bar]`;
    filters.push(`${inputLabel}drawbox=x=80:y=860:w=6:h=${barH}:color=0xF5C518FF:t=fill:enable='${enableExpr}'${lbl0}`);

    // Bold white name text with crisp black outline & drop shadow
    const lbl1 = `[${tag}_l1]`;
    filters.push(`${lbl0}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=46:fontcolor=white:borderw=3:bordercolor=black:shadowx=2:shadowy=2:shadowcolor=black@0.9:x=102:y=864:enable='${enableExpr}'${lbl1}`);

    // Subtitle line in light gray/amber with subtle border & shadow
    if (line2) {
      const lbl2 = `[${tag}_l2]`;
      filters.push(`${lbl1}drawtext=text='${line2}':fontfile='${regularFont}':fontsize=26:fontcolor=0xD4D4D8FF:borderw=2:bordercolor=black:shadowx=2:shadowy=2:shadowcolor=black@0.9:x=102:y=918:enable='${enableExpr}'${lbl2}`);
      return { filters, outputLabel: lbl2 };
    }

    return { filters, outputLabel: lbl1 };

  } else {
    // ── BIG BOLD CENTER TITLE (Dates & Stats — No Glitch, Heavy Black Border) ──
    // Massive 78pt bold white text with 5px black border & rich shadow
    const lbl0 = `[${tag}_ct]`;
    filters.push(`${inputLabel}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=78:fontcolor=white:borderw=5:bordercolor=black:shadowx=4:shadowy=4:shadowcolor=black@0.95:x=(w-tw)/2:y=(h-th)/2:enable='${enableExpr}'${lbl0}`);

    return { filters, outputLabel: lbl0 };
  }
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

    // ── DYNAMIC TRANSITIONS ON EVERY CLIP (Rotates through 3 minimal styles) ──
    // 1. Shutter Click (0.06s), 2. Soft Film Fade (0.12s), 3. Subtle Film Dip (0.08s)
    let colorGrade = `eq=contrast=1.06:brightness=-0.01:saturation=1.06`;
    const transMode = i % 3;

    if (transMode === 0) {
      // 1. Shutter Click: 0.06s camera shutter blink
      colorGrade = `eq=contrast=1.06:brightness='if(lt(t,0.06),0.16*(1-t/0.06),-0.01)':saturation=1.06`;
    } else if (transMode === 1) {
      // 2. Soft Film Fade: 0.12s quick micro-fade from soft dark
      colorGrade = `eq=contrast=1.06:brightness='if(lt(t,0.12),-0.25*(1-t/0.12),-0.01)':saturation=1.06`;
    } else {
      // 3. Subtle Film Dip: 0.08s micro dip
      colorGrade = `eq=contrast=1.06:brightness='if(lt(t,0.08),-0.18*(1-t/0.08),-0.01)':saturation=1.06`;
    }

    const filmGrain = `noise=c0s=5:allf=t+u`;

    if (isImage) {
      // ── DYNAMIC CONTINUOUS CAMERA MOTION ON EVERY PHOTO (4 FLUID MODES) ──
      const vectorType = i % 4;
      let zoompanExpr = '';

      if (vectorType === 0) {
        // 1. Smooth Push-In (1.0 -> 1.07) — continuous, steady glide
        zoompanExpr = `zoompan=z='1.0+0.07*(on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps=${fps}`;
      } else if (vectorType === 1) {
        // 2. Smooth Reveal Pull-Out (1.07 -> 1.0) — continuous, steady reveal
        zoompanExpr = `zoompan=z='1.07-0.07*(on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps=${fps}`;
      } else if (vectorType === 2) {
        // 3. Smooth Fluid Arc: Gentle Zoom-In -> Gentle Zoom-Out (1.0 -> 1.05 -> 1.0)
        zoompanExpr = `zoompan=z='1.0+0.05*sin(3.14159265*on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps=${fps}`;
      } else {
        // 4. Smooth Vertical Parallax Drift (1.03 -> 1.06 gentle vertical glide)
        zoompanExpr = `zoompan=z='1.03+0.03*(on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*(on/${totalFrames})':d=1:s=1920x1080:fps=${fps}`;
      }

      const inputSpec = resolvedPath
        ? `-loop 1 -i "${resolvedPath}"`
        : `-f lavfi -i color=c=0x18181b:s=1920x1080:r=${fps}`;

      const filterChain = `[0:v]scale=3500:1968:force_original_aspect_ratio=increase,crop=3500:1968,${zoompanExpr},${colorGrade},${filmGrain}[base]`;
      const filters: string[] = [filterChain];
      let lastLabel = '[base]';

      // ── NUMBER CALLOUTS (legacy badge overlays) ──
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

      // ── AI CALLOUT OVERLAYS (lower_third / center_title with audio sync) ──
      const { filters: calloutFilters, outputLabel: calloutLabel } = buildCalloutFilters(
        (clip as any).callout,
        lastLabel,
        duration
      );
      filters.push(...calloutFilters);
      lastLabel = calloutLabel;

      const finalFilter = filters.join(';');
      const mapLabel = lastLabel.replace(/[\[\]]/g, '');

      ffmpegCmd = [
        `${FFMPEG_BIN} -y`,
        inputSpec,
        `-t ${duration.toFixed(3)}`,
        `-filter_complex "${finalFilter}"`,
        `-map "[${mapLabel}]"`,
        `-r ${fps} -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p`,
        `-an "${outFile}"`,
      ].join(' ');
    } else {
      // ── REAL VIDEO BEAT (Clean Hard Cut & 35mm Film Grain) ──
      const filters: string[] = [
        `[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,${colorGrade},${filmGrain}[graded]`,
      ];
      let lastLabel = '[graded]';

      // ── NUMBER CALLOUTS (legacy badge overlays) ──
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

      // ── AI CALLOUT OVERLAYS (lower_third / center_title) ──
      const { filters: calloutFilters, outputLabel: calloutLabel } = buildCalloutFilters(
        (clip as any).callout,
        lastLabel,
        duration
      );
      filters.push(...calloutFilters);
      lastLabel = calloutLabel;

      const finalFilter = filters.join(';');
      const mapLabel = lastLabel.replace(/[\[\]]/g, '');

      ffmpegCmd = [
        `${FFMPEG_BIN} -y`,
        `-i "${resolvedPath}"`,
        `-t ${duration.toFixed(3)}`,
        `-filter_complex "${finalFilter}"`,
        `-map "[${mapLabel}]"`,
        `-r ${fps} -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p`,
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
