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

export const AmbientBlurFrameLayout: React.FC<LayoutProps> = ({
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

  // Gentle 3D floating animation
  const rotateX = interpolate(progress, [0, 1], [-2, 2]);
  const rotateY = interpolate(progress, [0, 1], [3, -3]);
  const scale = interpolate(progress, [0, 1], [0.98, 1.02]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        perspective: 1200,
      }}
    >
      {/* ── AMBIENT BLURRED BACKDROP ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          filter: 'blur(50px) brightness(1.1) saturate(1.2)',
          transform: 'scale(1.2) translateZ(0)',
          willChange: 'transform',
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      >
        {clip.clipPath ? (
          isImage ? (
            <img src={clip.clipPath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <OffthreadVideo
              src={clip.clipPath}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }} />
        )}
      </div>

      {/* ── FLOATING 3D HERO CARD ──────────────────────────────────── */}
      <div
        style={{
          transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`,
          willChange: 'transform',
          width: '78%',
          height: '78%',
          borderRadius: 16,
          backgroundColor: '#18181B',
          boxShadow:
            '0 35px 90px rgba(0, 0, 0, 0.22), 0 10px 30px rgba(0, 0, 0, 0.1), inset 0 0 0 2px rgba(255, 255, 255, 0.8)',
          position: 'relative',
          overflow: 'hidden',
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
          <div style={{ width: '100%', height: '100%', backgroundColor: '#18181B' }} />
        )}

        {/* Optional Ambient Subject Badge */}
        {(clip.layoutData?.title || clip.layoutData?.badge) && (
          <div
            style={{
              position: 'absolute',
              top: 20,
              left: 24,
              backgroundColor: 'rgba(15, 23, 42, 0.82)',
              backdropFilter: 'blur(8px)',
              padding: '6px 14px',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 900, color: '#FFF', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {clip.layoutData.title}
            </span>
            {clip.layoutData.subtitle && (
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600, color: '#94A3B8' }}>
                {clip.layoutData.subtitle}
              </span>
            )}
          </div>
        )}
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
