'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Shield, Loader2, BrainCircuit } from 'lucide-react';

interface Message {
    role: 'user' | 'ai';
    content: string;
    timestamp: string;
}

export default function CyberAI() {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            content: "CYBERJAI.AI_INTEL_SYSTEM ONLINE // OPERATIVE DETECTED. I am your autonomous deployment assistant. I can automate reconnaissance, generate scripts, or analyze network traffic. What's the mission payload?",
            timestamp: new Date().toLocaleTimeString()
        }
    ]);

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg: Message = {
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString()
        };

        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        setTimeout(() => {
            let aiResponse = "PROCESSING_PAYLOAD... Your request for automated reconnaissance has been acknowledged. Initiating OSINT module for target vectors. How shall we proceed?";

            if (input.toLowerCase().includes('recon')) {
                aiResponse = "RECON_PROTOCOL_ACTIVE: Scouring public records for target IP 192.168.1.1. Found 3 open ports. Recommendation: Execute NMAP scan with stealth flag -sS.";
            } else if (input.toLowerCase().includes('script')) {
                aiResponse = "SCRIPT_FACTORY: Generating Python-based XSS injection vector... DONE. You can download the script from your Console.";
            }

            const aiMsg: Message = {
                role: 'ai',
                content: aiResponse,
                timestamp: new Date().toLocaleTimeString()
            };
            setMessages(prev => [...prev, aiMsg]);
            setLoading(false);
        }, 1500);
    };

    return (
        <>
            {/* Floating Toggle Button */}
            {!isOpen && (
                <motion.button
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-8 right-8 z-[150] h-16 w-16 bg-hacker-white rounded-none border border-black shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center text-black hover:bg-hacker-green transition-all group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-hacker-green/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500 skew-x-12"></div>
                    <Bot size={32} />
                    <div className="absolute top-0 right-0 h-3 w-3 bg-hacker-green animate-pulse shadow-[0_0_10px_#00FF41]"></div>
                </motion.button>
            )}

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 100, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 100, scale: 0.95 }}
                        className="fixed bottom-8 right-8 z-[160] w-[450px] h-[650px] border border-hacker-green/30 bg-black backdrop-blur-3xl shadow-[0_0_50px_rgba(0,255,65,0.1)] flex flex-col font-mono overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-hacker-gray border-b border-hacker-border p-6 flex justify-between items-center group">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-10 border border-hacker-green/50 bg-hacker-green/10 flex items-center justify-center text-hacker-green group-hover:bg-hacker-green group-hover:text-black transition-all">
                                    <BrainCircuit size={20} />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-white tracking-widest uppercase">CYBER_AI.BRAIN</h4>
                                    <p className="text-[10px] text-hacker-green animate-pulse flex items-center gap-2">
                                        <span className="h-1 w-1 rounded-full bg-hacker-green"></span> STATUS: AUTONOMOUS_ACTIVE
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-hacker-green transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Chat History */}
                        <div
                            ref={scrollRef}
                            className="flex-1 overflow-y-auto p-6 flex flex-col gap-8 bg-[url('/grid.svg')] bg-[length:50px_50px] bg-fixed scrollbar-thin scrollbar-thumb-hacker-border"
                        >
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.role === 'user' ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={`flex flex-col max-w-[90%] ${msg.role === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                                >
                                    <div className={`text-[8px] mb-2 font-bold ${msg.role === 'user' ? 'text-white/40' : 'text-hacker-green'} uppercase tracking-[0.3em]`}>
                                        {msg.role === 'user' ? 'OPERATIVE' : 'SYSTEM_AI'} // {msg.timestamp}
                                    </div>
                                    <div
                                        className={`p-5 text-[11px] leading-relaxed border ${msg.role === 'user'
                                            ? 'bg-black border-hacker-border text-white border-r-hacker-white border-r-4'
                                            : 'bg-hacker-gray border-hacker-border text-white border-l-hacker-green border-l-4'
                                            } shadow-xl backdrop-blur-sm`}
                                    >
                                        {msg.content}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div className="flex gap-2 items-center text-hacker-green animate-pulse">
                                    <div className="h-1 w-1 bg-hacker-green rounded-full animate-bounce"></div>
                                    <div className="h-1 w-1 bg-hacker-green rounded-full animate-bounce delay-100"></div>
                                    <div className="h-1 w-1 bg-hacker-green rounded-full animate-bounce delay-200"></div>
                                    <span className="text-[10px] ml-2 font-black uppercase tracking-widest">SYNCHRONIZING_COGNITIVE_NODES...</span>
                                </div>
                            )}
                        </div>

                        {/* Input Component */}
                        <div className="p-6 border-t border-hacker-border bg-hacker-gray/50">
                            <div className="relative">
                                <textarea
                                    rows={2}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSend();
                                        }
                                    }}
                                    placeholder="EXPLAIN_SQL_INJECTION... (SHIFT+ENTER FOR NEW LINE)"
                                    className="w-full bg-black border border-hacker-border p-5 pr-14 text-[11px] text-white outline-none focus:border-hacker-green transition-all resize-none font-mono placeholder:text-white/20"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className="absolute bottom-5 right-4 text-white/50 hover:text-hacker-green transition-colors disabled:opacity-20"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                            <div className="mt-4 flex justify-between items-center text-[8px] text-white/30 tracking-[0.25em] font-bold">
                                <span>ENCRYPTED_LINK: AES-256</span>
                                <span className="flex items-center gap-1 group cursor-help hover:text-hacker-green transition-colors">
                                    <Shield size={10} /> PROTOCOLS: ON
                                </span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
