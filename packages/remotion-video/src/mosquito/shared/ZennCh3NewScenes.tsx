import React from 'react';
import { interpolate, spring, useCurrentFrame } from 'remotion';
import { INK_BLACK, VICTIM_RED, ZennStickman, ZennMosquito } from './ZennStyle';

/**
 * 🏥 SCENE 1: The Hospital Receptionist Mosquito (Beat 4)
 */
export const ZennHospitalReceptionistScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#E2E8F0', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Hospital Clinic Wall & Floor */}
        <rect x={0} y={0} width={1920} height={700} fill="#F1F5F9" />
        <rect x={0} y={700} width={1920} height={380} fill="#94A3B8" />
        <line x1={0} y1={700} x2={1920} y2={700} stroke={INK_BLACK} strokeWidth={6} />

        {/* Hospital Intake Reception Desk */}
        <g transform="translate(960, 680)">
          {/* Wooden Counter */}
          <rect x={-420} y={-100} width={840} height={140} rx={16} fill="#CBD5E1" stroke={INK_BLACK} strokeWidth={6} />
          {/* "PATIENT CHECK-IN" Sign */}
          <rect x={-160} y={-80} width={320} height={45} rx={8} fill="#0284C7" stroke={INK_BLACK} strokeWidth={3} />
          <text x={0} y={-50} fill="#FFFFFF" fontSize={20} fontWeight="900" textAnchor="middle">
            BLOOD TYPE CHECK-IN 🩺
          </text>
        </g>

        {/* Mosquito Nurse Receptionist behind Counter */}
        <g transform="translate(960, 520)">
          {/* Mosquito Body */}
          <ZennMosquito x={0} y={0} scale={1.5} facing="left" />

          {/* White Nurse Cap with Red Cross */}
          <g transform="translate(10, -50)">
            <path d="M -25 0 L 25 0 L 18 -30 L -18 -30 Z" fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={3} />
            <rect x={-3} y={-22} width={6} height={14} fill="#EF4444" />
            <rect x={-7} y={-18} width={14} height={6} fill="#EF4444" />
          </g>

          {/* Reading Glasses Perched on Eyes */}
          <g stroke={INK_BLACK} strokeWidth={3} fill="none">
            <circle cx={-40} cy={30} r={12} />
            <circle cx={-15} cy={30} r={12} />
            <line x1={-28} y1={30} x2={-27} y2={30} />
          </g>

          {/* Clipboard in Front */}
          <g transform="translate(-100, 60)">
            <rect x={-30} y={-45} width={60} height={90} rx={6} fill="#F8FAFC" stroke={INK_BLACK} strokeWidth={3.5} />
            <text x={0} y={-20} fill="#DC2626" fontSize={14} fontWeight="900" textAnchor="middle">
              TYPE O?
            </text>
            <line x1={-20} y1={0} x2={20} y2={0} stroke="#94A3B8" strokeWidth={2} />
            <line x1={-20} y1={18} x2={20} y2={18} stroke="#94A3B8" strokeWidth={2} />
          </g>
        </g>

        {/* Comic Myth Stamp Slamming Down */}
        <g transform="translate(1420, 320) rotate(12)">
          <rect
            x={-160}
            y={-50}
            width={320}
            height={100}
            rx={14}
            fill="#EF4444"
            stroke="#FFFFFF"
            strokeWidth={5}
          />
          <text x={0} y={15} fill="#FFFFFF" fontSize={32} fontWeight="900" textAnchor="middle">
            NOT RECEPTIONISTS! ❌
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🐊 SCENE 2: Type A Swamp Confidence Fail (Beat 9)
 */
export const ZennTypeASwampConfidenceScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#064E3B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Swamp Murky Waters & Grass */}
        <rect x={0} y={0} width={1920} height={600} fill="#065F46" />
        <rect x={0} y={600} width={1920} height={480} fill="#022C22" />
        <line x1={0} y1={600} x2={1920} y2={600} stroke={INK_BLACK} strokeWidth={6} />

        {/* Swamp Reeds */}
        {[200, 420, 700, 1200, 1500, 1750].map((rx, idx) => (
          <path
            key={idx}
            d={`M ${rx} 650 Q ${rx - 20} 500 ${rx + 10} 380`}
            stroke="#10B981"
            strokeWidth={12}
            fill="none"
            strokeLinecap="round"
          />
        ))}

        {/* Type A Stickman Strutting with Shorts & Sunglass Confidence */}
        <g transform="translate(820, 520)">
          <ZennStickman
            x={0}
            y={0}
            scale={1.25}
            shirtColor="#38BDF8"
            eyes="normal"
            eyebrows="neutral"
            mouth="smirk"
            pose="standing_idle"
          />
          {/* Cool Sunglasses */}
          <rect x={-32} y={-14} width={64} height={18} rx={4} fill="#0F172A" stroke={INK_BLACK} strokeWidth={2.5} />
          {/* Floral Tropical Shorts */}
          <rect x={-26} y={150} width={52} height={55} rx={6} fill="#F43F5E" stroke={INK_BLACK} strokeWidth={3.5} />

          {/* "TYPE A" Badge */}
          <rect x={-30} y={75} width={60} height={24} rx={6} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={2} />
          <text x={0} y={92} fill="#0284C7" fontSize={14} fontWeight="900" textAnchor="middle">
            TYPE A
          </text>
        </g>

        {/* Massive Cloud of Mosquitoes Swarming Him Instantly */}
        {Array.from({ length: 12 }).map((_, i) => {
          const mx = 800 + Math.sin(frame * 0.2 + i) * 140;
          const my = 480 + Math.cos(frame * 0.25 + i) * 120;
          return <ZennMosquito key={i} x={mx} y={my} scale={0.65} facing={i % 2 === 0 ? 'left' : 'right'} />;
        })}

        {/* Comic Banner */}
        <g transform="translate(960, 960)">
          <rect
            x={-360}
            y={-38}
            width={720}
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
            fontSize={23}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            "DO NOT WALK INTO A SWAMP WEARING CONFIDENCE" 🐊🦟
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 📄 SCENE 3: Meta Script Page 5 Toss (Beat 14)
 */
export const ZennMetaScriptPage5Scene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#1E293B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        <g transform="translate(960, 500)">
          {/* Big Script Page 5 Paper */}
          <rect x={-350} y={-360} width={700} height={720} rx={16} fill="#FFFBEB" stroke={INK_BLACK} strokeWidth={6} />
          <text x={-280} y={-290} fill="#92400E" fontSize={26} fontWeight="900" fontFamily="Courier, monospace">
            SIR CURIOUS - THE TWIN STUDY
          </text>
          <line x1={-280} y1={-265} x2={280} y2={-265} stroke="#D97706" strokeWidth={3} />

          {/* Big PAGE 5 Stamp */}
          <rect x={180} y={-320} width={100} height={50} rx={10} fill="#3B82F6" stroke={INK_BLACK} strokeWidth={3} />
          <text x={230} y={-286} fill="#FFFFFF" fontSize={22} fontWeight="900" textAnchor="middle">
            PAGE 5
          </text>

          {/* Doodles on the page */}
          <text x={-280} y={-180} fill={INK_BLACK} fontSize={30} fontWeight="900">
            "Roughly 0.62 heritability..."
          </text>
          <text x={-280} y={-130} fill="#64748B" fontSize={22} fontWeight="700">
            (Identical vs Fraternal hand odors in Y-tube)
          </text>

          {/* Green Stamp: STRONG CLUE (NOT DESTINY) */}
          <g transform="translate(0, 100) rotate(-6)">
            <rect x={-220} y={-45} width={440} height={90} rx={14} fill="#10B981" stroke="#FFFFFF" strokeWidth={5} />
            <text x={0} y={12} fill="#FFFFFF" fontSize={26} fontWeight="900" textAnchor="middle">
              STRONG CLUE, NOT DESTINY ✅
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🕵️ SCENE 4: No Revenge List (Detective Corkboard) (Beat 21)
 */
export const ZennNoRevengeListScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0F172A', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Detective Noir Corkboard */}
        <rect x={200} y={100} width={1520} height={800} rx={20} fill="#B45309" stroke={INK_BLACK} strokeWidth={8} />
        <rect x={240} y={140} width={1440} height={720} rx={12} fill="#D97706" opacity={0.6} />

        {/* Suspect Polaroid Photos Pinned with Red String */}
        {[-380, 0, 380].map((px, i) => (
          <g key={i} transform={`translate(${960 + px}, 460) rotate(${i === 0 ? -6 : i === 1 ? 4 : -3})`}>
            <rect x={-110} y={-140} width={220} height={280} rx={6} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={4} />
            <rect x={-90} y={-120} width={180} height={180} fill="#334155" />
            {/* Stickman Mugshot inside Photo */}
            <circle cx={0} cy={-40} r={35} fill="#FFFFFF" stroke={INK_BLACK} strokeWidth={3} />
            <text x={0} y={115} fill={INK_BLACK} fontSize={16} fontWeight="900" textAnchor="middle">
              SUSPECT #{104 + i}
            </text>
            {/* Pin */}
            <circle cx={0} cy={-130} r={8} fill="#EF4444" stroke={INK_BLACK} strokeWidth={2} />
          </g>
        ))}

        {/* Giant Red Stamp: NO REVENGE LIST */}
        <g transform="translate(960, 520) rotate(-10)">
          <rect
            x={-340}
            y={-65}
            width={680}
            height={130}
            rx={20}
            fill="#EF4444"
            stroke="#FFFFFF"
            strokeWidth={8}
          />
          <text
            x={0}
            y={18}
            fill="#FFFFFF"
            fontSize={44}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Impact', sans-serif"
            letterSpacing={2}
          >
            NO REVENGE LIST! ❌
          </text>
        </g>
      </svg>
    </div>
  );
};

/**
 * 🍽️ SCENE 5: Limited Edition Mosquito Cuisine (Beat 23)
 */
export const ZennLimitedEditionCuisineScene: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, backgroundColor: '#0B132B', position: 'relative' }}>
      <svg width="1920" height="1080" viewBox="0 0 1920 1080">
        {/* Luxury Banquet Table */}
        <rect x={0} y={700} width={1920} height={380} fill="#78350F" stroke={INK_BLACK} strokeWidth={6} />
        <line x1={0} y1={700} x2={1920} y2={700} stroke={INK_BLACK} strokeWidth={6} />

        {/* Host Stickman on Left as Proud 5-Star Chef */}
        <g transform="translate(620, 520)">
          <ZennStickman
            x={0}
            y={0}
            scale={1.25}
            shirtColor="#FFFFFF"
            eyes="normal"
            eyebrows="neutral"
            mouth="smirk"
            pose="standing_idle"
          />
          {/* Chef Hat */}
          <path
            d="M -30 -50 C -50 -100 50 -100 30 -50 Z"
            fill="#FFFFFF"
            stroke={INK_BLACK}
            strokeWidth={4}
          />
        </g>

        {/* Silver Banquet Cloche on Platter */}
        <g transform="translate(1260, 620)">
          {/* Silver Tray */}
          <ellipse cx={0} cy={80} rx={260} ry={30} fill="#E2E8F0" stroke={INK_BLACK} strokeWidth={6} />
          {/* Silver Dome Cloche */}
          <path
            d="M -200 80 C -200 -120 200 -120 200 80 Z"
            fill="#CBD5E1"
            stroke={INK_BLACK}
            strokeWidth={7}
          />
          {/* Golden Handle Ring */}
          <circle cx={0} cy={-125} r={20} fill="none" stroke="#FACC15" strokeWidth={7} />
          {/* Shiny Reflections */}
          <path d="M -120 20 Q -80 -70 0 -90" stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" />
        </g>

        {/* Comic 5-Star Banner */}
        <g transform="translate(960, 180)">
          <rect
            x={-420}
            y={-50}
            width={840}
            height={100}
            rx={20}
            fill="#FACC15"
            stroke={INK_BLACK}
            strokeWidth={6}
          />
          <text
            x={0}
            y={-5}
            fill="#78350F"
            fontSize={32}
            fontWeight="900"
            textAnchor="middle"
            fontFamily="'Comic Sans MS', cursive"
          >
            LIMITED EDITION MOSQUITO CUISINE 🍽️
          </text>
          <text
            x={0}
            y={32}
            fill="#DC2626"
            fontSize={22}
            fontWeight="900"
            textAnchor="middle"
          >
            ⭐⭐⭐⭐⭐ (5 OUT OF 5 BITES)
          </text>
        </g>
      </svg>
    </div>
  );
};
