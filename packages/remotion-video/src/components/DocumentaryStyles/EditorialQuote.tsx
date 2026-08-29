import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const EditorialQuote: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
    config: { damping: 15, stiffness: 100, mass: 0.8 },
  });

  const exitFrames = 8;
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
        bottom: 90,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: 'none',
        padding: '0 80px',
      }}
    >
      <div
        style={{
          backgroundColor: '#18181B',
          borderLeft: '5px solid #D97706',
          borderRadius: '0 4px 4px 0',
          padding: '24px 40px',
          maxWidth: 1100,
          width: '100%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 2,
            left: 14,
            fontSize: 60,
            fontFamily: 'Georgia, serif',
            color: '#D97706',
            lineHeight: 1,
          }}
        >
          “
        </div>

        <div style={{ marginLeft: 24 }}>
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 36,
              fontStyle: 'italic',
              fontWeight: 500,
              color: '#FFFFFF',
              lineHeight: 1.3,
            }}
          >
            “{callout.line1}”
          </div>

          {callout.line2 && (
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 18,
                fontWeight: 700,
                color: '#D97706',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: 12,
              }}
            >
              — {callout.line2}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
