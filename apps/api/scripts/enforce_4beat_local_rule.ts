import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { projectsStore, chaptersStore } from '../src/db/localStore';
import {
  findStockFootage,
  findStockPhoto,
  downloadStockVideo,
  downloadStockPhoto,
  compressQuery,
} from '../src/services/stockFootage';
import type { Timeline } from '@repo/shared';

// Load environment variables
const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

function getContextualSearchQueries(text: string, chapterTitle: string): string[] {
  const lower = (text + ' ' + chapterTitle).toLowerCase();
  const queries: string[] = [];

  // Construction / Build Day
  if (/(\bbuild\b|\bframe\b|\bwood\b|\bpanel\b|\bwire\b|\bsaw\b|\bhammer\b|\bscrew\b|\btool\b|\bcurve\b|\barch\b|\bconstruction\b)/i.test(lower)) {
    queries.push('carpentry construction');
    queries.push('woodworking saw timber');
    queries.push('construction worker tools');
  }

  // City Council / Legal / Permits
  if (/(\bcouncil\b|\bordinance\b|\bpermit\b|\bmeeting\b|\bpublic\b|\bvote\b|\bcity\b|\bofficial\b|\bmayor\b|\bhearing\b)/i.test(lower)) {
    queries.push('city hall meeting');
    queries.push('government council podium');
    queries.push('press conference podium');
  }

  // Math / Cost / Finances / Accounting
  if (/(\bcost\b|\bdollar\b|\bmoney\b|\bmath\b|\bbudget\b|\bgrant\b|\bexpense\b|\bspreadsheet\b|\bnumber\b|\bthousand\b|\bmillion\b)/i.test(lower)) {
    queries.push('accounting spreadsheet paperwork');
    queries.push('calculator desk financial');
    queries.push('budget planning office');
  }

  // Street / Weather / Homelessness / Survival
  if (/(\brain\b|\bwet\b|\bgray\b|\bcloud\b|\bwinter\b|\bcold\b|\bsidewalk\b|\bstreet\b|\bhomeless\b|\boverpass\b|\bdoorway\b|\bsleeping\b)/i.test(lower)) {
    queries.push('rainy street dusk overcast');
    queries.push('wet urban pavement night');
    queries.push('gloomy cloudy city morning');
  }

  // Health / Medical / Social Work / Veterans
  if (/(\bdoctor\b|\bclinic\b|\binjury\b|\bspine\b|\bhealth\b|\bveteran\b|\bcounseling\b|\bjob\b|\bworkplace\b)/i.test(lower)) {
    queries.push('doctor patient consultation');
    queries.push('social worker counseling office');
    queries.push('physical therapy rehabilitation');
  }

  // Lock / Key / Door / Security
  if (/(\block\b|\bkey\b|\bpadlock\b|\bdoor\b|\bclosed\b|\bsecure\b)/i.test(lower)) {
    queries.push('turning key lock door');
    queries.push('brass padlock wooden door');
    queries.push('door latch handle close up');
  }

  // Natural fallback from text
  const compressed = compressQuery(text, 3);
  if (compressed && compressed.length > 3) {
    queries.push(compressed);
  }

  queries.push('wooden cabin tiny house');
  queries.push('pacific northwest rainy forest road');

  return queries;
}

// Concurrency pool helper
async function mapConcurrent<T, R>(items: T[], concurrency: number, fn: (item: T, idx: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let nextIdx = 0;

  async function worker(workerId: number) {
    while (nextIdx < items.length) {
      const idx = nextIdx++;
      console.log(`\n[Worker ${workerId}] 🚀 Processing Chapter ${items[idx]?.chapterIndex || idx + 1}...`);
      results[idx] = await fn(items[idx]!, idx);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, (_, i) => worker(i + 1));
  await Promise.all(workers);
  return results;
}

async function enforceRuleOnChapter(
  project: any,
  chapter: any,
  usedUrls: Set<string>
): Promise<{
  chapterIndex: number;
  title: string;
  totalClips: number;
  keptLocal: number;
  replacedLocal: number;
  violationsRemaining: number;
}> {
  const tl: Timeline = chapter.timelineJson;
  if (!tl || !Array.isArray(tl.clips) || tl.clips.length === 0) {
    return {
      chapterIndex: chapter.chapterIndex,
      title: chapter.title,
      totalClips: 0,
      keptLocal: 0,
      replacedLocal: 0,
      violationsRemaining: 0,
    };
  }

  // Check if already compliant
  const initialLocalIndices: number[] = [];
  tl.clips.forEach((c, idx) => {
    if (c.clipPath && /tract[\\\/]raw/i.test(c.clipPath)) {
      initialLocalIndices.push(idx);
    }
  });

  let initialViolations = 0;
  for (let k = 1; k < initialLocalIndices.length; k++) {
    if (initialLocalIndices[k]! - initialLocalIndices[k - 1]! < 5) {
      initialViolations++;
    }
  }

  if (initialViolations === 0) {
    console.log(`⏩ [Ch ${chapter.chapterIndex}] Already compliant (${initialLocalIndices.length} local clips, 0 violations) — Skipping`);
    return {
      chapterIndex: chapter.chapterIndex,
      title: chapter.title,
      totalClips: tl.clips.length,
      keptLocal: initialLocalIndices.length,
      replacedLocal: 0,
      violationsRemaining: 0,
    };
  }

  const jobDir = tl.outputPath ? path.dirname(tl.outputPath) : path.resolve(process.cwd(), 'apps/api/output', `tract_ch${chapter.chapterIndex}`);
  const stockDir = path.join(jobDir, 'stock');
  fs.mkdirSync(stockDir, { recursive: true });

  let lastLocalIdx = -999;
  let keptLocal = 0;
  let replacedLocal = 0;

  for (let i = 0; i < tl.clips.length; i++) {
    const clip = tl.clips[i]!;
    const isLocal = Boolean(clip.clipPath && /tract[\\\/]raw/i.test(clip.clipPath));

    if (!isLocal) {
      continue;
    }

    const distance = i - lastLocalIdx;
    if (distance >= 5) {
      // Compliant! Keep this local clip.
      lastLocalIdx = i;
      keptLocal++;
      continue;
    }

    // VIOLATION: distance < 5 (i.e. within 4 beats of previous local clip)
    // Must replace with stock footage/photo!
    const queries = getContextualSearchQueries(clip.text, chapter.title);
    let resolved = false;

    // Try finding stock video
    for (const q of queries) {
      try {
        const stockRes = await findStockFootage(q, null, usedUrls, { useVisionVerification: false });
        if (stockRes?.video) {
          const dest = path.join(stockDir, `replacement_video_b${i}.mp4`);
          await downloadStockVideo(stockRes.video, dest);
          clip.clipPath = dest;
          clip.mediaType = 'video';
          clip.stockSource = stockRes.video.source;
          clip.stockUrl = stockRes.video.url;
          clip.kenBurns = false;
          usedUrls.add(stockRes.video.url);
          resolved = true;
          replacedLocal++;
          break;
        }
      } catch (err: any) {
        // try next query
      }
    }

    // If no stock video, try stock photo
    if (!resolved) {
      for (const q of queries) {
        try {
          const photo = await findStockPhoto(q, usedUrls, { useVisionVerification: false });
          if (photo) {
            const dest = path.join(stockDir, `replacement_photo_b${i}.jpg`);
            await downloadStockPhoto(photo, dest);
            clip.clipPath = dest;
            clip.mediaType = 'image';
            clip.stockSource = photo.source;
            clip.stockUrl = photo.url;
            clip.kenBurns = true;
            usedUrls.add(photo.url);
            resolved = true;
            replacedLocal++;
            break;
          }
        } catch (err: any) {
          // try next query
        }
      }
    }

    if (!resolved) {
      console.warn(`     ⚠️ Warning: Could not find stock replacement for Ch ${chapter.chapterIndex} Beat ${i}`);
    }
  }

  // Verify remaining violations
  const finalLocalIndices: number[] = [];
  tl.clips.forEach((c, idx) => {
    if (c.clipPath && /tract[\\\/]raw/i.test(c.clipPath)) {
      finalLocalIndices.push(idx);
    }
  });

  let violationsRemaining = 0;
  for (let k = 1; k < finalLocalIndices.length; k++) {
    if (finalLocalIndices[k]! - finalLocalIndices[k - 1]! < 5) {
      violationsRemaining++;
    }
  }

  // Save updated timeline.json to disk
  if (tl.outputPath && fs.existsSync(path.dirname(tl.outputPath))) {
    fs.writeFileSync(tl.outputPath, JSON.stringify(tl, null, 2), 'utf-8');
  }

  // Update chaptersStore in database
  chaptersStore.update(project.id, chapter.id, {
    timelineJson: tl as any,
  });

  console.log(`✅ [Ch ${chapter.chapterIndex}] Fixed: Kept ${keptLocal} local, Replaced ${replacedLocal} with stock | Violations: ${violationsRemaining}`);

  return {
    chapterIndex: chapter.chapterIndex,
    title: chapter.title,
    totalClips: tl.clips.length,
    keptLocal,
    replacedLocal,
    violationsRemaining,
  };
}

async function run() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 PARALLEL ENFORCEMENT OF 4-BEAT LOCAL CLIP COOLDOWN (ALL CHAPTERS)');
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('Rule: Any local clip at Beat N requires Beats N+1, N+2, N+3, N+4 to be stock.');
  console.log('⚡ Concurrency: 3 Parallel Workers\n');

  const project = projectsStore.all().find((p) => p.name.toLowerCase() === 'tract');
  if (!project) {
    throw new Error('Project "Tract" not found in store!');
  }

  const usedUrls = new Set<string>();
  const chapters = [...chaptersStore.forProject(project.id)].sort((a, b) => (a.chapterIndex || 0) - (b.chapterIndex || 0));

  const startTime = Date.now();
  const results = await mapConcurrent(chapters, 3, async (ch) => {
    return await enforceRuleOnChapter(project, ch, usedUrls);
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`📊 AUDIT & REPLACEMENT COMPLETE IN ${elapsed}s`);
  console.log('═══════════════════════════════════════════════════════════════════\n');

  console.table(results);

  const totalViolations = results.reduce((sum, r) => sum + r.violationsRemaining, 0);
  console.log(`\nTotal Violations Remaining: ${totalViolations} (Must be 0) ${totalViolations === 0 ? '✅ 100% PERFECT COMPLIANCE' : '❌'}\n`);
}

run().catch((err) => {
  console.error('Execution error:', err);
  process.exit(1);
});
