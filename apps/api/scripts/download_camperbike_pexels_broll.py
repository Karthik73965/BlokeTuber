import os
import sys
import urllib.request
import json
import urllib.parse
from pathlib import Path

if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = Path(__file__).resolve().parents[3]
STOCK_DIR = REPO_ROOT / 'uploads' / 'raw' / 'proj_camperbike' / 'stock'
STOCK_DIR.mkdir(parents=True, exist_ok=True)

PEXELS_API_KEY = "IsEyAaH3KB99divi9zwyCzIfmZLD6DEmexyGV6L8VlaLzrNnZ6atuMEa"

TARGETS = [
    ("frost grass winter morning", "stock_frost_morning.mp4"),
    ("highway overpass concrete bridge traffic", "stock_bridge_overpass.mp4"),
    ("bicycle cycling morning street road", "stock_cyclist_pedaling.mp4"),
    ("sleeping peacefully morning bed cozy", "stock_warm_sleep.mp4"),
    ("counting dollar bills money cash", "stock_dollar_cash.mp4"),
    ("hardware store lumber wood planks", "stock_hardware_lumber.mp4"),
    ("stone arch bridge architecture", "stock_stone_arch.mp4"),
    ("eggshell macro curve physics", "stock_eggshell_curve.mp4"),
    ("engineer blueprint technical drawing desk", "stock_engineer_drafting.mp4"),
    ("airplane hangar engineering jet", "stock_airplane_boeing.mp4"),
    ("desert festival burning man dust", "stock_desert_festival.mp4"),
    ("door lock bolt latch metal", "stock_barrel_bolt_lock.mp4"),
    ("sleeping deeply peaceful night rest", "stock_deep_sleep_dream.mp4"),
    ("bicycle wheel rolling road pavement", "stock_bike_wheel_roll.mp4"),
    ("courtroom judge gavel legal justice enforcement", "stock_courthouse_gavel.mp4"),
    ("street sweeper city cleanup morning", "stock_street_sweeper.mp4"),
    ("camping stove frying eggs breakfast pan", "stock_stove_cooking.mp4"),
    ("steaming hot coffee cup morning", "stock_morning_coffee.mp4"),
    ("tents homeless winter street urban", "stock_homeless_encampment.mp4"),
    ("dog sitting with owner street sidewalk", "stock_dog_companion.mp4"),
    ("couple holding hands winter cold comfort", "stock_couple_comfort.mp4"),
    ("utility knife box cutter cutting plastic", "stock_utility_knife_cut.mp4"),
    ("gas flame burner blue flame danger", "stock_fire_flame_stove.mp4"),
    ("condensation water drops window glass cold", "stock_window_condensation.mp4"),
    ("freezing rain cold winter puddle street", "stock_freezing_rain.mp4"),
    ("sunrise highway road empty dawn", "stock_sunrise_highway.mp4"),
    ("new york city steam manhole street winter", "stock_nyc_steam_vent.mp4"),
]

def search_and_download(query, filename):
    out_path = STOCK_DIR / filename
    if out_path.exists() and out_path.stat().st_size > 500000:
        print(f"⏩ {filename} already exists ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")
        return str(out_path)

    print(f"🔍 Searching Pexels: '{query}'...")
    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=5&orientation=landscape"
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
                # Prefer 720p - 1080p
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
    print(f"\nDone! Downloaded/verified {success}/{len(TARGETS)} stock clips.")
