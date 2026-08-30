import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
  path.resolve(__dirname, '../../../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

export interface StockVideo {
  source: 'pexels' | 'pixabay' | 'coverr' | 'mixkit';
  url: string;
  previewUrl: string;
  title: string;
  tags?: string[];
  duration?: number;
  width?: number;
  height?: number;
}

export interface StockPhoto {
  source: 'pexels' | 'pixabay';
  id?: string;
  url: string; // full-resolution download URL
  previewUrl: string;
  title: string;
  tags?: string[];
  width: number;
  height: number;
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'up', 'about', 'into', 'over', 'after', 'and', 'but', 'or', 'so', 'yet',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'it', 'its', 'this', 'that', 'these', 'those', 'there', 'somebody', 'someone',
  'you', 'your', 'he', 'his', 'him', 'she', 'her', 'they', 'them', 'their', 'we', 'our',
  'will', 'would', 'shall', 'should', 'can', 'could', 'may', 'might', 'must',
  'then', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few',
  'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own',
  'same', 'so', 'than', 'too', 'very', 'just', 'now', 'also'
]);

const BANNED_IMAGE_TAGS = new Set([
  'vector', 'illustration', 'drawing', 'clipart', 'cartoon', '3d render',
  'render', 'sketch', 'paint', 'painting', 'anime', 'cgi', 'graphic'
]);

export function compressQuery(raw: string, maxWords = 4): string {
  if (!raw) return '';
  const clean = raw.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = clean.split(' ').filter((w) => !STOP_WORDS.has(w) && w.length > 2);
  if (words.length === 0) {
    return clean.split(' ').slice(0, maxWords).join(' ');
  }
  return words.slice(0, maxWords).join(' ');
}

function cleanQuery(query: string): string {
  return compressQuery(query, 4);
}

// --- PEXELS (High Quality HD / 4K Landscape) ---
async function searchPexels(query: string, perPage = 15): Promise<StockVideo[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];
  const q = compressQuery(query, 4);
  if (!q) return [];

  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(q)}&per_page=${perPage}&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.videos || [])
      .map((v: any) => {
        const file =
          v.video_files?.find((f: any) => f.quality === 'hd' && f.width >= 1920) ||
          v.video_files?.find((f: any) => f.quality === 'hd' && f.width >= 1280) ||
          v.video_files?.find((f: any) => f.quality === 'hd') ||
          v.video_files?.[0];

        // Extract meaningful semantic title from Pexels video URL slug
        let extractedTitle = q;
        if (v.url) {
          const parts = v.url.split('/').filter(Boolean);
          const slug = parts[parts.length - 1] || parts[parts.length - 2] || '';
          const cleanSlug = slug.replace(/-\d+$/, '').replace(/-/g, ' ').trim();
          if (cleanSlug && cleanSlug.length > 3) extractedTitle = cleanSlug;
        }

        const tagsList: string[] = Array.isArray(v.tags)
          ? v.tags.map((t: any) => (typeof t === 'string' ? t : t.name || ''))
          : extractedTitle.split(' ');

        return {
          source: 'pexels' as const,
          url: file?.link || v.url,
          previewUrl: v.image || '',
          title: extractedTitle,
          tags: tagsList.filter(Boolean),
          duration: v.duration,
          width: file?.width || 1920,
          height: file?.height || 1080,
        };
      })
      .filter((v: StockVideo) => v.url && (v.width || 1920) >= 1280 && (v.width || 1920) > (v.height || 1080));
  } catch {
    return [];
  }
}

// --- PIXABAY (High Quality HD Videos) ---
async function searchPixabay(query: string, perPage = 15): Promise<StockVideo[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];
  const q = compressQuery(query, 4);
  if (!q) return [];

  try {
    const response = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(q)}&per_page=${perPage}&video_type=film&safesearch=true`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.hits || [])
      .map((v: any) => {
        const medium = v.videos?.large || v.videos?.medium || v.videos?.small;
        const tagArray = String(v.tags || '').split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean);
        return {
          source: 'pixabay' as const,
          url: medium?.url || '',
          previewUrl: v.userImageURL || '',
          title: v.tags || q,
          tags: tagArray,
          duration: medium?.duration,
          width: medium?.width || 1920,
          height: medium?.height || 1080,
        };
      })
      .filter((v: StockVideo) => v.url && (v.width || 1920) >= 1280 && (v.width || 1920) > (v.height || 1080));
  } catch {
    return [];
  }
}

// --- COVERR ---
async function searchCoverr(query: string): Promise<StockVideo[]> {
  const q = compressQuery(query, 3);
  if (!q) return [];

  try {
    const response = await fetch(
      `https://api.coverr.co/videos?query=${encodeURIComponent(q)}&page=1`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.hits || [])
      .slice(0, 8)
      .map((v: any) => ({
        source: 'coverr' as const,
        url: v.urls?.mp4_download || v.urls?.mp4 || '',
        previewUrl: v.urls?.thumbnail || '',
        title: v.title || q,
        duration: v.duration,
        width: 1920,
        height: 1080,
      }))
      .filter((v: StockVideo) => v.url);
  } catch {
    return [];
  }
}

// --- MIXKIT ---
async function searchMixkit(query: string): Promise<StockVideo[]> {
  const q = compressQuery(query, 3);
  if (!q) return [];

  try {
    const response = await fetch(
      `https://mixkit.co/api/v1/videos?search=${encodeURIComponent(q)}&limit=8`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.items || data.videos || [])
      .slice(0, 8)
      .map((v: any) => ({
        source: 'mixkit' as const,
        url: v.source || v.download_url || '',
        previewUrl: v.thumbnail || v.image || '',
        title: v.title || q,
        duration: v.duration,
        width: 1920,
        height: 1080,
      }))
      .filter((v: StockVideo) => v.url);
  } catch {
    return [];
  }
}

/**
 * Scores a stock video or photo candidate against target queries and visual subject,
 * and heavily penalizes negative/conflicting keywords (e.g. kitchen/dishes when looking for car).
 */
export function computeMetadataRelevanceScore(
  item: { title: string; tags?: string[] },
  query: string,
  visualSubject?: string,
  negativeKeywords?: string[]
): number {
  const combinedText = `${item.title || ''} ${(item.tags || []).join(' ')}`.toLowerCase();

  // 1. Negative Keyword Penalty: Disqualify completely if negative keywords appear
  const allNegative = new Set<string>();
  if (negativeKeywords && Array.isArray(negativeKeywords)) {
    for (const nk of negativeKeywords) {
      if (nk) allNegative.add(nk.toLowerCase().trim());
    }
  }

  // Common contextual conflicts:
  const queryLower = `${query} ${visualSubject || ''}`.toLowerCase();
  const isVehicleQuery = /\b(car|van|truck|vehicle|seat|driver|driving|highway|road|windshield|dashboard|steering)\b/i.test(queryLower);
  if (isVehicleQuery) {
    const defaultVehicleConflicts = ['kitchen', 'dish', 'dishes', 'dishwasher', 'cooking', 'restaurant', 'food', 'bedroom', 'baby stroller', 'airplane'];
    for (const c of defaultVehicleConflicts) allNegative.add(c);
  }

  for (const neg of allNegative) {
    if (neg && combinedText.includes(neg)) {
      return -1000; // instant rejection
    }
  }

  // 2. Positive Keyword Matching:
  let score = 0;
  const searchWords = `${query} ${visualSubject || ''}`
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(' ')
    .filter((w) => !STOP_WORDS.has(w) && w.length > 2);

  for (const word of searchWords) {
    if (combinedText.includes(word)) {
      score += 15;
    }
  }

  // Bonus if title contains full query phrase
  const cleanQ = query.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').trim();
  if (cleanQ && combinedText.includes(cleanQ)) {
    score += 30;
  }

  return score;
}

/**
 * Fast AI Vision Verification using OpenRouter (e.g. openai/gpt-4o-mini).
 * Inspects candidate thumbnail preview to confirm it actually matches the visual subject.
 */
export async function verifyStockCandidateWithVision(
  previewUrl: string,
  visualRequirement: string,
  candidateTitle: string
): Promise<{ matches: boolean; reason: string }> {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (!openrouterKey || !previewUrl || !previewUrl.startsWith('http')) {
    return { matches: true, reason: 'Vision verification skipped (no API key or preview URL)' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4-second fast timeout

    const prompt = `You are a strict documentary visual quality editor.
We need a stock footage clip/photo that visually portrays this subject: "${visualRequirement}".
Candidate metadata: "${candidateTitle}".

Look at the image preview. Does this preview image/video match the requested topic?
Reject if it shows completely unrelated scenes (e.g. showing kitchen/dishwashing when we need a car seat, or showing modern luxury office when we need gritty van life).

Respond ONLY in JSON format:
{
  "matches": true or false,
  "reason": "short 1-sentence explanation"
}`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bloketuber.app',
      },
      body: JSON.stringify({
        model: process.env.CLIP_MATCH_MODEL || 'openai/gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: previewUrl } },
            ],
          },
        ],
        temperature: 0.1,
        max_tokens: 100,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return { matches: true, reason: 'Vision verification fallback on HTTP error' };
    }

    const data = (await res.json()) as any;
    const content = data.choices?.[0]?.message?.content || '{}';
    const cleanJson = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      matches: parsed.matches !== false,
      reason: parsed.reason || 'Verified by AI Vision',
    };
  } catch (err: any) {
    return { matches: true, reason: `Vision check skipped: ${err.message}` };
  }
}

export interface StockSearchFilterOptions {
  visualSubject?: string;
  negativeKeywords?: string[];
  useVisionVerification?: boolean;
}

/**
 * Searches all configured stock footage platforms simultaneously (Pexels, Pixabay, Coverr, Mixkit).
 * Automatically ranks results by relevance, enforces negative keyword filtering, runs AI vision check, and enforces uniqueness.
 */
export async function findStockFootage(
  primaryQuery: string,
  backupQuery?: string | null,
  usedUrls?: Set<string>,
  options?: StockSearchFilterOptions
): Promise<StockVideo | null> {
  const q1 = cleanQuery(primaryQuery);
  const visualReq = options?.visualSubject || primaryQuery;
  console.log(`🔎 Searching Real Stock B-Roll [Query: "${q1}"] [Subject: "${visualReq}"]...`);

  // Tier 1: Search all 4 providers for primary query
  const [pexels1, pixabay1, coverr1, mixkit1] = await Promise.allSettled([
    searchPexels(q1, 10),
    searchPixabay(q1, 10),
    searchCoverr(q1),
    searchMixkit(q1),
  ]);

  const pool1: StockVideo[] = [
    ...(pexels1.status === 'fulfilled' ? pexels1.value : []),
    ...(pixabay1.status === 'fulfilled' ? pixabay1.value : []),
    ...(coverr1.status === 'fulfilled' ? coverr1.value : []),
    ...(mixkit1.status === 'fulfilled' ? mixkit1.value : []),
  ];

  // Filter and score candidates
  const scored1 = pool1
    .filter((v) => !usedUrls?.has(v.url))
    .map((v) => ({
      video: v,
      score: computeMetadataRelevanceScore(v, q1, options?.visualSubject, options?.negativeKeywords),
    }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score);

  for (const item of scored1.slice(0, 3)) {
    if (options?.useVisionVerification !== false && item.video.previewUrl) {
      const visionResult = await verifyStockCandidateWithVision(item.video.previewUrl, visualReq, item.video.title);
      if (!visionResult.matches) {
        console.log(`  ❌ Rejected candidate [${item.video.source}]: "${item.video.title}" (Vision Reason: ${visionResult.reason})`);
        continue;
      }
    }
    usedUrls?.add(item.video.url);
    console.log(`  ✅ Selected verified video [${item.video.source}]: "${item.video.title}" (Score: ${item.score})`);
    return item.video;
  }

  // Tier 2: Try backup query if available
  if (backupQuery) {
    const q2 = cleanQuery(backupQuery);
    console.log(`  🔄 Trying Backup B-Roll Query [Query: "${q2}"]...`);
    const [pexels2, pixabay2, coverr2] = await Promise.allSettled([
      searchPexels(q2, 8),
      searchPixabay(q2, 8),
      searchCoverr(q2),
    ]);

    const pool2: StockVideo[] = [
      ...(pexels2.status === 'fulfilled' ? pexels2.value : []),
      ...(pixabay2.status === 'fulfilled' ? pixabay2.value : []),
      ...(coverr2.status === 'fulfilled' ? coverr2.value : []),
    ];

    const scored2 = pool2
      .filter((v) => !usedUrls?.has(v.url))
      .map((v) => ({
        video: v,
        score: computeMetadataRelevanceScore(v, q2, options?.visualSubject, options?.negativeKeywords),
      }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score);

    for (const item of scored2.slice(0, 3)) {
      if (options?.useVisionVerification !== false && item.video.previewUrl) {
        const visionResult = await verifyStockCandidateWithVision(item.video.previewUrl, visualReq, item.video.title);
        if (!visionResult.matches) {
          console.log(`  ❌ Rejected candidate [${item.video.source}]: "${item.video.title}" (Vision Reason: ${visionResult.reason})`);
          continue;
        }
      }
      usedUrls?.add(item.video.url);
      console.log(`  ✅ Selected verified backup video [${item.video.source}]: "${item.video.title}" (Score: ${item.score})`);
      return item.video;
    }
  }

  // Tier 3: Core keyword fallback with positive score requirement
  const coreWords = q1.split(' ').slice(0, 2).join(' ');
  if (coreWords && coreWords !== q1) {
    console.log(`  🔄 Trying Core Keyword Fallback [Query: "${coreWords}"]...`);
    const [pexels3, pixabay3] = await Promise.allSettled([
      searchPexels(coreWords, 6),
      searchPixabay(coreWords, 6),
    ]);

    const pool3: StockVideo[] = [
      ...(pexels3.status === 'fulfilled' ? pexels3.value : []),
      ...(pixabay3.status === 'fulfilled' ? pixabay3.value : []),
    ];

    const scored3 = pool3
      .filter((v) => !usedUrls?.has(v.url))
      .map((v) => ({
        video: v,
        score: computeMetadataRelevanceScore(v, coreWords, options?.visualSubject, options?.negativeKeywords),
      }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score);

    if (scored3.length > 0) {
      const best = scored3[0]!.video;
      usedUrls?.add(best.url);
      return best;
    }
  }

  return null;
}

// --- PIXABAY (High Resolution Real Photos) ---
async function searchPixabayPhotos(query: string, perPage = 25): Promise<StockPhoto[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];
  const q = compressQuery(query, 4);
  if (!q) return [];

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(q)}&image_type=photo&orientation=horizontal&per_page=${perPage}&safesearch=true`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.hits || [])
      .filter((p: any) => {
        if (!p.largeImageURL && !p.webformatURL) return false;
        const w = p.imageWidth || 1920;
        const h = p.imageHeight || 1080;
        if (w < h || w < 1280) return false; // Enforce landscape & HD
        const tagList = String(p.tags || '').toLowerCase().split(/[\s,]+/);
        if (tagList.some((t: string) => BANNED_IMAGE_TAGS.has(t))) return false;
        return true;
      })
      .map((p: any) => {
        const tagArray = String(p.tags || '').split(',').map((t: string) => t.trim().toLowerCase()).filter(Boolean);
        return {
          source: 'pixabay' as any,
          id: `pixabay_${p.id}`,
          url: p.largeImageURL || p.fullHDURL || p.imageURL || p.webformatURL,
          previewUrl: p.previewURL || '',
          title: p.tags || q,
          tags: tagArray,
          width: p.imageWidth || 1920,
          height: p.imageHeight || 1080,
        };
      })
      .filter((p: StockPhoto) => p.url);
  } catch {
    return [];
  }
}

/**
 * Search Pexels and Pixabay for ultra high-resolution real photography (4K/5K original resolution).
 * Enforces negative keyword filtering, semantic relevance scoring, and optional AI vision verification.
 */
export async function findStockPhoto(
  rawQuery: string,
  usedUrls?: Set<string>,
  options?: StockSearchFilterOptions
): Promise<StockPhoto | null> {
  const q1 = compressQuery(rawQuery, 4);
  if (!q1) return null;

  const visualReq = options?.visualSubject || rawQuery;
  console.log(`📷 Searching Ultra-HD Real Photography [Query: "${q1}"] [Subject: "${visualReq}"]...`);

  // Tier 1: Deep search Pexels (25) + Pixabay (25)
  const pexelsKey = process.env.PEXELS_API_KEY;
  const searchPromises: Promise<any>[] = [];

  if (pexelsKey) {
    searchPromises.push(
      fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(q1)}&per_page=25&orientation=landscape`,
        { headers: { Authorization: pexelsKey } }
      ).then(async (res) => {
        if (!res.ok) return [];
        const data = (await res.json()) as any;
        return (data.photos || [])
          .filter((p: any) => (p.width || 1920) >= (p.height || 1080) && (p.width || 1920) >= 1280)
          .map((photo: any) => ({
            source: 'pexels' as const,
            id: `pexels_${photo.id}`,
            url: photo.src?.large2x || photo.src?.large || photo.src?.original || '',
            previewUrl: photo.src?.medium || '',
            title: photo.alt || q1,
            tags: (photo.alt || '').split(' '),
            width: photo.width || 1920,
            height: photo.height || 1080,
          }));
      }).catch(() => [])
    );
  }

  searchPromises.push(searchPixabayPhotos(q1, 25));

  const results = await Promise.allSettled(searchPromises);
  const pool: StockPhoto[] = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

  // Filter out used items and score relevance
  const scored1 = pool
    .filter((p) => {
      const isUsed = usedUrls?.has(p.url) || (p.id && usedUrls?.has(p.id));
      return !isUsed;
    })
    .map((p) => ({
      photo: p,
      score: computeMetadataRelevanceScore(p, q1, options?.visualSubject, options?.negativeKeywords),
    }))
    .filter((item) => item.score >= 0)
    .sort((a, b) => b.score - a.score);

  for (const item of scored1.slice(0, 3)) {
    if (options?.useVisionVerification !== false && item.photo.previewUrl) {
      const visionResult = await verifyStockCandidateWithVision(item.photo.previewUrl, visualReq, item.photo.title);
      if (!visionResult.matches) {
        console.log(`  ❌ Rejected photo candidate [${item.photo.source}]: "${item.photo.title}" (Vision Reason: ${visionResult.reason})`);
        continue;
      }
    }
    usedUrls?.add(item.photo.url);
    if (item.photo.id) usedUrls?.add(item.photo.id);
    console.log(`  ✅ Selected verified photo [${item.photo.source}]: "${item.photo.title}" (Score: ${item.score})`);
    return item.photo;
  }

  // Tier 2: 2-word compressed query
  const coreWords = compressQuery(q1, 2);
  if (coreWords && coreWords !== q1) {
    console.log(`  🔄 Simplifying photo query: "${coreWords}"...`);
    const tier2Promises: Promise<any>[] = [];
    if (pexelsKey) {
      tier2Promises.push(
        fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(coreWords)}&per_page=20&orientation=landscape`,
          { headers: { Authorization: pexelsKey } }
        ).then(async (res) => {
          if (!res.ok) return [];
          const data = (await res.json()) as any;
          return (data.photos || [])
            .filter((p: any) => (p.width || 1920) >= (p.height || 1080))
            .map((photo: any) => ({
              source: 'pexels' as const,
              id: `pexels_${photo.id}`,
              url: photo.src?.large2x || photo.src?.large || photo.src?.original || '',
              previewUrl: photo.src?.medium || '',
              title: photo.alt || coreWords,
              tags: (photo.alt || '').split(' '),
              width: photo.width || 1920,
              height: photo.height || 1080,
            }));
        }).catch(() => [])
      );
    }
    tier2Promises.push(searchPixabayPhotos(coreWords, 20));
    const tier2Results = await Promise.allSettled(tier2Promises);
    const pool2: StockPhoto[] = tier2Results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
    const scored2 = pool2
      .filter((p) => {
        const isUsed = usedUrls?.has(p.url) || (p.id && usedUrls?.has(p.id));
        return !isUsed;
      })
      .map((p) => ({
        photo: p,
        score: computeMetadataRelevanceScore(p, coreWords, options?.visualSubject, options?.negativeKeywords),
      }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score);

    if (scored2.length > 0) {
      const best = scored2[0]!.photo;
      usedUrls?.add(best.url);
      if (best.id) usedUrls?.add(best.id);
      return best;
    }
  }

  return null;
}

/**
 * Download a stock video to local disk.
 * Automatically ensures faststart (moov atom at head) for instant, seamless decoding in Chromium & Remotion.
 */
export async function downloadStockVideo(
  video: StockVideo,
  outputPath: string
): Promise<string> {
  const response = await fetch(video.url);
  if (!response.ok) throw new Error(`Failed to download stock video: ${video.url}`);

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  // Run standardization: ensure H.264, silent AAC if audio missing, and faststart moov atom
  try {
    const ffmpegStatic = require('ffmpeg-static');
    const ffmpegBin = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';
    const tempOpt = outputPath.replace(/\.mp4$/i, '_std.mp4');
    const { execSync } = require('child_process');

    let hasAudio = false;
    try {
      const probe = execSync(`${ffmpegBin} -i "${outputPath}"`, { stdio: 'pipe' }).toString();
      hasAudio = probe.includes('Audio:');
    } catch (e: any) {
      const probeErr = e.stderr?.toString() || '';
      hasAudio = probeErr.includes('Audio:');
    }

    if (hasAudio) {
      execSync(`${ffmpegBin} -y -i "${outputPath}" -c:v libx264 -pix_fmt yuv420p -c:a aac -movflags +faststart "${tempOpt}"`, { stdio: 'pipe' });
    } else {
      execSync(`${ffmpegBin} -y -i "${outputPath}" -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=48000 -c:v libx264 -pix_fmt yuv420p -c:a aac -shortest -movflags +faststart "${tempOpt}"`, { stdio: 'pipe' });
    }

    if (fs.existsSync(tempOpt) && fs.statSync(tempOpt).size > 0) {
      fs.copyFileSync(tempOpt, outputPath);
      fs.unlinkSync(tempOpt);
    }
  } catch (e) {
    // Non-fatal, original MP4 is still in place
  }

  return outputPath;
}

/**
 * Download a real stock photo to local disk.
 */
export async function downloadStockPhoto(
  photo: StockPhoto,
  outputPath: string
): Promise<string> {
  const response = await fetch(photo.url);
  if (!response.ok) throw new Error(`Failed to download stock photo: ${photo.url}`);

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
  return outputPath;
}

export interface StockSearchOption {
  id: string;
  url: string;
  previewUrl: string;
  title: string;
  source: 'pexels' | 'pixabay' | 'coverr' | 'mixkit';
  mediaType: 'video' | 'image';
  width: number;
  height: number;
}

/**
 * Search alternative stock footage or photos on-the-fly for the visual storyboard clip swapper.
 */
export async function searchAlternativeStock(
  rawQuery: string,
  mediaType: 'video' | 'image' = 'video',
  count: number = 8,
  usedUrls?: Set<string>
): Promise<StockSearchOption[]> {
  const q = rawQuery.trim();
  if (!q) return [];

  if (mediaType === 'video') {
    const [pexels, pixabay, coverr] = await Promise.allSettled([
      searchPexels(q, count * 2),
      searchPixabay(q, count * 2),
      searchCoverr(q),
    ]);

    const pool: StockVideo[] = [
      ...(pexels.status === 'fulfilled' ? pexels.value : []),
      ...(pixabay.status === 'fulfilled' ? pixabay.value : []),
      ...(coverr.status === 'fulfilled' ? coverr.value : []),
    ];

    const filtered = pool
      .filter((v) => !usedUrls?.has(v.url))
      .slice(0, count)
      .map((v) => ({
        id: v.url,
        url: v.url,
        previewUrl: v.previewUrl || v.url,
        title: v.title || q,
        source: v.source,
        mediaType: 'video' as const,
        width: v.width || 1920,
        height: v.height || 1080,
      }));

    return filtered;
  } else {
    const pexelsKey = process.env.PEXELS_API_KEY;
    const searchPromises: Promise<any>[] = [];

    if (pexelsKey) {
      searchPromises.push(
        fetch(
          `https://api.pexels.com/v1/search?query=${encodeURIComponent(q)}&per_page=${count * 2}&orientation=landscape`,
          { headers: { Authorization: pexelsKey } }
        ).then(async (res) => {
          if (!res.ok) return [];
          const data = (await res.json()) as any;
          return (data.photos || []).map((p: any) => ({
            id: `pexels_${p.id}`,
            url: p.src?.large2x || p.src?.large || p.src?.original || '',
            previewUrl: p.src?.medium || p.src?.small || '',
            title: p.alt || q,
            source: 'pexels' as const,
            mediaType: 'image' as const,
            width: p.width || 1920,
            height: p.height || 1080,
          }));
        }).catch(() => [])
      );
    }

    searchPromises.push(
      searchPixabayPhotos(q, count * 2).then((photos) =>
        photos.map((p) => ({
          id: p.id || `pixabay_${Math.random()}`,
          url: p.url,
          previewUrl: p.previewUrl || p.url,
          title: p.title || q,
          source: 'pixabay' as const,
          mediaType: 'image' as const,
          width: p.width || 1920,
          height: p.height || 1080,
        }))
      )
    );

    const results = await Promise.allSettled(searchPromises);
    const pool: StockSearchOption[] = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

    return pool.filter((p) => !usedUrls?.has(p.url)).slice(0, count);
  }
}

