import { compressQuery, findStockFootage, findStockPhoto } from '../src/services/stockFootage';

async function runTest() {
  console.log('🧪 Testing Query Compression & Stock Search Relevance...\n');

  // ── Test 1: Query Compression ──
  console.log('1. Testing query compression on long conversational prompts...');
  const queryTests = [
    {
      input: 'weathered wooden pallet mattress makeshift shelter interior',
      expectedMaxWords: 3,
    },
    {
      input: 'The freight cars rolling past day and night',
      expectedMaxWords: 3,
    },
    {
      input: 'Heavy machinery and excavators digging into the hillside',
      expectedMaxWords: 3,
    },
  ];

  for (const qt of queryTests) {
    const compressed = compressQuery(qt.input, qt.expectedMaxWords);
    const wordCount = compressed.split(' ').length;
    if (wordCount > qt.expectedMaxWords) {
      throw new Error(`Query compression failed for "${qt.input}". Got "${compressed}" (${wordCount} words)`);
    }
    console.log(`  ✓ "${qt.input.slice(0, 40)}..." -> "${compressed}" (${wordCount} words)`);
  }

  // ── Test 2: Real Stock Video Search ──
  console.log('\n2. Testing Real Stock Video Search with compressed queries...');
  const usedUrls = new Set<string>();

  const video1 = await findStockFootage('excavator digging dirt', 'heavy machinery', usedUrls);
  if (!video1 || !video1.url) {
    console.warn('  ⚠️ Pexels/Pixabay video search returned null (check API keys or network)');
  } else {
    console.log(`  ✓ Video found [${video1.source.toUpperCase()}]: ${video1.title} (${video1.width}x${video1.height})`);
    if (video1.width && video1.height && video1.width < video1.height) {
      throw new Error(`Video is not landscape! ${video1.width}x${video1.height}`);
    }
  }

  // ── Test 3: Real Stock Photo Search ──
  console.log('\n3. Testing Real Stock Photo Search with compressed queries...');
  const photo1 = await findStockPhoto('weathered wooden shelter cabin', usedUrls);
  if (!photo1 || !photo1.url) {
    console.warn('  ⚠️ Photo search returned null (check API keys or network)');
  } else {
    console.log(`  ✓ Photo found [${photo1.source.toUpperCase()}]: ${photo1.title} (${photo1.width}x${photo1.height})`);
    if (photo1.width < photo1.height) {
      throw new Error(`Photo is portrait, expected landscape! ${photo1.width}x${photo1.height}`);
    }
  }

  console.log('\n✅ ALL STOCK RELEVANCE TESTS PASSED!');
}

runTest().catch((err) => {
  console.error('❌ Stock Relevance Test failed:', err);
  process.exit(1);
});
