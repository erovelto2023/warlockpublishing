import { connectToDatabase } from './db';
import GlossaryTerm from './models/GlossaryTerm';

export async function auditGlossaryData() {
    console.log("Starting Glossary Term Data Audit & Migration");
    try {
        await connectToDatabase();
        const terms = await GlossaryTerm.find({});
        console.log(`Found ${terms.length} terms to audit.`);

        let updatedCount = 0;
        let errorCount = 0;

        await GlossaryTerm.collection.updateMany(
            {},
            { $unset: { marketingHooks: "" } }
        );
        console.log("Forcibly stripped all malformed marketingHooks via direct DB update.");

        const refetchedTerms = await GlossaryTerm.find({});
        
        for (const term of refetchedTerms) {
            let needsUpdate = false;

            // Enforce skillRequired enum ('Beginner', 'Intermediate', 'Advanced')
            if (!['Beginner', 'Intermediate', 'Advanced'].includes(term.skillRequired)) {
                term.skillRequired = 'Intermediate'; // Default fallback
            }

            // Enforce startupCost enum ('$0', '<$100', '$100+')
            if (!['$0', '<$100', '$100+'].includes(term.startupCost)) {
                term.startupCost = '<$100'; // Default fallback
            }
            if (term.isPublished === undefined) {
                term.isPublished = false;
            }

            // Ensure schema default lists exist
            if (!term.commonPitfalls || term.commonPitfalls.length === 0) {
                 // Option to prefill or just ensure array is present
                if (!term.commonPitfalls) term.commonPitfalls = [];
            }
            
            needsUpdate = true; // Force save to validate everything

            if (needsUpdate) {
                try {
                    await term.save();
                    updatedCount++;
                    console.log(`Updated term: ${term.term} (ID: ${term._id})`);
                } catch (e: any) {
                    console.error(`Error saving term ${term.term}:`, e.message);
                    errorCount++;
                }
            }
        }

        console.log(`Audit Complete. Total Terms Audited: ${terms.length}`);
        console.log(`Terms Updated: ${updatedCount}`);
        console.log(`Errors encountered: ${errorCount}`);
        
        return { success: true, updatedCount, errorCount, totalAudited: terms.length };

    } catch (error) {
        console.error("Migration script failed:", error);
        return { success: false, error };
    }
}
