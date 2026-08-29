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

export const IlluminatedLightboxLayout: React.FC<LayoutProps> = ({
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

  // Macro camera push-in onto light table
  const scale = interpolate(progress, [0, 1], [0.97, 1.03]);
  const translateY = interpolate(progress, [0, 1], [10, -5]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#FFFFFF', // Luminous backlit light table
        backgroundImage:
          'radial-gradient(ellipse at center, #FFFFFF 0%, #F1F5F9 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 100px',
      }}
    >
      {/* 35mm Slide Mount Holder */}
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale})`,
          backgroundColor: '#1E1E24', // Matte black slide frame holder
          border: '1px solid #333338',
          borderRadius: 4,
          padding: '24px 32px 36px',
          boxShadow:
            '0 35px 90px rgba(0,0,0,0.35), 0 4px 14px rgba(0,0,0,0.2)',
          maxWidth: 1300,
          width: '84%',
          height: '80%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Slide Mount Header Stamps */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 12,
            fontWeight: 800,
            color: '#E2E8F0',
            letterSpacing: '0.14em',
            marginBottom: 10,
          }}
        >
          <span>KODAK TRI-X 400 • SAFETY FILM</span>
          <span style={{ color: '#EF4444' }}>FRAME 24A [SELECTED]</span>
        </div>

        {/* Media Window */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#000000',
            overflow: 'hidden',
            position: 'relative',
            border: '2px solid #383842',
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
                  filter: 'contrast(1.08) saturate(1.05)',
                }}
              />
            ) : (
              <OffthreadVideo
                src={clip.clipPath}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'contrast(1.08) saturate(1.05)',
                }}
              />
            )
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#18181B' }} />
          )}

          {/* Red grease-pencil crop mark lines */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 10,
              width: 30,
              height: 30,
              borderTop: '3px solid #EF4444',
              borderLeft: '3px solid #EF4444',
              opacity: 0.8,
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              width: 30,
              height: 30,
              borderBottom: '3px solid #EF4444',
              borderRight: '3px solid #EF4444',
              opacity: 0.8,
            }}
          />
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
