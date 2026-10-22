import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(__dirname, '../../..');
const storeApi = path.resolve(repoRoot, 'apps/api/output/store/projects.json');
const storeRoot = path.resolve(repoRoot, 'output/store/projects.json');
const timelinesDir = path.resolve(repoRoot, 'uploads/timelines/dome');

const files = fs.readdirSync(timelinesDir).filter(f => f.startsWith('chapter_') && f.endsWith('_final.json'));

console.log(`Found ${files.length} finalized chapter timelines in ${timelinesDir}:`, files);

for (const storePath of [storeApi, storeRoot]) {
  if (!fs.existsSync(storePath)) continue;
  const raw = fs.readFileSync(storePath, 'utf-8');
  const projects = JSON.parse(raw);
  const p = projects.find((x: any) => x.id === 'proj_dome_villages');
  if (!p || !p.chapters) continue;

  let updatedCount = 0;
  for (const f of files) {
    const match = f.match(/chapter_(\d+)_final\.json/);
    if (!match) continue;
    const chIdx = parseInt(match[1], 10);
    const tlPath = path.resolve(timelinesDir, f);
    const tlData = JSON.parse(fs.readFileSync(tlPath, 'utf-8'));

    const ch = p.chapters.find((c: any) => c.chapterIndex === chIdx);
    if (ch) {
      ch.timelineJson = tlData;
      ch.updatedAt = new Date().toISOString();
      updatedCount++;
    }
  }

  fs.writeFileSync(storePath, JSON.stringify(projects, null, 2), 'utf-8');
  console.log(`✅ Synced ${updatedCount} chapters in ${storePath}`);
}
