'use client';

import React, { useMemo } from 'react';
import { Player } from '@remotion/player';
import { DocumentaryVideo } from '@repo/remotion-video';
import { Timeline } from '@repo/shared';

interface RemotionPreviewModalProps {
  timeline: Timeline;
  title: string;
  onClose: () => void;
}

export const RemotionPreviewModal: React.FC<RemotionPreviewModalProps> = ({
  timeline,
  title,
  onClose,
}) => {
  const fps = 30;

  const durationInFrames = useMemo(() => {
    if (!timeline?.clips || timeline.clips.length === 0) return 300;
    let total = 0;
    for (const clip of timeline.clips) {
      const dur = Math.max(0.5, clip.endTime - clip.startTime);
      total += Math.max(15, Math.round(dur * fps));
    }
    return Math.max(30, total);
  }, [timeline, fps]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          maxWidth: 1100,
          width: '100%',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FAF9F6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                backgroundColor: '#FEF3C7',
                color: '#B45309',
                border: '1px solid #FDE68A',
                fontSize: 11,
                fontFamily: 'JetBrains Mono, monospace',
                padding: '4px 8px',
                borderRadius: 4,
                fontWeight: 700,
              }}
            >
              REMOTION LIVE PREVIEW
            </span>
            <h3
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 16,
                fontWeight: 700,
                color: '#0F172A',
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>

          <button
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 700,
              transition: 'all 0.15s ease',
            }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Player Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16 / 9',
            backgroundColor: '#000000',
          }}
        >
          <Player
            component={DocumentaryVideo}
            inputProps={{ timeline }}
            durationInFrames={durationInFrames}
            fps={fps}
            compositionWidth={1920}
            compositionHeight={1080}
            controls
            autoPlay
            loop
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </div>

        {/* Footer Info */}
        <div
          style={{
            padding: '14px 24px',
            backgroundColor: '#FAF9F6',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace',
            color: '#64748B',
          }}
        >
          <span>
            Clips: <strong>{timeline?.clips?.length || 0}</strong> • Duration:{' '}
            <strong>{(durationInFrames / fps).toFixed(1)}s</strong>
          </span>
          <span style={{ color: '#D97706', fontWeight: 600 }}>
            ⚡ Real-time React preview with animated documentary layouts & synced callouts
          </span>
        </div>
      </div>
    </div>
  );
};
