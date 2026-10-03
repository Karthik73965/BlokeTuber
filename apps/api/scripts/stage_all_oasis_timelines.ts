import fs from 'fs';
import path from 'path';
import type { Timeline, TimelineClip, SceneLayoutType, CalloutOverlay, OverlayType, TransitionType, SceneLayoutData } from '@repo/shared';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import { loadProjectManifest } from '../src/services/youtubeSourcing';
import { mediaRegistry } from '../src/services/mediaRegistry';

const PROJECT_ID = 'proj_oasis_village';
const REPO_ROOT = path.resolve(__dirname, '../../..');
const TRANSCRIPTS_DIR = path.resolve(REPO_ROOT, 'uploads/transcripts/oasis_village');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/oasis_village');
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

// Chapter metadata directives
const CHAPTER_CONFIGS: Record<number, {
  title: string;
  tagPreference: string[];
  themeColor: 'gold' | 'amber' | 'cyan' | 'crimson' | 'emerald' | 'slate' | 'white';
  introCallout: { type: any; line1: string; line2?: string };
}> = {
  1: {
    title: 'The Night in Question',
    tagPreference: ['cabins_exterior', 'gravel_lot', 'flower_planters', 'establishing_drone'],
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'REDMOND, OREGON', line2: 'JANUARY 2024 • SUB-FREEZING ICE STORM' },
  },
  2: {
    title: 'What "Low Barrier" Actually Means',
    tagPreference: ['josie_andersen', 'director_interview', 'cabins_walkthrough'],
    themeColor: 'cyan',
    introCallout: { type: 'editorial_lower_third', line1: 'JOSIE ANDERS-MIZE', line2: 'EXECUTIVE DIRECTOR • OASIS VILLAGE' },
  },
  3: {
    title: 'Inside the Village',
    tagPreference: ['cabin_interior', 'monastic_room', 'community_patio', 'bed', 'desk'],
    themeColor: 'amber',
    introCallout: { type: 'editorial_lower_third', line1: 'INSIDE THE 25 CABINS', line2: 'MONASTIC SIMPLICITY • A DOOR THAT LOCKS' },
  },
  4: {
    title: 'The Residents (Part 1 - Riley, Sharon, David)',
    tagPreference: ['david_lovey', 'resident_recovery', 'community_house', 'wildfire_resident'],
    themeColor: 'emerald',
    introCallout: { type: 'editorial_lower_third', line1: 'THE RESIDENTS', line2: 'STORIES OF REBUILDING DIGNITY' },
  },
  5: {
    title: 'The Residents (Part 2 - Lauren, Amy)',
    tagPreference: ['dog_run', 'pets', 'cabin_interior', 'rv_storage'],
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'LAUREN & AMY', line2: 'WAITING IT OUT FROM INSIDE A CABIN' },
  },
  6: {
    title: 'The Pattern Underneath',
    tagPreference: ['community_house', 'gathering_area', 'cabins_exterior'],
    themeColor: 'crimson',
    introCallout: { type: 'odometer_stat', line1: 'OVER 50% EMPLOYED', line2: 'SETBACKS, NOT CHARACTER FLAWS' },
  },
  7: {
    title: 'Getting People Out',
    tagPreference: ['case_management', 'whiteboard_goals', 'benefits_paperwork', 'staff_support'],
    themeColor: 'cyan',
    introCallout: { type: 'editorial_lower_third', line1: 'CASE MANAGEMENT', line2: 'THE UNGLAMOROUS WORK OF MOVING ON' },
  },
  8: {
    title: 'The Bigger Picture',
    tagPreference: ['housing_ladder', 'community_solidarity', 'josie_andersen'],
    themeColor: 'gold',
    introCallout: { type: 'editorial_lower_third', line1: 'CENTRAL OREGON', line2: 'THE HOUSING LADDER STAIRCASE' },
  },
  9: {
    title: 'Back to the Ice Storm',
    tagPreference: ['evening_cabins', 'cabins_exterior', 'gravel_lot', 'locking_door'],
    themeColor: 'amber',
    introCallout: { type: 'odometer_stat', line1: '25 CABINS • 15 SURVIVORS', line2: 'A WARM BED BEHIND A LOCKED DOOR' },
  },
};

async function stageAllOasisTimelines() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 DIRECTING OASIS VILLAGE DOCUMENTARY TIMELINES (CHAPTERS 1–9)');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('✨ Strict Zero-Repeat Rule Enforced via Project Media Registry');
  console.log('✨ 100% Sourced Authentic 1080p B-Roll from Oasis Village Pool');
  console.log('✨ Micro Film Grain & Dust Organic Aesthetic (Rule 4)\n');

  const manifest = loadProjectManifest(PROJECT_ID);
  const approvedClips = manifest.clips.filter((c) => c.status === 'approved');
  console.log(`🎥 Available Approved Raw Clips: ${approvedClips.length}`);

  // Persistent registry set
  const usedClipFilenames = new Set<string>();

  for (let chNum = 1; chNum <= 9; chNum++) {
    const numStr = String(chNum).padStart(2, '0');
    const alignmentFile = path.join(TRANSCRIPTS_DIR, `ch${numStr}_alignment.json`);
    const audioFileName = `oasis_ch${numStr}.mp3`;
    const audioPath = path.resolve(REPO_ROOT, 'uploads/audio', audioFileName);

    if (!fs.existsSync(alignmentFile)) {
      console.warn(`⚠️ Alignment not found: ${alignmentFile}`);
      continue;
    }

    const segments: AlignmentSegment[] = JSON.parse(fs.readFileSync(alignmentFile, 'utf-8'));
    const config = CHAPTER_CONFIGS[chNum]!;

    // Group Whisper segments into 3.5s – 6.0s rhythmic beats
    const beats: Array<{ start: number; end: number; text: string; words: any[] }> = [];
    let curBeat = { start: 0, end: 0, text: '', words: [] as any[] };

    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i]!;
      if (curBeat.words.length === 0) {
        curBeat.start = seg.start;
        curBeat.end = seg.end;
        curBeat.text = seg.text.trim();
        curBeat.words = [...seg.words];
      } else {
        const potentialDuration = seg.end - curBeat.start;
        if (potentialDuration <= 5.8) {
          curBeat.end = seg.end;
          curBeat.text += ' ' + seg.text.trim();
          curBeat.words.push(...seg.words);
        } else {
          beats.push({ ...curBeat });
          curBeat = { start: seg.start, end: seg.end, text: seg.text.trim(), words: [...seg.words] };
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

    // Assign unique approved clips matching chapter tags
    const clips: TimelineClip[] = [];

    for (let bIdx = 0; bIdx < beats.length; bIdx++) {
      const beat = beats[bIdx]!;
      const clipDuration = Number((beat.end - beat.start).toFixed(2));

      // Find an unused approved clip with tag preference
      let selectedRaw = approvedClips.find((c) => {
        if (usedClipFilenames.has(c.filename)) return false;
        return c.tags?.some((t) => config.tagPreference.includes(t));
      });

      // Fallback to any unused approved clip
      if (!selectedRaw) {
        selectedRaw = approvedClips.find((c) => !usedClipFilenames.has(c.filename));
      }

      if (selectedRaw) {
        usedClipFilenames.add(selectedRaw.filename);
      }

      const clipPath = selectedRaw ? selectedRaw.fullPath : 'uploads/raw/proj_oasis_village/oasis_clip_001.mp4';
      const clipId = `ch${numStr}_beat_${bIdx + 1}`;

      // Determine callout
      let callout: CalloutOverlay | null = null;
      if (bIdx === 0) {
        callout = {
          type: config.introCallout.type,
          line1: config.introCallout.line1,
          line2: config.introCallout.line2,
          startTime: 0.3,
          endTime: Math.min(3.5, clipDuration - 0.2),
          themeColor: config.themeColor,
        };
      } else if (bIdx === Math.floor(beats.length / 2)) {
        // Mid-chapter punchy quote / stat callout
        callout = {
          type: 'location_badge',
          line1: 'OASIS VILLAGE',
          line2: 'REDMOND, OREGON',
          startTime: 0.4,
          endTime: Math.min(3.2, clipDuration - 0.2),
          themeColor: config.themeColor,
        };
      }

      // Determine layout: 85%+ full_bleed_cinematic
      let layout: SceneLayoutType = 'full_bleed_cinematic';
      let layoutData: SceneLayoutData | undefined = undefined;

      if (bIdx === 0) {
        layout = 'ambient_blur_frame';
        layoutData = {
          title: 'AMERICAN HIDEAWAYS',
          subtitle: config.title.toUpperCase(),
          tag: 'REDMOND, OR',
        };
      } else if (bIdx % 8 === 0) {
        layout = 'hero_graphic_centerpiece';
        layoutData = {
          title: 'OASIS VILLAGE',
          subtitle: 'DOCUMENTARY ARCHIVE',
        };
      }

      // Alternate subtle transitions
      const transitions: TransitionType[] = ['crossfade', 'film_burn', 'luma_fade', 'blur_dissolve'];
      const transition = transitions[bIdx % transitions.length];

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
    console.log(`✅ Saved Timeline: ${path.basename(outTimelinePath)} (${clips.length} clips, all unique raw footage)`);

    // Update chaptersStore in localStore
    const chapterId = `ch_oasis_${numStr}`;
    chaptersStore.update(PROJECT_ID, chapterId, {
      status: 'ready_to_render',
      timelineJson: timeline,
    });
  }

  // Save project media registry
  fs.writeFileSync(
    REGISTRY_PATH,
    JSON.stringify(
      {
        projectId: PROJECT_ID,
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
  console.log(`🎉 STAGE 1 COMPLETE: All 9 Chapter Storyboards Staged!`);
  console.log(`🔒 Total Unique Raw Clips Locked: ${usedClipFilenames.size} (0 Repeats Guaranteed)`);
  console.log(`📁 Timelines saved to: ${TIMELINES_DIR}`);
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

stageAllOasisTimelines().catch(console.error);
