import { DIRECTED_KLOEHN_BEATS } from './direct_kloehn_chapters';

let nullQueryCount = 0;
let totalLocal = 0;
for (let ch = 1; ch <= 11; ch++) {
  const beats = DIRECTED_KLOEHN_BEATS[ch] || [];
  beats.forEach((b, idx) => {
    if (b.clipFilename) {
      totalLocal++;
      if (!b.stockVideoQuery) {
        nullQueryCount++;
        console.log(`Ch ${ch} Beat ${idx} [${b.clipFilename}]: subject="${b.visualSubject}" text="${b.text.slice(0, 35)}"`);
      }
    }
  });
}
console.log(`\nTotal local beats: ${totalLocal}, with null stockVideoQuery: ${nullQueryCount}`);
