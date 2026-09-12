import React from 'react';
import { Audio, Sequence, staticFile, useCurrentFrame } from 'remotion';
import {
  BarnInteriorEnv,
  CameraShutterEffect,
  CisternComparisonCard,
  CountdownTimer15s,
  DoodleCow,
  DoodlePig,
  DoodlePiglet,
  DoodleStickman,
  FarmPastureEnv,
  MilkCanister,
  MilkingBucket,
  OxytocinSurgeInfographic,
  PopIn,
  SfxTrigger,
  SlideIn,
  StoryBadge,
  ZoomIn,
} from '../shared/PigMilkElements';

/**
 * 🎬 Chapter 2: The Access Problem (78.76s / 2,363 frames @ 30fps)
 * STRICT RULES SATISFIED:
 * - Stickman is channel avatar: featured prominently with expressive eyes, shirtColor, parallel legs.
 * - Pacing: Every single Sequence beat is strictly <= 135 frames (< 4.5s).
 * - 100% full-bleed environmental backdrops (FarmPastureEnv, BarnInteriorEnv).
 * - Cow udder cistern vs. Sow 14 small teats running along underbelly.
 * - Mother sow lying down with cute piglets nursing and attacking supply at once.
 * - Farmer stickman trying to milk sow with bucket, sow gets irritated with angry brow.
 * - 15-second letdown countdown timer and oxytocin surge infographic.
 * - SFX strictly at volume={0.6}.
 */
export const Chapter2_Access: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <div style={{ width: 1920, height: 1080, position: 'relative', overflow: 'hidden', backgroundColor: '#7DD3FC' }}>
      {/* Chapter 2 Voiceover Narration Audio */}
      <Audio src={staticFile('audio/pig_milk/2_access.mp3')} volume={1.0} />

      {/* ================================================================ */}
      {/* BEAT 1: (0 - 126f / 0.0s - 4.2s) "First, pigs absolutely produce milk." */}
      {/* ================================================================ */}
      <Sequence from={0} durationInFrames={126}>
        <FarmPastureEnv skyColor="#7DD3FC" groundColor="#86EFAC" horizonY={530}>
          <SfxTrigger sound="whoosh_air" volume={0.6} startFrame={0} />

          {/* Stickman Avatar Host Presenting */}
          <DoodleStickman
            x={620}
            y={500}
            scale={1.35}
            shirtColor="#3B82F6"
            expression="talking"
            pose="waving"
            pupilDirection="center"
          />

          <DoodlePig x={1320} y={660} scale={1.35} mood="calm" />

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="FACT: PIGS PRODUCE TONS OF MILK 🥛"
              x={960}
              y={180}
              fontSize={36}
              bgColor="#0F172A"
            />
          </PopIn>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2A: (126 - 210f / 4.2s - 7.0s) "A mother pig, a sow, can produce a surprising amount..." */}
      {/* ================================================================ */}
      <Sequence from={126} durationInFrames={84}>
        <BarnInteriorEnv>
          <ZoomIn startFrame={0} durationInFrames={25} toScale={1.15} originX={960} originY={600} withWhoosh>
            {/* Stickman Inspector */}
            <DoodleStickman
              x={480}
              y={520}
              scale={1.3}
              shirtColor="#3B82F6"
              expression="curious"
              pose="holding_magnifier"
              pupilDirection="center"
            />

            {/* Mother Sow Resting */}
            <DoodlePig x={1260} y={670} scale={1.4} mood="calm" pose="nursing_lying" highlightTeats />

            <PopIn startFrame={10} withSfx>
              <StoryBadge
                text="A MOTHER SOW: 400 - 500 KG OF MILK! 📈"
                x={960}
                y={170}
                fontSize={34}
                bgColor="#059669"
              />
            </PopIn>
          </ZoomIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 2B: (210 - 292f / 7.0s - 9.7s) "...for her piglets." */}
      {/* ================================================================ */}
      <Sequence from={210} durationInFrames={82}>
        <BarnInteriorEnv>
          {/* Stickman Smiling at Piglets */}
          <DoodleStickman
            x={440}
            y={520}
            scale={1.3}
            shirtColor="#3B82F6"
            expression="heart_eyes"
            pose="idle"
            pupilDirection="center"
          />

          {/* Sow Nursing */}
          <DoodlePig x={1240} y={670} scale={1.4} mood="calm" pose="nursing_lying" highlightTeats />

          {/* Swarm of Piglets Nursing */}
          <SlideIn direction="bottom" startFrame={5} distance={150} withSfx>
            <g>
              <DoodlePiglet x={1120} y={710} scale={0.7} angle={-15} />
              <DoodlePiglet x={1220} y={725} scale={0.7} angle={-5} />
              <DoodlePiglet x={1320} y={715} scale={0.7} angle={10} />
              <DoodlePiglet x={1420} y={720} scale={0.7} angle={25} />
            </g>
          </SlideIn>

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="10 TO 14 HUNGRY PIGLETS 🐽🍼"
              x={960}
              y={170}
              fontSize={34}
              bgColor="#EC4899"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3A: (292 - 370f / 9.7s - 12.3s) "But there's one enormous problem." */}
      {/* ================================================================ */}
      <Sequence from={292} durationInFrames={78}>
        <BarnInteriorEnv>
          <SfxTrigger sound="whoosh_cinematic" volume={0.6} startFrame={0} />

          {/* Stickman Avatar Shocked */}
          <DoodleStickman
            x={960}
            y={500}
            scale={1.4}
            shirtColor="#3B82F6"
            expression="shocked"
            pose="panicking"
            pupilDirection="center"
          />

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="⚠️ BUT THERE'S ONE ENORMOUS PROBLEM... ⚠️"
              x={960}
              y={180}
              fontSize={38}
              bgColor="#DC2626"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 3B: (370 - 446f / 12.3s - 14.9s) "You can't easily milk her." */}
      {/* ================================================================ */}
      <Sequence from={370} durationInFrames={76}>
        <BarnInteriorEnv>
          {/* Farmer Stickman trying to milk with bucket */}
          <DoodleStickman
            x={640}
            y={540}
            scale={1.25}
            shirtColor="#EA580C"
            expression="sweating"
            pose="holding_brush"
            pupilDirection="center"
          />

          <MilkingBucket x={790} y={740} scale={1.0} fillLevel={0.0} />

          {/* Sow glaring */}
          <DoodlePig x={1280} y={670} scale={1.35} mood="irritated" />

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="YOU CANNOT EASILY MILK A SOW! 🚫"
              x={960}
              y={180}
              fontSize={36}
              bgColor="#DC2626"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 4: (446 - 571f / 14.9s - 19.0s) "That sounds like a small inconvenience. It isn't." */}
      {/* ================================================================ */}
      <Sequence from={446} durationInFrames={125}>
        <BarnInteriorEnv>
          <CameraShutterEffect triggerFrame={40} />

          {/* Stickman Host Explaining the Reality */}
          <DoodleStickman
            x={580}
            y={510}
            scale={1.35}
            shirtColor="#3B82F6"
            expression="confused"
            pose="pointing_board"
            pupilDirection="center"
          />

          {/* Contrast Cards */}
          <g transform="translate(1280, 520)">
            <rect x={-260} y={-130} width={520} height={260} rx={20} fill="#0F172A" stroke="#FFFFFF" strokeWidth={4} />
            <text x={0} y={-70} textAnchor="middle" fill="#94A3B8" fontSize={24} fontWeight="bold">
              SOUNDS LIKE A MINOR NUISANCE?
            </text>
            <text x={0} y={-10} textAnchor="middle" fill="#EF4444" fontSize={38} fontWeight="900">
              IT IS AN IMPOSSIBLE
            </text>
            <text x={0} y={40} textAnchor="middle" fill="#EF4444" fontSize={38} fontWeight="900">
              BIOLOGICAL BARRIER!
            </text>
            <rect x={-180} y={75} width={360} height={36} rx={18} fill="#DC2626" />
            <text x={0} y={100} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontWeight="900">
              PHYSICAL & HORMONAL LOCK 🔒
            </text>
          </g>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5A: (571 - 642f / 19.0s - 21.4s) "Think about how a cow behaves." */}
      {/* ================================================================ */}
      <Sequence from={571} durationInFrames={71}>
        <FarmPastureEnv skyColor="#7DD3FC" groundColor="#86EFAC" horizonY={530}>
          {/* Stickman Farmer Calmly Approaching Cow */}
          <DoodleStickman
            x={560}
            y={520}
            scale={1.3}
            shirtColor="#10B981"
            expression="smile"
            pose="idle"
            pupilDirection="center"
          />

          <DoodleCow x={1320} y={630} scale={1.15} mood="calm" />

          <PopIn startFrame={5} withSfx>
            <StoryBadge
              text="THE DAIRY COW: BUILT TO COOPERATE 🐄"
              x={960}
              y={180}
              fontSize={34}
              bgColor="#1E3A8A"
            />
          </PopIn>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 5B: (642 - 713f / 21.4s - 23.8s) "She has a large udder with four accessible teats." */}
      {/* ================================================================ */}
      <Sequence from={642} durationInFrames={71}>
        <FarmPastureEnv skyColor="#7DD3FC" groundColor="#86EFAC" horizonY={530}>
          <ZoomIn startFrame={0} durationInFrames={20} toScale={1.2} originX={1200} originY={650} withWhoosh>
            {/* Stickman Pointing at Udder */}
            <DoodleStickman
              x={520}
              y={520}
              scale={1.3}
              shirtColor="#3B82F6"
              expression="talking"
              pose="pointing_board"
              pupilDirection="center"
            />

            <DoodleCow x={1260} y={620} scale={1.25} mood="proud" />

            <PopIn startFrame={10} withSfx>
              <StoryBadge
                text="4 LARGE ACCESSIBLE TEATS & CISTERN ✔"
                x={960}
                y={180}
                fontSize={34}
                bgColor="#0284C7"
              />
            </PopIn>
          </ZoomIn>
        </FarmPastureEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 6: (713 - 847f / 23.8s - 28.2s) "You can stand beside her, attach a milking machine..." */}
      {/* ================================================================ */}
      <Sequence from={713} durationInFrames={134}>
        <BarnInteriorEnv>
          {/* Stickman Operating Milker */}
          <DoodleStickman
            x={500}
            y={520}
            scale={1.3}
            shirtColor="#10B981"
            expression="grin"
            pose="idle"
            pupilDirection="center"
          />

          <DoodleCow x={1240} y={640} scale={1.1} squirtMilk mood="happy" />

          {/* Milking Machine Apparatus */}
          <g transform="translate(1320, 690)">
            <MilkingBucket x={0} y={60} scale={1.3} fillLevel={0.95} />
            {/* Pulsing tubes */}
            <path d="M -50 0 Q 0 30 0 60" stroke="#38BDF8" strokeWidth={5} fill="none" strokeDasharray="8 4" />
            <path d="M -20 0 Q 0 30 0 60" stroke="#38BDF8" strokeWidth={5} fill="none" strokeDasharray="8 4" />
            <path d="M 20 0 Q 0 30 0 60" stroke="#38BDF8" strokeWidth={5} fill="none" strokeDasharray="8 4" />
          </g>

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="MILKING MACHINE: ATTACHES IN SECONDS ⚙️"
              x={960}
              y={180}
              fontSize={34}
              bgColor="#0F172A"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7A: (847 - 922f / 28.2s - 30.7s) "...and collect liters of milk." */}
      {/* ================================================================ */}
      <Sequence from={847} durationInFrames={75}>
        <BarnInteriorEnv>
          {/* Stickman Celebrating Milk Harvest */}
          <DoodleStickman
            x={560}
            y={500}
            scale={1.35}
            shirtColor="#3B82F6"
            expression="grin"
            pose="waving"
            pupilDirection="center"
          />

          {/* Huge Overflowing Milk Canister */}
          <MilkCanister x={1280} y={640} scale={1.35} isOverflowing />

          <PopIn startFrame={5} withSfx>
            <StoryBadge
              text="COLLECT 25 - 40 LITERS / DAY! 🌊🥛"
              x={960}
              y={170}
              fontSize={36}
              bgColor="#059669"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 7B: (922 - 997f / 30.7s - 33.2s) "A pig is completely different." */}
      {/* ================================================================ */}
      <Sequence from={922} durationInFrames={75}>
        <BarnInteriorEnv>
          <CameraShutterEffect triggerFrame={10} />

          {/* Stickman Warning Avatar */}
          <DoodleStickman
            x={580}
            y={510}
            scale={1.35}
            shirtColor="#3B82F6"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />

          <DoodlePig x={1320} y={670} scale={1.35} mood="calm" />

          <PopIn startFrame={15} withSfx>
            <StoryBadge
              text="A PIG IS COMPLETELY DIFFERENT ⚡"
              x={960}
              y={180}
              fontSize={36}
              bgColor="#DC2626"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8A: (997 - 1074f / 33.2s - 35.8s) "A sow has a long row of small mammary glands..." */}
      {/* ================================================================ */}
      <Sequence from={997} durationInFrames={77}>
        <BarnInteriorEnv>
          <ZoomIn startFrame={0} durationInFrames={25} toScale={1.18} originX={1100} originY={650} withWhoosh>
            {/* Stickman Biologist */}
            <DoodleStickman
              x={480}
              y={510}
              scale={1.35}
              shirtColor="#3B82F6"
              expression="talking"
              pose="holding_magnifier"
              pupilDirection="center"
            />

            {/* Sow with 14 teats highlighted */}
            <DoodlePig x={1240} y={670} scale={1.4} mood="calm" pose="nursing_lying" highlightTeats />

            <PopIn startFrame={10} withSfx>
              <StoryBadge
                text="14 SMALL MAMMARY GLANDS IN A ROW 🔍"
                x={960}
                y={180}
                fontSize={34}
                bgColor="#BE185D"
              />
            </PopIn>
          </ZoomIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 8B: (1074 - 1150f / 35.8s - 38.3s) "...running along her underside." */}
      {/* ================================================================ */}
      <Sequence from={1074} durationInFrames={76}>
        <BarnInteriorEnv>
          {/* Stickman Host */}
          <DoodleStickman
            x={480}
            y={510}
            scale={1.3}
            shirtColor="#3B82F6"
            expression="curious"
            pose="pointing_board"
            pupilDirection="center"
          />

          <DoodlePig x={1240} y={670} scale={1.4} mood="calm" pose="nursing_lying" highlightTeats />

          {/* Teat numbers 1 to 14 markers */}
          <g transform="translate(1080, 715)">
            <rect x={-40} y={-14} width={280} height={28} rx={14} fill="#0F172A" stroke="#F472B6" strokeWidth={2} />
            <text x={100} y={6} textAnchor="middle" fill="#FFFFFF" fontSize={14} fontWeight="900">
              14 INDEPENDENT OUTLETS (1 TO 14)
            </text>
          </g>

          <PopIn startFrame={5} withSfx>
            <StoryBadge
              text="PARALLEL UNDERBELLY ARCHITECTURE 📐"
              x={960}
              y={180}
              fontSize={34}
              bgColor="#0F172A"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 9: (1150 - 1268f / 38.3s - 42.3s) "Not one stored cistern, but many small outlets." */}
      {/* ================================================================ */}
      <Sequence from={1150} durationInFrames={118}>
        <BarnInteriorEnv>
          {/* Split Cross-Section Anatomical Card */}
          <PopIn startFrame={5} withSfx>
            <CisternComparisonCard x={960} y={510} scale={1.12} />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10A: (1268 - 1338f / 42.3s - 44.6s) "And here's the key part." */}
      {/* ================================================================ */}
      <Sequence from={1268} durationInFrames={70}>
        <BarnInteriorEnv>
          <SfxTrigger sound="pop" volume={0.6} startFrame={0} />

          {/* Stickman Leaning In */}
          <DoodleStickman
            x={960}
            y={490}
            scale={1.45}
            shirtColor="#3B82F6"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="💡 AND HERE IS THE CRITICAL KEY PART... 💡"
              x={960}
              y={180}
              fontSize={38}
              bgColor="#F59E0B"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 10B: (1338 - 1407f / 44.6s - 46.9s) "The milk isn't just sitting there waiting for you." */}
      {/* ================================================================ */}
      <Sequence from={1338} durationInFrames={69}>
        <BarnInteriorEnv>
          {/* Farmer Frustrated with Zero Milk */}
          <DoodleStickman
            x={600}
            y={520}
            scale={1.3}
            shirtColor="#EA580C"
            expression="sweating"
            pose="panicking"
            pupilDirection="center"
          />

          <MilkingBucket x={760} y={730} scale={1.0} fillLevel={0.0} />

          <DoodlePig x={1260} y={670} scale={1.35} mood="calm" />

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="THE MILK IS NOT WAITING FOR YOU! 0 DROPS 🚫"
              x={960}
              y={180}
              fontSize={34}
              bgColor="#DC2626"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 11: (1407 - 1519f / 46.9s - 50.6s) "Piglets trigger the release by nursing." */}
      {/* ================================================================ */}
      <Sequence from={1407} durationInFrames={112}>
        <BarnInteriorEnv>
          {/* Stickman Avatar Observing */}
          <DoodleStickman
            x={420}
            y={510}
            scale={1.3}
            shirtColor="#3B82F6"
            expression="curious"
            pose="holding_magnifier"
            pupilDirection="center"
          />

          <DoodlePig x={1220} y={670} scale={1.4} mood="calm" pose="nursing_lying" highlightTeats />

          {/* Massaging Piglets */}
          <SlideIn direction="bottom" startFrame={0} distance={120} withSfx>
            <g>
              <DoodlePiglet x={1080} y={700} scale={0.65} angle={-20} />
              <DoodlePiglet x={1170} y={715} scale={0.65} angle={-10} />
              <DoodlePiglet x={1260} y={720} scale={0.65} angle={5} />
              <DoodlePiglet x={1350} y={715} scale={0.65} angle={15} />
              <DoodlePiglet x={1440} y={700} scale={0.65} angle={30} />
            </g>
          </SlideIn>

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="PIGLETS TRIGGER RELEASE VIA TEAT MASSAGE 🐾"
              x={960}
              y={180}
              fontSize={34}
              bgColor="#BE185D"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 12: (1519 - 1645f / 50.6s - 54.8s) "They stimulate the teats and the sow lets down milk..." */}
      {/* ================================================================ */}
      <Sequence from={1519} durationInFrames={126}>
        <BarnInteriorEnv>
          {/* Stickman Endocrinologist */}
          <DoodleStickman
            x={400}
            y={520}
            scale={1.3}
            shirtColor="#8B5CF6"
            expression="grin"
            pose="pointing_board"
            pupilDirection="center"
          />

          {/* Oxytocin Surge Graph */}
          <PopIn startFrame={10} withSfx>
            <OxytocinSurgeInfographic x={1180} y={510} scale={1.2} />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13A: (1645 - 1725f / 54.8s - 57.5s) "...in short, rapid bursts." */}
      {/* ================================================================ */}
      <Sequence from={1645} durationInFrames={80}>
        <BarnInteriorEnv>
          {/* Stickman Pointing at Timer */}
          <DoodleStickman
            x={480}
            y={520}
            scale={1.35}
            shirtColor="#3B82F6"
            expression="shocked"
            pose="pointing_board"
            pupilDirection="center"
          />

          {/* 15-Second Letdown Timer */}
          <CountdownTimer15s x={1260} y={520} scale={1.35} initialSeconds={15} />

          <PopIn startFrame={5} withSfx>
            <StoryBadge
              text="THE 15-SECOND RAPID BURST! ⏱️💥"
              x={960}
              y={170}
              fontSize={38}
              bgColor="#DC2626"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 13B: (1725 - 1805f / 57.5s - 60.2s) "The whole system is built around one thing." */}
      {/* ================================================================ */}
      <Sequence from={1725} durationInFrames={80}>
        <BarnInteriorEnv>
          <CameraShutterEffect triggerFrame={20} />

          {/* Stickman Avatar in Center */}
          <DoodleStickman
            x={960}
            y={500}
            scale={1.4}
            shirtColor="#3B82F6"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="THE ENTIRE SYSTEM IS BUILT AROUND ONE THING 🎯"
              x={960}
              y={180}
              fontSize={36}
              bgColor="#0F172A"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 14: (1805 - 1930f / 60.2s - 64.3s) "A litter of hungry piglets attacking the supply at once." */}
      {/* ================================================================ */}
      <Sequence from={1805} durationInFrames={125}>
        <BarnInteriorEnv>
          {/* Stickman Avatar Marveling */}
          <DoodleStickman
            x={380}
            y={520}
            scale={1.3}
            shirtColor="#3B82F6"
            expression="shocked"
            pose="idle"
            pupilDirection="center"
          />

          <DoodlePig x={1200} y={670} scale={1.4} mood="calm" pose="nursing_lying" highlightTeats />

          {/* Frenzied Piglet Squad */}
          <g>
            <DoodlePiglet x={1040} y={700} scale={0.7} angle={-25} />
            <DoodlePiglet x={1120} y={715} scale={0.7} angle={-15} />
            <DoodlePiglet x={1200} y={720} scale={0.7} angle={-5} />
            <DoodlePiglet x={1280} y={720} scale={0.7} angle={8} />
            <DoodlePiglet x={1360} y={715} scale={0.7} angle={20} />
            <DoodlePiglet x={1440} y={700} scale={0.7} angle={30} />
          </g>

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="12 HUNGRY PIGLETS SUCKLING AT ONCE! 🐷⚡"
              x={960}
              y={180}
              fontSize={36}
              bgColor="#EC4899"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 15: (1930 - 2044f / 64.3s - 68.1s) "Not a human standing beside her with a bucket." */}
      {/* ================================================================ */}
      <Sequence from={1930} durationInFrames={114}>
        <BarnInteriorEnv>
          {/* Irritated Sow Glaring at Farmer */}
          <DoodlePig x={1320} y={660} scale={1.4} mood="irritated" />

          {/* Farmer Stickman Knocked Back in Panic */}
          <DoodleStickman
            x={600}
            y={520}
            scale={1.35}
            shirtColor="#EA580C"
            expression="sweating"
            pose="panicking"
            pupilDirection="center"
          />

          <MilkingBucket x={750} y={740} scale={1.0} fillLevel={0.0} />

          <SfxTrigger sound="subtle_hit" volume={0.6} startFrame={15} />

          <PopIn startFrame={15} withSfx>
            <g transform="translate(960, 180)">
              <StoryBadge
                text="NOT A HUMAN STANDING BESIDE HER! 🪣❌"
                x={0}
                y={0}
                fontSize={36}
                bgColor="#DC2626"
              />
            </g>
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 16: (2044 - 2146f / 68.1s - 71.5s) "Piglets compete for teats, established positions..." */}
      {/* ================================================================ */}
      <Sequence from={2044} durationInFrames={102}>
        <BarnInteriorEnv>
          {/* Stickman Pointing to Competition Hierarchy */}
          <DoodleStickman
            x={440}
            y={520}
            scale={1.3}
            shirtColor="#3B82F6"
            expression="talking"
            pose="pointing_board"
            pupilDirection="center"
          />

          <DoodlePig x={1240} y={670} scale={1.35} mood="calm" pose="nursing_lying" highlightTeats />

          {/* Teat Position Badges */}
          <PopIn startFrame={10} withSfx>
            <g transform="translate(1080, 500)">
              <rect x={-140} y={-20} width={280} height={40} rx={20} fill="#F59E0B" />
              <text x={0} y={6} textAnchor="middle" fill="#000000" fontSize={16} fontWeight="900">
                #1 ANTERIOR TEAT (CHAMPION) 🏆
              </text>
            </g>
          </PopIn>

          <PopIn startFrame={30} withSfx>
            <g transform="translate(1420, 500)">
              <rect x={-140} y={-20} width={280} height={40} rx={20} fill="#94A3B8" />
              <text x={0} y={6} textAnchor="middle" fill="#000000" fontSize={16} fontWeight="900">
                #14 POSTERIOR TEAT (RUNT)
              </text>
            </g>
          </PopIn>

          <StoryBadge
            text="PIGLETS FIGHT FOR FIXED TEAT POSITIONS ⚔️"
            x={960}
            y={180}
            fontSize={34}
            bgColor="#0F172A"
          />
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 17A: (2146 - 2214f / 71.5s - 73.8s) "...and the sow releases milk in brief windows." */}
      {/* ================================================================ */}
      <Sequence from={2146} durationInFrames={68}>
        <BarnInteriorEnv>
          <CountdownTimer15s x={1260} y={520} scale={1.35} initialSeconds={4} />

          {/* Stickman Host Highlighting Timing */}
          <DoodleStickman
            x={520}
            y={510}
            scale={1.35}
            shirtColor="#3B82F6"
            expression="confused"
            pose="pointing_board"
            pupilDirection="center"
          />

          <PopIn startFrame={5} withSfx>
            <StoryBadge
              text="15-SECOND WINDOW ONLY EVERY HOUR! ⏳"
              x={960}
              y={180}
              fontSize={36}
              bgColor="#DC2626"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 17B: (2214 - 2282f / 73.8s - 76.1s) "For a farmer trying to collect it," */}
      {/* ================================================================ */}
      <Sequence from={2214} durationInFrames={68}>
        <BarnInteriorEnv>
          {/* Farmer Entangled in 14 Suction Tubes */}
          <DoodleStickman
            x={960}
            y={500}
            scale={1.35}
            shirtColor="#EA580C"
            expression="sweating"
            pose="panicking"
            pupilDirection="center"
          />

          {/* 14 tangled wires / tubes surrounding farmer */}
          <g stroke="#38BDF8" strokeWidth={5} fill="none" opacity={0.8}>
            <path d="M 700 680 Q 850 500 960 620 T 1200 680" />
            <path d="M 750 720 Q 960 460 1150 720" />
            <path d="M 800 650 Q 960 550 1100 650" />
          </g>

          <PopIn startFrame={5} withSfx>
            <StoryBadge
              text="ATTACH 14 CUPS IN 15 SECONDS?! 🤯"
              x={960}
              y={180}
              fontSize={36}
              bgColor="#0F172A"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>

      {/* ================================================================ */}
      {/* BEAT 18: (2282 - 2363f / 76.1s - 78.8s) "...that's a nightmare." */}
      {/* ================================================================ */}
      <Sequence from={2282} durationInFrames={81}>
        <BarnInteriorEnv>
          <CameraShutterEffect triggerFrame={10} />

          {/* Stickman Exhausted Host */}
          <DoodleStickman
            x={960}
            y={510}
            scale={1.4}
            shirtColor="#3B82F6"
            expression="sweating"
            pose="wiping_sweat"
            pupilDirection="center"
          />

          <PopIn startFrame={10} withSfx>
            <StoryBadge
              text="THAT IS AN ABSOLUTE NIGHTMARE! 😱💀"
              x={960}
              y={180}
              fontSize={40}
              bgColor="#DC2626"
            />
          </PopIn>

          <PopIn startFrame={45} withSfx>
            <StoryBadge
              text="NEXT: CHAPTER 3 — THE QUANTITY PROBLEM 📉"
              x={960}
              y={880}
              fontSize={28}
              bgColor="#0F172A"
            />
          </PopIn>
        </BarnInteriorEnv>
      </Sequence>
    </div>
  );
};
