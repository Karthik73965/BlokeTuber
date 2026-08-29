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
const PLANNER_MODEL = process.env.PLANNER_MODEL || 'anthropic/claude-sonnet-4-5';

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

  // Text overlay callout for this beat
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
    line1: string; // primary bold text (name, date, stat, location)
    line2?: string; // subtitle (role, context, location details)
    spokenTrigger?: string; // exact 2-4 spoken words from voiceover that trigger this callout
    themeColor?: 'gold' | 'amber' | 'cyan' | 'crimson' | 'emerald' | 'slate' | 'white';
  } | null;
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

  // 1. Strip markdown code fences (```json ... ``` or ``` ... ```)
  let clean = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  // Also strip any inline fences in case the model wrapped mid-response
  clean = clean.replace(/```json?\n?/gi, '').replace(/```/g, '').trim();

  // 2. Try clean parse first
  try {
    return JSON.parse(clean);
  } catch {}

  // 3. Extract substring between outermost { and }
  const start = clean.indexOf('{');
  const end = clean.lastIndexOf('}');
  if (start !== -1 && end > start) {
    const jsonSub = clean.slice(start, end + 1);
    try {
      return JSON.parse(jsonSub);
    } catch {}

    // 4. Fix trailing commas and unescaped control characters
    const sanitized = jsonSub
      .replace(/,\s*([\}\]])/g, '$1')
      .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ');
    try {
      return JSON.parse(sanitized);
    } catch {}
  }

  // 5. TRUNCATION RECOVERY — extract all complete beat objects via regex
  // When max_tokens is hit mid-stream, the JSON is cut off but earlier beats are valid.
  // We salvage every complete {...} beat object from the "beats" array.
  console.warn('[AiPlanner] Full JSON parse failed — attempting truncation recovery...');
  const beatMatches: any[] = [];
  // Match top-level beat objects: greedy match of balanced braces
  const beatPattern = /\{\s*"beatIndex"\s*:/g;
  let match: RegExpExecArray | null;
  while ((match = beatPattern.exec(clean)) !== null) {
    const startIdx = match.index;
    let depth = 0;
    let endIdx = -1;
    for (let i = startIdx; i < clean.length; i++) {
      if (clean[i] === '{') depth++;
      else if (clean[i] === '}') {
        depth--;
        if (depth === 0) { endIdx = i; break; }
      }
    }
    if (endIdx === -1) break; // truncated mid-object, stop here
    const beatStr = clean.slice(startIdx, endIdx + 1);
    try {
      const beatObj = JSON.parse(beatStr);
      beatMatches.push(beatObj);
    } catch {
      // Fix trailing comma artifacts and retry
      try {
        const fixed = beatStr.replace(/,\s*([\}\]])/g, '$1').replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, ' ');
        beatMatches.push(JSON.parse(fixed));
      } catch { /* skip malformed beat */ }
    }
  }

  if (beatMatches.length > 0) {
    console.warn(`[AiPlanner] Truncation recovery salvaged ${beatMatches.length} beats.`);
    return { beats: beatMatches };
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

  const systemPrompt = `You are an award-winning investigative documentary director — think Vice, Vox Borders, BBC Eye Witness, and Magnates Media. You direct gritty, high-retention short-form documentaries about real people, hidden places, homelessness, crime, survival, and industrial America.

You will receive a voiceover script. Your job is to break it into a cinematic visual timeline and write punchy, authentic TEXT CALLOUTS that feel like they belong on a real documentary — not generic labels.

---

VISUAL BEATS:
- Break the script into beats of 2.0s – 3.8s each (never exceed 4.5s).
- If a sentence is long (>4.5s), split it into 2–3 separate shots with different angles.
- For list-style narration (e.g. "generators, fireplaces, propane heaters"), give each item its own beat.
- Pick mediaType="video" for action, movement, machinery, weather, drama.
- Pick mediaType="image" for establishing locations, portraits, evidence, static objects.
- stockVideoQuery / stockPhotoQuery: 2–3 concrete visual words MAX. No full sentences.

---

TEXT CALLOUTS — THIS IS THE MOST IMPORTANT PART:
Generate a callout on ~70–80% of beats. These are the on-screen text overlays that make the video feel like a real documentary.

WRITE CALLOUTS LIKE A JOURNALIST, NOT A LABEL MAKER:
❌ BAD — generic, meaningless: "KNOWN AREA", "COMPLEX STORY", "HAND-CUT TRAIL", "WIRED CABIN"
✅ GOOD — specific, journalistic, story-driven:
  - Instead of "KNOWN AREA" → "THE PART EVERYONE KNOWS"
  - Instead of "COMPLEX STORY" → "HARDER TO EXPLAIN THAN IT LOOKS"
  - Instead of "HAND-CUT TRAIL" → "NOBODY INVITED. HE MADE HIS OWN WAY."
  - Instead of "WIRED CABIN" → "POWER. IN A HIDDEN FOREST."

CALLOUT VOICE:
- Write like a headline editor at Vice or a caption writer at the NYT.
- Use the actual facts, names, numbers, and places from the script.
- Be specific. Be evocative. Be short. 3–7 words per line.
- line2 should add real context (date, charge, source, location detail) — not just repeat line1.
- Don't write vague summaries. Write what the VIEWER IS THINKING right now.

CALLOUT TYPES (pick the most visually fitting one):
- "stat_callout": For numbers/stats — e.g. line1: "BUILT 5 TIMES", line2: "SAME HILLSIDE"
- "lower_third": For named people — e.g. line1: "Steven Irwin", line2: "Cabin Builder · Beacon Hill"
- "location_badge": For real places — e.g. line1: "SEATTLE, WA · BEACON HILL", line2: "Dr. José Rizal Park"
- "evidence_tag": For criminal charges / official records — e.g. line1: "UNAUTHORIZED STRUCTURE", line2: "5 CITY REMOVALS"
- "quote_card": For direct quotes or chilling moments — e.g. line1: "He built it again.", line2: "And again. And again."
- "chapter_header": Act transitions — e.g. line1: "ACT 2: THE MAN WHO WOULDN'T LEAVE"
- "highlight_pill": Compact floating keyword — use when a single phrase is the whole point
- "ticker_bar": Bottom news ticker for authority context — e.g. line1: "City demolition crews removed it for the 5th time", line2: "SEATTLE PARKS DEPT."
- "breaking_news": Red alert for the single most shocking revelation — max 2 per video
- "full_screen_title": ONLY on the very first beat — cinematic chapter intro title
- "corner_tag": Source tags — e.g. line1: "CITY RECORDS", line2: "2024"
- "split_title": Dual box milestone — e.g. line1: "OCTOBER 2024", line2: "4TH ARREST"

THEMES: "gold", "amber", "cyan", "crimson", "emerald", "slate", "white"
spokenTrigger: the exact 2–4 spoken words from the voiceover that this callout syncs to.

---

SCRIPT INTEGRITY: Every word from the script must appear in order. Don't skip anything.

Available local clips (if any match, assign to clipFilename):
${availableClips.length > 0 ? availableClips.map((c, i) => `${i + 1}. ${c}`).join('\n') : '(none)'}

Respond with ONLY a valid JSON object in this exact format — no markdown, no explanation, just JSON:
{
  "beats": [
    {
      "beatIndex": 0,
      "chapterIndex": 0,
      "text": "<exact spoken text for this beat>",
      "mediaType": "video" | "image",
      "clipFilename": "<exact filename from available list OR null>",
      "stockVideoQuery": "<2-3 word video search query OR null>",
      "backupVideoQuery": "<alternative 2-3 word query OR null>",
      "stockPhotoQuery": "<2-3 word photo search query OR null>",
      "cameraStyle": "zoom_in" | "zoom_out" | "pan_left" | "pan_right" | "fast_cut",
      "reason": "<one-sentence director reason>",
      "callout": {
        "type": "<callout type from list above>",
        "line1": "<punchy primary text — specific, journalistic, 3-7 words>",
        "line2": "<real contextual subtitle OR null>",
        "spokenTrigger": "<exact 2-4 words from voiceover>",
        "themeColor": "<color>"
      }
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
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.35,
      max_tokens: 16000,
    }),
  });

  // Fallback to claude-haiku if primary model fails
  if (response.status === 404 || response.status === 400) {
    console.warn(`[AiPlanner] Model "${PLANNER_MODEL}" failed (${response.status}). Retrying with "anthropic/claude-haiku-4-5"...`);
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bloketuber.app',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-haiku-4-5',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.35,
        max_tokens: 16000,
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
    callout: b.callout?.type ? {
      type: b.callout.type,
      line1: String(b.callout.line1 || '').trim(),
      line2: b.callout.line2 ? String(b.callout.line2).trim() : undefined,
      spokenTrigger: b.callout.spokenTrigger ? String(b.callout.spokenTrigger).trim() : undefined,
      themeColor: b.callout.themeColor || 'gold',
    } : null,
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

    const angleModifiers = [
      '',
      'close up detail texture',
      'wide angle perspective',
      'dramatic mood atmosphere',
    ];

    for (let s = 0; s < numSubBeats; s++) {
      const subStart = timedBeat.startTime + s * subDuration;
      const subEnd = s === numSubBeats - 1 ? timedBeat.endTime : timedBeat.startTime + (s + 1) * subDuration;
      const vector = cameraVectors[(globalIndex + s) % cameraVectors.length] || 'zoom_in';
      const modifier = angleModifiers[s % angleModifiers.length];
      const subPhotoQuery = modifier && timedBeat.stockPhotoQuery
        ? `${timedBeat.stockPhotoQuery} ${modifier}`
        : timedBeat.stockPhotoQuery;

      finalTimed.push({
        ...timedBeat,
        beatIndex: globalIndex++,
        startTime: Number(subStart.toFixed(3)),
        endTime: Number(subEnd.toFixed(3)),
        mediaType: timedBeat.mediaType, // Inherit parent action/still semantic media type
        cameraStyle: vector,
        stockPhotoQuery: subPhotoQuery,
        // Only trigger the callout on the first sub-shot of the sentence
        callout: s === 0 ? timedBeat.callout : null,
      });
    }
  }

  return finalTimed;
}
