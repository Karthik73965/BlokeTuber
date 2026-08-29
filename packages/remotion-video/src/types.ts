import type { Timeline } from '@repo/shared';

export type {
  CalloutOverlay,
  CalloutType,
  CalloutThemeColor,
  TimelineClip,
  Timeline,
  NumberOverlay,
} from '@repo/shared';

export type DocumentaryVideoProps = {
  timeline: Timeline;
  [key: string]: unknown;
};
