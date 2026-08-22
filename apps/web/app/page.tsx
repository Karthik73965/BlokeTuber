'use client';

import { useState, useCallback, useRef } from 'react';
import styles from './dashboard.module.css';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type PipelineStep =
  | 'idle'
  | 'audio_assembly'
  | 'alignment'
  | 'ai_planning'
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
  timelineJson?: unknown;
}

const STEP_LABELS: Record<string, string> = {
  audio_assembly: 'Stitching audio chapters…',
  alignment: 'Whisper audio transcription…',
  ai_planning: 'AI Director directing scenes…',
  media_resolution: 'Sourcing 4K photos & videos…',
  building_timeline: 'Building timeline…',
  rendering_video: 'Rendering final MP4 with FFmpeg…',
  completed: 'Video render ready!',
  error: 'Pipeline error',
};

const STEP_ORDER = [
  'audio_assembly',
  'alignment',
  'ai_planning',
  'media_resolution',
  'building_timeline',
  'rendering_video',
  'completed',
];

function StepIndicator({ current }: { current: PipelineStep }) {
  const currentIdx = STEP_ORDER.indexOf(current);
  return (
    <div className={styles.stepIndicator}>
      {STEP_ORDER.map((step, idx) => (
        <div
          key={step}
          className={[
            styles.step,
            idx < currentIdx ? styles.stepDone : '',
            idx === currentIdx ? styles.stepActive : '',
          ].join(' ')}
        >
          <div className={styles.stepDot}>
            {idx < currentIdx ? '✓' : idx + 1}
          </div>
          <span className={styles.stepLabel}>{STEP_LABELS[step] || step}</span>
        </div>
      ))}
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
          {files.slice(0, 5).map((f) => (
            <span key={f.name} className={styles.fileChip}>{f.name}</span>
          ))}
          {files.length > 5 && (
            <span className={styles.fileChip}>+{files.length - 5} more</span>
          )}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [projectName, setProjectName] = useState('');
  const [scriptText, setScriptText] = useState('');
  const [voiceovers, setVoiceovers] = useState<File[]>([]);
  const [clips, setClips] = useState<File[]>([]);
  const [clipLibraryRoot, setClipLibraryRoot] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pollStatus = useCallback((jId: string) => {
    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${API_URL}/api/pipeline/status/${jId}`);
        const data = await res.json();
        setJobStatus(data.job);
        if (data.job.status === 'completed' || data.job.status === 'error') {
          if (pollRef.current) clearInterval(pollRef.current);
        }
      } catch {
        // ignore transient errors
      }
    }, 2500);
  }, []);

  const handleStart = async () => {
    setError(null);
    if (!projectName.trim()) return setError('Enter a project name');
    if (voiceovers.length === 0) return setError('Upload at least one voiceover file');

    setLoading(true);
    try {
      // Step A: Create project (scriptText is optional)
      const projRes = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: projectName, scriptText: scriptText.trim() }),
      });
      const projData = await projRes.json();
      if (!projRes.ok) throw new Error(projData.error || 'Failed to create project');
      const pId = projData.project.id;

      // Step B: Upload clips if any
      if (clips.length > 0) {
        const clipForm = new FormData();
        clips.forEach((f) => clipForm.append('clips', f));
        await fetch(`${API_URL}/api/clips/${pId}`, { method: 'POST', body: clipForm });
      }

      // Step C: Start pipeline
      const form = new FormData();
      form.append('projectId', pId);
      form.append('clipLibraryRoot', clipLibraryRoot || '/clips');
      voiceovers.forEach((f) => form.append('voiceovers', f));

      const pipeRes = await fetch(`${API_URL}/api/pipeline/start`, {
        method: 'POST',
        body: form,
      });
      const pipeData = await pipeRes.json();
      if (!pipeRes.ok) throw new Error(pipeData.error || 'Failed to start pipeline');

      setJobId(pipeData.jobId);
      pollStatus(pipeData.jobId);
    } catch (err: any) {
      const errStr = String(err?.message || err);
      if (errStr.includes('Failed to fetch') || errStr.includes('NetworkError')) {
        setError(`Cannot connect to API server at ${API_URL}. Is the backend running? Start it with: cd apps/api && npm run dev`);
      } else {
        setError(errStr);
      }
    } finally {
      setLoading(false);
    }
  };

  const downloadTimeline = async () => {
    if (!jobId) return;
    const res = await fetch(`${API_URL}/api/pipeline/timeline/${jobId}`);
    const data = await res.json();
    const blob = new Blob([JSON.stringify(data.timeline, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline_${jobId.slice(0, 8)}.json`;
    a.click();
  };

  const downloadVideo = () => {
    if (!jobId) return;
    const a = document.createElement('a');
    a.href = `${API_URL}/api/pipeline/video/${jobId}`;
    a.download = `final_video_${jobId.slice(0, 8)}.mp4`;
    a.click();
  };

  const isDone = jobStatus && jobStatus.status === 'completed';
  const isError = jobStatus && jobStatus.status === 'error';

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🎬</span>
            <div>
              <h1 className={styles.brandName}>BlokeTuber</h1>
              <span className={styles.brandSub}>AI Video Pipeline</span>
            </div>
          </div>
          <div className={styles.headerBadge}>American Hideaways</div>
        </div>
      </header>

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <h2 className={styles.heroTitle}>
            Voiceover in. <span className={styles.goldText}>Video out.</span>
          </h2>
          <p className={styles.heroSub}>
            Drop your chapter voiceovers. Whisper transcribes, the AI Director plans high-retention pacing,
            and the pipeline automatically renders your finished MP4 video!
          </p>
          <div className={styles.heroPills}>
            <span className={styles.pill}>🎙 Whisper Auto-Transcribe</span>
            <span className={styles.pill}>🤖 Adaptive Pacing (&lt; 4.5s)</span>
            <span className={styles.pill}>📷 4K/5K Photo-First</span>
            <span className={styles.pill}>🎥 Cinematic Ken Burns</span>
            <span className={styles.pill}>⚡ Auto-Render MP4</span>
          </div>
        </section>

        {/* Pipeline Status */}
        {jobStatus && (
          <section className={styles.card}>
            <div className={styles.cardHeader}>
              <h3>Pipeline Progress</h3>
              <span className={[
                styles.statusBadge,
                isDone ? styles.statusDone : isError ? styles.statusError : styles.statusRunning
              ].join(' ')}>
                {jobStatus.step}
              </span>
            </div>
            <StepIndicator current={jobStatus.step as PipelineStep} />
            {isError && (
              <div className={styles.errorBox}>
                ⚠️ {jobStatus.errorMessage}
              </div>
            )}
            {isDone && (
              <div className={styles.doneBox}>
                <div>
                  <strong style={{ fontSize: '1.2em', color: '#10b981' }}>✅ Your Video is Rendered & Ready!</strong>
                  <p style={{ marginTop: 4, color: '#94a3b8' }}>
                    Preview your generated video below or download the final MP4.
                  </p>
                </div>

                <video
                  controls
                  src={`${API_URL}/api/pipeline/video/${jobId}`}
                  style={{
                    width: '100%',
                    maxHeight: 440,
                    borderRadius: 12,
                    marginTop: 14,
                    marginBottom: 16,
                    backgroundColor: '#09090b',
                    border: '1px solid #27272a',
                  }}
                />

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className={styles.btnGold} onClick={downloadVideo} style={{ flex: 1, minWidth: 220 }}>
                    🎬 Download Final Video (.mp4)
                  </button>
                  <button
                    onClick={downloadTimeline}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 8,
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#e2e8f0',
                      cursor: 'pointer',
                      fontSize: '0.9em',
                    }}
                  >
                    ⬇️ Download timeline.json
                  </button>
                </div>
              </div>
            )}
          </section>
        )}

        {/* Input Form */}
        {!jobId && (
          <div className={styles.form}>
            {/* Project Name */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Project Name</h3>
              <input
                id="project-name"
                className={styles.input}
                placeholder="e.g. American Hideaways S02E04"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </section>

            {/* Script (Optional) */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Script <span style={{ fontSize: '0.85em', color: '#94a3b8', fontWeight: 'normal' }}>(Optional)</span></h3>
              <p className={styles.cardHint}>
                Paste your script, or leave blank — Whisper will automatically transcribe your voiceover audio directly.
              </p>
              <textarea
                id="script-text"
                className={styles.textarea}
                placeholder={"(Optional) Paste script here, or leave blank to auto-transcribe directly from uploaded voiceovers..."}
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value)}
                rows={6}
              />
            </section>

            {/* Voiceovers */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Chapter Voiceovers</h3>
              <p className={styles.cardHint}>Upload all chapter MP3s. Name them in order (01.mp3, 02.mp3…).</p>
              <FileDropZone
                label="Drop MP3 files or click to browse"
                accept="audio/*"
                multiple
                files={voiceovers}
                onFiles={setVoiceovers}
                icon="🎤"
                hint="01.mp3, 02.mp3 — 15.mp3 in order"
              />
            </section>

            {/* Clip Library */}
            <section className={styles.card}>
              <h3 className={styles.cardTitle}>Clip Library</h3>
              <p className={styles.cardHint}>
                Upload your pre-cut clips (10–20 named descriptively). Or specify their folder path if already on the server.
              </p>
              <FileDropZone
                label="Drop video clips or click to browse"
                accept="video/*"
                multiple
                files={clips}
                onFiles={setClips}
                icon="🎥"
                hint="homeless_man_talking_porch.mp4, tiny_house_exterior.mp4…"
              />
              <div className={styles.orDivider}>or specify local server path</div>
              <input
                id="clip-library-root"
                className={styles.input}
                placeholder="/absolute/path/to/clips/folder"
                value={clipLibraryRoot}
                onChange={(e) => setClipLibraryRoot(e.target.value)}
              />
            </section>

            {/* Error */}
            {error && <div className={styles.errorBox}>⚠️ {error}</div>}

            {/* Launch */}
            <button
              id="start-pipeline"
              className={styles.btnLaunch}
              onClick={handleStart}
              disabled={loading}
            >
              {loading ? (
                <><span className={styles.spinner} /> Starting pipeline…</>
              ) : (
                <>▶️ Launch Pipeline</>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
