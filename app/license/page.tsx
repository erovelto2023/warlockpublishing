import React from 'react';

export default function LicensePage() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
                    License <span className="text-pink-400">Agreement</span>
                </h1>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="lead text-xl text-slate-400 mb-8">
                        This License Agreement governs your use of digital products purchased from Warlock Publishing.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Grant of License</h2>
                    <p>
                        Upon purchase of a digital product, Warlock Publishing grants you a non-exclusive, non-transferable, revocable license to use the product in accordance with the terms set forth in this agreement.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. Permitted Uses</h2>
                    <p>
                        You may:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Use the product for personal or commercial projects as specified in the product description.</li>
                        <li>Modify the product to suit your needs.</li>
                        <li>Use the product in an unlimited number of projects, unless otherwise stated.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Prohibited Uses</h2>
                    <p>
                        You may not:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Resell, redistribute, or sublicense the product as-is or with minor modifications.</li>
                        <li>Claim intellectual property rights to the product.</li>
                        <li>Use the product in a way that competes with Warlock Publishing.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. Private Label Rights (PLR)</h2>
                    <p>
                        For products designated as "Private Label Rights" (PLR), specific terms apply. Generally, you are granted the right to rebrand and resell the content as your own, subject to any specific restrictions listed on the product page.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">5. Termination</h2>
                    <p>
                        This license is effective until terminated. Your rights under this license will terminate automatically without notice from Warlock Publishing if you fail to comply with any term(s) of this agreement. Upon termination of the license, you shall cease all use of the product and destroy all copies, full or partial, of the product.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">6. Disclaimer of Warranties</h2>
                    <p>
                        The product is provided "AS IS", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement.
                    </p>
                </div>
            </div>
        </div>
    );
}
