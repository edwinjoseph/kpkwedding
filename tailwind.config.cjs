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
        pink: '#D98E92',
        'pink-dark': '#BA7C7F'
      },
      animation: {
        'spin-slow': 'spin 10s linear infinite',
      },
      transitionProperty: {
        height: 'height',
      }
    },
  },
  safelist: [
      'transition-colors'
  ],
  plugins: [],
}

