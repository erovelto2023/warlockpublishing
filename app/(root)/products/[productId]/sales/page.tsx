import { getProductById } from "@/lib/actions/product.actions";
import { getPenNameById } from "@/lib/actions/pen-name.actions";
import { notFound } from "next/navigation";
import ColoringBookSalesPage from "@/components/templates/coloring-book/ColoringBookSalesPage";

import ChildrensBookSalesPage from "@/components/templates/childrens-book/ChildrensBookSalesPage";
import ActivityBookSalesPage from "@/components/templates/activity-book/ActivityBookSalesPage";
import JournalSalesPage from "@/components/templates/journal/JournalSalesPage";
import AcademicBookSalesPage from "@/components/templates/academic-book/AcademicBookSalesPage";
import SpiritualBookSalesPage from "@/components/templates/spiritual-book/SpiritualBookSalesPage";
import ArtisticBookSalesPage from "@/components/templates/artistic-book/ArtisticBookSalesPage";

export const dynamic = 'force-dynamic';

interface SalesPageProps {
    params: Promise<{ productId: string }>;
}

export default async function SalesPage({ params }: SalesPageProps) {
    const { productId } = await params;
    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    const penName = product.penNameId ? await getPenNameById(product.penNameId) : null;
    const authorName = penName ? penName.name : "Unknown Author";

    // If custom HTML exists, render that instead
    if (product.htmlContent) {
        return (
            <div dangerouslySetInnerHTML={{ __html: product.htmlContent }} />
        );
    }

    const category = product.category?.toLowerCase() || "";

    if (category.includes("activity") || category.includes("puzzle") || category.includes("maze")) {
        return <ActivityBookSalesPage product={product} authorName={authorName} />;
    }

    if (category.includes("children") || category.includes("kid")) {
        return <ChildrensBookSalesPage product={product} authorName={authorName} />;
    }

    if (category.includes("journal") || category.includes("planner") || category.includes("diary")) {
        return <JournalSalesPage product={product} authorName={authorName} />;
    }

    if (category.includes("academic") || category.includes("textbook") || category.includes("education")) {
        return <AcademicBookSalesPage product={product} authorName={authorName} />;
    }

    if (category.includes("spiritual") || category.includes("wellness") || category.includes("mindfulness") || category.includes("yoga")) {
        return <SpiritualBookSalesPage product={product} authorName={authorName} />;
    }

    if (category.includes("art") || category.includes("design") || category.includes("photography") || category.includes("portfolio")) {
        return <ArtisticBookSalesPage product={product} authorName={authorName} />;
    }

    return <ColoringBookSalesPage product={product} authorName={authorName} />;
}
