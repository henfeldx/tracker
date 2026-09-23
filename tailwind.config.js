/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1F3A',
          claro: '#1E3A5F',
          escuro: '#061325',
        },
        gelo: {
          DEFAULT: '#F4F6FA',
          borda: '#E5E9F2',
          escuro: '#E2E8F0',
        },
        branco: '#FFFFFF',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'suave': '0 4px 20px -2px rgba(11, 31, 58, 0.05), 0 2px 6px -1px rgba(11, 31, 58, 0.03)',
        'card': '0 10px 30px -4px rgba(11, 31, 58, 0.08), 0 4px 8px -2px rgba(11, 31, 58, 0.03)',
      }
    },
  },
  plugins: [],
}
