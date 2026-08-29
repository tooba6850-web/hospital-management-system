/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          500: '#334e68',
          800: '#102a43',
          900: '#0b1b2b',
        },
        medblue: {
          50: '#ebf8ff',
          100: '#cee7fe',
          500: '#0284c7',
          600: '#026aa7',
          700: '#034b75',
        },
        tealbrand: {
          50: '#f0fdfa',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
        }
      }
    },
  },
  plugins: [],
}
