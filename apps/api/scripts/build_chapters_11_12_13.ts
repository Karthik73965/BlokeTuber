import fs from 'fs';
import path from 'path';
import { buildChapter, BeatDefinition } from './chapter_builder_core';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW_DIR = path.resolve(REPO_ROOT, 'uploads/raw/proj_dome_villages');
const DL_DIR = path.resolve(RAW_DIR, 'downloads');
const BEATS_MASTER = path.resolve(REPO_ROOT, 'uploads/all_chapters_beats.json');

const beatsData = JSON.parse(fs.readFileSync(BEATS_MASTER, 'utf8'));

// Resolve dynamic files in rawDir safely
const livingInsideFile = fs.readdirSync(RAW_DIR).find(f => f.includes('G2MAIJzAUhE'))!;
const theShelterFile = fs.readdirSync(RAW_DIR).find(f => f.includes('RANEduRN9Ew'))!;

if (!livingInsideFile || !theShelterFile) {
  throw new Error(`Required raw source files missing in ${RAW_DIR}`);
}

console.log(`Using Living Inside source: ${livingInsideFile}`);
console.log(`Using The Shelter source: ${theShelterFile}`);

// Helper to pull beat from master json
function getMasterBeat(chNum: number, beatIdx: number) {
  const ch = beatsData[String(chNum)];
  if (!ch) throw new Error(`Chapter ${chNum} not found in master beats`);
  const b = ch.clips.find((c: any) => c.beatIndex === beatIdx);
  if (!b) throw new Error(`Chapter ${chNum} beat ${beatIdx} not found in master beats`);
  return b;
}

// ═════════════════════════════════════════════════════════════════════════════
// CHAPTER 11: The Criticism (13 beats)
// ═════════════════════════════════════════════════════════════════════════════
function buildChapter11() {
  const chNum = 11;
  const masterCh = beatsData[String(chNum)];

  const beatConfigs = [
    {
      sourcePath: 'la_city_hall_drone_clean.mp4',
      sourceStart: 10.0,
      slug: 'ch11_b00_dishonest_story_city_hall',
      callout: {
        type: 'editorial_lower_third',
        line1: 'LOS ANGELES, CALIFORNIA',
        line2: 'CHAPTER 11 • THE CRITICISM',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 2.7,
      },
      sfx: 'whoosh_cinematic.mp3',
      sfxVolume: 0.2,
    },
    {
      sourcePath: 'pexels_city_council_hearing.mp4',
      sourceStart: 0.5,
      slug: 'ch11_b01_criticism_loud_council',
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'skid_row_la_state_of_emergency.mp4',
      sourceStart: 195.0,
      slug: 'ch11_b02_shantytowns_skid_row',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 28.0,
      slug: 'ch11_b03_ten_thousand_shell',
      callout: {
        type: 'editorial_lower_third',
        line1: 'COST PER UNIT',
        line2: '$10,000 FIBERGLASS SHELL',
        themeColor: 'cyan',
        startTime: 0.3,
        endTime: 2.6,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'broll_empty_shelter.mp4',
      sourceStart: 2.0,
      slug: 'ch11_b04_no_plumbing_shelter',
    },
    {
      sourcePath: 'pexels_permanent_apartments.mp4',
      sourceStart: 1.0,
      slug: 'ch11_b05_stop_building_apartments',
    },
    {
      sourcePath: 'pexels_suburban_property_values.mp4',
      sourceStart: 2.0,
      slug: 'ch11_b06_property_values_crime',
      callout: {
        type: 'editorial_lower_third',
        line1: 'COMMUNITY RESISTANCE',
        line2: 'PROPERTY VALUES & NIMBY OPPOSITION',
        themeColor: 'gold',
        startTime: 0.4,
        endTime: 4.5,
      },
      sfx: 'whoosh_air.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_drugs_substance_abuse.mp4',
      sourceStart: 0.5,
      slug: 'ch11_b07_drugs_disputes_turnover',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 1108.0,
      slug: 'ch11_b08_fiberglass_yellows_sun',
      callout: {
        type: 'editorial_lower_third',
        line1: 'MATERIAL DEGRADATION',
        line2: 'FIBERGLASS AGING UNDER UV EXPOSURE',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 3.5,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 148.0,
      slug: 'ch11_b09_built_in_afternoon',
    },
    {
      sourcePath: theShelterFile,
      sourceStart: 240.0,
      slug: 'ch11_b10_tourniquet_not_cure',
      callout: {
        type: 'editorial_lower_third',
        line1: 'ADVOCATE ADMISSION',
        line2: 'A TOURNIQUET, NOT A PERMANENT CURE',
        themeColor: 'cyan',
        startTime: 0.4,
        endTime: 4.0,
      },
      sfx: 'whoosh_air.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_healthcare_doctor.mp4',
      sourceStart: 1.0,
      slug: 'ch11_b11_permanent_cure_healthcare',
    },
    {
      sourcePath: 'pexels_working_class_wages.mp4',
      sourceStart: 1.0,
      slug: 'ch11_b12_living_wages_labor',
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
  ];

  const beats: BeatDefinition[] = beatConfigs.map((cfg, i) => {
    const mb = getMasterBeat(chNum, i);
    return {
      beatIndex: i,
      text: mb.text,
      startTime: mb.startTime,
      endTime: mb.endTime,
      sourcePath: cfg.sourcePath,
      sourceStart: cfg.sourceStart,
      slug: cfg.slug,
      callout: cfg.callout,
      sfx: cfg.sfx,
      sfxVolume: cfg.sfxVolume,
    };
  });

  return buildChapter({
    chapterIndex: chNum,
    chapterId: masterCh.id,
    audioPath: path.resolve(REPO_ROOT, 'uploads/audio/11 -  The Criticism.mp3'),
    beats,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// CHAPTER 12: The Cost of Waiting (31 beats)
// ═════════════════════════════════════════════════════════════════════════════
function buildChapter12() {
  const chNum = 12;
  const masterCh = beatsData[String(chNum)];

  const beatConfigs = [
    {
      sourcePath: theShelterFile,
      sourceStart: 211.0,
      slug: 'ch12_b00_tourniquet_cuts_both_ways',
      callout: {
        type: 'editorial_lower_third',
        line1: 'MORTALITY STUDY DATA',
        line2: 'CHAPTER 12 • THE COST OF WAITING',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 2.7,
      },
      sfx: 'whoosh_cinematic.mp3',
      sfxVolume: 0.2,
    },
    {
      sourcePath: 'skid_row_la_state_of_emergency.mp4',
      sourceStart: 253.0,
      slug: 'ch12_b01_rarely_ones_bleeding',
    },
    {
      sourcePath: 'pexels_16212509.mp4',
      sourceStart: 2.0,
      slug: 'ch12_b02_numbers_hard_to_read',
    },
    {
      sourcePath: 'pexels_austin_skyline.mp4',
      sourceStart: 1.0,
      slug: 'ch12_b03_austin_travis_county',
      callout: {
        type: 'editorial_lower_third',
        line1: 'AUSTIN & TRAVIS COUNTY, TEXAS',
        line2: 'HOMELESS MORTALITY REPORT • 2018-2023',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 2.7,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_cemetery_headstones.mp4',
      sourceStart: 1.0,
      slug: 'ch12_b04_thousand_deaths_unhoused',
      callout: {
        type: 'editorial_lower_third',
        line1: 'MORTALITY AUDIT',
        line2: '1,000+ DEATHS REVIEWED',
        themeColor: 'gold',
        startTime: 0.4,
        endTime: 3.8,
      },
      sfx: 'whoosh_air.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_8076901.mp4',
      sourceStart: 2.0,
      slug: 'ch12_b05_five_year_study_period',
    },
    {
      sourcePath: 'pexels_4062026.mp4',
      sourceStart: 2.0,
      slug: 'ch12_b06_average_age_fifty',
      callout: {
        type: 'editorial_lower_third',
        line1: 'AVERAGE AGE AT DEATH: 50',
        line2: '20 YEARS YOUNGER THAN HOUSED POPULATION',
        themeColor: 'cyan',
        startTime: 0.3,
        endTime: 2.9,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_suburban_property_values.mp4',
      sourceStart: 14.0,
      slug: 'ch12_b07_housed_neighbors_comparison',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 1260.0,
      slug: 'ch12_b08_nine_years_longer_life',
      callout: {
        type: 'editorial_lower_third',
        line1: 'LIFE EXPECTANCY GAIN',
        line2: '+9.5 YEARS GAINED IN HOUSING',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 3.0,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 540.0,
      slug: 'ch12_b09_moved_into_housing',
    },
    {
      sourcePath: 'pexels_street_night.mp4',
      sourceStart: 2.0,
      slug: 'ch12_b10_stayed_outside_night',
    },
    {
      sourcePath: 'pexels_construction_crane.mp4',
      sourceStart: 2.0,
      slug: 'ch12_b11_apartment_construction_delay',
      callout: {
        type: 'editorial_lower_third',
        line1: 'DEVELOPMENT TIMELINE',
        line2: 'TRADITIONAL APARTMENTS: 5+ YEARS',
        themeColor: 'cyan',
        startTime: 0.3,
        endTime: 2.8,
      },
      sfx: 'whoosh_air.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_8076901.mp4',
      sourceStart: 8.0,
      slug: 'ch12_b12_man_freezing_tonight',
    },
    {
      sourcePath: 'pexels_16212509.mp4',
      sourceStart: 14.0,
      slug: 'ch12_b13_year_perfecting_solution',
    },
    {
      sourcePath: 'la_city_hall_drone_clean.mp4',
      sourceStart: 35.0,
      slug: 'ch12_b14_cities_insist_ideal',
    },
    {
      sourcePath: 'pexels_tents_camp.mp4',
      sourceStart: 12.0,
      slug: 'ch12_b15_choosing_status_quo',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 180.0,
      slug: 'ch12_b16_ideal_and_immediate',
      callout: {
        type: 'editorial_lower_third',
        line1: 'THE CORE PARADOX',
        line2: 'IMMEDIATE STABILITY VS. DELAYED PERFECTION',
        themeColor: 'gold',
        startTime: 0.4,
        endTime: 4.8,
      },
      sfx: 'whoosh_air.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: theShelterFile,
      sourceStart: 300.0,
      slug: 'ch12_b17_dome_builders_bet',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 450.0,
      slug: 'ch12_b18_imperfect_tonight',
    },
    {
      sourcePath: 'pexels_city_council_hearing.mp4',
      sourceStart: 8.0,
      slug: 'ch12_b19_five_years_research',
      callout: {
        type: 'editorial_lower_third',
        line1: 'HOUSING FIRST RESEARCH',
        line2: 'OUTCOMES DATA • EMPIRICAL EVIDENCE',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 2.8,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_permanent_apartments.mp4',
      sourceStart: 6.0,
      slug: 'ch12_b20_points_in_favor',
    },
    {
      sourcePath: 'pexels_emergency_room_hospital.mp4',
      sourceStart: 0.5,
      slug: 'ch12_b21_housing_first_studies',
      callout: {
        type: 'editorial_lower_third',
        line1: 'PUBLIC SERVICE IMPACT',
        line2: 'MEASURABLE SYSTEMIC SAVINGS',
        themeColor: 'cyan',
        startTime: 0.3,
        endTime: 2.9,
      },
      sfx: 'whoosh_air.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_ambulance_siren.mp4',
      sourceStart: 0.5,
      slug: 'ch12_b22_fewer_er_visits_ambulance',
      callout: {
        type: 'editorial_lower_third',
        line1: 'EMERGENCY REDUCTION',
        line2: 'FEWER 911 CALLS & ER VISITS',
        themeColor: 'cyan',
        startTime: 0.3,
        endTime: 2.9,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_police_siren.mp4',
      sourceStart: 0.5,
      slug: 'ch12_b23_fewer_police_contacts',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 1230.0,
      slug: 'ch12_b24_stable_place_to_live',
    },
    {
      sourcePath: theShelterFile,
      sourceStart: 70.0,
      slug: 'ch12_b25_evidence_tiny_homes',
      callout: {
        type: 'editorial_lower_third',
        line1: 'VILLAGE EVIDENCE',
        line2: 'EMERGING COMMUNITY MODELS',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 2.8,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: theShelterFile,
      sourceStart: 245.0,
      slug: 'ch12_b26_honest_answer_best_results',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 300.0,
      slug: 'ch12_b27_roof_paired_with_services',
    },
    {
      sourcePath: 'pexels_healthcare_doctor.mp4',
      sourceStart: 6.0,
      slug: 'ch12_b28_path_to_permanent',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 510.0,
      slug: 'ch12_b29_stability_comes_first',
      callout: {
        type: 'editorial_lower_third',
        line1: 'CORE PRINCIPLE',
        line2: 'HOUSING FIRST: STABILITY PRECEDES RECOVERY',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 2.8,
      },
      sfx: 'whoosh_air.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_la_sunrise_golden.mp4',
      sourceStart: 2.0,
      slug: 'ch12_b30_better_than_anything_tried',
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
  ];

  const beats: BeatDefinition[] = beatConfigs.map((cfg, i) => {
    const mb = getMasterBeat(chNum, i);
    return {
      beatIndex: i,
      text: mb.text,
      startTime: mb.startTime,
      endTime: mb.endTime,
      sourcePath: cfg.sourcePath,
      sourceStart: cfg.sourceStart,
      slug: cfg.slug,
      callout: cfg.callout,
      sfx: cfg.sfx,
      sfxVolume: cfg.sfxVolume,
    };
  });

  return buildChapter({
    chapterIndex: chNum,
    chapterId: masterCh.id,
    audioPath: path.resolve(REPO_ROOT, 'uploads/audio/12 -  The Cost of Waiting.mp3'),
    beats,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// CHAPTER 13: Closing (22 beats)
// ═════════════════════════════════════════════════════════════════════════════
function buildChapter13() {
  const chNum = 13;
  const masterCh = beatsData[String(chNum)];

  const beatConfigs = [
    {
      sourcePath: 'pexels_veteran_sleeping.mp4',
      sourceStart: 3.0,
      slug: 'ch13_b00_imagined_veteran_asleep',
      callout: {
        type: 'editorial_lower_third',
        line1: 'A DOOR THAT LOCKS',
        line2: 'CHAPTER 13 • CLOSING',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 2.8,
      },
      sfx: 'whoosh_cinematic.mp3',
      sfxVolume: 0.2,
    },
    {
      sourcePath: 'pexels_street_night.mp4',
      sourceStart: 1.0,
      slug: 'ch13_b01_four_am_city_shivers',
    },
    {
      sourcePath: theShelterFile,
      sourceStart: 60.0,
      slug: 'ch13_b02_no_granite_countertops',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 1100.0,
      slug: 'ch13_b03_no_corner_bookshelf',
      callout: {
        type: 'editorial_lower_third',
        line1: 'GEODESIC ARCHITECTURE',
        line2: '314 SQ FT OF CURVED FIBERGLASS',
        themeColor: 'cyan',
        startTime: 0.3,
        endTime: 2.8,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 30.0,
      slug: 'ch13_b04_barely_counts_as_house',
    },
    {
      sourcePath: theShelterFile,
      sourceStart: 180.0,
      slug: 'ch13_b05_inside_curved_shell',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 1240.0,
      slug: 'ch13_b06_cannot_live_without',
    },
    {
      sourcePath: 'pexels_locked_door_key.mp4',
      sourceStart: 0.5,
      slug: 'ch13_b07_warmth_safety_locked_door',
      callout: {
        type: 'editorial_lower_third',
        line1: 'HUMAN NECESSITIES',
        line2: 'WARMTH • SAFETY • A LOCKED DOOR',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 3.0,
      },
      sfx: 'whoosh_air.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: 'pexels_neighborhood_community.mp4',
      sourceStart: 1.0,
      slug: 'ch13_b08_people_know_his_name',
    },
    {
      sourcePath: 'la_city_hall_drone_clean.mp4',
      sourceStart: 45.0,
      slug: 'ch13_b09_idea_worth_sitting_with',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 420.0,
      slug: 'ch13_b10_cannot_fix_broken_market',
      callout: {
        type: 'editorial_lower_third',
        line1: 'SYSTEMIC REALITY',
        line2: 'A SHELTER CANNOT FIX THE HOUSING MARKET',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 3.2,
      },
      sfx: 'stat_click.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: theShelterFile,
      sourceStart: 210.0,
      slug: 'ch13_b11_nobody_pretends_otherwise',
    },
    {
      sourcePath: 'pexels_sidewalk_pedestrians_walk.mp4',
      sourceStart: 0.5,
      slug: 'ch13_b12_interrupt_downward_spiral',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 1232.0,
      slug: 'ch13_b13_slept_through_night',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 570.0,
      slug: 'ch13_b14_door_and_address',
      callout: {
        type: 'editorial_lower_third',
        line1: 'A SECURE ADDRESS',
        line2: 'THE FOUNDATION OF REBUILDING',
        themeColor: 'cyan',
        startTime: 0.3,
        endTime: 2.8,
      },
      sfx: 'whoosh_air.mp3',
      sfxVolume: 0.15,
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 195.0,
      slug: 'ch13_b15_think_about_next_month',
    },
    {
      sourcePath: 'pexels_city_council_hearing.mp4',
      sourceStart: 4.0,
      slug: 'ch13_b16_small_thing_to_ask',
    },
    {
      sourcePath: 'skid_row_la_state_of_emergency.mp4',
      sourceStart: 196.0,
      slug: 'ch13_b17_worst_at_providing',
    },
    {
      sourcePath: 'pexels_tents_camp.mp4',
      sourceStart: 5.0,
      slug: 'ch13_b18_not_a_cheap_fix',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 660.0,
      slug: 'ch13_b19_what_they_show',
    },
    {
      sourcePath: 'skid_row_la_state_of_emergency.mp4',
      sourceStart: 255.0,
      slug: 'ch13_b20_distance_from_sidewalk',
    },
    {
      sourcePath: livingInsideFile,
      sourceStart: 1262.0,
      slug: 'ch13_b21_twenty_feet_wide_afternoon',
      callout: {
        type: 'editorial_lower_third',
        line1: 'THE DISTANCE',
        line2: '20 FEET WIDE • BOLTED IN AN AFTERNOON',
        themeColor: 'gold',
        startTime: 0.5,
        endTime: 4.8,
      },
      sfx: 'whoosh_cinematic.mp3',
      sfxVolume: 0.2,
    },
  ];

  const beats: BeatDefinition[] = beatConfigs.map((cfg, i) => {
    const mb = getMasterBeat(chNum, i);
    return {
      beatIndex: i,
      text: mb.text,
      startTime: mb.startTime,
      endTime: mb.endTime,
      sourcePath: cfg.sourcePath,
      sourceStart: cfg.sourceStart,
      slug: cfg.slug,
      callout: cfg.callout,
      sfx: cfg.sfx,
      sfxVolume: cfg.sfxVolume,
    };
  });

  return buildChapter({
    chapterIndex: chNum,
    chapterId: masterCh.id,
    audioPath: path.resolve(REPO_ROOT, 'uploads/audio/13 - Closing.mp3'),
    beats,
  });
}

async function main() {
  console.log('🚀 Slicing and building Chapters 11, 12, and 13...');
  
  const ch11 = buildChapter11();
  console.log(`✅ Chapter 11 built with ${ch11.clips.length} beats.`);

  const ch12 = buildChapter12();
  console.log(`✅ Chapter 12 built with ${ch12.clips.length} beats.`);

  const ch13 = buildChapter13();
  console.log(`✅ Chapter 13 built with ${ch13.clips.length} beats.`);

  console.log('\n🎉 ALL CHAPTERS 11, 12, 13 BUILT AND SLICED SUCCESSFULLY!');
}

main().catch((err) => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
