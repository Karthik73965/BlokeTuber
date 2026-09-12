import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

/**
 * Hand-drawn SVG filter definition to give clean vector shapes
 * an organic, wobbly, hand-drawn marker / doodle look.
 */
export const DoodleFilterDef: React.FC<{ id?: string; scale?: number }> = ({
  id = 'doodle-wobble',
  scale = 2.5,
}) => {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }}>
      <defs>
        <filter id={id} x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={scale}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  );
};

export const DOODLE_STROKE = '#18181B';
export const DOODLE_WIDTH = 7;

/**
 * Hand-drawn Doodle Sun with optional rotating/pulsing rays
 */
export const DoodleSun: React.FC<{
  x: number;
  y: number;
  size?: number;
  angry?: boolean;
  pulse?: boolean;
}> = ({ x, y, size = 100, angry = false, pulse = true }) => {
  const frame = useCurrentFrame();
  const rotation = pulse ? (frame * 0.4) % 360 : 0;
  const rayScale = pulse ? 1 + Math.sin(frame * 0.1) * 0.08 : 1;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Rays */}
      <g
        transform={`rotate(${rotation}) scale(${rayScale})`}
        stroke="#FACC15"
        strokeWidth={DOODLE_WIDTH + 1}
        strokeLinecap="round"
      >
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1={0}
            y1={-size * 0.7}
            x2={0}
            y2={-size * 1.05}
            transform={`rotate(${deg})`}
          />
        ))}
      </g>

      {/* Sun Body */}
      <circle
        cx={0}
        cy={0}
        r={size * 0.58}
        fill={angry ? '#F97316' : '#FDE047'}
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />

      {/* Face */}
      {angry ? (
        <g stroke={DOODLE_STROKE} strokeWidth={5} strokeLinecap="round">
          {/* Angered eyebrows */}
          <line x1={-size * 0.28} y1={-size * 0.16} x2={-size * 0.08} y2={-size * 0.06} />
          <line x1={size * 0.28} y1={-size * 0.16} x2={size * 0.08} y2={-size * 0.06} />
          {/* Eyes */}
          <circle cx={-size * 0.18} cy={-size * 0.02} r={size * 0.06} fill="#000" />
          <circle cx={size * 0.18} cy={-size * 0.02} r={size * 0.06} fill="#000" />
          {/* Grimace mouth */}
          <path
            d={`M ${-size * 0.22} ${size * 0.2} Q 0 ${size * 0.08} ${size * 0.22} ${size * 0.2}`}
            fill="none"
          />
        </g>
      ) : (
        <g stroke={DOODLE_STROKE} strokeWidth={5} strokeLinecap="round">
          {/* Smiling eyes */}
          <circle cx={-size * 0.18} cy={-size * 0.06} r={size * 0.05} fill="#000" />
          <circle cx={size * 0.18} cy={-size * 0.06} r={size * 0.05} fill="#000" />
          {/* Smile mouth */}
          <path
            d={`M ${-size * 0.18} ${size * 0.1} Q 0 ${size * 0.26} ${size * 0.18} ${size * 0.1}`}
            fill="none"
          />
          {/* Rosy cheeks */}
          <ellipse cx={-size * 0.3} cy={size * 0.08} rx={size * 0.06} ry={size * 0.04} fill="#FCA5A5" opacity={0.6} />
          <ellipse cx={size * 0.3} cy={size * 0.08} rx={size * 0.06} ry={size * 0.04} fill="#FCA5A5" opacity={0.6} />
        </g>
      )}
    </g>
  );
};

/**
 * Thermometer with animated red mercury column
 */
export const DoodleThermometer: React.FC<{
  x: number;
  y: number;
  height?: number;
  tempPercent: number; // 0 to 100
  label?: string;
  themeColor?: string;
}> = ({ x, y, height = 240, tempPercent, label, themeColor = '#DC2626' }) => {
  const bulbRadius = 32;
  const tubeWidth = 24;
  const mercuryHeight = (height - bulbRadius * 2) * (Math.min(100, Math.max(0, tempPercent)) / 100);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer Tube Glass */}
      <path
        d={`
          M ${-tubeWidth / 2} ${-height + bulbRadius}
          A ${tubeWidth / 2} ${tubeWidth / 2} 0 0 1 ${tubeWidth / 2} ${-height + bulbRadius}
          L ${tubeWidth / 2} ${-bulbRadius * 1.2}
          A ${bulbRadius} ${bulbRadius} 0 1 1 ${-tubeWidth / 2} ${-bulbRadius * 1.2}
          Z
        `}
        fill="#FFFFFF"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
        strokeLinejoin="round"
      />

      {/* Red Bulb Fill */}
      <circle cx={0} cy={0} r={bulbRadius - 8} fill={themeColor} />

      {/* Red Mercury Column */}
      <rect
        x={-tubeWidth / 2 + 5}
        y={-bulbRadius - mercuryHeight}
        width={tubeWidth - 10}
        height={mercuryHeight + bulbRadius}
        fill={themeColor}
        rx={5}
      />

      {/* Tick Marks */}
      {[0.25, 0.5, 0.75, 1.0].map((frac, idx) => (
        <line
          key={idx}
          x1={tubeWidth / 2}
          y1={-bulbRadius - (height - bulbRadius * 2) * frac}
          x2={tubeWidth / 2 + 14}
          y2={-bulbRadius - (height - bulbRadius * 2) * frac}
          stroke={DOODLE_STROKE}
          strokeWidth={4}
          strokeLinecap="round"
        />
      ))}

      {/* Label / Temperature reading */}
      {label && (
        <text
          x={tubeWidth + 24}
          y={-height * 0.5}
          fontFamily="'Comic Sans MS', 'Chalkboard SE', 'Patrick Hand', sans-serif"
          fontWeight="bold"
          fontSize={34}
          fill={themeColor}
        >
          {label}
        </text>
      )}
    </g>
  );
};

/**
 * Big Red Hand-Drawn ? Stamp
 */
export const DoodleCross: React.FC<{
  x: number;
  y: number;
  size?: number;
  popProgress?: number;
}> = ({ x, y, size = 140, popProgress = 1 }) => {
  const scale = popProgress;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <line
        x1={-size / 2}
        y1={-size / 2}
        x2={size / 2}
        y2={size / 2}
        stroke="#DC2626"
        strokeWidth={DOODLE_WIDTH * 2.2}
        strokeLinecap="round"
      />
      <line
        x1={size / 2}
        y1={-size / 2}
        x2={-size / 2}
        y2={size / 2}
        stroke="#DC2626"
        strokeWidth={DOODLE_WIDTH * 2.2}
        strokeLinecap="round"
      />
    </g>
  );
};

/**
 * Hand-Drawn Sparkle Stars (?)
 */
export const DoodleSparkle: React.FC<{
  x: number;
  y: number;
  size?: number;
  scale?: number;
  color?: string;
  delayFrame?: number;
}> = ({ x, y, size = 30, scale = 1, color = '#F59E0B', delayFrame = 0 }) => {
  const frame = useCurrentFrame();
  const f = Math.max(0, frame - delayFrame);
  const pulse = (0.7 + Math.sin(f * 0.15) * 0.35) * scale;

  return (
    <g transform={`translate(${x}, ${y}) scale(${pulse})`}>
      <path
        d={`
          M 0 ${-size}
          Q 0 0 ${size} 0
          Q 0 0 0 ${size}
          Q 0 0 ${-size} 0
          Q 0 0 0 ${-size}
          Z
        `}
        fill={color}
        stroke={DOODLE_STROKE}
        strokeWidth={3}
      />
    </g>
  );
};

/**
 * Hand-Drawn Solar Ray Arrow
 */
export const DoodleRayArrow: React.FC<{
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  bounceX?: number;
  bounceY?: number;
  color?: string;
  wobble?: boolean;
}> = ({ startX, startY, endX, endY, bounceX, bounceY, color = '#EF4444' }) => {
  return (
    <g stroke={color} strokeWidth={DOODLE_WIDTH} strokeLinecap="round" strokeLinejoin="round" fill="none">
      {bounceX !== undefined && bounceY !== undefined ? (
        <>
          <path d={`M ${startX} ${startY} L ${endX} ${endY} L ${bounceX} ${bounceY}`} />
          {/* Arrow head on bounce tip */}
          <path
            d={`M ${bounceX - 16} ${bounceY} L ${bounceX} ${bounceY} L ${bounceX} ${bounceY + 16}`}
            strokeWidth={DOODLE_WIDTH}
          />
        </>
      ) : (
        <>
          <line x1={startX} y1={startY} x2={endX} y2={endY} />
          {/* Arrow head */}
          <path
            d={`M ${endX - 14} ${endY - 14} L ${endX} ${endY} L ${endX - 14} ${endY + 14}`}
            strokeWidth={DOODLE_WIDTH}
          />
        </>
      )}
    </g>
  );
};

/**
 * Mediterranean Whitewashed Cube House with Blue Dome
 */
export const DoodleWhiteHouse: React.FC<{
  x: number;
  y: number;
  scale?: number;
  dome?: boolean;
  hasDome?: boolean;
  doorColor?: string;
}> = ({ x, y, scale = 1, dome = true, hasDome, doorColor = '#1D4ED8' }) => {
  const showDome = hasDome !== undefined ? hasDome : dome;
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Main Cube Body */}
      <rect
        x={-100}
        y={-80}
        width={200}
        height={160}
        fill="#FFFFFF"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
        rx={8}
      />

      {/* Blue Dome or Flat Roof */}
      {showDome ? (
        <path
          d="M -75 -80 A 75 75 0 0 1 75 -80 Z"
          fill="#2563EB"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
      ) : (
        <line
          x1={-110}
          y1={-80}
          x2={110}
          y2={-80}
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH * 1.3}
          strokeLinecap="round"
        />
      )}

      {/* Arched Blue Door */}
      <path
        d={`M -25 80 L -25 30 A 25 25 0 0 1 25 30 L 25 80 Z`}
        fill={doorColor}
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />

      {/* Small Windows */}
      <rect x={-75} y={-40} width={28} height={36} rx={4} fill="#BFDBFE" stroke={DOODLE_STROKE} strokeWidth={5} />
      <rect x={47} y={-40} width={28} height={36} rx={4} fill="#BFDBFE" stroke={DOODLE_STROKE} strokeWidth={5} />
    </g>
  );
};

/**
 * Dark Surface House (Black/Dark Charcoal roof & walls that absorbs heat)
 */
export const DoodleDarkHouse: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Dark Body */}
      <rect
        x={-100}
        y={-80}
        width={200}
        height={160}
        fill="#3F3F46"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
        rx={8}
      />
      {/* Pitched Black Roof */}
      <polygon
        points="-120,-80 0,-160 120,-80"
        fill="#18181B"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />
      {/* Window showing dark heat */}
      <rect x={-30} y={-40} width={60} height={60} rx={4} fill="#71717A" stroke={DOODLE_STROKE} strokeWidth={5} />
      {/* Door */}
      <rect x={-24} y={35} width={48} height={45} fill="#27272A" stroke={DOODLE_STROKE} strokeWidth={5} />
    </g>
  );
};
