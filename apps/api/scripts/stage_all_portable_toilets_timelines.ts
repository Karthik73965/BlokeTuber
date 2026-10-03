import fs from 'fs';
import path from 'path';
import type { Timeline, TimelineClip, SceneLayoutType, CalloutOverlay, OverlayType, TransitionType, SceneLayoutData } from '@repo/shared';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import { loadProjectManifest } from '../src/services/youtubeSourcing';

const PROJECT_ID = 'proj_1790101325660';
const REPO_ROOT = path.resolve(__dirname, '../../..');
const TRANSCRIPTS_DIR = path.resolve(REPO_ROOT, 'uploads/transcripts/portable-toilets');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/portable-toilets');
const REGISTRY_PATH = path.resolve(REPO_ROOT, `uploads/registry/${PROJECT_ID}_media_registry.json`);

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
  words: Array<{ word: string; start: number; end: number }>;
}

const CHAPTER_CONFIGS: Record<number, {
  jsonFile: string;
  audioFile: string;
  title: string;
  tagPreference: string[];
  themeColor: 'gold' | 'amber' | 'cyan' | 'crimson' | 'emerald' | 'slate' | 'white';
  introCallout: { type: any; line1: string; line2?: string };
  midCallout: { type: any; line1: string; line2?: string };
}> = {
  1: {
    jsonFile: '01_1 - COLD.json',
    audioFile: '1 - COLD.mp3',
    title: 'Cold Open',
    tagPreference: ['jose_fuentes', 'hillside_estate', 'toy_cars', 'pink_flamingo_clock', 'rock_gardens', 'green_slide', 'freeway_overpass', 'wide_freeway_view'],
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'GLENOAKS BLVD & SR-118', line2: 'PACOIMA, LOS ANGELES • 6:45 AM' },
    midCallout: { type: 'location_badge', line1: 'THE HILLSIDE ESTATE', line2: 'JOSE FUENTES • BUILT BY HAND' },
  },
  2: {
    jsonFile: '02_2 - THE GARDENER WITH NO GARDEN.json',
    audioFile: '2 - THE GARDENER WITH NO GARDEN.mp3',
    title: 'The Gardener With No Garden',
    tagPreference: ['jose_fuentes', 'rock_gardens', 'green_slide', 'authentic_broll', 'hillside_estate', 'freeway_overpass', 'california_encampment_broll'],
    themeColor: 'emerald',
    introCallout: { type: 'editorial_lower_third', line1: 'JOSE FUENTES', line2: 'PROFESSIONAL LANDSCAPER • COLIMA, MEXICO' },
    midCallout: { type: 'odometer_stat', line1: 'HUNDREDS OF HOURS', line2: 'NO BLUEPRINT • NO BUDGET' },
  },
  3: {
    jsonFile: '03_3 - WHO AGES OUT ONTO A HILLSIDE.json',
    audioFile: '3 - WHO AGES OUT ONTO A HILLSIDE.mp3',
    title: 'Who Ages Out Onto A Hillside',
    tagPreference: ['older_unhoused', 'corridor_tents', 'sidewalk_survival', 'la_county_homelessness', 'california_encampment_broll', 'jose_fuentes'],
    themeColor: 'amber',
    introCallout: { type: 'editorial_lower_third', line1: 'LOS ANGELES COUNTY', line2: 'AGING TRADESMEN WITHOUT A SAFETY NET' },
    midCallout: { type: 'odometer_stat', line1: '50s, 60s & BEYOND', line2: 'THE SLOW MATH OF RISING RENT' },
  },
  4: {
    jsonFile: '04_4 - THE NEIGHBORS WHO CHOSE HIM.json',
    audioFile: '4 - THE NEIGHBORS WHO CHOSE HIM.mp3',
    title: 'The Neighbors Who Chose Him',
    tagPreference: ['pacoima_businesses', 'strip_mall_corridor', 'street_conditions', 'pacoima_street', 'hillside_estate', 'jose_fuentes'],
    themeColor: 'cyan',
    introCallout: { type: 'editorial_lower_third', line1: 'TACO EL CANELO', line2: 'NATHANIEL PADILLA • STRIP MALL OWNER' },
    midCallout: { type: 'location_badge', line1: 'PACOIMA COMMUNITY', line2: 'MUTUAL GOODWILL • ZERO SWEEP REQUESTS' },
  },
  5: {
    jsonFile: '05_5 - THE OTHER SIDE OF THE SAME CORRIDOR.json',
    audioFile: '5 - THE OTHER SIDE OF THE SAME CORRIDOR.mp3',
    title: 'The Other Side Of The Same Corridor',
    tagPreference: ['stella_ponce', 'bicycles_trash_pile', 'pacoima_fence', 'encampment_debris', 'grievance_side', 'night_encampment', 'pacoima_encampment'],
    themeColor: 'crimson',
    introCallout: { type: 'editorial_lower_third', line1: 'STELLA PONCE (AGE 88)', line2: 'PACOIMA RESIDENT • THE OTHER SIDE OF 118' },
    midCallout: { type: 'odometer_stat', line1: 'YEARS OF GRIEVANCE', line2: 'CALTRANS SYSTEMIC ABSENCE' },
  },
  6: {
    jsonFile: '06_6 - VIRAL AND WHAT VIRALITY ACTUALLY BOUGHT HIM.json',
    audioFile: '6 - VIRAL, AND WHAT VIRALITY ACTUALLY BOUGHT HIM.mp3',
    title: 'Viral, And What Virality Actually Bought Him',
    tagPreference: ['viral_media_coverage', 'news_report', 'fox11_broadcast', 'wide_freeway_view', 'hillside_estate', 'pacoima_118', 'freeway_traffic_passing'],
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'LOCAL MEDIA SENSATION', line2: 'MILLIONS OF SOCIAL MEDIA VIEWS' },
    midCallout: { type: 'odometer_stat', line1: 'VIRALITY VS LEASE', line2: 'ATTENTION IS NOT HOUSING' },
  },
  7: {
    jsonFile: '07_7 - CALTRANS AND THE AGENCY THAT WASNT THERE.json',
    audioFile: '7 - CALTRANS, AND THE AGENCY THAT WASN\'T THERE.mp3',
    title: 'Caltrans, And The Agency That Wasn\'t There',
    tagPreference: ['caltrans_notice_to_vacate', 'eviction_notice', 'caltrans_crews', 'orange_cones', 'state_property', 'jurisdictional_gap', 'railroad_tracks_debris', 'mass_debris_piles', 'freeway_underpass_tents', 'concrete_highway_wall', 'encampment_sweep'],
    themeColor: 'slate',
    introCallout: { type: 'editorial_lower_third', line1: 'CALIFORNIA RIGHT-OF-WAY', line2: 'THE JURISDICTIONAL NO-MAN\'S LAND' },
    midCallout: { type: 'location_badge', line1: '3 LEVELS OF GOVERNMENT', line2: 'EVERYONE\'S LAND • NO ONE\'S CASELOAD' },
  },
  8: {
    jsonFile: '08_8 - WHAT GETS TAKEN DOWN.json',
    audioFile: '8 - WHAT GETS TAKEN DOWN.mp3',
    title: 'What Gets Taken Down',
    tagPreference: ['north_hollywood_shelter', 'pallet_homes', 'modular_cabins', 'pallet_tiny_homes', 'victory_blvd_freeway', 'village_walkway', 'lockable_door', 'hillside_estate'],
    themeColor: 'cyan',
    introCallout: { type: 'editorial_lower_third', line1: 'SUMMER HEAT & SHIFT', line2: 'MOVING INTO THE SHADE' },
    midCallout: { type: 'location_badge', line1: 'NORTH HOLLYWOOD PALLET HOMES', line2: 'THE COST OF LEAVING COMMUNITY' },
  },
  9: {
    jsonFile: '09_9 - THE TOUR.json',
    audioFile: '9 - THE TOUR.mp3',
    title: 'The Tour',
    tagPreference: ['shelter_tour', 'shelter_interior', 'bed_and_salvage', 'walkthrough', 'jose_fuentes', 'hillside_estate'],
    themeColor: 'amber',
    introCallout: { type: 'editorial_lower_third', line1: 'INSIDE THE SHELTER', line2: 'A BED, A DOOR, RECLAIMED ACOUSTICS' },
    midCallout: { type: 'location_badge', line1: 'NOT A SPECTACLE', line2: 'A HOME BUILT WITH CARE' },
  },
  10: {
    jsonFile: '10_10 - THE WIDER ORDER CLOSING IN.json',
    audioFile: '10 - THE WIDER ORDER CLOSING IN.mp3',
    title: 'The Wider Order Closing In',
    tagPreference: ['encampment_sweep', 'heavy_machinery', 'caltrans_city_cleaners', 'protective_suits', 'removal_operations', 'city_sweeps', 'city_sanitation_crews', 'encampment_notices', 'freeway_underpass_tents'],
    themeColor: 'crimson',
    introCallout: { type: 'editorial_lower_third', line1: 'STATE ENFORCEMENT DIRECTIVE', line2: 'SUPREME COURT RULING & CLEARANCES' },
    midCallout: { type: 'location_badge', line1: 'LA FREEWAY CORRIDORS', line2: 'THE ENFORCEMENT WAVE CLOSING IN' },
  },
  11: {
    jsonFile: '11_11 - CLOSING.json',
    audioFile: '11 - CLOSING.mp3',
    title: 'Closing',
    tagPreference: ['jose_fuentes', 'hillside_estate', 'pacoima_118', 'rock_gardens', 'wide_freeway_view', 'freeway_overpass', 'toy_cars', 'pink_flamingo_clock'],
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'AMERICAN HIDEAWAYS', line2: 'THE MAN ON THE HILLSIDE' },
    midCallout: { type: 'odometer_stat', line1: 'A LIFETIME OF TRADE', line2: 'WHAT ONE PERSON MANAGED TO BUILD' },
  },
};

async function stageAllPortableToiletsTimelines() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 DIRECTING PORTABLE TOILETS DOCUMENTARY TIMELINES (CHAPTERS 1–11)');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('✨ Strict Zero-Repeat Rule Enforced Across Entire Project');
  console.log('✨ 100% Screened Authentic B-Roll from Approved Pool');
  console.log('✨ Micro Film Grain & Subtle Documentary Transitions\n');

  const manifest = loadProjectManifest(PROJECT_ID);
  const approvedClips = manifest.clips.filter((c) => c.status === 'approved');
  console.log(`🎥 Total Available Approved Raw Clips: ${approvedClips.length}`);

  const usedClipFilenames = new Set<string>();

  for (let chNum = 1; chNum <= 11; chNum++) {
    const config = CHAPTER_CONFIGS[chNum]!;
    const numStr = String(chNum).padStart(2, '0');
    const jsonPath = path.join(TRANSCRIPTS_DIR, config.jsonFile);
    const audioPath = path.resolve(REPO_ROOT, 'uploads/audio', config.audioFile);

    if (!fs.existsSync(jsonPath)) {
      console.warn(`⚠️ Transcript not found: ${jsonPath}`);
      continue;
    }
    if (!fs.existsSync(audioPath)) {
      console.warn(`⚠️ Audio not found: ${audioPath}`);
      continue;
    }

    const transcriptData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const segments: AlignmentSegment[] = transcriptData.segments || [];

    // Group Whisper segments into 3.5s – 6.0s rhythmic beats
    const beats: Array<{ start: number; end: number; text: string; words: any[] }> = [];
    let curBeat = { start: 0, end: 0, text: '', words: [] as any[] };

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]!;
      if (curBeat.words.length === 0) {
        curBeat.start = seg.start;
        curBeat.end = seg.end;
        curBeat.text = seg.text.trim();
        curBeat.words = [...(seg.words || [])];
      } else {
        const potentialDuration = seg.end - curBeat.start;
        if (potentialDuration <= 5.8) {
          curBeat.end = seg.end;
          curBeat.text += ' ' + seg.text.trim();
          curBeat.words.push(...(seg.words || []));
        } else {
          beats.push({ ...curBeat });
          curBeat = { start: seg.start, end: seg.end, text: seg.text.trim(), words: [...(seg.words || [])] };
        }
      }
    }
    if (curBeat.words.length > 0) {
      beats.push({ ...curBeat });
    }

    const totalDuration = beats[beats.length - 1]?.end || 60;
    console.log(`\n───────────────────────────────────────────────────────────────────`);
    console.log(`🎬 Directing Chapter ${numStr}: "${config.title}" (${beats.length} beats, ${totalDuration.toFixed(1)}s)`);
    console.log(`───────────────────────────────────────────────────────────────────`);

    const clips: TimelineClip[] = [];

    for (let bIdx = 0; bIdx < beats.length; bIdx++) {
      const beat = beats[bIdx]!;
      const clipDuration = Number((beat.end - beat.start).toFixed(2));

      // 1. Find unused approved clip matching priority tags
      let selectedRaw = approvedClips.find((c) => {
        if (usedClipFilenames.has(c.filename)) return false;
        return c.tags?.some((t) => config.tagPreference.includes(t));
      });

      // 2. Fallback to any unused approved clip
      if (!selectedRaw) {
        selectedRaw = approvedClips.find((c) => !usedClipFilenames.has(c.filename));
      }

      if (selectedRaw) {
        usedClipFilenames.add(selectedRaw.filename);
      } else {
        console.error(`❌ CRITICAL: Ran out of unique approved clips at Chapter ${chNum} Beat ${bIdx + 1}!`);
        throw new Error('Approved clips exhausted; sourcing required.');
      }

      const clipPath = selectedRaw.fullPath;
      const clipId = `ch${numStr}_beat_${bIdx + 1}`;

      // Callout positioning
      let callout: CalloutOverlay | null = null;
      if (bIdx === 0) {
        callout = {
          type: config.introCallout.type,
          line1: config.introCallout.line1,
          line2: config.introCallout.line2,
          startTime: 0.3,
          endTime: Math.min(3.6, clipDuration - 0.2),
          themeColor: config.themeColor,
        };
      } else if (bIdx === Math.floor(beats.length / 2)) {
        callout = {
          type: config.midCallout.type,
          line1: config.midCallout.line1,
          line2: config.midCallout.line2,
          startTime: 0.4,
          endTime: Math.min(3.4, clipDuration - 0.2),
          themeColor: config.themeColor,
        };
      }

      // Layout selection
      let layout: SceneLayoutType = 'full_bleed_cinematic';
      let layoutData: SceneLayoutData | undefined = undefined;

      if (bIdx === 0) {
        layout = 'ambient_blur_frame';
        layoutData = {
          title: 'AMERICAN HIDEAWAYS',
          subtitle: config.title.toUpperCase(),
          tag: 'PACOIMA, CA',
        };
      } else if (bIdx % 7 === 0) {
        layout = 'hero_graphic_centerpiece';
        layoutData = {
          title: 'PORTABLE TOILETS',
          subtitle: 'DOCUMENTARY ARCHIVE',
        };
      }

      // Subtle transitions
      const transitions: TransitionType[] = ['crossfade', 'film_burn', 'luma_fade', 'blur_dissolve'];
      const transition = transitions[bIdx % transitions.length]!;

      clips.push({
        id: clipId,
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
        transition,
        transitionDuration: 0.4,
        sfxPath: bIdx === 0 ? SFX.whoosh_cinematic.replace(/\\/g, '/') : (bIdx % 4 === 0 ? SFX.subtle_hit.replace(/\\/g, '/') : undefined),
        sfxVolume: 0.35,
      });
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

    // Save timeline JSON
    const outTimelinePath = path.join(TIMELINES_DIR, `chapter_${numStr}.json`);
    fs.writeFileSync(outTimelinePath, JSON.stringify(timeline, null, 2), 'utf-8');
    console.log(`✅ Saved Timeline: ${path.basename(outTimelinePath)} (${clips.length} beats, all unique raw footage)`);

    // Update chapter in localStore
    const projectChapters = chaptersStore.forProject(PROJECT_ID);
    const targetChapter = projectChapters.find((c) => c.chapterIndex === chNum);
    if (targetChapter) {
      chaptersStore.update(PROJECT_ID, targetChapter.id, {
        status: 'ready_to_render',
        timelineJson: timeline,
      });
      console.log(`✅ Updated chapter in store: ${targetChapter.title} (${targetChapter.id}) -> ready_to_render`);
    } else {
      console.warn(`⚠️ Could not find chapter index ${chNum} in chaptersStore`);
    }
  }

  // Save project media registry for 100% dedupe proof
  fs.writeFileSync(
    REGISTRY_PATH,
    JSON.stringify(
      {
        projectId: PROJECT_ID,
        strictRule: 'NEVER_REPEAT_ANYWHERE',
        lockedCount: usedClipFilenames.size,
        lockedClips: Array.from(usedClipFilenames),
        updatedAt: new Date().toISOString(),
      },
      null,
      2
    ),
    'utf-8'
  );

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🎉 ALL 11 CHAPTER STORYBOARDS STAGED SUCCESSFULLY!`);
  console.log(`🔒 Total Unique Raw Clips Locked: ${usedClipFilenames.size} (0 Repeats Anywhere)`);
  console.log(`📁 Timelines saved to: ${TIMELINES_DIR}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

stageAllPortableToiletsTimelines().catch((err) => {
  console.error('❌ Staging failed:', err);
  process.exit(1);
});
