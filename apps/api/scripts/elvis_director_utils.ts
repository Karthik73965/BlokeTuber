import fs from 'fs';
import path from 'path';

export const RAW_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\ELVIS\\RAW';
export const AUD_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\ELVIS\\AUD';

export interface RawAssetInfo {
  filename: string;
  fullPath: string;
  type: 'video' | 'image';
  duration: number;
  category: 'ENCAMPMENT_STREET' | 'RAVEN_IRENE_SMOKEY' | 'ELVIS_CONSTRUCTION_BUILD' | 'ANDY_BALES_MISSION' | 'CITY_SEIZURE_POLICE' | 'MAP_GEOGRAPHY';
  tags: string[];
}

export const ELVIS_ASSETS: RawAssetInfo[] = [
  // ENCAMPMENT & STREET (7)
  {
    filename: 'Tents in the sidewalk.mp4',
    fullPath: path.join(RAW_DIR, 'Tents in the sidewalk.mp4'),
    type: 'video',
    duration: 8.8,
    category: 'ENCAMPMENT_STREET',
    tags: ['tents', 'sidewalk', 'street', 'encampment', 'homelessness', 'unhoused', 'skid row', 'urban poverty', 'outside'],
  },
  {
    filename: 'A tent where woman is living.mp4',
    fullPath: path.join(RAW_DIR, 'A tent where woman is living.mp4'),
    type: 'video',
    duration: 3.0,
    category: 'ENCAMPMENT_STREET',
    tags: ['tent', 'woman', 'living rough', 'tarp', 'sleeping', 'shelter', 'street'],
  },
  {
    filename: 'inside the tent.mp4',
    fullPath: path.join(RAW_DIR, 'inside the tent.mp4'),
    type: 'video',
    duration: 4.2,
    category: 'ENCAMPMENT_STREET',
    tags: ['inside tent', 'interior', 'belongings', 'blanket', 'sleeping bag', 'cramped', 'harsh conditions'],
  },
  {
    filename: 'woman entering into the tent.mp4',
    fullPath: path.join(RAW_DIR, 'woman entering into the tent.mp4'),
    type: 'video',
    duration: 8.8,
    category: 'ENCAMPMENT_STREET',
    tags: ['woman entering tent', 'crawling', 'unhoused', 'night', 'cold', 'tent door'],
  },
  {
    filename: 'woman sittin inside the tent.mp4',
    fullPath: path.join(RAW_DIR, 'woman sittin inside the tent.mp4'),
    type: 'video',
    duration: 21.7,
    category: 'ENCAMPMENT_STREET',
    tags: ['woman sitting inside tent', 'waiting', 'sorrow', 'isolation', 'poverty', 'dirt'],
  },
  {
    filename: 'TENT.mp4',
    fullPath: path.join(RAW_DIR, 'TENT.mp4'),
    type: 'video',
    duration: 3.0,
    category: 'ENCAMPMENT_STREET',
    tags: ['tent', 'closeup', 'fabric', 'street corner', 'encampment'],
  },
  {
    filename: 'Tents.mp4',
    fullPath: path.join(RAW_DIR, 'Tents.mp4'),
    type: 'video',
    duration: 3.0,
    category: 'ENCAMPMENT_STREET',
    tags: ['tents row', 'sidewalk encampment', 'los angeles', 'tarp line'],
  },

  // RAVEN / IRENE / SMOKEY (5)
  {
    filename: 'OLD WOMAN HAPPY AFTER SEEING HIS TINY HOME.mp4',
    fullPath: path.join(RAW_DIR, 'OLD WOMAN HAPPY AFTER SEEING HIS TINY HOME.mp4'),
    type: 'video',
    duration: 6.1,
    category: 'RAVEN_IRENE_SMOKEY',
    tags: ['raven', 'smokey', 'old woman happy', 'smiling', 'relief', 'joy', 'first look', 'tiny home'],
  },
  {
    filename: 'old woman talking.mp4',
    fullPath: path.join(RAW_DIR, 'old woman talking.mp4'),
    type: 'video',
    duration: 11.9,
    category: 'RAVEN_IRENE_SMOKEY',
    tags: ['old woman talking', 'interview', 'voice', 'speaking', 'raven', 'smokey', 'testimony', 'story'],
  },
  {
    filename: 'woman thanking elvis.mp4',
    fullPath: path.join(RAW_DIR, 'woman thanking elvis.mp4'),
    type: 'video',
    duration: 4.5,
    category: 'RAVEN_IRENE_SMOKEY',
    tags: ['thanking elvis', 'gratitude', 'handshake', 'hug', 'emotional', 'tears', 'connection'],
  },
  {
    filename: 'OLD WOMAN.mp4',
    fullPath: path.join(RAW_DIR, 'OLD WOMAN.mp4'),
    type: 'video',
    duration: 4.4,
    category: 'RAVEN_IRENE_SMOKEY',
    tags: ['old woman portrait', 'face', 'eyes', '60-year-old grandmother', 'smokey', 'weathered'],
  },
  {
    filename: 'Elvis talking to a woman .mp4',
    fullPath: path.join(RAW_DIR, 'Elvis talking to a woman .mp4'),
    type: 'video',
    duration: 7.8,
    category: 'RAVEN_IRENE_SMOKEY',
    tags: ['elvis talking to woman', 'conversation', 'listening', 'empathy', 'street discussion'],
  },

  // ELVIS & CONSTRUCTION / TINY HOMES (10)
  {
    filename: 'elvis buiding house .mp4',
    fullPath: path.join(RAW_DIR, 'elvis buiding house .mp4'),
    type: 'video',
    duration: 6.6,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['elvis building house', 'construction', 'wood framing', 'hammer', 'drill', 'hands-on', 'hardware store'],
  },
  {
    filename: 'Elvis wallkig to but=ld house .mp4',
    fullPath: path.join(RAW_DIR, 'Elvis wallkig to but=ld house .mp4'),
    type: 'video',
    duration: 10.8,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['elvis walking to build', 'carrying wood', 'sidewalk workshop', 'determined', 'tools'],
  },
  {
    filename: 'Elvis elevation.mp4',
    fullPath: path.join(RAW_DIR, 'Elvis elevation.mp4'),
    type: 'video',
    duration: 7.8,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['elvis elevation', 'camera pan', 'low angle', 'hero shot', 'activist', 'portrait'],
  },
  {
    filename: 'Elvis glimpse.mp4',
    fullPath: path.join(RAW_DIR, 'Elvis glimpse.mp4'),
    type: 'video',
    duration: 7.3,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['elvis glimpse', 'working', 'headband', 'profile', 'sweat', 'focus'],
  },
  {
    filename: 'ELVIS PHOTO.mp4',
    fullPath: path.join(RAW_DIR, 'ELVIS PHOTO.mp4'),
    type: 'video',
    duration: 7.0,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['elvis photo', 'portrait', 'still frame', 'hero shot', 'elvis summers'],
  },
  {
    filename: 'elvis showing house .mp4',
    fullPath: path.join(RAW_DIR, 'elvis showing house .mp4'),
    type: 'video',
    duration: 6.5,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['elvis showing house', 'tour', 'opening door', 'demonstrating', 'completed tiny home', 'pride'],
  },
  {
    filename: 'Tinu Hose build by ELVIS.mp4',
    fullPath: path.join(RAW_DIR, 'Tinu Hose build by ELVIS.mp4'),
    type: 'video',
    duration: 3.0,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['tiny house exterior', 'wheels', 'painted siding', 'roof', 'window', 'finished build'],
  },
  {
    filename: 'Person walkng around houses build by elvis .mp4',
    fullPath: path.join(RAW_DIR, 'Person walkng around houses build by elvis .mp4'),
    type: 'video',
    duration: 13.4,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['walking around houses', 'row of tiny homes', 'community', 'sidewalk village', 'inspection'],
  },
  {
    filename: 'Door of tiny home.png',
    fullPath: path.join(RAW_DIR, 'Door of tiny home.png'),
    type: 'image',
    duration: 0,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['door of tiny home', 'deadbolt lock', 'brass key', 'handle', 'security', 'home sweet home sign'],
  },
  {
    filename: 'Wide lense view of TIny home.png',
    fullPath: path.join(RAW_DIR, 'Wide lense view of TIny home.png'),
    type: 'image',
    duration: 0,
    category: 'ELVIS_CONSTRUCTION_BUILD',
    tags: ['wide lens tiny home', 'architecture', 'dimensions', '8x3.5 ft', 'compact shelter', 'wheels'],
  },

  // CITY SEIZURE & POLICE (2)
  {
    filename: 'WOMAN POLICE.mp4',
    fullPath: path.join(RAW_DIR, 'WOMAN POLICE.mp4'),
    type: 'video',
    duration: 8.4,
    category: 'CITY_SEIZURE_POLICE',
    tags: ['police', 'lapd officer', 'enforcement', 'city official', 'crackdown', 'warning', 'municipal code'],
  },
  {
    filename: 'poeple cleaning.mp4',
    fullPath: path.join(RAW_DIR, 'poeple cleaning.mp4'),
    type: 'video',
    duration: 5.6,
    category: 'CITY_SEIZURE_POLICE',
    tags: ['people cleaning', 'bureau of sanitation', 'seizing homes', 'flatbed truck', 'clearing street', 'confiscation'],
  },

  // ANDY BALES / UNION RESCUE MISSION (2)
  {
    filename: 'Person named ANdy BALES.mp4',
    fullPath: path.join(RAW_DIR, 'Person named ANdy BALES.mp4'),
    type: 'video',
    duration: 3.0,
    category: 'ANDY_BALES_MISSION',
    tags: ['andy bales', 'union rescue mission', 'ceo', 'advocate', 'portrait', 'pastor', 'skid row leader'],
  },
  {
    filename: 'andy talking to homeless perople.mp4',
    fullPath: path.join(RAW_DIR, 'andy talking to homeless perople.mp4'),
    type: 'video',
    duration: 4.4,
    category: 'ANDY_BALES_MISSION',
    tags: ['andy talking to homeless', 'outreach', 'compassion', 'listening', 'parking lot offer', 'support'],
  },

  // MAP & GEOGRAPHY (1)
  {
    filename: 'SHowing LOS ANGELS IN MAP.mp4',
    fullPath: path.join(RAW_DIR, 'SHowing LOS ANGELS IN MAP.mp4'),
    type: 'video',
    duration: 7.8,
    category: 'MAP_GEOGRAPHY',
    tags: ['los angeles map', 'satellite view', 'south la', 'california', 'location zoom', 'geography'],
  },
];

export interface WordItem {
  word: string;
  start: number;
  end: number;
}

export interface SegmentItem {
  text: string;
  start: number;
  end: number;
  words: WordItem[];
}

export interface SentenceLockedBeat {
  beatIndex: number;
  chapterIndex: number;
  text: string;
  startTime: number;
  endTime: number;
  duration: number; // Strictly >= 3.5 and < 5.5
}

/**
 * Builds sentence-locked beats strictly between minDur (3.5s) and maxDur (5.4s).
 * Every beat boundary is anchored to exact Whisper word timestamps and is contiguous.
 */
export function buildSentenceLockedBeats(
  segments: SegmentItem[],
  totalAudioDuration: number,
  minDur = 3.5,
  maxDur = 5.40
): SentenceLockedBeat[] {
  // Collect all words in chronological order
  const allWords: WordItem[] = [];
  for (const s of segments) {
    if (s.words && s.words.length > 0) {
      allWords.push(...s.words);
    } else {
      // Fallback if segment has no word array
      allWords.push({ word: s.text, start: s.start, end: s.end });
    }
  }

  if (allWords.length === 0) {
    return [];
  }

  const N = allWords.length;

  const getCutTime = (idx: number) => {
    if (idx <= 0) return 0.0;
    if (idx >= N) return totalAudioDuration;
    return allWords[idx - 1]!.end;
  };

  // DP table: dp[i] = best transition to reach word index i (where beat ends at word i - 1)
  const dp: Array<{ cost: number; prev: number } | null> = new Array(N + 1).fill(null);
  dp[0] = { cost: 0, prev: -1 };

  for (let i = 1; i <= N; i++) {
    let bestPrev = -1;
    let bestCost = Infinity;

    const endTime = getCutTime(i);

    for (let j = i - 1; j >= 0; j--) {
      const startTime = getCutTime(j);
      const dur = Math.round((endTime - startTime) * 100) / 100;

      if (dur < minDur) {
        continue;
      }
      if (dur > maxDur) {
        break;
      }

      if (dp[j] === null) continue;

      const lastWord = allWords[i - 1]!.word.trim();
      let punctuationBonus = 0;
      if (/[.!?]$/.test(lastWord)) {
        punctuationBonus = -1000;
      } else if (/[,;—–:-]$/.test(lastWord)) {
        punctuationBonus = -400;
      }

      // Penalty for deviating from target ~4.3s
      const devPenalty = Math.pow(dur - 4.3, 2) * 40;
      const totalCost = dp[j]!.cost + punctuationBonus + devPenalty;

      if (totalCost < bestCost) {
        bestCost = totalCost;
        bestPrev = j;
      }
    }

    if (bestPrev !== -1) {
      dp[i] = { cost: bestCost, prev: bestPrev };
    }
  }

  // If DP found a valid path
  if (dp[N]) {
    const cuts: number[] = [];
    let curr = N;
    while (curr > 0) {
      cuts.unshift(curr);
      curr = dp[curr]!.prev;
    }
    cuts.unshift(0);

    const beats: SentenceLockedBeat[] = [];
    for (let k = 0; k < cuts.length - 1; k++) {
      const startIdx = cuts[k]!;
      const endIdx = cuts[k + 1]!;

      const startTime = getCutTime(startIdx);
      const endTime = getCutTime(endIdx);
      const dur = Math.round((endTime - startTime) * 100) / 100;

      const wordsSlice = allWords.slice(startIdx, endIdx);
      const text = wordsSlice.map((w) => w.word).join(' ').trim();

      beats.push({
        beatIndex: k,
        chapterIndex: 0,
        text,
        startTime: Math.round(startTime * 100) / 100,
        endTime: Math.round(endTime * 100) / 100,
        duration: dur,
      });
    }

    return beats;
  }

  // Fallback greedy approach if DP doesn't reach N (extremely rare edge cases)
  const beats: SentenceLockedBeat[] = [];
  let beatIndex = 0;
  let wordCursor = 0;
  let currentStartTime = 0.0;

  while (wordCursor < allWords.length) {
    let targetEndCursor = wordCursor;
    let accumulatedDur = 0;
    let bestPunctuationCursor = -1;

    while (targetEndCursor < allWords.length) {
      const w = allWords[targetEndCursor]!;
      accumulatedDur = w.end - currentStartTime;

      const isSentenceEnd = /[.!?]$/.test(w.word.trim());
      const isClauseEnd = /[,;—–:-]$/.test(w.word.trim());

      if (accumulatedDur >= minDur && accumulatedDur <= maxDur) {
        if (isSentenceEnd) {
          bestPunctuationCursor = targetEndCursor;
          break;
        } else if (isClauseEnd) {
          bestPunctuationCursor = targetEndCursor;
        }
      }

      if (accumulatedDur > maxDur) {
        if (bestPunctuationCursor >= wordCursor) {
          targetEndCursor = bestPunctuationCursor;
        } else if (targetEndCursor > wordCursor) {
          const prevDur = allWords[targetEndCursor - 1]!.end - currentStartTime;
          if (prevDur >= minDur) {
            targetEndCursor = targetEndCursor - 1;
          }
        }
        break;
      }

      targetEndCursor++;
    }

    if (targetEndCursor >= allWords.length) {
      targetEndCursor = allWords.length - 1;
    }

    const endWord = allWords[targetEndCursor]!;
    let beatEndTime = Math.min(totalAudioDuration, endWord.end);

    if (targetEndCursor === allWords.length - 1) {
      beatEndTime = totalAudioDuration;
    }

    let beatDuration = Math.round((beatEndTime - currentStartTime) * 100) / 100;

    if (beatDuration < minDur && targetEndCursor < allWords.length - 1) {
      while (targetEndCursor < allWords.length - 1 && beatDuration < minDur) {
        targetEndCursor++;
        beatEndTime = allWords[targetEndCursor]!.end;
        beatDuration = Math.round((beatEndTime - currentStartTime) * 100) / 100;
      }
    }

    const beatSliceWords = allWords.slice(wordCursor, targetEndCursor + 1);
    const beatText = beatSliceWords.map((w) => w.word).join(' ').trim();

    beats.push({
      beatIndex,
      chapterIndex: 0,
      text: beatText,
      startTime: Math.round(currentStartTime * 100) / 100,
      endTime: Math.round(beatEndTime * 100) / 100,
      duration: Math.round((beatEndTime - currentStartTime) * 100) / 100,
    });

    beatIndex++;
    wordCursor = targetEndCursor + 1;
    currentStartTime = beatEndTime;
  }

  return beats;
}

