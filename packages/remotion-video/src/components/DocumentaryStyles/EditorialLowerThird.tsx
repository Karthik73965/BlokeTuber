import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const EditorialLowerThird: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.max(0, Math.round((callout.startTime ?? 0.05) * fps));
  const endFrame = Math.min(
    Math.round(clipDurationInSeconds * fps),
    Math.round((callout.endTime ?? (callout.startTime ?? 0.05) + 3.0) * fps)
  );

  const localFrame = frame - startFrame;
  const totalHoldFrames = Math.max(1, endFrame - startFrame);

  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 120, mass: 0.7 },
  });

  const exitFrames = 8;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const translateX = interpolate(enterSpring, [0, 1], [-60, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 60,
        opacity,
        transform: `translateX(${translateX}px)`,
        display: 'flex',
        alignItems: 'stretch',
        pointerEvents: 'none',
        maxWidth: 900,
        boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
      }}
    >
      {/* Matte Ochre Vertical Accent Bar */}
      <div
        style={{
          width: 8,
          backgroundColor: '#D97706',
          flexShrink: 0,
        }}
      />

      {/* Matte Charcoal Container */}
      <div
        style={{
          backgroundColor: '#18181B',
          padding: '16px 36px 16px 24px',
          borderRight: '1px solid #27272A',
        }}
      >
        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 16,
              fontWeight: 800,
              color: '#F59E0B',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            {callout.line2}
          </div>
        )}

        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 52,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
          }}
        >
          {callout.line1}
        </div>
      </div>
    </div>
  );
};
