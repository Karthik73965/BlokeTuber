import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const RedditThreadCard: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
          backgroundColor: '#1A1A1B',
          border: '1px solid #343536',
          borderRadius: 8,
          padding: '24px 32px',
          maxWidth: 860,
          width: '100%',
          boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
        }}
      >
        {/* Header row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              backgroundColor: '#FF4500',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              color: '#FFFFFF',
              fontSize: 14,
            }}
          >
            r/
          </div>
          <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, fontWeight: 800, color: '#D7DADC' }}>
            r/{callout.line2 ? callout.line2.toLowerCase().replace(/\s+/g, '') : 'investigation'}
          </span>
          <span style={{ color: '#818384', fontSize: 13 }}>• Posted by eyewitness</span>
        </div>

        {/* Post title / quote */}
        <div
          style={{
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 34,
            fontWeight: 700,
            color: '#D7DADC',
            lineHeight: 1.25,
          }}
        >
          {callout.line1}
        </div>

        {/* Vote Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 16,
            paddingTop: 12,
            borderTop: '1px solid #343536',
            color: '#818384',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            fontWeight: 700,
          }}
        >
          <span style={{ color: '#FF4500' }}>▲ 2.4k upvotes</span>
          <span>💬 418 comments</span>
          <span>🔗 Share</span>
        </div>
      </div>
    </div>
  );
};
