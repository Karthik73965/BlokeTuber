import os
import subprocess
import sys

sources = [
    {
        "id": "paul_elkins_nomad",
        "url": "https://www.youtube.com/watch?v=0BJxTfSqiZ4",
        "name": "paul_elkins_nomad.mp4"
    },
    {
        "id": "kirsten_elkins_150",
        "url": "https://www.youtube.com/watch?v=ZiejAhol4Ps",
        "name": "kirsten_elkins_150.mp4"
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
    },
    {
        "id": "drew_builds_stuff",
        "url": "https://www.youtube.com/watch?v=iOQyLYYTE8w",
        "name": "drew_builds_stuff.mp4"
    }
]

out_dir = os.path.abspath("uploads/raw/proj_camperbike")
os.makedirs(out_dir, exist_ok=True)

for src in sources:
    out_path = os.path.join(out_dir, src["name"])
    if os.path.exists(out_path) and os.path.getsize(out_path) > 1000000:
        print(f"Skipping {src['name']} - already exists ({os.path.getsize(out_path)} bytes)")
        continue

    print(f"\n--- Downloading {src['id']}: {src['url']} ---")
    cmd = [
        "yt-dlp",
        "-f", "bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/best[height<=1080][ext=mp4]/best",
        "--merge-output-format", "mp4",
        "-o", out_path,
        "--no-playlist",
        src["url"]
    ]
    try:
        subprocess.run(cmd, check=True)
        print(f"Successfully downloaded {src['name']} ({os.path.getsize(out_path)} bytes)")
    except Exception as e:
        print(f"Error downloading {src['name']}: {e}")

print("\nALL TARGET SOURCES PROCESSED!")
