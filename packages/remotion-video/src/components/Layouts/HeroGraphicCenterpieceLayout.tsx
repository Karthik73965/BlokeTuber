import React from 'react';
import { Img, interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineClip } from '../../types';
import { CalloutDispatcher } from '../Callouts/CalloutDispatcher';

export interface LayoutProps {
  clip: TimelineClip;
  clipIndex: number;
  durationInFrames: number;
  durationInSeconds: number;
}

export const HeroGraphicCenterpieceLayout: React.FC<LayoutProps> = ({
  clip,
  clipIndex,
  durationInFrames,
  durationInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isImage =
    clip.mediaType === 'image' ||
    (clip.clipPath && /\.(jpg|jpeg|png|webp|avif)$/i.test(clip.clipPath)) ||
    !clip.clipPath;

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // Background subtle cinematic drift
  const bgScale = interpolate(progress, [0, 1], [1.15, 1.22]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#09090B',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. ATMOSPHERIC HEAVILY DIMMED BACKGROUND FOOTAGE ───────── */}
      {clip.clipPath ? (
        <div
          style={{
            position: 'absolute',
            inset: -40,
            filter: 'blur(30px) brightness(0.22) contrast(1.1)',
            transform: `scale(${bgScale})`,
            overflow: 'hidden',
          }}
        >
          {isImage ? (
            <Img
              src={clip.clipPath}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <OffthreadVideo
              src={clip.clipPath}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )}
        </div>
      ) : (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0C0A09',
          }}
        />
      )}

      {/* Heavy Cinematic Vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.95) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* 35mm Procedural Film Grain */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.09,
          mixBlendMode: 'overlay',
        }}
      >
        <filter id="hero_grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero_grain)" />
      </svg>

      {/* ── 2. HERO MOTION GRAPHIC COMPONENT TAKES CENTER STAGE ─────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10,
        }}
      >
        <CalloutDispatcher
          callout={clip.callout}
          numberOverlays={clip.numberOverlays}
          clipDurationInSeconds={durationInSeconds}
        />
      </div>
    </div>
  );
};
