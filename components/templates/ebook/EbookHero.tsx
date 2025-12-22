import React from 'react';

interface EbookHeroProps {
    headline?: string;
    subheadline?: string;
    ctaText?: string;
}

export function EbookHero({
    headline = "Reclaim Your Focus in a Distracted World",
    subheadline = "Stop drowning in notifications. \"Mastering Flow\" is the science-backed guide to achieving 4 hours of deep work every single day.",
    ctaText = "Get the Ebook"
}: EbookHeroProps) {
    return (
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-50">
            {/* Background decorative blobs */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-100 blur-3xl opacity-50"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                    {/* Text Content */}
                    <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wide mb-6 border border-blue-100">
                            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                            New 2nd Edition Released
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                            {headline}
                        </h1>
                        <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
                            {subheadline}
                        </p>

                        {/* Bullet Points (Benefit Driven) */}
                        <ul className="space-y-3 mb-8 text-slate-700 text-left mx-auto lg:mx-0 max-w-lg">
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>Eliminate brain fog and mental fatigue by noon.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>Structure your day to get 2x more done in half the time.</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                <span>Learn the "No-Guilt" framework for turning down meetings.</span>
                            </li>
                        </ul>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                            <a href="#pricing" className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                                {ctaText}
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                            </a>
                            <span className="text-sm font-semibold text-slate-500">
                                <span className="text-green-600">●</span> Instant Download
                            </span>
                        </div>
                    </div>

                    {/* Book Visual */}
                    <div className="flex justify-center lg:justify-end">
                        <div className="book-container p-10 scale-90 md:scale-100 relative perspective-[1000px]">
                            <div className="book w-[260px] h-[380px] relative preserve-3d rotate-y-[-25deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-y-[-15deg] hover:rotate-x-[5deg] hover:-translate-y-2 shadow-2xl">
                                <div className="book-front absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 rounded-r-lg rounded-l-sm text-white flex flex-col justify-between p-8 translate-z-[25px] z-20 border-l-4 border-slate-700 overflow-hidden">
                                    <div className="mt-4 relative z-10">
                                        <p className="text-blue-300 text-xs tracking-widest uppercase font-bold">The Ultimate Guide</p>
                                        <h2 className="text-3xl font-bold mt-2 leading-tight">Mastering<br />Flow</h2>
                                        <p className="text-sm text-slate-300 mt-2">The Science of Deep Work</p>
                                    </div>
                                    <div className="mb-4 relative z-10">
                                        <div className="h-0.5 w-12 bg-blue-500 mb-4"></div>
                                        <p className="text-xs text-slate-400 font-medium">Alex Vandyne</p>
                                    </div>
                                    {/* Decorative circle */}
                                    <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-500/20 rounded-full blur-xl"></div>
                                </div>
                                <div className="book-side absolute top-1 left-0 w-[50px] h-[372px] bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rotate-y-[-90deg] translate-z-[25px] rounded-sm origin-left"></div>
                                <div className="book-pages absolute top-1.5 right-0 w-[46px] h-[368px] bg-slate-100 rotate-y-[90deg] translate-z-[-23px] origin-right bg-[repeating-linear-gradient(to_right,#f1f5f9_0px,#e2e8f0_2px,#f1f5f9_4px)]"></div>
                            </div>
                            {/* Shadow underneath */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/20 blur-xl rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
