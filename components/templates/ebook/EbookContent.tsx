import React from 'react';

export function EbookChapters() {
    return (
        <section id="chapters" className="py-20 bg-slate-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">What's Inside?</h2>
                        <p className="text-slate-400 mb-8 text-lg">Over 200 pages of actionable strategies, templates, and systems to rebuild your work life.</p>

                        <div className="space-y-4">
                            {[
                                { num: "01", title: "The Biology of Focus", desc: "Understanding dopamine and attention residue." },
                                { num: "02", title: "Environment Design", desc: "Setting up your physical and digital workspace for success." },
                                { num: "03", title: "The 4-Hour Deep Work System", desc: "My proprietary scheduling method for maximum output." },
                                { num: "04", title: "Saying \"No\" Gracefully", desc: "Scripts and strategies to protect your time without burning bridges." }
                            ].map((chapter) => (
                                <div key={chapter.num} className="flex gap-4 items-start p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-blue-600 font-bold text-sm">{chapter.num}</span>
                                    <div>
                                        <h4 className="font-bold text-lg">{chapter.title}</h4>
                                        <p className="text-sm text-slate-400">{chapter.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative hidden lg:block">
                        {/* Preview Card */}
                        <div className="bg-white text-slate-800 rounded-xl shadow-2xl p-8 rotate-2 hover:rotate-0 transition duration-500">
                            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                <span className="ml-auto text-xs font-mono text-slate-400">Chapter 03 Preview</span>
                            </div>
                            <div className="prose prose-slate">
                                <h3 className="text-2xl font-bold mb-4">The 90-Minute Cycle</h3>
                                <p className="mb-4">Our brains are not designed for 8-hour marathons. They operate in ultradian rhythms...</p>
                                <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 mb-4">
                                    <p className="font-medium text-blue-800">Key Insight:</p>
                                    <p className="text-sm text-blue-700">Rest is not the opposite of work. It is a necessary partner to it. Without high-quality rest, high-quality work is impossible.</p>
                                </div>
                                <p className="text-slate-500">...</p>
                            </div>
                            <div className="absolute -z-10 top-4 -right-4 w-full h-full bg-blue-600 rounded-xl opacity-20"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function EbookPricing() {
    return (
        <section id="pricing" className="py-24 bg-white relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Path to Focus</h2>
                    <p className="text-lg text-slate-600">One-time payment. Instant access.</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {/* Basic Tier */}
                    <div className="rounded-2xl border border-slate-200 p-8 hover:border-blue-300 transition">
                        <h3 className="text-lg font-bold text-slate-900">The Ebook</h3>
                        <div className="mt-4 flex items-baseline text-slate-900">
                            <span className="text-4xl font-extrabold tracking-tight">$29</span>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">The essential guide to restarting your brain.</p>
                        <ul role="list" className="mt-6 space-y-4 mb-8">
                            <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">PDF & ePub Formats</span></li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">Lifetime Updates</span></li>
                        </ul>
                        <a href="#" className="block w-full bg-slate-100 border border-transparent rounded-lg py-3 px-4 text-center font-bold text-slate-800 hover:bg-slate-200 transition">Get Basic ($29)</a>
                    </div>

                    {/* Pro Tier (Highlighted) */}
                    <div className="relative rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-2xl scale-105 z-10">
                        <div className="absolute top-0 right-0 -mt-4 mr-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">Best Value</div>
                        <h3 className="text-lg font-bold text-slate-900">Complete System</h3>
                        <div className="mt-4 flex items-baseline text-slate-900">
                            <span className="text-4xl font-extrabold tracking-tight">$59</span>
                            <span className="ml-2 text-xl text-slate-400 line-through">$99</span>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">The full toolkit for rapid transformation.</p>
                        <ul role="list" className="mt-6 space-y-4 mb-8">
                            <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-900 font-medium">The Ebook (PDF/ePub)</span></li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-900 font-medium">Audiobook Version (MP3)</span></li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-900 font-medium">Notion Dashboard Template</span></li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-900 font-medium">30-Day Action Plan</span></li>
                        </ul>
                        <a href="#" className="block w-full bg-blue-600 border border-transparent rounded-lg py-4 px-4 text-center font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">Get Complete Bundle ($59)</a>

                        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                            30-Day Money-Back Guarantee
                        </div>
                    </div>

                    {/* Team Tier */}
                    <div className="rounded-2xl border border-slate-200 p-8 hover:border-blue-300 transition">
                        <h3 className="text-lg font-bold text-slate-900">Team Pack</h3>
                        <div className="mt-4 flex items-baseline text-slate-900">
                            <span className="text-4xl font-extrabold tracking-tight">$199</span>
                        </div>
                        <p className="mt-4 text-sm text-slate-500">For agencies and startups.</p>
                        <ul role="list" className="mt-6 space-y-4 mb-8">
                            <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">10 Licenses</span></li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">Team Workshop Recording</span></li>
                            <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">Admin Dashboard</span></li>
                        </ul>
                        <a href="#" className="block w-full bg-slate-100 border border-transparent rounded-lg py-3 px-4 text-center font-bold text-slate-800 hover:bg-slate-200 transition">Get Team License ($199)</a>
                    </div>
                </div>
            </div>
        </section>
    );
}
