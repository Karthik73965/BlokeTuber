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

  // === CHAPTER 4 ===
  if (chNum === 4) {
    if (bIdx === 0) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_010.mp4');
    if (bIdx === 1) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_015.mp4');
    if (bIdx === 2) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch04_b03_pexels_5967518.mp4');
    if (bIdx === 3) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch04_b04_pexels_29072593.mp4');
    if (bIdx === 4) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch04_b05_pexels_4777946.mp4');
    if (bIdx === 5) return path.resolve(RAW_DIR, 'homeless_man_creates_mini_mans_clip_005.mp4'); // Nathaniel Padilla interview
    if (bIdx === 6) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch04_b07_pexels_4918000.mp4');
    if (bIdx === 7) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch04_b08_pixabay_270409.mp4');
    if (bIdx === 8) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch04_b09_pexels_4918002.mp4');
    if (bIdx === 9) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_011.mp4');
    if (bIdx === 10) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_012.mp4');
    if (bIdx === 11) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_013.mp4');
    if (bIdx === 12) return path.resolve(RAW_DIR, 'gardener_experiencing_homeless_clip_014.mp4');
  }

  // === CHAPTER 5 ===
  if (chNum === 5) {
    if (bIdx === 0) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_001.mp4');
    if (bIdx === 1) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_002.mp4');
    if (bIdx === 2) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_003.mp4'); // Stella Ponce
    if (bIdx === 3) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_014.mp4');
    if (bIdx === 4) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_015.mp4');
    if (bIdx === 5) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_016.mp4');
    if (bIdx === 6) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch05_b07_pexels_10577776.mp4');
    if (bIdx === 7) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_017.mp4');
    if (bIdx === 8) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch05_b09_pexels_11903981.mp4');
    if (bIdx === 9) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_018.mp4');
    if (bIdx === 10) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch05_b11_pexels_12077148.mp4');
    if (bIdx === 11) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch05_b12_pexels_36805740.mp4');
    if (bIdx === 12) return path.resolve(RAW_DIR, 'pacoima_residents_plead_with_c_clip_019.mp4');
    if (bIdx === 13) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch05_b14_pexels_7598737.mp4');
    if (bIdx === 14) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch05_b15_pexels_7253208.mp4');
  }

  // === CHAPTER 6 ===
  if (chNum === 6) {
    if (bIdx === 0) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b01_pexels_5201209.mp4');
    if (bIdx === 1) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b02_pexels_7482666.mp4');
    if (bIdx === 2) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b04_pexels_8322286.mp4');
    if (bIdx === 3) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b05_pexels_7480498.mp4');
    if (bIdx === 4) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b08_pexels_7480514.mp4');
    if (bIdx === 5) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b09_pexels_3959712.mp4');
    if (bIdx === 6) return path.resolve(RAW_DIR, 'pacoima_street_homelessness_tr_clip_003.mp4');
    if (bIdx === 7) return path.resolve(RAW_DIR, 'pacoima_street_homelessness_tr_clip_004.mp4');
    if (bIdx === 8) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b10_pexels_38667506.mp4');
    if (bIdx === 9) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b12_pexels_38412979.mp4');
    if (bIdx === 10) return path.resolve(RAW_DIR, 'pacoima_street_homelessness_tr_clip_005.mp4');
    if (bIdx === 11) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b14_pexels_4122847.mp4');
    if (bIdx === 12) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b15_pexels_6003769.mp4');
    if (bIdx === 13) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b16_pexels_3960156.mp4');
    if (bIdx === 14) return path.resolve(REPO_ROOT, 'uploads/stock/portable-toilets/stock_ch06_b17_pixabay_132563.mp4');
    if (bIdx === 15) return path.resolve(RAW_DIR, 'pacoima_street_homelessness_tr_clip_006.mp4');
    if (bIdx === 16) return path.resolve(RAW_DIR, 'pacoima_street_homelessness_tr_clip_007.mp4');
  }

  const stock = await downloadStockVideoReliable(`california ${t.slice(0, 20)}`, `ch${chNum}_b${bIdx + 1}`);
  if (stock) return stock;

  throw new Error(`Could not resolve clip for Ch ${chNum} Beat ${bIdx + 1}`);
}

async function run() {
  console.log('🚀 STAGING CHAPTERS 4, 5, 6...');
  const locked = getLockedAssets([4, 5, 6]);

  const configs = [
    {
      ch: 4,
      title: 'The Neighbors Who Chose Him',
      json: '04_4 - THE NEIGHBORS WHO CHOSE HIM.json',
      audio: '4 - THE NEIGHBORS WHO CHOSE HIM.mp3',
      themeColor: 'cyan' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'TACO EL CANELO', line2: 'NATHANIEL PADILLA • STRIP MALL OWNER' },
      midCallout: { type: 'location_badge' as const, line1: 'PACOIMA COMMUNITY', line2: 'MUTUAL GOODWILL • ZERO SWEEP REQUESTS' },
    },
    {
      ch: 5,
      title: 'The Other Side Of The Same Corridor',
      json: '05_5 - THE OTHER SIDE OF THE SAME CORRIDOR.json',
      audio: '5 - THE OTHER SIDE OF THE SAME CORRIDOR.mp3',
      themeColor: 'crimson' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'STELLA PONCE (AGE 88)', line2: 'PACOIMA RESIDENT • THE OTHER SIDE OF 118' },
      midCallout: { type: 'odometer_stat' as const, line1: 'YEARS OF GRIEVANCE', line2: 'CALTRANS SYSTEMIC ABSENCE' },
    },
    {
      ch: 6,
      title: 'Viral, And What Virality Actually Bought Him',
      json: '06_6 - VIRAL AND WHAT VIRALITY ACTUALLY BOUGHT HIM.json',
      audio: '6 - VIRAL, AND WHAT VIRALITY ACTUALLY BOUGHT HIM.mp3',
      themeColor: 'gold' as const,
      introCallout: { type: 'editorial_lower_third' as const, line1: 'LOCAL MEDIA SENSATION', line2: 'MILLIONS OF SOCIAL MEDIA VIEWS' },
      midCallout: { type: 'odometer_stat' as const, line1: 'VIRALITY VS LEASE', line2: 'ATTENTION IS NOT HOUSING' },
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

  console.log(`✅ CHAPTERS 4, 5, 6 STAGED FLAWLESSLY!`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
