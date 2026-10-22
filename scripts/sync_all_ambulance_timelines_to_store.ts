import fs from 'fs';
import path from 'path';

const API_STORE = path.resolve('apps/api/output/store/projects.json');
const ROOT_STORE = path.resolve('output/store/projects.json');
const TIMELINE_DIR = path.resolve('uploads/timelines/ambulance');

const CHAPTER_TITLES = [
  { num: 1, title: 'Chapter 01: Cold Open', file: '1 -Cold.mp3', video: 'output/ambulance_rendered/chapter_01.mp4', status: 'completed' },
  { num: 2, title: 'Chapter 02: What An Ambulance Is', file: '2 - WHAT AN AMBULANCE.mp3', status: 'staged' },
  { num: 3, title: 'Chapter 03: Why Is It So Cheap', file: '3- WHY IS ITSO CHEAP.mp3', status: 'staged' },
  { num: 4, title: 'Chapter 04: Dale', file: '4 - DALE.mp3', status: 'staged' },
  { num: 5, title: 'Chapter 05: A Day Inside', file: '5 - A DAY INSIDE.mp3', status: 'staged' },
  { num: 6, title: 'Chapter 06: The Night', file: '6 - THE NIGHT.mp3', status: 'staged' },
  { num: 7, title: "Chapter 07: The Veteran's Blueprint", file: "7 - THE VETERAN'SBLUEPRINT.mp3", status: 'staged' },
  { num: 8, title: 'Chapter 08: The Legal Wall', file: '8 - THELEGALWALL.mp3', status: 'staged' },
  { num: 9, title: 'Chapter 09: When It Goes Wrong', file: '9 -  WHEN IT GOESWRONG.mp3', status: 'staged' },
  { num: 10, title: 'Chapter 10: The Lot Is The Medicine', file: '10 - THELOTISTHE MEDICINE.mp3', status: 'staged' },
  { num: 11, title: "Chapter 11: Dale's Year", file: "11 -  DALE'S YEAR.mp3", status: 'staged' },
  { num: 12, title: 'Chapter 12: Closing', file: '12 - close.mp3', status: 'staged' },
];

const now = new Date().toISOString();

const chapters = CHAPTER_TITLES.map((c) => {
  const pad = String(c.num).padStart(2, '0');
  const tlPath = path.join(TIMELINE_DIR, `chapter_${pad}_final.json`);
  let tlJson = undefined;
  if (fs.existsSync(tlPath)) {
    tlJson = JSON.parse(fs.readFileSync(tlPath, 'utf8'));
  }
  return {
    id: `chap_ambulance_${pad}`,
    projectId: 'proj_ambulance_hideaways',
    chapterIndex: c.num,
    title: c.title,
    voiceoverFileName: c.file,
    status: c.status,
    videoPath: c.video,
    timelineJson: tlJson,
    createdAt: now,
    updatedAt: now,
  };
});

const ambulanceProject = {
  id: 'proj_ambulance_hideaways',
  name: "The $1,500 Ambulance: Dale's Winter Shelter",
  description: "American Hideaways: How a 63-year-old Army veteran converted a retired municipal ambulance into an insulated winter home in Spokane, Washington.",
  status: 'processing',
  createdAt: now,
  updatedAt: now,
  usedMedia: [],
  chapters,
};

for (const storePath of [API_STORE, ROOT_STORE]) {
  if (!fs.existsSync(storePath)) continue;
  const raw = fs.readFileSync(storePath, 'utf8');
  const projects = JSON.parse(raw);
  const existingIdx = projects.findIndex((p: any) => p.id === 'proj_ambulance_hideaways');
  if (existingIdx >= 0) {
    projects[existingIdx] = {
      ...projects[existingIdx],
      chapters,
      updatedAt: now,
    };
  } else {
    projects.push(ambulanceProject);
  }
  fs.writeFileSync(storePath, JSON.stringify(projects, null, 2), 'utf8');
  console.log(`Updated project store: ${storePath}`);
}

console.log('All 12 chapters synced with full timelines into stores!');
