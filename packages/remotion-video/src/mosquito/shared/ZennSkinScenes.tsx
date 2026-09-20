import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import {
  INK,
  WALL_OCHRE,
  FLOOR_UMBER,
  MOSQUITO_BODY,
  MOSQUITO_WING,
  VICTIM_RED,
  ZennDetailedMosquito,
} from './ZennMasterComponents';

/**
 * 🎨 Shared Hand-Drawn Comic Typography Style
 */
const COMIC_FONT = "'Comic Sans MS', 'Chalkboard SE', 'Comic Neue', cursive, sans-serif";

/**
 * 🔬 SCENE 1: Macro Descent & Circular Skin Lens (Beat 1: 0 - 156f)
 * "Once she's close, she picks up something even more personal: your skin."
 */
export const ZennSkinMacroDescentScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Mosquito lands at frame 45
  const landingProgress = Math.min(Math.max(frame / 45, 0), 1);
  const mosX = interpolate(landingProgress, [0, 1], [1450, 960]);
  const mosY = interpolate(landingProgress, [0, 1], [220, 570]);
  const mosRot = interpolate(landingProgress, [0, 0.7, 1], [-20, 10, 0]);

  // Circular lens zoom begins at frame 55
  const zoomProgress = Math.min(Math.max((frame - 55) / 45, 0), 1);
  const lensRadius = interpolate(zoomProgress, [0, 1], [0, 340]);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      <defs>
        <clipPath id="skinLensClip">
          <circle cx={960} cy={540} r={lensRadius} />
        </clipPath>
      </defs>

      {/* 1. Base Environment: Doctor/Lab Room */}
      <rect x={0} y={0} width={1920} height={700} fill="#FAF7F2" />
      <rect x={0} y={700} width={1920} height={380} fill="#E2D4BF" />
      <line x1={0} y1={700} x2={1920} y2={700} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Lab Desk Lamp in Background */}
      <g transform="translate(320, 480)">
        <path d="M 0 220 L 50 220 L 40 200 L -10 200 Z" fill="#64748B" stroke={INK} strokeWidth={4} />
        <path d="M 20 200 L -20 80 L 40 -20" stroke={INK} strokeWidth={6} strokeLinecap="round" fill="none" />
        <circle cx={40} cy={-20} r={18} fill="#94A3B8" stroke={INK} strokeWidth={4} />
        <polygon points="40,-35 120,-80 140,-30 55,-5" fill="#F59E0B" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
        {/* Warm light cone */}
        <polygon points="120,-80 140,-30 450,220 280,220" fill="#FEF3C7" opacity={0.35} />
      </g>

      {/* Wooden Table surface */}
      <polygon points="200,660 1720,660 1780,850 140,850" fill="#C2A478" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <line x1={200} y1={660} x2={1720} y2={660} stroke={INK} strokeWidth={5} />

      {/* Forearm resting horizontally across table */}
      <g transform="translate(960, 680)">
        {/* Forearm skin contour */}
        <path
          d="M -540 -30 Q -200 -70 200 -50 Q 420 -35 560 -20 L 580 90 Q 300 110 -200 90 L -540 80 Z"
          fill="#FED7AA"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* Hand resting on right */}
        <path
          d="M 560 -20 Q 640 -30 690 10 Q 710 45 680 75 Q 630 95 580 90 Z"
          fill="#FED7AA"
          stroke={INK}
          strokeWidth={5.5}
        />
        {/* Sleeve cuff on left */}
        <path
          d="M -580 -45 L -520 -32 L -520 95 L -580 105 Z"
          fill="#3B82F6"
          stroke={INK}
          strokeWidth={5.5}
          strokeLinejoin="round"
        />
        {/* Subtle skin creases and hair follicles */}
        <path d="M -300 20 Q -270 25 -240 20" stroke="#FDBA74" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        <path d="M 50 15 Q 90 22 130 15" stroke="#FDBA74" strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {[-380, -220, -60, 100, 260, 420].map((fx, i) => (
          <line
            key={i}
            x1={fx}
            y1={-30 + (i % 2) * 15}
            x2={fx + 25}
            y2={-65 + (i % 2) * 15}
            stroke="#78350F"
            strokeWidth={2.5}
            strokeLinecap="round"
          />
        ))}
      </g>

      {/* Flying / Landing Mosquito */}
      {frame < 85 && (
        <g transform={`translate(${mosX}, ${mosY}) rotate(${mosRot})`}>
          <ZennDetailedMosquito scale={1.3} facing="left" />
        </g>
      )}

      {/* 2. Microscopic Circular Zoom Lens Transition */}
      {zoomProgress > 0 && (
        <g>
          {/* Circular Lens Content */}
          <g clipPath="url(#skinLensClip)">
            {/* Peach microscopic skin landscape */}
            <rect x={0} y={0} width={1920} height={1080} fill="#FFF7ED" />

            {/* Undulating epidermal terrain */}
            <path
              d="M 500 680 Q 750 630 960 660 Q 1180 690 1450 640 L 1450 1000 L 500 1000 Z"
              fill="#FED7AA"
              stroke={INK}
              strokeWidth={7}
            />
            <path
              d="M 500 740 Q 800 720 1050 750 Q 1300 730 1450 760 L 1450 1000 L 500 1000 Z"
              fill="#FDBA74"
              stroke={INK}
              strokeWidth={5}
            />

            {/* Pores with golden sebum droplets */}
            {[
              { x: 820, y: 650 },
              { x: 960, y: 660 },
              { x: 1100, y: 670 },
            ].map((p, i) => (
              <g key={i} transform={`translate(${p.x}, ${p.y})`}>
                <ellipse cx={0} cy={0} rx={22} ry={10} fill="#C2410C" stroke={INK} strokeWidth={3.5} />
                <ellipse cx={-4} cy={-2} rx={12} ry={5} fill="#EA580C" />
                <circle cx={-2} cy={-3} r={3} fill="#FEF08A" />
              </g>
            ))}

            {/* Tall swaying hair shafts */}
            {[-180, -40, 120].map((hx, i) => {
              const hairSway = Math.sin(frame * 0.12 + i * 2) * 16;
              return (
                <path
                  key={i}
                  d={`M ${960 + hx} 660 Q ${960 + hx + 30 + hairSway} 420 ${960 + hx + 80 + hairSway * 1.5} 240`}
                  fill="none"
                  stroke="#78350F"
                  strokeWidth={12}
                  strokeLinecap="round"
                />
              );
            })}

            {/* Giant Mosquito Legs Standing on Microscopic Skin */}
            <g transform="translate(960, 480)">
              {/* Mosquito Head & Proboscis zoomed in */}
              <ZennDetailedMosquito scale={2.8} facing="left" />
            </g>

            {/* Microscopic golden scent sparkles */}
            {[0, 1, 2, 3, 4].map((s) => {
              const spX = 960 + Math.sin(frame * 0.15 + s * 1.5) * 160;
              const spY = 560 - ((frame * 2 + s * 30) % 180);
              return (
                <polygon
                  key={s}
                  points={`${spX},${spY - 10} ${spX + 3},${spY - 3} ${spX + 10},${spY} ${spX + 3},${spY + 3} ${spX},${spY + 10} ${spX - 3},${spY + 3} ${spX - 10},${spY} ${spX - 3},${spY - 3}`}
                  fill="#F59E0B"
                  stroke={INK}
                  strokeWidth={1.5}
                />
              );
            })}
          </g>

          {/* Heavy Inked Circular Lens Frame */}
          <circle cx={960} cy={540} r={lensRadius} fill="none" stroke={INK} strokeWidth={12} />
          <circle cx={960} cy={540} r={lensRadius - 8} fill="none" stroke="#FFFFFF" strokeWidth={5} opacity={0.6} />

          {/* Glass glare crescent */}
          <path
            d={`M ${960 - lensRadius * 0.7} ${540 - lensRadius * 0.5} A ${lensRadius * 0.85} ${lensRadius * 0.85} 0 0 1 ${960 + lensRadius * 0.2} ${540 - lensRadius * 0.8}`}
            stroke="#FFFFFF"
            strokeWidth={14}
            strokeLinecap="round"
            fill="none"
            opacity={0.65}
          />
        </g>
      )}
    </svg>
  );
};

/**
 * 🦠 SCENE 2: Microscopic Skin Surface: 1-5 Million Bacteria (Beat 2: 156 - 312f)
 * "Human skin hosts 1 to 5 million bacteria per square centimeter."
 */
export const ZennSkinMicrobiomeLandscapeScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Warm Microscopic Environment Background */}
      <rect x={0} y={0} width={1920} height={1080} fill="#FFFBEB" />

      {/* Distant Out-of-Focus Microbe Colonies (Depth) */}
      {[
        { x: 300, y: 320, r: 55, c: '#BBF7D0' },
        { x: 600, y: 260, r: 70, c: '#FED7AA' },
        { x: 1250, y: 300, r: 65, c: '#BAE6FD' },
        { x: 1600, y: 340, r: 80, c: '#FDE68A' },
      ].map((bg, idx) => (
        <circle key={idx} cx={bg.x} cy={bg.y} r={bg.r} fill={bg.c} opacity={0.4} />
      ))}

      {/* Undulating Peach Skin Surface */}
      <path
        d="M 0 740 Q 350 680 700 730 Q 1100 780 1500 710 Q 1750 680 1920 720 L 1920 1080 L 0 1080 Z"
        fill="#FED7AA"
        stroke={INK}
        strokeWidth={7}
      />
      <path
        d="M 0 830 Q 400 800 850 840 Q 1350 810 1920 850 L 1920 1080 L 0 1080 Z"
        fill="#FDBA74"
        stroke={INK}
        strokeWidth={5}
      />

      {/* Hair Shafts sprouting like trees */}
      {[
        { x: 260, curve: -40, h: 480 },
        { x: 880, curve: 35, h: 520 },
        { x: 1540, curve: -50, h: 500 },
      ].map((hair, i) => {
        const sway = Math.sin(frame * 0.1 + i * 2) * 14;
        return (
          <g key={i}>
            {/* Hair pore ring */}
            <ellipse cx={hair.x} cy={740} rx={35} ry={14} fill="#9A3412" stroke={INK} strokeWidth={4} />
            {/* Hair shaft */}
            <path
              d={`M ${hair.x} 740 Q ${hair.x + hair.curve + sway} ${740 - hair.h * 0.5} ${hair.x + hair.curve * 1.8 + sway * 1.5} ${740 - hair.h}`}
              fill="none"
              stroke="#78350F"
              strokeWidth={18}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* 2. Swarm of Cute Cartoon Bacteria Blobs Living & Bouncing */}
      {[
        { x: 220, y: 710, col: '#10B981', r: 42, label: 'Staph' },
        { x: 410, y: 690, col: '#3B82F6', r: 38, label: 'Coryne' },
        { x: 580, y: 720, col: '#F59E0B', r: 48, label: 'Micrococcus' },
        { x: 740, y: 700, col: '#EC4899', r: 36, label: 'Propioni' },
        { x: 1040, y: 710, col: '#8B5CF6', r: 46, label: 'Brevibacterium' },
        { x: 1220, y: 680, col: '#10B981', r: 40, label: 'Staph' },
        { x: 1400, y: 720, col: '#F59E0B', r: 44, label: 'Coryne' },
        { x: 1700, y: 690, col: '#06B6D4', r: 50, label: 'Micrococcus' },
      ].map((bac, idx) => {
        const bounce = Math.sin(frame * 0.25 + idx * 1.4) * 16;
        const wiggle = Math.sin(frame * 0.3 + idx) * 8;
        return (
          <g key={idx} transform={`translate(${bac.x + wiggle}, ${bac.y + bounce})`}>
            {/* Bacteria Body */}
            <circle cx={0} cy={0} r={bac.r} fill={bac.col} stroke={INK} strokeWidth={5} />
            {/* Cute Cartoon Eyes */}
            <circle cx={-bac.r * 0.3} cy={-4} r={bac.r * 0.22} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
            <circle cx={-bac.r * 0.3 + 1} cy={-4} r={bac.r * 0.1} fill={INK} />
            <circle cx={bac.r * 0.3} cy={-4} r={bac.r * 0.22} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
            <circle cx={bac.r * 0.3 - 1} cy={-4} r={bac.r * 0.1} fill={INK} />
            {/* Happy Smile */}
            <path
              d={`M ${-bac.r * 0.25} ${bac.r * 0.28} Q 0 ${bac.r * 0.55} ${bac.r * 0.25} ${bac.r * 0.28}`}
              stroke={INK}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
            />
            {/* Rosy Cheeks */}
            <ellipse cx={-bac.r * 0.45} cy={bac.r * 0.18} rx={6} ry={3} fill="#FDA4AF" opacity={0.7} />
            <ellipse cx={bac.r * 0.45} cy={bac.r * 0.18} rx={6} ry={3} fill="#FDA4AF" opacity={0.7} />
            {/* Little dancing nub arms */}
            <path
              d={`M ${-bac.r} 0 Q ${-bac.r - 18} ${-12 + bounce * 0.5} ${-bac.r - 10} -20`}
              stroke={INK}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M ${bac.r} 0 Q ${bac.r + 18} ${-12 - bounce * 0.5} ${bac.r + 10} -20`}
              stroke={INK}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* Extra Tiny Microbe Swarm Dots (Representing Millions) */}
      {Array.from({ length: 28 }).map((_, i) => {
        const dotX = 120 + ((i * 65) % 1700);
        const dotY = 640 + ((i * 37) % 180) + Math.sin(frame * 0.2 + i) * 6;
        const col = ['#10B981', '#3B82F6', '#F59E0B', '#EC4899', '#8B5CF6'][i % 5];
        return (
          <circle key={i} cx={dotX} cy={dotY} r={8 + (i % 6)} fill={col} stroke={INK} strokeWidth={2} />
        );
      })}

      {/* 3. Small Hand-Drawn Comic Label on Wooden Signpost */}
      <g transform="translate(960, 220)">
        {/* Wooden Signpost Stick */}
        <line x1={0} y1={80} x2={0} y2={460} stroke="#8D5B3A" strokeWidth={14} strokeLinecap="round" />
        <line x1={0} y1={80} x2={0} y2={460} stroke={INK} strokeWidth={18} strokeLinecap="round" opacity={0.3} />

        {/* Comic Paper Sign Board */}
        <g transform="rotate(-3)">
          <rect x={-260} y={-70} width={520} height={140} rx={16} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
          {/* Paper tape tabs */}
          <rect x={-220} y={-85} width={45} height={25} fill="#FEF08A" stroke={INK} strokeWidth={2.5} transform="rotate(-10 -220 -85)" />
          <rect x={180} y={-85} width={45} height={25} fill="#FEF08A" stroke={INK} strokeWidth={2.5} transform="rotate(8 180 -85)" />

          <text
            x={0}
            y={-10}
            fill={INK}
            fontSize={46}
            fontWeight="900"
            fontFamily={COMIC_FONT}
            textAnchor="middle"
          >
            1 TO 5 MILLION
          </text>
          <text
            x={0}
            y={42}
            fill="#D97706"
            fontSize={36}
            fontWeight="900"
            fontFamily={COMIC_FONT}
            textAnchor="middle"
          >
            BACTERIA / cm²
          </text>
        </g>
      </g>
    </svg>
  );
};

/**
 * 🎯 SCENE 3: Body Hotspots: Ankles, Feet & Wrists (Beat 3: 312 - 450f)
 * "Those bacteria — especially on your ankles, feet, and wrists — produce a cocktail of compounds:"
 */
export const ZennSkinHotspotsScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 312;

  // Pulse effect for hotspot rings
  const pulse = (relFrame * 0.15) % (Math.PI * 2);
  const pulseR1 = 28 + Math.sin(pulse) * 8;
  const pulseR2 = 46 + Math.sin(pulse + 1) * 12;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Environment: Warm Split Studio */}
      <rect x={0} y={0} width={1920} height={750} fill="#FAF7F2" />
      <rect x={0} y={750} width={1920} height={330} fill="#E2D4BF" />
      <line x1={0} y1={750} x2={1920} y2={750} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Hand-drawn vertical divider separating Body Overview & Ankle Close-up */}
      <line x1={960} y1={60} x2={960} y2={980} stroke={INK} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" />

      {/* ================================================================ */}
      {/* LEFT HALF: Stickman Full Body with Glowing Hotspot Reticles */}
      {/* ================================================================ */}
      <g transform="translate(480, 520)">
        {/* Head with 3 spiky hairs */}
        <circle cx={0} cy={-220} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-273} x2={-20} y2={-308} />
          <line x1={0} y1={-275} x2={0} y2={-316} />
          <line x1={14} y1={-273} x2={22} y2={-306} />
        </g>
        {/* Worried eyes */}
        <circle cx={-18} cy={-226} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18} cy={-226} r={5} fill={INK} />
        <circle cx={18} cy={-226} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-226} r={5} fill={INK} />
        <path d="M -12 -196 Q 0 -206 12 -196" stroke={INK} strokeWidth={3.8} fill="none" strokeLinecap="round" />

        {/* Stick Body */}
        <line x1={0} y1={-165} x2={0} y2={40} stroke={INK} strokeWidth={6.5} strokeLinecap="round" />
        {/* Arms outstretched */}
        <line x1={0} y1={-110} x2={-150} y2={-40} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={-110} x2={150} y2={-40} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        {/* Legs */}
        <line x1={0} y1={40} x2={-80} y2={240} stroke={INK} strokeWidth={6.5} strokeLinecap="round" />
        <line x1={0} y1={40} x2={80} y2={240} stroke={INK} strokeWidth={6.5} strokeLinecap="round" />

        {/* Hotspot 1: Left Wrist */}
        <g transform="translate(-150, -40)">
          <circle cx={0} cy={0} r={pulseR1} fill="#EF4444" opacity={0.3} />
          <circle cx={0} cy={0} r={pulseR2} fill="none" stroke="#EF4444" strokeWidth={3.5} strokeDasharray="8 6" />
          <circle cx={0} cy={0} r={8} fill="#EF4444" stroke={INK} strokeWidth={2} />
        </g>

        {/* Hotspot 2: Right Wrist */}
        <g transform="translate(150, -40)">
          <circle cx={0} cy={0} r={pulseR1} fill="#EF4444" opacity={0.3} />
          <circle cx={0} cy={0} r={pulseR2} fill="none" stroke="#EF4444" strokeWidth={3.5} strokeDasharray="8 6" />
          <circle cx={0} cy={0} r={8} fill="#EF4444" stroke={INK} strokeWidth={2} />
        </g>

        {/* Hotspot 3: Left Ankle & Foot */}
        <g transform="translate(-80, 200)">
          <circle cx={0} cy={0} r={pulseR1} fill="#F59E0B" opacity={0.35} />
          <circle cx={0} cy={0} r={pulseR2} fill="none" stroke="#F59E0B" strokeWidth={4} strokeDasharray="8 6" />
          <circle cx={0} cy={0} r={9} fill="#F59E0B" stroke={INK} strokeWidth={2} />
        </g>

        {/* Hotspot 4: Right Ankle & Foot */}
        <g transform="translate(80, 200)">
          <circle cx={0} cy={0} r={pulseR1} fill="#F59E0B" opacity={0.35} />
          <circle cx={0} cy={0} r={pulseR2} fill="none" stroke="#F59E0B" strokeWidth={4} strokeDasharray="8 6" />
          <circle cx={0} cy={0} r={9} fill="#F59E0B" stroke={INK} strokeWidth={2} />
        </g>

        {/* Comic labels with arrows */}
        <g transform="translate(-240, -100)">
          <rect x={-80} y={-24} width={160} height={48} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
          <text x={0} y={8} fill="#EF4444" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            WRISTS
          </text>
          <path d="M 60 24 Q 80 40 90 55" stroke={INK} strokeWidth={3} fill="none" markerEnd="url(#arrow)" />
        </g>

        <g transform="translate(0, 310)">
          <rect x={-120} y={-24} width={240} height={48} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
          <text x={0} y={8} fill="#D97706" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            ANKLES & FEET
          </text>
        </g>
      </g>

      {/* ================================================================ */}
      {/* RIGHT HALF: Close-Up of Sweaty Ankle Pumping Golden Aroma Fumes */}
      {/* ================================================================ */}
      <g transform="translate(1440, 560)">
        {/* Giant Bare Ankle & Foot on Ground */}
        {/* Foot sole on floor line */}
        <path
          d="M -160 -240 Q -150 -100 -120 40 Q -100 120 -60 170 Q 20 210 180 210 Q 240 210 240 170 Q 240 120 120 120 Q 20 110 -20 20 Q -40 -80 -40 -240 Z"
          fill="#FED7AA"
          stroke={INK}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        {/* Rolled sock edge at top */}
        <path
          d="M -180 -250 Q -100 -240 -20 -250 L -20 -210 Q -100 -200 -180 -210 Z"
          fill="#3B82F6"
          stroke={INK}
          strokeWidth={5}
        />

        {/* Ankle Bone contour */}
        <path d="M -60 50 Q -40 70 -60 90" stroke="#FDBA74" strokeWidth={5} fill="none" strokeLinecap="round" />

        {/* Sweat drops on skin */}
        {[-30, 20, 80].map((dx, i) => (
          <ellipse key={i} cx={dx} cy={110 + (i % 2) * 30} rx={6} ry={9} fill="#38BDF8" stroke={INK} strokeWidth={2} />
        ))}

        {/* Cute Bacteria Cluster camped on ankle */}
        {[
          { x: -70, y: 80, col: '#10B981', r: 24 },
          { x: -30, y: 110, col: '#F59E0B', r: 28 },
          { x: 30, y: 130, col: '#3B82F6', r: 26 },
        ].map((bac, idx) => (
          <g key={idx} transform={`translate(${bac.x}, ${bac.y})`}>
            <circle cx={0} cy={0} r={bac.r} fill={bac.col} stroke={INK} strokeWidth={4} />
            <circle cx={-6} cy={-2} r={4} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
            <circle cx={-6} cy={-2} r={2} fill={INK} />
            <circle cx={6} cy={-2} r={4} fill="#FFFFFF" stroke={INK} strokeWidth={1.5} />
            <circle cx={6} cy={-2} r={2} fill={INK} />
            <path d="M -4 6 Q 0 10 4 6" stroke={INK} strokeWidth={2} fill="none" strokeLinecap="round" />
          </g>
        ))}

        {/* Golden Aroma Fume Puffs Rising */}
        {[0, 1, 2, 3].map((fumeIdx) => {
          const fumeCycle = ((relFrame * 2 + fumeIdx * 25) % 90);
          const fumeY = 60 - fumeCycle * 3.5;
          const fumeX = -30 + Math.sin(fumeCycle * 0.1 + fumeIdx) * 35;
          const fumeOpacity = Math.max(0, 1 - fumeCycle / 90);
          return (
            <g key={fumeIdx} opacity={fumeOpacity} transform={`translate(${fumeX}, ${fumeY})`}>
              <circle cx={0} cy={0} r={14 + (fumeCycle * 0.2)} fill="#FBBF24" stroke={INK} strokeWidth={3} />
              <circle cx={-10} cy={-6} r={10} fill="#FCD34D" stroke={INK} strokeWidth={2.5} />
              <circle cx={12} cy={-4} r={8} fill="#FEF08A" stroke={INK} strokeWidth={2} />
            </g>
          );
        })}

        {/* Comic label */}
        <g transform="translate(60, -180)">
          <rect x={-140} y={-35} width={280} height={70} rx={12} fill="#FFFFFF" stroke={INK} strokeWidth={4.5} />
          <text x={0} y={8} fill={INK} fontSize={26} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            ODOR COCKTAIL ♨️
          </text>
        </g>
      </g>
    </svg>
  );
};

/**
 * 🧪 SCENE 4: Bubbling Cocktail Cloud & Scent Reaction (Beat 4: 450 - 626f)
 * "...fatty acids, lactic acid, ammonia. You can't smell this cloud. She can."
 */
export const ZennSkinCocktailCloudScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 450;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Environment: Warm Comic Chemistry Bench */}
      <rect x={0} y={0} width={1920} height={720} fill="#FAF7F2" />
      <rect x={0} y={720} width={1920} height={360} fill="#6B4D2B" />
      <line x1={0} y1={720} x2={1920} y2={720} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Wooden Shelf / Bench Top */}
      <polygon points="120,680 1800,680 1860,780 60,780" fill="#8D5B3A" stroke={INK} strokeWidth={5.5} strokeLinejoin="round" />

      {/* ================================================================ */}
      {/* 2. Three Cute Bubbling Comic Chemical Vials / Flasks */}
      {/* ================================================================ */}
      {[
        { x: 300, col: '#F59E0B', label: 'FATTY ACIDS', shape: 'flask', symbol: '🧈' },
        { x: 580, col: '#0284C7', label: 'LACTIC ACID', shape: 'cylinder', symbol: '🥛' },
        { x: 860, col: '#10B981', label: 'AMMONIA', shape: 'flask', symbol: '🧪' },
      ].map((vial, i) => {
        const bubblePhase = (relFrame * 2 + i * 20) % 50;
        return (
          <g key={i} transform={`translate(${vial.x}, 660)`}>
            {/* Wooden Test Tube Stand bracket */}
            <rect x={-45} y={-8} width={90} height={16} rx={4} fill="#583B20" stroke={INK} strokeWidth={3.5} />

            {/* Glass Container */}
            {vial.shape === 'flask' ? (
              <path
                d="M -18 -140 L 18 -140 L 18 -80 L 65 0 Q 65 20 45 20 L -45 20 Q -65 20 -65 0 L -18 -80 Z"
                fill="#FFFFFF"
                stroke={INK}
                strokeWidth={5}
                strokeLinejoin="round"
              />
            ) : (
              <path
                d="M -26 -160 L 26 -160 L 26 0 Q 26 20 0 20 Q -26 20 -26 0 Z"
                fill="#FFFFFF"
                stroke={INK}
                strokeWidth={5}
                strokeLinejoin="round"
              />
            )}

            {/* Liquid Fill Inside Glass */}
            {vial.shape === 'flask' ? (
              <path
                d="M -38 -40 Q 0 -50 38 -40 L 52 0 Q 52 14 38 14 L -38 14 Q -52 14 -52 0 Z"
                fill={vial.col}
                stroke={INK}
                strokeWidth={3}
              />
            ) : (
              <path
                d="M -20 -90 Q 0 -100 20 -90 L 20 0 Q 20 14 0 14 Q -20 14 -20 0 Z"
                fill={vial.col}
                stroke={INK}
                strokeWidth={3}
              />
            )}

            {/* Rising Bubbles */}
            <circle cx={-10} cy={-50 - bubblePhase * 1.5} r={6} fill="#FEF08A" stroke={INK} strokeWidth={2} />
            <circle cx={8} cy={-40 - ((bubblePhase + 25) % 50) * 1.5} r={4.5} fill="#FEF08A" stroke={INK} strokeWidth={1.5} />

            {/* Hand-drawn Comic Tag Label pinned below */}
            <g transform="translate(0, 60)">
              <rect x={-90} y={-20} width={180} height={40} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
              <text x={0} y={6} fill={INK} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
                {vial.label}
              </text>
            </g>
          </g>
        );
      })}

      {/* ================================================================ */}
      {/* 3. Swirling Golden Scented Cloud Merging Together */}
      {/* ================================================================ */}
      <g transform="translate(1080, 420)">
        {/* Large golden cloud puffs */}
        {[
          { cx: -80, cy: -20, r: 65 },
          { cx: -20, cy: -70, r: 75 },
          { cx: 60, cy: -40, r: 80 },
          { cx: 120, cy: 10, r: 60 },
          { cx: 30, cy: 40, r: 70 },
          { cx: -60, cy: 30, r: 60 },
        ].map((cp, idx) => (
          <circle key={idx} cx={cp.cx} cy={cp.cy} r={cp.r} fill="#FBBF24" opacity={0.65} stroke={INK} strokeWidth={4} />
        ))}
        {/* Core Cloud highlight */}
        <circle cx={20} cy={-15} r={55} fill="#FEF08A" opacity={0.8} />

        {/* Wavy scent ribbons leading into cloud */}
        <path
          d={`M -480 120 Q -300 ${-20 + Math.sin(relFrame * 0.1) * 20} -80 -20`}
          stroke="#F59E0B"
          strokeWidth={8}
          strokeDasharray="16 10"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M -200 100 Q -100 ${-80 + Math.cos(relFrame * 0.1) * 20} -20 -70`}
          stroke="#0284C7"
          strokeWidth={8}
          strokeDasharray="16 10"
          fill="none"
          strokeLinecap="round"
        />

        {/* Comic Sparkle Stars floating in cloud */}
        {[
          { x: -40, y: -80 },
          { x: 70, y: -60 },
          { x: 30, y: 30 },
          { x: 140, y: -20 },
        ].map((star, idx) => {
          const sAngle = (relFrame * 2 + idx * 45) * (Math.PI / 180);
          return (
            <polygon
              key={idx}
              points={`${star.x},${star.y - 12} ${star.x + 4},${star.y - 4} ${star.x + 12},${star.y} ${star.x + 4},${star.y + 4} ${star.x},${star.y + 12} ${star.x - 4},${star.y + 4} ${star.x - 12},${star.y} ${star.x - 4},${star.y - 4}`}
              fill="#FFFFFF"
              stroke={INK}
              strokeWidth={2}
              transform={`rotate(${Math.sin(sAngle) * 30} ${star.x} ${star.y})`}
            />
          );
        })}
      </g>

      {/* ================================================================ */}
      {/* 4. Comic Reaction Split: Host (Can't Smell) vs Mosquito (Loves It!) */}
      {/* ================================================================ */}

      {/* Host Stickman: Sniffing Air, Completely Oblivious */}
      <g transform="translate(1080, 680)">
        {/* Head */}
        <circle cx={0} cy={-160} r={50} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
        {/* 3 Spiky hairs */}
        <g stroke={INK} strokeWidth={4.5} strokeLinecap="round">
          <line x1={-12} y1={-208} x2={-16} y2={-238} />
          <line x1={0} y1={-210} x2={0} y2={-246} />
          <line x1={12} y1={-208} x2={18} y2={-236} />
        </g>
        {/* Oblivious Neutral Face */}
        <circle cx={-14} cy={-165} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
        <circle cx={-14} cy={-165} r={4} fill={INK} />
        <circle cx={14} cy={-165} r={12} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
        <circle cx={14} cy={-165} r={4} fill={INK} />
        <line x1={-22} y1={-182} x2={-6} y2={-182} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        <line x1={6} y1={-182} x2={22} y2={-182} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        {/* Neutral flat mouth with sniffing nostril dots */}
        <line x1={-10} y1={-135} x2={10} y2={-135} stroke={INK} strokeWidth={3} strokeLinecap="round" />
        <circle cx={-4} cy={-145} r={2} fill={INK} />
        <circle cx={4} cy={-145} r={2} fill={INK} />

        {/* Sniff sound waves */}
        <path d="M 0 -120 Q 0 -105 -15 -95" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        <path d="M 0 -120 Q 0 -105 15 -95" stroke={INK} strokeWidth={2.5} fill="none" strokeLinecap="round" />

        {/* Body & Shrugging Hand */}
        <line x1={0} y1={-110} x2={0} y2={50} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
        <line x1={0} y1={-60} x2={-45} y2={-10} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <line x1={-45} y1={-10} x2={-75} y2={-35} stroke={INK} strokeWidth={5} strokeLinecap="round" />

        {/* Comic Question Mark */}
        <text x={45} y={-180} fill={INK} fontSize={46} fontWeight="900" fontFamily={COMIC_FONT}>
          ?
        </text>
        {/* Hand-drawn comic label */}
        <g transform="translate(0, 95)">
          <rect x={-110} y={-20} width={220} height={40} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
          <text x={0} y={6} fill="#64748B" fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            YOU: CAN'T SMELL IT 👃❌
          </text>
        </g>
      </g>

      {/* Mosquito: Twitching Antennae with Alert Hearts & Joy! */}
      <g transform="translate(1620, 360)">
        <ZennDetailedMosquito scale={1.8} facing="left" />

        {/* Electric Alert Zaps at Antennae */}
        {[-35, -15].map((ax, i) => (
          <path
            key={i}
            d={`M ${ax} -30 L ${ax - 10} -50 L ${ax + 5} -55 L ${ax - 5} -75`}
            stroke="#EF4444"
            strokeWidth={3.5}
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* Heart Eyes Indicator */}
        <g transform="translate(-100, -80)">
          <path
            d="M 0 0 C -15 -18 -35 5 0 35 C 35 5 15 -18 0 0 Z"
            fill="#EC4899"
            stroke={INK}
            strokeWidth={3}
          />
          <text x={0} y={65} fill="#EC4899" fontSize={26} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            SHE CAN! 🎯
          </text>
        </g>
      </g>
    </svg>
  );
};

/**
 * 🧫 SCENE 5: Low Diversity vs High Diversity Disco Party (Beat 5: 626 - 794f)
 * "And here's the frustrating part: the people with the richest, most diverse skin bacteria are the most attractive to mosquitoes."
 */
export const ZennSkinDiversityPartyScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 626;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Center Split Screen Line */}
      <line x1={960} y1={0} x2={960} y2={1080} stroke={INK} strokeWidth={6} strokeDasharray="16 12" />

      {/* ================================================================ */}
      {/* LEFT SIDE: Low Diversity — Boring Arm (Mosquito Ignores) */}
      {/* ================================================================ */}
      <rect x={0} y={0} width={960} height={1080} fill="#F1F5F9" />

      {/* Floor line */}
      <line x1={0} y1={820} x2={960} y2={820} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Friend's Arm lying flat & boring */}
      <g transform="translate(480, 720)">
        <path
          d="M -360 0 Q -100 -30 200 -20 L 360 0 L 360 90 L -360 90 Z"
          fill="#FED7AA"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />

        {/* Only 1 Sad Lone Bacteria Sitting Alone */}
        <g transform="translate(-40, -40)">
          <circle cx={0} cy={0} r={36} fill="#94A3B8" stroke={INK} strokeWidth={4.5} />
          {/* Sad Sleepy Eyes */}
          <line x1={-16} y1={-6} x2={-4} y2={-2} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          <line x1={4} y1={-2} x2={16} y2={-6} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
          {/* Frown */}
          <path d="M -8 16 Q 0 8 8 16" stroke={INK} strokeWidth={3} fill="none" strokeLinecap="round" />
          {/* Sleep Zzz */}
          <text x={35} y={-20} fill="#64748B" fontSize={26} fontWeight="900" fontFamily={COMIC_FONT}>
            Zzz...
          </text>
        </g>
      </g>

      {/* Mosquito Flying Overhead turning away with Grey X */}
      <g transform="translate(480, 320)">
        <ZennDetailedMosquito scale={1.2} facing="right" />
        {/* Giant Grey X over friend */}
        <g transform="translate(-140, 20)">
          <line x1={-35} y1={-35} x2={35} y2={35} stroke="#94A3B8" strokeWidth={8} strokeLinecap="round" />
          <line x1={35} y1={-35} x2={-35} y2={35} stroke="#94A3B8" strokeWidth={8} strokeLinecap="round" />
        </g>
      </g>

      {/* Comic Header Label: Left */}
      <g transform="translate(480, 120)">
        <rect x={-220} y={-35} width={440} height={70} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={4.5} />
        <text x={0} y={8} fill="#64748B" fontSize={26} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          LOW DIVERSITY: IGNORED 💤
        </text>
      </g>

      {/* ================================================================ */}
      {/* RIGHT SIDE: Rich Diversity — Disco Party Arm (Mosquito Magnet!) */}
      {/* ================================================================ */}
      <rect x={960} y={0} width={960} height={1080} fill="#FFFBEB" />

      {/* Floor line */}
      <line x1={960} y1={820} x2={1920} y2={820} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Host's Arm: Bustling Microbe Metropolis */}
      <g transform="translate(1440, 720)">
        <path
          d="M -360 0 Q -100 -30 200 -20 L 360 0 L 360 90 L -360 90 Z"
          fill="#FED7AA"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />

        {/* 6 Diverse Dancing Bacteria with Party Hats! */}
        {[
          { x: -240, y: -45, col: '#10B981', r: 32, hat: '#EF4444' },
          { x: -140, y: -65, col: '#F59E0B', r: 38, hat: '#3B82F6' },
          { x: -30, y: -50, col: '#3B82F6', r: 35, hat: '#FACC15' },
          { x: 80, y: -70, col: '#EC4899', r: 40, hat: '#10B981' },
          { x: 190, y: -45, col: '#8B5CF6', r: 34, hat: '#F97316' },
          { x: 280, y: -60, col: '#06B6D4', r: 36, hat: '#EC4899' },
        ].map((pBac, idx) => {
          const bJump = Math.sin(relFrame * 0.35 + idx * 1.5) * 18;
          return (
            <g key={idx} transform={`translate(${pBac.x}, ${pBac.y + bJump})`}>
              {/* Bacteria Body */}
              <circle cx={0} cy={0} r={pBac.r} fill={pBac.col} stroke={INK} strokeWidth={4.5} />
              {/* Happy Cartoon Eyes */}
              <circle cx={-pBac.r * 0.3} cy={-4} r={pBac.r * 0.22} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
              <circle cx={-pBac.r * 0.3} cy={-4} r={pBac.r * 0.1} fill={INK} />
              <circle cx={pBac.r * 0.3} cy={-4} r={pBac.r * 0.22} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
              <circle cx={pBac.r * 0.3} cy={-4} r={pBac.r * 0.1} fill={INK} />
              {/* Wide Happy Grin */}
              <path
                d={`M ${-pBac.r * 0.3} ${pBac.r * 0.3} Q 0 ${pBac.r * 0.7} ${pBac.r * 0.3} ${pBac.r * 0.3}`}
                stroke={INK}
                strokeWidth={2.5}
                fill="#FFFFFF"
              />

              {/* Tiny Party Cone Hat! */}
              <polygon
                points={`0,${-pBac.r - 28} ${-14},${-pBac.r + 2} ${14},${-pBac.r + 2}`}
                fill={pBac.hat}
                stroke={INK}
                strokeWidth={2.5}
              />
              <circle cx={0} cy={-pBac.r - 28} r={4} fill="#FEF08A" />

              {/* Little waving party arms */}
              <path d={`M ${-pBac.r} 0 L ${-pBac.r - 12} -18`} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
              <path d={`M ${pBac.r} 0 L ${pBac.r + 12} -18`} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
            </g>
          );
        })}

        {/* Falling Party Confetti */}
        {Array.from({ length: 18 }).map((_, i) => {
          const cX = -320 + ((i * 38) % 650);
          const cY = -220 + ((i * 47 + relFrame * 2) % 220);
          const cCol = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#EC4899'][i % 5];
          return (
            <rect
              key={i}
              x={cX}
              y={cY}
              width={10}
              height={10}
              fill={cCol}
              stroke={INK}
              strokeWidth={1.5}
              transform={`rotate(${i * 35 + relFrame * 2} ${cX} ${cY})`}
            />
          );
        })}
      </g>

      {/* 2 Mosquitoes Dive-Bombing In with Red Target Vectors */}
      <g transform={`translate(${1440 + Math.sin(relFrame * 0.1) * 40}, ${320 + Math.cos(relFrame * 0.15) * 20})`}>
        <ZennDetailedMosquito scale={1.4} facing="left" />

        {/* Big Red Dive Arrow */}
        <g stroke={VICTIM_RED} strokeWidth={6} strokeLinecap="round" fill="none">
          <line x1={-80} y1={40} x2={-140} y2={120} />
          <polyline points="-140,85 -140,120 -105,120" strokeLinejoin="round" />
        </g>
      </g>

      {/* Comic Header Label: Right */}
      <g transform="translate(1440, 120)">
        <rect x={-240} y={-35} width={480} height={70} rx={14} fill="#FFFFFF" stroke={INK} strokeWidth={4.5} />
        <text x={0} y={8} fill={VICTIM_RED} fontSize={26} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          RICH DIVERSITY = MAGNET! 🧲🎉
        </text>
      </g>
    </svg>
  );
};

/**
 * 🧼 SCENE 6: Bathroom Wash, Clock Spin, Boom Return & Facepalm (Beat 6: 794 - 1051f)
 * "You can wash it off. It comes right back. It's yours — built over your entire life, shaped by genetics, diet, and environment you never chose."
 */
export const ZennSkinWashSoapScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 794;

  // Phase 1: Scrubbing (0 - 95f)
  // Phase 2: Clock Spinning (95 - 170f)
  // Phase 3: BOOM Return & Facepalm (170 - 257f)

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Environment: Authentic Warm Bathroom */}
      <rect x={0} y={0} width={1920} height={1080} fill="#FEF3C7" />

      {/* Ceramic Tile Grid on Wall */}
      {Array.from({ length: 9 }).map((_, r) => (
        <line key={`r-${r}`} x1={0} y1={r * 120} x2={1920} y2={r * 120} stroke="#E5E7EB" strokeWidth={3} />
      ))}
      {Array.from({ length: 16 }).map((_, c) => (
        <line key={`c-${c}`} x1={c * 120} y1={0} x2={c * 120} y2={1080} stroke="#E5E7EB" strokeWidth={3} />
      ))}

      {/* Bathroom Floor Baseboard */}
      <rect x={0} y={850} width={1920} height={230} fill="#0F766E" />
      <line x1={0} y1={850} x2={1920} y2={850} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Bathroom Mirror with Wood Frame */}
      <g transform="translate(960, 320)">
        <rect x={-320} y={-200} width={640} height={400} rx={20} fill="#F0FDFA" stroke={INK} strokeWidth={7} />
        {/* Mirror Reflection Sheen */}
        <path d="M -260 -160 L -180 -160 L -60 160 L -140 160 Z" fill="#CCFBF1" opacity={0.6} />

        {/* Pinned Sticky Notes on Mirror */}
        <g transform="translate(-200, -120) rotate(-6)">
          <rect x={-65} y={-30} width={130} height={60} rx={6} fill="#FDE047" stroke={INK} strokeWidth={2.5} />
          <text x={0} y={8} fill={INK} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            🧬 GENETICS
          </text>
        </g>
        <g transform="translate(0, -120)">
          <rect x={-55} y={-30} width={110} height={60} rx={6} fill="#86EFAC" stroke={INK} strokeWidth={2.5} />
          <text x={0} y={8} fill={INK} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            🥗 DIET
          </text>
        </g>
        <g transform="translate(200, -120) rotate(8)">
          <rect x={-75} y={-30} width={150} height={60} rx={6} fill="#93C5FD" stroke={INK} strokeWidth={2.5} />
          <text x={0} y={8} fill={INK} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            🏙️ ENVIRONMENT
          </text>
        </g>
      </g>

      {/* Ceramic Bathroom Sink Counter */}
      <g transform="translate(960, 850)">
        <rect x={-400} y={-140} width={800} height={140} rx={16} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
        {/* Chrome Goose-neck Faucet */}
        <path d="M 0 -140 L 0 -220 Q 0 -270 -40 -270 L -60 -270 Q -80 -270 -80 -240 L -80 -210" fill="none" stroke="#94A3B8" strokeWidth={12} strokeLinecap="round" />
        <path d="M 0 -140 L 0 -220 Q 0 -270 -40 -270 L -60 -270 Q -80 -270 -80 -240 L -80 -210" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" opacity={0.3} />
        {/* Water stream running */}
        <line x1={-80} y1={-210} x2={-80} y2={-130} stroke="#38BDF8" strokeWidth={6} strokeLinecap="round" />
      </g>

      {/* ================================================================ */}
      {/* 2. Character Acting (3 Phases) */}
      {/* ================================================================ */}

      {/* Phase 1 & 2: Scrubbing with Soap and Bubbles */}
      {relFrame < 170 && (
        <g transform="translate(960, 680)">
          {/* Head looking down at sink */}
          <circle cx={-30} cy={-160} r={50} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
          {/* Spiky hair */}
          <g stroke={INK} strokeWidth={4.5} strokeLinecap="round">
            <line x1={-42} y1={-208} x2={-46} y2={-238} />
            <line x1={-30} y1={-210} x2={-30} y2={-246} />
            <line x1={-18} y1={-208} x2={-12} y2={-236} />
          </g>
          {/* Determined scrubbing eyes */}
          <line x1={-44} y1={-165} x2={-28} y2={-160} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          <line x1={-20} y1={-160} x2={-4} y2={-165} stroke={INK} strokeWidth={4} strokeLinecap="round" />
          {/* Tongue sticking out in concentration */}
          <path d="M -30 -135 Q -25 -120 -20 -135" fill="#FDA4AF" stroke={INK} strokeWidth={2.5} />

          {/* Stick Body leaning over */}
          <line x1={-30} y1={-110} x2={-40} y2={40} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />

          {/* Arms vigorously scrubbing with soap motion */}
          {(() => {
            const scrubMotion = Math.sin(relFrame * 0.6) * 25;
            return (
              <g>
                <line x1={-35} y1={-60} x2={-90 + scrubMotion} y2={-30} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
                <line x1={-90 + scrubMotion} y1={-30} x2={-60} y2={-20} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />

                {/* Green Soap Bar */}
                <rect x={-100 + scrubMotion} y={-45} width={45} height={25} rx={6} fill="#10B981" stroke={INK} strokeWidth={3} />

                {/* Flying White Soap Bubbles */}
                {Array.from({ length: 8 }).map((_, bi) => {
                  const bX = -80 + scrubMotion + Math.sin(bi * 1.5) * 35;
                  const bY = -35 + Math.cos(bi * 1.2) * 30;
                  return (
                    <circle key={bi} cx={bX} cy={bY} r={8 + (bi % 4)} fill="#FFFFFF" stroke={INK} strokeWidth={2} />
                  );
                })}
              </g>
            );
          })()}
        </g>
      )}

      {/* Phase 2 Overlay: Spinning Clock on Wall (95 - 170f) */}
      {relFrame >= 95 && relFrame < 170 && (
        <g transform="translate(1500, 320)">
          <circle cx={0} cy={0} r={95} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
          {/* Clock Ticks */}
          {[0, 90, 180, 270].map((deg, i) => (
            <line
              key={i}
              x1={Math.cos((deg * Math.PI) / 180) * 70}
              y1={Math.sin((deg * Math.PI) / 180) * 70}
              x2={Math.cos((deg * Math.PI) / 180) * 85}
              y2={Math.sin((deg * Math.PI) / 180) * 85}
              stroke={INK}
              strokeWidth={4}
              strokeLinecap="round"
            />
          ))}
          {/* Fast spinning clock hands */}
          {(() => {
            const hAngle = (relFrame * 14) * (Math.PI / 180);
            const mAngle = (relFrame * 42) * (Math.PI / 180);
            return (
              <g>
                <line x1={0} y1={0} x2={Math.cos(hAngle) * 45} y2={Math.sin(hAngle) * 45} stroke={INK} strokeWidth={5} strokeLinecap="round" />
                <line x1={0} y1={0} x2={Math.cos(mAngle) * 65} y2={Math.sin(mAngle) * 65} stroke="#EF4444" strokeWidth={4} strokeLinecap="round" />
                <circle cx={0} cy={0} r={6} fill={INK} />
              </g>
            );
          })()}
        </g>
      )}

      {/* Phase 3: BOOM Return & Host Facepalm (170 - 257f) */}
      {relFrame >= 170 && (
        <g>
          {/* Starburst Explosion behind Arm */}
          <g transform="translate(860, 640)">
            <polygon
              points="0,-90 25,-30 85,-40 45,15 90,65 30,55 0,105 -30,55 -90,65 -45,15 -85,-40 -25,-30"
              fill="#FDE047"
              stroke={INK}
              strokeWidth={4}
            />
            {/* Swarming Cute Bacteria returning with triumphant grin */}
            {[
              { x: -30, y: -20, col: '#10B981', r: 24 },
              { x: 30, y: 10, col: '#F59E0B', r: 28 },
              { x: 0, y: 40, col: '#3B82F6', r: 26 },
            ].map((rb, idx) => (
              <circle key={idx} cx={rb.x} cy={rb.y} r={rb.r} fill={rb.col} stroke={INK} strokeWidth={3} />
            ))}
          </g>

          {/* Host Stickman Facepalming */}
          <g transform="translate(1080, 680)">
            <circle cx={0} cy={-160} r={52} fill="#FFFFFF" stroke={INK} strokeWidth={5} />
            {/* Spiky hair */}
            <g stroke={INK} strokeWidth={4.5} strokeLinecap="round">
              <line x1={-12} y1={-208} x2={-16} y2={-238} />
              <line x1={0} y1={-210} x2={0} y2={-246} />
              <line x1={12} y1={-208} x2={18} y2={-236} />
            </g>
            {/* Facepalm Hand slapping face */}
            <line x1={0} y1={-110} x2={35} y2={-70} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
            <line x1={35} y1={-70} x2={8} y2={-160} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
            {/* Hand flat against forehead */}
            <ellipse cx={8} cy={-160} rx={18} ry={12} fill="#FED7AA" stroke={INK} strokeWidth={3} />

            {/* Miserable mouth */}
            <path d="M -20 -130 Q -10 -140 0 -130" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />

            {/* Comic Frustration squiggly spiral over head */}
            <path
              d="M -30 -260 Q -10 -280 10 -260 Q 30 -240 10 -220"
              stroke="#64748B"
              strokeWidth={3.5}
              fill="none"
              strokeLinecap="round"
            />

            {/* Stick body slumped */}
            <line x1={0} y1={-110} x2={-10} y2={40} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
            <line x1={0} y1={-60} x2={-50} y2={0} stroke={INK} strokeWidth={5.5} strokeLinecap="round" />
          </g>

          {/* Comic BOOM Text Stamp */}
          <text
            x={960}
            y={520}
            fill="#EF4444"
            fontSize={56}
            fontWeight="900"
            fontFamily={COMIC_FONT}
            textAnchor="middle"
            stroke="#FFFFFF"
            strokeWidth={3}
            transform="rotate(-8 960 520)"
          >
            COMES RIGHT BACK! 💥
          </text>
        </g>
      )}
    </svg>
  );
};

/**
 * 🩸 SCENE 7: Blood Type O vs Type A Comparison (Beat 7: 1,051 - 1,285f)
 * "Blood type matters too. People with type O blood get bitten nearly twice as often as type A."
 */
export const ZennSkinBloodTypeOvsAScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 1051;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Environment: Warm Parchment Clinical Lab */}
      <rect x={0} y={0} width={1920} height={750} fill="#FAF7F2" />
      <rect x={0} y={750} width={1920} height={330} fill="#6B4D2B" />
      <line x1={0} y1={750} x2={1920} y2={750} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* ================================================================ */}
      {/* 2. Left Stickman: Type O Host (Covered in Welts & Mosquito Swarm) */}
      {/* ================================================================ */}
      <g transform="translate(540, 520)">
        {/* Head with 3 spiky hairs */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>
        {/* Distressed eyes looking up */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-18} cy={-12} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={18} cy={-12} r={5} fill={INK} />
        {/* Worried Eyebrows */}
        <line x1={-28} y1={-22} x2={-8} y2={-30} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-30} x2={28} y2={-22} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        {/* Frown */}
        <path d="M -14 26 Q 0 16 14 26" stroke={INK} strokeWidth={3.8} fill="none" strokeLinecap="round" />

        {/* 10 Bright Red Welt Bite Spots */}
        <g fill={VICTIM_RED}>
          <circle cx={-44} cy={-10} r={9} />
          <circle cx={46} cy={14} r={9} />
          <circle cx={-65} cy={110} r={9} />
          <circle cx={-40} cy={85} r={9} />
          <circle cx={25} cy={105} r={9} />
          <circle cx={65} cy={130} r={9} />
          <circle cx={-35} cy={230} r={9} />
          <circle cx={35} cy={250} r={9} />
        </g>

        {/* Stick Body & Scratching Pose */}
        <line x1={0} y1={55} x2={0} y2={185} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={185} x2={-40} y2={320} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={185} x2={40} y2={320} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        {/* Left hand scratching forearm */}
        <line x1={0} y1={95} x2={-55} y2={125} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={-55} y1={125} x2={-25} y2={145} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        {/* Right hand scratching neck */}
        <line x1={0} y1={95} x2={50} y2={110} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={50} y1={110} x2={25} y2={45} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Glowing Red Blood Drop: TYPE O */}
        <g transform="translate(0, -160)">
          <path d="M 0 -45 C -35 0 -35 30 0 45 C 35 30 35 0 0 -45 Z" fill="#DC2626" stroke={INK} strokeWidth={4} />
          <text x={0} y={15} fill="#FFFFFF" fontSize={32} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            O
          </text>
        </g>

        {/* 3 Circling Mosquitoes */}
        {[-40, 0, 50].map((deg, i) => {
          const orbitX = Math.sin((relFrame * 0.1) + i * 2) * 110;
          const orbitY = -80 + Math.cos((relFrame * 0.1) + i * 2) * 60;
          return (
            <g key={i} transform={`translate(${orbitX}, ${orbitY}) scale(0.85)`}>
              <ZennDetailedMosquito scale={0.9} facing={orbitX > 0 ? 'left' : 'right'} />
            </g>
          );
        })}

        {/* Label under Host */}
        <g transform="translate(0, 360)">
          <rect x={-110} y={-25} width={220} height={50} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <text x={0} y={10} fill={VICTIM_RED} fontSize={26} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            TYPE O (HOST)
          </text>
        </g>
      </g>

      {/* ================================================================ */}
      {/* 3. Center Comic Comparison Bar Chart on Easel */}
      {/* ================================================================ */}
      <g transform="translate(960, 480)">
        {/* Easel Wooden Legs */}
        <line x1={0} y1={-180} x2={-160} y2={270} stroke="#8D5B3A" strokeWidth={10} strokeLinecap="round" />
        <line x1={0} y1={-180} x2={160} y2={270} stroke="#8D5B3A" strokeWidth={10} strokeLinecap="round" />
        <line x1={0} y1={-180} x2={0} y2={280} stroke="#583B20" strokeWidth={8} strokeLinecap="round" />

        {/* White Chart Board */}
        <rect x={-180} y={-140} width={360} height={280} rx={16} fill="#FFFFFF" stroke={INK} strokeWidth={6} />

        {/* Chart Baseline */}
        <line x1={-140} y1={70} x2={140} y2={70} stroke={INK} strokeWidth={4} strokeLinecap="round" />

        {/* Bar 1: Type A (Height: 70) */}
        <rect x={-110} y={0} width={70} height={70} fill="#94A3B8" stroke={INK} strokeWidth={4} />
        <text x={-75} y={-10} fill="#64748B" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          1x
        </text>
        <text x={-75} y={100} fill={INK} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          TYPE A
        </text>

        {/* Bar 2: Type O (Height: 140 — TWICE as tall!) */}
        <rect x={40} y={-70} width={70} height={140} fill="#EF4444" stroke={INK} strokeWidth={4} />
        <text x={75} y={-80} fill={VICTIM_RED} fontSize={26} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          2x BITES!
        </text>
        <text x={75} y={100} fill={VICTIM_RED} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          TYPE O
        </text>
      </g>

      {/* ================================================================ */}
      {/* 4. Right Stickman: Type A Friend (Calm, 1 Welt, Mosquito Ignores) */}
      {/* ================================================================ */}
      <g transform="translate(1380, 520)">
        {/* Head with Round Glasses */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        <circle cx={-22} cy={-4} r={22} fill="none" stroke={INK} strokeWidth={5} />
        <circle cx={22} cy={-4} r={22} fill="none" stroke={INK} strokeWidth={5} />
        <line x1={-2} y1={-4} x2={2} y2={-4} stroke={INK} strokeWidth={4} />
        <circle cx={-22} cy={-4} r={4.5} fill={INK} />
        <circle cx={22} cy={-4} r={4.5} fill={INK} />
        {/* Calm eyebrows & smile */}
        <line x1={-30} y1={-30} x2={-12} y2={-30} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <line x1={12} y1={-30} x2={30} y2={-30} stroke={INK} strokeWidth={4} strokeLinecap="round" />
        <path d="M -10 24 Q 0 30 10 24" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />

        {/* Only 1 tiny red welt on wrist */}
        <circle cx={-50} cy={140} r={7} fill={VICTIM_RED} />

        {/* Relaxed Body */}
        <line x1={0} y1={55} x2={0} y2={185} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={185} x2={-35} y2={320} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={185} x2={35} y2={320} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={95} x2={-45} y2={145} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={95} x2={45} y2={145} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* Blue Blood Drop: TYPE A */}
        <g transform="translate(0, -160)">
          <path d="M 0 -45 C -35 0 -35 30 0 45 C 35 30 35 0 0 -45 Z" fill="#2563EB" stroke={INK} strokeWidth={4} />
          <text x={0} y={15} fill="#FFFFFF" fontSize={32} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            A
          </text>
        </g>

        {/* Label under Friend */}
        <g transform="translate(0, 360)">
          <rect x={-110} y={-25} width={220} height={50} rx={10} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
          <text x={0} y={10} fill="#2563EB" fontSize={26} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            TYPE A (FRIEND)
          </text>
        </g>
      </g>
    </svg>
  );
};

/**
 * 📡 SCENE 8: Skin Cross-Section & 85% Secretor Dial (Beat 8: 1,285 - 1,500f)
 * "And about 85% of us secrete a chemical signal through our skin that essentially announces our blood type to any mosquito nearby —"
 */
export const ZennSkinSecretorDialScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 1285;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Environment: Warm Parchment Background */}
      <rect x={0} y={0} width={1920} height={1080} fill="#FAF7F2" />

      {/* Dashed vertical divider */}
      <line x1={960} y1={60} x2={960} y2={1020} stroke={INK} strokeWidth={5} strokeDasharray="14 10" strokeLinecap="round" />

      {/* ================================================================ */}
      {/* LEFT HALF: Skin Cross-Section Anatomy & Signal Transmission */}
      {/* ================================================================ */}
      <g transform="translate(480, 540)">
        {/* Epidermis Surface Layer */}
        <rect x={-420} y={-60} width={840} height={180} rx={16} fill="#FED7AA" stroke={INK} strokeWidth={6} />
        {/* Subsurface Dermis */}
        <rect x={-420} y={120} width={840} height={200} rx={16} fill="#FDBA74" stroke={INK} strokeWidth={6} />

        {/* Red Bloodstream Vessel Tunnel at Bottom */}
        <rect x={-420} y={220} width={840} height={80} fill="#DC2626" stroke={INK} strokeWidth={5} />
        <text x={0} y={270} fill="#FFFFFF" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          BLOODSTREAM VESSEL
        </text>

        {/* 3 Sweat Ducts / Secretor Channels going to surface */}
        {[-220, 0, 220].map((cx, i) => (
          <g key={i} transform={`translate(${cx}, 0)`}>
            {/* Pore Channel tube */}
            <rect x={-14} y={-60} width={28} height={280} fill="#FFF7ED" stroke={INK} strokeWidth={4} />

            {/* Chemical Markers floating up */}
            {[0, 1, 2].map((mIdx) => {
              const markerY = 220 - (((relFrame * 2 + mIdx * 60 + i * 30) % 280));
              return (
                <g key={mIdx} transform={`translate(0, ${markerY})`}>
                  <circle cx={0} cy={0} r={10} fill="#EF4444" stroke={INK} strokeWidth={2.5} />
                  <circle cx={0} cy={0} r={3} fill="#FEF08A" />
                </g>
              );
            })}

            {/* Broadcast Antenna Rings at Skin Surface */}
            <g transform="translate(0, -60)">
              {[15, 30, 48].map((waveR, wIdx) => (
                <path
                  key={wIdx}
                  d={`M ${-waveR} ${-waveR * 0.7} Q 0 ${-waveR * 1.3} ${waveR} ${-waveR * 0.7}`}
                  stroke="#F59E0B"
                  strokeWidth={3.5}
                  fill="none"
                  strokeLinecap="round"
                  opacity={((relFrame * 0.1 + wIdx) % 3) / 3}
                />
              ))}
            </g>
          </g>
        ))}

        {/* Comic Section Header */}
        <g transform="translate(0, -180)">
          <rect x={-200} y={-30} width={400} height={60} rx={12} fill="#FFFFFF" stroke={INK} strokeWidth={4.5} />
          <text x={0} y={8} fill={INK} fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            SKIN SECRETION DUCTS 📡
          </text>
        </g>
      </g>

      {/* ================================================================ */}
      {/* RIGHT HALF: 85% Secretors Comic Pie Chart */}
      {/* ================================================================ */}
      <g transform="translate(1440, 520)">
        {/* Clipboard Frame */}
        <rect x={-320} y={-320} width={640} height={640} rx={24} fill="#FFFFFF" stroke={INK} strokeWidth={7} />
        {/* Clipboard Top Clip */}
        <rect x={-80} y={-355} width={160} height={50} rx={10} fill="#64748B" stroke={INK} strokeWidth={5} />

        {/* Hand-Drawn Pie Chart (Center: 0, 0, Radius: 180) */}
        {/* 15% Grey Non-Secretor Slice */}
        <path
          d="M 0 0 L 180 0 A 180 180 0 0 1 106 146 Z"
          fill="#94A3B8"
          stroke={INK}
          strokeWidth={5}
        />
        {/* 85% Vibrant Green Secretor Slice */}
        <path
          d="M 0 0 L 106 146 A 180 180 0 1 1 180 0 Z"
          fill="#10B981"
          stroke={INK}
          strokeWidth={5.5}
        />

        {/* Center hub */}
        <circle cx={0} cy={0} r={28} fill="#FFFFFF" stroke={INK} strokeWidth={4} />

        {/* 85% Big Text inside slice */}
        <text
          x={-45}
          y={-30}
          fill="#FFFFFF"
          fontSize={72}
          fontWeight="900"
          fontFamily={COMIC_FONT}
          textAnchor="middle"
          stroke={INK}
          strokeWidth={3}
        >
          85%
        </text>
        <text
          x={-45}
          y={35}
          fill="#FFFFFF"
          fontSize={30}
          fontWeight="900"
          fontFamily={COMIC_FONT}
          textAnchor="middle"
        >
          SECRETORS
        </text>

        {/* 15% Label pointing to small slice */}
        <g transform="translate(170, 90)">
          <text x={0} y={0} fill="#64748B" fontSize={22} fontWeight="900" fontFamily={COMIC_FONT}>
            15%
          </text>
        </g>

        {/* Comic Banner below pie chart */}
        <g transform="translate(0, 240)">
          <rect x={-240} y={-25} width={480} height={50} rx={10} fill="#FEF08A" stroke={INK} strokeWidth={3.5} />
          <text x={0} y={10} fill={INK} fontSize={22} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            ANNOUNCING BLOOD TYPE TO MOSQUITOES
          </text>
        </g>
      </g>
    </svg>
  );
};

/**
 * 🏷️ SCENE 9: Giant "HELLO MY NAME IS TYPE O" Name Tag Gag (Beat 9: 1,500 - 1,740f)
 * "— like a name tag she can read from across the yard."
 */
export const ZennSkinNameTagGagScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 1500;

  // Mosquito bobbing and inspecting with reading glasses
  const mosBob = Math.sin(relFrame * 0.12) * 8;
  const nodHead = Math.sin(relFrame * 0.25) * 6;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Environment: Comic Outdoor Yard */}
      <rect x={0} y={0} width={1920} height={700} fill="#FED7AA" />
      <rect x={0} y={700} width={1920} height={380} fill="#65A30D" />
      <line x1={0} y1={700} x2={1920} y2={700} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Wooden Backyard Picket Fence */}
      {Array.from({ length: 18 }).map((_, i) => (
        <g key={i} transform={`translate(${i * 110 + 20}, 560)`}>
          <polygon points="0,-120 40,-150 80,-120 80,140 0,140" fill="#EFECE6" stroke={INK} strokeWidth={4.5} strokeLinejoin="round" />
        </g>
      ))}
      <line x1={0} y1={620} x2={1920} y2={620} stroke={INK} strokeWidth={5} />

      {/* ================================================================ */}
      {/* 2. Host Stickman with Giant Glowing Name Tag Pinned to Chest */}
      {/* ================================================================ */}
      <g transform="translate(620, 500)">
        {/* Head with 3 spiky hairs */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-20} y2={-88} />
          <line x1={0} y1={-55} x2={0} y2={-96} />
          <line x1={14} y1={-53} x2={22} y2={-86} />
        </g>
        {/* Nervous eyes looking sideways at mosquito */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-12} cy={-6} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={24} cy={-6} r={5} fill={INK} />
        {/* Nervous grin */}
        <path d="M -16 25 Q 0 18 16 25" stroke={INK} strokeWidth={3.8} fill="none" strokeLinecap="round" />

        {/* Sweat drop on cheek */}
        <ellipse cx={-40} cy={10} rx={6} ry={9} fill="#38BDF8" stroke={INK} strokeWidth={2} />

        {/* Stick Body */}
        <line x1={0} y1={55} x2={0} y2={220} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={220} x2={-45} y2={350} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={220} x2={45} y2={350} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        {/* Awkward hanging arms */}
        <line x1={0} y1={95} x2={-75} y2={180} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={95} x2={75} y2={180} stroke={INK} strokeWidth={6} strokeLinecap="round" />

        {/* GIANT RIDICULOUS COMIC NAME TAG PINNED TO CHEST */}
        <g transform="translate(10, 140)">
          {/* Lanyard String */}
          <path d="M -10 -85 Q -30 -40 -30 0" stroke="#DC2626" strokeWidth={4} fill="none" />
          <path d="M -10 -85 Q 30 -40 30 0" stroke="#DC2626" strokeWidth={4} fill="none" />

          {/* Name Tag Badge Container */}
          <rect x={-200} y={0} width={400} height={220} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={7} />

          {/* Red Header Bar */}
          <path d="M -200 0 L 200 0 L 200 70 L -200 70 Z" fill="#DC2626" stroke={INK} strokeWidth={5} />
          <text x={0} y={35} fill="#FFFFFF" fontSize={30} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            HELLO!
          </text>
          <text x={0} y={60} fill="#FEF08A" fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            MY BLOOD TYPE IS
          </text>

          {/* Giant Hand-Drawn "TYPE O" */}
          <text
            x={0}
            y={145}
            fill={INK}
            fontSize={68}
            fontWeight="900"
            fontFamily={COMIC_FONT}
            textAnchor="middle"
          >
            TYPE O
          </text>
          {/* Subtitle */}
          <text x={0} y={190} fill="#DC2626" fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            ★ ALL-YOU-CAN-EAT BUFFET ★
          </text>
        </g>
      </g>

      {/* ================================================================ */}
      {/* 3. Mosquito with Reading Glasses Hovering and Nodding */}
      {/* ================================================================ */}
      <g transform={`translate(1320, ${420 + mosBob}) rotate(${nodHead})`}>
        <ZennDetailedMosquito scale={2.2} facing="left" />

        {/* Reading Glasses Perched on Proboscis! */}
        <g transform="translate(-100, 20)">
          <circle cx={-15} cy={0} r={18} fill="#E0F2FE" stroke={INK} strokeWidth={4.5} />
          <circle cx={15} cy={0} r={18} fill="#E0F2FE" stroke={INK} strokeWidth={4.5} />
          <line x1={-3} y1={0} x2={3} y2={0} stroke={INK} strokeWidth={3.5} />
          <line x1={28} y1={-5} x2={55} y2={-15} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        </g>

        {/* Holding a tiny notepad in front leg */}
        <g transform="translate(-80, 110) rotate(-15)">
          <rect x={-25} y={-35} width={50} height={70} rx={5} fill="#FEF08A" stroke={INK} strokeWidth={3.5} />
          <line x1={-18} y1={-15} x2={18} y2={-15} stroke={INK} strokeWidth={2} />
          <line x1={-18} y1={0} x2={18} y2={0} stroke={INK} strokeWidth={2} />
          <line x1={-18} y1={15} x2={18} y2={15} stroke={INK} strokeWidth={2} />
        </g>

        {/* Comic Approval Bubble */}
        <g transform="translate(100, -120)">
          <ellipse cx={0} cy={0} rx={110} ry={60} fill="#FFFFFF" stroke={INK} strokeWidth={4.5} />
          <polygon points="-30,45 -10,75 5,45" fill="#FFFFFF" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
          <text x={0} y={10} fill="#059669" fontSize={26} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            DELICIOUS! 😋
          </text>
        </g>
      </g>
    </svg>
  );
};

/**
 * 🧠 SCENE 10: Sesame-Seed Brain & Multisensory Radar Checklist (Beat 10: 1,740 - 2,061f)
 * "In a few seconds, with a brain the size of a sesame seed, she's processed your CO2, your body heat, your skin bacteria, your blood type..."
 */
export const ZennSkinSesameBrainDashboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 1740;

  // 4 Checkmarks sequentially ticking
  const check1 = relFrame >= 50;
  const check2 = relFrame >= 110;
  const check3 = relFrame >= 170;
  const check4 = relFrame >= 230;
  const targetLocked = relFrame >= 260;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Environment: High-Tech Comic Radar Studio */}
      <rect x={0} y={0} width={1920} height={1080} fill="#1E293B" />

      {/* Radar Background Circles */}
      <g transform="translate(600, 540)">
        {[180, 320, 460].map((r, i) => (
          <circle key={i} cx={0} cy={0} r={r} fill="none" stroke="#334155" strokeWidth={2.5} strokeDasharray="10 8" />
        ))}
        {/* Rotating radar sweep line */}
        {(() => {
          const sweepAngle = (relFrame * 2) * (Math.PI / 180);
          return (
            <line
              x1={0}
              y1={0}
              x2={Math.cos(sweepAngle) * 460}
              y2={Math.sin(sweepAngle) * 460}
              stroke="#22C55E"
              strokeWidth={3}
              opacity={0.7}
            />
          );
        })()}
      </g>

      {/* ================================================================ */}
      {/* 2. Center-Left: Mosquito Head Profile with Sesame-Seed Brain Cutaway */}
      {/* ================================================================ */}
      <g transform="translate(600, 540)">
        <ZennDetailedMosquito scale={2.6} facing="left" />

        {/* Translucent Cutaway Window into Mosquito Head */}
        <g transform="translate(-50, 90)">
          <circle cx={0} cy={0} r={32} fill="#334155" stroke="#38BDF8" strokeWidth={3.5} />

          {/* Actual Sesame Seed Brain! */}
          <ellipse cx={0} cy={0} rx={14} ry={8} fill="#FDE047" stroke={INK} strokeWidth={2.5} transform="rotate(-20)" />

          {/* Comic Arrow pointer */}
          <path d="M 35 -15 L 80 -45" stroke="#FEF08A" strokeWidth={3.5} fill="none" markerEnd="url(#arrow)" />
          <g transform="translate(190, -55)">
            <rect x={-110} y={-24} width={220} height={48} rx={8} fill="#FEF08A" stroke={INK} strokeWidth={3} />
            <text x={0} y={8} fill={INK} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
              SESAME-SEED BRAIN
            </text>
          </g>
        </g>
      </g>

      {/* ================================================================ */}
      {/* 3. 4 Revolving Sensory HUD Dials orbiting mosquito */}
      {/* ================================================================ */}
      {[
        { label: 'CO₂ PLUME', icon: '💨', col: '#38BDF8', x: 220, y: 260 },
        { label: 'BODY HEAT', icon: '🌡️', col: '#EF4444', x: 980, y: 260 },
        { label: 'MICROBES', icon: '🦠', col: '#10B981', x: 220, y: 820 },
        { label: 'BLOOD TYPE', icon: '🩸', col: '#DC2626', x: 980, y: 820 },
      ].map((dial, idx) => (
        <g key={idx} transform={`translate(${dial.x}, ${dial.y})`}>
          <circle cx={0} cy={0} r={55} fill="#0F172A" stroke={dial.col} strokeWidth={4.5} />
          <text x={0} y={15} fontSize={38} textAnchor="middle">
            {dial.icon}
          </text>
          <text x={0} y={78} fill={dial.col} fontSize={18} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            {dial.label}
          </text>
        </g>
      ))}

      {/* ================================================================ */}
      {/* 4. Right Side: Yellow Legal Pad Checklist */}
      {/* ================================================================ */}
      <g transform="translate(1500, 540)">
        {/* Wooden Clipboard */}
        <rect x={-280} y={-340} width={560} height={680} rx={24} fill="#8D5B3A" stroke={INK} strokeWidth={7} />
        {/* Yellow Legal Pad Paper */}
        <rect x={-250} y={-300} width={500} height={620} rx={14} fill="#FEF08A" stroke={INK} strokeWidth={5} />
        {/* Red Margin Line */}
        <line x1={-180} y1={-300} x2={-180} y2={320} stroke="#FDA4AF" strokeWidth={3} />

        {/* Header */}
        <text x={0} y={-230} fill={INK} fontSize={32} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
          TARGET ACQUISITION
        </text>
        <line x1={-200} y1={-200} x2={200} y2={-200} stroke={INK} strokeWidth={3.5} strokeLinecap="round" />

        {/* 4 Checklist Items */}
        {[
          { label: '1. CO₂ DETECTED', checked: check1, y: -130, c: '#0284C7' },
          { label: '2. BODY HEAT: 37°C', checked: check2, y: -50, c: '#DC2626' },
          { label: '3. SKIN BACTERIA: RICH', checked: check3, y: 30, c: '#059669' },
          { label: '4. BLOOD TYPE: O', checked: check4, y: 110, c: '#991B1B' },
        ].map((item, idx) => (
          <g key={idx} transform={`translate(-140, ${item.y})`}>
            {/* Checkbox box */}
            <rect x={-25} y={-24} width={48} height={48} rx={8} fill="#FFFFFF" stroke={INK} strokeWidth={4} />
            {item.checked && (
              <path
                d="M -15 2 L -4 14 L 16 -12"
                fill="none"
                stroke={item.c}
                strokeWidth={7}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
            {/* Text item */}
            <text x={45} y={10} fill={INK} fontSize={24} fontWeight="900" fontFamily={COMIC_FONT}>
              {item.label}
            </text>
          </g>
        ))}

        {/* Final Stamp: TARGET LOCKED! */}
        {targetLocked && (
          <g transform="translate(0, 220) rotate(-10)">
            <rect x={-200} y={-35} width={400} height={70} rx={12} fill="#10B981" stroke={INK} strokeWidth={5} />
            <text x={0} y={12} fill="#FFFFFF" fontSize={34} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
              TARGET LOCKED! 🎯
            </text>
          </g>
        )}
      </g>
    </svg>
  );
};

/**
 * 👕 SCENE 11: Dark Shirt Heat Trap vs White Shirt Reflection (Beat 11: 2,061 - 2,326f)
 * "...and even the color of your shirt. Dark clothing absorbs more heat and makes you easier to spot once she's close."
 */
export const ZennSkinShirtContrastScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 2061;

  // Mosquito swooping down straight at dark shirt
  const mosDive = Math.min(Math.max(relFrame / 60, 0), 1);
  const mosX = interpolate(mosDive, [0, 1], [1100, 680]);
  const mosY = interpolate(mosDive, [0, 1], [180, 520]);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1. Environment: Blazing Sunny Day Patio */}
      <rect x={0} y={0} width={1920} height={720} fill="#FED7AA" />
      <rect x={0} y={720} width={1920} height={360} fill="#78716C" />
      <line x1={0} y1={720} x2={1920} y2={720} stroke={INK} strokeWidth={6} strokeLinecap="round" />

      {/* Giant Blazing Sun in Top Center-Right */}
      <g transform="translate(960, 140)">
        <circle cx={0} cy={0} r={75} fill="#FACC15" stroke={INK} strokeWidth={5.5} />
        {Array.from({ length: 12 }).map((_, i) => {
          const sAngle = (i * 30 + relFrame * 0.5) * (Math.PI / 180);
          return (
            <line
              key={i}
              x1={Math.cos(sAngle) * 85}
              y1={Math.sin(sAngle) * 85}
              x2={Math.cos(sAngle) * 115}
              y2={Math.sin(sAngle) * 115}
              stroke={INK}
              strokeWidth={4.5}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* ================================================================ */}
      {/* 2. Left Stickman: Dark Shirt (Heat Trap & High Contrast) */}
      {/* ================================================================ */}
      <g transform="translate(560, 520)">
        {/* Sweating Head looking up in dread */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        {/* 3 spiky hairs drooping */}
        <g stroke={INK} strokeWidth={5} strokeLinecap="round">
          <line x1={-14} y1={-53} x2={-24} y2={-78} />
          <line x1={0} y1={-55} x2={0} y2={-84} />
          <line x1={14} y1={-53} x2={24} y2={-78} />
        </g>
        {/* Panic eyes looking at dive-bombing mosquito */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={-14} cy={-12} r={5} fill={INK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK} strokeWidth={3} />
        <circle cx={22} cy={-12} r={5} fill={INK} />
        {/* Panic Mouth */}
        <ellipse cx={0} cy={24} rx={12} ry={16} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />

        {/* Flying Sweat Drops */}
        {[-45, 45].map((sx, i) => (
          <ellipse key={i} cx={sx} cy={-15} rx={6} ry={9} fill="#38BDF8" stroke={INK} strokeWidth={2} />
        ))}

        {/* JET BLACK T-SHIRT (HEAT TRAP) */}
        <path
          d="M -45 55 L 45 55 L 55 185 L -55 185 Z"
          fill="#0F172A"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* Short Sleeves */}
        <path d="M -45 55 L -85 115 L -60 125 L -35 75 Z" fill="#0F172A" stroke={INK} strokeWidth={5.5} strokeLinejoin="round" />
        <path d="M 45 55 L 85 115 L 60 125 L 35 75 Z" fill="#0F172A" stroke={INK} strokeWidth={5.5} strokeLinejoin="round" />

        {/* Thick Heatwaves Radiating off Dark Shirt */}
        {[-70, -35, 0, 35, 70].map((hx, i) => {
          const waveY = Math.sin(relFrame * 0.2 + i) * 12;
          return (
            <path
              key={i}
              d={`M ${hx} 75 Q ${hx + 15} ${120 + waveY} ${hx} 165`}
              stroke="#EF4444"
              strokeWidth={4.5}
              fill="none"
              strokeLinecap="round"
              opacity={0.8}
            />
          );
        })}

        {/* Legs */}
        <line x1={-25} y1={185} x2={-25} y2={320} stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <line x1={25} y1={185} x2={25} y2={320} stroke={INK} strokeWidth={7} strokeLinecap="round" />

        {/* Comic Label under Host (Ample padding, no border hugging) */}
        <g transform="translate(0, 360)">
          <rect x={-185} y={-27} width={370} height={54} rx={12} fill="#18181B" stroke="#FFFFFF" strokeWidth={3.5} />
          <text x={0} y={8} fill="#FFFFFF" fontSize={20} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            DARK SHIRT: HEAT TRAP! 🔥
          </text>
        </g>
      </g>

      {/* ================================================================ */}
      {/* 3. Right Stickman: White Shirt (Reflects Heat & Blends in) */}
      {/* ================================================================ */}
      <g transform="translate(1360, 520)">
        {/* Head with Round Glasses */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK} strokeWidth={5.5} />
        <circle cx={-22} cy={-4} r={22} fill="none" stroke={INK} strokeWidth={5} />
        <circle cx={22} cy={-4} r={22} fill="none" stroke={INK} strokeWidth={5} />
        <circle cx={-22} cy={-4} r={4.5} fill={INK} />
        <circle cx={22} cy={-4} r={4.5} fill={INK} />
        {/* Cool, happy smile */}
        <path d="M -12 24 Q 0 32 12 24" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />

        {/* BRIGHT WHITE T-SHIRT (REFLECTS HEAT) */}
        <path
          d="M -45 55 L 45 55 L 55 185 L -55 185 Z"
          fill="#FFFFFF"
          stroke={INK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* Sleeves */}
        <path d="M -45 55 L -85 115 L -60 125 L -35 75 Z" fill="#FFFFFF" stroke={INK} strokeWidth={5.5} strokeLinejoin="round" />
        <path d="M 45 55 L 85 115 L 60 125 L 35 75 Z" fill="#FFFFFF" stroke={INK} strokeWidth={5.5} strokeLinejoin="round" />

        {/* Sunbeams Bouncing off White Shirt */}
        {[-30, 0, 30].map((bx, i) => (
          <path
            key={i}
            d={`M ${bx - 20} 60 L ${bx} 100 L ${bx + 30} 70`}
            stroke="#FACC15"
            strokeWidth={4}
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* Legs */}
        <line x1={-25} y1={185} x2={-25} y2={320} stroke={INK} strokeWidth={7} strokeLinecap="round" />
        <line x1={25} y1={185} x2={25} y2={320} stroke={INK} strokeWidth={7} strokeLinecap="round" />

        {/* Comic Label under Friend (Ample padding, no border hugging) */}
        <g transform="translate(0, 360)">
          <rect x={-185} y={-27} width={370} height={54} rx={12} fill="#FFFFFF" stroke={INK} strokeWidth={3.5} />
          <text x={0} y={8} fill="#059669" fontSize={20} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
            WHITE SHIRT: REFLECTS ❄️
          </text>
        </g>
      </g>

      {/* ================================================================ */}
      {/* 4. Mosquito Attack Vector swooping straight at Dark Shirt */}
      {/* ================================================================ */}
      {/* Trajectory dotted line curving away from white shirt */}
      <path
        d="M 1360 280 Q 1150 220 680 480"
        stroke={VICTIM_RED}
        strokeWidth={5}
        strokeDasharray="14 10"
        fill="none"
      />
      {/* Red Target Arrow at chest of dark shirt */}
      <g stroke={VICTIM_RED} strokeWidth={6} strokeLinecap="round" fill="none">
        <line x1={740} y1={440} x2={680} y2={480} />
        <polyline points="715,445 680,480 700,495" />
      </g>

      {/* Diving Mosquito */}
      <g transform={`translate(${mosX}, ${mosY}) rotate(-25)`}>
        <ZennDetailedMosquito scale={1.6} facing="left" />
      </g>
    </svg>
  );
};

/**
 * 🦕 SCENE 12: Prehistoric Amber Fossil to Modern Precision Scanner (Beat 12: 2,326 - 2,676f)
 * "This isn't folklore — it's peer-reviewed entomology. She's a biological scanning device, refined over 100 million years."
 */
export const ZennSkinEvolutionAmberScene: React.FC = () => {
  const frame = useCurrentFrame();
  const relFrame = frame - 2326;

  // Phase 1: Prehistoric Cretaceous Amber (0 - 160f)
  // Phase 2: Time Warp & Modern Precision Scanner (160 - 350f)
  const isModern = relFrame >= 160;
  const modernProgress = Math.min(Math.max((relFrame - 160) / 40, 0), 1);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* ================================================================ */}
      {/* PHASE 1: 100,000,000 YEARS AGO — AMBER FOSSIL */}
      {/* ================================================================ */}
      {!isModern && (
        <g>
          {/* Glowing Translucent Cretaceous Amber Resin Backdrop */}
          <rect x={0} y={0} width={1920} height={1080} fill="#D97706" />
          <circle cx={960} cy={540} r={460} fill="#F59E0B" />
          <circle cx={960} cy={540} r={380} fill="#FBBF24" opacity={0.7} />

          {/* Fossil Amber Craquelure / Crack Lines */}
          <path d="M 680 280 L 760 380 L 850 360 L 920 440" stroke="#78350F" strokeWidth={3} fill="none" opacity={0.5} />
          <path d="M 1240 680 L 1150 620 L 1080 660 L 1020 580" stroke="#78350F" strokeWidth={3} fill="none" opacity={0.5} />

          {/* Ancient Primitive Mosquito Trapped Inside Amber */}
          <g transform="translate(960, 540) rotate(-15)">
            <ZennDetailedMosquito scale={2.8} facing="left" />
          </g>

          {/* Comic Ancient Stone Plaque Banner */}
          <g transform="translate(960, 180)">
            <rect x={-320} y={-45} width={640} height={90} rx={16} fill="#FEF3C7" stroke={INK} strokeWidth={6} />
            <text x={0} y={15} fill="#78350F" fontSize={38} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
              100,000,000 YEARS AGO 🦖
            </text>
          </g>

          <g transform="translate(960, 920)">
            <rect x={-260} y={-30} width={520} height={60} rx={12} fill="#FFFFFF" stroke={INK} strokeWidth={4.5} />
            <text x={0} y={10} fill={INK} fontSize={24} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
              FOSSILIZED PREHISTORIC ANCESTOR
            </text>
          </g>
        </g>
      )}

      {/* ================================================================ */}
      {/* PHASE 2: TODAY — THE ULTIMATE BIOLOGICAL SCANNING DEVICE */}
      {/* ================================================================ */}
      {isModern && (
        <g>
          {/* Deep Navy/Warm Room Environment with High-Tech Glow */}
          <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />

          {/* Neon Target Reticle Rings Around Sleek Modern Mosquito */}
          <g transform="translate(960, 520)">
            {/* Concentric Scanner Rings */}
            {[180, 280, 380].map((rad, i) => (
              <circle
                key={i}
                cx={0}
                cy={0}
                r={rad}
                fill="none"
                stroke="#22C55E"
                strokeWidth={4}
                strokeDasharray="24 16"
                opacity={0.6 + i * 0.15}
                transform={`rotate(${relFrame * (i % 2 === 0 ? 0.8 : -0.8)})`}
              />
            ))}

            {/* Target Crosshairs */}
            <line x1={-420} y1={0} x2={-320} y2={0} stroke="#22C55E" strokeWidth={5} />
            <line x1={320} y1={0} x2={420} y2={0} stroke="#22C55E" strokeWidth={5} />
            <line x1={0} y1={-420} x2={0} y2={-320} stroke="#22C55E" strokeWidth={5} />
            <line x1={0} y1={320} x2={0} y2={420} stroke="#22C55E" strokeWidth={5} />

            {/* Center Stage: Sleek Modern Masterpiece Mosquito */}
            <g transform={`scale(${1 + Math.sin(relFrame * 0.1) * 0.04})`}>
              <ZennDetailedMosquito scale={3.2} facing="left" />
            </g>
          </g>

          {/* Comic Top Banner: Peer-Reviewed Entomology */}
          <g transform="translate(960, 160)">
            <rect x={-360} y={-45} width={720} height={90} rx={18} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
            <text x={0} y={15} fill={INK} fontSize={34} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
              PEER-REVIEWED ENTOMOLOGY 🔬
            </text>
          </g>

          {/* Comic Bottom Banner: 100 Million Years of Evolution */}
          <g transform="translate(960, 920)">
            <rect x={-420} y={-40} width={840} height={80} rx={16} fill="#10B981" stroke={INK} strokeWidth={6} />
            <text x={0} y={14} fill="#FFFFFF" fontSize={32} fontWeight="900" fontFamily={COMIC_FONT} textAnchor="middle">
              REFINED OVER 100 MILLION YEARS ⚡
            </text>
          </g>
        </g>
      )}
    </svg>
  );
};
