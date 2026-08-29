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
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
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
          backgroundColor: '#09090B',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: 14,
          boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 30px rgba(6, 182, 212, 0.2)',
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
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: '#0e0e12',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span
              style={{
                backgroundColor: 'rgba(6, 182, 212, 0.15)',
                color: '#06B6D4',
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
                color: '#FFFFFF',
                margin: 0,
              }}
            >
              {title}
            </h3>
          </div>

          <button
            style={{
              background: 'transparent',
              border: 'none',
              color: '#A1A1AA',
              cursor: 'pointer',
              fontSize: 20,
              fontWeight: 700,
              padding: '4px 8px',
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
            padding: '12px 24px',
            backgroundColor: '#0e0e12',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 12,
            fontFamily: 'JetBrains Mono, monospace',
            color: '#71717A',
          }}
        >
          <span>
            Clips: {timeline?.clips?.length || 0} | Duration:{' '}
            {(durationInFrames / fps).toFixed(1)}s
          </span>
          <span style={{ color: '#F59E0B' }}>
            ⚡ Real-time React preview with animated callouts & Ken Burns
          </span>
        </div>
      </div>
    </div>
  );
};
