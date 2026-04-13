"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, ChevronRight, ChevronLeft } from "lucide-react"
import { StepBasics } from "./step-basics"
import { StepTemplate } from "./step-template"
import { StepEditor } from "./step-editor"
import { createProduct, updateProduct } from "@/lib/actions/product.actions"
import { useToast } from "@/components/ui/use-toast"

export type WizardData = {
    _id?: string
    // Basics
    penNameId: string
    title: string
    productType: "ebook" | "software" | "amazon" | "course"
    pageType: "sales" | "upsell" | "downsell" | "thankyou" | "custom_html"

    // Template
    templateId: string

    // Editor (Content)
    contentData: any

    // Details
    description: string
    price: string
    category: string
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
    const { toast } = useToast()
    const [step, setStep] = useState(1)
    const [data, setData] = useState<WizardData>(initialProduct || initialData)
    const [loading, setLoading] = useState(false)
    const [mounted, setMounted] = useState(false)

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
        const isSpecialPage = data.pageType === 'thankyou' || data.pageType === 'custom_html';

        if (!data.title) {
            toast({
                title: "Missing Title",
                description: "Please enter a product title.",
                variant: "destructive",
            })
            return
        }

        if (!isSpecialPage && (!data.description || !data.category || !data.format || !data.imageUrl)) {
            toast({
                title: "Missing Fields",
                description: "Please fill in Description, Category, Format, and Image URL.",
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        try {
            if (initialProduct && initialProduct._id) {
                await updateProduct(initialProduct._id, {
                    ...data,
                    price: Number(data.price),
                    isAmazonProduct: data.productType === 'amazon' || data.isAmazonProduct
                })
                toast({
                    title: "Success",
                    description: "Product updated successfully",
                })
            } else {
                await createProduct({
                    ...data,
                    price: Number(data.price),
                    // Ensure isAmazonProduct is set correctly based on productType if needed
                    isAmazonProduct: data.productType === 'amazon' || data.isAmazonProduct
                })
                toast({
                    title: "Success",
                    description: "Product created successfully",
                })
            }
            router.push("/admin")
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

    const steps = [
        { number: 1, title: "Basics" },
        { number: 2, title: "Template" },
        { number: 3, title: "Editor" },
    ]

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
                    {step === 2 && <StepTemplate data={data} updateData={updateData} />}
                    {step === 3 && <StepEditor data={data} updateData={updateData} />}
                </div>

                <div className="flex justify-between mt-8 pt-4 border-t">
                    <Button
                        variant="outline"
                        onClick={prevStep}
                        disabled={step === 1 || loading}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" /> Back
                    </Button>

                    {step < 3 ? (
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
