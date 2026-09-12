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

/**
 * 🎬 Chapter 2: The People's Paint (75.23s / 2,257 frames @ 30fps)
 * STRICT RULES:
 * - NO SFX (Voiceover only)
 * - NO BEAT > 5 SECONDS (Every beat <= 141 frames / < 4.7s)
 * - Exact transcript-synced visual pacing
 * - 100% Environmental backdrops
 */
export const Chapter2_PeoplePain: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#38BDF8' }}>
      {/* Voiceover Audio ONLY (Zero SFX) */}
      <Audio src={staticFile('audio/white_home/2 - the people pain.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 75f / 0.0s - 2.5s) "And that's where the story gets more interesting." */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={75}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={960} y={510} scale={1.4} pose="idle" expression="curious" pupilDirection="center" shirtColor="#FFFFFF" />
          <StoryLabel text="THE PLOT THICKENS" x={960} y={220} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (75 - 195f / 2.5s - 6.5s) "Because this white coating wasn't just any white paint." */}
      {/* ================================================================ */}
      <Sequence from={75} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={540} showSun sunX={1700} sunY={140}>
          {/* Modern Paint Can with Red Cross vs Traditional Clay Jar */}
          <g transform="translate(680, 500)">
            <rect x={-100} y={-100} width={200} height={220} rx={14} fill="#E2E8F0" stroke="#000000" strokeWidth={6} />
            <ellipse cx={0} cy={-100} rx={100} ry={25} fill="#CBD5E1" stroke="#000000" strokeWidth={5} />
            <line x1={-90} y1={-80} x2={90} y2={100} stroke="#DC2626" strokeWidth={12} strokeLinecap="round" />
            <line x1={90} y1={-80} x2={-90} y2={100} stroke="#DC2626" strokeWidth={12} strokeLinecap="round" />
            <StoryLabel text="NOT MODERN PAINT" x={0} y={-180} fontSize={34} color="#DC2626" />
          </g>

          <g transform="translate(1320, 500)">
            {/* Ancient Clay Terracotta Jar */}
            <path d="M -70 120 L 70 120 Q 90 20 60 -40 L 40 -80 L -40 -80 L -60 -40 Q -90 20 -70 120 Z" fill="#D97706" stroke="#000" strokeWidth={6} />
            <ellipse cx={0} cy={-80} rx={40} ry={12} fill="#B45309" stroke="#000" strokeWidth={4} />
            <StoryLabel text="ANCIENT SECRET" x={0} y={-180} fontSize={34} color="#0369A1" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (195 - 305f / 6.5s - 10.17s) "It was something specific, something cheap..." */}
      {/* ================================================================ */}
      <Sequence from={195} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={600} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" />
          {/* Falling Ancient Bronze/Copper Coins */}
          <g transform="translate(1260, 480)">
            {[-60, 0, 60].map((cx, i) => (
              <g key={i} transform={`translate(${cx}, ${i * 20})`}>
                <circle cx={0} cy={0} r={42} fill="#F59E0B" stroke="#78350F" strokeWidth={6} />
                <circle cx={0} cy={0} r={28} fill="none" stroke="#B45309" strokeWidth={4} />
                <text x={0} y={10} textAnchor="middle" fill="#78350F" fontSize={26} fontWeight="bold">
                  $
                </text>
              </g>
            ))}
            <StoryLabel text="SUPER CHEAP" x={0} y={-140} fontSize={40} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (305 - 385f / 10.17s - 12.83s) "...and something with an almost magical..." */}
      {/* ================================================================ */}
      <Sequence from={305} durationInFrames={80}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={540} showSun sunX={1700} sunY={140}>
          {/* Glowing magical bucket of whitewash */}
          <g transform="translate(960, 500)">
            <polygon points="-90,0 90,0 75,160 -75,160" fill="#FFFFFF" stroke="#000000" strokeWidth={7} />
            <ellipse cx={0} cy={0} rx={90} ry={25} fill="#F8FAFC" stroke="#000000" strokeWidth={5} />
            <circle cx={0} cy={-40} r={140} fill="none" stroke="#FACC15" strokeWidth={8} strokeDasharray="16 12" />
            <DoodleSparkle x={-110} y={-90} size={36} color="#FACC15" />
            <DoodleSparkle x={110} y={-90} size={36} color="#FACC15" />
            <StoryLabel text="MAGICAL PROPERTY" x={0} y={-230} fontSize={42} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (385 - 465f / 12.83s - 15.5s) "...extra property built in." */}
      {/* ================================================================ */}
      <Sequence from={385} durationInFrames={80}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={680} y={510} scale={1.35} pose="holding_magnifier" expression="curious" shirtColor="#FFFFFF" />
          <g transform="translate(1260, 440)">
            <circle cx={0} cy={0} r={100} fill="#FFFFFF" stroke="#0284C7" strokeWidth={8} />
            <text x={0} y={30} textAnchor="middle" fill="#0284C7" fontSize={90} fontWeight="900">
              ?
            </text>
            <StoryLabel text="SECRET POWER" x={0} y={-160} fontSize={36} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (465 - 605f / 15.5s - 20.17s) "It was lime wash, also called white wash." */}
      {/* ================================================================ */}
      <Sequence from={465} durationInFrames={140}>
        <MediterraneanVillageBackdrop>
          <g transform="translate(960, 220)">
            <rect x={-360} y={-50} width={720} height={100} rx={16} fill="#0F172A" stroke="#FFFFFF" strokeWidth={6} />
            <text x={0} y={18} textAnchor="middle" fill="#FFFFFF" fontSize={46} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              LIME WASH (WHITEWASH)
            </text>
          </g>
          <DoodleStickman x={960} y={640} scale={1.25} pose="waving" expression="smile" shirtColor="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (605 - 720f / 20.17s - 24.0s) "Lime wash comes from limestone that's been heated..." */}
      {/* ================================================================ */}
      <Sequence from={605} durationInFrames={115}>
        <SummerSkyGroundEnv skyColor="#EA580C" groundColor="#7C2D12" horizonY={540} showSun={false}>
          {/* Kiln tender worker */}
          <DoodleStickman x={520} y={520} scale={1.25} pose="wiping_sweat" expression="sweating" shirtColor="#EA580C" shortsColor="#451A03" />
          {/* Stone Kiln with Roaring Fire */}
          <g transform="translate(1060, 520)">
            {/* Kiln Stone Arch */}
            <path d="M -160 140 L -160 0 A 160 160 0 0 1 160 0 L 160 140 Z" fill="#44403C" stroke="#000" strokeWidth={8} />
            {/* Fire Chamber */}
            <path d="M -90 140 L -90 30 A 90 90 0 0 1 90 30 L 90 140 Z" fill="#EF4444" stroke="#000" strokeWidth={6} />
            {/* Flames */}
            <polygon points="-50,140 0,60 50,140" fill="#FACC15" />
            <polygon points="-20,140 0,90 20,140" fill="#FFFFFF" />
            {/* Limestone Rocks being heated */}
            <circle cx={-40} cy={-20} r={32} fill="#F1F5F9" stroke="#000" strokeWidth={4} />
            <circle cx={40} cy={-30} r={36} fill="#E2E8F0" stroke="#000" strokeWidth={4} />
            <circle cx={0} cy={-60} r={30} fill="#FFFFFF" stroke="#000" strokeWidth={4} />
            {/* Heat badge */}
            <g transform="translate(160, -30)">
              <rect x={-65} y={-24} width={130} height={48} rx={10} fill="#DC2626" stroke="#FFFFFF" strokeWidth={3} />
              <text x={0} y={8} textAnchor="middle" fontSize={24} fontWeight="900" fill="#FFFFFF">900°C</text>
            </g>
            <StoryLabel text="HEATED LIMESTONE (KILN)" x={0} y={-210} fontSize={40} color="#FFFFFF" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (720 - 795f / 24.0s - 26.5s) "...and then mixed with water." */}
      {/* ================================================================ */}
      <Sequence from={720} durationInFrames={75}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={540} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={600} y={510} scale={1.3} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" />
          {/* Water jug pouring water into the lime bucket with bubbling reaction */}
          <g transform="translate(1080, 500)">
            <polygon points="-80,20 80,20 65,160 -65,160" fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            {/* Water stream from jug */}
            <path d="M 90 -120 Q 30 -60 0 20" stroke="#38BDF8" strokeWidth={16} fill="none" strokeLinecap="round" />
            {/* Bubbles */}
            <circle cx={-30} cy={40} r={10} fill="#E2E8F0" stroke="#000" strokeWidth={3} />
            <circle cx={20} cy={50} r={8} fill="#E2E8F0" stroke="#000" strokeWidth={3} />
            <circle cx={-10} cy={80} r={12} fill="#E2E8F0" stroke="#000" strokeWidth={3} />
            <StoryLabel text="+ WATER = SLAKING" x={0} y={-180} fontSize={40} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (795 - 855f / 26.5s - 28.5s) "And here's the part that matters." */}
      {/* ================================================================ */}
      <Sequence from={795} durationInFrames={60}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140}>
          <DoodleStickman x={960} y={510} scale={1.4} pose="idle" expression="smile" pupilDirection="center" shirtColor="#FFFFFF" />
          <StoryLabel text="WHY IT WORKED" x={960} y={220} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10: (855 - 995f / 28.5s - 33.17s) "In a lot of these hot dry regions, limestone was everywhere." */}
      {/* ================================================================ */}
      <Sequence from={855} durationInFrames={140}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#E2B170" horizonY={520} showSun sunX={1680} sunY={140}>
          {/* Panoramic Limestone Hills / Cliffs */}
          <g stroke="#0F172A" strokeWidth={6} strokeLinejoin="round">
            <path d="M 0 520 Q 300 320 600 520" fill="#F8FAFC" />
            <path d="M 500 520 Q 900 280 1300 520" fill="#F1F5F9" />
            <path d="M 1200 520 Q 1550 340 1920 520" fill="#FFFFFF" />
          </g>
          <DoodleStickman x={420} y={520} scale={1.2} pose="idle" expression="smile" shirtColor="#EA580C" />
          <StoryLabel text="LIMESTONE EVERYWHERE" x={960} y={180} fontSize={44} color="#1E3A8A" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11: (995 - 1080f / 33.17s - 36.0s) "Cheap, local, sometimes practically a byproduct..." */}
      {/* ================================================================ */}
      <Sequence from={995} durationInFrames={85}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={540} showSun sunX={1680} sunY={140}>
          {/* Quarry worker */}
          <DoodleStickman x={560} y={510} scale={1.3} pose="idle" expression="smile" shirtColor="#EA580C" shortsColor="#78350F" />
          {/* Stone Quarry Cart */}
          <g transform="translate(1080, 520)">
            <rect x={-140} y={-60} width={280} height={120} fill="#78350F" stroke="#000" strokeWidth={6} rx={6} />
            <circle cx={-80} cy={70} r={32} fill="#44403C" stroke="#000" strokeWidth={6} />
            <circle cx={80} cy={70} r={32} fill="#44403C" stroke="#000" strokeWidth={6} />
            {/* White limestone blocks in cart */}
            <rect x={-100} y={-110} width={80} height={60} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <rect x={-10} y={-120} width={90} height={70} fill="#F1F5F9" stroke="#000" strokeWidth={5} />
            <StoryLabel text="QUARRY BYPRODUCT" x={0} y={-190} fontSize={40} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 12: (1080 - 1180f / 36.0s - 39.33s) "...of quarrying happening down the road." */}
      {/* ================================================================ */}
      <Sequence from={1080} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140} showVillageCluster>
          {/* Quarry worker with stone block on ground */}
          <DoodleStickman x={680} y={510} scale={1.35} pose="wiping_sweat" expression="sweating" shirtColor="#EA580C" shortsColor="#78350F" />
          {/* Pickaxe leaning next to stone */}
          <g transform="translate(930, 560) rotate(-25)">
            <line x1={0} y1={-60} x2={0} y2={60} stroke="#78350F" strokeWidth={8} strokeLinecap="round" />
            <path d="M -30 -60 Q 0 -45 30 -60" fill="none" stroke="#475569" strokeWidth={10} strokeLinecap="round" />
          </g>
          <g transform="translate(1120, 540)">
            <rect x={-90} y={-55} width={180} height={110} fill="#FFFFFF" stroke="#000" strokeWidth={6} rx={6} />
            <text x={0} y={12} textAnchor="middle" fontSize={26} fontWeight="bold" fill="#475569">LIMESTONE</text>
          </g>
          <StoryLabel text="LOCAL QUARRY BLOCK" x={960} y={220} fontSize={40} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13: (1180 - 1280f / 39.33s - 42.67s) "These weren't wealthy communities." */}
      {/* ================================================================ */}
      <Sequence from={1180} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={540} showSun sunX={1680} sunY={140}>
          {/* Humble Stone Cottage */}
          <g transform="translate(1100, 500)">
            <rect x={-180} y={-100} width={360} height={220} fill="#57534E" stroke="#1C1917" strokeWidth={7} rx={4} />
            <rect x={-40} y={20} width={70} height={100} fill="#1C1917" />
          </g>
          <DoodleStickman x={600} y={520} scale={1.3} pose="idle" expression="smile" shirtColor="#78350F" />
          <StoryLabel text="HUMBLE COMMUNITIES" x={960} y={200} fontSize={42} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 14: (1280 - 1380f / 42.67s - 46.0s) "They needed something they could actually afford..." */}
      {/* ================================================================ */}
      <Sequence from={1280} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={700} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" />
          <g transform="translate(1220, 480)">
            <rect x={-160} y={-50} width={320} height={100} rx={16} fill="#0F172A" stroke="#FFFFFF" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={38} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              ZERO BUDGET
            </text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 15: (1380 - 1490f / 46.0s - 49.67s) "...made from materials they already had access to." */}
      {/* ================================================================ */}
      <Sequence from={1380} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Free Natural Resources: Stone + Water */}
          <g transform="translate(960, 480)">
            <circle cx={-120} cy={0} r={70} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={-120} y={10} textAnchor="middle" fill="#18181B" fontSize={26} fontWeight="bold">
              ROCKS
            </text>

            <text x={0} y={15} textAnchor="middle" fill="#18181B" fontSize={48} fontWeight="900">
              +
            </text>

            <circle cx={120} cy={0} r={70} fill="#38BDF8" stroke="#000" strokeWidth={6} />
            <text x={120} y={10} textAnchor="middle" fill="#18181B" fontSize={26} fontWeight="bold">
              WATER
            </text>
            <StoryLabel text="NATURAL & FREE" x={0} y={-160} fontSize={40} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 16: (1490 - 1590f / 49.67s - 53.0s) "And lime wash fit perfectly." */}
      {/* ================================================================ */}
      <Sequence from={1490} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140}>
          {/* Big Green Checkmark */}
          <g transform="translate(960, 460)">
            <circle cx={0} cy={0} r={110} fill="#10B981" stroke="#065F46" strokeWidth={8} />
            <path d="M -50 -5 L -15 35 L 55 -35" stroke="#FFFFFF" strokeWidth={16} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <StoryLabel text="PERFECT FIT" x={0} y={180} fontSize={44} color="#065F46" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 17: (1590 - 1695f / 53.0s - 56.5s) "Cheap, plentiful, easy to make..." */}
      {/* ================================================================ */}
      <Sequence from={1590} durationInFrames={105}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          {/* 3 Pillars of Accessibility in Village Plaza */}
          <g transform="translate(360, 680)">
            <rect x={-150} y={-45} width={300} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fill="#047857" fontSize={36} fontWeight="bold">
              ✓ CHEAP
            </text>
          </g>
          <g transform="translate(960, 680)">
            <rect x={-160} y={-45} width={320} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fill="#0284C7" fontSize={36} fontWeight="bold">
              ✓ PLENTIFUL
            </text>
          </g>
          <g transform="translate(1560, 680)">
            <rect x={-150} y={-45} width={300} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fill="#7C3AED" fontSize={36} fontWeight="bold">
              ✓ EASY
            </text>
          </g>
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 18: (1695 - 1830f / 56.5s - 61.0s) "easy to apply with nothing more than a brush and your own hands." */}
      {/* ================================================================ */}
      <Sequence from={1695} durationInFrames={135}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140}>
          {/* Wall painting action */}
          <g transform="translate(1100, 480)">
            <rect x={-220} y={-110} width={440} height={240} fill="#57534E" stroke="#000" strokeWidth={7} rx={6} />
            {/* Mortar seams */}
            <line x1={-220} y1={-30} x2={220} y2={-30} stroke="#383431" strokeWidth={3} />
            <line x1={-220} y1={50} x2={220} y2={50} stroke="#383431" strokeWidth={3} />
            {/* Dynamic white paint coverage */}
            <path d="M -220 -110 L 120 -110 L 80 130 L -220 130 Z" fill="#FFFFFF" />
            <line x1={120} y1={-110} x2={80} y2={130} stroke="#0284C7" strokeWidth={5} strokeLinecap="round" />
          </g>
          <DoodleStickman x={620} y={510} scale={1.35} pose="holding_brush" expression="smile" shirtColor="#EA580C" />
          <StoryLabel text="JUST A BRUSH & HANDS" x={1100} y={200} fontSize={40} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 19: (1830 - 1950f / 61.0s - 65.0s) "It was, in effect, the people's paint." */}
      {/* ================================================================ */}
      <Sequence from={1830} durationInFrames={120}>
        <MediterraneanVillageBackdrop>
          <g transform="translate(960, 220)">
            <rect x={-320} y={-50} width={640} height={100} rx={16} fill="#0F172A" stroke="#FFFFFF" strokeWidth={6} />
            <text x={0} y={16} textAnchor="middle" fill="#FACC15" fontSize={48} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              THE PEOPLE'S PAINT
            </text>
          </g>
          <DoodleStickman x={960} y={640} scale={1.3} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 20: (1950 - 2080f / 65.0s - 69.33s) "And that affordability is a huge part of why entire villages..." */}
      {/* ================================================================ */}
      <Sequence from={1950} durationInFrames={130}>
        <MediterraneanVillageBackdrop>
          <DoodleStickman x={560} y={640} scale={1.15} pose="holding_brush" expression="smile" shirtColor="#EA580C" />
          <DoodleStickman x={1360} y={640} scale={1.15} pose="waving" expression="smile" shirtColor="#0284C7" />
          <StoryLabel text="AFFORDABLE FOR ALL" x={960} y={180} fontSize={44} color="#1E3A8A" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 21: (2080 - 2170f / 69.33s - 72.33s) "...ended up coated in white, not just the homes of the rich." */}
      {/* ================================================================ */}
      <Sequence from={2080} durationInFrames={90}>
        <MediterraneanVillageBackdrop>
          <g transform="translate(960, 200)">
            <rect x={-320} y={-45} width={640} height={90} rx={14} fill="#0F172A" stroke="#FFFFFF" strokeWidth={6} />
            <text x={0} y={14} textAnchor="middle" fill="#FACC15" fontSize={38} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              NOT JUST FOR THE WEALTHY
            </text>
          </g>
          <DoodleStickman x={600} y={640} scale={1.25} pose="holding_brush" expression="smile" shirtColor="#EA580C" />
          <DoodleStickman x={1320} y={640} scale={1.25} pose="waving" expression="smile" shirtColor="#0284C7" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 22: (2170 - 2257f / 72.33s - 75.23s) "Everyone could afford it." */}
      {/* ================================================================ */}
      <Sequence from={2170} durationInFrames={87}>
        <MediterraneanVillageBackdrop>
          <g transform="translate(960, 200)">
            <rect x={-300} y={-45} width={600} height={90} rx={14} fill="#FFFFFF" stroke="#0F172A" strokeWidth={6} />
            <text x={0} y={14} textAnchor="middle" fill="#0284C7" fontSize={42} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              EVERYONE COULD AFFORD IT
            </text>
          </g>
          <DoodleStickman x={960} y={640} scale={1.35} pose="waving" expression="smile" shirtColor="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>
    </div>
  );
};
