'use client';

import React from 'react';
import { Terminal } from 'lucide-react';

import { usePathname } from 'next/navigation';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const pathname = usePathname();

    React.useEffect(() => {
        const userId = sessionStorage.getItem('ctf_user_id');
        const role = sessionStorage.getItem('ctf_role');
        setIsLoggedIn(!!userId);
        setIsAdmin(role === 'admin');
    }, [pathname]);

    const handleLogout = () => {
        sessionStorage.removeItem('ctf_user_id');
        sessionStorage.removeItem('ctf_username');
        sessionStorage.removeItem('ctf_role');
        window.location.href = '/login';
    };

    if (pathname === '/admin-login' || pathname === '/admin') {
        return null;
    }

    return (
        <header className="sticky top-0 z-[100] border-b border-hacker-green/[0.15] bg-black/40 backdrop-blur-xl px-8 py-6 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="mx-auto flex max-w-7xl items-center justify-between">

                {/* Logo Section */}
                <div
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => window.location.href = '/'}
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--background)] border border-hacker-green/30 group-hover:border-hacker-green shadow-[0_0_10px_rgba(0,255,102,0.1)] group-hover:shadow-[0_0_15px_rgba(0,255,102,0.4)] transition-all">
                        <Terminal size={22} className="text-hacker-green" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-xl font-bold tracking-tight text-white leading-tight">
                            CTF <span className="text-hacker-green">Challenges</span>
                        </span>
                        <span className="text-[11px] text-white/70 font-medium">
                            Academic Portal
                        </span>
                    </div>
                </div>

                {/* Navigation Links */}
                <nav className="hidden lg:flex items-center gap-10 text-[15px] font-medium text-white/80 capitalize">

                    {isLoggedIn && (
                        <>
                            <a href="/challenges" className="relative hover:text-white transition-colors group/link">
                                Challenges
                                <span className="absolute -bottom-6 left-0 w-0 h-[2px] bg-hacker-green transition-all duration-300 group-hover/link:w-full group-hover/link:shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                            </a>
                            <a href="/completed" className="relative hover:text-white transition-colors group/link">
                                Completed
                                <span className="absolute -bottom-6 left-0 w-0 h-[2px] bg-hacker-green transition-all duration-300 group-hover/link:w-full group-hover/link:shadow-[0_0_8px_rgba(0,255,102,0.8)]"></span>
                            </a>
                        </>
                    )}
                </nav>

                {/* Call to Action */}
                <div className="flex items-center gap-6 w-[160px] justify-end">
                    {!isLoggedIn ? (
                        <button
                            onClick={() => window.location.href = '/login'}
                            className="bg-hacker-white text-hacker-black px-6 py-2 text-[14px] font-medium transition-all hover:bg-hacker-green shadow-[0_0_15px_rgba(0,255,102,0.2)] rounded-lg"
                        >
                            Authorize
                        </button>
                    ) : (
                        <button
                            onClick={handleLogout}
                            className="text-[#cbd5e1] border border-white/10 bg-black/50 px-5 py-2 rounded-lg hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-bold tracking-wider"
                        >
                            X TERMINATE
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}
