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
        if (filePath.includes('?')) filePath = filePath.split('?')[0];

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
          const range = req.headers.range;
          if (range) {
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
            const chunksize = end - start + 1;
            const file = fs.createReadStream(targetFile, { start, end });
            res.writeHead(206, {
              'Content-Range': `bytes ${start}-${end}/${stat.size}`,
              'Accept-Ranges': 'bytes',
              'Content-Length': chunksize,
              'Content-Type': contentType,
            });
            file.pipe(res);
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
  } else if (path.isAbsolute(rawPath)) {
    localFile = rawPath;
  } else {
    localFile = path.resolve(baseDir, rawPath);
    if (!fs.existsSync(localFile)) {
      const candidate1 = path.join(process.cwd(), rawPath);
      if (fs.existsSync(candidate1)) {
        localFile = path.resolve(candidate1);
      } else {
        const candidate2 = path.join(baseDir, 'stock', path.basename(rawPath));
        if (fs.existsSync(candidate2)) {
          localFile = path.resolve(candidate2);
        }
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

  const streamPort = await ensureMediaServer();
  const timelineDir = path.dirname(absoluteTimelinePath);
  const rawTimeline: Timeline = JSON.parse(fs.readFileSync(absoluteTimelinePath, 'utf-8'));

  // Resolve all clip paths and master audio path
  const resolvedTimeline: Timeline = {
    ...rawTimeline,
    masterAudioPath: resolveMediaUrl(rawTimeline.masterAudioPath, timelineDir, streamPort) || '',
    clips: rawTimeline.clips.map((clip) => ({
      ...clip,
      clipPath: resolveMediaUrl(clip.clipPath, timelineDir, streamPort),
      secondaryClipPath: resolveMediaUrl(clip.secondaryClipPath, timelineDir, streamPort),
      additionalClipPaths: (clip.additionalClipPaths || [])
        .map((p) => resolveMediaUrl(p, timelineDir, streamPort))
        .filter(Boolean) as string[],
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
    },
  });

  await renderMedia({
    composition: {
      ...composition,
      durationInFrames,
      fps,
    },
    serveUrl: bundleUrl,
    codec: 'h264',
    outputLocation: finalOut,
    everyFrameTimeoutInMilliseconds: 60000,
    inputProps: {
      timeline: resolvedTimeline,
      width: 1920,
      height: 1080,
      fps,
      durationInFrames,
      durationInSeconds,
    },
    onProgress: ({ renderedFrames, totalFrames }) => {
      const percent = Math.round((renderedFrames / totalFrames) * 100);
      const currentBeat = Math.min(
        resolvedTimeline.clips.length,
        Math.floor((renderedFrames / totalFrames) * resolvedTimeline.clips.length) + 1
      );
      if (renderedFrames % Math.round(fps * 2) === 0 || renderedFrames === totalFrames) {
        console.log(`  ⚡ [Remotion] Rendering frame progress: ${percent}.0% (Beat ${currentBeat}/${resolvedTimeline.clips.length})`);
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
    },
  });

  console.log(`\n====================================================`);
  console.log(`✅ REMOTION RENDER COMPLETE!`);
  console.log(`📁 Final Output: ${finalOut}`);
  console.log(`====================================================\n`);

  return finalOut;
}
