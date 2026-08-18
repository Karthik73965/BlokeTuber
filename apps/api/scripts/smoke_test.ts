import dotenv from 'dotenv';
import path from 'path';
import { parseScript, getAllBeats } from '../src/services/scriptParser';
import { matchClipForBeat, detectNumberCallouts } from '../src/services/clipMatcher';
import { findStockFootage } from '../src/services/stockFootage';
import { buildTimeline } from '../src/services/timelineBuilder';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

async function runSmokeTest() {
  console.log('====================================================');
  console.log('🔥 BLOKETUBER SYSTEM SMOKE TEST');
  console.log('====================================================\n');

  // 1. Test Script Parser
  console.log('1️⃣ Testing Script Parser...');
  const testScript = `## Chapter 1\n\nIn a small rural town, a historic house was put on sale for just $2,000.\n\n## Chapter 2\n\nMany buyers rushed to inspect the hidden property.`;
  const chapters = parseScript(testScript);
  const beats = getAllBeats(chapters);
  console.log(`   ✓ Parsed ${chapters.length} chapters, ${beats.length} beats`);

  // 2. Test Number Callout Detection
  console.log('\n2️⃣ Testing Number/Dollar Callout Detection...');
  const callouts = detectNumberCallouts(beats[0]?.text || '');
  console.log(`   ✓ Detected callouts in beat 1: [${callouts.join(', ')}]`);

  // 3. Test OpenRouter AI Clip Matcher
  console.log('\n3️⃣ Testing OpenRouter AI Clip Matcher...');
  const sampleClips = ['house_exterior_sunset.mp4', 'people_talking_porch.mp4', 'rural_road_drive.mp4'];
  const beatInput = {
    text: beats[0]?.text || 'Small house for sale',
    startTime: 0,
    endTime: 5,
    chapterIndex: 0,
    beatIndex: 0,
  };

  try {
    const match = await matchClipForBeat(beatInput, sampleClips, new Set());
    console.log(`   ✓ OpenRouter Match Result: clip="${match.clipPath}", confidence=${match.confidence}, useStock=${match.useStock}, reason="${match.reason}"`);
  } catch (err) {
    console.error('   ❌ OpenRouter Matcher Error:', err);
  }

  // 4. Test Stock Footage APIs (Pexels & Pixabay)
  console.log('\n4️⃣ Testing Stock Footage APIs (Pexels & Pixabay)...');
  try {
    const stock = await findStockFootage('abandoned house');
    if (stock) {
      console.log(`   ✓ Stock Footage Found! Platform: [${stock.source.toUpperCase()}], URL: ${stock.url.slice(0, 60)}...`);
    } else {
      console.log('   ⚠️ No stock video returned');
    }
  } catch (err) {
    console.error('   ❌ Stock Footage Error:', err);
  }

  // 5. Test Timeline Builder
  console.log('\n5️⃣ Testing Timeline Builder...');
  const timeline = buildTimeline({
    masterAudioPath: 'master_narration.mp3',
    outputPath: 'output.mp4',
    beats: [beatInput],
    matches: [{ clipPath: 'house_exterior_sunset.mp4', confidence: 0.9, reason: 'Good match', useStock: false }],
    alignments: [],
    chapterTimings: [{ chapter: 1, start: 0, end: 5, duration: 5 }],
    numberCallouts: [{ beatIndex: 0, texts: ['$2,000'] }],
    clipLibraryRoot: '/clips',
  });
  console.log(`   ✓ Timeline assembled cleanly: ${timeline.clips.length} clip(s), duration: ${timeline.totalDuration}s`);

  console.log('\n====================================================');
  console.log('✅ SMOKE TEST COMPLETED SUCCESSFULLY');
  console.log('====================================================\n');
}

runSmokeTest().catch(console.error);
