'use client'

import { 
    TrendingUp, Clock, Globe, ArrowUpRight, 
    MousePointer2, ExternalLink, Calendar,
    BarChart
} from 'lucide-react';

interface TrafficIntelligenceProps {
    data: {
        popularPages: any[];
        topReferrers: any[];
        hourlyActivity: any[];
        totalHits: number;
    };
}

const formatDuration = (ms: number) => {
    if (!ms) return '0s';
    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
};

export default function TrafficIntelligence({ data }: TrafficIntelligenceProps) {
    if (!data) return <div className="p-8 text-neutral-500">No analytics data available.</div>;

    const { popularPages, topReferrers, hourlyActivity, totalHits } = data;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* High Level Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg">
                            <MousePointer2 className="w-5 h-5 text-blue-500" />
                        </div>
                        <h4 className="font-medium text-slate-500">Total Page Views</h4>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {totalHits.toLocaleString()}
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-500/10 rounded-lg">
                            <Clock className="w-5 h-5 text-emerald-500" />
                        </div>
                        <h4 className="font-medium text-slate-500">Peak Hour</h4>
                    </div>
                    <div className="text-3xl font-bold text-slate-900">
                        {hourlyActivity.length > 0 ? `${hourlyActivity.sort((a,b) => b.count - a.count)[0]._id}:00` : 'N/A'}
                    </div>
                </div>

                <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <Globe className="w-5 h-5 text-purple-500" />
                        </div>
                        <h4 className="font-medium text-slate-500">Primary Source</h4>
                    </div>
                    <div className="text-3xl font-bold text-slate-900 truncate">
                        {topReferrers[0]?._id || 'Direct'}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Popular Pages */}
                <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-emerald-500" />
                            Most Popular Pages
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {popularPages.map((page, i) => (
                            <div key={page._id} className="group flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 rounded-xl transition-colors">
                                <div className="flex items-center gap-4">
                                    <span className="text-xs font-bold text-neutral-400 w-4">{i + 1}</span>
                                    <div>
                                        <div className="font-medium text-slate-900 text-sm truncate max-w-[200px]">
                                            {page._id}
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {formatDuration(page.avgDwellTime)} avg stay
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <div className="font-bold text-slate-900">{page.views}</div>
                                        <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Views</div>
                                    </div>
                                    <a href={page._id} target="_blank" rel="noreferrer" className="p-2 text-neutral-400 hover:text-emerald-500 transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Traffic Sources */}
                <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="font-bold text-lg flex items-center gap-2">
                            <Globe className="w-5 h-5 text-indigo-500" />
                            Active Referrers
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {topReferrers.map((ref) => (
                            <div key={ref._id} className="flex items-center justify-between p-3 border-b border-neutral-100 dark:border-neutral-800 last:border-0">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${ref._id === 'Direct' ? 'bg-slate-400' : 'bg-emerald-500'}`} />
                                    <span className="text-sm font-medium text-slate-700">
                                        {ref._id}
                                    </span>
                                </div>
                                <div className="text-sm font-bold text-slate-900">
                                    {ref.count}
                                </div>
                            </div>
                        ))}
                        {topReferrers.length === 0 && (
                            <div className="py-12 text-center text-neutral-500 italic text-sm">
                                Direct traffic only recorded so far.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Hourly Pulse (Simple Bar Representation) */}
            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
                    <BarChart className="w-5 h-5 text-blue-500" />
                    24-Hour Traffic Pulse
                </h3>
                <div className="flex items-end gap-1 h-32 w-full">
                    {Array.from({ length: 24 }).map((_, hour) => {
                        const activity = hourlyActivity.find(a => a._id === hour);
                        const height = activity ? (activity.count / Math.max(...hourlyActivity.map(a => a.count)) * 100) : 2;
                        return (
                            <div key={hour} className="flex-1 group relative">
                                <div 
                                    style={{ height: `${height}%` }}
                                    className={`w-full rounded-t-sm transition-all duration-500 ${height > 2 ? 'bg-blue-500/60 group-hover:bg-blue-500' : 'bg-neutral-200 dark:bg-neutral-800'}`}
                                />
                                <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded whitespace-nowrap z-10">
                                    {hour}:00 - {activity?.count || 0} visits
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    <span>12 AM</span>
                    <span>6 AM</span>
                    <span>12 PM</span>
                    <span>6 PM</span>
                    <span>11 PM</span>
                </div>
            </div>
        </div>
    );
}
