'use client';

import React, { useState } from 'react';

interface YouTubeLinksModalProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
  apiUrl: string;
}

export function YouTubeLinksModal({ projectId, isOpen, onClose, apiUrl }: YouTubeLinksModalProps) {
  const [urlsText, setUrlsText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleIngestLinks = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatusMsg(null);

    const urls = urlsText
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.startsWith('http://') || u.startsWith('https://'));

    if (urls.length === 0 && !searchQuery.trim()) {
      setError('Please provide at least one valid YouTube URL or an auto-search topic.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (urls.length > 0) {
        const res = await fetch(`${apiUrl}/api/projects/${projectId}/youtube-links`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ urls }),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || 'Failed to queue YouTube links');
        }
      }

      if (searchQuery.trim()) {
        await fetch(`${apiUrl}/api/projects/${projectId}/auto-search-youtube`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: searchQuery.trim(), limit: 2 }),
        });
      }

      setStatusMsg(`Queued! Downloading source videos in 1080p and slicing into raw B-roll clips in the background.`);
      setTimeout(() => {
        setUrlsText('');
        setSearchQuery('');
        setIsSubmitting(false);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err.message || String(err));
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: 12,
          maxWidth: 580,
          width: '100%',
          padding: 28,
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          color: '#F8FAFC',
          fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🎥</span> Source Footage & YouTube Links
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontSize: 20,
              cursor: 'pointer',
            }}
          >
            ✕
          </button>
        </div>

        <p style={{ margin: '0 0 16px 0', fontSize: 13, color: '#94A3B8', lineHeight: 1.5 }}>
          Paste your specific YouTube documentary links below. The pipeline will download them in 1080p, cut them into
          curated 4–8s raw B-roll clips, and screenshot them for visual screening.
        </p>

        <form onSubmit={handleIngestLinks}>
          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>
            YouTube URLs (one per line)
          </label>
          <textarea
            rows={5}
            placeholder={`https://www.youtube.com/watch?v=...\nhttps://www.youtube.com/watch?v=...`}
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: 12,
              color: '#F8FAFC',
              fontSize: 13,
              fontFamily: 'monospace',
              resize: 'vertical',
              boxSizing: 'border-box',
              marginBottom: 16,
            }}
          />

          <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#CBD5E1', marginBottom: 6 }}>
            Auto-Search YouTube Topic (Optional — downloads top 2 targeted videos)
          </label>
          <input
            type="text"
            placeholder="e.g. Skid Row Los Angeles sidewalk encampments 2024"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              backgroundColor: '#1E293B',
              border: '1px solid #334155',
              borderRadius: 8,
              padding: '10px 12px',
              color: '#F8FAFC',
              fontSize: 13,
              boxSizing: 'border-box',
              marginBottom: 20,
            }}
          />

          {error && (
            <div style={{ padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #EF4444', borderRadius: 8, color: '#FCA5A5', fontSize: 12, marginBottom: 16 }}>
              ⚠️ {error}
            </div>
          )}

          {statusMsg && (
            <div style={{ padding: '10px 14px', backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22C55E', borderRadius: 8, color: '#86EFAC', fontSize: 12, marginBottom: 16 }}>
              ✅ {statusMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                backgroundColor: '#334155',
                border: 'none',
                borderRadius: 8,
                padding: '9px 16px',
                color: '#E2E8F0',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: '#3B82F6',
                border: 'none',
                borderRadius: 8,
                padding: '9px 20px',
                color: '#FFFFFF',
                fontSize: 13,
                fontWeight: 600,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? '⏳ Ingesting & Slicing...' : '⬇️ Ingest & Slice Raw Clips'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
