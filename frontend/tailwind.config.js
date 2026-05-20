/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C63FF',
          light: '#8F8AFF',
          dark: '#4B42E2',
        },
        secondary: {
          DEFAULT: '#0D9488',
          light: '#14B8A6',
          dark: '#0F766E',
        },
        accent: {
          pink: '#FF4D80',
          pinklight: '#FF7096',
          yellow: '#FBBF24',
          cream: '#FFFDD0',
          nude: '#FAF5F0',
          nudeborder: '#E8DED4',
          blush: '#FBCFE8',
          blushdeep: '#EC4899',
          gold: '#D97706',
        },
        slate: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'premium': '0 10px 30px -10px rgba(108, 99, 255, 0.15)',
        'premium-hover': '0 20px 40px -15px rgba(108, 99, 255, 0.25)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
