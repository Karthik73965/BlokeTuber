export interface UsedMediaItem {
  id: string;
  url: string;
  source: string;
  mediaType: 'image' | 'video';
  chapterIndex: number;
  query: string;
  usedAt: string;
}

export interface Chapter {
  id: string;
  projectId: string;
  chapterIndex: number;
  title: string;
  scriptText?: string;
  voiceoverFileName?: string;
  status: 'draft' | 'queued' | 'processing' | 'completed' | 'error';
  jobId?: string;
  videoPath?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  scriptText?: string;
  chapters: Chapter[];
  usedMedia: UsedMediaItem[];
  status: 'draft' | 'processing' | 'completed' | 'error';
  createdAt: string;
  updatedAt: string;
}

export interface RenderJob {
  id: string;
  projectId: string;
  chapterId?: string;
  chapterIndex?: number;
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

export type CalloutType =
  | 'newspaper_headline'
  | 'redacted_dossier'
  | 'polaroid_snapshot'
  | 'typewriter_paper'
  | 'marker_circle'
  | 'wiretap_intercept'
  | 'editorial_lower_third'
  | 'police_crime_sheet'
  | 'odometer_stat'
  | 'map_pingeotag'
  | 'editorial_quote'
  | 'social_tweet_card'
  | 'reddit_thread_card'
  | 'caution_tape_banner'
  | 'archival_evidence_tag'
  | 'split_milestone_card'
  | 'karaoke_captions'
  | 'fullscreen_chapter_title'
  | 'court_transcript_card'
  | 'forensic_data_card'
  // Backward-compatible legacy aliases
  | 'stat_callout'
  | 'lower_third'
  | 'location_badge'
  | 'evidence_tag'
  | 'quote_card'
  | 'chapter_header'
  | 'highlight_pill'
  | 'split_title'
  | 'ticker_bar'
  | 'corner_tag'
  | 'full_screen_title'
  | 'breaking_news'
  | 'center_title';

export type CalloutThemeColor = 'gold' | 'amber' | 'cyan' | 'crimson' | 'emerald' | 'slate' | 'white';

export interface CalloutOverlay {
  type: CalloutType;
  line1: string;
  line2?: string;
  spokenTrigger?: string;
  themeColor?: CalloutThemeColor;
  startTime?: number;
  endTime?: number;
}

export interface TimelineClip {
  beatIndex: number;
  chapterIndex: number;
  text: string;
  startTime: number;
  endTime: number;
  clipPath: string | null;
  mediaType?: 'video' | 'image';
  stockSource?: string;
  stockUrl?: string;
  kenBurns: boolean;
  transitionType: 'cut' | 'crossfade';
  transitionDuration: number;
  numberOverlays: NumberOverlay[];
  callout?: CalloutOverlay | null;
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
