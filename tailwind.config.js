/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: {
          50: '#f7f5f2',
          100: '#ede8e0',
          200: '#d9d0c2',
          300: '#b8a994',
          400: '#8a7a64',
          500: '#5f5343',
          600: '#463d31',
          700: '#332c23',
          800: '#221e18',
          900: '#15120e',
          950: '#0d0b08',
        },
        accent: {
          50: '#fef6ee',
          100: '#fce8d4',
          200: '#f8cda6',
          300: '#f3a96e',
          400: '#ee8536',
          500: '#e66a1a',
          600: '#c95212',
          700: '#a43d12',
          800: '#7e2f13',
          900: '#5e2510',
        },
      },
    },
  },
  plugins: [],
};
