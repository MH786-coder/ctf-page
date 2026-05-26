import { createClient } from '@supabase/supabase-js';

// Supabase Credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single unified client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Profile {
    id: string;
    username: string;
    email: string;
    avatar_url?: string;
    bio?: string;
    role: 'admin' | 'student' | 'user';
    rank: string;
    score: number;
    solves: number;
    created_at: string;
}

export interface Tool {
    id: string;
    name: string;
    description: string;
    github_url?: string;
    demo_url?: string;
    category: string;
    author_id: string;
    price: number;
    created_at: string;
}

export interface Deployment {
    id: string;
    tool_id: string;
    user_id: string;
    status: 'pending' | 'running' | 'deployed' | 'failed';
    deployment_url?: string;
    created_at: string;
}

export interface Review {
    id: string;
    tool_id: string;
    user_id: string;
    rating: number;
    comment?: string;
    created_at: string;
}

export interface LeaderboardEntry {
    user_id: string;
    username: string;
    avatar_url?: string;
    score: number;
    solves: number;
    rank: string;
}
