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

export const QuadSurveillanceMatrixLayout: React.FC<LayoutProps> = ({
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
  const matrixScale = interpolate(progress, [0, 1], [0.99, 1.02]);

  const cams = [
    { id: 'CAM 01', loc: 'PERIMETER NORTH' },
    { id: 'CAM 02', loc: 'PRIMARY ROADWAY' },
    { id: 'CAM 03', loc: 'STRUCTURE REAR' },
    { id: 'CAM 04', loc: 'OVERHEAD DRONE' },
  ];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#E5EAF0', // Bright technical forensic background
        padding: '30px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: 14,
        overflow: 'hidden',
        transform: `scale(${matrixScale})`,
      }}
    >
      {cams.map((cam, idx) => (
        <div
          key={cam.id}
          style={{
            backgroundColor: '#18181B',
            borderRadius: 4,
            border: '2px solid #64748B',
            boxShadow: '0 10px 25px rgba(15, 23, 42, 0.15)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Active footage rendered in Primary Cam 01 */}
          {idx === 0 && clip.clipPath ? (
            isImage ? (
              <Img
                src={clip.clipPath}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <OffthreadVideo
                src={clip.clipPath}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            )
          ) : (
            <div style={{ width: '100%', height: '100%', backgroundColor: '#141418' }} />
          )}

          {/* Camera ID OSD Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 10,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.75)',
              padding: '2px 8px',
              borderRadius: 2,
              fontFamily: '"Courier New", Courier, monospace',
              fontSize: 11,
              fontWeight: 800,
              color: '#38BDF8',
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span>{cam.id} // {cam.loc}</span>
          </div>
        </div>
      ))}

      {/* ── OVERLAY CALLOUT LAYER ───────────────────────────────────── */}
      <CalloutDispatcher
        callout={clip.callout}
        numberOverlays={clip.numberOverlays}
        clipDurationInSeconds={durationInSeconds}
      />
    </div>
  );
};
