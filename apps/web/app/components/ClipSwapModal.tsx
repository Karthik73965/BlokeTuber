'use client';

import React, { useState, useEffect } from 'react';
import { StockSearchOption } from '@repo/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface ClipSwapModalProps {
  projectId: string;
  chapterId: string;
  clipIndex: number;
  slotIndex?: number;
  currentQuery: string;
  currentMediaType: 'video' | 'image';
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
  onClose,
  onSwapped,
}) => {
  const [query, setQuery] = useState(currentQuery || '');
  const [mediaType, setMediaType] = useState<'video' | 'image'>(currentMediaType || 'video');
  const [results, setResults] = useState<StockSearchOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  useEffect(() => {
    fetchCandidates(query, mediaType);
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
          maxWidth: 900,
          width: '100%',
          maxHeight: '88vh',
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
              🔄 Swap Visual Asset for Beat {clipIndex + 1}
            </h3>
            <p style={{ fontSize: 12, color: '#64748B', margin: '4px 0 0' }}>
              Pick an in-context 4K clip or search custom keywords to instantly replace this beat.
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

        {/* Search Bar & Type Toggles */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid #E2E8F0', backgroundColor: '#FFFFFF' }}>
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
      </div>
    </div>
  );
};
