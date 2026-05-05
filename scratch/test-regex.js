
function extractYouTubeId(urlOrId) {
    if (!urlOrId) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = urlOrId.match(regExp);
    return (match && match[2].length === 11) ? match[2] : urlOrId;
}

console.log('Test 1:', extractYouTubeId('https://www.youtube.com/watch?v=3xvvtVDJrCM'));
console.log('Test 2:', extractYouTubeId('3xvvtVDJrCM'));
console.log('Test 3:', extractYouTubeId('https://youtu.be/3xvvtVDJrCM?si=xxxxx'));
