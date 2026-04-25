import { MarketplaceSkeleton } from "@/components/SkeletonLoader";

export default function Loading() {
    return (
        <div className="container py-10 px-4">
            <h1 className="text-3xl font-bold mb-8">All Products & Offers</h1>
            <MarketplaceSkeleton />
        </div>
    );
}
