import os
import urllib.request
import json

def get_pexels_key():
    with open('apps/api/.env', 'r') as f:
        for line in f:
            if line.startswith('PEXELS_API_KEY='):
                return line.strip().split('=', 1)[1]
    return None

api_key = get_pexels_key()

def search_pexels_video(query, per_page=3):
    url = f"https://api.pexels.com/videos/search?query={urllib.parse.quote(query)}&per_page={per_page}&orientation=landscape"
    req = urllib.request.Request(url, headers={
        "Authorization": api_key,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    })
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get('videos', [])
    except Exception as e:
        print(f"Error searching {query}: {e}")
        return []

def search_pexels_photo(query, per_page=3):
    url = f"https://api.pexels.com/v1/search?query={urllib.parse.quote(query)}&per_page={per_page}&orientation=landscape"
    req = urllib.request.Request(url, headers={
        "Authorization": api_key,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
    })
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            return data.get('photos', [])
    except Exception as e:
        print(f"Error searching photos for {query}: {e}")
        return []

if __name__ == '__main__':
    vids = search_pexels_video("shopping cart parking lot", 2)
    print("Shopping cart videos:", len(vids))
    for v in vids:
        print("  - Video ID:", v['id'], "duration:", v['duration'], "url:", v['url'])

    vids_fire = search_pexels_video("forest fire smoke wildfire", 2)
    print("Wildfire videos:", len(vids_fire))
    for v in vids_fire:
        print("  - Video ID:", v['id'], "duration:", v['duration'], "url:", v['url'])
