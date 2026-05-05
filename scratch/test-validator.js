
async function isYouTubeVideoActive(urlOrId) {
    if (!urlOrId) return false;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : urlOrId;
    if (id.length !== 11) return false;
    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        console.log(`ID: ${id}, Status: ${response.status}, OK: ${response.ok}`);
        return response.ok;
    } catch (error) {
        return false;
    }
}

isYouTubeVideoActive('3xvvtVDJrCM');
isYouTubeVideoActive('P51CqlPOE_w');
