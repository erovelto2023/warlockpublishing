import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';
import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-cyan-500 selection:text-white pt-32 pb-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
                        Get in <span className="text-pink-400">Touch</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Have a question or want to collaborate? We'd love to hear from you.
                    </p>
                </div>

                <div className="max-w-3xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-slate-800 rounded-2xl border border-slate-700 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 text-center">Send us a message</h2>
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}
