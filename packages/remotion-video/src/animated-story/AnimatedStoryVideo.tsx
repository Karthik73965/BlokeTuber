import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { Scene01_Explorer } from './scenes/Scene01_Explorer';
import { Scene02_MapJourney } from './scenes/Scene02_MapJourney';
import { Scene03_WhiteVillage } from './scenes/Scene03_WhiteVillage';
import { Scene04_TouristAdmiration } from './scenes/Scene04_TouristAdmiration';
import { Scene05_TheParadox } from './scenes/Scene05_TheParadox';
import { Scene06_TheShield } from './scenes/Scene06_TheShield';
import { Scene07_DarkAbsorption } from './scenes/Scene07_DarkAbsorption';
import { Scene08_WhiteReflection } from './scenes/Scene08_WhiteReflection';
import { Scene09_DualComparison } from './scenes/Scene09_DualComparison';
import { Scene10_ArchitectureBlueprint } from './scenes/Scene10_ArchitectureBlueprint';
import { Scene11_AncientAC } from './scenes/Scene11_AncientAC';
import { Scene12_CuriosityOutro } from './scenes/Scene12_CuriosityOutro';

export interface AnimatedStoryVideoProps {
  enableVoiceover?: boolean;
  enableBgm?: boolean;
  enableSfx?: boolean;
  bgmTrack?: string;
}

export const AnimatedStoryVideo: React.FC<AnimatedStoryVideoProps> = ({
  enableVoiceover = true,
  enableBgm = true,
  enableSfx = true,
  bgmTrack = 'audio/bgm/From Here on In - Everet Almond.mp3',
}) => {
  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#FAF8F5' }}>
      {/* 1. Master Voiceover Audio */}
      {enableVoiceover && (
        <Audio
          src={staticFile('audio/white_villages.mp3')}
          volume={1.0}
        />
      )}

      {/* 2. YouTube Audio Library Curated Background Music */}
      {enableBgm && (
        <Audio
          src={staticFile(bgmTrack)}
          volume={0.08}
          loop
        />
      )}

      {/* 3. Clean Foley & Explainer Sound Effects */}
      {enableSfx && (
        <>
          <Sequence from={0} durationInFrames={30}>
            <Audio src={staticFile('sfx/pop.mp3')} volume={0.35} />
          </Sequence>
          <Sequence from={120} durationInFrames={30}>
            <Audio src={staticFile('sfx/whoosh_air.mp3')} volume={0.35} />
          </Sequence>
          <Sequence from={264} durationInFrames={40}>
            <Audio src={staticFile('sfx/chime.mp3')} volume={0.3} />
          </Sequence>
          {/* Tourist taking photos with camera snap */}
          <Sequence from={366} durationInFrames={30}>
            <Audio src={staticFile('sfx/camera_shutter.mp3')} volume={0.4} />
          </Sequence>
          {/* Paradigm shift hit */}
          <Sequence from={539} durationInFrames={45}>
            <Audio src={staticFile('sfx/subtle_hit.mp3')} volume={0.45} />
          </Sequence>
          <Sequence from={645} durationInFrames={30}>
            <Audio src={staticFile('sfx/pop.mp3')} volume={0.3} />
          </Sequence>
          {/* Heat absorption hit */}
          <Sequence from={765} durationInFrames={50}>
            <Audio src={staticFile('sfx/subtle_hit.mp3')} volume={0.4} />
          </Sequence>
          <Sequence from={960} durationInFrames={40}>
            <Audio src={staticFile('sfx/chime.mp3')} volume={0.3} />
          </Sequence>
          <Sequence from={1134} durationInFrames={30}>
            <Audio src={staticFile('sfx/whoosh_air.mp3')} volume={0.35} />
          </Sequence>
          {/* Stats comparison clicks */}
          <Sequence from={1200} durationInFrames={20}>
            <Audio src={staticFile('sfx/stat_click.mp3')} volume={0.35} />
          </Sequence>
          {/* Blueprint blueprint paper slide */}
          <Sequence from={1395} durationInFrames={30}>
            <Audio src={staticFile('sfx/paper_slide.mp3')} volume={0.4} />
          </Sequence>
          <Sequence from={1815} durationInFrames={50}>
            <Audio src={staticFile('sfx/subtle_hit.mp3')} volume={0.45} />
          </Sequence>
        </>
      )}

      {/* 4. The 12 Animated Story Scenes */}
      <Sequence from={0} durationInFrames={120}>
        <Scene01_Explorer />
      </Sequence>

      <Sequence from={120} durationInFrames={144}>
        <Scene02_MapJourney />
      </Sequence>

      <Sequence from={264} durationInFrames={102}>
        <Scene03_WhiteVillage />
      </Sequence>

      <Sequence from={366} durationInFrames={138}>
        <Scene04_TouristAdmiration />
      </Sequence>

      <Sequence from={504} durationInFrames={141}>
        <Scene05_TheParadox />
      </Sequence>

      <Sequence from={645} durationInFrames={120}>
        <Scene06_TheShield />
      </Sequence>

      <Sequence from={765} durationInFrames={195}>
        <Scene07_DarkAbsorption />
      </Sequence>

      <Sequence from={960} durationInFrames={174}>
        <Scene08_WhiteReflection />
      </Sequence>

      <Sequence from={1134} durationInFrames={261}>
        <Scene09_DualComparison />
      </Sequence>

      <Sequence from={1395} durationInFrames={150}>
        <Scene10_ArchitectureBlueprint />
      </Sequence>

      <Sequence from={1545} durationInFrames={270}>
        <Scene11_AncientAC />
      </Sequence>

      <Sequence from={1815} durationInFrames={185}>
        <Scene12_CuriosityOutro />
      </Sequence>
    </div>
  );
};
