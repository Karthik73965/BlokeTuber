import React from 'react';
import { interpolate, useCurrentFrame, useVideoConfig } from 'remotion';
import { TransitionType } from '../../types';

export interface SceneTransitionDirectorProps {
  transitionType?: TransitionType;
  clipIndex: number;
  durationInFrames: number;
}

/**
 * Broadcast-Grade Documentary Transition Director
 * Renders frame-accurate, buttery-smooth cinematic transitions at beat boundaries:
 * - shutter_flash: High-contrast camera shutter blink & exposure bloom (0.08s)
 * - film_burn: Warm 35mm amber/crimson edge light leak flare (0.2s)
 * - film_dip_black: Cinematic micro fade-up from pitch black (0.25s)
 * - whip_pan_left / whip_pan_right: Fast directional motion-blurred camera swipe (0.15s)
 * - zoom_punch: Dramatic snap-zoom scale impact with subtle radial shockwave (0.18s)
 * - glitch_blink: 2-frame digital VHS/CRT sync twitch with chromatic split (0.1s)
 * - crossfade: Smooth cinematic dissolve (0.3s)
 * - cut: Clean hard cut
 */
export const SceneTransitionDirector: React.FC<SceneTransitionDirectorProps> = ({
  transitionType = 'cut',
  clipIndex,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // If first clip in video, always do an elegant cinematic fade-in from black
  if (clipIndex === 0) {
    const introOpacity = interpolate(frame, [0, Math.min(12, Math.round(fps * 0.4))], [1, 0], {
      extrapolateRight: 'clamp',
    });
    if (introOpacity <= 0) return null;
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          opacity: introOpacity,
          zIndex: 80,
          pointerEvents: 'none',
        }}
      />
    );
  }

  // Hard cut: no transition overlay
  if (transitionType === 'cut' || !transitionType) {
    return null;
  }

  // ── 1. CAMERA SHUTTER FLASH (Archival / Investigative Cut) ─────────────────
  if (transitionType === 'shutter_flash') {
    const flashFrames = Math.max(6, Math.round(fps * 0.22)); // ~7 frames soft bloom
    if (frame > flashFrames) return null;

    const flashOpacity = interpolate(frame, [0, 2, flashFrames], [0.65, 0.4, 0], {
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#FFFFFF',
          opacity: flashOpacity,
          mixBlendMode: 'screen',
          zIndex: 80,
          pointerEvents: 'none',
        }}
      />
    );
  }

  // ── 2. FILM BURN / LIGHT LEAK FLARE (Warm Nostalgic / Memory Shift) ────────
  if (transitionType === 'film_burn') {
    const burnFrames = Math.max(8, Math.round(fps * 0.35)); // ~11 frames smooth flare
    if (frame > burnFrames) return null;

    const burnIntensity = interpolate(frame, [0, 4, burnFrames], [0.15, 0.85, 0], {
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: burnIntensity,
          mixBlendMode: 'screen',
          zIndex: 80,
          pointerEvents: 'none',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-20%',
            left: '15%',
            width: '80%',
            height: '140%',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(255, 200, 60, 1) 0%, rgba(239, 68, 68, 0.75) 45%, rgba(185, 28, 28, 0.2) 75%, transparent 100%)',
            filter: 'blur(55px)',
            transform: `scale(${1 + burnIntensity * 0.25}) rotate(-8deg)`,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-15%',
            right: '-10%',
            width: '60%',
            height: '80%',
            borderRadius: '50%',
            background:
              'radial-gradient(ellipse at center, rgba(251, 146, 60, 0.8) 0%, rgba(220, 38, 38, 0.5) 50%, transparent 100%)',
            filter: 'blur(45px)',
          }}
        />
      </div>
    );
  }

  // ── 3. FILM DIP TO BLACK (Dramatic Topic / Chapter Shift) ──────────────────
  if (transitionType === 'film_dip_black') {
    const dipFrames = Math.max(8, Math.round(fps * 0.35));
    if (frame > dipFrames) return null;

    const dipOpacity = interpolate(frame, [0, dipFrames], [0.9, 0], {
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#000000',
          opacity: dipOpacity,
          zIndex: 80,
          pointerEvents: 'none',
        }}
      />
    );
  }

  // ── 4. WHIP PAN MOTION BLUR SWIPE (Left or Right) ──────────────────────────
  if (transitionType === 'whip_pan_left' || transitionType === 'whip_pan_right') {
    const whipFrames = Math.max(4, Math.round(fps * 0.16));
    if (frame > whipFrames) return null;

    const direction = transitionType === 'whip_pan_left' ? -1 : 1;
    const progress = frame / whipFrames;
    const offsetPercent = interpolate(progress, [0, 1], [direction * 60, 0], {
      extrapolateRight: 'clamp',
    });
    const streakOpacity = interpolate(progress, [0, 0.3, 1], [0.8, 0.4, 0], {
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: streakOpacity,
          transform: `translateX(${offsetPercent}%)`,
          background: `linear-gradient(${direction > 0 ? '90deg' : '270deg'}, rgba(0,0,0,0.85) 0%, rgba(255,255,255,0.2) 50%, transparent 100%)`,
          filter: 'blur(12px)',
          zIndex: 80,
          pointerEvents: 'none',
        }}
      />
    );
  }

  // ── 5. ZOOM PUNCH IMPACT (High-Impact Stat / Shock Reveal) ─────────────────
  if (transitionType === 'zoom_punch') {
    const punchFrames = Math.max(4, Math.round(fps * 0.18));
    if (frame > punchFrames) return null;

    const shockOpacity = interpolate(frame, [0, 1, punchFrames], [0.65, 0.3, 0], {
      extrapolateRight: 'clamp',
    });
    const ringScale = interpolate(frame, [0, punchFrames], [0.9, 1.4], {
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: shockOpacity,
          mixBlendMode: 'screen',
          zIndex: 80,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Radial shockwave ring */}
        <div
          style={{
            width: '80vw',
            height: '80vh',
            borderRadius: '50%',
            border: '4px solid rgba(255, 255, 255, 0.6)',
            boxShadow: '0 0 60px rgba(255, 255, 255, 0.8), inset 0 0 40px rgba(255, 255, 255, 0.5)',
            transform: `scale(${ringScale})`,
            filter: 'blur(2px)',
          }}
        />
      </div>
    );
  }

  // ── 6. CRT / VHS GLITCH BLINK (Surveillance / Wiretaps / Police Records) ───
  if (transitionType === 'glitch_blink') {
    const glitchFrames = Math.max(3, Math.round(fps * 0.12));
    if (frame > glitchFrames) return null;

    const flicker = frame % 2 === 0 ? 0.75 : 0.25;
    const splitOffset = frame === 0 ? 14 : frame === 1 ? -8 : 3;

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 80,
          pointerEvents: 'none',
          opacity: flicker,
          overflow: 'hidden',
        }}
      >
        {/* RGB Split chromatic bars */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `translateX(${splitOffset}px)`,
            background:
              'repeating-linear-gradient(0deg, rgba(0, 255, 255, 0.15) 0px, rgba(255, 0, 100, 0.15) 3px, transparent 6px)',
            mixBlendMode: 'screen',
          }}
        />
        {/* White burst sync line */}
        <div
          style={{
            position: 'absolute',
            top: `${(frame * 31) % 85}%`,
            left: 0,
            right: 0,
            height: 6,
            backgroundColor: '#FFFFFF',
            boxShadow: '0 0 15px #00FFFF',
            opacity: 0.9,
          }}
        />
      </div>
    );
  }

  // ── 7. SMOOTH CROSSFADE DISSOLVE ──────────────────────────────────────────
  if (transitionType === 'crossfade') {
    const fadeFrames = Math.max(10, Math.round(fps * 0.45));
    if (frame > fadeFrames) return null;

    const darkOpacity = interpolate(frame, [0, fadeFrames], [0.65, 0], {
      extrapolateRight: 'clamp',
    });

    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: '#09090B',
          opacity: darkOpacity,
          zIndex: 80,
          pointerEvents: 'none',
        }}
      />
    );
  }

  return null;
};
