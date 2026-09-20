import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennPedestalComparisonScene,
  ZennGlobalImpactMapScene,
} from '../shared/ZennChapter3Components';
import {
  ZennWorldPathogenVectorsScene,
  ZennWhoMalariaStats2024Scene,
  ZennOlfactoryReceptorLockScene,
  ZennRestaurantClosedSignScene,
} from '../shared/ZennCh4NewScenes';

/**
 * 🎬 Chapter 4: Why This Is More Than An Itchy Joke
 * Strict Editor Revision: 10 beats × exactly 5.00s = 50.0s (1,500 frames @ 30fps)
 * Audio: `4_why_matters_5s.mp3` (time-aligned)
 */
export const Chapter4_WhyMatters: React.FC = () => {
  const BEAT = 150; // Exactly 5.00s per beat

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#0B132B' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/4_why_matters_5s.mp3')} volume={1.0} />

      {/* BEAT 01: (0000 - 0150f) Patio-to-map dissolve: Warm barbecue palette drains into global map */}
      <Sequence from={0 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <ZennPedestalComparisonScene />
      </Sequence>

      {/* BEAT 02: (0150 - 0300f) Disease icons: Malaria, Dengue, Yellow Fever, Zika, West Nile */}
      <Sequence from={1 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={60} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={110} />
        <ZennWorldPathogenVectorsScene />
      </Sequence>

      {/* BEAT 03: (0300 - 0450f) Transmission diagram: Clean host-vector-host pathway */}
      <Sequence from={2 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennWorldPathogenVectorsScene />
      </Sequence>

      {/* BEAT 04: (0450 - 0600f) WHO statistic: 610,000 ESTIMATED MALARIA DEATHS - 2024 */}
      <Sequence from={3 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.6} startFrame={10} />
        <ZennWhoMalariaStats2024Scene />
      </Sequence>

      {/* BEAT 05: (0600 - 0750f) Africa map: Highlight WHO African Region with respectful motion */}
      <Sequence from={4 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennWhoMalariaStats2024Scene />
      </Sequence>

      {/* BEAT 06: (0750 - 0900f) Family scene: Family sleeps beneath insecticide-treated net */}
      <Sequence from={5 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.4} startFrame={10} />
        <ZennGlobalImpactMapScene />
      </Sequence>

      {/* BEAT 07: (0900 - 1050f) Research lab: Scientists test odor samples and mosquito receptors */}
      <Sequence from={6 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennOlfactoryReceptorLockScene />
      </Sequence>

      {/* BEAT 08: (1050 - 1200f) Receptor macro: Odor molecule approaches receptor, TARGET OF RESEARCH */}
      <Sequence from={7 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />
        <ZennOlfactoryReceptorLockScene />
      </Sequence>

      {/* BEAT 09: (1200 - 1350f) Tool montage: Trap, repellent, screen, bed net defense row */}
      <Sequence from={8 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennOlfactoryReceptorLockScene />
      </Sequence>

      {/* BEAT 10: (1350 - 1500f) Closed-sign transition: RESTAURANT CLOSED sign flips over to patio */}
      <Sequence from={9 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />
        <ZennRestaurantClosedSignScene />
      </Sequence>
    </div>
  );
};
