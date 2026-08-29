import React from 'react';
import { TimelineClip, SceneLayoutType } from '../../types';
import { FullBleedCinematicLayout } from './FullBleedCinematicLayout';
import { AmbientBlurFrameLayout } from './AmbientBlurFrameLayout';
import { VintageCrtMonitorLayout } from './VintageCrtMonitorLayout';
import { FilmstripSpoolReelLayout } from './FilmstripSpoolReelLayout';
import { EditorialSidebarColumnLayout } from './EditorialSidebarColumnLayout';
import { RedStringPinboardLayout } from './RedStringPinboardLayout';
import { HorizonTopBottomSplitLayout } from './HorizonTopBottomSplitLayout';
import { ParallaxTriptychGalleryLayout } from './ParallaxTriptychGalleryLayout';
import { QuadSurveillanceMatrixLayout } from './QuadSurveillanceMatrixLayout';
import { PolaroidScatterDeskLayout } from './PolaroidScatterDeskLayout';
import { MagnifyingLoupeInspectorLayout } from './MagnifyingLoupeInspectorLayout';

export interface SceneDirectorProps {
  clip: TimelineClip;
  clipIndex: number;
  durationInFrames: number;
  durationInSeconds: number;
}

export function resolveSceneLayout(clip: TimelineClip, clipIndex: number): SceneLayoutType {
  // 1. Explicit layout assignment
  if (clip.layout) {
    return clip.layout;
  }

  // 2. Intelligent rule-based director based on callout type and beat index
  const calloutType = clip.callout?.type;

  if (calloutType === 'wiretap_intercept' || calloutType === 'police_crime_sheet') {
    return 'vintage_crt_monitor';
  }

  if (calloutType === 'archival_evidence_tag' || calloutType === 'marker_circle') {
    return 'red_string_pinboard';
  }

  if (calloutType === 'polaroid_snapshot') {
    return 'polaroid_scatter_desk';
  }

  if (calloutType === 'map_pingeotag' || calloutType === 'forensic_data_card') {
    return 'magnifying_loupe_inspector';
  }

  if (
    calloutType === 'newspaper_headline' ||
    calloutType === 'court_transcript_card' ||
    calloutType === 'editorial_quote' ||
    calloutType === 'editorial_lower_third'
  ) {
    return 'editorial_sidebar_column';
  }

  if (calloutType === 'split_milestone_card') {
    return 'horizon_top_bottom_split';
  }

  const rotation = clipIndex % 5;
  switch (rotation) {
    case 1:
      return 'parallax_triptych_gallery';
    case 2:
      return 'filmstrip_spool_reel';
    case 3:
      return 'quad_surveillance_matrix';
    case 4:
      return 'ambient_blur_frame';
    default:
      return 'full_bleed_cinematic';
  }
}

export const SceneLayoutDirector: React.FC<SceneDirectorProps> = (props) => {
  const layout = resolveSceneLayout(props.clip, props.clipIndex);

  switch (layout) {
    case 'ambient_blur_frame':
      return <AmbientBlurFrameLayout {...props} />;
    case 'vintage_crt_monitor':
      return <VintageCrtMonitorLayout {...props} />;
    case 'filmstrip_spool_reel':
      return <FilmstripSpoolReelLayout {...props} />;
    case 'editorial_sidebar_column':
      return <EditorialSidebarColumnLayout {...props} />;
    case 'red_string_pinboard':
      return <RedStringPinboardLayout {...props} />;
    case 'horizon_top_bottom_split':
      return <HorizonTopBottomSplitLayout {...props} />;
    case 'parallax_triptych_gallery':
      return <ParallaxTriptychGalleryLayout {...props} />;
    case 'quad_surveillance_matrix':
      return <QuadSurveillanceMatrixLayout {...props} />;
    case 'polaroid_scatter_desk':
      return <PolaroidScatterDeskLayout {...props} />;
    case 'magnifying_loupe_inspector':
      return <MagnifyingLoupeInspectorLayout {...props} />;
    case 'full_bleed_cinematic':
    default:
      return <FullBleedCinematicLayout {...props} />;
  }
};
