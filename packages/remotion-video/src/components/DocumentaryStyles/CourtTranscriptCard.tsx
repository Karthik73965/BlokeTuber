import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const CourtTranscriptCard: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
          backgroundColor: '#F7F5F0',
          border: '1px solid #D6D1C4',
          borderRadius: 2,
          boxShadow: '0 25px 60px rgba(0,0,0,0.8)',
          padding: '24px 36px',
          maxWidth: 900,
          width: '100%',
          display: 'flex',
          gap: 20,
        }}
      >
        {/* Left Court Reporter Line Numbers Rail */}
        <div
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 16,
            lineHeight: '28px',
            color: '#A8A29E',
            borderRight: '1px solid #D6D1C4',
            paddingRight: 14,
            userSelect: 'none',
            textAlign: 'right',
          }}
        >
          <div>01</div>
          <div>02</div>
          <div>03</div>
          <div>04</div>
        </div>

        {/* Deposition Content */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 12,
              fontWeight: 800,
              color: '#78716C',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              marginBottom: 10,
              borderBottom: '1px solid #E7E5E4',
              paddingBottom: 4,
            }}
          >
            OFFICIAL COURT TRANSCRIPT // {callout.line2 || 'DEPOSITION RECORD'}
          </div>

          <div
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 32,
              fontWeight: 800,
              color: '#1C1917',
              lineHeight: 1.25,
            }}
          >
            Q: {callout.line1}
          </div>
        </div>
      </div>
    </div>
  );
};
