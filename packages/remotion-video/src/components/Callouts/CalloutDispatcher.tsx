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

export const CalloutDispatcher: React.FC<OverlayLayerProps> = ({
  callout,
  numberOverlays,
  clipDurationInSeconds,
}) => {
  return (
    <>
      {/* Legacy Number Badges if present */}
      {numberOverlays?.map((overlay, index) => (
        <NumberBadge
          key={`num_${index}`}
          overlay={overlay}
          clipDurationInSeconds={clipDurationInSeconds}
        />
      ))}

      {/* Main AI Callout */}
      {callout && callout.line1 && (() => {
        const type = callout.type || 'editorial_lower_third';
        const props = { callout, clipDurationInSeconds };

        switch (type) {
          // ── The 20 Unique Documentary Styles ──
          case 'newspaper_headline':
            return <NewspaperHeadline {...props} />;
          case 'redacted_dossier':
            return <RedactedDossier {...props} />;
          case 'polaroid_snapshot':
            return <PolaroidSnapshot {...props} />;
          case 'typewriter_paper':
            return <TypewriterPaper {...props} />;
          case 'marker_circle':
            return <MarkerCircle {...props} />;
          case 'wiretap_intercept':
            return <WiretapIntercept {...props} />;
          case 'editorial_lower_third':
            return <EditorialLowerThird {...props} />;
          case 'police_crime_sheet':
            return <PoliceCrimeSheet {...props} />;
          case 'odometer_stat':
            return <OdometerStat {...props} />;
          case 'map_pingeotag':
            return <MapPinGeotag {...props} />;
          case 'editorial_quote':
            return <EditorialQuote {...props} />;
          case 'social_tweet_card':
            return <SocialTweetCard {...props} />;
          case 'reddit_thread_card':
            return <RedditThreadCard {...props} />;
          case 'caution_tape_banner':
            return <CautionTapeBanner {...props} />;
          case 'archival_evidence_tag':
            return <ArchivalEvidenceTag {...props} />;
          case 'split_milestone_card':
            return <SplitMilestoneCard {...props} />;
          case 'karaoke_captions':
            return <KaraokeCaptions {...props} />;
          case 'fullscreen_chapter_title':
            return <FullScreenChapterTitle {...props} />;
          case 'court_transcript_card':
            return <CourtTranscriptCard {...props} />;
          case 'forensic_data_card':
            return <ForensicDataCard {...props} />;

          // ── Legacy fallbacks ──
          case 'stat_callout':
          case 'center_title':
            return <OdometerStat {...props} />;
          case 'lower_third':
            return <EditorialLowerThird {...props} />;
          case 'location_badge':
            return <MapPinGeotag {...props} />;
          case 'evidence_tag':
            return <RedactedDossier {...props} />;
          case 'quote_card':
            return <EditorialQuote {...props} />;
          case 'chapter_header':
            return <FullScreenChapterTitle {...props} />;
          case 'highlight_pill':
            return <HighlightPill {...props} />;
          case 'split_title':
            return <SplitMilestoneCard {...props} />;
          case 'ticker_bar':
            return <TickerBar {...props} />;
          case 'corner_tag':
            return <ArchivalEvidenceTag {...props} />;
          case 'full_screen_title':
            return <FullScreenChapterTitle {...props} />;
          case 'breaking_news':
            return <CautionTapeBanner {...props} />;
          default:
            return <EditorialLowerThird {...props} />;
        }
      })()}
    </>
  );
};
