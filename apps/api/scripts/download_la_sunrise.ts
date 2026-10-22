import fs from 'fs';
import path from 'path';

const PEXELS_KEY = 'IsEyAaH3KB99divi9zwyCzIfmZLD6DEmexyGV6L8VlaLzrNnZ6atuMEa';
const DOWNLOADS_DIR = path.resolve(__dirname, '../../../uploads/raw/proj_dome_villages/downloads');

async function downloadById(id: number, name: string) {
  const outPath = path.join(DOWNLOADS_DIR, `${name}.mp4`);
  if (fs.existsSync(outPath) && fs.statSync(outPath).size > 500000) {
    console.log(`⏩ ${name} already exists.`);
    return;
  }
  console.log(`Fetching Pexels video ${id} for ${name}...`);
  const res = await fetch(`https://api.pexels.com/videos/videos/${id}`, {
    headers: { Authorization: PEXELS_KEY }
  });
  const v = await res.json() as any;
  const files = v.video_files || [];
  const bestFile = files.find((f: any) => f.width === 1920 && f.height === 1080)
    || files.find((f: any) => f.width >= 1280)
    || files[0];

  console.log(`Downloading ${bestFile.link.slice(0, 50)}...`);
  const vRes = await fetch(bestFile.link);
  const buf = Buffer.from(await vRes.arrayBuffer());
  fs.writeFileSync(outPath, buf);
  console.log(`✅ Saved ${name} (${(buf.length / 1024 / 1024).toFixed(1)} MB)`);
}

async function main() {
  await downloadById(35887000, 'pexels_la_sunrise_golden');
  await downloadById(30614712, 'pexels_la_skyline_dawn');
}

main().catch(console.error);
