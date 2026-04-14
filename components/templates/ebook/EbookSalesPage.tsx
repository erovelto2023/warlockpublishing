import React from 'react';
import ReactMarkdown from 'react-markdown';

interface EbookSalesPageProps {
    data: any;
}

/**
 * A highly robust, simplified version of the Ebook Sales Page.
 * Designed to NEVER crash regardless of missing or malformed data.
 */
export function EbookSalesPage({ data }: EbookSalesPageProps) {
    // 1. Defensively resolve blocks with guaranteed defaults
    const getBlock = (id: string) => {
        if (!data || !Array.isArray(data.blocks)) return {};
        const block = data.blocks.find((b: any) => b.id === id);
        return block?.enabled ? (block.data || {}) : {};
    };

    const navbar = getBlock('navbar');
    const hero = getBlock('hero');
    const synopsis = getBlock('synopsis');
    const problem = getBlock('problem');
    const solution = getBlock('solution');
    const reviews = getBlock('reviews');
    const author = getBlock('author');
    const pricing = getBlock('pricing');
    const faq = getBlock('faq');
    const footer = getBlock('footer');
    const bonuses = getBlock('bonuses');

    // 2. Helper Utilities
    const safeString = (val: any, fallback = "") => typeof val === 'string' ? val : fallback;
    const safeArray = (val: any) => Array.isArray(val) ? val : [];

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'clock':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
            case 'alert':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;
            case 'zap':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
            case 'star':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>;
            default:
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
        }
    };

    return (
        <div className="font-sans text-slate-800 bg-white antialiased">
            {/* Navigation */}
            {navbar.brandName && (
                <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                        <div className="font-bold text-xl tracking-tight flex items-center gap-2">
                            <span className="text-blue-600">✦</span> {navbar.brandName}
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <a href="#pricing" className="px-5 py-2 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition">
                                {safeString(navbar.ctaText, "Get Started")}
                            </a>
                        </div>
                    </div>
                </nav>
            )}

            {/* Hero Section */}
            {hero.headline && (
                <section className="relative pt-32 pb-20 bg-slate-50 overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase mb-6 tracking-wider">
                                {safeString(hero.badgeText, "New Release")}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 mb-6 leading-tight">
                                {hero.headline}
                            </h1>
                            <p className="text-lg text-slate-600 mb-8 max-w-xl mx-auto lg:mx-0">
                                {hero.subheadline}
                            </p>
                            <a href="#pricing" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition shadow-xl shadow-blue-500/20">
                                {safeString(hero.ctaText, "Order Now")} →
                            </a>
                        </div>
                        <div className="flex justify-center">
                            <div className="relative w-64 md:w-80 aspect-[2/3] bg-slate-800 rounded-lg shadow-2xl overflow-hidden border-4 border-white transform rotate-3 hover:rotate-0 transition duration-500">
                                {hero.bookCoverImage ? (
                                    <img src={hero.bookCoverImage} alt="Cover" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center p-8 text-center text-white italic opacity-50">
                                        Cover Coming Soon
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Main Content Blocks */}
            <div className="max-w-4xl mx-auto px-4 py-16 space-y-24">
                
                {/* Synopsis / Intro */}
                {(synopsis.title || synopsis.description) && (
                    <section className="prose prose-slate max-w-none text-center">
                        <h2 className="text-3xl font-bold mb-6">{safeString(synopsis.title, "Synopsis")}</h2>
                        <div className="text-lg text-slate-600 leading-relaxed italic">
                           <ReactMarkdown>{safeString(synopsis.description)}</ReactMarkdown>
                        </div>
                    </section>
                )}

                {/* The Problem */}
                {problem.title && (
                    <section className="p-8 md:p-12 bg-red-50 rounded-3xl border border-red-100">
                        <h2 className="text-2xl font-bold text-red-900 mb-6 flex items-center gap-3">
                            <span className="text-red-400">✕</span> {problem.title}
                        </h2>
                        <div className="text-slate-700 leading-relaxed font-medium">
                            <ReactMarkdown>{safeString(problem.text)}</ReactMarkdown>
                        </div>
                    </section>
                )}

                {/* The Solution */}
                {solution.title && (
                    <section className="p-8 md:p-12 bg-green-50 rounded-3xl border border-green-100">
                        <h2 className="text-2xl font-bold text-green-900 mb-6 flex items-center gap-3">
                            <span className="text-green-500">✓</span> {solution.title}
                        </h2>
                        <div className="text-slate-700 leading-relaxed font-medium">
                            <ReactMarkdown>{safeString(solution.text)}</ReactMarkdown>
                        </div>
                    </section>
                )}
            </div>

            {/* Author Section */}
            {author.title && (
                <section className="bg-slate-900 text-white py-20">
                    <div className="max-w-4xl mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
                        <div className="w-40 h-40 rounded-full bg-slate-800 border-4 border-slate-700 overflow-hidden flex-shrink-0">
                            {author.authorImage ? (
                                <img src={author.authorImage} alt={author.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-3xl">👤</div>
                            )}
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="text-2xl font-bold mb-2">{author.title}</h2>
                            <p className="text-blue-400 font-bold mb-4 uppercase tracking-widest text-sm">{safeString(author.role)}</p>
                            <p className="text-slate-400 leading-relaxed">{safeString(author.bio)}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing Section */}
            {pricing.title && (
                <section id="pricing" className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 text-center">
                        <h2 className="text-4xl font-bold mb-4">{pricing.title}</h2>
                        <p className="text-slate-600 mb-12 max-w-xl mx-auto">{pricing.subtitle}</p>
                        
                        <div className="max-w-md mx-auto p-8 rounded-3xl border-2 border-blue-600 bg-white shadow-2xl relative">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full uppercase">Best Value</div>
                            <h3 className="text-xl font-bold mb-2">{safeString(pricing.tier2Name, "Standard Edition")}</h3>
                            <div className="text-5xl font-extrabold text-slate-900 my-6">
                                {safeString(pricing.tier2Price, "$0.00")}
                            </div>
                            <ul className="text-left space-y-4 mb-8">
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="text-green-500 font-bold">✓</span> Full Digital Access
                                </li>
                                <li className="flex items-center gap-3 text-slate-600">
                                    <span className="text-green-500 font-bold">✓</span> Priority Support
                                </li>
                            </ul>
                            <a href={hero.checkoutUrl || "#"} className="block w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition">
                                Order Now
                            </a>
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="py-12 bg-slate-50 border-t border-slate-200 text-center">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="text-slate-400 text-sm">
                        &copy; {new Date().getFullYear()} {safeString(footer.copyright, safeString(navbar.brandName, "Warlock Publishing"))}. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}
