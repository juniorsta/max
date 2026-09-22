/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#a855f7',
          dark: '#7e22ce',
        },
        secondary: {
          DEFAULT: '#3b82f6',
          dark: '#1d4ed8',
        },
        dark: {
          950: '#030712',
          900: '#111827',
        },
      },
    },
  },
  plugins: [],
};