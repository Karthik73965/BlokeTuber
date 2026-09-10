import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { CalloutOverlay } from '../../types';

export interface StyleProps {
  callout: CalloutOverlay;
  clipDurationInSeconds: number;
}

export const NewspaperHeadline: React.FC<StyleProps> = ({ callout, clipDurationInSeconds }) => {
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

  // Paper card entrance physics
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
  const rotate = interpolate(enterSpring, [0, 1], [-2.5, -0.8]);

  // Highlighter sweep animation (starts slightly after card lands)
  const highlightStartFrame = 10;
  const highlightDuration = 22;
  const highlightProgress = interpolate(
    localFrame,
    [highlightStartFrame, highlightStartFrame + highlightDuration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

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
          transform: `translateY(${translateY}px) rotate(${rotate}deg)`,
          backgroundColor: '#F7F4EC', // Authentic warm aged newsprint
          backgroundImage:
            'radial-gradient(#E8E2D5 15%, transparent 16%), radial-gradient(#E8E2D5 15%, transparent 16%)',
          backgroundSize: '12px 12px',
          backgroundPosition: '0 0, 6px 6px',
          color: '#1C1917',
          padding: '24px 36px 28px',
          maxWidth: 960,
          width: '100%',
          boxShadow:
            '0 25px 60px rgba(0,0,0,0.7), 0 4px 12px rgba(0,0,0,0.4), inset 0 0 40px rgba(180, 160, 130, 0.25)',
          border: '1px solid #D6CEBE',
          borderRadius: 2,
          position: 'relative',
        }}
      >
        {/* Paper Masthead Header */}
        <div
          style={{
            borderBottom: '2px solid #292524',
            paddingBottom: 8,
            marginBottom: 16,
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 11,
              fontFamily: 'Georgia, serif',
              color: '#78716C',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: 4,
              borderBottom: '1px solid #D6CEBE',
              paddingBottom: 3,
            }}
          >
            <span>CITY DESK SPECIAL</span>
            <span>{callout.line2 ? callout.line2.toUpperCase() : 'INVESTIGATIVE ARCHIVE'}</span>
            <span>LATE EDITION</span>
          </div>

          <div
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 32,
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: '#1C1917',
              lineHeight: 1,
            }}
          >
            The Daily Chronicle
          </div>
        </div>

        {/* Headline with Live Animated Highlighter Stroke */}
        <div style={{ position: 'relative', display: 'inline-block', width: '100%' }}>
          <div
            style={{
              position: 'relative',
              zIndex: 2,
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontSize: 48,
              fontWeight: 900,
              color: '#1C1917',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            {callout.line1}
          </div>

          {/* Yellow Marker Highlighter Stroke Layer */}
          <div
            style={{
              position: 'absolute',
              top: '8%',
              left: -8,
              right: -8,
              bottom: '4%',
              zIndex: 1,
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                width: `${highlightProgress * 100}%`,
                height: '100%',
                backgroundColor: '#FFE600',
                opacity: 0.55,
                mixBlendMode: 'multiply',
                borderRadius: 4,
                transform: 'rotate(-0.5deg)',
                boxShadow: 'inset 0 1px 4px rgba(230, 200, 0, 0.4)',
              }}
            />
          </div>
        </div>

        {/* Small Column Footer */}
        <div
          style={{
            marginTop: 14,
            paddingTop: 8,
            borderTop: '1px solid #D6CEBE',
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 12,
            fontFamily: 'Georgia, serif',
            color: '#57534E',
            fontStyle: 'italic',
          }}
        >
          <span>Page A-1 • Continued on Back</span>
          <span>Official Public Record</span>
        </div>
      </div>
    </div>
  );
};
