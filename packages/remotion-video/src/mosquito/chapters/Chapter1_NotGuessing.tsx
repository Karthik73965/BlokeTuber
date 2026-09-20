import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennNotRandomScene,
  ZennMosquitoSensorsScene,
  ZennOpenInvitationScene,
  ZennFemaleFeedingScene,
  ZennNightRadarScene,
  ZennFiftyMetersScene,
  ZennBreadcrumbsPlumeScene,
  ZennLargerExhaleScene,
  ZennPregnantComparisonScene,
  ZennAirborneChemistScene,
} from '../shared/ZennChapter1Components';
import {
  ZennFlowerBarScene,
  ZennWifiHotelSearchScene,
  ZennJoggerPushNotificationScene,
  ZennMetaScriptPage3Scene,
  ZennThreeThousandMenuScene,
} from '../shared/ZennCh1NewScenes';

/**
 * 🎬 Chapter 1: She Is Not Flying Randomly
 * Strict Editor Revision: 19 beats × exactly 5.00s = 95.0s (2,850 frames @ 30fps)
 * Audio: `1_not_guessing_5s.mp3` (time-aligned)
 */
export const Chapter1_NotGuessing: React.FC = () => {
  const BEAT = 150; // Exactly 5.00s per beat

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#0B132B' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/1_not_guessing_5s.mp3')} volume={1.0} />

      {/* BEAT 01: (0000 - 0150f) Clean split diagram: Male feeds on nectar, female egg development */}
      <Sequence from={0 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <ZennFemaleFeedingScene />
      </Sequence>

      {/* BEAT 02: (0150 - 0300f) Flower-bar gag: Male receives tiny nectar cocktail */}
      <Sequence from={1 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennFlowerBarScene />
      </Sequence>

      {/* BEAT 03: (0300 - 0450f) Biology insert: Female nutrients moving toward egg icons */}
      <Sequence from={2 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennFemaleFeedingScene />
      </Sequence>

      {/* BEAT 04: (0450 - 0600f) Bedroom medium: Clock reads 3:00 a.m., mosquito passes ear */}
      <Sequence from={3 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennNightRadarScene />
      </Sequence>

      {/* BEAT 05: (0600 - 0750f) Outdoor profile: Host exhales, translucent CO2 plume drifts */}
      <Sequence from={4 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.5} startFrame={5} />
        <ZennBreadcrumbsPlumeScene />
      </Sequence>

      {/* BEAT 06: (0750 - 0900f) Top-down yard: Plume widens and breaks into uneven pockets */}
      <Sequence from={5 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennFiftyMetersScene />
      </Sequence>

      {/* BEAT 07: (0900 - 1050f) Flight close-up: Mosquito crosses plume edge, antennae pulse */}
      <Sequence from={6 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennMosquitoSensorsScene />
      </Sequence>

      {/* BEAT 08: (1050 - 1200f) Tracking flight: Turns, loses plume, corrects, resumes zigzag */}
      <Sequence from={7 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennNotRandomScene />
      </Sequence>

      {/* BEAT 09: (1200 - 1350f) Split-screen gag: Mosquito zigzag vs hotel Wi-Fi search */}
      <Sequence from={8 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.6} startFrame={10} />
        <ZennWifiHotelSearchScene />
      </Sequence>

      {/* BEAT 10: (1350 - 1500f) Phone insert: Wi-Fi bars rise, match-cut into CO2 gauge */}
      <Sequence from={9 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennWifiHotelSearchScene />
      </Sequence>

      {/* BEAT 11: (1500 - 1650f) Controlled comparison: Two people at rest, different plumes */}
      <Sequence from={10 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_air" volume={0.5} startFrame={10} />
        <ZennLargerExhaleScene />
      </Sequence>

      {/* BEAT 12: (1650 - 1800f) Exercise continuation: Jogging, breath rate, warmth, moisture */}
      <Sequence from={11 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />
        <ZennJoggerPushNotificationScene />
      </Sequence>

      {/* BEAT 13: (1800 - 1950f) Notification gag: JOGGER NEARBY ping, banks toward trail */}
      <Sequence from={12 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennJoggerPushNotificationScene />
      </Sequence>

      {/* BEAT 14: (1950 - 2100f) Respectful medium: Pregnant person seated outdoors */}
      <Sequence from={13 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.4} startFrame={10} />
        <ZennPregnantComparisonScene />
      </Sequence>

      {/* BEAT 15: (2100 - 2250f) Research card: HEAT & BREATH OUTPUT, SOME SPECIES / STUDIES */}
      <Sequence from={14 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennPregnantComparisonScene />
      </Sequence>

      {/* BEAT 16: (2250 - 2400f) Chalkboard wide: Sir Curious crosses out ONE RULE FOR ALL */}
      <Sequence from={15 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={10} />
        <ZennMetaScriptPage3Scene />
      </Sequence>

      {/* BEAT 17: (2400 - 2550f) Menu gag: Different mosquito species argue over 3,000-item menu */}
      <Sequence from={16 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={10} />
        <ZennThreeThousandMenuScene />
      </Sequence>

      {/* BEAT 18: (2550 - 2700f) Neighborhood map: CO2 guides to yard, stops at patio boundary */}
      <Sequence from={17 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={10} />
        <ZennOpenInvitationScene />
      </Sequence>

      {/* BEAT 19: (2700 - 2850f) Macro transition: Switch to skin-odor view, push into forearm */}
      <Sequence from={18 * BEAT} durationInFrames={BEAT}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.6} startFrame={10} />
        <ZennAirborneChemistScene />
      </Sequence>
    </div>
  );
};
