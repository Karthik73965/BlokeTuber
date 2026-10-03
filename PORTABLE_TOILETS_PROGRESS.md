# Portable Toilets / Jose Fuentes Video - Antigravity Handoff

Last updated: 2026-09-23

## Project Identity

- Project name: `Portable Toilets`
- Project ID: `proj_1790101325660`
- Dashboard URL: `http://localhost:3000/project/proj_1790101325660`
- Audio source folder: `C:\Users\karth\Videos\AmericanHideaways\portable toilets\AUD`
- Raw media pool folder: `C:\Users\karth\Documents\BlokeTuber\uploads\raw\proj_1790101325660`
- Raw media manifest: `C:\Users\karth\Documents\BlokeTuber\uploads\raw\proj_1790101325660\manifest.json`
- Transcript folder: `C:\Users\karth\Documents\BlokeTuber\uploads\transcripts\portable-toilets`

## What Has Been Done

1. Created the BlokeTuber project `Portable Toilets`.
2. Found 11 chapter audio files in the provided `AUD` folder.
3. Transcribed all 11 audio files locally with Whisper / faster-whisper.
4. Created 11 chapter records in the project.
5. Copied/cached transcript `.txt` and `.json` files.
6. Downloaded the 2 user-provided YouTube raw sources.
7. Sourced additional YouTube footage around the actual narration.
8. Sliced source videos into short raw clips.
9. Extracted 2 preview screenshots per clip.
10. Repaired the manifest after an early overwrite issue, so all sliced clips are tracked.
11. Removed 2 incomplete `.part` fragments from failed YouTube `403 Forbidden` downloads.

## Current Counts

- Chapters: `11`
- Tracked source videos in manifest: `20`
- Raw sliced clips in manifest: `599`
- Preview screenshots: `1198`
- Clip screening status: all `599` clips are currently `pending`
- Raw `.mp4` files in raw folder: `619`
  - This includes `20` source videos plus `599` sliced clips.
- Transcript files in transcript folder: `23`
  - 11 `.txt`
  - 11 `.json`
  - 1 full master script

## Chapter List

1. `Chapter 01: Cold Open`
2. `Chapter 02: The Gardener With No Garden`
3. `Chapter 03: Who Ages Out Onto A Hillside`
4. `Chapter 04: The Neighbors Who Chose Him`
5. `Chapter 05: The Other Side Of The Same Corridor`
6. `Chapter 06: Viral, And What Virality Actually Bought Him`
7. `Chapter 07: Caltrans, And The Agency That Wasn't There`
8. `Chapter 08: What Gets Taken Down`
9. `Chapter 09: The Tour`
10. `Chapter 10: The Wider Order Closing In`
11. `Chapter 11: Closing`

## Important Story Context

The audio is mainly about Jose Fuentes / Pacoima / a hillside homeless encampment / freeway visibility / Caltrans and city removal pressure.

The title/project folder says "portable toilets", and the user provided two portable-toilet tiny-home YouTube links, but the narration is broader and more specific:

- Jose Fuentes
- Pacoima
- Glenoaks / freeway hillside
- hand-built hillside estate / shelter / garden
- homelessness and housing insecurity
- neighbors and local reaction
- virality
- Caltrans / removals / cleanup pressure
- what gets taken down
- wider public-order systems

Do not treat this as a generic portable-toilet video. The final visuals must follow the narration beat by beat.

## User-Provided Raw Sources

These were downloaded and sliced:

- `https://youtu.be/1mBedOE9cCc?si=VUIChzZhbHvRAoVF`
- `https://youtu.be/wW1U0B7pah0?si=5NFeSA9bZrUfPWy-`

## Additional Sourcing Themes Completed

The broad sourcing pass searched and downloaded relevant sources around:

- Jose Fuentes Pacoima homeless encampment hillside
- Pacoima / Glenoaks homeless encampment hillside
- Los Angeles hillside homeless encampment Pacoima
- Caltrans homeless encampment cleanup
- Los Angeles homeless encampment cleanup / freeway / overpass context
- Homeless man builds shelter hillside
- Homeless shelter / pallet homes / temporary LA shelter context
- Pacoima homeless encampment news
- California homeless encampment removal
- Portable toilet / bathroom-on-wheels / tiny-home context
- Los Angeles street homelessness / outreach / cleanup context

Strong story-specific sources found include:

- `Gardener experiencing homelessness builds 'Hillside Estate' near freeway`
- `Homeless man creates mini mansion alongside Pacoima freeway`
- `Pacoima Residents Plead With City to Cleanup Homeless Encampment | NBCLA`
- `Pacoima street homelessness, trash conditions affecting businesses`

These should be prioritized during screening because they directly match the narration.

## Scripts Created For This Project

- `apps/api/scripts/setup_portable_toilets.ts`
  - Creates/updates the project.
  - Copies audio into uploads.
  - Runs local transcription.
  - Creates/updates 11 chapter records.

- `apps/api/scripts/ingest_portable_toilets_youtube.ts`
  - Ingests the 2 user-provided YouTube URLs.
  - Downloads, slices, screenshots, and updates the raw manifest.

- `apps/api/scripts/repair_portable_toilets_manifest.ts`
  - One-time repair script used after the first ingestion pass.
  - Rebuilt the manifest clip list from actual sliced files.

- `apps/api/scripts/source_portable_toilets_all.ts`
  - Broad sourcing pass.
  - Searches targeted YouTube queries.
  - Downloads and slices usable results.

## Commands Already Run

```powershell
npx tsx apps/api/scripts/setup_portable_toilets.ts
npx tsx apps/api/scripts/ingest_portable_toilets_youtube.ts
npx tsx apps/api/scripts/repair_portable_toilets_manifest.ts
npx tsx apps/api/scripts/source_portable_toilets_all.ts
```

## What Needs To Happen Next

### 1. Visual Screening

Screen the `599` pending clips in:

`uploads/raw/proj_1790101325660/manifest.json`

Use the screenshots in:

`uploads/raw/proj_1790101325660/screenshots`

For each clip, inspect `_p1.jpg` and `_p2.jpg`.

Approve only clips that are useful for the narration. Reject generic, mismatched, misleading, or artifact-heavy clips.

Prioritize these types of visuals:

- Jose Fuentes / Pacoima hillside estate visuals
- hand-built shelter / hillside garden / decorated encampment
- freeway / overpass / roadside homelessness context
- Pacoima street homelessness
- Caltrans or city cleanup/removal context
- shelters, encampments, street survival, sanitation, outreach
- portable-toilet tiny-home footage only when it directly supports the beat

Reject:

- generic people walking
- unrelated crowds
- office workers or staged lifestyle stock
- clips that only work if source audio is heard
- news anchor/talking-head shots unless absolutely needed
- heavy watermarks, tickers, captions, or unusable overlays
- any clip that cannot be justified against the narration in one sentence

### 2. Beat-To-Visual Matching

Every narration beat must get a visual that matches the spoken sentence.

Use the 1-sentence rule:

> If you cannot explain in one clear sentence why the visual directly supports the current spoken beat, reject it and choose another.

Examples:

- Beat about Glenoaks/freeway hillside -> use Pacoima hillside/freeway/estate visuals.
- Beat about Jose's hand-built shelter -> use the hand-built hillside estate or shelter details.
- Beat about neighbors/business complaints -> use Pacoima residents/business/trash-condition footage.
- Beat about Caltrans/removal pressure -> use Caltrans/cleanup/removal footage.
- Beat about homelessness and no housing -> use real encampment/shelter/street survival visuals, not generic people.
- Beat about portable-toilet homes/sanitation -> use the portable-toilet/tiny-home/mobile bathroom sources.

### 3. Unique Beat / No Repeat Rule

Every beat must use a unique visual asset or unique source segment.

Do not repeat:

- same sliced clip
- same still image
- same source segment
- same source URL moment
- same filename
- same MD5-identical file

This applies across all chapters, not only inside one chapter.

Use the media registry / dedupe tooling before final render.

Relevant rule from the automation guide:

> No beat repeats any video clip, still image, source URL, filename, source segment, or MD5 hash anywhere across all chapters.

### 4. Images Are Allowed

Still images are okay when they match the narration better than weak footage.

Use stills for:

- documents
- maps
- article screenshots, if clean and allowed
- archival photos
- location stills
- highly relevant factual images

But do not use generic decorative images. A still must match the beat as tightly as video.

### 5. Source More If The Pool Still Has Gaps

If the approved pool does not cover a beat, source more from:

- YouTube
- Archive.org
- Pexels
- Pixabay
- local raw footage
- other usable documentary/news/archival sources

Source for relevance, not just quantity.

Useful search directions if more footage is needed:

- `Jose Fuentes Pacoima hillside estate`
- `Pacoima homeless encampment freeway`
- `Glenoaks Boulevard Pacoima homeless encampment`
- `Caltrans homeless encampment cleanup Los Angeles`
- `Los Angeles freeway homeless encampment cleanup`
- `Pacoima residents homeless encampment`
- `homeless man builds shelter hillside Los Angeles`
- `California homeless encampment removal Caltrans`
- `Los Angeles mobile shower homeless`
- `bathroom on wheels homeless Los Angeles`

### 6. Stage Storyboards

After screening enough clips, stage the storyboards chapter by chapter.

Expected workflow:

1. Run the app/API dev servers if needed.
2. Use the project dashboard or pipeline endpoint to plan storyboards.
3. Ensure each chapter uses the correct voiceover file.
4. Verify `timelineJson` exists for every chapter.
5. Review clips visually before final render.

Dashboard:

`http://localhost:3000/project/proj_1790101325660`

### 7. Deduplicate Before Rendering

Before final render, run the dedupe/lockout process.

Goal:

- zero repeated clips
- zero repeated images
- zero repeated source moments
- no accidental reuse across chapters

Relevant existing script:

```powershell
npx tsx apps/api/scripts/enforce_unique_footage.ts
```

If that script is hardcoded to another project, update it or create a Portable Toilets variant for `proj_1790101325660`.

### 8. Final Render

Only render after:

- all chapters have staged storyboards
- every beat has a relevant matched visual
- all questionable clips are rejected/replaced
- dedupe passes
- source audio from footage is muted
- voiceover is the only audio track

Use sequential rendering to avoid memory spikes.

Relevant existing render path:

```powershell
npx tsx apps/api/scripts/render_all_chapters_sequential.ts
```

If hardcoded to another project, update it or create a Portable Toilets-specific render script.

## Completed Milestones

1. ✅ **Project & Chapters Setup**: 11 chapters created and verified in `chaptersStore`.
2. ✅ **Transcripts**: Whisper alignment JSONs generated for all 11 chapters with word-level timings.
3. ✅ **Visual Screening**: Screened all 599 raw clips via `apps/api/scripts/screen_and_tag_portable_toilets_pool.ts`.
   - 333 authentic documentary B-roll clips **approved** and semantically tagged.
   - 266 clips **rejected** (news anchor desks, Sun Valley warehouse fire with Loudlabs watermark, corporate PR talking heads).
4. ✅ **Zero-Repeat Storyboard Staging**: All 11 chapters staged via `apps/api/scripts/stage_all_portable_toilets_timelines.ts`.
   - Total beats across 11 chapters: **210 beats**.
   - Total unique clips assigned: **210 clips**.
   - Repeats / duplicates: **0 (Strict 100% Zero-Repeat Rule Enforced)**.
   - Project media registry locked at: `uploads/registry/proj_1790101325660_media_registry.json`.
   - All 11 chapters updated to `ready_to_render` with full `timelineJson` stored in `chaptersStore`.
5. ✅ **Editorial Callout Enrichment**: Staged 55 approved documentary callouts (`editorial_lower_third`, `odometer_stat`, `forensic_data_card`, `newspaper_headline`, `social_tweet_card`, `highlight_pill`, `redacted_dossier`, `caution_tape_banner`) across all 11 chapters.
6. ✅ **Flawless Master Audit**: Ran `apps/api/scripts/verify_flawless_master.ts` with 0 duplicate clips, 0 banned clips, 0 missing files, and 100% semantic alignment.
7. ✅ **Sequential Render Completed**: All 11 chapters rendered into high-definition 1080p MP4s via `apps/api/scripts/render_portable_toilets_sequential.ts`.
8. 🏆 **Master Documentary Stitched**: FFmpeg stitched all 11 chapters into `output/portable_toilets/master_documentary_pacoima_estate.mp4` (1.29 GB, 17m 7s runtime).

## Final Render Checklist

- [x] All 11 chapters have `timelineJson`.
- [x] Every beat has a unique clip or still (210 unique clips across 210 beats).
- [x] No repeated clip, image, filename, source URL, source segment, or MD5 hash (0 duplicates verified).
- [x] Every visual passes the 1-sentence beat-match rule.
- [x] Jose/Pacoima beats use Jose/Pacoima/hillside/freeway visuals first.
- [x] Homelessness beats use real homelessness/shelter/encampment/street-survival visuals.
- [x] Generic people footage is rejected unless it directly matches the beat.
- [x] ZERO portable-toilet clips used anywhere in the documentary.
- [x] Still images are used only when stronger than available footage.
- [x] All external/raw footage audio is muted (master audio voiceover only).
- [x] Voiceover is the only audible track.
- [x] Dedupe/registry check passes.
- [x] Final render pipeline executed (`apps/api/scripts/render_portable_toilets_sequential.ts`).
- [x] Full batch render completed (11/11 chapters rendered).
- [x] Master documentary MP4 stitched and verified (`output/portable_toilets/master_documentary_pacoima_estate.mp4`).
- [x] Web dashboard synced and playable at `http://localhost:3000/project/proj_1790101325660`.


