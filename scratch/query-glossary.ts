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
if (!MONGODB_URI) {
    console.error('MONGODB_URI not defined');
    process.exit(1);
}

async function run() {
    await mongoose.connect(MONGODB_URI!);
    console.log('Connected to MongoDB');

    const GlossaryTermSchema = new mongoose.Schema({}, { strict: false, collection: 'glossaryterms' });
    const GlossaryTerm = mongoose.models.GlossaryTerm || mongoose.model('GlossaryTerm', GlossaryTermSchema);

    const count = await GlossaryTerm.countDocuments({});
    console.log('Total glossary terms in DB:', count);

    const duplicates = await GlossaryTerm.find({
        term: { $in: ['beach wedding bridesmaid dresses', 'beaded bridesmaid dress'] }
    });
    console.log('Matching terms in DB:', duplicates);

    const allTerms = await GlossaryTerm.find({}, 'term slug isPublished').limit(20);
    console.log('Sample terms in DB:', allTerms);

    process.exit(0);
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
