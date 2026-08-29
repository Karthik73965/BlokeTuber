import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const HighlightPill: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = getTheme(callout.themeColor);

  const startFrame = Math.max(0, Math.round((callout.startTime ?? 0.05) * fps));
  const endFrame = Math.min(
    Math.round(clipDurationInSeconds * fps),
    Math.round((callout.endTime ?? (callout.startTime ?? 0.05) + 2.2) * fps)
  );

  const localFrame = frame - startFrame;
  const totalHoldFrames = Math.max(1, endFrame - startFrame);

  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 12, stiffness: 150, mass: 0.6 },
  });

  const exitFrames = 8;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const scale = interpolate(enterSpring, [0, 1], [0.8, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 120,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: theme.primary,
          color: theme.textDark,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSize: 42,
          fontWeight: 900,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          padding: '14px 42px',
          borderRadius: 9999,
          boxShadow: `0 14px 35px rgba(0,0,0,0.6), 0 0 25px ${theme.glow}`,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <span>{callout.line1}</span>
      </div>
    </div>
  );
};
