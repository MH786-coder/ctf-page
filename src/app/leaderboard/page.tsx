'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Globe, Activity, Loader2, Search } from 'lucide-react';
import { supabase, Profile } from '@/lib/supabase';

export default function LeaderboardPage() {
    const [loading, setLoading] = useState(true);
    const [leaders, setLeaders] = useState<Profile[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchLeaderboard();
    }, []);

    async function fetchLeaderboard() {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('score', { ascending: false })
                .limit(100);

            if (error) throw error;
            setLeaders(data || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    const filteredLeaders = leaders.filter(l =>
        l.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-16 pb-20 font-mono">
            {/* Header Info */}
            <div className="flex flex-col gap-4 border-b border-hacker-border pb-10">
                <h1 className="text-4xl font-black text-white tracking-widest uppercase">GLOBAL_RANKINGS.<span className="text-hacker-green">OPS</span></h1>
                <div className="flex items-center gap-6 text-[10px] text-white/40 tracking-[0.3em] font-bold uppercase">
                    <span className="flex items-center gap-2"><Globe size={14} className="text-hacker-green" /> WORLDWIDE_NETWORK</span>
                    <span className="flex items-center gap-2 border-l border-hacker-border pl-6"><Activity size={14} className="text-hacker-green" /> DATA_LIVE_FEED</span>
                </div>
            </div>

            {loading ? (
                <div className="flex h-64 items-center justify-center">
                    <Loader2 className="animate-spin text-hacker-green" size={48} />
                </div>
            ) : (
                <div className="flex flex-col gap-16">
                    {/* Top 3 Elite Display */}
                    <div className="grid md:grid-cols-3 gap-1 bg-hacker-border border border-hacker-border">
                        {leaders.slice(0, 3).map((leader, i) => (
                            <motion.div
                                key={leader.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex flex-col items-center gap-6 p-10 bg-black relative overflow-hidden group ${i === 0 ? 'border-t-4 border-hacker-green' : ''
                                    }`}
                            >
                                <div className={`absolute top-4 right-6 font-black text-4xl opacity-10 ${i === 0 ? 'text-hacker-green' : 'text-white'
                                    }`}>#{i + 1}</div>

                                <div className="relative h-28 w-28 mb-2">
                                    {/* Avatar Glow for Top 3 */}
                                    <div className={`absolute -inset-3 border border-hacker-green/20 ${i === 0 ? 'animate-pulse' : ''}`}></div>
                                    <div className="absolute inset-0 border border-hacker-border bg-hacker-gray flex items-center justify-center overflow-hidden group-hover:border-hacker-green transition-colors">
                                        {leader.avatar_url ? (
                                            <img src={leader.avatar_url} alt="Top Rank" className="w-full h-full object-cover" />
                                        ) : (
                                            <UserCircle size={80} className="text-white/10 group-hover:text-hacker-green transition-colors" />
                                        )}
                                    </div>
                                </div>

                                <div className="text-center z-10">
                                    <h3 className="text-xl font-black text-white group-hover:text-hacker-green transition-colors uppercase tracking-widest">{leader.username}</h3>
                                    <p className="text-[10px] text-hacker-green font-bold tracking-[0.3em] mt-2 uppercase">{leader.rank}</p>
                                </div>

                                <div className="flex flex-col items-center gap-2 mt-4 z-10">
                                    <span className="text-3xl font-black text-white">{leader.score} <span className="text-xs text-hacker-green font-bold uppercase tracking-widest">PT</span></span>
                                    <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">{leader.solves} TARGETS SOLVED</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Full List Search */}
                    <div className="bg-hacker-gray border border-hacker-border overflow-hidden">
                        <div className="p-6 border-b border-hacker-border flex items-center gap-5">
                            <Search size={20} className="text-white/30" />
                            <input
                                type="text"
                                placeholder="SEARCH_OPERATIVE_LOGS..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-transparent border-none outline-none text-xs text-white w-full font-mono uppercase tracking-[0.3em] font-bold"
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-[10px] uppercase font-bold tracking-widest">
                                <thead className="bg-black/50 text-white/30 border-b border-hacker-border">
                                    <tr>
                                        <th className="p-8">RANK</th>
                                        <th className="p-8">OPERATIVE</th>
                                        <th className="p-8">RANK_CLASS / STATUS</th>
                                        <th className="p-8">SCORE</th>
                                        <th className="p-8 text-right">SOLUTIONS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-hacker-border">
                                    {filteredLeaders.slice(3).map((leader, i) => (
                                        <tr key={leader.id} className="hover:bg-hacker-green/5 transition-colors group">
                                            <td className="p-8 text-white/30 group-hover:text-white font-black">#{i + 4}</td>
                                            <td className="p-8">
                                                <div className="flex items-center gap-5">
                                                    <div className="h-10 w-10 border border-hacker-border bg-black overflow-hidden flex items-center justify-center p-0.5 group-hover:border-hacker-green transition-colors">
                                                        {leader.avatar_url ? (
                                                            <img src={leader.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                                        ) : (
                                                            <UserCircle size={24} className="text-white/10 group-hover:text-hacker-green transition-colors" />
                                                        )}
                                                    </div>
                                                    <span className="text-white group-hover:text-hacker-green transition-colors">{leader.username}</span>
                                                </div>
                                            </td>
                                            <td className="p-8">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-hacker-green font-black">{leader.rank.toUpperCase()}</span>
                                                    <span className="text-[8px] text-white/20">SECTOR_01_ACTIVE</span>
                                                </div>
                                            </td>
                                            <td className="p-8 text-white font-black">{leader.score} PT</td>
                                            <td className="p-8 text-right text-white/30 group-hover:text-white">{leader.solves}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
