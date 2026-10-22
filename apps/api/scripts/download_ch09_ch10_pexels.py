import os
import sys
import urllib.request
import json
import urllib.parse
from pathlib import Path

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = REPO_ROOT / 'uploads' / 'raw' / 'proj_dome_villages'
DOWNLOADS_DIR = RAW_DIR / 'downloads'
DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)

PEXELS_API_KEY = "IsEyAaH3KB99divi9zwyCzIfmZLD6DEmexyGV6L8VlaLzrNnZ6atuMEa"

TARGETS = [
    # Chapter 9
    ("austin texas skyline aerial drone", "pexels_austin_skyline.mp4"),
    ("community garden vegetables harvesting", "pexels_community_garden.mp4"),
    ("doctor examination patient clinic", "pexels_medical_clinic.mp4"),
    ("artist painting canvas studio easel", "pexels_art_studio.mp4"),
    ("outdoor cinema movie theater night projector", "pexels_outdoor_movie.mp4"),
    ("angry protest crowd demonstration hall", "pexels_neighborhood_protest.mp4"),
    ("police car flashing lights night street", "pexels_police_escort.mp4"),
    ("architect blueprints construction site plans", "pexels_expansion_blueprints.mp4"),
    ("master planned community tiny houses aerial", "pexels_tiny_homes_neighborhood.mp4"),
    ("donation charity check volunteer funding", "pexels_philanthropy_donation.mp4"),
    ("neighbors talking community garden smiling", "pexels_missionals_community.mp4"),
    ("eviction notice cardboard moving boxes door", "pexels_eviction_notice.mp4"),
    ("courtroom judge gavel legal justice enforcement", "pexels_court_enforcement.mp4"),
    
    # Chapter 10
    ("american flag waving slow motion sky", "pexels_us_flag_waving.mp4"),
    ("homeless mother child family shelter", "pexels_homeless_children.mp4"),
    ("elderly senior man sad sitting bench park", "pexels_elderly_homeless_bench.mp4"),
    ("elderly senior face wrinkles portrait close up", "pexels_senior_portrait_65.mp4"),
    ("elderly person walking cane slow street sidewalk", "pexels_elderly_walking_cane.mp4"),
    ("homeless man street sidewalk 50s", "pexels_homeless_man_50s.mp4"),
    ("california highway scenic pacific coast", "pexels_california_highway.mp4"),
    ("medical researcher doctor stethoscope lab hospital", "pexels_ucsf_doctor_research.mp4"),
    ("stressed senior debt bills papers eviction", "pexels_retiree_stressed_bills.mp4"),
    ("lonely elderly woman widow looking out window sad", "pexels_elderly_widow_alone.mp4"),
    ("exhausted older construction worker hardhat break", "pexels_exhausted_older_worker.mp4"),
    ("person sleeping in car night steering wheel", "pexels_sleeping_in_car.mp4"),
    ("happy senior smiling porch sunny tiny house", "pexels_peaceful_elderly_home.mp4"),
    ("oakland california city street aerial drone", "pexels_oakland_street.mp4"),
    ("ambulance flashing lights emergency night paramedics", "pexels_ambulance_emergency.mp4"),
    ("cemetery headstones graveyard solemn grass trees", "pexels_cemetery_headstones.mp4"),
    ("hospital patient bed monitor intensive care doctor", "pexels_hospital_emergency_doctor.mp4"),
    ("military veteran proud portrait medal senior soldier", "pexels_veteran_portrait.mp4"),
    ("us capitol washington dc dome building government", "pexels_washington_capitol_hud.mp4"),
    ("homeless veteran sitting street military jacket", "pexels_homeless_veteran.mp4"),
    ("military cemetery white crosses american flags arlington", "pexels_military_cemetery.mp4"),
    ("veteran handshake support respect handshake greeting", "pexels_veteran_handshake.mp4"),
    ("hospital building exterior medical center va sign", "pexels_va_hospital_exterior.mp4"),
    ("social worker caseworker clipboard talking smiling", "pexels_caseworker_outreach.mp4"),
    ("holding keys unlocking new apartment door moving in", "pexels_veteran_new_home_keys.mp4"),
    ("signing document contract lease pen papers", "pexels_housing_voucher_signing.mp4"),
]

def search_and_download(query, filename):
    out_path = DOWNLOADS_DIR / filename
    if out_path.exists() and out_path.stat().st_size > 300000:
        print(f"⏩ {filename} already exists ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")
        return str(out_path)

    print(f"🔍 Searching Pexels for: '{query}'...")
    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=6&orientation=landscape"
    req = urllib.request.Request(url, headers={
        "Authorization": PEXELS_API_KEY,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    })

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            videos = data.get('videos', [])
            if not videos:
                print(f"[X] No videos found for '{query}'")
                return None

            for vid in videos:
                video_files = vid.get('video_files', [])
                best_file = None
                # Prefer 1080p landscape
                for vf in video_files:
                    h = vf.get('height') or 0
                    w = vf.get('width') or 0
                    if 720 <= h <= 1080 and w > h:
                        best_file = vf
                        break
                if not best_file:
                    for vf in video_files:
                        h = vf.get('height') or 0
                        if h >= 720:
                            best_file = vf
                            break

                if best_file and best_file.get('link'):
                    dl_url = best_file['link']
                    print(f"⬇️ Downloading {filename} ({best_file.get('width')}x{best_file.get('height')})...")
                    dl_req = urllib.request.Request(dl_url, headers={
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    })
                    with urllib.request.urlopen(dl_req) as dl_resp, open(out_path, 'wb') as out_f:
                        while True:
                            chunk = dl_resp.read(128 * 1024)
                            if not chunk:
                                break
                            out_f.write(chunk)
                    print(f"✅ Saved to {filename} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")
                    return str(out_path)

    except Exception as e:
        print(f"❌ Error downloading {query}: {e}")
        return None

if __name__ == '__main__':
    print(f"Starting download of {len(TARGETS)} targeted b-roll clips from Pexels...")
    success = 0
    for q, fn in TARGETS:
        res = search_and_download(q, fn)
        if res:
            success += 1
    print(f"\nDone! Downloaded/verified {success}/{len(TARGETS)} clips.")
