const mongoose = require('mongoose');
// Use global fetch (Node 18+)

// Minimalist Mock of the actions to avoid import issues in scratch
async function isYouTubeVideoActive(id) {
    if (!id || id.length !== 11) return false;
    try {
        const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
        return response.status === 200;
    } catch (e) { return true; }
}

async function searchYouTubeVideo(keyword) {
    const queries = [`${keyword} guide`, `${keyword} explained`];
    for (const query of queries) {
        try {
            const res = await fetch(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`);
            const html = await res.text();
            const match = html.match(/"videoId":"([^"]{11})"/);
            if (match) return match[1];
        } catch (e) {}
    }
    return null;
}

const MONGODB_URI = "mongodb://localhost:27017/warlock_publishing";

const GlossarySchema = new mongoose.Schema({
    term: String,
    slug: String,
    youtubeVideoId: String
}, { strict: false });

const GlossaryTerm = mongoose.models.GlossaryTerm || mongoose.model('GlossaryTerm', GlossarySchema);

async function run() {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to DB");
    
    const term = await GlossaryTerm.findOne({ slug: 'graphics-infographics' });
    if (!term) {
        console.log("Term not found");
        return;
    }
    
    console.log("Found:", term.term, "| Current Video:", term.youtubeVideoId);
    
    const active = await isYouTubeVideoActive(term.youtubeVideoId);
    console.log("Is Active?", active);
    
    if (!active || !term.youtubeVideoId) {
        console.log("Healing...");
        const replacement = await searchYouTubeVideo(term.term);
        if (replacement) {
            console.log("Found replacement:", replacement);
            await GlossaryTerm.findByIdAndUpdate(term._id, { youtubeVideoId: replacement });
            console.log("Update Complete!");
        } else {
            console.log("No replacement found.");
        }
    } else {
        console.log("Video is actually reported as active by oEmbed. Checking for common issues...");
        // Maybe the ID is a full URL and needs extraction?
        if (term.youtubeVideoId.includes('youtube.com')) {
            const id = term.youtubeVideoId.match(/[?&]v=([^&]+)/)?.[1];
            if (id) {
                console.log("Extracted ID from URL:", id);
                await GlossaryTerm.findByIdAndUpdate(term._id, { youtubeVideoId: id });
                console.log("Fixed by converting URL to ID.");
            }
        }
    }
    
    await mongoose.disconnect();
}

run();
