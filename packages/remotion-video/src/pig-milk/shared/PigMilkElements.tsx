import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DOODLE_STROKE, DOODLE_WIDTH, DoodleSun } from '../../animated-story/DoodleElements';
import { DoodleStickman } from '../../animated-story/DoodleStickman';

// Re-export stickman & motion effects for clean chapter imports
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
 * Engineered with extra safety margins and resilient font fallback to prevent any text clipping
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
  fontSize = 32,
  scale = 1,
}) => {
  // Conservative character width (0.85 * fontSize) + generous horizontal padding so text & emojis NEVER clip
  const charWidth = fontSize * 0.85;
  const padX = fontSize * 2.2;
  const width = Math.max(text.length * charWidth + padX, 200);
  const height = fontSize * 2.1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect
        x={-width / 2}
        y={-height / 2}
        width={width}
        height={height}
        rx={height / 2}
        fill={bgColor}
        stroke="#FFFFFF"
        strokeWidth={3.5}
      />
      <text
        x={0}
        y={fontSize * 0.35}
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily="'Comic Sans MS', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontWeight="900"
        fill={textColor}
        letterSpacing="0.5px"
      >
        {text}
      </text>
    </g>
  );
};

/**
 * 🏷️ HTML-Based Bulletproof Badge
 * Zero text-overflow guarantee because the browser computes exact text metrics via flexbox
 */
export const HtmlBadge: React.FC<{
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
  fontSize = 28,
  scale = 1,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        transform: `translate(-50%, -50%) scale(${scale})`,
        backgroundColor: bgColor,
        color: textColor,
        fontFamily: "'Comic Sans MS', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        fontWeight: 900,
        fontSize: `${fontSize}px`,
        padding: `${Math.round(fontSize * 0.35)}px ${Math.round(fontSize * 0.9)}px`,
        borderRadius: 9999,
        border: '3.5px solid #FFFFFF',
        boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
        whiteSpace: 'nowrap',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      {text}
    </div>
  );
};

/**
 * 🌑 Physical Ground Contact Shadow
 * Grounds characters, animals, and props so they never appear to float like random stickers
 */
export const GroundShadow: React.FC<{
  x: number;
  y: number;
  rx: number;
  ry: number;
  opacity?: number;
}> = ({ x, y, rx, ry, opacity = 0.2 }) => (
  <ellipse cx={x} cy={y} rx={rx} ry={ry} fill="#0F172A" opacity={opacity} />
);

/**
 * 🐮 Hand-Drawn Holstein Dairy Cow
 * Matches reference style: cute black spots, 4-teat pink udder, horns, ears, chewing mouth
 */
export const DoodleCow: React.FC<{
  x: number;
  y: number;
  scale?: number;
  isMilking?: boolean;
  mood?: 'happy' | 'calm' | 'proud';
  squirtMilk?: boolean;
}> = ({ x, y, scale = 1, isMilking = false, mood = 'happy', squirtMilk = false }) => {
  const frame = useCurrentFrame();
  const chew = Math.sin(frame * 0.15) * 3;
  const tailWag = Math.sin(frame * 0.12) * 6;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={160} rx={160} ry={22} fill="rgba(0,0,0,0.12)" />

      {/* Tail */}
      <path
        d={`M 140 10 Q ${165 + tailWag} 60 ${150 + tailWag * 1.5} 120`}
        stroke="#18181B"
        strokeWidth={DOODLE_WIDTH}
        fill="none"
        strokeLinecap="round"
      />
      <ellipse cx={150 + tailWag * 1.5} cy={125} rx={8} ry={14} fill="#18181B" />

      {/* Back Left Leg */}
      <rect x={100} y={60} width={28} height={100} rx={6} fill="#F8FAFC" stroke="#18181B" strokeWidth={5} />
      <polygon points="98,150 130,150 126,162 96,162" fill="#18181B" />

      {/* Back Right Leg */}
      <rect x={70} y={60} width={28} height={95} rx={6} fill="#F1F5F9" stroke="#18181B" strokeWidth={5} />
      <polygon points="68,145 100,145 96,157 66,157" fill="#18181B" />

      {/* Pink Udder with 4 Teats */}
      <g transform="translate(45, 75)">
        <path d="M -35 -10 C -35 25 35 25 35 -10 Z" fill="#FDA4AF" stroke="#18181B" strokeWidth={5} />
        {/* Teats */}
        <rect x={-28} y={15} width={9} height={18} rx={4} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />
        <rect x={-10} y={18} width={9} height={18} rx={4} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />
        <rect x={8} y={18} width={9} height={18} rx={4} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />
        <rect x={24} y={15} width={9} height={18} rx={4} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />

        {/* Animated Milk Squirts */}
        {squirtMilk && (
          <g stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round">
            <line x1={-24} y1={33} x2={-20} y2={60 + (frame % 15) * 2} />
            <line x1={-6} y1={36} x2={-2} y2={65 + (frame % 15) * 2} />
            <line x1={12} y1={36} x2={16} y2={65 + (frame % 15) * 2} />
            <line x1={28} y1={33} x2={32} y2={60 + (frame % 15) * 2} />
          </g>
        )}
      </g>

      {/* Main Cow Body */}
      <path
        d="M -130 -30 
           C -100 -50 80 -45 140 -20 
           C 160 10 150 70 130 80 
           C 60 90 -70 85 -130 65 
           Z"
        fill="#FFFFFF"
        stroke="#18181B"
        strokeWidth={DOODLE_WIDTH}
        strokeLinejoin="round"
      />

      {/* Black Spots on Cow Body */}
      <path d="M -70 -40 C -40 -45 -30 -10 -50 15 C -80 30 -90 -10 -70 -40 Z" fill="#18181B" />
      <path d="M 20 -35 C 70 -40 85 0 65 30 C 45 50 10 40 20 -35 Z" fill="#18181B" />
      <path d="M 110 -10 C 135 -15 145 20 130 40 C 115 50 100 20 110 -10 Z" fill="#18181B" />

      {/* Front Left Leg */}
      <rect x={-90} y={60} width={28} height={100} rx={6} fill="#FFFFFF" stroke="#18181B" strokeWidth={5} />
      <polygon points="-92,150 -60,150 -64,162 -94,162" fill="#18181B" />

      {/* Front Right Leg */}
      <rect x={-120} y={60} width={28} height={95} rx={6} fill="#F1F5F9" stroke="#18181B" strokeWidth={5} />
      <polygon points="-122,145 -90,145 -94,157 -124,157" fill="#18181B" />

      {/* Cow Head & Neck */}
      <g transform={`translate(-140, -40) rotate(${chew * 0.5})`}>
        {/* Horns */}
        <path d="M -15 -35 Q -30 -60 -45 -50" stroke="#FDE047" strokeWidth={8} fill="none" strokeLinecap="round" />
        <path d="M 25 -35 Q 40 -60 55 -50" stroke="#FDE047" strokeWidth={8} fill="none" strokeLinecap="round" />

        {/* Ears */}
        <ellipse cx={-40} cy={-20} rx={18} ry={10} fill="#FFFFFF" stroke="#18181B" strokeWidth={4} transform="rotate(-20 -40 -20)" />
        <ellipse cx={40} cy={-20} rx={18} ry={10} fill="#18181B" stroke="#18181B" strokeWidth={4} transform="rotate(20 40 -20)" />

        {/* Head Base */}
        <ellipse cx={0} cy={-10} rx={36} ry={44} fill="#FFFFFF" stroke="#18181B" strokeWidth={5} />
        {/* Head Black Spot */}
        <path d="M -20 -45 C 5 -45 15 -25 0 -10 C -20 0 -35 -20 -20 -45 Z" fill="#18181B" />

        {/* Big Oval Eyes */}
        <circle cx={-16} cy={-16} r={10} fill="#FFFFFF" stroke="#18181B" strokeWidth={3.5} />
        <circle cx={-14} cy={-16} r={4.5} fill="#18181B" />
        <circle cx={16} cy={-16} r={10} fill="#FFFFFF" stroke="#18181B" strokeWidth={3.5} />
        <circle cx={18} cy={-16} r={4.5} fill="#18181B" />

        {/* Pink Snout / Muzzle */}
        <rect x={-32} y={10} width={64} height={38} rx={16} fill="#FDA4AF" stroke="#18181B" strokeWidth={5} />
        {/* Nostrils */}
        <circle cx={-12} cy={28} r={4} fill="#9F1239" />
        <circle cx={12} cy={28} r={4} fill="#9F1239" />

        {/* Chewing Straw / Grass */}
        <line x1={-8 + chew} y1={36} x2={-32 + chew * 2} y2={48} stroke="#84CC16" strokeWidth={5} strokeLinecap="round" />
        <line x1={-32 + chew * 2} y1={48} x2={-45} y2={45} stroke="#84CC16" strokeWidth={4} strokeLinecap="round" />
      </g>
    </g>
  );
};

/**
 * 🐷 Hand-Drawn Mother Sow (Pig)
 * Supports standing or lying down nursing pose with 14 small teats
 */
export const DoodlePig: React.FC<{
  x: number;
  y: number;
  scale?: number;
  pose?: 'standing' | 'nursing_lying';
  mood?: 'calm' | 'irritated' | 'eating';
  highlightTeats?: boolean;
}> = ({ x, y, scale = 1, pose = 'standing', mood = 'calm', highlightTeats = false }) => {
  const frame = useCurrentFrame();
  const earWiggle = Math.sin(frame * 0.12) * 2;
  const tailTwitch = Math.sin(frame * 0.25) * 5;

  if (pose === 'nursing_lying') {
    // Lying on side with 14 teats exposed for piglets
    return (
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        {/* Shadow */}
        <ellipse cx={0} cy={70} rx={180} ry={25} fill="rgba(0,0,0,0.12)" />

        {/* Pig Body (Lying down) */}
        <ellipse cx={0} cy={0} rx={160} ry={65} fill="#F472B6" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

        {/* Curly Tail */}
        <path
          d={`M 155 -15 Q 185 -35 175 -50 Q 160 -60 170 -40`}
          stroke="#18181B"
          strokeWidth={DOODLE_WIDTH}
          fill="none"
          strokeLinecap="round"
        />

        {/* Back Legs resting */}
        <ellipse cx={130} cy={45} rx={32} ry={16} fill="#F472B6" stroke="#18181B" strokeWidth={5} />
        <ellipse cx={-110} cy={45} rx={30} ry={15} fill="#F472B6" stroke="#18181B" strokeWidth={5} />

        {/* Head */}
        <g transform={`translate(-160, -10) rotate(${earWiggle})`}>
          <ellipse cx={0} cy={0} rx={42} ry={36} fill="#F472B6" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
          {/* Floppy Ears */}
          <polygon points="-20,-25 -45,-55 5,-40" fill="#EC4899" stroke="#18181B" strokeWidth={5} strokeLinejoin="round" />
          <polygon points="10,-25 35,-55 -10,-40" fill="#EC4899" stroke="#18181B" strokeWidth={5} strokeLinejoin="round" />

          {/* Eye */}
          <circle cx={-10} cy={-8} r={9} fill="#FFFFFF" stroke="#18181B" strokeWidth={3.5} />
          <circle cx={-9} cy={-8} r={4.5} fill="#18181B" />

          {/* Snout */}
          <ellipse cx={-40} cy={8} rx={18} ry={14} fill="#FBCFE8" stroke="#18181B" strokeWidth={5} />
          <circle cx={-45} cy={8} r={3.5} fill="#9D174D" />
          <circle cx={-35} cy={8} r={3.5} fill="#9D174D" />
        </g>

        {/* 14 Teats Row along Belly */}
        <g transform="translate(-100, 38)">
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i} transform={`translate(${i * 32}, 0)`}>
              <circle
                cx={0}
                cy={0}
                r={highlightTeats ? 7 : 5}
                fill={highlightTeats ? '#FDA4AF' : '#EC4899'}
                stroke="#18181B"
                strokeWidth={3}
              />
              <circle
                cx={12}
                cy={12}
                r={highlightTeats ? 7 : 5}
                fill={highlightTeats ? '#FDA4AF' : '#EC4899'}
                stroke="#18181B"
                strokeWidth={3}
              />
            </g>
          ))}
        </g>
      </g>
    );
  }

  // Standing Sow
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={135} rx={135} ry={18} fill="rgba(0,0,0,0.12)" />

      {/* Curly Tail */}
      <path
        d={`M 115 -10 Q ${140 + tailTwitch} -25 135 -40 Q 125 -50 135 -35`}
        stroke="#18181B"
        strokeWidth={DOODLE_WIDTH}
        fill="none"
        strokeLinecap="round"
      />

      {/* Back Legs */}
      <rect x={80} y={45} width={22} height={85} rx={5} fill="#F472B6" stroke="#18181B" strokeWidth={5} />
      <polygon points="78,125 104,125 101,135 76,135" fill="#18181B" />
      <rect x={55} y={45} width={22} height={80} rx={5} fill="#EC4899" stroke="#18181B" strokeWidth={5} />
      <polygon points="53,120 79,120 76,130 51,130" fill="#18181B" />

      {/* Front Legs */}
      <rect x={-75} y={45} width={22} height={85} rx={5} fill="#F472B6" stroke="#18181B" strokeWidth={5} />
      <polygon points="-77,125 -51,125 -54,135 -79,135" fill="#18181B" />
      <rect x={-100} y={45} width={22} height={80} rx={5} fill="#EC4899" stroke="#18181B" strokeWidth={5} />
      <polygon points="-102,120 -76,120 -79,130 -104,130" fill="#18181B" />

      {/* Body */}
      <path
        d="M -110 -20 
           C -70 -55 70 -50 115 -15 
           C 130 15 125 60 100 70 
           C 50 85 -50 80 -110 50 
           Z"
        fill="#F472B6"
        stroke="#18181B"
        strokeWidth={DOODLE_WIDTH}
        strokeLinejoin="round"
      />

      {/* Small Teats on Underbelly */}
      <g transform="translate(-40, 68)">
        <circle cx={-20} cy={0} r={4} fill="#EC4899" stroke="#18181B" strokeWidth={2.5} />
        <circle cx={0} cy={2} r={4} fill="#EC4899" stroke="#18181B" strokeWidth={2.5} />
        <circle cx={20} cy={2} r={4} fill="#EC4899" stroke="#18181B" strokeWidth={2.5} />
        <circle cx={40} cy={0} r={4} fill="#EC4899" stroke="#18181B" strokeWidth={2.5} />
      </g>

      {/* Head */}
      <g transform={`translate(-115, -15) rotate(${earWiggle})`}>
        <ellipse cx={0} cy={0} rx={38} ry={32} fill="#F472B6" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        {/* Floppy Ears */}
        <polygon points="-15,-20 -38,-50 10,-35" fill="#EC4899" stroke="#18181B" strokeWidth={4.5} strokeLinejoin="round" />

        {/* Eyes */}
        {mood === 'irritated' ? (
          <g>
            <line x1={-18} y1={-8} x2={-6} y2={-2} stroke="#18181B" strokeWidth={4} strokeLinecap="round" />
            <line x1={6} y1={-2} x2={18} y2={-8} stroke="#18181B" strokeWidth={4} strokeLinecap="round" />
            {/* Angry veins */}
            <path d="M 5 -25 L 15 -35 M 15 -25 L 5 -35" stroke="#DC2626" strokeWidth={3} />
          </g>
        ) : (
          <g>
            <circle cx={-10} cy={-6} r={8} fill="#FFFFFF" stroke="#18181B" strokeWidth={3} />
            <circle cx={-8} cy={-6} r={4} fill="#18181B" />
          </g>
        )}

        {/* Snout */}
        <ellipse cx={-32} cy={10} rx={16} ry={12} fill="#FBCFE8" stroke="#18181B" strokeWidth={4.5} />
        <circle cx={-36} cy={10} r={3} fill="#9D174D" />
        <circle cx={-28} cy={10} r={3} fill="#9D174D" />
      </g>
    </g>
  );
};

/**
 * 🐽 Cute Mini Piglet
 */
export const DoodlePiglet: React.FC<{
  x: number;
  y: number;
  scale?: number;
  angle?: number;
}> = ({ x, y, scale = 0.5, angle = 0 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale}) rotate(${angle})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={45} rx={45} ry={8} fill="rgba(0,0,0,0.1)" />
      {/* Legs */}
      <line x1={-20} y1={15} x2={-20} y2={45} stroke="#18181B" strokeWidth={5} strokeLinecap="round" />
      <line x1={20} y1={15} x2={20} y2={45} stroke="#18181B" strokeWidth={5} strokeLinecap="round" />
      {/* Body */}
      <ellipse cx={0} cy={0} rx={42} ry={28} fill="#F9A8D4" stroke="#18181B" strokeWidth={5} />
      {/* Curly Tail */}
      <path d="M 38 -5 Q 52 -15 48 -25" stroke="#18181B" strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* Head */}
      <g transform="translate(-35, -5)">
        <ellipse cx={0} cy={0} rx={22} ry={18} fill="#F9A8D4" stroke="#18181B" strokeWidth={4.5} />
        <polygon points="-5,-12 -15,-28 8,-20" fill="#F472B6" stroke="#18181B" strokeWidth={3.5} />
        <circle cx={-5} cy={-3} r={4.5} fill="#18181B" />
        <ellipse cx={-18} cy={5} rx={9} ry={7} fill="#FCE7F3" stroke="#18181B" strokeWidth={3.5} />
        <circle cx={-20} cy={5} r={1.8} fill="#9D174D" />
        <circle cx={-16} cy={5} r={1.8} fill="#9D174D" />
      </g>
    </g>
  );
};

/**
 * 🥛 Milk Storage Canister / Pail / Bottle Components
 */
export const MilkCanister: React.FC<{
  x: number;
  y: number;
  scale?: number;
  isOverflowing?: boolean;
}> = ({ x, y, scale = 1, isOverflowing = false }) => {
  const frame = useCurrentFrame();

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={140} rx={75} ry={14} fill="rgba(0,0,0,0.12)" />

      {/* Handles */}
      <path d="M -55 20 C -80 30 -80 70 -55 80" stroke="#18181B" strokeWidth={7} fill="none" />
      <path d="M 55 20 C 80 30 80 70 55 80" stroke="#18181B" strokeWidth={7} fill="none" />

      {/* Metal Canister Body */}
      <rect x={-55} y={-40} width={110} height={175} rx={16} fill="#CBD5E1" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
      {/* Metal Neck & Lip */}
      <polygon points="-50,-40 -35,-80 35,-80 50,-40" fill="#94A3B8" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
      <ellipse cx={0} cy={-80} rx={35} ry={12} fill="#E2E8F0" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

      {/* Metallic Highlights */}
      <line x1={-30} y1={-20} x2={-30} y2={110} stroke="#FFFFFF" strokeWidth={6} opacity={0.6} />

      {/* Overflowing Foam / Milk Waterfall */}
      {isOverflowing && (
        <g>
          {/* Milk Foam Head */}
          <ellipse cx={0} cy={-85} rx={38} ry={16} fill="#FFFFFF" stroke="#18181B" strokeWidth={4} />
          {/* Gushing Cascading Milk */}
          <path
            d={`M -25 -80 C -35 -20 -45 50 -40 140 L -15 140 C -20 60 -10 -20 -5 -80 Z`}
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth={4}
          />
          {/* Milk Puddle on Ground */}
          <ellipse cx={-25} cy={142} rx={60} ry={14} fill="#FFFFFF" stroke="#18181B" strokeWidth={4} />
          {/* Splashes */}
          <circle cx={-65} cy={125 + Math.sin(frame * 0.3) * 5} r={5} fill="#FFFFFF" />
          <circle cx={15} cy={130 + Math.cos(frame * 0.3) * 4} r={4} fill="#FFFFFF" />
        </g>
      )}
    </g>
  );
};

/**
 * 🪣 Metal Milking Pail with Foam
 */
export const MilkingBucket: React.FC<{
  x: number;
  y: number;
  scale?: number;
  fillLevel?: number; // 0 to 1
}> = ({ x, y, scale = 1, fillLevel = 0.85 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <polygon points="-35,-30 35,-30 25,35 -25,35" fill="#94A3B8" stroke="#18181B" strokeWidth={5} />
      {/* Handle */}
      <path d="M -36 -25 Q 0 -60 36 -25" stroke="#18181B" strokeWidth={4.5} fill="none" strokeLinecap="round" />
      {/* Milk inside */}
      <ellipse cx={0} cy={-30 + (1 - fillLevel) * 40} rx={32 * fillLevel + 5} ry={8} fill="#FFFFFF" stroke="#18181B" strokeWidth={3} />
    </g>
  );
};

/**
 * 🌾 Pasture & Barn Full-Bleed Environment
 */
export const FarmPastureEnv: React.FC<{
  children: React.ReactNode;
  skyColor?: string;
  groundColor?: string;
  horizonY?: number;
  showBarn?: boolean;
  showFence?: boolean;
  showSun?: boolean;
}> = ({
  children,
  skyColor = '#7DD3FC',
  groundColor = '#86EFAC',
  horizonY = 530,
  showBarn = true,
  showFence = true,
  showSun = true,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Sky */}
        <rect x={0} y={0} width={1920} height={horizonY} fill={skyColor} />

        {/* Rolling Hills Background */}
        <path d="M 0 500 Q 400 420 850 490 T 1920 480 L 1920 540 L 0 540 Z" fill="#4ADE80" opacity={0.6} />

        {/* Sun */}
        {showSun && <DoodleSun x={1680} y={150} size={110} />}

        {/* Red Traditional Barn */}
        {showBarn && (
          <g transform="translate(1500, 420) scale(0.95)">
            {/* Barn Wall */}
            <rect x={-90} y={-70} width={180} height={140} fill="#DC2626" stroke="#18181B" strokeWidth={5} />
            {/* Gambrel Roof */}
            <polygon points="-105,-70 -60,-130 0,-150 60,-130 105,-70" fill="#B91C1C" stroke="#18181B" strokeWidth={5} />
            {/* White Barn Door with X */}
            <rect x={-30} y={10} width={60} height={60} fill="#FFFFFF" stroke="#18181B" strokeWidth={4} />
            <line x1={-30} y1={10} x2={30} y2={70} stroke="#DC2626" strokeWidth={4} />
            <line x1={30} y1={10} x2={-30} y2={70} stroke="#DC2626" strokeWidth={4} />
            {/* Loft Window */}
            <rect x={-18} y={-60} width={36} height={36} fill="#FEF08A" stroke="#18181B" strokeWidth={3} />
          </g>
        )}

        {/* Ground */}
        <rect x={0} y={horizonY} width={1920} height={1080 - horizonY} fill={groundColor} />
        <line x1={0} y1={horizonY} x2={1920} y2={horizonY} stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

        {/* Wooden Fence */}
        {showFence && (
          <g stroke="#78350F" strokeWidth={6} strokeLinecap="round">
            <line x1={0} y1={horizonY - 40} x2={1100} y2={horizonY - 40} />
            <line x1={0} y1={horizonY - 15} x2={1100} y2={horizonY - 15} />
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1={80 + i * 125} y1={horizonY - 65} x2={80 + i * 125} y2={horizonY + 20} strokeWidth={8} />
            ))}
          </g>
        )}

        {/* Children Props & Characters */}
        {children}
      </svg>
    </div>
  );
};

/**
 * 🏚️ Rustic Wooden Barn Interior Environment
 */
export const BarnInteriorEnv: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Wood Plank Back Wall */}
        <rect x={0} y={0} width={1920} height={680} fill="#B45309" />
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={0} y1={i * 50} x2={1920} y2={i * 50} stroke="#78350F" strokeWidth={4} />
        ))}

        {/* Wooden Support Beams */}
        <rect x={180} y={0} width={45} height={680} fill="#92400E" stroke="#451A03" strokeWidth={5} />
        <rect x={1650} y={0} width={45} height={680} fill="#92400E" stroke="#451A03" strokeWidth={5} />

        {/* Hanging Barn Lantern */}
        <g transform="translate(200, 160)">
          <line x1={0} y1={-160} x2={0} y2={0} stroke="#18181B" strokeWidth={4} />
          <rect x={-18} y={0} width={36} height={50} rx={6} fill="#FEF08A" stroke="#18181B" strokeWidth={4} />
          <circle cx={0} cy={25} r={28} fill="rgba(254, 240, 138, 0.45)" />
        </g>

        {/* Hay Floor */}
        <rect x={0} y={680} width={1920} height={400} fill="#D97706" />
        <line x1={0} y1={680} x2={1920} y2={680} stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

        {/* Stacked Hay Bales */}
        <g transform="translate(1520, 620)">
          <rect x={-80} y={-50} width={160} height={70} rx={8} fill="#FDE047" stroke="#18181B" strokeWidth={4} />
          <line x1={-80} y1={-15} x2={80} y2={-15} stroke="#CA8A04" strokeWidth={3} />
          <rect x={-70} y={-115} width={140} height={65} rx={8} fill="#FACC15" stroke="#18181B" strokeWidth={4} />
          <line x1={-70} y1={-85} x2={70} y2={-85} stroke="#CA8A04" strokeWidth={3} />
        </g>

        {/* Children */}
        {children}
      </svg>
    </div>
  );
};

/**
 * 🍼 Tiny Medicine Milk Bottle on Wooden Stool (Matches ref_pig_snap_210s.jpg)
 */
export const TinyMilkBottle: React.FC<{
  x: number;
  y: number;
  scale?: number;
  fillFraction?: number; // 0 to 1 (default 0.4 half-empty)
}> = ({ x, y, scale = 1, fillFraction = 0.4 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Floor Shadow */}
      <ellipse cx={0} cy={140} rx={60} ry={14} fill="rgba(0,0,0,0.12)" />

      {/* Wooden Stool */}
      <g>
        {/* Stool Legs */}
        <line x1={-38} y1={55} x2={-48} y2={135} stroke="#78350F" strokeWidth={7} strokeLinecap="round" />
        <line x1={-14} y1={60} x2={-18} y2={135} stroke="#92400E" strokeWidth={6} strokeLinecap="round" />
        <line x1={14} y1={60} x2={18} y2={135} stroke="#92400E" strokeWidth={6} strokeLinecap="round" />
        <line x1={38} y1={55} x2={48} y2={135} stroke="#78350F" strokeWidth={7} strokeLinecap="round" />
        {/* Stool Crossbar */}
        <path d="M -34 100 Q 0 108 34 100" stroke="#78350F" strokeWidth={5} fill="none" strokeLinecap="round" />
        {/* Stool Seat Top */}
        <ellipse cx={0} cy={55} rx={52} ry={15} fill="#B45309" stroke="#18181B" strokeWidth={5} />
        <ellipse cx={0} cy={51} rx={48} ry={12} fill="#D97706" />
      </g>

      {/* Glass Medicine Bottle */}
      <g transform="translate(0, -10)">
        {/* Bottle Body */}
        <rect
          x={-24}
          y={-30}
          width={48}
          height={85}
          rx={12}
          fill="rgba(241, 245, 249, 0.7)"
          stroke="#18181B"
          strokeWidth={DOODLE_WIDTH}
        />

        {/* Milk Inside (Half Empty) */}
        {fillFraction > 0 && (
          <path
            d={`M -20 ${50 - fillFraction * 75} 
               L 20 ${50 - fillFraction * 75} 
               L 20 45 
               C 20 52 -20 52 -20 45 Z`}
            fill="#FFFFFF"
            stroke="#18181B"
            strokeWidth={3}
          />
        )}

        {/* Graduation / Measurement Ticks */}
        <line x1={-18} y1={10} x2={-10} y2={10} stroke="#94A3B8" strokeWidth={3} />
        <line x1={-18} y1={25} x2={-12} y2={25} stroke="#94A3B8" strokeWidth={3} />
        <line x1={-18} y1={-5} x2={-10} y2={-5} stroke="#94A3B8" strokeWidth={3} />

        {/* Glass Bottle Neck & Lip */}
        <polygon points="-16,-30 -12,-65 12,-65 16,-30" fill="rgba(241, 245, 249, 0.85)" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        <ellipse cx={0} cy={-65} rx={15} ry={6} fill="#E2E8F0" stroke="#18181B" strokeWidth={4} />

        {/* Cork Stopper */}
        <polygon points="-11,-65 -13,-85 13,-85 11,-65" fill="#D97706" stroke="#18181B" strokeWidth={4.5} />
        <line x1={-9} y1={-75} x2={9} y2={-75} stroke="#92400E" strokeWidth={2} />

        {/* Glass Reflection Streak */}
        <line x1={12} y1={-20} x2={12} y2={35} stroke="#FFFFFF" strokeWidth={4} strokeLinecap="round" opacity={0.8} />
      </g>
    </g>
  );
};

/**
 * ☕ Modern Cafe Counter Environment
 */
export const CafeCounterEnv: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Wall */}
        <rect x={0} y={0} width={1920} height={680} fill="#F1F5F9" />

        {/* Tiled Pattern Accent Wall */}
        {Array.from({ length: 14 }).map((_, i) => (
          <line key={i} x1={0} y1={i * 50} x2={1920} y2={i * 50} stroke="#E2E8F0" strokeWidth={2} />
        ))}
        {Array.from({ length: 38 }).map((_, i) => (
          <line key={i} x1={i * 50} y1={0} x2={i * 50} y2={680} stroke="#E2E8F0" strokeWidth={2} />
        ))}

        {/* Cafe Chalkboard Menu */}
        <g transform="translate(420, 180)">
          <rect x={-200} y={-110} width={400} height={220} rx={12} fill="#1E293B" stroke="#78350F" strokeWidth={8} />
          <text x={0} y={-60} textAnchor="middle" fill="#F8FAFC" fontSize={26} fontWeight="bold" fontFamily="sans-serif">
            ☕ SPECIALTY COFFEE
          </text>
          <line x1={-150} y1={-45} x2={150} y2={-45} stroke="#64748B" strokeWidth={2} />
          <text x={-140} y={-10} fill="#FDE047" fontSize={20} fontFamily="sans-serif">Flat White (Cow Milk) ... $4.50</text>
          <text x={-140} y={25} fill="#93C5FD" fontSize={20} fontFamily="sans-serif">Oat Latte (Plant) ........ $5.00</text>
          <text x={-140} y={60} fill="#FDA4AF" fontSize={20} fontFamily="sans-serif">Pig Milk Cortado ....... ??? 🚫</text>
        </g>

        {/* Big Cafe Window */}
        <g transform="translate(1380, 200)">
          <rect x={-260} y={-140} width={520} height={280} rx={8} fill="#BAE6FD" stroke="#18181B" strokeWidth={6} />
          {/* Sunny Outdoor View */}
          <path d="M -255 70 Q -100 10 50 60 T 255 50 L 255 135 L -255 135 Z" fill="#86EFAC" />
          <circle cx={140} cy={-40} r={40} fill="#FDE047" />
          {/* Window Panes */}
          <line x1={0} y1={-140} x2={0} y2={140} stroke="#18181B" strokeWidth={5} />
          <line x1={-260} y1={0} x2={260} y2={0} stroke="#18181B" strokeWidth={5} />
        </g>

        {/* Overhead Modern Hanging Pendant Lamps */}
        {[300, 960, 1620].map((lx, i) => (
          <g key={i} transform={`translate(${lx}, 0)`}>
            <line x1={0} y1={0} x2={0} y2={140} stroke="#18181B" strokeWidth={3} />
            <polygon points="-30,170 30,170 18,140 -18,140" fill="#0F172A" stroke="#18181B" strokeWidth={3} />
            <circle cx={0} cy={175} r={12} fill="#FEF08A" />
            <circle cx={0} cy={180} r={45} fill="rgba(254, 240, 138, 0.25)" />
          </g>
        ))}

        {/* Cafe Floor (Polished Wood) */}
        <rect x={0} y={680} width={1920} height={400} fill="#78350F" />
        <line x1={0} y1={680} x2={1920} y2={680} stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

        {/* Polished Counter Bar */}
        <rect x={0} y={650} width={1920} height={45} fill="#D97706" stroke="#18181B" strokeWidth={4} />
        <line x1={0} y1={650} x2={1920} y2={650} stroke="#FDE68A" strokeWidth={3} />

        {/* Children */}
        {children}
      </svg>
    </div>
  );
};

/**
 * ⚖️ Comparison Split Environment (Left vs Right)
 */
export const ComparisonSplitEnv: React.FC<{
  leftColor?: string;
  rightColor?: string;
  leftTitle?: string;
  rightTitle?: string;
  children: React.ReactNode;
}> = ({
  leftColor = '#E0F2FE',
  rightColor = '#FCE7F3',
  leftTitle = '🐮 THE DAIRY COW',
  rightTitle = '🐷 THE PIG',
  children,
}) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Left Side */}
        <rect x={0} y={0} width={960} height={1080} fill={leftColor} />
        {/* Right Side */}
        <rect x={960} y={0} width={960} height={1080} fill={rightColor} />

        {/* Ground Bar */}
        <rect x={0} y={820} width={960} height={260} fill="#86EFAC" opacity={0.6} />
        <rect x={960} y={820} width={960} height={260} fill="#FDBA74" opacity={0.5} />
        <line x1={0} y1={820} x2={1920} y2={820} stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

        {/* Center Split Divider Line */}
        <line x1={960} y1={0} x2={960} y2={1080} stroke="#18181B" strokeWidth={7} strokeDasharray="16 10" />

        {/* VS Badge at Center */}
        <g transform="translate(960, 110)">
          <circle cx={0} cy={0} r={46} fill="#EF4444" stroke="#18181B" strokeWidth={5} />
          <text x={0} y={12} textAnchor="middle" fill="#FFFFFF" fontSize={32} fontWeight="900" fontFamily="sans-serif">
            VS
          </text>
        </g>

        {/* Header Badges */}
        {leftTitle && (
          <g transform="translate(480, 80)">
            <rect x={-200} y={-30} width={400} height={60} rx={30} fill="#0284C7" stroke="#18181B" strokeWidth={4} />
            <text x={0} y={9} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="sans-serif">
              {leftTitle}
            </text>
          </g>
        )}

        {rightTitle && (
          <g transform="translate(1440, 80)">
            <rect x={-200} y={-30} width={400} height={60} rx={30} fill="#DB2777" stroke="#18181B" strokeWidth={4} />
            <text x={0} y={9} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="bold" fontFamily="sans-serif">
              {rightTitle}
            </text>
          </g>
        )}

        {/* Children */}
        {children}
      </svg>
    </div>
  );
};

/**
 * 📋 Agricultural Evaluation Scorecard
 */
export const ScorecardBoard: React.FC<{
  x: number;
  y: number;
  scale?: number;
  stampWinner?: boolean;
}> = ({ x, y, scale = 1, stampWinner = true }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Board Shadow */}
      <rect x={-275} y={-235} width={570} height={490} rx={22} fill="rgba(0,0,0,0.18)" />

      {/* Wooden / Cream Clipboard */}
      <rect x={-285} y={-245} width={570} height={490} rx={20} fill="#FEFCE8" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

      {/* Top Metal Clip */}
      <rect x={-90} y={-275} width={180} height={45} rx={8} fill="#94A3B8" stroke="#18181B" strokeWidth={5} />
      <circle cx={0} cy={-252} r={10} fill="#0F172A" />

      {/* Title */}
      <text x={0} y={-190} textAnchor="middle" fontSize={28} fontWeight="900" fill="#0F172A" fontFamily="sans-serif">
        CAN WE PRODUCE AT SCALE?
      </text>
      <line x1={-240} y1={-170} x2={240} y2={-170} stroke="#CBD5E1" strokeWidth={3} />

      {/* Table Columns Header */}
      <text x={-140} y={-135} fontSize={18} fontWeight="bold" fill="#64748B" fontFamily="sans-serif">CRITERIA</text>
      <text x={40} y={-135} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#0284C7" fontFamily="sans-serif">COW 🐮</text>
      <text x={170} y={-135} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#DB2777" fontFamily="sans-serif">PIG 🐷</text>
      <line x1={-240} y1={-120} x2={240} y2={-120} stroke="#E2E8F0" strokeWidth={2} />

      {/* Row 1: Feed Cost */}
      <g transform="translate(0, -80)">
        <text x={-240} y={0} fontSize={20} fontWeight="bold" fill="#1E293B" fontFamily="sans-serif">1. Cheap Grass/Fiber</text>
        <text x={40} y={0} textAnchor="middle" fontSize={24} fill="#16A34A" fontWeight="bold">✅ YES</text>
        <text x={170} y={0} textAnchor="middle" fontSize={24} fill="#DC2626" fontWeight="bold">❌ NO (Grain)</text>
      </g>
      <line x1={-240} y1={-60} x2={240} y2={-60} stroke="#F1F5F9" strokeWidth={2} />

      {/* Row 2: Temperament */}
      <g transform="translate(0, -20)">
        <text x={-240} y={0} fontSize={20} fontWeight="bold" fill="#1E293B" fontFamily="sans-serif">2. Calm Temperament</text>
        <text x={40} y={0} textAnchor="middle" fontSize={24} fill="#16A34A" fontWeight="bold">✅ Docile</text>
        <text x={170} y={0} textAnchor="middle" fontSize={24} fill="#DC2626" fontWeight="bold">❌ Aggressive</text>
      </g>
      <line x1={-240} y1={0} x2={240} y2={0} stroke="#F1F5F9" strokeWidth={2} />

      {/* Row 3: Machine Milking */}
      <g transform="translate(0, 40)">
        <text x={-240} y={0} fontSize={20} fontWeight="bold" fill="#1E293B" fontFamily="sans-serif">3. Continuous Flow</text>
        <text x={40} y={0} textAnchor="middle" fontSize={24} fill="#16A34A" fontWeight="bold">✅ Easy</text>
        <text x={170} y={0} textAnchor="middle" fontSize={24} fill="#DC2626" fontWeight="bold">❌ 30s Bursts</text>
      </g>
      <line x1={-240} y1={60} x2={240} y2={60} stroke="#F1F5F9" strokeWidth={2} />

      {/* Row 4: Surplus Milk */}
      <g transform="translate(0, 100)">
        <text x={-240} y={0} fontSize={20} fontWeight="bold" fill="#1E293B" fontFamily="sans-serif">4. Daily Surplus</text>
        <text x={40} y={0} textAnchor="middle" fontSize={24} fill="#16A34A" fontWeight="bold">✅ 40 Liters</text>
        <text x={170} y={0} textAnchor="middle" fontSize={24} fill="#DC2626" fontWeight="bold">❌ ZERO</text>
      </g>

      {/* Winner Stamp */}
      {stampWinner && (
        <g transform="translate(20, 175) rotate(-8)">
          <rect x={-180} y={-32} width={360} height={64} rx={10} fill="#DC2626" stroke="#991B1B" strokeWidth={5} />
          <text x={0} y={11} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontWeight="900" letterSpacing="2px" fontFamily="sans-serif">
            🏆 COWS WIN!
          </text>
        </g>
      )}
    </g>
  );
};

/**
 * 🧮 Economist Math Blackboard
 */
export const MathBlackboard: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Wooden Easel Legs */}
      <line x1={-180} y1={120} x2={-230} y2={260} stroke="#78350F" strokeWidth={9} strokeLinecap="round" />
      <line x1={180} y1={120} x2={230} y2={260} stroke="#78350F" strokeWidth={9} strokeLinecap="round" />
      <line x1={0} y1={-140} x2={0} y2={260} stroke="#92400E" strokeWidth={8} strokeLinecap="round" />

      {/* Blackboard Frame */}
      <rect x={-280} y={-160} width={560} height={320} rx={14} fill="#1E293B" stroke="#78350F" strokeWidth={14} />

      {/* Chalk Title */}
      <text x={0} y={-115} textAnchor="middle" fill="#38BDF8" fontSize={26} fontWeight="bold" fontFamily="'Comic Sans MS', cursive, sans-serif">
        📊 DAIRY SURPLUS MATH
      </text>
      <line x1={-230} y1={-98} x2={230} y2={-98} stroke="#475569" strokeWidth={2} strokeDasharray="6 6" />

      {/* Cow Math */}
      <text x={-240} y={-60} fill="#4ADE80" fontSize={22} fontWeight="bold" fontFamily="'Comic Sans MS', cursive, sans-serif">
        🐮 COW:
      </text>
      <text x={-140} y={-60} fill="#F8FAFC" fontSize={22} fontFamily="'Comic Sans MS', cursive, sans-serif">
        40L Output - 8L (Calf) =
      </text>
      <text x={180} y={-60} textAnchor="middle" fill="#FDE047" fontSize={26} fontWeight="900" fontFamily="sans-serif">
        +32L PROFIT!
      </text>

      {/* Pig Math */}
      <text x={-240} y={-10} fill="#F472B6" fontSize={22} fontWeight="bold" fontFamily="'Comic Sans MS', cursive, sans-serif">
        🐷 PIG:
      </text>
      <text x={-140} y={-10} fill="#F8FAFC" fontSize={22} fontFamily="'Comic Sans MS', cursive, sans-serif">
        8L Output ÷ 12 Piglets =
      </text>
      <text x={180} y={-10} textAnchor="middle" fill="#EF4444" fontSize={26} fontWeight="900" fontFamily="sans-serif">
        ZERO SURPLUS!
      </text>

      <line x1={-230} y1={25} x2={230} y2={25} stroke="#475569" strokeWidth={2} />

      {/* Economic Verdict */}
      <text x={0} y={65} textAnchor="middle" fill="#F87171" fontSize={24} fontWeight="900" fontFamily="sans-serif">
        SURPLUS = 0.00% ➡️ COMMERCIAL VALUE: $0
      </text>
      <text x={0} y={105} textAnchor="middle" fill="#94A3B8" fontSize={18} fontFamily="sans-serif">
        Cost to feed sow &gt; Revenue from pig milk
      </text>
    </g>
  );
};

/**
 * 🌾 Pig Feeding Trough (Grain & Food Bowl)
 */
export const FeedingTrough: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Trough Shadow */}
      <ellipse cx={0} cy={45} rx={110} ry={14} fill="rgba(0,0,0,0.12)" />
      {/* Wooden Trough Basin */}
      <polygon points="-90,-10 90,-10 75,40 -75,40" fill="#78350F" stroke="#18181B" strokeWidth={DOODLE_WIDTH} strokeLinejoin="round" />
      <ellipse cx={0} cy={-10} rx={90} ry={18} fill="#B45309" stroke="#18181B" strokeWidth={4} />
      {/* Feed / Grain / Apples inside */}
      <ellipse cx={0} cy={-10} rx={80} ry={14} fill="#FDE047" />
      <circle cx={-40} cy={-12} r={9} fill="#EF4444" stroke="#18181B" strokeWidth={2} />
      <circle cx={25} cy={-11} r={8} fill="#22C55E" stroke="#18181B" strokeWidth={2} />
      <circle cx={-10} cy={-8} r={9} fill="#EAB308" stroke="#18181B" strokeWidth={2} />
    </g>
  );
};

/**
 * ⏱️ 4-Panel Daily Milking Routine (Matches ref_pig_snap_180s.jpg)
 */
export const DailyMilkingRoutine: React.FC<{
  activePanel?: 1 | 2 | 3 | 4 | 'all';
}> = ({ activePanel = 'all' }) => {
  const panels = [
    { time: '6:00 AM', sky: '#FDBA74', label: 'DAWN MILKING', buckets: 1, isNight: false },
    { time: '12:00 PM', sky: '#7DD3FC', label: 'MIDDAY GRAZE', buckets: 2, isNight: false },
    { time: '6:00 PM', sky: '#F97316', label: 'EVENING REFILL', buckets: 3, isNight: false },
    { time: '10:00 PM', sky: '#1E1B4B', label: 'NIGHT REST', buckets: 4, isNight: true },
  ];

  return (
    <g>
      {panels.map((p, idx) => {
        const xOffset = idx * 480;
        const isDimmed = activePanel !== 'all' && activePanel !== idx + 1;

        return (
          <g key={idx} transform={`translate(${xOffset}, 0)`} opacity={isDimmed ? 0.4 : 1}>
            {/* Background Sky */}
            <rect x={0} y={0} width={480} height={700} fill={p.sky} />

            {/* Barn Floor */}
            <rect x={0} y={700} width={480} height={380} fill="#B45309" />
            <line x1={0} y1={700} x2={480} y2={700} stroke="#18181B" strokeWidth={5} />

            {/* Vertical Split Line */}
            {idx > 0 && <line x1={0} y1={0} x2={0} y2={1080} stroke="#18181B" strokeWidth={5} />}

            {/* Barn Window */}
            <rect x={260} y={160} width={160} height={180} rx={6} fill="#F8FAFC" stroke="#18181B" strokeWidth={4} />
            <line x1={340} y1={160} x2={340} y2={340} stroke="#18181B" strokeWidth={3} />
            <line x1={260} y1={250} x2={420} y2={250} stroke="#18181B" strokeWidth={3} />

            {/* Wall Clock */}
            <g transform="translate(100, 180)">
              <circle cx={0} cy={0} r={40} fill="#FFFFFF" stroke="#18181B" strokeWidth={4} />
              <line x1={0} y1={0} x2={0} y2={-25} stroke="#18181B" strokeWidth={3} strokeLinecap="round" />
              <line x1={0} y1={0} x2={16} y2={8} stroke="#18181B" strokeWidth={3} strokeLinecap="round" />
              <circle cx={0} cy={0} r={4} fill="#18181B" />
              <text x={0} y={55} textAnchor="middle" fill={p.isNight ? '#F8FAFC' : '#18181B'} fontSize={16} fontWeight="bold" fontFamily="sans-serif">
                {p.time}
              </text>
            </g>

            {/* Cow standing calmly */}
            <DoodleCow x={220} y={640} scale={0.65} mood={p.isNight ? 'calm' : 'happy'} />

            {/* Farmer Stickman Milking */}
            <DoodleStickman x={350} y={620} scale={0.55} pose="sipping_drink" shirtColor="#0284C7" />

            {/* Milking Buckets multiplying */}
            {Array.from({ length: p.buckets }).map((_, bi) => (
              <MilkingBucket key={bi} x={120 + bi * 45} y={750} scale={0.7} fillLevel={0.9} />
            ))}

            {/* Night Extra: Big Milk Canister */}
            {p.isNight && (
              <MilkCanister x={80} y={720} scale={0.6} isOverflowing={true} />
            )}

            {/* Panel Pill */}
            <StoryBadge text={p.label} x={240} y={70} fontSize={20} bgColor="#0F172A" textColor="#F8FAFC" />
          </g>
        );
      })}
    </g>
  );
};


/**
 * 🐐 Realistic Hand-Drawn Dairy Goat
 * Anatomically accurate: slender caprine torso, graceful neck, curved ribbed horns,
 * expressive horizontal-pupil eye, goatee beard, cloven hooves, and 2-teat udder.
 */
export const DoodleGoat: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const chew = Math.sin(frame * 0.25) * 2.5;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground Shadow */}
      <ellipse cx={0} cy={112} rx={105} ry={14} fill="rgba(0,0,0,0.12)" />

      {/* Perky Goat Tail */}
      <path
        d="M 68 -8 Q 88 -28 84 -38 Q 76 -32 68 2 Z"
        fill="#F8FAFC"
        stroke="#18181B"
        strokeWidth={3.5}
        strokeLinejoin="round"
      />

      {/* Far Hind Leg */}
      <g opacity={0.85}>
        <path d="M 40 25 L 56 60 L 46 102 L 60 102 L 66 62 L 50 25 Z" fill="#CBD5E1" stroke="#18181B" strokeWidth={3.5} />
        <polygon points="44,102 62,102 60,110 42,110" fill="#18181B" />
      </g>

      {/* Far Foreleg */}
      <g opacity={0.85}>
        <path d="M -48 25 L -52 65 L -48 102 L -36 102 L -38 65 L -36 25 Z" fill="#CBD5E1" stroke="#18181B" strokeWidth={3.5} />
        <polygon points="-50,102 -34,102 -36,110 -52,110" fill="#18181B" />
      </g>

      {/* Caprine Udder with 2 clean teats */}
      <g transform="translate(18, 42)">
        <ellipse cx={0} cy={0} rx={16} ry={13} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />
        <path d="M -8 8 C -8 18 -3 22 -3 22 C -3 22 0 18 0 8" fill="#FDA4AF" stroke="#18181B" strokeWidth={2.5} />
        <path d="M 3 8 C 3 18 8 22 8 22 C 8 22 11 18 11 8" fill="#FDA4AF" stroke="#18181B" strokeWidth={2.5} />
      </g>

      {/* Near Hind Leg (with realistic hock angle) */}
      <g>
        <path d="M 52 20 L 70 58 L 58 104 L 74 104 L 80 58 L 64 20 Z" fill="#F8FAFC" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        <polygon points="56,104 76,104 74,112 54,112" fill="#18181B" />
      </g>

      {/* Anatomical Caprine Torso */}
      <path
        d="M -65 15 C -72 -20 -40 -35 15 -35 C 55 -35 75 -18 78 12 C 80 42 60 52 15 52 C -35 52 -58 40 -65 15 Z"
        fill="#F8FAFC"
        stroke="#18181B"
        strokeWidth={DOODLE_WIDTH}
        strokeLinejoin="round"
      />

      {/* Near Foreleg (slender caprine front limb) */}
      <g>
        <path d="M -36 22 L -38 65 L -34 104 L -20 104 L -24 65 L -22 22 Z" fill="#F8FAFC" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        <polygon points="-36,104 -18,104 -20,112 -38,112" fill="#18181B" />
      </g>

      {/* Upright Arching Neck */}
      <path
        d="M -48 10 C -58 -25 -52 -60 -72 -80 C -85 -55 -72 -15 -62 20 Z"
        fill="#F8FAFC"
        stroke="#18181B"
        strokeWidth={DOODLE_WIDTH}
        strokeLinejoin="round"
      />

      {/* Goat Head & Horns with chewing animation */}
      <g transform={`translate(-76, -75) rotate(${chew})`}>
        {/* Ribbed Backward Scythe Horns */}
        <g>
          {/* Far Horn */}
          <path
            d="M 4 -12 C 14 -40 38 -55 52 -52 C 40 -45 22 -35 14 -8 Z"
            fill="#64748B"
            stroke="#18181B"
            strokeWidth={3}
          />
          {/* Near Horn */}
          <path
            d="M -6 -12 C 6 -46 32 -62 48 -58 C 34 -50 14 -38 4 -8 Z"
            fill="#94A3B8"
            stroke="#18181B"
            strokeWidth={3.5}
          />
          {/* Horn Ridge Grooves */}
          <line x1={8} y1={-25} x2={16} y2={-20} stroke="#475569" strokeWidth={2.5} />
          <line x1={18} y1={-36} x2={26} y2={-32} stroke="#475569" strokeWidth={2.5} />
          <line x1={28} y1={-46} x2={36} y2={-43} stroke="#475569" strokeWidth={2.5} />
        </g>

        {/* Caprine Drooping/Alert Ears */}
        <ellipse
          cx={18}
          cy={-4}
          rx={18}
          ry={7}
          fill="#F8FAFC"
          stroke="#18181B"
          strokeWidth={3}
          transform="rotate(20 18 -4)"
        />
        <ellipse cx={18} cy={-4} rx={12} ry={4} fill="#FDA4AF" transform="rotate(20 18 -4)" />

        {/* Wedge-Shaped Head */}
        <polygon
          points="-28,18 10,-12 16,8 -12,28"
          fill="#F8FAFC"
          stroke="#18181B"
          strokeWidth={DOODLE_WIDTH}
          strokeLinejoin="round"
        />

        {/* Sweet Almond Eye with Horizontal Pupil */}
        <ellipse cx={-2} cy={2} rx={6} ry={4.5} fill="#FEF08A" stroke="#18181B" strokeWidth={2.5} />
        <ellipse cx={-2} cy={2} rx={4} ry={1.8} fill="#18181B" />

        {/* Pink Muzzle with Nostril */}
        <ellipse cx={-26} cy={22} rx={7} ry={6} fill="#FDA4AF" stroke="#18181B" strokeWidth={2.5} />
        <circle cx={-26} cy={20} r={2} fill="#881337" />

        {/* Classic Goatee Beard */}
        <polygon
          points="-24,28 -32,46 -20,44 -16,30"
          fill="#E2E8F0"
          stroke="#18181B"
          strokeWidth={2.5}
          strokeLinejoin="round"
        />

        {/* Chewing Hay Stalk */}
        <path d="M -26 26 Q -45 32 -55 24" stroke="#84CC16" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

/**
 * 🐑 Realistic Hand-Drawn Fluffy Sheep
 * Anatomically authentic ovine silhouette: sculpted layered wool fleece,
 * classic dark sheep face, droopy woolly ears, white fleece crown, and cloven trotters.
 */
export const DoodleSheep: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const chew = Math.sin(frame * 0.2) * 2;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Ground Shadow */}
      <ellipse cx={0} cy={105} rx={95} ry={14} fill="rgba(0,0,0,0.12)" />

      {/* Far Trotters */}
      <g opacity={0.85}>
        <rect x={32} y={35} width={13} height={66} rx={4} fill="#0F172A" stroke="#18181B" strokeWidth={3} />
        <polygon points="30,98 47,98 45,106 28,106" fill="#18181B" />
        <rect x={-42} y={35} width={13} height={66} rx={4} fill="#0F172A" stroke="#18181B" strokeWidth={3} />
        <polygon points="-44,98 -27,98 -29,106 -46,106" fill="#18181B" />
      </g>

      {/* Fluffy Wool Dock Tail */}
      <circle cx={72} cy={8} r={16} fill="#F1F5F9" stroke="#18181B" strokeWidth={3.5} />

      {/* Near Trotters */}
      <g>
        <rect x={48} y={32} width={14} height={70} rx={4} fill="#1E293B" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        <polygon points="46,100 64,100 62,108 44,108" fill="#18181B" />
        <rect x={-26} y={32} width={14} height={70} rx={4} fill="#1E293B" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        <polygon points="-28,100 -10,100 -12,108 -30,108" fill="#18181B" />
      </g>

      {/* Voluminous Textured Wool Fleece Body */}
      {/* Base Fleece Shadow */}
      <ellipse cx={10} cy={16} rx={74} ry={48} fill="#E2E8F0" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

      {/* Layered Cloud Puffs for Authentic Fluffiness */}
      <g fill="#FFFFFF" stroke="#18181B" strokeWidth={3.5}>
        <circle cx={-52} cy={-8} r={28} />
        <circle cx={-28} cy={-28} r={32} />
        <circle cx={10} cy={-32} r={34} />
        <circle cx={48} cy={-24} r={30} />
        <circle cx={68} cy={-2} r={26} />
        <circle cx={56} cy={22} r={28} />
        <circle cx={18} cy={30} r={30} />
        <circle cx={-22} cy={26} r={28} />
        <circle cx={-48} cy={16} r={26} />
      </g>
      {/* Inner Soft Wool Highlights */}
      <ellipse cx={8} cy={-4} rx={54} ry={36} fill="#FFFFFF" />

      {/* Realistic Dark Sheep Head & Face */}
      <g transform={`translate(-72, -18) rotate(${chew})`}>
        {/* Soft Drooping Sheep Ears */}
        <ellipse
          cx={14}
          cy={-8}
          rx={16}
          ry={7}
          fill="#1E293B"
          stroke="#18181B"
          strokeWidth={3}
          transform="rotate(25 14 -8)"
        />
        <ellipse
          cx={-14}
          cy={-14}
          rx={16}
          ry={7}
          fill="#0F172A"
          stroke="#18181B"
          strokeWidth={3}
          transform="rotate(-25 -14 -14)"
        />

        {/* Roman-Nose Dark Ovine Head */}
        <path
          d="M -16 -18 C 8 -22 22 -6 20 12 C 18 28 -4 34 -20 28 C -32 22 -34 6 -30 -6 C -28 -14 -22 -18 -16 -18 Z"
          fill="#1E293B"
          stroke="#18181B"
          strokeWidth={DOODLE_WIDTH}
          strokeLinejoin="round"
        />

        {/* Gentle Expressive Sheep Eye */}
        <ellipse cx={-4} cy={4} rx={6.5} ry={5.5} fill="#FFFFFF" stroke="#18181B" strokeWidth={2} />
        <circle cx={-3} cy={4} r={3.5} fill="#18181B" />
        <circle cx={-4} cy={2.5} r={1.2} fill="#FFFFFF" />

        {/* Cute Pink Nostril */}
        <ellipse cx={-24} cy={18} rx={4} ry={3} fill="#FDA4AF" />

        {/* Fluffy Woolly Forehead Cap */}
        <g fill="#FFFFFF" stroke="#18181B" strokeWidth={2.5}>
          <circle cx={0} cy={-22} r={11} />
          <circle cx={10} cy={-18} r={9} />
          <circle cx={-8} cy={-18} r={9} />
        </g>
      </g>
    </g>
  );
};

/**
 * 🐫 Realistic Hand-Drawn Dromedary Camel
 * Anatomically authentic desert camel: majestic tall curved hump with woolly tufts,
 * graceful S-curved muscular neck with ventral hair fringe, noble camel head with
 * Roman muzzle and split lip, articulated tall legs with broad desert sand pads.
 */
export const DoodleCamel: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const chew = Math.sin(frame * 0.18) * 2;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Expansive Ground Shadow */}
      <ellipse cx={0} cy={175} rx={145} ry={20} fill="rgba(0,0,0,0.12)" />

      {/* Far Hind Leg */}
      <g opacity={0.85}>
        <path d="M 60 55 L 82 105 L 68 160 L 92 160 L 98 105 L 78 55 Z" fill="#B45309" stroke="#18181B" strokeWidth={3.5} />
        <ellipse cx={80} cy={165} rx={16} ry={7} fill="#78350F" stroke="#18181B" strokeWidth={3} />
      </g>

      {/* Far Foreleg */}
      <g opacity={0.85}>
        <path d="M -85 55 L -92 105 L -85 160 L -62 160 L -72 105 L -68 55 Z" fill="#B45309" stroke="#18181B" strokeWidth={3.5} />
        <ellipse cx={-74} cy={165} rx={16} ry={7} fill="#78350F" stroke="#18181B" strokeWidth={3} />
      </g>

      {/* Slender Tufted Tail */}
      <path d="M 125 35 Q 148 70 142 110" stroke="#B45309" strokeWidth={6} fill="none" strokeLinecap="round" />
      <ellipse cx={142} cy={118} rx={10} ry={16} fill="#78350F" stroke="#18181B" strokeWidth={3} transform="rotate(15 142 118)" />

      {/* Near Hind Leg (Authentic camel hock joint & broad foot cushion) */}
      <g>
        <path d="M 75 50 L 102 105 L 88 162 L 114 162 L 122 105 L 98 50 Z" fill="#D97706" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        {/* Desert Sand Cushion Pad */}
        <ellipse cx={101} cy={168} rx={18} ry={8} fill="#B45309" stroke="#18181B" strokeWidth={3.5} />
        <line x1={101} y1={162} x2={101} y2={173} stroke="#78350F" strokeWidth={2.5} />
      </g>

      {/* Anatomical Camel Barrel Body with Tall Curved Hump */}
      <path
        d="M -115 45 C -115 -10 -75 -22 -45 -28 C -15 -85 35 -115 72 -75 C 92 -50 115 -20 132 30 C 132 85 70 98 -10 98 C -75 98 -115 80 -115 45 Z"
        fill="#D97706"
        stroke="#18181B"
        strokeWidth={DOODLE_WIDTH}
        strokeLinejoin="round"
      />

      {/* Woolly Hair Tufts on the Hump */}
      <path
        d="M -10 -80 Q 5 -105 25 -95 Q 45 -110 65 -75"
        stroke="#B45309"
        strokeWidth={7}
        fill="none"
        strokeLinecap="round"
      />

      {/* Sternal Callosity (Chest resting pad) */}
      <path d="M -110 55 C -110 75 -90 85 -70 85" stroke="#92400E" strokeWidth={7} fill="none" strokeLinecap="round" />

      {/* Near Foreleg (Slender, tall front limb with knee and padded foot) */}
      <g>
        <path d="M -70 50 L -76 105 L -68 162 L -44 162 L -54 105 L -50 50 Z" fill="#D97706" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />
        {/* Desert Sand Cushion Pad */}
        <ellipse cx={-56} cy={168} rx={18} ry={8} fill="#B45309" stroke="#18181B" strokeWidth={3.5} />
        <line x1={-56} y1={162} x2={-56} y2={173} stroke="#78350F" strokeWidth={2.5} />
      </g>

      {/* Graceful Muscular S-Curved Neck */}
      <path
        d="M -105 35 C -145 20 -165 -35 -148 -105 C -138 -135 -118 -155 -102 -168 C -92 -150 -105 -115 -112 -80 C -120 -35 -90 10 -75 35 Z"
        fill="#D97706"
        stroke="#18181B"
        strokeWidth={DOODLE_WIDTH}
        strokeLinejoin="round"
      />

      {/* Ventral Neck Hair Fringe */}
      <path
        d="M -135 -50 Q -148 -70 -140 -95 Q -145 -115 -130 -135"
        stroke="#B45309"
        strokeWidth={5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Noble Camel Head with Chewing Jaw */}
      <g transform={`translate(-104, -172) rotate(${chew})`}>
        {/* Small Furry Rounded Ear */}
        <ellipse cx={12} cy={-12} rx={10} ry={7} fill="#B45309" stroke="#18181B" strokeWidth={3} transform="rotate(35 12 -12)" />

        {/* Aristocratic Head Silhouette with Roman Snout */}
        <path
          d="M -28 14 C -36 12 -38 0 -30 -6 C -20 -14 6 -18 18 -6 C 24 6 16 18 4 18 C -12 18 -20 16 -28 14 Z"
          fill="#D97706"
          stroke="#18181B"
          strokeWidth={DOODLE_WIDTH}
          strokeLinejoin="round"
        />

        {/* Soft Cream Muzzle with Split Prehensile Upper Lip */}
        <ellipse cx={-26} cy={8} rx={14} ry={10} fill="#FEF3C7" stroke="#18181B" strokeWidth={3} />
        {/* Nostril Slit */}
        <line x1={-30} y1={5} x2={-24} y2={8} stroke="#78350F" strokeWidth={3} strokeLinecap="round" />
        {/* Split Lip */}
        <line x1={-32} y1={12} x2={-22} y2={12} stroke="#78350F" strokeWidth={2.5} strokeLinecap="round" />

        {/* Large Dark Almond Eye with Arched Brow */}
        <ellipse cx={-2} cy={-2} rx={7} ry={5.5} fill="#18181B" />
        <circle cx={-3} cy={-3} r={2} fill="#FFFFFF" />
        {/* Curved Brow / Lashes */}
        <path d="M -8 -8 Q -2 -14 5 -8" stroke="#78350F" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>
    </g>
  );
};

/**
 * 📊 Mammalian Nutrition Comparison Card
 */
export const MammalianNutritionCard: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const barAnim = Math.min(1, frame / 20);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Card Background */}
      <rect x={-310} y={-175} width={620} height={355} rx={26} fill="#0F172A" stroke="#FFFFFF" strokeWidth={5} />

      {/* Header with Visual Icon */}
      <text
        x={0}
        y={-125}
        textAnchor="middle"
        fill="#38BDF8"
        fontSize={24}
        fontWeight="900"
        fontFamily="'Comic Sans MS', -apple-system, BlinkMacSystemFont, sans-serif"
      >
        🥛 PIG MILK NUTRITION PROFILE
      </text>

      {/* Row 1: FAT */}
      <g transform="translate(-260, -70)">
        <text x={0} y={0} fill="#FFFFFF" fontSize={19} fontWeight="bold" fontFamily="'Comic Sans MS', sans-serif">🧈 BUTTERFAT</text>
        <text x={420} y={0} fill="#F43F5E" fontSize={21} fontWeight="900" fontFamily="'Comic Sans MS', sans-serif">8.5% (Rich!)</text>
        <rect x={0} y={10} width={520} height={16} rx={8} fill="#334155" />
        <rect x={0} y={10} width={520 * 0.85 * barAnim} height={16} rx={8} fill="#F43F5E" />
      </g>

      {/* Row 2: PROTEIN */}
      <g transform="translate(-260, -5)">
        <text x={0} y={0} fill="#FFFFFF" fontSize={19} fontWeight="bold" fontFamily="'Comic Sans MS', sans-serif">🥩 PROTEIN</text>
        <text x={420} y={0} fill="#10B981" fontSize={21} fontWeight="900" fontFamily="'Comic Sans MS', sans-serif">5.5% (High!)</text>
        <rect x={0} y={10} width={520} height={16} rx={8} fill="#334155" />
        <rect x={0} y={10} width={520 * 0.65 * barAnim} height={16} rx={8} fill="#10B981" />
      </g>

      {/* Row 3: SUGAR & LACTOSE */}
      <g transform="translate(-260, 60)">
        <text x={0} y={0} fill="#FFFFFF" fontSize={19} fontWeight="bold" fontFamily="'Comic Sans MS', sans-serif">⚡ NATURAL SUGARS</text>
        <text x={420} y={0} fill="#FACC15" fontSize={21} fontWeight="900" fontFamily="'Comic Sans MS', sans-serif">5.0%</text>
        <rect x={0} y={10} width={520} height={16} rx={8} fill="#334155" />
        <rect x={0} y={10} width={520 * 0.55 * barAnim} height={16} rx={8} fill="#FACC15" />
      </g>

      {/* Auto-Sized Zero-Overflow Verdict Pill */}
      <StoryBadge text="✔ VERDICT: 100% EDIBLE & NUTRITIOUS" x={0} y={135} fontSize={18} bgColor="#059669" />
    </g>
  );
};

/**
 * ⏱️ 15-Second Letdown Countdown Timer
 */
export const CountdownTimer15s: React.FC<{
  x: number;
  y: number;
  scale?: number;
  initialSeconds?: number;
}> = ({ x, y, scale = 1, initialSeconds = 15 }) => {
  const frame = useCurrentFrame();
  const elapsedSeconds = frame / 30;
  const remaining = Math.max(0, initialSeconds - elapsedSeconds);
  const isUrgent = remaining < 5;
  const pulse = isUrgent ? 1 + Math.sin(frame * 0.4) * 0.06 : 1;

  const formattedTime = `00:${String(Math.ceil(remaining)).padStart(2, '0')}`;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale * pulse})`}>
      {/* Dial background */}
      <circle cx={0} cy={0} r={95} fill="#1E293B" stroke={isUrgent ? '#EF4444' : '#38BDF8'} strokeWidth={8} />
      <circle cx={0} cy={0} r={80} fill="#0F172A" />

      {/* Sweeping progress arc */}
      <path
        d={`M 0 -80 A 80 80 0 ${remaining < 7.5 ? 0 : 1} 1 ${80 * Math.sin((1 - remaining / 15) * 2 * Math.PI)} ${-80 * Math.cos((1 - remaining / 15) * 2 * Math.PI)}`}
        fill="none"
        stroke={isUrgent ? '#EF4444' : '#38BDF8'}
        strokeWidth={10}
        strokeLinecap="round"
      />

      {/* Digital readout */}
      <text x={0} y={12} textAnchor="middle" fill={isUrgent ? '#F87171' : '#FFFFFF'} fontSize={44} fontWeight="900" fontFamily="monospace">
        {formattedTime}
      </text>
      <text x={0} y={40} textAnchor="middle" fill="#94A3B8" fontSize={14} fontWeight="bold" letterSpacing="1px">
        LETDOWN WINDOW
      </text>

      {/* Warning banner below */}
      {isUrgent && (
        <g transform="translate(0, 125)">
          <rect x={-110} y={-16} width={220} height={32} rx={16} fill="#DC2626" />
          <text x={0} y={6} textAnchor="middle" fill="#FFFFFF" fontSize={16} fontWeight="900">
            RAPID BURST CLOSING!
          </text>
        </g>
      )}
    </g>
  );
};

/**
 * 📈 Oxytocin Surge Infographic Card
 */
export const OxytocinSurgeInfographic: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const waveProgress = Math.min(1, frame / 35);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <rect x={-240} y={-140} width={480} height={280} rx={20} fill="#0F172A" stroke="#EC4899" strokeWidth={5} />

      {/* Header */}
      <text x={0} y={-95} textAnchor="middle" fill="#F472B6" fontSize={24} fontWeight="900">
        HORMONE TRIGGER: OXYTOCIN SURGE
      </text>
      <text x={0} y={-70} textAnchor="middle" fill="#94A3B8" fontSize={15}>
        Stimulated ONLY by hungry suckling piglets
      </text>

      {/* Grid Lines */}
      <line x1={-200} y1={50} x2={200} y2={50} stroke="#334155" strokeWidth={2} />
      <line x1={-200} y1={-10} x2={200} y2={-10} stroke="#334155" strokeWidth={1} strokeDasharray="4 4" />
      <line x1={-200} y1={-50} x2={200} y2={-50} stroke="#334155" strokeWidth={1} strokeDasharray="4 4" />

      {/* Surge Curve */}
      <path
        d={`M -200 50 Q -150 50 -120 0 Q -90 -60 -50 -60 Q -10 -60 20 20 L 120 50 L 200 50`}
        fill="none"
        stroke="#EC4899"
        strokeWidth={6}
        strokeLinecap="round"
        strokeDasharray="500"
        strokeDashoffset={500 * (1 - waveProgress)}
      />

      {/* Labels on Curve */}
      <g transform="translate(-50, -80)">
        <rect x={-65} y={-14} width={130} height={26} rx={13} fill="#BE185D" />
        <text x={0} y={4} textAnchor="middle" fill="#FFFFFF" fontSize={13} fontWeight="bold">
          15s INTENSE PEAK
        </text>
      </g>

      {/* Result Status */}
      <g transform="translate(0, 95)">
        <rect x={-180} y={-16} width={360} height={34} rx={17} fill="#1E293B" stroke="#EC4899" strokeWidth={2} />
        <text x={0} y={6} textAnchor="middle" fill="#FBCFE8" fontSize={15} fontWeight="bold">
          NO SUCKLING = 0 OXYTOCIN = 0 MILK
        </text>
      </g>
    </g>
  );
};

/**
 * 🥛 Cow Udder vs Sow Mammary Cistern Comparison Card
 */
export const CisternComparisonCard: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Split Card Background */}
      <rect x={-450} y={-230} width={900} height={460} rx={24} fill="#0F172A" stroke="#FFFFFF" strokeWidth={5} />

      {/* Center Divider */}
      <line x1={0} y1={-210} x2={0} y2={210} stroke="#334155" strokeWidth={4} strokeDasharray="8 8" />

      {/* LEFT: COW */}
      <g transform="translate(-225, 0)">
        <text x={0} y={-180} textAnchor="middle" fill="#38BDF8" fontSize={26} fontWeight="900">
          COW: GLAND CISTERN
        </text>
        {/* Cistern Reservoir Graphic */}
        <ellipse cx={0} cy={-60} rx={75} ry={50} fill="#BAE6FD" stroke="#0284C7" strokeWidth={4} />
        <text x={0} y={-55} textAnchor="middle" fill="#0369A1" fontSize={16} fontWeight="bold">
          STORAGE CISTERN
        </text>
        <text x={0} y={-35} textAnchor="middle" fill="#0369A1" fontSize={13}>
          (Holds Liters of Milk)
        </text>
        {/* 4 Teats */}
        <rect x={-45} y={-10} width={16} height={35} rx={6} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />
        <rect x={-15} y={-5} width={16} height={40} rx={6} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />
        <rect x={15} y={-5} width={16} height={40} rx={6} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />
        <rect x={45} y={-10} width={16} height={35} rx={6} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />
        {/* Bullets */}
        <g transform="translate(0, 80)">
          <rect x={-170} y={0} width={340} height={30} rx={15} fill="#0284C7" />
          <text x={0} y={20} textAnchor="middle" fill="#FFFFFF" fontSize={15} fontWeight="bold">
            ✔ 4 Large Accessible Teats
          </text>
          <rect x={-170} y={40} width={340} height={30} rx={15} fill="#0369A1" />
          <text x={0} y={60} textAnchor="middle" fill="#FFFFFF" fontSize={15} fontWeight="bold">
            ✔ Milking Machine Compatible
          </text>
        </g>
      </g>

      {/* RIGHT: PIG */}
      <g transform="translate(225, 0)">
        <text x={0} y={-180} textAnchor="middle" fill="#F472B6" fontSize={26} fontWeight="900">
          SOW: NO CISTERN
        </text>
        {/* 14 Tiny Glands Graphic */}
        <g transform="translate(-130, -50)">
          {Array.from({ length: 7 }).map((_, i) => (
            <g key={i} transform={`translate(${i * 42}, 0)`}>
              <circle cx={0} cy={0} r={10} fill="#F472B6" stroke="#9D174D" strokeWidth={3} />
              <rect x={-3} y={10} width={6} height={12} rx={2} fill="#EC4899" stroke="#18181B" strokeWidth={2} />
            </g>
          ))}
        </g>
        <text x={0} y={0} textAnchor="middle" fill="#FDA4AF" fontSize={16} fontWeight="bold">
          14 Micro-Glands (Direct to ducts)
        </text>
        <text x={0} y={22} textAnchor="middle" fill="#F472B6" fontSize={13}>
          Zero storage volume reservoir
        </text>
        {/* Bullets */}
        <g transform="translate(0, 80)">
          <rect x={-170} y={0} width={340} height={30} rx={15} fill="#BE185D" />
          <text x={0} y={20} textAnchor="middle" fill="#FFFFFF" fontSize={15} fontWeight="bold">
            ✖ No Storage Cistern
          </text>
          <rect x={-170} y={40} width={340} height={30} rx={15} fill="#9D174D" />
          <text x={0} y={60} textAnchor="middle" fill="#FFFFFF" fontSize={15} fontWeight="bold">
            ✖ Impossible for Standard Milkers
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 🧪 Milk Chemistry Lab Environment
 */
export const ChemistryLabEnv: React.FC<{
  children: React.ReactNode;
  wallColor?: string;
  benchColor?: string;
  showBlackboard?: boolean;
}> = ({
  children,
  wallColor = '#0F172A',
  benchColor = '#334155',
  showBlackboard = true,
}) => {
  const frame = useCurrentFrame();
  const bubbleY1 = (frame * 2.5) % 40;
  const bubbleY2 = ((frame + 12) * 2.2) % 40;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Lab Back Wall */}
        <rect x={0} y={0} width={1920} height={720} fill={wallColor} />

        {/* Subtle Ceramic Wall Grid */}
        <g stroke="#1E293B" strokeWidth={2} opacity={0.6}>
          {Array.from({ length: 16 }).map((_, i) => (
            <line key={`v-${i}`} x1={i * 120} y1={0} x2={i * 120} y2={720} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`h-${i}`} x1={0} y1={i * 90} x2={1920} y2={i * 90} />
          ))}
        </g>

        {/* Lab Blackboard */}
        {showBlackboard && (
          <g transform="translate(960, 220)">
            {/* Wooden Frame */}
            <rect x={-420} y={-140} width={840} height={280} rx={12} fill="#78350F" stroke="#451A03" strokeWidth={6} />
            {/* Slate Board */}
            <rect x={-405} y={-125} width={810} height={250} rx={8} fill="#064E3B" stroke="#047857" strokeWidth={3} />
            {/* Chalk Title */}
            <text x={0} y={-75} textAnchor="middle" fill="#A7F3D0" fontSize={28} fontWeight="900" fontFamily="monospace">
              MILK BIOCHEMISTRY: LIPIDS & PROTEINS
            </text>
            <line x1={-360} y1={-55} x2={360} y2={-55} stroke="#34D399" strokeWidth={2} strokeDasharray="6 6" />

            {/* Formulas & Notes */}
            <text x={-360} y={-15} fill="#FFFFFF" fontSize={22} fontWeight="bold" fontFamily="monospace">
              FAT GLOBULES: Pig (8.5%) vs Cow (3.8%)
            </text>
            <text x={-360} y={25} fill="#FDE047" fontSize={22} fontWeight="bold" fontFamily="monospace">
              CASEIN MICELLES: Unstable Curd Formation
            </text>
            <text x={-360} y={65} fill="#F43F5E" fontSize={22} fontWeight="bold" fontFamily="monospace">
              WATER RATIO: 81% (High solid density)
            </text>
            <text x={-360} y={100} fill="#94A3B8" fontSize={18} fontFamily="monospace">
              STATUS: RENNET SENSITIVITY = POOR COAGULATION
            </text>
          </g>
        )}

        {/* Lab Glassware Shelves (Left) */}
        <g transform="translate(180, 280)">
          {/* Wooden Shelf */}
          <rect x={-120} y={80} width={240} height={16} rx={4} fill="#475569" stroke="#18181B" strokeWidth={3} />
          {/* Flask with Pink Liquid */}
          <path d="M -70 80 L -50 20 L -40 20 L -40 -10 L -60 -10 L -60 20 L -50 20 Z" fill="#F43F5E" stroke="#18181B" strokeWidth={3} />
          <ellipse cx={-50} cy={60} rx={16} ry={6} fill="#FDA4AF" />
          <circle cx={-52} cy={50 - bubbleY1} r={3} fill="#FFFFFF" opacity={0.8} />

          {/* Test Tube Rack */}
          <rect x={0} y={35} width={90} height={45} rx={4} fill="#1E293B" stroke="#18181B" strokeWidth={3} />
          <rect x={15} y={0} width={12} height={60} rx={6} fill="#10B981" stroke="#18181B" strokeWidth={2} />
          <rect x={35} y={-10} width={12} height={70} rx={6} fill="#F59E0B" stroke="#18181B" strokeWidth={2} />
          <rect x={55} y={-5} width={12} height={65} rx={6} fill="#38BDF8" stroke="#18181B" strokeWidth={2} />
        </g>

        {/* Lab Glassware Shelves (Right) */}
        <g transform="translate(1740, 280)">
          <rect x={-120} y={80} width={240} height={16} rx={4} fill="#475569" stroke="#18181B" strokeWidth={3} />
          {/* Beaker with Blue Liquid */}
          <rect x={-60} y={15} width={50} height={65} rx={4} fill="#38BDF8" stroke="#18181B" strokeWidth={3} />
          <ellipse cx={-35} cy={20} rx={22} ry={5} fill="#BAE6FD" />
          <circle cx={-35} cy={55 - bubbleY2} r={3.5} fill="#FFFFFF" opacity={0.8} />

          {/* Graduated Cylinder */}
          <rect x={15} y={-25} width={22} height={105} rx={4} fill="#A78BFA" stroke="#18181B" strokeWidth={2.5} />
          {Array.from({ length: 5 }).map((_, i) => (
            <line key={i} x1={15} y1={-15 + i * 18} x2={25} y2={-15 + i * 18} stroke="#18181B" strokeWidth={2} />
          ))}
        </g>

        {/* Lab Countertop */}
        <rect x={0} y={720} width={1920} height={360} fill={benchColor} />
        <line x1={0} y1={720} x2={1920} y2={720} stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

        {/* Front Counter Lip / Edge */}
        <rect x={0} y={720} width={1920} height={20} fill="#64748B" />
        <line x1={0} y1={740} x2={1920} y2={740} stroke="#18181B" strokeWidth={3} />

        {/* Lab Cabinets Below */}
        <g stroke="#1E293B" strokeWidth={4}>
          <line x1={480} y1={740} x2={480} y2={1080} />
          <line x1={960} y1={740} x2={960} y2={1080} />
          <line x1={1440} y1={740} x2={1440} y2={1080} />
          {/* Handles */}
          <rect x={440} y={850} width={30} height={8} rx={4} fill="#94A3B8" />
          <rect x={490} y={850} width={30} height={8} rx={4} fill="#94A3B8" />
          <rect x={920} y={850} width={30} height={8} rx={4} fill="#94A3B8" />
          <rect x={970} y={850} width={30} height={8} rx={4} fill="#94A3B8" />
          <rect x={1400} y={850} width={30} height={8} rx={4} fill="#94A3B8" />
          <rect x={1450} y={850} width={30} height={8} rx={4} fill="#94A3B8" />
        </g>

        {children}
      </svg>
    </div>
  );
};

/**
 * 🏭 Industrial Dairy Machine / Factory Environment
 */
export const IndustrialDairyEnv: React.FC<{
  children: React.ReactNode;
  showConveyor?: boolean;
}> = ({ children, showConveyor = true }) => {
  const frame = useCurrentFrame();
  const beltOffset = (frame * 4) % 120;

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Factory Back Wall */}
        <rect x={0} y={0} width={1920} height={680} fill="#1E293B" />

        {/* Steel Ventilation Ducts & Overhead Pipes */}
        <rect x={0} y={40} width={1920} height={55} fill="#475569" stroke="#0F172A" strokeWidth={4} />
        {Array.from({ length: 16 }).map((_, i) => (
          <line key={i} x1={i * 125} y1={40} x2={i * 125} y2={95} stroke="#334155" strokeWidth={3} />
        ))}
        {/* Smaller pipes */}
        <line x1={0} y1={120} x2={1920} y2={120} stroke="#94A3B8" strokeWidth={14} />
        <line x1={0} y1={145} x2={1920} y2={145} stroke="#CBD5E1" strokeWidth={10} />

        {/* Giant Stainless Steel Dairy Silos (Background Left & Right) */}
        <g transform="translate(240, 360)">
          {/* Silo 1 */}
          <rect x={-110} y={-240} width={220} height={440} rx={16} fill="#CBD5E1" stroke="#18181B" strokeWidth={5} />
          <ellipse cx={0} cy={-240} rx={110} ry={25} fill="#E2E8F0" stroke="#18181B" strokeWidth={4} />
          <line x1={-70} y1={-200} x2={-70} y2={180} stroke="#FFFFFF" strokeWidth={8} opacity={0.6} />
          {/* Volume Gauge */}
          <rect x={60} y={-180} width={18} height={340} rx={4} fill="#0F172A" />
          <rect x={63} y={-80} width={12} height={235} rx={3} fill="#38BDF8" />
          <text x={0} y={-120} textAnchor="middle" fill="#0F172A" fontSize={24} fontWeight="900">
            SILO #1
          </text>
          <text x={0} y={-90} textAnchor="middle" fill="#0369A1" fontSize={20} fontWeight="bold">
            100,000 L
          </text>
        </g>

        <g transform="translate(1680, 360)">
          {/* Silo 2 */}
          <rect x={-110} y={-240} width={220} height={440} rx={16} fill="#CBD5E1" stroke="#18181B" strokeWidth={5} />
          <ellipse cx={0} cy={-240} rx={110} ry={25} fill="#E2E8F0" stroke="#18181B" strokeWidth={4} />
          <line x1={-70} y1={-200} x2={-70} y2={180} stroke="#FFFFFF" strokeWidth={8} opacity={0.6} />
          {/* Volume Gauge */}
          <rect x={60} y={-180} width={18} height={340} rx={4} fill="#0F172A" />
          <rect x={63} y={-120} width={12} height={275} rx={3} fill="#38BDF8" />
          <text x={0} y={-120} textAnchor="middle" fill="#0F172A" fontSize={24} fontWeight="900">
            SILO #2
          </text>
          <text x={0} y={-90} textAnchor="middle" fill="#0369A1" fontSize={20} fontWeight="bold">
            100,000 L
          </text>
        </g>

        {/* Factory Floor */}
        <rect x={0} y={680} width={1920} height={400} fill="#334155" />
        <line x1={0} y1={680} x2={1920} y2={680} stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

        {/* Yellow Hazard Warning Stripe */}
        <g>
          <rect x={0} y={680} width={1920} height={25} fill="#FACC15" />
          {Array.from({ length: 32 }).map((_, i) => (
            <polygon
              key={i}
              points={`${i * 65},680 ${i * 65 + 30},680 ${i * 65 + 10},705 ${i * 65 - 20},705`}
              fill="#18181B"
            />
          ))}
        </g>

        {/* Conveyor Belt System */}
        {showConveyor && (
          <g transform="translate(0, 750)">
            {/* Belt Bed */}
            <rect x={0} y={0} width={1920} height={60} fill="#0F172A" stroke="#18181B" strokeWidth={4} />
            {/* Rollers / Chevron lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line
                key={i}
                x1={i * 120 + beltOffset}
                y1={5}
                x2={i * 120 + beltOffset + 40}
                y2={55}
                stroke="#475569"
                strokeWidth={5}
              />
            ))}
            {/* Belt Legs */}
            <rect x={400} y={60} width={40} height={270} fill="#1E293B" stroke="#18181B" strokeWidth={4} />
            <rect x={940} y={60} width={40} height={270} fill="#1E293B" stroke="#18181B" strokeWidth={4} />
            <rect x={1480} y={60} width={40} height={270} fill="#1E293B" stroke="#18181B" strokeWidth={4} />
          </g>
        )}

        {children}
      </svg>
    </div>
  );
};

/**
 * 🗺️ World Map Environment (Regional Milk Cultures)
 */
export const WorldMapEnv: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ display: 'block' }}>
        {/* Ocean Background */}
        <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />

        {/* Subtle Map Coordinate Grid */}
        <g stroke="#1E293B" strokeWidth={1.5} opacity={0.6} strokeDasharray="6 6">
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={`meridian-${i}`} x1={i * 160} y1={0} x2={i * 160} y2={1080} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={`parallel-${i}`} x1={0} y1={i * 135} x2={1920} y2={i * 135} />
          ))}
        </g>

        {/* Stylized Continents Outlines */}
        {/* 1. Europe & Mediterranean */}
        <path
          d="M 880 200 
             Q 940 180 1010 220 
             Q 1060 250 1040 310 
             Q 980 340 920 320 
             Q 860 360 840 280 
             Q 830 220 880 200 Z"
          fill="#1E293B"
          stroke="#38BDF8"
          strokeWidth={4}
        />
        {/* British Isles */}
        <ellipse cx={820} cy={220} rx={22} ry={38} fill="#1E293B" stroke="#38BDF8" strokeWidth={3} transform="rotate(-20 820 220)" />

        {/* 2. Africa */}
        <path
          d="M 870 380 
             Q 990 370 1040 450 
             Q 1080 540 1030 680 
             Q 970 820 920 820 
             Q 850 720 830 560 
             Q 800 460 870 380 Z"
          fill="#1E293B"
          stroke="#F59E0B"
          strokeWidth={4}
        />

        {/* 3. Asia & Middle East */}
        <path
          d="M 1050 220 
             Q 1250 180 1520 230 
             Q 1660 320 1620 480 
             Q 1500 550 1350 490 
             Q 1220 540 1150 460 
             Q 1080 430 1050 350 Z"
          fill="#1E293B"
          stroke="#10B981"
          strokeWidth={4}
        />
        {/* Indian Subcontinent */}
        <path d="M 1250 440 L 1310 560 L 1220 530 Z" fill="#1E293B" stroke="#10B981" strokeWidth={3} />

        {/* 4. Americas (Americas East Coast / stylized) */}
        <path
          d="M 280 180 
             Q 450 160 520 270 
             Q 500 400 430 460 
             Q 320 440 280 340 Z"
          fill="#1E293B"
          stroke="#64748B"
          strokeWidth={3.5}
        />
        <path
          d="M 420 480 
             Q 500 520 520 620 
             Q 480 780 400 820 
             Q 360 700 380 570 Z"
          fill="#1E293B"
          stroke="#64748B"
          strokeWidth={3.5}
        />

        {/* Compass Rose (Top Right) */}
        <g transform="translate(1780, 140)">
          <circle cx={0} cy={0} r={55} fill="#1E293B" stroke="#38BDF8" strokeWidth={3} />
          <polygon points="0,-45 8,-12 0,0 -8,-12" fill="#EF4444" />
          <polygon points="0,45 8,12 0,0 -8,12" fill="#94A3B8" />
          <polygon points="45,0 12,8 0,0 12,-8" fill="#94A3B8" />
          <polygon points="-45,0 -12,8 0,0 -12,-8" fill="#94A3B8" />
          <text x={0} y={-52} textAnchor="middle" fill="#EF4444" fontSize={16} fontWeight="900">N</text>
        </g>

        {/* Map Title Header */}
        <g transform="translate(960, 80)">
          <rect x={-360} y={-35} width={720} height={70} rx={35} fill="#1E293B" stroke="#38BDF8" strokeWidth={4} />
          <text x={0} y={10} textAnchor="middle" fill="#FFFFFF" fontSize={28} fontWeight="900" letterSpacing="2px">
            GLOBAL DOMESTICATION MAP: REGIONAL MILK CULTURES
          </text>
        </g>

        {children}
      </svg>
    </div>
  );
};

/**
 * 🧀 Golden Cheese Wheel
 */
export const CheeseWheel: React.FC<{
  x: number;
  y: number;
  scale?: number;
  showCutWedge?: boolean;
}> = ({ x, y, scale = 1, showCutWedge = true }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={60} rx={95} ry={20} fill="rgba(0,0,0,0.18)" />

      {/* Cheese Body Cylinder */}
      <path
        d="M -90 0 
           L -90 40 
           C -90 75 90 75 90 40 
           L 90 0 
           Z"
        fill="#F59E0B"
        stroke="#18181B"
        strokeWidth={DOODLE_WIDTH}
      />
      {/* Cheese Top Surface */}
      <ellipse cx={0} cy={0} rx={90} ry={35} fill="#FDE047" stroke="#18181B" strokeWidth={DOODLE_WIDTH} />

      {/* Cut Wedge Out */}
      {showCutWedge && (
        <g>
          <polygon points="0,0 55,-22 45,35 0,40" fill="#FBBF24" stroke="#18181B" strokeWidth={3} />
          <polygon points="0,0 -20,25 -20,62 0,40" fill="#F59E0B" stroke="#18181B" strokeWidth={3} />
        </g>
      )}

      {/* Swiss Cheese Holes */}
      <ellipse cx={-45} cy={-10} rx={12} ry={6} fill="#F59E0B" />
      <ellipse cx={-20} cy={-20} rx={9} ry={4} fill="#F59E0B" />
      <ellipse cx={-60} cy={20} rx={10} ry={6} fill="#D97706" />
      <ellipse cx={40} cy={45} rx={14} ry={8} fill="#D97706" />
    </g>
  );
};

/**
 * 🧈 Golden Butter Block
 */
export const ButterBlock: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Paper Wrapper */}
      <polygon points="-85,35 85,35 105,65 -105,65" fill="#F1F5F9" stroke="#18181B" strokeWidth={3} />

      {/* Butter Block 3D Isometric */}
      {/* Front Face */}
      <rect x={-70} y={-10} width={140} height={50} rx={4} fill="#FBBF24" stroke="#18181B" strokeWidth={4} />
      {/* Top Face */}
      <polygon points="-70,-10 -40,-35 100,-35 70,-10" fill="#FEF08A" stroke="#18181B" strokeWidth={4} />
      {/* Right Side Face */}
      <polygon points="70,-10 100,-35 100,15 70,40" fill="#F59E0B" stroke="#18181B" strokeWidth={4} />

      {/* Butter Knife Slice mark */}
      <line x1={-30} y1={-25} x2={-30} y2={25} stroke="#D97706" strokeWidth={3} strokeDasharray="4 4" />
      <text x={0} y={24} textAnchor="middle" fill="#92400E" fontSize={16} fontWeight="900" letterSpacing="1px">
        BUTTER 82%
      </text>
    </g>
  );
};

/**
 * 🥛 Glass Milk Bottle
 */
export const MilkBottle: React.FC<{
  x: number;
  y: number;
  scale?: number;
  label?: string;
}> = ({ x, y, scale = 1, label = 'COW MILK' }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Shadow */}
      <ellipse cx={0} cy={95} rx={45} ry={12} fill="rgba(0,0,0,0.15)" />
      {/* Glass Body */}
      <rect x={-36} y={-20} width={72} height={110} rx={10} fill="#F8FAFC" stroke="#18181B" strokeWidth={4} />
      {/* Neck */}
      <polygon points="-32,-20 -18,-60 18,-60 32,-20" fill="#F8FAFC" stroke="#18181B" strokeWidth={4} />
      {/* Mouth & Cap */}
      <ellipse cx={0} cy={-60} rx={20} ry={7} fill="#EF4444" stroke="#18181B" strokeWidth={3.5} />
      {/* Label */}
      <rect x={-28} y={15} width={56} height={40} rx={4} fill="#38BDF8" stroke="#18181B" strokeWidth={2.5} />
      <text x={0} y={35} textAnchor="middle" fill="#FFFFFF" fontSize={9} fontWeight="900">
        {label}
      </text>
      {/* Glass Reflection */}
      <line x1={-24} y1={-10} x2={-24} y2={80} stroke="#FFFFFF" strokeWidth={4} opacity={0.7} />
    </g>
  );
};

/**
 * 🧪 Curdling Failure vs Success Comparison Card
 */
export const CurdleFailureCard: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const stinkOffset = Math.sin(frame * 0.25) * 6;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Main Backplate */}
      <rect x={-520} y={-260} width={1040} height={520} rx={28} fill="#0F172A" stroke="#FFFFFF" strokeWidth={5} />
      {/* Divider */}
      <line x1={0} y1={-240} x2={0} y2={240} stroke="#334155" strokeWidth={4} strokeDasharray="8 8" />

      {/* LEFT: COW MILK CURDLING SUCCESS */}
      <g transform="translate(-260, 0)">
        <rect x={-210} y={-220} width={420} height={50} rx={25} fill="#059669" />
        <text x={0} y={-187} textAnchor="middle" fill="#FFFFFF" fontSize={22} fontWeight="900">
          COW MILK: PERFECT CURD
        </text>

        {/* Large Beaker with Golden Curd + Clear Whey */}
        <g transform="translate(0, -10)">
          {/* Beaker Outline */}
          <rect x={-80} y={-60} width={160} height={170} rx={8} fill="#E2E8F0" stroke="#18181B" strokeWidth={4} />
          {/* Clear Yellowish Whey at bottom */}
          <rect x={-75} y={30} width={150} height={75} rx={4} fill="#FEF08A" opacity={0.6} />
          {/* Dense Solid Golden Curd Block Floating */}
          <rect x={-65} y={-30} width={130} height={70} rx={12} fill="#FACC15" stroke="#CA8A04" strokeWidth={3} />
          <text x={0} y={10} textAnchor="middle" fill="#854D0E" fontSize={16} fontWeight="bold">
            FIRM CURD
          </text>
        </g>

        {/* Products badge */}
        <g transform="translate(0, 160)">
          <rect x={-180} y={-20} width={360} height={40} rx={20} fill="#10B981" />
          <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={17} fontWeight="900">
            ✔ CHEESE, BUTTER, YOGURT
          </text>
        </g>
      </g>

      {/* RIGHT: PIG MILK CURDLING FAILURE */}
      <g transform="translate(260, 0)">
        <rect x={-210} y={-220} width={420} height={50} rx={25} fill="#DC2626" />
        <text x={0} y={-187} textAnchor="middle" fill="#FFFFFF" fontSize={22} fontWeight="900">
          PIG MILK: SLUDGE FAILURE
        </text>

        {/* Large Beaker with Unappetizing Watery Sludge */}
        <g transform="translate(0, -10)">
          <rect x={-80} y={-60} width={160} height={170} rx={8} fill="#E2E8F0" stroke="#18181B" strokeWidth={4} />
          {/* Watery Murky Grey Fluid */}
          <rect x={-75} y={-45} width={150} height={150} rx={4} fill="#94A3B8" opacity={0.8} />
          {/* Clumpy broken slime curds */}
          <ellipse cx={-35} cy={0} rx={26} ry={14} fill="#64748B" />
          <ellipse cx={25} cy={20} rx={32} ry={16} fill="#64748B" />
          <ellipse cx={-10} cy={60} rx={45} ry={18} fill="#475569" />
          {/* Stink waves */}
          <path
            d={`M -40 -70 Q ${-50 + stinkOffset} -100 ${-40 + stinkOffset} -120`}
            stroke="#84CC16"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
          <path
            d={`M 20 -70 Q ${30 - stinkOffset} -100 ${20 - stinkOffset} -120`}
            stroke="#84CC16"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        </g>

        {/* Failure badge */}
        <g transform="translate(0, 160)">
          <rect x={-180} y={-20} width={360} height={40} rx={20} fill="#B91C1C" />
          <text x={0} y={7} textAnchor="middle" fill="#FFFFFF" fontSize={17} fontWeight="900">
            ✖ WATERY CLUMPS (NO CHEESE)
          </text>
        </g>
      </g>
    </g>
  );
};

/**
 * 🏆 Domestication Tournament Scorecard
 */
export const DomesticationTournamentCard: React.FC<{
  x: number;
  y: number;
  scale?: number;
  activeRow?: number; // 1: Cattle, 2: Goat, 3: Sheep, 4: Camel, 5: Pig
}> = ({ x, y, scale = 1, activeRow = 5 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Chalkboard Frame */}
      <rect x={-520} y={-280} width={1040} height={560} rx={24} fill="#064E3B" stroke="#78350F" strokeWidth={14} />

      {/* Tournament Title */}
      <rect x={-360} y={-255} width={720} height={50} rx={25} fill="#047857" stroke="#34D399" strokeWidth={2} />
      <text x={0} y={-222} textAnchor="middle" fill="#FDE047" fontSize={26} fontWeight="900" letterSpacing="2px">
        🏆 DOMESTICATION TOURNAMENT SCORECARD
      </text>

      {/* Table Headers */}
      <g transform="translate(-460, -170)">
        <text x={20} y={0} fill="#94A3B8" fontSize={19} fontWeight="bold">ANIMAL</text>
        <text x={260} y={0} fill="#94A3B8" fontSize={19} fontWeight="bold">DAIRY YIELD</text>
        <text x={470} y={0} fill="#94A3B8" fontSize={19} fontWeight="bold">MANAGEABILITY</text>
        <text x={720} y={0} fill="#94A3B8" fontSize={19} fontWeight="bold">FINAL GRADE</text>
        <line x1={0} y1={12} x2={920} y2={12} stroke="#047857" strokeWidth={3} />
      </g>

      {/* Row 1: Cattle */}
      <g transform="translate(-460, -115)">
        <rect x={-10} y={-25} width={940} height={44} rx={8} fill={activeRow === 1 ? '#0F766E' : 'rgba(0,0,0,0.2)'} />
        <text x={20} y={5} fill="#FFFFFF" fontSize={21} fontWeight="bold">🐮 Cattle (Cow)</text>
        <text x={260} y={5} fill="#38BDF8" fontSize={20} fontWeight="bold">30 - 45 L / day</text>
        <text x={470} y={5} fill="#34D399" fontSize={20}>Docile, 4 teats</text>
        <text x={760} y={6} fill="#FDE047" fontSize={24} fontWeight="900">A+</text>
      </g>

      {/* Row 2: Goats */}
      <g transform="translate(-460, -55)">
        <rect x={-10} y={-25} width={940} height={44} rx={8} fill={activeRow === 2 ? '#0F766E' : 'rgba(0,0,0,0.2)'} />
        <text x={20} y={5} fill="#FFFFFF" fontSize={21} fontWeight="bold">🐐 Goat</text>
        <text x={260} y={5} fill="#38BDF8" fontSize={20} fontWeight="bold">3 - 5 L / day</text>
        <text x={470} y={5} fill="#34D399" fontSize={20}>Hardy, 2 teats</text>
        <text x={760} y={6} fill="#FDE047" fontSize={24} fontWeight="900">A</text>
      </g>

      {/* Row 3: Sheep */}
      <g transform="translate(-460, 5)">
        <rect x={-10} y={-25} width={940} height={44} rx={8} fill={activeRow === 3 ? '#0F766E' : 'rgba(0,0,0,0.2)'} />
        <text x={20} y={5} fill="#FFFFFF" fontSize={21} fontWeight="bold">🐑 Sheep</text>
        <text x={260} y={5} fill="#38BDF8" fontSize={20} fontWeight="bold">1.5 - 3 L / day</text>
        <text x={470} y={5} fill="#34D399" fontSize={20}>Flock animal</text>
        <text x={760} y={6} fill="#FDE047" fontSize={24} fontWeight="900">A</text>
      </g>

      {/* Row 4: Camel */}
      <g transform="translate(-460, 65)">
        <rect x={-10} y={-25} width={940} height={44} rx={8} fill={activeRow === 4 ? '#0F766E' : 'rgba(0,0,0,0.2)'} />
        <text x={20} y={5} fill="#FFFFFF" fontSize={21} fontWeight="bold">🐫 Camel</text>
        <text x={260} y={5} fill="#38BDF8" fontSize={20} fontWeight="bold">5 - 15 L / day</text>
        <text x={470} y={5} fill="#34D399" fontSize={20}>Desert survival</text>
        <text x={760} y={6} fill="#FDE047" fontSize={24} fontWeight="900">A-</text>
      </g>

      {/* Row 5: PIG (THE FAILURE) */}
      <g transform="translate(-460, 135)">
        <rect x={-10} y={-25} width={940} height={56} rx={8} fill="#7F1D1D" stroke="#EF4444" strokeWidth={3} />
        <text x={20} y={10} fill="#FECDD3" fontSize={22} fontWeight="900">🐷 Pig (Sow)</text>
        <text x={260} y={10} fill="#F87171" fontSize={20} fontWeight="bold">&lt; 0.5 L (bursts)</text>
        <text x={470} y={10} fill="#FCA5A5" fontSize={19}>Aggressive, 14 teats</text>
        {/* BIG STAMP */}
        <g transform="translate(760, 6) rotate(-8)">
          <rect x={-32} y={-22} width={64} height={44} rx={8} fill="#DC2626" stroke="#FFFFFF" strokeWidth={3} />
          <text x={0} y={9} textAnchor="middle" fill="#FFFFFF" fontSize={28} fontWeight="900">
            F-
          </text>
        </g>
      </g>

      {/* Note footer */}
      <text x={0} y={225} textAnchor="middle" fill="#A7F3D0" fontSize={18} fontStyle="italic">
        *VERDICT: Pigs excel 100% in Meat & Reproduction. Complete failure in Dairy Mechanics.
      </text>
    </g>
  );
};

