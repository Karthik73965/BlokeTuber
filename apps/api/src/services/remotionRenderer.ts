import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import http from 'http';
import { pathToFileURL } from 'url';
import { Timeline } from '@repo/shared';

let cachedBundleUrl: string | null = null;
let localMediaServer: http.Server | null = null;
let mediaServerPort = 0;

/**
 * Spins up a high-performance local HTTP streaming server with Range request support
 * to reliably stream media (MP4, MP3, JPG, PNG) directly to Chromium & Remotion Compositor.
 */
export async function ensureMediaServer(): Promise<number> {
  if (localMediaServer && mediaServerPort > 0) {
    return mediaServerPort;
  }

  return new Promise((resolve, reject) => {
    const server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');

      if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
      }

      try {
        const decodedUrl = decodeURIComponent(req.url || '');
        let filePath = decodedUrl.startsWith('/') ? decodedUrl.slice(1) : decodedUrl;
        if (filePath.includes('?')) filePath = filePath.split('?')[0] || '';

        // Windows drive letter normalization (e.g. C:/Users/...)
        let targetFile = path.resolve(filePath);
        if (!fs.existsSync(targetFile) && fs.existsSync(filePath)) {
          targetFile = filePath;
        }

        if (fs.existsSync(targetFile) && fs.statSync(targetFile).isFile()) {
          const ext = path.extname(targetFile).toLowerCase();
          const mimeTypes: Record<string, string> = {
            '.mp4': 'video/mp4',
            '.webm': 'video/webm',
            '.mp3': 'audio/mpeg',
            '.wav': 'audio/wav',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.svg': 'image/svg+xml',
            '.webp': 'image/webp',
          };
          const contentType = mimeTypes[ext] || 'application/octet-stream';
          const stat = fs.statSync(targetFile);

          // Support HTTP range requests for instant seek/stream
          const rangeHeader = req.headers.range;
          if (rangeHeader && rangeHeader.startsWith('bytes=')) {
            const rangeSpec = rangeHeader.slice(6);
            const [rawStart, rawEnd] = rangeSpec.split('-');
            let start = rawStart ? parseInt(rawStart, 10) : NaN;
            let end = rawEnd ? parseInt(rawEnd, 10) : NaN;

            if (isNaN(start) && !isNaN(end)) {
              start = Math.max(0, stat.size - end);
              end = stat.size - 1;
            } else if (!isNaN(start) && isNaN(end)) {
              end = stat.size - 1;
            }

            if (isNaN(start) || isNaN(end) || start < 0 || start > end || start >= stat.size) {
              res.writeHead(416, {
                'Content-Range': `bytes */${stat.size}`,
                'Accept-Ranges': 'bytes',
              });
              res.end();
              return;
            }

            end = Math.min(end, stat.size - 1);
            const chunkSize = end - start + 1;

            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${stat.size}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunkSize,
              'Content-Type': contentType,
            });
            fs.createReadStream(targetFile, { start, end }).pipe(res);
          } else {
            res.writeHead(200, {
              'Content-Length': stat.size,
              'Content-Type': contentType,
              'Accept-Ranges': 'bytes',
            });
            fs.createReadStream(targetFile).pipe(res);
          }
        } else {
          console.warn(`⚠️ [MediaServer 404] File not found: ${filePath} -> ${targetFile}`);
          res.writeHead(404);
          res.end('File not found');
        }
      } catch (err) {
        res.writeHead(500);
        res.end(String(err));
      }
    });

    server.listen(0, '127.0.0.1', () => {
      const addr = server.address();
      if (addr && typeof addr === 'object') {
        mediaServerPort = addr.port;
        localMediaServer = server;
        console.log(`📡 [RemotionRenderer] Local Media Stream Server running at http://127.0.0.1:${mediaServerPort}`);
        resolve(mediaServerPort);
      } else {
        reject(new Error('Failed to bind media server'));
      }
    });
  });
}

/**
 * Resolves local file paths to HTTP stream URLs so Remotion Compositor & Chromium can render them without error.
 */
export function resolveMediaUrl(rawPath: string | null | undefined, baseDir: string, port = mediaServerPort): string | null {
  if (!rawPath) return null;

  if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('data:')) {
    return rawPath;
  }

  let localFile: string | null = null;
  if (rawPath.startsWith('file:///')) {
    try {
      localFile = path.resolve(new URL(rawPath).pathname.replace(/^\/([a-zA-Z]:)/, '$1'));
    } catch {
      localFile = path.resolve(rawPath.replace('file:///', '').replace('file://', ''));
    }
  } else if (path.isAbsolute(rawPath) && fs.existsSync(rawPath)) {
    localFile = rawPath;
  } else {
    const candidates = [
      path.resolve(baseDir, rawPath),
      path.resolve(baseDir, path.basename(rawPath)),
      path.resolve(baseDir, 'stock', path.basename(rawPath)),
      path.resolve(process.cwd(), rawPath),
      path.resolve(process.cwd(), '..', rawPath),
      path.resolve(__dirname, '../../../..', rawPath),
      path.resolve(process.cwd(), 'apps', 'api', rawPath),
      path.resolve(process.cwd(), 'apps', 'api', 'output', rawPath),
    ];
    for (const cand of candidates) {
      if (fs.existsSync(cand) && fs.statSync(cand).isFile()) {
        localFile = cand;
        break;
      }
    }
  }

  if (!localFile || !fs.existsSync(localFile)) return null;

  // SVGs: inline data URI
  if (/\.svg$/i.test(localFile)) {
    const content = fs.readFileSync(localFile, 'utf-8');
    return `data:image/svg+xml;utf8,${encodeURIComponent(content)}`;
  }

  // All local media (videos, audio, photos, JPG/PNG) served via local HTTP server
  if (port > 0) {
    const normalized = localFile.replace(/\\/g, '/');
    return `http://127.0.0.1:${port}/${normalized}`;
  }

  return pathToFileURL(localFile).href;
}

export async function getRemotionBundle(): Promise<string> {
  if (cachedBundleUrl && fs.existsSync(cachedBundleUrl)) {
    return cachedBundleUrl;
  }

  const entryPoint = path.resolve(__dirname, '../../../../packages/remotion-video/src/index.ts');
  console.log(`📦 [RemotionRenderer] Bundling Remotion composition: ${entryPoint}...`);

  const bundleUrl = await bundle({
    entryPoint,
    webpackOverride: (config) => config,
  });

  cachedBundleUrl = bundleUrl;
  console.log(`✅ [RemotionRenderer] Composition bundled successfully at ${bundleUrl}`);
  return bundleUrl;
}

export async function renderTimelineVideo(
  timelineJsonPath: string,
  outputVideoPath: string,
  onProgress?: (clipIndex: number, totalClips: number) => void
): Promise<string> {
  const absoluteTimelinePath = path.resolve(timelineJsonPath);
  if (!fs.existsSync(absoluteTimelinePath)) {
    throw new Error(`Timeline file not found: ${absoluteTimelinePath}`);
  }

  const timelineDir = path.dirname(absoluteTimelinePath);
  const rawTimeline: Timeline = JSON.parse(fs.readFileSync(absoluteTimelinePath, 'utf-8'));

  // Pre-flight: sanitize all MP4 clips (H.264, silent AAC if audio missing, +faststart) for instant zero-latency Chromium streaming
  try {
    const ffmpegStatic = require('ffmpeg-static');
    const ffmpegBin = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';
    const { execSync } = require('child_process');
    for (const clip of rawTimeline.clips) {
      const pathsToCheck = [clip.clipPath, clip.secondaryClipPath, ...(clip.additionalClipPaths || [])].filter(Boolean) as string[];
      for (const p of pathsToCheck) {
        if (typeof p === 'string' && /\.mp4$/i.test(p)) {
          let abs = path.isAbsolute(p) ? p : path.resolve(timelineDir, p);
          if (!fs.existsSync(abs)) {
            const candidate = path.join(timelineDir, 'stock', path.basename(p));
            if (fs.existsSync(candidate)) abs = candidate;
          }
          if (fs.existsSync(abs)) {
            let hasAudio = false;
            try {
              const probe = execSync(`${ffmpegBin} -i "${abs}"`, { stdio: 'pipe' }).toString();
              hasAudio = probe.includes('Audio:');
            } catch (e: any) {
              const probeErr = e.stderr?.toString() || '';
              hasAudio = probeErr.includes('Audio:');
            }

            const tempFast = abs.replace(/\.mp4$/i, '_fast_tmp.mp4');
            try {
              if (hasAudio) {
                execSync(`${ffmpegBin} -y -i "${abs}" -c copy -movflags +faststart "${tempFast}"`, { stdio: 'pipe' });
              } else {
                execSync(`${ffmpegBin} -y -i "${abs}" -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 -c:v copy -c:a aac -shortest -movflags +faststart "${tempFast}"`, { stdio: 'pipe' });
              }
              if (fs.existsSync(tempFast) && fs.statSync(tempFast).size > 0) {
                fs.copyFileSync(tempFast, abs);
                fs.unlinkSync(tempFast);
              }
            } catch {}
          }
        }
      }
    }
  } catch {}

  const streamPort = await ensureMediaServer();

  const resolvedMasterAudio = resolveMediaUrl(rawTimeline.masterAudioPath, timelineDir, streamPort) || '';
  console.log(`🎵 [RemotionRenderer] Master Audio Track: ${resolvedMasterAudio || '(NONE)'}`);

  // Resolve all clip paths and master audio path
  const resolvedTimeline: Timeline = {
    ...rawTimeline,
    masterAudioPath: resolvedMasterAudio,
    clips: rawTimeline.clips.map((clip) => ({
      ...clip,
      clipPath: resolveMediaUrl(clip.clipPath, timelineDir, streamPort),
      secondaryClipPath: resolveMediaUrl(clip.secondaryClipPath, timelineDir, streamPort),
      additionalClipPaths: (clip.additionalClipPaths || [])
        .map((p) => resolveMediaUrl(p, timelineDir, streamPort))
        .filter(Boolean) as string[],
      sfxPath: resolveMediaUrl(clip.sfxPath, timelineDir, streamPort),
    })),
  };

  const finalOut = path.resolve(outputVideoPath);
  const outDir = path.dirname(finalOut);
  fs.mkdirSync(outDir, { recursive: true });

  const bundleUrl = await getRemotionBundle();

  const fps = 30;
  const durationInSeconds = Math.max(1, resolvedTimeline.totalDuration || 10);
  const durationInFrames = Math.round(durationInSeconds * fps);

  console.log(`\n🎬 [RemotionEngine] Starting React-Powered Video Render`);
  console.log(`📋 Timeline: ${absoluteTimelinePath}`);
  console.log(`📂 Output: ${finalOut}`);
  console.log(`🎞️  Clips: ${resolvedTimeline.clips.length} | ⏱️ Duration: ${durationInSeconds}s`);

  const composition = await selectComposition({
    serveUrl: bundleUrl,
    id: 'DocumentaryVideo',
    inputProps: {
      timeline: resolvedTimeline,
      width: 1920,
      height: 1080,
      fps,
      durationInFrames,
      durationInSeconds,
    },
    chromiumOptions: {
      args: [
        '--allow-file-access-from-files',
        '--disable-web-security',
        '--disable-features=IsolateOrigins,site-per-process',
        '--autoplay-policy=no-user-gesture-required',
      ],
    } as any,
  });

  if (fs.existsSync(finalOut)) {
    try { fs.unlinkSync(finalOut); } catch {}
  }

  try {
    await renderMedia({
      composition: {
        ...composition,
        durationInFrames,
        fps,
      },
      serveUrl: bundleUrl,
      codec: 'h264',
      outputLocation: finalOut,
      timeoutInMilliseconds: 600000,
      enforceAudioTrack: true,
      inputProps: {
        timeline: resolvedTimeline,
        width: 1920,
        height: 1080,
        fps,
        durationInFrames,
        durationInSeconds,
      },
      onProgress: ({ renderedFrames, totalFrames }: any) => {
        const safeTotal = totalFrames || durationInFrames || 1;
        const percent = Math.min(100, Math.round((renderedFrames / safeTotal) * 100));
        const currentBeat = Math.min(
          resolvedTimeline.clips.length,
          Math.max(1, Math.floor((renderedFrames / safeTotal) * resolvedTimeline.clips.length) + 1)
        );
        if (renderedFrames % Math.round(fps * 2) === 0 || renderedFrames === safeTotal) {
          console.log(`  ⚡ [Remotion] Rendering frame progress: ${percent}% (Beat ${currentBeat}/${resolvedTimeline.clips.length} | Frame ${renderedFrames}/${safeTotal})`);
          if (onProgress) onProgress(currentBeat, resolvedTimeline.clips.length);
        }
      },
      chromiumOptions: {
        args: [
          '--allow-file-access-from-files',
          '--disable-web-security',
          '--disable-features=IsolateOrigins,site-per-process',
          '--autoplay-policy=no-user-gesture-required',
        ],
      } as any,
    });
  } catch (err: any) {
    const inProgressFiles = fs.readdirSync(outDir).filter(f => f.startsWith(path.basename(finalOut)) && f.endsWith('.remotion-in-progress'));
    if (inProgressFiles.length > 0) {
      const inProgPath = path.join(outDir, inProgressFiles[0]);
      console.log(`⚠️ Remotion rename caught: Recovering from in-progress file ${inProgPath}`);
      if (fs.existsSync(finalOut)) {
        try { fs.unlinkSync(finalOut); } catch {}
      }
      fs.copyFileSync(inProgPath, finalOut);
      try { fs.unlinkSync(inProgPath); } catch {}
    } else {
      throw err;
    }
  }

  if (localMediaServer) {
    try {
      (localMediaServer as any).close();
    } catch {}
    localMediaServer = null;
    mediaServerPort = 0;
  }

  console.log(`\n====================================================`);
  console.log(`✅ REMOTION RENDER COMPLETE!`);
  console.log(`📁 Final Output: ${finalOut}`);
  console.log(`====================================================\n`);

  return finalOut;
}
