"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
                        <SelectTrigger>
                            <SelectValue placeholder="Select an author" />
                        </SelectTrigger>
                        <SelectContent>
                            {penNames.map((penName) => (
                                <SelectItem key={penName._id} value={penName._id}>
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
                        className="text-slate-900"
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
                            <SelectTrigger className="text-slate-900">
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ebook">Ebook</SelectItem>
                                <SelectItem value="software">Software</SelectItem>
                                <SelectItem value="amazon">Amazon Product</SelectItem>
                                <SelectItem value="course">Course</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="pageType">Page Type</Label>
                        <Select
                            value={data.pageType}
                            onValueChange={(val: any) => updateData({ pageType: val })}
                        >
                            <SelectTrigger className="text-slate-900">
                                <SelectValue placeholder="Select page type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sales">Sales Page</SelectItem>
                                <SelectItem value="upsell">Upsell Page</SelectItem>
                                <SelectItem value="downsell">Downsell Page</SelectItem>
                                <SelectItem value="thankyou">Thank You Page</SelectItem>
                                <SelectItem value="custom_html">Custom HTML / Pure Code</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Auto-fill logic for Thank You Page */}
                {data.pageType === 'thankyou' && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-700 mb-4">
                        <p><strong>Note:</strong> Some fields have been auto-filled for the Thank You page template. You can edit them if needed.</p>
                    </div>
                )}
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                        id="description"
                        className="text-slate-900"
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                        placeholder="Product description"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            className="text-slate-900"
                            value={data.price}
                            onChange={(e) => updateData({ price: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            className="text-slate-900"
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
                            className="text-slate-900"
                            value={data.format}
                            onChange={(e) => updateData({ format: e.target.value })}
                            placeholder="e.g. PDF"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Cover Image URL</Label>
                        <Input
                            id="imageUrl"
                            className="text-slate-900"
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
