
async function checkYoutube(id) {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    try {
        const res = await fetch(url);
        console.log(`Status for ${id}:`, res.status);
        if (res.ok) {
            const data = await res.json();
            console.log(`Data for ${id}:`, data.title);
        } else {
            console.log(`Error for ${id}:`, await res.text());
        }
    } catch (e) {
        console.error(`Fetch failed for ${id}:`, e.message);
    }
}

checkYoutube('3xvvtVDJrCM');
