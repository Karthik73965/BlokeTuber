import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { INK_BLACK, VICTIM_RED, ZennStickman, ZennMosquito } from './ZennStyle';

/**
 * 🏢 SCENE 1: Friendly Microbial Tenants (Rent & Electricity) (Beat 3)
 */
export const ZennMicrobeTenantsScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#FED7AA', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Warm Skin Landscape Background */}
        <defs>
          <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FDE68A" />
            <stop offset="100%" stopColor="#FDBA74" />
          </linearGradient>
        </defs>
        <rect x={0} y={0} width={1920} height={1080} fill="url(#skinGrad)" />

        {/* Microscopic Hair Follicle standing like a Palm Tree */}
        <g transform="translate(1420, 300)">
          <path d="M 0 500 Q -30 250 10 0 Q 30 250 15 500 Z" fill="#78350F" stroke={INK_BLACK} strokeWidth={6} />
        </g>

        {/* Skin Pore Doorway (The Tenant's Apartment) */}
        <g transform="translate(960, 620)">
          {/* Pore Cave */}
          <ellipse cx={0} cy={120} rx={220} ry={70} fill="#C2410C" opacity={0.3} />
          <path d="M -160 140 C -160 -100 160 -100 160 140 Z" fill="#EA580C" stroke={INK_BLACK} strokeWidth={7} />

          {/* Doormat */}
          <rect x={-90} y={110} width={180} height={35} rx={8} fill="#78350F" stroke={INK_BLACK} strokeWidth={3} />
          <text x={0} y={132} fill="#FEF08A" fontSize={16} fontWeight="900" textAnchor="middle">
            WELCOME TENANTS
          </text>

          {/* Cute Microbe Tenant in Bathrobe Waving */}
          <g transform={`translate(0, 30) scale(${1 + Math.sin(frame * 0.15) * 0.05})`}>
            {/* Round Green Microbe Body */}
            <circle cx={0} cy={0} r={55} fill="#4ADE80" stroke={INK_BLACK} strokeWidth={5} />
            {/* Happy Eyes */}
            <circle cx={-18} cy={-10} r={10} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={2.5} />
            <circle cx={-18} cy={-10} r={4} fill={INK_BLACK} />
            <circle cx={18} cy={-10} r={10} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={2.5} />
            <circle cx={18} cy={-10} r={4} fill={INK_BLACK} />
            {/* Smile */}
            <path d="M -15 15 Q 0 30 15 15" stroke={INK_BLACK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
            {/* Waving Arm */}
            <line x1={45} y1={-5} x2={75 + Math.sin(frame * 0.3) * 10} y2={-35} stroke={INK_BLACK} strokeWidth={5} strokeLinecap="round" />
            {/* Little Hardhat / Shower Cap */}
            <ellipse cx={0} cy={-50} rx={40} ry={16} fill="#FACC15" stroke={INK_BLACK} strokeWidth={3.5} />
          </g>
        </g>

        {/* Host Stickman Landlord on Left */}
        <g transform="translate(480, 560)">
          <ZennStickman x={0} y={0} scale={1.2} shirtColor="#2563EB" eyes="normal" eyebrows="neutral" mouth="smirk" />
          {/* Rent Clipboard in Hand */}
          <g transform="translate(60, 110)">
            <rect x={-20} y={-35} width={65} height={90} rx={6} fill="#F8FAFC" stroke={INK_BLACK} strokeWidth={4} />
            <rect x={-8} y={-45} width={40} height={16} rx={3} fill="#64748B" stroke={INK_BLACK} strokeWidth={2.5} />
            <text x={12} y={-10} fill="#DC2626" fontSize={14} fontWeight="900">
              RENT
            </text>
            <line x1={-10} y1={10} x2={35} y2={10} stroke="#94A3B8" strokeWidth={2} />
            <line x1={-10} y1={25} x2={35} y2={25} stroke="#94A3B8" strokeWidth={2} />
          </g>
        </g>

        {/* Comic Speech Balloon */}
        <g transform="translate(1360, 400)">
          <ellipse cx={0} cy={0} rx={220} ry={70} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={5} />
          <polygon points="-80,55 -110,95 -60,65" fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={5} />
          <line x1={-82} y1={52} x2={-58} y2={67} stroke="#FFFFFF" strokeWidth={6} />
          <text x={0} y={-10} fill={INK_BLACK} fontSize={20} fontWeight="900" textAnchor="middle">
            "WE NEVER ASK IF RENT
          </text>
          <text x={0} y={22} fill={INK_BLACK} fontSize={20} fontWeight="900" textAnchor="middle">
            INCLUDES ELECTRICITY! ⚡"
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🧪 SCENE 2: Carboxylic Acids — "DO NOT LICK" (Beat 10)
 */
export const ZennCarboxylicDoNotLickScene: React.FC = () => {
  const frame = useCurrentFrame();
  const bubbleY = (frame % 30) * 4;

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0F172A', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Dark Laboratory Slate Backdrop */}
        <rect x={0} y={0} width={1920} height={1080} fill="#0F172A" />
        {/* Lab Bench Table */}
        <rect x={200} y={720} width={1520} height={120} rx={12} fill="#334155" stroke={INK_BLACK} strokeWidth={6} />

        {/* Giant Glass Erlenmeyer Flask */}
        <g transform="translate(960, 560)">
          {/* Flask Body */}
          <polygon points="-50,-180 50,-180 180,140 -180,140" fill="rgba(254, 243, 199, 0.25)" stroke="#F8FAFC" strokeWidth={8} strokeLinejoin="round" />
          <ellipse cx={0} cy={-180} rx={50} ry={14} fill="#E2E8F0" stroke="#F8FAFC" strokeWidth={5} />

          {/* Bubbling Amber Chemical Inside */}
          <polygon points="-120,40 120,40 170,135 -170,135" fill="#F59E0B" opacity={0.85} />
          {/* Bubbles rising */}
          {[-60, -20, 30, 70].map((bx, i) => (
            <circle key={i} cx={bx} cy={110 - ((bubbleY + i * 25) % 90)} r={10} fill="#FEF08A" stroke="#B45309" strokeWidth={2.5} />
          ))}

          {/* Bold Comic Warning Sticker: DO NOT LICK */}
          <g transform="translate(0, 50)">
            <rect
              x={-150}
              y={-45}
              width={300}
              height={90}
              rx={12}
              fill="#EF4444"
              stroke="#FFFFFF"
              strokeWidth={5}
            />
            <text x={0} y={-8} fill="#FFFFFF" fontSize={24} fontWeight="900" textAnchor="middle">
              ⚠️ HAZARD
            </text>
            <text x={0} y={28} fill="#FFFFFF" fontSize={28} fontWeight="900" textAnchor="middle">
              DO NOT LICK! 👅🚫
            </text>
          </g>
        </g>

        {/* Title Card */}
        <g transform="translate(960, 180)">
          <rect
            x={-360}
            y={-45}
            width={720}
            height={90}
            rx={20}
            fill="#FACC15"
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
            fontFamily="'Comic Sans MS', cursive"
          >
            CARBOXYLIC ACIDS: SKIN SPECIALTY 🧪
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🧫 SCENE 3: Abundance vs Diversity (Petri Dishes) (Beats 14 & 15)
 */
export const ZennAbundanceDiversityScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Lab Table */}
        <rect x={0} y={700} width={1920} height={380} fill="#1E293B" stroke={INK_BLACK} strokeWidth={6} />

        {/* Left Petri Dish: Magnet Host (High Abundance, Low Diversity) */}
        <g transform="translate(560, 480)">
          <circle cx={0} cy={0} r={220} fill="#1E293B" stroke="#64748B" strokeWidth={8} />
          <circle cx={0} cy={0} r={200} fill="#FEF3C7" opacity={0.3} />
          {/* Crowded single species colony (all red rods) */}
          {Array.from({ length: 45 }).map((_, i) => {
            const angle = (i / 45) * Math.PI * 2;
            const dist = 40 + ((i * 37) % 140);
            const bx = Math.cos(angle) * dist;
            const by = Math.sin(angle) * dist;
            return <rect key={i} x={bx} y={by} width={24} height={10} rx={5} fill="#EF4444" transform={`rotate(${i * 28})`} />;
          })}
          {/* Label Card */}
          <rect x={-180} y={150} width={360} height={60} rx={16} fill="#EF4444" stroke="#FFFFFF" strokeWidth={3} />
          <text x={0} y={188} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
            HIGH ABUNDANCE / LOW DIVERSITY
          </text>
        </g>

        {/* Right Petri Dish: Safe Host (High Diversity, Balanced Mix) */}
        <g transform="translate(1360, 480)">
          <circle cx={0} cy={0} r={220} fill="#1E293B" stroke="#64748B" strokeWidth={8} />
          <circle cx={0} cy={0} r={200} fill="#ECFDF5" opacity={0.3} />
          {/* Diverse rainbow colony (spheres, rods, spirals) */}
          {Array.from({ length: 45 }).map((_, i) => {
            const angle = (i / 45) * Math.PI * 2;
            const dist = 30 + ((i * 43) % 150);
            const bx = Math.cos(angle) * dist;
            const by = Math.sin(angle) * dist;
            const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899'];
            const col = colors[i % colors.length];
            return i % 2 === 0 ? (
              <circle key={i} cx={bx} cy={by} r={9} fill={col} />
            ) : (
              <rect key={i} x={bx} y={by} width={20} height={8} rx={4} fill={col} transform={`rotate(${i * 45})`} />
            );
          })}
          {/* Label Card */}
          <rect x={-180} y={150} width={360} height={60} rx={16} fill="#10B981" stroke="#FFFFFF" strokeWidth={3} />
          <text x={0} y={188} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
            HIGH DIVERSITY / BALANCED MIX
          </text>
        </g>

        {/* Header Banner */}
        <g transform="translate(960, 120)">
          <rect
            x={-340}
            y={-38}
            width={680}
            height={76}
            rx={38}
            fill="#FACC15"
            stroke={INK_BLACK}
            strokeWidth={5}
          />
          <text
            x={0}
            y={10}
            fill={INK_BLACK}
            fontSize={26}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            NOT MORE BACTERIA: THE EXACT MIX 🧫🔬
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 📢 SCENE 4: Barbecue Multivariable Clapback (Beats 18 & 19)
 */
export const ZennMultivariableMegaphoneScene: React.FC = () => {
  const frame = useCurrentFrame();
  const blastScale = 1 + Math.sin(frame * 0.3) * 0.08;

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Barbecue Deck */}
        <rect x={0} y={650} width={1920} height={430} fill="#78431E" stroke={INK_BLACK} strokeWidth={6} />

        {/* Host Stickman on Left with Megaphone */}
        <g transform="translate(480, 520)">
          <ZennStickman
            x={0}
            y={0}
            scale={1.25}
            hasSpikyHair
            shirtColor="#2563EB"
            eyes="angry"
            eyebrows="angry"
            mouth="shock_o"
            pose="standing_idle"
          />

          {/* Giant Comic Red Megaphone */}
          <g transform={`translate(70, 70) scale(${blastScale})`}>
            <polygon points="0,-15 140,-55 140,55 0,15" fill="#EF4444" stroke={INK_BLACK} strokeWidth={6} strokeLinejoin="round" />
            <rect x={-30} y={-18} width={30} height={36} rx={4} fill="#DC2626" stroke={INK_BLACK} strokeWidth={4} />
            <rect x={-10} y={18} width={16} height={35} rx={3} fill="#1E293B" stroke={INK_BLACK} strokeWidth={3} />

            {/* Powerful Sonic Soundwaves blasting out */}
            {[170, 210, 250].map((sw, i) => (
              <path
                key={i}
                d={`M ${sw} -40 Q ${sw + 30} 0 ${sw} 40`}
                stroke="#FACC15"
                strokeWidth={7}
                fill="none"
                strokeLinecap="round"
              />
            ))}
          </g>
        </g>

        {/* Giant Comic Clapback Speech Banner Across Screen */}
        <g transform="translate(1320, 420)">
          <rect
            x={-420}
            y={-120}
            width={840}
            height={240}
            rx={24}
            fill="#FFFFFF"
            stroke={INK_BLACK}
            strokeWidth={7}
          />
          <text
            x={0}
            y={-40}
            fill="#DC2626"
            fontSize={36}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Impact', sans-serif"
          >
            "THAT IS NOT HOW
          </text>
          <text
            x={0}
            y={15}
            fill="#1E293B"
            fontSize={34}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Impact', sans-serif"
          >
            MULTIVARIABLE HOST SEEKING
          </text>
          <text
            x={0}
            y={70}
            fill="#2563EB"
            fontSize={38}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Impact', sans-serif"
          >
            WORKS!" 📢🛑
          </text>
        </g>
      </svg>
    </div>
  );
};
