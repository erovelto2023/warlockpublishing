import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { connectToDatabase } from '../lib/db';
import GlossaryTerm from '../lib/models/GlossaryTerm';

async function check() {
    await connectToDatabase();
    const terms = await GlossaryTerm.find({ slug: 'ai-overview' });
    console.log('Results:', JSON.stringify(terms, null, 2));
    process.exit(0);
}

check();
