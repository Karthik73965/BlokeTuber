const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const audioDir = path.resolve(__dirname, '../output/showcase_12_overlays/audio');
const finalAudio = path.resolve(__dirname, '../output/showcase_12_overlays/master_overlays_narration.mp3');

console.log('Stitching 12 voice clips into a synchronized 42s narration track (3.5s per overlay)...');

const paddedFiles = [];

for (let i = 0; i < 12; i++) {
  const src = path.join(audioDir, `voice_${i}.wav`);
  const dst = path.join(audioDir, `padded_${i}.wav`);
  // Pad each audio file to exactly 3.5 seconds
  execSync(`ffmpeg -y -i "${src}" -af "apad" -t 3.5 "${dst}"`, { stdio: 'pipe' });
  paddedFiles.push(dst);
}

// Concat all 12 padded files
const concatTxt = path.join(audioDir, 'concat.txt');
fs.writeFileSync(concatTxt, paddedFiles.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n'), 'utf-8');

execSync(`ffmpeg -y -f concat -safe 0 -i "${concatTxt}" -c:a libmp3lame -ar 44100 -b:a 192k "${finalAudio}"`, { stdio: 'pipe' });

console.log('Master synchronized narration audio created at:', finalAudio);
console.log('Size:', fs.statSync(finalAudio).size);
