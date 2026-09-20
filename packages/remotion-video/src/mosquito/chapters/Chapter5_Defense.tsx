import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennClosingBeat3_ThreeLayers,
} from '../shared/ZennClosingComponents';
import {
  ZennGroupDecoyScene,
  ZennProvenRepellentsShelfScene,
  ZennPatioFanWindstreamScene,
  ZennMaternityWardsDumpScene,
  ZennMiracleFoodUncleScene,
  ZennCitronellaAmbitionScene,
} from '../shared/ZennDefenseComponents';

/**
 * 🎬 Chapter 5: What Actually Helps (Science vs Myth)
 * Strict Editor Revision: 16 beats × exactly 5.00s = 80.0s (2,400 frames @ 30fps)
 * Audio: `5_what_helps_5s.mp3` (time-aligned)
 */
export const Chapter5_Defense: React.FC = () => {
  const BEAT = 150; // Exactly 5.00s per beat

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#0B132B' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/5_what_helps_5s.mp3')} volume={1.0} />

      {/* BEAT 01: (0000 - 0150f) Group wide: Friends hide behind Host; Host steps out of decoy */}
      <Sequence from={0 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <ZennGroupDecoyScene />
      </Sequence>

      {/* BEAT 02: (0150 - 0300f) Hero medium: Host raises repellent bottle as decoy resolves */}
      <Sequence from={1 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennGroupDecoyScene />
      </Sequence>

      {/* BEAT 03: (0300 - 0450f) Label insert: Zoom on registration, FOLLOW LOCAL LABEL */}
      <Sequence from={2 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennProvenRepellentsShelfScene />
      </Sequence>

      {/* BEAT 04: (0450 - 0600f) Ingredient shelf: DEET, PICARIDIN, IR3535 */}
      <Sequence from={3 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={60} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={110} />
        <ZennProvenRepellentsShelfScene />
      </Sequence>

      {/* BEAT 05: (0600 - 0750f) Ingredient shelf: OLE/PMD, 2-UNDECANONE with chemical structures */}
      <Sequence from={4 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={15} />
        <ZennProvenRepellentsShelfScene />
      </Sequence>

      {/* BEAT 06: (0750 - 0900f) Wardrobe medium: Host changes into loose light long sleeves */}
      <Sequence from={5 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennClosingBeat3_ThreeLayers />
      </Sequence>

      {/* BEAT 07: (0900 - 1050f) Travel kit: Treated clothing note ON CLOTHING - NOT SKIN */}
      <Sequence from={6 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennClosingBeat3_ThreeLayers />
      </Sequence>

      {/* BEAT 08: (1050 - 1200f) Patio wide: Oscillating fan powers on; airflow crosses seating */}
      <Sequence from={7 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.6} startFrame={10} />
        <ZennPatioFanWindstreamScene />
      </Sequence>

      {/* BEAT 09: (1200 - 1350f) Airflow & barrier montage: Plume breaks, window screens & bed nets */}
      <Sequence from={8 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennPatioFanWindstreamScene />
      </Sequence>

      {/* BEAT 10: (1350 - 1500f) Yard inspection: Host finds saucer, bucket, toy dump-truck */}
      <Sequence from={9 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.4} startFrame={10} />
        <ZennMaternityWardsDumpScene />
      </Sequence>

      {/* BEAT 11: (1500 - 1650f) Water close-up: Empty, scrub, invert containers; maternity closes */}
      <Sequence from={10 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.6} startFrame={15} />
        <ZennMaternityWardsDumpScene />
      </Sequence>

      {/* BEAT 12: (1650 - 1800f) Food conveyor: Garlic, banana, sauces pass NOT PROVEN */}
      <Sequence from={11 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={70} />
        <ZennMiracleFoodUncleScene />
      </Sequence>

      {/* BEAT 13: (1800 - 1950f) Marmite gag: Host takes spoonful, waits, remains completely visible */}
      <Sequence from={12 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />
        <ZennMiracleFoodUncleScene />
      </Sequence>

      {/* BEAT 14: (1950 - 2100f) Uncle cutaway: Uncle says WORKS FOR ME; Host smiles */}
      <Sequence from={13 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennMiracleFoodUncleScene />
      </Sequence>

      {/* BEAT 15: (2100 - 2250f) Citronella wide: One candle sits alone across patio, small effect */}
      <Sequence from={14 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennCitronellaAmbitionScene />
      </Sequence>

      {/* BEAT 16: (2250 - 2400f) Citronella button: Candle poses in cape, MOOD LIGHTING WITH AMBITION */}
      <Sequence from={15 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />
        <ZennCitronellaAmbitionScene />
      </Sequence>
    </div>
  );
};
