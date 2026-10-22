import os
import sys
import urllib.request
import json
import urllib.parse
from pathlib import Path

# Force UTF-8 on Windows
if sys.platform == 'win32':
    sys.stdout.reconfigure(encoding='utf-8')

REPO_ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = REPO_ROOT / 'uploads' / 'raw' / 'proj_dome_villages'
DOWNLOADS_DIR = RAW_DIR / 'downloads'
DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)

API_KEY = "IsEyAaH3KB99divi9zwyCzIfmZLD6DEmexyGV6L8VlaLzrNnZ6atuMEa"

def search_and_download(query, filename):
    out_path = DOWNLOADS_DIR / filename
    if out_path.exists() and out_path.stat().st_size > 100000:
        print(f"[EXISTS] {filename} already exists ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")
        return str(out_path)

    print(f"[SEARCH] Searching Pexels for '{query}'...")

    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=8&orientation=landscape"
    req = urllib.request.Request(url, headers={
        "Authorization": API_KEY,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    })

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            videos = data.get('videos', [])
            if not videos:
                print(f"[NONE] No videos found for '{query}'")
                return None

            best_file = None
            # Find best 1080p landscape file
            for vid in videos:
                video_files = vid.get('video_files', [])
                for vf in video_files:
                    h = vf.get('height') or 0
                    w = vf.get('width') or 0
                    if 720 <= h <= 1080 and w > h:
                        best_file = vf
                        break
                if best_file:
                    break

            if not best_file:
                for vid in videos:
                    for vf in vid.get('video_files', []):
                        h = vf.get('height') or 0
                        if h >= 720:
                            best_file = vf
                            break
                    if best_file:
                        break

            if best_file and best_file.get('link'):
                dl_url = best_file['link']
                print(f"[DOWNLOADING] {filename} ({best_file.get('width')}x{best_file.get('height')})...")
                dl_req = urllib.request.Request(dl_url, headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                })
                with urllib.request.urlopen(dl_req) as dl_resp, open(out_path, 'wb') as out_f:
                    while True:
                        chunk = dl_resp.read(64 * 1024)
                        if not chunk:
                            break
                        out_f.write(chunk)
                print(f"[OK] Saved to {filename} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")
                return str(out_path)
            else:
                print(f"[NO MATCH] No matching video file for '{query}'")
                return None

    except Exception as e:
        print(f"[ERROR] Error downloading {query}: {e}")
        return None

if __name__ == '__main__':
    targets = [
        # Chapter 3: Geometry, Fuller, Bauersfeld, Arco oil
        ("geodesic dome greenhouse botanical modern", "pexels_geodesic_dome.mp4"),
        ("planetarium observatory dome projection telescope", "pexels_planetarium_dome.mp4"),
        ("3d geometry sphere wireframe mesh", "pexels_sphere_geometry.mp4"),
        ("oil refinery industrial tanks petroleum", "pexels_oil_refinery_arco.mp4"),
        ("architect measuring blueprint drafting table", "pexels_architect_measuring.mp4"),
        
        # Chapter 4: Life inside dome, rain on roof, dominoes, coffee, sleeping, sweeping
        ("rain pouring window pane glass drops storm", "pexels_rain_drums_roof.mp4"),
        ("vintage radio tuning dial listening audio", "pexels_vintage_radio_listening.mp4"),
        ("person walking dark cold night rain coat", "pexels_night_walk_cold_rain.mp4"),
        ("cooking communal kitchen pots stove food", "pexels_communal_kitchen_cooking.mp4"),
        ("playing dominoes wooden table game hands", "pexels_dominoes_table_game.mp4"),
        ("pouring fresh hot coffee morning kitchen cup", "pexels_morning_coffee_pour.mp4"),
        ("sweeping sidewalk broom outdoor maintenance path", "pexels_sweeping_path.mp4"),
        ("person reading book cozy quiet afternoon", "pexels_reading_book_afternoon.mp4"),
        ("community discussion meeting circle people talking", "pexels_circle_meeting_discussion.mp4"),
        
        # Chapter 5: 13 years, mailbox, real sleep, job interview, phone call to family
        ("mailbox opening mail letters residential envelope", "pexels_mailbox_letters_address.mp4"),
        ("peaceful sleep bed woman man rest waking", "pexels_peaceful_sleep_bed.mp4"),
        ("job interview professional handshake office", "pexels_job_interview_handshake.mp4"),
        ("person talking on phone smiling relief call", "pexels_phone_call_family.mp4"),
        ("family walking together park sunset hopeful", "pexels_family_hopeful_future.mp4"),
        ("sunset over vacant lot city dusk quiet", "pexels_sunset_city_lot.mp4"),
    ]

    for q, fn in targets:
        search_and_download(q, fn)
