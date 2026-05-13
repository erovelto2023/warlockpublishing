'use client';

import React from 'react';
import { 
    CheckCircle2, ArrowRight, ShieldCheck, 
    Star, HelpCircle, Clock, Users as UsersIcon,
    Facebook, Twitter, Share2, MessageCircle,
    ChevronRight, MapPin, ThumbsUp
} from "lucide-react";

interface DiscoveryTemplateProps {
    advertorial: any;
}

export default function DiscoveryTemplate({ advertorial }: DiscoveryTemplateProps) {
    const { 
        heroSection = { headline: "", boldClaim: "", imageUrl: "", videoUrl: "" },
        listicleItems = [],
        socialProof = [],
        conversionClose = { ctaText: "Order Now", urgencyText: "", guaranteeText: "" },
        vsl,
        discovery = {}
    } = advertorial;

    const {
        logoUrl = "https://assets.grooveapps.com/images/5df98d83cf362c0e9cf8723d/1602859217_Logo.png",
        breadcrumbs = ["Home", "Trending", "Safety"],
        author = { 
            name: "Mark Holler", 
            date: `Oct 19, ${new Date().getFullYear()}`, 
            readTime: "6 minute read", 
            avatarUrl: "https://assets.grooveapps.com/images/5df98d83cf362c0e9cf8723d/1602858832_Writer-Image.jpg" 
        },
        ratings = {
            overall: "4.9/5",
            breakdown: [
                { label: "Ease Of Use", value: 99 },
                { label: "Specifications", value: 97 },
                { label: "Value For Money", value: 99 }
            ]
        },
        imageGallery = [],
        orderSteps = [
            { step: "Step 1", title: "Order from the official online shop here >>", linkText: "official online shop here >>", linkUrl: "#" },
            { step: "Step 2", title: "Enjoy the convenience and quality!" }
        ],
        comments = [
            { name: "Donald Rice", time: "6 minutes ago", text: "I was skeptical at first, but this thing actually works. I feel much safer now." },
            { name: "Mike Splendid", time: "35 minutes ago", text: "Ordered 2 of these for my parents. The discount was a nice touch!" },
            { name: "James Steelber", time: "2 minutes ago", text: "Best purchase I've made this year. High quality and super bright." }
        ],
        painPoints = {
            title: "This is how professional thieves can harm you:",
            items: [
                "They closely watch your kids while you're at work",
                "They will sneak into your house during the night",
                "They monitor your schedules to find the perfect gap"
            ]
        }
    } = discovery;

    // Resolve Target URL
    let targetUrl = advertorial.affiliateOfferId?.affiliateLink || advertorial.customTargetUrl || "#";
    if (targetUrl !== "#") {
        const mdMatch = String(targetUrl).match(/\[.*\]\((.*)\)/);
        if (mdMatch) targetUrl = mdMatch[1];
        if (!String(targetUrl).startsWith('http') && !String(targetUrl).startsWith('//')) targetUrl = `https://${targetUrl}`;
        targetUrl = String(targetUrl).replace(/^https?:\/([^\/])/, 'https://$1');
    }

    return (
        <div className="min-h-screen bg-white text-[#333] font-sans selection:bg-blue-100">
            {/* Top Disclosure Banner */}
            <div className="bg-[#f8f9fa] border-b border-slate-200 py-3 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Advertorial: {advertorial.ftcDisclosure || "This is an advertisement and not a news article"}
                </span>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <img src={logoUrl} alt="Logo" className="h-6 w-auto" />
                        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-slate-600">
                            <a href="#" className="hover:text-blue-600 transition-colors">PC Gadgets</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Home Gadgets</a>
                            <a href="#" className="hover:text-blue-600 transition-colors">Personal Gadgets</a>
                        </div>
                    </div>
                    <a href={targetUrl} className="bg-blue-600 text-white px-4 py-2 text-xs font-black uppercase tracking-widest rounded hover:bg-blue-700 transition-all">
                        Get Discount
                    </a>
                </div>
            </nav>

            {/* Breadcrumbs */}
            <div className="max-w-4xl mx-auto px-6 pt-8">
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {breadcrumbs.map((crumb: string, i: number) => (
                        <React.Fragment key={i}>
                            <span className={i === breadcrumbs.length - 1 ? "text-blue-600" : ""}>{crumb}</span>
                            {i < breadcrumbs.length - 1 && <ChevronRight size={10} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Hero Section */}
            <header className="max-w-4xl mx-auto px-6 py-10 space-y-6">
                <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-slate-900">
                    {heroSection.headline || advertorial.title}
                </h1>
                {heroSection.boldClaim && (
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-600 leading-snug">
                        "{heroSection.boldClaim}"
                    </h2>
                )}

                <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                    <img 
                        src={author.avatarUrl} 
                        alt={author.name} 
                        className="w-12 h-12 rounded-full grayscale border-2 border-slate-100"
                    />
                    <div>
                        <div className="text-sm font-black text-slate-900">{author.name}</div>
                        <div className="text-xs text-slate-400 font-medium">{author.date} · {author.readTime}</div>
                    </div>
                    <div className="ml-auto flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-[#3b5998] flex items-center justify-center text-white cursor-pointer hover:opacity-90">
                            <Facebook size={14} fill="currentColor" />
                        </div>
                        <div className="w-8 h-8 rounded bg-[#1da1f2] flex items-center justify-center text-white cursor-pointer hover:opacity-90">
                            <Twitter size={14} fill="currentColor" />
                        </div>
                        <div className="w-8 h-8 rounded bg-[#ea4335] flex items-center justify-center text-white cursor-pointer hover:opacity-90">
                            <Share2 size={14} />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="max-w-4xl mx-auto px-6 pb-20 space-y-12">
                {/* Hero Media */}
                <div className="rounded-2xl overflow-hidden shadow-2xl shadow-blue-100 border border-slate-100">
                    {heroSection.videoUrl ? (
                        <div className="aspect-video">
                            <iframe 
                                src={`https://www.youtube.com/embed/${heroSection.videoUrl.split('v=')[1] || heroSection.videoUrl}?rel=0&autoplay=1&mute=1`}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    ) : (
                        <img 
                            src={heroSection.imageUrl || "https://assets.grooveapps.com/images/5df98d83cf362c0e9cf8723d/1602835447_Flashlight-2.jpg"} 
                            alt="Main Feature" 
                            className="w-full h-auto"
                        />
                    )}
                </div>

                {/* Narrative Text */}
                <article className="prose prose-slate max-w-none prose-p:text-lg prose-p:leading-relaxed prose-p:text-slate-700">
                    <p className="text-xl font-medium text-slate-800">
                        {advertorial.narrative?.frictionReveal || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce ut elementum elit. Nulla pharetra sem id nisi ornare, eget porta eros vehicula."}
                    </p>
                    
                    {advertorial.narrative?.editorialPivot && (
                        <div className="bg-amber-50 border-l-4 border-amber-400 p-6 my-10">
                            <p className="text-xl font-black italic text-amber-900 m-0">
                                "{advertorial.narrative.editorialPivot}"
                            </p>
                        </div>
                    )}

                    {/* Listicle / Body Content */}
                    <div className="space-y-12">
                        {listicleItems.map((item: any, i: number) => (
                            <section key={i} className="space-y-4">
                                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm">{i + 1}</span>
                                    {item.subheading}
                                </h3>
                                <div className="text-lg text-slate-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.content }} />
                            </section>
                        ))}
                    </div>

                    {/* Checkbox List */}
                    {painPoints.items?.length > 0 && (
                        <div className="bg-slate-50 rounded-2xl p-8 my-12 border border-slate-100">
                            <h4 className="text-xl font-black mb-6">{painPoints.title}</h4>
                            <ul className="space-y-4 list-none p-0">
                                {painPoints.items.map((text: string, i: number) => (
                                    <li key={i} className="flex items-start gap-4 text-slate-700 font-medium m-0">
                                        <div className="mt-1 text-red-500"><HelpCircle size={20} /></div>
                                        {text}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Image Gallery */}
                    {imageGallery.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 my-12">
                            {imageGallery.map((url: string, i: number) => (
                                <img key={i} src={url} className="w-full h-48 object-cover rounded-xl shadow-sm" alt={`Gallery ${i}`} />
                            ))}
                        </div>
                    )}
                </article>

                {/* VSL Section */}
                {vsl && (
                    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white space-y-8">
                        <div className="text-center space-y-4">
                            <h2 className="text-3xl md:text-4xl font-black italic">{vsl.title}</h2>
                            <p className="text-slate-400 text-lg">{vsl.description}</p>
                        </div>
                        <div className="aspect-video rounded-xl overflow-hidden ring-4 ring-white/10 shadow-2xl">
                            <iframe 
                                src={`https://www.youtube.com/embed/${vsl.videoUrl.split('v=')[1] || vsl.videoUrl}?rel=0`}
                                className="w-full h-full"
                                allowFullScreen
                            />
                        </div>
                    </div>
                )}

                {/* Comparison / Rating Engine */}
                <div className="grid md:grid-cols-2 gap-12 py-12 border-y border-slate-100">
                    <div className="space-y-8">
                        <div className="space-y-2 text-center md:text-left">
                            <h3 className="text-3xl font-black text-slate-900">Overall Rating</h3>
                            <div className="flex items-center gap-1 justify-center md:justify-start">
                                {[...Array(5)].map((_, i) => <Star key={i} size={24} fill="#fbbf24" color="#fbbf24" />)}
                                <span className="ml-2 text-2xl font-black text-slate-800">{ratings.overall}</span>
                            </div>
                        </div>
                        <div className="space-y-6">
                            {ratings.breakdown?.map((r: any, i: number) => (
                                <div key={i} className="space-y-2">
                                    <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-500">
                                        <span>{r.label}</span>
                                        <span>{r.value}%</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${r.value}%` }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-blue-600 rounded-3xl p-8 text-white flex flex-col justify-center text-center space-y-4">
                        <h3 className="text-4xl font-black italic">Absolutely YES!</h3>
                        <p className="text-lg font-medium opacity-90 leading-relaxed">
                            {advertorial.valueReinforcement?.priceAnchoring || "This is a must-have asset for anyone looking for the ultimate solution in this category."}
                        </p>
                    </div>
                </div>

                {/* Order Steps */}
                <section className="space-y-8 py-10">
                    <h3 className="text-3xl font-black text-center text-slate-900">How To Order?</h3>
                    <div className="grid md:grid-cols-2 gap-8">
                        {orderSteps.map((step: any, i: number) => (
                            <div key={i} className={`p-8 rounded-2xl border-2 space-y-4 ${i === 0 ? "bg-[#f0f9ff] border-blue-100" : "bg-slate-50 border-slate-100"}`}>
                                <div className={`${i === 0 ? "text-blue-600" : "text-slate-400"} font-black italic text-xl`}>{step.step}:</div>
                                <p className="text-lg font-bold text-slate-800">
                                    {step.linkUrl ? (
                                        <>
                                            Order from the <a href={targetUrl} className="text-blue-600 underline">{step.linkText}</a>
                                        </>
                                    ) : (
                                        step.title
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Final CTA */}
                <section className="bg-[#f8fafc] rounded-[3rem] p-8 md:p-16 text-center border border-slate-200 space-y-8">
                    <h3 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight">
                        {conversionClose.ctaText || "Get Yours Now!"}
                    </h3>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto">
                        {conversionClose.urgencyText || "Click the button below and order today before the special reader discount expires."}
                    </p>
                    <a href={targetUrl} className="inline-block bg-blue-600 text-white px-12 py-6 text-2xl font-black uppercase tracking-widest rounded-full shadow-xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
                        {conversionClose.ctaText || "Order Now!"}
                    </a>
                    <div className="flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest text-slate-400">
                        <div className="flex items-center gap-1"><ShieldCheck size={14} /> 100% Secure</div>
                        <div className="w-1 h-1 bg-slate-200 rounded-full" />
                        <div>{conversionClose.guaranteeText || "30-Day Money Back Guarantee"}</div>
                    </div>
                </section>

                {/* Comments Section */}
                <section className="pt-20 space-y-10">
                    <h4 className="text-xl font-black flex items-center gap-3">
                        <MessageCircle size={24} className="text-blue-600" />
                        Recent Comments ({comments.length})
                    </h4>
                    <div className="space-y-8">
                        {comments.map((c: any, i: number) => (
                            <div key={i} className="flex gap-4 border-b border-slate-100 pb-8 last:border-0">
                                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold shrink-0">
                                    {c.avatarUrl ? <img src={c.avatarUrl} className="w-full h-full rounded-full" /> : c.name[0]}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <span className="font-black text-sm">{c.name}</span>
                                        <span className="text-[10px] font-bold uppercase text-slate-300">{c.time}</span>
                                    </div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{c.text}</p>
                                    <div className="flex items-center gap-4 text-[10px] font-black uppercase text-blue-600/60">
                                        <button className="hover:text-blue-600 flex items-center gap-1"><ThumbsUp size={10} /> Like</button>
                                        <button className="hover:text-blue-600">Reply</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-100 py-12 px-6 text-center space-y-6">
                <img 
                    src={logoUrl} 
                    alt="Logo" 
                    className="h-8 mx-auto grayscale opacity-50"
                />
                <p className="max-w-2xl mx-auto text-[10px] font-black uppercase tracking-widest leading-loose text-slate-400">
                    {advertorial.ftcDisclosure || "This is an advertisement and not a news article, a blog or a consumer protection update."}
                </p>
                <div className="flex justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    <a href="#" className="hover:text-slate-600">Privacy Policy</a>
                    <a href="#" className="hover:text-slate-600">Terms of Service</a>
                    <a href="#" className="hover:text-slate-600">Contact Us</a>
                </div>
            </footer>

            {/* Sticky Bottom Bar (Mobile) */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 md:hidden z-50">
                <a href={targetUrl} className="block w-full bg-blue-600 text-white text-center py-4 font-black uppercase tracking-widest rounded-xl shadow-lg">
                    {conversionClose.ctaText || "Claim My Discount"}
                </a>
            </div>
        </div>
    );
}
