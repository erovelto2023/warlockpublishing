import GlossaryEditor from "@/components/admin/GlossaryEditor";
import { getGlossaryTermById } from "@/lib/actions/glossary";
import { notFound } from "next/navigation";

export default async function EditGlossaryTermPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const term = await getGlossaryTermById(id);

    if (!term) {
        notFound();
    }

    return (
        <div className="bg-slate-50 min-h-screen py-12">
            <div className="container mx-auto px-4">
                <GlossaryEditor initialData={term} />
            </div>
        </div>
    );
}
