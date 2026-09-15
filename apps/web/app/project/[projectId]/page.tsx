'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import styles from '../../dashboard.module.css';
import { Project, Chapter } from '@repo/shared';
import { YouTubeLinksModal } from '../../components/YouTubeLinksModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ProjectOverviewPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const resolvedParams = use(params);
  const { projectId } = resolvedParams;

  const [project, setProject] = useState<Project | null>(null);
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const [isStitching, setIsStitching] = useState(false);
  const [stitchedVideoUrl, setStitchedVideoUrl] = useState<string | null>(null);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectData = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects/${projectId}`);
      if (res.ok) {
        const data = await res.json();
        setProject(data.project);
      }
    } catch (err) {
      console.error('Failed to load project:', err);
    }
  };

  useEffect(() => {
    fetchProjectData();
    const interval = setInterval(fetchProjectData, 6000);
    return () => clearInterval(interval);
  }, [projectId]);

  // Add Chapter
  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const nextIdx = (project?.chapters?.length || 0) + 1;
      const res = await fetch(`${API_URL}/api/projects/${projectId}/chapters`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDesc.trim(),
          chapterIndex: nextIdx,
        }),
      });

      if (res.ok) {
        setNewTitle('');
        setNewDesc('');
        setIsAddingChapter(false);
        await fetchProjectData();
      }
    } catch (err) {
      setError(String(err));
    }
  };

  // Combine Chapters into Master MP4
  const handleStitchMaster = async () => {
    setIsStitching(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/pipeline/stitch-project/${projectId}`, {
        method: 'POST',
      });
      if (res.ok) {
        setStitchedVideoUrl(`${API_URL}/api/pipeline/project-video/${projectId}?t=${Date.now()}`);
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to stitch project master');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsStitching(false);
    }
  };

  if (!project) {
    return (
      <div className={styles.root}>
        <div style={{ padding: 40, textAlign: 'center', color: '#64748B' }}>
          ⏳ Loading Project...
        </div>
      </div>
    );
  }

  const completedCount = (project.chapters || []).filter((c) => c.status === 'completed').length;

  return (
    <div className={styles.root}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12 }}>
              <span className={styles.brandIcon}>🎬</span>
              <div>
                <div className={styles.brandName}>BLOKETUBER STUDIO</div>
                <div className={styles.brandSub}>DOCUMENTARY PROJECT HUB</div>
              </div>
            </Link>
          </div>

          <div className={styles.headerActions}>
            <div className={styles.breadcrumb}>
              <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>
                Projects
              </Link>
              <span>/</span>
              <span className={styles.breadcrumbActive}>{project.name}</span>
            </div>

            <button
              className={styles.secondaryBtn}
              onClick={() => setIsYouTubeModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <span>🎥</span> Add YouTube Links
            </button>

            <button
              className={styles.secondaryBtn}
              onClick={handleStitchMaster}
              disabled={isStitching || completedCount === 0}
            >
              {isStitching ? '⏳ Stitching Master MP4...' : '🎞️ Combine All Chapters into Master Video'}
            </button>

            <button className={styles.primaryBtn} onClick={() => setIsAddingChapter(true)}>
              + Add Chapter
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
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
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Master Stitched Video Player Modal / Banner */}
        {stitchedVideoUrl && (
          <div className={styles.videoPlayerCard} style={{ marginBottom: 28, border: '2px solid var(--gold-primary)' }}>
            <div className={styles.videoHeader}>
              <span style={{ color: 'var(--gold-primary)', fontWeight: 800 }}>
                🏆 MASTER DOCUMENTARY VIDEO READY ({project.name})
              </span>
              <a
                href={stitchedVideoUrl}
                download={`${project.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_master.mp4`}
                className={styles.primaryBtn}
                style={{ padding: '4px 12px', fontSize: 12 }}
              >
                ⬇ Download Master MP4
              </a>
            </div>
            <div className={styles.videoWrapper}>
              <video src={stitchedVideoUrl} controls className={styles.videoPlayer} autoPlay />
            </div>
          </div>
        )}

        {/* Project Hero Header */}
        <div className={styles.workspaceHero} style={{ marginBottom: 28 }}>
          <div className={styles.chapterTitleGroup}>
            <div className={styles.chapterMetaRow}>
              <span className={styles.chapterNumberPill}>DOCUMENTARY PROJECT</span>
              <span
                className={[
                  styles.statusBadge,
                  project.status === 'completed'
                    ? styles.statusCompleted
                    : project.status === 'processing'
                    ? styles.statusProcessing
                    : styles.statusDraft,
                ].join(' ')}
              >
                {completedCount}/{project.chapters?.length || 0} CHAPTERS READY
              </span>
            </div>
            <h1 className={styles.chapterMainTitle}>{project.name}</h1>
            {project.description && (
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4, maxWidth: 800 }}>
                {project.description}
              </p>
            )}
          </div>
        </div>

        {/* Chapters Section Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 20, fontWeight: 700 }}>
            Story Chapters ({project.chapters?.length || 0})
          </h3>
          <button className={styles.secondaryBtn} onClick={() => setIsAddingChapter(true)}>
            + Add Next Chapter
          </button>
        </div>

        {/* Chapter Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
            gap: 20,
          }}
        >
          {[...(project.chapters || [])]
            .sort((a, b) => (a.chapterIndex || 0) - (b.chapterIndex || 0))
            .map((ch) => {
            return (
              <Link
                key={ch.id}
                href={`/project/${projectId}/chapter/${ch.id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles.projectCard}>
                  <div>
                    <div className={styles.projectCardHeader}>
                      <span className={styles.chapterIndexLabel}>Chapter {String(ch.chapterIndex).padStart(2, '0')}</span>
                      <span
                        className={[
                          styles.statusBadge,
                          ch.status === 'completed'
                            ? styles.statusCompleted
                            : ch.status === 'staged'
                            ? styles.statusProcessing
                            : ch.status === 'processing'
                            ? styles.statusProcessing
                            : styles.statusDraft,
                        ].join(' ')}
                      >
                        {ch.status === 'completed'
                          ? '✅ VIDEO READY'
                          : ch.status === 'staged'
                          ? '📋 STORYBOARD READY'
                          : ch.status === 'processing'
                          ? '⚡ RENDERING'
                          : 'DRAFT'}
                      </span>
                    </div>

                    <h3 className={styles.projectCardTitle} style={{ marginTop: 8 }}>
                      {ch.title}
                    </h3>

                    {ch.description && (
                      <p
                        style={{
                          color: '#78350F',
                          backgroundColor: '#FEF3C7',
                          border: '1px solid #FDE68A',
                          borderRadius: 6,
                          padding: '8px 10px',
                          fontSize: 12,
                          marginTop: 10,
                          lineHeight: 1.4,
                          fontStyle: 'italic',
                        }}
                      >
                        "{ch.description}"
                      </p>
                    )}
                  </div>

                  <div className={styles.projectCardMeta}>
                    <span>{ch.voiceoverFileName ? '🎙️ Audio Attached' : '⚠️ Audio Needed'}</span>
                    <span style={{ marginLeft: 'auto', color: 'var(--gold-primary)', fontWeight: 700 }}>
                      Open Studio ➔
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      {/* Add Chapter Modal */}
      {isAddingChapter && (
        <div className={styles.modalOverlay} onClick={() => setIsAddingChapter(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Add Story Chapter</h3>
            <form onSubmit={handleAddChapter} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Chapter Title</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. Chapter 1: The Eviction & The Van"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Visual & Pacing Description / Director Note
                </label>
                <textarea
                  className={styles.scriptEditor}
                  style={{ minHeight: 100 }}
                  placeholder="e.g. 70-year-old elderly woman living in a 1995 camper van. Moody, slow atmospheric pacing. Old beat-up vehicle on desert highway, senior woman driving at night, no young people or modern offices."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  This anchors the AI Director and stock searches to the exact character age, vehicle, and tone.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsAddingChapter(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Create Chapter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* YouTube Links Ingestion Modal */}
      <YouTubeLinksModal
        projectId={projectId}
        isOpen={isYouTubeModalOpen}
        onClose={() => setIsYouTubeModalOpen(false)}
        apiUrl={API_URL}
      />
    </div>
  );
}
