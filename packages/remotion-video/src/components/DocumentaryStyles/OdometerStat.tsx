import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const OdometerStat: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
    config: { damping: 24, stiffness: 55, mass: 1.2 },
  });

  const exitFrames = 18;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const isStatic = callout.staticDisplay === true;
  const opacity = isStatic ? 1 : enterSpring * exitProgress;
  const translateY = isStatic ? 0 : interpolate(enterSpring, [0, 1], [40, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          backgroundColor: '#18181B', // Solid matte obsidian
          border: '2px solid #27272A',
          borderRadius: 8,
          boxShadow: '0 25px 60px rgba(0,0,0,0.85)',
          padding: '28px 56px',
          textAlign: 'center',
          maxWidth: 900,
        }}
      >
        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 96,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.04em',
            lineHeight: 1,
          }}
        >
          {callout.line1}
        </div>

        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 24,
              fontWeight: 800,
              color: '#F59E0B',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginTop: 14,
            }}
          >
            {callout.line2}
          </div>
        )}
      </div>
    </div>
  );
};
