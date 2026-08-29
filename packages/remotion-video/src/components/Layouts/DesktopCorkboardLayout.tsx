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

export const DesktopCorkboardLayout: React.FC<LayoutProps> = ({
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

  // 3D Camera travel across investigative desk
  const camScale = interpolate(progress, [0, 1], [1.0, 1.06]);
  const camRotateX = interpolate(progress, [0, 1], [8, 4]);
  const camRotateY = interpolate(progress, [0, 1], [-6, -2]);
  const camTranslateY = interpolate(progress, [0, 1], [20, -15]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#171412', // Rich dark mahogany detective desk tone
        backgroundImage:
          'radial-gradient(#2A241F 15%, transparent 16%), radial-gradient(#2A241F 15%, transparent 16%)',
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 8px 8px',
        overflow: 'hidden',
      }}
    >
      {/* Blueprint Grid Lines Overlay */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.12,
          pointerEvents: 'none',
        }}
      >
        <defs>
          <pattern id="desk_grid" width="60" height="60" patternUnits="userSpaceOnUse">
            <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#FFFFFF" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#desk_grid)" />
      </svg>

      {/* Dark Vignette over desk */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 3D CAMERA ENVIRONMENT ────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1200,
          padding: '40px 80px 100px',
        }}
      >
        {/* Pinned Physical Photo / Printout Card */}
        <div
          style={{
            transform: `translateY(${camTranslateY}px) scale(${camScale}) rotateX(${camRotateX}deg) rotateY(${camRotateY}deg) rotate(-1.5deg)`,
            backgroundColor: '#FAF7F2',
            padding: '14px 14px 18px',
            boxShadow:
              '0 30px 70px rgba(0,0,0,0.85), 0 6px 16px rgba(0,0,0,0.4)',
            borderRadius: 2,
            border: '1px solid #E5DFD3',
            maxWidth: 1100,
            width: '80%',
            height: '68%',
            position: 'relative',
          }}
        >
          {/* Translucent Scotch Tape Top Center */}
          <div
            style={{
              position: 'absolute',
              top: -16,
              left: '50%',
              transform: 'translateX(-50%) rotate(0.8deg)',
              width: 120,
              height: 32,
              backgroundColor: 'rgba(255, 255, 255, 0.65)',
              boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              borderLeft: '1px dashed rgba(200, 190, 170, 0.4)',
              borderRight: '1px dashed rgba(200, 190, 170, 0.4)',
              zIndex: 10,
            }}
          />

          {/* Photo Media Inside Frame */}
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#1E1E24',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {clip.clipPath ? (
              isImage ? (
                <Img
                  src={clip.clipPath}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.06) saturate(1.05)',
                  }}
                />
              ) : (
                <OffthreadVideo
                  src={clip.clipPath}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.06) saturate(1.05)',
                  }}
                />
              )
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#18181B' }} />
            )}
          </div>
        </div>
      </div>

      {/* ── OVERLAY CALLOUT LAYER ───────────────────────────────────── */}
      <CalloutDispatcher
        callout={clip.callout}
        numberOverlays={clip.numberOverlays}
        clipDurationInSeconds={durationInSeconds}
      />
    </div>
  );
};
