'use client';

import React, { useState, useEffect } from 'react';
import { StockSearchOption } from '@repo/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface LocalClip {
  filename: string;
  url: string; // served via /api/pipeline/local-clip-file
  localPath: string;
}

interface ClipSwapModalProps {
  projectId: string;
  chapterId: string;
  clipIndex: number;
  slotIndex?: number;
  currentQuery: string;
  currentMediaType: 'video' | 'image';
  clipLibraryRoot?: string;
  onClose: () => void;
  onSwapped: (updatedTimeline: any) => void;
}

export const ClipSwapModal: React.FC<ClipSwapModalProps> = ({
  projectId,
  chapterId,
  clipIndex,
  slotIndex,
  currentQuery,
  currentMediaType,
  clipLibraryRoot,
  onClose,
  onSwapped,
}) => {
  type Tab = 'stock' | 'local';
  const [activeTab, setActiveTab] = useState<Tab>(clipLibraryRoot ? 'local' : 'stock');

  // Stock tab state
  const [query, setQuery] = useState(currentQuery || '');
  const [mediaType, setMediaType] = useState<'video' | 'image'>(currentMediaType || 'video');
  const [results, setResults] = useState<StockSearchOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Local tab state
  const [localClips, setLocalClips] = useState<LocalClip[]>([]);
  const [isLoadingLocal, setIsLoadingLocal] = useState(false);
  const [localFolder, setLocalFolder] = useState(clipLibraryRoot || '');
  const [localError, setLocalError] = useState<string | null>(null);

  const [isSwapping, setIsSwapping] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async (searchQuery: string, type: 'video' | 'image') => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_URL}/api/pipeline/search-stock?query=${encodeURIComponent(searchQuery)}&mediaType=${type}`
      );
      if (res.ok) {
        const data = await res.json();
        setResults(data.results || []);
      } else {
        setError('Failed to fetch stock options');
      }
    } catch (err) {
      setError(String(err));
    } finally {
      setIsLoading(false);
    }
  };

  const fetchLocalClips = async (folder: string) => {
    if (!folder.trim()) return;
    setIsLoadingLocal(true);
    setLocalError(null);
    try {
      const res = await fetch(`${API_URL}/api/pipeline/local-clips?folder=${encodeURIComponent(folder)}`);
      if (res.ok) {
        const data = await res.json();
        setLocalClips(data.clips || []);
        if (!data.clips || data.clips.length === 0) {
          setLocalError('No video files (.mp4, .mov, .webm) found in this folder.');
        }
      } else {
        const d = await res.json().catch(() => ({}));
        setLocalError(d.error || 'Failed to list local clips');
      }
    } catch (err) {
      setLocalError(String(err));
    } finally {
      setIsLoadingLocal(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'stock' && results.length === 0) {
      fetchCandidates(query, mediaType);
    } else if (activeTab === 'local' && localFolder && localClips.length === 0) {
      fetchLocalClips(localFolder);
    }
  }, [activeTab]);

  useEffect(() => {
    if (clipLibraryRoot) {
      fetchLocalClips(clipLibraryRoot);
    } else {
      fetchCandidates(query, mediaType);
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCandidates(query, mediaType);
  };

  const handleSelectCandidate = async (candidate: StockSearchOption) => {
    setIsSwapping(candidate.id);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/pipeline/swap-clip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chapterId,
          clipIndex,
          slotIndex,
          mediaUrl: candidate.url,
          mediaType: candidate.mediaType,
          stockSource: candidate.source,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onSwapped(data.timeline);
        onClose();
      } else {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to replace clip');
      }
    } catch (err) {
      setError(String(err));
      setIsSwapping(null);
    }
  };

  const handleSelectLocalClip = async (clip: LocalClip) => {
    setIsSwapping(clip.filename);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/pipeline/swap-clip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId,
          chapterId,
          clipIndex,
          slotIndex,
          mediaUrl: clip.localPath,
          mediaType: 'video',
          isLocalClip: true,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        onSwapped(data.timeline);
        onClose();
      } else {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to swap local clip');
      }
    } catch (err) {
      setError(String(err));
      setIsSwapping(null);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 16,
          boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
          maxWidth: 960,
          width: '100%',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 24px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FAF9F6',
          }}
        >
          <div>
            <h3
              style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: 18,
                fontWeight: 700,
                color: '#0F172A',
                margin: 0,
              }}
            >
              🔄 Swap Visual Asset — Beat {clipIndex + 1}
            </h3>
            <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>
              Pick from online stock or your local video folder to instantly replace this beat.
            </p>
          </div>

          <button
            style={{
              background: '#F1F5F9',
              border: '1px solid #E2E8F0',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 700,
            }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div
          style={{
            display: 'flex',
            gap: 10,
            padding: '12px 24px',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#FFFFFF',
          }}
        >
          <button
            style={{
              padding: '8px 18px',
              background: activeTab === 'stock' ? '#0F172A' : '#F8FAFC',
              color: activeTab === 'stock' ? '#FFFFFF' : '#475569',
              border: activeTab === 'stock' ? '1px solid #0F172A' : '1px solid #E2E8F0',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => setActiveTab('stock')}
          >
            🌐 Online Stock (Pexels / Pixabay)
          </button>
          <button
            style={{
              padding: '8px 18px',
              background: activeTab === 'local' ? '#0F172A' : '#F8FAFC',
              color: activeTab === 'local' ? '#FFFFFF' : '#475569',
              border: activeTab === 'local' ? '1px solid #0F172A' : '1px solid #E2E8F0',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
            onClick={() => {
              setActiveTab('local');
              if (localFolder && localClips.length === 0) fetchLocalClips(localFolder);
            }}
          >
            📁 Local Video Folder
          </button>
        </div>

        {/* ── TAB 1: STOCK ASSETS ── */}
        {activeTab === 'stock' && (
          <>
            <div style={{ padding: '14px 24px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
              <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 10 }}>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g. elderly senior woman driving van, rustic camper interior..."
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#0F172A',
                    outline: 'none',
                  }}
                />

                <div style={{ display: 'flex', border: '1px solid #CBD5E1', borderRadius: 8, overflow: 'hidden' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('video');
                      fetchCandidates(query, 'video');
                    }}
                    style={{
                      padding: '8px 14px',
                      background: mediaType === 'video' ? '#D97706' : '#F8FAFC',
                      color: mediaType === 'video' ? '#FFFFFF' : '#475569',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    📹 Video
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMediaType('image');
                      fetchCandidates(query, 'image');
                    }}
                    style={{
                      padding: '8px 14px',
                      background: mediaType === 'image' ? '#D97706' : '#F8FAFC',
                      color: mediaType === 'image' ? '#FFFFFF' : '#475569',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    📷 Photo
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  style={{
                    background: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '0 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {isLoading ? 'Searching...' : 'Search'}
                </button>
              </form>

              {error && (
                <div style={{ color: '#DC2626', fontSize: 13, marginTop: 8, fontWeight: 600 }}>
                  ⚠️ {error}
                </div>
              )}
            </div>

            {/* Candidate Grid */}
            <div
              style={{
                padding: '20px 24px',
                overflowY: 'auto',
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 16,
                alignContent: 'start',
              }}
            >
              {isLoading && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
                  ⏳ Sourcing 4K stock assets matching your query...
                </div>
              )}

              {!isLoading && results.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
                  No alternative assets found. Try adjusting your search query above!
                </div>
              )}

              {!isLoading &&
                results.map((candidate) => {
                  const isSelected = isSwapping === candidate.id;
                  return (
                    <div
                      key={candidate.id}
                      style={{
                        backgroundColor: '#FAF9F6',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: 12,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onClick={() => handleSelectCandidate(candidate)}
                    >
                      {/* Thumbnail / Video Stream */}
                      <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', backgroundColor: '#000' }}>
                        {candidate.mediaType === 'video' ? (
                          <video
                            src={candidate.url}
                            poster={candidate.previewUrl}
                            muted
                            loop
                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        ) : (
                          <img
                            src={candidate.previewUrl || candidate.url}
                            alt={candidate.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        )}

                        <span
                          style={{
                            position: 'absolute',
                            top: 8,
                            left: 8,
                            background: 'rgba(15, 23, 42, 0.85)',
                            color: '#FFF',
                            fontSize: 10,
                            fontFamily: 'JetBrains Mono, monospace',
                            fontWeight: 700,
                            padding: '2px 6px',
                            borderRadius: 4,
                            textTransform: 'uppercase',
                          }}
                        >
                          {candidate.source}
                        </span>
                      </div>

                      {/* Card Bottom / Action */}
                      <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12, color: '#475569', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 140 }}>
                          {candidate.title || 'Stock Asset'}
                        </span>

                        <button
                          disabled={Boolean(isSwapping)}
                          style={{
                            backgroundColor: '#D97706',
                            color: '#FFF',
                            border: 'none',
                            borderRadius: 6,
                            padding: '5px 10px',
                            fontSize: 11,
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          {isSelected ? '⏳ Replacing...' : '✓ Select'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </>
        )}

        {/* ── TAB 2: LOCAL VIDEO FOLDER ── */}
        {activeTab === 'local' && (
          <>
            <div style={{ padding: '14px 24px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <input
                  type="text"
                  value={localFolder}
                  onChange={(e) => setLocalFolder(e.target.value)}
                  placeholder="e.g. C:\\Users\\karth\\Videos\\Clips or /path/to/clips"
                  style={{
                    flex: 1,
                    padding: '10px 14px',
                    border: '1.5px solid #CBD5E1',
                    borderRadius: 8,
                    fontSize: 13,
                    fontFamily: 'JetBrains Mono, monospace',
                    color: '#0F172A',
                    outline: 'none',
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      fetchLocalClips(localFolder);
                    }
                  }}
                />
                <button
                  onClick={() => fetchLocalClips(localFolder)}
                  disabled={isLoadingLocal}
                  style={{
                    background: '#0F172A',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: 8,
                    padding: '10px 18px',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isLoadingLocal ? 'Loading...' : '📂 Browse Folder'}
                </button>
              </div>

              {localError && (
                <div style={{ color: '#DC2626', fontSize: 13, marginTop: 8, fontWeight: 600 }}>
                  ⚠️ {localError}
                </div>
              )}
              {error && (
                <div style={{ color: '#DC2626', fontSize: 13, marginTop: 8, fontWeight: 600 }}>
                  ⚠️ {error}
                </div>
              )}

              {!localError && localClips.length > 0 && (
                <div style={{ fontSize: 12, color: '#166534', marginTop: 8, fontWeight: 600 }}>
                  ✅ Found {localClips.length} local video{localClips.length !== 1 ? 's' : ''} in folder. Hover to preview, click to swap!
                </div>
              )}
            </div>

            <div
              style={{
                padding: '20px 24px',
                overflowY: 'auto',
                flex: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 16,
                alignContent: 'start',
              }}
            >
              {isLoadingLocal && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: '#64748B' }}>
                  ⏳ Scanning local folder for video files...
                </div>
              )}

              {!isLoadingLocal && localClips.length === 0 && !localError && (
                <div
                  style={{
                    gridColumn: '1 / -1',
                    textAlign: 'center',
                    padding: '40px 0',
                    color: '#64748B',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <span style={{ fontSize: 36 }}>📁</span>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#334155' }}>
                    No folder loaded yet
                  </div>
                  <div style={{ fontSize: 12, maxWidth: 400 }}>
                    Enter the absolute folder path containing your <code>.mp4</code> or <code>.mov</code> video clips above and click <strong>Browse Folder</strong>.
                  </div>
                </div>
              )}

              {!isLoadingLocal &&
                localClips.map((clip) => (
                  <div
                    key={clip.filename}
                    style={{
                      backgroundColor: '#FAF9F6',
                      border: isSwapping === clip.filename ? '2px solid #D97706' : '1.5px solid #E2E8F0',
                      borderRadius: 12,
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                    onClick={() => handleSelectLocalClip(clip)}
                  >
                    <div style={{ position: 'relative', width: '100%', aspectRatio: '16 / 9', backgroundColor: '#1E293B' }}>
                      <video
                        src={`${API_URL}${clip.url}`}
                        muted
                        preload="metadata"
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          top: 8,
                          left: 8,
                          background: 'rgba(15, 23, 42, 0.85)',
                          color: '#FFF',
                          fontSize: 10,
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        LOCAL
                      </span>
                    </div>
                    <div style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: '#1E293B',
                          fontWeight: 600,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: 160,
                          fontFamily: 'JetBrains Mono, monospace',
                        }}
                        title={clip.filename}
                      >
                        {clip.filename}
                      </span>
                      <button
                        disabled={Boolean(isSwapping)}
                        style={{
                          backgroundColor: '#0F172A',
                          color: '#FFF',
                          border: 'none',
                          borderRadius: 6,
                          padding: '5px 10px',
                          fontSize: 11,
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {isSwapping === clip.filename ? '⏳ Swapping...' : '✓ Use This'}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
