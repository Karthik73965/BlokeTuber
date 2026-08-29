import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';
import { getTheme } from '../../theme';

export interface CalloutProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const QuoteCard: React.FC<CalloutProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const theme = getTheme(callout.themeColor);

  const startFrame = Math.max(0, Math.round((callout.startTime ?? 0.05) * fps));
  const endFrame = Math.min(
    Math.round(clipDurationInSeconds * fps),
    Math.round((callout.endTime ?? (callout.startTime ?? 0.05) + 2.8) * fps)
  );

  const localFrame = frame - startFrame;
  const totalHoldFrames = Math.max(1, endFrame - startFrame);

  if (frame < startFrame || frame > endFrame) {
    return null;
  }

  const enterSpring = spring({
    frame: localFrame,
    fps,
    config: { damping: 15, stiffness: 100, mass: 0.8 },
  });

  const exitFrames = 8;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 90,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `translateY(${translateY}px)`,
        pointerEvents: 'none',
        padding: '0 80px',
      }}
    >
      <div
        style={{
          backgroundColor: theme.bgGlass,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderLeft: `6px solid ${theme.primary}`,
          borderRadius: '0 16px 16px 0',
          padding: '24px 40px',
          maxWidth: 1200,
          width: '100%',
          boxShadow: `0 20px 50px rgba(0,0,0,0.7), 0 0 25px ${theme.glow}`,
          position: 'relative',
        }}
      >
        {/* Quote Glyph */}
        <div
          style={{
            position: 'absolute',
            top: 6,
            left: 18,
            fontSize: 70,
            fontFamily: 'Georgia, serif',
            color: theme.primary,
            opacity: 0.35,
            lineHeight: 1,
          }}
        >
          “
        </div>

        <div style={{ marginLeft: 28 }}>
          {/* Quote Text */}
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 38,
              fontStyle: 'italic',
              fontWeight: 500,
              color: '#FFFFFF',
              lineHeight: 1.35,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            “{callout.line1}”
          </div>

          {/* Speaker Attribution */}
          {callout.line2 && (
            <div
              style={{
                fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
                fontSize: 22,
                fontWeight: 700,
                color: theme.primary,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginTop: 12,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span>—</span>
              <span>{callout.line2}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
