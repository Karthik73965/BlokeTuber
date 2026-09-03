import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

const envPaths = [
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../.env'),
];
for (const p of envPaths) {
  if (fs.existsSync(p)) dotenv.config({ path: p });
}

import { projectsStore } from '../src/db/localStore';
import { findStockFootage, downloadStockVideo } from '../src/services/stockFootage';

async function fix() {
  const project = projectsStore.findById('abac4778-84a5-486b-8675-32161d7885e0');
  if (!project) return;
  const chapters = [...project.chapters];
  const ch11 = chapters.find(c => c.chapterIndex === 11);
  if (!ch11 || !ch11.timelineJson) return;

  const clip13 = ch11.timelineJson.clips[13];
  console.log('Replacing clip 13 from:', clip13.clipPath);

  const res = await findStockFootage('seattle morning rain overcast pavement street', 'rainy downtown seattle road', new Set());
  if (!res?.video) throw new Error('No video found');

  const destPath = path.resolve(__dirname, '../output/ikea_ch11_2026-09-02T19-23-01_nrx1iy/stock/unique_final_clip13.mp4');
  await downloadStockVideo(res.video, destPath);

  clip13.clipPath = path.relative(path.resolve(__dirname, '..'), destPath);
  const timelineJsonPath = path.resolve(__dirname, '../output/ikea_ch11_2026-09-02T19-23-01_nrx1iy/timeline.json');
  fs.writeFileSync(timelineJsonPath, JSON.stringify(ch11.timelineJson, null, 2), 'utf8');

  projectsStore.update('abac4778-84a5-486b-8675-32161d7885e0', { chapters });
  console.log('✅ Successfully replaced final duplicate with unique video:', clip13.clipPath);
}

fix().catch(console.error);
