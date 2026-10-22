const fs = require('fs');
const path = require('path');

const dir = path.resolve('uploads/timelines/ambulance');
if (!fs.existsSync(dir)) {
  console.log('Dir does not exist:', dir);
  process.exit(1);
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
console.log('========================================================================');
console.log('VALIDATING ALL AMBULANCE TIMELINES');
console.log('========================================================================');

let allPass = true;

for (const file of files) {
  const p = path.join(dir, file);
  const data = JSON.parse(fs.readFileSync(p, 'utf8'));
  const clips = data.clips || [];
  
  const badLayout = clips.filter(c => c.layout !== 'full_bleed_cinematic').length;
  const withOverlay = clips.filter(c => c.overlay).length;
  const withTransition = clips.filter(c => c.transitionType && c.transitionType !== 'cut' && c.transitionType !== 'none').length;
  const missingClips = clips.filter(c => !fs.existsSync(c.clipPath)).length;
  const withCallouts = clips.filter(c => c.callout && c.callout.line1).length;
  
  const ok = (badLayout === 0 && withOverlay === 0 && withTransition === 0 && missingClips === 0);
  if (!ok) allPass = false;
  
  console.log(`${ok ? '✅' : '❌'} [${file}]`);
  console.log(`   Beats: ${clips.length} | Dur: ${Number(data.totalDuration).toFixed(1)}s | Callouts: ${withCallouts}`);
  console.log(`   BadLayout: ${badLayout} | Overlays: ${withOverlay} | NonCutTrans: ${withTransition} | MissingClips: ${missingClips}`);
}

console.log('========================================================================');
console.log(allPass ? '🎉 ALL TIMELINES FULLY VALIDATED AND COMPLIANT!' : '⚠️ SOME TIMELINES NEED FIXING');
console.log('========================================================================');
