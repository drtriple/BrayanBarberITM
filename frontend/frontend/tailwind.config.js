/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    400: '#D4A853',
                    500: '#C49A3C',
                    600: '#A07830',
                },
                charcoal: {
                    900: '#0A0A0A',
                    800: '#111111',
                    700: '#1A1A1A',
                    600: '#222222',
                    500: '#2A2A2A',
                }
            },
            fontFamily: {
                display: ['"Playfair Display"', 'Georgia', 'serif'],
                body: ['"DM Sans"', 'sans-serif'],
                mono: ['"JetBrains Mono"', 'monospace'],
            },
        },
    },
    plugins: [],
}