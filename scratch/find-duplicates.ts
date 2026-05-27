import mongoose from 'mongoose';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
if (fs.existsSync('.env.local')) {
    const envConfig = dotenv.parse(fs.readFileSync('.env.local'));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const MONGODB_URI = process.env.MONGODB_URI;

async function run() {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    const GlossaryTermSchema = new mongoose.Schema({}, { strict: false, collection: 'glossaryterms' });
    const GlossaryTerm = mongoose.models.GlossaryTerm || mongoose.model('GlossaryTerm', GlossaryTermSchema);

    const all = await GlossaryTerm.find({}, 'term slug').lean();
    
    // Check for exact duplicates or case-insensitive duplicates
    const terms = all.map(t => t.term.toLowerCase().trim());
    const uniqueTerms = new Set(terms);
    console.log('Total terms:', all.length);
    console.log('Unique case-insensitive terms count:', uniqueTerms.size);

    if (all.length !== uniqueTerms.size) {
        console.log('Case-insensitive duplicates found!');
        const seen = new Set();
        all.forEach(t => {
            const normalized = t.term.toLowerCase().trim();
            if (seen.has(normalized)) {
                console.log(`Duplicate: "${t.term}" (Slug: "${t.slug}", ID: ${t._id})`);
            } else {
                seen.add(normalized);
            }
        });
    } else {
        console.log('No case-insensitive duplicates found in the DB.');
    }

    // Check for slug conflicts
    const slugs = all.map(t => t.slug);
    const uniqueSlugs = new Set(slugs);
    console.log('Unique slugs count:', uniqueSlugs.size);
    if (all.length !== uniqueSlugs.size) {
        console.log('Slug duplicates found!');
    } else {
        console.log('No slug duplicates found in the DB.');
    }

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
