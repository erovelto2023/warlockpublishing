import { ProductWizard } from "@/components/product-wizard/ProductWizard";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { getPenNames } from "@/lib/actions/pen-name.actions";

export default async function NewProductPage() {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    const penNames = await getPenNames();

    return (
        <div className="container py-10 px-4">
            <h1 className="text-3xl font-bold mb-8 text-center">Create New Product</h1>
            <ProductWizard penNames={penNames} />
        </div>
    );
}
