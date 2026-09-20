import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennSkinMacroDescentScene,
  ZennSkinMicrobiomeLandscapeScene,
  ZennSkinHotspotsScene,
  ZennSkinCocktailCloudScene,
  ZennSkinDiversityPartyScene,
  ZennSkinWashSoapScene,
  ZennSkinBloodTypeOvsAScene,
  ZennSkinSecretorDialScene,
  ZennSkinEvolutionAmberScene,
} from '../shared/ZennSkinScenes';
import {
  ZennMicrobeTenantsScene,
  ZennCarboxylicDoNotLickScene,
  ZennAbundanceDiversityScene,
  ZennMultivariableMegaphoneScene,
} from '../shared/ZennCh2NewScenes';

/**
 * 🎬 Chapter 2: Your Skin Has A Chemical Signature
 * Strict Editor Revision: 22 beats × exactly 5.00s = 110.0s (3,300 frames @ 30fps)
 * Audio: `2_skin_5s.mp3` (time-aligned)
 */
export const Chapter2_Skin: React.FC = () => {
  const BEAT = 150; // Exactly 5.00s per beat

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#0F172A' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/2_skin_5s.mp3')} volume={1.0} />

      {/* BEAT 01: (0000 - 0150f) Macro landscape: Pores, fine hairs, oils, and salt crystals */}
      <Sequence from={0 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <ZennSkinMacroDescentScene />
      </Sequence>

      {/* BEAT 02: (0150 - 0300f) Microbe city: Normal bacteria moving as residents */}
      <Sequence from={1 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennSkinMicrobiomeLandscapeScene />
      </Sequence>

      {/* BEAT 03: (0300 - 0450f) Character insert: Hard-hat microbe waves, NORMAL RESIDENT */}
      <Sequence from={2 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennMicrobeTenantsScene />
      </Sequence>

      {/* BEAT 04: (0450 - 0600f) Landlord gag: Host rent clipboard, NO ELECTRICITY BILL */}
      <Sequence from={3 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennMicrobeTenantsScene />
      </Sequence>

      {/* BEAT 05: (0600 - 0750f) Process close-up: Microbes transform skin material into odor */}
      <Sequence from={4 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennSkinCocktailCloudScene />
      </Sequence>

      {/* BEAT 06: (0750 - 0900f) Comparison insert: Pure sweat vs sweat + microbes */}
      <Sequence from={5 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={15} />
        <ZennSkinHotspotsScene />
      </Sequence>

      {/* BEAT 07: (0900 - 1050f) Molecular graphic: Compounds assemble into barcode pattern */}
      <Sequence from={6 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={10} />
        <ZennSkinDiversityPartyScene />
      </Sequence>

      {/* BEAT 08: (1050 - 1200f) Mosquito POV: Barcode becomes colored odor trail */}
      <Sequence from={7 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennSkinEvolutionAmberScene />
      </Sequence>

      {/* BEAT 09: (1200 - 1350f) Lab setup: Human-worn fabric in two-choice chamber */}
      <Sequence from={8 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennSkinBloodTypeOvsAScene />
      </Sequence>

      {/* BEAT 10: (1350 - 1500f) Result & calendar: Difference stable over years */}
      <Sequence from={9 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennSkinBloodTypeOvsAScene />
      </Sequence>

      {/* BEAT 11: (1500 - 1650f) Skin chemistry close-up: Higher carboxylic acids in magnets */}
      <Sequence from={10 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennSkinSecretorDialScene />
      </Sequence>

      {/* BEAT 12: (1650 - 1800f) Safety-label gag: Container labeled DO NOT LICK */}
      <Sequence from={11 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />
        <ZennCarboxylicDoNotLickScene />
      </Sequence>

      {/* BEAT 13: (1800 - 1950f) Normal-skin card: NORMAL PART OF HUMAN SKIN CHEMISTRY */}
      <Sequence from={12 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennCarboxylicDoNotLickScene />
      </Sequence>

      {/* BEAT 14: (1950 - 2100f) Bathroom medium: Host washes normally, not failing soap */}
      <Sequence from={13 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.5} startFrame={10} />
        <ZennSkinWashSoapScene />
      </Sequence>

      {/* BEAT 15: (2100 - 2250f) Odor-trail close-up: Normal skin blend easier to follow */}
      <Sequence from={14 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennSkinEvolutionAmberScene />
      </Sequence>

      {/* BEAT 16: (2250 - 2400f) Microbiome split: Two community compositions produce blends */}
      <Sequence from={15 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennAbundanceDiversityScene />
      </Sequence>

      {/* BEAT 17: (2400 - 2550f) Evidence card: COMPOSITION MATTERS, cross out MORE BACTERIA */}
      <Sequence from={16 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />
        <ZennAbundanceDiversityScene />
      </Sequence>

      {/* BEAT 18: (2550 - 2700f) Microbiome comparison: Greater abundance but lower diversity */}
      <Sequence from={17 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennAbundanceDiversityScene />
      </Sequence>

      {/* BEAT 19: (2700 - 2850f) Species & study board: Different patterns connect to board */}
      <Sequence from={18 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennAbundanceDiversityScene />
      </Sequence>

      {/* BEAT 20: (2850 - 3000f) Barbecue setup: Question marks dissolve back to barbecue */}
      <Sequence from={19 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennMultivariableMegaphoneScene />
      </Sequence>

      {/* BEAT 21: (3000 - 3150f) Host deadpan: Deliver scientific phrase directly to camera */}
      <Sequence from={20 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />
        <ZennMultivariableMegaphoneScene />
      </Sequence>

      {/* BEAT 22: (3150 - 3300f) Transition pull-out: Microbe landscape shrinks to scent halo */}
      <Sequence from={21 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.6} startFrame={10} />
        <ZennMultivariableMegaphoneScene />
      </Sequence>
    </div>
  );
};
