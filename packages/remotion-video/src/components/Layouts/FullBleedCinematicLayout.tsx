import React from 'react';
import { TimelineClip } from '../../types';
import { BrollLayer } from '../BrollLayer';
import { CalloutDispatcher } from '../Callouts/CalloutDispatcher';

export interface LayoutProps {
  clip: TimelineClip;
  clipIndex: number;
  durationInFrames: number;
  durationInSeconds: number;
}

export const FullBleedCinematicLayout: React.FC<LayoutProps> = ({
  clip,
  clipIndex,
  durationInFrames,
  durationInSeconds,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. FULL-BLEED B-ROLL FOOTAGE ─────────────────────────────── */}
      <BrollLayer
        clip={clip}
        clipIndex={clipIndex}
        durationInFrames={durationInFrames}
      />

      {/* ── 2. CINEMATIC 2.35:1 LETTERBOX MATTE BARS ─────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          backgroundColor: '#000000',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 48,
          backgroundColor: '#000000',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />

      {/* ── 3. OVERLAY CALLOUT LAYER ─────────────────────────────────── */}
      <CalloutDispatcher
        callout={clip.callout}
        numberOverlays={clip.numberOverlays}
        clipDurationInSeconds={durationInSeconds}
      />
    </div>
  );
};
