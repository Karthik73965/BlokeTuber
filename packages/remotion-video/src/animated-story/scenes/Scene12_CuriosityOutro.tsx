import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene12_CuriosityOutro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Dramatic curiosity zoom-in
  return (
    <DoodlePaper cameraZoom={[1.0, 1.14]} cameraPanX={[0, -20]} cameraPanY={[0, -10]}>
      {/* Wooden Frame Chalkboard */}
      <g transform="translate(1080, 480)">
        {/* Outer Wooden Bezel */}
        <rect
          x={-420}
          y={-300}
          width={840}
          height={600}
          rx={20}
          fill="#78350F"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        {/* Dark Slate Green Chalkboard Surface */}
        <rect
          x={-380}
          y={-260}
          width={760}
          height={520}
          rx={10}
          fill="#1E293B"
        />

        {/* Board Title */}
        <text
          x={0}
          y={-190}
          textAnchor="middle"
          fill="#FEF08A"
          fontFamily="'Comic Sans MS', cursive"
          fontSize={38}
          fontWeight="bold"
        >
          WHY PAINT EVERYTHING WHITE?
        </text>
        <line x1={-320} y1={-160} x2={320} y2={-160} stroke="#475569" strokeWidth={4} strokeDasharray="8 6" />

        {/* Reason 1: Heat (Checked) */}
        <g transform="translate(-320, -90)">
          <circle cx={20} cy={0} r={18} fill="#22C55E" />
          <text x={9} y={7} fontSize={18} fill="#FFF" fontWeight="bold">OK</text>
          <text
            x={60}
            y={8}
            fill="#FFFFFF"
            fontFamily="'Comic Sans MS', cursive"
            fontSize={30}
            fontWeight="bold"
          >
            1. Defeat Extreme Heat
          </text>
        </g>

        {/* Reason 2: ? (Locked Secret) */}
        <g transform="translate(-320, 10)">
          <circle cx={20} cy={0} r={18} fill="#EAB308" />
          <text x={13} y={7} fontSize={20} fill="#000" fontWeight="bold">?</text>
          <text
            x={60}
            y={8}
            fill="#FDE047"
            fontFamily="'Comic Sans MS', cursive"
            fontSize={30}
            fontWeight="bold"
          >
            2. Sanitation & Disease Control?
          </text>
        </g>

        {/* Reason 3: ? (Mystery) */}
        <g transform="translate(-320, 110)">
          <circle cx={20} cy={0} r={18} fill="#EF4444" />
          <text x={13} y={7} fontSize={20} fill="#FFF" fontWeight="bold">?</text>
          <text
            x={60}
            y={8}
            fill="#F87171"
            fontFamily="'Comic Sans MS', cursive"
            fontSize={30}
            fontWeight="bold"
          >
            3. Ancient Chemical Disinfectant?
          </text>
        </g>

        {/* Chalk dust tray */}
        <rect x={-360} y={230} width={720} height={18} rx={4} fill="#B45309" stroke={DOODLE_STROKE} strokeWidth={4} />
      </g>

      {/* Host Stickman pointing stick at Reason #2 */}
      <DoodleStickman
        x={480}
        y={540}
        scale={2.1}
        pose="pointing_board"
        expression="shocked"
      />

      {/* Pulsing Red Question Mark */}
      <g transform={`translate(420, 240) scale(${1 + Math.sin(frame * 0.25) * 0.15})`}>
        <circle cx={0} cy={0} r={46} fill="#FDE047" stroke={DOODLE_STROKE} strokeWidth={6} />
        <text
          x={-14}
          y={18}
          fontFamily="'Comic Sans MS', cursive"
          fontSize={54}
          fontWeight="bold"
          fill="#DC2626"
        >
          ?
        </text>
      </g>

      </DoodlePaper>
  );
};
