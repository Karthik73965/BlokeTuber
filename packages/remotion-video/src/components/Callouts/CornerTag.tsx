import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const CornerTag: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
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
  const translateY = interpolate(enterSpring, [0, 1], [-20, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 40,
        right: 50,
        opacity,
        transform: `translateY(${translateY}px)`,
        backgroundColor: theme.bgGlass,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: `3px solid ${theme.primary}`,
        borderRadius: '0 0 8px 8px',
        padding: '8px 20px',
        boxShadow: `0 10px 25px rgba(0,0,0,0.5), 0 0 15px ${theme.glow}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSize: 22,
          fontWeight: 800,
          color: '#FFFFFF',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        {callout.line1}
      </div>
      {callout.line2 && (
        <div
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 16,
            fontWeight: 600,
            color: theme.secondary,
            letterSpacing: '0.05em',
            marginTop: 2,
          }}
        >
          {callout.line2}
        </div>
      )}
    </div>
  );
};
