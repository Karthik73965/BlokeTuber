import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DOODLE_STROKE, DOODLE_WIDTH, DoodleSun } from '../../animated-story/DoodleElements';
import { DoodleStickman } from '../../animated-story/DoodleStickman';

// Re-export stickman & motion effects
export { DoodleStickman };
import {
  ZoomIn,
  SlideIn,
  CameraShutterEffect,
  PopIn as BasePopIn,
  SfxTrigger,
} from '../../white-home/shared/MotionEffects';
export { ZoomIn, SlideIn, CameraShutterEffect, SfxTrigger };

export const PopIn: React.FC<{
  children: React.ReactNode;
  centerX?: number;
  centerY?: number;
  scale?: number;
  startFrame?: number;
  withSfx?: boolean;
}> = ({ children, centerX = 960, centerY = 540, startFrame = 0, withSfx = true }) => {
  return (
    <BasePopIn centerX={centerX} centerY={centerY} startFrame={startFrame} withSfx={withSfx}>
      {children}
    </BasePopIn>
  );
};

/**
 * 🏷️ High-Contrast Story Pill Badge (SVG)
 * Engineered with generous horizontal padding so text & emojis NEVER clip
 */
export const StoryBadge: React.FC<{
  text: string;
  x: number;
  y: number;
  bgColor?: string;
  textColor?: string;
  fontSize?: number;
  scale?: number;
}> = ({
  text,
  x,
  y,
  bgColor = '#0F172A',
  textColor = '#FFFFFF',
  fontSize = 30,
  scale = 1,
}) => {
  const charWidth = fontSize * 0.85;
  const padX = fontSize * 2.2;
  const width = Math.max(text.length * charWidth + padX, 180);
  const height = fontSize * 2.1;

  return (
    <g transform={`translate(${x - (width * scale) / 2}, ${y - (height * scale) / 2}) scale(${scale})`}>
      <rect
        width={width}
        height={height}
        rx={height / 2}
        fill={bgColor}
        stroke="#FFFFFF"
        strokeWidth={3}
        style={{ filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.35))' }}
      />
      <text
        x={width / 2}
        y={height / 2 + fontSize * 0.35}
        fill={textColor}
        fontSize={fontSize}
        fontWeight="800"
        textAnchor="middle"
        fontFamily="'Inter', 'Arial Black', sans-serif"
      >
        {text}
      </text>
    </g>
  );
};

/**
 * 🌑 Ground Shadow Ellipse
 */
export const GroundShadow: React.FC<{
  x: number;
  y: number;
  rx?: number;
  ry?: number;
  opacity?: number;
}> = ({ x, y, rx = 60, ry = 14, opacity = 0.25 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#000000" opacity={opacity} />
);

/**
 * 🦟 Hand-Drawn Anatomical / Cartoon Vector Mosquito
 */
export interface DoodleMosquitoProps {
  x: number;
  y: number;
  scale?: number;
  angle?: number;
  expression?: 'normal' | 'happy' | 'determined' | 'heart_eyes' | 'hungry' | 'curious';
  accessory?: 'none' | 'aviator_goggles' | 'lab_coat' | 'pink_bow' | 'knife_fork' | 'headphones' | 'sensory_antennae';
  glow?: boolean;
}

export const DoodleMosquito: React.FC<DoodleMosquitoProps> = ({
  x,
  y,
  scale = 1,
  angle = 0,
  expression = 'normal',
  accessory = 'none',
  glow = false,
}) => {
  const frame = useCurrentFrame();

  // Rapid wing flap oscillation
  const wingAngleLeft = Math.sin(frame * 1.5) * 25 - 20;
  const wingAngleRight = -Math.sin(frame * 1.5) * 25 + 20;

  // Subtle hover bobbing
  const bobY = Math.sin(frame * 0.2) * 5;

  return (
    <g transform={`translate(${x}, ${y + bobY}) scale(${scale}) rotate(${angle})`}>
      {/* Target/Scent Glow Halo */}
      {glow && (
        <circle cx={0} cy={0} r={55} fill="#EF4444" opacity={0.25 + Math.sin(frame * 0.3) * 0.15} />
      )}

      {/* Proboscis (Precision Needle) */}
      <line x1={-18} y1={-4} x2={-45} y2={-8} stroke="#18181B" strokeWidth={4} strokeLinecap="round" />
      <polygon points="-45,-8 -48,-8 -45,-6" fill="#18181B" />

      {/* Segmented Abdomen */}
      <path
        d="M 10,-4 Q 38,-12 48,-2 Q 52,6 40,10 Q 20,12 8,6 Z"
        fill="#475569"
        stroke="#18181B"
        strokeWidth={4}
      />
      {/* Body Stripes */}
      <line x1={20} y1={-8} x2={18} y2={9} stroke="#F8FAFC" strokeWidth={3} />
      <line x1={30} y1={-7} x2={29} y2={8} stroke="#F8FAFC" strokeWidth={3} />
      <line x1={39} y1={-5} x2={38} y2={5} stroke="#F8FAFC" strokeWidth={3} />

      {/* Thorax */}
      <ellipse cx={2} cy={0} rx={14} ry={11} fill="#334155" stroke="#18181B" strokeWidth={4} />

      {/* 6 Jointed Spidery Mosquito Legs */}
      <polyline points="-5,8 -14,24 -24,36" fill="none" stroke="#18181B" strokeWidth={3} strokeLinecap="round" />
      <polyline points="2,9 0,28 8,42" fill="none" stroke="#18181B" strokeWidth={3} strokeLinecap="round" />
      <polyline points="12,7 24,26 42,38" fill="none" stroke="#18181B" strokeWidth={3} strokeLinecap="round" />

      {/* Left Wing (Translucent) */}
      <g transform={`translate(-2, -8) rotate(${wingAngleLeft})`}>
        <path
          d="M 0,0 Q 8,-35 24,-45 Q 35,-35 20,-10 Z"
          fill="rgba(224, 242, 254, 0.75)"
          stroke="#0284C7"
          strokeWidth={2.5}
        />
        <line x1={0} y1={0} x2={22} y2={-42} stroke="rgba(2, 132, 199, 0.5)" strokeWidth={1.5} />
      </g>

      {/* Right Wing (Translucent) */}
      <g transform={`translate(6, -8) rotate(${wingAngleRight})`}>
        <path
          d="M 0,0 Q 14,-32 30,-40 Q 38,-28 18,-6 Z"
          fill="rgba(224, 242, 254, 0.75)"
          stroke="#0284C7"
          strokeWidth={2.5}
        />
        <line x1={0} y1={0} x2={28} y2={-38} stroke="rgba(2, 132, 199, 0.5)" strokeWidth={1.5} />
      </g>

      {/* Head */}
      <circle cx={-12} cy={-2} r={10} fill="#1E293B" stroke="#18181B" strokeWidth={3.5} />

      {/* Sensory Antennae (Sensitive Chemoreceptors) */}
      <path d="M -16,-8 Q -24,-18 -32,-22" fill="none" stroke="#18181B" strokeWidth={2.5} strokeLinecap="round" />
      <path d="M -14,-10 Q -18,-24 -24,-28" fill="none" stroke="#18181B" strokeWidth={2.5} strokeLinecap="round" />

      {/* Sensory Antennae Glow Waves */}
      {accessory === 'sensory_antennae' && (
        <g>
          <circle cx={-32} cy={-22} r={8 + Math.sin(frame * 0.3) * 4} fill="none" stroke="#38BDF8" strokeWidth={2} opacity={0.7} />
          <circle cx={-24} cy={-28} r={8 + Math.sin(frame * 0.3 + 1) * 4} fill="none" stroke="#38BDF8" strokeWidth={2} opacity={0.7} />
        </g>
      )}

      {/* Eyes */}
      <g>
        <circle cx={-13} cy={-4} r={5} fill="#EF4444" stroke="#18181B" strokeWidth={2} />
        <circle cx={-14} cy={-5} r={1.5} fill="#FFFFFF" />
      </g>
    </g>
  );
};

/**
 * 🍖 BBQ Grill Prop
 */
export const DoodleBBQ: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const smokeY1 = -50 - ((frame * 1.5) % 40);
  const smokeY2 = -70 - (((frame + 15) * 1.5) % 40);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <GroundShadow x={0} y={130} rx={50} ry={12} />
      <line x1={-30} y1={50} x2={-45} y2={130} stroke="#18181B" strokeWidth={5} strokeLinecap="round" />
      <line x1={30} y1={50} x2={45} y2={130} stroke="#18181B" strokeWidth={5} strokeLinecap="round" />
      <line x1={0} y1={50} x2={0} y2={130} stroke="#18181B" strokeWidth={5} strokeLinecap="round" />
      <line x1={-32} y1={100} x2={32} y2={100} stroke="#18181B" strokeWidth={4} />

      <path d="M -50,15 A 50,45 0 0,0 50,15 Z" fill="#DC2626" stroke="#18181B" strokeWidth={5} />
      <path d="M -48,10 Q 0,-35 48,0" fill="none" stroke="#DC2626" strokeWidth={14} strokeLinecap="round" />
      <path d="M -50,12 A 50,40 0 0,1 48,0" fill="#EF4444" stroke="#18181B" strokeWidth={5} />
      <path d="M -10,-32 Q 0,-42 10,-32" fill="none" stroke="#18181B" strokeWidth={4} strokeLinecap="round" />
      <ellipse cx={0} cy={14} rx={44} ry={6} fill="#F97316" />

      <circle cx={-10} cy={smokeY1} r={10} fill="rgba(203, 213, 225, 0.6)" />
      <circle cx={15} cy={smokeY2} r={14} fill="rgba(203, 213, 225, 0.45)" />
    </g>
  );
};

/**
 * 🪑 Patio Chair Prop
 */
export const DoodlePatioChair: React.FC<{
  x: number;
  y: number;
  scale?: number;
  color?: string;
  withDrink?: boolean;
}> = ({ x, y, scale = 1, color = '#2563EB', withDrink = false }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <GroundShadow x={0} y={110} rx={45} ry={10} />
      <polyline points="-35,110 -20,50 25,50 40,110" fill="none" stroke="#18181B" strokeWidth={5} strokeLinecap="round" />
      <polyline points="-20,50 -35,-30 -25,-30 -10,50" fill={color} stroke="#18181B" strokeWidth={4} />
      <rect x={-20} y={45} width={45} height={12} rx={3} fill={color} stroke="#18181B" strokeWidth={4} />

      {withDrink && (
        <g transform="translate(36, 32)">
          <rect x={-6} y={0} width={12} height={18} rx={2} fill="#67E8F9" stroke="#18181B" strokeWidth={2.5} />
          <line x1={0} y1={-8} x2={6} y2={-16} stroke="#EF4444" strokeWidth={3} strokeLinecap="round" />
          <circle cx={0} cy={4} r={2} fill="#FFFFFF" />
        </g>
      )}
    </g>
  );
};

/**
 * 🕯️ Citronella Candle Bucket
 */
export const CitronellaCandle: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const flameFlicker = Math.sin(frame * 0.8) * 3;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <GroundShadow x={0} y={22} rx={22} ry={6} />
      <polygon points="-16,0 16,0 12,20 -12,20" fill="#FACC15" stroke="#18181B" strokeWidth={3} />
      <ellipse cx={0} cy={0} rx={16} ry={4} fill="#FEF08A" stroke="#18181B" strokeWidth={3} />
      <line x1={0} y1={0} x2={0} y2={-6} stroke="#18181B" strokeWidth={2.5} />
      <ellipse cx={flameFlicker} cy={-12} rx={4} ry={7} fill="#F97316" />
      <ellipse cx={flameFlicker} cy={-10} rx={2} ry={4} fill="#FEF08A" />
      <path
        d={`M 0,-18 Q ${Math.sin(frame * 0.3) * 10},-30 0,-42 Q ${-Math.sin(frame * 0.3) * 10},-54 0,-66`}
        fill="none"
        stroke="rgba(148, 163, 184, 0.5)"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </g>
  );
};

/**
 * 🧬 DNA Helix Vector
 */
export const DoodleDNA: React.FC<{
  x: number;
  y: number;
  height?: number;
  scale?: number;
}> = ({ x, y, height = 300, scale = 1 }) => {
  const frame = useCurrentFrame();
  const rungs = 10;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {Array.from({ length: rungs }).map((_, i) => {
        const rungY = (i / (rungs - 1)) * height - height / 2;
        const phase = (frame * 0.08 + (i / rungs) * Math.PI * 2) % (Math.PI * 2);
        const xOffset = Math.sin(phase) * 60;
        const z = Math.cos(phase);
        const rungColor = i % 2 === 0 ? '#38BDF8' : '#F43F5E';

        return (
          <g key={i}>
            <line
              x1={-xOffset}
              y1={rungY}
              x2={xOffset}
              y2={rungY}
              stroke="#E2E8F0"
              strokeWidth={5}
              strokeLinecap="round"
            />
            <circle cx={-xOffset} cy={rungY} r={7} fill={rungColor} stroke="#18181B" strokeWidth={3} />
            <circle cx={xOffset} cy={rungY} r={7} fill={z > 0 ? rungColor : '#94A3B8'} stroke="#18181B" strokeWidth={3} />
          </g>
        );
      })}
    </g>
  );
};

/**
 * 🧫 Petri Dish with Bacterial Cultures
 */
export const DoodlePetriDish: React.FC<{
  x: number;
  y: number;
  scale?: number;
  diversity?: 'low' | 'rich';
  label?: string;
}> = ({ x, y, scale = 1, diversity = 'rich', label }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <circle cx={0} cy={0} r={80} fill="#F8FAFC" stroke="#334155" strokeWidth={6} />
      <circle cx={0} cy={0} r={72} fill="#ECFDF5" stroke="#CBD5E1" strokeWidth={2} />

      {diversity === 'low' ? (
        <g>
          <circle cx={-20} cy={-10} r={10} fill="#94A3B8" stroke="#18181B" strokeWidth={2.5} />
          <circle cx={25} cy={15} r={8} fill="#94A3B8" stroke="#18181B" strokeWidth={2.5} />
        </g>
      ) : (
        <g>
          <circle cx={-25} cy={-20} r={14} fill="#10B981" stroke="#18181B" strokeWidth={3} />
          <circle cx={25} cy={-25} r={16} fill="#F59E0B" stroke="#18181B" strokeWidth={3} />
          <circle cx={0} cy={20} r={18} fill="#EC4899" stroke="#18181B" strokeWidth={3} />
          <circle cx={-35} cy={18} r={10} fill="#3B82F6" stroke="#18181B" strokeWidth={2.5} />
          <circle cx={35} cy={12} r={12} fill="#8B5CF6" stroke="#18181B" strokeWidth={2.5} />
          <circle cx={0} cy={-10} r={8} fill="#F43F5E" stroke="#18181B" strokeWidth={2} />
        </g>
      )}

      {label && (
        <text
          x={0}
          y={115}
          textAnchor="middle"
          fontSize={20}
          fontWeight="800"
          fill="#18181B"
          fontFamily="'Inter', sans-serif"
        >
          {label}
        </text>
      )}
    </g>
  );
};

/**
 * 🗺️ Overhead Neighborhood Map with Route & Location Pin
 */
export const OverheadMap: React.FC<{
  targetX?: number;
  targetY?: number;
}> = ({ targetX = 1320, targetY = 620 }) => {
  const frame = useCurrentFrame();

  return (
    <g>
      {/* Background streets / block grid */}
      <rect x={100} y={120} width={1720} height={840} rx={24} fill="#1E293B" stroke="#334155" strokeWidth={4} />
      {/* Street Lines */}
      <line x1={100} y1={360} x2={1820} y2={360} stroke="#334155" strokeWidth={18} />
      <line x1={100} y1={680} x2={1820} y2={680} stroke="#334155" strokeWidth={18} />
      <line x1={600} y1={120} x2={600} y2={960} stroke="#334155" strokeWidth={18} />
      <line x1={1200} y1={120} x2={1200} y2={960} stroke="#334155" strokeWidth={18} />

      {/* House Footprints */}
      {[
        { x: 260, y: 220 }, { x: 800, y: 220 }, { x: 1460, y: 220 },
        { x: 260, y: 500 }, { x: 800, y: 500 }, { x: targetX - 60, y: targetY - 40 }
      ].map((h, i) => (
        <rect
          key={i}
          x={h.x}
          y={h.y}
          width={160}
          height={110}
          rx={8}
          fill={i === 5 ? '#3B82F6' : '#475569'}
          stroke="#0F172A"
          strokeWidth={3}
        />
      ))}

      {/* Dotted Delivery Route from Mosquito Mailbox to Target */}
      <path
        d={`M 360,280 Q 700,420 1000,520 T ${targetX},${targetY}`}
        fill="none"
        stroke="#F59E0B"
        strokeWidth={5}
        strokeDasharray="14 10"
      />

      {/* Pulsing Location Pin at Target */}
      <g transform={`translate(${targetX}, ${targetY})`}>
        <circle cx={0} cy={0} r={28 + Math.sin(frame * 0.2) * 8} fill="#EF4444" opacity={0.3} />
        <circle cx={0} cy={0} r={18} fill="#EF4444" stroke="#FFFFFF" strokeWidth={4} />
        <circle cx={0} cy={0} r={6} fill="#FFFFFF" />
        <rect x={-80} y={-60} width={160} height={36} rx={8} fill="#0F172A" stroke="#EF4444" strokeWidth={2} />
        <text x={0} y={-36} fill="#F8FAFC" fontSize={16} fontWeight="bold" textAnchor="middle">
          YOU ARE HERE 📍
        </text>
      </g>
    </g>
  );
};

/**
 * 🌊 Flowing Chemical Scent Ribbons (CO2, Odor, Heat)
 */
export const ScentRibbons: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  label?: string;
  color?: string;
  offsetPhase?: number;
}> = ({
  startX,
  startY,
  endX,
  endY,
  label = 'ODOR PLUME',
  color = '#38BDF8',
  offsetPhase = 0,
}) => {
  const frame = useCurrentFrame();
  const wave = Math.sin(frame * 0.1 + offsetPhase) * 30;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 + wave;

  return (
    <g>
      <path
        d={`M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`}
        fill="none"
        stroke={color}
        strokeWidth={8}
        strokeLinecap="round"
        opacity={0.7}
      />
      <path
        d={`M ${startX},${startY} Q ${midX},${midY - 15} ${endX},${endY}`}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray="8 6"
        opacity={0.4}
      />
      {label && (
        <text
          x={midX}
          y={midY - 20}
          fill={color}
          fontSize={16}
          fontWeight="bold"
          textAnchor="middle"
        >
          {label}
        </text>
      )}
    </g>
  );
};

// =========================================================================
// 🏞️ FULL-BLEED ENVIRONMENTS
// =========================================================================

/**
 * 1. Backyard Patio Environment
 */
export const BackyardPatioEnv: React.FC<{
  children: React.ReactNode;
  deckY?: number;
}> = ({ children, deckY = 680 }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        <defs>
          <linearGradient id="twilightSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="60%" stopColor="#1E293B" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
          <linearGradient id="woodDeck" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>
        </defs>

        <rect x={0} y={0} width={1920} height={deckY} fill="url(#twilightSky)" />

        <path
          d={`M 0,${deckY} L 0,${deckY - 80} Q 300,${deckY - 140} 600,${deckY - 90} T 1200,${deckY - 130} T 1920,${deckY - 80} L 1920,${deckY} Z`}
          fill="#064E3B"
          opacity={0.8}
        />

        {/* Patio String Lights */}
        <path d="M 0,90 Q 480,180 960,110 Q 1440,180 1920,90" fill="none" stroke="#475569" strokeWidth={3} />
        {[160, 360, 560, 760, 960, 1160, 1360, 1560, 1760].map((lx, idx) => {
          const ly = 120 + Math.sin((lx / 1920) * Math.PI) * 50;
          const bulbGlow = 0.7 + Math.sin(frame * 0.1 + idx) * 0.25;
          return (
            <g key={idx} transform={`translate(${lx}, ${ly})`}>
              <circle cx={0} cy={0} r={18} fill="#FEF08A" opacity={bulbGlow * 0.35} />
              <circle cx={0} cy={0} r={8} fill="#FACC15" stroke="#18181B" strokeWidth={2} />
            </g>
          );
        })}

        {/* Wood Deck Floor */}
        <rect x={0} y={deckY} width={1920} height={1080 - deckY} fill="url(#woodDeck)" />
        {[deckY + 60, deckY + 130, deckY + 210, deckY + 300].map((py, idx) => (
          <line key={idx} x1={0} y1={py} x2={1920} y2={py} stroke="#451A03" strokeWidth={3} opacity={0.6} />
        ))}

        {children}
      </svg>
    </div>
  );
};

/**
 * 2. Radar Tracking Field Environment
 */
export const RadarFieldEnv: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();
  const scanAngle = (frame * 1.8) % 360;

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill="#090D16" />

        {Array.from({ length: 13 }).map((_, i) => (
          <line key={`v-${i}`} x1={i * 160} y1={0} x2={i * 160} y2={1080} stroke="#1E293B" strokeWidth={1.5} />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`h-${i}`} x1={0} y1={i * 150} x2={1920} y2={i * 150} stroke="#1E293B" strokeWidth={1.5} />
        ))}

        <circle cx={960} cy={540} r={220} fill="none" stroke="#0284C7" strokeWidth={2} opacity={0.2} strokeDasharray="6 6" />
        <circle cx={960} cy={540} r={420} fill="none" stroke="#0284C7" strokeWidth={2} opacity={0.2} strokeDasharray="8 8" />
        <circle cx={960} cy={540} r={620} fill="none" stroke="#0284C7" strokeWidth={2} opacity={0.15} />

        <g transform={`translate(960, 540) rotate(${scanAngle})`}>
          <line x1={0} y1={0} x2={700} y2={0} stroke="#38BDF8" strokeWidth={2} opacity={0.5} />
        </g>

        {children}
      </svg>
    </div>
  );
};

/**
 * 3. Microscope Environment
 */
export const MicroscopeEnv: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill="#040D1A" />
        <circle cx={960} cy={540} r={510} fill="#064E3B" opacity={0.25} />
        <circle cx={960} cy={540} r={500} fill="#022C22" stroke="#059669" strokeWidth={8} />

        {[
          { x: 620, y: 300, r: 16, c: '#10B981' },
          { x: 1300, y: 380, r: 22, c: '#F59E0B' },
          { x: 740, y: 720, r: 18, c: '#EC4899' },
          { x: 1220, y: 760, r: 24, c: '#3B82F6' },
          { x: 960, y: 220, r: 14, c: '#8B5CF6' },
        ].map((m, idx) => {
          const dy = Math.sin(frame * 0.05 + idx) * 15;
          const dx = Math.cos(frame * 0.05 + idx) * 10;
          return (
            <circle
              key={idx}
              cx={m.x + dx}
              cy={m.y + dy}
              r={m.r}
              fill={m.c}
              opacity={0.35}
              stroke="#18181B"
              strokeWidth={2}
            />
          );
        })}

        <line x1={960} y1={60} x2={960} y2={1020} stroke="#059669" strokeWidth={1.5} opacity={0.3} strokeDasharray="5 5" />
        <line x1={480} y1={540} x2={1440} y2={540} stroke="#059669" strokeWidth={1.5} opacity={0.3} strokeDasharray="5 5" />

        {children}
      </svg>
    </div>
  );
};

/**
 * 4. Historical Documentary Canvas Environment
 */
export const HistoryCanvasEnv: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        <rect x={0} y={0} width={1920} height={1080} fill="#FEF3C7" />
        <rect
          x={30}
          y={30}
          width={1860}
          height={1020}
          rx={16}
          fill="none"
          stroke="#78350F"
          strokeWidth={4}
          strokeDasharray="16 8"
          opacity={0.4}
        />
        <path
          d="M 200,400 Q 400,320 600,420 T 1000,350 T 1500,430 T 1800,360"
          fill="none"
          stroke="#D97706"
          strokeWidth={3}
          opacity={0.25}
        />
        {children}
      </svg>
    </div>
  );
};

/**
 * 5. Clinical Research Laboratory Environment
 */
export const TwinLabEnv: React.FC<{
  children: React.ReactNode;
  deskY?: number;
}> = ({ children, deskY = 680 }) => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} style={{ position: 'absolute', top: 0, left: 0 }}>
        <rect x={0} y={0} width={1920} height={deskY} fill="#F1F5F9" />

        {Array.from({ length: 16 }).map((_, i) => (
          <line key={`lt-v-${i}`} x1={i * 120} y1={0} x2={i * 120} y2={deskY} stroke="#CBD5E1" strokeWidth={1} />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <line key={`lt-h-${i}`} x1={0} y1={i * 120} x2={1920} y2={i * 120} stroke="#CBD5E1" strokeWidth={1} />
        ))}

        <rect x={0} y={deskY} width={1920} height={1080 - deskY} fill="#334155" />
        <rect x={0} y={deskY} width={1920} height={24} fill="#64748B" />

        {children}
      </svg>
    </div>
  );
};
