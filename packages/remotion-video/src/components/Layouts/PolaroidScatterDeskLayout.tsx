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

export const PolaroidScatterDeskLayout: React.FC<LayoutProps> = ({
  clip,
  clipIndex,
  durationInFrames,
  durationInSeconds,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const isMediaImage = (src: string | null | undefined, fallback = true): boolean => {
    if (!src) return fallback;
    const clean = src.toLowerCase().split('?')[0] || '';
    if (/\.(mp4|webm|mov|mkv|avi|m4v)$/i.test(clean) || /\.(mp4|webm|mov|mkv|avi|m4v)/i.test(src.toLowerCase())) {
      return false;
    }
    if (/\.(jpg|jpeg|png|webp|avif|svg|gif|bmp)$/i.test(clean) || /\.(jpg|jpeg|png|webp|avif|svg|gif|bmp)/i.test(src.toLowerCase()) || src.startsWith('data:image/')) {
      return true;
    }
    return fallback;
  };

  const isImage =
    clip.mediaType === 'image' ||
    isMediaImage(clip.clipPath, true);

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // Smooth camera glide over sunny tabletop
  const camScale = interpolate(progress, [0, 1], [0.94, 1.05]);
  const camTranslateY = interpolate(progress, [0, 1], [20, -10]);
  const camTranslateX = interpolate(progress, [0, 1], [-30, 20]);

  const photo1 = clip.additionalClipPaths?.[0] || clip.secondaryClipPath || null;
  const photo2 = clip.additionalClipPaths?.[1] || null;

  const renderSlotMedia = (src: string | null | undefined, fallbackBg = '#27272A') => {
    if (!src) return <div style={{ width: '100%', height: '100%', backgroundColor: fallbackBg }} />;
    const isImg = isMediaImage(src, true);
    return isImg ? (
      <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <OffthreadVideo src={src} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    );
  };

  const defaultNotes = ['EXHIBIT A // EVIDENCE', 'SCENE ARCHIVE', 'PRIMARY RECORD'];
  const notes = clip.layoutData?.notes || defaultNotes;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#EAE1D2', // Bright Scandinavian blonde oak wood desk
        backgroundImage:
          'radial-gradient(ellipse at 50% 30%, #F5EDE0 0%, #D8CBBB 100%)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: `translateX(${camTranslateX}px) translateY(${camTranslateY}px) scale(${camScale})`,
          position: 'relative',
        }}
      >
        {/* SCATTERED POLAROID 1 (Top-Left) */}
        <div
          style={{
            position: 'absolute',
            top: 100,
            left: 180,
            width: 320,
            backgroundColor: '#FAF8F5',
            padding: '12px 12px 28px',
            borderRadius: 2,
            boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
            transform: 'rotate(-9deg)',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '100%', height: 200, backgroundColor: '#27272A', overflow: 'hidden' }}>
            {renderSlotMedia(photo1)}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: '#44403C', marginTop: 6, textTransform: 'uppercase' }}>
            {notes[0] || defaultNotes[0]}
          </div>
        </div>

        {/* SCATTERED POLAROID 2 (Bottom-Left) */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: 260,
            width: 300,
            backgroundColor: '#FAF8F5',
            padding: '12px 12px 28px',
            borderRadius: 2,
            boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
            transform: 'rotate(11deg)',
            overflow: 'hidden',
          }}
        >
          <div style={{ width: '100%', height: 190, backgroundColor: '#27272A', overflow: 'hidden' }}>
            {renderSlotMedia(photo2)}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 700, color: '#44403C', marginTop: 6, textTransform: 'uppercase' }}>
            {notes[1] || defaultNotes[1]}
          </div>
        </div>

        {/* PRIMARY HERO POLAROID (Large Center-Right, Focus Target) */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            right: 200,
            transform: 'translateY(-50%) rotate(2deg)',
            width: 820,
            backgroundColor: '#FAF8F5',
            padding: '16px 16px 44px',
            borderRadius: 3,
            boxShadow: '0 35px 90px rgba(40, 30, 20, 0.25), 0 6px 16px rgba(0,0,0,0.08)',
            zIndex: 10,
          }}
        >
          {/* Media Window */}
          <div
            style={{
              width: '100%',
              height: 480,
              backgroundColor: '#1E1E24',
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {clip.clipPath ? (
              isImage ? (
                <img
                  src={clip.clipPath}
                  alt=""
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.06) saturate(1.05)',
                  }}
                />
              ) : (
                <OffthreadVideo
                  src={clip.clipPath}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.06) saturate(1.05)',
                  }}
                />
              )
            ) : (
              <div style={{ width: '100%', height: '100%', backgroundColor: '#18181B' }} />
            )}
          </div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, fontWeight: 800, color: '#1C1917', marginTop: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
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
