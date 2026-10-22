import os
import subprocess
import json

def probe_all():
    base_dirs = [
        "uploads/raw/proj_camperbike/slices",
        "uploads/raw/proj_camperbike/stock"
    ]
    clips = []
    for b in base_dirs:
        for f in sorted(os.listdir(b)):
            if f.endswith(".mp4"):
                p = os.path.join(b, f)
                cmd = [
                    "ffprobe", "-v", "error",
                    "-select_streams", "v:0",
                    "-show_entries", "stream=codec_name,width,height,duration",
                    "-of", "json",
                    p
                ]
                res = subprocess.run(cmd, capture_output=True, text=True)
                data = json.loads(res.stdout)
                streams = data.get("streams", [])
                if streams:
                    s = streams[0]
                    dur = float(s.get("duration", 0) or 0)
                    w = s.get("width")
                    h = s.get("height")
                    codec = s.get("codec_name")
                    clips.append((b.split("/")[-1], f, dur, w, h, codec))
                else:
                    clips.append((b.split("/")[-1], f, 0, 0, 0, "no_stream"))
    print(f"Total clips probed: {len(clips)}")
    for folder, fname, dur, w, h, codec in clips:
        print(f"[{folder}] {fname:42s} | {dur:5.2f}s | {w}x{h} | {codec}")

if __name__ == "__main__":
    probe_all()
