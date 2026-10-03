import os
import sys
from local_transcribe import transcribe
import json

chapters = [
    (3, "uploads/audio/oasis_ch03.mp3", "uploads/transcripts/oasis_village/ch03_alignment.json"),
    (4, "uploads/audio/oasis_ch04.mp3", "uploads/transcripts/oasis_village/ch04_alignment.json"),
    (5, "uploads/audio/oasis_ch05.mp3", "uploads/transcripts/oasis_village/ch05_alignment.json"),
    (6, "uploads/audio/oasis_ch06.mp3", "uploads/transcripts/oasis_village/ch06_alignment.json"),
    (7, "uploads/audio/oasis_ch07.mp3", "uploads/transcripts/oasis_village/ch07_alignment.json"),
    (8, "uploads/audio/oasis_ch08.mp3", "uploads/transcripts/oasis_village/ch08_alignment.json"),
]

for ch_num, aud, out_path in chapters:
    print(f"--- Transcribing Chapter {ch_num}: {aud} ---")
    os.makedirs(os.path.dirname(out_path), exist_ok=True)
    res = transcribe(aud, model_size="base", device="cpu", compute_type="int8")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    print(f"Done Ch {ch_num}: duration={res['duration']}s -> {out_path}")

print("ALL CHAPTERS TRANSCRIBED SUCCESSFULLY!")
