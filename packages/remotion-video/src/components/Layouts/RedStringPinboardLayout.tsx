import React from 'react';
import { interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineClip } from '../../types';
import { CalloutDispatcher } from '../Callouts/CalloutDispatcher';

export interface LayoutProps {
  clip: TimelineClip;
  clipIndex: number;
  durationInFrames: number;
  durationInSeconds: number;
}

export const RedStringPinboardLayout: React.FC<LayoutProps> = ({
  clip,
  clipIndex,
  durationInFrames,
  durationInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // 3D Camera Swoop
  const camScale = interpolate(progress, [0, 1], [0.92, 1.08]);
  const camRotateX = interpolate(progress, [0, 1], [12, 4]);
  const camRotateY = interpolate(progress, [0, 1], [-10, -2]);
  const camTranslateX = interpolate(progress, [0, 1], [-40, 20]);
  const camTranslateY = interpolate(progress, [0, 1], [20, -10]);

  const clueSrcA = clip.additionalClipPaths?.[0] || clip.clipPath;
  const clueSrcB = clip.additionalClipPaths?.[1] || clip.clipPath;
  const heroSrc = clip.clipPath;

  const renderSlotMedia = (src: string | null | undefined, isHero = false) => {
    if (!src) return <div style={{ width: '100%', height: '100%', backgroundColor: '#18181B' }} />;
    const isImg = clip.mediaType === 'image' || /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(src);

    return isImg ? (
      <img
        src={src}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: isHero ? 'contrast(1.06) saturate(1.05)' : 'contrast(1.02) saturate(0.85) brightness(0.9)',
        }}
      />
    ) : (
      <OffthreadVideo
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: isHero ? 'contrast(1.06) saturate(1.05)' : 'contrast(1.02) saturate(0.85) brightness(0.9)',
        }}
      />
    );
  };

  const defaultNotes = ['EXHIBIT A // CLUE', 'LOCATION RECORD', 'PRIMARY EVIDENCE'];
  const notes = clip.layoutData?.notes || defaultNotes;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#EAE0D0', // Light blonde corkboard
        backgroundImage:
          'radial-gradient(#D6C8B2 20%, transparent 20%), radial-gradient(#D6C8B2 20%, transparent 20%)',
        backgroundSize: '16px 16px',
        backgroundPosition: '0 0, 8px 8px',
        overflow: 'hidden',
        perspective: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── 3D SPATIAL PINBOARD CANVAS ─────────────────────────────── */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translateX(${camTranslateX}px) translateY(${camTranslateY}px) scale(${camScale}) rotateX(${camRotateX}deg) rotateY(${camRotateY}deg)`,
          position: 'relative',
        }}
      >
        {/* SVG CONNECTING RED STRINGS LAYER */}
        <svg
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 15,
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.25))',
          }}
        >
          {/* String from Photo A to Hero Photo */}
          <line x1="380" y1="240" x2="880" y2="460" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
          {/* String from Photo B to Hero Photo */}
          <line x1="420" y1="780" x2="880" y2="460" stroke="#DC2626" strokeWidth="4" strokeLinecap="round" />
          {/* String from Photo A to Photo B */}
          <line x1="380" y1="240" x2="420" y2="780" stroke="#B91C1C" strokeWidth="2.5" strokeDasharray="6,6" opacity={0.7} />
        </svg>

        {/* SECONDARY NODE A (Top-Left Clue Photo) */}
        <div
          style={{
            position: 'absolute',
            top: 140,
            left: 200,
            width: 280,
            height: 220,
            backgroundColor: '#FAF7F2',
            padding: '10px 10px 28px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
            transform: 'rotate(-4deg)',
            zIndex: 10,
            overflow: 'hidden',
          }}
        >
          {/* Red Push Pin */}
          <div
            style={{
              position: 'absolute',
              top: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#DC2626',
              border: '2px solid #FEF2F2',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              zIndex: 20,
            }}
          />
          <div style={{ width: '100%', height: 165, overflow: 'hidden' }}>
            {renderSlotMedia(clueSrcA)}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 800, color: '#44403C', marginTop: 4, textTransform: 'uppercase' }}>
            {notes[0] || defaultNotes[0]}
          </div>
        </div>

        {/* SECONDARY NODE B (Bottom-Left Location Card) */}
        <div
          style={{
            position: 'absolute',
            bottom: 120,
            left: 240,
            width: 260,
            height: 210,
            backgroundColor: '#FAF7F2',
            padding: '10px 10px 28px',
            boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
            transform: 'rotate(5deg)',
            zIndex: 10,
            overflow: 'hidden',
          }}
        >
          {/* Red Push Pin */}
          <div
            style={{
              position: 'absolute',
              top: 4,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 16,
              height: 16,
              borderRadius: '50%',
              backgroundColor: '#DC2626',
              border: '2px solid #FEF2F2',
              boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
              zIndex: 20,
            }}
          />
          <div style={{ width: '100%', height: 155, overflow: 'hidden' }}>
            {renderSlotMedia(clueSrcB)}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 800, color: '#44403C', marginTop: 4, textTransform: 'uppercase' }}>
            {notes[1] || defaultNotes[1]}
          </div>
        </div>

        {/* PRIMARY HERO EVIDENCE PHOTO */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 220,
            transform: 'translateY(-50%) rotate(1.2deg)',
            width: 780,
            height: 570,
            backgroundColor: '#FAF7F2',
            padding: '16px 16px 36px',
            boxShadow: '0 30px 80px rgba(0,0,0,0.22), 0 6px 16px rgba(0,0,0,0.1)',
            zIndex: 20,
            overflow: 'hidden',
          }}
        >
          {/* Hero Push Pin Center-Top */}
          <div
            style={{
              position: 'absolute',
              top: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: '#DC2626',
              border: '3px solid #FEF2F2',
              boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
              zIndex: 30,
            }}
          />

          <div
            style={{
              width: '100%',
              height: '92%',
              backgroundColor: '#1E1E24',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {renderSlotMedia(heroSrc, true)}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 800, color: '#1C1917', marginTop: 6, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            {notes[2] || clip.callout?.line1?.toUpperCase() || defaultNotes[2]}
          </div>
        </div>
      </div>

      {/* ── OVERLAY CALLOUT LAYER ───────────────────────────────────── */}
      <CalloutDispatcher
        callout={clip.callout}
        numberOverlays={clip.numberOverlays}
        clipDurationInSeconds={durationInSeconds}
      />
    </div>
  );
};
