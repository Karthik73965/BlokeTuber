import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const TickerBar: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = getTheme(callout.themeColor);

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
    config: { damping: 15, stiffness: 110, mass: 0.7 },
  });

  const exitFrames = 8;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const translateY = interpolate(enterSpring, [0, 1], [60, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        opacity,
        transform: `translateY(${translateY}px)`,
        display: 'flex',
        alignItems: 'stretch',
        backgroundColor: 'rgba(9, 9, 11, 0.95)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderTop: `2px solid ${theme.primary}`,
        boxShadow: '0 -10px 30px rgba(0,0,0,0.7)',
        pointerEvents: 'none',
        height: 64,
      }}
    >
      {/* Category badge */}
      {callout.line2 && (
        <div
          style={{
            backgroundColor: theme.primary,
            color: theme.textDark,
            padding: '0 28px',
            display: 'flex',
            alignItems: 'center',
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            flexShrink: 0,
          }}
        >
          {callout.line2}
        </div>
      )}

      {/* Main ticker text */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          padding: '0 28px',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: '0.02em',
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
