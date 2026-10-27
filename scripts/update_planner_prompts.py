import sys

with open('apps/api/src/services/aiScriptPlanner.ts', 'r', encoding='utf-8') as f:
    text = f.read()

old_callout_section = """### 6. TEXT CALLOUTS (Approved Documentary Styles Only):
Generate callouts ONLY on high-impact story moments (~25–35% of beats). Write like a headline editor at Vice or NYT — specific, punchy, story-driven (3–7 words per line).
- Approved: "newspaper_headline", "editorial_lower_third", "odometer_stat", "redacted_dossier", "police_crime_sheet", "forensic_data_card", "typewriter_paper", "social_tweet_card", "reddit_thread_card", "caution_tape_banner", "fullscreen_chapter_title", "karaoke_captions".
*BANNED CALLOUTS: NEVER USE map_pingeotag, editorial_quote, court_transcript_card, wiretap_intercept, polaroid_snapshot, marker_circle, archival_evidence_tag, split_milestone_card.*
*NUMBER BADGES: Spoken number badge popups are completely disabled. Do not generate number callout triggers.*"""

new_callout_section = """### 6. TEXT CALLOUTS & STRICT VERBATIM AUDIO GROUNDING (MANDATORY):
Generate callouts ONLY on high-impact story moments (~25–35% of beats) that feature concrete data. Write like a headline editor at Vice or NYT — specific, punchy, story-driven (3–7 words per line).
- **100% GROUNDED IN VOICE TEXT**: Every single word, number, dollar amount, date, location, or quote in "line1" and "line2" MUST BE DIRECTLY DERIVED OR QUOTED from the spoken words of that specific beat!
- **ZERO HALLUCINATION RULE**: NEVER invent external statistics, temperatures (e.g. "140°F"), future build strategies, or academic buzzwords that were not spoken in this beat.
- **SPOKEN QUOTES MUST USE QUOTATION MARKS**: If the narrator recounts a spoken quote (e.g. "A man tells her she will cook alive inside a metal box by July"), line2 MUST be: "\\"YOU'LL COOK ALIVE BY JULY\\"".
- **DOLLAR AMOUNTS & NUMBERS**: If the narration mentions "$260 a week" or "$850 rent", line1 MUST state the exact number: "NET WEEKLY PAY: $260" or "AVERAGE RENT: $850/MO".
- **WHEN NOT TO ADD A CALLOUT**: If a beat does not contain a concrete number, date, location, official document, or quote, SET "callout": null. Do NOT force callouts onto narrative reflections or transitions. Only ~25–35% of beats should have callouts.
- Approved Callout Types: "newspaper_headline", "editorial_lower_third", "odometer_stat", "redacted_dossier", "police_crime_sheet", "forensic_data_card", "typewriter_paper", "social_tweet_card", "reddit_thread_card", "caution_tape_banner", "fullscreen_chapter_title", "karaoke_captions".
*BANNED CALLOUTS: NEVER USE map_pingeotag, editorial_quote, court_transcript_card, wiretap_intercept, polaroid_snapshot, marker_circle, archival_evidence_tag, split_milestone_card.*
*NUMBER BADGES: Spoken number badge popups are completely disabled. Do not generate number callout triggers.*"""

old_trans_section = """### 8. CINEMATIC SCENE TRANSITIONS:
Choose dynamic documentary cut transitions entering this beat to keep the video visually arresting:
- "shutter_flash": Blinding white camera shutter flash (0.08s) (Best for cutting into newspaper headlines, evidence).
- "film_burn": Warm 35mm light leak flare cut (0.2s) (Best for emotional topic shifts, flashbacks, location transitions).
- "film_dip_black": Smooth cinematic dip/fade from black (0.25s) (Best for chapter openings, heavy solemn moments, dramatic pauses).
- "whip_pan_left" / "whip_pan_right": High-speed horizontal camera swipe blur (0.15s) (Best for moving between subjects, cities).
- "zoom_punch": Rapid snap-zoom scale impact (0.18s) (Best for shocking stats, key accusations).
- "crossfade": Gentle documentary dissolve (0.3s) (Best for scenic drone shots, ambient reflections).
- "cut": Crisp hard cut (The baseline standard)."""

new_trans_section = """### 8. CINEMATIC SCENE TRANSITIONS & WHOOSH SOUND DESIGN:
- Use clean hard cuts ("cut") for baseline narrative continuity (~65–75% of beats).
- Add dynamic transitions every 3 to 5 beats (~25–35% of beats) to keep the rhythm engaging:
  - "whip_pan_left" / "whip_pan_right": Fast horizontal camera swipe blur (0.15s) paired with an airy whoosh (Best for switching locations or moving between subjects).
  - "film_burn": Warm 35mm light leak flare cut (0.2s) paired with a cinematic whoosh (Best for emotional shifts, memory sequences, golden hour).
  - "shutter_flash": Blinding white camera shutter flash (0.08s) paired with a camera shutter click (Best for newspaper headlines, dossiers, photographic evidence).
  - "zoom_punch": Rapid snap-zoom impact (0.18s) paired with a subtle sub-bass hit (Best for shocking stats, eviction notices, critical revelations).
  - "film_dip_black": Smooth cinematic dip/fade from black (0.25s) (Best for chapter openings, heavy solemn moments, dramatic pauses).
  - "crossfade": Gentle documentary dissolve (0.3s) (Best for scenic drone shots, ambient reflections).
  - "cut": Crisp hard cut (The baseline standard)."""

text_norm = text.replace('\r\n', '\n')
old_callout_norm = old_callout_section.replace('\r\n', '\n')
new_callout_norm = new_callout_section.replace('\r\n', '\n')
old_trans_norm = old_trans_section.replace('\r\n', '\n')
new_trans_norm = new_trans_section.replace('\r\n', '\n')

if old_callout_norm in text_norm and old_trans_norm in text_norm:
    text_norm = text_norm.replace(old_callout_norm, new_callout_norm)
    text_norm = text_norm.replace(old_trans_norm, new_trans_norm)
    with open('apps/api/src/services/aiScriptPlanner.ts', 'w', encoding='utf-8') as f:
        f.write(text_norm)
    print('Updated aiScriptPlanner.ts successfully!')
else:
    print('Could not find sections in aiScriptPlanner.ts')
