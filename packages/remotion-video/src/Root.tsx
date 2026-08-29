import React from 'react';
import { Composition } from 'remotion';
import { DocumentaryVideo } from './compositions/DocumentaryVideo';
import { DocumentaryVideoProps } from './types';

const defaultProps: DocumentaryVideoProps = {
  timeline: {
    masterAudioPath: '',
    totalDuration: 10,
    outputPath: '',
    clips: [
      {
        beatIndex: 0,
        chapterIndex: 0,
        text: 'Sample beat narration preview',
        startTime: 0,
        endTime: 5,
        clipPath: null,
        mediaType: 'image',
        kenBurns: true,
        transitionType: 'cut',
        transitionDuration: 0,
        numberOverlays: [],
        callout: {
          type: 'lower_third',
          line1: 'Beacon Hill Investigation',
          line2: 'Special Report',
          themeColor: 'gold',
          startTime: 0.2,
          endTime: 3.5,
        },
      },
    ],
  },
};

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition<any, DocumentaryVideoProps>
        id="DocumentaryVideo"
        component={DocumentaryVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={defaultProps}
        calculateMetadata={({ props }) => {
          const fps = 30;
          const timeline = props?.timeline;
          if (!timeline || !timeline.clips || timeline.clips.length === 0) {
            return { durationInFrames: 300, fps };
          }

          let totalFrames = 0;
          for (const clip of timeline.clips) {
            const rawDuration = Math.max(0.5, clip.endTime - clip.startTime);
            totalFrames += Math.max(15, Math.round(rawDuration * fps));
          }

          return {
            durationInFrames: Math.max(30, totalFrames),
            fps,
          };
        }}
      />
    </>
  );
};
