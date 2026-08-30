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

export const HorizonTopBottomSplitLayout: React.FC<LayoutProps> = ({
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

  // Synced counter-direction pans for top and bottom halves
  const topTranslateX = interpolate(progress, [0, 1], [-20, 20]);
  const bottomTranslateX = interpolate(progress, [0, 1], [20, -20]);

  const groundSrc = clip.secondaryClipPath || clip.additionalClipPaths?.[0] || clip.clipPath;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F5F2EB', // Warm clean editorial gallery backdrop
        padding: '30px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflow: 'hidden',
      }}
    >
      {/* ── TOP HORIZON HALF (50%) ──────────────────────────────────── */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#1E1E24',
          borderRadius: 6,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #D5CEBF',
          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ transform: `translateX(${topTranslateX}px)`, width: '105%', height: '100%' }}>
          {clip.clipPath ? (
            isImage ? (
              <img
                src={clip.clipPath}
                alt=""
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

        {/* Top Tag */}
        <div
          style={{
            position: 'absolute',
            top: 14,
            left: 18,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '3px 10px',
            borderRadius: 3,
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 10,
            fontWeight: 800,
            color: '#1C1917',
            letterSpacing: '0.1em',
          }}
        >
          {clip.layoutData?.title || 'WIDE PERSPECTIVE // 01'}
        </div>
      </div>

      {/* ── BOTTOM HORIZON HALF (50%) ───────────────────────────────── */}
      <div
        style={{
          flex: 1,
          backgroundColor: '#1E1E24',
          borderRadius: 6,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid #D5CEBF',
          boxShadow: '0 12px 30px rgba(0,0,0,0.12)',
        }}
      >
        <div style={{ transform: `translateX(${bottomTranslateX}px)`, width: '105%', height: '100%' }}>
          {groundSrc ? (
            isImage ? (
              <img
                src={groundSrc}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.06) saturate(1.05)',
                }}
              />
            ) : (
              <OffthreadVideo
                src={groundSrc}
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

        {/* Bottom Tag */}
        <div
          style={{
            position: 'absolute',
            bottom: 14,
            left: 18,
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            padding: '3px 10px',
            borderRadius: 3,
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 10,
            fontWeight: 800,
            color: '#1C1917',
            letterSpacing: '0.1em',
          }}
        >
          {clip.layoutData?.subtitle || 'GROUND PERSPECTIVE // 02'}
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
