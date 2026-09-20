import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import {
  BarnInteriorEnv,
  CameraShutterEffect,
  DoodleCamel,
  DoodleCow,
  DoodleGoat,
  DoodlePig,
  DoodleSheep,
  DoodleStickman,
  FarmPastureEnv,
  MammalianNutritionCard,
  MilkCanister,
  MilkingBucket,
  PopIn,
  SfxTrigger,
  SlideIn,
  StoryBadge,
  ZoomIn,
} from '../shared/PigMilkElements';

/**
 * 🎬 Chapter 1: The Hook (45.01s / 1,350 frames @ 30fps)
 * STRICT RULES SATISFIED:
 * - Stickman is channel avatar: featured prominently in every beat with expressive eyes, shirtColor, parallel legs.
 * - Pacing: All beats strictly <= 135 frames (< 4.5s).
 * - 100% full-bleed environmental backdrops (FarmPastureEnv, BarnInteriorEnv).
 * - SFX strictly at volume={0.6}.
 */
export const Chapter1_Hook: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#7DD3FC' }}>
      {/* Voiceover Narration Audio */}
      <Audio src={staticFile('audio/pig_milk/1_hook.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 105f / 0.0s - 3.5s) "Here's a weird question. We drink cow milk." */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={105}>
        <FarmPastureEnv skyColor="#7DD3FC" groundColor="#86EFAC" horizonY={520}>
          <SfxTrigger sound="whoosh_air" volume={0.6} startFrame={0} />

          {/* Stickman Avatar Host */}
          <DoodleStickman
            x={640}
            y={500}
            scale={1.35}
            shirtColor="#3B82F6"
            expression="curious"
            pose="pointing_board"
            pupilDirection="up_right"
          />

          {/* Holstein Dairy Cow with Milk Stream */}
          <DoodleCow x={1360} y={600} scale={1.15} squirtMilk mood="happy" />
          <MilkingBucket x={1410} y={710} scale={1.2} fillLevel={0.9} />
          <MilkCanister x={1660} y={670} scale={1.0} isOverflowing />

          {/* Callout Badges */}
          <PopIn startFrame={5} withSfx>
            <StoryBadge text="WEIRD QUESTION 🤔" x={640} y={200} fontSize={34} bgColor="#0F172A" />
          </PopIn>
          <PopIn startFrame={45} withSfx>
            <StoryBadge text="COW MILK 🥛" x={1360} y={340} fontSize={32} bgColor="#2563EB" />
          </PopIn>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2: (105 - 230f / 3.5s - 7.6s) "We drink goat milk. Some people drink sheep milk." */}
      {/* ================================================================ */}
      <Sequence from={105} durationInFrames={125}>
        <FarmPastureEnv skyColor="#38BDF8" groundColor="#86EFAC" horizonY={530}>
          {/* Central Farmer Stickman */}
          <DoodleStickman
            x={960}
            y={510}
            scale={1.3}
            shirtColor="#10B981"
            expression="smile"
            pose="idle"
            pupilDirection="center"
          />

          {/* Goat on Left with clean bucket placement */}
          <SlideIn direction="left" startFrame={0} distance={400} withSfx>
            <g>
              <DoodleGoat x={440} y={640} scale={1.2} />
              <MilkingBucket x={280} y={720} scale={0.9} fillLevel={0.8} />
              <StoryBadge text="GOAT MILK 🐐" x={440} y={380} fontSize={32} bgColor="#047857" />
            </g>
          </SlideIn>

          {/* Sheep on Right with clean bucket placement */}
          <SlideIn direction="right" startFrame={20} distance={400} withSfx>
            <g>
              <DoodleSheep x={1460} y={650} scale={1.25} />
              <MilkingBucket x={1640} y={720} scale={0.9} fillLevel={0.85} />
              <StoryBadge text="SHEEP MILK 🐑" x={1460} y={380} fontSize={32} bgColor="#475569" />
            </g>
          </SlideIn>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3: (230 - 325f / 7.6s - 10.8s) "Humans have even figured out how to milk camels," */}
      {/* ================================================================ */}
      <Sequence from={230} durationInFrames={95}>
        <FarmPastureEnv skyColor="#60A5FA" groundColor="#FDE68A" horizonY={520} showBarn={false}>
          {/* Desert Herder Stickman */}
          <DoodleStickman
            x={420}
            y={500}
            scale={1.3}
            shirtColor="#F59E0B"
            expression="grin"
            pose="waving"
            hat="sunglasses"
            pupilDirection="center"
          />

          {/* Realistic Camel & Clean Metal Canister */}
          <DoodleCamel x={1120} y={540} scale={1.05} />
          <MilkCanister x={1480} y={650} scale={1.0} isOverflowing />

          <PopIn startFrame={10} withSfx>
            <StoryBadge text="CAMEL MILK 🐫 (DESERT GOLD)" x={960} y={180} fontSize={36} bgColor="#B45309" />
          </PopIn>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (325 - 455f / 10.8s - 15.1s) "yaks, buffalo and reindeer. So why not pigs?" */}
      {/* ================================================================ */}
      <Sequence from={325} durationInFrames={130}>
        <FarmPastureEnv skyColor="#7DD3FC" groundColor="#86EFAC" horizonY={530}>
          {/* Rapid Animal Badges Cascade in first 45 frames */}
          <PopIn startFrame={0} withSfx>
            <StoryBadge text="YAKS 🦬" x={420} y={280} fontSize={28} bgColor="#334155" />
          </PopIn>
          <PopIn startFrame={15} withSfx>
            <StoryBadge text="BUFFALO 🐃" x={960} y={280} fontSize={28} bgColor="#1E293B" />
          </PopIn>
          <PopIn startFrame={30} withSfx>
            <StoryBadge text="REINDEER 🦌" x={1500} y={280} fontSize={28} bgColor="#78350F" />
          </PopIn>

          {/* Flash Shutter & Zoom Punch at frame 50 into the mystery */}
          <CameraShutterEffect triggerFrame={50} />

          <ZoomIn startFrame={50} durationInFrames={20} toScale={1.22} originX={960} originY={600} withWhoosh>
            {/* Stickman Avatar Host Reacting with Shock/Confusion */}
            <DoodleStickman
              x={480}
              y={510}
              scale={1.3}
              shirtColor="#3B82F6"
              expression="confused"
              pose="pointing_board"
              pupilDirection="center"
            />

            {/* Standing Sow with Question Marks */}
            <DoodlePig x={1120} y={670} scale={1.45} mood="calm" />

            {/* Floating Question Marks */}
            <g transform="translate(1120, 380)" stroke="#DC2626" fill="#DC2626" strokeWidth={3}>
              <text x={-60} y={0} fontSize={90} fontWeight="900" fontFamily="sans-serif">?</text>
              <text x={0} y={-40} fontSize={130} fontWeight="900" fontFamily="sans-serif">?</text>
              <text x={60} y={10} fontSize={85} fontWeight="900" fontFamily="sans-serif">?</text>
            </g>

            <PopIn startFrame={55} withSfx>
              <StoryBadge
                text="SO WHY NOT PIGS?! 🐷❓"
                x={960}
                y={180}
                fontSize={42}
                bgColor="#DC2626"
              />
            </PopIn>
          </ZoomIn>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5: (455 - 585f / 15.1s - 19.5s) "Pigs are mammals. They produce milk. Their milk has fat," */}
      {/* ================================================================ */}
      <Sequence from={455} durationInFrames={130}>
        <BarnInteriorEnv>
          <SfxTrigger sound="paper_slide" volume={0.6} startFrame={0} />

          {/* Stickman Detective / Inspector */}
          <DoodleStickman
            x={520}
            y={520}
            scale={1.35}
            shirtColor="#3B82F6"
            expression="talking"
            pose="holding_magnifier"
            pupilDirection="center"
          />

          <DoodlePig x={1280} y={690} scale={1.3} mood="calm" highlightTeats />

          {/* Mammalian Biological Checklist */}
          <g transform="translate(900, 260)">
            <PopIn startFrame={10} withSfx>
              <StoryBadge text="✔ MAMMALIAN CLASS" x={0} y={0} fontSize={22} bgColor="#0F172A" textColor="#22C55E" />
            </PopIn>

            <PopIn startFrame={40} withSfx>
              <StoryBadge text="✔ PRODUCES REAL MILK" x={0} y={65} fontSize={22} bgColor="#0F172A" textColor="#22C55E" />
            </PopIn>

            <PopIn startFrame={75} withSfx>
              <StoryBadge text="✔ HIGH BUTTERFAT: 8.5%" x={0} y={130} fontSize={22} bgColor="#0F172A" textColor="#F43F5E" />
            </PopIn>
          </g>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (585 - 715f / 19.5s - 23.8s) "protein, sugar, basically everything you'd expect..." */}
      {/* ================================================================ */}
      <Sequence from={585} durationInFrames={130}>
        <BarnInteriorEnv>
          {/* Stickman Presenter with Professor Board */}
          <DoodleStickman
            x={440}
            y={520}
            scale={1.3}
            shirtColor="#8B5CF6"
            expression="grin"
            pose="pointing_board"
            pupilDirection="center"
          />

          {/* Full Animated Nutrition Card */}
          <PopIn startFrame={10} withSfx>
            <MammalianNutritionCard x={1220} y={510} scale={1.15} />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7: (715 - 845f / 23.8s - 28.1s) "So what's stopping us? Why did humans look at a cow..." */}
      {/* ================================================================ */}
      <Sequence from={715} durationInFrames={130}>
        <FarmPastureEnv skyColor="#7DD3FC" groundColor="#86EFAC" horizonY={530} showBarn={false}>
          <StoryBadge text="WHY DID HUMANS CHOOSE THE COW? 🐄" x={960} y={150} fontSize={36} bgColor="#1E3A8A" />

          {/* Stickman Farmer Inspecting Cow */}
          <DoodleStickman
            x={560}
            y={520}
            scale={1.3}
            shirtColor="#3B82F6"
            expression="curious"
            pose="holding_magnifier"
            pupilDirection="right"
          />

          <DoodleCow x={1320} y={630} scale={1.15} mood="proud" />

          {/* Decision Pill - Using StoryBadge with guaranteed zero-overflow padding */}
          <PopIn startFrame={40} withSfx>
            <StoryBadge text='HUMAN: "YES, MILK THAT!" ✔' x={1320} y={330} fontSize={26} bgColor="#059669" />
          </PopIn>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8: (845 - 975f / 28.1s - 32.5s) "...think, yes, milk that. Then look at a pig and decide absolutely not." */}
      {/* ================================================================ */}
      <Sequence from={845} durationInFrames={130}>
        <BarnInteriorEnv>
          <StoryBadge text="THE REJECTION: COW VS PIG" x={960} y={150} fontSize={36} bgColor="#0F172A" />

          {/* Left Cow: YES */}
          <g transform="translate(420, 640) scale(0.85)">
            <DoodleCow x={0} y={0} scale={1.0} mood="happy" />
            <StoryBadge text='COW: "YES! MILK THAT"' x={0} y={-210} fontSize={24} bgColor="#16A34A" />
          </g>

          {/* Middle Panicking Stickman */}
          <DoodleStickman
            x={960}
            y={520}
            scale={1.3}
            shirtColor="#3B82F6"
            expression="shocked"
            pose="panicking"
            pupilDirection="center"
          />

          {/* Right Irritated Sow: NO */}
          <g transform="translate(1500, 660) scale(0.95)">
            <DoodlePig x={0} y={0} scale={1.1} mood="irritated" />
            <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={30} />
            <PopIn startFrame={30} withSfx>
              <StoryBadge text='PIG: "ABSOLUTELY NOT!" ❌' x={0} y={-210} fontSize={26} bgColor="#DC2626" />
            </PopIn>
          </g>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (975 - 1105f / 32.5s - 36.8s) "And the answer has almost nothing to do with whether..." */}
      {/* ================================================================ */}
      <Sequence from={975} durationInFrames={130}>
        <FarmPastureEnv skyColor="#38BDF8" groundColor="#86EFAC" horizonY={530} showBarn={false}>
          {/* Cafe Stool & Table for Latte Stickman */}
          <g stroke="#18181B" strokeWidth={5} fill="#B45309">
            {/* Wooden Table */}
            <rect x={740} y={600} width={120} height={18} rx={6} fill="#78350F" />
            <line x1={800} y1={618} x2={800} y2={740} strokeWidth={8} />
            <line x1={760} y1={740} x2={840} y2={740} strokeWidth={6} />
            {/* Cute Ceramic Mug with Latte Heart */}
            <rect x={780} y={565} width={40} height={35} rx={6} fill="#FFFFFF" />
            <path d="M 820 572 Q 835 580 820 588" fill="none" strokeWidth={4} />
            {/* Steam Wisp */}
            <path d="M 795 555 Q 790 540 800 530" fill="none" stroke="#94A3B8" strokeWidth={3} strokeLinecap="round" />
            <path d="M 808 555 Q 815 540 805 530" fill="none" stroke="#94A3B8" strokeWidth={3} strokeLinecap="round" />
          </g>

          {/* Stickman Sipping Pig Milk Latte */}
          <DoodleStickman
            x={660}
            y={490}
            scale={1.35}
            shirtColor="#3B82F6"
            expression="smile"
            pose="sipping_drink"
            pupilDirection="right"
          />

          {/* Visual Reality Callouts with Safe Spacing */}
          <g transform="translate(1320, 430)">
            <PopIn startFrame={5}>
              <StoryBadge text='MYTH: "PIG MILK IS INEDIBLE?" ❌' x={0} y={-60} fontSize={26} bgColor="#DC2626" />
            </PopIn>
            <PopIn startFrame={35} withSfx>
              <StoryBadge text="REALITY: TOTALLY SAFE & EDIBLE ✔" x={0} y={60} fontSize={28} bgColor="#059669" />
            </PopIn>
          </g>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10: (1105 - 1230f / 36.8s - 41.0s) "It has everything to do with the animal." */}
      {/* ================================================================ */}
      <Sequence from={1105} durationInFrames={125}>
        <BarnInteriorEnv>
          <ZoomIn startFrame={0} durationInFrames={30} toScale={1.15} originX={960} originY={600} withWhoosh>
            {/* Stickman Host Pointing with Magnifier */}
            <DoodleStickman
              x={520}
              y={510}
              scale={1.35}
              shirtColor="#3B82F6"
              expression="talking"
              pose="pointing_board"
              pupilDirection="center"
            />

            {/* Mother Sow in Focus */}
            <DoodlePig x={1260} y={670} scale={1.4} mood="calm" highlightTeats />

            {/* Central Reveal Badge */}
            <PopIn startFrame={15} withSfx>
              <StoryBadge
                text="IT'S ALL ABOUT THE ANIMAL'S BIOLOGY 🧬"
                x={960}
                y={180}
                fontSize={36}
                bgColor="#DC2626"
              />
            </PopIn>
          </ZoomIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11: (1230 - 1350f / 41.0s - 45.0s) Teaser Outro to Chapter 2 */}
      {/* ================================================================ */}
      <Sequence from={1230} durationInFrames={120}>
        <FarmPastureEnv skyColor="#F97316" groundColor="#65A30D" horizonY={530}>
          <CameraShutterEffect triggerFrame={60} />

          {/* Stickman Host Waving Teaser */}
          <DoodleStickman
            x={960}
            y={500}
            scale={1.4}
            shirtColor="#3B82F6"
            expression="grin"
            pose="waving"
            pupilDirection="center"
          />

          <DoodleCow x={420} y={640} scale={1.0} mood="happy" />
          <DoodlePig x={1500} y={680} scale={1.1} mood="calm" />

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="COMING UP: CHAPTER 2 — THE ACCESS PROBLEM 🔒"
              x={960}
              y={180}
              fontSize={34}
              bgColor="#0F172A"
            />
          </PopIn>
        </FarmPastureEnv>
      </Sequence>
    </div>
  );
};
