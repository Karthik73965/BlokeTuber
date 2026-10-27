# 🎬 Antigravity Documentary Video Automation Guide

This guide documents the complete end-to-end production pipeline developed with **Google Antigravity** to source, curate, screen, pace, cross-check, deduplicate, sequentially render, and losslessly stitch multi-chapter broadcast documentary films in **BlokeTuber** without relying on expensive LLM token quotas, third-party vision APIs, or manual video editing.

---

## 0. The Antigravity-First Directive (100% Agent-Operated)

> [!IMPORTANT]
> **Everything is executed directly by Antigravity in-session.**  
> The entire documentary pipeline—from audio ingestion and targeted clip sourcing to in-session visual screening, beat snapshot auditing, sequential isolated Remotion rendering, and FFmpeg master stitching—is autonomously run and verified by the Antigravity agent.

### Core Tenets:
1. **Zero Third-Party Vision / LLM API Fees ($0.00)**:
   - Visual screening of extracted keyframes and beat snapshots is performed directly by Antigravity using `read_file` on local `.jpg` images. No OpenAI Vision or Claude Vision API keys are required.
   - Script directing and beat subdivision are written directly into structured TypeScript beat definitions, eliminating OpenRouter token limits and `402 Out-of-Credits` failures.
2. **Autonomous Tool & CLI Execution**:
   - Antigravity directly operates `yt-dlp`, FFmpeg, local Whisper transcription, database syncs, Remotion render CLI commands, and FFmpeg concat tools via PowerShell.
3. **Automated Error Self-Healing**:
   - If a clip fails download, exceeds size limits, trips Windows file locks (`EPERM`), or violates broadcast cleanliness, Antigravity diagnoses the failure, swaps fallbacks, updates manifests, and resumes rendering autonomously.
4. **Hands-Off Experience**:
   - The user provides the narration audio/script and creative direction; Antigravity executes all pipeline stages, audits every beat, and delivers the finished broadcast video into a dedicated directory.

---

## 1. Executive System Architecture

```mermaid
flowchart TD
    AGENT[🤖 Antigravity Agent\nIn-Session Autonomous Orchestrator] --> AUDIO
    AGENT --> SOURCING
    AGENT --> TRANSITIONS
    AGENT --> CALLOUTS
    AGENT --> QA_AUDIT
    AGENT --> RENDER
    AGENT --> MASTER

    subgraph INGESTION["1. Ingestion & Alignment"]
        AUDIO[Voiceover Narration Audio\n.mp3 in uploads/audio/] --> WHISPER[Whisper Word Alignment\nExact Word-Level Timestamps]
        WHISPER --> BEAT_SPLIT[Strict Beat Slicer\nHard Ceiling <= 5.00s per Beat]
    end

    subgraph CURATION["2. Sourcing & Zero-Freeze Buffer"]
        SOURCING[Diverse Source Pool\nTargeted YouTube / Archival / Stock] --> SLICE[FFmpeg Pre-Buffered Slicer\nClip Duration >= Beat Duration + 1.0s]
        SLICE --> DIVERSITY[Anti-YouTube Dump Guard\nZero Consecutive Slices]
        DIVERSITY --> CLEANLINESS[Broadcast Cleanliness Filter\nZero Watermarks / Logos / Chyrons]
    end

    subgraph AUDIO_VISUAL_DESIGN["3. Transitions, Whooshes & Grounded Callouts"]
        TRANSITIONS[Cinematic Transitions & Whooshes\nEvery 3-5 Beats: Whip Pan, Film Burn, Shutter]
        CALLOUTS[Verbatim Grounded Callouts\n100% Sourced from Spoken Words + Entrance SFX]
    end

    subgraph VERIFICATION["4. Visual & Audio Inspection Gate"]
        CLEANLINESS --> TIMELINE[Timeline Assembly\nchapter_XX_final.json]
        TRANSITIONS --> TIMELINE
        CALLOUTS --> TIMELINE
        TIMELINE --> SNAPSHOTS[Beat Snapshot Extraction\nbeat_XX.jpg at 50% Timestamp]
        SNAPSHOTS --> QA_AUDIT[Automated QA Gate\nfreezedetect + blackdetect + Callout Word-Match]
        QA_AUDIT -->|Approved| STAGE[Staged & Verified Timeline]
    end

    subgraph SEQUENTIAL_RENDER["5. Isolated Sequential Rendering"]
        STAGE --> DEDICATED[Dedicated Project Folder\noutput/:project_name_rendered/]
        DEDICATED --> ISOLATED[Isolated Child Process Render\nnpx tsx render.ts per Chapter]
        ISOLATED --> COOLDOWN[Memory Cooldown 3s-5s\n100% RAM & Chromium Reclamation]
        COOLDOWN --> MP4S[Rendered Chapter MP4s\nchapter_01.mp4 ... chapter_NN.mp4]
    end

    subgraph ASSEMBLY["6. Lossless Master Assembly & Sync"]
        MP4S --> CONCAT[FFmpeg Lossless Concat Demuxer\n-c copy concat_list.txt]
        CONCAT --> MASTER[Master Documentary Video\nmaster_documentary_:project.mp4]
        MASTER --> STORE[Dual Store Synchronization\nAPI Store + Root Store]
        STORE --> UI[Web Dashboard Live Playback\nhttp://localhost:3000]
    end
```

---

## 2. The Golden Rules of Beat Pacing & Audio-Visual Alignment

> [!CAUTION]
> **Violating beat pacing and audio alignment destroys viewer retention.**  
> Never let beats drag beyond 5.0 seconds. Never allow static frames, audio-visual disconnects, or hallucinated text callouts.

### Rule 1: The Hard 5.0-Second Beat Ceiling
- **Absolute Maximum Beat Duration: $\le 5.00$ seconds** (Strictly enforced in code and scripts).
- **Target Beat Duration: 2.5s – 4.5s** (~6 to 12 spoken words).
- If a sentence in the script is 8 to 12 seconds long, it **MUST NOT** be assigned to a single visual beat. It must be split at natural phrasing and breathing points into 2 or 3 distinct sub-beats (e.g. 3.5s + 4.2s), each with its own matching visual cut.
- YouTube documentary pacing requires visual changes every 3 to 4 seconds to maintain eye fixation and viewer engagement.

### Rule 2: Zero-Freeze Clip Buffer Requirement (`Clip Duration >= Beat Duration + 1.0s`)
- **Why Videos Freeze for 2 Seconds**: When Remotion's `<OffthreadVideo>` reaches the end of an MP4 file, it stops seeking and **freezes on the last frame** for the remainder of the beat sequence.
- **The Buffer Mandate**: Every video clip prepared in `pool_cfr30` MUST have a duration **greater than the beat duration by at least 1.0 second**:
  $$\text{Clip Duration} \ge \text{Beat Duration} + 1.0\text{s}$$
- If a source clip is only 4.0s but the beat requires 4.8s:
  - FFmpeg must pre-loop or extend the clip (`ffmpeg -stream_loop 1 -i input.mp4 -t 6.0 ...`) so that Remotion **never exhausts frames** and **never freezes for even 1 frame**.

### Rule 3: Whisper Word-Level Semantic Audio Sync
- **No Metaphorical Visuals**: The visual subject must literally depict what is being spoken at that exact moment.
  - *Bad*: Spoken words: *"Her rent was $850 a month, leaving her with $190."* Visual: Dollar General shelves of canned soup (out of sync).
  - *Good*: Spoken words: *"Her rent was $850 a month"* $\rightarrow$ Residential apartment building / eviction notice. Spoken words: *"leaving her with $190"* $\rightarrow$ Cash counting / empty wallet / payroll check.
- **Timestamp Precision**: Use Faster-Whisper word timestamps (`start`, `end`) to cut precisely when the narrator transitions to the next concept.

### Rule 4: Cinematic Transitions & Whoosh Choreography (Every 3–5 Beats)
Documentary pacing demands dynamic rhythm without turning into a chaotic music video. Maintain a balance of clean hard cuts and styled transitions:
- **Pacing Ratio**: **65%–75% Hard Cuts** (`transitionType: "cut"`) / **25%–35% Dynamic Transitions**.
- **Transition-to-Sound Pairing Table**:
  | Transition Type | Visual Style | Paired SFX (`sfxPath`) | Volume | Best Narrative Moment |
  |---|---|---|---|---|
  | **`whip_pan_left` / `whip_pan_right`** | Fast directional camera swipe (0.15s) | `uploads/sfx/whoosh_air.mp3` | `0.16 – 0.20` | Switching locations, moving between subjects, or fast timeline jumps |
  | **`film_burn`** | 35mm warm light leak flare (0.20s) | `uploads/sfx/whoosh_cinematic.mp3` | `0.18 – 0.22` | Shifting into flashbacks, emotional turning points, or sunset vistas |
  | **`shutter_flash`** | White exposure bloom / camera flash (0.08s) | `uploads/sfx/camera_shutter.mp3` | `0.20 – 0.25` | Cutting into newspaper headlines, case dossiers, or photo evidence |
  | **`zoom_punch`** | Snap-zoom scale impact with sub-shockwave (0.18s) | `uploads/sfx/subtle_hit.mp3` | `0.18 – 0.22` | Shocking budget statistics, eviction notices, or critical accusations |
  | **`film_dip_black`** | Smooth cinematic fade through black (0.25s) | *(Silent or low room tone)* | — | Chapter openings, solemn realizations, or dramatic story pauses |
  | **`cut`** | Instant frame cut (0.00s) | *(None)* | — | Baseline documentary standard for continuous dialogue & visual flow |

### Rule 5: Strict Callout-to-Voiceover Grounding (Anti-Hallucination & Verbatim Rule)
> [!WARNING]
> **Never display text in a callout that contradicts or diverges from what the narrator is speaking.**  
> Hallucinated numbers, future plot spoilers, or academic buzzwords confuse the viewer and shatter documentary credibility.

1. **The Verbatim Grounding Mandate**:
   - `callout.line1` and `callout.line2` must extract or quote words, figures, and facts directly present in that exact beat's spoken text.
   - If the beat mentions an exact dollar amount or number, display that exact number:
     - Spoken: *"She earns $314 a week before taxes and about $260 after."*
     - Callout Line 1: `NET WEEKLY PAYROLL: $260.00`
     - Callout Line 2: `$314.00 GROSS PRE-TAX COMPENSATION`
2. **Direct Quotes in Quotation Marks**:
   - When the narration reports someone speaking, enclose the spoken words in quotation marks:
     - Spoken: *"A man at the gas station tells her she will cook alive inside a metal box by July."*
     - Callout Line 1: `RURAL SKEPTICISM`
     - Callout Line 2: `"YOU'LL COOK ALIVE BY JULY"`
   - *(Never hallucinate external stats like "TEMPERATURE EXCEEDS 140°F" if the narrator never said 140°F!)*
3. **Zero Future Spoilers**:
   - Never display technical solutions or future build steps on beats before they are introduced in the narration.
4. **Purposive Callout Density (25% – 35% of Beats)**:
   - Callouts must only appear when a beat introduces a **concrete factual anchor**: an exact price, date, location, official record, measurement, or direct spoken quote.
   - If a beat is purely transitional or reflective, set `"callout": null`. Never force artificial callouts onto empty beats.

### Rule 6: Callout Entrance Audio Accents (Tactile Sound Design)
Every callout entrance should feel physical and tactile, anchored by a subtle audio accent at `callout.startTime`:
| Callout Type | Visual Animation | Paired Entrance SFX (`calloutSfxPath`) | Volume |
|---|---|---|---|
| **`editorial_lower_third`** | Spring slide-in from left with ochre accent bar | `uploads/sfx/paper_slide.mp3` or `whoosh_air.mp3` | `0.12 – 0.15` |
| **`newspaper_headline`** | High-impact print press reveal | `uploads/sfx/camera_shutter.mp3` | `0.18 – 0.22` |
| **`odometer_stat`** | Mechanical number counter spin | `uploads/sfx/stat_click.mp3` | `0.14 – 0.18` |
| **`forensic_data_card` / `redacted_dossier`** | Manila document drop | `uploads/sfx/paper_slide.mp3` | `0.12 – 0.15` |
| **`police_crime_sheet`** | Case binder clamp slam | `uploads/sfx/subtle_hit.mp3` | `0.15 – 0.20` |

---

## 3. The "Anti-YouTube Dump" & Broadcast Cleanliness Mandate

### The Core Problem: Why Raw YouTube Slices Ruin Documentaries
When automated pipelines pull long external YouTube broadcasts (e.g., news interviews, Freethink reports, CNN segments) and chop them into consecutive contiguous slices across chapters, the film no longer feels like an original documentary. Viewers instantly recognize it as a stolen YouTube upload, complete with foreign logos, out-of-sync talking heads, and repetitive camera angles.

### The Golden Rules of Documentary Sourcing:
1. **Never Take Consecutive Slices From the Same Source Video**:
   - Consecutive beats in a scene must **never** come from the same source file.
   - When a slice from a source video is used on Beat $N$, that source video is locked out for a minimum of 4–5 beats (or permanently across the chapter).
2. **Strict Broadcast Cleanliness (Zero Artifact Policy)**:
   - **Zero Watermarks**: No stock agency watermarks (Shutterstock, Getty, iStock, etc.).
   - **Zero Broadcast Logos / Bugs**: No TV or YouTube channel logos (CNN, MSNBC, Fox News, Freethink, BBC, etc.).
   - **Zero Burnt-in Chyrons / Subtitles**: No foreign news lower-thirds, headline tickers, or interview name cards.
   - **Zero Mismatched Talking Heads**: Never show an external person talking with animated lip movements while the documentary narrator is speaking. Talking heads talking over narration creates an uncanny valley effect. Only use silent cinematic B-roll, active listening cutaways, or archival action shots.
3. **Multi-Source Diversity**:
   - Each chapter must blend authentic documentary B-roll, high-resolution archival footage/photos (Archive.org, Library of Congress), and crisp curated stock (Pexels, Pixabay) to create a rich, cinematic visual texture.

---

## 4. Visual, Audio & Callout Verification Protocol: Pre-Render Quality Gates

To guarantee that no bad footage, broken audio, or mismatched callouts slip into the final documentary, Antigravity implements a strict 4-tier pre-render verification gate.

### Tier 1: Automated Video QA Scanners (FFmpeg Filters)
Before rendering any chapter:
1. **Freeze Frame Detection (`freezedetect`)**:
   ```bash
   ffmpeg -i "pool_cfr30/<clip>.mp4" -vf "freezedetect=n=-60dB:d=0.5" -an -f null -
   ```
   **Threshold**: Exactly **0 freeze frames** allowed. Any clip that freezes before its beat ends is automatically rejected.
2. **Black Frame Detection (`blackdetect`)**:
   ```bash
   ffmpeg -i "pool_cfr30/<clip>.mp4" -vf "blackdetect=d=0.3:pix_th=0.10" -an -f null -
   ```
   **Threshold**: Exactly **0 black frames** allowed. Eliminates stock footage opening/closing black fades.
3. **Constant Frame Rate 30.00 fps Verification**:
   Every clip must be encoded with `-r 30 -fps_mode cfr -g 30 -keyint_min 30` to prevent browser compositor micro-stutters.

### Tier 2: Automated Callout Semantic Grounding Audit
Before rendering, run the automated callout verification audit (`python scripts/audit_callout_match.py`):
- Verifies that all numbers in `line1` and `line2` exist in `beat.text`.
- Verifies that key nouns and entities have direct lexical overlap with spoken words.
- Flags and halts rendering if any callout has zero grounding or introduces hallucinated statistics.

### Tier 3: The 50% Timestamp Snapshot Protocol
1. **Automated Snapshot Extraction**:
   For every beat in each chapter timeline, FFmpeg extracts a high-resolution JPEG frame at exactly 50% of the beat's duration:
   ```bash
   ffmpeg -ss <midpoint_seconds> -i <clip_path> -vframes 1 -q:v 2 "uploads/beat_snapshots/ch<XX>/beat_<YY>.jpg"
   ```
2. **In-Session Agent Audit**:
   Antigravity inspects the generated snapshot frames using `read_file` / image inspection.
3. **The 1-Sentence Visual Match Rule**:
   Antigravity must be able to state in **one clear sentence** why the visual directly supports the current spoken sentence.
4. **Immediate Replacement Trigger**:
   If a snapshot reveals a foreign logo, blurry resolution, burnt-in text, or mismatched subject, the clip is swapped with a verified alternative before rendering begins.

### Tier 4: Beat-by-Beat Inspection Sheet
Antigravity generates a human-readable inspection manifest containing:
- Spoken words for the beat.
- Start and end timestamps (verified $\le 5.0$s).
- Video duration (verified $\ge$ beat duration $+ 1.0$s).
- Snapshot image path.
- Transition type and paired whoosh SFX.
- Callout text, style, theme color, and entrance SFX.

---

## 5. Dedicated Project Output Architecture

> [!IMPORTANT]
> **Always render into a dedicated, project-specific directory.**  
> Never dump rendered MP4s into generic root folders or shared directories where files can be overwritten or mixed up.

### Standard Output Directory Structure:
```
output/
  └── <project_name>_rendered/             # Dedicated Project Folder (e.g. steeldoor_rendered)
        ├── chapter_01.mp4                 # Individual rendered chapter 1080p
        ├── chapter_02.mp4
        ├── ...
        ├── chapter_11.mp4
        ├── concat_list.txt                # FFmpeg concat file list
        └── master_documentary_<slug>.mp4  # Stitched full-length master video (1.3GB+, 1080p)
```

---

## 6. Sequential Rendering, Memory Reclamation & Process Isolation

### The Concurrency Pitfall: Why Parallel Rendering Fails
Remotion relies on headless Chromium browser instances via Puppeteer to render React compositions frame-by-frame. Running 2 or more chapters concurrently consumes **8GB–16GB+ of RAM**, causing:
- Chromium browser crashes (`Target closed`, `Out of Memory`)
- Node.js heap exhaustion (`JavaScript heap out of memory`)
- Frame dropping and audio desynchronization

### The Isolated Process Sequential Architecture:
1. **Strictly One Chapter at a Time**:
   All multi-chapter documentaries must render sequentially via an orchestrator script (e.g., `render_steeldoor_sequential.ts`).
2. **Process Isolation (`execSync` / Child Process)**:
   Each chapter render is launched as an isolated child process:
   ```bash
   npx tsx render.ts "uploads/timelines/<ch>_final.json" "output/<project>_rendered/chapter_XX.mp4"
   ```
   Configured with Node memory ceilings:
   ```bash
   NODE_OPTIONS="--max-old-space-size=6144"
   ```
   When the child process exits, **100% of Node.js and Chromium memory buffers are reclaimed by the OS**.
3. **Mandatory Memory Cooldown Delay**:
   A 3-second to 5-second asynchronous pause is enforced between chapters:
   ```typescript
   console.log('⏳ Cooldown 3s for memory reclamation...');
   await new Promise((resolve) => setTimeout(resolve, 3000));
   ```
4. **Idempotent Skip / Resume Logic**:
   Before initiating a chapter render, the script checks if `chapter_XX.mp4` already exists and is valid (`size > 1MB`). If valid:
   ```typescript
   console.log(`⏩ Chapter ${num} already rendered (${sizeMb} MB) — Skipping`);
   ```
   The runner logs the cached video and seamlessly proceeds to the next chapter.

---

## 7. Windows File Locking & `fs.rename` EPERM Self-Healing

On Windows, Remotion renders video frames to a temporary file `<target>.mp4.remotion-in-progress` and moves it via `fs.rename`. Windows file locks cause `EPERM` errors.

### The Two-Tier Solution Implemented in `remotionRenderer.ts`:
1. **Pre-Render Unlink**:
   ```typescript
   if (fs.existsSync(outputVideoPath)) {
     try { fs.unlinkSync(outputVideoPath); } catch {}
   }
   ```
2. **Defensive Catch & Stream-Copy Fallback**:
   If Remotion throws during rename, search the target directory for `.remotion-in-progress` files, copy the file to the destination path using `fs.copyFileSync`, then clean up.

---

## 8. Instant Lossless Master Stitching (FFmpeg Concat)

Because all chapters are rendered with matching composition specifications (1080p, 30.00 fps CFR, H.264 High Profile, AAC stereo 48kHz), FFmpeg's concat demuxer can assemble the entire film losslessly in **seconds** without re-encoding quality loss:

```bash
ffmpeg -y -f concat -safe 0 -i "concat_list.txt" -c copy "master_documentary_<slug>.mp4"
```

---

## 9. Summary Checklist Before Final Video Delivery

1. [ ] **Hard Beat Ceiling Verified**: Every single beat is $\le 5.00$ seconds (target: 2.5s – 4.5s). Zero beats exceed 5.0s.
2. [ ] **Zero Freezing Verified**: Every clip duration is $\ge$ beat duration $+ 1.0$s. No video freezes on the last frame.
3. [ ] **Word-Level Audio Sync**: Visual subject literally matches the spoken words at that exact timestamp.
4. [ ] **Cinematic Transitions & Whooshes**: Every 3 to 5 beats features a styled transition (`whip_pan`, `film_burn`, `shutter_flash`, `zoom_punch`) with an audible whoosh/shutter SFX.
5. [ ] **Callout Verbatim Grounding**: Every callout line1/line2 is 100% derived from the spoken words of that beat. Zero hallucinated stats or future spoilers.
6. [ ] **Callout Sound Design**: Every callout entrance has an audio accent (`paper_slide`, `camera_shutter`, `stat_click`).
7. [ ] **Per-Beat Uniqueness**: Zero repeated clips across the entire documentary (100% unique footage).
8. [ ] **Anti-YouTube Dump Guard**: Zero consecutive slices from the same external video; multi-source diversity across all beats.
9. [ ] **Broadcast Cleanliness**: Zero channel watermarks, zero news bugs, zero burnt-in chyrons/subtitles, zero talking heads with out-of-sync lip movements.
10. [ ] **Automated QA Passed**: `freezedetect` reports 0 freeze frames; `blackdetect` reports 0 black frames; `audit_callout_match.py` reports 0 mismatches.
11. [ ] **Beat Snapshots Audited**: High-res snapshots extracted at 50% timestamp for every beat and audited.
12. [ ] **Constant Frame Rate 30.00 fps**: All clips pre-standardized to CFR 30.00 fps with 1s GOP (`-g 30 -keyint_min 30`).
13. [ ] **Source Audio Muted**: External clip audio muted (`volume: 0`); master voiceover narration audio is the only sound track.
14. [ ] **Isolated Sequential Rendering**: Chapters rendered 1 at a time in child processes with `--max-old-space-size=6144` and 3s cooldowns.
15. [ ] **Lossless Master Stitching**: Final documentary assembled via FFmpeg concat demuxer (`-c copy`) without re-encoding loss.
16. [ ] **Dual Store Synchronized**: Both API store and root store updated with `status: "completed"` and valid video paths for real-time dashboard playback.
