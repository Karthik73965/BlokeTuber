import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennTwinPaperScene,
  ZennYTubeApparatusScene,
  ZennIdenticalTwinsScene,
  ZennFraternalTwinsScene,
  ZennGeneticsPieChartScene,
  ZennDNATraitsScene,
  ZennCitronellaWillpowerScene,
  ZennGeneLabBenchScene,
  ZennVolumeSliderMuteScene,
} from '../shared/Chapter4MasterComponents';

/**
 * 🎬 Chapter 4: The Twin Study (64.63s / 1,939 frames @ 30fps)
 * Authentic Zenn Hand-Drawn Comic Stickman Edition (matching U-QW-HkDOmA & Chapter0_Hook)
 *
 * Visual Direction:
 * - Hand-Drawn Environment Staging (Zero Plain White Voids)
 * - Expressive Character Poses & Acting
 * - ZERO text badges, ZERO StoryBadge, ZERO corporate cards
 * - 100% Visual Comic Storytelling with hand-drawn labels
 */
export const Chapter4_TwinStudy: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#18181B' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/4_twin_study.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 126f / 0.0s - 4.20s) "The Landmark Paper Discovery"   */}
      {/* Visual: Scientist stickman with glasses pointing at open paper,    */}
      {/*         lightbulb pops over head on wooden lab bench.             */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={126}>
        <SfxTrigger sound="whoosh_air" volume={0.45} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.55} startFrame={30} />
        <ZennTwinPaperScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (126 - 386f / 4.20s - 12.88s) "The Y-Tube Apparatus"      */}
      {/* Visual: London School of Hygiene apparatus, fan blowing air across */}
      {/*         twin ports into mosquito chamber, mosquitoes curious.    */}
      {/* ================================================================ */}
      <Sequence from={126} durationInFrames={260}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={0} />
        <SfxTrigger sound="subtle_hit" volume={0.45} startFrame={30} />
        <ZennYTubeApparatusScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (386 - 588f / 12.88s - 19.60s) "Identical Twins: 50/50"   */}
      {/* Visual: Identical twins in matching shirts, identical scent density */}
      {/*         mosquitoes split exactly 50/50 between both arms!         */}
      {/* ================================================================ */}
      <Sequence from={386} durationInFrames={202}>
        <SfxTrigger sound="whoosh_air" volume={0.5} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.6} startFrame={35} />
        <ZennIdenticalTwinsScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (588 - 789f / 19.60s - 26.30s) "Fraternal Twins: 0 vs 10" */}
      {/* Visual: Fraternal twins (bald/glasses vs 3 hairs), scent diverges, */}
      {/*         all 10 mosquitoes ignore Twin 1 and swarm Twin 2!         */}
      {/* ================================================================ */}
      <Sequence from={588} durationInFrames={201}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.55} startFrame={30} />
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={90} />
        <ZennFraternalTwinsScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (789 - 1020f / 26.30s - 34.00s) "2/3 Genetics & Relief"   */}
      {/* Visual: Pie chart 2/3 GENETICS vs 1/3 ENVIRONMENT, host stickman   */}
      {/*         sighs in huge relief ("It wasn't my fault!").             */}
      {/* ================================================================ */}
      <Sequence from={789} durationInFrames={231}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.45} startFrame={0} />
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={40} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={80} />
        <ZennGeneticsPieChartScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (1020 - 1258f / 34.00s - 41.92s) "DNA Traits Pop-Ins"     */}
      {/* Visual: DNA double helix ladder with comical trait tags:           */}
      {/*         HEIGHT, BLOOD TYPE, TONGUE ROLL, MOSQUITO MAGNET.         */}
      {/* ================================================================ */}
      <Sequence from={1020} durationInFrames={238}>
        <SfxTrigger sound="whoosh_air" volume={0.45} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={15} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={60} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={110} />
        <SfxTrigger sound="subtle_hit" volume={0.55} startFrame={160} />
        <ZennDNATraitsScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (1258 - 1477f / 41.92s - 49.22s) "Citronella Willpower"   */}
      {/* Visual: Host meditating in front of citronella candle; mosquito    */}
      {/*         lands unbothered on forehead. Calendar flips seasons.     */}
      {/* ================================================================ */}
      <Sequence from={1258} durationInFrames={219}>
        <SfxTrigger sound="whoosh_air" volume={0.45} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.6} startFrame={40} />
        <SfxTrigger sound="whoosh" volume={0.4} startFrame={75} />
        <SfxTrigger sound="whoosh" volume={0.4} startFrame={145} />
        <ZennCitronellaWillpowerScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (1477 - 1732f / 49.22s - 57.72s) "Mapping Gene Clusters"   */}
      {/* Visual: High-tech lab bench with scientist looking through         */}
      {/*         microscope, mapping olfactory receptor gene clusters.     */}
      {/* ================================================================ */}
      <Sequence from={1477} durationInFrames={255}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.5} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={40} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={110} />
        <ZennGeneLabBenchScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (1732 - 1939f / 57.72s - 64.63s) "Turning Down Broadcast" */}
      {/* Visual: Volume slider labeled "SKIN BROADCAST" with hand sliding   */}
      {/*         down to 0% (MUTE). Host stands peacefully as mosquitoes    */}
      {/*         fly away confused!                                         */}
      {/* ================================================================ */}
      <Sequence from={1732} durationInFrames={207}>
        <SfxTrigger sound="whoosh_air" volume={0.5} startFrame={0} />
        <SfxTrigger sound="subtle_hit" volume={0.65} startFrame={80} />
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={120} />
        <ZennVolumeSliderMuteScene />
      </Sequence>
    </div>
  );
};
