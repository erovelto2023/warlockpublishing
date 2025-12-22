import React from 'react';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white pt-32 pb-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 tracking-tight">
                    Terms of <span className="text-purple-400">Service</span>
                </h1>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="lead text-xl text-slate-400 mb-8">
                        Please read these Terms of Service carefully before using the Warlock Publishing website and services.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By accessing or using our service, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">2. Accounts</h2>
                    <p>
                        When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">3. Intellectual Property</h2>
                    <p>
                        The service and its original content, features, and functionality are and will remain the exclusive property of Warlock Publishing and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">4. Purchases</h2>
                    <p>
                        If you wish to purchase any product or service made available through the Service, you may be asked to supply certain information relevant to your Purchase including, without limitation, your credit card number, the expiration date of your credit card, your billing address, and your shipping information.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">5. Termination</h2>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">6. Limitation of Liability</h2>
                    <p>
                        In no event shall Warlock Publishing, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">7. Changes</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
                    </p>

                    <h2 className="text-2xl font-bold text-white mt-12 mb-4">8. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at support@warlockpublishing.com.
                    </p>
                </div>
            </div>
        </div>
    );
}
