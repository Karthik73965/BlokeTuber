import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import dotenv from 'dotenv';
import { getAudioDuration } from './audioAssembly';

dotenv.config();

export interface WordTimestamp {
  word: string;
  start: number; // seconds
  end: number;
}

export interface SegmentAlignment {
  text: string;
  start: number;
  end: number;
  words: WordTimestamp[];
}

/**
 * Audio alignment & Speech-to-Text service.
 * Priority:
 * 1. OpenRouter Whisper API (OPENROUTER_API_KEY) — openai/whisper-1 or configured WHISPER_MODEL
 * 2. OpenAI Whisper API (OPENAI_API_KEY) — official OpenAI endpoint
 * 3. Groq Whisper API (GROQ_API_KEY) — Groq cloud endpoint
 * 4. Fallback Estimator — Computes estimated timestamps from duration if no API key set
 */
export async function alignAudio(
  masterAudioPath: string
): Promise<SegmentAlignment[]> {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  if (openrouterKey) {
    console.log('🎙️ Running audio transcription via OpenRouter Whisper STT...');
    const model = process.env.WHISPER_MODEL || 'openai/whisper-1';
    return alignWithApi(
      'https://openrouter.ai/api/v1/audio/transcriptions',
      openrouterKey,
      model,
      masterAudioPath
    );
  }

  if (openaiKey) {
    console.log('🎙️ Running audio alignment via OpenAI Whisper API...');
    return alignWithApi(
      'https://api.openai.com/v1/audio/transcriptions',
      openaiKey,
      'whisper-1',
      masterAudioPath
    );
  }

  if (groqKey) {
    console.log('🎙️ Running audio alignment via Groq Whisper API...');
    return alignWithApi(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      groqKey,
      'whisper-large-v3',
      masterAudioPath
    );
  }

  console.log('⚠️ No OPENROUTER_API_KEY, OPENAI_API_KEY, or GROQ_API_KEY set. Generating duration-based fallback timing map...');
  return fallbackAlignment(masterAudioPath);
}

/**
 * Send audio to OpenAI/OpenRouter-compatible Whisper endpoint.
 */
async function alignWithApi(
  endpoint: string,
  apiKey: string,
  model: string,
  audioPath: string
): Promise<SegmentAlignment[]> {
  const audioBuffer = fs.readFileSync(audioPath);
  let duration = 60;
  try {
    duration = await getAudioDuration(audioPath);
  } catch {}

  const form = new FormData();
  form.append('file', audioBuffer, {
    filename: path.basename(audioPath),
    contentType: 'audio/mpeg',
  });
  form.append('model', model);
  form.append('response_format', 'verbose_json');
  form.append('timestamp_granularities[]', 'word');
  form.append('timestamp_granularities[]', 'segment');

  const headers: Record<string, string> = {
    Authorization: `Bearer ${apiKey}`,
    'HTTP-Referer': 'https://bloketuber.app',
    'X-Title': 'BlokeTuber',
    ...form.getHeaders(),
  };

  const response = await fetch(endpoint, {
    method: 'POST',
    headers,
    body: form.getBuffer() as any,
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`Whisper API error (${response.status}): ${errText}. Falling back to estimated alignment.`);
    return fallbackAlignment(audioPath);
  }

  const raw = (await response.json()) as any;

  // 1. If verbose_json with segments was returned
  if (Array.isArray(raw.segments) && raw.segments.length > 0) {
    return raw.segments.map((seg: any) => ({
      text: seg.text || '',
      start: typeof seg.start === 'number' ? seg.start : 0,
      end: typeof seg.end === 'number' ? seg.end : duration,
      words: (raw.words || seg.words || [])
        .filter((w: any) => w.start >= seg.start && w.end <= seg.end + 0.2)
        .map((w: any) => ({
          word: w.word || '',
          start: w.start,
          end: w.end,
        })),
    }));
  }

  // 2. If standard text response was returned (e.g. OpenRouter normalized JSON)
  const fullText = String(raw.text || '').trim();
  if (fullText) {
    const words = fullText.split(/\s+/).filter(Boolean);
    const wordCount = Math.max(1, words.length);
    const wordDuration = duration / wordCount;

    const wordTimestamps: WordTimestamp[] = words.map((w, i) => ({
      word: w,
      start: Number((i * wordDuration).toFixed(3)),
      end: Number(((i + 1) * wordDuration).toFixed(3)),
    }));

    return [
      {
        text: fullText,
        start: 0,
        end: Number(duration.toFixed(3)),
        words: wordTimestamps,
      },
    ];
  }

  return fallbackAlignment(audioPath);
}

/**
 * Fallback alignment when no external API key is provided.
 */
async function fallbackAlignment(audioPath: string): Promise<SegmentAlignment[]> {
  let duration = 60;
  try {
    duration = await getAudioDuration(audioPath);
  } catch {
    duration = 60;
  }

  return [
    {
      text: 'Full Narration Track',
      start: 0,
      end: duration,
      words: [],
    },
  ];
}

function numberToWords(num: number): string {
  const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
    'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
    'seventeen', 'eighteen', 'nineteen'];
  const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

  if (num === 0) return 'zero';
  if (num < 20) return ones[num] || '';
  if (num < 100) return (tens[Math.floor(num / 10)] + ' ' + (ones[num % 10] || '')).trim();
  if (num < 1000) return (ones[Math.floor(num / 100)] + ' hundred ' + (num % 100 !== 0 ? numberToWords(num % 100) : '')).trim();
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return (numberToWords(thousands) + ' thousand ' + (remainder !== 0 ? numberToWords(remainder) : '')).trim();
  }
  const millions = Math.floor(num / 1000000);
  const remainder = num % 1000000;
  return (numberToWords(millions) + ' million ' + (remainder !== 0 ? numberToWords(remainder) : '')).trim();
}

const ORDINALS: Record<string, string> = {
  '1st': 'first', '2nd': 'second', '3rd': 'third', '4th': 'fourth', '5th': 'fifth',
  '6th': 'sixth', '7th': 'seventh', '8th': 'eighth', '9th': 'ninth', '10th': 'tenth',
};

export function normalizeForSearch(text: string): string[] {
  if (!text) return [];
  const variations = new Set<string>();

  const rawClean = text.toLowerCase().replace(/[^a-z0-9\$, ]/g, ' ').replace(/\s+/g, ' ').trim();
  variations.add(rawClean.replace(/[\$,]/g, ' ').replace(/\s+/g, ' ').trim());

  // Replace ordinals (1st, 2nd, 3rd, 4th...)
  let ordinalExpanded = rawClean;
  for (const [ord, word] of Object.entries(ORDINALS)) {
    const regex = new RegExp(`\\b${ord}\\b`, 'gi');
    ordinalExpanded = ordinalExpanded.replace(regex, word);
  }

  // Parse numbers (with optional commas and $)
  let wordsExpanded = ordinalExpanded.replace(/\$?(\d{1,3}(,\d{3})*|\d+)/g, (match) => {
    const isCurrency = match.startsWith('$');
    const numVal = parseInt(match.replace(/[\$,]/g, ''), 10);
    if (!isNaN(numVal) && numVal <= 999999999) {
      const words = numberToWords(numVal);
      return isCurrency ? `${words} dollars` : words;
    }
    return match;
  });

  wordsExpanded = wordsExpanded.replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  variations.add(wordsExpanded);

  // If text contained $, also add version with "dollars" appended if not already present
  if (text.includes('$') && !wordsExpanded.includes('dollars')) {
    variations.add(`${wordsExpanded} dollars`);
  }

  return Array.from(variations).filter(Boolean);
}

/**
 * Find when a specific phrase appears in the alignment results with number normalization & fuzzy window matching.
 */
export function findPhraseTimestamp(
  phrase: string,
  segments: SegmentAlignment[]
): { start: number; end: number } | null {
  if (!phrase || !segments || !segments.length) return null;
  const allWords = segments.flatMap((s) => {
    if (s.words && Array.isArray(s.words) && s.words.length > 0) {
      return s.words.filter((w) => w && typeof w.word === 'string');
    }
    const textWords = (s.text || '').trim().split(/\s+/).filter(Boolean);
    if (!textWords.length) return [];
    const dur = Math.max(0.1, (s.end || 0) - (s.start || 0));
    const wordDur = dur / textWords.length;
    return textWords.map((w, idx) => ({
      word: w,
      start: (s.start || 0) + idx * wordDur,
      end: (s.start || 0) + (idx + 1) * wordDur,
      confidence: 1,
    }));
  });
  if (!allWords.length) return null;

  const candidatePhrases = normalizeForSearch(phrase);

  for (const candidate of candidatePhrases) {
    const searchWords = candidate.split(' ').filter(Boolean);
    if (!searchWords.length) continue;

    for (let i = 0; i <= allWords.length - searchWords.length; i++) {
      const window = allWords.slice(i, i + searchWords.length);
      const windowText = window
        .map((w) => (w?.word || '').toLowerCase().replace(/[^a-z0-9]/g, '').trim())
        .join(' ');
      const targetText = searchWords
        .map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '').trim())
        .join(' ');

      if (windowText.includes(targetText) || targetText.includes(windowText)) {
        return {
          start: window[0]!.start,
          end: window[window.length - 1]!.end,
        };
      }
    }

    // Fallback: match on the first 2 significant words if multi-word
    if (searchWords.length >= 2) {
      const anchor = searchWords.slice(0, 2).join(' ');
      for (let i = 0; i <= allWords.length - 2; i++) {
        const window = allWords.slice(i, i + 2);
        const windowText = window.map((w) => (w?.word || '').toLowerCase().replace(/[^a-z0-9]/g, '')).join(' ');
        if (windowText.includes(anchor) || anchor.includes(windowText)) {
          return {
            start: window[0]!.start,
            end: window[window.length - 1]!.end,
          };
        }
      }
    }
  }

  return null;
}
