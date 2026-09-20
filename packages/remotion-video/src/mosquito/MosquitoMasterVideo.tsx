import { Sequence } from 'remotion';
import { Chapter0_Hook } from './chapters/Chapter0_Hook';
import { Chapter1_NotGuessing } from './chapters/Chapter1_NotGuessing';
import { Chapter2_Skin } from './chapters/Chapter2_Skin';
import { Chapter3_BloodAndGenes } from './chapters/Chapter3_BloodAndGenes';
import { Chapter4_WhyMatters } from './chapters/Chapter4_WhyMatters';
import { Chapter5_Defense } from './chapters/Chapter5_Defense';
import { Chapter6_Closing } from './chapters/Chapter6_Closing';

// Strict 5.0-Second Beats Structure (150 frames @ 30fps per beat)
// Total Film: 117 beats × 150f = 17,550 frames (585.0s / 9m 45s)
export const CH0_FRAMES = 18 * 150; // 2,700 frames (90.0s) - Cold Open
export const CH1_FRAMES = 19 * 150; // 2,850 frames (95.0s) - She's Not Flying Randomly
export const CH2_FRAMES = 22 * 150; // 3,300 frames (110.0s) - Skin Chemical Signature
export const CH3_FRAMES = 22 * 150; // 3,300 frames (110.0s) - Blood Type & Genes
export const CH4_FRAMES = 10 * 150; // 1,500 frames (50.0s) - Why This Is More Than An Itchy Joke
export const CH5_FRAMES = 16 * 150; // 2,400 frames (80.0s) - What Actually Helps
export const CH6_FRAMES = 10 * 150; // 1,500 frames (50.0s) - Closing & The Living Broadcast

export const TOTAL_MOSQUITO_FRAMES =
  CH0_FRAMES + CH1_FRAMES + CH2_FRAMES + CH3_FRAMES + CH4_FRAMES + CH5_FRAMES + CH6_FRAMES; // 17,550 frames

export const MosquitoMasterVideo: React.FC = () => {
  const ch1Start = CH0_FRAMES;
  const ch2Start = ch1Start + CH1_FRAMES;
  const ch3Start = ch2Start + CH2_FRAMES;
  const ch4Start = ch3Start + CH3_FRAMES;
  const ch5Start = ch4Start + CH4_FRAMES;
  const ch6Start = ch5Start + CH5_FRAMES;

  return (
    <div style={{ width: '100%', height: '100%', backgroundColor: '#0F172A' }}>
      {/* Background music removed per user instruction - pure voiceover & crisp SFX only */}

      {/* Chapter 0: Cold Open — The Human Buffet (18 beats × 5s = 90s) */}
      <Sequence from={0} durationInFrames={CH0_FRAMES}>
        <Chapter0_Hook />
      </Sequence>

      {/* Chapter 1: She's Not Flying Randomly (19 beats × 5s = 95s) */}
      <Sequence from={ch1Start} durationInFrames={CH1_FRAMES}>
        <Chapter1_NotGuessing />
      </Sequence>

      {/* Chapter 2: Your Skin Has A Chemical Signature (22 beats × 5s = 110s) */}
      <Sequence from={ch2Start} durationInFrames={CH2_FRAMES}>
        <Chapter2_Skin />
      </Sequence>

      {/* Chapter 3: Is It Your Blood Type Or Your Genes? (22 beats × 5s = 110s) */}
      <Sequence from={ch3Start} durationInFrames={CH3_FRAMES}>
        <Chapter3_BloodAndGenes />
      </Sequence>

      {/* Chapter 4: Why This Is More Than An Itchy Joke (10 beats × 5s = 50s) */}
      <Sequence from={ch4Start} durationInFrames={CH4_FRAMES}>
        <Chapter4_WhyMatters />
      </Sequence>

      {/* Chapter 5: What Actually Helps (16 beats × 5s = 80s) */}
      <Sequence from={ch5Start} durationInFrames={CH5_FRAMES}>
        <Chapter5_Defense />
      </Sequence>

      {/* Chapter 6: Closing — The Signal You Never Knew You Sent (10 beats × 5s = 50s) */}
      <Sequence from={ch6Start} durationInFrames={CH6_FRAMES}>
        <Chapter6_Closing />
      </Sequence>
    </div>
  );
};
