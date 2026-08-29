import React, { useMemo } from 'react';
import {
  Img,
  interpolate,
  OffthreadVideo,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { TimelineClip } from '../types';

export interface BrollLayerProps {
  clip: TimelineClip;
  clipIndex: number;
  durationInFrames: number;
}

export const BrollLayer: React.FC<BrollLayerProps> = ({
  clip,
  clipIndex,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isImage = useMemo(() => {
    if (clip.mediaType === 'image') return true;
    if (clip.clipPath && /\.(jpg|jpeg|png|webp|avif)$/i.test(clip.clipPath)) return true;
    return !clip.clipPath;
  }, [clip.mediaType, clip.clipPath]);

  // ── 1. KEN BURNS CAMERA MOTION (4 Dynamic Modes for Photos) ───────────────
  const motionMode = clipIndex % 4;
  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  let scale = 1.0;
  let translateX = 0;
  let translateY = 0;

  if (isImage) {
    if (motionMode === 0) {
      // 1. Smooth Continuous Push-In
      scale = interpolate(progress, [0, 1], [1.0, 1.12]);
    } else if (motionMode === 1) {
      // 2. Smooth Reveal Pull-Out
      scale = interpolate(progress, [0, 1], [1.12, 1.0]);
    } else if (motionMode === 2) {
      // 3. Smooth Fluid Arc (Zoom-In then Zoom-Out)
      scale = 1.0 + 0.08 * Math.sin(Math.PI * progress);
    } else {
      // 4. Parallax Vertical Drift
      scale = interpolate(progress, [0, 1], [1.05, 1.12]);
      translateY = interpolate(progress, [0, 1], [0, -30]);
    }
  }

  // ── 2. DYNAMIC TRANSITIONS (3 Rotating Minimal Broadcast Modes) ───────────
  const transMode = clipIndex % 3;
  let flashOpacity = 0;
  let flashColor = '#FFFFFF';

  const tSeconds = frame / fps;

  if (transMode === 0) {
    // Shutter Click: 0.06s camera shutter blink
    if (tSeconds < 0.06) {
      flashOpacity = interpolate(tSeconds, [0, 0.06], [0.35, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      flashColor = '#FFFFFF';
    }
  } else if (transMode === 1) {
    // Soft Film Fade: 0.12s micro-fade from soft dark
    if (tSeconds < 0.12) {
      flashOpacity = interpolate(tSeconds, [0, 0.12], [0.45, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      flashColor = '#000000';
    }
  } else {
    // Subtle Film Dip: 0.08s micro dip
    if (tSeconds < 0.08) {
      flashOpacity = interpolate(tSeconds, [0, 0.08], [0.3, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      flashColor = '#050508';
    }
  }

  // Grain seed shifting per frame
  const grainSeed = Math.floor(frame % 10);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#09090B',
        overflow: 'hidden',
      }}
    >
      {/* ── B-ROLL MEDIA ELEMENT ────────────────────────────────────────── */}
      {clip.clipPath ? (
        isImage ? (
          <Img
            src={clip.clipPath}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
              filter: 'contrast(1.06) saturate(1.08) brightness(0.98)',
              transformOrigin: 'center center',
            }}
          />
        ) : (
          <OffthreadVideo
            src={clip.clipPath}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.06) saturate(1.08) brightness(0.98)',
            }}
          />
        )
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#121216',
          }}
        />
      )}

      {/* ── 35MM PROCEDURAL FILM GRAIN OVERLAY ──────────────────────────── */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          opacity: 0.07,
          mixBlendMode: 'overlay',
        }}
      >
        <filter id={`grain_${grainSeed}`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="3"
            seed={grainSeed * 17}
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter={`url(#grain_${grainSeed})`} />
      </svg>

      {/* ── VIGNETTE / DEPTH SHADOW ─────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── MICRO TRANSITION FLASH / DIP ───────────────────────────────── */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: flashColor,
            opacity: flashOpacity,
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  );
};
