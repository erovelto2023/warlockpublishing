
import mongoose from 'mongoose';
import GlossaryTerm from '../lib/models/GlossaryTerm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function findCapcut() {
    await mongoose.connect(process.env.MONGODB_URI);
    const terms = await GlossaryTerm.find({ slug: /capcut/i });
    console.log('Capcut terms:', JSON.stringify(terms, null, 2));
    mongoose.connection.close();
}

findCapcut();
