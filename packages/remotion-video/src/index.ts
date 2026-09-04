import { registerRoot } from 'remotion';
import { RemotionRoot } from './Root';

export * from './types';
export * from './theme';
export * from './compositions/DocumentaryVideo';
export * from './components/BrollLayer';
export * from './components/Callouts/CalloutDispatcher';
export * from './components/Transitions';

// 11 Truly Unique Documentary Scene Layouts & Director
export { SceneLayoutDirector, resolveSceneLayout } from './components/Layouts/SceneLayoutDirector';
export { FullBleedCinematicLayout } from './components/Layouts/FullBleedCinematicLayout';
export { AmbientBlurFrameLayout } from './components/Layouts/AmbientBlurFrameLayout';
export { VintageCrtMonitorLayout } from './components/Layouts/VintageCrtMonitorLayout';
export { FilmstripSpoolReelLayout } from './components/Layouts/FilmstripSpoolReelLayout';
export { EditorialSidebarColumnLayout } from './components/Layouts/EditorialSidebarColumnLayout';
export { RedStringPinboardLayout } from './components/Layouts/RedStringPinboardLayout';
export { HorizonTopBottomSplitLayout } from './components/Layouts/HorizonTopBottomSplitLayout';
export { ParallaxTriptychGalleryLayout } from './components/Layouts/ParallaxTriptychGalleryLayout';
export { QuadSurveillanceMatrixLayout } from './components/Layouts/QuadSurveillanceMatrixLayout';
export { PolaroidScatterDeskLayout } from './components/Layouts/PolaroidScatterDeskLayout';
export { MagnifyingLoupeInspectorLayout } from './components/Layouts/MagnifyingLoupeInspectorLayout';

// 20 Unique Documentary Styles
export { NewspaperHeadline } from './components/DocumentaryStyles/NewspaperHeadline';
export { RedactedDossier } from './components/DocumentaryStyles/RedactedDossier';
export { PolaroidSnapshot } from './components/DocumentaryStyles/PolaroidSnapshot';
export { TypewriterPaper } from './components/DocumentaryStyles/TypewriterPaper';
export { MarkerCircle } from './components/DocumentaryStyles/MarkerCircle';
export { WiretapIntercept } from './components/DocumentaryStyles/WiretapIntercept';
export { EditorialLowerThird } from './components/DocumentaryStyles/EditorialLowerThird';
export { PoliceCrimeSheet } from './components/DocumentaryStyles/PoliceCrimeSheet';
export { OdometerStat } from './components/DocumentaryStyles/OdometerStat';
export { MapPinGeotag } from './components/DocumentaryStyles/MapPinGeotag';
export { EditorialQuote } from './components/DocumentaryStyles/EditorialQuote';
export { SocialTweetCard } from './components/DocumentaryStyles/SocialTweetCard';
export { RedditThreadCard } from './components/DocumentaryStyles/RedditThreadCard';
export { CautionTapeBanner } from './components/DocumentaryStyles/CautionTapeBanner';
export { ArchivalEvidenceTag } from './components/DocumentaryStyles/ArchivalEvidenceTag';
export { SplitMilestoneCard } from './components/DocumentaryStyles/SplitMilestoneCard';
export { KaraokeCaptions } from './components/DocumentaryStyles/KaraokeCaptions';
export { FullScreenChapterTitle } from './components/DocumentaryStyles/FullScreenChapterTitle';
export { CourtTranscriptCard } from './components/DocumentaryStyles/CourtTranscriptCard';
export { ForensicDataCard } from './components/DocumentaryStyles/ForensicDataCard';

// Legacy fallbacks
export { StatCallout } from './components/Callouts/StatCallout';
export { LowerThird } from './components/Callouts/LowerThird';
export { LocationBadge } from './components/Callouts/LocationBadge';
export { EvidenceTag } from './components/Callouts/EvidenceTag';
export { QuoteCard } from './components/Callouts/QuoteCard';
export { ChapterHeader } from './components/Callouts/ChapterHeader';
export { HighlightPill } from './components/Callouts/HighlightPill';
export { SplitTitle } from './components/Callouts/SplitTitle';
export { TickerBar } from './components/Callouts/TickerBar';
export { CornerTag } from './components/Callouts/CornerTag';
export { FullScreenTitle } from './components/Callouts/FullScreenTitle';
export { BreakingNews } from './components/Callouts/BreakingNews';
export { NumberBadge } from './components/Callouts/NumberBadge';

export * from './Root';

// Register Root for Remotion CLI / preview / bundler
registerRoot(RemotionRoot);
