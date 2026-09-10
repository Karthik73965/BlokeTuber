# Documentary Footage Pacing & Visual Assembly Rules

This document defines the strict editorial and visual pacing standards for documentary video generation across all projects in BlokeTuber. All timeline builders, AI planners, and footage sourcing pipelines must strictly adhere to these rules.

---

## 1. Local B-Roll Frequency & Spacing (The 4-Beat Rule)

Authentic local raw clips (e.g. interviews, site visits, real subject photos) are the highest-value storytelling assets, but clustering them too densely causes visual repetition and depletes documentary momentum.

### The 4-Beat Cooldown Rule:
- **Mandatory Buffer**: When a local raw clip appears on **Beat $N$**, the next **4 beats ($N+1, N+2, N+3, N+4$) MUST be stock footage or stock photography**.
- **Next Permitted Local Beat**: A local raw clip may appear at earliest on **Beat $N+5$**.
- **Maximum Local Density**: In any sequence of 5 consecutive beats, there can be **at most 1 local clip**.

```
Beat N   : [LOCAL RAW CLIP]
Beat N+1 : [STOCK FOOTAGE / PHOTO]
Beat N+2 : [STOCK FOOTAGE / PHOTO]
Beat N+3 : [STOCK FOOTAGE / PHOTO]
Beat N+4 : [STOCK FOOTAGE / PHOTO]
Beat N+5 : [LOCAL RAW CLIP ALLOWED]
```

### No Cascading Local Fallbacks:
- If a stock search returns no results, the system **MUST NOT** fall back to another local raw clip if that would violate the 4-beat cooldown.
- Instead, the system must generalize the stock search to broader category terms (e.g., searching `urban street evening` instead of `eugene oregon street`, or `carpentry tools` instead of `conestoga hut build`).

---

## 2. Strict Beat Duration Constraints (3.0s – 6.0s)

- **Hard Floor**: Every beat MUST be $\ge 3.0\text{s}$ (minimum ~8 spoken words). Micro-cuts under 3 seconds cause visual whiplash and audio mismatch.
- **Hard Ceiling**: Every beat MUST be $\le 6.0\text{s}$ (maximum ~16 spoken words). Shots longer than 6 seconds drag down viewer retention.
- **Merge Short Cuts**: Any sentence or clause shorter than 3.0 seconds must be automatically merged into its neighbor.
- **Subdivide Long Beats**: Any narration stretch exceeding 6.0 seconds must be split into balanced $3.0\text{s}$–$5.5\text{s}$ sub-beats with distinct visual focus.

---

## 3. Motion Graphic Layout Balance (50/50 Alternation)

- **Layout Variety**: Alternate ~50/50 between clean full-bleed cinematic b-roll and rich stylized motion design layouts:
  - `split_dual_screen` (comparisons, before/after, subject vs location)
  - `forensic_drafting_table` (blueprints, technical diagrams, site maps)
  - `ambient_blur_frame` (human portraits, intimate moments)
  - `open_case_binder` / `editorial_sidebar_column` (official records, ordinances, paperwork)
  - `desktop_corkboard` / `hero_graphic_centerpiece` (investigative evidence)
- **Scene-Specific Metadata**: Stylized layouts must contain contextual titles, timestamps, and locations matching the spoken narration.

---

## 4. Animation Dynamics & Easing

- **Ken Burns Scale**: Subtle 4% zoom over beat duration (never jerky 12%+ snaps).
- **Spring Physics**: Smooth damping (`damping: 24, stiffness: 55, mass: 1.2`) for graphic card entrances/exits.
- **Transitions**: 0.35s–0.45s broadcast fades, shutter flashes, or whip pans (no rapid 0.06s strobe flashes).

---

## 5. Summary Checklist Before Final Video Rendering

1. [ ] Check that every local clip has $\ge 4$ stock beats separating it from any other local clip.
2. [ ] Check that minimum beat duration across entire timeline is $\ge 3.0\text{s}$.
3. [ ] Check that maximum beat duration across entire timeline is $\le 6.0\text{s}$.
4. [ ] Check that all referenced video and photo files exist on disk and have valid dimensions.
5. [ ] Verify word-level synchronization against local Whisper transcript.
