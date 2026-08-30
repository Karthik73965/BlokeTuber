/**
 * Parses a full script text into chapters and fast-paced ~2-second micro-beats.
 * Every ~2 seconds of spoken narration (~5 words) gets its own visual beat cut.
 */

export interface Beat {
  chapterIndex: number;
  beatIndex: number;
  text: string;
  estimatedDurationSeconds: number;
}

export interface Chapter {
  index: number;
  title?: string;
  rawText: string;
  beats: Beat[];
}

// Speaking rate: ~150 words/min = ~2.5 words/second
const WORDS_PER_SECOND = 2.5;
const TARGET_BEAT_SECONDS = 3.5; // Natural documentary cadence (8-10 words per beat)
const TARGET_WORDS_PER_BEAT = Math.round(TARGET_BEAT_SECONDS * WORDS_PER_SECOND); // ~9 words per beat

/**
 * Split text into clauses/phrases using punctuation or commas.
 */
function splitIntoPhrases(text: string): string[] {
  return text
    .split(/(?<=[.!?,;:—\-])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Group phrases/words into fast-paced ~2-second micro-beats (~5 words each).
 */
function groupIntoBeat(phrases: string[], chapterIndex: number): Beat[] {
  const beats: Beat[] = [];
  let currentWords: string[] = [];
  let beatIndex = 0;

  for (const phrase of phrases) {
    const words = phrase.split(/\s+/).filter(Boolean);
    for (const word of words) {
      currentWords.push(word);
      if (currentWords.length >= TARGET_WORDS_PER_BEAT) {
        const text = currentWords.join(' ');
        beats.push({
          chapterIndex,
          beatIndex: beatIndex++,
          text,
          estimatedDurationSeconds: Number((currentWords.length / WORDS_PER_SECOND).toFixed(2)),
        });
        currentWords = [];
      }
    }
  }

  if (currentWords.length > 0) {
    const text = currentWords.join(' ');
    beats.push({
      chapterIndex,
      beatIndex: beatIndex++,
      text,
      estimatedDurationSeconds: Number(Math.max(1, currentWords.length / WORDS_PER_SECOND).toFixed(2)),
    });
  }

  return beats;
}

/**
 * Parse the full script into chapters and ~2-second micro-beats.
 */
export function parseScript(scriptText: string): Chapter[] {
  const chapterBlocks = scriptText
    .split(/\n{2,}|(?=^#{1,3}\s)|(?=^\[CHAPTER)/im)
    .map((block) => block.trim())
    .filter((block) => block.length > 10);

  return chapterBlocks.map((rawText, index) => {
    const titleMatch = rawText.match(/^#{1,3}\s+(.+)|^\[CHAPTER[^\]]*\]\s*(.+)?/i);
    const title = titleMatch ? (titleMatch[1] || titleMatch[2] || undefined) : undefined;
    const contentText = rawText.replace(/^#{1,3}.+\n|^\[CHAPTER[^\]]*\]\s*/im, '').trim();

    const phrases = splitIntoPhrases(contentText);
    const beats = groupIntoBeat(phrases, index);

    return {
      index,
      title,
      rawText,
      beats,
    };
  });
}

/**
 * Get a flat list of all beats across all chapters.
 */
export function getAllBeats(chapters: Chapter[]): Beat[] {
  return chapters.flatMap((c) => c.beats);
}
