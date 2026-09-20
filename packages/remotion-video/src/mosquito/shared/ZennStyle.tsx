import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const INK_BLACK = '#18181B';
export const VICTIM_RED = '#EF4444';
export const MOSQUITO_BODY = '#556877';
export const MOSQUITO_WING = '#E2F1F8';

/**
 * 🎨 Upgraded Zenn-Style Stickman
 * Incorporates YouTube reference (U-QW-HkDOmA) & Production Blueprint (STICKY_MAN_ANIMATION_AUTOMATION.md):
 * - Large white circle head with hand-drawn ink stroke
 * - 3 spiky hairs for the bite magnet
 * - Round glasses for the calm friend
 * - Expressive cartoon eyes with directional pupils & reactive eyebrows
 * - Parallel vertical legs (no awkward tripod) with outward-pointing feet
 * - Ground shadow under feet
 * - Optional stylish T-shirt (e.g. #2563EB royal blue for host, #10B981 emerald for friend)
 * - Red welt bite dots
 */
export interface ZennStickmanProps {
  x: number;
  y: number;
  scale?: number;
  hasSpikyHair?: boolean;
  hasGlasses?: boolean;
  hasWelts?: boolean;
  shirtColor?: string;
  eyes?: 'normal' | 'worried' | 'angry' | 'side_left' | 'side_right' | 'looking_up' | 'shut';
  eyebrows?: 'neutral' | 'worried' | 'angry' | 'surprised';
  mouth?: 'neutral' | 'worried' | 'frown' | 'shock_o' | 'smirk';
  pose?:
    | 'standing_idle'
    | 'sitting_sofa'
    | 'swatting_ear'
    | 'flailing'
    | 'wearing_winter_coat'
    | 'opening_door'
    | 'holding_magnifier';
  weltCount?: number;
}

export const ZennStickman: React.FC<ZennStickmanProps> = ({
  x,
  y,
  scale = 1,
  hasSpikyHair = false,
  hasGlasses = false,
  hasWelts = false,
  shirtColor = 'none',
  eyes = 'normal',
  eyebrows = 'neutral',
  mouth = 'neutral',
  pose = 'standing_idle',
  weltCount = 5,
}) => {
  const frame = useCurrentFrame();
  const breatheY = Math.sin(frame * 0.08) * 2.5;

  let pX = 0;
  let pY = 0;
  if (eyes === 'side_left') {
    pX = -6;
    pY = 0;
  } else if (eyes === 'side_right') {
    pX = 6;
    pY = 0;
  } else if (eyes === 'looking_up') {
    pX = 2;
    pY = -6;
  } else if (eyes === 'worried') {
    pX = 4;
    pY = -3;
  }

  const weltPositions = [
    { x: -42, y: -10 },
    { x: 44, y: 15 },
    { x: -46, y: 110 },
    { x: -28, y: 85 },
    { x: 42, y: 100 },
    { x: -18, y: 215 },
    { x: 26, y: 235 },
  ];

  const hasShirt = shirtColor && shirtColor !== 'none';

  return (
    <g transform={`translate(${x}, ${y + breatheY}) scale(${scale})`}>
      {/* 🌑 Ground Shadow Ellipse */}
      {pose !== 'sitting_sofa' && (
        <ellipse cx={0} cy={286} rx={46} ry={12} fill="#000000" opacity={0.3} />
      )}

      {/* ============================================================== */}
      {/* 1. BODY & LIMBS                                                */}
      {/* ============================================================== */}

      {/* T-Shirt Torso if enabled */}
      {hasShirt && pose !== 'wearing_winter_coat' && pose !== 'sitting_sofa' && (
        <path
          d="M -22 65 Q 0 75 22 65 L 48 85 L 36 120 L 22 105 L 22 160 L -22 160 L -22 105 L -36 120 L -48 85 Z"
          fill={shirtColor}
          stroke={INK_BLACK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      )}

      {pose === 'sitting_sofa' && (
        <g stroke={INK_BLACK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Spine */}
          {!hasShirt && <line x1={0} y1={48} x2={0} y2={145} />}
          {hasShirt && (
            <path
              d="M -22 65 Q 0 75 22 65 L 45 85 L 35 115 L 22 105 L 22 145 L -22 145 L -22 105 L -35 115 L -45 85 Z"
              fill={shirtColor}
              stroke={INK_BLACK}
              strokeWidth={5}
              strokeLinejoin="round"
            />
          )}

          {/* Lap (upper legs forward) */}
          <line x1={-16} y1={145} x2={-45} y2={185} />
          <line x1={16} y1={145} x2={25} y2={185} />
          {/* Lower legs down */}
          <line x1={-45} y1={185} x2={-45} y2={265} />
          <line x1={25} y1={185} x2={25} y2={265} />
          {/* Feet */}
          <line x1={-45} y1={265} x2={-32} y2={270} />
          <line x1={25} y1={265} x2={38} y2={270} />

          {/* Arms */}
          {hasGlasses ? (
            <g>
              <line x1={0} y1={75} x2={-35} y2={110} />
              <line x1={-35} y1={110} x2={-15} y2={140} />
              <line x1={0} y1={75} x2={35} y2={110} />
              <line x1={35} y1={110} x2={15} y2={140} />
            </g>
          ) : (
            <g>
              <line x1={0} y1={75} x2={-50} y2={120} />
              <line x1={-50} y1={120} x2={-80} y2={140} />
              <line x1={0} y1={75} x2={45} y2={100} />
              <line x1={45} y1={100} x2={28} y2={15} />
            </g>
          )}
        </g>
      )}

      {pose === 'standing_idle' && (
        <g stroke={INK_BLACK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {!hasShirt && <line x1={0} y1={48} x2={0} y2={165} />}
          {/* Parallel Vertical Legs */}
          <line x1={-16} y1={hasShirt ? 160 : 130} x2={-16} y2={280} />
          <line x1={-16} y1={280} x2={-32} y2={280} />
          <line x1={16} y1={hasShirt ? 160 : 130} x2={16} y2={280} />
          <line x1={16} y1={280} x2={32} y2={280} />
          {/* Arms */}
          <line x1={-22} y1={80} x2={-42} y2={160} />
          <line x1={22} y1={80} x2={42} y2={160} />
        </g>
      )}

      {pose === 'swatting_ear' && (
        <g stroke={INK_BLACK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {!hasShirt && <line x1={0} y1={48} x2={0} y2={165} />}
          {/* Parallel Vertical Legs */}
          <line x1={-16} y1={hasShirt ? 160 : 130} x2={-16} y2={280} />
          <line x1={-16} y1={280} x2={-32} y2={280} />
          <line x1={16} y1={hasShirt ? 160 : 130} x2={16} y2={280} />
          <line x1={16} y1={280} x2={32} y2={280} />
          {/* Left arm down */}
          <line x1={-22} y1={80} x2={-38} y2={160} />
          {/* Right arm bent up swatting ear */}
          <line x1={22} y1={80} x2={50} y2={110} />
          <line x1={50} y1={110} x2={35} y2={-5} />
        </g>
      )}

      {pose === 'flailing' && (
        <g stroke={INK_BLACK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={48} x2={Math.sin(frame * 0.5) * 6} y2={165} />
          <line x1={-16} y1={160} x2={-30} y2={280} />
          <line x1={-30} y1={280} x2={-44} y2={280} />
          <line x1={16} y1={160} x2={30} y2={280} />
          <line x1={30} y1={280} x2={44} y2={280} />
          {/* Wild Flailing Arms */}
          <line x1={0} y1={75} x2={-60 + Math.sin(frame * 0.9) * 25} y2={40 + Math.cos(frame * 0.9) * 35} />
          <line x1={0} y1={75} x2={60 + Math.cos(frame * 0.8) * 25} y2={30 + Math.sin(frame * 0.8) * 35} />
          {/* Motion lines */}
          <path d="M -80 30 Q -50 -10 -20 20" stroke="rgba(24,24,27,0.35)" strokeWidth={3} />
          <path d="M 80 20 Q 50 -20 20 10" stroke="rgba(24,24,27,0.35)" strokeWidth={3} />
        </g>
      )}

      {pose === 'wearing_winter_coat' && (
        <g>
          {/* Heavy Winter Turtleneck / Hoodie */}
          <path
            d="M -38 75 Q -55 120 -50 170 L 50 170 Q 55 120 38 75 Z"
            fill="#1E293B"
            stroke={INK_BLACK}
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Puffy Sleeves */}
          <path d="M -38 78 L -70 145 L -52 155 L -26 95 Z" fill="#1E293B" stroke={INK_BLACK} strokeWidth={5} />
          <path d="M 38 78 L 70 145 L 52 155 L 26 95 Z" fill="#1E293B" stroke={INK_BLACK} strokeWidth={5} />
          {/* Legs */}
          <g stroke={INK_BLACK} strokeWidth={5} strokeLinecap="round">
            <line x1={-18} y1={170} x2={-18} y2={280} />
            <line x1={-18} y1={280} x2={-32} y2={280} />
            <line x1={18} y1={170} x2={18} y2={280} />
            <line x1={18} y1={280} x2={32} y2={280} />
          </g>
        </g>
      )}

      {pose === 'opening_door' && (
        <g stroke={INK_BLACK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {!hasShirt && <line x1={0} y1={48} x2={0} y2={165} />}
          <line x1={-16} y1={hasShirt ? 160 : 130} x2={-16} y2={280} />
          <line x1={-16} y1={280} x2={-32} y2={280} />
          <line x1={16} y1={hasShirt ? 160 : 130} x2={16} y2={280} />
          <line x1={16} y1={280} x2={32} y2={280} />
          <line x1={-22} y1={80} x2={-55} y2={95} />
          <line x1={22} y1={80} x2={30} y2={155} />
        </g>
      )}

      {pose === 'holding_magnifier' && (
        <g stroke={INK_BLACK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {!hasShirt && <line x1={0} y1={48} x2={0} y2={165} />}
          <line x1={-16} y1={hasShirt ? 160 : 130} x2={-16} y2={280} />
          <line x1={-16} y1={280} x2={-32} y2={280} />
          <line x1={16} y1={hasShirt ? 160 : 130} x2={16} y2={280} />
          <line x1={16} y1={280} x2={32} y2={280} />
          <line x1={-22} y1={80} x2={-38} y2={160} />
          <line x1={22} y1={80} x2={45} y2={100} />
          <line x1={45} y1={100} x2={65} y2={50} />
          {/* Magnifier Handle */}
          <line x1={65} y1={50} x2={82} y2={20} stroke="#92400E" strokeWidth={7} />
          {/* Magnifier Lens */}
          <circle cx={96} cy={-2} r={28} stroke={INK_BLACK} strokeWidth={5} fill="rgba(224, 242, 254, 0.45)" />
        </g>
      )}

      {/* ============================================================== */}
      {/* 2. HEAD (LARGE WHITE CIRCLE)                                   */}
      {/* ============================================================== */}
      <circle cx={0} cy={0} r={48} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={4.5} />

      {hasSpikyHair && (
        <g stroke={INK_BLACK} strokeWidth={4} strokeLinecap="round">
          <line x1={-12} y1={-46} x2={-16} y2={-75} />
          <line x1={0} y1={-48} x2={0} y2={-82} />
          <line x1={12} y1={-46} x2={20} y2={-74} />
        </g>
      )}

      {/* 3. Eyes */}
      {eyes !== 'shut' ? (
        <g>
          <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={2.8} />
          <circle cx={-18 + pX} cy={-6 + pY} r={5} fill={INK_BLACK} />
          <circle cx={-18 + pX - 1.5} cy={-6 + pY - 1.5} r={1.5} fill="#FFFFFF" />

          <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={2.8} />
          <circle cx={18 + pX} cy={-6 + pY} r={5} fill={INK_BLACK} />
          <circle cx={18 + pX - 1.5} cy={-6 + pY - 1.5} r={1.5} fill="#FFFFFF" />
        </g>
      ) : (
        <g stroke={INK_BLACK} strokeWidth={3.5} strokeLinecap="round">
          <line x1={-25} y1={-10} x2={-12} y2={-4} />
          <line x1={-25} y1={2} x2={-12} y2={-4} />
          <line x1={25} y1={-10} x2={12} y2={-4} />
          <line x1={25} y1={2} x2={12} y2={-4} />
        </g>
      )}

      {hasGlasses && (
        <g stroke={INK_BLACK} strokeWidth={4} fill="none">
          <circle cx={-18} cy={-6} r={18} />
          <circle cx={18} cy={-6} r={18} />
          <line x1={-1} y1={-6} x2={1} y2={-6} />
          <line x1={-36} y1={-6} x2={-46} y2={-8} />
          <line x1={36} y1={-6} x2={46} y2={-8} />
        </g>
      )}

      {/* 4. Eyebrows */}
      <g stroke={INK_BLACK} strokeWidth={3.8} strokeLinecap="round" fill="none">
        {eyebrows === 'neutral' && (
          <>
            <line x1={-28} y1={-25} x2={-8} y2={-25} />
            <line x1={8} y1={-25} x2={28} y2={-25} />
          </>
        )}
        {eyebrows === 'worried' && (
          <>
            <line x1={-28} y1={-20} x2={-8} y2={-28} />
            <line x1={8} y1={-28} x2={28} y2={-20} />
          </>
        )}
        {eyebrows === 'angry' && (
          <>
            <line x1={-28} y1={-28} x2={-8} y2={-20} />
            <line x1={8} y1={-20} x2={28} y2={-28} />
          </>
        )}
        {eyebrows === 'surprised' && (
          <>
            <path d="M -28 -24 Q -18 -34 -8 -24" />
            <path d="M 8 -24 Q 18 -34 28 -24" />
          </>
        )}
      </g>

      {/* 5. Mouth */}
      <g stroke={INK_BLACK} strokeWidth={3.5} strokeLinecap="round" fill="none">
        {mouth === 'neutral' && <line x1={-10} y1={22} x2={10} y2={22} />}
        {mouth === 'worried' && <path d="M -12 24 Q 0 16 12 24" />}
        {mouth === 'frown' && <path d="M -14 26 Q 0 14 14 26" />}
        {mouth === 'shock_o' && (
          <ellipse cx={0} cy={22} rx={8} ry={12} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={3.5} />
        )}
        {mouth === 'smirk' && <path d="M -8 20 Q 2 26 12 18" />}
      </g>

      {/* 6. Welts */}
      {hasWelts && (
        <g fill={VICTIM_RED}>
          {weltPositions.slice(0, weltCount).map((w, idx) => (
            <circle key={idx} cx={w.x} cy={w.y} r={7} />
          ))}
        </g>
      )}

      {/* Sweat Droplets */}
      {(eyebrows === 'worried' || pose === 'wearing_winter_coat') && (
        <g fill="#38BDF8" opacity={0.85}>
          <path d="M 44 -18 C 40 -26 48 -26 44 -32 C 40 -26 36 -26 44 -18 Z" />
          <path d="M -44 -15 C -40 -23 -48 -23 -44 -29 C -40 -23 -36 -23 -44 -15 Z" />
        </g>
      )}
    </g>
  );
};

/**
 * 🦟 Zenn-Style Mosquito
 */
export interface ZennMosquitoProps {
  x: number;
  y: number;
  scale?: number;
  angle?: number;
  facing?: 'left' | 'right';
  hasBriefcase?: boolean;
}

export const ZennMosquito: React.FC<ZennMosquitoProps> = ({
  x,
  y,
  scale = 1,
  angle = 0,
  facing = 'left',
  hasBriefcase = false,
}) => {
  const frame = useCurrentFrame();
  const wingFlutter = Math.sin(frame * 1.8) * 16;
  const hoverY = Math.sin(frame * 0.25) * 6;
  const flipX = facing === 'left' ? 1 : -1;

  return (
    <g transform={`translate(${x}, ${y + hoverY}) rotate(${angle}) scale(${scale * flipX}, ${scale})`}>
      <path
        d="M 15 15 C 35 5 65 15 65 35 C 65 55 35 60 15 45 Z"
        fill={MOSQUITO_BODY}
        stroke={INK_BLACK}
        strokeWidth={4.5}
        strokeLinejoin="round"
      />
      <path
        d="M 5 25 C -5 20 -15 35 -5 45 C 5 50 15 45 15 25 Z"
        fill="#455A64"
        stroke={INK_BLACK}
        strokeWidth={4.5}
      />
      <circle cx={-18} cy={35} r={14} fill="#455A64" stroke={INK_BLACK} strokeWidth={4} />
      <circle cx={-20} cy={32} r={8} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={2.5} />
      <circle cx={-22} cy={32} r={3.5} fill={INK_BLACK} />
      <circle cx={-23} cy={31} r={1} fill="#FFFFFF" />

      <path d="M -24 24 Q -32 10 -38 15" stroke={INK_BLACK} strokeWidth={2.5} fill="none" />
      <path d="M -22 22 Q -28 6 -32 10" stroke={INK_BLACK} strokeWidth={2.5} fill="none" />

      <polygon points="-30,34 -85,68 -28,40" fill={INK_BLACK} />

      <g stroke={INK_BLACK} strokeWidth={3.8} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M -12 45 L -25 70 L -45 95" />
        <path d="M -5 48 L -15 75 L -30 100" />
        <path d="M 12 48 L 15 80 L 0 110" />
        <path d="M 22 48 L 30 82 L 20 115" />
        <path d="M 38 45 L 60 70 L 80 88" />
        <path d="M 48 40 L 75 62 L 98 75" />
      </g>

      <g transform={`translate(15, 20) rotate(${-25 + wingFlutter})`}>
        <ellipse
          cx={-30}
          cy={-30}
          rx={38}
          ry={14}
          transform="rotate(35 -30 -30)"
          fill={MOSQUITO_WING}
          stroke={INK_BLACK}
          strokeWidth={3.8}
        />
        <line x1={-55} y1={-48} x2={-5} y2={-12} stroke={INK_BLACK} strokeWidth={2} />
      </g>

      <g transform={`translate(22, 16) rotate(${-10 - wingFlutter})`}>
        <ellipse
          cx={-28}
          cy={-32}
          rx={38}
          ry={14}
          transform="rotate(25 -28 -32)"
          fill={MOSQUITO_WING}
          stroke={INK_BLACK}
          strokeWidth={3.8}
        />
      </g>

      {hasBriefcase && (
        <g transform="translate(-10, 80)">
          <path d="M 14 0 Q 25 -10 36 0" stroke={INK_BLACK} strokeWidth={3.5} fill="none" />
          <rect x={0} y={0} width={50} height={38} rx={4} fill="#8D5B3A" stroke={INK_BLACK} strokeWidth={3.8} />
          <rect x={12} y={10} width={6} height={10} fill="#FACC15" stroke={INK_BLACK} strokeWidth={1.5} />
          <rect x={32} y={10} width={6} height={10} fill="#FACC15" stroke={INK_BLACK} strokeWidth={1.5} />
        </g>
      )}
    </g>
  );
};

/**
 * 🛋️ Hand-Drawn Teal Sofa
 */
export const ZennSofa: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={-280} y={-140} width={560} height={150} rx={12} fill="#5E9CA0" stroke={INK_BLACK} strokeWidth={5} strokeLinejoin="round" />
      <line x1={0} y1={-140} x2={0} y2={10} stroke={INK_BLACK} strokeWidth={4.5} />
      <rect x={-310} y={0} width={620} height={130} rx={10} fill="#538D91" stroke={INK_BLACK} strokeWidth={5} strokeLinejoin="round" />
      <line x1={-310} y1={40} x2={310} y2={40} stroke={INK_BLACK} strokeWidth={4.5} />
      <line x1={0} y1={0} x2={0} y2={40} stroke={INK_BLACK} strokeWidth={4.5} />
      <rect x={-355} y={-30} width={70} height={160} rx={8} fill="#66A5A9" stroke={INK_BLACK} strokeWidth={5} strokeLinejoin="round" />
      <rect x={285} y={-30} width={70} height={160} rx={8} fill="#66A5A9" stroke={INK_BLACK} strokeWidth={5} strokeLinejoin="round" />
    </g>
  );
};

/**
 * 📰 Doodle Newspaper
 */
export const ZennNewspaper: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={-55} y={-70} width={110} height={140} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={4} strokeLinejoin="round" />
      <line x1={0} y1={-70} x2={0} y2={70} stroke={INK_BLACK} strokeWidth={3} />
      <rect x={-45} y={-60} width={40} height={14} fill="#D1D5DB" stroke={INK_BLACK} strokeWidth={2} />
      <rect x={5} y={-60} width={40} height={14} fill="#D1D5DB" stroke={INK_BLACK} strokeWidth={2} />
      {[-35, -20, -5, 10, 25, 40, 55].map((ly, i) => (
        <React.Fragment key={i}>
          <line x1={-45} y1={ly} x2={-10} y2={ly} stroke={INK_BLACK} strokeWidth={2.5} />
          <line x1={10} y1={ly} x2={45} y2={ly} stroke={INK_BLACK} strokeWidth={2.5} />
        </React.Fragment>
      ))}
    </g>
  );
};

/**
 * 🕯️ Citronella Candle Bucket
 */
export const ZennCitronella: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const smokeWiggle = Math.sin(frame * 0.15 + x) * 8;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={40} rx={24} ry={7} fill="#000000" opacity={0.3} />
      <polygon points="-25,0 25,0 20,40 -20,40" fill="#FACC15" stroke={INK_BLACK} strokeWidth={4} strokeLinejoin="round" />
      <ellipse cx={0} cy={0} rx={25} ry={8} fill="#FEF08A" stroke={INK_BLACK} strokeWidth={3.5} />
      <ellipse cx={0} cy={-10} rx={6} ry={10} fill="#F97316" />
      <ellipse cx={0} cy={-8} rx={3} ry={6} fill="#FEF08A" />
      <path
        d={`M 0 -18 Q ${smokeWiggle} -45 ${-smokeWiggle} -75 Q ${smokeWiggle} -105 0 -130`}
        stroke="#9CA3AF"
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
        opacity={0.65}
      />
    </g>
  );
};

/**
 * 💭 Comic Thought Balloons (Cursed / Genetic / Diet)
 */
export const ZennComicIcons: React.FC<{
  type: 'cursed' | 'genetic' | 'diet';
  x: number;
  y: number;
  scale?: number;
}> = ({ type, x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <ellipse cx={0} cy={0} rx={85} ry={70} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={4.5} />
      <circle cx={-40} cy={75} r={8} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={3.5} />
      <circle cx={-55} cy={95} r={4.5} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={3} />

      {type === 'cursed' && (
        <g transform="translate(0, -5)">
          <polygon points="0,-45 -35,15 35,15" fill="#8B5CF6" stroke={INK_BLACK} strokeWidth={4} strokeLinejoin="round" />
          <ellipse cx={0} cy={15} rx={50} ry={10} fill="#7C3AED" stroke={INK_BLACK} strokeWidth={4} />
          <path d="M -40 -15 L -35 -15 L -35 -20 L -35 -15 L -30 -15" stroke="#FACC15" strokeWidth={3} />
          <path d="M 35 -20 L 40 -20 L 40 -25 L 40 -20 L 45 -20" stroke="#FACC15" strokeWidth={3} />
        </g>
      )}

      {type === 'genetic' && (
        <g transform="translate(0, 0)">
          <path d="M -35 -35 Q 0 -15 35 -35 Q 0 0 -35 35 Q 0 15 35 35" stroke="#2563EB" strokeWidth={4.5} fill="none" strokeLinecap="round" />
          <path d="M 35 -35 Q 0 -15 -35 -35 Q 0 0 35 35 Q 0 15 -35 35" stroke="#DC2626" strokeWidth={4.5} fill="none" strokeLinecap="round" />
          <line x1={-20} y1={-25} x2={20} y2={-25} stroke={INK_BLACK} strokeWidth={3.5} />
          <line x1={-15} y1={0} x2={15} y2={0} stroke={INK_BLACK} strokeWidth={3.5} />
          <line x1={-20} y1={25} x2={20} y2={25} stroke={INK_BLACK} strokeWidth={3.5} />
        </g>
      )}

      {type === 'diet' && (
        <g transform="translate(0, -5)">
          <path d="M 0 -35 C -30 -15 -35 25 0 30 C 35 25 30 -15 0 -35 Z" fill="#F3F4F6" stroke={INK_BLACK} strokeWidth={4} strokeLinejoin="round" />
          <line x1={0} y1={-35} x2={0} y2={30} stroke={INK_BLACK} strokeWidth={2.5} />
          <path d="M -35 -25 Q -45 -40 -35 -55" stroke="#16A34A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path d="M 35 -25 Q 45 -40 35 -55" stroke="#16A34A" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  );
};

// =========================================================================
// 🏞️ FULL-BLEED ENVIRONMENTAL BACKDROPS (NO PLAIN WHITE VOIDS!)
// =========================================================================

/**
 * 1. 🌌 Backyard Patio Evening Backdrop
 * Deep twilight sky, glowing string lights, greenery, dark fence, wooden deck floor
 */
export const ZennPatioBackdrop: React.FC<{
  deckY?: number;
  children: React.ReactNode;
}> = ({ deckY = 680, children }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <linearGradient id="twilightSkyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0B132B" />
            <stop offset="60%" stopColor="#1C2541" />
            <stop offset="100%" stopColor="#2E3856" />
          </linearGradient>
          <linearGradient id="woodDeckGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9A5B2C" />
            <stop offset="100%" stopColor="#693B14" />
          </linearGradient>
        </defs>

        {/* Twilight Sky */}
        <rect x={0} y={0} width={1920} height={deckY} fill="url(#twilightSkyGrad)" />

        {/* Twinkling Evening Stars */}
        {[
          { x: 180, y: 80 }, { x: 340, y: 140 }, { x: 620, y: 70 },
          { x: 880, y: 110 }, { x: 1200, y: 60 }, { x: 1480, y: 120 },
          { x: 1720, y: 85 }
        ].map((s, i) => (
          <circle
            key={i}
            cx={s.x}
            cy={s.y}
            r={2 + Math.sin(frame * 0.1 + i) * 1}
            fill="#FFFFFF"
            opacity={0.6 + Math.sin(frame * 0.15 + i) * 0.3}
          />
        ))}

        {/* Dark Garden Fence Slats */}
        {Array.from({ length: 16 }).map((_, i) => (
          <line
            key={i}
            x1={i * 125}
            y1={deckY - 140}
            x2={i * 125}
            y2={deckY}
            stroke="#1E293B"
            strokeWidth={4}
            opacity={0.4}
          />
        ))}

        {/* Green Hedge Bush Line */}
        <path
          d={`M 0,${deckY} L 0,${deckY - 60} Q 300,${deckY - 110} 600,${deckY - 70} T 1200,${deckY - 100} T 1920,${deckY - 60} L 1920,${deckY} Z`}
          fill="#064E3B"
          stroke={INK_BLACK}
          strokeWidth={4}
        />

        {/* Hanging Patio Fairy String Lights */}
        <path d="M 0,110 Q 480,200 960,130 Q 1440,200 1920,110" fill="none" stroke="#64748B" strokeWidth={3.5} />
        {[140, 340, 540, 740, 960, 1180, 1380, 1580, 1780].map((lx, idx) => {
          const ly = 135 + Math.sin((lx / 1920) * Math.PI) * 55;
          const bulbGlow = 0.75 + Math.sin(frame * 0.12 + idx) * 0.25;
          return (
            <g key={idx} transform={`translate(${lx}, ${ly})`}>
              <circle cx={0} cy={0} r={22} fill="#FEF08A" opacity={bulbGlow * 0.4} />
              <circle cx={0} cy={0} r={9} fill="#FACC15" stroke={INK_BLACK} strokeWidth={2.5} />
            </g>
          );
        })}

        {/* Rich Wood Plank Deck Floor */}
        <rect x={0} y={deckY} width={1920} height={1080 - deckY} fill="url(#woodDeckGrad)" />
        <line x1={0} y1={deckY} x2={1920} y2={deckY} stroke={INK_BLACK} strokeWidth={5} />
        {[deckY + 70, deckY + 150, deckY + 240, deckY + 330].map((py, idx) => (
          <line key={idx} x1={0} y1={py} x2={1920} y2={py} stroke="#451A03" strokeWidth={3.5} opacity={0.65} />
        ))}

        {children}
      </svg>
    </div>
  );
};

/**
 * 2. ☀️ July Blazing Sun & Deck Backdrop
 */
export const ZennJulySunBackdrop: React.FC<{
  deckY?: number;
  children: React.ReactNode;
}> = ({ deckY = 680, children }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Summer Sky */}
        <rect x={0} y={0} width={1920} height={deckY} fill="#38BDF8" />

        {/* Blazing Hand-Drawn Sun in Sky */}
        <g transform="translate(960, 210)">
          {/* Animated Radiating Rays */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => {
            const rayLen = 135 + Math.sin(frame * 0.2 + i) * 12;
            return (
              <line
                key={i}
                x1={0}
                y1={0}
                x2={rayLen * Math.cos((deg * Math.PI) / 180)}
                y2={rayLen * Math.sin((deg * Math.PI) / 180)}
                stroke="#F59E0B"
                strokeWidth={5}
                strokeLinecap="round"
              />
            );
          })}
          {/* Glowing Sun Disc */}
          <circle cx={0} cy={0} r={80} fill="#FACC15" stroke={INK_BLACK} strokeWidth={5} />
          <circle cx={-22} cy={-10} r={7} fill={INK_BLACK} />
          <circle cx={22} cy={-10} r={7} fill={INK_BLACK} />
          <path d="M -25 20 Q 0 45 25 20" stroke={INK_BLACK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        </g>

        {/* Wood Deck Floor */}
        <rect x={0} y={deckY} width={1920} height={1080 - deckY} fill="#8A5326" />
        <line x1={0} y1={deckY} x2={1920} y2={deckY} stroke={INK_BLACK} strokeWidth={5} />

        {/* Shimmering Heat Waves */}
        <path
          d={`M 200 ${deckY + 40} Q 400 ${deckY + 30 + Math.sin(frame * 0.2) * 10} 600 ${deckY + 40} Q 800 ${deckY + 50} 1000 ${deckY + 40} Q 1200 ${deckY + 30 + Math.sin(frame * 0.2) * 10} 1400 ${deckY + 40}`}
          stroke="#FDE047"
          strokeWidth={4}
          fill="none"
          opacity={0.6}
          strokeLinecap="round"
        />

        {children}
      </svg>
    </div>
  );
};

/**
 * 3. 🏡 Suburban Cottage Front Porch Backdrop (For Beat 6 Homage to ref_60s.jpg)
 */
export const ZennCottagePorchBackdrop: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Summer Sky */}
        <rect x={0} y={0} width={1920} height={700} fill="#60A5FA" />

        {/* Green Garden Lawn */}
        <rect x={0} y={700} width={1920} height={380} fill="#15803D" />
        <line x1={0} y1={700} x2={1920} y2={700} stroke={INK_BLACK} strokeWidth={5} />

        {/* Flower bushes along the fence */}
        {[-80, 80, 240, 400, 1600, 1760, 1920].map((bx, i) => (
          <circle key={i} cx={bx} cy={700} r={65} fill="#166534" stroke={INK_BLACK} strokeWidth={4} />
        ))}

        {/* Stone Walkway leading to porch */}
        <polygon points="760,1080 840,780 1140,780 1220,1080" fill="#94A3B8" stroke={INK_BLACK} strokeWidth={4} />

        {/* Porch Wooden Deck Platform */}
        <rect x={780} y={730} width={460} height={60} rx={6} fill="#A16207" stroke={INK_BLACK} strokeWidth={4.5} />

        {/* Cottage House Facade */}
        <g transform="translate(980, 480)">
          {/* Main House Wall with Lap Siding */}
          <rect x={-20} y={-260} width={480} height={520} fill="#F8FAFC" stroke={INK_BLACK} strokeWidth={5} />
          {/* Horizontal Siding Lines */}
          {[-210, -160, -110, -60, -10, 40, 90, 140, 190].map((sy, i) => (
            <line key={i} x1={-20} y1={sy} x2={460} y2={sy} stroke="#CBD5E1" strokeWidth={2.5} />
          ))}

          {/* Brown Shingle Gable Roof */}
          <polygon points="-60,-250 220,-440 500,-250" fill="#854D0E" stroke={INK_BLACK} strokeWidth={5} strokeLinejoin="round" />

          {/* Front Door Frame */}
          <rect x={20} y={-100} width={170} height={360} fill="#18181B" stroke={INK_BLACK} strokeWidth={5} />
          {/* Open Door Leaf */}
          <polygon points="20,-100 -40,-70 -40,240 20,260" fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={5} strokeLinejoin="round" />
          <circle cx={-25} cy={90} r={6} fill="#FACC15" stroke={INK_BLACK} strokeWidth={2} />

          {/* Cottage Window with Curtains */}
          <rect x={250} y={-60} width={140} height={140} fill="#FEF08A" stroke={INK_BLACK} strokeWidth={4.5} />
          <line x1={320} y1={-60} x2={320} y2={80} stroke={INK_BLACK} strokeWidth={3.5} />
          <line x1={250} y1={10} x2={390} y2={10} stroke={INK_BLACK} strokeWidth={3.5} />

          {/* Outdoor Porch Light Fixture */}
          <g transform="translate(210, -60)">
            <rect x={-10} y={0} width={20} height={30} rx={4} fill="#FACC15" stroke={INK_BLACK} strokeWidth={2.5} />
            <circle cx={0} cy={15} r={14} fill="#FEF08A" opacity={0.5} />
          </g>

          {/* Welcome Mat on Porch */}
          <rect x={15} y={235} width={130} height={30} rx={4} fill="#78350F" stroke={INK_BLACK} strokeWidth={3} />
          <text x={80} y={255} fill="#FEF3C7" fontSize={14} fontWeight="900" textAnchor="middle">
            WELCOME
          </text>
        </g>

        {children}
      </svg>
    </div>
  );
};

/**
 * 4. 🔦 Dramatic Spotlight Arena Backdrop (For Beat 7 Curiosity Stage)
 */
export const ZennSpotlightArenaBackdrop: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        {/* Deep Midnight Blue Void */}
        <rect x={0} y={0} width={1920} height={1080} fill="#090E17" />

        {/* Central Luminous Spotlight Cone */}
        <polygon points="960,0 600,980 1320,980" fill="rgba(56, 189, 248, 0.15)" />

        {/* Illuminated Floor Stage Oval */}
        <ellipse cx={960} cy={820} rx={360} ry={110} fill="#1E293B" stroke="#38BDF8" strokeWidth={3} opacity={0.6} />

        {/* Ambient Glowing Dust Motes */}
        {[
          { x: 860, y: 320 }, { x: 1060, y: 440 }, { x: 920, y: 560 },
          { x: 1000, y: 220 }, { x: 880, y: 680 }
        ].map((m, i) => (
          <circle
            key={i}
            cx={m.x + Math.sin(frame * 0.1 + i) * 15}
            cy={m.y + Math.cos(frame * 0.1 + i) * 12}
            r={3}
            fill="#38BDF8"
            opacity={0.5 + Math.sin(frame * 0.15 + i) * 0.3}
          />
        ))}

        {children}
      </svg>
    </div>
  );
};
