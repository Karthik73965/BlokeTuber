import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const SplitTitle: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = getTheme(callout.themeColor);

  const startFrame = Math.max(0, Math.round((callout.startTime ?? 0.05) * fps));
  const endFrame = Math.min(
    Math.round(clipDurationInSeconds * fps),
    Math.round((callout.endTime ?? (callout.startTime ?? 0.05) + 2.5) * fps)
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
        bottom: 90,
        left: 60,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: 'flex',
        alignItems: 'stretch',
        boxShadow: `0 18px 45px rgba(0,0,0,0.6), 0 0 20px ${theme.glow}`,
        borderRadius: 10,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Left Dark Header Box */}
      <div
        style={{
          backgroundColor: '#09090B',
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
          borderRight: `2px solid ${theme.primary}`,
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
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

      {/* Right Accent Body Box */}
      <div
        style={{
          backgroundColor: theme.primary,
          padding: '16px 28px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <span
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 34,
            fontWeight: 900,
            color: theme.textDark,
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
