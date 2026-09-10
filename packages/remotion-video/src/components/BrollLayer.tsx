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
      // 1. Smooth Continuous Push-In (gentle 4% drift)
      scale = interpolate(progress, [0, 1], [1.0, 1.04]);
    } else if (motionMode === 1) {
      // 2. Smooth Reveal Pull-Out (gentle 4% drift)
      scale = interpolate(progress, [0, 1], [1.04, 1.0]);
    } else if (motionMode === 2) {
      // 3. Smooth Fluid Arc (Subtle 3% pulse)
      scale = 1.0 + 0.03 * Math.sin(Math.PI * progress);
    } else {
      // 4. Parallax Vertical Drift (gentle 15px drift)
      scale = interpolate(progress, [0, 1], [1.02, 1.04]);
      translateY = interpolate(progress, [0, 1], [0, -15]);
    }
  }

  // ── 2. DYNAMIC TRANSITIONS (Smooth broadcast fade-in without harsh strobing) ──
  const transMode = clipIndex % 3;
  let flashOpacity = 0;
  let flashColor = '#000000';

  const tSeconds = frame / fps;

  if (transMode === 1 && tSeconds < 0.25) {
    // Gentle soft film fade-up (0.25s)
    flashOpacity = interpolate(tSeconds, [0, 0.25], [0.25, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    flashColor = '#000000';
  } else if (transMode === 2 && tSeconds < 0.20) {
    // Subtle cinematic shadow dip (0.20s)
    flashOpacity = interpolate(tSeconds, [0, 0.20], [0.18, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    flashColor = '#050508';
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
