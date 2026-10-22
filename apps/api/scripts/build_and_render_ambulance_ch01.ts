import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW_DIR = path.resolve(REPO_ROOT, 'uploads/raw/proj_ambulance');
const SLICES_DIR = path.resolve(RAW_DIR, 'slices');
const SNAPSHOTS_DIR = path.resolve(REPO_ROOT, 'uploads/beat_snapshots/ambulance_ch01');
const TIMELINE_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/ambulance');
const OUTPUT_DIR = path.resolve(REPO_ROOT, 'output/ambulance_rendered');

fs.mkdirSync(SLICES_DIR, { recursive: true });
fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });
fs.mkdirSync(TIMELINE_DIR, { recursive: true });
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

function sliceClip(sourceFile: string, startSec: number, durationSec: number, outName: string): string {
  const targetPath = path.join(SLICES_DIR, outName);
  if (fs.existsSync(targetPath) && fs.statSync(targetPath).size > 50000) {
    return targetPath;
  }
  console.log(`🔪 Slicing: ${path.basename(sourceFile)} [${startSec}s - ${startSec + durationSec}s] -> ${outName}`);
  execSync(
    `ffmpeg -nostdin -y -ss ${startSec} -i "${sourceFile}" -t ${durationSec} -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p -an -movflags +faststart "${targetPath}"`,
    { stdio: 'pipe' }
  );
  return targetPath;
}

async function prepareChapter01() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 PREPARING CHAPTER 1: THE COLD OPEN (DALE / SPOKANE AMBULANCE)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // Slice required video segments
  const cheapRvSource = path.join(RAW_DIR, 'cheaprv_ambulance.mp4');
  const govdealsSource = path.join(RAW_DIR, 'govdeals_ambulance.mp4');

  const slice2 = sliceClip(cheapRvSource, 22.0, 5.0, 'ch01_beat02_ambulance_ext_side.mp4');
  const slice3 = sliceClip(cheapRvSource, 28.0, 6.0, 'ch01_beat03_ambulance_ext_rear.mp4');
  const slice4 = sliceClip(cheapRvSource, 334.0, 6.0, 'ch01_beat04_ambulance_int_cabin.mp4');
  const slice5 = sliceClip(cheapRvSource, 195.0, 6.0, 'ch01_beat05_ambulance_bed_pan.mp4');
  const slice7 = sliceClip(govdealsSource, 1.0, 7.0, 'ch01_beat07_govdeals_lot.mp4');
  const slice8 = sliceClip(govdealsSource, 12.0, 6.0, 'ch01_beat08_aluminum_box.mp4');

  // Stock paths
  const stockDir = path.join(RAW_DIR, 'stock');
  const stock0 = path.join(stockDir, 'ch01_beat00_winter_dawn.mp4');
  const stock1 = path.join(stockDir, 'ch01_beat01_ice_windshield.mp4');
  const stock6 = path.join(stockDir, 'ch01_beat06_winter_outside.mp4');
  const stock9 = path.join(stockDir, 'ch01_beat09_laptop_auction.mp4');
  const stock10 = path.join(stockDir, 'ch01_beat10_holding_keys.mp4');
  const stock11 = path.join(stockDir, 'ch01_beat11_highway_drive.mp4');
  const stock12 = path.join(stockDir, 'ch01_beat12_emergency_night.mp4');

  // Beat Timeline definition
  const beats = [
    {
      beatIndex: 0,
      startTime: 0.0,
      endTime: 5.4,
      text: 'Four in the morning, a gravel lot behind a church in Spokane, 19 degrees.',
      clipPath: stock0,
      layoutType: 'hero_graphic_centerpiece',
      callout: {
        title: '19°F • SPOKANE, WA',
        subtitle: 'CHURCH GRAVEL LOT • 04:00 AM',
      },
    },
    {
      beatIndex: 1,
      startTime: 5.4,
      endTime: 12.0,
      text: 'There is ice on the inside of every windshield in that lot. Every single one, except one.',
      clipPath: stock1,
      layoutType: 'cinematic_fullscreen',
    },
    {
      beatIndex: 2,
      startTime: 12.0,
      endTime: 16.8,
      text: 'Parked against the fence is a boxy white truck, taller than a van,',
      clipPath: slice2,
      layoutType: 'cinematic_fullscreen',
    },
    {
      beatIndex: 3,
      startTime: 16.8,
      endTime: 22.4,
      text: 'squared off at the back, and on the side panels faint rectangles where decals used to be.',
      clipPath: slice3,
      layoutType: 'cinematic_fullscreen',
    },
    {
      beatIndex: 4,
      startTime: 22.4,
      endTime: 28.14,
      text: "Inside it, a 63-year-old Army veteran we'll call Dale, is asleep on a foam mattress,",
      clipPath: slice4,
      layoutType: 'cinematic_fullscreen',
    },
    {
      beatIndex: 5,
      startTime: 28.14,
      endTime: 34.0,
      text: 'under two blankets, in a compartment sitting at 61 degrees. He paid $1,500 for the whole thing.',
      clipPath: slice5,
      layoutType: 'editorial_sidebar_column',
      callout: {
        title: 'CABIN TEMP: 61°F',
        subtitle: 'PURCHASE COST: $1,500',
      },
    },
    {
      beatIndex: 6,
      startTime: 34.0,
      endTime: 40.5,
      text: 'It is his first winter since 2019 that he has not been cold.',
      clipPath: stock6,
      layoutType: 'cinematic_fullscreen',
    },
    {
      beatIndex: 7,
      startTime: 40.5,
      endTime: 47.0,
      text: 'And this is not a one-off. A fire district outside Chicago just put a diesel ambulance up for public auction,',
      clipPath: slice7,
      layoutType: 'cinematic_fullscreen',
    },
    {
      beatIndex: 8,
      startTime: 47.0,
      endTime: 53.0,
      text: "with 116,000 miles, aluminum box, everything's still bolted in place. Opening bid, $1,650.",
      clipPath: slice8,
      layoutType: 'forensic_drafting_table',
      callout: {
        title: 'MUNICIPAL SURPLUS AUCTION',
        subtitle: 'OPENING BID: $1,650 • 116K MILES',
      },
    },
    {
      beatIndex: 9,
      startTime: 53.0,
      endTime: 60.0,
      text: 'This happens every week, in every state, on government surplus websites, anyone with a credit card can log into.',
      clipPath: stock9,
      layoutType: 'cinematic_fullscreen',
    },
    {
      beatIndex: 10,
      startTime: 60.0,
      endTime: 66.5,
      text: 'And a small number of the people bidding are not collectors. They are not film crews. They are buying a place to sleep.',
      clipPath: stock10,
      layoutType: 'cinematic_fullscreen',
    },
    {
      beatIndex: 11,
      startTime: 66.5,
      endTime: 72.5,
      text: "Today we're going through this properly.",
      clipPath: stock11,
      layoutType: 'cinematic_fullscreen',
    },
    {
      beatIndex: 12,
      startTime: 72.5,
      endTime: 79.726,
      text: 'The genius of it, the people it saved, and the parts that go terribly wrong.',
      clipPath: stock12,
      layoutType: 'cinematic_fullscreen',
    },
  ];

  // Build timeline clips
  const clips = beats.map((b) => ({
    beatIndex: b.beatIndex,
    chapterIndex: 1,
    text: b.text,
    startTime: b.startTime,
    endTime: b.endTime,
    duration: b.endTime - b.startTime,
    clipPath: b.clipPath,
    source: 'local' as const,
    volume: 0,
    kenBurns: {
      scaleStart: 1.0,
      scaleEnd: 1.05,
      panDirection: b.beatIndex % 2 === 0 ? ('zoom-in' as const) : ('pan-left' as const),
    },
    layoutConfig: {
      layoutType: b.layoutType || 'cinematic_fullscreen',
      title: b.callout?.title,
      subtitle: b.callout?.subtitle,
    },
  }));

  const timelineJson = {
    masterAudioPath: path.resolve(REPO_ROOT, 'uploads/audio/ambulance/1 -Cold.mp3').replace(/\\/g, '/'),
    totalDuration: 79.726,
    clips,
  };

  const timelineFile = path.join(TIMELINE_DIR, 'chapter_01_final.json');
  fs.writeFileSync(timelineFile, JSON.stringify(timelineJson, null, 2), 'utf-8');
  console.log(`✅ Saved Timeline: ${timelineFile} (${clips.length} beats, 79.726s)`);

  // Extract Midpoint Beat Snapshots (beat_01.jpg .. beat_13.jpg)
  console.log('\n📸 Extracting 50% midpoint snapshots for visual inspection...');
  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i]!;
    const beatNumStr = String(i + 1).padStart(2, '0');
    const snapshotPath = path.join(SNAPSHOTS_DIR, `beat_${beatNumStr}.jpg`);
    const midpointSec = Math.max(0.5, (clip.duration / 2));
    
    try {
      execSync(
        `ffmpeg -nostdin -y -ss ${midpointSec.toFixed(2)} -i "${clip.clipPath}" -vframes 1 -q:v 2 "${snapshotPath}"`,
        { stdio: 'pipe' }
      );
      console.log(`  📸 Beat ${beatNumStr} Snapshot -> beat_${beatNumStr}.jpg`);
    } catch (e: any) {
      console.warn(`  ⚠️ Failed snapshot for beat ${beatNumStr}:`, e.message);
    }
  }

  console.log('\n🎉 Chapter 1 timeline & snapshots ready for inspection!');
}

prepareChapter01().catch(console.error);
