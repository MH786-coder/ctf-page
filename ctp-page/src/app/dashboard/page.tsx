'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Zap, Play, Square, Settings,
    Globe, TerminalSquare, AlertCircle, Plus,
    UserCircle, Loader2, Gauge, Target, Trophy, Terminal
} from 'lucide-react';
import { CHALLENGES } from '@/data/challenges';
import { supabase, Profile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [activeTab, setActiveTab] = useState('active');
    const router = useRouter();

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) throw error;
            setProfile(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="animate-spin text-hacker-green" size={48} />
        </div>
    );

    return (
        <div className="flex flex-col gap-12 pb-20 font-mono">
            {/* HUD Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-hacker-border pb-10 relative overflow-hidden group">
                <div className="z-10">
                    <h1 className="text-4xl font-extrabold tracking-tighter text-white mb-2 uppercase">OPERATIVE_CONSOLE.<span className="text-hacker-green">EXE</span></h1>
                    <div className="flex flex-wrap items-center gap-6 text-[10px] text-white/40 tracking-[0.3em] font-bold uppercase">
                        <span className="flex items-center gap-2"><Globe size={14} className="text-hacker-green" /> SYSTEM_NETWORK: ONLINE</span>
                        <span className="flex items-center gap-2 border-l border-hacker-border pl-6"><UserCircle size={14} className="text-hacker-green" /> OPERATIVE: {profile?.username || 'GHOST'}</span>
                        <span className="flex items-center gap-2 border-l border-hacker-border pl-6 text-hacker-green">ACCESS_LEVEL: 04</span>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.push('/marketplace')}
                        className="flex items-center gap-3 bg-white text-black px-6 py-4 font-black uppercase tracking-widest text-[10px] hover:bg-hacker-green transition-all shadow-xl group"
                    >
                        <Plus size={16} className="group-hover:rotate-90 transition-transform" /> ACQUIRE_NEW_TARGETS
                    </button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-hacker-green/5 to-transparent pointer-events-none group-hover:from-hacker-green/10 transition-all"></div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1 bg-hacker-border border border-hacker-border mb-8">
                <StatsPanel label="SOLVED_TARGETS" val={`${profile?.solves || 0} / ${CHALLENGES.length}`} icon={<Target size={18} />} color="#00FF41" />
                <StatsPanel label="TOTAL_XP_RANK" val={`${profile?.score || 0} PT`} icon={<Trophy size={18} />} color="#FFFFFF" />
                <StatsPanel label="ACTIVE_TASKS" val={CHALLENGES.filter(c => c.difficulty === 'HARD' || c.difficulty === 'INSANE').length.toString()} icon={<Zap size={18} />} color="#00FF41" />
                <StatsPanel label="NETWORK_DELAY" val="14 MS" icon={<Gauge size={18} />} color="#FFFFFF" />
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Left Col: Tool Deployment List */}
                <div className="lg:col-span-8 flex flex-col gap-10">
                    <div className="bg-hacker-gray border border-hacker-border p-10 h-full relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10 border-b border-hacker-border pb-6">
                            <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase flex items-center gap-3">
                                <TerminalSquare size={16} className="text-hacker-green" /> DEPLOYED_CRITICAL_OPS
                            </h3>
                            <div className="flex gap-6 text-[10px] text-white/40 font-bold">
                                <button onClick={() => setActiveTab('active')} className={`hover:text-hacker-green transition-colors ${activeTab === 'active' ? 'text-hacker-green' : ''}`}>ACTIVE</button>
                                <button onClick={() => setActiveTab('all')} className={`hover:text-hacker-green transition-colors ${activeTab === 'all' ? 'text-hacker-green' : ''}`}>ALL_HISTORY</button>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1">
                            {[
                                { id: 1, name: 'VULNERA_SCANNER_01', status: 'RUNNING', loc: 'SINGAPORE_01', uptime: '12:45:12', cpu: '12%' },
                                { id: 2, name: 'IDOR_MAPPER_PRO', status: 'STOPPED', loc: 'US_EAST_01', uptime: '00:00:00', cpu: '0%' },
                                { id: 3, name: 'SQLI_PAYLOAD_GEN', status: 'RUNNING', loc: 'FRANKFURT_01', uptime: '05:22:18', cpu: '45%' },
                            ].map(tool => (
                                <div key={tool.id} className="grid grid-cols-12 gap-6 items-center bg-black p-8 border border-hacker-border hover:border-hacker-green transition-all group cursor-pointer">
                                    <div className="col-span-5 flex items-center gap-5">
                                        <div className={`h-2.5 w-2.5 rounded-none ${tool.status === 'RUNNING' ? 'bg-hacker-green shadow-[0_0_8px_#00FF41]' : 'bg-white/10'}`}></div>
                                        <div className="flex flex-col gap-1">
                                            <span className="text-xs font-black text-white uppercase group-hover:text-hacker-green transition-colors">{tool.name}</span>
                                            <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{tool.status}</span>
                                        </div>
                                    </div>
                                    <div className="col-span-2 text-[9px] text-white/40 uppercase font-black">{tool.loc}</div>
                                    <div className="col-span-2 text-[9px] text-white/40 uppercase font-black tracking-tighter">{tool.uptime}</div>
                                    <div className="col-span-3 flex justify-end gap-5 text-white/20">
                                        <button className="hover:text-hacker-green transition-colors"><Play size={16} /></button>
                                        <button className="hover:text-hacker-green transition-colors"><Square size={16} /></button>
                                        <button
                                            onClick={() => router.push('/marketplace')}
                                            className="hover:text-hacker-green transition-colors"><Settings size={16} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-center">
                            <button
                                onClick={() => router.push('/marketplace')}
                                className="text-[10px] text-hacker-green font-black uppercase tracking-widest hover:text-white transition-colors border-b border-hacker-green border-dashed pb-1"
                            >
                                VIEW_ALL_MISSION_MODULES
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Col: System Health & Logs */}
                <div className="lg:col-span-4 flex flex-col gap-10 h-full">
                    <div className="bg-hacker-gray border border-hacker-border p-10 h-full group relative overflow-hidden">
                        <div className="flex justify-between items-center mb-10 border-b border-hacker-border pb-6">
                            <h3 className="text-xs font-black text-white tracking-[0.2em] uppercase">SYSTEM_INTEGRITY</h3>
                            <AlertCircle size={16} className="text-hacker-green animate-pulse" />
                        </div>

                        <div className="flex flex-col gap-10">
                            <HealthBar label="NEURAL_ENGINE" val="45.2%" progress={45} />
                            <HealthBar label="MEMORY_ADAPT" val="82.1%" progress={82} />
                            <HealthBar label="DATA_LATENCY" val="OK / 14MS" progress={15} />
                        </div>

                        <div className="mt-16 flex flex-col gap-6">
                            <h4 className="text-[10px] text-white/40 uppercase tracking-[0.25em] flex items-center gap-3 font-black underline decoration-hacker-green underline-offset-4">
                                <Terminal size={14} className="text-hacker-green" /> REAL_TIME_LOGS
                            </h4>
                            <div className="text-[9px] font-mono text-white/30 flex flex-col gap-2 leading-relaxed h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-hacker-border pr-2">
                                <div className="flex gap-3">
                                    <span className="text-hacker-green shrink-0 tracking-tighter">[17:42:01]</span>
                                    <span className="uppercase">MODULE_SYNC: VULNERA_SCANNER_01</span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-hacker-green shrink-0 tracking-tighter">[17:40:55]</span>
                                    <span className="uppercase">DNS_PROBE_INIT: AS5512.NET</span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-white/50 shrink-0 tracking-tighter">[17:40:12]</span>
                                    <span className="uppercase">IDENTITY_SECURED: {profile?.username}</span>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-hacker-green shrink-0 tracking-tighter">[17:39:44]</span>
                                    <span className="uppercase">ENCRYPTED_TUNNEL_STABLE: SINGAPORE_EDGE</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatsPanel({ label, val, icon, color }: { label: string, val: string, icon: React.ReactNode, color: string }) {
    return (
        <div className="bg-black p-10 hover:bg-hacker-gray transition-all group relative overflow-hidden border-b border-transparent hover:border-hacker-green">
            <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] text-white/30 uppercase tracking-[0.3em] font-black">{label}</span>
                <div className="text-white/10 group-hover:text-hacker-green transition-colors">{icon}</div>
            </div>
            <div className="text-4xl font-black text-white group-hover:scale-105 transition-transform origin-left uppercase" style={{ color }}>{val}</div>
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-hacker-green transition-all duration-500 group-hover:w-full"></div>
        </div>
    );
}

function HealthBar({ label, val, progress }: { label: string, val: string, progress: number }) {
    return (
        <div className="flex flex-col gap-3 group">
            <div className="flex justify-between items-center text-[10px] text-white/30 font-black uppercase tracking-widest">
                <span className="group-hover:text-white transition-colors">{label}</span>
                <span className="text-white">{val}</span>
            </div>
            <div className="h-1 w-full bg-hacker-border overflow-hidden p-[1px]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${progress > 80 ? 'bg-white' : 'bg-hacker-green'}`}
                ></motion.div>
            </div>
        </div>
    );
}
