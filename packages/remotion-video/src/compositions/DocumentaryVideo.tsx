import React from 'react';
import { Audio, Sequence, useVideoConfig } from 'remotion';
import { DocumentaryVideoProps } from '../types';
import { SceneLayoutDirector } from '../components/Layouts/SceneLayoutDirector';
import { OverlayDirector } from '../components/Overlays/OverlayDirector';
import { SceneTransitionDirector } from '../components/Transitions/SceneTransitionDirector';

export const DocumentaryVideo: React.FC<DocumentaryVideoProps> = ({ timeline }) => {
  const { fps } = useVideoConfig();

  if (!timeline || !timeline.clips || timeline.clips.length === 0) {
    return (
      <div
        style={{
          flex: 1,
          backgroundColor: '#09090B',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 32,
          fontFamily: 'Inter, sans-serif',
        }}
      >
        No clips found in timeline.
      </div>
    );
  }

  // Calculate sequences with frame alignment
  let currentFrame = 0;
  const sequences = timeline.clips.map((clip, index) => {
    const rawDuration = Math.max(0.5, clip.endTime - clip.startTime);
    const durationInFrames = Math.max(15, Math.round(rawDuration * fps));
    const startFrame = currentFrame;
    currentFrame += durationInFrames;

    return {
      clip,
      index,
      startFrame,
      durationInFrames,
      durationInSeconds: rawDuration,
    };
  });

  return (
    <div
      style={{
        flex: 1,
        position: 'relative',
        backgroundColor: '#000000',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* ── VIDEO SEQUENCES WITH MULTI-LAYOUT SCENE DIRECTOR & OVERLAYS ── */}
      {sequences.map(({ clip, index, startFrame, durationInFrames, durationInSeconds }) => (
        <Sequence
          key={`seq_${index}_${clip.beatIndex}`}
          from={startFrame}
          durationInFrames={durationInFrames}
          name={`Beat ${clip.beatIndex + 1} (${durationInSeconds.toFixed(1)}s)`}
        >
          <SceneLayoutDirector
            clip={clip}
            clipIndex={index}
            durationInFrames={durationInFrames}
            durationInSeconds={durationInSeconds}
          />
          {clip.overlay && <OverlayDirector overlay={clip.overlay} />}
          <SceneTransitionDirector
            transitionType={clip.transitionType}
            clipIndex={index}
            durationInFrames={durationInFrames}
          />
        </Sequence>
      ))}

      {/* ── GLOBAL TIMELINE OVERLAYS (e.g. 35mm Grain, Vignette) ──────── */}
      {timeline.globalOverlays && (
        <OverlayDirector overlay={timeline.globalOverlays} />
      )}

      {/* ── MASTER NARRATION AUDIO TRACK ──────────────────────────────── */}
      {timeline.masterAudioPath && (
        <Audio src={timeline.masterAudioPath} />
      )}
    </div>
  );
};
