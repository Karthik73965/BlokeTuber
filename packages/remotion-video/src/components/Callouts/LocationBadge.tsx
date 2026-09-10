import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const LocationBadge: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
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
  const translateY = interpolate(enterSpring, [0, 1], [-30, 0]);

  // Pulse ring animation for location dot
  const pulsePhase = (localFrame % 30) / 30;
  const ringScale = interpolate(pulsePhase, [0, 1], [1, 2.4]);
  const ringOpacity = interpolate(pulsePhase, [0, 0.7, 1], [0.8, 0.2, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: theme.bgGlass,
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `1px solid ${theme.border}55`,
          borderBottom: `3px solid ${theme.primary}`,
          borderRadius: 9999,
          padding: '12px 32px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          boxShadow: `0 14px 40px rgba(0,0,0,0.6), 0 0 25px ${theme.glow}`,
        }}
      >
        {/* Pulsing Pin Dot */}
        <div style={{ position: 'relative', width: 14, height: 14, flexShrink: 0 }}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              backgroundColor: theme.primary,
              boxShadow: `0 0 10px ${theme.primary}`,
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: `2px solid ${theme.primary}`,
              transform: `scale(${ringScale})`,
              opacity: ringOpacity,
            }}
          />
        </div>

        {/* Text Container */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontSize: 34,
              fontWeight: 800,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              lineHeight: 1.15,
            }}
          >
            {callout.line1}
          </div>
          {callout.line2 && (
            <div
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontSize: 20,
                fontWeight: 600,
                color: theme.primary,
                letterSpacing: '0.06em',
                marginTop: 2,
              }}
            >
              {callout.line2}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
