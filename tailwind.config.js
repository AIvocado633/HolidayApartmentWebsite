/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#fdf8f0',
          dark: '#f5ede0',
        },
        beige: {
          DEFAULT: '#e8dcc8',
          light: '#f5efe3',
          dark: '#d4c4a8',
        },
        'slate-text': '#1e293b',
        accent: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          muted: '#334155',
        },
        warm: {
          50: '#fdf8f0',
          100: '#f5efe3',
          200: '#e8dcc8',
          300: '#d4c4a8',
          400: '#b8a07a',
          500: '#9a7f5a',
          600: '#7c6040',
          700: '#5e4530',
          800: '#3d2d1e',
          900: '#1e160d',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Georgia', 'serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #fdf8f0 0%, #f5efe3 50%, #e8dcc8 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
