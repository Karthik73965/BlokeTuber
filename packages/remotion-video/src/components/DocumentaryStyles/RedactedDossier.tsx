import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const RedactedDossier: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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

  // Redaction bar slide/wipe reveal
  const redactionWipe = interpolate(localFrame, [12, 32], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Stamp Slam Animation
  const stampSpring = spring({
    frame: Math.max(0, localFrame - 18),
    fps,
    config: { damping: 20, stiffness: 80, mass: 1.2 },
  });
  const stampScale = interpolate(stampSpring, [0, 1], [1.8, 1]);
  const stampOpacity = interpolate(localFrame, [18, 20], [0, 0.85], {
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
          transform: `translateY(${translateY}px) rotate(0.6deg)`,
          backgroundColor: '#E5D6BA', // Manila folder cardstock
          border: '1px solid #C4B291',
          borderRadius: '0 8px 8px 8px',
          boxShadow:
            '0 24px 60px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.35), inset 0 0 30px rgba(130, 100, 60, 0.15)',
          padding: '24px 38px',
          maxWidth: 920,
          width: '100%',
          position: 'relative',
          overflow: 'visible',
        }}
      >
        {/* Manila Folder Tab Top-Left */}
        <div
          style={{
            position: 'absolute',
            top: -24,
            left: 0,
            backgroundColor: '#E5D6BA',
            border: '1px solid #C4B291',
            borderBottom: 'none',
            borderRadius: '6px 6px 0 0',
            padding: '4px 18px',
            fontSize: 11,
            fontFamily: '"Courier New", Courier, monospace',
            fontWeight: 800,
            color: '#443A2B',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
          }}
        >
          CONFIDENTIAL CASE FILE #709-A
        </div>

        {/* Header Metadata */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            borderBottom: '1px solid #C4B291',
            paddingBottom: 8,
            marginBottom: 16,
            fontSize: 12,
            fontFamily: '"Courier New", Courier, monospace',
            color: '#665642',
            fontWeight: 700,
          }}
        >
          <span>SUBJECT: {callout.line2 ? callout.line2.toUpperCase() : 'OFFICIAL INVESTIGATION'}</span>
          <span>SECURITY LEVEL: RESTRICTED</span>
        </div>

        {/* Primary Evidence Line with Redaction Reveal */}
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 42,
              fontWeight: 900,
              color: '#1C1917',
              lineHeight: 1.25,
              letterSpacing: '-0.01em',
            }}
          >
            {callout.line1}
          </div>

          {/* Black Redaction Bar that pulls back */}
          {redactionWipe > 0.01 && (
            <div
              style={{
                position: 'absolute',
                top: -2,
                left: -4,
                width: `${redactionWipe * 105}%`,
                bottom: -2,
                backgroundColor: '#111111',
                borderRadius: 2,
              }}
            />
          )}
        </div>

        {/* Matte Red Ink Rubber Stamp */}
        {stampOpacity > 0 && (
          <div
            style={{
              position: 'absolute',
              right: 32,
              bottom: 18,
              opacity: stampOpacity,
              transform: `scale(${stampScale}) rotate(-14deg)`,
              border: '3px solid #B91C1C',
              color: '#B91C1C',
              padding: '6px 16px',
              fontFamily: 'Arial, sans-serif',
              fontWeight: 900,
              fontSize: 22,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              mixBlendMode: 'multiply',
              borderRadius: 4,
            }}
          >
            DECLASSIFIED
          </div>
        )}
      </div>
    </div>
  );
};
