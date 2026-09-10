import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const PolaroidSnapshot: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const startFrame = Math.max(0, Math.round((callout.startTime ?? 0.05) * fps));
  const endFrame = Math.min(
    Math.round(clipDurationInSeconds * fps),
    Math.round((callout.endTime ?? (callout.startTime ?? 0.05) + 3.2) * fps)
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
  const translateY = interpolate(enterSpring, [0, 1], [40, 0]);
  const rotate = interpolate(enterSpring, [0, 1], [3, 1.8]);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        right: 80,
        opacity,
        transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: '#FAF7F2',
          padding: '14px 14px 20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.65), 0 4px 12px rgba(0,0,0,0.4)',
          borderRadius: 2,
          border: '1px solid #E5DFD3',
          maxWidth: 420,
          position: 'relative',
        }}
      >
        {/* Translucent Scotch Tape Top Center */}
        <div
          style={{
            position: 'absolute',
            top: -14,
            left: '50%',
            transform: 'translateX(-50%) rotate(-1deg)',
            width: 100,
            height: 28,
            backgroundColor: 'rgba(255, 255, 255, 0.65)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            borderLeft: '1px dashed rgba(200, 190, 170, 0.4)',
            borderRight: '1px dashed rgba(200, 190, 170, 0.4)',
            zIndex: 10,
          }}
        />

        {/* Photo Box Area */}
        <div
          style={{
            width: 390,
            height: 240,
            backgroundColor: '#1E1E24',
            borderRadius: 1,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
          }}
        >
          <div
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 16,
              color: '#71717A',
              fontWeight: 600,
              letterSpacing: '0.05em',
            }}
          >
            [EVIDENCE PHOTO ARCHIVE]
          </div>
        </div>

        {/* Handwritten Sharpie / Marker Caption */}
        <div
          style={{
            marginTop: 14,
            textAlign: 'center',
            fontFamily: '"Caveat", "Comic Sans MS", "Brush Script MT", cursive',
            fontSize: 32,
            fontWeight: 700,
            color: '#18181B',
            lineHeight: 1.1,
            transform: 'rotate(-0.8deg)',
          }}
        >
          {callout.line1}
        </div>

        {callout.line2 && (
          <div
            style={{
              marginTop: 4,
              textAlign: 'center',
              fontFamily: 'Courier New, monospace',
              fontSize: 12,
              fontWeight: 700,
              color: '#78716C',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            {callout.line2}
          </div>
        )}
      </div>
    </div>
  );
};
