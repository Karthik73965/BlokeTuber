'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './dashboard.module.css';
import { Project } from '@repo/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export default function ProjectsHubPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`${API_URL}/api/projects`);
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      }
    } catch {}
  };

  useEffect(() => {
    fetchProjects();
    const interval = setInterval(fetchProjects, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const res = await fetch(`${API_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: desc.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const created = data.project;

        // Auto-create Chapter 1
        await fetch(`${API_URL}/api/projects/${created.id}/chapters`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: 'Chapter 1: The Hook & Introduction',
            description: desc.trim(),
            chapterIndex: 1,
          }),
        });

        setName('');
        setDesc('');
        setIsCreating(false);
        router.push(`/project/${created.id}`);
      }
    } catch (err) {
      setError(String(err));
    }
  };

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    try {
      await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE' });
      await fetchProjects();
    } catch {}
  };

  return (
    <div className={styles.root}>
      {/* Top Header */}
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>🎬</span>
            <div>
              <div className={styles.brandName}>BLOKETUBER STUDIO</div>
              <div className={styles.brandSub}>AI DOCUMENTARY ENGINE</div>
            </div>
          </div>

          <div className={styles.headerActions}>
            <button className={styles.primaryBtn} onClick={() => setIsCreating(true)}>
              + Create New Project
            </button>
          </div>
        </div>
      </header>

      {/* Main Hub */}
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: 32, fontWeight: 800 }}>
              Documentary Projects
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
              Direct multi-chapter investigative documentaries with character-anchored AI footage and interactive visual storyboards.
            </p>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyIcon}>📂</span>
            <h3 style={{ fontSize: 18, fontWeight: 700 }}>No Projects Created Yet</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, maxWidth: 400 }}>
              Start your first documentary project. Define the character profile, setting, and story premise.
            </p>
            <button className={styles.primaryBtn} onClick={() => setIsCreating(true)}>
              + Create Your First Project
            </button>
          </div>
        ) : (
          <div className={styles.projectsGrid}>
            {projects.map((p) => {
              const completedCount = (p.chapters || []).filter((c) => c.status === 'completed').length;
              return (
                <Link
                  key={p.id}
                  href={`/project/${p.id}`}
                  style={{ textDecoration: 'none', color: 'inherit' }}
                >
                  <div className={styles.projectCard}>
                    <div>
                      <div className={styles.projectCardHeader}>
                        <h3 className={styles.projectCardTitle}>{p.name}</h3>
                        <span
                          className={[
                            styles.statusBadge,
                            p.status === 'completed'
                              ? styles.statusCompleted
                              : p.status === 'processing'
                              ? styles.statusProcessing
                              : styles.statusDraft,
                          ].join(' ')}
                        >
                          {p.status.toUpperCase()}
                        </span>
                      </div>

                      {p.description && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.5, marginTop: 8 }}>
                          {p.description}
                        </p>
                      )}
                    </div>

                    <div className={styles.projectCardMeta}>
                      <span>📑 <strong>{p.chapters?.length || 0}</strong> Chapters</span>
                      <span>✅ <strong>{completedCount}</strong> Ready</span>
                      <button
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: 12,
                        }}
                        onClick={(e) => handleDeleteProject(p.id, e)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>

      {/* Create Project Modal */}
      {isCreating && (
        <div className={styles.modalOverlay} onClick={() => setIsCreating(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Create New Documentary Project</h3>
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Project Name</label>
                <input
                  type="text"
                  className={styles.formInput}
                  placeholder="e.g. The Van Mothers of America"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoFocus
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Core Character Profile, Tone & Setting Anchor
                </label>
                <textarea
                  className={styles.scriptEditor}
                  style={{ minHeight: 90 }}
                  placeholder="e.g. Elderly 70-year-old women living in beat-up camper vans across the American West. Gritty, melancholic survival tone. Desert highways, no young people or corporate office tropes."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  All AI scene planning and 4K stock searches will be strictly constrained to this demographic & world.
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 10 }}>
                <button type="button" className={styles.secondaryBtn} onClick={() => setIsCreating(false)}>
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Create & Launch Studio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
