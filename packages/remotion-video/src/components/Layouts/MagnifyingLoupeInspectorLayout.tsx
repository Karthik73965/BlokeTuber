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

export const MagnifyingLoupeInspectorLayout: React.FC<LayoutProps> = ({
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

  // Loupe glides diagonally across the archival map
  const loupeTranslateX = interpolate(progress, [0, 1], [-80, 80]);
  const loupeTranslateY = interpolate(progress, [0, 1], [30, -30]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#EBE5D8', // Archival vintage map background
        backgroundImage:
          'radial-gradient(#D5CCB8 15%, transparent 16%), radial-gradient(#D5CCB8 15%, transparent 16%)',
        backgroundSize: '24px 24px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Background Topographic Contour Grid */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          opacity: 0.25,
          pointerEvents: 'none',
        }}
      >
        <circle cx="400" cy="300" r="240" fill="none" stroke="#78716C" strokeWidth="1.5" />
        <circle cx="400" cy="300" r="180" fill="none" stroke="#78716C" strokeWidth="1.5" />
        <circle cx="1500" cy="700" r="320" fill="none" stroke="#78716C" strokeWidth="1.5" />
        <circle cx="1500" cy="700" r="220" fill="none" stroke="#78716C" strokeWidth="1.5" />
      </svg>

      {/* ── CIRCULAR OPTICAL MAGNIFYING LOUPE ───────────────────────── */}
      <div
        style={{
          transform: `translateX(${loupeTranslateX}px) translateY(${loupeTranslateY}px)`,
          width: 720,
          height: 720,
          borderRadius: '50%',
          backgroundColor: '#1E1E24',
          border: '18px solid #E2DCCE', // Brushed metallic chrome bezel
          boxShadow:
            '0 40px 100px rgba(40, 30, 20, 0.4), 0 10px 30px rgba(0,0,0,0.2), inset 0 0 40px rgba(0,0,0,0.6)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Media inside optical circle */}
        {clip.clipPath ? (
          isImage ? (
            <img
              src={clip.clipPath}
              alt=""
              style={{
                width: '120%',
                height: '120%',
                objectFit: 'cover',
                filter: 'contrast(1.08) saturate(1.06)',
              }}
            />
          ) : (
            <OffthreadVideo
              src={clip.clipPath}
              style={{
                width: '120%',
                height: '120%',
                objectFit: 'cover',
                filter: 'contrast(1.08) saturate(1.06)',
              }}
            />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#141418' }} />
        )}

        {/* Optical Glass Crosshair Reticle */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: 1,
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            bottom: 0,
            width: 1,
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            pointerEvents: 'none',
          }}
        />

        {/* Outer Circular Reticle Ring */}
        <div
          style={{
            position: 'absolute',
            width: 280,
            height: 280,
            borderRadius: '50%',
            border: '1px dashed rgba(239, 68, 68, 0.5)',
            pointerEvents: 'none',
          }}
        />

        {/* Loupe Magnification Stamp */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: '4px 14px',
            borderRadius: 3,
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 11,
            fontWeight: 900,
            color: '#F59E0B',
            letterSpacing: '0.1em',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <span>{clip.layoutData?.stamp || clip.layoutData?.title || '2.5x OPTICAL LOUPE // FORENSIC ZOOM'}</span>
          {clip.layoutData?.coords && (
            <span style={{ color: '#E2E8F0', borderLeft: '1px solid #64748B', paddingLeft: 8 }}>
              {clip.layoutData.coords}
            </span>
          )}
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
