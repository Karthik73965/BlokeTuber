# BlokeTuber — Broadcast Documentary Pipeline Architecture (100k+ Benchmark Standard)


> **Rule Zero:** Antigravity is the only AI. No OpenRouter/OpenAI/Groq/stock APIs. See `docs/ANTIGRAVITY_AUTOMATION_GUIDE.md` → Rule Zero, and `SETUP.md` for installation.
> **Reference Standard**: Broadcast documentary quality matching top-performing investigative channels (e.g. `@BeneaththeBridges` with 476k+ views on viral builds, and our top hit `$450 House for One Woman` with 8.6k views).  
> **Target**: 100% automated and semi-automated production targeting $\ge 100\text{k}$ views per video.

---

## 1. The Core 100k Benchmark Principles & Golden Rules

### Rule 1: The 100k Topic & Packaging Gate (Strict Filter Before Production)
- **High-View Archetype**: Low-cost, ingenious underdog survival engineering with an exact price and time constraint:
  - *Title Formula*: `What It’s Actually Like Living Inside the $[Price] [Ingenious Mechanism] Built [Time/Condition] for Homeless People`
  - *Proven High-View Examples*:
    - `$300 Folding Homes Built in 30 Minutes` (476,000 views)
    - `$300 Thermal Shelter Built at -40°F` (337,000 views)
    - `$450 House for One Woman Scaled Nationwide` (8,600 views)
    - `$500 Tiny Homes on Wheels` (49,000 views)
- **Banned Topics**: Abstract, depressing disaster lectures (*"When the Power Goes Out"*, *"Homelessness in 2026"*).

### Rule 2: Real Field Journalism & Soundbite Hooks (No Fictional Composites)
- **Zero Fictional Framing**: Strictly forbidden from creating fictional composite characters or imaginary cities (*"I built this woman from how these nights actually go"*).
- **Mandatory Real Anchors**: Every video must feature a real named person, real named location, and real documented build project (e.g. *Denise in Tacoma, Washington* or *Elvis Summers in Los Angeles*).
- **The First 15-Second Field Soundbite Hook**:
  - The video **MUST** open (`0:00 - 0:10`) with an authentic, gritty audio soundbite from on-the-ground interview footage (a resident, volunteer, or project founder speaking).
  - Voiceover enters at `0:15` with the concrete hook, followed by a 4-second musical pause/swell at `0:45` to build immersion.

### Rule 3: Scene-Based Storytelling Pacing (6s – 12s Cuts for Build Continuity)
- **Eliminate the Hyper-Cut Trap**: Moving away from rigid 3-second rapid chopping that breaks viewer focus.
- **Sustained Visual Continuity**: When the script explains the assembly of a wall panel, roof latch, or insulation layer, the footage must stay on the actual physical mechanism for **6.0 to 12.0 seconds**, allowing the viewer to absorb the space and engineering.
- **1-to-1 Visual Proof**: What is spoken must match what is seen. If the narrator speaks of turning a deadbolt key, the video must show the door and lock, not generic drone freeway traffic.

### Rule 4: Clean Broadcast Visuals (Banning Sci-Fi HUDs & Telemetry Cards)
- **Banned Gimmicks**:
  - Sci-fi telemetry odometers (`DEVICE BATTERY TELEMETRY 9% REMAINING`)
  - Corporate graphic boxes (`LOCATION: SOUTHEAST METROPOLITAN AREA`)
  - Artificial forensic cards, scanline HUDs, tilted blueprint tables, CRT monitors
- **Enforced Styling**:
  - Full-bleed 16:9 cinematic framing with subtle 35mm film grain (`micro_film_grain`).
  - **No Narration Captions**: No burned-in subtitles of the voiceover.
  - Minimal journalistic lower-thirds only when introducing a real person, organization, or location for the first time.

### Rule 5: Zero Stock Footage & Strict Zero-Repeat Guarantee
- **100% Authentic Documentary Sourcing**: 0% Pexels, 0% Pixabay, 0% Shutterstock. Sourced strictly from genuine documentary field footage, municipal hearings, and volunteer build logs.
- **Persistent Lockout Registry**: [`apps/api/src/services/mediaRegistry.ts`](file:///C:/Users/karth/Documents/BlokeTuber/apps/api/src/services/mediaRegistry.ts) persists to `uploads/registry/:projectId_media_registry.json`. Any asset used in any beat is permanently locked against reuse.

### Rule 6: The Machine-Enforced Semantic Vision Gate & Zero-Modulo Ban
- **Zero Modulo / Index-Loop Clip Mapping (`i % len(...)` is Fatal)**: No B-roll may be assigned via array index math. Every single beat must be explicitly linked to a verified source clip depicting the exact physical action.
- **Pre-Render Verification Script (`python scripts/verify_screening_manifest.py`)**:
  - Before Remotion can render a single chapter, `verify_screening_manifest.py` executes automatically.
  - It audits 100% of beats: verifies clip existence, duration buffer ($\ge \text{beat} + 1.5$s), 50% midpoint snapshot, and explicit semantic validation (`semanticMatch: true` with physical description).
  - If any beat has unverified B-roll or modulo reuse, the render script halts immediately with `exit 1`.

### Rule 7: Diegetic Room Tone & Natural Foley Layering
- **Zero Vacuum Audio**: External B-roll audio must not be completely muted into a dead vacuum.
- Sourced clips with environmental sound (cutting foam, tearing tape, footsteps on gravel, rain, wind) must be ducked to -20dB to -24dB beneath the master narration to create the tactile presence of an on-the-scene television documentary.

### Rule 8: No Burned-In Captions
- Remotion (`DocumentaryVideo.tsx`) does not render narration captions. Do not add per-beat `subtitle`/`text` fields to timeline clips.

### Stage 1: Visual Storyboard Planning (`/plan-storyboard`)
- Aligns narration audio with Faster-Whisper.
- Plans 5–9s dual-mode beats.
- Slices candidate clips into `uploads/raw/:projectId/pool_cfr30/`.
- Extracts 50% midpoint snapshots into `uploads/beat_snapshots/:projectId/`.
- Stages chapter timeline and semantic manifest for editor review.
- **Does NOT render final MP4 yet**.

### Stage 2: Editor Review & Swapping (Web UI / Storyboard)
- The editor inspects every beat in the web dashboard (`http://localhost:3000`).
- Views the 50% midpoint snapshot side-by-side with the spoken text.
- One-click swap for any beat via targeted YouTube search, Archive.org, or local footage.
- Runs `python scripts/verify_screening_manifest.py` to ensure 100% gate compliance.

### Stage 3: Master Sequential Render (`/render-storyboard`)
- Sequentially renders each chapter in an isolated process with memory reclamation.
- Losslessly stitches into `master_documentary_<project>.mp4`.
- Runs whole-film `freezedetect=n=0.003:d=1.5` to verify 0 freeze frames.

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
