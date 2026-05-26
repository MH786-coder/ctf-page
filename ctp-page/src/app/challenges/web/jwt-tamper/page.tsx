'use client';

import React, { useEffect, useState } from 'react';

export default function JWTTamperChallenge() {
    const [token, setToken] = useState('');

    useEffect(() => {
        // Base64 encoded payload: {"user": "guest", "role": "user", "flag": "FLAG{jwt_manipulation_master}"}
        const jwtHeader = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        const jwtPayload = "eyJ1c2VyIjoiZ3Vlc3QiLCJyb2xlIjoidXNlciIsImZsYWciOiJGTEFHe2p3dF9tYW5pcHVsYXRpb25fbWFzdGVyfSJ9";
        const jwtSignature = "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        const fullToken = `${jwtHeader}.${jwtPayload}.${jwtSignature}`;

        document.cookie = `auth_token=${fullToken}; path=/;`;
        setToken(fullToken);
    }, []);

    return (
        <div className="min-h-screen bg-neutral-900 text-neutral-100 p-8 font-mono">
            <div className="max-w-3xl mx-auto border border-neutral-700 rounded-lg overflow-hidden shadow-2xl">
                <div className="bg-neutral-800 p-4 border-b border-neutral-700 flex justify-between items-center">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="text-xs text-neutral-400">SecureAuth Terminal v4.2</div>
                </div>

                <div className="p-8">
                    <h1 className="text-2xl font-bold mb-6 text-indigo-400">Authentication Node: 0x77A1</h1>

                    <div className="space-y-6">
                        <div className="bg-black/50 p-6 rounded border border-neutral-800">
                            <p className="text-emerald-400 mb-2 font-bold">STATUS: AUTHENTICATED</p>
                            <p className="text-sm text-neutral-400 leading-relaxed">
                                You are signed in as a "GUEST" user. Elevated privileges are required to access Restricted Data Segments.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <p className="text-sm font-bold text-neutral-400">SESSION TOKEN (DEBUG VIEW):</p>
                            <div className="bg-black p-4 rounded text-xs break-all text-neutral-500 border border-neutral-800 italic">
                                {token || "Initializing session..."}
                            </div>
                        </div>

                        <div className="bg-neutral-800/50 p-6 rounded-lg border-l-4 border-indigo-500">
                            <h2 className="text-lg font-bold mb-2">Restricted Area</h2>
                            <p className="text-sm text-neutral-400">
                                This section contains sensitive intelligence. The security layers verify the claims within your identity token.
                            </p>
                            <button className="mt-4 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm transition-colors opacity-50 cursor-not-allowed">
                                Access Admin Archives [LOCKED]
                            </button>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-800 p-3 text-[10px] text-center text-neutral-500 uppercase tracking-[0.2em]">
                    End of Transmission // No further data available for current privilege level
                </div>
            </div>
        </div>
    );
}
