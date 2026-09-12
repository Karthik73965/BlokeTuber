import React from 'react';
import {
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {
  BarnInteriorEnv,
  CafeCounterEnv,
  CameraShutterEffect,
  ComparisonSplitEnv,
  DailyMilkingRoutine,
  DoodleCow,
  DoodlePig,
  DoodlePiglet,
  DoodleStickman,
  FarmPastureEnv,
  FeedingTrough,
  MilkCanister,
  MilkingBucket,
  PopIn,
  ScorecardBoard,
  SfxTrigger,
  SlideIn,
  StoryBadge,
  TinyMilkBottle,
  ZoomIn,
} from '../shared/PigMilkElements';

/**
 * 🐮 CHAPTER 4: WHY COWS WON THE JOB (2012 frames @ 30fps)
 * Audio: audio/pig_milk/4_cows_won.mp3
 * Pacing strictly <= 135 frames (< 4.5s) per Sequence beat
 */
export const Chapter4_CowsWon: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      {/* Continuous Voiceover Audio */}
      <Audio src={staticFile('audio/pig_milk/4_cows_won.mp3')} volume={1.0} />

      {/* BEAT 1: 0 - 89 (89 frames) "Cows are basically built for dairy work." */}
      <Sequence from={0} durationInFrames={89}>
        <Beat1_DairyChampion />
      </Sequence>

      {/* BEAT 2: 89 - 205 (116 frames) "They're large, calm, they thrive on grass and other cheap, fibrous plants," */}
      <Sequence from={89} durationInFrames={116}>
        <Beat2_GrassSuperpower />
      </Sequence>

      {/* BEAT 3: 205 - 310 (105 frames) "and they can be handled in groups." */}
      <Sequence from={205} durationInFrames={105}>
        <Beat3_CalmHerd />
      </Sequence>

      {/* BEAT 4: 310 - 416 (106 frames) "Their udders are accessible. They produce huge volumes," */}
      <Sequence from={310} durationInFrames={106}>
        <Beat4_AccessibleUdders />
      </Sequence>

      {/* BEAT 5A: 416 - 490 (74 frames) "and, most importantly, you don't have to kill a cow to get milk." */}
      <Sequence from={416} durationInFrames={74}>
        <Beat5A_NoSlaughter />
      </Sequence>

      {/* BEAT 5B: 490 - 571 (81 frames) "You can milk her every day for months," */}
      <Sequence from={490} durationInFrames={81}>
        <Beat5B_ContinuousDailyHarvest />
      </Sequence>

      {/* BEAT 6: 571 - 703 (132 frames) "then she has another calf," (Matches snap_180s.jpg 4-panel) */}
      <Sequence from={571} durationInFrames={132}>
        <Beat6_DailyMilkingRoutineCycle />
      </Sequence>

      {/* BEAT 7A: 703 - 775 (72 frames) "and the same animal keeps producing." */}
      <Sequence from={703} durationInFrames={72}>
        <Beat7A_EndlessConveyor />
      </Sequence>

      {/* BEAT 7B: 775 - 873 (98 frames) "That's an extraordinary deal." */}
      <Sequence from={775} durationInFrames={98}>
        <Beat7B_ExtraordinaryDeal />
      </Sequence>

      {/* BEAT 8: 873 - 993 (120 frames) "Now try that with pigs. They're intelligent," */}
      <Sequence from={873} durationInFrames={120}>
        <Beat8_PigIntelligence />
      </Sequence>

      {/* BEAT 9A: 993 - 1065 (72 frames) "strong, fast, and not remotely interested" */}
      <Sequence from={993} durationInFrames={72}>
        <Beat9A_StrongFastPig />
      </Sequence>

      {/* BEAT 9B: 1065 - 1136 (71 frames) "in cooperating with your morning routine." */}
      <Sequence from={1065} durationInFrames={71}>
        <Beat9B_MorningRoutineChaos />
      </Sequence>

      {/* BEAT 10: 1136 - 1250 (114 frames) "A stressed sow with a litter can be dangerous," */}
      <Sequence from={1136} durationInFrames={114}>
        <Beat10_DangerousMotherSow />
      </Sequence>

      {/* BEAT 11A: 1250 - 1350 (100 frames) "and even if you pulled it off," */}
      <Sequence from={1250} durationInFrames={100}>
        <Beat11A_ExhaustedFarmer />
      </Sequence>

      {/* BEAT 11B: 1350 - 1424 (74 frames) "you'd still end up with a fraction of what a dairy cow gives you." */}
      <Sequence from={1350} durationInFrames={74}>
        <Beat11B_FractionComparison />
      </Sequence>

      {/* BEAT 12: 1424 - 1550 (126 frames) "So the farmer asks the obvious question," */}
      <Sequence from={1424} durationInFrames={126}>
        <Beat12_FarmerDilemma />
      </Sequence>

      {/* BEAT 13A: 1550 - 1615 (65 frames) "why bother?" */}
      <Sequence from={1550} durationInFrames={65}>
        <Beat13A_WhyBotherPunch />
      </Sequence>

      {/* BEAT 13B: 1615 - 1703 (88 frames) "Humans are extremely good at answering that question." */}
      <Sequence from={1615} durationInFrames={88}>
        <Beat13B_EconomistPresenter />
      </Sequence>

      {/* BEAT 14: 1703 - 1818 (115 frames) "We don't just ask, can we eat this? We ask," */}
      <Sequence from={1703} durationInFrames={115}>
        <Beat14_SplitQuestion />
      </Sequence>

      {/* BEAT 15: 1818 - 1945 (127 frames) "can we produce this cheaply at scale?" */}
      <Sequence from={1818} durationInFrames={127}>
        <Beat15_ScaleScorecard />
      </Sequence>

      {/* BEAT 16: 1945 - 2012 (67 frames) "That's where pigs lose." */}
      <Sequence from={1945} durationInFrames={67}>
        <Beat16_CowsWinFinale />
      </Sequence>
    </div>
  );
};

/* =========================================================================
 * CHAPTER 4 BEAT IMPLEMENTATIONS (All strictly <= 135 frames, 100% full-bleed)
 * ========================================================================= */

/**
 * Beat 1: Cow is built for dairy work - Champion podium
 */
const Beat1_DairyChampion: React.FC = () => {
  return (
    <FarmPastureEnv>
      <ZoomIn startFrame={0} durationInFrames={35} fromScale={1.0} toScale={1.05} withWhoosh={false}>
        {/* Winner's Podium */}
        <g transform="translate(960, 720)">
          <rect x={-200} y={-30} width={400} height={100} rx={12} fill="#E2E8F0" stroke="#18181B" strokeWidth={5} />
          <text x={0} y={35} textAnchor="middle" fill="#0F172A" fontSize={38} fontWeight="900" fontFamily="sans-serif">
            🥇 #1 DAIRY MACHINE
          </text>
        </g>

        {/* Majestic Dairy Cow with Golden Medal */}
        <g transform="translate(960, 560)">
          <DoodleCow x={0} y={0} scale={1.1} mood="proud" squirtMilk={true} />
          {/* Gold Medal around neck */}
          <circle cx={-120} cy={60} r={24} fill="#FDE047" stroke="#CA8A04" strokeWidth={4} />
          <text x={-120} y={69} textAnchor="middle" fill="#78350F" fontSize={22} fontWeight="bold">
            ★
          </text>
        </g>

        {/* Stickman Host introducing cow */}
        <DoodleStickman
          x={420}
          y={660}
          scale={0.95}
          expression="smile"
          pose="waving"
          shirtColor="#0284C7"
          pupilDirection="up_right"
        />

        <PopIn centerX={960} centerY={160} startFrame={10}>
          <StoryBadge text="BUILT FOR DAIRY WORK 🥛" x={960} y={160} fontSize={30} bgColor="#0284C7" />
        </PopIn>
      </ZoomIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 2: Ruminant superpower - Thriving on cheap grass & cellulose
 */
const Beat2_GrassSuperpower: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <FarmPastureEnv groundColor="#4ADE80" skyColor="#7DD3FC">
      <SlideIn direction="left" distance={250} startFrame={0} withSfx={true}>
        {/* Calm Cow chewing grass */}
        <DoodleCow x={680} y={660} scale={1.05} mood="calm" />

        {/* Cellulose to Milk Magic Conversion Card */}
        <g transform="translate(1320, 420)">
          <rect x={-260} y={-140} width={520} height={280} rx={18} fill="#0F172A" stroke="#22C55E" strokeWidth={6} />
          <text x={0} y={-85} textAnchor="middle" fill="#4ADE80" fontSize={26} fontWeight="900" fontFamily="sans-serif">
            🌱 THE RUMINANT ENGINE
          </text>
          <line x1={-220} y1={-65} x2={220} y2={-65} stroke="#334155" strokeWidth={2} />
          <text x={0} y={-20} textAnchor="middle" fill="#FEF08A" fontSize={22} fontWeight="bold" fontFamily="sans-serif">
            Free Pasture Grass / Cellulose
          </text>
          <text x={0} y={20} textAnchor="middle" fill="#FFFFFF" fontSize={32} fontWeight="bold">
            ⬇️ (4 Stomachs)
          </text>
          <text x={0} y={70} textAnchor="middle" fill="#38BDF8" fontSize={26} fontWeight="900" fontFamily="sans-serif">
            40L Creamy Fresh Milk!
          </text>
          <text x={0} y={105} textAnchor="middle" fill="#86EFAC" fontSize={18} fontWeight="bold">
            FEED COST: $0.00 (Zero Human Competition!)
          </text>
        </g>

        {/* Stickman observing with magnifier */}
        <DoodleStickman
          x={1320}
          y={730}
          scale={0.88}
          expression="curious"
          pose="holding_magnifier"
          shirtColor="#10B981"
          pupilDirection="left"
        />

        {/* Grass bundle on ground */}
        <g transform="translate(420, 810)">
          {Array.from({ length: 9 }).map((_, i) => (
            <line
              key={i}
              x1={i * 8}
              y1={0}
              x2={i * 8 + Math.sin((frame + i) * 0.2) * 5}
              y2={-35}
              stroke="#15803D"
              strokeWidth={5}
              strokeLinecap="round"
            />
          ))}
        </g>
      </SlideIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 3: Calm docile herd handled in groups
 */
const Beat3_CalmHerd: React.FC = () => {
  return (
    <FarmPastureEnv>
      <SlideIn direction="right" distance={300} startFrame={0} withSfx={true}>
        {/* A calm herd of 3 cows walking peacefully */}
        <g transform="translate(0, 40)">
          <DoodleCow x={450} y={670} scale={0.75} mood="calm" />
          <DoodleCow x={800} y={690} scale={0.82} mood="calm" />
          <DoodleCow x={1180} y={660} scale={0.78} mood="calm" />
        </g>

        {/* Stickman shepherd casually guiding them with straw hat */}
        <DoodleStickman
          x={1620}
          y={660}
          scale={0.95}
          expression="smile"
          pose="waving"
          shirtColor="#F59E0B"
          hat="safari"
          pupilDirection="left"
        />

        <PopIn centerX={960} centerY={180} startFrame={10}>
          <StoryBadge text="HERD DYNAMICS: DOCILE &amp; COOPERATIVE 🌿" x={960} y={180} fontSize={28} bgColor="#0284C7" />
        </PopIn>
      </SlideIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 4: Accessible udders & high volume production
 */
const Beat4_AccessibleUdders: React.FC = () => {
  return (
    <FarmPastureEnv>
      <CameraShutterEffect triggerFrame={10} flashDurationFrames={6} />
      <ZoomIn startFrame={0} durationInFrames={30} fromScale={1.0} toScale={1.05} withWhoosh={false}>
        {/* Cow being milked */}
        <DoodleCow x={700} y={660} scale={1.1} mood="proud" squirtMilk={true} />

        {/* Stainless steel milking pail catching milk */}
        <MilkingBucket x={820} y={750} scale={1.2} fillLevel={0.9} />

        {/* Row of full canisters */}
        <MilkCanister x={1160} y={680} scale={0.85} isOverflowing={true} />
        <MilkCanister x={1290} y={680} scale={0.85} isOverflowing={true} />

        {/* Stickman dairy farmer giving thumbs up */}
        <DoodleStickman
          x={1620}
          y={660}
          scale={0.95}
          expression="grin"
          pose="waving"
          shirtColor="#38BDF8"
          pupilDirection="left"
        />

        <PopIn centerX={960} centerY={180} startFrame={12}>
          <StoryBadge text="4 ACCESSIBLE TEATS • ENORMOUS VOLUME 🥛" x={960} y={180} fontSize={28} bgColor="#16A34A" />
        </PopIn>
      </ZoomIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 5A: No slaughter required! Renewable harvest
 */
const Beat5A_NoSlaughter: React.FC = () => {
  return (
    <FarmPastureEnv skyColor="#FEF08A" groundColor="#86EFAC">
      <CameraShutterEffect triggerFrame={8} flashDurationFrames={6} />
      {/* Happy Cow */}
      <DoodleCow x={650} y={670} scale={1.05} mood="happy" />

      {/* Big Crossed-out Butcher Cleaver Card */}
      <g transform="translate(1320, 440)">
        <rect x={-240} y={-130} width={480} height={260} rx={18} fill="#0F172A" stroke="#EF4444" strokeWidth={6} />
        {/* Butcher Cleaver */}
        <g transform="translate(0, -30)">
          <rect x={-45} y={-35} width={90} height={60} rx={6} fill="#94A3B8" stroke="#18181B" strokeWidth={4} />
          <line x1={45} y1={-5} x2={85} y2={-5} stroke="#78350F" strokeWidth={12} strokeLinecap="round" />
          {/* Big Red X across cleaver */}
          <line x1={-60} y1={-50} x2={60} y2={30} stroke="#EF4444" strokeWidth={10} strokeLinecap="round" />
          <line x1={60} y1={-50} x2={-60} y2={30} stroke="#EF4444" strokeWidth={10} strokeLinecap="round" />
        </g>
        <text x={0} y={55} textAnchor="middle" fill="#FFFFFF" fontSize={26} fontWeight="900" fontFamily="sans-serif">
          ZERO SLAUGHTER NEEDED!
        </text>
        <text x={0} y={90} textAnchor="middle" fill="#86EFAC" fontSize={20} fontWeight="bold">
          The animal lives &amp; thrives daily
        </text>
      </g>

      {/* Stickman farmer with relief */}
      <DoodleStickman
        x={1400}
        y={740}
        scale={0.88}
        expression="smile"
        pose="waving"
        shirtColor="#22C55E"
      />
    </FarmPastureEnv>
  );
};

/**
 * Beat 5B: Continuous daily harvest for months
 */
const Beat5B_ContinuousDailyHarvest: React.FC = () => {
  return (
    <FarmPastureEnv>
      <SlideIn direction="bottom" distance={250} startFrame={0} withSfx={true}>
        {/* Cow */}
        <DoodleCow x={700} y={670} scale={1.05} mood="proud" squirtMilk={true} />

        {/* 300-Day Calendar Trophy Card */}
        <g transform="translate(1360, 450)">
          <rect x={-240} y={-140} width={480} height={280} rx={18} fill="#0F172A" stroke="#FDE047" strokeWidth={6} />
          <text x={0} y={-80} textAnchor="middle" fill="#FDE047" fontSize={26} fontWeight="900" fontFamily="sans-serif">
            📅 CONTINUOUS CYCLE
          </text>
          <line x1={-200} y1={-60} x2={200} y2={-60} stroke="#334155" strokeWidth={2} />
          <text x={0} y={-5} textAnchor="middle" fill="#FFFFFF" fontSize={38} fontWeight="900" fontFamily="sans-serif">
            305 DAYS / YEAR
          </text>
          <text x={0} y={40} textAnchor="middle" fill="#38BDF8" fontSize={22} fontWeight="bold">
            Daily Fresh Supply of Liquid Calories
          </text>
          <text x={0} y={85} textAnchor="middle" fill="#4ADE80" fontSize={20} fontWeight="bold">
            Then has another calf &amp; repeats! 🔄
          </text>
        </g>

        {/* Stickman celebrating */}
        <DoodleStickman
          x={1500}
          y={730}
          scale={0.85}
          expression="grin"
          pose="waving"
          shirtColor="#0284C7"
        />
      </SlideIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 6: Daily Milking Routine 4-Panel split (Matches ref_pig_snap_180s.jpg)
 */
const Beat6_DailyMilkingRoutineCycle: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* 4-Panel Daily Milking Routine */}
      <DailyMilkingRoutine activePanel="all" />
      <PopIn centerX={960} centerY={70} startFrame={10}>
        <StoryBadge text="MILKED EVERY DAY FOR MONTHS • THEN REPEATS WITH NEXT CALF" x={960} y={70} fontSize={26} bgColor="#0F172A" />
      </PopIn>
    </div>
  );
};

/**
 * Beat 7A: Endless Conveyor Belt of Milk Bottles
 */
const Beat7A_EndlessConveyor: React.FC = () => {
  const frame = useCurrentFrame();
  const conveyorOffset = (frame * 12) % 120;

  return (
    <FarmPastureEnv>
      <SlideIn direction="left" distance={250} startFrame={0} withSfx={true}>
        {/* Cow at left feeding the line */}
        <DoodleCow x={420} y={670} scale={0.95} mood="proud" squirtMilk={true} />

        {/* Industrial Conveyor Belt */}
        <g transform="translate(700, 720)">
          {/* Belt Track */}
          <rect x={0} y={30} width={900} height={20} rx={6} fill="#334155" stroke="#18181B" strokeWidth={4} />
          <line x1={0} y1={40} x2={900} y2={40} stroke="#94A3B8" strokeWidth={2} strokeDasharray="12 12" />

          {/* Endless Milk Bottles rolling by */}
          {Array.from({ length: 9 }).map((_, i) => {
            const bx = (i * 110 + conveyorOffset) % 850;
            return (
              <g key={i} transform={`translate(${bx}, -20)`}>
                <rect x={-14} y={-40} width={28} height={55} rx={6} fill="#FFFFFF" stroke="#18181B" strokeWidth={3} />
                <polygon points="-8,-40 -6,-55 6,-55 8,-40" fill="#E2E8F0" stroke="#18181B" strokeWidth={2.5} />
                <ellipse cx={0} cy={-55} rx={8} ry={3} fill="#0284C7" />
              </g>
            );
          })}
        </g>

        {/* Stickman Operator monitoring the flow */}
        <DoodleStickman
          x={1680}
          y={660}
          scale={0.95}
          expression="grin"
          pose="waving"
          shirtColor="#F59E0B"
          pupilDirection="left"
        />

        <PopIn centerX={960} centerY={180} startFrame={10}>
          <StoryBadge text="THE SAME ANIMAL KEEPS PRODUCING 🔄" x={960} y={180} fontSize={28} bgColor="#16A34A" />
        </PopIn>
      </SlideIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 7B: Extraordinary Deal Certificate
 */
const Beat7B_ExtraordinaryDeal: React.FC = () => {
  return (
    <FarmPastureEnv skyColor="#FEF08A">
      <ZoomIn startFrame={0} durationInFrames={30} fromScale={0.95} toScale={1.05} withWhoosh={false}>
        {/* Giant Golden Deal Certificate */}
        <g transform="translate(960, 480)">
          <rect x={-460} y={-220} width={920} height={440} rx={24} fill="#FEFCE8" stroke="#CA8A04" strokeWidth={10} />
          <rect x={-440} y={-200} width={880} height={400} rx={18} fill="none" stroke="#EAB308" strokeWidth={3} strokeDasharray="10 6" />

          <text x={0} y={-140} textAnchor="middle" fill="#78350F" fontSize={38} fontWeight="900" fontFamily="sans-serif">
            📜 THE EXTRAORDINARY DEAL
          </text>
          <line x1={-380} y1={-115} x2={380} y2={-115} stroke="#CA8A04" strokeWidth={3} />

          <text x={-360} y={-60} fill="#1E293B" fontSize={26} fontWeight="bold" fontFamily="sans-serif">
            Input:
          </text>
          <text x={-260} y={-60} fill="#16A34A" fontSize={26} fontWeight="900" fontFamily="sans-serif">
            Free Sunlight, Rain &amp; Pasture Grass 🌱
          </text>

          <text x={-360} y={0} fill="#1E293B" fontSize={26} fontWeight="bold" fontFamily="sans-serif">
            Output:
          </text>
          <text x={-260} y={0} fill="#0284C7" fontSize={26} fontWeight="900" fontFamily="sans-serif">
            10,000+ Liters of Fresh Milk / Year! 🥛
          </text>

          <text x={-360} y={60} fill="#1E293B" fontSize={26} fontWeight="bold" fontFamily="sans-serif">
            Cost:
          </text>
          <text x={-260} y={60} fill="#D97706" fontSize={26} fontWeight="900" fontFamily="sans-serif">
            Zero Slaughter • Predictable • Scalable
          </text>

          {/* Golden Seal */}
          <g transform="translate(320, 100)">
            <circle cx={0} cy={0} r={48} fill="#FDE047" stroke="#CA8A04" strokeWidth={5} />
            <text x={0} y={8} textAnchor="middle" fill="#78350F" fontSize={18} fontWeight="900">
              100% DEAL
            </text>
          </g>
        </g>

        {/* Stickman presenting the deal */}
        <DoodleStickman
          x={1620}
          y={680}
          scale={0.9}
          expression="grin"
          pose="waving"
          shirtColor="#EAB308"
        />
      </ZoomIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 8: Shift to Pigs - Intelligence and independence
 */
const Beat8_PigIntelligence: React.FC = () => {
  return (
    <BarnInteriorEnv>
      <SlideIn direction="top" distance={250} startFrame={0} withSfx={true}>
        {/* Genius Pig with Sunglasses & Rubik's Cube / Book */}
        <g transform="translate(680, 720)">
          <DoodlePig x={0} y={0} scale={1.05} mood="calm" />
          {/* Cool sunglasses on pig head */}
          <rect x={-155} y={-25} width={45} height={18} rx={4} fill="#0F172A" />
          <line x1={-155} y1={-16} x2={-175} y2={-16} stroke="#0F172A" strokeWidth={3} />
          {/* IQ Brain badge */}
          <g transform="translate(0, -130)">
            <rect x={-110} y={-25} width={220} height={50} rx={25} fill="#DB2777" stroke="#FFFFFF" strokeWidth={3} />
            <text x={0} y={8} textAnchor="middle" fill="#FFFFFF" fontSize={20} fontWeight="bold">
              🧠 HIGH IQ: ~HUMAN 3YO
            </text>
          </g>
        </g>

        {/* Feeding Trough with Human Grain/Apples */}
        <FeedingTrough x={340} y={780} scale={0.9} />

        {/* Stickman looking intimidated */}
        <DoodleStickman
          x={1450}
          y={680}
          scale={0.95}
          expression="confused"
          pose="panicking"
          shirtColor="#EC4899"
          pupilDirection="left"
        />

        <PopIn centerX={960} centerY={180} startFrame={10}>
          <StoryBadge text="NOW TRY THAT WITH PIGS: HIGHLY INTELLIGENT" x={960} y={180} fontSize={28} bgColor="#DB2777" />
        </PopIn>
      </SlideIn>
    </BarnInteriorEnv>
  );
};

/**
 * Beat 9A: Strong, Fast, and Uncooperative
 */
const Beat9A_StrongFastPig: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <BarnInteriorEnv>
      <CameraShutterEffect triggerFrame={8} flashDurationFrames={6} />
      {/* Speed lines across screen */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={i}
          x1={1920 - ((frame * 35 + i * 160) % 2200)}
          y1={500 + (i % 6) * 50}
          x2={1750 - ((frame * 35 + i * 160) % 2200)}
          y2={500 + (i % 6) * 50}
          stroke="#F43F5E"
          strokeWidth={5}
          strokeLinecap="round"
        />
      ))}

      {/* Charging Fast Pig */}
      <g transform={`translate(${750 + Math.sin(frame * 0.4) * 20}, 720)`}>
        <DoodlePig x={0} y={0} scale={1.15} mood="irritated" />
        {/* Dust cloud behind pig */}
        <circle cx={140} cy={110} r={24} fill="rgba(255,255,255,0.6)" />
        <circle cx={180} cy={95} r={32} fill="rgba(255,255,255,0.4)" />
      </g>

      {/* Farmer Stickman jumping away */}
      <DoodleStickman
        x={1550}
        y={650}
        scale={0.95}
        expression="shocked"
        pose="panicking"
        shirtColor="#F43F5E"
      />

      <PopIn centerX={960} centerY={180} startFrame={5}>
        <StoryBadge text="STRONG • FAST • ZERO INTEREST IN MILKING" x={960} y={180} fontSize={28} bgColor="#DC2626" />
      </PopIn>
    </BarnInteriorEnv>
  );
};

/**
 * Beat 9B: Morning Routine Chaos (Kicking the stool and pail)
 */
const Beat9B_MorningRoutineChaos: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <BarnInteriorEnv>
      {/* 6:00 AM Alarm Clock Shaking */}
      <g transform={`translate(280, 240) rotate(${Math.sin(frame * 0.5) * 8})`}>
        <circle cx={0} cy={0} r={46} fill="#FFFFFF" stroke="#DC2626" strokeWidth={6} />
        <line x1={0} y1={0} x2={0} y2={-24} stroke="#18181B" strokeWidth={4} />
        <line x1={0} y1={0} x2={16} y2={8} stroke="#18181B" strokeWidth={4} />
        <text x={0} y={75} textAnchor="middle" fill="#DC2626" fontSize={20} fontWeight="900">
          ⏰ 6:00 AM
        </text>
      </g>

      {/* Irritated Sow */}
      <DoodlePig x={700} y={740} scale={1.05} mood="irritated" />

      {/* Flying Wooden Stool kicked into air */}
      <g transform={`translate(1020, ${520 - frame * 2}) rotate(${frame * 12})`}>
        <ellipse cx={0} cy={0} rx={35} ry={12} fill="#B45309" stroke="#18181B" strokeWidth={4} />
        <line x1={-20} y1={0} x2={-25} y2={45} stroke="#78350F" strokeWidth={5} />
        <line x1={20} y1={0} x2={25} y2={45} stroke="#78350F" strokeWidth={5} />
      </g>

      {/* Spilled Milking Pail with Flying Milk Drops */}
      <g transform="translate(1180, 750) rotate(85)">
        <MilkingBucket x={0} y={0} scale={0.9} fillLevel={0.0} />
        <ellipse cx={30} cy={-20} rx={45} ry={15} fill="#FFFFFF" stroke="#18181B" strokeWidth={3} />
      </g>

      {/* Farmer Stickman dodging */}
      <DoodleStickman
        x={1520}
        y={670}
        scale={0.95}
        expression="sweating"
        pose="wiping_sweat"
        shirtColor="#F43F5E"
        pupilDirection="left"
      />

      <PopIn centerX={960} centerY={160} startFrame={10}>
        <StoryBadge text="NOT COOPERATING WITH YOUR MORNING ROUTINE! 💢" x={960} y={160} fontSize={28} bgColor="#DC2626" />
      </PopIn>
    </BarnInteriorEnv>
  );
};

/**
 * Beat 10: Stressed sow with litter can be dangerous
 */
const Beat10_DangerousMotherSow: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <FarmPastureEnv showFence={true}>
      <CameraShutterEffect triggerFrame={10} flashDurationFrames={6} />
      <ZoomIn startFrame={0} durationInFrames={35} fromScale={1.0} toScale={1.06} withWhoosh={false}>
        {/* Angry charging sow behind fence */}
        <g transform={`translate(${550 + Math.sin(frame * 0.3) * 15}, 670)`}>
          <DoodlePig x={0} y={0} scale={1.25} mood="irritated" />
          {/* Red anger veins & steam clouds */}
          <circle cx={-160} cy={20} r={14} fill="rgba(239, 68, 68, 0.4)" />
          <circle cx={-185} cy={10} r={18} fill="rgba(239, 68, 68, 0.3)" />
        </g>

        {/* Protective litter of piglets safely behind her */}
        <g transform="translate(240, 740)">
          <DoodlePiglet x={0} y={0} scale={0.5} />
          <DoodlePiglet x={70} y={10} scale={0.5} />
          <DoodlePiglet x={140} y={0} scale={0.5} />
        </g>

        {/* Farmer Stickman leaping over fence in panic */}
        <g transform="translate(1500, 620)">
          <DoodleStickman
            x={0}
            y={0}
            scale={1.0}
            expression="shocked"
            pose="panicking"
            shirtColor="#DC2626"
            pupilDirection="left"
          />
          {/* Sweat Drops */}
          <circle cx={-40} cy={-25} r={7} fill="#38BDF8" />
          <circle cx={40} cy={-25} r={7} fill="#38BDF8" />
        </g>

        <PopIn centerX={960} centerY={160} startFrame={10}>
          <StoryBadge text="⚠️ DANGER: MATERNAL INSTINCT &amp; SPEED" x={960} y={160} fontSize={30} bgColor="#DC2626" />
        </PopIn>
      </ZoomIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 11A: Exhausted Farmer with tiny shot of milk
 */
const Beat11A_ExhaustedFarmer: React.FC = () => {
  return (
    <BarnInteriorEnv>
      <SlideIn direction="bottom" distance={200} startFrame={0} withSfx={true}>
        {/* Muddy, exhausted Farmer Stickman */}
        <g transform="translate(800, 680)">
          <DoodleStickman
            x={0}
            y={0}
            scale={1.0}
            expression="sweating"
            pose="wiping_sweat"
            shirtColor="#64748B"
          />
          {/* Bandage on head */}
          <rect x={-28} y={-35} width={56} height={14} rx={3} fill="#FFFFFF" stroke="#18181B" strokeWidth={2.5} />
        </g>

        {/* Tiny Shot Glass / Syringe with 1 tablespoon of milk */}
        <g transform="translate(1250, 620)">
          <rect x={-180} y={-110} width={360} height={220} rx={16} fill="#0F172A" stroke="#F43F5E" strokeWidth={6} />
          <text x={0} y={-60} textAnchor="middle" fill="#FFFFFF" fontSize={22} fontWeight="bold">
            TOTAL HARVESTED:
          </text>
          {/* Tiny test tube */}
          <rect x={-15} y={-30} width={30} height={70} rx={15} fill="rgba(255,255,255,0.8)" stroke="#18181B" strokeWidth={3} />
          <rect x={-12} y={15} width={24} height={22} rx={6} fill="#FFFFFF" />
          <text x={0} y={75} textAnchor="middle" fill="#FDE047" fontSize={28} fontWeight="900">
            ~30 ml (A Teaspoon!)
          </text>
        </g>

        <PopIn centerX={960} centerY={180} startFrame={10}>
          <StoryBadge text="EVEN IF YOU SUCCEED: A FRACTION OF A COW 🧪" x={960} y={180} fontSize={26} bgColor="#0F172A" />
        </PopIn>
      </SlideIn>
    </BarnInteriorEnv>
  );
};

/**
 * Beat 11B: Fraction comparison (1.2% of Cow Yield)
 */
const Beat11B_FractionComparison: React.FC = () => {
  return (
    <ComparisonSplitEnv
      leftColor="#F0FDF4"
      rightColor="#FDF2F8"
      leftTitle="🐮 COW: 40 LITERS"
      rightTitle="🐷 PIG: 0.5 LITERS"
    >
      <ZoomIn startFrame={0} durationInFrames={25} fromScale={1.0} toScale={1.05} withWhoosh={false}>
        {/* Left: Giant Canisters */}
        <g transform="translate(380, 620)">
          <MilkCanister x={0} y={0} scale={1.4} isOverflowing={true} />
          <StoryBadge text="100% COMMERCIAL YIELD" x={0} y={-140} fontSize={24} bgColor="#16A34A" />
        </g>

        {/* Right: Tiny Dropper */}
        <g transform="translate(1540, 620)">
          <TinyMilkBottle x={0} y={0} scale={1.2} fillFraction={0.15} />
          <StoryBadge text="1.2% OF COW OUTPUT" x={0} y={-140} fontSize={24} bgColor="#DC2626" />
        </g>

        {/* Stickman Shrugging in center */}
        <DoodleStickman
          x={960}
          y={720}
          scale={0.8}
          expression="confused"
          pose="waving"
          shirtColor="#F59E0B"
        />
      </ZoomIn>
    </ComparisonSplitEnv>
  );
};

/**
 * Beat 12: Farmer asks the obvious question
 */
const Beat12_FarmerDilemma: React.FC = () => {
  return (
    <FarmPastureEnv>
      <SlideIn direction="bottom" distance={250} startFrame={0} withSfx={true}>
        {/* Cow on Left */}
        <DoodleCow x={450} y={670} scale={0.85} mood="proud" />

        {/* Pig on Right */}
        <DoodlePig x={1450} y={700} scale={0.85} mood="irritated" />

        {/* Farmer Stickman at center scratching chin */}
        <g transform="translate(960, 650)">
          <DoodleStickman
            x={0}
            y={0}
            scale={1.05}
            expression="confused"
            pose="holding_magnifier"
            shirtColor="#0284C7"
          />
          {/* Giant Glowing Question Mark above Stickman */}
          <PopIn centerX={0} centerY={-180} startFrame={15}>
            <circle cx={0} cy={-180} r={55} fill="#FEF08A" stroke="#18181B" strokeWidth={5} />
            <text x={0} y={-160} textAnchor="middle" fill="#0F172A" fontSize={64} fontWeight="900" fontFamily="sans-serif">
              ?
            </text>
          </PopIn>
        </g>

        <StoryBadge text="THE FARMER'S OBVIOUS QUESTION ❓" x={960} y={160} fontSize={28} bgColor="#0284C7" />
      </SlideIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 13A: "WHY BOTHER?" Punchy Close-Up
 */
const Beat13A_WhyBotherPunch: React.FC = () => {
  return (
    <FarmPastureEnv skyColor="#0F172A" groundColor="#1E293B">
      <CameraShutterEffect triggerFrame={6} flashDurationFrames={6} />
      <ZoomIn startFrame={0} durationInFrames={20} fromScale={0.9} toScale={1.1} withWhoosh={true}>
        <g transform="translate(960, 500)">
          <rect x={-450} y={-140} width={900} height={280} rx={24} fill="#DC2626" stroke="#FFFFFF" strokeWidth={8} />
          <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={84} fontWeight="900" letterSpacing="3px" fontFamily="sans-serif">
            WHY BOTHER?
          </text>
        </g>
      </ZoomIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 13B: Humans are extremely good at answering that question
 */
const Beat13B_EconomistPresenter: React.FC = () => {
  return (
    <CafeCounterEnv>
      <SlideIn direction="right" distance={300} startFrame={0} withSfx={true}>
        {/* Confident Presenter Stickman */}
        <DoodleStickman
          x={680}
          y={650}
          scale={1.05}
          expression="grin"
          pose="waving"
          shirtColor="#0284C7"
          pupilDirection="up_right"
        />

        {/* Agricultural Logic Board */}
        <g transform="translate(1280, 440)">
          <rect x={-260} y={-140} width={520} height={280} rx={20} fill="#0F172A" stroke="#38BDF8" strokeWidth={6} />
          <text x={0} y={-80} textAnchor="middle" fill="#38BDF8" fontSize={26} fontWeight="900" fontFamily="sans-serif">
            💡 HUMAN DOMESTICATION LOGIC
          </text>
          <line x1={-220} y1={-60} x2={220} y2={-60} stroke="#334155" strokeWidth={2} />
          <text x={0} y={-10} textAnchor="middle" fill="#FFFFFF" fontSize={24} fontWeight="bold">
            Efficiency ⚙️
          </text>
          <text x={0} y={35} textAnchor="middle" fill="#4ADE80" fontSize={24} fontWeight="bold">
            Scalability 📈
          </text>
          <text x={0} y={80} textAnchor="middle" fill="#FDE047" fontSize={24} fontWeight="bold">
            Return on Effort (ROI) 💰
          </text>
        </g>
      </SlideIn>
    </CafeCounterEnv>
  );
};

/**
 * Beat 14: Split question: Not "Can we eat this?", but "Can we produce cheaply at scale?"
 */
const Beat14_SplitQuestion: React.FC = () => {
  return (
    <CafeCounterEnv>
      <SlideIn direction="left" distance={250} startFrame={0} withSfx={true}>
        {/* Left Card: Can we eat this? (Strikethrough) */}
        <g transform="translate(560, 420)">
          <rect x={-220} y={-110} width={440} height={220} rx={16} fill="#1E293B" stroke="#64748B" strokeWidth={5} />
          <text x={0} y={-35} textAnchor="middle" fill="#94A3B8" fontSize={24} fontWeight="bold">
            Old Question:
          </text>
          <text x={0} y={15} textAnchor="middle" fill="#F8FAFC" fontSize={28} fontWeight="900">
            &quot;CAN WE EAT THIS?&quot;
          </text>
          {/* Strikethrough */}
          <line x1={-180} y1={10} x2={180} y2={10} stroke="#EF4444" strokeWidth={6} strokeLinecap="round" />
          <text x={0} y={65} textAnchor="middle" fill="#EF4444" fontSize={20} fontWeight="bold">
            (Too Simple!)
          </text>
        </g>

        {/* Right Card: Can we produce at scale? (Glowing Gold) */}
        <g transform="translate(1360, 420)">
          <rect x={-250} y={-120} width={500} height={240} rx={18} fill="#0F172A" stroke="#FDE047" strokeWidth={6} />
          <text x={0} y={-45} textAnchor="middle" fill="#FDE047" fontSize={24} fontWeight="bold">
            Real Agricultural Question:
          </text>
          <text x={0} y={10} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontWeight="900">
            &quot;CAN WE PRODUCE CHEAPLY
          </text>
          <text x={0} y={50} textAnchor="middle" fill="#38BDF8" fontSize={30} fontWeight="900">
            AT MASS SCALE?&quot;
          </text>
        </g>

        {/* Stickman pointing between them */}
        <DoodleStickman
          x={960}
          y={690}
          scale={0.9}
          expression="talking"
          pose="pointing_board"
          shirtColor="#0284C7"
        />
      </SlideIn>
    </CafeCounterEnv>
  );
};

/**
 * Beat 15: Evaluation Scorecard (ScorecardBoard)
 */
const Beat15_ScaleScorecard: React.FC = () => {
  return (
    <FarmPastureEnv skyColor="#E0F2FE" groundColor="#BBF7D0">
      <SlideIn direction="bottom" distance={250} startFrame={0} withSfx={true}>
        {/* Full Evaluation Scorecard */}
        <ScorecardBoard x={850} y={480} scale={1.05} stampWinner={false} />

        {/* Stickman Presenter with Pointer */}
        <DoodleStickman
          x={1480}
          y={660}
          scale={0.95}
          expression="talking"
          pose="pointing_board"
          shirtColor="#0284C7"
          pupilDirection="left"
        />
      </SlideIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 16: "That's where pigs lose." Red Stamp & Winner Trophy
 */
const Beat16_CowsWinFinale: React.FC = () => {
  return (
    <FarmPastureEnv>
      <CameraShutterEffect triggerFrame={5} flashDurationFrames={6} />
      <ZoomIn startFrame={0} durationInFrames={25} fromScale={1.0} toScale={1.05} withWhoosh={false}>
        {/* Scorecard with WINNER STAMP stamped */}
        <ScorecardBoard x={650} y={480} scale={0.9} stampWinner={true} />

        {/* Winning Cow with Crown */}
        <g transform="translate(1320, 680)">
          <DoodleCow x={0} y={0} scale={0.95} mood="proud" squirtMilk={true} />
          {/* Golden Crown on cow head */}
          <polygon
            points="-140,-95 -120,-125 -100,-100 -80,-125 -60,-95"
            fill="#FDE047"
            stroke="#CA8A04"
            strokeWidth={4}
          />
        </g>

        {/* Shrugging cute piglet */}
        <DoodlePiglet x={1080} y={750} scale={0.65} angle={10} />

        {/* Stickman Host nodding in verdict */}
        <DoodleStickman
          x={1680}
          y={660}
          scale={0.95}
          expression="smile"
          pose="waving"
          shirtColor="#16A34A"
          pupilDirection="left"
        />

        <PopIn centerX={960} centerY={160} startFrame={10}>
          <StoryBadge text="THAT'S WHERE PIGS LOSE 🏆 COWS WIN THE JOB" x={960} y={160} fontSize={28} bgColor="#DC2626" />
        </PopIn>
      </ZoomIn>
    </FarmPastureEnv>
  );
};
