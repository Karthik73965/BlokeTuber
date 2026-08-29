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

export const OpenCaseBinderLayout: React.FC<LayoutProps> = ({
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

  // 3D camera travel across open case binder
  const scale = interpolate(progress, [0, 1], [0.98, 1.03]);
  const rotateX = interpolate(progress, [0, 1], [8, 4]);
  const rotateY = interpolate(progress, [0, 1], [-5, -2]);
  const translateY = interpolate(progress, [0, 1], [15, -10]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#D9CBBA', // Warm blonde oak desk surface
        backgroundImage:
          'radial-gradient(ellipse at 50% 40%, #E6D8C8 0%, #CBBCA8 100%)',
        overflow: 'hidden',
        perspective: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 100px',
      }}
    >
      {/* Background Tab 1 peeking from underneath */}
      <div
        style={{
          position: 'absolute',
          top: 40,
          right: 180,
          backgroundColor: '#C4B291',
          border: '1px solid #A89574',
          borderRadius: '6px 6px 0 0',
          padding: '6px 20px',
          fontFamily: '"Courier New", Courier, monospace',
          fontSize: 11,
          fontWeight: 800,
          color: '#382E20',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        }}
      >
        INDEX // 02-RECORD
      </div>

      {/* Manila Open Case Binder */}
      <div
        style={{
          transform: `translateY(${translateY}px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotate(0.4deg)`,
          backgroundColor: '#E7D8BD', // Manila folder cardstock
          border: '1px solid #C4B291',
          borderRadius: 4,
          padding: '30px 24px 24px',
          boxShadow:
            '0 35px 80px rgba(60, 40, 20, 0.35), 0 6px 16px rgba(0,0,0,0.12)',
          maxWidth: 1300,
          width: '84%',
          height: '80%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Metal 2-hole top prong fastener */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 120,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#52525B',
              border: '2px solid #D4D4D8',
            }}
          />
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: '50%',
              backgroundColor: '#52525B',
              border: '2px solid #D4D4D8',
            }}
          />
        </div>

        {/* Media Window */}
        <div
          style={{
            flex: 1,
            backgroundColor: '#1E1E24',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid #B8A585',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.3)',
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
            <div style={{ width: '100%', height: '100%', backgroundColor: '#18181B' }} />
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
