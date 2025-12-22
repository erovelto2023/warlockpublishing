"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { WizardData } from "./ProductWizard"

interface StepDetailsProps {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
}

export function StepDetails({ data, updateData }: StepDetailsProps) {
    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="space-y-2">
                <h2 className="text-2xl font-bold">Final Details</h2>
                <p className="text-slate-500">Configure pricing, images, and integration settings.</p>
            </div>

            <div className="grid gap-6">
                <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={data.description}
                        onChange={(e) => updateData({ description: e.target.value })}
                        placeholder="Product description for internal use or catalog"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="price">Price ($)</Label>
                        <Input
                            id="price"
                            type="number"
                            value={data.price}
                            onChange={(e) => updateData({ price: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={data.category}
                            onChange={(e) => updateData({ category: e.target.value })}
                            placeholder="e.g. Productivity"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="format">Format</Label>
                        <Input
                            id="format"
                            value={data.format}
                            onChange={(e) => updateData({ format: e.target.value })}
                            placeholder="e.g. PDF, Video, SaaS"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="imageUrl">Cover Image URL</Label>
                    <Input
                        id="imageUrl"
                        value={data.imageUrl}
                        onChange={(e) => updateData({ imageUrl: e.target.value })}
                        placeholder="https://..."
                    />
                </div>

                <div className="space-y-4 pt-4 border-t">
                    <h3 className="font-semibold">Integration Settings</h3>

                    {data.productType === 'amazon' || data.isAmazonProduct ? (
                        <div className="space-y-2">
                            <Label htmlFor="amazonLink">Amazon Product Link</Label>
                            <Input
                                id="amazonLink"
                                value={data.amazonLink}
                                onChange={(e) => updateData({ amazonLink: e.target.value })}
                                placeholder="https://amazon.com/dp/..."
                            />
                        </div>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <Label htmlFor="grooveSellId">GrooveSell Tracking ID</Label>
                                <Input
                                    id="grooveSellId"
                                    value={data.grooveSellId}
                                    onChange={(e) => updateData({ grooveSellId: e.target.value })}
                                    placeholder="e.g. 85437"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="grooveSellEmbed">GrooveSell Embed Code</Label>
                                <Textarea
                                    id="grooveSellEmbed"
                                    value={data.grooveSellEmbed}
                                    onChange={(e) => updateData({ grooveSellEmbed: e.target.value })}
                                    placeholder="<div...>"
                                    className="font-mono text-xs"
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="flex items-center space-x-2 pt-4">
                    <Checkbox
                        id="isHidden"
                        checked={data.isHidden}
                        onCheckedChange={(checked) => updateData({ isHidden: checked as boolean })}
                    />
                    <div className="grid gap-1.5 leading-none">
                        <Label htmlFor="isHidden">Hide from public catalog</Label>
                        <p className="text-sm text-muted-foreground">
                            Useful for upsells, downsells, or thank you pages that shouldn't be discovered directly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
