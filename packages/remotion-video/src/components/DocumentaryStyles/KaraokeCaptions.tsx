import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const KaraokeCaptions: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
  const translateY = interpolate(enterSpring, [0, 1], [25, 0]);

  // Word-by-word active index progression
  const words = callout.line1.split(' ');
  const activeWordIdx = Math.min(
    words.length - 1,
    Math.floor((localFrame / totalHoldFrames) * words.length)
  );

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
      }}
    >
      <div
        style={{
          backgroundColor: '#18181B',
          border: '1px solid #3F3F46',
          borderRadius: 8,
          boxShadow: '0 20px 50px rgba(0,0,0,0.85)',
          padding: '16px 32px',
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          justifyContent: 'center',
          maxWidth: 1000,
        }}
      >
        {words.map((word, idx) => {
          const isActive = idx === activeWordIdx;
          return (
            <span
              key={idx}
              style={{
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 38,
                fontWeight: 900,
                color: isActive ? '#000000' : '#A1A1AA',
                backgroundColor: isActive ? '#FACC15' : 'transparent',
                padding: isActive ? '2px 8px' : '2px 0',
                borderRadius: 4,
                textTransform: 'uppercase',
                transition: 'all 0.1s ease',
              }}
            >
              {word}
            </span>
          );
        })}
      </div>
    </div>
  );
};
