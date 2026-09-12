import React from 'react';
import { interpolate, Sequence, useCurrentFrame } from 'remotion';
import { DoodlePaper } from './DoodlePaper';
import { DesertEnvironment, MeadowEnvironment, VillageEnvironment } from './DoodleEnvironments';
import { DoodleStickman } from './DoodleStickman';
import { DoodleSun } from './DoodleElements';

export const EnvironmentShowcase: React.FC = () => {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      {/* 1. Desert Environment (Inkly Desert Look) */}
      <Sequence from={0} durationInFrames={60}>
        <DoodlePaper backgroundColor="#FFF9ED" cameraZoom={[1.0, 1.05]}>
          <DesertEnvironment showCactus showDwellings />
          <DoodleSun x={1600} y={180} size={90} angry={false} />
          
          {/* Desert Character */}
          <DoodleStickman
            x={960}
            y={520}
            scale={1.25}
            pose="holding_magnifier"
            expression="curious"
            hat="safari"
            pupilDirection="up_right"
          />

          {/* Title Card */}
          <g>
            <rect x={760} y={60} width={400} height={70} rx={12} fill="#FFFFFF" stroke="#18181B" strokeWidth={5} />
            <text
              x={960}
              y={108}
              textAnchor="middle"
              fontSize={34}
              fontWeight="900"
              fill="#D97706"
            >
              DESERT ENVIRONMENT
            </text>
          </g>
        </DoodlePaper>
      </Sequence>

      {/* 2. Meadow & Blue Sky Environment (Inkly Green Field Look) */}
      <Sequence from={60} durationInFrames={60}>
        <DoodlePaper backgroundColor="#A2D7F3" cameraZoom={[1.0, 1.04]}>
          <MeadowEnvironment showClouds />
          <DoodleSun x={240} y={150} size={85} pulse />

          {/* Waving Character (like snap_430s) */}
          <DoodleStickman
            x={960}
            y={500}
            scale={1.3}
            pose="waving"
            expression="grin"
            pupilDirection="up_right"
          />

          {/* Title Card */}
          <g>
            <rect x={740} y={60} width={440} height={70} rx={12} fill="#FFFFFF" stroke="#18181B" strokeWidth={5} />
            <text
              x={960}
              y={108}
              textAnchor="middle"
              fontSize={34}
              fontWeight="900"
              fill="#16A34A"
            >
              MEADOW & SKY ENVIRONMENT
            </text>
          </g>
        </DoodlePaper>
      </Sequence>

      {/* 3. Mediterranean Village Environment */}
      <Sequence from={120} durationInFrames={60}>
        <DoodlePaper backgroundColor="#B6E3F8" cameraZoom={[1.0, 1.05]}>
          <VillageEnvironment />
          <DoodleSun x={1650} y={160} size={80} />

          {/* Village Explorer */}
          <DoodleStickman
            x={960}
            y={510}
            scale={1.25}
            pose="sipping_drink"
            expression="smile"
          />

          {/* Title Card */}
          <g>
            <rect x={740} y={60} width={440} height={70} rx={12} fill="#FFFFFF" stroke="#18181B" strokeWidth={5} />
            <text
              x={960}
              y={108}
              textAnchor="middle"
              fontSize={34}
              fontWeight="900"
              fill="#2563EB"
            >
              VILLAGE ENVIRONMENT
            </text>
          </g>
        </DoodlePaper>
      </Sequence>
    </div>
  );
};
