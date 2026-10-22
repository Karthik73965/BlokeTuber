import json

def analyze_chapter(ch_num, json_path):
    data = json.load(open(json_path, encoding='utf-8'))
    print(f"\n================ CHAPTER {ch_num} ({data.get('duration')}s) ================")
    for i, seg in enumerate(data.get('segments', [])):
        print(f"[{i:02d}] {seg['start']:6.2f} - {seg['end']:6.2f} ({seg['end']-seg['start']:4.2f}s): {seg['text']}")
        # print words if segment is long (> 5s)
        if seg['end'] - seg['start'] > 5.5 and seg.get('words'):
            sub_words = [f"{w['word']}({w['start']:.1f}-{w['end']:.1f})" for w in seg['words']]
            print("     " + " ".join(sub_words[:12]) + " ...")

analyze_chapter("05", "uploads/transcripts/camperbike/chapter_05.json")
analyze_chapter("06", "uploads/transcripts/camperbike/chapter_06.json")
analyze_chapter("07", "uploads/transcripts/camperbike/chapter_07.json")
