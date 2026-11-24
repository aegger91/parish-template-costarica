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
        cream: {
          DEFAULT: 'rgb(var(--color-cream) / <alpha-value>)',
          deep: 'rgb(var(--color-cream-deep) / <alpha-value>)',
        },
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        rule: 'rgb(var(--color-rule) / <alpha-value>)',
      },
      borderRadius: {
        xl: 'var(--radius-inner)',
        '2xl': 'var(--radius-card)',
        pill: 'var(--radius-pill)',
        frame: 'var(--radius-frame)',
      },
      maxWidth: {
        container: 'var(--container-max)',
      },
    },
  },
  plugins: [],
};

export default config;
