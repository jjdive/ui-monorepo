/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './packages/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      ...colors,
      brand: colors.emerald,
    },
    extend: {},
  },
  plugins: [],
}
