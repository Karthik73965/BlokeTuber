import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: 'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\.env' });

import {
  findStockFootage,
  downloadStockVideo,
  findStockPhoto,
  downloadStockPhoto,
} from '../src/services/stockFootage';

// ─── Config ──────────────────────────────────────────────────────────────────

const STOCK_DIR = 'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\stock\\elvis';
const STORY_CONTEXT =
  'Elvis Summers documentary — grassroots activist who built tiny homes for homeless people in South Los Angeles, confronted by city government';

const CH03_PATH =
  'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\timelines\\elvis\\chapter_03.json';
const CH04_PATH =
  'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\timelines\\elvis\\chapter_04.json';

// ─── Semantic query map ───────────────────────────────────────────────────────

/**
 * Derives a semantically precise stock query from a beat's narration text.
 * The aim is documentary b-roll that matches what the narrator is describing,
 * NOT what the original (often mis-labelled) raw clip shows.
 */
function getStockQuery(beatText: string): { primary: string; backup: string } {
  const t = beatText.toLowerCase();

  // ── People / community response ──
  if (t.includes('inbox') || t.includes('carpenters') || t.includes('offering weekends')) {
    return { primary: 'community volunteers helping donation', backup: 'people volunteer teamwork USA' };
  }
  if (t.includes('retired contractors') || t.includes('leftover materials') || t.includes('homeless outreach')) {
    return { primary: 'construction worker wood building tools', backup: 'volunteer construction community' };
  }
  if (t.includes('workers offering') || t.includes('find the next person') || t.includes('door that locked')) {
    return { primary: 'community volunteers helping homeless', backup: 'volunteer outreach neighborhood USA' };
  }
  if (t.includes('kids') || t.includes('six') || t.includes('parents') || t.includes('build one')) {
    return { primary: 'family children community volunteer project', backup: 'kids helping community USA' };
  }
  if (t.includes('fundraiser') || t.includes('tiny house huge purpose')) {
    return { primary: 'crowdfunding donation laptop online', backup: 'fundraising charity USA' };
  }
  if (t.includes('crossed') && t.includes('000')) {
    return { primary: 'crowdfunding donation money raised online', backup: 'fundraising success USA' };
  }
  if (t.includes('funded by people') || t.includes('never met') || t.includes('never met elvis') || t.includes('never met smoky')) {
    return { primary: 'people donate online social media giving', backup: 'community solidarity USA online' };
  }
  if (t.includes('finished houses') || t.includes('never see the finished')) {
    return { primary: 'urban neighborhood residential street USA', backup: 'Los Angeles aerial skyline downtown' };
  }
  if (t.includes('they just wanted') || t.includes('part of fixing') || t.includes('unfixable')) {
    return { primary: 'community volunteers helping donation', backup: 'people working together community' };
  }
  if (t.includes('months that followed') || t.includes('volunteers who kept showing up')) {
    return { primary: 'construction worker wood building tools', backup: 'volunteer community building' };
  }
  if (t.includes('37') || t.includes('gave away') || t.includes('houses across los angeles')) {
    return { primary: 'Los Angeles aerial skyline downtown', backup: 'urban neighborhood residential street USA' };
  }
  if (t.includes('solar') || t.includes('panels') || t.includes('light at night')) {
    return { primary: 'solar panel tiny house off grid', backup: 'solar energy renewable panel roof' };
  }
  if (t.includes('window alarm') || t.includes('camping toilet') || t.includes('vents cut')) {
    return { primary: 'construction worker wood building tools', backup: 'tiny house interior detail' };
  }
  if (t.includes('roof line') || t.includes('oven') || t.includes('california heat')) {
    return { primary: 'tiny house exterior California sunny', backup: 'small shelter wood structure exterior' };
  }
  if (t.includes('cost per house') || t.includes('1,200') || t.includes('bright paint')) {
    return { primary: 'economy housing cost USA urban', backup: 'construction budget material cost' };
  }
  if (t.includes('wheels') || t.includes('mobile structure') || t.includes('permanent')) {
    return { primary: 'tiny house on wheels mobile home', backup: 'small mobile structure wheels' };
  }
  if (t.includes('one thing a tent') || t.includes('tent can')) {
    return { primary: 'urban poverty homeless encampment USA', backup: 'homeless tent sidewalk city' };
  }
  if (t.includes('four solid walls') || t.includes('actually sleep')) {
    return { primary: 'person sleeping shelter bed rest', backup: 'homeless person rest urban' };
  }
  if (t.includes('half alert') || t.includes('footsteps') || t.includes('listening for')) {
    return { primary: 'urban poverty homeless encampment USA', backup: 'homeless encampment night city' };
  }
  if (t.includes('belongings') || t.includes('disappear') || t.includes('find food or work')) {
    return { primary: 'homeless person belongings poverty urban', backup: 'urban poverty hardship USA' };
  }
  if (t.includes('first time in a long time') || t.includes('next month')) {
    return { primary: 'person hopeful future planning', backup: 'community volunteers helping donation' };
  }
  if (t.includes('getting through tonight') || t.includes('think about next month')) {
    return { primary: 'person hopeful future sunrise urban', backup: 'Los Angeles aerial skyline downtown' };
  }

  // ── Default fallback ──
  return { primary: 'urban poverty homeless encampment USA', backup: 'Los Angeles aerial skyline downtown' };
}

function getStockQueryCh04(beatText: string): { primary: string; backup: string } {
  const t = beatText.toLowerCase();

  // ── Ch04 narrative-specific ──
  if (t.includes("smoky") || t.includes("not every story") || t.includes("summers kept building")) {
    return { primary: 'construction worker wood building tools', backup: 'volunteer community building' };
  }
  if (t.includes('young woman named raven') || t.includes('trying to reach')) {
    return { primary: 'urban poverty homeless encampment USA', backup: 'homeless woman city USA' };
  }
  if (t.includes('leaving a violent home') || t.includes('homelessness') || t.includes('out of homelessness')) {
    return { primary: 'urban poverty homeless encampment USA', backup: 'woman poverty hardship city' };
  }
  if (t.includes('quiet industrial') || t.includes('cleanup') || t.includes('tracked down')) {
    return { primary: 'city government building USA', backup: 'urban industrial street area' };
  }
  if (t.includes('small crew') || t.includes('finish it fast') || t.includes('routes were less')) {
    return { primary: 'construction worker wood building tools', backup: 'volunteer crew building fast' };
  }
  if (t.includes('detail') && t.includes('morale') || t.includes('nothing to do with function')) {
    return { primary: 'craftsman detail carpentry woodwork', backup: 'construction worker wood building tools' };
  }
  if (t.includes('hand-painted') || t.includes('night sky') || t.includes('ceiling') || t.includes('stars')) {
    return { primary: 'night sky stars milky way', backup: 'starry night sky dark' };
  }
  if (t.includes('blue tarp') || t.includes('lying down') || t.includes('looking up')) {
    return { primary: 'homeless tent blue tarp city sidewalk', backup: 'urban poverty homeless encampment USA' };
  }
  if (t.includes('house was finally delivered') || t.includes('raven said it plainly')) {
    return { primary: 'community volunteers helping donation', backup: 'person gratitude thank help' };
  }
  if (t.includes("wasn't just a place to sleep") || t.includes('private space')) {
    return { primary: 'person shelter dignity safe', backup: 'homeless person home urban' };
  }
  if (t.includes('exact moment she needed') || t.includes('longer than she could remember')) {
    return { primary: 'person hopeful future planning', backup: 'community volunteers helping donation' };
  }
  if (t.includes("women") && t.includes("trying to reach") || t.includes('lot of the women')) {
    return { primary: 'homeless women shelter urban USA', backup: 'urban poverty homeless encampment USA' };
  }
  if (t.includes('skid row') || t.includes('shelter bed')) {
    return { primary: 'Los Angeles aerial skyline downtown', backup: 'urban poverty Los Angeles skid row' };
  }
  if (t.includes('50 block') || t.includes('stretch of downtown') || t.includes('downtown los angeles')) {
    return { primary: 'Los Angeles aerial skyline downtown', backup: 'downtown urban street USA' };
  }
  if (t.includes('outreach workers') || t.includes('describe as unlike') || t.includes('spent decades')) {
    return { primary: 'nonprofit charity volunteer USA', backup: 'outreach worker community service' };
  }
  if (t.includes('2,000') || t.includes('2000 people') || t.includes('packed into')) {
    return { primary: 'homeless USA population statistics', backup: 'urban poverty crowd city homeless' };
  }
  if (t.includes('rats') || t.includes('moving through tents') || t.includes('people sleep')) {
    return { primary: 'homeless tent sidewalk city encampment', backup: 'urban poverty homeless encampment USA' };
  }
  if (t.includes('low hum of danger') || t.includes('nobody really rests') || t.includes('constant')) {
    return { primary: 'urban poverty homeless encampment USA', backup: 'homeless night city danger' };
  }
  if (t.includes('assault') || t.includes('theft') || t.includes('staying alert')) {
    return { primary: 'police officer USA law enforcement', backup: 'urban crime city street USA' };
  }
  if (t.includes('exhausting') || t.includes('unpaid job') || t.includes('night becomes')) {
    return { primary: 'homeless person suffering exhausted urban', backup: 'urban poverty hardship USA' };
  }
  if (t.includes('women in particular') || t.includes('sharper') || t.includes("danger is sharper")) {
    return { primary: 'homeless women shelter urban USA', backup: 'woman vulnerability poverty city' };
  }
  if (t.includes('spreadsheet') || t.includes('shelter capacity') || t.includes('closer to safety')) {
    return { primary: 'nonprofit charity volunteer USA', backup: 'government policy social services USA' };
  }
  if (t.includes("raven's story") || t.includes('backdrop') || t.includes('sits against')) {
    return { primary: 'Los Angeles aerial skyline downtown', backup: 'urban neighborhood residential street USA' };
  }
  if (t.includes("37 houses") || t.includes("backdrop every one")) {
    return { primary: 'urban neighborhood residential street USA', backup: 'Los Angeles aerial skyline downtown' };
  }
  if (t.includes("tiny house isn't a cure") || t.includes('cure for homelessness')) {
    return { primary: 'homeless USA population statistics', backup: 'city hall government building USA' };
  }
  if (t.includes('one specific night') || t.includes('difference between sleeping')) {
    return { primary: 'person shelter dignity safe', backup: 'homeless person rest urban' };
  }
  if (t.includes('keeping your belongings') || t.includes('losing them')) {
    return { primary: 'homeless person belongings poverty urban', backup: 'urban poverty hardship USA' };
  }

  // Default fallback
  return { primary: 'urban poverty homeless encampment USA', backup: 'Los Angeles aerial skyline downtown' };
}

// ─── shouldKeepRaw ────────────────────────────────────────────────────────────

/**
 * Returns true if this beat's raw clip is justified to keep.
 * All 3 conditions must be checked: direct mention, first/climactic, or construction.
 */
function shouldKeepRaw(
  beatText: string,
  currentClipPath: string,
  keepCount: number,
  targetKeepCount: number
): boolean {
  if (keepCount >= targetKeepCount) return false;

  const text = beatText.toLowerCase();
  const clip = path.basename(currentClipPath).toLowerCase();

  // Only honour ACTUAL available raw clips (no "Elvis glimpse", "ELVIS PHOTO", "Person walkng around", "elvis showing house", etc.)
  const isAvailableRaw =
    clip.includes('old woman') ||
    clip.includes('elvis buiding') ||
    clip.includes('elvis elevation') ||
    clip.includes('wallkig') ||
    clip.includes('tents in the sidewalk') ||
    clip.includes('inside the tent') ||
    clip.includes('a tent where woman') ||
    clip.includes('door of tiny home') ||
    clip.includes('wide lense') ||
    clip.includes('woman police') ||
    clip.includes('poeple cleaning') ||
    clip.includes('person named andy') ||
    clip.includes('andy talking') ||
    clip.includes('showing los angels') ||
    clip.includes('tinu hose') ||
    clip.includes('raven irene smokey');

  if (!isAvailableRaw) return false;

  // ── Smokey / Irene / Old Woman ──
  if (
    (text.includes('smoky') || text.includes('smokey') || text.includes('irene') ||
      text.includes('grandmother') || text.includes('old woman')) &&
    clip.includes('old woman')
  ) return true;

  // ── Elvis building house ──
  if (
    (text.includes('building') || text.includes('built') || text.includes('construction') ||
      text.includes('plywood') || text.includes('hammer') || text.includes('crew') ||
      text.includes('priority') || text.includes('volunteers who kept showing up') ||
      text.includes('summers and the volunteers')) &&
    (clip.includes('buiding') || clip.includes('wallkig') || clip.includes('elvis elevation'))
  ) return true;

  // ── Tent living (sidewalk / inside) ──
  if (
    (text.includes('tent') || text.includes('sleeping') || text.includes('sidewalk') ||
      text.includes('freeway') || text.includes('blanket') || text.includes('tarp')) &&
    (clip.includes('tents in the sidewalk') || clip.includes('inside the tent') || clip.includes('a tent where woman'))
  ) return true;

  // ── Tiny home door / wide view ──
  if (
    (text.includes('door') || text.includes('locked') || text.includes('window') ||
      text.includes('roof') || text.includes('solar') || text.includes('steel') ||
      text.includes('wheels') || text.includes('mobile') || text.includes('panels')) &&
    (clip.includes('door of tiny home') || clip.includes('wide lense') || clip.includes('tinu hose'))
  ) return true;

  // ── Police / enforcement ──
  if (
    (text.includes('police') || text.includes('officer') || text.includes('seized') ||
      text.includes('confiscated') || text.includes('forced') || text.includes('city had forced')) &&
    clip.includes('woman police')
  ) return true;

  // ── City cleaning / sweep ──
  if (
    (text.includes('clean') || text.includes('sweep') || text.includes('removal') ||
      text.includes('sanitation') || text.includes('crews arrived') || text.includes('hauled away') ||
      text.includes('cleanup crews') || text.includes('bulk trash')) &&
    clip.includes('poeple cleaning')
  ) return true;

  // ── Andy Bales ──
  if (
    (text.includes('andy') || text.includes('bales') || text.includes('union rescue mission') ||
      text.includes('outreach') && text.includes('decades')) &&
    (clip.includes('person named andy') || clip.includes('andy talking'))
  ) return true;

  // ── Raven thanking Elvis ──
  if (
    (text.includes('raven') || text.includes('thank') || text.includes('gratitude') ||
      text.includes('delivered')) &&
    clip.includes('raven irene smokey')
  ) return true;

  // ── Los Angeles map ──
  if (
    (text.includes('los angeles') || text.includes('skid row') || text.includes('downtown')) &&
    clip.includes('showing los angels')
  ) return true;

  return false;
}

// ─── Semantic query dispatcher ────────────────────────────────────────────────

function getQuery(beatText: string, chapterIndex: number): { primary: string; backup: string } {
  return chapterIndex === 3
    ? getStockQueryCh03(beatText)
    : getStockQueryCh04(beatText);
}

// Alias for clarity
const getStockQueryCh03 = getStockQuery;

// ─── Download helper ──────────────────────────────────────────────────────────

interface DownloadResult {
  clipPath: string;
  mediaType: 'video' | 'image';
}

async function downloadStockForBeat(
  beatIdx: number,
  chapterIdx: number,
  query: { primary: string; backup: string },
  usedUrls: Set<string>
): Promise<DownloadResult | null> {
  const options = {
    storyContext: STORY_CONTEXT,
    useVisionVerification: true as const,
  };

  const label = `ch0${chapterIdx}_beat_${String(beatIdx).padStart(2, '0')}`;

  // ── Tier 1: primary video query ──
  try {
    const result = await findStockFootage(query.primary, query.backup, usedUrls, options);
    if (result) {
      const outPath = path.join(STOCK_DIR, `${label}.mp4`);
      await downloadStockVideo(result.video, outPath);
      console.log(`  💾 Downloaded video → ${path.basename(outPath)}`);
      return { clipPath: outPath, mediaType: 'video' };
    }
  } catch (err: any) {
    console.warn(`  ⚠️  Video download failed for beat ${beatIdx}: ${err.message}`);
  }

  // ── Tier 2: backup video query (already tried inside findStockFootage, try photo) ──
  try {
    const photo = await findStockPhoto(query.primary, usedUrls, options);
    if (photo) {
      const outPath = path.join(STOCK_DIR, `${label}.jpg`);
      await downloadStockPhoto(photo, outPath);
      console.log(`  💾 Downloaded photo → ${path.basename(outPath)}`);
      return { clipPath: outPath, mediaType: 'image' };
    }
  } catch (err: any) {
    console.warn(`  ⚠️  Photo download failed for beat ${beatIdx}: ${err.message}`);
  }

  // ── Tier 3: backup query photo ──
  try {
    const photo2 = await findStockPhoto(query.backup, usedUrls, options);
    if (photo2) {
      const outPath = path.join(STOCK_DIR, `${label}_bk.jpg`);
      await downloadStockPhoto(photo2, outPath);
      console.log(`  💾 Downloaded backup photo → ${path.basename(outPath)}`);
      return { clipPath: outPath, mediaType: 'image' };
    }
  } catch (err: any) {
    console.warn(`  ⚠️  Backup photo download failed for beat ${beatIdx}: ${err.message}`);
  }

  return null;
}

// ─── Process one chapter ──────────────────────────────────────────────────────

interface ChapterResult {
  totalBeats: number;
  rawKept: number;
  stockReplaced: number;
  downloadFailures: number;
}

async function processChapter(jsonPath: string, chapterIdx: number): Promise<ChapterResult> {
  console.log(`\n${'═'.repeat(70)}`);
  console.log(`📂 Processing Chapter 0${chapterIdx}: ${path.basename(jsonPath)}`);
  console.log(`${'═'.repeat(70)}`);

  const raw = fs.readFileSync(jsonPath, 'utf8');
  const data = JSON.parse(raw);
  const clips: any[] = data.clips;

  const totalBeats = clips.length;
  const targetRawCount = Math.round(totalBeats * 0.30);
  console.log(`   Total beats: ${totalBeats} | Target raw: ${targetRawCount} (30%) | Target stock: ${totalBeats - targetRawCount} (70%)`);

  const usedUrls = new Set<string>();
  let rawKept = 0;
  let stockReplaced = 0;
  let downloadFailures = 0;

  for (let i = 0; i < clips.length; i++) {
    const beat = clips[i];
    const beatText: string = beat.text || '';
    const clipPath: string = beat.clipPath || '';

    process.stdout.write(`\n[Beat ${String(i).padStart(2, '0')}] "${beatText.slice(0, 60)}..."\n`);
    process.stdout.write(`   Current clip: ${path.basename(clipPath)}\n`);

    const keep = shouldKeepRaw(beatText, clipPath, rawKept, targetRawCount);

    if (keep) {
      rawKept++;
      console.log(`   ✅ KEEP RAW (${rawKept}/${targetRawCount}) — justified by narration`);
    } else {
      // Get semantic query for this beat
      const query = getQuery(beatText, chapterIdx);
      console.log(`   🔄 REPLACE with stock | Query: "${query.primary}" / Backup: "${query.backup}"`);

      const downloaded = await downloadStockForBeat(i, chapterIdx, query, usedUrls);

      if (downloaded) {
        beat.clipPath = downloaded.clipPath;
        beat.mediaType = downloaded.mediaType;
        stockReplaced++;
        console.log(`   ✅ Replaced → ${path.basename(downloaded.clipPath)} (${downloaded.mediaType})`);
      } else {
        console.warn(`   ❌ DOWNLOAD FAILED — keeping original raw clip for beat ${i}`);
        downloadFailures++;
        // Still count as raw if we couldn't download
        rawKept++;
      }
    }
  }

  // Save updated JSON
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2), 'utf8');
  console.log(`\n✅ Saved updated JSON → ${jsonPath}`);

  return { totalBeats, rawKept, stockReplaced, downloadFailures };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🎬 Elvis Documentary Timeline Fixer — Ch03 & Ch04');
  console.log('Target: 30% raw / 70% stock per chapter\n');

  // Ensure stock output directory
  fs.mkdirSync(STOCK_DIR, { recursive: true });
  console.log(`📁 Stock output dir: ${STOCK_DIR}`);

  // Process chapters sequentially to avoid rate limiting
  const ch03 = await processChapter(CH03_PATH, 3);
  const ch04 = await processChapter(CH04_PATH, 4);

  // ── Final report ──
  console.log('\n' + '═'.repeat(70));
  console.log('📊 FINAL REPORT');
  console.log('═'.repeat(70));

  for (const [label, result] of [['Chapter 03', ch03], ['Chapter 04', ch04]] as [string, ChapterResult][]) {
    const rawPct = ((result.rawKept / result.totalBeats) * 100).toFixed(1);
    const stockPct = ((result.stockReplaced / result.totalBeats) * 100).toFixed(1);
    console.log(`\n${label}:`);
    console.log(`  Total beats   : ${result.totalBeats}`);
    console.log(`  Raw kept      : ${result.rawKept} (${rawPct}%)`);
    console.log(`  Stock replaced: ${result.stockReplaced} (${stockPct}%)`);
    console.log(`  DL failures   : ${result.downloadFailures}`);
  }

  const totalFailures = ch03.downloadFailures + ch04.downloadFailures;
  if (totalFailures > 0) {
    console.log(`\n⚠️  ${totalFailures} beat(s) failed to download stock — original raw clips retained.`);
    console.log('   Re-run the script to retry those beats.');
  } else {
    console.log('\n🎉 All downloads successful!');
  }
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
