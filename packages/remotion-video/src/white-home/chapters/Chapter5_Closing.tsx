import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import {
  DOODLE_STROKE,
  DOODLE_WIDTH,
  DoodleSparkle,
  DoodleSun,
} from '../../animated-story/DoodleElements';
import { DoodleStickman } from '../../animated-story/DoodleStickman';
import {
  MediterraneanVillageBackdrop,
  StoryLabel,
  SummerSkyGroundEnv,
} from '../shared/StoryEnvironments';

/**
 * 🏢 Modern White Roofs Synthesis Scene
 * Highlights how ancient Cycladic whitewashing inspired modern cool-roof urban engineering
 */
const ModernWhiteRoofsScene: React.FC = () => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
      {/* Sky */}
      <rect x={0} y={0} width={1920} height={520} fill="#0284C7" />
      <DoodleSun x={1680} y={130} size={110} pulse />

      {/* Urban Ground / Street */}
      <rect x={0} y={520} width={1920} height={560} fill="#334155" />
      <line x1={0} y1={520} x2={1920} y2={520} stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />

      {/* Modern City Buildings with White Cool Roofs */}
      {/* Building 1 (Left) */}
      <g transform="translate(180, 230)">
        <rect x={0} y={40} width={280} height={250} fill="#1E293B" stroke={DOODLE_STROKE} strokeWidth={5} />
        {[80, 140, 200].map((wy) => (
          <g key={wy}>
            <rect x={30} y={wy} width={50} height={35} fill="#38BDF8" opacity={0.8} />
            <rect x={115} y={wy} width={50} height={35} fill="#38BDF8" opacity={0.8} />
            <rect x={200} y={wy} width={50} height={35} fill="#38BDF8" opacity={0.8} />
          </g>
        ))}
        {/* White Flat Cool Roof */}
        <rect x={-10} y={15} width={300} height={30} rx={6} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={5} />
        {/* Reflective Arrow bouncing away */}
        <path d="M 140 10 L 140 -50 M 120 -30 L 140 -55 L 160 -30" stroke="#FACC15" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <text x={140} y={-68} textAnchor="middle" fontSize={20} fontWeight="900" fill="#FEF08A">85% REFLECTED</text>
      </g>

      {/* Building 2 (Mid-Left Tower) */}
      <g transform="translate(520, 150)">
        <rect x={0} y={40} width={320} height={330} fill="#0F172A" stroke={DOODLE_STROKE} strokeWidth={5} />
        {[80, 140, 200, 260].map((wy) => (
          <g key={wy}>
            <rect x={30} y={wy} width={60} height={35} fill="#60A5FA" opacity={0.8} />
            <rect x={130} y={wy} width={60} height={35} fill="#60A5FA" opacity={0.8} />
            <rect x={230} y={wy} width={60} height={35} fill="#60A5FA" opacity={0.8} />
          </g>
        ))}
        {/* White Cool Roof */}
        <rect x={-10} y={15} width={340} height={30} rx={6} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={5} />
        <path d="M 160 10 L 160 -50 M 140 -30 L 160 -55 L 180 -30" stroke="#FACC15" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <text x={160} y={-68} textAnchor="middle" fontSize={20} fontWeight="900" fill="#FEF08A">85% REFLECTED</text>
      </g>

      {/* Building 3 (Mid-Right Highrise) */}
      <g transform="translate(1120, 180)">
        <rect x={0} y={40} width={300} height={300} fill="#1E293B" stroke={DOODLE_STROKE} strokeWidth={5} />
        {[80, 140, 200].map((wy) => (
          <g key={wy}>
            <rect x={35} y={wy} width={55} height={35} fill="#38BDF8" opacity={0.8} />
            <rect x={120} y={wy} width={55} height={35} fill="#38BDF8" opacity={0.8} />
            <rect x={205} y={wy} width={55} height={35} fill="#38BDF8" opacity={0.8} />
          </g>
        ))}
        {/* White Cool Roof */}
        <rect x={-10} y={15} width={320} height={30} rx={6} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={5} />
        <path d="M 150 10 L 150 -50 M 130 -30 L 150 -55 L 170 -30" stroke="#FACC15" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <text x={150} y={-68} textAnchor="middle" fontSize={20} fontWeight="900" fill="#FEF08A">85% REFLECTED</text>
      </g>

      {/* Building 4 (Right) */}
      <g transform="translate(1480, 230)">
        <rect x={0} y={40} width={260} height={250} fill="#0F172A" stroke={DOODLE_STROKE} strokeWidth={5} />
        {[80, 140, 200].map((wy) => (
          <g key={wy}>
            <rect x={30} y={wy} width={50} height={35} fill="#60A5FA" opacity={0.8} />
            <rect x={110} y={wy} width={50} height={35} fill="#60A5FA" opacity={0.8} />
            <rect x={180} y={wy} width={50} height={35} fill="#60A5FA" opacity={0.8} />
          </g>
        ))}
        {/* White Cool Roof */}
        <rect x={-10} y={15} width={280} height={30} rx={6} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={5} />
        <path d="M 130 10 L 130 -50 M 110 -30 L 130 -55 L 150 -30" stroke="#FACC15" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        <text x={130} y={-68} textAnchor="middle" fontSize={20} fontWeight="900" fill="#FEF08A">85% REFLECTED</text>
      </g>

      {/* Architect Stickman in Plaza */}
      <DoodleStickman x={960} y={510} scale={1.35} pose="pointing_board" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />

      {/* Floating Info Banner */}
      <g transform="translate(960, 840)">
        <rect x={-380} y={-50} width={760} height={100} rx={18} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={6} />
        <text x={0} y={-10} textAnchor="middle" fontSize={28} fontWeight="900" fill="#0369A1">
          MODERN COOL ROOF INITIATIVES
        </text>
        <text x={0} y={26} textAnchor="middle" fontSize={22} fontWeight="bold" fill="#15803D">
          ANCIENT GREEK PHYSICS SOLVING MODERN URBAN HEAT
        </text>
      </g>
    </svg>
  );
};

/**
 * ✉️ Postcard vs Reality Climax Synthesis Scene
 * Juxtaposes the romantic Aegean holiday postcard against the ancient life-or-death survival technology
 */
const PostcardVsRealityScene: React.FC = () => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
      {/* Background Atmosphere */}
      <rect x={0} y={0} width={1920} height={520} fill="#0284C7" />
      <rect x={0} y={520} width={1920} height={560} fill="#1E293B" />
      <line x1={0} y1={520} x2={1920} y2={520} stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />

      {/* Main Comparison: Left (Postcard / Myth) vs Right (Reality / Survival) */}
      {/* 1. LEFT CARD: THE TOURIST POSTCARD */}
      <g transform="translate(180, 200)">
        <rect x={0} y={0} width={720} height={620} rx={20} fill="#FCF9F2" stroke={DOODLE_STROKE} strokeWidth={6} />
        {/* Dashed Border */}
        <rect x={18} y={18} width={684} height={584} rx={14} fill="none" stroke="#CBD5E1" strokeWidth={3} strokeDasharray="12 10" />

        {/* Postcard Stamp */}
        <g transform="translate(580, 35)">
          <rect x={0} y={0} width={90} height={110} rx={6} fill="#EFF6FF" stroke={DOODLE_STROKE} strokeWidth={3} />
          <circle cx={45} cy={45} r={26} fill="#3B82F6" opacity={0.3} />
          <text x={45} y={52} textAnchor="middle" fontSize={16} fontWeight="bold" fill="#1E3A8A">HELLAS</text>
          <text x={45} y={92} textAnchor="middle" fontSize={14} fill="#64748B">1938</text>
        </g>

        {/* Postcard Header */}
        <text x={40} y={75} fontSize={32} fontWeight="900" fill="#1E3A8A">
          📸 THE POSTCARD
        </text>
        <text x={40} y={115} fontSize={22} fontWeight="bold" fill="#64748B">
          "Pure Aesthetic Vacation Magic"
        </text>

        {/* Postcard Mini Village Graphic */}
        <g transform="translate(50, 150)">
          <rect x={0} y={0} width={620} height={320} rx={12} fill="#38BDF8" stroke={DOODLE_STROKE} strokeWidth={4} />
          <circle cx={540} cy={60} r={35} fill="#FDE047" stroke={DOODLE_STROKE} strokeWidth={3} />
          <rect x={0} y={200} width={620} height={120} rx={8} fill="#E2B170" />
          {/* White Houses with Blue Dome */}
          <rect x={80} y={100} width={150} height={100} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
          <path d="M 80 100 Q 155 30 230 100 Z" fill="#1D4ED8" stroke={DOODLE_STROKE} strokeWidth={4} />
          <rect x={260} y={120} width={130} height={80} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
          <rect x={410} y={90} width={140} height={110} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
          <path d="M 410 90 Q 480 30 550 90 Z" fill="#1D4ED8" stroke={DOODLE_STROKE} strokeWidth={4} />
          {/* Tourist Icon */}
          <g transform="translate(190, 220)">
            <circle cx={0} cy={-25} r={16} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={3} />
            <line x1={0} y1={-9} x2={0} y2={35} stroke={DOODLE_STROKE} strokeWidth={4} />
            <line x1={-20} y1={8} x2={20} y2={8} stroke={DOODLE_STROKE} strokeWidth={4} />
            <line x1={0} y1={35} x2={-15} y2={65} stroke={DOODLE_STROKE} strokeWidth={4} />
            <line x1={0} y1={35} x2={15} y2={65} stroke={DOODLE_STROKE} strokeWidth={4} />
            <rect x={-14} y={-2} width={28} height={18} rx={3} fill="#EF4444" stroke={DOODLE_STROKE} strokeWidth={2} />
          </g>
        </g>

        {/* Bottom Tag */}
        <g transform="translate(360, 545)">
          <rect x={-200} y={-25} width={400} height={50} rx={10} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={3} />
          <text x={0} y={8} textAnchor="middle" fontSize={22} fontWeight="900" fill="#1D4ED8">
            WHAT THE WORLD SEES
          </text>
        </g>
      </g>

      {/* VS Badge in Center */}
      <g transform="translate(960, 510)">
        <circle cx={0} cy={0} r={55} fill="#DC2626" stroke="#FFFFFF" strokeWidth={6} />
        <text x={0} y={15} textAnchor="middle" fontSize={38} fontWeight="900" fill="#FFFFFF">
          VS
        </text>
      </g>

      {/* 2. RIGHT CARD: THE HIDDEN REALITY */}
      <g transform="translate(1020, 200)">
        <rect x={0} y={0} width={720} height={620} rx={20} fill="#0F172A" stroke="#38BDF8" strokeWidth={6} />
        <text x={40} y={75} fontSize={32} fontWeight="900" fill="#38BDF8">
          🛡️ THE REALITY
        </text>
        <text x={40} y={115} fontSize={22} fontWeight="bold" fill="#94A3B8">
          "Ancient Survival Technology"
        </text>

        {/* Three Pillars Cards */}
        <g transform="translate(40, 160)">
          {/* Pillar 1: Solar Shield */}
          <g transform="translate(0, 0)">
            <rect x={0} y={0} width={640} height={90} rx={12} fill="#1E293B" stroke="#0284C7" strokeWidth={3} />
            <text x={30} y={40} fontSize={24} fontWeight="900" fill="#38BDF8">☀️ 1. SOLAR RADIATION SHIELD</text>
            <text x={30} y={68} fontSize={18} fill="#E2E8F0">Reflects 90%+ sunrays without power or air conditioning</text>
          </g>

          {/* Pillar 2: Antibacterial Disinfectant */}
          <g transform="translate(0, 110)">
            <rect x={0} y={0} width={640} height={90} rx={12} fill="#1E293B" stroke="#15803D" strokeWidth={3} />
            <text x={30} y={40} fontSize={24} fontWeight="900" fill="#4ADE80">🛡️ 2. ANTISEPTIC DISINFECTANT</text>
            <text x={30} y={68} fontSize={18} fill="#E2E8F0">pH 12.4 lime wash sterilizes surfaces against deadly Cholera</text>
          </g>

          {/* Pillar 3: Economic Equality */}
          <g transform="translate(0, 220)">
            <rect x={0} y={0} width={640} height={90} rx={12} fill="#1E293B" stroke="#B45309" strokeWidth={3} />
            <text x={30} y={40} fontSize={24} fontWeight="900" fill="#FBBF24">🪨 3. DEMOCRATIC LIMEWASH</text>
            <text x={30} y={68} fontSize={18} fill="#E2E8F0">Abundant island limestone affordable to every poor family</text>
          </g>
        </g>

        {/* Bottom Tag */}
        <g transform="translate(360, 545)">
          <rect x={-200} y={-25} width={400} height={50} rx={10} fill="#064E3B" stroke="#10B981" strokeWidth={3} />
          <text x={0} y={8} textAnchor="middle" fontSize={22} fontWeight="900" fill="#34D399">
            WHAT ACTUALLY SAVED LIVES
          </text>
        </g>
      </g>

      {/* Top Banner */}
      <g transform="translate(960, 95)">
        <rect x={-360} y={-38} width={720} height={76} rx={18} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={6} />
        <text x={0} y={12} textAnchor="middle" fontSize={34} fontWeight="900" fill="#18181B">
          DISGUISED AS A POSTCARD
        </text>
      </g>

      {/* Bottom Synthesis Tagline */}
      <g transform="translate(960, 930)">
        <rect x={-420} y={-35} width={840} height={70} rx={16} fill="#FBBF24" stroke={DOODLE_STROKE} strokeWidth={5} />
        <text x={0} y={11} textAnchor="middle" fontSize={26} fontWeight="900" fill="#18181B">
          GENUINE SURVIVAL GENIUS DISGUISED AS ICONIC BEAUTY
        </text>
      </g>
    </svg>
  );
};

/**
 * 🎬 Chapter 5: Closing (168.36s / 5,051 frames @ 30fps)
 * STRICT RULES:
 * - NO SFX (Voiceover only)
 * - ALL Sequence durationInFrames <= 140 (strict < 5s beats, max here is 125f)
 * - Exact transcript-synced visual pacing matching audio timestamps
 * - 100% Environmental backdrops (SummerSkyGroundEnv, MediterraneanVillageBackdrop, ModernWhiteRoofsScene, PostcardVsRealityScene)
 * - DoodleStickman with shirtColor and shortsColor matching ref_107s
 * - Zero text collisions (labels in open sky at y=95 or high-contrast pill badges)
 */
export const Chapter5_Closing: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#38BDF8' }}>
      {/* Voiceover Audio ONLY (Zero SFX) */}
      <Audio src={staticFile('audio/white_home/5 - closing.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 80f / 0.0s - 2.67s) "So, when you put it all together," */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={80}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={800} y={510} scale={1.35} pose="pointing_board" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="PUTTING IT ALL TOGETHER" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (80 - 160f / 2.67s - 5.33s) "the dazzling white of these sun-drenched villages" */}
      {/* ================================================================ */}
      <Sequence from={80} durationInFrames={80}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleSparkle x={600} y={320} size={40} color="#FACC15" />
          <DoodleSparkle x={1350} y={320} size={40} color="#FACC15" />
          <StoryLabel text="DAZZLING WHITE VILLAGES" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (160 - 270f / 5.33s - 9.0s) "was never really about beauty, at least not originally." */}
      {/* ================================================================ */}
      <Sequence from={160} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="bold" fill="#DC2626">NOT ABOUT BEAUTY</text>
            <line x1={-190} y1={30} x2={190} y2={-30} stroke="#DC2626" strokeWidth={7} />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (270 - 390f / 9.0s - 13.0s) "It was one of the most elegant survival strategies humans ever came up with." */}
      {/* ================================================================ */}
      <Sequence from={270} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={960} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <g transform="translate(960, 690)">
            <rect x={-280} y={-45} width={560} height={90} rx={18} fill="#DCFCE7" stroke="#15803D" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={34} fontWeight="900" fill="#15803D">ELEGANT SURVIVAL STRATEGY</text>
          </g>
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (390 - 500f / 13.0s - 16.67s) "A convergence of physics, economics, and medicine" */}
      {/* ================================================================ */}
      <Sequence from={390} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 500)">
            <g transform="translate(-400, 0)">
              <rect x={-140} y={-45} width={280} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
              <text x={0} y={14} textAnchor="middle" fontSize={30} fontWeight="bold" fill="#0369A1">1. PHYSICS</text>
            </g>
            <g transform="translate(0, 0)">
              <rect x={-150} y={-45} width={300} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
              <text x={0} y={14} textAnchor="middle" fontSize={30} fontWeight="bold" fill="#B45309">2. ECONOMICS</text>
            </g>
            <g transform="translate(400, 0)">
              <rect x={-140} y={-45} width={280} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
              <text x={0} y={14} textAnchor="middle" fontSize={30} fontWeight="bold" fill="#15803D">3. MEDICINE</text>
            </g>
          </g>
          <StoryLabel text="THREE CONVERGING FORCES" x={960} y={180} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (500 - 620f / 16.67s - 20.67s) "all expressed in a single coat of white." */}
      {/* ================================================================ */}
      <Sequence from={500} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={800} y={510} scale={1.35} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="ONE COAT OF WHITE" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (620 - 740f / 20.67s - 24.67s) "It reflected a punishing sun and kept homes livable" */}
      {/* ================================================================ */}
      <Sequence from={620} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140} showVillageCluster>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0284C7">REFLECTED SUN</text>
          </g>
          <StoryLabel text="HOMES STAYED COOL" x={960} y={180} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (740 - 855f / 24.67s - 28.5s) "without any technology or energy at all." */}
      {/* ================================================================ */}
      <Sequence from={740} durationInFrames={115}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140}>
          <DoodleStickman x={800} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#0284C7" />
          <g transform="translate(1200, 480)">
            <rect x={-200} y={-50} width={400} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={32} fontWeight="bold" fill="#18181B">ZERO POWER REQUIRED</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (855 - 980f / 28.5s - 32.67s) "It was made from cheap, abundant lime" */}
      {/* ================================================================ */}
      <Sequence from={855} durationInFrames={125}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#B45309">CHEAP LOCAL LIME</text>
          </g>
          <StoryLabel text="ABUNDANT ON THE ISLANDS" x={960} y={180} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10: (980 - 1100f / 32.67s - 36.67s) "that even the poorest families could afford and apply themselves." */}
      {/* ================================================================ */}
      <Sequence from={980} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={700} y={510} scale={1.35} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <DoodleStickman x={1220} y={540} scale={1.0} pose="holding_brush" expression="smile" shirtColor="#EA580C" shortsColor="#334155" />
          <StoryLabel text="AFFORDABLE TO ALL" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11: (1100 - 1220f / 36.67s - 40.67s) "It disinfected homes and helped hold back deadly disease." */}
      {/* ================================================================ */}
      <Sequence from={1100} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#047857" groundColor="#064E3B" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-260} y={-50} width={520} height={100} rx={16} fill="#DCFCE7" stroke="#15803D" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#15803D">HELD BACK DISEASE</text>
          </g>
          <StoryLabel text="ANTISEPTIC LIME BARRIER" x={960} y={180} fontSize={42} color="#FFFFFF" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 12: (1220 - 1340f / 40.67s - 44.67s) "And over time, it became a cherished tradition," */}
      {/* ================================================================ */}
      <Sequence from={1220} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={960} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="CHERISHED TRADITION" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13: (1340 - 1460f / 44.67s - 48.67s) "renewed year after year," */}
      {/* ================================================================ */}
      <Sequence from={1340} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140} showClouds>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0369A1">YEAR AFTER YEAR</text>
          </g>
          <StoryLabel text="ANNUAL RENEWAL" x={960} y={180} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 14: (1460 - 1580f / 48.67s - 52.67s) "until it grew into the very identity of these places." */}
      {/* ================================================================ */}
      <Sequence from={1460} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#1D4ED8">
          <DoodleStickman x={960} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="THE IDENTITY OF GREECE" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 15: (1580 - 1700f / 52.67s - 56.67s) "And that's the beautiful irony sitting at the heart of all this." */}
      {/* ================================================================ */}
      <Sequence from={1580} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={800} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="THE BEAUTIFUL IRONY" x={960} y={180} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 16: (1700 - 1820f / 56.67s - 60.67s) "Every tourist snapping a photo of those perfect white walls against a blue sky" */}
      {/* ================================================================ */}
      <Sequence from={1700} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={750} y={510} scale={1.35} pose="holding_camera" expression="smile" shirtColor="#EF4444" shortsColor="#1D4ED8" />
          <StoryLabel text="SNAPPING VACATION PHOTOS" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 17: (1820 - 1940f / 60.67s - 64.67s) "thinks they're capturing pure aesthetic magic." */}
      {/* ================================================================ */}
      <Sequence from={1820} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleSparkle x={700} y={300} size={44} color="#EC4899" />
          <DoodleSparkle x={1250} y={300} size={44} color="#EC4899" />
          <DoodleStickman x={960} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="AESTHETIC MAGIC" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 18: (1940 - 2060f / 64.67s - 68.67s) "What they're actually looking at is ancient survival technology," */}
      {/* ================================================================ */}
      <Sequence from={1940} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-280} y={-50} width={560} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0369A1">SURVIVAL TECHNOLOGY</text>
          </g>
          <StoryLabel text="NOT JUST AN AESTHETIC" x={960} y={180} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 19: (2060 - 2180f / 68.67s - 72.67s) "a sunshield, a disinfectant, an affordable solution," */}
      {/* ================================================================ */}
      <Sequence from={2060} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 500)">
            <g transform="translate(-400, 0)">
              <rect x={-140} y={-45} width={280} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
              <text x={0} y={14} textAnchor="middle" fontSize={28} fontWeight="bold" fill="#0284C7">✓ SUNSHIELD</text>
            </g>
            <g transform="translate(0, 0)">
              <rect x={-150} y={-45} width={300} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
              <text x={0} y={14} textAnchor="middle" fontSize={28} fontWeight="bold" fill="#15803D">✓ DISINFECTANT</text>
            </g>
            <g transform="translate(400, 0)">
              <rect x={-140} y={-45} width={280} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
              <text x={0} y={14} textAnchor="middle" fontSize={28} fontWeight="bold" fill="#7C3AED">✓ AFFORDABLE</text>
            </g>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 20: (2180 - 2300f / 72.67s - 76.67s) "born out of hard necessity." */}
      {/* ================================================================ */}
      <Sequence from={2180} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#1E293B" groundColor="#0F172A" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#18181B">HARD NECESSITY</text>
          </g>
          <StoryLabel text="SURVIVAL OVER BEAUTY" x={960} y={180} fontSize={42} color="#FFFFFF" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 21: (2300 - 2420f / 76.67s - 80.67s) "These communities never set out to build some of the most beautiful places on earth." */}
      {/* ================================================================ */}
      <Sequence from={2300} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={800} y={510} scale={1.35} pose="idle" expression="curious" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="BORN TO SURVIVE" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 22: (2420 - 2540f / 80.67s - 84.67s) "They set out to survive the heat, stop disease," */}
      {/* ================================================================ */}
      <Sequence from={2420} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(560, 480)">
            <rect x={-150} y={-50} width={300} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={12} textAnchor="middle" fontSize={34} fontWeight="bold" fill="#D97706">BEAT THE HEAT</text>
          </g>
          <g transform="translate(1360, 480)">
            <rect x={-150} y={-50} width={300} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={12} textAnchor="middle" fontSize={34} fontWeight="bold" fill="#15803D">STOP DISEASE</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 23: (2540 - 2660f / 84.67s - 88.67s) "and protect their families with whatever cheap materials they had on hand." */}
      {/* ================================================================ */}
      <Sequence from={2540} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={750} y={510} scale={1.3} pose="idle" expression="smile" shirtColor="#0284C7" shortsColor="#1E293B" />
          <DoodleStickman x={1170} y={510} scale={1.3} pose="idle" expression="smile" shirtColor="#EA580C" shortsColor="#1D4ED8" />
          <StoryLabel text="PROTECTING FAMILIES" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 24: (2660 - 2780f / 88.67s - 92.67s) "And almost by accident, they created a beauty so striking" */}
      {/* ================================================================ */}
      <Sequence from={2660} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleSparkle x={600} y={320} size={42} color="#FACC15" />
          <DoodleSparkle x={1350} y={320} size={42} color="#FACC15" />
          <DoodleStickman x={960} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="STRIKING ACCIDENTAL BEAUTY" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 25: (2780 - 2900f / 92.67s - 96.67s) "that people now travel across the world just to witness it." */}
      {/* ================================================================ */}
      <Sequence from={2780} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={600} y={510} scale={1.3} pose="holding_camera" expression="smile" shirtColor="#EF4444" shortsColor="#1D4ED8" />
          <DoodleStickman x={1320} y={510} scale={1.3} pose="holding_camera" expression="smile" shirtColor="#10B981" shortsColor="#334155" />
          <StoryLabel text="TRAVELING ACROSS THE WORLD" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 26: (2900 - 3020f / 96.67s - 100.67s) "It's a perfect reminder that so much of what we find beautiful in this world" */}
      {/* ================================================================ */}
      <Sequence from={2900} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={800} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="A PERFECT REMINDER" x={960} y={180} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 27: (3020 - 3140f / 100.67s - 104.67s) "started out as something intensely practical." (Modern White Roofs Intro) */}
      {/* ================================================================ */}
      <Sequence from={3020} durationInFrames={120}>
        <ModernWhiteRoofsScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 28: (3140 - 3260f / 104.67s - 108.67s) "Those white villages are what happens when human ingenuity" (Modern White Roofs Synthesis) */}
      {/* ================================================================ */}
      <Sequence from={3140} durationInFrames={120}>
        <ModernWhiteRoofsScene />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 29: (3260 - 3380f / 108.67s - 112.67s) "runs straight into a harsh environment." */}
      {/* ================================================================ */}
      <Sequence from={3260} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0369A1" groundColor="#B45309" horizonY={530} showSun sunX={1700} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-260} y={-50} width={520} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0369A1">HUMAN INGENUITY</text>
          </g>
          <StoryLabel text="MEETING A HARSH CLIMATE" x={960} y={180} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 30: (3380 - 3500f / 112.67s - 116.67s) "When people with almost nothing find a clever way" */}
      {/* ================================================================ */}
      <Sequence from={3380} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#047857">A CLEVER SOLUTION</text>
          </g>
          <StoryLabel text="BUILT WITH LOCAL RESOURCES" x={960} y={180} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 31: (3500 - 3620f / 116.67s - 120.67s) "to reflect the sun, fight disease, and endure." */}
      {/* ================================================================ */}
      <Sequence from={3500} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 500)">
            <g transform="translate(-400, 0)">
              <rect x={-140} y={-45} width={280} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
              <text x={0} y={14} textAnchor="middle" fontSize={28} fontWeight="bold" fill="#0284C7">✓ REFLECT SUN</text>
            </g>
            <g transform="translate(0, 0)">
              <rect x={-150} y={-45} width={300} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
              <text x={0} y={14} textAnchor="middle" fontSize={28} fontWeight="bold" fill="#15803D">✓ FIGHT DISEASE</text>
            </g>
            <g transform="translate(400, 0)">
              <rect x={-140} y={-45} width={280} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
              <text x={0} y={14} textAnchor="middle" fontSize={28} fontWeight="bold" fill="#7C3AED">✓ ENDURE</text>
            </g>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 32: (3620 - 3740f / 120.67s - 124.67s) "The stunning beauty we see today is just the visible signature of that ingenuity." */}
      {/* ================================================================ */}
      <Sequence from={3620} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={960} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="SIGNATURE OF INGENUITY" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 33: (3740 - 3860f / 124.67s - 128.67s) "Thousands of walls painted white over and over" */}
      {/* ================================================================ */}
      <Sequence from={3740} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={650} y={510} scale={1.3} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <DoodleStickman x={1250} y={510} scale={1.3} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" shortsColor="#EA580C" />
          <StoryLabel text="THOUSANDS OF WALLS" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 34: (3860 - 3980f / 128.67s - 132.67s) "by generations of people who more than anything" */}
      {/* ================================================================ */}
      <Sequence from={3860} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140} showVillageCluster>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0369A1">GENERATIONS OF PEOPLE</text>
          </g>
          <StoryLabel text="CENTURIES OF PRACTICAL WISDOM" x={960} y={180} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 35: (3980 - 4100f / 132.67s - 136.67s) "were just trying to stay cool," */}
      {/* ================================================================ */}
      <Sequence from={3980} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140}>
          <DoodleStickman x={800} y={510} scale={1.35} pose="sipping_drink" expression="smile" shirtColor="#FFFFFF" shortsColor="#0284C7" />
          <g transform="translate(1200, 480)">
            <rect x={-180} y={-50} width={360} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0284C7">1. STAY COOL</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 36: (4100 - 4220f / 136.67s - 140.67s) "stay healthy," */}
      {/* ================================================================ */}
      <Sequence from={4100} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#047857" groundColor="#064E3B" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-200} y={-50} width={400} height={100} rx={16} fill="#DCFCE7" stroke="#15803D" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={38} fontWeight="900" fill="#15803D">2. STAY HEALTHY</text>
          </g>
          <StoryLabel text="DISEASE PREVENTION" x={960} y={180} fontSize={42} color="#FFFFFF" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 37: (4220 - 4340f / 140.67s - 144.67s) "and survive under a relentless sun." */}
      {/* ================================================================ */}
      <Sequence from={4220} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#D97706">3. SURVIVE THE SUN</text>
          </g>
          <StoryLabel text="AN ENDURING SHIELD" x={960} y={180} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 38: (4340 - 4460f / 144.67s - 148.67s) "So the next time you see one of those breathtaking white villages" */}
      {/* ================================================================ */}
      <Sequence from={4340} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={960} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="BREATHTAKING VILLAGES" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 39: (4460 - 4580f / 148.67s - 152.67s) "glowing under a hot blue sky," */}
      {/* ================================================================ */}
      <Sequence from={4460} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleSparkle x={600} y={320} size={42} color="#FACC15" />
          <DoodleSparkle x={1350} y={320} size={42} color="#FACC15" />
          <StoryLabel text="GLOWING BLUE SKY" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 40: (4580 - 4700f / 152.67s - 156.67s) "look a little closer." */}
      {/* ================================================================ */}
      <Sequence from={4580} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={800} y={510} scale={1.35} pose="holding_magnifier" expression="curious" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="LOOK A LITTLE CLOSER" x={960} y={180} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 41: (4700 - 4820f / 156.67s - 160.67s) "You're not just looking at something beautiful." */}
      {/* ================================================================ */}
      <Sequence from={4700} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={34} fontWeight="bold" fill="#DC2626">NOT JUST BEAUTIFUL</text>
            <line x1={-220} y1={30} x2={220} y2={-30} stroke="#DC2626" strokeWidth={7} />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 42: (4820 - 4920f / 160.67s - 164.0s) "You're looking at one of the oldest, smartest survival tricks in human history," */}
      {/* ================================================================ */}
      <Sequence from={4820} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#0369A1" groundColor="#B45309" horizonY={530} showSun sunX={1700} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-280} y={-50} width={560} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0369A1">SMARTEST SURVIVAL TRICK</text>
          </g>
          <StoryLabel text="IN HUMAN HISTORY" x={960} y={180} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 43: (4920 - 4980f / 164.0s - 166.0s) "hiding in plain sight" */}
      {/* ================================================================ */}
      <Sequence from={4920} durationInFrames={60}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={800} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="HIDING IN PLAIN SIGHT" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 44: (4980 - 5051f / 166.0s - 168.36s) "disguised as a postcard." (Postcard vs Reality Climax) */}
      {/* ================================================================ */}
      <Sequence from={4980} durationInFrames={71}>
        <PostcardVsRealityScene />
      </Sequence>
    </div>
  );
};
