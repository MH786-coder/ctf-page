'use client';

import React, { useEffect, useState } from 'react';

export default function LocalSecretsChallenge() {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Set the flag in localStorage
        localStorage.setItem('session_token', 'FLAG{l0c4lst0r4g3_h1j4ck}');
        setIsLoaded(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-8 font-sans">
            <div className="max-w-4xl mx-auto">
                <nav className="flex justify-between items-center mb-12 bg-white p-4 rounded-lg shadow-sm border border-slate-200">
                    <div className="font-bold text-xl text-blue-600 tracking-tight">CloudSync Pro</div>
                    <div className="flex gap-6 text-sm font-medium text-slate-600">
                        <span className="hover:text-blue-600 cursor-pointer">Dashboard</span>
                        <span className="hover:text-blue-600 cursor-pointer">Settings</span>
                        <span className="border-l pl-6 border-slate-200">User: guest_1032</span>
                    </div>
                </nav>

                <main>
                    <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm mb-1 uppercase font-semibold">Storage Used</div>
                            <div className="text-2xl font-bold">1.2 GB / 5 GB</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm mb-1 uppercase font-semibold">Sync Status</div>
                            <div className="text-2xl font-bold text-green-600 underline decoration-2 underline-offset-4">Active</div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="text-slate-500 text-sm mb-1 uppercase font-semibold">Security Level</div>
                            <div className="text-2xl font-bold text-blue-600 italic">Advanced</div>
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-xl font-bold mb-4">Account Security Notice</h2>
                        <p className="text-slate-600 mb-6 leading-relaxed">
                            Our platform uses "Invisible Persistent Tokens" to keep you logged in across browser refreshes.
                            These tokens are stored securely in your browser's local state where no one can find them.
                        </p>
                        <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg text-blue-800 text-sm">
                            <p className="font-semibold mb-1">💡 Security Tip</p>
                            <p>Never share your browser's Inspect Tool console output with anyone you don't trust!</p>
                        </div>
                    </div>
                </main>
            </div>
            {isLoaded && <div className="hidden">Data Initialized</div>}
        </div>
    );
}
