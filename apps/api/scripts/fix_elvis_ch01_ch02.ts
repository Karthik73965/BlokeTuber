import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

// Load env first, before importing anything that depends on it
const envPath = path.resolve('C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\.env');
dotenv.config({ path: envPath });
// Also try local cwd-relative fallback paths
const fallbackPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of fallbackPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

import {
  findStockFootage,
  downloadStockVideo,
  findStockPhoto,
  downloadStockPhoto,
} from '../src/services/stockFootage';

// ─── Config ────────────────────────────────────────────────────────────────────
const ELVIS_TIMELINE_DIR =
  'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\timelines\\elvis';
const STOCK_OUTPUT_DIR =
  'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\stock\\elvis';
const STORY_CTX =
  'Elvis Summers documentary - man who built tiny home for homeless woman Irene Smokey McGee in South Los Angeles';

// Ensure output directory exists
if (!fs.existsSync(STOCK_OUTPUT_DIR)) {
  fs.mkdirSync(STOCK_OUTPUT_DIR, { recursive: true });
  console.log(`📁 Created stock output directory: ${STOCK_OUTPUT_DIR}`);
}

// ─── Beat Decision Tables ────────────────────────────────────────────────────

// Chapter 01: 24 beats, 12 raw (keep) / 12 stock (replace)
// key = beatIndex, value = null means KEEP, string means query to replace with
const CH01_DECISIONS: Record<number, string | null> = {
  0:  null, // OLD WOMAN.mp4 → KEEP (Irene Smokey McGee directly shown)
  1:  '"Los Angeles aerial downtown skyline"',   // REPLACE — South LA location b-roll
  2:  null, // Tents in the sidewalk.mp4 → KEEP (tent life directly described)
  3:  null, // inside the tent.mp4 → KEEP (tent interior directly shown)
  4:  null, // OLD WOMAN.mp4 → KEEP (Irene, everyone knew her name)
  5:  '"kids walking school urban street USA"',  // REPLACE — kids waving on way to school
  6:  null, // Tents in the sidewalk.mp4 → KEEP (community on the street)
  7:  '"suburban house door locked evening"',    // REPLACE — neighbors went inside, locked doors
  8:  '"residential neighborhood night houses"', // REPLACE — locked doors, heaters, left her out
  9:  '"homelessness USA poverty urban encampment"', // REPLACE — what country quietly agreed to
  10: '"Los Angeles county map urban poverty"',  // REPLACE — regional overview
  11: '"homeless person walking urban sidewalk evening"', // REPLACE — walk past in the evening
  12: null, // elvis buiding house.mp4 → KEEP (one guy decided to act - introduces Elvis)
  13: null, // elvis buiding house.mp4 → KEEP (no nonprofit/grant - shows building)
  14: null, // elvis buiding house.mp4 → KEEP ($450 hardware trip)
  15: '"city planning government document paperwork"', // REPLACE — stubbornness in city planning doc
  16: null, // OLD WOMAN.mp4 → KEEP (grandmother called Smokey)
  17: null, // Door of tiny home.png → KEEP (door that locked, roof that didn't leak)
  18: null, // Door of tiny home.png → KEEP (hand-painted sign Home Sweet Home)
  19: null, // elvis buiding house.mp4 → KEEP (video of him building - 5.5M views)
  20: '"social media phone viral video watching"', // REPLACE — five and a half million times
  21: '"Los Angeles city hall government building"', // REPLACE — what city did when it found out
  22: '"crowdfunding online donation laptop community"', // REPLACE — thousands of ordinary people
  23: '"documentary filmmaker camera storytelling"', // REPLACE — better story - closing beat
};

// Chapter 02: 32 beats, ~10 raw / ~22 stock (70/30)
// Beats to KEEP as raw (10 beats):
// 0: elvis buiding house → KEEP (one man with circular saw)
// 5: Tinu Hose build by ELVIS.mp4 → KEEP (tens of thousands - already has Elvis footage label)
// 11: Elvis elevation.mp4 → KEEP (one of the most visible humanitarian situations - keeps Elvis)
// 14: Elvis wallkig to but=ld house → KEEP (committee, line item - Elvis walking)
// 18: Tinu Hose build by ELVIS.mp4 → KEEP (Smokey/Irene directly referenced)
// 21: Elvis elevation.mp4 → KEEP (what finally broke something loose)
// 22: elvis buiding house → KEEP (something closer to anger - Elvis building)
// 26: elvis buiding house → KEEP (he went to the hardware store)
// 28: Tinu Hose build by ELVIS.mp4 → KEEP (built on wheels outside his front door)
// 30: elvis buiding house → KEEP (filmed the whole build)
const CH02_DECISIONS: Record<number, string | null> = {
  0:  null, // elvis buiding house → KEEP (circular saw intro)
  1:  '"Los Angeles city hall government building"', // REPLACE — $2B city plan
  2:  '"homeless encampment urban USA scale"',  // REPLACE — size of the problem
  3:  '"homeless population USA statistic data"', // REPLACE — 745,000 federal count
  4:  '"Los Angeles homeless encampment street"', // REPLACE — 75,000 in LA county
  5:  null, // Tinu Hose build by ELVIS → KEEP (tens of thousands with nothing)
  6:  '"urban poverty eviction USA street"',    // REPLACE — 150,000 kids, tent city
  7:  '"homeless camp urban USA sidewalk"',     // REPLACE — students sleeping rough
  8:  '"Los Angeles economy jobs housing"',     // REPLACE — LA economy fastest growing
  9:  '"construction worker housing apartment building"', // REPLACE — 500 units a day needed
  10: '"government official meeting city council"', // REPLACE — city building nothing near enough
  11: null, // Elvis elevation.mp4 → KEEP (most visible humanitarian situations)
  12: '"construction tools wood plywood hardware store"', // REPLACE — numbers that make person feel powerless
  13: '"hardware store lumber building materials"', // REPLACE — hand it off, look away
  14: null, // Elvis wallkig to but=ld house → KEEP (committee, line item in budget)
  15: '"small business owner tools workshop"',  // REPLACE — Elvis used his own savings
  16: '"construction worker measuring wood"',   // REPLACE — started building in his driveway
  17: '"timelapse construction building assembly"', // REPLACE — 48 hours later
  18: null, // Tinu Hose build by ELVIS → KEEP (Irene/Smokey dirt a few doors down)
  19: '"small wooden shed tiny structure outdoor"', // REPLACE — 8 foot by 4 foot structure
  20: '"carpenter woodworking tools DIY"',      // REPLACE — wheels, locks, weatherproof
  21: null, // Elvis elevation.mp4 → KEEP (broke something loose - not sadness)
  22: null, // elvis buiding house → KEEP (something closer to anger)
  23: '"urban neighborhood residential street"', // REPLACE — everyone on block knew her
  24: '"elderly woman shelter housing poor USA"', // REPLACE — himself included, done nothing
  25: '"Los Angeles city ordinance law enforcement"', // REPLACE — stopped walking
  26: null, // elvis buiding house → KEEP (went to hardware store, spent under $500)
  27: '"social media phone film documentary"',  // REPLACE — hinges, lock, lumber - specs
  28: null, // Tinu Hose build by ELVIS → KEEP (on wheels outside his front door)
  29: '"viral video online community response"', // REPLACE — window, just enough space
  30: null, // elvis buiding house → KEEP (filmed the whole build)
  31: '"crowdfunding donation gofundme online"', // REPLACE — money started pouring in
};

// Backup queries for when primary fails
const CH01_BACKUP: Record<number, string> = {
  1:  'Los Angeles aerial city',
  5:  'kids school street morning',
  7:  'neighborhood night residential',
  8:  'houses night city',
  9:  'homeless street urban USA',
  10: 'Los Angeles city downtown',
  11: 'homeless sidewalk person urban',
  15: 'government document paperwork',
  20: 'social media viral phone',
  21: 'city hall government building',
  22: 'crowdfunding online donation',
  23: 'filmmaker camera documentary',
};

const CH02_BACKUP: Record<number, string> = {
  1:  'city hall government Los Angeles',
  2:  'homeless encampment urban',
  3:  'homeless statistics poverty USA',
  4:  'Los Angeles homeless street',
  6:  'urban poverty street',
  7:  'homeless camp sidewalk',
  8:  'Los Angeles housing economy',
  9:  'construction housing apartment',
  10: 'government official meeting',
  12: 'construction tools wood',
  13: 'hardware store lumber',
  15: 'workshop tools small business',
  16: 'construction worker wood',
  17: 'construction timelapse building',
  19: 'wooden shed small structure',
  20: 'carpenter woodworking DIY',
  23: 'urban neighborhood street',
  24: 'elderly woman shelter housing',
  25: 'Los Angeles law enforcement',
  27: 'social media documentary phone',
  29: 'viral video online',
  31: 'crowdfunding donation online',
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripQuotes(q: string): string {
  return q.replace(/^"|"$/g, '').trim();
}

async function fetchAndSaveStock(
  beatIndex: number,
  primaryQueryRaw: string,
  backupQueryRaw: string | undefined,
  outputFilename: string,
  usedUrls: Set<string>
): Promise<{ clipPath: string; mediaType: 'video' | 'image' } | null> {
  const primaryQuery = stripQuotes(primaryQueryRaw);
  const backupQuery = backupQueryRaw ? stripQuotes(backupQueryRaw) : undefined;

  // Try video first
  const videoResult = await findStockFootage(primaryQuery, backupQuery ?? null, usedUrls, {
    storyContext: STORY_CTX,
  });

  if (videoResult) {
    const outputPath = path.join(STOCK_OUTPUT_DIR, `${outputFilename}.mp4`);
    try {
      await downloadStockVideo(videoResult.video, outputPath);
      console.log(`  💾 Saved video: ${outputFilename}.mp4 (${videoResult.video.source})`);
      return { clipPath: outputPath, mediaType: 'video' };
    } catch (err: any) {
      console.warn(`  ⚠️  Video download failed for beat ${beatIndex}: ${err.message}`);
    }
  }

  // Fallback: try stock photo
  console.log(`  📷 Falling back to stock photo for beat ${beatIndex}...`);
  const photoResult = await findStockPhoto(primaryQuery, usedUrls, {
    storyContext: STORY_CTX,
  });

  if (photoResult) {
    const ext = photoResult.url.match(/\.(jpg|jpeg|png|webp)/i)?.[1] ?? 'jpg';
    const outputPath = path.join(STOCK_OUTPUT_DIR, `${outputFilename}.${ext}`);
    try {
      await downloadStockPhoto(photoResult, outputPath);
      console.log(`  💾 Saved photo: ${outputFilename}.${ext} (${photoResult.source})`);
      return { clipPath: outputPath, mediaType: 'image' };
    } catch (err: any) {
      console.warn(`  ⚠️  Photo download failed for beat ${beatIndex}: ${err.message}`);
    }
  }

  // Try backup photo if primary photo also failed
  if (backupQuery) {
    console.log(`  📷 Trying backup photo query for beat ${beatIndex}: "${backupQuery}"`);
    const backupPhotoResult = await findStockPhoto(backupQuery, usedUrls, {
      storyContext: STORY_CTX,
    });
    if (backupPhotoResult) {
      const ext = backupPhotoResult.url.match(/\.(jpg|jpeg|png|webp)/i)?.[1] ?? 'jpg';
      const outputPath = path.join(STOCK_OUTPUT_DIR, `${outputFilename}.${ext}`);
      try {
        await downloadStockPhoto(backupPhotoResult, outputPath);
        console.log(`  💾 Saved backup photo: ${outputFilename}.${ext} (${backupPhotoResult.source})`);
        return { clipPath: outputPath, mediaType: 'image' };
      } catch (err: any) {
        console.warn(`  ⚠️  Backup photo download failed for beat ${beatIndex}: ${err.message}`);
      }
    }
  }

  return null;
}

// ─── Chapter Processor ───────────────────────────────────────────────────────

interface ClipEntry {
  beatIndex: number;
  chapterIndex: number;
  text: string;
  startTime: number;
  endTime: number;
  clipPath: string;
  mediaType: 'video' | 'image';
  [key: string]: any;
}

async function processChapter(
  chapterNum: number,
  decisions: Record<number, string | null>,
  backupQueries: Record<number, string>
): Promise<{ totalBeats: number; kept: number; replaced: number; failed: number }> {
  const jsonPath = path.join(ELVIS_TIMELINE_DIR, `chapter_0${chapterNum}.json`);
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`🎬 Processing Chapter 0${chapterNum}: ${jsonPath}`);
  console.log(`${'═'.repeat(60)}`);

  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const timeline = JSON.parse(raw) as { clips: ClipEntry[]; [key: string]: any };

  const usedUrls = new Set<string>();
  let kept = 0;
  let replaced = 0;
  let failed = 0;

  for (const clip of timeline.clips) {
    const beat = clip.beatIndex;
    const decision = decisions[beat];

    if (decision === undefined) {
      // Beat not in decision table — keep as-is (shouldn't happen)
      console.log(`  ⚠️  Beat ${beat}: NOT in decision table — keeping as-is`);
      kept++;
      continue;
    }

    if (decision === null) {
      // KEEP raw footage
      console.log(`  ✅ Beat ${beat} [KEEP RAW]: "${clip.clipPath.split('\\').pop()}" — ${clip.text.substring(0, 50)}...`);
      kept++;
      continue;
    }

    // REPLACE with stock
    const prefix = `ch0${chapterNum}_beat_${String(beat).padStart(2, '0')}`;
    console.log(`\n  🔄 Beat ${beat} [REPLACE]: "${clip.text.substring(0, 60)}..."`);
    console.log(`     Query: ${decision}`);

    const backupQuery = backupQueries[beat];
    const result = await fetchAndSaveStock(beat, decision, backupQuery, prefix, usedUrls);

    if (result) {
      clip.clipPath = result.clipPath;
      clip.mediaType = result.mediaType;
      // If we got a photo, ensure kenBurns is set so it animates nicely
      if (result.mediaType === 'image' && clip.kenBurns === undefined) {
        clip.kenBurns = true;
      }
      replaced++;
    } else {
      console.error(`  ❌ FAILED: Beat ${beat} — no stock found. Keeping original clip path.`);
      failed++;
    }
  }

  // Write updated JSON back
  fs.writeFileSync(jsonPath, JSON.stringify(timeline, null, 2), 'utf-8');
  console.log(`\n✅ Chapter 0${chapterNum} written back to: ${jsonPath}`);

  return {
    totalBeats: timeline.clips.length,
    kept,
    replaced,
    failed,
  };
}

// ─── Verification ────────────────────────────────────────────────────────────

function verifyChapter(chapterNum: number): void {
  const jsonPath = path.join(ELVIS_TIMELINE_DIR, `chapter_0${chapterNum}.json`);
  const raw = fs.readFileSync(jsonPath, 'utf-8');
  const timeline = JSON.parse(raw) as { clips: ClipEntry[] };

  let rawCount = 0;
  let stockCount = 0;
  const missing: number[] = [];

  for (const clip of timeline.clips) {
    const isStock = clip.clipPath.includes(STOCK_OUTPUT_DIR) || clip.clipPath.includes('uploads\\stock');
    if (isStock) {
      stockCount++;
      // Check file exists
      if (!fs.existsSync(clip.clipPath)) {
        missing.push(clip.beatIndex);
      }
    } else {
      rawCount++;
    }
  }

  const total = timeline.clips.length;
  const rawPct = ((rawCount / total) * 100).toFixed(1);
  const stockPct = ((stockCount / total) * 100).toFixed(1);

  console.log(`\n📊 Chapter 0${chapterNum} Verification:`);
  console.log(`   Total beats : ${total}`);
  console.log(`   Raw footage : ${rawCount} (${rawPct}%)`);
  console.log(`   Stock clips : ${stockCount} (${stockPct}%)`);

  if (missing.length > 0) {
    console.warn(`   ⚠️  Missing stock files at beat indices: ${missing.join(', ')}`);
  } else {
    console.log(`   ✅ All stock clip files exist on disk`);
  }

  // Target ratio check
  if (chapterNum === 1) {
    const target = '50% raw / 50% stock';
    const ok = rawCount >= 11 && rawCount <= 13;
    console.log(`   Target: ${target} → ${ok ? '✅ ACHIEVED' : '⚠️  CHECK MANUALLY'}`);
  } else if (chapterNum === 2) {
    const target = '30% raw / 70% stock';
    const ok = rawCount >= 9 && rawCount <= 11;
    console.log(`   Target: ${target} → ${ok ? '✅ ACHIEVED' : '⚠️  CHECK MANUALLY'}`);
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Elvis Documentary Chapter Fixer');
  console.log('   Target: Ch01 → 50/50 raw/stock | Ch02 → 30/70 raw/stock\n');

  // Process Chapter 01
  const ch01Stats = await processChapter(1, CH01_DECISIONS, CH01_BACKUP);

  // Process Chapter 02
  const ch02Stats = await processChapter(2, CH02_DECISIONS, CH02_BACKUP);

  // Summary
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`📋 FINAL SUMMARY`);
  console.log(`${'═'.repeat(60)}`);
  console.log(`Chapter 01 (${ch01Stats.totalBeats} beats):`);
  console.log(`   Kept raw   : ${ch01Stats.kept}`);
  console.log(`   Replaced   : ${ch01Stats.replaced}`);
  console.log(`   Failed     : ${ch01Stats.failed}`);
  console.log(`Chapter 02 (${ch02Stats.totalBeats} beats):`);
  console.log(`   Kept raw   : ${ch02Stats.kept}`);
  console.log(`   Replaced   : ${ch02Stats.replaced}`);
  console.log(`   Failed     : ${ch02Stats.failed}`);

  // Verify both chapters
  verifyChapter(1);
  verifyChapter(2);

  const totalFailed = ch01Stats.failed + ch02Stats.failed;
  if (totalFailed > 0) {
    console.log(`\n⚠️  ${totalFailed} beat(s) failed to get stock footage. Those beats retain their original raw path.`);
    process.exit(1);
  } else {
    console.log('\n🎉 All beats processed successfully!');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
