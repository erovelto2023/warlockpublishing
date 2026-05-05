
import mongoose from 'mongoose';
import GlossaryTerm from '../lib/models/GlossaryTerm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function addTerm() {
    await mongoose.connect(process.env.MONGODB_URI);
    const termData = {
        term: "Capcut Watermark",
        slug: "capcut-watermark",
        category: "Video Editing",
        difficulty: "Beginner",
        snapshot: "A technical identifier embedded in exported media files by the CapCut editing software.",
        definition: "The CapCut watermark is a branding element placed at the end of video exports. It can be removed by deleting the final clip in the timeline or by toggling off the default ending in the settings menu.",
        youtubeVideoId: "3xvvtVDJrCM",
        isPublished: true,
        viewCount: 0
    };
    
    await GlossaryTerm.findOneAndUpdate(
        { slug: "capcut-watermark" },
        termData,
        { upsert: true, new: true }
    );
    console.log('Term added/updated');
    mongoose.connection.close();
}

addTerm();
