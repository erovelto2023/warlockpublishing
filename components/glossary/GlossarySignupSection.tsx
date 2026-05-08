"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, User, Sparkles, CheckCircle2 } from "lucide-react";
import { subscribeToMailingList } from "@/lib/actions/subscriber.actions";
import { useToast } from "@/components/ui/use-toast";

interface GlossarySignupSectionProps {
    term: string;
    image?: string;
}

export default function GlossarySignupSection({ term, image }: GlossarySignupSectionProps) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await subscribeToMailingList({
                email,
                name,
                signupUrl: typeof window !== 'undefined' ? window.location.href : '',
            });

            if (res.success) {
                setSubmitted(true);
                toast({
                    title: "Access Granted",
                    description: res.message,
                });
            } else {
                toast({
                    title: "Transmission Error",
                    description: res.message,
                    variant: "destructive",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to connect to the network.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <Card className="p-8 border-slate-200 dark:border-slate-800 bg-emerald-50 dark:bg-emerald-900/10 border-l-4 border-l-emerald-500 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="text-lg font-black uppercase tracking-tight text-slate-900 dark:text-white">
                        Welcome to the Circle
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
                        Your interest in <span className="font-bold text-emerald-600">"{term}"</span> has been noted. Check your inbox for the next transmission.
                    </p>
                </div>
            </Card>
        );
    }

    return (
        <Card className="p-0 overflow-hidden border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl border-l-4 border-l-indigo-500 group">
            {image && (
                <div className="aspect-[21/9] w-full overflow-hidden relative">
                    <img 
                        src={image} 
                        alt="Join the list" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex items-end p-6">
                        <p className="text-white text-xs font-black uppercase tracking-[0.2em]">Join My List</p>
                    </div>
                </div>
            )}
            
            <div className="p-6 space-y-6">
                {!image && (
                    <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
                            <Sparkles size={18} />
                        </div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white">
                            Join My List
                        </h3>
                    </div>
                )}

                <div className="space-y-4">
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                        Get exclusive strategic insights on <span className="text-indigo-600 dark:text-indigo-400 font-bold">"{term}"</span> and other high-authority concepts delivered straight to your terminal.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <Input 
                                placeholder="Your Name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-11 text-xs font-bold uppercase tracking-widest"
                                required
                            />
                        </div>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <Input 
                                type="email"
                                placeholder="Email Address" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="pl-10 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-11 text-xs font-bold uppercase tracking-widest"
                                required
                            />
                        </div>
                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-black dark:hover:bg-indigo-700 text-white h-12 font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-slate-200 dark:shadow-none"
                        >
                            {loading ? "Synchronizing..." : "Initialize Access"}
                        </Button>
                    </form>
                    
                    <p className="text-[9px] text-center text-slate-400 uppercase tracking-widest font-bold">
                        Secure Transmission &bull; No Spam &bull; Opt-out Anytime
                    </p>
                </div>
            </div>
        </Card>
    );
}
