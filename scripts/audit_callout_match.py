import glob, json, sys, re
sys.stdout.reconfigure(encoding='utf-8')

clean_re = re.compile(r'[^a-zA-Z0-9 ]')

mismatch_count = 0
total_callouts = 0

for f in sorted(glob.glob('uploads/timelines/steeldoor/chapter_*.json')):
    d = json.load(open(f, 'r', encoding='utf-8'))
    for c in d['clips']:
        co = c.get('callout')
        if not co:
            continue
        
        total_callouts += 1
        b_text = c.get('text', '')
        l1 = co.get('line1', '')
        l2 = co.get('line2', '')
        
        b_words = set(clean_re.sub(' ', b_text.lower()).split())
        c_words = set(clean_re.sub(' ', (l1 + ' ' + l2).lower()).split())
        
        stopwords = {'the', 'a', 'an', 'and', 'or', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'is', 'was', 'were', 'it', 'she', 'he', 'her', 'his', 'that', 'this', 'there', 'what', 'who'}
        meaningful_c_words = c_words - stopwords
        meaningful_b_words = b_words - stopwords
        
        common = meaningful_c_words.intersection(meaningful_b_words)
        
        nums_in_b = re.findall(r'\b\d+(?:,\d+)*(?:\.\d+)?\b', b_text)
        nums_in_c = re.findall(r'\b\d+(?:,\d+)*(?:\.\d+)?\b', l1 + ' ' + l2)
        
        nums_match = False
        if nums_in_c:
            for nc in nums_in_c:
                nc_clean = nc.replace(',', '').split('.')[0]
                for nb in nums_in_b:
                    if nc_clean == nb.replace(',', '').split('.')[0]:
                        nums_match = True
                        break
        
        if len(common) == 0 and not nums_match:
            mismatch_count += 1
            print(f"❌ MISMATCH in {f[-22:]} Beat {c['beatIndex']}:")
            print(f"   Beat text: \"{b_text}\"")
            print(f"   Callout L1: \"{l1}\"")
            print(f"   Callout L2: \"{l2}\"")
            print("-" * 50)

print(f"\nAudit finished: {mismatch_count} out of {total_callouts} callouts have ZERO semantic grounding with the beat text!")
