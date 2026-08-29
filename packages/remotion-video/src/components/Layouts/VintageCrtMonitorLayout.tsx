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

export const VintageCrtMonitorLayout: React.FC<LayoutProps> = ({
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

  // Slow TV broadcast camera zoom
  const scale = interpolate(progress, [0, 1], [0.99, 1.03]);

  // Animated seconds in timecode
  const totalSeconds = Math.floor(frame / fps);
  const framesMod = String(frame % 30).padStart(2, '0');
  const secondsMod = String(totalSeconds % 60).padStart(2, '0');

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F5F2EB', // Bright studio room backdrop
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, #FAF8F5 0%, #E8E2D5 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 80px',
      }}
    >
      {/* Retro 1990s Beige Computer / Broadcast Monitor Housing */}
      <div
        style={{
          transform: `scale(${scale})`,
          backgroundColor: '#E6E0D3', // Classic 90s vintage beige computer casing
          border: '14px solid #D6CEBE',
          borderRadius: 24,
          boxShadow:
            '0 40px 100px rgba(50, 40, 30, 0.25), 0 8px 24px rgba(0,0,0,0.12), inset 0 0 20px rgba(255,255,255,0.6)',
          maxWidth: 1360,
          width: '88%',
          height: '84%',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* CRT Curved Screen Viewport */}
        <div
          style={{
            flex: 1,
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: '#050508',
            borderRadius: 14,
            border: '4px solid #B8AE9C',
            boxShadow: 'inset 0 0 40px rgba(0,0,0,0.85)',
          }}
        >
          {/* Media Content */}
          {clip.clipPath ? (
            isImage ? (
              <img
                src={clip.clipPath}
                alt=""
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.12) saturate(1.1) brightness(0.95)',
                }}
              />
            ) : (
              <OffthreadVideo
                src={clip.clipPath}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.12) saturate(1.1) brightness(0.95)',
                }}
              />
            )
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#09090E' }} />
          )}

          {/* CRT Horizontal Scanlines Overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.22) 0px, rgba(0,0,0,0.22) 2px, transparent 2px, transparent 4px)',
              pointerEvents: 'none',
              mixBlendMode: 'multiply',
            }}
          />

          {/* Curved Screen Glass Vignette */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.7) 100%)',
              boxShadow: 'inset 0 0 60px rgba(0,0,0,0.85)',
              pointerEvents: 'none',
            }}
          />

          {/* Vintage Broadcast OSD */}
          <div
            style={{
              position: 'absolute',
              top: 24,
              left: 28,
              right: 28,
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 16,
              fontWeight: 900,
              color: '#4ADE80',
              textShadow: '0 0 6px rgba(74, 222, 128, 0.6)',
              letterSpacing: '0.1em',
              pointerEvents: 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: frame % 30 < 18 ? '#EF4444' : 'transparent',
                }}
              />
              <span>REC • CH-03</span>
            </div>
            <div>TAPE: 00:{secondsMod}:{framesMod}</div>
          </div>

          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: 28,
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 14,
              fontWeight: 800,
              color: '#4ADE80',
              textShadow: '0 0 6px rgba(74, 222, 128, 0.6)',
              letterSpacing: '0.12em',
              pointerEvents: 'none',
            }}
          >
            SP PLAY ◄◄ 4:3 ARCHIVE
          </div>
        </div>

        {/* Vintage 90s Monitor Bottom Control Strip */}
        <div
          style={{
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 10,
            fontWeight: 800,
            color: '#78716C',
          }}
        >
          <span>TRINITRON MONITOR • 1994</span>
          <div style={{ display: 'flex', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#22C55E' }} />
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#A8A29E' }} />
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
