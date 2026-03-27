'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Lock, User, KeyRound, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Grab device info natively for admin tracking
            const deviceInfo = navigator.userAgent;
            const ipAddress = 'Direct Client Node'; // We capture IP on backend mostly, use string placeholder

            const { data, error: rpcError } = await supabase.rpc('verify_user_login', {
                p_username: username,
                p_password: password,
                p_device_info: deviceInfo,
                p_ip_address: ipAddress
            });

            if (rpcError) throw rpcError;

            // Type verification
            const resp = data as any;
            if (resp && resp.success) {
                if (resp.role === 'admin') {
                    setError('ACCESS REJECTED: Admin accounts must use the dedicated secure portal.');
                    setLoading(false);
                    return;
                }

                // Store session safely
                localStorage.setItem('ctf_user_id', resp.user_id);
                localStorage.setItem('ctf_username', resp.username);
                localStorage.setItem('ctf_role', resp.role);

                // Route students to challenges
                router.push('/challenges');
            } else {
                setError(resp?.message || 'Invalid authorization credentials');
                setLoading(false);
            }
        } catch (err: any) {
            console.error('Login error:', err);
            setError('Auth server unreachable. Check connection.');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center -mt-20 px-4">
            <div className="w-full max-w-md bg-black/40 backdrop-blur-xl border border-white/5 rounded-xl p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black border border-hacker-green/30 shadow-[0_0_15px_rgba(0,255,102,0.15)] mb-4">
                        <Lock size={28} className="text-hacker-green" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">System Authorization</h1>
                    <p className="text-sm text-[#cbd5e1] mt-1 text-center">Provide authorized academic credentials to access the penetration terminal.</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                        <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-red-200">{error}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    {/* User Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#cbd5e1] uppercase tracking-wider flex items-center gap-2">
                            <User size={14} className="text-hacker-green" /> Student ID / Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-hacker-green focus:shadow-[0_0_10px_rgba(0,255,102,0.2)] outline-none transition-all placeholder:text-white/20"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-[#cbd5e1] uppercase tracking-wider flex items-center gap-2">
                            <KeyRound size={14} className="text-hacker-green" /> Decryption Key
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-hacker-green focus:shadow-[0_0_10px_rgba(0,255,102,0.2)] outline-none transition-all placeholder:text-white/20"
                            required
                        />
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-hacker-green text-black font-bold py-3 rounded-lg shadow-[0_4px_15px_rgba(0,255,102,0.2)] hover:bg-[#00e65c] hover:shadow-[0_6px_20px_rgba(0,255,102,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Terminal size={18} /> INITIALIZE CONNECTION
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
