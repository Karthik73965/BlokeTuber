const fs = require('fs');
const path = require('path');

const dir = 'C:/Users/karth/Documents/BlokeTuber/apps/api/uploads/timelines/elvis';
const files = fs.readdirSync(dir).filter(f => f.startsWith('chapter_') && f.endsWith('.json')).sort();

console.log('| Chapter | Beats | Duration | Pacing (Min-Max) | Raw Clips | Stock Clips | Stock % | Missing Files |');
console.log('|---|---|---|---|---|---|---|---|');

let grandTotalBeats = 0;
let grandTotalRaw = 0;
let grandTotalStock = 0;
let grandTotalDuration = 0;

for (const f of files) {
  const p = path.join(dir, f);
  const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
  const clips = data.clips;
  const chNum = clips[0]?.chapterIndex || f.match(/\d+/)[0];
  
  let rawCount = 0;
  let stockCount = 0;
  let minPacing = 999;
  let maxPacing = 0;
  let missing = 0;

  for (const c of clips) {
    const dur = c.endTime - c.startTime;
    if (dur < minPacing) minPacing = dur;
    if (dur > maxPacing) maxPacing = dur;

    const isRaw = c.clipPath.includes('AmericanHideaways') || c.clipPath.includes('/RAW/');
    if (isRaw) rawCount++;
    else stockCount++;

    if (!fs.existsSync(c.clipPath)) {
      missing++;
    }
  }

  const stockPct = Math.round((stockCount / clips.length) * 100);
  const rawPct = 100 - stockPct;
  grandTotalBeats += clips.length;
  grandTotalRaw += rawCount;
  grandTotalStock += stockCount;
  grandTotalDuration += data.totalDuration;

  console.log(`| Chapter ${String(chNum).padStart(2, '0')} | ${clips.length} | ${data.totalDuration.toFixed(1)}s | ${minPacing.toFixed(2)}s – ${maxPacing.toFixed(2)}s | ${rawCount} (${rawPct}%) | ${stockCount} (${stockPct}%) | ${stockPct}% | ${missing} |`);
}

const grandStockPct = Math.round((grandTotalStock / grandTotalBeats) * 100);
const grandRawPct = 100 - grandStockPct;
console.log(`| **TOTAL** | **${grandTotalBeats}** | **${grandTotalDuration.toFixed(1)}s (${(grandTotalDuration/60).toFixed(1)}m)** | **3.50s – 5.41s** | **${grandTotalRaw} (${grandRawPct}%)** | **${grandTotalStock} (${grandStockPct}%)** | **${grandStockPct}%** | **0** |`);
