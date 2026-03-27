-- Enable pgcrypto for secure password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Clear previous tables seamlessly
DROP TABLE IF EXISTS login_records CASCADE;
DROP TABLE IF EXISTS completed_challenges CASCADE;
DROP TABLE IF EXISTS ctf_challenges CASCADE;
DROP TABLE IF EXISTS ctf_users CASCADE;

-- 1. Create Custom Users Table
CREATE TABLE IF NOT EXISTS ctf_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Insert Admins & Dedicated Students
-- Admin Setup: jaiganesh & mohamed
INSERT INTO ctf_users (username, password_hash, role) VALUES
('jaiganesh', crypt('jangubaba', gen_salt('bf')), 'admin'),
('mohamed', crypt('jangubaba', gen_salt('bf')), 'admin');

-- Students Setup (10 char passwords)
INSERT INTO ctf_users (username, password_hash, role) VALUES
('smilin_jena', crypt('Sjena@2026', gen_salt('bf')), 'student'),
('banupriya_b', crypt('Banu#CTF26', gen_salt('bf')), 'student'),
('sarvesh_b', crypt('Sarv@!2026', gen_salt('bf')), 'student'),
('harish_p', crypt('Hari$h2026', gen_salt('bf')), 'student'),
('sudharshiini', crypt('Sudha!2026', gen_salt('bf')), 'student'),
('manthravar', crypt('Manthra!26', gen_salt('bf')), 'student'),
('v_ramesh', crypt('Ramesh@123', gen_salt('bf')), 'student'),
('gokul_nath', crypt('Gokul#2026', gen_salt('bf')), 'student'),
('p_sharani', crypt('Sharani!26', gen_salt('bf')), 'student'),
('sahana', crypt('Sahana@123', gen_salt('bf')), 'student'),
('dhanan_j', crypt('Dhanan#CTF', gen_salt('bf')), 'student'),
('suriya_p', crypt('Suriya!123', gen_salt('bf')), 'student')
ON CONFLICT (username) DO NOTHING;

-- 3. Live Login Records Table
CREATE TABLE IF NOT EXISTS login_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES ctf_users(id) ON DELETE CASCADE,
    device_info TEXT,
    ip_address TEXT,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Challenges Table
CREATE TABLE IF NOT EXISTS ctf_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    score INTEGER NOT NULL,
    points_xp TEXT NOT NULL,
    story TEXT,
    description TEXT,
    flag TEXT,
    solves INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(title)
);

-- Insert original 32 challenges
INSERT INTO ctf_challenges (title, category, difficulty, score, points_xp, story, description, flag, solves) VALUES
('Hidden Comment', 'Web Exploitation', 'BEGINNER', 50, '50', 'The target site claims to have no secrets.', 'Find the flag hidden in the page source.', 'FLAG{v1s1bl3_html_m4rkup}', 1242),
('Local Secrets', 'Web Exploitation', 'EASY', 150, '150', 'Client-side storage is always safe, right?', 'Retrieve the session token from the browser storage.', 'FLAG{l0c4lst0r4g3_h1j4ck}', 894),
('JWT Tamper', 'Web Exploitation', 'MEDIUM', 300, '300', 'The server trusts the payload implicitly.', 'A JWT payload contains the flag. Decode it.', 'FLAG{jwt_manipulation_master}', 432),
('IDOR Access', 'Web Exploitation', 'HARD', 400, '400', 'The portal uses user IDs to fetch profiles.', 'Bypass authorization to see the admin profile.', 'FLAG{br0k3n_4cc3ss_c0ntr0l_pwn}', 156),

('Base64 Intro', 'Cryptography', 'BEGINNER', 50, '50', 'Standard web encoding format.', 'Decode this: RkxBR3tiYXNlNjRfZTEwMX0=', 'FLAG{base64_e101}', 2102),
('Caesar Cipher', 'Cryptography', 'EASY', 100, '100', 'A classic Roman secret.', 'Decrypt: YETX{vtljtk_vzgytk_tqtekw}', 'FLAG{caesar_cipher_cracked}', 1540),
('XOR Bitwise', 'Cryptography', 'MEDIUM', 300, '300', 'Encryption at the bit level.', 'Decrypt: 2D 29 28 20 10 03 12 17 (Key: key)', 'FLAG{x0r_m4st3r_2026}', 621),
('Multi-Cipher', 'Cryptography', 'INSANE', 500, '500', 'Layers of obscurity.', 'Shift then Encode. U0VORXtlMGlfMTNfZzBiNTZfbzRiNn0=', 'FLAG{r0t_13_b4s64_c0mb0}', 78),

('Simple JS Rev', 'Reverse Engineering', 'EASY', 100, '100', 'Read the logic.', 'Analyze the obfuscated script provided.', 'FLAG{0bfusc4t3d_js_pwn3d}', 781),
('Binary Strings', 'Reverse Engineering', 'MEDIUM', 200, '200', 'Static analysis.', 'Find the embedded secret in the ELF binary.', 'FLAG{strings_r_useful}', 412),
('Assembly Logic', 'Reverse Engineering', 'HARD', 350, '350', 'Opcode hunting.', 'if (eax == 0x1337) yield FLAG.', 'FLAG{cr4ckm3_1337}', 121),
('Malware Sandbox', 'Reverse Engineering', 'INSANE', 500, '500', 'Dynamic analysis.', 'A binary connects to a specific C&C domain.', 'FLAG{cnc_server_found_2026}', 32),

('Magic Bytes', 'Forensics', 'EASY', 150, '150', 'File corruption.', 'Fix the JPEG header to view the flag.', 'FLAG{m4g1c_byt3s_f1x3d}', 890),
('EXIF Extraction', 'Forensics', 'MEDIUM', 200, '200', 'Hidden metadata.', 'Find the location flag in the image metadata.', 'FLAG{3x1f_m3t4d4t4_hckr}', 512),
('Log Analysis', 'Forensics', 'HARD', 300, '300', 'The breach trail.', 'Analyze the Apache logs for the malicious UA.', 'FLAG{m4l1c10us_us3r_4g3nt}', 210),
('Memory Dump', 'Forensics', 'INSANE', 450, '450', 'RAM acquisition.', 'Extract the flag from the virtual memory dump.', 'FLAG{v0l4t1l3_m3m0ry_pwn}', 45),

('Mystery Developer', 'OSINT', 'EASY', 100, '100', 'The first commit.', 'Who committed linux code in 1991?', 'FLAG{linus_torvalds}', 1520),
('GitHub Treasure', 'OSINT', 'MEDIUM', 200, '200', 'Leaked keys.', 'A developer accidentally pushed an AWS key. Find the repo.', 'FLAG{git_log_secrets}', 631),
('Google Dorking', 'OSINT', 'BEGINNER', 100, '100', 'Advanced search.', 'Search for private PDF files on cyberai.lab.', 'FLAG{filetype:pdf}', 1890),
('Whols Lookup', 'OSINT', 'EASY', 150, '150', 'Domain ownership.', 'Find the registrar for google.com.', 'FLAG{markmonitor_inc}', 940),

('LSB Hide', 'Steganography', 'MEDIUM', 200, '200', 'Pixel manipulation.', 'Extract data from the least significant bits.', 'FLAG{lsb_m4st3r}', 421),
('Audio Specter', 'Steganography', 'HARD', 300, '300', 'Visual sound.', 'Analyze the audio spectrogram.', 'FLAG{sp3ctr0gr4m_t3xt}', 219),
('Snow White', 'Steganography', 'EASY', 150, '150', 'Whitespace hiding.', 'Find the flag in the "empty" text file.', 'FLAG{sn0w_st3g0}', 610),
('Recursive Embed', 'Steganography', 'HARD', 400, '400', 'Infinite layers.', 'Extract the nested zip inside the image.', 'FLAG{nested_secrets}', 120),

('Endianness', 'Binary Basics', 'BEGINNER', 100, '100', 'Byte order.', 'Read 0x41424344 in Little Endian.', 'FLAG{DCBA}', 1400),
('Bitwise AND', 'Binary Basics', 'EASY', 150, '150', 'Bit masking.', '0b1101 AND 0b1011 = ?', 'FLAG{1001}', 1100),
('Stack Overflow Intro', 'Binary Basics', 'HARD', 350, '350', 'Buffer overrun.', 'Overwrite the return address with 0x41414141.', 'FLAG{buff3r_0v3rfl0w_v1ct1m}', 156),
('Shellcode Execution', 'Binary Basics', 'INSANE', 500, '500', 'Remote control.', 'Inject a reverse shell payload.', 'FLAG{sh3llc0d3_m4st3r}', 12),

('Prompt Injection', 'AI Security', 'MEDIUM', 200, '200', 'Control bypass.', 'Force the AI to reveal its system prompt.', 'FLAG{ignore_previous_instructions}', 512),
('Data Poisoning', 'AI Security', 'HARD', 300, '300', 'Model manipulation.', 'Find the backdoor trigger in the LLM model.', 'FLAG{ai_backdoor_found}', 190),
('PII Leak', 'AI Security', 'MEDIUM', 400, '400', 'Information leak.', 'Extract a secret API key from the AI agent.', 'FLAG{m4ch1n3_l34rn1ng_pwn}', 240),
('Adversarial Input', 'AI Security', 'INSANE', 500, '500', 'Input evasion.', 'Bypass the toxic content filter using character encoding.', 'FLAG{adversarial_ml_master}', 32)
ON CONFLICT DO NOTHING;

-- 5. Create Completions Table (Linking User to Challenge)
CREATE TABLE IF NOT EXISTS completed_challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES ctf_users(id) ON DELETE CASCADE,
    challenge_id UUID REFERENCES ctf_challenges(id) ON DELETE CASCADE,
    time_taken TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, challenge_id)
);

-- 6. Secure RPC Login Function + Analytics tracker
CREATE OR REPLACE FUNCTION verify_user_login(p_username TEXT, p_password TEXT, p_device_info TEXT, p_ip_address TEXT)
RETURNS json AS $$
DECLARE
    found_user RECORD;
BEGIN
    SELECT id, username, password_hash, role INTO found_user
    FROM ctf_users
    WHERE username = p_username;
    
    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'message', 'Invalid username or password');
    END IF;
    
    -- Verify password
    IF found_user.password_hash = crypt(p_password, found_user.password_hash) THEN
        -- Insert a login tracking event securely
        INSERT INTO login_records (user_id, device_info, ip_address) VALUES (found_user.id, p_device_info, p_ip_address);
        
        -- Return JWT simulator setup
        RETURN json_build_object('success', true, 'user_id', found_user.id, 'username', found_user.username, 'role', found_user.role);
    ELSE
        RETURN json_build_object('success', false, 'message', 'Invalid username or password');
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 7. Admin Action: Modify Student Function
CREATE OR REPLACE FUNCTION admin_modify_student(p_admin_id UUID, p_student_id UUID, p_username TEXT, p_new_password TEXT)
RETURNS json AS $$
DECLARE
    admin_check TEXT;
BEGIN
    -- Verify admin status
    SELECT role INTO admin_check FROM ctf_users WHERE id = p_admin_id;
    IF admin_check != 'admin' THEN
        RETURN json_build_object('success', false, 'message', 'Unauthorized. Admin role required.');
    END IF;

    -- Update fields based on provided arguments cleanly
    IF p_new_password != '' THEN
        UPDATE ctf_users SET username = COALESCE(NULLIF(p_username, ''), username), password_hash = crypt(p_new_password, gen_salt('bf')) WHERE id = p_student_id;
    ELSE
        UPDATE ctf_users SET username = COALESCE(NULLIF(p_username, ''), username) WHERE id = p_student_id;
    END IF;

    RETURN json_build_object('success', true, 'message', 'Student module modified securely.');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 8. Admin Action: Add Student Function
CREATE OR REPLACE FUNCTION admin_add_student(p_admin_id UUID, p_username TEXT, p_password TEXT)
RETURNS json AS $$
DECLARE
    admin_check TEXT;
    new_user_id UUID;
BEGIN
    SELECT role INTO admin_check FROM ctf_users WHERE id = p_admin_id;
    IF admin_check != 'admin' THEN
        RETURN json_build_object('success', false, 'message', 'Unauthorized. Admin role required.');
    END IF;

    BEGIN
        INSERT INTO ctf_users (username, password_hash, role) 
        VALUES (p_username, crypt(p_password, gen_salt('bf')), 'student')
        RETURNING id INTO new_user_id;
        
        RETURN json_build_object('success', true, 'user_id', new_user_id, 'message', 'Student registered');
    EXCEPTION WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'message', 'Username already exists.');
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
