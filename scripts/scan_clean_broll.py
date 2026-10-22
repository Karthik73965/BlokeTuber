import cv2
import subprocess
import os

face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def scan_video(source_path, name, interval=5, max_time=600):
    os.makedirs(f"uploads/raw/proj_ambulance/scans/{name}", exist_ok=True)
    clean_timestamps = []
    
    cmd_dur = ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", source_path]
    dur = float(subprocess.check_output(cmd_dur).decode().strip())
    limit = min(dur, max_time)
    
    t = 0
    while t < limit:
        out_jpg = f"uploads/raw/proj_ambulance/scans/{name}/f_{int(t)}s.jpg"
        cmd = ["ffmpeg", "-y", "-ss", str(t), "-i", source_path, "-vframes", "1", "-q:v", "2", out_jpg]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        img = cv2.imread(out_jpg)
        if img is not None:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            faces = face_cascade.detectMultiScale(gray, 1.1, 4)
            if len(faces) == 0:
                clean_timestamps.append(t)
                # keep image
            else:
                if os.path.exists(out_jpg):
                    os.remove(out_jpg)
        t += interval
    print(f"Scanned {name}: found {len(clean_timestamps)} clean timestamps: {clean_timestamps}")
    return clean_timestamps

scan_video("uploads/raw/proj_ambulance/cheaprv_ambulance.mp4", "cheaprv", interval=5, max_time=400)
scan_video("uploads/raw/proj_ambulance/ben_emily_tour.mp4", "ben_emily", interval=10, max_time=1200)
