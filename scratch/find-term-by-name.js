
import mongoose from 'mongoose';
import GlossaryTerm from '../lib/models/GlossaryTerm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function findTerm() {
    await mongoose.connect(process.env.MONGODB_URI);
    const term = await GlossaryTerm.findOne({ term: /capcut/i });
    console.log('Term found:', term ? JSON.stringify(term, null, 2) : 'NOT FOUND');
    mongoose.connection.close();
}

findTerm();
