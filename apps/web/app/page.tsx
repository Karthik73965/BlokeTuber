'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import styles from './dashboard.module.css';
import { Timeline } from '@repo/shared';
import { RemotionPreviewModal } from './components/RemotionPreviewModal';

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

interface UsedMediaItem {
  id: string;
  url: string;
  source: string;
  mediaType: 'image' | 'video';
  chapterIndex: number;
  query: string;
  usedAt: string;
}

interface Chapter {
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

interface Project {
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

interface JobStatus {
  id: string;
  status: string;
  step: PipelineStep;
  errorMessage?: string;
  outputPath?: string;
}

const STEP_LABELS: Record<string, string> = {
  audio_assembly: '01. Audio Assembly & Master Stitch',
  alignment: '02. Whisper Word-Level Alignment',
  ai_planning: '03. AI Director Scene Planning',
  timing_alignment: '04. Snap Word Timings & Boundaries',
  media_resolution: '05. 4K Stock Sourcing & Deduplication',
  building_timeline: '06. Timeline Assembly & Overlay Sync',
  rendering_video: '07. Remotion React Video Engine Render',
  completed: '08. Video Render Ready!',
  error: 'Pipeline Error',
};

const STEP_ORDER = [
  'audio_assembly',
  'alignment',
  'ai_planning',
  'media_resolution',
  'rendering_video',
  'completed',
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
            <span className={styles.stepNum}>{idx + 1}</span>
            <span>{STEP_LABELS[step]}</span>
          </div>
        );
      })}
    </div>
  );
}

function FileDropZone({
  label,
  accept,
  multiple,
  files,
  onFiles,
  icon,
  hint,
}: {
  label: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  onFiles: (files: File[]) => void;
  icon: string;
  hint?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const dropped = Array.from(e.dataTransfer.files);
      onFiles(dropped);
    },
    [onFiles]
  );

  return (
    <div
      className={[styles.dropZone, dragging ? styles.dropZoneDragging : ''].join(' ')}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => onFiles(Array.from(e.target.files || []))}
      />
      <span className={styles.dropIcon}>{icon}</span>
      <span className={styles.dropLabel}>{label}</span>
      {hint && <span className={styles.dropHint}>{hint}</span>}
      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map((f) => (
            <span key={f.name} className={styles.fileChip}>
              {f.name} ({(f.size / (1024 * 1024)).toFixed(1)}MB)
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [clipLibraryRoot, setClipLibraryRoot] = useState('');
  const [showVault, setShowVault] = useState(false);
  const [isStitching, setIsStitching] = useState(false);
  const [stitchedVideoUrl, setStitchedVideoUrl] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<{ timeline: Timeline; title: string } | null>(null);
  const [loadingPreviewId, setLoadingPreviewId] = useState<string | null>(null);

  const handleOpenRemotionPreview = async (chapter: Chapter) => {
    if (!selectedProjectId) return;
    setLoadingPreviewId(chapter.id);
    try {
      const res = await fetch(`${API_URL}/api/pipeline/chapter-timeline/${selectedProjectId}/${chapter.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data.timeline) {
          setPreviewData({
            timeline: data.timeline,
            title: `Chapter ${chapter.chapterIndex}: ${chapter.title}`,
          });
        }
      } else {
        alert('Timeline is not yet available for this chapter.');
      }
    } catch (err) {
      console.error('Failed to load timeline for preview:', err);
    } finally {
      setLoadingPreviewId(null);
    }
  };

  // Chapter Runner State
  const [chapterVoiceovers, setChapterVoiceovers] = useState<Record<string, File[]>>({});
  const [chapterScripts, setChapterScripts] = useState<Record<string, string>>({});
  const [jobStatuses, setJobStatuses] = useState<Record<string, JobStatus>>({});
  const [elapsedSeconds, setElapsedSeconds] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  const pollTimers = useRef<Record<string, any>>({});
  const elapsedTimers = useRef<Record<string, any>>({});

  // Fetch all projects
  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch {}
  };

  // Fetch single project detail
  const fetchProjectDetail = async (id: string) => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedProject(data.project || null);
      }
    } catch {}
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 6000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchProjectDetail(selectedProjectId);
    }
  }, [selectedProjectId]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      Object.values(pollTimers.current).forEach(clearInterval);
      Object.values(elapsedTimers.current).forEach(clearInterval);
    };
  }, []);

  // Create New Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProjectName.trim(),
          description: newProjectDesc.trim(),
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const created = data.project;
        // Auto-create Chapter 1
        await fetch(`${API_URL}/api/projects/${created.id}/chapters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'Chapter 1: The Hook', chapterIndex: 1 }),
        });
        setNewProjectName('');
        setNewProjectDesc('');
        setIsCreatingProject(false);
        await fetchProjects();
        setSelectedProjectId(created.id);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  // Add Chapter to Project
  const handleAddChapter = async () => {
    if (!selectedProjectId || !selectedProject) return;
    const nextIdx = (selectedProject.chapters?.length || 0) + 1;
    try {
      const res = await fetch(`${API_URL}/api/projects/${selectedProjectId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Chapter ${nextIdx}`,
          chapterIndex: nextIdx,
        }),
      });
      if (res.ok) {
        await fetchProjectDetail(selectedProjectId);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  // Poll Job Status
  const startPollingJob = (jobId: string, chapterId: string) => {
    if (pollTimers.current[jobId]) clearInterval(pollTimers.current[jobId]);
    if (elapsedTimers.current[chapterId]) clearInterval(elapsedTimers.current[chapterId]);

    setElapsedSeconds((prev) => ({ ...prev, [chapterId]: 0 }));
    elapsedTimers.current[chapterId] = setInterval(() => {
      setElapsedSeconds((prev) => ({ ...prev, [chapterId]: (prev[chapterId] || 0) + 1 }));
    }, 1000);

    pollTimers.current[jobId] = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/pipeline/status/${jobId}`);
        if (!res.ok) return;
        const raw = await res.json();
        const data: JobStatus = raw.job || raw;

        setJobStatuses((prev) => ({ ...prev, [chapterId]: data }));

        if (data.status === 'completed' || data.status === 'error') {
          clearInterval(pollTimers.current[jobId]);
          delete pollTimers.current[jobId];
          clearInterval(elapsedTimers.current[chapterId]);
          delete elapsedTimers.current[chapterId];
          if (selectedProjectId) {
            fetchProjectDetail(selectedProjectId);
          }
        }
      } catch {}
    }, 1500);
  };

  // Generate Chapter Video
  const handleGenerateChapter = async (chapter: Chapter) => {
    if (!selectedProjectId) return;
    const voiceoverList = chapterVoiceovers[chapter.id] || [];
    if (!voiceoverList.length) {
      setError(`Please upload a voiceover audio file for ${chapter.title}`);
      return;
    }

    setError(null);

    // Optimistic live status
    setJobStatuses((prev) => ({
      ...prev,
      [chapter.id]: {
        id: 'starting',
        status: 'running',
        step: 'audio_assembly',
      },
    }));

    const formData = new FormData();
    formData.append('projectId', selectedProjectId);
    formData.append('chapterId', chapter.id);
    formData.append('scriptText', chapterScripts[chapter.id] || chapter.scriptText || '');
    formData.append('clipLibraryRoot', clipLibraryRoot);

    for (const f of voiceoverList) {
      formData.append('voiceovers', f);
    }

    try {
      const res = await fetch(`${API_URL}/api/pipeline/start-chapter`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to start chapter');
      }

      const { jobId } = await res.json();
      startPollingJob(jobId, chapter.id);
    } catch (err) {
      setError(String(err));
      setJobStatuses((prev) => ({
        ...prev,
        [chapter.id]: {
          id: 'error',
          status: 'error',
          step: 'error',
          errorMessage: String(err),
        },
      }));
    }
  };

  // Stitch Master Project Video
  const handleStitchProject = async () => {
    if (!selectedProjectId) return;
    setIsStitching(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/pipeline/stitch-project/${selectedProjectId}`, {
        method: 'POST',
      });
      if (res.ok) {
        setStitchedVideoUrl(`${API_URL}/api/pipeline/project-video/${selectedProjectId}?t=${Date.now()}`);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Stitching failed');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsStitching(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE' });
      if (selectedProjectId === id) setSelectedProjectId(null);
      await fetchProjects();
    } catch {}
  };

  return (
    <div className={styles.root}>
      {/* Repli-Mono Studio Header & Telemetry */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>◈</span>
            <div>
              <div className={styles.brandName}>BLOKETUBER</div>
              <div className={styles.brandSub}>REPLI-MONO STUDIO V2</div>
            </div>
          </div>

          <div className={styles.telemetry}>
            <div className={`${styles.monoBadge} ${styles.monoBadgeActive}`}>
              <span className={styles.dotLive} />
              <span>ENGINE: READY</span>
            </div>
            <div className={styles.monoBadge}>WHISPER: SYNCED</div>
            <div className={styles.monoBadge}>FFMPEG: 8-STYLE</div>
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {error && (
          <div className={styles.errorBox}>
            ⚠️ ERROR: {error}
          </div>
        )}

        {/* VIEW 1: PROJECTS LIST */}
        {!selectedProjectId && (
          <>
            <div className={styles.hero}>
              <div className={styles.heroTag}>
                <span>◈</span>
                <span>INVESTIGATIVE DOCUMENTARY ENGINE</span>
              </div>
              <h1 className={styles.heroTitle}>
                Documentary Projects
              </h1>
              <p className={styles.heroSub}>
                Multi-chapter documentary director with persistent cross-chapter media deduplication, audio word synchronization, and broadcast typography.
              </p>
              <div className={styles.heroPills}>
                <span className={styles.pill}>[DYNAMIC_VIDEO_SELECTION]</span>
                <span className={styles.pill}>[8_ANIMATED_CALLOUTS]</span>
                <span className={styles.pill}>[ZERO_MEDIA_DUPLICATES]</span>
                <span className={styles.pill}>[PRECISION_AUDIO_SYNC]</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>
                  Projects Directory ({projects.length})
                </div>
                <button
                  className={styles.btnMonoCyan}
                  onClick={() => setIsCreatingProject(!isCreatingProject)}
                >
                  {isCreatingProject ? 'Cancel' : '+ New Project'}
                </button>
              </div>

              {isCreatingProject && (
                <form onSubmit={handleCreateProject} className={styles.form} style={{ marginTop: '8px' }}>
                  <input
                    className={styles.input}
                    placeholder="Project Name (e.g. Steve Irwin Cabin Mystery)"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    autoFocus
                  />
                  <input
                    className={styles.input}
                    placeholder="Description / Story Logline (Optional)"
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                  />
                  <button type="submit" className={styles.btnLaunch}>
                    INITIALIZE PROJECT & CHAPTER 1 →
                  </button>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '8px' }}>
                {projects.length === 0 && !isCreatingProject && (
                  <div style={{ textAlign: 'center', color: '#71717a', padding: '36px', fontFamily: 'JetBrains Mono, monospace', fontSize: '13px' }}>
                    [NO ACTIVE PROJECTS] Click <strong>+ New Project</strong> to begin.
                  </div>
                )}

                {projects.map((p) => {
                  const completedCount = (p.chapters || []).filter((c) => c.status === 'completed').length;
                  const totalMedia = p.usedMedia?.length || 0;
                  return (
                    <div
                      key={p.id}
                      className={styles.card}
                      style={{ cursor: 'pointer', padding: '16px 20px', background: '#0e0e12' }}
                      onClick={() => setSelectedProjectId(p.id)}
                    >
                      <div className={styles.cardHeader}>
                        <div>
                          <div style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                            {p.name}
                          </div>
                          {p.description && (
                            <div style={{ fontSize: '12px', color: '#71717a', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
                              {p.description}
                            </div>
                          )}
                        </div>
                        <button
                          style={{
                            background: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.2)',
                            color: '#f87171',
                            cursor: 'pointer',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px',
                          }}
                          onClick={(e) => handleDeleteProject(p.id, e)}
                        >
                          DELETE
                        </button>
                      </div>

                      <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: '#a1a1aa', fontFamily: 'JetBrains Mono, monospace', marginTop: '6px' }}>
                        <span>[CHAPTERS: {p.chapters?.length || 0}]</span>
                        <span style={{ color: completedCount > 0 ? '#34d399' : '#a1a1aa' }}>[RENDERED: {completedCount}]</span>
                        <span style={{ color: '#22d3ee' }}>[DEDUP_MEDIA: {totalMedia}]</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* VIEW 2: PROJECT DETAIL & CHAPTER RUNNER */}
        {selectedProjectId && selectedProject && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className={styles.btnMono}
                onClick={() => setSelectedProjectId(null)}
              >
                ← ALL PROJECTS
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className={styles.btnMonoAmber}
                  onClick={() => setShowVault(!showVault)}
                >
                  🔒 VAULT ({selectedProject.usedMedia?.length || 0})
                </button>

                <button
                  className={styles.btnMonoCyan}
                  onClick={handleAddChapter}
                >
                  + ADD CHAPTER
                </button>
              </div>
            </div>

            {/* Project Header Banner */}
            <div className={styles.card} style={{ borderLeft: '3px solid #06b6d4' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#06b6d4' }}>
                    PROJECT WORKSPACE
                  </div>
                  <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#ffffff', fontFamily: 'Space Grotesk, sans-serif' }}>
                    {selectedProject.name}
                  </h2>
                  <p style={{ color: '#a1a1aa', fontSize: '13px', marginTop: '2px', fontFamily: 'JetBrains Mono, monospace' }}>
                    {selectedProject.description || 'Documentary Multi-Chapter Production'}
                  </p>
                </div>
                <div className={styles.monoBadge}>
                  {selectedProject.chapters?.length || 0} CHAPTERS
                </div>
              </div>

              {/* Local Clip Library Root Config */}
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontSize: '11px', color: '#71717a', fontFamily: 'JetBrains Mono, monospace' }}>LOCAL CLIPS DIR:</span>
                <input
                  className={styles.input}
                  style={{ padding: '6px 10px', fontSize: '11px', maxWidth: '380px' }}
                  placeholder="C:\Users\...\Videos\Clips"
                  value={clipLibraryRoot}
                  onChange={(e) => setClipLibraryRoot(e.target.value)}
                />
              </div>

              {/* Master Stitched Video Player / Button */}
              {selectedProject.chapters?.some((c) => c.status === 'completed') && (
                <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#34d399' }}>
                        MASTER FULL-LENGTH MOVIE
                      </div>
                      <p style={{ fontSize: '11px', color: '#71717a', fontFamily: 'JetBrains Mono, monospace' }}>
                        Stitches all completed chapters in timeline order.
                      </p>
                    </div>
                    <button
                      className={styles.btnMonoCyan}
                      onClick={handleStitchProject}
                      disabled={isStitching}
                    >
                      {isStitching ? <span className={styles.spinner} /> : '⚡ COMBINE & EXPORT MASTER MP4'}
                    </button>
                  </div>

                  {stitchedVideoUrl && (
                    <div style={{ marginTop: '12px' }}>
                      <video
                        src={stitchedVideoUrl}
                        controls
                        style={{ width: '100%', borderRadius: '6px', maxHeight: '420px', background: '#000', border: '1px solid rgba(6,182,212,0.3)' }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Media Vault Inspector */}
            {showVault && (
              <div className={styles.card} style={{ background: '#09090b', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                <div className={styles.cardHeader}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '13px', fontWeight: 700, color: '#fbbf24' }}>
                    🔒 DEDUPLICATION REGISTRY ({selectedProject.usedMedia?.length || 0} ITEMS)
                  </div>
                  <span style={{ fontSize: '11px', color: '#71717a', fontFamily: 'JetBrains Mono, monospace' }}>
                    These media items are excluded from future chapters
                  </span>
                </div>
                <div className={styles.vaultGrid}>
                  {selectedProject.usedMedia?.length === 0 && (
                    <div style={{ color: '#71717a', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
                      No media used yet. Generate a chapter to populate the vault.
                    </div>
                  )}
                  {selectedProject.usedMedia?.map((m, idx) => (
                    <div key={idx} className={styles.vaultItem}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#06b6d4', fontWeight: 700 }}>[{m.mediaType.toUpperCase()}]</span>
                        <span style={{ color: '#fbbf24' }}>CH.{m.chapterIndex}</span>
                      </div>
                      <span style={{ color: '#e4e4e7', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                        {m.query || m.source}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CHAPTERS LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {(selectedProject.chapters || []).map((chapter) => {
                const jobStatus = jobStatuses[chapter.id];
                const isRunning = jobStatus?.status === 'running' || chapter.status === 'processing';
                const isDone = chapter.status === 'completed' || jobStatus?.status === 'completed';
                const currentStep = jobStatus?.step || (isRunning ? 'audio_assembly' : 'idle');
                const elapsed = elapsedSeconds[chapter.id] || 0;
                const version = chapter.updatedAt ? new Date(chapter.updatedAt).getTime() : chapter.id;
                const chapterVideoUrl = `${API_URL}/api/pipeline/chapter-video/${selectedProjectId}/${chapter.id}?v=${version}`;

                return (
                  <div key={chapter.id} className={styles.card}>
                    <div className={styles.cardHeader}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className={styles.monoBadge}>
                          CH.{chapter.chapterIndex}
                        </span>
                        <input
                          style={{
                            background: 'transparent',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 700,
                            color: '#ffffff',
                            fontFamily: 'Space Grotesk, sans-serif',
                            outline: 'none',
                          }}
                          defaultValue={chapter.title}
                          onBlur={(e) => {
                            fetch(`${API_URL}/api/projects/${selectedProjectId}/chapters/${chapter.id}`, {
                              method: 'PATCH',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ title: e.target.value }),
                            });
                          }}
                        />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {isRunning && (
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#06b6d4' }}>
                            ⏱️ {elapsed}s
                          </span>
                        )}
                        <span className={[
                          styles.statusBadge,
                          isDone ? styles.statusDone : isRunning ? styles.statusRunning : '',
                        ].join(' ')}>
                          {isRunning ? 'PROCESSING' : isDone ? 'COMPLETED' : 'DRAFT'}
                        </span>
                      </div>
                    </div>

                    {/* Step Progress Terminal while running */}
                    {isRunning && (
                      <div className={styles.terminalBox}>
                        <div className={styles.terminalHeader}>
                          <span>◈ PIPELINE EXECUTION TERMINAL</span>
                          <span style={{ color: '#06b6d4' }}>ACTIVE STEP: {currentStep.toUpperCase()}</span>
                        </div>
                        <StepIndicator current={currentStep} />
                      </div>
                    )}

                    {/* Completed Video Player */}
                    {isDone && (
                      <div className={styles.doneBox}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '12px', color: '#34d399', fontWeight: 700 }}>
                            ✓ CHAPTER {chapter.chapterIndex} RENDER COMPLETE
                          </span>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              className={styles.btnMonoCyan}
                              style={{ padding: '4px 10px', fontSize: '11px', cursor: 'pointer' }}
                              onClick={() => handleOpenRemotionPreview(chapter)}
                              disabled={loadingPreviewId === chapter.id}
                            >
                              {loadingPreviewId === chapter.id ? '⌛ LOADING...' : '👁️ REMOTION PREVIEW'}
                            </button>
                            <a
                              href={chapterVideoUrl}
                              download={`Chapter_${chapter.chapterIndex}_${selectedProject.name}.mp4`}
                              className={styles.btnMonoCyan}
                              style={{ textDecoration: 'none', padding: '4px 10px', fontSize: '11px' }}
                            >
                              ⬇️ DOWNLOAD MP4
                            </a>
                          </div>
                        </div>
                        <video
                          src={chapterVideoUrl}
                          controls
                          style={{ width: '100%', borderRadius: '6px', maxHeight: '340px', background: '#000', border: '1px solid rgba(255,255,255,0.1)' }}
                        />
                      </div>
                    )}

                    {/* Voiceover Upload & Script Form */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <FileDropZone
                        label={chapterVoiceovers[chapter.id]?.length ? 'Voiceover Attached' : `Upload Voiceover Audio for ${chapter.title}`}
                        accept="audio/*,.mp3,.wav,.m4a,.aac"
                        files={chapterVoiceovers[chapter.id] || []}
                        onFiles={(files) => setChapterVoiceovers((prev) => ({ ...prev, [chapter.id]: files }))}
                        icon="🎙️"
                        hint="MP3, WAV, M4A — Whisper aligns words with sub-second accuracy"
                      />

                      <textarea
                        className={styles.textarea}
                        placeholder={`Optional: Script for Chapter ${chapter.chapterIndex} (Leave blank to auto-transcribe with Whisper)`}
                        value={chapterScripts[chapter.id] ?? chapter.scriptText ?? ''}
                        onChange={(e) => setChapterScripts((prev) => ({ ...prev, [chapter.id]: e.target.value }))}
                      />

                      <button
                        className={styles.btnLaunch}
                        onClick={() => handleGenerateChapter(chapter)}
                        disabled={isRunning}
                      >
                        {isRunning ? (
                          <>
                            <span className={styles.spinner} />
                            RENDERING CHAPTER {chapter.chapterIndex} ({elapsed}s)…
                          </>
                        ) : (
                          `🎬 GENERATE CHAPTER ${chapter.chapterIndex} VIDEO`
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Remotion Live Scrubbing & Animation Preview Modal */}
        {previewData && (
          <RemotionPreviewModal
            timeline={previewData.timeline}
            title={previewData.title}
            onClose={() => setPreviewData(null)}
          />
        )}
      </main>
    </div>
  );
}
