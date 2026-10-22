const { execSync } = require('child_process');
const fs = require('fs');

const dir = 'uploads/raw/proj_dome_villages/downloads';
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.mp4')) continue;
  try {
    const probe = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of json "${dir}/${f}"`, { encoding: 'utf-8' });
    const info = JSON.parse(probe).streams[0];
    console.log(f.padEnd(38), info.width + 'x' + info.height, parseFloat(info.duration).toFixed(1) + 's');
  } catch(e) {
    console.log('Error probing', f, e.message);
  }
}

