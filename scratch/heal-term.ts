import { connectToDatabase } from '../lib/db';
import GlossaryTerm from '../lib/models/GlossaryTerm';
import { formatAmazonLink } from '../lib/utils';
import { searchYouTubeForTerm } from '../lib/actions/glossary';

async function healBillionaireBoss() {
    await connectToDatabase();
    const term = await GlossaryTerm.findOne({ slug: 'billionaire-boss' });
    if (!term) {
        console.log("Term not found");
        return;
    }

    console.log("Healing billionaire-boss...");

    // 1. Fix Amazon Links
    if (term.amazonProducts) {
        term.amazonProducts = term.amazonProducts.map((p: any) => ({
            ...p,
            url: formatAmazonLink(p.url || '')
        }));
    }

    // 2. Fix YouTube Video
    const newVideo = await searchYouTubeForTerm(term.term, term.category);
    if (newVideo) {
        term.youtubeVideo = newVideo;
        term.videoUrl = newVideo.url;
    }

    await term.save();
    console.log("Healed!");
    process.exit(0);
}

healBillionaireBoss();
