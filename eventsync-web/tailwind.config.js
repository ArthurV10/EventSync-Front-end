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
                // Paleta Dourada
                gold: {
                    400: '#D4AF37', // Dourado Principal (Metallic)
                    500: '#B89628',
                    600: '#8F741D',
                },
                // Paleta Escura Premium
                rich: {
                    black: '#000000',    // Preto absoluto
                    dark: '#0a0a0a',     // Fundo secundário
                    gray: '#121212',     // Cards
                    border: '#333333',   // Bordas sutis
                }
            },
            boxShadow: {
                'glow': '0 0 15px rgba(212, 175, 55, 0.3)', // Brilho dourado
            }
        },
    },
    plugins: [],
}
