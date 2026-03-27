import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../index.css';
import Navbar from '@/components/Navbar';
import CyberAI from '@/components/CyberAI';
import Terminal from '@/components/Terminal';
import HackerCursor from '@/components/HackerCursor';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'ProWorldz - CTF',
    description: 'The next-generation cybersecurity developer platform. Deploy, automate, and protect at the edge.',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${inter.className} bg-black text-white min-h-screen relative overflow-x-hidden`}>
                {/* Ambient Grid Header/Background Overlay */}
                <div className="absolute inset-0 pointer-events-none -z-10 opacity-[0.4]">
                    <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-hacker-green/5 to-transparent"></div>
                </div>

                {/* Global Scanline Effect */}
                <div className="scanline"></div>

                <Navbar />

                <main className="mx-auto max-w-7xl px-8 pb-32 pt-12">
                    {children}
                </main>

                {/* Interactive Floating Agents */}
                <CyberAI />
                <Terminal />

                {/* Custom Hacker Cursor — Desktop Only */}
                <HackerCursor />
            </body>
        </html>
    );
}
