'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserCircle, Save, Github, Linkedin, Globe, LogOut, Camera, Loader2, Key, Terminal } from 'lucide-react';
import { supabase, Profile } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<Profile | null>(null);
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const router = useRouter();

    useEffect(() => {
        getProfile();
    }, []);

    async function getProfile() {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push('/login');
                return;
            }

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (error) throw error;
            setProfile(data);
            setUsername(data.username || '');
            setBio(data.bio || '');
        } catch (e: any) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }

    async function updateProfile() {
        setSaving(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { error } = await supabase
                .from('profiles')
                .update({
                    username,
                    bio,
                    updated_at: new Date().toISOString()
                })
                .eq('id', session.user.id);

            if (error) throw error;
            alert("PROFILE_UPDATE: SUCCESSFUL // METADATA_SYNCED");
            getProfile();
        } catch (e: any) {
            alert("SYNC_ERROR: " + e.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return (
        <div className="flex h-[60vh] items-center justify-center">
            <Loader2 className="animate-spin text-hacker-green" size={48} />
        </div>
    );

    return (
        <div className="flex flex-col gap-16 pb-20 font-mono">
            {/* Header Info */}
            <div className="flex flex-col gap-4 border-b border-hacker-border pb-10">
                <h1 className="text-4xl font-black text-white tracking-widest uppercase">OPERATIVE_ID.<span className="text-hacker-green">CONF</span></h1>
                <div className="flex items-center gap-6 text-[10px] text-white/40 tracking-[0.3em] font-bold uppercase">
                    <span className="flex items-center gap-2"><Key size={14} className="text-hacker-green" /> ENCRYPTED_STORAGE</span>
                    <span className="flex items-center gap-2 border-l border-hacker-border pl-6">LVL_4_CLEARANCE_ACTIVE</span>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Left: Avatar & Quick Info */}
                <div className="lg:col-span-4 flex flex-col gap-8">
                    <div className="brutalist-card bg-black border-hacker-green/30 p-10 flex flex-col items-center gap-8 relative overflow-hidden group">
                        <div className="relative h-48 w-48">
                            <div className="absolute inset-0 border-2 border-hacker-green/20 animate-spin-slow"></div>
                            <div className="absolute inset-2 border border-hacker-green flex items-center justify-center bg-black overflow-hidden group-hover:border-white transition-colors">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <UserCircle size={100} className="text-hacker-green/50 group-hover:text-hacker-green" />
                                )}
                            </div>
                            <button className="absolute bottom-2 right-2 h-10 w-10 bg-white text-black hover:bg-hacker-green transition-colors flex items-center justify-center shadow-xl">
                                <Camera size={18} />
                            </button>
                        </div>

                        <div className="text-center">
                            <h2 className="text-2xl font-black text-white group-hover:text-hacker-green transition-colors">{profile?.username || 'ANON_OPERATIVE'}</h2>
                            <p className="text-[10px] text-hacker-green font-bold tracking-[0.3em] mt-2">{profile?.rank}</p>
                        </div>

                        <div className="w-full flex flex-col gap-4 pt-4 border-t border-hacker-border">
                            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                                <span className="text-white/30">SYSTEM_XP</span>
                                <span className="text-white">{profile?.score || 0}</span>
                            </div>
                            <div className="h-1 w-full bg-hacker-border overflow-hidden">
                                <div className="h-full bg-hacker-green w-1/2"></div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => supabase.auth.signOut().then(() => router.push('/login'))}
                        className="w-full border border-red-500/20 bg-red-500/5 py-4 font-mono text-xs font-bold text-red-500 uppercase tracking-[0.3em] hover:bg-red-500 hover:text-black transition-all flex items-center justify-center gap-3"
                    >
                        <LogOut size={16} /> TERMINATE_SESSION
                    </button>
                </div>

                {/* Right: Settings Form */}
                <div className="lg:col-span-8 flex flex-col gap-4">
                    <div className="brutalist-card bg-black p-10 flex flex-col gap-10">
                        <div className="flex justify-between items-center border-b border-hacker-border pb-6">
                            <h3 className="text-xs font-bold text-white tracking-[0.2em] flex items-center gap-2">
                                <Terminal size={14} className="text-hacker-green" /> OPERATIVE_METADATA
                            </h3>
                            <span className="text-[10px] text-white/30 lowercase">last_sync: 02.01.2024</span>
                        </div>

                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">OPS_HANDLE</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="bg-hacker-gray border border-hacker-border p-4 font-mono text-xs text-white focus:border-hacker-green outline-none transition-all uppercase"
                                />
                            </div>
                            <div className="flex flex-col gap-3">
                                <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">SECURE_EMAIL</label>
                                <input
                                    disabled
                                    type="text"
                                    value={profile?.email || 'UNSET'}
                                    className="bg-black border border-hacker-border p-4 font-mono text-xs text-white/30 cursor-not-allowed opacity-50"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest">MISSION_BIO_OVERRIDE</label>
                            <textarea
                                rows={4}
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                className="bg-hacker-gray border border-hacker-border p-4 font-mono text-xs text-white focus:border-hacker-green outline-none transition-all resize-none"
                                placeholder="INITIALIZE_MISSION_BIO..."
                            />
                        </div>

                        <div className="flex justify-end pt-6 border-t border-hacker-border">
                            <button
                                onClick={updateProfile}
                                disabled={saving}
                                className="flex items-center gap-3 bg-hacker-green text-black px-10 py-5 font-black uppercase tracking-widest text-xs hover:bg-white transition-all shadow-xl disabled:opacity-50"
                            >
                                {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                {saving ? 'SYNCING...' : 'COMMIT_CHANGES'}
                            </button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-1 bg-hacker-border border border-hacker-border mt-4">
                        <SocialLink icon={<Github size={18} />} label="GIT_SOURCE" val="LINK_PENDING" />
                        <SocialLink icon={<Linkedin size={18} />} label="NET_ID" val="LINK_PENDING" />
                        <SocialLink icon={<Globe size={18} />} label="OPS_WEBSITE" val="LINK_PENDING" />
                    </div>
                </div>
            </div>
        </div>
    );
}

function SocialLink({ icon, label, val }: { icon: React.ReactNode, label: string, val: string }) {
    return (
        <div className="bg-black p-8 hover:bg-hacker-gray flex flex-col gap-3 group transition-colors">
            <div className="text-white/30 group-hover:text-hacker-green transition-colors">{icon}</div>
            <div>
                <div className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">{label}</div>
                <div className="text-[10px] font-bold text-white group-hover:text-hacker-green transition-colors">{val}</div>
            </div>
        </div>
    );
}
