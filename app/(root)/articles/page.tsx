import { getAdvertorials } from "@/lib/actions/advertorial";
import DiscoveryClient from "@/components/articles/DiscoveryClient";

export default async function DiscoveryPage() {
    const advertorials = await getAdvertorials();
    const published = advertorials.filter((a: any) => a.isPublished);

    return (
        <div className="min-h-screen bg-white text-black font-sans selection:bg-slate-200 pt-20">
            <DiscoveryClient articles={published} />
        </div>
    );
}
