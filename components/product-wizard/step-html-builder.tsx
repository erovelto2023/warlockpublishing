"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { WizardData } from "./ProductWizard"
import { useState } from "react"
import { Code, Link as LinkIcon, Image as ImageIcon, CheckCircle2 } from "lucide-react"
import MediaLibrary from '@/components/admin/MediaLibrary'

interface StepHtmlBuilderProps {
    data: WizardData
    updateData: (data: Partial<WizardData>) => void
}

export function StepHtmlBuilder({ data, updateData }: StepHtmlBuilderProps) {
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleMediaSelect = (url: string) => {
        const imgTag = `<img src="${url}" alt="Product Image" className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />`;
        copyToClipboard(imgTag);
        setShowMediaLibrary(false);
        alert('Image tag copied to clipboard! You can now paste it into your HTML.');
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Code className="text-blue-500" /> HTML Page Builder
                    </h2>
                    <p className="text-slate-500 text-sm">Paste your raw HTML here. Your tracking codes and checkout links will be dynamically injected.</p>
                </div>

                {/* Pure HTML Area */}
                <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="htmlContent" className="text-lg font-bold">Page HTML Body</Label>
                        <Button 
                            type="button"
                            variant="outline"
                            size="sm"
                            className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-300 gap-2 font-medium"
                            onClick={() => setShowMediaLibrary(true)}
                        >
                            <ImageIcon size={14} /> Insert Media
                        </Button>
                    </div>
                    <Textarea
                        id="htmlContent"
                        className="font-mono text-sm min-h-[500px] bg-[#1e1e1e] text-[#d4d4d4] border-slate-700 focus:border-blue-500 focus:ring-blue-500 placeholder:text-slate-600"
                        value={data.htmlContent}
                        onChange={(e) => updateData({ htmlContent: e.target.value })}
                        placeholder={`<div class="max-w-4xl mx-auto py-12">\n  <h1 class="text-4xl font-bold text-center">My Awesome Product</h1>\n  <p class="mt-4 text-center">Get it today for just $19.99</p>\n  \n  <div class="mt-8 text-center">\n    <a href="{{CHECKOUT_LINK}}" class="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors">\n      Buy Now Securely\n    </a>\n  </div>\n</div>`}
                    />
                </div>
            </div>

            {/* Sidebar / Configuration */}
            <div className="space-y-6 lg:border-l lg:border-slate-200 lg:pl-8">
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-slate-800">Dynamic Injections</h3>
                    
                    <div className="space-y-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                        <Label htmlFor="grooveSellEmbed" className="font-bold text-blue-900 flex items-center gap-2">
                            Tracking Code (Body)
                        </Label>
                        <Textarea
                            id="grooveSellEmbed"
                            className="font-mono text-xs min-h-[100px] border-blue-200 bg-white"
                            value={data.grooveSellEmbed}
                            onChange={(e) => updateData({ grooveSellEmbed: e.target.value })}
                            placeholder={`<img src="https://tracking.groovesell.com/salespage/tracking/92110" style="border:0px; width:0px; height: 0px;"/>`}
                        />
                        <p className="text-[10px] text-slate-500 leading-relaxed">
                            This code will be automatically injected into the top of the page body. You do not need to place it in the HTML manually.
                        </p>
                    </div>

                    <div className="space-y-3 bg-emerald-50/50 p-4 rounded-xl border border-emerald-100">
                        <Label htmlFor="externalUrl" className="font-bold text-emerald-900 flex items-center gap-2">
                            <LinkIcon size={16} /> Checkout Link
                        </Label>
                        <Input
                            id="externalUrl"
                            className="font-mono text-xs border-emerald-200 bg-white"
                            value={data.externalUrl}
                            onChange={(e) => updateData({ externalUrl: e.target.value })}
                            placeholder={`https://kbusiness.groovesell.com/checkout/...`}
                        />
                        <div className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-emerald-200 mt-2">
                            <p className="font-medium mb-2">How to use in HTML:</p>
                            <code className="bg-slate-100 px-2 py-1 rounded border border-slate-200 font-black text-slate-700 block text-center mb-2">
                                {`{{CHECKOUT_LINK}}`}
                            </code>
                            <p className="text-[10px] text-slate-500 mt-2">
                                Use the exact phrase above anywhere in your HTML (like inside an href attribute). It will be replaced with your checkout link when the page loads.
                            </p>
                            <Button 
                                type="button" 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-3 h-8 text-[10px] font-bold uppercase tracking-wider"
                                onClick={() => copyToClipboard('{{CHECKOUT_LINK}}')}
                            >
                                {copySuccess ? <span className="text-green-600 flex items-center justify-center gap-1"><CheckCircle2 size={12} /> Copied</span> : 'Copy Placeholder'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Media Library Modal */}
            {showMediaLibrary && (
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-slate-200 dark:border-slate-800">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
                            <div>
                                <h2 className="text-xl font-bold dark:text-white">Select Media</h2>
                                <p className="text-xs text-slate-500 mt-1">Select an image to generate an HTML tag for your layout.</p>
                            </div>
                            <button onClick={() => setShowMediaLibrary(false)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors font-bold text-slate-500 dark:text-slate-400">X</button>
                        </div>
                        <div className="flex-1 overflow-auto p-4 bg-slate-50 dark:bg-slate-900">
                            <MediaLibrary onSelect={handleMediaSelect} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
