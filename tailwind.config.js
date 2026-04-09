import forms from '@tailwindcss/forms';
import containerQueries from '@tailwindcss/container-queries';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Premium warm palette — deep navy, cream, gold
        "primary": "#1B2A4A",
        "primary-dim": "#152240",
        "primary-container": "#2A3F6B",
        "on-primary": "#FFFFFF",
        "on-primary-container": "#E8EDF5",
        "on-primary-fixed": "#1B2A4A",
        "on-primary-fixed-variant": "#2A3F6B",
        "primary-fixed": "#D6DEF0",
        "primary-fixed-dim": "#B8C4DC",

        "secondary": "#8B7355",
        "secondary-dim": "#7A6548",
        "secondary-container": "#F5EDE0",
        "on-secondary": "#FFFFFF",
        "on-secondary-container": "#3D3225",
        "on-secondary-fixed": "#3D3225",
        "on-secondary-fixed-variant": "#6B5A42",
        "secondary-fixed": "#F5EDE0",
        "secondary-fixed-dim": "#E8DBC8",

        "tertiary": "#C4973A",
        "tertiary-dim": "#B38830",
        "tertiary-container": "#FFF3D6",
        "on-tertiary": "#FFFFFF",
        "on-tertiary-container": "#3D2E0D",
        "on-tertiary-fixed": "#3D2E0D",
        "on-tertiary-fixed-variant": "#8A6B20",
        "tertiary-fixed": "#FFF3D6",
        "tertiary-fixed-dim": "#F5E4B0",

        "error": "#9f403d",
        "error-dim": "#4e0309",
        "error-container": "#fe8983",
        "on-error": "#fff7f6",
        "on-error-container": "#752121",

        "background": "#FDFBF7",
        "on-background": "#1A1816",
        "surface": "#FDFBF7",
        "surface-dim": "#E8E2D8",
        "surface-bright": "#FFFFFF",
        "surface-variant": "#F0EAE0",
        "on-surface": "#1A1816",
        "on-surface-variant": "#6B635E",
        "outline": "#8A827C",
        "outline-variant": "#D4CCC3",

        "surface-container-lowest": "#FFFFFF",
        "surface-container-low": "#FAF8F5",
        "surface-container": "#F5F0EA",
        "surface-container-high": "#EFE8DF",
        "surface-container-highest": "#E8E0D5",

        "surface-tint": "#1B2A4A",
        "inverse-surface": "#1A1816",
        "inverse-on-surface": "#F5F0EA",
        "inverse-primary": "#B8C4DC",

        // Accent gold
        "gold": "#C4973A",
        "gold-light": "#F5E4B0",
        "gold-dark": "#8A6B20",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
        full: "9999px"
      },
      fontFamily: {
        headline: ["Inter", "Noto Kufi Arabic", "sans-serif"],
        body: ["Inter", "Noto Kufi Arabic", "sans-serif"],
        label: ["Inter", "Noto Kufi Arabic", "sans-serif"],
        arabic: ["Noto Kufi Arabic", "Inter", "sans-serif"],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-left': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulse_glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(196, 151, 58, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(196, 151, 58, 0.6)' },
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.5s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.5s ease-out forwards',
        shimmer: 'shimmer 2s linear infinite',
        float: 'float 3s ease-in-out infinite',
        pulse_glow: 'pulse_glow 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 20s linear infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #1B2A4A 0%, #2A3F6B 50%, #1B2A4A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C4973A 0%, #F5E4B0 50%, #C4973A 100%)',
        'card-gradient': 'linear-gradient(180deg, transparent 0%, rgba(27,42,74,0.8) 100%)',
      }
    },
  },
  plugins: [
    forms,
    containerQueries
  ],
}
