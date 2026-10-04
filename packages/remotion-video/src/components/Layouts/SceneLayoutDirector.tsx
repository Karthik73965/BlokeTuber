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

const SINGLE_ASSET_LAYOUTS: SceneLayoutType[] = [
  'ambient_blur_frame',
  'vintage_crt_monitor',
  'open_case_binder',
  'editorial_sidebar_column',
  'forensic_drafting_table',
  'museum_archive_matte',
  'desktop_corkboard',
  'hero_graphic_centerpiece',
  'illuminated_lightbox',
  'filmstrip_spool_reel',
  'magnifying_loupe_inspector',
];

const MULTI_ASSET_LAYOUTS: SceneLayoutType[] = [
  'split_dual_screen',
  'parallax_triptych_gallery',
  'quad_surveillance_matrix',
  'horizon_top_bottom_split',
  'polaroid_scatter_desk',
  'red_string_pinboard',
];

// User-selected banned layouts: L3, L4, L7, L8, L10, L12, L15, L16
const BANNED_LAYOUTS = new Set<string>([
  'vintage_crt_monitor',        // L03
  'editorial_sidebar_column',   // L04
  'museum_archive_matte',       // L07
  'desktop_corkboard',          // L08
  'illuminated_lightbox',       // L10
  'magnifying_loupe_inspector', // L12
  'quad_surveillance_matrix',   // L15
  'horizon_top_bottom_split',   // L16
]);

export function resolveSceneLayout(clip: TimelineClip, clipIndex: number): SceneLayoutType {
  const hasMultipleAssets = !!(
    clip.secondaryClipPath ||
    (clip.additionalClipPaths && clip.additionalClipPaths.length > 0)
  );

  // 1. Explicit layout assignment (STRICTLY OBEYED, with banned layout filtering)
  if (clip.layout) {
    if (clip.layout === 'full_bleed_cinematic' || BANNED_LAYOUTS.has(clip.layout)) {
      return 'full_bleed_cinematic';
    }
    // If layout requires multiple assets but clip has only 1, gracefully downgrade to full_bleed_cinematic
    if (
      !hasMultipleAssets &&
      ['parallax_triptych_gallery', 'split_dual_screen', 'polaroid_scatter_desk', 'red_string_pinboard'].includes(clip.layout)
    ) {
      return 'full_bleed_cinematic';
    }
    // If hero_graphic_centerpiece has no callout or number overlays to display, downgrade to full_bleed_cinematic
    if (
      clip.layout === 'hero_graphic_centerpiece' &&
      !clip.callout &&
      (!clip.numberOverlays || clip.numberOverlays.length === 0)
    ) {
      return 'full_bleed_cinematic';
    }
    return clip.layout;
  }

  // 2. Default to clean full-bleed cinematic (NO random layout roulette)
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
