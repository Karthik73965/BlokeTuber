import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const TypewriterPaper: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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
    config: { damping: 15, stiffness: 100, mass: 0.8 },
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

  // Character-by-character typewriter reveal
  const fullText = callout.line1;
  const charsCount = fullText.length;
  const typingStart = 6;
  const typingDuration = Math.min(30, charsCount * 2);
  const visibleCharsCount = Math.floor(
    interpolate(localFrame, [typingStart, typingStart + typingDuration], [0, charsCount], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    })
  );

  const displayText = fullText.slice(0, visibleCharsCount);
  const showCursor = localFrame % 14 < 7 && localFrame < typingStart + typingDuration + 30;

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
          transform: `translateY(${translateY}px) rotate(-0.5deg)`,
          backgroundColor: '#F3EFE6', // Vintage mechanical typewriter card
          border: '1px solid #D5CEBF',
          boxShadow: '0 24px 60px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.3)',
          padding: '32px 48px',
          maxWidth: 920,
          width: '100%',
          position: 'relative',
        }}
      >
        {/* Red ribbon line at top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            backgroundColor: '#DC2626',
          }}
        />

        {callout.line2 && (
          <div
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 14,
              fontWeight: 700,
              color: '#78716C',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              marginBottom: 12,
            }}
          >
            RECORD ENTRY // {callout.line2}
          </div>
        )}

        {/* Typed text */}
        <div
          style={{
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: 44,
            fontWeight: 800,
            color: '#1C1917',
            lineHeight: 1.2,
            letterSpacing: '0.02em',
          }}
        >
          <span>{displayText}</span>
          {showCursor && (
            <span
              style={{
                display: 'inline-block',
                width: 14,
                height: 38,
                backgroundColor: '#DC2626',
                marginLeft: 4,
                verticalAlign: 'middle',
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
