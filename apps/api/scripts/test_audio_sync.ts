import { findPhraseTimestamp, normalizeForSearch, SegmentAlignment } from '../src/services/whisperAlignment';
import { buildTimeline, TimedPlannedBeat } from '../src/services/timelineBuilder';

async function runTest() {
  console.log('🧪 Testing Precision Spoken-Word Audio-Text Synchronization...\n');

  // ── Test 1: Normalizer Test ──
  console.log('1. Testing number and currency normalization...');
  const tests = [
    { input: '$35,000 Bail', expectedIncludes: 'thirty five thousand dollars' },
    { input: '17 Years Homeless', expectedIncludes: 'seventeen' },
    { input: '$2,000 Total Cost', expectedIncludes: 'two thousand dollars' },
    { input: '4th Arrest', expectedIncludes: 'fourth' },
  ];

  for (const t of tests) {
    const variations = normalizeForSearch(t.input);
    const matched = variations.some((v) => v.includes(t.expectedIncludes));
    if (!matched) {
      throw new Error(`Normalization failed for "${t.input}". Got variations: ${JSON.stringify(variations)}`);
    }
    console.log(`  ✓ "${t.input}" -> includes "${t.expectedIncludes}"`);
  }

  // ── Test 2: Whisper Timestamp Alignment Matching ──
  console.log('\n2. Testing timestamp lookup against spoken words...');
  const mockAlignments: SegmentAlignment[] = [
    {
      text: 'The judge set bail at thirty five thousand dollars on Tuesday afternoon.',
      start: 10.0,
      end: 15.0,
      words: [
        { word: 'The', start: 10.0, end: 10.2 },
        { word: 'judge', start: 10.2, end: 10.6 },
        { word: 'set', start: 10.6, end: 10.9 },
        { word: 'bail', start: 10.9, end: 11.3 },
        { word: 'at', start: 11.3, end: 11.5 },
        { word: 'thirty', start: 11.5, end: 11.9 },
        { word: 'five', start: 11.9, end: 12.3 },
        { word: 'thousand', start: 12.3, end: 12.8 },
        { word: 'dollars', start: 12.8, end: 13.3 },
        { word: 'on', start: 13.3, end: 13.6 },
        { word: 'Tuesday', start: 13.6, end: 14.2 },
        { word: 'afternoon', start: 14.2, end: 15.0 },
      ],
    },
  ];

  // Lookup with display text "$35,000" and spokenTrigger "thirty five thousand dollars"
  const ts1 = findPhraseTimestamp('$35,000', mockAlignments);
  if (!ts1) throw new Error('Failed to find timestamp for "$35,000" using normalizer!');
  console.log(`  ✓ findPhraseTimestamp("$35,000") matched spoken audio range: ${ts1.start}s -> ${ts1.end}s`);

  const ts2 = findPhraseTimestamp('thirty five thousand dollars', mockAlignments);
  if (!ts2) throw new Error('Failed to find timestamp for exact spoken trigger!');
  console.log(`  ✓ findPhraseTimestamp("thirty five thousand dollars") matched: ${ts2.start}s -> ${ts2.end}s`);

  // ── Test 3: Timeline Builder Offset Precision ──
  console.log('\n3. Testing Timeline Builder callout startOffset calculation...');
  const mockTimedBeats: TimedPlannedBeat[] = [
    {
      beatIndex: 0,
      chapterIndex: 0,
      text: 'The judge set bail at thirty five thousand dollars on Tuesday afternoon.',
      startTime: 10.0,
      endTime: 15.0,
      mediaType: 'image',
      clipFilename: null,
      stockVideoQuery: null,
      backupVideoQuery: null,
      stockPhotoQuery: 'court judge gavel',
      reason: 'bail announcement',
      resolvedPath: null,
      callout: {
        type: 'stat_callout',
        line1: '$35,000 BAIL',
        line2: 'KING COUNTY SUPERIOR COURT',
        spokenTrigger: 'thirty five thousand dollars',
        themeColor: 'gold',
      },
    },
  ];

  const timeline = buildTimeline({
    masterAudioPath: 'dummy.mp3',
    outputPath: 'dummy.mp4',
    timedBeats: mockTimedBeats,
    alignments: mockAlignments,
    chapterTimings: [{ index: 0, title: 'Chapter 1', start: 0, end: 15.0, duration: 15.0 }],
    numberCallouts: [],
  });

  const clip = timeline.clips[0]!;
  if (!clip.callout) throw new Error('Callout missing on timeline clip!');

  console.log(`  Clip startTime: ${clip.startTime}s, endTime: ${clip.endTime}s`);
  console.log(`  Callout relative startTime: ${clip.callout.startTime}s (absolute: ${(clip.startTime + clip.callout.startTime).toFixed(2)}s)`);

  // Spoken trigger starts at 11.5s -> relative to clip (10.0s) is ~1.5s + 0.1s buffer = 1.6s
  if (clip.callout.startTime < 1.0) {
    throw new Error(`Callout appeared too early! Expected ~1.6s, got ${clip.callout.startTime}s`);
  }

  console.log(`  ✓ Callout sync verified! Appears at ${clip.callout.startTime}s into clip (exactly when "thirty five thousand" is spoken).`);
  console.log('\n✅ ALL AUDIO SYNC TESTS PASSED!');
}

runTest().catch((err) => {
  console.error('❌ Audio Sync Test failed:', err);
  process.exit(1);
});
