import fs from 'fs';

const data = JSON.parse(fs.readFileSync('uploads/all_chapters_beats.json', 'utf-8'));

for (let i = 3; i <= 13; i++) {
  const ch = data[i];
  if (!ch) continue;
  console.log(`\n======================================================`);
  console.log(`CHAPTER ${i}: ${ch.title} (${ch.clips.length} beats, ~${Math.round(ch.duration)}s)`);
  console.log(`======================================================`);
  const fullText = ch.clips.map((c: any) => c.text).join(' ');
  console.log(fullText);
}
