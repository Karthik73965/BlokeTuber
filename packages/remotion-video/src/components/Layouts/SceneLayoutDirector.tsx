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
import { SplitDualScreenLayout } from './SplitDualScreenLayout';
import { OpenCaseBinderLayout } from './OpenCaseBinderLayout';
import { ForensicDraftingTableLayout } from './ForensicDraftingTableLayout';
import { IlluminatedLightboxLayout } from './IlluminatedLightboxLayout';
import { MuseumArchiveMatteLayout } from './MuseumArchiveMatteLayout';
import { DesktopCorkboardLayout } from './DesktopCorkboardLayout';
import { HeroGraphicCenterpieceLayout } from './HeroGraphicCenterpieceLayout';

export interface SceneDirectorProps {
  clip: TimelineClip;
  clipIndex: number;
  durationInFrames: number;
  durationInSeconds: number;
}

const MOTION_GRAPHIC_ROTATION: SceneLayoutType[] = [
  'split_dual_screen',
  'ambient_blur_frame',
  'open_case_binder',
  'vintage_crt_monitor',
  'illuminated_lightbox',
  'filmstrip_spool_reel',
  'forensic_drafting_table',
  'polaroid_scatter_desk',
  'museum_archive_matte',
  'desktop_corkboard',
  'editorial_sidebar_column',
  'parallax_triptych_gallery',
  'hero_graphic_centerpiece',
  'quad_surveillance_matrix',
  'red_string_pinboard',
  'horizon_top_bottom_split',
  'magnifying_loupe_inspector',
];

export function resolveSceneLayout(clip: TimelineClip, clipIndex: number): SceneLayoutType {
  // 1. Explicit stylized layout assignment (non-full-bleed)
  if (clip.layout && clip.layout !== 'full_bleed_cinematic') {
    return clip.layout;
  }

  // 2. Intelligent rule-based director based on callout type
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

  if (calloutType === 'court_transcript_card' || calloutType === 'redacted_dossier') {
    return 'open_case_binder';
  }

  if (calloutType === 'map_pingeotag' || calloutType === 'forensic_data_card') {
    return 'forensic_drafting_table';
  }

  if (
    calloutType === 'newspaper_headline' ||
    calloutType === 'editorial_quote' ||
    calloutType === 'editorial_lower_third'
  ) {
    return 'editorial_sidebar_column';
  }

  if (calloutType === 'split_milestone_card') {
    return 'split_dual_screen';
  }

  // 3. Balanced 50/50 Rhythm: Alternate every other beat between motion graphics and full-bleed b-roll
  if (clipIndex % 2 === 1) {
    const layoutIdx = Math.floor(clipIndex / 2) % MOTION_GRAPHIC_ROTATION.length;
    return MOTION_GRAPHIC_ROTATION[layoutIdx]!;
  }

  return 'full_bleed_cinematic';
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
    case 'split_dual_screen':
      return <SplitDualScreenLayout {...props} />;
    case 'open_case_binder':
      return <OpenCaseBinderLayout {...props} />;
    case 'forensic_drafting_table':
      return <ForensicDraftingTableLayout {...props} />;
    case 'illuminated_lightbox':
      return <IlluminatedLightboxLayout {...props} />;
    case 'museum_archive_matte':
      return <MuseumArchiveMatteLayout {...props} />;
    case 'desktop_corkboard':
      return <DesktopCorkboardLayout {...props} />;
    case 'hero_graphic_centerpiece':
      return <HeroGraphicCenterpieceLayout {...props} />;
    case 'full_bleed_cinematic':
    default:
      return <FullBleedCinematicLayout {...props} />;
  }
};
