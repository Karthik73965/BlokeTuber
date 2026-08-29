import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const SplitMilestoneCard: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
    config: { damping: 14, stiffness: 120, mass: 0.7 },
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
  const rightText = callout.line2 || callout.line1;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 60,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: 'flex',
        alignItems: 'stretch',
        boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
        borderRadius: 4,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: '#18181B',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          borderRight: '2px solid #27272A',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 34,
            fontWeight: 800,
            color: '#FFFFFF',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {callout.line1}
        </span>
      </div>

      <div
        style={{
          backgroundColor: '#D97706', // Matte Ochre / Burnt Amber
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 34,
            fontWeight: 900,
            color: '#18181B',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          {rightText}
        </span>
      </div>
    </div>
  );
};
