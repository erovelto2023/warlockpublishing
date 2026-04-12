const term = '3D Printing';
fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(term + ' explanation')}`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
}).then(res => res.text()).then(html => {
    const match = html.match(/ytInitialData\s*=\s*({.+?});/);
    if (!match) { console.log('NO MATCH'); process.exit(1); }
    const data = JSON.parse(match[1]);
    const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
    for (const item of contents) {
        if (item.videoRenderer) {
            console.log('FOUND:', item.videoRenderer.title.runs[0].text);
            process.exit(0);
        }
    }
    console.log('NO VIDEOS IN JSON');
})
