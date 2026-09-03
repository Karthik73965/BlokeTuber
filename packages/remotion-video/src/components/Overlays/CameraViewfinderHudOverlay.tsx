import React from 'react';
import { useCurrentFrame } from 'remotion';

export const CameraViewfinderHudOverlay: React.FC = () => {
  const frame = useCurrentFrame();

  // Blinking REC dot every 30 frames (1 second)
  const isRecBlinking = Math.floor(frame / 15) % 2 === 0;

  // Running frame timecode: 00:04:18:12
  const totalSeconds = Math.floor(frame / 30);
  const framesPart = String(frame % 30).padStart(2, '0');
  const secondsPart = String(totalSeconds % 60).padStart(2, '0');
  const minutesPart = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const timecode = `00:${minutesPart}:${secondsPart}:${framesPart}`;

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 40,
        padding: 48,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: '"Courier New", Courier, monospace',
        color: '#FFFFFF',
        textShadow: '0 2px 8px rgba(0, 0, 0, 0.8)',
      }}
    >
      {/* ── TOP HUD BAR ──────────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left: REC indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 900 }}>
          <div
            style={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: '#EF4444',
              opacity: isRecBlinking ? 1 : 0.2,
              boxShadow: isRecBlinking ? '0 0 10px #EF4444' : 'none',
            }}
          />
          <span style={{ letterSpacing: '0.12em' }}>REC</span>
          <span style={{ fontSize: 12, color: '#A1A1AA', marginLeft: 8 }}>4K UHD // LOG-C</span>
        </div>

        {/* Right: Battery & FPS */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 13, fontWeight: 800 }}>
          <span>24 FPS</span>
          <span>ISO 800</span>
          <span>5600K</span>
          {/* Battery Icon */}
          <div
            style={{
              border: '2px solid #FFFFFF',
              borderRadius: 2,
              padding: 2,
              width: 26,
              height: 14,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <div style={{ width: '80%', height: '100%', backgroundColor: '#22C55E' }} />
          </div>
        </div>
      </div>

      {/* ── CENTER CROSSHAIR RETICLE ─────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 80,
          height: 80,
          pointerEvents: 'none',
        }}
      >
        <svg width="80" height="80">
          <circle cx="40" cy="40" r="16" stroke="rgba(255,255,255,0.4)" strokeWidth="1" fill="none" />
          <line x1="40" y1="12" x2="40" y2="24" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <line x1="40" y1="56" x2="40" y2="68" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <line x1="12" y1="40" x2="24" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
          <line x1="56" y1="40" x2="68" y2="40" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
        </svg>
      </div>

      {/* ── 4 CORNER FRAMING BRACKETS ────────────────────────────────── */}
      <div style={{ position: 'absolute', top: 32, left: 32, width: 32, height: 32, borderTop: '3px solid #FFFFFF', borderLeft: '3px solid #FFFFFF' }} />
      <div style={{ position: 'absolute', top: 32, right: 32, width: 32, height: 32, borderTop: '3px solid #FFFFFF', borderRight: '3px solid #FFFFFF' }} />
      <div style={{ position: 'absolute', bottom: 32, left: 32, width: 32, height: 32, borderBottom: '3px solid #FFFFFF', borderLeft: '3px solid #FFFFFF' }} />
      <div style={{ position: 'absolute', bottom: 32, right: 32, width: 32, height: 32, borderBottom: '3px solid #FFFFFF', borderRight: '3px solid #FFFFFF' }} />

      {/* ── BOTTOM HUD BAR ───────────────────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div style={{ fontSize: 13, color: '#E4E4E7' }}>
          <span>SHUTTER 1/48</span>
          <span style={{ marginLeft: 16 }}>F/2.8</span>
          <span style={{ marginLeft: 16 }}>RAW EXPOSURE +0.3</span>
        </div>

        {/* Live Running Timecode */}
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: '0.15em', color: '#FACC15' }}>
          TC: {timecode}
        </div>
      </div>
    </div>
  );
};
