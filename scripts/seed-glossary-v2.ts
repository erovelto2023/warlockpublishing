import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import mongoose from 'mongoose';
import GlossaryTerm from '../lib/models/GlossaryTerm';

dotenv.config({ path: '.env.local' });

const GUIDE_DATA_PATH = path.join(process.cwd(), 'ai-seo-glossary-directory', 'client', 'src', 'data');

async function seed() {
    console.log('Starting Glossary V2 Seed...');

    const MONGODB_URI = process.env.MONGODB_URI;
    if (!MONGODB_URI) {
        console.error('MONGODB_URI not found in .env.local');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Read guide data files
        const glossaryJson = JSON.parse(fs.readFileSync(path.join(GUIDE_DATA_PATH, 'glossary.json'), 'utf8'));
        const checklistsJson = JSON.parse(fs.readFileSync(path.join(GUIDE_DATA_PATH, 'checklists.json'), 'utf8'));
        const enhancementsJson = JSON.parse(fs.readFileSync(path.join(GUIDE_DATA_PATH, 'enhancements.json'), 'utf8'));

        const entries = glossaryJson.glossaryEntries;
        const checklists = checklistsJson.checklists;
        const enhancements = enhancementsJson.glossaryEnhancements;

        console.log(`Found ${entries.length} entries to process.`);

        for (const entry of entries) {
            const termId = entry.id;
            const termChecklist = checklists[termId];
            const termEnhancement = enhancements[termId];

            const richData = {
                term: entry.term,
                slug: entry.slug,
                category: entry.category,
                difficulty: entry.difficulty,
                snapshot: entry.snapshot,
                definition: entry.definition,
                characteristics: entry.characteristics,
                youtubeVideoId: entry.youtubeVideoId,
                faqItems: entry.faqItems || [],
                relatedTerms: entry.relatedTerms || [],
                monetizationIdeas: entry.monetizationIdeas || {
                    affiliateProducts: [],
                    courseTopics: [],
                    digitalDownloads: []
                },
                checklist: termChecklist ? {
                    title: termChecklist.title,
                    description: termChecklist.description,
                    items: termChecklist.items.map((item: any) => ({
                        task: item.task,
                        description: item.description
                    }))
                } : undefined,
                marketingStrategy: termEnhancement?.marketingStrategy ? {
                    hooks: termEnhancement.marketingStrategy.hooks,
                    headlines: termEnhancement.marketingStrategy.headlines,
                    titles: termEnhancement.marketingStrategy.titles,
                    contentIdeas: termEnhancement.marketingStrategy.contentIdeas,
                    socialPosts: termEnhancement.marketingStrategy.socialPosts
                } : undefined,
                seoStrategy: termEnhancement?.seoStrategy ? {
                    monthlySearchVolume: parseInt(termEnhancement.seoStrategy.monthlySearchVolume) || 0,
                    volumeRange: termEnhancement.seoStrategy.volumeRange,
                    difficulty: termEnhancement.seoStrategy.difficulty,
                    relatedKeywords: termEnhancement.seoStrategy.relatedKeywords
                } : undefined,
                isPublished: true,
                viewCount: 0
            };

            await GlossaryTerm.findOneAndUpdate(
                { slug: richData.slug },
                richData,
                { upsert: true, new: true }
            );
            console.log(`- Seeded: ${richData.term}`);
        }

        console.log('Seed completed successfully!');
    } catch (error) {
        console.error('Seed failed:', error);
    } finally {
        await mongoose.disconnect();
    }
}

seed();
