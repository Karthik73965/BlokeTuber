import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const EvidenceTag: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = getTheme(callout.themeColor || 'crimson');

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

  // Heavy "Stamp Slam" spring entrance
  const stampSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 11, stiffness: 160, mass: 1.2 },
  });

  const exitFrames = 8;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = interpolate(localFrame, [0, 2], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  }) * exitProgress;

  const scale = interpolate(stampSpring, [0, 1], [1.3, 1]);
  const rotate = interpolate(stampSpring, [0, 1], [-4, -1.2]);

  const stampWatermark = callout.line2 ? callout.line2.toUpperCase() : 'OFFICIAL EVIDENCE';

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
          transform: `scale(${scale}) rotate(${rotate}deg)`,
          backgroundColor: 'rgba(24, 6, 6, 0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: `3px solid ${theme.primary}`,
          borderRadius: 8,
          boxShadow: `0 24px 60px rgba(0,0,0,0.8), 0 0 35px ${theme.glow}`,
          padding: '28px 56px',
          maxWidth: 1100,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Top/bottom heavy alert bars */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: theme.primary,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: theme.primary,
          }}
        />

        {/* Faint Stamp Watermark */}
        <div
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 48,
            fontWeight: 900,
            color: theme.primary,
            opacity: 0.28,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: -8,
            userSelect: 'none',
          }}
        >
          {stampWatermark}
        </div>

        {/* Bold Primary Evidence Text */}
        <div
          style={{
            fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
            fontSize: 58,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
            textShadow: `0 4px 16px rgba(0,0,0,0.9), 0 0 20px ${theme.glow}`,
            marginTop: 4,
          }}
        >
          {callout.line1}
        </div>
      </div>
    </div>
  );
};
