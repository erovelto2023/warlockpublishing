import { ProductWizard } from "@/components/product-wizard/ProductWizard";
import { getPenNames } from "@/lib/actions/pen-name.actions";
import { getProductById } from "@/lib/actions/product.actions";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) {
        redirect("/");
    }

    const { id } = await params;
    const product = await getProductById(id);
    const penNames = await getPenNames();

    // Transform product data to match WizardData interface if necessary
    // The WizardData expects specific fields, ensure product has them or default them
    const wizardData = {
        ...product,
        price: product.price.toString(), // Convert number to string for input
        // Ensure other fields match types
    };

    return (
        <div className="container py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">Edit Product</h1>
            <ProductWizard penNames={penNames} initialProduct={wizardData} />
        </div>
    );
}
