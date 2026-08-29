import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const SocialTweetCard: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
    config: { damping: 14, stiffness: 110, mass: 0.8 },
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
          backgroundColor: '#000000',
          border: '1px solid #2F3336',
          borderRadius: 12,
          padding: '24px 32px',
          maxWidth: 820,
          width: '100%',
          boxShadow: '0 24px 60px rgba(0,0,0,0.9)',
        }}
      >
        {/* User profile row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#27272A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#FFFFFF',
              fontSize: 18,
            }}
          >
            {callout.line2 ? callout.line2.slice(0, 2).toUpperCase() : 'US'}
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#FFFFFF',
                }}
              >
                {callout.line2 || 'Verified Reporter'}
              </span>
              <span style={{ color: '#1D9BF0', fontSize: 16 }}>✓</span>
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#71767B' }}>
              @{callout.line2 ? callout.line2.toLowerCase().replace(/\s+/g, '') : 'investigation'}
            </div>
          </div>
        </div>

        {/* Tweet content */}
        <div
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 32,
            fontWeight: 500,
            color: '#E7E9EA',
            lineHeight: 1.3,
          }}
        >
          {callout.line1}
        </div>

        {/* Timestamp */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 10,
            borderTop: '1px solid #2F3336',
            fontFamily: 'Inter, sans-serif',
            fontSize: 13,
            color: '#71767B',
          }}
        >
          Public Post Archive • Verified Statement
        </div>
      </div>
    </div>
  );
};
