import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW_DIR = path.resolve(REPO_ROOT, 'uploads/raw/proj_dome_villages');
const DOWNLOADS_DIR = path.resolve(RAW_DIR, 'downloads');
const SCREENSHOTS_DIR = path.resolve(RAW_DIR, 'screenshots');
const SNAPSHOTS_OUT_DIR = path.resolve(REPO_ROOT, 'uploads/beat_snapshots/ch02_perfect');
const TIMELINE_PATH = path.resolve(REPO_ROOT, 'uploads/timelines/dome/chapter_02_final.json');
const STORE_API_PATH = path.resolve(REPO_ROOT, 'apps/api/output/store/projects.json');
const STORE_ROOT_PATH = path.resolve(REPO_ROOT, 'output/store/projects.json');

fs.mkdirSync(RAW_DIR, { recursive: true });
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
fs.mkdirSync(SNAPSHOTS_OUT_DIR, { recursive: true });

interface BeatDef {
  beatIndex: number;
  text: string;
  startTime: number;
  endTime: number;
  sourceFile: string;
  sourceStart: number;
  sourceDuration: number;
  slug: string;
  callout?: any;
  sfx?: string;
}

const BEAT_DEFS: BeatDef[] = [
  {
    beatIndex: 0,
    text: "Ted Hayes was an activist who believed you could not speak for the homeless from a comfortable",
    startTime: 0,
    endTime: 4.88,
    sourceFile: 'ted_hayes_civil_rights_hd.mp4',
    sourceStart: 1.0,
    sourceDuration: 5.5,
    slug: 'ch02_b00_ted_hayes_intro',
    callout: {
      type: 'editorial_lower_third',
      line1: 'TED HAYES',
      line2: 'CIVIL RIGHTS ACTIVIST • JUSTICEVILLE FOUNDER',
      themeColor: 'crimson',
      startTime: 0.4,
      endTime: 4.2,
    },
    sfx: 'stat_click.mp3',
  },
  {
    beatIndex: 1,
    text: "house in the suburbs. In 1985 he chose to become",
    startTime: 4.88,
    endTime: 8.54,
    sourceFile: 'pexels_suburbs_aerial.mp4',
    sourceStart: 2.0,
    sourceDuration: 4.5,
    slug: 'ch02_b01_suburbs_aerial',
    callout: {
      type: 'location_badge',
      line1: 'SUBURBAN AMERICA',
      line2: 'THE COMFORTABLE DIVIDE',
      themeColor: 'crimson',
      startTime: 0.3,
      endTime: 3.2,
    },
    sfx: 'paper_slide.mp3',
  },
  {
    beatIndex: 2,
    text: "homeless himself and led a group onto an empty",
    startTime: 8.54,
    endTime: 12.2,
    sourceFile: 'skid_row_la_state_of_emergency.mp4',
    sourceStart: 50.0,
    sourceDuration: 4.5,
    slug: 'ch02_b02_skid_row_tents_street',
  },
  {
    beatIndex: 3,
    text: "lot near Skid Row. They called it Justiceville. For",
    startTime: 12.2,
    endTime: 15.65,
    sourceFile: 'pexels_empty_lot.mp4',
    sourceStart: 1.0,
    sourceDuration: 4.5,
    slug: 'ch02_b03_empty_lot_justiceville',
    callout: {
      type: 'location_badge',
      line1: 'JUSTICEVILLE • 1985',
      line2: 'VACANT LOT NEAR SKID ROW',
      themeColor: 'crimson',
      startTime: 0.3,
      endTime: 3.2,
    },
    sfx: 'subtle_hit.mp3',
  },
  {
    beatIndex: 4,
    text: "five months it ran as a self-sustaining camp",
    startTime: 15.65,
    endTime: 19.1,
    sourceFile: 'pexels_tents_camp.mp4',
    sourceStart: 3.0,
    sourceDuration: 4.5,
    slug: 'ch02_b04_skid_row_tents_camp',
  },
  {
    beatIndex: 5,
    text: "until the city shut it down. Hayes was arrested,",
    startTime: 19.1,
    endTime: 22.6,
    sourceFile: 'pexels_police_siren.mp4',
    sourceStart: 1.0,
    sourceDuration: 4.5,
    slug: 'ch02_b05_police_arrest',
    callout: {
      type: 'editorial_lower_third',
      line1: 'POLICE CRACKDOWN',
      line2: 'CITY SHUTS DOWN JUSTICEVILLE',
      themeColor: 'crimson',
      startTime: 0.3,
      endTime: 3.2,
    },
    sfx: 'subtle_hit.mp3',
  },
  {
    beatIndex: 6,
    text: "jailed, and went on a 35-day fast in protest.",
    startTime: 22.6,
    endTime: 26.5,
    sourceFile: 'pexels_street_night.mp4',
    sourceStart: 1.0,
    sourceDuration: 4.5,
    slug: 'ch02_b06_solitary_night_fast',
  },
  {
    beatIndex: 7,
    text: "Backed by the ACLU, he eventually beat the charges.",
    startTime: 26.5,
    endTime: 30.6,
    sourceFile: 'pixabay_courthouse_162047.mp4',
    sourceStart: 2.0,
    sourceDuration: 4.5,
    slug: 'ch02_b07_aclu_legal_gavel',
    callout: {
      type: 'editorial_lower_third',
      line1: 'ACLU LEGAL VICTORY',
      line2: 'ALL CHARGES DISMISSED IN COURT',
      themeColor: 'crimson',
      startTime: 0.3,
      endTime: 3.5,
    },
    sfx: 'paper_slide.mp3',
  },
  {
    beatIndex: 8,
    text: "Then he kept sleeping outside for years afterward,",
    startTime: 30.6,
    endTime: 34.4,
    sourceFile: 'pexels_4062026.mp4',
    sourceStart: 1.0,
    sourceDuration: 4.5,
    slug: 'ch02_b08_sleeping_outside_sidewalk',
  },
  {
    beatIndex: 9,
    text: "by choice because he had come to a conclusion about the help on offer.",
    startTime: 34.4,
    endTime: 37.3,
    sourceFile: 'ted_hayes_civil_rights_hd.mp4',
    sourceStart: 25.0,
    sourceDuration: 3.8,
    slug: 'ch02_b09_ted_hayes_conviction',
  },
  {
    beatIndex: 10,
    text: "His convictions were not a stunt.",
    startTime: 37.3,
    endTime: 40.2,
    sourceFile: 'skid_row_la_state_of_emergency.mp4',
    sourceStart: 45.0,
    sourceDuration: 3.8,
    slug: 'ch02_b10_skid_row_reality',
  },
  {
    beatIndex: 11,
    text: "Hayes would remain homeless for eight years and",
    startTime: 40.2,
    endTime: 43.4,
    sourceFile: 'pexels_8076901.mp4',
    sourceStart: 2.0,
    sourceDuration: 4.0,
    slug: 'ch02_b11_eight_years_homeless',
  },
  {
    beatIndex: 12,
    text: "in that same stretch he even ran as an",
    startTime: 43.4,
    endTime: 46.5,
    sourceFile: 'pexels_ballot_election.mp4',
    sourceStart: 1.5,
    sourceDuration: 4.0,
    slug: 'ch02_b12_ballot_candidate',
    callout: {
      type: 'editorial_lower_third',
      line1: 'MAYORAL RACE • 1993',
      line2: 'RUNNING FROM THE STREETS',
      themeColor: 'crimson',
      startTime: 0.3,
      endTime: 2.9,
    },
    sfx: 'paper_slide.mp3',
  },
  {
    beatIndex: 13,
    text: "official ballad candidate for mayor of Los Angeles",
    startTime: 46.5,
    endTime: 50.4,
    sourceFile: 'la_city_hall_drone_clean.mp4',
    sourceStart: 4.0,
    sourceDuration: 4.8,
    slug: 'ch02_b13_la_city_hall_twilight',
    callout: {
      type: 'location_badge',
      line1: 'LOS ANGELES CITY HALL',
      line2: 'OFFICIAL MAYORAL BALLOT',
      themeColor: 'crimson',
      startTime: 0.3,
      endTime: 3.5,
    },
    sfx: 'stat_click.mp3',
  },
  {
    beatIndex: 14,
    text: "on a campaign budget of about $3,000. He finished",
    startTime: 50.4,
    endTime: 54.2,
    sourceFile: 'pexels_la_skyline.mp4',
    sourceStart: 5.0,
    sourceDuration: 4.8,
    slug: 'ch02_b14_la_skyline_budget',
    callout: {
      type: 'editorial_lower_third',
      line1: 'CAMPAIGN BUDGET: $3,000',
      line2: 'A FIELD OF 24 CANDIDATES',
      themeColor: 'crimson',
      startTime: 0.3,
      endTime: 3.5,
    },
    sfx: 'paper_slide.mp3',
  },
  {
    beatIndex: 15,
    text: "in a tie for ninth place in a field of 24.",
    startTime: 54.2,
    endTime: 57.7,
    sourceFile: 'la_city_hall_drone_clean.mp4',
    sourceStart: 18.0,
    sourceDuration: 4.5,
    slug: 'ch02_b15_la_city_hall_tower',
  },
  {
    beatIndex: 16,
    text: "He was not a man who waited for permission. He had",
    startTime: 57.7,
    endTime: 61.1,
    sourceFile: 'ted_hayes_civil_rights_hd.mp4',
    sourceStart: 60.0,
    sourceDuration: 4.2,
    slug: 'ch02_b16_ted_hayes_no_permission',
  },
  {
    beatIndex: 17,
    text: "watched shelter after shelter fail in the same way.",
    startTime: 61.1,
    endTime: 64.2,
    sourceFile: 'broll_empty_shelter.mp4',
    sourceStart: 0.5,
    sourceDuration: 4.0,
    slug: 'ch02_b17_shelter_failure_cots',
    callout: {
      type: 'editorial_lower_third',
      line1: 'CONGREGATE SHELTERS',
      line2: 'THE FAILED TRADITIONAL MODEL',
      themeColor: 'crimson',
      startTime: 0.3,
      endTime: 2.8,
    },
    sfx: 'subtle_hit.mp3',
  },
  {
    beatIndex: 18,
    text: "Big rooms, rows of costs, no privacy,",
    startTime: 64.2,
    endTime: 67.5,
    sourceFile: 'broll_empty_shelter.mp4',
    sourceStart: 8.5,
    sourceDuration: 4.2,
    slug: 'ch02_b18_rows_of_cots_gymnasium',
  },
  {
    beatIndex: 19,
    text: "and rules that treated grown adults like inmates.",
    startTime: 67.5,
    endTime: 70.5,
    sourceFile: 'broll_shelter_bunk.mp4',
    sourceStart: 0.5,
    sourceDuration: 3.8,
    slug: 'ch02_b19_shelter_rules_intake',
  },
  {
    beatIndex: 20,
    text: "Plenty of people would rather sleep in a doorway",
    startTime: 70.5,
    endTime: 73.5,
    sourceFile: 'pexels_4062026.mp4',
    sourceStart: 6.0,
    sourceDuration: 3.8,
    slug: 'ch02_b20_sleep_doorway_sidewalk',
  },
  {
    beatIndex: 21,
    text: "than hand over the last piece of their independence",
    startTime: 73.5,
    endTime: 76.4,
    sourceFile: 'pexels_8076901.mp4',
    sourceStart: 8.0,
    sourceDuration: 3.8,
    slug: 'ch02_b21_independence_sleeping_rough',
  },
  {
    beatIndex: 22,
    text: "at a shelter door. So Hayes asked a question",
    startTime: 76.4,
    endTime: 79.3,
    sourceFile: 'pexels_16212509.mp4',
    sourceStart: 2.0,
    sourceDuration: 3.8,
    slug: 'ch02_b22_sleeping_outside_gates',
  },
  {
    beatIndex: 23,
    text: "almost nobody in city government was asking.",
    startTime: 79.3,
    endTime: 82.7,
    sourceFile: 'la_city_hall_drone_clean.mp4',
    sourceStart: 34.0,
    sourceDuration: 4.2,
    slug: 'ch02_b23_city_hall_unasked_question',
    callout: {
      type: 'editorial_lower_third',
      line1: 'THE UNASKED QUESTION',
      line2: 'CITY HALL\'S BLIND SPOT',
      themeColor: 'crimson',
      startTime: 0.3,
      endTime: 3.0,
    },
    sfx: 'paper_slide.mp3',
  },
  {
    beatIndex: 24,
    text: "What if the help itself was the thing people couldn't accept?",
    startTime: 82.7,
    endTime: 86.13,
    sourceFile: 'ted_hayes_civil_rights_hd.mp4',
    sourceStart: 95.0,
    sourceDuration: 4.5,
    slug: 'ch02_b24_ted_hayes_climax',
  },
];

console.log('🚀 BUILDING PERFECT CHAPTER 02 TIMELINE & SLICES...');

const finalClips: any[] = [];

for (const def of BEAT_DEFS) {
  const srcPath = path.resolve(DOWNLOADS_DIR, def.sourceFile);
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Required source file missing: ${srcPath}`);
  }

  const clipFilename = `${def.slug}.mp4`;
  const clipOutPath = path.resolve(RAW_DIR, clipFilename);
  const p1Path = path.resolve(SCREENSHOTS_DIR, `${def.slug}_p1.jpg`);
  const p2Path = path.resolve(SCREENSHOTS_DIR, `${def.slug}_p2.jpg`);
  const snapOutPath = path.resolve(SNAPSHOTS_OUT_DIR, `beat_${String(def.beatIndex).padStart(2, '0')}.jpg`);

  console.log(`\n[Beat ${def.beatIndex}] Slicing: ${clipFilename} from ${def.sourceFile} @ ${def.sourceStart}s...`);

  // 1. Slice MP4
  const sliceCmd = `ffmpeg -y -ss ${def.sourceStart} -i "${srcPath}" -t ${def.sourceDuration} -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -c:v libx264 -preset fast -crf 20 -c:a aac -b:a 128k -movflags +faststart "${clipOutPath}"`;
  execSync(sliceCmd, { stdio: 'pipe' });

  // 2. Extract preview keyframes
  const ss1Cmd = `ffmpeg -y -ss 0.8 -i "${clipOutPath}" -vframes 1 -q:v 2 "${p1Path}"`;
  const ss2Cmd = `ffmpeg -y -ss 2.0 -i "${clipOutPath}" -vframes 1 -q:v 2 "${p2Path}"`;
  execSync(ss1Cmd, { stdio: 'pipe' });
  execSync(ss2Cmd, { stdio: 'pipe' });

  // 3. Extract verified beat snapshot for review
  execSync(`copy /Y "${p1Path}" "${snapOutPath}"`, { stdio: 'pipe', shell: 'cmd.exe' });

  // 4. Construct clip object
  const clipObj: any = {
    beatIndex: def.beatIndex,
    chapterIndex: 2,
    text: def.text,
    startTime: def.startTime,
    endTime: def.endTime,
    clipPath: clipOutPath,
    mediaType: 'video',
    layout: 'full_bleed_cinematic',
    kenBurns: true,
    transitionType: def.beatIndex === 0 ? 'cut' : 'crossfade',
    transitionDuration: def.beatIndex === 0 ? 0 : 0.35,
    numberOverlays: [],
    overlay: 'none',
    callout: def.callout || null,
  };

  if (def.sfx) {
    clipObj.sfxPath = path.resolve(REPO_ROOT, `packages/remotion-video/public/sfx/${def.sfx}`);
    clipObj.sfxVolume = 0.15;
  }

  finalClips.push(clipObj);
}

// 5. Build Timeline JSON
const timelineData = {
  masterAudioPath: path.resolve(REPO_ROOT, 'uploads/audio/2 - The Man Who Slept Outside.mp3'),
  totalDuration: 86.125714,
  clips: finalClips,
};

fs.writeFileSync(TIMELINE_PATH, JSON.stringify(timelineData, null, 2), 'utf-8');
console.log(`\n💾 Saved perfect timeline to ${TIMELINE_PATH}`);

// 6. Update Project Stores
for (const storePath of [STORE_API_PATH, STORE_ROOT_PATH]) {
  if (fs.existsSync(storePath)) {
    const raw = fs.readFileSync(storePath, 'utf-8');
    const projects = JSON.parse(raw);
    const p = projects.find((x: any) => x.id === 'proj_dome_villages');
    if (p && p.chapters) {
      const ch2 = p.chapters.find((c: any) => c.chapterIndex === 2);
      if (ch2) {
        ch2.timelineJson = timelineData;
        ch2.updatedAt = new Date().toISOString();
        console.log(`✅ Updated Chapter 2 in ${storePath}`);
      }
    }
    fs.writeFileSync(storePath, JSON.stringify(projects, null, 2), 'utf-8');
  }
}

console.log('🎉 PERFECT CHAPTER 02 STAGING COMPLETE!');
