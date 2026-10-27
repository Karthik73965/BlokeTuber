import json, os, glob

FIXES = {
    ("chapter_01_final.json", 9): {
        "line1": "SALVAGED MATERIALS ONLY",
        "line2": "\"SOMETHING ANOTHER PERSON HAD THROWN AWAY\""
    },
    ("chapter_04_final.json", 0): {
        "line1": "THE CONTAINER STRATEGY",
        "line2": "\"BUY A STEEL BOX AND TURN IT INTO A HOUSE\""
    },
    ("chapter_04_final.json", 3): {
        "line1": "RURAL SKEPTICISM",
        "line2": "\"YOU WILL COOK ALIVE BY JULY\""
    },
    ("chapter_04_final.json", 12): {
        "line1": "BUILD SECRECY",
        "line2": "\"NOT IN ANY HARDWARE STORE\""
    },
    ("chapter_05_final.json", 2): {
        "line1": "DAMAGED CARGO CONTAINERS",
        "line2": "DENTED PANELS & WARPED DOOR FRAMES"
    },
    ("chapter_08_final.json", 7): {
        "line1": "CONDENSATION DAMAGE",
        "line2": "WARM AIR ON COLD STEEL RUINS BUILDS"
    },
    ("chapter_09_final.json", 4): {
        "line1": "RECOVERED SOLAR CAPACITY: 180W",
        "line2": "60% OF 300 WATT PANEL // LIGHTS & FAN"
    },
    ("chapter_09_final.json", 17): {
        "line1": "OUT-OF-POCKET CASH: $162",
        "line2": "FUNDED FROM DOLLAR STORE PAYCHECKS"
    },
    ("chapter_10_final.json", 4): {
        "line1": "THE REAR THIRD",
        "line2": "DEDICATED LIVING SPACE FOR HER SON"
    },
    ("chapter_11_final.json", 9): {
        "line1": "URBAN CONTRAST",
        "line2": "\"EVERY ONE OF THOSE CONDITIONS FLIPS\""
    },
    ("chapter_11_final.json", 11): {
        "line1": "THE HARSH TRUTH",
        "line2": "\"CALLING IT ONLY ONE WOULD BE A LIE\""
    },
    ("chapter_11_final.json", 16): {
        "line1": "INFORMAL LAND HANDSHAKE",
        "line2": "IF HE DIES OR SELLS, HER WALLS STAY BEHIND"
    }
}

TRANSITION_CHOREOGRAPHY = [
    'cut', 'cut', 'whip_pan_left', 'cut', 'cut', 'film_burn',
    'cut', 'shutter_flash', 'cut', 'cut', 'zoom_punch', 'cut', 'whip_pan_right'
]

SFX_MAP = {
    'whip_pan_left': 'uploads/sfx/whoosh_air.mp3',
    'whip_pan_right': 'uploads/sfx/whoosh_air.mp3',
    'film_burn': 'uploads/sfx/whoosh_cinematic.mp3',
    'shutter_flash': 'uploads/sfx/camera_shutter.mp3',
    'zoom_punch': 'uploads/sfx/subtle_hit.mp3',
}

CALLOUT_SFX_MAP = {
    'editorial_lower_third': 'uploads/sfx/paper_slide.mp3',
    'newspaper_headline': 'uploads/sfx/camera_shutter.mp3',
    'odometer_stat': 'uploads/sfx/stat_click.mp3',
    'forensic_data_card': 'uploads/sfx/paper_slide.mp3',
    'police_crime_sheet': 'uploads/sfx/subtle_hit.mp3',
    'redacted_dossier': 'uploads/sfx/paper_slide.mp3',
    'typewriter_paper': 'uploads/sfx/paper_slide.mp3',
}

files = sorted(glob.glob('uploads/timelines/steeldoor/chapter_*.json'))
for f in files:
    fname = os.path.basename(f)
    d = json.load(open(f, 'r', encoding='utf-8'))
    
    for c in d['clips']:
        b_idx = c['beatIndex']
        
        # 1. Apply Callout Verbatim Fixes
        if (fname, b_idx) in FIXES:
            fx = FIXES[(fname, b_idx)]
            c['callout']['line1'] = fx['line1']
            c['callout']['line2'] = fx['line2']
            print(f"Fixed callout in {fname} beat {b_idx}: {fx['line1']} // {fx['line2']}")
            
        # 2. Add Callout Entrance SFX
        if c.get('callout'):
            c_type = c['callout'].get('type', 'editorial_lower_third')
            sfx = CALLOUT_SFX_MAP.get(c_type, 'uploads/sfx/paper_slide.mp3')
            c['callout']['sfxPath'] = sfx
            c['callout']['sfxVolume'] = 0.14
            c['calloutSfxPath'] = sfx
            c['calloutSfxVolume'] = 0.14
            
        # 3. Add Dynamic Transitions & Whooshes every 3 to 4 beats
        # Beat 0 is always cut / fade-in
        if b_idx > 0 and b_idx % 4 == 0:
            pattern_idx = (b_idx // 4) % len(TRANSITION_CHOREOGRAPHY)
            trans = TRANSITION_CHOREOGRAPHY[pattern_idx]
            if trans == 'cut':
                trans = 'whip_pan_left' if b_idx % 2 == 0 else 'film_burn'
            c['transitionType'] = trans
            c['transitionDuration'] = 0.2
            c['sfxPath'] = SFX_MAP.get(trans, 'uploads/sfx/whoosh_air.mp3')
            c['sfxVolume'] = 0.18
        elif b_idx > 0 and c.get('callout') and c['callout'].get('type') == 'newspaper_headline':
            c['transitionType'] = 'shutter_flash'
            c['transitionDuration'] = 0.15
            c['sfxPath'] = 'uploads/sfx/camera_shutter.mp3'
            c['sfxVolume'] = 0.22
            
    with open(f, 'w', encoding='utf-8') as out_f:
        json.dump(d, out_f, indent=2)

print("\nSuccessfully updated all chapter timelines with verbatim callouts, whooshes, and transitions!")
