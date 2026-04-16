'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, X, Volume2, MessageSquare, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

const TIPS = [
    "INTEL: High-priority targets detected in the encrypted sector.",
    "RECON: Analyze the node headers for signature patterns.",
    "SECURITY: A brute-force attempt was detected and neutralized.",
    "PROTOCOL: The back-channel tunnel is currently secure.",
    "STRATEGY: Minimize your footprint to avoid firewall detection.",
    "MISSION: Intercept the secondary data-stream for key intel.",
    "ALERTL: Passive reconnaissance indicates a vulnerability in the outer perimeter."
];

export default function HackerEaglone() {
    const [isVisible, setIsVisible] = useState(false);
    const [isThinking, setIsThinking] = useState(false);
    const [clickCount, setClickCount] = useState(0);
    const [currentTip, setCurrentTip] = useState(TIPS[0]);
    const [showBubble, setShowBubble] = useState(false);
    const pathname = usePathname();
    const hasGreeted = useRef(false);

    useEffect(() => {
        const checkAuth = () => {
            const userId = sessionStorage.getItem('ctf_user_id');
            const loggedIn = !!userId;

            // Only show on private pages after login
            const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/';
            const isAdminPage = pathname?.startsWith('/admin');
            setIsVisible(loggedIn && !isAuthPage && !isAdminPage);

            if (loggedIn && !isAuthPage && !hasGreeted.current) {
                // Delay greeting to feel more natural
                setTimeout(() => {
                    greet();
                    hasGreeted.current = true;
                    setShowBubble(true);
                }, 2000);
            }
        };

        checkAuth();
    }, [pathname]);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel(); // Stop previous speech
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            // Look for a bold human-sounding voice
            utterance.voice = voices.find(v => (v.name.includes('Male') || v.name.includes('Bold') || v.name.includes('David')) && v.lang.includes('en')) || voices[0];
            utterance.pitch = 1.0; // Normal human-like pitch
            utterance.rate = 1.0; // Normal human-like speed
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleCharacterClick = () => {
        const nextCount = clickCount + 1;
        setClickCount(nextCount);
        setShowBubble(true);

        if (nextCount === 1) {
            speak("hi I am hacker eaglone how are you");
        } else if (nextCount === 2) {
            speak("Hey what you want? Just explore and finish ctf tasks dont touch me again");
        } else {
            speak("hey dont distrub me ha ha ha ha ha");
        }
    };

    const greet = () => {
        speak("HI I am hacker eaglone. I am here to guide you through the terminal.");
    };

    const nextTip = () => {
        setIsThinking(true);
        setTimeout(() => {
            const nextIdx = (TIPS.indexOf(currentTip) + 1) % TIPS.length;
            setCurrentTip(TIPS[nextIdx]);
            setIsThinking(false);
        }, 800);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 left-6 z-[200] flex items-end gap-4 pointer-events-none">
            {/* Eaglone Character Container */}
            <motion.div
                initial={{ x: -200, opacity: 0, rotate: -10 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                className="relative group pointer-events-auto"
            >
                {/* Floating Animation */}
                <motion.div
                    animate={{
                        y: [0, -10, 0],
                        rotate: [0, 1, 0, -1, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="cursor-pointer"
                    onClick={handleCharacterClick}
                >
                    {/* Character Image */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40">
                        {/* Glow Ring */}
                        <div className="absolute inset-0 bg-hacker-green/20 rounded-full blur-2xl animate-pulse"></div>

                        {/* The Eagle Image - Placeholder path we created */}
                        <img
                            src="/images/eaglone.png"
                            alt="Hacker Eaglone"
                            className="w-full h-full object-contain relative z-10 filter drop-shadow-[0_0_15px_rgba(0,255,65,0.4)]"
                        />

                        {/* Status Light */}
                        <div className="absolute top-4 right-4 h-3 w-3 bg-hacker-green rounded-full border-2 border-black z-20 shadow-[0_0_10px_#00FF41]"></div>
                    </div>
                </motion.div>

                {/* Greeting Sound Trigger Label */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-black/80 border border-hacker-green/30 px-2 py-1 rounded text-[8px] font-mono text-hacker-green opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <Volume2 size={8} className="inline mr-1" /> VOICE_AUTH_ACTIVE
                </div>
            </motion.div>

            {/* Guidance Chat Bubble */}
            <AnimatePresence>
                {showBubble && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: -20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: -20 }}
                        className="pointer-events-auto w-64 md:w-80 bg-black/90 border border-hacker-green/30 p-4 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-md relative mb-12"
                    >
                        {/* Connector Tip */}
                        <div className="absolute bottom-4 -left-2 w-4 h-4 bg-black border-l border-b border-hacker-green/30 rotate-45"></div>

                        <div className="flex justify-between items-start mb-3 border-b border-white/5 pb-2">
                            <div className="flex items-center gap-2">
                                <Terminal size={14} className="text-hacker-green" />
                                <span className="text-[10px] font-bold text-hacker-green tracking-widest uppercase">Eaglone Intel</span>
                            </div>
                            <button onClick={() => setShowBubble(false)} className="text-white/30 hover:text-red-500">
                                <X size={14} />
                            </button>
                        </div>

                        <div className="min-h-[60px] flex items-center">
                            {isThinking ? (
                                <div className="flex gap-1">
                                    <div className="w-1.5 h-1.5 bg-hacker-green rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-hacker-green rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-hacker-green rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            ) : (
                                <p className="text-xs font-mono text-white/80 leading-relaxed italic">
                                    "{currentTip}"
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex justify-end">
                            <button
                                onClick={nextTip}
                                className="flex items-center gap-1 text-[9px] font-bold text-hacker-green border border-hacker-green/20 px-2 py-1 rounded hover:bg-hacker-green/10 transition-all uppercase"
                            >
                                Next Intel <ChevronRight size={12} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
