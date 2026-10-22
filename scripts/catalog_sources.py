import os
import subprocess
import json
import cv2

SOURCES = [
    "halifax_eviction_day",
    "halifax_students_gifts",
    "halifax_business_eviction",
    "eskimo_quickfish_3i_setup",
    "eskimo_quickfish_overview"
]

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

for src in SOURCES:
    video_path = f"uploads/raw/proj_fishingtent/sources/{src}.mp4"
    if not os.path.exists(video_path):
        continue
    
    res = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", video_path], capture_output=True, text=True)
    dur = float(json.loads(res.stdout)["format"]["duration"])
    
    out_dir = f"scratch/catalog/{src}"
    os.makedirs(out_dir, exist_ok=True)
    
    print(f"\nScanning {src} ({dur:.1f}s)...")
    clean_ranges = []
    current_start = None
    
    t = 1.0
    while t < dur - 1.0:
        jpg_path = f"{out_dir}/t_{int(t):03d}.jpg"
        subprocess.run(["ffmpeg", "-nostdin", "-y", "-ss", str(t), "-i", video_path, "-vframes", "1", "-q:v", "3", jpg_path], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        img = cv2.imread(jpg_path)
        has_face = False
        if img is not None:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            # detect face in central area (talking heads)
            h, w = gray.shape
            faces = face_cascade.detectMultiScale(gray, 1.1, 4, minSize=(60, 60))
            if len(faces) > 0:
                has_face = True
        
        status = "FACE" if has_face else "B-ROLL"
        # print(f"  {t:03.0f}s: {status}")
        t += 3.0

print("\nFinished cataloging.")
