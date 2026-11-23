const scale = (name, steps) =>
  Object.fromEntries(steps.map((s) => [s, `rgb(var(--color-${name}-${s}) / <alpha-value>)`]));

const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

/** @type {import('tailwindcss').Config} */
const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)'],
        sans: ['var(--font-sans)'],
        heading: ['var(--font-heading)'],
      },
      colors: {
        primary: scale('primary', STEPS),
        accent: scale('accent', STEPS.slice(0, -1)),
        ink: scale('ink', [900, 700, 500, 300]),
      },
      borderRadius: {
        xl: 'var(--radius-inner)',
        '2xl': 'var(--radius-card)',
        pill: 'var(--radius-pill)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
    },
  },
  plugins: [],
};

export default config;
