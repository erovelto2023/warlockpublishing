import React from 'react';

interface SoftwareHeroProps {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
}

export function SoftwareHero({
    headline = "Manage projects without the chaos.",
    subheadline = "TaskFlow helps teams organize, track, and manage their work with ease. Join 10,000+ teams who ship faster with us.",
    ctaText = "Start Free Trial"
}: SoftwareHeroProps) {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full filter blur-[40px] opacity-40 -z-10"></div>
            <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 bg-purple-100 rounded-full filter blur-[40px] opacity-40 -z-10"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-8 border border-blue-100">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    v2.0 is now live. See what's new &rarr;
                </div>

                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
                    {headline}
                </h1>

                <p className="mt-4 text-xl text-slate-500 max-w-2xl mx-auto mb-10">
                    {subheadline}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
                    <button className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/20 transform hover:-translate-y-1">
                        {ctaText}
                    </button>
                    <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-semibold text-lg hover:bg-slate-50 transition flex items-center justify-center gap-2">
                        <i className="fa-solid fa-play text-blue-600"></i> Watch Demo
                    </button>
                </div>

                <div className="relative max-w-5xl mx-auto mt-12">
                    <div className="absolute inset-0 bg-blue-600 blur-3xl opacity-10 rounded-[3rem]"></div>
                    <div className="relative rounded-xl shadow-2xl border border-slate-200 bg-slate-900 overflow-hidden text-left">
                        <div className="h-10 bg-slate-800 flex items-center px-4 gap-2 border-b border-slate-700">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="ml-4 bg-slate-900/50 rounded-md px-4 py-1 text-xs text-slate-400 font-mono flex-1 text-center border border-slate-700/50">
                                <i className="fa-solid fa-lock text-[10px] mr-1"></i> app.taskflow.com/dashboard
                            </div>
                        </div>
                        <img src="https://placehold.co/1200x800/f8fafc/cbd5e1?text=Main+Dashboard+View" alt="App Dashboard" className="w-full h-auto block" />
                    </div>
                </div>
            </div>
        </section>
    );
}
