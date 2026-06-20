import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#2E3D33',
          dark: '#1C2820',
          light: '#4A5F4F',
        },
        earth: {
          DEFAULT: '#7A5C3E',
          dark: '#54402A',
          light: '#9C7A54',
        },
        rust: {
          DEFAULT: '#C9602E',
          dark: '#A14B22',
          light: '#DD8456',
        },
        cream: {
          DEFAULT: '#F6F1E7',
          dark: '#ECE3D0',
        },
        ink: '#211D17',
        stone: '#B8AD98',
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-worksans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      boxShadow: {
        trail: '3px 3px 0px rgba(33, 29, 23, 0.9)',
        'trail-lg': '6px 6px 0px rgba(33, 29, 23, 0.9)',
      },
      borderRadius: {
        trail: '14px',
      },
    },
  },
  plugins: [],
};

export default config;
