import os
import sys
import json
import time
import shutil
from faster_whisper import WhisperModel

SRC_DIR = r"C:\Users\karth\Videos\AmericanHideaways\Steel Door\Aud"
AUDIO_DIR = os.path.abspath("uploads/audio/steeldoor")
TRANSCRIPTS_DIR = os.path.abspath("uploads/transcripts/steeldoor")

os.makedirs(AUDIO_DIR, exist_ok=True)
os.makedirs(TRANSCRIPTS_DIR, exist_ok=True)

CHAPTERS = [
    (1, "1 - Cold door.mp3", "ch01_cold_door", "Cold Door"),
    (2, "2 - The Number That Broke He.mp3", "ch02_the_number_that_broke_her", "The Number That Broke Her"),
    (3, "3- Where They Slept.mp3", "ch03_where_they_slept", "Where They Slept"),
    (4, "4 - the things no body believved.mp3", "ch04_the_things_nobody_believed", "The Things Nobody Believed"),
    (5, "5 - The Box Nobody Wanted.mp3", "ch05_the_box_nobody_wanted", "The Box Nobody Wanted"),
    (6, "6 - Two Acres and a Handshake.mp3", "ch06_two_acres_and_a_handshake", "Two Acres and a Handshake"),
    (7, "7 - The Sound of a Grinder.mp3", "ch07_the_sound_of_a_grinder", "The Sound of a Grinder"),
    (8, "8 - What Contractors Throw Away.mp3", "ch08_what_contractors_throw_away", "What Contractors Throw Away"),
    (9, "9 - The Panels Behind the Warehouse.mp3", "ch09_the_panels_behind_the_warehouse", "The Panels Behind the Warehouse"),
    (10, "10 - What Was Behind the Door.mp3", "ch10_what_was_behind_the_door", "What Was Behind the Door"),
    (11, "11 - The Question She Never Asked.mp3", "ch11_the_question_she_never_asked", "The Question She Never Asked"),
]

# Copy audio files to canonical names
print("Copying audio files to canonical paths...")
for ch_idx, src_name, canon_stem, title in CHAPTERS:
    src_file = os.path.join(SRC_DIR, src_name)
    dst_file = os.path.join(AUDIO_DIR, f"{canon_stem}.mp3")
    if not os.path.exists(src_file):
        print(f"ERROR: Source file not found: {src_file}")
        sys.exit(1)
    if not os.path.exists(dst_file) or os.path.getsize(dst_file) != os.path.getsize(src_file):
        shutil.copy2(src_file, dst_file)
        print(f"Copied {src_name} -> {canon_stem}.mp3")

print("\nInitializing WhisperModel (base)...")
model = WhisperModel("base", device="cpu", compute_type="int8")

summary = []

for ch_idx, src_name, canon_stem, title in CHAPTERS:
    audio_path = os.path.join(AUDIO_DIR, f"{canon_stem}.mp3")
    json_path = os.path.join(TRANSCRIPTS_DIR, f"{canon_stem}.json")
    txt_path = os.path.join(TRANSCRIPTS_DIR, f"{canon_stem}.txt")
    
    print(f"\n[{ch_idx}/11] Transcribing Chapter {ch_idx}: {title}...")
    t0 = time.time()
    segments, info = model.transcribe(audio_path, word_timestamps=True, language="en")
    
    seg_list = []
    full_text_lines = []
    for s in segments:
        words = []
        if s.words:
            for w in s.words:
                words.append({
                    "word": w.word,
                    "start": round(w.start, 3),
                    "end": round(w.end, 3),
                    "probability": round(w.probability, 3)
                })
        seg_list.append({
            "id": s.id,
            "start": round(s.start, 3),
            "end": round(s.end, 3),
            "text": s.text.strip(),
            "words": words
        })
        full_text_lines.append(s.text.strip())
        
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(seg_list, f, indent=2)
        
    full_text = "\n".join(full_text_lines)
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(full_text)
        
    duration = seg_list[-1]["end"] if seg_list else info.duration
    elapsed = time.time() - t0
    print(f"  -> Done in {elapsed:.1f}s | Duration: {duration:.1f}s | Segments: {len(seg_list)}")
    summary.append({
        "chapter": ch_idx,
        "title": title,
        "stem": canon_stem,
        "duration": duration,
        "wordCount": len(full_text.split()),
        "firstWords": full_text[:120].replace("\n", " ") + "..."
    })

with open(os.path.join(TRANSCRIPTS_DIR, "summary.json"), "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)

print("\n=== TRANSCRIPTION COMPLETE ===")
for s in summary:
    print(f"Ch {s['chapter']:02d}: {s['title']} ({s['duration']:.1f}s) - {s['firstWords']}")
