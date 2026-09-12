import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import {
  DoodleSun,
  DoodleWhiteHouse,
  DoodleSparkle,
  DOODLE_STROKE,
  DOODLE_WIDTH,
} from '../DoodleElements';

export const Scene03_WhiteVillage: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Hillside village pop-in
  const popSpring = spring({ frame, fps, config: { damping: 12, stiffness: 160 } });

  return (
    <DoodlePaper cameraZoom={[1.0, 1.07]} cameraPanY={[0, -20]}>
      {/* Blazing Sun */}
      <DoodleSun x={1600} y={190} size={150} pulse={true} />

      {/* Hillside Ground Contour */}
      <path
        d="M -100 850 Q 500 720 1000 680 Q 1500 640 2100 720 L 2100 1200 L -100 1200 Z"
        fill="#FDE68A"
        stroke={DOODLE_STROKE}
        strokeWidth={DOODLE_WIDTH}
      />

      {/* Clustered Mediterranean Houses */}
      <g transform={`scale(${popSpring})`} style={{ transformOrigin: '960px 650px' }}>
        {/* Background higher houses */}
        <DoodleWhiteHouse x={700} y={540} scale={1.1} dome={false} />
        <DoodleWhiteHouse x={1220} y={510} scale={1.2} dome={true} />
        <DoodleWhiteHouse x={960} y={460} scale={1.3} dome={true} />

        {/* Foreground prominent houses */}
        <DoodleWhiteHouse x={520} y={690} scale={1.5} dome={true} />
        <DoodleWhiteHouse x={960} y={670} scale={1.6} dome={false} />
        <DoodleWhiteHouse x={1420} y={680} scale={1.45} dome={true} />

        {/* Stone Pathways & Steps */}
        <path
          d="M 750 820 L 880 720 L 1050 720 L 1180 820"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
          strokeLinecap="round"
          fill="none"
        />
      </g>

      {/* Golden Sparkles radiating off brilliant white walls */}
      <DoodleSparkle x={500} y={560} size={36} color="#F59E0B" delayFrame={10} />
      <DoodleSparkle x={960} y={340} size={48} color="#FBBF24" delayFrame={20} />
      <DoodleSparkle x={1380} y={520} size={42} color="#F59E0B" delayFrame={15} />
      <DoodleSparkle x={820} y={640} size={32} color="#FBBF24" delayFrame={30} />
      <DoodleSparkle x={1120} y={630} size={38} color="#F59E0B" delayFrame={25} />
      <DoodleSparkle x={1560} y={640} size={30} color="#FBBF24" delayFrame={35} />

      {/* Villager waving */}
      <DoodleStickman x={280} y={660} scale={1.7} pose="waving" expression="smile" />

      </DoodlePaper>
  );
};
