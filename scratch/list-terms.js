
import mongoose from 'mongoose';
import GlossaryTerm from '../lib/models/GlossaryTerm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function listTerms() {
    await mongoose.connect(process.env.MONGODB_URI);
    const terms = await GlossaryTerm.find({}, { term: 1, slug: 1 });
    console.log('Terms in DB:', JSON.stringify(terms, null, 2));
    mongoose.connection.close();
}

listTerms();
