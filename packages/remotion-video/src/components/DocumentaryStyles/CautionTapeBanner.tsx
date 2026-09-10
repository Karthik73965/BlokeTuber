import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const CautionTapeBanner: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
  const scale = interpolate(enterSpring, [0, 1], [1.1, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        transform: `scale(${scale})`,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          width: '120%',
          backgroundColor: '#FACC15', // Authentic Police Caution Yellow
          backgroundImage:
            'repeating-linear-gradient(-45deg, #EAB308, #EAB308 30px, #FACC15 30px, #FACC15 60px)',
          borderTop: '5px solid #000000',
          borderBottom: '5px solid #000000',
          boxShadow: '0 25px 50px rgba(0,0,0,0.85)',
          transform: 'rotate(-2.5deg)',
          padding: '16px 0',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontFamily: 'Arial Black, Impact, sans-serif',
            fontSize: 54,
            fontWeight: 900,
            color: '#000000',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1,
            textShadow: '0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          ⚠️ {callout.line1} ⚠️
        </div>
      </div>
    </div>
  );
};
