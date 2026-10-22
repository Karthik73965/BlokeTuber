import os
import urllib.request
import json
import urllib.parse
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[3]
RAW_DIR = REPO_ROOT / 'uploads' / 'raw' / 'proj_dome_villages'
DOWNLOADS_DIR = RAW_DIR / 'downloads'
DOWNLOADS_DIR.mkdir(parents=True, exist_ok=True)

def get_pexels_key():
    env_file = REPO_ROOT / 'apps' / 'api' / '.env'
    if env_file.exists():
        with open(env_file, 'r') as f:
            for line in f:
                if line.startswith('PEXELS_API_KEY='):
                    return line.strip().split('=', 1)[1]
    return None

api_key = get_pexels_key()

def search_and_download(query, filename):
    out_path = DOWNLOADS_DIR / filename
    if out_path.exists() and out_path.stat().st_size > 100000:
        print(f"⏩ {filename} already exists.")
        return str(out_path)

        print(f"Searching Pexels for: '{query}'...")
    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page=5&orientation=landscape"
    req = urllib.request.Request(url, headers={
        "Authorization": api_key,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    })

    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            videos = data.get('videos', [])
            if not videos:
                print(f"[X] No videos found for '{query}'")
                return None

            # Find best 1080p file
            for vid in videos:
                video_files = vid.get('video_files', [])
                # Prefer 1080p landscape
                best_file = None
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
                    print(f"Downloading {filename} ({best_file.get('width')}x{best_file.get('height')})...")
                    dl_req = urllib.request.Request(dl_url, headers={
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
                    })
                    with urllib.request.urlopen(dl_req) as dl_resp, open(out_path, 'wb') as out_f:
                        while True:
                            chunk = dl_resp.read(64 * 1024)
                            if not chunk:
                                break
                            out_f.write(chunk)
                    print(f"[OK] Saved to {filename} ({out_path.stat().st_size / 1024 / 1024:.1f} MB)")
                    return str(out_path)

    except Exception as e:
        print(f"Error downloading {query}: {e}")
        return None

if __name__ == '__main__':
    targets = [
        ("suburbs aerial drone neighborhood houses", "pexels_suburbs_aerial.mp4"),
        ("empty lot urban weeds fence", "pexels_empty_lot.mp4"),
        ("tents community camp street homeless", "pexels_tents_camp.mp4"),
        ("police car lights night siren", "pexels_police_siren.mp4"),
        ("courthouse legal columns architecture", "pexels_courthouse.mp4"),
        ("city street night sidewalk concrete", "pexels_street_night.mp4"),
        ("voting ballot box election", "pexels_ballot_election.mp4"),
        ("rows of beds dormitory room shelter", "pexels_dorm_cots.mp4"),
        ("person sitting doorway street urban", "pexels_doorway_sleeping.mp4"),
        ("los angeles downtown skyline highway", "pexels_la_skyline.mp4"),
    ]

    for q, fn in targets:
        search_and_download(q, fn)
