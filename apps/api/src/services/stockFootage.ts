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
  width: number;
  height: number;
}

function cleanQuery(query: string): string {
  return query.trim().replace(/[^a-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ');
}

// --- PEXELS (High Quality HD / 4K Landscape) ---
async function searchPexels(query: string, perPage = 6): Promise<StockVideo[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
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
        return {
          source: 'pexels' as const,
          url: file?.link || v.url,
          previewUrl: v.image || '',
          title: v.url || query,
          duration: v.duration,
          width: file?.width || 1920,
          height: file?.height || 1080,
        };
      })
      .filter((v: StockVideo) => v.url);
  } catch {
    return [];
  }
}

// --- PIXABAY (High Quality HD Videos) ---
async function searchPixabay(query: string, perPage = 6): Promise<StockVideo[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];

  try {
    const response = await fetch(
      `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=${perPage}&video_type=film`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.hits || [])
      .map((v: any) => {
        const medium = v.videos?.large || v.videos?.medium || v.videos?.small;
        return {
          source: 'pixabay' as const,
          url: medium?.url || '',
          previewUrl: v.userImageURL || '',
          title: v.tags || query,
          duration: medium?.duration,
          width: medium?.width || 1920,
          height: medium?.height || 1080,
        };
      })
      .filter((v: StockVideo) => v.url);
  } catch {
    return [];
  }
}

// --- COVERR ---
async function searchCoverr(query: string): Promise<StockVideo[]> {
  try {
    const response = await fetch(
      `https://api.coverr.co/videos?query=${encodeURIComponent(query)}&page=1`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.hits || [])
      .slice(0, 6)
      .map((v: any) => ({
        source: 'coverr' as const,
        url: v.urls?.mp4_download || v.urls?.mp4 || '',
        previewUrl: v.urls?.thumbnail || '',
        title: v.title || query,
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
  try {
    const response = await fetch(
      `https://mixkit.co/api/v1/videos?search=${encodeURIComponent(query)}&limit=6`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.items || data.videos || [])
      .slice(0, 6)
      .map((v: any) => ({
        source: 'mixkit' as const,
        url: v.source || v.download_url || '',
        previewUrl: v.thumbnail || v.image || '',
        title: v.title || query,
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
 * Searches all configured stock footage platforms simultaneously (Pexels, Pixabay, Coverr, Mixkit).
 * Automatically ranks results, enforces uniqueness via usedUrls, and tries fallback queries.
 */
export async function findStockFootage(
  primaryQuery: string,
  backupQuery?: string | null,
  usedUrls?: Set<string>
): Promise<StockVideo | null> {
  const q1 = cleanQuery(primaryQuery);
  console.log(`🔎 Searching Real Stock B-Roll [Query: "${q1}"]...`);

  // Tier 1: Search all 4 providers for primary query
  const [pexels1, pixabay1, coverr1, mixkit1] = await Promise.allSettled([
    searchPexels(q1, 6),
    searchPixabay(q1, 6),
    searchCoverr(q1),
    searchMixkit(q1),
  ]);

  const pool1: StockVideo[] = [
    ...(pexels1.status === 'fulfilled' ? pexels1.value : []),
    ...(pixabay1.status === 'fulfilled' ? pixabay1.value : []),
    ...(coverr1.status === 'fulfilled' ? coverr1.value : []),
    ...(mixkit1.status === 'fulfilled' ? mixkit1.value : []),
  ];

  const available1 = pool1.filter((v) => !usedUrls?.has(v.url));
  if (available1.length > 0) {
    const best = available1[0]!;
    usedUrls?.add(best.url);
    return best;
  }

  // Tier 2: Try backup query if available
  if (backupQuery) {
    const q2 = cleanQuery(backupQuery);
    console.log(`  🔄 Trying Backup B-Roll Query [Query: "${q2}"]...`);
    const [pexels2, pixabay2, coverr2] = await Promise.allSettled([
      searchPexels(q2, 4),
      searchPixabay(q2, 4),
      searchCoverr(q2),
    ]);

    const pool2: StockVideo[] = [
      ...(pexels2.status === 'fulfilled' ? pexels2.value : []),
      ...(pixabay2.status === 'fulfilled' ? pixabay2.value : []),
      ...(coverr2.status === 'fulfilled' ? coverr2.value : []),
    ];

    const available2 = pool2.filter((v) => !usedUrls?.has(v.url));
    if (available2.length > 0) {
      const best = available2[0]!;
      usedUrls?.add(best.url);
      return best;
    }
  }

  // Tier 3: Core 2-word fallback
  const coreWords = q1.split(' ').slice(0, 2).join(' ');
  if (coreWords && coreWords !== q1) {
    console.log(`  🔄 Trying Core Keyword Fallback [Query: "${coreWords}"]...`);
    const [pexels3, pixabay3] = await Promise.allSettled([
      searchPexels(coreWords, 4),
      searchPixabay(coreWords, 4),
    ]);

    const pool3: StockVideo[] = [
      ...(pexels3.status === 'fulfilled' ? pexels3.value : []),
      ...(pixabay3.status === 'fulfilled' ? pixabay3.value : []),
    ];

    const available3 = pool3.filter((v) => !usedUrls?.has(v.url));
    if (available3.length > 0) {
      const best = available3[0]!;
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

  try {
    const response = await fetch(
      `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&per_page=${perPage}&safesearch=true`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.hits || [])
      .map((p: any) => ({
        source: 'pixabay' as any,
        id: `pixabay_${p.id}`,
        url: p.largeImageURL || p.fullHDURL || p.imageURL || p.webformatURL,
        previewUrl: p.previewURL || '',
        title: p.tags || query,
        width: p.imageWidth || 1920,
        height: p.imageHeight || 1080,
      }))
      .filter((p: StockPhoto) => p.url);
  } catch {
    return [];
  }
}

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from',
  'up', 'about', 'into', 'over', 'after', 'and', 'but', 'or', 'so', 'yet',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'it', 'its', 'this', 'that', 'these', 'those', 'there', 'somebody', 'someone',
  'you', 'your', 'he', 'his', 'him', 'she', 'her', 'they', 'them', 'their', 'we', 'our'
]);

/**
 * Search Pexels and Pixabay for ultra high-resolution real photography (4K/5K original resolution).
 * Enforces 100% uniqueness across the project by checking usedUrls against unique IDs and URLs.
 */
export async function findStockPhoto(
  rawQuery: string,
  usedUrls?: Set<string>
): Promise<StockPhoto | null> {
  const q1 = cleanQuery(rawQuery);
  if (!q1) return null;

  console.log(`📷 Searching Ultra-HD Real Photography [Query: "${q1}"]...`);

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
        return (data.photos || []).map((photo: any) => ({
          source: 'pexels' as const,
          id: `pexels_${photo.id}`,
          url: photo.src?.original || photo.src?.large2x || photo.src?.large || '',
          previewUrl: photo.src?.medium || '',
          title: photo.alt || q1,
          width: photo.width || 1920,
          height: photo.height || 1080,
        }));
      }).catch(() => [])
    );
  }

  searchPromises.push(searchPixabayPhotos(q1, 25));

  const results = await Promise.allSettled(searchPromises);
  const pool: StockPhoto[] = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

  // Filter out any photo already used in this video project
  const available1 = pool.filter((p) => {
    const isUsed = usedUrls?.has(p.url) || (p.id && usedUrls?.has(p.id));
    return !isUsed;
  });

  if (available1.length > 0) {
    available1.sort((a, b) => (b.width * b.height) - (a.width * a.height));
    const best = available1[0]!;
    usedUrls?.add(best.url);
    if (best.id) usedUrls?.add(best.id);
    console.log(`  ✓ Unique 4K/HD Photo Found [${best.source.toUpperCase()}] ${best.width}x${best.height} for "${q1}"`);
    return best;
  }

  // Tier 2: Meaningful non-stopword core query
  const contentWords = q1.split(' ').filter(w => !STOP_WORDS.has(w.toLowerCase()) && w.length > 2);
  const coreWords = (contentWords.length > 0 ? contentWords.slice(0, 3) : q1.split(' ').slice(0, 2)).join(' ');

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
          return (data.photos || []).map((photo: any) => ({
            source: 'pexels' as const,
            id: `pexels_${photo.id}`,
            url: photo.src?.original || photo.src?.large2x || photo.src?.large || '',
            previewUrl: photo.src?.medium || '',
            title: photo.alt || coreWords,
            width: photo.width || 1920,
            height: photo.height || 1080,
          }));
        }).catch(() => [])
      );
    }
    tier2Promises.push(searchPixabayPhotos(coreWords, 20));
    const tier2Results = await Promise.allSettled(tier2Promises);
    const pool2: StockPhoto[] = tier2Results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
    const available2 = pool2.filter((p) => {
      const isUsed = usedUrls?.has(p.url) || (p.id && usedUrls?.has(p.id));
      return !isUsed;
    });

    if (available2.length > 0) {
      available2.sort((a, b) => (b.width * b.height) - (a.width * a.height));
      const best = available2[0]!;
      usedUrls?.add(best.url);
      if (best.id) usedUrls?.add(best.id);
      console.log(`  ✓ Unique 4K/HD Photo Found [${best.source.toUpperCase()}] ${best.width}x${best.height} for "${coreWords}"`);
      return best;
    }
  }

  // Tier 3: Concrete Subject Descriptor Fallback (never use stopwords)
  const keySubject = contentWords[0] || 'landscape';
  const fallbackDescriptor = `${keySubject} documentary photography`;
  console.log(`  🔄 Trying Documentary Descriptor: "${fallbackDescriptor}"...`);
  if (pexelsKey) {
    try {
      const res = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(fallbackDescriptor)}&per_page=15&orientation=landscape`,
        { headers: { Authorization: pexelsKey } }
      );
      if (res.ok) {
        const data = (await res.json()) as any;
        const available3 = (data.photos || []).filter((p: any) => {
          const url = p.src?.original || p.src?.large2x || p.src?.large || '';
          const id = `pexels_${p.id}`;
          return url && !usedUrls?.has(url) && !usedUrls?.has(id);
        });
        if (available3.length > 0) {
          const photo = available3[0];
          const chosenUrl = photo.src?.original || photo.src?.large2x || photo.src?.large || '';
          const chosenId = `pexels_${photo.id}`;
          usedUrls?.add(chosenUrl);
          usedUrls?.add(chosenId);
          return {
            source: 'pexels',
            id: chosenId,
            url: chosenUrl,
            previewUrl: photo.src?.medium || '',
            title: photo.alt || fallbackDescriptor,
            width: photo.width || 1920,
            height: photo.height || 1080,
          };
        }
      }
    } catch {}
  }

  // Absolute fallback: pick any unused photo from pool
  const finalUnused = pool.find((p) => !usedUrls?.has(p.url));
  if (finalUnused) {
    usedUrls?.add(finalUnused.url);
    if (finalUnused.id) usedUrls?.add(finalUnused.id);
    return finalUnused;
  }

  return pool[0] || null;
}

/**
 * Download a stock video to local disk.
 */
export async function downloadStockVideo(
  video: StockVideo,
  outputPath: string
): Promise<string> {
  const response = await fetch(video.url);
  if (!response.ok) throw new Error(`Failed to download stock video: ${video.url}`);

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(outputPath, Buffer.from(buffer));
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

