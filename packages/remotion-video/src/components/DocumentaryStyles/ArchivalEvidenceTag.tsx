import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const ArchivalEvidenceTag: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
    config: { damping: 14, stiffness: 100, mass: 0.9 },
  });

  const exitFrames = 8;
  const exitProgress = interpolate(
    localFrame,
    [totalHoldFrames - exitFrames, totalHoldFrames],
    [1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const opacity = enterSpring * exitProgress;
  const translateY = interpolate(enterSpring, [0, 1], [-40, 0]);
  const rotate = interpolate(enterSpring, [0, 1], [-3, -1.2]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 60,
        right: 80,
        opacity,
        transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
        pointerEvents: 'none',
        zIndex: 50,
      }}
    >
      <div
        style={{
          backgroundColor: '#E8E1D5', // Authentic kraft/cardstock evidence tag
          border: '1px solid #C4BAA9',
          borderRadius: '14px 14px 4px 4px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          padding: '24px 28px 20px',
          maxWidth: 380,
          position: 'relative',
        }}
      >
        {/* Metal Grommet / Hole at Top */}
        <div
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 14,
            height: 14,
            borderRadius: '50%',
            backgroundColor: '#1E1E24',
            border: '2px solid #A8A29E',
          }}
        />

        {/* Exhibit Stamped Header */}
        <div
          style={{
            marginTop: 10,
            borderBottom: '2px solid #292524',
            paddingBottom: 4,
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Courier New, monospace',
            fontSize: 12,
            fontWeight: 800,
            color: '#44403C',
          }}
        >
          <span>EVIDENCE TAG</span>
          <span>{callout.line2 ? callout.line2.toUpperCase() : 'EXHIBIT A'}</span>
        </div>

        {/* Primary Evidence Description */}
        <div
          style={{
            marginTop: 10,
            fontFamily: 'Courier New, monospace',
            fontSize: 22,
            fontWeight: 800,
            color: '#1C1917',
            lineHeight: 1.2,
          }}
        >
          {callout.line1}
        </div>
      </div>
    </div>
  );
};
