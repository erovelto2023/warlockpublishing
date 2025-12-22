"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    Menu, X, Star, Check, ArrowRight, Download, BookOpen, Heart, Sun, Feather,
    Smartphone, Headphones, ShieldCheck, User, Instagram, Facebook, Twitter
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

interface SpiritualBookSalesPageProps {
    product: Product;
    authorName: string;
}

export default function SpiritualBookSalesPage({ product, authorName }: SpiritualBookSalesPageProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleFaq = (index: number) => setActiveFaq(activeFaq === index ? null : index);

    return (
        <div className={cn("font-sans text-stone-700 antialiased bg-[#fbfaf8] selection:bg-[#c5d9cd] selection:text-[#23392d]", inter.variable, merriweather.variable)} style={{ fontFamily: 'var(--font-inter)' }}>
            <style jsx global>{`
                h1, h2, h3, h4, h5, h6, .font-serif {
                    font-family: var(--font-merriweather), serif;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
            `}</style>

            {/* Navigation */}
            <nav className={cn("fixed w-full z-50 transition-all duration-300 border-b", scrolled ? "bg-white/95 shadow-md border-transparent" : "bg-[#fbfaf8]/90 backdrop-blur-md border-[#e9e3d6]")}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-2">
                            {/* Simple Lotus Icon */}
                            <svg className="w-8 h-8 text-[#3e6b4f]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 2.5C12 2.5 16.5 8 16.5 13C16.5 15.4853 14.4853 17.5 12 17.5C9.51472 17.5 7.5 15.4853 7.5 13C7.5 8 12 2.5 12 2.5Z" />
                                <path d="M12 17.5C12 17.5 15.5 20 18.5 20C19.8807 20 21 18.8807 21 17.5C21 14 16.5 11 16.5 11" strokeLinecap="round" />
                                <path d="M12 17.5C12 17.5 8.5 20 5.5 20C4.11929 20 3 18.8807 3 17.5C3 14 7.5 11 7.5 11" strokeLinecap="round" />
                                <path d="M12 21.5V17.5" strokeLinecap="round" />
                            </svg>
                            <span className="text-xl font-serif text-stone-800 tracking-wide">Lumina Press</span>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#about" className="text-stone-600 hover:text-[#3e6b4f] transition-colors">About</a>
                            <a href="#benefits" className="text-stone-600 hover:text-[#3e6b4f] transition-colors">Benefits</a>
                            <a href="#author" className="text-stone-600 hover:text-[#3e6b4f] transition-colors">Author</a>
                            <a href="#reviews" className="text-stone-600 hover:text-[#3e6b4f] transition-colors">Reviews</a>
                            <a href="#purchase" className="bg-[#3e6b4f] text-white px-6 py-2.5 rounded-full hover:bg-[#335640] transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">Get the Book</a>
                        </div>
                        {/* Mobile Menu Button */}
                        <button className="md:hidden text-stone-600" onClick={toggleMenu}>
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-[#fbfaf8] border-t border-[#e9e3d6]">
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <a href="#about" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-stone-600 hover:bg-[#f4f7f5] rounded">About</a>
                            <a href="#benefits" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-stone-600 hover:bg-[#f4f7f5] rounded">Benefits</a>
                            <a href="#author" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-stone-600 hover:bg-[#f4f7f5] rounded">Author</a>
                            <a href="#purchase" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-[#3e6b4f] font-semibold hover:bg-[#f4f7f5] rounded">Get Your Copy</a>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-[#e3ebe5] blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-[#e9e3d6] blur-3xl opacity-50"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="space-y-8 text-center lg:text-left">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#e3ebe5] text-[#2a4535] text-sm font-medium">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#72a083] opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#528565]"></span>
                                </span>
                                <span>#1 New Release in Mindfulness</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-serif text-stone-900 leading-tight">
                                {product.title}
                            </h1>
                            <p className="text-xl text-stone-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                {product.description || "A practical guide to shedding anxiety, embracing the present moment, and finding profound peace in a chaotic world."}
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-4 sm:space-y-0 sm:space-x-4">
                                <a href="#purchase" className="w-full sm:w-auto px-8 py-4 bg-[#3e6b4f] text-white rounded-full font-medium hover:bg-[#335640] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-center">
                                    Start Reading Now
                                </a>
                                <a href="#preview" className="w-full sm:w-auto px-8 py-4 bg-white border border-[#d7cbb6] text-stone-700 rounded-full font-medium hover:bg-[#fbfaf8] transition-all text-center flex items-center justify-center group">
                                    Read First Chapter
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </a>
                            </div>
                            <p className="text-sm text-stone-500 flex items-center justify-center lg:justify-start gap-1">
                                <span className="text-amber-400 flex">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </span>
                                4.9/5 Rating from 200+ Readers
                            </p>
                        </div>

                        {/* Book Mockup */}
                        <div className="relative mx-auto lg:ml-auto w-full max-w-md">
                            {/* Decorative Circle behind book */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#c5d9cd] to-[#e9e3d6] rounded-full transform scale-90 blur-2xl opacity-60"></div>

                            {/* 3D Book CSS */}
                            <div className="relative transform hover:scale-105 transition-transform duration-500 cursor-pointer group perspective-1000">
                                <div className="relative rounded-r-lg rounded-l-sm shadow-2xl bg-white aspect-[2/3] w-full max-w-[320px] mx-auto overflow-hidden border-l-4 border-stone-200">
                                    {product.imageUrl ? (
                                        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="absolute inset-0 bg-[#f4f7f5] flex flex-col items-center justify-center p-8 text-center border border-stone-100">
                                            <svg className="w-24 h-24 text-[#3e6b4f] mb-6 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                                                <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" />
                                                <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" />
                                                <path d="M12 2V4M12 20V22M4 12H2M22 12H20M4.92999 4.93L6.33999 6.34M17.66 17.66L19.07 19.07M4.92999 19.07L6.33999 17.66M17.66 6.34L19.07 4.93" />
                                            </svg>
                                            <h3 className="text-3xl font-serif text-stone-800 mb-2">{product.title}</h3>
                                            <p className="text-sm font-sans tracking-widest text-stone-500 uppercase mt-2">{authorName}</p>
                                        </div>
                                    )}
                                    {/* Shine effect */}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none"></div>
                                </div>
                                {/* Book Shadow */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-xl rounded-full"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Social Proof / Logos */}
            <div className="py-10 border-y border-[#e9e3d6] bg-white/50">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="text-sm font-semibold tracking-widest text-stone-400 uppercase mb-6">Featured In</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        <span className="text-xl font-serif font-bold text-stone-600">Mindful<span className="font-light">Daily</span></span>
                        <span className="text-xl font-serif font-bold text-stone-600">The<span className="font-light">Yogi</span></span>
                        <span className="text-xl font-serif font-bold text-stone-600">Wellness<span className="font-light">Hub</span></span>
                        <span className="text-xl font-serif font-bold text-stone-600">Spirit<span className="font-light">&amp;Soul</span></span>
                    </div>
                </div>
            </div>

            {/* The Problem (Emotional Hook) */}
            <section className="py-24 bg-white" id="about">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <Heart className="w-12 h-12 text-[#72a083] mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">Does modern life feel like a storm you can't escape?</h2>
                    <p className="text-lg text-stone-600 leading-relaxed mb-8">
                        You wake up tired. You rush through your day, mind racing with to-do lists and worries about the future. You try to meditate, but silence feels uncomfortable. You know there must be a deeper way to live, but you don't know how to access it.
                    </p>
                    <p className="text-lg text-stone-600 leading-relaxed">
                        You aren't alone. And more importantly—you aren't broken. You just need a guide back to your center.
                    </p>
                </div>
            </section>

            {/* The Solution / Benefits */}
            <section className="py-24 bg-[#fbfaf8]" id="benefits">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">What You Will Discover</h2>
                        <div className="h-1 w-20 bg-[#72a083] mx-auto rounded-full"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100">
                            <div className="w-12 h-12 bg-[#e3ebe5] rounded-full flex items-center justify-center text-[#3e6b4f] mb-6">
                                <Sun className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-serif text-stone-800 mb-3">Daily Rituals</h3>
                            <p className="text-stone-600">Simple, 5-minute practices that seamlessly integrate into your busy schedule to ground you instantly.</p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100">
                            <div className="w-12 h-12 bg-[#e3ebe5] rounded-full flex items-center justify-center text-[#3e6b4f] mb-6">
                                <Heart className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-serif text-stone-800 mb-3">Emotional Healing</h3>
                            <p className="text-stone-600">Techniques to process grief, anxiety, and stress without being overwhelmed by them.</p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-stone-100">
                            <div className="w-12 h-12 bg-[#e3ebe5] rounded-full flex items-center justify-center text-[#3e6b4f] mb-6">
                                <Feather className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-serif text-stone-800 mb-3">Renewed Energy</h3>
                            <p className="text-stone-600">Stop leaking energy on worry. Reclaim your vitality and channel it into what truly matters.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inside the Book Preview */}
            <section className="py-24 bg-[#2a4535] text-[#f4f7f5]" id="preview">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center gap-12">
                    <div className="w-full md:w-1/2">
                        <h2 className="text-3xl md:text-4xl font-serif mb-6 text-white">Peek Inside the Pages</h2>
                        <p className="mb-8 text-[#c5d9cd]">
                            "{product.title}" isn't just a book to read; it's a journey to walk. Here is a glimpse of the path ahead:
                        </p>
                        <ul className="space-y-4">
                            <li className="flex items-center p-4 bg-[#335640]/50 rounded-lg border border-[#3e6b4f]">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#528565] text-white font-bold mr-4">1</span>
                                <div>
                                    <span className="font-bold block text-white">The Myth of "Busy"</span>
                                    <span className="text-sm text-[#c5d9cd]">Why we run and how to stop.</span>
                                </div>
                            </li>
                            <li className="flex items-center p-4 bg-[#335640]/50 rounded-lg border border-[#3e6b4f]">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#528565] text-white font-bold mr-4">2</span>
                                <div>
                                    <span className="font-bold block text-white">Breath as Anchor</span>
                                    <span className="text-sm text-[#c5d9cd]">Practical breathwork for panic and focus.</span>
                                </div>
                            </li>
                            <li className="flex items-center p-4 bg-[#335640]/50 rounded-lg border border-[#3e6b4f]">
                                <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#528565] text-white font-bold mr-4">3</span>
                                <div>
                                    <span className="font-bold block text-white">Sacred Spaces</span>
                                    <span className="text-sm text-[#c5d9cd]">Creating a sanctuary in your home.</span>
                                </div>
                            </li>
                        </ul>
                        <div className="mt-8">
                            <button className="text-white border-b border-[#72a083] pb-1 hover:text-[#c5d9cd] transition-colors">Download Sample Chapter &rarr;</button>
                        </div>
                    </div>
                    <div className="w-full md:w-1/2 relative">
                        <div className="bg-white text-stone-800 p-8 md:p-12 rounded-lg shadow-2xl font-serif italic text-lg leading-relaxed relative">
                            <span className="text-6xl text-[#c5d9cd] absolute top-4 left-4">"</span>
                            <p className="relative z-10">
                                Peace is not the absence of noise, trouble, or hard work. It is to be in the midst of those things and still be calm in your heart. This book teaches you how to build that sanctuary within yourself, brick by brick, breath by breath.
                            </p>
                            <div className="mt-6 text-right font-sans text-sm font-bold not-italic text-stone-500 uppercase tracking-wide">
                                — Excerpt from Chapter 1
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Author Section */}
            <section className="py-24 bg-[#f5f3ec]" id="author">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                        <div className="absolute inset-0 bg-[#9bbfa9] rounded-full blur opacity-50 transform translate-x-1 translate-y-1"></div>
                        {/* Author Image Placeholder using a neutral pattern/initials */}
                        <div className="relative w-full h-full bg-stone-300 rounded-full overflow-hidden border-4 border-white flex items-center justify-center">
                            <span className="text-4xl text-stone-500 font-serif">{authorName.charAt(0)}</span>
                        </div>
                    </div>
                    <h2 className="text-3xl font-serif text-stone-900 mb-2">Meet {authorName}</h2>
                    <p className="text-[#3e6b4f] font-medium mb-6">Holistic Health Coach & Meditation Teacher</p>
                    <p className="text-lg text-stone-600 leading-relaxed mb-8">
                        After spending a decade in the high-stress corporate world, {authorName} experienced a burnout that changed everything. She spent the next five years studying with mindfulness masters in Kyoto and Kerala. Now, she distills ancient wisdom into modern, accessible practices for the everyday seeker.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <a href="#" className="text-stone-400 hover:text-[#3e6b4f] transition-colors"><Instagram className="w-6 h-6" /></a>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-white" id="reviews">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl md:text-4xl font-serif text-center text-stone-900 mb-16">Stories of Transformation</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Review 1 */}
                        <div className="bg-[#fbfaf8] p-8 rounded-xl relative">
                            <span className="text-5xl text-[#d7cbb6] absolute -top-4 left-6">"</span>
                            <p className="text-stone-600 mb-6 italic relative z-10">This book felt like a warm hug. I finally understand how to meditate without feeling like I'm failing at it.</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-[#c5d9cd] rounded-full flex items-center justify-center font-bold text-[#335640] mr-3">SJ</div>
                                <div>
                                    <div className="font-bold text-stone-800">Sarah Jenkins</div>
                                    <div className="text-xs text-stone-500">Verified Reader</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-[#fbfaf8] p-8 rounded-xl relative">
                            <span className="text-5xl text-[#d7cbb6] absolute -top-4 left-6">"</span>
                            <p className="text-stone-600 mb-6 italic relative z-10">I keep this on my nightstand. Just reading a few pages calms my nervous system instantly.</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-amber-200 rounded-full flex items-center justify-center font-bold text-amber-700 mr-3">MK</div>
                                <div>
                                    <div className="font-bold text-stone-800">Marcus Kent</div>
                                    <div className="text-xs text-stone-500">Yoga Instructor</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-[#fbfaf8] p-8 rounded-xl relative md:col-span-2 lg:col-span-1">
                            <span className="text-5xl text-[#d7cbb6] absolute -top-4 left-6">"</span>
                            <p className="text-stone-600 mb-6 italic relative z-10">Practical, grounded, and devoid of the usual fluff. {authorName} gets straight to the heart of healing.</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center font-bold text-blue-700 mr-3">AL</div>
                                <div>
                                    <div className="font-bold text-stone-800">Dr. Anna Lee</div>
                                    <div className="text-xs text-stone-500">Psychologist</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / Purchase */}
            <section className="py-24 bg-[#f4f7f5]" id="purchase">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-4">Choose Your Path</h2>
                        <p className="text-stone-600">Start your journey today with the format that suits you best.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Option 1: Digital */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100 flex flex-col h-full hover:shadow-lg transition-shadow">
                            <h3 className="text-2xl font-serif text-stone-800 mb-2">Digital Edition</h3>
                            <p className="text-sm text-stone-500 mb-6">Instant Access (PDF, ePub, Kindle)</p>
                            <div className="text-4xl font-bold text-[#3e6b4f] mb-6">${product.price}</div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-center text-stone-600"><Check className="w-5 h-5 text-green-500 mr-2" /> Read on any device</li>
                                <li className="flex items-center text-stone-600"><Check className="w-5 h-5 text-green-500 mr-2" /> Instant download</li>
                            </ul>
                            {product.isAmazonProduct ? (
                                <Link href={product.amazonLink || "#"} target="_blank" className="w-full">
                                    <button className="w-full py-3 bg-stone-100 text-stone-800 font-semibold rounded-lg hover:bg-stone-200 transition-colors">
                                        Buy on Amazon
                                    </button>
                                </Link>
                            ) : (
                                <button className="w-full py-3 bg-stone-100 text-stone-800 font-semibold rounded-lg hover:bg-stone-200 transition-colors">
                                    Buy eBook
                                </button>
                            )}
                        </div>

                        {/* Option 2: Physical Bundle (Highlight) */}
                        <div className="bg-white p-8 rounded-2xl shadow-xl border-2 border-[#528565] relative flex flex-col h-full transform scale-105">
                            <div className="absolute top-0 right-0 bg-[#528565] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">MOST POPULAR</div>
                            <h3 className="text-2xl font-serif text-stone-800 mb-2">The Sanctuary Bundle</h3>
                            <p className="text-sm text-stone-500 mb-6">Hardcover + Audio Meditations</p>
                            <div className="flex items-end mb-6">
                                <div className="text-4xl font-bold text-[#3e6b4f]">${(product.price * 2).toFixed(2)}</div>
                                <div className="text-stone-400 line-through ml-2 mb-1">${(product.price * 3).toFixed(2)}</div>
                            </div>
                            <ul className="space-y-3 mb-8 flex-1">
                                <li className="flex items-center text-stone-600"><Check className="w-5 h-5 text-green-500 mr-2" /> Premium Hardcover Book</li>
                                <li className="flex items-center text-stone-600"><Check className="w-5 h-5 text-green-500 mr-2" /> Free Shipping (US)</li>
                                <li className="flex items-center text-stone-600"><Check className="w-5 h-5 text-green-500 mr-2" /> <span className="font-bold text-[#3e6b4f] ml-1">BONUS:</span> 5 Guided Audio Tracks</li>
                            </ul>
                            <button className="w-full py-3 bg-[#3e6b4f] text-white font-semibold rounded-lg hover:bg-[#335640] transition-colors shadow-md">
                                Order Now
                            </button>
                            <p className="text-xs text-center text-stone-400 mt-3">30-Day Money Back Guarantee</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-white border-t border-[#e9e3d6]">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl font-serif text-center text-stone-900 mb-12">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        {/* FAQ Item 1 */}
                        <div className="border border-stone-200 rounded-lg overflow-hidden">
                            <button className="w-full flex justify-between items-center p-4 bg-[#fbfaf8] hover:bg-[#f5f3ec] text-left transition-colors focus:outline-none" onClick={() => toggleFaq(1)}>
                                <span className="font-medium text-stone-800">Is this book suitable for beginners?</span>
                                <ArrowRight className={cn("w-5 h-5 text-stone-500 transform transition-transform", activeFaq === 1 && "rotate-90")} />
                            </button>
                            <div className={cn("p-4 text-stone-600 bg-white", activeFaq !== 1 && "hidden")}>
                                Absolutely. "{product.title}" was written specifically for those new to mindfulness. No jargon, just clear steps.
                            </div>
                        </div>

                        {/* FAQ Item 2 */}
                        <div className="border border-stone-200 rounded-lg overflow-hidden">
                            <button className="w-full flex justify-between items-center p-4 bg-[#fbfaf8] hover:bg-[#f5f3ec] text-left transition-colors focus:outline-none" onClick={() => toggleFaq(2)}>
                                <span className="font-medium text-stone-800">Do I need to be religious to read this?</span>
                                <ArrowRight className={cn("w-5 h-5 text-stone-500 transform transition-transform", activeFaq === 2 && "rotate-90")} />
                            </button>
                            <div className={cn("p-4 text-stone-600 bg-white", activeFaq !== 2 && "hidden")}>
                                Not at all. The teachings are secular and focused on mental well-being, psychology, and universal human experiences.
                            </div>
                        </div>

                        {/* FAQ Item 3 */}
                        <div className="border border-stone-200 rounded-lg overflow-hidden">
                            <button className="w-full flex justify-between items-center p-4 bg-[#fbfaf8] hover:bg-[#f5f3ec] text-left transition-colors focus:outline-none" onClick={() => toggleFaq(3)}>
                                <span className="font-medium text-stone-800">How do I access the audio bonuses?</span>
                                <ArrowRight className={cn("w-5 h-5 text-stone-500 transform transition-transform", activeFaq === 3 && "rotate-90")} />
                            </button>
                            <div className={cn("p-4 text-stone-600 bg-white", activeFaq !== 3 && "hidden")}>
                                After purchasing the bundle, you will receive an email with a private link to download or stream the guided meditations.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-stone-900 text-stone-400 py-12">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 grid md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center space-x-2 mb-4">
                            <svg className="w-6 h-6 text-[#528565]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M12 2.5C12 2.5 16.5 8 16.5 13C16.5 15.4853 14.4853 17.5 12 17.5C9.51472 17.5 7.5 15.4853 7.5 13C7.5 8 12 2.5 12 2.5Z" />
                                <path d="M12 17.5C12 17.5 15.5 20 18.5 20C19.8807 20 21 18.8807 21 17.5C21 14 16.5 11 16.5 11" strokeLinecap="round" />
                                <path d="M12 17.5C12 17.5 8.5 20 5.5 20C4.11929 20 3 18.8807 3 17.5C3 14 7.5 11 7.5 11" strokeLinecap="round" />
                            </svg>
                            <span className="text-xl font-serif text-[#e3ebe5]">Lumina Press</span>
                        </div>
                        <p className="text-sm max-w-xs">Empowering readers to find clarity, purpose, and peace through the power of words.</p>
                    </div>

                    <div>
                        <h4 className="text-white font-serif mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-[#72a083] transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-[#72a083] transition-colors">Books</a></li>
                            <li><a href="#" className="hover:text-[#72a083] transition-colors">About Author</a></li>
                            <li><a href="#" className="hover:text-[#72a083] transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-serif mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="hover:text-[#72a083] transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-[#72a083] transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-[#72a083] transition-colors">Shipping Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-12 pt-8 border-t border-stone-800 text-xs text-center">
                    &copy; {new Date().getFullYear()} Lumina Press. All rights reserved.
                </div>
            </footer>
        </div>
    );
}
