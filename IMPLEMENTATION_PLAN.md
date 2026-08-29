# BlokeTuber V2 Master Implementation Plan (Cross-Checked & Corrected)

**Last updated**: 2026-08-25 after full code audit  
**Implementation order is deliberately different from problem order** — see Execution Matrix.

---

## What's Actually Broken (Root Cause Audit)

### Bug 1 — Photos only, never videos
Two hard-coded lines force everything to photos:
- [`aiScriptPlanner.ts:273`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/aiScriptPlanner.ts#L273): `mediaType: b.mediaType === 'video' ? 'video' : 'image'` — fine on its own, but the system prompt says "80%+ photo-first" so the AI rarely outputs `video`.
- [`aiScriptPlanner.ts:408`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/aiScriptPlanner.ts#L408): `mediaType: 'image'` — ANY beat that gets auto-split (>4.5s) is forced to photo regardless of what the AI decided.

### Bug 2 — Text overlays appear ~2s early
[`timelineBuilder.ts:163-166`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/timelineBuilder.ts#L163-L166):  
Calls `findPhraseTimestamp(rawCallout.line1, alignments)` where `line1` is the **edited display title** (e.g. `"$35,000 Bail"`) but Whisper contains **spoken words** (e.g. `"thirty-five thousand dollars"`). Match fails → `startOffset` stays at the default `0.05s` → callout appears at clip start regardless of when it's actually spoken.

### Bug 3 — Irrelevant media results
The system prompt generates very long photo queries (5-8 words) like `"weathered wooden pallet mattress makeshift shelter interior"`. Pexels and Pixabay search APIs return poor or zero results for queries longer than 3 words and fall back to random unrelated images.

### Bug 4 — Repeated images across chapters
`usedMediaUrls` in [`pipeline.ts:194`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/routes/pipeline.ts#L194) is an in-memory `Set` — reset to empty on every pipeline run. There is no persistence across chapters.

### Bug 5 — Only 2 static text styles, no animations
[`videoRenderer.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/videoRenderer.ts) uses `between(t,start,end)` which creates a hard on/off flash. Zero animation, zero motion, two style variants.

---

## Corrected Implementation Order

> **Why this order?** Each phase is ranked by: isolated impact (fewest files touched, zero risk to other phases) first, complex structural changes last.

```
Phase 1 → Rich Animated Text Overlays (8 Styles)        [isolated: videoRenderer.ts]
Phase 2 → Precision Audio-Word Sync Fix                  [isolated: timelineBuilder.ts + planner interface]
Phase 3 → Query Compression & Stock Search Relevance     [stockFootage.ts + aiScriptPlanner.ts]
Phase 4 → Dynamic Video vs. Photo Selection              [aiScriptPlanner.ts prompt + pipeline.ts]
Phase 5 → Project & Chapter Architecture (Deduplication) [full-stack: localStore + API + UI]
```

---

## Phase 1: Rich Animated Text Overlays (8 Styles)

### Objective
Replace 2 static snap-on overlays with 8 distinct animated broadcast-grade styles with smooth 0.25s alpha fade + slide-up entrance using pure FFmpeg filter expressions.

### Files to Modify
- [`apps/api/src/services/videoRenderer.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/videoRenderer.ts) — rewrite `buildCalloutFilters()` and its signature
- [`apps/api/src/services/aiScriptPlanner.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/aiScriptPlanner.ts) — expand `callout.type` union and update prompt examples
- [`packages/shared/src/index.ts`](file:///C:/Users/karth/Documents/BlokeTuber/packages/shared/src/index.ts) — update `NumberOverlay.style` and `callout.type` unions

### Breaking Change Warning
The type `callout.type` must be updated in **3 places** simultaneously:
1. `PlannedBeat.callout.type` in `aiScriptPlanner.ts` (line 50)
2. `TimelineClip.callout.type` in `timelineBuilder.ts` (line 33)
3. `buildCalloutFilters` parameter type in `videoRenderer.ts` (line 56)

### 8 Overlay Styles

| Type Key | Visual Design | Accent Color | Best For |
|---|---|---|---|
| `stat_callout` | Giant 80pt stat + 24pt label below + dark horizontal pill backplate | Gold `#F59E0B`, Cyan `#06B6D4`, Emerald `#10B981` | `$35,000`, `17 Years`, `3rd Arrest` |
| `lower_third` | Left vertical accent bar (6px) + 46pt bold name + 26pt role subtitle | Gold `#F5C518`, Slate `#94A3B8`, Cyan `#38BDF8` | Named people, officers, suspects |
| `location_badge` | Bottom-left dark rounded pill + pin symbol + 30pt tracked uppercase | Amber `#F59E0B`, White `#FFFFFF`, Red `#EF4444` | Cities, parks, addresses, roads |
| `evidence_tag` | Crimson/amber top-left warning badge + 32pt bold uppercase + thick border | Crimson `#DC2626`, Amber Alert `#D97706` | Charges, crimes, stolen items, evidence |
| `quote_card` | Wide dark frosted glass panel (bottom third) + 36pt italic text + quotation marks | Slate `#1E293B @ 90% alpha`, Gold accent line | Direct quotes, official statements |
| `chapter_header` | Full-width center banner + 64pt letter-spaced title + 28pt subtitle | Gold/White, Crimson/White, Cyan/White | Act breaks, major story turns |
| `highlight_pill` | Small compact floating badge (top-right or center) + 28pt keyword | Neon Cyan `#22D3EE`, Vivid Amber `#FCD34D`, White | Dramatic single keywords: `CAUGHT ON CAMERA` |
| `split_title` | Two adjacent boxes, dark left header + accent-color right body | Black+Gold, Black+Red, Black+Cyan | Milestones: `OCTOBER 2024 / 4TH ARREST` |

### FFmpeg Animation Expressions

**Smooth 0.25s alpha fade-in and fade-out:**
```
alpha='if(lt(t,T0),0,if(lt(t,T0+0.25),(t-T0)/0.25,if(lt(t,T1-0.25),1,(T1-t)/0.25)))'
```
Where `T0` = callout.startTime, `T1` = callout.endTime.

**Smooth 0.25s Y-slide-up entrance (28px travel):**
```
y='if(lt(t,T0+0.25), Y_TARGET+28*(1-(t-T0)/0.25), Y_TARGET)'
```

**All styles must also include:**
```
borderw=3:bordercolor=black@0.9:shadowx=3:shadowy=3:shadowcolor=black@0.85
```

### Phase 1 Test Script
- Create: `apps/api/scripts/test_callout_animations.ts`
- Renders a 16-second test video (2s per style × 8 styles) with dummy text on a black background.
- Run: `npx tsx apps/api/scripts/test_callout_animations.ts`
- **Pass**: All 8 styles render, text is legible, smooth slide + fade is visible, no FFmpeg crash.

---

## Phase 2: Precision Audio-Word Sync Fix

### Objective
Fix the ~2-second premature callout pop-in by using the exact spoken words from the narration to find the Whisper timestamp, with a word-position ratio fallback.

### Root Cause (Confirmed in Code)
`timelineBuilder.ts:164` → `findPhraseTimestamp(rawCallout.line1, alignments)` searches Whisper transcripts for the **display text** (`"$35,000 Bail"`). Whisper contains **spoken text** (`"thirty-five thousand dollars"`). No match → defaults to `0.05s`.

### Files to Modify
- [`apps/api/src/services/aiScriptPlanner.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/aiScriptPlanner.ts) — add `spokenTrigger` field to `PlannedBeat.callout` interface and to AI Director prompt
- [`apps/api/src/services/timelineBuilder.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/timelineBuilder.ts) — use `spokenTrigger` for timestamp lookup; add word-ratio fallback
- [`apps/api/src/services/whisperAlignment.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/whisperAlignment.ts) — add number-to-words normalizer used by `findPhraseTimestamp`

### Key Changes

**1. Add `spokenTrigger` to `PlannedBeat.callout` interface** (`aiScriptPlanner.ts:48-52`):
```typescript
callout?: {
  type: 'stat_callout' | 'lower_third' | 'location_badge' | 'evidence_tag' | 'quote_card' | 'chapter_header' | 'highlight_pill' | 'split_title';
  line1: string;
  line2?: string;
  spokenTrigger?: string; // NEW: exact 2-4 spoken words from narration that trigger this overlay
  themeColor?: 'gold' | 'cyan' | 'crimson' | 'amber' | 'white';
} | null;
```

**2. Update Director prompt** to require `spokenTrigger`:
```
"bail at thirty-five thousand dollars" → callout: {
  type: "stat_callout",
  line1: "$35,000 Bail",
  spokenTrigger: "thirty-five thousand dollars"  ← exact spoken words
}
"Steven Irwin built this" → callout: {
  type: "lower_third",
  line1: "Steven Irwin",
  line2: "Cabin Builder",
  spokenTrigger: "steven irwin"  ← lowercase exact spoken form
}
```

**3. Number normalizer in `whisperAlignment.ts`** (new exported function `normalizeForSearch(text)`):
- `$35,000` → `thirty five thousand dollars`
- `17` → `seventeen`
- `4th` → `fourth`
- `$2,000` → `two thousand dollars`

**4. New timing logic in `timelineBuilder.ts:163-167`**:
```typescript
// Try spokenTrigger first, then fall back to line1, then word-ratio
const searchPhrase = rawCallout.spokenTrigger || rawCallout.line1;
const normalizedPhrase = normalizeForSearch(searchPhrase);
const phraseTs = findPhraseTimestamp(normalizedPhrase, alignments);

if (phraseTs && phraseTs.start >= beat.startTime - 0.2 && phraseTs.start <= beat.endTime + 0.2) {
  startOffset = Math.max(0.1, phraseTs.start - beat.startTime);
} else {
  // Word-ratio fallback: find where the trigger phrase starts within beat text
  const beatWords = beat.text.toLowerCase().split(/\s+/);
  const triggerWords = (rawCallout.spokenTrigger || '').toLowerCase().split(/\s+/);
  const wordIdx = beatWords.findIndex((w) => w === triggerWords[0]);
  if (wordIdx >= 0) {
    startOffset = (wordIdx / Math.max(1, beatWords.length)) * clipDuration + 0.1;
  } else {
    startOffset = clipDuration * 0.5; // center fallback, never 0.05s
  }
}
```

### Phase 2 Test Script
- Create: `apps/api/scripts/test_audio_sync.ts`
- Run alignment on a mock Whisper segment array + beat array with known trigger words.
- **Pass**: `callout.startTime` matches within ±0.15s of the spoken word timestamp. No `startTime === 0.05` unless the word genuinely starts the clip.

---

## Phase 3: Query Compression & Stock Search Relevance

### Objective
Fix irrelevant stock results by compressing long AI-generated queries to 2-3 word visual core nouns before hitting Pexels/Pixabay API.

### Why Not Wikimedia?
Wikimedia is an encyclopedia, good for notable persons and places but unsuitable for general documentary B-roll like "makeshift shelter" or "freight train". Pexels and Pixabay already have excellent API keys configured. The problem is query length, not provider.

### Files to Modify
- [`apps/api/src/services/aiScriptPlanner.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/aiScriptPlanner.ts) — rewrite `stockPhotoQuery` and `stockVideoQuery` generation in prompt to enforce 2-3 word max
- [`apps/api/src/services/stockFootage.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/stockFootage.ts) — add `compressQuery(raw: string): string` pre-processing before API calls; enforce `image_type=photo` and orientation filters on Pixabay

### Key Changes

**1. Query compression function** (new in `stockFootage.ts`):
```typescript
function compressQuery(raw: string): string {
  const stopWords = new Set(['a','an','the','in','on','at','to','for','of','with','by','and','or','is','was','were','has','have','had','it','its','this','that','he','she','they','his','her','their','we','our','you','your','be','been','being','as','up','but','so','yet','if','into','over','after','about','from']);
  const words = raw.trim().toLowerCase().split(/\s+/);
  const content = words.filter(w => !stopWords.has(w) && w.length > 2);
  // Return first 3 meaningful words
  return content.slice(0, 3).join(' ') || words.slice(0, 2).join(' ');
}
```

**2. Update AI Director prompt** to enforce short queries:
```
QUERY RULES (STRICT):
- stockPhotoQuery: MAXIMUM 3 words. Concrete visual nouns ONLY.
  ✓ "makeshift shelter wood"
  ✓ "freight train tracks"
  ✓ "homeless man portrait"
  ✗ "weathered wooden pallet mattress makeshift shelter interior" (TOO LONG — banned)
  ✗ "He built a house on the railroad" (SPOKEN TEXT — banned)
  
- stockVideoQuery: MAXIMUM 3 words.
  ✓ "excavator digging dirt"
  ✓ "police arrest handcuffs"
  ✗ "heavy machinery digging into the hillside at night" (TOO LONG — banned)
```

**3. Pixabay: enforce `image_type=photo&safesearch=true`** (already partially done but not filtering illustrations from results client-side — add filter).

### Phase 3 Test Script
- Create: `apps/api/scripts/test_stock_relevance.ts`
- Test 10 queries through `compressQuery()` + all provider functions.
- **Pass**: All queries are ≤3 words after compression; all returned images are landscape (width > height); no cartoon/vector URLs returned.

---

## Phase 4: Dynamic Video vs. Photo Selection

### Objective
Intelligently classify every narration beat as `video` (actions/motion) or `image` (places/portraits/stills) and keep that classification intact through auto-splitting.

### Files to Modify
- [`apps/api/src/services/aiScriptPlanner.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/aiScriptPlanner.ts) — redesign `MEDIA SELECTION` section of system prompt; fix line 273 default coercion comment; fix line 408 `mediaType: 'image'` forced override
- [`apps/api/src/routes/pipeline.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/routes/pipeline.ts) — tighten fallback chain for video beats

### Key Changes

**1. Rewrite MEDIA SELECTION rules in Director prompt** (replace section 3 "PHOTO-FIRST"):
```
3. SMART MEDIA TYPE SELECTION — Use semantics, not a fixed ratio:

   VIDEO BEATS (use for motion, action, dynamic events):
   - Physical action: digging, running, driving, building, demolishing, fighting, raiding
   - Vehicles in motion: excavators, trucks, trains, police cars
   - Weather/environment: rain falling, wind moving trees, smoke rising
   - People actively doing something: walking, arguing, working, being arrested
   Examples:
   * "The excavator tore into the hillside" → mediaType: "video", stockVideoQuery: "excavator digging dirt"
   * "Police swarmed the property" → mediaType: "video", stockVideoQuery: "police raid property"
   * "Freight cars rolled past day and night" → mediaType: "video", stockVideoQuery: "freight train moving"

   PHOTO BEATS (use for static places, portraits, documents, objects at rest):
   - Static locations: roads, buildings, parks, neighborhoods
   - People standing/posed: mugshots, portraits, interview subjects
   - Objects: tools, materials, documents, personal effects
   - Dates, stats, facts (when no action described)
   Examples:
   * "The cabin sat on Seneca Road" → mediaType: "image", stockPhotoQuery: "rural dirt road cabin"
   * "Todd lived 17 years without a home" → mediaType: "image", stockPhotoQuery: "homeless man portrait"
   * "Police found stolen ID cards" → mediaType: "image", stockPhotoQuery: "identity cards evidence"
```

**2. Fix line 408 in `mapPlannedBeatsToTiming`**: Change `mediaType: 'image'` to `mediaType: timedBeat.mediaType` — sub-shots must inherit the parent's media type.

**3. Tighten pipeline fallback** (`pipeline.ts`): If a beat is `video` and no video is found, keep it as `image` but emit a console warning so we can debug which queries need tuning.

### Phase 4 Test Script
- Create: `apps/api/scripts/test_media_planner.ts`
- Pass a set of 10 mixed narration sentences to `planScriptWithAI`.
- **Pass**: All action sentences → `video`; all static sentences → `image`; no sub-shot overrides parent type.

---

## Phase 5: Project & Chapter Architecture (Deduplication)

### Objective
Allow users to create a **Project** (e.g., "Steve Cabin Story") and generate individual **Chapters** under it. All media used in any chapter is tracked persistently, so Chapter 2 never reuses an image from Chapter 1.

### Breaking Change: Data Model Redesign

The current flat `Project` schema changes to:
```typescript
// packages/shared/src/index.ts
export interface UsedMediaItem {
  id: string;           // e.g., "pexels_123456" or URL hash
  url: string;
  source: 'pexels' | 'pixabay' | 'coverr' | 'mixkit' | 'local';
  mediaType: 'image' | 'video';
  chapterIndex: number;
  query: string;
  usedAt: string;
}

export interface Chapter {
  id: string;
  projectId: string;
  chapterIndex: number;
  title: string;
  scriptText: string;
  status: 'draft' | 'processing' | 'completed' | 'error';
  jobId?: string;
  videoPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  chapters: Chapter[];
  usedMedia: UsedMediaItem[];   // cumulative across ALL chapters
  createdAt: string;
  updatedAt: string;
}
```

### Store Migration Required
When updating `localStore.ts`, include a **migration shim** that reads existing flat `projects.json` entries (which have `scriptText` instead of `chapters[]`) and converts them to the new format — otherwise old projects will break on load.

### Files to Modify
- [`packages/shared/src/index.ts`](file:///C:/Users/karth/Documents/BlokeTuber/packages/shared/src/index.ts) — new types above
- [`apps/api/src/db/localStore.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/db/localStore.ts) — add `chaptersStore`; add `addUsedMedia(projectId, items)`; add `migrateStore()` called on startup
- [`apps/api/src/routes/projects.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/routes/projects.ts) — add `POST /api/projects/:id/chapters`, `GET /api/projects/:id/chapters`
- [`apps/api/src/routes/pipeline.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/routes/pipeline.ts) — new route `POST /api/pipeline/start-chapter` that loads `project.usedMedia` and passes them as initial `usedMediaUrls` set before media resolution
- [`apps/web/app/page.tsx`](file:///C:/Users/karth/Documents/BlokeTuber/apps/web/app/page.tsx) — near-complete rewrite as multi-view app: Project List → Project Detail → Chapter Runner

### Web UI Flow (Option A: Chapter Manager)
```
[Home] → List all Projects + "New Project" button
[Project View] → Project name + list of chapters + "Add Chapter" button + "Combine All Chapters" button
[Chapter View] → Script input + audio upload + "Generate Chapter Video" + status progress + preview/download MP4
```

### Phase 5 Test Script
- Create: `apps/api/scripts/test_chapter_dedup.ts`
- Programmatically create a project, run 2 chapters with overlapping query topics.
- **Pass**: Zero URL or ID overlap between Chapter 1 and Chapter 2 `usedMedia` sets. Migration shim converts old projects without data loss.

---

## Final Execution Matrix

```
[x] Phase 1: 8 Animated Overlay Styles (videoRenderer.ts + type unions)
    └── Test: npx tsx apps/api/scripts/test_callout_animations.ts (PASSED)

[x] Phase 2: Audio-Word Sync Fix (spokenTrigger + normalizer + word-ratio fallback)
    └── Test: npx tsx apps/api/scripts/test_audio_sync.ts (PASSED)

[x] Phase 3: Query Compression & Stock Relevance (compressQuery + prompt rule)
    └── Test: npx tsx apps/api/scripts/test_stock_relevance.ts (PASSED)

[x] Phase 4: Dynamic Video vs. Photo (prompt redesign + fix line 408)
    └── Test: npx tsx apps/api/scripts/test_media_planner.ts (PASSED)

[x] Phase 5: Project/Chapter Architecture + Deduplication (full-stack)
    └── Test: npx tsx apps/api/scripts/test_chapter_dedup.ts (PASSED)
```

---
