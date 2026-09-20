import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  FLOOR_UMBER,
  INK,
  MOSQUITO_BODY,
  MOSQUITO_WING,
  VICTIM_RED,
  WALL_OCHRE,
  ZennDetailedMosquito,
} from './ZennMasterComponents';

export const LAB_WALL = '#FAF6F0';
export const LAB_WOOD = '#8B5A2B';
export const LAB_WOOD_DARK = '#5C3818';
export const DNA_BLUE = '#2563EB';
export const DNA_ORANGE = '#F59E0B';
export const DNA_GREEN = '#10B981';
export const DNA_RED = '#EF4444';
export const COMIC_FONT = "'Comic Sans MS', 'Chalkboard SE', 'Marker Felt', sans-serif";

/**
 * 🔬 BEAT 1: Scientist Discovering the Twin Study Paper
 * Narration: "Here's the moment that changes how you see all of this."
 */
export const ZennTwinPaperScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Lightbulb pop spring
  const bulbSpring = spring({
    frame: Math.max(0, frame - 30),
    fps,
    config: { damping: 10, mass: 0.6 },
  });

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Lab Room Background */}
      <rect x={0} y={0} width={1920} height={760} fill={LAB_WALL} />
      <rect x={0} y={760} width={1920} height={320} fill={LAB_WOOD_DARK} />
      <line x1={0} y1={760} x2={1920} y2={760} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Background Wooden Chemical Shelves */}
      <g transform="translate(960, 180)">
        {/* Shelf Planks */}
        <line x1={-700} y1={0} x2={700} y2={0} stroke={LAB_WOOD} strokeWidth={16} strokeLinecap="round" />
        <line x1={-700} y1={0} x2={700} y2={0} stroke={INK} strokeWidth={5} strokeLinecap="round" />

        {/* Beakers & Flasks on Shelf */}
        {/* Flask 1 (Blue) */}
        <g transform="translate(-500, -10)">
          <polygon points="-25,0 25,0 12,-65 -12,-65" fill="#38BDF8" opacity={0.8} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <rect x={-15} y={-80} width={30} height={15} rx={3} fill="#E2E8F0" stroke={INK} strokeWidth={3} />
          {/* Liquid level */}
          <polygon points="-20,-5 20,-5 10,-45 -10,-45" fill="#0284C7" />
          <circle cx={-3} cy={-25 + Math.sin(frame * 0.1) * 5} r={3} fill="#FFFFFF" opacity={0.6} />
        </g>

        {/* Beaker 2 (Amber) */}
        <g transform="translate(-320, -10)">
          <rect x={-25} y={-70} width={50} height={70} rx={4} fill="#FEF08A" opacity={0.85} stroke={INK} strokeWidth={4} />
          <rect x={-22} y={-45} width={44} height={42} rx={2} fill="#F59E0B" />
          <line x1={-18} y1={-30} x2={-8} y2={-30} stroke={INK} strokeWidth={2} />
          <line x1={-18} y1={-18} x2={-8} y2={-18} stroke={INK} strokeWidth={2} />
        </g>

        {/* Flask 3 (Green) */}
        <g transform="translate(350, -10)">
          <polygon points="-30,0 30,0 14,-75 -14,-75" fill="#A7F3D0" opacity={0.85} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <polygon points="-26,-5 26,-5 10,-50 -10,-50" fill="#10B981" />
          <circle cx={4} cy={-30 + Math.cos(frame * 0.15) * 6} r={4} fill="#FFFFFF" opacity={0.7} />
        </g>

        {/* Stack of Science Journals on Shelf */}
        <g transform="translate(520, -10)">
          <rect x={-50} y={-24} width={100} height={24} rx={3} fill="#DC2626" stroke={INK} strokeWidth={3.5} />
          <rect x={-45} y={-44} width={90} height={20} rx={3} fill="#2563EB" stroke={INK} strokeWidth={3.5} />
          <rect x={-48} y={-64} width={96} height={20} rx={3} fill="#FACC15" stroke={INK} strokeWidth={3.5} />
        </g>
      </g>

      {/* 2. Wooden Lab Bench across foreground */}
      <g transform="translate(0, 680)">
        {/* Tabletop Surface */}
        <polygon points="0,0 1920,0 1920,80 0,80" fill={LAB_WOOD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        {/* Wood grain lines */}
        <line x1={60} y1={25} x2={600} y2={25} stroke="#78441E" strokeWidth={3} />
        <line x1={800} y1={45} x2={1500} y2={45} stroke="#78441E" strokeWidth={3} />
        <line x1={300} y1={55} x2={750} y2={55} stroke="#78441E" strokeWidth={2.5} />
        {/* Bench Legs */}
        <rect x={120} y={80} width={65} height={320} fill={LAB_WOOD_DARK} stroke={INK} strokeWidth={6} />
        <rect x={1735} y={80} width={65} height={320} fill={LAB_WOOD_DARK} stroke={INK} strokeWidth={6} />
      </g>

      {/* 3. The Landmark Open Research Paper spread on Lab Bench */}
      <g transform="translate(1220, 640) rotate(-3)">
        {/* Paper Shadow */}
        <rect x={-320} y={-160} width={640} height={320} rx={12} fill="#000000" opacity={0.15} />
        {/* Paper Base */}
        <rect x={-325} y={-165} width={650} height={330} rx={10} fill="#FFFDF8" stroke={INK} strokeWidth={5.5} />
        {/* Center Crease / Spine */}
        <line x1={0} y1={-165} x2={0} y2={165} stroke="#D1D5DB" strokeWidth={3.5} />
        <line x1={-3} y1={-165} x2={-3} y2={165} stroke="#9CA3AF" strokeWidth={1.5} />

        {/* Left Page: Journal Heading & Twin Study Title */}
        <g transform="translate(-160, -110)">
          {/* Header Stamp */}
          <rect x={-120} y={-25} width={240} height={28} rx={4} fill="#FEF08A" stroke={INK} strokeWidth={2.5} />
          <text x={0} y={-7} fill={INK} fontSize={15} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            PLOS ONE • RESEARCH (2015)
          </text>

          {/* Paper Title */}
          <text x={0} y={35} fill={INK} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            HERITABILITY OF MOSQUITO
          </text>
          <text x={0} y={60} fill="#2563EB" fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            ATTRACTIVENESS IN TWINS
          </text>

          {/* Doodle text lines */}
          {[-10, 10, 30, 50, 70, 90, 110, 130].map((ly, i) => (
            <line key={i} x1={-120} y1={ly + 80} x2={120} y2={ly + 80} stroke="#94A3B8" strokeWidth={2.5} strokeLinecap="round" />
          ))}
        </g>

        {/* Right Page: Hand-Drawn Y-Tube Diagram Sketch on Paper */}
        <g transform="translate(160, -20)">
          <text x={0} y={-85} fill="#0F766E" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            Y-TUBE OLFACTOMETER
          </text>

          {/* Miniature Y sketch */}
          <path d="M 0 65 L 0 0 L -65 -60 M 0 0 L 65 -60" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
          <circle cx={-65} cy={-60} r={16} fill="#E0F2FE" stroke={INK} strokeWidth={3} />
          <text x={-65} y={-55} fill={INK} fontSize={11} fontWeight="bold" textAnchor="middle">A</text>
          <circle cx={65} cy={-60} r={16} fill="#E0F2FE" stroke={INK} strokeWidth={3} />
          <text x={65} y={-55} fill={INK} fontSize={11} fontWeight="bold" textAnchor="middle">B</text>
          <circle cx={0} cy={65} r={14} fill="#FEF08A" stroke={INK} strokeWidth={3} />

          {/* Mini doodle mosquito */}
          <circle cx={0} cy={10} r={6} fill={MOSQUITO_BODY} />
          <line x1={-8} y1={5} x2={8} y2={15} stroke={INK} strokeWidth={2} />

          {/* Hand-drawn red circled conclusion */}
          <ellipse cx={0} cy={110} rx={115} ry={30} fill="none" stroke={VICTIM_RED} strokeWidth={3.5} strokeDasharray="10 5" />
          <text x={0} y={115} fill={VICTIM_RED} fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            GENETIC ATTRACTION: HIGH
          </text>
        </g>
      </g>

      {/* 4. Scientist Stickman on Left Excitedly Pointing at Paper */}
      <g transform="translate(540, 520)">
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />

        {/* Scientist Round Glasses */}
        <circle cx={-22} cy={-4} r={22} fill="none" stroke={INK} strokeWidth={5} />
        <circle cx={22} cy={-4} r={22} fill="none" stroke={INK} strokeWidth={5} />
        <line x1={-2} y1={-4} x2={2} y2={-4} stroke={INK} strokeWidth={4} />
        <line x1={-44} y1={-4} x2={-55} y2={-6} stroke={INK} strokeWidth={4} />
        <line x1={44} y1={-4} x2={55} y2={-6} stroke={INK} strokeWidth={4} />
        {/* Excited pupils behind glasses */}
        <circle cx={-18 + Math.sin(frame * 0.15) * 2} cy={-4} r={5.5} fill={INK} />
        <circle cx={-19 + Math.sin(frame * 0.15) * 2} cy={-6} r={1.5} fill="#FFFFFF" />
        <circle cx={26 + Math.sin(frame * 0.15) * 2} cy={-4} r={5.5} fill={INK} />
        <circle cx={25 + Math.sin(frame * 0.15) * 2} cy={-6} r={1.5} fill="#FFFFFF" />

        {/* Excited Arched Eyebrows */}
        <path d="M -35 -30 Q -22 -42 -10 -30" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <path d="M 10 -30 Q 22 -42 35 -30" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />

        {/* Wide Grinning Open Mouth */}
        <path d="M -16 22 Q 0 42 16 22 Z" fill="#FFFFFF" stroke={INK} strokeWidth={4} strokeLinejoin="round" />

        {/* White Lab Coat Body */}
        <path
          d="M -30 55 L -45 190 L 45 190 L 30 55 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={5.5}
          strokeLinejoin="round"
        />
        {/* Lab coat center button line and collar */}
        <line x1={0} y1={55} x2={0} y2={190} stroke={INK} strokeWidth={4} />
        <circle cx={0} cy={95} r={3.5} fill={INK} />
        <circle cx={0} cy={135} r={3.5} fill={INK} />
        <circle cx={0} cy={170} r={3.5} fill={INK} />
        <path d="M -25 55 L 0 90 L 25 55" stroke={INK} strokeWidth={3.5} fill="none" />
        {/* Pocket with pen */}
        <rect x={-36} y={110} width={22} height={26} rx={2} fill="#F1F5F9" stroke={INK} strokeWidth={3} />
        <line x1={-25} y1={102} x2={-25} y2={120} stroke="#2563EB" strokeWidth={3.5} />

        {/* Legs behind bench */}
        <line x1={-20} y1={190} x2={-20} y2={290} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={20} y1={190} x2={20} y2={290} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Left Arm: Raised in Excited "Aha!" Discovery */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={-30} y1={75} x2={-90} y2={50} />
          <line x1={-90} y1={50} x2={-110} y2={-20} />
          {/* Hand with open gesture */}
          <line x1={-110} y1={-20} x2={-125} y2={-35} />
          <line x1={-110} y1={-20} x2={-105} y2={-42} />
        </g>

        {/* Right Arm: Pointing emphatically towards research paper */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={30} y1={75} x2={100} y2={105} />
          <line x1={100} y1={105} x2={220} y2={125} />
          {/* Pointing index finger */}
          <line x1={220} y1={125} x2={260} y2={130} strokeWidth={6.5} />
        </g>
      </g>

      {/* 5. Popping Yellow Lightbulb over Scientist's Head */}
      <g transform={`translate(540, 360) scale(${bulbSpring})`}>
        {/* Glowing Aura Ring */}
        <circle cx={0} cy={-30} r={75} fill="#FEF08A" opacity={0.45 + Math.sin(frame * 0.2) * 0.15} />

        {/* Radiating Eureka Rays */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          const r1 = 65;
          const r2 = 90 + (i % 2 === 0 ? 15 : 0);
          return (
            <line
              key={i}
              x1={Math.cos(rad) * r1}
              y1={-30 + Math.sin(rad) * r1}
              x2={Math.cos(rad) * r2}
              y2={-30 + Math.sin(rad) * r2}
              stroke="#F59E0B"
              strokeWidth={5}
              strokeLinecap="round"
            />
          );
        })}

        {/* Lightbulb Glass Bulb */}
        <path
          d="M -30 -30 C -45 -65 0 -85 0 -85 C 0 -85 45 -65 30 -30 C 20 -10 18 -5 18 10 L -18 10 C -18 -5 -20 -10 -30 -30 Z"
          fill="#FACC15"
          stroke={INK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        {/* Screw Base */}
        <rect x={-15} y={10} width={30} height={18} rx={2} fill="#94A3B8" stroke={INK} strokeWidth={4} />
        <line x1={-15} y1={16} x2={15} y2={16} stroke={INK} strokeWidth={2.5} />
        <line x1={-15} y1={22} x2={15} y2={22} stroke={INK} strokeWidth={2.5} />
        {/* Filament */}
        <path d="M -10 -25 L -5 -50 L 5 -50 L 10 -25" stroke="#78350F" strokeWidth={3} fill="none" />
      </g>

      {/* Red Hand-Drawn Comic Arrow Pointing from Scientist to Paper */}
      <g stroke={VICTIM_RED} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d="M 820 660 Q 940 680 1020 660" strokeDasharray="12 8" />
        <polyline points="995,645 1025,660 1000,678" fill="none" strokeWidth={6} />
      </g>
    </svg>
  );
};

/**
 * 🧪 BEAT 2: The Y-Tube Olfactometer Apparatus
 * Narration: "Researchers at the London School of Hygiene and Tropical Medicine compared identical twins to fraternal twins on mosquito attractiveness."
 */
export const ZennYTubeApparatusScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Lab Background */}
      <rect x={0} y={0} width={1920} height={780} fill={LAB_WALL} />
      <rect x={0} y={780} width={1920} height={300} fill={LAB_WOOD_DARK} />
      <line x1={0} y1={780} x2={1920} y2={780} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Wall Plaque / Banner */}
      <g transform="translate(960, 90)">
        <rect x={-420} y={-45} width={840} height={80} rx={10} fill="#E2E8F0" stroke={INK} strokeWidth={5} />
        <rect x={-410} y={-35} width={820} height={60} rx={6} fill="#F8FAFC" stroke={INK} strokeWidth={2} />
        <text x={0} y={5} fill={INK} fontSize={24} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          LONDON SCHOOL OF HYGIENE & TROPICAL MEDICINE
        </text>
        <text x={0} y={24} fill="#0284C7" fontSize={14} fontWeight="bold" fontFamily={COMIC_FONT} textAnchor="middle">
          DUAL-CHOICE Y-TUBE OLFACTOMETER APPARATUS
        </text>
      </g>

      {/* Heavy Wooden Lab Bench */}
      <g transform="translate(0, 720)">
        <polygon points="0,0 1920,0 1920,80 0,80" fill={LAB_WOOD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
        <rect x={180} y={80} width={65} height={280} fill={LAB_WOOD_DARK} stroke={INK} strokeWidth={6} />
        <rect x={1675} y={80} width={65} height={280} fill={LAB_WOOD_DARK} stroke={INK} strokeWidth={6} />
      </g>

      {/* 2. Glass Y-Tube Olfactometer (Exact Science Apparatus) */}
      <g transform="translate(960, 520)">
        {/* Metal Support Stands */}
        <g stroke="#64748B" strokeWidth={8} strokeLinecap="round">
          <line x1={0} y1={200} x2={0} y2={230} stroke="#334155" strokeWidth={14} />
          <rect x={-80} y={225} width={160} height={25} rx={6} fill="#334155" stroke={INK} strokeWidth={4} />
          <line x1={-380} y1={-80} x2={-380} y2={230} stroke="#334155" strokeWidth={10} />
          <rect x={-430} y={225} width={100} height={25} rx={6} fill="#334155" stroke={INK} strokeWidth={4} />
          <line x1={380} y1={-80} x2={380} y2={230} stroke="#334155" strokeWidth={10} />
          <rect x={330} y={225} width={100} height={25} rx={6} fill="#334155" stroke={INK} strokeWidth={4} />
        </g>

        {/* Clear Glass Y-Tube Shell with double line ink & blue highlights */}
        {/* Base Release Tube */}
        <path
          d="M -50 200 L -50 40 L -400 -140 L -370 -190 L 0 -10 L 370 -190 L 400 -140 L 50 40 L 50 200 Z"
          fill="#F0F9FF"
          opacity={0.8}
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* Glass reflection gleams */}
        <path d="M -35 180 L -35 50 L -360 -120" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />
        <path d="M 35 180 L 35 50 L 360 -120" stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" opacity={0.7} />

        {/* Port A: Left Hand Odor Chamber */}
        <g transform="translate(-400, -165)">
          <rect x={-90} y={-55} width={180} height={110} rx={16} fill="#E0F2FE" opacity={0.85} stroke={INK} strokeWidth={5} />
          {/* Glass sleeve collar */}
          <rect x={-110} y={-40} width={30} height={80} rx={6} fill="#BAE6FD" stroke={INK} strokeWidth={4} />
          {/* Comic Port Label */}
          <rect x={-60} y={-95} width={120} height={32} rx={6} fill="#0284C7" stroke={INK} strokeWidth={3} />
          <text x={0} y={-73} fill="#FFFFFF" fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            PORT A
          </text>
          {/* Twin Hand inserted into port */}
          <path d="M -160 0 L -40 0" stroke="#FDBA74" strokeWidth={34} strokeLinecap="round" />
          <circle cx={-30} cy={0} r={18} fill="#FDBA74" stroke={INK} strokeWidth={4} />
          {/* Blue Airflow Arrow */}
          <path d="M 40 0 L 100 25" stroke="#38BDF8" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 6" />
        </g>

        {/* Port B: Right Hand Odor Chamber */}
        <g transform="translate(400, -165)">
          <rect x={-90} y={-55} width={180} height={110} rx={16} fill="#E0F2FE" opacity={0.85} stroke={INK} strokeWidth={5} />
          <rect x={80} y={-40} width={30} height={80} rx={6} fill="#BAE6FD" stroke={INK} strokeWidth={4} />
          {/* Comic Port Label */}
          <rect x={-60} y={-95} width={120} height={32} rx={6} fill="#0F766E" stroke={INK} strokeWidth={3} />
          <text x={0} y={-73} fill="#FFFFFF" fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            PORT B
          </text>
          {/* Twin Hand inserted into port */}
          <path d="M 160 0 L 40 0" stroke="#FDBA74" strokeWidth={34} strokeLinecap="round" />
          <circle cx={30} cy={0} r={18} fill="#FDBA74" stroke={INK} strokeWidth={4} />
          {/* Blue Airflow Arrow */}
          <path d="M -40 0 L -100 25" stroke="#38BDF8" strokeWidth={5} strokeLinecap="round" strokeDasharray="10 6" />
        </g>

        {/* Base Mosquito Release Chamber */}
        <g transform="translate(0, 200)">
          <rect x={-65} y={-10} width={130} height={60} rx={8} fill="#1E293B" stroke={INK} strokeWidth={5} />
          {/* Fan blades spinning */}
          <g transform={`translate(0, 20) rotate(${frame * 18})`}>
            <ellipse cx={0} cy={-16} rx={7} ry={16} fill="#64748B" />
            <ellipse cx={0} cy={16} rx={7} ry={16} fill="#64748B" />
            <ellipse cx={-16} cy={0} rx={16} ry={7} fill="#64748B" />
            <ellipse cx={16} cy={0} rx={16} ry={7} fill="#64748B" />
            <circle cx={0} cy={0} r={6} fill="#CBD5E1" />
          </g>
          <text x={0} y={75} fill="#0284C7" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            AIRFLOW IN
          </text>
        </g>

        {/* 3. Curious Mosquitoes at the Decision Fork */}
        {/* Mosquito 1: At the center junction sniffing both sides */}
        <g transform={`translate(0, ${40 + Math.sin(frame * 0.2) * 8})`}>
          <ZennDetailedMosquito scale={1.1} facing="left" />
          {/* Question mark over head */}
          <text
            x={15}
            y={-30}
            fill="#EF4444"
            fontSize={28}
            fontWeight="900"
            fontFamily={COMIC_FONT}
            transform={`rotate(${Math.sin(frame * 0.15) * 10})`}
          >
            ?
          </text>
        </g>

        {/* Mosquito 2: Checking left arm */}
        <g transform={`translate(${-120 + Math.sin(frame * 0.15) * 12}, ${-20 + Math.cos(frame * 0.12) * 10}) rotate(-25)`}>
          <ZennDetailedMosquito scale={0.9} facing="left" />
        </g>

        {/* Mosquito 3: Checking right arm */}
        <g transform={`translate(${120 + Math.cos(frame * 0.18) * 12}, ${-20 + Math.sin(frame * 0.14) * 10}) rotate(25)`}>
          <ZennDetailedMosquito scale={0.9} facing="right" />
        </g>
      </g>
    </svg>
  );
};

/**
 * 👥 BEAT 3: Identical Twins in Y-Tube Test — Exactly 50/50 Split!
 * Narration: "Identical twins — who share all their DNA — were nearly equally attractive to mosquitoes."
 */
export const ZennIdenticalTwinsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Lab Background */}
      <rect x={0} y={0} width={1920} height={780} fill={LAB_WALL} />
      <rect x={0} y={780} width={1920} height={300} fill={LAB_WOOD_DARK} />
      <line x1={0} y1={780} x2={1920} y2={780} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Lab Bench */}
      <g transform="translate(0, 720)">
        <polygon points="0,0 1920,0 1920,80 0,80" fill={LAB_WOOD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>

      {/* 2. Central Y-Tube Olfactometer with Support Stands & Ports */}
      <g transform="translate(960, 520)">
        {/* Metal Support Stands */}
        <g stroke="#64748B" strokeWidth={8} strokeLinecap="round">
          <line x1={0} y1={190} x2={0} y2={230} stroke="#334155" strokeWidth={14} />
          <rect x={-80} y={225} width={160} height={25} rx={6} fill="#334155" stroke={INK} strokeWidth={4} />
          <line x1={-380} y1={-80} x2={-380} y2={230} stroke="#334155" strokeWidth={10} />
          <rect x={-430} y={225} width={100} height={25} rx={6} fill="#334155" stroke={INK} strokeWidth={4} />
          <line x1={380} y1={-80} x2={380} y2={230} stroke="#334155" strokeWidth={10} />
          <rect x={330} y={225} width={100} height={25} rx={6} fill="#334155" stroke={INK} strokeWidth={4} />
        </g>

        {/* Glass Y-Tube */}
        <path
          d="M -45 190 L -45 40 L -380 -130 L -350 -180 L 0 -10 L 350 -180 L 380 -130 L 45 40 L 45 190 Z"
          fill="#F0F9FF"
          opacity={0.8}
          stroke={INK}
          strokeWidth={5.5}
          strokeLinejoin="round"
        />

        {/* Port A & B Chambers */}
        <g transform="translate(-390, -155)">
          <rect x={-70} y={-45} width={140} height={90} rx={12} fill="#E0F2FE" opacity={0.85} stroke={INK} strokeWidth={4.5} />
          <rect x={-90} y={-30} width={24} height={60} rx={4} fill="#BAE6FD" stroke={INK} strokeWidth={3} />
          <text x={0} y={-60} fill="#0284C7" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">PORT A</text>
        </g>
        <g transform="translate(390, -155)">
          <rect x={-70} y={-45} width={140} height={90} rx={12} fill="#E0F2FE" opacity={0.85} stroke={INK} strokeWidth={4.5} />
          <rect x={66} y={-30} width={24} height={60} rx={4} fill="#BAE6FD" stroke={INK} strokeWidth={3} />
          <text x={0} y={-60} fill="#0F766E" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">PORT B</text>
        </g>

        {/* Equal Golden Scent Streams flowing through both branches */}
        <path
          d="M -360 -155 Q -180 -70 -20 50"
          stroke="#F59E0B"
          strokeWidth={6}
          strokeDasharray="14 10"
          strokeDashoffset={-frame * 3}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M 360 -155 Q 180 -70 20 50"
          stroke="#F59E0B"
          strokeWidth={6}
          strokeDasharray="14 10"
          strokeDashoffset={-frame * 3}
          fill="none"
          strokeLinecap="round"
        />

        {/* 5 Mosquitoes flying up Left Branch (50%) spaced neatly */}
        {[0, 1, 2, 3, 4].map((i) => {
          const t = ((frame * 1.5 + i * 40) % 200) / 200;
          const mx = interpolate(t, [0, 1], [-20, -320]);
          const my = interpolate(t, [0, 1], [60, -130]);
          return (
            <g key={i} transform={`translate(${mx}, ${my}) rotate(-35)`}>
              <ZennDetailedMosquito scale={0.7} facing="left" />
            </g>
          );
        })}

        {/* 5 Mosquitoes flying up Right Branch (50%) spaced neatly */}
        {[0, 1, 2, 3, 4].map((i) => {
          const t = ((frame * 1.5 + i * 40) % 200) / 200;
          const mx = interpolate(t, [0, 1], [20, 320]);
          const my = interpolate(t, [0, 1], [60, -130]);
          return (
            <g key={i} transform={`translate(${mx}, ${my}) rotate(35)`}>
              <ZennDetailedMosquito scale={0.7} facing="right" />
            </g>
          );
        })}
      </g>

      {/* 3. IDENTICAL TWIN 1 (Left, 100% DNA) */}
      <g transform="translate(420, 500)">
        {/* Comic Twin Label */}
        <rect x={-140} y={-170} width={280} height={36} rx={6} fill="#2563EB" stroke={INK} strokeWidth={3} />
        <text x={0} y={-146} fill="#FFFFFF" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          IDENTICAL TWIN A (100% DNA)
        </text>

        {/* Head with 3 Spiky Hairs */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <g stroke={INK} strokeWidth={4.5} strokeLinecap="round">
          <line x1={-12} y1={-50} x2={-16} y2={-82} />
          <line x1={0} y1={-52} x2={0} y2={-90} />
          <line x1={12} y1={-50} x2={20} y2={-80} />
        </g>
        {/* Nervous Smile Eyes */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-16} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={20} cy={-6} r={5} fill={INK} />
        <line x1={-28} y1={-25} x2={-8} y2={-25} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-25} x2={28} y2={-25} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M -12 24 Q 0 32 12 24" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />

        {/* Red Bite Welts */}
        <circle cx={-40} cy={-8} r={8} fill={VICTIM_RED} />
        <circle cx={40} cy={14} r={8} fill={VICTIM_RED} />

        {/* Royal Blue T-Shirt Body */}
        <rect x={-32} y={55} width={64} height={125} rx={6} fill="#2563EB" stroke={INK} strokeWidth={5} />
        <line x1={-16} y1={180} x2={-16} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <line x1={16} y1={180} x2={16} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />

        {/* Left arm resting at side */}
        <line x1={-32} y1={75} x2={-55} y2={160} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        {/* Right arm extended into Port A */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={32} y1={75} x2={85} y2={-90} />
          <line x1={85} y1={-90} x2={150} y2={-135} strokeWidth={18} stroke="#FDBA74" />
        </g>
      </g>

      {/* 4. IDENTICAL TWIN 2 (Right, 100% DNA, Exactly Identical Clone!) */}
      <g transform="translate(1500, 500)">
        {/* Comic Twin Label */}
        <rect x={-140} y={-170} width={280} height={36} rx={6} fill="#2563EB" stroke={INK} strokeWidth={3} />
        <text x={0} y={-146} fill="#FFFFFF" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          IDENTICAL TWIN B (100% DNA)
        </text>

        {/* Head with identical 3 Spiky Hairs */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <g stroke={INK} strokeWidth={4.5} strokeLinecap="round">
          <line x1={-12} y1={-50} x2={-16} y2={-82} />
          <line x1={0} y1={-52} x2={0} y2={-90} />
          <line x1={12} y1={-50} x2={20} y2={-80} />
        </g>
        {/* Identical Eyes & Smile */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-20} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={16} cy={-6} r={5} fill={INK} />
        <line x1={-28} y1={-25} x2={-8} y2={-25} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-25} x2={28} y2={-25} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M -12 24 Q 0 32 12 24" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />

        {/* Identical Red Bite Welts */}
        <circle cx={-40} cy={-8} r={8} fill={VICTIM_RED} />
        <circle cx={40} cy={14} r={8} fill={VICTIM_RED} />

        {/* Matching Royal Blue T-Shirt Body */}
        <rect x={-32} y={55} width={64} height={125} rx={6} fill="#2563EB" stroke={INK} strokeWidth={5} />
        <line x1={-16} y1={180} x2={-16} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <line x1={16} y1={180} x2={16} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />

        {/* Right arm resting at side */}
        <line x1={32} y1={75} x2={55} y2={160} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        {/* Left arm extended into Port B */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={-32} y1={75} x2={-85} y2={-90} />
          <line x1={-85} y1={-90} x2={-150} y2={-135} strokeWidth={18} stroke="#FDBA74" />
        </g>
      </g>

      {/* 5. Big Hand-Drawn "50 / 50" Comic Center Stamp */}
      <g transform="translate(960, 180)">
        <ellipse cx={0} cy={0} rx={180} ry={60} fill="#FEF08A" stroke={INK} strokeWidth={5.5} />
        <text x={0} y={15} fill={INK} fontSize={62} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          50 / 50
        </text>
        <text x={0} y={42} fill="#0284C7" fontSize={16} fontWeight="bold" fontFamily={COMIC_FONT} textAnchor="middle">
          NEAR-PERFECT SYMMETRY
        </text>
      </g>
    </svg>
  );
};

/**
 * 📊 BEAT 4: Fraternal Twins in Y-Tube Test — Massive Variation (0 vs 10 Bites!)
 * Narration: "Fraternal twins, sharing only about half their DNA, showed far more variation between them."
 */
export const ZennFraternalTwinsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Lab Background */}
      <rect x={0} y={0} width={1920} height={780} fill={LAB_WALL} />
      <rect x={0} y={780} width={1920} height={300} fill={LAB_WOOD_DARK} />
      <line x1={0} y1={780} x2={1920} y2={780} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Lab Bench */}
      <g transform="translate(0, 720)">
        <polygon points="0,0 1920,0 1920,80 0,80" fill={LAB_WOOD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>

      {/* 2. Central Y-Tube Olfactometer with Heavily Skewed Trajectories */}
      <g transform="translate(960, 520)">
        {/* Metal Support Stands */}
        <g stroke="#64748B" strokeWidth={8} strokeLinecap="round">
          <line x1={0} y1={190} x2={0} y2={230} stroke="#334155" strokeWidth={14} />
          <rect x={-80} y={225} width={160} height={25} rx={6} fill="#334155" stroke={INK} strokeWidth={4} />
          <line x1={-380} y1={-80} x2={-380} y2={230} stroke="#334155" strokeWidth={10} />
          <rect x={-430} y={225} width={100} height={25} rx={6} fill="#334155" stroke={INK} strokeWidth={4} />
          <line x1={380} y1={-80} x2={380} y2={230} stroke="#334155" strokeWidth={10} />
          <rect x={330} y={225} width={100} height={25} rx={6} fill="#334155" stroke={INK} strokeWidth={4} />
        </g>

        {/* Glass Y-Tube */}
        <path
          d="M -45 190 L -45 40 L -380 -130 L -350 -180 L 0 -10 L 350 -180 L 380 -130 L 45 40 L 45 190 Z"
          fill="#F0F9FF"
          opacity={0.8}
          stroke={INK}
          strokeWidth={5.5}
          strokeLinejoin="round"
        />

        {/* Port A & B Chambers */}
        <g transform="translate(-390, -155)">
          <rect x={-70} y={-45} width={140} height={90} rx={12} fill="#E0F2FE" opacity={0.85} stroke={INK} strokeWidth={4.5} />
          <rect x={-90} y={-30} width={24} height={60} rx={4} fill="#BAE6FD" stroke={INK} strokeWidth={3} />
          <text x={0} y={-60} fill="#0284C7" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">PORT A</text>
        </g>
        <g transform="translate(390, -155)">
          <rect x={-70} y={-45} width={140} height={90} rx={12} fill="#E0F2FE" opacity={0.85} stroke={INK} strokeWidth={4.5} />
          <rect x={66} y={-30} width={24} height={60} rx={4} fill="#BAE6FD" stroke={INK} strokeWidth={3} />
          <text x={0} y={-60} fill="#0F766E" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">PORT B</text>
        </g>

        {/* Left Branch: Faint, barely visible thin scent puff (0 attraction) */}
        <path
          d="M -360 -155 Q -180 -70 -20 50"
          stroke="#94A3B8"
          strokeWidth={2.5}
          strokeDasharray="6 14"
          fill="none"
          opacity={0.4}
        />
        {/* Big Gray 'X' over Left Branch */}
        <g stroke="#EF4444" strokeWidth={5} strokeLinecap="round" transform="translate(-180, -60)">
          <line x1={-18} y1={-18} x2={18} y2={18} />
          <line x1={18} y1={-18} x2={-18} y2={18} />
        </g>

        {/* Right Branch: Massive thick, pulsating orange scent river */}
        <path
          d="M 360 -155 Q 180 -70 20 50"
          stroke="#F97316"
          strokeWidth={14}
          strokeDasharray="20 12"
          strokeDashoffset={-frame * 4}
          fill="none"
          strokeLinecap="round"
        />

        {/* ALL 10 Mosquitoes swarming down the right arm onto Twin 2 */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const t = ((frame * 1.8 + i * 20) % 200) / 200;
          const mx = interpolate(t, [0, 1], [20, 360]);
          const my = interpolate(t, [0, 1], [60, -140]);
          const wobble = Math.sin(frame * 0.3 + i * 1.2) * 10;
          return (
            <g key={i} transform={`translate(${mx}, ${my + wobble}) rotate(35)`}>
              <ZennDetailedMosquito scale={0.7} facing="right" />
            </g>
          );
        })}
      </g>

      {/* 3. FRATERNAL TWIN 1 (Left): Calm, Glasses, Emerald Shirt, 0 BITES! */}
      <g transform="translate(420, 500)">
        {/* Comic Twin Label */}
        <rect x={-140} y={-170} width={280} height={36} rx={6} fill="#10B981" stroke={INK} strokeWidth={3} />
        <text x={0} y={-146} fill="#FFFFFF" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          FRATERNAL A (50% DNA)
        </text>

        {/* Head: Smooth / Bald with Round Glasses */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <circle cx={-20} cy={-4} r={20} fill="none" stroke={INK} strokeWidth={4.5} />
        <circle cx={20} cy={-4} r={20} fill="none" stroke={INK} strokeWidth={4.5} />
        <line x1={-2} y1={-4} x2={2} y2={-4} stroke={INK} strokeWidth={3.5} />
        <circle cx={-20} cy={-4} r={4.5} fill={INK} />
        <circle cx={20} cy={-4} r={4.5} fill={INK} />
        {/* Calm Relaxed Eyebrows & Smile */}
        <line x1={-28} y1={-28} x2={-10} y2={-28} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={10} y1={-28} x2={28} y2={-28} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M -10 22 Q 0 30 10 22" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />

        {/* ZERO RED WELTS! Clean pristine skin! */}

        {/* Emerald Green T-Shirt */}
        <rect x={-32} y={55} width={64} height={125} rx={6} fill="#10B981" stroke={INK} strokeWidth={5} />
        <line x1={-16} y1={180} x2={-16} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <line x1={16} y1={180} x2={16} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />

        {/* Arm into Port A */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={32} y1={75} x2={85} y2={-90} />
          <line x1={85} y1={-90} x2={150} y2={-135} strokeWidth={18} stroke="#FDBA74" />
        </g>

        {/* Big Green Badge: 0 BITES */}
        <g transform="translate(0, -90)">
          <rect x={-65} y={-20} width={130} height={40} rx={8} fill="#D1FAE5" stroke="#059669" strokeWidth={3.5} />
          <text x={0} y={7} fill="#047857" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            0 BITES ✔
          </text>
        </g>
      </g>

      {/* 4. FRATERNAL TWIN 2 (Right): 3 Hairs, Orange Shirt, Swarmed by Mosquitoes, 10 BITES! */}
      <g transform="translate(1500, 500)">
        {/* Comic Twin Label */}
        <rect x={-140} y={-170} width={280} height={36} rx={6} fill="#EA580C" stroke={INK} strokeWidth={3} />
        <text x={0} y={-146} fill="#FFFFFF" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          FRATERNAL B (50% DNA)
        </text>

        {/* Head with 3 wild spiky hairs */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        <g stroke={INK} strokeWidth={4.5} strokeLinecap="round">
          <line x1={-14} y1={-50} x2={-24} y2={-82} />
          <line x1={0} y1={-52} x2={0} y2={-90} />
          <line x1={14} y1={-50} x2={26} y2={-80} />
        </g>
        {/* Terrified / Panicked Eyes */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18} cy={-4} r={6} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-4} r={6} fill={INK} />
        <line x1={-28} y1={-20} x2={-8} y2={-28} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-28} x2={28} y2={-20} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        {/* Screaming mouth */}
        <ellipse cx={0} cy={24} rx={12} ry={16} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />

        {/* Swarmed in Red Bite Welts! */}
        <circle cx={-42} cy={-12} r={9} fill={VICTIM_RED} />
        <circle cx={42} cy={12} r={9} fill={VICTIM_RED} />
        <circle cx={-20} cy={20} r={8} fill={VICTIM_RED} />
        <circle cx={30} cy={-25} r={8} fill={VICTIM_RED} />
        <circle cx={0} cy={-25} r={8} fill={VICTIM_RED} />

        {/* Orange T-Shirt with Welts */}
        <rect x={-32} y={55} width={64} height={125} rx={6} fill="#EA580C" stroke={INK} strokeWidth={5} />
        <circle cx={-18} cy={95} r={8} fill={VICTIM_RED} />
        <circle cx={15} cy={130} r={8} fill={VICTIM_RED} />

        <line x1={-16} y1={180} x2={-16} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <line x1={16} y1={180} x2={16} y2={300} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />

        {/* Arm into Port B */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={-32} y1={75} x2={-85} y2={-90} />
          <line x1={-85} y1={-90} x2={-150} y2={-135} strokeWidth={18} stroke="#FDBA74" />
        </g>

        {/* Big Red Badge: 10 BITES! */}
        <g transform="translate(0, -90)">
          <rect x={-75} y={-20} width={150} height={40} rx={8} fill="#FEE2E2" stroke="#DC2626" strokeWidth={3.5} />
          <text x={0} y={7} fill="#DC2626" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            10 BITES! 🚨
          </text>
        </g>
      </g>

      {/* 5. Center Callout: "HUGE VARIATION" */}
      <g transform="translate(960, 180)">
        <rect x={-200} y={-35} width={400} height={70} rx={12} fill="#FEF08A" stroke={INK} strokeWidth={5} />
        <text x={0} y={10} fill={INK} fontSize={32} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          MASSIVE VARIATION
        </text>
      </g>
    </svg>
  );
};

/**
 * 🥧 BEAT 5: 2/3 Genetics vs 1/3 Environment Pie Chart & Host Relief
 * Narration: "The conclusion: roughly two-thirds of your mosquito magnetism is genetically determined. You didn't earn it. You didn't choose it."
 */
export const ZennGeneticsPieChartScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Studio Parchment Background */}
      <rect x={0} y={0} width={1920} height={780} fill={LAB_WALL} />
      <rect x={0} y={780} width={1920} height={300} fill={FLOOR_UMBER} />
      <line x1={0} y1={780} x2={1920} y2={780} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* 1. Large Hand-Drawn Pie Chart on Wooden Stand (Center-Right) */}
      <g transform="translate(1200, 440)">
        {/* Wooden Easel Legs */}
        <line x1={0} y1={-180} x2={-160} y2={340} stroke={LAB_WOOD} strokeWidth={14} strokeLinecap="round" />
        <line x1={0} y1={-180} x2={160} y2={340} stroke={LAB_WOOD} strokeWidth={14} strokeLinecap="round" />
        <line x1={0} y1={-180} x2={0} y2={340} stroke={LAB_WOOD_DARK} strokeWidth={10} strokeLinecap="round" />
        <line x1={-180} y1={230} x2={180} y2={230} stroke={LAB_WOOD} strokeWidth={16} strokeLinecap="round" />
        <line x1={-180} y1={230} x2={180} y2={230} stroke={INK} strokeWidth={5} strokeLinecap="round" />

        {/* White Chart Board */}
        <circle cx={0} cy={0} r={210} fill="#FFFFFF" stroke={INK} strokeWidth={7} />

        {/* 2/3 Genetics Slice (240 degrees / 67%): Red / Coral */}
        <path
          d="M 0 0 L 0 -205 A 205 205 0 1 1 -177.5 102.5 Z"
          fill="#EF4444"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* Hatching on Genetics slice */}
        <line x1={-60} y1={-100} x2={120} y2={20} stroke="#FFFFFF" strokeWidth={3} opacity={0.5} />
        <line x1={-40} y1={-60} x2={140} y2={60} stroke="#FFFFFF" strokeWidth={3} opacity={0.5} />
        <line x1={-20} y1={-20} x2={100} y2={100} stroke="#FFFFFF" strokeWidth={3} opacity={0.5} />

        {/* 1/3 Environment Slice (120 degrees / 33%): Cyan / Blue */}
        <path
          d="M 0 0 L -177.5 102.5 A 205 205 0 0 1 0 -205 Z"
          fill="#38BDF8"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />

        {/* Center Pivot Pin */}
        <circle cx={0} cy={0} r={16} fill="#FACC15" stroke={INK} strokeWidth={4} />

        {/* Hand-Drawn Comic Slice Labels */}
        {/* Genetics Label centered inside red slice */}
        <g transform="translate(65, 80)">
          <rect x={-85} y={-35} width={170} height={70} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <text x={0} y={-8} fill="#DC2626" fontSize={24} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            2/3 GENETICS
          </text>
          <text x={0} y={22} fill={INK} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            (67%) 🧬
          </text>
        </g>

        {/* Environment Label centered inside blue slice */}
        <g transform="translate(-85, -85)">
          <rect x={-80} y={-30} width={160} height={60} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
          <text x={0} y={-4} fill="#0284C7" fontSize={16} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            1/3 ENVIRONMENT
          </text>
          <text x={0} y={18} fill={INK} fontSize={15} fontWeight="bold" fontFamily={COMIC_FONT} textAnchor="middle">
            (33%)
          </text>
        </g>
      </g>

      {/* 2. Host Stickman Sighing in Relief (Left) */}
      <g transform="translate(500, 520)">
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>

        {/* Happy Relieved Eyes: "^  ^" */}
        <path d="M -28 -8 Q -18 -22 -8 -8" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <path d="M 8 -8 Q 18 -22 28 -8" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        {/* Relieved Happy Smile */}
        <path d="M -16 20 Q 0 36 16 20" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Red Welts (still on skin, but he's vindicated!) */}
        <circle cx={-44} cy={-10} r={8} fill={VICTIM_RED} />
        <circle cx={44} cy={16} r={8} fill={VICTIM_RED} />

        {/* Royal Blue T-Shirt Body */}
        <rect x={-32} y={55} width={64} height={125} rx={6} fill="#2563EB" stroke={INK} strokeWidth={5} />
        <line x1={-16} y1={180} x2={-16} y2={290} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={16} y1={180} x2={16} y2={290} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Arms */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          {/* Left hand on hip */}
          <line x1={-32} y1={85} x2={-65} y2={125} />
          <line x1={-65} y1={125} x2={-35} y2={150} />
          {/* Right hand wiping sweat from forehead in relief */}
          <line x1={32} y1={85} x2={65} y2={110} />
          <line x1={65} y1={110} x2={35} y2={-5} />
        </g>

        {/* Sigh Cloud: "PHEW!" */}
        <g transform="translate(110, -40)">
          <ellipse cx={0} cy={0} rx={45} ry={25} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
          <circle cx={-40} cy={20} r={6} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
          <circle cx={-50} cy={30} r={3.5} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
          <text x={0} y={8} fill="#0284C7" fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            PHEW!
          </text>
        </g>

        {/* Speech Bubble: "It wasn't my fault!" */}
        <g transform="translate(0, -145)">
          <ellipse cx={0} cy={0} rx={160} ry={45} fill="#FFFFFF" stroke={INK} strokeWidth={4.5} />
          <polygon points="-20,40 0,65 10,40" fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <text x={0} y={8} fill={INK} fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            "It wasn't my fault!"
          </text>
        </g>
      </g>
    </svg>
  );
};

/**
 * 🧬 BEAT 6: The DNA Ladder & Comical Trait Tags
 * Narration: "It's written into the same code that decides your height, your blood type, whether you can roll your tongue."
 */
export const ZennDNATraitsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Studio Slate Background */}
      <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />

      {/* Grid Pattern in Background */}
      {Array.from({ length: 19 }).map((_, i) => (
        <line key={i} x1={i * 100 + 60} y1={0} x2={i * 100 + 60} y2={1080} stroke="#1E293B" strokeWidth={1.5} />
      ))}
      {Array.from({ length: 11 }).map((_, i) => (
        <line key={i} x1={0} y1={i * 100 + 40} x2={1920} y2={i * 100 + 40} stroke="#1E293B" strokeWidth={1.5} />
      ))}

      {/* Center DNA Double Helix Ladder */}
      <g transform="translate(960, 540)">
        {/* Base Pair Rungs */}
        {Array.from({ length: 16 }).map((_, i) => {
          const yPos = (i - 7.5) * 65;
          const phase = yPos * 0.015 + frame * 0.05;
          const x1 = Math.sin(phase) * 110;
          const x2 = -Math.sin(phase) * 110;
          const rColors = [DNA_GREEN, DNA_ORANGE, DNA_BLUE, DNA_RED];
          const color = rColors[i % 4];

          return (
            <g key={i}>
              <line x1={x1} y1={yPos} x2={x2} y2={yPos} stroke={color} strokeWidth={6} strokeLinecap="round" />
              <circle cx={x1} cy={yPos} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
              <circle cx={x2} cy={yPos} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
            </g>
          );
        })}

        {/* Backbone Strands */}
        <path
          d={Array.from({ length: 17 })
            .map((_, i) => {
              const yPos = (i - 8) * 65;
              const phase = yPos * 0.015 + frame * 0.05;
              const xPos = Math.sin(phase) * 110;
              return `${i === 0 ? 'M' : 'L'} ${xPos} ${yPos}`;
            })
            .join(' ')}
          fill="none"
          stroke="#38BDF8"
          strokeWidth={8}
          strokeLinecap="round"
        />
        <path
          d={Array.from({ length: 17 })
            .map((_, i) => {
              const yPos = (i - 8) * 65;
              const phase = yPos * 0.015 + frame * 0.05;
              const xPos = -Math.sin(phase) * 110;
              return `${i === 0 ? 'M' : 'L'} ${xPos} ${yPos}`;
            })
            .join(' ')}
          fill="none"
          stroke="#F59E0B"
          strokeWidth={8}
          strokeLinecap="round"
        />
      </g>

      {/* 4 Comical Trait Pop-In Tags */}
      {/* 1. HEIGHT Tag (Top-Left) */}
      <g transform="translate(420, 260)">
        <rect x={-180} y={-90} width={360} height={180} rx={16} fill="#1E293B" stroke="#38BDF8" strokeWidth={4} />
        {/* Measuring Tape & Stickman */}
        <line x1={-120} y1={-70} x2={-120} y2={70} stroke="#FACC15" strokeWidth={14} strokeLinecap="round" />
        {/* Tick marks */}
        {[-50, -30, -10, 10, 30, 50].map((ty, i) => (
          <line key={i} x1={-125} y1={ty} x2={-115} y2={ty} stroke={INK} strokeWidth={2.5} />
        ))}
        {/* Tall Stickman */}
        <circle cx={-40} cy={-25} r={22} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <line x1={-40} y1={-3} x2={-40} y2={45} stroke={INK} strokeWidth={4} />
        <line x1={-40} y1={45} x2={-55} y2={75} stroke={INK} strokeWidth={4} />
        <line x1={-40} y1={45} x2={-25} y2={75} stroke={INK} strokeWidth={4} />

        <text x={50} y={-10} fill="#FFFFFF" fontSize={28} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          HEIGHT
        </text>
        <text x={50} y={25} fill="#38BDF8" fontSize={18} fontWeight="bold" fontFamily={COMIC_FONT} textAnchor="middle">
          6'1" (185 cm)
        </text>
      </g>

      {/* 2. BLOOD TYPE Tag (Top-Right) */}
      <g transform="translate(1500, 260)">
        <rect x={-180} y={-90} width={360} height={180} rx={16} fill="#1E293B" stroke="#EF4444" strokeWidth={4} />
        {/* Plump Blood Drop with shine */}
        <g transform="translate(-105, 0)">
          <path
            d="M 0 -45 C 30 -5 28 35 0 35 C -28 35 -30 -5 0 -45 Z"
            fill="#DC2626"
            stroke="#FFFFFF"
            strokeWidth={3.5}
          />
          <ellipse cx={-8} cy={10} rx={4} ry={12} fill="#FFFFFF" opacity={0.65} transform="rotate(-20 -8 10)" />
        </g>
        <text x={45} y={-10} fill="#FFFFFF" fontSize={28} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          BLOOD TYPE
        </text>
        <text x={45} y={25} fill="#EF4444" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          TYPE O / A / B
        </text>
      </g>

      {/* 3. TONGUE ROLL Tag (Bottom-Left) */}
      <g transform="translate(420, 800)">
        <rect x={-180} y={-90} width={360} height={180} rx={16} fill="#1E293B" stroke="#10B981" strokeWidth={4} />
        {/* Stickman rolling tongue :P */}
        <circle cx={-90} cy={0} r={38} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
        {/* Winking eyes */}
        <circle cx={-102} cy={-10} r={4} fill={INK} />
        <path d="M -80 -14 L -70 -6" stroke={INK} strokeWidth={3} strokeLinecap="round" />
        {/* Rolled Tongue doodle sticking out */}
        <path d="M -98 8 Q -90 40 -82 8 Z" fill="#F43F5E" stroke={INK} strokeWidth={3} />
        <line x1={-90} y1={12} x2={-90} y2={35} stroke="#9F1239" strokeWidth={2} />

        <text x={45} y={-10} fill="#FFFFFF" fontSize={28} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          TONGUE ROLL
        </text>
        <text x={45} y={25} fill="#10B981" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          CAN DO IT :P
        </text>
      </g>

      {/* 4. MOSQUITO MAGNET Tag (Bottom-Right, The Key Connection!) */}
      <g transform="translate(1500, 800)">
        <rect x={-180} y={-90} width={360} height={180} rx={16} fill="#1E293B" stroke="#F59E0B" strokeWidth={5} />
        {/* Target Symbol on left of card */}
        <g transform="translate(-110, 0)">
          <circle cx={0} cy={0} r={34} fill="#EF4444" stroke="#FFFFFF" strokeWidth={3} />
          <circle cx={0} cy={0} r={20} fill="#FFFFFF" />
          <circle cx={0} cy={0} r={9} fill="#EF4444" />
          {/* Mini mosquito hovering right over target */}
          <g transform="translate(0, -42) rotate(-20)">
            <ZennDetailedMosquito scale={0.65} facing="left" />
          </g>
        </g>

        <text x={48} y={-10} fill="#FFFFFF" fontSize={25} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          MOSQUITO MAGNET
        </text>
        <text x={48} y={25} fill="#F59E0B" fontSize={19} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          WRITTEN IN DNA!
        </text>
      </g>
    </svg>
  );
};

/**
 * 🧘 BEAT 7: Citronella Willpower vs Unbothered Mosquito & Calendar Flips
 * Narration: "No amount of citronella willpower rewrites that. If you're in that unlucky 20%, you'll likely stay there —"
 */
export const ZennCitronellaWillpowerScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Calendar flip cycle (Summer -> Autumn -> Spring)
  const currentSeason =
    frame < 75
      ? { month: 'JULY', season: 'SUMMER', bg: '#FEF08A', color: '#B45309' }
      : frame < 150
      ? { month: 'OCTOBER', season: 'AUTUMN', bg: '#FED7AA', color: '#C2410C' }
      : { month: 'APRIL', season: 'SPRING', bg: '#BBF7D0', color: '#15803D' };

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Room Environment */}
      <rect x={0} y={0} width={1920} height={750} fill={WALL_OCHRE} />
      <rect x={0} y={750} width={1920} height={330} fill={FLOOR_UMBER} />
      <line x1={0} y1={750} x2={1920} y2={750} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* 1. Hanging Calendar on Wall Flipping Rapidly */}
      <g transform="translate(1380, 360)">
        {/* Wall Nail & String */}
        <circle cx={0} cy={-130} r={6} fill="#334155" stroke={INK} strokeWidth={2} />
        <line x1={0} y1={-130} x2={-80} y2={-90} stroke={INK} strokeWidth={3} />
        <line x1={0} y1={-130} x2={80} y2={-90} stroke={INK} strokeWidth={3} />

        {/* Calendar Base */}
        <rect x={-140} y={-90} width={280} height={320} rx={12} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* Spiral Binder rings */}
        {[-100, -60, -20, 20, 60, 100].map((rx, i) => (
          <ellipse key={i} cx={rx} cy={-90} rx={6} ry={14} fill="#64748B" stroke={INK} strokeWidth={2.5} />
        ))}

        {/* Month Header Banner */}
        <rect x={-140} y={-70} width={280} height={80} fill={currentSeason.bg} stroke={INK} strokeWidth={4} />
        <text x={0} y={-22} fill={currentSeason.color} fontSize={32} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          {currentSeason.month}
        </text>
        <text x={0} y={0} fill={INK} fontSize={14} fontWeight="bold" fontFamily={COMIC_FONT} textAnchor="middle">
          {currentSeason.season}
        </text>

        {/* Calendar Date Grid doodle */}
        <g transform="translate(0, 70)">
          {[-80, -40, 0, 40, 80].map((gx, xi) =>
            [-30, 0, 30, 60].map((gy, yi) => (
              <circle key={`${xi}-${yi}`} cx={gx} cy={gy} r={7} fill="#E2E8F0" />
            ))
          )}
        </g>

        {/* Red Stamp: STILL THE MAGNET */}
        <g transform="translate(0, 190) rotate(-8)">
          <rect x={-120} y={-22} width={240} height={44} rx={6} fill="#FEE2E2" stroke={VICTIM_RED} strokeWidth={4} />
          <text x={0} y={7} fill={VICTIM_RED} fontSize={20} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            STILL THE MAGNET
          </text>
        </g>
      </g>

      {/* 2. Smoking Citronella Candle Beside Host */}
      <g transform="translate(420, 770)">
        {/* Candle Yellow Bucket */}
        <polygon points="-35,0 35,0 28,65 -28,65" fill="#FACC15" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <ellipse cx={0} cy={0} rx={35} ry={10} fill="#FEF08A" stroke={INK} strokeWidth={4} />
        {/* Flame */}
        <path d="M -6 -14 Q 0 -35 0 -38 Q 0 -35 6 -14 Z" fill="#F97316" stroke={INK} strokeWidth={2.5} />
        <circle cx={0} cy={-20} r={4} fill="#FEF08A" />

        {/* Dense Wavy Smoke plume rising */}
        {[-15, 0, 15].map((so, i) => {
          const sy = (frame * 2 + i * 25) % 80;
          return (
            <circle
              key={i}
              cx={Math.sin(frame * 0.15 + i) * 20 + so}
              cy={-50 - sy * 1.8}
              r={12}
              fill="#E2E8F0"
              opacity={Math.max(0, 1 - sy / 80)}
            />
          );
        })}
      </g>

      {/* 3. Host Stickman in Zen Meditation attempting "Willpower" */}
      <g transform="translate(700, 560)">
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>

        {/* Left eye clamped tight in zen concentration */}
        <path d="M -28 -8 Q -18 -18 -8 -8" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        {/* Right eye popped open in irritation, looking straight UP at mosquito on forehead! */}
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-13} r={5} fill={INK} />

        {/* Straining / Irritated Eyebrows */}
        <line x1={-30} y1={-15} x2={-10} y2={-26} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <line x1={10} y1={-32} x2={30} y2={-22} stroke={INK} strokeWidth={5} strokeLinecap="round" />

        {/* Annoyed Tense Mouth */}
        <path d="M -12 25 Q 0 16 12 22" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Sweat drops from willpower exertion */}
        <circle cx={-45} cy={-15} r={6} fill="#38BDF8" stroke={INK} strokeWidth={2} />
        <circle cx={45} cy={-15} r={6} fill="#38BDF8" stroke={INK} strokeWidth={2} />

        {/* Mental "Willpower" Energy Waves Radiating from Forehead */}
        {[30, 55, 80].map((wr, i) => (
          <path
            key={i}
            d={`M ${-wr} ${-40 - wr * 0.4} Q 0 ${-60 - wr * 0.6} ${wr} ${-40 - wr * 0.4}`}
            stroke="#8B5CF6"
            strokeWidth={4}
            strokeDasharray="8 6"
            fill="none"
            opacity={((frame + i * 15) % 30) / 30}
          />
        ))}

        {/* Cross-Legged Lotus Meditation Body */}
        <line x1={0} y1={55} x2={0} y2={185} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        {/* Crossed folded legs */}
        <path d="M -65 240 Q 0 255 65 240" stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" />
        <line x1={0} y1={185} x2={-65} y2={240} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={185} x2={65} y2={240} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Arms resting on knees in "Om" finger gesture */}
        <line x1={0} y1={95} x2={-55} y2={150} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <line x1={-55} y1={150} x2={-75} y2={220} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <circle cx={-75} cy={220} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={3} />

        <line x1={0} y1={95} x2={55} y2={150} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <line x1={55} y1={150} x2={75} y2={220} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <circle cx={75} cy={220} r={7} fill="#FFFFFF" stroke={INK} strokeWidth={3} />

        {/* 4. THE COCKY MOSQUITO LANDED RIGHT ON HIS FOREHEAD! */}
        <g transform="translate(0, -68) rotate(-12)">
          <ZennDetailedMosquito scale={0.65} facing="left" />
        </g>
        {/* Red welt expanding on forehead right under proboscis */}
        <circle cx={-10} cy={-46} r={8} fill={VICTIM_RED} />
      </g>
    </svg>
  );
};

/**
 * 🔬 BEAT 8: Scientist Mapping Gene Clusters at Lab Bench
 * Narration: "— at least until science finds a way to quiet the signal. Researchers are actually working on identifying the gene clusters behind it..."
 */
export const ZennGeneLabBenchScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* High-Tech Lab Slate Wall */}
      <rect x={0} y={0} width={1920} height={760} fill="#F1F5F9" />
      <rect x={0} y={760} width={1920} height={320} fill={LAB_WOOD_DARK} />
      <line x1={0} y1={760} x2={1920} y2={760} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Lab Bench */}
      <g transform="translate(0, 680)">
        <polygon points="0,0 1920,0 1920,80 0,80" fill={LAB_WOOD} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      </g>

      {/* 1. Large Holographic / Chalkboard Genetics Display (Center-Right) */}
      <g transform="translate(1200, 380)">
        {/* Frame */}
        <rect x={-420} y={-240} width={840} height={480} rx={16} fill="#0F172A" stroke={INK} strokeWidth={7} />
        {/* Glowing Screen Inset */}
        <rect x={-405} y={-225} width={810} height={450} rx={10} fill="#1E293B" />

        {/* Display Title */}
        <text x={0} y={-175} fill="#38BDF8" fontSize={24} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          OLFACTORY RECEPTOR GENE CLUSTERS
        </text>
        <line x1={-350} y1={-150} x2={350} y2={-150} stroke="#334155" strokeWidth={3} />

        {/* Mapped Gene Clusters Blocks */}
        {/* Gene 1: Orco (Emerald) */}
        <g transform="translate(-240, -80)">
          <rect x={-90} y={-40} width={180} height={80} rx={10} fill="#065F46" stroke="#10B981" strokeWidth={4} />
          <text x={0} y={-5} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            Orco
          </text>
          <text x={0} y={22} fill="#A7F3D0" fontSize={13} fontWeight="bold" textAnchor="middle">
            CORE CO-RECEPTOR
          </text>
        </g>

        {/* Gene 2: Ir76b (Amber) */}
        <g transform="translate(0, -80)">
          <rect x={-90} y={-40} width={180} height={80} rx={10} fill="#78350F" stroke="#F59E0B" strokeWidth={4} />
          <text x={0} y={-5} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            Ir76b
          </text>
          <text x={0} y={22} fill="#FDE68A" fontSize={13} fontWeight="bold" textAnchor="middle">
            ACID SENSOR
          </text>
        </g>

        {/* Gene 3: AgOR1 (Cyan) */}
        <g transform="translate(240, -80)">
          <rect x={-90} y={-40} width={180} height={80} rx={10} fill="#075985" stroke="#38BDF8" strokeWidth={4} />
          <text x={0} y={-5} fill="#FFFFFF" fontSize={24} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            AgOR1
          </text>
          <text x={0} y={22} fill="#BAE6FD" fontSize={13} fontWeight="bold" textAnchor="middle">
            SWEAT ODOR
          </text>
        </g>

        {/* Gene Cluster #4 (Under Active Investigation with Question Mark) */}
        <g transform="translate(0, 90)">
          <rect
            x={-180}
            y={-45}
            width={360}
            height={90}
            rx={12}
            fill="#831843"
            stroke="#F43F5E"
            strokeWidth={4.5}
            strokeDasharray={((frame % 30) > 15) ? '12 6' : 'none'}
          />
          <text x={0} y={-8} fill="#FFFFFF" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            GENE CLUSTER #4 (?)
          </text>
          <text x={0} y={20} fill="#FBCFE8" fontSize={14} fontWeight="bold" textAnchor="middle">
            TARGETED SIGNAL SILENCING
          </text>
        </g>

        {/* Chemical formulas & doodle connections */}
        <text x={-260} y={150} fill="#94A3B8" fontSize={14} fontFamily="monospace">
          CH3(CH2)14COOH (Carboxylic)
        </text>
        <text x={260} y={150} fill="#94A3B8" fontSize={14} fontFamily="monospace">
          C3H6O3 (L-Lactic Acid)
        </text>
      </g>

      {/* 2. Scientist Stickman at Microscope (Left) */}
      <g transform="translate(480, 520)">
        {/* Head */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {/* Round Glasses */}
        <circle cx={-18} cy={-4} r={18} fill="none" stroke={INK} strokeWidth={4.5} />
        <circle cx={18} cy={-4} r={18} fill="none" stroke={INK} strokeWidth={4.5} />
        <line x1={-1} y1={-4} x2={1} y2={-4} stroke={INK} strokeWidth={3.5} />
        {/* Eyes intently studying slide */}
        <circle cx={12} cy={-2} r={4.5} fill={INK} />
        <circle cx={-12} cy={-2} r={4.5} fill={INK} />
        <line x1={-25} y1={-24} x2={-6} y2={-20} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={6} y1={-20} x2={25} y2={-24} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        {/* Concentrating mouth */}
        <ellipse cx={0} cy={22} rx={6} ry={4} fill={INK} />

        {/* Lab Coat Body */}
        <path d="M -28 52 L -40 180 L 40 180 L 28 52 Z" fill="#FFFFFF" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
        <line x1={0} y1={52} x2={0} y2={180} stroke={INK} strokeWidth={3.5} />

        {/* Scientist Arm holding microscope knob */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={25} y1={80} x2={90} y2={110} />
          <line x1={90} y1={110} x2={130} y2={90} />
        </g>
      </g>

      {/* 3. Hand-Drawn Brass & Slate Microscope on Bench */}
      <g transform="translate(680, 620)">
        {/* Heavy Horseshoe Base */}
        <path d="M -45 60 C -60 60 -50 0 -20 0 L 20 0 C 50 0 60 60 45 60 Z" fill="#334155" stroke={INK} strokeWidth={5} />
        {/* Stage */}
        <rect x={-40} y={-10} width={80} height={14} rx={2} fill="#1E293B" stroke={INK} strokeWidth={3.5} />
        <rect x={-25} y={-14} width={50} height={4} fill="#BAE6FD" />
        {/* Pillar & Arm */}
        <path d="M -20 0 C -50 -40 -30 -110 0 -110" stroke="#334155" strokeWidth={14} fill="none" strokeLinecap="round" />
        <path d="M -20 0 C -50 -40 -30 -110 0 -110" stroke={INK} strokeWidth={4} fill="none" />
        {/* Optical Tube & Eyepiece */}
        <g transform="translate(0, -110) rotate(-20)">
          <rect x={-14} y={-60} width={28} height={100} rx={4} fill="#FACC15" stroke={INK} strokeWidth={4} />
          {/* Eyepiece */}
          <rect x={-18} y={-80} width={36} height={20} rx={3} fill="#1E293B" stroke={INK} strokeWidth={3.5} />
          {/* Objective Lenses */}
          <polygon points="-10,40 10,40 6,65 -6,65" fill="#94A3B8" stroke={INK} strokeWidth={3} />
        </g>
      </g>
    </svg>
  );
};

/**
 * 🎛️ BEAT 9: "Skin Broadcast" Volume Dial Turning to MUTE & Peace
 * Narration: "...hoping to one day build something that can turn the broadcast down. We're not there yet. But it's coming."
 */
export const ZennVolumeSliderMuteScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Volume slider animated from 100% down to 0% (frame 20 to 90)
  const volumeProgress = interpolate(frame, [20, 85], [1.0, 0.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const isMuted = volumeProgress === 0;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Living Room Environment */}
      <rect x={0} y={0} width={1920} height={750} fill={WALL_OCHRE} />
      <rect x={0} y={750} width={1920} height={330} fill={FLOOR_UMBER} />
      {/* Table supporting the console */}
      <g transform="translate(0, 700)">
        <rect x={880} y={0} width={760} height={40} rx={4} fill={LAB_WOOD} stroke={INK} strokeWidth={5} />
        <rect x={940} y={40} width={50} height={200} fill={LAB_WOOD_DARK} stroke={INK} strokeWidth={5} />
        <rect x={1550} y={40} width={50} height={200} fill={LAB_WOOD_DARK} stroke={INK} strokeWidth={5} />
      </g>

      {/* 1. Giant Hand-Drawn Audio / Broadcast Console (Center-Right) */}
      <g transform="translate(1260, 480)">
        {/* Outer Wooden / Brushed Metal Case */}
        <rect x={-360} y={-220} width={720} height={440} rx={22} fill="#1E293B" stroke={INK} strokeWidth={7} />
        <rect x={-340} y={-200} width={680} height={400} rx={14} fill="#0F172A" />

        {/* Console Header */}
        <text x={0} y={-140} fill="#FACC15" fontSize={32} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          SKIN BROADCAST LEVEL
        </text>

        {/* Fader Track */}
        <g transform="translate(0, -10)">
          {/* Track Slot */}
          <rect x={-260} y={-14} width={520} height={28} rx={14} fill="#000000" stroke="#334155" strokeWidth={3} />
          {/* Level Fill Bar */}
          <rect
            x={-255}
            y={-10}
            width={Math.max(10, 510 * volumeProgress)}
            height={20}
            rx={10}
            fill={volumeProgress > 0.4 ? '#EF4444' : '#10B981'}
          />

          {/* Tick Labels */}
          <g transform="translate(0, 55)">
            <text x={-250} y={0} fill="#10B981" fontSize={20} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
              0% (MUTE)
            </text>
            <text x={-125} y={0} fill="#94A3B8" fontSize={16} fontWeight="bold" textAnchor="middle">
              25%
            </text>
            <text x={0} y={0} fill="#94A3B8" fontSize={16} fontWeight="bold" textAnchor="middle">
              50%
            </text>
            <text x={125} y={0} fill="#94A3B8" fontSize={16} fontWeight="bold" textAnchor="middle">
              75%
            </text>
            <text x={250} y={0} fill="#EF4444" fontSize={20} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
              MAX
            </text>
          </g>

          {/* Slider Fader Knob */}
          {(() => {
            const knobX = interpolate(volumeProgress, [0, 1], [-250, 250]);
            return (
              <g transform={`translate(${knobX}, 0)`}>
                <rect x={-22} y={-45} width={44} height={90} rx={8} fill="#E2E8F0" stroke={INK} strokeWidth={4.5} />
                <line x1={-15} y1={0} x2={15} y2={0} stroke={INK} strokeWidth={4} />
                <line x1={-15} y1={-15} x2={15} y2={-15} stroke="#94A3B8" strokeWidth={2.5} />
                <line x1={-15} y1={15} x2={15} y2={15} stroke="#94A3B8" strokeWidth={2.5} />

                {/* Hand reaching in to slide knob down */}
                <g transform="translate(20, 10)">
                  <path d="M 0 0 L 80 40" stroke="#FDBA74" strokeWidth={26} strokeLinecap="round" />
                  <circle cx={8} cy={0} r={14} fill="#FDBA74" stroke={INK} strokeWidth={3.5} />
                </g>
              </g>
            );
          })()}
        </g>

        {/* Status Indicator Lights at Bottom of Console */}
        <g transform="translate(0, 130)">
          {/* Mute Indicator Lamp */}
          <circle cx={-120} cy={0} r={18} fill={isMuted ? '#22C55E' : '#14532D'} stroke={INK} strokeWidth={3.5} />
          {isMuted && <circle cx={-120} cy={0} r={28} fill="#22C55E" opacity={0.35} />}
          <text x={-85} y={6} fill={isMuted ? '#22C55E' : '#64748B'} fontSize={20} fontWeight="900" fontFamily={COMIC_FONT}>
            MUTED
          </text>

          {/* Active Broadcast Lamp */}
          <circle cx={80} cy={0} r={18} fill={!isMuted ? '#EF4444' : '#7F1D1D'} stroke={INK} strokeWidth={3.5} />
          <text x={115} y={6} fill={!isMuted ? '#EF4444' : '#64748B'} fontSize={20} fontWeight="900" fontFamily={COMIC_FONT}>
            BROADCAST
          </text>
        </g>
      </g>

      {/* 2. Host Stickman Standing in Complete Bliss / Peace (Left) */}
      <g transform="translate(480, 520)">
        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>
        {/* Blissful Closed Eyes "^  ^" */}
        <path d="M -28 -6 Q -18 -20 -8 -6" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        <path d="M 8 -6 Q 18 -20 28 -6" stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        {/* Peaceful Grin */}
        <path d="M -16 22 Q 0 38 16 22" stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Royal Blue T-Shirt */}
        <rect x={-34} y={55} width={68} height={130} rx={6} fill="#2563EB" stroke={INK} strokeWidth={5} />
        <line x1={-18} y1={185} x2={-18} y2={300} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={18} y1={185} x2={18} y2={300} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Hands proudly resting on hips */}
        <g stroke={INK} strokeWidth={5.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={-34} y1={80} x2={-75} y2={125} />
          <line x1={-75} y1={125} x2={-40} y2={155} />
          <line x1={34} y1={80} x2={75} y2={125} />
          <line x1={75} y1={125} x2={40} y2={155} />
        </g>
      </g>

      {/* 3. Confused Mosquitoes Flying Away */}
      {isMuted ? (
        <g>
          {/* Confused Mosquito 1 flying away off screen */}
          <g transform={`translate(${850 + frame * 3}, ${240 + Math.sin(frame * 0.2) * 20}) rotate(-35)`}>
            <ZennDetailedMosquito scale={1.2} facing="right" />
            <text x={0} y={-25} fill="#EF4444" fontSize={28} fontWeight="900" fontFamily={COMIC_FONT}>
              ???
            </text>
          </g>

          {/* Confused Mosquito 2 spinning around */}
          <g transform={`translate(${1020 + frame * 2.5}, ${160 + Math.cos(frame * 0.25) * 15}) rotate(-20)`}>
            <ZennDetailedMosquito scale={1.0} facing="right" />
            <text x={0} y={-20} fill="#EF4444" fontSize={24} fontWeight="900" fontFamily={COMIC_FONT}>
              ?
            </text>
          </g>
        </g>
      ) : (
        /* Still hovering while volume is turning down */
        <g transform={`translate(${820}, ${260 + Math.sin(frame * 0.2) * 15})`}>
          <ZennDetailedMosquito scale={1.1} facing="left" />
        </g>
      )}

      {/* Subtle Comic Label at Bottom: "IT'S COMING." */}
      <g transform="translate(960, 980)">
        <text x={0} y={0} fill="#FFFFFF" fontSize={32} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          "WE'RE NOT THERE YET. BUT IT'S COMING."
        </text>
      </g>
    </svg>
  );
};
