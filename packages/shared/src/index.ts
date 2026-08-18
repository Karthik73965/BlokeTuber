// Shared types between frontend and backend

export interface Project {
  id: string;
  name: string;
  scriptText: string;
  status: 'draft' | 'processing' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface RenderJob {
  id: string;
  projectId: string;
  status: 'queued' | 'running' | 'completed' | 'error';
  step: string;
  timelineJson?: unknown;
  chapterTimingMap?: unknown;
  beatAlignments?: unknown;
  errorMessage?: string;
  outputPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Clip {
  id: string;
  projectId: string;
  filename: string;
  localPath: string;
  tags?: string[];
  durationSeconds?: number;
  isUsed?: boolean;
  usageCount?: number;
  createdAt: string;
}

export interface TimelineClip {
  beatIndex: number;
  chapterIndex: number;
  text: string;
  startTime: number;
  endTime: number;
  clipPath: string | null;
  stockSource?: string;
  stockUrl?: string;
  kenBurns: boolean;
  transitionType: 'cut' | 'crossfade';
  transitionDuration: number;
  numberOverlays: NumberOverlay[];
}

export interface NumberOverlay {
  text: string;
  startTime: number;
  endTime: number;
  style: 'badge' | 'lower-third';
}

export interface Timeline {
  masterAudioPath: string;
  totalDuration: number;
  clips: TimelineClip[];
  outputPath: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
