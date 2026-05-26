'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Terminal, Lock, User, KeyRound, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPendingModal, setShowPendingModal] = useState(false);
    const [pendingSessionId, setPendingSessionId] = useState<string | null>(null);

    const pollingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

    // Clean up interval on unmount
    React.useEffect(() => {
        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        };
    }, []);

    const startPolling = (pendingId: string, inputUsername: string) => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);

        pollingIntervalRef.current = setInterval(async () => {
            try {
                const { data, error } = await supabase
                    .from('ctf_users')
                    .select('id, username, role, active_session_id, login_request_status')
                    .eq('username', inputUsername)
                    .single();

                if (error) throw error;

                if (data) {
                    if (data.login_request_status === 'approved') {
                        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                        
                        // Successfully logged in! Store session details
                        sessionStorage.setItem('ctf_user_id', data.id);
                        sessionStorage.setItem('ctf_username', data.username);
                        sessionStorage.setItem('ctf_role', data.role);
                        if (data.active_session_id) {
                            sessionStorage.setItem('ctf_session_id', data.active_session_id);
                        }

                        setShowPendingModal(false);
                        router.push('/admin');
                    } else if (data.login_request_status === 'rejected') {
                        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                        
                        setError('ACCESS REJECTED: Connection request rejected by the active operative.');
                        setShowPendingModal(false);

                        // Clear the rejected status from the DB to clean up
                        await supabase
                            .from('ctf_users')
                            .update({ login_request_status: null })
                            .eq('username', inputUsername);
                    }
                }
            } catch (err) {
                console.error('Polling error:', err);
            }
        }, 2000);
    };

    const handleAbortPending = async () => {
        if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        setShowPendingModal(false);
        setLoading(false);

        try {
            // Clear pending request status in DB so the active user's popup disappears
            await supabase
                .from('ctf_users')
                .update({
                    login_request_status: null,
                    pending_session_id: null,
                    pending_device_info: null
                })
                .eq('username', username);
        } catch (err) {
            console.error('Abort request error:', err);
        }
    };

    const executeLogin = async (force: boolean = false) => {
        setError('');
        setLoading(true);

        try {
            const deviceInfo = navigator.userAgent;
            const ipAddress = 'Admin Direct Access';

            const { data, error: rpcError } = await supabase.rpc('verify_user_login', {
                p_username: username,
                p_password: password,
                p_device_info: deviceInfo,
                p_ip_address: ipAddress,
                p_force_login: force
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
                sessionStorage.setItem('ctf_user_id', resp.user_id);
                sessionStorage.setItem('ctf_username', resp.username);
                sessionStorage.setItem('ctf_role', resp.role);
                if (resp.session_id) {
                    sessionStorage.setItem('ctf_session_id', resp.session_id);
                }

                router.push('/admin');
                // Deliberately NOT setting loading to false so the spinner stays while Next.js compiles the route
            } else if (resp && resp.code === 'session_pending') {
                setPendingSessionId(resp.pending_session_id);
                setShowPendingModal(true);
                setLoading(false);
                startPolling(resp.pending_session_id, username);
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

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        await executeLogin(false);
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

            <AnimatePresence>
                {showPendingModal && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md border border-red-500/50 bg-[#0c0f14] p-6 shadow-[0_0_50px_rgba(239,68,68,0.15)] rounded-xl font-mono text-left"
                        >
                            <div className="flex items-center gap-3 border-b border-red-500/30 pb-3 mb-4 text-red-500">
                                <div className="h-4 w-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                                <span className="text-xs font-bold uppercase tracking-widest font-mono">ADMIN_UPLINK_PENDING</span>
                            </div>

                            <p className="text-xs text-white/80 leading-relaxed mb-6 uppercase">
                                Connection request successfully transmitted to the active secure admin terminal.
                                Awaiting authorization from the active administrator...
                            </p>

                            <div className="flex gap-4 justify-end">
                                <button
                                    type="button"
                                    onClick={handleAbortPending}
                                    className="bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black font-bold px-4 py-2 text-[10px] tracking-widest uppercase transition-all rounded cursor-pointer"
                                >
                                    ABORT_REQUEST
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
