import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { INK_BLACK, VICTIM_RED, ZennStickman, ZennMosquito } from './ZennStyle';

/**
 * 📡 SCENE 1: 4-Layer Sensory HUD Breakdown (Beats 2, 3, 4)
 */
export const ZennFourLayerStackHudScene: React.FC = () => {
  const frame = useCurrentFrame();

  const layers = [
    { num: '1', name: 'CO₂ BREATH PLUME', color: '#38BDF8', y: 300 },
    { num: '2', name: 'SKIN MICROBES & ACIDS', color: '#F59E0B', y: 440 },
    { num: '3', name: 'BODY HEAT & MOISTURE', color: '#EF4444', y: 580 },
    { num: '4', name: 'DARK CLOTHING CONTRAST', color: '#A855F7', y: 720 },
  ];

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Host Stickman Silhouette in Center */}
        <g transform="translate(680, 520)">
          <ZennStickman x={0} y={0} scale={1.25} shirtColor="#2563EB" eyes="normal" />
        </g>

        {/* 4 Holographic Layer Cards Stacking Up on Right */}
        <g transform="translate(1320, 0)">
          {layers.map((l, i) => {
            const delay = i * 10;
            const pop = Math.min(Math.max((frame - delay) / 12, 0), 1);
            return (
              <g key={l.num} transform={`translate(0, ${l.y}) scale(${pop})`}>
                <rect
                  x={-280}
                  y={-45}
                  width={560}
                  height={90}
                  rx={20}
                  fill="#1E293B"
                  stroke={l.color}
                  strokeWidth={5}
                />
                <circle cx={-210} cy={0} r={28} fill={l.color} />
                <text x={-210} y={9} fill="#FFFFFF" fontSize={26} fontWeight="900" textAnchor="middle">
                  {l.num}
                </text>
                <text x={-150} y={9} fill="#FFFFFF" fontSize={24} fontWeight="900">
                  {l.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Header Title */}
        <g transform="translate(960, 120)">
          <rect
            x={-340}
            y={-38}
            width={680}
            height={76}
            rx={38}
            fill="#38BDF8"
            stroke="#FFFFFF"
            strokeWidth={4.5}
          />
          <text
            x={0}
            y={10}
            fill="#0F172A"
            fontSize={26}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            THE 4-LAYER SENSORY DETECTION TRAIL 🧭🎯
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 📻 SCENE 2: The Radio Broadcast Tower & 5-Bar Reception (Beats 7 & 8)
 */
export const ZennRadioBroadcastTowerScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Night Sky with Glowing Moon */}
        <circle cx={200} cy={160} r={60} fill="#FEF08A" opacity={0.8} />

        {/* Host Stickman Acting as Radio Broadcast Tower on Left */}
        <g transform="translate(540, 560)">
          <ZennStickman x={0} y={0} scale={1.25} shirtColor="#2563EB" eyes="normal" mouth="smirk" />

          {/* Pulsing Wavy Radio Transmission Waves Emanating from Head */}
          {[120, 200, 280, 360].map((rw, i) => {
            const rad = (rw + (frame * 5) % 180);
            return (
              <path
                key={i}
                d={`M ${rad} -80 Q ${rad + 40} 0 ${rad} 80`}
                stroke="#38BDF8"
                strokeWidth={5}
                strokeDasharray="16 10"
                fill="none"
                opacity={0.7}
              />
            );
          })}
        </g>

        {/* Mosquito in the Dark on Right Wearing Pilot Headphones */}
        <g transform="translate(1420, 500)">
          <ZennMosquito x={0} y={0} scale={1.6} facing="left" />

          {/* Miniature Pilot Headphones */}
          <g transform="translate(-15, 20)">
            <path d="M -30 -30 Q 0 -60 30 -30" stroke="#0F172A" strokeWidth={6} fill="none" />
            <circle cx={-30} cy={-30} r={16} fill="#EF4444" stroke={INK_BLACK} strokeWidth={3} />
            <circle cx={30} cy={-30} r={16} fill="#EF4444" stroke={INK_BLACK} strokeWidth={3} />
          </g>

          {/* 5-Bar Signal Reception Box */}
          <g transform="translate(0, 180)">
            <rect x={-140} y={-35} width={280} height={70} rx={16} fill="#1E293B" stroke="#22C55E" strokeWidth={4} />
            <text x={0} y={9} fill="#22C55E" fontSize={22} fontWeight="900" textAnchor="middle">
              5G RECEPTION 📶
            </text>
          </g>
        </g>

        {/* Comic Banner */}
        <g transform="translate(960, 950)">
          <rect
            x={-350}
            y={-38}
            width={700}
            height={76}
            rx={38}
            fill="#FACC15"
            stroke={INK_BLACK}
            strokeWidth={4.5}
          />
          <text
            x={0}
            y={10}
            fill={INK_BLACK}
            fontSize={23}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            "SOMEWHERE IN THE DARK, SHE HAS EXCELLENT RECEPTION" 📡🦟
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * ⏰ SCENE 3: Bedroom at 2:13 AM (Beat 9)
 */
export const ZennTwoThirteenBedroomScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#020617', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Bedroom Night Silhouette */}
        {/* Bed Headboard */}
        <rect x={360} y={400} width={900} height={320} rx={16} fill="#0F172A" stroke="#1E293B" strokeWidth={6} />
        {/* Mattress & Rumpled Blanket */}
        <rect x={320} y={620} width={980} height={260} rx={24} fill="#1E293B" stroke="#334155" strokeWidth={6} />

        {/* Stickman Lying in Bed with Wide Eyes */}
        <g transform="translate(680, 560)">
          <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={5} />
          {/* Eyes Snapping Wide Open */}
          <circle cx={-18} cy={-6} r={16} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={3} />
          <circle cx={-18} cy={-6} r={6} fill={INK_BLACK} />
          <circle cx={18} cy={-6} r={16} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={3} />
          <circle cx={18} cy={-6} r={6} fill={INK_BLACK} />
          {/* Frown */}
          <path d="M -14 26 Q 0 16 14 26" stroke={INK_BLACK} strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>

        {/* Mosquito Buzzing 2 Inches From His Ear with Sound Rings */}
        <g transform={`translate(${790 + Math.sin(frame * 0.4) * 15}, ${510 + Math.cos(frame * 0.4) * 15})`}>
          <ZennMosquito x={0} y={0} scale={0.9} facing="left" />
          {/* High-Pitched Sound Waves */}
          {[20, 40, 60].map((sw, i) => (
            <circle key={i} cx={0} cy={0} r={sw} fill="none" stroke="#FACC15" strokeWidth={2.5} opacity={0.6} />
          ))}
          <text x={35} y={-25} fill="#EF4444" fontSize={22} fontWeight="900">
            BZZZZT!
          </text>
        </g>

        {/* Glowing Green Digital Alarm Clock: 02:13 */}
        <g transform="translate(1500, 620)">
          {/* Bedside Table */}
          <rect x={-180} y={80} width={360} height={280} rx={16} fill="#0F172A" stroke="#1E293B" strokeWidth={6} />
          {/* Digital Clock Casing */}
          <rect x={-140} y={-50} width={280} height={120} rx={16} fill="#000000" stroke="#334155" strokeWidth={6} />
          {/* Neon Green 02:13 */}
          <text
            x={0}
            y={32}
            fill="#22C55E"
            fontSize={64}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
            letterSpacing={4}
          >
            02:13
          </text>
          <text x={0} y={60} fill="#15803D" fontSize={16} fontWeight="900" textAnchor="middle">
            AM
          </text>
        </g>
      </svg>
    </div>
  );
};
