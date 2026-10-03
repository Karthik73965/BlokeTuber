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

async function resolveClipForBeat(
  chNum: number,
  bIdx: number,
  beatText: string,
  usedClips: Set<string>
): Promise<string> {
  const t = beatText.toLowerCase();

  // === CHAPTER 9 (15 beats) ===
  if (chNum === 9) {
    if (bIdx === 0) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_022.mp4');
    if (bIdx === 1) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_023.mp4');
    if (bIdx === 2) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b03_pexels_35957789.mp4');
    if (bIdx === 3) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b04_pexels_35957867.mp4');
    if (bIdx === 4) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b05_pexels_4118710.mp4');
    if (bIdx === 5) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b06_pexels_39266969.mp4');
    if (bIdx === 6) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_024.mp4');
    if (bIdx === 7) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_025.mp4');
    if (bIdx === 8) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b09_pexels_5950042.mp4');
    if (bIdx === 9) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b10_pexels_39598179.mp4');
    if (bIdx === 10) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b11_pexels_34900069.mp4');
    if (bIdx === 11) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b12_pexels_39475708.mp4');
    if (bIdx === 12) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_032.mp4');
    if (bIdx === 13) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b14_pexels_36473276.mp4');
    if (bIdx === 14) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch09_b15_pixabay_86350.mp4');
  }

  // === CHAPTER 10 (14 beats) ===
  if (chNum === 10) {
    if (bIdx === 0) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b01_pexels_30214341.mp4');
    if (bIdx === 1) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b02_pexels_37683679.mp4');
    if (bIdx === 2) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b03_pexels_39640430.mp4');
    if (bIdx === 3) return path.resolve(RAW_DIR, 'crews_clean_up_homeless_encamp_clip_001.mp4');
    if (bIdx === 4) return path.resolve(RAW_DIR, 'crews_clean_up_homeless_encamp_clip_002.mp4');
    if (bIdx === 5) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b06_pexels_3768238.mp4');
    if (bIdx === 6) return path.resolve(RAW_DIR, 'crews_clean_up_homeless_encamp_clip_003.mp4');
    if (bIdx === 7) return path.resolve(RAW_DIR, 'crews_clean_up_homeless_encamp_clip_004.mp4');
    if (bIdx === 8) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b09_pexels_6581271.mp4');
    if (bIdx === 9) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b10_pexels_30226813.mp4');
    if (bIdx === 10) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b11_pexels_30226843.mp4');
    if (bIdx === 11) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b12_pexels_37627894.mp4');
    if (bIdx === 12) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b13_pexels_39324110.mp4');
    if (bIdx === 13) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch10_b14_pexels_34209371.mp4');
  }

  // === CHAPTER 11 (27 beats) ===
  if (chNum === 11) {
    if (bIdx === 0) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_033.mp4');
    if (bIdx === 1) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b02_pexels_27706413.mp4');
    if (bIdx === 2) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b03_pixabay_101333.mp4');
    if (bIdx === 3) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b04_pexels_2901533.mp4');
    if (bIdx === 4) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b05_pexels_35957868.mp4');
    if (bIdx === 5) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_034.mp4');
    if (bIdx === 6) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b07_pexels_10223717.mp4');
    if (bIdx === 7) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_035.mp4');
    if (bIdx === 8) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_006.mp4');
    if (bIdx === 9) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b10_pexels_13633624.mp4');
    if (bIdx === 10) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b11_pexels_7326372.mp4');
    if (bIdx === 11) return path.resolve(RAW_DIR, 'los_angeles_city_crews_to_remo_clip_001.mp4');
    if (bIdx === 12) return path.resolve(RAW_DIR, 'los_angeles_city_crews_to_remo_clip_002.mp4');
    if (bIdx === 13) return path.resolve(RAW_DIR, 'los_angeles_city_crews_to_remo_clip_003.mp4');
    if (bIdx === 14) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b15_pixabay_343478.mp4');
    if (bIdx === 15) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b16_pexels_8103488.mp4');
    if (bIdx === 16) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b17_pexels_27706410.mp4');
    if (bIdx === 17) return path.resolve(RAW_DIR, 'oakland_california_homeless_en_clip_001.mp4');
    if (bIdx === 18) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b19_pexels_7326020.mp4');
    if (bIdx === 19) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_036.mp4');
    if (bIdx === 20) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b21_pexels_17810188.mp4');
    if (bIdx === 21) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b22_pixabay_353576.mp4');
    if (bIdx === 22) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b23_pexels_6818210.mp4');
    if (bIdx === 23) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b24_pexels_35957942.mp4');
    if (bIdx === 24) return path.resolve(RAW_DIR, 'oakland_california_homeless_en_clip_002.mp4');
    if (bIdx === 25) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b26_pexels_5708174.mp4');
    if (bIdx === 26) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch11_b27_pexels_7329853.mp4');
  }

  const stock = await downloadStockVideoReliable(`sunset ${t.slice(0, 20)}`, `ch${chNum}_b${bIdx + 1}`);
  if (stock) return stock;

  throw new Error(`Could not resolve clip for Ch ${chNum} Beat ${bIdx + 1}`);
}

async function run() {
  console.log('🚀 STAGING CHAPTERS 9, 10, 11...');
  const locked = getLockedAssets([9, 10, 11]);
  for (const item of Array.from(locked)) {
    if (item.startsWith('stock_ch09_') || item.startsWith('stock_ch10_') || item.startsWith('stock_ch11_')) {
      locked.delete(item);
    }
  }

  const configs = [
    {
      ch: 9,
      title: 'The Tour',
      json: '09_9 - THE TOUR.json',
      audio: '9 - THE TOUR.mp3',
      themeColor: 'amber' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'INSIDE THE SHELTER', line2: 'A BED, A DOOR, RECLAIMED ACOUSTICS' },
      midCallout: { type: 'location_badge' as const, line1: 'NOT A SPECTACLE', line2: 'A HOME BUILT WITH CARE' },
    },
    {
      ch: 10,
      title: 'The Wider Order Closing In',
      json: '10_10 - THE WIDER ORDER CLOSING IN.json',
      audio: '10 - THE WIDER ORDER CLOSING IN.mp3',
      themeColor: 'crimson' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'STATE ENFORCEMENT DIRECTIVE', line2: 'SUPREME COURT RULING & CLEARANCES' },
      midCallout: { type: 'location_badge' as const, line1: 'LA FREEWAY CORRIDORS', line2: 'THE ENFORCEMENT WAVE CLOSING IN' },
    },
    {
      ch: 11,
      title: 'Closing',
      json: '11_11 - CLOSING.json',
      audio: '11 - CLOSING.mp3',
      themeColor: 'gold' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'AMERICAN HIDEAWAYS', line2: 'THE MAN ON THE HILLSIDE' },
      midCallout: { type: 'odometer_stat' as const, line1: 'A LIFETIME OF TRADE', line2: 'WHAT ONE PERSON MANAGED TO BUILD' },
    },
  ];

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
        id: `ch${cfg.ch < 10 ? '0' : ''}${cfg.ch}_beat_${bIdx + 1}`,
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

  console.log(`✅ CHAPTERS 9, 10, 11 STAGED FLAWLESSLY!`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
