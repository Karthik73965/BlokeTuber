import subprocess
import json
import sys

query = sys.argv[1] if len(sys.argv) > 1 else 'CheapRVliving ambulance conversion'
p = subprocess.Popen(['yt-dlp', '--dump-json', f'ytsearch5:{query}'], stdout=subprocess.PIPE, text=True)

for line in p.stdout:
    line = line.strip()
    if not line:
        continue
    try:
        d = json.loads(line)
        print(f"{d.get('title')} | https://www.youtube.com/watch?v={d.get('id')} | {d.get('duration')}s")
    except Exception as e:
        pass
