'use client';

import React, { useState } from 'react';
import { SceneLayoutType, CalloutType, CalloutThemeColor, OverlayType, TransitionType } from '@repo/shared';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface BeatCustomizeModalProps {
  projectId: string;
  chapterId: string;
  clipIndex: number;
  clip: any;
  onClose: () => void;
  onUpdated: (updatedTimeline: any) => void;
}

const ALL_LAYOUTS: Array<{ value: SceneLayoutType; label: string; desc: string }> = [
  { value: 'full_bleed_cinematic', label: '🎬 Full Bleed Cinematic', desc: 'Fullscreen 16:9 + 2.35:1 Letterbox Bars + Film Grain' },
  { value: 'split_dual_screen', label: '🌓 Split Dual Screen', desc: '50/50 Dual Perspective with golden vertical accent' },
  { value: 'open_case_binder', label: '📁 Open Case Binder', desc: '3D Manila case file folder with metal top prongs on oak desk' },
  { value: 'forensic_drafting_table', label: '📐 Forensic Drafting Table', desc: 'Blueprint technical paper with GPS crosshairs & ruler' },
  { value: 'hero_graphic_centerpiece', label: '⭐ Hero Graphic Centerpiece', desc: 'Floating centerpiece card over deep softened ambient blur' },
  { value: 'ambient_blur_frame', label: '🖼️ Ambient Blur Frame', desc: 'Floating card over bright softened ambient mirror background' },
  { value: 'filmstrip_spool_reel', label: '🎞️ Filmstrip Spool Reel', desc: 'Scrolling horizontal 35mm film negative ribbon on ivory paper' },
  { value: 'red_string_pinboard', label: '🧵 Red String Pinboard', desc: 'Blonde corkboard with connected red evidence strings' },
  { value: 'parallax_triptych_gallery', label: '🏛️ Parallax Triptych Gallery', desc: '3-Panel 3D Parallax triptych on bright gallery wall' },
  { value: 'polaroid_scatter_desk', label: '📸 Polaroid Scatter Desk', desc: 'Organic polaroid photo scatter on blonde oak desk' },
];

const ALL_CALLOUTS: Array<{ value: CalloutType; label: string }> = [
  { value: 'newspaper_headline', label: '📰 Newspaper Headline' },
  { value: 'editorial_lower_third', label: '📺 Editorial Lower Third' },
  { value: 'odometer_stat', label: '⏱️ Odometer Stat Counter' },
  { value: 'redacted_dossier', label: '📁 Redacted Dossier' },
  { value: 'police_crime_sheet', label: '🚨 Police Crime Sheet' },
  { value: 'forensic_data_card', label: '🔬 Forensic Data Card' },
  { value: 'typewriter_paper', label: '📜 Typewriter Paper' },
  { value: 'social_tweet_card', label: '🐦 Social Tweet Card' },
  { value: 'reddit_thread_card', label: '🧵 Reddit Thread Card' },
  { value: 'caution_tape_banner', label: '⚠️ Caution Tape Banner' },
  { value: 'fullscreen_chapter_title', label: '🔤 Full Screen Title' },
  { value: 'karaoke_captions', label: '🎤 Karaoke Captions' },
];

const ALL_OVERLAYS: Array<{ value: OverlayType | 'none'; label: string; desc: string }> = [
  { value: 'none', label: '(None / Clean)', desc: 'No atmospheric overlay' },
  { value: 'film_dust_scratches', label: '🎞️ Film Dust & Scratches', desc: '35mm organic lint, specks & micro-scratches' },
  { value: 'star_sparkle_bokeh', label: '✨ Star Sparkles & Bokeh', desc: 'Floating luminous light orbs & star glints' },
  { value: 'film_burn_light_leak', label: '🔥 Film Burn & Light Leaks', desc: 'Warm amber/crimson edge light flare' },
  { value: 'vintage_crt_scanlines', label: '📺 Vintage CRT Scanlines', desc: 'Phosphor raster lines & terminal curve' },
  { value: 'camera_viewfinder_hud', label: '📹 Camera Viewfinder HUD', desc: 'Investigative crosshairs, REC indicator & grid' },
  { value: 'micro_film_grain', label: '🌫️ Micro Film Grain', desc: '35mm textured cinematic film grain' },
  { value: 'archival_halftone_paper', label: '📜 Archival Halftone Paper', desc: 'Newsprint dot rosette texture & parchment' },
  { value: 'cinematic_vignette', label: '🌑 Cinematic Vignette', desc: 'Deep corner shadow falloff for tension' },
  { value: 'chromatic_aberration', label: '🌈 Chromatic Aberration', desc: 'RGB edge color splitting & lens distortion' },
  { value: 'sprocket_16mm_film_frame', label: '🎞️ 16mm Sprocket Frame', desc: 'Vintage celluloid film reel perforated borders' },
  { value: 'rain_lens_streaks', label: '🌧️ Rain Lens Streaks', desc: 'Water droplet streaks & somber bleak mood' },
  { value: 'vhs_glitch_tape_tear', label: '📼 VHS Glitch Tape Tear', desc: 'Analog magnetic tape dropout & horizontal sync rip' },
];

const ALL_TRANSITIONS: Array<{ value: TransitionType; label: string; desc: string }> = [
  { value: 'cut', label: '✂️ Clean Hard Cut', desc: 'Standard crisp documentary cut' },
  { value: 'shutter_flash', label: '📸 Shutter Flash', desc: '0.08s Camera shutter blink & exposure bloom' },
  { value: 'film_burn', label: '🔥 Film Burn Flare', desc: '0.2s Warm 35mm amber/crimson light leak cut' },
  { value: 'film_dip_black', label: '🌑 Dip to Black', desc: '0.25s Cinematic micro fade-up from pitch black' },
  { value: 'whip_pan_left', label: '⬅️ Whip Pan Left', desc: '0.15s High-speed camera swipe blur to left' },
  { value: 'whip_pan_right', label: '➡️ Whip Pan Right', desc: '0.15s High-speed camera swipe blur to right' },
  { value: 'zoom_punch', label: '💥 Zoom Punch Impact', desc: '0.18s Snap-zoom scale shockwave reveal' },
  { value: 'glitch_blink', label: '⚡ CRT Glitch Blink', desc: '0.1s 2-frame sync twitch with chromatic split' },
  { value: 'crossfade', label: '🌫️ Crossfade Dissolve', desc: '0.3s Smooth gentle documentary dissolve' },
];

const THEME_COLORS: Array<{ value: CalloutThemeColor; label: string; color: string }> = [
  { value: 'gold', label: 'Gold', color: '#F59E0B' },
  { value: 'amber', label: 'Amber', color: '#D97706' },
  { value: 'cyan', label: 'Cyan', color: '#06B6D4' },
  { value: 'crimson', label: 'Crimson', color: '#EF4444' },
  { value: 'emerald', label: 'Emerald', color: '#10B981' },
  { value: 'slate', label: 'Slate', color: '#64748B' },
  { value: 'white', label: 'White', color: '#FFFFFF' },
];

export const BeatCustomizeModal: React.FC<BeatCustomizeModalProps> = ({
  projectId,
  chapterId,
  clipIndex,
  clip,
  onClose,
  onUpdated,
}) => {
  const [layout, setLayout] = useState<SceneLayoutType>(clip.layout || 'full_bleed_cinematic');
  const [transitionType, setTransitionType] = useState<TransitionType>(clip.transitionType || 'cut');
  const [overlay, setOverlay] = useState<string>(
    Array.isArray(clip.overlay) ? clip.overlay[0] || 'none' : clip.overlay || 'none'
  );

  // Callout State
  const initialCallout = clip.callout;
  const [hasCallout, setHasCallout] = useState<boolean>(Boolean(initialCallout && initialCallout.line1));
  const [calloutType, setCalloutType] = useState<CalloutType>(initialCallout?.type || 'editorial_lower_third');
  const [line1, setLine1] = useState<string>(initialCallout?.line1 || '');
  const [line2, setLine2] = useState<string>(initialCallout?.line2 || '');
  const [themeColor, setThemeColor] = useState<CalloutThemeColor>(initialCallout?.themeColor || 'gold');

  // Layout Data State
  const [title, setTitle] = useState<string>(clip.layoutData?.title || '');
  const [subtitle, setSubtitle] = useState<string>(clip.layoutData?.subtitle || '');
  const [tag, setTag] = useState<string>(clip.layoutData?.tag || '');
  const [coords, setCoords] = useState<string>(clip.layoutData?.coords || '');

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const duration = Math.max(0, clip.endTime - clip.startTime).toFixed(1);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const payload: any = {
        projectId,
        chapterId,
        clipIndex,
        layout,
        transitionType,
        overlay: overlay === 'none' ? null : overlay,
        layoutData: {
          title: title.trim() || undefined,
          subtitle: subtitle.trim() || undefined,
          tag: tag.trim() || undefined,
          coords: coords.trim() || undefined,
        },
      };

      if (hasCallout && line1.trim()) {
        payload.callout = {
          type: calloutType,
          line1: line1.trim(),
          line2: line2.trim() || null,
          themeColor,
          startTime: initialCallout?.startTime ?? 0.2,
          endTime: initialCallout?.endTime ?? Math.max(1.5, Number(duration) - 0.2),
        };
      } else {
        payload.callout = null;
      }

      const res = await fetch(`${API_URL}/api/pipeline/update-clip`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to update beat');
      }

      const data = await res.json();
      if (data.timeline) {
        onUpdated(data.timeline);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error saving changes');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          width: '100%',
          maxWidth: 780,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)',
          overflow: 'hidden',
          border: '1px solid #E2E8F0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#0F172A',
            color: '#FFFFFF',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>
                ✏️ Customize Beat 0{clipIndex + 1}
              </h2>
              <span
                style={{
                  backgroundColor: '#334155',
                  color: '#94A3B8',
                  fontSize: 11,
                  fontFamily: 'JetBrains Mono, monospace',
                  padding: '2px 8px',
                  borderRadius: 6,
                }}
              >
                {duration}s Runway
              </span>
            </div>
            <p
              style={{
                fontSize: 12,
                color: '#94A3B8',
                margin: '4px 0 0',
                maxWidth: 580,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontStyle: 'italic',
              }}
            >
              "{clip.text}"
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              fontSize: 22,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 24 }}>
          {error && (
            <div
              style={{
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #FCA5A5',
                padding: '10px 14px',
                borderRadius: 8,
                fontSize: 13,
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* 1. Screen Layout Selection */}
          <div>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
              📐 Screen Presentation Layout (18 Documentary Styles)
            </label>
            <select
              value={layout}
              onChange={(e) => setLayout(e.target.value as SceneLayoutType)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 8,
                border: '1.5px solid #CBD5E1',
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: '#F8FAFC',
                color: '#0F172A',
                cursor: 'pointer',
              }}
            >
              {ALL_LAYOUTS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label} — {item.desc}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Visual Atmosphere Overlay */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                ✨ Atmosphere Overlay (12 Styles)
              </label>
              <select
                value={overlay}
                onChange={(e) => setOverlay(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #CBD5E1',
                  fontSize: 13,
                  fontWeight: 600,
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  cursor: 'pointer',
                }}
              >
                {ALL_OVERLAYS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {/* 3. Scene Transition Selection */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#0F172A', marginBottom: 8 }}>
                ⚡ Cut Transition Effect (8 Styles)
              </label>
              <select
                value={transitionType}
                onChange={(e) => setTransitionType(e.target.value as TransitionType)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1.5px solid #CBD5E1',
                  fontSize: 13,
                  fontWeight: 600,
                  backgroundColor: '#F8FAFC',
                  color: '#0F172A',
                  cursor: 'pointer',
                }}
              >
                {ALL_TRANSITIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 4. Text Callout Card */}
          <div
            style={{
              border: '1.5px solid #E2E8F0',
              borderRadius: 12,
              padding: 16,
              backgroundColor: hasCallout ? '#FFFBEB' : '#F8FAFC',
              transition: 'all 0.2s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  id="enableCallout"
                  checked={hasCallout}
                  onChange={(e) => setHasCallout(e.target.checked)}
                  style={{ width: 16, height: 16, cursor: 'pointer', accentColor: '#D97706' }}
                />
                <label
                  htmlFor="enableCallout"
                  style={{ fontSize: 14, fontWeight: 800, color: '#0F172A', cursor: 'pointer' }}
                >
                  🏷️ Display Motion Text Callout
                </label>
              </div>
              <span style={{ fontSize: 11, color: '#64748B' }}>
                Synced to voiceover with animated entry
              </span>
            </div>

            {hasCallout && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Callout Component Style (20 Documentary Styles)
                  </label>
                  <select
                    value={calloutType}
                    onChange={(e) => setCalloutType(e.target.value as CalloutType)}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      fontSize: 12,
                      fontWeight: 600,
                      backgroundColor: '#FFFFFF',
                    }}
                  >
                    {ALL_CALLOUTS.map((item) => (
                      <option key={item.value} value={item.value}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Headline Text (Line 1 - Bold & Punchy)
                    </label>
                    <input
                      type="text"
                      value={line1}
                      onChange={(e) => setLine1(e.target.value)}
                      placeholder="e.g. $14,200/MONTH or POLICE DISPATCH AUDIO"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: 6,
                        border: '1px solid #CBD5E1',
                        fontSize: 13,
                        fontWeight: 600,
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                      Theme Accent Color
                    </label>
                    <select
                      value={themeColor}
                      onChange={(e) => setThemeColor(e.target.value as CalloutThemeColor)}
                      style={{
                        width: '100%',
                        padding: '8px 10px',
                        borderRadius: 6,
                        border: '1px solid #CBD5E1',
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      {THEME_COLORS.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Subtitle Text (Line 2 - Optional Context)
                  </label>
                  <input
                    type="text"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="e.g. KING COUNTY HOUSING ASSESSMENT • 2019"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 6,
                      border: '1px solid #CBD5E1',
                      fontSize: 13,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 5. Custom Layout Metadata (if stylized layout) */}
          {layout !== 'full_bleed_cinematic' && (
            <div
              style={{
                border: '1px dashed #CBD5E1',
                borderRadius: 12,
                padding: 16,
                backgroundColor: '#F8FAFC',
              }}
            >
              <div style={{ fontSize: 12, fontWeight: 800, color: '#334155', marginBottom: 10 }}>
                📄 Scene-Specific Layout Metadata (Labels, Coordinates, Tags)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                    Title / Header
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. SITE BLUEPRINT or 35MM ARCHIVE"
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                    Subtitle / Classification
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. OFFICIAL RECORD • CONFIDENTIAL"
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                    Tag / Stamp
                  </label>
                  <input
                    type="text"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    placeholder="e.g. ARCHIVAL EVIDENCE"
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748B', marginBottom: 4 }}>
                    GPS Coordinates / Location
                  </label>
                  <input
                    type="text"
                    value={coords}
                    onChange={(e) => setCoords(e.target.value)}
                    placeholder="e.g. SEATTLE, WA • 47.60° N, 122.33° W"
                    style={{ width: '100%', padding: '6px 10px', borderRadius: 6, border: '1px solid #CBD5E1', fontSize: 12 }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: 12,
          }}
        >
          <button
            onClick={onClose}
            disabled={isSaving}
            style={{
              padding: '9px 18px',
              borderRadius: 8,
              border: '1.5px solid #CBD5E1',
              backgroundColor: '#FFFFFF',
              color: '#334155',
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              padding: '9px 22px',
              borderRadius: 8,
              border: 'none',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            {isSaving ? '⏳ Saving...' : '✓ Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};
