# 🎬 Antigravity Documentary Video Automation Guide

This guide documents the complete end-to-end workflow developed with **Google Antigravity** to plan, pace, source, deduplicate, and render multi-chapter documentary films in **BlokeTuber** without relying on expensive LLM token quotas or facing API rate limits.

---

## 1. Executive Architecture

```mermaid
flowchart TD
    A[Voiceover Narration Audio\n.mp3 in AUD/] --> B[Whisper Alignment\nWord-Level Timestamps]
    C[Hand-Crafted Documentary Beats\ndirect_ikea_chapters.ts] --> D[Fast & Punchy Subdivider\n1.0s - 3.0s baseline, max 4.5s]
    B --> D
    D --> E[Pexels & Pixabay Stock Sourcing\nFast H.264 1080p + 10s Timeout]
    F[Local Raw Footage\nRAW/ Directory (Max 1x Use)] --> E
    E --> G[Timeline Assembly\ntimeline.json & Layout Overlays]
    G --> H[Project-Wide Deduplicator\nenforce_unique_footage.ts]
    H --> I[Dashboard Database Sync\noutput/store/projects.json]
    I --> J[Sequential Remotion Rendering\nChromium + HTTP Media Server]
    J --> K[Final Rendered Video\nfinal_video.mp4]
```

---

## 2. Why Antigravity Instead of OpenRouter / External LLMs?

### The 402 Out-Of-Credits Issue
When calling external LLM providers (e.g. OpenRouter `claude-3-5-sonnet` or `gemini-pro`), if `max_tokens` is omitted in the API request payload, the provider calculates credit reserve for the model's **maximum potential output token ceiling** (typically 64,000 tokens). Even if your prompt only generates 1,000 tokens, OpenRouter blocks the request with:
```
402: "You requested up to 64000 tokens, but can only afford 51506."
```

### The Antigravity Advantage
1. **Zero Token Cost ($0.00)**: Script planning and director beats are written directly into structured TypeScript beat definitions.
2. **Superior Creative Direction**: Tailored documentary visual cues (e.g., specific Seattle overcast weather, Renton street scenes, dental reception offices, modular Pallet villages) rather than generic AI responses.
3. **No Network Latency or Truncation**: Timelines generate in milliseconds rather than waiting 45 seconds for a model to stream JSON.

---

## 3. Core Production Pipeline Files

| File Path | Description |
|---|---|
| [`apps/api/scripts/direct_ikea_chapters.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/scripts/direct_ikea_chapters.ts) | Master director beat manifest containing scene beats, visual queries, backup queries, animated text callouts, and layout configurations. |
| [`apps/api/src/services/aiScriptPlanner.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/aiScriptPlanner.ts) | Implements `mapPlannedBeatsToTiming`: 3-pass fast-paced subdivider enforcing 1.0s–3.0s baseline cuts and hard 5.0s caps. |
| [`apps/api/src/services/stockFootage.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/stockFootage.ts) | Stock footage search & download engine. Optimized with medium video priority, 10s timeout aborts, and 100MB size guards. |
| [`apps/api/scripts/process_ikea_chapter.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/scripts/process_ikea_chapter.ts) | End-to-end chapter runner: loads beats, aligns Whisper timestamps, sources clips, builds `timeline.json`, and writes to `projectsStore`. |
| [`apps/api/scripts/enforce_unique_footage.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/scripts/enforce_unique_footage.ts) | Project-wide deduplication engine. Ensures all 345+ cuts across all 11 chapters use 100% unique video files. |
| [`apps/api/src/services/remotionRenderer.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/remotionRenderer.ts) | Remotion React video rendering engine with built-in HTTP range-streaming server. |
| [`apps/api/scripts/render_all_chapters_sequential.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/scripts/render_all_chapters_sequential.ts) | Sequential batch runner rendering chapters 1 through 11 one by one to keep RAM usage low. |

---

## 4. Step-by-Step: How to Run & Replicate

### Step 1: Add or Direct Chapter Beats
Open [`apps/api/scripts/direct_ikea_chapters.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/scripts/direct_ikea_chapters.ts) and define your beats:
```typescript
{
  beatIndex: 0,
  chapterIndex: 1,
  text: "Narration sentence from your audio script...",
  visualSubject: "description_of_subject",
  mediaType: "video",
  layout: "full_bleed_cinematic", // or "ambient_blur_frame", "editorial_sidebar_column"
  stockVideoQuery: "high precision 4-word search query",
  backupVideoQuery: "alternative fallback visual query",
  negativeKeywords: ["unwanted", "elements"],
  callout: {
    type: "editorial_lower_third", // or "newspaper_headline", "quote_card"
    line1: "HEADER LINE",
    line2: "SUBTITLE LINE",
    spokenTrigger: "keyword in speech",
    themeColor: "gold"
  }
}
```

### Step 2: Process a Single Chapter or Range
From `C:\Users\karth\Documents\BlokeTuber\apps\api`:
```bash
# Process Chapter 1:
npx tsx scripts/process_ikea_chapter.ts 1

# Process Chapters 2 through 4:
npx tsx scripts/process_ikea_chapter.ts 2 4
```

### Step 3: Run Project-Wide Deduplication
To guarantee that no video file is ever reused across any chapter in the entire documentary:
```bash
npx tsx scripts/enforce_unique_footage.ts
```
*Automatically scans all chapters, identifies any duplicated clip, and downloads fresh, unique 1080p footage from Pexels/Pixabay.*

### Step 4: Sequentially Render All Videos
To render all 11 chapters one after another without running out of RAM:
```bash
npx tsx scripts/render_all_chapters_sequential.ts
```
*Renders Chapter 1 → saves `final_video.mp4` → cleans memory → renders Chapter 2 → and so on.*

---

## 5. Stock Footage Download Optimization Rules

When downloading stock media for fast-paced video editing:
1. **Prefer `medium` or `small` video streams** in Pixabay / Pexels. `large` or `original` files can be 100MB+ and take 30 seconds to download. `medium` files are 3–6MB, crystal clear 1080p, and download in 0.5s.
2. **Always include a download timeout**:
   ```typescript
   fetch(video.url, { signal: AbortSignal.timeout(10000) });
   ```
3. **Filter out multi-gigabyte or non-CDN files**:
   Reject any file where `Content-Length > 100MB` to avoid Node Buffer allocation crashes (`RangeError: ERR_OUT_OF_RANGE`).
4. **Fast stream copy with ffmpeg**:
   ```bash
   ffmpeg -nostdin -y -i input.mp4 -c copy -movflags +faststart output.mp4
   ```
   Avoids CPU re-encoding during download so asset saves finish in milliseconds.

---

## 6. Verifying in the Web Dashboard

All completed chapter timelines are automatically stored in [`output/store/projects.json`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/output/store/projects.json).
- Navigate to `http://localhost:3000/project/abac4778-84a5-486b-8675-32161d7885e0`
- Preview video tracks, subtitle timings, animated graphic overlays, and play back any chapter instantly!
