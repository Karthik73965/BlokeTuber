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

  // Text overlay callout for this beat
  callout?: {
    type: 'lower_third' | 'center_title';
    line1: string; // primary bold text (name, date, stat, location)
    line2?: string; // subtitle (lower_third only) e.g. 'Suspect', 'Officer on Scene', 'Location'
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

  const systemPrompt = `You are an award-winning investigative documentary director and visual photojournalist (Specializing in Gritty Realism, Human Hardship, Homelessness, Off-Grid Survival, and Industrial Americana — like Vice, Vox, BBC Eye, and Magnates Media).

Your mission is to direct the voiceover script into a master visual timeline with HIGH-RETENTION PACING (2.0s – 3.8s per beat) using PHOTO-FIRST ARCHITECTURE (80%+ High-Res Real Photos).

CRITICAL DIRECTING & PHOTOJOURNALISM RULES:

1. GRITTY PHOTOJOURNALISM & RAW REALISM (STRICT VISUAL IDENTITY):
   - We are telling REAL, RAW stories about poverty, makeshift survival, homelessness, and hardship.
   - ABSOLUTE NEGATIVE RULE: NEVER generate queries for clean modern apartments, luxury houses, bright studio stock, corporate offices, or smiling models.
   - ALWAYS use physical, photographic descriptors in every "stockPhotoQuery":
     * Include physical textures: "weathered", "makeshift", "rusted", "scrap wood", "corrugated metal", "gravel", "worn", "industrial", "rundown", "overcast", "dusk".
   - CONCRETE REAL-WORLD QUERY EXAMPLES:
     * Script: "Todd lived 17 years without a home." -> stockPhotoQuery: "weathered homeless man portrait industrial street dusk gritty"
     * Script: "A bicycle." -> stockPhotoQuery: "worn rusty bicycle parked gravel dirt path"
     * Script: "A cart." -> stockPhotoQuery: "makeshift wooden push cart scrap hauling industrial"
     * Script: "A bed." -> stockPhotoQuery: "weathered wooden pallet mattress makeshift shelter interior"
     * Script: "Water." -> stockPhotoQuery: "plastic water jugs campsite outdoor survival makeshift"
     * Script: "Discarded materials became walls and doors." -> stockPhotoQuery: "scrap wood planks rusted corrugated metal sheets pile"
     * Script: "He built a house on the railroad tracks." -> stockPhotoQuery: "makeshift wooden shack freight railroad tracks industrial"
     * Script: "The freight cars rolling past." -> stockPhotoQuery: "freight train cargo wagons industrial railway tracks"
     * Script: "This is Seneca Road on the edge of Eugene, Oregon." -> stockPhotoQuery: "overcast industrial road railway yard perimeter dusk"
     * Script: "The total cost was $2,000." -> stockPhotoQuery: "crumpled dollar bills worn working hands close up gritty"

2. STRICT DURATION & HIGH-RETENTION PACING:
   - TARGET SHOT DURATION: 2.0s to 3.8s.
   - HARD MAXIMUM: NO SHOT MAY EVER EXCEED 4.5 SECONDS.
   - If a sentence is long (e.g. 6 to 10 seconds), BREAK IT INTO 2 OR 3 SEPARATE VISUAL SHOTS with different camera angles/subjects!

3. PHOTO-FIRST MEDIA SELECTION (80%+ REAL HIGH-RES PHOTOGRAPHY):
   - Default to mediaType="image" for 80%+ of all beats! High-res 4K/5K photography with continuous camera motion provides 10x crisper sharpness, emotional weight, and photographic authenticity.
   - Reserve mediaType="video" ONLY for wide drone flyovers or major heavy vehicle motion (<= 20% of beats).

4. SPEED-RUN / MONTAGE SEQUENCES (FAST 1.0s – 2.5s CUTS ON LISTS):
   - Whenever the script lists items (e.g. "generators, fireplaces, propane heaters, a working washing machine, a treadmill" or "A bed. Water. A bicycle. A cart."):
   - YOU MUST BREAK THE LIST INTO INDIVIDUAL BEATS for each item and provide a distinct, specific physical photo query for each item:
     * "generators" -> stockPhotoQuery: "portable gas generator rustic wood cabin outdoor"
     * "fireplaces" -> stockPhotoQuery: "stone brick fireplace burning wood cabin interior"
     * "propane heaters" -> stockPhotoQuery: "portable propane tank heater campsite"
     * "a working washing machine" -> stockPhotoQuery: "vintage laundry washing machine rustic outdoor shack"
     * "a treadmill" -> stockPhotoQuery: "treadmill fitness equipment inside rustic wooden shed"

5. HIGH-RETENTION TEXT CALLOUT OVERLAYS (AI Auto-Detect from Narration):
   To maintain strong YouTube/documentary visual pacing, you MUST actively generate a 'callout' on approximately 40%–50% of beats (every key milestone, fact, person, evidence, date, number, location, or charge):
   
   CATEGORIES TO ALWAYS HIGHLIGHT:
   1. NAMED PERSONS & PROFILES → type: "lower_third", line1: person's full name, line2: contextual role
      * "Steven Irwin built this" -> callout: { type: "lower_third", line1: "Steven Irwin", line2: "Cabin Builder" }
      * "Neighbors spot Steve back on the hillside" -> callout: { type: "lower_third", line1: "Steve", line2: "Repeat Suspect" }
      * "Suarez, on scene that day" -> callout: { type: "lower_third", line1: "Officer Suarez", line2: "Responding Officer" }
   
   2. DATES & TIMELINES → type: "center_title", line1: the exact date or milestone
      * "April 2024. Neighbors spot Steve..." -> callout: { type: "center_title", line1: "April 2024" }
      * "Then October 2024. A fourth arrest." -> callout: { type: "center_title", line1: "October 2024" }
      * "six months earlier" -> callout: { type: "center_title", line1: "6 Months Earlier" }
   
   3. KEY STATS, FINANCIALS & COUNTS → type: "center_title", line1: the punchy stat
      * "bail at thirty-five thousand dollars" -> callout: { type: "center_title", line1: "$35,000 Bail" }
      * "his third arrest since October" -> callout: { type: "center_title", line1: "3rd Arrest" }
      * "Todd lived 17 years without a home" -> callout: { type: "center_title", line1: "17 Years Homeless" }
      * "The total cost was $2,000" -> callout: { type: "center_title", line1: "$2,000 Total Cost" }
   
   4. DRAMATIC CHARGES, KEY EVIDENCE & CRUCIAL ACTIONS → type: "lower_third" or "center_title"
      * "charged him with second-degree identity theft" -> callout: { type: "lower_third", line1: "Identity Theft", line2: "2nd-Degree Charge" }
      * "heavy machinery again" -> callout: { type: "lower_third", line1: "Heavy Machinery", line2: "Illegal Excavation" }
      * "Police found multiple stolen identification cards" -> callout: { type: "lower_third", line1: "Stolen ID Cards", line2: "Evidence Recovered" }
      * "generators, fireplaces, propane heaters" -> callout: { type: "lower_third", line1: "Full Electrical Grid", line2: "Underground Encampment" }
   
   5. LOCATIONS & CRIME SCENES → type: "lower_third", line1: location name, line2: "Location"
      * "Up on Beacon Hill" -> callout: { type: "lower_third", line1: "Beacon Hill", line2: "Seattle, WA" }
      * "Dr. José Rizal Park" -> callout: { type: "lower_third", line1: "Dr. José Rizal Park", line2: "Park Location" }
      * "Seneca Road on the edge of Eugene, Oregon" -> callout: { type: "lower_third", line1: "Seneca Road", line2: "Eugene, Oregon" }
   
   - If a beat is purely connective filler (e.g. "and then", "but if you walk"), set callout: null.
   - Target: 8 to 14 high-impact callouts per 1-minute video!

6. 100% SCRIPT INTEGRITY:
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
      "stockPhotoQuery": "<physical gritty high-res real photo search query>",
      "stockVideoQuery": "<2-3 word gritty video query OR null>",
      "backupVideoQuery": "<alternative gritty query OR null>",
      "cameraStyle": "zoom_in" | "zoom_out" | "pan_left" | "pan_right" | "fast_cut",
      "reason": "<director reason>",
      "callout": {
        "type": "lower_third" | "center_title" | null,
        "line1": "<primary bold text>",
        "line2": "<subtitle text, lower_third only>"
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
    callout: b.callout?.type ? {
      type: b.callout.type as 'lower_third' | 'center_title',
      line1: String(b.callout.line1 || '').trim(),
      line2: b.callout.line2 ? String(b.callout.line2).trim() : undefined,
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
        mediaType: 'image', // Photo-first for dynamic sub-shots
        cameraStyle: vector,
        stockPhotoQuery: subPhotoQuery,
        // Only trigger the callout on the first sub-shot of the sentence
        callout: s === 0 ? timedBeat.callout : null,
      });
    }
  }

  return finalTimed;
}
