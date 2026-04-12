/**
 * Run this on the production server:
 *   node fix-internet-marketing-video.mjs
 * 
 * It reads MONGODB_URI from .env.local and directly fixes the broken video URL.
 */
import { readFileSync } from 'fs';
import { createConnection } from 'mongoose';

// Parse .env.local manually
const envContent = readFileSync('.env.local', 'utf-8');
const mongoMatch = envContent.match(/MONGODB_URI=(.+)/);
const MONGODB_URI = mongoMatch?.[1]?.trim();
if (!MONGODB_URI) { console.error('MONGODB_URI not found in .env.local'); process.exit(1); }

console.log('Connecting to:', MONGODB_URI.replace(/\/\/[^@]+@/, '//<redacted>@'));

const conn = await createConnection(MONGODB_URI).asPromise();
const db = conn.db;

// 1. Find the term
const term = await db.collection('glossaryterms').findOne({ slug: 'internet-marketing' });
if (!term) {
    // Try case-insensitive or partial match
    const all = await db.collection('glossaryterms').find({ term: /internet.marketing/i }).toArray();
    console.log('Not found by slug. Partial matches:', all.map(t => ({ slug: t.slug, term: t.term })));
    await conn.close();
    process.exit(0);
}

console.log('Found term:', term.term);
console.log('youtubeVideo:', term.youtubeVideo);
console.log('videoUrl:', term.videoUrl);

const rawUrl = term.youtubeVideo?.url || term.videoUrl;
console.log('Raw URL:', rawUrl);

// 2. Normalize URL
function normalizeYouTubeUrl(url) {
    if (!url) return null;
    if (url.includes('youtube.com/watch')) return url;
    const embed = url.match(/youtube\.com\/embed\/([^?&]+)/);
    if (embed) return `https://www.youtube.com/watch?v=${embed[1]}`;
    const short = url.match(/youtu\.be\/([^?&]+)/);
    if (short) return `https://www.youtube.com/watch?v=${short[1]}`;
    if (/^[a-zA-Z0-9_-]{11}$/.test(url.trim())) return `https://www.youtube.com/watch?v=${url.trim()}`;
    return url;
}

const normalized = rawUrl ? normalizeYouTubeUrl(rawUrl) : null;
console.log('Normalized:', normalized);

// 3. Check oEmbed
if (normalized) {
    const res = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(normalized)}&format=json`);
    console.log('oEmbed status for current URL:', res.status);
    
    if (res.status === 200) {
        console.log('✅ Current video is live. No fix needed.');
        await conn.close();
        process.exit(0);
    }
}

// 4. Search for replacement
console.log('🔴 Video is broken. Searching YouTube for replacement...');
const searchRes = await fetch(
    `https://www.youtube.com/results?search_query=${encodeURIComponent(term.term + ' marketing tutorial')}`,
    { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0' }}
);
const html = await searchRes.text();
const match = html.match(/ytInitialData\s*=\s*({.+?});/);

if (!match) {
    console.error('❌ Could not parse ytInitialData');
    await conn.close();
    process.exit(1);
}

const data = JSON.parse(match[1]);
const contents = 
    data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];

let fixed = false;
for (const item of contents) {
    if (!item.videoRenderer) continue;
    const videoId = item.videoRenderer.videoId;
    const title = item.videoRenderer.title?.runs?.[0]?.text || '';
    const channel = item.videoRenderer.ownerText?.runs?.[0]?.text || '';
    const newUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    const verifyRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(newUrl)}&format=json`);
    console.log(`  Candidate: ${title.slice(0,50)} | ${newUrl} | status: ${verifyRes.status}`);
    
    if (verifyRes.status === 200) {
        const result = await db.collection('glossaryterms').updateOne(
            { slug: 'internet-marketing' },
            { $set: {
                videoUrl: newUrl,
                'youtubeVideo.url': newUrl,
                'youtubeVideo.title': title,
                'youtubeVideo.channel': channel,
            }}
        );
        console.log(`\n✅ Fixed! Updated ${result.modifiedCount} document(s)`);
        console.log(`   New URL: ${newUrl}`);
        console.log(`   Title: ${title}`);
        fixed = true;
        break;
    }
}

if (!fixed) {
    console.error('❌ All candidates failed oEmbed verification. Manual fix required.');
}

await conn.close();
process.exit(0);
