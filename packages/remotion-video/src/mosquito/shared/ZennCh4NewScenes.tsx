import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { INK_BLACK, VICTIM_RED, ZennStickman, ZennMosquito } from './ZennStyle';

/**
 * 🗺️ SCENE 1: World Pathogen Vectors Map (Beat 2)
 */
export const ZennWorldPathogenVectorsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const diseases = [
    { name: 'MALARIA', color: '#EF4444', x: 740, y: 460 },
    { name: 'DENGUE', color: '#F97316', x: 1200, y: 560 },
    { name: 'YELLOW FEVER', color: '#FACC15', x: 500, y: 640 },
    { name: 'ZIKA', color: '#A855F7', x: 600, y: 500 },
    { name: 'WEST NILE', color: '#3B82F6', x: 960, y: 340 },
  ];

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Dark Ocean Background with Longitude/Latitude Grid */}
        <rect x={0} y={0} width={1920} height={1080} fill="#0B132B" />
        {[200, 400, 600, 800, 1000, 1200, 1400, 1600].map((gx) => (
          <line key={gx} x1={gx} y1={0} x2={gx} y2={1080} stroke="#1E293B" strokeWidth={1.5} />
        ))}
        {[200, 400, 600, 800].map((gy) => (
          <line key={gy} x1={0} y1={gy} x2={1920} y2={gy} stroke="#1E293B" strokeWidth={1.5} />
        ))}

        {/* Hand-drawn Stylized Continents Silhouettes */}
        <g fill="#1E293B" stroke="#334155" strokeWidth={3}>
          {/* Americas */}
          <path d="M 360 220 Q 520 260 480 440 Q 420 540 520 680 Q 540 850 440 920 Q 380 750 420 620 Q 340 450 320 300 Z" />
          {/* Eurasia & Africa */}
          <path d="M 800 240 Q 1200 180 1500 260 Q 1400 440 1250 480 Q 1050 400 950 480 Q 1020 720 900 860 Q 800 700 820 520 Q 720 380 800 240 Z" />
        </g>

        {/* 5 Disease Warning Shield Badges */}
        {diseases.map((d, i) => {
          const pulse = 1 + Math.sin(frame * 0.15 + i) * 0.08;
          return (
            <g key={d.name} transform={`translate(${d.x}, ${d.y}) scale(${pulse})`}>
              <path
                d="M 0 -35 L 35 -20 L 35 15 C 35 35 0 50 0 50 C 0 50 -35 35 -35 15 L -35 -20 Z"
                fill={d.color}
                stroke={INK_BLACK}
                strokeWidth={3.5}
              />
              <text x={0} y={75} fill="#F8FAFC" fontSize={18} fontWeight="900" textAnchor="middle">
                {d.name}
              </text>
            </g>
          );
        })}

        {/* Header Title */}
        <g transform="translate(960, 100)">
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
            fontSize={26}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            GLOBAL DISEASE TRANSMISSION VECTORS 🌍⚠️
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 📊 SCENE 2: WHO 610,000 Deaths Graphic (Beat 4 & 5)
 */
export const ZennWhoMalariaStats2024Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const counterVal = Math.min(Math.floor(interpolate(frame, [0, 60], [100000, 610000], { extrapolateRight: 'clamp' })), 610000);

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0F172A', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Subtle Map Silhouette */}
        <path
          d="M 800 360 Q 1100 300 1140 500 Q 1040 760 920 900 Q 820 720 800 520 Z"
          fill="#1E293B"
          opacity={0.4}
        />

        {/* Official Infographic Card */}
        <g transform="translate(960, 480)">
          <rect
            x={-460}
            y={-220}
            width={920}
            height={440}
            rx={28}
            fill="#1E293B"
            stroke="#475569"
            strokeWidth={7}
          />

          <text x={0} y={-140} fill="#94A3B8" fontSize={24} fontWeight="900" textAnchor="middle" letterSpacing={3}>
            WORLD HEALTH ORGANIZATION (2024 REPORT)
          </text>
          <line x1={-380} y1={-105} x2={380} y2={-105} stroke="#334155" strokeWidth={3} />

          {/* Huge Mortality Number */}
          <text
            x={0}
            y={0}
            fill="#EF4444"
            fontSize={84}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Impact', sans-serif"
            letterSpacing={4}
          >
            {counterVal.toLocaleString()}
          </text>
          <text x={0} y={55} fill="#FFFFFF" fontSize={28} fontWeight="900" textAnchor="middle">
            ESTIMATED DEATHS FROM MALARIA ALONE
          </text>

          {/* Children Under 5 Subtext */}
          <rect x={-360} y={95} width={720} height={60} rx={14} fill="#DC2626" opacity={0.2} />
          <text x={0} y={135} fill="#FCA5A5" fontSize={22} fontWeight="900" textAnchor="middle">
            DEVASTATING SHARE: CHILDREN UNDER 5 IN AFRICA
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🔒 SCENE 3: Olfactory Receptor Lock Mechanism (Beats 7 & 8)
 */
export const ZennOlfactoryReceptorLockScene: React.FC = () => {
  const frame = useCurrentFrame();
  const isLocked = frame > 45;

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Antenna Receptor Membrane Wall */}
        <path
          d="M 200 680 C 600 660 1300 660 1720 680 L 1720 900 L 200 900 Z"
          fill="#334155"
          stroke={INK_BLACK}
          strokeWidth={8}
        />

        {/* Olfactory Receptor Pocket (The Lock) */}
        <g transform="translate(960, 680)">
          {/* U-shaped protein pocket */}
          <path
            d="M -120 -100 L -120 40 C -120 140 120 140 120 40 L 120 -100"
            stroke="#38BDF8"
            strokeWidth={14}
            fill="#0F172A"
            strokeLinecap="round"
          />
          <text x={0} y={100} fill="#38BDF8" fontSize={22} fontWeight="900" textAnchor="middle">
            ODOR RECEPTOR
          </text>
        </g>

        {/* Disruptor Molecule Snapping In (The Blocker Key) */}
        <g transform={`translate(960, ${isLocked ? 620 : 340})`}>
          {/* Blocker Molecule Shape */}
          <polygon
            points="0,-40 60,0 40,70 -40,70 -60,0"
            fill={isLocked ? '#EF4444' : '#10B981'}
            stroke={INK_BLACK}
            strokeWidth={6}
          />
          <text x={0} y={30} fill="#FFFFFF" fontSize={20} fontWeight="900" textAnchor="middle">
            {isLocked ? 'BLOCKED!' : 'TRAP / DISRUPTOR'}
          </text>
        </g>

        {/* Header Banner */}
        <g transform="translate(960, 140)">
          <rect
            x={-340}
            y={-38}
            width={680}
            height={76}
            rx={38}
            fill={isLocked ? '#EF4444' : '#10B981'}
            stroke="#FFFFFF"
            strokeWidth={4.5}
          />
          <text
            x={0}
            y={10}
            fill="#FFFFFF"
            fontSize={25}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            {isLocked ? 'SEARCH DISRUPTED: SIGNAL BLOCKED 🛑' : 'TARGETING RECEPTORS TO INTERRUPT SEARCH 🔑'}
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🛑 SCENE 4: Restaurant Closed Neon Sign (Beat 10)
 */
export const ZennRestaurantClosedSignScene: React.FC = () => {
  const frame = useCurrentFrame();
  const flick = frame % 8 < 4;

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0F172A', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Host Stickman on Left Looking Relieved */}
        <g transform="translate(680, 560)">
          <ZennStickman
            x={0}
            y={0}
            scale={1.25}
            hasSpikyHair
            shirtColor="#2563EB"
            eyes="normal"
            eyebrows="neutral"
            mouth="smirk"
            pose="standing_idle"
          />
        </g>

        {/* Mosquito Flying Away Confused on Right */}
        <g transform="translate(1420, 460)">
          <ZennMosquito x={0} y={0} scale={1.3} facing="right" angle={-20} />
          <text x={80} y={-30} fill="#FACC15" fontSize={28} fontWeight="900">
            "NO FOOD?!" ❓
          </text>
        </g>

        {/* Massive Glowing Neon "RESTAURANT CLOSED" Sign */}
        <g transform="translate(960, 240)">
          <rect
            x={-420}
            y={-100}
            width={840}
            height={200}
            rx={24}
            fill="#020617"
            stroke={flick ? '#EF4444' : '#7F1D1D'}
            strokeWidth={8}
          />
          <text
            x={0}
            y={-10}
            fill={flick ? '#F87171' : '#B91C1C'}
            fontSize={54}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Impact', sans-serif"
            letterSpacing={4}
          >
            RESTAURANT CLOSED
          </text>
          <text
            x={0}
            y={55}
            fill="#FACC15"
            fontSize={30}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            🛑 SCIENCE TURNS OFF THE BUFFET 🛑
          </text>
        </g>
      </svg>
    </div>
  );
};
