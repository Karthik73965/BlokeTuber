import fs from 'fs';
import path from 'path';
import { mapPlannedBeatsToTiming, PlannedBeat } from '../src/services/aiScriptPlanner';
import { getAudioDuration } from '../src/services/audioAssembly';
import { projectsStore, chaptersStore } from '../src/db/localStore';

interface WordTimestamp {
  word: string;
  start: number;
  end: number;
}

interface SegmentAlignment {
  text: string;
  start: number;
  end: number;
  words: WordTimestamp[];
}

interface ChapterDefinition {
  num: number;
  numStr: string;
  title: string;
  jsonFilename: string;
  audioFilename: string;
  themeContext: string;
  primaryLocalClips: string[];
}

const CHAPTERS: ChapterDefinition[] = [
  {
    num: 1,
    numStr: '01',
    title: 'Chapter 01: Cold Open',
    jsonFilename: '01_1 - Cold open.json',
    audioFilename: '1 - Cold open.mp3',
    themeContext: 'Eugene Oregon rain, Conestoga huts row, Tracy Jocelyn stepping out and turning key in lock, unhoused background, 60 sq ft sanctuary.',
    primaryLocalClips: ['oregon .mp4', 'Full overview of home from ourside.mp4', 'Homes built by Tracy.jpg', 'Tracy.webp', 'a pperson walking near towards the home built by tracy.mp4', 'Tracy showing home.mp4', 'inside the home.png', 'Side view of home.png'],
  },
  {
    num: 2,
    numStr: '02',
    title: 'Chapter 02: The Shape',
    jsonFilename: '02_2 -  THE SHAPE.json',
    audioFilename: '2 -  THE SHAPE.mp3',
    themeContext: 'Eugene housing crisis, college river town, $2500 Conestoga hut, cattle panel livestock fencing arch, insulated canvas skin, door lock.',
    primaryLocalClips: ['Homes built by Tracy.jpg', 'Outer Look of home.webp', 'Side view of home.png', 'Full overview of home from ourside.mp4', 'inside the home.png'],
  },
  {
    num: 3,
    numStr: '03',
    title: 'Chapter 03: The Founder',
    jsonFilename: '03_3 - THE FOUNDER.json',
    audioFilename: '3 - THE FOUNDER.mp3',
    themeContext: 'Founder Erik de Buhr, Tin Hive workshop, salvage materials, wife Faye and son Abram living in 7x12 prototype, Occupy Eugene 2011 single mother hut.',
    primaryLocalClips: ['Tracy showing home.mp4', 'Outer Look of home.webp', 'Homes built by Tracy.jpg', 'inside the home.png'],
  },
  {
    num: 4,
    numStr: '04',
    title: 'Chapter 04: A Build Day',
    jsonFilename: '04_4 -  A BUILD DA.json',
    audioFilename: '4 -  A BUILD DA.mp3',
    themeContext: 'Build day volunteers, bending rigid cattle panel wire into arch curve, clamping, screwing insulation, cutting door frame, box of screws and truck gas.',
    primaryLocalClips: ['people building the home.mp4', 'a group of people buildingg the home.png', 'Another view of people building the home.png', 'community supported shelters group .mp4'],
  },
  {
    num: 5,
    numStr: '05',
    title: 'Chapter 05: The Permission',
    jsonFilename: '05_5 -  THE PERMISSION.json',
    audioFilename: '5 -  THE PERMISSION.mp3',
    themeContext: 'Eugene city council meeting in park blocks, car camping ordinance approval, Opportunity Village pilot, 60 sq ft standard, $1M budget, 250+ huts.',
    primaryLocalClips: ['Eugen City manger talkking about those homes.mp4', 'community supported shelters group .mp4', 'Full overview of home from ourside.mp4', 'Homes built by Tracy.jpg'],
  },
  {
    num: 6,
    numStr: '06',
    title: 'Chapter 06: The Math',
    jsonFilename: '06_6 -  THE MATH.json',
    audioFilename: '6 -  THE MATH.mp3',
    themeContext: 'Economic math: $2,500 Conestoga hut vs $10,000-$20,000 tiny home. David Quality building 84th hut. Orderly appearance winning city support.',
    primaryLocalClips: ['Eugen City manger talkking about those homes.mp4', 'people building the home.mp4', 'Homes built by Tracy.jpg', 'Side view of home.png'],
  },
  {
    num: 7,
    numStr: '07',
    title: 'Chapter 07: The People',
    jsonFilename: '07_7 - THE PEOPLE.json',
    audioFilename: '7 - THE PEOPLE.mp3',
    themeContext: 'Residents: James Clap (veteran), Corey Aslin (spine injury, living since 2012), Zechariah Bosman (shelters nationwide), Jeff Howard (transitioned to apartment).',
    primaryLocalClips: ['Tracy.webp', 'Tracy showing home.mp4', 'news reporteer and a person walking round those homes.mp4', 'inside the home.png', 'a pperson walking near towards the home built by tracy.mp4'],
  },
  {
    num: 8,
    numStr: '08',
    title: 'Chapter 08: The Argument',
    jsonFilename: '08_8 - HE ARGUMENT.json',
    audioFilename: '8 - HE ARGUMENT.mp3',
    themeContext: 'Critique from housing advocates: huts are not legal permanent housing (no plumbing). Erik de Buhr: solving tonight while systemic reform takes years.',
    primaryLocalClips: ['Outer Look of home.webp', 'Full overview of home from ourside.mp4', 'Homes built by Tracy.jpg', 'oregon .mp4'],
  },
  {
    num: 9,
    numStr: '09',
    title: 'Chapter 09: The Spread',
    jsonFilename: '09_9 -  THE SPREAD.json',
    audioFilename: '9 -  THE SPREAD.mp3',
    themeContext: 'Spread to Walla Walla Alliance (31 huts, low barrier), Pacific Northwest regional adoption, open blueprint without patents or fees.',
    primaryLocalClips: ['Full overview of home from ourside.mp4', 'Homes built by Tracy.jpg', 'community supported shelters group .mp4'],
  },
  {
    num: 10,
    numStr: '10',
    title: 'Chapter 10: What It Costs To Build Something Small',
    jsonFilename: '10_10 - WHAT IT COSTS TO BUILD SOMETHING SMALL.json',
    audioFilename: '10 - WHAT IT COSTS TO BUILD SOMETHING SMALL.mp3',
    themeContext: 'Philosophy of small scale: relationships formed across build days, dignity of locked door, Erik reflecting on unintended 10-year journey.',
    primaryLocalClips: ['a group of people buildingg the home.png', 'people building the home.mp4', 'Homes built by Tracy.jpg', 'Tracy showing home.mp4'],
  },
  {
    num: 11,
    numStr: '11',
    title: 'Chapter 11: Close',
    jsonFilename: '11_11 - Close.json',
    audioFilename: '11 - Close.mp3',
    themeContext: 'Return to Tracy Jocelyn inside her warm hut on the edge of Eugene, out of the rain, door locked, peace.',
    primaryLocalClips: ['Tracy.webp', 'inside the home.png', 'Outer Look of home.webp', 'oregon .mp4'],
  },
];

// Screen layouts pool for ~50% motion graphic alternation
const MOTION_LAYOUTS = [
  'split_dual_screen',
  'forensic_drafting_table',
  'ambient_blur_frame',
  'open_case_binder',
  'editorial_sidebar_column',
  'desktop_corkboard',
  'hero_graphic_centerpiece',
  'vintage_crt_monitor',
  'magnifying_loupe_inspector',
];

const OVERLAYS = [
  'micro_film_grain',
  'cinematic_vignette',
  'rain_lens_streaks',
  'film_dust_scratches',
  'film_burn_light_leak',
  'archival_halftone_paper',
];

const TRANSITIONS = [
  'cut',
  'cut',
  'shutter_flash',
  'crossfade',
  'whip_pan_left',
  'zoom_punch',
  'film_burn',
];

function buildRawBeatsFromSegments(
  segments: SegmentAlignment[],
  chapterDef: ChapterDefinition,
  audioDuration: number
): PlannedBeat[] {
  // Group whisper segments into natural 3.5s - 5.5s narrative units (~8 to 14 words)
  const groupedUnits: Array<{ text: string; approxDuration: number }> = [];
  let currentGroupText: string[] = [];
  let currentGroupDur = 0;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]!;
    const segDur = seg.end - seg.start;
    const segText = seg.text.trim();

    if (currentGroupText.length === 0) {
      currentGroupText.push(segText);
      currentGroupDur = segDur;
    } else if (currentGroupDur + segDur <= 5.2) {
      currentGroupText.push(segText);
      currentGroupDur += segDur;
    } else {
      groupedUnits.push({
        text: currentGroupText.join(' '),
        approxDuration: currentGroupDur,
      });
      currentGroupText = [segText];
      currentGroupDur = segDur;
    }
  }

  if (currentGroupText.length > 0) {
    groupedUnits.push({
      text: currentGroupText.join(' '),
      approxDuration: currentGroupDur,
    });
  }

  // Assign layouts, local clips, stock queries, and callouts
  const rawBeats: PlannedBeat[] = [];
  let localClipIndex = 0;

  groupedUnits.forEach((unit, idx) => {
    const isFirstBeat = idx === 0;
    const isEven = idx % 2 === 0;

    // Alternating 50/50 layout
    let layout = isEven ? 'full_bleed_cinematic' : MOTION_LAYOUTS[(idx / 2) % MOTION_LAYOUTS.length]!;
    if (isFirstBeat) layout = 'full_bleed_cinematic';

    // Layout metadata
    let layoutData: any = null;
    if (layout !== 'full_bleed_cinematic') {
      layoutData = {
        title: `${chapterDef.title.toUpperCase()}`,
        subtitle: `FIELD EVIDENCE • SCENE ${idx + 1}`,
        coords: 'EUGENE, OR • 44.05° N, 123.08° W',
        tag: 'DOCUMENTARY ARCHIVE',
      };
    }

    // Determine visual subject and clips
    let clipFilename: string | null = null;
    // Distribute local clips across high-impact beats
    if (chapterDef.primaryLocalClips.length > 0 && (idx % 3 === 0 || isFirstBeat)) {
      clipFilename = chapterDef.primaryLocalClips[localClipIndex % chapterDef.primaryLocalClips.length] || null;
      localClipIndex++;
    }

    const words = unit.text.split(/\s+/).filter(Boolean);
    const keyWords = words.filter((w) => w.length > 3).slice(0, 4).join(' ');

    const stockVideoQuery = `conestoga tiny house eugene oregon ${keyWords}`.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const backupVideoQuery = `pacific northwest wooden shelter ${chapterDef.themeContext.slice(0, 30)}`.toLowerCase().replace(/[^a-z0-9 ]/g, '');

    // Assign Callouts on ~35% of beats
    let callout: any = null;
    if (isFirstBeat) {
      callout = {
        type: 'editorial_lower_third',
        line1: chapterDef.title.toUpperCase(),
        line2: 'COMMUNITY SUPPORTED SHELTERS • EUGENE, OR',
        spokenTrigger: words.slice(0, 3).join(' '),
        themeColor: 'cyan',
      };
    } else if (idx === Math.floor(groupedUnits.length / 2)) {
      callout = {
        type: 'newspaper_headline',
        line1: words.slice(0, 4).join(' ').toUpperCase(),
        line2: 'INVESTIGATIVE REPORT • EUGENE, OR',
        spokenTrigger: words.slice(0, 3).join(' '),
        themeColor: 'amber',
      };
    } else if (idx % 5 === 0) {
      callout = {
        type: 'editorial_quote',
        line1: `"${words.slice(0, 5).join(' ').toUpperCase()}"`,
        line2: 'PACIFIC NORTHWEST DISPATCH',
        spokenTrigger: words.slice(0, 3).join(' '),
        themeColor: 'gold',
      };
    }

    rawBeats.push({
      beatIndex: idx,
      chapterIndex: chapterDef.num - 1,
      text: unit.text,
      visualSubject: `tract_${chapterDef.num}_beat_${idx}`,
      mediaType: clipFilename?.endsWith('.png') || clipFilename?.endsWith('.jpg') || clipFilename?.endsWith('.webp') ? 'image' : 'video',
      layout,
      layoutData,
      clipFilename,
      stockVideoQuery,
      backupVideoQuery,
      stockPhotoQuery: null,
      negativeKeywords: ['luxury', 'supermodel', 'beach resort', 'desert'],
      additionalStockQueries: layout === 'split_dual_screen' ? [{ slot: 'right_panel', query: backupVideoQuery, mediaType: 'video' }] : [],
      overlay: OVERLAYS[idx % OVERLAYS.length] || null,
      transition: isFirstBeat ? 'film_dip_black' : TRANSITIONS[idx % TRANSITIONS.length] || 'cut',
      cameraStyle: idx % 2 === 0 ? 'zoom_in' : 'pan_left',
      reason: `Directing beat ${idx} for ${chapterDef.title}`,
      callout,
    });
  });

  return rawBeats;
}

async function planAllChapters() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎬 BATCH BEAT PLANNING: ALL 11 TRACT CHAPTERS');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  // Find project
  const project = projectsStore.all().find((p) => p.name.toLowerCase() === 'tract');
  if (!project) {
    throw new Error('Project "Tract" not found in store!');
  }

  const overallResults: Array<{
    chapter: string;
    beatsCount: number;
    duration: number;
    minBeat: number;
    maxBeat: number;
    passed: boolean;
  }> = [];

  for (const def of CHAPTERS) {
    const audioPath = path.resolve(process.cwd(), 'uploads/audio', def.audioFilename);
    const jsonPath = path.resolve(process.cwd(), 'uploads/transcripts/tract', def.jsonFilename);

    if (!fs.existsSync(jsonPath)) {
      console.warn(`⚠️ Warning: Transcript not found: ${jsonPath}`);
      continue;
    }

    const transcriptData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const segments: SegmentAlignment[] = transcriptData.segments;
    const duration = await getAudioDuration(audioPath);

    // Build raw beats
    let rawBeats: PlannedBeat[];
    if (def.num === 1) {
      // Use our highly customized Chapter 1 script beats if available
      const ch1Path = path.resolve(process.cwd(), 'uploads/transcripts/tract/01_planned_beats.json');
      if (fs.existsSync(ch1Path)) {
        rawBeats = JSON.parse(fs.readFileSync(ch1Path, 'utf-8'));
      } else {
        rawBeats = buildRawBeatsFromSegments(segments, def, duration);
      }
    } else {
      rawBeats = buildRawBeatsFromSegments(segments, def, duration);
    }

    // Run through timing mapper
    const timedBeats = mapPlannedBeatsToTiming(rawBeats, segments, duration, 'medium');

    // Verify pacing stats
    let minBeat = 999;
    let maxBeat = 0;
    timedBeats.forEach((b) => {
      const dur = b.endTime - b.startTime;
      if (dur < minBeat) minBeat = dur;
      if (dur > maxBeat) maxBeat = dur;
    });

    const passed = minBeat >= 2.99 && maxBeat <= 6.01;

    // Save planned beats to file
    const planOutputPath = path.resolve(process.cwd(), `uploads/transcripts/tract/${def.numStr}_planned_beats.json`);
    fs.writeFileSync(planOutputPath, JSON.stringify(timedBeats, null, 2), 'utf-8');

    // Update chapter in chaptersStore
    const existingChapter = chaptersStore.forProject(project.id).find((c) => c.chapterIndex === def.num);
    if (existingChapter) {
      chaptersStore.update(project.id, existingChapter.id, {
        description: `Beats planned: ${timedBeats.length} cuts | Duration: ${duration.toFixed(1)}s | Pacing: 3.0s-6.0s`,
      });
    }

    overallResults.push({
      chapter: def.title,
      beatsCount: timedBeats.length,
      duration: Number(duration.toFixed(2)),
      minBeat: Number(minBeat.toFixed(2)),
      maxBeat: Number(maxBeat.toFixed(2)),
      passed,
    });

    console.log(
      `✓ [${def.numStr}/11] ${def.title} | Beats: ${timedBeats.length} | Dur: ${duration.toFixed(1)}s | Range: [${minBeat.toFixed(2)}s - ${maxBeat.toFixed(2)}s] ${passed ? '✅' : '❌'}`
    );
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log('📊 ALL 11 CHAPTERS BEAT PLANNING SUMMARY');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  console.table(overallResults);

  const allPassed = overallResults.every((r) => r.passed);
  console.log(`\nAll Chapters 100% within 3.0s – 6.0s constraint: ${allPassed ? 'YES ✅' : 'NO ❌'}\n`);
}

planAllChapters().catch((err) => {
  console.error('Error planning all chapters:', err);
  process.exit(1);
});
