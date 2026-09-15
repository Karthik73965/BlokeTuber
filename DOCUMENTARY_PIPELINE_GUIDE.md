# BlokeTuber — Documentary Pipeline Architecture & Testing Guide

> **Reference Standard**: Quality matching `C:\Users\karth\Videos\AmericanHideaways\AH - ELVIS_Final.mp4`  
> **Target**: 100% automated and semi-automated production for all future documentary video projects.

---

## 1. Core Principles & Golden Rules

### Rule 1: Strict Zero-Repeat Guarantee ("Never Repeat Anytime Throughout Video")
- **Persistent Lockout Registry**: [`apps/api/src/services/mediaRegistry.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/mediaRegistry.ts) persists to `uploads/registry/:projectId_media_registry.json`.
- Any video clip, stock asset, local file, or user-swapped media is permanently locked by:
  1. Source URL / identifier
  2. Basename filename (e.g. `desert_van_clip_001.mp4`)
  3. Binary MD5 content hash
- Once used in **any** beat or chapter, that media asset is permanently forbidden from repeating anywhere in the entire documentary.

### Rule 2: Authentic Sourced B-Roll Over Generic Stock Photos
- Rather than generic stock photos or unrelated stock clips, the pipeline ingests curated YouTube documentary footage.
- Downloads top-quality 1080p source videos via `yt-dlp` (`C:\Users\karth\AppData\Local\Programs\Python\Python311\Scripts\yt-dlp.exe`).
- Automatically slices long videos into 4–8 second narrative B-roll clips via FFmpeg.
- Extracts 2 keyframe preview screenshots (`_p1.jpg`, `_p2.jpg`) for visual inspection.

### Rule 3: In-Session Visual Screening (Antigravity Direct Inspection)
- **Zero Third-Party Vision API Costs**: Screening is performed directly by the Antigravity agent in-session.
- Screenshots are saved to `uploads/raw/:projectId/screenshots/`.
- Screening criteria:
  - **Subject Match**: Reject if demographic/character age does not match (e.g. young woman walking when script calls for elderly woman).
  - **Action Match**: Reject if action contradicts narration (e.g. sleeping when script calls for walking).
  - **Era & Environment**: Reject modern office buildings or luxury vehicles when narrative is set in rural highways or vintage campers.
- Screening status (`approved`, `pending`, `rejected`) is tracked in `uploads/raw/:projectId/manifest.json`.

### Rule 4: Clean Full-Bleed 16:9 Presentation (Zero Cheesy Gimmicks)
- **Banned Templates**: Fake newspaper clippings (*The Daily Chronicle*), CRT TV scanline monitors, tilted blueprint tables, floating surveillance matrix HUDs, polaroids.
- **Enforced Styling**: Clean full-bleed 16:9 cinematic framing with subtle organic film textures:
  - `micro_film_grain`
  - `film_dust_scratches`
- Typography: Minimal, punchy, bold centered callouts (e.g. **SMOKIE**) only when truly necessary.

### Rule 5: Review Gate (Option A Workflow)
- **Stage 1 (`/plan-storyboard`)**:
  - Aligns narration audio with Whisper.
  - Plans 4–7s beats.
  - Matches approved sourced raw clips and high-confidence stock.
  - Assembles `timeline.json` and stages chapter with playable video thumbnails.
  - **Does NOT render final MP4 yet**.
- **User Review & Swapping**:
  - Inspect every beat in the web dashboard.
  - Hover to play video thumbnails.
  - Swap any beat via **Online Stock**, **Local Folder**, or **Sourced Raw Footage (YouTube Pool)** tab.
  - Split beats longer than 5s with one click.
- **Stage 2 (`/render-storyboard`)**:
  - Sequentially renders the final Remotion MP4 upon approval.

---

## 2. Step-by-Step Workflow for Testing in a New Chat

When opening a new chat session to test a new video project, follow these steps:

### Step 1: Verify Servers
From the monorepo root:
```powershell
npm run dev
```
- **Web Dashboard**: `http://localhost:3000`
- **Express API**: `http://localhost:3001`

### Step 2: Create a Project & Chapter
1. Open `http://localhost:3000` in the browser (or use API `POST /api/projects`).
2. Create project: e.g. **"Nomad Heartland"** with script narration.
3. Add Chapter 1: Provide Chapter Title and **Director Brief / Visual Anchor** (e.g. *"70-year-old elderly woman living in a 1995 camper van on desert highway. Slow moody pacing, no young people or modern office workers."*).

### Step 3: Ingest YouTube Source Footage
In the Web Dashboard:
- Click the top-right button **"🎥 Add YouTube Links"** or **"🎥 Source Footage (YT)"**.
- Paste YouTube URLs (e.g., van life documentaries, rural desert road footage) OR enter an auto-search topic: e.g. *"desert highway camper van documentary"*.
- Click **"⬇️ Ingest & Slice Raw Clips"**.
- Behind the scenes:
  - `yt-dlp` downloads videos in 1080p to `uploads/raw/:projectId/`.
  - FFmpeg cuts clips into 4–8s slices.
  - Preview screenshots are extracted into `uploads/raw/:projectId/screenshots/`.

### Step 4: Antigravity In-Session Visual Screening
In the agent chat session:
1. Call `GET http://localhost:3001/api/projects/:projectId/screening-digest`.
2. Inspect screenshots using `view_file` on candidate screenshots.
3. Review for relevance:
   - To approve: `POST http://localhost:3001/api/projects/:projectId/media-pool/:clipId/approve`
   - To reject: `POST http://localhost:3001/api/projects/:projectId/media-pool/:clipId/reject` with `{ "reason": "young person in frame" }`

### Step 5: Generate Visual Storyboard (Stage 1)
1. In Chapter Studio (`http://localhost:3000/project/:projectId/chapter/:chapterId`), attach voiceover narration audio (`.mp3` or `.wav`).
2. Click **"🎬 Stage 1: Plan Visual Storyboard"**.
3. Whisper aligns word timings, the AI Director selects approved raw clips, and builds `timeline.json`.
4. The chapter transitions to `📋 STORYBOARD STAGED & READY FOR REVIEW`.

### Step 6: Interactive Review & Clip Swapping
1. Review the beat grid: hover over any video thumbnail to preview in real-time.
2. If any beat needs a change:
   - Click **"🔄 Swap Clip"**.
   - Select the **"🎥 Sourced Raw Footage (YouTube Pool)"** tab to select from your sliced footage.
   - Or search Online Stock (Pexels/Pixabay) or Local Folder.
   - Any swapped clip is instantly locked in `mediaRegistry.json` so it will never repeat.

### Step 7: Render Final Video (Stage 2)
1. Click **"🚀 Stage 2: Render Final Video"**.
2. Remotion renders the sequence into 1080p MP4 with film dust and grain overlays.
3. Download or play back the rendered video directly in the browser.

---

## 3. Key Endpoints Reference

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/projects/:id/youtube-links` | `POST` | Ingest user-provided YouTube URLs, download & slice into raw clips |
| `/api/projects/:id/auto-search-youtube` | `POST` | Auto-search top 2 YouTube videos per topic, download & slice |
| `/api/projects/:id/media-pool` | `GET` | Get manifest of all sliced clips, screenshots, and review statuses |
| `/api/projects/:id/media-pool/:clipId/approve` | `POST` | Mark clip approved for pipeline AI matching |
| `/api/projects/:id/media-pool/:clipId/reject` | `POST` | Mark clip rejected with reason |
| `/api/projects/:id/screening-digest` | `GET` | Antigravity markdown screening report with screenshot paths |
| `/api/pipeline/plan-storyboard` | `POST` | Stage 1: Audio alignment + storyboard assembly (no video render) |
| `/api/pipeline/render-storyboard` | `POST` | Stage 2: Render staged storyboard into final MP4 |
| `/api/pipeline/swap-clip` | `POST` | Replace beat asset & lock permanently in `mediaRegistry` |
| `/api/pipeline/media?file=...` | `GET` | Stream local video or image with HTTP Range support |

---

## 4. Key Files in Codebase

- [`apps/api/src/services/youtubeSourcing.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/youtubeSourcing.ts): `yt-dlp` download, FFmpeg clip slicing, screenshot extraction.
- [`apps/api/src/services/mediaRegistry.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/mediaRegistry.ts): Strict project-wide media lockout by URL, filename, and MD5 hash.
- [`apps/api/src/services/visualScreening.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/visualScreening.ts): In-session screening management and markdown digest.
- [`apps/api/src/routes/projects.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/routes/projects.ts): Sourcing and screening endpoints.
- [`apps/api/src/routes/pipeline.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/routes/pipeline.ts): Stage 1 (`/plan-storyboard`), Stage 2 (`/render-storyboard`), clean 16:9 layout enforcement, film grain/dust overlays.
- [`apps/web/app/components/YouTubeLinksModal.tsx`](file:///C:/Users/karth/Documents/BlokeTuber/apps/web/app/components/YouTubeLinksModal.tsx): UI modal for adding links and auto-search.
- [`apps/web/app/components/ClipSwapModal.tsx`](file:///C:/Users/karth/Documents/BlokeTuber/apps/web/app/components/ClipSwapModal.tsx): 3-tab modal: Online Stock, Local Video, and Sourced Raw Footage (YouTube Pool).
- [`apps/web/app/project/[projectId]/page.tsx`](file:///C:/Users/karth/Documents/BlokeTuber/apps/web/app/project/[projectId]/page.tsx): Project overview with "Add YouTube Links".
- [`apps/web/app/project/[projectId]/chapter/[chapterId]/page.tsx`](file:///C:/Users/karth/Documents/BlokeTuber/apps/web/app/project/[projectId]/chapter/[chapterId]/page.tsx): Chapter Studio with interactive storyboard grid, live video hover previews, and 2-stage buttons.
