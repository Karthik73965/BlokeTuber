import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DOODLE_STROKE, DOODLE_WIDTH } from '../../animated-story/DoodleElements';

/**
 * Vintage Postcard Frame with Postage Stamp & Cancel Mark
 */
export const PostcardFrame: React.FC<{
  x: number;
  y: number;
  width?: number;
  height?: number;
  label?: string;
  children?: React.ReactNode;
}> = ({ x, y, width = 900, height = 540, label = 'GREETINGS FROM GREECE', children }) => {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Postcard Body */}
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        rx={16}
        fill="#FCF9F2"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />
      {/* Dashed Border Inner */}
      <rect
        x={20}
        y={20}
        width={width - 40}
        height={height - 40}
        rx={10}
        fill="none"
        stroke="#D4C5B0"
        strokeWidth={3}
        strokeDasharray="12,12"
      />
      {/* Stamp Top Right */}
      <g transform={`translate(${width - 130}, 35)`}>
        <rect x={0} y={0} width={90} height={110} rx={4} fill="#EFF6FF" stroke={DOODLE_STROKE} strokeWidth={4} />
        <circle cx={45} cy={45} r={28} fill="#3B82F6" opacity={0.3} />
        <text x={45} y={52} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#1E3A8A">
          HELLAS
        </text>
        <text x={45} y={92} textAnchor="middle" fontSize={14} fill="#64748B">
          1938
        </text>
      </g>
      {/* Content Slot */}
      <g transform="translate(40, 40)">{children}</g>
      {/* Postcard Ribbon Label */}
      <g transform={`translate(${width / 2}, ${height - 25})`}>
        <rect x={-220} y={-30} width={440} height={50} rx={8} fill="#1E293B" stroke={DOODLE_STROKE} strokeWidth={4} />
        <text x={0} y={4} textAnchor="middle" fontSize={24} fontWeight="bold" fill="#FFFFFF" letterSpacing="2">
          {label}
        </text>
      </g>
    </g>
  );
};

/**
 * Raw Limestone Rock & Kiln
 */
export const LimestoneToLime: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  const frame = useCurrentFrame();
  const flamePulse = 1 + Math.sin(frame * 0.2) * 0.1;

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* 1. Raw Limestone Rock */}
      <g stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH - 2} fill="#E2DCD2">
        <path d="M 40 160 L 100 80 L 190 70 L 260 120 L 250 200 L 170 230 L 60 210 Z" />
        <text x={150} y={155} textAnchor="middle" fontSize={22} fontWeight="bold" fill="#57534E">
          LIMESTONE
        </text>
        <text x={150} y={185} textAnchor="middle" fontSize={18} fill="#78716C">
          CaCO₃
        </text>
      </g>

      {/* Plus Arrow */}
      <path
        d="M 290 150 L 370 150 M 350 130 L 375 150 L 350 170"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 2. Kiln Oven with Fire */}
      <g transform="translate(410, 50)" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH - 2}>
        {/* Kiln Chimney / Body */}
        <path d="M 40 180 L 70 40 L 170 40 L 200 180 Z" fill="#B45309" />
        <rect x={85} y={100} width={70} height={80} rx={35} fill="#451A03" />
        {/* Fire inside */}
        <path
          d="M 100 170 Q 120 110 120 125 Q 120 110 140 170 Z"
          fill="#F59E0B"
          transform={`scale(${flamePulse}) translate(${flamePulse > 1 ? -12 : 0}, 0)`}
        />
        <text x={120} y={25} textAnchor="middle" fontSize={22} fontWeight="bold" fill="#B45309">
          KILN HEAT (900°C)
        </text>
      </g>

      {/* Plus Arrow */}
      <path
        d="M 650 150 L 730 150 M 710 130 L 735 150 L 710 170"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* 3. Water + Lime Bucket = White Wash */}
      <g transform="translate(770, 60)" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH - 2}>
        <path d="M 40 90 L 60 200 L 160 200 L 180 90 Z" fill="#F8FAFC" />
        {/* Bucket Rim & Handle */}
        <ellipse cx={110} cy={90} rx={70} ry={20} fill="#E2E8F0" />
        <path d="M 40 90 Q 110 20 180 90" fill="none" strokeWidth={5} />
        {/* White Wash liquid */}
        <ellipse cx={110} cy={92} rx={60} ry={16} fill="#FFFFFF" stroke="#CBD5E1" strokeWidth={3} />
        {/* Paint brush resting */}
        <g transform="rotate(35 140 70)">
          <rect x={135} y={10} width={18} height={120} rx={4} fill="#B45309" stroke={DOODLE_STROKE} strokeWidth={4} />
          <rect x={130} y={120} width={28} height={40} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
        </g>
        <text x={110} y={235} textAnchor="middle" fontSize={22} fontWeight="900" fill="#0284C7">
          LIME WASH
        </text>
        <text x={110} y={260} textAnchor="middle" fontSize={18} fill="#64748B">
          (Quicklime + Water)
        </text>
      </g>
    </g>
  );
};

/**
 * Microscope Circular View: Bacteria Disinfection by Lime Wash
 */
export const MicroscopeDisinfection: React.FC<{
  x: number;
  y: number;
  radius?: number;
  disinfectProgress?: number; // 0 to 1
}> = ({ x, y, radius = 220, disinfectProgress = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Outer Metal Ring */}
      <circle cx={0} cy={0} r={radius + 20} fill="#1E293B" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
      {/* Lens Inner Glass */}
      <circle cx={0} cy={0} r={radius} fill="#F0FDF4" stroke={DOODLE_STROKE} strokeWidth={5} />

      {/* Grid lines / Crosshairs */}
      <line x1={-radius} y1={0} x2={radius} y2={0} stroke="#86EFAC" strokeWidth={2} strokeDasharray="8,8" />
      <line x1={0} y1={-radius} x2={0} y2={radius} stroke="#86EFAC" strokeWidth={2} strokeDasharray="8,8" />

      {/* Cholera / Bacteria microbes */}
      {[-80, -30, 40, 90, -110, 60, -40].map((bx, i) => {
        const by = [50, -80, -60, 40, -20, 100, 110][i];
        const rot = (frame * 2 + i * 45) % 360;
        const opacity = Math.max(0, 1 - disinfectProgress * 1.5 - (i * 0.1));
        const deadScale = 1 - disinfectProgress * 0.6;

        return (
          <g
            key={i}
            transform={`translate(${bx}, ${by}) rotate(${rot}) scale(${deadScale})`}
            opacity={opacity}
            stroke={DOODLE_STROKE}
            strokeWidth={3}
            fill="#EF4444"
          >
            {/* Vibrio rod shape with curved tail */}
            <path d="M -16 -6 C -6 -12 12 -10 16 0 C 12 10 -6 12 -16 6 Z" />
            <path d="M 16 0 Q 28 8 36 -2" fill="none" stroke="#DC2626" strokeWidth={2} />
          </g>
        );
      })}

      {/* Spreading White Lime Alkaline Wave */}
      {disinfectProgress > 0 && (
        <g opacity={disinfectProgress}>
          <circle
            cx={0}
            cy={0}
            r={radius * disinfectProgress}
            fill="#FFFFFF"
            opacity={0.7}
            stroke="#38BDF8"
            strokeWidth={4}
            strokeDasharray="8,6"
          />
          {/* Sparkles of sanitization */}
          {[
            [-40, -40],
            [60, -30],
            [-50, 60],
            [50, 70],
            [0, -90],
          ].map(([sx, sy], i) => (
            <g key={i} transform={`translate(${sx}, ${sy}) scale(${disinfectProgress})`}>
              <path d="M 0 -15 L 4 -4 L 15 0 L 4 4 L 0 15 L -4 4 L -15 0 L -4 -4 Z" fill="#FDE047" stroke={DOODLE_STROKE} strokeWidth={2} />
            </g>
          ))}
        </g>
      )}

      {/* Badge Overlay */}
      <g transform="translate(0, 150)">
        <rect x={-140} y={-24} width={280} height={48} rx={10} fill="#15803D" stroke={DOODLE_STROKE} strokeWidth={4} />
        <text x={0} y={8} textAnchor="middle" fontSize={22} fontWeight="900" fill="#FFFFFF">
          {disinfectProgress > 0.6 ? 'SURFACE SANITIZED ✓' : 'ANTIBACTERIAL (pH 12+)'}
        </text>
      </g>
    </g>
  );
};

/**
 * Official Royal / Dictatorship Greek Decree Scroll
 */
export const GreekDecree: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Scroll Background */}
      <path
        d="M 20 40 
           Q 20 10 50 10 L 380 10 
           Q 410 10 410 40 L 410 500 
           Q 410 530 380 530 L 50 530 
           Q 20 530 20 500 Z"
        fill="#FEF3C7"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />
      {/* Rolled ends */}
      <rect x={10} y={6} width={410} height={20} rx={10} fill="#FDE68A" stroke={DOODLE_STROKE} strokeWidth={4} />
      <rect x={10} y={514} width={410} height={20} rx={10} fill="#FDE68A" stroke={DOODLE_STROKE} strokeWidth={4} />

      {/* Royal / Government Seal */}
      <circle cx={215} cy={90} r={40} fill="#DC2626" stroke={DOODLE_STROKE} strokeWidth={4} />
      <text x={215} y={98} textAnchor="middle" fontSize={28} fontWeight="900" fill="#FFFFFF">
        1938
      </text>

      {/* Headline */}
      <text x={215} y={165} textAnchor="middle" fontSize={24} fontWeight="900" fill="#78350F">
        GOVERNMENT DECREE
      </text>
      <text x={215} y={195} textAnchor="middle" fontSize={18} fontWeight="bold" fill="#92400E">
        KINGDOM OF GREECE
      </text>
      <line x1={70} y1={210} x2={360} y2={210} stroke="#D97706" strokeWidth={3} />

      {/* Body lines */}
      <text x={215} y={250} textAnchor="middle" fontSize={20} fontWeight="bold" fill="#1C1917">
        MANDATORY WHITEWASH
      </text>
      <text x={215} y={285} textAnchor="middle" fontSize={16} fill="#44403C">
        All residences, walls, alleys & plazas
      </text>
      <text x={215} y={315} textAnchor="middle" fontSize={16} fill="#44403C">
        must be coated in fresh lime wash
      </text>
      <text x={215} y={345} textAnchor="middle" fontSize={16} fill="#44403C">
        to control Cholera outbreaks.
      </text>

      {/* Stamp Stamp */}
      <g transform="translate(290, 410) rotate(-15)">
        <rect x={-70} y={-24} width={140} height={48} rx={6} fill="none" stroke="#DC2626" strokeWidth={5} />
        <text x={0} y={8} textAnchor="middle" fontSize={20} fontWeight="900" fill="#DC2626">
          ENFORCED
        </text>
      </g>
    </g>
  );
};

/**
 * Communal Painting: Hand-drawn whitewash brush stroke on wall
 */
export const WallPaintStroke: React.FC<{
  x: number;
  y: number;
  progress?: number; // 0 to 1
  width?: number;
  height?: number;
}> = ({ x, y, progress = 1, width = 700, height = 450 }) => {
  const currentW = width * Math.min(1, Math.max(0, progress));

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* 1. Base Dark Stone / Mudbrick Wall */}
      <rect x={0} y={0} width={width} height={height} rx={12} fill="#785E48" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
      
      {/* Brick mortar lines */}
      <g stroke="#534030" strokeWidth={4}>
        {[80, 160, 240, 320, 400].map((by) => (
          <line key={by} x1={0} y1={by} x2={width} y2={by} />
        ))}
        <line x1={150} y1={0} x2={150} y2={80} />
        <line x1={450} y1={0} x2={450} y2={80} />
        <line x1={300} y1={80} x2={300} y2={160} />
        <line x1={600} y1={80} x2={600} y2={160} />
        <line x1={180} y1={160} x2={180} y2={240} />
        <line x1={480} y1={160} x2={480} y2={240} />
        <line x1={320} y1={240} x2={320} y2={320} />
        <line x1={150} y1={320} x2={150} y2={400} />
      </g>

      {/* 2. Dazzling White Paint Layer Over Dark Wall */}
      {currentW > 0 && (
        <g clipPath="url(#paint-clip)">
          <defs>
            <clipPath id="paint-clip">
              <rect x={0} y={0} width={currentW} height={height} />
            </clipPath>
          </defs>
          <rect x={0} y={0} width={width} height={height} fill="#FFFFFF" />
          {/* Paint brush texture bristles */}
          <line x1={currentW} y1={0} x2={currentW} y2={height} stroke={DOODLE_STROKE} strokeWidth={6} strokeLinecap="round" />
        </g>
      )}

      {/* Label */}
      <g transform={`translate(${width / 2}, ${height + 40})`}>
        <text x={0} y={0} textAnchor="middle" fontSize={26} fontWeight="900" fill="#18181B">
          {progress >= 1 ? 'DAZZLING WHITE SHIELD (REFLECTS 90%+ SUN)' : 'APPLYING LIMEWASH OVER DARK STONE'}
        </text>
      </g>
    </g>
  );
};
