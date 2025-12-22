"use client";

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Palette, Menu, ShoppingCart, Eye, CheckCircle, Flower2,
    Star, Heart, PenTool, Coffee, Printer, Smile, Layers,
    ArrowLeft, ArrowRight, Check, Instagram, Twitter, Facebook,
    HelpCircle, Sun, Flower
} from 'lucide-react';
import { Fredoka, Nunito } from 'next/font/google';
import { cn } from "@/lib/utils";

const fredoka = Fredoka({
    subsets: ['latin'],
    weight: ['400', '600'],
    variable: '--font-fredoka',
});

const nunito = Nunito({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-nunito',
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

interface ColoringBookSalesPageProps {
    product: Product;
    authorName: string;
}

export default function ColoringBookSalesPage({ product, authorName }: ColoringBookSalesPageProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const galleryRef = useRef<HTMLDivElement>(null);

    const scrollGallery = (direction: 'left' | 'right') => {
        if (galleryRef.current) {
            const scrollAmount = 320;
            galleryRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const buyLink = product.isAmazonProduct ? product.amazonLink : "#buy";

    return (
        <div className={cn("min-h-screen bg-slate-50 text-slate-800", fredoka.variable, nunito.variable)} style={{ fontFamily: 'var(--font-nunito)' }}>
            <style jsx global>{`
                h1, h2, h3, h4, h5, h6, .display-font {
                    font-family: var(--font-fredoka), sans-serif;
                }
                .blob-shape {
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    animation: morph 8s ease-in-out infinite;
                }
                @keyframes morph {
                    0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                    50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
                    100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
                }
                .book-shadow {
                    box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
                }
                .hide-scroll::-webkit-scrollbar {
                    display: none;
                }
                .hide-scroll {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
                .perspective-1000 {
                    perspective: 1000px;
                }
                .rotate-y-12 {
                    transform: rotateY(12deg);
                }
                .hover\:rotate-y-0:hover {
                    transform: rotateY(0deg);
                }
            `}</style>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <Palette className="h-8 w-8 text-purple-600 mr-2" />
                            <span className="text-2xl font-bold text-slate-800 display-font">ColorJoy</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#features" className="text-slate-600 hover:text-purple-600 font-semibold transition">Features</a>
                            <a href="#gallery" className="text-slate-600 hover:text-purple-600 font-semibold transition">Look Inside</a>
                            <a href="#reviews" className="text-slate-600 hover:text-purple-600 font-semibold transition">Reviews</a>
                            <a href="#author" className="text-slate-600 hover:text-purple-600 font-semibold transition">Author</a>
                        </div>
                        <a href="#buy" className="hidden md:inline-flex items-center justify-center px-6 py-2 border border-transparent text-base font-bold rounded-full text-white bg-purple-600 hover:bg-purple-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                            Buy Now
                        </a>
                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="text-slate-600 hover:text-purple-600"
                            >
                                <Menu className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white border-t border-slate-100 p-4">
                        <a href="#features" className="block py-2 text-slate-600 font-semibold" onClick={() => setMobileMenuOpen(false)}>Features</a>
                        <a href="#gallery" className="block py-2 text-slate-600 font-semibold" onClick={() => setMobileMenuOpen(false)}>Look Inside</a>
                        <a href="#reviews" className="block py-2 text-slate-600 font-semibold" onClick={() => setMobileMenuOpen(false)}>Reviews</a>
                        <a href="#buy" className="block mt-4 text-center px-6 py-3 rounded-full bg-purple-600 text-white font-bold" onClick={() => setMobileMenuOpen(false)}>Buy Now</a>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden relative">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-yellow-200 opacity-20 blob-shape z-0"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-purple-200 opacity-20 blob-shape z-0"></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="text-center lg:text-left">
                            <span className="inline-block py-1 px-3 rounded-full bg-yellow-100 text-yellow-800 text-sm font-bold mb-4">#1 New Release in Art Therapy</span>
                            <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-6 text-slate-900">
                                {product.title} <span className="text-purple-600">Zen</span> <span className="text-pink-500">Color.</span>
                            </h1>
                            <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                                {product.description || 'Unleash your creativity and melt away stress with this intricate coloring book, featuring designs crafted to help you relax and recharge.'}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a href="#buy" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-bold rounded-full text-white bg-purple-600 hover:bg-purple-700 transition shadow-xl hover:shadow-2xl transform hover:-translate-y-1">
                                    <ShoppingCart className="w-5 h-5 mr-2" /> Get Your Copy
                                </a>
                                <a href="#gallery" className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-200 text-lg font-bold rounded-full text-slate-600 hover:border-purple-600 hover:text-purple-600 transition bg-white">
                                    <Eye className="w-5 h-5 mr-2" /> See Inside
                                </a>
                            </div>
                            <div className="mt-8 flex items-center justify-center lg:justify-start space-x-4 text-sm text-slate-500">
                                <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" /> Instant PDF Download
                                </div>
                                <div className="flex items-center">
                                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" /> Printable on Any Paper
                                </div>
                            </div>
                        </div>

                        {/* Book Mockup */}
                        <div className="relative mx-auto lg:ml-auto w-full max-w-md perspective-1000">
                            <div className="relative w-[300px] h-[400px] sm:w-[350px] sm:h-[480px] bg-white rounded-r-2xl rounded-l-md shadow-2xl mx-auto transform rotate-y-12 hover:rotate-y-0 transition-transform duration-500 cursor-pointer border-l-8 border-slate-200 group overflow-hidden">
                                {/* Cover Design Placeholder or Image */}
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-yellow-400 p-8 flex flex-col items-center justify-center text-center">
                                        <div className="w-32 h-32 rounded-full border-4 border-white/30 flex items-center justify-center mb-6 animate-spin-slow">
                                            <Flower2 className="w-20 h-20 text-white" />
                                        </div>
                                        <h2 className="text-4xl font-bold text-white mb-2 display-font">{product.title}</h2>
                                        <p className="text-white/90 text-lg">Adult Coloring Book</p>
                                        <div className="mt-12 text-white/80 font-bold">Vol. 1</div>
                                    </div>
                                )}
                                {/* Shine Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"></div>
                            </div>
                            {/* Decorative elements behind book */}
                            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-purple-100 rounded-full blur-3xl opacity-50"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Proof Strip */}
            <div className="bg-slate-900 py-8">
                <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-8 md:gap-16 items-center text-slate-400">
                    <span className="font-bold text-lg uppercase tracking-wider">Featured In:</span>
                    <div className="flex items-center gap-2"><Star className="w-5 h-5" /> ArtDaily</div>
                    <div className="flex items-center gap-2"><Heart className="w-5 h-5" /> Mindfulness Weekly</div>
                    <div className="flex items-center gap-2"><PenTool className="w-5 h-5" /> Creative Living</div>
                    <div className="flex items-center gap-2"><Coffee className="w-5 h-5" /> Morning Brew</div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Why You'll Love This Book</h2>
                        <div className="w-20 h-1 bg-purple-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {/* Feature 1 */}
                        <div className="bg-slate-50 p-8 rounded-3xl hover:shadow-xl transition duration-300 border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Printer className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">High-Resolution PDF</h3>
                            <p className="text-slate-600">Download instantly and print on your favorite paper. No more bleeding through thin pages!</p>
                        </div>

                        {/* Feature 2 */}
                        <div className="bg-slate-50 p-8 rounded-3xl hover:shadow-xl transition duration-300 border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Smile className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Stress Relief</h3>
                            <p className="text-slate-600">Designed specifically to induce a meditative state and lower anxiety levels after a long day.</p>
                        </div>

                        {/* Feature 3 */}
                        <div className="bg-slate-50 p-8 rounded-3xl hover:shadow-xl transition duration-300 border border-slate-100 text-center">
                            <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Layers className="w-8 h-8" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">50 Unique Designs</h3>
                            <p className="text-slate-600">From simple patterns for quick sessions to intricate mandalas for weekend projects.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Look Inside / Gallery Section */}
            <section id="gallery" className="py-20 bg-purple-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div className="max-w-xl">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">Look Inside the Pages</h2>
                            <p className="text-lg text-slate-600">Take a peek at some of the intricate designs waiting for your colors.</p>
                        </div>
                        <div className="hidden md:flex gap-2 mt-4 md:mt-0">
                            <button onClick={() => scrollGallery('left')} className="p-3 rounded-full bg-white shadow-md hover:bg-purple-100 text-purple-600 transition">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <button onClick={() => scrollGallery('right')} className="p-3 rounded-full bg-white shadow-md hover:bg-purple-100 text-purple-600 transition">
                                <ArrowRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Horizontal Scroll Container */}
                    <div ref={galleryRef} className="flex gap-6 overflow-x-auto hide-scroll pb-8 snap-x snap-mandatory">

                        {/* Page 1 Placeholder */}
                        <div className="min-w-[280px] md:min-w-[320px] h-[400px] bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-center justify-center snap-center relative overflow-hidden group">
                            {/* SVG Pattern Representation */}
                            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200 opacity-50 group-hover:text-purple-200 transition duration-500">
                                <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
                                <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="0.5" fill="none" />
                                <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="0.5" fill="none" />
                                <path d="M50 10 L50 90 M10 50 L90 50" stroke="currentColor" strokeWidth="0.5" />
                                <path d="M22 22 L78 78 M22 78 L78 22" stroke="currentColor" strokeWidth="0.5" />
                            </svg>
                            <div className="absolute bottom-4 right-4 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">Page 05</div>
                        </div>

                        {/* Page 2 Placeholder */}
                        <div className="min-w-[280px] md:min-w-[320px] h-[400px] bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-center justify-center snap-center relative overflow-hidden group">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200 opacity-50 group-hover:text-pink-200 transition duration-500">
                                <rect x="20" y="20" width="60" height="60" stroke="currentColor" strokeWidth="0.5" fill="none" />
                                <rect x="30" y="30" width="40" height="40" stroke="currentColor" strokeWidth="0.5" fill="none" />
                                <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="0.5" fill="none" />
                            </svg>
                            <div className="absolute bottom-4 right-4 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">Page 12</div>
                        </div>

                        {/* Page 3 Placeholder */}
                        <div className="min-w-[280px] md:min-w-[320px] h-[400px] bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-center justify-center snap-center relative overflow-hidden group">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200 opacity-50 group-hover:text-yellow-200 transition duration-500">
                                <path d="M50 10 Q90 50 50 90 Q10 50 50 10" stroke="currentColor" strokeWidth="0.5" fill="none" />
                                <path d="M50 25 Q75 50 50 75 Q25 50 50 25" stroke="currentColor" strokeWidth="0.5" fill="none" />
                            </svg>
                            <div className="absolute bottom-4 right-4 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">Page 23</div>
                        </div>

                        {/* Page 4 Placeholder */}
                        <div className="min-w-[280px] md:min-w-[320px] h-[400px] bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-center justify-center snap-center relative overflow-hidden group">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-200 opacity-50 group-hover:text-green-200 transition duration-500">
                                <polygon points="50,10 61,35 88,35 66,50 75,75 50,60 25,75 34,50 12,35 39,35" stroke="currentColor" strokeWidth="0.5" fill="none" />
                            </svg>
                            <div className="absolute bottom-4 right-4 bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded">Page 41</div>
                        </div>

                        {/* Page 5 Placeholder */}
                        <div className="min-w-[280px] md:min-w-[320px] h-[400px] bg-white rounded-xl shadow-lg border border-slate-200 p-4 flex items-center justify-center snap-center relative overflow-hidden group">
                            <div className="text-center">
                                <h4 className="text-xl font-bold text-slate-400 mb-2">And 45 More!</h4>
                                <button className="text-purple-600 font-semibold underline">View Full Gallery</button>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="reviews" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center text-slate-800">What Colorists Are Saying</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Review 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative">
                            <div className="absolute -top-4 left-8 text-yellow-400 bg-white px-2 flex">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <p className="text-slate-600 italic mb-6">"I've bought dozens of coloring books, but this one has the best paper quality for my markers. The designs are just the right level of complex."</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-bold mr-3">SJ</div>
                                <div>
                                    <div className="font-bold text-slate-900">Sarah Jenkins</div>
                                    <div className="text-xs text-slate-500">Verified Buyer</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative mt-8 md:mt-0">
                            <div className="absolute -top-4 left-8 text-yellow-400 bg-white px-2 flex">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <p className="text-slate-600 italic mb-6">"Bought this for my mom who wanted to try art therapy. She loves it! We actually color together on weekends now."</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center text-blue-700 font-bold mr-3">MR</div>
                                <div>
                                    <div className="font-bold text-slate-900">Mike Ross</div>
                                    <div className="text-xs text-slate-500">Verified Buyer</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 relative mt-8 md:mt-0">
                            <div className="absolute -top-4 left-8 text-yellow-400 bg-white px-2 flex">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-slate-600 italic mb-6">"Digital download is a game changer. I can print my favorite pages on watercolor paper. Highly recommend!"</p>
                            <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-pink-200 flex items-center justify-center text-pink-700 font-bold mr-3">EL</div>
                                <div>
                                    <div className="font-bold text-slate-900">Emily Liu</div>
                                    <div className="text-xs text-slate-500">Verified Buyer</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / CTA Section */}
            <section id="buy" className="py-20 bg-slate-900 text-white relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
                    <Flower className="absolute top-10 left-10 w-32 h-32" />
                    <Sun className="absolute bottom-10 right-10 w-40 h-40" />
                </div>

                <div className="max-w-4xl mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6">Start Your Coloring Journey Today</h2>
                    <p className="text-xl text-slate-300 mb-12">Instantly download all 50 pages and start coloring in minutes.</p>

                    <div className="bg-white text-slate-900 rounded-3xl p-8 md:p-12 shadow-2xl max-w-lg mx-auto">
                        <div className="text-sm uppercase tracking-wide font-bold text-slate-500 mb-2">{product.format || "Digital Edition"}</div>
                        <div className="flex items-center justify-center mb-6">
                            <span className="text-5xl font-bold text-purple-600">${product.price}</span>
                            {/* <span className="text-xl text-slate-400 ml-2 line-through">$24</span> */}
                        </div>

                        <ul className="text-left space-y-4 mb-8">
                            <li className="flex items-center"><Check className="text-green-500 w-5 h-5 mr-3" /> 50 High-Res Mandala Designs</li>
                            <li className="flex items-center"><Check className="text-green-500 w-5 h-5 mr-3" /> Instant PDF Download</li>
                            <li className="flex items-center"><Check className="text-green-500 w-5 h-5 mr-3" /> Bonus: Color Theory Guide</li>
                            <li className="flex items-center"><Check className="text-green-500 w-5 h-5 mr-3" /> Lifetime Access to Updates</li>
                        </ul>

                        {product.isAmazonProduct ? (
                            <Link href={product.amazonLink || "#"} target="_blank" className="block w-full">
                                <button className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xl shadow-lg transform transition hover:-translate-y-1">
                                    Buy on Amazon
                                </button>
                            </Link>
                        ) : (
                            <button className="w-full py-4 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xl shadow-lg transform transition hover:-translate-y-1">
                                Buy Now & Download
                            </button>
                        )}

                        <p className="mt-4 text-xs text-slate-400">Secure payment • 30-Day Money Back Guarantee</p>

                        {!product.isAmazonProduct && product.grooveSellEmbed && (
                            <div className="mt-4 pt-4 border-t border-slate-200">
                                <div dangerouslySetInnerHTML={{ __html: product.grooveSellEmbed }} />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* About Author */}
            <section id="author" className="py-20 bg-pink-50">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="w-32 h-32 rounded-full bg-slate-300 mx-auto mb-6 border-4 border-white shadow-lg overflow-hidden">
                        {/* Avatar Placeholder */}
                        <svg className="w-full h-full text-slate-400 bg-slate-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-4 text-slate-800">Meet the Artist</h2>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        Hi! I'm {authorName}. I created these designs during a stressful time in my life, finding that the repetitive patterns of mandalas brought me a sense of peace I couldn't find elsewhere. My mission is to share that peace with you, one page at a time.
                    </p>
                    <div className="flex justify-center space-x-6">
                        <a href="#" className="text-slate-400 hover:text-purple-600"><Instagram /></a>
                        <a href="#" className="text-slate-400 hover:text-purple-600"><Twitter /></a>
                        <a href="#" className="text-slate-400 hover:text-purple-600"><Facebook /></a>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                    <h2 className="text-3xl font-bold mb-12 text-center text-slate-800">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        {/* FAQ Item 1 */}
                        <div className="border border-slate-200 rounded-xl p-6 hover:border-purple-200 transition">
                            <h3 className="font-bold text-lg mb-2 flex items-center text-slate-800">
                                <HelpCircle className="w-5 h-5 text-purple-600 mr-2" /> Is this a physical book?
                            </h3>
                            <p className="text-slate-600 ml-7">Currently, this is a digital PDF download. This means you get instant access and can print pages as many times as you like on your preferred paper type!</p>
                        </div>

                        {/* FAQ Item 2 */}
                        <div className="border border-slate-200 rounded-xl p-6 hover:border-purple-200 transition">
                            <h3 className="font-bold text-lg mb-2 flex items-center text-slate-800">
                                <HelpCircle className="w-5 h-5 text-purple-600 mr-2" /> What if I don't like it?
                            </h3>
                            <p className="text-slate-600 ml-7">We offer a 30-day money-back guarantee. If the designs don't bring you joy, simply email us for a full refund.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 py-12">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center mb-4 md:mb-0">
                        <Palette className="h-6 w-6 text-purple-600 mr-2" />
                        <span className="font-bold text-slate-800">ColorJoy</span>
                    </div>
                    <div className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} ColorJoy Studio. All rights reserved.
                    </div>
                    <div className="flex space-x-6 mt-4 md:mt-0 text-sm">
                        <a href="#" className="text-slate-500 hover:text-purple-600">Privacy Policy</a>
                        <a href="#" className="text-slate-500 hover:text-purple-600">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
