const fs = require('fs');
const path = require('path');

const titles = [
  'Cold Open & The $150 Pod',
  'The Promise & Real Limits',
  'What $150 Buys & The 60-lb Shell',
  'The Arc & Frameless Physics',
  'The Material: Fluted Polypropylene',
  'The Man Behind It: Paul Elkins',
  'The Family of Designs: Shelters & Pushcarts',
  'The $2 Barrel Bolt & Psychological Sleep',
  'The Wheels: Surviving Grants Pass & Encampment Sweeps',
  'The $12 Stove & Regaining Agency',
  'Why Shelter Beds Stay Empty: Pets, Partners & Possessions',
  'The Honest Part: Knives, Fire, Condensation & Moral Hazard',
  "What It's Actually For: Surviving February Nights",
  'Closing: Legacy & Inflatable Heat Shelters'
];

const audioFiles = [
  'ch01_cold.mp3',
  'ch02_promise.mp3',
  'ch03_what_150_buys.mp3',
  'ch04_arc.mp3',
  'ch05_material.mp3',
  'ch06_man_behind_it.mp3',
  'ch07_family_of_designs.mp3',
  'ch08_bolt.mp3',
  'ch09_wheels.mp3',
  'ch10_stove.mp3',
  'ch11_why_beds_stay_empty.mp3',
  'ch12_honest_part.mp3',
  'ch13_what_its_actually_for.mp3',
  'ch14_closing.mp3'
];

const proj = {
  id: 'proj_camperbike_hideaways',
  name: 'American Hideaways: The $150 Camper Bike',
  title: 'American Hideaways: The $150 Camper Bike',
  topic: 'Paul Elkins $150 Fluted Plastic Nomad Bicycle Camper',
  status: 'in_progress',
  targetDuration: 1184.4,
  style: 'documentary',
  chapters: titles.map((t, idx) => ({
    id: 'proj_camperbike_hideaways_ch' + String(idx + 1).padStart(2, '0'),
    projectId: 'proj_camperbike_hideaways',
    chapterIndex: idx + 1,
    title: t,
    voiceoverFileName: audioFiles[idx],
    status: 'pending',
    videoPath: path.resolve('output/camperbike_rendered', 'chapter_' + String(idx + 1).padStart(2, '0') + '.mp4'),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }))
};

['output/store/projects.json', 'apps/api/output/store/projects.json'].forEach(fp => {
  if (fs.existsSync(fp)) {
    const list = JSON.parse(fs.readFileSync(fp, 'utf8'));
    const existing = list.findIndex(x => x.id === proj.id);
    if (existing >= 0) list[existing] = proj;
    else list.push(proj);
    fs.writeFileSync(fp, JSON.stringify(list, null, 2));
    console.log('Saved project to ' + fp);
  }
});
