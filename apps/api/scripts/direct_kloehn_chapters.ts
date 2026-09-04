import { PlannedBeat } from '../src/services/aiScriptPlanner';

/**
 * Hand-crafted AI Director documentary scene beats for Gregory Kloehn Chapters 1–11.
 * Directed by Antigravity with Vice/Vox documentary pacing:
 * - 1.5s – 3.5s baseline snappy cuts (hard cap < 5.0s)
 * - 14 Authentic local RAW videos & photos from Oakland
 * - Dynamic selection across 18 screen layouts & 20 animated callouts
 * - Zero OpenRouter dependency: 100% pure Antigravity architecture
 */
export const DIRECTED_KLOEHN_BEATS: Record<number, PlannedBeat[]> = {
  "1": [
    {
      "beatIndex": 0,
      "chapterIndex": 1,
      "text": "It is a gray morning in West Oakland,",
      "visualSubject": "west_oakland_street_morning_fog",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "WEST OAKLAND, CA",
        "subtitle": "MORNING SHIFT • INDUSTRIAL CORRIDOR"
      },
      "clipFilename": null,
      "stockVideoQuery": "dark empty city street morning mist dawn overcast",
      "backupVideoQuery": "overcast urban street morning fog",
      "negativeKeywords": [
        "sunny beach",
        "tropical",
        "cars racing"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "WEST OAKLAND",
        "line2": "CALIFORNIA",
        "spokenTrigger": "West Oakland",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Atmospheric location hook establishing West Oakland industrial tone."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 1,
      "text": "the kind of low, flat light that makes everything look older than it is.",
      "visualSubject": "moody_overcast_light_urban",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "moody morning clouds gray sky overcast city",
      "backupVideoQuery": "city buildings dawn gloomy weather",
      "negativeKeywords": [
        "blue sky",
        "sunny"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Visual metaphor matching the narration describing flat gray morning light."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 1,
      "text": "Near the Alliance Recycling Center, a stretch of sidewalk",
      "visualSubject": "alliance_recycling_sidewalk",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "ALLIANCE RECYCLING CENTER",
        "subtitle": "SCRAP & BOTTLE REDEMPTION CORRIDOR"
      },
      "clipFilename": null,
      "stockVideoQuery": "recycling plant scrap metal industrial yard",
      "backupVideoQuery": "recycling facility exterior urban",
      "negativeKeywords": [
        "clean modern office",
        "luxury"
      ],
      "callout": {
        "type": "map_pingeotag",
        "line1": "ALLIANCE RECYCLING",
        "line2": "WEST OAKLAND REDEMPTION CENTER",
        "spokenTrigger": "Alliance Recycling",
        "themeColor": "amber"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Establishes geographical center of the neighborhood narrative."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 1,
      "text": "that homeless residents know as well as any street in the city,",
      "visualSubject": "homeless_person_sidewalk",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "homeless person walking sidewalk urban street morning",
      "backupVideoQuery": "poverty urban sidewalk morning pedestrian",
      "negativeKeywords": [
        "happy tourists",
        "shopping mall"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Humanizes the street context and familiar routes of residents."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 1,
      "text": "a woman pushes a shopping cart loaded",
      "visualSubject": "woman_shopping_cart_sidewalk",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "homeless woman pushing shopping cart sidewalk",
      "backupVideoQuery": "elderly woman pushing shopping trolley street",
      "negativeKeywords": [
        "grocery store inside",
        "smiling model"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Hero subject introduction walking towards the recycling scale."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 1,
      "text": "with aluminum cans toward the scale window.",
      "visualSubject": "aluminum_cans_recycling",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "REDEMPTION PROCESS",
        "subtitle": "ALUMINUM CANS & BOTTLE RETURNS"
      },
      "clipFilename": null,
      "stockVideoQuery": "crushed aluminum cans recycling bins sorting",
      "backupVideoQuery": "scrap metal cans recycling center",
      "negativeKeywords": [
        "soda party",
        "picnic"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "$0.05 / CAN",
        "line2": "CALIFORNIA CRV REDEMPTION",
        "spokenTrigger": "aluminum cans",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Contextual detail on the daily economic hustle of scrap collection."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 1,
      "text": "She has done this walk a hundred times.",
      "visualSubject": "worn_shoes_walking_pavement",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "walking feet sidewalk pavement street morning",
      "backupVideoQuery": "urban pedestrian sidewalk morning footsteps",
      "negativeKeywords": [
        "running athletes",
        "sneaker commercial"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "whip_pan_left",
      "reason": "Fast punchy cut showing habitual daily repetition."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 1,
      "text": "What is different today is where she is walking from.",
      "visualSubject": "sidewalk_chain_link_fence",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "STREET VIEW // WEST OAKLAND",
        "subtitle": "SURVEILLANCE PERSPECTIVE"
      },
      "clipFilename": null,
      "stockVideoQuery": "chain link fence sidewalk urban street",
      "backupVideoQuery": "industrial chain link fence wire alleyway",
      "negativeKeywords": [
        "suburban garden",
        "luxury villa"
      ],
      "callout": null,
      "overlay": "vintage_crt_scanlines",
      "transition": "zoom_punch",
      "reason": "Narrative pivot building curiosity for the reveal of her shelter."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 1,
      "text": "A few yards back, parked against a chain-link fence,",
      "visualSubject": "tiny_home_fence_reveal",
      "mediaType": "image",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "colorful small wooden cabin tiny house exterior",
      "backupVideoQuery": "handmade wooden shelter street",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "TINY HOME ON WHEELS",
        "line2": "BUILT FROM FOUND MATERIALS",
        "spokenTrigger": "parked against",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Authentic local photo reveal of the colorful completed tiny house."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 1,
      "text": "sits a small structure on wheels, built almost entirely from the frame of an old bed.",
      "visualSubject": "structure_on_wheels_bedframe",
      "mediaType": "video",
      "layout": "parallax_triptych_gallery",
      "layoutData": {
        "title": "REPURPOSED BED FRAME",
        "subtitle": "PITCHED ROOF & WHEEL SYSTEM"
      },
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "small mobile house on wheels street",
      "backupVideoQuery": "tiny timber shelter rolling cart",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "zoom_punch",
      "reason": "Authentic local video showing recipient demonstrating her mobile home."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 1,
      "text": "A headboard and footboard, once holding up someone's mattress in someone's bedroom,",
      "visualSubject": "wooden_headboard_scrap",
      "mediaType": "video",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "SALVAGED TIMBER",
        "subtitle": "FORMER RESIDENTIAL BEDROOM FURNITURE"
      },
      "clipFilename": null,
      "stockVideoQuery": "wooden headboard discarded street furniture curb",
      "backupVideoQuery": "old wooden furniture scrap pile wood",
      "negativeKeywords": [
        "ikea store interior",
        "new furniture"
      ],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "EVIDENCE // SALVAGED",
        "line2": "WOODEN BED HEADBOARD",
        "spokenTrigger": "headboard and footboard",
        "themeColor": "amber"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Detailing the raw scavenged materials that make up the walls."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 1,
      "text": "now form the peaked roof of someone's front door.",
      "visualSubject": "pitched_roof_tiny_home",
      "mediaType": "image",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "wooden pitched roof handmade cabin framing",
      "backupVideoQuery": "salvaged wood roof shingles exterior",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "whip_pan_right",
      "reason": "Hero beauty shot of the pitched headboard roofline."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 1,
      "text": "She calls it home, and she has for three weeks now.",
      "visualSubject": "inside_lived_in_home",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "A person home inside which has full stuff .mp4",
      "stockVideoQuery": "inside cozy small room neat mattress shelf",
      "backupVideoQuery": "tiny living space interior organized",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "SWEET PEA // RESIDENT",
        "line2": "3 WEEKS OFF THE STREET",
        "spokenTrigger": "calls it home",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_dip_black",
      "reason": "Authentic local footage showing the warm, lived-in interior."
    },
    {
      "beatIndex": 13,
      "chapterIndex": 1,
      "text": "Inside is a mattress, a shelf, a few belongings,",
      "visualSubject": "interior_shelf_belongings",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "INTERIOR LIVING QUARTERS",
        "subtitle": "MATTRESS, SHELF, STORAGE COMPARTMENT"
      },
      "clipFilename": "inside the dumpster home.jpg",
      "stockVideoQuery": "organized shelf small wooden room interior",
      "backupVideoQuery": "modest bedroom storage shelf daylight",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Detailed look at the interior arrangement and storage."
    },
    {
      "beatIndex": 14,
      "chapterIndex": 1,
      "text": "arranged with more care than a stranger might expect.",
      "visualSubject": "arranged_belongings_personal_care",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "A person home inside which has full stuff .mp4",
      "stockVideoQuery": "hands arranging personal items shelf interior",
      "backupVideoQuery": "neatly arranged clothes room daylight",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Emotional beat emphasizing dignity and care inside the small footprint."
    },
    {
      "beatIndex": 15,
      "chapterIndex": 1,
      "text": "Outside, painted in mismatched colors because the paint itself was scavenged,",
      "visualSubject": "mismatched_exterior_paint",
      "mediaType": "image",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "SCAVENGED COATINGS",
        "subtitle": "DONATED & FOUND PAINT CANS"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "colorful paint cans paintbrush dipping painting wall",
      "backupVideoQuery": "worker painting exterior wall brush roller",
      "negativeKeywords": [
        "art gallery modern"
      ],
      "callout": {
        "type": "marker_circle",
        "line1": "WATERPROOF COATING",
        "line2": "MULTIPLE SURPLUS PAINT LAYERS",
        "spokenTrigger": "paint itself",
        "themeColor": "cyan"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Visual split highlighting how found paint waterproofs the structure."
    },
    {
      "beatIndex": 16,
      "chapterIndex": 1,
      "text": "is a house that cost its builder almost nothing",
      "visualSubject": "hardware_screws_cost",
      "mediaType": "video",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "TOTAL BUILD COST",
        "subtitle": "SCREWS, HARDWARE & RECYCLED SCRAP"
      },
      "clipFilename": null,
      "stockVideoQuery": "box of construction screws hardware store screws",
      "backupVideoQuery": "carpenter driving screw into wood drill",
      "negativeKeywords": [
        "luxury house",
        "mansion"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "$30 - $40 TOTAL",
        "line2": "FOUND MATERIALS ONLY",
        "spokenTrigger": "almost nothing",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Stat centerpiece callout emphasizing the staggering $40 build cost."
    },
    {
      "beatIndex": 17,
      "chapterIndex": 1,
      "text": "and gave her something she has not had in longer than she can say.",
      "visualSubject": "person_peaceful_contemplation",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "woman looking out window contemplative quiet mood",
      "backupVideoQuery": "person inside room soft natural light face",
      "negativeKeywords": [
        "party",
        "office meeting"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Contemplative emotional pacing beat."
    },
    {
      "beatIndex": 18,
      "chapterIndex": 1,
      "text": "A door she can close.",
      "visualSubject": "locking_wooden_door",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE ESSENCE OF SHELTER",
        "subtitle": "SAFETY, AUTONOMY, PRIVACY"
      },
      "clipFilename": null,
      "stockVideoQuery": "closing wooden door latch lock turning deadbolt",
      "backupVideoQuery": "hand closing door deadbolt key turning",
      "negativeKeywords": [
        "bank vault",
        "car door"
      ],
      "callout": {
        "type": "editorial_quote",
        "line1": "A DOOR SHE CAN CLOSE.",
        "line2": "PRIVACY IN A PUBLIC WORLD",
        "spokenTrigger": "door she can close",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_dip_black",
      "reason": "Climax quote callout delivering the core thesis of the documentary."
    },
    {
      "beatIndex": 19,
      "chapterIndex": 1,
      "text": "The man who built it is a few blocks away in a studio that smells like sawdust and rust,",
      "visualSubject": "kloehn_studio_tools_sawdust",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Glimpse of Kloehn buulding home.mp4",
      "stockVideoQuery": "kloehn studio tools sawdust urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic local footage shifting focus to builder Gregory Kloehn in his shop."
    },
    {
      "beatIndex": 20,
      "chapterIndex": 1,
      "text": "and he will tell you, if you ask, that this was never supposed to be the plan.",
      "visualSubject": "gregory_kloehn_portrait",
      "mediaType": "image",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "GREGORY KLOEHN",
        "subtitle": "FOUND-OBJECT SCULPTOR & ARTIST"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "gregory kloehn portrait urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "GREGORY KLOEHN",
        "line2": "SCULPTOR & BUILDER // OAKLAND, CA",
        "spokenTrigger": "supposed to be the plan",
        "themeColor": "gold"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Clear hero portrait introducing the protagonist Gregory Kloehn."
    },
    {
      "beatIndex": 21,
      "chapterIndex": 1,
      "text": "He did not train for this. He did not study social work",
      "visualSubject": "city_hall_municipal_building",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "city hall architecture columns municipal building exterior",
      "backupVideoQuery": "courthouse government building steps exterior",
      "negativeKeywords": [
        "beach",
        "party"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Contrast shot highlighting the institutional systems he sidesteps."
    },
    {
      "beatIndex": 22,
      "chapterIndex": 1,
      "text": "or urban policy or anything resembling the systems",
      "visualSubject": "urban_policy_blueprints",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "INSTITUTIONAL POLICY",
        "subtitle": "BUREAUCRATIC HOUSING PROTOCOLS"
      },
      "clipFilename": null,
      "stockVideoQuery": "urban planning blueprint map architectural office",
      "backupVideoQuery": "architect table blueprints drafting office",
      "negativeKeywords": [
        "construction site dirty"
      ],
      "callout": {
        "type": "redacted_dossier",
        "line1": "URBAN POLICY",
        "line2": "INSTITUTIONAL HOUSING PROTOCOLS",
        "spokenTrigger": "urban policy",
        "themeColor": "slate"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Visual document critique of traditional municipal policy."
    },
    {
      "beatIndex": 23,
      "chapterIndex": 1,
      "text": "that are supposed to handle a problem this size.",
      "visualSubject": "homeless_encampment_scale",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "large homeless tent encampment highway underpass urban",
      "backupVideoQuery": "tents under bridge urban city poverty",
      "negativeKeywords": [
        "leisure camping",
        "luxury"
      ],
      "callout": {
        "type": "stat_callout",
        "line1": "CRISIS SCALE",
        "line2": "THOUSANDS UNSHELTERED IN BAY AREA",
        "spokenTrigger": "problem this size",
        "themeColor": "crimson"
      },
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Establishing the overwhelming magnitude of the housing shortage."
    },
    {
      "beatIndex": 24,
      "chapterIndex": 1,
      "text": "He is a sculptor.",
      "visualSubject": "sculptor_artist_identity",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE SCULPTOR",
        "subtitle": "FORM, SPACE & UNCONVENTIONAL UTILITY"
      },
      "clipFilename": "Kloehn sittiing in the home he made.jpg",
      "stockVideoQuery": "sculptor artist identity urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "GREGORY KLOEHN",
        "line2": "FOUND-MATERIAL SCULPTOR",
        "spokenTrigger": "He is a sculptor",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Hero portrait of Gregory sitting inside his hand-built home."
    },
    {
      "beatIndex": 25,
      "chapterIndex": 1,
      "text": "And the strange thing about this story is that almost nothing about it required him to stop being one.",
      "visualSubject": "kloehn_demonstrating_creative_design",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn demostrating the home he made by shoing everything what it is like .mp4",
      "stockVideoQuery": "kloehn demonstrating creative design urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic local video showing Kloehn touring his sculpture-turned-home."
    }
  ],
  "2": [
    {
      "beatIndex": 0,
      "chapterIndex": 2,
      "text": "Gregory Kloehn came to homelessness sideways,",
      "visualSubject": "gregory_kloehn_hero_portrait",
      "mediaType": "image",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "GREGORY KLOEHN",
        "subtitle": "FOUND-OBJECT ARTIST & BUILDER"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "gregory kloehn hero portrait urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "GREGORY KLOEHN",
        "line2": "FOUND-MATERIAL SCULPTOR",
        "spokenTrigger": "Gregory Kloehn",
        "themeColor": "gold"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Clear portrait introduction of protagonist Gregory Kloehn."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 2,
      "text": "the way most people who end up doing something unusual do.",
      "visualSubject": "artist_hands_working_studio",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "artist hands working studio sculpture clay metal",
      "backupVideoQuery": "craftsman hands welding metal workshop",
      "negativeKeywords": [
        "office worker typing",
        "fashion show"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Cinematic close-up of artisan hands in creative studio flow."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 2,
      "text": "He was not a caseworker. He was not an architect with a mission statement pinned above his desk.",
      "visualSubject": "corporate_office_desk_blueprints",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "INSTITUTIONAL CASEWORK",
        "subtitle": "NOT BOUND BY TRADITIONAL BUREAUCRACY"
      },
      "clipFilename": null,
      "stockVideoQuery": "office desk computer paperwork social worker",
      "backupVideoQuery": "architect blueprints office desk",
      "negativeKeywords": [
        "artist workshop",
        "dirty hands"
      ],
      "callout": {
        "type": "redacted_dossier",
        "line1": "NOT A CASEWORKER",
        "line2": "INDEPENDENT GRASSROOTS ARTIST",
        "spokenTrigger": "not a caseworker",
        "themeColor": "slate"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Visual contrast showing the institutional world he does not belong to."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 2,
      "text": "For years, his work had been about taking things other people had thrown away—",
      "visualSubject": "urban_scrapyard_discarded_materials",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "FOUND MATERIALS",
        "subtitle": "URBAN SCRAP & DISCARDED TIMBER"
      },
      "clipFilename": null,
      "stockVideoQuery": "scrap metal scrapyard junk piled up",
      "backupVideoQuery": "pile of discarded wood furniture alley",
      "negativeKeywords": [
        "clean showroom",
        "shopping mall"
      ],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "SOURCE // FOUND MATERIAL",
        "line2": "DISCARDED URBAN SURPLUS",
        "spokenTrigger": "thrown away",
        "themeColor": "amber"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Establishing his artistic practice centered on scavenging found objects."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 2,
      "text": "scrap wood, broken furniture, whatever a job site or a curb had left behind—",
      "visualSubject": "curbside_discarded_furniture",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "broken wooden chairs curb trash day street",
      "backupVideoQuery": "construction dumpster debris timber scrap",
      "negativeKeywords": [
        "clean furniture store",
        "luxury living room"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "whip_pan_left",
      "reason": "Fast punchy cuts of discarded curbside items in American cities."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 2,
      "text": "and turning them into something worth looking at.",
      "visualSubject": "sculpture_art_piece_studio",
      "mediaType": "video",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "TRANSFORMATION",
        "subtitle": "DISCARDED JUNK BECOMING ART"
      },
      "clipFilename": null,
      "stockVideoQuery": "modern metal sculpture gallery studio artist",
      "backupVideoQuery": "reclaimed wood art piece craftsmanship",
      "negativeKeywords": [
        "ugly garbage dump"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Hero graphic showcasing the artistic transmutation of waste."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 2,
      "text": "That is what a sculptor does with found material. Look. Rearrange. Reveal.",
      "visualSubject": "kloehn_framing_wood_structure",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "SCULPTOR PHILOSOPHY",
        "subtitle": "LOOK • REARRANGE • REVEAL"
      },
      "clipFilename": "Kloehn  building the home.jpg",
      "stockVideoQuery": "kloehn framing wood structure urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "LOOK. REARRANGE. REVEAL.",
        "line2": "THE FOUND-OBJECT ETHOS",
        "spokenTrigger": "Look. Rearrange",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic local photo of Gregory actively rearranging materials on a build."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 2,
      "text": "In his own telling, he had done traditional construction, too—big projects and small ones—",
      "visualSubject": "construction_framing_timber_house",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "construction site worker framing house wood studs",
      "backupVideoQuery": "carpenter measuring lumber framing square",
      "negativeKeywords": [
        "beach",
        "shopping"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Establishing his technical construction and carpentry pedigree."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 2,
      "text": "and had always gravitated toward small houses and unusual shapes,",
      "visualSubject": "compact_architectural_cabin",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "small modern tiny house wooden cabin exterior",
      "backupVideoQuery": "compact architectural cabin woods exterior",
      "negativeKeywords": [
        "mansion",
        "skyscraper"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Exploring his lifelong fascination with compact living structures."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 2,
      "text": "the puzzle of how little space a person actually needs to feel like they have somewhere.",
      "visualSubject": "compact_van_tiny_interior",
      "mediaType": "video",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "MINIMAL SPACE",
        "subtitle": "THE PSYCHOLOGY OF SHELTER"
      },
      "clipFilename": null,
      "stockVideoQuery": "small cozy camper van interior bed tiny living",
      "backupVideoQuery": "tiny house compact bedroom interior warm light",
      "negativeKeywords": [
        "hotel penthouse",
        "spacious living room"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "42 SQ FT",
        "line2": "COMPACT LIVING FOOTPRINT",
        "spokenTrigger": "how little space",
        "themeColor": "emerald"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Stat callout highlighting the minimal footprint required for human dignity."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 2,
      "text": "That curiosity led him to shipping containers,",
      "visualSubject": "shipping_containers_port_oakland",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "cargo shipping containers stacked port industrial harbor",
      "backupVideoQuery": "colorful shipping containers train yard",
      "negativeKeywords": [
        "empty beach"
      ],
      "callout": {
        "type": "map_pingeotag",
        "line1": "PORT OF OAKLAND",
        "line2": "CARGO CONTAINER CORRIDOR",
        "spokenTrigger": "shipping containers",
        "themeColor": "cyan"
      },
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Geographic map callout connecting to Oakland's shipping container yards."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 2,
      "text": "drawn to the idea that a shape built for one purpose—hauling cargo across an ocean—",
      "visualSubject": "container_ship_ocean_aerial",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "INTERMODAL LOGISTICS",
        "subtitle": "STANDARDIZED FREIGHT CARGO"
      },
      "clipFilename": null,
      "stockVideoQuery": "container cargo ship moving ocean aerial",
      "backupVideoQuery": "large container ship sea sunset",
      "negativeKeywords": [
        "cruise ship party"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "cut",
      "reason": "Dramatic aerial footage contrasting global logistics with individual human scale."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 2,
      "text": "could be reassigned to another purpose entirely, holding a bed, a window, a life.",
      "visualSubject": "container_converted_into_bedroom",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "CARGO TO HABITATION",
        "subtitle": "REASSIGNING INDUSTRIAL STEEL"
      },
      "clipFilename": null,
      "stockVideoQuery": "modern shipping container home interior window bed",
      "backupVideoQuery": "shipping container converted tiny house",
      "negativeKeywords": [
        "dirty warehouse interior"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Inspiring visual demonstrating the reinterpretation of industrial containers."
    },
    {
      "beatIndex": 13,
      "chapterIndex": 2,
      "text": "That fascination with unlikely shapes did not stop at containers.",
      "visualSubject": "industrial_salvage_steel_yard",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "industrial scrap metal warehouse artist workspace",
      "backupVideoQuery": "salvage yard industrial parts architecture",
      "negativeKeywords": [
        "pristine modern office"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "whip_pan_right",
      "reason": "Fast transition showing the continuing artistic search for unlikely enclosures."
    },
    {
      "beatIndex": 14,
      "chapterIndex": 2,
      "text": "He kept looking at other shapes he might build a home out of,",
      "visualSubject": "commercial_city_alleyway_bins",
      "mediaType": "video",
      "layout": "parallax_triptych_gallery",
      "layoutData": {
        "title": "URBAN INVESTIGATION",
        "subtitle": "POTENTIAL ARCHITECTURAL SHELLS"
      },
      "clipFilename": null,
      "stockVideoQuery": "commercial city street dumpster alleyway",
      "backupVideoQuery": "industrial green waste bin outdoor curb",
      "negativeKeywords": [
        "park trees flowers"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "zoom_punch",
      "reason": "Triptych layout analyzing various urban street objects."
    },
    {
      "beatIndex": 15,
      "chapterIndex": 2,
      "text": "and it was somewhere in that search that a shape most people only ever associate with garbage caught his attention—",
      "visualSubject": "large_commercial_dumpster_curb",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "THE MUNICIPAL DUMPSTER",
        "subtitle": "HEAVY-GAUGE CORRUGATED STEEL"
      },
      "clipFilename": null,
      "stockVideoQuery": "commercial dumpster alleyway city garbage",
      "backupVideoQuery": "large steel dumpster urban street curb",
      "negativeKeywords": [
        "flower garden"
      ],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "OBJECT // DUMPSTER",
        "line2": "STRUCTURALLY SOUND • WEATHERPROOF",
        "spokenTrigger": "associate with garbage",
        "themeColor": "amber"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Archival evidence callout introducing the famous dumpster home concept."
    },
    {
      "beatIndex": 16,
      "chapterIndex": 2,
      "text": "a dumpster, structurally sound, weatherproof,",
      "visualSubject": "blueprint_dumpster_home",
      "mediaType": "image",
      "layout": "forensic_drafting_table",
      "layoutData": {
        "title": "DUMPSTER CONVERSION BLUEPRINT",
        "subtitle": "ROOF SKYLIGHT • FOLD-OUT BED • KITCHENETTE"
      },
      "clipFilename": "Plan , blueprint of dumpster home.jpg",
      "stockVideoQuery": "blueprint dumpster home urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "marker_circle",
        "line1": "STRUCTURAL SHELL",
        "line2": "WEATHERPROOF HEAVY-GAUGE STEEL",
        "spokenTrigger": "structurally sound",
        "themeColor": "cyan"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Authentic local blueprint artifact showing Gregory's engineering sketches."
    },
    {
      "beatIndex": 17,
      "chapterIndex": 2,
      "text": "sitting outside job sites and grocery stores all over the city,",
      "visualSubject": "commercial_alley_dumpster_row",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "back alley commercial grocery store loading dock dumpsters",
      "backupVideoQuery": "construction site dumpster street corner",
      "negativeKeywords": [
        "sunny park"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Establishing the ubiquity of steel dumpsters across every American city."
    },
    {
      "beatIndex": 18,
      "chapterIndex": 2,
      "text": "mostly ignored, mostly empty, mostly waiting to be hauled off to a scrapyard once it got too dented to be useful.",
      "visualSubject": "flatbed_truck_transporting_scrap",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "garbage truck lifting dumpster emptying morning",
      "backupVideoQuery": "flatbed truck carrying steel scrap industrial",
      "negativeKeywords": [
        "car commercial"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Showing the disposal cycle of dented industrial containers."
    },
    {
      "beatIndex": 19,
      "chapterIndex": 2,
      "text": "He looked at one and saw something nobody else driving past it had bothered to see—",
      "visualSubject": "inside_dumpster_home_kitchen",
      "mediaType": "image",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "EXTERIOR TO INTERIOR",
        "subtitle": "TRASH CONTAINER TO FUNCTIONAL DWELLING"
      },
      "clipFilename": "inside the dumpster home.jpg",
      "stockVideoQuery": "inside dumpster home kitchen urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic local photo revealing the retrofitted interior inside a dumpster."
    },
    {
      "beatIndex": 20,
      "chapterIndex": 2,
      "text": "a house that was already halfway built.",
      "visualSubject": "dumpster_home_interior_suite",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE DUMPSTER HOME",
        "subtitle": "STOVE • SINK • RETRACTABLE BED"
      },
      "clipFilename": "inside the dumpster home.jpg",
      "stockVideoQuery": "dumpster home interior suite urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "A HOUSE HALFWAY BUILT.",
        "line2": "FOUND-STRUCTURE ARCHITECTURE",
        "spokenTrigger": "halfway built",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Editorial quote callout highlighting the core realization."
    },
    {
      "beatIndex": 21,
      "chapterIndex": 2,
      "text": "But the real turn in this story did not come from a dumpster.",
      "visualSubject": "kloehn_demonstrating_home_interior",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn demostrating the home he made by shoing everything what it is like .mp4",
      "stockVideoQuery": "kloehn demonstrating home interior urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic local video showing Kloehn touring through his build."
    },
    {
      "beatIndex": 22,
      "chapterIndex": 2,
      "text": "It came from paying closer attention to the people already living around them.",
      "visualSubject": "homeless_person_sidewalk_sunset",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "homeless person sidewalk sunset city street contemplative",
      "backupVideoQuery": "person sitting sidewalk urban city evening",
      "negativeKeywords": [
        "busy shoppers",
        "happy party"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "TURNING POINT",
        "line2": "OBSERVING STREET SHELTER BUILDERS",
        "spokenTrigger": "living around them",
        "themeColor": "amber"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_dip_black",
      "reason": "Pivotal concluding beat pointing toward the human street builders in Chapter 3."
    }
  ],
  "3": [
    {
      "beatIndex": 0,
      "chapterIndex": 3,
      "text": "Driving to his studio, the same route day after day,",
      "visualSubject": "driving_car_dashboard_urban_morning",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "driving car POV city street morning dashboard windshield",
      "backupVideoQuery": "driver view urban road morning commute",
      "negativeKeywords": [
        "rural countryside",
        "race track"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "DAILY COMMUTE",
        "line2": "WEST OAKLAND INDUSTRIAL CORRIDOR",
        "spokenTrigger": "same route day after day",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Commute POV establishing habitual visual routine."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 3,
      "text": "Kloehn kept passing the same underpasses, the same stretches of sidewalk,",
      "visualSubject": "highway_underpass_concrete_pillars",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "FREEWAY UNDERPASS",
        "subtitle": "INTERSTATE 880 CORRIDOR • OAKLAND"
      },
      "clipFilename": null,
      "stockVideoQuery": "highway overpass concrete pillars underpass road",
      "backupVideoQuery": "freeway bridge concrete pillars city street",
      "negativeKeywords": [
        "beach",
        "sunny mountains"
      ],
      "callout": {
        "type": "map_pingeotag",
        "line1": "I-880 OVERPASS",
        "line2": "WEST OAKLAND SIDEWALKS",
        "spokenTrigger": "same underpasses",
        "themeColor": "amber"
      },
      "overlay": "cinematic_vignette",
      "transition": "cut",
      "reason": "Visualizing the brutalist highway pillars where tents cluster."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 3,
      "text": "the same small structures that homeless residents had assembled for themselves,",
      "visualSubject": "improvised_street_shelters_tarps",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "homeless makeshift shelter tarps pallets sidewalk",
      "backupVideoQuery": "urban encampment tents pallets street",
      "negativeKeywords": [
        "camping forest",
        "leisure"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Showing the vernacular, self-built structures of the unsheltered."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 3,
      "text": "out of tarps and pallets, and whatever the street happened to provide that week.",
      "visualSubject": "wooden_pallets_blue_tarp_scrap",
      "mediaType": "video",
      "layout": "parallax_triptych_gallery",
      "layoutData": {
        "title": "VERNACULAR MATERIALS",
        "subtitle": "WOODEN PALLETS • BLUE TARPS • CARDBOARD"
      },
      "clipFilename": null,
      "stockVideoQuery": "wooden pallets stacked alley street scrap",
      "backupVideoQuery": "blue tarp tied with rope urban street",
      "negativeKeywords": [
        "clean warehouse new pallets"
      ],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "VERNACULAR ARCHITECTURE",
        "line2": "SCAVENGED PALLETS & TARPS",
        "spokenTrigger": "tarps and pallets",
        "themeColor": "slate"
      },
      "overlay": "archival_halftone_paper",
      "transition": "zoom_punch",
      "reason": "Triptych detailing the raw textures of street architecture."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 3,
      "text": "Most commuters train themselves not to really look at those structures.",
      "visualSubject": "car_windows_driving_past_blur",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE COMMUTER GAZE",
        "subtitle": "TURNING A BLIND EYE TO URBAN HARDSHIP"
      },
      "clipFilename": null,
      "stockVideoQuery": "car window traffic driving past blurred city street",
      "backupVideoQuery": "commuter traffic cars driving street evening",
      "negativeKeywords": [
        "pedestrian smiling"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Psychological observation on how urban drivers tune out homelessness."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 3,
      "text": "They register as a blur of hardship, something to feel briefly bad about and then drive past.",
      "visualSubject": "traffic_taillights_city_blur",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "traffic taillights city night rainy asphalt blur",
      "backupVideoQuery": "city traffic rain bokeh evening car lights",
      "negativeKeywords": [
        "daytime beach"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Cinematic moody blur reflecting brief, passing guilt."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 3,
      "text": "Kloehn started looking longer.",
      "visualSubject": "kloehn_observing_thoughtful",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE SCULPTOR'S EYE",
        "subtitle": "LOOKING BEYOND THE SURFACE"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "kloehn observing thoughtful urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "LOOKING LONGER.",
        "line2": "OBSERVING AS A BUILDER",
        "spokenTrigger": "looking longer",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Hero portrait highlighting the shift in perspective."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 3,
      "text": "The turning point, in his own words, was almost embarrassingly small.",
      "visualSubject": "smartphone_screen_camera",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "TURNING POINT // 2012",
        "subtitle": "FIRST SMARTPHONE WITH CAMERA"
      },
      "clipFilename": null,
      "stockVideoQuery": "hand holding smartphone taking photo street",
      "backupVideoQuery": "smartphone camera screen taking picture city",
      "negativeKeywords": [
        "playing video game"
      ],
      "callout": null,
      "overlay": "vintage_crt_scanlines",
      "transition": "zoom_punch",
      "reason": "Introducing the humble tool that catalyzed the entire project."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 3,
      "text": "He got a smartphone, and with it, for the first time, a camera he carried everywhere.",
      "visualSubject": "camera_taking_photo_street",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "MOBILE PHOTOGRAPHY",
        "subtitle": "DOCUMENTING STREET SHELTERS"
      },
      "clipFilename": null,
      "stockVideoQuery": "person taking photo with mobile phone urban wall",
      "backupVideoQuery": "photographer with camera street urban",
      "negativeKeywords": [
        "selfie smiling teen"
      ],
      "callout": {
        "type": "polaroid_snapshot",
        "line1": "CAMERA IN POCKET",
        "line2": "DAILY VISUAL FIELD NOTES",
        "spokenTrigger": "camera he carried",
        "themeColor": "cyan"
      },
      "overlay": "camera_viewfinder_hud",
      "transition": "shutter_flash",
      "reason": "Viewfinder HUD overlay demonstrating intentional street documentation."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 3,
      "text": "Suddenly he had a way to document what he had been driving past for years,",
      "visualSubject": "archival_shelter_photos",
      "mediaType": "image",
      "layout": "polaroid_scatter_desk",
      "layoutData": {
        "title": "PHOTO CATALOG",
        "subtitle": "DOCUMENTING STREET ARCHITECTURE"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "archival shelter photos urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Polaroid scatter desk displaying field research documentation."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 3,
      "text": "the little shelters homeless residents around him had built for themselves.",
      "visualSubject": "makeshift_urban_dwellings",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "makeshift shelter tarp pallets urban city sidewalk",
      "backupVideoQuery": "homeless encampment structures street morning",
      "negativeKeywords": [
        "luxury glamping"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Documentary footage of inventive self-built street shelters."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 3,
      "text": "Walking those blocks with a camera changed how he talked about the people living in them.",
      "visualSubject": "photographer_walking_urban_sidewalk",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "FIELDWORK",
        "subtitle": "ENGAGING WITH RESIDENTS DIRECTLY"
      },
      "clipFilename": null,
      "stockVideoQuery": "photographer walking urban alley morning light camera",
      "backupVideoQuery": "person walking down city sidewalk slow motion",
      "negativeKeywords": [
        "running workout"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Depicting respectful street engagement and fieldwork."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 3,
      "text": "Looking back at the photos, he has described feeling almost enamored of what he was seeing,",
      "visualSubject": "examining_printed_photographs",
      "mediaType": "video",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "ARTISTIC ADMIRATION",
        "subtitle": "RECOGNIZING UNTRAINED CREATIVITY"
      },
      "clipFilename": null,
      "stockVideoQuery": "hands flipping through printed photographs desk",
      "backupVideoQuery": "artist inspecting prints on table light",
      "negativeKeywords": [
        "computer screen zoom"
      ],
      "callout": {
        "type": "editorial_quote",
        "line1": "INGENUITY ON THE STREET",
        "line2": "SCULPTURE AS SURVIVAL",
        "spokenTrigger": "enamored of what he was seeing",
        "themeColor": "gold"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Recognizing sculpture, craftsmanship, and problem solving on the streets."
    },
    {
      "beatIndex": 13,
      "chapterIndex": 3,
      "text": "proof that the people he was photographing had not simply gone without shelter,",
      "visualSubject": "close_up_rope_knots_tarps",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "rope tied to fence holding plastic tarp detail",
      "backupVideoQuery": "fastened straps construction tie down",
      "negativeKeywords": [
        "boat sailing"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Close-up craftsmanship detail: ropes, knots, and weatherproofing."
    },
    {
      "beatIndex": 14,
      "chapterIndex": 3,
      "text": "they had built themselves shelter, out of whatever the street provided.",
      "visualSubject": "innovative_makeshift_dwelling",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "ingenious makeshift tiny shelter urban street corner",
      "backupVideoQuery": "improvised small wooden structure street",
      "negativeKeywords": [
        "standard camping tent"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "zoom_punch",
      "reason": "Highlighting creative resourcefulness born of immediate necessity."
    },
    {
      "beatIndex": 15,
      "chapterIndex": 3,
      "text": "He began working on a self-published book about the shelters he was documenting,",
      "visualSubject": "book_mockup_homeless_architecture",
      "mediaType": "video",
      "layout": "open_case_binder",
      "layoutData": {
        "title": "SELF-PUBLISHED MONOGRAPH",
        "subtitle": "HOMELESS ARCHITECTURE: FOUND SCULPTURE"
      },
      "clipFilename": null,
      "stockVideoQuery": "turning pages of hardcover art book desk",
      "backupVideoQuery": "art monograph catalog book pages flipping",
      "negativeKeywords": [
        "novel reading"
      ],
      "callout": {
        "type": "newspaper_headline",
        "line1": "HOMELESS ARCHITECTURE",
        "line2": "A PHOTOGRAPHIC CATALOG BY GREGORY KLOEHN",
        "spokenTrigger": "self-published book",
        "themeColor": "gold"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Displaying his published book documenting homeless architecture."
    },
    {
      "beatIndex": 16,
      "chapterIndex": 3,
      "text": "cataloging them with the same eye he might have used cataloging a movement in contemporary sculpture.",
      "visualSubject": "art_gallery_exhibition_sculpture",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "CONTEMPORARY SCULPTURE",
        "subtitle": "STREET STRUCTURES AS ARTISTIC MOVEMENTS"
      },
      "stockVideoQuery": "contemporary art gallery exhibition sculptures white walls",
      "backupVideoQuery": "modern art museum interior sculpture visitors",
      "negativeKeywords": [
        "classical painting"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Duality between high-end gallery sculpture and vernacular street builds."
    },
    {
      "beatIndex": 17,
      "chapterIndex": 3,
      "text": "Different builders, different materials, a shared and largely invisible skill set nobody was giving them credit for.",
      "visualSubject": "hands_working_tools_hammer",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Glimpse of Kloehn buulding home.mp4",
      "stockVideoQuery": "hands working tools hammer urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic local video showing tactile hands-on building techniques."
    },
    {
      "beatIndex": 18,
      "chapterIndex": 3,
      "text": "Somewhere in the process of documenting other people's ingenuity, he decided to test his own.",
      "visualSubject": "kloehn_measuring_wood_planning",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "kloehn measuring wood planning urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "THE EXPERIMENT",
        "line2": "TESTING FOUND-MATERIAL CONSTRAINTS",
        "spokenTrigger": "test his own",
        "themeColor": "amber"
      },
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic local video showing Kloehn launching into his first experimental build."
    },
    {
      "beatIndex": 19,
      "chapterIndex": 3,
      "text": "Could he build a livable structure entirely from found material, spending as close to zero dollars as possible?",
      "visualSubject": "scavenged_lumber_pile_workshop",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE DESIGN CONSTRAINT",
        "subtitle": "100% FOUND MATERIAL • $0 BUDGET CEILING"
      },
      "clipFilename": "Kloehn  building the home.jpg",
      "stockVideoQuery": "scavenged lumber pile workshop urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "odometer_stat",
        "line1": "$0.00 TARGET",
        "line2": "ZERO DOLLAR BUDGET",
        "spokenTrigger": "zero dollars as possible",
        "themeColor": "emerald"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Hero graphic framing the radical zero-dollar design challenge."
    },
    {
      "beatIndex": 20,
      "chapterIndex": 3,
      "text": "Not a sketch, not a proposal, an actual sleepable structure,",
      "visualSubject": "kloehn_framing_actual_house",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "kloehn framing actual house urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Authentic footage showing physical sawdust and timber work rather than theoretical proposals."
    },
    {
      "beatIndex": 21,
      "chapterIndex": 3,
      "text": "built the same way the people he had been photographing built theirs.",
      "visualSubject": "street_material_repurposing",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "EMULATING STREET CRAFT",
        "subtitle": "WORKING WITHOUT BLUEPRINTS"
      },
      "clipFilename": "Kloehn adjusting the home.jpg",
      "stockVideoQuery": "street material repurposing urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic local photo of Gregory fine-tuning the structure."
    },
    {
      "beatIndex": 22,
      "chapterIndex": 3,
      "text": "He gathered what he could and built a small home for himself over the course of a weekend, just to see if it could be done.",
      "visualSubject": "weekend_construction_timelapse",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "weekend construction timelapse urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "48-HOUR TIMEFRAME",
        "line2": "FRIDAY SUNSET TO SUNDAY NIGHT",
        "spokenTrigger": "course of a weekend",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "whip_pan_left",
      "reason": "High energy authentic footage showing rapid weekend construction."
    },
    {
      "beatIndex": 23,
      "chapterIndex": 3,
      "text": "When he added up the cost afterward, the entire structure had come to around $40.",
      "visualSubject": "forty_dollar_receipt_breakdown",
      "mediaType": "image",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "FINAL EXPENSE AUDIT",
        "subtitle": "HARDWARE & LOCAL TRUCK FUEL"
      },
      "clipFilename": "Kloehn sittiing in the home he made.jpg",
      "stockVideoQuery": "forty dollar receipt breakdown urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "odometer_stat",
        "line1": "$40 TOTAL",
        "line2": "SCREWS & FUEL ONLY",
        "spokenTrigger": "come to around $40",
        "themeColor": "emerald"
      },
      "overlay": "archival_halftone_paper",
      "transition": "zoom_punch",
      "reason": "Auditing the legendary $40 total expenditure."
    },
    {
      "beatIndex": 24,
      "chapterIndex": 3,
      "text": "Screws, mostly. A little gas for the truck.",
      "visualSubject": "box_of_screws_drill_bit",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "box of construction screws wood screws hardware",
      "backupVideoQuery": "hand holding cordless drill driving screw into wood",
      "negativeKeywords": [
        "expensive luxury furniture"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Snappy cut showing the only line item that cost real currency."
    },
    {
      "beatIndex": 25,
      "chapterIndex": 3,
      "text": "Everything else, the wood, the panels, the hardware, had been free,",
      "visualSubject": "salvaged_plywood_and_panels",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "SALVAGED COMPONENTS",
        "subtitle": "PLYWOOD • PALLETS • HARDWARE • CASTER WHEELS"
      },
      "clipFilename": null,
      "stockVideoQuery": "stacked plywood boards construction site recycling",
      "backupVideoQuery": "salvaged wooden doors panels woodpile",
      "negativeKeywords": [
        "new factory lumber"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Inventory of free zero-cost urban materials."
    },
    {
      "beatIndex": 26,
      "chapterIndex": 3,
      "text": "because everything else had been garbage to somebody else first.",
      "visualSubject": "construction_dumpster_scrap_heap",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "garbage dump landfill waste pile discarded items",
      "backupVideoQuery": "demolition debris scrap pile excavator",
      "negativeKeywords": [
        "clean nature"
      ],
      "callout": {
        "type": "editorial_quote",
        "line1": "GARBAGE TO SOMEBODY ELSE FIRST.",
        "line2": "URBAN METABOLISM & SURPLUS",
        "spokenTrigger": "garbage to somebody else first",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Core documentary thematic quote on waste vs resource."
    },
    {
      "beatIndex": 27,
      "chapterIndex": 3,
      "text": "That first build was the hinge point of the whole project.",
      "visualSubject": "completed_first_tiny_home_reveal",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE PROTOTYPE",
        "subtitle": "THE HINGE POINT OF THE HOMELESS HOMES PROJECT"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "completed first tiny home reveal urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "shutter_flash",
      "reason": "Hero beauty shot of the original prototype."
    },
    {
      "beatIndex": 28,
      "chapterIndex": 3,
      "text": "It is one thing to admire the resourcefulness of people building shelter out of necessity.",
      "visualSubject": "homeless_person_fixing_tarp",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "homeless man tying tarp securing tent sidewalk rain",
      "backupVideoQuery": "person repairing tent urban sidewalk",
      "negativeKeywords": [
        "recreational camping"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Contemplating the raw reality of survival building."
    },
    {
      "beatIndex": 29,
      "chapterIndex": 3,
      "text": "It is another thing entirely to sit inside a structure you built the exact same way",
      "visualSubject": "kloehn_sitting_inside_built_home",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "SITTING INSIDE",
        "subtitle": "FIRSTHAND CORPOREAL EXPERIENCE"
      },
      "clipFilename": "Kloehn sittiing in the home he made.jpg",
      "stockVideoQuery": "kloehn sitting inside built home urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic local photo of Gregory sitting inside his finished build."
    },
    {
      "beatIndex": 30,
      "chapterIndex": 3,
      "text": "and realize how thin the line actually is between the two.",
      "visualSubject": "kloehn_close_up_reflection",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "kloehn close up reflection urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "THE THIN LINE",
        "line2": "BETWEEN TRASH AND SANCTUARY",
        "spokenTrigger": "thin the line actually is",
        "themeColor": "crimson"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_dip_black",
      "reason": "Emotional weight of recognizing how fragile the barrier is."
    },
    {
      "beatIndex": 31,
      "chapterIndex": 3,
      "text": "From that weekend forward, the questions stopped being philosophical.",
      "visualSubject": "kloehn_cutting_stud_saw",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "kloehn cutting stud saw urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Shift into immediate hands-on social action."
    },
    {
      "beatIndex": 32,
      "chapterIndex": 3,
      "text": "If he could build himself a house for $40, he could build one for somebody who genuinely needed it,",
      "visualSubject": "recipient_smiling_at_doorway",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "DIRECT AID",
        "subtitle": "$40 BUILD TRANSFERRED TO UNSHELTERED RESIDENT"
      },
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "recipient smiling at doorway urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "stat_callout",
        "line1": "$40 TO SHELTER A PERSON",
        "line2": "DIRECT ACTION IN WEST OAKLAND",
        "spokenTrigger": "genuinely needed it",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic video showing recipient in front of her home."
    },
    {
      "beatIndex": 33,
      "chapterIndex": 3,
      "text": "and there was no shortage of need within walking distance of his own front door.",
      "visualSubject": "west_oakland_street_encampments_morning",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "WALKING DISTANCE",
        "subtitle": "NEIGHBORHOOD NEED IN WEST OAKLAND"
      },
      "clipFilename": null,
      "stockVideoQuery": "oakland street homeless encampment sidewalk tents morning",
      "backupVideoQuery": "urban city sidewalk tents poverty morning",
      "negativeKeywords": [
        "beach",
        "party"
      ],
      "callout": {
        "type": "map_pingeotag",
        "line1": "WEST OAKLAND",
        "line2": "WITHIN WALKING DISTANCE",
        "spokenTrigger": "walking distance",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Powerful closing shot of Chapter 3 setting up the workshop in Chapter 4."
    }
  ],
  "4": [
    {
      "beatIndex": 0,
      "chapterIndex": 4,
      "text": "Kloehn's Workshop sits close to the Alliance Recycling Center in West Oakland,",
      "visualSubject": "kloehn_workshop_exterior_west_oakland",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "WEST OAKLAND WORKSHOP",
        "subtitle": "CLOSE PROXIMITY TO RECYCLING CORRIDOR"
      },
      "clipFilename": null,
      "stockVideoQuery": "industrial warehouse brick alleyway west oakland morning",
      "backupVideoQuery": "art studio workshop exterior industrial building",
      "negativeKeywords": [
        "modern shopping center"
      ],
      "callout": {
        "type": "map_pingeotag",
        "line1": "THE WORKSHOP",
        "line2": "WEST OAKLAND, CA",
        "spokenTrigger": "Kloehn's Workshop",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Establishes physical proximity between the studio and recycling hub."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 4,
      "text": "and that location is not an accident.",
      "visualSubject": "revolving_recycling_traffic",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "people with shopping carts sidewalk city street morning",
      "backupVideoQuery": "urban street pedestrians sidewalk carts",
      "negativeKeywords": [
        "beach",
        "forest"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "cut",
      "reason": "Narrative emphasis on intentional geographic positioning."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 4,
      "text": "It is one of the most reliable can-and-bottle return spots in the neighborhood,",
      "visualSubject": "recycling_scale_cans_bottles",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "BOTTLE & CAN REDEMPTION",
        "subtitle": "DAILY SCRAP ECONOMY"
      },
      "clipFilename": null,
      "stockVideoQuery": "sorting plastic bottles aluminum cans recycling center",
      "backupVideoQuery": "conveyor belt recycling plant crushed cans",
      "negativeKeywords": [
        "new factory bottles"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "DAILY CASHOUT",
        "line2": "CRV ALUMINUM & GLASS RETURNS",
        "spokenTrigger": "can-and-bottle return",
        "themeColor": "emerald"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Depicting the economic heartbeat of can and bottle returns."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 4,
      "text": "which means it is also one of the most reliable places to find homeless residents",
      "visualSubject": "residents_walking_sidewalk_carts",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "homeless person walking down city sidewalk daylight",
      "backupVideoQuery": "urban street scene poverty morning sunlight",
      "negativeKeywords": [
        "party",
        "business suits"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Showing the natural flow of community members through the corridor."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 4,
      "text": "pushing loaded shopping carts through the same stretch of sidewalk, day after day, week after week.",
      "visualSubject": "shopping_cart_wheels_rolling_pavement",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE WALKING ROUTE",
        "subtitle": "DAILY RHYTHM OF REDEMPTION"
      },
      "clipFilename": null,
      "stockVideoQuery": "shopping cart wheels rolling sidewalk pavement asphalt",
      "backupVideoQuery": "feet walking alongside shopping trolley street",
      "negativeKeywords": [
        "supermarket interior"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "cut",
      "reason": "Rhythmic visual matching the cadence of repetitive daily walks."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 4,
      "text": "His finished structures do not have to travel far to reach the people who need them.",
      "visualSubject": "tiny_home_on_street_corner",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "LOCAL DISTRIBUTION",
        "subtitle": "MINIMAL TRANSIT DISTANCE"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "tiny home on street corner urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "HYPERLOCAL AID",
        "line2": "BUILT AND DELIVERED ON THE SAME BLOCK",
        "spokenTrigger": "travel far to reach",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Authentic local photo showing completed mobile home in neighborhood."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 4,
      "text": "Some of them, he has admitted with a kind of dry amusement, do not travel far at all.",
      "visualSubject": "kloehn_dry_amusement_interview",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "kloehn dry amusement interview urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Lighthearted conversational beat with authentic footage."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 4,
      "text": "A finished home occasionally ends up parked just down the block from the studio where it was built,",
      "visualSubject": "tiny_home_parked_down_block",
      "mediaType": "image",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "PARKED DOWN THE BLOCK",
        "subtitle": "IMMEDIATE SHELTER OCCUPANCY"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "city sidewalk street corner morning parked trailer",
      "backupVideoQuery": "urban residential street morning sidewalk",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Showing the tiny house nestled right into the immediate streetscape."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 4,
      "text": "close enough that its builder can walk past it on his way to work.",
      "visualSubject": "builder_walking_to_studio_morning",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "man walking down industrial sidewalk morning sun flare",
      "backupVideoQuery": "person walking past brick warehouse morning light",
      "negativeKeywords": [
        "businessman suit"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Reflective morning walk past his own architectural creations."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 4,
      "text": "The raw material comes from the same place his original inspiration did, other people's waste,",
      "visualSubject": "construction_dumpster_demolition",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "URBAN ARTIFACTS",
        "subtitle": "SCAVENGED MATERIAL METABOLISM"
      },
      "clipFilename": null,
      "stockVideoQuery": "construction debris demolition pile wood scrap",
      "backupVideoQuery": "excavator sorting demolition rubble waste",
      "negativeKeywords": [
        "clean modern building"
      ],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "RAW MATERIAL",
        "line2": "POST-CONSUMER URBAN REFUSE",
        "spokenTrigger": "other people's waste",
        "themeColor": "amber"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Archival tag highlighting urban waste streams as raw material."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 4,
      "text": "industrial scrap left over from job sites, illegal dump sites scattered around Oakland,",
      "visualSubject": "illegal_dump_site_oakland_alley",
      "mediaType": "video",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "ILLEGAL DUMP SITES",
        "subtitle": "OAKLAND ALLEYWAYS & EMPTY LOTS"
      },
      "clipFilename": null,
      "stockVideoQuery": "illegal dumping site trash piles urban alley street",
      "backupVideoQuery": "abandoned lot garbage junk city alleyway",
      "negativeKeywords": [
        "clean manicured lawn"
      ],
      "callout": {
        "type": "newspaper_headline",
        "line1": "ILLEGAL DUMPING CRISIS",
        "line2": "OVER 30,000 ANNUAL COMPLAINTS IN OAKLAND",
        "spokenTrigger": "illegal dump sites",
        "themeColor": "crimson"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Journalistic data point highlighting Oakland's pervasive illegal dumping."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 4,
      "text": "the kind that accumulate old furniture, broken cabinetry, and construction debris faster than the city can clear them out.",
      "visualSubject": "piles_old_cabinetry_furniture",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "pile of discarded wooden furniture scrap debris street",
      "backupVideoQuery": "broken cabinets demolition timber pile",
      "negativeKeywords": [
        "furniture store showroom"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "whip_pan_left",
      "reason": "Fast visual catalog of discarded cabinetry and lumber."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 4,
      "text": "Even the paint is often found rather than bought,",
      "visualSubject": "discarded_paint_cans_alley",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "FOUND PAINT CANS",
        "subtitle": "SURPLUS LATEX & ENAMEL COATINGS"
      },
      "clipFilename": null,
      "stockVideoQuery": "paint cans stacked alley discarded colorful lids",
      "backupVideoQuery": "used paint cans on shelf opened messy",
      "negativeKeywords": [
        "hardware store new display"
      ],
      "callout": {
        "type": "marker_circle",
        "line1": "FREE COATINGS",
        "line2": "HALF-USED DISCARDED PAINT CANS",
        "spokenTrigger": "paint is often found",
        "themeColor": "cyan"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Focusing on the unexpected treasure of dumped paint."
    },
    {
      "beatIndex": 13,
      "chapterIndex": 4,
      "text": "cans of half-used color illegally dumped in alleys that get layered three and four coats deep on a finished structure.",
      "visualSubject": "thick_paint_brush_strokes",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "WATERPROOF BARRIER",
        "subtitle": "3 TO 4 THICK COATS OF FOUND PAINT"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "thick paint brush strokes urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic local photo showing the rich layered exterior colors."
    },
    {
      "beatIndex": 14,
      "chapterIndex": 4,
      "text": "That is not an aesthetic choice so much as a practical one.",
      "visualSubject": "kloehn_adjusting_exterior_trim",
      "mediaType": "image",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn adjusting the home.jpg",
      "stockVideoQuery": "kloehn adjusting exterior trim urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Authentic photo of Kloehn inspecting the practical exterior assembly."
    },
    {
      "beatIndex": 15,
      "chapterIndex": 4,
      "text": "Enough coats of almost any paint will waterproof a wall through an Oakland winter,",
      "visualSubject": "rain_hitting_painted_exterior_wall",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "rain falling on exterior wall water droplets running down",
      "backupVideoQuery": "rainy day wet surface weather storm city",
      "negativeKeywords": [
        "sunny desert"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "WATERPROOFING",
        "line2": "PROTECTION AGAINST PACIFIC RAINS",
        "spokenTrigger": "waterproof a wall",
        "themeColor": "cyan"
      },
      "overlay": "rain_lens_streaks",
      "transition": "crossfade",
      "reason": "Rain streaks overlay conveying weatherproofing necessity."
    },
    {
      "beatIndex": 16,
      "chapterIndex": 4,
      "text": "and mismatched color is a small price to pay for a roof that does not leak.",
      "visualSubject": "solid_peaked_roofline",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "FUNCTION OVER FORM",
        "subtitle": "DRY INTERIOR IN HEAVY RAIN"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "solid peaked roofline urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "A ROOF THAT DOES NOT LEAK.",
        "line2": "PRAGMATIC SURVIVAL ARCHITECTURE",
        "spokenTrigger": "roof that does not leak",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Editorial quote callout stating the core functional philosophy."
    },
    {
      "beatIndex": 17,
      "chapterIndex": 4,
      "text": "Within about a week of scavenging, Kloehn can usually gather enough raw material to build one home, sometimes two,",
      "visualSubject": "truck_bed_loaded_with_timber",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "WEEKLY YIELD",
        "subtitle": "1 TO 2 HOMES PER RECONNAISSANCE RUN"
      },
      "clipFilename": null,
      "stockVideoQuery": "pickup truck bed loaded with reclaimed wood lumber driving",
      "backupVideoQuery": "truck loaded with timber wood planks alley",
      "negativeKeywords": [
        "sports car"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "1-2 HOMES / WEEK",
        "line2": "AVERAGE SCAVENGING HARVEST",
        "spokenTrigger": "build one home, sometimes two",
        "themeColor": "emerald"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Stat badge tracking the weekly scavenging harvest rate."
    },
    {
      "beatIndex": 18,
      "chapterIndex": 4,
      "text": "depending on what the dump sites happen to be offering that week.",
      "visualSubject": "scouting_dump_site_rubble",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "construction site scrap bin wood pile looking through",
      "backupVideoQuery": "salvaged building materials outdoor yard",
      "negativeKeywords": [
        "clean shopping mall"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Reflecting the serendipity of urban scrap hunting."
    },
    {
      "beatIndex": 19,
      "chapterIndex": 4,
      "text": "His own out-of-pocket costs stay close to nothing, gas to drive around scouting, a box of screws.",
      "visualSubject": "box_of_screws_and_keys",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "OUT-OF-POCKET EXPENDITURE",
        "subtitle": "TRUCK FUEL • HARDWARE SCREWS"
      },
      "clipFilename": null,
      "stockVideoQuery": "box of construction screws wood screws workbench",
      "backupVideoQuery": "carpenter tools screws drill bit workbench",
      "negativeKeywords": [
        "luxury store"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "$30 - $40",
        "line2": "OUT-OF-POCKET CASH",
        "spokenTrigger": "close to nothing",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Reiterating the minimal out-of-pocket financial outlay."
    },
    {
      "beatIndex": 20,
      "chapterIndex": 4,
      "text": "The real cost of every house he builds was already paid, in a sense, by whoever threw the material away in the first place.",
      "visualSubject": "expensive_discarded_hardwood",
      "mediaType": "video",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "EMBODIED CAPITAL",
        "subtitle": "VALUE PREVIOUSLY EXTINGUISHED BY WASTE"
      },
      "clipFilename": null,
      "stockVideoQuery": "pile of discarded solid wood doors demolition timber",
      "backupVideoQuery": "scrap lumber pile solid oak pine wood",
      "negativeKeywords": [
        "cheap plastic trash"
      ],
      "callout": {
        "type": "editorial_quote",
        "line1": "ALREADY PAID BY WHOEVER THREW IT AWAY.",
        "line2": "HARVESTING SUNK VALUE",
        "spokenTrigger": "whoever threw the material away",
        "themeColor": "amber"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Profound philosophical quote on the true source of material value."
    },
    {
      "beatIndex": 21,
      "chapterIndex": 4,
      "text": "That scavenging first process shapes everything about how these homes actually get built, and it flips the usual order of construction on its head.",
      "visualSubject": "kloehn_building_home_sawing",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "kloehn building home sawing urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic local video of Gregory sawing and shaping wood in the shop."
    },
    {
      "beatIndex": 22,
      "chapterIndex": 4,
      "text": "Kloehn does not sketch a floor plan and then go hunting for material to match it.",
      "visualSubject": "blank_architectural_drafting_table",
      "mediaType": "image",
      "layout": "forensic_drafting_table",
      "layoutData": {
        "title": "CONVENTIONAL PARADIGM",
        "subtitle": "REJECTING PRE-DESIGNED BLUEPRINTS"
      },
      "clipFilename": "Plan , blueprint of dumpster home.jpg",
      "stockVideoQuery": "blank architectural drafting table urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "redacted_dossier",
        "line1": "NO FORMAL FLOOR PLANS",
        "line2": "MATERIAL-FIRST METHODOLOGY",
        "spokenTrigger": "does not sketch a floor plan",
        "themeColor": "slate"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Authentic local blueprint artifact paired with critique of blueprint-first design."
    },
    {
      "beatIndex": 23,
      "chapterIndex": 4,
      "text": "He works in the opposite direction entirely.",
      "visualSubject": "carpenter_inspecting_lumber_grain",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "carpenter inspecting rough lumber wood grain workshop",
      "backupVideoQuery": "woodworker holding board inspecting edge",
      "negativeKeywords": [
        "office desk typing"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Tactile inspection of timber dictating the form."
    },
    {
      "beatIndex": 24,
      "chapterIndex": 4,
      "text": "He has described his own method plainly. He lets his materials dictate the size and shape of the homes",
      "visualSubject": "pile_of_wooden_bed_frames",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "MATERIAL DICTATION",
        "subtitle": "SHAPE FOLLOWS SALVAGED GEOMETRY"
      },
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "pile of wooden bed frames urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "LET THE MATERIALS DICTATE THE SHAPE.",
        "line2": "ADAPTIVE DESIGN METHOD",
        "spokenTrigger": "materials dictate the size",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Authentic video showing Gregory aligning boards to their natural form."
    },
    {
      "beatIndex": 25,
      "chapterIndex": 4,
      "text": "and treats the search for material as the design phase itself.",
      "visualSubject": "scouting_salvage_yard_alley",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "artist walking through architectural salvage yard scrap",
      "backupVideoQuery": "person exploring warehouse vintage materials",
      "negativeKeywords": [
        "grocery shopping"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Redefining the scavenging hunt as the primary architectural phase."
    },
    {
      "beatIndex": 26,
      "chapterIndex": 4,
      "text": "A pile of salvaged bed frames does not get forced into a container-shaped house.",
      "visualSubject": "stacked_bed_headboards_vintage",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "NATURAL GEOMETRIES",
        "subtitle": "HEADBOARDS • FOOTBOARDS • SLATS"
      },
      "clipFilename": null,
      "stockVideoQuery": "vintage wooden bed headboard carved wood detail",
      "backupVideoQuery": "reclaimed wooden bed frames stacked",
      "negativeKeywords": [
        "futon modern metal"
      ],
      "callout": null,
      "overlay": "archival_halftone_paper",
      "transition": "zoom_punch",
      "reason": "Visualizing traditional bed frame components."
    },
    {
      "beatIndex": 27,
      "chapterIndex": 4,
      "text": "It gets allowed to become whatever a stack of headboards and footboards naturally wants to become,",
      "visualSubject": "kloehn_holding_up_headboard_frame",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "NATURAL FORM",
        "subtitle": "HEADBOARD AS PEAKED FRONT DOOR"
      },
      "clipFilename": "Kloehn  building the home.jpg",
      "stockVideoQuery": "kloehn holding up headboard frame urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic photo showing Gregory testing headboard roof angles."
    },
    {
      "beatIndex": 28,
      "chapterIndex": 4,
      "text": "which, it turns out, is a surprisingly effective peaked roof and a surprisingly sturdy wall frame if you are willing to let the material lead.",
      "visualSubject": "finished_pitched_roof_tiny_house",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "ARCHITECTURAL INTEGRITY",
        "subtitle": "STURDY WALL FRAME • WEATHERPROOF PEAK"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "finished pitched roof tiny house urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "PEAKED ROOF SYSTEM",
        "line2": "SOLID WOODEN BED FRAME GEOMETRY",
        "spokenTrigger": "surprisingly effective peaked roof",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "shutter_flash",
      "reason": "Hero beauty shot showing the completed headboard roofline."
    },
    {
      "beatIndex": 29,
      "chapterIndex": 4,
      "text": "The real challenge in his own framing is never about drawing the perfect house on paper first. It is about standing in front of a truckload of somebody else's discarded furniture and figuring out how to make it work as somebody's front door,",
      "visualSubject": "kloehn_framing_doorway_front",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn showing the homme .mp4",
      "stockVideoQuery": "kloehn framing doorway front urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "FIGURING OUT HOW TO MAKE IT WORK.",
        "line2": "DISCARDED FURNITURE INTO A FRONT DOOR",
        "spokenTrigger": "somebody's front door",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_dip_black",
      "reason": "Authentic local video of Gregory showing the functioning front door."
    }
  ],
  "5": [
    {
      "beatIndex": 0,
      "chapterIndex": 5,
      "text": "A build day at the studio does not look like construction in the conventional sense, and it does not sound like it either.",
      "visualSubject": "volunteers_gathering_workshop",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "BUILD DAY // SATURDAY",
        "subtitle": "GRASSROOTS STUDIO BUILD SESSION"
      },
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "volunteers gathering workshop urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "BUILD DAY",
        "line2": "VOLUNTEER SATURDAY BUILD SESSION",
        "spokenTrigger": "A build day at the studio",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Authentic local video showing volunteers arriving and gathering."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 5,
      "text": "There is no crew foreman barking measurements, no crane, no concrete truck idling at the curb.",
      "visualSubject": "commercial_construction_crane_truck",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "COMMERCIAL CONSTRUCTION",
        "subtitle": "HEAVY INDUSTRIAL CRANES & FOREMEN"
      },
      "clipFilename": null,
      "stockVideoQuery": "construction crane towering concrete mixer truck idling",
      "backupVideoQuery": "construction site foreman yelling clipboard",
      "negativeKeywords": [
        "friendly workshop artist"
      ],
      "callout": null,
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Contrasting with institutional industrial job sites."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 5,
      "text": "It looks more like a scrapyard that has decided, for one day, to organize itself into something useful.",
      "visualSubject": "organized_salvaged_lumber_yard",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "THE SCRAPYARD SHOP",
        "subtitle": "ORGANIZING SPONTANEOUS EFFICIENCY"
      },
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "organized salvaged lumber yard urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "A SCRAPYARD ORGANIZED INTO UTILITY.",
        "line2": "SPONTANEOUS VOLUNTEER WORKSHOP",
        "spokenTrigger": "organize itself into something useful",
        "themeColor": "amber"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic video showing the lively open workshop yard."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 5,
      "text": "Sawhorses go up first, dragged out from wherever they were leaning the week before.",
      "visualSubject": "wooden_sawhorses_setup_asphalt",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "carpenter setting up wooden sawhorses outdoor workshop",
      "backupVideoQuery": "setting up work table sawhorses timber",
      "negativeKeywords": [
        "beach"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Tactile morning preparation: dragging out sawhorses."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 5,
      "text": "Then the material gets sorted into rough piles, usable lumber in one corner, salvaged panels in another.",
      "visualSubject": "sorting_reclaimed_lumber_piles",
      "mediaType": "video",
      "layout": "parallax_triptych_gallery",
      "layoutData": {
        "title": "MATERIAL TRIAGE",
        "subtitle": "STUDS • PLYWOOD • CORRUGATED PANELS"
      },
      "clipFilename": null,
      "stockVideoQuery": "workers sorting through lumber boards stacking workshop",
      "backupVideoQuery": "stacking plywood sheets scrap wood pile",
      "negativeKeywords": [
        "office work"
      ],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "TRIAGE CORNERS",
        "line2": "STRUCTURAL STUDS // CLADDING PANELS",
        "spokenTrigger": "sorted into rough piles",
        "themeColor": "slate"
      },
      "overlay": "archival_halftone_paper",
      "transition": "zoom_punch",
      "reason": "Triptych layout analyzing the sorting and grading of scrap."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 5,
      "text": "Whatever oddity showed up that week, a stack of bed frames, a run of mismatched cabinet doors,",
      "visualSubject": "odd_salvaged_items_cabinetry",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "vintage kitchen cabinet doors wooden scrap stack",
      "backupVideoQuery": "salvaged doors and windows architectural yard",
      "negativeKeywords": [
        "new kitchen modern"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Visual inventory of curious found items."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 5,
      "text": "set off to the side until somebody figures out what it wants to become.",
      "visualSubject": "kloehn_inspecting_wood_piles",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "DISCOVERY PROCESS",
        "subtitle": "WAITING FOR THE RIGHT CONTEXT"
      },
      "clipFilename": "Kloehn  building the home.jpg",
      "stockVideoQuery": "kloehn inspecting wood piles urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic photo of Gregory standing thoughtfully beside the frame."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 5,
      "text": "Volunteers who show up already know not to expect a blueprint.",
      "visualSubject": "volunteers_collaborating_workshop",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "COMMUNITY BUILDERS",
        "subtitle": "COLLABORATIVE EXPERIMENTAL MAKING"
      },
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "volunteers collaborating workshop urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "polaroid_snapshot",
        "line1": "THE VOLUNTEERS",
        "line2": "WORKING WITHOUT BLUEPRINTS",
        "spokenTrigger": "not to expect a blueprint",
        "themeColor": "cyan"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic local footage of smiling, motivated volunteers."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 5,
      "text": "Kloehn tends to walk the piles first, turning pieces over, holding two boards up against each other to see if they want to be a wall or a roofline.",
      "visualSubject": "kloehn_holding_boards_together",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "kloehn holding boards together urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "cut",
      "reason": "Authentic local footage showing Kloehn testing board pairings."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 5,
      "text": "Decisions get made out loud, adjusted on the fly, abandoned halfway through if a better idea turns up.",
      "visualSubject": "volunteer_discussing_framing",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "ADAPTIVE DECISIONS",
        "subtitle": "ITERATION IN REAL TIME"
      },
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "volunteer discussing framing urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic group communication and spontaneous design choices."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 5,
      "text": "A headboard that was going to be decorative ends up structural.",
      "visualSubject": "headboard_nailed_into_studs",
      "mediaType": "image",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "STRUCTURAL REALLOCATION",
        "subtitle": "ORNAMENT INTO LOAD-BEARING FRAME"
      },
      "clipFilename": "Kloehn  building the home.jpg",
      "stockVideoQuery": "headboard nailed into studs urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "marker_circle",
        "line1": "LOAD-BEARING",
        "line2": "SOLID OAK HEADBOARD INTEGRATED",
        "spokenTrigger": "decorative ends up structural",
        "themeColor": "gold"
      },
      "overlay": "archival_halftone_paper",
      "transition": "zoom_punch",
      "reason": "Marker circle callout highlighting the repurposed structural headboard."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 5,
      "text": "A door that was too warped for one house fits perfectly on another.",
      "visualSubject": "hanging_salvaged_wooden_door",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn showing the homme .mp4",
      "stockVideoQuery": "hanging salvaged wooden door urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Authentic local footage showing the fitted door swinging cleanly."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 5,
      "text": "By midday, there is a frame standing where there was only a pile of lumber that morning,",
      "visualSubject": "timber_frame_standing_tall",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "MIDDAY PROGRESS",
        "subtitle": "FULL CUBIC FRAME ASSEMBLED"
      },
      "clipFilename": "Kloehn  building the home.jpg",
      "stockVideoQuery": "timber frame standing tall urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "12:00 PM // FRAME COMPLETE",
        "line2": "FROM SCRAP PILE TO HABITABLE ENCLOSURE",
        "spokenTrigger": "By midday, there is a frame",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "shutter_flash",
      "reason": "Hero progress shot showing the skeletal house fully assembled."
    },
    {
      "beatIndex": 13,
      "chapterIndex": 5,
      "text": "held together with screws bought at the hardware store down the street.",
      "visualSubject": "drill_driving_heavy_screw",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "cordless impact driver driving screw into 2x4 lumber",
      "backupVideoQuery": "carpenter screwing wood boards together fast",
      "negativeKeywords": [
        "hammering nail"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "High-speed macro cut of screws securing the frame."
    },
    {
      "beatIndex": 14,
      "chapterIndex": 5,
      "text": "The only line item in the entire build that actually cost real money.",
      "visualSubject": "screws_receipt_stat",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "FINANCIAL ACCOUNTING",
        "subtitle": "BOX OF 3-INCH EXTERIOR WOOD SCREWS"
      },
      "clipFilename": null,
      "stockVideoQuery": "hardware store screw aisle fasteners boxes",
      "backupVideoQuery": "carpenter holding handful of steel screws",
      "negativeKeywords": [
        "expensive luxury"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "$18.50 SCREWS",
        "line2": "SOLE DIRECT CASH EXPENDITURE",
        "spokenTrigger": "actually cost real money",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Stat callout driving home the extreme financial frugality."
    },
    {
      "beatIndex": 15,
      "chapterIndex": 5,
      "text": "The paint goes on last, and it goes on thick.",
      "visualSubject": "thick_paint_rolling_board",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "paint roller applying thick bright paint wood wall",
      "backupVideoQuery": "paintbrush dripping thick paint onto exterior wood",
      "negativeKeywords": [
        "digital drawing"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Sensory macro shot of thick paint sealing the wood pores."
    },
    {
      "beatIndex": 16,
      "chapterIndex": 5,
      "text": "Coat after mismatched coat, whatever color happened to be sitting in a dumped can that week,",
      "visualSubject": "colorful_mismatched_layers",
      "mediaType": "image",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "VIBRANT LAYERING",
        "subtitle": "TEAL • RED • CANARY YELLOW • CHARCOAL"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "painting colorful stripes wooden wall artistic",
      "backupVideoQuery": "mixing leftover paint colors together",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "SCRAP COLOR PALETTE",
        "line2": "WHATEVER DUMPED CANS PROVIDED",
        "spokenTrigger": "Coat after mismatched coat",
        "themeColor": "cyan"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Split screen celebrating the folk-art aesthetic of mismatched paint."
    },
    {
      "beatIndex": 17,
      "chapterIndex": 5,
      "text": "applied less for how it looks and more for how well it keeps water out.",
      "visualSubject": "rain_beading_on_painted_wood",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "water beading on painted surface waterproof test",
      "backupVideoQuery": "water droplets repelling on painted wood",
      "negativeKeywords": [
        "leaking roof"
      ],
      "callout": null,
      "overlay": "rain_lens_streaks",
      "transition": "crossfade",
      "reason": "Water beading demonstration showing effective weather barrier."
    },
    {
      "beatIndex": 18,
      "chapterIndex": 5,
      "text": "By the time the light starts to go, there is a finished structure sitting on the same patch of asphalt where a pile of trash sat that morning,",
      "visualSubject": "sunset_completed_tiny_home",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "DUSK TRANSFORMATION",
        "subtitle": "8 HOURS: SCRAP PILE TO COMPLETED HOME"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "sunset completed tiny home urban documentary",
      "backupVideoQuery": "carpentry wood workshop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "8-HOUR TURNAROUND",
        "line2": "MORNING TRASH • EVENING HOME",
        "spokenTrigger": "starts to go, there is a finished structure",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "shutter_flash",
      "reason": "Dramatic dusk reveal of the completed tiny house."
    },
    {
      "beatIndex": 19,
      "chapterIndex": 5,
      "text": "and somebody who did not have a door yesterday now has one.",
      "visualSubject": "recipient_closing_locking_door",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "A DOOR OF ONE'S OWN",
        "subtitle": "DIGNITY & SANCTUARY SECURED"
      },
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "person closing front door lock keys",
      "backupVideoQuery": "wooden door opening closing home",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "A DOOR SHE DID NOT HAVE YESTERDAY.",
        "line2": "SAFETY GRANTED BEFORE NIGHTFALL",
        "spokenTrigger": "did not have a door yesterday",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_dip_black",
      "reason": "Authentic emotional resolution closing Chapter 5 with a quiet sense of triumph."
    }
  ],
  "6": [
    {
      "beatIndex": 0,
      "chapterIndex": 6,
      "text": "Over time, that constraint produced a small fleet of houses that look nothing alike,",
      "visualSubject": "fleet_of_diverse_tiny_houses",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE FLEET OF HOUSES",
        "subtitle": "AN UNCONVENTIONAL MOBILE VILLAGE"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "tiny house community colorful small homes",
      "backupVideoQuery": "micro shelter wooden cabin street",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "THE TINY FLEET",
        "line2": "NO TWO HOUSES LOOK ALIKE",
        "spokenTrigger": "small fleet of houses",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Hero reveal of the diverse, sculptural fleet of mobile tiny homes."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 6,
      "text": "because no two of them started from the same pile of scrap.",
      "visualSubject": "disparate_scrap_heaps_workshop",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "DIVERGENT ORIGINS",
        "subtitle": "EVERY PILE DICTATES A UNIQUE PROTOTYPE"
      },
      "clipFilename": null,
      "stockVideoQuery": "architectural salvage yard piles wood doors metal scrap",
      "backupVideoQuery": "construction salvage warehouse materials piled up",
      "negativeKeywords": [
        "identical factory goods"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Showing the radical variance in raw scavenging inputs."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 6,
      "text": "Some are barely larger than a coffin, built with just enough room to lie flat and sleep dry,",
      "visualSubject": "minimalist_sleeping_pod_micro",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "THE SLEEPING POD",
        "subtitle": "COMPACT HORIZONTAL ENCLOSURE"
      },
      "clipFilename": null,
      "stockVideoQuery": "small wooden sleeping box pod micro tiny house",
      "backupVideoQuery": "compact micro camper bed inside",
      "negativeKeywords": [
        "luxurious master bedroom"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "MINIMAL SLEEPER",
        "line2": "ROOM TO LIE FLAT & STAY DRY",
        "spokenTrigger": "barely larger than a coffin",
        "themeColor": "amber"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Exploring the micro-footprint shelter designed purely for night survival."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 6,
      "text": "meant for a single resident who needs almost nothing beyond privacy and a working lock.",
      "visualSubject": "brass_padlock_and_hasp",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "ESSENTIAL HUMAN NEEDS",
        "subtitle": "AUTONOMY • PRIVACY • WORKING LOCK"
      },
      "clipFilename": null,
      "stockVideoQuery": "hand locking heavy brass padlock hasp wooden door",
      "backupVideoQuery": "turning key deadbolt latch wooden door detail",
      "negativeKeywords": [
        "digital high tech scanner"
      ],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "BASIC UTILITY",
        "line2": "PRIVACY & A WORKING LOCK",
        "spokenTrigger": "privacy and a working lock",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Emphasizing security as the most essential baseline human need."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 6,
      "text": "Others are large enough to stand up inside, tall enough to move around in without stooping, closer to a cabin than a box.",
      "visualSubject": "standing_tall_inside_cabin",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn demostrating the home he made by shoing everything what it is like .mp4",
      "stockVideoQuery": "inside small wooden cabin camper interior",
      "backupVideoQuery": "cozy small room interior wood",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic video showing Kloehn easily standing up inside the spacious cabin build."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 6,
      "text": "All of them, regardless of size, share one design choice that is easy to overlook and impossible to overstate—wheels.",
      "visualSubject": "caster_wheels_close_up",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE CRITICAL FEATURE",
        "subtitle": "HEAVY-DUTY INDUSTRIAL CASTER WHEELS"
      },
      "clipFilename": "Kloehn adjusting the home.jpg",
      "stockVideoQuery": "swivel caster wheels heavy duty rolling industrial",
      "backupVideoQuery": "cart wheels rolling asphalt",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "CRITICAL INNOVATION: WHEELS",
        "line2": "MOBILITY IS THE KEY TO SURVIVAL",
        "spokenTrigger": "impossible to overstate—wheels",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Dramatic highlight on wheels as the core survival mechanism."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 6,
      "text": "Every structure Kloehn builds can be moved, because a home that can be dragged 10 feet out of the way survives a city sweep.",
      "visualSubject": "rolling_house_along_sidewalk",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn showing the homme .mp4",
      "stockVideoQuery": "pushing cart wooden structure street sidewalk",
      "backupVideoQuery": "mobile house rolling urban road",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "A HOME THAT MOVES 10 FEET SURVIVES A SWEEP.",
        "line2": "LEGAL LOOPHOLE AS RESISTANCE",
        "spokenTrigger": "survives a city sweep",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic footage of Gregory demonstrating the wheels rolling effortlessly."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 6,
      "text": "A home bolted to the sidewalk gets tagged, sighted, and eventually hauled off on the back of a public works truck.",
      "visualSubject": "public_works_flatbed_truck_sweep",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "MUNICIPAL ENCAMPMENT SWEEP",
        "subtitle": "CONFISCATION OF FIXED STRUCTURES"
      },
      "clipFilename": null,
      "stockVideoQuery": "city municipal worker cleaning street bulldozer truck",
      "backupVideoQuery": "flatbed tow truck hauling away debris urban street",
      "negativeKeywords": [
        "happy picnic"
      ],
      "callout": {
        "type": "redacted_dossier",
        "line1": "CITY CODE ENFORCEMENT",
        "line2": "TAGGED & CONFISCATED FIXED PROPERTY",
        "spokenTrigger": "hauled off on the back",
        "themeColor": "crimson"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Chilling visual of municipal sweeps destroying stationary shelters."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 6,
      "text": "The largest of his builds earned a name of its own—the Chuck Wagon,",
      "visualSubject": "the_chuck_wagon_exterior",
      "mediaType": "image",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "THE CHUCK WAGON",
        "subtitle": "FLAGSHIP MOBILE TIMBER CABIN"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "wooden camper cabin on wheels handmade",
      "backupVideoQuery": "small timber home on trailer wheels",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "BUILD #04: THE CHUCK WAGON",
        "line2": "EXPANDED LIVING & COOKING SPACE",
        "spokenTrigger": "the Chuck Wagon",
        "themeColor": "gold"
      },
      "overlay": "archival_halftone_paper",
      "transition": "zoom_punch",
      "reason": "Featuring the most spacious and famous home in the fleet."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 6,
      "text": "big enough to shelter more than just sleep, closer in spirit to a small cabin on wheels than a box salvaged from a job site.",
      "visualSubject": "inside_chuck_wagon_kitchenette",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "CABIN INTERIOR",
        "subtitle": "INTEGRATED SHELVING & PREPARATION AREA"
      },
      "clipFilename": "inside the dumpster home.jpg",
      "stockVideoQuery": "tiny camper interior kitchen shelf stove",
      "backupVideoQuery": "small cabin lived in interior storage",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic local photo of the cozy, fully outfitted interior."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 6,
      "text": "Another, boxier, and more severe in its lines, became known around the studio as the Unabomber Shack,",
      "visualSubject": "rustic_wooden_cabin_box",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "rustic weathered wood cabin exterior geometric box",
      "backupVideoQuery": "weathered plywood shed angular exterior",
      "negativeKeywords": [
        "modern glass house"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "NICKNAME: THE CABIN",
        "line2": "SEVERE GEOMETRIC LINES",
        "spokenTrigger": "Unabomber Shack",
        "themeColor": "slate"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Humorous workshop nickname highlighting the raw, severe timber geometry."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 6,
      "text": "a nickname that stuck as a joke because the resemblance to a certain infamous cabin in the woods was too obvious for anyone to let slide.",
      "visualSubject": "studio_crew_laughing_workshop",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "STUDIO HUMOR",
        "subtitle": "IRREVERENT NICKNAMES FOR EXPERIMENTAL SHAPES"
      },
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "volunteers working wood shop carpentry smiling",
      "backupVideoQuery": "community workshop people building wood",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic video capturing the friendly camaraderie and workshop humor."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 6,
      "text": "And the newest structure in the studio at the time was built almost entirely out of old beds,",
      "visualSubject": "headboards_assembled_into_frame",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "THE BED FRAME HOME",
        "subtitle": "100% POST-CONSUMER MATTRESS FRAMES"
      },
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "wooden bed frame salvaged timber carpentry",
      "backupVideoQuery": "carpenter assembling wood frame screws",
      "negativeKeywords": [],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "MATERIALS SPEC",
        "line2": "3 OAK BED FRAMES • SALVAGED HINGES",
        "spokenTrigger": "built almost entirely out of old beds",
        "themeColor": "amber"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic local video showing recipient touring her bed-frame home."
    },
    {
      "beatIndex": 13,
      "chapterIndex": 6,
      "text": "backboards forming the frame, a matching headboard and footboard providing the triangular support for a pitched roof,",
      "visualSubject": "triangular_gable_roof_detail",
      "mediaType": "image",
      "layout": "forensic_drafting_table",
      "layoutData": {
        "title": "STRUCTURAL TRIANGULATION",
        "subtitle": "HEADBOARDS PROVIDE NATURAL GABLE ROOF"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "pitched roof wooden shingles handmade cabin",
      "backupVideoQuery": "timber roof rafters construction detail",
      "negativeKeywords": [],
      "callout": {
        "type": "marker_circle",
        "line1": "TRIANGULAR GABLE",
        "line2": "NATURAL PITCH SHEDS HEAVY RAIN",
        "spokenTrigger": "triangular support for a pitched roof",
        "themeColor": "cyan"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Forensic drafting layout highlighting the inherent genius of headboard geometry."
    },
    {
      "beatIndex": 14,
      "chapterIndex": 6,
      "text": "the raw material for someone's future bedroom becoming the outer walls of it instead.",
      "visualSubject": "outside_painted_walls_bed_house",
      "mediaType": "image",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "colorful wooden exterior wall weathered paint",
      "backupVideoQuery": "painting wooden structure bright colors",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "whip_pan_right",
      "reason": "Beauty shot of the completed exterior walls made from bedroom timber."
    },
    {
      "beatIndex": 15,
      "chapterIndex": 6,
      "text": "None of it is glamorous work, in the traditional sense of that word.",
      "visualSubject": "dirty_work_gloves_sawdust_floor",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "dirty leather work gloves on dusty workbench sawdust",
      "backupVideoQuery": "workshop floor covered in wood shavings sawdust",
      "negativeKeywords": [
        "clean fashion boutique"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Grounded close-up emphasizing sweaty, unglamorous physical labor."
    },
    {
      "beatIndex": 16,
      "chapterIndex": 6,
      "text": "There are no blueprints taped to a wall, no permits pinned above the workbench, no client meetings to sit through.",
      "visualSubject": "empty_workshop_wall_no_permits",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE UNBURDENED PROCESS",
        "subtitle": "NO PERMITS • NO BLUEPRINTS • NO CLIENTS"
      },
      "clipFilename": null,
      "stockVideoQuery": "empty brick wall workshop tool racks hanging saws",
      "backupVideoQuery": "messy workshop tool bench hammers hanging wall",
      "negativeKeywords": [
        "corporate boardroom"
      ],
      "callout": {
        "type": "redacted_dossier",
        "line1": "BUREAUCRACY EXEMPT",
        "line2": "ZERO PERMIT DELAYS • DIRECT MAKING",
        "spokenTrigger": "no blueprints taped to a wall",
        "themeColor": "slate"
      },
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Rejecting architectural bureaucracy in favor of spontaneous direct fabrication."
    },
    {
      "beatIndex": 17,
      "chapterIndex": 6,
      "text": "But building functional objects—ones actually meant to be lived in rather than looked at from behind a gallery rope—",
      "visualSubject": "art_gallery_velvet_rope_contrast",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "GALLERY ROPE VS LIVING REALITY",
        "subtitle": "CONTEMPLATIVE ART VS SURVIVAL SHELTER"
      },
      "stockVideoQuery": "museum velvet stanchion rope art gallery modern",
      "backupVideoQuery": "art gallery white room modern sculpture pedestals",
      "negativeKeywords": [
        "dirty alley"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Contrasting gallery display culture with tangible utilitarian shelter."
    },
    {
      "beatIndex": 18,
      "chapterIndex": 6,
      "text": "has turned out to be more satisfying to Kloehn than almost anything he built purely as sculpture.",
      "visualSubject": "kloehn_peaceful_inside_home",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "DEEPER SATISFACTION",
        "subtitle": "CREATIVE PURPOSE BEYOND THE WHITE CUBE"
      },
      "clipFilename": "Kloehn sittiing in the home he made.jpg",
      "stockVideoQuery": "carpenter sitting relaxing inside workshop cabin",
      "backupVideoQuery": "man smiling inside small wooden room",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "MORE SATISFYING THAN ANY GALLERY SCULPTURE.",
        "line2": "PURPOSE BEYOND AESTHETICS",
        "spokenTrigger": "more satisfying to Kloehn",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Hero portrait of Gregory expressing profound personal fulfillment."
    },
    {
      "beatIndex": 19,
      "chapterIndex": 6,
      "text": "Every structure poses a different problem because every pile of scavenged material is different,",
      "visualSubject": "inspecting_unusual_scrap_curves",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "artisan examining reclaimed wood curves workshop",
      "backupVideoQuery": "builder sorting scrap lumber warehouse",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic video showing Kloehn solving geometric puzzles on the fly."
    },
    {
      "beatIndex": 20,
      "chapterIndex": 6,
      "text": "and there is a real creative freedom in building something with no client to please, no budget to justify,",
      "visualSubject": "craftsman_smiling_welding_sparks",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "TOTAL CREATIVE FREEDOM",
        "subtitle": "NO CLIENT SPEC • NO BUDGET RESTRAINTS"
      },
      "clipFilename": null,
      "stockVideoQuery": "welder welding steel sparks flying dark workshop",
      "backupVideoQuery": "craftsman using grinder metal sparks workshop",
      "negativeKeywords": [
        "office meeting"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Visceral welding sparks conveying pure uninhibited creative energy."
    },
    {
      "beatIndex": 21,
      "chapterIndex": 6,
      "text": "and no pressure to recoup a cost that was barely spent in the first place.",
      "visualSubject": "kloehn_showing_home_details",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn demostrating the home he made by shoing everything what it is like .mp4",
      "stockVideoQuery": "craftsman demonstrating handmade wooden structure",
      "backupVideoQuery": "showing tiny house construction details",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "ZERO CAPITAL RISK",
        "line2": "VALUE BUILT FROM NOTHING",
        "spokenTrigger": "barely spent in the first place",
        "themeColor": "emerald"
      },
      "overlay": "micro_film_grain",
      "transition": "film_dip_black",
      "reason": "Authentic local footage closing Chapter 6 on the liberated artist builder."
    }
  ],
  "7": [
    {
      "beatIndex": 0,
      "chapterIndex": 7,
      "text": "It did not take long for people outside the neighborhood to notice what was parked along that stretch near the recycling center.",
      "visualSubject": "cars_driving_past_tiny_home_sidewalk",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "PUBLIC VISIBILITY",
        "subtitle": "WEST OAKLAND PEDESTRIAN CORRIDOR"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "cars driving past urban street sidewalk city",
      "backupVideoQuery": "street traffic passing city sidewalk daylight",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "WORD SPREADS",
        "line2": "ATTRACTING ATTENTION ACROSS OAKLAND",
        "spokenTrigger": "outside the neighborhood to notice",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Authentic local photo showing the home commanding attention on the sidewalk."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 7,
      "text": "A finished structure sitting on a public sidewalk, painted in mismatched colors",
      "visualSubject": "vibrant_sidewalk_house_exterior",
      "mediaType": "image",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "STREET INSTALLATION",
        "subtitle": "VIVID SCAVENGED COLORWAYS"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "colorful small architectural house street city sidewalk",
      "backupVideoQuery": "artistic wooden tiny house parked roadside",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "zoom_punch",
      "reason": "Hero image showcasing the eye-catching colorful facade."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 7,
      "text": "and built out of things anyone in Oakland would recognize as garbage, is not a subtle thing to drive past.",
      "visualSubject": "car_slowing_down_looking_out",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "car driving slowly down city street driver looking out",
      "backupVideoQuery": "passenger looking out car window city street daytime",
      "negativeKeywords": [
        "speeding sports car"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Driver turning head to stare at the impossible little structure."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 7,
      "text": "Neighbors started asking questions.",
      "visualSubject": "neighbors_talking_on_sidewalk",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "COMMUNITY CURIOSITY",
        "subtitle": "NEIGHBORHOOD CONVERSATIONS"
      },
      "clipFilename": null,
      "stockVideoQuery": "two neighbors talking sidewalk street corner urban",
      "backupVideoQuery": "people chatting outside front gate city street",
      "negativeKeywords": [
        "business meeting"
      ],
      "callout": {
        "type": "polaroid_snapshot",
        "line1": "NEIGHBORS INQUIRING",
        "line2": "WHAT IS THAT TINY HOUSE?",
        "spokenTrigger": "Neighbors started asking questions",
        "themeColor": "cyan"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "zoom_punch",
      "reason": "Polaroid callout capturing local curiosity on the block."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 7,
      "text": "A few started showing up on build days themselves, unannounced, just to see if the rumor was true.",
      "visualSubject": "new_volunteers_arriving_workshop",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "people arriving at community workshop tools",
      "backupVideoQuery": "volunteers meeting urban warehouse carpentry",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic local video showing neighbors arriving to join build days."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 7,
      "text": "That somebody nearby was giving away houses for the cost of a Saturday and a box of screws.",
      "visualSubject": "volunteers_smiling_working_tools",
      "mediaType": "video",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE RUMOR IN TOWN",
        "subtitle": "HOUSES GIVEN AWAY FOR A SATURDAY'S LABOR"
      },
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "people using cordless drill building wood project",
      "backupVideoQuery": "group working together carpentry workshop",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "GIVING AWAY HOUSES FOR A BOX OF SCREWS.",
        "line2": "RADICAL GIFT ECONOMY",
        "spokenTrigger": "cost of a Saturday and a box of screws",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Powerful quote centerpiece on the radical generosity of the project."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 7,
      "text": "Kloehn had never set out to build an audience. He had set out to build somebody a door.",
      "visualSubject": "kloehn_portrait_quiet_determination",
      "mediaType": "image",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "INITIAL INTENT",
        "subtitle": "BUILDING A DOOR, NOT AN AUDIENCE"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "portrait older craftsman carpenter focused eyes",
      "backupVideoQuery": "portrait mature builder looking thoughtful workshop",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "ORIGINAL MISSION",
        "line2": "NOT AN AUDIENCE • JUST A DOOR",
        "spokenTrigger": "build somebody a door",
        "themeColor": "gold"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Clear hero portrait of Gregory reiterating his modest, direct motivation."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 7,
      "text": "But the two things turned out to be hard to separate.",
      "visualSubject": "media_cameras_filming_street",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "videographer with camera filming documentary street",
      "backupVideoQuery": "news cameraman recording outdoors city sidewalk",
      "negativeKeywords": [
        "hollywood film set"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Documentary camera crews beginning to discover the story."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 7,
      "text": "Every finished structure functioned as its own advertisement, parked in plain sight,",
      "visualSubject": "tiny_home_standing_as_advertisement",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE VISIBLE ADVERTISEMENT",
        "subtitle": "STREETSCAPE EVIDENCE OF DIRECT AID"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "tiny house parked sidewalk urban roadside",
      "backupVideoQuery": "small wooden shelter street corner daylight",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic local photo showing the home as its own organic marketing."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 7,
      "text": "impossible to explain away as anything other than what it was.",
      "visualSubject": "passersby_stopping_to_admire",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "pedestrians walking past unique street structure",
      "backupVideoQuery": "people looking at street art installation sidewalk",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Authentic video showing recipient proudly displaying her home."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 7,
      "text": "Word did what Word does in a tight-knit part of a city. It moved faster than any press release could have.",
      "visualSubject": "word_of_mouth_street_conversations",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "GRASSROOTS VELOCITY",
        "subtitle": "WORD-OF-MOUTH SPREAD IN OAKLAND"
      },
      "clipFilename": null,
      "stockVideoQuery": "two people talking laughing street corner sunlight city",
      "backupVideoQuery": "group of people gathered on sidewalk chatting urban",
      "negativeKeywords": [
        "business office"
      ],
      "callout": {
        "type": "stat_callout",
        "line1": "VIRAL SPREAD",
        "line2": "FASTER THAN ANY PRESS RELEASE",
        "spokenTrigger": "faster than any press release",
        "themeColor": "cyan"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Visualizing the swift, organic transmission of word-of-mouth news."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 7,
      "text": "One person telling another person who happened to know somebody who needed exactly this.",
      "visualSubject": "person_sharing_hopeful_news",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "person talking earnestly to another person outdoors sunlight",
      "backupVideoQuery": "close up conversation two friends street",
      "negativeKeywords": [
        "angry fight"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Heartfelt personal connection connecting supply to desperate need."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 7,
      "text": "What grew out of that word of mouth was not a campaign. It was a waiting list, informal and handwritten.",
      "visualSubject": "handwritten_waiting_list_paper",
      "mediaType": "video",
      "layout": "open_case_binder",
      "layoutData": {
        "title": "THE WAITING LIST",
        "subtitle": "INFORMAL NAMES SCRAWLED ON LEGAL PADS"
      },
      "clipFilename": null,
      "stockVideoQuery": "hand writing names on yellow legal pad pen close up",
      "backupVideoQuery": "notebook paper handwritten list names pencil",
      "negativeKeywords": [
        "digital spreadsheet tablet"
      ],
      "callout": {
        "type": "court_transcript_card",
        "line1": "THE WAITING LIST",
        "line2": "DOZENS OF NAMES SCRAWLED BY HAND",
        "spokenTrigger": "waiting list, informal and handwritten",
        "themeColor": "amber"
      },
      "overlay": "archival_halftone_paper",
      "transition": "zoom_punch",
      "reason": "Transcript card callout showing the handwritten names of needy residents."
    },
    {
      "beatIndex": 13,
      "chapterIndex": 7,
      "text": "Names added faster than Kloehn, and his small circle of volunteers could keep up with material.",
      "visualSubject": "volunteers_scrambling_to_build",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "busy carpentry workshop sawing drilling framing",
      "backupVideoQuery": "construction crew assembling timber frame",
      "negativeKeywords": [],
      "callout": {
        "type": "odometer_stat",
        "line1": "DEMAND > SUPPLY",
        "line2": "NAMES GROWING FASTER THAN SCRAP",
        "spokenTrigger": "keep up with material",
        "themeColor": "crimson"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Authentic footage showing the bustling volunteer effort overwhelmed by demand."
    },
    {
      "beatIndex": 14,
      "chapterIndex": 7,
      "text": "He was not chasing attention. Attention, in this case, simply found the driveway on its own,",
      "visualSubject": "media_vans_parked_at_driveway",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "UNSOUGHT SPOTLIGHT",
        "subtitle": "JOURNALISTS AT THE STUDIO GATES"
      },
      "clipFilename": null,
      "stockVideoQuery": "television news van parked street satellite dish",
      "backupVideoQuery": "journalist holding microphone street interviewing",
      "negativeKeywords": [
        "hollywood red carpet"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "News broadcasts and international journalists descending on the workshop."
    },
    {
      "beatIndex": 15,
      "chapterIndex": 7,
      "text": "because the work was sitting right there on the sidewalk for anyone to see.",
      "visualSubject": "tiny_home_on_sidewalk_crowd",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "ON THE SIDEWALK",
        "subtitle": "UNDENIABLE, PUBLIC & BEAUTIFUL"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "small wooden shelter sidewalk city street crowd",
      "backupVideoQuery": "tiny house street community people passing",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "THE WORK WAS SITTING ON THE SIDEWALK.",
        "line2": "FOR THE WHOLE WORLD TO SEE",
        "spokenTrigger": "sitting right there on the sidewalk",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Hero beauty shot closing Chapter 7 on the public impact of the build."
    }
  ],
  "8": [
    {
      "beatIndex": 0,
      "chapterIndex": 8,
      "text": "Kloehn has never framed this as a solution to homelessness,",
      "visualSubject": "kloehn_blunt_interview_portrait",
      "mediaType": "image",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "CLARIFYING INTENT",
        "subtitle": "NOT A POLICY SOLUTION"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "interview portrait thoughtful artisan workshop",
      "backupVideoQuery": "portrait craftsman talking in studio",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "GREGORY KLOEHN",
        "line2": "NOT CLAIMING TO SOLVE HOMELESSNESS",
        "spokenTrigger": "solution to homelessness",
        "themeColor": "gold"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Clear hero portrait framing Kloehn's frank, unpretentious perspective."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 8,
      "text": "and he tends to correct anyone who tries to frame it that way for him.",
      "visualSubject": "reporter_interviewing_kloehn",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "MEDIA INTERVIEW",
        "subtitle": "PUSHING BACK ON GRAND CLAIMS"
      },
      "clipFilename": null,
      "stockVideoQuery": "journalist with microphone interviewing man workshop",
      "backupVideoQuery": "man speaking earnestly in workshop interview",
      "negativeKeywords": [
        "comedy movie"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Depicting interview setting where he corrects overeager media narratives."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 8,
      "text": "Asked directly whether he sees himself ending the crisis, his answer is blunt.",
      "visualSubject": "kloehn_direct_eye_contact",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE BLUNT RESPONSE",
        "subtitle": "ZERO ILLUSIONS ABOUT POLICY"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "close up portrait serious craftsman looking at camera",
      "backupVideoQuery": "older man portrait thoughtful determined workshop",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Dramatic freeze frame before delivering his famous blunt quote."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 8,
      "text": "It's not like I'm trying to end homelessness.",
      "visualSubject": "kloehn_speaking_in_shop",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn demostrating the home he made by shoing everything what it is like .mp4",
      "stockVideoQuery": "man talking in carpentry workshop with tools",
      "backupVideoQuery": "builder speaking inside wood shop tools",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "IT'S NOT LIKE I'M TRYING TO END HOMELESSNESS.",
        "line2": "GREGORY KLOEHN // BLUNT ADMISSION",
        "spokenTrigger": "not like I'm trying to end homelessness",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "The defining quote callout of the chapter."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 8,
      "text": "What he is doing, by his own accounting, is small.",
      "visualSubject": "solitary_tiny_home_sidewalk",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "MICROSCOPIC SCALE",
        "subtitle": "INDIVIDUAL STRUCTURES FOR SPECIFIC PEOPLE"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "solitary small wooden house sidewalk city curb",
      "backupVideoQuery": "tiny shelter parked on urban street corner",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Humbling visual contrasting macro crisis with micro shelter."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 8,
      "text": "A handful of structures, a slightly more comfortable place for a limited number of people to lay their heads at night.",
      "visualSubject": "peaceful_sleeping_bed_inside",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "A person home inside which has full stuff .mp4",
      "stockVideoQuery": "warm bed mattress cozy small room morning light",
      "backupVideoQuery": "neatly made bed small shelter interior",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "MODEST REALITY",
        "line2": "A SAFE PLACE TO SLEEP TONIGHT",
        "spokenTrigger": "lay their heads at night",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic local video showing the cozy bed and personal possessions."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 8,
      "text": "He does not carry the illusion that plywood and salvaged bed frames add up to housing policy,",
      "visualSubject": "city_hall_council_chamber",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "POLICY VS PLYWOOD",
        "subtitle": "SCRAP TIMBER IS NOT A MUNICIPAL MASTERPLAN"
      },
      "clipFilename": null,
      "stockVideoQuery": "city council meeting hearing empty podium chamber",
      "backupVideoQuery": "government building hearing room microphone",
      "negativeKeywords": [
        "school classroom"
      ],
      "callout": {
        "type": "redacted_dossier",
        "line1": "NOT HOUSING POLICY",
        "line2": "PLYWOOD DOES NOT EQUAL LEGISLATION",
        "spokenTrigger": "housing policy",
        "themeColor": "slate"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Intellectual honesty distinguishing direct aid from legislative policy."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 8,
      "text": "and he is quick to say so whenever a reporter tries to inflate the story past what it actually is.",
      "visualSubject": "television_camera_lens_interview",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "MEDIA SENSATIONALISM",
        "subtitle": "INFLATING HERO NARRATIVES"
      },
      "clipFilename": null,
      "stockVideoQuery": "television broadcast studio camera lens recording light",
      "backupVideoQuery": "news reporter camera zoom lens street",
      "negativeKeywords": [
        "sports stadium"
      ],
      "callout": null,
      "overlay": "vintage_crt_scanlines",
      "transition": "zoom_punch",
      "reason": "Visualizing the media's tendency to construct superhero savior tropes."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 8,
      "text": "But there is a second layer underneath the modesty, one that has less to do with his own project and more to do with the country it is happening in.",
      "visualSubject": "american_flag_city_skyline_industrial",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "american flag waving wind city skyline sunset urban",
      "backupVideoQuery": "flag waving industrial harbor city backdrop",
      "negativeKeywords": [
        "parade party"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Broader sociological cut zooming out to systemic American contradictions."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 8,
      "text": "In an interview filmed in his shop, he talked about the contradictions sitting underneath the whole thing.",
      "visualSubject": "kloehn_reflective_interview_shop",
      "mediaType": "image",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE SOCIAL CONTRADICTION",
        "subtitle": "EXTREME WEALTH BESIDE EXTREME DESTITUTION"
      },
      "clipFilename": "Kloehn sittiing in the home he made.jpg",
      "stockVideoQuery": "man sitting in workshop talking reflecting",
      "backupVideoQuery": "sculptor artist in messy studio thinking",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic local photo of Kloehn seated inside his build."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 8,
      "text": "A society wealthy enough to produce yachts, private airplanes, and homes the size of city blocks,",
      "visualSubject": "luxury_yacht_and_mansion",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "CONCENTRATED WEALTH",
        "subtitle": "SUPER YACHTS • PRIVATE JETS • MEGAMANSIONS"
      },
      "clipFilename": null,
      "stockVideoQuery": "luxury superyacht marina sunset private jet tarmac",
      "backupVideoQuery": "aerial view modern luxury mansion swimming pool",
      "negativeKeywords": [
        "rundown neighborhood"
      ],
      "callout": {
        "type": "stat_callout",
        "line1": "EXTREME WEALTH",
        "line2": "BILLIONS CONCENTRATED IN THE BAY AREA",
        "spokenTrigger": "yachts, private airplanes",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Visceral imagery of billionaire wealth in Northern California."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 8,
      "text": "and still has people sleeping outside within walking distance of all of it.",
      "visualSubject": "homeless_person_sidewalk_cold",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "homeless person sleeping on sidewalk wrapped in blanket cold",
      "backupVideoQuery": "poverty street city sidewalk person sleeping rough",
      "negativeKeywords": [
        "luxury bed hotel"
      ],
      "callout": {
        "type": "editorial_quote",
        "line1": "SLEEPING OUTSIDE WITHIN WALKING DISTANCE.",
        "line2": "THE AMERICAN PARADOX",
        "spokenTrigger": "sleeping outside within walking distance",
        "themeColor": "crimson"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Gut-wrenching visual juxtaposition of severe poverty beside extreme wealth."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 8,
      "text": "He framed it not as any single person's personal failure, but as something closer to a collective one.",
      "visualSubject": "city_commuters_shadows_walking",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "COLLECTIVE RESPONSIBILITY",
        "subtitle": "SYSTEMIC FAILURE OVER PERSONAL BLAME"
      },
      "clipFilename": null,
      "stockVideoQuery": "crowd of city commuters walking evening long shadows",
      "backupVideoQuery": "pedestrians crossing street crosswalk urban sunset",
      "negativeKeywords": [
        "celebration party"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Long shadows of urban crowds reflecting shared societal responsibility."
    },
    {
      "beatIndex": 13,
      "chapterIndex": 8,
      "text": "A signal that a society this resourced ought to be capable of doing better by the people at the very bottom of it,",
      "visualSubject": "city_skyline_dusk_skyscrapers",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "san francisco oakland bay skyline dusk illuminated towers",
      "backupVideoQuery": "city skyline financial district evening lights",
      "negativeKeywords": [
        "beach resort"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "RESOURCE PARADOX",
        "line2": "CAPABLE OF SHELTERING EVERYONE",
        "spokenTrigger": "society this resourced",
        "themeColor": "cyan"
      },
      "overlay": "cinematic_vignette",
      "transition": "cut",
      "reason": "Gleaming tech city skyline emphasizing available resources."
    },
    {
      "beatIndex": 14,
      "chapterIndex": 8,
      "text": "and that doing so would likely make life better for everyone else standing above them too.",
      "visualSubject": "people_connected_community_smiles",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "MUTUAL BENEFIT",
        "subtitle": "DIGNITY AT THE BASE ELEVATES ALL"
      },
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "diverse people talking smiling community urban",
      "backupVideoQuery": "warm handshake neighbors smiling outdoor street",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic footage showing community connection lifting everyone up."
    },
    {
      "beatIndex": 15,
      "chapterIndex": 8,
      "text": "None of that idealism stops him from being clear-eyed about the limits of what a single house built from a bed frame or a dumpster can actually accomplish.",
      "visualSubject": "kloehn_adjusting_wheel_candid",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "CLEAR-EYED PRAGMATISM",
        "subtitle": "RECOGNIZING STRUCTURAL LIMITS"
      },
      "clipFilename": "Kloehn adjusting the home.jpg",
      "stockVideoQuery": "mechanic builder tightening bolts on wheel cart",
      "backupVideoQuery": "installing wheels on heavy timber frame",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "shutter_flash",
      "reason": "Authentic local photo of Kloehn inspecting the wheels with realistic stoicism."
    },
    {
      "beatIndex": 16,
      "chapterIndex": 8,
      "text": "He has talked about the particular sting of watching a home he built end up not far from where it started,",
      "visualSubject": "abandoned_empty_sidewalk_space",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "empty city sidewalk litter blowing chain link fence",
      "backupVideoQuery": "deserted street corner urban overcast",
      "negativeKeywords": [
        "crowded festival"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "THE STING",
        "line2": "WHEN HOMES DISAPPEAR OR GET STRIPPED",
        "spokenTrigger": "particular sting of watching",
        "themeColor": "crimson"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Desolate street shot conveying the heartbreaking fragility of street life."
    },
    {
      "beatIndex": 17,
      "chapterIndex": 8,
      "text": "sometimes reclaimed by its resident and carried somewhere new,",
      "visualSubject": "resident_pushing_rolling_home",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "MIGRATORY SURVIVAL",
        "subtitle": "RELOCATING TO NEW SIDEWALKS"
      },
      "clipFilename": "Kloehn showing the homme .mp4",
      "stockVideoQuery": "person pushing mobile cart on sidewalk sunny day",
      "backupVideoQuery": "pushing wheeled cart down urban sidewalk",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic video showing the mobile home being towed to a safer street."
    },
    {
      "beatIndex": 18,
      "chapterIndex": 8,
      "text": "sometimes moved along by a city sweep, sometimes simply gone, stripped for scrap or towed before anyone could stop it.",
      "visualSubject": "tow_truck_flatbed_debris",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "CONFISCATION & SCRAP",
        "subtitle": "STOLEN, STRIPPED OR IMPOUNDED"
      },
      "clipFilename": null,
      "stockVideoQuery": "flatbed tow truck moving down urban street industrial",
      "backupVideoQuery": "scrapyard crane crushing scrap metal debris",
      "negativeKeywords": [
        "new car delivery"
      ],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "VULNERABILITY",
        "line2": "TOWED • CONFISCATED • STRIPPED FOR SCRAP",
        "spokenTrigger": "stripped for scrap or towed",
        "themeColor": "slate"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "zoom_punch",
      "reason": "Somber reality check: shelters destroyed by municipal sweeps."
    },
    {
      "beatIndex": 19,
      "chapterIndex": 8,
      "text": "He does not expect every structure to have a long stable life once it leaves his studio. Some of them barely make it a few blocks.",
      "visualSubject": "sidewalk_asphalt_shadows_sunset",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "empty urban street dusk dark shadows pavement",
      "backupVideoQuery": "street light flickering dusk city sidewalk",
      "negativeKeywords": [
        "party"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Melancholy evening scene acknowledging impermanence."
    },
    {
      "beatIndex": 20,
      "chapterIndex": 8,
      "text": "What he keeps returning to, more than outcomes or statistics, is something smaller and harder to measure, the relationships.",
      "visualSubject": "kloehn_and_resident_talking_warmly",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE TRUE OUTCOME",
        "subtitle": "HUMAN RELATIONSHIPS OVER METRICS"
      },
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "two people talking warmly outside urban street",
      "backupVideoQuery": "friendly conversation on city sidewalk daylight",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "SOMETHING HARDER TO MEASURE: RELATIONSHIPS.",
        "line2": "AUTHENTIC NEIGHBORHOOD BONDS",
        "spokenTrigger": "harder to measure, the relationships",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Authentic video capturing genuine warmth between builder and resident."
    },
    {
      "beatIndex": 21,
      "chapterIndex": 8,
      "text": "Building these houses puts him in the same driveway, the same stretch of sidewalk, as the people he is building for,",
      "visualSubject": "kloehn_working_on_sidewalk_driveway",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "builder working outside driveway measuring timber",
      "backupVideoQuery": "man cutting wood outside workshop driveway",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Authentic footage of Kloehn building right out in the shared neighborhood driveway."
    },
    {
      "beatIndex": 22,
      "chapterIndex": 8,
      "text": "not once, but again and again, over months and years.",
      "visualSubject": "seasons_changing_oakland_street",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "LONG-TERM COMMITMENT",
        "subtitle": "YEARS OF CONTINUOUS PRESENCE"
      },
      "stockVideoQuery": "timelapse city street clouds moving urban traffic daylight",
      "backupVideoQuery": "city street corner daytime timelapse clouds",
      "negativeKeywords": [
        "snow mountains"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "10+ YEARS",
        "line2": "CONTINUOUS GRASSROOTS BUILDING",
        "spokenTrigger": "over months and years",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "zoom_punch",
      "reason": "Timelapse reflecting dedicated years on the same block."
    },
    {
      "beatIndex": 23,
      "chapterIndex": 8,
      "text": "Asked why he keeps doing it, his answer circles back to exactly that.",
      "visualSubject": "kloehn_smiling_candid_portrait",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "WHY HE KEEPS GOING",
        "subtitle": "BRINGING PEOPLE TOGETHER"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "smiling older man craftsman genuine expression",
      "backupVideoQuery": "friendly portrait builder in flannel shirt",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Hero portrait of Gregory smiling with quiet conviction."
    },
    {
      "beatIndex": 24,
      "chapterIndex": 8,
      "text": "He has said it does feel good to bring people together",
      "visualSubject": "volunteers_celebrating_finished_build",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "COMMUNITY SOLIDARITY",
        "subtitle": "FEELING GOOD ABOUT DIRECT AID"
      },
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "group of builders high five smiling finished project",
      "backupVideoQuery": "celebrating successful community build teamwork",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic video showing smiling volunteers and residents sharing food and laughs."
    },
    {
      "beatIndex": 25,
      "chapterIndex": 8,
      "text": "and that the people he is building for are, plainly, exactly that.",
      "visualSubject": "resident_smiling_warm_eyes",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "warm portrait smiling person relieved happy",
      "backupVideoQuery": "candid smiling face gratitude outdoor daylight",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "cut",
      "reason": "Authentic close-up of recipient looking directly at the camera with dignity."
    },
    {
      "beatIndex": 26,
      "chapterIndex": 8,
      "text": "People, not a category, not a statistic on a city report.",
      "visualSubject": "people_not_a_statistic",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "BEYOND STATISTICS",
        "subtitle": "HUMAN BEINGS WITH FACES, NAMES & STORIES"
      },
      "clipFilename": "Kloehn sittiing in the home he made.jpg",
      "stockVideoQuery": "close up eyes face emotion human dignity portrait",
      "backupVideoQuery": "candid urban portrait authentic human expression",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "PEOPLE. NOT A CATEGORY. NOT A STATISTIC.",
        "line2": "THE CORE HUMAN TRUTH",
        "spokenTrigger": "People, not a category",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "film_dip_black",
      "reason": "Monumental quote callout closing Chapter 8 on profound human empathy."
    }
  ],
  "9": [
    {
      "beatIndex": 0,
      "chapterIndex": 9,
      "text": "Not everyone looking at these structures sees what Kloehn sees.",
      "visualSubject": "critics_gaze_city_hall_stairs",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE SKEPTICS",
        "subtitle": "POLICY DEBATE OVER TEMPORARY HOUSING"
      },
      "clipFilename": null,
      "stockVideoQuery": "city hall government building steps silhouette pedestrians",
      "backupVideoQuery": "formal government hearing room lawyers debating",
      "negativeKeywords": [
        "beach vacation"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "THE CRITIQUE",
        "line2": "HOUSING ADVOCATES & URBAN PLANNERS",
        "spokenTrigger": "sees what Kloehn sees",
        "themeColor": "crimson"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Introducing the intense policy debate surrounding unpermitted micro-structures."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 9,
      "text": "Housing advocates have pushed back on projects like this one for years, and the argument is not unreasonable.",
      "visualSubject": "advocate_speech_podium_microphone",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "THE ADVOCATE POSITION",
        "subtitle": "DEMANDING SYSTEMIC, PERMANENT HOUSING"
      },
      "clipFilename": null,
      "stockVideoQuery": "speaker at microphone press conference outdoor podium",
      "backupVideoQuery": "activist speaking at community meeting room",
      "negativeKeywords": [
        "standup comedy"
      ],
      "callout": {
        "type": "redacted_dossier",
        "line1": "ADVOCATE CONCERN",
        "line2": "IS DIRECT AID A DANGEROUS DISTRACTION?",
        "spokenTrigger": "Housing advocates have pushed back",
        "themeColor": "slate"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Legitimizing the systemic housing advocate argument with nuance."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 9,
      "text": "A converted bed frame or a repurposed dumpster is not housing in any legal sense.",
      "visualSubject": "municipal_code_regulations_paper",
      "mediaType": "image",
      "layout": "forensic_drafting_table",
      "layoutData": {
        "title": "CALIFORNIA BUILDING CODE",
        "subtitle": "TITLE 24 STATUTORY RESIDENTIAL REQUIREMENTS"
      },
      "clipFilename": "Plan , blueprint of dumpster home.jpg",
      "stockVideoQuery": "stack of building blueprints legal documents desk",
      "backupVideoQuery": "reading architectural plans paperwork desk",
      "negativeKeywords": [],
      "callout": {
        "type": "archival_evidence_tag",
        "line1": "LEGAL DEFINITION",
        "line2": "NOT HOUSING UNDER TITLE 24 CODE",
        "spokenTrigger": "not housing in any legal sense",
        "themeColor": "amber"
      },
      "overlay": "archival_halftone_paper",
      "transition": "zoom_punch",
      "reason": "Forensic blueprint layout illustrating the strict legal code gap."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 9,
      "text": "No plumbing, no permanent foundation, no address a resident can use to open a bank account or sign a lease down the line.",
      "visualSubject": "missing_amenities_checklist",
      "mediaType": "image",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "LEGAL CRITERIA DEFICIT",
        "subtitle": "NO PLUMBING • NO MAILING ADDRESS • NO FOUNDATION"
      },
      "clipFilename": "inside the dumpster home.jpg",
      "stockVideoQuery": "vintage plumbing water pipes faucet dripping",
      "backupVideoQuery": "old water pipe shutoff valve concrete wall",
      "negativeKeywords": [],
      "callout": {
        "type": "court_transcript_card",
        "line1": "STATUTORY DEFICIENCIES",
        "line2": "NO PLUMBING • NO PERMANENT FOUNDATION • NO ADDRESS",
        "spokenTrigger": "No plumbing, no permanent foundation",
        "themeColor": "crimson"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Court transcript callout breaking down the absent statutory amenities."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 9,
      "text": "Critics worry that celebrating a $40 structure lets a city off the hook for building the affordable, permanent housing that actually ends someone's homelessness,",
      "visualSubject": "new_affordable_housing_development",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "modern apartment building construction affordable housing",
      "backupVideoQuery": "new multi family housing development exterior city",
      "negativeKeywords": [
        "luxury penthouse pool"
      ],
      "callout": {
        "type": "stat_callout",
        "line1": "$800,000 / UNIT",
        "line2": "AVERAGE COST OF PERMANENT BAY AREA AFFORDABLE HOUSING",
        "spokenTrigger": "lets a city off the hook",
        "themeColor": "crimson"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Contrasting $40 scrap houses with $800k permanent subsidized housing."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 9,
      "text": "rather than simply making a rough night marginally more survivable.",
      "visualSubject": "rainy_street_sidewalk_night",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "SURVIVAL VS PERMANENCE",
        "subtitle": "ONE ROUGH NIGHT AT A TIME"
      },
      "clipFilename": null,
      "stockVideoQuery": "rain falling city pavement street night streetlights reflections",
      "backupVideoQuery": "wet sidewalk night rainstorm city street",
      "negativeKeywords": [
        "sunny day"
      ],
      "callout": null,
      "overlay": "rain_lens_streaks",
      "transition": "crossfade",
      "reason": "Rain streaks overlay conveying cold, gritty survival realities."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 9,
      "text": "Kloehn does not argue with the substance of that critique, so much as he sidesteps it.",
      "visualSubject": "kloehn_thoughtful_sidestep",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "SIDESTEPPING THE DEBATE",
        "subtitle": "REFUSING TO ENGAGE IN BUREAUCRATIC ABSTRACTS"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "man shrugging smiling thoughtful interview",
      "backupVideoQuery": "portrait artisan gesturing thoughtfully",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "shutter_flash",
      "reason": "Hero portrait highlighting Kloehn's pragmatic detachment from debate."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 9,
      "text": "He has never claimed to be building permanent housing,",
      "visualSubject": "mobile_home_rolling_on_street",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn showing the homme .mp4",
      "stockVideoQuery": "small house on wheels moving along city street",
      "backupVideoQuery": "tiny mobile structure rolling down asphalt",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "TEMPORARY RELIEF",
        "line2": "NOT PERMANENT HOUSING",
        "spokenTrigger": "building permanent housing",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Authentic video of Gregory demonstrating the rolling temporary structure."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 9,
      "text": "and he tends to agree, in his own way, that the real fix has to come from somewhere much larger than one workshop in West Oakland.",
      "visualSubject": "capitol_building_dome_distance",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "THE BROADER FIX",
        "subtitle": "STATE & FEDERAL POLICY SCALE"
      },
      "stockVideoQuery": "state capitol dome architectural columns government city",
      "backupVideoQuery": "city hall rotunda interior government marble",
      "negativeKeywords": [
        "circus"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "zoom_punch",
      "reason": "Acknowledging that permanent solutions belong in the halls of power."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 9,
      "text": "What he keeps coming back to is the timeline.",
      "visualSubject": "ticking_clock_stopwatch_macro",
      "mediaType": "video",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE DIVERGENT TIMELINES",
        "subtitle": "YEARS FOR THE SYSTEM • HOURS FOR THE STREET"
      },
      "clipFilename": null,
      "stockVideoQuery": "vintage pocket watch ticking macro clock face seconds",
      "backupVideoQuery": "clock hands moving fast timelapse wall",
      "negativeKeywords": [
        "digital alarm phone"
      ],
      "callout": {
        "type": "odometer_stat",
        "line1": "THE TIMELINE GAP",
        "line2": "5 YEARS TO PERMIT VS 1 DAY TO FREEZE",
        "spokenTrigger": "coming back to is the timeline",
        "themeColor": "crimson"
      },
      "overlay": "vintage_crt_scanlines",
      "transition": "film_burn",
      "reason": "Dramatic clock macro illustrating the core timeline conflict."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 9,
      "text": "A permanent housing unit, funded, approved, and built through the normal channels, can take years to materialize.",
      "visualSubject": "construction_barrier_planning_notice",
      "mediaType": "video",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "MUNICIPAL TIMELINE",
        "subtitle": "ENVIRONMENTAL REVIEWS • BOND MEASURES • ZONING"
      },
      "clipFilename": null,
      "stockVideoQuery": "zoning permit sign fence construction site slow progress",
      "backupVideoQuery": "empty construction lot dirt weeds chain link fence",
      "negativeKeywords": [
        "busy party"
      ],
      "callout": {
        "type": "newspaper_headline",
        "line1": "PERMITTING GRIDLOCK",
        "line2": "AVERAGE AFFORDABLE HOUSING TIMELINE: 4.8 YEARS",
        "spokenTrigger": "can take years to materialize",
        "themeColor": "crimson"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Newspaper callout documenting the multi-year bureaucratic timeline."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 9,
      "text": "The person sleeping outside tonight does not have years. They have tonight.",
      "visualSubject": "person_shivering_sidewalk_night",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "IMMEDIATE NEED",
        "subtitle": "THE COLD DOES NOT WAIT FOR APPROVAL"
      },
      "clipFilename": null,
      "stockVideoQuery": "person wrapped in wet blanket shivering sidewalk cold rain",
      "backupVideoQuery": "homeless person sidewalk night cold breath streetlamp",
      "negativeKeywords": [
        "warm beach"
      ],
      "callout": {
        "type": "editorial_quote",
        "line1": "THEY DO NOT HAVE YEARS. THEY HAVE TONIGHT.",
        "line2": "THE URGENCY OF SURVIVAL",
        "spokenTrigger": "They have tonight",
        "themeColor": "gold"
      },
      "overlay": "rain_lens_streaks",
      "transition": "film_dip_black",
      "reason": "Heart-stopping quote callout stating the incontrovertible truth."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 9,
      "text": "A $40 structure will not solve a housing crisis.",
      "visualSubject": "tiny_home_exterior_humble",
      "mediaType": "image",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "humble small wooden structure sidewalk daylight",
      "backupVideoQuery": "tiny cabin on wheels street curb morning",
      "negativeKeywords": [],
      "callout": {
        "type": "stat_callout",
        "line1": "$40 WILL NOT SOLVE IT",
        "line2": "NOT A CURE FOR SYSTEMIC INACTION",
        "spokenTrigger": "not solve a housing crisis",
        "themeColor": "slate"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Clear-eyed admission that scrap wood cannot fix systemic policy."
    },
    {
      "beatIndex": 13,
      "chapterIndex": 9,
      "text": "It will, however, get one specific person out of the rain by Saturday evening,",
      "visualSubject": "recipient_smiling_in_dry_shelter",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "OUT OF THE RAIN",
        "subtitle": "SATURDAY SUNSET • DIRECT PROTECTION"
      },
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "person smiling warmly inside dry cozy shelter",
      "backupVideoQuery": "relief smiling face warm indoor shelter",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "DIRECT HUMAN BENEFIT",
        "line2": "ONE HUMAN BEING SAFE BEFORE SUNDAY",
        "spokenTrigger": "out of the rain by Saturday evening",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "zoom_punch",
      "reason": "Authentic video showing recipient warm, dry, and sheltered."
    },
    {
      "beatIndex": 14,
      "chapterIndex": 9,
      "text": "and Kloehn has made peace with the fact that those are two different problems requiring two very different timelines.",
      "visualSubject": "kloehn_working_tools_serene",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "craftsman quietly working with hand plane wood",
      "backupVideoQuery": "carpenter hands measuring wood calm workshop",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Authentic local video of Gregory at peace with his work."
    },
    {
      "beatIndex": 15,
      "chapterIndex": 9,
      "text": "It is not a fully satisfying answer to the people who want systemic change, and Kloehn does not pretend it is. But it is an honest one, and it is the only one he has ever offered.",
      "visualSubject": "kloehn_sitting_inside_contemplative",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "AN HONEST ANSWER",
        "subtitle": "THE ONLY ONE HE HAS EVER OFFERED"
      },
      "clipFilename": "Kloehn sittiing in the home he made.jpg",
      "stockVideoQuery": "man sitting quietly looking out window small room",
      "backupVideoQuery": "contemplative moment artisan sitting wooden cabin",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "IT IS AN HONEST ANSWER.",
        "line2": "AND THE ONLY ONE HE HAS EVER OFFERED",
        "spokenTrigger": "only one he has ever offered",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Hero portrait of Gregory sitting inside his creation, concluding Chapter 9."
    }
  ],
  "10": [
    {
      "beatIndex": 0,
      "chapterIndex": 10,
      "text": "By the time Kloehn had built roughly 10 homes and was actively scaling up the operation,",
      "visualSubject": "lineup_of_completed_tiny_homes",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "SCALING UP",
        "subtitle": "10+ HOMES BUILT IN WEST OAKLAND"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "row of colorful handmade wooden structures",
      "backupVideoQuery": "tiny houses parked outside workshop yard",
      "negativeKeywords": [],
      "callout": {
        "type": "odometer_stat",
        "line1": "10+ HOMES BUILT",
        "line2": "EXPANDING BEYOND OAKLAND",
        "spokenTrigger": "built roughly 10 homes",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Milestone odometer callout celebrating the first 10 homes."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 10,
      "text": "Word had already started to travel well past Oakland.",
      "visualSubject": "world_map_network_lines",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "global map network connections glowing lines travel",
      "backupVideoQuery": "spinning globe network travel lines flight paths",
      "negativeKeywords": [
        "dark war zone"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Graphic visual of interest rippling across the globe."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 10,
      "text": "Invitations arrived from Portland, from Boston, from as far away as South Africa,",
      "visualSubject": "international_invitations_map",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "GLOBAL INVITATIONS",
        "subtitle": "PORTLAND • BOSTON • SOUTH AFRICA"
      },
      "clipFilename": null,
      "stockVideoQuery": "airplane flying through clouds international flight",
      "backupVideoQuery": "world travel passport stamps boarding pass",
      "negativeKeywords": [
        "beach holiday"
      ],
      "callout": {
        "type": "map_pingeotag",
        "line1": "GLOBAL INVITATIONS",
        "line2": "PORTLAND • BOSTON • SOUTH AFRICA",
        "spokenTrigger": "Portland, from Boston",
        "themeColor": "cyan"
      },
      "overlay": "cinematic_vignette",
      "transition": "zoom_punch",
      "reason": "Map callout tracing invitations from across North America and Africa."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 10,
      "text": "each one asking him to run a workshop and teach the same basic method to a new set of volunteers.",
      "visualSubject": "teaching_volunteers_tools",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "instructor teaching student how to use drill wood",
      "backupVideoQuery": "hands demonstrating power drill carpentry lesson",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "WORKSHOP TOUR",
        "line2": "TEACHING VOLUNTEERS FOUND-OBJECT FABRICATION",
        "spokenTrigger": "run a workshop and teach",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Authentic local footage of Gregory teaching volunteers how to build."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 10,
      "text": "Find the material first, let it dictate the shape,",
      "visualSubject": "kloehn_framing_wood_demonstrating",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE CORE METHOD",
        "subtitle": "SCAVENGE FIRST • DICTATE SHAPE SECOND"
      },
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "carpenter framing wall studs with speed square",
      "backupVideoQuery": "builder holding lumber framing structure",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "FIND THE MATERIAL FIRST.",
        "line2": "LET IT DICTATE THE SHAPE",
        "spokenTrigger": "Find the material first",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Authentic footage driving home the foundational rule of the project."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 10,
      "text": "keep the cost as close to zero as the dump sites will allow.",
      "visualSubject": "zero_cost_fasteners_tools",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "BUDGET TARGET",
        "subtitle": "ZERO-DOLLAR RAW MATERIAL CEILING"
      },
      "clipFilename": "Kloehn adjusting the home.jpg",
      "stockVideoQuery": "box of used screws bolts nails sorting hands",
      "backupVideoQuery": "hands picking through assorted nuts and bolts",
      "negativeKeywords": [],
      "callout": {
        "type": "odometer_stat",
        "line1": "$0 MATERIAL TARGET",
        "line2": "AS CLOSE TO ZERO AS POSSIBLE",
        "spokenTrigger": "close to zero as the dump sites will allow",
        "themeColor": "emerald"
      },
      "overlay": "micro_film_grain",
      "transition": "shutter_flash",
      "reason": "Authentic photo showing the frugality of the assembly."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 10,
      "text": "His own studio was outgrowing itself",
      "visualSubject": "bustling_cramped_studio_workshop",
      "mediaType": "video",
      "layout": "vintage_crt_monitor",
      "layoutData": {
        "title": "CAPACITY LIMIT",
        "subtitle": "ORIGINAL WEST OAKLAND STUDIO OVERFLOWING"
      },
      "clipFilename": "people helping to buildi home with Kloehn.mp4",
      "stockVideoQuery": "busy packed workshop artists builders working",
      "backupVideoQuery": "crowded industrial studio sawdust tools",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "vintage_crt_scanlines",
      "transition": "cut",
      "reason": "Authentic footage showing the busy, packed workshop humming with life."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 10,
      "text": "and plans were underway to move into a larger workspace at American Steel Studios in West Oakland,",
      "visualSubject": "american_steel_studios_exterior",
      "mediaType": "video",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "AMERICAN STEEL STUDIOS",
        "subtitle": "6-ACRE ARTIST INDUSTRIAL COMPLEX • WEST OAKLAND"
      },
      "clipFilename": null,
      "stockVideoQuery": "huge industrial steel warehouse building exterior red brick",
      "backupVideoQuery": "massive factory industrial building exterior metal warehouse",
      "negativeKeywords": [
        "suburban house"
      ],
      "callout": {
        "type": "map_pingeotag",
        "line1": "AMERICAN STEEL STUDIOS",
        "line2": "HISTORIC WEST OAKLAND INDUSTRIAL HUB",
        "spokenTrigger": "American Steel Studios",
        "themeColor": "amber"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Historic 6-acre American Steel Studios facility visual."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 10,
      "text": "a shift that would let him take on more volunteers, source more material, and build more houses in the same amount of time.",
      "visualSubject": "spacious_industrial_warehouse_volunteers",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "spacious industrial workshop artists working high ceilings sunlight",
      "backupVideoQuery": "makerspace warehouse large studio artists collaborating",
      "negativeKeywords": [
        "empty abandoned dirty"
      ],
      "callout": {
        "type": "stat_callout",
        "line1": "PRODUCTION EXPANSION",
        "line2": "MORE VOLUNTEERS • MORE SCRAP • MORE HOMES",
        "spokenTrigger": "build more houses",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Vision of high-volume community fabrication."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 10,
      "text": "None of that growth changed the basic unit of the work,",
      "visualSubject": "kloehn_framing_with_hands",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Kloehn buillding the home .mp4",
      "stockVideoQuery": "carpenter aligning two 2x4 studs with bare hands",
      "backupVideoQuery": "hands assembling wooden timber joint workshop",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Authentic footage showing the fundamental core remains simple hands-on making."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 10,
      "text": "which has stayed exactly the same since the $40 structure he built for himself the very first time.",
      "visualSubject": "kloehn_portrait_authentic_roots",
      "mediaType": "image",
      "layout": "editorial_sidebar_column",
      "layoutData": {
        "title": "UNWAVERING FOCUS",
        "subtitle": "THE 40-DOLLAR REPEATABLE ATOM"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "authentic portrait older builder grey beard flannel",
      "backupVideoQuery": "weathered hands holding carpenter pencil workshop",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "THE ORIGINAL ATOM",
        "line2": "UNCHANGED SINCE THE FIRST $40 BUILD",
        "spokenTrigger": "structure he built for himself",
        "themeColor": "gold"
      },
      "overlay": "archival_halftone_paper",
      "transition": "crossfade",
      "reason": "Clear hero portrait of Gregory anchoring the moral center of the story."
    },
    {
      "beatIndex": 11,
      "chapterIndex": 10,
      "text": "One resident, one pile of scavenged material,",
      "visualSubject": "single_pile_salvaged_timber",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "THE EQUATION",
        "subtitle": "1 RESIDENT + 1 SCRAP PILE + 1 WEEKEND"
      },
      "clipFilename": null,
      "stockVideoQuery": "neat stack of reclaimed timber boards sunlight workshop",
      "backupVideoQuery": "wood planks stacked outdoor yard",
      "negativeKeywords": [
        "messy trash"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Clean poetic visual isolating the singular pile of wood."
    },
    {
      "beatIndex": 12,
      "chapterIndex": 10,
      "text": "one weekend, give or take, to turn somebody's garbage into somebody else's front door.",
      "visualSubject": "recipient_opening_front_door_smiling",
      "mediaType": "video",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE TRANSFORMATION",
        "subtitle": "GARBAGE INTO SOMEBODY ELSE'S FRONT DOOR"
      },
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "person opening small wooden door welcoming smile",
      "backupVideoQuery": "hand turning key unlocking front door daylight",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "SOMEBODY'S GARBAGE INTO SOMEBODY ELSE'S FRONT DOOR.",
        "line2": "THE ESSENCE OF THE WORK",
        "spokenTrigger": "somebody else's front door",
        "themeColor": "gold"
      },
      "overlay": "film_burn_light_leak",
      "transition": "film_dip_black",
      "reason": "Authentic footage delivering the triumphant concluding quote of Chapter 10."
    }
  ],
  "11": [
    {
      "beatIndex": 0,
      "chapterIndex": 11,
      "text": "Back near the Alliance Recycling Center, the woman with the shopping cart finishes weighing in her cans",
      "visualSubject": "recycling_window_scale_checkout",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "RETURNING TO THE START",
        "subtitle": "ALLIANCE RECYCLING CENTER SCALE WINDOW"
      },
      "clipFilename": null,
      "stockVideoQuery": "recycling center cashier window weighing cans receipt",
      "backupVideoQuery": "industrial scale window metal recycling cash exchange",
      "negativeKeywords": [
        "bank teller luxury"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "CLOSING THE CIRCLE",
        "line2": "ALLIANCE RECYCLING CENTER",
        "spokenTrigger": "Alliance Recycling Center",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "film_burn",
      "reason": "Returning full circle to the very location where Chapter 1 opened."
    },
    {
      "beatIndex": 1,
      "chapterIndex": 11,
      "text": "and starts the walk back toward her house made of bed frames.",
      "visualSubject": "woman_walking_home_sidewalk",
      "mediaType": "image",
      "layout": "split_dual_screen",
      "layoutData": {
        "title": "WALKING HOME",
        "subtitle": "RETURNING TO HER OWN FRONT DOOR"
      },
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "woman walking down city sidewalk daylight peaceful",
      "backupVideoQuery": "elderly pedestrian walking sidewalk sunny day",
      "negativeKeywords": [
        "busy mall"
      ],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "zoom_punch",
      "reason": "Authentic local photo of the bed-frame house waiting on the sidewalk."
    },
    {
      "beatIndex": 2,
      "chapterIndex": 11,
      "text": "It is not much, by almost any measure a city planner would use to define housing.",
      "visualSubject": "compact_bed_frame_structure_exterior",
      "mediaType": "image",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "colorful small wooden micro home street curb",
      "backupVideoQuery": "compact mobile wooden shelter exterior",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "NOT MUCH BY POLICY METRICS",
        "line2": "YET EVERYTHING TO ITS OCCUPANT",
        "spokenTrigger": "measure a city planner would use",
        "themeColor": "slate"
      },
      "overlay": "micro_film_grain",
      "transition": "cut",
      "reason": "Hero beauty shot acknowledging the structural simplicity."
    },
    {
      "beatIndex": 3,
      "chapterIndex": 11,
      "text": "No plumbing, no permanent foundation, no address she could put on a job application,",
      "visualSubject": "inside_shelter_modest_furnishings",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "BEYOND CODES",
        "subtitle": "NO PLUMBING • NO MAILING ADDRESS"
      },
      "clipFilename": "A person home inside which has full stuff .mp4",
      "stockVideoQuery": "interior tiny room tidy shelf book mattress",
      "backupVideoQuery": "organized small camper living space interior",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Authentic local video showing the interior living quarters."
    },
    {
      "beatIndex": 4,
      "chapterIndex": 11,
      "text": "but it has a door and the door has a lock,",
      "visualSubject": "brass_lock_turning_door",
      "mediaType": "video",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE ESSENTIAL LOCK",
        "subtitle": "AUTONOMY, DIGNITY AND SECURITY"
      },
      "clipFilename": null,
      "stockVideoQuery": "hand inserting brass key into padlock turning lock door",
      "backupVideoQuery": "locking wooden door latch close up",
      "negativeKeywords": [
        "digital keypad"
      ],
      "callout": {
        "type": "marker_circle",
        "line1": "A DOOR WITH A LOCK",
        "line2": "BOUNDARY BETWEEN SELF AND WORLD",
        "spokenTrigger": "door has a lock",
        "themeColor": "gold"
      },
      "overlay": "micro_film_grain",
      "transition": "zoom_punch",
      "reason": "Close-up macro of the padlock turning in the hasp."
    },
    {
      "beatIndex": 5,
      "chapterIndex": 11,
      "text": "and for the third week in a row, she is the only one who holds the key.",
      "visualSubject": "hand_holding_brass_key",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "SOVEREIGNTY",
        "subtitle": "THE ONLY ONE HOLDING THE KEY"
      },
      "clipFilename": "A person showing home whih is build by Kloehn.mp4",
      "stockVideoQuery": "hand holding brass key giving to another hand",
      "backupVideoQuery": "handing over keys close up handshake",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "SHE IS THE ONLY ONE WHO HOLDS THE KEY.",
        "line2": "THE RESTORATION OF AGENCY",
        "spokenTrigger": "only one who holds the key",
        "themeColor": "emerald"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_burn",
      "reason": "Authentic footage delivering the powerful emotional thesis."
    },
    {
      "beatIndex": 6,
      "chapterIndex": 11,
      "text": "That is the whole project, distilled down to its smallest possible unit.",
      "visualSubject": "kloehn_peaceful_in_shop",
      "mediaType": "image",
      "layout": "hero_graphic_centerpiece",
      "layoutData": {
        "title": "THE ESSENCE",
        "subtitle": "ONE SCULPTOR • ONE DOOR • ONE HUMAN BEING"
      },
      "clipFilename": "Clear picture of Kloehn.jpg",
      "stockVideoQuery": "builder standing in sawdust workshop golden hour",
      "backupVideoQuery": "quiet wood shop sunset light through windows",
      "negativeKeywords": [],
      "callout": null,
      "overlay": "film_burn_light_leak",
      "transition": "shutter_flash",
      "reason": "Clear hero portrait of Gregory embodying the essence of the work."
    },
    {
      "beatIndex": 7,
      "chapterIndex": 11,
      "text": "Not a policy, not a five-year plan, just one sculptor deciding that the material already sitting in the world around him was enough to build somebody a door.",
      "visualSubject": "completed_tiny_house_sunset_oakland",
      "mediaType": "image",
      "layout": "full_bleed_cinematic",
      "clipFilename": "Home from ouside - clear picuture.jpg",
      "stockVideoQuery": "tiny house on sidewalk sunset golden light street",
      "backupVideoQuery": "small wooden cabin urban street dusk warm light",
      "negativeKeywords": [],
      "callout": {
        "type": "editorial_quote",
        "line1": "THE MATERIAL WAS ENOUGH TO BUILD SOMEBODY A DOOR.",
        "line2": "GREGORY KLOEHN // HOMELESS HOMES PROJECT",
        "spokenTrigger": "build somebody a door",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_dip_black",
      "reason": "Monumental beauty shot with final editorial quote."
    },
    {
      "beatIndex": 8,
      "chapterIndex": 11,
      "text": "If this story stuck with you, there are more like it out there,",
      "visualSubject": "city_street_at_dusk_warm_lights",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "city street dusk warm streetlights urban neighborhood peaceful",
      "backupVideoQuery": "quiet city neighborhood street sunset warm glow",
      "negativeKeywords": [
        "crime police"
      ],
      "callout": null,
      "overlay": "micro_film_grain",
      "transition": "crossfade",
      "reason": "Warm twilight urban street signaling broad hidden stories."
    },
    {
      "beatIndex": 9,
      "chapterIndex": 11,
      "text": "quiet, unglamorous fixes that never make it past a local paper, built by people who never set out to become the story in the first place.",
      "visualSubject": "hands_working_woodworking_bench_close",
      "mediaType": "video",
      "layout": "ambient_blur_frame",
      "layoutData": {
        "title": "QUIET, UNGLAMOROUS FIXES",
        "subtitle": "ORDINARY PEOPLE CHANGING IMMEDIATE LIVES"
      },
      "clipFilename": null,
      "stockVideoQuery": "hands carving wood smoothing lumber workshop quiet craftsmanship",
      "backupVideoQuery": "hands using hand plane on wood shavings curling",
      "negativeKeywords": [
        "loud industrial factory"
      ],
      "callout": {
        "type": "editorial_lower_third",
        "line1": "UNSUNG MAKERS",
        "line2": "QUIET FIXES THAT NEVER MAKE HEADLINES",
        "spokenTrigger": "quiet, unglamorous fixes",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "crossfade",
      "reason": "Poetic close-up on hands performing quiet, honest work."
    },
    {
      "beatIndex": 10,
      "chapterIndex": 11,
      "text": "Next time, we go looking for another one.",
      "visualSubject": "fade_to_black_open_road",
      "mediaType": "video",
      "layout": "full_bleed_cinematic",
      "clipFilename": null,
      "stockVideoQuery": "camera moving down open highway road sunset twilight",
      "backupVideoQuery": "car driving down highway into twilight horizon",
      "negativeKeywords": [
        "traffic jam"
      ],
      "callout": {
        "type": "fullscreen_chapter_title",
        "line1": "BLOKETUBER DOCUMENTARY",
        "line2": "STORIES FROM THE AMERICAN EDGES",
        "spokenTrigger": "Next time, we go looking for another one",
        "themeColor": "gold"
      },
      "overlay": "cinematic_vignette",
      "transition": "film_dip_black",
      "reason": "Cinematic sunset road outro with BlokeTuber documentary signoff."
    }
  ]
};
