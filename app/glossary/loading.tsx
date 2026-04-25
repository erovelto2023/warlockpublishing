import { GlossarySkeleton } from "@/components/SkeletonLoader";

export default function Loading() {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 md:px-8">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Warlock Glossary</h1>
            <p className="text-lg text-slate-500 mb-12 max-w-2xl font-medium">The definitive knowledge base for digital publishers and asset creators.</p>
            <GlossarySkeleton />
        </div>
    );
}
