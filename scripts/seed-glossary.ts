import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { connectToDatabase } from "../lib/db";
import GlossaryTerm from "../lib/models/GlossaryTerm";

const sampleTerms = [
    {
        term: "Billionaire Revenge",
        shortDefinition: "A high-stakes romance trope where a wealthy protagonist uses their resources to avenge a past wrong, only to find love in the process.",
        definition: "The Billionaire Revenge trope centers on a protagonist who has been marginalized, betrayed, or ruined in the past. Having built an empire, they return to systematically dismantle their enemies. The emotional core of the story is the conflict between their cold mission for justice and the warmth of a new, unexpected relationship—often with someone connected to their past or their enemy.",
        category: "Writing & Tropes",
        tropeUsage: "Focus on the 'Moral Gray Area'. The protagonist should use their wealth to execute plans that are legally sound but ethically questionable. Tension is highest when the love interest challenges the billionaire's need for vengeance.",
        marketPotential: "Extremely high in 'Toxic' or 'Dark' romance niches. Readers crave the power fantasy of a billionaire destroying those who deserve it.",
        metrics: { profitability: 9, difficulty: 4, popularity: 9 },
        exampleTropes: ["The Hostile Takeover Romance", "The Revenge Marriage Contract", "Bankrupting the Ex"],
        popularBooks: [
            { title: "The Billionaire's Vengeance", author: "Janine Infante Bosco", link: "https://amzn.to/3VjXuKy" },
            { title: "Ruthless Heir", author: "Sasha Cottman", link: "https://amzn.to/3T6sXq6" }
        ],
        keywords: ["revenge", "billionaire", "dark romance", "vengeance"]
    },
    {
        term: "Craved by the Billionaire",
        shortDefinition: "The 'Obsession' trope where a powerful figure focuses their entire attention on a single, often unsuspecting, individual.",
        definition: "This niche focuses on the 'Insta-Love' or 'Deep Obsession' dynamics. The billionaire uses their influence to protect, provide for, and ultimately win over the object of their affection. It often borders on the 'Stalker' or 'Dark' romance sub-genres but remains firmly in the 'Protector' fantasy.",
        category: "Writing & Tropes",
        tropeUsage: "Use 'The Gilded Cage' dynamic. The billionaire provides everything the protagonist ever wanted, but at the cost of their perceived independence. This creates a psychological tension between safety and freedom.",
        marketPotential: "Dominates the Kindle Unlimited charts. High conversion for series starters.",
        metrics: { profitability: 10, difficulty: 3, popularity: 8 },
        exampleTropes: ["The Arranged Marriage Obsession", "The Secret Bodyguard Billionaire", "The Silent Guardian"],
        popularBooks: [
            { title: "Craved by the Billionaire", author: "Various Authors", link: "https://amzn.to/3VsYq1z" }
        ],
        keywords: ["obsession", "insta-love", "alpha male", "protector"]
    },
    {
        term: "Billionaire Husband Chapter 1",
        shortDefinition: "Specific hook strategy for viral billionaire romance series, optimized for cliffhangers and immediate reader retention.",
        definition: "A 'Chapter 1' strategy specifically engineered for platforms like Wattpad, Radish, or Kindle Vella. It requires an immediate world-building establishment where the billionaire's power is demonstrated through an interaction with the protagonist—usually involving a contract, a debt, or a chance encounter in a high-status location.",
        category: "Writing & Tropes",
        tropeUsage: "Open with action or high-stakes dialogue. Avoid backstory. The billionaire should make a life-changing offer or demand by the end of the first 1,000 words.",
        marketPotential: "Critical for serial fiction success. A strong Chapter 1 can increase follow-through rates by 200%.",
        metrics: { profitability: 8, difficulty: 7, popularity: 10 },
        exampleTropes: ["The Contractual Wedding", "The Debt Repayment", "The Accidental Pregnancy Announcement"],
        popularBooks: [
            { title: "The Billionaire's Secretary", author: "TV/Serial Concept", link: "https://amzn.to/3V7Z2y1" }
        ],
        keywords: ["serial fiction", "chapter 1", "hooks", "retention"]
    }
];

async function seedGlossary() {
    try {
        await connectToDatabase();
        
        for (const term of sampleTerms) {
            const slug = term.term.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            await GlossaryTerm.findOneAndUpdate(
                { slug },
                { ...term, slug },
                { upsert: true, new: true }
            );
            console.log(`Seeded: ${term.term}`);
        }
        
        console.log("Glossary seeding complete.");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding glossary:", error);
        process.exit(1);
    }
}

seedGlossary();
