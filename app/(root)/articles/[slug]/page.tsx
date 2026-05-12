import { getAdvertorialBySlug, trackAdvertorialView } from "@/lib/actions/advertorial";
import { notFound } from "next/navigation";
import IndustrialTemplate from "@/components/templates/advertorial/IndustrialTemplate";
import MinimalistTemplate from "@/components/templates/advertorial/MinimalistTemplate";
import MagazineTemplate from "@/components/templates/advertorial/MagazineTemplate";
import UltimateTemplate from "@/components/templates/advertorial/UltimateTemplate";

export default async function AdvertorialPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const advertorial = await getAdvertorialBySlug(slug);

    if (!advertorial) notFound();

    // Increment view count
    await trackAdvertorialView(advertorial._id);

    // Template Selector Logic
    const template = advertorial.template || 'ultimate';

    switch (template) {
        case 'minimalist':
            return <MinimalistTemplate advertorial={advertorial} />;
        case 'magazine':
            return <MagazineTemplate advertorial={advertorial} />;
        case 'ultimate':
            return <UltimateTemplate advertorial={advertorial} />;
        case 'industrial':
        default:
            return <IndustrialTemplate advertorial={advertorial} />;
    }
}
