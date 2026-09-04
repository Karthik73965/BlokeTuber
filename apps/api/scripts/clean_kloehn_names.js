const fs = require('fs');
const path = require('path');

const storePath = path.resolve(__dirname, '../output/store/projects.json');
const data = JSON.parse(fs.readFileSync(storePath, 'utf8'));
const proj = data.find((p) => p.id === 'proj_1788520997417');
if (!proj) {
  console.log('Project not found');
  process.exit(1);
}

function cleanName(text) {
  if (!text) return '';
  let res = text;
  res = res.replace(/Gregory Cloyne/g, 'Gregory Kloehn');
  res = res.replace(/Gregory Clone/g, 'Gregory Kloehn');
  res = res.replace(/Gregory Kluin/g, 'Gregory Kloehn');
  res = res.replace(/\bCloyne\b/g, 'Kloehn');
  res = res.replace(/\bKluin\b/g, 'Kloehn');
  res = res.replace(/\bKlund\b/g, 'Kloehn');
  res = res.replace(/\bClunes Workshop\b/g, "Kloehn's Workshop");
  res = res.replace(/\bClunes\b/g, "Kloehn's");
  res = res.replace(/\bwhat clones sees\b/gi, 'what Kloehn sees');
  res = res.replace(/\bClone\b/g, 'Kloehn');
  res = res.replace(/\bfront do\.\b/g, 'front door.');
  return res;
}

let count = 0;
proj.chapters.forEach((c) => {
  const orig = c.scriptText;
  const fixed = cleanName(orig);
  if (orig !== fixed) {
    count++;
    c.scriptText = fixed;
  }
});
proj.scriptText = cleanName(proj.scriptText);
fs.writeFileSync(storePath, JSON.stringify(data, null, 2), 'utf8');

const masterPath = path.resolve(__dirname, '../uploads/transcripts/kloehn/00_FULL_MASTER_SCRIPT.txt');
if (fs.existsSync(masterPath)) {
  fs.writeFileSync(masterPath, cleanName(fs.readFileSync(masterPath, 'utf8')), 'utf8');
}

console.log(`✅ Updated ${count} chapters with accurate Gregory Kloehn name spelling!`);
