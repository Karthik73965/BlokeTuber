import React from 'react';
import { Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  DOODLE_STROKE,
  DOODLE_WIDTH,
  DoodleSparkle,
  DoodleSun,
} from '../../animated-story/DoodleElements';
import { DoodleStickman } from '../../animated-story/DoodleStickman';
import {
  DoodleCow,
  DoodlePig,
  DoodlePiglet,
  MilkCanister,
  MilkingBucket,
  StoryBadge,
} from '../shared/PigMilkElements';
import {
  CameraShutterEffect,
  PopIn,
  SlideIn,
  SfxTrigger,
  ZoomIn,
} from '../../white-home/shared/MotionEffects';

/**
 * =========================================================================
 * 🌄 ENVIRONMENT 1: Prehistoric Farm Landscape (10,000 BCE)
 * Full-bleed Savannah & Primitive Farm Pasture
 * =========================================================================
 */
export const PrehistoricFarmEnv: React.FC<{
  children: React.ReactNode;
  skyColor?: string;
  groundColor?: string;
  horizonY?: number;
  showSun?: boolean;
}> = ({
  children,
  skyColor = '#FEF08A',
  groundColor = '#D97706',
  horizonY = 530,
  showSun = true,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Sky */}
        <rect x={0} y={0} width={1920} height={horizonY} fill={skyColor} />

        {/* Primitive Mountain Silhouettes */}
        <path
          d="M 0 530 L 220 340 L 460 530 L 780 290 L 1120 530 L 1460 360 L 1750 530 L 1920 420 L 1920 530 Z"
          fill="#B45309"
          opacity={0.35}
        />
        <path
          d="M 120 530 L 380 390 L 640 530 L 1000 370 L 1320 530 L 1600 410 L 1920 530 Z"
          fill="#92400E"
          opacity={0.45}
        />

        {/* Ancient Warm Sun */}
        {showSun && <DoodleSun x={1680} y={140} size={115} />}

        {/* Primitive Earth Ground */}
        <rect x={0} y={horizonY} width={1920} height={1080 - horizonY} fill={groundColor} />
        <line x1={0} y1={horizonY} x2={1920} y2={horizonY} stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />

        {/* Ancient Timber Fence (Tied Logs & Rough Stakes) */}
        <g stroke="#78350F" strokeWidth={7} strokeLinecap="round">
          <line x1={0} y1={horizonY - 45} x2={1250} y2={horizonY - 45} />
          <line x1={0} y1={horizonY - 15} x2={1250} y2={horizonY - 15} />
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={i}
              x1={60 + i * 120}
              y1={horizonY - 75}
              x2={60 + i * 120}
              y2={horizonY + 25}
              strokeWidth={9}
            />
          ))}
        </g>

        {/* Prehistoric Rock Formations */}
        <ellipse cx={220} cy={horizonY + 70} rx={60} ry={25} fill="#78716C" stroke={DOODLE_STROKE} strokeWidth={4} />
        <ellipse cx={255} cy={horizonY + 55} rx={35} ry={18} fill="#A8A29E" stroke={DOODLE_STROKE} strokeWidth={4} />

        {/* Content Layer */}
        {children}
      </svg>
    </div>
  );
};

/**
 * =========================================================================
 * 🏛️ ENVIRONMENT 2: Dark Slate Workshop & Easel Presentation Studio
 * Full-bleed Studio Background for 3 Core Pillars
 * =========================================================================
 */
export const StudioPillarsEnv: React.FC<{
  children: React.ReactNode;
  spotlightColor?: string;
}> = ({ children, spotlightColor = 'rgba(253, 224, 71, 0.12)' }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Studio Navy Slate Wall */}
        <rect x={0} y={0} width={1920} height={700} fill="#0F172A" />

        {/* Subtle Acoustic Studio Wall Ribs */}
        {Array.from({ length: 20 }).map((_, i) => (
          <line
            key={i}
            x1={i * 100}
            y1={0}
            x2={i * 100}
            y2={700}
            stroke="#1E293B"
            strokeWidth={3}
            opacity={0.6}
          />
        ))}

        {/* Spotlight Cone Beam */}
        <polygon points="960,0 350,700 1570,700" fill={spotlightColor} />

        {/* Polished Warm Walnut Studio Floor */}
        <rect x={0} y={700} width={1920} height={380} fill="#78350F" />
        <line x1={0} y1={700} x2={1920} y2={700} stroke="#451A03" strokeWidth={DOODLE_WIDTH} />
        {/* Floor Planks */}
        {Array.from({ length: 6 }).map((_, i) => (
          <line
            key={i}
            x1={0}
            y1={700 + i * 65}
            x2={1920}
            y2={700 + i * 65}
            stroke="#92400E"
            strokeWidth={3}
          />
        ))}

        {/* Content */}
        {children}
      </svg>
    </div>
  );
};

/**
 * =========================================================================
 * ☕ ENVIRONMENT 3: Modern Cafe Counter (100% Faithful to snap_300s.jpg)
 * Full-bleed Modern Coffee Shop with Street Panorama Window
 * =========================================================================
 */
export const ModernCafeEnv: React.FC<{
  children?: React.ReactNode;
  showMilkPour?: boolean;
  pourProgress?: number;
}> = ({ children, showMilkPour = false, pourProgress = 0 }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Warm Tan / Camel Interior Wall (ref snap_300s: #D8B48D) */}
        <rect x={0} y={0} width={1920} height={1080} fill="#D4A373" />

        {/* 3 Black Industrial Pendant Lamps hanging from ceiling */}
        {/* Left Lamp */}
        <g transform="translate(400, 0)">
          <line x1={0} y1={0} x2={0} y2={125} stroke="#18181B" strokeWidth={5} />
          <polygon points="-70,165 70,165 40,125 -40,125" fill="#27272A" stroke="#18181B" strokeWidth={4} />
          <line x1={-70} y1={165} x2={70} y2={165} stroke="#18181B" strokeWidth={5} />
          <ellipse cx={0} cy={165} rx={60} ry={12} fill="#FEF08A" opacity={0.6} />
        </g>
        {/* Center Lamp */}
        <g transform="translate(980, 0)">
          <line x1={0} y1={0} x2={0} y2={125} stroke="#18181B" strokeWidth={5} />
          <polygon points="-70,165 70,165 40,125 -40,125" fill="#27272A" stroke="#18181B" strokeWidth={4} />
          <line x1={-70} y1={165} x2={70} y2={165} stroke="#18181B" strokeWidth={5} />
          <ellipse cx={0} cy={165} rx={60} ry={12} fill="#FEF08A" opacity={0.6} />
        </g>
        {/* Right Lamp */}
        <g transform="translate(1560, 0)">
          <line x1={0} y1={0} x2={0} y2={125} stroke="#18181B" strokeWidth={5} />
          <polygon points="-70,165 70,165 40,125 -40,125" fill="#27272A" stroke="#18181B" strokeWidth={4} />
          <line x1={-70} y1={165} x2={70} y2={165} stroke="#18181B" strokeWidth={5} />
          <ellipse cx={0} cy={165} rx={60} ry={12} fill="#FEF08A" opacity={0.6} />
        </g>

        {/* 🪟 Large Panoramic Street Window */}
        <g transform="translate(300, 110)">
          {/* Black Outer Window Frame */}
          <rect x={-5} y={-5} width={1330} height={510} rx={4} fill="#18181B" />
          {/* Window Glass Pane */}
          <rect x={0} y={0} width={1320} height={500} fill="#E0F2FE" />

          {/* City Street View Through Window */}
          {/* Blue Sky with soft sun reflection */}
          <rect x={0} y={0} width={1320} height={320} fill="#BAE6FD" />
          {/* Window reflection gloss streak */}
          <line x1={150} y1={0} x2={400} y2={500} stroke="#FFFFFF" strokeWidth={18} opacity={0.25} />
          <line x1={250} y1={0} x2={500} y2={500} stroke="#FFFFFF" strokeWidth={8} opacity={0.2} />

          {/* Distant City Skyscrapers */}
          <g fill="#94A3B8" opacity={0.65}>
            <rect x={720} y={180} width={65} height={160} />
            <rect x={800} y={150} width={75} height={190} />
            <rect x={890} y={200} width={50} height={140} />
          </g>

          {/* Street Road & Pavement */}
          <polygon points="620,340 760,340 920,500 460,500" fill="#CBD5E1" stroke="#94A3B8" strokeWidth={3} />
          {/* Sidewalk curbs */}
          <rect x={0} y={380} width={1320} height={120} fill="#E2E8F0" />
          <line x1={0} y1={380} x2={1320} y2={380} stroke="#64748B" strokeWidth={4} />

          {/* Green City Street Trees (ref snap_300s) */}
          {/* Tree 1 Left */}
          <g transform="translate(100, 240)">
            <rect x={-8} y={40} width={16} height={120} fill="#78350F" />
            <circle cx={-15} cy={10} r={65} fill="#65A30D" />
            <circle cx={25} cy={-5} r={55} fill="#84CC16" />
            <circle cx={-5} cy={-30} r={50} fill="#4D7C0F" />
          </g>
          {/* Tree 2 Mid-Left */}
          <g transform="translate(380, 260)">
            <rect x={-6} y={40} width={12} height={100} fill="#78350F" />
            <circle cx={-10} cy={10} r={55} fill="#84CC16" />
            <circle cx={20} cy={-10} r={50} fill="#65A30D" />
          </g>
          {/* Tree 3 Right */}
          <g transform="translate(1200, 240)">
            <rect x={-8} y={40} width={16} height={120} fill="#78350F" />
            <circle cx={-15} cy={10} r={65} fill="#84CC16" />
            <circle cx={25} cy={-5} r={55} fill="#65A30D" />
          </g>

          {/* Vertical Window Mullions */}
          <line x1={440} y1={0} x2={440} y2={500} stroke="#18181B" strokeWidth={10} />
          <line x1={880} y1={0} x2={880} y2={500} stroke="#18181B" strokeWidth={10} />
          {/* Bottom Window Sill */}
          <rect x={-15} y={495} width={1350} height={20} fill="#78350F" stroke="#18181B" strokeWidth={4} />
        </g>

        {/* Stools on the Left (ref snap_300s) */}
        <g transform="translate(140, 720)">
          {/* Stool 1 */}
          <ellipse cx={0} cy={-60} rx={60} ry={14} fill="#C49A6C" stroke="#18181B" strokeWidth={4} />
          <ellipse cx={0} cy={-54} rx={60} ry={14} fill="#9C6644" stroke="#18181B" strokeWidth={4} />
          {/* Stool Legs */}
          <line x1={-40} y1={-45} x2={-55} y2={230} stroke="#18181B" strokeWidth={6} />
          <line x1={-15} y1={-45} x2={-20} y2={230} stroke="#18181B" strokeWidth={6} />
          <line x1={15} y1={-45} x2={20} y2={230} stroke="#18181B" strokeWidth={6} />
          <line x1={40} y1={-45} x2={55} y2={230} stroke="#18181B" strokeWidth={6} />
          {/* Stool Ring */}
          <ellipse cx={0} cy={80} rx={44} ry={10} fill="none" stroke="#18181B" strokeWidth={5} />
          <ellipse cx={0} cy={160} rx={48} ry={10} fill="none" stroke="#18181B" strokeWidth={5} />
        </g>
        <g transform="translate(290, 700)">
          {/* Stool 2 (slightly behind) */}
          <ellipse cx={0} cy={-54} rx={55} ry={13} fill="#9C6644" stroke="#18181B" strokeWidth={4} />
          <line x1={-35} y1={-45} x2={-50} y2={200} stroke="#18181B" strokeWidth={5} />
          <line x1={35} y1={-45} x2={50} y2={200} stroke="#18181B" strokeWidth={5} />
          <ellipse cx={0} cy={70} rx={40} ry={9} fill="none" stroke="#18181B" strokeWidth={4} />
        </g>

        {/* ☕ Espresso Machine on Far Right Counter (ref snap_300s) */}
        <g transform="translate(1770, 520)">
          {/* Machine Body */}
          <rect x={-80} y={-80} width={150} height={160} rx={10} fill="#CBD5E1" stroke="#18181B" strokeWidth={5} />
          <rect x={-65} y={-65} width={120} height={40} rx={4} fill="#334155" stroke="#18181B" strokeWidth={3} />
          <circle cx={-35} cy={-45} r={8} fill="#22C55E" />
          <circle cx={35} cy={-45} r={6} fill="#FACC15" />
          {/* Portafilter Group Head */}
          <rect x={-40} y={-20} width={80} height={20} fill="#64748B" stroke="#18181B" strokeWidth={4} />
          <line x1={20} y1={-10} x2={85} y2={-5} stroke="#18181B" strokeWidth={8} strokeLinecap="round" />
          {/* Drip Tray */}
          <rect x={-75} y={60} width={140} height={18} fill="#475569" stroke="#18181B" strokeWidth={4} />
          {/* Espresso Cup */}
          <rect x={-15} y={25} width={30} height={35} rx={4} fill="#FFFFFF" stroke="#18181B" strokeWidth={3} />
        </g>

        {/* 🪵 Polished Wooden Bar Counter Top & Apron (ref snap_300s) */}
        {/* Counter Apron / Face */}
        <rect x={0} y={680} width={1920} height={400} fill="#9C6644" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        {/* Polished Counter Slab Top */}
        <polygon points="0,620 1920,620 1920,680 0,680" fill="#C49A6C" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        <line x1={0} y1={625} x2={1920} y2={625} stroke="#EED9C4" strokeWidth={4} opacity={0.6} />

        {/* 🥛 Counter Milk Cartons & Drinks Layer (ref snap_300s) */}
        {/* 1. Plant Milk Carton (Mint Green with Leaf Sprout) */}
        <g transform="translate(1010, 680)">
          {/* Carton Shadow */}
          <ellipse cx={0} cy={75} rx={55} ry={12} fill="rgba(0,0,0,0.18)" />
          {/* Carton Body */}
          <polygon
            points="-45,70 45,70 45,-80 0,-115 -45,-80"
            fill="#99F6E4"
            stroke="#18181B"
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Carton Gable Roof */}
          <polygon points="-45,-80 0,-115 0,-140 -45,-105" fill="#5EEAD4" stroke="#18181B" strokeWidth={5} />
          <polygon points="45,-80 0,-115 0,-140 45,-105" fill="#2DD4BF" stroke="#18181B" strokeWidth={5} />
          {/* Screw Cap */}
          <circle cx={-15} cy={-100} r={11} fill="#FFFFFF" stroke="#18181B" strokeWidth={3.5} />
          {/* Sprout Leaves Icon (Plant Milk) */}
          <path
            d="M 0 10 C -25 -10 -25 -40 0 -45 C 25 -40 25 -10 0 10 Z"
            fill="#059669"
            stroke="#18181B"
            strokeWidth={4}
          />
          <path d="M 0 0 C -15 -20 -5 -35 0 -45" stroke="#FFFFFF" strokeWidth={3} fill="none" />
          <text x={0} y={45} textAnchor="middle" fontSize={18} fontWeight="900" fill="#047857" fontFamily="sans-serif">
            PLANT
          </text>
        </g>

        {/* 2. Cow Milk Carton (Blue & White with Cow Silhouette) */}
        <g transform="translate(1620, 680)">
          {/* Carton Shadow */}
          <ellipse cx={0} cy={75} rx={55} ry={12} fill="rgba(0,0,0,0.18)" />
          {/* Carton Body */}
          <polygon
            points="-48,70 48,70 48,-85 0,-125 -48,-85"
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth={5}
            strokeLinejoin="round"
          />
          {/* Blue Lower Banner */}
          <path
            d="M -48 -10 Q 0 10 48 -10 L 48 70 L -48 70 Z"
            fill="#2563EB"
            stroke="#18181B"
            strokeWidth={4}
          />
          {/* Gable Roof */}
          <polygon points="-48,-85 0,-125 0,-150 -48,-110" fill="#DBEAFE" stroke="#18181B" strokeWidth={5} />
          <polygon points="48,-85 0,-125 0,-150 48,-110" fill="#93C5FD" stroke="#18181B" strokeWidth={5} />
          {/* Cow Silhouette on Blue Carton */}
          <g transform="translate(0, -35) scale(0.35)">
            <ellipse cx={0} cy={0} rx={45} ry={25} fill="#18181B" />
            <circle cx={-35} cy={-12} r={18} fill="#18181B" />
            <rect x={-25} y={15} width={10} height={30} fill="#18181B" />
            <rect x={15} y={15} width={10} height={30} fill="#18181B" />
          </g>
          <text x={0} y={45} textAnchor="middle" fontSize={18} fontWeight="900" fill="#FFFFFF" fontFamily="sans-serif">
            WHOLE
          </text>
        </g>

        {/* 3. Drinking Glass with Fresh Milk (Left Stickman Glass) */}
        <g transform="translate(820, 715)">
          <ellipse cx={0} cy={35} rx={24} ry={6} fill="rgba(0,0,0,0.1)" />
          <polygon points="-22,-30 22,-30 18,35 -18,35" fill="none" stroke="#18181B" strokeWidth={4} />
          {/* Milk Inside Glass */}
          <polygon points="-20,-5 20,-5 17,33 -17,33" fill="#FFFFFF" stroke="#18181B" strokeWidth={2} />
        </g>

        {/* 4. Drinking Glass with Fresh Milk (Right Counter Glass) */}
        <g transform="translate(1480, 715)">
          <ellipse cx={0} cy={35} rx={24} ry={6} fill="rgba(0,0,0,0.1)" />
          <polygon points="-22,-30 22,-30 18,35 -18,35" fill="none" stroke="#18181B" strokeWidth={4} />
          <polygon points="-20,-5 20,-5 17,33 -17,33" fill="#FFFFFF" stroke="#18181B" strokeWidth={2} />
        </g>

        {/* Children / Characters */}
        {children}
      </svg>
    </div>
  );
};

/**
 * =========================================================================
 * 🍳 Sizzling Bacon Pan Graphic
 * =========================================================================
 */
export const SizzlingBaconPan: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const sizzle1 = Math.sin(frame * 0.4) * 2;
  const sizzle2 = Math.cos(frame * 0.4) * 2;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Pan Handle */}
      <line x1={-120} y1={0} x2={-60} y2={0} stroke="#18181B" strokeWidth={16} strokeLinecap="round" />
      {/* Skillet Base */}
      <circle cx={40} cy={0} r={95} fill="#1E293B" stroke="#18181B" strokeWidth={8} />
      <circle cx={40} cy={0} r={80} fill="#334155" />

      {/* 3 Crispy Wavy Bacon Strips */}
      <g transform={`translate(10, -35) translate(0, ${sizzle1})`}>
        <path
          d="M -15 0 Q 0 -10 15 0 Q 30 10 45 0 Q 60 -10 75 0"
          stroke="#DC2626"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -15 0 Q 0 -10 15 0 Q 30 10 45 0 Q 60 -10 75 0"
          stroke="#FEF2F2"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <g transform={`translate(0, 0) translate(0, ${sizzle2})`}>
        <path
          d="M -15 0 Q 0 -10 15 0 Q 30 10 45 0 Q 60 -10 75 0"
          stroke="#DC2626"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -15 0 Q 0 -10 15 0 Q 30 10 45 0 Q 60 -10 75 0"
          stroke="#FEF2F2"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </g>
      <g transform={`translate(15, 35) translate(0, ${sizzle1})`}>
        <path
          d="M -15 0 Q 0 -10 15 0 Q 30 10 45 0 Q 60 -10 75 0"
          stroke="#DC2626"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M -15 0 Q 0 -10 15 0 Q 30 10 45 0 Q 60 -10 75 0"
          stroke="#FEF2F2"
          strokeWidth={4}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Sizzle Steam Sparks */}
      <circle cx={35} cy={-75 + (frame % 20)} r={4} fill="#FACC15" opacity={0.8} />
      <circle cx={70} cy={-65 + ((frame + 10) % 20)} r={5} fill="#FFFFFF" opacity={0.7} />
      <circle cx={0} cy={-60 + ((frame + 5) % 20)} r={3} fill="#FACC15" opacity={0.8} />
    </g>
  );
};

/**
 * =========================================================================
 * 🥛 Pouring Milk Into Coffee Cup Scene Prop
 * =========================================================================
 */
export const CoffeeCupWithPour: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pourFlow?: boolean;
}> = ({ x, y, scale = 1, pourFlow = true }) => {
  const frame = useCurrentFrame();
  const swirl = (frame * 6) % 360;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Saucer */}
      <ellipse cx={0} cy={45} rx={85} ry={18} fill="#E2E8F0" stroke="#18181B" strokeWidth={5} />
      {/* Ceramic Mug Body */}
      <path
        d="M -50 -35 L 50 -35 L 42 40 C 35 50 -35 50 -42 40 Z"
        fill="#FFFFFF"
        stroke="#18181B"
        strokeWidth={6}
        strokeLinejoin="round"
      />
      {/* Mug Handle */}
      <path
        d="M 48 -15 C 75 -15 75 25 45 25"
        stroke="#18181B"
        strokeWidth={6}
        fill="none"
        strokeLinecap="round"
      />
      {/* Coffee Surface Rim */}
      <ellipse cx={0} cy={-30} rx={45} ry={14} fill="#451A03" stroke="#18181B" strokeWidth={4} />

      {/* Steaming Coffee Swirl */}
      <g transform={`rotate(${swirl} 0 -30)`}>
        <path
          d="M -15 -30 C -5 -38 10 -22 18 -30"
          stroke="#FEF3C7"
          strokeWidth={4}
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Smooth Cascading Stream of Milk */}
      {pourFlow && (
        <g>
          {/* Milk Stream Arch */}
          <path
            d="M 120 -180 C 60 -120 15 -60 0 -30"
            stroke="#FFFFFF"
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
          />
          {/* Splashes on Surface */}
          <circle cx={0} cy={-30} r={7} fill="#FFFFFF" />
          <ellipse cx={0} cy={-30} rx={16} ry={6} fill="#FEF3C7" opacity={0.7} />
        </g>
      )}

      {/* Wavy Rising Steam */}
      <path
        d={`M -15 -45 Q -25 -75 -15 -105 Q -5 -135 -15 -165`}
        stroke="#FFFFFF"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        opacity={0.5}
      />
      <path
        d={`M 15 -45 Q 25 -75 15 -105 Q 5 -135 15 -165`}
        stroke="#FFFFFF"
        strokeWidth={4}
        fill="none"
        strokeLinecap="round"
        opacity={0.5}
      />
    </g>
  );
};

/**
 * =========================================================================
 * 🐷 CHAPTER 7: CLOSE & FINALE MASTER COMPONENT (2735 FRAMES)
 * =========================================================================
 */
export const Chapter7_Close: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* Master Audio Track (91.17s / 2735 frames) */}
      <Audio src={staticFile('audio/pig_milk/7_close.mp3')} volume={1.0} />

      {/* Subtle Background Instrumental Track (60% channel rule / 0.15 volume) */}
      <Audio src={staticFile('audio/bgm/7.mp3')} volume={0.15} />

      {/* ================================================================ */}
      {/* SECTION 1: THE PREHISTORIC FARMER DILEMMA (0 - 612 FRAMES)        */}
      {/* ================================================================ */}

      {/* BEAT 1a: (0 - 85f) "Picture a prehistoric farmer." */}
      <Sequence from={0} durationInFrames={85}>
        <ZoomIn startFrame={0} fromScale={1.0} toScale={1.12} originX={960} originY={540} withWhoosh={false}>
          <PrehistoricFarmEnv skyColor="#FEF08A" groundColor="#D97706">
            {/* Prehistoric Farmer Stickman Avatar in Center */}
            <DoodleStickman
              x={960}
              y={510}
              scale={1.35}
              pose="idle"
              expression="curious"
              shirtColor="#B45309"
              shortsColor="#78350F"
              hat="safari"
            />
            {/* Story Badge */}
            <PopIn centerX={960} centerY={140} startFrame={5}>
              <StoryBadge text="10,000 YEARS AGO: EARLY FARMER" x={960} y={140} bgColor="#B45309" fontSize={34} />
            </PopIn>
          </PrehistoricFarmEnv>
        </ZoomIn>
      </Sequence>

      {/* BEAT 1b: (85 - 170f) "There's a pig nearby with a litter of piglets." */}
      <Sequence from={85} durationInFrames={85}>
        <PrehistoricFarmEnv skyColor="#FEF08A" groundColor="#D97706">
          {/* Prehistoric Farmer looking over at pig */}
          <DoodleStickman
            x={480}
            y={520}
            scale={1.25}
            pose="pointing_board"
            expression="smile"
            shirtColor="#B45309"
            shortsColor="#78350F"
            pupilDirection="up_right"
          />

          {/* Mother Sow Nursing on Ground */}
          <DoodlePig x={1280} y={640} scale={1.15} pose="nursing_lying" mood="calm" highlightTeats />

          {/* Hungry Piglets Nursing */}
          <DoodlePiglet x={1190} y={670} scale={0.55} angle={-15} />
          <DoodlePiglet x={1260} y={675} scale={0.55} angle={-5} />
          <DoodlePiglet x={1330} y={670} scale={0.55} angle={10} />
          <DoodlePiglet x={1400} y={675} scale={0.55} angle={20} />

          <SlideIn direction="top" distance={80} startFrame={5}>
            <StoryBadge text="A SOW WITH HER GREEDY LITTER" x={960} y={130} bgColor="#0F172A" fontSize={32} />
          </SlideIn>
        </PrehistoricFarmEnv>
      </Sequence>

      {/* BEAT 2a: (170 - 245f) "You could spend hours wrestling a small amount of milk..." */}
      <Sequence from={170} durationInFrames={75}>
        <CameraShutterEffect triggerFrame={0} flashDurationFrames={5} />
        <PrehistoricFarmEnv skyColor="#FDE047" groundColor="#B45309">
          {/* Chaos / Wrestling Cloud & Sweat */}
          <g transform="translate(960, 600)">
            {/* Angry Sow Thrashing */}
            <DoodlePig x={60} y={-20} scale={1.25} pose="standing" mood="irritated" />

            {/* Farmer wrestling holding legs */}
            <DoodleStickman
              x={-80}
              y={-70}
              scale={1.25}
              pose="panicking"
              expression="sweating"
              shirtColor="#B45309"
              shortsColor="#78350F"
            />

            {/* Dust cloud kickup */}
            <ellipse cx={0} cy={100} rx={180} ry={35} fill="#FEF08A" opacity={0.6} />
            <ellipse cx={-60} cy={90} rx={50} ry={25} fill="#FEF08A" opacity={0.7} />
            <ellipse cx={80} cy={95} rx={60} ry={28} fill="#FEF08A" opacity={0.7} />

            {/* Angry Steam & Sweat Splashes */}
            <circle cx={-130} cy={-130} r={8} fill="#38BDF8" />
            <circle cx={-110} cy={-170} r={10} fill="#38BDF8" />
            <text x={180} y={-80} fontSize={48} fontWeight="900" fill="#DC2626">💢 SQUEAL!!</text>
          </g>

          <StoryBadge text="HOURS WRESTLING AN ANGRY SOW" x={960} y={130} bgColor="#DC2626" fontSize={34} />
        </PrehistoricFarmEnv>
      </Sequence>

      {/* BEAT 2b: (245 - 323f) "...out of an irritated animal," */}
      <Sequence from={245} durationInFrames={78}>
        <PrehistoricFarmEnv skyColor="#FDE047" groundColor="#B45309">
          {/* Exhausted Farmer sitting down next to pathetic yield */}
          <DoodleStickman
            x={650}
            y={530}
            scale={1.25}
            pose="wiping_sweat"
            expression="shocked"
            shirtColor="#B45309"
            shortsColor="#78350F"
          />

          {/* Milking Bucket with literally 2 Drops */}
          <g transform="translate(1080, 680) scale(1.4)">
            <MilkingBucket x={0} y={0} scale={1.2} fillLevel={0.05} />
            {/* 2 Tiny sad milk droplets */}
            <circle cx={-5} cy={-20} r={3} fill="#FFFFFF" />
            <circle cx={8} cy={-20} r={2.5} fill="#FFFFFF" />
          </g>

          {/* Glaring Sow behind fence */}
          <DoodlePig x={1520} y={530} scale={1.05} pose="standing" mood="irritated" />

          {/* Yield Badge Callout */}
          <PopIn centerX={1080} centerY={420} startFrame={5}>
            <g transform="translate(1080, 420)">
              <rect x={-180} y={-45} width={360} height={90} rx={16} fill="#FFFFFF" stroke="#DC2626" strokeWidth={5} />
              <text x={0} y={-6} textAnchor="middle" fontSize={26} fontWeight="900" fill="#DC2626">TOTAL YIELD:</text>
              <text x={0} y={26} textAnchor="middle" fontSize={24} fontWeight="900" fill="#18181B">2 DROPS (0.05 LITERS)</text>
            </g>
          </PopIn>
        </PrehistoricFarmEnv>
      </Sequence>

      {/* BEAT 3a: (323 - 395f) "or walk over to your cow..." */}
      <Sequence from={323} durationInFrames={72}>
        <PrehistoricFarmEnv skyColor="#7DD3FC" groundColor="#86EFAC">
          {/* Serene Pasture Transition with Gentle Holstein Cow */}
          <DoodleCow x={1320} y={490} scale={1.25} mood="happy" />

          {/* Farmer calmly walking over */}
          <DoodleStickman
            x={650}
            y={500}
            scale={1.3}
            pose="waving"
            expression="smile"
            shirtColor="#B45309"
            shortsColor="#78350F"
          />

          <SlideIn direction="left" distance={100} startFrame={2}>
            <StoryBadge text="OPTION B: THE DAIRY COW 🐮" x={960} y={130} bgColor="#16A34A" fontSize={34} />
          </SlideIn>
        </PrehistoricFarmEnv>
      </Sequence>

      {/* BEAT 3b: (395 - 467f) "...and collect several liters in minutes." */}
      <Sequence from={395} durationInFrames={72}>
        <PrehistoricFarmEnv skyColor="#7DD3FC" groundColor="#86EFAC">
          {/* Cow Milking with overflowing bounty */}
          <DoodleCow x={700} y={490} scale={1.2} squirtMilk={true} mood="proud" />

          {/* Farmer sitting happily */}
          <DoodleStickman
            x={1080}
            y={510}
            scale={1.25}
            pose="idle"
            expression="grin"
            shirtColor="#B45309"
            shortsColor="#78350F"
          />

          {/* Overflowing Canisters and Pails */}
          <MilkCanister x={1380} y={620} scale={1.1} isOverflowing={true} />
          <MilkCanister x={1540} y={635} scale={0.95} isOverflowing={true} />
          <MilkingBucket x={1220} y={670} scale={1.1} fillLevel={1.0} />

          <PopIn centerX={960} centerY={130} startFrame={5}>
            <StoryBadge text="+40 LITERS IN 10 MINUTES! 🥛" x={960} y={130} bgColor="#2563EB" fontSize={34} />
          </PopIn>
        </PrehistoricFarmEnv>
      </Sequence>

      {/* BEAT 4a: (467 - 540f) "That's not a hard decision." */}
      <Sequence from={467} durationInFrames={73}>
        <StudioPillarsEnv>
          {/* Split Comparison Cards */}
          {/* Left: Pig Milking */}
          <g transform="translate(480, 480)">
            <rect x={-260} y={-220} width={520} height={440} rx={22} fill="#FEE2E2" stroke="#DC2626" strokeWidth={6} />
            <text x={0} y={-160} textAnchor="middle" fontSize={34} fontWeight="900" fill="#DC2626">MILKING A SOW</text>
            <DoodlePig x={0} y={-30} scale={0.9} mood="irritated" />
            <text x={0} y={120} textAnchor="middle" fontSize={26} fontWeight="900" fill="#991B1B">❌ 2 Hours of Chaos</text>
            <text x={0} y={160} textAnchor="middle" fontSize={26} fontWeight="900" fill="#991B1B">❌ 0.05 Liters Yield</text>
          </g>

          {/* Right: Cow Milking */}
          <g transform="translate(1440, 480)">
            <rect x={-260} y={-220} width={520} height={440} rx={22} fill="#DCFCE7" stroke="#16A34A" strokeWidth={6} />
            <text x={0} y={-160} textAnchor="middle" fontSize={34} fontWeight="900" fill="#16A34A">MILKING A COW</text>
            <DoodleCow x={0} y={-30} scale={0.8} mood="proud" />
            <text x={0} y={120} textAnchor="middle" fontSize={26} fontWeight="900" fill="#166534">✅ 10 Minutes Effort</text>
            <text x={0} y={160} textAnchor="middle" fontSize={26} fontWeight="900" fill="#166534">✅ 40 Liters Pure Gold</text>
          </g>

          {/* Stickman Avatar in Middle */}
          <DoodleStickman
            x={960}
            y={500}
            scale={1.3}
            pose="pointing_board"
            expression="grin"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          <StoryBadge text="NO-BRAINER DECISION" x={960} y={120} bgColor="#FACC15" textColor="#18181B" fontSize={34} />
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 4b: (540 - 612f) "So we don't drink pig milk," */}
      <Sequence from={540} durationInFrames={72}>
        <StudioPillarsEnv>
          {/* Avatar Explaining to Camera */}
          <DoodleStickman
            x={960}
            y={490}
            scale={1.4}
            pose="idle"
            expression="talking"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          {/* Crossed-out pig milk carton on easel */}
          <PopIn centerX={600} centerY={420} startFrame={5}>
            <g transform="translate(600, 420)">
              <rect x={-110} y={-140} width={220} height={280} rx={16} fill="#FBCFE8" stroke="#18181B" strokeWidth={5} />
              <text x={0} y={-80} textAnchor="middle" fontSize={26} fontWeight="900" fill="#9D174D">PIG MILK</text>
              <circle cx={0} cy={10} r={45} fill="#F472B6" />
              {/* Big Red Cross */}
              <line x1={-90} y1={-120} x2={90} y2={120} stroke="#DC2626" strokeWidth={10} strokeLinecap="round" />
              <line x1={90} y1={-120} x2={-90} y2={120} stroke="#DC2626" strokeWidth={10} strokeLinecap="round" />
            </g>
          </PopIn>

          <StoryBadge text="SO WHY DON'T WE DRINK PIG MILK?" x={960} y={120} bgColor="#0F172A" fontSize={36} />
        </StudioPillarsEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* SECTION 2: DEBUNKING MYTHS & 3 CORE PILLARS (612 - 1737 FRAMES)  */}
      {/* ================================================================ */}

      {/* BEAT 5: (612 - 725f) "not because it's impossible, not because it's dangerous," */}
      <Sequence from={612} durationInFrames={113}>
        <StudioPillarsEnv>
          {/* Myth Buster Stamp Cards */}
          <g transform="translate(560, 470)">
            <rect x={-220} y={-140} width={440} height={280} rx={18} fill="#1E293B" stroke="#FFFFFF" strokeWidth={5} />
            <text x={0} y={-70} textAnchor="middle" fontSize={30} fontWeight="900" fill="#94A3B8">MYTH 1</text>
            <text x={0} y={-20} textAnchor="middle" fontSize={32} fontWeight="900" fill="#FFFFFF">"IS IT IMPOSSIBLE?"</text>
            {/* Rubber Stamp */}
            <g transform="rotate(-8)">
              <rect x={-150} y={20} width={300} height={60} rx={10} fill="#DC2626" />
              <text x={0} y={62} textAnchor="middle" fontSize={30} fontWeight="900" fill="#FFFFFF">FALSE: POSSIBLE ❌</text>
            </g>
          </g>

          <g transform="translate(1360, 470)">
            <rect x={-220} y={-140} width={440} height={280} rx={18} fill="#1E293B" stroke="#FFFFFF" strokeWidth={5} />
            <text x={0} y={-70} textAnchor="middle" fontSize={30} fontWeight="900" fill="#94A3B8">MYTH 2</text>
            <text x={0} y={-20} textAnchor="middle" fontSize={32} fontWeight="900" fill="#FFFFFF">"IS IT DANGEROUS?"</text>
            <g transform="rotate(6)">
              <rect x={-150} y={20} width={300} height={60} rx={10} fill="#DC2626" />
              <text x={0} y={62} textAnchor="middle" fontSize={30} fontWeight="900" fill="#FFFFFF">FALSE: SAFE ❌</text>
            </g>
          </g>

          <DoodleStickman
            x={960}
            y={500}
            scale={1.3}
            pose="idle"
            expression="curious"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          <StoryBadge text="DEBUNKING THE COMMON MYTHS" x={960} y={120} bgColor="#3B82F6" fontSize={34} />
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 6: (725 - 812f) "and not because humans can't digest it." */}
      <Sequence from={725} durationInFrames={87}>
        <StudioPillarsEnv>
          {/* Nutritional Breakdown Card */}
          <SlideIn direction="right" distance={80} startFrame={2}>
            <g transform="translate(1300, 460)">
              <rect x={-240} y={-180} width={480} height={360} rx={20} fill="#FFFFFF" stroke="#18181B" strokeWidth={6} />
              <text x={0} y={-120} textAnchor="middle" fontSize={30} fontWeight="900" fill="#0F172A">PIG MILK NUTRITION</text>
              <line x1={-200} y1={-95} x2={200} y2={-95} stroke="#CBD5E1" strokeWidth={3} />
              <text x={-180} y={-50} fontSize={26} fontWeight="bold" fill="#334155">FAT CONTENT: 8.5%</text>
              <text x={-180} y={-5} fontSize={26} fontWeight="bold" fill="#334155">PROTEIN: 5.5%</text>
              <text x={-180} y={40} fontSize={26} fontWeight="bold" fill="#334155">LACTOSE SUGAR: 4.8%</text>
              {/* Green Pass Stamp */}
              <rect x={-180} y={85} width={360} height={55} rx={12} fill="#16A34A" />
              <text x={0} y={122} textAnchor="middle" fontSize={28} fontWeight="900" fill="#FFFFFF">100% DIGESTIBLE ✅</text>
            </g>
          </SlideIn>

          {/* Stickman sipping a glass of milk */}
          <DoodleStickman
            x={640}
            y={500}
            scale={1.35}
            pose="sipping_drink"
            expression="smile"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          <StoryBadge text="HUMANS CAN DIGEST IT EASILY" x={960} y={120} bgColor="#16A34A" fontSize={34} />
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 7a: (812 - 890f) "We don't drink it because pigs..." */}
      <Sequence from={812} durationInFrames={78}>
        <StudioPillarsEnv>
          <DoodleStickman
            x={960}
            y={490}
            scale={1.4}
            pose="pointing_board"
            expression="talking"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          <PopIn centerX={960} centerY={240} startFrame={4}>
            <g transform="translate(960, 240)">
              <rect x={-320} y={-55} width={640} height={110} rx={22} fill="#FDE047" stroke="#18181B" strokeWidth={6} />
              <text x={0} y={14} textAnchor="middle" fontSize={38} fontWeight="900" fill="#18181B">
                THE 3 REAL REASONS:
              </text>
            </g>
          </PopIn>
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 7b: (890 - 961f) "...are terrible dairy animals." */}
      <Sequence from={890} durationInFrames={71}>
        <StudioPillarsEnv>
          <CameraShutterEffect triggerFrame={0} flashDurationFrames={6} />
          {/* Big Impact Verdict Card */}
          <g transform="translate(960, 480)">
            <rect x={-460} y={-160} width={920} height={320} rx={24} fill="#DC2626" stroke="#FFFFFF" strokeWidth={8} />
            <text x={0} y={-40} textAnchor="middle" fontSize={46} fontWeight="900" fill="#FEF08A">
              VERDICT:
            </text>
            <text x={0} y={40} textAnchor="middle" fontSize={54} fontWeight="900" fill="#FFFFFF">
              TERRIBLE DAIRY ANIMALS!
            </text>
            <text x={0} y={105} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#FEE2E2">
              BIOLOGY + BEHAVIOR + ECONOMICS
            </text>
          </g>
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 8a: (961 - 1040f) "Their anatomy makes milking difficult." (Pillar 1) */}
      <Sequence from={961} durationInFrames={79}>
        <StudioPillarsEnv>
          {/* Pillar 1 Header */}
          <g transform="translate(960, 140)">
            <rect x={-260} y={-40} width={520} height={80} rx={16} fill="#F97316" stroke="#FFFFFF" strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontSize={34} fontWeight="900" fill="#FFFFFF">
              PILLAR 1: ANATOMY
            </text>
          </g>

          {/* Anatomy Failure Diagram */}
          <g transform="translate(680, 520)">
            <rect x={-280} y={-190} width={560} height={380} rx={20} fill="#FFFFFF" stroke="#18181B" strokeWidth={6} />
            <text x={0} y={-140} textAnchor="middle" fontSize={28} fontWeight="900" fill="#DC2626">
              14 TEATS • NO STORAGE CISTERN
            </text>
            <DoodlePig x={0} y={-20} scale={1.0} pose="standing" highlightTeats />
            <rect x={-240} y={90} width={480} height={70} rx={10} fill="#FEE2E2" />
            <text x={0} y={135} textAnchor="middle" fontSize={22} fontWeight="900" fill="#991B1B">
              NO POOL OF MILK TO EXTRACT!
            </text>
          </g>

          {/* Stickman Investigating with Magnifier */}
          <DoodleStickman
            x={1380}
            y={510}
            scale={1.35}
            pose="holding_magnifier"
            expression="curious"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 8b: (1040 - 1121f) "Their milk comes in short nursing bursts." */}
      <Sequence from={1040} durationInFrames={81}>
        <StudioPillarsEnv>
          {/* Digital Timer Stopwatch Display */}
          <g transform="translate(960, 480)">
            <rect x={-360} y={-180} width={720} height={360} rx={24} fill="#0284C7" stroke="#FFFFFF" strokeWidth={7} />
            <text x={0} y={-110} textAnchor="middle" fontSize={32} fontWeight="900" fill="#BAE6FD">
              OXYTOCIN LETDOWN WINDOW:
            </text>
            {/* Digital Clock Box */}
            <rect x={-220} y={-70} width={440} height={120} rx={16} fill="#0F172A" stroke="#38BDF8" strokeWidth={5} />
            <text x={0} y={15} textAnchor="middle" fontSize={72} fontWeight="900" fill="#FACC15" fontFamily="monospace">
              00:15 SEC
            </text>
            <text x={0} y={105} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#FFFFFF">
              MILK ONLY SQUIRTS IN 15-SECOND BURSTS!
            </text>
          </g>

          <StoryBadge text="RAPID, FLEETING LETDOWN" x={960} y={120} bgColor="#0284C7" fontSize={34} />
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 9a: (1121 - 1190f) "Their piglets consume almost all of it," (Pillar 2) */}
      <Sequence from={1121} durationInFrames={69}>
        <StudioPillarsEnv>
          {/* Pillar 2 Header */}
          <g transform="translate(960, 140)">
            <rect x={-280} y={-40} width={560} height={80} rx={16} fill="#9333EA" stroke="#FFFFFF" strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontSize={34} fontWeight="900" fill="#FFFFFF">
              PILLAR 2: ZERO SURPLUS
            </text>
          </g>

          {/* Swarm of Greedy Piglets Scene */}
          <g transform="translate(960, 560)">
            <DoodlePig x={0} y={0} scale={1.2} pose="nursing_lying" mood="calm" />
            <DoodlePiglet x={-140} y={40} scale={0.65} />
            <DoodlePiglet x={-60} y={45} scale={0.65} />
            <DoodlePiglet x={20} y={40} scale={0.65} />
            <DoodlePiglet x={100} y={45} scale={0.65} />
            <DoodlePiglet x={160} y={40} scale={0.65} />
          </g>

          <PopIn centerX={960} centerY={300} startFrame={5}>
            <StoryBadge text="10-14 PIGLETS IN A LITTER DRINK EVERYTHING" x={960} y={300} bgColor="#DC2626" fontSize={30} />
          </PopIn>
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 9b: (1190 - 1260f) "and pigs are simply worth more" */}
      <Sequence from={1190} durationInFrames={70}>
        <StudioPillarsEnv>
          {/* Zero Human Surplus Scale Meter */}
          <g transform="translate(960, 480)">
            <rect x={-350} y={-160} width={700} height={320} rx={22} fill="#1E293B" stroke="#FFFFFF" strokeWidth={6} />
            <text x={0} y={-90} textAnchor="middle" fontSize={32} fontWeight="900" fill="#94A3B8">
              HUMAN MILK SURPLUS:
            </text>
            <rect x={-260} y={-40} width={520} height={60} rx={12} fill="#334155" />
            {/* Zero bar */}
            <rect x={-255} y={-35} width={15} height={50} rx={8} fill="#DC2626" />
            <text x={0} y={80} textAnchor="middle" fontSize={42} fontWeight="900" fill="#EF4444">
              0% LEFTOVER FOR HUMANS
            </text>
          </g>
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 10: (1260 - 1349f) "to us as a meat animal. Cows," (Pillar 3) */}
      <Sequence from={1260} durationInFrames={89}>
        <StudioPillarsEnv>
          {/* Pillar 3 Header */}
          <g transform="translate(960, 140)">
            <rect x={-280} y={-40} width={560} height={80} rx={16} fill="#E11D48" stroke="#FFFFFF" strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontSize={34} fontWeight="900" fill="#FFFFFF">
              PILLAR 3: MEAT VALUE ($$$)
            </text>
          </g>

          {/* Sizzling Bacon Pan & Profit Arrow */}
          <SizzlingBaconPan x={680} y={510} scale={1.5} />

          <SlideIn direction="right" distance={80} startFrame={3}>
            <g transform="translate(1320, 500)">
              <rect x={-220} y={-150} width={440} height={300} rx={20} fill="#FFFFFF" stroke="#18181B" strokeWidth={6} />
              <text x={0} y={-90} textAnchor="middle" fontSize={32} fontWeight="900" fill="#DC2626">BACON & PORK</text>
              <text x={0} y={-20} textAnchor="middle" fontSize={48} fontWeight="900" fill="#16A34A">$$$ PROFIT</text>
              <text x={0} y={40} textAnchor="middle" fontSize={24} fontWeight="bold" fill="#475569">MUCH HIGHER VALUE</text>
              <text x={0} y={80} textAnchor="middle" fontSize={22} fontWeight="bold" fill="#475569">AS A MEAT ANIMAL</text>
            </g>
          </SlideIn>
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 11: (1349 - 1460f) "meanwhile, are the opposite of all that. Easy to handle," */}
      <Sequence from={1349} durationInFrames={111}>
        <PrehistoricFarmEnv skyColor="#7DD3FC" groundColor="#86EFAC">
          {/* Majestic Dairy Cow with Halo */}
          <g transform="translate(1200, 480)">
            {/* Golden Halo */}
            <ellipse cx={-140} cy={-120} rx={60} ry={16} fill="none" stroke="#FACC15" strokeWidth={8} />
            <DoodleCow x={0} y={0} scale={1.25} mood="proud" />
          </g>

          {/* Stickman Avatar Patting Cow */}
          <DoodleStickman
            x={640}
            y={500}
            scale={1.35}
            pose="idle"
            expression="smile"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          <PopIn centerX={960} centerY={130} startFrame={5}>
            <StoryBadge text="COWS: THE ULTIMATE OPPOSITE" x={960} y={130} bgColor="#16A34A" fontSize={34} />
          </PopIn>
        </PrehistoricFarmEnv>
      </Sequence>

      {/* BEAT 12: (1460 - 1566f) "easy to milk, huge udders, huge output," */}
      <Sequence from={1460} durationInFrames={106}>
        <PrehistoricFarmEnv skyColor="#7DD3FC" groundColor="#86EFAC">
          {/* Cow Milking Stream Detail */}
          <DoodleCow x={650} y={480} scale={1.25} squirtMilk={true} mood="happy" />

          {/* Output Stats Card */}
          <SlideIn direction="right" distance={90} startFrame={3}>
            <g transform="translate(1380, 470)">
              <rect x={-240} y={-180} width={480} height={360} rx={22} fill="#FFFFFF" stroke="#18181B" strokeWidth={6} />
              <text x={0} y={-120} textAnchor="middle" fontSize={32} fontWeight="900" fill="#2563EB">DAIRY COW SUPERPOWERS</text>
              <line x1={-200} y1={-90} x2={200} y2={-90} stroke="#E2E8F0" strokeWidth={3} />
              <text x={-190} y={-40} fontSize={26} fontWeight="bold" fill="#1E293B">✅ 4 Large Teats (Accessible)</text>
              <text x={-190} y={10} fontSize={26} fontWeight="bold" fill="#1E293B">✅ Massive Storage Cistern</text>
              <text x={-190} y={60} fontSize={26} fontWeight="bold" fill="#1E293B">✅ Huge Daily Surplus</text>
              <rect x={-200} y={95} width={400} height={55} rx={12} fill="#2563EB" />
              <text x={0} y={133} textAnchor="middle" fontSize={28} fontWeight="900" fill="#FFFFFF">30 - 45 LITERS / DAY</text>
            </g>
          </SlideIn>
        </PrehistoricFarmEnv>
      </Sequence>

      {/* BEAT 13a: (1566 - 1651f) "calm enough to manage," */}
      <Sequence from={1566} durationInFrames={85}>
        <PrehistoricFarmEnv skyColor="#7DD3FC" groundColor="#86EFAC">
          {/* Calm Farmer Sitting on Stool Next to Chewing Cow */}
          <DoodleCow x={1250} y={490} scale={1.2} mood="calm" />

          <DoodleStickman
            x={650}
            y={510}
            scale={1.3}
            pose="idle"
            expression="smile"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          <StoryBadge text="CALM, DOCILE & COOPERATIVE" x={960} y={130} bgColor="#16A34A" fontSize={34} />
        </PrehistoricFarmEnv>
      </Sequence>

      {/* BEAT 13b: (1651 - 1737f) "and able to keep producing for years." */}
      <Sequence from={1651} durationInFrames={86}>
        <PrehistoricFarmEnv skyColor="#7DD3FC" groundColor="#86EFAC">
          {/* Mountain of Milk Canisters */}
          <MilkCanister x={480} y={600} scale={1.1} />
          <MilkCanister x={620} y={620} scale={1.0} />
          <MilkCanister x={760} y={600} scale={1.1} />
          <MilkCanister x={550} y={450} scale={0.9} />
          <MilkCanister x={690} y={450} scale={0.9} />

          {/* Stickman Celebrating */}
          <DoodleStickman
            x={1350}
            y={500}
            scale={1.35}
            pose="waving"
            expression="grin"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          <PopIn centerX={960} centerY={130} startFrame={5}>
            <StoryBadge text="YEARS OF CONTINUOUS PRODUCTION 🥛" x={960} y={130} bgColor="#2563EB" fontSize={34} />
          </PopIn>
        </PrehistoricFarmEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* SECTION 3: EVOLUTIONARY TESTING & WINNER REVEAL (1737 - 2347)     */}
      {/* ================================================================ */}

      {/* BEAT 14: (1737 - 1868f) "Humans didn't scan every mammal on Earth and randomly land on cows." */}
      <Sequence from={1737} durationInFrames={131}>
        <StudioPillarsEnv>
          {/* Multi-Animal Candidate Cards */}
          <g transform="translate(960, 480)">
            <rect x={-520} y={-220} width={1040} height={440} rx={24} fill="#1E293B" stroke="#FFFFFF" strokeWidth={6} />
            <text x={0} y={-160} textAnchor="middle" fontSize={34} fontWeight="900" fill="#38BDF8">
              MAMMAL DAIRY CANDIDATES TESTED BY HUMANS:
            </text>
            {/* Candidate Badges */}
            {[
              { name: 'CAMEL 🐫', x: -360, y: -70, ok: true },
              { name: 'YAK 🦬', x: -120, y: -70, ok: true },
              { name: 'GOAT 🐐', x: 120, y: -70, ok: true },
              { name: 'SHEEP 🐑', x: 360, y: -70, ok: true },
              { name: 'REINDEER 🦌', x: -360, y: 50, ok: true },
              { name: 'WATER BUFFALO 🐃', x: -60, y: 50, ok: true },
              { name: 'COW 🐮', x: 260, y: 50, ok: true },
              { name: 'PIG 🐷', x: 0, y: 150, ok: false },
            ].map((item, idx) => (
              <g key={idx} transform={`translate(${item.x}, ${item.y})`}>
                <rect
                  x={-100}
                  y={-30}
                  width={200}
                  height={60}
                  rx={12}
                  fill={item.ok ? '#334155' : '#7F1D1D'}
                  stroke={item.ok ? '#64748B' : '#DC2626'}
                  strokeWidth={3}
                />
                <text x={0} y={8} textAnchor="middle" fontSize={20} fontWeight="900" fill="#FFFFFF">
                  {item.name}
                </text>
              </g>
            ))}
          </g>

          <StoryBadge text="NOT RANDOM: 10,000 YEARS OF TESTING" x={960} y={110} bgColor="#0F172A" fontSize={34} />
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 15: (1868 - 2000f) "We tested nature's options for thousands of years," */}
      <Sequence from={1868} durationInFrames={132}>
        <StudioPillarsEnv>
          {/* 10,000 Year Timeline Graphic */}
          <g transform="translate(960, 500)">
            <rect x={-480} y={-160} width={960} height={320} rx={22} fill="#0F172A" stroke="#38BDF8" strokeWidth={6} />
            <text x={0} y={-90} textAnchor="middle" fontSize={34} fontWeight="900" fill="#FACC15">
              10,000 YEARS OF DOMESTICATION
            </text>

            {/* Timeline Progress Track */}
            <line x1={-400} y1={20} x2={400} y2={20} stroke="#334155" strokeWidth={16} strokeLinecap="round" />
            <line x1={-400} y1={20} x2={350} y2={20} stroke="#22C55E" strokeWidth={16} strokeLinecap="round" />

            {/* Milestones */}
            <circle cx={-380} cy={20} r={18} fill="#22C55E" />
            <text x={-380} y={70} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#CBD5E1">8000 BCE</text>
            <text x={-380} y={100} textAnchor="middle" fontSize={18} fill="#94A3B8">Neolithic Farming</text>

            <circle cx={-100} cy={20} r={18} fill="#22C55E" />
            <text x={-100} y={70} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#CBD5E1">3000 BCE</text>
            <text x={-100} y={100} textAnchor="middle" fontSize={18} fill="#94A3B8">Bronze Age Dairy</text>

            <circle cx={200} cy={20} r={18} fill="#22C55E" />
            <text x={200} y={70} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#CBD5E1">1800 CE</text>
            <text x={200} y={100} textAnchor="middle" fontSize={18} fill="#94A3B8">Dairy Breeding</text>

            <circle cx={350} cy={20} r={22} fill="#FACC15" />
            <text x={350} y={70} textAnchor="middle" fontSize={20} fontWeight="900" fill="#FACC15">TODAY</text>
          </g>

          <StoryBadge text="NATURE'S RIGOROUS SELECTION" x={960} y={120} bgColor="#0284C7" fontSize={34} />
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 16: (2000 - 2115f) "and cows turned out to be one of the best answers." */}
      <Sequence from={2000} durationInFrames={115}>
        <PrehistoricFarmEnv skyColor="#7DD3FC" groundColor="#86EFAC">
          {/* Winner Podium with Cow #1 */}
          <g transform="translate(960, 680)">
            {/* Podium #1 Center */}
            <rect x={-120} y={-140} width={240} height={140} fill="#FACC15" stroke="#18181B" strokeWidth={6} />
            <text x={0} y={-60} textAnchor="middle" fontSize={54} fontWeight="900" fill="#78350F">#1</text>
            {/* Cow on #1 Podium */}
            <DoodleCow x={0} y={-290} scale={0.9} mood="proud" />
          </g>

          {/* Avatar Applauding with Confetti */}
          <DoodleStickman
            x={480}
            y={500}
            scale={1.35}
            pose="waving"
            expression="smile"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          <DoodleSparkle x={400} y={250} size={45} color="#FACC15" />
          <DoodleSparkle x={1520} y={250} size={45} color="#FACC15" />

          <PopIn centerX={960} centerY={130} startFrame={4}>
            <StoryBadge text="COWS: THE UNDISPUTED CHAMPION 🏆" x={960} y={130} bgColor="#CA8A04" fontSize={34} />
          </PopIn>
        </PrehistoricFarmEnv>
      </Sequence>

      {/* BEAT 17: (2115 - 2212f) "The pig wasn't rejected because its milk was bad." */}
      <Sequence from={2115} durationInFrames={97}>
        <StudioPillarsEnv>
          {/* Beaker of Fresh Pig Milk Review Card */}
          <g transform="translate(720, 500)">
            <rect x={-240} y={-170} width={480} height={340} rx={22} fill="#FFFFFF" stroke="#18181B" strokeWidth={6} />
            <text x={0} y={-110} textAnchor="middle" fontSize={30} fontWeight="900" fill="#0F172A">
              LABORATORY TASTE TEST
            </text>
            {/* Milk Beaker */}
            <polygon points="-50,30 50,30 35,110 -35,110" fill="#FFFFFF" stroke="#18181B" strokeWidth={5} />
            <text x={0} y={-30} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#16A34A">
              "SWEET & VERY CREAMY"
            </text>
            <text x={0} y={10} textAnchor="middle" fontSize={22} fill="#475569">
              FAT: 8.5% | HIGH CALCIUM
            </text>
          </g>

          {/* Stickman Avatar Explaining */}
          <DoodleStickman
            x={1350}
            y={500}
            scale={1.35}
            pose="idle"
            expression="talking"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
          />

          <StoryBadge text="THE MILK ITSELF IS DELICIOUS" x={960} y={120} bgColor="#16A34A" fontSize={34} />
        </StudioPillarsEnv>
      </Sequence>

      {/* BEAT 18: (2212 - 2347f) "It was rejected because the pig itself was bad at being a dairy machine," */}
      <Sequence from={2212} durationInFrames={135}>
        <StudioPillarsEnv>
          {/* Comical Broken Dairy Machine Pig */}
          <g transform="translate(960, 520)">
            <rect x={-420} y={-180} width={840} height={360} rx={24} fill="#FEE2E2" stroke="#DC2626" strokeWidth={7} />
            <DoodlePig x={-150} y={0} scale={1.1} pose="standing" mood="irritated" />

            {/* Jammed Cogs and Gears */}
            <g transform="translate(180, -20)">
              <circle cx={0} cy={0} r={45} fill="#64748B" stroke="#18181B" strokeWidth={5} />
              <text x={0} y={10} textAnchor="middle" fontSize={24} fontWeight="900" fill="#FFFFFF">⚙️</text>
              <line x1={-30} y1={-30} x2={30} y2={30} stroke="#DC2626" strokeWidth={8} strokeLinecap="round" />
            </g>

            <text x={180} y={70} textAnchor="middle" fontSize={30} fontWeight="900" fill="#DC2626">
              MECHANISM ERROR:
            </text>
            <text x={180} y={110} textAnchor="middle" fontSize={24} fontWeight="bold" fill="#7F1D1D">
              UNSUITABLE AS A DAIRY MACHINE
            </text>
          </g>

          <StoryBadge text="BIOLOGICALLY UNFIT FOR DAIRY HARVESTING" x={960} y={120} bgColor="#DC2626" fontSize={34} />
        </StudioPillarsEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* SECTION 4: THE MODERN CAFE COUNTER SCENE (2347 - 2605 FRAMES)    */}
      {/* Matching ref snap_300s.jpg with 2 Stickmen & Window              */}
      {/* ================================================================ */}

      {/* BEAT 19a: (2347 - 2415f) "which is why tomorrow morning," */}
      <Sequence from={2347} durationInFrames={68}>
        <ModernCafeEnv>
          {/* Morning Sunrise Badge */}
          <PopIn centerX={960} centerY={100} startFrame={2}>
            <StoryBadge text="TOMORROW MORNING: 8:00 AM ☕" x={960} y={100} bgColor="#0F172A" fontSize={34} />
          </PopIn>

          {/* Two Stickmen at the counter (ref snap_300s) */}
          {/* Stickman 1 Left (Avatar) */}
          <DoodleStickman
            x={650}
            y={460}
            scale={1.3}
            pose="idle"
            expression="smile"
            shirtColor="#FFFFFF"
            shortsColor="#1E293B"
          />

          {/* Stickman 2 Right (Friend Drinking Milk) */}
          <DoodleStickman
            x={1280}
            y={460}
            scale={1.3}
            pose="sipping_drink"
            expression="smile"
            shirtColor="#FFFFFF"
            shortsColor="#1E293B"
          />
        </ModernCafeEnv>
      </Sequence>

      {/* BEAT 19b: (2415 - 2484f) "when you pour milk into your coffee," */}
      <Sequence from={2415} durationInFrames={69}>
        <ModernCafeEnv>
          {/* Stickman Pouring Milk into Cup on Counter */}
          <DoodleStickman
            x={620}
            y={460}
            scale={1.3}
            pose="pointing_board"
            expression="smile"
            shirtColor="#FFFFFF"
            shortsColor="#1E293B"
          />

          {/* Steaming Coffee Cup with Milk Pour */}
          <CoffeeCupWithPour x={1180} y={640} scale={1.25} pourFlow={true} />

          <StoryBadge text="POURING FRESH MILK INTO YOUR MORNING COFFEE" x={960} y={100} bgColor="#B45309" fontSize={32} />
        </ModernCafeEnv>
      </Sequence>

      {/* BEAT 20: (2484 - 2605f) "you won't have to worry about a pig staring at you from the carton." */}
      <Sequence from={2484} durationInFrames={121}>
        <ModernCafeEnv>
          {/* Avatar Laughing in Relief at Counter */}
          <DoodleStickman
            x={650}
            y={460}
            scale={1.3}
            pose="waving"
            expression="grin"
            shirtColor="#FFFFFF"
            shortsColor="#1E293B"
          />

          {/* Imaginary Grumpy Pig Milk Carton Pop-Up with Red NO Slash */}
          <PopIn centerX={1320} centerY={420} startFrame={5}>
            <g transform="translate(1320, 420)">
              <rect x={-140} y={-170} width={280} height={340} rx={20} fill="#FBCFE8" stroke="#18181B" strokeWidth={6} />
              <text x={0} y={-115} textAnchor="middle" fontSize={26} fontWeight="900" fill="#9D174D">
                100% PURE
              </text>
              <text x={0} y={-80} textAnchor="middle" fontSize={32} fontWeight="900" fill="#831843">
                SOW MILK
              </text>

              {/* Grumpy Pig Face Staring */}
              <DoodlePig x={0} y={40} scale={0.7} pose="standing" mood="irritated" />

              {/* Giant Red Universal NO Circle & Slash */}
              <circle cx={0} cy={0} r={130} fill="none" stroke="#DC2626" strokeWidth={14} />
              <line x1={-90} y1={-90} x2={90} y2={90} stroke="#DC2626" strokeWidth={14} />
            </g>
          </PopIn>

          <StoryBadge text="NO PIGS STARING FROM YOUR MILK CARTON! 🚫" x={960} y={100} bgColor="#DC2626" fontSize={34} />
        </ModernCafeEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* SECTION 5: HILARIOUS BACON FINALE (2605 - 2735 FRAMES)           */}
      {/* ================================================================ */}

      {/* BEAT 21: (2605 - 2735f) "She's got better things to do, like turning breakfast into bacon." */}
      <Sequence from={2605} durationInFrames={130}>
        <PrehistoricFarmEnv skyColor="#38BDF8" groundColor="#4ADE80">
          {/* Shady Farm Meadow with Mother Sow Lounging in Bliss */}
          <g transform="translate(1120, 680)">
            {/* Sleeping Peaceful Sow */}
            <DoodlePig x={0} y={0} scale={1.3} pose="nursing_lying" mood="calm" />

            {/* Cool Black Sunglasses on Sow */}
            <g transform="translate(-160, -18)">
              <rect x={-20} y={-6} width={18} height={12} rx={3} fill="#18181B" />
              <rect x={2} y={-6} width={18} height={12} rx={3} fill="#18181B" />
              <line x1={-2} y1={-1} x2={2} y2={-1} stroke="#18181B" strokeWidth={3} />
            </g>

            {/* Giant Comic Thought Bubble */}
            <g transform="translate(20, -220)">
              {/* Bubble Trail */}
              <circle cx={-120} cy={120} r={10} fill="#FFFFFF" stroke="#18181B" strokeWidth={4} />
              <circle cx={-80} cy={80} r={16} fill="#FFFFFF" stroke="#18181B" strokeWidth={4} />
              {/* Main Thought Cloud */}
              <rect x={-280} y={-70} width={560} height={130} rx={30} fill="#FFFFFF" stroke="#18181B" strokeWidth={6} />
              <text x={0} y={-10} textAnchor="middle" fontSize={30} fontWeight="900" fill="#18181B">
                "BUSY TURNING BREAKFAST"
              </text>
              <text x={0} y={32} textAnchor="middle" fontSize={34} fontWeight="900" fill="#DC2626">
                INTO BACON! 🥓🍳
              </text>
            </g>
          </g>

          {/* Channel Stickman Avatar Giving Double Thumbs Up */}
          <DoodleStickman
            x={420}
            y={500}
            scale={1.4}
            pose="waving"
            expression="grin"
            shirtColor="#FFFFFF"
            shortsColor="#1D4ED8"
            hat="sunglasses"
          />

          {/* Celebratory Finale Sparkles & Bacon Icons */}
          <DoodleSparkle x={300} y={200} size={50} color="#FACC15" />
          <DoodleSparkle x={550} y={150} size={40} color="#FACC15" />
          <DoodleSparkle x={1600} y={200} size={50} color="#FACC15" />

          {/* Master Finale Badge */}
          <PopIn centerX={960} centerY={80} startFrame={5}>
            <StoryBadge text="PIG MILK: MYTH CLOSED 🥛🥓" x={960} y={80} bgColor="#0F172A" textColor="#FDE047" fontSize={36} />
          </PopIn>
        </PrehistoricFarmEnv>
      </Sequence>
    </div>
  );
};
