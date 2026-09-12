import React from 'react';
import { interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { DoodlePaper } from '../DoodlePaper';
import { DoodleStickman } from '../DoodleStickman';
import { DoodleSun, DoodleThermometer, DOODLE_STROKE, DOODLE_WIDTH } from '../DoodleElements';

export const Scene01_Explorer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Character entrance bounce
  const enterSpring = spring({ frame, fps, config: { damping: 12, stiffness: 180 } });

  // Thermometer temperature rising
  const tempPercent = interpolate(frame, [15, 95], [30, 95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Exclamation pop on "notice something strange"
  const strangePop = spring({
    frame: frame - 65,
    fps,
    config: { damping: 10, stiffness: 220 },
  });

  return (
    <DoodlePaper cameraZoom={[1.0, 1.05]} cameraPanX={[0, -20]}>
      {/* Background Blazing Sun */}
      <DoodleSun x={1650} y={200} size={130} angry={true} />

      {/* Earth Globe */}
      <g transform="translate(980, 560)">
        {/* Globe Outline */}
        <circle cx={0} cy={0} r={230} fill="#E0F2FE" stroke={DOODLE_STROKE} strokeWidth={DOODLE_WIDTH} />
        {/* Latitude & Longitude Lines */}
        <ellipse cx={0} cy={0} rx={230} ry={80} fill="none" stroke={DOODLE_STROKE} strokeWidth={4} strokeDasharray="8 8" />
        <ellipse cx={0} cy={0} rx={95} ry={230} fill="none" stroke={DOODLE_STROKE} strokeWidth={4} strokeDasharray="8 8" />
        {/* Stylized Continents */}
        <path
          d="M -120 -60 Q -80 -120 -20 -90 Q 40 -110 90 -40 Q 60 20 0 40 Q -80 60 -120 -60 Z"
          fill="#86EFAC"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        <path
          d="M 20 50 Q 80 40 110 110 Q 70 170 10 160 Q -20 120 20 50 Z"
          fill="#86EFAC"
          stroke={DOODLE_STROKE}
          strokeWidth={DOODLE_WIDTH}
        />
        {/* Heat Waves rising off Globe */}
        <g stroke="#EF4444" strokeWidth={5} fill="none" strokeLinecap="round">
          {[-120, -40, 40, 120].map((gx, idx) => (
            <path
              key={idx}
              d={`M ${gx} -240 Q ${gx + 20} -280 ${gx} -320 Q ${gx - 20} -360 ${gx} -400`}
              transform={`translate(0, ${Math.sin(frame * 0.15 + idx) * 10})`}
            />
          ))}
        </g>
      </g>

      {/* Thermometer Rising */}
      <DoodleThermometer
        x={1380}
        y={760}
        height={420}
        tempPercent={tempPercent}
        label={`${Math.round(tempPercent + 25)}F`}
        themeColor="#DC2626"
      />

      {/* Safari Explorer Stickman */}
      <g transform={`scale(${enterSpring})`}>
        <DoodleStickman
          x={460}
          y={490}
          scale={2.2}
          hat="safari"
          pose="holding_magnifier"
          expression={frame > 65 ? 'shocked' : 'talking'}
        />
      </g>

      {/* "STRANGE?" comic question mark */}
      {frame > 65 && (
        <g transform={`translate(560, 260) scale(${Math.max(0, strangePop)})`}>
          <circle cx={0} cy={0} r={48} fill="#FEF08A" stroke={DOODLE_STROKE} strokeWidth={6} />
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
      )}

      </DoodlePaper>
  );
};
