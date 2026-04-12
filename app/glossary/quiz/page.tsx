import { getGlossaryTerms } from "@/lib/actions/glossary";
import GlossaryQuizClient from "./GlossaryQuizClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Glossary Quiz | Mastery Assessment",
    description: "Test your knowledge of publishing, writing, and commercial tropes with our interactive glossary quiz.",
};

export default async function QuizPage() {
    const terms = await getGlossaryTerms() as any[];
    
    // Sort out terms that have at least a short definition
    const validTerms = terms.filter(t => t.shortDefinition || t.definition);

    return (
        <div className="min-h-screen bg-[#0f172a]">
            {/* We don't use SiteHeader here to keep the quiz focused like a 'Mastery Mode' */}
            <GlossaryQuizClient terms={validTerms} />
        </div>
    );
}
