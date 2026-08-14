import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        denim: {
          '50': '#eff9ff',
          '100': '#daf1ff',
          '200': '#bde7ff',
          '300': '#90daff',
          '400': '#5cc4fe',
          '500': '#36a8fb',
          '600': '#1f8af1',
          '700': '#1872dd',
          '800': '#1b60bb',
          '900': '#1b4f8d',
          '950': '#153156',
        },
        'cod-gray': {
          '50': '#fafafa',
          '100': '#f5f5f5',
          '200': '#e6e6e6',
          '300': '#d3d3d3',
          '400': '#a3a3a3',
          '500': '#727272',
          '600': '#535353',
          '700': '#404040',
          '800': '#272727',
          '900': '#1a1a1a',
          '950': '#0a0a0a',
        },
      },
      fontFamily: {
        helios: ['var(--font-clash)', 'system-ui', 'sans-serif'],
        clash: ['var(--font-clash)', 'system-ui', 'sans-serif'],
        'clash-medium': ['var(--font-clash-medium)', 'system-ui', 'sans-serif'],
        avenir: ['system-ui', '-apple-system', 'sans-serif'],
        poppins: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
        barlow: ['var(--font-barlow)', 'system-ui', 'sans-serif'],
        gotham: ['var(--font-gotham)', 'system-ui', 'sans-serif'],
        'plus-jakarta': ['var(--font-plus-jakarta)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
        '6xl': '3rem',
      },
      boxShadow: {
        'custom-lg': '14px -14px 10px rgba(116, 126, 255, 0.3)',
        'elevation': '0 4px 20px rgba(0, 0, 0, 0.1)',
        'glass': '0 8px 32px rgba(31, 138, 241, 0.1)',
      },
      animation: {
        'marquee': 'marquee 40s linear infinite',
        'scroll': 'scroll 20s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
