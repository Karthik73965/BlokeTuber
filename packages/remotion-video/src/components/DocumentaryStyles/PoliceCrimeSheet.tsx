import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const PoliceCrimeSheet: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
  const translateY = interpolate(enterSpring, [0, 1], [30, 0]);

  // Stamp Slam
  const stampSpring = spring({
    frame: Math.max(0, localFrame - 15),
    fps,
    config: { damping: 20, stiffness: 80, mass: 1.2 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [1.7, 1]);
  const stampOpacity = interpolate(localFrame, [15, 17], [0, 0.9], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
          transform: `translateY(${translateY}px) rotate(-1deg)`,
          backgroundColor: '#EDE8DF',
          border: '2px solid #332F2C',
          borderRadius: 2,
          boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 0 40px rgba(100, 80, 50, 0.1)',
          padding: '28px 40px',
          maxWidth: 900,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Header Record */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '2px solid #332F2C',
            paddingBottom: 8,
            marginBottom: 16,
            fontFamily: 'Courier New, monospace',
            fontSize: 13,
            fontWeight: 800,
            color: '#332F2C',
          }}
        >
          <span>POLICE DEPARTMENT // BOOKING DESK</span>
          <span>CASE NO. #948-K</span>
        </div>

        {/* Primary Charge */}
        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 48,
            fontWeight: 900,
            color: '#1C1917',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          {callout.line1}
        </div>

        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Courier New, monospace',
              fontSize: 18,
              fontWeight: 800,
              color: '#57534E',
              marginTop: 10,
              textTransform: 'uppercase',
            }}
          >
            OFFENSE SPEC: {callout.line2}
          </div>
        )}

        {/* Matte Red Rubber Stamp */}
        {stampOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 40,
              bottom: 20,
              opacity: stampOpacity,
              transform: `scale(${stampScale}) rotate(-12deg)`,
              border: '4px solid #B91C1C',
              color: '#B91C1C',
              padding: '6px 20px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 900,
              fontSize: 26,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              mixBlendMode: 'multiply',
            }}
          >
            ARRESTED
          </div>
        )}
      </div>
    </div>
  );
};
