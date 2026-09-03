import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPaths = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), '.env.local'),
  path.resolve(process.cwd(), 'apps/api/.env'),
  path.resolve(__dirname, '../../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

import { projectsStore } from '../src/db/localStore';
import { findStockFootage, downloadStockVideo, StockVideo } from '../src/services/stockFootage';

const PROJECT_ID = 'abac4778-84a5-486b-8675-32161d7885e0';
const rootApiDir = path.resolve(__dirname, '..');

// Rich contextual queries for replacing any duplicate b-roll beats
const THEMATIC_REPLACEMENTS: Record<number, string[]> = {
  1: [
    "dark empty parking lot street lamp fog pre dawn",
    "pre dawn moody overcast sky dark clouds",
    "wet asphalt pavement rain puddle reflection morning",
    "street corner shopping cart packed belongings overcast",
    "bundled plastic tarps gear tied sidewalk rain",
    "plastic blue sheet flapping wind rainy street",
    "senior woman crouched adjusting coat cold pavement",
    "large retail warehouse store neon yellow blue dawn",
    "furniture showroom living room modern sofa display interior",
    "tall warehouse racking aisles stacked flatpack boxes",
    "flat pack furniture assembly hands interlocking pieces",
    "commuter waiting curbside transit shelter dawn overcast",
    "older woman face dignified serious portrait overcast morning",
  ],
  2: [
    "dental clinic office reception desk computer paperwork",
    "business contract table pen corporate acquisition",
    "paper severance check envelope hands table",
    "older woman typing laptop resume job search",
    "wall calendar months turning fast passing time",
    "empty wallet cash counting bills payment rent",
    "packed suitcases duffel bags living room floor",
    "elderly woman walking urban sidewalk overcast morning",
    "senior citizen hands wrinkled holding coffee close up",
    "rain drops running down window glass vehicle night",
    "suburban commercial shopping center parking spaces night",
    "street light glowing empty parking lot asphalt wet",
    "dark cold rainy street reflections traffic headlights",
  ],
  3: [
    "industrial manufacturing plant exterior warehouse overcast",
    "tiny modular shelter white modern exterior landscape",
    "flat pack wooden crates stacked shipping pallet",
    "construction workers assembling modular wall panels",
    "factory blue collar workers diverse hands assembling",
    "worker hands securing steel bolt bracket drill",
    "aerial drone urban highway traffic Puget Sound Seattle",
    "homeless tent encampment sidewalk bridge underpass night",
    "two caseworkers walking urban sidewalk outreach clipboards",
    "caseworker talking gently elderly woman outdoor bench",
    "older woman walking away bus stop overcast street",
    "hand holding phone screen showing cozy room photo",
    "small cozy room shelf books personal items warm lamp",
    "hopeful senior woman eyes gentle smile portrait",
  ],
  4: [
    "drone aerial row of white modular tiny homes village",
    "clean small white room interior window solar light",
    "hand holding shiny brass key turn lock door",
    "older woman standing doorway looking inside shelter",
    "hand turning deadbolt lock solid door night secure",
    "morning sunlight streaming through small window wood floor",
    "peaceful senior woman resting room sunlight morning",
  ],
  5: [
    "metal mailbox house number mail delivery slot",
    "postal letter carrier uniform placing letters mailbox",
    "white paper official document envelope opening desk",
    "social worker helping senior woman paperwork office desk",
    "pamphlet resource brochure flipping hands informational",
    "highway driving evening headlights bridge Renton",
  ],
  6: [
    "senior woman neighbor smiling sitting porch morning tea",
    "two older female friends walking pathway talking",
    "laundromat interior washing machines spinning clothes",
    "two senior women smiling sharing laundry basket laundromat",
    "community pathway between tiny houses morning neighbors",
    "older adults sitting outdoor wooden benches chatting sunshine",
  ],
  7: [
    "unhcr modular refugee shelter camp desert tents white units",
    "humanitarian workers inspecting flatpack shelter components",
    "refugee family standing outside secure white shelter",
    "brass deadbolt lock mechanism turning door secure latch",
    "woman closing solid door clicking lock secure night",
    "drone aerial village tiny homes modular shelter community",
    "car driving highway freeway Puget Sound bridge overcast",
  ],
  8: [
    "calculator desk financial figures numbers spreadsheet",
    "ambulance flashing red blue emergency lights street night",
    "police cruiser strobe lights flashing city street rain",
    "hospital medical billing invoice paperwork desk",
    "caseworker checking checklist clipboard senior consultation",
    "parking lot asphalt rain reflections car headlights night",
  ],
  9: [
    "pallet shelter village perimeter fence security gate",
    "portable restroom trailer outdoor rain umbrella walking",
    "prefabricated building panel seams exterior durability inspection",
    "city council chamber hearing public testimony microphones",
    "press conference microphones podium government building",
  ],
  10: [
    "suburban apartment building exterior notice taped door",
    "hand holding pen calculating monthly budget bills",
    "eviction legal notice door clip document legal paperwork",
    "senior woman sitting kitchen table looking bills concerned",
    "social services office consultation waiting room queue",
  ],
  11: [
    "older woman buttoning blazer jacket mirror interview ready",
    "woman walking past commercial storefront morning commute",
    "dramatic dark storm clouds over highway Puget Sound rain",
    "hand reaching inside jacket pocket feeling brass key secure",
    "crowd of people crossing downtown city street crosswalk slow motion",
    "cinematic drone pull back Puget Sound sunset skyline evening lights",
  ],
};

export async function deduplicateAndEnforceUniqueness() {
  console.log('======================================================');
  console.log('🔍 Enforcing 100% Unique Footage Across Entire Project');
  console.log('======================================================');

  const project = projectsStore.findById(PROJECT_ID);
  if (!project) throw new Error('Project not found: ' + PROJECT_ID);

  const chapters = [...(project.chapters || [])];

  // 1. Collect all currently used URLs and existing files
  const allAssignedPaths = new Set<string>();
  const allUsedUrls = new Set<string>();

  for (const m of projectsStore.getUsedMedia(PROJECT_ID)) {
    if (m.url) allUsedUrls.add(m.url);
  }

  let totalClips = 0;
  let duplicatesFound = 0;

  // First pass: identify duplicates
  const pathCounts = new Map<string, number>();
  for (const ch of chapters) {
    const clips = ch.timelineJson?.clips || [];
    totalClips += clips.length;
    for (const c of clips) {
      const p = c.clipPath;
      if (p) {
        pathCounts.set(p, (pathCounts.get(p) || 0) + 1);
      }
    }
  }

  console.log(`Total clips in project: ${totalClips}`);
  console.log(`Distinct video paths: ${pathCounts.size}`);
  const duplicatePaths = Array.from(pathCounts.entries()).filter(([_, count]) => count > 1);
  console.log(`Paths appearing multiple times: ${duplicatePaths.length}`);

  // Allow local raw clips to be used AT MOST ONCE
  let cloudsUsed = false;
  let trolleyUsed = false;

  // 2. Second pass: replace duplicates with brand-new, unique stock downloads
  for (const ch of chapters) {
    const clips = ch.timelineJson?.clips || [];
    if (clips.length === 0) continue;

    console.log(`\nChecking Chapter ${ch.chapterIndex}: "${ch.title}" (${clips.length} clips)...`);
    let chapterChanged = false;

    // Output stock directory for chapter
    let chapterStockDir = path.join(rootApiDir, 'output', `ikea_ch${ch.chapterIndex}_unique_stock`);
    if (ch.timelineJson?.outputPath) {
      chapterStockDir = path.join(path.dirname(path.resolve(rootApiDir, ch.timelineJson.outputPath)), 'stock');
    }
    fs.mkdirSync(chapterStockDir, { recursive: true });

    for (let i = 0; i < clips.length; i++) {
      const clip = clips[i];
      const origPath = clip.clipPath;

      let isDuplicate = false;

      // Check if local raw clip
      if (origPath.includes('CLOUDS NEAR IKEA.mp4')) {
        if (cloudsUsed) {
          isDuplicate = true;
        } else {
          cloudsUsed = true;
        }
      } else if (origPath.includes('women with trolly near ikea.mp4')) {
        if (trolleyUsed) {
          isDuplicate = true;
        } else {
          trolleyUsed = true;
        }
      } else if (allAssignedPaths.has(origPath)) {
        isDuplicate = true;
      }

      if (isDuplicate) {
        duplicatesFound++;
        console.log(`  🔁 Clip [${i + 1}/${clips.length}] in Ch ${ch.chapterIndex} is duplicate: ${path.basename(origPath)}`);

        // Prioritize thematic curated queries over noisy spoken voiceover fragments
        const queries = THEMATIC_REPLACEMENTS[ch.chapterIndex] || THEMATIC_REPLACEMENTS[1]!;
        const queryIndex = (i + duplicatesFound) % queries.length;
        const fallbackQuery = queries[queryIndex]!;

        const spoken = (clip.spokenWords || []).map((w: any) => w.word).join(' ').trim();
        // Avoid spoken sentences if they contain common stock-confusing triggers (e.g. park, wood, trees)
        const hasTrigger = /\b(park|wood|woods|tree|trees|camp|tent|pine)\b/i.test(spoken);
        const primaryQuery = (!hasTrigger && spoken && spoken.length > 10) ? spoken : fallbackQuery;
        const backupQuery = fallbackQuery;

        console.log(`    🔍 Sourcing replacement [Query: "${primaryQuery.slice(0, 45)}..."]`);

        try {
          const result = await findStockFootage(
            primaryQuery,
            backupQuery,
            allUsedUrls,
            {
              visualSubject: fallbackQuery,
              negativeKeywords: ['forest', 'woods', 'trees', 'nature', 'camping', 'hiking', 'mountain', 'wildlife'],
              storyContext: 'Renton Seattle Washington IKEA documentary homelessness transitional shelter',
              useVisionVerification: true,
            }
          );

          if (result?.video) {
            const video = result.video;
            allUsedUrls.add(video.url);

            const filename = `unique_ch${ch.chapterIndex}_clip${i}_${Date.now().toString(36)}.mp4`;
            const destPath = path.join(chapterStockDir, filename);

            await downloadStockVideo(video, destPath);
            const relPath = path.relative(rootApiDir, destPath);

            clip.clipPath = relPath;
            allAssignedPaths.add(relPath);
            chapterChanged = true;
            console.log(`    ✅ Replaced with unique video: ${filename}`);

            projectsStore.addUsedMedia(PROJECT_ID, [{
              id: video.url,
              url: video.url,
              source: video.source,
              mediaType: 'video',
              chapterIndex: ch.chapterIndex,
              query: primaryQuery,
              usedAt: new Date().toISOString(),
            }]);
          } else {
            console.warn(`    ⚠️ Could not find replacement video for clip ${i + 1}, keeping original`);
            allAssignedPaths.add(origPath);
          }
        } catch (err: any) {
          console.error(`    ❌ Error replacing clip ${i + 1}:`, err.message);
          allAssignedPaths.add(origPath);
        }
      } else {
        allAssignedPaths.add(origPath);
      }
    }

    if (chapterChanged) {
      // Save updated timeline.json file
      if (ch.timelineJson?.outputPath) {
        const timelineDir = path.dirname(path.resolve(rootApiDir, ch.timelineJson.outputPath));
        const timelineJsonPath = path.join(timelineDir, 'timeline.json');
        fs.writeFileSync(timelineJsonPath, JSON.stringify(ch.timelineJson, null, 2), 'utf8');
        console.log(`  💾 Updated chapter timeline file: ${timelineJsonPath}`);
      }
    }
  }

  // 3. Update projectsStore
  projectsStore.update(PROJECT_ID, { chapters });
  console.log('\n======================================================');
  console.log(`🎉 Deduplication Complete! Replaced ${duplicatesFound} duplicate clips.`);
  console.log(`Total unique files now assigned: ${allAssignedPaths.size} / ${totalClips}`);
  console.log('======================================================');
}

if (require.main === module) {
  deduplicateAndEnforceUniqueness().catch((err) => {
    console.error('Fatal deduplication error:', err);
    process.exit(1);
  });
}
