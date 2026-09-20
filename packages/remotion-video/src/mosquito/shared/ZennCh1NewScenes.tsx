import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { INK_BLACK, VICTIM_RED, ZennStickman, ZennMosquito } from './ZennStyle';

/**
 * 🌺 SCENE 1: The Flower Bar — Male Mosquito sipping nectar (Beat 2)
 */
export const ZennFlowerBarScene: React.FC = () => {
  const frame = useCurrentFrame();
  const breeze = Math.sin(frame * 0.08) * 6;

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#064E3B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Tropical Garden Gradient Sky */}
        <defs>
          <linearGradient id="tropicalSky" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#022C22" />
            <stop offset="100%" stopColor="#047857" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#tropicalSky)" />

        {/* Giant Exotic Flower Petals */}
        <g transform={`translate(960, 680) rotate(${breeze})`}>
          {/* Flower Stem */}
          <path d="M 0 100 Q -30 250 20 400" stroke="#10B981" strokeWidth={18} fill="none" strokeLinecap="round" />
          {/* Big Pink Hibiscus Petals */}
          {[0, 60, 120, 180, 240, 300].map((deg) => (
            <ellipse
              key={deg}
              cx={0}
              cy={-140}
              rx={90}
              ry={150}
              fill="#F43F5E"
              stroke={INK_BLACK}
              strokeWidth={5}
              transform={`rotate(${deg})`}
              opacity={0.9}
            />
          ))}
          {/* Flower Center Nectar Pool */}
          <circle cx={0} cy={0} r={75} fill="#FDE047" stroke={INK_BLACK} strokeWidth={5} />
          <text x={0} y={10} fill="#78350F" fontSize={24} fontWeight="900" textAnchor="middle">
            NECTAR BAR
          </text>
        </g>

        {/* Male Mosquito Relaxing on the Flower with Cocktail */}
        <g transform="translate(960, 480)">
          {/* Male Mosquito Body (feathery antennae) */}
          <ZennMosquito x={0} y={0} scale={1.4} facing="right" />
          {/* Sunglasses on Mosquito */}
          <rect x={-45} y={-8} width={28} height={14} rx={3} fill="#0F172A" stroke={INK_BLACK} strokeWidth={2} />

          {/* Tropical Cocktail Glass with Lime & Tiny Umbrella */}
          <g transform="translate(90, 40)">
            <polygon points="-18,0 18,0 14,45 -14,45" fill="#38BDF8" stroke={INK_BLACK} strokeWidth={3} />
            <line x1={0} y1={45} x2={0} y2={80} stroke={INK_BLACK} strokeWidth={3.5} />
            <line x1={-20} y1={80} x2={20} y2={80} stroke={INK_BLACK} strokeWidth={3.5} />
            {/* Straw */}
            <line x1={-8} y1={-15} x2={-20} y2={-35} stroke="#EF4444" strokeWidth={3} />
            {/* Cocktail Umbrella */}
            <path d="M 5 -10 Q 25 -30 45 -10 Z" fill="#FACC15" stroke={INK_BLACK} strokeWidth={2} />
            <line x1={25} y1={-10} x2={25} y2={20} stroke="#92400E" strokeWidth={2} />
          </g>
        </g>

        {/* Comic Wooden Signpost */}
        <g transform="translate(960, 950)">
          <rect
            x={-340}
            y={-40}
            width={680}
            height={80}
            rx={20}
            fill="#FACC15"
            stroke={INK_BLACK}
            strokeWidth={5}
          />
          <text
            x={0}
            y={12}
            fill={INK_BLACK}
            fontSize={26}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          >
            MALES: FLOWER BAR SIPPIN' NECTAR 🍹🌸
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 📶 SCENE 2: The Hotel Wi-Fi Hallway Search Gag (Beat 8)
 */
export const ZennWifiHotelSearchScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0F172A', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Split Screen Divider */}
        <line x1={0} y1={540} x2={1920} y2={540} stroke="#475569" strokeWidth={6} />

        {/* ============================================================== */}
        {/* TOP HALF: Mosquito Zigzagging along CO2 Ribbon                */}
        {/* ============================================================== */}
        <rect x={0} y={0} width={1920} height={540} fill="#0B132B" />
        {/* Cyan CO2 Ribbon */}
        <path
          d="M 1800 270 Q 1400 120 1000 320 T 200 240"
          stroke="#38BDF8"
          strokeWidth={14}
          strokeDasharray="24 16"
          fill="none"
          strokeLinecap="round"
          opacity={0.7}
        />
        {/* Mosquito Zigzag Path */}
        <path
          d="M 1700 350 L 1500 180 L 1320 380 L 1100 190 L 920 340 L 700 200"
          stroke="#FACC15"
          strokeWidth={4}
          strokeDasharray="8 6"
          fill="none"
        />
        <g transform={`translate(${700 + Math.sin(frame * 0.2) * 20}, ${200 + Math.cos(frame * 0.2) * 15})`}>
          <ZennMosquito x={0} y={0} scale={1.1} facing="left" />
        </g>
        <text x={120} y={90} fill="#38BDF8" fontSize={28} fontWeight="900" fontFamily="sans-serif">
          HER FLIGHT: ZIGZAGGING UPSTREAM
        </text>

        {/* ============================================================== */}
        {/* BOTTOM HALF: Stickman Hunting for Hotel Wi-Fi in Bathrobe    */}
        {/* ============================================================== */}
        <rect x={0} y={540} width={1920} height={540} fill="#1E293B" />
        {/* Hotel Hallway Doors */}
        {[200, 520, 840, 1160, 1480, 1780].map((dx, i) => (
          <g key={i} transform={`translate(${dx}, 600)`}>
            <rect x={-45} y={0} width={90} height={220} fill="#334155" stroke={INK_BLACK} strokeWidth={4} />
            <circle cx={25} cy={110} r={5} fill="#FACC15" />
            <text x={0} y={-10} fill="#94A3B8" fontSize={16} fontWeight="900" textAnchor="middle">
              {201 + i}
            </text>
          </g>
        ))}

        {/* Carpet Floor */}
        <rect x={0} y={820} width={1920} height={260} fill="#475569" stroke={INK_BLACK} strokeWidth={5} />

        {/* Stickman in Bathrobe Walking & Holding Phone Up */}
        <g transform={`translate(${960 + Math.sin(frame * 0.1) * 80}, 720)`}>
          <ZennStickman x={0} y={0} scale={1.05} shirtColor="#F1F5F9" eyes="looking_up" eyebrows="worried" mouth="worried" />
          {/* Phone with 1-Bar Wi-Fi Icon */}
          <g transform="translate(50, 100)">
            <rect x={-15} y={-25} width={30} height={50} rx={6} fill="#0F172A" stroke={INK_BLACK} strokeWidth={2.5} />
            <path d="M -8 -10 Q 0 -18 8 -10" stroke="#EF4444" strokeWidth={2.5} fill="none" />
            <circle cx={0} cy={0} r={2} fill="#EF4444" />
          </g>
        </g>

        {/* Comic Label */}
        <g transform="translate(960, 1010)">
          <rect
            x={-340}
            y={-35}
            width={680}
            height={70}
            rx={35}
            fill="#0284C7"
            stroke="#FFFFFF"
            strokeWidth={4}
          />
          <text
            x={0}
            y={9}
            fill="#FFFFFF"
            fontSize={24}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            "LIKE HUNTING FOR HOTEL WI-FI AT 2 AM" 📶🏨
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🏃 SCENE 3: Jogger & Smartphone Push Notification (Beat 10 & 12)
 */
export const ZennJoggerPushNotificationScene: React.FC = () => {
  const frame = useCurrentFrame();
  const jogCycle = Math.sin(frame * 0.4) * 8;

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Evening Road */}
        <rect x={0} y={650} width={1920} height={430} fill="#1E293B" />
        <line x1={0} y1={650} x2={1920} y2={650} stroke={INK_BLACK} strokeWidth={6} />
        <line x1={0} y1={860} x2={1920} y2={860} stroke="#FACC15" strokeWidth={6} strokeDasharray="40 30" />

        {/* Jogger Stickman Running with Headband & Heavy Sweat */}
        <g transform={`translate(${520}, ${420 + jogCycle})`}>
          <ZennStickman
            x={0}
            y={0}
            scale={1.25}
            hasSpikyHair
            shirtColor="#EF4444"
            eyes="worried"
            eyebrows="worried"
            mouth="shock_o"
            pose="flailing"
          />
          {/* Red Headband */}
          <rect x={-52} y={-24} width={104} height={16} rx={4} fill="#DC2626" stroke={INK_BLACK} strokeWidth={3} />
          {/* Heavy Steam / Radiator Heat */}
          {[ -30, 0, 30 ].map((hx, i) => (
            <path
              key={i}
              d={`M ${hx} -60 Q ${hx + 15} -90 ${hx - 15} -130`}
              stroke="#F87171"
              strokeWidth={4}
              fill="none"
              opacity={0.8}
            />
          ))}
          {/* Heavy Breath Cloud */}
          <ellipse cx={80} cy={10} rx={40} ry={25} fill="#38BDF8" opacity={0.65} />
          <text x={80} y={15} fill="#0284C7" fontSize={18} fontWeight="900" textAnchor="middle">
            CO₂
          </text>
        </g>

        {/* Smartphone Screen Floating on Right: Push Notification */}
        <g transform="translate(1380, 480)">
          {/* Phone Body */}
          <rect
            x={-220}
            y={-200}
            width={440}
            height={380}
            rx={32}
            fill="#0F172A"
            stroke="#64748B"
            strokeWidth={8}
          />
          {/* Notification Card */}
          <rect
            x={-190}
            y={-140}
            width={380}
            height={160}
            rx={20}
            fill="#1E293B"
            stroke="#FACC15"
            strokeWidth={4}
          />
          <text x={-150} y={-95} fill="#FACC15" fontSize={22} fontWeight="900">
            🔔 MOSQUITO RADAR
          </text>
          <text x={-150} y={-55} fill="#FFFFFF" fontSize={24} fontWeight="900">
            Jogger Detected! 🏃💨
          </text>
          <text x={-150} y={-20} fill="#94A3B8" fontSize={18} fontWeight="700">
            +300% Breath & Skin Heat
          </text>

          {/* Mosquito Perched on Phone Reading It */}
          <g transform="translate(140, -180)">
            <ZennMosquito x={0} y={0} scale={1.2} facing="left" />
          </g>
        </g>

        {/* Comic Banner */}
        <g transform="translate(960, 960)">
          <rect
            x={-340}
            y={-38}
            width={680}
            height={76}
            rx={38}
            fill="#EF4444"
            stroke="#FFFFFF"
            strokeWidth={4.5}
          />
          <text
            x={0}
            y={10}
            fill="#FFFFFF"
            fontSize={24}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            "YOUR EVENING JOG IS A PUSH NOTIFICATION" 📲🔔
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 📄 SCENE 4: Meta Script Page 3 Flip Gag (Beat 11)
 */
export const ZennMetaScriptPage3Scene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#1E293B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Big Hand-drawn Physical Script Paper Sheet */}
        <g transform="translate(960, 520) rotate(-2)">
          {/* Paper Shadow */}
          <rect x={-360} y={-380} width={720} height={760} rx={16} fill="#000000" opacity={0.4} />
          {/* White Paper Sheet */}
          <rect
            x={-370}
            y={-390}
            width={720}
            height={760}
            rx={16}
            fill="#FFFBEB"
            stroke={INK_BLACK}
            strokeWidth={7}
          />

          {/* Script Header */}
          <text x={-310} y={-320} fill="#92400E" fontSize={26} fontWeight="900" fontFamily="Courier, monospace">
            SIR CURIOUS - MOSQUITO MAGNET
          </text>
          <line x1={-310} y1={-295} x2={310} y2={-295} stroke="#D97706" strokeWidth={3} />

          {/* Page Number Stamp */}
          <g transform="translate(250, -325)">
            <rect x={-45} y={-25} width={90} height={50} rx={10} fill="#EF4444" stroke={INK_BLACK} strokeWidth={3} />
            <text x={0} y={9} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
              PAGE 3
            </text>
          </g>

          {/* Hand-drawn Doodles on the Script */}
          <text x={-310} y={-220} fill={INK_BLACK} fontSize={28} fontWeight="900" fontFamily="sans-serif">
            "Skin warms... and you sweat."
          </text>

          {/* Stickman Doodle Running on Script */}
          <g transform="translate(-140, -50)">
            <ZennStickman x={0} y={0} scale={0.75} shirtColor="#2563EB" eyes="worried" pose="flailing" />
          </g>

          {/* Mosquito Doodle Landing on the Script Page */}
          <g transform="translate(160, 80)">
            <ZennMosquito x={0} y={0} scale={1.1} facing="left" />
            <text x={-60} y={-40} fill="#DC2626" fontSize={22} fontWeight="900">
              *LANDS ON PAGE*
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🍽️ SCENE 5: 3,000 Species Menu Diner Gag (Beat 15)
 */
export const ZennThreeThousandMenuScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0F172A', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Retro Comic Diner Backdrop */}
        <rect x={0} y={0} width={1920} height={700} fill="#1E293B" />
        <rect x={0} y={700} width={1920} height={380} fill="#334155" />
        <line x1={0} y1={700} x2={1920} y2={700} stroke={INK_BLACK} strokeWidth={6} />

        {/* Diner Counter Table */}
        <rect x={200} y={640} width={1520} height={90} rx={16} fill="#F97316" stroke={INK_BLACK} strokeWidth={6} />

        {/* 3 Different Mosquito Species Sitting at Counter */}
        {[-340, 0, 340].map((mx, idx) => (
          <g key={idx} transform={`translate(${960 + mx}, 540)`}>
            <ZennMosquito x={0} y={0} scale={1.3} facing={idx === 2 ? 'left' : 'right'} />
          </g>
        ))}

        {/* Massive 3,000-Item Menu Board */}
        <g transform="translate(960, 240)">
          <rect
            x={-420}
            y={-140}
            width={840}
            height={280}
            rx={20}
            fill="#FFFBEB"
            stroke={INK_BLACK}
            strokeWidth={7}
          />
          <text
            x={0}
            y={-70}
            fill="#7C2D12"
            fontSize={38}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Impact', sans-serif"
          >
            3,000 MOSQUITO SPECIES: THE MENU 📜
          </text>
          <line x1={-360} y1={-40} x2={360} y2={-40} stroke="#EA580C" strokeWidth={3.5} />

          {/* Menu Items */}
          <text x={-320} y={15} fill={INK_BLACK} fontSize={22} fontWeight="900">
            • Aedes aegypti: Human Specialists
          </text>
          <text x={-320} y={60} fill={INK_BLACK} fontSize={22} fontWeight="900">
            • Culex pipiens: Bird Enthusiasts
          </text>
          <text x={-320} y={105} fill={INK_BLACK} fontSize={22} fontWeight="900">
            • Culiseta: Amphibian & Reptile Fans
          </text>
        </g>

        {/* Comic Banner */}
        <g transform="translate(960, 950)">
          <rect
            x={-340}
            y={-38}
            width={680}
            height={76}
            rx={38}
            fill="#FACC15"
            stroke={INK_BLACK}
            strokeWidth={4.5}
          />
          <text
            x={0}
            y={10}
            fill={INK_BLACK}
            fontSize={24}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            "3,000 SPECIES COULDN'T AGREE ON ONE MENU" 📋🦟
          </text>
        </g>
      </svg>
    </div>
  );
};
