import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const ForensicDataCard: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
    config: { damping: 24, stiffness: 55, mass: 1.2 },
  });

  const exitFrames = 18;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const translateY = interpolate(enterSpring, [0, 1], [30, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 60,
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: 'none',
        maxWidth: 900,
      }}
    >
      <div
        style={{
          backgroundColor: '#18181B',
          border: '1px solid #3F3F46',
          borderRadius: 4,
          boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
          padding: '20px 28px',
        }}
      >
        {/* Top metadata with simulated barcode */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #27272A',
            paddingBottom: 8,
            marginBottom: 12,
          }}
        >
          <div
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 12,
              fontWeight: 800,
              color: '#A1A1AA',
              letterSpacing: '0.1em',
            }}
          >
            FORENSIC TELEMETRY // SHA-256: 8f9b2...e41
          </div>

          {/* Simple vector barcode */}
          <div style={{ display: 'flex', gap: 2, height: 16 }}>
            {[2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 3, 4, 2].map((w, i) => (
              <div
                key={i}
                style={{
                  width: w,
                  height: '100%',
                  backgroundColor: '#A1A1AA',
                }}
              />
            ))}
          </div>
        </div>

        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 44,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}
        >
          {callout.line1}
        </div>

        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 14,
              fontWeight: 700,
              color: '#D97706',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginTop: 8,
            }}
          >
            {callout.line2}
          </div>
        )}
      </div>
    </div>
  );
};
