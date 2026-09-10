import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const BreakingNews: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.max(0, Math.round((callout.startTime ?? 0.05) * fps));
  const defaultEndTime = Math.max(clipDurationInSeconds - 0.4, (callout.startTime ?? 0.05) + 6.0);
  const endFrame = Math.min(
    Math.round(clipDurationInSeconds * fps),
    Math.round((callout.endTime ?? defaultEndTime) * fps)
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
  const translateY = interpolate(enterSpring, [0, 1], [-60, 0]);

  const badgeText = callout.line2 ? callout.line2.toUpperCase() : 'BREAKING NEWS';

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        opacity,
        transform: `translateY(${translateY}px)`,
        backgroundColor: 'rgba(204, 0, 0, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '4px solid #FF3333',
        boxShadow: '0 10px 35px rgba(204,0,0,0.5)',
        padding: '16px 40px',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        pointerEvents: 'none',
      }}
    >
      {/* Alert Badge */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          color: '#CC0000',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSize: 24,
          fontWeight: 900,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          padding: '6px 18px',
          borderRadius: 4,
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
        }}
      >
        {badgeText}
      </div>

      {/* Main Headline */}
      <div
        style={{
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSize: 44,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          textShadow: '0 2px 8px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {callout.line1}
      </div>
    </div>
  );
};
