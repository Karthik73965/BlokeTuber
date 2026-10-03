import path from 'path';
import fs from 'fs';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export interface SlicedRawClip {
  id: string;
  filename: string;
  fullPath: string;
  duration: number;
  sourceUrl?: string;
  screenshots: string[]; // relative or absolute paths to preview .jpgs
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  tags?: string[];
  description?: string;
}

export interface RawProjectManifest {
  projectId: string;
  sourceVideos: Array<{
    url: string;
    title: string;
    localPath: string;
    duration: number;
  }>;
  clips: SlicedRawClip[];
  updatedAt: string;
}

function findYtDlp(): string {
  const customPath = 'C:\\Users\\karth\\AppData\\Local\\Programs\\Python\\Python311\\Scripts\\yt-dlp.exe';
  if (fs.existsSync(customPath)) return `"${customPath}"`;
  return 'yt-dlp';
}

export function getProjectRawDir(projectId: string): string {
  const rootUploads = path.resolve(__dirname, '../../../../uploads/raw', projectId);
  if (fs.existsSync(rootUploads)) return rootUploads;
  const cwdUploads = path.resolve(process.cwd(), 'uploads', 'raw', projectId);
  if (fs.existsSync(cwdUploads)) return cwdUploads;
  fs.mkdirSync(rootUploads, { recursive: true });
  return rootUploads;
}

export function getProjectScreenshotsDir(projectId: string): string {
  const rawDir = getProjectRawDir(projectId);
  const dir = path.join(rawDir, 'screenshots');
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

export function loadProjectManifest(projectId: string): RawProjectManifest {
  const rawDir = getProjectRawDir(projectId);
  const manifestPath = path.join(rawDir, 'manifest.json');
  if (fs.existsSync(manifestPath)) {
    try {
      return JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    } catch {
      // ignore
    }
  }
  return {
    projectId,
    sourceVideos: [],
    clips: [],
    updatedAt: new Date().toISOString(),
  };
}

export function saveProjectManifest(manifest: RawProjectManifest): void {
  const rawDir = getProjectRawDir(manifest.projectId);
  const manifestPath = path.join(rawDir, 'manifest.json');
  manifest.updatedAt = new Date().toISOString();
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
}

/**
 * Downloads a single YouTube video via yt-dlp (up to 1080p).
 */
export async function downloadYouTubeVideo(
  url: string,
  outputDir: string,
  maxDurationSec = 300
): Promise<{ title: string; localPath: string; duration: number } | null> {
  const ytDlp = findYtDlp();
  fs.mkdirSync(outputDir, { recursive: true });

  const template = path.join(outputDir, '%(title).50s_%(id)s.%(ext)s').replace(/\\/g, '/');
  console.log(`[YouTubeSourcing] ⬇️ Downloading: ${url}`);

  try {
    // Probe duration and title first
    const infoCmd = `${ytDlp} --dump-json "${url}"`;
    const { stdout } = await execAsync(infoCmd, { maxBuffer: 10 * 1024 * 1024 });
    const info = JSON.parse(stdout);
    const duration = info.duration || 0;
    const title = info.title || 'youtube_video';

    // Download format: 1080p or best mp4
    const downloadCmd = `${ytDlp} -f "bestvideo[ext=mp4][height<=1080]+bestaudio[ext=m4a]/best[ext=mp4]/best" --merge-output-format mp4 -o "${template}" "${url}"`;
    await execAsync(downloadCmd, { maxBuffer: 50 * 1024 * 1024 });

    // Find the downloaded file
    const safeId = info.id;
    const files = fs.readdirSync(outputDir);
    const downloadedFile = files.find((f) => f.includes(safeId) && f.endsWith('.mp4'));
    if (!downloadedFile) {
      console.warn(`[YouTubeSourcing] Could not locate downloaded file for id ${safeId}`);
      return null;
    }

    const localPath = path.join(outputDir, downloadedFile);
    console.log(`[YouTubeSourcing] ✅ Downloaded ${title} (${duration}s) -> ${localPath}`);
    return { title, localPath, duration };
  } catch (err) {
    console.error(`[YouTubeSourcing] Failed to download ${url}:`, err);
    return null;
  }
}

/**
 * Automatically searches YouTube for a topic and downloads top N videos (each ~3-4 mins max).
 */
export async function searchAndDownloadYouTube(
  query: string,
  outputDir: string,
  limit = 2
): Promise<Array<{ title: string; localPath: string; duration: number; url: string }>> {
  const ytDlp = findYtDlp();
  fs.mkdirSync(outputDir, { recursive: true });

  console.log(`[YouTubeSourcing] 🔍 Searching YouTube for "${query}" (top ${limit})...`);
  const searchSpec = `ytsearch${limit}:${query}`;
  const results: Array<{ title: string; localPath: string; duration: number; url: string }> = [];

  try {
    // Get JSON list of results
    const infoCmd = `${ytDlp} --dump-json --default-search "ytsearch" "${searchSpec}"`;
    const { stdout } = await execAsync(infoCmd, { maxBuffer: 20 * 1024 * 1024 });
    const lines = stdout.trim().split('\n').filter(Boolean);

    for (const line of lines) {
      try {
        const item = JSON.parse(line);
        const url = item.webpage_url || `https://www.youtube.com/watch?v=${item.id}`;
        // Skip videos longer than 600s to avoid hour-long podcasts
        if (item.duration && item.duration > 600) {
          console.log(`[YouTubeSourcing] ⏭️ Skipping video "${item.title}" - duration ${item.duration}s exceeds 10 mins`);
          continue;
        }

        const downloaded = await downloadYouTubeVideo(url, outputDir);
        if (downloaded) {
          results.push({ ...downloaded, url });
        }
      } catch (err) {
        console.warn(`[YouTubeSourcing] Error parsing search item:`, err);
      }
    }
  } catch (err) {
    console.error(`[YouTubeSourcing] Search failed for query "${query}":`, err);
  }

  return results;
}

/**
 * Slices a source video into 4–10 second descriptive clips using FFmpeg,
 * and extracts 2 preview screenshots per clip for visual screening.
 */
export async function sliceVideoIntoClips(
  sourcePath: string,
  projectId: string,
  sourceUrl?: string
): Promise<SlicedRawClip[]> {
  const rawDir = getProjectRawDir(projectId);
  const screenshotsDir = getProjectScreenshotsDir(projectId);

  const baseStem = path.parse(sourcePath).name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .slice(0, 30);

  // Probe duration
  const probeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${sourcePath}"`;
  let duration = 0;
  try {
    const { stdout } = await execAsync(probeCmd);
    duration = parseFloat(stdout.trim()) || 0;
  } catch {
    duration = 30;
  }

  const clips: SlicedRawClip[] = [];
  const targetClipDuration = 5.5; // ~5.5 seconds per clip
  let currentStart = 0.5; // skip first 0.5s of potential black screen
  let clipIndex = 1;

  while (currentStart + 3.0 < duration) {
    const clipLen = Math.min(targetClipDuration, duration - currentStart);
    const clipFileName = `${baseStem}_clip_${String(clipIndex).padStart(3, '0')}.mp4`;
    const clipOutPath = path.join(rawDir, clipFileName);

    // Fast, lossless or high quality cut
    const cutCmd = `ffmpeg -ss ${currentStart.toFixed(2)} -i "${sourcePath}" -t ${clipLen.toFixed(2)} -c:v libx264 -preset veryfast -crf 20 -c:a aac -avoid_negative_ts 1 -y "${clipOutPath}"`;
    try {
      await execAsync(cutCmd);

      // Extract 2 keyframe preview screenshots for visual screening
      const p1Name = `${baseStem}_clip_${String(clipIndex).padStart(3, '0')}_p1.jpg`;
      const p2Name = `${baseStem}_clip_${String(clipIndex).padStart(3, '0')}_p2.jpg`;
      const p1Path = path.join(screenshotsDir, p1Name);
      const p2Path = path.join(screenshotsDir, p2Name);

      const shot1Time = 0.8;
      const shot2Time = Math.max(1.2, clipLen - 1.0);

      await execAsync(`ffmpeg -ss ${shot1Time} -i "${clipOutPath}" -vframes 1 -q:v 2 -y "${p1Path}"`);
      await execAsync(`ffmpeg -ss ${shot2Time} -i "${clipOutPath}" -vframes 1 -q:v 2 -y "${p2Path}"`);

      clips.push({
        id: `${projectId}_${baseStem}_${clipIndex}`,
        filename: clipFileName,
        fullPath: clipOutPath,
        duration: clipLen,
        sourceUrl,
        screenshots: [p1Path, p2Path],
        status: 'pending', // awaits Antigravity direct screening
        tags: [baseStem],
      });

      clipIndex++;
    } catch (err) {
      console.warn(`[YouTubeSourcing] Failed to slice clip at ${currentStart}s:`, err);
    }

    currentStart += clipLen;
  }

  // Update manifest
  const manifest = loadProjectManifest(projectId);
  manifest.clips.push(...clips);
  saveProjectManifest(manifest);

  console.log(`[YouTubeSourcing] ✂️ Sliced "${baseStem}" into ${clips.length} curated raw clips.`);
  return clips;
}
