import cv2
import os

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def scan_video_for_clean_shots(video_path, step_sec=2, max_sec=None):
    cap = cv2.VideoCapture(video_path)
    fps = cap.get(cv2.CAP_PROP_FPS)
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    duration = total_frames / fps
    if max_sec:
        duration = min(duration, max_sec)
        
    step_frames = int(fps * step_sec)
    clean_timestamps = []
    
    current_frame = 0
    while current_frame < total_frames and (current_frame / fps) < duration:
        cap.set(cv2.CAP_PROP_POS_FRAMES, current_frame)
        ret, frame = cap.read()
        if not ret:
            break
        
        t = current_frame / fps
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        # Small resize for speed
        small = cv2.resize(gray, (640, 360))
        faces = face_cascade.detectMultiScale(small, scaleFactor=1.1, minNeighbors=4, minSize=(30, 30))
        
        if len(faces) == 0:
            clean_timestamps.append(round(t, 2))
            
        current_frame += step_frames
        
    cap.release()
    return clean_timestamps

print("Scanning sources for clean shots...")
for name, p in [
    ("govdeals", "uploads/raw/proj_ambulance/govdeals_ambulance.mp4"),
    ("cheaprv", "uploads/raw/proj_ambulance/cheaprv_ambulance.mp4"),
    ("ben_emily", "uploads/raw/proj_ambulance/ben_emily_tour.mp4")
]:
    clean = scan_video_for_clean_shots(p, step_sec=5)
    print(f"=== {name} ({len(clean)} clean timestamps) ===")
    # Group into continuous ranges
    ranges = []
    if clean:
        start = clean[0]
        prev = clean[0]
        for t in clean[1:]:
            if t - prev <= 6:
                prev = t
            else:
                if prev - start >= 4:
                    ranges.append((start, prev))
                start = t
                prev = t
        if prev - start >= 4:
            ranges.append((start, prev))
    for r in ranges[:15]:
        print(f"  Range: {r[0]:.1f}s - {r[1]:.1f}s (duration {r[1]-r[0]:.1f}s)")
