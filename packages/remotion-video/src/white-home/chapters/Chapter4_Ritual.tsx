import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { DoodleSparkle } from '../../animated-story/DoodleElements';
import { DoodleStickman } from '../../animated-story/DoodleStickman';
import {
  MediterraneanVillageBackdrop,
  StoryLabel,
  SummerSkyGroundEnv,
} from '../shared/StoryEnvironments';

/**
 * 🎬 Chapter 4: The Ritual (53.55s / 1,607 frames @ 30fps)
 * STRICT RULES:
 * - NO SFX (Voiceover only)
 * - NO BEAT > 5 SECONDS (Every beat <= 120 frames / < 4.0s)
 * - Exact transcript-synced visual pacing
 * - 100% Environmental backdrops
 */
export const Chapter4_Ritual: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#38BDF8' }}>
      {/* Voiceover Audio ONLY (Zero SFX) */}
      <Audio src={staticFile('audio/white_home/4 - The Ritual.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 75f / 0.0s - 2.5s) "and there's a lovely practical detail" */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={75}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={800} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="A PRACTICAL DETAIL" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (75 - 170f / 2.5s - 5.67s) "in how whitewashing became part of the rhythm of life here." */}
      {/* ================================================================ */}
      <Sequence from={75} durationInFrames={95}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140} showVillageCluster>
          {/* Circular Clock / Rhythm icon */}
          <g transform="translate(960, 480)">
            <circle cx={0} cy={0} r={100} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <line x1={0} y1={0} x2={0} y2={-65} stroke="#000" strokeWidth={6} strokeLinecap="round" />
            <line x1={0} y1={0} x2={45} y2={20} stroke="#DC2626" strokeWidth={5} strokeLinecap="round" />
            <circle cx={0} cy={0} r={8} fill="#000" />
            <StoryLabel text="RHYTHM OF LIFE" x={0} y={160} fontSize={44} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (170 - 280f / 5.67s - 9.33s) "Lime wash isn't permanent, like modern paint." */}
      {/* ================================================================ */}
      <Sequence from={170} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0369A1" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Modern Paint can crossed out */}
          <g transform="translate(960, 480)">
            <rect x={-180} y={-50} width={360} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="bold" fill="#DC2626">NOT MODERN PAINT</text>
            <line x1={-160} y1={30} x2={160} y2={-30} stroke="#DC2626" strokeWidth={7} />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (280 - 380f / 9.33s - 12.67s) "It weathers and fades, so it had to be reapplied" */}
      {/* ================================================================ */}
      <Sequence from={280} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#64748B" groundColor="#475569" horizonY={540} showSun={false}>
          <g transform="translate(960, 480)">
            <rect x={-200} y={-50} width={400} height={100} rx={16} fill="#E2E8F0" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="bold" fill="#334155">WEATHERS & FADES</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (380 - 490f / 12.67s - 16.33s) "regularly, often once or several times a year." */}
      {/* ================================================================ */}
      <Sequence from={380} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140} showClouds>
          {/* Calendar Widget */}
          <g transform="translate(960, 480)">
            <rect x={-120} y={-80} width={240} height={160} rx={14} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <rect x={-120} y={-80} width={240} height={45} rx={8} fill="#DC2626" />
            <text x={0} y={-50} textAnchor="middle" fontSize={24} fontWeight="900" fill="#FFFFFF">ANNUAL</text>
            <text x={0} y={30} textAnchor="middle" fontSize={50} fontWeight="900" fill="#18181B">SPRING</text>
            <StoryLabel text="REAPPLIED YEARLY" x={0} y={140} fontSize={40} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (490 - 600f / 16.33s - 20.0s) "So whitewashing became a ritual, a recurring" */}
      {/* ================================================================ */}
      <Sequence from={490} durationInFrames={110}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <g transform="translate(960, 680)">
            <rect x={-220} y={-45} width={440} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="bold" fill="#0284C7">A YEARLY RITUAL</text>
          </g>
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (600 - 690f / 20.0s - 23.0s) "communal act of renewal." */}
      {/* ================================================================ */}
      <Sequence from={600} durationInFrames={90}>
        <SummerSkyGroundEnv skyColor="#059669" groundColor="#D97706" horizonY={530} showSun sunX={1680} sunY={140} showVillageCluster>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#DCFCE7" stroke="#15803D" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#15803D">COMMUNAL RENEWAL</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (690 - 780f / 23.0s - 26.0s) "Families refreshed the white on their homes together," */}
      {/* ================================================================ */}
      <Sequence from={690} durationInFrames={90}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={680} y={510} scale={1.35} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <DoodleStickman x={1240} y={540} scale={1.0} pose="holding_brush" expression="smile" shirtColor="#EA580C" shortsColor="#334155" />
          <StoryLabel text="FAMILIES PAINT TOGETHER" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (780 - 890f / 26.0s - 29.67s) "keeping the village gleaming, keeping it cool," */}
      {/* ================================================================ */}
      <Sequence from={780} durationInFrames={110}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleSparkle x={600} y={320} size={42} color="#FACC15" />
          <DoodleSparkle x={1350} y={320} size={42} color="#FACC15" />
          <DoodleStickman x={960} y={510} scale={1.35} pose="sipping_drink" expression="smile" shirtColor="#FFFFFF" shortsColor="#0284C7" />
          <StoryLabel text="GLEAMING & COOL" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10: (890 - 990f / 29.67s - 33.0s) "keeping it clean. Over generations" */}
      {/* ================================================================ */}
      <Sequence from={890} durationInFrames={100}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <g transform="translate(960, 680)">
            <rect x={-200} y={-45} width={400} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontSize={34} fontWeight="bold" fill="#047857">✓ SPOTLESS & CLEAN</text>
          </g>
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11: (990 - 1100f / 33.0s - 36.67s) "that constant renewal is what kept these places brilliantly," */}
      {/* ================================================================ */}
      <Sequence from={990} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0369A1" groundColor="#B45309" horizonY={530} showSun sunX={1700} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={36} fontWeight="900" fill="#0369A1">CONSTANT RENEWAL</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 12: (1100 - 1200f / 36.67s - 40.0s) "perpetually white, and wove the color so deep" */}
      {/* ================================================================ */}
      <Sequence from={1100} durationInFrames={100}>
        <MediterraneanVillageBackdrop skyColor="#0284C7">
          <DoodleStickman x={960} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <DoodleSparkle x={680} y={320} size={40} color="#FACC15" />
          <DoodleSparkle x={1240} y={320} size={40} color="#FACC15" />
          <StoryLabel text="PERPETUALLY WHITE" x={960} y={95} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13: (1200 - 1320f / 40.0s - 44.0s) "into their identity that it became part of the yearly rhythm" */}
      {/* ================================================================ */}
      <Sequence from={1200} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#1D4ED8">
          <g transform="translate(960, 680)">
            <rect x={-220} y={-45} width={440} height={90} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <text x={0} y={14} textAnchor="middle" fontSize={34} fontWeight="bold" fill="#1D4ED8">CYCLADIC IDENTITY</text>
          </g>
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 14: (1320 - 1430f / 44.0s - 47.67s) "The white was never a one-time decision." */}
      {/* ================================================================ */}
      <Sequence from={1320} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <rect x={-240} y={-50} width={480} height={100} rx={16} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={15} textAnchor="middle" fontSize={34} fontWeight="bold" fill="#DC2626">NOT A ONE-TIME DECISION</text>
            <line x1={-220} y1={30} x2={220} y2={-30} stroke="#DC2626" strokeWidth={7} />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 15: (1430 - 1530f / 47.67s - 51.0s) "It was a living practice, renewed again and again" */}
      {/* ================================================================ */}
      <Sequence from={1430} durationInFrames={100}>
        <MediterraneanVillageBackdrop skyColor="#38BDF8">
          <DoodleStickman x={800} y={510} scale={1.35} pose="holding_brush" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <StoryLabel text="A LIVING PRACTICE" x={960} y={95} fontSize={44} color="#18181B" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 16: (1530 - 1607f / 51.0s - 53.55s) "by the same hands that lived there." */}
      {/* ================================================================ */}
      <Sequence from={1530} durationInFrames={77}>
        <SummerSkyGroundEnv skyColor="#EA580C" groundColor="#7C2D12" horizonY={530} showSun sunX={1680} sunY={140} showVillageCluster>
          <DoodleStickman x={750} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
          <DoodleStickman x={1170} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FEF3C7" shortsColor="#9A3412" />
          <StoryLabel text="HANDS OF THE VILLAGE" x={960} y={110} fontSize={44} color="#FFFFFF" />
        </SummerSkyGroundEnv>
      </Sequence>
    </div>
  );
};
