const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const dir = path.resolve('uploads/raw/proj_ambulance/stock');
fs.readdirSync(dir).filter(f => f.endsWith('.mp4')).forEach(f => {
  const videoPath = path.join(dir, f);
  const outPath = path.join(dir, f.replace('.mp4', '.jpg'));
  try {
    execSync(`ffmpeg -ss 2 -i "${videoPath}" -vframes 1 -q:v 2 "${outPath}" -y`, { stdio: 'pipe' });
    console.log('Sample created:', path.basename(outPath));
  } catch (err) {
    console.error('Error sampling', f, err.message);
  }
});
