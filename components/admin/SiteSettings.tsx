"use client";

import { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Globe, Monitor, ShieldAlert } from 'lucide-react';
import MediaLibrary from '@/components/admin/MediaLibrary';

export default function SiteSettings() {
    const [settings, setSettings] = useState({
        siteTitle: '',
        siteDescription: '',
        homeHeroImageUrl: '',
        isMaintenanceMode: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [showMediaLibrary, setShowMediaLibrary] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            const data = await res.json();
            if (data && !data.error) {
                setSettings({
                    siteTitle: data.siteTitle || '',
                    siteDescription: data.siteDescription || '',
                    homeHeroImageUrl: data.homeHeroImageUrl || '',
                    isMaintenanceMode: data.isMaintenanceMode || false
                });
            }
        } catch (err) {
            console.error('Failed to fetch settings', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                alert('Settings saved successfully!');
            } else {
                alert('Failed to save settings.');
            }
        } catch (err) {
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse text-slate-400 font-bold uppercase tracking-widest">Loading Site Config...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                    <Globe className="text-blue-600" /> Site Configuration
                </h2>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50"
                >
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Configuration'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <Monitor size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Metatags & Branding</span>
                        </div>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Site Title</label>
                            <input
                                type="text"
                                value={settings.siteTitle}
                                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                                placeholder="Warlock Publishing"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase">Site Description</label>
                            <textarea
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all h-32 resize-none leading-relaxed"
                                placeholder="Premium digital products and marketing mastery..."
                            />
                        </div>
                    </div>

                    <div className="bg-red-50 p-8 rounded-3xl border border-red-100 space-y-4">
                        <div className="flex items-center gap-2 text-red-600">
                            <ShieldAlert size={18} />
                            <span className="text-xs font-black uppercase tracking-widest">Danger Zone</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-bold text-red-900">Maintenance Mode</p>
                                <p className="text-[10px] text-red-600 uppercase font-bold tracking-tight">Disable public access to the storefront</p>
                            </div>
                            <button 
                                onClick={() => setSettings({...settings, isMaintenanceMode: !settings.isMaintenanceMode})}
                                className={`w-14 h-7 rounded-full transition-all relative ${settings.isMaintenanceMode ? 'bg-red-600' : 'bg-slate-300'}`}
                            >
                                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${settings.isMaintenanceMode ? 'left-8' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Hero Image Selection */}
                <div className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <div className="flex items-center gap-2 text-slate-400 mb-2">
                            <ImageIcon size={16} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Main Hero Graphic</span>
                        </div>

                        <div className="w-full aspect-[4/5] bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl overflow-hidden relative group">
                            {settings.homeHeroImageUrl ? (
                                <>
                                    <img src={settings.homeHeroImageUrl} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={() => setShowMediaLibrary(true)}
                                            className="bg-white text-slate-900 px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-widest"
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <button 
                                    onClick={() => setShowMediaLibrary(true)}
                                    className="w-full h-full flex flex-col items-center justify-center gap-3 text-slate-400 hover:text-blue-600 transition-colors"
                                >
                                    <PlusIcon size={32} />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Select Header</span>
                                </button>
                            )}
                        </div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold leading-tight">
                            Recommended: 1920x1080px or higher. This will appear as the main visual on your homepage.
                        </p>
                    </div>
                </div>
            </div>

            {/* Media Library Modal */}
            {showMediaLibrary && (
                <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-4">
                    <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl h-[80vh] overflow-hidden flex flex-col relative">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                            <h3 className="text-xl font-black uppercase tracking-tighter">Select Hero Graphic</h3>
                            <button onClick={() => setShowMediaLibrary(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors font-bold text-slate-400">X</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4">
                            <MediaLibrary onSelect={(img) => {
                                setSettings({ ...settings, homeHeroImageUrl: img.url });
                                setShowMediaLibrary(false);
                            }} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function PlusIcon({ size }: { size: number }) {
    return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
}
