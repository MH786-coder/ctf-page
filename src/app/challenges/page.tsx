'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Filter, X, Terminal, Lock, Download, Zap,
    Loader2, AlertTriangle, CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ChallengesPage() {
    const router = useRouter();
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('ALL MODULES');
    const [selectedTool, setSelectedTool] = useState<any | null>(null);
    const [flag, setFlag] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // DB state
    const [challenges, setChallenges] = useState<any[]>([]);
    const [completedMap, setCompletedMap] = useState<Record<string, boolean>>({});
    const [categories, setCategories] = useState<string[]>(['ALL MODULES']);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const uid = sessionStorage.getItem('ctf_user_id');
        if (!uid) {
            router.push('/login');
            return;
        }
        setUserId(uid);
        fetchData(uid);
    }, [router]);

    const fetchData = async (uid: string) => {
        try {
            setLoading(true);

            // Fetch all challenges
            const { data: ctfData, error: ctfError } = await supabase
                .from('ctf_challenges')
                .select('*')
                .order('created_at', { ascending: false });

            if (ctfError) throw ctfError;

            // Fetch completions for this user
            const { data: compData, error: compError } = await supabase
                .from('completed_challenges')
                .select('challenge_id')
                .eq('user_id', uid);

            if (compError) throw compError;

            // Map completions
            const cmap: Record<string, boolean> = {};
            if (compData) {
                compData.forEach(c => {
                    cmap[c.challenge_id] = true;
                });
            }

            // Extract unique categories
            const cats = new Set<string>();
            if (ctfData) {
                ctfData.forEach(c => cats.add(c.category));
            }

            setCategories(['ALL MODULES', ...Array.from(cats)]);
            setCompletedMap(cmap);
            setChallenges(ctfData || []);
        } catch (err: any) {
            console.error('Fetch error:', err);
            setError('Failed to fetch module data from secure node.');
        } finally {
            setLoading(false);
        }
    };

    // Filter challenges based on search and category
    const filteredTools = challenges.filter(tool => {
        const matchesSearch = tool.title.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = activeCategory === 'ALL MODULES' || tool.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const handleToolClick = (tool: any) => {
        setSelectedTool(tool);
        setFlag('');
    };

    const handleFlagSubmit = async () => {
        if (!selectedTool || !flag.trim() || !userId) return;

        setIsSubmitting(true);
        try {
            if (completedMap[selectedTool.id]) {
                alert("ALREADY_SECURED");
                return;
            }

            // Real Flag Check against the db column 
            if (flag.trim() !== selectedTool.flag) {
                alert("DECRYPTION_ERROR // INVALID_FLAG_HASH");
                setIsSubmitting(false);
                return;
            }

            // Successfully Verified
            const { error } = await supabase.from('completed_challenges').insert({
                user_id: userId,
                challenge_id: selectedTool.id,
                time_taken: '01h 00m' // Dummy calculation
            });

            if (error) {
                if (error.code === '23505') {
                    // Unique constraint violation -> already completed
                    setCompletedMap(prev => ({ ...prev, [selectedTool.id]: true }));
                    setSelectedTool(null);
                    return;
                }
                throw error;
            }

            // Success Updates
            setCompletedMap(prev => ({ ...prev, [selectedTool.id]: true }));
            setSelectedTool(null);

        } catch (err) {
            console.error(err);
            alert("NETWORK_ERROR // UPLINK_LOST");
        } finally {
            setIsSubmitting(false);
        }
    };

    const getDifficultyColor = (diff: string) => {
        switch (diff?.toLowerCase()) {
            case 'easy': return 'text-[#00ff66]';
            case 'medium': return 'text-yellow-400';
            case 'hard': return 'text-orange-500';
            case 'extreme': return 'text-red-500';
            default: return 'text-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 text-hacker-green animate-spin mb-4" />
                <p className="text-[#cbd5e1] font-mono tracking-widest text-xs uppercase animate-pulse">Accessing Secure Nodes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-white text-lg font-bold">Network Exception</p>
                <p className="text-[#cbd5e1] max-w-sm mt-2">{error}</p>
                <button onClick={() => location.reload()} className="bg-hacker-green text-black px-6 py-2 rounded-lg mt-6 shadow-[0_4px_15px_rgba(0,255,102,0.2)]">Retry Uplink</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 py-10 fade-in">
            {/* Header */}
            <div className="flex flex-col gap-4 border-b border-white/5 pb-10">
                <h1 className="text-4xl text-white">Challenges Library</h1>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <p className="text-[#cbd5e1]">Access global pentesting modules and securely decrypt the objective flags.</p>

                    <div className="relative w-full max-w-md">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                            type="text"
                            placeholder="Search modules..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white hover:border-white/20 focus:border-hacker-green focus:shadow-[0_0_10px_rgba(0,255,102,0.2)] outline-none transition-all placeholder:text-white/20"
                        />
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className="w-full lg:w-64 shrink-0 flex flex-col gap-6">
                    <div className="flex flex-col gap-4 bg-black/40 border border-white/5 rounded-xl p-5">
                        <div className="flex items-center gap-2 text-sm text-[#cbd5e1] font-bold uppercase tracking-wider mb-2">
                            <Filter size={16} className="text-hacker-green" /> Categories
                        </div>
                        <div className="flex flex-col gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`text-left text-[13px] py-2 px-4 rounded-lg transition-all ${activeCategory === cat
                                        ? 'bg-hacker-green/10 text-hacker-green border border-hacker-green/30'
                                        : 'bg-transparent border border-transparent text-[#cbd5e1] hover:bg-white/5'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Tool Grid */}
                <div className="flex-1">
                    <div className="flex flex-col gap-4">
                        {filteredTools.map((tool, i) => {
                            const isComp = completedMap[tool.id];

                            return (
                                <motion.div
                                    key={tool.id}
                                    initial={{ opacity: 0, x: -8 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.025, ease: 'easeOut' }}
                                    className={`group relative flex items-center justify-between p-6 bg-black/40 border rounded-xl cursor-pointer transition-all duration-300 ${isComp ? 'border-hacker-green/30 shadow-[0_0_20px_rgba(0,255,102,0.05)]' : 'border-white/5 hover:border-hacker-green/30 hover:shadow-[0_0_20px_rgba(0,255,102,0.05)] hover:-translate-y-1'}`}
                                    onClick={() => handleToolClick(tool)}
                                >
                                    {/* Left Status Bar */}
                                    <div className={`absolute left-0 top-1/2 -translate-y-1/2 h-1/2 w-1 rounded-r-md transition-colors ${isComp ? 'bg-hacker-green shadow-[0_0_10px_#00ff66]' : 'bg-white/10 group-hover:bg-hacker-green/50'}`} />

                                    {/* Content */}
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-6 w-full pl-4">

                                        {/* Status Icon */}
                                        <div className={`shrink-0 h-12 w-12 rounded-full flex items-center justify-center border transition-all ${isComp ? 'bg-hacker-green/20 border-hacker-green/50' : 'bg-white/5 border-white/10 group-hover:bg-hacker-green/10'}`}>
                                            {isComp ? <CheckCircle2 size={24} className="text-hacker-green" /> : <Terminal size={24} className={isComp ? 'text-hacker-green' : 'text-[#cbd5e1]'} />}
                                        </div>

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="text-lg font-bold text-white tracking-tight truncate group-hover:text-hacker-green transition-colors">{tool.title}</h3>
                                                {isComp && (
                                                    <span className="bg-hacker-green/10 text-hacker-green text-[10px] font-bold px-2 py-0.5 rounded-full border border-hacker-green/20">SECURED</span>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap items-center gap-3 text-sm text-[#cbd5e1]">
                                                <span>{tool.category}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                <span className={`${getDifficultyColor(tool.difficulty)} font-mono text-xs uppercase`}>{tool.difficulty}</span>
                                                <span className="w-1 h-1 rounded-full bg-white/20" />
                                                <span className="font-mono text-xs text-hacker-green">{tool.score} PTS</span>
                                            </div>
                                        </div>

                                        {/* Action Icon */}
                                        <div className="shrink-0 flex items-center justify-center mt-4 sm:mt-0">
                                            <div className="h-10 w-10 flex items-center justify-center bg-white/5 rounded-lg group-hover:bg-hacker-green group-hover:text-black transition-colors">
                                                <Zap size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>

                    {filteredTools.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-20 text-[#cbd5e1] text-sm">
                            <Search size={48} className="mb-4 opacity-20" />
                            No modules perfectly match your intel criteria.
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {selectedTool && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-3xl max-h-full overflow-y-auto bg-[#0b0f14] border border-white/10 rounded-2xl shadow-2xl flex flex-col"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 z-10 bg-[#0b0f14]/80 backdrop-blur-xl border-b border-white/5 p-6 md:p-8 flex justify-between items-start">
                                <div className="flex flex-col gap-2">
                                    <span className="text-xs text-hacker-green font-bold uppercase tracking-wider">{selectedTool.category}</span>
                                    <h2 className="text-2xl md:text-3xl font-bold text-white capitalize">{selectedTool.title}</h2>

                                    <div className="flex gap-4 mt-2">
                                        <span className={`text-xs font-mono px-2 py-1 rounded bg-black/50 border border-white/10 ${getDifficultyColor(selectedTool.difficulty)}`}>{selectedTool.difficulty} Grade</span>
                                        <span className="text-xs font-mono text-hacker-green px-2 py-1 rounded bg-hacker-green/10 border border-hacker-green/20">{selectedTool.score} Points</span>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedTool(null)} className="text-[#cbd5e1] hover:text-white bg-white/5 hover:bg-white/10 rounded-full p-2 transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-6 md:p-8 flex flex-col gap-8">
                                <div className="flex flex-col gap-4">
                                    <p className="text-base text-[#cbd5e1] leading-relaxed">
                                        This module evaluates your proficiency in exploiting advanced vulnerabilities within the specified architecture space. Retrieve the protected payload and submit the decryption hash below.
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4">
                                    <button className="flex items-center gap-3 bg-white/5 text-white border border-white/10 hover:border-hacker-green hover:text-hacker-green px-6 py-3 rounded-lg font-medium transition-all">
                                        <Download size={18} /> Download Target Data
                                    </button>
                                </div>

                                {/* Flag Submission */}
                                <div className="mt-4 border border-hacker-border bg-black/40 p-6 md:p-8 rounded-xl flex flex-col gap-4 border-l-4 border-l-hacker-green">
                                    <div className="flex items-center gap-2 text-sm text-[#cbd5e1] font-bold uppercase tracking-wider">
                                        {completedMap[selectedTool.id] ? <CheckCircle2 size={16} className="text-hacker-green" /> : <Lock size={16} className="text-hacker-green" />}
                                        {completedMap[selectedTool.id] ? 'NODE SECURED' : 'SUBMIT ENCRYPTED FLAG'}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <input
                                            type="text"
                                            value={completedMap[selectedTool.id] ? 'SECURED_COMPLETION_HASH_#OK' : flag}
                                            disabled={completedMap[selectedTool.id]}
                                            onChange={(e) => setFlag(e.target.value)}
                                            placeholder="FLAG{...}"
                                            className="flex-1 bg-black/60 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-hacker-green focus:shadow-[0_0_10px_rgba(0,255,102,0.2)] disabled:opacity-50 disabled:border-hacker-green transition-all outline-none"
                                        />
                                        <button
                                            onClick={handleFlagSubmit}
                                            disabled={isSubmitting || completedMap[selectedTool.id]}
                                            className="bg-hacker-green text-[#0b0f14] px-8 py-3 rounded-lg font-bold hover:bg-[#00e65c] shadow-[0_4px_15px_rgba(0,255,102,0.2)] hover:shadow-[0_6px_20px_rgba(0,255,102,0.4)] disabled:opacity-30 transition-all flex justify-center items-center"
                                        >
                                            {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : completedMap[selectedTool.id] ? 'VERIFIED' : 'DECRYPT'}
                                        </button>
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
