import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const FullScreenChapterTitle: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
    config: { damping: 16, stiffness: 80, mass: 1.0 },
  });

  const exitFrames = 10;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const scale = interpolate(enterSpring, [0, 1], [0.96, 1]);

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          textAlign: 'center',
          maxWidth: 1200,
          padding: '0 40px',
        }}
      >
        {callout.line2 && (
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 24,
              fontStyle: 'italic',
              color: '#D97706',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: 16,
            }}
          >
            {callout.line2}
          </div>
        )}

        <div
          style={{
            fontFamily: 'Georgia, "Times New Roman", serif',
            fontSize: 78,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            lineHeight: 1.1,
          }}
        >
          {callout.line1}
        </div>

        <div
          style={{
            width: 120,
            height: 3,
            backgroundColor: '#D97706',
            margin: '24px auto 0',
          }}
        />
      </div>
    </div>
  );
};
