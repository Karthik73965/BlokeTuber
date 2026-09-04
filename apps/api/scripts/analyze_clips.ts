import { DIRECTED_KLOEHN_BEATS } from './direct_kloehn_chapters';

for (let ch = 1; ch <= 11; ch++) {
  const beats = DIRECTED_KLOEHN_BEATS[ch] || [];
  const localBeats = beats.filter(b => b.clipFilename);
  console.log(`\n=== Chapter ${ch} (Total Beats: ${beats.length}, Local: ${localBeats.length}) ===`);
  beats.forEach((b, idx) => {
    if (b.clipFilename) {
      console.log(`  Beat ${idx}: "${b.clipFilename}" | text: "${b.text.slice(0, 40)}"`);
    }
  });
}
