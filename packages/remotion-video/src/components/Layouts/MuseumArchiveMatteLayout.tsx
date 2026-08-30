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

export const MuseumArchiveMatteLayout: React.FC<LayoutProps> = ({
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

  // Gentle museum gallery pull-back
  const scale = interpolate(progress, [0, 1], [1.03, 0.98]);
  const translateY = interpolate(progress, [0, 1], [10, -8]);
  const rotate = interpolate(progress, [0, 1], [-0.5, 0.2]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F3EFE6', // Warm ivory museum wall
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, #FAF8F5 0%, #ECE6D8 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 100px',
      }}
    >
      {/* Framed Museum Mat Card */}
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotate}deg)`,
          backgroundColor: '#FAF8F5',
          padding: '24px 24px 44px',
          boxShadow:
            '0 35px 80px rgba(40, 30, 20, 0.22), 0 6px 16px rgba(0,0,0,0.08), inset 0 0 1px rgba(0,0,0,0.15)',
          borderRadius: 2,
          border: '1px solid #E2DCce',
          maxWidth: 1300,
          width: '84%',
          height: '78%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Inner Media Viewport */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#1E1E24',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid #D5CEBF',
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.3)',
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
                  filter: 'contrast(1.05) saturate(1.04)',
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
            <div style={{ width: '100%', height: '100%', backgroundColor: '#26262B' }} />
          )}
        </div>

        {/* Archival Catalog Stamp in Museum Mat Margin */}
        <div
          style={{
            position: 'absolute',
            bottom: 12,
            left: 28,
            right: 28,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 11,
            fontWeight: 700,
            color: '#78716C',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          <span>ARCHIVE REF // EXHIBIT 04</span>
          <span>CURATED DOCUMENTARY ARCHIVE</span>
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
