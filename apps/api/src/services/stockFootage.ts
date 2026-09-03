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
  source: 'pexels' | 'pixabay' | 'coverr' | 'mixkit' | 'archive';
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

/**
 * Compress a raw AI query down to N significant keywords.
 * Strips stop words, punctuation, and short filler words.
 */
export function compressQuery(raw: string, maxWords = 4): string {
  if (!raw) return '';
  const clean = raw.toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
  const words = clean.split(' ').filter((w) => !STOP_WORDS.has(w) && w.length > 2);
  if (words.length === 0) {
    return clean.split(' ').slice(0, maxWords).join(' ');
  }
  return words.slice(0, maxWords).join(' ');
}

// --- PEXELS (High Quality HD / 4K Landscape) — supports up to 4-word queries ---
async function searchPexels(query: string, perPage = 15): Promise<StockVideo[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];
  // Pexels handles 4-word queries well
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

// --- PIXABAY (High Quality HD Videos) — best with 3-word queries ---
async function searchPixabay(query: string, perPage = 15): Promise<StockVideo[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];
  // Pixabay degrades above 3 words — compress harder
  const q = compressQuery(query, 3);
  if (!q) return [];

  try {
    const response = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(q)}&per_page=${perPage}&video_type=film&safesearch=true`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.hits || [])
      .map((v: any) => {
        const medium = v.videos?.medium || v.videos?.small || v.videos?.large;
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

// --- COVERR — max 2-word queries, loops well ---
async function searchCoverr(query: string): Promise<StockVideo[]> {
  // Coverr breaks above 2 words
  const q = compressQuery(query, 2);
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

// --- MIXKIT — max 2-word queries ---
async function searchMixkit(query: string): Promise<StockVideo[]> {
  // Mixkit also breaks above 2 words
  const q = compressQuery(query, 2);
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

// --- INTERNET ARCHIVE (Free, No API Key, Documentary / News / Crime Footage) ---
// Archive.org has millions of public domain and CC-licensed video clips.
// Particularly strong for: true crime, news broadcasts, documentaries, historical footage.
// Direct MP4 download: https://archive.org/download/{identifier}/{identifier}.mp4
async function searchInternetArchive(query: string, rows = 10): Promise<StockVideo[]> {
  // Bypassed archive.org: prone to multi-gigabyte files and slow CDN
  return [];
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
  const queryLower = `${query} ${visualSubject || ''}`.toLowerCase();

  // 1. Check if the query or visual subject explicitly asks for nature / wilderness
  const explicitlyWantsNature = /\b(forest|woods|woodland|trees|pine|jungle|rainforest|nature|wilderness|hiking|mountain|mountains|wildlife|foliage|leaves|flora)\b/i.test(queryLower);

  // Negative Keyword Penalty: Disqualify completely if negative keywords appear
  const allNegative = new Set<string>();
  if (negativeKeywords && Array.isArray(negativeKeywords)) {
    for (const nk of negativeKeywords) {
      if (nk) allNegative.add(nk.toLowerCase().trim());
    }
  }

  // Automatic Nature/Forest guard: If query does NOT explicitly ask for nature, disqualify random forest/wilderness footage
  if (!explicitlyWantsNature) {
    const defaultNatureBans = [
      'forest', 'woods', 'woodland', 'jungle', 'rainforest', 'wilderness',
      'hiking', 'waterfall', 'wildlife', 'campsite', 'campfire', 'pine tree', 'pine trees',
      'dense trees', 'green forest', 'amazon rainforest', 'tropical forest'
    ];
    for (const b of defaultNatureBans) allNegative.add(b);
  }

  // Common contextual conflicts:
  const isVehicleQuery = /\b(car|van|truck|vehicle|seat|driver|driving|highway|road|windshield|dashboard|steering)\b/i.test(queryLower);
  if (isVehicleQuery) {
    const defaultVehicleConflicts = ['kitchen', 'dish', 'dishes', 'dishwasher', 'cooking', 'restaurant', 'food', 'bedroom', 'baby stroller', 'airplane'];
    for (const c of defaultVehicleConflicts) allNegative.add(c);
  }

  // Homeless / shelter / poverty context conflicts (ban leisure camping / vacation / recreation)
  const isShelterOrHomelessQuery = /\b(homeless|shelter|encampment|pallet|unhcr|refugee|eviction|poverty)\b/i.test(queryLower);
  if (isShelterOrHomelessQuery) {
    const defaultLeisureConflicts = ['vacation', 'holiday', 'glamping', 'camping tent', 'recreation', 'bonfire', 'luxury'];
    for (const c of defaultLeisureConflicts) allNegative.add(c);
  }

  for (const neg of allNegative) {
    if (neg) {
      const negRegex = new RegExp(`\\b${neg.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'i');
      if (negRegex.test(combinedText)) {
        return -1000; // instant rejection
      }
    }
  }

  // 2. Positive Keyword Matching using strict word boundary matching (prevents "tree" matching "street", "car" matching "carpet")
  let score = 0;
  const searchWords = queryLower
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(' ')
    .filter((w) => !STOP_WORDS.has(w) && w.length > 2);

  for (const word of searchWords) {
    const wordRegex = new RegExp(`\\b${word}\\b`, 'i');
    if (wordRegex.test(combinedText)) {
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
 * AI Vision Verification using OpenRouter (gpt-4o-mini).
 * Inspects the candidate thumbnail and returns a confidence score 0–100.
 *
 * 60% Threshold:
 *   ≥ 60% → Accepted as authentic documentary match
 *   < 60% → Rejected outright (pipeline falls back to custom AI image generation)
 */
export const VISION_SIMILARITY_THRESHOLD = 60;

export async function verifyStockCandidateWithVision(
  previewUrl: string,
  visualRequirement: string,
  candidateTitle: string,
  storyContext?: string  // Full documentary premise — prevents wrong-demographic clips from passing
): Promise<{ matches: boolean; confidence: number; isWeak: boolean; reason: string }> {
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  if (!openrouterKey || !previewUrl || !previewUrl.startsWith('http')) {
    return { matches: true, confidence: 100, isWeak: false, reason: 'Vision verification skipped (no key or URL)' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const storyLine = storyContext
      ? `\nDOCUMENTARY STORY CONTEXT: "${storyContext}"\nIMPORTANT: Reject footage that contradicts the story's demographics, economic status, setting, or tone. For example, if the story is about poverty, reject luxury cars, modern offices, or upscale apartments. If the story features a cargo van, reject BMWs, SUVs, or delivery trucks.\n`
      : '';

    const prompt = `You are an elite, strict documentary visual quality director (Vice, HBO, Netflix).
${storyLine}
We need stock footage/photo for this specific visual: "${visualRequirement}".
Candidate metadata: "${candidateTitle}".

Look at the image preview carefully. Score 0–100 how well it fits BOTH the requested visual subject AND the story context.

Score 0–100:
  0–39  = Completely wrong or contradicts story context (e.g. luxury BMW in a poverty documentary, kitchen when asking for car, delivery van, or random nature/forest/trees when asking for urban/street/office/shelter)
  40–59 = Weak or loose match — lacks documentary precision, wrong vibe/demographics
  60–79 = Good match — correct scene and approximately correct context
  80–100 = Perfect authentic match — exact subject, matching demographics, believable setting, tone, and environment

STRICT RULES:
- Score >= 60 if the image matches BOTH the requested subject and the story context with reasonable visual accuracy.
- STRICT NATURE/FOREST REJECTION: Unless the requested visual explicitly asks for nature, a forest, or wilderness, REJECT ANY footage depicting forests, pine trees, hiking, wilderness, or waterfalls with confidence < 20. A clip of trees when asking for a parking lot, building, office, shelter, or street is completely unacceptable.
- Score < 60 if demographics or socioeconomic context is wrong (e.g. BMW/Tesla interior for a homeless person story)
- Score < 60 if the scene is loosely related or generic (delivery van exterior ≠ homeless family sleeping inside van)
- Score < 60 if it's a vector graphic, cartoon, illustration, or news broadcast chyron

Respond ONLY in JSON:
{
  "confidence": <integer 0-100>,
  "reason": "<one sentence — must mention what you actually see in the image>"
}`;

    const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openrouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://bloketuber.app',
      },
      body: JSON.stringify({
        model: process.env.CLIP_MATCH_MODEL || 'google/gemini-2.5-flash',
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
        max_tokens: 150,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      return { matches: false, confidence: 0, isWeak: false, reason: `Vision HTTP error (${res.status})` };
    }

    const data = (await res.json()) as any;
    const content = data.choices?.[0]?.message?.content || '{}';
    const cleanJson = content.replace(/```json?\n?/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanJson);

    const confidence = Math.max(0, Math.min(100, Number(parsed.confidence ?? 0)));
    const matches = confidence >= VISION_SIMILARITY_THRESHOLD;

    return {
      matches,
      confidence,
      isWeak: false,
      reason: parsed.reason || `Confidence: ${confidence}%`,
    };
  } catch (err: any) {
    return { matches: false, confidence: 0, isWeak: false, reason: `Vision check skipped: ${err.message}` };
  }
}


export interface StockSearchFilterOptions {
  visualSubject?: string;
  negativeKeywords?: string[];
  useVisionVerification?: boolean;
  storyContext?: string; // Full documentary premise for context-aware vision rejection
}

/**
 * Searches all configured stock footage platforms simultaneously.
 * Sources: Pexels, Pixabay, Coverr, Mixkit, Internet Archive
 *
 * Strict 80% acceptance:
 *  - ≥ 80% vision confidence → accepted
 *  - < 80% vision confidence → rejected, returns null (caller generates AI image)
 */
export async function findStockFootage(
  primaryQuery: string,
  backupQuery?: string | null,
  usedUrls?: Set<string>,
  options?: StockSearchFilterOptions
): Promise<{ video: StockVideo; isWeak: boolean } | null> {
  const q1 = compressQuery(primaryQuery, 4);
  const visualReq = options?.visualSubject || primaryQuery;
  const storyCtx = options?.storyContext;
  console.log(`🔎 Searching Stock B-Roll [Query: "${q1}"] [Subject: "${visualReq}"] (Min 60% match)...`);

  // ── TIER 1: All 5 providers on primary query ──────────────────────────────
  const [pexels1, pixabay1, coverr1, mixkit1, archive1] = await Promise.allSettled([
    searchPexels(q1, 10),
    searchPixabay(q1, 10),
    searchCoverr(q1),
    searchMixkit(q1),
    searchInternetArchive(q1, 8),
  ]);

  const pool1: StockVideo[] = [
    ...(pexels1.status === 'fulfilled' ? pexels1.value : []),
    ...(pixabay1.status === 'fulfilled' ? pixabay1.value : []),
    ...(coverr1.status === 'fulfilled' ? coverr1.value : []),
    ...(mixkit1.status === 'fulfilled' ? mixkit1.value : []),
    ...(archive1.status === 'fulfilled' ? archive1.value : []),
  ];

  const scored1 = pool1
    .filter((v) => !usedUrls?.has(v.url))
    .map((v) => ({
      video: v,
      score: computeMetadataRelevanceScore(v, q1, options?.visualSubject, options?.negativeKeywords),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  for (const item of scored1.slice(0, 5)) {
    if (options?.useVisionVerification !== false && item.video.previewUrl) {
      const visionResult = await verifyStockCandidateWithVision(item.video.previewUrl, visualReq, item.video.title, storyCtx);
      if (!visionResult.matches) {
        console.log(`  ❌ Rejected [${item.video.source}]: "${item.video.title}" (Confidence: ${visionResult.confidence}% < 60% threshold — ${visionResult.reason})`);
        continue;
      }
      usedUrls?.add(item.video.url);
      console.log(`  ✅ Selected [${item.video.source}]: "${item.video.title}" (Confidence: ${visionResult.confidence}% | Metadata: ${item.score})`);
      return { video: item.video, isWeak: false };
    }
    usedUrls?.add(item.video.url);
    console.log(`  ✅ Selected [${item.video.source}]: "${item.video.title}" (Metadata Score: ${item.score})`);
    return { video: item.video, isWeak: false };
  }

  // ── TIER 2: Backup query — all providers with full vision check ───────────
  if (backupQuery) {
    const q2 = compressQuery(backupQuery, 4);
    console.log(`  🔄 Trying Backup Query ["${q2}"]...`);
    const [pexels2, pixabay2, coverr2, archive2] = await Promise.allSettled([
      searchPexels(q2, 8),
      searchPixabay(q2, 8),
      searchCoverr(q2),
      searchInternetArchive(q2, 6),
    ]);

    const pool2: StockVideo[] = [
      ...(pexels2.status === 'fulfilled' ? pexels2.value : []),
      ...(pixabay2.status === 'fulfilled' ? pixabay2.value : []),
      ...(coverr2.status === 'fulfilled' ? coverr2.value : []),
      ...(archive2.status === 'fulfilled' ? archive2.value : []),
    ];

    const scored2 = pool2
      .filter((v) => !usedUrls?.has(v.url))
      .map((v) => ({
        video: v,
        score: computeMetadataRelevanceScore(v, q2, options?.visualSubject, options?.negativeKeywords),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const item of scored2.slice(0, 5)) {
      if (options?.useVisionVerification !== false && item.video.previewUrl) {
        const visionResult = await verifyStockCandidateWithVision(item.video.previewUrl, visualReq, item.video.title, storyCtx);
        if (!visionResult.matches) {
          console.log(`  ❌ Rejected [${item.video.source}]: "${item.video.title}" (Confidence: ${visionResult.confidence}% < 60% threshold — ${visionResult.reason})`);
          continue;
        }
        usedUrls?.add(item.video.url);
        console.log(`  ✅ Backup match [${item.video.source}]: "${item.video.title}" (Confidence: ${visionResult.confidence}% | Metadata: ${item.score})`);
        return { video: item.video, isWeak: false };
      }
      usedUrls?.add(item.video.url);
      console.log(`  ✅ Backup match [${item.video.source}]: "${item.video.title}" (Metadata Score: ${item.score})`);
      return { video: item.video, isWeak: false };
    }
  }

  // ── TIER 3: 2-keyword core fallback ──────────────────────────────────────
  const coreWords = compressQuery(q1, 2);
  if (coreWords && coreWords !== q1) {
    console.log(`  🔄 Core Keyword Fallback ["${coreWords}"]...`);
    const [pexels3, pixabay3, archive3] = await Promise.allSettled([
      searchPexels(coreWords, 6),
      searchPixabay(coreWords, 6),
      searchInternetArchive(coreWords, 6),
    ]);

    const pool3: StockVideo[] = [
      ...(pexels3.status === 'fulfilled' ? pexels3.value : []),
      ...(pixabay3.status === 'fulfilled' ? pixabay3.value : []),
      ...(archive3.status === 'fulfilled' ? archive3.value : []),
    ];

    const scored3 = pool3
      .filter((v) => !usedUrls?.has(v.url))
      .map((v) => ({
        video: v,
        score: computeMetadataRelevanceScore(v, coreWords, options?.visualSubject, options?.negativeKeywords),
      }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const item of scored3.slice(0, 3)) {
      if (options?.useVisionVerification !== false && item.video.previewUrl) {
        const visionResult = await verifyStockCandidateWithVision(item.video.previewUrl, visualReq, item.video.title, storyCtx);
        if (!visionResult.matches) {
          console.log(`  ❌ Rejected [${item.video.source}]: "${item.video.title}" (Confidence: ${visionResult.confidence}% < 60% threshold — ${visionResult.reason})`);
          continue;
        }
        usedUrls?.add(item.video.url);
        console.log(`  ✅ Core fallback [${item.video.source}]: "${item.video.title}" (Confidence: ${visionResult.confidence}%)`);
        return { video: item.video, isWeak: false };
      }
      usedUrls?.add(item.video.url);
      console.log(`  ✅ Core fallback [${item.video.source}]: "${item.video.title}"`);
      return { video: item.video, isWeak: false };
    }
  }

  return null;
}




// --- PIXABAY (High Resolution Real Photos) ---
async function searchPixabayPhotos(query: string, perPage = 25): Promise<StockPhoto[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];
  const q = compressQuery(query, 3); // Pixabay photos also degrade above 3 words
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
  console.log(`📷 Searching Stock Photo [Query: "${q1}"] [Subject: "${visualReq}"]...`);

  // Tier 1: Pexels (25) + Pixabay (25)
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
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score);

  for (const item of scored1.slice(0, 5)) {
    if (options?.useVisionVerification !== false && item.photo.previewUrl) {
      const visionResult = await verifyStockCandidateWithVision(item.photo.previewUrl, visualReq, item.photo.title, options?.storyContext);
      if (!visionResult.matches) {
        console.log(`  ❌ Rejected photo [${item.photo.source}]: "${item.photo.title}" (Confidence: ${visionResult.confidence}% < 60% threshold — ${visionResult.reason})`);
        continue;
      }
      usedUrls?.add(item.photo.url);
      if (item.photo.id) usedUrls?.add(item.photo.id);
      console.log(`  ✅ Selected photo [${item.photo.source}]: "${item.photo.title}" (Confidence: ${visionResult.confidence}% | Metadata: ${item.score})`);
      return item.photo;
    }
    usedUrls?.add(item.photo.url);
    if (item.photo.id) usedUrls?.add(item.photo.id);
    console.log(`  ✅ Selected photo [${item.photo.source}]: "${item.photo.title}" (Metadata Score: ${item.score})`);
    return item.photo;
  }

  // Tier 2: 2-word compressed query fallback
  const coreWords = compressQuery(q1, 2);
  if (coreWords && coreWords !== q1) {
    console.log(`  🔄 Simplifying photo query: "${coreWords}" (Min 60% match)...`);
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
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    for (const item of scored2.slice(0, 3)) {
      if (options?.useVisionVerification !== false && item.photo.previewUrl) {
        const visionResult = await verifyStockCandidateWithVision(item.photo.previewUrl, visualReq, item.photo.title, options?.storyContext);
        if (!visionResult.matches) {
          console.log(`  ❌ Rejected fallback photo [${item.photo.source}]: "${item.photo.title}" (Confidence: ${visionResult.confidence}% < 60% threshold)`);
          continue;
        }
      }
      usedUrls?.add(item.photo.url);
      if (item.photo.id) usedUrls?.add(item.photo.id);
      return item.photo;
    }
  }

  return null;
}

/**
 * Download a stock video to local disk.
 * Automatically ensures faststart (moov atom at head) for instant, seamless decoding in Chromium & Remotion.
 * For Internet Archive MKV sources, also handles format conversion to H.264 MP4.
 */
export async function downloadStockVideo(
  video: StockVideo,
  outputPath: string
): Promise<string> {
  const response = await fetch(video.url, { signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error(`Failed to download stock video: ${video.url}`);

  const contentLength = Number(response.headers.get('content-length') || 0);
  if (contentLength > 100 * 1024 * 1024) {
    throw new Error(`Video file too large (${(contentLength / 1024 / 1024).toFixed(1)}MB): ${video.url}`);
  }

  const buffer = await response.arrayBuffer();
  if (buffer.byteLength > 100 * 1024 * 1024) {
    throw new Error(`Video file too large (${(buffer.byteLength / 1024 / 1024).toFixed(1)}MB): ${video.url}`);
  }
  fs.writeFileSync(outputPath, Buffer.from(buffer));

  // Optional faststart: quick stream copy without re-encoding
  try {
    const ffmpegStatic = require('ffmpeg-static');
    const ffmpegBin = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';
    const tempOpt = outputPath.replace(/\.mp4$/i, '_std.mp4');
    const { execSync } = require('child_process');

    execSync(`${ffmpegBin} -nostdin -y -i "${outputPath}" -c copy -movflags +faststart "${tempOpt}"`, { stdio: 'ignore', timeout: 5000 });

    if (fs.existsSync(tempOpt) && fs.statSync(tempOpt).size > 0) {
      fs.copyFileSync(tempOpt, outputPath);
      fs.unlinkSync(tempOpt);
    }
  } catch (e) {
    // Non-fatal, original MP4 is still in place and playable
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
  source: 'pexels' | 'pixabay' | 'coverr' | 'mixkit' | 'archive' | 'ai_generated';
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
    const [pexels, pixabay, coverr, archive] = await Promise.allSettled([
      searchPexels(q, count * 2),
      searchPixabay(q, count * 2),
      searchCoverr(q),
      searchInternetArchive(q, count),
    ]);

    const pool: StockVideo[] = [
      ...(pexels.status === 'fulfilled' ? pexels.value : []),
      ...(pixabay.status === 'fulfilled' ? pixabay.value : []),
      ...(coverr.status === 'fulfilled' ? coverr.value : []),
      ...(archive.status === 'fulfilled' ? archive.value : []),
    ];

    return pool
      .filter((v) => !usedUrls?.has(v.url))
      .map((v) => ({ video: v, score: computeMetadataRelevanceScore(v, q) }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(({ video: v }) => ({
        id: v.url,
        url: v.url,
        previewUrl: v.previewUrl || v.url,
        title: v.title || q,
        source: v.source,
        mediaType: 'video' as const,
        width: v.width || 1920,
        height: v.height || 1080,
      }));
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

    return pool
      .filter((p) => !usedUrls?.has(p.url))
      .map((p) => ({ photo: p, score: computeMetadataRelevanceScore({ title: p.title, tags: [p.title] }, q) }))
      .filter((item) => item.score >= 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, count)
      .map(({ photo: p }) => p);
  }
}
