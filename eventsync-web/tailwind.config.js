/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./src/pages/*.{js,ts,jsx,tsx}",
        "./src/components/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {
            colors: {
                gold: {
                    400: '#D4AF37',
                    500: '#B89628',
                    600: '#8F741D',
                },
                rich: {
                    black: '#000000',
                    dark: '#0a0a0a',
                    gray: '#121212',
                    border: '#333333',
                }
            },
            boxShadow: {
                'glow': '0 0 15px rgba(212, 175, 55, 0.3)',
            }
        },
    },
    plugins: [],
}
