const fs = require('fs');
const path = require('path');

const dir = 'uploads/raw/proj_dome_villages/probe_frames/inter_detail';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.jpg')).sort();
console.log('Total files in inter_detail:', files.length);

// Let's print out every 5th file to check
for (let i = 0; i < files.length; i += 4) {
  console.log(files[i]);
}
