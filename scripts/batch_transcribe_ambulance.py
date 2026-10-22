import os
import sys
import json
import time
from faster_whisper import WhisperModel

AUDIO_DIR = os.path.abspath("uploads/audio/ambulance")
OUTPUT_DIR = os.path.abspath("uploads/transcripts/ambulance")
os.makedirs(OUTPUT_DIR, exist_ok=True)

CHAPTER_FILES = [
    (1, "1 -Cold.mp3", "Cold Open"),
    (2, "2 - WHAT AN AMBULANCE.mp3", "What An Ambulance Is"),
    (3, "3- WHY IS ITSO CHEAP.mp3", "Why Is It So Cheap"),
    (4, "4 - DALE.mp3", "Dale"),
    (5, "5 - A DAY INSIDE.mp3", "A Day Inside"),
    (6, "6 - THE NIGHT.mp3", "The Night"),
    (7, "7 - THE VETERAN'SBLUEPRINT.mp3", "The Veteran's Blueprint"),
    (8, "8 - THELEGALWALL.mp3", "The Legal Wall"),
    (9, "9 -  WHEN IT GOESWRONG.mp3", "When It Goes Wrong"),
    (10, "10 - THELOTISTHE MEDICINE.mp3", "The Lot Is The Medicine"),
    (11, "11 -  DALE'S YEAR.mp3", "Dale's Year"),
    (12, "12 - close.mp3", "Closing")
]

print("Initializing WhisperModel (base)...")
model = WhisperModel("base", device="cpu", compute_type="int8")

for ch_num, filename, title in CHAPTER_FILES:
    audio_path = os.path.join(AUDIO_DIR, filename)
    json_path = os.path.join(OUTPUT_DIR, f"ch{ch_num:02d}_{filename}.json")
    txt_path = os.path.join(OUTPUT_DIR, f"ch{ch_num:02d}_{filename}.txt")
    
    if os.path.exists(json_path) and os.path.getsize(json_path) > 100:
        print(f"Skipping Ch {ch_num:02d} ({filename}) - already transcribed.")
        continue
        
    print(f"\n--- Transcribing Ch {ch_num:02d}: {filename} ({title}) ---")
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
        
    with open(txt_path, "w", encoding="utf-8") as f:
        f.write("\n".join(full_text_lines))
        
    print(f"Ch {ch_num:02d} finished in {time.time()-t0:.1f}s ({len(seg_list)} segments).")

print("\n=== ALL 12 CHAPTERS TRANSCRIBED SUCCESSFULLY ===")
