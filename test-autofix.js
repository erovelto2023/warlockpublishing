const term = { term: 'Internet Marketing', url: 'example123' };

async function testFix() {
    console.log('Testing url:', term.url);
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(term.url)}&format=json`);
    console.log('Oembed status:', res.status);
    
    if (res.status === 404 || res.status === 400 || res.status === 401 || res.status === 403) {
        console.log('Detected as broken! Attempting auto-fix...');
        try {
            const searchRes = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(term.term + " explanation")}`, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
            });
            const html = await searchRes.text();
            const match = html.match(/ytInitialData\s*=\s*({.+?});/);
            if (match) {
                const data = JSON.parse(match[1]);
                const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
                let found = false;
                for (const item of contents) {
                    if (item.videoRenderer) {
                        const newUrl = `https://www.youtube.com/watch?v=${item.videoRenderer.videoId}`;
                        console.log('Found replacement!', newUrl);
                        found = true;
                        break;
                    }
                }
                if (!found) console.log('Parsed JSON but no videoRenderer found.');
            } else {
                console.log('No ytInitialData match found in HTML');
            }
        } catch (e) {
            console.error('Search error:', e);
        }
    } else {
        console.log('Not detected as broken.');
    }
}
testFix();
