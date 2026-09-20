import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { INK_BLACK, VICTIM_RED, ZennStickman, ZennMosquito } from './ZennStyle';

// Shared Palette
const DUSK_SKY_TOP = '#0B132B';
const DUSK_SKY_MID = '#1C2541';
const DUSK_SKY_BOT = '#2E3856';
const DECK_WOOD_1 = '#9A5B2C';
const DECK_WOOD_2 = '#78431E';
const FENCE_BROWN = '#452A18';
const GRILL_BODY = '#1F2937';
const GRILL_FIRE = '#F97316';

/**
 * 🏞️ Common Twilight Patio Deck Environmental Backdrop
 */
export const ZennPatioEnvironment: React.FC<{
  children?: React.ReactNode;
  deckY?: number;
  showStringLights?: boolean;
}> = ({ children, deckY = 660, showStringLights = true }) => {
  const frame = useCurrentFrame();

  return (
    <svg width="1920" height="1080" viewBox="0 0 1920 1080" style={{ position: 'absolute', top: 0, left: 0 }}>
      <defs>
        <linearGradient id="patioSky" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={DUSK_SKY_TOP} />
          <stop offset="60%" stopColor={DUSK_SKY_MID} />
          <stop offset="100%" stopColor={DUSK_SKY_BOT} />
        </linearGradient>
        <linearGradient id="patioDeck" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={DECK_WOOD_1} />
          <stop offset="100%" stopColor={DECK_WOOD_2} />
        </linearGradient>
      </defs>

      {/* Sky */}
      <rect x={0} y={0} width={1920} height={deckY} fill="url(#patioSky)" />

      {/* Distant Fence & Bush Silhouettes */}
      <path
        d={`M 0 ${deckY} L 0 ${deckY - 120} Q 200 ${deckY - 140} 400 ${deckY - 110} T 800 ${deckY - 130} T 1200 ${deckY - 115} T 1600 ${deckY - 135} T 1920 ${deckY - 120} L 1920 ${deckY} Z`}
        fill="#121D33"
        opacity={0.8}
      />
      {/* Wooden Fence Slats */}
      {[100, 300, 500, 700, 900, 1100, 1300, 1500, 1700, 1850].map((fx) => (
        <line key={fx} x1={fx} y1={deckY - 100} x2={fx} y2={deckY} stroke={FENCE_BROWN} strokeWidth={6} />
      ))}
      <line x1={0} y1={deckY - 80} x2={1920} y2={deckY - 80} stroke={FENCE_BROWN} strokeWidth={5} />

      {/* Glowing String Lights */}
      {showStringLights && (
        <g>
          <path
            d="M 0 100 Q 480 200 960 140 Q 1440 200 1920 100"
            stroke="#1E293B"
            strokeWidth={3.5}
            fill="none"
          />
          {[160, 340, 520, 720, 900, 1080, 1260, 1460, 1640, 1800].map((lx, idx) => {
            const ly = 100 + Math.sin((lx / 1920) * Math.PI) * 75;
            const flicker = 0.85 + Math.sin(frame * 0.15 + idx) * 0.15;
            return (
              <g key={lx} transform={`translate(${lx}, ${ly})`}>
                <circle cx={0} cy={10} r={18} fill="#FEF08A" opacity={0.3 * flicker} />
                <circle cx={0} cy={10} r={9} fill="#FDE047" stroke={INK_BLACK} strokeWidth={2.5} />
                <line x1={0} y1={0} x2={0} y2={5} stroke="#334155" strokeWidth={2.5} />
              </g>
            );
          })}
        </g>
      )}

      {/* Patio Deck Floor */}
      <rect x={0} y={deckY} width={1920} height={1080 - deckY} fill="url(#patioDeck)" />
      <line x1={0} y1={deckY} x2={1920} y2={deckY} stroke={INK_BLACK} strokeWidth={6} strokeLinecap="round" />
      {/* Wooden Floor Planks */}
      {[deckY + 70, deckY + 150, deckY + 240, deckY + 340].map((py, idx) => (
        <line key={idx} x1={0} y1={py} x2={1920} y2={py} stroke="#4A2610" strokeWidth={4} opacity={0.7} />
      ))}

      {children}
    </svg>
  );
};

/**
 * 🥩 SCENE 1: Barbecue Patio & Onion Smoke (Beats 1 & 2)
 */
export const ZennBarbecueGrillPatioScene: React.FC = () => {
  const frame = useCurrentFrame();
  const smokeWiggle = Math.sin(frame * 0.1) * 15;

  return (
    <ZennPatioEnvironment>
      {/* Sizzling BBQ Kettle Grill on Left */}
      <g transform="translate(320, 640)">
        {/* Legs */}
        <line x1={-35} y1={30} x2={-65} y2={180} stroke={INK_BLACK} strokeWidth={6} strokeLinecap="round" />
        <line x1={35} y1={30} x2={65} y2={180} stroke={INK_BLACK} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={30} x2={0} y2={180} stroke={INK_BLACK} strokeWidth={6} strokeLinecap="round" />
        {/* Wheels */}
        <circle cx={-70} cy={180} r={16} fill="#374151" stroke={INK_BLACK} strokeWidth={4} />
        <circle cx={70} cy={180} r={16} fill="#374151" stroke={INK_BLACK} strokeWidth={4} />

        {/* Kettle Bowl */}
        <path
          d="M -90 0 C -90 90 90 90 90 0 Z"
          fill={GRILL_BODY}
          stroke={INK_BLACK}
          strokeWidth={6}
          strokeLinejoin="round"
        />
        {/* Grill Lid Tilted Open */}
        <path
          d="M -80 -25 C -90 -120 40 -120 70 -35 Z"
          fill="#374151"
          stroke={INK_BLACK}
          strokeWidth={6}
          transform="rotate(-28 -80 -25)"
        />
        {/* Glowing Charcoal Interior */}
        <ellipse cx={0} cy={0} rx={85} ry={18} fill="#B91C1C" stroke={INK_BLACK} strokeWidth={5} />
        <ellipse cx={-15} cy={-2} rx={60} ry={10} fill={GRILL_FIRE} opacity={0.8} />

        {/* Onion Slices & Meat Grilling */}
        <ellipse cx={-35} cy={-2} rx={16} ry={8} fill="#F3E8FF" stroke="#7E22CE" strokeWidth={3} />
        <ellipse cx={20} cy={-1} rx={24} ry={10} fill="#7F1D1D" stroke={INK_BLACK} strokeWidth={3.5} />

        {/* Thick Onion Smoke Rising */}
        <path
          d={`M 0 -25 Q ${smokeWiggle - 20} -120 ${-smokeWiggle} -220 Q ${smokeWiggle + 30} -320 -10 -420`}
          stroke="#94A3B8"
          strokeWidth={14}
          strokeLinecap="round"
          fill="none"
          opacity={0.45}
        />
        <path
          d={`M 20 -20 Q ${-smokeWiggle + 15} -110 ${smokeWiggle} -200 Q ${-smokeWiggle} -290 15 -380`}
          stroke="#CBD5E1"
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          opacity={0.65}
        />
      </g>

      {/* Host (Left Chair) - Smelling Jeans & Looking Bothered */}
      <g transform="translate(860, 520)">
        <ZennStickman
          x={0}
          y={0}
          scale={1.05}
          hasSpikyHair
          hasWelts
          weltCount={7}
          shirtColor="#2563EB"
          eyes="worried"
          eyebrows="worried"
          mouth="frown"
          pose="standing_idle"
        />
        {/* Smell Wavy Lines around Jeans */}
        <path
          d={`M -30 200 Q ${-50 + smokeWiggle} 240 -30 280`}
          stroke="#A855F7"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d={`M 30 200 Q ${50 - smokeWiggle} 240 30 280`}
          stroke="#A855F7"
          strokeWidth={3.5}
          fill="none"
          strokeLinecap="round"
        />
      </g>

      {/* Friend with Glasses (Right Chair) - Sipping Drink Untouched */}
      <g transform="translate(1320, 520)">
        <ZennStickman
          x={0}
          y={0}
          scale={1.05}
          hasGlasses
          shirtColor="#10B981"
          eyes="normal"
          eyebrows="neutral"
          mouth="smirk"
          pose="standing_idle"
        />
      </g>

      {/* Mosquitoes Swarming Only Host */}
      {[0, 1, 2].map((i) => {
        const mx = 780 + Math.sin(frame * 0.12 + i * 2) * 55;
        const my = 420 + Math.cos(frame * 0.15 + i * 2) * 45;
        return <ZennMosquito key={i} x={mx} y={my} scale={0.6} facing="right" />;
      })}

      {/* Comic Callout Box: 40px Padding */}
      <g transform="translate(960, 960)">
        <rect
          x={-280}
          y={-38}
          width={560}
          height={76}
          rx={38}
          fill="#1E293B"
          stroke="#F8FAFC"
          strokeWidth={4}
        />
        <text
          x={0}
          y={10}
          fill="#F8FAFC"
          fontSize={24}
          fontWeight="900"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
        >
          SAME BARBECUE. DIFFERENT TARGET. 🎯
        </text>
      </g>
    </ZennPatioEnvironment>
  );
};

/**
 * 🧛 SCENE 2: The Vampire Connect-the-Dots Puzzle (Beat 3)
 */
export const ZennVampireDotsArmScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Dots coordinates on forearm
  const dots = [
    { num: 1, x: 500, y: 560 },
    { num: 2, x: 680, y: 480 },
    { num: 3, x: 860, y: 530 },
    { num: 4, x: 1040, y: 460 },
    { num: 5, x: 1220, y: 550 },
    { num: 6, x: 1400, y: 490 },
  ];

  const connectProgress = Math.min(Math.max((frame - 15) / 60, 0), 1);
  const activeDots = Math.floor(connectProgress * (dots.length - 1)) + 1;

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0F172A', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Subtle warm skin tone background under spotlight */}
        <radialGradient id="armSpotlight" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </radialGradient>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#armSpotlight)" />

        {/* Big Stylized Human Forearm */}
        <path
          d="M 320 660 C 540 640 1380 620 1600 640 L 1600 400 C 1380 420 540 400 320 380 Z"
          fill="#FED7AA"
          stroke={INK_BLACK}
          strokeWidth={7}
          strokeLinejoin="round"
        />
        {/* Shirt Cuff on Left */}
        <rect x={260} y={360} width={120} height={320} rx={16} fill="#2563EB" stroke={INK_BLACK} strokeWidth={7} />

        {/* Connect-the-dots Lines */}
        {dots.slice(0, activeDots).map((d, i) => {
          if (i === 0) return null;
          const prev = dots[i - 1];
          if (!prev) return null;
          return (
            <line
              key={i}
              x1={prev.x}
              y1={prev.y}
              x2={d.x}
              y2={d.y}
              stroke={VICTIM_RED}
              strokeWidth={5}
              strokeDasharray="10 8"
              strokeLinecap="round"
            />
          );
        })}

        {/* Welts (Dots) */}
        {dots.map((d, i) => {
          const isConnected = i < activeDots;
          const pulse = 1 + Math.sin(frame * 0.2 + i) * 0.15;
          return (
            <g key={d.num} transform={`translate(${d.x}, ${d.y}) scale(${pulse})`}>
              {/* Outer Itch Glow */}
              <circle cx={0} cy={0} r={28} fill={VICTIM_RED} opacity={0.3} />
              {/* Solid Welt */}
              <circle cx={0} cy={0} r={16} fill={VICTIM_RED} stroke={INK_BLACK} strokeWidth={3.5} />
              {/* Dot Number */}
              <circle cx={0} cy={-36} r={16} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={2.5} />
              <text
                x={0}
                y={-30}
                fill={INK_BLACK}
                fontSize={18}
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {d.num}
              </text>
            </g>
          );
        })}

        {/* Comic Tag Header */}
        <g transform="translate(960, 200)">
          <rect
            x={-340}
            y={-45}
            width={680}
            height={90}
            rx={20}
            fill="#FFFFFF"
            stroke={INK_BLACK}
            strokeWidth={5}
          />
          <text
            x={0}
            y={12}
            fill={INK_BLACK}
            fontSize={32}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
          >
            VAMPIRE CONNECT-THE-DOTS 🧛🩸
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 😇 SCENE 3: The Peaceful Friend 40cm Away (Beat 4)
 */
export const ZennPeaceFriendScene: React.FC = () => {
  const frame = useCurrentFrame();
  const floatY = Math.sin(frame * 0.08) * 8;

  return (
    <ZennPatioEnvironment>
      {/* Friend Glowing with Angelic Radiance */}
      <g transform={`translate(960, ${480 + floatY})`}>
        {/* Soft Golden Aura */}
        <circle cx={0} cy={60} r={240} fill="#FEF08A" opacity={0.25} />
        <circle cx={0} cy={60} r={180} fill="#FDE047" opacity={0.3} />

        {/* Floating Golden Halo */}
        <ellipse
          cx={0}
          cy={-90}
          rx={70}
          ry={18}
          fill="none"
          stroke="#FACC15"
          strokeWidth={6}
          strokeDasharray="14 6"
        />

        {/* Stickman Friend with Glasses */}
        <ZennStickman
          x={0}
          y={0}
          scale={1.3}
          hasGlasses
          shirtColor="#10B981"
          eyes="normal"
          eyebrows="neutral"
          mouth="smirk"
          pose="standing_idle"
        />

        {/* Lemonade Glass in Hand */}
        <g transform="translate(70, 180)">
          <polygon points="-16,0 16,0 12,50 -12,50" fill="#FEF08A" stroke={INK_BLACK} strokeWidth={3.5} />
          <line x1={-3} y1={-15} x2={5} y2={40} stroke="#EF4444" strokeWidth={3.5} />
          <circle cx={-18} cy={5} r={12} fill="#FACC15" stroke={INK_BLACK} strokeWidth={2.5} />
        </g>
      </g>

      {/* Comic Paper Label Banner */}
      <g transform="translate(960, 940)">
        <rect
          x={-320}
          y={-40}
          width={640}
          height={80}
          rx={40}
          fill="#10B981"
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
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
        >
          40 CM AWAY: SPONSORED BY PEACE ✨
        </text>
      </g>
    </ZennPatioEnvironment>
  );
};

/**
 * 👏 SCENE 4: The Slapping Frenzy & Bystanders Clapping (Beats 5 & 6)
 */
export const ZennSlappingPercussionScene: React.FC = () => {
  const frame = useCurrentFrame();
  const slapStep = Math.floor((frame / 8) % 3);

  return (
    <ZennPatioEnvironment>
      {/* Host in Center Flailing & Slapping */}
      <g transform="translate(960, 520)">
        <ZennStickman
          x={0}
          y={0}
          scale={1.1}
          hasSpikyHair
          hasWelts
          shirtColor="#2563EB"
          eyes="angry"
          eyebrows="angry"
          mouth="shock_o"
          pose="flailing"
        />

        {/* Dynamic Slap Impact Bursts */}
        {slapStep === 0 && (
          <g transform="translate(-80, 260)">
            <circle cx={0} cy={0} r={40} fill="#EF4444" opacity={0.3} />
            <polygon points="-20,-5 -5,-25 25,-10 15,15 -10,20" fill="#FACC15" stroke={INK_BLACK} strokeWidth={3} />
            <text x={0} y={6} fill={INK_BLACK} fontSize={18} fontWeight="900" textAnchor="middle">
              ANKLE!
            </text>
          </g>
        )}
        {slapStep === 1 && (
          <g transform="translate(90, 160)">
            <circle cx={0} cy={0} r={45} fill="#EF4444" opacity={0.3} />
            <polygon points="-25,-10 -5,-30 30,-15 20,20 -15,25" fill="#FACC15" stroke={INK_BLACK} strokeWidth={3} />
            <text x={0} y={6} fill={INK_BLACK} fontSize={18} fontWeight="900" textAnchor="middle">
              TABLE!
            </text>
          </g>
        )}
        {slapStep === 2 && (
          <g transform="translate(0, 40)">
            <circle cx={0} cy={0} r={50} fill="#EF4444" opacity={0.3} />
            <polygon points="-30,-15 -5,-35 35,-20 25,25 -20,30" fill="#FACC15" stroke={INK_BLACK} strokeWidth={3} />
            <text x={0} y={6} fill={INK_BLACK} fontSize={18} fontWeight="900" textAnchor="middle">
              RHYTHM!
            </text>
          </g>
        )}
      </g>

      {/* Strangers on the Left Clapping Along */}
      <g transform="translate(360, 560)">
        <ZennStickman x={0} y={0} scale={0.85} shirtColor="#64748B" eyes="normal" eyebrows="neutral" mouth="smirk" />
        <g transform="translate(45, 80)">
          <text x={0} y={0} fill="#FEF08A" fontSize={28} fontWeight="900">
            👏 CLAP!
          </text>
        </g>
      </g>

      {/* Comic Callout */}
      <g transform="translate(960, 950)">
        <rect
          x={-330}
          y={-40}
          width={660}
          height={80}
          rx={40}
          fill="#1E293B"
          stroke="#FFFFFF"
          strokeWidth={4}
        />
        <text
          x={0}
          y={10}
          fill="#F8FAFC"
          fontSize={25}
          fontWeight="900"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
        >
          "IS THIS PART OF THE LIVE MUSIC?" 🎵🥁
        </text>
      </g>
    </ZennPatioEnvironment>
  );
};

/**
 * 🕯️ SCENE 5: Lemon Ghost Citronella Summoning (Beat 7)
 */
export const ZennLemonGhostScene: React.FC = () => {
  const frame = useCurrentFrame();
  const ghostFloat = Math.sin(frame * 0.1) * 12;

  return (
    <ZennPatioEnvironment>
      {/* Ring of Yellow Citronella Buckets */}
      {[-450, -300, -150, 0, 150, 300, 450].map((cx, i) => (
        <g key={i} transform={`translate(${960 + cx}, 760)`}>
          <polygon points="-22,0 22,0 18,35 -18,35" fill="#FACC15" stroke={INK_BLACK} strokeWidth={3.5} />
          <ellipse cx={0} cy={0} rx={22} ry={6} fill="#FEF08A" stroke={INK_BLACK} strokeWidth={2.5} />
          <ellipse cx={0} cy={-6} rx={5} ry={8} fill="#F97316" />
          {/* Smoke plume */}
          <path
            d={`M 0 -12 Q ${Math.sin(frame * 0.15 + i) * 10} -40 ${-Math.sin(frame * 0.15 + i) * 10} -70`}
            stroke="#CBD5E1"
            strokeWidth={3}
            fill="none"
            opacity={0.6}
          />
        </g>
      ))}

      {/* The Lemon-Shaped Ghost Summoned from Smoke */}
      <g transform={`translate(960, ${360 + ghostFloat})`}>
        {/* Ghost Glow */}
        <circle cx={0} cy={0} r={120} fill="#FEF08A" opacity={0.35} />
        {/* Lemon Ghost Body */}
        <path
          d="M 0 -80 C 70 -60 100 -20 90 40 C 80 90 40 120 0 130 C -40 120 -80 90 -90 40 C -100 -20 -70 -60 0 -80 Z"
          fill="#FEF08A"
          stroke={INK_BLACK}
          strokeWidth={5}
          opacity={0.9}
        />
        {/* Ghost Eyes Coughing from Citronella */}
        <g stroke={INK_BLACK} strokeWidth={4} strokeLinecap="round">
          <line x1={-35} y1={-10} x2={-15} y2={-5} />
          <line x1={-35} y1={0} x2={-15} y2={-5} />
          <line x1={15} y1={-5} x2={35} y2={-10} />
          <line x1={15} y1={-5} x2={35} y2={0} />
        </g>
        {/* Ghost Coughing Mouth */}
        <ellipse cx={0} cy={30} rx={14} ry={20} fill="#78350F" stroke={INK_BLACK} strokeWidth={3.5} />
        <text x={70} y={20} fill="#F59E0B" fontSize={26} fontWeight="900">
          *COUGH!*
        </text>
      </g>

      {/* Comic Callout */}
      <g transform="translate(960, 950)">
        <rect
          x={-340}
          y={-40}
          width={680}
          height={80}
          rx={40}
          fill="#FACC15"
          stroke={INK_BLACK}
          strokeWidth={4.5}
        />
        <text
          x={0}
          y={10}
          fill={INK_BLACK}
          fontSize={25}
          fontWeight="900"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', 'Chalkboard SE', cursive"
        >
          CITRONELLA: SUMMONING LEMON GHOSTS 🍋👻
        </text>
      </g>
    </ZennPatioEnvironment>
  );
};

/**
 * 🥩 SCENE 6: Grand Opening Free Samples Billboard (Beat 13)
 */
export const ZennGrandOpeningBillboardScene: React.FC = () => {
  const frame = useCurrentFrame();
  const blink = Math.floor(frame / 12) % 2 === 0;

  return (
    <ZennPatioEnvironment>
      {/* Host in Center */}
      <g transform="translate(960, 680)">
        <ZennStickman
          x={0}
          y={0}
          scale={1.2}
          hasSpikyHair
          hasWelts
          shirtColor="#2563EB"
          eyes="worried"
          eyebrows="worried"
          mouth="shock_o"
          pose="standing_idle"
        />
      </g>

      {/* Massive Neon Grand Opening Sign Overhead */}
      <g transform="translate(960, 240)">
        {/* Steel Support Poles */}
        <line x1={-360} y1={100} x2={-360} y2={420} stroke="#475569" strokeWidth={10} />
        <line x1={360} y1={100} x2={360} y2={420} stroke="#475569" strokeWidth={10} />

        {/* Billboard Frame */}
        <rect
          x={-440}
          y={-120}
          width={880}
          height={240}
          rx={20}
          fill="#0F172A"
          stroke={blink ? '#EF4444' : '#FACC15'}
          strokeWidth={8}
        />

        {/* Neon Text */}
        <text
          x={0}
          y={-30}
          fill={blink ? '#F87171' : '#FBBF24'}
          fontSize={48}
          fontWeight="900"
          textAnchor="middle"
          fontFamily="'Impact', sans-serif"
          letterSpacing={2}
        >
          GRAND OPENING!
        </text>
        <text
          x={0}
          y={40}
          fill="#38BDF8"
          fontSize={42}
          fontWeight="900"
          textAnchor="middle"
          fontFamily="'Comic Sans MS', cursive"
        >
          FREE SAMPLES SERVED HERE 🥩🦟
        </text>

        {/* Flashing Runway Arrows Pointing Down at Host */}
        {[-220, 0, 220].map((ax) => (
          <g key={ax} transform={`translate(${ax}, 95)`}>
            <polygon points="0,25 -20,-10 20,-10" fill={blink ? '#FACC15' : '#EF4444'} stroke={INK_BLACK} strokeWidth={3} />
          </g>
        ))}
      </g>
    </ZennPatioEnvironment>
  );
};

/**
 * 🎯 SCENE 7: Bare Ankle Target Lock (Beat 15)
 */
export const ZennBareAnkleLockScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Extreme Macro of Ankle Region */}
        {/* Denim Jeans Cuff */}
        <path
          d="M 600 0 L 1320 0 L 1300 440 L 620 440 Z"
          fill="#1D4ED8"
          stroke={INK_BLACK}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {/* Denim Seams */}
        <line x1={960} y1={0} x2={960} y2={440} stroke="#FCD34D" strokeWidth={5} strokeDasharray="14 8" />

        {/* Exposed 1 cm Bare Skin Band */}
        <rect x={640} y={440} width={640} height={140} fill="#FED7AA" stroke={INK_BLACK} strokeWidth={8} />

        {/* Sock Below */}
        <path
          d="M 640 580 L 1280 580 L 1240 900 L 680 900 Z"
          fill="#F1F5F9"
          stroke={INK_BLACK}
          strokeWidth={8}
          strokeLinejoin="round"
        />
        {/* Sneaker Top */}
        <rect x={600} y={900} width={720} height={180} rx={20} fill="#DC2626" stroke={INK_BLACK} strokeWidth={8} />

        {/* Mosquito Landing Exactly on the Exposed Gap */}
        <g transform="translate(960, 500) scale(1.6)">
          <ZennMosquito x={0} y={0} scale={1} facing="left" angle={20} />
        </g>

        {/* Military Radar Target Crosshairs Lock-on */}
        <g transform="translate(960, 510)">
          <circle cx={0} cy={0} r={140} stroke="#22C55E" strokeWidth={6} fill="none" strokeDasharray="24 16" />
          <circle cx={0} cy={0} r={70} stroke="#22C55E" strokeWidth={4} fill="none" />
          <line x1={-170} y1={0} x2={-100} y2={0} stroke="#22C55E" strokeWidth={6} />
          <line x1={100} y1={0} x2={170} y2={0} stroke="#22C55E" strokeWidth={6} />
          <line x1={0} y1={-170} x2={0} y2={-100} stroke="#22C55E" strokeWidth={6} />
          <line x1={0} y1={100} x2={0} y2={170} stroke="#22C55E" strokeWidth={6} />

          <text
            x={0}
            y={-190}
            fill="#22C55E"
            fontSize={30}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="monospace"
          >
            TARGET ACQUIRED: 1CM EXPOSED ANKLE
          </text>
        </g>
      </svg>
    </div>
  );
};
