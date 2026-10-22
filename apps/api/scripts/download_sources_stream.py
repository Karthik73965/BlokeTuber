import os
import subprocess

sources = [
    {
        "id": "drew_builds_stuff",
        "url": "https://www.youtube.com/watch?v=iOQyLYYTE8w",
        "name": "drew_builds_stuff.mp4"
    },
    {
        "id": "beneath_bridges_homeless",
        "url": "https://www.youtube.com/watch?v=xg64t56XYok",
        "name": "beneath_bridges_homeless.mp4"
    },
    {
        "id": "beneath_bridges_7campers",
        "url": "https://www.youtube.com/watch?v=OL8AZSI2zaY",
        "name": "beneath_bridges_7campers.mp4"
    }
]

out_dir = os.path.abspath("uploads/raw/proj_camperbike")
os.makedirs(out_dir, exist_ok=True)

for src in sources:
    out_path = os.path.join(out_dir, src["name"])
    if os.path.exists(out_path) and os.path.getsize(out_path) > 5000000:
        print(f"Skipping {src['name']} - already exists ({os.path.getsize(out_path)} bytes)")
        continue

    print(f"\n=======================================================")
    print(f"Downloading {src['id']} ({src['url']}) -> {src['name']}")
    print(f"=======================================================")
    cmd = [
        "yt-dlp",
        "--extractor-args", "youtube:player_client=android",
        "-f", "18/b[ext=mp4]/best",
        "-o", out_path,
        "--no-playlist",
        src["url"]
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f"SUCCESS: {src['name']} ({os.path.getsize(out_path)} bytes)")
    except Exception as e:
        print(f"ERROR: {src['name']}: {e}")

print("\nALL SOURCES PROCESSED!")
