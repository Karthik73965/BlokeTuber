import React from 'react';
import { Img, interpolate, OffthreadVideo, useCurrentFrame, useVideoConfig } from 'remotion';
import { TimelineClip } from '../../types';
import { CalloutDispatcher } from '../Callouts/CalloutDispatcher';

export interface LayoutProps {
  clip: TimelineClip;
  clipIndex: number;
  durationInFrames: number;
  durationInSeconds: number;
}

export const FilmstripSpoolReelLayout: React.FC<LayoutProps> = ({
  clip,
  clipIndex,
  durationInFrames,
  durationInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isImage =
    clip.mediaType === 'image' ||
    (clip.clipPath && /\.(jpg|jpeg|png|webp|avif)$/i.test(clip.clipPath)) ||
    !clip.clipPath;

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // Continuous horizontal track camera glide
  const filmTranslateX = interpolate(progress, [0, 1], [60, -60]);
  const heroScale = interpolate(progress, [0, 1], [1.0, 1.04]);

  const sprockets = Array.from({ length: 32 });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#F5F2EB', // Warm ivory studio paper backdrop
        backgroundImage:
          'radial-gradient(ellipse at 50% 40%, #FAF8F5 0%, #E8E2D5 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* ── 35mm HORIZONTAL FILMSTRIP RIBBON ───────────────────────── */}
      <div
        style={{
          width: '125%',
          height: 680,
          backgroundColor: '#18181B', // Celluloid film negative strip
          borderTop: '3px solid #3F3F46',
          borderBottom: '3px solid #3F3F46',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35), 0 6px 20px rgba(0,0,0,0.15)',
          transform: `translateX(${filmTranslateX}px)`,
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '14px 0',
        }}
      >
        {/* TOP SPROCKET PERFORATIONS & FRAME NUMBERS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 20px',
          }}
        >
          {sprockets.map((_, i) => (
            <div key={`sprock_t_${i}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <div
                style={{
                  width: 16,
                  height: 22,
                  backgroundColor: '#000000',
                  borderRadius: 3,
                  border: '1px solid #3F3F46',
                }}
              />
              {i % 4 === 0 && (
                <span
                  style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 9,
                    fontWeight: 900,
                    color: '#F59E0B',
                    letterSpacing: '0.1em',
                  }}
                >
                  KODAK 400 • {i + 10}A
                </span>
              )}
            </div>
          ))}
        </div>

        {/* FILM FRAMES ROW (Previous Preview + CENTER HERO + Next Preview) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 50,
            flex: 1,
            padding: '10px 0',
          }}
        >
          {/* Previous Frame */}
          <div
            style={{
              width: 320,
              height: '88%',
              backgroundColor: '#27272A',
              border: '2px solid #3F3F46',
              borderRadius: 4,
              opacity: 0.4,
              filter: 'blur(2px)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          />

          {/* CENTER HERO FILM FRAME */}
          <div
            style={{
              width: 860,
              height: '96%',
              backgroundColor: '#1E1E24',
              border: '3px solid #71717A',
              borderRadius: 6,
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.5)',
              overflow: 'hidden',
              position: 'relative',
              flexShrink: 0,
              transform: `scale(${heroScale})`,
            }}
          >
            {clip.clipPath ? (
              isImage ? (
                <Img
                  src={clip.clipPath}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.06) saturate(1.06)',
                  }}
                />
              ) : (
                <OffthreadVideo
                  src={clip.clipPath}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.06) saturate(1.06)',
                  }}
                />
              )
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#141418' }} />
            )}

            {/* Subtle Film Grain inside aperture */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                boxShadow: 'inset 0 0 30px rgba(0,0,0,0.6)',
                pointerEvents: 'none',
              }}
            />
          </div>

          {/* Next Frame */}
          <div
            style={{
              width: 320,
              height: '88%',
              backgroundColor: '#27272A',
              border: '2px solid #3F3F46',
              borderRadius: 4,
              opacity: 0.4,
              filter: 'blur(2px)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          />
        </div>

        {/* BOTTOM SPROCKET PERFORATIONS */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            padding: '0 20px',
          }}
        >
          {sprockets.map((_, i) => (
            <div
              key={`sprock_b_${i}`}
              style={{
                width: 16,
                height: 22,
                backgroundColor: '#000000',
                borderRadius: 3,
                border: '1px solid #3F3F46',
              }}
            />
          ))}
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
