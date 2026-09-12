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
  MathBlackboard,
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
 * 🥛 CHAPTER 3: THE QUANTITY PROBLEM (1211 frames @ 30fps)
 * Audio: audio/pig_milk/3_quantity.mp3
 * Beat Pacing strictly <= 135 frames (< 4.5s) per Sequence
 */
export const Chapter3_Quantity: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden' }}>
      {/* Continuous Voiceover Audio */}
      <Audio src={staticFile('audio/pig_milk/3_quantity.mp3')} volume={1.0} />

      {/* BEAT 1: 0 - 112 (112 frames) "Could you use a machine anyway? Technically, yes..." */}
      <Sequence from={0} durationInFrames={112}>
        <Beat1_MachineIdea />
      </Sequence>

      {/* BEAT 2: 112 - 215 (103 frames) "...but then you hit a second wall." */}
      <Sequence from={112} durationInFrames={103}>
        <Beat2_SecondWall />
      </Sequence>

      {/* BEAT 3A: 215 - 255 (40 frames) "Quantity." */}
      <Sequence from={215} durationInFrames={40}>
        <Beat3A_QuantityTitle />
      </Sequence>

      {/* BEAT 3B: 255 - 365 (110 frames) "A cow produces far more milk than her calf actually needs." */}
      <Sequence from={255} durationInFrames={110}>
        <Beat3B_CowSurplus />
      </Sequence>

      {/* BEAT 4: 365 - 470 (105 frames) "Humans exploited that surplus," (matching snap_210s.jpg) */}
      <Sequence from={365} durationInFrames={105}>
        <Beat4_QuantityMetaphor />
      </Sequence>

      {/* BEAT 5A: 470 - 540 (70 frames) "and modern dairy cows have been selectively bred..." */}
      <Sequence from={470} durationInFrames={70}>
        <Beat5A_SelectiveBreeding />
      </Sequence>

      {/* BEAT 5B: 540 - 640 (100 frames) "...to produce even more of it." */}
      <Sequence from={540} durationInFrames={100}>
        <Beat5B_SuperchargedYield />
      </Sequence>

      {/* BEAT 6A: 640 - 710 (70 frames) "Pigs don't work that way." */}
      <Sequence from={640} durationInFrames={70}>
        <Beat6A_PigsDifferent />
      </Sequence>

      {/* BEAT 6B: 710 - 780 (70 frames) "A sow's output is tightly matched to her litter," */}
      <Sequence from={710} durationInFrames={70}>
        <Beat6B_TightEquilibrium />
      </Sequence>

      {/* BEAT 7: 780 - 907 (127 frames) "and litters can run 10 piglets or more." */}
      <Sequence from={780} durationInFrames={127}>
        <Beat7_PigletSwarm />
      </Sequence>

      {/* BEAT 8: 907 - 1037 (130 frames) "Those piglets are extremely efficient at consuming what she makes." */}
      <Sequence from={907} durationInFrames={130}>
        <Beat8_EfficiencyNursing />
      </Sequence>

      {/* BEAT 9A: 1037 - 1110 (73 frames) "There's no leftover pool waiting for humans," */}
      <Sequence from={1037} durationInFrames={73}>
        <Beat9A_ZeroSurplusBottle />
      </Sequence>

      {/* BEAT 9B & 10: 1110 - 1211 (101 frames) "and that changes the economics completely." */}
      <Sequence from={1110} durationInFrames={101}>
        <Beat9B_EconomicsBlackboard />
      </Sequence>
    </div>
  );
};

/* =========================================================================
 * BEAT IMPLEMENTATIONS (All strictly <= 135 frames, 100% full-bleed)
 * ========================================================================= */

/**
 * Beat 1: Stickman inventor in barn pondering automated machine milking for pigs
 */
const Beat1_MachineIdea: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <BarnInteriorEnv>
      <ZoomIn startFrame={0} durationInFrames={40} fromScale={1.0} toScale={1.05} withWhoosh={false}>
        {/* Resting Sow in straw */}
        <DoodlePig x={650} y={760} scale={0.9} mood="calm" />

        {/* Bizarre 14-tube automated milking claw prototype */}
        <g transform="translate(1050, 680)">
          {/* Machine cart */}
          <rect x={-60} y={-40} width={120} height={100} rx={10} fill="#64748B" stroke="#18181B" strokeWidth={5} />
          <circle cx={-35} cy={65} r={20} fill="#1E293B" stroke="#18181B" strokeWidth={4} />
          <circle cx={35} cy={65} r={20} fill="#1E293B" stroke="#18181B" strokeWidth={4} />
          {/* Pressure gauge */}
          <circle cx={0} cy={-60} r={24} fill="#F8FAFC" stroke="#18181B" strokeWidth={4} />
          <line x1={0} y1={-60} x2={12} y2={-72} stroke="#DC2626" strokeWidth={3} />
          {/* 14 dangling tubes */}
          {Array.from({ length: 7 }).map((_, i) => (
            <path
              key={i}
              d={`M ${-40 + i * 14} 10 Q ${-90 - i * 18} ${80 + Math.sin((frame + i * 5) * 0.2) * 5} ${-180 - i * 22} 90`}
              stroke="#38BDF8"
              strokeWidth={4}
              fill="none"
              strokeDasharray="8 4"
            />
          ))}
          <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={16} fontWeight="bold" fontFamily="sans-serif">
            MK-14 VACUUM
          </text>
        </g>

        {/* Stickman inventor protagonist */}
        <DoodleStickman
          x={1450}
          y={660}
          scale={0.95}
          expression="curious"
          pose="holding_magnifier"
          shirtColor="#38BDF8"
          pupilDirection="left"
        />

        {/* Question Pop */}
        <PopIn centerX={1450} centerY={380} startFrame={15}>
          <StoryBadge text="COULD WE USE A MACHINE?" x={1450} y={380} fontSize={28} bgColor="#0284C7" />
        </PopIn>
      </ZoomIn>
    </BarnInteriorEnv>
  );
};

/**
 * Beat 2: Wall #2 crashes down with CameraShutterEffect
 */
const Beat2_SecondWall: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const wallDrop = spring({
    frame: frame - 10,
    fps,
    config: { damping: 11, mass: 0.9 },
  });
  const wallY = interpolate(wallDrop, [0, 1], [-600, 360]);

  return (
    <BarnInteriorEnv>
      <CameraShutterEffect triggerFrame={16} flashDurationFrames={6} />

      {/* Crashing Brick Wall */}
      <g transform={`translate(960, ${wallY})`}>
        {/* Wall body */}
        <rect x={-450} y={-220} width={900} height={440} rx={16} fill="#991B1B" stroke="#18181B" strokeWidth={7} />
        {/* Brick Lines */}
        {[-140, -60, 20, 100, 180].map((by, i) => (
          <line key={i} x1={-450} y1={by} x2={450} y2={by} stroke="#7F1D1D" strokeWidth={4} />
        ))}
        {/* Giant Warning text */}
        <rect x={-360} y={-70} width={720} height={140} rx={14} fill="#FEF08A" stroke="#18181B" strokeWidth={5} />
        <text x={0} y={-10} textAnchor="middle" fill="#0F172A" fontSize={48} fontWeight="900" fontFamily="sans-serif">
          🧱 WALL #2
        </text>
        <text x={0} y={45} textAnchor="middle" fill="#DC2626" fontSize={38} fontWeight="900" fontFamily="sans-serif">
          THE QUANTITY BARRIER!
        </text>
      </g>

      {/* Stickman reacting in shock */}
      <DoodleStickman
        x={1650}
        y={680}
        scale={0.9}
        expression="shocked"
        pose="panicking"
        shirtColor="#F43F5E"
        pupilDirection="left"
      />

      {/* Impact dust on ground */}
      {frame > 14 && (
        <g stroke="#FFFFFF" strokeWidth={4} fill="none">
          <ellipse cx={960} cy={700} rx={480} ry={30} stroke="#FDE047" strokeWidth={6} />
          <circle cx={520} cy={660} r={18} fill="rgba(255,255,255,0.4)" />
          <circle cx={1400} cy={660} r={18} fill="rgba(255,255,255,0.4)" />
        </g>
      )}
    </BarnInteriorEnv>
  );
};

/**
 * Beat 3A: Punchy "QUANTITY" title card
 */
const Beat3A_QuantityTitle: React.FC = () => {
  return (
    <FarmPastureEnv skyColor="#38BDF8" groundColor="#4ADE80" horizonY={500}>
      <ZoomIn startFrame={0} durationInFrames={25} fromScale={0.9} toScale={1.1} withWhoosh={true}>
        <g transform="translate(960, 480)">
          <rect x={-520} y={-150} width={1040} height={300} rx={28} fill="#0F172A" stroke="#FFFFFF" strokeWidth={8} />
          <text x={0} y={20} textAnchor="middle" fill="#FDE047" fontSize={92} fontWeight="900" letterSpacing="4px" fontFamily="sans-serif">
            QUANTITY.
          </text>
          <text x={0} y={90} textAnchor="middle" fill="#FFFFFF" fontSize={32} fontWeight="bold" fontFamily="sans-serif">
            Why Cows Feed Nations &amp; Pigs Feed Litters
          </text>
        </g>
      </ZoomIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 3B: Cow produces far more milk than calf needs
 */
const Beat3B_CowSurplus: React.FC = () => {
  return (
    <FarmPastureEnv>
      <SlideIn direction="left" distance={300} startFrame={0} withSfx={true}>
        {/* Proud Cow */}
        <DoodleCow x={700} y={660} scale={1.05} mood="proud" squirtMilk={true} />

        {/* Small Calf Drinking from pail */}
        <g transform="translate(320, 710) scale(0.6)">
          <DoodleCow x={0} y={0} scale={0.7} mood="happy" />
          <StoryBadge text="Cute Calf (Needs ~8L)" x={0} y={-140} fontSize={22} bgColor="#0284C7" />
        </g>

        {/* Giant Metal Milk Canister for humans */}
        <g transform="translate(1180, 640)">
          <MilkCanister x={0} y={0} scale={1.25} isOverflowing={true} />
          <StoryBadge text="SURPLUS FOR HUMANS: +32 LITERS!" x={0} y={-140} fontSize={26} bgColor="#16A34A" />
        </g>

        {/* Stickman dairy farmer cheering */}
        <DoodleStickman
          x={1620}
          y={660}
          scale={0.95}
          expression="grin"
          pose="waving"
          shirtColor="#22C55E"
          pupilDirection="left"
        />
      </SlideIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 4: The Quantity Metaphor (Directly matching ref_pig_snap_210s.jpg)
 */
const Beat4_QuantityMetaphor: React.FC = () => {
  return (
    <ComparisonSplitEnv
      leftColor="#FDF2F8"
      rightColor="#F0FDF4"
      leftTitle="🐷 PIG MILK: 0.5L VIAL"
      rightTitle="🐮 COW MILK: 40L CANISTER"
    >
      <ZoomIn startFrame={0} durationInFrames={40} fromScale={1.0} toScale={1.04} withWhoosh={false}>
        {/* LEFT SIDE: Tiny half-empty medicine bottle on wooden stool beside little pig */}
        <g transform="translate(180, 20)">
          <TinyMilkBottle x={320} y={640} scale={1.2} fillFraction={0.35} />
          <DoodlePig x={560} y={680} scale={0.68} mood="calm" />
          {/* Label matching snap_210s */}
          <StoryBadge text="Almost Empty (~0.5 Liters)" x={320} y={480} fontSize={22} bgColor="#DB2777" />
        </g>

        {/* RIGHT SIDE: Giant overflowing 40L metal milk canister beside proud cow */}
        <g transform="translate(380, 20)">
          <MilkCanister x={960} y={560} scale={1.55} isOverflowing={true} />
          <DoodleCow x={1260} y={670} scale={0.95} mood="proud" />
          <StoryBadge text="Massive Surplus (30 - 40L / Day!)" x={960} y={320} fontSize={24} bgColor="#16A34A" />
        </g>

        {/* Stickman protagonist observing at center bottom */}
        <DoodleStickman
          x={960}
          y={730}
          scale={0.8}
          expression="curious"
          pose="waving"
          shirtColor="#F59E0B"
        />
      </ZoomIn>
    </ComparisonSplitEnv>
  );
};

/**
 * Beat 5A: Modern dairy cows selectively bred
 */
const Beat5A_SelectiveBreeding: React.FC = () => {
  return (
    <FarmPastureEnv skyColor="#E0F2FE" groundColor="#BBF7D0">
      <CameraShutterEffect triggerFrame={10} flashDurationFrames={6} />
      <SlideIn direction="bottom" distance={200} startFrame={0} withSfx={true}>
        {/* Genetics Chart Background Card */}
        <g transform="translate(750, 360)">
          <rect x={-400} y={-140} width={800} height={280} rx={16} fill="#0F172A" stroke="#38BDF8" strokeWidth={6} />
          <text x={0} y={-80} textAnchor="middle" fill="#38BDF8" fontSize={26} fontWeight="900" fontFamily="sans-serif">
            🧬 5,000 YEARS OF SELECTIVE BREEDING
          </text>
          <line x1={-350} y1={-60} x2={350} y2={-60} stroke="#334155" strokeWidth={3} />
          {/* Progression nodes */}
          <g transform="translate(-250, 30)">
            <circle cx={0} cy={0} r={40} fill="#334155" stroke="#94A3B8" strokeWidth={4} />
            <text x={0} y={6} textAnchor="middle" fill="#F8FAFC" fontSize={16} fontWeight="bold">Wild Aurochs</text>
            <text x={0} y={65} textAnchor="middle" fill="#94A3B8" fontSize={16}>~4L / day</text>
          </g>
          <line x1={-190} y1={30} x2={-80} y2={30} stroke="#38BDF8" strokeWidth={5} strokeDasharray="6 4" />
          <g transform="translate(0, 30)">
            <circle cx={0} cy={0} r={40} fill="#1E293B" stroke="#38BDF8" strokeWidth={4} />
            <text x={0} y={6} textAnchor="middle" fill="#F8FAFC" fontSize={16} fontWeight="bold">1800s Dairy</text>
            <text x={0} y={65} textAnchor="middle" fill="#38BDF8" fontSize={16}>~15L / day</text>
          </g>
          <line x1={60} y1={30} x2={170} y2={30} stroke="#38BDF8" strokeWidth={5} strokeDasharray="6 4" />
          <g transform="translate(240, 30)">
            <circle cx={0} cy={0} r={44} fill="#0284C7" stroke="#FDE047" strokeWidth={5} />
            <text x={0} y={6} textAnchor="middle" fill="#FFFFFF" fontSize={16} fontWeight="900">Modern Holstein</text>
            <text x={0} y={65} textAnchor="middle" fill="#4ADE80" fontSize={18} fontWeight="bold">35-45L / day! 🚀</text>
          </g>
        </g>

        {/* Stickman Professor pointing to chart */}
        <DoodleStickman
          x={1480}
          y={640}
          scale={0.95}
          expression="talking"
          pose="pointing_board"
          shirtColor="#0284C7"
          pupilDirection="left"
        />

        {/* Modern Holstein Cow on pasture */}
        <DoodleCow x={450} y={720} scale={0.85} mood="proud" />
      </SlideIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 5B: Supercharged yield - stacked milk canisters
 */
const Beat5B_SuperchargedYield: React.FC = () => {
  return (
    <FarmPastureEnv>
      <ZoomIn startFrame={0} durationInFrames={35} fromScale={1.0} toScale={1.06} withWhoosh={false}>
        {/* Cow at center */}
        <DoodleCow x={960} y={680} scale={1.0} mood="proud" squirtMilk={true} />

        {/* Pyramid of stacked milk canisters on Left */}
        <g transform="translate(420, 680)">
          <MilkCanister x={-110} y={50} scale={0.75} isOverflowing={true} />
          <MilkCanister x={0} y={50} scale={0.75} isOverflowing={true} />
          <MilkCanister x={110} y={50} scale={0.75} isOverflowing={true} />
          <MilkCanister x={-55} y={-70} scale={0.75} isOverflowing={true} />
          <MilkCanister x={55} y={-70} scale={0.75} isOverflowing={true} />
          <MilkCanister x={0} y={-190} scale={0.75} isOverflowing={true} />
        </g>

        {/* More pails and cans on Right */}
        <g transform="translate(1420, 680)">
          <MilkCanister x={-50} y={30} scale={0.85} isOverflowing={true} />
          <MilkCanister x={70} y={30} scale={0.85} isOverflowing={true} />
          <MilkingBucket x={-140} y={110} scale={0.9} fillLevel={1.0} />
          <MilkingBucket x={160} y={110} scale={0.9} fillLevel={1.0} />
        </g>

        {/* Stickman celebrating */}
        <DoodleStickman
          x={1720}
          y={660}
          scale={0.95}
          expression="grin"
          pose="waving"
          shirtColor="#F59E0B"
        />

        <PopIn centerX={960} centerY={240} startFrame={10}>
          <StoryBadge text="UP TO 40 LITERS PER DAY!" x={960} y={240} fontSize={32} bgColor="#16A34A" />
        </PopIn>
      </ZoomIn>
    </FarmPastureEnv>
  );
};

/**
 * Beat 6A: Pigs don't work that way (Contrasting Barn)
 */
const Beat6A_PigsDifferent: React.FC = () => {
  return (
    <BarnInteriorEnv>
      <CameraShutterEffect triggerFrame={10} flashDurationFrames={6} />
      {/* Sow lying down in barn */}
      <DoodlePig x={700} y={750} scale={0.95} pose="nursing_lying" mood="calm" />

      {/* Warning Stamp */}
      <PopIn centerX={700} centerY={380} startFrame={5}>
        <g transform="translate(700, 380) rotate(-5)">
          <rect x={-260} y={-45} width={520} height={90} rx={16} fill="#EF4444" stroke="#7F1D1D" strokeWidth={6} />
          <text x={0} y={14} textAnchor="middle" fill="#FFFFFF" fontSize={36} fontWeight="900" fontFamily="sans-serif">
            🚫 PIGS DON'T WORK THAT WAY
          </text>
        </g>
      </PopIn>

      {/* Stickman confused host */}
      <DoodleStickman
        x={1450}
        y={680}
        scale={0.95}
        expression="confused"
        pose="panicking"
        shirtColor="#EC4899"
        pupilDirection="left"
      />
    </BarnInteriorEnv>
  );
};

/**
 * Beat 6B: Output tightly matched to litter (Scale equilibrium)
 */
const Beat6B_TightEquilibrium: React.FC = () => {
  return (
    <BarnInteriorEnv>
      <SlideIn direction="top" distance={200} startFrame={0} withSfx={true}>
        {/* Exact Balance Scale */}
        <g transform="translate(960, 380)">
          {/* Base & Pivot */}
          <polygon points="0,-40 -35,160 35,160" fill="#78350F" stroke="#18181B" strokeWidth={6} />
          <circle cx={0} cy={-40} r={18} fill="#FDE047" stroke="#18181B" strokeWidth={4} />

          {/* Perfectly Balanced Beam */}
          <line x1={-320} y1={-40} x2={320} y2={-40} stroke="#18181B" strokeWidth={8} strokeLinecap="round" />

          {/* Left Pan: Sow Output */}
          <line x1={-300} y1={-40} x2={-300} y2={60} stroke="#18181B" strokeWidth={4} />
          <ellipse cx={-300} cy={60} rx={110} ry={22} fill="#F472B6" stroke="#18181B" strokeWidth={5} />
          <text x={-300} y={40} textAnchor="middle" fill="#18181B" fontSize={20} fontWeight="900" fontFamily="sans-serif">
            SOW OUTPUT
          </text>
          <text x={-300} y={115} textAnchor="middle" fill="#F472B6" fontSize={24} fontWeight="900">
            ~8 LITERS
          </text>

          {/* Right Pan: Litter Demand */}
          <line x1={300} y1={-40} x2={300} y2={60} stroke="#18181B" strokeWidth={4} />
          <ellipse cx={300} cy={60} rx={110} ry={22} fill="#38BDF8" stroke="#18181B" strokeWidth={5} />
          <text x={300} y={40} textAnchor="middle" fill="#18181B" fontSize={20} fontWeight="900" fontFamily="sans-serif">
            LITTER DEMAND
          </text>
          <text x={300} y={115} textAnchor="middle" fill="#0284C7" fontSize={24} fontWeight="900">
            ~8 LITERS
          </text>

          {/* Exact Surplus Meter */}
          <g transform="translate(0, -90)">
            <rect x={-140} y={-30} width={280} height={60} rx={30} fill="#0F172A" stroke="#FFFFFF" strokeWidth={4} />
            <text x={0} y={10} textAnchor="middle" fill="#4ADE80" fontSize={22} fontWeight="900" fontFamily="sans-serif">
              SURPLUS: 0.00%
            </text>
          </g>
        </g>

        {/* Sow nursing lying down */}
        <DoodlePig x={560} y={800} scale={0.78} pose="nursing_lying" mood="calm" />

        {/* Stickman pointing */}
        <DoodleStickman
          x={1500}
          y={700}
          scale={0.9}
          expression="talking"
          pose="pointing_board"
          shirtColor="#0284C7"
          pupilDirection="left"
        />
      </SlideIn>
    </BarnInteriorEnv>
  );
};

/**
 * Beat 7: Litter of 10+ hungry piglets swarming
 */
const Beat7_PigletSwarm: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <BarnInteriorEnv>
      {/* Mother sow at center resting */}
      <DoodlePig x={960} y={750} scale={0.95} pose="nursing_lying" highlightTeats={true} />

      {/* Swarm of 12 cute animated piglets crowding in */}
      {Array.from({ length: 12 }).map((_, i) => {
        const row = i % 2;
        const col = Math.floor(i / 2);
        const px = 450 + col * 95 + Math.sin((frame + i * 8) * 0.15) * 8;
        const py = 760 + row * 65;

        return (
          <g key={i}>
            <DoodlePiglet x={px} y={py} scale={0.52} angle={row === 0 ? -12 : 12} />
            {/* Number tag over piglet */}
            <circle cx={px} cy={py - 32} r={14} fill="#DB2777" stroke="#18181B" strokeWidth={2.5} />
            <text x={px} y={py - 26} textAnchor="middle" fill="#FFFFFF" fontSize={13} fontWeight="bold">
              #{i + 1}
            </text>
          </g>
        );
      })}

      {/* Stickman overwhelmed by all the piglets */}
      <DoodleStickman
        x={1620}
        y={680}
        scale={0.9}
        expression="shocked"
        pose="panicking"
        shirtColor="#F43F5E"
        pupilDirection="left"
      />

      {/* Badge */}
      <PopIn centerX={960} centerY={240} startFrame={10}>
        <StoryBadge text="10 TO 14 HUNGRY PIGLETS PER LITTER!" x={960} y={240} fontSize={28} bgColor="#DB2777" />
      </PopIn>
    </BarnInteriorEnv>
  );
};

/**
 * Beat 8: Extremely efficient consumption (Fuel tank drops to 0%)
 */
const Beat8_EfficiencyNursing: React.FC = () => {
  const frame = useCurrentFrame();

  // Tank drops smoothly from 100% to 0%
  const tankPercent = Math.max(0, Math.round(100 - (frame / 130) * 100));

  return (
    <BarnInteriorEnv>
      <ZoomIn startFrame={0} durationInFrames={30} fromScale={1.0} toScale={1.05} withWhoosh={false}>
        {/* Nursing Sow with piglets actively drinking */}
        <DoodlePig x={720} y={750} scale={0.92} pose="nursing_lying" highlightTeats={true} />

        {/* Animated suction bursts / stars */}
        {Array.from({ length: 6 }).map((_, i) => (
          <g key={i} transform={`translate(${620 + i * 40}, ${780})`}>
            <polygon
              points="0,-8 2,-2 8,0 2,2 0,8 -2,2 -8,0 -2,-2"
              fill="#FFFFFF"
              transform={`scale(${0.8 + Math.sin((frame + i * 10) * 0.3) * 0.3})`}
            />
          </g>
        ))}

        {/* Real-time Sow Milk Tank Gauge */}
        <g transform="translate(1380, 480)">
          <rect x={-140} y={-180} width={280} height={360} rx={22} fill="#0F172A" stroke="#38BDF8" strokeWidth={6} />
          <text x={0} y={-135} textAnchor="middle" fill="#FFFFFF" fontSize={22} fontWeight="bold" fontFamily="sans-serif">
            SOW MILK TANK
          </text>
          {/* Outer tube */}
          <rect x={-50} y={-100} width={100} height={200} rx={12} fill="#1E293B" stroke="#94A3B8" strokeWidth={4} />
          {/* Liquid level */}
          <rect
            x={-46}
            y={100 - (tankPercent / 100) * 192}
            width={92}
            height={(tankPercent / 100) * 192}
            rx={8}
            fill="#FFFFFF"
          />
          {/* Percentage */}
          <text
            x={0}
            y={145}
            textAnchor="middle"
            fill={tankPercent < 20 ? '#EF4444' : '#FDE047'}
            fontSize={36}
            fontWeight="900"
            fontFamily="sans-serif"
          >
            {tankPercent}%
          </text>
          <text x={0} y={170} textAnchor="middle" fill="#94A3B8" fontSize={14}>
            {tankPercent === 0 ? 'COMPLETELY CONSUMED' : 'DRAINING RAPIDLY'}
          </text>
        </g>

        {/* Stickman tracking efficiency with timer */}
        <DoodleStickman
          x={1700}
          y={680}
          scale={0.9}
          expression="curious"
          pose="holding_phone"
          shirtColor="#38BDF8"
          pupilDirection="left"
        />

        <PopIn centerX={960} centerY={160} startFrame={15}>
          <StoryBadge text="100% CONSUMPTION EFFICIENCY ⚡" x={960} y={160} fontSize={26} bgColor="#0284C7" />
        </PopIn>
      </ZoomIn>
    </BarnInteriorEnv>
  );
};

/**
 * Beat 9A: No leftover pool waiting for humans (Snap 210s recreation)
 */
const Beat9A_ZeroSurplusBottle: React.FC = () => {
  return (
    <BarnInteriorEnv>
      <CameraShutterEffect triggerFrame={8} flashDurationFrames={6} />
      <SlideIn direction="left" distance={250} startFrame={0} withSfx={true}>
        {/* Wooden Stool with Tiny Medicine Bottle */}
        <TinyMilkBottle x={550} y={640} scale={1.3} fillFraction={0.2} />

        {/* Innocent Little Piglet looking at bottle */}
        <DoodlePiglet x={820} y={740} scale={0.7} angle={-5} />

        {/* Farmer Stickman with Empty Inverted Bucket */}
        <g transform="translate(1320, 680)">
          {/* Stickman */}
          <DoodleStickman
            x={0}
            y={0}
            scale={0.95}
            expression="sweating"
            pose="wiping_sweat"
            shirtColor="#F43F5E"
          />
          {/* Inverted Empty Bucket with dust puff */}
          <g transform="translate(-80, 40) rotate(160)">
            <MilkingBucket x={0} y={0} scale={1.0} fillLevel={0.0} />
          </g>
          {/* Dust clouds falling out of bucket */}
          <circle cx={-85} cy={110} r={8} fill="rgba(148, 163, 184, 0.4)" />
          <circle cx={-95} cy={125} r={12} fill="rgba(148, 163, 184, 0.3)" />
          <text x={-90} y={155} textAnchor="middle" fill="#94A3B8" fontSize={16} fontWeight="bold">
            (EMPTY!)
          </text>
        </g>

        {/* Badge */}
        <PopIn centerX={960} centerY={240} startFrame={10}>
          <StoryBadge text="HUMAN SURPLUS: 0.00 LITERS" x={960} y={240} fontSize={28} bgColor="#DC2626" />
        </PopIn>
      </SlideIn>
    </BarnInteriorEnv>
  );
};

/**
 * Beat 9B & 10: Stickman Economist & Dairy Surplus Blackboard
 */
const Beat9B_EconomicsBlackboard: React.FC = () => {
  return (
    <CafeCounterEnv>
      <SlideIn direction="right" distance={300} startFrame={0} withSfx={true}>
        {/* Economist Math Blackboard */}
        <MathBlackboard x={750} y={480} scale={1.05} />

        {/* Stickman agricultural economist presenting */}
        <DoodleStickman
          x={1450}
          y={660}
          scale={0.95}
          expression="talking"
          pose="pointing_board"
          shirtColor="#0284C7"
          pupilDirection="left"
        />

        {/* Red Verdict Stamp */}
        <PopIn centerX={750} centerY={560} startFrame={35}>
          <g transform="translate(750, 560) rotate(-6)">
            <rect x={-260} y={-40} width={520} height={80} rx={14} fill="#DC2626" stroke="#7F1D1D" strokeWidth={6} />
            <text x={0} y={12} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontWeight="900" letterSpacing="1px" fontFamily="sans-serif">
              📉 ECONOMIC IMPOSSIBILITY!
            </text>
          </g>
        </PopIn>
      </SlideIn>
    </CafeCounterEnv>
  );
};
