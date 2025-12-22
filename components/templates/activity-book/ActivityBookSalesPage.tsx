"use client";

import React from 'react';
import Link from 'next/link';
import {
    Pencil, ArrowRight, Eye, CheckCircle2, Rocket, Frown,
    BrainCircuit, Palette, Image as ImageIcon, Check, Star,
    ShieldCheck, Download, CreditCard, Lock
} from 'lucide-react';
import { Fredoka, Nunito } from 'next/font/google';
import { cn } from "@/lib/utils";

const fredoka = Fredoka({
    subsets: ['latin'],
    weight: ['300', '400', '600', '700'],
    variable: '--font-fredoka',
});

const nunito = Nunito({
    subsets: ['latin'],
    weight: ['400', '600', '700', '800'],
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

interface ActivityBookSalesPageProps {
    product: Product;
    authorName: string;
}

export default function ActivityBookSalesPage({ product, authorName }: ActivityBookSalesPageProps) {
    return (
        <div className={cn("font-sans text-[#2D3436] bg-gray-50 overflow-x-hidden", fredoka.variable, nunito.variable)} style={{ fontFamily: 'var(--font-nunito)' }}>
            <style jsx global>{`
                h1, h2, h3, h4, h5, h6, .font-display {
                    font-family: var(--font-fredoka), sans-serif;
                }
                /* Custom Styles for 3D Book Effect */
                .book-container {
                    perspective: 1000px;
                }
                .book {
                    transform-style: preserve-3d;
                    transform: rotateY(-25deg);
                    transition: transform 0.5s ease;
                    box-shadow: 20px 20px 30px rgba(0,0,0,0.2);
                }
                .book:hover {
                    transform: rotateY(-15deg) scale(1.02);
                }
                
                .blob-bg {
                    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FFD93D' d='M44.7,-76.4C58.9,-69.2,71.8,-59.1,81.3,-46.6C90.8,-34.1,96.9,-19.2,95.8,-4.9C94.7,9.5,86.3,23.3,76.4,35.6C66.5,48,55.1,58.9,42.4,67.3C29.8,75.7,15.9,81.6,1.4,79.2C-13.1,76.8,-27.8,66.1,-41.6,56.6C-55.4,47.1,-68.3,38.8,-76.3,26.9C-84.3,15,-87.4,-0.5,-83.6,-14.2C-79.9,-27.9,-69.2,-39.8,-56.9,-47.9C-44.6,-56,-30.7,-60.3,-17.6,-62.9C-4.5,-65.5,7.8,-66.4,20.6,-70.6C33.4,-74.8,44.7,-76.4,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: center;
                    background-size: contain;
                }

                /* Zigzag Border */
                .zigzag-bottom {
                    position: relative;
                }
                .zigzag-bottom::after {
                    content: "";
                    position: absolute;
                    bottom: -20px;
                    left: 0;
                    width: 100%;
                    height: 20px;
                    background: linear-gradient(45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%), linear-gradient(-45deg, transparent 33.333%, #ffffff 33.333%, #ffffff 66.667%, transparent 66.667%);
                    background-size: 20px 40px;
                    background-position: 0 -20px;
                    z-index: 10;
                }
            `}</style>

            {/* Navigation */}
            <nav className="fixed w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm border-b border-gray-100">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Pencil className="text-[#FF8400] w-6 h-6" />
                        <span className="font-display font-bold text-xl tracking-tight">LittleLearners<span className="text-[#FF8400]">Press</span></span>
                    </div>
                    <a href="#buy" className="bg-[#FF8400] hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                        Buy Now
                    </a>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Background Elements */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-[#FFD93D]/10 rounded-bl-[100px] -z-10"></div>
                <div className="absolute bottom-10 left-10 text-[#4F95FF]/20 animate-bounce delay-100">
                    <Star className="w-12 h-12" />
                </div>

                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
                        {/* Text Content */}
                        <div className="lg:w-1/2 text-center lg:text-left">
                            <span className="inline-block bg-[#4F95FF]/10 text-[#4F95FF] px-4 py-1.5 rounded-full font-bold text-sm mb-6 border border-[#4F95FF]/20">
                                Top Rated for Ages 4-8
                            </span>
                            <h1 className="font-display font-bold text-4xl lg:text-6xl leading-tight mb-6">
                                {product.title} <span className="text-[#6BCB77]">Creative Time!</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                                {product.description || 'Keep your little ones entertained for hours with 100+ pages of mazes, puzzles, coloring, and learning activities. The perfect cure for "I\'m bored!"'}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <a href="#buy" className="bg-[#FF8400] hover:bg-orange-600 text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                    Get Your Copy <ArrowRight className="w-5 h-5" />
                                </a>
                                <a href="#preview" className="bg-white border-2 border-gray-200 hover:border-[#4F95FF] text-gray-700 hover:text-[#4F95FF] font-bold py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2">
                                    <Eye className="w-5 h-5" /> Look Inside
                                </a>
                            </div>

                            <div className="mt-8 flex items-center justify-center lg:justify-start gap-4 text-sm text-gray-500 font-semibold">
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="text-[#6BCB77] w-4 h-4" /> Instant PDF Download
                                </div>
                                <div className="flex items-center gap-1">
                                    <CheckCircle2 className="text-[#6BCB77] w-4 h-4" /> Printable Anytime
                                </div>
                            </div>
                        </div>

                        {/* 3D Book Visual */}
                        <div className="lg:w-1/2 flex justify-center book-container relative">
                            <div className="blob-bg absolute inset-0 -z-10 scale-150 opacity-50"></div>
                            {/* Book Mockup (CSS) */}
                            <div className="book relative w-[300px] h-[400px] bg-white rounded-r-lg">
                                {product.imageUrl ? (
                                    <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover rounded-r-lg border-l-8 border-l-gray-300" />
                                ) : (
                                    <div className="absolute inset-0 bg-[#4F95FF] rounded-r-lg border-l-8 border-l-gray-300 overflow-hidden flex flex-col items-center justify-center text-center p-6 text-white border border-gray-900/10">
                                        <Rocket className="w-16 h-16 mb-4 text-[#FFD93D]" />
                                        <h2 className="font-display text-4xl font-bold mb-2 leading-none">{product.title}</h2>
                                        <p className="font-body text-sm mt-4 opacity-90">100+ Pages of Fun!</p>
                                        <div className="absolute bottom-0 w-full h-12 bg-black/10 flex items-center justify-center">
                                            <span className="text-xs font-bold tracking-widest uppercase">For Kids Ages 4-8</span>
                                        </div>
                                    </div>
                                )}
                                {/* Book Pages Edge */}
                                <div className="absolute top-1 right-1 w-4 h-[392px] bg-white rounded-tr-sm rounded-br-sm shadow-inner opacity-50"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Problem / Solution Section */}
            <section className="py-20 bg-[#FFD93D]/10 zigzag-bottom">
                <div className="container mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-[#2D3436]">Are You Tired of Hearing "I'm Bored"?</h2>
                        <p className="text-lg text-gray-600">We know how hard it is to keep kids engaged without handing them a tablet. You want them to learn, be creative, and have fun—all at the same time.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-[#FF8400] transform hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-[#FF8400]/10 rounded-full flex items-center justify-center mb-6">
                                <Frown className="text-[#FF8400] w-8 h-8" />
                            </div>
                            <h3 className="font-display font-bold text-xl mb-3">Too Much Screen Time?</h3>
                            <p className="text-gray-600">Break the digital addiction with hands-on activities that stimulate the brain, not numb it.</p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-[#4F95FF] transform hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-[#4F95FF]/10 rounded-full flex items-center justify-center mb-6">
                                <BrainCircuit className="text-[#4F95FF] w-8 h-8" />
                            </div>
                            <h3 className="font-display font-bold text-xl mb-3">Lack of Focus?</h3>
                            <p className="text-gray-600">Our puzzles are designed to slowly build concentration and problem-solving skills.</p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-[#6BCB77] transform hover:-translate-y-2 transition-transform">
                            <div className="w-14 h-14 bg-[#6BCB77]/10 rounded-full flex items-center justify-center mb-6">
                                <Palette className="text-[#6BCB77] w-8 h-8" />
                            </div>
                            <h3 className="font-display font-bold text-xl mb-3">Rainy Day Blues?</h3>
                            <p className="text-gray-600">The perfect rainy day backup plan. Just print a few pages and watch the creativity flow.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sneak Peek / Gallery */}
            <section id="preview" className="py-20 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-[#9B72AA] font-bold tracking-wider uppercase text-sm">Look Inside</span>
                        <h2 className="font-display text-4xl font-bold mt-2 mb-4">What's Inside the Book?</h2>
                        <div className="w-24 h-1.5 bg-[#9B72AA] rounded-full mx-auto"></div>
                    </div>

                    {/* Grid of Page Previews */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {/* Preview Item 1 */}
                        <div className="group relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-100 hover:border-[#9B72AA] transition-all">
                            {/* Placeholder for page image */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                                <ImageIcon className="w-12 h-12 mb-2" />
                                <span className="font-display font-bold text-gray-400">Mazes</span>
                            </div>
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-[#9B72AA]/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <p className="text-white font-bold text-lg">Challenging Mazes</p>
                            </div>
                        </div>

                        {/* Preview Item 2 */}
                        <div className="group relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-100 hover:border-[#4F95FF] transition-all">
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                                <ImageIcon className="w-12 h-12 mb-2" />
                                <span className="font-display font-bold text-gray-400">Connect Dots</span>
                            </div>
                            <div className="absolute inset-0 bg-[#4F95FF]/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <p className="text-white font-bold text-lg">Connect the Dots</p>
                            </div>
                        </div>

                        {/* Preview Item 3 */}
                        <div className="group relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-100 hover:border-[#FF8400] transition-all">
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                                <ImageIcon className="w-12 h-12 mb-2" />
                                <span className="font-display font-bold text-gray-400">Word Search</span>
                            </div>
                            <div className="absolute inset-0 bg-[#FF8400]/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <p className="text-white font-bold text-lg">Word Searches</p>
                            </div>
                        </div>

                        {/* Preview Item 4 */}
                        <div className="group relative aspect-[3/4] bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-100 hover:border-[#6BCB77] transition-all">
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-300 group-hover:scale-105 transition-transform duration-500">
                                <ImageIcon className="w-12 h-12 mb-2" />
                                <span className="font-display font-bold text-gray-400">Coloring</span>
                            </div>
                            <div className="absolute inset-0 bg-[#6BCB77]/90 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <p className="text-white font-bold text-lg">Creative Coloring</p>
                            </div>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="mt-16 grid md:grid-cols-2 gap-8 max-w-4xl mx-auto bg-gray-50 p-8 rounded-3xl border border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-[#6BCB77]"><Check className="w-6 h-6" /></div>
                            <div>
                                <h4 className="font-bold text-lg">Develops Fine Motor Skills</h4>
                                <p className="text-sm text-gray-600">Tracing and coloring helps strengthen hand muscles.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-[#6BCB77]"><Check className="w-6 h-6" /></div>
                            <div>
                                <h4 className="font-bold text-lg">Boosts Problem Solving</h4>
                                <p className="text-sm text-gray-600">Mazes and logic puzzles encourage critical thinking.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-[#6BCB77]"><Check className="w-6 h-6" /></div>
                            <div>
                                <h4 className="font-bold text-lg">100+ Unique Pages</h4>
                                <p className="text-sm text-gray-600">No repeats! Every page offers a new adventure.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4">
                            <div className="bg-white p-2 rounded-lg shadow-sm text-[#6BCB77]"><Check className="w-6 h-6" /></div>
                            <div>
                                <h4 className="font-bold text-lg">Instant Access</h4>
                                <p className="text-sm text-gray-600">Download instantly and print as many times as you want.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-[#4F95FF] text-white relative overflow-hidden">
                {/* Decoration */}
                <div className="absolute top-10 left-10 text-white/10 w-32 h-32 rotate-12">
                    <svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" /></svg>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">Parents ❤️ This Book</h2>

                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Review 1 */}
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                            <div className="flex gap-1 text-[#FFD93D] mb-4">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <p className="mb-6 leading-relaxed">"This saved our road trip! My 6-year-old was entertained for hours. The variety of activities is fantastic."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">SJ</div>
                                <div>
                                    <p className="font-bold">Sarah Jenkins</p>
                                    <p className="text-xs opacity-75">Mom of two</p>
                                </div>
                            </div>
                        </div>

                        {/* Review 2 */}
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                            <div className="flex gap-1 text-[#FFD93D] mb-4">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <p className="mb-6 leading-relaxed">"I love that I can just print out new pages whenever we need them. Best value for money I've found."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">MR</div>
                                <div>
                                    <p className="font-bold">Mike Ross</p>
                                    <p className="text-xs opacity-75">Dad of a 5-year-old</p>
                                </div>
                            </div>
                        </div>

                        {/* Review 3 */}
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/20">
                            <div className="flex gap-1 text-[#FFD93D] mb-4">
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                                <Star className="w-5 h-5 fill-current" />
                            </div>
                            <p className="mb-6 leading-relaxed">"The difficulty level is perfect. Not too easy, not too hard. It really keeps my daughter focused."</p>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">AL</div>
                                <div>
                                    <p className="font-bold">Amy Lee</p>
                                    <p className="text-xs opacity-75">Homeschooling Mom</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing / CTA */}
            <section id="buy" className="py-20 bg-gray-50">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row">
                        {/* Left: Product Summary */}
                        <div className="p-10 md:w-3/5">
                            <span className="text-[#FF8400] font-bold tracking-widest text-xs uppercase mb-2 block">Limited Time Offer</span>
                            <h2 className="font-display text-4xl font-bold mb-4 text-[#2D3436]">Get The Ultimate Activity Pack</h2>
                            <p className="text-gray-600 mb-8">Instant digital download. Print forever.</p>

                            <ul className="space-y-4 mb-8">
                                <li className="flex items-center gap-3">
                                    <Check className="text-[#6BCB77] w-5 h-5" />
                                    <span>100+ High Quality Activity Pages</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="text-[#6BCB77] w-5 h-5" />
                                    <span>Bonus: 20 Coloring Sheets</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="text-[#6BCB77] w-5 h-5" />
                                    <span>Printable Certificate of Completion</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <Check className="text-[#6BCB77] w-5 h-5" />
                                    <span>Lifetime Updates</span>
                                </li>
                            </ul>

                            <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                                <ShieldCheck className="text-[#FF8400] w-8 h-8" />
                                <div>
                                    <p className="font-bold text-sm">30-Day Money Back Guarantee</p>
                                    <p className="text-xs text-gray-500">If your kids don't love it, we'll refund you instantly.</p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Price & Button */}
                        <div className="p-10 md:w-2/5 bg-gray-900 text-white flex flex-col justify-center items-center text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#4F95FF] opacity-20"></div>
                            <div className="relative z-10">
                                {/* <p className="text-gray-400 line-through text-lg mb-1">$29.99</p> */}
                                <div className="text-6xl font-display font-bold mb-2 text-white">${product.price}</div>
                                <p className="text-[#6BCB77] font-bold mb-8">Save 65% Today</p>

                                {product.isAmazonProduct ? (
                                    <Link href={product.amazonLink || "#"} target="_blank" className="w-full">
                                        <button className="w-full bg-[#FF8400] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1 mb-4 flex justify-center items-center gap-2">
                                            Buy on Amazon <ArrowRight className="w-5 h-5" />
                                        </button>
                                    </Link>
                                ) : (
                                    <button className="w-full bg-[#FF8400] hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:-translate-y-1 mb-4 flex justify-center items-center gap-2">
                                        Download Now <Download className="w-5 h-5" />
                                    </button>
                                )}

                                <div className="flex justify-center gap-2 opacity-50">
                                    <CreditCard className="w-6 h-6" />
                                    <Lock className="w-6 h-6" />
                                </div>
                                <p className="text-xs mt-2 text-gray-400">Secure 256-bit SSL Encryption</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-6 max-w-3xl">
                    <h2 className="font-display text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

                    <div className="space-y-4">
                        {/* FAQ 1 */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-2">Is this a physical book or digital?</h3>
                            <p className="text-gray-600">This is a digital PDF file. You will receive an email with the download link instantly after purchase. No physical product will be shipped.</p>
                        </div>
                        {/* FAQ 2 */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-2">What age is this suitable for?</h3>
                            <p className="text-gray-600">It is perfectly designed for children aged 4-8. However, younger children may enjoy coloring, and older children often enjoy the relaxation of the mazes!</p>
                        </div>
                        {/* FAQ 3 */}
                        <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                            <h3 className="font-bold text-lg mb-2">Can I print it multiple times?</h3>
                            <p className="text-gray-600">Yes! Once you buy it, it's yours. You can print it as many times as you like for your personal household use.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Pencil className="text-[#FF8400] w-6 h-6" />
                            <span className="font-display font-bold text-xl tracking-tight">LittleLearners<span className="text-[#FF8400]">Press</span></span>
                        </div>
                        <div className="text-gray-400 text-sm">
                            &copy; {new Date().getFullYear()} {authorName || "Little Learners Press"}. All rights reserved.
                        </div>
                        <div className="flex gap-6 text-sm text-gray-400">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                            <a href="#" className="hover:text-white transition-colors">Contact</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
