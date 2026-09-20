import React from 'react';
import { interpolate, useCurrentFrame } from 'remotion';
import { ZennDetailedMosquito, INK } from './ZennMasterComponents';

// Warm Palette Constants
export const PARCHMENT_BG = '#FEF3C7';
export const PARCHMENT_DARK = '#FDE68A';
export const PARCHMENT_LINE = '#78350F';
export const INK_DARK = '#18181B';
export const COMIC_RED = '#DC2626';

/**
 * 🏆 SCENE 1: Champion Podium Comparison (Beat 1: 0 - 256f)
 * "Deadliest animal on Earth — not sharks, not lions."
 * Hand-drawn Olympic podium: Terrified cartoon shark & lion, tiny mosquito #1 with crown.
 */
export const ZennPedestalComparisonScene: React.FC = () => {
  const frame = useCurrentFrame();

  const sharkShake = Math.sin(frame * 0.7) * 4;
  const lionShake = Math.cos(frame * 0.65) * 4;
  const mosquitoHover = Math.sin(frame * 0.25) * 8;
  const crownGleam = Math.sin(frame * 0.3) * 10;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Parchment Wall */}
      <rect x={0} y={0} width={1920} height={720} fill={PARCHMENT_BG} />
      {/* Dark Umber Wooden Arena Floor */}
      <rect x={0} y={720} width={1920} height={360} fill="#78350F" />
      <line x1={0} y1={720} x2={1920} y2={720} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

      {/* Decorative Hand-Drawn Arena Bunting / Pennant Flags */}
      <g>
        <path d="M 0 60 Q 480 140 960 70 Q 1440 140 1920 60" fill="none" stroke={INK_DARK} strokeWidth={4} />
        {Array.from({ length: 14 }).map((_, i) => {
          const fx = 80 + i * 130;
          const fy = 65 + Math.sin((fx / 1920) * Math.PI) * 45;
          const colors = ['#EF4444', '#3B82F6', '#FACC15', '#10B981', '#8B5CF6'];
          return (
            <polygon
              key={i}
              points={`${fx - 25},${fy} ${fx + 25},${fy} ${fx},${fy + 65}`}
              fill={colors[i % colors.length]}
              stroke={INK_DARK}
              strokeWidth={3.5}
              strokeLinejoin="round"
            />
          );
        })}
      </g>

      {/* Podium Structure */}
      {/* #2 Left Podium (Silver / Gray) */}
      <g transform="translate(520, 720)">
        <polygon points="-160,0 160,0 180,240 -180,240" fill="#CBD5E1" stroke={INK_DARK} strokeWidth={6} strokeLinejoin="round" />
        <rect x={-140} y={30} width={280} height={170} rx={10} fill="#94A3B8" stroke={INK_DARK} strokeWidth={4} />
        <text x={0} y={150} fill="#1E293B" fontSize={110} fontWeight="900" fontFamily="'Comic Sans MS', cursive" textAnchor="middle">
          #2
        </text>
        <text x={0} y={215} fill="#FEF3C7" fontSize={26} fontWeight="bold" textAnchor="middle">
          SHARK (~10 / YR)
        </text>
      </g>

      {/* #3 Right Podium (Bronze / Brown) */}
      <g transform="translate(1400, 720)">
        <polygon points="-160,50 160,50 175,240 -175,240" fill="#D1D5DB" stroke={INK_DARK} strokeWidth={6} strokeLinejoin="round" />
        <rect x={-130} y={75} width={260} height={130} rx={10} fill="#94A3B8" stroke={INK_DARK} strokeWidth={4} />
        <text x={0} y={165} fill="#1E293B" fontSize={95} fontWeight="900" fontFamily="'Comic Sans MS', cursive" textAnchor="middle">
          #3
        </text>
        <text x={0} y={220} fill="#FEF3C7" fontSize={26} fontWeight="bold" textAnchor="middle">
          LION (~100 / YR)
        </text>
      </g>

      {/* #1 Center Podium (Gold / Champion - Tallest) */}
      <g transform="translate(960, 620)">
        <polygon points="-180,-30 180,-30 200,340 -200,340" fill="#FDE047" stroke={INK_DARK} strokeWidth={6.5} strokeLinejoin="round" />
        <rect x={-150} y={15} width={300} height={260} rx={12} fill="#FACC15" stroke={INK_DARK} strokeWidth={4.5} />
        <text x={0} y={185} fill="#78350F" fontSize={160} fontWeight="900" fontFamily="'Comic Sans MS', cursive" textAnchor="middle">
          #1
        </text>
        <text x={0} y={245} fill="#78350F" fontSize={30} fontWeight="900" textAnchor="middle">
          MOSQUITO
        </text>
      </g>

      {/* ============================================================== */}
      {/* 🦈 Cartoon Shark on #2 Podium (Terrified!)                     */}
      {/* ============================================================== */}
      <g transform={`translate(${520 + sharkShake}, 640)`}>
        {/* Shark Body & Tail (sitting awkwardly upright) */}
        <path
          d="M -90 40 C -120 -60 -50 -160 10 -180 C 70 -160 100 -60 70 40 C 50 70 -70 70 -90 40 Z"
          fill="#64748B"
          stroke={INK_DARK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        {/* White Belly */}
        <path d="M -50 40 C -70 -30 -30 -120 10 -150 C 40 -120 55 -30 45 40 Z" fill="#F8FAFC" stroke={INK_DARK} strokeWidth={3} />
        {/* Dorsal Fin */}
        <polygon points="-85,-60 -160,-90 -95,-10" fill="#475569" stroke={INK_DARK} strokeWidth={4.5} strokeLinejoin="round" />
        {/* Pectoral Fins (Trembling!) */}
        <polygon points="65,-20 140,-10 80,30" fill="#475569" stroke={INK_DARK} strokeWidth={4} strokeLinejoin="round" />

        {/* Terrified Cartoon Eyes looking UP at mosquito */}
        <circle cx={-15} cy={-135} r={22} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={4} />
        <circle cx={-10} cy={-145} r={8} fill={INK_DARK} />
        <circle cx={30} cy={-135} r={22} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={4} />
        <circle cx={35} cy={-145} r={8} fill={INK_DARK} />

        {/* Shivering Worried Mouth with Chattering Teeth */}
        <path d="M -30 -75 Q 10 -60 45 -75" stroke={INK_DARK} strokeWidth={4.5} fill="none" strokeLinecap="round" />
        {[-20, -5, 10, 25, 38].map((tx, idx) => (
          <polygon key={idx} points={`${tx - 5},-75 ${tx + 5},-75 ${tx},-62`} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={2} />
        ))}

        {/* Flying Cartoon Sweat Drops */}
        <path d="M -80 -150 C -75 -170 -85 -170 -80 -180 C -75 -170 -65 -170 -80 -150 Z" fill="#38BDF8" stroke={INK_DARK} strokeWidth={2} />
        <path d="M 85 -160 C 90 -180 80 -180 85 -190 C 90 -180 100 -180 85 -160 Z" fill="#38BDF8" stroke={INK_DARK} strokeWidth={2} />
      </g>

      {/* ============================================================== */}
      {/* 🦁 Cartoon Lion on #3 Podium (Terrified!)                      */}
      {/* ============================================================== */}
      <g transform={`translate(${1400 + lionShake}, 690)`}>
        {/* Fluffy Round Mane */}
        <circle cx={0} cy={-120} r={95} fill="#B45309" stroke={INK_DARK} strokeWidth={5.5} />
        {/* Lion Face */}
        <circle cx={0} cy={-120} r={65} fill="#FDE047" stroke={INK_DARK} strokeWidth={4.5} />
        {/* Round Ears */}
        <circle cx={-50} cy={-175} r={22} fill="#FDE047" stroke={INK_DARK} strokeWidth={4} />
        <circle cx={-50} cy={-175} r={12} fill="#B45309" />
        <circle cx={50} cy={-175} r={22} fill="#FDE047" stroke={INK_DARK} strokeWidth={4} />
        <circle cx={50} cy={-175} r={12} fill="#B45309" />

        {/* Trembling Cartoon Eyes looking UP and Left at mosquito */}
        <circle cx={-24} cy={-135} r={18} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3.5} />
        <circle cx={-30} cy={-143} r={6.5} fill={INK_DARK} />
        <circle cx={20} cy={-135} r={18} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3.5} />
        <circle cx={14} cy={-143} r={6.5} fill={INK_DARK} />

        {/* Brown Nose & Worried Mouth */}
        <polygon points="-12,-112 12,-112 0,-98" fill="#78350F" stroke={INK_DARK} strokeWidth={2.5} />
        <path d="M -22 -85 Q 0 -95 22 -85" stroke={INK_DARK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Lion Paws up to face trembling */}
        <ellipse cx={-45} cy={-70} rx={22} ry={16} fill="#FDE047" stroke={INK_DARK} strokeWidth={3.5} />
        <ellipse cx={45} cy={-70} rx={22} ry={16} fill="#FDE047" stroke={INK_DARK} strokeWidth={3.5} />

        {/* Lion Body sitting */}
        <path d="M -55 -40 L -70 50 L 70 50 L 55 -40 Z" fill="#FDE047" stroke={INK_DARK} strokeWidth={4.5} />

        {/* Sweat Droplet */}
        <path d="M 65 -180 C 70 -200 60 -200 65 -210 C 70 -200 80 -200 65 -180 Z" fill="#38BDF8" stroke={INK_DARK} strokeWidth={2} />
      </g>

      {/* ============================================================== */}
      {/* 🦟 Mosquito #1 Champion Hovering Proudly with Golden Crown     */}
      {/* ============================================================== */}
      <g transform={`translate(960, ${440 + mosquitoHover})`}>
        {/* Golden Champion Aura / Radial Glow */}
        <circle cx={0} cy={0} r={160} fill="#FEF08A" opacity={0.35} />
        <circle cx={0} cy={0} r={110} fill="#FDE047" opacity={0.4} />

        {/* Sparkle Glints */}
        {[
          { x: -140, y: -90, s: 1 },
          { x: 140, y: -70, s: 0.8 },
          { x: -100, y: 80, s: 0.9 },
          { x: 120, y: 90, s: 1.1 },
        ].map((sp, idx) => (
          <g key={idx} transform={`translate(${sp.x}, ${sp.y}) scale(${sp.s})`}>
            <line x1={-15} y1={0} x2={15} y2={0} stroke="#D97706" strokeWidth={3.5} strokeLinecap="round" />
            <line x1={0} y1={-15} x2={0} y2={15} stroke="#D97706" strokeWidth={3.5} strokeLinecap="round" />
          </g>
        ))}

        {/* Zenn Cartoon Mosquito (Slightly Angled) */}
        <g transform="rotate(-5)">
          <ZennDetailedMosquito scale={1.8} facing="left" />
        </g>

        {/* Tiny Golden Crown on Mosquito Head */}
        <g transform={`translate(-50, -45) rotate(${-15 + crownGleam * 0.4})`}>
          <polygon
            points="-25,12 25,12 28,-18 10,-5 0,-25 -10,-5 -28,-18"
            fill="#FACC15"
            stroke={INK_DARK}
            strokeWidth={3.5}
            strokeLinejoin="round"
          />
          <circle cx={-28} cy={-18} r={3.5} fill="#EF4444" stroke={INK_DARK} strokeWidth={1} />
          <circle cx={0} cy={-25} r={4} fill="#3B82F6" stroke={INK_DARK} strokeWidth={1} />
          <circle cx={28} cy={-18} r={3.5} fill="#EF4444" stroke={INK_DARK} strokeWidth={1} />
        </g>
      </g>

      {/* Hand-Drawn Comic Stamp Banner at Top */}
      <g transform="translate(960, 140)">
        <path
          d="M -320 -40 Q 0 -55 320 -40 L 305 45 Q 0 35 -305 45 Z"
          fill="#FEF3C7"
          stroke={INK_DARK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <text
          x={0}
          y={15}
          fill={COMIC_RED}
          fontSize={44}
          fontWeight="900"
          fontFamily="'Comic Sans MS', cursive"
          textAnchor="middle"
          letterSpacing={1.5}
        >
          #1 DEADLIEST ANIMAL ON EARTH
        </text>
      </g>
    </svg>
  );
};

/**
 * 🗺️ SCENE 2: Vintage Global Map & 725,000 Deaths (Beat 2: 256 - 488f)
 * "Estimated 725,000 deaths a year, mostly through malaria and dengue."
 * Warm vintage parchment cartography, red blinking impact points, mosquito shadow.
 */
export const ZennGlobalImpactMapScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Vintage Aged Parchment Map Canvas */}
      <rect x={0} y={0} width={1920} height={1080} fill="#FDF6E2" />

      {/* Cartography Longitude & Latitude Graticule Lines */}
      <g stroke="#E4D5B7" strokeWidth={2} strokeDasharray="6 8" fill="none">
        <line x1={120} y1={200} x2={1800} y2={200} />
        <line x1={120} y1={400} x2={1800} y2={400} />
        <line x1={120} y1={540} x2={1800} y2={540} stroke="#D1BE9B" strokeWidth={3} />
        <line x1={120} y1={680} x2={1800} y2={680} />
        <line x1={120} y1={880} x2={1800} y2={880} />

        <path d="M 450 120 Q 400 540 450 960" />
        <path d="M 850 120 Q 800 540 850 960" />
        <path d="M 1250 120 Q 1200 540 1250 960" />
        <path d="M 1650 120 Q 1600 540 1650 960" />
      </g>

      {/* Vintage Map Border Frame */}
      <rect x={80} y={80} width={1760} height={920} fill="none" stroke={PARCHMENT_LINE} strokeWidth={8} rx={16} />
      <rect x={95} y={95} width={1730} height={890} fill="none" stroke={PARCHMENT_LINE} strokeWidth={2} rx={12} />

      {/* Compass Rose in Upper Right */}
      <g transform="translate(1680, 220)">
        <circle cx={0} cy={0} r={65} fill="#FFFBEB" stroke={PARCHMENT_LINE} strokeWidth={3} />
        <polygon points="0,-60 14,-15 60,0 15,14 0,60 -14,15 -60,0 -15,-14" fill="#B45309" stroke={INK_DARK} strokeWidth={2.5} />
        <polygon points="0,-60 14,-15 0,0" fill="#78350F" />
        <polygon points="60,0 15,14 0,0" fill="#78350F" />
        <polygon points="0,60 -14,15 0,0" fill="#78350F" />
        <polygon points="-60,0 -15,-14 0,0" fill="#78350F" />
        <text x={0} y={-68} fill={PARCHMENT_LINE} fontSize={20} fontWeight="900" textAnchor="middle">N</text>
      </g>

      {/* Hand-Drawn Continents (Warm Earth Tones) */}
      {/* 1. North America */}
      <path
        d="M 320 220 C 390 200 480 240 450 320 C 430 360 360 410 320 460 C 300 480 260 440 240 370 C 220 300 270 240 320 220 Z"
        fill="#FDE68A"
        stroke={PARCHMENT_LINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* 2. South America */}
      <path
        d="M 420 500 C 480 520 510 590 480 670 C 450 750 410 820 390 850 C 370 820 360 720 370 630 C 380 550 390 510 420 500 Z"
        fill="#FDE68A"
        stroke={PARCHMENT_LINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* 3. Europe */}
      <path
        d="M 850 220 C 920 210 970 240 960 300 C 940 340 880 360 840 340 C 810 320 810 260 850 220 Z"
        fill="#FDE68A"
        stroke={PARCHMENT_LINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* 4. Africa (Prominent & Central) */}
      <path
        d="M 860 380 C 970 380 1020 470 1000 580 C 980 680 940 780 900 830 C 860 780 840 680 820 580 C 800 480 820 390 860 380 Z"
        fill="#FCD34D"
        stroke={PARCHMENT_LINE}
        strokeWidth={4.5}
        strokeLinejoin="round"
      />
      {/* 5. Asia */}
      <path
        d="M 1000 240 C 1140 200 1350 220 1420 310 C 1450 400 1380 510 1280 540 C 1220 560 1140 500 1100 440 C 1060 380 980 310 1000 240 Z"
        fill="#FDE68A"
        stroke={PARCHMENT_LINE}
        strokeWidth={4}
        strokeLinejoin="round"
      />
      {/* 6. Southeast Asia & Islands */}
      <path d="M 1290 560 C 1340 580 1380 640 1350 670 C 1320 700 1260 660 1250 610 Z" fill="#FCD34D" stroke={PARCHMENT_LINE} strokeWidth={3} />
      <path d="M 1390 660 C 1430 670 1450 710 1410 730 C 1370 740 1350 700 1390 660 Z" fill="#FCD34D" stroke={PARCHMENT_LINE} strokeWidth={3} />

      {/* Dramatic Ominous Mosquito Shadow Cast Over Continents */}
      <g transform="translate(940, 520) scale(3.2)" opacity={0.16}>
        <path
          d="M 15 15 C 35 5 70 15 70 35 C 70 55 35 60 15 45 Z"
          fill={INK_DARK}
        />
        <circle cx={-18} cy={35} r={14} fill={INK_DARK} />
        <polygon points="-30,34 -85,68 -28,40" fill={INK_DARK} />
        <ellipse cx={-25} cy={-25} rx={55} ry={20} transform="rotate(35 -25 -25)" fill={INK_DARK} />
        <ellipse cx={-20} cy={-30} rx={55} ry={20} transform="rotate(20 -20 -30)" fill={INK_DARK} />
      </g>

      {/* Blinking / Radiating Red Disease Hotspots */}
      {[
        { x: 910, y: 550, label: 'Sub-Saharan Africa' },
        { x: 880, y: 650, label: 'Central Africa' },
        { x: 440, y: 610, label: 'Amazon Basin' },
        { x: 1220, y: 470, label: 'South Asia' },
        { x: 1320, y: 610, label: 'Southeast Asia' },
      ].map((pt, idx) => {
        const pulseR = 12 + ((frame * 1.5 + idx * 18) % 40);
        const pulseAlpha = Math.max(0, 1 - pulseR / 40);
        return (
          <g key={idx} transform={`translate(${pt.x}, ${pt.y})`}>
            <circle cx={0} cy={0} r={pulseR} fill="none" stroke="#EF4444" strokeWidth={3} opacity={pulseAlpha} />
            <circle cx={0} cy={0} r={9} fill="#DC2626" stroke="#FFFFFF" strokeWidth={2.5} />
          </g>
        );
      })}

      {/* Bold Hand-Drawn Headline Card in Center-Top */}
      <g transform="translate(960, 190)">
        <polygon
          points="-360,-65 360,-65 350,65 -350,65"
          fill="#18181B"
          stroke="#DC2626"
          strokeWidth={6}
          strokeLinejoin="round"
        />
        <text
          x={0}
          y={-5}
          fill="#EF4444"
          fontSize={68}
          fontWeight="900"
          fontFamily="'Comic Sans MS', cursive"
          textAnchor="middle"
        >
          ~725,000
        </text>
        <text
          x={0}
          y={44}
          fill="#FEF3C7"
          fontSize={24}
          fontWeight="bold"
          letterSpacing={2}
          textAnchor="middle"
        >
          HUMAN DEATHS EVERY YEAR
        </text>
      </g>

      {/* Hand-Drawn Comic Notes at Bottom */}
      <g transform="translate(960, 930)">
        {/* Malaria Tag */}
        <g transform="translate(-280, 0)">
          <rect x={-180} y={-35} width={360} height={70} rx={12} fill="#FEF3C7" stroke={INK_DARK} strokeWidth={4} />
          <circle cx={-135} cy={0} r={10} fill="#DC2626" />
          <text x={10} y={10} fill={INK_DARK} fontSize={24} fontWeight="900" textAnchor="middle">
            MALARIA (~600K)
          </text>
        </g>
        {/* Dengue Tag */}
        <g transform="translate(280, 0)">
          <rect x={-180} y={-35} width={360} height={70} rx={12} fill="#FEF3C7" stroke={INK_DARK} strokeWidth={4} />
          <circle cx={-135} cy={0} r={10} fill="#F59E0B" />
          <text x={10} y={10} fill={INK_DARK} fontSize={24} fontWeight="900" textAnchor="middle">
            DENGUE, YELLOW FEVER
          </text>
        </g>
      </g>
    </svg>
  );
};

/**
 * 🏛️ SCENE 3: Roman Legionary in Pontine Marshes (Beat 3: 488 - 718f)
 * "Outbreaks contributed to the fall of Rome."
 * Roman Colosseum / arches backdrop, shivering soldier with shield swatting mosquitoes in swamp.
 */
export const ZennRomanLegionScene: React.FC = () => {
  const frame = useCurrentFrame();

  const shiver = Math.sin(frame * 0.9) * 3.5;
  const swatArm = Math.sin(frame * 0.4) * 25;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Mediterranean Sunset Ochre Sky */}
      <rect x={0} y={0} width={1920} height={680} fill="#FED7AA" />
      {/* Marshy Murky Wetland Ground */}
      <rect x={0} y={680} width={1920} height={400} fill="#4D5D28" />
      <line x1={0} y1={680} x2={1920} y2={680} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

      {/* Distant Roman Colosseum / Aqueduct Arches Silhouette */}
      <g transform="translate(420, 480)" opacity={0.75}>
        {/* Roman Stone Aqueduct Piers */}
        {[-250, -100, 50, 200, 350, 500].map((px, idx) => (
          <g key={idx} transform={`translate(${px}, 0)`}>
            <rect x={-25} y={-140} width={50} height={140} fill="#9A3412" stroke={INK_DARK} strokeWidth={4} />
            <path d="M -25 -140 Q 0 -180 25 -140" fill="#FED7AA" stroke={INK_DARK} strokeWidth={4} />
            <line x1={-60} y1={-180} x2={60} y2={-180} stroke={INK_DARK} strokeWidth={5} />
            <rect x={-60} y={-210} width={120} height={30} fill="#9A3412" stroke={INK_DARK} strokeWidth={4} />
          </g>
        ))}
      </g>

      {/* Marsh Water Puddles & Tall Cattail Reeds */}
      <g>
        <ellipse cx={820} cy={760} rx={160} ry={35} fill="#65A30D" opacity={0.6} />
        <ellipse cx={1380} cy={820} rx={220} ry={45} fill="#65A30D" opacity={0.6} />

        {/* Tall Swamp Reeds */}
        {[200, 280, 680, 750, 1500, 1620, 1750].map((rx, idx) => (
          <g key={idx} transform={`translate(${rx}, 680)`}>
            <line x1={0} y1={0} x2={-10} y2={-90} stroke="#365314" strokeWidth={5} strokeLinecap="round" />
            <line x1={15} y1={0} x2={25} y2={-110} stroke="#365314" strokeWidth={5} strokeLinecap="round" />
            <ellipse cx={-10} cy={-95} rx={6} ry={22} fill="#78350F" stroke={INK_DARK} strokeWidth={2} />
            <ellipse cx={25} cy={-115} rx={6} ry={24} fill="#78350F" stroke={INK_DARK} strokeWidth={2} />
          </g>
        ))}
      </g>

      {/* ============================================================== */}
      {/* ⚔️ Stickman Roman Legionary (Shivering & Swatting)              */}
      {/* ============================================================== */}
      <g transform={`translate(${1080 + shiver}, 540)`}>
        {/* Red Cape Flowing Behind */}
        <path
          d="M -30 65 Q -80 180 -110 280 L -35 270 Q -10 180 0 65 Z"
          fill="#DC2626"
          stroke={INK_DARK}
          strokeWidth={5}
          strokeLinejoin="round"
        />

        {/* Head */}
        <circle cx={0} cy={0} r={55} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5.5} />

        {/* Galea Roman Helmet with Red Horsehair Crest */}
        <g>
          {/* Bronze Helmet Cap */}
          <path d="M -55 -10 Q 0 -85 55 -10 L 52 15 Q 0 5 -52 15 Z" fill="#D97706" stroke={INK_DARK} strokeWidth={5} />
          {/* Cheek Guards */}
          <polygon points="-52,15 -35,50 -48,52 -56,20" fill="#B45309" stroke={INK_DARK} strokeWidth={3} />
          <polygon points="52,15 35,50 48,52 56,20" fill="#B45309" stroke={INK_DARK} strokeWidth={3} />
          {/* Red Crest on top */}
          <path d="M -40 -70 Q 0 -130 40 -70 Q 0 -95 -40 -70 Z" fill="#EF4444" stroke={INK_DARK} strokeWidth={4.5} />
        </g>

        {/* Miserable Sick Face (Fever / Teeth Chattering) */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3} />
        <circle cx={-18} cy={-6} r={5} fill={INK_DARK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3} />
        <circle cx={18} cy={-6} r={5} fill={INK_DARK} />
        <line x1={-28} y1={-26} x2={-8} y2={-18} stroke={INK_DARK} strokeWidth={4} strokeLinecap="round" />
        <line x1={8} y1={-18} x2={28} y2={-26} stroke={INK_DARK} strokeWidth={4} strokeLinecap="round" />
        {/* Chattering teeth zigzag */}
        <path d="M -18 25 L -10 20 L -2 25 L 6 20 L 14 25" stroke={INK_DARK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Flying Sweat Drops (Malaria Fever) */}
        <circle cx={-65} cy={-10} r={6} fill="#38BDF8" stroke={INK_DARK} strokeWidth={1.5} />
        <circle cx={65} cy={0} r={6} fill="#38BDF8" stroke={INK_DARK} strokeWidth={1.5} />

        {/* Stick Body & Roman Tunic / Segmentata armor */}
        <rect x={-32} y={55} width={64} height={110} rx={8} fill="#B45309" stroke={INK_DARK} strokeWidth={5} />
        <line x1={0} y1={165} x2={-25} y2={290} stroke={INK_DARK} strokeWidth={6.5} strokeLinecap="round" />
        <line x1={-25} y1={290} x2={-45} y2={290} stroke={INK_DARK} strokeWidth={6.5} strokeLinecap="round" />
        <line x1={0} y1={165} x2={25} y2={290} stroke={INK_DARK} strokeWidth={6.5} strokeLinecap="round" />
        <line x1={25} y1={290} x2={45} y2={290} stroke={INK_DARK} strokeWidth={6.5} strokeLinecap="round" />

        {/* Left Arm Holding Curved Scutum Shield */}
        <g transform="translate(-80, 90)">
          {/* Curved Rectangular Red Roman Shield */}
          <rect x={-50} y={-90} width={100} height={180} rx={16} fill="#DC2626" stroke={INK_DARK} strokeWidth={6} />
          {/* Golden Boss in center */}
          <circle cx={0} cy={0} r={22} fill="#FACC15" stroke={INK_DARK} strokeWidth={4} />
          {/* Wing / Lightning Bolt Motifs */}
          <path d="M -35 -45 L 0 -15 L 35 -45" stroke="#FACC15" strokeWidth={4} fill="none" strokeLinecap="round" />
          <path d="M -35 45 L 0 15 L 35 45" stroke="#FACC15" strokeWidth={4} fill="none" strokeLinecap="round" />
        </g>

        {/* Right Arm Swatting at Helmet & Ears */}
        <g stroke={INK_DARK} strokeWidth={6.5} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={80} x2={50} y2={70 + swatArm * 0.5} />
          <line x1={50} y1={70 + swatArm * 0.5} x2={40 + swatArm} y2={-10} />
        </g>
      </g>

      {/* Swarm of Roman Marsh Mosquitoes */}
      <g transform={`translate(${1190 + Math.sin(frame * 0.3) * 20}, ${440 + Math.cos(frame * 0.4) * 20})`}>
        <ZennDetailedMosquito scale={1.2} facing="left" />
      </g>
      <g transform={`translate(${940 + Math.cos(frame * 0.25) * 25}, ${380 + Math.sin(frame * 0.3) * 15})`}>
        <ZennDetailedMosquito scale={1.15} facing="right" />
      </g>
      <g transform={`translate(${1280 + Math.sin(frame * 0.2) * 20}, ${510 + Math.cos(frame * 0.2) * 20})`}>
        <ZennDetailedMosquito scale={1.0} facing="left" />
      </g>

      {/* Ancient Roman Inscription Stone Marker */}
      <g transform="translate(340, 880)">
        <polygon points="-160,-40 160,-40 170,45 -170,45" fill="#E2E8F0" stroke={INK_DARK} strokeWidth={5} strokeLinejoin="round" />
        <text x={0} y={-5} fill="#1E293B" fontSize={26} fontWeight="900" fontFamily="'Georgia', serif" textAnchor="middle">
          ROMA • 400 AD
        </text>
        <text x={0} y={28} fill="#78350F" fontSize={18} fontWeight="bold" textAnchor="middle">
          PONTINE MARSHES
        </text>
      </g>
    </svg>
  );
};

/**
 * ⚖️ SCENE 4: Historical Balance Scale (Beat 4: 718 - 867f)
 * "Likely killed more soldiers in the American Civil War than bullets did."
 * Civil War encampment, large balance scale tipped: left has bullet, right has heavy swarm of mosquitoes.
 */
export const ZennCivilWarBalanceScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* 1860s Camp Atmosphere Background */}
      <rect x={0} y={0} width={1920} height={700} fill="#EFE8D8" />
      <rect x={0} y={700} width={1920} height={380} fill="#5C4033" />
      <line x1={0} y1={700} x2={1920} y2={700} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

      {/* Civil War Canvas A-Frame Tents in Background */}
      <g transform="translate(360, 690)">
        <polygon points="0,-220 -150,0 150,0" fill="#E5DCC5" stroke={INK_DARK} strokeWidth={5} strokeLinejoin="round" />
        <polygon points="0,-220 0,0 -80,0" fill="#D3C7AE" stroke={INK_DARK} strokeWidth={4} />
      </g>
      <g transform="translate(1600, 690)">
        <polygon points="0,-200 -140,0 140,0" fill="#E5DCC5" stroke={INK_DARK} strokeWidth={5} strokeLinejoin="round" />
        <polygon points="0,-200 0,0 70,0" fill="#D3C7AE" stroke={INK_DARK} strokeWidth={4} />
      </g>

      {/* Wooden Table on which the scale rests */}
      <g transform="translate(960, 710)">
        <polygon points="-620,0 620,0 580,50 -580,50" fill="#8D5B3A" stroke={INK_DARK} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-520} y={50} width={60} height={260} fill="#6E4226" stroke={INK_DARK} strokeWidth={5} />
        <rect x={460} y={50} width={60} height={260} fill="#6E4226" stroke={INK_DARK} strokeWidth={5} />
      </g>

      {/* ============================================================== */}
      {/* ⚖️ Massive Brass Balance Scale Tilted Down to the Right!       */}
      {/* ============================================================== */}
      <g transform="translate(960, 520)">
        {/* Scale Base & Central Column Pillar */}
        <polygon points="-120,190 120,190 60,160 -60,160" fill="#B45309" stroke={INK_DARK} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-20} y={-80} width={40} height={240} fill="#D97706" stroke={INK_DARK} strokeWidth={5} rx={6} />
        {/* Central Pivot Fulcrum Ring */}
        <circle cx={0} cy={-80} r={32} fill="#FDE047" stroke={INK_DARK} strokeWidth={5} />
        <circle cx={0} cy={-80} r={12} fill="#78350F" />

        {/* Tilted Main Crossbeam (Angled ~ -16 degrees down to right) */}
        <g transform="rotate(16)">
          <rect x={-420} y={-92} width={840} height={24} rx={6} fill="#D97706" stroke={INK_DARK} strokeWidth={5} />

          {/* Left Pan (Suspended HIGH in air) */}
          <g transform="translate(-400, -80) rotate(-16)">
            {/* Chains */}
            <line x1={0} y1={0} x2={-80} y2={160} stroke={INK_DARK} strokeWidth={3.5} strokeDasharray="6 4" />
            <line x1={0} y1={0} x2={80} y2={160} stroke={INK_DARK} strokeWidth={3.5} strokeDasharray="6 4" />
            {/* Shallow Brass Pan */}
            <path d="M -110 160 Q 0 210 110 160 Z" fill="#FDE047" stroke={INK_DARK} strokeWidth={5} />

            {/* Left Cargo: Heavy Lead Bullet (Minie Ball) */}
            <g transform="translate(0, 110)">
              <path
                d="M -30 40 L -30 -10 Q 0 -60 30 -10 L 30 40 Z"
                fill="#64748B"
                stroke={INK_DARK}
                strokeWidth={4.5}
                strokeLinejoin="round"
              />
              <line x1={-30} y1={10} x2={30} y2={10} stroke="#475569" strokeWidth={3} />
              <line x1={-30} y1={25} x2={30} y2={25} stroke="#475569" strokeWidth={3} />
            </g>

            {/* Comic Label on Left */}
            <g transform="translate(0, 240)">
              <rect x={-140} y={-30} width={280} height={60} rx={10} fill="#FEF3C7" stroke={INK_DARK} strokeWidth={4} />
              <text x={0} y={10} fill="#1E293B" fontSize={24} fontWeight="900" textAnchor="middle">
                BULLETS (~200K)
              </text>
            </g>
          </g>

          {/* Right Pan (HEAVILY WEIGHED DOWN to table level) */}
          <g transform="translate(400, -80) rotate(-16)">
            {/* Chains */}
            <line x1={0} y1={0} x2={-80} y2={160} stroke={INK_DARK} strokeWidth={3.5} strokeDasharray="6 4" />
            <line x1={0} y1={0} x2={80} y2={160} stroke={INK_DARK} strokeWidth={3.5} strokeDasharray="6 4" />
            {/* Shallow Brass Pan */}
            <path d="M -110 160 Q 0 210 110 160 Z" fill="#FDE047" stroke={INK_DARK} strokeWidth={5} />

            {/* Right Cargo: A Huge Buzzing Pile / Swarm of Mosquitoes! */}
            <g transform="translate(0, 110)">
              {/* Stacked cartoon mosquitoes */}
              {[-45, 0, 45].map((mx, idx) => (
                <g key={idx} transform={`translate(${mx}, ${idx === 1 ? -25 : 10})`}>
                  <ZennDetailedMosquito scale={0.75} facing={idx % 2 === 0 ? 'left' : 'right'} />
                </g>
              ))}
              {[-30, 30].map((mx, idx) => (
                <g key={idx} transform={`translate(${mx}, -50)`}>
                  <ZennDetailedMosquito scale={0.7} facing={idx === 0 ? 'right' : 'left'} />
                </g>
              ))}
            </g>

            {/* Comic Label on Right */}
            <g transform="translate(0, 240)">
              <rect x={-150} y={-30} width={300} height={60} rx={10} fill="#FEE2E2" stroke="#DC2626" strokeWidth={4.5} />
              <text x={0} y={10} fill="#DC2626" fontSize={24} fontWeight="900" textAnchor="middle">
                DISEASE (~400K)
              </text>
            </g>
          </g>
        </g>
      </g>

      {/* Astonished Soldier on Left observing the scale */}
      <g transform="translate(240, 560)">
        <circle cx={0} cy={0} r={48} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5} />
        {/* Civil War Kepi Cap */}
        <polygon points="-52,-15 52,-15 35,-55 -35,-55" fill="#1E3A8A" stroke={INK_DARK} strokeWidth={4} strokeLinejoin="round" />
        <polygon points="-55,-15 0,-10 -55,-2" fill={INK_DARK} />
        {/* Shocked Eyes */}
        <circle cx={-15} cy={-2} r={14} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3} />
        <circle cx={-10} cy={-2} r={5} fill={INK_DARK} />
        <circle cx={18} cy={-2} r={14} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3} />
        <circle cx={23} cy={-2} r={5} fill={INK_DARK} />
        {/* Open O-mouth */}
        <ellipse cx={0} cy={26} rx={10} ry={15} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3} />
        {/* Body */}
        <line x1={0} y1={48} x2={0} y2={180} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={90} x2={50} y2={130} stroke={INK_DARK} strokeWidth={5.5} strokeLinecap="round" />
      </g>
    </svg>
  );
};

/**
 * 🛖 SCENE 5: Protective Bed Net & Ticking Clock (Beat 5: 867 - 1,111f)
 * "Sub-Saharan Africa: child under five dies roughly every two minutes."
 * Respectful, warm village bedroom, family safe under treated net, ticking clock.
 */
export const ZennBedNetClockScene: React.FC = () => {
  const frame = useCurrentFrame();

  const clockAngle = (frame * 5) % 360;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Adobe Village Interior Wall */}
      <rect x={0} y={0} width={1920} height={720} fill="#C26A3A" />
      {/* Warm Earthen Floor */}
      <rect x={0} y={720} width={1920} height={360} fill="#7C2D12" />
      <line x1={0} y1={720} x2={1920} y2={720} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

      {/* Hanging Golden Warm Lantern */}
      <g transform="translate(1550, 180)">
        <line x1={0} y1={-180} x2={0} y2={0} stroke={INK_DARK} strokeWidth={4} />
        <circle cx={0} cy={35} r={80} fill="#FEF08A" opacity={0.25} />
        <rect x={-25} y={0} width={50} height={70} rx={12} fill="#FACC15" stroke={INK_DARK} strokeWidth={4} />
        <circle cx={0} cy={35} r={15} fill="#F97316" />
      </g>

      {/* ============================================================== */}
      {/* ⏰ Respectful Vintage Clock in Upper Left ("EVERY 2 MINUTES")   */}
      {/* ============================================================== */}
      <g transform="translate(360, 220)">
        {/* Clock Frame */}
        <circle cx={0} cy={0} r={105} fill="#FDE047" stroke={INK_DARK} strokeWidth={6} />
        <circle cx={0} cy={0} r={90} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={4} />

        {/* Hour tick markers */}
        {Array.from({ length: 12 }).map((_, i) => {
          const deg = (i * 30 * Math.PI) / 180;
          return (
            <line
              key={i}
              x1={Math.sin(deg) * 70}
              y1={-Math.cos(deg) * 70}
              x2={Math.sin(deg) * 82}
              y2={-Math.cos(deg) * 82}
              stroke={INK_DARK}
              strokeWidth={i % 3 === 0 ? 4.5 : 2.5}
            />
          );
        })}

        {/* Hour & Minute Hands */}
        <line x1={0} y1={0} x2={25} y2={-35} stroke={INK_DARK} strokeWidth={5.5} strokeLinecap="round" />
        {/* Ticking Second Hand */}
        <line
          x1={0}
          y1={0}
          x2={Math.sin((clockAngle * Math.PI) / 180) * 65}
          y2={-Math.cos((clockAngle * Math.PI) / 180) * 65}
          stroke="#DC2626"
          strokeWidth={3}
          strokeLinecap="round"
        />
        <circle cx={0} cy={0} r={6} fill="#DC2626" />

        {/* Hand-Drawn Label Banner under Clock */}
        <g transform="translate(0, 140)">
          <rect x={-140} y={-25} width={280} height={50} rx={10} fill="#FEF3C7" stroke={INK_DARK} strokeWidth={4} />
          <text x={0} y={9} fill="#78350F" fontSize={22} fontWeight="900" textAnchor="middle">
            EVERY 2 MINUTES
          </text>
        </g>
      </g>

      {/* ============================================================== */}
      {/* 🛏️ Protected Sleeping Bed with Insecticide-Treated Net (ITN)    */}
      {/* ============================================================== */}
      <g transform="translate(1050, 680)">
        {/* Wooden Bed Base */}
        <rect x={-320} y={20} width={640} height={80} rx={8} fill="#583B20" stroke={INK_DARK} strokeWidth={5} />
        {/* Bed Legs */}
        <rect x={-310} y={100} width={35} height={90} fill="#452712" stroke={INK_DARK} strokeWidth={4} />
        <rect x={275} y={100} width={35} height={90} fill="#452712" stroke={INK_DARK} strokeWidth={4} />

        {/* Mattress & Pillows */}
        <rect x={-310} y={-20} width={620} height={45} rx={6} fill="#E2E8F0" stroke={INK_DARK} strokeWidth={4} />
        <ellipse cx={-220} cy={-25} rx={60} ry={25} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3.5} />
        <ellipse cx={-80} cy={-20} rx={45} ry={20} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3.5} />

        {/* Sleeping Stickman Parent & Child (Peaceful Resting) */}
        {/* Parent */}
        <g transform="translate(-220, -45)">
          <circle cx={0} cy={0} r={36} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={4} />
          {/* Peaceful closed eyes */}
          <path d="M -16 -2 Q -10 6 -4 -2" stroke={INK_DARK} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M 4 -2 Q 10 6 16 -2" stroke={INK_DARK} strokeWidth={3} fill="none" strokeLinecap="round" />
          <path d="M -6 16 Q 0 20 6 16" stroke={INK_DARK} strokeWidth={2.5} fill="none" />
        </g>
        {/* Child */}
        <g transform="translate(-80, -35)">
          <circle cx={0} cy={0} r={26} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3.5} />
          <path d="M -10 -2 Q -6 4 -2 -2" stroke={INK_DARK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <path d="M 2 -2 Q 6 4 10 -2" stroke={INK_DARK} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </g>

        {/* Cozy Blanket Covering them */}
        <path
          d="M -160 0 C -120 -40 250 -40 300 15 L 300 35 L -310 35 Z"
          fill="#0284C7"
          stroke={INK_DARK}
          strokeWidth={4.5}
          strokeLinejoin="round"
        />

        {/* Translucent Bed Net Canopy Mesh (Hanging over the entire bed) */}
        <g opacity={0.88}>
          {/* Net Suspension Rope to Ceiling */}
          <line x1={0} y1={-420} x2={0} y2={-260} stroke={INK_DARK} strokeWidth={4} />
          <circle cx={0} cy={-260} r={35} fill="#D1FAE5" stroke={INK_DARK} strokeWidth={4} />

          {/* Draping Net Mesh Polygon */}
          <polygon
            points="0,-260 -360,-40 -370,120 370,120 360,-40"
            fill="rgba(209, 250, 229, 0.45)"
            stroke="#10B981"
            strokeWidth={4.5}
            strokeLinejoin="round"
          />

          {/* Fine Grid Mesh Pattern Lines */}
          {[-260, -180, -100, -20, 60, 140, 220, 300].map((gx, i) => (
            <line key={i} x1={gx * 0.15} y1={-250} x2={gx} y2={120} stroke="#6EE7B7" strokeWidth={1.8} opacity={0.6} />
          ))}
          {[-180, -100, -20, 60].map((gy, i) => (
            <line key={i} x1={-320} y1={gy} x2={320} y2={gy} stroke="#6EE7B7" strokeWidth={1.8} opacity={0.6} />
          ))}
        </g>

        {/* Frustrated Mosquitoes Bouncing Off the Outside of the Net */}
        <g transform="translate(-390, -120)">
          <ZennDetailedMosquito scale={1.1} facing="right" />
          {/* Bouncing Impact Star */}
          <path d="M 40 25 L 55 15 L 45 35 L 60 40 L 42 45 L 40 25 Z" fill="#FACC15" stroke={INK_DARK} strokeWidth={2} />
        </g>
        <g transform="translate(390, -90)">
          <ZennDetailedMosquito scale={1.05} facing="left" />
          <path d="M -40 25 L -55 15 L -45 35 L -60 40 L -42 45 L -40 25 Z" fill="#FACC15" stroke={INK_DARK} strokeWidth={2} />
        </g>
      </g>
    </svg>
  );
};

/**
 * 🧄 SCENE 6: Southeast Asian Kitchen & Garlic Fumes (Beat 6: 1,111 - 1,422f)
 * "High-garlic diets believed to emit sulfur compounds passing through the skin."
 * Cooking pot steaming, stickman eating garlic, sulfur fumes puffing off skin, disgusted mosquito.
 */
export const ZennGarlicKitchenScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Bamboo Kitchen Wall */}
      <rect x={0} y={0} width={1920} height={700} fill="#E8D3A7" />
      {/* Vertical Bamboo Slat Lines */}
      {Array.from({ length: 20 }).map((_, i) => (
        <line key={i} x1={i * 100} y1={0} x2={i * 100} y2={700} stroke="#D4BE8D" strokeWidth={3} />
      ))}
      {/* Kitchen Floor */}
      <rect x={0} y={700} width={1920} height={380} fill="#654321" />
      <line x1={0} y1={700} x2={1920} y2={700} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

      {/* Braided Strings of Garlic Hanging from Rafters */}
      {[180, 320, 1650].map((gx, idx) => (
        <g key={idx} transform={`translate(${gx}, 0)`}>
          <line x1={0} y1={0} x2={0} y2={180} stroke="#A16207" strokeWidth={5} />
          {[40, 80, 120, 160].map((gy, i) => (
            <g key={i} transform={`translate(${i % 2 === 0 ? -12 : 12}, ${gy})`}>
              <ellipse cx={0} cy={0} rx={16} ry={14} fill="#FEF3C7" stroke={INK_DARK} strokeWidth={2.5} />
              <line x1={0} y1={-12} x2={0} y2={12} stroke="#CBD5E1" strokeWidth={1.5} />
            </g>
          ))}
        </g>
      ))}

      {/* Steaming Cooking Stove & Wok on Left */}
      <g transform="translate(480, 700)">
        {/* Clay Brick Stove */}
        <rect x={-140} y={-120} width={280} height={120} fill="#9A3412" stroke={INK_DARK} strokeWidth={5} rx={10} />
        {/* Black Iron Wok */}
        <path d="M -160 -120 Q 0 -50 160 -120 Z" fill="#1E293B" stroke={INK_DARK} strokeWidth={6} />
        {/* Steaming Soup inside Wok */}
        <ellipse cx={0} cy={-118} rx={150} ry={20} fill="#CA8A04" />
        {/* Floating Garlic Cloves in wok */}
        {[-80, -20, 50].map((cx, i) => (
          <ellipse key={i} cx={cx} cy={-120} rx={14} ry={10} fill="#FEF3C7" stroke={INK_DARK} strokeWidth={2} />
        ))}
        {/* Aromatic Steam Plumes */}
        {[0, 1, 2].map((s) => {
          const sOffset = (frame * 1.5 + s * 25) % 65;
          return (
            <path
              key={s}
              d={`M ${-40 + s * 40} -140 Q ${-20 + s * 40 + Math.sin(frame * 0.1 + s) * 20} ${-200 - sOffset} ${-40 + s * 40} ${-260 - sOffset}`}
              stroke="#FDE68A"
              strokeWidth={6}
              strokeLinecap="round"
              fill="none"
              opacity={Math.max(0, 1 - sOffset / 65)}
            />
          );
        })}
      </g>

      {/* Dining Table in Center */}
      <g transform="translate(1080, 700)">
        <polygon points="-240,-80 240,-80 220,0 -220,0" fill="#854D0E" stroke={INK_DARK} strokeWidth={5} strokeLinejoin="round" />
        <rect x={-200} y={0} width={40} height={180} fill="#653808" stroke={INK_DARK} strokeWidth={5} />
        <rect x={160} y={0} width={40} height={180} fill="#653808" stroke={INK_DARK} strokeWidth={5} />
      </g>

      {/* ============================================================== */}
      {/* 🍲 Stickman Eating Garlic Noodle Soup                         */}
      {/* ============================================================== */}
      <g transform="translate(1080, 510)">
        {/* Head */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5.5} />
        {/* Content Smiling Eyes */}
        <path d="M -24 -6 Q -16 -16 -8 -6" stroke={INK_DARK} strokeWidth={4} fill="none" strokeLinecap="round" />
        <path d="M 8 -6 Q 16 -16 24 -6" stroke={INK_DARK} strokeWidth={4} fill="none" strokeLinecap="round" />
        {/* Happy Eating Cheeks & Mouth */}
        <path d="M -12 18 Q 0 30 12 18" stroke={INK_DARK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Body & Arms holding bowl & chopsticks */}
        <g stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" fill="none">
          <line x1={0} y1={52} x2={0} y2={180} />
          {/* Sitting Legs */}
          <line x1={0} y1={180} x2={-45} y2={230} />
          <line x1={-45} y1={230} x2={-45} y2={320} />
          <line x1={0} y1={180} x2={35} y2={230} />
          <line x1={35} y1={230} x2={35} y2={320} />
          {/* Left Arm holding soup bowl */}
          <line x1={0} y1={90} x2={-45} y2={120} />
          <line x1={-45} y1={120} x2={-20} y2={105} />
          {/* Right Arm holding chopsticks */}
          <line x1={0} y1={90} x2={45} y2={110} />
          <line x1={45} y1={110} x2={10} y2={85} />
        </g>

        {/* Soup Bowl & Chopsticks */}
        <path d="M -40 100 Q 0 140 40 100 Z" fill="#047857" stroke={INK_DARK} strokeWidth={4} />
        <line x1={15} y1={75} x2={-5} y2={110} stroke="#D97706" strokeWidth={3.5} strokeLinecap="round" />

        {/* Green & Golden Wavy Sulfur Repellent Fumes Radiating Off Skin */}
        {[-80, -40, 40, 80].map((vx, i) => {
          const wavePhase = frame * 0.15 + i;
          return (
            <path
              key={i}
              d={`M ${vx} 60 Q ${vx + Math.sin(wavePhase) * 35} ${-20 - i * 15} ${vx + Math.cos(wavePhase) * 45} -140`}
              stroke="#84CC16"
              strokeWidth={5}
              strokeLinecap="round"
              fill="none"
              opacity={0.8}
            />
          );
        })}

        {/* Hand-Drawn Label on Sulfur Fumes */}
        <g transform="translate(0, -170)">
          <rect x={-150} y={-25} width={300} height={50} rx={10} fill="#FEF3C7" stroke={INK_DARK} strokeWidth={3.5} />
          <text x={0} y={9} fill="#4D7C0F" fontSize={22} fontWeight="900" textAnchor="middle">
            SULFUR COMPOUNDS
          </text>
        </g>
      </g>

      {/* ============================================================== */}
      {/* 🦟 Disgusted Mosquito Holding Its Proboscis/Nose in Reverse!   */}
      {/* ============================================================== */}
      <g transform={`translate(${1550 - Math.sin(frame * 0.3) * 15}, 460)`}>
        {/* Mosquito Angled Upwards and Backing Away */}
        <g transform="rotate(25)">
          <ZennDetailedMosquito scale={1.5} facing="left" />
          {/* Little Front Legs Pinching Needle Nose! */}
          <circle cx={-50} cy={48} r={12} fill="#FDE047" stroke={INK_DARK} strokeWidth={3} />
        </g>

        {/* Comic Stink Waves & Sick Reaction */}
        <text x={-60} y={-90} fill="#65A30D" fontSize={42} fontWeight="900" fontFamily="'Comic Sans MS', cursive">
          PHEW! 🤢
        </text>
      </g>
    </svg>
  );
};

/**
 * 🌿 SCENE 7: West African Courtyard & Neem Oil (Beat 7: 1,422 - 1,630f)
 * "Neem oil cuts landings by up to 70%."
 * Shaded courtyard, neem tree, stickman rubbing oil on arm with shiny aura, mosquito slides off.
 */
export const ZennNeemCourtyardScene: React.FC = () => {
  const frame = useCurrentFrame();

  const slideProgress = (frame % 50) / 50;
  const mosquitoSlideX = interpolate(slideProgress, [0, 0.4, 1], [30, -5, -120]);
  const mosquitoSlideY = interpolate(slideProgress, [0, 0.4, 1], [-60, 0, 80]);

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Sunny Compound Wall */}
      <rect x={0} y={0} width={1920} height={680} fill="#FDE68A" />
      {/* Sandy African Courtyard Ground */}
      <rect x={0} y={680} width={1920} height={400} fill="#B45309" />
      <line x1={0} y1={680} x2={1920} y2={680} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

      {/* Lush Green Neem Tree Overhead (Azadirachta indica) */}
      <g transform="translate(240, 260)">
        {/* Tree Trunk */}
        <path d="M 0 420 Q -40 200 -80 0 Q -20 -150 0 -260 L 50 -260 Q 20 0 80 420 Z" fill="#78350F" stroke={INK_DARK} strokeWidth={6} />
        {/* Lush Green Canopy Foliage */}
        <circle cx={-60} cy={-180} r={160} fill="#15803D" stroke={INK_DARK} strokeWidth={5} />
        <circle cx={100} cy={-220} r={180} fill="#166534" stroke={INK_DARK} strokeWidth={5} />
        <circle cx={260} cy={-160} r={140} fill="#15803D" stroke={INK_DARK} strokeWidth={5} />
        {/* Drooping Neem Berries */}
        {[-20, 60, 160, 220].map((bx, i) => (
          <g key={i} transform={`translate(${bx}, -90)`}>
            <circle cx={0} cy={0} r={10} fill="#FEF08A" stroke={INK_DARK} strokeWidth={2} />
            <circle cx={8} cy={14} r={9} fill="#FEF08A" stroke={INK_DARK} strokeWidth={2} />
          </g>
        ))}
      </g>

      {/* Clay Bowl with Golden Neem Oil on Stool */}
      <g transform="translate(620, 680)">
        {/* Carved Wooden Stool */}
        <polygon points="-70,0 70,0 50,70 -50,70" fill="#78350F" stroke={INK_DARK} strokeWidth={4.5} />
        {/* Clay Bowl */}
        <path d="M -60 0 Q 0 45 60 0 Z" fill="#9A3412" stroke={INK_DARK} strokeWidth={4.5} />
        {/* Shimmering Golden Neem Oil inside */}
        <ellipse cx={0} cy={-2} rx={55} ry={14} fill="#FACC15" stroke={INK_DARK} strokeWidth={3} />
      </g>

      {/* ============================================================== */}
      {/* 🧴 Stickman Applying Neem Oil to Arm (Shiny Golden Aura!)       */}
      {/* ============================================================== */}
      <g transform="translate(1080, 520)">
        {/* Head */}
        <circle cx={0} cy={0} r={52} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5.5} />
        {/* Happy Confident Eyes */}
        <circle cx={-18} cy={-6} r={14} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3} />
        <circle cx={-14} cy={-6} r={5} fill={INK_DARK} />
        <circle cx={18} cy={-6} r={14} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3} />
        <circle cx={22} cy={-6} r={5} fill={INK_DARK} />
        {/* Confident Smile */}
        <path d="M -10 20 Q 0 28 14 18" stroke={INK_DARK} strokeWidth={4} fill="none" strokeLinecap="round" />

        {/* Body */}
        <line x1={0} y1={52} x2={0} y2={180} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={180} x2={-25} y2={300} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={180} x2={25} y2={300} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

        {/* Left Arm Extended (The Protected Oiled Arm) */}
        <line x1={0} y1={90} x2={-110} y2={120} stroke={INK_DARK} strokeWidth={8} strokeLinecap="round" />

        {/* Shiny Golden Protective Aura around the arm! */}
        <ellipse
          cx={-70}
          cy={110}
          rx={65}
          ry={32}
          fill="rgba(250, 204, 21, 0.45)"
          stroke="#EAB308"
          strokeWidth={3}
          strokeDasharray="8 6"
        />

        {/* Sparkle glints on the oiled arm */}
        <g transform="translate(-70, 110)">
          <path d="M -20 -15 L -20 -5 M -25 -10 L -15 -10" stroke="#FDE047" strokeWidth={3} />
          <path d="M 25 10 L 25 20 M 20 15 L 30 15" stroke="#FDE047" strokeWidth={3} />
        </g>

        {/* Right Hand Rubbing Oil onto Left Forearm */}
        <line x1={0} y1={90} x2={-50} y2={130} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

        {/* Mosquito Attempting to Land and SLIDING Right Off! */}
        <g transform={`translate(${-110 + mosquitoSlideX}, ${110 + mosquitoSlideY})`}>
          <g transform="rotate(-35)">
            <ZennDetailedMosquito scale={1.1} facing="right" />
          </g>
          {/* Slip & Slide Streak Lines */}
          <path d="M 20 -25 Q -10 10 -40 35" stroke="#38BDF8" strokeWidth={3.5} strokeDasharray="6 4" fill="none" />
          <text x={-20} y={-35} fill="#DC2626" fontSize={26} fontWeight="900" fontFamily="'Comic Sans MS', cursive">
            SLIP!
          </text>
        </g>
      </g>

      {/* Hand-Drawn Wood Sign in Lower-Right */}
      <g transform="translate(1580, 840)">
        <rect x={-160} y={-45} width={320} height={90} rx={12} fill="#FEF3C7" stroke={INK_DARK} strokeWidth={5} />
        <text x={0} y={0} fill="#047857" fontSize={38} fontWeight="900" textAnchor="middle">
          -70% LANDINGS
        </text>
        <text x={0} y={30} fill="#166534" fontSize={20} fontWeight="bold" textAnchor="middle">
          CENTURIES OF NEEM TRADITION
        </text>
      </g>
    </svg>
  );
};

/**
 * 🔥 SCENE 8: Amazonian Resin Smoke Plumes (Beat 8: 1,630 - 1,823f)
 * "In the Amazon, communities burn specific resins to keep insects away."
 * Amazon riverside twilight, fragrant plant resin hearth, billowing smoke clouds clearing mosquitoes.
 */
export const ZennAmazonResinScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Amazon Twilight Gradient Sky */}
      <rect x={0} y={0} width={1920} height={680} fill="#0C4A6E" />
      {/* Rainforest Riverbank & Ground */}
      <rect x={0} y={680} width={1920} height={400} fill="#064E3B" />
      <line x1={0} y1={680} x2={1920} y2={680} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

      {/* Silhouetted Rainforest Canopy Palms in Background */}
      <g opacity={0.65}>
        {[140, 360, 1680, 1850].map((px, idx) => (
          <g key={idx} transform={`translate(${px}, 680)`}>
            <line x1={0} y1={0} x2={-20} y2={-320} stroke="#022C22" strokeWidth={10} strokeLinecap="round" />
            {[-60, -30, 0, 30, 60].map((deg, i) => (
              <path
                key={i}
                d={`M -20 -320 Q ${Math.cos((deg * Math.PI) / 180) * 120} ${-380 + Math.sin((deg * Math.PI) / 180) * 80} ${Math.cos((deg * Math.PI) / 180) * 180} ${-340 + Math.sin((deg * Math.PI) / 180) * 120}`}
                stroke="#022C22"
                strokeWidth={7}
                fill="none"
              />
            ))}
          </g>
        ))}
      </g>

      {/* Meandering Amazon River reflecting dusk sunset */}
      <path
        d="M 600 680 Q 900 630 1300 680 L 1450 780 Q 950 720 500 780 Z"
        fill="#0284C7"
        stroke={INK_DARK}
        strokeWidth={4}
        opacity={0.7}
      />

      {/* Stone Brazier / Hearth Burning Copal Plant Resin */}
      <g transform="translate(960, 720)">
        {/* Hearth Stone Base */}
        <ellipse cx={0} cy={20} rx={160} ry={40} fill="#1E293B" stroke={INK_DARK} strokeWidth={5} />
        {/* Burning Embers & Fire */}
        <ellipse cx={0} cy={5} rx={100} ry={25} fill="#EA580C" stroke={INK_DARK} strokeWidth={4} />
        <ellipse cx={0} cy={0} rx={60} ry={15} fill="#FACC15" />
        <polygon points="-40,5 0,-40 40,5" fill="#EF4444" />
        <polygon points="-20,5 0,-25 20,5" fill="#FEF08A" />

        {/* Melting Resin Nuggets on Embers */}
        <ellipse cx={-45} cy={-2} rx={15} ry={8} fill="#B45309" stroke={INK_DARK} strokeWidth={2} />
        <ellipse cx={35} cy={0} rx={18} ry={10} fill="#B45309" stroke={INK_DARK} strokeWidth={2} />
      </g>

      {/* ============================================================== */}
      {/* 💨 Billowing Fragrant Aromatic White Smoke Plumes               */}
      {/* ============================================================== */}
      <g>
        {[0, 1, 2, 3, 4].map((p, idx) => {
          const plumeProgress = (frame * 1.2 + idx * 30) % 150;
          const py = 680 - plumeProgress * 4;
          const px = 960 + Math.sin(frame * 0.05 + idx * 1.5) * 120 + (idx % 2 === 0 ? -1 : 1) * plumeProgress * 1.2;
          const pr = 45 + plumeProgress * 0.9;
          const pAlpha = Math.max(0, 1 - plumeProgress / 150);

          return (
            <g key={idx} transform={`translate(${px}, ${py})`} opacity={pAlpha * 0.75}>
              <circle cx={0} cy={0} r={pr} fill="#F8FAFC" stroke={INK_DARK} strokeWidth={3} />
              <circle cx={-pr * 0.3} cy={-pr * 0.2} r={pr * 0.6} fill="#E2E8F0" opacity={0.6} />
            </g>
          );
        })}
      </g>

      {/* Riverside Resident Stickman tending the smoke */}
      <g transform="translate(680, 580)">
        <circle cx={0} cy={0} r={50} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5.5} />
        {/* Relaxed Eyes */}
        <circle cx={-15} cy={-4} r={12} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3} />
        <circle cx={-12} cy={-4} r={4.5} fill={INK_DARK} />
        <circle cx={15} cy={-4} r={12} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={3} />
        <circle cx={18} cy={-4} r={4.5} fill={INK_DARK} />
        <path d="M -8 18 Q 0 24 8 18" stroke={INK_DARK} strokeWidth={3.5} fill="none" strokeLinecap="round" />

        {/* Body holding woven palm fan */}
        <line x1={0} y1={50} x2={0} y2={180} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={180} x2={-30} y2={280} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={180} x2={30} y2={280} stroke={INK_DARK} strokeWidth={6} strokeLinecap="round" />

        {/* Arm waving palm fan towards fire */}
        <line x1={0} y1={80} x2={60} y2={95} stroke={INK_DARK} strokeWidth={5.5} strokeLinecap="round" />
        {/* Palm Fan */}
        <polygon points="60,95 110,65 125,120" fill="#15803D" stroke={INK_DARK} strokeWidth={3.5} strokeLinejoin="round" />
      </g>

      {/* Mosquitoes on Far Edge Fleeing from the Smoke Barrier */}
      <g transform="translate(1550, 420)">
        <g transform="rotate(30)">
          <ZennDetailedMosquito scale={1.2} facing="right" />
        </g>
        <text x={-60} y={-40} fill="#FEF3C7" fontSize={32} fontWeight="900" fontFamily="'Comic Sans MS', cursive">
          COUGH! 💨
        </text>
      </g>

      {/* Hand-Drawn Comic Label */}
      <g transform="translate(960, 160)">
        <rect x={-200} y={-30} width={400} height={60} rx={12} fill="#FEF3C7" stroke={INK_DARK} strokeWidth={4.5} />
        <text x={0} y={10} fill="#9A3412" fontSize={26} fontWeight="900" textAnchor="middle">
          AMAZONIAN RESIN SMOKE
        </text>
      </g>
    </svg>
  );
};

/**
 * 🌐 SCENE 9: Global Synthesis & Modern Convergence (Beat 9: 1,823 - 2,232f)
 * "Different continents, different plants, same unavoidable truth: some people are targets."
 * Central globe, 3 rotating cultural vignettes, converging into modern tools: spray, screens, nets.
 */
export const ZennConvergenceMosaicScene: React.FC = () => {
  const frame = useCurrentFrame();

  const globeRotation = frame * 0.4;

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080">
      {/* Warm Parchment Foundation */}
      <rect x={0} y={0} width={1920} height={1080} fill={PARCHMENT_BG} />
      {/* Vintage Blueprint Radial Rings */}
      <circle cx={960} cy={540} r={420} fill="none" stroke="#E5D6A7" strokeWidth={2.5} strokeDasharray="8 8" />
      <circle cx={960} cy={540} r={280} fill="none" stroke="#E5D6A7" strokeWidth={2} />

      {/* Central Rotating Globe */}
      <g transform="translate(960, 540)">
        {/* Globe Base Ocean */}
        <circle cx={0} cy={0} r={170} fill="#38BDF8" stroke={INK_DARK} strokeWidth={6} />
        {/* Graticule Latitude lines */}
        <ellipse cx={0} cy={0} rx={170} ry={70} fill="none" stroke="#0284C7" strokeWidth={2.5} />
        <ellipse cx={0} cy={0} rx={170} ry={130} fill="none" stroke="#0284C7" strokeWidth={2} />
        {/* Rotating Continents Silhouette */}
        <g transform={`rotate(${globeRotation})`}>
          <circle cx={-60} cy={-40} r={45} fill="#10B981" stroke={INK_DARK} strokeWidth={3} />
          <circle cx={50} cy={30} r={55} fill="#10B981" stroke={INK_DARK} strokeWidth={3} />
          <circle cx={-40} cy={60} r={35} fill="#10B981" stroke={INK_DARK} strokeWidth={3} />
        </g>
        {/* Globe Rim Stand */}
        <path d="M 0 -195 A 195 195 0 0 1 0 195 L 0 250 M -70 250 L 70 250" stroke={INK_DARK} strokeWidth={6.5} fill="none" strokeLinecap="round" />
      </g>

      {/* ============================================================== */}
      {/* 3 Historical Cultural Vignettes Orbiting Globe                 */}
      {/* ============================================================== */}
      {/* Vignette 1: Southeast Asia Garlic (Top-Left) */}
      <g transform="translate(440, 300)">
        <circle cx={0} cy={0} r={120} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5} />
        {/* Garlic Bulb Icon */}
        <g transform="translate(0, -10)">
          <path
            d="M -30 20 C -45 5 -40 -25 -20 -35 C -10 -40 0 -45 0 -45 C 0 -45 10 -40 20 -35 C 40 -25 45 5 30 20 Z"
            fill="#FEF3C7"
            stroke={INK_DARK}
            strokeWidth={4}
          />
          <path d="M -15 -50 Q -25 -70 -10 -85" stroke="#84CC16" strokeWidth={3} fill="none" />
          <path d="M 15 -50 Q 25 -70 10 -85" stroke="#84CC16" strokeWidth={3} fill="none" />
        </g>
        <text x={0} y={65} fill="#78350F" fontSize={20} fontWeight="900" textAnchor="middle">
          SE ASIA: GARLIC
        </text>
      </g>

      {/* Vignette 2: West Africa Neem (Top-Right) */}
      <g transform="translate(1480, 300)">
        <circle cx={0} cy={0} r={120} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5} />
        {/* Neem Leaf & Oil Bowl */}
        <g transform="translate(0, -15)">
          <path d="M 0 -40 Q 25 -10 0 20 Q -25 -10 0 -40 Z" fill="#15803D" stroke={INK_DARK} strokeWidth={3.5} />
          <path d="M -30 15 Q 0 35 30 15 Z" fill="#FACC15" stroke={INK_DARK} strokeWidth={3.5} />
        </g>
        <text x={0} y={65} fill="#166534" fontSize={20} fontWeight="900" textAnchor="middle">
          W AFRICA: NEEM
        </text>
      </g>

      {/* Vignette 3: Amazon Resin (Bottom-Center-Left) */}
      <g transform="translate(440, 780)">
        <circle cx={0} cy={0} r={120} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5} />
        {/* Copal Fire & Smoke */}
        <g transform="translate(0, 0)">
          <polygon points="-25,20 0,-15 25,20" fill="#EA580C" stroke={INK_DARK} strokeWidth={3} />
          <circle cx={-10} cy={-25} r={18} fill="#E2E8F0" stroke={INK_DARK} strokeWidth={2} />
          <circle cx={15} cy={-35} r={22} fill="#F8FAFC" stroke={INK_DARK} strokeWidth={2} />
        </g>
        <text x={0} y={65} fill="#9A3412" fontSize={20} fontWeight="900" textAnchor="middle">
          AMAZON: RESIN
        </text>
      </g>

      {/* ============================================================== */}
      {/* 🛡️ Modern Gold Standard Converged Tools (Bottom-Right)          */}
      {/* ============================================================== */}
      <g transform="translate(1480, 780)">
        <circle cx={0} cy={0} r={120} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5} />
        {/* Modern Repellent Spray Canister */}
        <g transform="translate(-30, 0)">
          <rect x={-16} y={-35} width={32} height={70} rx={6} fill="#0284C7" stroke={INK_DARK} strokeWidth={3.5} />
          <rect x={-10} y={-45} width={20} height={10} fill="#CBD5E1" stroke={INK_DARK} strokeWidth={2} />
          {/* Spray Mist */}
          <path d="M -10 -45 L -35 -70 M -10 -45 L -45 -55" stroke="#38BDF8" strokeWidth={3} strokeLinecap="round" />
        </g>
        {/* Bed Net Mesh Icon */}
        <g transform="translate(30, 0)">
          <polygon points="0,-40 -35,30 35,30" fill="rgba(16, 185, 129, 0.4)" stroke="#10B981" strokeWidth={3.5} />
        </g>
        <text x={0} y={65} fill="#0369A1" fontSize={20} fontWeight="900" textAnchor="middle">
          MODERN SCIENCE
        </text>
      </g>

      {/* Central Host Standing Victorious in Modern Age */}
      <g transform="translate(960, 500)">
        <circle cx={0} cy={0} r={46} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={5} />
        {/* Confident Eyes */}
        <circle cx={-15} cy={-6} r={12} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={2.8} />
        <circle cx={-12} cy={-6} r={4.5} fill={INK_DARK} />
        <circle cx={15} cy={-6} r={12} fill="#FFFFFF" stroke={INK_DARK} strokeWidth={2.8} />
        <circle cx={18} cy={-6} r={4.5} fill={INK_DARK} />
        <path d="M -10 18 Q 0 26 10 18" stroke={INK_DARK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
        {/* Body with Double Thumbs Up */}
        <line x1={0} y1={46} x2={0} y2={150} stroke={INK_DARK} strokeWidth={5.5} strokeLinecap="round" />
        <line x1={0} y1={75} x2={-40} y2={65} stroke={INK_DARK} strokeWidth={5} strokeLinecap="round" />
        <line x1={-40} y1={65} x2={-45} y2={45} stroke={INK_DARK} strokeWidth={5} strokeLinecap="round" />
        <line x1={0} y1={75} x2={40} y2={65} stroke={INK_DARK} strokeWidth={5} strokeLinecap="round" />
        <line x1={40} y1={65} x2={45} y2={45} stroke={INK_DARK} strokeWidth={5} strokeLinecap="round" />
      </g>

      {/* Hand-Drawn Concluding Title Banner */}
      <g transform="translate(960, 110)">
        <polygon
          points="-360,-40 360,-40 350,45 -350,45"
          fill="#FEF3C7"
          stroke={INK_DARK}
          strokeWidth={5}
          strokeLinejoin="round"
        />
        <text
          x={0}
          y={15}
          fill={INK_DARK}
          fontSize={34}
          fontWeight="900"
          fontFamily="'Comic Sans MS', cursive"
          textAnchor="middle"
        >
          SOME ARE TARGETS... BUT WE ADAPTED
        </text>
      </g>
    </svg>
  );
};
