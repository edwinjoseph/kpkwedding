/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: false,
  theme: {
    fontFamily: {
      heading: ['"Playfair Display"', 'serif'],
      body: ['Montserrat', 'sans-serif'],
    },
    extend: {},
  },
  plugins: [],
}

