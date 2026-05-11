import { getAdvertorialBySlug, trackAdvertorialView } from "@/lib/actions/advertorial";
import { notFound } from "next/navigation";
import IndustrialTemplate from "@/components/templates/advertorial/IndustrialTemplate";
import MinimalistTemplate from "@/components/templates/advertorial/MinimalistTemplate";
import MagazineTemplate from "@/components/templates/advertorial/MagazineTemplate";

export default async function AdvertorialPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const advertorial = await getAdvertorialBySlug(slug);

    if (!advertorial) notFound();

    // Increment view count
    await trackAdvertorialView(advertorial._id);

    // Template Selector Logic
    const template = advertorial.template || 'industrial';

    switch (template) {
        case 'minimalist':
            return <MinimalistTemplate advertorial={advertorial} />;
        case 'magazine':
            return <MagazineTemplate advertorial={advertorial} />;
        case 'industrial':
        default:
            return <IndustrialTemplate advertorial={advertorial} />;
    }
}
