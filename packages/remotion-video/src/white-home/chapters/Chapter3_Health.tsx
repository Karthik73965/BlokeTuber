import React from 'react';
import { Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  DOODLE_STROKE,
  DOODLE_WIDTH,
  DoodleCross,
  DoodleSparkle,
  DoodleSun,
  DoodleWhiteHouse,
} from '../../animated-story/DoodleElements';
import { DoodleStickman } from '../../animated-story/DoodleStickman';
import {
  MediterraneanVillageBackdrop,
  StoryLabel,
  SummerSkyGroundEnv,
} from '../shared/StoryEnvironments';
import {
  GreekDecree,
  MicroscopeDisinfection,
} from '../shared/WhiteHomeElements';

/**
 * Animated pH Scale Meter (0 to 14) showing extreme alkaline level (pH 12.4+)
 */
const PHScaleMeter: React.FC<{
  x: number;
  y: number;
  targetPH?: number;
  scale?: number;
}> = ({ x, y, targetPH = 12.4, scale = 1 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const needleSpring = spring({
    frame: Math.max(0, frame - 10),
    fps,
    config: { damping: 14, stiffness: 90 },
  });

  const currentPH = interpolate(needleSpring, [0, 1], [7.0, targetPH]);
  const needleX = interpolate(currentPH, [0, 14], [-240, 240]);

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Background Panel */}
      <rect
        x={-280}
        y={-90}
        width={560}
        height={185}
        rx={16}
        fill="#FFFFFF"
        stroke={DOODLE_STROKE}
        strokeWidth={5}
      />

      {/* Header */}
      <text
        x={0}
        y={-55}
        textAnchor="middle"
        fontSize={22}
        fontWeight="900"
        fill={DOODLE_STROKE}
        letterSpacing="1"
      >
        ALKALINITY SPECTRUM (pH SCALE)
      </text>

      {/* pH Track Bar with Gradient Zones */}
      <g transform="translate(0, -15)">
        {/* Acidic Zone (0-6) */}
        <rect x={-240} y={-15} width={180} height={30} fill="#F87171" rx={4} />
        {/* Neutral Zone (7) */}
        <rect x={-60} y={-15} width={40} height={30} fill="#34D399" />
        {/* Mild Alkaline Zone (8-11) */}
        <rect x={-20} y={-15} width={140} height={30} fill="#38BDF8" />
        {/* Extreme Alkaline Zone (12-14) */}
        <rect x={120} y={-15} width={120} height={30} fill="#818CF8" rx={4} />

        {/* Outline of track */}
        <rect
          x={-240}
          y={-15}
          width={480}
          height={30}
          rx={6}
          fill="none"
          stroke={DOODLE_STROKE}
          strokeWidth={4}
        />

        {/* Zone Labels inside track bars */}
        <text x={-150} y={5} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#7F1D1D">
          ACIDIC (0–6)
        </text>
        <text x={-40} y={5} textAnchor="middle" fontSize={11} fontWeight="bold" fill="#065F46">
          pH 7
        </text>
        <text x={50} y={5} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#0369A1">
          MILD (8–11)
        </text>
        <text x={180} y={5} textAnchor="middle" fontSize={12} fontWeight="bold" fill="#312E81">
          ALKALINE (12+)
        </text>
      </g>

      {/* Animated Indicator Needle */}
      <g transform={`translate(${needleX}, -15)`}>
        <polygon points="0,-18 -10,-38 10,-38" fill="#DC2626" stroke={DOODLE_STROKE} strokeWidth={3} />
        <line x1={0} y1={-15} x2={0} y2={15} stroke="#DC2626" strokeWidth={5} strokeLinecap="round" />
        <circle cx={0} cy={0} r={7} fill="#FFFFFF" stroke="#DC2626" strokeWidth={3} />
      </g>

      {/* Digital Readout Tag */}
      <g transform="translate(0, 52)">
        <rect
          x={-170}
          y={-22}
          width={340}
          height={44}
          rx={10}
          fill="#EEF2FF"
          stroke={DOODLE_STROKE}
          strokeWidth={3}
        />
        <text x={0} y={8} textAnchor="middle" fontSize={22} fontWeight="900" fill="#4338CA">
          SLAKED LIME: pH {currentPH.toFixed(1)}
        </text>
      </g>
    </g>
  );
};

/**
 * Hand-drawn Aegean Archipelago Map with Island Homes Lighting up White
 */
const AegeanArchipelagoMap: React.FC<{
  x: number;
  y: number;
  sweepProgress?: number;
  scale?: number;
}> = ({ x, y, sweepProgress = 1, scale = 1 }) => {
  const islands = [
    { name: 'SANTORINI', ix: -110, iy: 120, trigger: 0.15 },
    { name: 'MYKONOS', ix: 40, iy: -30, trigger: 0.35 },
    { name: 'PAROS', ix: -40, iy: 20, trigger: 0.55 },
    { name: 'NAXOS', ix: 60, iy: 50, trigger: 0.7 },
    { name: 'MILOS', ix: -180, iy: 70, trigger: 0.85 },
  ];

  return (
    <g transform={`translate(${x}, ${y}) scale(${scale})`}>
      {/* Sea Background Card */}
      <rect
        x={-340}
        y={-220}
        width={680}
        height={440}
        rx={20}
        fill="#E0F2FE"
        stroke={DOODLE_STROKE}
        strokeWidth={5}
      />

      {/* Sea waves */}
      {[-160, -60, 40, 140].map((wy, idx) => (
        <path
          key={idx}
          d={`M -300 ${wy} Q -260 ${wy - 8} -220 ${wy} T -140 ${wy} T -60 ${wy} T 20 ${wy} T 100 ${wy} T 180 ${wy} T 260 ${wy}`}
          fill="none"
          stroke="#BAE6FD"
          strokeWidth={3}
        />
      ))}

      {/* Title */}
      <text x={0} y={-175} textAnchor="middle" fontSize={22} fontWeight="900" fill="#0369A1" letterSpacing="1">
        AEGEAN SEA — CYCLADIC ISLANDS
      </text>

      {/* Mainland Greece coast silhouette top-left */}
      <path
        d="M -340 -140 Q -240 -110 -200 -60 Q -180 10 -220 70 L -340 100 Z"
        fill="#CBD5E1"
        stroke={DOODLE_STROKE}
        strokeWidth={4}
      />
      <text x={-270} y={-40} fontSize={16} fontWeight="bold" fill="#64748B">
        GREECE
      </text>

      {/* Archipelago Islands */}
      {islands.map((isle, idx) => {
        const isWhite = sweepProgress >= isle.trigger;
        return (
          <g key={idx} transform={`translate(${isle.ix}, ${isle.iy})`}>
            <ellipse
              cx={0}
              cy={0}
              rx={36}
              ry={24}
              fill={isWhite ? '#F8FAFC' : '#94A3B8'}
              stroke={DOODLE_STROKE}
              strokeWidth={3}
            />
            {/* Tiny Village house on island */}
            <rect
              x={-10}
              y={-14}
              width={20}
              height={14}
              fill={isWhite ? '#FFFFFF' : '#475569'}
              stroke={DOODLE_STROKE}
              strokeWidth={2}
            />
            {isWhite && (
              <path d="M -8 -14 A 8 8 0 0 1 8 -14 Z" fill="#2563EB" stroke={DOODLE_STROKE} strokeWidth={1.5} />
            )}
            {/* Island Label */}
            <text
              x={0}
              y={38}
              textAnchor="middle"
              fontSize={13}
              fontWeight="900"
              fill={isWhite ? '#0F172A' : '#64748B'}
            >
              {isle.name}
            </text>
          </g>
        );
      })}

      {/* Enforcement Status Badge */}
      <g transform="translate(0, 185)">
        <rect
          x={-210}
          y={-18}
          width={420}
          height={36}
          rx={8}
          fill={sweepProgress > 0.6 ? '#DCFCE7' : '#FEF3C7'}
          stroke={DOODLE_STROKE}
          strokeWidth={3}
        />
        <text
          x={0}
          y={6}
          textAnchor="middle"
          fontSize={16}
          fontWeight="900"
          fill={sweepProgress > 0.6 ? '#15803D' : '#B45309'}
        >
          {sweepProgress > 0.6
            ? '✓ NATIONWIDE DECREE ENFORCED'
            : 'MANDATORY WHITEWASH ACROSS ISLANDS'}
        </text>
      </g>
    </g>
  );
};

/**
 * Animated Microscope Beat: Dynamically spreads lime wash wave & sanitizes microbes
 */
const AnimatedMicroscopeBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const disinfectProgress = interpolate(frame, [10, 85], [0.1, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <SummerSkyGroundEnv skyColor="#0F172A" groundColor="#1E293B" horizonY={550} showSun={false}>
      <MicroscopeDisinfection x={960} y={480} radius={210} disinfectProgress={disinfectProgress} />
      <StoryLabel text="KILLING BACTERIA ON CONTACT" x={960} y={160} fontSize={44} color="#FFFFFF" />
    </SummerSkyGroundEnv>
  );
};

/**
 * Animated Aegean Map Beat: Islands dynamically whitewash as decree sweeps through
 */
const AnimatedAegeanMapBeat: React.FC = () => {
  const frame = useCurrentFrame();
  const sweepProgress = interpolate(frame, [5, 60], [0.15, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#1E293B" horizonY={540} showSun={false}>
      <AegeanArchipelagoMap x={960} y={490} sweepProgress={sweepProgress} scale={1.15} />
      <StoryLabel text="ISLAND VILLAGES" x={960} y={160} fontSize={44} color="#FFFFFF" />
    </SummerSkyGroundEnv>
  );
};

/**
 * 🎬 Chapter 3: The Hidden Health Reason (170.45s / 5,114 frames @ 30fps)
 * STRICT RULES:
 * - NO SFX (Voiceover only)
 * - NO BEAT > 5 SECONDS (Every beat <= 140 frames / < 4.7s)
 * - Exact transcript-synced visual pacing
 * - 100% Environmental backdrops
 */
export const Chapter3_Health: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#38BDF8' }}>
      {/* Voiceover Audio ONLY (Zero SFX) */}
      <Audio src={staticFile('audio/white_home/3 — The Hidden Health Reason.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 75f / 0.0s - 2.5s) "But lime wash didn't just reflect the sun." */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={75}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140} showClouds>
          {/* White House reflecting sun rays */}
          <g transform="translate(680, 510)">
            <DoodleWhiteHouse x={0} y={0} scale={1.1} dome />
            <path d="M 120 -180 L 20 -80 L 100 -20" fill="none" stroke="#FACC15" strokeWidth={8} strokeLinecap="round" />
            <path d="M 80 -10 L 160 -100" fill="none" stroke="#38BDF8" strokeWidth={8} strokeLinecap="round" />
          </g>
          <DoodleStickman x={1260} y={510} scale={1.35} pose="idle" expression="curious" shirtColor="#FFFFFF" />
          <StoryLabel text="NOT JUST THE SUN" x={960} y={200} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (75 - 215f / 2.5s - 7.17s) "It did something else, something that turned out to be life-saving." */}
      {/* ================================================================ */}
      <Sequence from={75} durationInFrames={140}>
        <SummerSkyGroundEnv skyColor="#0369A1" groundColor="#B45309" horizonY={530} showSun sunX={1700} sunY={140} showVillageCluster>
          <DoodleStickman x={700} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" />
          {/* Glowing Medical Shield */}
          <g transform="translate(1220, 480)">
            <path d="M -80 -100 L 80 -100 L 80 20 Q 80 120 0 160 Q -80 120 -80 20 Z" fill="#DCFCE7" stroke="#16A34A" strokeWidth={7} />
            <rect x={-18} y={-50} width={36} height={110} rx={8} fill="#16A34A" />
            <rect x={-55} y={-13} width={110} height={36} rx={8} fill="#16A34A" />
            <StoryLabel text="LIFE-SAVING POWER" x={0} y={-140} fontSize={40} color="#15803D" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (215 - 330f / 7.17s - 11.0s) "Lime wash is a natural disinfectant." */}
      {/* ================================================================ */}
      <Sequence from={215} durationInFrames={115}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={540} showSun sunX={1680} sunY={140} showClouds>
          {/* Steaming Slaked Lime Bucket with Disinfectant Badge */}
          <g transform="translate(960, 520)">
            <path d="M -120 -60 L -90 120 L 90 120 L 120 -60 Z" fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <ellipse cx={0} cy={-60} rx={120} ry={35} fill="#E2E8F0" stroke="#000" strokeWidth={5} />
            <ellipse cx={0} cy={-55} rx={105} ry={25} fill="#FFFFFF" />
            {/* Sparkles */}
            <DoodleSparkle x={-80} y={-110} size={30} color="#FACC15" />
            <DoodleSparkle x={80} y={-110} size={30} color="#FACC15" />
            <StoryLabel text="NATURAL DISINFECTANT" x={0} y={-180} fontSize={44} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (330 - 415f / 11.0s - 13.83s) "It's mildly antibacterial." */}
      {/* ================================================================ */}
      <Sequence from={330} durationInFrames={85}>
        <SummerSkyGroundEnv skyColor="#0F766E" groundColor="#1E293B" horizonY={540} showSun={false}>
          <PHScaleMeter x={960} y={480} targetPH={12.4} scale={1.4} />
          <StoryLabel text="ANTIBACTERIAL SHIELD (pH 12+)" x={960} y={160} fontSize={44} color="#FFFFFF" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (415 - 480f / 13.83s - 16.0s) "So when you coated your walls in it," */}
      {/* ================================================================ */}
      <Sequence from={415} durationInFrames={65}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={800} y={630} scale={1.25} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" />
          <StoryLabel text="COATING THE WALLS" x={960} y={200} fontSize={42} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (480 - 540f / 16.0s - 18.0s) "you weren't just painting them white." */}
      {/* ================================================================ */}
      <Sequence from={480} durationInFrames={60}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Paint brush with crossed out JUST COLOR */}
          <g transform="translate(960, 480)">
            <rect x={-200} y={-60} width={400} height={120} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={38} fontWeight="bold" fill="#DC2626">NOT JUST WHITE PAINT</text>
            <line x1={-180} y1={25} x2={180} y2={-35} stroke="#DC2626" strokeWidth={8} strokeLinecap="round" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (540 - 600f / 18.0s - 20.0s) "You were sanitizing them," */}
      {/* ================================================================ */}
      <Sequence from={540} durationInFrames={60}>
        <SummerSkyGroundEnv skyColor="#059669" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140} showVillageCluster>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-60} width={440} height={120} rx={16} fill="#DCFCE7" stroke="#15803D" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={38} fontWeight="bold" fill="#15803D">✓ SANITIZING EVERY WALL</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (600 - 705f / 20.0s - 23.5s) "killing bacteria and helping stop the spread of disease." */}
      {/* ================================================================ */}
      <Sequence from={600} durationInFrames={105}>
        <AnimatedMicroscopeBeat />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (705 - 815f / 23.5s - 27.17s) "In a world before antibiotics, before hospitals," */}
      {/* ================================================================ */}
      <Sequence from={705} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#B45309" groundColor="#78350F" horizonY={540} showSun={false} showHills>
          {/* Crossed out modern medicine */}
          <g transform="translate(620, 480)">
            <rect x={-160} y={-50} width={320} height={100} rx={14} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={12} textAnchor="middle" fontSize={30} fontWeight="bold" fill="#B91C1C">NO ANTIBIOTICS</text>
            <line x1={-140} y1={30} x2={140} y2={-30} stroke="#DC2626" strokeWidth={6} />
          </g>
          <g transform="translate(1300, 480)">
            <rect x={-160} y={-50} width={320} height={100} rx={14} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={12} textAnchor="middle" fontSize={30} fontWeight="bold" fill="#B91C1C">NO HOSPITALS</text>
            <line x1={-140} y1={30} x2={140} y2={-30} stroke="#DC2626" strokeWidth={6} />
          </g>
          <StoryLabel text="ANCIENT REALITY" x={960} y={200} fontSize={44} color="#FEF3C7" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10: (815 - 905f / 27.17s - 30.17s) "before anyone fully understood germs," */}
      {/* ================================================================ */}
      <Sequence from={815} durationInFrames={90}>
        <SummerSkyGroundEnv skyColor="#64748B" groundColor="#334155" horizonY={530} showSun={false}>
          <DoodleStickman x={820} y={510} scale={1.35} pose="holding_magnifier" expression="curious" shirtColor="#E2E8F0" />
          <g transform="translate(1180, 480)">
            <text x={0} y={0} fontSize={80} textAnchor="middle" fill="#FFFFFF" fontWeight="900">?</text>
            <StoryLabel text="GERMS WERE UNKNOWN" x={0} y={70} fontSize={36} color="#FFFFFF" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11: (905 - 1015f / 30.17s - 33.83s) "that was an enormous, almost hidden benefit." */}
      {/* ================================================================ */}
      <Sequence from={905} durationInFrames={110}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <g transform="translate(960, 500)">
            <circle cx={0} cy={0} r={140} fill="none" stroke="#FACC15" strokeWidth={8} strokeDasharray="12 8" />
            <DoodleSparkle x={-100} y={-100} size={36} color="#FACC15" />
            <DoodleSparkle x={100} y={-100} size={36} color="#FACC15" />
            <StoryLabel text="ENORMOUS HIDDEN BENEFIT" x={0} y={190} fontSize={44} color="#18181B" />
          </g>
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 12: (1015 - 1105f / 33.83s - 36.83s) "And that disinfectant power became critical" */}
      {/* ================================================================ */}
      <Sequence from={1015} durationInFrames={90}>
        <SummerSkyGroundEnv skyColor="#EA580C" groundColor="#7C2D12" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <polygon points="0,-90 100,70 -100,70" fill="#FEF08A" stroke="#CA8A04" strokeWidth={8} />
            <text x={0} y={45} textAnchor="middle" fontSize={70} fontWeight="900" fill="#000000">!</text>
            <StoryLabel text="CRITICAL MOMENT" x={0} y={140} fontSize={44} color="#FFFFFF" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13: (1105 - 1170f / 36.83s - 39.0s) "during disease outbreaks." */}
      {/* ================================================================ */}
      <Sequence from={1105} durationInFrames={65}>
        <SummerSkyGroundEnv skyColor="#7F1D1D" groundColor="#450A0A" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-200} y={-50} width={400} height={100} rx={16} fill="#DC2626" stroke="#FFFFFF" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={38} fontWeight="900" fill="#FFFFFF">OUTBREAK ALERT</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 14: (1170 - 1275f / 39.0s - 42.5s) "When epidemics like cholera swept through communities," */}
      {/* ================================================================ */}
      <Sequence from={1170} durationInFrames={105}>
        <SummerSkyGroundEnv skyColor="#991B1B" groundColor="#450A0A" horizonY={540} showSun={false} showVillageCluster>
          <DoodleStickman x={600} y={510} scale={1.3} pose="panicking" expression="shocked" shirtColor="#DC2626" />
          <StoryLabel text="CHOLERA EPIDEMIC SWEEPS IN" x={960} y={180} fontSize={44} color="#FFFFFF" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 15: (1275 - 1380f / 42.5s - 46.0s) "people were desperate for anything that might slow it down," */}
      {/* ================================================================ */}
      <Sequence from={1275} durationInFrames={105}>
        <MediterraneanVillageBackdrop skyColor="#475569">
          <DoodleStickman x={680} y={630} scale={1.2} pose="panicking" expression="shocked" shirtColor="#EA580C" />
          <DoodleStickman x={1240} y={630} scale={1.2} pose="panicking" expression="shocked" shirtColor="#F59E0B" />
          <StoryLabel text="DESPERATE FOR A SHIELD" x={960} y={180} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 16: (1380 - 1505f / 46.0s - 50.17s) "and whitewashing homes and public spaces genuinely helped" */}
      {/* ================================================================ */}
      <Sequence from={1380} durationInFrames={125}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={650} y={630} scale={1.2} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" />
          <DoodleStickman x={1250} y={630} scale={1.2} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" />
          <StoryLabel text="WHITEWASH SAVED LIVES" x={960} y={200} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 17: (1505 - 1640f / 50.17s - 54.67s) "because it sanitized surfaces and cut down infection." */}
      {/* ================================================================ */}
      <Sequence from={1505} durationInFrames={135}>
        <SummerSkyGroundEnv skyColor="#047857" groundColor="#064E3B" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-60} width={480} height={120} rx={18} fill="#DCFCE7" stroke="#15803D" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={38} fontWeight="900" fill="#15803D">INFECTION DROPPED ↓</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 18: (1640 - 1725f / 54.67s - 57.5s) "So during outbreaks, entire villages" */}
      {/* ================================================================ */}
      <Sequence from={1640} durationInFrames={85}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <StoryLabel text="ENTIRE VILLAGES" x={960} y={200} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 19: (1725 - 1810f / 57.5s - 60.33s) "would get whitewashed as a public health measure," */}
      {/* ================================================================ */}
      <Sequence from={1725} durationInFrames={85}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140} showVillageCluster>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0369A1">PUBLIC HEALTH MEASURE</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 20: (1810 - 1865f / 60.33s - 62.17s) "a way of cleansing the community" */}
      {/* ================================================================ */}
      <Sequence from={1810} durationInFrames={55}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleSparkle x={600} y={350} size={40} color="#FACC15" />
          <DoodleSparkle x={1300} y={350} size={40} color="#FACC15" />
          <StoryLabel text="COMMUNITY CLEANSING" x={960} y={200} fontSize={42} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 21: (1865 - 1995f / 62.17s - 66.5s) "and fighting back against a killer nobody could even see." */}
      {/* ================================================================ */}
      <Sequence from={1865} durationInFrames={130}>
        <SummerSkyGroundEnv skyColor="#1E293B" groundColor="#0F172A" horizonY={540} showSun={false}>
          <DoodleStickman x={680} y={510} scale={1.35} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" />
          {/* Microbe ghost fading */}
          <g transform="translate(1220, 460)" opacity={0.6}>
            <circle cx={0} cy={0} r={90} fill="#EF4444" stroke="#000" strokeWidth={5} />
            <text x={-25} y={10} fontSize={40} fontWeight="900">X</text>
            <text x={15} y={10} fontSize={40} fontWeight="900">X</text>
          </g>
          <StoryLabel text="THE INVISIBLE KILLER" x={960} y={180} fontSize={44} color="#FFFFFF" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 22: (1995 - 2085f / 66.5s - 69.5s) "This is one of the most overlooked reasons" */}
      {/* ================================================================ */}
      <Sequence from={1995} durationInFrames={90}>
        <SummerSkyGroundEnv skyColor="#0369A1" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={800} y={510} scale={1.35} pose="idle" expression="curious" shirtColor="#FFFFFF" />
          <StoryLabel text="OVERLOOKED REASON" x={960} y={200} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 23: (2085 - 2180f / 69.5s - 72.67s) "these villages turned so uniformly white." */}
      {/* ================================================================ */}
      <Sequence from={2085} durationInFrames={95}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <StoryLabel text="UNIFORMLY WHITE" x={960} y={180} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 24: (2180 - 2295f / 72.67s - 76.5s) "It wasn't only about heat, it was about health," */}
      {/* ================================================================ */}
      <Sequence from={2180} durationInFrames={115}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(560, 480)">
            <rect x={-150} y={-50} width={300} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={12} textAnchor="middle" fontSize={34} fontWeight="bold" fill="#D97706">☀️ HEAT</text>
          </g>
          <g transform="translate(1360, 480)">
            <rect x={-150} y={-50} width={300} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={12} textAnchor="middle" fontSize={34} fontWeight="bold" fill="#15803D">❤️ HEALTH</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 25: (2295 - 2420f / 76.5s - 80.67s) "about survival, about keeping families alive." */}
      {/* ================================================================ */}
      <Sequence from={2295} durationInFrames={125}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140} showVillageCluster>
          <DoodleStickman x={820} y={510} scale={1.3} pose="idle" expression="smile" shirtColor="#0284C7" />
          <DoodleStickman x={1100} y={510} scale={1.3} pose="idle" expression="smile" shirtColor="#EA580C" />
          <StoryLabel text="KEEPING FAMILIES ALIVE" x={960} y={200} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 26: (2420 - 2500f / 80.67s - 83.33s) "Every fresh coat of white was," */}
      {/* ================================================================ */}
      <Sequence from={2420} durationInFrames={80}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140}>
          <DoodleStickman x={800} y={510} scale={1.35} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" />
          <StoryLabel text="EVERY FRESH COAT" x={960} y={200} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 27: (2500 - 2640f / 83.33s - 88.0s) "in a very real sense, a coat of protection against sickness." */}
      {/* ================================================================ */}
      <Sequence from={2500} durationInFrames={140}>
        <SummerSkyGroundEnv skyColor="#047857" groundColor="#064E3B" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-260} y={-60} width={520} height={120} rx={18} fill="#DCFCE7" stroke="#15803D" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={38} fontWeight="900" fill="#15803D">COAT OF PROTECTION</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 28: (2640 - 2760f / 88.0s - 92.0s) "In some places, this went beyond individual choice" */}
      {/* ================================================================ */}
      <Sequence from={2640} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={800} y={510} scale={1.35} pose="idle" expression="curious" shirtColor="#FFFFFF" />
          <StoryLabel text="BEYOND INDIVIDUAL CHOICE" x={960} y={200} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 29: (2760 - 2835f / 92.0s - 94.5s) "and became official policy." */}
      {/* ================================================================ */}
      <Sequence from={2760} durationInFrames={75}>
        <SummerSkyGroundEnv skyColor="#1E293B" groundColor="#0F172A" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#FACC15" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={38} fontWeight="900" fill="#18181B">OFFICIAL POLICY</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 30: (2835 - 2950f / 94.5s - 98.33s) "In 20th century Greece, during a period of dictatorship" */}
      {/* ================================================================ */}
      <Sequence from={2835} durationInFrames={115}>
        <SummerSkyGroundEnv skyColor="#334155" groundColor="#1E293B" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#1E293B">GREECE (1938)</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 31: (2950 - 3015f / 98.33s - 100.5s) "and a serious cholera outbreak," */}
      {/* ================================================================ */}
      <Sequence from={2950} durationInFrames={65}>
        <SummerSkyGroundEnv skyColor="#991B1B" groundColor="#450A0A" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#EF4444" stroke="#FFFFFF" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#FFFFFF">CHOLERA OUTBREAK</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 32: (3015 - 3105f / 100.5s - 103.5s) "the government actually ordered the whitewashing of homes" */}
      {/* ================================================================ */}
      <Sequence from={3015} durationInFrames={90}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={540} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={420} y={510} scale={1.25} pose="idle" expression="curious" shirtColor="#FFFFFF" />
          <GreekDecree x={771} y={230} scale={0.88} />
          <DoodleStickman x={1500} y={510} scale={1.25} pose="panicking" expression="shocked" shirtColor="#EA580C" />
          <StoryLabel text="MANDATORY ORDER" x={960} y={160} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 33: (3105 - 3165f / 103.5s - 105.5s) "across much of the country," */}
      {/* ================================================================ */}
      <Sequence from={3105} durationInFrames={60}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={800} y={630} scale={1.25} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" />
          <StoryLabel text="ACROSS THE COUNTRY" x={960} y={180} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 34: (3165 - 3240f / 105.5s - 108.0s) "especially in the island villages," */}
      {/* ================================================================ */}
      <Sequence from={3165} durationInFrames={75}>
        <AnimatedAegeanMapBeat />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 35: (3240 - 3330f / 108.0s - 111.0s) "specifically because limewash was a cheap," */}
      {/* ================================================================ */}
      <Sequence from={3240} durationInFrames={90}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-200} y={-50} width={400} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={38} fontWeight="bold" fill="#047857">CHEAP & ABUNDANT</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 36: (3330 - 3455f / 111.0s - 115.17s) "effective disinfectant that could help control the disease." */}
      {/* ================================================================ */}
      <Sequence from={3330} durationInFrames={125}>
        <SummerSkyGroundEnv skyColor="#0F766E" groundColor="#1E293B" horizonY={540} showSun={false}>
          <PHScaleMeter x={960} y={480} targetPH={12.4} scale={1.35} />
          <StoryLabel text="EFFECTIVE DISINFECTANT" x={960} y={160} fontSize={44} color="#FFFFFF" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 37: (3455 - 3550f / 115.17s - 118.33s) "So some of the most famously white villages on earth" */}
      {/* ================================================================ */}
      <Sequence from={3455} durationInFrames={95}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <StoryLabel text="FAMOUSLY WHITE VILLAGES" x={960} y={180} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 38: (3550 - 3670f / 118.33s - 122.33s) "are that white, in part because of a government decree," */}
      {/* ================================================================ */}
      <Sequence from={3550} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <GreekDecree x={777} y={220} scale={0.85} />
          <StoryLabel text="GOVERNMENT DECREE" x={960} y={150} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 39: (3670 - 3765f / 122.33s - 125.5s) "a nationwide command to whitewash everything" */}
      {/* ================================================================ */}
      <Sequence from={3670} durationInFrames={95}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140} showVillageCluster>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0284C7">WHITEWASH EVERYTHING</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 40: (3765 - 3840f / 125.5s - 128.0s) "to stop an epidemic." */}
      {/* ================================================================ */}
      <Sequence from={3765} durationInFrames={75}>
        <SummerSkyGroundEnv skyColor="#047857" groundColor="#064E3B" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <circle cx={0} cy={0} r={110} fill="#10B981" stroke="#065F46" strokeWidth={8} />
            <path d="M -50 -5 L -15 35 L 55 -35" stroke="#FFFFFF" strokeWidth={16} fill="none" strokeLinecap="round" />
            <StoryLabel text="EPIDEMIC STOPPED" x={0} y={180} fontSize={44} color="#FFFFFF" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 41: (3840 - 3960f / 128.0s - 132.0s) "What we now see as a charming aesthetic was, in part," */}
      {/* ================================================================ */}
      <Sequence from={3840} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={800} y={630} scale={1.25} pose="holding_camera" expression="smile" shirtColor="#EF4444" shortsColor="#1D4ED8" />
          <StoryLabel text="CHARMING AESTHETIC" x={960} y={180} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 42: (3960 - 4095f / 132.0s - 136.5s) "the visible leftover of a desperate fight against disease." */}
      {/* ================================================================ */}
      <Sequence from={3960} durationInFrames={135}>
        <SummerSkyGroundEnv skyColor="#1E293B" groundColor="#0F172A" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-260} y={-60} width={520} height={120} rx={18} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="bold" fill="#DC2626">FIGHT AGAINST DISEASE</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 43: (4095 - 4205f / 136.5s - 140.17s) "So already, you've got three powerful reasons" */}
      {/* ================================================================ */}
      <Sequence from={4095} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={560} y={510} scale={1.35} pose="pointing_board" expression="smile" shirtColor="#FFFFFF" />
          {/* Presentation Whiteboard on Stand */}
          <g transform="translate(1220, 470)">
            <rect x={-260} y={-140} width={520} height={280} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <line x1={-180} y1={140} x2={-210} y2={250} stroke="#000" strokeWidth={6} />
            <line x1={180} y1={140} x2={210} y2={250} stroke="#000" strokeWidth={6} />
            <text x={0} y={-70} textAnchor="middle" fontSize={32} fontWeight="900" fill="#18181B">
              THE 3 PILLARS
            </text>
            <line x1={-180} y1={-45} x2={180} y2={-45} stroke="#CBD5E1" strokeWidth={3} />
            <text x={0} y={-10} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#0369A1">
              1. THERMAL REFLECTION
            </text>
            <text x={0} y={35} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#B45309">
              2. CHEAP LOCAL LIME
            </text>
            <text x={0} y={80} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#15803D">
              3. DISINFECTANT
            </text>
          </g>
          <StoryLabel text="THREE POWERFUL REASONS" x={960} y={170} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 44: (4205 - 4275f / 140.17s - 142.5s) "stacked on top of each other." */}
      {/* ================================================================ */}
      <Sequence from={4205} durationInFrames={70}>
        <SummerSkyGroundEnv skyColor="#0369A1" groundColor="#B45309" horizonY={530} showSun sunX={1700} sunY={140}>
          {/* Stacked Pillars Badge */}
          <g transform="translate(960, 500)">
            <rect x={-180} y={-100} width={360} height={60} rx={10} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={-60} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#047857">1. COOLING</text>
            <rect x={-180} y={-30} width={360} height={60} rx={10} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={10} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#0284C7">2. CHEAP LIME</text>
            <rect x={-180} y={40} width={360} height={60} rx={10} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={80} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#7C3AED">3. DISINFECTANT</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 45: (4275 - 4380f / 142.5s - 146.0s) "It reflected brutal sun and kept homes cool." */}
      {/* ================================================================ */}
      <Sequence from={4275} durationInFrames={105}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0369A1">1. THERMAL REFLECTION</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 46: (4380 - 4455f / 146.0s - 148.5s) "It was made from cheap, local lime" */}
      {/* ================================================================ */}
      <Sequence from={4380} durationInFrames={75}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#B45309">2. CHEAP LOCAL LIME</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 47: (4455 - 4515f / 148.5s - 150.5s) "that ordinary people could afford" */}
      {/* ================================================================ */}
      <Sequence from={4455} durationInFrames={60}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={800} y={630} scale={1.25} pose="idle" expression="smile" shirtColor="#FFFFFF" />
          <StoryLabel text="AFFORDABLE FOR ALL" x={960} y={180} fontSize={42} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 48: (4515 - 4635f / 150.5s - 154.5s) "and it disinfected homes, helping fight the spread" */}
      {/* ================================================================ */}
      <Sequence from={4515} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#047857" groundColor="#064E3B" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#DCFCE7" stroke="#15803D" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#15803D">3. DISINFECTS HOMES</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 49: (4635 - 4700f / 154.5s - 156.67s) "of deadly disease." */}
      {/* ================================================================ */}
      <Sequence from={4635} durationInFrames={65}>
        <SummerSkyGroundEnv skyColor="#047857" groundColor="#064E3B" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#047857">STOPS DISEASE</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 50: (4700 - 4780f / 156.67s - 159.33s) "Each reason reinforced the others" */}
      {/* ================================================================ */}
      <Sequence from={4700} durationInFrames={80}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140}>
          <StoryLabel text="REINFORCING SYNERGY" x={960} y={200} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 51: (4780 - 4865f / 159.33s - 162.17s) "and when something is cheap, keeps you cool" */}
      {/* ================================================================ */}
      <Sequence from={4780} durationInFrames={85}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(680, 480)">
            <rect x={-140} y={-45} width={280} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontSize={32} fontWeight="bold" fill="#047857">✓ CHEAP</text>
          </g>
          <g transform="translate(1240, 480)">
            <rect x={-140} y={-45} width={280} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontSize={32} fontWeight="bold" fill="#0284C7">✓ KEEPS COOL</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 52: (4865 - 4940f / 162.17s - 164.67s) "and keeps you healthy all at once," */}
      {/* ================================================================ */}
      <Sequence from={4865} durationInFrames={75}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <g transform="translate(960, 680)">
            <rect x={-200} y={-45} width={400} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontSize={34} fontWeight="bold" fill="#7C3AED">✓ KEEPS YOU HEALTHY</text>
          </g>
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 53: (4940 - 5035f / 164.67s - 167.83s) "of course, an entire village ends up coded in it," */}
      {/* ================================================================ */}
      <Sequence from={4940} durationInFrames={95}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <StoryLabel text="THE ENTIRE VILLAGE COATED" x={960} y={180} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 54: (5035 - 5114f / 167.83s - 170.45s) "generation after generation." */}
      {/* ================================================================ */}
      <Sequence from={5035} durationInFrames={79}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={800} y={630} scale={1.25} pose="idle" expression="smile" shirtColor="#FFFFFF" />
          <DoodleStickman x={1120} y={650} scale={0.95} pose="holding_brush" expression="smile" shirtColor="#EA580C" />
          <StoryLabel text="GENERATION AFTER GENERATION" x={960} y={180} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>
    </div>
  );
};
