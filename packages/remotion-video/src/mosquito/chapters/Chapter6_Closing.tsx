import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennClosingBeat1_Callback,
  ZennClosingBeat2_MythSweep,
  ZennClosingBeat10_YouTubeOutro,
} from '../shared/ZennClosingComponents';
import {
  ZennFourLayerStackHudScene,
  ZennRadioBroadcastTowerScene,
  ZennTwoThirteenBedroomScene,
} from '../shared/ZennCh6NewScenes';

/**
 * 🎬 Chapter 6: Closing — The Signal You Never Knew You Sent
 * Strict Editor Revision: 10 beats × exactly 5.00s = 50.0s (1,500 frames @ 30fps)
 * Audio: `6_closing_5s.mp3` (time-aligned)
 */
export const Chapter6_Closing: React.FC = () => {
  const BEAT = 150; // Exactly 5.00s per beat

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#0B132B' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/6_closing_5s.mp3')} volume={1.0} />

      {/* BEAT 01: (0000 - 0150f) Exact callback wide: Recreate opening barbecue composition & lighting */}
      <Sequence from={0 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <ZennClosingBeat1_Callback />
      </Sequence>

      {/* BEAT 02: (0150 - 0300f) Two-shot plus layer one: Friend untouched as CO2 trail appears around Host */}
      <Sequence from={1 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennFourLayerStackHudScene />
      </Sequence>

      {/* BEAT 03: (0300 - 0450f) Layer two: Skin odor, microbes, warmth, moisture join locked composition */}
      <Sequence from={2 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennFourLayerStackHudScene />
      </Sequence>

      {/* BEAT 04: (0450 - 0600f) Layer three: Visual contrast completes stack while activity labels change */}
      <Sequence from={3 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennFourLayerStackHudScene />
      </Sequence>

      {/* BEAT 05: (0600 - 0750f) Identity card: Genetics & environment feed into UNIQUE BIOLOGICAL CHEMISTRY */}
      <Sequence from={4 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.4} startFrame={10} />
        <ZennClosingBeat2_MythSweep />
      </Sequence>

      {/* BEAT 06: (0750 - 0900f) Myth-clear close-up: NOT SWEETER and NOT CURSED appear beside Host */}
      <Sequence from={5 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennClosingBeat2_MythSweep />
      </Sequence>

      {/* BEAT 07: (0900 - 1050f) Radio metaphor: Signal lines radiate softly; do not turn Host into tower */}
      <Sequence from={6 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.5} startFrame={10} />
        <ZennRadioBroadcastTowerScene />
      </Sequence>

      {/* BEAT 08: (1050 - 1200f) Reception payoff: Mosquito in dark foliage gets full bars */}
      <Sequence from={7 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />
        <ZennRadioBroadcastTowerScene />
      </Sequence>

      {/* BEAT 09: (1200 - 1350f) Bedroom callback: Clock reads 2:13 a.m.; mosquito buzzes near Host ear */}
      <Sequence from={8 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennTwoThirteenBedroomScene />
      </Sequence>

      {/* BEAT 10: (1350 - 1500f) End screen: Sir Curious logo, subscribe button, hold full 5 seconds */}
      <Sequence from={9 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />
        <ZennClosingBeat10_YouTubeOutro />
      </Sequence>
    </div>
  );
};
