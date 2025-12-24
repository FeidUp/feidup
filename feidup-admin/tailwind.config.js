/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fef7ec',
          100: '#fdecd3',
          200: '#fad5a5',
          300: '#f7b86d',
          400: '#f39333',
          500: '#f0760f',
          600: '#e05a09',
          700: '#ba400b',
          800: '#943310',
          900: '#782c11',
        },
      },
    },
  },
  plugins: [],
}
