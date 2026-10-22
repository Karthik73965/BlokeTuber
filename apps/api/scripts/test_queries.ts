import fs from 'fs';
import path from 'path';

const PEXELS_KEY = 'IsEyAaH3KB99divi9zwyCzIfmZLD6DEmexyGV6L8VlaLzrNnZ6atuMEa';

async function searchPexels(query: string) {
  console.log(`\n=== Query: "${query}" ===`);
  const res = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`, {
    headers: { Authorization: PEXELS_KEY }
  });
  const data = await res.json() as any;
  if (data.videos) {
    for (const v of data.videos) {
      console.log(`ID: ${v.id} | dur: ${v.duration}s | url: ${v.url}`);
    }
  }
}

async function main() {
  await searchPexels('homeless winter cold');
  await searchPexels('man shivering cold winter snow');
  await searchPexels('los angeles sunrise skyline');
  await searchPexels('city sunrise skyline dawn');
  await searchPexels('weathered plastic fiberglass');
}

main().catch(console.error);
