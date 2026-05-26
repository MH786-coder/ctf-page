-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES Table (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  avatar_url text,
  bio text,
  role text DEFAULT 'user' CHECK (role IN ('developer', 'admin', 'user')),
  rank text DEFAULT 'GHOST_OPERATIVE',
  score integer DEFAULT 0,
  solves integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TOOLS Table
CREATE TABLE public.tools (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text NOT NULL,
  github_url text,
  demo_url text,
  category text NOT NULL,
  author_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  price decimal(10, 2) DEFAULT 0.00,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. TOOL_DEPLOYMENTS Table
CREATE TABLE public.tool_deployments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'deployed', 'failed')),
  deployment_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. REVIEWS Table
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id uuid NOT NULL REFERENCES public.tools(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_deployments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES

-- Profiles: Public can read, user can update own profile
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Tools: Everyone can see tools, only developers can insert/update their own
CREATE POLICY "Tools are viewable by everyone" ON public.tools
  FOR SELECT USING (true);

CREATE POLICY "Developers can insert their own tools" ON public.tools
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update their own tools" ON public.tools
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete their own tools" ON public.tools
  FOR DELETE USING (auth.uid() = author_id);

-- Deployments: User can see and manage their own deployments
CREATE POLICY "Users can view their own deployments" ON public.tool_deployments
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create deployments" ON public.tool_deployments
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Reviews: Everyone can read, authenticated can write one for a tool
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews
  FOR SELECT USING (true);

CREATE POLICY "Users can insert reviews" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- AUTOMATIC PROFILE CREATION ON SIGNUP (Supabase Trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'username', new.email, new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
