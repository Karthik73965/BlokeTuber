import path from 'path';
import fs from 'fs';
import { renderTimelineVideo } from '../src/services/remotionRenderer';
import { Timeline, TimelineClip, CalloutType } from '@repo/shared';

async function renderAll20StylesShowcase() {
  console.log('🎬 [MasterShowcase] Building & Rendering all 20 Unique Documentary Motion Components...');

  const outDir = path.resolve(process.cwd(), 'output', 'showcase_20_styles');
  fs.mkdirSync(outDir, { recursive: true });

  const timelineJsonPath = path.join(outDir, 'master_20_styles_timeline.json');
  const finalVideoPath = path.join(outDir, 'all_20_documentary_styles.mp4');

  const clipConfigs: Array<{ type: CalloutType; line1: string; line2?: string }> = [
    {
      type: 'newspaper_headline',
      line1: '1. NEWSPAPER HEADLINE — Yellow Highlighter Sweep',
      line2: 'The Daily Chronicle • Investigative Desk',
    },
    {
      type: 'redacted_dossier',
      line1: '2. REDACTED DOSSIER — Classified Peeling Reveal',
      line2: 'FBI Special Case File #709-A',
    },
    {
      type: 'polaroid_snapshot',
      line1: '3. Polaroid Snapshot',
      line2: 'Scotch Tape & Sharpie Caption',
    },
    {
      type: 'typewriter_paper',
      line1: '4. TYPEWRITER PAPER — Mechanical Typing',
      line2: 'Official Deposition Record Entry',
    },
    {
      type: 'marker_circle',
      line1: '5. MARKER CIRCLE — Hand-Drawn Red Sketch',
      line2: 'Key Evidence Marker',
    },
    {
      type: 'wiretap_intercept',
      line1: '6. WIRETAP INTERCEPT — Live Audio Waveform',
      line2: 'Officer Suarez • Wiretap Tape #84-C',
    },
    {
      type: 'editorial_lower_third',
      line1: '7. EDITORIAL LOWER THIRD — NYT / BBC Style',
      line2: 'Lead Investigative Journalist',
    },
    {
      type: 'police_crime_sheet',
      line1: '8. POLICE CRIME SHEET — 2nd Degree Theft',
      line2: 'Seattle Police Dept Booking Record',
    },
    {
      type: 'odometer_stat',
      line1: '$35,000 BAIL',
      line2: '9. Odometer Stat — King County Court',
    },
    {
      type: 'map_pingeotag',
      line1: '10. MAP PIN GEOTAG — Beacon Hill, WA',
      line2: '47.5925° N, 122.3168° W',
    },
    {
      type: 'editorial_quote',
      line1: '11. EDITORIAL QUOTE — We could not believe what was built.',
      line2: 'Detective Miller • Case Summary',
    },
    {
      type: 'social_tweet_card',
      line1: '12. SOCIAL TWEET CARD — Official statement released regarding the raid.',
      line2: 'Seattle Parks Dept',
    },
    {
      type: 'reddit_thread_card',
      line1: '13. REDDIT THREAD CARD — Eyewitness explains how the enclave stood hidden.',
      line2: 'SeattleWA',
    },
    {
      type: 'caution_tape_banner',
      line1: '14. CAUTION TAPE BANNER — POLICE LINE DO NOT CROSS',
      line2: 'Hazard Alert',
    },
    {
      type: 'archival_evidence_tag',
      line1: '15. ARCHIVAL EVIDENCE TAG',
      line2: 'EXHIBIT C-44 • CLASSIFIED',
    },
    {
      type: 'split_milestone_card',
      line1: '16. OCT 2024',
      line2: '4TH DEMOLITION',
    },
    {
      type: 'karaoke_captions',
      line1: '17. KARAOKE CAPTIONS DYNAMIC WORD TIMING FOR RETENTION',
      line2: '',
    },
    {
      type: 'fullscreen_chapter_title',
      line1: '18. ACT III: THE RAID',
      line2: 'Chapter Title Opener',
    },
    {
      type: 'court_transcript_card',
      line1: '19. COURT TRANSCRIPT — Were you aware of the municipal code violations?',
      line2: 'Superior Court Docket #24-11',
    },
    {
      type: 'forensic_data_card',
      line1: '20. FORENSIC DATA CARD — Telemetry & Barcode',
      line2: 'SHA-256 Checksum Verified',
    },
  ];

  const clipDuration = 2.5;
  const clips: TimelineClip[] = clipConfigs.map((cfg, i) => ({
    beatIndex: i,
    chapterIndex: 0,
    text: `Demonstrating motion component ${i + 1}: ${cfg.type}`,
    startTime: i * clipDuration,
    endTime: (i + 1) * clipDuration,
    clipPath: null,
    mediaType: 'image',
    kenBurns: true,
    transitionType: 'cut',
    transitionDuration: 0,
    numberOverlays: [],
    callout: {
      type: cfg.type,
      line1: cfg.line1,
      line2: cfg.line2,
      startTime: 0.1,
      endTime: clipDuration - 0.1,
    },
  }));

  const showcaseTimeline: Timeline = {
    masterAudioPath: '',
    totalDuration: clips.length * clipDuration,
    outputPath: finalVideoPath,
    clips,
  };

  fs.writeFileSync(timelineJsonPath, JSON.stringify(showcaseTimeline, null, 2));

  console.log(`📋 Total Clips: ${clips.length} | Total Duration: ${showcaseTimeline.totalDuration}s`);
  await renderTimelineVideo(timelineJsonPath, finalVideoPath);

  console.log(`\n🎉 MASTER 20-STYLE SHOWCASE RENDER COMPLETE!`);
  console.log(`📁 Video: ${finalVideoPath}`);
}

renderAll20StylesShowcase().catch((err) => {
  console.error('❌ Render error:', err);
  process.exit(1);
});
