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

    const all = await GlossaryTerm.find({}, 'term slug category isPublished').lean();
    console.log('ALL TERMS IN DB:');
    all.forEach((t, i) => {
        console.log(`${i+1}. Term: "${t.term}", Slug: "${t.slug}", Category: "${t.category}", Published: ${t.isPublished}`);
    });

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
