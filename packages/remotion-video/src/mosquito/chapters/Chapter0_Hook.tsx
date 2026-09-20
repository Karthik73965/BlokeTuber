import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennEarBuzzCloseUp,
  ZennLivingRoomTwoShot,
  ZennMysteryThoughtsScene,
  ZennMagnifierSkinScene,
  ZennTargetRadarScene,
  ZennBriefcaseDoorScene,
} from '../shared/ZennMasterComponents';
import {
  ZennBarbecueGrillPatioScene,
  ZennVampireDotsArmScene,
  ZennPeaceFriendScene,
  ZennSlappingPercussionScene,
  ZennLemonGhostScene,
  ZennGrandOpeningBillboardScene,
  ZennBareAnkleLockScene,
} from '../shared/ZennCh0NewScenes';

/**
 * 🎬 Chapter 0: Cold Open — The Human Buffet
 * Strict Editor Revision: 18 beats × exactly 5.00s = 90.0s (2,700 frames @ 30fps)
 * Audio: `0_cold_5s.mp3` (time-aligned)
 */
export const Chapter0_Hook: React.FC = () => {
  const BEAT = 150; // Exactly 5.00s per beat

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#0F172A' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/0_cold_5s.mp3')} volume={1.0} />

      {/* BEAT 01: (0000 - 0150f) Wide establish: Dusk barbecue, Host and Friend two-shot */}
      <Sequence from={0 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <ZennBarbecueGrillPatioScene />
      </Sequence>

      {/* BEAT 02: (0150 - 0300f) Medium two-shot: Slow push toward chairs, itch notices */}
      <Sequence from={1 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennBarbecueGrillPatioScene />
      </Sequence>

      {/* BEAT 03: (0300 - 0450f) Macro insert: Host forearm welts connect-the-dots vampire */}
      <Sequence from={2 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={15} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={60} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={110} />
        <ZennVampireDotsArmScene />
      </Sequence>

      {/* BEAT 04: (0450 - 0600f) Slider right: Move from Host to Friend in same environment */}
      <Sequence from={3 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.4} startFrame={5} />
        <ZennPeaceFriendScene />
      </Sequence>

      {/* BEAT 05: (0600 - 0750f) Reaction close-up: Friend sips lemonade under soft halo */}
      <Sequence from={4 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.4} startFrame={10} />
        <ZennPeaceFriendScene />
      </Sequence>

      {/* BEAT 06: (0750 - 0900f) Wide comedy: Host slaps ankle, calf, then table */}
      <Sequence from={5 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={60} />
        <ZennSlappingPercussionScene />
      </Sequence>

      {/* BEAT 07: (0900 - 1050f) Medium action: Rhythm continues, guests clap along */}
      <Sequence from={6 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennSlappingPercussionScene />
      </Sequence>

      {/* BEAT 08: (1050 - 1200f) Locked wide: Ring of citronella candles, smoke gathers */}
      <Sequence from={7 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.4} startFrame={10} />
        <ZennLemonGhostScene />
      </Sequence>

      {/* BEAT 09: (1200 - 1350f) Smoke insert: Lemon-shaped ghost rises, coughs once */}
      <Sequence from={8 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennLemonGhostScene />
      </Sequence>

      {/* BEAT 10: (1350 - 1500f) Orbit close-up: Mosquitoes circle Host only */}
      <Sequence from={9 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennMysteryThoughtsScene />
      </Sequence>

      {/* BEAT 11: (1500 - 1650f) Graphic triptych: SWEETER? CURSED? PREMIUM BLOOD? */}
      <Sequence from={10 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={60} />
        <ZennMysteryThoughtsScene />
      </Sequence>

      {/* BEAT 12: (1650 - 1800f) Overhead map: Dotted route ends at Host's chair */}
      <Sequence from={11 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={15} />
        <ZennBriefcaseDoorScene />
      </Sequence>

      {/* BEAT 13: (1800 - 1950f) Hero silhouette: Scan line passes over Host, "THEY READ YOU" */}
      <Sequence from={12 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={15} />
        <ZennTargetRadarScene />
      </Sequence>

      {/* BEAT 14: (1950 - 2100f) Layered profile: Breath plume, heat map, skin-odor particles */}
      <Sequence from={13 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={10} />
        <ZennLivingRoomTwoShot progress={0.5} />
      </Sequence>

      {/* BEAT 15: (2100 - 2250f) Microscope push: Dive into odor cloud, normal skin microbes */}
      <Sequence from={14 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennMagnifierSkinScene />
      </Sequence>

      {/* BEAT 16: (2250 - 2400f) Wide metaphor: GRAND OPENING sign above Host */}
      <Sequence from={15 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />
        <ZennGrandOpeningBillboardScene />
      </Sequence>

      {/* BEAT 17: (2400 - 2550f) Host close-up: Host rolls sleeves down, points to signal */}
      <Sequence from={16 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennEarBuzzCloseUp />
      </Sequence>

      {/* BEAT 18: (2550 - 2700f) Low ankle insert: 1cm exposed ankle, mosquito lands */}
      <Sequence from={17 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={20} />
        <ZennBareAnkleLockScene />
      </Sequence>
    </div>
  );
};
