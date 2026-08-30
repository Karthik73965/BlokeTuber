import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { CalloutType, CalloutThemeColor, SceneLayoutType } from '@repo/shared';
import { findPhraseTimestamp, SegmentAlignment } from './whisperAlignment';

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
  text: string; // complete spoken text for this scene (2.5s – 7.0s worth of narration)

  // Media type: Real authentic video is always primary
  mediaType: 'video' | 'image';

  // Scene presentation layout
  layout?: SceneLayoutType;

  // If local clip library has a direct match
  clipFilename: string | null;

  // Real stock video cinematographer search terms
  stockVideoQuery: string | null; // Primary cinematic search (e.g. "aerial drone railway tracks sunset")
  backupVideoQuery: string | null; // Alternative cinematic angle (e.g. "moody train tracks dusk")

  // Real photography fallback query (only if video fails)
  stockPhotoQuery: string | null;

  // For multi-asset layouts (Quad Surveillance, Triptych, Pinboard, Polaroid Scatter, Horizon Split):
  additionalStockQueries?: Array<{
    slot: string; // e.g. "cam2", "cam3", "cam4" or "left_wing", "right_wing"
    query: string;
    mediaType: 'video' | 'image';
  }>;

  // Camera direction for rendering
  cameraStyle?: string;

  // Director reasoning
  reason: string;

  // Text overlay callout for this beat (optional — only for high-impact moments)
  callout?: {
    type: CalloutType;
    line1: string; // primary bold text (name, date, stat, location)
    line2?: string; // subtitle (role, context, location details)
    spokenTrigger?: string; // exact 2-4 spoken words from voiceover that trigger this callout
    themeColor?: CalloutThemeColor;
  } | null;
}

export interface AIPlannerResult {
  beats: PlannedBeat[];
}

export interface TimedPlannedBeat extends PlannedBeat {
  startTime: number;
  endTime: number;
  resolvedPath: string | null;
  additionalClipPaths?: string[];
}

/**
 * Extracts and parses JSON from LLM response safely.
 */
function extractAndParseJson(raw: string): any {
  if (!raw || typeof raw !== 'string') return null;

  let clean = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```\s*$/i, '')
    .trim();

  clean = clean.replace(/```json?\n?/gi, '').replace(/```/g, '').trim();

  try {
    return JSON.parse(clean);
  } catch {}

  const firstOpen = clean.indexOf('{');
  const lastClose = clean.lastIndexOf('}');
  if (firstOpen !== -1 && lastClose > firstOpen) {
    try {
      return JSON.parse(clean.slice(firstOpen, lastClose + 1));
    } catch {}
  }

  return null;
}

export async function planScriptWithAI(
  scriptText: string,
  availableClips: string[],
  projectContext: string = '',
  chapterContext: string = ''
): Promise<AIPlannerResult> {
  const cleanScript = (scriptText || '').trim();
  if (!cleanScript || cleanScript === 'Full Narration Track') {
    throw new Error(
      'Script text is empty. Please ensure voiceover is transcribed or paste the script text in the dashboard.'
    );
  }

  const contextDirective = [
    projectContext ? `PROJECT STORY PREMISE: "${projectContext}"` : '',
    chapterContext ? `CHAPTER VISUAL & PACING DIRECTIVE: "${chapterContext}"` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const systemPrompt = `You are an elite investigative documentary director (Vice, Vox Borders, BBC Eye Witness, Netflix Documentaries, and Magnates Media). You direct gritty, high-retention short-form documentaries about real people, hidden places, crime, survival, and investigative journalism.

You will receive a voiceover script along with specific Chapter Visual Directives. Your job is to break it into a dynamic, rhythmically balanced visual timeline using SMART VARIABLE PACING: longer 5–7s beats for stylized layouts and text animations, and fast 2.5–3.5s punchy cuts for clean cinematic b-roll.

${contextDirective ? `\n⚠️ STRICT DIRECTOR BRIEF:\n${contextDirective}\n` : ''}

---

### 1. CHARACTER PROFILE, DEMOGRAPHICS & SETTING CONSISTENCY (CRITICAL MANDATORY RULE):
- You MUST anchor every single visual beat to the exact character demographics, age, environment, vehicle, and visual tone specified in the Director Brief.
- If the story is about an elderly/older woman living in a van / vehicle:
  - You MUST explicitly include "elderly senior woman", "older female nomad", "vintage camper van", "rural highway", "dusty roadside" in your search queries.
  - You are STRICTLY FORBIDDEN from generating generic queries like "woman calling phone", "girl in apartment", "young model thinking", or "modern office worker" which return out-of-context modern stock clips!
- Every visual shot MUST align 100% with the literal spoken words of that beat (e.g. if narration mentions driving -> search "elderly woman driving car windshield", if narration mentions cold winter -> search "senior woman bundled warm inside van").

---

### 2. DYNAMIC VARIABLE BEAT PACING (Macro vs Micro Beats):

🎯 **HERO FEATURE BEATS (5.0s – 7.0s / ~12–20 words / 1–2 full sentences)**:
- Whenever you deploy a **Stylized Scene Layout** (e.g. Quad Matrix, Triptych, Red-String Pinboard, Vintage CRT, Filmstrip, Loupe, Polaroid Scatter, Editorial Column) OR an **Elaborate Text Callout**.
- Group enough narration (12–20 words / full thought) into this single beat so the visual layout has 5–7 seconds of runway to animate in smoothly, reveal details, let the viewer absorb the evidence, and exit cleanly without rushing.

⚡ **BASELINE B-ROLL BEATS (2.5s – 3.5s / ~6–9 words / short phrase)**:
- For pure atmospheric momentum, establishing shots, fast action cuts, and scene transitions.
- Set layout="full_bleed_cinematic" and callout=null.
- Fast, rhythmic cuts that keep viewer retention high between feature moments.

---

### 3. SMART SPARSITY & FREQUENCY ("Be Smart, Play Smart"):
- **NEVER crowd every beat with layouts or callouts!** That causes visual fatigue.
- **Rule of 30/70**:
  - **~30% Feature Beats**: Only ~3 to 4 beats per 60 seconds (every 4–6 beats) should have a stylized layout or text callout.
  - **~70% Baseline Beats**: The vast majority of the documentary must remain clean, cinematic full-bleed b-roll with zero text overlays.
- Introduce stylized layouts ONLY at pivotal narrative beats (e.g. revealing a suspect, analyzing surveillance tapes, examining GPS coordinates, highlighting a major statistic, or uncovering classified documents).

---

### 4. SCENE PRESENTATION LAYOUTS (11 Unique Styles):
- "full_bleed_cinematic": Fullscreen 16:9 + 2.35:1 Cinema Letterbox Bars + 35mm Film Grain (Default baseline for 70% of beats).
- "ambient_blur_frame": Floating 3D card over bright softened ambient mirror background (Great for portrait photos, stats).
- "vintage_crt_monitor": Retro 1990s beige broadcast terminal on studio desk with scanlines & green timecode (Best for police radio, wiretaps, CCTV).
- "filmstrip_spool_reel": Horizontal 35mm film negative ribbon scrolling sideways on warm ivory paper (Best for archival photos, timelines).
- "editorial_sidebar_column": 72/28 Asymmetric Video on left + Ivory investigative data rail on right (Best for news articles, court records).
- "red_string_pinboard": Light blonde corkboard with connected red strings & 3D camera swoop (Best for connecting suspects, clues, locations).
- "horizon_top_bottom_split": 50/50 Horizontal Split: Aerial Top + Ground Bottom (Best for aerial vs ground comparisons, before vs after).
- "parallax_triptych_gallery": 3-Panel 3D Parallax Triptych on bright gallery wall (Best for presenting 3 suspects, 3 locations, or 3-step timeline).
- "quad_surveillance_matrix": 2x2 Multi-Angle Forensic CCTV Grid (Best for multi-angle police raids, perimeter surveillance, building sweeps).
- "polaroid_scatter_desk": Organic polaroid photo scatter on blonde oak desk (Best for eyewitness photos, physical evidence).
- "magnifying_loupe_inspector": Circular optical magnifying loupe gliding over an archival map (Best for GPS coordinates, property boundaries, blueprints).

---

### 5. MULTI-ASSET STOCK QUERIES:
When you choose a multi-asset layout, provide "additionalStockQueries" array so all slots get real matching footage:
- "quad_surveillance_matrix" ➔ provide 3 additional queries for CAM 02, CAM 03, CAM 04 (e.g. slot="cam2", slot="cam3", slot="cam4").
- "parallax_triptych_gallery" ➔ provide 2 additional queries for Left and Right panels (slot="left_wing", slot="right_wing").
- "red_string_pinboard" ➔ provide 2 additional queries for Clue Photo A and B (slot="clue_a", slot="clue_b").
- "polaroid_scatter_desk" ➔ provide 2 additional queries for Photo 1 and Photo 2.
- "horizon_top_bottom_split" ➔ provide 1 additional query for the ground shot (slot="ground_view").

---

### 6. TEXT CALLOUTS (20 Documentary Styles):
Generate callouts ONLY on high-impact story moments (~30–40% of beats). Write like a headline editor at Vice or NYT — specific, punchy, story-driven (3–7 words per line).
- "newspaper_headline", "redacted_dossier", "polaroid_snapshot", "typewriter_paper", "marker_circle", "wiretap_intercept", "editorial_lower_third", "police_crime_sheet", "odometer_stat", "map_pingeotag", "editorial_quote", "social_tweet_card", "reddit_thread_card", "caution_tape_banner", "archival_evidence_tag", "split_milestone_card", "karaoke_captions", "fullscreen_chapter_title", "court_transcript_card", "forensic_data_card".

---

---

### 8. CUSTOM SCENE-SPECIFIC LAYOUT METADATA (MANDATORY FOR STYLIZED LAYOUTS):
Every stylized layout MUST have unique, scene-specific text generated in "layoutData" matching the exact context of what is happening in that beat. NEVER USE GENERIC PLACEHOLDERS!
- For "quad_surveillance_matrix": provide "camLabels": 4 custom camera names tailored to this scene (e.g. ["DASHCAM // ROUTE 66", "CABIN REAR // LIVING AREA", "SIDE MIRROR // NIGHT HIGHWAY", "OVERHEAD SATELLITE"]).
- For "editorial_sidebar_column": provide "title" (e.g. "EVICTION TRANSCRIPT"), "subtitle" (e.g. "NOTICE TO VACATE • 2018"), "tag" (e.g. "HOUSING FORENSICS"), "coords" (e.g. "QUARTZSITE, AZ • 33.66° N, 114.22° W").
- For "vintage_crt_monitor": provide "title" (e.g. "POLICE DISPATCH AUDIO"), "tag" (e.g. "FREQ: 460.125 MHz"), "timestamp" (e.g. "OCTOBER 1995 • 04:18 AM").
- For "red_string_pinboard": provide "notes": 3 evidence notes matching the scene (e.g. ["1995 FORD ECONOLINE", "FINAL EVICTION NOTICE", "PENSION $740/MO"]).
- For "polaroid_scatter_desk": provide "notes": 3 photo handwriting captions (e.g. ["CAMPGROUND SPOT #4", "VEHICLE REPAIRS", "WINTER 2019"]).
- For "magnifying_loupe_inspector": provide "title" (e.g. "PROPERTY BOUNDARY SURVEY"), "coords" (e.g. "PARK LIMITS • SECTOR 09"), "stamp" (e.g. "PUBLIC LAND BOUNDARY").
- For "horizon_top_bottom_split": provide "title" (e.g. "DESERT ENCAMPMENT"), "subtitle" (e.g. "AERIAL PERSPECTIVE vs GROUND REALITY").
- For "filmstrip_spool_reel": provide "title" (e.g. "HISTORICAL TIMELINE"), "tag" (e.g. "35MM ARCHIVE • 1998").
- For "ambient_blur_frame": provide "title" (e.g. "SUBJECT PROFILE"), "subtitle" (e.g. "AGE 71 • NOMAD RESIDENT").

---

Respond with ONLY a valid JSON object in this exact format:
{
  "beats": [
    {
      "beatIndex": 0,
      "chapterIndex": 0,
      "text": "<exact spoken text for this beat>",
      "mediaType": "video" | "image",
      "layout": "<one of the 11 layouts above>",
      "layoutData": {
        "title": "<scene specific title>",
        "subtitle": "<scene specific subtitle>",
        "tag": "<scene specific forensic tag>",
        "coords": "<location coordinates or city>",
        "camLabels": ["CAM 01 // LOC", "CAM 02 // LOC", "CAM 03 // LOC", "CAM 04 // LOC"],
        "notes": ["NOTE 1", "NOTE 2", "NOTE 3"],
        "timestamp": "<time or date>",
        "stamp": "<stamp or badge>"
      },
      "clipFilename": "<exact filename from available list OR null>",
      "stockVideoQuery": "<concrete visual query matching character demographics & setting OR null>",
      "backupVideoQuery": "<alternative visual query OR null>",
      "stockPhotoQuery": "<concrete photo query OR null>",
      "additionalStockQueries": [
        { "slot": "cam2", "query": "senior woman hands steering wheel", "mediaType": "video" }
      ],
      "cameraStyle": "zoom_in" | "zoom_out" | "pan_left" | "pan_right" | "fast_cut",
      "reason": "<one-sentence director reason>",
      "callout": {
        "type": "<one of the 20 callout types above>",
        "line1": "<punchy primary text, 3-7 words>",
        "line2": "<real contextual subtitle OR null>",
        "spokenTrigger": "<exact 2-4 words from voiceover>",
        "themeColor": "gold" | "amber" | "cyan" | "crimson" | "emerald" | "slate" | "white"
      } | null
    }
  ]
}`;

  const userMessage = `${contextDirective ? `${contextDirective}\n\n` : ''}Full Script to Direct:\n\n${cleanScript}`;

  const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
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
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI Director failed (${response.status}): ${errText}`);
  }

  const rawJson = await response.json();
  const rawContent = rawJson.choices?.[0]?.message?.content || '';
  const parsed = extractAndParseJson(rawContent);

  if (!parsed || !Array.isArray(parsed.beats) || parsed.beats.length === 0) {
    throw new Error('AI Director failed to produce valid scene beats.');
  }

  return { beats: parsed.beats };
}

/**
 * Maps planned beats to exact audio timestamps using dynamic word-weighting and Whisper phrase boundaries.
 * Gives 5–7s to feature beats (with layouts/callouts) and 2.5–3.5s to baseline beats.
 */
export function mapPlannedBeatsToTiming(
  beats: PlannedBeat[],
  alignments: SegmentAlignment[],
  totalDuration: number
): TimedPlannedBeat[] {
  if (!beats.length) return [];

  const wordCounts = beats.map((b) => Math.max(1, (b.text || '').trim().split(/\s+/).filter(Boolean).length));
  const totalWords = wordCounts.reduce((sum, w) => sum + w, 0);

  let currentStart = 0;

  return beats.map((beat, i) => {
    const wordCount = wordCounts[i]!;
    let beatDuration = (wordCount / totalWords) * totalDuration;

    // Check if Whisper has exact phrase alignment for this beat's text
    if (alignments && alignments.length > 0) {
      const phraseTs = findPhraseTimestamp(beat.text, alignments);
      if (phraseTs && phraseTs.end > phraseTs.start) {
        const whisperDuration = phraseTs.end - phraseTs.start;
        if (whisperDuration >= 2.0 && whisperDuration <= totalDuration * 0.5) {
          beatDuration = whisperDuration;
        }
      }
    }

    // Minimum 2.2s threshold so no cut is jarring
    beatDuration = Math.max(2.2, beatDuration);

    let endTime = currentStart + beatDuration;
    if (i === beats.length - 1 || endTime > totalDuration) {
      endTime = totalDuration;
    }

    const timed: TimedPlannedBeat = {
      ...beat,
      startTime: Number(currentStart.toFixed(2)),
      endTime: Number(endTime.toFixed(2)),
      resolvedPath: null,
    };

    currentStart = endTime;
    return timed;
  });
}
