import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import ffmpegStatic from 'ffmpeg-static';

const FFMPEG = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';
const photo = path.resolve('output/cold_2026-08-23_03-09-35_fb9a2a/stock/photo_0.jpg');
const boldFont = 'C\\:/Windows/Fonts/arialbd.ttf';
const regularFont = 'C\\:/Windows/Fonts/arial.ttf';

function escapeDrawtext(text: string): string {
  return text.replace(/'/g, '').replace(/:/g, ' ').replace(/"/g, '').replace(/\\/g, '').replace(/\[/g, '').replace(/\]/g, '').trim();
}

function buildLowerThird(line1: string, line2: string, inputLabel: string, clipDuration: number, tag: string) {
  const holdEnd = Math.max(0.3, Math.min(clipDuration - 0.15, 2.5)).toFixed(2);
  const enableExpr = `between(t,0.05,${holdEnd})`;
  const l1 = escapeDrawtext(line1);
  const l2 = escapeDrawtext(line2);
  const filters: string[] = [];

  // Style 1: Floating Clean Typographic (Vertical gold bar + crisp bordered text with shadow)
  const barH = l2 ? 86 : 52;
  const lbl0 = `[${tag}_bar]`;
  filters.push(`${inputLabel}drawbox=x=80:y=860:w=6:h=${barH}:color=0xF5C518FF:t=fill:enable='${enableExpr}'${lbl0}`);

  const lbl1 = `[${tag}_l1]`;
  filters.push(`${lbl0}drawtext=text='${l1}':fontfile='${boldFont}':fontsize=46:fontcolor=white:borderw=3:bordercolor=black:shadowx=2:shadowy=2:shadowcolor=black@0.9:x=102:y=864:enable='${enableExpr}'${lbl1}`);

  if (l2) {
    const lbl2 = `[${tag}_l2]`;
    filters.push(`${lbl1}drawtext=text='${l2}':fontfile='${regularFont}':fontsize=26:fontcolor=0xD4D4D8FF:borderw=2:bordercolor=black:shadowx=2:shadowy=2:shadowcolor=black@0.9:x=102:y=918:enable='${enableExpr}'${lbl2}`);
    return { filters, outputLabel: lbl2 };
  }

  return { filters, outputLabel: lbl1 };
}

function buildCenterTitle(line1: string, inputLabel: string, clipDuration: number, tag: string) {
  const holdEnd = Math.max(0.3, Math.min(clipDuration - 0.15, 2.0)).toFixed(2);
  const enableExpr = `between(t,0.05,${holdEnd})`;
  const l1 = escapeDrawtext(line1);
  const filters: string[] = [];

  // Big Bold 78pt White Text + Heavy Black Border & Shadow (Zero glitch, pure impact)
  const lbl0 = `[${tag}_ct]`;
  filters.push(`${inputLabel}drawtext=text='${l1}':fontfile='${boldFont}':fontsize=78:fontcolor=white:borderw=5:bordercolor=black:shadowx=4:shadowy=4:shadowcolor=black@0.95:x=(w-tw)/2:y=(h-th)/2:enable='${enableExpr}'${lbl0}`);

  return { filters, outputLabel: lbl0 };
}

const tests = [
  { name: 'Lower Third (Steve)', outFile: 'output/test_overlay_lower_third_new.mp4', isLT: true, line1: 'Steve', line2: 'Repeat Offender' },
  { name: 'Center Title (April 2024)', outFile: 'output/test_overlay_center_date_new.mp4', isLT: false, line1: 'April 2024' },
  { name: 'Center Title ($35,000 Bail)', outFile: 'output/test_overlay_center_stat_new.mp4', isLT: false, line1: '$35,000 Bail' },
];

const fps = 30;
const duration = 3.0;
const totalFrames = Math.ceil(duration * fps);

for (const test of tests) {
  const outFile = path.resolve(test.outFile);
  const zoompan = `zoompan=z='1.0+0.12*(on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps=${fps}`;
  const baseFilter = `[0:v]scale=3500:1968:force_original_aspect_ratio=increase,crop=3500:1968,${zoompan},eq=contrast=1.07:brightness=-0.01:saturation=1.08,noise=c0s=6:allf=t+u[base]`;

  let { filters, outputLabel } = test.isLT
    ? buildLowerThird(test.line1, test.line2 || '', '[base]', duration, 'co_test')
    : buildCenterTitle(test.line1, '[base]', duration, 'co_test');

  const allFilters = [baseFilter, ...filters].join(';');
  const mapLabel = outputLabel.replace(/[\[\]]/g, '');

  const cmd = `${FFMPEG} -y -loop 1 -i "${photo}" -t ${duration} -filter_complex "${allFilters}" -map "[${mapLabel}]" -r ${fps} -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p -an "${outFile}"`;
  execSync(cmd, { stdio: 'inherit' });
  console.log(`Rendered: ${outFile}`);
}

console.log('✅ Visual redesign test complete!');
