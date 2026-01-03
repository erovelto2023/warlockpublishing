import { PenNameForm } from "@/components/pen-name-form";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function NewPenNamePage() {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    return (
        <div className="container max-w-2xl py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-white">Create New Pen Name</h1>
            <PenNameForm />
        </div>
    );
}
