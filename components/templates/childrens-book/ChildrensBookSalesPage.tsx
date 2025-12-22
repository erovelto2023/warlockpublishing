"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    BookOpen, ArrowRight, Eye, CheckCircle, Cloud, Star, Book, Heart, Award,
    Moon, Zap, Palette, Image as ImageIcon, Quote, User, Tablet, Package, Check, ChevronDown
} from 'lucide-react';
import { Fredoka, Nunito } from 'next/font/google';
import { cn } from "@/lib/utils";

const fredoka = Fredoka({
    subsets: ['latin'],
    weight: ['300', '400', '600'],
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

interface ChildrensBookSalesPageProps {
    product: Product;
    authorName: string;
}

export default function ChildrensBookSalesPage({ product, authorName }: ChildrensBookSalesPageProps) {
    const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setOpenFaqIndex(openFaqIndex === index ? null : index);
    };

    return (
        <div className={cn("font-sans text-[#1A3C40] bg-[#FFFBE9] antialiased overflow-x-hidden", fredoka.variable, nunito.variable)} style={{ fontFamily: 'var(--font-nunito)' }}>
            <style jsx global>{`
                h1, h2, h3, h4, h5, h6, .font-heading {
                    font-family: var(--font-fredoka), sans-serif;
                }
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                .book-shadow {
                    box-shadow: 20px 20px 60px rgba(0,0,0,0.15), -5px -5px 10px rgba(255,255,255,0.5);
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
            <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md shadow-sm transition-all duration-300">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex-shrink-0 flex items-center gap-2">
                            <BookOpen className="h-8 w-8 text-[#FF8400]" />
                            <span className="font-heading font-semibold text-2xl text-[#1A3C40]">LittleReaders</span>
                        </div>
                        <div className="hidden md:flex space-x-8">
                            <a href="#story" className="text-[#1A3C40] hover:text-[#FF8400] font-semibold transition">The Story</a>
                            <a href="#inside" className="text-[#1A3C40] hover:text-[#FF8400] font-semibold transition">Inside Look</a>
                            <a href="#reviews" className="text-[#1A3C40] hover:text-[#FF8400] font-semibold transition">Reviews</a>
                            <a href="#author" className="text-[#1A3C40] hover:text-[#FF8400] font-semibold transition">Author</a>
                        </div>
                        <div>
                            <a href="#buy" className="bg-[#FF8400] text-white px-6 py-2 rounded-full font-heading font-semibold hover:bg-orange-600 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                                Buy Now
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-full z-0 opacity-10 pointer-events-none">
                    <svg className="absolute top-10 left-10 text-[#FFD93D] w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
                    <svg className="absolute bottom-20 right-20 text-[#4F9DA6] w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2z" /></svg>
                </div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Text Content */}
                        <div className="text-center lg:text-left">
                            <div className="inline-block bg-[#FFD93D]/20 text-[#FF8400] px-4 py-1 rounded-full text-sm font-bold mb-6">
                                ★ #1 Best Seller in Children's Adventure
                            </div>
                            <h1 className="font-heading text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 text-[#1A3C40]">
                                {product.title}
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                {product.description || "Spark your child's imagination with a heartwarming tale about courage, friendship, and the magic of looking up. Perfect for ages 3-7."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a href="#buy" className="bg-[#FF8400] text-white text-lg px-8 py-4 rounded-full font-heading font-bold shadow-lg hover:bg-orange-600 transition transform hover:scale-105 flex items-center justify-center gap-2">
                                    Get Your Copy <ArrowRight className="w-5 h-5" />
                                </a>
                                <a href="#inside" className="bg-white text-[#1A3C40] border-2 border-[#1A3C40]/10 text-lg px-8 py-4 rounded-full font-heading font-bold hover:bg-gray-50 transition flex items-center justify-center gap-2">
                                    <Eye className="w-5 h-5" /> Peek Inside
                                </a>
                            </div>
                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm font-semibold text-gray-500">
                                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Hardcover</div>
                                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Kindle</div>
                                <div className="flex items-center gap-1"><CheckCircle className="w-4 h-4 text-green-500" /> Audiobook</div>
                            </div>
                        </div>

                        {/* Book Mockup */}
                        <div className="relative perspective-1000 flex justify-center animate-float">
                            {/* Placeholder for Book Cover */}
                            <div className="w-64 md:w-80 lg:w-96 aspect-[2/3] bg-[#4F9DA6] rounded-r-xl rounded-l-sm shadow-2xl book-shadow relative overflow-hidden group cursor-pointer transform rotate-y-12 transition-transform duration-500 hover:rotate-y-0">
                                {/* Spine element */}
                                <div className="absolute left-0 top-0 bottom-0 w-4 bg-white/20 z-20 border-r border-black/10"></div>

                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#4F9DA6] to-cyan-600 text-white p-6 text-center">
                                        <Cloud className="w-24 h-24 mb-4 text-white/90" />
                                        <h2 className="font-heading text-3xl font-bold mb-2">{product.title}</h2>
                                        <p className="font-body text-sm opacity-90">By {authorName}</p>
                                        <div className="absolute bottom-6 right-6">
                                            <span className="bg-[#FFD93D] text-[#1A3C40] text-xs font-bold px-3 py-1 rounded-full shadow-md">New!</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Decor behind book */}
                            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFD93D]/20 rounded-full blur-3xl"></div>
                        </div>
                    </div>
                </div>

                {/* Wavy Bottom Border */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                    <svg className="relative block w-[calc(100%+1.3px)] h-[60px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                    </svg>
                </div>
            </header>

            {/* Social Proof */}
            <section className="bg-white py-10">
                <div className="max-w-6xl mx-auto px-4 text-center">
                    <p className="font-bold text-gray-400 uppercase tracking-widest text-sm mb-6">Parents and teachers love it</p>
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {/* Logos (Placeholders) */}
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-600"><Star className="fill-current" /> KidsWeekly</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-600"><Book className="fill-current" /> StoryTime</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-600"><Heart className="fill-current" /> ParentLife</div>
                        <div className="flex items-center gap-2 text-xl font-bold text-gray-600"><Award className="fill-current" /> TeacherPick</div>
                    </div>
                </div>
            </section>

            {/* The Problem & Solution */}
            <section id="story" className="py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold text-[#1A3C40] mb-4">A Bedtime Story With A Purpose</h2>
                        <div className="w-24 h-2 bg-[#FFD93D] rounded-full mx-auto"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        <div className="p-6 bg-[#FFFBE9] rounded-2xl">
                            <div className="w-16 h-16 bg-[#FF8400]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FF8400]">
                                <Moon className="w-8 h-8" />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-2">Better Sleep</h3>
                            <p className="text-gray-600">Designed with a calming rhythm to help little ones drift off to dreamland peacefully.</p>
                        </div>
                        <div className="p-6 bg-[#FFFBE9] rounded-2xl">
                            <div className="w-16 h-16 bg-[#4F9DA6]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#4F9DA6]">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-2">Builds Courage</h3>
                            <p className="text-gray-600">Teaches children that it's okay to be afraid, and how to find their inner bravery.</p>
                        </div>
                        <div className="p-6 bg-[#FFFBE9] rounded-2xl">
                            <div className="w-16 h-16 bg-[#FFD93D]/10 rounded-full flex items-center justify-center mx-auto mb-4 text-[#FFD93D]">
                                <Palette className="w-8 h-8" />
                            </div>
                            <h3 className="font-heading text-xl font-bold mb-2">Vibrant Art</h3>
                            <p className="text-gray-600">Full-page, hand-drawn illustrations that capture the imagination on every page.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Inside The Book (Gallery) */}
            <section id="inside" className="py-20 bg-[#FFD93D]/10 relative">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                        <div className="max-w-2xl">
                            <span className="text-[#FF8400] font-bold uppercase tracking-wide">Sneak Peek</span>
                            <h2 className="font-heading text-4xl font-bold text-[#1A3C40] mt-2">Look Inside the Pages</h2>
                        </div>
                        <div className="hidden md:block">
                            {/* Decorative Arrow SVG */}
                            <svg className="w-24 h-12 text-[#1A3C40] transform -rotate-12 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 100 50">
                                <path strokeWidth="2" d="M10,25 Q50,5 90,25 M70,15 L90,25 L70,35" />
                            </svg>
                        </div>
                    </div>

                    {/* Gallery Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Page 1 */}
                        <div className="group relative aspect-square bg-white rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-2 transition duration-300">
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 font-heading">Illustration 1</span>
                                <ImageIcon className="w-8 h-8 ml-2 text-gray-400" />
                            </div>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition"></div>
                        </div>
                        {/* Page 2 */}
                        <div className="group relative aspect-square bg-white rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-2 transition duration-300">
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 font-heading">Illustration 2</span>
                                <ImageIcon className="w-8 h-8 ml-2 text-gray-400" />
                            </div>
                        </div>
                        {/* Page 3 */}
                        <div className="group relative aspect-square bg-white rounded-2xl shadow-md overflow-hidden transform hover:-translate-y-2 transition duration-300">
                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-400 font-heading">Illustration 3</span>
                                <ImageIcon className="w-8 h-8 ml-2 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-xl font-heading text-[#1A3C40] mb-6">"The illustrations are absolutely magical. My daughter stares at them for hours!"</p>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="reviews" className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <h2 className="font-heading text-4xl font-bold text-center text-[#1A3C40] mb-16">What Families Are Saying</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Review 1 */}
                        <div className="bg-[#FFFBE9] p-8 rounded-2xl relative">
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-[#FFD93D] opacity-50 fill-current" />
                            <div className="flex gap-1 text-[#FF8400] mb-4">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-gray-700 mb-6 italic">"Finally, a book that helps my son talk about his feelings. We read it every single night before bed."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-white">EM</div>
                                <div>
                                    <div className="font-bold text-[#1A3C40]">Emily M.</div>
                                    <div className="text-xs text-gray-500">Mom of two</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-[#FFFBE9] p-8 rounded-2xl relative transform md:-translate-y-4 shadow-lg border-2 border-[#FFD93D]/20">
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-[#FFD93D] opacity-50 fill-current" />
                            <div className="flex gap-1 text-[#FF8400] mb-4">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-gray-700 mb-6 italic">"The artwork is stunning and the message is so sweet. I bought three copies for gifts!"</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-white">JD</div>
                                <div>
                                    <div className="font-bold text-[#1A3C40]">James D.</div>
                                    <div className="text-xs text-gray-500">Verified Buyer</div>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-[#FFFBE9] p-8 rounded-2xl relative">
                            <Quote className="absolute top-6 right-6 w-8 h-8 text-[#FFD93D] opacity-50 fill-current" />
                            <div className="flex gap-1 text-[#FF8400] mb-4">
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                                <Star className="w-4 h-4 fill-current" />
                            </div>
                            <p className="text-gray-700 mb-6 italic">"A modern classic. It's rare to find books that are both fun to read and meaningful."</p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-white">SK</div>
                                <div>
                                    <div className="font-bold text-[#1A3C40]">Sarah K.</div>
                                    <div className="text-xs text-gray-500">Teacher</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Author Section */}
            <section id="author" className="py-20 bg-[#4F9DA6]/5">
                <div className="max-w-4xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="w-48 h-48 flex-shrink-0 relative">
                            <div className="absolute inset-0 bg-[#FFD93D] rounded-full transform translate-x-2 translate-y-2"></div>
                            <div className="absolute inset-0 bg-white rounded-full overflow-hidden border-4 border-white shadow-lg flex items-center justify-center text-gray-300">
                                <User className="w-20 h-20" />
                            </div>
                        </div>
                        <div className="text-center md:text-left">
                            <h2 className="font-heading text-3xl font-bold text-[#1A3C40] mb-4">Meet The Author</h2>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                                Hi! I'm <strong>{authorName}</strong>. I wrote this book after my own son had trouble sleeping during thunderstorms.
                                My goal is to help children find magic in everyday moments.
                            </p>
                            <p className="text-gray-700 mb-6 leading-relaxed">
                                When I'm not writing, I'm painting watercolors or hiking with my golden retriever, Barnaby.
                            </p>
                            <div className="h-12 mx-auto md:mx-0 opacity-70 font-cursive text-2xl text-[#333]">
                                {authorName}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / CTA */}
            <section id="buy" className="py-24 bg-[#1A3C40] text-white relative overflow-hidden">
                {/* Abstract Shapes */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#4F9DA6] rounded-full opacity-20 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[#FF8400] rounded-full opacity-20 blur-3xl"></div>

                <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">Ready for an Adventure?</h2>
                        <p className="text-[#FFFBE9]/80 text-xl">Choose your format and start reading today.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* E-Book */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition text-center flex flex-col">
                            <div className="mb-4">
                                <Tablet className="w-12 h-12 mx-auto text-[#4F9DA6]" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-2">E-Book</h3>
                            <p className="text-gray-300 text-sm mb-6">Instant Download (PDF/Epub)</p>
                            <div className="text-4xl font-bold mb-6">${product.price}</div>
                            {product.isAmazonProduct ? (
                                <Link href={product.amazonLink || "#"} target="_blank" className="mt-auto">
                                    <button className="w-full bg-transparent border-2 border-white text-white py-3 rounded-full font-bold hover:bg-white hover:text-[#1A3C40] transition">
                                        Buy on Amazon
                                    </button>
                                </Link>
                            ) : (
                                <button className="mt-auto bg-transparent border-2 border-white text-white py-3 rounded-full font-bold hover:bg-white hover:text-[#1A3C40] transition">
                                    Buy Digital
                                </button>
                            )}
                        </div>

                        {/* Hardcover (Featured) */}
                        <div className="bg-white text-[#1A3C40] rounded-2xl p-8 transform scale-105 shadow-2xl relative flex flex-col">
                            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#FF8400] text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                                Most Popular
                            </div>
                            <div className="mb-4 mt-2">
                                <Book className="w-12 h-12 mx-auto text-[#FF8400]" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-2">Hardcover</h3>
                            <p className="text-gray-500 text-sm mb-6">Premium glossy finish</p>
                            <div className="text-4xl font-bold mb-6">$24.99</div>
                            <ul className="text-left text-sm space-y-3 mb-8 text-gray-600">
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Free Coloring Pages PDF</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Signed Bookplate</li>
                                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> High-quality paper</li>
                            </ul>
                            <button className="mt-auto bg-[#FF8400] text-white py-4 rounded-full font-bold hover:bg-orange-600 transition shadow-lg">
                                Buy Hardcover
                            </button>
                            <p className="text-xs text-center mt-3 text-gray-400">Free shipping on orders over $40</p>
                        </div>

                        {/* Bundle */}
                        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition text-center flex flex-col">
                            <div className="mb-4">
                                <Package className="w-12 h-12 mx-auto text-[#FFD93D]" />
                            </div>
                            <h3 className="font-heading text-2xl font-bold mb-2">Gift Bundle</h3>
                            <p className="text-gray-300 text-sm mb-6">2 Hardcovers + Plushie</p>
                            <div className="text-4xl font-bold mb-6">$59.99</div>
                            <button className="mt-auto bg-transparent border-2 border-white text-white py-3 rounded-full font-bold hover:bg-white hover:text-[#1A3C40] transition">
                                Buy Bundle
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="font-heading text-3xl font-bold text-center text-[#1A3C40] mb-12">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        {/* Question 1 */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full flex justify-between items-center p-4 bg-gray-50 text-left font-bold text-[#1A3C40] focus:outline-none"
                                onClick={() => toggleFaq(0)}
                            >
                                <span>What age group is this book for?</span>
                                <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform", openFaqIndex === 0 && "transform rotate-180")} />
                            </button>
                            <div className={cn("p-4 text-gray-600", openFaqIndex !== 0 && "hidden")}>
                                The book is written for children ages 3-7, but we find that older siblings often enjoy reading it to the younger ones!
                            </div>
                        </div>

                        {/* Question 2 */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full flex justify-between items-center p-4 bg-gray-50 text-left font-bold text-[#1A3C40] focus:outline-none"
                                onClick={() => toggleFaq(1)}
                            >
                                <span>Do you ship internationally?</span>
                                <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform", openFaqIndex === 1 && "transform rotate-180")} />
                            </button>
                            <div className={cn("p-4 text-gray-600", openFaqIndex !== 1 && "hidden")}>
                                Yes! We ship to most countries. Shipping times vary from 7-14 business days depending on your location.
                            </div>
                        </div>

                        {/* Question 3 */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                                className="w-full flex justify-between items-center p-4 bg-gray-50 text-left font-bold text-[#1A3C40] focus:outline-none"
                                onClick={() => toggleFaq(2)}
                            >
                                <span>How do I get the bonus coloring pages?</span>
                                <ChevronDown className={cn("w-5 h-5 text-gray-500 transition-transform", openFaqIndex === 2 && "transform rotate-180")} />
                            </button>
                            <div className={cn("p-4 text-gray-600", openFaqIndex !== 2 && "hidden")}>
                                After your purchase, you will receive an email with a link to download the printable PDF coloring pages instantly.
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#FFFBE9] pt-16 pb-8 border-t border-[#1A3C40]/5">
                <div className="max-w-6xl mx-auto px-4 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <BookOpen className="h-6 w-6 text-[#FF8400]" />
                                <span className="font-heading font-bold text-xl text-[#1A3C40]">LittleReaders</span>
                            </div>
                            <p className="text-gray-500 max-w-xs">
                                Creating stories that inspire, teach, and comfort children around the world.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1A3C40] mb-4">Shop</h4>
                            <ul className="space-y-2 text-gray-500">
                                <li><a href="#" className="hover:text-[#FF8400]">Hardcover</a></li>
                                <li><a href="#" className="hover:text-[#FF8400]">E-Book</a></li>
                                <li><a href="#" className="hover:text-[#FF8400]">Wholesale</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-[#1A3C40] mb-4">Connect</h4>
                            <ul className="space-y-2 text-gray-500">
                                <li><a href="#" className="hover:text-[#FF8400]">Instagram</a></li>
                                <li><a href="#" className="hover:text-[#FF8400]">Facebook</a></li>
                                <li><a href="#" className="hover:text-[#FF8400]">Contact Author</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
                        <p>&copy; {new Date().getFullYear()} {authorName || "Sarah Jenkins"} Books. All rights reserved.</p>
                        <div className="flex gap-4 mt-4 md:mt-0">
                            <a href="#" className="hover:text-[#1A3C40]">Privacy Policy</a>
                            <a href="#" className="hover:text-[#1A3C40]">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
