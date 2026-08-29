import { planScriptWithAI, mapPlannedBeatsToTiming } from '../src/services/aiScriptPlanner';

async function runTest() {
  console.log('🧪 Testing Dynamic Video vs. Photo Semantic Media Planning...\n');

  const testScript = `
An excavator tore into the hillside at dawn.
The makeshift cabin stood on the edge of Seneca Road.
Police cars raced down the highway with sirens flashing.
Todd lived seventeen years without a permanent home.
Officers raided the property and arrested the suspect.
The bail was set at thirty-five thousand dollars.
  `.trim();

  console.log('1. Directing script with AI Director (OpenRouter / Gemini / GPT-4o)...');
  const plan = await planScriptWithAI(testScript, []);

  console.log(`\nDirecting produced ${plan.beats.length} beats:`);
  for (const b of plan.beats) {
    console.log(`  [Beat ${b.beatIndex}] [${b.mediaType.toUpperCase()}] "${b.text}"`);
    if (b.callout) {
      console.log(`     ↳ Callout [${b.callout.type}]: "${b.callout.line1}" (Trigger: "${b.callout.spokenTrigger || 'none'}")`);
    }
  }

  const videoBeats = plan.beats.filter((b) => b.mediaType === 'video');
  const imageBeats = plan.beats.filter((b) => b.mediaType === 'image');

  console.log(`\nSummary: ${videoBeats.length} Video action shots, ${imageBeats.length} Photo still shots.`);

  if (videoBeats.length === 0) {
    throw new Error('Expected action lines (excavator, police cars racing, raid) to produce video beats, but got 0 video beats!');
  }

  // ── Test 2: Sub-shot splitting preserves mediaType ──
  console.log('\n2. Testing sub-shot duration splitting continuity...');
  const timed = mapPlannedBeatsToTiming(plan.beats, [], 60.0);
  const timedVideoCount = timed.filter((t) => t.mediaType === 'video').length;
  console.log(`  Sub-split beats produced ${timed.length} total shots (${timedVideoCount} video shots).`);

  if (timedVideoCount === 0 && videoBeats.length > 0) {
    throw new Error('Sub-split shots wiped out video mediaType!');
  }

  console.log('\n✅ ALL DYNAMIC MEDIA PLANNER TESTS PASSED!');
}

runTest().catch((err) => {
  console.error('❌ Media Planner Test failed:', err);
  process.exit(1);
});
