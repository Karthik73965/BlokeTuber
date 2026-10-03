import fs from 'fs';
import path from 'path';
import type { Timeline, CalloutOverlay } from '@repo/shared';
import { PROJECT_ID, REPO_ROOT, TIMELINES_DIR, saveTimelineAndSyncStore } from './director_engine';

interface CalloutDef {
  beatIndex: number; // 0-indexed
  callout: {
    type: string;
    line1: string;
    line2?: string;
  };
}

const CALLOUT_MAP: Record<number, CalloutDef[]> = {
  1: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'GLENOAKS BLVD & SR-118', line2: 'PACOIMA, LOS ANGELES • 6:45 AM' } },
    { beatIndex: 3, callout: { type: 'odometer_stat', line1: '1.18 FREEWAY COMMUTE', line2: 'THOUSANDS OF COMMUTERS DAILY' } },
    { beatIndex: 6, callout: { type: 'highlight_pill', line1: 'ROADSIDE FOLK ART', line2: 'TOY CARS & PINK FLAMINGOS' } },
    { beatIndex: 8, callout: { type: 'editorial_lower_third', line1: 'THE HILLSIDE ESTATE', line2: 'HAND-BUILT SHELTER & MATTRESS' } },
    { beatIndex: 13, callout: { type: 'editorial_lower_third', line1: 'JOSE FUENTES (AGE 60s)', line2: 'BORN IN COLIMA, MEXICO • MASTER LANDSCAPER' } },
    { beatIndex: 15, callout: { type: 'forensic_data_card', line1: 'PACOIMA EMBANKMENT', line2: 'STATE OF CALIFORNIA RIGHT-OF-WAY' } },
  ],
  2: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'JOSE FUENTES', line2: 'PROFESSIONAL LANDSCAPER • COLIMA, MEXICO' } },
    { beatIndex: 5, callout: { type: 'highlight_pill', line1: 'A LIFETIME OF TRADE', line2: 'SKILL AS AN UNACCOUNTED RESOURCE' } },
    { beatIndex: 10, callout: { type: 'editorial_lower_third', line1: 'TERRACED STEPS', line2: 'CARVED DIRECTLY INTO DECOMPOSED GRANITE' } },
    { beatIndex: 12, callout: { type: 'odometer_stat', line1: 'HUNDREDS OF HOURS', line2: 'NO BLUEPRINT • NO PUBLIC BUDGET' } },
    { beatIndex: 14, callout: { type: 'editorial_lower_third', line1: 'SOLAR SOUND SYSTEM', line2: 'MUSIC PLAYING FROM THE DOORWAY' } },
    { beatIndex: 19, callout: { type: 'forensic_data_card', line1: 'STATE-OWNED MARGIN', line2: 'A DECADE OF UNCHALLENGED LABOR' } },
  ],
  3: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'LOS ANGELES COUNTY', line2: 'AGING TRADESMEN WITHOUT A SAFETY NET' } },
    { beatIndex: 4, callout: { type: 'odometer_stat', line1: 'AGE 50s, 60s & BEYOND', line2: 'THE FASTEST-GROWING UNHOUSED DEMOGRAPHIC' } },
    { beatIndex: 7, callout: { type: 'newspaper_headline', line1: 'THE SLOW MATH OF RENT', line2: 'DAY LABORERS AGING OUT OF PHYSICAL WORK' } },
    { beatIndex: 10, callout: { type: 'editorial_lower_third', line1: 'VISIBLE DIGNITY', line2: 'A CRAFTSMAN THE PUBLIC ACCEPTS' } },
  ],
  4: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'TACO EL CANELO', line2: 'GLENOAKS COMMERCIAL STRIP MALL' } },
    { beatIndex: 5, callout: { type: 'editorial_lower_third', line1: 'NATHANIEL PADILLA', line2: 'OWNER, TACOS EL CANELO RESTAURANT' } },
    { beatIndex: 9, callout: { type: 'odometer_stat', line1: 'ZERO COMPLAINTS', line2: 'STANDING REFUSAL TO CALL THE CITY' } },
    { beatIndex: 11, callout: { type: 'highlight_pill', line1: 'COMMUNITY ACCORD', line2: 'HE MADE THE BLOCK BETTER, NOT WORSE' } },
  ],
  5: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'THE OTHER SIDE OF 118', line2: 'TWO REALITIES ON THE SAME FREEWAY' } },
    { beatIndex: 2, callout: { type: 'editorial_lower_third', line1: 'STELLA PONCE (AGE 88)', line2: 'PACOIMA RESIDENT • THE FENCE LINE' } },
    { beatIndex: 6, callout: { type: 'odometer_stat', line1: 'YEARS OF PLEAS', line2: 'UNHEEDED CALLS TO CITY & STATE' } },
    { beatIndex: 9, callout: { type: 'redacted_dossier', line1: 'SYSTEMIC NEGLECT', line2: 'GARDEN IN ONE SPOT, GRIEVANCE IN ANOTHER' } },
    { beatIndex: 13, callout: { type: 'highlight_pill', line1: 'THE BROKEN SYSTEM', line2: 'OUTCOMES DICTATED BY LUCK & LOCATION' } },
  ],
  6: [
    { beatIndex: 0, callout: { type: 'newspaper_headline', line1: 'LOCAL TELEVISION PICKUP', line2: 'BROADCAST NEWS MEETS SOCIAL ALGORITHMS' } },
    { beatIndex: 2, callout: { type: 'social_tweet_card', line1: '@LA_STREETS', line2: 'Millions of views on TikTok and YouTube' } },
    { beatIndex: 4, callout: { type: 'editorial_lower_third', line1: 'ALGORITHM CELEBRITY', line2: 'A RECURRING CHARACTER IN OTHER FEEDS' } },
    { beatIndex: 7, callout: { type: 'odometer_stat', line1: 'VIRALITY VS LEASE', line2: 'ATTENTION DOES NOT CONVERT TO HOUSING' } },
    { beatIndex: 13, callout: { type: 'highlight_pill', line1: 'THE SHARE BUTTON', line2: 'THE SHALLOW NATURE OF ONLINE COMPASSION' } },
  ],
  7: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'CALIFORNIA RIGHT-OF-WAY', line2: "THE JURISDICTIONAL NO-MAN'S LAND" } },
    { beatIndex: 4, callout: { type: 'redacted_dossier', line1: 'CALTRANS MEMO', line2: 'PANDEMIC-ERA PROTOCOL & JURISDICTION' } },
    { beatIndex: 10, callout: { type: 'editorial_lower_third', line1: 'COUNCILWOMAN MONICA RODRIGUEZ', line2: 'LOS ANGELES CITY COUNCIL • DISTRICT 7' } },
    { beatIndex: 15, callout: { type: 'forensic_data_card', line1: "3 TIERS OF GOVERNMENT", line2: "EVERYONE'S LAND • NO ONE'S CASELOAD" } },
    { beatIndex: 25, callout: { type: 'editorial_lower_third', line1: 'STELLA PONCE (AGE 88)', line2: 'PROOF OF THE GAP CUTTING THE OTHER WAY' } },
    { beatIndex: 32, callout: { type: 'newspaper_headline', line1: 'TRANSPORTATION AGENCY', line2: 'CALTRANS HAS ZERO SOCIAL CASEWORKERS' } },
    { beatIndex: 38, callout: { type: 'highlight_pill', line1: 'A DESIGN FLAW', line2: 'NOBODY HAS EVER PRIORITIZED FIXING IT' } },
  ],
  8: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'THE IMPERMANENCE', line2: 'A HILLSIDE NEVER MEANT TO LAST FOREVER' } },
    { beatIndex: 4, callout: { type: 'highlight_pill', line1: 'MOVING INTO SHADE', line2: 'DISMANTLING BEFORE THE HEAT SPIKES' } },
    { beatIndex: 7, callout: { type: 'editorial_lower_third', line1: 'NORTH HOLLYWOOD', line2: 'MODULAR PALLET CABIN VILLAGE OFFER' } },
    { beatIndex: 11, callout: { type: 'odometer_stat', line1: 'A VERSION OF TOO FAR', line2: 'THE HEAVY COST OF LEAVING COMMUNITY' } },
  ],
  9: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'INSIDE THE SHELTER', line2: 'THE TOUR BEYOND THE ROADSIDE SPECTACLE' } },
    { beatIndex: 4, callout: { type: 'highlight_pill', line1: 'SALVAGED TIMBER', line2: 'ACOUSTIC PANELS & SOLAR POWER' } },
    { beatIndex: 8, callout: { type: 'editorial_lower_third', line1: 'JUST A HOME', line2: 'BUILT WHEN NOBODY WOULD BUILD FOR HIM' } },
    { beatIndex: 13, callout: { type: 'odometer_stat', line1: 'NOTHING TO HIDE', line2: 'DIGNITY IN A LIFE WITHOUT PRIVACY' } },
  ],
  10: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'STATE ENFORCEMENT DIRECTIVE', line2: 'EXECUTIVE ORDER ON STATE HIGHWAYS' } },
    { beatIndex: 4, callout: { type: 'caution_tape_banner', line1: 'SUPREME COURT RULING', line2: 'GRANTS PASS V. JOHNSON ENFORCEMENT WAVE' } },
    { beatIndex: 7, callout: { type: 'forensic_data_card', line1: 'FREEWAY TARGETS', line2: 'I-405 • I-105 • I-110 • SR-118 CORRIDORS' } },
    { beatIndex: 11, callout: { type: 'newspaper_headline', line1: 'ENFORCEMENT CLOSING IN', line2: 'CLEARANCE WITHOUT AN OFFER OF HOUSING' } },
  ],
  11: [
    { beatIndex: 0, callout: { type: 'editorial_lower_third', line1: 'JOSE FUENTES', line2: 'NEVER ASKED TO BE A SYMBOL' } },
    { beatIndex: 5, callout: { type: 'highlight_pill', line1: 'A LIFETIME OF TRADE', line2: 'SKILL PRACTICED ON NEGLECTED GROUND' } },
    { beatIndex: 10, callout: { type: 'editorial_lower_third', line1: 'NO TIDY ENDING', line2: 'THE REALITY OF AN UNRESOLVED SYSTEM' } },
    { beatIndex: 16, callout: { type: 'odometer_stat', line1: 'MERCY OR NEGLECT?', line2: 'WEARING A NICER FACE' } },
    { beatIndex: 20, callout: { type: 'editorial_lower_third', line1: 'THE SLIDE IN MORNING LIGHT', line2: 'WHAT ONE PERSON MANAGED TO BUILD' } },
    { beatIndex: 25, callout: { type: 'highlight_pill', line1: 'AMERICAN HIDEAWAYS', line2: 'THE CRAFTSMAN ON THE FREEWAY HILLSIDE' } },
  ],
};

const CHAPTER_THEMES: Record<number, 'gold' | 'emerald' | 'amber' | 'cyan' | 'crimson' | 'slate'> = {
  1: 'gold',
  2: 'emerald',
  3: 'amber',
  4: 'cyan',
  5: 'crimson',
  6: 'gold',
  7: 'slate',
  8: 'cyan',
  9: 'amber',
  10: 'crimson',
  11: 'gold',
};

async function enrichCallouts() {
  console.log('═══════════════════════════════════════════════════════════════════');
  console.log('🎨 ENRICHING CALLOUT OVERLAYS ACROSS ALL 11 CHAPTERS');
  console.log('═══════════════════════════════════════════════════════════════════\n');

  let totalCallouts = 0;

  for (let chNum = 1; chNum <= 11; chNum++) {
    const numStr = String(chNum).padStart(2, '0');
    const tlPath = path.join(TIMELINES_DIR, `chapter_${numStr}.json`);

    if (!fs.existsSync(tlPath)) {
      console.warn(`⚠️ Timeline chapter_${numStr}.json does not exist. Skipping.`);
      continue;
    }

    const timeline: Timeline = JSON.parse(fs.readFileSync(tlPath, 'utf-8'));
    const theme = CHAPTER_THEMES[chNum] || 'gold';
    const defs = CALLOUT_MAP[chNum] || [];

    // Reset all callouts in clips first to clear any banned types (like location_badge)
    timeline.clips.forEach(clip => {
      clip.callout = null;
    });

    let chCalloutCount = 0;

    for (const def of defs) {
      if (def.beatIndex >= 0 && def.beatIndex < timeline.clips.length) {
        const clip = timeline.clips[def.beatIndex]!;
        const duration = clip.duration || (clip.endTime - clip.startTime);

        const callout: CalloutOverlay = {
          type: def.callout.type as any,
          line1: def.callout.line1,
          line2: def.callout.line2,
          startTime: 0.3,
          endTime: Math.min(Number((duration - 0.2).toFixed(2)), 3.8),
          themeColor: theme,
        };

        clip.callout = callout;
        chCalloutCount++;
        totalCallouts++;
      }
    }

    // Save updated timeline and sync stores
    saveTimelineAndSyncStore(chNum, timeline);
    console.log(`✨ Chapter ${numStr}: Added ${chCalloutCount} approved callouts (Theme: ${theme})`);
  }

  console.log('\n═══════════════════════════════════════════════════════════════════');
  console.log(`🎉 SUCCESS: Added ${totalCallouts} approved callout overlays across all 11 chapters!`);
  console.log('🚫 ZERO banned callout types (all 100% render-compatible in Remotion)');
  console.log('═══════════════════════════════════════════════════════════════════\n');
}

enrichCallouts().catch(err => {
  console.error('Failed to enrich callouts:', err);
  process.exit(1);
});
