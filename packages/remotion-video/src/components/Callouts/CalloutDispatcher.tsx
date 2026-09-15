import React from 'react';
import { CalloutOverlay, NumberOverlay } from '../../types';

// 20 Unique Documentary Motion Components
import { NewspaperHeadline } from '../DocumentaryStyles/NewspaperHeadline';
import { RedactedDossier } from '../DocumentaryStyles/RedactedDossier';
import { PolaroidSnapshot } from '../DocumentaryStyles/PolaroidSnapshot';
import { TypewriterPaper } from '../DocumentaryStyles/TypewriterPaper';
import { MarkerCircle } from '../DocumentaryStyles/MarkerCircle';
import { WiretapIntercept } from '../DocumentaryStyles/WiretapIntercept';
import { EditorialLowerThird } from '../DocumentaryStyles/EditorialLowerThird';
import { PoliceCrimeSheet } from '../DocumentaryStyles/PoliceCrimeSheet';
import { OdometerStat } from '../DocumentaryStyles/OdometerStat';
import { MapPinGeotag } from '../DocumentaryStyles/MapPinGeotag';
import { EditorialQuote } from '../DocumentaryStyles/EditorialQuote';
import { SocialTweetCard } from '../DocumentaryStyles/SocialTweetCard';
import { RedditThreadCard } from '../DocumentaryStyles/RedditThreadCard';
import { CautionTapeBanner } from '../DocumentaryStyles/CautionTapeBanner';
import { ArchivalEvidenceTag } from '../DocumentaryStyles/ArchivalEvidenceTag';
import { SplitMilestoneCard } from '../DocumentaryStyles/SplitMilestoneCard';
import { KaraokeCaptions } from '../DocumentaryStyles/KaraokeCaptions';
import { FullScreenChapterTitle } from '../DocumentaryStyles/FullScreenChapterTitle';
import { CourtTranscriptCard } from '../DocumentaryStyles/CourtTranscriptCard';
import { ForensicDataCard } from '../DocumentaryStyles/ForensicDataCard';

// Legacy fallbacks
import { StatCallout } from './StatCallout';
import { LowerThird } from './LowerThird';
import { LocationBadge } from './LocationBadge';
import { EvidenceTag } from './EvidenceTag';
import { QuoteCard } from './QuoteCard';
import { ChapterHeader } from './ChapterHeader';
import { HighlightPill } from './HighlightPill';
import { SplitTitle } from './SplitTitle';
import { TickerBar } from './TickerBar';
import { CornerTag } from './CornerTag';
import { FullScreenTitle } from './FullScreenTitle';
import { BreakingNews } from './BreakingNews';
import { NumberBadge } from './NumberBadge';

export interface OverlayLayerProps {
  callout?: CalloutOverlay | null;
  numberOverlays?: NumberOverlay[];
  clipDurationInSeconds: number;
}

// User-selected banned callouts: C04, C05, C07, C08, C11, C13, C14, C18
const BANNED_CALLOUT_TYPES = new Set<string>([
  'map_pingeotag',          // C04
  'location_badge',         // legacy C04
  'editorial_quote',        // C05
  'quote_card',             // legacy C05
  'court_transcript_card',  // C07
  'wiretap_intercept',      // C08
  'polaroid_snapshot',      // C11
  'marker_circle',          // C13
  'archival_evidence_tag',  // C14
  'corner_tag',             // legacy C14
  'split_milestone_card',   // C18
  'split_title',            // legacy C18
]);

export const CalloutDispatcher: React.FC<OverlayLayerProps> = ({
  callout,
  clipDurationInSeconds,
}) => {
  // Spoken number badges are completely removed per user instruction.

  /* Main AI Callout */
  if (!callout || !callout.line1) return null;

  const type = callout.type || 'editorial_lower_third';

  // Filter out any banned callouts
  if (BANNED_CALLOUT_TYPES.has(type)) {
    return null;
  }

  const props = { callout, clipDurationInSeconds };

  switch (type) {
    // ── Approved Documentary Styles ──
    case 'newspaper_headline':
      return <NewspaperHeadline {...props} />;
    case 'editorial_lower_third':
      return <EditorialLowerThird {...props} />;
    case 'odometer_stat':
      return <OdometerStat {...props} />;
    case 'redacted_dossier':
      return <RedactedDossier {...props} />;
    case 'police_crime_sheet':
      return <PoliceCrimeSheet {...props} />;
    case 'forensic_data_card':
      return <ForensicDataCard {...props} />;
    case 'typewriter_paper':
      return <TypewriterPaper {...props} />;
    case 'social_tweet_card':
      return <SocialTweetCard {...props} />;
    case 'reddit_thread_card':
      return <RedditThreadCard {...props} />;
    case 'caution_tape_banner':
      return <CautionTapeBanner {...props} />;
    case 'karaoke_captions':
      return <KaraokeCaptions {...props} />;
    case 'fullscreen_chapter_title':
      return <FullScreenChapterTitle {...props} />;

    // ── Approved Legacy fallbacks ──
    case 'stat_callout':
    case 'center_title':
      return <OdometerStat {...props} />;
    case 'lower_third':
      return <EditorialLowerThird {...props} />;
    case 'evidence_tag':
      return <RedactedDossier {...props} />;
    case 'chapter_header':
    case 'full_screen_title':
      return <FullScreenChapterTitle {...props} />;
    case 'highlight_pill':
      return <HighlightPill {...props} />;
    case 'ticker_bar':
      return <TickerBar {...props} />;
    case 'breaking_news':
      return <CautionTapeBanner {...props} />;
    default:
      return <EditorialLowerThird {...props} />;
  }
};
