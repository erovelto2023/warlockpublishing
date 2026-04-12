"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Trophy, RefreshCw, CheckCircle2, XCircle, ChevronRight, Brain, ArrowLeft, Bookmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Term {
    slug: string;
    term: string;
    shortDefinition: string;
    category?: string;
    contentLevel?: string;
}

interface Question {
    term: Term;
    choices: string[];
    correctIndex: number;
}

function buildQuiz(terms: Term[], count = 10): Question[] {
    const pool = [...terms].sort(() => Math.random() - 0.5).slice(0, Math.min(count * 3, terms.length));
    const questions: Question[] = [];

    for (const term of pool.slice(0, count)) {
        const distractors = pool
            .filter(t => t.slug !== term.slug && t.shortDefinition)
            .sort(() => Math.random() - 0.5)
            .slice(0, 3)
            .map(t => t.shortDefinition);

        if (distractors.length < 3) continue;
        const correctIndex = Math.floor(Math.random() * 4);
        const choices = [...distractors];
        choices.splice(correctIndex, 0, term.shortDefinition);
        questions.push({ term, choices, correctIndex });
    }

    return questions;
}

export default function GlossaryQuizClient({ terms }: { terms: Term[] }) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [current, setCurrent] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [done, setDone] = useState(false);
    const [answers, setAnswers] = useState<boolean[]>([]);
    const [difficulty, setDifficulty] = useState<string>("all");

    const startQuiz = useCallback(() => {
        const filtered = difficulty === "all" ? terms : terms.filter(t => t.contentLevel === difficulty);
        const q = buildQuiz(filtered.filter(t => t.shortDefinition));
        setQuestions(q);
        setCurrent(0);
        setSelected(null);
        setScore(0);
        setDone(false);
        setAnswers([]);
    }, [terms, difficulty]);

    useEffect(() => { startQuiz(); }, [startQuiz]);

    const handleSelect = (idx: number) => {
        if (selected !== null) return;
        setSelected(idx);
        const correct = idx === questions[current].correctIndex;
        if (correct) setScore(s => s + 1);
        setAnswers(a => [...a, correct]);
    };

    const next = () => {
        if (current + 1 >= questions.length) {
            setDone(true);
        } else {
            setCurrent(c => c + 1);
            setSelected(null);
        }
    };

    if (!questions.length) return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-8">
                <Brain className="text-slate-600" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-4 uppercase tracking-tighter">Insufficient Data Nodes</h2>
            <p className="max-w-md mb-8 italic">
                The research registry requires more terms with short definitions to initialize the assessment protocol.
            </p>
            <Link href="/glossary" className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all">
                Expand Registry
            </Link>
        </div>
    );

    if (done) return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-8 text-white">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />
                <Trophy size={80} className="mx-auto text-amber-400 mb-8 drop-shadow-[0_0_30px_rgba(251,191,36,0.2)]" />
                <h2 className="text-5xl font-extrabold mb-4 tracking-tighter uppercase italic">Assessment Complete</h2>
                <p className="text-2xl text-slate-400 mb-12 font-bold italic">
                    Protocol Score: <span className="text-emerald-500">{score}</span> <span className="text-slate-600 mx-2">/</span> {questions.length}
                </p>
                
                <div className="grid grid-cols-5 md:grid-cols-10 gap-3 mb-12 justify-center">
                    {answers.map((correct, i) => (
                        <div key={i} className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto border ${correct ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-lg shadow-emerald-500/10' : 'bg-red-500/10 border-red-500/20 text-red-500 shadow-lg shadow-red-500/10'}`}>
                            {correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                        </div>
                    ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={startQuiz}
                        className="flex-1 flex items-center justify-center gap-3 bg-white text-slate-900 font-bold uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-slate-200 transition-all"
                    >
                        <RefreshCw size={18} /> Initialize New Quiz
                    </button>
                    <Link href="/glossary" className="flex-1 flex items-center justify-center gap-3 bg-slate-800 text-white font-bold uppercase tracking-widest text-xs py-5 rounded-2xl hover:bg-slate-700 transition-all">
                         Return to Registry
                    </Link>
                </div>
            </motion.div>
        </div>
    );

    const q = questions[current];

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 p-6 pt-12 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-2xl flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                    <Link href="/glossary" className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-all">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="text-[9px] font-bold text-blue-500 uppercase tracking-[0.3em] mb-1">Academy Protocol</div>
                        <h1 className="text-xl font-bold text-white uppercase tracking-tighter">Knowledge Assessment</h1>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-1">Module Progress</div>
                    <div className="text-sm font-bold text-slate-400">
                        {current + 1} <span className="text-slate-700 mx-1">/</span> {questions.length}
                    </div>
                </div>
            </div>

            {/* Main Stage */}
            <div className="w-full max-w-2xl">
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full mb-10 overflow-hidden">
                    <motion.div
                        className="h-full bg-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-8"
                    >
                        {/* Question Card */}
                        <div className="bg-slate-900 rounded-[3rem] border border-slate-800 p-12 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Brain size={150} />
                            </div>
                            <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-[9px] font-bold uppercase tracking-widest rounded-full mb-8">Concept Verification</span>
                            <h3 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tighter uppercase italic">{q.term.term}</h3>
                            <div className="mt-8 flex items-center gap-3">
                                <span className="w-8 h-[1px] bg-slate-800"></span>
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Identify the correct operational definition</p>
                            </div>
                        </div>

                        {/* Choices */}
                        <div className="grid grid-cols-1 gap-4">
                            {q.choices.map((choice, idx) => {
                                let btnClass = "w-full text-left p-6 rounded-3xl border transition-all duration-300 flex items-start gap-5 relative overflow-hidden ";
                                if (selected === null) {
                                    btnClass += "bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800 group shadow-lg";
                                } else if (idx === q.correctIndex) {
                                    btnClass += "bg-emerald-500/10 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(16,185,129,0.1)]";
                                } else if (idx === selected && selected !== q.correctIndex) {
                                    btnClass += "bg-red-500/10 border-red-500/50 text-red-400";
                                } else {
                                    btnClass += "bg-slate-900/30 border-slate-900 text-slate-700 opacity-40";
                                }

                                return (
                                    <button 
                                        key={idx} 
                                        onClick={() => handleSelect(idx)} 
                                        className={btnClass}
                                    >
                                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-[10px] shrink-0 transition-colors ${
                                            selected === null ? "bg-slate-800 group-hover:bg-blue-600 group-hover:text-white" : 
                                            idx === q.correctIndex ? "bg-emerald-500 text-white" : 
                                            idx === selected ? "bg-red-500 text-white" : "bg-slate-800 text-slate-700"
                                        }`}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        <span className="text-sm md:text-base font-bold leading-relaxed">{choice}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </motion.div>
                </AnimatePresence>

                {/* Feedback & Navigation */}
                <div className="min-h-[120px] mt-10">
                    <AnimatePresence>
                        {selected !== null && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex flex-col items-center gap-6"
                            >
                                <div className="flex items-center gap-4 text-center px-8 py-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
                                    {selected === q.correctIndex ? (
                                        <div className="flex items-center gap-3 text-emerald-400 font-bold uppercase tracking-widest text-[10px]">
                                            <CheckCircle2 size={16} /> Concept Synthesized
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-3 text-red-400 font-bold uppercase tracking-widest text-[10px]">
                                            <XCircle size={16} /> Protocol Deviation
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-4 w-full">
                                    <Link 
                                        href={`/glossary/${q.term.slug}`} 
                                        target="_blank"
                                        className="flex-1 text-center py-5 bg-slate-900 text-slate-500 font-bold uppercase tracking-widest text-[9px] rounded-2xl hover:text-white transition-all border border-slate-800"
                                    >
                                        Verify Nodes
                                    </Link>
                                    <button 
                                        onClick={next} 
                                        className="flex-[2] py-5 bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] rounded-2xl hover:bg-blue-500 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-500/20"
                                    >
                                        {current + 1 >= questions.length ? "Finalize Score" : "Advance Protocol"} <ChevronRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
