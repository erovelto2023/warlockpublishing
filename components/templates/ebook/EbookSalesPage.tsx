import React from 'react';

interface EbookSalesPageProps {
    data: any;
}

export function EbookSalesPage({ data }: EbookSalesPageProps) {
    // Helper to get block data safely
    const getBlock = (id: string) => {
        if (!data || !Array.isArray(data.blocks)) return null;
        const block = data.blocks.find((b: any) => b.id === id);
        return block?.enabled ? (block.data || {}) : null;
    };

    const navbar = getBlock('navbar');
    const hero = getBlock('hero');
    const socialProofLogos = getBlock('socialProofLogos');
    const pain = getBlock('pain');
    const promise = getBlock('promise');
    const framework = getBlock('framework');
    const chapters = getBlock('chapters');
    const reviews = getBlock('reviews');
    const author = getBlock('author');
    const bonuses = getBlock('bonuses');
    const pricing = getBlock('pricing');
    const faq = getBlock('faq');
    const footer = getBlock('footer');

    // New blocks for specific templates
    const synopsis = getBlock('synopsis');
    const problem = getBlock('problem');
    const solution = getBlock('solution');
    const gallery = getBlock('gallery');
    const preview = getBlock('preview');

    const renderIcon = (iconName: string) => {
        switch (iconName) {
            case 'clock':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>;
            case 'alert':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>;
            case 'zap':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
            case 'shield':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>;
            case 'user':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>;
            case 'star':
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>;
            default:
                return <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>;
        }
    };


    return (
        <div className="font-sans text-slate-800 bg-white antialiased selection:bg-blue-100 selection:text-blue-700">
            {/* Navigation */}
            {navbar && (
                <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between items-center h-16">
                            <div className="flex items-center gap-2">
                                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                <span className="font-bold text-xl tracking-tight text-slate-900">{navbar.brandName}</span>
                            </div>
                            <div className="hidden md:flex items-center space-x-8">
                                <a href="#pain" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">{navbar.link1}</a>
                                <a href="#chapters" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">{navbar.link2}</a>
                                <a href="#bonuses" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition">{navbar.link3}</a>
                                <a href="#pricing" className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 rounded-full hover:bg-slate-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">{navbar.ctaText}</a>
                            </div>
                        </div>
                    </div>
                </nav>
            )}

            {/* Hero Section */}
            {hero && (
                <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden bg-slate-50">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-100 blur-3xl opacity-50"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-purple-100 blur-3xl opacity-50"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
                            <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                                <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wide mb-6 border border-blue-100">
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></span>
                                    {hero.badgeText}
                                </div>
                                <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                                    {hero.headline}
                                </h1>
                                <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                                    {hero.subheadline}
                                </p>

                                <ul className="space-y-3 mb-10 text-left mx-auto lg:mx-0 max-w-md">
                                    {[hero.bullet1, hero.bullet2, hero.bullet3].filter(Boolean).map((bullet: string, i: number) => (
                                        <li key={i} className="flex items-start">
                                            <svg className="flex-shrink-0 h-6 w-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span className="ml-3 text-slate-700 font-medium">{bullet}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-center">
                                    <a href={hero.checkoutUrl || "#pricing"} className="w-full sm:w-auto px-8 py-4 text-base font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2">
                                        {hero.ctaText}
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                                    </a>
                                    <span className="text-sm font-semibold text-slate-500">
                                        <span className="text-green-600">●</span> Instant Download
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center lg:justify-end">
                                <div className="book-container p-10 scale-90 md:scale-100 relative perspective-[1000px]">
                                    <div className="book w-[260px] h-[380px] relative preserve-3d rotate-y-[-25deg] rotate-x-[5deg] transition-transform duration-500 hover:rotate-y-[-15deg] hover:rotate-x-[5deg] hover:-translate-y-2 shadow-2xl">
                                        <div className="book-front absolute inset-0 bg-slate-900 rounded-r-lg rounded-l-sm translate-z-[25px] z-20 border-l-4 border-slate-700 overflow-hidden">
                                            {hero.bookCoverImage ? (
                                                <img
                                                    src={hero.bookCoverImage}
                                                    alt="Book Cover"
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-800 text-slate-500">
                                                    No Cover
                                                </div>
                                            )}
                                        </div>
                                        <div className="book-side absolute top-1 left-0 w-[50px] h-[372px] bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400 rotate-y-[-90deg] translate-z-[25px] rounded-sm origin-left"></div>
                                        <div className="book-pages absolute top-1.5 right-0 w-[46px] h-[368px] bg-slate-100 rotate-y-[90deg] translate-z-[-23px] origin-right bg-[repeating-linear-gradient(to_right,#f1f5f9_0px,#e2e8f0_2px,#f1f5f9_4px)]"></div>
                                    </div>
                                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-4 bg-black/20 blur-xl rounded-full"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Synopsis Section (Fiction) */}
            {synopsis && (
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">{synopsis.title}</h2>
                        <div className="prose prose-lg mx-auto text-slate-600">
                            <p>{typeof synopsis.description === 'string' ? synopsis.description : ""}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Problem Section (Non-Fiction) */}
            {problem && (
                <section className="py-20 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">{problem.title}</h2>
                        <div className="prose prose-lg mx-auto text-slate-600">
                            <p>{typeof problem.text === 'string' ? problem.text : ""}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Solution Section (Non-Fiction) */}
            {solution && (
                <section className="py-20 bg-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">{solution.title}</h2>
                        <div className="prose prose-lg mx-auto text-slate-600">
                            <p>{typeof solution.text === 'string' ? solution.text : ""}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery/Preview Section (Coloring/Children) */}
            {(gallery || preview) && (
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-slate-900">{(gallery || preview).title}</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-8">
                            {[(gallery || preview).img1, (gallery || preview).img2, (gallery || preview).img3].filter(Boolean).map((img: string, i: number) => (
                                <div key={i} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 bg-white">
                                    <img src={img} alt={`Preview ${i + 1}`} className="w-full h-auto object-cover" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Social Proof Logos */}
            {socialProofLogos && (
                <div className="py-10 border-y border-slate-100 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">{socialProofLogos.title}</p>
                        <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition duration-500">
                            <div className="flex items-center font-bold text-xl text-slate-800 gap-2"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2-1-2-1-2 1 2 1zm0-3.5L6 7l6 3 6-3-6-3.5z" /></svg> {socialProofLogos.logo1 || "TECHDAILY"}</div>
                            <div className="flex items-center font-bold text-xl text-slate-800 gap-2"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" /></svg> {socialProofLogos.logo2 || "PRODUCTHUNT"}</div>
                            <div className="flex items-center font-bold text-xl text-slate-800 gap-2"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg> {socialProofLogos.logo3 || "CIRCLE"}</div>
                            <div className="flex items-center font-bold text-xl text-slate-800 gap-2"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg> {socialProofLogos.logo4 || "STARTUP.IO"}</div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pain Section */}
            {pain && (
                <section id="pain" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-3xl mx-auto mb-16 text-center">
                            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-6">{pain.title}</h2>
                            <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                                <p>{pain.p1}</p>
                                <p><strong className="text-slate-900">{pain.p2}</strong></p>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition duration-300">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center text-red-600 mb-6">
                                    {renderIcon(pain.card1Icon || "clock")}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{pain.card1Title}</h3>
                                <p className="text-slate-600">{pain.card1Desc}</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-lg transition duration-300">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 mb-6">
                                    {renderIcon(pain.card2Icon || "alert")}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{pain.card2Title}</h3>
                                <p className="text-slate-600">{pain.card2Desc}</p>
                            </div>
                            <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100 hover:shadow-lg transition duration-300">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-6">
                                    {renderIcon(pain.card3Icon || "zap")}
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{pain.card3Title}</h3>
                                <p className="text-slate-600">{pain.card3Desc}</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Promise Section */}
            {promise && (
                <section className="py-20 bg-slate-900 text-white border-b border-slate-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-2xl font-bold text-green-400 mb-6">{promise.forTitle}</h3>
                                <ul className="space-y-4">
                                    {[promise.for1, promise.for2, promise.for3].filter(Boolean).map((item: any, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                            <span className="text-slate-300 text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-red-400 mb-6">{promise.notForTitle}</h3>
                                <ul className="space-y-4">
                                    {[promise.notFor1, promise.notFor2, promise.notFor3].filter(Boolean).map((item: any, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            <span className="text-slate-300 text-lg">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Framework Section */}
            {framework && (
                <section className="py-20 bg-slate-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="text-3xl font-bold text-slate-900 mb-12">{framework.title}</h2>
                        <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-4 relative">
                            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-1 bg-slate-200 -z-10 -translate-y-1/2"></div>

                            <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/3">
                                <div className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white">1</div>
                                <h3 className="text-xl font-bold mb-2">{framework.step1Title}</h3>
                                <p className="text-sm text-slate-600">{framework.step1Desc}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/3">
                                <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white">2</div>
                                <h3 className="text-xl font-bold mb-2">{framework.step2Title}</h3>
                                <p className="text-sm text-slate-600">{framework.step2Desc}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-md w-full md:w-1/3">
                                <div className="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4 border-4 border-white">3</div>
                                <h3 className="text-xl font-bold mb-2">{framework.step3Title}</h3>
                                <p className="text-sm text-slate-600">{framework.step3Desc}</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Chapters Section */}
            {chapters && (
                <section id="chapters" className="py-20 bg-slate-900 text-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">{chapters.title}</h2>
                                <p className="text-slate-400 mb-8 text-lg">{chapters.subtitle}</p>

                                <div className="space-y-4">
                                    {[
                                        { title: chapters.ch1Title, desc: chapters.ch1Desc, num: "01" },
                                        { title: chapters.ch2Title, desc: chapters.ch2Desc, num: "02" },
                                        { title: chapters.ch3Title, desc: chapters.ch3Desc, num: "03" },
                                        { title: chapters.ch4Title, desc: chapters.ch4Desc, num: "04" },
                                    ].map((ch, i) => (
                                        <div key={i} className="flex gap-4 items-start p-4 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition">
                                            <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded bg-blue-600 font-bold text-sm">{ch.num}</span>
                                            <div>
                                                <h4 className="font-bold text-lg">{ch.title}</h4>
                                                <p className="text-sm text-slate-400">{ch.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative hidden lg:block">
                                <div className="bg-white text-slate-800 rounded-xl shadow-2xl p-8 rotate-2 hover:rotate-0 transition duration-500">
                                    <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-400"></div>
                                        <span className="ml-auto text-xs font-mono text-slate-400">Chapter 03 Preview</span>
                                    </div>
                                    <div className="prose prose-slate">
                                        <h3 className="text-2xl font-bold mb-4">{chapters.previewTitle || "The 90-Minute Cycle"}</h3>
                                        <p className="mb-4">{chapters.previewText || "Our brains are not designed for 8-hour marathons. They operate in ultradian rhythms..."}</p>
                                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500 mb-4">
                                            <p className="font-medium text-blue-800">Key Insight:</p>
                                            <p className="text-sm text-blue-700">{chapters.previewKeyInsight || "Rest is not the opposite of work. It is a necessary partner to it. Without high-quality rest, high-quality work is impossible."}</p>
                                        </div>
                                        <p className="text-slate-500">...</p>
                                    </div>
                                    <div className="absolute -z-10 top-4 -right-4 w-full h-full bg-blue-600 rounded-xl opacity-20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Reviews Section */}
            {reviews && (
                <section className="py-24 bg-white border-b border-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center max-w-3xl mx-auto mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl mb-4">{reviews.title}</h2>
                            <p className="text-lg text-slate-600">{reviews.subtitle}</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { text: reviews.rev1Text, name: reviews.rev1Name, role: reviews.rev1Role, color: "blue" },
                                { text: reviews.rev2Text, name: reviews.rev2Name, role: reviews.rev2Role, color: "purple" },
                                { text: reviews.rev3Text, name: reviews.rev3Name, role: reviews.rev3Role, color: "emerald" },
                            ].filter(r => r.text && r.name).map((rev, i) => (
                                <div key={i} className="p-8 bg-slate-50 rounded-2xl relative hover:-translate-y-1 transition duration-300">
                                    <div className="flex gap-1 text-yellow-400 mb-4">
                                        {[1, 2, 3, 4, 5].map((_, j) => (
                                            <svg key={j} className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        ))}
                                    </div>
                                    <p className="text-slate-700 mb-6 leading-relaxed">{rev.text}</p>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-12 h-12 rounded-full bg-${rev.color}-100 flex items-center justify-center text-${rev.color}-600 font-bold`}>
                                            {rev.name.split(' ').map((n: string) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{rev.name}</div>
                                            <div className="text-xs text-slate-500 font-medium uppercase tracking-wide">{rev.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Author Section */}
            {author && (
                <section id="author" className="py-20 bg-blue-50">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="flex-shrink-0">
                                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-slate-200 to-slate-400 flex items-center justify-center shadow-lg border-4 border-white overflow-hidden relative">
                                    {author.authorImage ? (
                                        <img
                                            src={author.authorImage}
                                            alt={author.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <svg className="w-full h-full text-slate-500 absolute bottom-[-10%]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                                    )}
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h2 className="text-3xl font-bold text-slate-900 mb-3">{author.title}</h2>
                                <p className="text-lg text-blue-600 font-medium mb-4">{author.role}</p>
                                <p className="text-slate-600 mb-6 leading-relaxed">{author.bio}</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Bonuses Section */}
            {bonuses && (
                <section id="bonuses" className="py-20 bg-slate-50">
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm">Limited Time Offer</span>
                            <h2 className="text-3xl font-bold text-slate-900 mt-2">{bonuses.title}</h2>
                            <p className="text-slate-600 mt-4">{bonuses.subtitle}</p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="w-16 h-16 bg-purple-100 rounded-lg flex-shrink-0 flex items-center justify-center text-purple-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 3-2 3-2zm0 0v-6.2M9 19l12-3m-6 6a9 9 0 01-9-9 9 9 0 0118 0z"></path></svg>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Bonus #1 (Value {bonuses.bonus1Value})</div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">{bonuses.bonus1Title}</h4>
                                    <p className="text-sm text-slate-600">{bonuses.bonus1Desc}</p>
                                </div>
                            </div>

                            <div className="flex gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
                                <div className="w-16 h-16 bg-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center text-blue-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-slate-400 uppercase mb-1">Bonus #2 (Value {bonuses.bonus2Value})</div>
                                    <h4 className="text-xl font-bold text-slate-900 mb-2">{bonuses.bonus2Title}</h4>
                                    <p className="text-sm text-slate-600">{bonuses.bonus2Desc}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Pricing Section */}
            {pricing && (
                <section id="pricing" className="py-24 bg-white relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">{pricing.title}</h2>
                            <p className="text-lg text-slate-600">{pricing.subtitle}</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            <div className="rounded-2xl border border-slate-200 p-8 hover:border-blue-300 transition">
                                <h3 className="text-lg font-bold text-slate-900">{pricing.tier1Name}</h3>
                                <div className="mt-4 flex items-baseline text-slate-900">
                                    <span className="text-4xl font-extrabold tracking-tight">{pricing.tier1Price}</span>
                                </div>
                                <p className="mt-4 text-sm text-slate-500">The essential guide to restarting your brain.</p>
                                <ul role="list" className="mt-6 space-y-4 mb-8">
                                    <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">PDF & ePub Formats</span></li>
                                    <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">Lifetime Updates</span></li>
                                </ul>
                                <a href={pricing.tier1Link || hero?.checkoutUrl || "#"} className="block w-full bg-slate-100 border border-transparent rounded-lg py-3 px-4 text-center font-bold text-slate-800 hover:bg-slate-200 transition">Get Basic ({pricing.tier1Price})</a>
                            </div>

                            <div className="relative rounded-2xl border-2 border-blue-500 bg-white p-8 shadow-2xl scale-105 z-10">
                                <div className="absolute top-0 right-0 -mt-4 mr-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md">Best Value</div>
                                <h3 className="text-lg font-bold text-slate-900">{pricing.tier2Name}</h3>
                                <div className="mt-4 flex items-baseline text-slate-900">
                                    <span className="text-4xl font-extrabold tracking-tight">{pricing.tier2Price}</span>
                                    <span className="ml-2 text-xl text-slate-400 line-through">{pricing.tier2OldPrice}</span>
                                </div>
                                <p className="mt-4 text-sm text-slate-500">The full toolkit for rapid transformation.</p>
                                <ul role="list" className="mt-6 space-y-4 mb-8">
                                    <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-900 font-medium">The Ebook (PDF/ePub)</span></li>
                                    <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-900 font-medium">Audiobook Version (MP3)</span></li>
                                    <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-900 font-medium">Notion Dashboard Template</span></li>
                                    <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-900 font-medium">30-Day Action Plan</span></li>
                                </ul>
                                <a href={pricing.tier2Link || hero?.checkoutUrl || "#"} className="block w-full bg-blue-600 border border-transparent rounded-lg py-4 px-4 text-center font-bold text-white hover:bg-blue-700 transition shadow-lg shadow-blue-500/30">Get Complete Bundle ({pricing.tier2Price})</a>

                                <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
                                    30-Day Money-Back Guarantee
                                </div>
                            </div>

                            <div className="rounded-2xl border border-slate-200 p-8 hover:border-blue-300 transition">
                                <h3 className="text-lg font-bold text-slate-900">{pricing.tier3Name}</h3>
                                <div className="mt-4 flex items-baseline text-slate-900">
                                    <span className="text-4xl font-extrabold tracking-tight">{pricing.tier3Price}</span>
                                </div>
                                <p className="mt-4 text-sm text-slate-500">For agencies and startups.</p>
                                <ul role="list" className="mt-6 space-y-4 mb-8">
                                    <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">10 Licenses</span></li>
                                    <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">Team Workshop Recording</span></li>
                                    <li className="flex items-start"><svg className="flex-shrink-0 h-5 w-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg><span className="ml-3 text-sm text-slate-600">Admin Dashboard</span></li>
                                </ul>
                                <a href={pricing.tier3Link || hero?.checkoutUrl || "#"} className="block w-full bg-slate-100 border border-transparent rounded-lg py-3 px-4 text-center font-bold text-slate-800 hover:bg-slate-200 transition">Get Team License ({pricing.tier3Price})</a>
                            </div>
                        </div>

                        <div className="mt-12 flex justify-center items-center gap-6 opacity-40 grayscale">
                            <div className="flex items-center gap-1 font-bold"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" ry="2"></rect><path stroke="white" strokeWidth="2" d="M2 10h20"></path></svg> VISA</div>
                            <div className="flex items-center gap-1 font-bold"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><rect width="20" height="14" x="2" y="5" rx="2" ry="2"></rect><circle cx="15" cy="12" r="3" fill="white"></circle><circle cx="9" cy="12" r="3" fill="white"></circle></svg> MASTERCARD</div>
                            <div className="flex items-center gap-1 font-bold"><svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M7 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM7.1 5h9.8c1.1 0 2 .9 2 2v4H5.1V7c0-1.1.9-2 2-2z"></path></svg> STRIPE</div>
                            <div className="flex items-center gap-1 font-bold"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 0 002-2v-6a2 0 00-2-2H6a2 0 00-2 2v6a2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg> 256-BIT SSL</div>
                        </div>
                    </div>
                </section>
            )}

            {/* FAQ Section */}
            {faq && (
                <section id="faq" className="py-20 bg-slate-50">
                    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-center mb-12 text-slate-900">{faq.title}</h2>

                        <div className="space-y-4">
                            {[
                                { q: faq.q1, a: faq.a1 },
                                { q: faq.q2, a: faq.a2 },
                                { q: faq.q3, a: faq.a3 },
                            ].map((item, i) => (
                                <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                                    <div className="w-full px-6 py-4 text-left flex justify-between items-center">
                                        <span className="font-medium text-slate-900">{item.q}</span>
                                    </div>
                                    <div className="px-6 pb-4 text-slate-600 text-sm leading-relaxed">
                                        {item.a}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            {footer && (
                <footer className="bg-slate-900 text-slate-400 py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div className="col-span-1 md:col-span-1">
                                <div className="flex items-center gap-2 mb-4">
                                    <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                    <span className="font-bold text-white text-lg">{navbar?.brandName || "FlowState"}</span>
                                </div>
                                <p className="text-sm">{footer.tagline || "Helping you do your best work."}</p>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-4">Product</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition">The Ebook</a></li>
                                    <li><a href="#" className="hover:text-white transition">Video Course</a></li>
                                    <li><a href="#" className="hover:text-white transition">Coaching</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-4">Company</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition">About</a></li>
                                    <li><a href="#" className="hover:text-white transition">Blog</a></li>
                                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="text-white font-bold mb-4">Legal</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><a href="#" className="hover:text-white transition">Privacy Policy</a></li>
                                    <li><a href="#" className="hover:text-white transition">Terms of Service</a></li>
                                    <li><a href="#" className="hover:text-white transition">Refund Policy</a></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
                            <p>&copy; {new Date().getFullYear()} {footer.copyright || navbar?.brandName || "FlowState Media"}. All rights reserved.</p>
                            <div className="flex space-x-6 mt-4 md:mt-0">
                                {footer.twitterUrl && footer.twitterUrl !== '#' && (
                                    <a href={footer.twitterUrl} className="hover:text-white"><span className="sr-only">Twitter</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg></a>
                                )}
                                {footer.instagramUrl && footer.instagramUrl !== '#' && (
                                    <a href={footer.instagramUrl} className="hover:text-white"><span className="sr-only">Instagram</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 014.443 2.52c.636-.247 1.363-.416 2.427-.465C7.902 2.013 8.256 2 12.315 2zm-2.008 2H8.697c-2.643 0-2.987.012-4.043.06-1.064.049-1.791.218-2.427.465a2.902 2.902 0 00-1.056.685 2.902 2.902 0 00-.685 1.056c-.247.636-.416 1.363-.465 2.427-.047 1.024-.06 1.379-.06 3.808v.63c0 2.43.013 2.784.06 3.808.049 1.064.218 1.791.465 2.427a2.902 2.902 0 00.685 1.056 2.902 2.902 0 001.056.685c.636.247 1.363.416 2.427.465 1.024.047 1.379.06 3.808.06h.63c2.43 0 2.784-.013 3.808-.06 1.064-.049 1.791-.218 2.427-.465a2.902 2.902 0 001.056-.685 2.902 2.902 0 00.685-1.056c.247-.636.416-1.363.465-2.427.047-1.024.06-1.379.06-3.808v-.63c0-2.43-.013-2.784-.06-3.808-.049-1.064-.218-1.791-.465-2.427a2.902 2.902 0 00-.685-1.056 2.902 2.902 0 00-1.056-.685c-.636-.247-1.363-.416-2.427-.465-1.067-.048-1.407-.06-4.123-.06h-.08zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 2a3.135 3.135 0 100 6.27 3.135 3.135 0 000-6.27zM16.935 5.4a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" /></svg></a>
                                )}
                                {footer.linkedinUrl && footer.linkedinUrl !== '#' && (
                                    <a href={footer.linkedinUrl} className="hover:text-white"><span className="sr-only">LinkedIn</span><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" /></svg></a>
                                )}
                            </div>
                        </div>
                    </div>
                </footer>
            )}

            {/* Tracking Code */}
            {/* Tracking Code */}
            {hero?.trackingCodeBody && (
                <div dangerouslySetInnerHTML={{ __html: hero.trackingCodeBody }} />
            )}
        </div>
    );
}
