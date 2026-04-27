"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ChevronRight, ChevronLeft } from "lucide-react"
import { StepBasics } from "./step-basics"
import { StepHtmlBuilder } from "./step-html-builder"
import { StepAmazon } from "./step-amazon"
import { createProduct, updateProduct } from "@/lib/actions/product.actions"
import { useToast } from "@/components/ui/use-toast"

export type WizardData = {
    _id?: string
    // Basics
    penNameId: string
    title: string
    productType: "ebook" | "software" | "amazon" | "course" | "external"
    pageType: "sales" | "upsell" | "downsell" | "thankyou" | "custom_html"

    // Template
    templateId: string

    // Editor (Content)
    contentData: any

    // Details
    description: string
    price: string
    category: string
    niche: string
    format: string
    licenseType: string
    imageUrl: string
    isHidden: boolean
    isFeaturedInRotation: boolean
    externalUrl: string
    isAmazonProduct: boolean
    amazonLink: string
    grooveSellId: string
    grooveSellEmbed: string
    htmlContent: string
}

const initialData: WizardData = {
    penNameId: "",
    title: "",
    productType: "ebook",
    pageType: "sales",
    templateId: "",
    contentData: {},
    description: "",
    price: "0",
    category: "",
    niche: "",
    format: "",
    licenseType: "PLR",
    imageUrl: "",
    isHidden: false,
    isFeaturedInRotation: true,
    externalUrl: "",
    isAmazonProduct: false,
    amazonLink: "",
    grooveSellId: "",
    grooveSellEmbed: "",
    htmlContent: "",
}

interface ProductWizardProps {
    penNames: { _id: string; name: string }[]
    initialProduct?: WizardData
}

export function ProductWizard({ penNames, initialProduct }: ProductWizardProps) {
    const router = useRouter()
    const searchParams = useSearchParams()
    const urlPenNameId = searchParams?.get('penNameId')
    
    const { toast } = useToast()
    const [step, setStep] = useState(1)
    
    const [data, setData] = useState<WizardData>(() => {
        if (initialProduct) return initialProduct;
        
        if (urlPenNameId) {
            return { ...initialData, penNameId: urlPenNameId };
        }
        
        return initialData;
    })
    
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

    const getSteps = () => {
        if (data.productType === 'external') {
            return [{ number: 1, title: "Basics" }];
        }
        if (data.productType === 'amazon') {
            return [
                { number: 1, title: "Basics" },
                { number: 2, title: "Amazon Details" }
            ];
        }
        return [
            { number: 1, title: "Basics" },
            { number: 2, title: "HTML Builder" },
        ];
    };

    const steps = getSteps();
    const totalSteps = steps.length;

    // Ensure step doesn't exceed new totalSteps when switching product types
    useEffect(() => {
        if (step > totalSteps) {
            setStep(totalSteps);
        }
    }, [totalSteps, step]);

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const updateData = (newData: Partial<WizardData>) => {
        setData(prev => ({ ...prev, ...newData }))
    }

    const nextStep = () => setStep(prev => prev + 1)
    const prevStep = () => setStep(prev => prev - 1)

    const handleSubmit = async () => {
        // Validation
        if (!data.title) {
            toast({
                title: "Missing Title",
                description: "Please enter a product title.",
                variant: "destructive",
            })
            return
        }

        if (data.productType === 'amazon' && !data.amazonLink) {
            toast({
                title: "Missing Amazon Link",
                description: "Please provide the Amazon Affiliate URL.",
                variant: "destructive",
            })
            return
        }

        if (data.productType === 'external' && !data.externalUrl) {
            toast({
                title: "Missing External URL",
                description: "Please provide the External Destination URL.",
                variant: "destructive",
            })
            return
        }

        const isSpecialPage = data.pageType === 'thankyou' || data.pageType === 'custom_html';
        const isStandardProduct = data.productType !== 'amazon' && data.productType !== 'external';

        if (isStandardProduct && !isSpecialPage && (!data.description || !data.category || !data.format || !data.imageUrl)) {
            toast({
                title: "Missing Fields",
                description: "Please fill in Description, Category, Format, and Image URL.",
                variant: "destructive",
            })
            return
        }

        let finalPrice = Number(data.price) || 0;
        if (data.productType === 'amazon') {
            const buyBoxBlock = data.contentData?.blocks?.find((b: any) => b.id === 'buyBox');
            if (buyBoxBlock?.data?.price) {
                const parsed = parseFloat(String(buyBoxBlock.data.price).replace(/[^0-9.]/g, ''));
                if (!isNaN(parsed)) {
                    finalPrice = parsed;
                }
            }
        }

        setLoading(true)
        try {
            if (initialProduct && initialProduct._id) {
                await updateProduct(initialProduct._id, {
                    ...data,
                    price: finalPrice,
                    isAmazonProduct: data.productType === 'amazon' || data.isAmazonProduct
                })
                toast({
                    title: "Success",
                    description: "Product updated successfully",
                })
            } else {
                await createProduct({
                    ...data,
                    price: finalPrice,
                    // Ensure isAmazonProduct is set correctly based on productType if needed
                    isAmazonProduct: data.productType === 'amazon' || data.isAmazonProduct
                })
                toast({
                    title: "Success",
                    description: "Product created successfully",
                })
            }
            if (data.penNameId) {
                router.push(`/admin/pen-names/${data.penNameId}/products`)
            } else {
                router.push("/admin")
            }
        } catch (error) {
            console.error(error)
            toast({
                title: "Error",
                description: "Failed to save product",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }



    return (
        <div className="max-w-6xl mx-auto py-10 px-4">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex justify-between items-center relative">
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-200 -z-10" />
                    {steps.map((s) => (
                        <div key={s.number} className="flex flex-col items-center gap-2 bg-background px-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${step >= s.number
                                    ? "bg-primary border-primary text-primary-foreground"
                                    : "bg-background border-slate-300 text-slate-500"
                                    }`}
                            >
                                {step > s.number ? <Check className="w-5 h-5" /> : s.number}
                            </div>
                            <span className={`text-sm font-medium ${step >= s.number ? "text-primary" : "text-slate-500"}`}>
                                {s.title}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <Card className="p-6 min-h-[500px] flex flex-col">
                <div className="flex-1">
                    {step === 1 && <StepBasics data={data} updateData={updateData} penNames={penNames} />}
                    {step === 2 && data.productType === 'amazon' && <StepAmazon data={data} updateData={updateData} />}
                    {step === 2 && data.productType !== 'amazon' && data.productType !== 'external' && <StepHtmlBuilder data={data} updateData={updateData} />}
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t items-center">
                    <div className="flex gap-2">
                        {initialProduct && (
                            <Button
                                variant="destructive"
                                type="button"
                                onClick={async () => {
                                    if (confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
                                        setLoading(true);
                                        try {
                                            // Import deleteProduct at top dynamically or add to props if needed. Wait, we can import it.
                                            const { deleteProduct } = await import("@/lib/actions/product.actions");
                                            await deleteProduct(initialProduct._id as string);
                                            toast({ title: "Product Deleted" });
                                            router.push("/admin");
                                        } catch(e) {
                                            toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
                                        }
                                        setLoading(false);
                                    }
                                }}
                                disabled={loading}
                            >
                                Delete
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={prevStep}
                            disabled={step === 1 || loading}
                        >
                            <ChevronLeft className="w-4 h-4 mr-2" /> Back
                        </Button>
                    </div>

                    {step < totalSteps ? (
                        <Button onClick={nextStep}>
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading ? (initialProduct ? "Updating..." : "Creating...") : (initialProduct ? "Update Product" : "Create Product")}
                        </Button>
                    )}
                </div>
            </Card>
        </div>
    )
}
