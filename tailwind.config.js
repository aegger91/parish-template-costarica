import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#eef3f9',
          100: '#d7e2ef',
          200: '#aebfd6',
          300: '#7e95b6',
          400: '#4f6b90',
          500: '#2c4a70',
          600: '#1f3a5c',
          700: '#16304d',
          800: '#122c44',
          900: '#0d2338',
          950: '#081828',
        },
        gold: {
          50: '#fbf7ec',
          100: '#f5ecd2',
          200: '#e9d5a1',
          300: '#ddbd70',
          400: '#d0a246',
          500: '#c08a2d',
          600: '#a56d22',
          700: '#86521e',
          800: '#6b421f',
          900: '#58371c',
        },
        ink: {
          900: '#1c1917',
          700: '#44403c',
          500: '#78716c',
          300: '#d6d3d1',
        },
      },
      backgroundImage: {
        'hero-vladimir': "url('/images/mother-of-god-of-vladimir-559768.jpg')",
      },
    },
  },
  plugins: [],
};

export default config;
