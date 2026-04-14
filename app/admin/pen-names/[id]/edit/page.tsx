import { PenNameForm } from "@/components/pen-name-form";
import { getPenNameById } from "@/lib/actions/pen-name.actions";
import { notFound } from "next/navigation";

interface EditPenNamePageProps {
    params: Promise<{ id: string }>;
}

export default async function EditPenNamePage({ params }: EditPenNamePageProps) {
    const { id } = await params;
    const penName: any = await getPenNameById(id);

    if (!penName) {
        notFound();
    }

    return (
        <div className="container py-10 px-4 max-w-3xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Edit Pen Name</h1>
                <p className="text-slate-500">Update your pen name profile and details.</p>
            </div>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <PenNameForm initialData={penName} isEditing={true} />
            </div>
        </div>
    );
}
