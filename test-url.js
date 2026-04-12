fetch('https://warlockpublishing.com/glossary/internet-marketing')
  .then(r => r.text())
  .then(html => {
    const match = html.match(/youtube\.com\/embed\/([^"?]+)/);
    if(match) console.log('Video ID:', match[1]);
    else console.log('No embed found');
  });
