import type { Timeline } from '@repo/shared';

export type {
  CalloutOverlay,
  CalloutType,
  CalloutThemeColor,
  SceneLayoutType,
  SceneLayoutData,
  TimelineClip,
  Timeline,
  NumberOverlay,
  OverlayType,
  TransitionType,
} from '@repo/shared';

export type DocumentaryVideoProps = {
  timeline: Timeline;
  [key: string]: unknown;
};
