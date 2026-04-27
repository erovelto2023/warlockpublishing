"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { WizardData } from "./ProductWizard"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import MediaLibrary from '@/components/admin/MediaLibrary'

interface StepBasicsProps {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
    penNames: { _id: string; name: string }[]
}

export function StepBasics({ data, updateData, penNames }: StepBasicsProps) {
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);

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

    // Auto-set License Type for Amazon Products
    useEffect(() => {
        if (data.productType === 'amazon' && data.licenseType === 'PLR') {
            updateData({ licenseType: "Personal Use" });
        }
    }, [data.productType, data.licenseType, updateData]);

    // Auto-select Pen Name if only 1 exists
    useEffect(() => {
        if (penNames.length === 1 && !data.penNameId) {
            updateData({ penNameId: penNames[0]._id });
        }
    }, [penNames, data.penNameId, updateData]);

    const isAmazon = data.productType === 'amazon';
    const isExternal = data.productType === 'external';
    const isFunnelPage = data.pageType === 'upsell' || data.pageType === 'downsell' || data.pageType === 'thankyou';

    // Disable rotation for funnel pages
    useEffect(() => {
        if (isFunnelPage && data.isFeaturedInRotation) {
            updateData({ isFeaturedInRotation: false });
        }
    }, [isFunnelPage, data.isFeaturedInRotation, updateData]);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Basic Information</h2>
                <p className="text-slate-500">Let's start with the core details of your product.</p>
            </div>

            <div className="grid gap-6">
                {/* GROUP 1: CORE DETAILS */}
                <div className="space-y-4 pb-6 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-slate-200">Core Details</h3>
                    <div className="grid gap-6">
                        {!isExternal && (
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
                        )}

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
                                        <SelectItem value="external" className="focus:bg-slate-700 focus:text-white">External Link / Affiliate</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {!isAmazon && !isExternal && (
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
                            )}
                        </div>
                    </div>
                </div>

                {/* Amazon Link Field - Only visible when Product Type is Amazon */}
                {isAmazon && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="space-y-2">
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
                    </div>
                )}

                {/* Auto-fill logic for Thank You Page */}
                {!isExternal && data.pageType === 'thankyou' && (
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-900/50 text-sm text-blue-200 mb-4">
                        <p><strong>Note:</strong> Some fields have been auto-filled for the Thank You page template. You can edit them if needed.</p>
                    </div>
                )}
                {/* GROUP 2: CONTENT & VISUALS */}
                <div className="space-y-4 pb-6 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-slate-200">Content & Visuals</h3>
                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Cover Image URL</Label>
                        <div className="flex gap-2">
                            <Input
                                id="imageUrl"
                                className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-400 flex-1"
                                value={data.imageUrl}
                                onChange={(e) => updateData({ imageUrl: e.target.value })}
                                placeholder="https://..."
                            />
                            <Button 
                                type="button" 
                                variant="outline" 
                                className="border-slate-700 bg-slate-800 text-slate-300 hover:text-white"
                                onClick={() => setShowMediaLibrary(true)}
                            >
                                Browse
                            </Button>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="description">Description (Markdown Supported)</Label>
                        <Textarea
                            id="description"
                            className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-400 min-h-[150px] font-mono text-sm"
                            value={data.description}
                            onChange={(e) => updateData({ description: e.target.value })}
                            placeholder="# Product Description&#10;&#10;Write your description here using **markdown**..."
                        />
                    </div>
                </div>

                {/* GROUP 3: METADATA */}
                <div className="space-y-4 pb-6 border-b border-slate-700">
                    <h3 className="text-lg font-bold text-slate-200">Metadata & Details</h3>
                    <div className="grid grid-cols-2 gap-4">
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
                        <div className="space-y-2">
                            <Label htmlFor="niche">Niche / Topic</Label>
                            <Input
                                id="niche"
                                className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-400"
                                value={data.niche}
                                onChange={(e) => updateData({ niche: e.target.value })}
                                placeholder="e.g. Solo Entrepreneurship"
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        {!isAmazon && !isExternal && (
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
                        )}
                    </div>

                    {!isAmazon && !isExternal && (
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
                                <Label htmlFor="licenseType">License Type</Label>
                                <Select
                                    value={data.licenseType}
                                    onValueChange={(val) => updateData({ licenseType: val })}
                                >
                                    <SelectTrigger className="text-white bg-slate-800 border-slate-700">
                                        <SelectValue placeholder="Select license" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                                        <SelectItem value="PLR" className="focus:bg-slate-700 focus:text-white">PLR (Private Label Rights)</SelectItem>
                                        <SelectItem value="MRR" className="focus:bg-slate-700 focus:text-white">MRR (Master Resell Rights)</SelectItem>
                                        <SelectItem value="RR" className="focus:bg-slate-700 focus:text-white">RR (Resell Rights)</SelectItem>
                                        <SelectItem value="Personal Use" className="focus:bg-slate-700 focus:text-white">Personal Use</SelectItem>
                                        <SelectItem value="Commercial Use" className="focus:bg-slate-700 focus:text-white">Commercial Use</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                {/* PROMOTIONAL ROTATION SECTION */}
                {!isFunnelPage && (
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <h3 className="text-lg font-bold text-indigo-400">Promotional Rotation</h3>
                            <p className="text-xs text-slate-400">Control if and how this product appears in rotating features across the site.</p>
                        </div>

                        <div className="flex items-center space-x-3 bg-slate-800/50 p-4 rounded-xl border border-slate-700">
                            <input
                                type="checkbox"
                                id="isFeaturedInRotation"
                                className="w-5 h-5 rounded border-slate-700 text-indigo-600 focus:ring-indigo-500 bg-slate-900"
                                checked={data.isFeaturedInRotation}
                                onChange={(e) => updateData({ isFeaturedInRotation: e.target.checked })}
                            />
                            <div className="space-y-0.5">
                                <Label htmlFor="isFeaturedInRotation" className="text-sm font-bold text-slate-200 cursor-pointer">Include in Rotation Pool</Label>
                                <p className="text-[10px] text-slate-500">When enabled, this product will randomly appear on glossary terms and other sales hubs.</p>
                            </div>
                        </div>

                        {(!isAmazon || isExternal) && (
                            <div className="space-y-2">
                                <Label htmlFor="externalUrl" className="text-sm font-bold text-slate-300">Custom Destination URL (Optional)</Label>
                                <Input
                                    id="externalUrl"
                                    className="text-white bg-slate-800 border-slate-700 placeholder:text-slate-500"
                                    value={data.externalUrl}
                                    onChange={(e) => updateData({ externalUrl: e.target.value })}
                                    placeholder="https://external-store.com/your-product"
                                />
                                <p className="text-[10px] text-slate-500">
                                    If set, "Buy" buttons will lead here instead of the internal sales page. Perfect for affiliate links or Amazon.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {showMediaLibrary && (
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <h2 className="text-xl font-bold dark:text-white">Select Media</h2>
                            <button onClick={() => setShowMediaLibrary(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors font-bold text-slate-500 dark:text-slate-400">X</button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-slate-50 dark:bg-slate-900">
                            <MediaLibrary onSelect={(url) => {
                                updateData({ imageUrl: url });
                                setShowMediaLibrary(false);
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
