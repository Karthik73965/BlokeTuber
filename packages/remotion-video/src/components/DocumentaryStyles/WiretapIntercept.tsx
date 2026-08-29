import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const WiretapIntercept: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.max(0, Math.round((callout.startTime ?? 0.05) * fps));
  const endFrame = Math.min(
    Math.round(clipDurationInSeconds * fps),
    Math.round((callout.endTime ?? (callout.startTime ?? 0.05) + 3.2) * fps)
  );

  const localFrame = frame - startFrame;
  const totalHoldFrames = Math.max(1, endFrame - startFrame);

  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 110, mass: 0.8 },
  });

  const exitFrames = 8;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const translateX = interpolate(enterSpring, [0, 1], [-50, 0]);

  // Audio equalizer bars
  const barHeights = [24, 42, 18, 55, 32, 60, 45, 28, 50, 36, 64, 48, 22, 58, 38, 16];

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 60,
        opacity,
        transform: `translateX(${translateX}px)`,
        pointerEvents: 'none',
        maxWidth: 960,
      }}
    >
      <div
        style={{
          backgroundColor: '#121214', // Matte deep tactical grey
          border: '1px solid #27272A',
          borderRadius: 4,
          boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
          padding: '20px 32px',
        }}
      >
        {/* Top Header Row with blinking REC dot and Waveform */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #27272A',
            paddingBottom: 10,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Blinking Red Recording Dot */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                backgroundColor: localFrame % 20 < 12 ? '#EF4444' : 'transparent',
              }}
            />
            <span
              style={{
                fontFamily: 'Courier New, monospace',
                fontSize: 12,
                fontWeight: 800,
                color: '#EF4444',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              WIRETAP INTERCEPT // TAPE #84-C
            </span>
          </div>

          {/* Analog Audio Waveform Equalizer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 22 }}>
            {barHeights.map((h, i) => {
              const animatedH =
                Math.max(4, Math.sin((localFrame * 0.3) + i * 0.8) * (h / 2) + h / 2);
              return (
                <div
                  key={i}
                  style={{
                    width: 3,
                    height: animatedH,
                    backgroundColor: '#E4E4E7',
                    borderRadius: 1,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Speaker Name */}
        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 14,
              fontWeight: 800,
              color: '#A1A1AA',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            [SPEAKER]: {callout.line2}
          </div>
        )}

        {/* Primary Audio Transcript Quote */}
        <div
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 34,
            fontStyle: 'italic',
            fontWeight: 500,
            color: '#F4F4F5',
            lineHeight: 1.25,
          }}
        >
          “{callout.line1}”
        </div>
      </div>
    </div>
  );
};
