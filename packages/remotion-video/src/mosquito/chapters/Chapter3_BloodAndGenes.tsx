import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennTwinPaperScene,
  ZennIdenticalTwinsScene,
  ZennFraternalTwinsScene,
  ZennGeneticsPieChartScene,
  ZennDNATraitsScene,
  ZennCitronellaWillpowerScene,
  ZennGeneLabBenchScene,
  ZennVolumeSliderMuteScene,
} from '../shared/Chapter4MasterComponents';
import {
  ZennSkinBloodTypeOvsAScene,
  ZennSkinSecretorDialScene,
  ZennSkinNameTagGagScene,
} from '../shared/ZennSkinScenes';
import { ZennPeaceFriendScene } from '../shared/ZennCh0NewScenes';
import {
  ZennHospitalReceptionistScene,
  ZennTypeASwampConfidenceScene,
  ZennMetaScriptPage5Scene,
  ZennNoRevengeListScene,
  ZennLimitedEditionCuisineScene,
} from '../shared/ZennCh3NewScenes';

/**
 * 🎬 Chapter 3: Is It Your Blood Type Or Your Genes?
 * Strict Editor Revision: 22 beats × exactly 5.00s = 110.0s (3,300 frames @ 30fps)
 * Audio: `3_blood_and_genes_5s.mp3` (time-aligned)
 */
export const Chapter3_BloodAndGenes: React.FC = () => {
  const BEAT = 150; // Exactly 5.00s per beat

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#0F172A' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/3_blood_and_genes_5s.mp3')} volume={1.0} />

      {/* BEAT 01: (0000 - 0150f) Evidence board: TYPE O claim on small card marked LIMITED STUDY */}
      <Sequence from={0 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <ZennSkinBloodTypeOvsAScene />
      </Sequence>

      {/* BEAT 02: (0150 - 0300f) Study setup: Modest mosquito-landing comparison from one study */}
      <Sequence from={1 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennSkinBloodTypeOvsAScene />
      </Sequence>

      {/* BEAT 03: (0300 - 0450f) Research result: Type O and Type A result bars appear */}
      <Sequence from={2 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennHospitalReceptionistScene />
      </Sequence>

      {/* BEAT 04: (0450 - 0600f) Hospital-reception gag: Mosquito asks for blood-type form */}
      <Sequence from={3 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />
        <ZennHospitalReceptionistScene />
      </Sequence>

      {/* BEAT 05: (0600 - 0750f) Qualifier close-up: LIMITED, SPECIES-SPECIFIC, WEAKER THAN ODOR */}
      <Sequence from={4 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennSkinSecretorDialScene />
      </Sequence>

      {/* BEAT 06: (0750 - 0900f) Skin-marker diagram: Suggest possible skin-chemistry link */}
      <Sequence from={5 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={10} />
        <ZennSkinSecretorDialScene />
      </Sequence>

      {/* BEAT 07: (0900 - 1050f) Reality check: Blood-type card shrinks while BREATH/ODOR enlarge */}
      <Sequence from={6 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennSkinNameTagGagScene />
      </Sequence>

      {/* BEAT 08: (1050 - 1200f) Swamp comedy: Type A enters swamp in shorts, confidence meter collapses */}
      <Sequence from={7 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />
        <ZennTypeASwampConfidenceScene />
      </Sequence>

      {/* BEAT 09: (1200 - 1350f) DNA transition: Ranking chart twists into rotating DNA helix */}
      <Sequence from={8 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.5} startFrame={10} />
        <ZennDNATraitsScene />
      </Sequence>

      {/* BEAT 10: (1350 - 1500f) Lab wide: Two-choice olfactometer, airflow arrows, twin odor sleeves */}
      <Sequence from={9 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennTwinPaperScene />
      </Sequence>

      {/* BEAT 11: (1500 - 1650f) Identical twins: Same camera and apparatus; similar mosquito response */}
      <Sequence from={10 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennIdenticalTwinsScene />
      </Sequence>

      {/* BEAT 12: (1650 - 1800f) Graph insert: HERITABILITY ESTIMATE 0.62 with IN THIS STUDY */}
      <Sequence from={11 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />
        <ZennGeneticsPieChartScene />
      </Sequence>

      {/* BEAT 13: (1800 - 1950f) Wrong-reading gag: Pie chart labeled 62% OF EVERY BITE cracks */}
      <Sequence from={12 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennGeneticsPieChartScene />
      </Sequence>

      {/* BEAT 14: (1950 - 2100f) Definition card: Heritability describes group variation */}
      <Sequence from={13 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennMetaScriptPage5Scene />
      </Sequence>

      {/* BEAT 15: (2100 - 2250f) Destiny-meter gag: PERSONAL DESTINY METER appears, flashes ERROR */}
      <Sequence from={14 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennCitronellaWillpowerScene />
      </Sequence>

      {/* BEAT 16: (2250 - 2400f) Sample card: 37 TWIN PAIRS and SMALL STUDY - STRONG CLUE */}
      <Sequence from={15 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennFraternalTwinsScene />
      </Sequence>

      {/* BEAT 17: (2400 - 2550f) Final-boss gag: Giant FINAL ANSWER boss icon replaced by MORE RESEARCH */}
      <Sequence from={16 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennGeneLabBenchScene />
      </Sequence>

      {/* BEAT 18: (2550 - 2700f) Season montage: Host appears across two summers with recurring scent */}
      <Sequence from={17 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.4} startFrame={10} />
        <ZennPeaceFriendScene />
      </Sequence>

      {/* BEAT 19: (2700 - 2850f) Face-memory gag: Mosquito studies face lineup, looks confused, discards */}
      <Sequence from={18 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennNoRevengeListScene />
      </Sequence>

      {/* BEAT 20: (2850 - 3000f) No-revenge board: Detective corkboard REVENGE LIST receives red X */}
      <Sequence from={19 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />
        <ZennNoRevengeListScene />
      </Sequence>

      {/* BEAT 21: (3000 - 3150f) Courtroom gag: Judge stamps NOT A MORAL FAILURE */}
      <Sequence from={20 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennVolumeSliderMuteScene />
      </Sequence>

      {/* BEAT 22: (3150 - 3300f) Chef-to-map transition: Limited-edition cuisine card darkens into map */}
      <Sequence from={21 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.6} startFrame={10} />
        <ZennLimitedEditionCuisineScene />
      </Sequence>
    </div>
  );
};
