
async function testOembed(id) {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`;
    const response = await fetch(url);
    console.log(`ID: ${id}, Status: ${response.status}`);
}

testOembed('JtTRxskQCJ4');
