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

  // === CHAPTER 7 (41 beats) ===
  if (chNum === 7) {
    if (bIdx === 0) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_001.mp4');
    if (bIdx === 1) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b02_pexels_17402308.mp4');
    if (bIdx === 2) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_002.mp4');
    if (bIdx === 3) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_003.mp4');
    if (bIdx === 4) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b05_pexels_9702160.mp4');
    if (bIdx === 5) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_004.mp4');
    if (bIdx === 6) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b07_pexels_5972624.mp4');
    if (bIdx === 7) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b08_pexels_18226117.mp4');
    if (bIdx === 8) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b09_pexels_20374770.mp4');
    if (bIdx === 9) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b10_pexels_34435408.mp4');
    if (bIdx === 10) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b11_pexels_6285980.mp4');
    if (bIdx === 11) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_005.mp4');
    if (bIdx === 12) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_006.mp4');
    if (bIdx === 13) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b14_pexels_28775141.mp4');
    if (bIdx === 14) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b15_pexels_30065093.mp4');
    if (bIdx === 15) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b16_pexels_8321914.mp4');
    if (bIdx === 16) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b17_pexels_33288769.mp4');
    if (bIdx === 17) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b18_pexels_9700466.mp4');
    if (bIdx === 18) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b19_pexels_6783538.mp4');
    if (bIdx === 19) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_007.mp4');
    if (bIdx === 20) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b21_pexels_11880383.mp4');
    if (bIdx === 21) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_008.mp4');
    if (bIdx === 22) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_009.mp4');
    if (bIdx === 23) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch07_b24_pexels_6285966.mp4');
    if (bIdx === 24) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_010.mp4');
    if (bIdx === 25) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_004.mp4');
    if (bIdx === 26) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_005.mp4');
    if (bIdx === 27) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_011.mp4');
    if (bIdx === 28) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_012.mp4');
    if (bIdx === 29) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_013.mp4');
    if (bIdx === 30) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_014.mp4');
    if (bIdx === 31) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_015.mp4');
    if (bIdx === 32) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_016.mp4');
    if (bIdx === 33) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_017.mp4');
    if (bIdx === 34) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_018.mp4');
    if (bIdx === 35) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_019.mp4');
    if (bIdx === 36) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_020.mp4');
    if (bIdx === 37) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_021.mp4');
    if (bIdx === 38) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_022.mp4');
    if (bIdx === 39) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_023.mp4');
    if (bIdx === 40) return path.resolve(RAW_DIR, 'caltrans_crews_clean_out_sacra_clip_024.mp4');
  }

  // === CHAPTER 8 (14 beats) ===
  if (chNum === 8) {
    if (bIdx === 0) return path.resolve(RAW_DIR, 'north_hollywood_pallet_homes_x_clip_001.mp4');
    if (bIdx === 1) return path.resolve(RAW_DIR, 'north_hollywood_pallet_homes_x_clip_002.mp4');
    if (bIdx === 2) return path.resolve(RAW_DIR, 'north_hollywood_pallet_homes_x_clip_003.mp4');
    if (bIdx === 3) return path.resolve(RAW_DIR, 'north_hollywood_pallet_homes_x_clip_004.mp4');
    if (bIdx === 4) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch08_b05_pexels_6538597.mp4');
    if (bIdx === 5) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch08_b06_pexels_33149870.mp4');
    if (bIdx === 6) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch08_b07_pexels_6124802.mp4');
    if (bIdx === 7) return path.resolve(RAW_DIR, 'north_hollywood_pallet_homes_x_clip_005.mp4');
    if (bIdx === 8) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch08_b09_pexels_8457864.mp4');
    if (bIdx === 9) return path.resolve(RAW_DIR, 'north_hollywood_pallet_homes_x_clip_006.mp4');
    if (bIdx === 10) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch08_b11_pexels_7841634.mp4');
    if (bIdx === 11) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch08_b12_pexels_6785428.mp4');
    if (bIdx === 12) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch08_b13_pexels_33149866.mp4');
    if (bIdx === 13) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch08_b14_pexels_8298263.mp4');
  }

  const stock = await downloadStockVideoReliable(`highway ${t.slice(0, 20)}`, `ch${chNum}_b${bIdx + 1}`);
  if (stock) return stock;

  throw new Error(`Could not resolve clip for Ch ${chNum} Beat ${bIdx + 1}`);
}

async function run() {
  console.log('🚀 STAGING CHAPTERS 7 & 8...');
  const locked = getLockedAssets();

  // Clear any existing Chapter 7 & 8 clips from locked set so this run can cleanly validate and register them
  for (let b = 0; b < 41; b++) {
    const p = await resolveClipForBeat(7, b, '', new Set());
    locked.delete(path.basename(p));
  }
  for (let b = 0; b < 14; b++) {
    const p = await resolveClipForBeat(8, b, '', new Set());
    locked.delete(path.basename(p));
  }
  for (const item of Array.from(locked)) {
    if (item.startsWith('stock_ch07_') || item.startsWith('stock_ch08_')) {
      locked.delete(item);
    }
  }

  const configs = [
    {
      ch: 7,
      title: "Caltrans, And The Agency That Wasn't There",
      json: '07_7 - CALTRANS AND THE AGENCY THAT WASNT THERE.json',
      audio: "7 - CALTRANS, AND THE AGENCY THAT WASN'T THERE.mp3",
      themeColor: 'slate' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'CALIFORNIA RIGHT-OF-WAY', line2: "THE JURISDICTIONAL NO-MAN'S LAND" },
      midCallout: { type: 'location_badge' as const, line1: '3 LEVELS OF GOVERNMENT', line2: "EVERYONE'S LAND • NO ONE'S CASELOAD" },
    },
    {
      ch: 8,
      title: 'What Gets Taken Down',
      json: '08_8 - WHAT GETS TAKEN DOWN.json',
      audio: '8 - WHAT GETS TAKEN DOWN.mp3',
      themeColor: 'cyan' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'SUMMER HEAT & SHIFT', line2: 'MOVING INTO THE SHADE' },
      midCallout: { type: 'location_badge' as const, line1: 'NORTH HOLLYWOOD PALLET HOMES', line2: 'THE COST OF LEAVING COMMUNITY' },
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

  console.log(`✅ CHAPTERS 7 & 8 STAGED FLAWLESSLY!`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
