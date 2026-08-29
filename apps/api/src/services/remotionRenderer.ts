import path from 'path';
import fs from 'fs';
import { pathToFileURL } from 'url';
import { bundle } from '@remotion/bundler';
import { getCompositions, renderMedia } from '@remotion/renderer';
import { Timeline } from '@repo/shared';

let cachedBundleUrl: string | null = null;

function resolveMediaUrl(rawPath: string | null | undefined, baseDir: string): string | null {
  if (!rawPath) return null;
  if (/^https?:\/\//i.test(rawPath)) return rawPath;

  // 1. Direct path
  if (fs.existsSync(rawPath)) return pathToFileURL(path.resolve(rawPath)).href;

  // 2. Relative to baseDir
  const rel = path.resolve(baseDir, rawPath);
  if (fs.existsSync(rel)) return pathToFileURL(rel).href;

  // 3. Relative to cwd
  const cwdRel = path.resolve(process.cwd(), rawPath);
  if (fs.existsSync(cwdRel)) return pathToFileURL(cwdRel).href;

  // 4. Normalized path
  const norm = path.normalize(rawPath);
  if (fs.existsSync(norm)) return pathToFileURL(path.resolve(norm)).href;

  // 5. Strip prefix
  const stripped = rawPath.replace(/^(output|clips)[\\\/]/, '');
  const candidate1 = path.join(baseDir, stripped);
  if (fs.existsSync(candidate1)) return pathToFileURL(path.resolve(candidate1)).href;

  const candidate2 = path.join(baseDir, 'stock', path.basename(rawPath));
  if (fs.existsSync(candidate2)) return pathToFileURL(path.resolve(candidate2)).href;

  return null;
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

  // Resolve all clip paths and master audio path to valid file URLs for Remotion
  const resolvedTimeline: Timeline = {
    ...rawTimeline,
    masterAudioPath: resolveMediaUrl(rawTimeline.masterAudioPath, timelineDir) || '',
    clips: rawTimeline.clips.map((clip) => ({
      ...clip,
      clipPath: resolveMediaUrl(clip.clipPath, timelineDir),
    })),
  };

  const finalOut = path.resolve(outputVideoPath);
  const outDir = path.dirname(finalOut);
  fs.mkdirSync(outDir, { recursive: true });

  console.log(`\n🎬 [RemotionEngine] Starting React-Powered Video Render`);
  console.log(`📋 Timeline: ${absoluteTimelinePath}`);
  console.log(`📂 Output: ${finalOut}`);
  console.log(`🎞️  Clips: ${resolvedTimeline.clips.length} | ⏱️ Duration: ${Math.round(resolvedTimeline.totalDuration)}s\n`);

  const serveUrl = await getRemotionBundle();

  const compositions = await getCompositions(serveUrl, {
    inputProps: { timeline: resolvedTimeline },
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
    onProgress: ({ progress }) => {
      const currentClip = Math.min(totalClips, Math.max(1, Math.ceil(progress * totalClips)));
      if (currentClip !== lastReportedClip) {
        lastReportedClip = currentClip;
        console.log(`  ⚡ [Remotion] Rendering frame progress: ${(progress * 100).toFixed(1)}% (Beat ${currentClip}/${totalClips})`);
        if (onProgress) onProgress(currentClip, totalClips);
      }
    },
  });

  console.log(`\n====================================================`);
  console.log(`✅ REMOTION RENDER COMPLETE!`);
  console.log(`📁 Final Output: ${finalOut}`);
  console.log(`====================================================\n`);

  return finalOut;
}
