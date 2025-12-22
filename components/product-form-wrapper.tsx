"use client";

import dynamic from "next/dynamic";

const ProductForm = dynamic(() => import("./product-form").then((mod) => mod.ProductForm), {
    ssr: false,
    loading: () => <p>Loading form...</p>,
});

interface ProductFormWrapperProps {
    penNames?: { _id: string; name: string }[];
}

export function ProductFormWrapper({ penNames }: ProductFormWrapperProps) {
    return <ProductForm penNames={penNames} />;
}
