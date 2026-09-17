import type { Config } from 'tailwindcss'

function withOpacity(cssVar: string) {
  return `rgb(var(${cssVar}) / <alpha-value>)`
}

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Each shade is bound to a CSS variable (see app/globals.css) rather
        // than a fixed hex value, so `.dark` on <html> can swap the entire
        // palette to its dark-mode equivalent without touching every
        // component that uses these utility classes.
        cream: {
          50: withOpacity('--color-cream-50'),
          100: withOpacity('--color-cream-100'),
          200: withOpacity('--color-cream-200'),
        },
        blush: {
          50: withOpacity('--color-blush-50'),
          100: withOpacity('--color-blush-100'),
          200: withOpacity('--color-blush-200'),
        },
        rose: {
          50: withOpacity('--color-rose-50'),
          100: withOpacity('--color-rose-100'),
          200: withOpacity('--color-rose-200'),
          300: withOpacity('--color-rose-300'),
          400: withOpacity('--color-rose-400'),
          500: withOpacity('--color-rose-500'),
        },
        sage: {
          50: withOpacity('--color-sage-50'),
          100: withOpacity('--color-sage-100'),
          200: withOpacity('--color-sage-200'),
          400: withOpacity('--color-sage-400'),
          500: withOpacity('--color-sage-500'),
        },
        charcoal: {
          50: withOpacity('--color-charcoal-50'),
          100: withOpacity('--color-charcoal-100'),
          300: withOpacity('--color-charcoal-300'),
          500: withOpacity('--color-charcoal-500'),
          700: withOpacity('--color-charcoal-700'),
          800: withOpacity('--color-charcoal-800'),
          900: withOpacity('--color-charcoal-900'),
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
