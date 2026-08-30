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

  const isImage =
    clip.mediaType === 'image' ||
    (clip.clipPath && /\.(jpg|jpeg|png|webp|avif|svg)$/i.test(clip.clipPath)) ||
    !clip.clipPath;

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;

  // Hero Video Ken Burns motion
  const heroScale = interpolate(progress, [0, 1], [1.0, 1.05]);
  const totalSeconds = Math.floor(frame / fps);
  const secondsMod = String(totalSeconds % 60).padStart(2, '0');

  const contextSrc = clip.additionalClipPaths?.[0] || clip.clipPath;

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
            }}
          >
            {contextSrc && (
              <img src={contextSrc} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            )}
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
