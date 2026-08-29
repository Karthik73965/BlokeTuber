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
    (clip.clipPath && /\.(jpg|jpeg|png|webp|avif)$/i.test(clip.clipPath)) ||
    !clip.clipPath;

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // Background slow ambient drift
  const bgScale = interpolate(progress, [0, 1], [1.3, 1.38]);

  // Foreground floating 3D perspective drift
  const fgScale = interpolate(progress, [0, 1], [0.98, 1.03]);
  const fgRotateX = interpolate(progress, [0, 1], [3, 0.5]);
  const fgRotateY = interpolate(progress, [0, 1], [-4, -1]);
  const fgTranslateY = interpolate(progress, [0, 1], [15, -10]);

  // Transition flash/dip
  const tSeconds = frame / fps;
  const flashOpacity = tSeconds < 0.08 ? interpolate(tSeconds, [0, 0.08], [0.35, 0]) : 0;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#09090B',
        overflow: 'hidden',
      }}
    >
      {/* ── 1. AMBIENT BLURRED MIRROR BACKGROUND ─────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: -60,
          filter: 'blur(50px) brightness(0.45) saturate(1.2)',
          transform: `scale(${bgScale})`,
          overflow: 'hidden',
        }}
      >
        {clip.clipPath ? (
          isImage ? (
            <Img
              src={clip.clipPath}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <OffthreadVideo
              src={clip.clipPath}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#18181B' }} />
        )}
      </div>

      {/* Dark Vignette over background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── 2. FOREGROUND 3D FLOATING MEDIA CARD ─────────────────────── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          perspective: 1200,
          padding: '40px 100px 100px',
        }}
      >
        <div
          style={{
            width: '88%',
            height: '78%',
            maxWidth: 1500,
            transform: `translateY(${fgTranslateY}px) scale(${fgScale}) rotateX(${fgRotateX}deg) rotateY(${fgRotateY}deg)`,
            borderRadius: 14,
            overflow: 'hidden',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            boxShadow:
              '0 40px 100px rgba(0,0,0,0.9), 0 10px 30px rgba(0,0,0,0.7), inset 0 0 1px rgba(255,255,255,0.3)',
            backgroundColor: '#121216',
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
                  filter: 'contrast(1.05) saturate(1.06)',
                }}
              />
            ) : (
              <OffthreadVideo
                src={clip.clipPath}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.05) saturate(1.06)',
                }}
              />
            )
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#18181B' }} />
          )}

          {/* Internal shadow frame */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.4)',
              pointerEvents: 'none',
            }}
          />
        </div>
      </div>

      {/* Micro Transition Flash */}
      {flashOpacity > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#000000',
            opacity: flashOpacity,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* ── 3. OVERLAY CALLOUT LAYER ─────────────────────────────────── */}
      <CalloutDispatcher
        callout={clip.callout}
        numberOverlays={clip.numberOverlays}
        clipDurationInSeconds={durationInSeconds}
      />
    </div>
  );
};
