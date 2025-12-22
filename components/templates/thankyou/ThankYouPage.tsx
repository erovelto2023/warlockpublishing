"use client"

import React from 'react';

interface ThankYouPageProps {
    data: any;
}

export function ThankYouPage({ data }: ThankYouPageProps) {
    // Helper to get block data safely
    const getBlock = (id: string) => {
        const block = data?.blocks?.find((b: any) => b.id === id);
        return block?.enabled ? block.data : null;
    };

    const header = getBlock('header');
    const mainProduct = getBlock('mainProduct');
    const additionalItems = getBlock('additionalItems');
    const footer = getBlock('footer');

    return (
        <div className="font-sans text-slate-800 bg-slate-50 min-h-screen flex flex-col items-center justify-center p-4 py-12">
            {/* Main Container */}
            <div className="max-w-4xl w-full bg-white rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">

                {/* Header Section */}
                {header && (
                    <div className="text-center pt-10 pb-8 px-8 border-b border-slate-100">
                        <div className="checkmark-circle inline-block mb-5 relative w-20 h-20">
                            <div className="background absolute w-20 h-20 rounded-full bg-emerald-100"></div>
                            <div className="checkmark draw absolute top-10 left-7 w-5 h-10 border-r-4 border-t-4 border-emerald-500 rotate-[135deg] origin-top-left opacity-0 animate-[checkmark_1s_ease_forwards_0.1s]"></div>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-800 mb-2">{header.title}</h1>
                        <p className="text-slate-500 text-lg">{header.subtitle}</p>
                    </div>
                )}

                {/* Main Content Area */}
                <div className="p-8 bg-slate-50">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Your Items</h3>

                    {/* 1. Main Downloadable Product (Wide Card) */}
                    {mainProduct && (
                        <div className="product-card bg-white rounded-xl border border-slate-200 p-6 flex flex-col md:flex-row gap-6 shadow-sm mb-6 relative overflow-hidden hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                            <div className="absolute top-0 right-0 bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-bl-lg">READY FOR DOWNLOAD</div>

                            {/* Icon */}
                            <div className="w-20 h-20 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mx-auto md:mx-0">
                                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-xl font-bold text-slate-800">{mainProduct.productName}</h2>
                                <p className="text-slate-500 text-sm mt-1 mb-4">{mainProduct.productDesc}</p>

                                {/* License Key Mini-Section */}
                                {mainProduct.licenseKey && (
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200 mb-4 flex flex-col sm:flex-row items-center gap-3">
                                        <span className="text-xs font-semibold text-slate-500 uppercase">License Key:</span>
                                        <code className="font-mono text-slate-700 font-bold text-sm flex-1 select-all">{mainProduct.licenseKey}</code>
                                    </div>
                                )}

                                <a href={mainProduct.downloadUrl || "#"} className="w-full md:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all shadow-md shadow-blue-200 flex items-center justify-center gap-2 inline-flex">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                    {mainProduct.buttonText}
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Grid for Additional Items */}
                    {additionalItems && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Item 1 */}
                            <div className="product-card bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm h-full hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                                <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4 text-purple-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 14l9-5-9-5-9 5 9 5z"></path><path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"></path></svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{additionalItems.item1Title}</h3>
                                <p className="text-slate-500 text-sm mb-6 flex-1">{additionalItems.item1Desc}</p>
                                <a href={additionalItems.item1Url || "#"} className="w-full px-4 py-2 bg-white border-2 border-purple-600 text-purple-700 hover:bg-purple-50 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                                    {additionalItems.item1BtnText}
                                </a>
                            </div>

                            {/* Item 2 */}
                            <div className="product-card bg-white rounded-xl border border-slate-200 p-6 flex flex-col items-center text-center shadow-sm h-full hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
                                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-orange-600">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                </div>
                                <h3 className="text-lg font-bold text-slate-800 mb-2">{additionalItems.item2Title}</h3>
                                <p className="text-slate-500 text-sm mb-6 flex-1">{additionalItems.item2Desc}</p>
                                <a href={additionalItems.item2Url || "#"} className="w-full px-4 py-2 bg-white border-2 border-orange-500 text-orange-600 hover:bg-orange-50 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2">
                                    {additionalItems.item2BtnText}
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="bg-white p-6 text-center border-t border-slate-100">
                        <p className="text-slate-400 text-sm">{footer.helpText} <a href={footer.supportLink || "#"} className="text-blue-600 hover:underline">Contact Support</a></p>
                        <p className="text-xs text-slate-300 mt-2">Order #{Math.floor(Math.random() * 1000000)} • {new Date().toLocaleDateString()}</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                @keyframes checkmark {
                    0% { height: 0; width: 0; opacity: 1; }
                    20% { height: 0; width: 20px; opacity: 1; }
                    40% { height: 40px; width: 20px; opacity: 1; }
                    100% { height: 40px; width: 20px; opacity: 1; }
                }
            `}</style>
        </div>
    );
}
