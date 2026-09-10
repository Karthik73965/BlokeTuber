import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const LowerThird: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
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
  const translateX = interpolate(enterSpring, [0, 1], [-80, 0]);

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
        maxWidth: '80%',
      }}
    >
      {/* Vertical Accent Bar */}
      <div
        style={{
          width: 8,
          borderRadius: 4,
          backgroundColor: theme.primary,
          boxShadow: `0 0 16px ${theme.primary}`,
          marginRight: 18,
          flexShrink: 0,
        }}
      />

      {/* Glass card body */}
      <div
        style={{
          background: `linear-gradient(90deg, ${theme.bgGlass} 0%, rgba(9, 9, 11, 0.6) 80%, transparent 100%)`,
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderLeft: `1px solid ${theme.primary}55`,
          borderRadius: '0 14px 14px 0',
          padding: '14px 36px 14px 20px',
          boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        }}
      >
        {/* Role Subtitle */}
        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontSize: 22,
              fontWeight: 800,
              color: theme.primary,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: 4,
              textShadow: '0 2px 8px rgba(0,0,0,0.8)',
            }}
          >
            {callout.line2}
          </div>
        )}

        {/* Primary Name */}
        <div
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 58,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textShadow: '0 4px 16px rgba(0,0,0,0.9)',
          }}
        >
          {callout.line1}
        </div>
      </div>
    </div>
  );
};
