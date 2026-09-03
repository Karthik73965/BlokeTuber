'use client';

import { useState, useCallback, useRef, useEffect, use } from 'react';
import Link from 'next/link';
import styles from '../../../../dashboard.module.css';
import { Timeline, Chapter, Project, PacingSpeed } from '@repo/shared';
import { RemotionPreviewModal } from '../../../../components/RemotionPreviewModal';
import { ClipSwapModal } from '../../../../components/ClipSwapModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type PipelineStep =
  | 'idle'
  | 'audio_assembly'
  | 'alignment'
  | 'ai_planning'
  | 'timing_alignment'
  | 'media_resolution'
  | 'building_timeline'
  | 'rendering_video'
  | 'completed'
  | 'error';

interface JobStatus {
  id: string;
  status: string;
  step: PipelineStep;
  errorMessage?: string;
  outputPath?: string;
}

const STEP_LABELS: Record<string, string> = {
  audio_assembly: '01. Audio Stitch',
  alignment: '02. Whisper Sync',
  ai_planning: '03. AI Director Plan',
  timing_alignment: '04. Snap Timings',
  media_resolution: '05. 4K Stock Sourcing',
  building_timeline: '06. Storyboard Assembly',
  rendering_video: '07. Remotion React Render',
  completed: '08. Ready!',
  error: 'Pipeline Error',
};

const STEP_ORDER = [
  'audio_assembly',
  'alignment',
  'ai_planning',
  'media_resolution',
  'building_timeline',
];

function StepIndicator({ current }: { current: PipelineStep }) {
  const currentIdx = STEP_ORDER.indexOf(current);
  return (
    <div className={styles.stepIndicator}>
      {STEP_ORDER.map((step, idx) => {
        const isDone = idx < currentIdx || current === 'completed';
        const isActive = idx === currentIdx && current !== 'completed';
        return (
          <div
            key={step}
            className={[
              styles.step,
              isDone ? styles.stepDone : '',
              isActive ? styles.stepActive : '',
            ].join(' ')}
          >
            <span className={styles.stepNum}>STEP 0{idx + 1}</span>
            <span>{STEP_LABELS[step]}</span>
          </div>
        );
      })}
    </div>
  );
}

export default function ChapterStudioPage({
  params,
}: {
  params: Promise<{ projectId: string; chapterId: string }>;
}) {
  const resolvedParams = use(params);
  const { projectId, chapterId } = resolvedParams;

  const [project, setProject] = useState<Project | null>(null);
  const [chapter, setChapter] = useState<Chapter | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);

  // Editing state
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [isEditingScript, setIsEditingScript] = useState(false);
  const [scriptInput, setScriptInput] = useState('');
  const [voiceoverFiles, setVoiceoverFiles] = useState<File[]>([]);
  const [pacing, setPacing] = useState<PacingSpeed>('medium');
  const [clipLibraryRoot, setClipLibraryRoot] = useState('');

  // Pipeline execution & telemetry
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [swapModalClip, setSwapModalClip] = useState<{
    clipIndex: number;
    slotIndex?: number;
    query: string;
    mediaType: 'video' | 'image';
    clipLibraryRoot?: string;
  } | null>(null);

  const pollTimer = useRef<any>(null);
  const elapsedTimer = useRef<any>(null);

  // Fetch Project & Chapter
  const fetchChapterData = async () => {
    try {
      const [projRes, chapRes, timelineRes] = await Promise.all([
        fetch(`${API_URL}/api/projects/${projectId}`),
        fetch(`${API_URL}/api/projects/${projectId}/chapters/${chapterId}`),
        fetch(`${API_URL}/api/pipeline/chapter-timeline/${projectId}/${chapterId}`),
      ]);

      if (projRes.ok) {
        const projData = await projRes.json();
        setProject(projData.project);
      }

      if (chapRes.ok) {
        const chapData = await chapRes.json();
        const ch: Chapter = chapData.chapter;
        setChapter(ch);
        setTitleInput(ch.title);
        setDescInput(ch.description || '');
        setScriptInput(ch.scriptText || '');
        if (ch.pacing) setPacing(ch.pacing);
        if (ch.clipLibraryRoot) setClipLibraryRoot(ch.clipLibraryRoot);
      }

      if (timelineRes.ok) {
        const tData = await timelineRes.json();
        if (tData.timeline) {
          setTimeline(tData.timeline);
        }
      }
    } catch (err) {
      console.error('Failed to load chapter studio:', err);
    }
  };

  useEffect(() => {
    fetchChapterData();
  }, [projectId, chapterId]);

  useEffect(() => {
    return () => {
      if (pollTimer.current) clearInterval(pollTimer.current);
      if (elapsedTimer.current) clearInterval(elapsedTimer.current);
    };
  }, []);

  // Save Meta Updates
  const handleSaveMeta = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}/chapters/${chapterId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: titleInput.trim(),
          description: descInput.trim(),
          scriptText: scriptInput.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setChapter(data.chapter);
        setIsEditingMeta(false);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  // Start Polling Job
  const startPolling = (jobId: string, isRenderStage: boolean) => {
    if (pollTimer.current) clearInterval(pollTimer.current);
    if (elapsedTimer.current) clearInterval(elapsedTimer.current);

    setElapsedSeconds(0);
    elapsedTimer.current = setInterval(() => setElapsedSeconds((s) => s + 1), 1000);

    pollTimer.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/pipeline/status/${jobId}`);
        if (!res.ok) return;
        const raw = await res.json();
        const data: JobStatus = raw.job || raw;
        setJobStatus(data);

        if (data.status === 'completed' || data.status === 'error') {
          clearInterval(pollTimer.current);
          clearInterval(elapsedTimer.current);
          await fetchChapterData();
        }
      } catch {}
    }, 1500);
  };

  // Stage 1: Generate Visual Storyboard
  const handlePlanStoryboard = async () => {
    if (!voiceoverFiles.length && !chapter?.voiceoverFileName) {
      setError('Please upload a spoken voiceover narration audio file (.mp3, .wav)');
      return;
    }
    setError(null);

    setJobStatus({
      id: 'starting',
      status: 'running',
      step: 'audio_assembly',
    });

    const formData = new FormData();
    formData.append('projectId', projectId);
    formData.append('chapterId', chapterId);
    formData.append('scriptText', scriptInput || chapter?.scriptText || '');
    formData.append('pacing', pacing);
    formData.append('clipLibraryRoot', clipLibraryRoot);

    for (const f of voiceoverFiles) {
      formData.append('voiceovers', f);
    }

    try {
      const res = await fetch(`${API_URL}/api/pipeline/plan-storyboard`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to generate visual storyboard');
      }

      const { jobId } = await res.json();
      startPolling(jobId, false);
    } catch (err) {
      setError(String(err));
      setJobStatus({ id: 'error', status: 'error', step: 'error', errorMessage: String(err) });
    }
  };

  // Stage 2: Render Final Video
  const handleRenderFinalVideo = async () => {
    setError(null);
    setJobStatus({
      id: 'rendering',
      status: 'running',
      step: 'rendering_video',
    });

    try {
      const res = await fetch(`${API_URL}/api/pipeline/render-storyboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, chapterId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to start video rendering');
      }

      const { jobId } = await res.json();
      startPolling(jobId, true);
    } catch (err) {
      setError(String(err));
      setJobStatus({ id: 'error', status: 'error', step: 'error', errorMessage: String(err) });
    }
  };

  const isRunning = jobStatus?.status === 'running';

  if (!chapter) {
    return (
      <div className={styles.root}>
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
          ⏳ Loading Chapter Studio...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {/* Top Editorial Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <Link href={`/project/${projectId}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={styles.brandIcon}>🎬</span>
              <div>
                <div className={styles.brandName}>BLOKETUBER STUDIO</div>
                <div className={styles.brandSub}>CHAPTER DIRECTING WORKSPACE</div>
              </div>
            </Link>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.breadcrumb}>
              <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Projects
              </Link>
              <span>/</span>
              <Link href={`/project/${projectId}`} style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                {project?.name || 'Project'}
              </Link>
              <span>/</span>
              <span className={styles.breadcrumbActive}>Chapter 0{chapter.chapterIndex}</span>
            </div>

            {timeline && (
              <button className={styles.secondaryBtn} onClick={() => setPreviewModalOpen(true)}>
                👁️ Timeline Live Preview
              </button>
            )}

            {timeline && (
              <button
                className={styles.primaryBtn}
                onClick={handleRenderFinalVideo}
                disabled={isRunning}
              >
                {isRunning ? '⏳ Rendering Final MP4...' : '🚀 Render Final Video'}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Workspace Content */}
      <main className={styles.mainContainer}>
        {error && (
          <div
            style={{
              backgroundColor: 'var(--error-bg)',
              border: '1px solid var(--error-border)',
              color: 'var(--error)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 20,
              fontSize: 14,
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span>⚠️ {error}</span>
            <button
              style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontWeight: 700 }}
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        )}

        {/* ── CHAPTER HERO CARD ────────────────────────────────────────── */}
        <div className={styles.workspaceHero} style={{ marginBottom: 24 }}>
          <div className={styles.chapterTitleGroup}>
            <div className={styles.chapterMetaRow}>
              <span className={styles.chapterNumberPill}>CHAPTER 0{chapter.chapterIndex}</span>
              <span
                className={[
                  styles.statusBadge,
                  chapter.status === 'completed'
                    ? styles.statusCompleted
                    : chapter.status === 'staged'
                    ? styles.statusProcessing
                    : isRunning
                    ? styles.statusProcessing
                    : styles.statusDraft,
                ].join(' ')}
              >
                {isRunning
                  ? `⚡ RUNNING (${elapsedSeconds}s)`
                  : chapter.status === 'completed'
                  ? '✅ FINAL VIDEO READY'
                  : chapter.status === 'staged'
                  ? '📋 STORYBOARD STAGED & READY FOR REVIEW'
                  : 'DRAFT'}
              </span>
            </div>
            <h1 className={styles.chapterMainTitle}>{chapter.title}</h1>
          </div>

          <button className={styles.secondaryBtn} onClick={() => setIsEditingMeta(!isEditingMeta)}>
            {isEditingMeta ? '✕ Cancel' : '✏️ Edit Title & Director Brief'}
          </button>
        </div>

        {/* Edit Meta Drawer */}
        {isEditingMeta && (
          <div className={styles.sectionCard} style={{ marginBottom: 24, border: '2px solid var(--gold-primary)' }}>
            <h4 className={styles.sectionTitle}>Edit Chapter Title & Director Brief</h4>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Chapter Title</label>
              <input
                type="text"
                className={styles.formInput}
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Visual & Pacing Description (Character Demographics, Tone, Environment)
              </label>
              <textarea
                className={styles.scriptEditor}
                style={{ minHeight: 90 }}
                placeholder="e.g. 70-year-old elderly woman, vintage 1995 camper van, rural desert highway, slow atmospheric pacing, no modern office workers or young people."
                value={descInput}
                onChange={(e) => setDescInput(e.target.value)}
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                This is strictly enforced by the AI Director to guarantee 100% thematic visual consistency.
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <button className={styles.secondaryBtn} onClick={() => setIsEditingMeta(false)}>
                Cancel
              </button>
              <button className={styles.primaryBtn} onClick={handleSaveMeta}>
                Save Changes
              </button>
            </div>
          </div>
        )}

        {/* ── DIRECTOR BRIEF BADGE ──────────────────────────────────────── */}
        {chapter.description && !isEditingMeta && (
          <div
            style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FDE68A',
              padding: '14px 20px',
              borderRadius: 'var(--radius-md)',
              marginBottom: 24,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 20 }}>🎬</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Active Director Brief & Setting Anchor:
              </div>
              <div style={{ fontSize: 14, color: '#78350F', marginTop: 2, lineHeight: 1.5, fontStyle: 'italic' }}>
                "{chapter.description}"
              </div>
            </div>
          </div>
        )}

        {/* ── FINAL RENDERED VIDEO (When Ready) ────────────────────────── */}
        {chapter.status === 'completed' && chapter.videoPath && (
          <div className={styles.videoPlayerCard} style={{ marginBottom: 24 }}>
            <div className={styles.videoHeader}>
              <span>🎬 Rendered Chapter Video</span>
              <a
                href={`${API_URL}/api/pipeline/chapter-video/${projectId}/${chapterId}`}
                download={`chapter_${chapter.chapterIndex}.mp4`}
                className={styles.primaryBtn}
                style={{ padding: '4px 12px', fontSize: 12 }}
              >
                ⬇ Download Chapter MP4
              </a>
            </div>
            <div className={styles.videoWrapper}>
              <video
                src={`${API_URL}/api/pipeline/chapter-video/${projectId}/${chapterId}`}
                controls
                className={styles.videoPlayer}
              />
            </div>
          </div>
        )}

        {/* ── PIPELINE LIVE PROGRESS TRACKER ──────────────────────────── */}
        {isRunning && (
          <div className={styles.pipelineProgressCard} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 800, color: 'var(--gold-text)', fontFamily: 'Space Grotesk, sans-serif' }}>
                ⚡ {jobStatus?.step === 'rendering_video' ? 'REMOTION VIDEO RENDER IN PROGRESS' : 'AI DIRECTOR & ASSET SOURCING IN PROGRESS'}
              </span>
              <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: 'var(--text-muted)' }}>
                ⏱️ {elapsedSeconds}s Elapsed
              </span>
            </div>
            <StepIndicator current={jobStatus?.step || 'audio_assembly'} />
          </div>
        )}

        {/* ── SECTION 1: NARRATION AUDIO & SCRIPT DRAWER ───────────────── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginBottom: 28 }}>
          {/* Voiceover Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <span className={styles.sectionIcon}>🎙️</span>
                <div>
                  <h4 className={styles.sectionTitle}>Voiceover Narration Track</h4>
                  <span className={styles.sectionHint}>MP3 or WAV audio for Whisper speech alignment</span>
                </div>
              </div>
            </div>

            {chapter.voiceoverFileName ? (
              <div className={styles.audioFileDisplay}>
                <div className={styles.audioFileInfo}>
                  <span className={styles.audioWaveIcon}>🎵</span>
                  <div>
                    <div className={styles.audioFileName}>{chapter.voiceoverFileName}</div>
                    <div className={styles.audioFileSub}>Attached to Chapter</div>
                  </div>
                </div>
                <button
                  className={styles.secondaryBtn}
                  onClick={() => {
                    const input = document.createElement('input');
                    input.type = 'file';
                    input.accept = 'audio/*';
                    input.onchange = (e: any) => {
                      if (e.target.files?.length) {
                        setVoiceoverFiles(Array.from(e.target.files));
                      }
                    };
                    input.click();
                  }}
                >
                  Change Audio
                </button>
              </div>
            ) : voiceoverFiles.length ? (
              <div className={styles.audioFileDisplay}>
                <div className={styles.audioFileInfo}>
                  <span className={styles.audioWaveIcon}>🎵</span>
                  <div>
                    <div className={styles.audioFileName}>{voiceoverFiles[0]!.name}</div>
                    <div className={styles.audioFileSub}>
                      {(voiceoverFiles[0]!.size / (1024 * 1024)).toFixed(2)} MB • Ready
                    </div>
                  </div>
                </div>
                <button className={styles.secondaryBtn} onClick={() => setVoiceoverFiles([])}>
                  Remove
                </button>
              </div>
            ) : (
              <div
                className={styles.dropZone}
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'audio/*';
                  input.onchange = (e: any) => {
                    if (e.target.files?.length) {
                      setVoiceoverFiles(Array.from(e.target.files));
                    }
                  };
                  input.click();
                }}
              >
                <span className={styles.dropIcon}>🎙️</span>
                <span className={styles.dropLabel}>Upload Spoken Voiceover Narration</span>
                <span className={styles.dropHint}>Click to select .mp3 or .wav narration file</span>
              </div>
            )}
          </div>

          {/* Script Card */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <span className={styles.sectionIcon}>📜</span>
                <div>
                  <h4 className={styles.sectionTitle}>Spoken Script Text</h4>
                  <span className={styles.sectionHint}>Used by AI Director to plan 5–7s hero beats & callouts</span>
                </div>
              </div>
              <button
                className={styles.secondaryBtn}
                onClick={() => setIsEditingScript(!isEditingScript)}
              >
                {isEditingScript ? '✓ Done' : '✏️ Edit'}
              </button>
            </div>

            {isEditingScript ? (
              <textarea
                className={styles.scriptEditor}
                value={scriptInput}
                onChange={(e) => setScriptInput(e.target.value)}
                placeholder="Paste the narration script for this chapter..."
              />
            ) : (
              <div className={styles.scriptPreviewBox}>
                {scriptInput || chapter.scriptText || (
                  <span style={{ color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                    No script text provided. (Whisper STT will auto-transcribe spoken audio).
                  </span>
                )}
              </div>
            )}


            {/* Local Clip Library Folder */}
            <div className={styles.formGroup} style={{ marginBottom: 12 }}>
              <label className={styles.formLabel} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span>📁</span> Local Clip Library Folder <span style={{ color: 'var(--text-muted)', fontWeight: 400, fontSize: 11 }}>(optional — server-side absolute path to your .mp4 clip folder)</span>
              </label>
              <input
                type="text"
                className={styles.formInput}
                value={clipLibraryRoot}
                onChange={(e) => setClipLibraryRoot(e.target.value)}
                placeholder="e.g. C:\\Users\\karth\\Videos\\BlokeTuberClips or /home/user/clips"
                style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}
              />
            </div>

            {/* Pacing Speed Selector */}
            <div className={styles.pacingSelectorGroup}>
              <div className={styles.pacingHeader}>
                <span className={styles.pacingLabel}>⏱️ Video Pacing & Cut Velocity</span>
                <span className={styles.pacingHint}>Select clip duration style</span>
              </div>
              <div className={styles.pacingOptions}>
                <div
                  className={[
                    styles.pacingOption,
                    pacing === 'low' ? styles.pacingOptionActive : '',
                  ].join(' ')}
                  onClick={() => setPacing('low')}
                >
                  <span className={styles.pacingTitle}>🐢 Relaxed</span>
                  <span className={styles.pacingDuration}>5–7.5s / clip</span>
                </div>
                <div
                  className={[
                    styles.pacingOption,
                    pacing === 'medium' ? styles.pacingOptionActive : '',
                  ].join(' ')}
                  onClick={() => setPacing('medium')}
                >
                  <span className={styles.pacingTitle}>⚖️ Balanced</span>
                  <span className={styles.pacingDuration}>3–4.5s / clip</span>
                </div>
                <div
                  className={[
                    styles.pacingOption,
                    pacing === 'high' ? styles.pacingOptionActive : '',
                  ].join(' ')}
                  onClick={() => setPacing('high')}
                >
                  <span className={styles.pacingTitle}>⚡ Fast & Punchy</span>
                  <span className={styles.pacingDuration}>1–3s / clip (max 5s)</span>
                </div>
              </div>
            </div>

            <div className={styles.scriptMetaRow}>
              <span>
                Words: <strong>{(scriptInput || chapter.scriptText || '').trim().split(/\s+/).filter(Boolean).length}</strong>
              </span>
              <button
                className={styles.primaryBtn}
                onClick={handlePlanStoryboard}
                disabled={isRunning}
                style={{ padding: '6px 14px', fontSize: 13 }}
              >
                {isRunning ? '⏳ Planning...' : '🎬 Stage 1: Plan Visual Storyboard'}
              </button>
            </div>
          </div>
        </div>

        {/* ── SECTION 2: INTERACTIVE VISUAL STORYBOARD GRID ─────────────── */}
        {timeline?.clips && timeline.clips.length > 0 && (
          <div className={styles.sectionCard} style={{ marginTop: 10 }}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitleGroup}>
                <span className={styles.sectionIcon}>🎞️</span>
                <div>
                  <h3 className={styles.sectionTitle}>
                    Interactive Visual Storyboard ({timeline.clips.length} Beats)
                  </h3>
                  <span className={styles.sectionHint}>
                    Inspect every clip before rendering. Click <strong>"Swap Clip"</strong> on any beat to pick in-context alternatives!
                  </span>
                </div>
              </div>

              <button
                className={styles.primaryBtn}
                onClick={handleRenderFinalVideo}
                disabled={isRunning}
              >
                {isRunning ? '⏳ Rendering Final MP4...' : '🚀 Stage 2: Render Final Video'}
              </button>
            </div>

            {/* Beat Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: 20,
                marginTop: 16,
              }}
            >
              {timeline.clips.map((clip, idx) => {
                const duration = (clip.endTime - clip.startTime).toFixed(1);
                const isHero = clip.layout && clip.layout !== 'full_bleed_cinematic';

                return (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: '#FAF9F6',
                      border: isHero ? '2px solid var(--gold-border)' : '1px solid #E2E8F0',
                      borderRadius: 14,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      boxShadow: isHero ? '0 4px 12px rgba(217, 119, 6, 0.08)' : 'var(--shadow-sm)',
                    }}
                  >
                    {/* Media Preview Box */}
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', backgroundColor: '#000' }}>
                      {clip.clipPath ? (
                        clip.mediaType === 'video' || clip.clipPath.endsWith('.mp4') ? (
                          <video
                            src={clip.clipPath}
                            muted
                            loop
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <img
                            src={clip.clipPath}
                            alt={`Beat ${idx + 1}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                          No Media Resolved
                        </div>
                      )}

                      {/* Badges Over Video */}
                      <div style={{ position: 'absolute', top: 8, left: 8, display: 'flex', gap: 6 }}>
                        <span
                          style={{
                            background: 'rgba(15, 23, 42, 0.85)',
                            color: '#FFF',
                            fontSize: 10,
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: 800,
                            padding: '3px 6px',
                            borderRadius: 4,
                          }}
                        >
                          BEAT 0{idx + 1} • {duration}s
                        </span>
                        {isHero && (
                          <span
                            style={{
                              background: '#D97706',
                              color: '#FFF',
                              fontSize: 10,
                              fontFamily: 'JetBrains Mono, monospace',
                              fontWeight: 800,
                              padding: '3px 6px',
                              borderRadius: 4,
                            }}
                          >
                            🌟 HERO
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Beat Info */}
                    <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 10, flex: 1, justifyContent: 'space-between' }}>
                      <div>
                        {/* Layout & Callout Tags */}
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                          <span
                            style={{
                              backgroundColor: '#EFF6FF',
                              color: '#1D4ED8',
                              border: '1px solid #BFDBFE',
                              fontSize: 10,
                              fontFamily: 'JetBrains Mono, monospace',
                              fontWeight: 700,
                              padding: '2px 6px',
                              borderRadius: 4,
                            }}
                          >
                            📐 {clip.layout || 'full_bleed_cinematic'}
                          </span>

                          {clip.callout && (
                            <span
                              style={{
                                backgroundColor: '#FEF3C7',
                                color: '#B45309',
                                border: '1px solid #FDE68A',
                                fontSize: 10,
                                fontFamily: 'JetBrains Mono, monospace',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              🏷️ {clip.callout.type}
                            </span>
                          )}

                          {clip.layoutData?.title && (
                            <span
                              style={{
                                backgroundColor: '#F1F5F9',
                                color: '#334155',
                                border: '1px solid #CBD5E1',
                                fontSize: 10,
                                fontFamily: 'JetBrains Mono, monospace',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              📄 {clip.layoutData.title}
                            </span>
                          )}

                          {clip.layoutData?.coords && (
                            <span
                              style={{
                                backgroundColor: '#F0FDF4',
                                color: '#166534',
                                border: '1px solid #BBF7D0',
                                fontSize: 10,
                                fontFamily: 'JetBrains Mono, monospace',
                                fontWeight: 700,
                                padding: '2px 6px',
                                borderRadius: 4,
                              }}
                            >
                              📍 {clip.layoutData.coords}
                            </span>
                          )}
                        </div>

                        {/* Spoken Narration Text */}
                        <p style={{ fontSize: 13, color: '#1E293B', fontStyle: 'italic', lineHeight: 1.4, margin: 0 }}>
                          "{clip.text || 'Narration segment'}"
                        </p>
                      </div>

                      {/* Multi-Asset Slots (if layout has additional feeds) */}
                      {clip.additionalClipPaths && clip.additionalClipPaths.length > 0 && (
                        <div style={{ borderTop: '1px dashed #E2E8F0', paddingTop: 8 }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 6 }}>
                            Multi-Asset Slot Feeds:
                          </div>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {clip.additionalClipPaths.map((slotPath, sIdx) => (
                              <div
                                key={sIdx}
                                style={{
                                  position: 'relative',
                                  width: 50,
                                  height: 32,
                                  borderRadius: 4,
                                  overflow: 'hidden',
                                  border: '1px solid #CBD5E1',
                                  cursor: 'pointer',
                                }}
                                onClick={() =>
                                  setSwapModalClip({
                                    clipIndex: idx,
                                    slotIndex: sIdx + 1,
                                    query: clip.text?.slice(0, 30) || '',
                                    mediaType: slotPath.endsWith('.jpg') ? 'image' : 'video',
                                    clipLibraryRoot,
                                  })
                                }
                                title="Click to swap this slot angle"
                              >
                                {slotPath.endsWith('.mp4') ? (
                                  <video src={slotPath} muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  <img src={slotPath} alt={`Slot ${sIdx + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Swap Action Button */}
                      <button
                        className={styles.secondaryBtn}
                        style={{ width: '100%', justifyContent: 'center', marginTop: 6 }}
                        onClick={() =>
                          setSwapModalClip({
                            clipIndex: idx,
                            query: clip.text?.slice(0, 40) || descInput || '',
                            mediaType: clip.mediaType || 'video',
                            clipLibraryRoot,
                          })
                        }
                      >
                        🔄 Swap Main Clip
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* ── CLIP SWAP MODAL ────────────────────────────────────────────── */}
      {swapModalClip && (
        <ClipSwapModal
          projectId={projectId}
          chapterId={chapterId}
          clipIndex={swapModalClip.clipIndex}
          slotIndex={swapModalClip.slotIndex}
          currentQuery={swapModalClip.query}
          currentMediaType={swapModalClip.mediaType}
          clipLibraryRoot={swapModalClip.clipLibraryRoot || clipLibraryRoot}
          onClose={() => setSwapModalClip(null)}
          onSwapped={(updatedTimeline) => setTimeline(updatedTimeline)}
        />
      )}

      {/* ── REMOTION LIVE PREVIEW MODAL ────────────────────────────────── */}
      {previewModalOpen && timeline && (
        <RemotionPreviewModal
          timeline={timeline}
          title={`Chapter 0${chapter.chapterIndex}: ${chapter.title}`}
          onClose={() => setPreviewModalOpen(false)}
        />
      )}
    </div>
  );
}
