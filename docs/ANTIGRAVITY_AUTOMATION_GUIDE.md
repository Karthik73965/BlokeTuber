# 🎬 Antigravity Documentary Video Automation Guide (100k+ Benchmark Standard)

This guide documents the complete end-to-end production pipeline developed with **Google Antigravity** to research, script, source, curate, screen, pace, cross-check, deduplicate, sequentially render, and losslessly stitch multi-chapter broadcast documentary films in **BlokeTuber** capable of achieving $\ge 100\text{k}$ views on YouTube.

> First-time machine setup: see [`SETUP.md`](../SETUP.md).

---

## ⛔ RULE ZERO: Antigravity-Only, Zero External AI APIs (Overrides Everything Below)

> [!CAUTION]
> **The Antigravity agent is the ONLY intelligence in this pipeline.** Never call OpenRouter, OpenAI, Groq, Gemini API, Anthropic API, Pexels, Pixabay, or any other paid/cloud AI or stock API — not from scripts, not from the API server, not via curl.

1. **Transcription**: local `faster-whisper` only (`apps/api/scripts/local_transcribe.py`, word timestamps). Never cloud STT.
2. **Beat planning, clip matching, callouts, transitions**: written by the Antigravity agent itself directly into the timeline JSON. Never call `planScriptWithAI`, `clipMatcher`, `aiImageGenerator`, `stockFootage` or the `/plan-storyboard` endpoint (they depend on cloud APIs).
3. **Visual screening**: the agent opens the extracted `.jpg` frames itself (50% midpoint snapshot per clip) and judges subject match, talking heads, logos, chyrons. Never send frames to a vision API.
4. **Sourcing**: `yt-dlp` (YouTube search/download) and Archive.org only. Zero stock agencies.
5. If a step seems to need an API, the agent does it by itself (read, look, decide) instead. `apps/api/.env` must contain no AI API keys and `DISABLE_VISION_CHECK=true`.

## 🎯 THE EDITOR'S ONE-LINE REQUEST (Input → Output Contract)

The editor only drops audio and asks. The agent must deliver the finished MP4 with zero manual steps.

- **Input**: `uploads/audio/<project_slug>/` containing chapter voiceovers named `01 - Title.mp3`, `02 - Title.mp3`, … (number = chapter order, text after ` - ` = chapter title).
- **Prompt**: *"Follow docs/ANTIGRAVITY_AUTOMATION_GUIDE.md and make the video for uploads/audio/<project_slug>"*.
- **Agent runs Phases 1–6 (Section 10) end to end without stopping to ask**, keeps `<project_slug>_TRACKER.md` updated, writes all one-off helper scripts to `scratch/<project_slug>/` (gitignored — never the repo root), and writes all frames/snapshots to `uploads/raw/<project_slug>/` (never the repo root).
- **Output**: `output/<project_slug>/master_final.mp4` + `output/<project_slug>/QA_REPORT.md` showing every Section 11 checklist item passed (freezedetect 0, blackdetect 0, 0 duplicate clips, 0 talking heads, 0 logos/chyrons, every beat visually verified).
- **Never deliver** a video where any checklist item fails — fix, re-source, re-render the failing chapter, re-stitch, re-run QA.

---

## 0. The 100k Benchmark Directive (Reverse-Engineered from Top Performers)

> [!IMPORTANT]
> **Data-Driven Performance Standard**:
> Analysis of over 160 competitor documentary releases (e.g. `@BeneaththeBridges` with 476k+ and 337k+ views) and our channel's top hits (`$450 House Scaled Nationwide` - 8.6k views, `Wagon Homes` - 4.0k views) proves that documentary virality depends on **5 non-negotiable production pillars**:

### The 5 Non-Negotiable Pillars:

1. **The 100k Topic & Packaging Formula**:
   - **Winning Concept**: Low-cost, ingenious survival engineering with an exact price and time constraint.
   - *Title Formula*: `What It’s Actually Like Living Inside the $[Price] [Ingenious Mechanism] Built [Time/Condition] for Homeless People`
   - *Top Winners*: `$300 Folding Homes Built in 30 Minutes` (476,000 views), `$300 Thermal Shelters at -40°F` (337,000 views), `$450 Tiny Home Scaled Nationwide` (8,600 views).
   - **Banned**: Depressing abstract disaster lectures (*"When the Power Goes Out"*, *"The Grid Fails"*).

2. **Real Investigative Journalism (Zero Fictional Composites)**:
   - **No Hypothetical Essays**: Strictly forbidden from creating fictional composite characters or vague cities (*"I built this woman from how these nights actually go in the southeast"*).
   - **Real Named Anchors**: Every video must feature a real named person, real named location, and real documented build project (e.g. *Denise in Tacoma, Washington* or *Elvis Summers in Los Angeles*).

3. **The 15-Second Field Audio Soundbite Hook**:
   - **`0:00 - 0:10`**: Must open with a gritty, authentic audio soundbite extracted from actual on-the-ground interview/documentary footage (a resident, volunteer, or city engineer speaking).
   - **`0:10 - 0:35`**: Narrator enters with the concrete human mystery (*"30 minutes. That is how long it took six flat panels to become a locked door for Denise..."*).
   - **`0:35 - 0:42`**: 4–6 seconds of musical swell and pause with zero voiceover to let the viewer absorb the environment.
   - **`0:42 - 1:30`**: Detailed bill of materials and build teardown ($300 vs $2,000 rent).

4. **Scene Continuity Over Hyper-Chopping (6.0s – 12.0s Cuts for Build Mechanics)**:
   - When the script explains the assembly of a wall panel, roof latch, or insulation layer, the footage must stay on the actual physical mechanism for **6.0 to 12.0 seconds**.
   - Rigid 3-second cuts break viewer concentration; sustained scene shots let the viewer see how the structure actually works.

5. **Clean Broadcast Presentation & Burned-In Subtitles**:
   - **Burned-In Subtitle Mandate**: High-contrast, clean centered subtitles (44px Inter bold, subtle dark pill/shadow) MUST be burned into every frame at bottom center (`bottom: 72px`) matching broadcast documentary style (e.g., *Beneath the Bridges*). Over 50% of documentary viewers watch on mobile or low volume; continuous captions are mandatory for retention.
   - **Strictly Banned Gimmicks**: Sci-fi telemetry odometers (`DEVICE BATTERY TELEMETRY 9% REMAINING`), corporate infographic boxes (`LOCATION: SOUTHEAST METROPOLITAN AREA`), artificial forensic data cards, scanline HUDs.

6. **The Machine-Enforced Semantic Vision Gate & Zero-Modulo Ban**:
   - **Zero Modulo / Round-Robin Slicing (`i % len(sources)` IS STRICTLY ILLEGAL)**: B-roll clips must NEVER be assigned using index loops or modulo math over a generic folder. Every single beat requires an explicit, verified source timestamp or on-demand downloaded clip depicting that exact physical action.
   - **Automated Gatekeeper (`verify_screening_manifest.py`)**: Remotion render scripts are hardwired to execute `verify_screening_manifest.py` before rendering. If any beat is unverified, missing, or generic, the build halts with `exit 1`.

7. **Diegetic Room Tone & Natural Foley (Zero Vacuum Audio)**:
   - External B-roll audio must not be blindly silenced to zero if ambient room tone or mechanical Foley is present. Sourced audio should be ducked to -20dB to -24dB beneath the voiceover, preserving the authentic physical atmosphere (cutting foam, tearing tape, gravel footsteps, winter wind).

---

## 0. The Antigravity-First Directive (100% Agent-Operated)

> [!IMPORTANT]
> **Everything is executed directly by Antigravity in-session.**  
> The entire documentary pipeline—from audio ingestion and targeted clip sourcing to in-session visual screening, beat snapshot auditing, sequential isolated Remotion rendering, and FFmpeg master stitching—is autonomously run and verified by the Antigravity agent.

### Core Tenets:
1. **Zero Third-Party Vision / LLM API Fees ($0.00)**:
   - Visual screening of extracted keyframes and beat snapshots is performed directly by Antigravity and chapter subagents using `read_file` on local `.jpg` images. No OpenAI Vision or Claude Vision API keys are required.
   - Script directing and beat subdivision are written directly into structured TypeScript beat definitions, eliminating OpenRouter token limits and `402 Out-of-Credits` failures.
2. **Autonomous Tool & CLI Execution**:
   - Antigravity directly operates `yt-dlp`, FFmpeg, local Whisper transcription, database syncs, Remotion render CLI commands, and FFmpeg concat tools via PowerShell.
3. **Chapter-Level Subagent Parallelization (Phases 1–4)**:
   - Each chapter is assigned a dedicated subagent to complete Ingestion, Sourcing, Design, and Visual Screening concurrently at maximum speed.
   - Phases 5 (Remotion rendering) and 6 (Master stitching) execute strictly sequentially to safeguard system memory and prevent file lock conflicts.
4. **Persistent Project Tracking**:
   - Every video project maintains a dedicated Markdown tracker file (`<project_name>_TRACKER.md`) where subagents record phase completions in real time so Antigravity (`agy`) can audit or resume at any point.
5. **Automated Error Self-Healing**:
   - If a clip fails download, exceeds size limits, trips Windows file locks (`EPERM`), or violates broadcast cleanliness, Antigravity diagnoses the failure, swaps fallbacks, updates manifests, and resumes rendering autonomously.
6. **Hands-Off Experience**:
   - The user provides the narration audio/script and creative direction; Antigravity executes all pipeline stages, audits every beat, and delivers the finished broadcast video into a dedicated directory.

---

## 1. Executive System Architecture

```mermaid
flowchart TD
    AGENT[🤖 Antigravity Orchestrator\nIn-Session Master Agent] --> SUBAGENTS["⚡ Parallel Chapter Subagents\nDedicated Subagent per Chapter"]
    AGENT --> TRACKER["📝 Project Tracker Markdown\noutput/:project_name_rendered/:project_TRACKER.md"]
    SUBAGENTS -->|Update Progress| TRACKER

    subgraph PARALLEL_CHAPTERS["⚡ PARALLEL CHAPTER PIPELINE (Phases 1 - 4 per Chapter Subagent)"]
        subgraph INGESTION["1. Ingestion & Alignment"]
            AUDIO[Voiceover Narration Audio\n.mp3 in uploads/audio/] --> WHISPER[Whisper Word Alignment\nExact Word-Level Timestamps]
            WHISPER --> BEAT_SPLIT[Strict Beat Slicer\nHard Ceiling <= 5.00s per Beat]
        end

        subgraph CURATION["2. Sourcing & Zero-Freeze Buffer\n(Zero Stock: YouTube / Archive.org / Raw Photos Only)"]
            SOURCING[Diverse Source Pool\nTargeted YouTube / Archive.org / Raw Photos] --> SLICE[FFmpeg Pre-Buffered Slicer\nClip Duration >= Beat Duration + 1.0s]
            SLICE --> DIVERSITY[Anti-YouTube Dump Guard\nZero Consecutive Slices]
            DIVERSITY --> CLEANLINESS[Broadcast Cleanliness Filter\nZero Watermarks / Logos / Chyrons / Lips]
        end

        subgraph AUDIO_VISUAL_DESIGN["3. Transitions, Whooshes & Grounded Callouts"]
            TRANSITIONS[Cinematic Transitions & Whooshes\nEvery 3-5 Beats: Whip Pan, Film Burn, Shutter]
            CALLOUTS[Verbatim Grounded Callouts\n100% Sourced from Spoken Words + Entrance SFX\nMandatory Context Callout at Chapter Beat 01]
        end

        subgraph VERIFICATION["4. Visual Screen Testing & QA Gate"]
            CLEANLINESS --> TIMELINE[Timeline Assembly\nchapter_XX_final.json]
            TRANSITIONS --> TIMELINE
            CALLOUTS --> TIMELINE
            TIMELINE --> SNAPSHOTS[50% Beat Snapshot Extraction\nbeat_XX.jpg for 100% of Beats]
            SNAPSHOTS --> QA_AUDIT[Strict Visual Screen Test\nLiteral Voiceover-to-Visual Match + freezedetect]
            QA_AUDIT -->|100% Approved| STAGE[Staged & Verified Chapter Timeline]
        end
    end

    STAGE -->|Subagents Complete Phases 1-4| SEQUENTIAL_FLOW["🔒 Strict Sequential Execution Gate"]
    SEQUENTIAL_FLOW --> SEQUENTIAL_RENDER

    subgraph SEQUENTIAL_RENDER["5. Isolated Sequential Rendering"]
        STAGE --> DEDICATED[Dedicated Project Folder\noutput/:project_name_rendered/]
        DEDICATED --> ISOLATED[Isolated Child Process Render\nnpx tsx render.ts per Chapter (1 at a time)]
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

### Rule 1: Dynamic Dual-Mode Beat Pacing (Sustained Storytelling vs. Rapid Punch)
- **The Failure of Rigid 3-Second Chopping**: Forcing a universal $\le 5.0$s ceiling across an entire 20-minute video creates an exhausting 300+ cut slideshow that prevents viewers from examining physical build details.
- **Enforced Dual-Mode Pacing**:
  1. **Build & Tour Sequences (6.0s – 12.0s)**:
     - Used when explaining how panels connect, how heaters are installed, how windows are sealed, or touring the interior.
     - Allows viewers to see the actual engineering in action. Continuous cinematic drift prevents any freeze flags.
  2. **Narrative Tension & Rapid Context Beats (3.0s – 5.0s)**:
     - Used during the opening hook, rapid financial comparisons, statistical contrasts, or dramatic transitions.
  3. **Absolute Maximum Scene Ceiling: $\le 12.0$ seconds** (Never let a single static camera angle linger beyond 12s).

### Rule 2: Zero-Freeze Clip Buffer Requirement (`Clip Duration >= Beat Duration + 1.0s`)
- **Why Videos Freeze for 2 Seconds**: When Remotion's `<OffthreadVideo>` reaches the end of an MP4 file, it stops seeking and **freezes on the last frame** for the remainder of the beat sequence.
- **The Buffer Mandate**: Every video clip prepared in `pool_cfr30` MUST have a duration **greater than the beat duration by at least 1.0 second**:
  $$\text{Clip Duration} \ge \text{Beat Duration} + 1.0\text{s}$$
- If a source clip is only 4.0s but the beat requires 4.8s:
  - FFmpeg must pre-loop or extend the clip (`ffmpeg -stream_loop 1 -i input.mp4 -t 6.0 ...`) so that Remotion **never exhausts frames** and **never freezes for even 1 frame**.


### Rule 2.1: The Cinematic Drift & Static Frame Freeze Elimination Protocol
> [!IMPORTANT]
> **Static document scans, historical photos, blueprints, and motionless camera shots must never freeze.**  
> In documentary filmmaking, stationary shots (e.g. municipal records, blueprints, static court documents) have <0.3% pixel change. Remotion and FFmpeg's `freezedetect=n=0.003:d=1.5` will flag these as frozen frames even when valid b-roll.
>
> **The Continuous Cinematic Drift Mandate**:
> Whenever an archival photo, document scan, or static tripod shot is sliced, Antigravity MUST apply subtle continuous camera drift/pan to ensure continuous pixel motion:
> ```bash
> ffmpeg -y -i "input.mp4" \
>   -vf "scale=1960:1102:force_original_aspect_ratio=increase,crop=1920:1080:x='min(t*5.0, 38)':y='min(t*2.5, 20)',fps=30" \
>   -fps_mode cfr -c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p \
>   -g 30 -keyint_min 30 -an "output.mp4"
> ```
> - **The Visual Effect**: Creates natural, organic handheld documentary camera motion.
> - **The Technical Guarantee**: Guarantees exactly **0 freeze frames** across the entire documentary timeline under strict `freezedetect=n=0.003:d=1.0` and `d=1.5`.

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

### Rule 5: Clean Subtitle Captions & Journalistic Lower-Thirds (Eliminating Telemetry Spam)
> [!WARNING]
> **Never clutter the screen with artificial sci-fi widgets, fake telemetry monitors, or robotic stat cards.**  
> Top broadcast channels do not use "DEVICE BATTERY TELEMETRY 9%" boxes or forensic HUD meters. Cluttering the screen every 3 beats creates visual fatigue and destroys immersion.

1. **Centered Burned-In Documentary Subtitles**:
   - High-contrast, clean centered subtitles at the bottom center of the screen matching broadcast documentary style (e.g., *Beneath the Bridges*).
   - Word-by-word or phrase-by-phrase timing aligned precisely with Faster-Whisper.
2. **Selective Journalistic Lower-Thirds (High-Impact Only)**:
   - Reserved strictly for introducing:
     - Real people and titles (*"Denise — Resident, Tacoma Micro-Village"* or *"Elvis Summers — Founder, Myth Tiny Homes"*)
     - Real geographic locations (*"Tacoma, Washington — First Baptist Lot"*)
     - Concrete financial teardowns (*"TOTAL UNIT COST: $314.00 — Fully Insulated"*)
   - Frequency: Once per major scene or chapter shift (typically 2 to 4 per chapter), never plastered mechanically every 3 beats.
3. **The Verbatim Grounding Mandate**:
   - Any text displayed in a lower-third must be 100% grounded in real factual data and spoken dialogue. Never hallucinate fictional composite statistics.

### Rule 6: Audio-First Cold Open & Tactile Sound Design
1. **The Field Audio Soundbite Mandate (`0:00 - 0:10`)**:
   - Every video must begin with an authentic raw interview or field audio snippet from the source footage.
   - Example: An organizer or resident describing the warm room, shower trailers, or deadbolt.
2. **Dynamic Breathing Music**:
   - Acoustic guitar, cello, or subtle ambient pulse.
   - Music must **swell and breathe** during emotional pauses (e.g. at second 45 when showing the finished shelter) and duck cleanly (-22dB to -26dB) under spoken voice.
3. **Tactile Sound Accents**:
   - Subtle tactile accents (`paper_slide.mp3`, `subtle_hit.mp3`) paired strictly with real lower-thirds and dramatic narrative turns. Zero arcade whooshes on basic cuts.

### Rule 7: The Absolute Clip Uniqueness Mandate (Mathematical Zero-Duplication)
> [!CAUTION]
> **Reusing clips across chapters or slicing contiguous overlapping windows destroys original documentary value.**  
> A documentary must NEVER show the same shot twice, and must NEVER slice overlapping 2-second windows from the same video.

1. **Zero Binary Duplicates**:
   - Every single beat clip MUST be a completely unique piece of footage. No clip can ever be reused in later chapters (e.g., using Chapter 00 opening B-roll in Chapter 12 is strictly banned).
   - An automated cryptographic hash audit (`audit_clip_uniqueness.py`) must verify that `len(set(clip_hashes)) == len(clips)`.
2. **Zero Contiguous Window Overlaps**:
   - Slicing 7.5s clips every 2.0s or 3.0s from the same source video produces an amateurish stutter where the viewer watches the same continuous shot multiple times with slight offsets.
   - If a source video is sliced at $t = X$, the next slice from that same source video must be separated by at least **$\Delta t \ge 8.0\text{ seconds}$** (or locked out entirely).
3. **The Source Footage Minimum Pool Formula**:
   - Sourcing 2 or 3 YouTube videos for a 20-minute, 280-beat documentary is a structural failure. To guarantee 280 unique non-overlapping beats:
     $$\text{Unique Sourced Footage Required} \ge \text{Total Beats} \times 8.0\text{s} = 280 \times 8.0\text{s} = 2,240\text{ seconds} \approx 37.5\text{ minutes}$$
   - Antigravity must source **at least 15 to 25 diverse video sources** (documentary b-roll, drone scans, construction archives, city hearings, silent news b-roll) to guarantee true diversity.

### Rule 8: Absolute Ban on Talking Heads Over Voiceover
- **The Uncanny Valley Rule**: Never show an external person talking to the camera with animated lip movements while the documentary narrator's voice is playing.
- It breaks viewer immersion, creates dissonance, and makes the film look like an amateur reaction video or low-effort YouTube repost.
- When slicing interview footage, **ONLY slice silent cutaways**:
  - Hands working, typing, or gesturing without showing moving lips
  - Active listening cutaways (eyes, nodded heads, quiet expressions)
  - Wide environment and contextual b-roll
  - If a clip has someone speaking into a microphone, it is **strictly rejected**.

### Rule 9: Broadcast Cleanliness & Chyron Stripping
- **Zero News Chyrons**: No TV broadcast lower-thirds (e.g., "FATAL ENCAMPMENT FIRE", "BREAKING NEWS", "KPIX 5", "ABC7", "FOX2").
- If archival news footage contains a chyron or bug at the bottom:
  - Antigravity must apply an FFmpeg dynamic crop (`-vf "crop=in_w:in_h*0.82:0:0,scale=1920:1080"`) to completely cut out the bottom 18% chyron zone, OR
  - Replace the clip with clean, unbranded documentary B-roll.

### Rule 10: Dynamic Auto-Crop & Zoom-In for Any Logos / Channel Bugs
> [!IMPORTANT]
> **No foreign channel logo, news bug, or chyron may ever appear on screen.**  
> If an authentic archival news or documentary clip contains a corner logo (e.g. KPIX 5, CBS, CNN, ABC7, Fox, Freethink), Antigravity MUST zoom into the clip (1.25x – 1.35x zoom centered or crop-positioned) in such a way that the logo is pushed completely off-screen, or apply a clean bottom/corner crop while re-scaling to 1920x1080 Full HD.
> - **Crop Presets**:
>   - `zoom_128`: Center 1.28x crop (`crop=in_w*0.78:in_h*0.78:(in_w-in_w*0.78)/2:(in_h-in_h*0.78)/2,scale=1920:1080`) — completely removes 4-corner broadcast bugs while retaining core visual center.
>   - `zoom_135`: Deep 1.35x crop (`crop=in_w*0.74:in_h*0.74:(in_w-in_w*0.74)/2:(in_h-in_h*0.74)/2,scale=1920:1080`) — completely removes large lower/upper station bugs and news ticker banners.
>   - `crop_chyron`: Bottom chyron removal (`crop=in_w:in_h*0.78:0:in_h*0.04,scale=1920:1080`) — strips out TV news lower-thirds and headline tickers.

### Rule 11: Strict Zero-Stock Policy (YouTube, Archive.org & Raw Authentic Photos Only)
> [!IMPORTANT]
> **Strictly NO stock agency footage (Zero Pexels, Zero Pixabay, Zero Shutterstock, Zero Getty, Zero generic AI-stock).**  
> Generic stock footage looks sanitized, corporate, and fake, destroying documentary authenticity.
> 
> Sourcing MUST ONLY be drawn from three approved authentic categories:
> 1. **Targeted YouTube Documentary B-Roll** (`yt-dlp`): Field recordings, drone passes, construction timelapses, mechanical work, silent environmental cuts.
> 2. **Archive.org Public Domain Collections**: Historical reels, Prelinger Archives, government footage, educational archives, library reels.
> 3. **Raw Authentic Photographs & Documents**: High-resolution historical stills, court evidence, blueprints, satellite captures, real-world site photos, and scanned public records (animated via subtle Ken Burns pan/zoom).
> 
> **Dynamic On-Demand Sourcing Mandate**:
> - Never settle for a weak or metaphorical clip.
> - If no clip in the existing pool provides an exact, literal match to the spoken voiceover, Antigravity/Subagent **MUST IMMEDIATELY** fetch a targeted YouTube source or Archive.org clip matching that exact sentence before timeline approval.
> - Slices from the same video MUST NOT overlap ($\Delta t \ge 15.0\text{s}$ separation).

### Rule 12: Exact Audio-Visual Synchronization & Voice Customization
- Every single cut must be customized to the voice playing in the background at that exact sub-second interval.
- Each clip must be monitored perfectly and each visual element customized according to the beat voice:
  - When the voiceover speaks about mud stomping $\rightarrow$ bare feet stomping wet mud.
  - When the voiceover speaks about blowtorch fire resistance $\rightarrow$ blowtorch flame blasting cob wall.
  - When the voiceover speaks about eviction bulldozers $\rightarrow$ yellow excavators scraping dirt.
  - When the voiceover speaks about Delia's quiet room $\rightarrow$ calm interior sanctuary without talking lips.
  - When the voiceover speaks about community cooking $\rightarrow$ large pots and kitchen food preparation.
- If a clip has any visual ambiguity, the agent must inspect the 50% midpoint snapshot and verify with certainty before approving it for the timeline.

### Rule 13: Subagent Chapter-Parallel Architecture (Phases 1–4 Fast Parallel, Phases 5–6 Strict Sequential)
> [!IMPORTANT]
> **Parallelize Phases 1 to 4 by Chapter for maximum turnaround speed; strictly serialize Phases 5 and 6 for rock-solid render stability.**
> 
> 1. **Parallel Chapter Subagents (Phases 1 to 4)**:
>    - For each chapter in the documentary, Antigravity spawns an isolated subagent (e.g. `chapter-01-agent`, `chapter-02-agent`, etc.).
>    - Each subagent operates independently and simultaneously across:
>      - **Phase 1**: Ingestion & Whisper word-level timestamp alignment (beat ceiling $\le 5.0$s).
>      - **Phase 2**: Sourcing exclusively from YouTube, Archive.org, or raw photos (zero stock), pre-buffered clip slicing ($\ge$ beat duration $+ 1.0$s), and CFR 30fps standardization.
>      - **Phase 3**: Transition selection, whoosh SFX pairing, mandatory chapter-opening callout on Beat 01, and verbatim factual callout design.
>      - **Phase 4**: 100% beat visual screen testing against voiceover and FFmpeg QA (`freezedetect`, `blackdetect`).
>    - Subagents update progress directly into the project's dedicated Markdown tracker (`<project_name>_TRACKER.md`).
> 2. **Strict Sequential Execution Gate (Phases 5 & 6)**:
>    - Remotion child-process rendering (**Phase 5**) and FFmpeg master concatenation (**Phase 6**) **MUST NEVER RUN IN PARALLEL**.
>    - Running concurrent Remotion browser engines crashes Chromium and exhausts OS memory.
>    - Antigravity renders chapters sequentially (one chapter at a time) with a 3–5s cooldown, then immediately executes Phase 6 lossless master concatenation.

---

## 3. The "Anti-YouTube Dump" & Zero Stock Agency Mandate

### The Core Problem: Why Raw YouTube Slices Ruin Documentaries
When automated pipelines pull long external YouTube broadcasts (e.g., news interviews, Freethink reports, CNN segments) and chop them into consecutive contiguous slices across chapters, the film no longer feels like an original documentary. Viewers instantly recognize it as a stolen YouTube upload, complete with foreign logos, out-of-sync talking heads, and repetitive camera angles.

### The Golden Rules of Documentary Sourcing:
1. **Never Take Consecutive Slices From the Same Source Video**:
   - Consecutive beats in a scene must **never** come from the same source file.
   - When a slice from a source video is used on Beat $N$, that source video is locked out for a minimum of 4–5 beats (or permanently across the chapter).
2. **Strict Broadcast Cleanliness (Zero Artifact Policy)**:
   - **Zero Stock Agency Watermarks**: No Shutterstock, Getty, iStock, Pexels, or Pixabay artifacts.
   - **Zero Broadcast Logos / Bugs**: No TV or YouTube channel logos (CNN, MSNBC, Fox News, Freethink, BBC, etc.). All corner logos zoomed out of frame via `zoom_128` or `zoom_135`.
   - **Zero Burnt-in Chyrons / Subtitles**: No foreign news lower-thirds, headline tickers, or interview name cards.
   - **Zero Mismatched Talking Heads**: Never show an external person talking with animated lip movements while the documentary narrator is speaking. Talking heads talking over narration creates an uncanny valley effect. Only use silent cinematic B-roll, active listening cutaways, or archival action shots.
3. **Multi-Source Diversity (Zero Stock Agencies)**:
   - Each chapter must blend authentic documentary YouTube B-roll, high-resolution archival footage/films (Archive.org), and raw authentic archival photos/documents to create a rich, cinematic visual texture. Generic stock platforms (Pexels, Pixabay) are strictly banned.

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

### Tier 3: Strict 100% Beat Visual Screen Testing Protocol (Voice-to-Visual Correspondence)
> [!IMPORTANT]
> **Every single beat across every chapter MUST pass an individual visual screen test.**  
> As each chapter is divided into beats, no beat may be staged or rendered without verified visual correspondence to its spoken narration.

1. **50% Midpoint Snapshot Extraction**:
   For every beat in each chapter timeline, FFmpeg extracts a high-resolution JPEG frame at exactly 50% of the beat's duration:
   ```bash
   ffmpeg -ss <midpoint_seconds> -i <clip_path> -vframes 1 -q:v 2 "uploads/beat_snapshots/ch<XX>/beat_<YY>.jpg"
   ```
2. **In-Session Agent & Subagent Visual Inspection**:
   The chapter subagent (or Antigravity orchestrator) reads and visually inspects the snapshot image (`beat_<YY>.jpg`) using `read_file`.
3. **The Voice-to-Visual Screen Test Criteria**:
   - **Direct Semantic Correspondence**: The visual frame must literally depict what the narrator is speaking at that sub-second interval (e.g. spoken eviction hearing $\rightarrow$ courtroom / gavel / legal paper; spoken cob house building $\rightarrow$ mixing straw and clay).
   - **Zero Moving Lips / Talking Heads**: If an external person is visible speaking to the camera or into a mic while narrator voiceover plays, the clip is **FAILED** immediately.
   - **Zero Logos / Bugs / News Chyrons**: The frame must be clean and unbranded. If an archival bug is present, an auto-crop/zoom (`zoom_128`, `zoom_135`) must be applied or the clip replaced.
   - **Zero Metaphorical Ambiguity**: Abstract or unrelated stock-like scenes are strictly rejected.
4. **1-Sentence Verification & Immediate Replacement Trigger**:
   The agent records a 1-sentence validation explaining why the visual accurately matches the spoken text. If any beat fails this test, the subagent **IMMEDIATELY** fetches a targeted replacement from YouTube or Archive.org, extracts a new snapshot, and re-tests until 100% compliance is achieved.

### Tier 4: Automated Machine-Enforced Semantic Vision Gate (`verify_screening_manifest.py`)

> [!CAUTION]
> **No Video May Render Without a 100% Validated Semantic Manifest.**  
> Modulo clip assignments (`i % len(...)`) and blind duration-only audits are **strictly illegal**. Before Remotion renders a single frame, the automated gate script MUST execute:
> ```bash
> python scripts/verify_screening_manifest.py uploads/timelines/<project_slug> uploads/screening_manifests/<project_slug>
> ```
> 
> If any beat fails ANY of the 6 criteria below, the script exits with code `1` and **aborts the render immediately**:
> 1. **Zero Modulo Assignments**: Every beat must have an explicit source link; repeating consecutive sources $> 2$ times is blocked.
> 2. **File Existence & Buffer Guarantee**: Clip exists on disk and actual duration $\ge \text{beat.duration} + 1.5\text{s}$.
> 3. **50% Midpoint Snapshot**: Snapshot JPEG exists and is visually non-black.
> 4. **Verified Semantic Match**: `semanticMatch: true` with a detailed physical description ($\ge 15$ characters) explaining what is physically shown.
> 5. **Zero Talking Heads Over Voiceover**: No moving lips or faces speaking to camera during narrator speech.
> 6. **Zero Watermarks / Chyrons**: No TV bugs, news tickers, or stock agency logos.

#### Canonical Manifest JSON Specification (`uploads/screening_manifests/<project>/ch<XX>_manifest.json`):
```json
{
  "chapterIndex": 1,
  "chapterNumber": "01",
  "chapterTitle": "The 45-Minute Miracle",
  "totalBeats": 12,
  "auditTimestamp": "2026-11-21T09:40:00Z",
  "auditStatus": "PASSED",
  "beats": [
    {
      "beatIndex": 0,
      "spokenText": "Forty-five minutes. That is how long it took four volunteers with utility knives...",
      "duration": 6.4,
      "clipPath": "uploads/raw/proj_hex_huts/pool_cfr30/ch01_b00.mp4",
      "sourceOriginFile": "uploads/raw/proj_hex_huts/sources/src_hexayurt_assembly_e7vaYcbkYG0.mp4",
      "sourceStart": 15.0,
      "snapshotPath": "uploads/beat_snapshots/proj_hex_huts/snap_ch01_b00.jpg",
      "visualDescription": "High angle wide shot of four volunteers kneeling on gravel cutting silver foam panels with utility knives.",
      "semanticMatch": true,
      "relevanceScore": 10,
      "cleanliness": {
        "talkingHead": false,
        "burnedInChyron": false,
        "stockWatermark": false
      }
    }
  ]
}
```

---

## 5. Persistent Per-Video Project Tracker (`<project_name>_TRACKER.md`)

> [!IMPORTANT]
> **Every video project MUST maintain a dedicated Markdown tracker file.**  
> File location: `output/<project_name>_rendered/<project_name>_TRACKER.md` (and mirrored in `docs/projects/<project_name>_TRACKER.md`).
> 
> This allows Antigravity (`agy`) and the user to check the status of any video across turns or sessions, audit phase completions, verify chapter subagent logs, and seamlessly resume unfinished stages.

### Standard Tracker Markdown Specification:
```markdown
# 🎬 Project Tracker: <Project Title> (<project_slug>)

- **Audio Master**: `uploads/audio/<project_audio>.mp3`
- **Total Chapters**: `NN`
- **Status**: In Progress / Completed
- **Dedicated Output Directory**: `output/<project_slug>_rendered/`

---

## Pipeline Phase Status
- [ ] **Phase 1: Ingestion & Beat Alignment** (Whisper word-level timestamps <= 5.0s ceiling)
- [ ] **Phase 2: Source Curation & Buffering** (Zero stock; YouTube / Archive.org / Raw Photos only; duration >= beat + 1.0s)
- [ ] **Phase 3: Visual & Audio Design** (Transitions, whooshes, verbatim callouts + Beat 01 chapter-opening callout)
- [ ] **Phase 4: Visual Screen Testing & QA** (100% beat snapshots audited against voiceover; freezedetect = 0)
- [ ] **Phase 5: Isolated Sequential Remotion Rendering** (1 chapter at a time; 3s cooldown)
- [ ] **Phase 6: Lossless Master Stitching & Store Sync** (FFmpeg concat demuxer -c copy)

---

## Chapter Subagent Progress Matrix (Phases 1 - 4 Parallel)

| Chapter | Subagent ID | Phase 1 (Align) | Phase 2 (Source) | Phase 3 (Design) | Phase 4 (Visual Screen) | Phase 5 (Render) | Phase 6 (Concat) | Status |
|---|---|---|---|---|---|---|---|---|
| Chapter 01 | `subagent-ch01` | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete (100% Pass) | ⏳ Pending | ⏳ Pending | Ready for Render |
| Chapter 02 | `subagent-ch02` | ✅ Complete | ✅ Complete | ✅ Complete | ✅ Complete (100% Pass) | ⏳ Pending | ⏳ Pending | Ready for Render |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

---

## Chapter Visual Screening Audit Log (Sample)

| Ch | Beat | Time | Spoken Narration | Visual Asset & 50% Snapshot | Visual Match Validation | QA Status |
|---|---|---|---|---|---|---|
| 01 | 01 | 0.0s - 3.2s | "In the winter of 2021, the eviction notice arrived." | `beat_01.jpg` (Courthouse legal notice stapled to wooden door) | Literal match to eviction notice arrival; 0 logos; 0 lips | ✅ PASS |
| 01 | 02 | 3.2s - 6.8s | "Delia was given seventy-two hours to vacate." | `beat_02.jpg` (Hand packing cardboard box inside bedroom) | Depicts packing under eviction deadline; authentic b-roll | ✅ PASS |

---

## Output Master Artifacts
- **Chapter Renders**: `output/<project_slug>_rendered/chapter_01.mp4 ... chapter_NN.mp4`
- **Concat Manifest**: `output/<project_slug>_rendered/concat_list.txt`
- **Master Video**: `output/<project_slug>_rendered/master_documentary_<project_slug>.mp4`
```

---

## 6. Dedicated Project Output Architecture

> [!IMPORTANT]
> **Always render into a dedicated, project-specific directory.**  
> Never dump rendered MP4s into generic root folders or shared directories where files can be overwritten or mixed up.

### Standard Output Directory Structure:
```
output/
  └── <project_name>_rendered/             # Dedicated Project Folder (e.g. steeldoor_rendered)
        ├── <project_name>_TRACKER.md      # Per-Video Markdown Progress & Audit Tracker
        ├── chapter_01.mp4                 # Individual rendered chapter 1080p
        ├── chapter_02.mp4
        ├── ...
        ├── chapter_11.mp4
        ├── concat_list.txt                # FFmpeg concat file list
        └── master_documentary_<slug>.mp4  # Stitched full-length master video (1.3GB+, 1080p)
```

---

## 7. Sequential Rendering, Memory Reclamation & Process Isolation

> [!IMPORTANT]
> **Phases 1 to 4 run in parallel across chapter subagents; Phase 5 and Phase 6 MUST run sequentially.**

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

## 8. Windows File Locking & `fs.rename` EPERM Self-Healing

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

## 9. Instant Lossless Master Stitching (FFmpeg Concat)

Because all chapters are rendered with matching composition specifications (1080p, 30.00 fps CFR, H.264 High Profile, AAC stereo 48kHz), FFmpeg's concat demuxer can assemble the entire film losslessly in **seconds** without re-encoding quality loss:

```bash
ffmpeg -y -f concat -safe 0 -i "concat_list.txt" -c copy "master_documentary_<slug>.mp4"
```

---


---

## 10. Operational Step-by-Step Production Guide (Phases 1 through 6)

This is the standard execution blueprint developed and certified during the production of multi-chapter documentary films (e.g. *American Hideaways: 187*). Follow this exact sequence for every new video project.

### Phase 1: Master Audio Ingestion & Beat Alignment
1. **Audio Standardization**:
   - Collect raw voiceover audio files for all chapters.
   - Convert to standardized broadcast audio: 48kHz stereo 320kbps MP3 stored in `uploads/audio/<project_slug>/`.
2. **Faster-Whisper Word-Level Timestamping**:
   - Transcribe each chapter with word-level timestamps (`start`, `end`).
3. **Strict Beat Subdivision**:
   - Segment the script into visual beats adhering strictly to the **$\le 5.00$s Hard Ceiling** (target 2.5s–4.5s).
   - Never let a beat drag past 5.5s; split long sentences at natural breathing points and punctuation marks.
   - Output structured transcripts to `uploads/transcripts/<project_slug>/`.

### Phase 2: Authentic Source Sourcing & Standardization
1. **Strict Zero-Stock Policy**:
   - 0% Pexels, 0% Pixabay, 0% generic stock b-roll.
   - Sourcing strictly from:
     - Targeted YouTube field builds, drone passes, and workshops via `yt-dlp`.
     - Archive.org historical reels, Prelinger Archives, and government records.
     - Raw authentic photographs, blueprints, court documents, and dossiers.
2. **The Source Diversity Formula**:
   - Source at least 15 to 30 diverse long-form videos to guarantee non-overlapping slices ($\Delta t \ge 8.0$s separation).
3. **Clip Standardization & Buffer**:
   - Ensure every slice duration satisfies: $	ext{Duration} \ge 	ext{Beat Duration} + 1.0$s.
   - Encode to 1080p CFR 30.00 fps with 1-second GOP (`-g 30 -keyint_min 30`).
   - Strip all external audio tracks strictly (`-an`) so no background noise bleeds into narration.
   - Output normalized clips to `uploads/raw/<project_slug>/pool_cfr30/`.

### Phase 3: Visual & Audio Design (Callout Density & Score)
1. **High-Frequency Rhythmic Callouts (~1 Callout Every 3 Beats)**:
   - Target callout density: ~35%–40% across the film.
   - Inject concrete factual anchors: prices, wages, dimensions, dates, material specs, locations, building codes, and direct quotes.
2. **Mandatory Beat 0 Chapter-Opening Context Callout**:
   - Every chapter MUST feature an impactful context callout at Beat 0 / Beat Index 0 (anchor quote, date, location, or thesis).
3. **Verbatim Grounding & Anti-Hallucination**:
   - All text in `line1` and `line2` must be derived 100% from the spoken words of that exact beat. Enclose spoken dialogue in quotation marks.
4. **Tactile Sound Design & Score Hierarchy**:
   - Dialogue narration set to 0.0dB peak.
   - Atmospheric piano/cello score ducked to -22dB (volume 0.08).
   - Paired tactile entrance sound effects (`paper_slide.mp3`, `whoosh_air.mp3`, `camera_shutter.mp3`, `stat_click.mp3`) at 0.12–0.15 volume.
   - Assemble final timeline JSON files into `uploads/timelines/<project_slug>/ch<XX>_final.json`.

### Phase 4: Parallel Subagent Visual Screen Testing & Static Drift Elimination
1. **Spawn Dedicated Chapter Subagents**:
   - Spawn isolated subagents (e.g. `subagent-ch01` through `subagent-ch10`) to audit each chapter in parallel.
2. **Extract Temporal Midpoint Snapshots**:
   - FFmpeg extracts JPEG snapshots at 50% midpoint (`beat_XX.jpg`) for 100% of beats.
3. **Visual-to-Voice Screen Test Criteria**:
   - Inspect snapshot image via `read_file` against spoken voiceover.
   - Strictly reject talking heads, moving lips, foreign logos, TV chyrons, and metaphorical filler.
   - Immediately remediate any mismatch by fetching a targeted YouTube/Archive.org replacement and re-slicing.
4. **Cinematic Drift Pass for Static Frames**:
   - For any static document scans or motionless tripod shots, apply subtle cinematic drift (`scale=1960:1102...`) to eliminate `freezedetect` flags.
5. **Pre-Render Technical Certification**:
   - Run audit scripts to verify:
     - 100% unique SHA-256 clip hashes (zero binary duplicates).
     - 0 freeze frames via `freezedetect=n=0.003:d=1.0`.
     - 0 black frames via `blackdetect`.
     - All 283 clips stripped of audio (`-an`).

### Phase 5: Sequential Remotion Child-Process Rendering
1. **Strict Sequential Execution Gate**:
   - Remotion rendering MUST run one chapter at a time to prevent RAM overload and Chromium crashes.
2. **Isolated Child Processes**:
   - Execute via sequential runner (`npx tsx apps/api/scripts/render_<project>_sequential.ts`).
   - Launch each chapter in an isolated process with `NODE_OPTIONS="--max-old-space-size=6144"`.
   - On completion, 100% of Chromium and Node memory buffers are reclaimed.
   - Enforce a 3-second memory cooldown between chapters.
3. **Idempotent Skip / Resume**:
   - If `chapter_XX.mp4` already exists with size > 1MB, skip and proceed to next chapter.
   - Save rendered chapters to dedicated directory `output/<project_slug>_rendered/chapter_XX.mp4`.

### Phase 6: Lossless Master Assembly & Whole-Film Freeze QA
1. **Master Concat List**:
   - Generate `output/<project_slug>_rendered/concat_list.txt` referencing all rendered chapters.
2. **Lossless Stream Copy Stitching**:
   - Stitch chapters in seconds using FFmpeg concat demuxer without re-encoding quality loss:
     ```bash
     ffmpeg -y -f concat -safe 0 -i concat_list.txt -c copy -movflags +faststart master_documentary_<project>.mp4
     ```
3. **Whole-Film Freeze QA Audit**:
   - Run full-stream freeze detection across the entire master film:
     ```bash
     ffmpeg -i master_documentary_<project>.mp4 -vf "freezedetect=n=0.003:d=1.5" -f null -
     ```
   - Must achieve **0 freeze frames** across the entire 20+ minute film.
4. **Update Project Tracker & Synchronize Stores**:
   - Update `output/<project_slug>_rendered/<project_slug>_TRACKER.md` with final file sizes, durations, and QA certifications.
   - Synchronize API and root database stores to enable instant web playback.


## 11. Summary Checklist Before Final Video Delivery

1. [ ] **Per-Video Markdown Tracker Active**: `<project_name>_TRACKER.md` initialized and updated by subagents across all phases.
2. [ ] **Hard Beat Ceiling Verified**: Every single beat is $\le 5.00$ seconds (target: 2.5s – 4.5s). Zero beats exceed 5.0s.
3. [ ] **Zero Freezing Verified**: Every clip duration is $\ge$ beat duration $+ 1.0$s. No video freezes on the last frame.
4. [ ] **Strict Zero-Stock Policy**: 100% of footage sourced from YouTube (`yt-dlp`), Archive.org, or authentic raw photos/documents. Zero Pexels, zero Pixabay, zero stock agency watermarks.
5. [ ] **Word-Level Audio Sync & Visual Screen Test**: 100% of beats audited via 50% midpoint snapshots (`beat_XX.jpg`) with verified literal semantic correspondence to spoken audio.
6. [ ] **Mandatory Chapter-Opening & High-Density Callouts**: Beat 01 of every single chapter features a prominent contextual callout paired with entrance SFX, and informative callouts appear every ~3 beats throughout the film.
7. [ ] **Cinematic Transitions & Whooshes**: Every 3 to 5 beats features a styled transition (`whip_pan`, `film_burn`, `shutter_flash`, `zoom_punch`) with an audible whoosh/shutter SFX.
8. [ ] **Callout Verbatim Grounding**: Every callout line1/line2 is 100% derived from the spoken words of that beat. Zero hallucinated stats or future spoilers.
9. [ ] **Callout Sound Design**: Every callout entrance has a tactile audio accent (`paper_slide`, `camera_shutter`, `stat_click`).
10. [ ] **Per-Beat Uniqueness**: Zero repeated clips across the entire documentary (100% unique footage, zero identical binary files, zero overlapping window intervals).
11. [ ] **Anti-YouTube Dump Guard**: Zero consecutive slices from the same external video; multi-source diversity across all beats (minimum 15–25 distinct source videos).
12. [ ] **Broadcast Cleanliness & Logo Zoom-In**: Zero channel watermarks, zero news bugs, zero burnt-in chyrons/subtitles; all corner bugs/chyrons zoomed in or cropped out.
13. [ ] **Zero Lip-Sync Clash**: Zero talking heads speaking into microphones while the narrator is talking; only silent action B-roll, hands working, wide shots, and cutaways.
14. [ ] **Automated QA Passed**: `freezedetect` reports 0 freeze frames; `blackdetect` reports 0 black frames; `audit_callout_match.py` reports 0 mismatches; `audit_clip_uniqueness.py` reports 0 duplicates.
15. [ ] **Constant Frame Rate 30.00 fps**: All clips pre-standardized to CFR 30.00 fps with 1s GOP (`-g 30 -keyint_min 30`).
16. [ ] **Diegetic Room Tone & Natural Foley Layered**: Real environmental sound / mechanical Foley ducked to -20dB to -24dB underneath the master voiceover; master voiceover normalized to -23 LUFS; ducked score at -22dB.
17. [ ] **Burned-In Subtitles on 100% of Beats**: Clean, bold centered broadcast subtitles burned into every frame via Remotion (`DocumentaryVideo.tsx`).
18. [ ] **Pre-Render Semantic Vision Gate Passed**: `verify_screening_manifest.py` executed and returned exit code `0` (100% of beats semantically verified, zero modulo loops, zero consecutive repeats).
19. [ ] **Parallel Subagents (Phases 1–4)**: Chapters processed concurrently by dedicated subagents for high velocity.
20. [ ] **Isolated Sequential Rendering (Phase 5)**: Chapters rendered 1 at a time in child processes with `--max-old-space-size=6144` and 3s cooldowns.
21. [ ] **Lossless Master Stitching (Phase 6)**: Final documentary assembled via FFmpeg concat demuxer (`-c copy`) without re-encoding loss.
22. [ ] **Dual Store Synchronized**: Both API store and root store updated with `status: "completed"` and valid video paths for real-time dashboard playback.

---

## 12. The Professional Video Editor Handoff Protocol & Storyboard Workflow

When handing off BlokeTuber to a video editor or teammate, follow this strict 4-step workflow to guarantee broadcast perfection with zero broken renders:

### Step 1: Editor Storyboard Review in Web UI
1. The editor opens the local dashboard at `http://localhost:3000`.
2. Navigate to `Projects` $\rightarrow$ Select Project $\rightarrow$ Open Chapter Storyboard.
3. Every beat is displayed as an interactive card showing:
   - **Spoken Voiceover Text** & exact start/end timestamps.
   - **50% Midpoint Snapshot Frame** (`beat_XX.jpg`).
   - **Assigned Clip Name** & Source Origin URL.
   - **Semantic Validation Status**: Green badge (`MATCH VERIFIED`) or Red flag (`NEEDS REPLACEMENT`).

### Step 2: One-Click Clip Swapping & On-Demand Sourcing
If the editor spots a clip that looks generic, repetitive, or unaligned:
1. Click **"🔄 Swap Clip"** on that beat card.
2. The editor can choose:
   - **Option A (Targeted YouTube Search)**: Enter a precise action query (e.g. *"hexayurt door hinge tape installation"*). The system downloads the video via `yt-dlp`, slices the segment, extracts the snapshot, and updates the timeline instantly.
   - **Option B (Local B-Roll)**: Pick a replacement clip from the local project pool or upload fresh footage.
3. The beat card immediately updates with the new 50% midpoint snapshot for visual confirmation.

### Step 3: Run the Pre-Render Gatekeeper
Before triggering any render, run:
```bash
python scripts/verify_screening_manifest.py uploads/timelines/<project_slug> uploads/screening_manifests/<project_slug>
```
- If any beat has unverified B-roll, buffer underflow, or modulo loop repetition, the command fails with a clear list of beats requiring editor attention.
- When 100% of beats pass, the gate displays: `🏆 GATE PASSED: 100% OF BEATS SEMANTICALLY VERIFIED FOR BROADCAST RENDER!`

### Step 4: One-Click Master Sequential Render
Once the gate passes, run the sequential renderer:
```bash
npx tsx apps/api/scripts/render_<project_slug>_sequential.ts
```
The renderer executes child processes sequentially, burns in broadcast subtitles, blends ducked music and diegetic Foley, and outputs `master_documentary_<project_slug>.mp4` ready for YouTube upload.
