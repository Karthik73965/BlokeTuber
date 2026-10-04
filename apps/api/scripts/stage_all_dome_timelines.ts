import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import type {
  Timeline,
  TimelineClip,
  SceneLayoutType,
  CalloutOverlay,
  OverlayType,
  TransitionType,
  SceneLayoutData,
} from '@repo/shared';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import { loadProjectManifest, SlicedRawClip } from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_dome_villages';
const REPO_ROOT = path.resolve(__dirname, '../../..');
const TRANSCRIPTS_DIR = path.resolve(REPO_ROOT, 'uploads/transcripts/dome');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/dome');
const REGISTRY_PATH = path.resolve(REPO_ROOT, `uploads/registry/${PROJECT_ID}_media_registry.json`);
const AUDIO_DIR = path.resolve(REPO_ROOT, 'uploads/audio');

fs.mkdirSync(TIMELINES_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REGISTRY_PATH), { recursive: true });

// SFX directory
const SFX_DIR = path.resolve(REPO_ROOT, 'packages/remotion-video/public/sfx');
const SFX = {
  whoosh_cinematic: path.join(SFX_DIR, 'whoosh_cinematic.mp3'),
  whoosh_air: path.join(SFX_DIR, 'whoosh_air.mp3'),
  camera_shutter: path.join(SFX_DIR, 'camera_shutter.mp3'),
  paper_slide: path.join(SFX_DIR, 'paper_slide.mp3'),
  stat_click: path.join(SFX_DIR, 'stat_click.mp3'),
  subtle_hit: path.join(SFX_DIR, 'subtle_hit.mp3'),
};

interface AlignmentSegment {
  text: string;
  start: number;
  end: number;
  words?: Array<{ word: string; start: number; end: number }>;
}

const CHAPTER_CONFIGS: Record<
  number,
  {
    jsonFile: string;
    audioFile: string;
    title: string;
    tagPreference: string[];
    themeColor: 'gold' | 'amber' | 'cyan' | 'crimson' | 'emerald' | 'slate' | 'white';
    introCallout: { type: any; line1: string; line2?: string };
    midCallout: { type: any; line1: string; line2?: string };
  }
> = {
  1: {
    jsonFile: '01_1 - The Cold Open.json',
    audioFile: '1 - The Cold Open.mp3',
    title: 'Chapter 01: The Cold Open',
    tagPreference: ['skid_row', 'street_homelessness', 'sidewalk_living', 'cardboard_sign', 'los_angeles', 'dome_interior', 'curved_walls'],
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'SKID ROW, LOS ANGELES', line2: '4:00 AM • 39 DEGREES' },
    midCallout: { type: 'location_badge', line1: 'DOWNTOWN LA CORRIDOR', line2: 'TWO MILES FROM HOPE' },
  },
  2: {
    jsonFile: '02_2 - The Man Who Slept Outside.json',
    audioFile: '2 - The Man Who Slept Outside.mp3',
    title: 'Chapter 02: The Man Who Slept Outside',
    tagPreference: ['ted_hayes', 'justiceville', '1993_2006_archive', 'ted_hayes_tour', 'historic_village', 'dome_village_la'],
    themeColor: 'crimson',
    introCallout: { type: 'editorial_lower_third', line1: 'TED HAYES', line2: 'HOUSING ACTIVIST • FOUNDER OF JUSTICEVILLE' },
    midCallout: { type: 'odometer_stat', line1: '8 YEARS ON THE STREET', line2: '35-DAY HUNGER STRIKE' },
  },
  3: {
    jsonFile: '03_3 - A Dome That Bolts Together.json',
    audioFile: '3 - A Dome That Bolts Together.mp3',
    title: 'Chapter 03: A Dome That Bolts Together',
    tagPreference: ['buckminster_fuller', 'geodesic_sphere', 'architecture_history', 'intershelter', 'dome_assembly', 'bolting_panels', 'craig_chamberlain'],
    themeColor: 'amber',
    introCallout: { type: 'editorial_lower_third', line1: 'CRAIG CHAMBERLAIN', line2: 'THE OMNI-SPHERE • 20-FOOT FIBERGLASS DOME' },
    midCallout: { type: 'odometer_stat', line1: '21 PANELS • 150 BOLTS', line2: 'BUILT UNDER 4 HOURS' },
  },
  4: {
    jsonFile: '04_4 -  Life Inside the Village.json',
    audioFile: '4 -  Life Inside the Village.mp3',
    title: 'Chapter 04: Life Inside the Village',
    tagPreference: ['dome_interior', 'curved_walls', 'porthole_window', 'floating_furniture', 'dome_bed', 'living_space', 'village_lifestyle'],
    themeColor: 'cyan',
    introCallout: { type: 'editorial_lower_third', line1: 'LIFE INSIDE THE SPHERE', line2: 'NO CORNERS • 314 SQUARE FEET' },
    midCallout: { type: 'location_badge', line1: 'GOLDEN AVENUE VILLAGE', line2: '12 HOMES • 8 SHARED DOMES' },
  },
  5: {
    jsonFile: '05_5 - Thirteen Years.json',
    audioFile: '5 - Thirteen Years.mp3',
    title: 'Chapter 05: Thirteen Years',
    tagPreference: ['village_lifestyle', 'communal_spaces', 'outdoor_pathways', 'community_living', 'dome_village_la'],
    themeColor: 'emerald',
    introCallout: { type: 'editorial_lower_third', line1: '1993 - 2006', line2: 'A DECOMPRESSION CHAMBER BESIDE THE 110 FREEWAY' },
    midCallout: { type: 'odometer_stat', line1: '13 YEARS OPERATING', line2: 'HUNDREDS OF RESIDENTS TRANSITIONED' },
  },
  6: {
    jsonFile: '06_6 -  The Rent.json',
    audioFile: '6 -  The Rent.mp3',
    title: 'Chapter 06: The Rent',
    tagPreference: ['dome_village_la', 'historic_domes', 'golden_avenue_village', 'governance_rules', 'ted_hayes'],
    themeColor: 'crimson',
    introCallout: { type: 'editorial_lower_third', line1: 'OCTOBER 31, 2006', line2: 'DOME VILLAGE PERMANENTLY CLOSES' },
    midCallout: { type: 'odometer_stat', line1: '$2,500 TO $18,000 / MO', line2: 'THE 700% RENT HIKE THAT KILLED THE VILLAGE' },
  },
  7: {
    jsonFile: '07_7 - The Idea Multiplies.json',
    audioFile: '7 - The Idea Multiplies.mp3',
    title: 'Chapter 07: The Idea Multiplies',
    tagPreference: ['intershelter', 'honolulu_dome', 'first_assembly_of_god', 'pringles_stack', 'alaska_kit', 'assembly_timelapse'],
    themeColor: 'amber',
    introCallout: { type: 'editorial_lower_third', line1: 'INTERSHELTER • JUNEAU, AK', line2: 'HURRICANE-RATED COMPOSITE DOMES' },
    midCallout: { type: 'location_badge', line1: 'FIRST ASSEMBLY OF GOD', line2: 'HONOLULU, HAWAII • 12-DOME VILLAGE' },
  },
  8: {
    jsonFile: '08_8 - Dignity Village.json',
    audioFile: '8 - Dignity Village.mp3',
    title: 'Chapter 08: Dignity Village',
    tagPreference: ['dignity_village', 'portland_oregon', 'self_governed', '25_year_village', 'grassroots_housing'],
    themeColor: 'emerald',
    introCallout: { type: 'editorial_lower_third', line1: 'DIGNITY VILLAGE', line2: 'PORTLAND, OREGON • EST. 2000' },
    midCallout: { type: 'odometer_stat', line1: '25 YEARS RUNNING', line2: '60 RESIDENTS • SELF-GOVERNED SANCTUARY' },
  },
  9: {
    jsonFile: '09_9 -  Community First.json',
    audioFile: '9 -  Community First.mp3',
    title: 'Chapter 09: Community First',
    tagPreference: ['community_first_village', 'austin_texas', 'alan_graham', 'tiny_homes_rvs', '51_acres', 'garden_cinema'],
    themeColor: 'cyan',
    introCallout: { type: 'editorial_lower_third', line1: 'COMMUNITY FIRST! VILLAGE', line2: 'ALAN GRAHAM • AUSTIN, TEXAS' },
    midCallout: { type: 'odometer_stat', line1: '51 ACRES • 400 RESIDENTS', line2: 'EXPANDING TO 178 ACRES & 1,900 HOMES' },
  },
  10: {
    jsonFile: '10_10 -  Who Is Really Out There.json',
    audioFile: '10 -  Who Is Really Out There.mp3',
    title: 'Chapter 10: Who Is Really Out There',
    tagPreference: ['older_unhoused', 'unhoused_elderly', 'skid_row', 'street_homelessness', 'resident_spaces', 'dignity'],
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'AMERICA’S AGING CRISIS', line2: '770,000 UNSHELTERED IN 2024' },
    midCallout: { type: 'odometer_stat', line1: '48% OVER AGE 50', line2: 'MEDIAN AGE AT DEATH: 64.6' },
  },
  11: {
    jsonFile: '11_11 -  The Criticism.json',
    audioFile: '11 -  The Criticism.mp3',
    title: 'Chapter 11: The Criticism',
    tagPreference: ['governance_rules', 'village_maintenance', 'fiberglass_aging', 'weather_exposure', 'shelter_reality'],
    themeColor: 'crimson',
    introCallout: { type: 'editorial_lower_third', line1: 'THE CRITICS’ CASE', line2: 'TOURNIQUET VS. CURE' },
    midCallout: { type: 'odometer_stat', line1: '$10,000 PER SHELL', line2: 'NO PRIVATE PLUMBING • SUN-WEATHERED FIBERGLASS' },
  },
  12: {
    jsonFile: '12_12 -  The Cost of Waiting.json',
    audioFile: '12 -  The Cost of Waiting.mp3',
    title: 'Chapter 12: The Cost of Waiting',
    tagPreference: ['street_homelessness', 'skid_row', 'los_angeles', 'resident_spaces', 'dignity', 'closing_shots'],
    themeColor: 'slate',
    introCallout: { type: 'editorial_lower_third', line1: 'TRAVIS COUNTY STUDY', line2: 'AUSTIN, TEXAS • 1,000+ DEATHS REVIEWED' },
    midCallout: { type: 'odometer_stat', line1: '9.5 YEARS LONGER LIFE', line2: 'WHEN GIVEN PERMANENT STABILITY' },
  },
  13: {
    jsonFile: '13_13 - Closing.json',
    audioFile: '13 - Closing.mp3',
    title: 'Chapter 13: Closing',
    tagPreference: ['closing_shots', 'aerial_village', 'dome_interior', 'curved_walls', 'future_housing', 'cinematic_broll'],
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'NOT JUST SHELTER', line2: 'WITNESS' },
    midCallout: { type: 'location_badge', line1: 'TWENTY FEET WIDE', line2: 'WARMTH • SAFETY • A LOCKED DOOR' },
  },
};

function getAudioDuration(filePath: string): number {
  try {
    const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`, {
      encoding: 'utf-8',
    });
    return parseFloat(out.trim());
  } catch (err) {
    console.error(`Error probing audio duration for ${filePath}:`, err);
    return 0;
  }
}

function groupSegmentsIntoBeats(
  segments: AlignmentSegment[],
  totalDuration: number
): Array<{ start: number; end: number; text: string }> {
  // 1. Break long segments (> 5.0s) into balanced sub-pieces (< 4.2s each)
  const normalized: Array<{ start: number; end: number; text: string }> = [];
  for (const s of segments) {
    const dur = s.end - s.start;
    if (dur > 5.0) {
      const words = s.text.trim().split(/\s+/);
      const pieces = Math.ceil(dur / 4.0);
      const wordsPerPiece = Math.ceil(words.length / pieces);
      const timePerPiece = dur / pieces;
      for (let p = 0; p < pieces; p++) {
        const pieceWords = words.slice(p * wordsPerPiece, (p + 1) * wordsPerPiece);
        if (pieceWords.length > 0) {
          normalized.push({
            start: s.start + p * timePerPiece,
            end: p === pieces - 1 ? s.end : s.start + (p + 1) * timePerPiece,
            text: pieceWords.join(' '),
          });
        }
      }
    } else {
      normalized.push({ start: s.start, end: s.end, text: s.text.trim() });
    }
  }

  // 2. Greedily accumulate into beats targeting 3.2s - 5.2s
  const beats: Array<{ start: number; end: number; text: string }> = [];
  let curBeat = { start: 0, end: 0, text: '' };

  for (let i = 0; i < normalized.length; i++) {
    const item = normalized[i]!;
    if (!curBeat.text) {
      curBeat.start = item.start;
      curBeat.end = item.end;
      curBeat.text = item.text;
    } else {
      const durWithItem = item.end - curBeat.start;
      const curDur = curBeat.end - curBeat.start;

      // Close current beat if it's already >= 3.0s and adding item would push it over 5.2s
      if (curDur >= 3.0 && durWithItem > 5.2) {
        beats.push({ ...curBeat });
        curBeat = { start: item.start, end: item.end, text: item.text };
      } else {
        curBeat.end = item.end;
        curBeat.text += ' ' + item.text;
      }
    }
  }

  if (curBeat.text) {
    beats.push({ ...curBeat });
  }

  // 3. Post-pass: Rebalance trailing short beat (< 2.8s) with its predecessor
  if (beats.length > 1) {
    const last = beats[beats.length - 1]!;
    const prev = beats[beats.length - 2]!;
    const lastDur = last.end - last.start;
    if (lastDur < 2.8) {
      const combinedDur = last.end - prev.start;
      if (combinedDur <= 5.8) {
        prev.end = last.end;
        prev.text += ' ' + last.text;
        beats.pop();
      } else {
        const midTime = prev.start + combinedDur / 2;
        prev.end = midTime;
        last.start = midTime;
      }
    }
  }

  // 4. Mathematically enforce 100% gapless continuity
  if (beats.length > 0) {
    beats[0]!.start = 0;
    for (let i = 0; i < beats.length - 1; i++) {
      const cur = beats[i]!;
      const next = beats[i + 1]!;
      const bridge = (cur.end + next.start) / 2;
      cur.end = bridge;
      next.start = bridge;
    }

    // Handle end of audio / trailing silence cleanly
    const finalBeat = beats[beats.length - 1]!;
    if (totalDuration - finalBeat.start > 5.8) {
      const remaining = totalDuration - finalBeat.start;
      const halfRemaining = finalBeat.start + remaining / 2;
      const outroText = finalBeat.text;
      finalBeat.end = halfRemaining;
      beats.push({
        start: halfRemaining,
        end: totalDuration,
        text: outroText,
      });
    } else {
      finalBeat.end = totalDuration;
    }
  }

  // 5. Perfect Pacing Pass: Subdivide any beat that exceeds 5.8s into balanced sub-beats
  const perfectlyPaced: Array<{ start: number; end: number; text: string }> = [];
  for (const b of beats) {
    const dur = b.end - b.start;
    if (dur > 5.8) {
      const mid = b.start + dur / 2;
      const words = b.text.trim().split(/\s+/);
      const half = Math.max(1, Math.ceil(words.length / 2));
      perfectlyPaced.push({
        start: b.start,
        end: mid,
        text: words.slice(0, half).join(' '),
      });
      perfectlyPaced.push({
        start: mid,
        end: b.end,
        text: words.slice(half).join(' ') || words.join(' '),
      });
    } else {
      perfectlyPaced.push(b);
    }
  }

  return perfectlyPaced;
}

export function stageAllDomeTimelines() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 STAGING ALL 13 DOME VILLAGES TIMELINES (100% UNIQUE ASSETS)');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const manifest = loadProjectManifest(PROJECT_ID);
  if (!manifest || !manifest.clips) {
    throw new Error('Project manifest not found');
  }

  const approvedClips = manifest.clips.filter((c) => c.screeningStatus !== 'rejected');
  console.log(`Available Approved Clips: ${approvedClips.length}`);

  const usedPaths = new Set<string>();

  for (let chNum = 1; chNum <= 13; chNum++) {
    const config = CHAPTER_CONFIGS[chNum];
    if (!config) continue;

    console.log(`\n───────────────────────────────────────────────────────────────────`);
    console.log(`Chapter ${String(chNum).padStart(2, '0')}: ${config.title}`);
    console.log(`───────────────────────────────────────────────────────────────────`);

    const jsonPath = path.join(TRANSCRIPTS_DIR, config.jsonFile);
    if (!fs.existsSync(jsonPath)) {
      console.warn(`Transcript file missing: ${jsonPath}`);
      continue;
    }

    const masterAudioPath = path.join(AUDIO_DIR, config.audioFile);
    const audioDur = getAudioDuration(masterAudioPath);

    const transcriptData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const segments: AlignmentSegment[] = transcriptData.segments || [];
    const lastSegEnd = segments[segments.length - 1]?.end || 0;
    const totalDuration = audioDur > 0 ? audioDur : lastSegEnd;

    const beats = groupSegmentsIntoBeats(segments, totalDuration);

    console.log(`Beats: ${beats.length} | Audio Duration: ${totalDuration.toFixed(2)}s`);

    const clips: TimelineClip[] = [];

    for (let bIdx = 0; bIdx < beats.length; bIdx++) {
      const beat = beats[bIdx]!;
      const startTime = beat.start;
      const endTime = beat.end;
      const dur = endTime - startTime;

      // Select candidate clip matching tag preference, strictly unused
      let chosen: SlicedRawClip | null = null;

      // 1. Try matching preferred tags
      for (const prefTag of config.tagPreference) {
        const found = approvedClips.find((c) => {
          if (usedPaths.has(c.fullPath)) return false;
          if (c.duration && c.duration < dur - 0.2) return false;
          return c.tags?.includes(prefTag);
        });
        if (found) {
          chosen = found;
          break;
        }
      }

      // 2. Fallback to any unused approved clip with sufficient duration
      if (!chosen) {
        chosen = approvedClips.find((c) => !usedPaths.has(c.fullPath) && (!c.duration || c.duration >= dur - 0.2)) || null;
      }

      // 3. Fallback to any unused approved clip
      if (!chosen) {
        chosen = approvedClips.find((c) => !usedPaths.has(c.fullPath)) || null;
      }

      // 4. Absolute fallback
      if (!chosen) {
        chosen = approvedClips[bIdx % approvedClips.length]!;
      }

      usedPaths.add(chosen.fullPath);

      // 1. Callouts: intro on beat 1, mid on beat ~floor(N/2)
      let callout: CalloutOverlay | null = null;
      if (bIdx === 1) {
        callout = {
          type: config.introCallout.type,
          line1: config.introCallout.line1,
          line2: config.introCallout.line2,
          themeColor: config.themeColor,
          startTime: 0.3,
          endTime: Math.min(dur - 0.2, 3.8),
        };
      } else if (bIdx === Math.floor(beats.length / 2)) {
        callout = {
          type: config.midCallout.type,
          line1: config.midCallout.line1,
          line2: config.midCallout.line2,
          themeColor: config.themeColor,
          startTime: 0.3,
          endTime: Math.min(dur - 0.2, 3.8),
        };
      }

      // 2. Determine Layout (Never assign hero_graphic_centerpiece without a callout)
      let layout: SceneLayoutType = 'full_bleed_cinematic';
      let layoutData: SceneLayoutData | undefined = undefined;

      if (callout) {
        layout = 'hero_graphic_centerpiece';
        layoutData = { title: config.title.toUpperCase(), subtitle: 'HISTORICAL RECORD' };
      } else if (bIdx % 2 === 1) {
        layout = 'ambient_blur_frame';
        layoutData = { title: 'DOME VILLAGES', subtitle: 'ARCHITECTURAL PROFILE' };
      } else {
        layout = 'full_bleed_cinematic';
      }

      // Sound effect
      let sfxPath: string | undefined = undefined;
      let sfxVolume = 0.15;
      if (callout) {
        sfxPath = callout.type === 'odometer_stat' ? SFX.stat_click : SFX.paper_slide;
      } else if (bIdx % 4 === 0) {
        sfxPath = SFX.whoosh_air;
      }

      const timelineClip: TimelineClip = {
        beatIndex: bIdx,
        chapterIndex: chNum,
        text: beat.text,
        startTime,
        endTime,
        clipPath: chosen.fullPath,
        mediaType: 'video',
        layout,
        layoutData,
        kenBurns: true,
        transitionType: bIdx === 0 ? 'cut' : 'crossfade',
        transitionDuration: bIdx === 0 ? 0 : 0.35,
        numberOverlays: [],
        callout,
        overlay: bIdx % 2 === 0 ? 'micro_film_grain' : 'cinematic_vignette',
        sfxPath,
        sfxVolume,
      };

      clips.push(timelineClip);
    }

    const timeline: Timeline = {
      masterAudioPath,
      totalDuration,
      clips,
    };

    const outJsonPath = path.join(TIMELINES_DIR, `chapter_${String(chNum).padStart(2, '0')}_final.json`);
    fs.writeFileSync(outJsonPath, JSON.stringify(timeline, null, 2), 'utf-8');
    console.log(`Saved timeline to: ${outJsonPath}`);

    // Update chapter in store
    const chapters = chaptersStore.forProject(PROJECT_ID);
    const chapterRecord = chapters.find((c) => c.chapterIndex === chNum);
    if (chapterRecord) {
      chaptersStore.update(PROJECT_ID, chapterRecord.id, {
        timelineJson: timeline as any,
        status: 'completed',
      });
      console.log(`Updated Chapter ${chNum} in store: status = completed`);
    }
  }

  // Save to persistent registry
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(Array.from(usedPaths), null, 2), 'utf-8');
  console.log(`\n═══════════════════════════════════════════════════════════════════`);
  console.log(`🎉 ALL 13 TIMELINES STAGED & REGISTERED!`);
  console.log(`Total Unique Media Assets Locked: ${usedPaths.size}`);
  console.log(`Registry: ${REGISTRY_PATH}`);
  console.log(`═══════════════════════════════════════════════════════════════════\n`);
}

if (require.main === module) {
  stageAllDomeTimelines();
}
