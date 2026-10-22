import json
import subprocess

def get_audio_duration(path):
    cmd = ['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', path]
    res = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(res.stdout.strip())

for ch, a_path, t_path in [
    ('ch02', 'uploads/audio/ambulance/2 - WHAT AN AMBULANCE.mp3', 'uploads/transcripts/ambulance/ch02_2 - WHAT AN AMBULANCE.mp3.json'),
    ('ch03', 'uploads/audio/ambulance/3- WHY IS ITSO CHEAP.mp3', 'uploads/transcripts/ambulance/ch03_3- WHY IS ITSO CHEAP.mp3.json')
]:
    dur = get_audio_duration(a_path)
    with open(t_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    print(f'=== {ch} ===')
    print(f'Audio duration: {dur:.3f}s')
    print(f'Segments count: {len(data)}')
    for i, seg in enumerate(data):
        print(f"{i}: [{seg.get('start', 0):.2f} - {seg.get('end', 0):.2f}] {seg.get('text', '').strip()}")
