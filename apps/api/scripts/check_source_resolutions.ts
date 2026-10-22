import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const dir = path.resolve('uploads/raw/proj_dome_villages');
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.mp4'));
const prefixSamples: Record<string, string> = {};

files.forEach((f) => {
  const p = f.split('_clip_')[0];
  if (p && !prefixSamples[p]) prefixSamples[p] = f;
});

console.log('--- SOURCE RESOLUTIONS ---');
for (const [prefix, sample] of Object.entries(prefixSamples)) {
  const fullPath = path.join(dir, sample);
  const out = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${fullPath}"`, {
    encoding: 'utf-8',
  }).trim();
  console.log(`${prefix}: ${out}`);
}

const dlDir = path.resolve('uploads/raw/proj_dome_villages/downloads');
if (fs.existsSync(dlDir)) {
  console.log('\n--- DOWNLOADED SOURCES RESOLUTIONS ---');
  for (const f of fs.readdirSync(dlDir).filter((f) => f.endsWith('.mp4'))) {
    const fullPath = path.join(dlDir, f);
    const out = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 "${fullPath}"`, {
      encoding: 'utf-8',
    }).trim();
    console.log(`${f}: ${out}`);
  }
}

