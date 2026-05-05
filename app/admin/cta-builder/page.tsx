import { getCallToActions } from "@/lib/actions/cta.actions";
import CTAManager from "@/components/admin/CTAManager";

export const metadata = {
    title: 'CTA Builder | Warlock Publishing Admin',
    description: 'Manage your Global Call-To-Actions'
};

export default async function CTABuilderPage() {
    const ctas = await getCallToActions();
    
    return (
        <div className="min-h-screen bg-slate-950 pb-20 pt-10">
            <div className="max-w-7xl mx-auto px-4 md:px-8">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-black font-serif italic text-white mb-4 drop-shadow-sm">
                        CTA Builder
                    </h1>
                    <p className="text-lg text-slate-400 max-w-3xl leading-relaxed">
                        Design and manage global Call-To-Action blocks. Attach these blocks to Glossary Terms and Blog Posts to drive engagement and revenue.
                    </p>
                </header>
                
                <CTAManager initialCtas={ctas} />
            </div>
        </div>
    );
}
