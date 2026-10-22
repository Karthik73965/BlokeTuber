import json
import subprocess

def get_audio_duration(path):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', path]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

for ch, a_path, t_path in [
    ('ch04', 'uploads/audio/ambulance/4 - DALE.mp3', 'uploads/transcripts/ambulance/ch04_4 - DALE.mp3.json'),
    ('ch05', 'uploads/audio/ambulance/5 - A DAY INSIDE.mp3', 'uploads/transcripts/ambulance/ch05_5 - A DAY INSIDE.mp3.json')
]:
    dur = get_audio_duration(a_path)
    with open(t_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f'=== {ch} ===')
    print(f'Audio duration: {dur:.3f}s, Segments count: {len(data)}')
    for i, seg in enumerate(data):
        s = seg['start']
        e = seg['end']
        print(f"{i:02d}: [{s:6.2f} - {e:6.2f}] (dur: {e-s:5.2f}s) {seg['text'].strip()}")
