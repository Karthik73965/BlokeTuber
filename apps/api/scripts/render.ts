#!/usr/bin/env tsx
/**
 * BlokeTuber Local Render Script
 * Usage: tsx scripts/render.ts <path-to-timeline.json> [output.mp4]
 *
 * Reads the timeline JSON produced by the pipeline and renders the final MP4
 * using FFmpeg with:
 * - Clip cuts and crossfades
 * - Smart clip path resolver (locates local clips & stock downloads automatically)
 * - Ken Burns (slow zoom) on static clips
 * - Animated number/dollar callouts (burned-in text)
 * - Master narration audio track
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

// Use ffmpeg-static binary if available, otherwise fallback to system 'ffmpeg'
const FFMPEG_BIN = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';

const timelineJsonPath = process.argv[2];
if (!timelineJsonPath) {
  console.error('Usage: tsx scripts/render.ts <timeline.json> [output.mp4]');
  process.exit(1);
}

const absoluteTimelinePath = path.resolve(timelineJsonPath);
if (!fs.existsSync(absoluteTimelinePath)) {
  console.error(`❌ Timeline file not found at: ${absoluteTimelinePath}`);
  process.exit(1);
}

const timeline = JSON.parse(fs.readFileSync(absoluteTimelinePath, 'utf-8'));
const outputPath = process.argv[3] || timeline.outputPath || 'output.mp4';
const timelineDir = path.dirname(absoluteTimelinePath);
const tmpDir = path.join(timelineDir, 'tmp_render');
fs.mkdirSync(tmpDir, { recursive: true });

console.log(`\n🎬 BlokeTuber Render Engine`);
console.log(`📋 Timeline: ${absoluteTimelinePath}`);
console.log(`📂 Output Target: ${outputPath}`);
console.log(`🎞️  Total Clips: ${timeline.clips.length}`);
console.log(`⏱️  Target Duration: ${Math.round(timeline.totalDuration)}s\n`);

/**
 * Smart clip path resolver to locate clips across local folders and API output directories.
 */
function resolveClipPath(rawPath: string | null): string | null {
  if (!rawPath) return null;

  // 1. Direct path
  if (fs.existsSync(rawPath)) return rawPath;

  // 2. Normalized path (Windows / POSIX slashes)
  const normalized = path.normalize(rawPath);
  if (fs.existsSync(normalized)) return normalized;

  // 3. Strip leading /clips/ or \clips\
  const stripped = rawPath.replace(/^[\/\\]clips[\/\\]/i, '').replace(/^clips[\/\\]/i, '');
  if (fs.existsSync(stripped)) return stripped;

  // 4. Relative to timeline.json location
  const relTimeline = path.resolve(timelineDir, stripped);
  if (fs.existsSync(relTimeline)) return relTimeline;

  // 5. Look inside apps/api/output/ (standard pipeline output directory)
  const apiOutputDir = path.resolve(__dirname, '../output');
  const inApiOutput = path.resolve(apiOutputDir, stripped);
  if (fs.existsSync(inApiOutput)) return inApiOutput;

  // 6. Search for matching jobId stock folder
  const stockMatch = rawPath.match(/output[\/\\]([a-f0-9\-]+)[\/\\]stock[\/\\](stock_\d+\.mp4)/i);
  if (stockMatch) {
    const [, jobId, stockFileName] = stockMatch;
    const directStock = path.resolve(__dirname, '../output', jobId, 'stock', stockFileName);
    if (fs.existsSync(directStock)) return directStock;
  }

  return null;
}

// Process clips
const processedClips: string[] = [];

for (let i = 0; i < timeline.clips.length; i++) {
  const clip = timeline.clips[i];
  const duration = Math.max(0.5, clip.endTime - clip.startTime);
  const outFile = path.join(tmpDir, `clip_${String(i).padStart(3, '0')}.mp4`);

  const resolvedPath = resolveClipPath(clip.clipPath);

  if (!resolvedPath) {
    console.warn(`  ⚠️  Clip ${i + 1}/${timeline.clips.length} missing on disk (${clip.clipPath}). Generating styled dark placeholder background...`);
    
    // Generate a sleek dark placeholder clip with beat text overlay
    const safeText = (clip.text || 'American Hideaways')
      .replace(/[\r\n]+/g, ' ')
      .replace(/[^a-zA-Z0-9 ,.$]/g, '')
      .slice(0, 50);
    const placeholderCmd = [
      `${FFMPEG_BIN} -y`,
      `-f lavfi -i color=c=0x111116:s=1920x1080:r=30:d=${duration.toFixed(3)}`,
      `-vf drawtext=text="${safeText}":fontsize=36:fontcolor=0xA0A0AB:fontfile=C\\\\:/Windows/Fonts/arialbd.ttf:x=(w-tw)/2:y=(h-th)/2`,
      `-c:v libx264 -preset ultrafast -crf 20 -an "${outFile}"`,
    ].join(' ');
    
    try {
      execSync(placeholderCmd, { stdio: 'pipe' });
      processedClips.push(outFile);
    } catch (e) {
      console.error(`Failed to create fallback clip ${i}:`, e);
    }
    continue;
  }

  console.log(`  🎬 Processing clip ${i + 1}/${timeline.clips.length}: ${path.basename(resolvedPath)} (${duration.toFixed(1)}s) [${clip.mediaType || 'video'}]`);

  const isImage =
    clip.mediaType === 'image' ||
    /\.(jpe?g|png|webp|gif|bmp|tiff?)$/i.test(resolvedPath);

  let ffmpegCmd: string;

  if (isImage) {
    // ── IMAGE BEAT: Ken Burns zoom-in (100% → 110%) ──────────────────────
    // zoompan: z='zoom+0.0015' starts at 1.0 and ramps to ~1.1 over the duration
    // s=1920x1080 — output size; fps=30 matches our target frame rate.
    const fps = 30;
    const totalFrames = Math.ceil(duration * fps);
    const zoomStep = (0.1 / totalFrames).toFixed(6); // 0.0 → 0.1 ramp

    const filters: string[] = [
      // Convert image to video stream at 30fps, sized for 1080p
      `[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,` +
      `zoompan=z='min(zoom+${zoomStep},1.1)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${totalFrames}:s=1920x1080:fps=${fps}[kbout]`,
    ];

    // Number callout overlays on top of ken burns
    let lastLabel = '[kbout]';
    if (clip.numberOverlays && clip.numberOverlays.length > 0) {
      for (let oi = 0; oi < clip.numberOverlays.length; oi++) {
        const overlay = clip.numberOverlays[oi];
        const outLabel = `[ov${oi}]`;
        const enable = `between(t,${Math.max(0, overlay.startTime).toFixed(2)},${overlay.endTime.toFixed(2)})`;
        filters.push(
          `${lastLabel}drawbox=x=(w-tw)/2-20:y=h-180-10:w=tw+40:h=th+20:color=0xF59E0B@0.92:t=fill:enable=${enable}[bg${oi}]`
        );
        filters.push(
          `[bg${oi}]drawtext=text="${overlay.text.replace(/"/g, '')}":fontsize=72:fontcolor=0x1A1A1A` +
          `:fontfile=C\\\\:/Windows/Fonts/arialbd.ttf:x=(w-tw)/2:y=h-180:enable=${enable}${outLabel}`
        );
        lastLabel = outLabel;
      }
    }

    const finalFilter = filters.join(';');
    const mapLabel = lastLabel.replace(/[\[\]]/g, '');

    ffmpegCmd = [
      `${FFMPEG_BIN} -y`,
      `-loop 1 -framerate ${fps} -i "${resolvedPath}"`,
      `-t ${duration.toFixed(3)}`,
      `-filter_complex "${finalFilter}"`,
      `-map "[${mapLabel}]"`,
      `-r ${fps} -c:v libx264 -preset fast -crf 18`,
      `-an "${outFile}"`,
    ].join(' ');
  } else {
    // ── VIDEO BEAT: Standard scale + crop + optional number overlays ──────
    const filters: string[] = [];
    filters.push('[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[scaled]');
    let lastLabel = '[scaled]';

    // Number callout overlays
    if (clip.numberOverlays && clip.numberOverlays.length > 0) {
      for (let oi = 0; oi < clip.numberOverlays.length; oi++) {
        const overlay = clip.numberOverlays[oi];
        const outLabel = `[ov${oi}]`;
        const fontSize = 72;
        const enable = `between(t,${Math.max(0, overlay.startTime).toFixed(2)},${overlay.endTime.toFixed(2)})`;

        filters.push(
          `${lastLabel}drawbox=` +
          `x=(w-tw)/2-20:y=h-180-10:` +
          `w=tw+40:h=th+20:` +
          `color=0xF59E0B@0.92:t=fill:` +
          `enable=${enable}[bg${oi}]`
        );
        filters.push(
          `[bg${oi}]drawtext=` +
          `text="${overlay.text.replace(/"/g, '')}"` +
          `:fontsize=${fontSize}` +
          `:fontcolor=0x1A1A1A` +
          `:fontfile=C\\\\:/Windows/Fonts/arialbd.ttf` +
          `:x=(w-tw)/2` +
          `:y=h-180` +
          `:enable=${enable}${outLabel}`
        );
        lastLabel = outLabel;
      }
    }

    const finalFilter = filters.join(';');
    const mapLabel = lastLabel.replace(/[\[\]]/g, '');

    ffmpegCmd = [
      `${FFMPEG_BIN} -y`,
      `-ss 0`,
      `-i "${resolvedPath}"`,
      `-t ${duration.toFixed(3)}`,
      `-filter_complex "${finalFilter}"`,
      `-map "[${mapLabel}]"`,
      `-r 30 -c:v libx264 -preset fast -crf 18`,
      `-an "${outFile}"`,
    ].join(' ');
  }


  try {
    execSync(ffmpegCmd, { stdio: 'pipe' });
    processedClips.push(outFile);
  } catch (err: any) {
    console.error(`  ❌ Error encoding clip ${i + 1}:`, err.message || err);
  }
}

const validClips = processedClips.filter(Boolean);

if (validClips.length === 0) {
  console.error('\n❌ Render Failed: No clips could be processed.');
  process.exit(1);
}

// Step 2: Concatenate clips
const concatFile = path.join(tmpDir, 'concat.txt');
const concatLines = validClips.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n');
fs.writeFileSync(concatFile, concatLines);

const videoOnlyPath = path.join(tmpDir, 'video_only.mp4');
console.log(`\n🔗 Concatenating ${validClips.length} processed video clips...`);
execSync(
  `${FFMPEG_BIN} -y -f concat -safe 0 -i "${concatFile}" -c copy "${videoOnlyPath}"`,
  { stdio: 'pipe' }
);

// Step 3: Mix master audio narration if present
const resolvedMasterAudio = resolveClipPath(timeline.masterAudioPath);

if (resolvedMasterAudio && fs.existsSync(resolvedMasterAudio)) {
  console.log(`🎙️  Mixing narration track: ${resolvedMasterAudio}`);
  execSync(
    [
      `${FFMPEG_BIN} -y`,
      `-i "${videoOnlyPath}"`,
      `-i "${resolvedMasterAudio}"`,
      `-c:v copy -c:a aac -b:a 192k`,
      `-map 0:v:0 -map 1:a:0`,
      `-shortest "${outputPath}"`,
    ].join(' '),
    { stdio: 'pipe' }
  );
} else {
  console.log(`ℹ️  No master narration track found — outputting video stream to ${outputPath}`);
  fs.copyFileSync(videoOnlyPath, outputPath);
}

// Cleanup temporary files
try {
  fs.rmSync(tmpDir, { recursive: true, force: true });
} catch {}

console.log(`\n====================================================`);
console.log(`✅ RENDER COMPLETE!`);
console.log(`📁 Final Output: ${path.resolve(outputPath)}`);
console.log(`====================================================\n`);
