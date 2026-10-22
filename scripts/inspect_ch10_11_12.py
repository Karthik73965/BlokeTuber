import json
import os
import subprocess

transcripts = [
    ("10", "uploads/transcripts/ambulance/ch10_10 - THELOTISTHE MEDICINE.mp3.json", "uploads/audio/ambulance/10 - THELOTISTHE MEDICINE.mp3"),
    ("11", "uploads/transcripts/ambulance/ch11_11 -  DALE'S YEAR.mp3.json", "uploads/audio/ambulance/11 -  DALE'S YEAR.mp3"),
    ("12", "uploads/transcripts/ambulance/ch12_12 - close.mp3.json", "uploads/audio/ambulance/12 - close.mp3")
]

for ch, tpath, apath in transcripts:
    print(f"\n==========================================")
    print(f"CHAPTER {ch}")
    print(f"Audio file: {apath} exists={os.path.exists(apath)}")
    if os.path.exists(apath):
        # probe duration
        cmd = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", apath]
        dur = subprocess.check_output(cmd).decode().strip()
        print(f"Audio duration: {dur}s")

    with open(tpath, "r", encoding="utf-8") as f:
        data = json.load(f)
    print(f"Segments count: {len(data)}")
    for i, seg in enumerate(data):
        st = seg.get("start")
        et = seg.get("end")
        txt = seg.get("text", "").strip()
        print(f"  Beat {i}: [{st:.2f}s -> {et:.2f}s] ({et - st:.2f}s) {txt}")
