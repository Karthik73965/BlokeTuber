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

  // AI-generated stock search queries (preserved for audit, regeneration, and dedup)
  stockVideoQuery?: string | null;
  backupVideoQuery?: string | null;
  stockPhotoQuery?: string | null;

  // Effects
  kenBurns: boolean; // apply slow zoom? (always true for images)
  transitionType: 'cut' | 'crossfade';
  transitionDuration: number; // seconds (0 for cut)

  // Overlays
  numberOverlays: NumberOverlay[];

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

  const allWords = alignments.flatMap((s) => s.words || []);
  const totalWords = beats.reduce(
    (sum, b) => sum + Math.max(1, b.text.split(/\s+/).filter(Boolean).length),
    0
  );

  let currentStart = 0;
  let wordSearchCursor = 0;

  return beats.map((beat, i) => {
    const beatWords = beat.text.split(/\s+/).filter(Boolean);
    const wordCount = Math.max(1, beatWords.length);
    let matchedEndTime: number | null = null;

    if (allWords.length > 0 && wordSearchCursor < allWords.length) {
      const cleanBeatWords = beatWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
      const targetEndWord = cleanBeatWords[cleanBeatWords.length - 1];
      const targetSecondEndWord = cleanBeatWords[cleanBeatWords.length - 2];

      if (targetEndWord) {
        const searchLimit = Math.min(allWords.length, wordSearchCursor + wordCount * 3 + 6);
        let bestMatchIdx: number | null = null;

        for (let wIdx = wordSearchCursor; wIdx < searchLimit; wIdx++) {
          const currentWordClean = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (currentWordClean === targetEndWord) {
            bestMatchIdx = wIdx;
          }
        }

        if (bestMatchIdx === null && targetSecondEndWord) {
          for (let wIdx = wordSearchCursor; wIdx < searchLimit; wIdx++) {
            const currentWordClean = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (currentWordClean === targetSecondEndWord) {
              bestMatchIdx = wIdx;
            }
          }
        }

        if (bestMatchIdx !== null) {
          matchedEndTime = allWords[bestMatchIdx]!.end;
          wordSearchCursor = bestMatchIdx + 1;
        }
      }
    }

    const estimatedDuration = (wordCount / totalWords) * totalAudioDuration;
    let endTime: number;

    if (matchedEndTime !== null && matchedEndTime > currentStart + 0.5) {
      endTime = matchedEndTime;
    } else {
      endTime = currentStart + estimatedDuration;
    }

    // Force the last beat to end at the exact total audio duration
    if (i === beats.length - 1 || endTime > totalAudioDuration) {
      endTime = totalAudioDuration;
    }

    // Enforce positive duration
    if (endTime <= currentStart) {
      endTime = Math.min(totalAudioDuration, currentStart + Math.max(1.0, estimatedDuration));
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
  additionalClipPaths?: string[];
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

  const totalDuration =
    chapterTimings[chapterTimings.length - 1]?.end ||
    timedBeats[timedBeats.length - 1]?.endTime ||
    0;

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
      // SYNC CORRECTION: Whisper timestamps lag ~1.5s behind actual vocal onset.
      // We add a 1.8s grace delay so text appears WITH the spoken word, not 2s before.
      const SYNC_CORRECTION = 1.8;
      let startOffset = SYNC_CORRECTION;

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
        // Real Whisper match — use the precise timestamp with a small cognitive lead buffer
        startOffset = Math.max(0.1, foundTs.start - beat.startTime + 0.1);
        // If Whisper is returning very early timestamps (< 0.5s into the clip), apply sync correction
        if (startOffset < 0.5 && clipDuration > 2.0) {
          startOffset = Math.min(startOffset + SYNC_CORRECTION, clipDuration * 0.5);
        }
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
          startOffset = Math.max(SYNC_CORRECTION, Math.min(clipDuration - 0.6, ratio * clipDuration + SYNC_CORRECTION));
        } else if (wordIdx === 0) {
          startOffset = SYNC_CORRECTION;
        } else {
          startOffset = Math.min(clipDuration * 0.5, SYNC_CORRECTION);
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
      layout: (beat as any).layout,
      layoutData: (beat as any).layoutData,
      additionalClipPaths: (beat as any).additionalClipPaths || [],
      // AI-generated stock search queries — preserved for audit, regeneration, and dedup
      stockVideoQuery: beat.stockVideoQuery ?? null,
      backupVideoQuery: beat.backupVideoQuery ?? null,
      stockPhotoQuery: beat.stockPhotoQuery ?? null,
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

