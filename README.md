# BlokeTuber — AI Video Pipeline

> Automate 20-30 hours of video assembly down to under an hour of review.

## What It Does

Feed it your script, chapter voiceovers, and a clip library → get a **near-final MP4** with:
- Clip cuts and crossfades matched by AI to your script
- Ken Burns zoom effects on static shots
- Animated dollar/number callouts at the exact spoken timestamp
- Full master narration audio mix

---

## Monorepo Structure

```
BlokeTuber/
├── apps/
│   ├── web/          # Next.js frontend dashboard (local, port 3000)
│   └── api/          # Node.js/Express backend (local, port 3001)
│       └── scripts/
│           └── render.ts   # Local FFmpeg render script
├── packages/
│   ├── shared/       # Shared TypeScript types
│   ├── ui/           # Shared UI components
│   ├── eslint-config/
│   └── typescript-config/
```

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables

Copy the example files and fill in your keys:
```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local  # already created
```

Fill in `apps/api/.env`:
- `DATABASE_URL` — your Neon Postgres connection string
- `OPENAI_API_KEY` — for Whisper audio alignment
- `OPENROUTER_API_KEY` — for AI clip matching (cheap model)
- `PEXELS_API_KEY` — free from pexels.com/api
- `PIXABAY_API_KEY` — free from pixabay.com/api

### 3. Set up the database
```bash
cd apps/api
npm run db:push   # push schema to Neon
```

### 4. Run locally
```bash
# From monorepo root — runs both web + api
npm run dev

# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

---

## The Pipeline (What Happens When You Hit "Launch")

| Step | What happens |
|------|-------------|
| **1. Audio Assembly** | Stitches chapter MP3s into one master narration + chapter timing map |
| **2. Whisper Alignment** | Sends master audio to OpenAI Whisper API → word-level timestamps |
| **3. Script Parsing** | Breaks script into ~5s beats (sentences/clauses) |
| **4. Clip Matching** | AI (via OpenRouter, gemini-flash) picks best clip per beat from your library, falls back to stock footage (Pexels/Pixabay/Coverr/Mixkit) |
| **5. Timeline Build** | Assembles `timeline.json` with all timing, clips, overlays, transitions |

After the pipeline finishes, download `timeline.json` and run the **local render script**:

```bash
tsx apps/api/scripts/render.ts path/to/timeline.json output.mp4
```

This runs FFmpeg locally (free) and renders your final MP4.

---

## Costs Per Video (once built)

| Item | Cost |
|------|------|
| OpenAI Whisper (alignment) | ~$0.01-0.05 / video |
| OpenRouter clip matching | ~$0.50-1.50 / video |
| Stock footage (Pexels/Pixabay) | Free |
| FFmpeg render (local) | $0 |
| **Total** | **~$1-2 / video** |

---

## Phase 2 (after V1)
- Burned-in caption track from Whisper transcript
- Clip-library tagging UI (better matching over time)
- Auto re-use avoidance tuning
- Smarter transition variety
- Thumbnail auto-suggestions
