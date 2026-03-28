'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { ShieldAlert, Users, Server, Terminal, Trash2, Edit, Plus, X, Laptop2, Fingerprint } from 'lucide-react';

export default function AdminDashboard() {
    const router = useRouter();

    // States
    const [loading, setLoading] = useState(true);
    const [students, setStudents] = useState<any[]>([]);
    const [logins, setLogins] = useState<any[]>([]);
    const [stats, setStats] = useState<Record<string, any>>({});
    const [adminId, setAdminId] = useState<string | null>(null);

    // Modal States
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [activeStudent, setActiveStudent] = useState<any>(null);

    // Form States
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const role = sessionStorage.getItem('ctf_role');
        const aid = sessionStorage.getItem('ctf_user_id');

        if (role !== 'admin' || !aid) {
            router.push('/challenges');
            return;
        }
        setAdminId(aid);
        fetchData();
    }, [router]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch pure students
            const { data: userData, error: userErr } = await supabase
                .from('ctf_users')
                .select('*')
                .eq('role', 'student')
                .order('created_at', { ascending: false });

            if (userErr) throw userErr;
            setStudents(userData || []);

            // Fetch recent 50 Login Records
            const { data: loginData, error: loginErr } = await supabase
                .from('login_records')
                .select(`id, user_id, device_info, ip_address, login_time, ctf_users(username)`)
                .order('login_time', { ascending: false })
                .limit(50);

            if (loginErr) throw loginErr;
            setLogins(loginData || []);

            // Fetch Score details inside Completions via challenges join
            const { data: compData, error: compErr } = await supabase
                .from('completed_challenges')
                .select(`user_id, ctf_challenges(score, points_xp)`);

            if (compErr) throw compErr;

            // Map stats: Total Score, Total XP natively extracted, Completion Count
            const tempStats: Record<string, { count: number, score: number, xp: number }> = {};

            if (compData) {
                compData.forEach((c: any) => {
                    const uid = c.user_id;
                    if (!tempStats[uid]) tempStats[uid] = { count: 0, score: 0, xp: 0 };

                    const score = c.ctf_challenges?.score || 0;
                    const xpStr = c.ctf_challenges?.points_xp || '0';
                    const xpRaw = parseInt(xpStr.replace(/[^0-9]/g, '')) || 0;

                    tempStats[uid].count += 1;
                    tempStats[uid].score += score;
                    tempStats[uid].xp += xpRaw;
                });
            }

            setStats(tempStats);
        } catch (err) {
            console.error('Admin Fetch Err:', err);
            alert("Failed to load admin nodes. Run database scripts fully.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async () => {
        if (!usernameInput || !passwordInput || !adminId) return;
        setActionLoading(true);
        try {
            const { data, error } = await supabase.rpc('admin_add_student', {
                p_admin_id: adminId,
                p_username: usernameInput,
                p_password: passwordInput
            });

            if (error) throw error;
            if (!data.success) {
                alert(data.message);
            } else {
                setShowAddModal(false);
                setUsernameInput('');
                setPasswordInput('');
                fetchData();
            }
        } catch (err: any) {
            console.error(err);
            alert('Failed to add student. Ensure SQL is updated.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleModifyStudent = async () => {
        if (!activeStudent || !adminId) return;
        setActionLoading(true);
        try {
            const { data, error } = await supabase.rpc('admin_modify_student', {
                p_admin_id: adminId,
                p_student_id: activeStudent.id,
                p_username: usernameInput, // New or same
                p_new_password: passwordInput // Optional
            });

            if (error) throw error;
            if (!data.success) {
                alert(data.message);
            } else {
                setShowEditModal(false);
                setActiveStudent(null);
                setUsernameInput('');
                setPasswordInput('');
                fetchData();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setActionLoading(false);
        }
    };

    const handleRemoveStudent = async (id: string, name: string) => {
        if (!confirm(`Warning: Delete Operative ${name}? This action is permanent.`)) return;

        try {
            const { error } = await supabase.from('ctf_users').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (err) {
            console.error(err);
            alert("Delete restriction encountered.");
        }
    };

    const openEdit = (s: any) => {
        setActiveStudent(s);
        setUsernameInput(s.username);
        setPasswordInput('');
        setShowEditModal(true);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="flex flex-col items-center gap-4 text-red-500 font-mono text-sm tracking-widest uppercase animate-pulse">
                    <ShieldAlert size={32} /> Authenticating Admin Access...
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-10 py-10 fade-in px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-red-500/20">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Terminal size={28} className="text-red-500" />
                        <h1 className="text-4xl text-white tracking-widest uppercase">Admin Nexus</h1>
                    </div>
                    <p className="text-[#cbd5e1]/60 font-mono text-sm">
                        Global Operational Overview. Full manipulation authority granted.
                    </p>
                </div>
                <button
                    onClick={() => { setShowAddModal(true); setUsernameInput(''); setPasswordInput(''); }}
                    className="flex items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 px-6 py-3 rounded-lg hover:bg-red-500/20 transition-all font-bold text-sm"
                >
                    <Plus size={16} /> Deploy Operative
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Operatives Roster */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <h3 className="text-sm text-red-500 font-bold uppercase flex items-center gap-2 tracking-widest">
                        <Users size={16} /> Operatives Registry
                    </h3>

                    <div className="bg-[#0b0f14]/80 border border-white/5 rounded-xl overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left font-mono text-sm min-w-[700px]">
                                <thead className="bg-black/50 text-[#cbd5e1]/50 border-b border-white/5 text-[10px] uppercase tracking-[0.2em]">
                                    <tr>
                                        <th className="p-4">Operative ID</th>
                                        <th className="p-4">Cleared</th>
                                        <th className="p-4">Total Score</th>
                                        <th className="p-4">Rank/Perf</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[#cbd5e1]">
                                    {students.map((student) => {
                                        const sData = stats[student.id] || { count: 0, score: 0, xp: 0 };
                                        let rank = "RECRUIT";
                                        let rColor = "text-gray-400";

                                        if (sData.score > 2000) { rank = "ELITE"; rColor = "text-red-400"; }
                                        else if (sData.score > 1000) { rank = "VETERAN"; rColor = "text-hacker-green"; }
                                        else if (sData.score > 300) { rank = "SPECIALIST"; rColor = "text-yellow-400"; }

                                        return (
                                            <tr key={student.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                                                <td className="p-4 flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded bg-black/50 border border-white/10 flex items-center justify-center text-red-500">
                                                        <Fingerprint size={14} />
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-bold">{student.username}</div>
                                                        <div className="text-[10px] text-white/30">{student.id.split('-')[0]}...</div>
                                                    </div>
                                                </td>
                                                <td className="p-4">{sData.count} Nodes</td>
                                                <td className="p-4">
                                                    <span className="text-hacker-green">{sData.score} PTS</span>
                                                    <span className="text-white/30 ml-2">({sData.xp} XP)</span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`${rColor} font-black text-xs`}>{rank}</span>
                                                </td>
                                                <td className="p-4 flex justify-end gap-2">
                                                    <button onClick={() => openEdit(student)} className="p-2 text-[#cbd5e1]/40 hover:text-white transition-colors bg-white/5 rounded"><Edit size={14} /></button>
                                                    <button onClick={() => handleRemoveStudent(student.id, student.username)} className="p-2 text-red-500/40 hover:text-red-500 transition-colors bg-red-500/5 rounded"><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Login Trace Dashboard */}
                <div className="flex flex-col gap-6">
                    <h3 className="text-sm text-red-500 font-bold uppercase flex items-center gap-2 tracking-widest">
                        <Server size={16} /> Device Traffic Stream
                    </h3>

                    <div className="bg-[#0b0f14]/80 border border-white/5 rounded-xl p-4 flex flex-col gap-3 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {logins.map((lg) => (
                            <div key={lg.id} className="p-4 flex flex-col gap-2 bg-black/40 border-l-2 border-red-500 rounded-sm">
                                <div className="flex justify-between items-center text-xs font-mono">
                                    <span className="text-white font-bold">{lg.ctf_users?.username || 'Unknown'}</span>
                                    <span className="text-red-500/50">{new Date(lg.login_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="text-[10px] text-[#cbd5e1]/40 font-mono lead grid gap-1">
                                    <span className="flex items-center gap-1"><Laptop2 size={10} className="text-red-500/50" /> {lg.device_info || 'Unknown Client'}</span>
                                    <span className="text-red-500/50">IP: {lg.ip_address || 'Local/Proxy'}</span>
                                </div>
                            </div>
                        ))}
                        {logins.length === 0 && (
                            <div className="text-center text-white/20 font-mono text-xs py-10">No streams available</div>
                        )}
                    </div>
                </div>

            </div>

            {/* Modals for Add / Edit */}
            {(showAddModal || showEditModal) && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0b0f14] border border-red-500/30 w-full max-w-sm rounded-xl overflow-hidden">
                        <div className="p-5 border-b border-red-500/20 flex justify-between items-center">
                            <h3 className="text-red-400 font-bold tracking-widest font-mono text-sm uppercase">
                                {showAddModal ? '+ INIT OPERATIVE' : 'x MODIFY OPERATIVE'}
                            </h3>
                            <button onClick={() => { setShowAddModal(false); setShowEditModal(false); }} className="text-red-500/50 hover:text-red-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 flex flex-col gap-5 border-l-4 border-l-red-500">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-white/50 uppercase font-mono">Username</label>
                                <input
                                    value={usernameInput} onChange={e => setUsernameInput(e.target.value)}
                                    className="bg-black border border-white/10 p-3 rounded text-sm text-white focus:border-red-400 outline-none font-mono"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] text-white/50 uppercase font-mono">
                                    {showEditModal ? 'New Password (Optional)' : 'Allocated Decryption Key'}
                                </label>
                                <input
                                    value={passwordInput} onChange={e => setPasswordInput(e.target.value)} type="password"
                                    className="bg-black border border-white/10 p-3 rounded text-sm text-white focus:border-red-400 outline-none font-mono"
                                />
                            </div>
                            <button
                                onClick={showAddModal ? handleAddStudent : handleModifyStudent}
                                disabled={actionLoading}
                                className="mt-4 w-full bg-red-500 text-black font-bold tracking-widest uppercase text-xs py-3 rounded hover:bg-red-400 transition-colors"
                            >
                                {actionLoading ? 'Compiling...' : 'EXECUTE'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
