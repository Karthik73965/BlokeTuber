/**
 * Cross-check render: Takes the existing timeline, injects test callouts
 * into a few clips, renders a short 3-clip splice, and outputs a verification video.
 */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

const FFMPEG = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';
const timelineFile = path.resolve('output/cold_2026-08-23_03-09-35_fb9a2a/timeline.json');
const outDir = path.resolve('output/crosscheck_callout');
fs.mkdirSync(outDir, { recursive: true });

const timeline = JSON.parse(fs.readFileSync(timelineFile, 'utf-8'));
const timelineDir = path.dirname(timelineFile);
const fps = 30;

// Inject test callouts into first 4 clips
const testClips = [
  { ...timeline.clips[0], callout: { type: 'lower_third', line1: 'Steve', line2: 'Repeat Offender' } },
  { ...timeline.clips[1], callout: { type: 'center_title', line1: 'April 2024' } },
  { ...timeline.clips[2], callout: { type: 'center_title', line1: '$35,000 Bail' } },
  { ...timeline.clips[3], callout: { type: 'lower_third', line1: 'Suarez', line2: 'Officer on Scene' } },
];

function resolveClipPath(rawPath: string | null): string | null {
  if (!rawPath) return null;
  if (fs.existsSync(rawPath)) return rawPath;
  const rel = path.resolve(timelineDir, rawPath);
  if (fs.existsSync(rel)) return rel;
  return null;
}

function escapeDrawtext(text: string): string {
  return text.replace(/'/g, '').replace(/:/g, ' ').replace(/"/g, '').replace(/\\/g, '').replace(/\[/g, '').replace(/\]/g, '').trim();
}

function buildCalloutFilters(
  callout: any, inputLabel: string, clipDuration: number, tag: string
): { filters: string[]; outputLabel: string } {
  if (!callout?.line1) return { filters: [], outputLabel: inputLabel };

  const boldFont = 'C\\:/Windows/Fonts/arialbd.ttf';
  const regularFont = 'C\\:/Windows/Fonts/arial.ttf';
  const filters: string[] = [];
  const holdEnd = Math.max(0.3, Math.min(clipDuration - 0.15, 2.5));
  const l1 = escapeDrawtext(callout.line1);

  if (callout.type === 'lower_third') {
    const l2 = escapeDrawtext(callout.line2 || '');
    filters.push(`${inputLabel}drawbox=x=60:y=820:w=520:h=110:color=0x0A0A0FCC:t=fill:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_box]`);
    filters.push(`[${tag}_box]drawbox=x=60:y=820:w=6:h=110:color=0xF5C518FF:t=fill:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_bar]`);
    filters.push(`[${tag}_bar]drawtext=text='${l1}':fontfile='${boldFont}':fontsize=42:fontcolor=white:x=78:y=834:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_l1]`);
    if (l2) {
      filters.push(`[${tag}_l1]drawtext=text='${l2}':fontfile='${regularFont}':fontsize=26:fontcolor=0xCCCCCCFF:x=78:y=888:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_out]`);
      return { filters, outputLabel: `[${tag}_out]` };
    }
    return { filters, outputLabel: `[${tag}_l1]` };
  } else {
    const holdEndC = Math.max(0.3, Math.min(clipDuration - 0.15, 2.0));
    filters.push(`${inputLabel}drawbox=x='(w-560)/2':y='(h/2)-40':w=560:h=80:color=0x0A0A0FCC:t=fill:enable='between(t,0.05,${holdEndC.toFixed(2)})'[${tag}_cbox]`);
    filters.push(`[${tag}_cbox]drawbox=x='(w-560)/2':y='(h/2)+36':w=560:h=5:color=0xF5C518FF:t=fill:enable='between(t,0.05,${holdEndC.toFixed(2)})'[${tag}_cbar]`);
    filters.push(`[${tag}_cbar]drawtext=text='${l1}':fontfile='${boldFont}':fontsize=52:fontcolor=white:x=(w-tw)/2:y=(h-th)/2:enable='between(t,0.05,${holdEndC.toFixed(2)})'[${tag}_out]`);
    return { filters, outputLabel: `[${tag}_out]` };
  }
}

const processedClips: string[] = [];

for (let i = 0; i < testClips.length; i++) {
  const clip = testClips[i] as any;
  const duration = Math.max(0.5, clip.endTime - clip.startTime);
  const outFile = path.join(outDir, `clip_${String(i).padStart(2, '0')}.mp4`);
  const resolvedPath = resolveClipPath(clip.clipPath);
  const isImage = clip.mediaType === 'image' || !resolvedPath || /\.(jpg|jpeg|png|webp)$/i.test(resolvedPath || '');
  const totalFrames = Math.max(15, Math.ceil(duration * fps));
  const tag = `co_${i}`;

  console.log(`\n[${i + 1}/${testClips.length}] ${isImage ? '📷' : '📹'} "${clip.text.slice(0, 40)}" (${duration.toFixed(1)}s)`);
  console.log(`  callout: ${JSON.stringify(clip.callout)}`);

  const colorGrade = `eq=contrast=1.07:brightness=-0.01:saturation=1.08`;
  const filmGrain = `noise=c0s=6:allf=t+u`;
  const vignette = `vignette=PI/5`;

  let baseFilter: string;
  let filters: string[] = [];
  let lastLabel: string;

  if (isImage) {
    const zExpr = i % 2 === 0 ? `1.0+0.15*(on/${totalFrames})` : `1.15-0.15*(on/${totalFrames})`;
    const zoompan = `zoompan=z='${zExpr}':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps=${fps}`;
    baseFilter = `[0:v]scale=3500:1968:force_original_aspect_ratio=increase,crop=3500:1968,${zoompan},${colorGrade},${filmGrain},${vignette}[base]`;
    filters = [baseFilter];
    lastLabel = '[base]';
  } else {
    baseFilter = `[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,${colorGrade},${filmGrain},${vignette}[graded]`;
    filters = [baseFilter];
    lastLabel = '[graded]';
  }

  const { filters: calloutFilters, outputLabel } = buildCalloutFilters(clip.callout, lastLabel, duration, tag);
  filters.push(...calloutFilters);
  lastLabel = outputLabel;

  const finalFilter = filters.join(';');
  const mapLabel = lastLabel.replace(/[\[\]]/g, '');
  const inputSpec = isImage
    ? `-loop 1 -i "${resolvedPath || ''}"`
    : `-i "${resolvedPath}"`;

  const cmd = [
    `${FFMPEG} -y`,
    inputSpec,
    `-t ${duration.toFixed(3)}`,
    `-filter_complex "${finalFilter}"`,
    `-map "[${mapLabel}]"`,
    `-r ${fps} -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p -an`,
    `"${outFile}"`
  ].join(' ');

  try {
    execSync(cmd, { stdio: 'pipe' });
    processedClips.push(outFile);
    console.log(`  ✅ OK → ${path.basename(outFile)}`);
  } catch (err: any) {
    console.error(`  ❌ FAIL: ${err.message?.slice(0, 200)}`);
  }
}

// Concatenate all 4 clips into one preview video
if (processedClips.length > 0) {
  const concatList = path.join(outDir, 'concat.txt');
  fs.writeFileSync(concatList, processedClips.map(p => `file '${p.replace(/\\/g, '/')}'`).join('\n'));
  const previewOut = path.resolve('output/crosscheck_callout_PREVIEW.mp4');
  execSync(`${FFMPEG} -y -f concat -safe 0 -i "${concatList}" -c copy "${previewOut}"`, { stdio: 'pipe' });
  console.log(`\n🎬 PREVIEW VIDEO: ${previewOut}`);
}

console.log('\n✅ Cross-check render complete!');
