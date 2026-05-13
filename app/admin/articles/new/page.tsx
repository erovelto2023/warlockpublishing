import { getAffiliateOffers } from '@/lib/actions/affiliate.actions';
import AdvertorialEditor from '@/components/admin/AdvertorialEditor';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Create Advertorial | Admin',
    robots: { index: false, follow: false },
};

export default async function CreateAdvertorialPage() {
    const affiliateOffers = await getAffiliateOffers();

    return (
        <div className="p-8">
            <AdvertorialEditor 
                advertorial={{}} 
                affiliateOffers={JSON.parse(JSON.stringify(affiliateOffers))} 
            />
        </div>
    );
}
