import React from 'react';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
                    Privacy <span className="text-cyan-400">Policy</span>
                </h1>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="lead text-xl text-slate-400 mb-8">
                        At Warlock Publishing, we value your privacy and are committed to protecting your personal data. This policy outlines how we collect, use, and safeguard your information.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Information We Collect</h2>
                    <p>
                        We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, payment information, and any other details you choose to provide.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. How We Use Your Information</h2>
                    <p>
                        We use the information we collect to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 mb-6">
                        <li>Provide, maintain, and improve our services.</li>
                        <li>Process transactions and send related information, including confirmations and receipts.</li>
                        <li>Send you technical notices, updates, security alerts, and support messages.</li>
                        <li>Respond to your comments, questions, and requests.</li>
                    </ul>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Data Security</h2>
                    <p>
                        We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. Cookies</h2>
                    <p>
                        We use cookies and similar tracking technologies to track the activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">5. Changes to This Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">6. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@warlockpublishing.com.
                    </p>
                </div>
            </div>
        </div>
    );
}
