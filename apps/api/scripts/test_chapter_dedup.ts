import { projectsStore, chaptersStore, UsedMediaItem } from '../src/db/localStore';

async function runTest() {
  console.log('🧪 Testing Project & Chapter Architecture with Persistent Media Deduplication...\n');

  // 1. Create a test project
  const testProjectId = `proj_test_${Date.now()}`;
  const project = projectsStore.create({
    id: testProjectId,
    name: 'Homeless Cabin Documentary Project',
    scriptText: '',
    status: 'draft',
  });
  console.log(`1. Created Project: "${project.name}" (ID: ${project.id})`);

  // 2. Create Chapter 1 & Chapter 2
  const ch1 = chaptersStore.create(testProjectId, {
    title: 'Chapter 1: The Discovery',
    scriptText: 'An excavator dug into the hillside at dawn.',
    chapterIndex: 1,
  });
  const ch2 = chaptersStore.create(testProjectId, {
    title: 'Chapter 2: The Enclave',
    scriptText: 'Inside the cabin police found multiple generators.',
    chapterIndex: 2,
  });
  console.log(`2. Created Chapter 1: "${ch1?.title}" and Chapter 2: "${ch2?.title}"`);

  // 3. Simulate Chapter 1 media resolution
  const ch1Media: UsedMediaItem[] = [
    {
      id: 'pexels_1001',
      url: 'https://images.pexels.com/photos/1001/excavator.jpg',
      source: 'pexels',
      mediaType: 'video',
      chapterIndex: 1,
      query: 'excavator digging',
      usedAt: new Date().toISOString(),
    },
    {
      id: 'pixabay_2001',
      url: 'https://pixabay.com/photos/2001/cabin.jpg',
      source: 'pixabay',
      mediaType: 'image',
      chapterIndex: 1,
      query: 'makeshift cabin',
      usedAt: new Date().toISOString(),
    },
  ];

  projectsStore.addUsedMedia(testProjectId, ch1Media);
  const storedAfterCh1 = projectsStore.getUsedMedia(testProjectId);
  console.log(`3. Chapter 1 resolved ${ch1Media.length} media items. Total project usedMedia: ${storedAfterCh1.length}`);

  if (storedAfterCh1.length !== 2) {
    throw new Error(`Expected 2 items in project usedMedia, got ${storedAfterCh1.length}`);
  }

  // 4. Simulate Chapter 2 media resolution with deduplication check
  const existingSet = new Set<string>(storedAfterCh1.map((m) => m.url));

  // Verify that Chapter 2 excludes all Chapter 1 media URLs
  for (const item of ch1Media) {
    if (!existingSet.has(item.url)) {
      throw new Error(`Deduplication registry failed to track Chapter 1 URL: ${item.url}`);
    }
  }
  console.log('4. Verified Chapter 2 deduplication exclusion set correctly contains Chapter 1 items.');

  const ch2Media: UsedMediaItem[] = [
    {
      id: 'pexels_3001',
      url: 'https://images.pexels.com/photos/3001/generator.jpg',
      source: 'pexels',
      mediaType: 'image',
      chapterIndex: 2,
      query: 'portable generator',
      usedAt: new Date().toISOString(),
    },
  ];

  projectsStore.addUsedMedia(testProjectId, ch2Media);
  const storedAfterCh2 = projectsStore.getUsedMedia(testProjectId);
  console.log(`5. Chapter 2 added 1 new media item. Total cumulative project usedMedia: ${storedAfterCh2.length}`);

  if (storedAfterCh2.length !== 3) {
    throw new Error(`Expected 3 total cumulative items, got ${storedAfterCh2.length}`);
  }

  // Clean up test project
  projectsStore.delete(testProjectId);
  console.log('\n✅ ALL PROJECT & CHAPTER DEDUPLICATION TESTS PASSED!');
}

runTest().catch((err) => {
  console.error('❌ Chapter Dedup Test failed:', err);
  process.exit(1);
});
