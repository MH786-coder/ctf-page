'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ShieldCheck, Calendar, Zap, TerminalSquare, Flag, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function CompletedPage() {
    const router = useRouter();
    const [completedChallenges, setCompletedChallenges] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
    const [totalChallenges, setTotalChallenges] = useState(0);
    const [stats, setStats] = useState({ count: 0, score: 0 });

    useEffect(() => {
        // Authenticate via session for simple setup
        const userId = sessionStorage.getItem('ctf_user_id');
        const userStr = sessionStorage.getItem('ctf_username');

        if (!userId) {
            router.push('/login');
            return;
        }

        setUsername(userStr || 'Operative');
        fetchChallengesData(userId);
    }, [router]);

    const fetchChallengesData = async (userId: string) => {
        try {
            setLoading(true);

            // 1. Fetch total challenge count
            const { count: total } = await supabase
                .from('ctf_challenges')
                .select('*', { count: 'exact', head: true });

            setTotalChallenges(total || 0);

            // 2. Fetch only this user's completions joined with challenge details
            const { data: completionsData, error: compError } = await supabase
                .from('completed_challenges')
                .select(`
                    time_taken,
                    completed_at,
                    ctf_challenges (
                        id, title, category, difficulty, score
                    )
                `)
                .eq('user_id', userId)
                .order('completed_at', { ascending: false });

            if (compError) throw compError;

            // 3. Build the completed list with merged data
            let tScore = 0;
            const merged = (completionsData || []).map((c: any) => {
                const ch = c.ctf_challenges;
                tScore += ch?.score || 0;
                return {
                    id: ch?.id,
                    title: ch?.title,
                    category: ch?.category,
                    difficulty: ch?.difficulty,
                    score: ch?.score,
                    timeTaken: c.time_taken,
                    completedAt: new Date(c.completed_at).toLocaleDateString('en-US', {
                        year: 'numeric', month: 'short', day: '2-digit'
                    })
                };
            });

            setStats({ count: merged.length, score: tScore });
            setCompletedChallenges(merged);
        } catch (err: any) {
            console.error('Data fetch error:', err);
            setError('Failed to load mission data from the database.');
        } finally {
            setLoading(false);
        }
    };


    const getDifficultyColor = (diff: string) => {
        switch (diff.toLowerCase()) {
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
                <p className="text-[#cbd5e1] font-mono tracking-widest text-xs uppercase animate-pulse">Syncing Mission Database...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <ShieldCheck className="h-12 w-12 text-red-500 mb-4" />
                <p className="text-white text-lg font-bold">Connection Failed</p>
                <p className="text-[#cbd5e1] max-w-sm mt-2">{error}</p>
                <button onClick={() => location.reload()} className="bg-hacker-green text-black px-6 py-2 rounded-lg mt-6 shadow-[0_4px_15px_rgba(0,255,102,0.2)]">Retry Connection</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 py-10 fade-in">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Trophy size={28} className="text-hacker-green" />
                        <h1 className="text-4xl text-white">Mission Archives</h1>
                    </div>
                    <p className="text-[#cbd5e1] max-w-xl">
                        Welcome back, <span className="text-hacker-green font-bold">{username}</span>. Challenges you have cracked so far.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col items-center min-w-[100px]">
                        <span className="text-xl font-bold text-white leading-none">{stats.count}/{totalChallenges}</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#cbd5e1] mt-1">Cleared</span>
                    </div>
                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col items-center min-w-[100px]">
                        <span className="text-xl font-bold text-hacker-green leading-none">{stats.score}</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#cbd5e1] mt-1">Total Score</span>
                    </div>
                </div>
            </div>

            {/* Empty State */}
            {completedChallenges.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
                    <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                        <ShieldCheck size={28} className="text-white/20" />
                    </div>
                    <h2 className="text-xl font-bold text-white/60">No Missions Completed Yet</h2>
                    <p className="text-sm text-[#cbd5e1]/60 max-w-xs">
                        Head to the Challenges page and start cracking. Your completed missions will appear here.
                    </p>
                    <button
                        onClick={() => router.push('/challenges')}
                        className="mt-2 bg-hacker-green text-black font-bold px-6 py-2 rounded-lg text-sm shadow-[0_0_15px_rgba(0,255,102,0.2)] hover:bg-[#00e65c] transition-all"
                    >
                        Go to Challenges
                    </button>
                </div>
            )}

            {/* Completed Missions Grid */}
            {completedChallenges.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedChallenges.map((challenge) => (
                        <div
                            key={challenge.id}
                            className="group flex flex-col p-6 relative overflow-hidden transition-all border border-hacker-green/30 rounded-xl bg-black/30 shadow-[0_0_15px_rgba(0,255,102,0.07)] hover:shadow-[0_0_25px_rgba(0,255,102,0.15)] hover:border-hacker-green/60"
                        >
                            {/* COMPLETED badge */}
                            <div className="absolute top-0 right-0 bg-hacker-green text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg tracking-widest">
                                COMPLETED
                            </div>

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full flex items-center justify-center border bg-hacker-green/20 border-hacker-green/40 text-hacker-green">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-hacker-green transition-colors">
                                            {challenge.title}
                                        </h3>
                                        <span className="text-xs text-[#cbd5e1]">{challenge.category}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 mt-1 mb-6">
                                <div className="inline-flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-1 rounded-full text-xs font-mono">
                                    <Zap size={12} className={getDifficultyColor(challenge.difficulty)} />
                                    <span className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty} Grade</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex items-center justify-between pt-4 border-t border-hacker-green/10 mt-auto">
                                <div className="flex items-center gap-2 text-xs text-[#cbd5e1] font-mono">
                                    <Calendar size={14} className="text-white/40" />
                                    {challenge.completedAt}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-xs text-[#cbd5e1] font-mono">
                                        <TerminalSquare size={14} className="text-white/40" />
                                        {challenge.timeTaken}
                                    </div>
                                    <div className="flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-lg bg-hacker-green/10 text-hacker-green">
                                        <Flag size={14} />
                                        {challenge.score} PTS
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
