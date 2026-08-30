import { planScriptWithAI, mapPlannedBeatsToTiming } from '../src/services/aiScriptPlanner';

async function testPacing() {
  const sampleScript = `
    On a hidden hillside overlooking Seattle's highway corridor, an unauthorized two-story cabin was discovered deep inside the greenbelt.
    City workers and police stumbled across the structure during a routine sweep, finding complex electrical wiring powered by a hidden generator.
    Inside the cabin, investigators uncovered extensive heating systems, wood-burning stoves, and insulated walls.
    According to official court records, this was the fifth separate attempt by the occupant to construct a permanent homestead on public land.
    A forensic survey of the property boundary revealed the building was erected entirely within city park limits.
  `;

  console.log('🧪 Testing AI Director with Dynamic Variable Beat Pacing (5-7s Hero vs 2.5-3.5s Baseline)...');
  const plan = await planScriptWithAI(sampleScript, []);
  console.log(`\n📋 Planned ${plan.beats.length} beats:`);

  const mockAlignments: any[] = [];
  const timed = mapPlannedBeatsToTiming(plan.beats, mockAlignments, 32);

  let heroCount = 0;
  let baselineCount = 0;

  for (const b of timed) {
    const dur = (b.endTime - b.startTime).toFixed(1);
    const hasFeature = b.layout && b.layout !== 'full_bleed_cinematic';
    const hasCallout = !!b.callout;
    const isHero = hasFeature || hasCallout || Number(dur) >= 4.5;

    if (isHero) heroCount++;
    else baselineCount++;

    console.log(`\n⏱️ [${b.startTime}s - ${b.endTime}s] (${dur}s) ${isHero ? '🌟 HERO EVENT' : '⚡ BASELINE'}`);
    console.log(`   Text: "${b.text}"`);
    console.log(`   Layout: ${b.layout || 'full_bleed_cinematic'} | Callout: ${b.callout?.type || 'none'} | Stock: "${b.stockVideoQuery || b.stockPhotoQuery}"`);
    if (b.additionalStockQueries?.length) {
      console.log(`   ↳ Multi-Asset Slots:`, b.additionalStockQueries.map(s => `[${s.slot}: ${s.query}]`).join(', '));
    }
  }

  console.log(`\n==============================================`);
  console.log(`🎯 Summary: ${heroCount} Hero Beats (${Math.round((heroCount / timed.length) * 100)}%) | ${baselineCount} Baseline Beats (${Math.round((baselineCount / timed.length) * 100)}%)`);
  console.log(`==============================================\n`);
}

testPacing().catch(console.error);
