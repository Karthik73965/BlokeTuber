import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { DOODLE_STROKE, DOODLE_WIDTH } from './DoodleElements';

/**
 * Hand-drawn Cartoon Cloud
 */
export const DoodleCloud: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      <path
        d="M 30 50 
           Q 20 25 50 20 
           Q 70 0 100 15 
           Q 130 -5 160 20 
           Q 190 20 190 50 
           Q 210 65 190 85 
           Q 180 100 150 95 
           Q 120 105 80 95 
           Q 40 105 20 85 
           Q 0 65 30 50 Z"
        fill="#FFFFFF"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH - 2}
        strokeLinejoin="round"
      />
    </g>
  );
};

/**
 * Hand-drawn Saguaro Cactus
 */
export const DoodleCactus: React.FC<{
  x: number;
  y: number;
  scale?: number;
}> = ({ x, y, scale = 1 }) => {
  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Trunk */}
      <path
        d="M 25 140 L 25 30 Q 35 15 45 30 L 45 140 Z"
        fill="#5EA866"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH - 2}
        strokeLinejoin="round"
      />
      {/* Left Arm */}
      <path
        d="M 25 90 L 5 90 Q -5 90 -5 70 L -5 45 Q 0 35 10 45 L 10 75 L 25 75 Z"
        fill="#5EA866"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH - 2}
        strokeLinejoin="round"
      />
      {/* Right Arm */}
      <path
        d="M 45 110 L 65 110 Q 75 110 75 90 L 75 60 Q 70 50 60 60 L 60 95 L 45 95 Z"
        fill="#5EA866"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH - 2}
        strokeLinejoin="round"
      />
      {/* Prickles / Rib lines */}
      <line x1={35} y1={35} x2={35} y2={130} stroke="#3D7B43" strokeWidth={3} strokeDasharray="6,8" />
    </g>
  );
};

/**
 * Grass Tuft
 */
export const DoodleGrassTuft: React.FC<{ x: number; y: number; scale?: number }> = ({
  x,
  y,
  scale = 1,
}) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} stroke={DOODLE_STROKE} strokeWidth={4} strokeLinecap="round">
    <line x1={0} y1={0} x2={-10} y2={-20} />
    <line x1={0} y1={0} x2={0} y2={-26} />
    <line x1={0} y1={0} x2={10} y2={-18} />
  </g>
);

/**
 * 🏜️ Desert Landscape Environment (Exact Inkly Style)
 * Soft warm sky, rolling dunes, distant mudbrick huts, cactuses, sun.
 */
export const DesertEnvironment: React.FC<{
  showCactus?: boolean;
  showDwellings?: boolean;
}> = ({ showCactus = true, showDwellings = true }) => {
  return (
    <g id="desert-background">
      {/* 1. Sky */}
      <rect x={-100} y={-100} width={2120} height={700} fill="#FFF9ED" />

      {/* 2. Distant Horizon Dunes */}
      <path
        d="M -100 520 Q 300 480 700 510 T 1500 490 T 2120 520 L 2120 620 L -100 620 Z"
        fill="#E8BA73"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH - 2}
      />

      {/* 3. Distant Desert Dwellings / Mudbrick Huts */}
      {showDwellings && (
        <g stroke={DOODLE_STROKE} strokeWidth={4} strokeLinejoin="round" fill="#C98B4B">
          {/* Small settlement left */}
          <rect x={180} y={470} width={45} height={35} rx={3} />
          <rect x={225} y={460} width={55} height={45} rx={3} />
          <rect x={245} y={485} width={12} height={20} fill="#623C1B" />
          
          {/* Small settlement right */}
          <rect x={1420} y={455} width={75} height={50} rx={4} />
          <rect x={1495} y={445} width={60} height={60} rx={4} />
          <rect x={1515} y={475} width={16} height={30} fill="#623C1B" />
          {/* Canopy awning */}
          <path d="M 1370 475 L 1420 470 L 1420 485 L 1370 490 Z" fill="#996633" />
          <line x1={1370} y1={475} x2={1370} y2={505} strokeWidth={4} />
        </g>
      )}

      {/* 4. Midground Dunes */}
      <path
        d="M -100 580 Q 450 540 950 610 T 1700 570 T 2120 620 L 2120 780 L -100 780 Z"
        fill="#F3CD8A"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH - 2}
      />

      {/* 5. Foreground Desert Ground */}
      <path
        d="M -100 720 Q 500 680 1100 720 T 2120 710 L 2120 1180 L -100 1180 Z"
        fill="#F9DC9F"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />

      {/* 6. Dune ridge shadows */}
      <path
        d="M 120 820 Q 320 740 560 840"
        fill="none"
        stroke={DOODLE_STROKE}
        strokeWidth={4}
        strokeLinecap="round"
      />
      <path
        d="M 1320 810 Q 1580 750 1840 830"
        fill="none"
        stroke={DOODLE_STROKE}
        strokeWidth={4}
        strokeLinecap="round"
      />

      {/* 7. Cactuses */}
      {showCactus && (
        <>
          <DoodleCactus x={160} y={640} scale={0.7} />
          <DoodleCactus x={1680} y={630} scale={0.8} />
          <DoodleCactus x={340} y={720} scale={0.5} />
          <DoodleCactus x={1520} y={730} scale={0.55} />
        </>
      )}
    </g>
  );
};

/**
 * 🌳 Countryside / Meadow Environment
 * Crisp blue sky, drifting clouds, rolling green hills, lush grass field with tufts.
 */
export const MeadowEnvironment: React.FC<{
  showClouds?: boolean;
}> = ({ showClouds = true }) => {
  const frame = useCurrentFrame();
  const cloud1X = 150 + ((frame * 0.4) % 1920);
  const cloud2X = 950 + ((frame * 0.25) % 1920);

  return (
    <g id="meadow-background">
      {/* 1. Sky */}
      <rect x={-100} y={-100} width={2120} height={700} fill="#A2D7F3" />

      {/* 2. Drifting Fluffy Clouds */}
      {showClouds && (
        <>
          <DoodleCloud x={cloud1X > 1920 ? cloud1X - 2200 : cloud1X} y={80} scale={1.1} />
          <DoodleCloud x={cloud2X > 1920 ? cloud2X - 2200 : cloud2X} y={130} scale={0.85} />
          <DoodleCloud x={600} y={190} scale={0.65} />
        </>
      )}

      {/* 3. Distant Mountains / Hills */}
      <path
        d="M -100 520 Q 350 430 850 490 T 1750 450 T 2120 500 L 2120 620 L -100 620 Z"
        fill="#7EB867"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH - 2}
      />

      {/* 4. Midground Rolling Hill */}
      <path
        d="M -100 580 Q 600 520 1300 590 T 2120 570 L 2120 720 L -100 720 Z"
        fill="#8DC774"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH - 2}
      />

      {/* 5. Foreground Green Grass Lawn */}
      <rect x={-100} y={670} width={2120} height={500} fill="#A0D880" />
      <line
        x1={-100}
        y1={670}
        x2={2120}
        y2={670}
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />

      {/* Grass Tufts */}
      <DoodleGrassTuft x={250} y={740} scale={1.1} />
      <DoodleGrassTuft x={500} y={850} scale={0.9} />
      <DoodleGrassTuft x={1250} y={760} scale={1.0} />
      <DoodleGrassTuft x={1600} y={880} scale={1.2} />
      <DoodleGrassTuft x={900} y={920} scale={0.8} />
    </g>
  );
};

/**
 * 🏘️ Mediterranean Village Hillside Environment
 * Whitewashed buildings, terracotta accents, blue domes, stone pathway.
 */
export const VillageEnvironment: React.FC = () => {
  return (
    <g id="village-background">
      {/* Sky */}
      <rect x={-100} y={-100} width={2120} height={600} fill="#B6E3F8" />
      <DoodleCloud x={180} y={70} scale={0.9} />
      <DoodleCloud x={1380} y={90} scale={0.8} />

      {/* Distant Sea/Horizon */}
      <rect x={-100} y={430} width={2120} height={120} fill="#5AA8E8" />
      <line x1={-100} y1={430} x2={2120} y2={430} stroke={DOODLE_STROKE} strokeWidth={4} />

      {/* Terraced Hillside & Village Silhouette */}
      <path
        d="M -100 550 Q 400 480 1000 530 T 2120 500 L 2120 1180 L -100 1180 Z"
        fill="#E8E2D5"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />

      {/* Background Village Houses */}
      <g stroke={DOODLE_STROKE} strokeWidth={5} strokeLinejoin="round">
        {/* House Cluster Left */}
        <rect x={120} y={420} width={90} height={90} fill="#FFFFFF" rx={4} />
        <path d="M 120 420 Q 165 380 210 420 Z" fill="#2563EB" />
        <rect x={150} y={465} width={28} height={45} fill="#94A3B8" />

        <rect x={220} y={440} width={110} height={80} fill="#FAF9F6" rx={4} />
        <rect x={220} y={430} width={110} height={14} fill="#EA580C" />
        <rect x={250} y={470} width={24} height={30} fill="#3B82F6" />
        <rect x={290} y={470} width={24} height={30} fill="#3B82F6" />

        {/* House Cluster Right */}
        <rect x={1550} y={410} width={120} height={90} fill="#FFFFFF" rx={4} />
        <path d="M 1550 410 Q 1610 365 1670 410 Z" fill="#2563EB" />
        <rect x={1595} y={450} width={30} height={50} fill="#94A3B8" />

        <rect x={1680} y={430} width={90} height={80} fill="#F8FAFC" rx={4} />
        <rect x={1680} y={420} width={90} height={14} fill="#E11D48" />
        <rect x={1710} y={460} width={26} height={50} fill="#1E293B" />
      </g>

      {/* Foreground Cobblestone Street */}
      <path
        d="M -100 700 Q 500 660 1100 690 T 2120 680 L 2120 1180 L -100 1180 Z"
        fill="#DDD6C8"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />
      {/* Subtle stone markings */}
      <ellipse cx={400} cy={820} rx={40} ry={15} fill="none" stroke="#BAAE9B" strokeWidth={4} />
      <ellipse cx={850} cy={870} rx={50} ry={18} fill="none" stroke="#BAAE9B" strokeWidth={4} />
      <ellipse cx={1450} cy={830} rx={45} ry={16} fill="none" stroke="#BAAE9B" strokeWidth={4} />
    </g>
  );
};
