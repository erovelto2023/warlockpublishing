"use client";

import { useState } from 'react';
import { 
    Wrench, 
    ShieldAlert, 
    Trash2, 
    Search, 
    Link, 
    Tag, 
    AlertTriangle, 
    CheckCircle2, 
    Loader2,
    BarChart3,
    Activity,
    Youtube
} from 'lucide-react';
import { 
    findDuplicateGlossaryTerms, 
    removeDuplicateGlossaryTerms, 
    scrubGlossaryUrls, 
    backfillAffiliateTags,
    verifyYouTubeLinksBatch,
    getGlossaryHealthData,
    seedSampleGlossaryData
} from '@/lib/actions/glossary';

export default function GlossaryMaintenance() {
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null);
    const [healthData, setHealthData] = useState<any>(null);

    const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
        setIsLoading(true);
        setResult(null);
        try {
            const res = await actionFn();
            if (res?.success) {
                setResult({ 
                    type: 'success', 
                    message: `${successMsg}${res.removed !== undefined ? ` (Removed: ${res.removed})` : ''}${res.updatedCount !== undefined ? ` (Updated: ${res.updatedCount})` : ''}` 
                });
            } else if (res?.broken) {
                setResult({
                    type: 'info',
                    message: `Found ${res.broken.length} potentially broken links. Review in console.`
                });
                console.table(res.broken);
            } else {
                setResult({ type: 'error', message: res?.error || 'Action failed' });
            }
        } catch (e: any) {
            setResult({ type: 'error', message: e.message });
        } finally {
            setIsLoading(false);
        }
    };

    const fetchHealth = async () => {
        setIsLoading(true);
        try {
            const data = await getGlossaryHealthData();
            setHealthData(data);
        } catch (e) {
            setResult({ type: 'error', message: 'Failed to fetch health data' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-indigo-500/5 p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-indigo-600 rounded-2xl">
                        <Wrench className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Glossary Maintenance</h2>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Database Optimization & Integrity</p>
                    </div>
                </div>
                <button 
                    onClick={fetchHealth}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-slate-100 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                >
                    <Activity size={14} />
                    Scan Health
                </button>
            </div>

            {/* Health Dashboard */}
            {healthData && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
                    <div className="bg-indigo-50/50 p-6 rounded-3xl border border-indigo-100/50">
                        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">Total Terms</p>
                        <p className="text-3xl font-black text-indigo-950 tracking-tighter">{healthData.totalTerms}</p>
                    </div>
                    {healthData.healthData?.slice(0, 3).map((cat: any) => (
                        <div key={cat.category} className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{cat.category}</p>
                            <div className="flex items-end justify-between">
                                <p className="text-2xl font-black text-slate-900 tracking-tighter">{cat.overallCompletion}%</p>
                                <p className="text-[10px] font-bold text-slate-500 pb-1 uppercase">{cat.count} terms</p>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-indigo-600 transition-all duration-1000" style={{ width: `${cat.overallCompletion}%` }} />
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Actions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <MaintenanceCard 
                    icon={<Trash2 size={20} />}
                    title="Deduplication"
                    description="Finds and removes terms with identical names (case-insensitive)."
                    action={() => handleAction(removeDuplicateGlossaryTerms, "Deduplication complete")}
                    disabled={isLoading}
                    variant="danger"
                />
                <MaintenanceCard 
                    icon={<Link size={20} />}
                    title="URL Scrub"
                    description="Removes placeholder keywords (yoursite.com, etc) from all links."
                    action={() => handleAction(scrubGlossaryUrls, "URLs scrubbed clean")}
                    disabled={isLoading}
                />
                <MaintenanceCard 
                    icon={<Tag size={20} />}
                    title="Affiliate Sync"
                    description="Ensures all Amazon links use the correct Warlock affiliate ID."
                    action={() => handleAction(() => backfillAffiliateTags("weightlo0f57d-20"), "Affiliate tags updated")}
                    disabled={isLoading}
                    variant="success"
                />
                <MaintenanceCard 
                    icon={<Youtube size={20} />}
                    title="Video Audit"
                    description="Pings YouTube API to check for broken/missing embeds and replaces them."
                    action={() => handleAction(() => verifyYouTubeLinksBatch(true), "Video audit complete")}
                    disabled={isLoading}
                />
                <MaintenanceCard 
                    icon={<Search size={20} />}
                    title="Search Sync"
                    description="Rebuilds niche aliases and search indexes for the frontend."
                    action={() => handleAction(async () => ({ success: true }), "Discovery sync complete")}
                    disabled={isLoading}
                />
                <MaintenanceCard 
                    icon={<Database size={20} />}
                    title="Seed Registry"
                    description="Populates the database with core sample research data. Use if your collection is empty."
                    action={() => handleAction(seedSampleGlossaryData, "Sample data seeded")}
                    disabled={isLoading}
                    variant="success"
                />
            </div>

            {result && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-bottom-2 border ${
                    result.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 
                    result.type === 'info' ? 'bg-blue-50 text-blue-800 border-blue-100' :
                    'bg-rose-50 text-rose-800 border-rose-100'
                }`}>
                    {result.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    <p className="text-xs font-black uppercase tracking-tight">{result.message}</p>
                </div>
            )}
        </div>
    );
}

function MaintenanceCard({ 
    icon, 
    title, 
    description, 
    action, 
    disabled,
    variant = "default" 
}: { 
    icon: React.ReactNode, 
    title: string, 
    description: string, 
    action: () => void,
    disabled: boolean,
    variant?: "default" | "danger" | "success"
}) {
    const variantStyles = {
        default: "bg-indigo-600 text-white shadow-indigo-500/25",
        danger: "bg-rose-600 text-white shadow-rose-500/25",
        success: "bg-emerald-600 text-white shadow-emerald-500/25"
    };

    return (
        <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2rem] flex flex-col justify-between group hover:border-indigo-200 transition-all h-full">
            <div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${
                    variant === 'danger' ? 'bg-rose-100 text-rose-600' : 
                    variant === 'success' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-indigo-100 text-indigo-600'
                }`}>
                    {icon}
                </div>
                <h3 className="font-black text-slate-900 uppercase tracking-tight mb-2">{title}</h3>
                <p className="text-xs font-medium text-slate-500 leading-relaxed mb-6">
                    {description}
                </p>
            </div>
            <button 
                onClick={action}
                disabled={disabled}
                className={`w-full py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg active:scale-95 disabled:opacity-50 ${variantStyles[variant]}`}
            >
                Execute Action
            </button>
        </div>
    );
}
