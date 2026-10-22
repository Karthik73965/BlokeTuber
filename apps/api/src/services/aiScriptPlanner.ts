import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { CalloutType, CalloutThemeColor, SceneLayoutType, SceneLayoutData, OverlayType, TransitionType } from '@repo/shared';
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
const PLANNER_MODEL = process.env.PLANNER_MODEL || 'google/gemini-2.5-flash';

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
  layoutData?: SceneLayoutData;

  // If local clip library has a direct match
  clipFilename: string | null;

  // Concrete visual physical subject (e.g. "car_interior_seat", "rural_highway_driving")
  visualSubject?: string;

  // Real stock video cinematographer search terms
  stockVideoQuery: string | null; // Primary cinematic search (e.g. "aerial drone railway tracks sunset")
  backupVideoQuery: string | null; // Alternative cinematic angle (e.g. "moody train tracks dusk")

  // Real photography fallback query (only if video fails)
  stockPhotoQuery: string | null;

  // Explicit negative keywords to filter out conflicting stock
  negativeKeywords?: string[];

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

  // Visual atmosphere overlay for this beat (12 styles)
  overlay?: OverlayType | null;

  // Cinematic scene transition entering this beat (8 styles)
  transition?: TransitionType;

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

  // Handle truncated JSON array (e.g. LLM hit token ceiling)
  if (clean.includes('"beats"') && firstOpen !== -1) {
    const fromRoot = clean.slice(firstOpen);
    const lastObjClose = fromRoot.lastIndexOf('}');
    if (lastObjClose !== -1) {
      const candidate = fromRoot.slice(0, lastObjClose + 1) + '\n]}';
      try {
        const parsed = JSON.parse(candidate);
        if (Array.isArray(parsed.beats) && parsed.beats.length > 0) {
          console.log(`[AI Planner] Successfully repaired truncated beats JSON (${parsed.beats.length} beats recovered)!`);
          return parsed;
        }
      } catch {}
    }
  }

  return null;
}

export async function planScriptWithAI(
  scriptText: string,
  availableClips: string[],
  projectContext: string = '',
  chapterContext: string = '',
  pacing: 'low' | 'medium' | 'high' = 'medium',
  audioDuration?: number
): Promise<AIPlannerResult> {
  const cleanScript = (scriptText || '').trim();
  if (!cleanScript || cleanScript === 'Full Narration Track') {
    throw new Error(
      'Script text is empty. Please ensure voiceover is transcribed or paste the script text in the dashboard.'
    );
  }

  const pacingDirectives = {
    low: `⏱️ TARGET PACING DIRECTIVE: RELAXED / CINEMATIC (LOW PACING: ~4.5s – 6.0s per clip / ~10–16 words per beat).
- Let scenes linger and breathe. Hold shots for emotional weight and evidence absorption.
- MANDATORY DURATION: Every beat must be between 2.5s and 5.0s. Never less than 3.0s, never more than 6.0s.
- Stylized layouts and text callouts hold for 4.5s–6.0s. Baseline b-roll holds for 3.5s–5.5s.`,
    medium: `⏱️ TARGET PACING DIRECTIVE: BALANCED INVESTIGATIVE (MEDIUM PACING: ~3.5s – 5.0s per clip / ~8–14 words per beat).
- Standard investigative documentary rhythm. 4.0s–5.5s for feature layouts/callouts, 3.0s–4.5s for punchy baseline b-roll cuts.
- MANDATORY DURATION: Every beat must be between 2.5s and 5.0s. Never less than 3.0s, never more than 6.0s.`,
    high: `⏱️ TARGET PACING DIRECTIVE: DYNAMIC DOCUMENTARY (HIGH PACING: ~3.0s – 4.5s per clip / ~8–12 words per beat; MAXIMUM 6.0s).
- High visual engagement with balanced documentary pacing.
- MANDATORY DURATION: NO beat can EVER be less than 3.0 seconds (~8 words minimum). NO beat can EVER exceed 5.0 seconds (~16 words maximum).
- Feature layouts and text callouts hold between 3.5s and 5.5s.
- Baseline b-roll cuts every 3.0s to 4.5s.
- DO NOT create micro-beats or 1-second cuts! Every cut must stay on screen for AT LEAST 3.0 seconds so viewers can absorb the shot.`,
  }[pacing] || '';

  let audioTimingDirective = '';
  if (audioDuration && audioDuration > 0) {
    const targetCutAvg = pacing === 'high' ? 3.8 : pacing === 'medium' ? 4.5 : 5.2;
    const estCuts = Math.max(4, Math.round(audioDuration / targetCutAvg));
    const minCuts = Math.max(3, Math.round(estCuts * 0.8));
    const maxCuts = Math.round(estCuts * 1.2);
    audioTimingDirective = `⏱️ AUDIO TIMING & CUT FREQUENCY DIRECTIVE:\n- Total narration audio duration is ~${Math.round(audioDuration)} seconds.\n- For ${pacing.toUpperCase()} pacing, you MUST produce approximately ${minCuts} to ${maxCuts} distinct scene cuts!\n- STRICT RULE: Every single beat must be between 2.5s and 5.0s in length (approx 8 to 16 spoken words). NEVER create beats under 3.0s or over 6.0s.`;
  }

  let availableClipsDirective = '';
  if (availableClips && availableClips.length > 0) {
    availableClipsDirective = `📁 AUTHENTIC LOCAL RAW FOOTAGE & PHOTOS (MANDATORY HIGHEST PRIORITY):\n` +
      `The filmmaker has provided ${availableClips.length} authentic, real-life documentary assets in their library:\n` +
      availableClips.map((c) => `  - "${c}"`).join('\n') +
      `\n\nCRITICAL DIRECTIVE:\n` +
      `- Whenever the narration mentions Gregory Kloehn, building tiny homes, the workshop, dumpster homes (interior or exterior), blueprints/plans, volunteers, or residents showing their homes, YOU MUST SET "clipFilename" to the EXACT matching filename from the list above instead of stock footage!\n` +
      `- When "clipFilename" is set, set "mediaType" to "image" if it ends in .jpg/.jpeg/.png/.webp, or "video" if it ends in .mp4/.mov.\n` +
      `- For "Plan , blueprint of dumpster home.jpg", choose layout "forensic_drafting_table"!\n` +
      `- For "Clear picture of Kloehn.jpg", choose layout "ambient_blur_frame" or "museum_archive_matte"!\n` +
      `- For "inside the dumpster home.jpg", choose layout "ambient_blur_frame" or "split_dual_screen"!\n` +
      `- When no local asset is appropriate (e.g. general Oakland streets, recycling scales, cash, night traffic, aerial city skyline), set "clipFilename": null and provide high-quality stockVideoQuery / stockPhotoQuery.`;
  }

  const contextDirective = [
    projectContext ? `PROJECT STORY PREMISE: "${projectContext}"` : '',
    chapterContext ? `CHAPTER VISUAL & PACING DIRECTIVE: "${chapterContext}"` : '',
    availableClipsDirective,
    pacingDirectives,
    audioTimingDirective,
  ]
    .filter(Boolean)
    .join('\n\n');

  const systemPrompt = `You are an elite investigative documentary director (Vice, Vox Borders, BBC Eye Witness, Netflix Documentaries, and Magnates Media). You direct gritty, high-retention short-form documentaries about real people, hidden places, crime, survival, and investigative journalism.

You will receive a voiceover script along with specific Chapter Visual Directives. Your job is to break it into a dynamic, rhythmically balanced visual timeline matching the requested PACING DIRECTIVE.

${contextDirective ? `\n⚠️ STRICT DIRECTOR BRIEF:\n${contextDirective}\n` : ''}

---

### 1. CHARACTER PROFILE, DEMOGRAPHICS & STRICT VISUAL LITERALISM (CRITICAL MANDATORY RULE):
- You MUST anchor every single visual beat to the exact character demographics, age, environment, vehicle, and visual tone specified in the Director Brief.
- If the story is about an elderly/older woman living in a van / vehicle:
  - You MUST explicitly include "elderly senior woman", "older female nomad", "vintage camper van", "rural highway", "dusty roadside" in your search queries.
  - You are STRICTLY FORBIDDEN from generating generic queries like "woman calling phone", "girl in apartment", "young model thinking", or "modern office worker" which return out-of-context modern stock clips!
- **STRICT ANTI-METAPHOR / LITERAL PHYSICAL RULE**:
  - Separate what is **SPOKEN** (voiceover) from what is **SEEN** (camera shot).
  - Voiceovers often use metaphors (e.g. "she washed away her past while sitting in her car"). **NEVER search for the metaphor ("washing dishes/sink")!** You MUST search for the LITERAL PHYSICAL SUBJECT ("elderly woman car seat interior" or "car driver seat").
  - Provide "visualSubject": a 2-4 word concrete physical environment (e.g. "car_seat_interior", "van_backseat", "rural_highway_driving", "cash_wallet_dollars").
  - Provide "negativeKeywords": an array of 3-5 conflicting objects to filter out (e.g. ["kitchen", "dishes", "restaurant", "modern apartment", "baby stroller"]).
- Every visual shot MUST align 100% with the literal physical action of that beat (e.g. if narration mentions driving -> search "elderly woman driving car windshield", if narration mentions cold winter -> search "senior woman bundled warm inside van").

---

### 2. STRICT BEAT PACING CONSTRAINTS (MANDATORY 2.5s – 5.0s PER BEAT):
- **ABSOLUTE MINIMUM DURATION: 3.0 SECONDS (~8 spoken words)**. Never create short 1-second or 2-second micro-cuts. Cuts faster than 3 seconds cause visual whiplash and audio mismatch.
- **ABSOLUTE MAXIMUM DURATION: 5.0 SECONDS (~16 spoken words)**. Never let any single shot drag beyond 6 seconds.
- Baseline B-Roll Beats: 3.0s – 5.0s (~8–14 words).
- Feature Layouts & Text Callouts: 3.5s – 5.5s (~9–15 words).
- Every beat MUST cover a coherent thought or full sentence. Do NOT fragment sentences into 2-word micro-beats.

---

### 3. MANDATORY INTRO CALLOUT (CRITICAL — NEVER SKIP):
- **beatIndex 0 (the very first beat) MUST ALWAYS have a callout.** No exceptions.
- The intro callout should be a bold, punchy editorial_lower_third or newspaper_headline that immediately hooks the viewer.
- Use the subject's name, location, or a single explosive fact from the opening narration.
- This is the viewer's first impression — make it count.

---

### 3. STORY-FIRST DOCUMENTARY VISUAL RHYTHM (CRITICAL):
- **85–90% Clean Full-Bleed Cinematic**: The vast majority of beats MUST be clean "full_bleed_cinematic" video or photo with subtle Ken Burns motion. Real documentaries (Vox, Frontline, NYT) let the footage breathe and tell the story.
- **Stylized Layouts ONLY When Directly Called For**: Use stylized layouts sparingly (only ~10–15% of beats) when presenting specific physical evidence, architectural plans, or documents. NEVER alternate layouts just for the sake of alternating!
- **Zero Gimmick Layouts**: Do NOT use split sidebars, fake CRT monitors, or complex multi-grids that distract from the narrative.

---

### 4. SCENE PRESENTATION LAYOUTS (Approved Styles Only):
- "full_bleed_cinematic": Fullscreen 16:9 + 2.35:1 Cinema Letterbox Bars + 35mm Film Grain (Baseline standard — use for 85–90% of beats).
- "split_dual_screen": 50/50 Dual Screen Split with golden vertical accent line (Best for before vs after, comparing two perspectives).
- "open_case_binder": 3D Manila case file folder with metal 2-hole top prongs on warm blonde oak desk (Best for official records, legal files, paperwork).
- "forensic_drafting_table": Blueprint technical drafting paper with GPS grid crosshairs & bottom measurement ruler (Best for site plans, maps, architectural layouts).
- "hero_graphic_centerpiece": Floating hero centerpiece frame over deep ambient blurred background (Best for key evidence, hero documents).
- "ambient_blur_frame": Floating 3D card over bright softened ambient mirror background (Great for portrait photos, vertical images).
- "filmstrip_spool_reel": Horizontal 35mm film negative ribbon scrolling sideways on warm ivory paper (Best for archival photos, timelines).
- "red_string_pinboard": Light blonde corkboard with connected red strings (Best for connecting suspects, clues, locations).
- "parallax_triptych_gallery": 3-Panel 3D Parallax Triptych on bright gallery wall (Best for presenting 3 locations or 3-step timeline).
- "polaroid_scatter_desk": Organic polaroid photo scatter on blonde oak desk (Best for eyewitness photos, family memories).
*BANNED LAYOUTS: NEVER USE vintage_crt_monitor, editorial_sidebar_column, museum_archive_matte, desktop_corkboard, illuminated_lightbox, magnifying_loupe_inspector, quad_surveillance_matrix, horizon_top_bottom_split.*

---

### 5. MULTI-ASSET STOCK QUERIES:
When you choose a multi-asset layout, provide "additionalStockQueries" array so all slots get real matching footage:
- "split_dual_screen" ➔ provide 1 additional video/image query for the right panel (slot="right_panel", mediaType="video" or "image").
- "parallax_triptych_gallery" ➔ provide 2 additional queries for Left and Right panels (slot="left_wing", slot="right_wing").
- "red_string_pinboard" ➔ provide 2 additional queries for Clue Photo A and B (slot="clue_a", slot="clue_b").
- "polaroid_scatter_desk" ➔ provide 2 additional queries for Photo 1 and Photo 2.

---

### 6. TEXT CALLOUTS (Approved Documentary Styles Only):
Generate callouts ONLY on high-impact story moments (~25–35% of beats). Write like a headline editor at Vice or NYT — specific, punchy, story-driven (3–7 words per line).
- Approved: "newspaper_headline", "editorial_lower_third", "odometer_stat", "redacted_dossier", "police_crime_sheet", "forensic_data_card", "typewriter_paper", "social_tweet_card", "reddit_thread_card", "caution_tape_banner", "fullscreen_chapter_title", "karaoke_captions".
*BANNED CALLOUTS: NEVER USE map_pingeotag, editorial_quote, court_transcript_card, wiretap_intercept, polaroid_snapshot, marker_circle, archival_evidence_tag, split_milestone_card.*
*NUMBER BADGES: Spoken number badge popups are completely disabled. Do not generate number callout triggers.*

---

### 7. VISUAL ATMOSPHERE OVERLAYS (Documentary Styles):
Deploy subtle textural overlays to enhance authenticity, history, or mood (~30–40% of beats):
- "film_dust_scratches": Organic 35mm lint, specks & micro-scratches (Best for archival photos, case binders, historic flashbacks).
- "film_burn_light_leak": Warm amber/crimson edge light flare (Best for sunset landscapes, emotional revelations, memory sequences).
- "star_sparkle_bokeh": Floating soft luminous light orbs (Best for wealthy estates, city skylines, aspirational scenes).
- "cinematic_vignette": Deep edge shadow falloff (Best for intense tension, isolated subjects, night b-roll).
- "micro_film_grain": Fine 35mm grain texture (Best for gritty realism and documentary credibility).
- "archival_halftone_paper": Newsprint dot texture & aged parchment fibers (Best for newspaper headlines).
- "chromatic_aberration": Edge color fringing (Best for corruption, distress, unraveling scandals).
- "sprocket_16mm_film_frame": Vintage film reel perforated edges (Best for filmstrip layouts, family archives).
- "rain_lens_streaks": Water streaks & cold atmosphere (Best for bleak weather, eviction, somber scenes).

---

### 8. CINEMATIC SCENE TRANSITIONS:
Choose dynamic documentary cut transitions entering this beat to keep the video visually arresting:
- "shutter_flash": Blinding white camera shutter flash (0.08s) (Best for cutting into newspaper headlines, evidence).
- "film_burn": Warm 35mm light leak flare cut (0.2s) (Best for emotional topic shifts, flashbacks, location transitions).
- "film_dip_black": Smooth cinematic dip/fade from black (0.25s) (Best for chapter openings, heavy solemn moments, dramatic pauses).
- "whip_pan_left" / "whip_pan_right": High-speed horizontal camera swipe blur (0.15s) (Best for moving between subjects, cities).
- "zoom_punch": Rapid snap-zoom scale impact (0.18s) (Best for shocking stats, key accusations).
- "crossfade": Gentle documentary dissolve (0.3s) (Best for scenic drone shots, ambient reflections).
- "cut": Crisp hard cut (The baseline standard).

---

### 9. CUSTOM SCENE-SPECIFIC LAYOUT METADATA (MANDATORY FOR STYLIZED LAYOUTS):
Every stylized layout MUST have unique, scene-specific text generated in "layoutData" matching the exact context of what is happening in that beat. NEVER USE GENERIC PLACEHOLDERS!
- For "split_dual_screen": provide "title" (e.g. "PERSPECTIVE COMPARISON"), "subtitle" (e.g. "ORIGIN vs DESTINATION").
- For "open_case_binder": provide "title" (e.g. "CASE FILE #8492"), "subtitle" (e.g. "OFFICIAL RECORD • HOUSING ASSESSMENT"), "tag" (e.g. "CONFIDENTIAL").
- For "forensic_drafting_table": provide "title" (e.g. "SITE BLUEPRINT"), "coords" (e.g. "SEATTLE, WA • 47.60° N, 122.33° W"), "stamp" (e.g. "ARCHIVAL SURVEY").
- For "hero_graphic_centerpiece": provide "title" (e.g. "EVIDENCE HIGHLIGHT"), "subtitle" (e.g. "PRIMARY ARTIFACT").
- For "filmstrip_spool_reel": provide "title" (e.g. "HISTORICAL TIMELINE"), "tag" (e.g. "35MM ARCHIVE • 1998").
- For "ambient_blur_frame": provide "title" (e.g. "SUBJECT PROFILE"), "subtitle" (e.g. "AGE 71 • RESIDENT").
- For "red_string_pinboard": provide "notes": 3 evidence notes matching the scene.
- For "polaroid_scatter_desk": provide "notes": 3 photo handwriting captions.

---

Respond with ONLY a valid JSON object in this exact format:
{
  "beats": [
    {
      "beatIndex": 0,
      "chapterIndex": 0,
      "text": "<exact spoken text for this beat>",
      "visualSubject": "<2-4 word concrete physical environment/object, e.g. 'car_seat_interior'>",
      "mediaType": "video" | "image",
      "layout": "<one of the 18 layouts above>",
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
      "overlay": "<one of the 12 overlay types above OR null>",
      "transition": "cut" | "shutter_flash" | "film_burn" | "film_dip_black" | "whip_pan_left" | "whip_pan_right" | "zoom_punch" | "glitch_blink" | "crossfade",
      "clipFilename": "<exact filename from available list OR null>",
      "stockVideoQuery": "<concrete visual query matching character demographics & setting OR null>",
      "backupVideoQuery": "<alternative visual query OR null>",
      "stockPhotoQuery": "<concrete photo query OR null>",
      "negativeKeywords": ["forest", "woods", "trees", "nature", "camping", "hiking", "kitchen", "dishes", "modern apartment"],
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
      max_tokens: 8192,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok && (response.status === 402 || response.status === 429)) {
    console.warn(`[AI Director] ${PLANNER_MODEL} returned ${response.status}. Retrying with google/gemini-2.5-flash...`);
    response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bloketuber.app',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.35,
        max_tokens: 8192,
        response_format: { type: 'json_object' },
      }),
    });
  }

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI Director failed (${response.status}): ${errText}`);
  }

  const rawJson = await response.json();
  const rawContent = rawJson.choices?.[0]?.message?.content || '';
  const finishReason = rawJson.choices?.[0]?.finish_reason;
  const parsed = extractAndParseJson(rawContent);

  if (!parsed || !Array.isArray(parsed.beats) || parsed.beats.length === 0) {
    console.error(`[AI Planner Error] finish_reason: "${finishReason}", raw length: ${rawContent.length}`);
    console.error(`[AI Planner Error] Raw response start:\n${rawContent.slice(0, 400)}`);
    console.error(`[AI Planner Error] Raw response end:\n${rawContent.slice(-400)}`);
    throw new Error('AI Director failed to produce valid scene beats.');
  }

  return { beats: parsed.beats };
}

export interface PacingConfig {
  minBaseline: number;
  maxBaseline: number;
  minFeature: number;
  maxFeature: number;
  hardCap: number;
}

export const MIN_BEAT_DURATION = 2.5; // Strictly enforce >= 3.0s per feedback
export const MAX_BEAT_DURATION = 5.0; // Strictly enforce <= 6.0s per feedback

export const PACING_CONFIGS: Record<'low' | 'medium' | 'high', PacingConfig> = {
  high: {
    minBaseline: 3.0,
    maxBaseline: 4.0,
    minFeature: 3.5,
    maxFeature: 4.8,
    hardCap: 5.0,
  },
  medium: {
    minBaseline: 3.0,
    maxBaseline: 4.5,
    minFeature: 4.0,
    maxFeature: 5.0,
    hardCap: 5.0,
  },
  low: {
    minBaseline: 3.5,
    maxBaseline: 4.8,
    minFeature: 4.5,
    maxFeature: 5.0,
    hardCap: 5.0,
  },
};

const COMMON_CONVERSATIONAL_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'up', 'about', 'into', 'over', 'after', 'and', 'but', 'or', 'so', 'yet',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'it', 'its', 'this', 'that', 'these', 'those', 'there', 'they', 'them', 'their',
  'we', 'our', 'us', 'you', 'your', 'he', 'him', 'his', 'she', 'her', 'i', 'me', 'my',
  'what', 'which', 'who', 'whom', 'whose', 'when', 'where', 'why', 'how',
  'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such',
  'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 'can',
  'will', 'just', 'should', 'now', 'said', 'tells', 'told', 'know', 'think', 'saw'
]);

/**
 * Extract 2-3 concrete visual keywords from a text slice for stock searches.
 */
function extractVisualKeywords(text: string): string | null {
  if (!text) return null;
  const clean = text.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = clean.split(' ').filter((w) => !COMMON_CONVERSATIONAL_WORDS.has(w) && w.length > 2);
  if (!words.length) return null;
  return words.slice(0, 3).join(' ');
}

/**
 * Finds the end word in Whisper alignments using multi-word phrase matching.
 * Avoids false positive jumps on single common words.
 */
function findBeatEndWordIndex(
  beatText: string,
  allWords: Array<{ word: string; start: number; end: number }>,
  wordSearchCursor: number,
  expectedWordCount: number
): { matchIndex: number; endTime: number } | null {
  if (!allWords.length || wordSearchCursor >= allWords.length) return null;

  const beatWords = beatText.split(/\s+/).filter(Boolean);
  const cleanBeatWords = beatWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
  if (!cleanBeatWords.length) return null;

  const searchWindow = Math.min(allWords.length, wordSearchCursor + expectedWordCount * 2 + 8);

  // Strategy A: 2-word end phrase matching (most accurate)
  if (cleanBeatWords.length >= 2) {
    const endPhrase = [
      cleanBeatWords[cleanBeatWords.length - 2],
      cleanBeatWords[cleanBeatWords.length - 1],
    ];

    for (let wIdx = wordSearchCursor; wIdx < searchWindow - 1; wIdx++) {
      const w1 = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
      const w2 = allWords[wIdx + 1]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (w1 === endPhrase[0] && w2 === endPhrase[1]) {
        return { matchIndex: wIdx + 1, endTime: allWords[wIdx + 1]!.end };
      }
    }
  }

  // Strategy B: Match last significant content word
  for (let i = cleanBeatWords.length - 1; i >= Math.max(0, cleanBeatWords.length - 3); i--) {
    const candidate = cleanBeatWords[i]!;
    if (candidate.length > 2 && !COMMON_CONVERSATIONAL_WORDS.has(candidate)) {
      for (let wIdx = wordSearchCursor; wIdx < searchWindow; wIdx++) {
        const w = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (w === candidate) {
          const offset = cleanBeatWords.length - 1 - i;
          const matchedIdx = Math.min(allWords.length - 1, wIdx + offset);
          return { matchIndex: matchedIdx, endTime: allWords[matchedIdx]!.end };
        }
      }
    }
  }

  // Strategy C: Exact last word match
  const lastWord = cleanBeatWords[cleanBeatWords.length - 1]!;
  for (let wIdx = wordSearchCursor; wIdx < searchWindow; wIdx++) {
    const w = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (w === lastWord) {
      return { matchIndex: wIdx, endTime: allWords[wIdx]!.end };
    }
  }

  return null;
}

/**
 * Maps planned beats to exact audio timestamps using dynamic word-weighting, Whisper phrase boundaries,
 * and automatic beat consolidation & subdivision to strictly enforce the target pacing limits (3.0s – 6.0s).
 */
export function mapPlannedBeatsToTiming(
  beats: PlannedBeat[],
  alignments: SegmentAlignment[],
  totalDuration: number,
  pacing: 'low' | 'medium' | 'high' = 'medium'
): TimedPlannedBeat[] {
  if (!beats.length) return [];

  const config = PACING_CONFIGS[pacing] || PACING_CONFIGS.medium;

  // Helper to determine if a beat has text overlays or a stylized screen layout
  const hasTextOrLayout = (beat: PlannedBeat): boolean => {
    const isStylizedLayout = Boolean(beat.layout && beat.layout !== 'full_bleed_cinematic');
    const hasCallout = Boolean(beat.callout && (beat.callout.line1 || beat.callout.type));
    const hasLayoutData = Boolean(beat.layoutData && Object.keys(beat.layoutData).length > 0);
    return isStylizedLayout || hasCallout || hasLayoutData;
  };

  const allWords = (alignments || []).flatMap((s) => s.words || []);
  const totalWords = beats.reduce(
    (sum, b) => sum + Math.max(1, (b.text || '').split(/\s+/).filter(Boolean).length),
    0
  );

  // ── Step 1: Initial timestamp assignment using Whisper phrase matching ──
  let currentStart = 0;
  let wordSearchCursor = 0;

  const initialTimedBeats: Array<PlannedBeat & { startTime: number; endTime: number; duration: number }> = beats.map((beat, i) => {
    const beatWords = (beat.text || '').split(/\s+/).filter(Boolean);
    const wordCount = Math.max(1, beatWords.length);
    let matchedEndTime: number | null = null;

    const matchResult = findBeatEndWordIndex(beat.text || '', allWords, wordSearchCursor, wordCount);
    if (matchResult) {
      matchedEndTime = matchResult.endTime;
      wordSearchCursor = matchResult.matchIndex + 1;
    } else {
      wordSearchCursor = Math.min(allWords.length, wordSearchCursor + wordCount);
    }

    const estimatedDuration = totalWords > 0 ? (wordCount / totalWords) * totalDuration : totalDuration / beats.length;
    let endTime: number;

    if (matchedEndTime !== null && matchedEndTime > currentStart + 1.0) {
      endTime = matchedEndTime;
    } else {
      endTime = currentStart + estimatedDuration;
    }

    if (i === beats.length - 1 || endTime > totalDuration) {
      endTime = totalDuration;
    }

    if (endTime <= currentStart) {
      endTime = Math.min(totalDuration, currentStart + Math.max(1.5, estimatedDuration));
    }

    const duration = Math.max(1.0, endTime - currentStart);
    const timed = {
      ...beat,
      startTime: Number(currentStart.toFixed(3)),
      endTime: Number(endTime.toFixed(3)),
      duration: Number(duration.toFixed(3)),
    };

    currentStart = endTime;
    return timed;
  });

  // ── Step 2: Consolidate / Merge any beats shorter than MIN_BEAT_DURATION (3.0s) ──
  // Per feedback: "no beat need to be less than 3 sec". Merge adjacent short beats into cohesive 3s+ scenes.
  const mergedBeats: Array<PlannedBeat & { startTime: number; endTime: number; duration: number }> = [];

  for (let i = 0; i < initialTimedBeats.length; i++) {
    const curr = { ...initialTimedBeats[i]! };

    while (curr.duration < MIN_BEAT_DURATION && i + 1 < initialTimedBeats.length) {
      const next = initialTimedBeats[i + 1]!;
      // Merge next beat into curr
      curr.text = `${curr.text} ${next.text}`.trim();
      curr.endTime = next.endTime;
      curr.duration = Number((curr.endTime - curr.startTime).toFixed(3));

      // Retain best metadata
      if (!curr.callout && next.callout) curr.callout = next.callout;
      if ((!curr.layout || curr.layout === 'full_bleed_cinematic') && next.layout && next.layout !== 'full_bleed_cinematic') {
        curr.layout = next.layout;
        curr.layoutData = next.layoutData;
      }
      if (!curr.clipFilename && next.clipFilename) curr.clipFilename = next.clipFilename;
      if (!curr.stockVideoQuery && next.stockVideoQuery) curr.stockVideoQuery = next.stockVideoQuery;
      if (!curr.backupVideoQuery && next.backupVideoQuery) curr.backupVideoQuery = next.backupVideoQuery;
      if (!curr.visualSubject && next.visualSubject) curr.visualSubject = next.visualSubject;

      i++; // Skip merged next beat
    }
    mergedBeats.push(curr);
  }

  // If the last merged beat is still < 3.0s and there's a preceding beat, merge backward
  if (mergedBeats.length > 1 && mergedBeats[mergedBeats.length - 1]!.duration < MIN_BEAT_DURATION) {
    const last = mergedBeats.pop()!;
    const prev = mergedBeats[mergedBeats.length - 1]!;
    prev.text = `${prev.text} ${last.text}`.trim();
    prev.endTime = last.endTime;
    prev.duration = Number((prev.endTime - prev.startTime).toFixed(3));
    if (!prev.callout && last.callout) prev.callout = last.callout;
  }

  // ── Step 3: Auto-subdivide any beat exceeding MAX_BEAT_DURATION (6.0s) ──
  // Per feedback: "mot more than 6 sec". Split into slices each between 2.5s and 5.0s.
  const subdivided: Array<PlannedBeat & { duration: number }> = [];

  for (const beat of mergedBeats) {
    const dur = beat.duration;

    if (dur > MAX_BEAT_DURATION) {
      const numCuts = Math.max(2, Math.ceil(dur / 4.0));
      const eachDur = dur / numCuts;
      const beatWords = (beat.text || '').split(/\s+/).filter(Boolean);
      const wordsPerCut = Math.max(1, Math.ceil(beatWords.length / numCuts));

      const SUBDIVIDED_LAYOUT_ROTATION: SceneLayoutType[] = [
        'full_bleed_cinematic',
        'ambient_blur_frame',
        'open_case_binder',
        'forensic_drafting_table',
        'split_dual_screen',
      ];

      for (let b = 0; b < numCuts; b++) {
        const sliceWords = beatWords.slice(b * wordsPerCut, (b + 1) * wordsPerCut);
        const sliceText = sliceWords.join(' ') || beat.text;
        const sliceQuery = b === 0
          ? beat.stockVideoQuery
          : (beat.backupVideoQuery || extractVisualKeywords(sliceText) || beat.stockVideoQuery);

        const cutLayout: SceneLayoutType = b === 0
          ? (beat.layout || 'full_bleed_cinematic')
          : (b % 2 === 1
              ? SUBDIVIDED_LAYOUT_ROTATION[subdivided.length % SUBDIVIDED_LAYOUT_ROTATION.length]!
              : 'full_bleed_cinematic');

        subdivided.push({
          ...beat,
          clipFilename: b === 0 ? beat.clipFilename : null,
          text: sliceText,
          layout: cutLayout,
          layoutData: cutLayout !== 'full_bleed_cinematic' ? beat.layoutData : undefined,
          callout: b === 0 ? beat.callout : null,
          stockVideoQuery: sliceQuery,
          backupVideoQuery: beat.stockVideoQuery || beat.visualSubject || null,
          additionalStockQueries: [],
          negativeKeywords: Array.from(new Set([
            ...(beat.negativeKeywords || []),
            'forest', 'woods', 'trees', 'nature', 'camping', 'hiking', 'wilderness'
          ])),
          duration: eachDur,
        });
      }
    } else {
      subdivided.push({
        ...beat,
        duration: dur,
      });
    }
  }

  // ── Step 4: Final timestamping with absolute hard bounds (3.0s <= duration <= 6.0s) ──
  let timeCursor = 0;
  const finalBeats: TimedPlannedBeat[] = [];

  for (let i = 0; i < subdivided.length; i++) {
    const b = subdivided[i]!;
    let dur = b.duration;
    let end = timeCursor + dur;

    if (i === subdivided.length - 1) {
      end = totalDuration;
      dur = end - timeCursor;

      // If last remainder is < 3.0s and we already have beats, merge with previous
      if (dur < MIN_BEAT_DURATION && finalBeats.length > 0) {
        const prev = finalBeats[finalBeats.length - 1]!;
        prev.endTime = Number(totalDuration.toFixed(2));
        prev.text = `${prev.text} ${b.text}`.trim();
        if (!prev.callout && b.callout) prev.callout = b.callout;
        break;
      }

      // If last remainder exceeds 6.0s, split into two equal halves (both >= 3.0s)
      if (dur > MAX_BEAT_DURATION) {
        const half = dur / 2;
        finalBeats.push({
          ...b,
          beatIndex: finalBeats.length,
          startTime: Number(timeCursor.toFixed(2)),
          endTime: Number((timeCursor + half).toFixed(2)),
          resolvedPath: null,
        });
        timeCursor += half;

        finalBeats.push({
          ...b,
          beatIndex: finalBeats.length,
          layout: 'full_bleed_cinematic',
          layoutData: undefined,
          callout: null,
          startTime: Number(timeCursor.toFixed(2)),
          endTime: Number(totalDuration.toFixed(2)),
          resolvedPath: null,
        });
        break;
      }
    }

    finalBeats.push({
      ...b,
      beatIndex: finalBeats.length,
      startTime: Number(timeCursor.toFixed(2)),
      endTime: Number(end.toFixed(2)),
      resolvedPath: null,
    });
    timeCursor = end;
  }

  return finalBeats;
}


