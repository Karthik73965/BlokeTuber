import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: 'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\.env' });
import { findStockFootage, downloadStockVideo, findStockPhoto, downloadStockPhoto } from '../src/services/stockFootage';

const STOCK_DIR = 'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\stock\\elvis';
const STORY_CONTEXT = 'Elvis Summers documentary - closing chapter summarizing the impact of one man building tiny homes for homeless people in Los Angeles, city government response, and community legacy';

function isDirectlyAboutRawSubject(beatText: string, clipPath: string): boolean {
  const t = beatText.toLowerCase();
  const c = clipPath.toLowerCase();

  // Smokey / Irene / grandmother
  if ((t.includes('smokey') || t.includes('irene') || t.includes('grandmother') || t.includes('mcgee')) && c.includes('old woman')) return true;

  // Elvis building / acting directly
  if (
    (t.includes('elvis') || t.includes('built it') || t.includes('he built') || t.includes('circular saw') || t.includes('one man') || t.includes('just started building') || t.includes('actually doing it')) &&
    (c.includes('buiding') || c.includes('elevation') || c.includes('walkig') || c.includes('showing house'))
  ) return true;

  // Elvis Summers named directly
  if ((t.includes('elvis summers') || t.includes('elvis')) && (c.includes('elevation') || c.includes('photo') || c.includes('elvis'))) return true;

  // Tent life / sidewalk
  if ((t.includes('tent') || t.includes('bare ground') || t.includes('dirt') || t.includes('sidewalk') || t.includes('ground felt like')) && (c.includes('tent') || c.includes('inside the tent'))) return true;

  // Tiny home door / structure
  if ((t.includes('door') || t.includes('home sweet home') || t.includes('roof') || t.includes('tiny home') || t.includes('small wooden house') || t.includes('hand-painted')) && (c.includes('door') || c.includes('tinu hose') || c.includes('wide lense'))) return true;

  // Raven specifically named
  if ((t.includes('raven') || t.includes('next woman') || t.includes('thanking') || t.includes('gratitude')) && c.includes('raven')) return true;

  // Andy Bales
  if ((t.includes('andy') || t.includes('bales') || t.includes('union rescue')) && (c.includes('andy') || c.includes('bales'))) return true;

  // Police / seizure
  if ((t.includes('police') || t.includes('seiz') || t.includes('confiscate') || t.includes('city took')) && c.includes('police')) return true;

  // Sanitation sweep
  if ((t.includes('sanitation') || t.includes('sweep') || t.includes('cleaned out')) && c.includes('cleaning')) return true;

  return false;
}

function getStockQuery(beatText: string): string {
  const t = beatText.toLowerCase();

  if (t.includes('girl scout') || t.includes('cookies') || t.includes('dresser') || t.includes('drawer')) return 'children volunteers community kindness USA';
  if (t.includes('formerly homeless') || t.includes('building and selling shelters') || t.includes('for $150')) return 'community volunteer building shelter USA outdoor';
  if (t.includes('donat') || t.includes('gofundme') || t.includes('crowdfund') || t.includes('raised') || t.includes('money')) return 'crowdfunding donation online phone USA';
  if (t.includes('city') && (t.includes('seiz') || t.includes('took') || t.includes('confiscat') || t.includes('pulled away'))) return 'city government enforcement official USA';
  if (t.includes('police') || t.includes('officer') || t.includes('enforcement')) return 'police officer USA law enforcement';
  if (t.includes('viral') || t.includes('million view') || t.includes('social media') || t.includes('youtube') || t.includes('internet')) return 'social media viral video phone USA';
  if (t.includes('media') || t.includes('news') || t.includes('report') || t.includes('journalist')) return 'news journalist reporter interview USA';
  if (t.includes('veteran') || t.includes('uniform') || t.includes('military') || t.includes('kansas city')) return 'veterans community service military USA';
  if (t.includes('community') || t.includes('neighbor') || t.includes('ordinary') || t.includes('people deciding') || t.includes('one saturday')) return 'community people helping urban USA';
  if (t.includes('homeless') && (t.includes('number') || t.includes('statistic') || t.includes('million') || t.includes('thousand') || t.includes('count') || t.includes('alone will end'))) return 'homelessness urban poverty USA street';
  if (t.includes('legacy') || t.includes('impact') || t.includes('change') || t.includes('difference') || t.includes('lesson') || t.includes('actual lesson')) return 'community change impact volunteer USA';
  if (t.includes('los angeles') || t.includes('la city') || t.includes('skid row') || t.includes('south la')) return 'Los Angeles aerial skyline city';
  if (t.includes('build') || t.includes('construct') || t.includes('saw') || t.includes('hammer') || t.includes('wood') || t.includes('plywood') || t.includes('lumber')) return 'DIY construction wood building tools outdoor';
  if (t.includes('hope') || t.includes('future') || t.includes('story') || t.includes('remember') || t.includes('worth remembering')) return 'hopeful community USA urban sunrise';
  if (t.includes('poverty') || t.includes('homeless') || t.includes('shelter') || t.includes('street') || t.includes('sleeping outside')) return 'urban poverty homeless USA street';
  if (t.includes('system') || t.includes('policy') || t.includes('government') || t.includes('bureaucracy') || t.includes('budget') || t.includes('committee') || t.includes('permission')) return 'government policy USA city hall bureaucracy';
  if (t.includes('volunteer') || t.includes('help') || t.includes('support') || t.includes('rally')) return 'community volunteer helping USA';
  if (t.includes('spreadsheet') || t.includes('efficiency') || t.includes('innovation') || t.includes('statistics') || t.includes('retention')) return 'compassion human kindness community warm USA';
  if (t.includes('door') || t.includes('locked door') || t.includes('locked')) return 'small home door lock safety USA';
  if (t.includes('somebody') || t.includes('stranger') || t.includes('worth the effort') || t.includes('thought of them')) return 'community care strangers helping USA urban';
  if (t.includes('movement') || t.includes('set out to build')) return 'grassroots community movement USA people';
  if (t.includes('distance between') || t.includes('much smaller than it looks') || t.includes('$450')) return 'volunteer action DIY outdoor community USA';

  return 'documentary urban USA community compassion';
}

async function processChapter7(): Promise<void> {
  const jsonPath = 'C:\\Users\\karth\\Documents\\BlokeTuber\\apps\\api\\uploads\\timelines\\elvis\\chapter_07.json';
  const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  const clips = data.clips;
  const targetRawCount = Math.round(clips.length * 0.30); // ~10 for 33 beats
  const usedUrls = new Set<string>();

  let rawKept = 0;
  let stockReplaced = 0;
  let failures = 0;
  let alreadyStock = 0;

  console.log(`\n=== Chapter 07 Fixer ===`);
  console.log(`Total beats: ${clips.length}, target raw: ${targetRawCount}\n`);

  for (let i = 0; i < clips.length; i++) {
    const clip = clips[i];
    const isRaw = clip.clipPath.includes('AmericanHideaways') || clip.clipPath.includes('/RAW/');

    if (!isRaw) {
      alreadyStock++;
      console.log(`Beat ${i}: ALREADY STOCK - ${path.basename(clip.clipPath)}`);
      continue;
    }

    const keepRaw = rawKept < targetRawCount && isDirectlyAboutRawSubject(clip.text, clip.clipPath);

    if (keepRaw) {
      rawKept++;
      console.log(`Beat ${i}: KEEP RAW [${rawKept}/${targetRawCount}] - "${clip.text.substring(0, 70)}"`);
    } else {
      const query = getStockQuery(clip.text);
      console.log(`Beat ${i}: REPLACING → query: "${query}"`);

      const videoOutputPath = path.join(STOCK_DIR, `ch07_beat_${String(i).padStart(2, '0')}.mp4`);
      const photoOutputPath = path.join(STOCK_DIR, `ch07_beat_${String(i).padStart(2, '0')}.jpg`);

      try {
        const result = await findStockFootage(query, null, usedUrls, { storyContext: STORY_CONTEXT });
        if (result) {
          await downloadStockVideo(result.video, videoOutputPath);
          if (result.video.url) usedUrls.add(result.video.url);
          clip.clipPath = videoOutputPath;
          clip.mediaType = 'video';
          stockReplaced++;
          console.log(`  ✅ STOCK VIDEO → ${path.basename(videoOutputPath)}`);
        } else {
          const photo = await findStockPhoto(query, usedUrls, { storyContext: STORY_CONTEXT });
          if (photo) {
            await downloadStockPhoto(photo, photoOutputPath);
            if (photo.url) usedUrls.add(photo.url);
            clip.clipPath = photoOutputPath;
            clip.mediaType = 'image';
            stockReplaced++;
            console.log(`  ✅ STOCK PHOTO → ${path.basename(photoOutputPath)}`);
          } else {
            rawKept++;
            failures++;
            console.log(`  ⚠️ FALLBACK RAW (no stock found) for query: "${query}"`);
          }
        }
      } catch (err: any) {
        rawKept++;
        failures++;
        console.log(`  ❌ ERROR - ${err.message}`);
      }
    }
  }

  fs.writeFileSync(jsonPath, JSON.stringify(data, null, 2));

  const totalRaw = rawKept;
  const totalStock = stockReplaced + alreadyStock;
  const totalBeats = clips.length;
  const rawPct = ((totalRaw / totalBeats) * 100).toFixed(1);
  const stockPct = ((totalStock / totalBeats) * 100).toFixed(1);

  console.log(`\n========== CHAPTER 07 RESULTS ==========`);
  console.log(`Total beats:      ${totalBeats}`);
  console.log(`Raw kept:         ${rawKept} (${rawPct}%)`);
  console.log(`Stock replaced:   ${stockReplaced}`);
  console.log(`Already stock:    ${alreadyStock}`);
  console.log(`Total stock:      ${totalStock} (${stockPct}%)`);
  console.log(`Failures/fallback:${failures}`);
  console.log(`Target: 30% raw / 70% stock`);
  console.log(`=========================================`);
  console.log(`✅ chapter_07.json saved.`);
}

(async () => {
  fs.mkdirSync(STOCK_DIR, { recursive: true });
  await processChapter7();
  console.log('\nDone!');
})();
