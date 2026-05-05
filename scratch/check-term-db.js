
import mongoose from 'mongoose';
import GlossaryTerm from '../lib/models/GlossaryTerm';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function checkTerm() {
    await mongoose.connect(process.env.MONGODB_URI);
    const term = await GlossaryTerm.findOne({ slug: 'capcut-watermark' });
    console.log('Term in DB:', term ? JSON.stringify(term, null, 2) : 'NOT FOUND');
    mongoose.connection.close();
}

checkTerm();
