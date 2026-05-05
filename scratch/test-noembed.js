
async function testNoEmbed(id) {
    const url = `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${id}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(`ID: ${id}, Title: ${data.title}, Error: ${data.error}`);
}

testNoEmbed('3xvvtVDJrCM');
