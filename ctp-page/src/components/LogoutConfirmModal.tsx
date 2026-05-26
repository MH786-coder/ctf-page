'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, LogOut, X } from 'lucide-react';

interface LogoutConfirmModalProps {
    isOpen: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function LogoutConfirmModal({ isOpen, onConfirm, onCancel }: LogoutConfirmModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="relative w-full max-w-md border border-red-500/40 bg-black p-8 font-mono shadow-[0_0_50px_rgba(239,68,68,0.15)] flex flex-col gap-6"
                    >
                        {/* Terminal Style Header Bar */}
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2">
                                <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black tracking-[0.2em] text-red-500 uppercase">
                                    SECURE_SESSION_TERMINATION
                                </span>
                            </div>
                            <button
                                onClick={onCancel}
                                className="text-white/40 hover:text-white transition-colors"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="flex flex-col items-center text-center gap-4 py-2">
                            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/30 text-red-500 animate-bounce">
                                <ShieldAlert size={32} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-bold text-white uppercase tracking-wider">
                                    Terminate Active Session?
                                </h3>
                                <p className="text-xs text-white/50 leading-relaxed uppercase tracking-wide">
                                    Warning: You are about to disconnect from the secure academic portal. Any unsaved progress will be lost.
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-2">
                            <button
                                onClick={onCancel}
                                className="flex-1 border border-white/20 bg-white/5 py-3 text-xs font-bold text-white uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer"
                            >
                                ABORT_DISCONNECT
                            </button>
                            <button
                                onClick={onConfirm}
                                className="flex-1 bg-red-500 text-black py-3 text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.3)] hover:shadow-[0_0_25px_rgba(239,68,68,0.5)] cursor-pointer"
                            >
                                <LogOut size={14} />
                                CONFIRM_TERMINATE
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
