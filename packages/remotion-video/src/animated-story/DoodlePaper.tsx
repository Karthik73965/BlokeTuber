import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodleFilterDef } from './DoodleElements';

export interface DoodlePaperProps {
  children: React.ReactNode;
  cameraZoom?: [number, number];
  cameraPanX?: [number, number];
  cameraPanY?: [number, number];
  backgroundColor?: string;
}

export const DoodlePaper: React.FC<DoodlePaperProps> = ({
  children,
  cameraZoom = [1.0, 1.04],
  cameraPanX = [0, 0],
  cameraPanY = [0, 0],
  backgroundColor = '#FFFFFF',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const currentZoom = interpolate(
    frame,
    [0, durationInFrames],
    cameraZoom,
    { extrapolateRight: 'clamp' }
  );

  const currentPanX = interpolate(
    frame,
    [0, durationInFrames],
    cameraPanX,
    { extrapolateRight: 'clamp' }
  );

  const currentPanY = interpolate(
    frame,
    [0, durationInFrames],
    cameraPanY,
    { extrapolateRight: 'clamp' }
  );

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        backgroundColor,
        overflow: 'hidden',
        fontFamily: "'Comic Sans MS', 'Chalkboard SE', 'Patrick Hand', 'Caveat', cursive, sans-serif",
      }}
    >
      <DoodleFilterDef />

      {/* Camera Rig Transform Container */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: 'center center',
          transform: `scale(${currentZoom}) translate(${currentPanX}px, ${currentPanY}px)`,
        }}
      >
        <svg
          viewBox="0 0 1920 1080"
          style={{
            width: '100%',
            height: '100%',
            overflow: 'visible',
            filter: 'url(#doodle-wobble)',
          }}
        >
          {children}
        </svg>
      </div>
    </div>
  );
};
