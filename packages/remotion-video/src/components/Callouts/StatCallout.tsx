import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const StatCallout: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
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

  // Smooth entrance spring
  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  // Smooth exit fade
  const exitFrames = 8;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);
  const scale = interpolate(enterSpring, [0, 1], [0.92, 1]);

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
          transform: `translateY(${translateY}px) scale(${scale})`,
          backgroundColor: theme.bgGlass,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${theme.border}44`,
          borderRadius: 18,
          boxShadow: `0 20px 50px rgba(0,0,0,0.6), 0 0 30px ${theme.glow}`,
          padding: '24px 48px',
          maxWidth: 900,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top glowing accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '15%',
            right: '15%',
            height: 4,
            background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
            boxShadow: `0 0 12px ${theme.primary}`,
          }}
        />

        {/* Big Bold Stat Text */}
        <div
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 92,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            lineHeight: 1.05,
            textShadow: '0 4px 20px rgba(0,0,0,0.8)',
          }}
        >
          {callout.line1}
        </div>

        {/* Subtitle / Context */}
        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontSize: 30,
              fontWeight: 700,
              color: theme.primary,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginTop: 12,
              textShadow: `0 2px 10px rgba(0,0,0,0.8), 0 0 15px ${theme.glow}`,
            }}
          >
            {callout.line2}
          </div>
        )}
      </div>
    </div>
  );
};
