import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { DOODLE_STROKE, DOODLE_WIDTH } from './DoodleElements';

export type StickmanExpression =
  | 'smile'
  | 'grin'
  | 'talking'
  | 'shocked'
  | 'heart_eyes'
  | 'sweating'
  | 'confused'
  | 'curious';

export type StickmanPose =
  | 'idle'
  | 'waving'
  | 'holding_magnifier'
  | 'holding_phone'
  | 'holding_brush'
  | 'sipping_drink'
  | 'panicking'
  | 'pointing_board'
  | 'holding_camera'
  | 'wiping_sweat';

export interface DoodleStickmanProps {
  x: number;
  y: number;
  scale?: number;
  expression?: StickmanExpression;
  pose?: StickmanPose;
  hat?: 'none' | 'safari' | 'sunglasses';
  bodyColor?: string;
  pupilDirection?: 'center' | 'up_right' | 'left' | 'down';
  shirtColor?: string;
  shortsColor?: string;
}

export const DoodleStickman: React.FC<DoodleStickmanProps> = ({
  x,
  y,
  scale = 1,
  expression = 'smile',
  pose = 'idle',
  hat = 'none',
  bodyColor = '#18181B',
  pupilDirection = 'up_right',
  shirtColor = '#FFFFFF',
  shortsColor,
}) => {
  const frame = useCurrentFrame();

  const effectiveShirt = shirtColor === 'none' ? undefined : shirtColor;

  // Subtle natural idle breathe
  const breatheY = Math.sin(frame * 0.08) * 3;
  const headRadius = 46;

  // Pupil offsets based on direction
  let pupilOffsetX = 4;
  let pupilOffsetY = -4;
  if (pupilDirection === 'center') {
    pupilOffsetX = 0;
    pupilOffsetY = 0;
  } else if (pupilDirection === 'left') {
    pupilOffsetX = -5;
    pupilOffsetY = 0;
  } else if (pupilDirection === 'down') {
    pupilOffsetX = 0;
    pupilOffsetY = 5;
  }

  const legStartY = headRadius + (shortsColor ? 155 : 115);
  const legEndY = headRadius + (shortsColor ? 230 : 205);

  return (
    <g transform={`translate(${x}, ${y + breatheY}) scale(${scale})`}>
      {/* 1. Torso Spine (only if NO shirt is drawn) */}
      {!effectiveShirt && (
        <line
          x1={0}
          y1={headRadius}
          x2={0}
          y2={headRadius + 115}
          stroke={bodyColor}
          strokeWidth={DOODLE_WIDTH}
          strokeLinecap="round"
        />
      )}

      {/* 1b. Shirt / Torso clothing if specified - Clean single-path T-shirt like reference */}
      {effectiveShirt && (
        <path
          d={`M -20 ${headRadius + 8} 
              Q 0 ${headRadius + 18} 20 ${headRadius + 8} 
              L 55 ${headRadius + 26} 
              L 40 ${headRadius + 64} 
              L 26 ${headRadius + 48} 
              L 28 ${headRadius + 115} 
              L -28 ${headRadius + 115} 
              L -26 ${headRadius + 48} 
              L -40 ${headRadius + 64} 
              L -55 ${headRadius + 26} Z`}
          fill={effectiveShirt}
          stroke={bodyColor}
          strokeWidth={5}
          strokeLinejoin="round"
        />
      )}

      {/* 1c. Shorts / Pants clothing if specified */}
      {shortsColor && (
        <polygon
          points={`-28,${headRadius + 115} 28,${headRadius + 115} 32,${headRadius + 155} 6,${headRadius + 155} 0,${headRadius + 130} -6,${headRadius + 155} -32,${headRadius + 155}`}
          fill={shortsColor}
          stroke={bodyColor}
          strokeWidth={4}
          strokeLinejoin="round"
        />
      )}

      {/* 2. Legs - Parallel vertical legs matching reference video ref_107s */}
      {pose === 'sipping_drink' ? (
        <g stroke={bodyColor} strokeWidth={DOODLE_WIDTH} strokeLinecap="round" fill="none">
          <path d={`M -14 ${legStartY} L 40 ${headRadius + 130} L 55 ${headRadius + 190}`} />
          <path d={`M 14 ${legStartY} L 30 ${headRadius + 135} L 40 ${headRadius + 195}`} />
        </g>
      ) : (
        <g stroke={bodyColor} strokeWidth={DOODLE_WIDTH} strokeLinecap="round">
          {/* Left Leg */}
          <line x1={-16} y1={legStartY} x2={-16} y2={legEndY} />
          {/* Left Foot pointing outward */}
          <line x1={-16} y1={legEndY} x2={-32} y2={legEndY} />

          {/* Right Leg */}
          <line x1={16} y1={legStartY} x2={16} y2={legEndY} />
          {/* Right Foot pointing outward */}
          <line x1={16} y1={legEndY} x2={32} y2={legEndY} />
        </g>
      )}

      {/* Neck connecting head to torso */}
      <line
        x1={0}
        y1={headRadius}
        x2={0}
        y2={headRadius + 12}
        stroke={bodyColor}
        strokeWidth={DOODLE_WIDTH}
        strokeLinecap="round"
      />

      {/* 3. Arms according to pose (Clean hands attached, flaring outward like reference ref_107s) */}
      {(() => {
        const lx = shirtColor ? -48 : -15;
        const ly = shirtColor ? headRadius + 45 : headRadius + 25;
        const rx = shirtColor ? 48 : 15;
        const ry = shirtColor ? headRadius + 45 : headRadius + 25;

        return (
          <g stroke={bodyColor} strokeWidth={DOODLE_WIDTH} strokeLinecap="round" fill="none">
            {pose === 'idle' && (
              <>
                {/* Left arm flaring down-left away from shirt */}
                <line x1={lx} y1={ly} x2={shirtColor ? -72 : -45} y2={headRadius + 120} />
                <circle cx={shirtColor ? -72 : -45} cy={headRadius + 120} r={6} fill={bodyColor} />

                {/* Right arm flaring down-right away from shirt */}
                <line x1={rx} y1={ry} x2={shirtColor ? 72 : 45} y2={headRadius + 120} />
                <circle cx={shirtColor ? 72 : 45} cy={headRadius + 120} r={6} fill={bodyColor} />
              </>
            )}

            {pose === 'holding_camera' && (
              <>
                <path d={`M ${rx} ${ry} L 35 ${headRadius + 15} L 45 ${headRadius - 5}`} />
                <path d={`M ${lx} ${ly} L -20 ${headRadius + 25} L 20 ${headRadius - 5}`} />
                <circle cx={45} cy={headRadius - 5} r={6} fill={bodyColor} />
                <circle cx={20} cy={headRadius - 5} r={6} fill={bodyColor} />
                <rect x={20} y={headRadius - 25} width={46} height={34} rx={4} fill="#475569" stroke={bodyColor} strokeWidth={4} />
                <circle cx={43} cy={headRadius - 8} r={10} fill="#0F172A" stroke={bodyColor} strokeWidth={3} />
                {frame % 30 < 3 && (
                  <circle cx={43} cy={headRadius - 8} r={40} fill="rgba(255,255,255,0.85)" />
                )}
              </>
            )}

            {pose === 'wiping_sweat' && (
              <>
                {/* Arm reaches up to forehead with hand */}
                <path d={`M ${lx} ${ly} L -55 ${headRadius + 15} L -28 ${headRadius - 15}`} />
                <circle cx={-28} cy={headRadius - 15} r={6} fill={bodyColor} />
                {/* Other arm down */}
                <line x1={rx} y1={ry} x2={45} y2={headRadius + 115} />
                <circle cx={45} cy={headRadius + 115} r={6} fill={bodyColor} />
              </>
            )}

            {pose === 'waving' && (
              <>
                {/* Left arm hanging relaxed with hand */}
                <line x1={lx} y1={ly} x2={-45} y2={headRadius + 115} />
                <circle cx={-45} cy={headRadius + 115} r={6} fill={bodyColor} />

                {/* Right arm waving up with hand */}
                <path
                  d={`M ${rx} ${ry} L 55 ${headRadius + 10} L ${
                    68 + Math.sin(frame * 0.25) * 6
                  } ${headRadius - 45 + Math.cos(frame * 0.25) * 6}`}
                />
                <circle
                  cx={68 + Math.sin(frame * 0.25) * 6}
                  cy={headRadius - 45 + Math.cos(frame * 0.25) * 6}
                  r={7}
                  fill={bodyColor}
                />
              </>
            )}

            {pose === 'holding_magnifier' && (
              <>
                <path d={`M ${lx} ${ly} L -38 ${headRadius + 70} L -32 ${headRadius + 110}`} />
                <circle cx={-32} cy={headRadius + 110} r={6} fill={bodyColor} />
                {/* Arm reaching forward with glass and hand */}
                <path d={`M ${rx} ${ry} L 55 ${headRadius + 20} L 85 ${headRadius - 10}`} />
                <circle cx={85} cy={headRadius - 10} r={6} fill={bodyColor} />
                {/* Magnifier */}
                <circle
                  cx={95}
                  cy={headRadius - 20}
                  r={28}
                  fill="rgba(219, 234, 254, 0.5)"
                  stroke={DOODLE_STROKE}
                  strokeWidth={DOODLE_WIDTH}
                />
                <line
                  x1={82}
                  y1={headRadius - 5}
                  x2={68}
                  y2={headRadius + 12}
                  stroke="#B45309"
                  strokeWidth={DOODLE_WIDTH * 1.3}
                />
              </>
            )}

            {pose === 'holding_phone' && (
              <>
                <line x1={lx} y1={ly} x2={-35} y2={headRadius + 95} />
                <circle cx={-35} cy={headRadius + 95} r={6} fill={bodyColor} />
                <path d={`M ${rx} ${ry} L 45 ${headRadius + 15} L 60 ${headRadius - 15}`} />
                <circle cx={60} cy={headRadius - 15} r={6} fill={bodyColor} />
                <rect
                  x={55}
                  y={headRadius - 40}
                  width={26}
                  height={45}
                  rx={5}
                  fill="#18181B"
                  stroke={DOODLE_STROKE}
                  strokeWidth={4}
                />
                <circle cx={62} cy={headRadius - 32} r={3} fill="#60A5FA" />
                {frame % 45 < 4 && (
                  <circle cx={68} cy={headRadius - 18} r={35} fill="rgba(255, 255, 255, 0.9)" />
                )}
              </>
            )}

            {pose === 'holding_brush' && (
              <>
                <path d={`M ${lx} ${ly} L -45 ${headRadius + 45} L -65 ${headRadius + 45}`} />
                <circle cx={-65} cy={headRadius + 45} r={6} fill={bodyColor} />
                <ellipse cx={-75} cy={headRadius + 45} rx={22} ry={16} fill="#E2E8F0" stroke={DOODLE_STROKE} strokeWidth={4} />
                <circle cx={-84} cy={headRadius + 40} r={4} fill="#EF4444" />
                <circle cx={-75} cy={headRadius + 36} r={4} fill="#3B82F6" />
                <circle cx={-66} cy={headRadius + 42} r={4} fill="#EAB308" />
                <path d={`M ${rx} ${ry} L 55 ${headRadius + 15} L 75 ${headRadius - 20}`} />
                <circle cx={75} cy={headRadius - 20} r={6} fill={bodyColor} />
                <line x1={70} y1={headRadius - 15} x2={95} y2={headRadius - 40} stroke="#92400E" strokeWidth={6} />
                <circle cx={95} cy={headRadius - 40} r={5} fill="#EF4444" />
              </>
            )}

            {pose === 'sipping_drink' && (
              <>
                <line x1={lx} y1={ly} x2={-30} y2={headRadius + 85} />
                <circle cx={-30} cy={headRadius + 85} r={6} fill={bodyColor} />
                <path d={`M ${rx} ${ry} L 35 ${headRadius + 25} L 20 ${headRadius - 10}`} />
                <circle cx={20} cy={headRadius - 10} r={6} fill={bodyColor} />
                <polygon points="12,-5 28,-5 25,25 15,25" fill="#BFDBFE" stroke={DOODLE_STROKE} strokeWidth={4} />
                <line x1={20} y1={5} x2={5} y2={headRadius - 32} stroke="#DC2626" strokeWidth={4} />
              </>
            )}

            {pose === 'panicking' && (
              <>
                <path d={`M ${lx} ${ly} L -45 ${headRadius + 10} L -30 ${headRadius - 15}`} />
                <circle cx={-30} cy={headRadius - 15} r={6} fill={bodyColor} />
                <path d={`M ${rx} ${ry} L 45 ${headRadius + 10} L 30 ${headRadius - 15}`} />
                <circle cx={30} cy={headRadius - 15} r={6} fill={bodyColor} />
              </>
            )}

            {pose === 'pointing_board' && (
              <>
                <path d={`M ${lx} ${ly} L -38 ${headRadius + 70} L -32 ${headRadius + 110}`} />
                <circle cx={-32} cy={headRadius + 110} r={6} fill={bodyColor} />
                <path d={`M ${rx} ${ry} L 55 ${headRadius + 20} L 85 ${headRadius - 20}`} />
                <circle cx={85} cy={headRadius - 20} r={6} fill={bodyColor} />
                <line x1={80} y1={headRadius - 15} x2={165} y2={headRadius - 75} stroke="#B45309" strokeWidth={DOODLE_WIDTH} />
              </>
            )}
          </g>
        );
      })()}

      {/* 4. Head & Face (INKLY EXACT SIGNATURE STYLE) */}
      <g>
        {/* Head Circle */}
        <circle
          cx={0}
          cy={0}
          r={headRadius}
          fill="#FFFFFF"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />

        {/* Eyes: Huge Expressive White Circles with Outlines & Pupils */}
        {expression === 'heart_eyes' ? (
          <g fill="#EF4444" stroke={DOODLE_STROKE} strokeWidth={3}>
            <path
              d="M -20 -15 C -25 -25 -35 -20 -35 -10 C -35 5 -20 15 -20 15 C -20 15 -5 5 -5 -10 C -5 -20 -15 -25 -20 -15 Z"
              transform="scale(0.8) translate(-10, -5)"
            />
            <path
              d="M 20 -15 C 15 -25 5 -20 5 -10 C 5 5 20 15 20 15 C 20 15 35 5 35 -10 C 35 -20 25 -25 20 -15 Z"
              transform="scale(0.8) translate(15, -5)"
            />
          </g>
        ) : expression === 'sweating' ? (
          <g>
            {/* Tightly shut/straining slanted eyes */}
            <line x1={-26} y1={-12} x2={-10} y2={-5} stroke={DOODLE_STROKE} strokeWidth={5} strokeLinecap="round" />
            <line x1={26} y1={-12} x2={10} y2={-5} stroke={DOODLE_STROKE} strokeWidth={5} strokeLinecap="round" />
            {/* Blue sweat drops popping off */}
            <path
              d="M -35 -25 C -45 -25 -45 -10 -35 0 C -25 -10 -25 -25 -35 -25 Z"
              fill="#60A5FA"
              stroke={DOODLE_STROKE}
              strokeWidth={3}
              transform="scale(0.6) translate(-25, -20)"
            />
            <path
              d="M 35 -25 C 25 -25 25 -10 35 0 C 45 -10 45 -25 35 -25 Z"
              fill="#60A5FA"
              stroke={DOODLE_STROKE}
              strokeWidth={3}
              transform="scale(0.6) translate(25, -20)"
            />
          </g>
        ) : (
          /* Inkly's Signature Big Oval Eyes with Directional Pupils */
          <g>
            {/* Left Eye */}
            <circle cx={-15} cy={-6} r={14} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
            <circle cx={-15 + pupilOffsetX} cy={-6 + pupilOffsetY} r={5.5} fill="#18181B" />

            {/* Right Eye */}
            <circle cx={15} cy={-6} r={14} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
            <circle cx={15 + pupilOffsetX} cy={-6 + pupilOffsetY} r={5.5} fill="#18181B" />
          </g>
        )}

        {/* Mouth: Inkly smile or gasp */}
        {expression === 'talking' ? (
          <ellipse cx={0} cy={16} rx={9} ry={6 + Math.sin(frame * 0.3) * 4} fill="#18181B" />
        ) : expression === 'shocked' ? (
          <ellipse cx={0} cy={18} rx={14} ry={18} fill="#18181B" />
        ) : expression === 'sweating' ? (
          <path d="M -16 18 Q 0 8 16 18" fill="none" stroke={DOODLE_STROKE} strokeWidth={5} strokeLinecap="round" />
        ) : expression === 'curious' ? (
          <path d="M -10 15 Q 5 20 14 12" fill="none" stroke={DOODLE_STROKE} strokeWidth={4.5} strokeLinecap="round" />
        ) : (
          /* Warm Inkly Smile */
          <path
            d="M -16 14 Q 0 26 16 14"
            fill="none"
            stroke={DOODLE_STROKE}
            strokeWidth={5}
            strokeLinecap="round"
          />
        )}

        {/* Safari Explorer Hat */}
        {hat === 'safari' && (
          <g>
            <path d="M -36 -32 C -36 -64 36 -64 36 -32 Z" fill="#D4A373" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
            <ellipse cx={0} cy={-32} rx={headRadius * 1.35} ry={12} fill="#C28B58" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
            <rect x={-35} y={-38} width={70} height={8} fill="#78350F" />
          </g>
        )}

        {/* Sunglasses */}
        {hat === 'sunglasses' && (
          <g fill="#18181B" stroke={DOODLE_STROKE} strokeWidth={4}>
            <polygon points="-32,-15 -6,-15 -10,3 -28,3" />
            <polygon points="6,-15 32,-15 28,3 10,3" />
            <line x1={-6} y1={-10} x2={6} y2={-10} stroke={DOODLE_STROKE} strokeWidth={4} />
          </g>
        )}
      </g>
    </g>
  );
};
