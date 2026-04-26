"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { WizardData } from "./ProductWizard"
import { useEffect } from "react"

interface StepAmazonProps {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
}

export const AMAZON_FIELDS_CONFIG = [
    {
        id: 'authorAndRatings',
        label: 'Author & Ratings',
        fields: [
            { name: 'ratingsCount', label: 'Total Ratings', type: 'text', default: '4,821' },
            { name: 'answeredQuestions', label: 'Answered Questions', type: 'text', default: '128' }
        ]
    },
    {
        id: 'formats',
        label: 'Pricing & Formats',
        fields: [
            { name: 'kindlePrice', label: 'Kindle Price', type: 'text', default: '$9.99' },
            { name: 'kindleSub', label: 'Kindle Subtext', type: 'text', default: 'Available instantly' },
            { name: 'hardcoverPrice', label: 'Hardcover Price', type: 'text', default: '$24.95' },
            { name: 'hardcoverSub', label: 'Hardcover Subtext', type: 'text', default: '9 Used from $18.50' },
            { name: 'paperbackPrice', label: 'Paperback Price', type: 'text', default: '$14.99' },
            { name: 'paperbackSub', label: 'Paperback Subtext', type: 'text', default: '24 New from $12.00' },
            { name: 'audiobookPrice', label: 'Audiobook Price', type: 'text', default: '$0.00' },
            { name: 'audiobookSub', label: 'Audiobook Subtext', type: 'text', default: 'With Audible trial' }
        ]
    },
    {
        id: "details", label: "Product Details", fields: [
            { name: "publisher", label: "Publisher", type: "text", default: "Summit Books (May 2024)" },
            { name: "language", label: "Language", type: "text", default: "English" },
            { name: "pages", label: "Pages", type: "text", default: "342 pages" },
            { name: "isbn", label: "ISBN", type: "text", default: "1234567890" },
            { name: "dimensions", label: "Dimensions", type: "text", default: "6.1 x 1.2 x 9.2 inches" },
        ]
    },
    {
        id: "buyBox", label: "Buy Box", fields: [
            { name: "price", label: "Main Price", type: "text", default: "$24.95" },
            { name: "shippingText", label: "Shipping Text", type: "text", default: "Fast, Free Shipping with Amazon Prime" },
            { name: "inStockText", label: "In Stock Text", type: "text", default: "In Stock" },
            { name: "shipsFrom", label: "Ships From", type: "text", default: "Amazon.com" },
            { name: "soldBy", label: "Sold By", type: "text", default: "Summit Books Direct" },
        ]
    },
    {
        id: "reviews", label: "Customer Reviews", fields: [
            { name: "ratingNumber", label: "Rating Number", type: "text", default: "4.6 out of 5" },
            { name: "globalRatings", label: "Global Ratings Text", type: "text", default: "4,821 global ratings" },
            { name: "review1Name", label: "Review 1 Name", type: "text", default: "Sarah Jenkins" },
            { name: "review1Rating", label: "Review 1 Rating (1-5)", type: "text", default: "5" },
            { name: "review1Title", label: "Review 1 Title", type: "text", default: "Life changing perspective!" },
            { name: "review1Date", label: "Review 1 Date", type: "text", default: "Reviewed in the United States on June 12, 2024" },
            { name: "review1Text", label: "Review 1 Text", type: "textarea", default: "I've read dozens of self-help books, but this one actually stuck. The chapters on \"Practical Stoicism\" were incredibly helpful for my workplace stress." },
            { name: "review2Name", label: "Review 2 Name", type: "text", default: "D. Miller" },
            { name: "review2Rating", label: "Review 2 Rating (1-5)", type: "text", default: "4" },
            { name: "review2Title", label: "Review 2 Title", type: "text", default: "Good, but some concepts repeat" },
            { name: "review2Date", label: "Review 2 Date", type: "text", default: "Reviewed in the United States on August 5, 2024" },
            { name: "review2Text", label: "Review 2 Text", type: "textarea", default: "Excellent insights, though I felt the middle section dragged a bit as it reiterated previous points. Still, the advice is solid." },
        ]
    }
];

export function StepAmazon({ data, updateData }: StepAmazonProps) {

    // Initialize contentData.blocks with defaults if empty
    useEffect(() => {
        if (!data.contentData?.blocks || data.contentData.blocks.length === 0) {
            const initialBlocks = AMAZON_FIELDS_CONFIG.map(section => {
                const defaultData = section.fields.reduce((acc: any, field) => {
                    acc[field.name] = field.default;
                    return acc;
                }, {});
                return {
                    id: section.id,
                    data: defaultData
                };
            });
            updateData({ contentData: { blocks: initialBlocks } });
        }
    }, [data.contentData, updateData]);

    const blocks = data.contentData?.blocks || [];

    const handleFieldChange = (sectionId: string, fieldName: string, value: string) => {
        const newBlocks = blocks.map((b: any) => {
            if (b.id === sectionId) {
                return { ...b, data: { ...b.data, [fieldName]: value } };
            }
            return b;
        });
        updateData({ contentData: { blocks: newBlocks } });
    };

    const getFieldValue = (sectionId: string, fieldName: string) => {
        const block = blocks.find((b: any) => b.id === sectionId);
        return block?.data?.[fieldName] || "";
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white">Amazon Template Details</h2>
                <p className="text-slate-400">Fill out the fields below to populate your Amazon Product Page template.</p>
            </div>

            <div className="space-y-8">
                {AMAZON_FIELDS_CONFIG.map((section) => (
                    <div key={section.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 space-y-4 shadow-sm">
                        <h3 className="text-lg font-bold text-slate-200 border-b border-slate-700 pb-2">{section.label}</h3>
                        
                        <div className={`grid gap-4 ${section.id === 'formats' ? 'grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                            {section.fields.map((field) => (
                                <div key={field.name} className={`space-y-2 ${field.type === 'textarea' ? 'col-span-full' : ''}`}>
                                    <Label htmlFor={`${section.id}-${field.name}`} className="text-slate-300 font-medium">{field.label}</Label>
                                    {field.type === 'textarea' ? (
                                        <Textarea
                                            id={`${section.id}-${field.name}`}
                                            className="text-white bg-slate-900 border-slate-700 min-h-[100px] placeholder:text-slate-500"
                                            value={getFieldValue(section.id, field.name)}
                                            onChange={(e) => handleFieldChange(section.id, field.name, e.target.value)}
                                            placeholder={field.default}
                                        />
                                    ) : (
                                        <Input
                                            id={`${section.id}-${field.name}`}
                                            className="text-white bg-slate-900 border-slate-700 placeholder:text-slate-500"
                                            value={getFieldValue(section.id, field.name)}
                                            onChange={(e) => handleFieldChange(section.id, field.name, e.target.value)}
                                            placeholder={field.default}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
