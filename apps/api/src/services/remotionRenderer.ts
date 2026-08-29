import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import { Timeline } from '@repo/shared';

let cachedBundleUrl: string | null = null;

function resolveMediaUrl(rawPath: string | null | undefined, baseDir: string): string | null {
  if (!rawPath) return null;
  if (/^https?:\/\//i.test(rawPath) || /^data:/i.test(rawPath)) return rawPath;

  let localFile: string | null = null;

  // 1. Direct path
  if (fs.existsSync(rawPath)) {
    localFile = path.resolve(rawPath);
  } else {
    // 2. Relative to baseDir
    const rel = path.resolve(baseDir, rawPath);
    if (fs.existsSync(rel)) {
      localFile = rel;
    } else {
      // 3. Relative to cwd
      const cwdRel = path.resolve(process.cwd(), rawPath);
      if (fs.existsSync(cwdRel)) {
        localFile = cwdRel;
      } else {
        // 4. Normalized path
        const norm = path.normalize(rawPath);
        if (fs.existsSync(norm)) {
          localFile = path.resolve(norm);
        } else {
          // 5. Strip prefix
          const stripped = rawPath.replace(/^(output|clips)[\\\/]/, '');
          const candidate1 = path.join(baseDir, stripped);
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
    }
  }

  if (!localFile || !fs.existsSync(localFile)) return null;

  // If it is an image, convert to data URI to bypass Chromium local file access security
  if (/\.svg$/i.test(localFile)) {
    const content = fs.readFileSync(localFile, 'utf-8');
    return `data:image/svg+xml;utf8,${encodeURIComponent(content)}`;
  }

  if (/\.(jpg|jpeg|png|webp|avif)$/i.test(localFile)) {
    const ext = path.extname(localFile).toLowerCase();
    const mime =
      ext === '.png'
        ? 'image/png'
        : ext === '.webp'
        ? 'image/webp'
        : ext === '.avif'
        ? 'image/avif'
        : 'image/jpeg';
    const base64 = fs.readFileSync(localFile).toString('base64');
    return `data:${mime};base64,${base64}`;
  }

  // Audio / Video files: use file:/// URL
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

  // Resolve all clip paths and master audio path
  const resolvedTimeline: Timeline = {
    ...rawTimeline,
    masterAudioPath: resolveMediaUrl(rawTimeline.masterAudioPath, timelineDir) || '',
    clips: rawTimeline.clips.map((clip) => ({
      ...clip,
      clipPath: resolveMediaUrl(clip.clipPath, timelineDir),
      secondaryClipPath: resolveMediaUrl(clip.secondaryClipPath, timelineDir),
    })),
  };

  const finalOut = path.resolve(outputVideoPath);
  const outDir = path.dirname(finalOut);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\n🎬 [RemotionEngine] Starting React-Powered Video Render`);
  console.log(`📋 Timeline: ${absoluteTimelinePath}`);
  console.log(`📂 Output: ${finalOut}`);
  console.log(`🎞️  Clips: ${resolvedTimeline.clips.length} | ⏱️ Duration: ${Math.round(resolvedTimeline.totalDuration)}s\n`);

  const chromiumOptions = {
    args: [
      '--allow-file-access-from-files',
      '--disable-web-security',
      '--disable-site-isolation-trials',
    ],
  };

  const serveUrl = await getRemotionBundle();

  const compositions = await getCompositions(serveUrl, {
    inputProps: { timeline: resolvedTimeline },
    chromiumOptions,
  });

  const composition = compositions.find((c) => c.id === 'DocumentaryVideo') || compositions[0];
  if (!composition) {
    throw new Error('Composition "DocumentaryVideo" not found in Remotion bundle.');
  }

  let lastReportedClip = 0;
  const totalClips = resolvedTimeline.clips.length;

  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: finalOut,
    inputProps: { timeline: resolvedTimeline },
    chromiumOptions,
    onProgress: ({ progress }) => {
      const currentClip = Math.min(totalClips, Math.floor(progress * totalClips) + 1);
      if (currentClip !== lastReportedClip) {
        lastReportedClip = currentClip;
        console.log(`  ⚡ [Remotion] Rendering frame progress: ${(progress * 100).toFixed(1)}% (Beat ${currentClip}/${totalClips})`);
        if (onProgress) {
          onProgress(currentClip, totalClips);
        }
      }
    },
  });

  console.log(`\n====================================================`);
  console.log(`✅ REMOTION RENDER COMPLETE!`);
  console.log(`📁 Final Output: ${finalOut}`);
  console.log(`====================================================\n`);

  return finalOut;
}
