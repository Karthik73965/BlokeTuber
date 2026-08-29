import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const MarkerCircle: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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
    config: { damping: 14, stiffness: 120, mass: 0.8 },
  });

  const exitFrames = 8;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const translateY = interpolate(enterSpring, [0, 1], [30, 0]);

  // Hand-drawn red marker circle stroke drawing
  const circleProgress = interpolate(localFrame, [8, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pathLength = 650;
  const strokeDashoffset = pathLength * (1 - circleProgress);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        padding: '0 60px',
      }}
    >
      <div
        style={{
          opacity,
          transform: `translateY(${translateY}px)`,
          backgroundColor: '#1C1917', // Matte deep obsidian
          border: '1px solid #44403C',
          borderRadius: 6,
          boxShadow: '0 24px 60px rgba(0,0,0,0.85)',
          padding: '36px 60px',
          maxWidth: 900,
          textAlign: 'center',
          position: 'relative',
        }}
      >
        {/* Hand-Drawn SVG Red Marker Circle */}
        <svg
          viewBox="0 0 400 120"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '115%',
            height: '140%',
            pointerEvents: 'none',
            overflow: 'visible',
            zIndex: 10,
          }}
        >
          <path
            d="M 30 60 C 25 15, 375 10, 380 60 C 385 110, 20 115, 35 55"
            fill="none"
            stroke="#DC2626"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
            opacity={0.88}
          />
        </svg>

        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 56,
            fontWeight: 900,
            color: '#F5F5F4',
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            position: 'relative',
            zIndex: 2,
          }}
        >
          {callout.line1}
        </div>

        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 22,
              fontWeight: 700,
              color: '#A8A29E',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginTop: 14,
              position: 'relative',
              zIndex: 2,
            }}
          >
            {callout.line2}
          </div>
        )}
      </div>
    </div>
  );
};
