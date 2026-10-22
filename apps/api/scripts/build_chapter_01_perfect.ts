import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import type { Timeline, TimelineClip } from '@repo/shared';
import { renderTimelineVideo } from '../src/services/remotionRenderer';

const REPO_ROOT = path.resolve(__dirname, '../../..');
const RAW_DIR = path.resolve(REPO_ROOT, 'uploads/raw/proj_dome_villages');
const AUDIO_FILE = path.resolve(REPO_ROOT, 'uploads/audio/1 - The Cold Open.mp3');
const TIMELINE_OUT = path.resolve(REPO_ROOT, 'uploads/timelines/dome/chapter_01_final.json');
const VIDEO_OUT = path.resolve(REPO_ROOT, 'output/dome_villages/chapter_01.mp4');

// SFX
const SFX_DIR = path.resolve(REPO_ROOT, 'packages/remotion-video/public/sfx');
const statClick = path.join(SFX_DIR, 'stat_click.mp3');
const whooshAir = path.join(SFX_DIR, 'whoosh_air.mp3');

function getDuration(p: string): number {
  const out = execSync(`ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${p}"`, {
    encoding: 'utf-8',
  });
  return parseFloat(out.trim()) || 0;
}

async function main() {
  console.log('🎬 REBUILDING CHAPTER 01 WITH RICH PLACES & NAMES CALLOUTS...');

  const totalDuration = getDuration(AUDIO_FILE);
  console.log(`Audio Duration: ${totalDuration.toFixed(2)}s`);

  // Exact 13 narrative beats with context-matched callouts for chapter start, places, names, and architecture
  const beatDefs = [
    {
      start: 0.0,
      end: 4.1,
      text: 'Picture 4 in the morning in Los Angeles, 39 degrees.',
      clip: 'skid_row_emergency_clip_002.mp4',
      // Chapter Opening Callout
      callout: {
        type: 'editorial_lower_third',
        line1: 'LOS ANGELES, CALIFORNIA',
        line2: 'CHAPTER 01 • 4:00 AM • 39°F',
        themeColor: 'gold',
        startTime: 0.4,
        endTime: 3.8,
      },
    },
    {
      start: 4.1,
      end: 8.6,
      text: 'Thousands of people in and around Skid Row are trying to make it to sunrise',
      clip: 'skid_row_emergency_clip_025.mp4',
      // Place Callout
      callout: {
        type: 'editorial_lower_third',
        line1: 'SKID ROW CORRIDOR',
        line2: 'DOWNTOWN LOS ANGELES',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 4.0,
      },
    },
    {
      start: 8.6,
      end: 11.2,
      text: 'under tarps and wet cardboard.',
      clip: 'skid_row_emergency_clip_028.mp4',
      callout: null,
    },
    {
      start: 11.2,
      end: 15.2,
      text: 'Now, picture a 62-year-old veteran two miles away,',
      clip: 'the_shelter_honolulu_hi_dome_p_clip_045.mp4',
      callout: null,
    },
    {
      start: 15.2,
      end: 18.3,
      text: 'asleep in a real bed behind a door that locks,',
      clip: 'intershelter_dome_solution_to__clip_027.mp4',
      // Detail Callout: Inside shelter
      callout: {
        type: 'editorial_lower_third',
        line1: 'DOME INTERIOR',
        line2: 'SECURE SHELTER • 314 SQ FT',
        themeColor: 'cyan',
        startTime: 0.3,
        endTime: 2.8,
      },
    },
    {
      start: 18.3,
      end: 22.9,
      text: 'inside a white fiberglass dome that costs less than most used cars.',
      clip: 'intershelter_dome_solution_to__clip_024.mp4',
      // Architecture Callout
      callout: {
        type: 'editorial_lower_third',
        line1: 'INTERSHELTER DOME',
        line2: 'COMPOSITE SHELTER DESIGN',
        themeColor: 'amber',
        startTime: 0.3,
        endTime: 4.0,
      },
    },
    {
      start: 22.9,
      end: 26.5,
      text: 'That man is imagined. The dome is not.',
      clip: 'the_shelter_honolulu_hi_dome_p_clip_054.mp4',
      callout: null,
    },
    {
      start: 26.5,
      end: 31.0,
      text: 'Homes like it have sheltered real people for more than 30 years,',
      clip: 'intershelter_dome_solution_to__clip_022.mp4',
      // Place / History Callout
      callout: {
        type: 'editorial_lower_third',
        line1: 'DOME VILLAGE',
        line2: 'ESTABLISHED 1993 • 20 DOMES',
        themeColor: 'emerald',
        startTime: 0.3,
        endTime: 4.0,
      },
    },
    {
      start: 31.0,
      end: 35.5,
      text: 'and what happens inside them, the good and the parts nobody talks about,',
      clip: 'intershelter_dome_solution_to__clip_028.mp4',
      callout: null,
    },
    {
      start: 35.5,
      end: 38.4,
      text: 'looks nothing like what the news cameras show you.',
      clip: 'intershelter_dome_solution_to__clip_021.mp4',
      // Television Archive Callout
      callout: {
        type: 'editorial_lower_third',
        line1: 'TELEVISION ARCHIVE',
        line2: 'NEWS BROADCAST • 1993',
        themeColor: 'crimson',
        startTime: 0.3,
        endTime: 2.6,
      },
    },
    {
      start: 38.4,
      end: 42.0,
      text: 'To understand these strange little igloos,',
      clip: 'intershelter_dome_solution_to__clip_025.mp4',
      callout: null,
    },
    {
      start: 42.0,
      end: 46.5,
      text: 'you have to go back to a vacant lot in downtown Los Angeles in 1993',
      clip: 'intershelter_dome_solution_to__clip_023.mp4',
      // Place Callout
      callout: {
        type: 'editorial_lower_third',
        line1: 'GOLDEN AVENUE LOT',
        line2: 'DOWNTOWN LOS ANGELES • 1993',
        themeColor: 'gold',
        startTime: 0.3,
        endTime: 4.0,
      },
    },
    {
      start: 46.5,
      end: totalDuration,
      text: 'and to a man who had spent years proving a point with his own body.',
      clip: 'ted_haeyes_interview_at_dom_vi_clip_015.mp4',
      // Name Callout
      callout: {
        type: 'editorial_lower_third',
        line1: 'TED HAYES',
        line2: 'HOUSING ACTIVIST • FOUNDER',
        themeColor: 'amber',
        startTime: 0.3,
        endTime: 4.0,
      },
    },
  ];

  const clips: TimelineClip[] = [];

  for (let i = 0; i < beatDefs.length; i++) {
    const b = beatDefs[i]!;
    const clipFile = path.join(RAW_DIR, b.clip);
    if (!fs.existsSync(clipFile)) {
      throw new Error(`Clip file does not exist: ${clipFile}`);
    }

    const dur = b.end - b.start;
    const clipDur = getDuration(clipFile);
    console.log(`Beat ${i}: [${b.start.toFixed(1)}s - ${b.end.toFixed(1)}s] (${dur.toFixed(1)}s) | Clip: ${b.clip} | Callout: ${b.callout ? b.callout.line1 : 'None'}`);

    clips.push({
      beatIndex: i,
      chapterIndex: 1,
      text: b.text,
      startTime: b.start,
      endTime: b.end,
      clipPath: clipFile,
      mediaType: 'video',
      layout: 'full_bleed_cinematic',
      kenBurns: true,
      transitionType: i === 0 ? 'cut' : 'crossfade',
      transitionDuration: i === 0 ? 0 : 0.35,
      numberOverlays: [],
      callout: b.callout as any,
      overlay: 'none', // Strictly NO VIGNETTE
      sfxPath: b.callout ? statClick : i % 4 === 0 ? whooshAir : undefined,
      sfxVolume: 0.15,
    });
  }

  const timeline: Timeline = {
    masterAudioPath: AUDIO_FILE,
    totalDuration,
    clips,
  };

  fs.mkdirSync(path.dirname(TIMELINE_OUT), { recursive: true });
  fs.writeFileSync(TIMELINE_OUT, JSON.stringify(timeline, null, 2), 'utf-8');
  console.log(`✅ Saved Chapter 01 timeline to ${TIMELINE_OUT}`);

  console.log('\n🚀 RENDERING CHAPTER 01 VIDEO NOW...');
  fs.mkdirSync(path.dirname(VIDEO_OUT), { recursive: true });
  await renderTimelineVideo(TIMELINE_OUT, VIDEO_OUT);
  console.log(`\n🎉 CHAPTER 01 RENDER COMPLETE: ${VIDEO_OUT}`);
}

main().catch((err) => {
  console.error('❌ Failed:', err);
  process.exit(1);
});
