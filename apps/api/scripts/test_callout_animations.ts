import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';
import { buildCalloutFilters, CalloutInput } from '../src/services/videoRenderer';

const FFMPEG_BIN = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';

async function runTest() {
  console.log('🧪 Testing 8 Animated Documentary Overlay Styles with FFmpeg...');

  const outDir = path.resolve(process.cwd(), 'output', 'test_callouts');
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, 'all_8_styles_test.mp4');

  const testCases: Array<{ style: CalloutInput['type']; callout: CalloutInput; title: string }> = [
    {
      style: 'stat_callout',
      callout: {
        type: 'stat_callout',
        line1: '$35,000 BAIL',
        line2: 'KING COUNTY SUPERIOR COURT',
        themeColor: 'gold',
        startTime: 0.2,
        endTime: 2.3,
      },
      title: '1. Stat Callout (Gold)',
    },
    {
      style: 'lower_third',
      callout: {
        type: 'lower_third',
        line1: 'Steven Irwin',
        line2: 'Cabin Builder & Suspect',
        themeColor: 'cyan',
        startTime: 0.2,
        endTime: 2.3,
      },
      title: '2. Lower Third (Cyan)',
    },
    {
      style: 'location_badge',
      callout: {
        type: 'location_badge',
        line1: 'SEATTLE, WA • BEACON HILL',
        line2: 'DR. JOSÉ RIZAL PARK',
        themeColor: 'amber',
        startTime: 0.2,
        endTime: 2.3,
      },
      title: '3. Location Badge (Amber)',
    },
    {
      style: 'evidence_tag',
      callout: {
        type: 'evidence_tag',
        line1: '2ND-DEGREE IDENTITY THEFT',
        line2: 'OFFICIAL CRIMINAL CHARGE',
        themeColor: 'crimson',
        startTime: 0.2,
        endTime: 2.3,
      },
      title: '4. Evidence Tag (Crimson Alert)',
    },
    {
      style: 'quote_card',
      callout: {
        type: 'quote_card',
        line1: 'We could not believe what he had built into the hillside.',
        line2: 'OFFICER SUAREZ • POLICE REPORT',
        themeColor: 'gold',
        startTime: 0.2,
        endTime: 2.3,
      },
      title: '5. Quote Card (Frosted Glass)',
    },
    {
      style: 'chapter_header',
      callout: {
        type: 'chapter_header',
        line1: 'ACT 2: THE RAID',
        line2: 'OCTOBER 2024 ENCLAVE CLEARANCE',
        themeColor: 'gold',
        startTime: 0.2,
        endTime: 2.3,
      },
      title: '6. Chapter Header (Cinematic Center Banner)',
    },
    {
      style: 'highlight_pill',
      callout: {
        type: 'highlight_pill',
        line1: 'CAUGHT ON CAMERA',
        themeColor: 'cyan',
        startTime: 0.2,
        endTime: 2.3,
      },
      title: '7. Highlight Pill (Neon Cyan)',
    },
    {
      style: 'split_title',
      callout: {
        type: 'split_title',
        line1: 'OCTOBER 2024',
        line2: '4TH ARREST',
        themeColor: 'crimson',
        startTime: 0.2,
        endTime: 2.3,
      },
      title: '8. Split Title (Two-Tone Milestone)',
    },
  ];

  const clipFiles: string[] = [];
  const duration = 2.5;
  const fps = 30;

  for (let i = 0; i < testCases.length; i++) {
    const { callout, title } = testCases[i]!;
    console.log(`  ▶ Rendering [${i + 1}/${testCases.length}] ${title}...`);
    const clipOut = path.join(outDir, `style_${i + 1}_${callout.type}.mp4`);
    clipFiles.push(clipOut);

    const { filters, outputLabel } = buildCalloutFilters(callout, '[0:v]', duration);
    const filterStr = filters.join(';');
    const mapLabel = outputLabel.replace(/[\[\]]/g, '');

    const cmd = [
      `${FFMPEG_BIN} -y`,
      `-f lavfi -i color=c=0x18181b:s=1920x1080:r=${fps}`,
      `-t ${duration.toFixed(2)}`,
      `-filter_complex "${filterStr}"`,
      `-map "[${mapLabel}]"`,
      `-c:v libx264 -preset ultrafast -pix_fmt yuv420p -an "${clipOut}"`,
    ].join(' ');

    execSync(cmd, { stdio: 'pipe' });
  }

  // Concatenate all 8 clips into one showcase video
  const concatList = path.join(outDir, 'concat_test.txt');
  fs.writeFileSync(concatList, clipFiles.map((f) => `file '${f.replace(/\\/g, '/')}'`).join('\n'));

  const concatCmd = `${FFMPEG_BIN} -y -f concat -safe 0 -i "${concatList}" -c copy "${outFile}"`;
  execSync(concatCmd, { stdio: 'pipe' });

  console.log(`\n✅ ALL 8 OVERLAY STYLES TEST PASSED!`);
  console.log(`📁 Test video saved to: ${outFile}`);
}

runTest().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
