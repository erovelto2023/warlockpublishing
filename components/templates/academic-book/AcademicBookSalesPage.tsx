"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    BookOpen, ArrowRight, FileText, University, Star, Columns, Landmark, School,
    Network, Brain, Laptop, ChevronDown, User, Twitter, Globe, Quote, Check,
    Linkedin, Menu, X
} from 'lucide-react';
import { Inter, Merriweather } from 'next/font/google';
import { cn } from "@/lib/utils";

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
});

const merriweather = Merriweather({
    subsets: ['latin'],
    weight: ['300', '400', '700', '900'],
    variable: '--font-merriweather',
});

interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    isAmazonProduct?: boolean;
    amazonLink?: string;
    grooveSellEmbed?: string;
    format?: string;
}

interface AcademicBookSalesPageProps {
    product: Product;
    authorName: string;
}

export default function AcademicBookSalesPage({ product, authorName }: AcademicBookSalesPageProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [openChapter, setOpenChapter] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleChapter = (index: number) => setOpenChapter(openChapter === index ? null : index);

    return (
        <div className={cn("font-sans text-slate-600 antialiased bg-slate-50", inter.variable, merriweather.variable)} style={{ fontFamily: 'var(--font-inter)' }}>
            <style jsx global>{`
                h1, h2, h3, h4, h5, h6, .font-serif {
                    font-family: var(--font-merriweather), serif;
                }
                .book-shadow {
                    box-shadow: 
                        -15px 0 30px rgba(0,0,0,0.3),
                        0 0 0 2px #333 inset,
                        -5px 0 10px rgba(0,0,0,0.2) inset; 
                }
                .spine {
                    background: linear-gradient(90deg, rgba(255,255,255,0.2), rgba(0,0,0,0.1) 20%, rgba(0,0,0,0.2) 80%, rgba(255,255,255,0.1));
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .rotate-y-12 {
                    transform: rotateY(12deg);
                }
            `}</style>

            {/* Navigation */}
            <nav className={cn("fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 transition-all duration-300", scrolled && "shadow-md bg-white/95")}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="font-serif font-bold text-2xl text-slate-800">Scholar<span className="text-[#0284c7]">Press</span></span>
                        </div>
                        <div className="hidden md:flex space-x-8 items-center">
                            <a href="#about" className="text-slate-600 hover:text-[#0284c7] font-medium transition">About</a>
                            <a href="#contents" className="text-slate-600 hover:text-[#0284c7] font-medium transition">Contents</a>
                            <a href="#author" className="text-slate-600 hover:text-[#0284c7] font-medium transition">Author</a>
                            <a href="#reviews" className="text-slate-600 hover:text-[#0284c7] font-medium transition">Reviews</a>
                            <a href="#purchase" className="px-5 py-2.5 bg-[#075985] hover:bg-[#0c4a6e] text-white font-medium rounded-full transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Buy Now
                            </a>
                        </div>
                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-slate-600 hover:text-slate-900 focus:outline-none">
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 absolute w-full shadow-lg">
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-[#0284c7] hover:bg-slate-50">About</a>
                            <a href="#contents" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-[#0284c7] hover:bg-slate-50">Contents</a>
                            <a href="#author" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-[#0284c7] hover:bg-slate-50">Author</a>
                            <a href="#reviews" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium text-slate-700 hover:text-[#0284c7] hover:bg-slate-50">Reviews</a>
                            <a href="#purchase" onClick={() => setIsMenuOpen(false)} className="block px-3 py-3 rounded-md text-base font-medium bg-[#f0f9ff] text-[#075985] mt-4 text-center">Buy Now</a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-white z-0">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03]"></div>
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#f0f9ff] opacity-50 blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-50 opacity-50 blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
                        {/* Text Content */}
                        <div className="lg:col-span-7 text-center lg:text-left mb-12 lg:mb-0">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#f0f9ff] text-[#075985] text-sm font-semibold mb-6 border border-[#e0f2fe]">
                                <span className="flex h-2 w-2 rounded-full bg-[#0284c7] mr-2"></span>
                                Now in its 4th Edition
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-black text-slate-900 leading-tight mb-6">
                                {product.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-slate-600 font-light mb-8 leading-relaxed">
                                {product.description || "The definitive guide to understanding macro-economic systems in the digital age. Designed for students, researchers, and professionals."}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                                <a href="#purchase" className="px-8 py-4 bg-[#075985] hover:bg-[#0c4a6e] text-white font-semibold rounded-lg shadow-xl shadow-[#0284c7]/20 transition transform hover:-translate-y-1 text-lg flex items-center justify-center">
                                    Get Your Copy
                                    <ArrowRight className="ml-2 w-4 h-4" />
                                </a>
                                <a href="#sample" className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-lg border border-slate-200 shadow-sm transition flex items-center justify-center">
                                    <FileText className="mr-2 w-5 h-5 text-red-500" />
                                    Download Sample
                                </a>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-8 text-sm text-slate-500 font-medium">
                                <div className="flex items-center">
                                    <University className="text-[#0284c7] mr-2 w-5 h-5" />
                                    Adopted by 50+ Universities
                                </div>
                                <div className="flex items-center">
                                    <Star className="text-[#ca8a04] mr-2 w-5 h-5 fill-current" />
                                    4.9/5 Scholar Rating
                                </div>
                            </div>
                        </div>

                        {/* Book Cover Visual */}
                        <div className="lg:col-span-5 relative perspective-1000 group">
                            {/* Decorative Circle behind book */}
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-[#e0f2fe] to-white rounded-full opacity-60 blur-2xl -z-10"></div>

                            {/* The Book */}
                            <div className="relative mx-auto w-64 md:w-80 aspect-[2/3] bg-slate-800 rounded-r-lg rounded-l-sm book-shadow transform transition-transform duration-500 hover:scale-105 hover:-rotate-2 rotate-y-12">
                                {/* Book Cover Design */}
                                {product.imageUrl ? (
                                    <div className="absolute inset-0 bg-slate-900 rounded-r-lg overflow-hidden border-l-4 border-slate-800">
                                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 bg-slate-900 rounded-r-lg overflow-hidden flex flex-col p-6 text-center border-l-4 border-slate-800">
                                        <div className="flex-1 flex flex-col justify-center items-center border-2 border-slate-700/50 p-4 m-2">
                                            <span className="text-brand-400 font-serif tracking-widest text-xs uppercase mb-4 text-[#0284c7]">Fourth Edition</span>
                                            <h3 className="text-white font-serif text-3xl font-bold leading-tight mb-2">{product.title}</h3>
                                            <div className="w-12 h-1 bg-[#0284c7] my-4"></div>
                                            <p className="text-slate-400 text-sm">Systems & Strategies</p>
                                        </div>
                                        <div className="mt-auto pt-6">
                                            <p className="text-white font-medium text-sm">{authorName}</p>
                                        </div>
                                    </div>
                                )}
                                {/* Spine effect */}
                                <div className="absolute top-0 bottom-0 left-0 w-4 bg-gradient-to-r from-white/10 to-transparent spine z-20"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Social Proof / Logos */}
            <section className="py-10 border-y border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">Trusted by departments at</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="flex items-center gap-2 text-2xl font-serif font-bold text-slate-700"><Columns className="w-6 h-6" /> Stanford</div>
                        <div className="flex items-center gap-2 text-2xl font-serif font-bold text-slate-700"><University className="w-6 h-6" /> Oxford</div>
                        <div className="flex items-center gap-2 text-2xl font-serif font-bold text-slate-700"><Landmark className="w-6 h-6" /> MIT Press</div>
                        <div className="flex items-center gap-2 text-2xl font-serif font-bold text-slate-700"><School className="w-6 h-6" /> Harvard</div>
                    </div>
                </div>
            </section>

            {/* About the Book */}
            <section id="about" className="py-20 lg:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">Why This Book Matters</h2>
                        <div className="w-20 h-1 bg-[#0284c7] mx-auto rounded-full mb-6"></div>
                        <p className="text-lg text-slate-600">
                            Most economic textbooks are stuck in the 20th century. This volume rebuilds the foundation of economic theory using data science, behavioral psychology, and modern computational models.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
                        {/* Feature 1 */}
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition group">
                            <div className="w-14 h-14 bg-[#e0f2fe] text-[#0284c7] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0284c7] group-hover:text-white transition">
                                <Network className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Data-Driven Models</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Move beyond theoretical curves. Learn how real-time big data is reshaping supply and demand in the gig economy.
                            </p>
                        </div>
                        {/* Feature 2 */}
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition group">
                            <div className="w-14 h-14 bg-[#e0f2fe] text-[#0284c7] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0284c7] group-hover:text-white transition">
                                <Brain className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Behavioral Economics</h3>
                            <p className="text-slate-600 leading-relaxed">
                                An entire section dedicated to the psychology of pricing, spending, and the irrationality of market actors.
                            </p>
                        </div>
                        {/* Feature 3 */}
                        <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:shadow-lg transition group">
                            <div className="w-14 h-14 bg-[#e0f2fe] text-[#0284c7] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#0284c7] group-hover:text-white transition">
                                <Laptop className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Python Case Studies</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Includes a companion GitHub repository with Python notebooks for every major model discussed in the text.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Table of Contents */}
            <section id="contents" className="py-20 bg-slate-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 mb-4">What's Inside</h2>
                        <p className="text-slate-600">Comprehensive coverage across 12 chapters and 450 pages.</p>
                    </div>

                    <div className="space-y-4">
                        {/* Chapter Item */}
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => toggleChapter(1)}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className="text-[#0284c7] font-bold font-serif text-lg">01</span>
                                    <h4 className="font-bold text-slate-800 text-lg">Foundations of Modern Value</h4>
                                </div>
                                <ChevronDown className={cn("text-slate-400 transition-transform duration-300", openChapter === 1 && "rotate-180")} />
                            </div>
                            <div className={cn("mt-4 pl-10 text-slate-600 border-l-2 border-slate-100", openChapter !== 1 && "hidden")}>
                                <p className="mb-2">A critique of classical value theory and introduction to network effects.</p>
                                <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
                                    <li>The failure of Utils</li>
                                    <li>Network Value Metrics</li>
                                    <li>Digital Scarcity</li>
                                </ul>
                            </div>
                        </div>

                        {/* Chapter Item */}
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => toggleChapter(2)}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className="text-[#0284c7] font-bold font-serif text-lg">02</span>
                                    <h4 className="font-bold text-slate-800 text-lg">Algorithmic Markets</h4>
                                </div>
                                <ChevronDown className={cn("text-slate-400 transition-transform duration-300", openChapter === 2 && "rotate-180")} />
                            </div>
                            <div className={cn("mt-4 pl-10 text-slate-600 border-l-2 border-slate-100", openChapter !== 2 && "hidden")}>
                                <p className="mb-2">How high-frequency trading and AI pricing models alter market equilibrium.</p>
                                <ul className="list-disc list-inside text-sm text-slate-500 space-y-1">
                                    <li>HFT Strategies</li>
                                    <li>Dynamic Pricing Ethics</li>
                                    <li>The Black Box Problem</li>
                                </ul>
                            </div>
                        </div>

                        {/* Chapter Item */}
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => toggleChapter(3)}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className="text-[#0284c7] font-bold font-serif text-lg">03</span>
                                    <h4 className="font-bold text-slate-800 text-lg">Global Crypto-Economics</h4>
                                </div>
                                <ChevronDown className={cn("text-slate-400 transition-transform duration-300", openChapter === 3 && "rotate-180")} />
                            </div>
                            <div className={cn("mt-4 pl-10 text-slate-600 border-l-2 border-slate-100", openChapter !== 3 && "hidden")}>
                                <p className="mb-2">Analyzing decentralized finance without the hype.</p>
                            </div>
                        </div>
                        {/* Chapter Item */}
                        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => toggleChapter(4)}>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <span className="text-[#0284c7] font-bold font-serif text-lg">04</span>
                                    <h4 className="font-bold text-slate-800 text-lg">Policy & Public Good</h4>
                                </div>
                                <ChevronDown className={cn("text-slate-400 transition-transform duration-300", openChapter === 4 && "rotate-180")} />
                            </div>
                            <div className={cn("mt-4 pl-10 text-slate-600 border-l-2 border-slate-100", openChapter !== 4 && "hidden")}>
                                <p className="mb-2">The role of government in a borderless digital economy.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-10">
                        <a href="#" className="text-[#075985] font-semibold hover:text-[#0c4a6e] inline-flex items-center">
                            View Full Table of Contents <ArrowRight className="ml-2 w-4 h-4" />
                        </a>
                    </div>
                </div>
            </section>

            {/* Author Section */}
            <section id="author" className="py-20 bg-white overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 relative">
                        {/* Decorative pattern */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-bl-full"></div>

                        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 relative">
                                {/* Author Photo Placeholder */}
                                <div className="w-full h-full rounded-full bg-slate-700 border-4 border-slate-600 overflow-hidden flex items-center justify-center">
                                    <User className="w-24 h-24 text-slate-500" />
                                </div>
                                {/* Badge */}
                                <div className="absolute bottom-2 right-2 bg-[#0284c7] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                    PhD, MIT
                                </div>
                            </div>

                            <div className="text-center md:text-left text-white">
                                <h2 className="text-3xl font-serif font-bold mb-2">{authorName}</h2>
                                <p className="text-brand-400 font-medium mb-6 uppercase tracking-wider text-sm text-[#0284c7]">Professor of Computational Economics</p>
                                <p className="text-slate-300 leading-relaxed mb-6 text-lg">
                                    {authorName} has spent two decades bridging the gap between computer science and economic theory. Formerly a quantitative analyst at the World Bank, she now leads the Digital Economy Lab. Her research has been cited over 5,000 times.
                                </p>
                                <div className="flex justify-center md:justify-start gap-4">
                                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"><Twitter className="w-5 h-5" /></a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"><Linkedin className="w-5 h-5" /></a>
                                    <a href="#" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition text-white"><Globe className="w-5 h-5" /></a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="reviews" className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif font-bold text-center text-slate-900 mb-16">Praise from the Community</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Review 1 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 relative">
                            <Quote className="w-10 h-10 text-[#e0f2fe] absolute top-4 left-4 fill-current" />
                            <p className="text-slate-600 relative z-10 mb-6 mt-4">
                                "Finally, a textbook that treats the digital economy as the norm, not an exception. Essential reading for any graduate student."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">JD</div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">James Doe</p>
                                    <p className="text-xs text-slate-500">Assoc. Professor, LSE</p>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 relative">
                            <Quote className="w-10 h-10 text-[#e0f2fe] absolute top-4 left-4 fill-current" />
                            <p className="text-slate-600 relative z-10 mb-6 mt-4">
                                "The Python notebooks alone are worth the price of the book. It allowed my students to simulate market crashes in real-time."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">AS</div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Amanda Smith</p>
                                    <p className="text-xs text-slate-500">Lecturer, Stanford</p>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 relative">
                            <Quote className="w-10 h-10 text-[#e0f2fe] absolute top-4 left-4 fill-current" />
                            <p className="text-slate-600 relative z-10 mb-6 mt-4">
                                "Clear, concise, and rigorous. Dr. Vance has a rare talent for making complex algorithms accessible."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-500">RK</div>
                                <div>
                                    <p className="font-bold text-slate-900 text-sm">Robert King</p>
                                    <p className="text-xs text-slate-500">Economist, FinTech Corp</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / CTA */}
            <section id="purchase" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-slate-900">Purchase Options</h2>
                        <p className="text-slate-600 mt-2">Bulk licensing available for institutions.</p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
                        {/* Option 1: eBook */}
                        <div className="border border-slate-200 rounded-2xl p-8 hover:border-[#0284c7] transition text-center">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Digital Only</h3>
                            <p className="text-slate-500 text-sm mb-6">PDF + ePub Formats</p>
                            <div className="text-4xl font-serif font-bold text-slate-900 mb-6">${product.price}</div>
                            <ul className="text-left space-y-3 mb-8 text-sm text-slate-600">
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> Instant Download</li>
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> Searchable Text</li>
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> Mobile Friendly</li>
                            </ul>
                            {product.isAmazonProduct ? (
                                <Link href={product.amazonLink || "#"} target="_blank" className="block w-full">
                                    <button className="w-full py-3 bg-slate-100 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition">
                                        Buy on Amazon
                                    </button>
                                </Link>
                            ) : (
                                <button className="block w-full py-3 bg-slate-100 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition">
                                    Buy eBook
                                </button>
                            )}
                        </div>

                        {/* Option 2: Print + Digital (Featured) */}
                        <div className="border-2 border-[#0284c7] rounded-2xl p-8 shadow-xl relative transform lg:-translate-y-4 bg-white z-10">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0284c7] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">Most Popular</div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">Hardcover Bundle</h3>
                            <p className="text-slate-500 text-sm mb-6 text-center">Physical Book + eBook + Code</p>
                            <div className="text-5xl font-serif font-bold text-[#075985] mb-6 text-center">${(product.price * 2).toFixed(2)}</div>
                            <ul className="text-left space-y-3 mb-8 text-slate-600">
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> Premium Hardcover</li>
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> Free Shipping (US)</li>
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> <strong>Includes Digital Copy</strong></li>
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> Access to GitHub Repos</li>
                            </ul>
                            <button className="block w-full py-4 bg-[#0284c7] text-white font-bold rounded-lg hover:bg-[#075985] transition text-center shadow-lg shadow-[#0284c7]/20">
                                Add to Cart
                            </button>
                        </div>

                        {/* Option 3: Institutional */}
                        <div className="border border-slate-200 rounded-2xl p-8 hover:border-[#0284c7] transition text-center">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Classroom Set</h3>
                            <p className="text-slate-500 text-sm mb-6">For Professors & Libraries</p>
                            <div className="text-4xl font-serif font-bold text-slate-900 mb-6">Custom</div>
                            <ul className="text-left space-y-3 mb-8 text-sm text-slate-600">
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> Discounted Rates</li>
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> Teaching Slides</li>
                                <li className="flex items-center"><Check className="text-green-500 mr-2 w-4 h-4" /> Exam Question Bank</li>
                            </ul>
                            <button className="block w-full py-3 bg-slate-100 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition">
                                Request Quote
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <details className="bg-white p-5 rounded-lg border border-slate-200 cursor-pointer group">
                            <summary className="font-semibold text-slate-800 list-none flex justify-between items-center">
                                Is this book suitable for undergraduates?
                                <span className="text-[#0284c7] group-open:rotate-180 transition-transform"><ChevronDown className="w-5 h-5" /></span>
                            </summary>
                            <p className="mt-3 text-slate-600 text-sm">Yes, it is designed for upper-level undergraduates and first-year graduate students. A basic understanding of microeconomics is recommended.</p>
                        </details>
                        <details className="bg-white p-5 rounded-lg border border-slate-200 cursor-pointer group">
                            <summary className="font-semibold text-slate-800 list-none flex justify-between items-center">
                                Do I need to know Python?
                                <span className="text-[#0284c7] group-open:rotate-180 transition-transform"><ChevronDown className="w-5 h-5" /></span>
                            </summary>
                            <p className="mt-3 text-slate-600 text-sm">No. While the companion code is in Python, the book explains concepts conceptually. The code is a bonus for those who want to apply the models.</p>
                        </details>
                        <details className="bg-white p-5 rounded-lg border border-slate-200 cursor-pointer group">
                            <summary className="font-semibold text-slate-800 list-none flex justify-between items-center">
                                What is the return policy?
                                <span className="text-[#0284c7] group-open:rotate-180 transition-transform"><ChevronDown className="w-5 h-5" /></span>
                            </summary>
                            <p className="mt-3 text-slate-600 text-sm">We offer a 30-day money-back guarantee on physical copies if returned in original condition. Digital sales are final.</p>
                        </details>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <span className="font-serif font-bold text-2xl text-white">Scholar<span className="text-[#0284c7]">Press</span></span>
                            <p className="mt-4 text-sm max-w-xs">Dedicated to advancing human knowledge through rigorous, accessible, and modern academic publishing.</p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Resources</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-[#0284c7] transition">Errata</a></li>
                                <li><a href="#" className="hover:text-[#0284c7] transition">Instructor Resources</a></li>
                                <li><a href="#" className="hover:text-[#0284c7] transition">Source Code</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-4">Contact</h4>
                            <ul className="space-y-2 text-sm">
                                <li>support@scholarpress.edu</li>
                                <li>1-800-555-0199</li>
                                <li>Cambridge, MA</li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                        <p>&copy; {new Date().getFullYear()} Scholar Press. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white transition">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
