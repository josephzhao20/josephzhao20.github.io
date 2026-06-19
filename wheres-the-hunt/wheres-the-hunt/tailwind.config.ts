import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2F5233',
          dark: '#1E3A23',
          light: '#4D7A52',
        },
        earth: {
          DEFAULT: '#8A6240',
          dark: '#5E4128',
          light: '#B68B5F',
        },
        sunset: {
          DEFAULT: '#E2672A',
          dark: '#B84F1C',
          light: '#F2925E',
        },
        cream: {
          DEFAULT: '#FAF3E7',
          dark: '#F0E5D2',
        },
        ink: '#1C1A17',
        ridge: '#C9BFA8',
      },
      fontFamily: {
        display: ['var(--font-fraunces)', 'serif'],
        body: ['var(--font-worksans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        trail: '3px 3px 0px rgba(28, 26, 23, 0.9)',
        'trail-lg': '6px 6px 0px rgba(28, 26, 23, 0.9)',
      },
      borderRadius: {
        trail: '14px',
      },
    },
  },
  plugins: [],
};

export default config;
