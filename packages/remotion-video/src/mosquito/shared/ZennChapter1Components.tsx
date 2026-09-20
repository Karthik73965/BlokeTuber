import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

// Authentic Zenn Color Palette
export const INK = '#18181B';
export const WALL_OCHRE = '#C2A478';
export const FLOOR_UMBER = '#6B4D2B';
export const MOSQUITO_BODY = '#556877';
export const MOSQUITO_WING = '#E2F1F8';
export const VICTIM_RED = '#EF4444';

/**
 * 🧍 Zenn Host Stickman
 * Authentic replica of the iconic 3-spiky-haired victim with red welts
 */
export const ZennHostStickman: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  expression?: 'worried' | 'curious' | 'sweating' | 'neutral' | 'exhaling' | 'shocked' | 'sitting';
  welts?: boolean;
  armPose?: 'down' | 'scratching' | 'chin' | 'flailing' | 'exhaling' | 'sitting';
  facing?: 'left' | 'right' | 'front';
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  expression = 'neutral',
  welts = true,
  armPose = 'down',
  facing = 'front',
}) => {
  const frame = useCurrentFrame();
  const flip = facing === 'left' ? -1 : 1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * flip}, ${scale})`}>
      {/* Head Circle */}
      <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />

      {/* 3 Iconic Spiky Hairs */}
      <g stroke={INK} strokeWidth={5} strokeLinecap="round">
        <line x1={-14} y1={-53} x2={-20} y2={-88} />
        <line x1={0} y1={-55} x2={0} y2={-96} />
        <line x1={14} y1={-53} x2={22} y2={-86} />
      </g>

      {/* Eyes based on expression */}
      {expression === 'shocked' ? (
        <>
          <circle cx={-20} cy={-6} r={18} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
          <circle cx={-20} cy={-6} r={6} fill={INK} />
          <circle cx={20} cy={-6} r={18} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
          <circle cx={20} cy={-6} r={6} fill={INK} />
          <line x1={-32} y1={-32} x2={-8} y2={-32} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={8} y1={-32} x2={32} y2={-32} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <ellipse cx={0} cy={24} rx={14} ry={18} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        </>
      ) : expression === 'worried' || expression === 'sweating' ? (
        <>
          <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={-18 + Math.sin(frame * 0.1) * 2} cy={-8} r={5} fill={INK} />
          <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={18 + Math.sin(frame * 0.1) * 2} cy={-8} r={5} fill={INK} />
          <line x1={-28} y1={-22} x2={-8} y2={-30} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={8} y1={-30} x2={28} y2={-22} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <path d="M -14 26 Q 0 16 14 26" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          {expression === 'sweating' && (
            <g>
              {[
                { dx: -65, dy: -20, delay: 0 },
                { dx: 68, dy: -15, delay: 10 },
                { dx: -70, dy: 30, delay: 20 },
              ].map((drop, idx) => {
                const dropY = ((frame + drop.delay) % 25) * 3;
                return (
                  <circle
                    key={idx}
                    cx={drop.dx}
                    cy={drop.dy + dropY}
                    r={6}
                    fill="#38BDF8"
                    stroke={INK}
                    strokeWidth={2}
                    opacity={Math.max(0, 1 - dropY / 75)}
                  />
                );
              })}
            </g>
          )}
        </>
      ) : expression === 'curious' ? (
        <>
          <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={-14} cy={-6} r={5} fill={INK} />
          <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={22} cy={-6} r={5} fill={INK} />
          <line x1={-28} y1={-26} x2={-8} y2={-22} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={8} y1={-32} x2={28} y2={-22} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={-10} y1={25} x2={10} y2={22} stroke={INK} strokeWidth={3.8} strokeLinecap="round" />
        </>
      ) : expression === 'exhaling' ? (
        <>
          <circle cx={-18} cy={-8} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={-15} cy={-8} r={5} fill={INK} />
          <circle cx={18} cy={-8} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={21} cy={-8} r={5} fill={INK} />
          <line x1={-28} y1={-28} x2={-8} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={8} y1={-28} x2={28} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          {/* Round blowing mouth */}
          <ellipse cx={facing === 'left' ? -22 : 22} cy={22} rx={9} ry={12} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        </>
      ) : (
        <>
          <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={-18} cy={-6} r={5} fill={INK} />
          <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={18} cy={-6} r={5} fill={INK} />
          <line x1={-28} y1={-24} x2={-8} y2={-24} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <line x1={8} y1={-24} x2={28} y2={-24} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <line x1={-12} y1={24} x2={12} y2={24} stroke={INK} strokeWidth={3.8} strokeLinecap="round" />
        </>
      )}

      {/* Red Welt Spots */}
      {welts && (
        <g fill={VICTIM_RED}>
          <circle cx={-46} cy={-12} r={8.5} />
          <circle cx={48} cy={14} r={8.5} />
          <circle cx={-62} cy={115} r={8.5} />
          <circle cx={26} cy={110} r={8.5} />
          <circle cx={-40} cy={225} r={8.5} />
          <circle cx={18} cy={280} r={8.5} />
        </g>
      )}

      {/* Body & Limbs */}
      <g stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1={0} y1={55} x2={0} y2={185} />

        {armPose === 'chin' ? (
          <>
            <line x1={0} y1={95} x2={45} y2={120} />
            <line x1={45} y1={120} x2={15} y2={45} />
            <line x1={0} y1={95} x2={-45} y2={130} />
            <line x1={-45} y1={130} x2={20} y2={125} />
          </>
        ) : armPose === 'scratching' ? (
          <>
            <line x1={0} y1={95} x2={-55} y2={140} />
            <line x1={-55} y1={140} x2={-90} y2={150} />
            <line x1={0} y1={95} x2={50} y2={115} />
            <line x1={50} y1={115} x2={28} y2={20} />
          </>
        ) : armPose === 'flailing' ? (
          <>
            <line x1={0} y1={95} x2={-65} y2={45} />
            <line x1={-65} y1={45} x2={-95} y2={15} />
            <line x1={0} y1={95} x2={65} y2={45} />
            <line x1={65} y1={45} x2={95} y2={15} />
          </>
        ) : armPose === 'sitting' ? (
          <>
            <line x1={0} y1={95} x2={-40} y2={140} />
            <line x1={0} y1={95} x2={40} y2={140} />
          </>
        ) : (
          <>
            <line x1={0} y1={95} x2={-50} y2={155} />
            <line x1={0} y1={95} x2={50} y2={155} />
          </>
        )}

        {armPose === 'sitting' ? (
          <>
            <line x1={0} y1={185} x2={-40} y2={230} />
            <line x1={-40} y1={230} x2={-40} y2={305} />
            <line x1={-40} y1={305} x2={-20} y2={310} />
            <line x1={0} y1={185} x2={30} y2={230} />
            <line x1={30} y1={230} x2={30} y2={305} />
            <line x1={30} y1={305} x2={50} y2={310} />
          </>
        ) : (
          <>
            <line x1={0} y1={185} x2={-35} y2={315} />
            <line x1={0} y1={185} x2={35} y2={315} />
          </>
        )}
      </g>
    </g>
  );
};

/**
 * 🦟 Zenn Detailed Mosquito with Rich Comic Variants
 */
export const ZennComicMosquito: React.FC<{
  x?: number;
  y?: number;
  scale?: number;
  facing?: 'left' | 'right';
  angle?: number;
  accessory?: 'none' | 'briefcase' | 'hardhat' | 'spectacles' | 'radar_ping' | 'plumose_male';
  holdingItem?: 'none' | 'blood_droplet' | 'test_tube';
}> = ({
  x = 0,
  y = 0,
  scale = 1,
  facing = 'left',
  angle = 0,
  accessory = 'none',
  holdingItem = 'none',
}) => {
  const frame = useCurrentFrame();
  const wingFlutter = Math.sin(frame * 1.8) * 18;
  const flip = facing === 'left' ? 1 : -1;

  return (
    <g transform={`translate(${x}, ${y}) rotate(${angle}) scale(${scale * flip}, ${scale})`}>
      {/* Abdomen */}
      <path
        d="M 15 15 C 35 5 70 15 70 35 C 70 55 35 60 15 45 Z"
        fill={MOSQUITO_BODY}
        stroke={INK}
        strokeWidth={4.5}
        strokeLinejoin="round"
      />

      {/* Thorax */}
      <path
        d="M 5 25 C -5 20 -15 35 -5 45 C 5 50 15 45 15 25 Z"
        fill="#455A64"
        stroke={INK}
        strokeWidth={4.5}
      />

      {/* Head */}
      <circle cx={-18} cy={35} r={14} fill="#455A64" stroke={INK} strokeWidth={4} />

      {/* Cartoon Eye */}
      <circle cx={-20} cy={32} r={8} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
      <circle cx={-22} cy={32} r={3.5} fill={INK} />
      <circle cx={-23} cy={31} r={1} fill="#FFFFFF" />

      {/* Antennae */}
      {accessory === 'plumose_male' ? (
        // Feathery bushy male antennae (plumose)
        <g stroke={INK} strokeWidth={2.5} strokeLinecap="round">
          <path d="M -24 24 Q -35 10 -42 12" fill="none" />
          {[-4, 0, 4, 8].map((off, i) => (
            <line key={i} x1={-26 - i * 3} y1={22 - i * 2} x2={-30 - i * 3} y2={14 - i * 2} />
          ))}
          <path d="M -22 22 Q -30 6 -36 8" fill="none" />
          {[-4, 0, 4, 8].map((off, i) => (
            <line key={`b_${i}`} x1={-24 - i * 3} y1={20 - i * 2} x2={-28 - i * 3} y2={12 - i * 2} />
          ))}
        </g>
      ) : (
        // Standard female curved sensory antennae
        <g stroke={INK} strokeWidth={2.5} strokeLinecap="round" fill="none">
          <path d="M -24 24 Q -32 10 -38 15" />
          <path d="M -22 22 Q -28 6 -32 10" />
        </g>
      )}

      {/* Needle Proboscis */}
      <polygon points="-30,34 -85,68 -28,40" fill={INK} />

      {/* 6 Jointed Spidery Legs */}
      <g stroke={INK} strokeWidth={3.8} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M -12 45 L -25 70 L -45 95" />
        <path d="M -5 48 L -15 75 L -30 100" />
        <path d="M 12 48 L 15 80 L 0 110" />
        <path d="M 22 48 L 30 82 L 20 115" />
        <path d="M 38 45 L 60 70 L 80 88" />
        <path d="M 48 40 L 75 62 L 98 75" />
      </g>

      {/* Fluttering Wings */}
      <g transform={`translate(15, 20) rotate(${-25 + wingFlutter})`}>
        <ellipse cx={-30} cy={-30} rx={42} ry={15} transform="rotate(35 -30 -30)" fill={MOSQUITO_WING} stroke={INK} strokeWidth={3.8} />
        <line x1={-55} y1={-48} x2={-5} y2={-12} stroke={INK} strokeWidth={2} />
      </g>
      <g transform={`translate(22, 16) rotate(${-10 - wingFlutter})`}>
        <ellipse cx={-28} cy={-32} rx={42} ry={15} transform="rotate(25 -28 -32)" fill={MOSQUITO_WING} stroke={INK} strokeWidth={3.8} />
      </g>

      {/* Accessory: Yellow Construction Hard Hat */}
      {accessory === 'hardhat' && (
        <g transform="translate(-18, 22)">
          <path d="M -16 0 Q 0 -22 16 0 Z" fill="#FACC15" stroke={INK} strokeWidth={3.5} strokeLinejoin="round" />
          <line x1={-20} y1={0} x2={20} y2={0} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        </g>
      )}

      {/* Accessory: Chemist Round Spectacles */}
      {accessory === 'spectacles' && (
        <g transform="translate(-20, 32)">
          <circle cx={0} cy={0} r={9} fill="rgba(255,255,255,0.7)" stroke={INK} strokeWidth={2.5} />
          <circle cx={14} cy={0} r={9} fill="rgba(255,255,255,0.7)" stroke={INK} strokeWidth={2.5} />
          <line x1={8} y1={0} x2={6} y2={0} stroke={INK} strokeWidth={2} />
          <line x1={-9} y1={0} x2={-16} y2={-4} stroke={INK} strokeWidth={2} />
        </g>
      )}

      {/* Holding Item: Shiny Ruby Blood Droplet */}
      {holdingItem === 'blood_droplet' && (
        <g transform="translate(-45, 65)">
          <path
            d="M 0 -22 C 15 0 20 18 10 28 C 0 38 -15 35 -18 20 C -22 5 -10 -10 0 -22 Z"
            fill="#DC2626"
            stroke={INK}
            strokeWidth={3.5}
            strokeLinejoin="round"
          />
          {/* Shine highlight */}
          <ellipse cx={-5} cy={14} rx={4} ry={8} fill="#FFFFFF" opacity={0.65} transform="rotate(-25 -5 14)" />
        </g>
      )}

      {/* Holding Item: Chemistry Test Tube with Red Blood & Bubbles */}
      {holdingItem === 'test_tube' && (
        <g transform="translate(-50, 50) rotate(-15)">
          {/* Glass test tube outline */}
          <path
            d="M -10 -40 L -10 35 C -10 45 10 45 10 35 L 10 -40"
            fill="rgba(255,255,255,0.2)"
            stroke={INK}
            strokeWidth={3.5}
            strokeLinejoin="round"
          />
          <ellipse cx={0} cy={-40} rx={12} ry={4} fill="#E2E8F0" stroke={INK} strokeWidth={3} />
          {/* Blood liquid inside */}
          <path
            d="M -9 -10 L -9 34 C -9 42 9 42 9 34 L 9 -10 Z"
            fill="#DC2626"
            stroke="none"
          />
          {/* Meniscus */}
          <ellipse cx={0} cy={-10} rx={9} ry={3} fill="#EF4444" />
          {/* Tiny bubbles */}
          <circle cx={-3} cy={10} r={2} fill="#FCA5A5" />
          <circle cx={3} cy={20} r={2.5} fill="#FCA5A5" />
          <circle cx={-2} cy={28} r={2} fill="#FCA5A5" />
          {/* Glass glare line */}
          <line x1={-6} y1={-30} x2={-6} y2={30} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} />
        </g>
      )}
    </g>
  );
};

// ============================================================================
// 🎬 SCENE 1: "It's Not Random" — Desk with Rolling Dice & Hand-Drawn Stamp
// ============================================================================
export const ZennNotRandomScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dice roll progress (0 to 45 frames)
  const roll1X = interpolate(frame, [0, 40], [1650, 1020], { extrapolateRight: 'clamp' });
  const roll1Y = interpolate(frame, [0, 20, 30, 40], [460, 630, 610, 640], { extrapolateRight: 'clamp' });
  const roll1Rot = interpolate(frame, [0, 40], [720, 0], { extrapolateRight: 'clamp' });

  const roll2X = interpolate(frame, [5, 48], [1780, 1200], { extrapolateRight: 'clamp' });
  const roll2Y = interpolate(frame, [5, 25, 36, 48], [490, 645, 625, 655], { extrapolateRight: 'clamp' });
  const roll2Rot = interpolate(frame, [5, 48], [650, 15], { extrapolateRight: 'clamp' });

  // Rubber Stamp Slam impact at frame 50
  const stampSpring = spring({
    frame: frame - 50,
    fps,
    config: { damping: 12, mass: 0.6, stiffness: 120 },
  });

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Background Room */}
      <rect x={0} y={0} width={1920} height={700} fill={WALL_OCHRE} />
      <rect x={0} y={700} width={1920} height={380} fill={FLOOR_UMBER} />
      <line x1={0} y1={700} x2={1920} y2={700} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Large Wooden Desk Tabletop */}
      <g transform="translate(1080, 710)">
        {/* Table Top */}
        <polygon points="-580,-70 580,-70 520,35 -520,35" fill="#8D5B3A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {/* Desk Front Apron */}
        <rect x={-520} y={35} width={1040} height={45} fill="#6B4423" stroke={INK} strokeWidth={5} />
        {/* Sturdy Desk Legs */}
        <line x1={-480} y1={80} x2={-490} y2={280} stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <line x1={480} y1={80} x2={490} y2={280} stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <line x1={-360} y1={80} x2={-365} y2={260} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={360} y1={80} x2={365} y2={260} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        {/* Wood grain strokes */}
        <line x1={-300} y1={-25} x2={-120} y2={-25} stroke="#6B4423" strokeWidth={3} strokeLinecap="round" />
        <line x1={150} y1={-15} x2={380} y2={-15} stroke="#6B4423" strokeWidth={3} strokeLinecap="round" />
      </g>

      {/* Stickman Host on Left watching desk with authority */}
      <ZennHostStickman x={380} y={540} scale={1.25} expression="curious" armPose="chin" facing="right" />

      {/* Rolling Hand-Drawn Die 1 */}
      <g transform={`translate(${roll1X}, ${roll1Y}) rotate(${roll1Rot})`}>
        <rect x={-40} y={-40} width={80} height={80} rx={12} fill="#FFFDF7" stroke={INK} strokeWidth={5} />
        {/* 5 Dots */}
        <circle cx={0} cy={0} r={6.5} fill={INK} />
        <circle cx={-22} cy={-22} r={6.5} fill={INK} />
        <circle cx={22} cy={-22} r={6.5} fill={INK} />
        <circle cx={-22} cy={22} r={6.5} fill={INK} />
        <circle cx={22} cy={22} r={6.5} fill={INK} />
      </g>

      {/* Rolling Hand-Drawn Die 2 */}
      <g transform={`translate(${roll2X}, ${roll2Y}) rotate(${roll2Rot})`}>
        <rect x={-36} y={-36} width={72} height={72} rx={10} fill="#FFFDF7" stroke={INK} strokeWidth={5} />
        {/* 2 Dots */}
        <circle cx={-16} cy={-16} r={6} fill={INK} />
        <circle cx={16} cy={16} r={6} fill={INK} />
      </g>

      {/* Bold Hand-Drawn Red Rubber Stamp: "NOT RANDOM" */}
      {frame >= 50 && (
        <g transform={`translate(1110, 625) rotate(-6) scale(${stampSpring})`}>
          {/* Stamp Red Outer Box */}
          <rect
            x={-240}
            y={-65}
            width={480}
            height={130}
            rx={16}
            fill="none"
            stroke="#DC2626"
            strokeWidth={7}
            strokeDasharray="14 6"
          />
          <rect
            x={-230}
            y={-55}
            width={460}
            height={110}
            rx={12}
            fill="#FEF2F2"
            fillOpacity={0.88}
            stroke="#DC2626"
            strokeWidth={4}
          />
          {/* Stamp Text */}
          <text
            x={0}
            y={24}
            fill="#DC2626"
            fontSize={68}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive, sans-serif"
            style={{ letterSpacing: 3 }}
          >
            NOT RANDOM
          </text>

          {/* Giant Hand-Drawn Red X crossing through */}
          <g stroke={VICTIM_RED} strokeWidth={11} strokeLinecap="round">
            <line x1={-260} y1={-75} x2={260} y2={75} />
            <line x1={-260} y1={75} x2={260} y2={-75} />
          </g>

          {/* Ink Splatter Specks */}
          <circle cx={-255} cy={-50} r={4.5} fill="#DC2626" />
          <circle cx={250} cy={55} r={4} fill="#DC2626" />
          <circle cx={180} cy={-75} r={3.5} fill="#DC2626" />
          <circle cx={-190} cy={80} r={5} fill="#DC2626" />
        </g>
      )}
    </svg>
  );
};

// ============================================================================
// 🎬 SCENE 2: Mosquito Chemoreception Sensor View (CO2, Odor, Heat Trails)
// ============================================================================
export const ZennMosquitoSensorsScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Target lock activation around relative frame 75
  const isLocked = frame >= 75;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Twilight Dusk Environment */}
      <rect x={0} y={0} width={1920} height={780} fill="#1E293B" />
      <rect x={0} y={780} width={1920} height={300} fill="#0F172A" />
      <line x1={0} y1={780} x2={1920} y2={780} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* 3 Flowing Chemical Scent Trails */}

      {/* 1. Cyan Stream: CO₂ */}
      <g>
        <path
          d={`M 80 290 Q 380 ${260 + Math.sin(frame * 0.1) * 35} 680 ${310 + Math.cos(frame * 0.1) * 30} T 1100 320`}
          stroke="#38BDF8"
          strokeWidth={9}
          strokeDasharray="22 14"
          fill="none"
          strokeLinecap="round"
        />
        {/* Floating O=C=O Chemical Molecules */}
        {[0.2, 0.45, 0.7].map((prog, i) => {
          const mx = 120 + ((prog * 1000 + frame * 3.5) % 950);
          const my = 290 + Math.sin((mx + frame * 5) * 0.01) * 30;
          return (
            <g key={i} transform={`translate(${mx}, ${my})`}>
              <circle cx={0} cy={0} r={10} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
              <line x1={-18} y1={0} x2={18} y2={0} stroke={INK} strokeWidth={3} />
              <circle cx={-18} cy={0} r={8} fill="#38BDF8" stroke={INK} strokeWidth={2} />
              <circle cx={18} cy={0} r={8} fill="#38BDF8" stroke={INK} strokeWidth={2} />
            </g>
          );
        })}
        {/* Hand-Drawn Comic Label */}
        <g transform="translate(240, 240)">
          <rect x={-55} y={-24} width={110} height={48} rx={12} fill="#0284C7" stroke="#FFFFFF" strokeWidth={3} />
          <text x={0} y={10} fill="#FFFFFF" fontSize={30} fontWeight="900" textAnchor="middle" fontFamily="'Comic Sans MS', cursive, sans-serif">
            CO₂
          </text>
        </g>
      </g>

      {/* 2. Amber Stream: Skin Odor */}
      <g>
        <path
          d={`M 80 490 Q 380 ${460 + Math.cos(frame * 0.08) * 40} 680 ${520 + Math.sin(frame * 0.08) * 35} T 1100 500`}
          stroke="#F59E0B"
          strokeWidth={9}
          strokeDasharray="20 12"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hand-Drawn Comic Label */}
        <g transform="translate(260, 440)">
          <rect x={-70} y={-24} width={140} height={48} rx={12} fill="#D97706" stroke="#FFFFFF" strokeWidth={3} />
          <text x={0} y={10} fill="#FFFFFF" fontSize={28} fontWeight="900" textAnchor="middle" fontFamily="'Comic Sans MS', cursive, sans-serif">
            ODOR
          </text>
        </g>
      </g>

      {/* 3. Red Stream: Thermal Heat */}
      <g>
        <path
          d={`M 80 690 Q 380 ${660 + Math.sin(frame * 0.12) * 30} 680 ${710 + Math.cos(frame * 0.12) * 25} T 1100 680`}
          stroke="#EF4444"
          strokeWidth={9}
          strokeDasharray="18 12"
          fill="none"
          strokeLinecap="round"
        />
        {/* Hand-Drawn Comic Label */}
        <g transform="translate(240, 640)">
          <rect x={-65} y={-24} width={130} height={48} rx={12} fill="#DC2626" stroke="#FFFFFF" strokeWidth={3} />
          <text x={0} y={10} fill="#FFFFFF" fontSize={28} fontWeight="900" textAnchor="middle" fontFamily="'Comic Sans MS', cursive, sans-serif">
            HEAT
          </text>
        </g>
      </g>

      {/* Hero Mosquito with vibrating sensory antennae */}
      <g transform={`translate(1200, ${500 + Math.sin(frame * 0.1) * 18})`}>
        <ZennComicMosquito scale={2.4} facing="left" />

        {/* Sensory Antenna Radar Arcs */}
        {[25, 55, 85].map((rad, i) => {
          const arcOpacity = ((frame + i * 10) % 30) / 30;
          return (
            <path
              key={i}
              d={`M ${-90 - rad * 0.5} ${-rad * 0.7} Q ${-120 - rad} 0 ${-90 - rad * 0.5} ${rad * 0.7}`}
              stroke="#38BDF8"
              strokeWidth={4.5}
              strokeLinecap="round"
              fill="none"
              opacity={arcOpacity}
            />
          );
        })}

        {/* Target Lock Reticle upon chemically locking on */}
        {isLocked && (
          <g transform="translate(-160, -80)">
            <circle cx={0} cy={0} r={48} stroke="#22C55E" strokeWidth={4.5} fill="none" strokeDasharray="14 10" />
            <line x1={-60} y1={0} x2={-48} y2={0} stroke="#22C55E" strokeWidth={4.5} />
            <line x1={48} y1={0} x2={60} y2={0} stroke="#22C55E" strokeWidth={4.5} />
            <line x1={0} y1={-60} x2={0} y2={-48} stroke="#22C55E" strokeWidth={4.5} />
            <line x1={0} y1={48} x2={0} y2={60} stroke="#22C55E" strokeWidth={4.5} />
            <text x={0} y={-58} fill="#22C55E" fontSize={20} fontWeight="900" textAnchor="middle" fontFamily="'Comic Sans MS', cursive">
              LOCKED
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};

// ============================================================================
// 🎬 SCENE 3: Lineup of 5 People — 20% Open Invitation Plume
// ============================================================================
export const ZennOpenInvitationScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Living Room / Patio */}
      <rect x={0} y={0} width={1920} height={740} fill={WALL_OCHRE} />
      <rect x={0} y={740} width={1920} height={340} fill={FLOOR_UMBER} />
      <line x1={0} y1={740} x2={1920} y2={740} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* 5 Stickmen Standing in a Row */}
      {/* 1. Friend with glasses */}
      <g transform="translate(260, 560)">
        <circle cx={0} cy={0} r={50} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={-18} cy={-4} r={18} fill="none" stroke={INK} strokeWidth={4} />
        <circle cx={18} cy={-4} r={18} fill="none" stroke={INK} strokeWidth={4} />
        <circle cx={-18} cy={-4} r={4.5} fill={INK} />
        <circle cx={18} cy={-4} r={4.5} fill={INK} />
        <line x1={-10} y1={24} x2={10} y2={24} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none">
          <line x1={0} y1={50} x2={0} y2={180} />
          <line x1={0} y1={180} x2={-30} y2={310} />
          <line x1={0} y1={180} x2={30} y2={310} />
          <line x1={0} y1={90} x2={-45} y2={145} />
          <line x1={0} y1={90} x2={45} y2={145} />
        </g>
        {/* Tiny faint scent wisp */}
        <path d="M 0 -60 Q 15 -100 0 -140" stroke="#94A3B8" strokeWidth={2.5} fill="none" opacity={0.3} />
        <text x={0} y={-150} fill="#94A3B8" fontSize={22} fontWeight="bold" textAnchor="middle">✕</text>
      </g>

      {/* 2. Friend with curly hair */}
      <g transform="translate(580, 560)">
        <circle cx={0} cy={0} r={50} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {/* Curly hair bumps */}
        <circle cx={-28} cy={-45} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={-55} r={16} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <circle cx={28} cy={-45} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <circle cx={-16} cy={-6} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-16} cy={-6} r={4} fill={INK} />
        <circle cx={16} cy={-6} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={16} cy={-6} r={4} fill={INK} />
        <line x1={-10} y1={22} x2={10} y2={22} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none">
          <line x1={0} y1={50} x2={0} y2={180} />
          <line x1={0} y1={180} x2={-30} y2={310} />
          <line x1={0} y1={180} x2={30} y2={310} />
          <line x1={0} y1={90} x2={-45} y2={145} />
          <line x1={0} y1={90} x2={45} y2={145} />
        </g>
        <path d="M 0 -60 Q -15 -100 0 -140" stroke="#94A3B8" strokeWidth={2.5} fill="none" opacity={0.3} />
        <text x={0} y={-150} fill="#94A3B8" fontSize={22} fontWeight="bold" textAnchor="middle">✕</text>
      </g>

      {/* 3. Friend with cap */}
      <g transform="translate(900, 560)">
        <circle cx={0} cy={0} r={50} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {/* Cap */}
        <path d="M -45 -20 Q 0 -55 45 -20 Z" fill="#3B82F6" stroke={INK} strokeWidth={4} />
        <line x1={20} y1={-20} x2={58} y2={-16} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <circle cx={-16} cy={-6} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-16} cy={-6} r={4} fill={INK} />
        <circle cx={16} cy={-6} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={16} cy={-6} r={4} fill={INK} />
        <line x1={-10} y1={22} x2={10} y2={22} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none">
          <line x1={0} y1={50} x2={0} y2={180} />
          <line x1={0} y1={180} x2={-30} y2={310} />
          <line x1={0} y1={180} x2={30} y2={310} />
          <line x1={0} y1={90} x2={-45} y2={145} />
          <line x1={0} y1={90} x2={45} y2={145} />
        </g>
        <path d="M 0 -60 Q 15 -100 0 -140" stroke="#94A3B8" strokeWidth={2.5} fill="none" opacity={0.3} />
        <text x={0} y={-150} fill="#94A3B8" fontSize={22} fontWeight="bold" textAnchor="middle">✕</text>
      </g>

      {/* 4. OUR HOST! (Position 4, x=1240) — Massive Glowing Golden Plume */}
      <g transform="translate(1240, 560)">
        {/* Colossal Billowing Golden Scent Plume */}
        <g opacity={0.88}>
          {/* Layer 1: Outer Warm Amber Glow */}
          <path
            d={`M -60 -50 C -150 -180 -180 -380 ${Math.sin(frame * 0.1) * 30} -550 C 180 -380 150 -180 60 -50 Z`}
            fill="#FEF08A"
            stroke="#F59E0B"
            strokeWidth={5}
            strokeDasharray="18 10"
          />
          {/* Layer 2: Inner Golden Core */}
          <path
            d={`M -35 -50 C -90 -160 -100 -320 ${Math.sin(frame * 0.15) * 20} -480 C 100 -320 90 -160 35 -50 Z`}
            fill="#FBBF24"
            fillOpacity={0.6}
            stroke="#D97706"
            strokeWidth={4}
          />
          {/* Floating aroma sparkle stars */}
          {[
            { x: -70, y: -200, r: 8 },
            { x: 55, y: -280, r: 10 },
            { x: -30, y: -390, r: 7 },
            { x: 60, y: -450, r: 9 },
          ].map((sp, idx) => (
            <circle
              key={idx}
              cx={sp.x + Math.sin(frame * 0.2 + idx) * 12}
              cy={sp.y - (((frame * 2 + idx * 30) % 120) * 1.5)}
              r={sp.r}
              fill="#F59E0B"
              stroke="#FFFFFF"
              strokeWidth={2}
            />
          ))}
        </g>

        {/* Host Stickman sweating buckets */}
        <ZennHostStickman x={0} y={0} scale={1.05} expression="sweating" armPose="flailing" />

        {/* Hand-Drawn Comic Label */}
        <g transform="translate(0, -380)">
          <rect x={-140} y={-30} width={280} height={60} rx={16} fill="#DC2626" stroke="#FFFFFF" strokeWidth={4} />
          <text x={0} y={12} fill="#FFFFFF" fontSize={30} fontWeight="900" textAnchor="middle" fontFamily="'Comic Sans MS', cursive, sans-serif">
            OPEN INVITATION!
          </text>
        </g>
      </g>

      {/* 5. Friend standing relaxed on right */}
      <g transform="translate(1600, 560)">
        <circle cx={0} cy={0} r={50} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={-16} cy={-6} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-16} cy={-6} r={4} fill={INK} />
        <circle cx={16} cy={-6} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={16} cy={-6} r={4} fill={INK} />
        <line x1={-10} y1={22} x2={10} y2={22} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none">
          <line x1={0} y1={50} x2={0} y2={180} />
          <line x1={0} y1={180} x2={-30} y2={310} />
          <line x1={0} y1={180} x2={30} y2={310} />
          <line x1={0} y1={90} x2={-45} y2={145} />
          <line x1={0} y1={90} x2={45} y2={145} />
        </g>
        <path d="M 0 -60 Q 15 -100 0 -140" stroke="#94A3B8" strokeWidth={2.5} fill="none" opacity={0.3} />
        <text x={0} y={-150} fill="#94A3B8" fontSize={22} fontWeight="bold" textAnchor="middle">✕</text>
      </g>

      {/* Curving Mosquito Flight diving straight to Host */}
      {(() => {
        const mProg = Math.min(Math.max((frame - 15) / 130, 0), 1);
        const mx = interpolate(mProg, [0, 0.6, 1], [100, 800, 1260]);
        const my = interpolate(mProg, [0, 0.6, 1], [180, 220, 480]);
        const mAng = interpolate(mProg, [0, 0.6, 1], [5, 10, 45]);
        return (
          <g>
            <path
              d="M 100 180 Q 750 200 1260 480"
              stroke={INK}
              strokeWidth={4.5}
              strokeDasharray="14 10"
              fill="none"
            />
            <ZennComicMosquito x={mx} y={my} scale={1.3} facing="right" angle={mAng} />
          </g>
        );
      })()}
    </svg>
  );
};

// ============================================================================
// 🎬 SCENE 4: Male Nectar (ref_25s) vs Female Feeding Eggs (ref_40s)
// ============================================================================
export const ZennFemaleFeedingScene: React.FC = () => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Hand-Drawn Paper Garden Environment */}
      <rect x={0} y={0} width={1920} height={820} fill="#FAF7F2" />
      <rect x={0} y={820} width={1920} height={260} fill="#15803D" />
      <line x1={0} y1={820} x2={1920} y2={820} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Grass Tufts along lawn */}
      {[120, 340, 600, 820, 1100, 1380, 1650, 1820].map((gx, i) => (
        <g key={i} stroke="#166534" strokeWidth={4} strokeLinecap="round">
          <line x1={gx} y1={820} x2={gx - 14} y2={790} />
          <line x1={gx} y1={820} x2={gx} y2={780} />
          <line x1={gx} y1={820} x2={gx + 14} y2={790} />
        </g>
      ))}

      {/* Comic Split Dividing Line down middle */}
      <line x1={960} y1={60} x2={960} y2={950} stroke={INK} strokeWidth={5} strokeDasharray="16 12" />

      {/* ================================================================ */}
      {/* LEFT: MALE MOSQUITO SIPPING NECTAR (ref_25s.jpg) */}
      {/* ================================================================ */}
      <g transform="translate(480, 0)">
        {/* Hand-Drawn Header */}
        <text x={0} y={120} fill="#16A34A" fontSize={56} fontWeight="900" textAnchor="middle" fontFamily="'Comic Sans MS', cursive, sans-serif">
          MALE ♂
        </text>
        <text x={0} y={165} fill="#18181B" fontSize={26} fontWeight="bold" textAnchor="middle">
          Feeds only on plant nectar 🌸
        </text>

        {/* Large Wildflower on Stalk */}
        <g transform="translate(0, 640)">
          {/* Curving green stem */}
          <path d="M 0 180 Q 20 100 -40 20" stroke="#16A34A" strokeWidth={10} fill="none" strokeLinecap="round" />
          <path d="M 10 120 Q 45 100 65 110" stroke="#16A34A" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* Flower Petals */}
          {Array.from({ length: 8 }).map((_, idx) => {
            const rad = (idx * 45 * Math.PI) / 180;
            const px = -40 + Math.cos(rad) * 65;
            const py = 20 + Math.sin(rad) * 65;
            return <circle key={idx} cx={px} cy={py} r={32} fill="#F472B6" stroke={INK} strokeWidth={4.5} />;
          })}
          {/* Golden Flower Center */}
          <circle cx={-40} cy={20} r={42} fill="#FACC15" stroke={INK} strokeWidth={5} />
          {/* Translucent Nectar droplet */}
          <circle cx={-40} cy={8} r={14} fill="#FEF08A" stroke={INK} strokeWidth={3} />
        </g>

        {/* Peaceful Male Mosquito with Plumose Bushy Antennae */}
        <ZennComicMosquito x={-20} y={540} scale={1.8} facing="left" angle={15} accessory="plumose_male" />

        {/* Peaceful Music Notes Floating */}
        <text x={-140} y={480} fill="#16A34A" fontSize={38} fontWeight="bold">♪</text>
        <text x={-90} y={430} fill="#16A34A" fontSize={32} fontWeight="bold">♫</text>
      </g>

      {/* ================================================================ */}
      {/* RIGHT: FEMALE MOSQUITO FEEDING EGGS (ref_40s.jpg) */}
      {/* ================================================================ */}
      <g transform="translate(1440, 0)">
        {/* Hand-Drawn Header */}
        <text x={0} y={120} fill="#BE123C" fontSize={56} fontWeight="900" textAnchor="middle" fontFamily="'Comic Sans MS', cursive, sans-serif">
          FEMALE ♀
        </text>
        <text x={0} y={165} fill="#18181B" fontSize={26} fontWeight="bold" textAnchor="middle">
          Feeding her children 👶
        </text>

        {/* Straw Nest with Cute Baby Mosquito Eggs */}
        <g transform="translate(60, 720)">
          {/* Woven Straw Basket / Cradle */}
          <path
            d="M -150 20 Q 0 80 150 20 L 130 90 Q 0 120 -130 90 Z"
            fill="#D97706"
            stroke={INK}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Cross-hatch straw strokes */}
          {[-100, -60, -20, 20, 60, 100].map((hx, i) => (
            <line key={i} x1={hx} y1={35} x2={hx + 20} y2={95} stroke="#B45309" strokeWidth={3.5} />
          ))}

          {/* 10 Cute Baby Eggs inside nest */}
          {[-90, -50, -10, 30, 70].map((ex, i) => (
            <g key={i} transform={`translate(${ex}, 15)`}>
              <ellipse cx={0} cy={0} rx={18} ry={25} fill="#FEF3C7" stroke={INK} strokeWidth={3.5} />
              {/* Cute little baby cartoon face on egg */}
              <circle cx={-6} cy={-4} r={3} fill={INK} />
              <circle cx={6} cy={-4} r={3} fill={INK} />
              <circle cx={0} cy={6} r={3.5} fill="#DC2626" />
            </g>
          ))}
        </g>

        {/* Hard-Hat Working Mom Mosquito Holding Blood Droplet */}
        <ZennComicMosquito
          x={-40}
          y={560}
          scale={1.8}
          facing="right"
          angle={-10}
          accessory="hardhat"
          holdingItem="blood_droplet"
        />

        {/* Loving Heart Floating */}
        <text x={80} y={480} fill="#EF4444" fontSize={48}>❤️</text>
      </g>
    </svg>
  );
};

// ============================================================================
// 🎬 SCENE 5: Night Navigation by Chemistry
// ============================================================================
export const ZennNightRadarScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Deep Night Sky */}
      <rect x={0} y={0} width={1920} height={820} fill="#0F172A" />
      <rect x={0} y={820} width={1920} height={260} fill="#020617" />
      <line x1={0} y1={820} x2={1920} y2={820} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Crescent Moon & Stars */}
      <g transform="translate(1650, 160)">
        <path d="M 0 -60 A 60 60 0 0 0 60 0 A 50 50 0 1 1 0 -60 Z" fill="#FEF08A" stroke={INK} strokeWidth={4} />
      </g>
      {[
        { x: 300, y: 120 },
        { x: 750, y: 80 },
        { x: 1200, y: 150 },
        { x: 920, y: 220 },
      ].map((st, i) => (
        <text key={i} x={st.x} y={st.y} fill="#FEF08A" fontSize={26}>✦</text>
      ))}

      {/* Distant Blurry Stickman Silhouette (Can't See Clearly) */}
      <g transform="translate(1500, 600)" opacity={0.28}>
        <ZennHostStickman x={0} y={0} scale={1.1} expression="neutral" welts={false} />
      </g>

      {/* Glowing Chemical Stream flowing from distant human to mosquito */}
      <path
        d={`M 1480 540 Q 1000 ${420 + Math.sin(frame * 0.1) * 30} 620 500`}
        stroke="#38BDF8"
        strokeWidth={8}
        strokeDasharray="20 12"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M 1480 600 Q 1000 ${520 + Math.cos(frame * 0.1) * 30} 620 540`}
        stroke="#F59E0B"
        strokeWidth={7}
        strokeDasharray="18 12"
        fill="none"
        strokeLinecap="round"
      />

      {/* Foreground Hero Mosquito with Radar HUD */}
      <g transform="translate(500, 520)">
        <ZennComicMosquito scale={2.3} facing="right" />

        {/* Circular Radar Scan HUD */}
        <circle cx={40} cy={20} r={110} stroke="#34D399" strokeWidth={4} fill="none" strokeDasharray="16 10" />
        <line
          x1={40}
          y1={20}
          x2={40 + Math.cos((frame * 4 * Math.PI) / 180) * 110}
          y2={20 + Math.sin((frame * 4 * Math.PI) / 180) * 110}
          stroke="#34D399"
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Radar Blip */}
        <circle cx={120} cy={15} r={8} fill="#22C55E" />

        {/* Hand-Drawn Comic Label with Generous Padding (No border clipping) */}
        <g transform="translate(40, -120)">
          <rect x={-180} y={-27} width={360} height={54} rx={14} fill="#065F46" stroke="#FFFFFF" strokeWidth={3.5} />
          <text x={0} y={8} fill="#FFFFFF" fontSize={21} fontWeight="900" textAnchor="middle" fontFamily="'Comic Sans MS', cursive, sans-serif">
            CHEMISTRY RADAR 📡
          </text>
        </g>
      </g>
    </svg>
  );
};

// ============================================================================
// 🎬 SCENE 6: Distance Scale — 50 Meters Across Field
// ============================================================================
export const ZennFiftyMetersScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Open Sky & Grass Pitch */}
      <rect x={0} y={0} width={1920} height={700} fill="#BAE6FD" />
      <rect x={0} y={700} width={1920} height={380} fill="#15803D" />
      <line x1={0} y1={700} x2={1920} y2={700} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Field Yard Markings */}
      {[-700, -420, -140, 140, 420, 700].map((tick, i) => (
        <g key={i} transform={`translate(${960 + tick}, 700)`}>
          <line x1={0} y1={-15} x2={0} y2={25} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />
          <text x={0} y={65} fill="#FFFFFF" fontSize={24} fontWeight="900" textAnchor="middle">
            {i * 10}m
          </text>
        </g>
      ))}

      {/* 50 METERS Measurement Line & End Brackets */}
      <g transform="translate(960, 420)">
        {/* Left and Right End Brackets */}
        <line x1={-680} y1={-40} x2={-680} y2={40} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={680} y1={-40} x2={680} y2={40} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Dashed Measurement Arrow Line */}
        <line x1={-680} y1={0} x2={680} y2={0} stroke="#FACC15" strokeWidth={7} strokeDasharray="18 12" />
        <polyline points="-650,-20 -680,0 -650,20" stroke="#FACC15" strokeWidth={7} fill="none" strokeLinecap="round" />
        <polyline points="650,-20 680,0 650,20" stroke="#FACC15" strokeWidth={7} fill="none" strokeLinecap="round" />

        {/* Bold Hand-Drawn 50 METERS Label */}
        <rect x={-200} y={-60} width={400} height={70} rx={16} fill="#0F172A" stroke="#FFFFFF" strokeWidth={4} />
        <text
          x={0}
          y={-12}
          fill="#FACC15"
          fontSize={44}
          fontWeight="900"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', cursive, sans-serif"
        >
          50 METERS
        </text>
        <text x={0} y={55} fill="#0F172A" fontSize={24} fontWeight="bold" textAnchor="middle">
          (HALF A FOOTBALL FIELD)
        </text>
      </g>

      {/* Host Stickman on Far Left Exhaling */}
      <ZennHostStickman x={240} y={540} scale={1.15} expression="exhaling" armPose="down" facing="right" />

      {/* Continuous Blue CO2 Breath Stream Drifting Across the Gap */}
      <path
        d={`M 300 520 Q 960 ${460 + Math.sin(frame * 0.1) * 35} 1650 500`}
        stroke="#38BDF8"
        strokeWidth={9}
        strokeDasharray="22 14"
        fill="none"
        strokeLinecap="round"
      />

      {/* Mosquito on Far Right Detecting Breath */}
      <ZennComicMosquito x={1680} y={500} scale={1.5} facing="left" />
    </svg>
  );
};

// ============================================================================
// 🎬 SCENE 7: Zigzagging Along the CO2 Breadcrumb Plume
// ============================================================================
export const ZennBreadcrumbsPlumeScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Mosquito advances from right to left along the breadcrumb plume
  const mosqProgress = Math.min(Math.max(frame / 183, 0), 1);
  const mosqX = interpolate(mosqProgress, [0, 1], [1600, 600]);
  const mosqY = 500 + Math.sin(frame * 0.22) * 70;
  const mosqTilt = Math.cos(frame * 0.22) * 25;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Twilight Backyard Environment */}
      <rect x={0} y={0} width={1920} height={740} fill="#1E293B" />
      <rect x={0} y={740} width={1920} height={340} fill="#2D5A27" />
      <line x1={0} y1={740} x2={1920} y2={740} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Fence posts */}
      {[200, 500, 800, 1100, 1400, 1700].map((fx, i) => (
        <g key={i} transform={`translate(${fx}, 740)`}>
          <rect x={-20} y={-160} width={40} height={160} fill="#8D5B3A" stroke={INK} strokeWidth={4.5} />
          <polygon points="-20,-160 0,-185 20,-160" fill="#8D5B3A" stroke={INK} strokeWidth={4.5} />
        </g>
      ))}

      {/* Host on Far Left Exhaling */}
      <ZennHostStickman x={240} y={560} scale={1.15} expression="exhaling" facing="right" />

      {/* Trail of CO2 Breadcrumbs (Puffs) */}
      {[340, 560, 780, 1000, 1220, 1440, 1660].map((bx, i) => {
        const by = 500 + Math.sin(i * 1.2) * 60;
        const bScale = 1 + i * 0.15;
        return (
          <g key={i} transform={`translate(${bx}, ${by}) scale(${bScale})`}>
            {/* Translucent Blue Breadcrumb Cloud Puff */}
            <circle cx={0} cy={0} r={28} fill="#38BDF8" fillOpacity={0.35} stroke="#38BDF8" strokeWidth={3} />
            <circle cx={-10} cy={-6} r={18} fill="#E0F2FE" fillOpacity={0.4} />
            <text x={0} y={6} fill="#0284C7" fontSize={16} fontWeight="bold" textAnchor="middle">
              CO₂
            </text>
          </g>
        );
      })}

      {/* Mosquito Zigzagging upwind along plume */}
      <g>
        <ZennComicMosquito x={mosqX} y={mosqY} scale={2.0} facing="left" angle={mosqTilt} />
      </g>
    </svg>
  );
};

// ============================================================================
// 🎬 SCENE 8: Small Person vs Larger Person Exhalation Volume
// ============================================================================
export const ZennLargerExhaleScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Mosquito turns to the right at relative frame 60
  const looksRight = frame >= 60;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Clean Warm Studio Parchment */}
      <rect x={0} y={0} width={1920} height={780} fill="#FAF7F2" />
      <rect x={0} y={780} width={1920} height={300} fill={FLOOR_UMBER} />
      <line x1={0} y1={780} x2={1920} y2={780} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* LEFT: Smaller Stick Figure */}
      <g transform="translate(420, 580) scale(0.85)">
        <circle cx={0} cy={0} r={46} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={14} cy={-6} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={17} cy={-6} r={4} fill={INK} />
        <ellipse cx={22} cy={18} rx={8} ry={10} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none">
          <line x1={0} y1={46} x2={0} y2={170} />
          <line x1={0} y1={170} x2={-25} y2={300} />
          <line x1={0} y1={170} x2={25} y2={300} />
          <line x1={0} y1={85} x2={-40} y2={140} />
          <line x1={0} y1={85} x2={40} y2={140} />
        </g>
        {/* Modest Cute Breath Cloud */}
        <g transform="translate(80, 10)">
          <path d="M 0 0 Q 35 -20 60 0 Q 75 25 50 40 Q 20 40 0 0" fill="#BAE6FD" stroke="#38BDF8" strokeWidth={3} />
          <text x={40} y={-30} fill="#64748B" fontSize={24} fontWeight="bold" textAnchor="middle">
            Small Puff
          </text>
        </g>
      </g>

      {/* RIGHT: Taller & Larger Stick Figure Exhaling Enormous Plume */}
      <g transform="translate(1500, 480) scale(1.45)">
        <circle cx={0} cy={0} r={58} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        <circle cx={-18} cy={-8} r={15} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        <circle cx={-21} cy={-8} r={5} fill={INK} />
        <ellipse cx={-25} cy={22} rx={12} ry={15} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <g stroke={INK} strokeWidth={7} strokeLinecap="round" fill="none">
          <line x1={0} y1={58} x2={0} y2={195} />
          <line x1={0} y1={195} x2={-45} y2={330} />
          <line x1={0} y1={195} x2={45} y2={330} />
          <line x1={0} y1={100} x2={-60} y2={160} />
          <line x1={0} y1={100} x2={60} y2={160} />
        </g>

        {/* GIGANTIC Billowing Rolling CO2 Cloud */}
        <g transform="translate(-100, -40)">
          <path
            d="M 0 40 Q -120 10 -180 -60 Q -240 -120 -160 -200 Q -80 -280 40 -200 Q 120 -150 60 -60 Z"
            fill="#38BDF8"
            fillOpacity={0.65}
            stroke="#0284C7"
            strokeWidth={5}
          />
          <path
            d="M -30 20 Q -100 0 -130 -50 Q -160 -100 -100 -150 Q -40 -180 20 -140 Z"
            fill="#E0F2FE"
            fillOpacity={0.7}
            stroke="#0284C7"
            strokeWidth={3.5}
          />
          <text
            x={-80}
            y={-100}
            fill="#0369A1"
            fontSize={36}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            MORE CO₂!
          </text>
        </g>
      </g>

      {/* Center Mosquito sampling and deciding */}
      <g transform={`translate(960, 480)`}>
        <ZennComicMosquito
          scale={2.0}
          facing={looksRight ? 'right' : 'left'}
          angle={looksRight ? 15 : -10}
        />
        {/* Rejection X over small puff or exclamation over big */}
        {looksRight ? (
          <text x={60} y={-80} fill="#DC2626" fontSize={60} fontWeight="900">
            !
          </text>
        ) : (
          <text x={-60} y={-80} fill="#94A3B8" fontSize={50} fontWeight="bold">
            ?
          </text>
        )}
      </g>
    </svg>
  );
};

// ============================================================================
// 🎬 SCENE 9: Pregnant Women (+21% CO2) Comparison
// ============================================================================
export const ZennPregnantComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Sunny Porch */}
      <rect x={0} y={0} width={1920} height={780} fill="#FFFBEB" />
      <rect x={0} y={780} width={1920} height={300} fill="#78350F" />
      <line x1={0} y1={780} x2={1920} y2={780} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Dividing Divider */}
      <line x1={960} y1={80} x2={960} y2={920} stroke={INK} strokeWidth={5} strokeDasharray="16 12" />

      {/* LEFT: Non-Pregnant Friend */}
      <g transform="translate(480, 540)">
        <circle cx={0} cy={0} r={50} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={14} cy={-6} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={17} cy={-6} r={4} fill={INK} />
        <line x1={8} y1={20} x2={22} y2={20} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none">
          <line x1={0} y1={50} x2={0} y2={180} />
          <line x1={0} y1={180} x2={-30} y2={310} />
          <line x1={0} y1={180} x2={30} y2={310} />
          <line x1={0} y1={90} x2={-45} y2={145} />
          <line x1={0} y1={90} x2={45} y2={145} />
        </g>
        {/* Normal breath puff */}
        <ellipse cx={80} cy={20} rx={45} ry={25} fill="#BAE6FD" fillOpacity={0.6} stroke="#38BDF8" strokeWidth={3} />
        <text x={0} y={-100} fill="#64748B" fontSize={32} fontWeight="900" textAnchor="middle">
          AVERAGE CO₂
        </text>
        <text x={0} y={360} fill="#16A34A" fontSize={30} fontWeight="900" textAnchor="middle">
          ✓ 0 MOSQUITOES
        </text>
      </g>

      {/* RIGHT: Pregnant Woman with Round Belly Bump & +21% CO2 */}
      <g transform="translate(1440, 540)">
        <circle cx={0} cy={0} r={50} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={-14} cy={-6} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-17} cy={-6} r={4} fill={INK} />
        <path d="M -20 22 Q -10 30 0 22" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {/* Body with Round Pregnant Belly Bump */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" fill="none">
          <line x1={0} y1={50} x2={0} y2={180} />
          {/* Pregnant Belly Bump Path */}
          <path d="M 0 75 Q -65 115 0 155" fill="#F472B6" fillOpacity={0.4} stroke={INK} strokeWidth={5.5} />
          <line x1={0} y1={180} x2={-30} y2={310} />
          <line x1={0} y1={180} x2={30} y2={310} />
          {/* Gentle hand resting on belly */}
          <line x1={0} y1={90} x2={-35} y2={120} />
          <line x1={-35} y1={120} x2={-15} y2={135} />
          <line x1={0} y1={90} x2={35} y2={145} />
        </g>

        {/* Larger +21% CO2 Billowing Plume */}
        <g transform="translate(-100, 10)">
          <path
            d="M 0 10 Q -80 -20 -120 -80 Q -150 -140 -80 -180 Q 0 -150 40 -80 Z"
            fill="#38BDF8"
            fillOpacity={0.7}
            stroke="#0284C7"
            strokeWidth={4.5}
          />
        </g>

        {/* Bold Comic Stamp: +21% CO2 */}
        <g transform="translate(0, -100)">
          <rect x={-110} y={-32} width={220} height={64} rx={14} fill="#DC2626" stroke="#FFFFFF" strokeWidth={4} />
          <text
            x={0}
            y={12}
            fill="#FFFFFF"
            fontSize={36}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive, sans-serif"
          >
            +21% CO₂
          </text>
        </g>

        {/* 2 Buzzing Cartoon Mosquitoes orbiting her */}
        <g transform={`translate(${-120 + Math.sin(frame * 0.15) * 35}, ${-60 + Math.cos(frame * 0.2) * 25})`}>
          <ZennComicMosquito scale={1.1} facing="left" />
        </g>
        <g transform={`translate(${110 + Math.cos(frame * 0.18) * 30}, ${40 + Math.sin(frame * 0.22) * 25})`}>
          <ZennComicMosquito scale={1.05} facing="right" />
        </g>

        <text x={0} y={360} fill="#DC2626" fontSize={32} fontWeight="900" textAnchor="middle">
          ⚡ NEARLY 2× BITES
        </text>
      </g>
    </svg>
  );
};

// ============================================================================
// 🎬 SCENE 10: "An Airborne Chemist" — Test Tube & Zoom Transition
// ============================================================================
export const ZennAirborneChemistScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Cinematic macro zoom into host's skin pore starting at frame 180
  const zoomProg = Math.min(Math.max((frame - 180) / 78, 0), 1);
  const camScale = interpolate(zoomProg, [0, 1], [1.0, 3.2]);
  const camX = interpolate(zoomProg, [0, 1], [0, -2200]);
  const camY = interpolate(zoomProg, [0, 1], [0, -1200]);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <g transform={`translate(${camX}, ${camY}) scale(${camScale})`}>
        {/* Science Workshop Blackboard Backdrop */}
        <rect x={0} y={0} width={1920} height={740} fill="#1E293B" />
        <rect x={0} y={740} width={1920} height={340} fill="#6B4423" />
        <line x1={0} y1={740} x2={1920} y2={740} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Faint Chalk Chemical Formulas on Board */}
        <g fill="#94A3B8" opacity={0.35} fontSize={30} fontFamily="'Comic Sans MS', cursive">
          <text x={220} y={160}>CO₂ + C₃H₆O₃</text>
          <text x={680} y={240}>1-octen-3-ol 🧪</text>
          <text x={1200} y={160}>pH 5.5 + LIPIDS</text>
        </g>

        {/* The Hero Mosquito: Airborne Chemist */}
        <g transform="translate(680, 500)">
          <ZennComicMosquito
            scale={2.4}
            facing="right"
            accessory="spectacles"
            holdingItem="test_tube"
          />
          {/* Hand-Drawn Title */}
          <g transform="translate(0, -220)">
            <rect x={-180} y={-30} width={360} height={60} rx={16} fill="#0F766E" stroke="#FFFFFF" strokeWidth={4} />
            <text
              x={0}
              y={12}
              fill="#FFFFFF"
              fontSize={30}
              fontWeight="900"
              textAnchor="middle"
              fontFamily="'Comic Sans MS', cursive, sans-serif"
            >
              AIRBORNE CHEMIST 🔬
            </text>
          </g>
        </g>

        {/* The Experiment: Host on Examination Stool */}
        <g transform="translate(1420, 520)">
          {/* Exam Stool */}
          <ellipse cx={0} cy={180} rx={60} ry={16} fill="#8D5B3A" stroke={INK} strokeWidth={5} />
          <line x1={-35} y1={185} x2={-45} y2={310} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <line x1={35} y1={185} x2={45} y2={310} stroke={INK} strokeWidth={6} strokeLinecap="round" />
          <line x1={0} y1={185} x2={0} y2={310} stroke={INK} strokeWidth={6} strokeLinecap="round" />

          {/* Host Sitting Nervously */}
          <ZennHostStickman x={0} y={0} scale={1.15} expression="sweating" armPose="sitting" />

          {/* Patient Tag */}
          <g transform="translate(45, 120) rotate(12)">
            <rect x={-40} y={-16} width={80} height={32} rx={6} fill="#FEF08A" stroke={INK} strokeWidth={2.5} />
            <text x={0} y={6} fill={INK} fontSize={14} fontWeight="900" textAnchor="middle">
              PATIENT #1
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
};
