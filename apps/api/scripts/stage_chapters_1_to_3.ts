import fs from 'fs';
import path from 'path';
import type { Timeline, TimelineClip, SceneLayoutType, CalloutOverlay, SceneLayoutData, TransitionType } from '@repo/shared';
import {
  PROJECT_ID,
  REPO_ROOT,
  TRANSCRIPTS_DIR,
  RAW_DIR,
  SFX,
  BANNED_PREFIXES,
  getLockedAssets,
  lockAsset,
  downloadStockVideoReliable,
  saveTimelineAndSyncStore,
} from './director_engine';

interface AlignmentSegment {
  text: string;
  start: number;
  end: number;
}

interface Beat {
  start: number;
  end: number;
  text: string;
}

function groupSegmentsIntoBeats(segments: AlignmentSegment[]): Beat[] {
  const beats: Beat[] = [];
  let curBeat: Beat = { start: 0, end: 0, text: '' };

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    if (!curBeat.text) {
      curBeat.start = seg.start;
      curBeat.end = seg.end;
      curBeat.text = seg.text.trim();
    } else {
      const potentialDuration = seg.end - curBeat.start;
      if (potentialDuration <= 5.8) {
        curBeat.end = seg.end;
        curBeat.text += ' ' + seg.text.trim();
      } else {
        beats.push({ ...curBeat });
        curBeat = { start: seg.start, end: seg.end, text: seg.text.trim() };
      }
    }
  }
  if (curBeat.text) beats.push({ ...curBeat });
  return beats;
}

// Visual blueprints for Chapters 1, 2, 3
async function resolveClipForBeat(
  chNum: number,
  bIdx: number,
  beatText: string,
  usedClips: Set<string>
): Promise<string> {
  const t = beatText.toLowerCase();

  // === CHAPTER 1 ===
  if (chNum === 1) {
    if (bIdx === 0) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch01_b1_stock.mp4');
    if (bIdx === 1) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_018.mp4');
    if (bIdx === 2) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_003.mp4');
    if (bIdx === 3) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch01_b04_california_highway_traffic.mp4');
    if (bIdx === 4) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch01_b05_filming_smartphone.mp4');
    if (bIdx === 5) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_016.mp4');
    if (bIdx === 6) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch01_b07_toy_cars.mp4');
    if (bIdx === 7) {
      const s = await downloadStockVideoReliable('stone rock garden landscaping border', 'ch01_b08_stone_garden');
      if (s) return s;
    }
    if (bIdx === 8) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_024.mp4');
    if (bIdx === 9) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_001.mp4');
    if (bIdx === 10) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch01_b11_pexels_19950644.mp4');
    if (bIdx === 11) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_004.mp4');
    if (bIdx === 12) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_019.mp4');
    if (bIdx === 13) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_026.mp4');
    if (bIdx === 14) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_020.mp4');
    if (bIdx === 15) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_021.mp4');
    if (bIdx === 16) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch01_b17_pexels_30527657.mp4');
  }

  // === CHAPTER 2 ===
  if (chNum === 2) {
    if (bIdx === 0) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b02_pexels_38463951.mp4');
    if (bIdx === 1) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b04_pexels_4957773.mp4');
    if (bIdx === 2) return path.resolve(RAW_DIR, 'pacoima_street_homelessness_tr_clip_001.mp4');
    if (bIdx === 3) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b06_pexels_33667562.mp4');
    if (bIdx === 4) return path.resolve(RAW_DIR, 'pacoima_street_homelessness_tr_clip_002.mp4');
    if (bIdx === 5) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b07_pexels_7655280.mp4');
    if (bIdx === 6) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b10_pexels_7655271.mp4');
    if (bIdx === 7) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_017.mp4');
    if (bIdx === 8) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_022.mp4');
    if (bIdx === 9) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b13_pexels_35323766.mp4');
    if (bIdx === 10) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_023.mp4');
    if (bIdx === 11) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b16_pexels_7655580.mp4');
    if (bIdx === 12) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b17_pexels_26510198.mp4');
    if (bIdx === 13) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_025.mp4');
    if (bIdx === 14) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b19_pexels_7655279.mp4');
    if (bIdx === 15) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b21_pexels_7655268.mp4');
    if (bIdx === 16) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch02_b22_pexels_11988771.mp4');
    if (bIdx === 17) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_001.mp4');
    if (bIdx === 18) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_002.mp4');
    if (bIdx === 19) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_003.mp4');
    if (bIdx === 20) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_004.mp4');
    if (bIdx === 21) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_005.mp4');
    if (bIdx === 22) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_006.mp4');
  }

  // === CHAPTER 3 ===
  if (chNum === 3) {
    if (bIdx === 0) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch03_b03_pexels_30670725.mp4');
    if (bIdx === 1) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch03_b06_pexels_18533883.mp4');
    if (bIdx === 2) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch03_b07_pexels_13172840.mp4');
    if (bIdx === 3) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_007.mp4');
    if (bIdx === 4) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch03_b09_pexels_36922676.mp4');
    if (bIdx === 5) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch03_b10_pexels_5895472.mp4');
    if (bIdx === 6) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch03_b12_pexels_27876376.mp4');
    if (bIdx === 7) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch03_b13_pexels_8427990.mp4');
    if (bIdx === 8) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch03_b14_pixabay_203365.mp4');
    if (bIdx === 9) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_008.mp4');
    if (bIdx === 10) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_009.mp4');
    if (bIdx === 11) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_010.mp4');
    if (bIdx === 12) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_011.mp4');
    if (bIdx === 13) return path.resolve(RAW_DIR, 'could_homeless_encampments_und_clip_012.mp4');
  }

  // Stock fallback
  const stock = await downloadStockVideoReliable(`los angeles ${t.slice(0, 20)}`, `ch${chNum}_b${bIdx + 1}`);
  if (stock) return stock;

  throw new Error(`Could not resolve clip for Ch ${chNum} Beat ${bIdx + 1}`);
}

async function run() {
  console.log('🚀 STAGING CHAPTERS 1, 2, 3...');
  const configs = [
    {
      ch: 1,
      title: 'Cold Open',
      json: '01_1 - COLD.json',
      audio: '1 - COLD.mp3',
      themeColor: 'gold' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'GLENOAKS BLVD & SR-118', line2: 'PACOIMA, LOS ANGELES • 6:45 AM' },
      midCallout: { type: 'location_badge' as const, line1: 'THE HILLSIDE ESTATE', line2: 'JOSE FUENTES • BUILT BY HAND' },
    },
    {
      ch: 2,
      title: 'The Gardener With No Garden',
      json: '02_2 - THE GARDENER WITH NO GARDEN.json',
      audio: '2 - THE GARDENER WITH NO GARDEN.mp3',
      themeColor: 'emerald' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'JOSE FUENTES', line2: 'PROFESSIONAL LANDSCAPER • COLIMA, MEXICO' },
      midCallout: { type: 'odometer_stat' as const, line1: 'HUNDREDS OF HOURS', line2: 'NO BLUEPRINT • NO BUDGET' },
    },
    {
      ch: 3,
      title: 'Who Ages Out Onto A Hillside',
      json: '03_3 - WHO AGES OUT ONTO A HILLSIDE.json',
      audio: '3 - WHO AGES OUT ONTO A HILLSIDE.mp3',
      themeColor: 'amber' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'LOS ANGELES COUNTY', line2: 'AGING TRADESMEN WITHOUT A SAFETY NET' },
      midCallout: { type: 'odometer_stat' as const, line1: '50s, 60s & BEYOND', line2: 'THE SLOW MATH OF RISING RENT' },
    },
  ];

  // Pre-collect planned clips for chapters 1-3 to allow idempotent staging without self-collision
  const plannedCh1to3Clips = new Set<string>();
  for (const cfg of configs) {
    const jsonPath = path.join(TRANSCRIPTS_DIR, cfg.json);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const beats = groupSegmentsIntoBeats(data.segments || []);
    for (let bIdx = 0; bIdx < beats.length; bIdx++) {
      const clipPath = await resolveClipForBeat(cfg.ch, bIdx, beats[bIdx]!.text, new Set());
      plannedCh1to3Clips.add(path.basename(clipPath));
    }
  }

  const locked = getLockedAssets();
  for (const clip of plannedCh1to3Clips) {
    locked.delete(clip);
  }

  for (const cfg of configs) {
    const jsonPath = path.join(TRANSCRIPTS_DIR, cfg.json);
    const audioPath = path.resolve(REPO_ROOT, 'uploads/audio', cfg.audio);
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const beats = groupSegmentsIntoBeats(data.segments || []);
    const totalDuration = beats[beats.length - 1]?.end || 60;

    console.log(`\n🎬 Chapter ${cfg.ch}: "${cfg.title}" (${beats.length} beats)`);
    const clips: TimelineClip[] = [];

    for (let bIdx = 0; bIdx < beats.length; bIdx++) {
      const beat = beats[bIdx]!;
      const clipDuration = Number((beat.end - beat.start).toFixed(2));
      const clipPath = await resolveClipForBeat(cfg.ch, bIdx, beat.text, locked);
      const filename = path.basename(clipPath);

      if (BANNED_PREFIXES.some((p) => filename.startsWith(p))) {
        throw new Error(`ILLEGAL BANNED CLIP DETECTED: ${filename}`);
      }
      if (locked.has(filename)) {
        throw new Error(`DUPLICATE CLIP DETECTED: ${filename}`);
      }

      locked.add(filename);
      lockAsset(filename);

      let callout: CalloutOverlay | null = null;
      if (bIdx === 0) {
        callout = {
          type: cfg.introCallout.type,
          line1: cfg.introCallout.line1,
          line2: cfg.introCallout.line2,
          startTime: 0.3,
          endTime: Math.min(3.6, clipDuration - 0.2),
          themeColor: cfg.themeColor,
        };
      } else if (bIdx === Math.floor(beats.length / 2)) {
        callout = {
          type: cfg.midCallout.type,
          line1: cfg.midCallout.line1,
          line2: cfg.midCallout.line2,
          startTime: 0.4,
          endTime: Math.min(3.4, clipDuration - 0.2),
          themeColor: cfg.themeColor,
        };
      }

      let layout: SceneLayoutType = 'full_bleed_cinematic';
      let layoutData: SceneLayoutData | undefined = undefined;
      if (bIdx === 0) {
        layout = 'ambient_blur_frame';
        layoutData = { title: 'AMERICAN HIDEAWAYS', subtitle: cfg.title.toUpperCase(), tag: 'PACOIMA, CA' };
      } else if (bIdx % 6 === 0) {
        layout = 'hero_graphic_centerpiece';
        layoutData = { title: 'THE HILLSIDE ESTATE', subtitle: 'DOCUMENTARY ARCHIVE' };
      }

      const transitions: TransitionType[] = ['crossfade', 'film_burn', 'luma_fade', 'blur_dissolve'];
      clips.push({
        id: `ch0${cfg.ch}_beat_${bIdx + 1}`,
        mediaType: 'video',
        clipPath: clipPath.replace(/\\/g, '/'),
        startTime: beat.start,
        endTime: beat.end,
        duration: clipDuration,
        text: beat.text,
        layout,
        layoutData,
        callout,
        overlay: 'micro_film_grain',
        transition: transitions[bIdx % transitions.length]!,
        transitionDuration: 0.4,
        sfxPath: bIdx === 0 ? SFX.whoosh_cinematic : (bIdx % 4 === 0 ? SFX.subtle_hit : undefined),
        sfxVolume: 0.35,
      });

      console.log(`  B${String(bIdx + 1).padStart(2, '0')}: ${filename} (${clipDuration}s)`);
    }

    const timeline: Timeline = {
      projectId: PROJECT_ID,
      totalDuration,
      masterAudioPath: audioPath.replace(/\\/g, '/'),
      audioDuration: totalDuration,
      fps: 30,
      width: 1920,
      height: 1080,
      clips,
    };

    saveTimelineAndSyncStore(cfg.ch, timeline);
  }

  console.log(`✅ CHAPTERS 1, 2, 3 STAGED FLAWLESSLY!`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
