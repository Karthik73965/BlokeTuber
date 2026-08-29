import React from 'react';
import { Img, interpolate, OffthreadVideo, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineClip } from '../../types';
import { CalloutDispatcher } from '../Callouts/CalloutDispatcher';

export interface LayoutProps {
  clip: TimelineClip;
  clipIndex: number;
  durationInFrames: number;
  durationInSeconds: number;
}

export const SplitDualScreenLayout: React.FC<LayoutProps> = ({
  clip,
  clipIndex,
  durationInFrames,
  durationInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isPrimaryImage =
    clip.mediaType === 'image' ||
    (clip.clipPath && /\.(jpg|jpeg|png|webp|avif)$/i.test(clip.clipPath)) ||
    !clip.clipPath;

  const isSecondaryImage =
    clip.secondaryMediaType === 'image' ||
    (clip.secondaryClipPath && /\.(jpg|jpeg|png|webp|avif)$/i.test(clip.secondaryClipPath)) ||
    !clip.secondaryClipPath;

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // Split entrance spring
  const splitSpring = spring({
    frame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
  });

  const leftTranslateX = interpolate(splitSpring, [0, 1], [-80, 0]);
  const rightTranslateX = interpolate(splitSpring, [0, 1], [80, 0]);

  // Independent Ken Burns on each half
  const leftScale = interpolate(progress, [0, 1], [1.0, 1.08]);
  const rightScale = interpolate(progress, [0, 1], [1.08, 1.0]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#09090B',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* ── LEFT PANEL (50%) ────────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transform: `translateX(${leftTranslateX}px)`,
          borderRight: '2px solid #27272A',
        }}
      >
        {clip.clipPath ? (
          isPrimaryImage ? (
            <Img
              src={clip.clipPath}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${leftScale})`,
                filter: 'contrast(1.06) saturate(1.06)',
              }}
            />
          ) : (
            <OffthreadVideo
              src={clip.clipPath}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${leftScale})`,
                filter: 'contrast(1.06) saturate(1.06)',
              }}
            />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#141418' }} />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* ── CENTER VERTICAL ACCENT DIVIDER ──────────────────────────── */}
      <div
        style={{
          width: 4,
          height: '100%',
          backgroundColor: '#D97706',
          zIndex: 10,
          boxShadow: '0 0 12px rgba(0,0,0,0.8)',
        }}
      />

      {/* ── RIGHT PANEL (50%) ───────────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          transform: `translateX(${rightTranslateX}px)`,
        }}
      >
        {clip.secondaryClipPath || clip.clipPath ? (
          isSecondaryImage ? (
            <Img
              src={clip.secondaryClipPath || clip.clipPath!}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${rightScale})`,
                filter: 'contrast(1.06) saturate(1.06)',
              }}
            />
          ) : (
            <OffthreadVideo
              src={clip.secondaryClipPath || clip.clipPath!}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transform: `scale(${rightScale})`,
                filter: 'contrast(1.06) saturate(1.06)',
              }}
            />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#18181F' }} />
        )}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Letterbox matte bars */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 48,
          backgroundColor: '#000000',
          zIndex: 20,
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
          zIndex: 20,
          pointerEvents: 'none',
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
