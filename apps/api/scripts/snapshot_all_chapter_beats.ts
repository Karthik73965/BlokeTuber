import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const SNAPSHOTS_DIR = path.resolve(REPO_ROOT, 'uploads/beat_snapshots');
fs.mkdirSync(SNAPSHOTS_DIR, { recursive: true });

async function main() {
  console.log('Generating snapshots for Chapter 2 beats to inspect visual variety...');
  const ch2Path = path.resolve(REPO_ROOT, 'uploads/timelines/dome/chapter_02_final.json');
  const ch2 = JSON.parse(fs.readFileSync(ch2Path, 'utf-8'));

  const results: any[] = [];

  for (const clip of ch2.clips) {
    const snapName = `ch02_beat_${String(clip.beatIndex).padStart(2, '0')}.jpg`;
    const outPath = path.join(SNAPSHOTS_DIR, snapName);
    const midTime = ((clip.endTime - clip.startTime) / 2).toFixed(2);

    try {
      execSync(`ffmpeg -y -ss ${midTime} -i "${clip.clipPath}" -vframes 1 "${outPath}"`, { stdio: 'pipe' });
    } catch (e: any) {
      console.error(`Failed to snapshot beat ${clip.beatIndex}:`, e.message);
    }

    results.push({
      beatIndex: clip.beatIndex,
      text: clip.text,
      clipFile: path.basename(clip.clipPath),
      snapshot: snapName,
    });
  }

  console.log(JSON.stringify(results, null, 2));
}

main().catch(console.error);
