
async function testPage(id) {
    const url = `https://www.youtube.com/watch?v=${id}`;
    const response = await fetch(url);
    console.log(`ID: ${id}, Status: ${response.status}`);
}

testPage('3xvvtVDJrCM');
testPage('INVALID_ID_XX');
