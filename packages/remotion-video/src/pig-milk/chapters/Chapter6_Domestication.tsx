import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import {
  BarnInteriorEnv,
  ButterBlock,
  CheeseWheel,
  ChemistryLabEnv,
  DomesticationTournamentCard,
  DoodleCamel,
  DoodleCow,
  DoodleGoat,
  DoodlePig,
  DoodlePiglet,
  DoodleSheep,
  DoodleStickman,
  FarmPastureEnv,
  MilkBottle,
  MilkCanister,
  MilkingBucket,
  PopIn,
  SfxTrigger,
  SlideIn,
  StoryBadge,
  WorldMapEnv,
  ZoomIn,
} from '../shared/PigMilkElements';

/**
 * 🎬 CHAPTER 6: Why Domestication Isn't Random (94.75s / 2,842 frames @ 30fps)
 * 
 * STRICT DIRECTING RULES:
 * - Total frames: exactly 2842 frames @ 30fps
 * - Stickman is channel avatar: featured prominently in every beat with expressive eyes, clean shirt, parallel legs
 * - BEAT PACING STRICTLY <= 135 FRAMES (< 4.5s per Sequence beat)
 * - 100% full-bleed backdrops (World Map, Tournament Arena, Pasture, Barn)
 * - Visuals: Domestication Tournament Scorecard (Cattle A+, Goats A, Sheep A, Camels A- vs Pig F-),
 *   World Map of regional milk cultures, cultural lock-in and why traditions stuck.
 * - SFX strictly at volume={0.6}
 */
export const Chapter6_Domestication: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#0F172A' }}>
      {/* Voiceover Master Audio */}
      <Audio src={staticFile('audio/pig_milk/6_domestication.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1 (0..73, dur 73f): "Here's where it gets interesting." */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={73}>
        <FarmPastureEnv showBarn={true} showFence={true}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          <PopIn startFrame={8} scale={1.1}>
            <StoryBadge text="WHY DOMESTICATION ISN'T RANDOM" x={960} y={110} bgColor="#0F172A" textColor="#FDE047" fontSize={36} />
          </PopIn>

          {/* Stickman as Tournament Referee */}
          <DoodleStickman
            x={960}
            y={520}
            scale={1.4}
            shirtColor="#FFFFFF"
            expression="grin"
            pose="waving"
            pupilDirection="center"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2 (73..200, dur 127f): "Humans actually experimented with plenty of milk-producing animals." */}
      {/* ================================================================ */}
      <Sequence from={73} durationInFrames={127}>
        <BarnInteriorEnv>
          <SfxTrigger sound="paper_slide" volume={0.6} startFrame={5} />

          <StoryBadge text="THE ANCIENT ANIMAL EXPERIMENTATION LAB" x={960} y={110} bgColor="#78350F" textColor="#FEF08A" fontSize={32} />

          {/* Ancient Parchment Scroll of Domesticated Species */}
          <g transform="translate(1100, 420)">
            <rect x={-450} y={-210} width={900} height={420} rx={20} fill="#FEF3C7" stroke="#78350F" strokeWidth={6} />
            <text x={0} y={-140} textAnchor="middle" fill="#78350F" fontSize={26} fontWeight="900" fontFamily="serif">
              ANCIENT DOMESTICATION ARCHIVES (10,000 BCE - PRESENT)
            </text>
            <line x1={-380} y1={-115} x2={380} y2={-115} stroke="#B45309" strokeWidth={2} strokeDasharray="6 6" />

            {/* Trial Animal Icons */}
            <g transform="translate(-320, 20)">
              <circle cx={0} cy={-20} r={50} fill="#E0E7FF" stroke="#1E1B4B" strokeWidth={3} />
              <text x={0} y={-10} textAnchor="middle" fontSize={36}>🐮</text>
              <text x={0} y={55} textAnchor="middle" fill="#1E1B4B" fontSize={18} fontWeight="bold">CATTLE</text>
            </g>

            <g transform="translate(-110, 20)">
              <circle cx={0} cy={-20} r={50} fill="#FEF3C7" stroke="#78350F" strokeWidth={3} />
              <text x={0} y={-10} textAnchor="middle" fontSize={36}>🐐</text>
              <text x={0} y={55} textAnchor="middle" fill="#78350F" fontSize={18} fontWeight="bold">GOAT</text>
            </g>

            <g transform="translate(110, 20)">
              <circle cx={0} cy={-20} r={50} fill="#F1F5F9" stroke="#334155" strokeWidth={3} />
              <text x={0} y={-10} textAnchor="middle" fontSize={36}>🐑</text>
              <text x={0} y={55} textAnchor="middle" fill="#334155" fontSize={18} fontWeight="bold">SHEEP</text>
            </g>

            <g transform="translate(320, 20)">
              <circle cx={0} cy={-20} r={50} fill="#FEF08A" stroke="#854D0E" strokeWidth={3} />
              <text x={0} y={-10} textAnchor="middle" fontSize={36}>🐫</text>
              <text x={0} y={55} textAnchor="middle" fill="#854D0E" fontSize={18} fontWeight="bold">CAMEL</text>
            </g>

            <text x={0} y={150} textAnchor="middle" fill="#92400E" fontSize={20} fontWeight="900">
              OVER 30+ MAMMALIAN SPECIES TRIED ACROSS 6 CONTINENTS
            </text>
          </g>

          <DoodleStickman
            x={340}
            y={530}
            scale={1.3}
            shirtColor="#B45309"
            expression="curious"
            pose="holding_magnifier"
            pupilDirection="center"
          />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3 (200..328, dur 128f): "Cattle, goats, sheep, camels, buffalo, yaks..." */}
      {/* ================================================================ */}
      <Sequence from={200} durationInFrames={128}>
        <FarmPastureEnv showBarn={false} showFence={true}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          <StoryBadge text="THE BIG FOUR DAIRY SPECIES" x={960} y={100} bgColor="#0F172A" textColor="#38BDF8" fontSize={32} />

          {/* 4 Animals PopIn Grid */}
          <g transform="translate(240, 520)">
            <DoodleCow x={0} y={0} scale={0.85} mood="proud" />
            <StoryBadge text="COW (CATTLE)" x={0} y={150} bgColor="#0284C7" textColor="#FFFFFF" fontSize={20} />
          </g>

          <g transform="translate(720, 530)">
            <DoodleGoat x={0} y={0} scale={0.95} />
            <StoryBadge text="GOAT" x={0} y={140} bgColor="#059669" textColor="#FFFFFF" fontSize={20} />
          </g>

          <g transform="translate(1200, 540)">
            <DoodleSheep x={0} y={0} scale={0.95} />
            <StoryBadge text="SHEEP" x={0} y={130} bgColor="#475569" textColor="#FFFFFF" fontSize={20} />
          </g>

          <g transform="translate(1680, 500)">
            <DoodleCamel x={0} y={0} scale={0.8} />
            <StoryBadge text="CAMEL" x={0} y={170} bgColor="#D97706" textColor="#FFFFFF" fontSize={20} />
          </g>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4 (328..450, dur 122f): "...mares, reindeer, donkeys, even a few wild species..." */}
      {/* ================================================================ */}
      <Sequence from={328} durationInFrames={122}>
        <WorldMapEnv>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          <StoryBadge text="SPECIALIZED REGIONAL ADAPTATIONS" x={960} y={160} bgColor="#1E293B" textColor="#38BDF8" fontSize={30} />

          {/* Floating cards for specialized species */}
          <g transform="translate(560, 460)">
            <rect x={-220} y={-80} width={440} height={160} rx={16} fill="#0F172A" stroke="#F59E0B" strokeWidth={4} />
            <text x={0} y={-35} textAnchor="middle" fill="#FDE047" fontSize={24} fontWeight="900">🐴 MARE (HORSE MILK)</text>
            <text x={0} y={5} textAnchor="middle" fill="#FFFFFF" fontSize={18}>Central Asian Steppes</text>
            <text x={0} y={35} textAnchor="middle" fill="#94A3B8" fontSize={16}>Fermented Kumis / Airag drink</text>
          </g>

          <g transform="translate(1360, 460)">
            <rect x={-220} y={-80} width={440} height={160} rx={16} fill="#0F172A" stroke="#38BDF8" strokeWidth={4} />
            <text x={0} y={-35} textAnchor="middle" fill="#BAE6FD" fontSize={24} fontWeight="900">🦌 REINDEER MILK</text>
            <text x={0} y={5} textAnchor="middle" fill="#FFFFFF" fontSize={18}>Arctic & Subarctic Tundra</text>
            <text x={0} y={35} textAnchor="middle" fill="#94A3B8" fontSize={16}>Hyper-dense 22% butterfat</text>
          </g>

          <g transform="translate(960, 720)">
            <rect x={-260} y={-70} width={520} height={140} rx={16} fill="#0F172A" stroke="#10B981" strokeWidth={4} />
            <text x={0} y={-25} textAnchor="middle" fill="#6EE7B7" fontSize={24} fontWeight="900">🦬 WATER BUFFALO & YAK</text>
            <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={18}>Italian Mozzarella di Bufala & Tibetan Butter Tea</text>
          </g>

          <DoodleStickman
            x={180}
            y={620}
            scale={1.2}
            shirtColor="#FFFFFF"
            expression="curious"
            pose="pointing_board"
            pupilDirection="center"
          />
        </WorldMapEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5 (450..548, dur 98f): "...in specific circumstances. So why did those succeed, where pigs didn't?" */}
      {/* ================================================================ */}
      <Sequence from={450} durationInFrames={98}>
        <FarmPastureEnv showBarn={false} showFence={false}>
          <SfxTrigger sound="whoosh_air" volume={0.6} startFrame={0} />

          {/* Comparison Split: The Winners vs The Pig */}
          <g transform="translate(580, 520)">
            <rect x={-320} y={-220} width={640} height={440} rx={20} fill="#064E3B" stroke="#34D399" strokeWidth={5} />
            <text x={0} y={-170} textAnchor="middle" fill="#FDE047" fontSize={28} fontWeight="900">
              DOMESTICATION WINNERS
            </text>
            <DoodleCow x={-100} y={30} scale={0.75} mood="proud" />
            <DoodleGoat x={120} y={40} scale={0.8} />
            <rect x={-220} y={130} width={440} height={40} rx={20} fill="#047857" />
            <text x={0} y={156} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontWeight="bold">
              ✔ 8,000+ YEARS DAIRY TRADITION
            </text>
          </g>

          <g transform="translate(1340, 520)">
            <rect x={-320} y={-220} width={640} height={440} rx={20} fill="#7F1D1D" stroke="#EF4444" strokeWidth={5} />
            <text x={0} y={-170} textAnchor="middle" fill="#FECDD3" fontSize={28} fontWeight="900">
              THE EXCLUDED: PIGS
            </text>
            <DoodlePig x={0} y={30} scale={1.05} pose="standing" mood="irritated" />
            <rect x={-220} y={130} width={440} height={40} rx={20} fill="#991B1B" />
            <text x={0} y={156} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontWeight="bold">
              ✖ ZERO DAIRY RECORD IN HISTORY
            </text>
          </g>

          <StoryBadge text="SO WHY DID THEY SUCCEED WHERE PIGS FAILED?" x={960} y={110} bgColor="#0F172A" textColor="#FACC15" fontSize={32} />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6 (548..669, dur 121f): "Because domestication rewards animals that are manageable..." */}
      {/* ================================================================ */}
      <Sequence from={548} durationInFrames={121}>
        <BarnInteriorEnv>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Domestication Rule 1 Card */}
          <g transform="translate(1080, 420)">
            <rect x={-460} y={-220} width={920} height={440} rx={22} fill="#0F172A" stroke="#38BDF8" strokeWidth={5} />
            <text x={0} y={-160} textAnchor="middle" fill="#38BDF8" fontSize={28} fontWeight="900">
              DOMESTICATION RULE #1: MANAGEABILITY
            </text>

            <g transform="translate(-220, 20)">
              <rect x={-180} y={-100} width={360} height={220} rx={14} fill="#065F46" />
              <text x={0} y={-60} textAnchor="middle" fill="#A7F3D0" fontSize={24} fontWeight="900">COWS & GOATS</text>
              <text x={0} y={-15} textAnchor="middle" fill="#FFFFFF" fontSize={18}>Placid, obedient temperament</text>
              <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={18}>Follows human handlers</text>
              <text x={0} y={75} textAnchor="middle" fill="#FDE047" fontSize={22} fontWeight="900">GRADE: A+</text>
            </g>

            <g transform="translate(220, 20)">
              <rect x={-180} y={-100} width={360} height={220} rx={14} fill="#881337" />
              <text x={0} y={-60} textAnchor="middle" fill="#FECDD3" fontSize={24} fontWeight="900">WILD SOWS</text>
              <text x={0} y={-15} textAnchor="middle" fill="#FFFFFF" fontSize={18}>Ferocious protective instinct</text>
              <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={18}>Prone to biting & trampling</text>
              <text x={0} y={75} textAnchor="middle" fill="#FCA5A5" fontSize={22} fontWeight="900">GRADE: DANGEROUS</text>
            </g>
          </g>

          <DoodleStickman
            x={340}
            y={520}
            scale={1.3}
            shirtColor="#38BDF8"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7 (669..780, dur 111f): "...reproduce reliably, live in groups..." */}
      {/* ================================================================ */}
      <Sequence from={669} durationInFrames={111}>
        <FarmPastureEnv showBarn={false} showFence={true}>
          <SfxTrigger sound="paper_slide" volume={0.6} startFrame={5} />

          <StoryBadge text="DOMESTICATION RULE #2: HERD STRUCTURE" x={960} y={110} bgColor="#0F172A" textColor="#34D399" fontSize={32} />

          {/* Herd of sheep & cows grazing harmoniously */}
          <DoodleSheep x={480} y={560} scale={1.1} />
          <DoodleSheep x={700} y={580} scale={0.95} />
          <DoodleCow x={1280} y={550} scale={1.15} mood="calm" />

          {/* Shepherd Stickman */}
          <DoodleStickman
            x={960}
            y={510}
            scale={1.3}
            shirtColor="#CA8A04"
            expression="smile"
            pose="idle"
            pupilDirection="center"
          />

          <StoryBadge text="HERD INSTINCT ALLOWS 1 HUMAN TO CONTROL 50+ ANIMALS" x={960} y={880} bgColor="#064E3B" textColor="#FFFFFF" fontSize={24} />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8 (780..890, dur 110f): "...eat cheap food, and give you something useful..." */}
      {/* ================================================================ */}
      <Sequence from={780} durationInFrames={110}>
        <FarmPastureEnv showBarn={true} showFence={true}>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Cow converting free pasture grass into milk */}
          <DoodleCow x={700} y={550} scale={1.25} mood="happy" squirtMilk={true} />
          <MilkCanister x={1080} y={640} scale={1.2} isOverflowing={true} />

          {/* Nutrition conversion callout */}
          <g transform="translate(1420, 360)">
            <rect x={-220} y={-140} width={440} height={280} rx={20} fill="#0F172A" stroke="#84CC16" strokeWidth={5} />
            <text x={0} y={-90} textAnchor="middle" fill="#A3E635" fontSize={24} fontWeight="900">
              BIOLOGICAL CONVERTER
            </text>
            <text x={0} y={-45} textAnchor="middle" fill="#FFFFFF" fontSize={18}>
              INPUT: Wild Grass (0 human value)
            </text>
            <text x={0} y={-10} textAnchor="middle" fill="#60A5FA" fontSize={28}>⬇</text>
            <text x={0} y={35} textAnchor="middle" fill="#FDE047" fontSize={22} fontWeight="900">
              OUTPUT: 40L Nutritious Milk!
            </text>
            <text x={0} y={80} textAnchor="middle" fill="#34D399" fontSize={16} fontWeight="bold">
              Pure caloric multiplier
            </text>
          </g>

          <DoodleStickman
            x={260}
            y={520}
            scale={1.25}
            shirtColor="#84CC16"
            expression="grin"
            pose="waving"
            pupilDirection="center"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9 (890..1000, dur 110f): "...without constantly trying to kill you." */}
      {/* ================================================================ */}
      <Sequence from={890} durationInFrames={110}>
        <BarnInteriorEnv>
          <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />

          {/* Enraged Sow charging */}
          <DoodlePig x={1260} y={640} scale={1.35} pose="standing" mood="irritated" />

          {/* Angry Tusk Warning */}
          <g transform="translate(1080, 520)">
            <polygon points="0,-40 40,20 -40,20" fill="#EF4444" />
            <text x={0} y={70} textAnchor="middle" fill="#EF4444" fontSize={26} fontWeight="900">
              MORTAL DANGER!
            </text>
          </g>

          {/* Stickman Panicking running away */}
          <DoodleStickman
            x={420}
            y={520}
            scale={1.3}
            shirtColor="#EF4444"
            expression="shocked"
            pose="panicking"
            pupilDirection="left"
          />

          <StoryBadge text="RULE #5: WON'T CONSTANTLY TRY TO MAUL YOU" x={960} y={110} bgColor="#991B1B" textColor="#FFFFFF" fontSize={32} />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10 (1000..1115, dur 115f): "Cows score high, goats score high..." */}
      {/* ================================================================ */}
      <Sequence from={1000} durationInFrames={115}>
        <FarmPastureEnv showBarn={false} showFence={false}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          {/* Domestication Tournament Scorecard: Row 1 & 2 Active */}
          <PopIn startFrame={5} scale={1.0}>
            <DomesticationTournamentCard x={960} y={540} scale={0.92} activeRow={1} />
          </PopIn>

          <DoodleStickman
            x={180}
            y={540}
            scale={1.2}
            shirtColor="#059669"
            expression="grin"
            pose="pointing_board"
            pupilDirection="center"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11 (1115..1230, dur 115f): "...sheep score high." */}
      {/* ================================================================ */}
      <Sequence from={1115} durationInFrames={115}>
        <FarmPastureEnv showBarn={false} showFence={false}>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Domestication Tournament Scorecard: Row 3 & 4 Active */}
          <DomesticationTournamentCard x={960} y={540} scale={0.92} activeRow={3} />

          <DoodleStickman
            x={180}
            y={540}
            scale={1.2}
            shirtColor="#38BDF8"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 12 (1230..1360, dur 130f): "Pigs are fantastic for meat, and terrible candidates for dairy." */}
      {/* ================================================================ */}
      <Sequence from={1230} durationInFrames={130}>
        <FarmPastureEnv showBarn={false} showFence={false}>
          <SfxTrigger sound="camera_shutter" volume={0.6} startFrame={15} />

          {/* Domestication Tournament Scorecard: PIG FAILURE ROW 5 */}
          <ZoomIn startFrame={0} durationInFrames={30} fromScale={0.92} toScale={1.05} originX={960} originY={620} withWhoosh={false}>
            <DomesticationTournamentCard x={960} y={540} scale={0.92} activeRow={5} />
          </ZoomIn>

          <DoodleStickman
            x={160}
            y={540}
            scale={1.25}
            shirtColor="#DC2626"
            expression="shocked"
            pose="pointing_board"
            pupilDirection="center"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13 (1360..1480, dur 120f): "It's a reminder that the animals humans domesticated..." */}
      {/* ================================================================ */}
      <Sequence from={1360} durationInFrames={120}>
        <BarnInteriorEnv>
          <SfxTrigger sound="paper_slide" volume={0.6} startFrame={5} />

          <StoryBadge text="A KEY HISTORICAL LESSON" x={960} y={110} bgColor="#0F172A" textColor="#FDE047" fontSize={34} />

          {/* Ancient Historian Stickman with ancient scroll */}
          <DoodleStickman
            x={960}
            y={520}
            scale={1.4}
            shirtColor="#FFFFFF"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />

          <StoryBadge text="DOMESTICATION WAS NEVER ABOUT FINDING THE 'RICHEST' MILK" x={960} y={880} bgColor="#78350F" textColor="#FFFFFF" fontSize={24} />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 14 (1480..1602, dur 122f): "...weren't necessarily the ones with the best milk." */}
      {/* ================================================================ */}
      <Sequence from={1480} durationInFrames={122}>
        <ChemistryLabEnv wallColor="#0F172A" benchColor="#1E293B" showBlackboard={false}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          {/* Humorous Whale & Seal Milk Card */}
          <g transform="translate(1080, 420)">
            <rect x={-450} y={-220} width={900} height={440} rx={22} fill="#0F172A" stroke="#38BDF8" strokeWidth={5} />
            <text x={0} y={-160} textAnchor="middle" fill="#38BDF8" fontSize={28} fontWeight="900">
              HYPER-RICH MILKS HUMANS NEVER DRINK
            </text>

            <g transform="translate(-220, 20)">
              <rect x={-180} y={-100} width={360} height={220} rx={14} fill="#1E293B" />
              <text x={0} y={-60} textAnchor="middle" fontSize={36}>🐋</text>
              <text x={0} y={-15} textAnchor="middle" fill="#FFFFFF" fontSize={22} fontWeight="900">BLUE WHALE</text>
              <text x={0} y={20} textAnchor="middle" fill="#FDE047" fontSize={32} fontWeight="900">50% BUTTERFAT</text>
              <text x={0} y={65} textAnchor="middle" fill="#94A3B8" fontSize={16}>Impossible to milk safely</text>
            </g>

            <g transform="translate(220, 20)">
              <rect x={-180} y={-100} width={360} height={220} rx={14} fill="#1E293B" />
              <text x={0} y={-60} textAnchor="middle" fontSize={36}>🦭</text>
              <text x={0} y={-15} textAnchor="middle" fill="#FFFFFF" fontSize={22} fontWeight="900">HOODED SEAL</text>
              <text x={0} y={20} textAnchor="middle" fill="#FDE047" fontSize={32} fontWeight="900">60% BUTTERFAT</text>
              <text x={0} y={65} textAnchor="middle" fill="#94A3B8" fontSize={16}>Pure liquid mayonnaise!</text>
            </g>
          </g>

          <DoodleStickman
            x={340}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="shocked"
            pose="holding_magnifier"
            pupilDirection="center"
          />
        </ChemistryLabEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 15 (1602..1726, dur 124f): "They were the ones with the best combination of biology and behavior." */}
      {/* ================================================================ */}
      <Sequence from={1602} durationInFrames={124}>
        <FarmPastureEnv showBarn={false} showFence={false}>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Venn Diagram of Domestication */}
          <g transform="translate(960, 480)">
            {/* Left Circle: Biology */}
            <circle cx={-130} cy={0} r={220} fill="rgba(56, 189, 248, 0.4)" stroke="#0284C7" strokeWidth={5} />
            <text x={-220} y={-50} textAnchor="middle" fill="#0C4A6E" fontSize={28} fontWeight="900">BIOLOGY</text>
            <text x={-220} y={-10} textAnchor="middle" fill="#0F172A" fontSize={18} fontWeight="bold">• 4 accessible teats</text>
            <text x={-220} y={20} textAnchor="middle" fill="#0F172A" fontSize={18} fontWeight="bold">• Storage cistern</text>
            <text x={-220} y={50} textAnchor="middle" fill="#0F172A" fontSize={18} fontWeight="bold">• Continuous flow</text>

            {/* Right Circle: Behavior */}
            <circle cx={130} cy={0} r={220} fill="rgba(74, 222, 128, 0.4)" stroke="#16A34A" strokeWidth={5} />
            <text x={220} y={-50} textAnchor="middle" fill="#14532D" fontSize={28} fontWeight="900">BEHAVIOR</text>
            <text x={220} y={-10} textAnchor="middle" fill="#0F172A" fontSize={18} fontWeight="bold">• Docile & calm</text>
            <text x={220} y={20} textAnchor="middle" fill="#0F172A" fontSize={18} fontWeight="bold">• Herd instincts</text>
            <text x={220} y={50} textAnchor="middle" fill="#0F172A" fontSize={18} fontWeight="bold">• Human tolerance</text>

            {/* Overlap: The Winners */}
            <g transform="translate(0, -10)">
              <rect x={-90} y={-50} width={180} height={100} rx={12} fill="#0F172A" stroke="#FDE047" strokeWidth={3} />
              <text x={0} y={-15} textAnchor="middle" fill="#FDE047" fontSize={20} fontWeight="900">SWEET SPOT</text>
              <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={16} fontWeight="bold">COWS & GOATS</text>
              <text x={0} y={38} textAnchor="middle" fill="#34D399" fontSize={14}>WINNERS</text>
            </g>
          </g>

          <DoodleStickman
            x={220}
            y={520}
            scale={1.2}
            shirtColor="#FFFFFF"
            expression="grin"
            pose="pointing_board"
            pupilDirection="center"
          />

          <StoryBadge text="THE DOMESTICATION SWEET SPOT" x={960} y={110} bgColor="#0F172A" textColor="#FFFFFF" fontSize={32} />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 16 (1726..1850, dur 124f): "A pig can make milk, but making milk isn't enough." */}
      {/* ================================================================ */}
      <Sequence from={1726} durationInFrames={124}>
        <BarnInteriorEnv>
          <SfxTrigger sound="paper_slide" volume={0.6} startFrame={5} />

          {/* Sow with piglets */}
          <DoodlePig x={750} y={640} scale={1.2} pose="nursing_lying" mood="calm" />
          <DoodlePiglet x={620} y={660} scale={0.65} />
          <DoodlePiglet x={720} y={660} scale={0.65} />
          <DoodlePiglet x={820} y={660} scale={0.65} />

          <StoryBadge text="MAKING MILK IS ONLY HALF THE EQUATION" x={960} y={110} bgColor="#B45309" textColor="#FEF08A" fontSize={32} />

          <DoodleStickman
            x={1340}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="curious"
            pose="idle"
            pupilDirection="left"
          />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 17 (1850..1965, dur 115f): "The animal has to make it accessible..." */}
      {/* ================================================================ */}
      <Sequence from={1850} durationInFrames={115}>
        <FarmPastureEnv showBarn={false} showFence={true}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          {/* Accessible Cow Udder Graphic */}
          <DoodleCow x={960} y={540} scale={1.35} mood="proud" squirtMilk={true} />
          <MilkingBucket x={1010} y={660} scale={1.3} fillLevel={0.95} />

          <StoryBadge text="MAXIMUM HUMAN ACCESSIBILITY: 4 LARGE TEATS" x={960} y={110} bgColor="#0284C7" textColor="#FFFFFF" fontSize={32} />

          <DoodleStickman
            x={420}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="smile"
            pose="pointing_board"
            pupilDirection="center"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 18 (1965..2077, dur 112f): "...and that's exactly where pigs fail." */}
      {/* ================================================================ */}
      <Sequence from={1965} durationInFrames={112}>
        <BarnInteriorEnv>
          <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />

          {/* Pig with Red Stamp Failure */}
          <DoodlePig x={960} y={600} scale={1.3} pose="standing" mood="irritated" />

          {/* Big Red Stamp: ZERO ACCESSIBILITY */}
          <g transform="translate(960, 360) rotate(-6)">
            <rect x={-320} y={-50} width={640} height={100} rx={16} fill="#DC2626" stroke="#FFFFFF" strokeWidth={6} />
            <text x={0} y={16} textAnchor="middle" fill="#FFFFFF" fontSize={42} fontWeight="900" letterSpacing="2px">
              ACCESSIBILITY FAILURE
            </text>
          </g>

          <DoodleStickman
            x={340}
            y={520}
            scale={1.3}
            shirtColor="#DC2626"
            expression="shocked"
            pose="pointing_board"
            pupilDirection="center"
          />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 19 (2077..2180, dur 103f): "Culture reinforced all of this." */}
      {/* ================================================================ */}
      <Sequence from={2077} durationInFrames={103}>
        <WorldMapEnv>
          <SfxTrigger sound="whoosh_air" volume={0.6} startFrame={0} />

          <StoryBadge text="CULTURAL LOCK-IN & PATH DEPENDENCY" x={960} y={160} bgColor="#1E293B" textColor="#38BDF8" fontSize={34} />

          {/* Explorer Stickman with safari hat */}
          <DoodleStickman
            x={480}
            y={540}
            scale={1.35}
            shirtColor="#FFFFFF"
            hat="safari"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />

          <StoryBadge text="TRADITIONS EXPANDED ACROSS CIVILIZATIONS" x={960} y={880} bgColor="#0F172A" textColor="#FDE047" fontSize={26} />
        </WorldMapEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 20 (2180..2280, dur 100f): "Once a region built its identity around one animal..." */}
      {/* ================================================================ */}
      <Sequence from={2180} durationInFrames={100}>
        <WorldMapEnv>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Zooming into regional hubs */}
          <ZoomIn startFrame={0} durationInFrames={30} fromScale={1.0} toScale={1.15} originX={1100} originY={350} withWhoosh={false}>
            {/* Europe Pin */}
            <g transform="translate(940, 260)">
              <circle cx={0} cy={0} r={28} fill="#EF4444" stroke="#FFFFFF" strokeWidth={4} />
              <text x={0} y={8} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontWeight="900">1</text>
              <StoryBadge text="EUROPE: CATTLE" x={0} y={55} bgColor="#0284C7" textColor="#FFFFFF" fontSize={18} />
            </g>

            {/* Med Pin */}
            <g transform="translate(970, 350)">
              <circle cx={0} cy={0} r={28} fill="#EF4444" stroke="#FFFFFF" strokeWidth={4} />
              <text x={0} y={8} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontWeight="900">2</text>
              <StoryBadge text="MEDITERRANEAN: GOAT & SHEEP" x={0} y={55} bgColor="#059669" textColor="#FFFFFF" fontSize={18} />
            </g>

            {/* Asia Pin */}
            <g transform="translate(1250, 360)">
              <circle cx={0} cy={0} r={28} fill="#EF4444" stroke="#FFFFFF" strokeWidth={4} />
              <text x={0} y={8} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontWeight="900">3</text>
              <StoryBadge text="AFRICA & ASIA: CAMEL & YAK" x={0} y={55} bgColor="#D97706" textColor="#FFFFFF" fontSize={18} />
            </g>
          </ZoomIn>

          <DoodleStickman
            x={320}
            y={620}
            scale={1.2}
            shirtColor="#FFFFFF"
            hat="safari"
            expression="smile"
            pose="idle"
            pupilDirection="center"
          />
        </WorldMapEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 21 (2280..2367, dur 87f): "...cattle in Europe, goats, and sheep around the Mediterranean..." */}
      {/* ================================================================ */}
      <Sequence from={2280} durationInFrames={87}>
        <WorldMapEnv>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          {/* Regional Products Callout */}
          <g transform="translate(940, 240)">
            <rect x={-180} y={-60} width={360} height={120} rx={16} fill="#0284C7" stroke="#FFFFFF" strokeWidth={3} />
            <text x={0} y={-15} textAnchor="middle" fill="#FFFFFF" fontSize={22} fontWeight="900">🐮 EUROPEAN CATTLE</text>
            <text x={0} y={25} textAnchor="middle" fill="#FEF08A" fontSize={16} fontWeight="bold">Gouda, Cheddar, Alpine Cheeses</text>
          </g>

          <g transform="translate(1420, 380)">
            <rect x={-180} y={-60} width={360} height={120} rx={16} fill="#059669" stroke="#FFFFFF" strokeWidth={3} />
            <text x={0} y={-15} textAnchor="middle" fill="#FFFFFF" fontSize={22} fontWeight="900">🐐 MEDITERRANEAN</text>
            <text x={0} y={25} textAnchor="middle" fill="#FEF08A" fontSize={16} fontWeight="bold">Feta, Halloumi, Pecorino Romano</text>
          </g>

          <DoodleStickman
            x={380}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            hat="safari"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />
        </WorldMapEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 22 (2367..2480, dur 113f): "...cattle and camels across parts of Africa and Asia, that tradition stuck." */}
      {/* ================================================================ */}
      <Sequence from={2367} durationInFrames={113}>
        <WorldMapEnv>
          <SfxTrigger sound="camera_shutter" volume={0.6} startFrame={5} />

          <g transform="translate(1080, 520)">
            <rect x={-220} y={-80} width={440} height={160} rx={18} fill="#D97706" stroke="#FFFFFF" strokeWidth={4} />
            <text x={0} y={-30} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="900">🐫 ARABIA & AFRICA</text>
            <text x={0} y={10} textAnchor="middle" fill="#FEF08A" fontSize={18} fontWeight="bold">Camel Milk & Fermented Chal</text>
            <text x={0} y={45} textAnchor="middle" fill="#FFFFFF" fontSize={15}>Vital hydration in arid deserts</text>
          </g>

          <StoryBadge text="CENTURIES OF GENERATIONAL LOCK-IN" x={960} y={160} bgColor="#1E293B" textColor="#38BDF8" fontSize={32} />

          <DoodleStickman
            x={420}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            hat="safari"
            expression="grin"
            pose="idle"
            pupilDirection="center"
          />
        </WorldMapEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 23 (2480..2600, dur 120f): "Communities didn't need every possible milk source." */}
      {/* ================================================================ */}
      <Sequence from={2480} durationInFrames={120}>
        <BarnInteriorEnv>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          <StoryBadge text="SATISFACTION: ZERO NEED FOR NOVELTY" x={960} y={110} bgColor="#78350F" textColor="#FEF08A" fontSize={32} />

          {/* Abundance of cheese & butter on shelf */}
          <g transform="translate(1080, 540)">
            <CheeseWheel x={-150} y={0} scale={1.2} />
            <ButterBlock x={150} y={0} scale={1.1} />
            <MilkBottle x={0} y={-80} scale={1.0} label="MILK" />
          </g>

          <DoodleStickman
            x={380}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="smile"
            pose="idle"
            pupilDirection="center"
          />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 24 (2600..2711, dur 111f): "They needed a reliable one." */}
      {/* ================================================================ */}
      <Sequence from={2600} durationInFrames={111}>
        <FarmPastureEnv showBarn={true} showFence={true}>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Dependable Cow grazing */}
          <DoodleCow x={1180} y={540} scale={1.3} mood="proud" squirtMilk={true} />
          <MilkingBucket x={1020} y={670} scale={1.25} fillLevel={0.95} />

          <StoryBadge text="THE SUPREME VIRTUE: RELIABILITY" x={960} y={120} bgColor="#0F172A" textColor="#34D399" fontSize={34} />

          <DoodleStickman
            x={520}
            y={520}
            scale={1.35}
            shirtColor="#FFFFFF"
            expression="grin"
            pose="waving"
            pupilDirection="center"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 25 (2711..2842, dur 131f): "And once they had it, there was little reason to experiment with something harder." */}
      {/* ================================================================ */}
      <Sequence from={2711} durationInFrames={131}>
        <FarmPastureEnv showBarn={true} showFence={true}>
          <SfxTrigger sound="camera_shutter" volume={0.6} startFrame={20} />

          {/* Grand Finale Toast: Stickman enjoying cow milk */}
          <DoodleStickman
            x={760}
            y={500}
            scale={1.45}
            shirtColor="#FFFFFF"
            expression="smile"
            pose="sipping_drink"
            pupilDirection="center"
          />

          <DoodleCow x={1350} y={540} scale={1.2} mood="proud" />

          {/* Grand Conclusion Badge */}
          <PopIn startFrame={10} scale={1.1}>
            <StoryBadge text="CASE CLOSED: COWS FOR MILK, PIGS FOR PORK." x={960} y={120} bgColor="#0F172A" textColor="#FDE047" fontSize={36} />
          </PopIn>

          <StoryBadge text="EVOLUTION & HISTORY WORKING PERFECTLY" x={960} y={880} bgColor="#059669" textColor="#FFFFFF" fontSize={26} />
        </FarmPastureEnv>
      </Sequence>
    </div>
  );
};
