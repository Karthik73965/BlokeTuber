import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennPedestalComparisonScene,
  ZennGlobalImpactMapScene,
  ZennRomanLegionScene,
  ZennCivilWarBalanceScene,
  ZennBedNetClockScene,
  ZennGarlicKitchenScene,
  ZennNeemCourtyardScene,
  ZennAmazonResinScene,
  ZennConvergenceMosaicScene,
} from '../shared/ZennChapter3Components';

/**
 * 🎬 Chapter 3: Why This Actually Matters (74.40s / 2,232 frames @ 30fps)
 * Authentic Zenn Hand-Drawn Comic Stickman Style (1:1 with Chapter0_Hook & YouTube reference)
 *
 * Visual Direction:
 * - Hand-Drawn Comic Stickman Artwork & Expressive Character Poses
 * - Complete Hand-Drawn Environment Staging (Zero Plain White Voids: Roman arches, kitchen, courtyard, Amazon)
 * - ZERO text badges, ZERO StoryBadge, ZERO corporate cards! Only small hand-drawn comic labels.
 * - 9 Storyboard Beats mapped with frame-accurate timing.
 */
export const Chapter3_WhyMatters: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#FEF3C7' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/3_why_matters.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 256f / 0.0s - 8.52s) "Pedestal Comparison: Deadliest on Earth" */}
      {/* Visual: Terrified shark & roaring lion on #2 and #3 podiums; mosquito crowned #1 */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={256}>
        <SfxTrigger sound="whoosh_air" volume={0.5} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={60} />
        <ZennPedestalComparisonScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (256 - 488f / 8.52s - 16.28s) "725,000 Deaths / Year: Cartography" */}
      {/* Visual: Vintage parchment world map, red disease hotspots, giant mosquito shadow */}
      {/* ================================================================ */}
      <Sequence from={256} durationInFrames={232}>
        <SfxTrigger sound="whoosh" volume={0.6} startFrame={0} />
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={35} />
        <ZennGlobalImpactMapScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (488 - 718f / 16.28s - 23.92s) "Fall of Rome: Pontine Marshes" */}
      {/* Visual: Roman legionary with helmet, shield, and cape shivering/swatting in marsh */}
      {/* ================================================================ */}
      <Sequence from={488} durationInFrames={230}>
        <SfxTrigger sound="whoosh_air" volume={0.5} startFrame={0} />
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={40} />
        <ZennRomanLegionScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (718 - 867f / 23.92s - 28.90s) "Civil War: Disease Exceeded Bullets" */}
      {/* Visual: Historical balance scale tipped: bullet high on left, swarm weighing right */}
      {/* ================================================================ */}
      <Sequence from={718} durationInFrames={149}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={0} />
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={25} />
        <ZennCivilWarBalanceScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (867 - 1,111f / 28.90s - 37.02s) "Sub-Saharan Africa: Every 2 Minutes" */}
      {/* Visual: Respectful African home, family safe under bed net, outside mosquitoes bounce */}
      {/* ================================================================ */}
      <Sequence from={867} durationInFrames={244}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.4} startFrame={30} />
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={70} />
        <ZennBedNetClockScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (1,111 - 1,422f / 37.02s - 47.40s) "Southeast Asia: Garlic Diets & Sulfur" */}
      {/* Visual: Kitchen with steaming pot, eating stickman emitting sulfur fumes, mosquito repelled */}
      {/* ================================================================ */}
      <Sequence from={1111} durationInFrames={311}>
        <SfxTrigger sound="whoosh_air" volume={0.5} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={50} />
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={90} />
        <ZennGarlicKitchenScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (1,422 - 1,630f / 47.40s - 54.32s) "West Africa: Neem Oil -70% Landings" */}
      {/* Visual: Courtyard under neem tree, stickman rubs arm with golden aura, mosquito slips off */}
      {/* ================================================================ */}
      <Sequence from={1422} durationInFrames={208}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={35} />
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={75} />
        <ZennNeemCourtyardScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (1,630 - 1,823f / 54.32s - 60.76s) "Amazon: Burning Resin Smoke Barrier" */}
      {/* Visual: Amazon riverbank dusk, fragrant hearth smoke billowing, clearing mosquitoes */}
      {/* ================================================================ */}
      <Sequence from={1630} durationInFrames={193}>
        <SfxTrigger sound="whoosh_air" volume={0.5} startFrame={0} />
        <SfxTrigger sound="whoosh_cinematic" volume={0.5} startFrame={40} />
        <ZennAmazonResinScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (1,823 - 2,232f / 60.76s - 74.40s) "Global Synthesis & Modern Convergence" */}
      {/* Visual: Rotating globe with 3 cultural vignettes converging to modern sprays, screens, nets */}
      {/* ================================================================ */}
      <Sequence from={1823} durationInFrames={409}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.6} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={80} />
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={220} />
        <ZennConvergenceMosaicScene />
      </Sequence>
    </div>
  );
};
