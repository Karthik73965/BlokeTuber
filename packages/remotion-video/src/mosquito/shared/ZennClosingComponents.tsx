import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  INK,
  WALL_OCHRE,
  FLOOR_UMBER,
  COUCH_TEAL,
  COUCH_SHADOW,
  VICTIM_RED,
  MOSQUITO_BODY,
  MOSQUITO_WING,
  ZennDetailedMosquito,
} from './ZennMasterComponents';

export const PARCHMENT = '#FAF7F2';
export const PARCHMENT_LINE = '#E2DDD4';

/**
 * =========================================================================
 * 🍔 BEAT 1: Exact Visual Callback to Living Room / Sofa Two-Shot (0 - 175f)
 * =========================================================================
 * Warm ochre living room, teal sofa:
 * - Left: Host covered in red welts, scratching his head/ear frantically.
 * - Right: Calm friend with round glasses peacefully reading newspaper, 0 bites, gray 'X'.
 * - Right side table with barbecue burger & iced drink!
 * - Mosquito flying on dashed trajectory curving right into host's head.
 */
export const ZennClosingBeat1_Callback: React.FC<{ progress?: number }> = ({ progress = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Background Room */}
      <rect x={0} y={0} width={1920} height={720} fill={WALL_OCHRE} />
      <rect x={0} y={720} width={1920} height={360} fill={FLOOR_UMBER} />
      <line x1={0} y1={720} x2={1920} y2={720} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <line x1={1720} y1={0} x2={1720} y2={720} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <line x1={1720} y1={720} x2={1920} y2={840} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* 2. Side Table on the Right with Barbecue Meal Callback */}
      <g transform="translate(1640, 715)">
        <polygon points="-65,0 65,0 55,20 -55,20" fill="#583B20" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <line x1={-45} y1={20} x2={-50} y2={140} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={45} y1={20} x2={50} y2={140} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Barbecue Plate with Burger */}
        <ellipse cx={-15} cy={-5} rx={35} ry={12} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        {/* Burger bun & patty */}
        <ellipse cx={-15} cy={-12} rx={22} ry={9} fill="#D97706" stroke={INK} strokeWidth={2.5} />
        <rect x={-36} y={-14} width={42} height={6} rx={3} fill="#78350F" stroke={INK} strokeWidth={2} />
        <path d="M -35 -14 Q -15 -28 6 -14 Z" fill="#F59E0B" stroke={INK} strokeWidth={2.5} />
        {/* Lettuce leaf peeking out */}
        <polygon points="-38,-12 -28,-10 -32,-7" fill="#22C55E" />

        {/* Cold Drink Cup with Straw */}
        <polygon points="22,-8 44,-8 40,-38 26,-38" fill="#EF4444" stroke={INK} strokeWidth={3} strokeLinejoin="round" />
        <line x1={33} y1={-38} x2={42} y2={-52} stroke="#FBBF24" strokeWidth={3.5} strokeLinecap="round" />
      </g>

      {/* 3. Centered Teal Sofa */}
      <g transform="translate(960, 710)">
        {/* Sofa Backrest */}
        <path
          d="M -480 -200 Q 0 -215 480 -200 L 480 -25 Q 0 -15 -480 -25 Z"
          fill={COUCH_TEAL}
          stroke={INK}
          strokeWidth={6.5}
          strokeLinejoin="round"
        />
        <line x1={-160} y1={-205} x2={-160} y2={-20} stroke={INK} strokeWidth={5} />
        <line x1={160} y1={-205} x2={160} y2={-20} stroke={INK} strokeWidth={5} />

        {/* Sofa Seat Cushions */}
        <path
          d="M -500 -25 Q 0 -15 500 -25 L 500 150 Q 0 160 -500 150 Z"
          fill={COUCH_SHADOW}
          stroke={INK}
          strokeWidth={6.5}
          strokeLinejoin="round"
        />
        <line x1={-500} y1={25} x2={500} y2={25} stroke={INK} strokeWidth={5.5} />
        <line x1={-170} y1={-25} x2={-170} y2={150} stroke={INK} strokeWidth={5} />
        <line x1={170} y1={-25} x2={170} y2={150} stroke={INK} strokeWidth={5} />

        {/* Armrests */}
        <path
          d="M -580 -70 Q -500 -80 -480 -60 L -480 150 L -580 150 Z"
          fill={COUCH_TEAL}
          stroke={INK}
          strokeWidth={6.5}
          strokeLinejoin="round"
        />
        <path
          d="M 580 -70 Q 500 -80 480 -60 L 480 150 L 580 150 Z"
          fill={COUCH_TEAL}
          stroke={INK}
          strokeWidth={6.5}
          strokeLinejoin="round"
        />
      </g>

      {/* 4. Host on Left of Couch: Scratching Head, Distressed, Covered in Bites */}
      <g transform="translate(680, 520)">
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 Spiky Hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>

        {/* Distressed Eyes looking up at incoming mosquito */}
        <circle cx={-20} cy={-6} r={15} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18 + Math.sin(frame * 0.1) * 2} cy={-10} r={5.5} fill={INK} />
        <circle cx={20} cy={-6} r={15} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={22 + Math.sin(frame * 0.1) * 2} cy={-10} r={5.5} fill={INK} />

        {/* Worried Eyebrows */}
        <line x1={-32} y1={-24} x2={-8} y2={-32} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-32} x2={32} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />

        {/* Open Distressed Frown Mouth */}
        <path d="M -16 22 Q 0 14 16 22 Q 0 34 -16 22 Z" fill="#FFFFFF" stroke={INK} strokeWidth={3.8} strokeLinejoin="round" />

        {/* Red Welt Bite Spots */}
        <g fill={VICTIM_RED}>
          <circle cx={-48} cy={-10} r={9} />
          <circle cx={48} cy={16} r={9} />
          <circle cx={-72} cy={130} r={9} />
          <circle cx={-48} cy={95} r={9} />
          <circle cx={28} cy={110} r={9} />
          <circle cx={-48} cy={235} r={9} />
          <circle cx={18} cy={290} r={9} />
          {/* Extra welts on scratching arm */}
          <circle cx={40} cy={70} r={8} />
          <circle cx={35} cy={35} r={8} />
        </g>

        {/* Body & Scratching Arm */}
        <g stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={55} x2={0} y2={185} />
          {/* Sitting Legs */}
          <line x1={0} y1={185} x2={-50} y2={235} />
          <line x1={0} y1={185} x2={30} y2={235} />
          <line x1={-50} y1={235} x2={-50} y2={325} />
          <line x1={30} y1={235} x2={30} y2={325} />
          <line x1={-50} y1={325} x2={-32} y2={330} />
          <line x1={30} y1={325} x2={48} y2={330} />

          {/* Left Arm Resting on Couch */}
          <line x1={0} y1={95} x2={-65} y2={130} />
          <line x1={-65} y1={130} x2={-110} y2={150} />

          {/* Right Arm Scratching Head (animates vigorously) */}
          <line x1={0} y1={95} x2={55} y2={115} />
          <line x1={55} y1={115} x2={30 + Math.sin(frame * 0.4) * 6} y2={15 + Math.cos(frame * 0.4) * 6} />
        </g>
      </g>

      {/* 5. Calm Friend on Right: Round Glasses, Reading Folded Newspaper */}
      <g transform="translate(1240, 520)">
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* Round Glasses */}
        <circle cx={-22} cy={-4} r={24} fill="none" stroke={INK} strokeWidth={5.5} />
        <circle cx={22} cy={-4} r={24} fill="none" stroke={INK} strokeWidth={5.5} />
        <line x1={-2} y1={-4} x2={2} y2={-4} stroke={INK} strokeWidth={4.5} />
        <line x1={-46} y1={-4} x2={-55} y2={-6} stroke={INK} strokeWidth={4.5} />
        <line x1={46} y1={-4} x2={55} y2={-6} stroke={INK} strokeWidth={4.5} />
        <circle cx={-22} cy={-4} r={5} fill={INK} />
        <circle cx={22} cy={-4} r={5} fill={INK} />
        <line x1={-32} y1={-32} x2={-10} y2={-32} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={10} y1={-32} x2={32} y2={-32} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={-12} y1={26} x2={12} y2={26} stroke={INK} strokeWidth={3.8} strokeLinecap="round" />

        {/* Body & Sitting Legs */}
        <g stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={55} x2={-8} y2={185} />
          <line x1={-8} y1={185} x2={-60} y2={235} />
          <line x1={-8} y1={185} x2={20} y2={235} />
          <line x1={-60} y1={235} x2={-60} y2={325} />
          <line x1={20} y1={235} x2={20} y2={325} />
          <line x1={-60} y1={325} x2={-42} y2={330} />
          <line x1={20} y1={325} x2={38} y2={330} />
          {/* Arms holding newspaper */}
          <line x1={-4} y1={95} x2={-45} y2={145} />
          <line x1={-4} y1={95} x2={40} y2={145} />
        </g>

        {/* Folded Newspaper */}
        <g transform="translate(0, 155)">
          <polygon points="-75,-70 75,-70 75,75 -75,75" fill="#FFFFFF" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
          <line x1={0} y1={-70} x2={0} y2={75} stroke={INK} strokeWidth={3.5} />
          <rect x={-65} y={-60} width={55} height={18} fill="#D1D5DB" stroke={INK} strokeWidth={2} />
          <rect x={10} y={-60} width={55} height={18} fill="#D1D5DB" stroke={INK} strokeWidth={2} />
          {[-30, -15, 0, 15, 30, 45, 60].map((ly, i) => (
            <React.Fragment key={i}>
              <line x1={-65} y1={ly} x2={-10} y2={ly} stroke={INK} strokeWidth={3} />
              <line x1={10} y1={ly} x2={65} y2={ly} stroke={INK} strokeWidth={3} />
            </React.Fragment>
          ))}
        </g>

        {/* Gray 'X' over calm friend showing mosquito ignored him */}
        <g stroke="#9CA3AF" strokeWidth={5.5} strokeLinecap="round" opacity={0.8} transform="translate(0, -135)">
          <line x1={-22} y1={-22} x2={22} y2={22} />
          <line x1={22} y1={-22} x2={-22} y2={22} />
        </g>
      </g>

      {/* 6. Curved Mosquito Flight Trajectory from right to host */}
      <path
        d="M 1900 460 Q 1300 220 780 380"
        stroke={INK}
        strokeWidth={4.5}
        strokeDasharray="16 12"
        fill="none"
      />
      {/* Red Arrow Pointing at Host */}
      <g stroke={VICTIM_RED} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1={840} y1={360} x2={770} y2={385} />
        <polyline points="800,365 770,385 795,395" />
      </g>

      {/* Mosquito Moving along trajectory */}
      {(() => {
        const animProgress = progress > 0 ? progress : Math.min(frame / 140, 1);
        const mx = interpolate(animProgress, [0, 0.5, 1], [1850, 1300, 830]);
        const my = interpolate(animProgress, [0, 0.5, 1], [460, 270, 365]);
        const mAngle = interpolate(animProgress, [0, 0.5, 1], [-15, 5, 25]);
        return (
          <g transform={`translate(${mx}, ${my}) rotate(${mAngle})`}>
            <ZennDetailedMosquito scale={1.45} facing="left" />
          </g>
        );
      })()}
    </svg>
  );
};

/**
 * =========================================================================
 * 🍀 BEAT 2: Myth Sweep — Luck & Diet Blown Away (175 - 304f)
 * =========================================================================
 * Four-leaf clover ("LUCK") and banana/garlic meal ("DIET") floating next to host;
 * a powerful gust of wind whooshes them away with big bold red X marks.
 */
export const ZennClosingBeat2_MythSweep: React.FC = () => {
  const frame = useCurrentFrame();

  // Animation timeline relative to beat start (0 to 129)
  const redX1Progress = interpolate(frame, [25, 38], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const redX2Progress = interpolate(frame, [45, 58], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const blowProgress = interpolate(frame, [70, 115], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  // Wind sweep movement
  const myth1X = interpolate(blowProgress, [0, 1], [540, 2300]);
  const myth1Y = interpolate(blowProgress, [0, 1], [460, 180]);
  const myth1Rot = interpolate(blowProgress, [0, 1], [0, 180]);

  const myth2X = interpolate(blowProgress, [0, 1], [1380, 2400]);
  const myth2Y = interpolate(blowProgress, [0, 1], [460, 260]);
  const myth2Rot = interpolate(blowProgress, [0, 1], [0, -160]);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Parchment Studio Background with Ground Baseline */}
      <rect x={0} y={0} width={1920} height={1080} fill={PARCHMENT} />
      <line x1={0} y1={880} x2={1920} y2={880} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Host Stickman standing center grounded */}
      <g transform="translate(960, 570)">
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs that blow slightly in the gust */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20 + blowProgress * 15} y2={-88} />
          <line x1={0} y1={-55} x2={blowProgress * 18} y2={-96} />
          <line x1={14} y1={-53} x2={22 + blowProgress * 20} y2={-86} />
        </g>

        {/* Face: confident smiling expression looking at myths being blown away */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-15 + blowProgress * 8} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={21 + blowProgress * 8} cy={-6} r={5} fill={INK} />

        {/* Smug / Confident Eyebrows */}
        <line x1={-28} y1={-24} x2={-8} y2={-28} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-28} x2={28} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />

        {/* Smile Mouth */}
        <path d="M -14 22 Q 0 32 14 22" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Blue T-Shirt Torso */}
        <path
          d="M -26 65 Q 0 75 26 65 L 48 85 L 36 125 L 24 110 L 24 175 L -24 175 L -24 110 L -36 125 L -48 85 Z"
          fill="#2563EB"
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />

        {/* Legs grounded to baseline */}
        <g stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none">
          <line x1={-15} y1={175} x2={-25} y2={310} />
          <line x1={15} y1={175} x2={25} y2={310} />
          <line x1={-25} y1={310} x2={-45} y2={310} />
          <line x1={25} y1={310} x2={45} y2={310} />

          {/* Arms: hands on hips confident stance */}
          <path d="M -24 95 L -65 140 L -25 155" />
          <path d="M 24 95 L 65 140 L 25 155" />
        </g>
      </g>

      {/* Myth 1: Four-Leaf Clover ("LUCK") */}
      <g transform={`translate(${myth1X}, ${myth1Y + Math.sin(frame * 0.1) * 8}) rotate(${myth1Rot})`}>
        {/* Soft circle plate */}
        <ellipse cx={0} cy={0} rx={130} ry={130} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {/* Hand-drawn 4-leaf clover */}
        <g transform="translate(0, -20)">
          {/* Stem */}
          <path d="M 0 30 Q 15 65 35 75" stroke="#15803D" strokeWidth={6} fill="none" strokeLinecap="round" />
          {/* 4 heart-shaped green leaves */}
          {[0, 90, 180, 270].map((deg, i) => (
            <g key={i} transform={`rotate(${deg})`}>
              <path
                d="M 0 0 C -25 -25 -35 -5 0 -45 C 35 -5 25 -25 0 0 Z"
                fill="#22C55E"
                stroke={INK}
                strokeWidth={3.5}
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>
        {/* Hand-drawn comic label */}
        <text
          x={0}
          y={80}
          fill={INK}
          fontSize={34}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
        >
          LUCK
        </text>

        {/* Big Red X slashing over Myth 1 */}
        {redX1Progress > 0 && (
          <g stroke={VICTIM_RED} strokeWidth={14} strokeLinecap="round" opacity={redX1Progress}>
            <line x1={-90 * redX1Progress} y1={-90 * redX1Progress} x2={90 * redX1Progress} y2={90 * redX1Progress} />
            <line x1={90 * redX1Progress} y1={-90 * redX1Progress} x2={-90 * redX1Progress} y2={90 * redX1Progress} />
          </g>
        )}
      </g>

      {/* Myth 2: Meal Plate with Banana & Garlic ("DIET") */}
      <g transform={`translate(${myth2X}, ${myth2Y + Math.cos(frame * 0.1) * 8}) rotate(${myth2Rot})`}>
        {/* Soft circle plate */}
        <ellipse cx={0} cy={0} rx={130} ry={130} fill="#FFFFFF" stroke={INK} strokeWidth={5} />

        {/* Banana & Garlic Doodles */}
        <g transform="translate(0, -20)">
          {/* Yellow banana */}
          <path
            d="M -55 20 Q -20 -35 45 -20 Q -10 -15 -45 25 Z"
            fill="#FACC15"
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {/* Garlic bulb */}
          <path
            d="M 10 25 C -5 10 0 -15 15 -25 C 22 -30 28 -30 35 -25 C 50 -15 55 10 40 25 Z"
            fill="#FEF3C7"
            stroke={INK}
            strokeWidth={4}
            strokeLinejoin="round"
          />
          {/* Green aroma stink waves from garlic */}
          <path d="M 20 -32 Q 10 -45 22 -55" stroke="#84CC16" strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M 32 -32 Q 42 -45 30 -55" stroke="#84CC16" strokeWidth={3} fill="none" strokeLinecap="round" />
        </g>

        {/* Hand-drawn comic label */}
        <text
          x={0}
          y={80}
          fill={INK}
          fontSize={34}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
        >
          DIET
        </text>

        {/* Big Red X slashing over Myth 2 */}
        {redX2Progress > 0 && (
          <g stroke={VICTIM_RED} strokeWidth={14} strokeLinecap="round" opacity={redX2Progress}>
            <line x1={-90 * redX2Progress} y1={-90 * redX2Progress} x2={90 * redX2Progress} y2={90 * redX2Progress} />
            <line x1={90 * redX2Progress} y1={-90 * redX2Progress} x2={-90 * redX2Progress} y2={90 * redX2Progress} />
          </g>
        )}
      </g>

      {/* Dynamic Hand-Drawn Wind Streaks Gusting across from left to right */}
      {blowProgress > 0 && blowProgress < 0.95 && (
        <g stroke="#94A3B8" strokeWidth={6} strokeLinecap="round" fill="none" opacity={Math.sin(blowProgress * Math.PI)}>
          <path d={`M ${-200 + blowProgress * 2400} 360 Q ${200 + blowProgress * 2400} 320 ${600 + blowProgress * 2400} 380`} />
          <path d={`M ${-400 + blowProgress * 2300} 460 Q ${100 + blowProgress * 2300} 500 ${500 + blowProgress * 2300} 440`} />
          <path d={`M ${-300 + blowProgress * 2500} 560 Q ${300 + blowProgress * 2500} 520 ${700 + blowProgress * 2500} 580`} />
          {/* Spirals */}
          <path
            d={`M ${blowProgress * 2200} 420 Q ${blowProgress * 2200 + 40} 400 ${blowProgress * 2200 + 30} 380 Q ${blowProgress * 2200} 390 ${blowProgress * 2200 + 10} 410`}
            strokeWidth={4.5}
          />
        </g>
      )}
    </svg>
  );
};

/**
 * =========================================================================
 * 🧬 BEAT 3: Three Biological Layers (304 - 482f)
 * =========================================================================
 * Host stickman illuminated with 3 glowing biological layers:
 * 1. DNA helix at the core ("GENES (2/3)")
 * 2. Glowing skin microbes on the surface ("SKIN MICROBIOME")
 * 3. Blood type icon ("BLOOD TYPE")
 */
export const ZennClosingBeat3_ThreeLayers: React.FC = () => {
  const frame = useCurrentFrame();

  const layer1Progress = interpolate(frame, [15, 35], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const layer2Progress = interpolate(frame, [60, 80], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const layer3Progress = interpolate(frame, [105, 125], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Parchment Studio Background with Baseline */}
      <rect x={0} y={0} width={1920} height={1080} fill={PARCHMENT} />
      <line x1={0} y1={880} x2={1920} y2={880} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Host Stickman in Center */}
      <g transform="translate(960, 540)">
        {/* Soft biological glow halo */}
        <ellipse cx={0} cy={120} rx={220} ry={300} fill="#38BDF8" opacity={0.12 + Math.sin(frame * 0.1) * 0.05} />

        {/* Head */}
        <circle cx={0} cy={0} r={65} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round">
          <line x1={-16} y1={-62} x2={-24} y2={-102} />
          <line x1={0} y1={-65} x2={0} y2={-112} />
          <line x1={16} y1={-62} x2={26} y2={-100} />
        </g>

        {/* Eyes looking down with wonder at glowing layers */}
        <circle cx={-22} cy={-4} r={16} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        <circle cx={-20} cy={2} r={6} fill={INK} />
        <circle cx={22} cy={-4} r={16} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        <circle cx={24} cy={2} r={6} fill={INK} />
        {/* Curious Eyebrows */}
        <line x1={-35} y1={-26} x2={-12} y2={-26} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <line x1={12} y1={-26} x2={35} y2={-26} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        {/* Open Smile */}
        <path d="M -16 26 Q 0 38 16 26" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />

        {/* Transparent Blueprint Torso Outline */}
        <path
          d="M -35 75 Q 0 85 35 75 L 60 100 L 45 150 L 30 135 L 30 215 L -30 215 L -30 135 L -45 150 L -60 100 Z"
          fill="rgba(59, 130, 246, 0.08)"
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />

        {/* Legs to baseline */}
        <g stroke={INK} strokeWidth={6.5} strokeLinecap="round" fill="none">
          <line x1={-20} y1={215} x2={-30} y2={340} />
          <line x1={20} y1={215} x2={30} y2={340} />
          <line x1={-30} y1={340} x2={-55} y2={340} />
          <line x1={30} y1={340} x2={55} y2={340} />
          {/* Arms outstretched revealing layers */}
          <line x1={-30} y1={110} x2={-115} y2={165} />
          <line x1={30} y1={110} x2={115} y2={165} />
        </g>

        {/* ============================================================== */}
        {/* LAYER 1: Core DNA Helix inside torso                           */}
        {/* ============================================================== */}
        {layer1Progress > 0 && (
          <g opacity={layer1Progress} transform="translate(0, 145)">
            <ellipse cx={0} cy={0} rx={45} ry={70} fill="#EFF6FF" stroke="#3B82F6" strokeWidth={3} strokeDasharray="6 4" />
            {/* Animated DNA Helix */}
            {[-45, -30, -15, 0, 15, 30, 45].map((dy, i) => {
              const wave = Math.sin((frame * 0.15) + (dy * 0.08)) * 28;
              const rungCol = i % 3 === 0 ? '#38BDF8' : i % 3 === 1 ? '#10B981' : '#F59E0B';
              return (
                <React.Fragment key={i}>
                  <line x1={-wave} y1={dy} x2={wave} y2={dy} stroke={rungCol} strokeWidth={4} strokeLinecap="round" />
                  <circle cx={-wave} cy={dy} r={4.5} fill="#2563EB" />
                  <circle cx={wave} cy={dy} r={4.5} fill="#EF4444" />
                </React.Fragment>
              );
            })}
          </g>
        )}

        {/* ============================================================== */}
        {/* LAYER 2: Surface Skin Microbes along silhouette               */}
        {/* ============================================================== */}
        {layer2Progress > 0 && (
          <g opacity={layer2Progress}>
            {[
              { x: -140, y: 150, col: '#10B981', r: 16 },
              { x: -90, y: 80, col: '#F59E0B', r: 14 },
              { x: 140, y: 150, col: '#10B981', r: 16 },
              { x: 90, y: 80, col: '#EC4899', r: 13 },
              { x: -55, y: 260, col: '#06B6D4', r: 15 },
              { x: 55, y: 260, col: '#F59E0B', r: 14 },
              { x: -80, y: -20, col: '#10B981', r: 13 },
              { x: 80, y: -20, col: '#3B82F6', r: 14 },
            ].map((bac, idx) => {
              const bBounce = Math.sin(frame * 0.25 + idx * 1.7) * 6;
              return (
                <g key={idx} transform={`translate(${bac.x}, ${bac.y + bBounce})`}>
                  <circle cx={0} cy={0} r={bac.r} fill={bac.col} stroke={INK} strokeWidth={3} />
                  {/* Cute face */}
                  <circle cx={-3} cy={-2} r={2} fill="#FFFFFF" />
                  <circle cx={3} cy={-2} r={2} fill="#FFFFFF" />
                  <circle cx={-3} cy={-2} r={1} fill={INK} />
                  <circle cx={3} cy={-2} r={1} fill={INK} />
                  {/* Tiny scent puff */}
                  <circle
                    cx={Math.sin(frame * 0.2 + idx) * 8}
                    cy={-bac.r - 8 - ((frame + idx * 10) % 20)}
                    r={4}
                    fill="#FDE047"
                    opacity={1 - ((frame + idx * 10) % 20) / 20}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* ============================================================== */}
        {/* LAYER 3: Blood Type Icon hovering near shoulder/chest          */}
        {/* ============================================================== */}
        {layer3Progress > 0 && (
          <g opacity={layer3Progress} transform="translate(160, 40)">
            {/* Glowing red pulse rings */}
            <circle cx={0} cy={0} r={40 + ((frame * 1.5) % 30)} fill="none" stroke="#EF4444" strokeWidth={2.5} opacity={1 - ((frame * 1.5) % 30) / 30} />
            {/* Crimson Blood Droplet */}
            <path
              d="M 0 -35 C 25 0 35 20 25 38 C 15 52 -15 52 -25 38 C -35 20 -25 0 0 -35 Z"
              fill="#DC2626"
              stroke={INK}
              strokeWidth={4.5}
              strokeLinejoin="round"
            />
            {/* Glossy highlight */}
            <path d="M -12 25 Q -18 35 -6 40" stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" />
            <text x={0} y={30} fill="#FFFFFF" fontSize={26} fontWeight="900" textAnchor="middle">
              TYPE O
            </text>
          </g>
        )}
      </g>

      {/* Hand-Drawn Comic Pointer Labels (NO corporate cards/badges!) */}
      {/* Pointer 1: GENES (Left) */}
      {layer1Progress > 0 && (
        <g transform="translate(480, 680)" opacity={layer1Progress}>
          <text x={0} y={0} fill={INK} fontSize={32} fontWeight="900" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive" textAnchor="end">
            1. GENES (2/3)
          </text>
          <path d="M 15 -10 Q 180 -10 380 -5" stroke={INK} strokeWidth={4} fill="none" strokeDasharray="10 8" />
          <circle cx={380} cy={-5} r={6} fill="#2563EB" />
        </g>
      )}

      {/* Pointer 2: SKIN MICROBIOME (Top Left) */}
      {layer2Progress > 0 && (
        <g transform="translate(480, 420)" opacity={layer2Progress}>
          <text x={0} y={0} fill={INK} fontSize={32} fontWeight="900" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive" textAnchor="end">
            2. SKIN MICROBES
          </text>
          <path d="M 15 -10 Q 160 -10 320 60" stroke={INK} strokeWidth={4} fill="none" strokeDasharray="10 8" />
          <circle cx={320} cy={60} r={6} fill="#10B981" />
        </g>
      )}

      {/* Pointer 3: BLOOD TYPE (Right) */}
      {layer3Progress > 0 && (
        <g transform="translate(1440, 560)" opacity={layer3Progress}>
          <text x={0} y={0} fill={INK} fontSize={32} fontWeight="900" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive">
            3. BLOOD CHEMISTRY
          </text>
          <path d="M -15 -10 Q -140 -10 -280 20" stroke={INK} strokeWidth={4} fill="none" strokeDasharray="10 8" />
          <circle cx={-280} cy={20} r={6} fill="#DC2626" />
        </g>
      )}
    </svg>
  );
};

/**
 * =========================================================================
 * 📡 BEAT 4: Scent Waves & Broadcast Beacon into Night Sky (482 - 655f)
 * =========================================================================
 * Host radiating CO2, heat, and skin odor trails forming a lighthouse-like
 * broadcast beacon sweeping into the night sky, where a distant mosquito locks on.
 */
export const ZennClosingBeat4_BroadcastBeacon: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs>
        {/* Beacon searchlight gradient */}
        <linearGradient id="beaconBeamGrad" x1="0%" y1="50%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.45" />
          <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#1E293B" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Night Sky Background */}
      <rect x={0} y={0} width={1920} height={760} fill="#111827" />
      <rect x={0} y={760} width={1920} height={320} fill="#0F172A" />
      <line x1={0} y1={760} x2={1920} y2={760} stroke="#334155" strokeWidth={5} strokeLinecap="round" />

      {/* Distant Stars */}
      {[
        { x: 180, y: 140 }, { x: 380, y: 90 }, { x: 740, y: 180 },
        { x: 920, y: 80 }, { x: 1200, y: 160 }, { x: 1540, y: 110 }, { x: 1780, y: 220 },
      ].map((star, i) => (
        <circle key={i} cx={star.x} cy={star.y} r={2 + Math.sin(frame * 0.15 + i) * 1} fill="#F8FAFC" opacity={0.8} />
      ))}

      {/* Hand-Drawn Crescent Moon in Upper Left */}
      <g transform="translate(220, 150)">
        <path d="M 0 -45 A 45 45 0 1 0 45 40 A 38 38 0 1 1 0 -45 Z" fill="#FEF08A" stroke={INK} strokeWidth={3.5} />
      </g>

      {/* ============================================================== */}
      {/* GIANT LIGHTHOUSE / BROADCAST BEACON SWEEP                      */}
      {/* ============================================================== */}
      <g>
        {/* Translucent sweeping searchlight beam */}
        <polygon
          points="580,520 1920,80 1920,480"
          fill="url(#beaconBeamGrad)"
        />

        {/* Pulsing expanding radio broadcast arcs inside beacon */}
        {[80, 200, 360, 550, 780].map((dist, i) => {
          const arcOffset = (frame * 3 + i * 120) % 800;
          return (
            <path
              key={i}
              d={`M ${580 + arcOffset * 0.9} ${520 - arcOffset * 0.45} Q ${580 + arcOffset * 1.1} ${520 - arcOffset * 0.15} ${580 + arcOffset * 0.85} ${520 + arcOffset * 0.1}`}
              stroke="#FEF08A"
              strokeWidth={4}
              strokeDasharray="14 12"
              fill="none"
              opacity={Math.max(0, 1 - arcOffset / 800)}
            />
          );
        })}
      </g>

      {/* Host Stickman on Left radiating waves */}
      <g transform="translate(540, 560)">
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>
        {/* Calm Innocent Face */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-6} r={5} fill={INK} />
        <line x1={-28} y1={-24} x2={-8} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-24} x2={28} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={-12} y1={24} x2={12} y2={24} stroke={INK} strokeWidth={3.8} strokeLinecap="round" />

        {/* Blue T-Shirt Torso */}
        <path
          d="M -26 65 Q 0 75 26 65 L 48 85 L 36 125 L 24 110 L 24 175 L -24 175 L -24 110 L -36 125 L -48 85 Z"
          fill="#2563EB"
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />

        {/* Standing Legs to baseline */}
        <g stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none">
          <line x1={-15} y1={175} x2={-15} y2={290} />
          <line x1={15} y1={175} x2={15} y2={290} />
          <line x1={-15} y1={290} x2={-35} y2={290} />
          <line x1={15} y1={290} x2={35} y2={290} />
          <line x1={-24} y1={95} x2={-50} y2={160} />
          <line x1={24} y1={95} x2={50} y2={160} />
        </g>
      </g>

      {/* 3 Visible Radiating Scent Streams from Host */}
      {/* 1. Blue CO2 Breath Stream */}
      <path
        d={`M 560 520 Q 820 420 1150 ${300 + Math.sin(frame * 0.15) * 15}`}
        stroke="#38BDF8"
        strokeWidth={6}
        strokeDasharray="16 10"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x={760}
        y={350}
        fill="#38BDF8"
        fontSize={24}
        fontWeight="900"
        fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
      >
        CO₂ PLUME
      </text>

      {/* 2. Amber Skin Odor Ribbon */}
      <path
        d={`M 580 580 Q 940 520 1350 ${380 + Math.cos(frame * 0.15) * 15}`}
        stroke="#F59E0B"
        strokeWidth={6}
        strokeDasharray="16 10"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x={890}
        y={500}
        fill="#F59E0B"
        fontSize={24}
        fontWeight="900"
        fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
      >
        SKIN ODOR
      </text>

      {/* 3. Heat Wave Shimmer */}
      <path
        d={`M 540 480 Q 640 320 800 ${220 + Math.sin(frame * 0.2) * 12}`}
        stroke="#EF4444"
        strokeWidth={5}
        strokeDasharray="12 8"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x={650}
        y={240}
        fill="#EF4444"
        fontSize={24}
        fontWeight="900"
        fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
      >
        BODY HEAT
      </text>

      {/* Distant Mosquito in Upper Right detecting the broadcast */}
      <g transform={`translate(${1620 + Math.sin(frame * 0.1) * 15}, ${260 + Math.cos(frame * 0.12) * 15}) rotate(-15)`}>
        <ZennDetailedMosquito scale={1.5} facing="left" />
        {/* Radio lock-on sparks at antenna */}
        <g stroke="#FACC15" strokeWidth={3} strokeLinecap="round">
          <line x1={-55} y1={-20} x2={-75} y2={-35} />
          <line x1={-45} y1={-35} x2={-60} y2={-55} />
          <line x1={-30} y1={-45} x2={-35} y2={-70} />
        </g>
        <text
          x={-50}
          y={-85}
          fill="#FEF08A"
          fontSize={26}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
        >
          SIGNAL DETECTED!
        </text>
      </g>
    </svg>
  );
};

/**
 * =========================================================================
 * 👓 BEAT 5: Split Perception — Human vs Mosquito Thermal Goggles (655 - 827f)
 * =========================================================================
 * Split screen:
 * - Left: Human view on suburban porch, ordinary guy standing under lamp, "invisible".
 * - Right: Mosquito thermal/chemical goggles view, host is a glowing neon sign!
 */
export const ZennClosingBeat5_SplitPerception: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ============================================================== */}
      {/* LEFT PANEL: HUMAN VIEW (x: 0 to 960)                          */}
      {/* ============================================================== */}
      <g clipPath="url(#leftPanelClip)">
        <clipPath id="leftPanelClip">
          <rect x={0} y={0} width={960} height={1080} />
        </clipPath>

        {/* Warm Ochre Porch Wall & Deck */}
        <rect x={0} y={0} width={960} height={750} fill={WALL_OCHRE} />
        <rect x={0} y={750} width={960} height={330} fill="#5A3E26" />
        <line x1={0} y1={750} x2={960} y2={750} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Overhead Hanging Porch Lantern */}
        <g transform="translate(480, 180)">
          <line x1={0} y1={-180} x2={0} y2={0} stroke={INK} strokeWidth={5} />
          <polygon points="-30,0 30,0 20,50 -20,50" fill="#FACC15" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
          <polygon points="-40,0 40,0 0,-25" fill="#334155" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          {/* Soft yellow light cone */}
          <polygon points="-30,50 30,50 320,630 -320,630" fill="rgba(254, 240, 138, 0.15)" />
        </g>

        {/* Ordinary Stickman in Blue Shirt */}
        <g transform="translate(480, 560)">
          <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
          {/* 3 spiky hairs */}
          <g stroke={INK} strokeWidth={5} strokeLinecap="round">
            <line x1={-14} y1={-53} x2={-20} y2={-88} />
            <line x1={0} y1={-55} x2={0} y2={-96} />
            <line x1={14} y1={-53} x2={22} y2={-86} />
          </g>
          {/* Ordinary relaxed face */}
          <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={-18} cy={-6} r={5} fill={INK} />
          <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={18} cy={-6} r={5} fill={INK} />
          <line x1={-28} y1={-24} x2={-8} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={8} y1={-24} x2={28} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
          <line x1={-12} y1={24} x2={12} y2={24} stroke={INK} strokeWidth={3.8} strokeLinecap="round" />

          {/* Blue T-shirt */}
          <path
            d="M -26 65 Q 0 75 26 65 L 48 85 L 36 125 L 24 110 L 24 175 L -24 175 L -24 110 L -36 125 L -48 85 Z"
            fill="#2563EB"
            stroke={INK}
            strokeWidth={5}
            strokeLinejoin="round"
          />

          {/* Legs */}
          <g stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none">
            <line x1={-15} y1={175} x2={-15} y2={280} />
            <line x1={15} y1={175} x2={15} y2={280} />
            <line x1={-15} y1={280} x2={-35} y2={280} />
            <line x1={15} y1={280} x2={35} y2={280} />
            <line x1={-24} y1={95} x2={-45} y2={155} />
            <line x1={24} y1={95} x2={45} y2={155} />
          </g>
        </g>

        {/* Hand-Drawn Comic Label */}
        <text
          x={480}
          y={80}
          fill={INK}
          fontSize={38}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
        >
          TO HUMANS: INVISIBLE
        </text>
      </g>

      {/* ============================================================== */}
      {/* RIGHT PANEL: MOSQUITO THERMAL VISION (x: 960 to 1920)          */}
      {/* ============================================================== */}
      <g clipPath="url(#rightPanelClip)">
        <clipPath id="rightPanelClip">
          <rect x={960} y={0} width={960} height={1080} />
        </clipPath>

        {/* Night Vision Thermal Dark Background */}
        <rect x={960} y={0} width={960} height={1080} fill="#0A0F1D" />

        {/* Fine Tactical Thermal Grid Lines */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`h${i}`} x1={960} y1={i * 120} x2={1920} y2={i * 120} stroke="#1E293B" strokeWidth={1.5} strokeDasharray="6 6" />
        ))}
        {Array.from({ length: 8 }).map((_, i) => (
          <line key={`v${i}`} x1={960 + i * 120} y1={0} x2={960 + i * 120} y2={1080} stroke="#1E293B" strokeWidth={1.5} strokeDasharray="6 6" />
        ))}

        {/* NEON THERMAL HOST STICKMAN */}
        <g transform="translate(1440, 560)">
          {/* Intense Thermal Heat Halo */}
          <ellipse cx={0} cy={120} rx={190} ry={260} fill="#F43F5E" opacity={0.35 + Math.sin(frame * 0.2) * 0.08} />
          <ellipse cx={0} cy={120} rx={140} ry={200} fill="#F59E0B" opacity={0.45} />
          <ellipse cx={0} cy={120} rx={90} ry={140} fill="#FEF08A" opacity={0.55} />

          {/* Glowing head */}
          <circle cx={0} cy={0} r={55} fill="#FEF08A" stroke="#F43F5E" strokeWidth={7} />
          {/* Glowing spiky hair */}
          <g stroke="#EF4444" strokeWidth={6} strokeLinecap="round">
            <line x1={-14} y1={-53} x2={-20} y2={-88} />
            <line x1={0} y1={-55} x2={0} y2={-96} />
            <line x1={14} y1={-53} x2={22} y2={-86} />
          </g>
          {/* Heat Eyes */}
          <circle cx={-18} cy={-6} r={14} fill="#EF4444" />
          <circle cx={-18} cy={-6} r={5} fill="#FEF08A" />
          <circle cx={18} cy={-6} r={14} fill="#EF4444" />
          <circle cx={18} cy={-6} r={5} fill="#FEF08A" />

          {/* Neon Torso & Limbs */}
          <path
            d="M -26 65 Q 0 75 26 65 L 48 85 L 36 125 L 24 110 L 24 175 L -24 175 L -24 110 L -36 125 L -48 85 Z"
            fill="#EF4444"
            stroke="#FEF08A"
            strokeWidth={6}
            strokeLinejoin="round"
          />

          <g stroke="#F59E0B" strokeWidth={7} strokeLinecap="round" fill="none">
            <line x1={-15} y1={175} x2={-15} y2={280} />
            <line x1={15} y1={175} x2={15} y2={280} />
            <line x1={-15} y1={280} x2={-35} y2={280} />
            <line x1={15} y1={280} x2={35} y2={280} />
            <line x1={-24} y1={95} x2={-45} y2={155} />
            <line x1={24} y1={95} x2={45} y2={155} />
          </g>

          {/* Target Reticle Brackets */}
          <g stroke="#22C55E" strokeWidth={5} fill="none">
            {/* Top-Left */}
            <path d="M -130 0 L -130 -60 L -70 -60" />
            {/* Top-Right */}
            <path d="M 130 0 L 130 -60 L 70 -60" />
            {/* Bottom-Left */}
            <path d="M -130 200 L -130 260 L -70 260" />
            {/* Bottom-Right */}
            <path d="M 130 200 L 130 260 L 70 260" />
          </g>
        </g>

        {/* Hand-Drawn Comic Label */}
        <text
          x={1440}
          y={80}
          fill="#22C55E"
          fontSize={38}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
        >
          TO HER: A NEON BILLBOARD 🎯
        </text>

        {/* Tactical HUD readout */}
        <text
          x={1440}
          y={860}
          fill="#38BDF8"
          fontSize={24}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
        >
          HEAT: 37°C • CO₂: 100% • TARGET LOCKED
        </text>
      </g>

      {/* ============================================================== */}
      {/* HAND-DRAWN CENTRAL SPLIT LINE                                  */}
      {/* ============================================================== */}
      <line x1={960} y1={0} x2={960} y2={1080} stroke={INK} strokeWidth={8} />
      <line x1={956} y1={0} x2={956} y2={1080} stroke="#FFFFFF" strokeWidth={3} strokeDasharray="20 16" />
    </svg>
  );
};

/**
 * =========================================================================
 * 🚶 BEAT 6: Suburban Evening Sidewalk Walk (827 - 1,015f)
 * =========================================================================
 * Host walking along a quiet suburban evening sidewalk under streetlamp.
 * Behind him, each footstep leaves a glowing heat footprint and a puff of scent trail.
 */
export const ZennClosingBeat6_SuburbanWalk: React.FC = () => {
  const frame = useCurrentFrame();

  // Walking stride cycle
  const walkStride = Math.sin(frame * 0.22);
  const legAngle1 = walkStride * 28;
  const legAngle2 = -walkStride * 28;
  const bodyBob = Math.abs(Math.cos(frame * 0.22)) * 8;

  // Sidewalk ground baseline at y=760
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Twilight Suburban Evening Sky */}
      <rect x={0} y={0} width={1920} height={740} fill="#1E2640" />
      {/* Sidewalk & Lawn */}
      <rect x={0} y={740} width={1920} height={140} fill="#CBD5E1" />
      <rect x={0} y={880} width={1920} height={200} fill="#15202B" />
      <line x1={0} y1={740} x2={1920} y2={740} stroke={INK} strokeWidth={6} />
      <line x1={0} y1={880} x2={1920} y2={880} stroke={INK} strokeWidth={6} />

      {/* Sidewalk Slab Dividers */}
      {[220, 520, 820, 1120, 1420, 1720].map((sx, i) => (
        <line key={i} x1={sx} y1={740} x2={sx - 50} y2={880} stroke="#94A3B8" strokeWidth={4} />
      ))}

      {/* Distant Suburban Cottage Silhouettes */}
      <polygon points="120,740 120,620 220,540 320,620 320,740" fill="#0F172A" stroke={INK} strokeWidth={4} />
      <polygon points="1520,740 1520,640 1600,570 1680,640 1680,740" fill="#0F172A" stroke={INK} strokeWidth={4} />
      {/* Cozy glowing windows */}
      <rect x={180} y={640} width={50} height={45} fill="#FEF08A" stroke={INK} strokeWidth={3} />
      <rect x={1570} y={650} width={45} height={40} fill="#FEF08A" stroke={INK} strokeWidth={3} />

      {/* Streetlamp on the Right (x=1380) with Golden Light Cone */}
      <g transform="translate(1380, 740)">
        {/* Lamp Post */}
        <line x1={0} y1={0} x2={0} y2={-520} stroke="#475569" strokeWidth={10} strokeLinecap="round" />
        {/* Curved Gooseneck arm */}
        <path d="M 0 -520 Q 0 -580 -70 -580" stroke="#475569" strokeWidth={8} fill="none" />
        {/* Lamp Head & Bulb */}
        <polygon points="-90,-580 -50,-580 -40,-550 -100,-550" fill="#334155" stroke={INK} strokeWidth={4} />
        <ellipse cx={-70} cy={-550} rx={25} ry={12} fill="#FEF08A" />
        {/* Wide Golden Cone of Light */}
        <polygon points="-70,-550 250,0 -390,0" fill="rgba(254, 240, 138, 0.18)" />
      </g>

      {/* Glowing Heat Footprints Behind Host */}
      {[
        { x: 380, y: 810, opacity: 0.2 },
        { x: 500, y: 800, opacity: 0.35 },
        { x: 620, y: 815, opacity: 0.55 },
        { x: 740, y: 805, opacity: 0.8 },
      ].map((fp, i) => (
        <g key={i} transform={`translate(${fp.x}, ${fp.y})`} opacity={fp.opacity}>
          <ellipse cx={0} cy={0} rx={22} ry={9} fill="#F59E0B" />
          <ellipse cx={0} cy={0} rx={14} ry={5} fill="#FEF08A" />
          {/* Heat glow ring */}
          <ellipse cx={0} cy={0} rx={30} ry={13} fill="none" stroke="#38BDF8" strokeWidth={2} strokeDasharray="4 4" />
        </g>
      ))}

      {/* Scent & CO2 Vapor Trails Curling Behind Host */}
      {[
        { x: 520, y: 640, delay: 0 },
        { x: 640, y: 600, delay: 10 },
        { x: 730, y: 560, delay: 20 },
      ].map((trail, i) => {
        const tOffset = ((frame * 1.5 + trail.delay) % 40) * 1.8;
        return (
          <g key={i} transform={`translate(${trail.x}, ${trail.y - tOffset})`}>
            <circle cx={0} cy={0} r={14 + tOffset * 0.3} fill="#FBBF24" opacity={Math.max(0, 0.6 - tOffset / 70)} />
            <circle cx={-15} cy={-5} r={10 + tOffset * 0.2} fill="#38BDF8" opacity={Math.max(0, 0.5 - tOffset / 70)} />
          </g>
        );
      })}

      {/* Host Stickman Walking (Center: x=880) */}
      <g transform={`translate(880, ${540 - bodyBob})`}>
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>
        {/* Whistling / Innocent Expression */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-15} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={21} cy={-6} r={5} fill={INK} />
        <line x1={-28} y1={-24} x2={-8} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-24} x2={28} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        {/* Whistling 'O' mouth */}
        <circle cx={0} cy={24} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />

        {/* Blue T-Shirt Torso */}
        <path
          d="M -26 65 Q 0 75 26 65 L 48 85 L 36 125 L 24 110 L 24 175 L -24 175 L -24 110 L -36 125 L -48 85 Z"
          fill="#2563EB"
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />

        {/* Animated Walking Legs */}
        <g stroke={INK} strokeWidth={6.5} strokeLinecap="round" fill="none">
          {/* Leg 1 */}
          <line x1={-10} y1={175} x2={-10 + Math.sin((legAngle1 * Math.PI) / 180) * 110} y2={175 + Math.cos((legAngle1 * Math.PI) / 180) * 110} />
          {/* Leg 2 */}
          <line x1={10} y1={175} x2={10 + Math.sin((legAngle2 * Math.PI) / 180) * 110} y2={175 + Math.cos((legAngle2 * Math.PI) / 180) * 110} />

          {/* Arms swinging in walk stride */}
          <line x1={-24} y1={95} x2={-24 - Math.sin((legAngle1 * Math.PI) / 180) * 55} y2={145} />
          <line x1={24} y1={95} x2={24 - Math.sin((legAngle2 * Math.PI) / 180) * 55} y2={145} />
        </g>
      </g>

      {/* Hand-Drawn Comic Label */}
      <text
        x={960}
        y={160}
        fill="#F8FAFC"
        fontSize={36}
        fontWeight="900"
        fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
        textAnchor="middle"
      >
        "WE THINK WE'RE INVISIBLE..."
      </text>
    </svg>
  );
};

/**
 * =========================================================================
 * 🦠 BEAT 7: Wide Living Ecosystem — Microbes & Mosquito (1,015 - 1,181f)
 * =========================================================================
 * Wide shot of host surrounded by the invisible living world: friendly microbes,
 * a mosquito hovering, waving hello to the ecosystem.
 */
export const ZennClosingBeat7_InvisibleWorld: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Parchment Studio Background with Ground Baseline */}
      <rect x={0} y={0} width={1920} height={1080} fill={PARCHMENT} />
      <line x1={0} y1={880} x2={1920} y2={880} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Host Stickman in Center Waving Hello */}
      <g transform="translate(960, 560)">
        {/* Soft biological ecosystem glow */}
        <ellipse cx={0} cy={60} rx={320} ry={240} fill="#10B981" opacity={0.08 + Math.sin(frame * 0.1) * 0.03} />

        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>
        {/* Happy Friendly Face */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-6} r={5} fill={INK} />
        <line x1={-28} y1={-26} x2={-8} y2={-26} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-26} x2={28} y2={-26} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <path d="M -14 22 Q 0 34 14 22" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Blue T-Shirt */}
        <path
          d="M -26 65 Q 0 75 26 65 L 48 85 L 36 125 L 24 110 L 24 175 L -24 175 L -24 110 L -36 125 L -48 85 Z"
          fill="#2563EB"
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />

        {/* Legs to baseline */}
        <g stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none">
          <line x1={-15} y1={175} x2={-20} y2={320} />
          <line x1={15} y1={175} x2={20} y2={320} />
          <line x1={-20} y1={320} x2={-40} y2={320} />
          <line x1={20} y1={320} x2={40} y2={320} />

          {/* Left hand waving gently */}
          <line x1={-24} y1={95} x2={-75} y2={70} />
          <line x1={-75} y1={70} x2={-100 + Math.sin(frame * 0.25) * 15} y2={20} />

          {/* Right hand waving towards mosquito */}
          <line x1={24} y1={95} x2={75} y2={70} />
          <line x1={75} y1={70} x2={100 + Math.sin(frame * 0.25) * 15} y2={20} />
        </g>
      </g>

      {/* ============================================================== */}
      {/* CUTE FRIENDLY MICROBES FLOATING AROUND HOST                    */}
      {/* ============================================================== */}
      {/* Microbe 1: Green smiling blob (Top Left) */}
      <g transform={`translate(${560 + Math.sin(frame * 0.15) * 12}, ${360 + Math.cos(frame * 0.15) * 12})`}>
        <circle cx={0} cy={0} r={46} fill="#10B981" stroke={INK} strokeWidth={4.5} />
        <circle cx={-12} cy={-6} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <circle cx={-11} cy={-6} r={3} fill={INK} />
        <circle cx={12} cy={-6} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <circle cx={11} cy={-6} r={3} fill={INK} />
        <path d="M -8 10 Q 0 20 8 10" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
        {/* Little waving nub */}
        <path d="M -46 0 Q -65 -20 -50 -35" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
      </g>

      {/* Microbe 2: Amber silly rod (Bottom Left) */}
      <g transform={`translate(${480 + Math.cos(frame * 0.12) * 10}, ${650 + Math.sin(frame * 0.12) * 10}) rotate(15)`}>
        <rect x={-25} y={-50} width={50} height={100} rx={25} fill="#F59E0B" stroke={INK} strokeWidth={4.5} />
        <circle cx={-10} cy={-15} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <circle cx={-10} cy={-15} r={3} fill={INK} />
        <circle cx={10} cy={-15} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <circle cx={10} cy={-15} r={3} fill={INK} />
        <path d="M -8 15 Q 0 25 8 15" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>

      {/* Microbe 3: Pink bouncing sphere (Top Right) */}
      <g transform={`translate(${1380 + Math.sin(frame * 0.18) * 14}, ${340 + Math.cos(frame * 0.18) * 14})`}>
        <circle cx={0} cy={0} r={40} fill="#EC4899" stroke={INK} strokeWidth={4.5} />
        <circle cx={-10} cy={-5} r={6} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <circle cx={-9} cy={-5} r={2.5} fill={INK} />
        <circle cx={10} cy={-5} r={6} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
        <circle cx={9} cy={-5} r={2.5} fill={INK} />
        <path d="M -6 10 Q 0 16 6 10" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>

      {/* Friendly Mosquito Hovering on Mid-Right waving front leg */}
      <g transform={`translate(${1280 + Math.cos(frame * 0.1) * 15}, ${540 + Math.sin(frame * 0.15) * 15}) rotate(-8)`}>
        <ZennDetailedMosquito scale={1.4} facing="left" />
        {/* Waving front leg */}
        <line
          x1={-30}
          y1={40}
          x2={-70 + Math.sin(frame * 0.3) * 15}
          y2={15 + Math.cos(frame * 0.3) * 15}
          stroke={INK}
          strokeWidth={4}
          strokeLinecap="round"
        />
        {/* Friendly speech / wave arc */}
        <path d="M -85 0 Q -100 15 -85 30" stroke="#38BDF8" strokeWidth={3} fill="none" strokeLinecap="round" />
      </g>

      {/* Hand-Drawn Comic Label */}
      <text
        x={960}
        y={160}
        fill={INK}
        fontSize={38}
        fontWeight="900"
        fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
        textAnchor="middle"
      >
        "...TO EVERYTHING FROM MOSQUITOES TO MICROBES"
      </text>
    </svg>
  );
};

/**
 * =========================================================================
 * 🔍 BEAT 8: Curious Host with Magnifying Glass (1,181 - 1,346f)
 * =========================================================================
 * Host raises magnifying glass, looking through it with a bright curious smile;
 * eye is humorously enlarged through the lens with sparkles and doodle question marks.
 */
export const ZennClosingBeat8_CuriousHost: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Parchment Studio Background with Ground Baseline */}
      <rect x={0} y={0} width={1920} height={1080} fill={PARCHMENT} />
      <line x1={0} y1={880} x2={1920} y2={880} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Floating Doodle Question Marks around Host */}
      {[
        { x: 580, y: 380, rot: -15, scale: 1.2, col: '#3B82F6' },
        { x: 680, y: 260, rot: 10, scale: 0.9, col: '#F59E0B' },
        { x: 1260, y: 280, rot: -10, scale: 1.1, col: '#10B981' },
        { x: 1380, y: 400, rot: 20, scale: 1.3, col: '#EC4899' },
      ].map((q, i) => (
        <text
          key={i}
          x={q.x}
          y={q.y + Math.sin(frame * 0.15 + i) * 12}
          fill={q.col}
          fontSize={65 * q.scale}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          transform={`rotate(${q.rot}, ${q.x}, ${q.y})`}
        >
          ?
        </text>
      ))}

      {/* Host Stickman in Center */}
      <g transform="translate(960, 560)">
        {/* Head */}
        <circle cx={0} cy={0} r={65} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round">
          <line x1={-16} y1={-62} x2={-24} y2={-102} />
          <line x1={0} y1={-65} x2={0} y2={-112} />
          <line x1={16} y1={-62} x2={26} y2={-100} />
        </g>

        {/* Normal Left Eye smiling */}
        <circle cx={-25} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        <circle cx={-22} cy={-6} r={5} fill={INK} />
        <line x1={-40} y1={-26} x2={-15} y2={-26} stroke={INK} strokeWidth={5} strokeLinecap="round" />

        {/* Delighted Open Smile */}
        <path d="M -16 28 Q 0 45 22 28 Z" fill="#FFFFFF" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />

        {/* Blue T-Shirt */}
        <path
          d="M -28 75 Q 0 85 28 75 L 52 98 L 40 145 L 26 130 L 26 200 L -26 200 L -26 130 L -40 145 L -52 98 Z"
          fill="#2563EB"
          stroke={INK}
          strokeWidth={5.5}
          strokeLinejoin="round"
        />

        {/* Legs grounded */}
        <g stroke={INK} strokeWidth={6.5} strokeLinecap="round" fill="none">
          <line x1={-18} y1={200} x2={-25} y2={320} />
          <line x1={18} y1={200} x2={25} y2={320} />
          <line x1={-25} y1={320} x2={-50} y2={320} />
          <line x1={25} y1={320} x2={50} y2={320} />
          {/* Left arm relaxed at side */}
          <line x1={-26} y1={110} x2={-60} y2={180} />
          {/* Right arm holding magnifying glass handle */}
          <line x1={26} y1={110} x2={75} y2={100} />
          <line x1={75} y1={100} x2={60} y2={15} />
        </g>

        {/* ============================================================== */}
        {/* GIANT MAGNIFYING GLASS OVER RIGHT EYE                          */}
        {/* ============================================================== */}
        <g transform="translate(42, -8)">
          {/* Wooden Handle angled down to right hand */}
          <line x1={22} y1={44} x2={48} y2={120} stroke="#8D5B3A" strokeWidth={14} strokeLinecap="round" />
          <line x1={22} y1={44} x2={48} y2={120} stroke={INK} strokeWidth={18} strokeLinecap="round" opacity={0.25} />

          {/* Lens Rim (r=56) */}
          <circle cx={0} cy={0} r={56} fill="#FFFFFF" stroke={INK} strokeWidth={6.5} />

          {/* Clip path for inside of lens: GIANT 2.5X ENLARGED CURIOUS EYE */}
          <clipPath id="curiousLensClip">
            <circle cx={0} cy={0} r={50} />
          </clipPath>

          <g clipPath="url(#curiousLensClip)">
            {/* Background of magnified skin/face */}
            <rect x={-60} y={-60} width={120} height={120} fill="#FFFFFF" />

            {/* Giant Curious Eye */}
            <circle cx={0} cy={-2} r={32} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
            <circle cx={2} cy={-2} r={16} fill={INK} />
            {/* Sparkling Anime Stars / Highlights */}
            <circle cx={-5} cy={-7} r={5} fill="#FFFFFF" />
            <circle cx={6} cy={3} r={3} fill="#FFFFFF" />

            {/* Giant raised curious eyebrow */}
            <path d="M -25 -25 Q 0 -40 25 -25" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />
          </g>

          {/* Glass Glare Arc */}
          <path d="M -40 -25 A 45 45 0 0 1 -12 -45" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" fill="none" opacity={0.8} />

          {/* Sparkle Star on Rim */}
          <g transform={`translate(${44}, ${-35}) scale(${0.7 + Math.sin(frame * 0.3) * 0.2})`}>
            <polygon points="0,-14 3.5,-3.5 14,0 3.5,3.5 0,14 -3.5,3.5 -14,0 -3.5,-3.5" fill="#FACC15" stroke={INK} strokeWidth={1.8} />
          </g>
        </g>
      </g>

      {/* Hand-Drawn Comic Caption */}
      <text
        x={960}
        y={160}
        fill={INK}
        fontSize={38}
        fontWeight="900"
        fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
        textAnchor="middle"
      >
        "QUESTIONS HIDING IN PLAIN SIGHT..."
      </text>
    </svg>
  );
};

/**
 * =========================================================================
 * 🖋️ BEAT 9: Hand-Drawn "SIR CURIOUS" Logo Reveal (1,346 - 1,482f)
 * =========================================================================
 * Hand-drawn cursive logo animation: "SIR CURIOUS" in bold black ink,
 * surrounded by tiny doodle icons (magnifying glass, mosquito, DNA helix, microbe).
 */
export const ZennClosingBeat9_SirCuriousLogo: React.FC = () => {
  const frame = useCurrentFrame();

  // Dynamic ink draw underline progress
  const lineProgress = interpolate(frame, [10, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const icon1Progress = interpolate(frame, [25, 45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const icon2Progress = interpolate(frame, [40, 60], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const icon3Progress = interpolate(frame, [55, 75], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const icon4Progress = interpolate(frame, [70, 90], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Parchment Studio Background with Double Hand-Drawn Comic Border */}
      <rect x={0} y={0} width={1920} height={1080} fill={PARCHMENT} />
      <rect x={40} y={40} width={1840} height={1000} rx={24} fill="none" stroke={INK} strokeWidth={5} />
      <rect x={55} y={55} width={1810} height={970} rx={18} fill="none" stroke="#D1D5DB" strokeWidth={2} strokeDasharray="12 8" />

      {/* Central Brand Typography Group */}
      <g transform="translate(960, 490)">
        {/* Warm Amber Drop Shadow on Title */}
        <text
          x={6}
          y={6}
          fill="#F59E0B"
          fontSize={128}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
          letterSpacing="4px"
        >
          SIR CURIOUS
        </text>

        {/* Main Bold Ink Wordmark */}
        <text
          x={0}
          y={0}
          fill={INK}
          fontSize={128}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
          letterSpacing="4px"
        >
          SIR CURIOUS
        </text>

        {/* Hand-Drawn Dynamic Underline Swoop */}
        {lineProgress > 0 && (
          <path
            d={`M ${-440} 45 Q 0 80 ${-440 + lineProgress * 880} 45`}
            stroke={INK}
            strokeWidth={8}
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Subtitle in clean hand-drawn comic style */}
        <text
          x={0}
          y={110}
          fill="#4B5563"
          fontSize={34}
          fontWeight="800"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
          letterSpacing="3px"
        >
          SCIENCE HIDING RIGHT UNDER YOUR SKIN
        </text>
      </g>

      {/* ============================================================== */}
      {/* 4 SURROUNDING DOODLE ICONS                                     */}
      {/* ============================================================== */}
      {/* Icon 1: Mini Magnifying Glass (Top Left: x=400, y=280) */}
      {icon1Progress > 0 && (
        <g transform={`translate(400, 280) scale(${icon1Progress * 1.15}) rotate(-18)`}>
          <circle cx={0} cy={0} r={44} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
          <line x1={32} y1={32} x2={70} y2={70} stroke="#8D5B3A" strokeWidth={14} strokeLinecap="round" />
          <line x1={32} y1={32} x2={70} y2={70} stroke={INK} strokeWidth={16} strokeLinecap="round" opacity={0.2} />
          <path d="M -26 -16 A 32 32 0 0 1 -5 -30" stroke="#38BDF8" strokeWidth={5.5} strokeLinecap="round" fill="none" />
        </g>
      )}

      {/* Icon 2: Mini Cartoon Mosquito (Top Right: x=1540, y=280) */}
      {icon2Progress > 0 && (
        <g transform={`translate(1540, ${280 + Math.sin(frame * 0.2) * 10}) scale(${icon2Progress * 1.25}) rotate(12)`}>
          <ZennDetailedMosquito scale={0.9} facing="left" />
          {/* Swirl flight line */}
          <path d="M 60 40 Q 90 20 80 -10 Q 70 -30 45 -10" stroke={INK} strokeWidth={3} strokeDasharray="6 4" fill="none" />
        </g>
      )}

      {/* Icon 3: Stylized DNA Double Helix (Bottom Left: x=420, y=720) */}
      {icon3Progress > 0 && (
        <g transform={`translate(420, 720) scale(${icon3Progress * 1.35}) rotate(25)`}>
          {[-30, -15, 0, 15, 30].map((dy, i) => {
            const w = Math.sin(dy * 0.1) * 25;
            return (
              <React.Fragment key={i}>
                <line x1={-w} y1={dy} x2={w} y2={dy} stroke={i % 2 === 0 ? '#3B82F6' : '#10B981'} strokeWidth={4.5} strokeLinecap="round" />
                <circle cx={-w} cy={dy} r={4} fill="#2563EB" />
                <circle cx={w} cy={dy} r={4} fill="#EF4444" />
              </React.Fragment>
            );
          })}
        </g>
      )}

      {/* Icon 4: Cute Microbe Doodle (Bottom Right: x=1520, y=720) */}
      {icon4Progress > 0 && (
        <g transform={`translate(1520, 720) scale(${icon4Progress * 1.35})`}>
          <circle cx={0} cy={0} r={42} fill="#10B981" stroke={INK} strokeWidth={5} />
          <circle cx={-10} cy={-6} r={6} fill="#FFFFFF" />
          <circle cx={-10} cy={-6} r={2.5} fill={INK} />
          <circle cx={10} cy={-6} r={6} fill="#FFFFFF" />
          <circle cx={10} cy={-6} r={2.5} fill={INK} />
          <path d="M -8 10 Q 0 18 8 10" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        </g>
      )}

      {/* Comic Sparkle Bursts */}
      {[
        { x: 340, y: 480 }, { x: 1580, y: 480 }, { x: 960, y: 220 },
      ].map((sp, i) => (
        <g key={i} transform={`translate(${sp.x}, ${sp.y}) scale(${0.8 + Math.sin(frame * 0.2 + i) * 0.2})`}>
          <polygon points="0,-16 4,-4 16,0 4,4 0,16 -4,4 -16,0 -4,-4" fill="#FACC15" stroke={INK} strokeWidth={2} />
        </g>
      ))}
    </svg>
  );
};

/**
 * =========================================================================
 * 📺 BEAT 10: YouTube Outro End Screen + Mosquito Tap Gag (1,482 - 1,698f)
 * =========================================================================
 * Host stickman on left waving;
 * Big hand-drawn red "SUBSCRIBE" button with bell icon on the right;
 * Two 16:9 hand-drawn comic video thumbnail frames above;
 * A mosquito lands on the subscribe button -> host gently taps it -> button squashes ->
 * confetti bursts -> bell rings -> dizzy mosquito floats with a tiny "THANKS!" sign!
 */
export const ZennClosingBeat10_YouTubeOutro: React.FC = () => {
  const frame = useCurrentFrame();

  // Timing relative to beat start (0 to 216 frames):
  // Frames 0-40: Outro settles
  // Frames 35-75: Mosquito flies in and lands on SUBSCRIBE button
  // Frame 75-95: Host extends finger and taps the button
  // Frame 90: Button squashes, Confetti explodes, Bell rings!
  const mosqFlyIn = interpolate(frame, [30, 70], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const mosqX = interpolate(mosqFlyIn, [0, 1], [1850, 1260]);
  const mosqY = interpolate(mosqFlyIn, [0, 1], [400, 620]);

  const tapTrigger = frame >= 85;
  const tapBounce = spring({
    frame: frame - 85,
    fps: 30,
    config: { damping: 10, mass: 0.6, stiffness: 200 },
  });
  const buttonSquashY = tapTrigger ? interpolate(tapBounce, [0, 0.5, 1], [1, 0.8, 1]) : 1;
  const buttonSquashX = tapTrigger ? interpolate(tapBounce, [0, 0.5, 1], [1, 1.15, 1]) : 1;

  // Bell ring vibration
  const bellRing = tapTrigger ? Math.sin((frame - 85) * 0.8) * 18 * Math.max(0, 1 - (frame - 85) / 60) : 0;

  // Mosquito post-tap reaction (bounced up dizzy)
  const mosqBounced = frame > 85;
  const mosqBounceY = mosqBounced ? interpolate(frame - 85, [0, 20, 60], [0, -140, -110]) : 0;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Parchment Studio Background with Ground Baseline */}
      <rect x={0} y={0} width={1920} height={1080} fill={PARCHMENT} />
      <line x1={0} y1={880} x2={1920} y2={880} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* ============================================================== */}
      {/* 2 HAND-DRAWN 16:9 VIDEO CARDS (Upper Center-Right)             */}
      {/* ============================================================== */}
      {/* Video Card 1: UP NEXT */}
      <g transform="translate(720, 250)">
        {/* Card Background with thick hand-drawn comic border */}
        <rect x={-230} y={-130} width={460} height={260} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {/* Inner header strip */}
        <rect x={-230} y={-130} width={460} height={50} rx={18} fill="#F1F5F9" />
        <line x1={-230} y1={-80} x2={230} y2={-80} stroke={INK} strokeWidth={3} />
        <text x={0} y={-95} fill="#475569" fontSize={22} fontWeight="900" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive" textAnchor="middle">
          ▶ UP NEXT
        </text>
        {/* Doodle Play Icon in center */}
        <circle cx={0} cy={15} r={40} fill="#EF4444" stroke={INK} strokeWidth={4} />
        <polygon points="-10,-5 18,15 -10,35" fill="#FFFFFF" />
        {/* Title underneath */}
        <text x={0} y={90} fill={INK} fontSize={22} fontWeight="800" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive" textAnchor="middle">
          Why Does Scratching Itch More?
        </text>
      </g>

      {/* Video Card 2: RECOMMENDED */}
      <g transform="translate(1320, 250)">
        <rect x={-230} y={-130} width={460} height={260} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <rect x={-230} y={-130} width={460} height={50} rx={18} fill="#F1F5F9" />
        <line x1={-230} y1={-80} x2={230} y2={-80} stroke={INK} strokeWidth={3} />
        <text x={0} y={-95} fill="#475569" fontSize={22} fontWeight="900" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive" textAnchor="middle">
          ★ RECOMMENDED FOR YOU
        </text>
        <circle cx={0} cy={15} r={40} fill="#2563EB" stroke={INK} strokeWidth={4} />
        <polygon points="-10,-5 18,15 -10,35" fill="#FFFFFF" />
        <text x={0} y={90} fill={INK} fontSize={22} fontWeight="800" fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive" textAnchor="middle">
          The Hidden Chemistry of Sweat
        </text>
      </g>

      {/* ============================================================== */}
      {/* HOST STICKMAN ON LEFT WAVING & TAPPING                         */}
      {/* ============================================================== */}
      <g transform="translate(380, 560)">
        {/* Head */}
        <circle cx={0} cy={0} r={65} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round">
          <line x1={-16} y1={-62} x2={-24} y2={-102} />
          <line x1={0} y1={-65} x2={0} y2={-112} />
          <line x1={16} y1={-62} x2={26} y2={-100} />
        </g>
        {/* Cheerful smiling face */}
        <circle cx={-22} cy={-4} r={16} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        <circle cx={-18} cy={-4} r={6} fill={INK} />
        <circle cx={22} cy={-4} r={16} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        <circle cx={26} cy={-4} r={6} fill={INK} />
        <line x1={-35} y1={-26} x2={-12} y2={-26} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <line x1={12} y1={-26} x2={35} y2={-26} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <path d="M -16 26 Q 0 45 22 26 Z" fill="#FFFFFF" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />

        {/* Blue T-Shirt */}
        <path
          d="M -28 75 Q 0 85 28 75 L 52 98 L 40 145 L 26 130 L 26 200 L -26 200 L -26 130 L -40 145 L -52 98 Z"
          fill="#2563EB"
          stroke={INK}
          strokeWidth={5.5}
          strokeLinejoin="round"
        />

        {/* Standing Legs to baseline */}
        <g stroke={INK} strokeWidth={6.5} strokeLinecap="round" fill="none">
          <line x1={-18} y1={200} x2={-25} y2={320} />
          <line x1={18} y1={200} x2={25} y2={320} />
          <line x1={-25} y1={320} x2={-50} y2={320} />
          <line x1={25} y1={320} x2={50} y2={320} />

          {/* Left arm enthusiastically waving */}
          <line x1={-26} y1={110} x2={-85} y2={70} />
          <line x1={-85} y1={70} x2={-125 + Math.sin(frame * 0.35) * 20} y2={0} />

          {/* Right arm: Points towards Subscribe button */}
          <line x1={26} y1={110} x2={95} y2={100} />
          <line x1={95} y1={100} x2={165} y2={110} />
        </g>
      </g>

      {/* ============================================================== */}
      {/* BIG HAND-DRAWN RED "SUBSCRIBE" BUTTON + BELL ICON             */}
      {/* ============================================================== */}
      <g
        transform={`translate(1260, 720) scale(${buttonSquashX}, ${buttonSquashY})`}
      >
        {/* Soft button drop shadow */}
        <rect x={-246} y={-56} width={492} height={120} rx={60} fill="#991B1B" opacity={0.3} />

        {/* Main Red Pill Button */}
        <rect
          x={-240}
          y={-55}
          width={480}
          height={110}
          rx={55}
          fill="#DC2626"
          stroke={INK}
          strokeWidth={6}
        />

        {/* White Comic Text "SUBSCRIBE" */}
        <text
          x={-55}
          y={16}
          fill="#FFFFFF"
          fontSize={48}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          textAnchor="middle"
          letterSpacing="2px"
        >
          SUBSCRIBE
        </text>

        {/* Hand-Drawn Golden Bell Icon */}
        <g transform={`translate(150, 6) rotate(${bellRing})`}>
          <path
            d="M 0 -28 C -15 -28 -20 5 -25 15 L 25 15 C 20 5 15 -28 0 -28 Z"
            fill="#FACC15"
            stroke={INK}
            strokeWidth={4.5}
            strokeLinejoin="round"
          />
          {/* Bell clapper */}
          <circle cx={0} cy={22} r={6} fill="#F59E0B" stroke={INK} strokeWidth={3} />
          {/* Top handle loop */}
          <path d="M -6 -28 Q 0 -38 6 -28" stroke={INK} strokeWidth={3.5} fill="none" />

          {/* Sound ringing vibration arcs */}
          {tapTrigger && (
            <g stroke="#FACC15" strokeWidth={3} strokeLinecap="round" fill="none">
              <path d="M -34 0 Q -42 10 -34 20" />
              <path d="M 34 0 Q 42 10 34 20" />
            </g>
          )}
        </g>
      </g>

      {/* ============================================================== */}
      {/* COMIC MOSQUITO LANDS -> TAPPED -> BOUNCES DIZZY                */}
      {/* ============================================================== */}
      {frame >= 30 && (
        <g transform={`translate(${mosqX}, ${mosqY + mosqBounceY})`}>
          <ZennDetailedMosquito scale={1.2} facing={mosqBounced ? 'right' : 'left'} />

          {/* If bounced: dizzy swirl above eyes + "THANKS!" sign */}
          {mosqBounced && (
            <g transform="translate(0, -60)">
              {/* Dizzy spiral stars */}
              <text x={-20} y={-15} fontSize={20}>💫</text>
              {/* Little wooden sign */}
              <rect x={15} y={-30} width={90} height={35} rx={6} fill="#FEF3C7" stroke={INK} strokeWidth={2.5} />
              <line x1={30} y1={5} x2={30} y2={20} stroke="#8D5B3A" strokeWidth={3} />
              <text x={60} y={-8} fill={INK} fontSize={16} fontWeight="900" fontFamily="'Comic Sans MS', cursive" textAnchor="middle">
                THANKS!
              </text>
            </g>
          )}
        </g>
      )}

      {/* ============================================================== */}
      {/* COLORFUL HAND-DRAWN CONFETTI EXPLOSION                         */}
      {/* ============================================================== */}
      {tapTrigger && (
        <g transform="translate(1260, 720)">
          {Array.from({ length: 32 }).map((_, idx) => {
            const angle = (idx * 11.25 * Math.PI) / 180;
            const speed = 80 + (idx % 6) * 35;
            const dist = Math.min((frame - 85) * (speed / 10), speed * 3.5);
            const cx = Math.cos(angle) * dist;
            const cy = Math.sin(angle) * dist + ((frame - 85) * 1.8);
            const rot = (frame - 85) * (idx % 2 === 0 ? 12 : -12);
            const colors = ['#DC2626', '#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];
            const col = colors[idx % colors.length];

            return (
              <g key={idx} transform={`translate(${cx}, ${cy}) rotate(${rot})`}>
                <rect x={-7} y={-4} width={14} height={8} rx={2} fill={col} stroke={INK} strokeWidth={1.5} />
              </g>
            );
          })}
        </g>
      )}
    </svg>
  );
};
