'use client';

import React from 'react';

export default function HiddenCommentChallenge() {
    return (
        <div className="min-h-screen bg-white text-black p-10 font-serif">
            <header className="border-b-2 border-black pb-4 mb-10">
                <h1 className="text-4xl font-bold">Secure Corporate Portal</h1>
                <p className="italic text-gray-600">Established 1998 - 100% Security Guaranteed</p>
            </header>

            <main className="max-w-2xl mx-auto">
                <section className="mb-8">
                    <h2 className="text-2xl font-bold mb-4 underline">About Our Security</h2>
                    <p className="mb-4">
                        Our corporate portal utilizes the most advanced security measures of the late 90s.
                        We believe in "Security through Obscurity" and "Not putting things in plain sight".
                    </p>
                    <p>
                        All our passwords are encrypted with a top-secret algorithm that we definitely didn't find on a BBS forum.
                    </p>
                </section>

                <section className="bg-gray-100 p-6 border-l-4 border-black">
                    <p className="font-bold">System Status: <span className="text-green-600">Operational</span></p>
                    <p>Last login: Administrator (3 seconds ago)</p>
                </section>

                {/* 
                    TODO: Remove the debugging flag before deployment.
                    We shouldn't leave secrets in the source code.
                    DEBUG_FLAG: FLAG{v1s1bl3_html_m4rkup}
                */}

                <footer className="mt-20 pt-4 border-t border-gray-300 text-xs text-gray-500">
                    &copy; 1998 SecureCorp Inc. All rights reserved.
                    Optimized for Netscape Navigator 4.0.
                </footer>
            </main>
        </div>
    );
}
