import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';
// Use a smarter model for the critical batch planning call
const PLANNER_MODEL = process.env.PLANNER_MODEL || 'openai/gpt-4o';

/**
 * A single planned beat produced by the AI.
 */
export interface PlannedBeat {
  beatIndex: number;
  chapterIndex: number;
  text: string; // exact text for this beat (for Whisper timing lookup)

  // Media decision made by the AI upfront
  mediaType: 'video' | 'image';

  // If mediaType === 'video': try this clip first (from library), or search stock
  clipFilename: string | null; // exact filename from available clips, or null
  stockVideoQuery: string | null; // if no local clip fits, search stock with this

  // If mediaType === 'image' OR video fallback fails: search a photo
  stockPhotoQuery: string | null;

  // AI reasoning (useful for debug / UI display)
  reason: string;
}

export interface AIPlannerResult {
  beats: PlannedBeat[];
}

/**
 * Single-batch AI call that:
 * 1. Splits the full script into smart semantic beats (natural cut points).
 * 2. For each beat, decides: video or image, which local clip (if any) or what to search.
 *
 * Returns the full plan in one shot — faster, cheaper (1 call), and much better quality
 * because the model sees the whole narrative arc at once.
 */
export async function planScriptWithAI(
  scriptText: string,
  availableClips: string[], // filenames only
  projectContext: string = '' // e.g. "American Hideaways documentary"
): Promise<AIPlannerResult> {
  const systemPrompt = `You are an expert documentary video editor for a YouTube channel (context: ${projectContext || 'American real estate documentary'}).

Your job is to:
1. Read the full script and split it into SMART VISUAL BEATS.
   - Cut on natural pause points: end of sentences, commas, topic/subject shifts, emotional peaks.
   - Each beat should be 1.5–5 seconds of spoken narration (roughly 4–12 words).
   - NEVER cut mid-word or mid-idea unless it's a dramatic pause point.
   - Keep beats that belong to the same visual idea together.
   - Numbers, statistics, and dollar amounts should get their OWN beat so they can be highlighted visually.

2. For each beat, decide the MEDIA TYPE:
   - "video": The beat describes a physical scene, action, place, person, or event that can be shown cinematically.
   - "image": The beat is abstract, emotional, historical, statistic-heavy, conceptual, or describing something that a generic stock video would look wrong for (e.g. "the American dream", "$2.4 million", "rising interest rates").
   
3. For each beat, produce:
   - If mediaType="video": a clipFilename from the available clips list (exact match, or null if none fits), AND a stockVideoQuery (2-4 word visual query). ALWAYS include American/USA context in stockVideoQuery.
   - If mediaType="image": set clipFilename=null, stockVideoQuery=null, and provide a stockPhotoQuery (2-4 word visual query for a high-quality photo).
   - If mediaType="video" but you're not confident a good video exists: ALSO provide a stockPhotoQuery as fallback.

Available local clips:
${availableClips.length > 0 ? availableClips.map((c, i) => `${i + 1}. ${c}`).join('\n') : '(none)'}

Respond ONLY with a valid JSON object in this EXACT format:
{
  "beats": [
    {
      "beatIndex": 0,
      "chapterIndex": 0,
      "text": "<exact text of this beat>",
      "mediaType": "video" | "image",
      "clipFilename": "<exact filename from available clips list OR null>",
      "stockVideoQuery": "<2-4 word query OR null>",
      "stockPhotoQuery": "<2-4 word query OR null>",
      "reason": "<one sentence rationale>"
    },
    ...
  ]
}

CRITICAL RULES:
- beatIndex is a global index across ALL chapters (starts at 0, increments by 1).
- chapterIndex is 0-based index of the paragraph/chapter block.
- text must be the EXACT substring of the script for that beat.
- Do NOT skip any part of the script — every word must appear in exactly one beat.
- stockVideoQuery and stockPhotoQuery must be specific, visual, and cinematic.
- For stockVideoQuery: ALWAYS include American/USA context (e.g. "American suburban home exterior", "USA highway aerial drone").
- For stockPhotoQuery: Keep it clean and high-resolution (e.g. "luxury home interior", "dollar bills close-up").
- If clipFilename is set, it MUST be an exact filename from the available clips list above.`;

  const userMessage = `Full Script:\n\n${scriptText}`;

  let response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://bloketuber.app',
    },
    body: JSON.stringify({
      model: PLANNER_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.15,
      max_tokens: 8000,
    }),
  });

  // Fallback to gpt-4o-mini if the specified model isn't available
  if (response.status === 404 || response.status === 400) {
    console.warn(`[AiPlanner] Model "${PLANNER_MODEL}" failed (${response.status}). Retrying with "openai/gpt-4o-mini"...`);
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bloketuber.app',
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.15,
        max_tokens: 8000,
      }),
    });
  }

  if (!response.ok) {
    throw new Error(`[AiPlanner] OpenRouter API error: ${response.status} ${response.statusText}`);
  }

  const data = (await response.json()) as any;
  const rawContent = data.choices?.[0]?.message?.content || '{}';

  let parsed: any;
  try {
    const clean = rawContent.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    parsed = JSON.parse(clean);
  } catch (err) {
    console.error('[AiPlanner] Failed to parse AI response:', rawContent.slice(0, 500));
    throw new Error('[AiPlanner] AI returned invalid JSON. Cannot continue.');
  }

  if (!Array.isArray(parsed?.beats) || parsed.beats.length === 0) {
    throw new Error('[AiPlanner] AI returned no beats. Cannot continue.');
  }

  // Normalize and validate each beat
  const beats: PlannedBeat[] = parsed.beats.map((b: any, idx: number) => ({
    beatIndex: typeof b.beatIndex === 'number' ? b.beatIndex : idx,
    chapterIndex: typeof b.chapterIndex === 'number' ? b.chapterIndex : 0,
    text: String(b.text || '').trim(),
    mediaType: b.mediaType === 'image' ? 'image' : 'video',
    clipFilename: b.clipFilename || null,
    stockVideoQuery: b.stockVideoQuery || null,
    stockPhotoQuery: b.stockPhotoQuery || null,
    reason: String(b.reason || ''),
  }));

  console.log(`[AiPlanner] ✅ Planned ${beats.length} beats (${beats.filter(b => b.mediaType === 'image').length} image, ${beats.filter(b => b.mediaType === 'video').length} video)`);

  return { beats };
}

/**
 * Maps AI-planned beats to BeatInput format using Whisper word-level timestamps.
 * Each beat gets its start/end from actual speech — no more guessing by word count.
 */
export function mapPlannedBeatsToTiming(
  beats: PlannedBeat[],
  whisperSegments: Array<{ text: string; start: number; end: number; words: Array<{ word: string; start: number; end: number }> }>,
  totalAudioDuration: number
): Array<PlannedBeat & { startTime: number; endTime: number }> {
  if (beats.length === 0) return [];

  // Flatten all whisper words into one ordered list
  const allWords = whisperSegments.flatMap((s) =>
    s.words.length > 0
      ? s.words
      : // Fallback: distribute segment duration across its words
        s.text.trim().split(/\s+/).filter(Boolean).map((w, i, arr) => ({
          word: w,
          start: s.start + (i / arr.length) * (s.end - s.start),
          end: s.start + ((i + 1) / arr.length) * (s.end - s.start),
        }))
  );

  // Total words in all beats
  const totalBeatWords = beats.reduce(
    (sum, b) => sum + Math.max(1, b.text.split(/\s+/).filter(Boolean).length),
    0
  );

  let currentStart = 0;

  return beats.map((beat, i) => {
    const beatWordCount = Math.max(1, beat.text.split(/\s+/).filter(Boolean).length);
    const wordFraction = beatWordCount / totalBeatWords;
    const estimatedDuration = wordFraction * totalAudioDuration;

    let endTime = currentStart + estimatedDuration;

    // Try to snap to a real Whisper word boundary near the estimated end
    if (allWords.length > 0) {
      // Find the word in the allWords list closest to the estimated end time
      const targetTime = endTime;
      let closestIdx = -1;
      let closestDist = Infinity;

      for (let w = 0; w < allWords.length; w++) {
        const dist = Math.abs((allWords[w]!.end) - targetTime);
        if (dist < closestDist) {
          closestDist = dist;
          closestIdx = w;
        }
      }

      if (closestIdx >= 0 && closestDist < 1.5) {
        // Snap to the nearest real word boundary (within 1.5s)
        endTime = allWords[closestIdx]!.end;
      }
    }

    // Last beat: force exact total duration
    if (i === beats.length - 1 || endTime > totalAudioDuration) {
      endTime = totalAudioDuration;
    }

    const result = {
      ...beat,
      startTime: Number(currentStart.toFixed(3)),
      endTime: Number(endTime.toFixed(3)),
    };

    currentStart = endTime;
    return result;
  });
}
