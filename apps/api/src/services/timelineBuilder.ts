import path from 'path';
import { BeatInput, ClipMatch } from './clipMatcher';
import { SegmentAlignment, findPhraseTimestamp } from './whisperAlignment';
import { ChapterTiming } from './audioAssembly';
import type { PlannedBeat } from './aiScriptPlanner';
import type { OverlayType, TransitionType } from '@repo/shared';

export interface TimelineClip {
  beatIndex: number;
  chapterIndex: number;
  text: string;

  // Timing
  startTime: number; // seconds in master timeline
  endTime: number;

  // Media type — determines render treatment
  mediaType: 'video' | 'image'; // image = Ken Burns still photo

  // Video source
  clipPath: string | null; // local clip path (video or image file)
  stockSource?: string;
  stockUrl?: string;

  // AI-generated stock search queries (preserved for audit, regeneration, and dedup)
  stockVideoQuery?: string | null;
  backupVideoQuery?: string | null;
  stockPhotoQuery?: string | null;

  // Effects
  kenBurns: boolean; // apply slow zoom? (always true for images)
  transitionType?: TransitionType;
  transitionDuration: number; // seconds (0 for cut)

  // Overlays
  numberOverlays: NumberOverlay[];
  overlay?: OverlayType | OverlayType[];

  // Text callout overlay
  callout?: {
    type:
      | 'stat_callout'
      | 'lower_third'
      | 'location_badge'
      | 'evidence_tag'
      | 'quote_card'
      | 'chapter_header'
      | 'highlight_pill'
      | 'split_title'
      | 'ticker_bar'
      | 'corner_tag'
      | 'full_screen_title'
      | 'breaking_news'
      | 'center_title';
    line1: string;
    line2?: string;
    spokenTrigger?: string;
    themeColor?: 'gold' | 'amber' | 'cyan' | 'crimson' | 'emerald' | 'slate' | 'white';
    startTime?: number;
    endTime?: number;
  } | null;
  hideWatermark?: boolean;
  watermarkCrop?: { scale?: number; translateY?: number; translateX?: number };
}

export interface NumberOverlay {
  text: string;
  startTime: number; // seconds relative to start of this clip
  endTime: number;
  style: 'badge' | 'lower-third';
}

export interface Timeline {
  masterAudioPath: string;
  totalDuration: number; // seconds
  clips: TimelineClip[];
  outputPath: string;
  globalOverlays?: OverlayType[];
}

export const BANNED_LAYOUTS = new Set<string>([
  'vintage_crt_monitor',        // L03
  'editorial_sidebar_column',   // L04
  'museum_archive_matte',       // L07
  'desktop_corkboard',          // L08
  'illuminated_lightbox',       // L10
  'magnifying_loupe_inspector', // L12
  'quad_surveillance_matrix',   // L15
  'horizon_top_bottom_split',   // L16
]);

export const BANNED_CALLOUT_TYPES = new Set<string>([
  'map_pingeotag',          // C04
  'location_badge',         // legacy C04
  'editorial_quote',        // C05
  'quote_card',             // legacy C05
  'court_transcript_card',  // C07
  'wiretap_intercept',      // C08
  'polaroid_snapshot',      // C11
  'marker_circle',          // C13
  'archival_evidence_tag',  // C14
  'corner_tag',             // legacy C14
  'split_milestone_card',   // C18
  'split_title',            // legacy C18
]);

/**
 * Maps script beats to seamless, non-overlapping audio timestamps
 * so the sum of all beat durations EXACTLY equals totalAudioDuration.
 */
function findBeatEndWordIndex(
  beatText: string,
  allWords: Array<{ word: string; start: number; end: number }>,
  wordSearchCursor: number,
  expectedWordCount: number
): { matchIndex: number; endTime: number } | null {
  if (!allWords.length || wordSearchCursor >= allWords.length) return null;

  const beatWords = beatText.split(/\s+/).filter(Boolean);
  const cleanBeatWords = beatWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
  if (!cleanBeatWords.length) return null;

  const searchWindow = Math.min(allWords.length, wordSearchCursor + expectedWordCount * 2 + 8);

  if (cleanBeatWords.length >= 2) {
    const endPhrase = [
      cleanBeatWords[cleanBeatWords.length - 2],
      cleanBeatWords[cleanBeatWords.length - 1],
    ];

    for (let wIdx = wordSearchCursor; wIdx < searchWindow - 1; wIdx++) {
      const w1 = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
      const w2 = allWords[wIdx + 1]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (w1 === endPhrase[0] && w2 === endPhrase[1]) {
        return { matchIndex: wIdx + 1, endTime: allWords[wIdx + 1]!.end };
      }
    }
  }

  const stopWords = new Set(['a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'and', 'or', 'is', 'was', 'it', 'its']);
  for (let i = cleanBeatWords.length - 1; i >= Math.max(0, cleanBeatWords.length - 3); i--) {
    const candidate = cleanBeatWords[i]!;
    if (candidate.length > 2 && !stopWords.has(candidate)) {
      for (let wIdx = wordSearchCursor; wIdx < searchWindow; wIdx++) {
        const w = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (w === candidate) {
          const offset = cleanBeatWords.length - 1 - i;
          const matchedIdx = Math.min(allWords.length - 1, wIdx + offset);
          return { matchIndex: matchedIdx, endTime: allWords[matchedIdx]!.end };
        }
      }
    }
  }

  const lastWord = cleanBeatWords[cleanBeatWords.length - 1]!;
  for (let wIdx = wordSearchCursor; wIdx < searchWindow; wIdx++) {
    const w = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (w === lastWord) {
      return { matchIndex: wIdx, endTime: allWords[wIdx]!.end };
    }
  }

  return null;
}

/**
 * Maps script beats to seamless, non-overlapping audio timestamps (3.0s – 6.0s per beat)
 * so the sum of all beat durations EXACTLY equals totalAudioDuration.
 */
export function mapBeatsToAudioTiming(
  beats: Array<{ text: string; chapterIndex: number; beatIndex: number }>,
  alignments: SegmentAlignment[],
  totalAudioDuration: number
): BeatInput[] {
  if (!beats.length) return [];

  const allWords = alignments.flatMap((s) => s.words || []);
  const totalWords = beats.reduce(
    (sum, b) => sum + Math.max(1, b.text.split(/\s+/).filter(Boolean).length),
    0
  );

  let currentStart = 0;
  let wordSearchCursor = 0;

  const rawTimed = beats.map((beat, i) => {
    const beatWords = beat.text.split(/\s+/).filter(Boolean);
    const wordCount = Math.max(1, beatWords.length);
    let matchedEndTime: number | null = null;

    const match = findBeatEndWordIndex(beat.text, allWords, wordSearchCursor, wordCount);
    if (match) {
      matchedEndTime = match.endTime;
      wordSearchCursor = match.matchIndex + 1;
    } else {
      wordSearchCursor = Math.min(allWords.length, wordSearchCursor + wordCount);
    }

    const estimatedDuration = (wordCount / totalWords) * totalAudioDuration;
    let endTime: number;

    if (matchedEndTime !== null && matchedEndTime > currentStart + 1.0) {
      endTime = matchedEndTime;
    } else {
      endTime = currentStart + estimatedDuration;
    }

    if (i === beats.length - 1 || endTime > totalAudioDuration) {
      endTime = totalAudioDuration;
    }

    if (endTime <= currentStart) {
      endTime = Math.min(totalAudioDuration, currentStart + Math.max(1.5, estimatedDuration));
    }

    const timedBeat: BeatInput = {
      text: beat.text,
      startTime: Number(currentStart.toFixed(3)),
      endTime: Number(endTime.toFixed(3)),
      chapterIndex: beat.chapterIndex,
      beatIndex: beat.beatIndex,
    };

    currentStart = endTime;
    return timedBeat;
  });

  // Consolidate beats < 3.0s
  const merged: BeatInput[] = [];
  for (let i = 0; i < rawTimed.length; i++) {
    const curr = { ...rawTimed[i]! };
    while ((curr.endTime - curr.startTime) < 3.0 && i + 1 < rawTimed.length) {
      const next = rawTimed[i + 1]!;
      curr.text = `${curr.text} ${next.text}`.trim();
      curr.endTime = next.endTime;
      i++;
    }
    merged.push(curr);
  }

  if (merged.length > 1 && (merged[merged.length - 1]!.endTime - merged[merged.length - 1]!.startTime) < 3.0) {
    const last = merged.pop()!;
    const prev = merged[merged.length - 1]!;
    prev.text = `${prev.text} ${last.text}`.trim();
    prev.endTime = last.endTime;
  }

  // Ensure hard cap of 6.0s
  const finalBeats: BeatInput[] = [];
  for (const b of merged) {
    const dur = b.endTime - b.startTime;
    if (dur > 6.0) {
      const numCuts = Math.max(2, Math.round(dur / 4.5));
      const eachDur = dur / numCuts;
      const beatWords = b.text.split(/\s+/).filter(Boolean);
      const wordsPerCut = Math.max(1, Math.ceil(beatWords.length / numCuts));
      let subStart = b.startTime;

      for (let c = 0; c < numCuts; c++) {
        const subEnd = c === numCuts - 1 ? b.endTime : Number((subStart + eachDur).toFixed(3));
        finalBeats.push({
          chapterIndex: b.chapterIndex,
          beatIndex: finalBeats.length,
          text: beatWords.slice(c * wordsPerCut, (c + 1) * wordsPerCut).join(' ') || b.text,
          startTime: subStart,
          endTime: subEnd,
        });
        subStart = subEnd;
      }
    } else {
      finalBeats.push({
        ...b,
        beatIndex: finalBeats.length,
      });
    }
  }

  return finalBeats;
}

/**
 * A PlannedBeat with actual audio timestamps resolved from Whisper.
 */
export type TimedPlannedBeat = PlannedBeat & {
  startTime: number;
  endTime: number;
  /** Resolved absolute path on disk (video or image file) */
  resolvedPath: string | null;
  additionalClipPaths?: string[];
};

/**
 * Resolves an intelligent visual atmosphere overlay for a beat:
 * 1. AI-assigned overlay if provided
 * 2. Contextual rule based on layout & callout type
 * 3. Atmospheric rotation every few beats so the video has dynamic visual depth
 */
export function resolveOverlayForBeat(beat: TimedPlannedBeat, index: number): OverlayType | undefined {
  if ((beat as any).overlay) {
    return (beat as any).overlay;
  }

  const layout = (beat as any).layout;
  const calloutType = beat.callout?.type;

  if (
    layout === 'polaroid_scatter_desk' ||
    layout === 'filmstrip_spool_reel'
  ) {
    return 'film_dust_scratches';
  }
  if (
    layout === 'open_case_binder' ||
    calloutType === 'newspaper_headline' ||
    calloutType === 'redacted_dossier' ||
    calloutType === 'typewriter_paper'
  ) {
    return 'archival_halftone_paper';
  }
  if (calloutType === 'odometer_stat') {
    return 'film_burn_light_leak';
  }

  // Periodic subtle atmosphere
  if (index % 5 === 1) return 'film_dust_scratches';
  if (index % 5 === 3) return 'star_sparkle_bokeh';

  return undefined;
}

/**
 * Resolves an intelligent documentary transition for a beat:
 * 1. AI-assigned transition if provided
 * 2. Elegant fade-in from black on beat 0
 * 3. Contextual transition matching layout/callout
 * 4. Rhythmic rotation so cuts are punchy & dynamic
 */
export function resolveTransitionForBeat(beat: TimedPlannedBeat, index: number): TransitionType {
  if ((beat as any).transition) {
    return (beat as any).transition;
  }

  if (index === 0) {
    return 'film_dip_black';
  }

  const layout = (beat as any).layout;
  const calloutType = beat.callout?.type;

  if (calloutType === 'odometer_stat') {
    return 'zoom_punch';
  }
  if (calloutType === 'newspaper_headline' || layout === 'polaroid_scatter_desk') {
    return 'shutter_flash';
  }
  if (layout === 'split_dual_screen') {
    return index % 2 === 0 ? 'whip_pan_left' : 'whip_pan_right';
  }

  // Dynamic rhythmic variety across cuts
  const mod = index % 6;
  if (mod === 1) return 'shutter_flash';
  if (mod === 3) return 'film_burn';
  if (mod === 5) return 'crossfade';

  return 'cut';
}

/**
 * Build the final timeline JSON from all AI-planned, timed, and resolved beats.
 */
export function buildTimeline(params: {
  masterAudioPath: string;
  outputPath: string;
  timedBeats: TimedPlannedBeat[];
  alignments: SegmentAlignment[];
  chapterTimings: ChapterTiming[];
  numberCallouts: Array<{ beatIndex: number; texts: string[] }>;
}): Timeline {
  const {
    masterAudioPath,
    outputPath,
    timedBeats,
    alignments,
    chapterTimings,
    numberCallouts,
  } = params;

  const totalDuration =
    chapterTimings[chapterTimings.length - 1]?.end ||
    timedBeats[timedBeats.length - 1]?.endTime ||
    0;

  const clips: TimelineClip[] = timedBeats.map((beat, i) => {
    const callout = numberCallouts.find((c) => c.beatIndex === beat.beatIndex);

    // Enforce: Beat 0 (video intro) MUST always have a callout.
    // If the AI planner didn't assign one, inject a default subject-profile intro callout.
    const rawBeat = beat as any;
    if (i === 0 && (!rawBeat.callout || !rawBeat.callout.line1)) {
      // Extract a punchy title from the first line of narration text
      const firstWords = beat.text.split(/\s+/).slice(0, 5).join(' ').replace(/[.,!?;:]+$/, '');
      rawBeat.callout = {
        type: 'editorial_lower_third',
        line1: firstWords.toUpperCase(),
        line2: null,
        spokenTrigger: beat.text.split(/\s+/).slice(0, 3).join(' '),
        themeColor: 'gold',
      };
    }

    // Number overlays — Spoken number badges completely disabled per user directive
    const numberOverlays: NumberOverlay[] = [];

    // Resolve exact word-level timing for AI text callouts
    let clipCallout: TimelineClip['callout'] = null;
    const rawCallout = (beat as any).callout;
    if (rawCallout && rawCallout.line1 && !BANNED_CALLOUT_TYPES.has(rawCallout.type)) {
      const clipDuration = Math.max(0.5, beat.endTime - beat.startTime);
      let startOffset = 0.1; // default: appear almost immediately at clip start

      // 1. Check spokenTrigger first, then line1, line2
      const searchPhrases: string[] = [
        rawCallout.spokenTrigger,
        rawCallout.line1,
        rawCallout.line2,
      ].filter((p): p is string => typeof p === 'string' && p.trim().length > 0);

      let foundTs: { start: number; end: number } | null = null;
      for (const phrase of searchPhrases) {
        foundTs = findPhraseTimestamp(phrase, alignments);
        if (foundTs && foundTs.start >= beat.startTime - 0.3 && foundTs.start <= beat.endTime + 0.3) {
          break;
        }
      }

      if (foundTs && foundTs.start >= beat.startTime - 0.3 && foundTs.start <= beat.endTime + 0.3) {
        // Real Whisper match — callout appears right as the word is spoken (0.1s cognitive lead)
        startOffset = Math.max(0.05, foundTs.start - beat.startTime - 0.1);
      } else {
        // 2. Word-ratio fallback: calculate relative word position of trigger inside beat text
        const beatWords = beat.text.toLowerCase().replace(/[^a-z0-9 ]/g, '').split(/\s+/).filter(Boolean);
        const trigger = (rawCallout.spokenTrigger || rawCallout.line1 || '').toLowerCase().replace(/[^a-z0-9 ]/g, '');
        const triggerWords = trigger.split(/\s+/).filter(Boolean);

        let wordIdx = -1;
        if (triggerWords.length > 0 && beatWords.length > 0) {
          wordIdx = beatWords.findIndex((w) => triggerWords.some((tw: string) => w.includes(tw) || tw.includes(w)));
        }

        if (wordIdx > 0 && beatWords.length > 1) {
          const ratio = wordIdx / beatWords.length;
          startOffset = Math.max(0.1, Math.min(clipDuration - 0.6, ratio * clipDuration));
        } else {
          // No match at all — appear at 20% into clip as safe default
          startOffset = Math.min(clipDuration * 0.2, 0.5);
        }
      }

      // Clamp to clip bounds — never start after 75% of clip
      startOffset = Math.min(startOffset, clipDuration * 0.75);
      // Let the callout hold for the full duration of the clip until right before the scene cut
      const holdDuration = Math.max(2.8, clipDuration - startOffset - 0.3);
      const endOffset = Math.min(clipDuration - 0.1, startOffset + holdDuration);

      clipCallout = {
        type: rawCallout.type,
        line1: rawCallout.line1,
        line2: rawCallout.line2,
        spokenTrigger: rawCallout.spokenTrigger,
        themeColor: rawCallout.themeColor || 'gold',
        startTime: Number(startOffset.toFixed(2)),
        endTime: Number(endOffset.toFixed(2)),
      };
    }

    const isImage = beat.mediaType === 'image';

    return {
      beatIndex: beat.beatIndex,
      chapterIndex: beat.chapterIndex,
      text: beat.text,
      startTime: beat.startTime,
      endTime: beat.endTime,
      mediaType: beat.mediaType,
      clipPath: beat.resolvedPath,
      layout: BANNED_LAYOUTS.has((beat as any).layout) ? 'full_bleed_cinematic' : ((beat as any).layout || 'full_bleed_cinematic'),
      layoutData: BANNED_LAYOUTS.has((beat as any).layout) ? undefined : (beat as any).layoutData,
      additionalClipPaths: (beat as any).additionalClipPaths || [],
      // AI-generated stock search queries — preserved for audit, regeneration, and dedup
      stockVideoQuery: beat.stockVideoQuery ?? null,
      backupVideoQuery: beat.backupVideoQuery ?? null,
      stockPhotoQuery: beat.stockPhotoQuery ?? null,
      // Images get smooth fluid motion
      kenBurns: isImage,
      transitionType: resolveTransitionForBeat(beat, i),
      transitionDuration: 0.2,
      overlay: resolveOverlayForBeat(beat, i),
      numberOverlays,
      callout: clipCallout,
      hideWatermark: Boolean((beat as any).hideWatermark || (beat as any).cropWatermark),
      watermarkCrop: (beat as any).watermarkCrop,
    };
  });

  return {
    masterAudioPath,
    totalDuration,
    clips,
    outputPath,
    globalOverlays: ['cinematic_vignette', 'micro_film_grain'],
  };
}

