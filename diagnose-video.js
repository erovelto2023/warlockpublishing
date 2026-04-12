const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost:27017/warlock_publishing';

async function diagnose() {
    await mongoose.connect(MONGODB_URI);
    const db = mongoose.connection.db;
    
    const term = await db.collection('glossaryterms').findOne({ slug: 'internet-marketing' });
    if (!term) { console.log('Term not found'); process.exit(1); }
    
    console.log('--- DB Entry ---');
    console.log('term:', term.term);
    console.log('youtubeVideo:', JSON.stringify(term.youtubeVideo, null, 2));
    console.log('videoUrl:', term.videoUrl);
    
    const rawUrl = term.youtubeVideo?.url || term.videoUrl;
    console.log('\n--- Raw URL in DB ---:', rawUrl);
    
    if (!rawUrl) { console.log('No URL stored at all!'); process.exit(0); }
    
    // Normalize
    let normalized = rawUrl;
    if (!rawUrl.includes('youtube.com/watch')) {
        const embed = rawUrl.match(/youtube\.com\/embed\/([^?&]+)/);
        const short = rawUrl.match(/youtu\.be\/([^?&]+)/);
        if (embed) normalized = `https://www.youtube.com/watch?v=${embed[1]}`;
        else if (short) normalized = `https://www.youtube.com/watch?v=${short[1]}`;
        else if (/^[a-zA-Z0-9_-]{11}$/.test(rawUrl.trim())) normalized = `https://www.youtube.com/watch?v=${rawUrl.trim()}`;
    }
    console.log('Normalized URL:', normalized);
    
    // Check oEmbed
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(normalized)}&format=json`);
    console.log('oEmbed status:', res.status);
    
    if (res.status !== 200) {
        console.log('\n🔴 Video is broken. Attempting auto-fix via YouTube search...');
        const searchRes = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(term.term + ' explanation')}`, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        const html = await searchRes.text();
        const match = html.match(/ytInitialData\s*=\s*({.+?});/);
        if (match) {
            const data = JSON.parse(match[1]);
            const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
            let fixed = false;
            for (const item of contents) {
                if (item.videoRenderer) {
                    const newUrl = `https://www.youtube.com/watch?v=${item.videoRenderer.videoId}`;
                    const verifyRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(newUrl)}&format=json`);
                    console.log('Candidate:', newUrl, '| Verify status:', verifyRes.status);
                    if (verifyRes.status === 200) {
                        console.log('✅ Found live replacement! Writing to DB...');
                        await db.collection('glossaryterms').updateOne(
                            { slug: 'internet-marketing' },
                            { $set: { 
                                videoUrl: newUrl,
                                'youtubeVideo.url': newUrl,
                                'youtubeVideo.title': item.videoRenderer.title?.runs?.[0]?.text || '',
                                'youtubeVideo.channel': item.videoRenderer.ownerText?.runs?.[0]?.text || ''
                            }}
                        );
                        console.log('✅ DB updated with:', newUrl);
                        fixed = true;
                        break;
                    }
                }
            }
            if (!fixed) console.log('❌ All candidates failed oEmbed verify');
        } else {
            console.log('❌ Could not parse ytInitialData from YouTube search');
        }
    } else {
        console.log('⚠️  oEmbed says OK (200) - video appears live from server side.');
        console.log('The page may be showing a cached embed URL. Check the embed format used in the page template.');
    }
    
    await mongoose.disconnect();
    process.exit(0);
}

diagnose().catch(e => { console.error(e); process.exit(1); });
