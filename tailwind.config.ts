import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fdfbf7',
          100: '#faf6ee',
          200: '#f5ecdd',
        },
        blush: {
          50: '#fdf5f4',
          100: '#faeae7',
          200: '#f3d6d1',
        },
        rose: {
          50: '#faf1ee',
          100: '#f2ddd6',
          200: '#e3bcb1',
          300: '#cf9587',
          400: '#b8756a',
          500: '#9c5c52',
        },
        sage: {
          50: '#f4f6f2',
          100: '#e6ebe1',
          200: '#cdd8c3',
          400: '#8ba57c',
          500: '#6f8a5f',
        },
        charcoal: {
          50: '#f7f6f5',
          100: '#e9e6e2',
          300: '#a89f96',
          500: '#6b6259',
          700: '#453f39',
          800: '#332e29',
          900: '#241f1c',
        },
      },
      fontFamily: {
        // Bound to the CSS variables next/font/google generates in
        // app/layout.tsx — not literal font-family names, since the fonts
        // are self-hosted/optimized by next/font rather than loaded from a
        // CDN link.
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 2px 20px -4px rgba(69, 63, 57, 0.08)',
        card: '0 4px 28px -6px rgba(69, 63, 57, 0.10)',
        lift: '0 12px 40px -10px rgba(69, 63, 57, 0.16)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
