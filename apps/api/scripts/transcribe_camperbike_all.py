import os
import sys
import json
import time

sys.path.append(os.path.dirname(__file__))
from local_transcribe import transcribe

chapters = [
    (1, "uploads/audio/camperbike/ch01_cold.mp3", "uploads/transcripts/camperbike/chapter_01.json"),
    (2, "uploads/audio/camperbike/ch02_promise.mp3", "uploads/transcripts/camperbike/chapter_02.json"),
    (3, "uploads/audio/camperbike/ch03_what_150_buys.mp3", "uploads/transcripts/camperbike/chapter_03.json"),
    (4, "uploads/audio/camperbike/ch04_arc.mp3", "uploads/transcripts/camperbike/chapter_04.json"),
    (5, "uploads/audio/camperbike/ch05_material.mp3", "uploads/transcripts/camperbike/chapter_05.json"),
    (6, "uploads/audio/camperbike/ch06_man_behind_it.mp3", "uploads/transcripts/camperbike/chapter_06.json"),
    (7, "uploads/audio/camperbike/ch07_family_of_designs.mp3", "uploads/transcripts/camperbike/chapter_07.json"),
    (8, "uploads/audio/camperbike/ch08_bolt.mp3", "uploads/transcripts/camperbike/chapter_08.json"),
    (9, "uploads/audio/camperbike/ch09_wheels.mp3", "uploads/transcripts/camperbike/chapter_09.json"),
    (10, "uploads/audio/camperbike/ch10_stove.mp3", "uploads/transcripts/camperbike/chapter_10.json"),
    (11, "uploads/audio/camperbike/ch11_why_beds_stay_empty.mp3", "uploads/transcripts/camperbike/chapter_11.json"),
    (12, "uploads/audio/camperbike/ch12_honest_part.mp3", "uploads/transcripts/camperbike/chapter_12.json"),
    (13, "uploads/audio/camperbike/ch13_what_its_actually_for.mp3", "uploads/transcripts/camperbike/chapter_13.json"),
    (14, "uploads/audio/camperbike/ch14_closing.mp3", "uploads/transcripts/camperbike/chapter_14.json"),
]

os.makedirs("uploads/transcripts/camperbike", exist_ok=True)

print("Starting transcription of 14 chapters...")
start_all = time.time()

for ch_num, aud, out_path in chapters:
    t0 = time.time()
    print(f"[{ch_num}/14] Transcribing {aud}...")
    res = transcribe(aud, model_size="base", device="cpu", compute_type="int8")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(res, f, ensure_ascii=False, indent=2)
    dt = round(time.time() - t0, 1)
    print(f"  -> Done Ch {ch_num:02d} in {dt}s: duration={res['duration']}s, segments={len(res['segments'])}")

print(f"\nALL 14 CHAPTERS TRANSCRIBED in {round(time.time() - start_all, 1)}s!")
