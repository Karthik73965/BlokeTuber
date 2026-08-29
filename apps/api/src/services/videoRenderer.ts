import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import ffmpegStatic from 'ffmpeg-static';

const FFMPEG_BIN = ffmpegStatic ? `"${ffmpegStatic}"` : 'ffmpeg';

function resolveClipPath(rawPath: string | null, timelineDir: string): string | null {
  if (!rawPath) return null;

  // 1. Direct path
  if (fs.existsSync(rawPath)) return rawPath;

  // 2. Relative to timelineDir
  const relPath = path.resolve(timelineDir, rawPath);
  if (fs.existsSync(relPath)) return relPath;

  // 3. Relative to base output or cwd
  const baseOut = path.resolve(process.cwd(), rawPath);
  if (fs.existsSync(baseOut)) return baseOut;

  // 4. Normalized path (Windows / POSIX slashes)
  const normalized = path.normalize(rawPath);
  if (fs.existsSync(normalized)) return normalized;

  // 5. Strip leading output/ or clips/
  const stripped = rawPath.replace(/^(output|clips)[\\\/]/, '');
  const candidate1 = path.join(timelineDir, stripped);
  if (fs.existsSync(candidate1)) return candidate1;

  const candidate2 = path.join(timelineDir, 'stock', path.basename(rawPath));
  if (fs.existsSync(candidate2)) return candidate2;

  return null;
}

/**
 * Escape text for FFmpeg drawtext. Removes single quotes and colons to prevent filter syntax breakage.
 */
function escapeDrawtext(text: string): string {
  return text.replace(/'/g, '').replace(/:/g, ' ').replace(/"/g, '').replace(/\\/g, '').replace(/\[/g, '').replace(/\]/g, '').trim();
}

/**
 * Builds FFmpeg filter_complex chains for:
 * - lower_third: bottom-left broadcast card (yellow bar + bold name + subtitle + dark bg)
 * - center_title: centered bold stat/date callout (dark bg pill + yellow underline + white text)
 *
 * Uses FFmpeg-safe fixed positions with enable='between(t,0.05,HOLDEND)' — no animated alpha/slide.
 * - lower_third holds from 0.05s to min(2.5s, clipDuration-0.15s)
 * - center_title holds from 0.05s to min(2.0s, clipDuration-0.15s)
 *
 * Returns the filter strings to append and the new last label.
 */
export type CalloutType =
  | 'stat_callout'
  | 'lower_third'
  | 'location_badge'
  | 'evidence_tag'
  | 'quote_card'
  | 'chapter_header'
  | 'highlight_pill'
  | 'split_title'
  | 'center_title';

export type CalloutThemeColor = 'gold' | 'amber' | 'cyan' | 'crimson' | 'emerald' | 'slate' | 'white';

export interface CalloutInput {
  type: CalloutType;
  line1: string;
  line2?: string;
  spokenTrigger?: string;
  themeColor?: CalloutThemeColor;
  startTime?: number;
  endTime?: number;
}

const THEME_PALETTES: Record<CalloutThemeColor, { primary: string; secondary: string; border: string; bg: string }> = {
  gold: { primary: '0xF5C518', secondary: '0xFDE68A', border: '0xF59E0B', bg: '0x09090b@0.88' },
  amber: { primary: '0xF59E0B', secondary: '0xFEF3C7', border: '0xD97706', bg: '0x09090b@0.88' },
  cyan: { primary: '0x06B6D4', secondary: '0xCFFAFE', border: '0x0891B2', bg: '0x09090b@0.88' },
  crimson: { primary: '0xEF4444', secondary: '0xFEE2E2', border: '0xDC2626', bg: '0x180808@0.92' },
  emerald: { primary: '0x10B981', secondary: '0xD1FAE5', border: '0x059669', bg: '0x09090b@0.88' },
  slate: { primary: '0xE2E8F0', secondary: '0x94A3B8', border: '0x475569', bg: '0x09090b@0.88' },
  white: { primary: '0xFFFFFF', secondary: '0xD4D4D8', border: '0x71717A', bg: '0x09090b@0.88' },
};

/**
 * Builds FFmpeg filter_complex chains for 8 broadcast-grade documentary overlay styles:
 * - stat_callout: Giant bold numeric stat + dark pill backdrop + supporting label
 * - lower_third: Netflix-style broadcast card with gold vertical accent bar + name + role
 * - location_badge: Translucent pill with pin/dot marker for cities & dates
 * - evidence_tag: Crimson/amber alert box for charges, crimes, and evidence
 * - quote_card: Frosted dark glass backplate with italicized quote text
 * - chapter_header: Cinematic full-width center banner with top/bottom lines
 * - highlight_pill: Compact floating high-contrast keyword badge
 * - split_title: Two-tone badge with dark left header + accent right body
 * - center_title: (legacy fallback) centered bold title
 *
 * Uses buttery smooth mathematical FFmpeg expressions:
 * - 0.25s alpha ease-in & ease-out fade
 * - 0.25s Y-axis slide-up entrance
 * - High-contrast drop shadows & crisp borders
 */
export function buildCalloutFilters(
  callout: CalloutInput | null | undefined,
  inputLabel: string,
  clipDuration: number
): { filters: string[]; outputLabel: string } {
  if (!callout || !callout.line1) return { filters: [], outputLabel: inputLabel };

  const filters: string[] = [];
  const line1 = escapeDrawtext(callout.line1);
  const line2 = callout.line2 ? escapeDrawtext(callout.line2) : '';
  const tag = `co_${Math.random().toString(36).slice(2, 7)}`;

  // Windows font paths
  const boldFont = 'C\\:/Windows/Fonts/arialbd.ttf';
  const regularFont = 'C\\:/Windows/Fonts/arial.ttf';

  // Precision timing
  const startT = typeof callout.startTime === 'number' ? Math.max(0.05, callout.startTime) : 0.05;
  const maxEnd = Math.max(startT + 0.6, clipDuration - 0.05);
  const endT = typeof callout.endTime === 'number'
    ? Math.min(maxEnd, Math.max(startT + 0.8, callout.endTime))
    : Math.min(maxEnd, startT + 2.4);

  const T0 = Number(startT.toFixed(2));
  const T1 = Number(endT.toFixed(2));
  const dFade = 0.25;

  const enableExpr = `between(t,${T0},${T1})`;
  const alphaExpr = `if(lt(t,${T0}),0,if(lt(t,${T0}+${dFade}),(t-${T0})/${dFade},if(lt(t,${T1}-${dFade}),1,(${T1}-t)/${dFade})))`;
  const slideExpr = (baseY: number, travel = 24) =>
    `if(lt(t,${T0}+${dFade}),${baseY}+${travel}*(1-(t-${T0})/${dFade}),${baseY})`;

  const themeKey = (callout.themeColor && THEME_PALETTES[callout.themeColor]) ? callout.themeColor : 'gold';
  const theme = THEME_PALETTES[themeKey];

  const type = callout.type || 'lower_third';

  if (type === 'stat_callout' || type === 'center_title') {
    // ── 1. STAT CALLOUT — Clean centered card, NO left-side overflow ──
    // Pure text: huge bold stat centered on screen, no background box
    const statY = 480;

    // Dark pill backplate — perfectly centered, fixed width
    const pillW = 760;
    const pillH = line2 ? 220 : 160;
    const lbl0 = `[${tag}_pill]`;
    filters.push(
      `${inputLabel}drawbox=x=(1920-${pillW})/2:y='${slideExpr(statY - 24)}':w=${pillW}:h=${pillH}:color=0x09090b@0.88:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // Top accent bar — centered, same width as pill
    const lbl1 = `[${tag}_topbar]`;
    filters.push(
      `${lbl0}drawbox=x=(1920-${pillW})/2:y='${slideExpr(statY - 24)}':w=${pillW}:h=5:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl1}`
    );

    // Huge stat text — centered
    const lbl2 = `[${tag}_stat]`;
    filters.push(
      `${lbl1}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=110:fontcolor=white:borderw=5:bordercolor=black:shadowx=4:shadowy=4:shadowcolor=black@0.95:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(statY)}':enable='${enableExpr}'${lbl2}`
    );

    if (line2) {
      const lbl3 = `[${tag}_sub]`;
      filters.push(
        `${lbl2}drawtext=text='${line2.toUpperCase()}':fontfile='${boldFont}':fontsize=38:fontcolor=${theme.primary}:borderw=2:bordercolor=black:shadowx=2:shadowy=2:shadowcolor=black@0.9:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(statY + 118)}':enable='${enableExpr}'${lbl3}`
      );
      return { filters, outputLabel: lbl3 };
    }

    return { filters, outputLabel: lbl2 };

  } else if (type === 'lower_third') {
    // ── 2. GRADIENT NAMEPLATE — Diagonal gold sweep across bottom, no box ──
    const gradY = 870;
    const gradH = 130;

    // Full-width translucent gradient bar (dark left → transparent right)
    const lbl0 = `[${tag}_grad]`;
    filters.push(
      `${inputLabel}drawbox=x=0:y='${slideExpr(gradY)}':w=960:h=${gradH}:color=0x000000@0.82:t=fill:enable='${enableExpr}'${lbl0}`
    );
    // Fade-out second half
    const lbl0b = `[${tag}_grad2]`;
    filters.push(
      `${lbl0}drawbox=x=960:y='${slideExpr(gradY)}':w=400:h=${gradH}:color=0x000000@0.38:t=fill:enable='${enableExpr}'${lbl0b}`
    );

    // Gold accent bottom line full-width
    const lbl1 = `[${tag}_gline]`;
    filters.push(
      `${lbl0b}drawbox=x=0:y='${slideExpr(gradY + gradH - 6)}':w=1920:h=6:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl1}`
    );

    // Gold small ALL-CAPS role label above name
    if (line2) {
      const lbl1b = `[${tag}_role]`;
      filters.push(
        `${lbl1}drawtext=text='${line2.toUpperCase()}':fontfile='${boldFont}':fontsize=30:fontcolor=${theme.primary}:borderw=0:shadowx=2:shadowy=2:shadowcolor=black@0.9:alpha='${alphaExpr}':x=48:y='${slideExpr(gradY + 12)}':enable='${enableExpr}'${lbl1b}`
      );
      // Bold huge name
      const lbl2 = `[${tag}_name]`;
      filters.push(
        `${lbl1b}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=72:fontcolor=white:borderw=4:bordercolor=0x000000@0.6:shadowx=3:shadowy=3:shadowcolor=black@0.95:alpha='${alphaExpr}':x=48:y='${slideExpr(gradY + 48)}':enable='${enableExpr}'${lbl2}`
      );
      return { filters, outputLabel: lbl2 };
    }

    // No subtitle — just huge name
    const lbl2 = `[${tag}_name]`;
    filters.push(
      `${lbl1}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=72:fontcolor=white:borderw=4:bordercolor=0x000000@0.6:shadowx=3:shadowy=3:shadowcolor=black@0.95:alpha='${alphaExpr}':x=48:y='${slideExpr(gradY + 28)}':enable='${enableExpr}'${lbl2}`
    );

    return { filters, outputLabel: lbl2 };

  } else if (type === 'location_badge') {
    // ── 3. MAP PIN CHIP — Centered rounded pill + location marker ──
    const chipW = 860;
    const chipH = line2 ? 120 : 88;
    const chipX = (1920 - chipW) / 2; // 530
    const chipY = 60;

    // Dark pill background (centered)
    const lbl0 = `[${tag}_pill]`;
    filters.push(
      `${inputLabel}drawbox=x=${chipX}:y='${slideExpr(chipY)}':w=${chipW}:h=${chipH}:color=0x000000@0.88:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // Gold bottom border of pill
    const lbl1 = `[${tag}_border]`;
    filters.push(
      `${lbl0}drawbox=x=${chipX}:y='${slideExpr(chipY + chipH - 5)}':w=${chipW}:h=5:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl1}`
    );

    // Bullet + city text (centered)
    const pinText = `•  ${line1}`;
    const lbl2 = `[${tag}_city]`;
    filters.push(
      `${lbl1}drawtext=text='${escapeDrawtext(pinText)}':fontfile='${boldFont}':fontsize=48:fontcolor=white:borderw=3:bordercolor=black:shadowx=3:shadowy=3:shadowcolor=black@0.9:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(chipY + 14)}':enable='${enableExpr}'${lbl2}`
    );

    if (line2) {
      const lbl3 = `[${tag}_sub]`;
      filters.push(
        `${lbl2}drawtext=text='${line2}':fontfile='${regularFont}':fontsize=30:fontcolor=${theme.primary}:borderw=1:bordercolor=black:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(chipY + 72)}':enable='${enableExpr}'${lbl3}`
      );
      return { filters, outputLabel: lbl3 };
    }

    return { filters, outputLabel: lbl2 };

  } else if (type === 'evidence_tag') {
    // ── 4. RED STAMP — Giant "CHARGED" watermark panel + charge text ──
    // Dark center overlay panel
    const stampW = 1300;
    const stampH = 220;
    const stampX = (1920 - stampW) / 2; // 310
    const stampY = 430;

    const lbl0 = `[${tag}_bg]`;
    filters.push(
      `${inputLabel}drawbox=x=${stampX}:y='${slideExpr(stampY)}':w=${stampW}:h=${stampH}:color=0x1A0000@0.90:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // Thick crimson border top
    const lbl1 = `[${tag}_btop]`;
    filters.push(
      `${lbl0}drawbox=x=${stampX}:y='${slideExpr(stampY)}':w=${stampW}:h=8:color=0xCC0000:t=fill:enable='${enableExpr}'${lbl1}`
    );

    // Thick crimson border bottom
    const lbl2 = `[${tag}_bbot]`;
    filters.push(
      `${lbl1}drawbox=x=${stampX}:y='${slideExpr(stampY + stampH - 8)}':w=${stampW}:h=8:color=0xCC0000:t=fill:enable='${enableExpr}'${lbl2}`
    );

    // Watermark text inside the card
    const stampWord = line2 ? line2.toUpperCase() : 'OFFICIAL CHARGE';
    const lbl3 = `[${tag}_stamp]`;
    filters.push(
      `${lbl2}drawtext=text='${stampWord}':fontfile='${boldFont}':fontsize=72:fontcolor=0xFF0000@0.22:borderw=0:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(stampY + 24)}':enable='${enableExpr}'${lbl3}`
    );

    // Bold main charge text centered on top of watermark
    const lbl4 = `[${tag}_charge]`;
    filters.push(
      `${lbl3}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=54:fontcolor=white:borderw=4:bordercolor=0xAA0000:shadowx=3:shadowy=3:shadowcolor=0xAA0000@0.9:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(stampY + 110)}':enable='${enableExpr}'${lbl4}`
    );

    return { filters, outputLabel: lbl4 };

  } else if (type === 'quote_card') {
    // ── 5. QUOTE CARD (Frosted Glass Panel with Quotation Glyph) ──
    const cardW = 1440;
    const cardH = line2 ? 190 : 140;
    const cardX = (1920 - cardW) / 2; // 240
    const cardY = 740;

    // Dark frosted backdrop
    const lbl0 = `[${tag}_bg]`;
    filters.push(
      `${inputLabel}drawbox=x=${cardX}:y='${slideExpr(cardY)}':w=${cardW}:h=${cardH}:color=0x000000@0.88:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // Left accent vertical bar
    const lbl1 = `[${tag}_bar]`;
    filters.push(
      `${lbl0}drawbox=x=${cardX}:y='${slideExpr(cardY)}':w=10:h=${cardH}:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl1}`
    );

    // Large quotation mark on the left
    const lbl2 = `[${tag}_glyph]`;
    filters.push(
      `${lbl1}drawtext=text='“':fontfile='${boldFont}':fontsize=96:fontcolor=${theme.primary}:alpha='${alphaExpr}':x=${cardX + 30}:y='${slideExpr(cardY + 10)}':enable='${enableExpr}'${lbl2}`
    );

    // Main quote text (indented past the quote glyph)
    const lbl3 = `[${tag}_quote]`;
    filters.push(
      `${lbl2}drawtext=text='${line1}':fontfile='${regularFont}':fontsize=40:fontcolor=white:borderw=2:bordercolor=black:shadowx=2:shadowy=2:shadowcolor=black@0.9:alpha='${alphaExpr}':x=${cardX + 110}:y='${slideExpr(cardY + 24)}':enable='${enableExpr}'${lbl3}`
    );

    // Speaker attribution - clean single line indented below the quote
    if (line2) {
      const speakerText = `— ${line2.toUpperCase()}`;
      const lbl4 = `[${tag}_speaker]`;
      filters.push(
        `${lbl3}drawtext=text='${escapeDrawtext(speakerText)}':fontfile='${boldFont}':fontsize=26:fontcolor=${theme.primary}:borderw=1:bordercolor=black:alpha='${alphaExpr}':x=${cardX + 110}:y='${slideExpr(cardY + 118)}':enable='${enableExpr}'${lbl4}`
      );
      return { filters, outputLabel: lbl4 };
    }

    return { filters, outputLabel: lbl3 };

  } else if (type === 'chapter_header') {
    // ── 6. CHAPTER / ACT HEADER (Cinematic Full-Width Center Banner) ──
    const bannerY = 420;
    const bannerH = 240;

    // Full width dark backdrop band
    const lbl0 = `[${tag}_bg]`;
    filters.push(
      `${inputLabel}drawbox=x=0:y='${slideExpr(bannerY)}':w=1920:h=${bannerH}:color=0x000000@0.92:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // Top gold line (thick)
    const lbl1 = `[${tag}_top]`;
    filters.push(
      `${lbl0}drawbox=x=0:y='${slideExpr(bannerY)}':w=1920:h=6:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl1}`
    );

    // Bottom gold line (thick)
    const lbl2 = `[${tag}_bot]`;
    filters.push(
      `${lbl1}drawbox=x=0:y='${slideExpr(bannerY + bannerH - 6)}':w=1920:h=6:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl2}`
    );

    // Bold title text — bigger
    const lbl3 = `[${tag}_l1]`;
    filters.push(
      `${lbl2}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=96:fontcolor=white:borderw=5:bordercolor=black:shadowx=4:shadowy=4:shadowcolor=black@0.95:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(bannerY + 32)}':enable='${enableExpr}'${lbl3}`
    );

    if (line2) {
      const lbl4 = `[${tag}_l2]`;
      filters.push(
        `${lbl3}drawtext=text='${line2.toUpperCase()}':fontfile='${boldFont}':fontsize=38:fontcolor=${theme.primary}:borderw=2:bordercolor=black:shadowx=2:shadowy=2:shadowcolor=black@0.9:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(bannerY + 152)}':enable='${enableExpr}'${lbl4}`
      );
      return { filters, outputLabel: lbl4 };
    }

    return { filters, outputLabel: lbl3 };

  } else if (type === 'highlight_pill') {
    // ── 7. HIGHLIGHT PILL — Neon Colored Pill (Centered, high contrast) ──
    const pillW = 860;
    const pillH = 96;
    const pillX = (1920 - pillW) / 2; // 530
    const pillY = 880;

    // Solid colored pill background (centered at x=530)
    const lbl0 = `[${tag}_pill]`;
    filters.push(
      `${inputLabel}drawbox=x=${pillX}:y='${slideExpr(pillY)}':w=${pillW}:h=${pillH}:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // Dark inner depth accent at top
    const lbl1 = `[${tag}_depth]`;
    filters.push(
      `${lbl0}drawbox=x=${pillX}:y='${slideExpr(pillY)}':w=${pillW}:h=4:color=0x000000@0.40:t=fill:enable='${enableExpr}'${lbl1}`
    );

    // Bold dark text on bright colored pill
    const lbl2 = `[${tag}_txt]`;
    filters.push(
      `${lbl1}drawtext=text='${line1.toUpperCase()}':fontfile='${boldFont}':fontsize=52:fontcolor=0x09090b:borderw=0:shadowx=2:shadowy=2:shadowcolor=0x000000@0.3:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(pillY + 22)}':enable='${enableExpr}'${lbl2}`
    );

    return { filters, outputLabel: lbl2 };

  } else if (type === 'split_title') {
    // ── 8. SPLIT TITLE (Dual-Box Milestone Badge) — 2x larger ──
    const splitY = 840;
    const leftW = 420;
    const rightW = 500;
    const splitH = 110;

    // Left black header box
    const lbl0 = `[${tag}_lbg]`;
    filters.push(
      `${inputLabel}drawbox=x=80:y='${slideExpr(splitY)}':w=${leftW}:h=${splitH}:color=0x09090b@0.97:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // Right accent body box
    const lbl1 = `[${tag}_rbg]`;
    filters.push(
      `${lbl0}drawbox=x=${80 + leftW}:y='${slideExpr(splitY)}':w=${rightW}:h=${splitH}:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl1}`
    );

    // Left text (white) — bigger
    const lbl2 = `[${tag}_ltxt]`;
    filters.push(
      `${lbl1}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=44:fontcolor=white:borderw=2:bordercolor=black:alpha='${alphaExpr}':x=100:y='${slideExpr(splitY + 28)}':enable='${enableExpr}'${lbl2}`
    );

    // Right text (dark) — bigger
    const rightText = line2 || line1;
    const lbl3 = `[${tag}_rtxt]`;
    filters.push(
      `${lbl2}drawtext=text='${rightText}':fontfile='${boldFont}':fontsize=44:fontcolor=0x111116:borderw=1:bordercolor=0x333333:alpha='${alphaExpr}':x=${80 + leftW + 20}:y='${slideExpr(splitY + 28)}':enable='${enableExpr}'${lbl3}`
    );

    return { filters, outputLabel: lbl3 };

  } else if (type === 'ticker_bar') {
    // ── 9. TICKER BAR (Persistent Bottom Info Banner — News Style) ──
    const tickerY = 950;
    const tickerH = 56;

    // Full-width dark background
    const lbl0 = `[${tag}_bg]`;
    filters.push(
      `${inputLabel}drawbox=x=0:y='${slideExpr(tickerY)}':w=1920:h=${tickerH}:color=0x09090b@0.95:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // Left-side category label box
    const labelW = line2 ? 220 : 0;
    const lbl1 = `[${tag}_lbl]`;
    if (line2) {
      filters.push(
        `${lbl0}drawbox=x=0:y='${slideExpr(tickerY)}':w=${labelW}:h=${tickerH}:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl1}`
      );
      const lbl1b = `[${tag}_lbltxt]`;
      filters.push(
        `${lbl1}drawtext=text='${escapeDrawtext(line2.toUpperCase())}':fontfile='${boldFont}':fontsize=22:fontcolor=0x09090b:borderw=0:alpha='${alphaExpr}':x=12:y='${slideExpr(tickerY + 17)}':enable='${enableExpr}'${lbl1b}`
      );
      // Ticker content text
      const lbl2b = `[${tag}_tick]`;
      filters.push(
        `${lbl1b}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=28:fontcolor=white:borderw=2:bordercolor=black:alpha='${alphaExpr}':x=${labelW + 20}:y='${slideExpr(tickerY + 14)}':enable='${enableExpr}'${lbl2b}`
      );
      return { filters, outputLabel: lbl2b };
    } else {
      filters.push(
        `${lbl0}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=28:fontcolor=white:borderw=2:bordercolor=black:alpha='${alphaExpr}':x=24:y='${slideExpr(tickerY + 14)}':enable='${enableExpr}'${lbl1}`
      );
      return { filters, outputLabel: lbl1 };
    }

  } else if (type === 'corner_tag') {
    // ── 10. CORNER TAG (Top-Right Compact Source/Credit Label) ──
    const cornerX = 1680;
    const cornerY = 40;

    const lbl0 = `[${tag}_bg]`;
    filters.push(
      `${inputLabel}drawbox=x=${cornerX}:y='${slideExpr(cornerY)}':w=220:h=60:color=${theme.bg}:t=fill:enable='${enableExpr}'${lbl0}`
    );

    const lbl1 = `[${tag}_bar]`;
    filters.push(
      `${lbl0}drawbox=x=${cornerX}:y='${slideExpr(cornerY)}':w=220:h=4:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl1}`
    );

    const lbl2 = `[${tag}_l1]`;
    filters.push(
      `${lbl1}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=22:fontcolor=white:borderw=1:bordercolor=black:alpha='${alphaExpr}':x=${cornerX + 10}:y='${slideExpr(cornerY + 14)}':enable='${enableExpr}'${lbl2}`
    );

    if (line2) {
      const lbl3 = `[${tag}_l2]`;
      filters.push(
        `${lbl2}drawtext=text='${line2}':fontfile='${regularFont}':fontsize=16:fontcolor=${theme.secondary}:alpha='${alphaExpr}':x=${cornerX + 10}:y='${slideExpr(cornerY + 38)}':enable='${enableExpr}'${lbl3}`
      );
      return { filters, outputLabel: lbl3 };
    }

    return { filters, outputLabel: lbl2 };

  } else if (type === 'full_screen_title') {
    // ── 11. FULL SCREEN TITLE (Cinematic Opener / Episode Title Card) ──
    // Dark vignette overlay + centered XL bold text
    const lbl0 = `[${tag}_vignette]`;
    filters.push(
      `${inputLabel}drawbox=x=0:y=0:w=1920:h=1080:color=0x000000@0.55:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // Top accent bar
    const lbl1 = `[${tag}_topbar]`;
    filters.push(
      `${lbl0}drawbox=x=200:y=380:w=1520:h=3:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl1}`
    );

    // Bottom accent bar
    const lbl2 = `[${tag}_botbar]`;
    filters.push(
      `${lbl1}drawbox=x=200:y=700:w=1520:h=3:color=${theme.primary}:t=fill:enable='${enableExpr}'${lbl2}`
    );

    // Huge episode title
    const lbl3 = `[${tag}_main]`;
    filters.push(
      `${lbl2}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=96:fontcolor=white:borderw=5:bordercolor=black:shadowx=4:shadowy=4:shadowcolor=black@0.95:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(420)}':enable='${enableExpr}'${lbl3}`
    );

    if (line2) {
      const lbl4 = `[${tag}_sub]`;
      filters.push(
        `${lbl3}drawtext=text='${line2}':fontfile='${regularFont}':fontsize=36:fontcolor=${theme.secondary}:borderw=2:bordercolor=black:alpha='${alphaExpr}':x=(w-tw)/2:y='${slideExpr(582)}':enable='${enableExpr}'${lbl4}`
      );
      return { filters, outputLabel: lbl4 };
    }

    return { filters, outputLabel: lbl3 };

  } else if (type === 'breaking_news') {
    // ── 12. BREAKING NEWS BANNER (Bold Red Alert Header — Crisis Style) ──
    const alertH = 110;
    const alertY = 0;

    // Full-width red alert top bar
    const lbl0 = `[${tag}_redbg]`;
    filters.push(
      `${inputLabel}drawbox=x=0:y='${slideExpr(alertY)}':w=1920:h=${alertH}:color=0xCC0000@0.95:t=fill:enable='${enableExpr}'${lbl0}`
    );

    // "BREAKING" or line2 label on left
    const labelText = line2 ? line2.toUpperCase() : 'BREAKING';
    const lbl1 = `[${tag}_lbl]`;
    filters.push(
      `${lbl0}drawtext=text='${labelText}':fontfile='${boldFont}':fontsize=26:fontcolor=white:borderw=1:bordercolor=0x880000:alpha='${alphaExpr}':x=30:y='${slideExpr(alertY + 12)}':enable='${enableExpr}'${lbl1}`
    );

    // Main bold headline (white, very large)
    const lbl2 = `[${tag}_headline]`;
    filters.push(
      `${lbl1}drawtext=text='${line1}':fontfile='${boldFont}':fontsize=48:fontcolor=white:borderw=3:bordercolor=0x880000:shadowx=2:shadowy=2:alpha='${alphaExpr}':x=30:y='${slideExpr(alertY + 48)}':enable='${enableExpr}'${lbl2}`
    );

    return { filters, outputLabel: lbl2 };
  }

  return { filters: [], outputLabel: inputLabel };
}

export async function renderTimelineVideo(
  timelineJsonPath: string,
  outputVideoPath: string,
  onProgress?: (clipIndex: number, totalClips: number) => void
): Promise<string> {
  const absoluteTimelinePath = path.resolve(timelineJsonPath);
  if (!fs.existsSync(absoluteTimelinePath)) {
    throw new Error(`Timeline file not found: ${absoluteTimelinePath}`);
  }

  const timeline = JSON.parse(fs.readFileSync(absoluteTimelinePath, 'utf-8'));
  const timelineDir = path.dirname(absoluteTimelinePath);
  const tmpDir = path.join(timelineDir, 'tmp_render');
  fs.mkdirSync(tmpDir, { recursive: true });

  const finalOut = path.resolve(outputVideoPath);
  const fps = 30;
  const processedClips: string[] = [];

  console.log(`\n🎬 [RenderEngine] Starting Automated Video Render`);
  console.log(`📋 Timeline: ${absoluteTimelinePath}`);
  console.log(`📂 Output: ${finalOut}`);
  console.log(`🎞️  Clips: ${timeline.clips.length} | ⏱️ Duration: ${Math.round(timeline.totalDuration)}s\n`);

  for (let i = 0; i < timeline.clips.length; i++) {
    const clip = timeline.clips[i];
    const duration = Math.max(0.5, clip.endTime - clip.startTime);
    const outFile = path.join(tmpDir, `clip_${String(i).padStart(4, '0')}.mp4`);
    processedClips.push(outFile);

    if (onProgress) onProgress(i + 1, timeline.clips.length);

    const resolvedPath = resolveClipPath(clip.clipPath, timelineDir);
    const isImage =
      clip.mediaType === 'image' ||
      (resolvedPath && /\.(jpg|jpeg|png|webp)$/i.test(resolvedPath)) ||
      !resolvedPath;

    console.log(
      `  🎬 [${i + 1}/${timeline.clips.length}] ${isImage ? '📷 Photo' : '📹 Video'}: ${path.basename(resolvedPath || 'placeholder')} (${duration.toFixed(1)}s)`
    );

    let ffmpegCmd = '';
    const totalFrames = Math.max(15, Math.ceil(duration * fps));

    // ── DYNAMIC TRANSITIONS ON EVERY CLIP (Rotates through 3 minimal styles) ──
    // 1. Shutter Click (0.06s), 2. Soft Film Fade (0.12s), 3. Subtle Film Dip (0.08s)
    let colorGrade = `eq=contrast=1.06:brightness=-0.01:saturation=1.06`;
    const transMode = i % 3;

    if (transMode === 0) {
      // 1. Shutter Click: 0.06s camera shutter blink
      colorGrade = `eq=contrast=1.06:brightness='if(lt(t,0.06),0.16*(1-t/0.06),-0.01)':saturation=1.06`;
    } else if (transMode === 1) {
      // 2. Soft Film Fade: 0.12s quick micro-fade from soft dark
      colorGrade = `eq=contrast=1.06:brightness='if(lt(t,0.12),-0.25*(1-t/0.12),-0.01)':saturation=1.06`;
    } else {
      // 3. Subtle Film Dip: 0.08s micro dip
      colorGrade = `eq=contrast=1.06:brightness='if(lt(t,0.08),-0.18*(1-t/0.08),-0.01)':saturation=1.06`;
    }

    const filmGrain = `noise=c0s=5:allf=t+u`;

    if (isImage) {
      // ── DYNAMIC CONTINUOUS CAMERA MOTION ON EVERY PHOTO (4 FLUID MODES) ──
      const vectorType = i % 4;
      let zoompanExpr = '';

      if (vectorType === 0) {
        // 1. Smooth Push-In (1.0 -> 1.07) — continuous, steady glide
        zoompanExpr = `zoompan=z='1.0+0.07*(on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${totalFrames}:s=1920x1080:fps=${fps}`;
      } else if (vectorType === 1) {
        // 2. Smooth Reveal Pull-Out (1.07 -> 1.0) — continuous, steady reveal
        zoompanExpr = `zoompan=z='1.07-0.07*(on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${totalFrames}:s=1920x1080:fps=${fps}`;
      } else if (vectorType === 2) {
        // 3. Smooth Fluid Arc: Gentle Zoom-In -> Gentle Zoom-Out (1.0 -> 1.05 -> 1.0)
        zoompanExpr = `zoompan=z='1.0+0.05*sin(3.14159265*on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d=${totalFrames}:s=1920x1080:fps=${fps}`;
      } else {
        // 4. Smooth Vertical Parallax Drift (1.03 -> 1.06 gentle vertical glide)
        zoompanExpr = `zoompan=z='1.03+0.03*(on/${totalFrames})':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)*(on/${totalFrames})':d=${totalFrames}:s=1920x1080:fps=${fps}`;
      }

      const inputSpec = resolvedPath
        ? `-loop 1 -i "${resolvedPath}"`
        : `-f lavfi -i color=c=0x18181b:s=1920x1080:r=${fps}`;

      // Scale to 2160px wide (safe for zoompan buffer), let zoompan handle 1920x1080 output
      const filterChain = `[0:v]scale=2160:-1:force_original_aspect_ratio=increase,${zoompanExpr},${colorGrade},${filmGrain}[base]`;
      const filters: string[] = [filterChain];
      let lastLabel = '[base]';

      // ── NUMBER CALLOUTS (badge overlays) ──
      if (clip.numberOverlays && clip.numberOverlays.length > 0) {
        for (let oi = 0; oi < clip.numberOverlays.length; oi++) {
          const overlay = clip.numberOverlays[oi];
          const outLabel = `[ov${oi}]`;
          const enable = `between(t,${Math.max(0, overlay.startTime).toFixed(2)},${overlay.endTime.toFixed(2)})`;
          const safeText = escapeDrawtext(overlay.text);
          filters.push(
            `${lastLabel}drawtext=text='${safeText}':fontsize=64:fontcolor=0x111116:fontfile='C\\:/Windows/Fonts/arialbd.ttf':box=1:boxcolor=0xF59E0B@0.95:boxborderw=16:x=(w-tw)/2:y=h-220:enable='${enable}'${outLabel}`
          );
          lastLabel = outLabel;
        }
      }

      // ── AI CALLOUT OVERLAYS (lower_third / center_title with audio sync) ──
      const { filters: calloutFilters, outputLabel: calloutLabel } = buildCalloutFilters(
        (clip as any).callout,
        lastLabel,
        duration
      );
      filters.push(...calloutFilters);
      lastLabel = calloutLabel;

      const finalFilter = filters.join(';');
      const mapLabel = lastLabel.replace(/[\[\]]/g, '');

      ffmpegCmd = [
        `${FFMPEG_BIN} -y`,
        inputSpec,
        `-t ${duration.toFixed(3)}`,
        `-filter_complex "${finalFilter}"`,
        `-map "[${mapLabel}]"`,
        `-r ${fps} -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p`,
        `-an "${outFile}"`,
      ].join(' ');
    } else {
      // ── REAL VIDEO BEAT (Clean Hard Cut & 35mm Film Grain) ──
      const filters: string[] = [
        `[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,${colorGrade},${filmGrain}[graded]`,
      ];
      let lastLabel = '[graded]';

      // ── NUMBER CALLOUTS (badge overlays) ──
      if (clip.numberOverlays && clip.numberOverlays.length > 0) {
        for (let oi = 0; oi < clip.numberOverlays.length; oi++) {
          const overlay = clip.numberOverlays[oi];
          const outLabel = `[ov${oi}]`;
          const enable = `between(t,${Math.max(0, overlay.startTime).toFixed(2)},${overlay.endTime.toFixed(2)})`;
          const safeText = escapeDrawtext(overlay.text);
          filters.push(
            `${lastLabel}drawtext=text='${safeText}':fontsize=64:fontcolor=0x111116:fontfile='C\\:/Windows/Fonts/arialbd.ttf':box=1:boxcolor=0xF59E0B@0.95:boxborderw=16:x=(w-tw)/2:y=h-220:enable='${enable}'${outLabel}`
          );
          lastLabel = outLabel;
        }
      }

      // ── AI CALLOUT OVERLAYS (lower_third / center_title) ──
      const { filters: calloutFilters, outputLabel: calloutLabel } = buildCalloutFilters(
        (clip as any).callout,
        lastLabel,
        duration
      );
      filters.push(...calloutFilters);
      lastLabel = calloutLabel;

      const finalFilter = filters.join(';');
      const mapLabel = lastLabel.replace(/[\[\]]/g, '');

      ffmpegCmd = [
        `${FFMPEG_BIN} -y`,
        `-i "${resolvedPath}"`,
        `-t ${duration.toFixed(3)}`,
        `-filter_complex "${finalFilter}"`,
        `-map "[${mapLabel}]"`,
        `-r ${fps} -c:v libx264 -preset fast -crf 17 -pix_fmt yuv420p`,
        `-an "${outFile}"`,
      ].join(' ');
    }

    try {
      execSync(ffmpegCmd, { stdio: 'pipe' });
    } catch (err: any) {
      console.warn(`    ⚠️ Clip render fallback for clip ${i}:`, err.message?.slice(0, 100));
      const fallbackCmd = `${FFMPEG_BIN} -y -f lavfi -i color=c=0x18181b:s=1920x1080:r=${fps} -t ${duration.toFixed(3)} -c:v libx264 -preset ultrafast -an "${outFile}"`;
      execSync(fallbackCmd, { stdio: 'pipe' });
    }
  }

  // ── CONCATENATE CLIPS ───────────────────────────────────────────────────────
  console.log(`\n🔗 Concatenating ${processedClips.length} processed video clips...`);
  const concatListPath = path.join(tmpDir, 'concat_list.txt');
  const listContent = processedClips.map((p) => `file '${p.replace(/\\/g, '/')}'`).join('\n');
  fs.writeFileSync(concatListPath, listContent);

  const rawVideoPath = path.join(tmpDir, 'raw_video.mp4');
  const concatCmd = `${FFMPEG_BIN} -y -f concat -safe 0 -i "${concatListPath}" -c copy "${rawVideoPath}"`;
  execSync(concatCmd, { stdio: 'pipe' });

  // ── AUDIO MIXING & FINAL MULTIPLEXING ───────────────────────────────────────
  const masterAudio = resolveClipPath(timeline.masterAudioPath, timelineDir);

  if (masterAudio && fs.existsSync(masterAudio)) {
    console.log(`🎙️  Multiplexing master narration audio track: ${path.basename(masterAudio)}`);
    const muxCmd = `${FFMPEG_BIN} -y -i "${rawVideoPath}" -i "${masterAudio}" -c:v copy -c:a aac -b:a 192k -shortest "${finalOut}"`;
    execSync(muxCmd, { stdio: 'pipe' });
  } else {
    console.warn('⚠️ No master audio file found — exporting silent video.');
    fs.copyFileSync(rawVideoPath, finalOut);
  }

  // Clean up temporary render folder
  try {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  } catch {}

  console.log(`\n====================================================`);
  console.log(`✅ AUTOMATED RENDER COMPLETE!`);
  console.log(`📁 Final Output: ${finalOut}`);
  console.log(`====================================================\n`);

  return finalOut;
}
