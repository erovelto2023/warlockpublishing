import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { connectToDatabase } from '../lib/db';
import GlossaryTerm from '../lib/models/GlossaryTerm';

async function check() {
    await connectToDatabase();
    const count = await GlossaryTerm.countDocuments();
    console.log(`Total terms: ${count}`);
    const sample = await GlossaryTerm.find().limit(5).select('term slug');
    console.log('Sample terms:', JSON.stringify(sample, null, 2));
    process.exit(0);
}

check();
