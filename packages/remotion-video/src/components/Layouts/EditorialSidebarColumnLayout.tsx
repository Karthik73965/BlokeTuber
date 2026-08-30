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

export const EditorialSidebarColumnLayout: React.FC<LayoutProps> = ({
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

  // Hero Video Ken Burns motion
  const heroScale = interpolate(progress, [0, 1], [1.0, 1.05]);
  const totalSeconds = Math.floor(frame / fps);
  const secondsMod = String(totalSeconds % 60).padStart(2, '0');

  const contextSrc = clip.additionalClipPaths?.[0] || clip.secondaryClipPath || null;
  const isContextImage =
    clip.secondaryMediaType === 'image' ||
    isMediaImage(contextSrc, true);

  const dossierTitle = clip.layoutData?.title || clip.callout?.line1?.toUpperCase() || 'INVESTIGATIVE DOSSIER';
  const surveillanceLabel = clip.layoutData?.tag || 'PRIMARY EVIDENCE';
  const coordsLabel = clip.layoutData?.coords || (clip.callout?.line2 ? clip.callout.line2.toUpperCase() : 'CASE ARCHIVE RECORD');
  const secondaryContextTag = clip.layoutData?.subtitle || 'SECONDARY CONTEXT // REF-A';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#09090B',
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      {/* ── LEFT COLUMN: 72% LARGE HERO VIDEO ──────────────────────── */}
      <div
        style={{
          flex: '0 0 72%',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#000000',
          borderRight: '3px solid #27272A',
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
                transform: `scale(${heroScale}) translateZ(0)`,
                willChange: 'transform',
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
                transform: `scale(${heroScale}) translateZ(0)`,
                willChange: 'transform',
                filter: 'contrast(1.06) saturate(1.05)',
              }}
            />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#141418' }} />
        )}

        {/* Letterbox matte bars */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 36,
            backgroundColor: '#000000',
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 36,
            backgroundColor: '#000000',
            zIndex: 10,
          }}
        />
      </div>

      {/* ── RIGHT COLUMN: 28% EDITORIAL DATA RAIL ──────────────────── */}
      <div
        style={{
          flex: '0 0 28%',
          height: '100%',
          backgroundColor: '#F5F2EB', // Clean warm ivory editorial background
          borderLeft: '1px solid #E2DCCE',
          padding: '40px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: 'inset 4px 0 16px rgba(0,0,0,0.06)',
          zIndex: 20,
        }}
      >
        {/* Top Header & Publication Masthead */}
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: '2px solid #1C1917',
              paddingBottom: 10,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                backgroundColor: '#D97706',
                borderRadius: '50%',
              }}
            />
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 900,
                color: '#1C1917',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {dossierTitle}
            </span>
          </div>

          {/* Timeline Timestamp Rail */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#D97706',
                }}
              >
                00:{secondsMod}:14
              </span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#D97706' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#44403C' }}>
                {surveillanceLabel}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span
                style={{
                  fontFamily: '"Courier New", Courier, monospace',
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#A8A29E',
                }}
              >
                LOC
              </span>
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#A8A29E' }} />
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 700, color: '#78716C' }}>
                {coordsLabel}
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Context Micro-Thumbnail Window */}
        <div>
          <div
            style={{
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 11,
              fontWeight: 800,
              color: '#78716C',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              marginBottom: 8,
            }}
          >
            {secondaryContextTag}
          </div>
          <div
            style={{
              width: '100%',
              height: 180,
              backgroundColor: '#1E1E24',
              borderRadius: 4,
              border: '1px solid #D5CEBF',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              position: 'relative',
            }}
          >
            {contextSrc ? (
              isContextImage ? (
                <img
                  src={contextSrc}
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
                  src={contextSrc}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.06) saturate(1.05)',
                  }}
                />
              )
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#1C1917',
                  backgroundImage:
                    'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 8px), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 8px)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 16,
                  position: 'relative',
                  border: '1px dashed #44403C',
                }}
              >
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#A8A29E" strokeWidth="1.5">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
                  <path d="M6 6h10M6 10h10M6 14h6" />
                </svg>
                <span
                  style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    fontSize: 9,
                    fontWeight: 800,
                    color: '#A8A29E',
                    letterSpacing: '0.12em',
                    marginTop: 8,
                    textTransform: 'uppercase',
                    textAlign: 'center',
                  }}
                >
                  ARCHIVAL RECORD // REF-A
                </span>
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 8,
                    fontWeight: 600,
                    color: '#78716C',
                    marginTop: 2,
                  }}
                >
                  PHOTOGRAPHIC EXHIBIT
                </span>
              </div>
            )}
            {/* Corner Microfiche Stamp */}
            <div
              style={{
                position: 'absolute',
                top: 6,
                right: 8,
                backgroundColor: 'rgba(0,0,0,0.65)',
                padding: '2px 6px',
                borderRadius: 2,
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: 8,
                fontWeight: 900,
                color: '#F59E0B',
                letterSpacing: '0.08em',
                pointerEvents: 'none',
              }}
            >
              FIG. 01
            </div>
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
