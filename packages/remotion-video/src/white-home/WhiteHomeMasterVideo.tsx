import React from 'react';
import { Sequence } from 'remotion';
import { Chapter0_Hook } from './chapters/Chapter0_Hook';
import { Chapter1_Physics } from './chapters/Chapter1_Physics';
import { Chapter2_PeoplePain } from './chapters/Chapter2_PeoplePain';
import { Chapter3_Health } from './chapters/Chapter3_Health';
import { Chapter4_Ritual } from './chapters/Chapter4_Ritual';
import { Chapter5_Closing } from './chapters/Chapter5_Closing';

export const CH0_FRAMES = 2420; // 80.67s
export const CH1_FRAMES = 4775; // 159.16s
export const CH2_FRAMES = 2257; // 75.23s
export const CH3_FRAMES = 5114; // 170.45s
export const CH4_FRAMES = 1607; // 53.55s
export const CH5_FRAMES = 5051; // 168.36s
export const TOTAL_WHITE_HOME_FRAMES =
  CH0_FRAMES + CH1_FRAMES + CH2_FRAMES + CH3_FRAMES + CH4_FRAMES + CH5_FRAMES; // 21,224 frames (~11m 47.5s)

export const WhiteHomeMasterVideo: React.FC = () => {
  const ch1Start = CH0_FRAMES;
  const ch2Start = ch1Start + CH1_FRAMES;
  const ch3Start = ch2Start + CH2_FRAMES;
  const ch4Start = ch3Start + CH3_FRAMES;
  const ch5Start = ch4Start + CH4_FRAMES;

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#38BDF8' }}>
      {/* Chapter 0: Hook */}
      <Sequence from={0} durationInFrames={CH0_FRAMES}>
        <Chapter0_Hook />
      </Sequence>

      {/* Chapter 1: The Physics */}
      <Sequence from={ch1Start} durationInFrames={CH1_FRAMES}>
        <Chapter1_Physics />
      </Sequence>

      {/* Chapter 2: The People's Paint */}
      <Sequence from={ch2Start} durationInFrames={CH2_FRAMES}>
        <Chapter2_PeoplePain />
      </Sequence>

      {/* Chapter 3: The Hidden Health Reason */}
      <Sequence from={ch3Start} durationInFrames={CH3_FRAMES}>
        <Chapter3_Health />
      </Sequence>

      {/* Chapter 4: The Ritual */}
      <Sequence from={ch4Start} durationInFrames={CH4_FRAMES}>
        <Chapter4_Ritual />
      </Sequence>

      {/* Chapter 5: Closing */}
      <Sequence from={ch5Start} durationInFrames={CH5_FRAMES}>
        <Chapter5_Closing />
      </Sequence>
    </div>
  );
};
