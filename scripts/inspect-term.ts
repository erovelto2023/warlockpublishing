import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { connectToDatabase } from '../lib/db';
import GlossaryTerm from '../lib/models/GlossaryTerm';

async function check() {
    await connectToDatabase();
    const slug = process.argv[2] || 'ai-overview';
    const terms = await GlossaryTerm.find({ slug });
    console.log('Results for', slug, ':', JSON.stringify(terms, null, 2));
    process.exit(0);
}

check();
