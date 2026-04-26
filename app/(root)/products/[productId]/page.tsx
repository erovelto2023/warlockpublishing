import { getProductById } from "@/lib/actions/product.actions";
import Image from "next/image";
import { GrooveSellTracking } from "@/components/groove-sell-tracking";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShieldCheck, FileText } from "lucide-react";
import { getSanitizedProduct } from "@/lib/product-utils";
import { constructMetadata } from "@/lib/seo";
import { Metadata } from 'next';

import { SoftwareTemplateRenderer } from "@/components/templates/software/SoftwareTemplateRenderer";
import { EbookTemplateRenderer } from "@/components/templates/ebook/EbookTemplateRenderer";
import { CourseTemplateRenderer } from "@/components/templates/course/CourseTemplateRenderer";
import { ThankYouTemplateRenderer } from "@/components/templates/thankyou/ThankYouTemplateRenderer";
import { AmazonTemplateRenderer } from "@/components/templates/amazon/AmazonTemplateRenderer";
import { notFound, redirect } from "next/navigation";

import { Product } from "@/lib/types";

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function generateMetadata(props: { params: Promise<{ productId: string }> }): Promise<Metadata> {
    const params = await props.params;
    const productId = params.productId;
    
    try {
        const product = await getProductById(productId) as Product;
        if (!product) return constructMetadata({ title: 'Product Not Found', description: 'The requested product could not be found.' });

        return constructMetadata({
            title: product.title,
            description: product.description || `Explore ${product.title} at Warlock Publishing.`,
            image: product.imageUrl,
            type: 'product',
            keywords: [product.category || 'Digital', product.format || 'Product', 'Digital Asset'],
            url: `https://warlockpublishing.com/products/${product.slug || product._id}`
        });
    } catch (error) {
        return constructMetadata({ title: 'Product Not Found', description: 'The requested product could not be found.' });
    }
}

export default async function ProductPage(props: { params: Promise<{ productId: string }> }) {
    const params = await props.params;
    const productId = params.productId;
    
    // console.log(`[ProductPage] Rendering for ID: ${productId}`);

    let rawProduct;
    try {
        rawProduct = await getProductById(productId);
    } catch (error) {
        console.error(`[ProductPage] Error fetching product ${productId}:`, error);
        if (error instanceof Error && error.message === "Product not found") {
            notFound();
        }
        throw error; 
    }

    if (!rawProduct) notFound();

    // Sanitize data before use
    const product = getSanitizedProduct(rawProduct);
    if (!product) notFound();

    // SEO: Redirect to slug URL if available and we are currently using ID
    if (product.slug && productId !== product.slug) {
        redirect(`/products/${product.slug}`);
    }

    // --- TEMPLATE RENDERING ---
    // 1. Custom HTML Overrides (Highest priority)
    if (product.htmlContent.trim() !== "") {
        return (
            <>
                <style dangerouslySetInnerHTML={{
                    __html: `
                    #site-navbar-wrapper, #site-footer-wrapper { display: none !important; }
                    main { flex: 1 1 auto; display: block; width: 100%; }
                `}} />
                <GrooveSellTracking id={product.grooveSellId} />
                <div dangerouslySetInnerHTML={{ __html: product.htmlContent }} />
            </>
        );
    }

    // 2. Specialty Template Renderers
    const commonProps = { id: product.grooveSellId };
    
    if (product.productType === 'software') {
        return (
            <>
                <GrooveSellTracking {...commonProps} />
                <SoftwareTemplateRenderer contentData={product.rawContentData} />
            </>
        );
    }

    if (product.productType === 'ebook' || product.productType === 'fiction') {
        return (
            <>
                <GrooveSellTracking {...commonProps} />
                <EbookTemplateRenderer contentData={product.rawContentData} />
            </>
        );
    }

    if (product.productType === 'course') {
        return (
            <>
                <GrooveSellTracking {...commonProps} />
                <CourseTemplateRenderer contentData={product.rawContentData} />
            </>
        );
    }

    if (product.productType === 'thankyou' || product.pageType === 'thankyou') {
        return (
            <>
                <GrooveSellTracking {...commonProps} />
                <ThankYouTemplateRenderer contentData={product.rawContentData} />
            </>
        );
    }

    if (product.productType === 'amazon') {
        return (
            <AmazonTemplateRenderer
                contentData={product.rawContentData}
                amazonLink={product.amazonLink}
                title={product.title}
                description={product.description}
                imageUrl={product.imageUrl}
                category={product.category}
                authorName={(product.penName as any)?.name}
            />
        );
    }

    // 3. Fallback: Standard Product View
    return (
            <div className="container py-10 px-4">
                <GrooveSellTracking id={product.grooveSellId} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Product Image */}
                    <div className="relative aspect-square rounded-xl overflow-hidden border shadow-lg bg-muted">
                        {product.imageUrl ? (
                            <Image
                                src={product.imageUrl}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-muted-foreground italic">
                                Preview Coming Soon
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
                                    {product.category}
                                </span>
                                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full capitalize">
                                    {product.licenseType}
                                </span>
                            </div>
                            <h1 className="text-4xl font-bold tracking-tight mb-4">{product.title}</h1>
                            <div className="text-3xl font-bold text-primary mb-6">
                                ${product.price.toFixed(2)}
                            </div>
                            <div className="prose max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                {product.description}
                            </div>
                        </div>

                        <div className="space-y-4 border-t pt-6">
                            <div className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">Format:</span> {product.format}
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                <span className="font-medium">License:</span> {product.licenseType}
                            </div>
                        </div>

                        {/* Checkout Section */}
                        <div className="pt-6">
                            {product.isAmazonProduct ? (
                                <Link href={product.amazonLink || "#"} target="_blank">
                                    <Button size="lg" className="w-full text-lg h-14">
                                        Buy on Amazon
                                    </Button>
                                </Link>
                            ) : (
                                <div className="space-y-4">
                                    {product.grooveSellEmbed && (
                                        <div
                                            dangerouslySetInnerHTML={{ __html: product.grooveSellEmbed }}
                                            className="w-full flex justify-center"
                                        />
                                    )}
                                    <p className="text-center text-xs text-muted-foreground">
                                        Secure transaction via encrypted checkout
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
}
