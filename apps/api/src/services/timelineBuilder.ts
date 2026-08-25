import path from 'path';
import { BeatInput, ClipMatch } from './clipMatcher';
import { SegmentAlignment, findPhraseTimestamp } from './whisperAlignment';
import { ChapterTiming } from './audioAssembly';
import type { PlannedBeat } from './aiScriptPlanner';

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

  // Effects
  kenBurns: boolean; // apply slow zoom? (always true for images)
  transitionType: 'cut' | 'crossfade';
  transitionDuration: number; // seconds (0 for cut)

  // Overlays
  numberOverlays: NumberOverlay[];

  // Text callout overlay
  callout?: {
    type: 'lower_third' | 'center_title';
    line1: string;
    line2?: string;
    startTime?: number;
    endTime?: number;
  } | null;
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
}

/**
 * Maps script beats to seamless, non-overlapping audio timestamps
 * so the sum of all beat durations EXACTLY equals totalAudioDuration.
 */
export function mapBeatsToAudioTiming(
  beats: Array<{ text: string; chapterIndex: number; beatIndex: number }>,
  alignments: SegmentAlignment[],
  totalAudioDuration: number
): BeatInput[] {
  if (!beats.length) return [];

  const totalWords = beats.reduce(
    (sum, b) => sum + Math.max(1, b.text.split(/\s+/).filter(Boolean).length),
    0
  );

  let currentStart = 0;

  return beats.map((beat, i) => {
    const wordCount = Math.max(1, beat.text.split(/\s+/).filter(Boolean).length);

    let beatDuration = (wordCount / totalWords) * totalAudioDuration;

    if (
      alignments[i] &&
      alignments[i].end > alignments[i].start &&
      alignments[i].end - alignments[i].start < totalAudioDuration * 0.5
    ) {
      beatDuration = alignments[i].end - alignments[i].start;
    }

    let endTime = currentStart + beatDuration;

    // Force the last beat to end at the exact total audio duration
    if (i === beats.length - 1 || endTime > totalAudioDuration) {
      endTime = totalAudioDuration;
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
}

/**
 * A PlannedBeat with actual audio timestamps resolved from Whisper.
 */
export type TimedPlannedBeat = PlannedBeat & {
  startTime: number;
  endTime: number;
  /** Resolved absolute path on disk (video or image file) */
  resolvedPath: string | null;
};

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

  const totalDuration = chapterTimings[chapterTimings.length - 1]?.end || 0;

  const clips: TimelineClip[] = timedBeats.map((beat, i) => {
    const callout = numberCallouts.find((c) => c.beatIndex === beat.beatIndex);

    // Number overlays — use word-level alignment for precision
    const numberOverlays: NumberOverlay[] = [];
    if (callout && callout.texts.length > 0) {
      for (const text of callout.texts) {
        const phraseTs = findPhraseTimestamp(text, alignments);
        if (phraseTs) {
          numberOverlays.push({
            text,
            startTime: Math.max(0, phraseTs.start - beat.startTime),
            endTime: Math.max(0.5, phraseTs.end - beat.startTime),
            style: 'badge',
          });
        }
      }
    }

    // Resolve exact word-level timing for AI text callouts
    let clipCallout: TimelineClip['callout'] = null;
    const rawCallout = (beat as any).callout;
    if (rawCallout && rawCallout.line1) {
      const clipDuration = Math.max(0.5, beat.endTime - beat.startTime);
      let startOffset = 0.05;
      const phraseTs = findPhraseTimestamp(rawCallout.line1, alignments);
      if (phraseTs && phraseTs.start >= beat.startTime - 0.2 && phraseTs.start <= beat.endTime + 0.2) {
        startOffset = Math.max(0.05, phraseTs.start - beat.startTime);
      }
      const holdDuration = 2.2;
      const endOffset = Math.min(clipDuration - 0.05, Math.max(startOffset + 0.8, startOffset + holdDuration));

      clipCallout = {
        type: rawCallout.type,
        line1: rawCallout.line1,
        line2: rawCallout.line2,
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
      // Images get smooth fluid motion
      kenBurns: isImage,
      transitionType: 'cut',
      transitionDuration: 0,
      numberOverlays,
      callout: clipCallout,
    };
  });

  return {
    masterAudioPath,
    totalDuration,
    clips,
    outputPath,
  };
}

