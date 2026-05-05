import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import GlossaryTerm from '../lib/models/GlossaryTerm';

dotenv.config({ path: '.env.local' });

async function fixHeadings() {
    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        const terms = await GlossaryTerm.find({ 
            $or: [
                { articleContent: /H2:/ },
                { articleContent: /H3:/ },
                { definition: /H2:/ },
                { definition: /H3:/ }
            ]
        });

        console.log(`Found ${terms.length} terms to fix.`);

        for (const term of terms) {
            console.log(`Fixing: ${term.term}`);
            
            if (term.articleContent) {
                term.articleContent = term.articleContent
                    .replace(/H2:\s*/g, '## ')
                    .replace(/H3:\s*/g, '### ');
            }
            
            if (term.definition) {
                term.definition = term.definition
                    .replace(/H2:\s*/g, '## ')
                    .replace(/H3:\s*/g, '### ');
            }

            await term.save();
        }

        console.log('All headings fixed!');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
}

fixHeadings();
