/**
 * Quick visual test for text callout overlays.
 * Renders 3 test clips:
 *   1. lower_third — "Steve" + "Repeat Offender"
 *   2. center_title — "April 2024"
 *   3. center_title — "$35,000 Bail"
 */
import { execSync } from 'child_process';
import path from 'path';
import ffmpegStatic from 'ffmpeg-static';

const FFMPEG = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';
const photo = path.resolve('output/cold_2026-08-23_03-09-35_fb9a2a/stock/photo_0.jpg');
const boldFont = 'C\\:/Windows/Fonts/arialbd.ttf';
const regularFont = 'C\\:/Windows/Fonts/arial.ttf';

function escapeDrawtext(text: string): string {
  return text.replace(/'/g, '').replace(/:/g, ' ').replace(/"/g, '').replace(/\\/g, '').replace(/\[/g, '').replace(/\]/g, '').trim();
}

function buildLowerThird(line1: string, line2: string, inputLabel: string, clipDuration: number, tag: string) {
  const holdEnd = Math.max(0.3, Math.min(clipDuration - 0.15, 2.5));
  const l1 = escapeDrawtext(line1);
  const l2 = escapeDrawtext(line2);
  const filters: string[] = [];

  filters.push(`${inputLabel}drawbox=x=60:y=820:w=520:h=110:color=0x0A0A0FCC:t=fill:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_box]`);
  filters.push(`[${tag}_box]drawbox=x=60:y=820:w=6:h=110:color=0xF5C518FF:t=fill:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_bar]`);
  filters.push(`[${tag}_bar]drawtext=text='${l1}':fontfile='${boldFont}':fontsize=42:fontcolor=white:x=78:y=834:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_l1]`);
  filters.push(`[${tag}_l1]drawtext=text='${l2}':fontfile='${regularFont}':fontsize=26:fontcolor=0xCCCCCCFF:x=78:y=888:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_out]`);

  return { filters, outputLabel: `[${tag}_out]` };
}

function buildCenterTitle(line1: string, inputLabel: string, clipDuration: number, tag: string) {
  const holdEnd = Math.max(0.3, Math.min(clipDuration - 0.15, 2.0));
  const l1 = escapeDrawtext(line1);
  const filters: string[] = [];

  filters.push(`${inputLabel}drawbox=x='(w-560)/2':y='(h/2)-40':w=560:h=80:color=0x0A0A0FCC:t=fill:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_cbox]`);
  filters.push(`[${tag}_cbox]drawbox=x='(w-560)/2':y='(h/2)+36':w=560:h=5:color=0xF5C518FF:t=fill:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_cbar]`);
  filters.push(`[${tag}_cbar]drawtext=text='${l1}':fontfile='${boldFont}':fontsize=52:fontcolor=white:x=(w-tw)/2:y=(h-th)/2:enable='between(t,0.05,${holdEnd.toFixed(2)})'[${tag}_out]`);

  return { filters, outputLabel: `[${tag}_out]` };
}

type TestCase = {
  name: string;
  outFile: string;
  type: 'lower_third' | 'center_title';
  line1: string;
  line2?: string;
};

const tests: TestCase[] = [
  { name: 'Lower Third (Person)', outFile: 'output/test_overlay_lower_third.mp4', type: 'lower_third', line1: 'Steve', line2: 'Repeat Offender' },
  { name: 'Center Title (Date)', outFile: 'output/test_overlay_center_date.mp4', type: 'center_title', line1: 'April 2024' },
  { name: 'Center Title (Stat)', outFile: 'output/test_overlay_center_stat.mp4', type: 'center_title', line1: '$35,000 Bail' },
];

const fps = 30;
const duration = 3.0;
const totalFrames = Math.ceil(duration * fps);

for (const test of tests) {
  console.log(`\n🎬 Testing: ${test.name}...`);
  const outFile = path.resolve(test.outFile);

  const zoompan = `zoompan=z='1.0+0.12*(on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=1:s=1920x1080:fps=${fps}`;
  const colorGrade = `eq=contrast=1.07:brightness=-0.01:saturation=1.08`;
  const filmGrain = `noise=c0s=6:allf=t+u`;

  const baseFilter = `[0:v]scale=3500:1968:force_original_aspect_ratio=increase,crop=3500:1968,${zoompan},${colorGrade},${filmGrain}[base]`;

  let { filters, outputLabel } = test.type === 'lower_third'
    ? buildLowerThird(test.line1, test.line2 || '', '[base]', duration, 'co_test')
    : buildCenterTitle(test.line1, '[base]', duration, 'co_test');

  const allFilters = [baseFilter, ...filters].join(';');
  const mapLabel = outputLabel.replace(/[\[\]]/g, '');

  const cmd = [
    `${FFMPEG} -y`,
    `-loop 1 -i "${photo}"`,
    `-t ${duration}`,
    `-filter_complex "${allFilters}"`,
    `-map "[${mapLabel}]"`,
    `-r ${fps} -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p`,
    `-an "${outFile}"`,
  ].join(' ');

  execSync(cmd, { stdio: 'inherit' });
  console.log(`  ✅ ${test.name} rendered → ${outFile}`);
}

console.log('\n✅ All callout overlay tests passed!');
