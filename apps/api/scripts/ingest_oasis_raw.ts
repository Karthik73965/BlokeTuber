import path from 'path';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';
import {
  getProjectRawDir,
  getProjectScreenshotsDir,
  loadProjectManifest,
  saveProjectManifest,
  SlicedRawClip,
} from '../src/services/youtubeSourcing';

const execAsync = promisify(exec);

const PROJECT_ID = 'proj_oasis_village';
const YOUTUBE_URL = 'https://www.youtube.com/watch?v=4r9BRr4Qb7A';
const PERM_ARCHIVE_DIR = 'C:\\Users\\karth\\Videos\\AmericanHideaways\\Oasis Village\\RAW';

function findYtDlp(): string {
  const customPath = 'C:\\Users\\karth\\AppData\\Local\\Programs\\Python\\Python311\\Scripts\\yt-dlp.exe';
  if (fs.existsSync(customPath)) return `"${customPath}"`;
  return 'yt-dlp';
}

async function ingestOasisRaw() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎥 PHASE 2: INGESTING & SLICING RAW YOUTUBE DOCUMENTARY FOOTAGE');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  const rawDir = getProjectRawDir(PROJECT_ID);
  const screenshotsDir = getProjectScreenshotsDir(PROJECT_ID);
  fs.mkdirSync(PERM_ARCHIVE_DIR, { recursive: true });

  const rawVideoTarget = path.join(rawDir, 'oasis_village_raw_1080p.mp4');
  const permVideoTarget = path.join(PERM_ARCHIVE_DIR, 'oasis_village_raw_1080p.mp4');

  const ytDlp = findYtDlp();

  // 1. Download if not already cached
  if (fs.existsSync(rawVideoTarget) && fs.statSync(rawVideoTarget).size > 10 * 1024 * 1024) {
    console.log(`⏩ Raw video already downloaded (${(fs.statSync(rawVideoTarget).size / (1024 * 1024)).toFixed(1)} MB)`);
  } else if (fs.existsSync(permVideoTarget) && fs.statSync(permVideoTarget).size > 10 * 1024 * 1024) {
    console.log(`⏩ Copying from permanent archive ${permVideoTarget}...`);
    fs.copyFileSync(permVideoTarget, rawVideoTarget);
  } else {
    console.log(`⬇️ Downloading 1080p source video from ${YOUTUBE_URL}...`);
    const dlCmd = `${ytDlp} -f "137+140/bestvideo[height<=1080]+bestaudio/best" --merge-output-format mp4 -o "${rawVideoTarget.replace(/\\/g, '/')}" "${YOUTUBE_URL}"`;
    await execAsync(dlCmd, { maxBuffer: 50 * 1024 * 1024 });
    console.log(`✅ Download finished: ${(fs.statSync(rawVideoTarget).size / (1024 * 1024)).toFixed(1)} MB`);

    // Backup to user's video folder
    fs.copyFileSync(rawVideoTarget, permVideoTarget);
    console.log(`💾 Saved permanent copy to ${permVideoTarget}`);
  }

  // 2. Probe video duration
  const probeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${rawVideoTarget}"`;
  const { stdout: probeOut } = await execAsync(probeCmd);
  const totalDuration = parseFloat(probeOut.trim()) || 1800;
  console.log(`⏱️ Total Source Duration: ${totalDuration.toFixed(1)}s (~${(totalDuration / 60).toFixed(1)} mins)`);

  // 3. Slice into 4.5s – 6.5s narrative clips
  const manifest = loadProjectManifest(PROJECT_ID);
  manifest.sourceVideos = [
    {
      url: YOUTUBE_URL,
      title: "This Transitional Shelter Tiny House Village Model Works—Here's Why!",
      localPath: rawVideoTarget,
      duration: totalDuration,
    },
  ];

  const targetClipDuration = 5.5; // ~5.5s cuts
  let currentStart = 2.0; // Skip intro logo
  let clipIndex = 1;
  const newClips: SlicedRawClip[] = [];

  console.log(`✂️ Slicing video into ~${targetClipDuration}s B-roll clips with keyframe screenshots...`);

  while (currentStart + 3.0 < totalDuration) {
    const clipLen = Math.min(targetClipDuration, totalDuration - currentStart);
    const clipNumStr = String(clipIndex).padStart(3, '0');
    const clipFileName = `oasis_clip_${clipNumStr}.mp4`;
    const clipOutPath = path.join(rawDir, clipFileName);

    const p1Name = `oasis_clip_${clipNumStr}_p1.jpg`;
    const p2Name = `oasis_clip_${clipNumStr}_p2.jpg`;
    const p1Path = path.join(screenshotsDir, p1Name);
    const p2Path = path.join(screenshotsDir, p2Name);

    // If clip already sliced and valid, skip FFmpeg cut
    if (!fs.existsSync(clipOutPath) || fs.statSync(clipOutPath).size < 10000) {
      const cutCmd = `ffmpeg -ss ${currentStart.toFixed(2)} -i "${rawVideoTarget}" -t ${clipLen.toFixed(2)} -c:v libx264 -preset veryfast -crf 20 -c:a aac -avoid_negative_ts 1 -y "${clipOutPath}"`;
      await execAsync(cutCmd);
    }

    // Generate screenshots
    if (!fs.existsSync(p1Path) || !fs.existsSync(p2Path)) {
      const shot1Time = 0.8;
      const shot2Time = Math.max(1.2, clipLen - 1.0);
      try {
        await execAsync(`ffmpeg -ss ${shot1Time} -i "${clipOutPath}" -vframes 1 -q:v 2 -y "${p1Path}"`);
        await execAsync(`ffmpeg -ss ${shot2Time} -i "${clipOutPath}" -vframes 1 -q:v 2 -y "${p2Path}"`);
      } catch (err) {
        // ignore screenshot err
      }
    }

    newClips.push({
      id: `${PROJECT_ID}_oasis_${clipIndex}`,
      filename: clipFileName,
      fullPath: clipOutPath,
      duration: clipLen,
      sourceUrl: YOUTUBE_URL,
      screenshots: [p1Path, p2Path],
      status: 'pending',
      tags: ['oasis_village', 'raw_sourced', 'b_roll'],
    });

    if (clipIndex % 25 === 0) {
      console.log(`   ✂️ Sliced ${clipIndex} clips... (at ${Math.round(currentStart)}s / ${Math.round(totalDuration)}s)`);
    }

    clipIndex++;
    currentStart += clipLen;
  }

  manifest.clips = newClips;
  saveProjectManifest(manifest);

  console.log(`\n═══════════════════════════════════════════════════════════════════`);
  console.log(`✅ PHASE 2 COMPLETE: Ingested & Sliced ${newClips.length} Raw Sourced B-Roll Clips!`);
  console.log(`📂 Clips directory: ${rawDir}`);
  console.log(`🖼️ Screenshots directory: ${screenshotsDir}`);
  console.log(`═══════════════════════════════════════════════════════════════════\n`);
}

ingestOasisRaw().catch(console.error);
