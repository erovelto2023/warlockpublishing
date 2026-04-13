'use client';

import React, { useState } from 'react';
import { subscribeToMailingList } from '@/lib/actions/subscriber.actions';
import { Loader2, ShieldCheck, Zap, AlertCircle } from 'lucide-react';

export default function NewsletterForm() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        try {
            const signupUrl = typeof window !== 'undefined' ? window.location.href : '';
            const result = await subscribeToMailingList(email, undefined, signupUrl);
            if (result.success) {
                setStatus('success');
                setMessage(result.message);
                setEmail('');
            } else {
                setStatus('error');
                setMessage(result.message);
            }
        } catch (err) {
            setStatus('error');
            setMessage('Terminal Error: Signal lost. Please try again.');
        }
    };

    return (
        <div className="max-w-lg mx-auto">
            <div className="relative group">
                {/* Visual Glow Effect */}
                <div className={`absolute -inset-1 rounded-2xl blur opacity-25 transition-all duration-500 ${
                    status === 'success' ? 'bg-emerald-500 opacity-60' : 
                    status === 'error' ? 'bg-red-500 opacity-60' : 
                    'bg-secondary/20 group-focus-within:opacity-50'
                }`}></div>
                
                <form 
                    onSubmit={handleSubmit}
                    className={`relative flex flex-col sm:flex-row gap-0 bg-neutral-900 border rounded-2xl overflow-hidden transition-all duration-300 ${
                        status === 'success' ? 'border-emerald-500/50' : 
                        status === 'error' ? 'border-red-500/50' : 
                        'border-white/10 focus-within:border-secondary/50'
                    }`}
                >
                    <input
                        type="email"
                        required
                        placeholder="Enter your transmission address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading' || status === 'success'}
                        className="flex-1 bg-transparent text-white px-8 py-5 focus:outline-none text-sm font-medium placeholder-neutral-600 disabled:opacity-50"
                    />
                    <button 
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className={`px-10 py-5 font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 whitespace-nowrap ${
                            status === 'success' ? 'bg-emerald-500 text-white' : 
                            status === 'error' ? 'bg-red-500 text-white' : 
                            'bg-secondary text-black hover:bg-white disabled:opacity-80'
                        }`}
                    >
                        {status === 'loading' ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Synchronizing...
                            </>
                        ) : status === 'success' ? (
                            <>
                                <ShieldCheck className="w-4 h-4" />
                                Synchronized
                            </>
                        ) : (
                            '👉 Alert Me When It Drops'
                        )}
                    </button>
                </form>
            </div>

            {/* Status Messages */}
            <div className="mt-6 min-h-[24px]">
                {status === 'success' && (
                    <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest animate-in fade-in slide-in-from-top-1">
                        {message}
                    </p>
                )}
                {status === 'error' && (
                    <div className="flex items-center justify-center gap-2 text-red-400 text-[10px] font-bold uppercase tracking-widest animate-in shake duration-500">
                        <AlertCircle className="w-3 h-3" />
                        {message}
                    </div>
                )}
                {status === 'idle' && (
                    <p className="text-neutral-600 text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4">
                        Secure Encryption <span className="w-1 h-1 rounded-full bg-neutral-800"></span> 
                        Null Latency <span className="w-1 h-1 rounded-full bg-neutral-800"></span> 
                        No Infiltration
                    </p>
                )}
            </div>
        </div>
    );
}
