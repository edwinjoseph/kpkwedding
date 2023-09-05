/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    fontFamily: {
      heading: ['"Playfair Display"', 'serif'],
      body: ['Montserrat', 'sans-serif'],
    },
    extend: {
      colors: {
        pink: '#D98E92'
      },
      animation: {
        'spin-slow': 'spin 40s linear infinite',
      }
    },
  },
  plugins: [],
}

