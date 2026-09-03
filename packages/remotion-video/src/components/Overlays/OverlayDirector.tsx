import React from 'react';
import { OverlayType } from '../../types';
import { FilmDustScratchesOverlay } from './FilmDustScratchesOverlay';
import { StarSparkleBokehOverlay } from './StarSparkleBokehOverlay';
import { FilmBurnLightLeakOverlay } from './FilmBurnLightLeakOverlay';
import { VintageCrtScanlinesOverlay } from './VintageCrtScanlinesOverlay';
import { CameraViewfinderHudOverlay } from './CameraViewfinderHudOverlay';
import { MicroFilmGrainOverlay } from './MicroFilmGrainOverlay';
import { ArchivalHalftonePaperOverlay } from './ArchivalHalftonePaperOverlay';
import { CinematicVignetteOverlay } from './CinematicVignetteOverlay';
import { ChromaticAberrationOverlay } from './ChromaticAberrationOverlay';
import { Sprocket16mmFilmFrameOverlay } from './Sprocket16mmFilmFrameOverlay';
import { RainLensStreaksOverlay } from './RainLensStreaksOverlay';
import { VhsGlitchTapeTearOverlay } from './VhsGlitchTapeTearOverlay';

export interface OverlayDirectorProps {
  overlay?: OverlayType | OverlayType[];
}

export const OverlayDirector: React.FC<OverlayDirectorProps> = ({ overlay }) => {
  if (!overlay) return null;

  const overlayList: OverlayType[] = Array.isArray(overlay) ? overlay : [overlay];

  return (
    <>
      {overlayList.map((type, idx) => {
        switch (type) {
          case 'film_dust_scratches':
            return <FilmDustScratchesOverlay key={`${type}_${idx}`} />;
          case 'star_sparkle_bokeh':
            return <StarSparkleBokehOverlay key={`${type}_${idx}`} />;
          case 'film_burn_light_leak':
            return <FilmBurnLightLeakOverlay key={`${type}_${idx}`} />;
          case 'vintage_crt_scanlines':
            return <VintageCrtScanlinesOverlay key={`${type}_${idx}`} />;
          case 'camera_viewfinder_hud':
            return <CameraViewfinderHudOverlay key={`${type}_${idx}`} />;
          case 'micro_film_grain':
            return <MicroFilmGrainOverlay key={`${type}_${idx}`} />;
          case 'archival_halftone_paper':
            return <ArchivalHalftonePaperOverlay key={`${type}_${idx}`} />;
          case 'cinematic_vignette':
            return <CinematicVignetteOverlay key={`${type}_${idx}`} />;
          case 'chromatic_aberration':
            return <ChromaticAberrationOverlay key={`${type}_${idx}`} />;
          case 'sprocket_16mm_film_frame':
            return <Sprocket16mmFilmFrameOverlay key={`${type}_${idx}`} />;
          case 'rain_lens_streaks':
            return <RainLensStreaksOverlay key={`${type}_${idx}`} />;
          case 'vhs_glitch_tape_tear':
            return <VhsGlitchTapeTearOverlay key={`${type}_${idx}`} />;
          default:
            return null;
        }
      })}
    </>
  );
};
