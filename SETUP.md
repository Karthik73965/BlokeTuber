# BlokeTuber Setup (Fresh Windows PC)

This guide is for a video editor who runs the pipeline **only through the Antigravity agent** (Google Antigravity IDE). You install the tools once. After that, the agent does the work.

> **Antigravity agent:** if the user says "go to SETUP.md and set up", run every step below yourself and post progress about every minute. See `AGENTS.md`.

Run every command in **PowerShell**. After each install step, close PowerShell and open a new one so the PATH changes take effect.

---

## 1. Prerequisites

```powershell
winget install --id Git.Git -e
winget install --id OpenJS.NodeJS.LTS -e          # Node 20+ LTS (repo needs node >=18)
winget install --id Python.Python.3.11 -e         # make sure "Add python.exe to PATH" is on
winget install --id Gyan.FFmpeg -e                # full build, includes ffprobe
winget install --id UB-Mannheim.TesseractOCR -e   # used by pytesseract in the QA scripts
```

Open a **new** PowerShell window, then run:

```powershell
npm install -g npm@11                             # repo pins npm 11.x
python -m pip install --upgrade pip
python -m pip install -U yt-dlp faster-whisper
python -m pip install pillow numpy opencv-python pytesseract python-dotenv requests
```

If `python` opens the Microsoft Store, turn off the aliases: Settings > Apps > Advanced app settings > App execution aliases > switch off `python.exe` and `python3.exe`.

If Tesseract is not found, add `C:\Program Files\Tesseract-OCR` to your user PATH.

**Optional: NVIDIA GPU.** faster-whisper uses the CPU by default. To transcribe faster on an NVIDIA GPU, install a current NVIDIA driver plus the CUDA 12 runtime libraries:

```powershell
python -m pip install nvidia-cublas-cu12 nvidia-cudnn-cu12
```

---

## 2. Clone and install

```powershell
cd $HOME\Documents
git clone https://github.com/Karthik73965/BlokeTuber.git BlokeTuber
cd BlokeTuber
npm install
```

---

## 3. Create the folders

These folders are gitignored, so they will not come with the clone. Create them:

```powershell
New-Item -ItemType Directory -Force uploads\audio, uploads\sfx, uploads\music, uploads\raw, uploads\timelines, output
```

**Copy these files over by hand** (from the original PC or the shared drive). They are not in git.

- `uploads\sfx\`: `camera_shutter.mp3`, `paper_slide.mp3`, `stat_click.mp3`, `subtle_hit.mp3`, `whoosh_air.mp3`, `whoosh_cinematic.mp3`
- `uploads\music\`: `doc_clean_soul_reflective.mp3`, `doc_heartbreaking_piano_cello.mp3`

---

## 4. Environment file

```powershell
Copy-Item apps\api\.env.example apps\api\.env
```

You don't need to edit anything. `apps\api\.env.example` contains no AI API keys (OpenRouter has been removed) and already sets `DISABLE_VISION_CHECK=true`.

**This setup uses no paid or cloud AI API keys.** You do not need OpenRouter, OpenAI or Groq.
- Transcription runs locally with **faster-whisper**.
- The **Antigravity agent** itself does all the planning, screening and clip matching.

---

## 5. Verify

```powershell
node -v
npm -v
python --version
ffmpeg -version
ffprobe -version
yt-dlp --version
python -c "import faster_whisper; print('faster-whisper OK')"
python -c "import cv2, PIL, numpy, pytesseract, dotenv, requests; print('python deps OK')"
```

Every command should print a version or `OK`, with no errors.

---

## 6. Make a video

1. Pick a project slug, for example `tiny_cabins`.
2. Put the chapter audio files in `uploads\audio\<project_slug>\`. Number them in order:
   ```
   uploads\audio\tiny_cabins\01 - The Beginning.mp3
   uploads\audio\tiny_cabins\02 - Building It.mp3
   uploads\audio\tiny_cabins\03 - ...
   ```
3. Open the `BlokeTuber` folder in Antigravity.
4. Tell the agent:
   > Follow docs/ANTIGRAVITY_AUTOMATION_GUIDE.md and make the video for uploads/audio/<project_slug>
5. The finished video is saved in `output\<project_slug>\`.

---

## 7. Troubleshooting

| Problem | Fix |
|---|---|
| yt-dlp errors (`Sign in to confirm`, `HTTP 403`, `Unable to extract`) | yt-dlp is out of date. Run `python -m pip install -U yt-dlp`. |
| First render pauses or downloads a lot | On the first render, Remotion downloads its own headless Chromium. Let it finish. It needs internet access. |
| `EPERM` / `EBUSY` / "file is being used by another process" | Windows is locking the file. Close any video player, Explorer preview or other render that has the file open. Exclude the repo folder from Defender real-time scanning. Then retry. |
| Out of memory, or the render crashes partway | Ask the agent to render the chapters **one at a time** (sequentially), then concatenate them. Close Chrome and other heavy apps first. |
| `ffmpeg` / `ffprobe` not found | Open a new PowerShell window after installing. If it still fails, reinstall `Gyan.FFmpeg`. |
| `npm install` fails | Make sure `node -v` shows 20 or newer. Delete `node_modules` and run `npm install` again. |
