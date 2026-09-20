import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { INK_BLACK, VICTIM_RED, ZennStickman, ZennMosquito } from './ZennStyle';

/**
 * 🛡️ SCENE 1: The Group Decoy Dilemma (Beat 1)
 */
export const ZennGroupDecoyScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Patio Deck Floor */}
        <rect x={0} y={660} width={1920} height={420} fill="#78431E" stroke={INK_BLACK} strokeWidth={6} />

        {/* 3 Coward Friends Hiding Behind Host */}
        <g transform="translate(680, 520)">
          {/* Friend 1 (Green) */}
          <g transform="translate(-140, 20)">
            <ZennStickman x={0} y={0} scale={1.05} shirtColor="#10B981" eyes="worried" eyebrows="worried" />
          </g>
          {/* Friend 2 (Purple) */}
          <g transform="translate(-80, -10)">
            <ZennStickman x={0} y={0} scale={1.05} shirtColor="#8B5CF6" eyes="worried" eyebrows="worried" />
          </g>
          {/* Friend 3 (Slate) */}
          <g transform="translate(-200, 40)">
            <ZennStickman x={0} y={0} scale={1.05} shirtColor="#64748B" eyes="worried" eyebrows="worried" />
          </g>
        </g>

        {/* Host Stickman Pushed to Front as Decoy */}
        <g transform="translate(980, 520)">
          <ZennStickman
            x={0}
            y={0}
            scale={1.3}
            hasSpikyHair
            hasWelts
            shirtColor="#2563EB"
            eyes="angry"
            eyebrows="angry"
            mouth="frown"
            pose="standing_idle"
          />
          {/* "GROUP DECOY" Target Tag on Chest */}
          <g transform="translate(0, 110)">
            <rect x={-70} y={-20} width={140} height={40} rx={10} fill="#EF4444" stroke="#FFFFFF" strokeWidth={3} />
            <text x={0} y={7} fill="#FFFFFF" fontSize={16} fontWeight="900" textAnchor="middle">
              HUMAN SHIELD 🎯
            </text>
          </g>
        </g>

        {/* Cloud of Mosquitoes Heading Straight for Host */}
        {Array.from({ length: 10 }).map((_, i) => {
          const mx = 1380 + Math.sin(frame * 0.15 + i) * 60;
          const my = 480 + Math.cos(frame * 0.18 + i) * 50;
          return <ZennMosquito key={i} x={mx} y={my} scale={0.7} facing="left" />;
        })}

        {/* Comic Banner */}
        <g transform="translate(960, 950)">
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
            fontSize={25}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            "SHOULD YOU ACCEPT YOUR ROLE AS THE DECOY?" 🛡️😅
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🧴 SCENE 2: The Proven Active Ingredients Shelf (Beats 2 & 3)
 */
export const ZennProvenRepellentsShelfScene: React.FC = () => {
  const frame = useCurrentFrame();

  const repellents = [
    { name: 'DEET', color: '#EF4444', x: 360 },
    { name: 'PICARIDIN', color: '#3B82F6', x: 660 },
    { name: 'IR3535', color: '#10B981', x: 960 },
    { name: 'OIL OF LEMON EUCALYPTUS (PMD)', color: '#F59E0B', x: 1260 },
    { name: '2-UNDECANONE', color: '#8B5CF6', x: 1560 },
  ];

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0F172A', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Wooden Arsenal Shelf */}
        <rect x={160} y={640} width={1600} height={45} rx={10} fill="#854D0E" stroke={INK_BLACK} strokeWidth={6} />
        <rect x={160} y={685} width={1600} height={20} fill="#713F12" />

        {/* Repellent Spray Cans / Bottles */}
        {repellents.map((r, i) => {
          const delay = i * 8;
          const pop = Math.min(Math.max((frame - delay) / 12, 0), 1);
          return (
            <g key={r.name} transform={`translate(${r.x}, 520) scale(${pop})`}>
              {/* Bottle Body */}
              <rect x={-55} y={-110} width={110} height={220} rx={18} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={5} />
              {/* Colored Label */}
              <rect x={-45} y={-40} width={90} height={120} rx={10} fill={r.color} />
              {/* Spray Nozzle */}
              <rect x={-20} y={-145} width={40} height={35} rx={6} fill="#E2E8F0" stroke={INK_BLACK} strokeWidth={4} />
              <rect x={10} y={-135} width={15} height={10} rx={2} fill="#0F172A" />

              {/* Green Verified Checkmark Stamp */}
              <circle cx={40} cy={-85} r={22} fill="#10B981" stroke="#FFFFFF" strokeWidth={3.5} />
              <text x={40} y={-77} fill="#FFFFFF" fontSize={20} fontWeight="900" textAnchor="middle">
                ✓
              </text>

              {/* Ingredient Name Text */}
              <text
                x={0}
                y={150}
                fill="#FFFFFF"
                fontSize={17}
                fontWeight="900"
                textAnchor="middle"
                fontFamily="sans-serif"
              >
                {r.name}
              </text>
            </g>
          );
        })}

        {/* Header Title */}
        <g transform="translate(960, 140)">
          <rect
            x={-340}
            y={-38}
            width={680}
            height={76}
            rx={38}
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
            fontFamily="'Comic Sans MS', cursive"
          >
            PROVEN & REGISTERED REPELLENTS ✅🧴
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🌀 SCENE 3: Patio Fan Windstream Solution (Beat 6)
 */
export const ZennPatioFanWindstreamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const fanBladeAngle = (frame * 35) % 360;

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Patio Deck Floor */}
        <rect x={0} y={700} width={1920} height={380} fill="#78431E" stroke={INK_BLACK} strokeWidth={6} />

        {/* Large Pedestal Fan on Left */}
        <g transform="translate(420, 520)">
          {/* Fan Base & Pole */}
          <line x1={0} y1={50} x2={0} y2={260} stroke="#334155" strokeWidth={14} strokeLinecap="round" />
          <ellipse cx={0} cy={260} rx={110} ry={25} fill="#1E293B" stroke={INK_BLACK} strokeWidth={6} />

          {/* Fan Cage Ring */}
          <circle cx={0} cy={-20} r={160} fill="none" stroke="#64748B" strokeWidth={10} />
          <circle cx={0} cy={-20} r={160} fill="rgba(241, 245, 249, 0.08)" />

          {/* Spinning Fan Blades */}
          <g transform={`translate(0, -20) rotate(${fanBladeAngle})`}>
            <circle cx={0} cy={0} r={28} fill="#0F172A" stroke={INK_BLACK} strokeWidth={4} />
            {[0, 120, 240].map((deg) => (
              <ellipse
                key={deg}
                cx={0}
                cy={-75}
                rx={34}
                ry={65}
                fill="#38BDF8"
                stroke={INK_BLACK}
                strokeWidth={3}
                transform={`rotate(${deg})`}
                opacity={0.7}
              />
            ))}
          </g>
        </g>

        {/* Powerful Windstream Blasting to Right */}
        {[280, 360, 440, 520, 600].map((wy, idx) => {
          const shift = (frame * 18 + idx * 80) % 1200;
          return (
            <path
              key={wy}
              d={`M ${620 + shift} ${wy} Q ${720 + shift} ${wy - 15} ${820 + shift} ${wy}`}
              stroke="#38BDF8"
              strokeWidth={8}
              strokeLinecap="round"
              fill="none"
              opacity={0.8}
            />
          );
        })}

        {/* Mosquitoes Tumbling Backwards in Hurricane Force */}
        {[0, 1, 2].map((i) => {
          const tx = 1380 + i * 160 + Math.sin(frame * 0.3 + i) * 30;
          const ty = 400 + i * 80;
          return (
            <g key={i} transform={`translate(${tx}, ${ty}) rotate(${frame * 12 + i * 45})`}>
              <ZennMosquito x={0} y={0} scale={1.1} facing="left" />
            </g>
          );
        })}

        {/* Comic Banner */}
        <g transform="translate(960, 950)">
          <rect
            x={-350}
            y={-38}
            width={700}
            height={76}
            rx={38}
            fill="#0284C7"
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
            "A FAN BLOWS THEM BACK & SHREDS THE PLUME" 💨🌀
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🪣 SCENE 4: Dumping Standing Water Maternity Wards (Beat 7)
 */
export const ZennMaternityWardsDumpScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Garden Grass Floor */}
        <rect x={0} y={680} width={1920} height={400} fill="#14532D" stroke={INK_BLACK} strokeWidth={6} />

        {/* Host Stickman on Left Tipping Over Bucket */}
        <g transform="translate(560, 520)">
          <ZennStickman x={0} y={0} scale={1.25} shirtColor="#2563EB" eyes="normal" eyebrows="neutral" mouth="smirk" />
        </g>

        {/* Overturned Yellow Bucket with Water Splashing Out */}
        <g transform="translate(920, 680) rotate(80)">
          <polygon points="-40,0 40,0 30,110 -30,110" fill="#FACC15" stroke={INK_BLACK} strokeWidth={6} strokeLinejoin="round" />
          {/* Water Splash */}
          <path
            d="M 40 20 Q 90 60 140 10 Q 180 80 120 120 Z"
            fill="#38BDF8"
            stroke={INK_BLACK}
            strokeWidth={4}
          />
        </g>

        {/* Flowerpot Saucer Dumped on Right */}
        <g transform="translate(1380, 690)">
          <polygon points="-60,0 60,0 50,70 -50,70" fill="#EA580C" stroke={INK_BLACK} strokeWidth={5} strokeLinejoin="round" />
          <ellipse cx={0} cy={75} rx={80} ry={15} fill="#C2410C" stroke={INK_BLACK} strokeWidth={4} />
          {/* Water drops flying */}
          <circle cx={40} cy={-20} r={8} fill="#38BDF8" />
          <circle cx={70} cy={-50} r={12} fill="#38BDF8" />
        </g>

        {/* Giant Comic Stamp: MOSQUITO MATERNITY WARD CLOSED */}
        <g transform="translate(960, 300) rotate(-6)">
          <rect
            x={-380}
            y={-60}
            width={760}
            height={120}
            rx={20}
            fill="#EF4444"
            stroke="#FFFFFF"
            strokeWidth={7}
          />
          <text
            x={0}
            y={15}
            fill="#FFFFFF"
            fontSize={36}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Impact', sans-serif"
            letterSpacing={2}
          >
            MATERNITY WARDS CLOSED! 🚫👶🪣
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🧄 SCENE 5: Miracle Foods Debunking Conveyor & Uncle (Beats 8 & 9)
 */
export const ZennMiracleFoodUncleScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0F172A', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Conveyor Belt on Left */}
        <g transform="translate(680, 560)">
          <rect x={-420} y={60} width={840} height={40} rx={10} fill="#475569" stroke={INK_BLACK} strokeWidth={5} />

          {/* Food 1: Giant Garlic Clove */}
          <g transform="translate(-300, 0)">
            <path d="M 0 -50 C -35 -20 -40 40 0 50 C 40 40 35 -20 0 -50 Z" fill="#F8FAFC" stroke={INK_BLACK} strokeWidth={4} />
            <text x={0} y={95} fill="#EF4444" fontSize={20} fontWeight="900" textAnchor="middle">
              GARLIC ❌
            </text>
          </g>

          {/* Food 2: Banana */}
          <g transform="translate(-100, 0)">
            <path d="M -35 -40 Q 0 10 35 40 Q 15 20 -20 -30 Z" fill="#FACC15" stroke={INK_BLACK} strokeWidth={4} />
            <text x={0} y={95} fill="#EF4444" fontSize={20} fontWeight="900" textAnchor="middle">
              BANANA ❌
            </text>
          </g>

          {/* Food 3: Hot Sauce Bottle */}
          <g transform="translate(100, 0)">
            <rect x={-18} y={-40} width={36} height={70} rx={6} fill="#EF4444" stroke={INK_BLACK} strokeWidth={3.5} />
            <rect x={-8} y={-55} width={16} height={15} fill="#10B981" stroke={INK_BLACK} strokeWidth={2.5} />
            <text x={0} y={95} fill="#EF4444" fontSize={20} fontWeight="900" textAnchor="middle">
              HOT SAUCE ❌
            </text>
          </g>

          {/* Food 4: Spoonful of Marmite */}
          <g transform="translate(300, 0)">
            <ellipse cx={0} cy={-20} rx={30} ry={14} fill="#451A03" stroke={INK_BLACK} strokeWidth={3.5} />
            <line x1={30} y1={-20} x2={70} y2={20} stroke="#94A3B8" strokeWidth={5} strokeLinecap="round" />
            <text x={0} y={95} fill="#EF4444" fontSize={20} fontWeight="900" textAnchor="middle">
              MARMITE ❌
            </text>
          </g>
        </g>

        {/* Uncle in Rocking Chair on Right with Garlic */}
        <g transform="translate(1480, 520)">
          {/* Rocking Chair Curved Runners */}
          <path d="M -90 190 Q 0 230 90 190" stroke="#854D0E" strokeWidth={8} fill="none" strokeLinecap="round" />
          <ZennStickman x={0} y={0} scale={1.15} shirtColor="#F59E0B" eyes="normal" eyebrows="neutral" mouth="smirk" />

          {/* Speech Bubble from Uncle */}
          <g transform="translate(-10, -180)">
            <ellipse cx={0} cy={0} rx={160} ry={55} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={4} />
            <text x={0} y={8} fill={INK_BLACK} fontSize={20} fontWeight="900" textAnchor="middle">
              "WORKS FOR ME! 🧄"
            </text>
          </g>
        </g>

        {/* Comic Banner */}
        <g transform="translate(960, 950)">
          <rect
            x={-350}
            y={-38}
            width={700}
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
            fontSize={23}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            "ENJOY THE UNCLE. USE TESTED PROTECTION." 🧄✅
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🕯️ SCENE 6: Citronella Mood Lighting with Ambition (Beat 10)
 */
export const ZennCitronellaAmbitionScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Massive 20m Empty Patio Deck */}
        <rect x={0} y={650} width={1920} height={430} fill="#78431E" stroke={INK_BLACK} strokeWidth={6} />

        {/* Lone Tiny Citronella Candle in Center with Cape */}
        <g transform="translate(960, 680)">
          {/* Red Superhero Cape Flapping on Candle */}
          <path
            d={`M -20 0 Q -70 ${20 + Math.sin(frame * 0.3) * 10} -90 ${-20 + Math.sin(frame * 0.3) * 15} L -30 40 Z`}
            fill="#EF4444"
            stroke={INK_BLACK}
            strokeWidth={3}
          />
          {/* Yellow Bucket Body */}
          <polygon points="-30,0 30,0 25,50 -25,50" fill="#FACC15" stroke={INK_BLACK} strokeWidth={4} strokeLinejoin="round" />
          <ellipse cx={0} cy={0} rx={30} ry={10} fill="#FEF08A" stroke={INK_BLACK} strokeWidth={3} />
          {/* Flame */}
          <ellipse cx={0} cy={-12} rx={7} ry={12} fill="#F97316" />

          {/* Cool Sunglasses on Candle */}
          <rect x={-20} y={15} width={40} height={12} rx={3} fill="#0F172A" stroke={INK_BLACK} strokeWidth={2} />
        </g>

        {/* Mosquitoes Flying Straight Past It Unbothered */}
        {[-320, 320].map((mx, i) => (
          <g key={i} transform={`translate(${960 + mx}, 520)`}>
            <ZennMosquito x={0} y={0} scale={1.3} facing={i === 0 ? 'right' : 'left'} />
          </g>
        ))}

        {/* Comic Banner */}
        <g transform="translate(960, 240)">
          <rect
            x={-420}
            y={-55}
            width={840}
            height={110}
            rx={24}
            fill="#FACC15"
            stroke={INK_BLACK}
            strokeWidth={6}
          />
          <text
            x={0}
            y={0}
            fill={INK_BLACK}
            fontSize={36}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            "NOT A FORCE FIELD:"
          </text>
          <text
            x={0}
            y={38}
            fill="#DC2626"
            fontSize={30}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Impact', sans-serif"
          >
            MOOD LIGHTING WITH AMBITION 🕯️✨
          </text>
        </g>
      </svg>
    </div>
  );
};
