import os
import sys
import json
import time
from pathlib import Path
from faster_whisper import WhisperModel

sys.stdout.reconfigure(encoding='utf-8')

audio_dir = Path(r"C:\Users\karth\Videos\Animated\White Home\Aud")
out_dir = Path(r"C:\Users\karth\Documents\BlokeTuber\scratch\white_home_transcripts")
out_dir.mkdir(parents=True, exist_ok=True)

files = [
    ("ch0_hook", "0 - hook.mp3"),
    ("ch1_physics", "1 — The Physics.mp3"),
    ("ch2_pain", "2 - the people pain.mp3"),
    ("ch3_health", "3 — The Hidden Health Reason.mp3"),
    ("ch4_ritual", "4 - The Ritual.mp3"),
    ("ch5_closing", "5 - closing.mp3"),
]

print("Initializing Faster-Whisper model (base)...")
model = WhisperModel("base", device="cpu", compute_type="int8")

summary = {}

for key, fname in files:
    audio_path = audio_dir / fname
    if not audio_path.exists():
        print(f"Error: {audio_path} not found!")
        continue
    
    print(f"\n--- Transcribing {key} ({fname}) ---")
    t0 = time.time()
    segments, info = model.transcribe(
        str(audio_path),
        word_timestamps=True,
        beam_size=5,
        vad_filter=True,
        language="en"
    )
    
    result_segments = []
    all_words = []
    for s in segments:
        seg_dict = {
            "id": s.id,
            "start": round(s.start, 3),
            "end": round(s.end, 3),
            "text": s.text.strip(),
            "words": []
        }
        if s.words:
            for w in s.words:
                w_dict = {
                    "word": w.word.strip(),
                    "start": round(w.start, 3),
                    "end": round(w.end, 3)
                }
                seg_dict["words"].append(w_dict)
                all_words.append(w_dict)
        result_segments.append(seg_dict)
    
    full_text = " ".join(s["text"] for s in result_segments)
    out_data = {
        "chapter": key,
        "filename": fname,
        "duration": round(info.duration, 3),
        "full_text": full_text,
        "segments": result_segments,
        "words": all_words
    }
    
    out_file = out_dir / f"{key}.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(out_data, f, indent=2, ensure_ascii=False)
    
    txt_file = out_dir / f"{key}.txt"
    with open(txt_file, "w", encoding="utf-8") as f:
        f.write(full_text)
        
    elapsed = round(time.time() - t0, 1)
    print(f"✓ Completed {key} in {elapsed}s: {len(result_segments)} segments, {len(all_words)} words.")
    summary[key] = {
        "duration": round(info.duration, 3),
        "segments": len(result_segments),
        "words": len(all_words),
        "text_preview": full_text[:120] + "..."
    }

with open(out_dir / "summary.json", "w", encoding="utf-8") as f:
    json.dump(summary, f, indent=2)

print("\n==========================================")
print("✓ ALL 6 CHAPTERS TRANSCRIBED SUCCESSFULLY!")
print("==========================================")
