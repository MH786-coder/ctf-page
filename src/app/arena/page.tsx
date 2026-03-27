'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CHALLENGES, Challenge, Category, Difficulty } from '@/data/challenges';
import { Zap, Lock, Award, Terminal, Filter, Loader2, X, Shield } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const CATEGORIES: Category[] = [
    'Web Exploitation', 'Cryptography', 'Reverse Engineering',
    'Forensics', 'OSINT', 'Steganography', 'Binary Basics', 'AI Security'
];

export default function ArenaPage() {
    const [activeFilter, setActiveFilter] = useState<Category | 'All'>('All');
    const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
    const [flag, setFlag] = useState('');
    const [unlockedHints, setUnlockedHints] = useState<number[]>([]);
    const [challenges, setChallenges] = useState<Challenge[]>(CHALLENGES);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: CHALLENGES.length,
        solved: 0,
        points: 0,
        rank: 'SCRIPT KIDDIE'
    });

    useEffect(() => {
        fetchChallenges();
        fetchUserStats();
    }, []);

    async function fetchChallenges() {
        try {
            const { data, error } = await supabase.from('challenges').select('*');
            if (error) throw error;
            if (data && data.length > 0) {
                setChallenges(data);
            }
        } catch (e) {
            console.warn("Using fallback mock challenges due to DB sync failure.");
        } finally {
            setLoading(false);
        }
    }

    async function fetchUserStats() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data } = await supabase
            .from('profiles')
            .select('score, solves, rank')
            .eq('id', session.user.id)
            .single();

        if (data) {
            setStats(prev => ({ ...prev, ...data }));
        }
    }

    const filteredChallenges = activeFilter === 'All'
        ? challenges
        : challenges.filter((c: Challenge) => c.category === activeFilter);

    const unlockHint = (index: number) => {
        if (!unlockedHints.includes(index)) {
            setUnlockedHints([...unlockedHints, index]);
        }
    };

    const submitFlag = async () => {
        if (!selectedChallenge) return;
        if (flag.trim() === selectedChallenge.flag) {
            alert("MISSION ACCOMPLISHED: FLAG CAPTURED!");
            // Implementation note: You would call a Supabase Edge Function here 
            // to verify the flag and update scores securely on the server side.
        } else {
            alert("ACCESS DENIED: INVALID FLAG PAYLOAD.");
        }
    };

    return (
        <div className="flex flex-col gap-8 pb-20">
            {/* Header Stat Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-[#05130A] border border-[#122B1E] p-6 font-mono">
                <div className="flex flex-col gap-1 border-r border-[#122B1E] pr-6">
                    <span className="text-[10px] text-[#7E8D86] tracking-widest uppercase">OPERATIVE STATUS</span>
                    <span className="text-xl font-bold text-[#FB3640]">{stats.rank}</span>
                </div>
                <div className="flex flex-col gap-1 md:border-r border-[#122B1E] md:px-6">
                    <span className="text-[10px] text-[#7E8D86] tracking-widest uppercase">SOLVED TARGETS</span>
                    <span className="text-xl font-bold text-[#F4F6F5]">{stats.solved} / {stats.total}</span>
                </div>
                <div className="flex flex-col gap-1 border-r border-[#122B1E] px-6">
                    <span className="text-[10px] text-[#7E8D86] tracking-widest uppercase">TOTAL XP</span>
                    <span className="text-xl font-bold text-[#FB3640]">{stats.points} PT</span>
                </div>
                <div className="flex flex-col gap-1 px-6">
                    <span className="text-[10px] text-[#7E8D86] tracking-widest uppercase">SYSTEM UPTIME</span>
                    <span className="text-xl font-bold text-[#00FF55]">99.99%</span>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-4">
                    <div className="flex items-center gap-2 font-mono text-xs text-[#FB3640] uppercase tracking-widest mb-2">
                        <Filter size={14} /> FILTERS
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                        <button
                            onClick={() => setActiveFilter('All')}
                            className={`text-left font-mono text-[10px] p-3 transition-all tracking-tight ${activeFilter === 'All' ? 'bg-[#FB3640] text-black font-bold' : 'bg-[#05130A] text-[#7E8D86] hover:bg-[#122B1E] border border-[#122B1E]'}`}
                        >
                            ALL_TARGETS
                        </button>
                        {CATEGORIES.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveFilter(cat)}
                                className={`text-left font-mono text-[10px] p-3 transition-all tracking-tight ${activeFilter === cat ? 'bg-[#FB3640] text-black font-bold border-[#FB3640]' : 'bg-[#05130A] text-[#7E8D86] hover:bg-[#122B1E] border border-[#122B1E]'}`}
                            >
                                {cat.toUpperCase()}
                            </button>
                        ))}
                    </div>
                </aside>

                {/* Challenge Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="flex h-64 items-center justify-center">
                            <Loader2 className="animate-spin text-[#FB3640]" size={48} />
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredChallenges.map((challenge, i) => (
                                <motion.div
                                    key={challenge.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="group relative border border-[#122B1E] bg-[#05130A] p-6 hover:border-[#FB3640] transition-all cursor-pointer overflow-hidden flex flex-col justify-between h-56"
                                    onClick={() => { setSelectedChallenge(challenge); setUnlockedHints([]); setFlag(''); }}
                                >
                                    {/* Background Glitch Effect */}
                                    <div className="absolute inset-0 z-0 bg-gradient-to-tr from-[#FB3640]/0 to-[#FB3640]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`text-[10px] font-mono px-2 py-0.5 border ${challenge.difficulty === 'BEGINNER' ? 'border-[#0088FF] text-[#0088FF]' :
                                                challenge.difficulty === 'EASY' ? 'border-[#00FF55] text-[#00FF55]' :
                                                    challenge.difficulty === 'MEDIUM' ? 'border-orange-500 text-orange-500' :
                                                        challenge.difficulty === 'HARD' ? 'border-[#FB3640] text-[#FB3640]' :
                                                            'border-purple-600 text-purple-600 bg-purple-600/10'
                                                }`}>
                                                {challenge.difficulty}
                                            </span>
                                            <span className="text-xs font-mono text-[#7E8D86]">{challenge.points} PT</span>
                                        </div>
                                        <h3 className="text-lg font-bold text-[#F4F6F5] mb-1 group-hover:text-[#FB3640] transition-colors line-clamp-1">{challenge.title}</h3>
                                        <p className="text-[10px] font-mono text-[#7E8D86] uppercase tracking-widest">{challenge.category}</p>
                                    </div>

                                    <div className="relative z-10 flex items-center justify-between mt-4">
                                        <div className="flex gap-1">
                                            <Award size={14} className="text-[#00FF55] opacity-50" />
                                            <span className="text-[10px] font-mono text-[#7E8D86]">{challenge.solves || 0} solves</span>
                                        </div>
                                        <button className="bg-[#122B1E] border border-transparent group-hover:border-[#FB3640] group-hover:bg-[#FB3640]/10 px-4 py-1 font-mono text-[10px] font-bold text-[#7E8D86] group-hover:text-[#FB3640] transition-all">
                                            START_OPS
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Challenge Modal */}
            <AnimatePresence>
                {selectedChallenge && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#FB3640] bg-[#000F08] shadow-[0_0_50px_rgba(251,54,64,0.2)] scrollbar-thin scrollbar-thumb-[#122B1E]"
                        >
                            <div className="sticky top-0 z-10 bg-[#05130A] border-b border-[#122B1E] p-6 flex justify-between items-center">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-[#FB3640] font-mono tracking-[0.2em] mb-1">TARGET ACQUISITION // {selectedChallenge.category.toUpperCase()}</span>
                                    <h2 className="text-2xl font-bold">{selectedChallenge.title}</h2>
                                </div>
                                <button onClick={() => setSelectedChallenge(null)} className="text-[#7E8D86] hover:text-[#FB3640]">
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="p-8 grid lg:grid-cols-3 gap-8 text-left">
                                {/* Challenge Info */}
                                <div className="lg:col-span-2 flex flex-col gap-6">
                                    <div>
                                        <h4 className="text-xs font-mono text-[#7E8D86] mb-3 uppercase tracking-widest bg-[#122B1E]/30 p-2 inline-block">INTEL_STORY</h4>
                                        <p className="italic text-[#F4F6F5] opacity-80 border-l-2 border-[#FB3640] pl-4 py-2">"{selectedChallenge.story}"</p>
                                    </div>

                                    <div>
                                        <h4 className="text-xs font-mono text-[#7E8D86] mb-3 uppercase tracking-widest bg-[#122B1E]/30 p-2 inline-block">OBJECTIVE</h4>
                                        <p className="text-sm font-mono leading-relaxed text-[#7E8D86]">{selectedChallenge.description}</p>
                                    </div>

                                    {selectedChallenge.learningConcept && (
                                        <div className="bg-[#0088FF]/10 border border-[#0088FF]/30 p-4 font-mono">
                                            <div className="flex items-center gap-2 text-[#0088FF] text-xs font-bold mb-2">
                                                <Award size={14} /> CONCEPT: {selectedChallenge.learningConcept.title}
                                            </div>
                                            <p className="text-[11px] text-[#0088FF] opacity-80">{selectedChallenge.learningConcept.explanation}</p>
                                        </div>
                                    )}

                                    <div className="flex gap-4">
                                        <button className="flex items-center gap-2 border border-[#122B1E] bg-[#05130A] px-6 py-3 font-mono text-xs font-bold text-[#F4F6F5] hover:border-[#FB3640] transition-colors">
                                            <Terminal size={16} /> DOWNLOAD_TARGET
                                        </button>
                                    </div>

                                    {/* Submission */}
                                    <div className="mt-4 border border-[#122B1E] p-4 bg-black">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center gap-2 text-[10px] text-[#7E8D86] mb-1 font-mono uppercase tracking-widest">
                                                <Shield size={12} /> Submit FLAG{'{'}...{'}'}
                                            </div>
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={flag}
                                                    onChange={(e) => setFlag(e.target.value)}
                                                    placeholder="FLAG{hex_hash_here}"
                                                    className="flex-1 bg-black border border-[#122B1E] p-3 font-mono text-sm text-[#F4F6F5] focus:border-[#FB3640] outline-none transition-all"
                                                />
                                                <button onClick={submitFlag} className="bg-[#FB3640] text-black px-6 py-3 font-mono font-bold uppercase tracking-widest text-xs hover:bg-[#FB3640]/80 transition-all">
                                                    COMPROMISE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Hints / Meta */}
                                <div className="flex flex-col gap-6 font-mono">
                                    <div className="border border-[#122B1E] bg-[#05130A]/50 p-4">
                                        <h4 className="text-[10px] text-[#7E8D86] mb-4 uppercase tracking-[0.2em] border-b border-[#122B1E] pb-2">HINT_REGISTRY</h4>
                                        <div className="flex flex-col gap-3">
                                            {selectedChallenge.hints.map((hint, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => unlockHint(idx)}
                                                    className={`p-3 border text-xs cursor-pointer transition-all ${unlockedHints.includes(idx)
                                                        ? 'border-[#FB3640]/50 bg-[#FB3640]/5 text-[#F4F6F5]'
                                                        : 'border-[#122B1E] bg-black text-[#7E8D86] hover:border-[#FB3640]/30'
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span>LEVEL_{idx + 1}</span>
                                                        {unlockedHints.includes(idx) ? <Zap size={10} className="text-[#FB3640]" /> : <Lock size={10} />}
                                                    </div>
                                                    {unlockedHints.includes(idx) ? hint : 'Click to unlock intel...'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
