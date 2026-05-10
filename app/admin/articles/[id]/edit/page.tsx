import { getAdvertorialById } from "@/lib/actions/advertorial";
import { getAffiliateOffers } from "@/lib/actions/affiliate.actions";
import AdvertorialEditor from "@/components/admin/AdvertorialEditor";
import { notFound } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { redirect } from "next/navigation";

export default async function EditAdvertorialPage({ params }: { params: Promise<{ id: string }> }) {
    const isUserAdmin = await isAdmin();
    if (!isUserAdmin) redirect('/');

    const { id } = await params;
    const advertorial = await getAdvertorialById(id);
    const affiliateOffers = await getAffiliateOffers();

    if (!advertorial) notFound();

    return (
        <div className="min-h-screen bg-slate-50 pt-10 pb-20">
            <AdvertorialEditor 
                advertorial={JSON.parse(JSON.stringify(advertorial))} 
                affiliateOffers={JSON.parse(JSON.stringify(affiliateOffers))} 
            />
        </div>
    );
}
