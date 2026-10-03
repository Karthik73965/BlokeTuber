import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const TIMELINES_DIR = path.resolve(REPO_ROOT, 'uploads/timelines/portable-toilets');
const PROJECT_ID = 'proj_1790101325660';

const BANNED_PREFIXES = [
  'he_made_a_tiny_home_out_of_por',
  'porta_potty_house_world_s_smal',
  'man_wants_to_convert_port_a_po',
  'how_a_bathroom_on_wheels_is_ch',
  'pot_growing_fire_sun_valley_ra',
];

console.log('===============================================================');
console.log('🔍 FULL DOCUMENTARY VERIFICATION AUDIT (CHAPTERS 1-11)');
console.log('===============================================================\n');

let totalBeats = 0;
let totalDuration = 0;
const allClipsUsed: string[] = [];
const bannedClipsFound: string[] = [];
const missingFiles: string[] = [];

for (let ch = 1; ch <= 11; ch++) {
  const numStr = String(ch).padStart(2, '0');
  const tlPath = path.join(TIMELINES_DIR, `chapter_${numStr}.json`);

  if (!fs.existsSync(tlPath)) {
    console.error(`❌ Chapter ${numStr} timeline is MISSING!`);
    continue;
  }

  const tl = JSON.parse(fs.readFileSync(tlPath, 'utf-8'));
  totalBeats += tl.clips.length;
  totalDuration += tl.totalDuration;

  console.log(`🎬 Chapter ${numStr}: ${tl.clips.length} beats, ${tl.totalDuration.toFixed(1)}s`);

  tl.clips.forEach((c: any, idx: number) => {
    const filename = path.basename(c.clipPath);
    allClipsUsed.push(filename);

    if (BANNED_PREFIXES.some(p => filename.startsWith(p))) {
      bannedClipsFound.push(`Ch${numStr}_B${idx + 1}: ${filename}`);
    }

    if (!fs.existsSync(c.clipPath)) {
      missingFiles.push(`Ch${numStr}_B${idx + 1}: ${c.clipPath}`);
    }
  });
}

// Duplicates check
const uniqueClips = new Set(allClipsUsed);
const duplicates = allClipsUsed.filter((item, index) => allClipsUsed.indexOf(item) !== index);

console.log('\n---------------------------------------------------------------');
console.log(`📊 Total Chapters: 11`);
console.log(`⏱️ Total Runtime: ${(totalDuration / 60).toFixed(1)} minutes (${totalDuration.toFixed(1)}s)`);
console.log(`🎯 Total Beats: ${totalBeats}`);
console.log(`🔒 Unique Clips: ${uniqueClips.size}`);
console.log(`🔁 Duplicates Found: ${duplicates.length}`);
if (duplicates.length > 0) {
  console.error('❌ DUPLICATES:', duplicates);
}

console.log(`🚫 Banned Portable-Toilet Clips Found: ${bannedClipsFound.length}`);
if (bannedClipsFound.length > 0) {
  console.error('❌ BANNED CLIPS:', bannedClipsFound);
}

console.log(`📁 Missing Video Files on Disk: ${missingFiles.length}`);
if (missingFiles.length > 0) {
  console.error('❌ MISSING FILES:', missingFiles);
}

// Chapter 1 Semantic Check
const ch1Path = path.join(TIMELINES_DIR, 'chapter_01.json');
if (fs.existsSync(ch1Path)) {
  const ch1 = JSON.parse(fs.readFileSync(ch1Path, 'utf-8'));
  console.log('\n---------------------------------------------------------------');
  console.log('🚗 Chapter 1 Semantic Visual Audit:');
  console.log('  B01 (Morning light):', path.basename(ch1.clips[0].clipPath));
  console.log('  B02 (Wooden slide & rocks):', path.basename(ch1.clips[1].clipPath));
  console.log('  B04 (Cars traffic):', path.basename(ch1.clips[3].clipPath));
  console.log('  B05 (Phones out filming):', path.basename(ch1.clips[4].clipPath));
  console.log('  B06 (Climbing dirt path):', path.basename(ch1.clips[5].clipPath));
  console.log('  B07 (Small toy cars):', path.basename(ch1.clips[6].clipPath));
  console.log('  B09 (Hand-built shelter):', path.basename(ch1.clips[8].clipPath));
  console.log('  B14 (Jose Fuentes straw hat):', path.basename(ch1.clips[13].clipPath));
}

// Store check
const storePaths = [
  path.resolve(REPO_ROOT, 'apps/api/output/store/projects.json'),
  path.resolve(REPO_ROOT, 'output/store/projects.json'),
];

console.log('\n---------------------------------------------------------------');
console.log('💾 Store Sync Audit:');
storePaths.forEach(sp => {
  if (fs.existsSync(sp)) {
    const store = JSON.parse(fs.readFileSync(sp, 'utf-8'));
    const p = store.find((x: any) => x.id === PROJECT_ID);
    const readyCount = p?.chapters?.filter((c: any) => c.status === 'ready_to_render' && c.timelineJson)?.length || 0;
    console.log(`  ${path.relative(REPO_ROOT, sp)}: Project "${p?.title}" -> ${readyCount}/11 chapters ready_to_render with timelineJson`);
  }
});

console.log('\n===============================================================');
if (duplicates.length === 0 && bannedClipsFound.length === 0 && missingFiles.length === 0) {
  console.log('🎉 100% PERFECT AUDIT PASSED! READY FOR USER DASHBOARD REVIEW!');
} else {
  console.error('❌ AUDIT FAILED! SEE ERRORS ABOVE.');
}
console.log('===============================================================\n');
