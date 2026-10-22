import json

for ch in [12, 13, 14]:
    print(f"============================== CHAPTER {ch} ==============================")
    with open(f"uploads/transcripts/camperbike/chapter_{ch:02d}.json", encoding="utf-8") as f:
        data = json.load(f)
    print("Total audio/transcript duration:", data.get("duration"))
    for idx, seg in enumerate(data.get("segments", [])):
        s = seg["start"]
        e = seg["end"]
        t = seg["text"].strip()
        print(f"{idx:02d} [{s:6.2f} - {e:6.2f}] ({e-s:4.2f}s): {t}")
