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

export const FullBleedCinematicLayout: React.FC<LayoutProps> = ({
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

  // A full-bleed clip must stay pixel-stable unless it explicitly asks for a
  // Ken Burns move. Applying a new zoom to every clip caused a visible jump
  // back to 100% on each hard cut.
  const isWatermarkHide = Boolean(clip.hideWatermark || clip.watermarkCrop);
  const baseScale = clip.watermarkCrop?.scale ?? (isWatermarkHide ? 1.26 : 1.0);
  const transformOrigin = isWatermarkHide ? 'center top' : 'center center';

  const progress = durationInFrames > 0 ? frame / durationInFrames : 0;
  const currentScale = clip.kenBurns
    ? interpolate(progress, [0, 1], [baseScale, baseScale * 1.05])
    : baseScale;

  const transformStyle =
    currentScale !== 1
      ? `scale(${currentScale})`
      : 'none';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: '#000000',
        overflow: 'hidden',
      }}
    >
      {/* ── FULL BLEED MEDIA VIEWPORT ───────────────────────────────── */}
      <div
        style={{
          width: '100%',
          height: '100%',
          transform: transformStyle,
          transformOrigin,
          position: 'relative',
        }}
      >
        {clip.clipPath ? (
          isImage ? (
            <Img
              src={clip.clipPath}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.05) saturate(1.05)',
              }}
            />
          ) : (
            <OffthreadVideo
              src={clip.clipPath}
              volume={0}
              trimBefore={clip.sourceStart ? Math.round(clip.sourceStart * fps) : undefined}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'contrast(1.05) saturate(1.05)',
              }}
            />
          )
        ) : (
          <div style={{ width: '100%', height: '100%', backgroundColor: '#111115' }} />
        )}
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
