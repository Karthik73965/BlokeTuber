import React from 'react';
import { Audio, interpolate, Sequence, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import {
  BarnInteriorEnv,
  ButterBlock,
  CheeseWheel,
  ChemistryLabEnv,
  CurdleFailureCard,
  DoodleCow,
  DoodlePig,
  DoodlePiglet,
  DoodleStickman,
  FarmPastureEnv,
  IndustrialDairyEnv,
  MilkBottle,
  MilkCanister,
  MilkingBucket,
  PopIn,
  SfxTrigger,
  SlideIn,
  StoryBadge,
  ZoomIn,
} from '../shared/PigMilkElements';

/**
 * 🎬 CHAPTER 5: The Processing Problem (81.87s / 2,456 frames @ 30fps)
 * 
 * STRICT DIRECTING RULES:
 * - Total frames: exactly 2456 frames @ 30fps
 * - Stickman is channel avatar: featured prominently in every beat with expressive eyes, clean shirt, parallel legs
 * - BEAT PACING STRICTLY <= 135 FRAMES (< 4.5s per Sequence beat)
 * - 100% full-bleed backdrops (Chemistry Lab, Industrial Dairy Factory, Pasture, Barn)
 * - Visuals: Milk chemistry lab (8.5% fat & high protein), curdling failure (sludge vs cheese/butter),
 *   industrial dairy machine & why building a pig dairy industry from scratch is economic suicide.
 * - SFX strictly at volume={0.6}
 */
export const Chapter5_Processing: React.FC = () => {
  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#0F172A' }}>
      {/* Voiceover Master Track */}
      <Audio src={staticFile('audio/pig_milk/5_processing.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1 (0..134, dur 134f): "There's another wrinkle. Pig milk isn't especially convenient to process." */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={134}>
        <ChemistryLabEnv wallColor="#0F172A" benchColor="#334155" showBlackboard={true}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />
          {/* Main Title Badge */}
          <PopIn startFrame={8} scale={1.1}>
            <StoryBadge text="THE PROCESSING PROBLEM" x={960} y={100} bgColor="#DC2626" textColor="#FFFFFF" fontSize={36} />
          </PopIn>

          {/* Scientist Stickman investigating pig milk beaker */}
          <DoodleStickman
            x={620}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="curious"
            pose="holding_magnifier"
            pupilDirection="up_right"
          />

          {/* Beaker with Thick Pig Milk on Bench */}
          <g transform="translate(1080, 680)">
            <rect x={-55} y={-110} width={110} height={120} rx={8} fill="#F8FAFC" stroke="#18181B" strokeWidth={5} />
            <ellipse cx={0} cy={-110} rx={55} ry={14} fill="#CBD5E1" stroke="#18181B" strokeWidth={4} />
            {/* Milk level */}
            <rect x={-50} y={-80} width={100} height={85} rx={4} fill="#FDE047" opacity={0.3} />
            <text x={0} y={-30} textAnchor="middle" fill="#0F172A" fontSize={18} fontWeight="900">
              PIG MILK
            </text>
            <text x={0} y={-5} textAnchor="middle" fill="#B91C1C" fontSize={14} fontWeight="bold">
              THICK & OILY
            </text>
          </g>

          {/* Question Callout */}
          <g transform="translate(1320, 520)">
            <circle cx={0} cy={0} r={65} fill="#1E293B" stroke="#EF4444" strokeWidth={4} />
            <text x={0} y={18} textAnchor="middle" fill="#EF4444" fontSize={55} fontWeight="900">?</text>
            <text x={0} y={95} textAnchor="middle" fill="#94A3B8" fontSize={20} fontWeight="bold">Can You Churn It?</text>
          </g>
        </ChemistryLabEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2 (134..244, dur 110f): "Milk composition varies by species, and pig milk is unusually rich..." */}
      {/* ================================================================ */}
      <Sequence from={134} durationInFrames={110}>
        <ChemistryLabEnv wallColor="#0F172A" benchColor="#1E293B" showBlackboard={false}>
          <SfxTrigger sound="paper_slide" volume={0.6} startFrame={5} />

          {/* Fat globules comparison card */}
          <g transform="translate(960, 360)">
            <rect x={-560} y={-190} width={1120} height={380} rx={24} fill="#1E293B" stroke="#38BDF8" strokeWidth={5} />
            <text x={0} y={-130} textAnchor="middle" fill="#38BDF8" fontSize={30} fontWeight="900" letterSpacing="1px">
              MILK COMPOSITION DIVERGENCE
            </text>

            {/* Left: Cow Fat */}
            <g transform="translate(-280, 20)">
              <rect x={-200} y={-80} width={400} height={170} rx={16} fill="#0F172A" stroke="#38BDF8" strokeWidth={3} />
              <text x={0} y={-40} textAnchor="middle" fill="#93C5FD" fontSize={22} fontWeight="bold">COW MILK FAT</text>
              <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={50} fontWeight="900">3.5 - 4.0%</text>
              <text x={0} y={60} textAnchor="middle" fill="#94A3B8" fontSize={17}>Perfect balanced emulsion</text>
            </g>

            {/* Right: Pig Fat */}
            <g transform="translate(280, 20)">
              <rect x={-200} y={-80} width={400} height={170} rx={16} fill="#7F1D1D" stroke="#EF4444" strokeWidth={4} />
              <text x={0} y={-40} textAnchor="middle" fill="#FCA5A5" fontSize={22} fontWeight="bold">PIG MILK FAT</text>
              <text x={0} y={15} textAnchor="middle" fill="#FDE047" fontSize={55} fontWeight="900">8.5% +</text>
              <text x={0} y={60} textAnchor="middle" fill="#FECDD3" fontSize={17}>Extremely dense lipid layer</text>
            </g>
          </g>

          {/* Stickman Presenting */}
          <DoodleStickman
            x={220}
            y={620}
            scale={1.2}
            shirtColor="#38BDF8"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />
        </ChemistryLabEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3 (244..341, dur 97f): "...in fat and protein because piglets need to grow fast." */}
      {/* ================================================================ */}
      <Sequence from={244} durationInFrames={97}>
        <BarnInteriorEnv>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Nursing Sow & Piglets */}
          <DoodlePig x={720} y={650} scale={1.25} pose="nursing_lying" mood="calm" highlightTeats={true} />
          <DoodlePiglet x={560} y={670} scale={0.7} angle={-15} />
          <DoodlePiglet x={660} y={670} scale={0.7} angle={-5} />
          <DoodlePiglet x={760} y={670} scale={0.7} angle={10} />
          <DoodlePiglet x={860} y={670} scale={0.7} angle={20} />

          {/* Rocket Growth Infographic Badge */}
          <g transform="translate(1420, 360)">
            <rect x={-240} y={-160} width={480} height={320} rx={20} fill="#0F172A" stroke="#10B981" strokeWidth={5} />
            <text x={0} y={-110} textAnchor="middle" fill="#34D399" fontSize={26} fontWeight="900">
              PIGLET GROWTH EXPLOSION
            </text>
            <text x={0} y={-65} textAnchor="middle" fill="#FFFFFF" fontSize={18}>
              Birth weight: 1.2 kg → Weaning: 15 kg!
            </text>

            {/* Growth Curve Arrow */}
            <path d="M -180 80 Q -60 70 80 -10 Q 140 -60 170 -80" fill="none" stroke="#10B981" strokeWidth={8} strokeLinecap="round" />
            <polygon points="175,-95 185,-65 155,-75" fill="#10B981" />

            <text x={0} y={115} textAnchor="middle" fill="#FACC15" fontSize={22} fontWeight="900">
              HIGH PROTEIN + FAT = MAXIMUM SPEED
            </text>
          </g>

          {/* Stickman cheering */}
          <DoodleStickman
            x={180}
            y={520}
            scale={1.25}
            shirtColor="#10B981"
            expression="grin"
            pose="waving"
            pupilDirection="center"
          />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4 (341..423, dur 82f): "That doesn't make it poisonous. It just makes it different from cow milk..." */}
      {/* ================================================================ */}
      <Sequence from={341} durationInFrames={82}>
        <ChemistryLabEnv wallColor="#0F172A" benchColor="#334155" showBlackboard={false}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          {/* Green Stamp: 100% Non-Poisonous */}
          <g transform="translate(1080, 380)">
            <rect x={-320} y={-130} width={640} height={260} rx={20} fill="#064E3B" stroke="#34D399" strokeWidth={6} />
            <text x={0} y={-60} textAnchor="middle" fill="#A7F3D0" fontSize={32} fontWeight="900">
              SAFETY ASSESSMENT
            </text>
            <rect x={-260} y={-10} width={520} height={60} rx={30} fill="#059669" />
            <text x={0} y={32} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontWeight="900">
              ✔ 100% NON-TOXIC & EDIBLE
            </text>
            <text x={0} y={95} textAnchor="middle" fill="#E2E8F0" fontSize={18}>
              Drinkable mammalian milk with standard nutrients
            </text>
          </g>

          {/* Stickman Giving Thumbs Up */}
          <DoodleStickman
            x={480}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="smile"
            pose="idle"
            pupilDirection="center"
          />
        </ChemistryLabEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5 (423..554, dur 131f): "...and different in ways that don't fit neatly into the systems humans already built." */}
      {/* ================================================================ */}
      <Sequence from={423} durationInFrames={131}>
        <IndustrialDairyEnv showConveyor={false}>
          <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />

          {/* Clogged Machine Funnel Graphic */}
          <g transform="translate(1120, 420)">
            {/* Machine Funnel */}
            <polygon points="-120,-160 120,-160 40,40 -40,40" fill="#64748B" stroke="#18181B" strokeWidth={5} />
            <rect x={-40} y={40} width={80} height={140} fill="#475569" stroke="#18181B" strokeWidth={5} />

            {/* Thick Sludge Clog */}
            <ellipse cx={0} cy={30} rx={48} ry={25} fill="#F43F5E" stroke="#881337" strokeWidth={4} />
            <text x={0} y={38} textAnchor="middle" fill="#FFFFFF" fontSize={16} fontWeight="900">
              CLOGGED!
            </text>

            {/* Red Warning Sign */}
            <g transform="translate(180, -40)">
              <polygon points="0,-60 60,40 -60,40" fill="#EF4444" stroke="#18181B" strokeWidth={4} />
              <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={42} fontWeight="900">!</text>
              <text x={0} y={75} textAnchor="middle" fill="#FECDD3" fontSize={18} fontWeight="bold">
                SYSTEM MISMATCH
              </text>
            </g>
          </g>

          {/* Stickman Confused / scratching head */}
          <DoodleStickman
            x={520}
            y={520}
            scale={1.3}
            shirtColor="#F59E0B"
            expression="confused"
            pose="idle"
            pupilDirection="left"
          />
        </IndustrialDairyEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6 (554..629, dur 75f): "Humans don't drink cow milk because it was somehow designed for us." (Part 1) */}
      {/* ================================================================ */}
      <Sequence from={554} durationInFrames={75}>
        <FarmPastureEnv showBarn={true} showFence={true}>
          <SfxTrigger sound="whoosh_air" volume={0.6} startFrame={0} />

          {/* Holstein Dairy Cow */}
          <ZoomIn startFrame={0} durationInFrames={30} fromScale={0.95} toScale={1.15} originX={1150} originY={500} withWhoosh={false}>
            <DoodleCow x={1150} y={540} scale={1.25} mood="proud" />
          </ZoomIn>

          {/* Stickman talking to camera */}
          <DoodleStickman
            x={480}
            y={530}
            scale={1.3}
            shirtColor="#38BDF8"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />

          <StoryBadge text="NOT DESIGNED FOR HUMANS" x={960} y={120} bgColor="#0F172A" textColor="#38BDF8" fontSize={32} />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7 (629..701, dur 72f): "Humans don't drink cow milk because it was somehow designed for us." (Part 2) */}
      {/* ================================================================ */}
      <Sequence from={629} durationInFrames={72}>
        <FarmPastureEnv showBarn={false} showFence={false}>
          {/* Cow with Calf nursing */}
          <DoodleCow x={900} y={540} scale={1.1} mood="calm" />
          {/* Little Calf graphic */}
          <g transform="translate(1300, 620) scale(0.65)">
            <ellipse cx={0} cy={0} rx={80} ry={45} fill="#FFFFFF" stroke="#18181B" strokeWidth={4} />
            <circle cx={-50} cy={-20} r={32} fill="#FFFFFF" stroke="#18181B" strokeWidth={4} />
            <ellipse cx={-70} cy={-10} rx={16} ry={12} fill="#FDA4AF" stroke="#18181B" strokeWidth={3} />
            <circle cx={-55} cy={-25} r={5} fill="#18181B" />
          </g>

          <StoryBadge text="DESIGNED SOLELY FOR BABY CALVES" x={960} y={130} bgColor="#B45309" textColor="#FEF08A" fontSize={30} />

          <DoodleStickman
            x={340}
            y={530}
            scale={1.25}
            shirtColor="#FFFFFF"
            expression="curious"
            pose="idle"
            pupilDirection="left"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8 (701..776, dur 75f): "We drink it because we built the technology and culture..." (Part 1) */}
      {/* ================================================================ */}
      <Sequence from={701} durationInFrames={75}>
        <BarnInteriorEnv>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Ancient Milking Scene */}
          <DoodleCow x={1250} y={580} scale={1.15} isMilking={true} />
          <MilkingBucket x={1060} y={690} scale={1.2} fillLevel={0.9} />

          {/* Farmer Stickman Milking */}
          <DoodleStickman
            x={880}
            y={530}
            scale={1.25}
            shirtColor="#CA8A04"
            expression="smile"
            pose="idle"
            pupilDirection="left"
          />

          <StoryBadge text="10,000 YEARS OF MILKING TECHNOLOGY" x={960} y={110} bgColor="#0F172A" textColor="#FDE047" fontSize={32} />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9 (776..851, dur 75f): "...to exploit cattle. Thousands of years of domestication..." (Part 2) */}
      {/* ================================================================ */}
      <Sequence from={776} durationInFrames={75}>
        <ChemistryLabEnv wallColor="#1E293B" benchColor="#334155" showBlackboard={false}>
          <SfxTrigger sound="camera_shutter" volume={0.6} startFrame={5} />

          {/* Genetic Selection Graph */}
          <g transform="translate(960, 360)">
            <rect x={-500} y={-170} width={1000} height={340} rx={22} fill="#0F172A" stroke="#38BDF8" strokeWidth={5} />
            <text x={0} y={-115} textAnchor="middle" fill="#38BDF8" fontSize={28} fontWeight="900">
              ARTIFICIAL SELECTION TRIUMPH
            </text>

            <g transform="translate(-250, 20)">
              <text x={0} y={-40} textAnchor="middle" fill="#94A3B8" fontSize={20} fontWeight="bold">ANCIENT AUROCHS (8000 BC)</text>
              <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={44} fontWeight="900">~4 Liters / day</text>
              <text x={0} y={55} textAnchor="middle" fill="#64748B" fontSize={16}>Wild maternal yield</text>
            </g>

            <g transform="translate(250, 20)">
              <text x={0} y={-40} textAnchor="middle" fill="#34D399" fontSize={20} fontWeight="bold">MODERN HOLSTEIN (TODAY)</text>
              <text x={0} y={15} textAnchor="middle" fill="#FACC15" fontSize={50} fontWeight="900">40+ Liters / day</text>
              <text x={0} y={55} textAnchor="middle" fill="#10B981" fontSize={16}>10x Industrial superpower</text>
            </g>
          </g>

          <DoodleStickman
            x={220}
            y={520}
            scale={1.2}
            shirtColor="#FFFFFF"
            expression="shocked"
            pose="pointing_board"
            pupilDirection="center"
          />
        </ChemistryLabEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10 (851..925, dur 74f): "Thousands of years of domestication turned milk from an animal's private resource..." (Part 1) */}
      {/* ================================================================ */}
      <Sequence from={851} durationInFrames={74}>
        <FarmPastureEnv showBarn={false} showFence={true}>
          <SfxTrigger sound="paper_slide" volume={0.6} startFrame={5} />

          <SlideIn direction="left" distance={200} startFrame={0} withSfx={false}>
            <StoryBadge text="ANIMAL'S PRIVATE RESOURCE" x={540} y={220} bgColor="#B91C1C" textColor="#FFFFFF" fontSize={30} />
            <DoodleCow x={540} y={560} scale={1.05} mood="calm" />
          </SlideIn>

          <DoodleStickman
            x={1320}
            y={520}
            scale={1.3}
            shirtColor="#38BDF8"
            expression="talking"
            pose="idle"
            pupilDirection="left"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11 (925..998, dur 73f): "...into a human commodity. Once that system existed..." (Part 2) */}
      {/* ================================================================ */}
      <Sequence from={925} durationInFrames={73}>
        <IndustrialDairyEnv showConveyor={true}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          <StoryBadge text="HUMAN COMMODITY INFRASTRUCTURE" x={960} y={110} bgColor="#0F172A" textColor="#34D399" fontSize={32} />

          {/* Row of milk bottles on conveyor */}
          <MilkBottle x={600} y={720} scale={0.9} label="COW 1L" />
          <MilkBottle x={750} y={720} scale={0.9} label="COW 1L" />
          <MilkBottle x={900} y={720} scale={0.9} label="COW 1L" />
          <MilkBottle x={1050} y={720} scale={0.9} label="COW 1L" />
          <MilkBottle x={1200} y={720} scale={0.9} label="COW 1L" />

          <DoodleStickman
            x={260}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="grin"
            pose="waving"
            pupilDirection="center"
          />
        </IndustrialDairyEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 12 (998..1079, dur 81f): "Once that system existed, everything grew around it." (Part 1) */}
      {/* ================================================================ */}
      <Sequence from={998} durationInFrames={81}>
        <ChemistryLabEnv wallColor="#0F172A" benchColor="#334155" showBlackboard={false}>
          <SfxTrigger sound="whoosh_air" volume={0.6} startFrame={0} />

          <StoryBadge text="THE CURDLING CATACLYSM: COW VS PIG" x={960} y={100} bgColor="#0F172A" textColor="#FDE047" fontSize={32} />

          {/* Curdling Failure Comparison Card */}
          <PopIn startFrame={5} scale={1.0}>
            <CurdleFailureCard x={960} y={540} scale={0.9} />
          </PopIn>

          <DoodleStickman
            x={180}
            y={540}
            scale={1.2}
            shirtColor="#DC2626"
            expression="shocked"
            pose="idle"
            pupilDirection="center"
          />
        </ChemistryLabEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13 (1079..1159, dur 80f): "Once that system existed, everything grew around it." (Part 2) */}
      {/* ================================================================ */}
      <Sequence from={1079} durationInFrames={80}>
        <ChemistryLabEnv wallColor="#0F172A" benchColor="#334155" showBlackboard={false}>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Close up on Curdling Failure */}
          <ZoomIn startFrame={0} durationInFrames={25} fromScale={0.95} toScale={1.12} originX={1220} originY={540} withWhoosh={false}>
            <CurdleFailureCard x={960} y={540} scale={0.95} />
          </ZoomIn>

          {/* Stickman holding nose in disgust */}
          <DoodleStickman
            x={160}
            y={540}
            scale={1.25}
            shirtColor="#FFFFFF"
            expression="sweating"
            pose="panicking"
            pupilDirection="center"
          />
        </ChemistryLabEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 14 (1159..1239, dur 80f): "Cheese, butter..." */}
      {/* ================================================================ */}
      <Sequence from={1159} durationInFrames={80}>
        <BarnInteriorEnv>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          <StoryBadge text="COW CHEESE & BUTTER MASTERY" x={960} y={120} bgColor="#D97706" textColor="#FFFFFF" fontSize={34} />

          {/* Giant Cheese Wheel */}
          <PopIn startFrame={8} scale={1.2}>
            <CheeseWheel x={750} y={620} scale={1.5} showCutWedge={true} />
          </PopIn>

          {/* Golden Butter Block */}
          <PopIn startFrame={18} scale={1.2}>
            <ButterBlock x={1220} y={620} scale={1.4} />
          </PopIn>

          {/* Chef Stickman */}
          <DoodleStickman
            x={280}
            y={530}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="grin"
            pose="idle"
            pupilDirection="center"
          />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 15 (1239..1355, dur 116f): "...yogurt, cream, whey, milk powder, thousands of products." */}
      {/* ================================================================ */}
      <Sequence from={1239} durationInFrames={116}>
        <IndustrialDairyEnv showConveyor={false}>
          <SfxTrigger sound="camera_shutter" volume={0.6} startFrame={10} />

          {/* Supermarket Dairy Showcase Grid */}
          <g transform="translate(960, 360)">
            <rect x={-560} y={-180} width={1120} height={360} rx={24} fill="#0F172A" stroke="#38BDF8" strokeWidth={5} />
            <text x={0} y={-120} textAnchor="middle" fill="#38BDF8" fontSize={30} fontWeight="900">
              A 5,000+ PRODUCT COW ECOSYSTEM
            </text>

            <g transform="translate(-400, 10)">
              <rect x={-100} y={-60} width={200} height={150} rx={12} fill="#1E293B" stroke="#FACC15" strokeWidth={3} />
              <text x={0} y={-15} textAnchor="middle" fill="#FACC15" fontSize={22} fontWeight="900">CHEESE</text>
              <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={16}>Cheddar, Gouda,</text>
              <text x={0} y={50} textAnchor="middle" fill="#FFFFFF" fontSize={16}>Brie, Mozzarella</text>
            </g>

            <g transform="translate(-135, 10)">
              <rect x={-100} y={-60} width={200} height={150} rx={12} fill="#1E293B" stroke="#34D399" strokeWidth={3} />
              <text x={0} y={-15} textAnchor="middle" fill="#34D399" fontSize={22} fontWeight="900">BUTTER & CREAM</text>
              <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={16}>Heavy cream,</text>
              <text x={0} y={50} textAnchor="middle" fill="#FFFFFF" fontSize={16}>Cultured butter</text>
            </g>

            <g transform="translate(135, 10)">
              <rect x={-100} y={-60} width={200} height={150} rx={12} fill="#1E293B" stroke="#EC4899" strokeWidth={3} />
              <text x={0} y={-15} textAnchor="middle" fill="#EC4899" fontSize={22} fontWeight="900">YOGURT & KEFIR</text>
              <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={16}>Greek, Skyr,</text>
              <text x={0} y={50} textAnchor="middle" fill="#FFFFFF" fontSize={16}>Probiotic cultures</text>
            </g>

            <g transform="translate(400, 10)">
              <rect x={-100} y={-60} width={200} height={150} rx={12} fill="#1E293B" stroke="#A78BFA" strokeWidth={3} />
              <text x={0} y={-15} textAnchor="middle" fill="#A78BFA" fontSize={22} fontWeight="900">WHEY & POWDER</text>
              <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={16}>Protein isolate,</text>
              <text x={0} y={50} textAnchor="middle" fill="#FFFFFF" fontSize={16}>Infant formula</text>
            </g>
          </g>

          <DoodleStickman
            x={220}
            y={620}
            scale={1.2}
            shirtColor="#38BDF8"
            expression="smile"
            pose="pointing_board"
            pupilDirection="center"
          />
        </IndustrialDairyEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 16 (1355..1451, dur 96f): "The dairy industry became enormous..." */}
      {/* ================================================================ */}
      <Sequence from={1355} durationInFrames={96}>
        <IndustrialDairyEnv showConveyor={true}>
          <SfxTrigger sound="whoosh_cinematic" volume={0.6} startFrame={0} />

          {/* Giant Silos Zoom */}
          <ZoomIn startFrame={0} durationInFrames={35} fromScale={1.0} toScale={1.18} originX={960} originY={450} withWhoosh={false}>
            {/* $900 Billion Stat Banner */}
            <g transform="translate(960, 240)">
              <rect x={-420} y={-70} width={840} height={140} rx={24} fill="#059669" stroke="#FFFFFF" strokeWidth={6} />
              <text x={0} y={-10} textAnchor="middle" fill="#FFFFFF" fontSize={24} fontWeight="900" letterSpacing="1px">
                GLOBAL COMMERCIAL DAIRY MARKET
              </text>
              <text x={0} y={45} textAnchor="middle" fill="#FDE047" fontSize={56} fontWeight="900">
                $900,000,000,000 / YEAR
              </text>
            </g>
          </ZoomIn>

          <DoodleStickman
            x={480}
            y={540}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="shocked"
            pose="holding_magnifier"
            pupilDirection="center"
          />
        </IndustrialDairyEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 17 (1451..1573, dur 122f): "...and once an industry is that big, it's incredibly hard for a completely different animal to muscle in." */}
      {/* ================================================================ */}
      <Sequence from={1451} durationInFrames={122}>
        <IndustrialDairyEnv showConveyor={false}>
          <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />

          {/* Giant Steel Fortress Wall */}
          <g transform="translate(1100, 480)">
            <rect x={-280} y={-240} width={560} height={420} rx={16} fill="#0F172A" stroke="#EF4444" strokeWidth={8} />
            <text x={0} y={-160} textAnchor="middle" fill="#EF4444" fontSize={32} fontWeight="900">
              COW DAIRY MONOPOLY
            </text>
            <rect x={-200} y={-100} width={400} height={180} rx={12} fill="#1E293B" stroke="#475569" strokeWidth={4} />
            <text x={0} y={-30} textAnchor="middle" fill="#FCA5A5" fontSize={22} fontWeight="bold">
              ESTABLISHED PIPELINES
            </text>
            <text x={0} y={10} textAnchor="middle" fill="#FCA5A5" fontSize={22} fontWeight="bold">
              GLOBAL LOGISTICS
            </text>
            <text x={0} y={50} textAnchor="middle" fill="#FCA5A5" fontSize={22} fontWeight="bold">
              BILLIONS IN MACHINERY
            </text>
          </g>

          {/* Pig bouncing off the wall */}
          <DoodlePig x={650} y={620} scale={0.9} pose="standing" mood="irritated" />

          {/* Stickman Facepalming */}
          <DoodleStickman
            x={260}
            y={520}
            scale={1.3}
            shirtColor="#F43F5E"
            expression="sweating"
            pose="wiping_sweat"
            pupilDirection="left"
          />
        </IndustrialDairyEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 18 (1573..1704, dur 131f): "Imagine building a global pig dairy industry from scratch." */}
      {/* ================================================================ */}
      <Sequence from={1573} durationInFrames={131}>
        <ChemistryLabEnv wallColor="#0F172A" benchColor="#1E293B" showBlackboard={false}>
          <SfxTrigger sound="paper_slide" volume={0.6} startFrame={5} />

          {/* Blueprint Drafting Card */}
          <g transform="translate(1080, 420)">
            <rect x={-450} y={-230} width={900} height={460} rx={16} fill="#1E3A8A" stroke="#60A5FA" strokeWidth={5} />
            {/* Blueprint Grid */}
            <g stroke="#2563EB" strokeWidth={1} opacity={0.6}>
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={`bv-${i}`} x1={-450 + i * 65} y1={-230} x2={-450 + i * 65} y2={230} />
              ))}
              {Array.from({ length: 8 }).map((_, i) => (
                <line key={`bh-${i}`} x1={-450} y1={-230 + i * 60} x2={450} y2={-230 + i * 60} />
              ))}
            </g>
            <text x={0} y={-170} textAnchor="middle" fill="#93C5FD" fontSize={26} fontWeight="900" fontFamily="monospace">
              BLUEPRINT: COMMERCIAL PIG DAIRY FACILITY
            </text>
            <text x={0} y={-130} textAnchor="middle" fill="#FDE047" fontSize={22} fontWeight="bold" fontFamily="monospace">
              ESTIMATED STARTUP CAPEX: $500,000,000,000
            </text>

            {/* Rubber Stamp: REJECTED */}
            <g transform="translate(0, 40) rotate(-12)">
              <rect x={-220} y={-50} width={440} height={100} rx={16} fill="#DC2626" stroke="#FFFFFF" strokeWidth={6} />
              <text x={0} y={18} textAnchor="middle" fill="#FFFFFF" fontSize={50} fontWeight="900" letterSpacing="4px">
                ECONOMIC SUICIDE
              </text>
            </g>
          </g>

          {/* Hardhat Stickman holding blueprint */}
          <DoodleStickman
            x={340}
            y={520}
            scale={1.3}
            shirtColor="#CA8A04"
            expression="shocked"
            pose="panicking"
            pupilDirection="center"
          />
        </ChemistryLabEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 19 (1704..1823, dur 119f): "Specialized breeds, specialized equipment..." */}
      {/* ================================================================ */}
      <Sequence from={1704} durationInFrames={119}>
        <ChemistryLabEnv wallColor="#0F172A" benchColor="#334155" showBlackboard={false}>
          <SfxTrigger sound="stat_click" volume={0.6} startFrame={5} />

          {/* Equipment Complexity Breakdown */}
          <g transform="translate(1080, 420)">
            <rect x={-450} y={-220} width={900} height={440} rx={22} fill="#0F172A" stroke="#EC4899" strokeWidth={5} />
            <text x={0} y={-160} textAnchor="middle" fill="#F472B6" fontSize={28} fontWeight="900">
              EQUIPMENT ENGINEERING NIGHTMARE
            </text>

            {/* Cow standard milker */}
            <g transform="translate(-220, 20)">
              <rect x={-180} y={-100} width={360} height={220} rx={14} fill="#1E293B" stroke="#38BDF8" strokeWidth={3} />
              <text x={0} y={-60} textAnchor="middle" fill="#38BDF8" fontSize={22} fontWeight="bold">COW MILKER</text>
              <text x={0} y={-15} textAnchor="middle" fill="#FFFFFF" fontSize={18}>4 Large Standard Cups</text>
              <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={18}>Continuous Vacuum Flow</text>
              <text x={0} y={70} textAnchor="middle" fill="#34D399" fontSize={20} fontWeight="900">✔ OFF-THE-SHELF ($2,000)</text>
            </g>

            {/* Pig 14-teat micro-milker */}
            <g transform="translate(220, 20)">
              <rect x={-180} y={-100} width={360} height={220} rx={14} fill="#7F1D1D" stroke="#EF4444" strokeWidth={3} />
              <text x={0} y={-60} textAnchor="middle" fill="#FCA5A5" fontSize={22} fontWeight="bold">SOW MILKER</text>
              <text x={0} y={-15} textAnchor="middle" fill="#FFFFFF" fontSize={18}>14 Micro-Suction Cups</text>
              <text x={0} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={18}>15-Second Pulse Sync</text>
              <text x={0} y={70} textAnchor="middle" fill="#F87171" fontSize={20} fontWeight="900">✖ DOES NOT EXIST</text>
            </g>
          </g>

          <DoodleStickman
            x={320}
            y={520}
            scale={1.3}
            shirtColor="#FFFFFF"
            expression="curious"
            pose="pointing_board"
            pupilDirection="center"
          />
        </ChemistryLabEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 20 (1823..1957, dur 134f): "...new handling systems, new processing facilities..." */}
      {/* ================================================================ */}
      <Sequence from={1823} durationInFrames={134}>
        <BarnInteriorEnv>
          <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={10} />

          {/* Angry Sow kicking pipes */}
          <DoodlePig x={1200} y={640} scale={1.25} pose="standing" mood="irritated" />

          {/* Broken Tubing & Milk Splatters */}
          <g transform="translate(1000, 680)">
            <ellipse cx={0} cy={20} rx={75} ry={20} fill="#FFFFFF" stroke="#18181B" strokeWidth={3} />
            <path d="M -30 -40 Q 10 -20 50 -60" stroke="#CBD5E1" strokeWidth={8} fill="none" />
            <text x={0} y={-50} textAnchor="middle" fill="#EF4444" fontSize={24} fontWeight="900">
              DISASTER!
            </text>
          </g>

          {/* Stickman running away panicking */}
          <DoodleStickman
            x={420}
            y={510}
            scale={1.3}
            shirtColor="#EF4444"
            expression="shocked"
            pose="panicking"
            pupilDirection="left"
          />

          <StoryBadge text="HANDLING SOW AGGRESSION: IMPOSSIBLE AT SCALE" x={960} y={120} bgColor="#B91C1C" textColor="#FFFFFF" fontSize={32} />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 21 (1957..2059, dur 102f): "new consumer habits, all to compete against cows..." */}
      {/* ================================================================ */}
      <Sequence from={1957} durationInFrames={102}>
        <IndustrialDairyEnv showConveyor={false}>
          <SfxTrigger sound="camera_shutter" volume={0.6} startFrame={5} />

          {/* Supermarket Shelf Price Tag Comparison */}
          <g transform="translate(1080, 420)">
            <rect x={-450} y={-180} width={900} height={360} rx={22} fill="#0F172A" stroke="#FFFFFF" strokeWidth={5} />
            <text x={0} y={-120} textAnchor="middle" fill="#FFFFFF" fontSize={28} fontWeight="900">
              RETAIL PRICE COMPETITION
            </text>

            {/* Cow Milk Cartons */}
            <g transform="translate(-220, 20)">
              <rect x={-170} y={-80} width={340} height={180} rx={14} fill="#065F46" />
              <text x={0} y={-40} textAnchor="middle" fill="#A7F3D0" fontSize={22} fontWeight="bold">COW MILK (1 GALLON)</text>
              <text x={0} y={15} textAnchor="middle" fill="#FFFFFF" fontSize={48} fontWeight="900">$3.89</text>
              <text x={0} y={60} textAnchor="middle" fill="#34D399" fontSize={18} fontWeight="bold">Cheap, Delicious, Plentiful</text>
            </g>

            {/* Pig Milk Cartons */}
            <g transform="translate(220, 20)">
              <rect x={-170} y={-80} width={340} height={180} rx={14} fill="#991B1B" />
              <text x={0} y={-40} textAnchor="middle" fill="#FECDD3" fontSize={22} fontWeight="bold">PIG MILK (1 PINT)</text>
              <text x={0} y={15} textAnchor="middle" fill="#FDE047" fontSize={48} fontWeight="900">$180.00</text>
              <text x={0} y={60} textAnchor="middle" fill="#FCA5A5" fontSize={18} fontWeight="bold">Unsellable Consumer Novelty</text>
            </g>
          </g>

          {/* Stickman shopper shocked */}
          <DoodleStickman
            x={340}
            y={520}
            scale={1.3}
            shirtColor="#F59E0B"
            expression="shocked"
            pose="idle"
            pupilDirection="center"
          />
        </IndustrialDairyEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 22 (2059..2180, dur 121f): "...that already do the job at scale." */}
      {/* ================================================================ */}
      <Sequence from={2059} durationInFrames={121}>
        <FarmPastureEnv showBarn={true} showFence={true}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          {/* Majestic Dairy Cow with Milk Overflowing */}
          <DoodleCow x={1180} y={540} scale={1.3} mood="proud" />
          <MilkCanister x={1520} y={650} scale={1.2} isOverflowing={true} />

          {/* Happy Stickman Petting Cow */}
          <DoodleStickman
            x={580}
            y={520}
            scale={1.35}
            shirtColor="#FFFFFF"
            expression="grin"
            pose="waving"
            pupilDirection="center"
          />

          <StoryBadge text="COWS: THE UNRIVALED DAIRY CHAMPION" x={960} y={120} bgColor="#0F172A" textColor="#38BDF8" fontSize={34} />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 23 (2180..2282, dur 102f): "There's simply no reason to make the switch." (Part 1) */}
      {/* ================================================================ */}
      <Sequence from={2180} durationInFrames={102}>
        <FarmPastureEnv showBarn={false} showFence={false}>
          <SfxTrigger sound="camera_shutter" volume={0.6} startFrame={5} />

          {/* Split Podium: Cow vs Pig Roles */}
          <g transform="translate(960, 360)">
            <rect x={-520} y={-180} width={1040} height={360} rx={24} fill="#0F172A" stroke="#FFFFFF" strokeWidth={5} />
            <text x={0} y={-120} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontWeight="900">
              DIVISION OF ANIMAL ROLES
            </text>

            <g transform="translate(-260, 20)">
              <rect x={-200} y={-80} width={400} height={180} rx={16} fill="#065F46" stroke="#34D399" strokeWidth={3} />
              <text x={0} y={-40} textAnchor="middle" fill="#A7F3D0" fontSize={26} fontWeight="900">🐮 THE DAIRY QUEEN</text>
              <text x={0} y={5} textAnchor="middle" fill="#FFFFFF" fontSize={20}>40L Daily Milk Yield</text>
              <text x={0} y={35} textAnchor="middle" fill="#FFFFFF" fontSize={20}>Infinite Cheese & Butter</text>
              <text x={0} y={65} textAnchor="middle" fill="#FDE047" fontSize={22} fontWeight="900">ROLE: 100% DAIRY</text>
            </g>

            <g transform="translate(260, 20)">
              <rect x={-200} y={-80} width={400} height={180} rx={16} fill="#831843" stroke="#F472B6" strokeWidth={3} />
              <text x={0} y={-40} textAnchor="middle" fill="#FBCFE8" fontSize={26} fontWeight="900">🐷 THE MEAT ENGINE</text>
              <text x={0} y={5} textAnchor="middle" fill="#FFFFFF" fontSize={20}>Fastest Growth in Kingdom</text>
              <text x={0} y={35} textAnchor="middle" fill="#FFFFFF" fontSize={20}>Omnivore Garbage Recycler</text>
              <text x={0} y={65} textAnchor="middle" fill="#FDE047" fontSize={22} fontWeight="900">ROLE: 100% MEAT</text>
            </g>
          </g>

          <DoodleStickman
            x={220}
            y={620}
            scale={1.2}
            shirtColor="#FFFFFF"
            expression="smile"
            pose="idle"
            pupilDirection="center"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 24a (2282..2378, dur 96f): "There's simply no reason to make the switch." (Part 2 - Cow & Pig Side by Side) */}
      {/* ================================================================ */}
      <Sequence from={2282} durationInFrames={96}>
        <FarmPastureEnv showBarn={true} showFence={true}>
          <SfxTrigger sound="pop" volume={0.6} startFrame={5} />

          <DoodleCow x={700} y={560} scale={1.15} mood="proud" />
          <DoodlePig x={1350} y={580} scale={1.05} pose="standing" mood="eating" />

          <StoryBadge text="PERFECT EVOLUTIONARY HARMONY" x={960} y={120} bgColor="#0F172A" textColor="#34D399" fontSize={34} />

          <DoodleStickman
            x={1020}
            y={520}
            scale={1.25}
            shirtColor="#38BDF8"
            expression="grin"
            pose="waving"
            pupilDirection="center"
          />
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 24b (2378..2456, dur 78f): Finale Punch / Sipping Drink "No Reason To Switch" */}
      {/* ================================================================ */}
      <Sequence from={2378} durationInFrames={78}>
        <ChemistryLabEnv wallColor="#0F172A" benchColor="#334155" showBlackboard={false}>
          <SfxTrigger sound="camera_shutter" volume={0.6} startFrame={5} />

          {/* Stickman enjoying fresh cold glass of cow milk */}
          <DoodleStickman
            x={960}
            y={480}
            scale={1.45}
            shirtColor="#FFFFFF"
            expression="smile"
            pose="sipping_drink"
            pupilDirection="center"
          />

          <StoryBadge text="NO REASON TO SWITCH." x={960} y={140} bgColor="#DC2626" textColor="#FFFFFF" fontSize={38} />
          <StoryBadge text="STURDY COWS RUN THE WORLD" x={960} y={880} bgColor="#0F172A" textColor="#38BDF8" fontSize={28} />
        </ChemistryLabEnv>
      </Sequence>
    </div>
  );
};
