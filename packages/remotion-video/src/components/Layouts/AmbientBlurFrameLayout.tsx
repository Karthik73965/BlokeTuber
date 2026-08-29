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

  // Floating 3D card motion
  const rotateX = interpolate(progress, [0, 1], [3, -2]);
  const rotateY = interpolate(progress, [0, 1], [-4, 3]);
  const scale = interpolate(progress, [0, 1], [0.98, 1.03]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#FAF8F5',
        overflow: 'hidden',
        perspective: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── AMBIENT BLURRED MIRROR BACKGROUND ──────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: -40,
          filter: 'blur(50px) brightness(1.1) saturate(1.2)',
          transform: 'scale(1.2)',
          opacity: 0.65,
          pointerEvents: 'none',
        }}
      >
        {clip.clipPath ? (
          isImage ? (
            <img src={clip.clipPath} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <OffthreadVideo src={clip.clipPath} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#E5E7EB' }} />
        )}
      </div>

      {/* ── FLOATING 3D HERO CARD ──────────────────────────────────── */}
      <div
        style={{
          transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
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
