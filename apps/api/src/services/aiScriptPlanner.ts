import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { CalloutType, CalloutThemeColor, SceneLayoutType, SceneLayoutData } from '@repo/shared';
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
    low: `⏱️ TARGET PACING DIRECTIVE: RELAXED / CINEMATIC (LOW PACING: ~5.0s – 7.5s per baseline clip / ~12–20 words per beat).
- Let scenes linger and breathe. Hold shots for emotional weight and evidence absorption.
- Combine 1–2 full thoughts/sentences into a single continuous visual beat. Fewer total cuts.
- Stylized layouts and text callouts have 6.0s–9.0s of runway. Baseline b-roll holds for 5–7s.`,
    medium: `⏱️ TARGET PACING DIRECTIVE: BALANCED INVESTIGATIVE (MEDIUM PACING: ~3.0s – 4.5s per baseline clip / ~7–11 words per beat).
- Standard investigative documentary rhythm. 4.5s–6.0s for feature layouts/callouts, 3.0s–4.0s for punchy baseline b-roll cuts.`,
    high: `⏱️ TARGET PACING DIRECTIVE: FAST & PUNCHY (HIGH PACING: ~1.0s – 3.0s per baseline clip / ~2–6 words per beat; MAXIMUM 5.0s for text callouts & layouts).
- High visual velocity, rapid cuts (TikTok / Reels / Vox Borders / high-octane YouTube style).
- Break narration into short punchy micro-beats (2–6 words per cut, 1.0s–3.0s per clip).
- Feature layouts and text callouts MUST NEVER exceed 5.0s (target ~3.0s – 5.0s max).
- Baseline b-roll cuts rapidly every 1.0s to 3.0s.
- NO clip may EVER exceed 5.0 seconds under any circumstances!`,
  }[pacing] || '';

  let audioTimingDirective = '';
  if (audioDuration && audioDuration > 0) {
    const targetCutAvg = pacing === 'high' ? 2.2 : pacing === 'medium' ? 3.8 : 6.0;
    const estCuts = Math.max(6, Math.round(audioDuration / targetCutAvg));
    const minCuts = Math.max(5, Math.round(estCuts * 0.8));
    const maxCuts = Math.round(estCuts * 1.25);
    audioTimingDirective = `⏱️ AUDIO TIMING & CUT FREQUENCY DIRECTIVE:\n- Total narration audio duration is ~${Math.round(audioDuration)} seconds.\n- For ${pacing.toUpperCase()} pacing, you MUST produce approximately ${minCuts} to ${maxCuts} distinct scene cuts!\n- Break the script into tight, snappy beats. DO NOT group multiple full sentences into single giant beats!`;
  }

  const contextDirective = [
    projectContext ? `PROJECT STORY PREMISE: "${projectContext}"` : '',
    chapterContext ? `CHAPTER VISUAL & PACING DIRECTIVE: "${chapterContext}"` : '',
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

### 2. DYNAMIC VARIABLE BEAT PACING (Macro vs Micro Beats):
${
  pacing === 'high'
    ? `⚡ **FAST & PUNCHY PACING RULES (MANDATORY)**:
- Baseline B-Roll Beats: 1.0s – 3.0s (~2–6 words per cut). Rapid cuts, fast scene transitions, high visual velocity.
- Feature Layouts & Text Callouts: MAXIMUM 5.0s RUNWAY (~6–10 words max).
  - CRITICAL CEILING: NEVER create a beat longer than 5.0 seconds!
  - If a sentence is long, BREAK IT UP into multiple short visual cuts!
- Total cut velocity must be high: plan roughly 20–30 cuts per minute of narration.`
    : pacing === 'low'
    ? `🎯 **HERO FEATURE BEATS & TEXT/SCREEN LAYOUTS (6.0s – 9.0s / ~15–25 words)**:
- Whenever you deploy a Stylized Scene Layout OR a Text Callout Overlay, give it 6.0s–9.0s of runway.
- Text overlays and complex multi-asset layouts need sufficient time for viewers to absorb the evidence.

⚡ **BASELINE B-ROLL BEATS (5.0s – 7.5s / ~12–20 words)**:
- Let scenes linger and breathe. Hold shots for emotional weight.`
    : `🎯 **HERO FEATURE BEATS & TEXT/SCREEN LAYOUTS (4.5s – 6.5s / ~10–16 words)**:
- Whenever you deploy a Stylized Scene Layout OR a Text Callout Overlay, give it 4.5s–6.5s of runway.
- Text overlays and complex multi-asset layouts need sufficient time for viewers to absorb the evidence.

⚡ **BASELINE B-ROLL BEATS (3.0s – 4.5s / ~7–11 words)**:
- For pure atmospheric momentum, establishing shots, fast action cuts, and scene transitions.
- Fast, rhythmic cuts that keep viewer retention high between feature moments.`
}

---

### 3. MANDATORY INTRO CALLOUT (CRITICAL — NEVER SKIP):
- **beatIndex 0 (the very first beat) MUST ALWAYS have a callout.** No exceptions.
- The intro callout should be a bold, punchy editorial_lower_third or newspaper_headline that immediately hooks the viewer.
- Use the subject's name, location, or a single explosive fact from the opening narration.
- This is the viewer's first impression — make it count.

---

### 3. BALANCED 50/50 MOTION GRAPHIC SCREEN LAYOUT RHYTHM (CRITICAL):
- **~50% Motion Graphic Screen Layouts**: Every other beat (approximately 1 out of every 2 beats) MUST deploy a stylized motion graphic screen layout!
- **Alternating Rhythm**: Alternate dynamically between a rich motion graphic layout beat (split dual screen, ambient blur frame, open case binder, illuminated lightbox, vintage CRT, museum matte, polaroid desk scatter, filmstrip reel, forensic drafting table, etc.) and a clean full-bleed cinematic b-roll beat.
- Viewers crave visual stimulation, rich textures, physical evidence desks, and multi-panel motion design. DO NOT leave the video in plain full-bleed b-roll.

---

### 4. SCENE PRESENTATION LAYOUTS (18 Unique Styles):
- "full_bleed_cinematic": Fullscreen 16:9 + 2.35:1 Cinema Letterbox Bars + 35mm Film Grain (Baseline full-bleed cut).
- "split_dual_screen": 50/50 Dual Screen Split with golden vertical accent line & independent Ken Burns (Best for before vs after, comparing two perspectives, subject vs environment).
- "open_case_binder": 3D Manila case file folder with metal 2-hole top prongs on warm blonde oak desk (Best for official records, legal files, transcripts, medical paperwork).
- "forensic_drafting_table": Blueprint technical drafting paper with GPS grid crosshairs & bottom measurement ruler (Best for site plans, maps, industrial facilities, architectural layouts).
- "illuminated_lightbox": Backlit light table with 35mm slide mount frame & Kodak Tri-X stamps (Best for photo slides, historical archives, portraits, inspection).
- "museum_archive_matte": Warm ivory museum wall with framed gallery mat card & subtle camera pull-back (Best for fine art photos, historic moments, formal documents).
- "desktop_corkboard": Dark mahogany detective desk with blueprint grid overlay and taped evidence (Best for crime scene notes, suspect tracking, evidence photos).
- "hero_graphic_centerpiece": Floating hero centerpiece frame over deep ambient blurred background (Best for key evidence, hero documents, featured subjects).
- "ambient_blur_frame": Floating 3D card over bright softened ambient mirror background (Great for portrait photos, stats, human profiles).
- "vintage_crt_monitor": Retro 1990s beige broadcast terminal on studio desk with scanlines & green timecode (Best for police radio, wiretaps, CCTV, dispatch).
- "filmstrip_spool_reel": Horizontal 35mm film negative ribbon scrolling sideways on warm ivory paper (Best for archival photos, timelines, historical sequences).
- "editorial_sidebar_column": 72/28 Asymmetric Video on left + Ivory investigative data rail on right (Best for news articles, court records, statistical breakdowns).
- "red_string_pinboard": Light blonde corkboard with connected red strings & 3D camera swoop (Best for connecting suspects, clues, locations).
- "horizon_top_bottom_split": 50/50 Horizontal Split: Aerial Top + Ground Bottom (Best for aerial vs ground comparisons, before vs after).
- "parallax_triptych_gallery": 3-Panel 3D Parallax Triptych on bright gallery wall (Best for presenting 3 suspects, 3 locations, or 3-step timeline).
- "quad_surveillance_matrix": 2x2 Multi-Angle Forensic CCTV Grid (Best for multi-angle police raids, perimeter surveillance, building sweeps).
- "polaroid_scatter_desk": Organic polaroid photo scatter on blonde oak desk (Best for eyewitness photos, physical evidence, family memories).
- "magnifying_loupe_inspector": Circular optical magnifying loupe gliding over an archival map (Best for GPS coordinates, property boundaries, blueprints).

---

### 5. MULTI-ASSET STOCK QUERIES:
When you choose a multi-asset layout, provide "additionalStockQueries" array so all slots get real matching footage:
- "split_dual_screen" ➔ provide 1 additional video/image query for the right panel (slot="right_panel", mediaType="video" or "image").
- "editorial_sidebar_column" ➔ provide 1 additional image query for the right-column context thumbnail (slot="context_image", mediaType="image" e.g. archival document, location photograph, police report, or newspaper snippet).
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

### 8. CUSTOM SCENE-SPECIFIC LAYOUT METADATA (MANDATORY FOR STYLIZED LAYOUTS):
Every stylized layout MUST have unique, scene-specific text generated in "layoutData" matching the exact context of what is happening in that beat. NEVER USE GENERIC PLACEHOLDERS!
- For "split_dual_screen": provide "title" (e.g. "PERSPECTIVE COMPARISON"), "subtitle" (e.g. "ORIGIN vs DESTINATION").
- For "open_case_binder": provide "title" (e.g. "CASE FILE #8492"), "subtitle" (e.g. "OFFICIAL RECORD • HOUSING ASSESSMENT"), "tag" (e.g. "CONFIDENTIAL").
- For "forensic_drafting_table": provide "title" (e.g. "SITE BLUEPRINT"), "coords" (e.g. "SEATTLE, WA • 47.60° N, 122.33° W"), "stamp" (e.g. "ARCHIVAL SURVEY").
- For "illuminated_lightbox": provide "title" (e.g. "35MM ARCHIVE"), "subtitle" (e.g. "CONTACT SHEET // FRAME 24A").
- For "museum_archive_matte": provide "title" (e.g. "HISTORICAL DOCUMENT"), "subtitle" (e.g. "KING COUNTY ARCHIVES • 2019").
- For "desktop_corkboard": provide "notes": 3 evidence notes matching the scene (e.g. ["INCIDENT LOG", "OUTREACH REPORT", "CASEWORKER NOTES"]).
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
      "visualSubject": "<2-4 word concrete physical environment/object, e.g. 'car_seat_interior'>",
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
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });

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

export const PACING_CONFIGS: Record<'low' | 'medium' | 'high', PacingConfig> = {
  high: {
    minBaseline: 1.0,
    maxBaseline: 3.0,
    minFeature: 2.8,
    maxFeature: 5.0,
    hardCap: 5.0,
  },
  medium: {
    minBaseline: 2.5,
    maxBaseline: 4.5,
    minFeature: 4.5,
    maxFeature: 6.5,
    hardCap: 7.0,
  },
  low: {
    minBaseline: 4.0,
    maxBaseline: 7.5,
    minFeature: 6.0,
    maxFeature: 9.5,
    hardCap: 10.0,
  },
};

/**
 * Maps planned beats to exact audio timestamps using dynamic word-weighting, Whisper phrase boundaries,
 * and automatic beat subdivision to strictly enforce the target pacing limits (e.g. max 5.0s on Fast & Punchy).
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

  // ── Step 1: Initial timestamp assignment using Whisper word cursor or proportional word count ──
  let currentStart = 0;
  let wordSearchCursor = 0;

  const initialTimedBeats: Array<PlannedBeat & { startTime: number; endTime: number; duration: number }> = beats.map((beat, i) => {
    const beatWords = (beat.text || '').split(/\s+/).filter(Boolean);
    const wordCount = Math.max(1, beatWords.length);
    let matchedEndTime: number | null = null;

    if (allWords.length > 0 && wordSearchCursor < allWords.length) {
      const cleanBeatWords = beatWords.map((w) => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean);
      const targetEndWord = cleanBeatWords[cleanBeatWords.length - 1];
      const targetSecondEndWord = cleanBeatWords[cleanBeatWords.length - 2];

      if (targetEndWord) {
        const searchLimit = Math.min(allWords.length, wordSearchCursor + wordCount * 3 + 6);
        let bestMatchIdx: number | null = null;

        for (let wIdx = wordSearchCursor; wIdx < searchLimit; wIdx++) {
          const currentWordClean = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (currentWordClean === targetEndWord) {
            bestMatchIdx = wIdx;
          }
        }

        if (bestMatchIdx === null && targetSecondEndWord) {
          for (let wIdx = wordSearchCursor; wIdx < searchLimit; wIdx++) {
            const currentWordClean = allWords[wIdx]?.word.toLowerCase().replace(/[^a-z0-9]/g, '');
            if (currentWordClean === targetSecondEndWord) {
              bestMatchIdx = wIdx;
            }
          }
        }

        if (bestMatchIdx !== null) {
          matchedEndTime = allWords[bestMatchIdx]!.end;
          wordSearchCursor = bestMatchIdx + 1;
        }
      }
    }

    const estimatedDuration = totalWords > 0 ? (wordCount / totalWords) * totalDuration : totalDuration / beats.length;
    let endTime: number;

    if (matchedEndTime !== null && matchedEndTime > currentStart + 0.5) {
      endTime = matchedEndTime;
    } else {
      endTime = currentStart + estimatedDuration;
    }

    if (i === beats.length - 1 || endTime > totalDuration) {
      endTime = totalDuration;
    }

    if (endTime <= currentStart) {
      endTime = Math.min(totalDuration, currentStart + Math.max(1.0, estimatedDuration));
    }

    const duration = Math.max(0.5, endTime - currentStart);
    const timed = {
      ...beat,
      startTime: Number(currentStart.toFixed(3)),
      endTime: Number(endTime.toFixed(3)),
      duration: Number(duration.toFixed(3)),
    };

    currentStart = endTime;
    return timed;
  });

  // ── Step 2: Auto-subdivide any beat exceeding the pacing threshold ──
  // For Fast & Punchy: any baseline > 3.0s is cut into 1.0–3.0s cuts; feature > 5.0s is capped to ~4.5s with baseline b-roll cuts
  const subdivided: Array<PlannedBeat & { duration: number }> = [];

  for (const beat of initialTimedBeats) {
    const isFeature = hasTextOrLayout(beat);
    const dur = beat.duration;

    if (isFeature && dur > config.maxFeature) {
      // Split feature: first portion retains callout/layout (capped <= maxFeature)
      const featureDur = Math.min(config.maxFeature, Math.max(config.minFeature, 4.5));
      const remDur = dur - featureDur;

      const rawCallout = beat.callout as any;
      const featureCallout = rawCallout ? {
        ...rawCallout,
        startTime: Math.min(rawCallout.startTime || 0.1, featureDur * 0.2),
        endTime: Math.min(featureDur - 0.15, (rawCallout.endTime || featureDur)),
      } : null;

      subdivided.push({
        ...beat,
        layout: beat.layout,
        layoutData: beat.layoutData,
        callout: featureCallout,
        duration: featureDur,
      });

      // Remainder becomes baseline b-roll cuts
      const numBaseline = Math.max(1, Math.ceil(remDur / config.maxBaseline));
      const eachDur = remDur / numBaseline;
      const beatWords = (beat.text || '').split(/\s+/).filter(Boolean);
      const halfWords = Math.ceil(beatWords.length / 2);

      const SUBDIVIDED_LAYOUT_ROTATION: SceneLayoutType[] = [
        'split_dual_screen',
        'ambient_blur_frame',
        'open_case_binder',
        'illuminated_lightbox',
        'vintage_crt_monitor',
        'museum_archive_matte',
        'forensic_drafting_table',
        'desktop_corkboard',
        'editorial_sidebar_column',
        'filmstrip_spool_reel',
      ];

      for (let b = 0; b < numBaseline; b++) {
        const cutLayout: SceneLayoutType = b % 2 === 1
          ? SUBDIVIDED_LAYOUT_ROTATION[subdivided.length % SUBDIVIDED_LAYOUT_ROTATION.length]!
          : 'full_bleed_cinematic';

        subdivided.push({
          ...beat,
          text: beatWords.slice(halfWords).join(' ') || beat.text,
          layout: cutLayout,
          layoutData: cutLayout !== 'full_bleed_cinematic' ? beat.layoutData : undefined,
          callout: null,
          stockVideoQuery: beat.backupVideoQuery || beat.stockVideoQuery || beat.visualSubject || null,
          backupVideoQuery: beat.stockVideoQuery || beat.visualSubject || null,
          additionalStockQueries: [],
          negativeKeywords: Array.from(new Set([
            ...(beat.negativeKeywords || []),
            'forest', 'woods', 'trees', 'nature', 'camping', 'hiking', 'wilderness'
          ])),
          duration: eachDur,
        });
      }
    } else if (!isFeature && dur > config.maxBaseline) {
      // Split baseline into multiple cuts <= maxBaseline
      const numCuts = Math.max(2, Math.ceil(dur / config.maxBaseline));
      const eachDur = dur / numCuts;
      const beatWords = (beat.text || '').split(/\s+/).filter(Boolean);
      const wordsPerCut = Math.max(1, Math.ceil(beatWords.length / numCuts));

      const SUBDIVIDED_LAYOUT_ROTATION: SceneLayoutType[] = [
        'split_dual_screen',
        'ambient_blur_frame',
        'open_case_binder',
        'illuminated_lightbox',
        'vintage_crt_monitor',
        'museum_archive_matte',
        'forensic_drafting_table',
        'desktop_corkboard',
        'editorial_sidebar_column',
        'filmstrip_spool_reel',
      ];

      for (let b = 0; b < numCuts; b++) {
        const sliceText = beatWords.slice(b * wordsPerCut, (b + 1) * wordsPerCut).join(' ') || beat.text;
        const cutLayout: SceneLayoutType = b % 2 === 1
          ? SUBDIVIDED_LAYOUT_ROTATION[subdivided.length % SUBDIVIDED_LAYOUT_ROTATION.length]!
          : 'full_bleed_cinematic';

        subdivided.push({
          ...beat,
          text: sliceText,
          layout: cutLayout,
          layoutData: cutLayout !== 'full_bleed_cinematic' ? beat.layoutData : undefined,
          callout: null,
          stockVideoQuery: b === 0 ? beat.stockVideoQuery : (beat.backupVideoQuery || beat.stockVideoQuery || beat.visualSubject || null),
          backupVideoQuery: beat.backupVideoQuery || beat.stockVideoQuery || beat.visualSubject || null,
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

  // ── Step 3: Final timestamping with absolute hard cap enforcement ──
  let timeCursor = 0;
  const finalBeats: TimedPlannedBeat[] = [];

  for (let i = 0; i < subdivided.length; i++) {
    const b = subdivided[i]!;
    let dur = b.duration;
    let end = timeCursor + dur;

    if (i === subdivided.length - 1) {
      end = totalDuration;
      dur = end - timeCursor;

      if (dur > config.hardCap) {
        // Last clip would exceed hard cap! Split it into two
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

