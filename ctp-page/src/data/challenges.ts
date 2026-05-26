export type Difficulty = 'BEGINNER' | 'EASY' | 'MEDIUM' | 'HARD' | 'INSANE';
export type Category = 'Web Exploitation' | 'Cryptography' | 'Reverse Engineering' | 'Forensics' | 'OSINT' | 'Steganography' | 'Binary Basics' | 'AI Security';

export interface Challenge {
    id: string;
    title: string;
    category: Category;
    points: number;
    difficulty: Difficulty;
    story: string;
    description: string;
    flag: string;
    hints: string[];
    learningConcept?: {
        title: string;
        explanation: string;
    };
    solves?: number;
}

export const CHALLENGES: Challenge[] = [
    // --- WEB EXPLOITATION (4) ---
    {
        id: 'web-1', title: 'Hidden Comment', category: 'Web Exploitation', points: 50, difficulty: 'BEGINNER',
        story: 'The target site claims to have no secrets.',
        description: 'Find the flag hidden in the page source.',
        flag: 'FLAG{v1s1bl3_html_m4rkup}',
        hints: ['Check the page source.', 'Look for comments.', 'Ctrl+U is your friend.'],
        learningConcept: { title: 'HTML Comments', explanation: 'Developers often leave secrets in comments.' },
        solves: 1242
    },
    {
        id: 'web-2', title: 'Local Secrets', category: 'Web Exploitation', points: 150, difficulty: 'EASY',
        story: 'Client-side storage is always safe, right?',
        description: 'Retrieve the session token from the browser storage.',
        flag: 'FLAG{l0c4lst0r4g3_h1j4ck}',
        hints: ['Open DevTools.', 'Check Application tab.', 'Look for Local Storage values.'],
        solves: 894
    },
    {
        id: 'web-3', title: 'JWT Tamper', category: 'Web Exploitation', points: 300, difficulty: 'MEDIUM',
        story: 'The server trusts the payload implicitly.',
        description: 'A JWT payload contains the flag. Decode it.',
        flag: 'FLAG{jwt_manipulation_master}',
        hints: ['JWTs have 3 parts.', 'The middle part is the payload.', 'Decode from Base64.'],
        solves: 432
    },
    {
        id: 'web-4', title: 'IDOR Access', category: 'Web Exploitation', points: 400, difficulty: 'HARD',
        story: 'The portal uses user IDs to fetch profiles.',
        description: 'Bypass authorization to see the admin profile.',
        flag: 'FLAG{br0k3n_4cc3ss_c0ntr0l_pwn}',
        hints: ['Watch the URL parameters.', 'Change your ID to 1.', 'Check for user roles in HTML.'],
        solves: 156
    },

    // --- CRYPTOGRAPHY (4) ---
    {
        id: 'cry-1', title: 'Base64 Intro', category: 'Cryptography', points: 50, difficulty: 'BEGINNER',
        story: 'Standard web encoding format.',
        description: 'Decode this: RkxBR3tiYXNlNjRfZTEwMX0=',
        flag: 'FLAG{base64_e101}',
        hints: ['Notice the == padding?', 'Base64 isn\'t encryption.', 'Use an online decoder.'],
        learningConcept: { title: 'Base64', explanation: 'Encoding that maps bytes to ASCII characters.' },
        solves: 2102
    },
    {
        id: 'cry-2', title: 'Caesar Cipher', category: 'Cryptography', points: 100, difficulty: 'EASY',
        story: 'A classic Roman secret.',
        description: 'Decrypt: YETX{vtljtk_vzgytk_tqtekw}',
        flag: 'FLAG{caesar_cipher_cracked}',
        hints: ['Simple letter shift.', 'Try ROT13 or brute force.', 'There are 26 possible versions.'],
        solves: 1540
    },
    {
        id: 'cry-3', title: 'XOR Bitwise', category: 'Cryptography', points: 300, difficulty: 'MEDIUM',
        story: 'Encryption at the bit level.',
        description: 'Decrypt: 2D 29 28 20 10 03 12 17 (Key: key)',
        flag: 'FLAG{x0r_m4st3r_2026}',
        hints: ['Use an XOR calculator.', 'Convert "key" to hex first.', 'XOR byte by byte.'],
        solves: 621
    },
    {
        id: 'cry-4', title: 'Multi-Cipher', category: 'Cryptography', points: 500, difficulty: 'INSANE',
        story: 'Layers of obscurity.',
        description: 'Shift then Encode. U0VORXtlMGlfMTNfZzBiNTZfbzRiNn0=',
        flag: 'FLAG{r0t_13_b4s64_c0mb0}',
        hints: ['Reverse the last step first.', 'Base64 decode first.', 'Then ROT13 decode.'],
        solves: 78
    },

    // --- REVERSE ENGINEERING (4) ---
    { id: 'rev-1', title: 'Simple JS Rev', category: 'Reverse Engineering', points: 100, difficulty: 'EASY', story: 'Read the logic.', description: 'Analyze the obfuscated script provided.', flag: 'FLAG{0bfusc4t3d_js_pwn3d}', hints: ['Check the variables.', 'Unminify the file.', 'Follow the string concatenation.'], solves: 781 },
    { id: 'rev-2', title: 'Binary Strings', category: 'Reverse Engineering', points: 200, difficulty: 'MEDIUM', story: 'Static analysis.', description: 'Find the embedded secret in the ELF binary.', flag: 'FLAG{strings_r_useful}', hints: ['Use the "strings" command.', 'Look for FLAG format.', 'Don\'t run the binary yet.'], solves: 412 },
    { id: 'rev-3', title: 'Assembly Logic', category: 'Reverse Engineering', points: 350, difficulty: 'HARD', story: 'Opcode hunting.', description: 'if (eax == 0x1337) yield FLAG.', flag: 'FLAG{cr4ckm3_1337}', hints: ['0x1337 is hex.', 'Compare instruction is CMP.', 'EAX is the accumulator.'], solves: 121 },
    { id: 'rev-4', title: 'Malware Sandbox', category: 'Reverse Engineering', points: 500, difficulty: 'INSANE', story: 'Dynamic analysis.', description: 'A binary connects to a specific C&C domain.', flag: 'FLAG{cnc_server_found_2026}', hints: ['Check network calls.', 'Use Wireshark or ltrace.', 'Look for HTTP requests.'], solves: 32 },

    // --- FORENSICS (4) ---
    { id: 'for-1', title: 'Magic Bytes', category: 'Forensics', points: 150, difficulty: 'EASY', story: 'File corruption.', description: 'Fix the JPEG header to view the flag.', flag: 'FLAG{m4g1c_byt3s_f1x3d}', hints: ['Every file has a signature.', 'JPEG header starts with FF D8 FF.', 'Edit the file hex.'], solves: 890 },
    { id: 'for-2', title: 'EXIF Extraction', category: 'Forensics', points: 200, difficulty: 'MEDIUM', story: 'Hidden metadata.', description: 'Find the location flag in the image metadata.', flag: 'FLAG{3x1f_m3t4d4t4_hckr}', hints: ['Use exiftool.', 'Check GPS coordinates.', 'Look at the "Comment" field.'], solves: 512 },
    { id: 'for-3', title: 'Log Analysis', category: 'Forensics', points: 300, difficulty: 'HARD', story: 'The breach trail.', description: 'Analyze the Apache logs for the malicious UA.', flag: 'FLAG{m4l1c10us_us3r_4g3nt}', hints: ['Filter by unusual IPs.', 'Look for suspicious user agents.', 'Search for flag patterns.'], solves: 210 },
    { id: 'for-4', title: 'Memory Dump', category: 'Forensics', points: 450, difficulty: 'INSANE', story: 'RAM acquisition.', description: 'Extract the flag from the virtual memory dump.', flag: 'FLAG{v0l4t1l3_m3m0ry_pwn}', hints: ['Use Volatility framework.', 'Scan for processes.', 'Dump the sensitive process memory.'], solves: 45 },

    // --- OSINT (4) ---
    { id: 'osi-1', title: 'Mystery Developer', category: 'OSINT', points: 100, difficulty: 'EASY', story: 'The first commit.', description: 'Who committed linux code in 1991?', flag: 'FLAG{linus_torvalds}', hints: ['Creator of Linux.', 'Wikipedia search.', 'Format as FLAG{firstname_lastname}.'], solves: 1520 },
    { id: 'osi-2', title: 'GitHub Treasure', category: 'OSINT', points: 200, difficulty: 'MEDIUM', story: 'Leaked keys.', description: 'A developer accidentally pushed an AWS key. Find the repo.', flag: 'FLAG{git_log_secrets}', hints: ['Search GitHub repositories.', 'Check commit history.', 'Look for "AWS_SECRET".'], solves: 631 },
    { id: 'osi-3', title: 'Google Dorking', category: 'OSINT', points: 100, difficulty: 'BEGINNER', story: 'Advanced search.', description: 'Search for private PDF files on cyberai.lab.', flag: 'FLAG{filetype:pdf}', hints: ['Use filetype: operator.', 'Restrict search by domain.', 'Google operators are key.'], solves: 1890 },
    { id: 'osi-4', title: 'Whols Lookup', category: 'OSINT', points: 150, difficulty: 'EASY', story: 'Domain ownership.', description: 'Find the registrar for google.com.', flag: 'FLAG{markmonitor_inc}', hints: ['Use whois tool.', 'Look at Registrar field.', 'Format matches the exact text.'], solves: 940 },

    // --- STEGANOGRAPHY (4) ---
    { id: 'stg-1', title: 'LSB Hide', category: 'Steganography', points: 200, difficulty: 'MEDIUM', story: 'Pixel manipulation.', description: 'Extract data from the least significant bits.', flag: 'FLAG{lsb_m4st3r}', hints: ['Check pixel values.', 'Use StegSolve.', 'Look for bit shifts.'], solves: 421 },
    { id: 'stg-2', title: 'Audio Specter', category: 'Steganography', points: 300, difficulty: 'HARD', story: 'Visual sound.', description: 'Analyze the audio spectrogram.', flag: 'FLAG{sp3ctr0gr4m_t3xt}', hints: ['Open in Audacity.', 'Switch to Spectrogram view.', 'Read the visual text.'], solves: 219 },
    { id: 'stg-3', title: 'Snow White', category: 'Steganography', points: 150, difficulty: 'EASY', story: 'Whitespace hiding.', description: 'Find the flag in the "empty" text file.', flag: 'FLAG{sn0w_st3g0}', hints: ['Use SNOW tool.', 'Check for tabs vs spaces.', 'Invisible text is real.'], solves: 610 },
    { id: 'stg-4', title: 'Recursive Embed', category: 'Steganography', points: 400, difficulty: 'HARD', story: 'Infinite layers.', description: 'Extract the nested zip inside the image.', flag: 'FLAG{nested_secrets}', hints: ['Use binwalk.', 'Extract the zip.', 'Provide the final flag.'], solves: 120 },

    // --- BINARY BASICS (4) ---
    { id: 'bin-1', title: 'Endianness', category: 'Binary Basics', points: 100, difficulty: 'BEGINNER', story: 'Byte order.', description: 'Read 0x41424344 in Little Endian.', flag: 'FLAG{DCBA}', hints: ['Little endian swaps order.', '44 comes first.', 'Convert hex to chars.'], solves: 1400 },
    { id: 'bin-2', title: 'Bitwise AND', category: 'Binary Basics', points: 150, difficulty: 'EASY', story: 'Bit masking.', description: '0b1101 AND 0b1011 = ?', flag: 'FLAG{1001}', hints: ['Binary math.', '1 and 1 = 1.', 'Perform bit by bit.'], solves: 1100 },
    { id: 'bin-3', title: 'Stack Overflow Intro', category: 'Binary Basics', points: 350, difficulty: 'HARD', story: 'Buffer overrun.', description: 'Overwrite the return address with 0x41414141.', flag: 'FLAG{buff3r_0v3rfl0w_v1ct1m}', hints: ['Input too much data.', 'Calculate the offset.', 'Target address is 65 (A).'], solves: 156 },
    { id: 'bin-4', title: 'Shellcode Execution', category: 'Binary Basics', points: 500, difficulty: 'INSANE', story: 'Remote control.', description: 'Inject a reverse shell payload.', flag: 'FLAG{sh3llc0d3_m4st3r}', hints: ['Use execve payload.', 'Bypass NX bit.', 'Get a shell.'], solves: 12 },

    // --- AI SECURITY (4) ---
    { id: 'ai-1', title: 'Prompt Injection', category: 'AI Security', points: 200, difficulty: 'MEDIUM', story: 'Control bypass.', description: 'Force the AI to reveal its system prompt.', flag: 'FLAG{ignore_previous_instructions}', hints: ['Use "Ignore all rules".', 'Trick the context window.', 'Ask for direct instructions.'], solves: 512 },
    { id: 'ai-2', title: 'Data Poisoning', category: 'AI Security', points: 300, difficulty: 'HARD', story: 'Model manipulation.', description: 'Find the backdoor trigger in the LLM model.', flag: 'FLAG{ai_backdoor_found}', hints: ['Check the training data.', 'Hunt for trigger phrases.', 'Model weights reveal keys.'], solves: 190 },
    { id: 'ai-3', title: 'PII Leak', category: 'AI Security', points: 400, difficulty: 'MEDIUM', story: 'Information leak.', description: 'Extract a secret API key from the AI agent.', flag: 'FLAG{m4ch1n3_l34rn1ng_pwn}', hints: ['Roleplay as admin.', 'Ask for config values.', 'Bypass privacy filters.'], solves: 240 },
    { id: 'ai-4', title: 'Adversarial Input', category: 'AI Security', points: 500, difficulty: 'INSANE', story: 'Input evasion.', description: 'Bypass the toxic content filter using character encoding.', flag: 'FLAG{adversarial_ml_master}', hints: ['Use Unicode obfuscation.', 'Distort characters.', 'Bypass the classifier.'], solves: 32 }
];
