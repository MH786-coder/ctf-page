'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Lock, User, KeyRound, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminLoginPage() {
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
            const deviceInfo = navigator.userAgent;
            const ipAddress = 'Admin Direct Access';

            const { data, error: rpcError } = await supabase.rpc('verify_user_login', {
                p_username: username,
                p_password: password,
                p_device_info: deviceInfo,
                p_ip_address: ipAddress
            });

            if (rpcError) throw rpcError;

            const resp = data as any;
            if (resp && resp.success) {
                if (resp.role !== 'admin') {
                    setError('ACCESS DENIED. Admin privileges required.');
                    setLoading(false);
                    return;
                }

                // Store session safely
                localStorage.setItem('ctf_user_id', resp.user_id);
                localStorage.setItem('ctf_username', resp.username);
                localStorage.setItem('ctf_role', resp.role);

                router.push('/admin');
                // Deliberately NOT setting loading to false so the spinner stays while Next.js compiles the route
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
            <div className="w-full max-w-md bg-[#0b0f14] border border-red-500/30 rounded-xl p-8 shadow-[0_0_50px_rgba(248,113,113,0.1)]">

                {/* Header */}
                <div className="flex flex-col items-center mb-8">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black border border-red-500/50 shadow-[0_0_20px_rgba(248,113,113,0.2)] mb-4">
                        <Lock size={28} className="text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-red-500 tracking-tight uppercase">Admin Login</h1>
                    <p className="text-xs font-mono text-red-400/50 mt-1 uppercase tracking-widest text-center">Restricted Access Portal</p>
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
                        <label className="text-[10px] font-bold text-red-400/70 uppercase tracking-widest flex items-center gap-2 font-mono">
                            <User size={12} className="text-red-500" /> Admin Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Admin Node Address"
                            className="bg-black/80 border border-red-500/20 rounded p-3 text-red-100 focus:border-red-500 focus:shadow-[0_0_15px_rgba(248,113,113,0.3)] outline-none font-mono text-sm transition-all"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-red-400/70 uppercase tracking-widest flex items-center gap-2 font-mono">
                            <KeyRound size={12} className="text-red-500" /> Admin Keys
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="bg-black/80 border border-red-500/20 rounded p-3 text-red-100 focus:border-red-500 focus:shadow-[0_0_15px_rgba(248,113,113,0.3)] outline-none font-mono text-sm transition-all"
                            required
                        />
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600/10 border border-red-500 text-red-500 font-bold py-3 rounded uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all flex justify-center items-center gap-2 disabled:opacity-50 text-xs"
                        >
                            {loading ? (
                                <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <Terminal size={14} /> AUTHORIZE_ADMIN_SESSION
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
