import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { getGlossaryTermBySlug } from '../lib/actions/glossary';

async function test() {
    const slug = process.argv[2] || 'ai-overview';
    const term = await getGlossaryTermBySlug(slug);
    console.log('Test result for', slug, ':', term ? 'FOUND: ' + term.term : 'NOT FOUND');
    process.exit(0);
}

test();
