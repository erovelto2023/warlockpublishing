import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import GlossaryTerm from "@/lib/models/GlossaryTerm";

export async function GET() {
    try {
        await connectToDatabase();
        const terms = await GlossaryTerm.find({ isPublished: { $ne: false } })
            .select("term slug shortDefinition category definition")
            .lean();
            
        const flashcards = terms.map((t: any) => ({
            term: t.term,
            slug: t.slug,
            description: t.shortDefinition || (t.definition ? t.definition.substring(0, 150) + "..." : "No definition available."),
            category: t.category || "General"
        }));

        return NextResponse.json(flashcards);
    } catch (error) {
        console.error("API Glossary All Error:", error);
        return NextResponse.json({ error: "Failed to fetch terms" }, { status: 500 });
    }
}
