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

export const ParallaxTriptychGalleryLayout: React.FC<LayoutProps> = ({
  clip,
  clipIndex,
  durationInFrames,
  durationInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // 3D Parallax Drift
  const centerScale = interpolate(progress, [0, 1], [0.98, 1.05]);
  const centerTranslateY = interpolate(progress, [0, 1], [15, -10]);
  const leftTranslateY = interpolate(progress, [0, 1], [25, 5]);
  const rightTranslateY = interpolate(progress, [0, 1], [5, -20]);

  const leftSrc = clip.additionalClipPaths?.[0] || clip.clipPath;
  const rightSrc = clip.additionalClipPaths?.[1] || clip.clipPath;
  const centerSrc = clip.clipPath;

  const renderMedia = (src: string | null | undefined, isCenter = false) => {
    if (!src) return <div style={{ width: '100%', height: '100%', backgroundColor: '#26262B', borderRadius: 2 }} />;
    const isImg = clip.mediaType === 'image' || /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(src);

    return isImg ? (
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: isCenter ? 'contrast(1.06) saturate(1.05)' : 'contrast(1.02) saturate(0.9) brightness(0.85)',
        }}
      />
    ) : (
      <OffthreadVideo
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: isCenter ? 'contrast(1.06) saturate(1.05)' : 'contrast(1.02) saturate(0.9) brightness(0.85)',
        }}
      />
    );
  };

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F7F4ED', // Warm ivory gallery exhibition space
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, #FFFFFF 0%, #EBE4D5 100%)',
        overflow: 'hidden',
        perspective: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
        padding: '0 60px',
      }}
    >
      {/* ── LEFT PANEL (Wing 1) ─────────────────────────────────────── */}
      <div
        style={{
          width: 380,
          height: '75%',
          backgroundColor: '#FAF8F5',
          padding: '12px 12px 20px',
          borderRadius: 4,
          border: '1px solid #DCD6C8',
          boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
          transform: `translateY(${leftTranslateY}px) rotateY(8deg) rotate(-1.5deg)`,
          opacity: 0.85,
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
          {renderMedia(leftSrc)}
        </div>
      </div>

      {/* ── CENTER HERO PANEL (Enlarged, Focus of Parallax) ─────────── */}
      <div
        style={{
          width: 780,
          height: '84%',
          backgroundColor: '#FAF8F5',
          padding: '18px 18px 30px',
          borderRadius: 6,
          border: '1px solid #D5CEBF',
          boxShadow:
            '0 35px 90px rgba(40, 30, 20, 0.25), 0 8px 24px rgba(0,0,0,0.08)',
          transform: `translateY(${centerTranslateY}px) scale(${centerScale})`,
          zIndex: 10,
          position: 'relative',
        }}
      >
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#18181B',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          {renderMedia(centerSrc, true)}
        </div>
      </div>

      {/* ── RIGHT PANEL (Wing 2) ────────────────────────────────────── */}
      <div
        style={{
          width: 380,
          height: '75%',
          backgroundColor: '#FAF8F5',
          padding: '12px 12px 20px',
          borderRadius: 4,
          border: '1px solid #DCD6C8',
          boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
          transform: `translateY(${rightTranslateY}px) rotateY(-8deg) rotate(1.5deg)`,
          opacity: 0.85,
          overflow: 'hidden',
        }}
      >
        <div style={{ width: '100%', height: '100%', borderRadius: 2, overflow: 'hidden' }}>
          {renderMedia(rightSrc)}
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
