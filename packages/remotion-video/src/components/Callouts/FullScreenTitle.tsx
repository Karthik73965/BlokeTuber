import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const FullScreenTitle: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
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
    config: { damping: 18, stiffness: 80, mass: 1.0 },
  });

  const exitFrames = 12;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const scale = interpolate(enterSpring, [0, 1], [0.95, 1]);
  const lineWidth = interpolate(enterSpring, [0, 1], [0, 80]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        pointerEvents: 'none',
      }}
    >
      {/* Top Accent Line */}
      <div
        style={{
          width: `${lineWidth}%`,
          maxWidth: 900,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
          boxShadow: `0 0 16px ${theme.primary}`,
          marginBottom: 32,
        }}
      />

      {/* Main Title */}
      <div
        style={{
          transform: `scale(${scale})`,
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSize: 88,
          fontWeight: 900,
          color: '#FFFFFF',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.1,
          maxWidth: 1400,
          padding: '0 40px',
          textShadow: '0 4px 25px rgba(0,0,0,0.9)',
        }}
      >
        {callout.line1}
      </div>

      {/* Subtitle */}
      {callout.line2 && (
        <div
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 32,
            fontWeight: 700,
            color: theme.primary,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginTop: 20,
            textShadow: `0 2px 12px rgba(0,0,0,0.8), 0 0 20px ${theme.glow}`,
          }}
        >
          {callout.line2}
        </div>
      )}

      {/* Bottom Accent Line */}
      <div
        style={{
          width: `${lineWidth}%`,
          maxWidth: 900,
          height: 3,
          background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
          boxShadow: `0 0 16px ${theme.primary}`,
          marginTop: 32,
        }}
      />
    </div>
  );
};
