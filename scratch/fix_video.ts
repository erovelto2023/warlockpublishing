import { connectToDatabase } from './lib/db';
import GlossaryTerm from './lib/models/GlossaryTerm';
import { isYouTubeVideoActive, searchYouTubeVideo } from './lib/actions/glossary';

async function testFix() {
    await connectToDatabase();
    const term = await GlossaryTerm.findOne({ slug: 'graphics-infographics' });
    if (!term) {
        console.log("Term not found");
        return;
    }
    
    console.log("Found Term:", term.term);
    console.log("Current Video ID:", term.youtubeVideoId);
    
    if (term.youtubeVideoId) {
        const active = await isYouTubeVideoActive(term.youtubeVideoId);
        console.log("Is Active?", active);
    } else {
        console.log("No video ID present");
    }
    
    console.log("Searching for replacement...");
    const replacement = await searchYouTubeVideo(term.term);
    console.log("Replacement found:", replacement);
    
    if (replacement && replacement !== term.youtubeVideoId) {
        console.log("Updating term with new video...");
        await GlossaryTerm.findByIdAndUpdate(term._id, { youtubeVideoId: replacement });
        console.log("Updated!");
    }
}

testFix().then(() => process.exit());
