export interface UsedMediaItem {
  id: string;
  url: string;
  source: string;
  mediaType: 'image' | 'video';
  chapterIndex: number;
  query: string;
  usedAt: string;
}

export type PacingSpeed = 'low' | 'medium' | 'high';

export interface Chapter {
  id: string;
  projectId: string;
  chapterIndex: number;
  title: string;
  description?: string; // Pacing & Visual Director Note (e.g. "70yo elderly woman, van life, desert roads")
  scriptText?: string;
  voiceoverFileName?: string;
  pacing?: PacingSpeed;
  clipLibraryRoot?: string;
  status: 'draft' | 'staged' | 'queued' | 'processing' | 'completed' | 'error';
  jobId?: string;
  videoPath?: string;
  timelineJson?: Timeline;
  createdAt: string;
  updatedAt: string;
}

export interface StockSearchOption {
  id: string;
  url: string;
  previewUrl: string;
  title: string;
  source: 'pexels' | 'pixabay' | 'coverr' | 'mixkit' | 'archive' | 'ai_generated';
  mediaType: 'video' | 'image';
  width: number;
  height: number;
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

export type SceneLayoutType =
  | 'full_bleed_cinematic'
  | 'ambient_blur_frame'
  | 'vintage_crt_monitor'
  | 'filmstrip_spool_reel'
  | 'editorial_sidebar_column'
  | 'red_string_pinboard'
  | 'horizon_top_bottom_split'
  | 'parallax_triptych_gallery'
  | 'quad_surveillance_matrix'
  | 'polaroid_scatter_desk'
  | 'magnifying_loupe_inspector'
  | 'split_dual_screen'
  | 'open_case_binder'
  | 'forensic_drafting_table'
  | 'illuminated_lightbox'
  | 'museum_archive_matte'
  | 'desktop_corkboard'
  | 'hero_graphic_centerpiece';

export interface SceneLayoutData {
  title?: string;
  subtitle?: string;
  tag?: string;
  badge?: string;
  camLabels?: string[]; // e.g. ["DASHCAM // HIGHWAY 40", "CABIN REAR // LIVING AREA", "SIDE MIRROR // NIGHT", "OVERHEAD DRONE"]
  notes?: string[]; // e.g. ["1995 FORD ECONOLINE", "FINAL EVICTION NOTICE", "SOCIAL SECURITY CHECK $820/MO"]
  coords?: string; // e.g. "QUARTZSITE, AZ • 33.6642° N, 114.2272° W"
  timestamp?: string; // e.g. "OCTOBER 1995 • 03:14 AM"
  stamp?: string; // e.g. "FORENSIC BOUNDARY SURVEY"
}

export interface TimelineClip {
  beatIndex: number;
  chapterIndex: number;
  text: string;
  startTime: number;
  endTime: number;
  clipPath: string | null;
  secondaryClipPath?: string | null;
  additionalClipPaths?: string[];
  mediaType?: 'video' | 'image';
  secondaryMediaType?: 'video' | 'image';
  layout?: SceneLayoutType;
  layoutData?: SceneLayoutData;
  stockSource?: string;
  stockUrl?: string;
  stockVideoQuery?: string | null;
  backupVideoQuery?: string | null;
  stockPhotoQuery?: string | null;
  kenBurns: boolean;
  transitionType?: TransitionType;
  transitionDuration: number;
  numberOverlays: NumberOverlay[];
  callout?: CalloutOverlay | null;
  overlay?: OverlayType | OverlayType[];
  sfxPath?: string | null;
  sfxVolume?: number;
}

export type TransitionType =
  | 'cut'
  | 'shutter_flash'
  | 'film_burn'
  | 'film_dip_black'
  | 'whip_pan_left'
  | 'whip_pan_right'
  | 'zoom_punch'
  | 'glitch_blink'
  | 'crossfade';

export type OverlayType =
  | 'film_dust_scratches'
  | 'star_sparkle_bokeh'
  | 'film_burn_light_leak'
  | 'vintage_crt_scanlines'
  | 'camera_viewfinder_hud'
  | 'micro_film_grain'
  | 'archival_halftone_paper'
  | 'cinematic_vignette'
  | 'chromatic_aberration'
  | 'sprocket_16mm_film_frame'
  | 'rain_lens_streaks'
  | 'vhs_glitch_tape_tear';

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
  globalOverlays?: OverlayType[];
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
