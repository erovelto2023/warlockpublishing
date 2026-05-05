
async function findYoutubeVideo(keyword) {
    const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(keyword)}&sp=EgIQAQ%253D%253D`; // sp filter for videos only
    try {
        const res = await fetch(searchUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });
        const html = await res.text();
        
        // Find the first video ID
        // YouTube results contain "videoId":"XXXXXXXXXXX" in the JSON data embedded in the HTML
        const match = html.match(/"videoId":"([^"]{11})"/);
        if (match && match[1]) {
            return `https://www.youtube.com/watch?v=${match[1]}`;
        }
        return null;
    } catch (e) {
        console.error('Search failed:', e.message);
        return null;
    }
}

const keyword = 'Aromatherapy Healing Guide';
findYoutubeVideo(keyword).then(url => console.log('Found URL:', url));
