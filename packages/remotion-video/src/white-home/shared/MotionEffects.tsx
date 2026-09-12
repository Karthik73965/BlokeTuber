import React from 'react';
import { Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * 🔊 Clean SFX Trigger Component
 * Plays audio sound effects strictly at 60% volume (volume={0.6}) by default.
 */
export const SfxTrigger: React.FC<{
  sound: 'whoosh' | 'whoosh_air' | 'whoosh_cinematic' | 'camera_shutter' | 'pop' | 'subtle_hit' | 'paper_slide' | 'stat_click';
  volume?: number;
  startFrame?: number;
}> = ({ sound, volume = 0.6, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  if (frame < startFrame) return null;

  const fileName = sound.endsWith('.mp3') ? sound : `${sound}.mp3`;
  return <Audio src={staticFile(`sfx/${fileName}`)} volume={volume} />;
};

/**
 * 🔍 Smooth Camera Zoom-In (Punch-In) Effect
 * Zooms smoothly toward a focus point (default: center) with optional 60% whoosh.
 */
export const ZoomIn: React.FC<{
  children: React.ReactNode;
  startFrame?: number;
  durationInFrames?: number;
  fromScale?: number;
  toScale?: number;
  originX?: number;
  originY?: number;
  withWhoosh?: boolean;
}> = ({
  children,
  startFrame = 0,
  durationInFrames = 25,
  fromScale = 1.0,
  toScale = 1.2,
  originX = 960,
  originY = 540,
  withWhoosh = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 14, mass: 0.8 },
  });

  const scale = interpolate(progress, [0, 1], [fromScale, toScale], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        transformOrigin: `${originX}px ${originY}px`,
        transform: `scale(${scale})`,
      }}
    >
      {withWhoosh && frame >= startFrame && frame < startFrame + 3 && (
        <SfxTrigger sound="whoosh_air" volume={0.6} />
      )}
      {children}
    </div>
  );
};

/**
 * 💨 Smooth Slide-In Transition Wrapper
 * Slides an element in from left, right, top, or bottom with a 60% swoosh.
 */
export const SlideIn: React.FC<{
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'top' | 'bottom';
  distance?: number;
  startFrame?: number;
  withSfx?: boolean;
}> = ({
  children,
  direction = 'right',
  distance = 350,
  startFrame = 0,
  withSfx = true,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 13, mass: 0.7 },
  });

  let translateX = 0;
  let translateY = 0;

  if (direction === 'left') {
    translateX = interpolate(progress, [0, 1], [-distance, 0]);
  } else if (direction === 'right') {
    translateX = interpolate(progress, [0, 1], [distance, 0]);
  } else if (direction === 'top') {
    translateY = interpolate(progress, [0, 1], [-distance, 0]);
  } else if (direction === 'bottom') {
    translateY = interpolate(progress, [0, 1], [distance, 0]);
  }

  return (
    <g transform={`translate(${translateX}, ${translateY})`}>
      {withSfx && frame === startFrame && (
        <SfxTrigger sound="whoosh" volume={0.6} />
      )}
      {children}
    </g>
  );
};

/**
 * 📸 Camera Shutter Snapshot Effect
 * Produces a quick photo-shutter flash with camera_shutter.mp3 at 60% volume.
 */
export const CameraShutterEffect: React.FC<{
  triggerFrame?: number;
  flashDurationFrames?: number;
}> = ({ triggerFrame = 0, flashDurationFrames = 6 }) => {
  const frame = useCurrentFrame();

  if (frame < triggerFrame || frame >= triggerFrame + flashDurationFrames) {
    return null;
  }

  const flashOpacity = interpolate(
    frame - triggerFrame,
    [0, 2, flashDurationFrames],
    [0, 0.75, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <>
      {frame === triggerFrame && (
        <SfxTrigger sound="camera_shutter" volume={0.6} />
      )}
      <rect
        x={0}
        y={0}
        width={1920}
        height={1080}
        fill="#FFFFFF"
        opacity={flashOpacity}
        pointerEvents="none"
      />
    </>
  );
};

/**
 * 💥 Bouncy Pop-In Animation Wrapper
 * Pops in with an elastic overshoot and subtle pop SFX at 60% volume.
 */
export const PopIn: React.FC<{
  children: React.ReactNode;
  centerX: number;
  centerY: number;
  startFrame?: number;
  withSfx?: boolean;
}> = ({ children, centerX, centerY, startFrame = 0, withSfx = true }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 10, mass: 0.6 },
  });

  return (
    <g transform={`translate(${centerX}, ${centerY}) scale(${scale}) translate(${-centerX}, ${-centerY})`}>
      {withSfx && frame === startFrame && (
        <SfxTrigger sound="pop" volume={0.6} />
      )}
      {children}
    </g>
  );
};
