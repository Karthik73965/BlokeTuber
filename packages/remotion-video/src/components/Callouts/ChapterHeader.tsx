import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const ChapterHeader: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = getTheme(callout.themeColor);

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
    config: { damping: 16, stiffness: 90, mass: 0.9 },
  });

  const exitFrames = 10;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const lineWidth = interpolate(enterSpring, [0, 1], [0, 100]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: 'rgba(5, 5, 8, 0.90)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '40px 0',
          position: 'relative',
          textAlign: 'center',
          boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
        }}
      >
        {/* Top Animated Line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${lineWidth}%`,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
            boxShadow: `0 0 16px ${theme.primary}`,
          }}
        />

        {/* Primary Title */}
        <div
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 76,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
            textShadow: '0 4px 20px rgba(0,0,0,0.9)',
          }}
        >
          {callout.line1}
        </div>

        {/* Subtitle */}
        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
              fontSize: 28,
              fontWeight: 700,
              color: theme.primary,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginTop: 14,
              textShadow: `0 2px 10px rgba(0,0,0,0.8), 0 0 15px ${theme.glow}`,
            }}
          >
            {callout.line2}
          </div>
        )}

        {/* Bottom Animated Line */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${lineWidth}%`,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${theme.primary}, transparent)`,
            boxShadow: `0 0 16px ${theme.primary}`,
          }}
        />
      </div>
    </div>
  );
};
