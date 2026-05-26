'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Terminal, AlertTriangle, Key, Cpu, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SessionChecker() {
    const router = useRouter();
    const pathname = usePathname();
    const [isTerminated, setIsTerminated] = useState(false);
    const [username, setUsername] = useState('operative');
    const [pendingRequest, setPendingRequest] = useState<{
        pending_session_id: string;
        pending_device_info: string;
    } | null>(null);
    const [isResponding, setIsResponding] = useState(false);

    // Run active session validation
    const validateSession = async () => {
        if (typeof window === 'undefined') return;

        const userId = sessionStorage.getItem('ctf_user_id');
        const localSessionId = sessionStorage.getItem('ctf_session_id');

        // Only check private paths when logged in
        const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/';
        const isAdminPage = pathname?.startsWith('/admin');
        const isPublic = isAuthPage || isAdminPage;

        if (!userId || !localSessionId || isPublic) return;

        try {
            // Fetch session status and connection requests from database
            const { data, error } = await supabase
                .from('ctf_users')
                .select('active_session_id, username, login_request_status, pending_session_id, pending_device_info')
                .eq('id', userId)
                .single();

            if (error) throw error;

            if (data) {
                setUsername(data.username || 'operative');
                
                // 1. Check if this local session was terminated (overwritten in database)
                if (data.active_session_id && data.active_session_id !== localSessionId) {
                    setIsTerminated(true);
                    setPendingRequest(null);
                    return;
                }

                // 2. Check if there is a pending connection request from another device
                if (data.login_request_status === 'pending' && data.pending_session_id) {
                    setPendingRequest({
                        pending_session_id: data.pending_session_id,
                        pending_device_info: data.pending_device_info || 'Unknown Node'
                    });
                } else {
                    // Clear modal if the remote device aborted the request
                    setPendingRequest(null);
                    
                    // Update active user heartbeat
                    if (data.active_session_id === localSessionId) {
                        await supabase
                            .from('ctf_users')
                            .update({ last_active_at: new Date().toISOString() })
                            .eq('id', userId);
                    }
                }
            }
        } catch (err) {
            console.error('Session validation error:', err);
        }
    };

    // Approve remote connection request (logs current user out and grants access to new user)
    const handleApprove = async () => {
        if (!pendingRequest) return;
        
        const userId = sessionStorage.getItem('ctf_user_id');
        if (!userId) return;

        setIsResponding(true);
        try {
            const { error } = await supabase
                .from('ctf_users')
                .update({
                    active_session_id: pendingRequest.pending_session_id,
                    login_request_status: 'approved',
                    pending_session_id: null,
                    pending_device_info: null
                })
                .eq('id', userId);

            if (error) throw error;

            // Log this device out instantly
            setIsTerminated(true);
            setPendingRequest(null);
        } catch (err) {
            console.error('Approve login error:', err);
        } finally {
            setIsResponding(false);
        }
    };

    // Reject remote connection request (denies access and lets current user continue session)
    const handleReject = async () => {
        if (!pendingRequest) return;

        const userId = sessionStorage.getItem('ctf_user_id');
        if (!userId) return;

        setIsResponding(true);
        try {
            const { error } = await supabase
                .from('ctf_users')
                .update({
                    login_request_status: 'rejected',
                    pending_session_id: null,
                    pending_device_info: null
                })
                .eq('id', userId);

            if (error) throw error;

            setPendingRequest(null);
        } catch (err) {
            console.error('Reject login error:', err);
        } finally {
            setIsResponding(false);
        }
    };

    // Listeners for visibility changes, pathname navigation, and periodic checks
    useEffect(() => {
        // Initial verification on mount
        validateSession();

        // 1. Listen for page navigation/pathname changes
        validateSession();

        // 2. Listen for tab visibility switch (visibilitychange)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                validateSession();
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);

        // 3. Periodic polling every 4 seconds for responsive real-time handoff
        const pollInterval = setInterval(() => {
            validateSession();
        }, 4000);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            clearInterval(pollInterval);
        };
    }, [pathname]);

    // Handle logout and re-authorization
    const handleReauthorize = () => {
        if (typeof window !== 'undefined') {
            sessionStorage.removeItem('ctf_user_id');
            sessionStorage.removeItem('ctf_username');
            sessionStorage.removeItem('ctf_role');
            sessionStorage.removeItem('ctf_session_id');
            setIsTerminated(false);
            window.location.href = '/login';
        }
    };

    return (
        <>
            {/* Real-time Connection Request Alert */}
            <AnimatePresence>
                {pendingRequest && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md font-mono">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="w-full max-w-md border-2 border-yellow-500 bg-[#070b0e] p-6 shadow-[0_0_50px_rgba(234,179,8,0.2)] rounded-xl text-left"
                        >
                            <div className="flex items-center gap-3 border-b border-yellow-500/30 pb-3 mb-4 text-yellow-500">
                                <AlertTriangle size={20} className="animate-pulse" />
                                <span className="text-xs font-bold uppercase tracking-widest">REMOTE_CONNECTION_ATTEMPT</span>
                            </div>

                            <p className="text-xs text-white/80 leading-relaxed mb-4 uppercase">
                                Alert Operative: Another terminal is requesting access to this secure CTF session.
                            </p>

                            <div className="bg-black/80 border border-yellow-500/20 p-4 rounded mb-6 text-[10px] text-yellow-400/80 break-all leading-normal uppercase">
                                <div className="text-white/40 mb-1 border-b border-white/5 pb-1">REQUEST_DETAILS:</div>
                                <div className="line-clamp-2">DEVICE: {pendingRequest.pending_device_info}</div>
                            </div>

                            <p className="text-[10px] text-red-500/85 mb-6 uppercase tracking-wider">
                                * Warning: Granting access will immediately terminate your active session.
                            </p>

                            <div className="flex gap-4 justify-end">
                                <button
                                    type="button"
                                    disabled={isResponding}
                                    onClick={handleReject}
                                    className="bg-red-500/10 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-black font-bold px-4 py-2 text-[10px] tracking-widest uppercase transition-all rounded cursor-pointer disabled:opacity-50"
                                >
                                    REJECT_REQUEST
                                </button>
                                <button
                                    type="button"
                                    disabled={isResponding}
                                    onClick={handleApprove}
                                    className="bg-yellow-500 text-black font-bold px-4 py-2 text-[10px] tracking-widest uppercase hover:bg-yellow-400 transition-all rounded shadow-[0_0_15px_rgba(234,179,8,0.3)] cursor-pointer disabled:opacity-50"
                                >
                                    {isResponding ? 'RESPONDING...' : 'GRANT_ACCESS'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Expired Session Lock Overlay */}
            <AnimatePresence>
                {isTerminated && (
                    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            className="relative w-full max-w-lg border-2 border-red-500 bg-[#070b0e] p-8 shadow-[0_0_80px_rgba(239,68,68,0.2)] rounded-xl font-mono text-left animate-glow-pulse"
                        >
                            {/* Pulse Border Scan */}
                            <div className="absolute inset-0 border border-red-500/20 rounded-xl pointer-events-none animate-pulse"></div>

                            {/* Alert Header */}
                            <div className="flex items-center justify-between border-b border-red-500/30 pb-4 mb-6">
                                <div className="flex items-center gap-3">
                                    <span className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                                    <span className="text-sm font-bold tracking-[0.25em] text-red-500 uppercase flex items-center gap-2">
                                        <ShieldAlert size={18} className="animate-bounce" />
                                        SECURITY_BREACH_ALERT
                                    </span>
                                </div>
                                <span className="text-[10px] text-red-500/60 border border-red-500/30 px-2 py-0.5 uppercase">
                                    STATUS: PURGED
                                </span>
                            </div>

                            {/* Breach Logs Box */}
                            <div className="bg-black/90 border border-red-500/20 rounded-lg p-5 flex flex-col gap-3 mb-6 text-xs text-red-400/80 leading-relaxed max-h-56 overflow-y-auto scrollbar-thin">
                                <div className="flex items-center gap-2 text-white/50 border-b border-white/5 pb-2">
                                    <Terminal size={12} className="text-red-500" />
                                    <span className="text-[9px] uppercase font-bold tracking-widest">SECURE_NODE_ACTIVITY_LOG</span>
                                </div>
                                <p>
                                    <span className="text-red-500/40 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                    <span className="text-white/60">SYS_INIT:</span> Validating active operative certificate...
                                </p>
                                <p>
                                    <span className="text-red-500/40 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                    <span className="text-red-500">SYS_WARN:</span> Token signature conflict found on operative ID: <span className="text-white underline">{username}</span>
                                </p>
                                <p>
                                    <span className="text-red-500/40 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                    <span className="text-red-500">SYS_WARN:</span> Secure terminal handoff confirmed. Local node session deactivated.
                                </p>
                                <p className="text-white font-bold animate-pulse">
                                    <span className="text-red-500/40 mr-2">[{new Date().toLocaleTimeString()}]</span>
                                    <span className="text-red-500 font-bold">[CRITICAL]</span> DISCONNECTED // Remote session has assumed terminal control.
                                </p>
                            </div>

                            {/* Description */}
                            <div className="flex gap-4 items-start mb-8 text-[#cbd5e1] text-xs leading-relaxed uppercase">
                                <AlertTriangle className="text-red-500 shrink-0 mt-0.5 animate-pulse" size={24} />
                                <div>
                                    <h4 className="font-bold text-white mb-1 tracking-wide">ONE DEVICE LIMIT ENFORCED</h4>
                                    <p className="opacity-70 text-[10px]">
                                        Operative, only one active connection is authorized per account at any time.
                                        This terminal's secure link has been disconnected to prevent credential mirroring.
                                    </p>
                                </div>
                            </div>

                            {/* Re-authorize Button */}
                            <div className="flex justify-end pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={handleReauthorize}
                                    className="w-full sm:w-auto bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-3 text-xs tracking-widest uppercase transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer rounded flex items-center justify-center gap-2"
                                >
                                    <Key size={14} /> RE-AUTHORIZE CONNECTION
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
