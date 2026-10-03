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

  const secondaryPath = clip.secondaryClipPath || clip.additionalClipPaths?.[0] || clip.clipPath;

  const isPrimaryImage =
    clip.mediaType === 'image' ||
    (clip.clipPath && /\.(jpg|jpeg|png|webp|avif)$/i.test(clip.clipPath)) ||
    !clip.clipPath;

  const isSecondaryImage =
    clip.secondaryMediaType === 'image' ||
    (secondaryPath && /\.(jpg|jpeg|png|webp|avif)$/i.test(secondaryPath)) ||
    !secondaryPath;

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // Split entrance spring (smooth cinematic glide)
  const splitSpring = spring({
    frame,
    fps,
    config: { damping: 24, stiffness: 50, mass: 1.2 },
  });

  const leftTranslateX = interpolate(splitSpring, [0, 1], [-80, 0]);
  const rightTranslateX = interpolate(splitSpring, [0, 1], [80, 0]);

  // Independent subtle Ken Burns on each half
  const leftScale = interpolate(progress, [0, 1], [1.0, 1.04]);
  const rightScale = interpolate(progress, [0, 1], [1.04, 1.0]);

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
              volume={0}
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
        {secondaryPath ? (
          isSecondaryImage ? (
            <Img
              src={secondaryPath}
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
              src={secondaryPath}
              volume={0}
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
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#121216',
              backgroundImage:
                'radial-gradient(ellipse at 70% 30%, #1E1E28 0%, #0D0D11 100%)',
              padding: '60px 50px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            {/* Archival watermark grid */}
            <div
              style={{
                position: 'absolute',
                top: 30,
                right: 40,
                fontFamily: '"Courier New", monospace',
                fontSize: 11,
                fontWeight: 800,
                color: '#D97706',
                letterSpacing: '0.15em',
              }}
            >
              ARCHIVAL DOSSIER // COMP-B
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#F59E0B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>
              {clip.layoutData?.subtitle || 'DOCUMENTARY INVESTIGATION'}
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 32, fontWeight: 900, color: '#FAFAFA', lineHeight: 1.2, textTransform: 'uppercase', marginBottom: 20 }}>
              {clip.layoutData?.title || clip.callout?.line1 || 'PARALLEL PERSPECTIVE'}
            </div>
            <div style={{ width: 60, height: 3, backgroundColor: '#D97706', marginBottom: 24 }} />
            <div style={{ fontFamily: '"Courier New", monospace', fontSize: 12, color: '#A1A1AA', lineHeight: 1.8 }}>
              <div>LOCATION: {clip.layoutData?.coords || 'LOS ANGELES, CALIFORNIA'}</div>
              <div>CLASSIFICATION: {clip.layoutData?.tag || 'CIVIC ENFORCEMENT RECORD'}</div>
              <div>VERIFICATION: 100% FIELD-AUTHENTICATED</div>
            </div>
          </div>
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
