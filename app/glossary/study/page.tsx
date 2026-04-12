"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, Flame, Zap, Trophy, HelpCircle, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Flashcard {
    term: string;
    slug: string;
    description: string;
    category: string;
}

export default function StudyModePage() {
    const [allTerms, setAllTerms] = useState<Flashcard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [masteredSlugs, setMasteredSlugs] = useState<string[]>([]);
    
    // We'll use bookmarks-meta for the specific terms we want to study
    // Similar to platform6
    const [studyListOnly, setStudyListOnly] = useState(false);

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch all glossary terms for flashcard content
                const res = await fetch("/api/glossary-all");
                const data = await res.json();
                
                if (data.error) throw new Error(data.error);

                // Get bookmarks/mastered from localStorage
                const mastered = JSON.parse(localStorage.getItem("glossary-mastered") || "[]");
                setMasteredSlugs(mastered);
                
                setAllTerms(data);
                setLoading(false);
            } catch (err) {
                console.error("Study Mode failed to load:", err);
                setLoading(false);
            }
        };
        load();
    }, []);

    const toggleMastered = (slug: string) => {
        const updated = masteredSlugs.includes(slug)
            ? masteredSlugs.filter(s => s !== slug)
            : [...masteredSlugs, slug];
        
        localStorage.setItem("glossary-mastered", JSON.stringify(updated));
        setMasteredSlugs(updated);
    };

    if (loading) return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <p className="text-slate-400 font-bold tracking-widest uppercase text-xs">Initializing Mastery Protocol...</p>
            </div>
        </div>
    );

    if (allTerms.length === 0) {
        return (
            <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-3xl flex items-center justify-center mb-6">
                    <Bookmark size={40} />
                </div>
                <h1 className="text-3xl font-bold mb-4 text-white">Registry Empty</h1>
                <p className="text-slate-400 max-w-md mb-8">
                    No glossary terms were found in the research database. Please populate the registry to begin study mode.
                </p>
                <Link 
                    href="/glossary"
                    className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold uppercase tracking-widest text-xs transition-all shadow-xl shadow-blue-500/20"
                >
                    Return to Registry
                </Link>
            </div>
        );
    }

    const current = allTerms[currentIndex];
    const isMastered = masteredSlugs.includes(current.slug);

    return (
        <div className="min-h-screen bg-[#0f172a] p-6 pt-12 flex flex-col items-center overflow-x-hidden text-slate-200">
            {/* Header */}
            <div className="w-full max-w-4xl flex items-center justify-between mb-12">
                <Link 
                    href="/glossary"
                    className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors font-bold uppercase tracking-widest text-[10px] group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Exit Mastery Mode
                </Link>
                <div className="flex items-center gap-4">
                    <div className="text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-4 py-2 rounded-full uppercase tracking-[0.2em]">
                        Node {currentIndex + 1} <span className="mx-1 opacity-30">/</span> {allTerms.length}
                    </div>
                </div>
            </div>

            {/* Main Stage */}
            <div className="w-full max-w-2xl relative perspective-1000 h-[450px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -10 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-full h-full"
                    >
                        <div 
                            onClick={() => setIsFlipped(!isFlipped)}
                            className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                        >
                            {/* Front of Card */}
                            <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[3rem] border border-slate-800 shadow-2xl flex flex-col items-center justify-center p-12 overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8 opacity-5">
                                    <HelpCircle className="text-white" size={200} />
                                </div>
                                <div className="absolute top-12 left-12">
                                    <div className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.4em]">Strategic Concept</div>
                                </div>
                                
                                <h2 className="text-4xl md:text-5xl font-bold text-white text-center leading-tight tracking-tighter uppercase italic">
                                    {current.term}
                                </h2>
                                
                                <div className="mt-16 flex flex-col items-center gap-4">
                                    <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
                                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2">
                                        <Zap size={14} className="text-amber-500 fill-amber-500" />
                                        Initialize Protocol to Reveal
                                    </div>
                                </div>
                            </div>

                            {/* Back of Card */}
                            <div className="absolute inset-0 backface-hidden bg-blue-600 rounded-[3rem] p-12 border-4 border-blue-500 shadow-2xl rotate-y-180 flex flex-col items-center justify-center overflow-hidden">
                                <div className="absolute -bottom-20 -left-20 p-8 opacity-10">
                                    <Brain className="text-white" size={300} />
                                </div>
                                
                                <div className="text-[10px] font-bold text-blue-100 uppercase tracking-[0.4em] mb-10 absolute top-12">Operational Definition</div>
                                
                                <div className="text-xl md:text-2xl font-bold text-white text-center leading-relaxed relative z-10 italic">
                                    "{current.description}"
                                </div>
                                
                                <div className="mt-16 text-[9px] font-bold text-blue-100 uppercase tracking-[0.3em] flex items-center gap-2">
                                    Click to Return
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Tactical Controls */}
            <div className="w-full max-w-2xl mt-12 grid grid-cols-3 gap-6">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allTerms.length - 1));
                        setIsFlipped(false);
                    }}
                    className="flex flex-col items-center justify-center gap-3 py-6 bg-slate-900/50 rounded-[2rem] border border-slate-800 hover:bg-slate-800 transition-all group shadow-xl"
                >
                    <ChevronLeft className="text-slate-500 group-hover:-translate-x-1 transition-transform" size={20} />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Previous</span>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleMastered(current.slug);
                    }}
                    className={`flex flex-col items-center justify-center gap-3 py-6 rounded-[2.5rem] border transition-all shadow-2xl group ${
                        isMastered
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20"
                            : "bg-slate-900 border-slate-700 text-slate-500 hover:border-blue-500 hover:text-blue-500"
                    }`}
                >
                    <CheckCircle2 size={24} className={isMastered ? "animate-bounce" : ""} />
                    <span className="text-[9px] font-bold uppercase tracking-[0.2em]">{isMastered ? "Mastered" : "Learn Node"}</span>
                </button>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex((prev) => (prev < allTerms.length - 1 ? prev + 1 : 0));
                        setIsFlipped(false);
                    }}
                    className="flex flex-col items-center justify-center gap-3 py-6 bg-slate-900/50 rounded-[2rem] border border-slate-800 hover:bg-slate-800 transition-all group shadow-xl"
                >
                    <ChevronRight className="text-slate-500 group-hover:translate-x-1 transition-transform" size={20} />
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Next Node</span>
                </button>
            </div>

            {/* Performance Metrics */}
            <div className="w-full max-w-2xl mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-900/30 rounded-3xl border border-slate-800 flex items-center justify-between backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center border border-blue-500/20">
                            <RotateCcw size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Queue Size</div>
                            <div className="text-sm font-bold text-slate-300">Terms Remaining</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white italic">
                        {allTerms.length - masteredSlugs.filter(s => allTerms.some(t => t.slug === s)).length}
                    </div>
                </div>
                
                <div className="p-8 bg-slate-900/30 rounded-3xl border border-slate-800 flex items-center justify-between backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Mastery Rate</div>
                            <div className="text-sm font-bold text-slate-300">Overall Success</div>
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-white italic">
                        {Math.round((masteredSlugs.filter(s => allTerms.some(t => t.slug === s)).length / allTerms.length) * 100)}%
                    </div>
                </div>
            </div>


            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
}
