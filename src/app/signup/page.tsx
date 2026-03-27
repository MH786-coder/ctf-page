'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { User, Mail, Lock, Loader2, ArrowRight, ShieldCheck, AlertCircle, Terminal, Key } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: { username }
                }
            });
            if (error) throw error;
            setSuccess(true);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center py-20 font-mono">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-black border border-hacker-border p-10 shadow-[0_0_50px_rgba(251,54,64,0)] hover:border-hacker-green hover:shadow-[0_0_50px_rgba(0,255,65,0.1)] transition-all relative group"
            >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 group-hover:text-hacker-green transition-all">
                    <Terminal size={48} />
                </div>

                <div className="mb-10 text-center">
                    <div className="inline-flex h-16 w-16 items-center justify-center bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)] mb-8 group-hover:bg-hacker-green">
                        <Key size={32} className="text-black" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-widest uppercase">INITIALIZE_ID</h1>
                    <p className="text-[10px] text-white/40 font-bold tracking-[0.3em] mt-2 mb-4">NEW_OPERATIVE_INDUCTION</p>
                </div>

                {success ? (
                    <div className="flex flex-col gap-8 text-center bg-hacker-green/10 border border-hacker-green/50 p-8">
                        <div className="flex justify-center text-hacker-green mb-2"><ShieldCheck size={48} /></div>
                        <h2 className="text-xl font-black text-hacker-green tracking-widest uppercase">ENROLLMENT_SUCCESS</h2>
                        <p className="text-[11px] text-hacker-green/80 font-bold leading-relaxed uppercase">CHECK_EMAIL_FOR_VERIFICATION_LINK. SECURE_PROTOCOL_INITIATED.</p>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-hacker-green text-black py-4 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-white"
                        >
                            PROCEED_TO_AUTH
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSignup} className="flex flex-col gap-8">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">OPERATIVE_HANDLE</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="GHOST_PRO"
                                    className="w-full bg-hacker-gray border border-hacker-border p-4 pl-12 text-xs text-white outline-none focus:border-hacker-green transition-all uppercase"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">OPERATIVE_EMAIL</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="OPERATIVE@SECTOR_01.NET"
                                    className="w-full bg-hacker-gray border border-hacker-border p-4 pl-12 text-xs text-white outline-none focus:border-hacker-green transition-all uppercase"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mb-1">ACCESS_KEYPASS</label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="************"
                                    className="w-full bg-hacker-gray border border-hacker-border p-4 pl-12 text-xs text-white outline-none focus:border-hacker-green transition-all"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/50 p-4 text-[10px] text-red-500 font-bold tracking-widest uppercase flex items-center gap-3">
                                <AlertCircle size={16} /> ERROR: {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full overflow-hidden bg-hacker-white py-5 font-black uppercase tracking-widest text-[10px] text-black hover:bg-hacker-green transition-all flex items-center justify-center gap-3 shadow-xl"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                            {loading ? 'ENROLLING...' : 'INITIALIZE_INDUCTION'}
                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </form>
                )}

                <div className="mt-12 text-center border-t border-hacker-border pt-8 flex flex-col gap-4">
                    <span className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Already Inducted?</span>
                    <button
                        onClick={() => router.push('/login')}
                        className="text-[10px] text-hacker-green font-bold uppercase tracking-widest hover:text-white transition-colors"
                    >
                        [AUTH_SESSION_RENEW]
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
