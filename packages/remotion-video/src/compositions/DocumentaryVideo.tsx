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
      {sequences.map(({ clip, index, startFrame, durationInFrames, durationInSeconds }) => {
        const calloutStartFrame = clip.callout
          ? Math.max(0, Math.round((clip.callout.startTime ?? 0.05) * fps))
          : 0;
        const calloutSfx = clip.callout?.sfxPath || clip.calloutSfxPath;
        const calloutSfxDuration = Math.min(60, Math.max(15, durationInFrames - calloutStartFrame));

        return (
          <Sequence
            key={`seq_${index}`}
            from={startFrame}
            durationInFrames={durationInFrames}
            name={`Beat ${index} (${durationInSeconds}s)`}
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
            {clip.sfxPath && (
              <Audio src={clip.sfxPath} volume={clip.sfxVolume ?? 0.18} />
            )}
            {calloutSfx && (
              <Sequence from={calloutStartFrame} durationInFrames={calloutSfxDuration}>
                <Audio
                  src={calloutSfx}
                  volume={clip.callout?.sfxVolume ?? clip.calloutSfxVolume ?? 0.14}
                />
              </Sequence>
            )}

            {/* ── BROADCAST DOCUMENTARY SUBTITLE LAYER ── */}
            {(clip.subtitle || clip.text) && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '72px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  maxWidth: '1360px',
                  width: '92%',
                  textAlign: 'center',
                  pointerEvents: 'none',
                  zIndex: 50,
                }}
              >
                <span
                  style={{
                    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                    fontSize: '44px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    letterSpacing: '-0.01em',
                    lineHeight: 1.35,
                    textShadow: '0 2px 4px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.85), 0 0 28px rgba(0,0,0,0.95)',
                    backgroundColor: 'rgba(0, 0, 0, 0.48)',
                    padding: '8px 24px',
                    borderRadius: '8px',
                    boxDecorationBreak: 'clone',
                    WebkitBoxDecorationBreak: 'clone',
                    display: 'inline',
                  }}
                >
                  {clip.subtitle || clip.text}
                </span>
              </div>
            )}
          </Sequence>
        );
      })}

      {/* ── GLOBAL TIMELINE OVERLAYS (e.g. 35mm Grain, Vignette) ──────── */}
      {timeline.globalOverlays && (
        <OverlayDirector overlay={timeline.globalOverlays} />
      )}

      {/* ── MASTER NARRATION AUDIO TRACK ──────────────────────────────── */}
      {timeline.masterAudioPath && (
        <Audio src={timeline.masterAudioPath} />
      )}

      {/* ── CINEMATIC DOCUMENTARY BACKGROUND SCORE ─────────────────────── */}
      {timeline.backgroundMusicPath && (
        <Audio
          src={timeline.backgroundMusicPath}
          volume={timeline.backgroundMusicVolume ?? 0.08}
          loop
        />
      )}
    </div>
  );
};
