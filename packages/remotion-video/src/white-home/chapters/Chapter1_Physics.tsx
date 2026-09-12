import React from 'react';
import { Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  DOODLE_STROKE,
  DOODLE_WIDTH,
  DoodleCross,
  DoodleRayArrow,
  DoodleSparkle,
  DoodleSun,
  DoodleThermometer,
  DoodleWhiteHouse,
} from '../../animated-story/DoodleElements';
import { DoodleStickman } from '../../animated-story/DoodleStickman';
import {
  MediterraneanVillageBackdrop,
  ParkingLotEnv,
  StoryLabel,
  SummerSkyGroundEnv,
} from '../shared/StoryEnvironments';

/**
 * 🎬 Chapter 1: The Physics (159.16s / 4,775 frames @ 30fps)
 * STRICT DIRECTIVES:
 * 1. ZERO SFX (Voiceover only)
 * 2. BEATS STRICTLY < 5 SECONDS (Every beat <= 140 frames / < 4.7s)
 * 3. 100% Environmental Backdrops
 * 4. Exact Whisper Audio Sync
 * 5. Upright Giant T-Shirt & House fix (ref_112s.jpg & 2.png)
 * 6. High-contrast typography & zero text collisions
 */
export const Chapter1_Physics: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#38BDF8' }}>
      {/* Voiceover Audio ONLY (Zero SFX) */}
      <Audio src={staticFile('audio/white_home/1 — The Physics.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 95f / 0.0s - 3.17s) "So let's get into the real reasons, starting with the biggest one..." */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={95}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
          <rect x={60} y={60} width={1800} height={960} rx={16} fill="#1E293B" stroke="#94A3B8" strokeWidth={8} />

          <DoodleStickman
            x={460}
            y={520}
            scale={1.35}
            pose="pointing_board"
            expression="smile"
            shirtColor="#FFFFFF"
            shortsColor="#2563EB"
            pupilDirection="up_right"
          />

          <g transform="translate(1200, 480)">
            <rect x={-320} y={-160} width={640} height={320} rx={12} fill="#0F172A" stroke="#38BDF8" strokeWidth={6} strokeDasharray="12 8" />
            <text x={0} y={-40} textAnchor="middle" fill="#FFFFFF" fontSize={52} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="bold">
              THE LAWS OF
            </text>
            <text x={0} y={60} textAnchor="middle" fill="#FACC15" fontSize={72} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              PHYSICS
            </text>
          </g>
        </svg>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (95 - 180f / 3.17s - 6.0s) "...the one written straight into the laws of physics. White reflects sunlight." */}
      {/* ================================================================ */}
      <Sequence from={95} durationInFrames={85}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
          <rect x={60} y={60} width={1800} height={960} rx={16} fill="#1E293B" stroke="#94A3B8" strokeWidth={8} />

          <g transform="translate(960, 480)">
            <circle cx={0} cy={-130} r={80} fill="#FACC15" stroke="#FFFFFF" strokeWidth={6} />
            {/* Bright Radiation Beams */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map((ang, i) => {
              const rad = (ang * Math.PI) / 180;
              return (
                <line
                  key={i}
                  x1={Math.cos(rad) * 105}
                  y1={-130 + Math.sin(rad) * 105}
                  x2={Math.cos(rad) * 145}
                  y2={-130 + Math.sin(rad) * 145}
                  stroke="#FDE047"
                  strokeWidth={6}
                  strokeLinecap="round"
                />
              );
            })}
            {/* White Wall Deflecting Beam */}
            <path d="M -150 140 L 150 140" stroke="#FFFFFF" strokeWidth={24} strokeLinecap="round" />
            <path d="M -60 -20 L 0 120 L 140 0" stroke="#38BDF8" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x={0} y={230} textAnchor="middle" fill="#FFFFFF" fontSize={56} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              WHITE REFLECTS SUNLIGHT
            </text>
          </g>
        </svg>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (180 - 280f / 6.0s - 9.33s) "That one fact is the key..." */}
      {/* ================================================================ */}
      <Sequence from={180} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={600} y={510} scale={1.35} pose="holding_magnifier" expression="smile" shirtColor="#FFFFFF" />
          {/* Golden Key Graphic */}
          <g transform="translate(1260, 440)">
            <circle cx={-60} cy={0} r={55} fill="none" stroke="#FACC15" strokeWidth={16} />
            <circle cx={-60} cy={0} r={25} fill="#FACC15" />
            <line x1={-5} y1={0} x2={160} y2={0} stroke="#FACC15" strokeWidth={22} strokeLinecap="round" />
            <line x1={110} y1={0} x2={110} y2={45} stroke="#FACC15" strokeWidth={18} strokeLinecap="round" />
            <line x1={150} y1={0} x2={150} y2={60} stroke="#FACC15" strokeWidth={18} strokeLinecap="round" />
            <StoryLabel text="THE MASTER KEY" x={50} y={-90} fontSize={40} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (280 - 390f / 9.33s - 13.0s) "...to everything else in this story." */}
      {/* ================================================================ */}
      <Sequence from={280} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1660} sunY={140}>
          {/* Scorching Heat vs White Sanctuary Split */}
          <g transform="translate(480, 480)">
            <DoodleWhiteHouse x={0} y={40} scale={0.9} />
            <DoodleStickman x={-120} y={40} scale={1.05} pose="idle" expression="smile" shirtColor="#FFFFFF" />
            <StoryLabel text="COOL REFUGE" x={0} y={-160} fontSize={36} color="#0369A1" />
          </g>
          <g transform="translate(1440, 480)">
            <DoodleStickman x={0} y={40} scale={1.05} pose="wiping_sweat" expression="sweating" shirtColor="#FFFFFF" shortsColor="#78350F" />
            <DoodleThermometer x={140} y={20} tempPercent={0.95} label="115°F" />
            <StoryLabel text="DESERT HEAT" x={0} y={-160} fontSize={36} color="#DC2626" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (390 - 490f / 13.0s - 16.33s) "Here's what actually happens when sunlight hits a surface." */}
      {/* ================================================================ */}
      <Sequence from={390} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={580} showSun sunX={960} sunY={180} sunAngry={false}>
          {/* Animated Sun Beams shooting down */}
          <g stroke="#FACC15" strokeWidth={8} strokeLinecap="round">
            <line x1={960} y1={280} x2={960} y2={480} strokeDasharray="16 12" />
            <line x1={860} y1={260} x2={720} y2={470} strokeDasharray="16 12" />
            <line x1={1060} y1={260} x2={1200} y2={470} strokeDasharray="16 12" />
          </g>
          <StoryLabel text="SUNLIGHT HITS SURFACE" x={960} y={640} fontSize={40} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (490 - 590f / 16.33s - 19.67s) "Sunlight carries energy, and when it strikes something, that energy has to go somewhere." */}
      {/* ================================================================ */}
      <Sequence from={490} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={540} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={520} y={520} scale={1.3} pose="idle" expression="curious" pupilDirection="up_right" shirtColor="#FFFFFF" />
          {/* Big Energy Ray striking ground */}
          <g transform="translate(1180, 360)">
            <line x1={-180} y1={-180} x2={0} y2={120} stroke="#FACC15" strokeWidth={18} strokeLinecap="round" />
            <circle cx={0} cy={120} r={32} fill="#EF4444" />
            {/* Impact Sparkles */}
            <DoodleSparkle x={-40} y={90} size={30} color="#FACC15" />
            <DoodleSparkle x={40} y={90} size={30} color="#FACC15" />
            <StoryLabel text="SOLAR ENERGY" x={-100} y={-80} fontSize={36} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (590 - 690f / 19.67s - 23.0s) "A dark surface absorbs most of it..." */}
      {/* ================================================================ */}
      <Sequence from={590} durationInFrames={100}>
        <ParkingLotEnv>
          {/* Zoom on dark asphalt soaking up yellow rays */}
          <g transform="translate(960, 480)">
            {/* Downward rays being absorbed into dark asphalt */}
            <g stroke="#FACC15" strokeWidth={8} strokeLinecap="round">
              <line x1={-200} y1={-180} x2={-160} y2={40} />
              <line x1={0} y1={-180} x2={0} y2={40} />
              <line x1={200} y1={-180} x2={160} y2={40} />
            </g>
            {/* Heat spreading inside the pavement */}
            <ellipse cx={0} cy={60} rx={320} ry={70} fill="#EF4444" opacity={0.35} />
            <StoryLabel text="DARK SURFACE ABSORBS" x={0} y={-220} fontSize={42} color="#18181B" />
          </g>
        </ParkingLotEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (690 - 790f / 23.0s - 26.33s) "...and absorbed light becomes heat..." */}
      {/* ================================================================ */}
      <Sequence from={690} durationInFrames={100}>
        <ParkingLotEnv>
          <g transform="translate(760, 520)">
            <DoodleStickman x={0} y={0} scale={1.3} pose="wiping_sweat" expression="sweating" shirtColor="#FFFFFF" shortsColor="#78350F" />
          </g>
          {/* Thermometer surging up */}
          <g transform="translate(1260, 500)">
            <DoodleThermometer x={0} y={0} height={280} tempPercent={0.92} label="140°F" themeColor="#DC2626" />
            <StoryLabel text="LIGHT BECOMES HEAT" x={0} y={-280} fontSize={38} color="#DC2626" />
          </g>
        </ParkingLotEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (790 - 890f / 26.33s - 29.67s) "...which is exactly why a black car in a parking lot..." */}
      {/* ================================================================ */}
      <Sequence from={790} durationInFrames={100}>
        <ParkingLotEnv>
          {/* Stickman dreading approaching the boiling black car */}
          <DoodleStickman x={420} y={620} scale={1.25} pose="panicking" expression="sweating" pupilDirection="down" shirtColor="#FFFFFF" />
          {/* Black Car SVG */}
          <g transform="translate(1100, 600)">
            <path
              d="M -220 40 L -180 -40 L -80 -80 L 120 -80 L 200 -20 L 260 0 L 260 60 L -220 60 Z"
              fill="#18181B"
              stroke="#000000"
              strokeWidth={8}
            />
            <polygon points="-70,-70 100,-70 160,-20 -70,-20" fill="#38BDF8" stroke="#000000" strokeWidth={5} />
            <polygon points="-85,-70 -160,-35 -85,-20" fill="#38BDF8" stroke="#000000" strokeWidth={5} />
            <circle cx={-130} cy={60} r={42} fill="#334155" stroke="#000000" strokeWidth={8} />
            <circle cx={-130} cy={60} r={18} fill="#94A3B8" />
            <circle cx={180} cy={60} r={42} fill="#334155" stroke="#000000" strokeWidth={8} />
            <circle cx={180} cy={60} r={18} fill="#94A3B8" />
            <g stroke="#EF4444" strokeWidth={5} fill="none" opacity={0.8} strokeLinecap="round">
              {[-60, 0, 60, 120].map((hx, i) => (
                <path
                  key={i}
                  d={`M ${hx} -90 Q ${hx + 15} -140 ${hx} -180 Q ${hx - 15} -220 ${hx} -260`}
                />
              ))}
            </g>
          </g>
          <StoryLabel text="BLACK CAR (130°F)" x={1100} y={300} fontSize={40} color="#18181B" arrowTo={{ x: 1100, y: 460 }} />
        </ParkingLotEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10: (890 - 990f / 29.67s - 33.0s) "...turns into an oven..." */}
      {/* ================================================================ */}
      <Sequence from={890} durationInFrames={100}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#450A0A" />
          {/* Car Interior Oven View */}
          <g transform="translate(960, 540)">
            <circle cx={0} cy={0} r={460} fill="#7F1D1D" stroke="#EF4444" strokeWidth={12} />
            {/* Steering Wheel */}
            <circle cx={0} cy={160} r={140} fill="none" stroke="#18181B" strokeWidth={24} />
            <line x1={-140} y1={160} x2={140} y2={160} stroke="#18181B" strokeWidth={20} />
            {/* Trapped Stickman Sweating */}
            <DoodleStickman x={0} y={-40} scale={1.4} pose="panicking" expression="sweating" shirtColor="#18181B" />
            {/* Wavy Heat lines rising inside car */}
            <g stroke="#F87171" strokeWidth={6} fill="none" opacity={0.9} strokeLinecap="round">
              {[-180, -90, 90, 180].map((hx, i) => (
                <path
                  key={i}
                  d={`M ${hx} 300 Q ${hx + 20} 180 ${hx} 60 Q ${hx - 20} -60 ${hx} -180`}
                  transform={`translate(0, ${-(frame * 3) % 40})`}
                />
              ))}
            </g>
            <StoryLabel text="OVEN: 130°F+" x={0} y={-360} fontSize={46} color="#FFFFFF" />
          </g>
        </svg>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11: (990 - 1090f / 33.0s - 36.33s) "...and why a black shirt makes you sweat through a summer afternoon." */}
      {/* ================================================================ */}
      <Sequence from={990} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunAngry sunX={1650} sunY={150}>
          {/* Stickman in black shirt wiping sweat */}
          <DoodleStickman
            x={960}
            y={520}
            scale={1.4}
            pose="wiping_sweat"
            expression="sweating"
            shirtColor="#18181B"
            shortsColor="#18181B"
          />
          {/* Heat squiggles radiating from black shirt */}
          <g stroke="#EF4444" strokeWidth={5} fill="none" opacity={0.8} strokeLinecap="round">
            {[-80, -40, 40, 80].map((hx, i) => (
              <path
                key={i}
                d={`M ${960 + hx} 580 Q ${960 + hx + 15} 530 ${960 + hx} 480 Q ${960 + hx - 15} 430 ${960 + hx} 380`}
              />
            ))}
          </g>
          <StoryLabel text="BLACK SHIRT SOAKS HEAT" x={960} y={230} fontSize={38} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 12: (1090 - 1190f / 36.33s - 39.67s) "Dark colors soak up the sun's energy and heat up fast." */}
      {/* ================================================================ */}
      <Sequence from={1090} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={540} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 460)">
            {/* Dark square patch of fabric absorbing rays */}
            <rect x={-180} y={-140} width={360} height={280} rx={16} fill="#18181B" stroke="#000000" strokeWidth={6} />
            <g stroke="#FACC15" strokeWidth={8} strokeLinecap="round">
              <line x1={-120} y1={-240} x2={-60} y2={-100} />
              <line x1={0} y1={-240} x2={0} y2={-100} />
              <line x1={120} y1={-240} x2={60} y2={-100} />
            </g>
            <text x={0} y={20} textAnchor="middle" fill="#EF4444" fontSize={42} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              HEAT TRAPPED
            </text>
            <StoryLabel text="DARK SOAKS ENERGY" x={0} y={220} fontSize={36} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13: (1190 - 1320f / 39.67s - 44.0s) "White does the opposite. (ref_107s.jpg exact recreation)" */}
      {/* ================================================================ */}
      <Sequence from={1190} durationInFrames={130}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1720} sunY={130}>
          {/* Top Title: SUMMER MIDDAY. */}
          <g transform="translate(960, 110)">
            <text
              x={0}
              y={0}
              textAnchor="middle"
              fontSize={56}
              fontFamily="'Comic Sans MS', cursive, sans-serif"
              fontWeight="900"
              fill="#18181B"
              letterSpacing="3px"
            >
              SUMMER MIDDAY.
            </text>
          </g>

          {/* LEFT: White Shirt Stickman (Reflects Heat) */}
          <g transform="translate(620, 530)">
            <DoodleStickman
              x={0}
              y={0}
              scale={1.4}
              pose="idle"
              expression="smile"
              shirtColor="#FFFFFF"
            />
            {/* Yellow Bouncing Reflection Rays (ref_107s.jpg style) */}
            <g stroke="#FACC15" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M -160 -100 L -80 -10 L -160 70" />
              <path d="M -140 -20 L -60 30 L -130 100" />
              <path d="M 80 -100 L 120 0 L 190 40" />
              <path d="M 60 10 L 130 60 L 200 120" />
            </g>
            <StoryLabel
              text="REFLECTS HEAT"
              x={220}
              y={-140}
              fontSize={34}
              color="#18181B"
              arrowTo={{ x: 140, y: -40 }}
              arrowCurve="right"
            />
          </g>

          {/* RIGHT: Black Shirt Stickman (Absorbs Heat) */}
          <g transform="translate(1320, 530)">
            <DoodleStickman
              x={0}
              y={0}
              scale={1.4}
              pose="wiping_sweat"
              expression="sweating"
              shirtColor="#18181B"
            />
            {/* Red Wavy Heat Lines */}
            <g stroke="#EF4444" strokeWidth={5} fill="none" opacity={0.8} strokeLinecap="round">
              {[-80, -40, 40, 80].map((hx, i) => (
                <path
                  key={i}
                  d={`M ${hx} 100 Q ${hx + 15} 50 ${hx} 0 Q ${hx - 15} -50 ${hx} -90`}
                />
              ))}
            </g>
            <StoryLabel
              text="ABSORBS HEAT"
              x={240}
              y={-40}
              fontSize={34}
              color="#18181B"
              arrowTo={{ x: 120, y: 10 }}
              arrowCurve="right"
            />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 14: (1320 - 1440f / 44.0s - 48.0s) "...It reflects most of that sunlight straight back instead of absorbing it..." */}
      {/* ================================================================ */}
      <Sequence from={1320} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={560} showSun sunX={1680} sunY={140}>
          {/* Close up on white fabric cleanly ricocheting solar beams */}
          <g transform="translate(960, 480)">
            <rect x={-180} y={-140} width={360} height={280} rx={16} fill="#FFFFFF" stroke="#000000" strokeWidth={6} />
            <g stroke="#0284C7" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M -120 -220 L -40 -100 L -140 0" />
              <path d="M 0 -220 L 60 -100 L 0 0" />
              <path d="M 120 -220 L 160 -100 L 120 0" />
            </g>
            <StoryLabel text="BOUNCES LIGHT AWAY" x={0} y={220} fontSize={38} color="#0369A1" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 15: (1440 - 1540f / 48.0s - 51.33s) "...which is why a white shirt stays noticeably cooler than a black one in the same sun." */}
      {/* ================================================================ */}
      <Sequence from={1440} durationInFrames={100}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140}>
          <g transform="translate(680, 520)">
            <DoodleStickman x={0} y={0} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" />
            <StoryLabel text="COOL & DRY (75°F)" x={0} y={-220} fontSize={34} color="#0369A1" />
          </g>
          <g transform="translate(1240, 520)">
            <DoodleStickman x={0} y={0} scale={1.35} pose="wiping_sweat" expression="sweating" shirtColor="#18181B" shortsColor="#18181B" />
            <StoryLabel text="SWELTERING (105°F)" x={0} y={-220} fontSize={34} color="#DC2626" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 16: (1540 - 1650f / 51.33s - 55.0s) "Scale that same principle up from a shirt... (ref_112s.jpg / 2.png FIX)" */}
      {/* ================================================================ */}
      <Sequence from={1540} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={550} showSun={false}>
          {/* GIANT UPRIGHT WHITE T-SHIRT (Exact ref_112s.jpg recreation) */}
          <g transform="translate(960, 480)">
            <DoodleSun x={160} y={-260} size={95} pulse />

            {/* Clean Upright Crew Neck T-Shirt */}
            <path
              d="M -110 -150 Q 0 -115 110 -150 L 195 -65 L 140 -15 L 105 -50 L 110 160 L -110 160 L -105 -50 L -140 -15 L -195 -65 Z"
              fill="#FFFFFF"
              stroke={DOODLE_STROKE}
              strokeWidth={DOODLE_WIDTH + 2}
              strokeLinejoin="round"
            />
            {/* Crew Neck Collar line */}
            <path
              d="M -110 -150 Q 0 -115 110 -150"
              fill="none"
              stroke={DOODLE_STROKE}
              strokeWidth={DOODLE_WIDTH}
              strokeLinecap="round"
            />

            {/* Red Sun Rays Shooting Down ↓↓↓ */}
            <g stroke="#EF4444" strokeWidth={7} fill="none" strokeLinecap="round">
              <line x1={0} y1={-160} x2={0} y2={-90} />
              <path d="M -10 -105 L 0 -90 L 10 -105" />

              <line x1={60} y1={-170} x2={40} y2={-90} />
              <path d="M 30 -105 L 40 -90 L 50 -105" />

              <line x1={-60} y1={-170} x2={-40} y2={-90} />
              <path d="M -50 -105 L -40 -90 L -30 -105" />
            </g>

            {/* Blue Chevron Rays Bouncing Up ⇖ ⇗ */}
            <g stroke="#0284C7" strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M -70 -70 L -110 -20 L -160 -100" />
              <path d="M -40 -70 L -70 0 L -110 -80" />
              <path d="M 70 -70 L 110 -20 L 160 -100" />
              <path d="M 40 -70 L 70 0 L 110 -80" />
            </g>

            {/* Tiny stickman standing next to giant shirt */}
            <DoodleStickman x={220} y={60} scale={0.7} expression="smile" shirtColor="#FFFFFF" />
            <StoryLabel text="PRINCIPLE: THE SHIRT" x={-260} y={-180} fontSize={36} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 17: (1650 - 1760f / 55.0s - 58.67s) "...to an entire building, and you've got the whole story." */}
      {/* ================================================================ */}
      <Sequence from={1650} durationInFrames={110}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={550} showSun={false}>
          {/* Split Comparison: Giant Shirt (Left) & White House (Right) */}
          <g transform="translate(520, 500)">
            {/* T-Shirt */}
            <path
              d="M -90 -120 Q 0 -95 90 -120 L 160 -50 L 115 -10 L 85 -40 L 90 130 L -90 130 L -85 -40 L -115 -10 L -160 -50 Z"
              fill="#FFFFFF"
              stroke={DOODLE_STROKE}
              strokeWidth={DOODLE_WIDTH}
              strokeLinejoin="round"
            />
            <path d="M -90 -120 Q 0 -95 90 -120" fill="none" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
            <g stroke="#0284C7" strokeWidth={6} fill="none" strokeLinecap="round">
              <path d="M -50 -50 L -80 -10 L -120 -70" />
              <path d="M 50 -50 L 80 -10 L 120 -70" />
            </g>
            <StoryLabel text="SHIRT" x={0} y={-170} fontSize={32} color="#18181B" />
          </g>

          <g transform="translate(1360, 500)">
            <DoodleSun x={180} y={-240} size={85} pulse />
            {/* 3D Perspective White House */}
            <rect x={-200} y={-100} width={300} height={230} fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} rx={4} />
            <polygon points="100,-100 190,-150 190,80 100,130" fill="#F1F5F9" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
            <polygon points="-200,-100 -110,-150 190,-150 100,-100" fill="#FFFFFF" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
            {/* Windows & Door */}
            <rect x={-160} y={-50} width={50} height={50} fill="#38BDF8" stroke={DOODLE_STROKE} strokeWidth={4} />
            <rect x={10} y={-50} width={50} height={50} fill="#38BDF8" stroke={DOODLE_STROKE} strokeWidth={4} />
            <rect x={-60} y={30} width={50} height={100} fill="#1E293B" stroke={DOODLE_STROKE} strokeWidth={4} />
            {/* Blue chevrons bouncing off roof */}
            <g stroke="#0284C7" strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M -120 -120 L -80 -140 L -120 -200" />
              <path d="M 20 -120 L 60 -140 L 20 -200" />
            </g>
            <DoodleStickman x={240} y={50} scale={0.65} expression="smile" shirtColor="#FFFFFF" />
            <StoryLabel text="BUILDING" x={0} y={-190} fontSize={32} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 18: (1760 - 1880f / 58.67s - 62.67s) "Now picture living somewhere with no air conditioning..." */}
      {/* ================================================================ */}
      <Sequence from={1760} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#EA580C" groundColor="#C2410C" horizonY={530} showSun sunAngry sunX={1680} sunY={150}>
          <DoodleStickman x={560} y={520} scale={1.35} pose="wiping_sweat" expression="sweating" shirtColor="#FFFFFF" shortsColor="#78350F" />
          {/* AC Unit with Big Red X and HIGH-CONTRAST BADGE */}
          <g transform="translate(1260, 480)">
            <rect x={-160} y={-90} width={320} height={180} rx={8} fill="#FFFFFF" stroke="#000000" strokeWidth={6} />
            {/* Vents */}
            <line x1={-120} y1={-20} x2={120} y2={-20} stroke="#64748B" strokeWidth={6} />
            <line x1={-120} y1={20} x2={120} y2={20} stroke="#64748B" strokeWidth={6} />
            {/* Giant Red Cross */}
            <line x1={-150} y1={-80} x2={150} y2={80} stroke="#DC2626" strokeWidth={14} strokeLinecap="round" />
            <line x1={150} y1={-80} x2={-150} y2={80} stroke="#DC2626" strokeWidth={14} strokeLinecap="round" />
            {/* White pill label for 100% legibility */}
            <g transform="translate(0, 150)">
              <rect x={-140} y={-30} width={280} height={60} rx={30} fill="#0F172A" stroke="#FFFFFF" strokeWidth={4} />
              <text x={0} y={12} textAnchor="middle" fill="#FFFFFF" fontSize={34} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
                NO AIR CON
              </text>
            </g>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 19: (1880 - 2000f / 62.67s - 66.67s) "...no electricity, nothing to cool your home..." */}
      {/* ================================================================ */}
      <Sequence from={1880} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#C2410C" groundColor="#9A3412" horizonY={530} showSun sunAngry sunX={1680} sunY={150}>
          <DoodleStickman x={560} y={520} scale={1.35} pose="panicking" expression="sweating" shirtColor="#FFFFFF" shortsColor="#78350F" />
          {/* Lightning / Power Outlet with Red X */}
          <g transform="translate(1260, 480)">
            <circle cx={0} cy={0} r={120} fill="#FEF08A" stroke="#000000" strokeWidth={6} />
            {/* Lightning bolt */}
            <polygon points="-15,-70 25,-70 5,-10 35,-10 -25,70 -5,10 -35,10" fill="#CA8A04" stroke="#000000" strokeWidth={4} />
            {/* Giant Red Cross */}
            <line x1={-100} y1={-100} x2={100} y2={100} stroke="#DC2626" strokeWidth={14} strokeLinecap="round" />
            <line x1={100} y1={-100} x2={-100} y2={100} stroke="#DC2626" strokeWidth={14} strokeLinecap="round" />
            {/* White pill label */}
            <g transform="translate(0, 170)">
              <rect x={-140} y={-30} width={280} height={60} rx={30} fill="#0F172A" stroke="#FFFFFF" strokeWidth={4} />
              <text x={0} y={12} textAnchor="middle" fill="#FFFFFF" fontSize={34} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
                NO POWER
              </text>
            </g>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 20: (2000 - 2120f / 66.67s - 70.67s) "...just a punishing sun beating down on your house all day..." */}
      {/* ================================================================ */}
      <Sequence from={2000} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#EA580C" groundColor="#C2410C" horizonY={540} showSun sunAngry sunX={960} sunY={220}>
          {/* Giant Punishing Sun Beams */}
          <g stroke="#FACC15" strokeWidth={10} strokeLinecap="round">
            {[-300, -150, 0, 150, 300].map((bx, i) => (
              <line key={i} x1={960 + bx * 0.4} y1={340} x2={960 + bx} y2={540} strokeDasharray="16 14" />
            ))}
          </g>
          <g transform="translate(960, 680)">
            <rect x={-160} y={-30} width={320} height={60} rx={30} fill="#0F172A" stroke="#FFFFFF" strokeWidth={4} />
            <text x={0} y={12} textAnchor="middle" fill="#FFFFFF" fontSize={34} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              PUNISHING SUN
            </text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 21: (2120 - 2250f / 70.67s - 75.0s) "...all day, every day." */}
      {/* ================================================================ */}
      <Sequence from={2120} durationInFrames={130}>
        <SummerSkyGroundEnv skyColor="#9A3412" groundColor="#78350F" horizonY={530} showSun sunAngry sunX={1650} sunY={150}>
          <DoodleStickman x={820} y={530} scale={1.35} pose="wiping_sweat" expression="sweating" shirtColor="#FFFFFF" shortsColor="#451A03" />
          <DoodleThermometer x={1180} y={500} tempPercent={0.96} label="118°F" themeColor="#DC2626" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 22: (2250 - 2370f / 75.0s - 79.0s) \"If your walls soak up that heat, your home turns into a furnace...\" */}
      {/* ================================================================ */}
      <Sequence from={2250} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#7C2D12" groundColor="#431407" horizonY={540} showSun sunAngry sunX={1680} sunY={140}>
          {/* Dark Stone House Turning into a Furnace */}
          <g transform="translate(960, 480)">
            <rect x={-220} y={-110} width={440} height={250} fill="#292524" stroke="#000000" strokeWidth={8} rx={6} />
            {/* Furnace Interior Red Glow */}
            <rect x={-180} y={-70} width={360} height={170} fill="#EF4444" opacity={0.65} rx={4} />
            {/* Heat Waves rising from walls */}
            <g stroke="#F87171" strokeWidth={5} fill="none" opacity={0.9} strokeLinecap="round">
              {[-140, -70, 0, 70, 140].map((wx, i) => (
                <path
                  key={i}
                  d={`M ${wx} 80 Q ${wx + 15} 0 ${wx} -80 Q ${wx - 15} -160 ${wx} -220`}
                />
              ))}
            </g>
            <StoryLabel text="FURNACE HOUSE" x={0} y={-240} fontSize={42} color="#F87171" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 23: (2370 - 2490f / 79.0s - 83.0s) \"...and in a lot of these hot regions, homes were originally built from stone or mud brick.\" */}
      {/* ================================================================ */}
      <Sequence from={2370} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#C2410C" groundColor="#9A3412" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Close up on Ancient Mudbrick & Stone Wall */}
          <g transform="translate(960, 480)">
            <rect x={-320} y={-150} width={640} height={300} fill="#57534E" stroke="#1C1917" strokeWidth={8} rx={8} />
            {/* Masonry Bricks */}
            {[-240, -100, 40, 180].map((bx, i) => (
              <g key={i} stroke="#292524" strokeWidth={4}>
                <line x1={bx} y1={-150} x2={bx} y2={-50} />
                <line x1={bx + 70} y1={-50} x2={bx + 70} y2={50} />
                <line x1={bx} y1={50} x2={bx} y2={150} />
              </g>
            ))}
            <line x1={-320} y1={-50} x2={320} y2={-50} stroke="#292524" strokeWidth={4} />
            <line x1={-320} y1={50} x2={320} y2={50} stroke="#292524" strokeWidth={4} />
            <StoryLabel text="DARK STONE & MUDBRICK" x={0} y={220} fontSize={38} color="#FFFFFF" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 24: (2490 - 2610f / 83.0s - 87.0s) \"Dark, heat-hungry materials that made the problem worse, not better.\" */}
      {/* ================================================================ */}
      <Sequence from={2490} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#7C2D12" groundColor="#431407" horizonY={540} showSun sunAngry sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            {/* Dark Wall with Heat Sinking Inward */}
            <rect x={-240} y={-120} width={480} height={240} fill="#44403C" stroke="#000000" strokeWidth={8} rx={6} />
            {/* Inward Infiltration Arrows */}
            <g stroke="#EF4444" strokeWidth={8} fill="none" strokeLinecap="round">
              <path d="M -180 -180 L -180 -70" />
              <path d="M -190 -85 L -180 -70 L -170 -85" />
              <path d="M 0 -180 L 0 -70" />
              <path d="M -10 -85 L 0 -70 L 10 -85" />
              <path d="M 180 -180 L 180 -70" />
              <path d="M 170 -85 L 180 -70 L 190 -85" />
            </g>
            <StoryLabel text="HEAT TRAPPED INSIDE" x={0} y={190} fontSize={38} color="#F87171" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 25: (2610 - 2730f / 87.0s - 91.0s) \"So people did something brilliant.\" */}
      {/* ================================================================ */}
      <Sequence from={2610} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Villager with Lightbulb Eureka Moment */}
          <DoodleStickman x={860} y={510} scale={1.4} pose="idle" expression="smile" shirtColor="#FFFFFF" />
          <g transform="translate(860, 240)">
            <circle cx={0} cy={0} r={50} fill="#FEF08A" stroke="#CA8A04" strokeWidth={6} />
            <path d="M -20 40 L 20 40 L 12 60 L -12 60 Z" fill="#94A3B8" stroke="#000" strokeWidth={3} />
            <DoodleSparkle x={-70} y={-40} size={30} color="#FACC15" />
            <DoodleSparkle x={70} y={-40} size={30} color="#FACC15" />
            <StoryLabel text="A BRILLIANT IDEA" x={0} y={-110} fontSize={38} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 26: (2730 - 2860f / 91.0s - 95.33s) \"They coated their homes in white.\" */}
      {/* ================================================================ */}
      <Sequence from={2730} durationInFrames={130}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Dark Wall being painted brilliant White */}
          <g transform="translate(1080, 480)">
            <rect x={-260} y={-130} width={520} height={260} fill="#57534E" stroke="#1C1917" strokeWidth={8} rx={6} />
            {/* White Coated section covering half */}
            <rect x={-260} y={-130} width={340} height={260} fill="#FFFFFF" stroke="#1C1917" strokeWidth={8} rx={6} />
            {/* Paint bucket */}
            <polygon points="180,90 220,90 215,160 185,160" fill="#FFFFFF" stroke="#000000" strokeWidth={5} />
            <ellipse cx={200} cy={90} rx={20} ry={6} fill="#E2E8F0" stroke="#000" strokeWidth={3} />
          </g>
          <DoodleStickman x={600} y={510} scale={1.35} pose="holding_brush" expression="smile" shirtColor="#EA580C" />
          <StoryLabel text="COATED IN WHITE" x={1080} y={220} fontSize={40} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 27: (2860 - 2980f / 95.33s - 99.33s) \"That white layer bounced the sun's rays away before the heat could ever soak into the walls...\" */}
      {/* ================================================================ */}
      <Sequence from={2860} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Deflection Action: Beams ricocheting off white wall */}
          <g transform="translate(960, 480)">
            <rect x={-240} y={-120} width={480} height={250} fill="#FFFFFF" stroke="#000000" strokeWidth={8} rx={6} />
            <g stroke="#FACC15" strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M -160 -240 L -80 -120 L -180 -40" />
              <path d="M 0 -240 L 60 -120 L 0 -40" />
              <path d="M 140 -240 L 190 -120 L 140 -40" />
            </g>
            <StoryLabel text="RAYS DEFLECTED" x={0} y={200} fontSize={38} color="#0369A1" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 28: (2980 - 3100f / 99.33s - 103.33s) \"...basically giving every house its own shield against the sun.\" */}
      {/* ================================================================ */}
      <Sequence from={2980} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Luminous Protective Blue Dome / Shield over White House */}
          <g transform="translate(960, 480)">
            <DoodleWhiteHouse x={0} y={40} scale={1.1} hasDome />
            {/* Radiant Protective Shield Arc */}
            <path
              d="M -320 180 A 340 340 0 0 1 320 180"
              fill="none"
              stroke="#38BDF8"
              strokeWidth={14}
              strokeDasharray="24 16"
              opacity={0.85}
            />
            <DoodleSparkle x={-200} y={-140} size={36} color="#38BDF8" />
            <DoodleSparkle x={200} y={-140} size={36} color="#38BDF8" />
            <StoryLabel text="THE SOLAR SHIELD" x={0} y={-240} fontSize={42} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 29: (3100 - 3220f / 103.33s - 107.33s) "And the difference wasn't small. (110°F vs 72°F)" */}
      {/* ================================================================ */}
      <Sequence from={3100} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Split Side-by-Side: Dark House vs White House */}
          <g transform="translate(520, 480)">
            <rect x={-180} y={-90} width={360} height={220} fill="#44403C" stroke="#000" strokeWidth={6} rx={4} />
            <DoodleThermometer x={140} y={20} tempPercent={0.92} label="110°F" themeColor="#DC2626" />
            <StoryLabel text="DARK: 110°F" x={-30} y={-160} fontSize={34} color="#DC2626" />
          </g>
          <g transform="translate(1400, 480)">
            <rect x={-180} y={-90} width={360} height={220} fill="#FFFFFF" stroke="#000" strokeWidth={6} rx={4} />
            <DoodleThermometer x={140} y={20} tempPercent={0.4} label="72°F" themeColor="#0284C7" />
            <StoryLabel text="WHITE: 72°F" x={-30} y={-160} fontSize={34} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 30: (3220 - 3350f / 107.33s - 111.67s) "A white painted home genuinely stayed cooler inside than a dark one..." */}
      {/* ================================================================ */}
      <Sequence from={3220} durationInFrames={130}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Inside the White Home: Relaxed stickman drinking cool lemonade */}
          <g transform="translate(960, 480)">
            <rect x={-260} y={-140} width={520} height={280} fill="#F0F9FF" stroke="#0284C7" strokeWidth={8} rx={8} />
            <DoodleStickman x={0} y={40} scale={1.25} pose="sipping_drink" expression="smile" shirtColor="#FFFFFF" />
            <StoryLabel text="COMFORTABLE INTERIOR" x={0} y={-210} fontSize={38} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 31: (3350 - 3470f / 111.67s - 115.67s) \"...purely from reflected sunlight. Without electric cooling, that wasn't a nice bonus.\" */}
      {/* ================================================================ */}
      <Sequence from={3350} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={530} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={560} y={510} scale={1.35} pose="waving" expression="smile" shirtColor="#FFFFFF" />
          <g transform="translate(1260, 460)">
            <rect x={-200} y={-100} width={400} height={200} rx={12} fill="#FFFFFF" stroke="#000" strokeWidth={6} />
            <text x={0} y={-20} textAnchor="middle" fill="#0369A1" fontSize={38} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="bold">
              0 WATTS
            </text>
            <text x={0} y={40} textAnchor="middle" fill="#18181B" fontSize={48} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              PURE PHYSICS
            </text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 32: (3470 - 3600f / 115.67s - 120.0s) \"It was the difference between a home you could actually survive summer in, and one you couldn't.\" */}
      {/* ================================================================ */}
      <Sequence from={3470} durationInFrames={130}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Survival vs Unlivable contrast */}
          <g transform="translate(960, 480)">
            <g transform="translate(-240, 0)">
              <rect x={-140} y={-80} width={280} height={160} rx={12} fill="#EF4444" stroke="#7F1D1D" strokeWidth={6} />
              <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={36} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
                UNLIVABLE
              </text>
            </g>
            <g transform="translate(240, 0)">
              <rect x={-140} y={-80} width={280} height={160} rx={12} fill="#10B981" stroke="#065F46" strokeWidth={6} />
              <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={36} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
                SURVIVABLE
              </text>
            </g>
            <StoryLabel text="SURVIVAL MATTERS" x={0} y={-160} fontSize={40} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 33: (3600 - 3730f / 120.0s - 124.33s) "By painting entire villages white..." */}
      {/* ================================================================ */}
      <Sequence from={3600} durationInFrames={130}>
        <MediterraneanVillageBackdrop>
          <DoodleStickman x={960} y={640} scale={1.25} pose="waving" expression="smile" shirtColor="#0284C7" />
          <StoryLabel text="ENTIRE VILLAGES WHITE" x={960} y={180} fontSize={44} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 34: (3730 - 3860f / 124.33s - 128.67s) "...these communities were engineering their whole environment to push the sun's energy away..." */}
      {/* ================================================================ */}
      <Sequence from={3730} durationInFrames={130}>
        <MediterraneanVillageBackdrop>
          {/* Huge upward yellow deflection arrows across the whole village */}
          <g stroke="#FACC15" strokeWidth={10} fill="none" strokeLinecap="round">
            {[300, 740, 1220, 1600].map((ax, i) => (
              <g key={i} transform={`translate(${ax}, 240)`}>
                <line x1={0} y1={80} x2={0} y2={-60} />
                <path d="M -16 -40 L 0 -60 L 16 -40" />
              </g>
            ))}
          </g>
          <StoryLabel text="PUSHING HEAT INTO SPACE" x={960} y={140} fontSize={40} color="#FFFFFF" />
        </MediterraneanVillageBackdrop>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 35: (3860 - 3980f / 128.67s - 132.67s) \"...using nothing but the color of a coating. It's passive cooling in its purest form...\" */}
      {/* ================================================================ */}
      <Sequence from={3860} durationInFrames={120}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={540} showSun sunX={1680} sunY={140}>
          <g transform="translate(960, 480)">
            <circle cx={0} cy={-20} r={160} fill="#FFFFFF" stroke="#0284C7" strokeWidth={8} />
            <text x={0} y={-40} textAnchor="middle" fill="#0369A1" fontSize={36} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="bold">
              ZERO ENERGY
            </text>
            <text x={0} y={20} textAnchor="middle" fill="#18181B" fontSize={44} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              PASSIVE COOLING
            </text>
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 36: (3980 - 4110f / 132.67s - 137.0s) \"...and it worked so well that scientists today are seriously looking...\" */}
      {/* ================================================================ */}
      <Sequence from={3980} durationInFrames={130}>
        <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ display: 'block' }}>
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
          {/* Modern Research Laboratory */}
          <DoodleStickman x={600} y={540} scale={1.35} pose="holding_magnifier" expression="curious" shirtColor="#FFFFFF" shortsColor="#0284C7" />
          <g transform="translate(1260, 480)">
            <rect x={-280} y={-140} width={560} height={280} rx={12} fill="#1E293B" stroke="#38BDF8" strokeWidth={6} />
            <text x={0} y={-40} textAnchor="middle" fill="#94A3B8" fontSize={32} fontFamily="'Comic Sans MS', cursive, sans-serif">
              CLIMATE SCIENCE
            </text>
            <text x={0} y={40} textAnchor="middle" fill="#FACC15" fontSize={38} fontFamily="'Comic Sans MS', cursive, sans-serif" fontWeight="900">
              STUDYING NATURE
            </text>
          </g>
        </svg>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 37: (4110 - 4250f / 137.0s - 141.67s) \"...at painting modern roofs, even entire cities, white or reflective...\" */}
      {/* ================================================================ */}
      <Sequence from={4110} durationInFrames={140}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#64748B" horizonY={600} showSun sunX={1700} sunY={140}>
          {/* Modern City Skyline with White Painted Roofs */}
          <g transform="translate(960, 520)">
            <rect x={-420} y={-180} width={180} height={360} fill="#334155" stroke="#000" strokeWidth={5} />
            <rect x={-420} y={-220} width={180} height={40} fill="#FFFFFF" stroke="#000" strokeWidth={5} />

            <rect x={-180} y={-280} width={200} height={460} fill="#475569" stroke="#000" strokeWidth={5} />
            <rect x={-180} y={-320} width={200} height={40} fill="#FFFFFF" stroke="#000" strokeWidth={5} />

            <rect x={80} y={-220} width={190} height={400} fill="#334155" stroke="#000" strokeWidth={5} />
            <rect x={80} y={-260} width={190} height={40} fill="#FFFFFF" stroke="#000" strokeWidth={5} />

            {/* Bouncing rays from white roofs */}
            <g stroke="#0284C7" strokeWidth={8} fill="none" strokeLinecap="round">
              <path d="M -330 -220 L -300 -270 L -250 -240" />
              <path d="M -80 -320 L -50 -370 L 0 -340" />
              <path d="M 175 -260 L 205 -310 L 255 -280" />
            </g>
            <StoryLabel text="MODERN COOL ROOFS" x={0} y={160} fontSize={40} color="#FFFFFF" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 38: (4250 - 4380f / 141.67s - 146.0s) \"...to fight rising urban temperatures.\" */}
      {/* ================================================================ */}
      <Sequence from={4250} durationInFrames={130}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#475569" horizonY={550} showSun sunX={1680} sunY={140}>
          <DoodleStickman x={600} y={530} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" />
          <g transform="translate(1260, 480)">
            <DoodleThermometer x={0} y={0} height={260} tempPercent={0.5} label="78°F COOL" themeColor="#0284C7" />
            <StoryLabel text="CITY TEMPERATURE DROPS" x={0} y={-260} fontSize={38} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 39: (4380 - 4510f / 146.0s - 150.33s) \"People figured this out thousands of years ago... (FIX TEXT OVERLAPS)\" */}
      {/* ================================================================ */}
      <Sequence from={4380} durationInFrames={130}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1700} sunY={140}>
          {/* Split comparison without overlapping text */}
          <g transform="translate(480, 480)">
            <DoodleWhiteHouse x={0} y={40} scale={0.85} hasDome />
            <DoodleStickman x={-140} y={40} scale={1.1} pose="holding_brush" expression="smile" shirtColor="#EA580C" />
            {/* Top label in sky area (ZERO OVERLAP) */}
            <StoryLabel text="3,000 YEARS AGO" x={0} y={-180} fontSize={34} color="#1E3A8A" />
          </g>

          {/* Divider Line */}
          <line x1={960} y1={80} x2={960} y2={980} stroke="#18181B" strokeWidth={6} strokeDasharray="14 10" />

          <g transform="translate(1440, 480)">
            <rect x={-120} y={-140} width={240} height={320} fill="#334155" stroke="#000" strokeWidth={5} />
            <rect x={-120} y={-180} width={240} height={40} fill="#FFFFFF" stroke="#000" strokeWidth={5} />
            <DoodleStickman x={0} y={-180} scale={0.9} pose="idle" expression="smile" shirtColor="#FFFFFF" />
            {/* Top label in sky area (ZERO OVERLAP) */}
            <StoryLabel text="TODAY: COOL ROOFS" x={0} y={-290} fontSize={34} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 40: (4510 - 4640f / 150.33s - 154.67s) \"...with nothing but limestone...\" */}
      {/* ================================================================ */}
      <Sequence from={4510} durationInFrames={130}>
        <SummerSkyGroundEnv skyColor="#0284C7" groundColor="#C89666" horizonY={540} showSun sunX={1680} sunY={140}>
          {/* Pile of pure white limestone rocks */}
          <g transform="translate(960, 520)">
            <circle cx={-80} cy={40} r={65} fill="#F8FAFC" stroke="#0F172A" strokeWidth={6} />
            <circle cx={60} cy={30} r={75} fill="#F1F5F9" stroke="#0F172A" strokeWidth={6} />
            <circle cx={-10} cy={-20} r={55} fill="#FFFFFF" stroke="#0F172A" strokeWidth={6} />
            <StoryLabel text="PURE LIMESTONE" x={0} y={-160} fontSize={44} color="#18181B" />
          </g>
        </SummerSkyGroundEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 41: (4640 - 4775f / 154.67s - 159.16s) \"...and water.\" */}
      {/* ================================================================ */}
      <Sequence from={4640} durationInFrames={135}>
        <SummerSkyGroundEnv skyColor="#38BDF8" groundColor="#D4A373" horizonY={530} showSun sunX={1680} sunY={140}>
          {/* Villager stirring whitewash bucket with wooden stick, looking at camera */}
          <g transform="translate(1080, 500)">
            {/* Bucket of White Lime Wash */}
            <polygon points="-80,0 80,0 65,140 -65,140" fill="#FFFFFF" stroke="#0F172A" strokeWidth={7} />
            <ellipse cx={0} cy={0} rx={80} ry={22} fill="#E2E8F0" stroke="#0F172A" strokeWidth={5} />
            {/* Stirring Stick */}
            <line x1={-30} y1={-90} x2={25} y2={100} stroke="#92400E" strokeWidth={10} strokeLinecap="round" />
            {/* Water Splashes */}
            <circle cx={-40} cy={-30} r={8} fill="#38BDF8" />
            <circle cx={45} cy={-20} r={6} fill="#38BDF8" />
          </g>
          <DoodleStickman x={660} y={510} scale={1.35} pose="idle" expression="smile" shirtColor="#FFFFFF" />
          <StoryLabel text="LIMESTONE + WATER" x={1080} y={230} fontSize={44} color="#18181B" />
        </SummerSkyGroundEnv>
      </Sequence>
    </div>
  );
};
