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
 * Audio alignment service.
 * Priority:
 * 1. Groq Whisper API (GROQ_API_KEY) — Free, 10x faster
 * 2. OpenAI Whisper API (OPENAI_API_KEY) — Official OpenAI API
 * 3. Fallback Estimator — Computes estimated timestamps from duration if no API key set
 */
export async function alignAudio(
  masterAudioPath: string
): Promise<SegmentAlignment[]> {
  const groqKey = process.env.GROQ_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (groqKey) {
    console.log('🎙️ Running audio alignment via Groq Whisper API (Free)...');
    return alignWithApi(
      'https://api.groq.com/openai/v1/audio/transcriptions',
      groqKey,
      'whisper-large-v3',
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

  console.log('⚠️ No GROQ_API_KEY or OPENAI_API_KEY set. Generating duration-based fallback timing map...');
  return fallbackAlignment(masterAudioPath);
}

/**
 * Send audio to OpenAI-compatible Whisper endpoint (Groq or OpenAI).
 */
async function alignWithApi(
  endpoint: string,
  apiKey: string,
  model: string,
  audioPath: string
): Promise<SegmentAlignment[]> {
  const audioBuffer = fs.readFileSync(audioPath);

  const form = new FormData();
  form.append('file', audioBuffer, {
    filename: path.basename(audioPath),
    contentType: 'audio/mpeg',
  });
  form.append('model', model);
  form.append('response_format', 'verbose_json');
  form.append('timestamp_granularities[]', 'word');
  form.append('timestamp_granularities[]', 'segment');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: Object.assign({ Authorization: `Bearer ${apiKey}` }, form.getHeaders()),
    body: form.getBuffer() as any,
  });

  if (!response.ok) {
    const errText = await response.text();
    console.warn(`Whisper API error (${response.status}): ${errText}. Falling back to estimated alignment.`);
    return fallbackAlignment(audioPath);
  }

  const raw = (await response.json()) as any;

  const segments: SegmentAlignment[] = (raw.segments || []).map((seg: any) => ({
    text: seg.text,
    start: seg.start,
    end: seg.end,
    words: (raw.words || seg.words || [])
      .filter((w: any) => w.start >= seg.start && w.end <= seg.end + 0.1)
      .map((w: any) => ({
        word: w.word,
        start: w.start,
        end: w.end,
      })),
  }));

  return segments;
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

/**
 * Find when a specific phrase appears in the alignment results.
 */
export function findPhraseTimestamp(
  phrase: string,
  segments: SegmentAlignment[]
): { start: number; end: number } | null {
  const normalizedPhrase = phrase.toLowerCase().replace(/[^a-z0-9 ]/g, '');
  const words = normalizedPhrase.split(' ').filter(Boolean);

  const allWords = segments.flatMap((s) => s.words);
  if (!allWords.length) return null;

  for (let i = 0; i <= allWords.length - words.length; i++) {
    const window = allWords.slice(i, i + words.length);
    const windowText = window
      .map((w) => w.word.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim())
      .join(' ');
    if (windowText.includes(words.join(' '))) {
      return {
        start: window[0]!.start,
        end: window[window.length - 1]!.end,
      };
    }
  }

  return null;
}
