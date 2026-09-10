import fs from 'fs';
import path from 'path';
import { mapPlannedBeatsToTiming, PlannedBeat } from '../src/services/aiScriptPlanner';
import { getAudioDuration } from '../src/services/audioAssembly';

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

async function run() {
  const audioPath = path.resolve(process.cwd(), 'uploads/audio/1 - Cold open.mp3');
  const transcriptPath = path.resolve(process.cwd(), 'uploads/transcripts/tract/01_1 - Cold open.json');

  if (!fs.existsSync(transcriptPath)) {
    throw new Error(`Transcript file not found: ${transcriptPath}`);
  }

  const transcriptData = JSON.parse(fs.readFileSync(transcriptPath, 'utf-8'));
  const segments: SegmentAlignment[] = transcriptData.segments;
  const duration = await getAudioDuration(audioPath);

  console.log(`🎬 Planning Beats for Chapter 01: Cold Open`);
  console.log(`Audio Duration: ${duration.toFixed(2)}s | Spoken Segments: ${segments.length}`);

  // Expert documentary director beats crafted specifically for Chapter 1
  const rawBeats: PlannedBeat[] = [
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'It is a wet gray morning in Eugene, Oregon. The kind of low cloud cover that never quite becomes rain',
      visualSubject: 'eugene_oregon_overcast_morning',
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      layoutData: null,
      clipFilename: 'oregon .mp4',
      stockVideoQuery: 'eugene oregon rain overcast morning mist pacific northwest',
      backupVideoQuery: 'pacific northwest dreary cloudy rainy town morning',
      stockPhotoQuery: null,
      negativeKeywords: ['sunny', 'summer', 'beach', 'desert'],
      additionalStockQueries: [],
      overlay: 'rain_lens_streaks',
      transition: 'film_dip_black',
      cameraStyle: 'zoom_in',
      reason: 'Atmospheric cold open establishing the cold, damp Pacific Northwest weather.',
      callout: {
        type: 'editorial_lower_third',
        line1: 'EUGENE, OREGON',
        line2: 'PACIFIC NORTHWEST • COLD OPEN',
        spokenTrigger: 'Eugene, Oregon',
        themeColor: 'cyan',
      },
    },
    {
      beatIndex: 1,
      chapterIndex: 0,
      text: 'and never quite burns off either. Behind a chain link fence on the edge of town sits a row of small wooden structures,',
      visualSubject: 'conestoga_huts_fenceline',
      mediaType: 'video',
      layout: 'ambient_blur_frame',
      layoutData: {
        title: 'SHELTER LOCATION',
        subtitle: 'PERIMETER FENCE • EUGENE OUTSKIRTS',
      },
      clipFilename: 'Full overview of home from ourside.mp4',
      stockVideoQuery: 'tiny wooden cabins row fenced compound overcast',
      backupVideoQuery: 'row of small huts behind chain link fence',
      stockPhotoQuery: null,
      negativeKeywords: ['luxury', 'mansion', 'hotel', 'resort'],
      additionalStockQueries: [],
      overlay: 'micro_film_grain',
      transition: 'cut',
      cameraStyle: 'pan_right',
      reason: 'First view of the Conestoga huts situated on the perimeter of Eugene.',
      callout: null,
    },
    {
      beatIndex: 2,
      chapterIndex: 0,
      text: 'curved at the roof line, shaped a little like covered wagons, parked in from a trail that no longer exists.',
      visualSubject: 'conestoga_hut_arch_roof',
      mediaType: 'image',
      layout: 'forensic_drafting_table',
      layoutData: {
        title: 'ARCHITECTURAL DESIGN: CONESTOGA HUT',
        coords: 'EUGENE, OR • 44.05° N, 123.08° W',
        stamp: 'CONESTOGA PROTOTYPE',
      },
      clipFilename: 'Homes built by Tracy.jpg',
      stockVideoQuery: 'covered wagon canvas curved roof small wooden shelter',
      backupVideoQuery: 'arched roof tiny house wooden construction',
      stockPhotoQuery: 'wooden tiny house arched canvas roof close up',
      negativeKeywords: ['skyscraper', 'modern villa'],
      additionalStockQueries: [],
      overlay: 'archival_halftone_paper',
      transition: 'shutter_flash',
      cameraStyle: 'zoom_in',
      reason: 'Highlight the distinctive covered wagon shape and curved cattle-panel roof.',
      callout: {
        type: 'archival_evidence_tag',
        line1: 'CONESTOGA ARCH DESIGN',
        line2: 'REPURPOSED CATTLE PANEL FRAME',
        spokenTrigger: 'covered wagons',
        themeColor: 'amber',
      },
    },
    {
      beatIndex: 3,
      chapterIndex: 0,
      text: 'A woman named Tracy Jocelyn steps out of one of them, pulls the door shut behind her,',
      visualSubject: 'tracy_stepping_out_door',
      mediaType: 'image',
      layout: 'split_dual_screen',
      layoutData: {
        title: 'RESIDENT PROFILE',
        subtitle: 'TRACY JOCELYN • HUT RESIDENT',
      },
      clipFilename: 'Tracy.webp',
      stockVideoQuery: 'middle aged woman stepping out of small cabin door',
      backupVideoQuery: 'woman closing wooden door exterior morning',
      stockPhotoQuery: 'woman standing outside tiny wooden cabin portrait',
      negativeKeywords: ['glamour', 'supermodel', 'office building'],
      additionalStockQueries: [
        { slot: 'right_panel', query: 'wooden cabin front door latch exterior', mediaType: 'image' },
      ],
      overlay: 'micro_film_grain',
      transition: 'cut',
      cameraStyle: 'pan_left',
      reason: 'Introducing the protagonist Tracy Jocelyn using authentic local photo.',
      callout: {
        type: 'newspaper_headline',
        line1: 'TRACY JOCELYN',
        line2: 'CONESTOGA HUT RESIDENT • EUGENE, OR',
        spokenTrigger: 'Tracy Jocelyn',
        themeColor: 'white',
      },
    },
    {
      beatIndex: 4,
      chapterIndex: 0,
      text: 'and turns a key in the lock before she does anything else.',
      visualSubject: 'turning_key_in_door_lock',
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      layoutData: null,
      clipFilename: 'a pperson walking near towards the home built by tracy.mp4',
      stockVideoQuery: 'close up hand turning key in brass padlock wooden door',
      backupVideoQuery: 'hand locking padlock on wooden shed door',
      stockPhotoQuery: null,
      negativeKeywords: ['electronic smart lock', 'glass door', 'office'],
      additionalStockQueries: [],
      overlay: 'cinematic_vignette',
      transition: 'zoom_punch',
      cameraStyle: 'zoom_in',
      reason: 'Crucial tactile moment: turning the key in the lock — the single most prized detail.',
      callout: {
        type: 'marker_circle',
        line1: 'THE WORKING LOCK',
        line2: 'FIRST MOTION OF HER DAY',
        spokenTrigger: 'key in the lock',
        themeColor: 'gold',
      },
    },
    {
      beatIndex: 5,
      chapterIndex: 0,
      text: 'That is the first motion of her day, a heavy day, and it is also the whole reason she is still standing here to do it.',
      visualSubject: 'tracy_standing_outside_shelter',
      mediaType: 'video',
      layout: 'ambient_blur_frame',
      layoutData: {
        title: 'DAILY REALITY',
        subtitle: 'SECURITY & AUTONOMY',
      },
      clipFilename: 'Tracy showing home.mp4',
      stockVideoQuery: 'contemplative woman standing outside tiny house morning overcast',
      backupVideoQuery: 'woman standing outside wooden cabin thoughtful morning',
      stockPhotoQuery: null,
      negativeKeywords: ['party', 'smiling selfie'],
      additionalStockQueries: [],
      overlay: 'micro_film_grain',
      transition: 'cut',
      cameraStyle: 'zoom_out',
      reason: 'Weight of the routine — the lock provides safety that allows her to survive.',
      callout: null,
    },
    {
      beatIndex: 6,
      chapterIndex: 0,
      text: 'Three years ago, Tracy did not have a door to lock.',
      visualSubject: 'past_flashback_streets',
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      layoutData: null,
      clipFilename: null,
      stockVideoQuery: 'empty wet city sidewalk rain night homeless belongings',
      backupVideoQuery: 'abandoned urban sidewalk wet pavement cold night',
      stockPhotoQuery: null,
      negativeKeywords: ['luxury shop', 'sunny day', 'cars driving fast'],
      additionalStockQueries: [],
      overlay: 'film_dust_scratches',
      transition: 'film_burn',
      cameraStyle: 'zoom_in',
      reason: 'Flashback transition to 3 years earlier when she had no shelter.',
      callout: {
        type: 'split_milestone_card',
        line1: '3 YEARS AGO',
        line2: 'NO DOOR • NO LOCK • LIVING UNHOUSED',
        spokenTrigger: 'Three years ago',
        themeColor: 'crimson',
      },
    },
    {
      beatIndex: 7,
      chapterIndex: 0,
      text: 'She had a sleeping bag, a handful of belongings she carried everywhere because leaving them anywhere meant losing them',
      visualSubject: 'carrying_belongings_streets',
      mediaType: 'video',
      layout: 'editorial_sidebar_column',
      layoutData: {
        title: 'UNHOUSED REALITY',
        subtitle: 'EVERYDAY DISPLACEMENT',
        tag: 'FIELD LOG',
        coords: 'EUGENE, OR',
      },
      clipFilename: null,
      stockVideoQuery: 'person walking carrying rolled sleeping bag backpack cold street',
      backupVideoQuery: 'unhoused person walking with bags down sidewalk dreary weather',
      stockPhotoQuery: null,
      negativeKeywords: ['hiker mountain backpacker', 'tourist vacation'],
      additionalStockQueries: [
        { slot: 'context_image', query: 'rolled sleeping bag on concrete sidewalk', mediaType: 'image' },
      ],
      overlay: 'micro_film_grain',
      transition: 'cut',
      cameraStyle: 'pan_right',
      reason: 'The constant burden of carrying every possession to avoid theft.',
      callout: null,
    },
    {
      beatIndex: 8,
      chapterIndex: 0,
      text: 'and a stretch of sidewalk that changed depending on which shelter had turned her away that week.',
      visualSubject: 'shelter_doors_sidewalk',
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      layoutData: null,
      clipFilename: null,
      stockVideoQuery: 'homeless shelter closed door sign wet street evening',
      backupVideoQuery: 'person sitting outside building doorway dusk rain',
      stockPhotoQuery: null,
      negativeKeywords: ['shopping mall', 'sunny beach'],
      additionalStockQueries: [],
      overlay: 'rain_lens_streaks',
      transition: 'crossfade',
      cameraStyle: 'pan_left',
      reason: 'The instability of moving from sidewalk to sidewalk as shelter beds fill up.',
      callout: {
        type: 'odometer_stat',
        line1: '0 BEDS AVAILABLE',
        line2: 'MUNICIPAL SHELTER CAPACITY EXCEEDED',
        spokenTrigger: 'shelter had turned her away',
        themeColor: 'crimson',
      },
    },
    {
      beatIndex: 9,
      chapterIndex: 0,
      text: 'Some nights she stayed under an overpass, some nights a doorway downtown if it was empty and dry.',
      visualSubject: 'highway_overpass_doorway',
      mediaType: 'video',
      layout: 'split_dual_screen',
      layoutData: {
        title: 'IMPROVISED SHELTER',
        subtitle: 'HIGHWAY OVERPASS vs DOWNTOWN DOORWAY',
      },
      clipFilename: null,
      stockVideoQuery: 'concrete highway overpass dark gritty night urban traffic above',
      backupVideoQuery: 'under freeway bridge homeless camp shadow night',
      stockPhotoQuery: null,
      negativeKeywords: ['modern glass tower', 'resort pool'],
      additionalStockQueries: [
        { slot: 'right_panel', query: 'dark commercial brick doorway recessed entrance night', mediaType: 'video' },
      ],
      overlay: 'cinematic_vignette',
      transition: 'whip_pan_left',
      cameraStyle: 'zoom_in',
      reason: 'Dual perspective comparing survival spots: under highway overpass vs downtown doorways.',
      callout: null,
    },
    {
      beatIndex: 10,
      chapterIndex: 0,
      text: 'She learned the way most people living outside eventually learn to sleep lightly,',
      visualSubject: 'sleeping_lightly_vigilant',
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      layoutData: null,
      clipFilename: null,
      stockVideoQuery: 'person wrapped in blanket eyes open alert dark outdoors night',
      backupVideoQuery: 'restless unhoused person waking up in sleeping bag outdoors',
      stockPhotoQuery: null,
      negativeKeywords: ['comfortable luxury bed', 'bedroom hotel room'],
      additionalStockQueries: [],
      overlay: 'micro_film_grain',
      transition: 'cut',
      cameraStyle: 'zoom_in',
      reason: 'Psychological toll of street survival: inability to enter deep sleep.',
      callout: null,
    },
    {
      beatIndex: 11,
      chapterIndex: 0,
      text: 'to keep one hand near whatever she could not afford to lose, to wake at the sound of footsteps before they got close enough to matter.',
      visualSubject: 'hand_clutching_bag_footsteps',
      mediaType: 'video',
      layout: 'ambient_blur_frame',
      layoutData: {
        title: 'STREET SURVIVAL SENSES',
        subtitle: 'VIGILANCE & PROTECTION',
      },
      clipFilename: null,
      stockVideoQuery: 'hand gripping worn backpack zipper tightly close up night',
      backupVideoQuery: 'person boots walking approaching dark pavement wet night',
      stockPhotoQuery: null,
      negativeKeywords: ['smiling friends', 'shopping mall'],
      additionalStockQueries: [],
      overlay: 'cinematic_vignette',
      transition: 'cut',
      cameraStyle: 'zoom_in',
      reason: 'Sensory vigilance: clutching belongings, listening for predatory footsteps.',
      callout: {
        type: 'editorial_quote',
        line1: '"TO WAKE BEFORE FOOTSTEPS GOT CLOSE"',
        line2: 'THE GRIND OF STREET VIGILANCE',
        spokenTrigger: 'sound of footsteps',
        themeColor: 'slate',
      },
    },
    {
      beatIndex: 12,
      chapterIndex: 0,
      text: 'What she has now is 60 square feet, a raised bed,',
      visualSubject: 'hut_interior_raised_bed',
      mediaType: 'image',
      layout: 'split_dual_screen',
      layoutData: {
        title: 'INTERIOR SPECIFICATION',
        subtitle: '60 SQ FT • RAISED SLEEPING PLATFORM',
      },
      clipFilename: 'inside the home.png',
      stockVideoQuery: 'small wooden cabin interior raised twin bed cozy tidy',
      backupVideoQuery: 'tiny house bedroom nook interior compact',
      stockPhotoQuery: 'wooden tiny house interior single bed shelf clean',
      negativeKeywords: ['penthouse master suite', 'king bed hotel'],
      additionalStockQueries: [
        { slot: 'right_panel', query: 'wooden floorboards raised bed frame compact interior', mediaType: 'image' },
      ],
      overlay: 'micro_film_grain',
      transition: 'shutter_flash',
      cameraStyle: 'pan_left',
      reason: 'Contrasting the harsh street reality with her actual 60 sq ft hut interior.',
      callout: {
        type: 'forensic_data_card',
        line1: '60 SQUARE FEET',
        line2: 'RAISED BED • INSULATED SHELL • DRY INTERIOR',
        spokenTrigger: '60 square feet',
        themeColor: 'emerald',
      },
    },
    {
      beatIndex: 13,
      chapterIndex: 0,
      text: 'a roof that sheds water instead of collecting it, and a lock that only she has the key to.',
      visualSubject: 'waterproof_curved_roof_padlock',
      mediaType: 'image',
      layout: 'hero_graphic_centerpiece',
      layoutData: {
        title: 'SANCTUARY & SOVEREIGNTY',
        subtitle: 'EXCLUSIVE KEY ACCESS',
      },
      clipFilename: 'Side view of home.png',
      stockVideoQuery: 'rain running off curved metal roof slow motion close up',
      backupVideoQuery: 'brass key in lock cylinder turning safe secure',
      stockPhotoQuery: 'curved roof corrugated metal rain water runoff',
      negativeKeywords: ['leaking tarp', 'puddle indoors'],
      additionalStockQueries: [],
      overlay: 'rain_lens_streaks',
      transition: 'cut',
      cameraStyle: 'zoom_in',
      reason: 'The two essential physical safeguards: a dry roof and an exclusive key.',
      callout: null,
    },
    {
      beatIndex: 14,
      chapterIndex: 0,
      text: 'She calls it a godsend, and she does not say it like a figure of speech.',
      visualSubject: 'tracy_speaking_sincere_portrait',
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      layoutData: null,
      clipFilename: 'Tracy showing home.mp4',
      stockVideoQuery: 'emotional woman talking sincere expression medium close up',
      backupVideoQuery: 'older woman speaking nodding with deep gratitude outdoor',
      stockPhotoQuery: null,
      negativeKeywords: ['laughing joke', 'comedy'],
      additionalStockQueries: [],
      overlay: 'micro_film_grain',
      transition: 'crossfade',
      cameraStyle: 'zoom_in',
      reason: 'Tracy speaking with unvarnished conviction about what the hut means to her.',
      callout: {
        type: 'editorial_quote',
        line1: '"SHE CALLS IT A GODSEND"',
        line2: 'NOT AS A FIGURE OF SPEECH • AS A FACT',
        spokenTrigger: 'calls it a godsend',
        themeColor: 'gold',
      },
    },
    {
      beatIndex: 15,
      chapterIndex: 0,
      text: 'She says it the way people say things they have thought about for a long time before finally saying them out loud.',
      visualSubject: 'contemplative_exterior_wide_huts',
      mediaType: 'video',
      layout: 'ambient_blur_frame',
      layoutData: {
        title: 'THE CLOSING IMAGE',
        subtitle: 'EUGENE, OREGON SHELTER COMMUNITY',
      },
      clipFilename: 'news reporteer and a person walking round those homes.mp4',
      stockVideoQuery: 'peaceful morning light over tiny houses quiet community perimeter',
      backupVideoQuery: 'overcast tranquil settlement row of small huts morning mist',
      stockPhotoQuery: null,
      negativeKeywords: ['busy highway', 'crowded mall'],
      additionalStockQueries: [],
      overlay: 'film_burn_light_leak',
      transition: 'cut',
      cameraStyle: 'zoom_out',
      reason: 'Reflective closing beat of Chapter 1 holding space for the weight of her words.',
      callout: null,
    },
  ];

  // Map to timing using our strict 3.0s - 6.0s pacing engine and local Whisper alignments
  const timedBeats = mapPlannedBeatsToTiming(rawBeats, segments, duration, 'medium');

  console.log(`\n═══════════════════════════════════════════════════════════════════`);
  console.log(`📊 CHAPTER 01: PLANNED BEATS SUMMARY (${timedBeats.length} BEATS)`);
  console.log(`═══════════════════════════════════════════════════════════════════\n`);

  let minDur = 999;
  let maxDur = 0;

  timedBeats.forEach((b, i) => {
    const dur = b.endTime - b.startTime;
    if (dur < minDur) minDur = dur;
    if (dur > maxDur) maxDur = dur;

    const clipSource = b.clipFilename ? `[LOCAL] ${b.clipFilename}` : `[STOCK] ${b.stockVideoQuery?.slice(0, 30)}...`;
    const calloutStr = b.callout ? `[CALLOUT: ${b.callout.type}] "${b.callout.line1}"` : '[No Callout]';
    const isPacingValid = dur >= 2.99 && dur <= 6.01;

    console.log(
      `Beat ${String(i).padStart(2, '0')}: [${b.startTime.toFixed(2)}s - ${b.endTime.toFixed(2)}s] (${dur.toFixed(2)}s) ${isPacingValid ? '✅' : '❌ PACING VIOLATION'}`
    );
    console.log(`  Spoken: "${b.text.slice(0, 70)}..."`);
    console.log(`  Visual: ${clipSource}`);
    console.log(`  Layout: ${b.layout} | Transition: ${b.transition}`);
    console.log(`  Overlay: ${b.overlay || 'none'} | ${calloutStr}\n`);
  });

  console.log(`───────────────────────────────────────────────────────────────────`);
  console.log(`⏱️ Pacing Stats: Min Beat = ${minDur.toFixed(2)}s | Max Beat = ${maxDur.toFixed(2)}s`);
  console.log(`All beats within 3.0s - 6.0s target: ${minDur >= 2.99 && maxDur <= 6.01 ? 'YES ✅' : 'NO ❌'}`);
  console.log(`Total Timeline Duration: ${timedBeats[timedBeats.length - 1]?.endTime.toFixed(2)}s / Audio: ${duration.toFixed(2)}s`);
  console.log(`───────────────────────────────────────────────────────────────────\n`);

  // Save the planned beats to JSON
  const planOutputPath = path.resolve(process.cwd(), 'uploads/transcripts/tract/01_planned_beats.json');
  fs.writeFileSync(planOutputPath, JSON.stringify(timedBeats, null, 2), 'utf-8');
  console.log(`💾 Saved planned beats to: ${planOutputPath}`);
}

run().catch((err) => {
  console.error('Error planning chapter 1 beats:', err);
  process.exit(1);
});
