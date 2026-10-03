import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const pexelsKey = process.env.PEXELS_API_KEY;
  console.log('Testing Pexels API with key length:', pexelsKey?.length);
  const res = await fetch('https://api.pexels.com/videos/search?query=freeway+traffic&per_page=3&orientation=landscape', {
    headers: { Authorization: pexelsKey || '' }
  });
  console.log('Pexels status:', res.status);
  if (res.ok) {
    const data = (await res.json()) as any;
    console.log('Found videos:', data.videos?.length);
    data.videos?.forEach((v: any) => {
      console.log(' - ID:', v.id, '| Title:', v.url.split('/').pop(), '| Download:', v.video_files?.[0]?.link?.slice(0, 60));
    });
  }

  const pixabayKey = process.env.PIXABAY_API_KEY;
  console.log('\nTesting Pixabay API with key length:', pixabayKey?.length);
  const pRes = await fetch(`https://pixabay.com/api/videos/?key=${pixabayKey}&q=traffic&per_page=3&safesearch=true`);
  console.log('Pixabay status:', pRes.status);
  if (pRes.ok) {
    const pData = (await pRes.json()) as any;
    console.log('Pixabay found videos:', pData.hits?.length);
    pData.hits?.forEach((h: any) => {
      console.log(' - ID:', h.id, '| Tags:', h.tags, '| Download:', h.videos?.medium?.url?.slice(0, 60));
    });
  }
}

test().catch(err => console.error('Error:', err));
