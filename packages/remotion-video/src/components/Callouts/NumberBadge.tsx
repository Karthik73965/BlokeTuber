import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { NumberOverlay } from '../../types';

export interface NumberBadgeProps {
  overlay: NumberOverlay;
  clipDurationInSeconds: number;
}

export const NumberBadge: React.FC<NumberBadgeProps> = ({ overlay, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.max(0, Math.round(overlay.startTime * fps));
  const endFrame = Math.min(
    Math.round(clipDurationInSeconds * fps),
    Math.round(overlay.endTime * fps)
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
  const scale = interpolate(enterSpring, [0, 1], [0.85, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 110,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          backgroundColor: '#F59E0B',
          color: '#111116',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          fontSize: 54,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          padding: '12px 36px',
          borderRadius: 14,
          boxShadow: '0 16px 40px rgba(0,0,0,0.7), 0 0 25px rgba(245, 158, 11, 0.4)',
        }}
      >
        {overlay.text}
      </div>
    </div>
  );
};
