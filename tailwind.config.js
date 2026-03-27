/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'hacker-green': '#00ff66',
                'hacker-black': '#0b0f14',
                'hacker-white': '#ffffff',
                'hacker-gray': '#111820',
                'hacker-border': '#1a232f',
            },
            fontFamily: {
                mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
                sans: ['Inter', 'Space Grotesk', 'sans-serif'],
            },
            animation: {
                'glow-pulse': 'glow-pulse 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { opacity: 1, filter: 'drop-shadow(0 0 10px rgba(0, 255, 102, 0.4))' },
                    '50%': { opacity: .6, filter: 'drop-shadow(0 0 20px rgba(0, 255, 102, 0.8))' },
                },
                'float': {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            },
        },
    },
    plugins: [],
};
