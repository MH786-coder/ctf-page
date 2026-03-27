'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal as TerminalIcon, X, ChevronRight, Activity, Cpu, Shield, Clock, Gauge } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface LogEntry {
    text: string;
    type: 'info' | 'error' | 'success' | 'command';
    timestamp: string;
}

export default function Terminal() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [logs, setLogs] = useState<LogEntry[]>([
        { text: 'CTF CHALLENGES // SYSTEM CONSOLE V4.2_STABLE', type: 'info', timestamp: new Date().toLocaleTimeString() },
        { text: 'LINK ESTABLISHED VIA SINGAPORE_EDGE_NODE_01', type: 'info', timestamp: new Date().toLocaleTimeString() },
        { text: 'TYPE "HELP" FOR COMMAND LIST.', type: 'info', timestamp: new Date().toLocaleTimeString() },
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs, isOpen]);

    const addLog = (text: string, type: 'info' | 'error' | 'success' | 'command' = 'info') => {
        setLogs(prev => [...prev, { text, type, timestamp: new Date().toLocaleTimeString() }]);
    };

    const handleCommand = async (cmd: string) => {
        const command = cmd.trim().toLowerCase();
        addLog(`> ${cmd}`, 'command');

        switch (command) {
            case 'help':
                addLog('AVAILABLE_OPERATIONS:', 'info');
                addLog('  WHOAMI     - OPERATIVE IDENTITY', 'info');
                addLog('  STATUS     - SYSTEM INTEGRITY CHECK', 'info');
                addLog('  LS         - LIST DEPLOYED MODULES', 'info');
                addLog('  CLEAR      - PURGE CONSOLE LOGS', 'info');
                addLog('  NETSTAT    - DISPLAY TRAFFIC DATA', 'info');
                addLog('  EXIT       - SHUTDOWN CONSOLE', 'info');
                break;
            case 'whoami':
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    addLog(`USER: ${session.user.email}`, 'success');
                    addLog(`CREDENTIALS: LEVEL_4_ACCESS`, 'info');
                } else {
                    addLog('OPERATIVE: ANONYMOUS_UNAUTHORIZED', 'error');
                    addLog('PLEASE INITIALIZE AUTHENTICATION PROTOCOL.', 'info');
                }
                break;
            case 'status':
                addLog('SYSTEM_HEALTH: 99.8% // VPN_TUNNEL: ACTIVE', 'success');
                addLog('ENCRYPTION: AES-256-GCM', 'info');
                break;
            case 'ls':
                addLog('ACTIVE_MODULES:', 'info');
                addLog('  [01] VULNERA_SCANNER_01 (RUNNING)', 'success');
                addLog('  [02] SQLI_PAYLOAD_GEN (IDLE)', 'info');
                break;
            case 'clear':
                setLogs([]);
                break;
            case 'exit':
                setIsOpen(false);
                break;
            default:
                addLog(`COMMAND NOT FOUND: ${command}`, 'error');
        }
    };

    return (
        <>
            {/* Floating Toggle Bar at Bottom Center */}
            {!isOpen && (
                <motion.div
                    initial={{ y: 50 }}
                    animate={{ y: 0 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-0 left-1/2 -translate-x-1/2 z-[100] w-72 bg-black border-t-2 border-x-2 border-hacker-border px-6 py-3 flex items-center justify-between cursor-pointer hover:bg-hacker-gray hover:border-hacker-green transition-all group"
                >
                    <div className="flex items-center gap-3 text-[10px] font-mono text-white/50 group-hover:text-hacker-green font-bold tracking-widest">
                        <TerminalIcon size={12} />
                        OPS_CONSOLE_V4.2
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-hacker-green animate-pulse"></div>
                        <span className="text-[9px] text-white/30 font-mono font-bold">ONLINE</span>
                    </div>
                </motion.div>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 150 }}
                        className="fixed inset-x-0 bottom-0 z-[200] h-[450px] border-t-4 border-hacker-green bg-black/95 backdrop-blur-3xl shadow-[0_-50px_80px_rgba(0,255,65,0.1)] flex flex-col font-mono"
                    >
                        {/* Console Header */}
                        <div className="bg-hacker-gray border-b border-hacker-border px-8 py-3 flex justify-between items-center group">
                            <div className="flex items-center gap-8 text-[11px] tracking-[0.2em] text-white/40 font-bold">
                                <div className="flex items-center gap-2 text-hacker-green">
                                    <Activity size={16} className="animate-pulse" />
                                    SYSTEM_INTEGRITY_LOGS
                                </div>
                                <div className="hidden md:flex items-center gap-2">
                                    <Clock size={16} /> {new Date().toLocaleTimeString()}
                                </div>
                                <div className="hidden md:flex items-center gap-2 text-hacker-green">
                                    <Shield size={16} /> SECURE_ENCLAVE_ACTIVE
                                </div>
                            </div>
                            <div className="flex items-center gap-8">
                                <button onClick={() => setLogs([])} className="text-[10px] text-white/30 hover:text-hacker-green transition-colors font-bold uppercase tracking-widest">[ERASE_LOGS]</button>
                                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-hacker-green transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Terminal Output */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-10 flex flex-col gap-2 text-xs leading-relaxed scrollbar-thin scrollbar-thumb-hacker-border bg-black/80"
                        >
                            {logs.map((log, i) => (
                                <div key={i} className="flex gap-4">
                                    <span className="text-white/20 shrink-0">[{log.timestamp}]</span>
                                    <span className={`
                    ${log.type === 'error' ? 'text-red-500 font-bold' : ''}
                    ${log.type === 'success' ? 'text-hacker-green font-bold' : ''}
                    ${log.type === 'command' ? 'text-white font-bold' : ''}
                    ${log.type === 'info' ? 'text-white/50' : ''}
                  `}>
                                        {log.type === 'command' ? '➜ ' : ''}{log.text}
                                    </span>
                                </div>
                            ))}
                            <div className="flex items-center gap-3 mt-4">
                                <ChevronRight size={18} className="text-hacker-green" />
                                <input
                                    autoFocus
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleCommand(input);
                                            setInput('');
                                        }
                                    }}
                                    className="bg-transparent border-none outline-none text-white w-full uppercase font-bold tracking-widest text-xs"
                                    placeholder="type help for commands..."
                                />
                            </div>
                        </div>

                        {/* Console Footer HUD */}
                        <div className="border-t border-hacker-border bg-hacker-gray px-8 py-2 flex justify-between items-center text-[10px] text-white/30 tracking-[0.2em] font-bold">
                            <div className="flex items-center gap-8">
                                <span className="flex items-center gap-2"><Cpu size={14} /> CPU_01: 14.2%</span>
                                <span className="flex items-center gap-2"><Gauge size={14} /> BANDWIDTH: 420MB/S</span>
                            </div>
                            <div className="uppercase">CYBERJAI_SYSTEM_OS_V4.2</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
