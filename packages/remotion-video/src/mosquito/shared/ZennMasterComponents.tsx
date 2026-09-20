import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';

export const INK = '#18181B';
export const WALL_OCHRE = '#C2A478';
export const FLOOR_UMBER = '#6B4D2B';
export const COUCH_TEAL = '#488D93';
export const COUCH_SHADOW = '#3A7479';
export const MOSQUITO_BODY = '#556877';
export const MOSQUITO_WING = '#E2F1F8';
export const VICTIM_RED = '#EF4444';

/**
 * 🛋️ SCENE 1: Warm Living Room with 4 Friends (Exact Replica of ref_02s.jpg / ref_05s.jpg)
 */
export const ZennLivingRoomScene: React.FC<{
  mosquitoProgress?: number; // 0 to 1 for flight path
  showFlightPath?: boolean;
}> = ({ mosquitoProgress = 0, showFlightPath = false }) => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Room Background */}
      {/* Wall */}
      <rect x={0} y={0} width={1920} height={700} fill={WALL_OCHRE} />
      {/* Floor */}
      <rect x={0} y={700} width={1920} height={380} fill={FLOOR_UMBER} />
      {/* Baseboard Line */}
      <line x1={0} y1={700} x2={1680} y2={700} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      {/* Room Corner Perspective Lines (as in ref_02s.jpg) */}
      <line x1={1680} y1={0} x2={1680} y2={700} stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <line x1={1680} y1={700} x2={1920} y2={820} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* 2. Side Table on the Right of Sofa */}
      <g transform="translate(1320, 710)">
        {/* Table top */}
        <polygon points="-50,0 70,0 60,18 -40,18" fill="#583B20" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
        {/* Table legs */}
        <line x1={-35} y1={18} x2={-45} y2={140} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={-15} y1={18} x2={-18} y2={125} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <line x1={40} y1={18} x2={45} y2={125} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <line x1={55} y1={18} x2={60} y2={140} stroke={INK} strokeWidth={6} strokeLinecap="round" />
      </g>

      {/* 3. Teal 3-Cushion Hand-Drawn Sofa (ref_02s.jpg) */}
      <g transform="translate(800, 680)">
        {/* Sofa Backrest */}
        <path
          d="M -360 -180 Q 0 -195 360 -180 L 360 -20 Q 0 -10 -360 -20 Z"
          fill={COUCH_TEAL}
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* Vertical divider lines on backrest */}
        <line x1={-120} y1={-185} x2={-120} y2={-15} stroke={INK} strokeWidth={5} />
        <line x1={120} y1={-185} x2={120} y2={-15} stroke={INK} strokeWidth={5} />

        {/* Sofa Seat Base & Cushions */}
        <path
          d="M -380 -20 Q 0 -10 380 -20 L 380 140 Q 0 150 -380 140 Z"
          fill={COUCH_SHADOW}
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* Seat Cushion Top Seam */}
        <line x1={-380} y1={25} x2={380} y2={25} stroke={INK} strokeWidth={5} />
        <line x1={-130} y1={-20} x2={-130} y2={140} stroke={INK} strokeWidth={5} />
        <line x1={130} y1={-20} x2={130} y2={140} stroke={INK} strokeWidth={5} />

        {/* Left Armrest */}
        <path
          d="M -440 -60 Q -380 -70 -360 -50 L -360 140 L -440 140 Z"
          fill={COUCH_TEAL}
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* Right Armrest */}
        <path
          d="M 440 -60 Q 380 -70 360 -50 L 360 140 L 440 140 Z"
          fill={COUCH_TEAL}
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
      </g>

      {/* 4. Character 4: Wall-Leaner Guy on Far Right (ref_02s.jpg) */}
      <g transform="translate(1620, 500)">
        {/* Head */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {/* Eyes looking sideways at room */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-22} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={14} cy={-6} r={5} fill={INK} />
        {/* Eyebrows: relaxed / skeptical */}
        <line x1={-30} y1={-26} x2={-6} y2={-26} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-30} x2={30} y2={-22} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        {/* Mouth */}
        <line x1={-12} y1={24} x2={12} y2={24} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />

        {/* Body leaning on wall */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={52} x2={-8} y2={185} />
          {/* Arms holding cup */}
          <line x1={-4} y1={85} x2={-45} y2={125} />
          <line x1={-45} y1={125} x2={-100} y2={120} />
          <line x1={-4} y1={85} x2={18} y2={135} />
          <line x1={18} y1={135} x2={28} y2={175} />
          {/* Crossed legs */}
          <line x1={-8} y1={185} x2={-28} y2={320} />
          <line x1={-8} y1={185} x2={15} y2={280} />
          <line x1={15} y1={280} x2={-10} y2={325} />
        </g>
        {/* Drink Cup */}
        <polygon points="-120,95 -90,95 -95,140 -115,140" fill="#F4EEDD" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
      </g>

      {/* 5. Character 3: Chatting Guy Standing Behind Couch (ref_02s.jpg) */}
      <g transform="translate(1080, 430)">
        {/* Head */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-6} r={5} fill={INK} />
        <line x1={-28} y1={-25} x2={-8} y2={-25} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-25} x2={28} y2={-25} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={-12} y1={24} x2={12} y2={24} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />

        {/* Torso & Gesturing Arm */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={52} x2={-15} y2={190} />
          <line x1={-5} y1={90} x2={-35} y2={145} />
          {/* Hand gesturing forward */}
          <line x1={-5} y1={90} x2={45} y2={120} />
          <line x1={45} y1={120} x2={85} y2={95} />
          <line x1={-15} y1={190} x2={-25} y2={280} />
        </g>
      </g>

      {/* 6. Character 2: Friend with Glasses Sitting on Couch (ref_02s & ref_05s) */}
      <g transform="translate(920, 520)">
        {/* Head with Round Glasses */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {/* Round Glasses */}
        <circle cx={-20} cy={-4} r={22} fill="none" stroke={INK} strokeWidth={5} />
        <circle cx={20} cy={-4} r={22} fill="none" stroke={INK} strokeWidth={5} />
        <line x1={-2} y1={-4} x2={2} y2={-4} stroke={INK} strokeWidth={4} />
        <line x1={-42} y1={-4} x2={-52} y2={-6} stroke={INK} strokeWidth={4} />
        <line x1={42} y1={-4} x2={52} y2={-6} stroke={INK} strokeWidth={4} />
        {/* Eyes inside glasses */}
        <circle cx={-20} cy={-4} r={4.5} fill={INK} />
        <circle cx={20} cy={-4} r={4.5} fill={INK} />
        {/* Eyebrows & Mouth */}
        <line x1={-30} y1={-30} x2={-10} y2={-30} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={10} y1={-30} x2={30} y2={-30} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={-10} y1={25} x2={10} y2={25} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />

        {/* Sitting Body */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={52} x2={-10} y2={175} />
          {/* Legs on couch */}
          <line x1={-10} y1={175} x2={-55} y2={225} />
          <line x1={-10} y1={175} x2={15} y2={225} />
          <line x1={-55} y1={225} x2={-55} y2={310} />
          <line x1={15} y1={225} x2={15} y2={310} />
          <line x1={-55} y1={310} x2={-40} y2={315} />
          <line x1={15} y1={310} x2={30} y2={315} />
          {/* Arms holding newspaper */}
          <line x1={-5} y1={90} x2={-40} y2={140} />
          <line x1={-5} y1={90} x2={35} y2={140} />
        </g>

        {/* Realistic Folded Doodle Newspaper (ref_05s.jpg) */}
        <g transform="translate(0, 150)">
          <polygon points="-65,-60 65,-60 65,65 -65,65" fill="#FFFFFF" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <line x1={0} y1={-60} x2={0} y2={65} stroke={INK} strokeWidth={3} />
          <rect x={-55} y={-50} width={45} height={15} fill="#D1D5DB" stroke={INK} strokeWidth={2} />
          <rect x={10} y={-50} width={45} height={15} fill="#D1D5DB" stroke={INK} strokeWidth={2} />
          {[-25, -12, 0, 12, 25, 38, 50].map((ly, i) => (
            <React.Fragment key={i}>
              <line x1={-55} y1={ly} x2={-10} y2={ly} stroke={INK} strokeWidth={2.5} />
              <line x1={10} y1={ly} x2={55} y2={ly} stroke={INK} strokeWidth={2.5} />
            </React.Fragment>
          ))}
        </g>
      </g>

      {/* 7. Character 1: Victim (Host) Sitting on Left of Couch (ref_02s & ref_05s) */}
      <g transform="translate(560, 520)">
        {/* Head with 3 Spiky Hairs */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <g stroke={INK} strokeWidth={4.5} strokeLinecap="round">
          <line x1={-12} y1={-50} x2={-16} y2={-82} />
          <line x1={0} y1={-52} x2={0} y2={-90} />
          <line x1={12} y1={-50} x2={20} y2={-80} />
        </g>

        {/* Worried / Annoyed Face */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18 + Math.sin(frame * 0.1) * 3} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18 + Math.sin(frame * 0.1) * 3} cy={-6} r={5} fill={INK} />
        {/* Worried Eyebrows */}
        <line x1={-30} y1={-20} x2={-8} y2={-28} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-28} x2={30} y2={-20} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        {/* Frown Mouth */}
        <path d="M -14 26 Q 0 16 14 26" stroke={INK} strokeWidth={3.8} fill="none" strokeLinecap="round" />

        {/* Red Welt Bite Spots on Face & Limbs (ref_02s.jpg) */}
        <g fill={VICTIM_RED}>
          <circle cx={-44} cy={-12} r={8} />
          <circle cx={46} cy={16} r={8} />
          <circle cx={-68} cy={125} r={8} />
          <circle cx={-45} cy={95} r={8} />
          <circle cx={25} cy={110} r={8} />
          <circle cx={-45} cy={225} r={8} />
          <circle cx={15} cy={280} r={8} />
        </g>

        {/* Body on Couch with Hand Scratching Ear/Head (ref_05s.jpg) */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={52} x2={0} y2={175} />
          {/* Sitting Legs */}
          <line x1={0} y1={175} x2={-45} y2={225} />
          <line x1={0} y1={175} x2={25} y2={225} />
          <line x1={-45} y1={225} x2={-45} y2={310} />
          <line x1={25} y1={225} x2={25} y2={310} />
          <line x1={-45} y1={310} x2={-30} y2={315} />
          <line x1={25} y1={310} x2={40} y2={315} />

          {/* Left Arm Resting on Couch Armrest */}
          <line x1={0} y1={90} x2={-55} y2={125} />
          <line x1={-55} y1={125} x2={-95} y2={145} />
          {/* Right Arm Reaching Up to Scratch Head */}
          <line x1={0} y1={90} x2={45} y2={110} />
          <line x1={45} y1={110} x2={26} y2={20} />
        </g>
      </g>

      {/* 8. Optional Curved Mosquito Flight Arc (ref_05s.jpg) */}
      {showFlightPath && (
        <g>
          {/* Dashed Trajectory Arc */}
          <path
            d="M 1750 320 Q 920 180 660 360"
            stroke={INK}
            strokeWidth={4}
            strokeDasharray="14 10"
            fill="none"
          />
          {/* Red Arrow pointing to victim's head */}
          <line x1={720} y1={330} x2={660} y2={360} stroke={VICTIM_RED} strokeWidth={5} strokeLinecap="round" />
          <polyline points="685,340 660,360 675,368" stroke={VICTIM_RED} strokeWidth={5} fill="none" strokeLinecap="round" />

          {/* Mosquito Moving along trajectory */}
          {(() => {
            const mx = interpolate(mosquitoProgress, [0, 0.5, 1], [1750, 950, 680]);
            const my = interpolate(mosquitoProgress, [0, 0.5, 1], [320, 220, 350]);
            const mAngle = interpolate(mosquitoProgress, [0, 0.5, 1], [-10, 5, 25]);
            return (
              <g transform={`translate(${mx}, ${my}) rotate(${mAngle})`}>
                <ZennDetailedMosquito scale={1.3} facing="left" />
              </g>
            );
          })()}
        </g>
      )}
    </svg>
  );
};

/**
 * 🦟 Zenn-Detailed Cartoon Mosquito (Exact match to ref_00s / ref_10s / ref_25s)
 */
export const ZennDetailedMosquito: React.FC<{
  scale?: number;
  facing?: 'left' | 'right';
  hasBriefcase?: boolean;
}> = ({ scale = 1, facing = 'left', hasBriefcase = false }) => {
  const frame = useCurrentFrame();
  const wingFlutter = Math.sin(frame * 1.8) * 18;
  const flip = facing === 'left' ? 1 : -1;

  return (
    <g transform={`scale(${scale * flip}, ${scale})`}>
      {/* Abdomen (teardrop) */}
      <path
        d="M 15 15 C 35 5 70 15 70 35 C 70 55 35 60 15 45 Z"
        fill={MOSQUITO_BODY}
        stroke={INK}
        strokeWidth={4.5}
        strokeLinejoin="round"
      />
      {/* Thorax */}
      <path
        d="M 5 25 C -5 20 -15 35 -5 45 C 5 50 15 45 15 25 Z"
        fill="#455A64"
        stroke={INK}
        strokeWidth={4.5}
      />
      {/* Head */}
      <circle cx={-18} cy={35} r={14} fill="#455A64" stroke={INK} strokeWidth={4} />
      {/* Cartoon Eye with Pupil */}
      <circle cx={-20} cy={32} r={8} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
      <circle cx={-22} cy={32} r={3.5} fill={INK} />
      <circle cx={-23} cy={31} r={1} fill="#FFFFFF" />

      {/* Curved Antennae */}
      <path d="M -24 24 Q -32 10 -38 15" stroke={INK} strokeWidth={2.5} fill="none" />
      <path d="M -22 22 Q -28 6 -32 10" stroke={INK} strokeWidth={2.5} fill="none" />

      {/* Needle Proboscis */}
      <polygon points="-30,34 -85,68 -28,40" fill={INK} />

      {/* 6 Jointed Spidery Legs */}
      <g stroke={INK} strokeWidth={3.8} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M -12 45 L -25 70 L -45 95" />
        <path d="M -5 48 L -15 75 L -30 100" />
        <path d="M 12 48 L 15 80 L 0 110" />
        <path d="M 22 48 L 30 82 L 20 115" />
        <path d="M 38 45 L 60 70 L 80 88" />
        <path d="M 48 40 L 75 62 L 98 75" />
      </g>

      {/* Fluttering Wings */}
      <g transform={`translate(15, 20) rotate(${-25 + wingFlutter})`}>
        <ellipse cx={-30} cy={-30} rx={42} ry={15} transform="rotate(35 -30 -30)" fill={MOSQUITO_WING} stroke={INK} strokeWidth={3.8} />
        <line x1={-55} y1={-48} x2={-5} y2={-12} stroke={INK} strokeWidth={2} />
      </g>
      <g transform={`translate(22, 16) rotate(${-10 - wingFlutter})`}>
        <ellipse cx={-28} cy={-32} rx={42} ry={15} transform="rotate(25 -28 -32)" fill={MOSQUITO_WING} stroke={INK} strokeWidth={3.8} />
      </g>

      {/* Brown Leather Briefcase */}
      {hasBriefcase && (
        <g transform="translate(-15, 80)">
          <path d="M 15 0 Q 28 -12 40 0" stroke={INK} strokeWidth={3.5} fill="none" />
          <rect x={0} y={0} width={55} height={42} rx={5} fill="#8D5B3A" stroke={INK} strokeWidth={4} />
          <rect x={12} y={12} width={7} height={10} fill="#FACC15" stroke={INK} strokeWidth={1.5} />
          <rect x={36} y={12} width={7} height={10} fill="#FACC15" stroke={INK} strokeWidth={1.5} />
        </g>
      )}
    </g>
  );
};

/**
 * 👂 SCENE 2: Extreme Close-Up Ear Buzz (Exact Replica of ref_10s.jpg)
 */
export const ZennEarBuzzCloseUp: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Room Wall Background with Depth */}
      <rect x={0} y={0} width={1920} height={1080} fill={WALL_OCHRE} />
      {/* Floor line at bottom */}
      <line x1={0} y1={920} x2={1920} y2={920} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Massive Host Stickman on the Right (ref_10s.jpg) */}
      <g transform="translate(1320, 480)">
        {/* Head (Huge r=165) */}
        <circle cx={0} cy={0} r={165} fill="#FFFFFF" stroke={INK} strokeWidth={7} />

        {/* 3 Long Spiky Hairs */}
        <g stroke={INK} strokeWidth={6} strokeLinecap="round">
          <line x1={-35} y1={-160} x2={-45} y2={-255} />
          <line x1={0} y1={-165} x2={0} y2={-275} />
          <line x1={35} y1={-160} x2={55} y2={-250} />
        </g>

        {/* Big Cartoon Eyes looking sideways at mosquito */}
        <circle cx={-65} cy={-20} r={46} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={-85} cy={-20} r={16} fill={INK} />
        <circle cx={-88} cy={-23} r={4} fill="#FFFFFF" />

        <circle cx={65} cy={-20} r={46} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={45} cy={-20} r={16} fill={INK} />
        <circle cx={42} cy={-23} r={4} fill="#FFFFFF" />

        {/* Angry Slanted Eyebrows */}
        <line x1={-110} y1={-90} x2={-25} y2={-65} stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <line x1={25} y1={-65} x2={110} y2={-90} stroke={INK} strokeWidth={7} strokeLinecap="round" />

        {/* Annoyed Frown Mouth */}
        <path d="M -40 85 Q 0 55 40 85" stroke={INK} strokeWidth={6} fill="none" strokeLinecap="round" />

        {/* Red Welt Spots on Cheek */}
        <circle cx={-150} cy={20} r={18} fill={VICTIM_RED} />
        <circle cx={155} cy={50} r={16} fill={VICTIM_RED} />

        {/* Neck & Torso */}
        <line x1={0} y1={165} x2={0} y2={450} stroke={INK} strokeWidth={8} strokeLinecap="round" />

        {/* Arm Bent Up Swatting at Ear (ref_10s.jpg) */}
        <g stroke={INK} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={240} x2={-130} y2={340} />
          <line x1={-130} y1={340} x2={-90} y2={80} />
        </g>
        {/* Red Welts on Arm */}
        <circle cx={-125} cy={310} r={16} fill={VICTIM_RED} />
        <circle cx={-105} cy={200} r={16} fill={VICTIM_RED} />
      </g>

      {/* Giant Mosquito Hovering at Ear (ref_10s.jpg) */}
      <g transform="translate(680, 430)">
        <ZennDetailedMosquito scale={2.4} facing="right" />

        {/* Concentric Sound Wave Arcs vibrating at proboscis */}
        {[30, 65, 100, 135].map((r, i) => (
          <path
            key={i}
            d={`M ${120 + r * 0.4} ${-r * 0.8} Q ${160 + r} 0 ${120 + r * 0.4} ${r * 0.8}`}
            stroke={INK}
            strokeWidth={5}
            fill="none"
            strokeLinecap="round"
            opacity={((frame + i * 8) % 24) / 24}
          />
        ))}

        {/* Big Hand-Drawn "BZZZZ" (ref_10s.jpg) */}
        <text
          x={-50}
          y={-180}
          fill={INK}
          fontSize={110}
          fontWeight="900"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          transform={`rotate(-12, -50, -180) scale(${1 + Math.sin(frame * 0.6) * 0.08})`}
        >
          BZZZZ
        </text>
      </g>
    </svg>
  );
};

/**
 * 🏡 SCENE 6: Mosquito with Briefcase at Front Door (Exact Replica of ref_60s.jpg)
 */
export const ZennBriefcaseDoorScene: React.FC = () => {
  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Clean Light Background with subtle paper tone */}
      <rect x={0} y={0} width={1920} height={1080} fill="#FAF7F2" />
      {/* Ground baseline */}
      <line x1={0} y1={880} x2={1920} y2={880} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Hand-Drawn Storybook Cottage House (ref_60s.jpg) */}
      <g transform="translate(1080, 480)">
        {/* Main Wall */}
        <polygon points="0,-240 320,-240 540,-50 540,400 0,400" fill="#EFECE6" stroke={INK} strokeWidth={6} strokeLinejoin="round" />

        {/* Brown Roof */}
        <polygon points="-50,-230 200,-420 460,-230" fill="#8D5B3A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />

        {/* Open Doorway (Dark interior shadow) */}
        <rect x={60} y={-80} width={200} height={480} fill="#1E1E24" stroke={INK} strokeWidth={6} />
        {/* Open Door Leaf angled back */}
        <polygon points="60,-80 -10,-40 -10,380 60,400" fill="#FFFFFF" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {/* Door Knob */}
        <circle cx={5} cy={180} r={7} fill="#FACC15" stroke={INK} strokeWidth={2.5} />

        {/* Cottage Window */}
        <rect x={340} y={-20} width={140} height={140} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <line x1={410} y1={-20} x2={410} y2={120} stroke={INK} strokeWidth={4} />
        <line x1={340} y1={50} x2={480} y2={50} stroke={INK} strokeWidth={4} />

        {/* Stickman Homeowner in Doorway peeking out (ref_60s.jpg) */}
        <g transform="translate(180, 100)">
          <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
          {/* Shocked Eyes looking down */}
          <circle cx={-18} cy={0} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={-22} cy={4} r={5} fill={INK} />
          <circle cx={18} cy={0} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
          <circle cx={14} cy={4} r={5} fill={INK} />
          {/* Eyebrows raised */}
          <path d="M -30 -22 Q -18 -32 -8 -22" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M 8 -22 Q 18 -32 28 -22" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          {/* Open mouth */}
          <ellipse cx={0} cy={26} rx={10} ry={14} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />

          {/* Stick body in door frame */}
          <line x1={0} y1={55} x2={0} y2={220} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
          <line x1={0} y1={220} x2={-30} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
          <line x1={0} y1={220} x2={30} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
          {/* Arm holding door */}
          <line x1={0} y1={100} x2={-80} y2={90} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
          <line x1={0} y1={100} x2={35} y2={180} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        </g>
      </g>

      {/* Mosquito on Doorstep holding Briefcase (ref_60s.jpg) */}
      <g transform="translate(820, 620)">
        <ZennDetailedMosquito scale={1.8} facing="right" hasBriefcase={true} />
      </g>
    </svg>
  );
};

/**
 * 🛋️ SCENE 3: Symmetrical Two-Shot on Couch (Exact Replica of ref_05s.jpg)
 */
export const ZennLivingRoomTwoShot: React.FC<{
  progress?: number; // 0 to 1
}> = ({ progress = 0 }) => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Background Room */}
      <rect x={0} y={0} width={1920} height={720} fill={WALL_OCHRE} />
      <rect x={0} y={720} width={1920} height={360} fill={FLOOR_UMBER} />
      <line x1={0} y1={720} x2={1920} y2={720} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Centered Teal Sofa (ref_05s.jpg) */}
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

        {/* Left Armrest */}
        <path
          d="M -580 -70 Q -500 -80 -480 -60 L -480 150 L -580 150 Z"
          fill={COUCH_TEAL}
          stroke={INK}
          strokeWidth={6.5}
          strokeLinejoin="round"
        />
        {/* Right Armrest */}
        <path
          d="M 580 -70 Q 500 -80 480 -60 L 480 150 L 580 150 Z"
          fill={COUCH_TEAL}
          stroke={INK}
          strokeWidth={6.5}
          strokeLinejoin="round"
        />
      </g>

      {/* 1. Victim on Left of Couch Scratching Ear/Head (ref_05s.jpg) */}
      <g transform="translate(680, 520)">
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 Spiky Hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>

        {/* Annoyed/Distressed Eyes looking up at mosquito */}
        <circle cx={-20} cy={-6} r={15} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18 + Math.sin(frame * 0.1) * 2} cy={-10} r={5.5} fill={INK} />
        <circle cx={20} cy={-6} r={15} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={22 + Math.sin(frame * 0.1) * 2} cy={-10} r={5.5} fill={INK} />

        {/* Worried Eyebrows */}
        <line x1={-32} y1={-24} x2={-8} y2={-32} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-32} x2={32} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />

        {/* Open Distressed Mouth (ref_05s.jpg) */}
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

          {/* Left Arm Resting on Couch Armrest */}
          <line x1={0} y1={95} x2={-65} y2={130} />
          <line x1={-65} y1={130} x2={-110} y2={150} />
          {/* Right Arm Scratching Head/Ear (ref_05s.jpg) */}
          <line x1={0} y1={95} x2={55} y2={115} />
          <line x1={55} y1={115} x2={30} y2={15} />
        </g>
      </g>

      {/* 2. Calm Friend with Glasses Reading Newspaper (ref_05s.jpg) */}
      <g transform="translate(1240, 520)">
        {/* Head with Round Glasses */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
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

        {/* Gray 'X' over calm friend showing mosquito ignored him (ref_75s.jpg) */}
        <g stroke="#9CA3AF" strokeWidth={5.5} strokeLinecap="round" opacity={0.8} transform="translate(0, -135)">
          <line x1={-22} y1={-22} x2={22} y2={22} />
          <line x1={22} y1={-22} x2={-22} y2={22} />
        </g>
      </g>

      {/* 3. Curved Mosquito Flight Trajectory (ref_05s.jpg) */}
      <path
        d="M 1900 480 Q 1300 230 780 380"
        stroke={INK}
        strokeWidth={4.5}
        strokeDasharray="16 12"
        fill="none"
      />
      {/* Red Arrow Pointing at Victim (ref_05s.jpg / ref_75s.jpg) */}
      <g stroke={VICTIM_RED} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1={840} y1={360} x2={770} y2={385} />
        <polyline points="800,365 770,385 795,395" />
      </g>

      {/* Mosquito Animated along arc */}
      {(() => {
        const mx = interpolate(progress, [0, 0.5, 1], [1850, 1300, 830]);
        const my = interpolate(progress, [0, 0.5, 1], [460, 270, 365]);
        const mAngle = interpolate(progress, [0, 0.5, 1], [-15, 5, 25]);
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
 * 🕯️ SCENE 4: Citronella Candles & Frantic Swatting Frenzy (Beat 4)
 */
export const ZennCitronellaSwatScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Twilight Outdoor Backyard Environment */}
      <rect x={0} y={0} width={1920} height={720} fill="#D9C9A8" />
      <rect x={0} y={720} width={1920} height={360} fill="#5A3E26" />
      <line x1={0} y1={720} x2={1920} y2={720} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Ring of 5 Citronella Buckets */}
      {[-440, -220, 0, 220, 440].map((offset, i) => {
        const bx = 960 + offset;
        const by = 750 + Math.abs(offset) * 0.1;
        const smokeOffset = (frame * 1.5 + i * 20) % 60;
        return (
          <g key={i} transform={`translate(${bx}, ${by})`}>
            {/* Citronella Yellow Bucket */}
            <polygon points="-30,0 30,0 24,55 -24,55" fill="#FACC15" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
            <ellipse cx={0} cy={0} rx={30} ry={8} fill="#FDE047" stroke={INK} strokeWidth={4} />
            {/* Wick and Flame */}
            <line x1={0} y1={0} x2={0} y2={-12} stroke={INK} strokeWidth={3} />
            <path d="M -5 -12 Q 0 -28 0 -30 Q 0 -28 5 -12 Z" fill="#F97316" stroke={INK} strokeWidth={2} />
            <circle cx={0} cy={-16} r={3} fill="#FEF08A" />

            {/* Curling Smoke Plumes */}
            <path
              d={`M 0 -30 Q ${Math.sin(frame * 0.1 + i) * 25} ${-80 - smokeOffset * 1.5} ${Math.cos(frame * 0.1 + i) * 35} ${-160 - smokeOffset * 2}`}
              stroke="#E2E8F0"
              strokeWidth={8}
              strokeLinecap="round"
              fill="none"
              opacity={Math.max(0, 1 - smokeOffset / 60)}
            />
          </g>
        );
      })}

      {/* Host Stickman in Flailing Swatting Frenzy (Center) */}
      <g transform="translate(960, 520)">
        {/* Head with 3 spiky hairs */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-24} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={26} y2={-86} />
        </g>

        {/* Panicked Shut-Tight Eyes "> <" */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-30} y1={-15} x2={-12} y2={-5} />
          <line x1={-30} y1={5} x2={-12} y2={-5} />
          <line x1={30} y1={-15} x2={12} y2={-5} />
          <line x1={30} y1={5} x2={12} y2={-5} />
        </g>
        {/* Screaming Open Mouth */}
        <ellipse cx={0} cy={22} rx={14} ry={18} fill="#FFFFFF" stroke={INK} strokeWidth={4} />

        {/* Red Welts All Over */}
        <g fill={VICTIM_RED}>
          <circle cx={-46} cy={-12} r={9} />
          <circle cx={46} cy={12} r={9} />
          <circle cx={-65} cy={110} r={9} />
          <circle cx={70} cy={110} r={9} />
          <circle cx={-35} cy={230} r={9} />
          <circle cx={40} cy={240} r={9} />
        </g>

        {/* Body */}
        <line x1={0} y1={55} x2={0} y2={185} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={185} x2={-45} y2={300} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={185} x2={45} y2={300} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Frantic Flailing Motion Blur Arms (3 pairs of arms rotating rapidly!) */}
        {[-30, 0, 30].map((deg, i) => {
          const armAngle = Math.sin(frame * 0.8 + i * 1.5) * 45;
          return (
            <g key={i} opacity={i === 0 ? 1 : 0.4} stroke={INK} strokeWidth={5.5} strokeLinecap="round">
              <line x1={0} y1={85} x2={-90 + Math.sin(armAngle) * 30} y2={60 + Math.cos(armAngle) * 60} />
              <line x1={0} y1={85} x2={90 - Math.sin(armAngle) * 30} y2={60 - Math.cos(armAngle) * 60} />
            </g>
          );
        })}
      </g>

      {/* Mosquitoes flying peacefully through the smoke unharmed */}
      <g transform={`translate(${620 + Math.sin(frame * 0.1) * 30}, ${380 + Math.cos(frame * 0.15) * 20})`}>
        <ZennDetailedMosquito scale={1.2} facing="right" />
      </g>
      <g transform={`translate(${1300 + Math.cos(frame * 0.12) * 35}, ${340 + Math.sin(frame * 0.18) * 25})`}>
        <ZennDetailedMosquito scale={1.25} facing="left" />
      </g>
    </svg>
  );
};

/**
 * ☀️ SCENE 5: Long Sleeves in Scorching July Heat (Beat 5)
 */
export const ZennJulyHeatScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Blazing Outdoor Environment */}
      <rect x={0} y={0} width={1920} height={750} fill="#FED7AA" />
      <rect x={0} y={750} width={1920} height={330} fill="#D97706" />
      <line x1={0} y1={750} x2={1920} y2={750} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Giant Blazing July Sun in Upper Right */}
      <g transform="translate(1620, 200)">
        <circle cx={0} cy={0} r={110} fill="#FACC15" stroke={INK} strokeWidth={6} />
        {/* Rotating Flame Rays */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 + frame * 0.8) * (Math.PI / 180);
          const r1 = 125;
          const r2 = 160 + (i % 2 === 0 ? 25 : 0);
          return (
            <line
              key={i}
              x1={Math.cos(angle) * r1}
              y1={Math.sin(angle) * r1}
              x2={Math.cos(angle) * r2}
              y2={Math.sin(angle) * r2}
              stroke={INK}
              strokeWidth={5}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Wavy Heat Shimmer Lines rising from ground */}
      {[-600, -300, 0, 300, 600].map((hx, i) => (
        <path
          key={i}
          d={`M ${960 + hx} 730 Q ${980 + hx + Math.sin(frame * 0.2 + i) * 15} 670 ${960 + hx} 610`}
          stroke="#FBBF24"
          strokeWidth={4.5}
          strokeLinecap="round"
          fill="none"
          opacity={0.6}
        />
      ))}

      {/* Host Stickman Bundled in Heavy Winter Turtleneck Coat */}
      <g transform="translate(960, 520)">
        {/* Sweating Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs drooping in heat */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-26} y2={-75} />
          <line x1={0} y1={-55} x2={0} y2={-80} />
          <line x1={14} y1={-53} x2={26} y2={-75} />
        </g>

        {/* Miserable Melting Eyes */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18} cy={-2} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-2} r={5} fill={INK} />
        <line x1={-28} y1={-26} x2={-8} y2={-18} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-18} x2={28} y2={-26} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        {/* Miserable Frown */}
        <path d="M -16 26 Q 0 16 16 26" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Flying Sweat Drops */}
        {[
          { x: -65, y: -20, delay: 0 },
          { x: 70, y: -15, delay: 10 },
          { x: -75, y: 35, delay: 20 },
          { x: 75, y: 40, delay: 30 },
        ].map((drop, idx) => {
          const dropY = ((frame + drop.delay) % 25) * 3.5;
          return (
            <circle
              key={idx}
              cx={drop.x}
              cy={drop.y + dropY}
              r={6.5}
              fill="#38BDF8"
              stroke={INK}
              strokeWidth={2}
              opacity={1 - dropY / 85}
            />
          );
        })}

        {/* Bulky Heavy Winter Turtleneck Coat & Wool Scarf */}
        <path
          d="M -30 50 Q 0 65 30 50 L 35 75 Q 0 90 -35 75 Z"
          fill="#DC2626"
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <rect x={-50} y={75} width={100} height={140} rx={12} fill="#1E293B" stroke={INK} strokeWidth={6} />
        {/* Bulky Coat Sleeves */}
        <path d="M -50 90 L -90 170 L -65 175 L -35 110 Z" fill="#1E293B" stroke={INK} strokeWidth={5.5} strokeLinejoin="round" />
        <path d="M 50 90 L 90 170 L 65 175 L 35 110 Z" fill="#1E293B" stroke={INK} strokeWidth={5.5} strokeLinejoin="round" />
        {/* Thick Pants */}
        <line x1={-25} y1={215} x2={-25} y2={320} stroke={INK} strokeWidth={8} strokeLinecap="round" />
        <line x1={25} y1={215} x2={25} y2={320} stroke={INK} strokeWidth={8} strokeLinecap="round" />
      </g>

      {/* Mosquito casually landing right on his exposed nose */}
      <g transform="translate(1005, 495) rotate(-20)">
        <ZennDetailedMosquito scale={1.1} facing="left" />
      </g>
    </svg>
  );
};

/**
 * ❓ SCENE 7: Cursed? Genetic? Diet? Comic Pop-In Thoughts (Beat 7)
 */
export const ZennMysteryThoughtsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Parchment Studio Background */}
      <rect x={0} y={0} width={1920} height={1080} fill="#FAF7F2" />
      <line x1={0} y1={880} x2={1920} y2={880} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Puzzled Host in Center with Hand on Chin */}
      <g transform="translate(960, 560)">
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>
        {/* Eyes looking up at thoughts */}
        <circle cx={-18} cy={-8} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18} cy={-14} r={5} fill={INK} />
        <circle cx={18} cy={-8} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-14} r={5} fill={INK} />
        {/* Puzzled Eyebrows (one up, one down) */}
        <line x1={-28} y1={-24} x2={-8} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-32} x2={28} y2={-22} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={-12} y1={25} x2={12} y2={22} stroke={INK} strokeWidth={3.8} strokeLinecap="round" />

        {/* Body with Hand on Chin */}
        <g stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={55} x2={0} y2={185} />
          <line x1={0} y1={185} x2={-35} y2={320} />
          <line x1={0} y1={185} x2={35} y2={320} />
          {/* Hand on chin */}
          <line x1={0} y1={95} x2={45} y2={120} />
          <line x1={45} y1={120} x2={15} y2={45} />
          {/* Left arm crossed */}
          <line x1={0} y1={95} x2={-45} y2={130} />
          <line x1={-45} y1={130} x2={20} y2={125} />
        </g>
      </g>

      {/* Thought Bubble 1: "Cursed?" — Witch Hat (Left) */}
      <g transform="translate(480, 360)">
        <ellipse cx={0} cy={0} rx={140} ry={110} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={130} cy={110} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <circle cx={170} cy={140} r={9} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        {/* Witch Hat Icon */}
        <ellipse cx={0} cy={35} rx={75} ry={16} fill="#4C1D95" stroke={INK} strokeWidth={4.5} />
        <polygon points="-45,30 0,-60 45,30" fill="#6D28D9" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
        <rect x="-42" y="16" width="84" height="14" fill="#FACC15" stroke={INK} strokeWidth={2.5} />
      </g>

      {/* Thought Bubble 2: "Genetic?" — DNA Helix (Center Top) */}
      <g transform="translate(960, 220)">
        <ellipse cx={0} cy={0} rx={140} ry={110} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={0} cy={125} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={155} r={9} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        {/* DNA Helix */}
        <g stroke={INK} strokeWidth={4.5} strokeLinecap="round" fill="none">
          <path d="M -50 -40 Q -25 0 0 -40 Q 25 -80 50 -40" stroke="#3B82F6" strokeWidth={5} />
          <path d="M -50 40 Q -25 0 0 40 Q 25 80 50 40" stroke="#EF4444" strokeWidth={5} />
          {/* Rungs */}
          <line x1={-40} y1={-25} x2={-40} y2={25} stroke="#10B981" />
          <line x1={-20} y1={-5} x2={-20} y2={5} stroke="#F59E0B" />
          <line x1={0} y1={-40} x2={0} y2={40} stroke="#8B5CF6" />
          <line x1={20} y1={-5} x2={20} y2={5} stroke="#10B981" />
          <line x1={40} y1={-25} x2={40} y2={25} stroke="#F59E0B" />
        </g>
      </g>

      {/* Thought Bubble 3: "Diet?" — Garlic Bulb with Stink Fumes (Right) */}
      <g transform="translate(1440, 360)">
        <ellipse cx={0} cy={0} rx={140} ry={110} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={-130} cy={110} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        <circle cx={-170} cy={140} r={9} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
        {/* Garlic Bulb */}
        <g transform="translate(0, 15)">
          <path
            d="M -30 20 C -45 5 -40 -25 -20 -35 C -10 -40 0 -45 0 -45 C 0 -45 10 -40 20 -35 C 40 -25 45 5 30 20 C 15 30 -15 30 -30 20 Z"
            fill="#FEF3C7"
            stroke={INK}
            strokeWidth={4.5}
            strokeLinejoin="round"
          />
          <line x1={-15} y1={25} x2={-10} y2={-38} stroke={INK} strokeWidth={3} />
          <line x1={0} y1={28} x2={0} y2={-45} stroke={INK} strokeWidth={3} />
          <line x1={15} y1={25} x2={10} y2={-38} stroke={INK} strokeWidth={3} />
          {/* Green wavy stink fumes */}
          <path d="M -20 -55 Q -30 -75 -15 -90" stroke="#84CC16" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path d="M 0 -55 Q 15 -75 0 -95" stroke="#84CC16" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          <path d="M 20 -55 Q 30 -75 15 -90" stroke="#84CC16" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
};

/**
 * 🔬 SCENE 8: Microscopic Skin & Cute Dancing Bacteria (Beat 8)
 */
export const ZennMagnifierSkinScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Studio Background */}
      <rect x={0} y={0} width={1920} height={1080} fill="#FAF7F2" />
      <line x1={0} y1={880} x2={1920} y2={880} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Host Stickman on Left Holding Magnifier */}
      <g transform="translate(620, 540)">
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>
        {/* Curious Eyes looking at lens */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-12} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={24} cy={-6} r={5} fill={INK} />
        <line x1={-28} y1={-24} x2={-8} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-24} x2={28} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <path d="M -10 22 Q 0 30 10 22" stroke={INK} strokeWidth={3.8} fill="none" strokeLinecap="round" />

        {/* Body & Arms holding magnifier handle */}
        <g stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={55} x2={0} y2={185} />
          <line x1={0} y1={185} x2={-35} y2={320} />
          <line x1={0} y1={185} x2={35} y2={320} />
          <line x1={0} y1={95} x2={90} y2={90} />
          <line x1={0} y1={95} x2={75} y2={120} />
        </g>
      </g>

      {/* Giant Magnifying Glass (Center-Right) */}
      <g transform="translate(1260, 480)">
        {/* Wooden Handle angled towards host */}
        <line x1={-240} y1={180} x2={-380} y2={280} stroke="#8D5B3A" strokeWidth={24} strokeLinecap="round" />
        <line x1={-240} y1={180} x2={-380} y2={280} stroke={INK} strokeWidth={28} strokeLinecap="round" opacity={0.3} />

        {/* Lens Outer Metal Rim */}
        <circle cx={0} cy={0} r={320} fill="#FFFFFF" stroke={INK} strokeWidth={10} />

        {/* Clip path for inside of lens */}
        <clipPath id="zennLensClip">
          <circle cx={0} cy={0} r={310} />
        </clipPath>

        <g clipPath="url(#zennLensClip)">
          {/* Microscopic Skin Surface */}
          <rect x={-350} y={-350} width={700} height={700} fill="#FFFBEB" />
          <path d="M -350 120 Q -150 70 50 110 Q 200 140 350 90 L 350 350 L -350 350 Z" fill="#FED7AA" stroke={INK} strokeWidth={6} />

          {/* Skin pores and peach fuzz hairs */}
          <line x1={-180} y1={95} x2={-210} y2={-10} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <line x1={-40} y1={105} x2={-50} y2={-5} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <line x1={150} y1={125} x2={180} y2={15} stroke={INK} strokeWidth={4} strokeLinecap="round" />

          {/* Cute Microscopic Bacteria Blobs dancing on skin */}
          {[
            { x: -140, y: 70, col: '#10B981', r: 38 },
            { x: -20, y: 85, col: '#3B82F6', r: 44 },
            { x: 120, y: 75, col: '#F59E0B', r: 36 },
          ].map((bac, idx) => {
            const bBounce = Math.sin(frame * 0.2 + idx * 1.8) * 12;
            return (
              <g key={idx} transform={`translate(${bac.x}, ${bac.y + bBounce})`}>
                <circle cx={0} cy={0} r={bac.r} fill={bac.col} stroke={INK} strokeWidth={5} />
                {/* Big cute cartoon eyes */}
                <circle cx={-10} cy={-6} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
                <circle cx={-9} cy={-6} r={3} fill={INK} />
                <circle cx={10} cy={-6} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
                <circle cx={9} cy={-6} r={3} fill={INK} />
                <path d="M -8 10 Q 0 18 8 10" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />

                {/* Little dancing arms/nubs */}
                <path d={`M ${-bac.r} 0 Q ${-bac.r - 15} ${-15 - bBounce} ${-bac.r} -20`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
                <path d={`M ${bac.r} 0 Q ${bac.r + 15} ${-15 - bBounce} ${bac.r} -20`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />

                {/* Scent fume puffs floating upward */}
                <circle
                  cx={Math.sin(frame * 0.15 + idx) * 16}
                  cy={-50 - (((frame * 2 + idx * 25) % 60) * 2.2)}
                  r={9}
                  fill="#FBBF24"
                  stroke={INK}
                  strokeWidth={2}
                  opacity={Math.max(0, 1 - ((frame * 2 + idx * 25) % 60) / 60)}
                />
              </g>
            );
          })}
        </g>

        {/* Glass Glare Highlight */}
        <path d="M -240 -160 A 280 280 0 0 1 -120 -250" stroke="#FFFFFF" strokeWidth={14} strokeLinecap="round" fill="none" opacity={0.7} />
      </g>
    </svg>
  );
};

/**
 * 🎯 SCENE 9: Scent Radar Lock & Attack Vector (Beat 9)
 */
export const ZennTargetRadarScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Room Environment */}
      <rect x={0} y={0} width={1920} height={750} fill={WALL_OCHRE} />
      <rect x={0} y={750} width={1920} height={330} fill={FLOOR_UMBER} />
      <line x1={0} y1={750} x2={1920} y2={750} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Host Stickman standing center */}
      <g transform="translate(960, 520)">
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>
        {/* Looking sideways at target lock */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-6} r={5} fill={INK} />
        <line x1={-28} y1={-24} x2={-8} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <line x1={8} y1={-24} x2={28} y2={-24} stroke={INK} strokeWidth={4.5} strokeLinecap="round" />
        <path d="M -12 24 Q 0 16 12 24" stroke={INK} strokeWidth={3.8} fill="none" strokeLinecap="round" />

        {/* Body */}
        <g stroke={INK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={55} x2={0} y2={185} />
          <line x1={0} y1={185} x2={-35} y2={320} />
          <line x1={0} y1={185} x2={35} y2={320} />
          <line x1={0} y1={95} x2={-50} y2={150} />
          <line x1={0} y1={95} x2={50} y2={150} />
        </g>
      </g>

      {/* 1. CO2 Blue Breath Stream flowing to left */}
      <path
        d={`M 940 490 Q 600 320 280 ${260 + Math.sin(frame * 0.15) * 15}`}
        stroke="#38BDF8"
        strokeWidth={6}
        strokeDasharray="18 12"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x={440}
        y={300}
        fill="#0284C7"
        fontSize={36}
        fontWeight="900"
        fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
        stroke="#FFFFFF"
        strokeWidth={2}
      >
        CO₂
      </text>

      {/* 2. Skin Odor Orange Scent Stream flowing to right */}
      <path
        d={`M 980 560 Q 1300 420 1650 ${350 + Math.cos(frame * 0.15) * 15}`}
        stroke="#F59E0B"
        strokeWidth={6}
        strokeDasharray="18 12"
        fill="none"
        strokeLinecap="round"
      />
      <text
        x={1400}
        y={400}
        fill="#D97706"
        fontSize={36}
        fontWeight="900"
        fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
        stroke="#FFFFFF"
        strokeWidth={2}
      >
        SKIN ODOR
      </text>

      {/* Fighter Jet Military Target Reticle locked on Host */}
      <g transform="translate(960, 500)">
        <circle cx={0} cy={0} r={110} stroke="#22C55E" strokeWidth={5} fill="none" strokeDasharray="20 14" />
        <line x1={-130} y1={0} x2={-90} y2={0} stroke="#22C55E" strokeWidth={5} />
        <line x1={90} y1={0} x2={130} y2={0} stroke="#22C55E" strokeWidth={5} />
        <line x1={0} y1={-130} x2={0} y2={-90} stroke="#22C55E" strokeWidth={5} />
        <line x1={0} y1={90} x2={0} y2={130} stroke="#22C55E" strokeWidth={5} />
      </g>

      {/* Mosquito Diving in on Lock-On Vector */}
      <g transform={`translate(${1600 - frame * 3.5}, ${220 + frame * 1.5}) rotate(-25)`}>
        <ZennDetailedMosquito scale={1.5} facing="left" />
      </g>
    </svg>
  );
};
