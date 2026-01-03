"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { WizardData } from "./ProductWizard"
import { useEffect } from "react"

interface StepBasicsProps {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
    penNames: { _id: string; name: string }[]
}

export function StepBasics({ data, updateData, penNames }: StepBasicsProps) {
    // Auto-fill fields for Thank You page
    useEffect(() => {
        if (data.pageType === 'thankyou') {
            const updates: Partial<WizardData> = {};
            if (!data.title) updates.title = "Thank You Page";
            if (!data.description) updates.description = "Thank you page for product delivery.";
            if (!data.category) updates.category = "System";
            if (!data.format) updates.format = "Web Page";
            if (!data.imageUrl) updates.imageUrl = "https://placehold.co/600x400/e2e8f0/94a3b8?text=Thank+You";

            if (Object.keys(updates).length > 0) {
                updateData(updates);
            }
        }
    }, [data.pageType, data.description, data.category, data.format, data.imageUrl, data.title, updateData]);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Basic Information</h2>
                <p className="text-slate-500">Let's start with the core details of your product.</p>
            </div>

            <div className="grid gap-6">
                <div className="space-y-2">
                    <Label htmlFor="penName">Author / Pen Name</Label>
                    <Select
                        value={data.penNameId}
                        onValueChange={(val) => updateData({ penNameId: val })}
                    >
                        <SelectTrigger className="text-white bg-slate-800 border-slate-700">
                            <SelectValue placeholder="Select an author" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-800 border-slate-700 text-white">
                            {penNames.map((penName) => (
                                <SelectItem key={penName._id} value={penName._id} className="focus:bg-slate-700 focus:text-white">
                                    {penName.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="title">Product Title</Label>
                    <Input
                        id="title"
                        className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-400"
                        value={data.title}
                        onChange={(e) => updateData({ title: e.target.value })}
                        placeholder="Enter product title"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="productType">Product Type</Label>
                        <Select
                            value={data.productType}
                            onValueChange={(val: any) => updateData({ productType: val })}
                        >
                            <SelectTrigger className="text-white bg-slate-800 border-slate-700">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="ebook" className="focus:bg-slate-700 focus:text-white">Ebook</SelectItem>
                                <SelectItem value="software" className="focus:bg-slate-700 focus:text-white">Software</SelectItem>
                                <SelectItem value="amazon" className="focus:bg-slate-700 focus:text-white">Amazon Product</SelectItem>
                                <SelectItem value="course" className="focus:bg-slate-700 focus:text-white">Course</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pageType">Page Type</Label>
                        <Select
                            value={data.pageType}
                            onValueChange={(val: any) => updateData({ pageType: val })}
                        >
                            <SelectTrigger className="text-white bg-slate-800 border-slate-700">
                                <SelectValue placeholder="Select page type" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                <SelectItem value="sales" className="focus:bg-slate-700 focus:text-white">Sales Page</SelectItem>
                                <SelectItem value="upsell" className="focus:bg-slate-700 focus:text-white">Upsell Page</SelectItem>
                                <SelectItem value="downsell" className="focus:bg-slate-700 focus:text-white">Downsell Page</SelectItem>
                                <SelectItem value="thankyou" className="focus:bg-slate-700 focus:text-white">Thank You Page</SelectItem>
                                <SelectItem value="custom_html" className="focus:bg-slate-700 focus:text-white">Custom HTML / Pure Code</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Amazon Link Field - Only visible when Product Type is Amazon */}
                {data.productType === 'amazon' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                        <Label htmlFor="amazonLink" className="text-cyan-400 font-bold flex items-center gap-2">
                            Amazon Product Link (Affiliate URL)
                            <span className="text-xs font-normal text-slate-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">Required</span>
                        </Label>
                        <Input
                            id="amazonLink"
                            className="text-white bg-slate-800 border-cyan-600 focus:border-cyan-400 placeholder:text-slate-400 ring-offset-slate-900"
                            value={data.amazonLink}
                            onChange={(e) => updateData({ amazonLink: e.target.value })}
                            placeholder="https://amzn.to/..."
                        />
                        <p className="text-xs text-slate-400">
                            This link will be used for the "Buy on Amazon" button.
                        </p>
                    </div>
                )}

                {/* Auto-fill logic for Thank You Page */}
                {data.pageType === 'thankyou' && (
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50 text-sm text-blue-200 mb-4">
                        <p><strong>Note:</strong> Some fields have been auto-filled for the Thank You page template. You can edit them if needed.</p>
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Label htmlFor="description">Description (Markdown Supported)</Label>
                    <Textarea
                        id="description"
                        className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-400 min-h-[150px] font-mono text-sm"
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                        placeholder="# Product Description&#10;&#10;Write your description here using **markdown**..."
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-400"
                            value={data.price}
                            onChange={(e) => updateData({ price: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-400"
                            value={data.category}
                            onChange={(e) => updateData({ category: e.target.value })}
                            placeholder="e.g. Productivity"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="format">Format</Label>
                        <Input
                            id="format"
                            className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-400"
                            value={data.format}
                            onChange={(e) => updateData({ format: e.target.value })}
                            placeholder="e.g. PDF"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Cover Image URL</Label>
                        <Input
                            id="imageUrl"
                            className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-400"
                            value={data.imageUrl}
                            onChange={(e) => updateData({ imageUrl: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}
