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
const PLANNER_MODEL = process.env.PLANNER_MODEL || 'openai/gpt-4o';

/**
 * A single cohesive visual scene produced by the AI Director.
 */
export interface PlannedBeat {
  beatIndex: number;
  chapterIndex: number;
  text: string; // complete spoken text for this scene (4-8 seconds worth of narration)

  // Media type: Real authentic video is always primary
  mediaType: 'video' | 'image';

  // If local clip library has a direct match
  clipFilename: string | null;

  // Real stock video cinematographer search terms
  stockVideoQuery: string | null; // Primary cinematic search (e.g. "aerial drone railway tracks sunset")
  backupVideoQuery: string | null; // Alternative cinematic angle (e.g. "moody train tracks dusk")

  // Real photography fallback query (only if video fails)
  stockPhotoQuery: string | null;

  // Camera direction for rendering (e.g. "slow_push", "aerial_pan", "close_up", "establishing")
  cameraStyle?: string;

  // Director reasoning
  reason: string;
}

export interface AIPlannerResult {
  beats: PlannedBeat[];
}

/**
 * Professional Documentary Director AI Planner:
 * 1. Groups script into cohesive, cinematic visual scenes (3.5s – 7.5s each, ~12-25 words).
 *    NEVER creates jittery 0.5s–1.5s cuts on single words.
 * 2. Translates abstract script lines into physical, filmable camera subjects for REAL stock video.
 * 3. Provides primary + secondary cinematic B-roll search terms across real stock footage providers.
 */
function extractAndParseJson(raw: string): any {
  if (!raw || typeof raw !== 'string') return null;

  // 1. Clean markdown code blocks
  let clean = raw.replace(/```json?\n?/gi, '').replace(/```/g, '').trim();
  try {
    return JSON.parse(clean);
  } catch {}

  // 2. Extract substring between outermost { and }
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start !== -1 && end > start) {
    const jsonSub = clean.slice(start, end + 1);
    try {
      return JSON.parse(jsonSub);
    } catch {}

    // 3. Fix trailing commas and unescaped control characters
    const sanitized = jsonSub
      .replace(/,\s*([\}\]])/g, '$1')
      .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ');
    try {
      return JSON.parse(sanitized);
    } catch {}
  }

  return null;
}

export async function planScriptWithAI(
  scriptText: string,
  availableClips: string[],
  projectContext: string = ''
): Promise<AIPlannerResult> {
  const cleanScript = (scriptText || '').trim();
  if (!cleanScript || cleanScript === 'Full Narration Track') {
    throw new Error(
      'Script text is empty. If you want Whisper to automatically transcribe your voiceover, please ensure GROQ_API_KEY or OPENAI_API_KEY is set in your .env file, or paste the script text in the dashboard.'
    );
  }

  const systemPrompt = `You are an elite YouTube documentary director and cinematography supervisor (Channel Context: ${projectContext || 'American Documentary / Real Estate / Investigative'}).

Your mission is to direct the voiceover script into a master visual timeline with HIGH-RETENTION PACING (2.0s – 3.8s per beat) using PHOTO-FIRST ARCHITECTURE (80%+ High-Res Real Photos with Multi-Directional Ken Burns).

CRITICAL DIRECTING RULES:

1. STRICT DURATION & HIGH-RETENTION PACING:
   - TARGET SHOT DURATION: 2.0s to 3.8s.
   - HARD MAXIMUM: NO SHOT MAY EVER EXCEED 4.5 SECONDS.
   - If a sentence is long (e.g. 6 to 10 seconds), YOU MUST BREAK IT INTO 2 OR 3 SEPARATE VISUAL SHOTS with different camera angles/subjects!

2. PHOTO-FIRST MEDIA SELECTION (80%+ REAL HIGH-RES PHOTOGRAPHY):
   - Default to mediaType="image" for 80%+ of all beats!
   - Why: High-Res 4K/5K Real Photography with multi-directional Ken Burns (slow zoom, slow pan) provides 10x crisper sharpness, editorial depth, and semantic precision than generic stock video.
   - Always provide a physical, high-resolution photo query in stockPhotoQuery:
     * "Todd lived 17 years without a home" -> mediaType: "image", stockPhotoQuery: "man walking industrial street dusk portrait"
     * "A bed" -> mediaType: "image", stockPhotoQuery: "rustic wooden bed cabin interior"
     * "Water" -> mediaType: "image", stockPhotoQuery: "clean water glass running tap"
     * "A bicycle" -> mediaType: "image", stockPhotoQuery: "vintage bicycle road close up"
     * "A cart" -> mediaType: "image", stockPhotoQuery: "wooden push cart hauling yard"
     * "The house sits inside Seneca Camp" -> mediaType: "image", stockPhotoQuery: "small makeshift wooden house rail yard"
     * "Railroad tracks and warehouses" -> mediaType: "image", stockPhotoQuery: "freight railroad tracks industrial warehouse dusk"
   - Reserve mediaType="video" ONLY for wide drone flyovers or major vehicle/crowd motion (<= 20% of beats).

3. SPEED-RUN / MONTAGE SEQUENCES (FAST 0.8s – 2.0s CUTS):
   - Whenever the script lists items (e.g. "A bed. Water.", "A bicycle. A cart.", "Walls, windows, doors"):
   - SPEED-RUN and cut on every individual item with mediaType="image"!

4. 100% SCRIPT INTEGRITY:
   - Every single word from the script must appear in order across the beats without skipping anything.

Available local clips (if any match, assign to clipFilename):
${availableClips.length > 0 ? availableClips.map((c, i) => `${i + 1}. ${c}`).join('\n') : '(none)'}

Respond ONLY with a valid JSON object in this EXACT format:
{
  "beats": [
    {
      "beatIndex": 0,
      "chapterIndex": 0,
      "text": "<exact spoken text of this beat>",
      "mediaType": "image" | "video",
      "clipFilename": "<exact filename from available list OR null>",
      "stockPhotoQuery": "<physical high-res real photo search query>",
      "stockVideoQuery": "<2-3 word video query OR null>",
      "backupVideoQuery": "<alternative query OR null>",
      "cameraStyle": "zoom_in" | "zoom_out" | "pan_left" | "pan_right" | "fast_cut",
      "reason": "<director reason>"
    }
  ]
}`;

  const userMessage = `Full Script to Direct:\n\n${cleanScript}`;

  let response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://bloketuber.app',
    },
    body: JSON.stringify({
      model: PLANNER_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.15,
      max_tokens: 8000,
    }),
  });

  // Fallback to gpt-4o-mini if needed
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
        response_format: { type: 'json_object' },
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

  const parsed = extractAndParseJson(rawContent);
  if (!parsed || !Array.isArray(parsed?.beats) || parsed.beats.length === 0) {
    console.error('[AiPlanner] Raw AI response failed JSON parsing. Raw preview:', rawContent.slice(0, 400));
    throw new Error('[AiPlanner] AI returned invalid JSON. Cannot continue.');
  }

  const beats: PlannedBeat[] = parsed.beats.map((b: any, idx: number) => ({
    beatIndex: typeof b.beatIndex === 'number' ? b.beatIndex : idx,
    chapterIndex: typeof b.chapterIndex === 'number' ? b.chapterIndex : 0,
    text: String(b.text || '').trim(),
    mediaType: b.mediaType === 'video' ? 'video' : 'image', // Photo-first default
    clipFilename: b.clipFilename || null,
    stockVideoQuery: b.stockVideoQuery || null,
    backupVideoQuery: b.backupVideoQuery || null,
    stockPhotoQuery: b.stockPhotoQuery || b.stockVideoQuery || b.text,
    cameraStyle: b.cameraStyle || 'zoom_in',
    reason: String(b.reason || ''),
  }));

  console.log(
    `[AiPlanner] 🎬 Director Planned ${beats.length} beats (${beats.filter((b) => b.mediaType === 'image').length} real photos with Ken Burns, ${beats.filter((b) => b.mediaType === 'video').length} real videos)`
  );

  return { beats };
}

/**
 * Maps AI-planned scenes to audio timestamps with Whisper word-level boundary snapping
 * AND enforces a strict hard cap of 4.5s max duration per clip by auto-splitting long beats.
 */
export function mapPlannedBeatsToTiming(
  beats: PlannedBeat[],
  whisperSegments: Array<{ text: string; start: number; end: number; words: Array<{ word: string; start: number; end: number }> }>,
  totalAudioDuration: number
): Array<PlannedBeat & { startTime: number; endTime: number }> {
  if (beats.length === 0) return [];

  // Flatten all whisper words into one ordered list
  const allWords = whisperSegments.flatMap((s) =>
    s.words && s.words.length > 0
      ? s.words
      : s.text.trim().split(/\s+/).filter(Boolean).map((w, i, arr) => ({
          word: w,
          start: s.start + (i / arr.length) * (s.end - s.start),
          end: s.start + ((i + 1) / arr.length) * (s.end - s.start),
        }))
  );

  const totalBeatWords = beats.reduce(
    (sum, b) => sum + Math.max(1, b.text.split(/\s+/).filter(Boolean).length),
    0
  );

  const initialTimed: Array<PlannedBeat & { startTime: number; endTime: number }> = [];
  let currentStart = 0;

  for (let i = 0; i < beats.length; i++) {
    const beat = beats[i]!;
    const beatWordCount = Math.max(1, beat.text.split(/\s+/).filter(Boolean).length);
    const wordFraction = beatWordCount / totalBeatWords;
    const estimatedDuration = wordFraction * totalAudioDuration;

    let endTime = currentStart + estimatedDuration;

    // Snap to nearest Whisper word end
    if (allWords.length > 0) {
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

      const maxSnapTolerance = Math.max(0.4, Math.min(1.5, estimatedDuration * 0.6));
      if (closestIdx >= 0 && closestDist <= maxSnapTolerance) {
        endTime = allWords[closestIdx]!.end;
      }
    }

    if (i === beats.length - 1 || endTime > totalAudioDuration) {
      endTime = totalAudioDuration;
    }

    initialTimed.push({
      ...beat,
      startTime: Number(currentStart.toFixed(3)),
      endTime: Number(endTime.toFixed(3)),
    });

    currentStart = endTime;
  }

  // ── STRICT HARD CAP: Auto-split any beat > 4.5s into 2.5s–3.5s sub-shots ──
  const MAX_SHOT_DURATION = 4.5;
  const finalTimed: Array<PlannedBeat & { startTime: number; endTime: number }> = [];
  const cameraVectors = ['zoom_in', 'pan_left', 'pan_right', 'zoom_out'];

  let globalIndex = 0;

  for (const timedBeat of initialTimed) {
    const duration = timedBeat.endTime - timedBeat.startTime;

    if (duration <= MAX_SHOT_DURATION) {
      finalTimed.push({ ...timedBeat, beatIndex: globalIndex++ });
      continue;
    }

    // Split into N sub-shots
    const numSubBeats = Math.ceil(duration / 3.3);
    const subDuration = duration / numSubBeats;
    console.log(
      `  ✂️ Pacing Auto-Split: Beat "${timedBeat.text.slice(0, 30)}..." (${duration.toFixed(1)}s) -> split into ${numSubBeats} shots (~${subDuration.toFixed(1)}s each)`
    );

    for (let s = 0; s < numSubBeats; s++) {
      const subStart = timedBeat.startTime + s * subDuration;
      const subEnd = s === numSubBeats - 1 ? timedBeat.endTime : timedBeat.startTime + (s + 1) * subDuration;
      const vector = cameraVectors[(globalIndex + s) % cameraVectors.length] || 'zoom_in';

      finalTimed.push({
        ...timedBeat,
        beatIndex: globalIndex++,
        startTime: Number(subStart.toFixed(3)),
        endTime: Number(subEnd.toFixed(3)),
        mediaType: 'image', // Photo-first for dynamic sub-shots
        cameraStyle: vector,
      });
    }
  }

  return finalTimed;
}
