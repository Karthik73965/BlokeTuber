import React from 'react';
import { Audio, Loop, Sequence, staticFile } from 'remotion';
import { Chapter1_Hook } from './chapters/Chapter1_Hook';
import { Chapter2_Access } from './chapters/Chapter2_Access';
import { Chapter3_Quantity } from './chapters/Chapter3_Quantity';
import { Chapter4_CowsWon } from './chapters/Chapter4_CowsWon';
import { Chapter5_Processing } from './chapters/Chapter5_Processing';
import { Chapter6_Domestication } from './chapters/Chapter6_Domestication';
import { Chapter7_Close } from './chapters/Chapter7_Close';

export const CH1_FRAMES = 1350; // 45.01s
export const CH2_FRAMES = 2363; // 78.76s
export const CH3_FRAMES = 1211; // 40.36s
export const CH4_FRAMES = 2012; // 67.08s
export const CH5_FRAMES = 2456; // 81.87s
export const CH6_FRAMES = 2842; // 94.75s
export const CH7_FRAMES = 2735; // 91.17s

export const TOTAL_PIG_MILK_FRAMES =
  CH1_FRAMES + CH2_FRAMES + CH3_FRAMES + CH4_FRAMES + CH5_FRAMES + CH6_FRAMES + CH7_FRAMES; // 14,969 frames (~8m 19s)

export const PigMilkMasterVideo: React.FC = () => {
  const ch2Start = CH1_FRAMES;
  const ch3Start = ch2Start + CH2_FRAMES;
  const ch4Start = ch3Start + CH3_FRAMES;
  const ch5Start = ch4Start + CH4_FRAMES;
  const ch6Start = ch5Start + CH5_FRAMES;
  const ch7Start = ch6Start + CH6_FRAMES;

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#7DD3FC' }}>
      {/* 🎵 Non-Copyright YouTube Audio Library BGM bed (low volume so voiceover is crisp & loud) */}
      <Loop durationInFrames={6634}>
        <Audio
          src={staticFile('audio/Way Back Home - Simon Herody.mp3')}
          volume={0.08}
        />
      </Loop>

      {/* Chapter 1: Hook */}
      <Sequence from={0} durationInFrames={CH1_FRAMES}>
        <Chapter1_Hook />
      </Sequence>

      {/* Chapter 2: The Access Problem */}
      <Sequence from={ch2Start} durationInFrames={CH2_FRAMES}>
        <Chapter2_Access />
      </Sequence>

      {/* Chapter 3: The Quantity Problem */}
      <Sequence from={ch3Start} durationInFrames={CH3_FRAMES}>
        <Chapter3_Quantity />
      </Sequence>

      {/* Chapter 4: Why Cows Won The Job */}
      <Sequence from={ch4Start} durationInFrames={CH4_FRAMES}>
        <Chapter4_CowsWon />
      </Sequence>

      {/* Chapter 5: The Processing Problem */}
      <Sequence from={ch5Start} durationInFrames={CH5_FRAMES}>
        <Chapter5_Processing />
      </Sequence>

      {/* Chapter 6: Why Domestication Isn't Random */}
      <Sequence from={ch6Start} durationInFrames={CH6_FRAMES}>
        <Chapter6_Domestication />
      </Sequence>

      {/* Chapter 7: Close & Finale */}
      <Sequence from={ch7Start} durationInFrames={CH7_FRAMES}>
        <Chapter7_Close />
      </Sequence>
    </div>
  );
};
