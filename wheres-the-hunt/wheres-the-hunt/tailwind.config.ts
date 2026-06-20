import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#3D5445',
          dark: '#2A3D32',
          light: '#5A7060',
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
        card: '0 1px 3px rgba(33,29,23,0.07), 0 4px 14px rgba(33,29,23,0.07)',
        'card-hover': '0 4px 12px rgba(33,29,23,0.12), 0 12px 32px rgba(33,29,23,0.09)',
        'card-lg': '0 2px 6px rgba(33,29,23,0.08), 0 8px 24px rgba(33,29,23,0.1)',
        nav: '0 1px 0 rgba(33,29,23,0.12)',
        // kept for lodge shop page
        trail: '3px 3px 0px rgba(33, 29, 23, 0.9)',
        'trail-lg': '6px 6px 0px rgba(33, 29, 23, 0.9)',
      },
      borderRadius: {
        trail: '14px',
        card: '10px',
      },
    },
  },
  plugins: [],
};

export default config;
