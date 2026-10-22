import json

for ch, path in [('Ch 05', 'uploads/transcripts/camperbike/chapter_05.json'),
                 ('Ch 06', 'uploads/transcripts/camperbike/chapter_06.json'),
                 ('Ch 07', 'uploads/transcripts/camperbike/chapter_07.json')]:
    d = json.load(open(path, encoding='utf-8'))
    print(f"\n=================== {ch} ({d.get('duration')}s) ===================")
    for i, s in enumerate(d.get('segments', [])):
        print(f"{i:02d}: [{s['start']:6.2f} - {s['end']:6.2f}] {s['text']}")
