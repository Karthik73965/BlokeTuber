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
}

export interface StockPhoto {
  source: 'pexels';
  url: string; // full-resolution download URL
  previewUrl: string;
  title: string;
  width: number;
  height: number;
}

/**
 * Format search queries to strictly enforce American/USA aesthetic and High Quality visuals.
 */
function buildUsaStockQuery(rawQuery: string): string {
  const clean = rawQuery.trim().replace(/[^a-zA-Z0-9 ]/g, '');
  if (/usa|american|us\b/i.test(clean)) {
    return clean;
  }
  return `${clean} USA American`;
}

// --- PEXELS (High Quality HD / 4K Landscape) ---
async function searchPexels(query: string, perPage = 5): Promise<StockVideo[]> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return [];

  const response = await fetch(
    `https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${perPage}&orientation=landscape`,
    { headers: { Authorization: apiKey } }
  );
  if (!response.ok) return [];
  const data = (await response.json()) as any;

  return (data.videos || []).map((v: any) => {
    // Select highest resolution HD video file (1080p / 4K)
    const file = v.video_files?.find((f: any) => f.quality === 'hd' && f.width >= 1280) ||
                 v.video_files?.find((f: any) => f.quality === 'hd') ||
                 v.video_files?.[0];
    return {
      source: 'pexels' as const,
      url: file?.link || v.url,
      previewUrl: v.image || '',
      title: v.url || query,
      duration: v.duration,
    };
  }).filter((v: StockVideo) => v.url);
}

// --- PIXABAY ---
async function searchPixabay(query: string, perPage = 5): Promise<StockVideo[]> {
  const apiKey = process.env.PIXABAY_API_KEY;
  if (!apiKey) return [];

  const response = await fetch(
    `https://pixabay.com/api/videos/?key=${apiKey}&q=${encodeURIComponent(query)}&per_page=${perPage}&video_type=film`
  );
  if (!response.ok) return [];
  const data = (await response.json()) as any;

  return (data.hits || []).map((v: any) => {
    const medium = v.videos?.large || v.videos?.medium || v.videos?.small;
    return {
      source: 'pixabay' as const,
      url: medium?.url || '',
      previewUrl: v.userImageURL || '',
      title: v.tags || query,
      duration: medium?.duration,
    };
  }).filter((v: StockVideo) => v.url);
}

// --- COVERR ---
async function searchCoverr(query: string): Promise<StockVideo[]> {
  try {
    const response = await fetch(
      `https://api.coverr.co/videos?query=${encodeURIComponent(query)}&page=1`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.hits || []).slice(0, 5).map((v: any) => ({
      source: 'coverr' as const,
      url: v.urls?.mp4_download || v.urls?.mp4 || '',
      previewUrl: v.urls?.thumbnail || '',
      title: v.title || query,
      duration: v.duration,
    })).filter((v: StockVideo) => v.url);
  } catch {
    return [];
  }
}

// --- MIXKIT ---
async function searchMixkit(query: string): Promise<StockVideo[]> {
  try {
    const response = await fetch(
      `https://mixkit.co/api/v1/videos?search=${encodeURIComponent(query)}&limit=5`
    );
    if (!response.ok) return [];
    const data = (await response.json()) as any;

    return (data.items || data.videos || []).slice(0, 5).map((v: any) => ({
      source: 'mixkit' as const,
      url: v.source || v.download_url || '',
      previewUrl: v.thumbnail || v.image || '',
      title: v.title || query,
      duration: v.duration,
    })).filter((v: StockVideo) => v.url);
  } catch {
    return [];
  }
}

/**
 * Search all configured stock footage platforms with American / USA context queries.
 * Falls back to a broader query on retry.
 */
export async function findStockFootage(
  rawQuery: string,
  retry = false
): Promise<StockVideo | null> {
  const usaQuery = buildUsaStockQuery(rawQuery);
  const label = retry ? `[RETRY] "${rawQuery}"` : `"${usaQuery}"`;
  console.log(`🔎 Searching Stock Footage [Query: ${label}]...`);

  const queryToUse = retry ? rawQuery : usaQuery;

  const [pexels1, pixabay1, pexels2, pixabay2] = await Promise.allSettled([
    searchPexels(queryToUse, 3),
    searchPixabay(queryToUse, 3),
    searchPexels(rawQuery, 3),
    searchPixabay(rawQuery, 3),
  ]);

  const allResults: StockVideo[] = [
    ...(pexels1.status === 'fulfilled' ? pexels1.value : []),
    ...(pixabay1.status === 'fulfilled' ? pixabay1.value : []),
    ...(pexels2.status === 'fulfilled' ? pexels2.value : []),
    ...(pixabay2.status === 'fulfilled' ? pixabay2.value : []),
  ];

  return allResults[0] || null;
}

/**
 * Search Pexels Photos API for a high-quality still image.
 */
export async function findStockPhoto(rawQuery: string): Promise<StockPhoto | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    console.warn('[StockPhoto] PEXELS_API_KEY not set — cannot search for photos.');
    return null;
  }

  const query = encodeURIComponent(rawQuery.trim());
  console.log(`📷 Searching Pexels Photos [Query: "${rawQuery}"]...`);

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${query}&per_page=5&orientation=landscape`,
      { headers: { Authorization: apiKey } }
    );
    if (!response.ok) return null;

    const data = (await response.json()) as any;
    const photo = data.photos?.[0];
    if (!photo) return null;

    return {
      source: 'pexels',
      url: photo.src?.original || photo.src?.large2x || photo.src?.large || '',
      previewUrl: photo.src?.medium || '',
      title: photo.alt || rawQuery,
      width: photo.width || 1920,
      height: photo.height || 1080,
    };
  } catch {
    return null;
  }
}

/**
 * Download a stock video to the local filesystem.
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
 * Download a stock photo to the local filesystem.
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
