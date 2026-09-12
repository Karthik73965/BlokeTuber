import React from 'react';
import { Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  DOODLE_STROKE,
  DOODLE_WIDTH,
  DoodleCross,
  DoodleSparkle,
  DoodleSun,
  DoodleThermometer,
  DoodleWhiteHouse,
} from '../../animated-story/DoodleElements';
import { DoodleStickman } from '../../animated-story/DoodleStickman';
import {
  MediterraneanVillageBackdrop,
  PeelingPostcardScene,
  StoryLabel,
  SummerSkyGroundEnv,
} from '../shared/StoryEnvironments';

/**
 * 🎬 Chapter 0: The Hook (80.67s / 2,420 frames @ 30fps)
 * STRICT RULES:
 * - NO SFX (Voiceover only)
 * - NO BEAT > 5 SECONDS (Every beat <= 145 frames / < 4.8s)
 * - Exact transcript-synced visual pacing
 * - 100% Environmental backdrops (Zero plain white canvas)
 */
export const Chapter0_Hook: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#38BDF8' }}>
      {/* Voiceover Audio ONLY (Zero SFX) */}
      <Audio src={staticFile('audio/white_home/0 - hook.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 95f / 0.0s - 3.17s) "Go to the hottest sun-blasted parts of the world..." */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={95}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={540} showSun sunAngry sunX={1620} sunY={160}>
          {/* Sweating Explorer Stickman */}
          <DoodleStickman
            x={960}
            y={520}
            scale={1.35}
            pose="wiping_sweat"
            expression="sweating"
            hat="safari"
            shirtColor="#FFFFFF"
            shortsColor="#92400E"
          />
          <DoodleThermometer x={1320} y={480} tempPercent={0.9} label="115°F" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (95 - 180f / 3.17s - 6.0s) "...and you'll see the same thing over and over." */}
      {/* ================================================================ */}
      <Sequence from={95} durationInFrames={85}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={520} showSun sunX={1680} sunY={140}>
          <g transform="translate(240, 280)">
            <DoodleWhiteHouse x={0} y={180} scale={0.9} hasDome />
            <StoryLabel text="GREECE" x={0} y={290} fontSize={30} color="#1E3A8A" />
          </g>
          <g transform="translate(720, 280)">
            <DoodleWhiteHouse x={0} y={180} scale={0.9} />
            <StoryLabel text="SPAIN" x={0} y={290} fontSize={30} color="#9A3412" />
          </g>
          <g transform="translate(1200, 280)">
            <DoodleWhiteHouse x={0} y={180} scale={0.9} />
            <StoryLabel text="N. AFRICA" x={0} y={290} fontSize={30} color="#B45309" />
          </g>
          <g transform="translate(1620, 280)">
            <DoodleWhiteHouse x={0} y={180} scale={0.9} hasDome />
            <StoryLabel text="M. EAST" x={0} y={290} fontSize={30} color="#1E3A8A" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (180 - 285f / 6.0s - 9.5s) "The villages are white, not off-white, not cream..." */}
      {/* ================================================================ */}
      <Sequence from={180} durationInFrames={105}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1650} sunY={150}>
          {/* Paint swatches with Red X: NOT OFF-WHITE, NOT CREAM */}
          <g transform="translate(640, 480)">
            <rect x={-110} y={-90} width={220} height={180} rx={10} fill="#F4EDE4" stroke={DOODLE_STROKE} strokeWidth={6} />
            <line x1={-90} y1={-70} x2={90} y2={70} stroke="#DC2626" strokeWidth={12} strokeLinecap="round" />
            <line x1={90} y1={-70} x2={-90} y2={70} stroke="#DC2626" strokeWidth={12} strokeLinecap="round" />
            <StoryLabel text="NOT OFF-WHITE" x={0} y={135} fontSize={32} color="#DC2626" />
          </g>

          <g transform="translate(1280, 480)">
            <rect x={-110} y={-90} width={220} height={180} rx={10} fill="#FFFBEB" stroke={DOODLE_STROKE} strokeWidth={6} />
            <line x1={-90} y1={-70} x2={90} y2={70} stroke="#DC2626" strokeWidth={12} strokeLinecap="round" />
            <line x1={90} y1={-70} x2={-90} y2={70} stroke="#DC2626" strokeWidth={12} strokeLinecap="round" />
            <StoryLabel text="NOT CREAM" x={0} y={135} fontSize={32} color="#DC2626" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (285 - 405f / 9.5s - 13.5s) "...blinding, dazzling white." */}
      {/* ================================================================ */}
      <Sequence from={285} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1650} sunY={150}>
          <g transform="translate(560, 250)">
            <DoodleWhiteHouse x={60} y={200} scale={1.3} />
            <DoodleWhiteHouse x={320} y={150} scale={1.6} hasDome />
            <DoodleWhiteHouse x={620} y={210} scale={1.2} />

            <DoodleSparkle x={160} y={140} scale={1.4} />
            <DoodleSparkle x={480} y={90} scale={1.6} />
            <DoodleSparkle x={740} y={160} scale={1.3} />
          </g>
          <StoryLabel text="DAZZLING WHITE" x={960} y={120} fontSize={46} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (405 - 525f / 13.5s - 17.5s) "From cliff-side towns of the Greek islands..." */}
      {/* ================================================================ */}
      <Sequence from={405} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#1D4ED8" showPalms>
          <DoodleStickman
            x={960}
            y={520}
            scale={1.25}
            pose="waving"
            expression="smile"
            shirtColor="#2563EB"
            shortsColor="#1E3A8A"
          />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (525 - 645f / 17.5s - 21.5s) "...to sun-baked hill villages of southern Spain..." */}
      {/* ================================================================ */}
      <Sequence from={525} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={500} showSun sunX={1650} sunY={140}>
          {/* Spanish terracotta style hillside houses */}
          <g transform="translate(480, 480)">
            <rect x={-90} y={-70} width={180} height={140} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={5} rx={4} />
            <polygon points="-105,-70 0,-130 105,-70" fill="#EA580C" stroke={DOODLE_STROKE} strokeWidth={5} />
            <rect x={-25} y={10} width={50} height={60} fill="#78350F" />
          </g>
          <g transform="translate(860, 440)">
            <rect x={-110} y={-90} width={220} height={180} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={5} rx={4} />
            <polygon points="-125,-90 0,-160 125,-90" fill="#C2410C" stroke={DOODLE_STROKE} strokeWidth={5} />
            <rect x={-30} y={10} width={60} height={80} fill="#78350F" />
          </g>
          <g transform="translate(1260, 480)">
            <rect x={-90} y={-70} width={180} height={140} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={5} rx={4} />
            <polygon points="-105,-70 0,-130 105,-70" fill="#EA580C" stroke={DOODLE_STROKE} strokeWidth={5} />
            <rect x={-25} y={10} width={50} height={60} fill="#78350F" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (645 - 765f / 21.5s - 25.5s) "...North Africa, and the Middle East, entire settlements coated in white..." */}
      {/* ================================================================ */}
      <Sequence from={645} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={520} showSun sunX={1650} sunY={150}>
          {/* Desert Domes with Palm Trees */}
          <g transform="translate(960, 480)">
            <DoodleWhiteHouse x={-240} y={0} scale={1.3} hasDome />
            <DoodleWhiteHouse x={240} y={0} scale={1.3} hasDome />
            <DoodleWhiteHouse x={0} y={-40} scale={1.5} hasDome />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (765 - 870f / 25.5s - 29.0s) "...spilling down hillsides like sugar..." */}
      {/* ================================================================ */}
      <Sequence from={765} durationInFrames={105}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#E2B170" horizonY={480} showSun sunX={1650} sunY={150}>
          {/* Terraced Hill with Cascading White Sugar Cubes */}
          <path d="M 0 480 Q 600 400 1200 460 T 1920 450 L 1920 1080 L 0 1080 Z" fill="#C89666" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
          {[
            { x: 450, y: 380, s: 1.0 },
            { x: 680, y: 420, s: 1.2 },
            { x: 950, y: 460, s: 1.4 },
            { x: 1250, y: 510, s: 1.1 },
          ].map((h, i) => (
            <g key={i} transform={`translate(${h.x}, ${h.y}) scale(${h.s})`}>
              <rect x={-45} y={-45} width={90} height={75} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} rx={4} />
              <path d="M -45 -45 Q 0 -85 45 -45 Z" fill="#1D4ED8" stroke={DOODLE_STROKE} strokeWidth={4} />
            </g>
          ))}
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (870 - 975f / 29.0s - 32.5s) "...glowing under a sun that shows no mercy." */}
      {/* ================================================================ */}
      <Sequence from={870} durationInFrames={105}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={540} showSun sunAngry sunX={960} sunY={240}>
          {/* Heat waves beating down on village */}
          <g stroke="#DC2626" strokeWidth={5} fill="none" strokeLinecap="round">
            {[-250, -100, 100, 250].map((hx, i) => (
              <path
                key={i}
                d={`M ${960 + hx} 380 L ${960 + hx} 520`}
                transform={`translate(0, ${(frame * 3) % 25})`}
              />
            ))}
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10: (975 - 1095f / 32.5s - 36.5s) "Millions of tourists fly across the planet every year..." */}
      {/* ================================================================ */}
      <Sequence from={975} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#E2B170" horizonY={560} showSun sunX={1650} sunY={140}>
          {/* Airplane flying across Mediterranean sky */}
          <g transform={`translate(${interpolate(frame - 975, [0, 120], [-100, 1800])}, 220)`}>
            <ellipse cx={0} cy={0} rx={90} ry={24} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={5} />
            <polygon points="-40,-10 0,-65 20,-10" fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
            <polygon points="-40,10 0,65 20,10" fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={4} />
            <polygon points="-90,-2 -70,-35 -50,-2" fill="#2563EB" stroke={DOODLE_STROKE} strokeWidth={4} />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11: (1095 - 1215f / 36.5s - 40.5s) "...just to photograph those gleaming walls against a deep blue sky." */}
      {/* ================================================================ */}
      <Sequence from={1095} durationInFrames={120}>
        <MediterraneanVillageBackdrop skyColor="#2563EB" showPalms>
          {/* Tourists taking photos with cameras */}
          <DoodleStickman x={440} y={520} scale={1.2} pose="holding_camera" expression="smile" shirtColor="#DC2626" shortsColor="#2563EB" />
          <DoodleStickman x={820} y={530} scale={1.15} pose="holding_camera" expression="grin" shirtColor="#FACC15" shortsColor="#1E3A8A" />
          <DoodleStickman x={1220} y={520} scale={1.2} pose="holding_camera" expression="smile" shirtColor="#16A34A" shortsColor="#DC2626" />
          <DoodleStickman x={1580} y={530} scale={1.1} pose="waving" expression="smile" shirtColor="#EA580C" shortsColor="#1E3A8A" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 12: (1215 - 1305f / 40.5s - 43.5s) "But here's what almost none of them know." */}
      {/* ================================================================ */}
      <Sequence from={1215} durationInFrames={90}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={520} showSun sunX={1650} sunY={160}>
          {/* Zoomed in Tourist turning puzzled */}
          <DoodleStickman x={960} y={480} scale={1.4} pose="idle" expression="confused" shirtColor="#DC2626" shortsColor="#2563EB" />
          <text x={1080} y={350} fontSize={100} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900" fill="#D97706" stroke={DOODLE_STROKE} strokeWidth={4}>?</text>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13: (1305 - 1410f / 43.5s - 47.0s) "These villages weren't painted white to look beautiful." */}
      {/* ================================================================ */}
      <Sequence from={1305} durationInFrames={105}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={520} showSun sunX={1650} sunY={160}>
          <g transform="translate(960, 480)">
            <ellipse cx={0} cy={0} rx={100} ry={70} fill="#FEF08A" stroke={DOODLE_STROKE} strokeWidth={6} />
            <circle cx={-40} cy={-20} r={12} fill="#EF4444" />
            <circle cx={0} cy={-30} r={12} fill="#3B82F6" />
            <circle cx={40} cy={-15} r={12} fill="#22C55E" />
            <line x1={-120} y1={-90} x2={120} y2={90} stroke="#DC2626" strokeWidth={14} strokeLinecap="round" />
            <line x1={120} y1={-90} x2={-120} y2={90} stroke="#DC2626" strokeWidth={14} strokeLinecap="round" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 14: (1410 - 1545f / 47.0s - 51.5s) "Not at first. That blinding white wasn't an aesthetic choice." */}
      {/* ================================================================ */}
      <Sequence from={1410} durationInFrames={135}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D4A373" horizonY={520} showSun sunAngry sunX={1650} sunY={150}>
          <g transform="translate(960, 480)">
            <DoodleStickman x={0} y={0} scale={1.3} pose="idle" expression="confused" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
            <text x={110} y={-80} fontSize={85} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900" fill="#D97706" stroke={DOODLE_STROKE} strokeWidth={4}>?</text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 15: (1545 - 1650f / 51.5s - 55.0s) "It was a survival decision." */}
      {/* ================================================================ */}
      <Sequence from={1545} durationInFrames={105}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={520} showSun sunAngry sunX={1650} sunY={150}>
          {/* Family protected under reflective canopy */}
          <g transform="translate(960, 480)">
            <path d="M -220 60 Q 0 -160 220 60" fill="none" stroke="#38BDF8" strokeWidth={14} strokeLinecap="round" />
            {/* Heat rays deflecting */}
            <path d="M -100 -200 L -50 -100 L -120 -80" stroke="#EF4444" strokeWidth={6} fill="none" strokeLinecap="round" />
            <path d="M 100 -200 L 50 -100 L 120 -80" stroke="#EF4444" strokeWidth={6} fill="none" strokeLinecap="round" />

            <DoodleStickman x={-50} y={10} scale={1.1} expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
            <DoodleStickman x={50} y={20} scale={0.9} expression="smile" shirtColor="#FFFFFF" shortsColor="#1D4ED8" />
            <StoryLabel text="SURVIVAL" x={0} y={160} fontSize={44} color="#059669" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 16: (1650 - 1770f / 55.0s - 59.0s) "Every single one of those white walls is leftover proof..." */}
      {/* ================================================================ */}
      <Sequence from={1650} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={540} showSun sunAngry sunX={1650} sunY={150}>
          {/* Painting Dark Stone Wall */}
          <g transform="translate(960, 480)">
            <rect x={-350} y={-180} width={700} height={320} rx={6} fill="#78716C" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
            <rect x={-340} y={-170} width={360} height={300} fill="#FFFFFF" rx={4} />
            <g transform="translate(140, 10)">
              <DoodleStickman x={0} y={-30} scale={1.25} pose="holding_brush" expression="grin" shirtColor="#FACC15" shortsColor="#78350F" />
            </g>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 17: (1770 - 1870f / 59.0s - 62.33s) "...of practical solutions people came up with..." */}
      {/* ================================================================ */}
      <Sequence from={1770} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={540} showSun sunAngry sunX={1650} sunY={150}>
          {/* Wall is now fully coated white and gleaming */}
          <g transform="translate(960, 480)">
            <rect x={-350} y={-180} width={700} height={320} rx={6} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
            <DoodleSparkle x={-120} y={-80} scale={1.4} />
            <DoodleSparkle x={160} y={40} scale={1.3} />
            <DoodleStickman x={0} y={20} scale={1.2} pose="waving" expression="grin" shirtColor="#2563EB" shortsColor="#1E3A8A" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 18: (1870 - 1965f / 62.33s - 65.5s) "...to survive under a sun that could kill you." */}
      {/* ================================================================ */}
      <Sequence from={1870} durationInFrames={95}>
        <SummerSkyGroundEnv skyColor="#EA580C" groundColor="#C89666" horizonY={540} showSun sunAngry sunX={1650} sunY={150}>
          {/* Blazing sun rays bouncing away from white house */}
          <g transform="translate(960, 490)">
            <DoodleWhiteHouse x={0} y={-30} scale={1.7} hasDome />
            <g stroke="#FACC15" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M -180 -300 L -90 -160 L -180 -40" />
              <path d="M 180 -300 L 90 -160 L 180 -40" />
            </g>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 19: (1965 - 2085f / 65.5s - 69.5s) "And once you understand why they really did it..." */}
      {/* ================================================================ */}
      <Sequence from={1965} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D4A373" horizonY={530} showSun sunX={1650} sunY={150}>
          {/* Scholar Stickman with lightbulb of understanding */}
          <g transform="translate(960, 490)">
            <DoodleStickman x={0} y={0} scale={1.35} pose="idle" expression="smile" shirtColor="#22C55E" shortsColor="#1E3A8A" />
            {/* Glowing yellow lightbulb */}
            <g transform="translate(90, -80)">
              <circle cx={0} cy={0} r={28} fill="#FEF08A" stroke={DOODLE_STROKE} strokeWidth={4} />
              <rect x={-10} y={24} width={20} height={14} fill="#94A3B8" stroke={DOODLE_STROKE} strokeWidth={3} />
            </g>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 20: (2085 - 2195f / 69.5s - 73.17s) "...one of the oldest pieces of climate tech humans ever invented." */}
      {/* ================================================================ */}
      <Sequence from={2085} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#D4A373" horizonY={530} showSun sunX={1650} sunY={150}>
          {/* White house with blueprint tech vectors */}
          <g transform="translate(960, 480)">
            <DoodleWhiteHouse x={0} y={-30} scale={1.8} hasDome />
            <StoryLabel text="ANCIENT TECH" x={0} y={-380} fontSize={46} color="#FFFFFF" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 21: (2195 - 2295f / 73.17s - 76.5s) "Just hiding in plain sight..." */}
      {/* ================================================================ */}
      <Sequence from={2195} durationInFrames={100}>
        {/* Postcard resting flat on desk */}
        <PeelingPostcardScene peelProgress={0} />
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 22: (2295 - 2420f / 76.5s - 80.67s) "...dressed up as a postcard." */}
      {/* ================================================================ */}
      <Sequence from={2295} durationInFrames={125}>
        {(() => {
          const peelProg = interpolate(frame - 2295, [0, 95], [0, 1], {
            extrapolateRight: 'clamp',
          });
          return <PeelingPostcardScene peelProgress={peelProg} />;
        })()}
      </Sequence>
    </div>
  );
};
