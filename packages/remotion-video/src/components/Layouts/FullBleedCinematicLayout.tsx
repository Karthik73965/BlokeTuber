import React from 'react';
import { interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineClip } from '../../types';
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
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isImage =
    clip.mediaType === 'image' ||
    (clip.clipPath && /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(clip.clipPath)) ||
    !clip.clipPath;

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;
  const scale = interpolate(progress, [0, 1], [1.0, 1.05]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* ── FULL BLEED MEDIA VIEWPORT ───────────────────────────────── */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `scale(${scale})`,
          position: 'relative',
        }}
      >
        {clip.clipPath ? (
          isImage ? (
            <img
              src={clip.clipPath}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.05) saturate(1.05)',
              }}
            />
          ) : (
            <OffthreadVideo
              src={clip.clipPath}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.05) saturate(1.05)',
              }}
            />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#111115' }} />
        )}
      </div>

      {/* ── 2.35:1 CINEMATIC LETTERBOX BARS ─────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 72,
          backgroundColor: '#000000',
          zIndex: 10,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: 72,
          backgroundColor: '#000000',
          zIndex: 10,
        }}
      />

      {/* ── OVERLAY CALLOUT LAYER ───────────────────────────────────── */}
      <CalloutDispatcher
        callout={clip.callout}
        numberOverlays={clip.numberOverlays}
        clipDurationInSeconds={durationInSeconds}
      />
    </div>
  );
};
