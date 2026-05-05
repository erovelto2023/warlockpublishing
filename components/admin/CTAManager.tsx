"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createCallToAction, updateCallToAction, deleteCallToAction } from "@/lib/actions/cta.actions";
import { Plus, Trash2, Edit2, CheckCircle2, Save, Target } from "lucide-react";
import CallToActionBlock from "@/components/shared/CallToActionBlock";

export default function CTAManager({ initialCtas }: { initialCtas: any[] }) {
    const [ctas, setCtas] = useState(initialCtas);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    
    const [formData, setFormData] = useState({
        internalName: "",
        headline: "",
        body: "",
        buttonText: "",
        buttonUrl: "",
        themeColor: "indigo" as any,
        imageUrl: ""
    });

    const resetForm = () => {
        setFormData({
            internalName: "",
            headline: "",
            body: "",
            buttonText: "",
            buttonUrl: "",
            themeColor: "indigo",
            imageUrl: ""
        });
        setEditingId(null);
    };

    const handleEdit = (cta: any) => {
        setFormData({
            internalName: cta.internalName,
            headline: cta.headline,
            body: cta.body,
            buttonText: cta.buttonText,
            buttonUrl: cta.buttonUrl,
            themeColor: cta.themeColor || "indigo",
            imageUrl: cta.imageUrl || ""
        });
        setEditingId(cta._id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this CTA? Terms using it will simply stop rendering it.")) return;
        try {
            await deleteCallToAction(id);
            setCtas(prev => prev.filter(c => c._id !== id));
            if (editingId === id) resetForm();
        } catch (e) {
            console.error(e);
            alert("Failed to delete CTA");
        }
    };

    const handleSave = async () => {
        if (!formData.internalName || !formData.headline || !formData.body || !formData.buttonText || !formData.buttonUrl) {
            alert("Please fill all required fields");
            return;
        }
        setIsSaving(true);
        try {
            let saved: any;
            if (editingId) {
                saved = await updateCallToAction(editingId, formData);
                setCtas(prev => prev.map(c => c._id === editingId ? saved : c));
            } else {
                saved = await createCallToAction(formData);
                setCtas(prev => [saved, ...prev]);
            }
            resetForm();
        } catch (e) {
            console.error(e);
            alert("Failed to save CTA");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 space-y-6">
                <Card className="p-6 bg-slate-900 border-slate-800 shadow-2xl">
                    <div className="flex items-center gap-2 text-indigo-400 font-black uppercase tracking-widest text-[10px] mb-6">
                        <Target size={14} /> {editingId ? 'Edit Call-To-Action' : 'Create New Call-To-Action'}
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Internal Name</label>
                            <Input 
                                value={formData.internalName} 
                                onChange={e => setFormData(prev => ({ ...prev, internalName: e.target.value }))}
                                className="bg-slate-950 border-slate-800 text-white font-bold h-11"
                                placeholder="e.g. Coloring Book Promo"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Headline</label>
                            <Input 
                                value={formData.headline} 
                                onChange={e => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                                className="bg-slate-950 border-slate-800 text-white font-bold h-11"
                                placeholder="Start Your Publishing Empire"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Body Text</label>
                            <Textarea 
                                value={formData.body} 
                                onChange={e => setFormData(prev => ({ ...prev, body: e.target.value }))}
                                className="bg-slate-950 border-slate-800 text-white font-bold min-h-[100px] resize-none"
                                placeholder="Download our 'Niche Profit Matrix'..."
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Button Text</label>
                                <Input 
                                    value={formData.buttonText} 
                                    onChange={e => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                                    className="bg-slate-950 border-slate-800 text-white font-bold h-11"
                                    placeholder="Download Now"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Theme Color</label>
                                <select 
                                    value={formData.themeColor} 
                                    onChange={e => setFormData(prev => ({ ...prev, themeColor: e.target.value as any }))}
                                    className="w-full bg-slate-950 border border-slate-800 text-white font-bold h-11 rounded-md px-3"
                                >
                                    <option value="indigo">Indigo</option>
                                    <option value="emerald">Emerald</option>
                                    <option value="amber">Amber</option>
                                    <option value="rose">Rose</option>
                                    <option value="slate">Slate</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Button URL</label>
                            <Input 
                                value={formData.buttonUrl} 
                                onChange={e => setFormData(prev => ({ ...prev, buttonUrl: e.target.value }))}
                                className="bg-slate-950 border-slate-800 text-white font-bold h-11"
                                placeholder="https://..."
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Image URL (Optional)</label>
                            <Input 
                                value={formData.imageUrl} 
                                onChange={e => setFormData(prev => ({ ...prev, imageUrl: e.target.value }))}
                                className="bg-slate-950 border-slate-800 text-white font-bold h-11"
                                placeholder="/images/my-book.png"
                            />
                        </div>
                        
                        <div className="pt-4 flex gap-4">
                            <Button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12"
                            >
                                <Save size={16} className="mr-2" />
                                {isSaving ? 'Saving...' : (editingId ? 'Update CTA' : 'Create CTA')}
                            </Button>
                            {editingId && (
                                <Button 
                                    onClick={resetForm} 
                                    variant="outline"
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 px-6"
                                >
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </div>
                </Card>

                {/* Live Preview */}
                {(formData.headline || formData.body) && (
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4">Live Preview</h4>
                        <div className="opacity-90 scale-[0.85] origin-top">
                            <CallToActionBlock cta={formData} />
                        </div>
                    </div>
                )}
            </div>
            
            <div className="lg:col-span-7 space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500 px-4 mb-4">Saved CTAs ({ctas.length})</h3>
                {ctas.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-slate-800 rounded-2xl text-slate-500">
                        No CTAs created yet. Build your first one!
                    </div>
                ) : (
                    ctas.map(cta => (
                        <Card key={cta._id} className="p-5 bg-slate-900 border-slate-800 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between group">
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{cta.internalName}</span>
                                    <span className={`w-2 h-2 rounded-full bg-${cta.themeColor}-500`}></span>
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1 truncate">{cta.headline}</h4>
                                <p className="text-sm text-slate-400 line-clamp-1">{cta.body}</p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto">
                                <Button 
                                    onClick={() => handleEdit(cta)}
                                    variant="ghost" 
                                    size="sm" 
                                    className="flex-1 md:flex-none h-9 text-slate-400 hover:text-indigo-400 hover:bg-slate-800"
                                >
                                    <Edit2 size={14} className="mr-2 md:mr-0" />
                                    <span className="md:hidden">Edit</span>
                                </Button>
                                <Button 
                                    onClick={() => handleDelete(cta._id)}
                                    variant="ghost" 
                                    size="sm" 
                                    className="flex-1 md:flex-none h-9 text-slate-400 hover:text-red-400 hover:bg-slate-800"
                                >
                                    <Trash2 size={14} className="mr-2 md:mr-0" />
                                    <span className="md:hidden">Delete</span>
                                </Button>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
