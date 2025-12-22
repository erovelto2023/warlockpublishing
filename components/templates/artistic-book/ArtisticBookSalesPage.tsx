"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
    Menu, X, ChevronDown, Quote, Truck, Instagram, Twitter, Facebook, CheckCircle, ShoppingCart
} from 'lucide-react';
import { Cormorant_Garamond, Montserrat } from 'next/font/google';
import { cn } from "@/lib/utils";

const cormorant = Cormorant_Garamond({
    subsets: ['latin'],
    weight: ['300', '400', '600', '700'],
    style: ['normal', 'italic'],
    variable: '--font-cormorant',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500'],
    variable: '--font-montserrat',
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

interface ArtisticBookSalesPageProps {
    product: Product;
    authorName: string;
}

export default function ArtisticBookSalesPage({ product, authorName }: ArtisticBookSalesPageProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [cartNotification, setCartNotification] = useState<{ show: boolean, message: string }>({ show: false, message: '' });

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Intersection Observer for reveal animations
    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-text').forEach(el => {
            observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const simulateBuy = (edition: string) => {
        if (product.isAmazonProduct && product.amazonLink) {
            window.open(product.amazonLink, '_blank');
            return;
        }

        setCartNotification({ show: true, message: `${edition} has been added to your cart.` });
        setTimeout(() => {
            setCartNotification(prev => ({ ...prev, show: false }));
        }, 5000);
    };

    return (
        <div className={cn("font-sans antialiased bg-[#fdfbf7] text-[#1a1a1a] overflow-x-hidden selection:bg-[#d4af37] selection:text-white", cormorant.variable, montserrat.variable)} style={{ fontFamily: 'var(--font-montserrat)' }}>
            <style jsx global>{`
                h1, h2, h3, h4, h5, h6, .font-serif {
                    font-family: var(--font-cormorant), serif;
                }
                
                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }
                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }
                ::-webkit-scrollbar-thumb {
                    background: #d4af37;
                    border-radius: 4px;
                }

                .reveal-text {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
                }

                .reveal-text.visible {
                    opacity: 1;
                    transform: translateY(0);
                }

                .book-hover {
                    transition: transform 0.5s ease;
                }
                .book-hover:hover {
                    transform: translateY(-10px) rotateY(-5deg);
                }
                
                .perspective-1000 {
                    perspective: 1000px;
                }
                
                .rotate-y-12 {
                    transform: rotateY(12deg);
                }
                
                .rotate-x-6 {
                    transform: rotateX(6deg);
                }
            `}</style>

            {/* Parallax Texture Overlay */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-40 opacity-50" style={{ backgroundImage: `url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNjY2MiIG9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')` }}></div>

            {/* Navigation */}
            <nav className={cn("fixed w-full z-50 transition-all duration-300 px-6 md:px-12 flex justify-between items-center", scrolled ? "bg-[#1a1a1a]/95 shadow-lg py-4 text-white" : "py-6 mix-blend-difference text-white/90")}>
                <div className="text-2xl font-serif italic tracking-wider z-50">AoD.</div>
                <div className="hidden md:flex space-x-8 text-sm tracking-widest uppercase">
                    <a href="#about" className="hover:text-[#d4af37] transition-colors">The Vision</a>
                    <a href="#gallery" className="hover:text-[#d4af37] transition-colors">Inside</a>
                    <a href="#author" className="hover:text-[#d4af37] transition-colors">Artist</a>
                </div>
                <a href="#purchase" className="hidden md:block border border-current px-6 py-2 text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all duration-300">
                    Acquire
                </a>
                {/* Mobile Menu Button */}
                <button className="md:hidden text-2xl" onClick={toggleMenu}>
                    {isMenuOpen ? <X /> : <Menu />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={cn("fixed inset-0 bg-[#1a1a1a] text-[#fdfbf7] z-40 transition-transform duration-500 flex flex-col justify-center items-center space-y-8", isMenuOpen ? "translate-x-0" : "translate-x-full")}>
                <a href="#about" className="text-3xl font-serif italic" onClick={toggleMenu}>The Vision</a>
                <a href="#gallery" className="text-3xl font-serif italic" onClick={toggleMenu}>Inside</a>
                <a href="#author" className="text-3xl font-serif italic" onClick={toggleMenu}>Artist</a>
                <a href="#purchase" className="text-3xl font-serif italic text-[#d4af37]" onClick={toggleMenu}>Acquire</a>
                <button className="absolute top-6 right-6 text-2xl" onClick={toggleMenu}>
                    <X />
                </button>
            </div>

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
                <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(212, 175, 55, 0.1) 0%, rgba(253, 251, 247, 0) 70%)' }}></div>

                <div className="container mx-auto px-6 relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1 reveal-text">
                        <p className="text-[#c25e00] text-sm tracking-[0.3em] uppercase mb-4">First Edition • {new Date().getFullYear()}</p>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif leading-[0.9] mb-6 text-[#1a1a1a]">
                            {product.title}
                        </h1>
                        <p className="text-lg md:text-xl text-[#2d2d2d]/70 font-light max-w-md mb-10 leading-relaxed">
                            {product.description || "A visual anthology exploring the spaces between reality and imagination. 200 pages of ink, charcoal, and color."}
                        </p>
                        <div className="flex items-center space-x-6">
                            <a href="#purchase" className="bg-[#1a1a1a] text-[#fdfbf7] px-8 py-4 text-sm uppercase tracking-widest hover:bg-[#c25e00] transition-colors duration-300 shadow-lg">
                                Pre-order Now
                            </a>
                            <a href="#about" className="text-[#1a1a1a] text-sm uppercase tracking-widest border-b border-black pb-1 hover:text-[#c25e00] hover:border-[#c25e00] transition-all">
                                Explore
                            </a>
                        </div>
                    </div>

                    {/* Book Mockup */}
                    <div className="order-1 md:order-2 flex justify-center perspective-1000 reveal-text" style={{ transitionDelay: '200ms' }}>
                        <div className="relative w-64 md:w-80 aspect-[2/3] bg-stone-200 shadow-2xl book-hover transform rotate-y-12 rotate-x-6 cursor-pointer group">
                            {/* Cover Image Placeholder */}
                            {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center text-white p-8 text-center border border-white/20">
                                    <div>
                                        <h2 className="font-serif text-3xl italic">{product.title}</h2>
                                        <p className="mt-4 text-xs tracking-widest uppercase">{authorName}</p>
                                    </div>
                                </div>
                            )}
                            {/* Spine Effect */}
                            <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-black/20 to-transparent"></div>
                            {/* Sheen */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <ChevronDown className="text-[#1a1a1a]/30" />
                </div>
            </section>

            {/* The Essence / About Section */}
            <section id="about" className="py-24 md:py-32 bg-white relative">
                <div className="container mx-auto px-6 max-w-4xl text-center">
                    <span className="block text-[#c25e00] text-xs tracking-[0.2em] uppercase mb-6 reveal-text">The Essence</span>
                    <h2 className="text-4xl md:text-5xl font-serif italic mb-12 text-[#1a1a1a] reveal-text">
                        "Art is not what you see, but what you make others see."
                    </h2>
                    <div className="grid md:grid-cols-2 gap-12 text-left text-[#2d2d2d]/80 font-light leading-loose reveal-text">
                        <p>
                            <span className="text-5xl float-left mr-4 font-serif text-[#d4af37] leading-[0.8]">T</span>
                            his book is not merely a collection of images; it is a cartography of the subconscious. Born from three years of isolation and wandering, "{product.title}" compiles sketches, oil paintings, and prose that question the solidity of our waking world.
                        </p>
                        <p>
                            Printed on premium 150gsm Munken Lynx paper, every page feels like an original. The binding allows the book to lay flat, inviting you to lose yourself in panoramas of impossible cities and portraits of emotions we haven't yet named.
                        </p>
                    </div>
                </div>
            </section>

            {/* Gallery / Sneak Peek */}
            <section id="gallery" className="py-24 bg-[#fdfbf7] overflow-hidden">
                <div className="container mx-auto px-6">
                    <div className="flex justify-between items-end mb-16 reveal-text">
                        <h2 className="text-4xl font-serif text-[#1a1a1a]">Inside the Pages</h2>
                        <div className="hidden md:block text-xs tracking-widest uppercase text-[#2d2d2d]/50">Scroll to explore</div>
                    </div>

                    {/* Grid for Desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[300px]">

                        {/* Item 1 */}
                        <div className="md:col-span-8 relative group overflow-hidden reveal-text bg-stone-200">
                            {/* Placeholder for art spread */}
                            <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-400">Art Spread 1</div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-serif italic text-2xl">The Silent City</span>
                            </div>
                        </div>

                        {/* Item 2 */}
                        <div className="md:col-span-4 relative group overflow-hidden reveal-text bg-stone-200" style={{ transitionDelay: '100ms' }}>
                            <div className="w-full h-full bg-stone-400 flex items-center justify-center text-stone-500">Detail View</div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-serif italic text-2xl">Details</span>
                            </div>
                        </div>

                        {/* Item 3 */}
                        <div className="md:col-span-4 relative group overflow-hidden reveal-text bg-stone-200">
                            <div className="w-full h-full bg-stone-400 flex items-center justify-center text-stone-500">Process Sketch</div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-serif italic text-2xl">Process</span>
                            </div>
                        </div>

                        {/* Item 4 */}
                        <div className="md:col-span-8 relative group overflow-hidden reveal-text bg-stone-200" style={{ transitionDelay: '100ms' }}>
                            <div className="w-full h-full bg-stone-300 flex items-center justify-center text-stone-400">Art Spread 2</div>
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                <span className="text-white font-serif italic text-2xl">Ethereal Landscapes</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof */}
            <section className="py-20 bg-[#1a1a1a] text-[#fdfbf7] text-center">
                <div className="container mx-auto px-6 max-w-3xl">
                    <Quote className="w-10 h-10 text-[#d4af37] mb-8 opacity-50 mx-auto" />
                    <p className="text-2xl md:text-3xl font-serif italic leading-normal mb-8 reveal-text">
                        "A hauntingly beautiful masterclass in visual storytelling. It sits on my coffee table, but it often pulls me into its world for hours."
                    </p>
                    <cite className="not-italic text-sm tracking-[0.2em] uppercase text-[#d4af37] reveal-text block">– Elena R., Art Critic</cite>
                </div>
            </section>

            {/* Author Section */}
            <section id="author" className="py-24 bg-stone-100 relative">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <div className="w-full md:w-1/3 reveal-text">
                            <div className="w-full aspect-[4/5] bg-stone-300 shadow-xl grayscale hover:grayscale-0 transition-all duration-700 flex items-center justify-center">
                                <span className="text-stone-500">Artist Portrait</span>
                            </div>
                        </div>
                        <div className="w-full md:w-2/3 reveal-text">
                            <span className="text-[#c25e00] text-xs tracking-[0.2em] uppercase mb-4 block">The Artist</span>
                            <h3 className="text-4xl font-serif text-[#1a1a1a] mb-6">{authorName}</h3>
                            <p className="text-[#2d2d2d]/80 font-light leading-relaxed mb-6">
                                {authorName} is a multidisciplinary artist based in the misty hills of the Pacific Northwest. His work attempts to capture the fleeting nature of memory through mixed media.
                                <br /><br />
                                "{product.title}" is his debut monograph, culminating five years of gallery exhibitions and late-night studio sessions.
                            </p>
                            <div className="opacity-70 h-16 font-serif italic text-4xl flex items-center">
                                {authorName}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Purchase Section */}
            <section id="purchase" className="py-24 bg-white">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-5xl font-serif text-[#1a1a1a] mb-4 reveal-text">Acquire the Work</h2>
                    <p className="text-[#2d2d2d]/60 mb-16 reveal-text">Select your preferred edition.</p>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

                        {/* Digital Edition */}
                        <div className="border border-stone-200 p-8 hover:border-[#c25e00] transition-colors duration-300 flex flex-col items-center reveal-text group bg-white">
                            <div className="text-[#2d2d2d]/40 text-sm tracking-widest uppercase mb-4 group-hover:text-[#c25e00]">Digital</div>
                            <h3 className="text-3xl font-serif mb-2">The E-Book</h3>
                            <div className="text-4xl font-light mb-8">${(product.price * 0.5).toFixed(0)}</div>
                            <ul className="text-sm text-[#2d2d2d]/70 space-y-3 mb-8 text-left w-full pl-8 list-disc">
                                <li>High-Resolution PDF</li>
                                <li>Compatible with iPad/Tablets</li>
                                <li>Bonus: 3 Digital Wallpapers</li>
                            </ul>
                            <button className="mt-auto w-full py-4 border border-black text-black hover:bg-black hover:text-white transition-all uppercase tracking-widest text-xs" onClick={() => simulateBuy('Digital Edition')}>Add to Cart</button>
                        </div>

                        {/* Hardcover (Featured) */}
                        <div className="border-2 border-[#d4af37] p-8 transform md:-translate-y-4 shadow-xl flex flex-col items-center reveal-text relative bg-white z-10">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#d4af37] text-white px-4 py-1 text-xs uppercase tracking-widest">Best Seller</div>
                            <div className="text-[#d4af37] text-sm tracking-widest uppercase mb-4">Hardcover</div>
                            <h3 className="text-3xl font-serif mb-2">First Edition</h3>
                            <div className="text-4xl font-light mb-8">${product.price}</div>
                            <ul className="text-sm text-[#2d2d2d]/70 space-y-3 mb-8 text-left w-full pl-8 list-disc">
                                <li>8.5" x 11" Hardcover</li>
                                <li>Linen-bound with foil stamping</li>
                                <li>150gsm Munken Lynx paper</li>
                                <li>Signed bookplate</li>
                            </ul>
                            <button className="mt-auto w-full py-4 bg-[#1a1a1a] text-white hover:bg-[#c25e00] transition-all uppercase tracking-widest text-xs" onClick={() => simulateBuy('First Edition Hardcover')}>Pre-order Now</button>
                        </div>

                        {/* Collector's Edition */}
                        <div className="border border-stone-200 p-8 hover:border-[#c25e00] transition-colors duration-300 flex flex-col items-center reveal-text group bg-white">
                            <div className="text-[#2d2d2d]/40 text-sm tracking-widest uppercase mb-4 group-hover:text-[#c25e00]">Collector's</div>
                            <h3 className="text-3xl font-serif mb-2">The Artifact</h3>
                            <div className="text-4xl font-light mb-8">${(product.price * 3).toFixed(0)}</div>
                            <ul className="text-sm text-[#2d2d2d]/70 space-y-3 mb-8 text-left w-full pl-8 list-disc">
                                <li>Slipcase Edition</li>
                                <li>Includes Original Sketch</li>
                                <li>Limited to 100 copies</li>
                                <li>Personally dedicated</li>
                            </ul>
                            <button className="mt-auto w-full py-4 border border-black text-black hover:bg-black hover:text-white transition-all uppercase tracking-widest text-xs" onClick={() => simulateBuy('Collector\'s Edition')}>Join Waitlist</button>
                        </div>

                    </div>

                    <div className="mt-12 text-xs text-[#2d2d2d]/50 uppercase tracking-widest flex items-center justify-center">
                        <Truck className="w-4 h-4 mr-2" /> Free shipping worldwide on orders over $100
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#1a1a1a] text-[#fdfbf7] py-16 border-t border-white/10">
                <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-3xl font-serif italic mb-6">AoD.</div>
                        <p className="text-white/50 font-light max-w-sm">
                            A limited press run celebrating the intersection of fine art and printed matter.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-sm uppercase tracking-widest mb-6 text-[#d4af37]">Links</h4>
                        <ul className="space-y-4 text-white/60 text-sm">
                            <li><a href="#" className="hover:text-white transition-colors">Shipping Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Returns</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Press Kit</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-sm uppercase tracking-widest mb-6 text-[#d4af37]">Connect</h4>
                        <div className="flex space-x-6 text-xl text-white/60">
                            <a href="#" className="hover:text-white transition-colors"><Instagram /></a>
                            <a href="#" className="hover:text-white transition-colors"><Twitter /></a>
                            <a href="#" className="hover:text-white transition-colors"><Facebook /></a>
                        </div>
                        <div className="mt-8">
                            <p className="text-xs text-white/30">&copy; {new Date().getFullYear()} {authorName} Studio. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Cart Modal Notification */}
            <div className={cn("fixed bottom-6 right-6 bg-white border-l-4 border-[#d4af37] shadow-2xl p-6 transition-transform duration-500 z-50 max-w-xs", cartNotification.show ? "translate-y-0" : "translate-y-40")}>
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <CheckCircle className="text-green-500 mt-1" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-[#1a1a1a]">Added to Cart</h3>
                        <p className="text-sm text-gray-500 mt-1">{cartNotification.message}</p>
                        <div className="mt-3">
                            <button onClick={() => setCartNotification(prev => ({ ...prev, show: false }))} className="text-xs text-[#c25e00] uppercase tracking-widest hover:text-black">Continue Shopping</button>
                            <button className="ml-4 text-xs text-black font-bold uppercase tracking-widest hover:underline">Checkout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
