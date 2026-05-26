'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Shield, Target, Trophy, Zap } from 'lucide-react';
import { Profile } from '@/lib/supabase';

interface ProfileCardProps {
    profile: Profile | null;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative w-full h-full border border-[#122B1E] bg-[#05130A] p-8 flex flex-col items-center text-center gap-6 group hover:border-[#FB3640] transition-all overflow-hidden"
        >
            {/* Background Glitch Elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FB3640]/5 blur-3xl group-hover:bg-[#FB3640]/10 transition-all -z-10"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#0088FF]/5 blur-3xl -z-10"></div>

            {/* Animated Hacker Avatar Frame */}
            <div className="relative h-44 w-44 mb-2">
                {/* Orbiting Ring */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                    className="absolute -inset-4 border border-dashed border-[#FB3640]/30 rounded-full"
                ></motion.div>

                {/* Corner Brackets */}
                <div className="absolute -top-2 -left-2 h-6 w-6 border-t-2 border-l-2 border-[#FB3640]"></div>
                <div className="absolute -top-2 -right-2 h-6 w-6 border-t-2 border-r-2 border-[#FB3640]"></div>
                <div className="absolute -bottom-2 -left-2 h-6 w-6 border-b-2 border-l-2 border-[#FB3640]"></div>
                <div className="absolute -bottom-2 -right-2 h-6 w-6 border-b-2 border-r-2 border-[#FB3640]"></div>

                {/* The Profile Image */}
                <div className="absolute inset-0 border border-[#FB3640] bg-black shadow-[0_0_30px_rgba(251,54,64,0.3)] overflow-hidden flex items-center justify-center">
                    {profile?.avatar_url ? (
                        <img src={profile.avatar_url} alt="Profile" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                        <UserCircle size={100} className="text-[#FB3640]/40 group-hover:text-[#FB3640] transition-colors" />
                    )}
                    {/* CRT Scanline Effect */}
                    <div className="absolute inset-0 pointer-events-none bg-[url('/scanlines.png')] opacity-20"></div>
                </div>
            </div>

            <div className="flex flex-col gap-1 z-10 w-full">
                <div className="flex items-center justify-center gap-2 mb-1">
                    <Shield size={14} className="text-[#FB3640]" />
                    <h2 className="text-2xl font-bold tracking-tighter text-[#F4F6F5] uppercase group-hover:text-[#FB3640] transition-colors">
                        {profile?.username || 'ANON_OPERATIVE'}
                    </h2>
                </div>
                <div className="inline-flex items-center justify-center gap-2 text-[10px] font-bold text-[#FB3640] uppercase tracking-[0.3em] font-mono">
                    <Zap size={10} className="text-[#00FF55]" />
                    {profile?.rank || 'SCRIPT KIDDIE'}
                </div>
                <div className="mt-4 flex flex-col gap-3 px-4">
                    <div className="h-1 w-full bg-[#122B1E] relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '45%' }}
                            className="absolute inset-y-0 left-0 bg-[#FB3640]"
                        ></motion.div>
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-[#7E8D86] uppercase tracking-widest font-bold">
                        <span>LVL_04</span>
                        <span>EXP_1250/3000</span>
                    </div>
                </div>
            </div>

            <div className="w-full mt-4 grid grid-cols-2 gap-4 border-t border-[#122B1E]/50 pt-6">
                <div className="flex flex-col items-center gap-1">
                    <Trophy size={16} className="text-[#00FF55]" />
                    <span className="text-lg font-bold text-white leading-none">{profile?.score || 0}</span>
                    <span className="text-[8px] font-bold text-[#7E8D86] uppercase tracking-widest">TOTAL_XP</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-l border-[#122B1E]">
                    <Target size={16} className="text-[#0088FF]" />
                    <span className="text-lg font-bold text-white leading-none">{profile?.solves || 0}</span>
                    <span className="text-[8px] font-bold text-[#7E8D86] uppercase tracking-widest">TARGETS</span>
                </div>
            </div>

            {/* Decorative Matrix Code Bits */}
            <div className="absolute bottom-4 right-4 font-mono text-[8px] text-[#FB3640]/20 flex flex-col items-end leading-none pointer-events-none uppercase">
                <span>0x{profile?.id.slice(0, 4) || 'NULL'}</span>
                <span>AUTH_SIG: OK</span>
            </div>
        </motion.div>
    );
}
