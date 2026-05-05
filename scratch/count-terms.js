
import mongoose from 'mongoose';
import GlossaryTerm from '../lib/models/GlossaryTerm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function countTerms() {
    await mongoose.connect(process.env.MONGODB_URI);
    const count = await GlossaryTerm.countDocuments({});
    console.log('Total terms:', count);
    const sample = await GlossaryTerm.find({}, { slug: 1 }).limit(100);
    console.log('Slugs:', sample.map(s => s.slug).join(', '));
    mongoose.connection.close();
}

countTerms();
