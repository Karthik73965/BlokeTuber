# Agent Instructions (Antigravity — read first, every chat)

## Rule Zero
You are the only AI in this pipeline. Never call OpenRouter, OpenAI, Groq, Gemini API, Anthropic API, Pexels, Pixabay or any cloud AI/stock API. Transcribe with local faster-whisper. Plan, match, screen (by viewing frame .jpg files yourself) and write timelines yourself. Source footage only with yt-dlp / Archive.org.

## Progress updates
On any long task, post a short progress update in chat **about every 1 minute**: what finished, what is running now, what is next, and anything that failed. Never go silent.

## Request type 1 — "go to SETUP.md and set up"
Execute every step in `SETUP.md` yourself in the terminal, in order: install missing tools (winget/pip), `npm install`, create folders, copy `.env`, run the verify commands. Skip what is already installed. Fix errors yourself and retry. If PATH changes need a new shell, refresh PATH in-session (`$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`). Only stop to ask the user for things you truly cannot do (e.g. admin prompt, copying SFX/music files from another PC). End with a checklist of what is installed and verified.

## Request type 2 — "these are the audio files, make the video"
The user gives audio files (paths, a folder, or attachments). Without asking further questions:
1. Pick a `<project_slug>` from the topic. Copy the files into `uploads/audio/<project_slug>/` as `01 - Title.mp3`, `02 - Title.mp3`… in chapter order (use leading numbers in the names; otherwise ask once for the order).
2. Follow `docs/ANTIGRAVITY_AUTOMATION_GUIDE.md` (Rule Zero first) and run Phases 1–6 end to end, keeping `<project_slug>_TRACKER.md` updated.
3. Helper scripts go in `scratch/<project_slug>/`, frames/snapshots in `uploads/raw/<project_slug>/` — never the repo root.
4. Deliver `output/<project_slug>/master_final.mp4` and `output/<project_slug>/QA_REPORT.md`. If any Section 11 checklist item fails, fix it, re-render the affected chapters, re-stitch and re-run QA before saying you are done.
5. Finish by giving the user the final video path, total duration and the QA summary.
