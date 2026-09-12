import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DOODLE_STROKE, DOODLE_WIDTH, DoodleSun } from '../../animated-story/DoodleElements';

/**
 * 🏷️ Clean, Punchy Story Label (1-3 words max)
 * Exact reference style: Hand-drawn look, zero blur, optional curved arrow pointing to subject
 */
export const StoryLabel: React.FC<{
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  arrowTo?: { x: number; y: number };
  arrowCurve?: 'left' | 'right';
}> = ({
  text,
  x,
  y,
  fontSize = 36,
  color = '#18181B',
  arrowTo,
  arrowCurve = 'right',
}) => {
  return (
    <g>
      {/* Label Text */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        fontSize={fontSize}
        fontFamily="'Comic Sans MS', 'Chalkboard SE', 'Patrick Hand', 'Comic Neue', cursive, sans-serif"
        fontWeight="bold"
        fill={color}
        letterSpacing="1px"
      >
        {text}
      </text>

      {/* Hand-drawn curved arrow pointing to target */}
      {arrowTo && (
        <g stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {arrowCurve === 'right' ? (
            <path
              d={`M ${x} ${y + 8} Q ${(x + arrowTo.x) / 2 + 25} ${(y + arrowTo.y) / 2} ${arrowTo.x} ${arrowTo.y}`}
            />
          ) : (
            <path
              d={`M ${x} ${y + 8} Q ${(x + arrowTo.x) / 2 - 25} ${(y + arrowTo.y) / 2} ${arrowTo.x} ${arrowTo.y}`}
            />
          )}
          {/* Arrowhead */}
          <path
            d={`M ${arrowTo.x - 8} ${arrowTo.y - 12} L ${arrowTo.x} ${arrowTo.y} L ${arrowTo.x + 10} ${arrowTo.y - 10}`}
          />
        </g>
      )}
    </g>
  );
};

/**
 * ☀️ Summer Sky & Ground Horizon Environment (Exact Reference Video Style)
 * Sky blue top half + warm sand earth bottom half with hand-drawn horizon line & animated sun.
 */
export const SummerSkyGroundEnv: React.FC<{
  skyColor?: string;
  groundColor?: string;
  horizonY?: number;
  showSun?: boolean;
  sunX?: number;
  sunY?: number;
  sunAngry?: boolean;
  showClouds?: boolean;
  showHills?: boolean;
  showVillageCluster?: boolean;
  children?: React.ReactNode;
}> = ({
  skyColor = '#38BDF8', // Cyan / Sky Blue matching reference
  groundColor = '#D4A373', // Warm Mediterranean Sand
  horizonY = 520,
  showSun = true,
  sunX = 1650,
  sunY = 160,
  sunAngry = false,
  showClouds = true,
  showHills = false,
  showVillageCluster = false,
  children,
}) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
      {/* 1. Sky */}
      <rect x={0} y={0} width={1920} height={horizonY} fill={skyColor} />

      {/* 1b. Fluffy White Clouds if enabled */}
      {showClouds && (
        <g fill="#FFFFFF" opacity={0.85} stroke={DOODLE_STROKE} strokeWidth={3}>
          {/* Cloud 1 left */}
          <g transform="translate(240, 140) scale(0.8)">
            <ellipse cx={0} cy={0} rx={60} ry={30} />
            <ellipse cx={-35} cy={10} rx={45} ry={25} />
            <ellipse cx={35} cy={10} rx={45} ry={25} />
          </g>
          {/* Cloud 2 center */}
          <g transform="translate(980, 110) scale(0.65)">
            <ellipse cx={0} cy={0} rx={55} ry={28} />
            <ellipse cx={-30} cy={8} rx={40} ry={22} />
            <ellipse cx={30} cy={8} rx={40} ry={22} />
          </g>
        </g>
      )}

      {/* 1c. Rolling distant hills if enabled */}
      {showHills && (
        <g fill="#A8A29E" opacity={0.4} stroke={DOODLE_STROKE} strokeWidth={3}>
          <path d={`M 0 ${horizonY} Q 350 ${horizonY - 90} 700 ${horizonY} T 1400 ${horizonY} T 1920 ${horizonY} L 1920 ${horizonY} L 0 ${horizonY} Z`} />
        </g>
      )}

      {/* 1d. Distant Village Cluster on horizon (like ref_15s.jpg) */}
      {showVillageCluster && (
        <g stroke={DOODLE_STROKE} strokeWidth={4} strokeLinejoin="round">
          {/* Left cluster */}
          <rect x={180} y={horizonY - 70} width={60} height={70} fill="#FFFFFF" />
          <rect x={200} y={horizonY - 35} width={20} height={35} fill="#18181B" />

          <rect x={235} y={horizonY - 90} width={75} height={90} fill="#FFFFFF" />
          <path d={`M 245 ${horizonY - 90} Q 272 ${horizonY - 120} 300 ${horizonY - 90} Z`} fill="#1D4ED8" />
          <rect x={262} y={horizonY - 40} width={22} height={40} fill="#18181B" />

          <rect x={305} y={horizonY - 60} width={55} height={60} fill="#FFFFFF" />
          <rect x={322} y={horizonY - 30} width={18} height={30} fill="#18181B" />

          {/* Right cluster */}
          <rect x={1550} y={horizonY - 65} width={65} height={65} fill="#FFFFFF" />
          <rect x={1572} y={horizonY - 32} width={20} height={32} fill="#18181B" />

          <rect x={1610} y={horizonY - 85} width={70} height={85} fill="#FFFFFF" />
          <path d={`M 1618 ${horizonY - 85} Q 1645 ${horizonY - 115} 1672 ${horizonY - 85} Z`} fill="#1D4ED8" />

          <rect x={1675} y={horizonY - 55} width={50} height={55} fill="#FFFFFF" />
        </g>
      )}

      {/* 2. Ground */}
      <rect x={0} y={horizonY} width={1920} height={1080 - horizonY} fill={groundColor} />

      {/* 3. Horizon Doodle Line */}
      <line
        x1={-10}
        y1={horizonY}
        x2={1930}
        y2={horizonY}
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
        strokeLinecap="round"
      />

      {/* 4. Sun */}
      {showSun && (
        <DoodleSun x={sunX} y={sunY} size={95} angry={sunAngry} pulse />
      )}

      {/* Content */}
      {children}
    </svg>
  );
};

/**
 * 🏘️ Full Mediterranean Island Village Backdrop (Reference Video Style)
 * Hand-drawn cluster of white cubic dwellings, Aegean blue domes, olive/palm trees.
 */
export const MediterraneanVillageBackdrop: React.FC<{
  skyColor?: string;
  showPalms?: boolean;
  children?: React.ReactNode;
}> = ({
  skyColor = '#2563EB', // Deep Aegean Blue
  showPalms = true,
  children,
}) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
      {/* 1. Sky */}
      <rect x={0} y={0} width={1920} height={520} fill={skyColor} />

      {/* 2. Ground / Plaza */}
      <rect x={0} y={520} width={1920} height={560} fill="#E2B170" />

      {/* 3. Village Architecture Silhouette across horizon */}
      <g stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH - 1} strokeLinejoin="round">
        {/* House Cluster 1 */}
        <rect x={80} y={280} width={140} height={240} fill="#FFFFFF" />
        <path d="M 80 280 Q 150 180 220 280 Z" fill="#1D4ED8" />
        <rect x={120} y={400} width={40} height={70} fill="#1D4ED8" />
        <rect x={175} y={320} width={30} height={40} fill="#1D4ED8" />

        {/* House Cluster 2 */}
        <rect x={240} y={340} width={170} height={180} fill="#FFFFFF" />
        <rect x={280} y={370} width={36} height={45} fill="#1D4ED8" />
        <rect x={340} y={370} width={36} height={45} fill="#1D4ED8" />
        <rect x={300} y={450} width={45} height={70} fill="#1E293B" />

        {/* House Cluster 3 (Central Church with Grand Dome) */}
        <rect x={430} y={230} width={260} height={290} fill="#FFFFFF" />
        <path d="M 470 230 Q 560 120 650 230 Z" fill="#1D4ED8" />
        {/* Cross on dome */}
        <line x1={560} y1={120} x2={560} y2={90} stroke="#18181B" strokeWidth={5} />
        <line x1={545} y1={105} x2={575} y2={105} stroke="#18181B" strokeWidth={5} />
        {/* Arch portal */}
        <path d="M 525 520 L 525 430 Q 560 390 595 430 L 595 520 Z" fill="#1D4ED8" />
        <rect x={465} y={280} width={35} height={50} fill="#1D4ED8" />
        <rect x={620} y={280} width={35} height={50} fill="#1D4ED8" />

        {/* House Cluster 4 (Connecting Arched Bridge) */}
        <rect x={710} y={320} width={160} height={200} fill="#FFFFFF" />
        <path d="M 740 520 L 740 420 Q 790 370 840 420 L 840 520 Z" fill="#E2B170" />

        {/* House Cluster 5 */}
        <rect x={890} y={260} width={190} height={260} fill="#FFFFFF" />
        <path d="M 910 260 Q 985 160 1060 260 Z" fill="#1D4ED8" />
        <rect x={940} y={430} width={40} height={90} fill="#1D4ED8" />
        <rect x={1010} y={320} width={45} height={55} fill="#1D4ED8" />

        {/* House Cluster 6 */}
        <rect x={1100} y={340} width={160} height={180} fill="#FFFFFF" />
        <rect x={1140} y={370} width={35} height={45} fill="#1D4ED8" />
        <rect x={1200} y={370} width={35} height={45} fill="#1D4ED8" />
        <rect x={1160} y={450} width={45} height={70} fill="#18181B" />

        {/* House Cluster 7 (Terrace & Bell Tower) */}
        <rect x={1280} y={240} width={220} height={280} fill="#FFFFFF" />
        <path d="M 1320 240 Q 1390 150 1460 240 Z" fill="#1D4ED8" />
        <rect x={1365} y={420} width={50} height={100} fill="#1D4ED8" />
        <rect x={1320} y={290} width={35} height={50} fill="#1D4ED8" />
        <rect x={1435} y={290} width={35} height={50} fill="#1D4ED8" />

        {/* House Cluster 8 */}
        <rect x={1520} y={320} width={180} height={200} fill="#FFFFFF" />
        <rect x={1560} y={360} width={40} height={50} fill="#1D4ED8" />
        <rect x={1620} y={360} width={40} height={50} fill="#1D4ED8" />
        <rect x={1580} y={440} width={50} height={80} fill="#1D4ED8" />

        {/* House Cluster 9 */}
        <rect x={1720} y={280} width={160} height={240} fill="#FFFFFF" />
        <path d="M 1720 280 Q 1800 190 1880 280 Z" fill="#1D4ED8" />
        <rect x={1770} y={430} width={45} height={90} fill="#18181B" />
      </g>

      {/* Palm / Olive Trees on sides */}
      {showPalms && (
        <g stroke={DOODLE_STROKE} strokeWidth={4} strokeLinejoin="round">
          {/* Left Palm Tree */}
          <path d="M 45 530 Q 55 420 50 360" fill="none" strokeWidth={10} stroke="#78350F" />
          <path d="M 50 360 Q 20 330 -10 350 Q 25 350 50 360" fill="#15803D" />
          <path d="M 50 360 Q 30 300 20 270 Q 40 310 50 360" fill="#16A34A" />
          <path d="M 50 360 Q 70 300 90 280 Q 75 320 50 360" fill="#16A34A" />
          <path d="M 50 360 Q 85 335 120 360 Q 80 355 50 360" fill="#15803D" />

          {/* Right Palm Tree */}
          <path d="M 1880 530 Q 1870 420 1875 360" fill="none" strokeWidth={10} stroke="#78350F" />
          <path d="M 1875 360 Q 1845 330 1815 350 Q 1850 350 1875 360" fill="#15803D" />
          <path d="M 1875 360 Q 1855 300 1845 270 Q 1865 310 1875 360" fill="#16A34A" />
          <path d="M 1875 360 Q 1895 300 1915 280 Q 1900 320 1875 360" fill="#16A34A" />
        </g>
      )}

      {/* Horizon Line */}
      <line x1={0} y1={520} x2={1920} y2={520} stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />

      {/* Children content (stick figures, tourists, etc.) */}
      {children}
    </svg>
  );
};

/**
 * 🚗 Parking Lot Environment (Reference Style for Black Car / Heat absorption)
 */
export const ParkingLotEnv: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
      {/* Sky */}
      <rect x={0} y={0} width={1920} height={420} fill="#38BDF8" />
      <DoodleSun x={1650} y={150} size={110} angry pulse />

      {/* Distant skyline / trees */}
      <rect x={0} y={380} width={1920} height={40} fill="#65A30D" />
      <line x1={0} y1={420} x2={1920} y2={420} stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />

      {/* Asphalt Ground */}
      <rect x={0} y={420} width={1920} height={660} fill="#334155" />

      {/* Yellow Parking Bay Lines */}
      <g stroke="#FBBF24" strokeWidth={8} strokeDasharray="30 20">
        <line x1={200} y1={440} x2={350} y2={750} />
        <line x1={600} y1={440} x2={750} y2={750} />
        <line x1={1000} y1={440} x2={1150} y2={750} />
        <line x1={1400} y1={440} x2={1550} y2={750} />
        <line x1={1800} y1={440} x2={1950} y2={750} />
      </g>

      {children}
    </svg>
  );
};

/**
 * 📜 Peeling Postcard Reveal Scene (Reference Style: ref_60s.jpg)
 * Hand peels back tourist postcard to reveal underlying machinery & science!
 */
export const PeelingPostcardScene: React.FC<{
  peelProgress: number; // 0 to 1
}> = ({ peelProgress }) => {
  const cornerX = interpolate(peelProgress, [0, 1], [1480, 520]);
  const cornerY = interpolate(peelProgress, [0, 1], [820, 260]);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
      {/* Background Desk Surface */}
      <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />

      {/* Underneath Layer: Dark Technical Machinery & Science */}
      <g transform="translate(960, 540)">
        {/* Dark Tech Baseboard */}
        <rect
          x={-560}
          y={-320}
          width={1120}
          height={640}
          rx={16}
          fill="#1E293B"
          stroke="#475569"
          strokeWidth={6}
        />

        {/* Technical Grid Lines */}
        <g stroke="#334155" strokeWidth={2}>
          {[-400, -200, 0, 200, 400].map((gx) => (
            <line key={`gx-${gx}`} x1={gx} y1={-320} x2={gx} y2={320} />
          ))}
          {[-200, -100, 0, 100, 200].map((gy) => (
            <line key={`gy-${gy}`} x1={-560} y1={gy} x2={560} y2={gy} />
          ))}
        </g>

        {/* Machinery Icons Underneath: Gears, Heat Physics, Power, Chemistry */}
        <g stroke="#E2E8F0" strokeWidth={5} fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Interlocking Gears */}
          <g transform="translate(180, -80)">
            <circle cx={0} cy={0} r={50} stroke="#94A3B8" strokeWidth={8} strokeDasharray="16 10" />
            <circle cx={0} cy={0} r={22} fill="#334155" />
            <circle cx={70} cy={60} r={35} stroke="#94A3B8" strokeWidth={7} strokeDasharray="14 8" />
            <circle cx={70} cy={60} r={14} fill="#334155" />
          </g>

          {/* Energy Heat Vector Arrows */}
          <g transform="translate(240, 140)">
            <line x1={-60} y1={40} x2={60} y2={-40} stroke="#F59E0B" strokeWidth={6} />
            <polygon points="60,-40 40,-35 48,-52" fill="#F59E0B" />
            <line x1={-80} y1={10} x2={40} y2={-70} stroke="#EF4444" strokeWidth={6} />
            <polygon points="40,-70 20,-65 28,-82" fill="#EF4444" />
          </g>

          {/* Limestone Formula CaCO3 -> CaO */}
          <text
            x={120}
            y={240}
            fill="#38BDF8"
            fontSize={26}
            fontWeight="bold"
            fontFamily="monospace"
          >
            CaCO₃ + Heat → CaO + CO₂
          </text>
        </g>
      </g>

      {/* Top Postcard Layer with Peeling Curl */}
      <g transform="translate(960, 540)">
        {/* Clip path for the peeled un-curled section */}
        <defs>
          <clipPath id="peel-clip">
            <polygon
              points={`-560,-320 560,-320 560,${cornerY - 540} ${cornerX - 960},320 -560,320`}
            />
          </clipPath>
        </defs>

        {/* Postcard Body (Clipped by peel) */}
        <g clipPath="url(#peel-clip)">
          <rect
            x={-560}
            y={-320}
            width={1120}
            height={640}
            rx={16}
            fill="#FFFFFF"
            stroke={DOODLE_STROKE}
            strokeWidth={8}
          />
          {/* Postcard Scenic Village View */}
          <rect x={-530} y={-290} width={1060} height={340} fill="#38BDF8" />
          <path d="M -530 50 Q 0 -50 530 20 L 530 290 L -530 290 Z" fill="#E2B170" />
          {/* Postcard white houses */}
          <rect x={-400} y={-100} width={120} height={150} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
          <path d="M -400 -100 Q -340 -160 -280 -100 Z" fill="#1D4ED8" stroke={DOODLE_STROKE} strokeWidth={4} />
          <rect x={-220} y={-60} width={140} height={120} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
          <path d="M -220 -60 Q -150 -120 -80 -60 Z" fill="#1D4ED8" stroke={DOODLE_STROKE} strokeWidth={4} />
          <DoodleSun x={420} y={-180} size={70} />

          {/* Postcard Greeting Text */}
          <text
            x={-500}
            y={240}
            fontSize={42}
            fontFamily="'Comic Sans MS', cursive, sans-serif"
            fontWeight="bold"
            fill="#1E3A8A"
          >
            GREETINGS FROM GREECE
          </text>
          {/* Stamp */}
          <rect x={420} y={160} width={80} height={100} fill="#FEE2E2" stroke="#EF4444" strokeWidth={3} strokeDasharray="6 4" />
          <circle cx={460} cy={210} r={25} fill="none" stroke="#DC2626" strokeWidth={3} />
        </g>

        {/* The Folded / Peeling White Paper Backside */}
        <polygon
          points={`560,${cornerY - 540} ${cornerX - 960},320 560,320`}
          fill="#F1F5F9"
          stroke={DOODLE_STROKE}
          strokeWidth={6}
        />
        {/* Peel Shadow */}
        <line
          x1={560}
          y1={cornerY - 540}
          x2={cornerX - 960}
          y2={320}
          stroke="#94A3B8"
          strokeWidth={8}
          strokeLinecap="round"
        />

        {/* Stickman Hand Peeling the corner */}
        <g transform={`translate(${cornerX - 960 + 20}, ${320})`}>
          <path
            d="M 60 120 L 20 20 Q 0 -10 -20 0 Q -30 10 -20 30 L 10 90"
            fill="#18181B"
            stroke="#18181B"
            strokeWidth={4}
          />
          {/* Fingers clutching edge */}
          <circle cx={-15} cy={10} r={12} fill="#18181B" />
          <circle cx={-5} cy={-5} r={12} fill="#18181B" />
          <circle cx={10} cy={-12} r={12} fill="#18181B" />
        </g>
      </g>
    </svg>
  );
};
