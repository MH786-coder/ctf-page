'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, X } from 'lucide-react';

export default function ResponsiveWarning() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user dismissed it in this session
        const dismissed = sessionStorage.getItem('viewport_warning_dismissed');
        if (dismissed) return;

        const checkViewport = () => {
            // Standard laptop breakpoint (1024px)
            if (window.innerWidth < 1024) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        // Check initially
        checkViewport();

        // Listen for resize
        window.addEventListener('resize', checkViewport);
        return () => window.removeEventListener('resize', checkViewport);
    }, []);

    const dismissWarning = () => {
        setIsVisible(false);
        sessionStorage.setItem('viewport_warning_dismissed', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-6 right-6 z-[999] p-4 max-w-md w-[calc(100vw-3rem)]">
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 30, scale: 0.95 }}
                        className="relative border border-hacker-green/40 bg-black/95 p-6 font-mono shadow-[0_0_30px_rgba(0,255,102,0.15)] backdrop-blur-md flex flex-col gap-4 rounded-xl"
                    >
                        {/* Terminal Header */}
                        <div className="flex items-center justify-between border-b border-hacker-green/[0.15] pb-3">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-hacker-green animate-pulse" />
                                <span className="text-[10px] font-black tracking-[0.2em] text-hacker-green uppercase">
                                    SYSTEM_DISPLAY_ALERT
                                </span>
                            </div>
                            <button
                                onClick={dismissWarning}
                                className="text-white/40 hover:text-hacker-green transition-colors cursor-pointer"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-lg bg-hacker-green/10 border border-hacker-green/30 text-hacker-green">
                                <Monitor size={24} className="animate-pulse" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                                    Desktop Console Recommended
                                </h4>
                                <p className="text-[11px] text-white/60 leading-relaxed uppercase tracking-wide">
                                    Operative, this secure CTF workspace is designed for desktop terminal rigs (Laptops / PCs). 
                                    Please switch to a wider display for an optimal intelligence visualization and tool deployment experience.
                                </p>
                            </div>
                        </div>

                        {/* Action */}
                        <div className="flex justify-end pt-2 border-t border-hacker-green/[0.05]">
                            <button
                                onClick={dismissWarning}
                                className="bg-hacker-green text-black px-6 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all cursor-pointer rounded"
                            >
                                ACKNOWLEDGE_ALERT
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
