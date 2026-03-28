'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, ShieldCheck, Calendar, Zap, TerminalSquare, ExternalLink, Flag, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Connected to standard Supabase Client

export default function CompletedPage() {
    const router = useRouter();
    const [challenges, setChallenges] = useState<any[]>([]);
    const [completedMap, setCompletedMap] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [username, setUsername] = useState('');
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

            // 1. Fetch All CTF Challenges from Table
            const { data: ctfData, error: ctfError } = await supabase
                .from('ctf_challenges')
                .select('*')
                .order('created_at', { ascending: false });

            if (ctfError) throw ctfError;

            // 2. Fetch User Completions
            const { data: completionsData, error: compError } = await supabase
                .from('completed_challenges')
                .select('*')
                .eq('user_id', userId);

            if (compError) throw compError;

            // 3. Map completions by challenge_id instantly
            const compMap: Record<string, any> = {};
            let tScore = 0;
            let count = 0;

            if (completionsData) {
                completionsData.forEach(c => {
                    compMap[c.challenge_id] = {
                        timeTaken: c.time_taken,
                        completedAt: new Date(c.completed_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: '2-digit'
                        })
                    };
                });
            }

            // Calculate current stats based on completed matching ctf_challenges
            if (ctfData) {
                ctfData.forEach(chall => {
                    if (compMap[chall.id]) {
                        tScore += chall.score;
                        count++;
                    }
                });
            }

            setStats({ count, score: tScore });
            setCompletedMap(compMap);
            setChallenges(ctfData || []);
        } catch (err: any) {
            console.error('Data fetch error:', err);
            setError('Failed to load mission data from the database. Run the SQL schema script first.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('ctf_user_id');
        sessionStorage.removeItem('ctf_username');
        router.push('/login');
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
                        Welcome back, <span className="text-hacker-green font-bold">{username}</span>. A detailed record of all targets.
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleLogout} className="text-[#cbd5e1] hover:text-white transition-colors text-sm border-r border-white/10 pr-4">Sign Terminate</button>

                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col items-center min-w-[100px]">
                        <span className="text-xl font-bold text-white leading-none">{stats.count}/{challenges.length}</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#cbd5e1] mt-1">Cleared</span>
                    </div>
                    <div className="bg-black/50 border border-white/5 rounded-xl p-3 flex flex-col items-center min-w-[100px]">
                        <span className="text-xl font-bold text-hacker-green leading-none">{stats.score}</span>
                        <span className="text-[10px] uppercase tracking-wider text-[#cbd5e1] mt-1">Total score</span>
                    </div>
                </div>
            </div>

            {/* Missions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {challenges.map((challenge) => {
                    const isComp = !!completedMap[challenge.id];
                    const compData = completedMap[challenge.id];

                    return (
                        <div key={challenge.id} className={`group flex flex-col p-6 cursor-pointer relative overflow-hidden transition-all ${isComp ? 'border-hacker-green/40 shadow-[0_0_15px_rgba(0,255,102,0.1)]' : 'border-white/5 opacity-80'}`}>

                            {/* Completion Overlay Flag */}
                            {isComp && (
                                <div className="absolute top-0 right-0 bg-hacker-green text-black text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                                    COMPLETED
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border transition-colors ${isComp ? 'bg-hacker-green/20 border-hacker-green/40 text-hacker-green' : 'bg-white/5 border-white/10 text-[#cbd5e1]'}`}>
                                        <ShieldCheck size={20} />
                                    </div>
                                    <div>
                                        <h3 className={`text-xl font-bold transition-colors ${isComp ? 'text-white group-hover:text-hacker-green' : 'text-[#cbd5e1] group-hover:text-white'}`}>
                                            {challenge.title}
                                        </h3>
                                        <span className="text-xs text-[#cbd5e1]">{challenge.category}</span>
                                    </div>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ExternalLink size={18} className={isComp ? 'text-hacker-green' : 'text-[#cbd5e1]'} />
                                </div>
                            </div>

                            <div className="flex-1 mt-2 mb-6">
                                <div className="inline-flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-1 rounded-full text-xs font-mono">
                                    <Zap size={12} className={getDifficultyColor(challenge.difficulty)} />
                                    <span className={getDifficultyColor(challenge.difficulty)}>{challenge.difficulty} Grade</span>
                                </div>
                            </div>

                            {/* Footer stats depending on completion */}
                            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                <div className="flex items-center gap-2 text-xs text-[#cbd5e1] font-mono">
                                    <Calendar size={14} className="text-white/40" />
                                    {isComp ? compData.completedAt : 'Available Now'}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1 text-xs text-[#cbd5e1] font-mono">
                                        <TerminalSquare size={14} className="text-white/40" />
                                        {isComp ? compData.timeTaken : '--h --m'}
                                    </div>
                                    <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-lg ${isComp ? 'bg-hacker-green/10 text-hacker-green' : 'bg-white/5 text-[#cbd5e1]'}`}>
                                        <Flag size={14} />
                                        {challenge.score} PTS
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

        </div>
    );
}
