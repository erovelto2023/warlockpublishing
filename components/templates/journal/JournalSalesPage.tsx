"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import {
    Book,
    Tablet,
    Download,
    Layers,
    Star,
    Check,
    ArrowRight,
    Menu,
    X,
    Zap,
    ShieldCheck,
    Instagram,
    Twitter,
    Facebook,
    CreditCard,
    Lock
} from 'lucide-react';
import { Playfair_Display, Inter } from 'next/font/google';
import { cn } from "@/lib/utils";

const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
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

interface JournalSalesPageProps {
    product: Product;
    authorName: string;
}

export default function JournalSalesPage({ product, authorName }: JournalSalesPageProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeFaq, setActiveFaq] = useState<number | null>(null);

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    const toggleFaq = (index: number) => setActiveFaq(activeFaq === index ? null : index);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMenuOpen(false);
        }
    };

    return (
        <div className={cn("min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-stone-200", playfair.variable, inter.variable)} style={{ fontFamily: 'var(--font-inter)' }}>
            <style jsx global>{`
        .font-serif {
            font-family: var(--font-playfair), serif;
        }
      `}</style>

            {/* Navigation */}
            <nav className="fixed w-full z-50 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <div className="flex items-center space-x-2">
                            <Book className="h-6 w-6 text-stone-600" />
                            <span className="text-xl font-serif font-bold tracking-tight text-stone-900">The Daily Mind</span>
                        </div>

                        {/* Desktop Menu */}
                        <div className="hidden md:flex items-center space-x-8">
                            <button onClick={() => scrollToSection('features')} className="text-stone-600 hover:text-stone-900 transition-colors">Features</button>
                            <button onClick={() => scrollToSection('compatibility')} className="text-stone-600 hover:text-stone-900 transition-colors">Compatibility</button>
                            <button onClick={() => scrollToSection('reviews')} className="text-stone-600 hover:text-stone-900 transition-colors">Reviews</button>
                            <button
                                onClick={() => scrollToSection('pricing')}
                                className="bg-stone-900 text-stone-50 px-5 py-2.5 rounded-full font-medium hover:bg-stone-700 transition-all hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                Download Now
                            </button>
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center">
                            <button onClick={toggleMenu} className="text-stone-600 hover:text-stone-900">
                                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-stone-50 border-b border-stone-200">
                        <div className="px-4 pt-2 pb-6 space-y-2">
                            <button onClick={() => scrollToSection('features')} className="block w-full text-left py-3 text-stone-600 font-medium">Features</button>
                            <button onClick={() => scrollToSection('compatibility')} className="block w-full text-left py-3 text-stone-600 font-medium">Compatibility</button>
                            <button onClick={() => scrollToSection('reviews')} className="block w-full text-left py-3 text-stone-600 font-medium">Reviews</button>
                            <button onClick={() => scrollToSection('pricing')} className="block w-full text-center mt-4 bg-stone-900 text-stone-50 py-3 rounded-lg font-medium">
                                Download Now
                            </button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center gap-12 lg:gap-20">
                        <div className="flex-1 text-center md:text-left space-y-8">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-stone-200 text-stone-700 text-sm font-medium mb-4">
                                <Star className="w-3 h-3 mr-2 fill-current" /> Updated for {new Date().getFullYear()}
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-medium leading-tight text-stone-900">
                                {product.title}
                            </h1>
                            <p className="text-xl text-stone-600 max-w-lg mx-auto md:mx-0 leading-relaxed">
                                {product.description || "The ultimate digital planner for GoodNotes & Notability. Hyperlinked, intuitive, and designed to help you focus."}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                                <button
                                    onClick={() => scrollToSection('pricing')}
                                    className="bg-stone-900 text-stone-50 px-8 py-4 rounded-full text-lg font-medium hover:bg-stone-800 transition-all hover:shadow-xl flex items-center justify-center gap-2 group"
                                >
                                    Instant Download
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button
                                    onClick={() => scrollToSection('compatibility')}
                                    className="bg-white border border-stone-300 text-stone-900 px-8 py-4 rounded-full text-lg font-medium hover:bg-stone-50 hover:border-stone-400 transition-all flex items-center justify-center"
                                >
                                    Watch Demo
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 relative">
                            {/* Abstract decorative elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-stone-200/50 rounded-full blur-3xl -z-10"></div>

                            <div className="relative rounded-2xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-700 border-8 border-stone-900/10">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-full h-auto object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-[500px] bg-stone-100 flex items-center justify-center">
                                        <Book className="w-24 h-24 text-stone-300" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="features" className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl md:text-4xl font-serif text-stone-900 mb-6">Paper feel. Digital power.</h2>
                        <p className="text-lg text-stone-600">
                            Enjoy the tactile satisfaction of handwriting without the clutter. Duplicate pages endlessly, move content around, and never run out of space.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: <Layers className="w-8 h-8" />,
                                title: "Smart Hyperlinks",
                                desc: "Jump from monthly views to daily pages instantly. Our tab system is designed for zero-lag navigation."
                            },
                            {
                                icon: <Download className="w-8 h-8" />,
                                title: "Unlimited Pages",
                                desc: "Need more space for notes? Just duplicate the page template. One purchase lasts you a lifetime."
                            },
                            {
                                icon: <Tablet className="w-8 h-8" />,
                                title: "Sync Across Devices",
                                desc: "Start planning on your iPad, check your to-do list on your iPhone. Your journal goes where you go."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-stone-50 p-8 rounded-2xl hover:shadow-lg transition-shadow duration-300 border border-stone-100">
                                <div className="w-14 h-14 bg-stone-200 rounded-xl flex items-center justify-center text-stone-700 mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-bold text-stone-900 mb-3">{feature.title}</h3>
                                <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Look Inside / Visuals */}
            <section id="compatibility" className="py-24 bg-stone-100">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="order-2 md:order-1 space-y-8">
                            <h2 className="text-4xl font-serif text-stone-900">What's included in your download.</h2>
                            <div className="space-y-6">
                                {[
                                    "Fully hyperlinked PDF file (Monday & Sunday starts)",
                                    "500+ Digital Stickers (Pre-cropped for GoodNotes)",
                                    "10 custom cover options",
                                    "Installation guide & video tutorial",
                                    "Bonus: Printable version included"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-lg text-stone-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4">
                                <button onClick={() => scrollToSection('pricing')} className="text-stone-900 font-medium border-b-2 border-stone-900 pb-1 hover:text-stone-600 hover:border-stone-600 transition-colors">
                                    Get The Bundle
                                </button>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl shadow-lg w-full h-64 bg-stone-200 flex items-center justify-center">
                                    <Tablet className="w-16 h-16 text-stone-400" />
                                </div>
                                <div className="rounded-2xl shadow-lg w-full h-64 bg-stone-300 flex items-center justify-center">
                                    <Layers className="w-16 h-16 text-stone-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section id="reviews" className="py-24 bg-white">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-serif text-center mb-16">Stories from digital planners.</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                text: "I used to carry three different notebooks. Now I just carry my iPad. The hyperlinks work perfectly and the layout is so clean.",
                                author: "Jessica M.",
                                role: "Student"
                            },
                            {
                                text: "The sticker pack that comes with this is amazing. It makes planning my week actually fun. Highly recommend for GoodNotes users.",
                                author: "David K.",
                                role: "Creative Director"
                            },
                            {
                                text: "Finally, a digital planner that doesn't lag! I love that I can duplicate the project pages as many times as I need.",
                                author: "Sophie L.",
                                role: "Freelancer"
                            }
                        ].map((review, i) => (
                            <div key={i} className="bg-stone-50 p-8 rounded-2xl border border-stone-100">
                                <div className="flex text-amber-500 mb-6">
                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className="w-4 h-4 fill-current" />)}
                                </div>
                                <p className="text-stone-700 mb-6 italic">"{review.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-stone-300 rounded-full overflow-hidden flex items-center justify-center font-bold text-stone-500">
                                        {review.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-stone-900 text-sm">{review.author}</p>
                                        <p className="text-stone-500 text-xs uppercase tracking-wide">{review.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-stone-900 text-stone-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif mb-6">Start planning in minutes.</h2>
                    <p className="text-stone-400 mb-16 max-w-xl mx-auto">One-time purchase. No subscription fees. Instant download.</p>

                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        {/* Standard Option */}
                        <div className="bg-stone-800 rounded-3xl p-8 border border-stone-700 flex flex-col">
                            <div className="text-left mb-8">
                                <h3 className="text-2xl font-bold mb-2">{product.title}</h3>
                                <p className="text-stone-400 text-sm">Everything you need to get organized.</p>
                            </div>
                            <div className="text-left mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">${product.price}</span>
                                    {/* <span className="text-stone-500 line-through">$29</span> */}
                                </div>
                                <p className="text-stone-400 text-sm mt-2">Instant PDF Download</p>
                            </div>
                            <ul className="text-left space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3 text-stone-300">
                                    <Check className="w-5 h-5 text-stone-500" /> Dated Jan - Dec {new Date().getFullYear()}
                                </li>
                                <li className="flex items-center gap-3 text-stone-300">
                                    <Check className="w-5 h-5 text-stone-500" /> Monday & Sunday Starts
                                </li>
                                <li className="flex items-center gap-3 text-stone-300">
                                    <Check className="w-5 h-5 text-stone-500" /> Basic Sticker Set
                                </li>
                            </ul>

                            {product.isAmazonProduct ? (
                                <Link href={product.amazonLink || "#"} target="_blank" className="w-full">
                                    <button className="w-full py-4 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-medium transition-colors">
                                        Buy on Amazon
                                    </button>
                                </Link>
                            ) : (
                                <button className="w-full py-4 rounded-xl bg-stone-700 hover:bg-stone-600 text-white font-medium transition-colors">
                                    Add to Cart
                                </button>
                            )}
                        </div>

                        {/* Best Value Option */}
                        <div className="bg-white text-stone-900 rounded-3xl p-8 flex flex-col relative transform md:-translate-y-4 shadow-2xl">
                            <div className="absolute top-0 right-0 bg-amber-200 text-amber-900 text-xs font-bold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                                BEST SELLER
                            </div>
                            <div className="text-left mb-8">
                                <h3 className="text-2xl font-bold mb-2">The Ultimate Bundle</h3>
                                <p className="text-stone-500 text-sm">Planner + Journals + Stickers.</p>
                            </div>
                            <div className="text-left mb-8">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold">${(product.price * 1.5).toFixed(2)}</span>
                                    <span className="text-stone-400 line-through">${(product.price * 3).toFixed(2)}</span>
                                </div>
                                <p className="text-green-600 font-medium text-sm mt-2">Save 50% Today</p>
                            </div>
                            <ul className="text-left space-y-4 mb-8 flex-1">
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 rounded-full p-1"><Check className="w-3 h-3 text-green-700" /></div>
                                    {new Date().getFullYear()} Dated Planner
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 rounded-full p-1"><Check className="w-3 h-3 text-green-700" /></div>
                                    <span className="font-bold">500+ Premium Stickers</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="bg-green-100 rounded-full p-1"><Check className="w-3 h-3 text-green-700" /></div>
                                    Bonus: Wellness & Budget Journals
                                </li>
                            </ul>
                            <button className="w-full py-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-medium transition-colors shadow-xl">
                                Get The Bundle
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-24 bg-stone-50">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-serif text-center mb-12">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        {[
                            { q: "How do I receive my planner?", a: "Immediately after purchase, you'll receive an email with a download link. You can save the PDF directly to your tablet or computer." },
                            { q: "Which apps is this compatible with?", a: "Our planners work best with GoodNotes (iOS), Notability (iOS), Xodo (Android/Windows), and Noteshelf. Basically any PDF annotation app that supports hyperlinks!" },
                            { q: "Is this a physical product?", a: "No, this is a digital download only. You will not receive a physical book in the mail. However, the high-resolution PDF is printable if you prefer paper." },
                            { q: "Can I use this on my phone?", a: "Yes! If you sync your note-taking app (like GoodNotes) via iCloud, you can view and edit your planner on your iPhone or Mac as well." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white border border-stone-200 rounded-xl overflow-hidden">
                                <button
                                    onClick={() => toggleFaq(i)}
                                    className="w-full flex items-center justify-between p-6 text-left hover:bg-stone-50 transition-colors"
                                >
                                    <span className="font-medium text-stone-900">{faq.q}</span>
                                    {activeFaq === i ? <X className="w-5 h-5 text-stone-400" /> : <ArrowRight className="w-5 h-5 text-stone-400 rotate-90" />}
                                </button>
                                {activeFaq === i && (
                                    <div className="px-6 pb-6 text-stone-600 leading-relaxed animate-fadeIn">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-stone-200 pt-16 pb-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-1">
                            <div className="flex items-center space-x-2 mb-4">
                                <Book className="h-6 w-6 text-stone-900" />
                                <span className="text-xl font-serif font-bold text-stone-900">The Daily Mind</span>
                            </div>
                            <p className="text-stone-500 text-sm">
                                Designing digital tools for a clearer mind and a more focused life.
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-900 mb-4">Shop</h4>
                            <ul className="space-y-2 text-sm text-stone-600">
                                <li><a href="#" className="hover:text-stone-900">{new Date().getFullYear()} Planners</a></li>
                                <li><a href="#" className="hover:text-stone-900">Sticker Packs</a></li>
                                <li><a href="#" className="hover:text-stone-900">Notebooks</a></li>
                                <li><a href="#" className="hover:text-stone-900">Freebies</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-900 mb-4">Support</h4>
                            <ul className="space-y-2 text-sm text-stone-600">
                                <li><a href="#" className="hover:text-stone-900">Installation Guide</a></li>
                                <li><a href="#" className="hover:text-stone-900">Video Tutorials</a></li>
                                <li><a href="#" className="hover:text-stone-900">FAQ</a></li>
                                <li><a href="#" className="hover:text-stone-900">Contact Us</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-stone-900 mb-4">Stay Connected</h4>
                            <div className="flex space-x-4 mb-4">
                                <a href="#" className="text-stone-400 hover:text-stone-900"><Instagram className="w-5 h-5" /></a>
                                <a href="#" className="text-stone-400 hover:text-stone-900"><Twitter className="w-5 h-5" /></a>
                                <a href="#" className="text-stone-400 hover:text-stone-900"><Facebook className="w-5 h-5" /></a>
                            </div>
                            <p className="text-xs text-stone-400">
                                Subscribe for free digital stickers and planning tips.
                            </p>
                        </div>
                    </div>
                    <div className="border-t border-stone-100 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-400">
                        <p>&copy; {new Date().getFullYear()} {authorName || "The Daily Mind"}. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-stone-600">Privacy Policy</a>
                            <a href="#" className="hover:text-stone-600">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
