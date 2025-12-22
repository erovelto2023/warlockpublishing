import { getProductById } from "@/lib/actions/product.actions";
import { GrooveSellTracking } from "@/components/groove-sell-tracking";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Check, ShieldCheck, FileText } from "lucide-react";

import { SoftwareTemplateRenderer } from "@/components/templates/software/SoftwareTemplateRenderer";
import { EbookTemplateRenderer } from "@/components/templates/ebook/EbookTemplateRenderer";
import { CourseTemplateRenderer } from "@/components/templates/course/CourseTemplateRenderer";
import { ThankYouTemplateRenderer } from "@/components/templates/thankyou/ThankYouTemplateRenderer";

export const dynamic = 'force-dynamic';

import { redirect } from "next/navigation";

export default async function ProductPage(props: { params: Promise<{ productId: string }> }) {
    const params = await props.params;
    const productId = params.productId;
    const product = await getProductById(productId);

    // SEO: Redirect to slug URL if available and we are currently using ID
    if (product.slug && productId !== product.slug) {
        redirect(`/products/${product.slug}`);
    }

    // Check for Custom HTML first
    if (product.htmlContent) {
        return (
            <div className="container py-10 px-4">
                <GrooveSellTracking id={product.grooveSellId} />
                <div dangerouslySetInnerHTML={{ __html: product.htmlContent }} />
            </div>
        );
    }

    // Check for Software Template
    if (product.productType === 'software' && product.contentData) {
        return (
            <>
                <GrooveSellTracking id={product.grooveSellId} />
                <SoftwareTemplateRenderer contentData={product.contentData} />
            </>
        );
    }

    // Check for Ebook Template
    if (product.productType === 'ebook') {
        // Use contentData if available, otherwise fallback to defaults handled in renderer
        return (
            <>
                <GrooveSellTracking id={product.grooveSellId} />
                <EbookTemplateRenderer contentData={product.contentData} />
            </>
        );
    }

    // Check for Course Template
    if (product.productType === 'course') {
        return (
            <>
                <GrooveSellTracking id={product.grooveSellId} />
                <CourseTemplateRenderer contentData={product.contentData} />
            </>
        );
    }

    // Check for Thank You Page Template
    if (product.pageType === 'thankyou') {
        return (
            <>
                <GrooveSellTracking id={product.grooveSellId} />
                <ThankYouTemplateRenderer contentData={product.contentData} />
            </>
        );
    }

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
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No Image Available
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="space-y-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {product.category}
                            </span>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {product.licenseType}
                            </span>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{product.title}</h1>
                        <div className="text-3xl font-bold text-primary mb-6">
                            ${product.price.toFixed(2)}
                        </div>
                        <div className="prose max-w-none text-muted-foreground whitespace-pre-wrap">
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

                    {/* Checkout / Buy Section */}
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
                                    Secure checkout via GrooveSell
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
