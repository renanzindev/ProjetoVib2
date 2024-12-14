/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00f3ff',
          purple: '#7b2ff7',
          pink: '#f72fbd',
        },
        cyber: {
          dark: '#0a0b1e',
          darker: '#050614',
          light: '#2a2b4a',
        }
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 243, 255, 0.5)',
        'neon-strong': '0 0 30px rgba(0, 243, 255, 0.8)',
        'neon-purple': '0 0 20px rgba(123, 47, 247, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
};