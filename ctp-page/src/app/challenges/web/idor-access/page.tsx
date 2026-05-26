'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function IDORAccessChallenge() {
    const searchParams = useSearchParams();
    const [userId, setUserId] = useState<string | null>(null);
    const [profile, setProfile] = useState<any>(null);

    useEffect(() => {
        const id = searchParams.get('id') || '103';
        setUserId(id);

        // Simulated Database
        const users: Record<string, any> = {
            '1': {
                name: 'System Administrator',
                role: 'Admin',
                email: 'admin@secure-corp.internal',
                secret: 'FLAG{br0k3n_4cc3ss_c0ntr0l_pwn}',
                avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop'
            },
            '102': {
                name: 'Sarah Jenkins',
                role: 'Analyst',
                email: 'sarah.j@secure-corp.internal',
                secret: 'I love cats more than security.',
                avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop'
            },
            '103': {
                name: 'Guest User',
                role: 'Viewer',
                email: 'guest@public-access.com',
                secret: 'Nothing to see here.',
                avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop'
            }
        };

        if (users[id]) {
            setProfile(users[id]);
        } else {
            setProfile({
                name: 'Unknown User',
                role: 'N/A',
                email: 'N/A',
                secret: 'Error: Index Out of Bounds',
                avatar: null
            });
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-[#f0f2f5] text-[#1c1e21] font-sans">
            <header className="bg-[#1877f2] text-white p-4 shadow-md">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold italic tracking-tighter">SocialConnect</h1>
                    <div className="flex gap-4 items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-400"></div>
                        <span className="font-semibold">Guest</span>
                    </div>
                </div>
            </header>

            <main className="max-w-xl mx-auto mt-12 px-4">
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                    <div className="h-32 bg-gradient-to-r from-blue-400 to-indigo-500"></div>
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-center">
                            <div className="absolute -top-16 w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                                {profile?.avatar ? (
                                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">?</div>
                                )}
                            </div>
                        </div>

                        <div className="mt-20 text-center">
                            <h2 className="text-3xl font-bold">{profile?.name}</h2>
                            <p className="text-blue-600 font-semibold mb-6 uppercase text-sm tracking-widest">{profile?.role}</p>

                            <div className="space-y-4 text-left border-t pt-6">
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500 font-medium">User ID:</span>
                                    <span className="font-mono bg-gray-100 px-2 rounded italic text-red-600">{userId}</span>
                                </div>
                                <div className="flex justify-between border-b pb-2">
                                    <span className="text-gray-500 font-medium">Email:</span>
                                    <span>{profile?.email}</span>
                                </div>
                                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 mt-4">
                                    <p className="text-xs text-yellow-600 font-bold uppercase mb-2">Internal Note / Bio:</p>
                                    <p className="text-sm font-medium">{profile?.secret}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex gap-3">
                                <button className="flex-1 bg-[#e4e6eb] hover:bg-[#d8dadf] text-black font-bold py-2 rounded-lg transition-all">Message</button>
                                <button className="flex-1 bg-[#1877f2] hover:bg-[#1771e6] text-white font-bold py-2 rounded-lg transition-all">Add Friend</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 text-center text-gray-400 text-xs">
                    <p>Current Page URL: <code className="bg-gray-100 p-1 rounded">/challenges/web/idor-access?id={userId}</code></p>
                    <p className="mt-1 italic">Tip: Try changing the ID in the URL to find other profiles.</p>
                </div>
            </main>
        </div>
    );
}
