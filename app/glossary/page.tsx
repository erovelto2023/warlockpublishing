import { getGlossaryTerms, getGlossaryCategories } from "@/lib/actions/glossary";
import { getPublishedProducts } from "@/lib/actions/product.actions";
import GlossaryClient from "@/components/glossary/GlossaryClient";
import { BookOpen } from "lucide-react";

export const metadata = {
    title: "The Glossary | Publishing & Writing Niche Hub",
    description: "The definitive research hub for authors and publishers. Master tropes, commercial strategies, and publishing technicalities.",
};

export default async function GlossaryPage() {
    try {
        const terms = (await getGlossaryTerms()) as any[];
        const categories = await getGlossaryCategories();
        const products = (await getPublishedProducts()) as any[];

        return (
        <div className="min-h-screen bg-slate-200 pt-24">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
                <GlossaryClient initialTerms={terms} categories={categories} products={products} />
            </div>
        </div>
        );
    } catch (error: any) {
        console.error("GLOSSARY CRITICAL ERROR:", error);
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] border border-red-100 text-center shadow-2xl shadow-red-500/5">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8">
                        <BookOpen className="text-red-500" size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Transmission Interrupted</h2>
                    <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                        An internal error occurred while fetching research nodes. Our technicians have been alerted.
                        <br /><br />
                        <span className="bg-red-50 px-3 py-1 rounded-md text-red-600 font-mono text-[10px] break-all">
                            {error.message || "Unknown internal failure"}
                        </span>
                    </p>
                    <a href="/" className="inline-block w-full py-4 bg-slate-900 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-white hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10">
                        Return to Base
                    </a>
                </div>
            </div>
        );
    }
}
