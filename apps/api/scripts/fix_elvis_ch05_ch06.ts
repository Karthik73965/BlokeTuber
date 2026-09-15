/**
 * fix_elvis_ch05_ch06.ts
 * Replaces raw footage with Pexels/Pixabay stock clips for chapters 05 and 06.
 * Target: 30% raw / 70% stock ratio per chapter.
 *
 * Chapter 05: 20 beats → keep 6 raw, replace 14 with stock
 * Chapter 06: 60 beats → keep 18 raw, replace 42 with stock
 *
 * Rules:
 *  - Raw is ONLY kept when narration DIRECTLY names the person/scene in that clip
 *  - Stock queries are semantically derived from what the narrator is literally describing
 *  - NO parlour, salon, office, party, vacation content
 */

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

const STOCK_DIR = 'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\stock\\elvis';

const STORY_CONTEXT =
  'Elvis Summers documentary — grassroots activist who built tiny homes for homeless in South Los Angeles. City seized the homes. Community rallied with donations. Skid Row urban poverty. Union Rescue Mission. Andy Bales director.';

// ---------------------------------------------------------------------------
// CHAPTER 05 — 20 beats, keep 6 raw, replace 14 with stock
// Beat-by-beat decisions (true = KEEP RAW, string = STOCK QUERY, null = stock with auto-query)
// ---------------------------------------------------------------------------
const CH05_DECISIONS: Array<true | string> = [
  // 0: "and then as it had before, the city pushed back" — police/woman clip (WOMAN POLICE)
  //    Narration is about city pushing back, not about a specific police woman → STOCK
  'police officers enforcing USA city streets',

  // 1: "Los Angeles sanitation crews confiscated tiny houses"
  //    "sanitation crews" → KEEP (poeple cleaning.mp4 IS sanitation workers, directly named)
  true,

  // 2: "sidewalk on more than one occasion. Others were tagged for removal"
  //    Not about Elvis walking → STOCK
  'city sanitation impound tagged removal USA',

  // 3: "A spokesperson for the mayor's office described the structures as"
  //    Mayor press statement → STOCK (not specific woman/police scene)
  'government official press conference city hall USA',

  // 4: "a safety hazard and said people would be better served in official shelters"
  //    Narration about shelters/hazard, not about tents directly → STOCK
  'city government building official statement USA',

  // 5: "Here's the detail that made people furious"
  //    Not about sanitation workers → STOCK (community outrage)
  'community people outrage USA urban street',

  // 6: Already stock (government.mp4) — skip (handled by isRaw check)
  //    But if treated as raw, keep it → mark as KEEP to preserve existing non-RAW stock
  true,

  // 7: "nearly two billion dollar homelessness plan stalled"
  //    Not about Elvis walking → STOCK
  'government city hall homelessness plan USA',

  // 8: "A plan that had mostly stalled in committee while thousands were"
  //    Tents in sidewalk — "thousands sleeping on sidewalks" matches tent clip directly
  true,

  // 9: "still sleeping along the same boulevards those sanitation trucks drove down"
  //    "sanitation trucks" — poeple cleaning.mp4 IS sanitation → KEEP
  true,

  // 10: "The city that couldn't move fast enough to build shelter at scale"
  //     City enforcement paradox, not specifically police woman → STOCK
  'city government enforcement bureaucracy USA',

  // 11: "moved very fast to take away shelter someone had already built for free"
  //     Sanitation impound — poeple cleaning.mp4 is directly named → KEEP
  true,

  // 12: "The public didn't let it slide. There were protests. There was coverage."
  //     Not about Elvis walking — STOCK
  'community protest USA city hall street rally',

  // 13: "And within a relatively short window, the city backed"
  //     City stand-down, not specifically police woman → STOCK
  'government officials announcement USA press statement',

  // 14: "down and returned the seized houses. Somers didn't stop."
  //     "Somers" = Elvis → Elvis elevation clip is directly about him → KEEP
  true,

  // 15: "Losing friends to the streets made sure of that. Irene Smokey McGee,"
  //     Directly names Irene Smokey McGee → OLD WOMAN.mp4 is exactly that → KEEP
  true,

  // 16: "the very first person he built for, passed away a few years later."
  //     old woman talking.mp4 — fits Irene context → KEEP (directs about her)
  true,

  // 17: "Found after the city had taken her original house, sleeping in someone"
  //     woman entering into the tent.mp4 — tent context fits directly (Irene in someone's tent) → KEEP
  //     This is the 8th raw beat — exceeds target of 6, switch to stock
  'homeless woman urban USA street encampment',

  // 18: "else's tent because that was all that was left to her"
  //     woman sittin inside tent → Irene in tent context — STOCK (over quota)
  'homeless woman tent urban USA street',

  // 19: "it's her memory more than anything else that keeps him building"
  //     Elvis glimpse — narration is about Elvis → if clip is Elvis → raw OK, but over quota → STOCK
  'person standing urban USA street reflection',
];

// ---------------------------------------------------------------------------
// CHAPTER 06 — 60 beats, keep 18 raw, replace 42 with stock
// Beat-by-beat decisions
// ---------------------------------------------------------------------------
const CH06_DECISIONS: Array<true | string> = [
  // 0: "By the time his organization, the Tiny House Project, had matured"
  //    elvis showing house → Elvis showing his organization's work → KEEP
  true,

  // 1: "it had produced hundreds of homes. From simple $500 starter shelters"
  //    Wide lense view of Tiny home (raw asset) → directly about tiny homes → KEEP
  true,

  // 2: "up to $15,000 builds with"
  //    Door of tiny home → directly about the home → KEEP
  true,

  // 3: "a working kitchen, a bedroom, a bathroom, and electricity"
  //    Wide lense view of Tiny home — unit amenities description → STOCK (repeat use, over quota)
  'tiny home interior small house amenities',

  // 4: "Church groups, school kids, off-duty contractors"
  //    elvis buiding house → people who showed up to build, not specifically elvis → STOCK
  'volunteers community building USA outdoor',

  // 5: "people who had never met the person who'd eventually sleep in what they were building"
  //    Elvis walkig to build — not directly about Elvis, about volunteers → STOCK
  'volunteer group building construction USA',

  // 6: "showed up on weekends with hammers because one man's stubbornness"
  //    Elvis elevation — narration is about Elvis's stubbornness inspiring people → KEEP
  true,

  // 7: "had made it feel possible to help in a way that was immediate and tangible"
  //    Person named ANdy BALES — text doesn't name Andy/Union Rescue → STOCK
  'community helper volunteer USA urban outdoor',

  // 8: "instead of abstract and far away. And it didn't stay in Los Angeles."
  //    andy talking to homeless people — text mentions "it didn't stay in LA", not Andy → STOCK
  'Los Angeles aerial skyline downtown urban',

  // 9: "In Kansas City, a group of combat veterans who'd watched too many of"
  //    Person named ANdy BALES — Kansas City veterans, not Andy Bales → STOCK
  'combat veteran USA community outdoor',

  // 10: "their own fall through the cracks of the system built an entire supported village"
  //     vetteran.mp4 — about veterans → KEEP (already stock, skip)
  true,

  // 11: "Dozens of small, code-compliant homes wired to"
  //     Tinu Hose build by ELVIS → directly about tiny houses built by Elvis project → KEEP
  true,

  // 12: "real utilities sitting across the street from a center offering"
  //     Wide lense view of Tiny home → support infrastructure → STOCK (over quota)
  'tiny house community outdoor USA neighborhood',

  // 13: "job placement, counseling, dental care, and a food pantry"
  //     andy talking to homeless people — veteran services, not Andy → STOCK
  'nonprofit volunteer counseling community USA',

  // 14: "Veterans who move through it typically stay just over a year"
  //     vetteran.mp4 — about veterans → KEEP (already stock, skip)
  true,

  // 15: "before transitioning into permanent housing, and when they leave"
  //     Door of tiny home → transitional housing, door is literal → KEEP
  true,

  // 16: "they take the furniture with them. Full plates, a made bed, a real start."
  //     Wide lense view of Tiny home → dignity/furnished home → STOCK (quota management)
  'furnished small home interior USA dignity',

  // 17: "Nationally veteran homelessness has fallen more than 50% since 2010"
  //     vetteran.mp4 → veteran statistics → KEEP (already stock)
  true,

  // 18: "and programs built exactly like this one are a major reason why"
  //     Person walkng around houses → not specific → STOCK
  'nonprofit program housing USA community impact',

  // 19: "In Seattle, a nonprofit began replacing encampments with small"
  //     Tents in the sidewalk → encampments being replaced → KEEP (direct semantic match)
  true,

  // 20: "insulated heated units. Over 300 of them, built largely by volunteers"
  //     Person walkng around → not directly about Seattle volunteers → STOCK
  'volunteer construction outdoor USA building crew',

  // 21: "students, church groups, and companies donating a Saturday"
  //     elvis buiding house → church groups, students, volunteers → STOCK
  'community volunteers building USA outdoor group',

  // 22: "A Girl Scout troop built and furnished one themselves"
  //     Door of tiny home → Girl Scouts built a tiny home door → STOCK
  'community youth volunteer building USA outdoor',

  // 23: "tucked a box of their own cookies into a drawer for whoever would move in"
  //     elvis showing house → humanizing gesture, not specifically Elvis → STOCK
  'community kindness gesture helping USA',

  // 24: "Since the program scaled up, thousands of people in that region have moved"
  //     Person walkng around → not specific → STOCK
  'urban neighborhood community people USA housing',

  // 25: "from the street into permanent housing, and the overwhelming majority of them"
  //     Elvis elevation → housing transition, not specifically Elvis here → STOCK
  'homeless USA permanent housing transition urban',

  // 26: "are still housed a year later. In Nashville, a pastor raised"
  //     Wide lense view of Tiny home → Nashville tiny home → STOCK (quota)
  'pastor church Nashville USA housing fundraising',

  // 27: "tens of thousands of dollars to build a small cluster of brightly painted homes"
  //     Tinu Hose build by ELVIS → brightly painted tiny homes cluster → KEEP
  true,

  // 28: "yellows, blues, oranges, red doors, in a church backyard"
  //     Door of tiny home → colored doors in church backyard → KEEP
  true,

  // 29: "One resident told a reporter, it was a lot better than living in a tent"
  //     woman thanking elvis — resident interview, she's thanking → STOCK (not Raven specifically named)
  'resident interview documentary USA testimonial',

  // 30: "and that if you've got some ingenuity in you, you can figure the rest out"
  //     Elvis elevation → Elvis's ingenuity sentiment → KEEP
  true,

  // 31: "Not glamorous, just a locked door and a dry roof"
  //     Door of tiny home → locked door literally described → KEEP
  true,

  // 32: "which beats a wet tent on pavement every single time"
  //     Tents in the sidewalk → wet tent on pavement DIRECTLY described → KEEP
  true,

  // 33: "In Detroit, a social services nonprofit set up a rent to own path"
  //     Wide lense view of Tiny home → Detroit nonprofit homes → STOCK
  'nonprofit social services Detroit USA housing',

  // 34: "that anyone who stays and pays rent for seven years walks away owning their home outright"
  //     elvis showing house → rent to own, not Elvis specifically → STOCK
  'rent own home ownership USA community',

  // 35: "No mortgage, no bank approval required"
  //     Person walkng around → bank-free ownership, not specific → STOCK
  'housing deed ownership USA community low income',

  // 36: "and the first residents have already signed their deeds, including one"
  //     Elvis talking to a woman → deed ceremony → STOCK (not specific named Elvis interaction)
  'deed signing ceremony USA housing community',

  // 37: "man who became the third homeowner in the community in the winter of"
  //     Elvis elevation → homeowner milestone, not Elvis → STOCK
  'community homeowner USA urban neighborhood pride',

  // 38: "2025, with more expected to follow behind him"
  //     elvis showing house → future homeowners → STOCK
  'tiny home USA community future housing',

  // 39: "In Indianapolis, a nonprofit broke ground on a planned community"
  //     Elvis walkig to build → groundbreaking, not Elvis → STOCK
  'groundbreaking construction nonprofit USA community',

  // 40: "tiny homes and duplexes with a young couple and their two dogs watching"
  //     elvis buiding house → young couple watching groundbreaking → STOCK
  'couple outdoor USA community neighborhood dogs',

  // 41: "knowing they'd be among the first residents. Backed by a donor"
  //     Wide lense view of Tiny home → donor-backed housing → STOCK
  'crowdfunding donation online laptop USA',

  // 42: "match pledge that pushed construction funding past $300,000"
  //     Tinu Hose build by ELVIS → $300k funding milestone → STOCK
  'crowdfunding gofundme donation laptop computer',

  // 43: "In Minnesota, a faith-based initiative started building"
  //     elvis buiding house → Minnesota faith initiative → STOCK
  'faith church community building USA outdoor',

  // 44: "small homes where residents tend to share garden and pay a modest"
  //     Person walkng around → community garden, not Elvis → STOCK
  'community garden neighborhood USA residents outdoor',

  // 45: "monthly rent in exchange for a stable address and a community around them"
  //     Wide lense view of Tiny home → stable address community → STOCK
  'community stable housing USA neighborhood people',

  // 46: "In small towns that never expected to be part of a national movement"
  //     Elvis walkig to build → small town movement, not Elvis → STOCK
  'small town USA community neighborhood movement',

  // 47: "groups of neighbors, congregations, and volunteers kept building"
  //     elvis buiding house → grassroots volunteers building → STOCK
  'volunteer community building outdoor USA congregation',

  // 48: "idea in slightly different forms, a door, a lock, a roof, built"
  //     Door of tiny home → door/lock/roof literally described → KEEP
  true,

  // 49: "fast by people who refused to wait for a decade-long plan to reach year one"
  //     Elvis elevation → Elvis refusing to wait, his story → KEEP
  true,

  // 50: "A nearly all-volunteer crew in Seattle has gotten efficient"
  //     Person walkng around → Seattle volunteer crew, not Elvis → STOCK
  'volunteer crew construction USA building outdoor',

  // 51: "enough at the process that they now finish three to four houses a"
  //     elvis showing house → production efficiency → STOCK
  'construction building crew USA outdoor efficiency',

  // 52: "week at roughly $4,500 in materials each"
  //     Tinu Hose build by ELVIS → materials cost production → STOCK
  'construction materials tools wood USA building',

  // 53: "Multiply that pace out and you start to understand how a movement"
  //     Person walkng around → movement at scale → STOCK
  'urban community movement USA people scale',

  // 54: "that began with one guy and a hardware store receipt has within"
  //     Elvis glimpse → origin story, one man → KEEP (directly about Elvis's origin)
  true,

  // 55: "about a decade produced thousands of these homes nationwide"
  //     Wide lense view of Tiny home → thousands of homes → STOCK
  'tiny home village community USA nationwide',

  // 56: "Almost all of it without waiting on a single government contract"
  //     government.mp4 — already stock, keep as-is
  true,

  // 57: "None of that erases the scale of what's still out there. There are still"
  //     Tents in the sidewalk → scale of homeless still visible → KEEP
  true,

  // 58: "roughly three quarters of a million people without a stable place to sleep tonight"
  //     woman sittin inside tent → 750k homeless, direct encampment scene → KEEP
  true,

  // 59: "in a country wealthy enough that it shouldn't be true"
  //     SHowing LOS ANGELS IN MAP → LA map, country context → KEEP
  true,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isRawClip(clipPath: string): boolean {
  return (
    clipPath.includes('AmericanHideaways') ||
    clipPath.includes('\\RAW\\') ||
    clipPath.includes('/RAW/')
  );
}

function isAlreadyStock(clipPath: string): boolean {
  return (
    clipPath.includes('uploads\\stock') ||
    clipPath.includes('uploads/stock') ||
    (!clipPath.includes('AmericanHideaways') &&
      !clipPath.includes('\\RAW\\') &&
      !clipPath.includes('/RAW/') &&
      !clipPath.includes('vetteran.mp4') &&
      !clipPath.includes('government.mp4') &&
      !clipPath.includes('old woman talking') &&
      !clipPath.includes('woman entering') &&
      !clipPath.includes('woman sittin') &&
      !clipPath.includes('Elvis glimpse') &&
      !clipPath.includes('elvis showing') &&
      !clipPath.includes('andy talking to') &&
      !clipPath.includes('woman thanking') &&
      !clipPath.includes('Elvis talking to'))
  );
}

// ---------------------------------------------------------------------------
// Main chapter processor
// ---------------------------------------------------------------------------
async function processChapter(
  chapterNum: number,
  decisions: Array<true | string>
): Promise<void> {
  const jsonPath = `C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\timelines\\elvis\\chapter_0${chapterNum}.json`;
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const clips: any[] = data.clips;

  const usedUrls = new Set<string>();
  let rawKept = 0;
  let stockReplaced = 0;
  let alreadyStock = 0;
  let failures = 0;

  console.log(`\n${'═'.repeat(70)}`);
  console.log(`📽️  Processing Chapter ${chapterNum} (${clips.length} beats)`);
  console.log(`${'═'.repeat(70)}`);

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const decision = decisions[i];

    // Count beats where decision is undefined (shouldn't happen, but safety net)
    if (decision === undefined) {
      console.log(`[Ch${chapterNum}] Beat ${i}: ⚠️  No decision defined — keeping as-is`);
      if (!isRawClip(clip.clipPath)) alreadyStock++;
      else rawKept++;
      continue;
    }

    // Already proper stock path → count it and skip
    if (isAlreadyStock(clip.clipPath) && decision !== true) {
      console.log(`[Ch${chapterNum}] Beat ${i}: ✅ Already stock — ${path.basename(clip.clipPath)}`);
      alreadyStock++;
      continue;
    }

    // Decision: KEEP RAW
    if (decision === true) {
      rawKept++;
      console.log(
        `[Ch${chapterNum}] Beat ${i}: 🎞️  KEEP RAW — "${clip.text.substring(0, 60).trimEnd()}…" → ${path.basename(clip.clipPath)}`
      );
      continue;
    }

    // Decision: REPLACE WITH STOCK
    const query = decision as string;
    const ext = '.mp4';
    const outputPath = path.join(
      STOCK_DIR,
      `ch0${chapterNum}_beat_${String(i).padStart(2, '0')}${ext}`
    );

    // Skip re-download if file already exists on disk (re-run safety)
    if (fs.existsSync(outputPath) && fs.statSync(outputPath).size > 0) {
      clip.clipPath = outputPath;
      clip.mediaType = 'video';
      stockReplaced++;
      console.log(`[Ch${chapterNum}] Beat ${i}: ♻️  REUSED STOCK — ${path.basename(outputPath)}`);
      continue;
    }

    try {
      console.log(`[Ch${chapterNum}] Beat ${i}: 🔍 STOCK SEARCH — "${query}"`);
      const result = await findStockFootage(query, null, usedUrls, {
        storyContext: STORY_CONTEXT,
      });

      if (result) {
        await downloadStockVideo(result.video, outputPath);
        clip.clipPath = outputPath;
        clip.mediaType = 'video';
        stockReplaced++;
        console.log(
          `[Ch${chapterNum}] Beat ${i}: ✅ STOCK VIDEO — [${result.video.source}] "${result.video.title}" → ${path.basename(outputPath)}`
        );
      } else {
        // Fallback: stock photo
        const photoPath = path.join(
          STOCK_DIR,
          `ch0${chapterNum}_beat_${String(i).padStart(2, '0')}.jpg`
        );
        const photo = await findStockPhoto(query, usedUrls, {
          storyContext: STORY_CONTEXT,
        });

        if (photo) {
          await downloadStockPhoto(photo, photoPath);
          clip.clipPath = photoPath;
          clip.mediaType = 'image';
          stockReplaced++;
          console.log(
            `[Ch${chapterNum}] Beat ${i}: 📷 STOCK PHOTO — [${photo.source}] "${photo.title}" → ${path.basename(photoPath)}`
          );
        } else {
          // Stock exhausted — keep raw as fallback
          rawKept++;
          failures++;
          console.log(
            `[Ch${chapterNum}] Beat ${i}: ⚠️  FALLBACK TO RAW (no stock found) — "${query}"`
          );
        }
      }
    } catch (err: any) {
      rawKept++;
      failures++;
      console.error(`[Ch${chapterNum}] Beat ${i}: ❌ ERROR — ${err.message}`);
    }

    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  // Write updated JSON
  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  const total = clips.length;
  const rawPct = (((rawKept) / total) * 100).toFixed(1);
  const stockPct = (((stockReplaced + alreadyStock) / total) * 100).toFixed(1);

  console.log(`\n${'─'.repeat(70)}`);
  console.log(`✅ Chapter ${chapterNum} complete`);
  console.log(`   Total beats  : ${total}`);
  console.log(`   Raw kept     : ${rawKept} (${rawPct}%)`);
  console.log(`   Stock placed : ${stockReplaced} new + ${alreadyStock} existing`);
  console.log(`   Stock total  : ${stockReplaced + alreadyStock} (${stockPct}%)`);
  console.log(`   Failures     : ${failures}`);
  console.log(`   JSON saved   : ${jsonPath}`);
  console.log(`${'─'.repeat(70)}`);
}

// ---------------------------------------------------------------------------
// Verify all clipPaths exist on disk after processing
// ---------------------------------------------------------------------------
async function verifyChapter(chapterNum: number): Promise<void> {
  const jsonPath = `C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\timelines\\elvis\\chapter_0${chapterNum}.json`;
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const clips: any[] = data.clips;

  const missing: string[] = [];
  for (const clip of clips) {
    const p = clip.clipPath.replace(/\//g, '\\');
    if (!fs.existsSync(p)) missing.push(`Beat ${clip.beatIndex}: ${p}`);
  }

  if (missing.length > 0) {
    console.log(`\n⚠️  Chapter ${chapterNum} — ${missing.length} missing clip(s):`);
    missing.forEach((m) => console.log(`   ✗ ${m}`));
  } else {
    console.log(`\n✅ Chapter ${chapterNum} — All ${clips.length} clipPaths verified on disk.`);
  }
}

// ---------------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------------
(async () => {
  fs.mkdirSync(STOCK_DIR, { recursive: true });

  await processChapter(5, CH05_DECISIONS);
  await processChapter(6, CH06_DECISIONS);

  console.log('\n\n🔍 Verifying clip paths on disk...');
  await verifyChapter(5);
  await verifyChapter(6);

  console.log('\n\n🎬 All chapters fixed!');
})();
