import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import { SfxTrigger } from '../shared/MosquitoElements';
import {
  ZennClosingBeat1_Callback,
  ZennClosingBeat2_MythSweep,
  ZennClosingBeat3_ThreeLayers,
  ZennClosingBeat4_BroadcastBeacon,
  ZennClosingBeat5_SplitPerception,
  ZennClosingBeat6_SuburbanWalk,
  ZennClosingBeat7_InvisibleWorld,
  ZennClosingBeat8_CuriousHost,
  ZennClosingBeat9_SirCuriousLogo,
  ZennClosingBeat10_YouTubeOutro,
} from '../shared/ZennClosingComponents';

/**
 * 🎬 Chapter 5: Closing — Callback + CTA (56.61s / 1,698 frames @ 30fps)
 * Visual Direction:
 * - 1:1 Authentic Match with YouTube Reference (U-QW-HkDOmA) & Chapter 0 Zenn Style
 * - Complete Hand-Drawn Environment Staging (Zero Plain White Voids)
 * - Expressive Character Poses, Acting & Comic Humor Gags
 * - ZERO text badges, ZERO StoryBadge, ZERO corporate cards — 100% Visual Comic Storytelling
 */
export const Chapter5_Closing: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#18181B' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/mosquito/5_closing.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 175f / 0.0s - 5.82s) "So back to that barbecue..." */}
      {/* Visual: Exact callback to Chapter 0: warm ochre room, teal couch, host scratching welts, calm newspaper friend */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={175}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={45} />
        <ZennClosingBeat1_Callback progress={Math.min(Math.max(frame / 140, 0), 1)} />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (175 - 304f / 5.82s - 10.14s) "It was never bad luck, never what you ate..." */}
      {/* Visual: Four-leaf clover ("LUCK") and meal ("DIET") floating; wind whooshes them away with big red X marks */}
      {/* ================================================================ */}
      <Sequence from={175} durationInFrames={129}>
        <SfxTrigger sound="pop" volume={0.5} startFrame={35} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={55} />
        <SfxTrigger sound="whoosh" volume={0.6} startFrame={75} />
        <ZennClosingBeat2_MythSweep />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (304 - 482f / 10.14s - 16.06s) "Decided before your first breath — genes, skin, blood" */}
      {/* Visual: Host illuminated with 3 glowing biological layers: DNA core, skin microbes, blood type icon */}
      {/* ================================================================ */}
      <Sequence from={304} durationInFrames={178}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={20} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={65} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={110} />
        <ZennClosingBeat3_ThreeLayers />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (482 - 655f / 16.06s - 21.82s) "Reading a signal you've been sending your entire life..." */}
      {/* Visual: Scent waves radiating from host: CO2, heat, skin odor forming lighthouse broadcast beacon into night sky */}
      {/* ================================================================ */}
      <Sequence from={482} durationInFrames={173}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.5} startFrame={5} />
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={60} />
        <ZennClosingBeat4_BroadcastBeacon />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (655 - 827f / 21.82s - 27.58s) "The strange part about being human..." */}
      {/* Visual: Split perception: human view under porch lamp vs mosquito thermal/chemical HUD view */}
      {/* ================================================================ */}
      <Sequence from={655} durationInFrames={172}>
        <SfxTrigger sound="whoosh" volume={0.6} startFrame={0} />
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={25} />
        <ZennClosingBeat5_SplitPerception />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (827 - 1015f / 27.58s - 33.84s) "We walk around assuming we're invisible..." */}
      {/* Visual: Host walking along quiet suburban sidewalk under streetlamp leaving heat footprints & scent trail */}
      {/* ================================================================ */}
      <Sequence from={827} durationInFrames={188}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <SfxTrigger sound="subtle_hit" volume={0.4} startFrame={30} />
        <ZennClosingBeat6_SuburbanWalk />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (1015 - 1181f / 33.84s - 39.38s) "...to everything from mosquitoes to microbes" */}
      {/* Visual: Wide shot of host surrounded by the invisible living world: friendly microbes & mosquito waving hello */}
      {/* ================================================================ */}
      <Sequence from={1015} durationInFrames={166}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={20} />
        <ZennClosingBeat7_InvisibleWorld />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (1181 - 1346f / 39.38s - 44.86s) "Questions hiding in plain sight under your skin..." */}
      {/* Visual: Host raises magnifying glass, looking through it with curious 2.5x eye & bright smile */}
      {/* ================================================================ */}
      <Sequence from={1181} durationInFrames={165}>
        <SfxTrigger sound="whoosh" volume={0.5} startFrame={5} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={30} />
        <ZennClosingBeat8_CuriousHost />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (1346 - 1482f / 44.86s - 49.40s) "...that's exactly what this channel is for." */}
      {/* Visual: Hand-drawn "SIR CURIOUS" title in bold ink with underline swoop & tiny doodle icons */}
      {/* ================================================================ */}
      <Sequence from={1346} durationInFrames={136}>
        <SfxTrigger sound="whoosh_cinematic" volume={0.6} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={35} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={65} />
        <ZennClosingBeat9_SirCuriousLogo />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10: (1482 - 1698f / 49.40s - 56.61s) "I'm Sir Curious. Subscribe..." */}
      {/* Visual: YouTube Outro End Screen: host waving, video cards, red SUBSCRIBE button + mosquito tap & confetti */}
      {/* ================================================================ */}
      <Sequence from={1482} durationInFrames={216}>
        <SfxTrigger sound="whoosh_air" volume={0.4} startFrame={0} />
        <SfxTrigger sound="pop" volume={0.5} startFrame={40} />
        <SfxTrigger sound="pop" volume={0.6} startFrame={85} />
        <SfxTrigger sound="subtle_hit" volume={0.5} startFrame={90} />
        <ZennClosingBeat10_YouTubeOutro />
      </Sequence>
    </div>
  );
};
