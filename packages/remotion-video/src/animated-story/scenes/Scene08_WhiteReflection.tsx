import React from 'react';
import { useCurrentFrame } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import {
  DoodleSun,
  DoodleThermometer,
  DoodleRayArrow,
  DoodleSparkle,
  DOODLE_STROKE,
  DOODLE_WIDTH,
} from '../DoodleElements';

export const Scene08_WhiteReflection: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <DoodlePaper cameraZoom={[1.0, 1.07]} cameraPanY={[0, -10]}>
      {/* Sun in top corner */}
      <DoodleSun x={280} y={160} size={130} />

      {/* Bouncing Solar Reflection Rays (striking white roof & bouncing into the sky) */}
      <DoodleRayArrow
        startX={400}
        startY={220}
        endX={760}
        endY={470}
        bounceX={1120}
        bounceY={200}
        color="#F59E0B"
      />
      <DoodleRayArrow
        startX={450}
        startY={290}
        endX={920}
        endY={470}
        bounceX={1380}
        bounceY={210}
        color="#F59E0B"
      />
      <DoodleRayArrow
        startX={500}
        startY={350}
        endX={1080}
        endY={470}
        bounceX={1620}
        bounceY={220}
        color="#F59E0B"
      />

      {/* Brilliant White House */}
      <g transform="translate(960, 650)">
        {/* Mirror Reflective White Flat Roof */}
        <rect
          x={-400}
          y={-180}
          width={800}
          height={65}
          fill="#FFFFFF"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
          rx={8}
        />
        {/* Sparkle bursts on reflection impact points */}
        <DoodleSparkle x={-200} y={-180} size={42} delayFrame={0} />
        <DoodleSparkle x={-40} y={-180} size={50} delayFrame={10} />
        <DoodleSparkle x={120} y={-180} size={46} delayFrame={20} />

        {/* Cool, Peaceful Blue Interior */}
        <rect
          x={-360}
          y={-115}
          width={720}
          height={340}
          fill="#F0F9FF"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />

        {/* Cool Snowflakes inside */}
        <text x={-260} y={-40} fontSize={36}></text>
        <text x={240} y={-40} fontSize={36}></text>

        {/* Happy Comfortable Stickman */}
        <DoodleStickman
          x={-50}
          y={60}
          scale={1.9}
          pose="waving"
          expression="smile"
        />

        {/* Cool Thermometer */}
        <DoodleThermometer
          x={230}
          y={140}
          height={260}
          tempPercent={35}
          label="72F"
          themeColor="#0284C7"
        />
      </g>

      </DoodlePaper>
  );
};
