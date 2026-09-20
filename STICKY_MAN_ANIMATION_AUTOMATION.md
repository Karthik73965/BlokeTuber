# 🎨 Sticky Man Animation Automation Guide
*Engineering Hand-Drawn Educational Stickman Documentaries with Remotion, Whisper, and Multi-Agent Orchestration*

---

## 📌 1. Overview & Channel Philosophy

This document serves as the permanent reference and blueprint for automating high-retention, educational stickman documentaries (such as *"Why Are Villages in Hot Countries Always Painted White?"*), following the viral aesthetic seen in reference channels (e.g., [YouTube reference `1L0BVSHc3r8`](https://www.youtube.com/watch?v=1L0BVSHc3r8&t=107s)).

### The Golden Rule: Story Over Lecture
Traditional educational videos fail when they resemble classroom PowerPoint slides with walls of text and static voiceovers. In contrast, this channel formula works because:
1. **Visual Pacing**: The viewer's eyes are given a new visual state or cut every **2.5 to 4.5 seconds**.
2. **Visual Metaphor Over Text**: We show a stick figure suffering beside an oven car or an alkaline wave dissolving cholera bacteria instead of listing bullet points.
3. **No White Void**: Every scene places characters inside an **immersive, full-bleed colored environment** (desert horizons, Aegean island plazas, scorching parking lots, rooftop skylines).

---

## 🎯 2. Strict Visual & Audio Directives

Every automated video must strictly enforce these six non-negotiable rules:

| Rule | Requirement | Implementation |
| :--- | :--- | :--- |
| **1. Beat Duration ($\ge$ 4.0s)** | Every sequence/beat must be **at least 4.0 seconds** ($\ge 120$ frames @ 30fps). Sweet spot: 120f–180f (4.0s–6.0s). | Never cut under 120 frames. Allow visual gags and characters breathing room to act and register. |
| **2. Word-Level Audio Sync** | Visuals, labels, and character reactions must sync tightly to spoken words. | Use Whisper word-level timestamps (`word.start`, `word.end`). Pop-in props/labels on the exact spoken syllable. |
| **3. Zero Text-Overflow & Safe Badges** | Text must NEVER spill outside pills; pills must NEVER collide with background buildings. | Use `<StoryBadge>` (generous $2.2\times$ padding, Comic Sans / system sans bold) or `<HtmlBadge>`. Title badges $y \le 160$; speech pills cleared of background props. |
| **4. Immersive Staging & Grounding** | No floating stickers or random clipart feel. World must feel cohesive and alive. | All characters and ground props have `<GroundShadow>` ellipses. 3-layer depth (Sky/Hills $\to$ Midground Barn/Fence $\to$ Foreground Stage). Stickman pupils gaze at props. |
| **5. 100% Environmental Backdrops** | Absolutely **no plain white or cream void/paper backgrounds** (`#FAF8F5`). | Use `FarmPastureEnv`, `BarnInteriorEnv`, `SummerSkyGroundEnv`, `MediterraneanVillageBackdrop`, or themed split screens. |
| **6. Stickman Anatomy (ref_107s)** | Parallel vertical legs `\|  \|`, outward flaring arms `\  /`, clean T-shirt paths. | Vector geometry in [`DoodleStickman.tsx`](file:///C:/Users/karth/Documents/BlokeTuber/packages/remotion-video/src/animated-story/DoodleStickman.tsx). |

---

## 🧍 3. Stickman Vector Geometry Formula (`ref_107s.jpg`)

The stickman character is the emotional surrogate for the viewer. It must look hand-drawn, expressive, and physically balanced.

```
                  (  O   O  )  <-- Head (r=46), Big Oval Eyes with Directional Pupils
                    \  |  /    <-- Clean Neck (12px)
                   /-------\   <-- Outward Angled Sleeves
      Left Arm    |  SHIRT  |   Right Arm
         \        |         |        /
          o        \-------/        o   <-- Hands (r=6) at Wrists
                    |     |     <-- Parallel Vertical Legs (|  |)
                    |     |
                   ---   ---    <-- Feet Pointing Outward
```

### Key Dimensions (`packages/remotion-video/src/animated-story/DoodleStickman.tsx`)

#### A. Head & Expressive Eyes
- **Head**: Circle at `(0, 0)` with radius `r = 46`, stroke width `5px`, fill `#FFFFFF`.
- **Eyes**: Two large white oval circles at `cx = -15, 15`, `cy = -6`, radius `r = 14`, stroke `4px`.
- **Directional Pupils**: Filled circles `r = 5.5`, `#18181B`, dynamically offset by direction:
  - `center`: `(0, 0)`
  - `up_right`: `(+4, -4)` (curious / looking at props)
  - `left`: `(-5, 0)`
  - `down`: `(0, +5)` (looking at floor / sad)
- **Sweating Face**: Slanted eyes `\  /` with teardrop SVG sweat drops popping off cheeks in `#60A5FA`.

#### B. T-Shirt (Torso)
- **No Spine Overlap**: The T-shirt is drawn as a closed SVG path with `fill={shirtColor}`. The torso spine line `(0, headRadius) -> (0, headRadius + 115)` is **only** drawn when no shirt is present.
- **Sleeve Angle**: Sleeves flare downwards at a $45^\circ$ angle with clean cuff lines.

#### C. Parallel Vertical Legs (The `ref_107s` Fix)
- **Previous Error**: Drawing legs as a triangular tripod `/\` starting from a single point `(0, y)` makes characters look disjointed.
- **The Correct Formula**:
  ```tsx
  const legStartY = headRadius + (shortsColor ? 155 : 115);
  const legEndY   = headRadius + (shortsColor ? 230 : 205);

  // Left Leg: Starts under left hip, drops straight down
  <line x1={-16} y1={legStartY} x2={-16} y2={legEndY} strokeWidth={6} strokeLinecap="round" />
  // Left Foot: Extends outwards to the left
  <line x1={-16} y1={legEndY} x2={-32} y2={legEndY} strokeWidth={6} strokeLinecap="round" />

  // Right Leg: Starts under right hip, drops straight down
  <line x1={16} y1={legStartY} x2={16} y2={legEndY} strokeWidth={6} strokeLinecap="round" />
  // Right Foot: Extends outwards to the right
  <line x1={16} y1={legEndY} x2={32} y2={legEndY} strokeWidth={6} strokeLinecap="round" />
  ```

#### D. Arms & Hands
- Both arms emerge from the center of each sleeve opening (`lx = -48, ly = headRadius + 45` and `rx = 48, ry = headRadius + 45`).
- Hands are drawn as circular endpoints (`r = 6px`) attached to wrists so hands never float detached.

---

## 🏞️ 4. Environmental Backdrop Library (`StoryEnvironments.tsx`)

Every scene must be wrapped in one of the full-bleed environmental templates:

### 1. `SummerSkyGroundEnv` (Default Exterior)
- **Sky**: Cyan (`#38BDF8`), Deep Blue (`#0284C7`), or Blazing Heat (`#EA580C`, `#C2410C`).
- **Ground**: Mediterranean Sand (`#D4A373`), Terracotta Dust (`#C89666`), or Scorched Earth (`#9A3412`).
- **Props**: Dynamic cartoon sun (happy or angry with sweat drops), hand-drawn fluffy clouds, and horizon village silhouettes.

### 2. `MediterraneanVillageBackdrop` (Cycladic Island Setting)
- Full-bleed Aegean sky and whitewashed cubic village architecture.
- Central church with Aegean blue dome, white cross, bell tower, and cobblestone plaza.
- Foreground characters placed at `y = 630`–`640` so they stand firmly on the plaza stones.

### 3. `ParkingLotEnv` (Modern Heat Island / Physics)
- Deep cyan sky, horizon line at $y = 520$, dark asphalt ground (`#334155`), painted yellow parking bay lines (`#FACC15`).

### 4. `ModernWhiteRoofsScene` (Synthesis Scene)
- Deep urban navy backdrop (`#0F172A`), modern skyscraper silhouettes, flat white reflective roofs with upward yellow solar vectors (`↑ 85% REFLECTED`).

### 5. `PostcardVsRealityScene` (Climax Finale)
- Split comparison scene:
  - **Left Card**: Vintage tourist postcard with Aegean blue stamp (*"What the World Sees"*).
  - **Right Card**: Ancient survival engineering blueprint (*"Thermal Reflection + pH 12 Disinfectant + Democratic Lime"*).

---

## ⏱️ 5. Whisper Audio-Visual Sync & Beat Segmentation

To ensure zero lag between speech and animation:

1. **Extract Exact Word Timestamps**: Run Whisper (`whisper.transcribe` with `word_timestamps=True`) on each chapter's voiceover MP3.
2. **Beat Aggregator & Strict $\ge 4.0$s Rule**:
   - Every beat/cut must have a **strict minimum duration of 4.0 seconds ($\ge 120$ frames @ 30fps)**.
   - Ideal beat range: **120 to 180 frames (4.0s to 6.0s)**.
   - **Never cut under 120 frames**. If a spoken sentence is brief, extend the beat to $\ge 120$ frames with secondary character acting (stickman looking around, blinking, subtle camera zoom) to avoid visual whiplash.
3. **Word-Level Visual Synchronization**:
   - Map key nouns, verbs, and punchlines directly to Remotion frames:
     `startFrame = Math.max(0, Math.round((word.start - beat.startTime) * 30))`
   - When the narrator says "cow", the cow appears or animates. When the narrator says "YES, MILK THAT!", the decision pill pops in on that exact syllable.
4. **Remotion Sequence Mapping**:
   ```tsx
   {/* BEAT 1: (0 - 135f / 0.0s - 4.5s) "Go to the hottest sun-blasted parts of the world..." */}
   <Sequence from={0} durationInFrames={135}>
     <SummerSkyGroundEnv ...>
       <DoodleStickman ... />
     </SummerSkyGroundEnv>
   </Sequence>

   {/* BEAT 2: (135 - 270f / 4.5s - 9.0s) "...and you'll see the same thing over and over." */}
   <Sequence from={135} durationInFrames={135}>
     ...
   </Sequence>
   ```

---

## 🏗️ 6. Modular Chapter Architecture

The documentary is organized into modular chapters, allowing independent rendering, rapid iteration, and seamless composition:

```
packages/remotion-video/src/white-home/
├── chapters/
│   ├── Chapter0_Hook.tsx          (2,420 frames / 80.7s  / 22 beats)
│   ├── Chapter1_Physics.tsx       (4,775 frames / 159.2s / 41 beats)
│   ├── Chapter2_PeoplePain.tsx    (2,257 frames / 75.2s  / 22 beats)
│   ├── Chapter3_Health.tsx        (5,114 frames / 170.5s / 54 beats)
│   ├── Chapter4_Ritual.tsx        (1,607 frames / 53.6s  / 16 beats)
│   └── Chapter5_Closing.tsx       (5,051 frames / 168.4s / 44 beats)
├── shared/
│   ├── StoryEnvironments.tsx      (Full-bleed background scenes)
│   └── WhiteHomeElements.tsx      (pH meter, microscope, Greek decree, lime kiln)
└── WhiteHomeMasterVideo.tsx       (Full 21,224-frame master composition)
```

---

## 🚀 7. High-Speed Production Rendering Pipeline

Rendering an 11m 47s (21,224 frames @ 30fps, 1080p) video can easily take 45+ minutes if done naively. Our optimized production pipeline completes the entire job in **under 8.5 minutes**:

### Step 1: Multi-Agent Parallel Audit
Before rendering, spawn 3 subagents to review chapter pairs simultaneously:
- **Agent 1**: Chapter 0 (Hook) & Chapter 1 (Physics)
- **Agent 2**: Chapter 2 (Economics) & Chapter 3 (Health)
- **Agent 3**: Chapter 4 (Ritual) & Chapter 5 (Closing)
Each agent checks: Zero SFX, beat duration $\le 140$f, background presence, stickman shirts/legs, and `npx tsc --noEmit`.

### Step 2: High-Concurrency Sequential Rendering (`render_overhaul_sequential.ts`)
- Utilizes Remotion's headless Chrome renderer with `concurrency: 8` (optimized for 16-core Ryzen processors).
- Renders each chapter sequentially to prevent memory thrashing and GPU out-of-memory errors:
  - Chapter 0: 49.3s
  - Chapter 1: 103.8s
  - Chapter 2: 52.4s
  - Chapter 3: 111.3s
  - Chapter 4: 36.3s
  - Chapter 5: 114.3s
  - **Total Chapter Render Time**: ~503 seconds (~8.4 minutes).

### Step 3: Instant Lossless FFmpeg Stitching ($< 1$ Second)
Since all 6 chapters share the identical resolution (1920x1080), framerate (30fps), color space, and audio sample rate (AAC 48kHz), FFmpeg stitches them losslessly without re-encoding:
```bash
ffmpeg -y -f concat -safe 0 -i concat_list.txt -c copy WhiteHome_Master_Overhaul.mp4
```
This generates the final 83.13 MB master video in **0.38 seconds**!

### Step 4: Automated Boundary Verification
The script automatically extracts snapshots at chapter transition points:
- `15s`: Chapter 0 Hook
- `85s`: Chapter 1 Physics Start
- `140s`: Chapter 1 Car Heat Oven
- `245s`: Chapter 2 People's Paint
- `275s`: Chapter 2 Limestone Quarry
- `320s`: Chapter 3 Health Reason Start
- `380s`: Chapter 3 Microscope Bacteria Disinfection
- `430s`: Chapter 3 Greek Royal Decree & pH Scale
- `490s`: Chapter 4 Whitewash Ritual Start
- `515s`: Chapter 4 Family Painting Plaza
- `545s`: Chapter 5 Closing Start
- `620s`: Chapter 5 Postcard vs Reality Climax
- `700s`: Chapter 5 Finale

---

## 📋 8. CLI Command Cheat-Sheet for Future Productions

### Test TypeScript Types Across All Chapters
```bash
npx tsc --noEmit
```

### Run Sequential Master Production Render (All 6 Chapters + Stitch)
```bash
npx tsx apps/api/scripts/render_overhaul_sequential.ts
```

### Render a Single Chapter for Review
```bash
npx tsx apps/api/scripts/render_overhaul_sequential.ts ch1
```

### Lossless Stitch Only (If Chapters Are Already Rendered)
```bash
node scratch/stitch_master.js
```

---

## 🏆 Summary Checklist for Any New Video

Before finalizing any new documentary:
- [x] **Audio**: Single `<Audio>` voiceover tag per chapter. Zero cartoon sound effects.
- [x] **Pacing**: Every `<Sequence>` duration $\le 140$ frames (< 4.7s).
- [x] **Backdrop**: Full-bleed SVG environment on 100% of frames. Zero bare white screens.
- [x] **Characters**: All stickmen wear shirts, have parallel legs `| |`, and outward arms `\ /`.
- [x] **Text**: 1–3 words, high-contrast badges, placed safely above character heads.
- [x] **Master Quality**: 1080p @ 30fps H.264, losslessly stitched and boundary-verified.
