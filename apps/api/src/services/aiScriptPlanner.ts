import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { CalloutType, CalloutThemeColor, SceneLayoutType } from '@repo/shared';

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
  text: string; // complete spoken text for this scene (2.0s – 3.8s worth of narration)

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

  // Text overlay callout for this beat
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
  projectContext: string = ''
): Promise<AIPlannerResult> {
  const cleanScript = (scriptText || '').trim();
  if (!cleanScript || cleanScript === 'Full Narration Track') {
    throw new Error(
      'Script text is empty. Please ensure voiceover is transcribed or paste the script text in the dashboard.'
    );
  }

  const systemPrompt = `You are an elite investigative documentary director (Vice, Vox Borders, BBC Eye Witness, Netflix Documentaries, and Magnates Media). You direct gritty, high-retention short-form documentaries about real people, hidden places, crime, survival, and investigative journalism.

You will receive a voiceover script. Your job is to break it into a cinematic visual timeline, select the best SCENE PRESENTATION LAYOUT, specify MULTI-ASSET STOCK QUERIES when needed, and write punchy, authentic TEXT CALLOUTS.

---

### 1. VISUAL BEATS & PACING:
- Break the script into beats of 2.0s – 3.8s each (never exceed 4.5s).
- If a sentence is long (>4.5s), split it into 2–3 separate shots with different angles.
- For list-style narration (e.g. "generators, fireplaces, propane heaters"), give each item its own beat.
- Pick mediaType="video" for action, movement, machinery, weather, drama.
- Pick mediaType="image" for establishing locations, portraits, evidence, static objects.
- stockVideoQuery / stockPhotoQuery: 2–3 concrete visual words MAX. No full sentences.

---

### 2. SCENE PRESENTATION LAYOUTS (11 Unique Styles):
Use "full_bleed_cinematic" as the primary default baseline for most beats.
Pacing Rule: Introduce ~3 stylized multi-layer layouts per 60 seconds (every 4–6 beats) at key narrative moments.

Available Layouts:
- "full_bleed_cinematic": Fullscreen 16:9 + 2.35:1 Cinema Letterbox Bars + 35mm Film Grain (Default for heavy action, establishing drone b-roll).
- "ambient_blur_frame": Floating 3D card over bright softened ambient mirror background (Great for portrait photos, stats).
- "vintage_crt_monitor": Retro 1990s beige broadcast terminal on studio desk with scanlines & green timecode (Best for police radio, wiretaps, surveillance, CCTV).
- "filmstrip_spool_reel": Horizontal 35mm film negative ribbon with perforated sprockets scrolling sideways on warm ivory paper (Best for photo archives, timelines).
- "editorial_sidebar_column": 72/28 Asymmetric Video on left + Ivory investigative data rail on right (Best for news articles, court records, deep journalism).
- "red_string_pinboard": Light blonde corkboard with connected red strings & 3D camera swoop (Best for connecting suspects, clues, locations).
- "horizon_top_bottom_split": 50/50 Horizontal Split: Aerial Top + Ground Bottom (Best for aerial vs ground comparisons, before vs after).
- "parallax_triptych_gallery": 3-Panel 3D Parallax Triptych on bright gallery wall (Best for presenting 3 suspects, 3 locations, or 3-step timeline).
- "quad_surveillance_matrix": 2x2 Multi-Angle Forensic CCTV Grid (Best for multi-angle police raids, perimeter surveillance, building sweeps).
- "polaroid_scatter_desk": Organic polaroid photo scatter on blonde oak desk (Best for eyewitness photos, family memories, physical evidence).
- "magnifying_loupe_inspector": Circular optical magnifying loupe gliding over an archival map (Best for GPS coordinates, property boundaries, signatures, blueprints).

---

### 3. MULTI-ASSET STOCK QUERIES:
When you choose a multi-asset layout, provide "additionalStockQueries" array so all slots get real matching footage:
- "quad_surveillance_matrix" ➔ provide 3 additional queries for CAM 02, CAM 03, CAM 04 (e.g. slot="cam2", slot="cam3", slot="cam4").
- "parallax_triptych_gallery" ➔ provide 2 additional queries for Left and Right panels (slot="left_wing", slot="right_wing").
- "red_string_pinboard" ➔ provide 2 additional queries for Clue Photo A and B (slot="clue_a", slot="clue_b").
- "polaroid_scatter_desk" ➔ provide 2 additional queries for Photo 1 and Photo 2.
- "horizon_top_bottom_split" ➔ provide 1 additional query for the ground shot (slot="ground_view").

---

### 4. TEXT CALLOUTS (20 Documentary Styles):
Generate a callout on ~70–80% of beats. Write like a headline editor at Vice or NYT — specific, punchy, story-driven (3–7 words per line). Never write generic label summaries.

Available Callout Types:
- "newspaper_headline": Newsprint with animated yellow marker highlighter sweep.
- "redacted_dossier": Manila FBI dossier with peeling black redaction bars & red DECLASSIFIED stamp.
- "polaroid_snapshot": Polaroid frame with translucent scotch tape & handwritten Sharpie caption.
- "typewriter_paper": Parchment card with mechanical character-by-character typewriter typing.
- "marker_circle": Matte card with animated hand-drawn red marker oval sketching around key fact.
- "wiretap_intercept": Tactical surveillance card with live audio waveform equalizer & blinking REC.
- "editorial_lower_third": BBC/NYT clean matte card with thick vertical rule and bold typography.
- "police_crime_sheet": Booking record with charges and matte red ARRESTED stamp impact.
- "odometer_stat": Massive financial or numerical statistic (e.g. "$35,000 BAIL").
- "map_pingeotag": Minimalist monochrome coordinates pill with vector pin dot & GPS lat/long.
- "editorial_quote": Literary magazine quote with giant ochre quotation marks & attribution.
- "social_tweet_card": Matte dark-mode X/Twitter card with avatar, handle, verified badge, & tweet text.
- "reddit_thread_card": Reddit thread card with r/community tag, upvote counter, and discussion quote.
- "caution_tape_banner": Slanted yellow/black police hazard barrier tape with stencil warning.
- "archival_evidence_tag": Kraft evidence tag with metal grommet/hole & stamped exhibit ID.
- "split_milestone_card": Dual-box badge with charcoal date header + burnt-amber milestone text.
- "karaoke_captions": Dynamic word-by-word subtitle card with high-contrast active word box.
- "fullscreen_chapter_title": Minimalist chapter title opener with Roman numeral & line rule.
- "court_transcript_card": Official court deposition transcript with line numbers 01–04 & Q&A.
- "forensic_data_card": Clean forensic telemetry card with barcode, checksum hash, & timestamp.

---

### 5. SMART PAIRING RECOMMENDATIONS:
- "police_crime_sheet" or "wiretap_intercept" ➔ pair with "vintage_crt_monitor"
- "newspaper_headline" or "editorial_quote" ➔ pair with "editorial_sidebar_column"
- "map_pingeotag" or "forensic_data_card" ➔ pair with "magnifying_loupe_inspector"
- "redacted_dossier" or "archival_evidence_tag" ➔ pair with "red_string_pinboard"
- "polaroid_snapshot" ➔ pair with "polaroid_scatter_desk"
- "split_milestone_card" ➔ pair with "horizon_top_bottom_split" or "filmstrip_spool_reel"

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
      "clipFilename": "<exact filename from available list OR null>",
      "stockVideoQuery": "<2-3 word video search query OR null>",
      "backupVideoQuery": "<alternative 2-3 word query OR null>",
      "stockPhotoQuery": "<2-3 word photo search query OR null>",
      "additionalStockQueries": [
        { "slot": "cam2", "query": "police flashing lights night", "mediaType": "video" }
      ],
      "cameraStyle": "zoom_in" | "zoom_out" | "pan_left" | "pan_right" | "fast_cut",
      "reason": "<one-sentence director reason>",
      "callout": {
        "type": "<one of the 20 callout types above>",
        "line1": "<punchy primary text, 3-7 words>",
        "line2": "<real contextual subtitle OR null>",
        "spokenTrigger": "<exact 2-4 words from voiceover>",
        "themeColor": "gold" | "amber" | "cyan" | "crimson" | "emerald" | "slate" | "white"
      }
    }
  ]
}`;

  const userMessage = `Full Script to Direct:\n\n${cleanScript}`;

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

export function mapPlannedBeatsToTiming(
  beats: PlannedBeat[],
  alignments: Array<{ start: number; end: number; text: string }>,
  totalDuration: number
): TimedPlannedBeat[] {
  if (!beats.length) return [];

  const perBeatDuration = totalDuration / beats.length;

  return beats.map((beat, i) => {
    const startTime = i * perBeatDuration;
    const endTime = i === beats.length - 1 ? totalDuration : (i + 1) * perBeatDuration;

    return {
      ...beat,
      startTime: Number(startTime.toFixed(2)),
      endTime: Number(endTime.toFixed(2)),
      resolvedPath: null,
    };
  });
}
