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

export const ForensicDraftingTableLayout: React.FC<LayoutProps> = ({
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

  // 3D Isometric drafting table camera travel
  const scale = interpolate(progress, [0, 1], [0.98, 1.04]);
  const rotateX = interpolate(progress, [0, 1], [9, 5]);
  const rotateY = interpolate(progress, [0, 1], [-7, -3]);
  const translateY = interpolate(progress, [0, 1], [15, -12]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#E8ECF2', // Crisp light blueprint drafting paper
        backgroundImage:
          'linear-gradient(to right, #D8DFEB 1px, transparent 1px), linear-gradient(to bottom, #D8DFEB 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        overflow: 'hidden',
        perspective: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 100px',
      }}
    >
      {/* Top Left Drafting Table Telemetry Header */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          left: 40,
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 12,
          fontWeight: 800,
          color: '#475569',
          letterSpacing: '0.12em',
          display: 'flex',
          gap: 24,
        }}
      >
        <span>SYS: 47.5925° N, 122.3168° W</span>
        <span>GRID: ELEVATION +140M</span>
        <span>SCALE: 1:500 ARCHIVAL</span>
      </div>

      {/* Bottom Scale Measurement Ruler */}
      <div
        style={{
          position: 'absolute',
          bottom: 20,
          left: 40,
          right: 40,
          height: 12,
          borderTop: '2px solid #64748B',
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 9,
          fontFamily: '"Courier New", Courier, monospace',
          color: '#64748B',
          paddingTop: 2,
        }}
      >
        <span>| 0m</span>
        <span>| 25m</span>
        <span>| 50m</span>
        <span>| 75m</span>
        <span>| 100m</span>
      </div>

      {/* Mounted Technical Media Frame with Corner Crosshairs */}
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          backgroundColor: '#FFFFFF',
          padding: '16px',
          border: '2px solid #64748B',
          boxShadow: '0 30px 70px rgba(15, 23, 42, 0.25), 0 4px 12px rgba(0,0,0,0.1)',
          maxWidth: 1300,
          width: '82%',
          height: '76%',
          position: 'relative',
        }}
      >
        {/* Corner Alignment Crosshair Brackets */}
        <div style={{ position: 'absolute', top: 4, left: 4, color: '#3B82F6', fontSize: 16, fontWeight: 900 }}>+</div>
        <div style={{ position: 'absolute', top: 4, right: 4, color: '#3B82F6', fontSize: 16, fontWeight: 900 }}>+</div>
        <div style={{ position: 'absolute', bottom: 4, left: 4, color: '#3B82F6', fontSize: 16, fontWeight: 900 }}>+</div>
        <div style={{ position: 'absolute', bottom: 4, right: 4, color: '#3B82F6', fontSize: 16, fontWeight: 900 }}>+</div>

        {/* Media inside viewport */}
        <div
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#0F172A',
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
            <div style={{ width: '100%', height: '100%', backgroundColor: '#0F172A' }} />
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
